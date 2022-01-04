# ingest-system-py

RDB, Elasticsearch DATA ----> RDB(this version not support), Elasticsearch

## bin - for linux
        sudo ./bin/init

## start
        ingest-system-py start

http://localhost:9080

## config
- name: process name
- cron: Cron scheduling (ex - always: '* * * * *' / only run once: '')
- input_type: Type of data source
- input:
    - host
    - port
    - username
    - password
    - since: This makes it possible to have it pick up where it left off without missing the lines that were added to the file while ingest-system-py was stopped.
    - index or database
- output_type: type of data destination
- output:
    - host
    - port
    - username
    - password
    - id_column: Document id
    - index
- mapping:
    - input_name
    - output_name
    - type: Elasticsearch ('boolean', 'date', 'geoip', 'keyword', 'numeric', 'text')
    - splitter: This make it possible to split data by this character