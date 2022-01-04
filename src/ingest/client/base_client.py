from abc import ABC


class BaseClient(ABC):
    def close_connection(self):
        raise NotImplementedError

    def make_generator(self, query):
        raise NotImplementedError

    def update_data(self, *args, **kwargs):
        raise NotImplementedError
