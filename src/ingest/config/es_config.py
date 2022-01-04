from .base_config import BaseClientConfig


class ESConfig(BaseClientConfig):
    def __init__(
            self,
            host: str,
            port: int,
            username: str,
            password: str,
            index: str,
            query: str = '',
            since: str = '',
            id_column: str = '',
    ):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.index = index
        self.query = query
        self.since = since
        self.id_column = id_column

    def get_connection_config(self) -> dict:
        return {
            'host': self.host,
            'port': self.port,
            'http_auth': [self.username, self.password],
        }

    def get_input_config(self) -> dict:
        return {
            'host': self.host,
            'port': self.port,
            'username': self.username,
            'password': self.password,
            'since': self.since,
            'index': self.index,
        }

    def get_output_config(self) -> dict:
        return {
            'host': self.host,
            'port': self.port,
            'username': self.username,
            'password': self.password,
            'index': self.index,
            'id_column': self.id_column,
        }
