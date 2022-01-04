from abc import ABC


class BaseClientConfig(ABC):

    def get_connection_config(self):
        raise NotImplementedError

    def get_input_config(self):
        raise NotImplementedError

    def get_output_config(self):
        raise NotImplementedError
