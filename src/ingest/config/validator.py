from typing import Union

from .es_config import ESConfig
from .rdb_config import RDBConfig
from utils.exception import IllegalConfigArgException, DuplicateConfigArgException


def validate_type(name: str, value, type_name: str):
    if type_name == 'str':
        if type(value) != str:
            raise IllegalConfigArgException(name)
    elif type_name == 'int':
        if type(value) != int:
            raise IllegalConfigArgException(name)
    elif type_name == 'es_output':
        if value not in ['boolean', 'date', 'geoip', 'keyword', 'numeric', 'text']:
            raise IllegalConfigArgException(name)


def validate_cron(cron: str) -> Union[str, dict]:
    if cron == '':
        return cron
    arg_list = cron.split(' ')
    if len(arg_list) != 5:
        raise IllegalConfigArgException('cron')
    return {
        'minute': arg_list[0],
        'hour': arg_list[1],
        'day': arg_list[2],
        'month': arg_list[3],
        'day_of_week': arg_list[4],
    }


def validate_input(input_type: str, input_config: dict) -> Union[ESConfig, RDBConfig]:
    if input_type == 'elasticsearch':
        validate_type('host', input_config.get('host'), 'str')
        validate_type('port', input_config.get('port'), 'int')
        validate_type('username', input_config.get('username'), 'str')
        validate_type('password', input_config.get('password'), 'str')
        validate_type('index', input_config.get('index'), 'str')
        validate_type('query', input_config.get('query'), 'str')
        validate_type('since', input_config.get('since'), 'str')
        return ESConfig(**input_config)
    elif input_type == 'mysql' or input_type == 'mssql':
        validate_type('host', input_config.get('host'), 'str')
        validate_type('port', input_config.get('port'), 'int')
        validate_type('username', input_config.get('username'), 'str')
        validate_type('password', input_config.get('password'), 'str')
        validate_type('database', input_config.get('database'), 'str')
        validate_type('query', input_config.get('query'), 'str')
        validate_type('since', input_config.get('since'), 'str')
        return RDBConfig(**input_config)
    else:
        raise IllegalConfigArgException('input_type')


def validate_output(output_type: str, output_config: dict) -> ESConfig:
    if output_type == 'elasticsearch':
        validate_type('host', output_config.get('host'), 'str')
        validate_type('port', output_config.get('port'), 'int')
        validate_type('username', output_config.get('username'), 'str')
        validate_type('password', output_config.get('password'), 'str')
        validate_type('index', output_config.get('index'), 'str')
        validate_type('id_column', output_config.get('id_column'), 'str')
        return ESConfig(**output_config)
    else:
        raise IllegalConfigArgException('input_type')


def validate_mapping(mapping: list) -> list:
    input_name_list = []
    output_name_list = []
    for each_map in mapping:
        validate_type('input_name', each_map.get('input_name'), 'str')
        if each_map.get('input_name') in [input_name_list]:
            raise DuplicateConfigArgException('input_name')
        input_name_list.append(each_map.get('input_name'))

        validate_type('output_name', each_map.get('output_name'), 'str')
        if each_map.get('output_name') in [output_name_list]:
            raise DuplicateConfigArgException('output_name')
        output_name_list.append(each_map.get('output_name'))

        validate_type('type', each_map.get('type'), 'es_output')
        validate_type('splitter', each_map.get('splitter'), 'str')

    return mapping
