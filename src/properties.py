from datetime import timedelta

# auth
ADMIN_USER = 'username'
ADMIN_PASSWORD = 'changeme'
SECRET = 'yoursecret'
ALGORITHM = 'HS512'
ACCESS_TOKEN_VALID = timedelta(hours=1)
REFRESH_TOKEN_VALID = timedelta(hours=24)

# rdb
RDB_FETCH_SIZE = 1000

# path
GEOIP_DB_PATH = '/src/ingest/filter/GeoLite2-City_20210824/GeoLite2-City.mmdb'
LOGGING_CONFIG_PATH = '/src/logging.yaml'

# mongo
MONGO_URL = f'mongodb://{ADMIN_USER}:{ADMIN_PASSWORD}@is-mongodb-py:27017'

# apscheduler
THREAD_POOL_EXECUTOR_CNT = 64
PROCESS_POOL_EXECUTOR_CNT = 8
COALESCE = False
MAX_INSTANCES = 1
