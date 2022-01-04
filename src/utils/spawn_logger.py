import logging.config
import yaml

from properties import LOGGING_CONFIG_PATH


def is_logger():
    with open(LOGGING_CONFIG_PATH, 'r') as stream:
        config = yaml.load(stream, Loader=yaml.FullLoader)
        logging.config.dictConfig(config)
        return logging.getLogger(__name__)
