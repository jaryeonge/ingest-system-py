from fastapi import APIRouter

from ingest.config import ProcessConfig
from ingest.process import test_wrapper
from mongo import ConfigMongo
from dto import ConfigNameDto

router = APIRouter()
router.mongo_client = ConfigMongo()


@router.get('/is/test')
def test_home():
    return 'test api'


@router.post('/is/test/process')
async def test_process(body: ConfigNameDto):
    try:
        document = router.mongo_client.check_config(body.name)
        config = ProcessConfig(**document)

        result = test_wrapper(config)
    except Exception as e:
        result = [e.__str__()]

    return result
