from .base_config import BaseClientConfig


class RDBConfig(BaseClientConfig):
    def __init__(
            self,
            host: str,
            port: int,
            username: str,
            password: str,
            database: str,
            query: str,
            since: str,
    ):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.database = database
        self.query = query
        self.since = since

    def get_connection_config(self) -> dict:
        return {
            'host': self.host,
            'port': self.port,
            'user': self.username,
            'password': self.password,
            'database': self.database,
        }

    def get_input_config(self) -> dict:
        return {
            'host': self.host,
            'port': self.port,
            'username': self.username,
            'password': self.password,
            'database': self.database,
            'query': self.query,
            'since': self.since,
        }

    def get_output_config(self):
        raise NotImplementedError
