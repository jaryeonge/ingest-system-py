import json
from typing import Tuple, Union

from ingest.config import ProcessConfig
from ingest.client import *
from ingest.filter import *
from mongo import SinceMongo
from utils.exception import NotFoundColumnException, ElasticsearchConnectionException, IllegalConfigArgException
from utils.spawn_logger import is_logger


class Process:
    def __init__(self, config: ProcessConfig):
        self.config = config
        self.logger = is_logger()
        self._spawn_clients()
        self.geoip_filter = GeoipFilter()
        if self.config.input.since != '':
            self.use_since = True
            self.since_mongo = SinceMongo()
            self.since_mongo.create_since(self.config.name)
        else:
            self.use_since = False

    def _spawn_clients(self):
        if self.config.input_type == 'elasticsearch':
            self.input_client = ESClient(self.config.input)
        elif self.config.input_type == 'mssql':
            self.input_client = MssqlClient(self.config.input)
        elif self.config.input_type == 'mysql':
            self.input_client = MysqlClient(self.config.input)
        else:
            raise IllegalConfigArgException('input_type')

        if self.config.output_type == 'elasticsearch':
            self.output_client = ESClient(self.config.output)
        else:
            raise IllegalConfigArgException('output_type')

    def load_data(self) -> callable:
        if self.config.input_type == 'elasticsearch':
            bool_query = json.loads(self.config.input.query)
            if self.use_since:
                query = {
                    'query': {
                        'bool': {
                            'must': [
                                {
                                    bool_query
                                },
                                {
                                    'bool': {
                                        'must': [
                                            {
                                                'range': {
                                                    self.config.input.since: {
                                                        'gt': self.since_mongo.get_since(self.config.name)
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            else:
                query = {
                    'query': {
                        bool_query
                    }
                }
        elif self.config.input_type == 'mssql' or self.config.input_type == 'mysql':
            if self.use_since:
                query = f"SELECT a.* FROM ({self.config.input.query}) a WHERE a.{self.config.input.since} > '{self.since_mongo.get_since(self.config.name)}' ORDER BY a.{self.config.input.since}"
            else:
                query = self.config.input.query
        else:
            raise IllegalConfigArgException('input_type')

        return self.input_client.make_generator(query)

    def transform_data(self, data: dict) -> Tuple[Union[str, int], dict, dict, str]:
        script = {
            'source': '',
            'lang': 'painless',
            'params': {}
        }
        upsert = {}

        for each_mapping in self.config.mapping:
            input_name = each_mapping['input_name']
            output_name = each_mapping['output_name']
            splitter = each_mapping['splitter']

            if input_name not in list(data.keys()):
                raise NotFoundColumnException(input_name)

            if data[input_name] is None:
                value = None

            elif splitter == '':
                if each_mapping.get('type') == 'boolean':
                    value = bool(data[input_name])
                elif each_mapping.get('type') == 'keyword' or each_mapping.get('type') == 'text':
                    value = str(data[input_name])
                elif each_mapping.get('type') == 'numeric':
                    value = data[input_name]
                elif each_mapping.get('type') == 'date':
                    value = date_filtering(data[input_name])
                else:
                    value = self.geoip_filter.filtering(data[input_name])

            else:
                split_data = str(data.get(input_name)).split(splitter)
                value = []
                for each_data in split_data:
                    if each_mapping.get('type') == 'boolean':
                        value.append(bool(each_data))
                    elif each_mapping.get('type') == 'keyword' or each_mapping.get('type') == 'text':
                        value.append(str(each_data))
                    elif each_mapping.get('type') == 'numeric':
                        value.append(each_data)
                    elif each_mapping.get('type') == 'date':
                        value.append(date_filtering(each_data))
                    else:
                        value.append(self.geoip_filter.filtering(each_data))

            script['source'] += f'ctx._source.{output_name} = params.{output_name};'
            script['params'].__setitem__(output_name, value)
            upsert.__setitem__(output_name, value)

        doc_id = upsert[self.config.output.id_column]
        if self.use_since:
            since_idx = data[self.config.input.since]
        else:
            since_idx = None
        return doc_id, script, upsert, since_idx

    def index_data(self):
        since_idx = None
        try:
            input_data = self.load_data()
            for data in input_data:
                doc_id, script, upsert, since_idx = self.transform_data(data)
                result, error = self.output_client.update_data(doc_id, script, upsert)
                if not result:
                    self.logger.error(f'{self.config.name}: {error}')
            if self.use_since:
                if since_idx is not None:
                    self.since_mongo.update_since(self.config.name, since_idx)
        except Exception as e:
            self.logger.error(f'{self.config.name}: {e}')
        finally:
            if self.use_since:
                if since_idx is not None:
                    self.since_mongo.update_since(self.config.name, since_idx)

    def test(self) -> list:
        input_data = self.load_data()
        test_result = []
        i = 0
        for data in input_data:
            if i > 9:
                break
            doc_id, script, upsert, since_idx = self.transform_data(data)
            test_result.append(str(upsert))
            i += 1

        connection_test = self.output_client.check_ping()
        if not connection_test:
            raise ElasticsearchConnectionException

        return test_result

    def close_clients(self):
        try:
            self.input_client.close_connection()
        except Exception as e:
            self.logger.error(f'{self.config.name}: {e}')
        try:
            self.output_client.close_connection()
        except Exception as e:
            self.logger.error(f'{self.config.name}: {e}')
        if self.use_since:
            try:
                self.since_mongo.close_connection()
            except Exception as e:
                self.logger.error(f'{self.config.name}: {e}')


def process_wrapper(config: ProcessConfig):
    process = Process(config)
    process.index_data()
    process.close_clients()


def test_wrapper(config: ProcessConfig) -> list:
    try:
        process = Process(config)
        result = process.test()
        process.close_clients()
        return result
    except Exception as e:
        return [e.__str__()]
