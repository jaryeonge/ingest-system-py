from pymongo import MongoClient

from properties import MONGO_URL
from ingest.config import ProcessConfig
from utils.exception import NotFoundConfigException, DuplicateConfigException
from utils.uuid_generator import uuid_from_keyword


class ConfigMongo:
    def __init__(self):
        self.client = MongoClient(MONGO_URL)
        self.db = self.client['is']
        self.collection = 'config'

    def create_config(self, config: ProcessConfig):
        pre_config = self.db[self.collection].find_one({'name': config.name})
        if pre_config is not None:
            raise DuplicateConfigException(config.name)

        config_dict = config.config_to_dict()
        config_dict.__setitem__('_id', uuid_from_keyword(config.name))
        self.db[self.collection].insert_one(config_dict)

    def update_config(self, config: ProcessConfig):
        pre_config = self.db[self.collection].find_one({'name': config.name})
        if pre_config is None:
            raise NotFoundConfigException(config.name)

        pre_id = pre_config.get('_id')

        self.db[self.collection].delete_one({'name': config.name})

        config_dict = config.config_to_dict()
        config_dict.__setitem__('_id', pre_id)

        self.db[self.collection].insert_one(config_dict)

    def delete_config(self, name: str):
        pre_config = self.db[self.collection].find_one({'name': name})
        if pre_config is None:
            raise NotFoundConfigException(name)

        self.db[self.collection].delete_one({'name': name})

    def delete_all(self):
        self.db[self.collection].delete_many({})

    def check_config(self, name: str) -> dict:
        config = self.db[self.collection].find_one({'name': name})
        if config is None:
            raise NotFoundConfigException(name)

        return config

    def list_config(self) -> list:
        return list(self.db[self.collection].find({}))

    def close_connection(self):
        self.client.close()
