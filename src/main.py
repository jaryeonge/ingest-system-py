from fastapi import FastAPI, Depends

import sys
sys.path.insert(0, '/src')

from routers import security_router, config_router, process_router, since_router, test_router
from routers.security_router import request_filter

app = FastAPI()
app.include_router(security_router.router)
app.include_router(
    config_router.router,
    dependencies=[Depends(request_filter)]
)
app.include_router(
    process_router.router,
    dependencies=[Depends(request_filter)]
)
app.include_router(
    since_router.router,
    dependencies=[Depends(request_filter)]
)
app.include_router(
    test_router.router,
    dependencies=[Depends(request_filter)]
)
