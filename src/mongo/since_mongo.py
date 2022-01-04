from pymongo import MongoClient

from properties import MONGO_URL
from utils.uuid_generator import uuid_from_keyword


class SinceMongo:
    def __init__(self):
        self.client = MongoClient(MONGO_URL)
        self.db = self.client['is']
        self.collection = 'since'

    def create_since(self, name: str):
        pre_since = self.db[self.collection].find_one({'name': name})
        if pre_since is not None:
            return None

        since_dict = {
            'name': name,
            'since': '0',
        }
        since_dict.__setitem__('_id', uuid_from_keyword(name))
        self.db[self.collection].insert_one(since_dict)

    def update_since(self, name: str, since_idx: str):
        pre_since = self.db[self.collection].find_one({'name': name})
        if pre_since is None:
            self.create_since(name)
            pre_since = self.db[self.collection].find_one({'name': name})

        pre_id = pre_since.get('_id')

        self.db[self.collection].delete_one({'name': name})

        since_dict = {
            'name': name,
            'since': since_idx,
        }
        since_dict.__setitem__('_id', pre_id)

        self.db[self.collection].insert_one(since_dict)

    def delete_since(self, name: str):
        pre_since = self.db[self.collection].find_one({'name': name})
        if pre_since is None:
            return

        self.db[self.collection].delete_one({'name': name})

    def delete_all(self):
        self.db[self.collection].delete_many({})

    def get_since(self, name: str) -> str:
        since = self.db[self.collection].find_one({'name': name})
        if since is None:
            return '0'

        return since['since']

    def list_since(self) -> list:
        return list(self.db[self.collection].find({}))

    def close_connection(self):
        self.client.close()
