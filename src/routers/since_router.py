from fastapi import APIRouter, HTTPException

from mongo import SinceMongo
from dto import ConfigNameDto

router = APIRouter()
router.mongo_client = SinceMongo()


@router.get('/is/since')
def since_home():
    return 'since api'


@router.post('/is/since/list')
async def list_since():
    try:
        return router.mongo_client.list_since()

    except Exception as e:
        raise HTTPException(status_code=400, detail=e.__str__())


@router.post('/is/since/reset')
async def reset_since(body: ConfigNameDto):
    try:
        router.mongo_client.delete_since(body.name)
        return f"process {body.name}'s since is reset"

    except Exception as e:
        raise HTTPException(status_code=400, detail=e.__str__())


@router.post('/is/since/reset-all')
async def reset_all_since():
    router.mongo_client.delete_all()
    return "all of since are reset"
