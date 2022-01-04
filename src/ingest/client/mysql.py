import pymysql
from pymysql.cursors import SSDictCursor

from .base_client import BaseClient
from ingest.config import RDBConfig
from properties import RDB_FETCH_SIZE


class MysqlClient(BaseClient):
    def __init__(self, config: RDBConfig):
        self.config = config
        self.conn = pymysql.connect(**config.get_connection_config())

    def close_connection(self):
        self.conn.close()

    def make_generator(self, query: str) -> callable:
        curs = SSDictCursor(self.conn)
        curs.execute(query)

        def generator_function():
            while True:
                buffer = curs.fetchmany(RDB_FETCH_SIZE)
                if not buffer:
                    break
                for row in buffer:
                    yield row

        return generator_function()

    def update_data(self, *args, **kwargs):
        raise NotImplementedError
