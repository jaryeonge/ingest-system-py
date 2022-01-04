class IllegalConfigArgException(Exception):
    def __init__(self, arg_name: str):
        self.arg_name = arg_name

    def __str__(self):
        return f'Config arg "{self.arg_name}" is not valid'


class DuplicateConfigArgException(Exception):
    def __init__(self, arg_name: str):
        self.arg_name = arg_name

    def __str__(self):
        return f'Config arg "{self.arg_name}" is duplicate'


class NotFoundConfigException(Exception):
    def __init__(self, config_name: str):
        self.config_name = config_name

    def __str__(self):
        return f'Config "{self.config_name}" is not found'


class DuplicateConfigException(Exception):
    def __init__(self, config_name: str):
        self.config_name = config_name

    def __str__(self):
        return f'Config "{self.config_name}" is duplicate'


class NotFoundColumnException(Exception):
    def __init__(self, column_name: str):
        self.column_name = column_name

    def __str__(self):
        return f'Column "{self.column_name}" is not found'


class ElasticsearchConnectionException(Exception):
    def __str__(self):
        return 'Fail to connect to elasticsearch'


class ExpiredTokenException(Exception):
    def __str__(self):
        return 'Token has expired'
