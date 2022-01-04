from fastapi import APIRouter, HTTPException

from ingest.config import ProcessConfig
from mongo import ConfigMongo
from dto import ConfigDto, ConfigNameDto

router = APIRouter()
router.mongo_client = ConfigMongo()


@router.get('/is/config')
def config_home():
    return 'config api'


@router.post('/is/config/create')
async def create_config(body: ConfigDto):
    try:
        config = ProcessConfig(
            name=body.name,
            cron=body.cron,
            input_type=body.input_type,
            input=body.input,
            output_type=body.output_type,
            output=body.output,
            mapping=body.mapping,
        )
        router.mongo_client.create_config(config)
        return f'Process {body.name} is created'

    except Exception as e:
        raise HTTPException(status_code=400, detail=e.__str__())


@router.post('/is/config/delete')
async def delete_config(body: ConfigNameDto):
    try:
        router.mongo_client.delete_config(body.name)
        return f'Process {body.name} is deleted'

    except Exception as e:
        raise HTTPException(status_code=400, detail=e.__str__())


@router.post('/is/config/delete-all')
async def delete_all_config():
    router.mongo_client.delete_all()
    return 'all of process are deleted'


@router.post('/is/config/update')
async def update_config(body: ConfigDto):
    try:
        config = ProcessConfig(
            name=body.name,
            cron=body.cron,
            input_type=body.input_type,
            input=body.input,
            output_type=body.output_type,
            output=body.output,
            mapping=body.mapping,
        )
        router.mongo_client.update_config(config)
        return f'Process {body.name} is updated'

    except Exception as e:
        raise HTTPException(status_code=400, detail=e.__str__())


@router.post('/is/config/check')
async def check_config(body: ConfigNameDto):
    try:
        return [router.mongo_client.check_config(body.name)]

    except Exception as e:
        raise HTTPException(status_code=400, detail=e.__str__())


@router.post('/is/config/list')
async def list_config():
    try:
        return router.mongo_client.list_config()

    except Exception as e:
        raise HTTPException(status_code=400, detail=e.__str__())
