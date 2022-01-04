import uuid


def uuid_from_keyword(keyword: str) -> str:
    uuid_namespace = uuid.NAMESPACE_DNS
    return uuid.uuid5(namespace=uuid_namespace, name=keyword).__str__()
