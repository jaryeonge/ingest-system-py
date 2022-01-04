from typing import Union, Tuple
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan

from .base_client import BaseClient
from ingest.config import ESConfig


class ESClient(BaseClient):
    def __init__(self, config: ESConfig):
        self.config = config
        self.es = Elasticsearch(**self.config.get_connection_config())

    def close_connection(self):
        self.es.close()

    def check_ping(self) -> bool:
        return self.es.ping()

    def make_generator(self, query: dict):
        scan_gen = scan(self.es, query=query)
        for data in scan_gen:
            yield data['_source']

    def update_data(self, doc_id: Union[str, int], script: dict, upsert: dict) -> Tuple[bool, str]:
        try:
            response = self.es.update(index=self.config.index, id=doc_id, script=script, upsert=upsert, retry_on_conflict=3)
            if response.get('result') == 'created' or response.get('result') == 'updated':
                return True, ''
            else:
                return False, str(response)
        except Exception as e:
            return False, str(e)
