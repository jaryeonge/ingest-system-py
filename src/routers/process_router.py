from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.pool import ThreadPoolExecutor, ProcessPoolExecutor
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.date import DateTrigger
from datetime import datetime
from fastapi import APIRouter, HTTPException

from ingest.config import ProcessConfig
from ingest.process import process_wrapper
from mongo import ConfigMongo
from dto import ConfigNameDto
from utils.spawn_logger import is_logger
from properties import THREAD_POOL_EXECUTOR_CNT, PROCESS_POOL_EXECUTOR_CNT, COALESCE, MAX_INSTANCES

router = APIRouter()
router.mongo_client = ConfigMongo()
router.logger = is_logger()

jobstores = {
    'memory': MemoryJobStore()
}
executors = {
    'default': ThreadPoolExecutor(THREAD_POOL_EXECUTOR_CNT),
    'processpool': ProcessPoolExecutor(PROCESS_POOL_EXECUTOR_CNT)
}
job_defaults = {
    'coalesce': COALESCE,
    'max_instances': MAX_INSTANCES
}

router.scheduler = BackgroundScheduler(jobstores=jobstores, executors=executors, job_defaults=job_defaults)
router.scheduler.start()
router.job_dict = {}


@router.get('/is/process')
def process_home():
    return 'process api'


@router.post('/is/process/start')
async def start_process(body: ConfigNameDto):
    try:
        if router.job_dict.get(body.name) == 'run':
            raise HTTPException(status_code=400, detail=f'Process {body.name} is already started')

        document = router.mongo_client.check_config(body.name)
        config = ProcessConfig(**document)

        if config.cron == '':
            router.scheduler.add_job(func=process_wrapper, args=[config], id=config.name,
                                     trigger=DateTrigger(run_date=datetime.now()), jobstore='memory')
            router.job_dict.__setitem__(config.name, 'complete')
        else:
            router.scheduler.add_job(func=process_wrapper, args=[config], id=config.name,
                                     trigger=CronTrigger(**config.cron), jobstore='memory')
            router.job_dict.__setitem__(config.name, 'run')

        return f'Process {body.name} starts'

    except Exception as e:
        raise HTTPException(status_code=400, detail=e.__str__())


@router.post('/is/process/start-all')
async def start_all_process():
    try:
        document_list = router.mongo_client.list_config()
        for document in document_list:
            config = ProcessConfig(**document)

            if config.cron == '':
                router.scheduler.add_job(func=process_wrapper, args=[config], id=config.name,
                                         trigger=DateTrigger(run_date=datetime.now()), jobstore='memory')
                router.job_dict.__setitem__(config.name, 'complete')
            else:
                router.scheduler.add_job(func=process_wrapper, args=[config], id=config.name,
                                         trigger=CronTrigger(**config.cron), jobstore='memory')
                router.job_dict.__setitem__(config.name, 'run')

        return 'all of process start'

    except Exception as e:
        raise HTTPException(status_code=400, detail=e.__str__())


@router.post('/is/process/stop')
async def stop_process(body: ConfigNameDto):
    try:
        router.scheduler.remove_job(job_id=body.name, jobstore='memory')
        router.job_dict.pop(body.name)
    except Exception as e:
        router.logger.warn(e)
    return f'Process {body.name} stops'


@router.post('/is/process/stop-all')
async def stop_all_process():
    config_list = router.mongo_client.list_config()
    for config in config_list:
        try:
            router.scheduler.remove_job(job_id=config['name'], jobstore='memory')
        except Exception as e:
            router.logger.warn(e)
    router.job_dict.clear()
    return 'all of process stop'


@router.post('/is/process/status')
async def process_status():
    status_list = []

    for k, v in router.job_dict.items():
        status_list.append({'name': k, 'status': v})

    return status_list
