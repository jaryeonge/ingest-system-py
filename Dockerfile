FROM python:3.9

ENV PYTHONUNBUFFERED 0

WORKDIR /
COPY ./requirements.txt ./
COPY ./src /src
COPY ./logs /logs

RUN pip install --upgrade pip && pip install -r /requirements.txt

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "9090", "--log-config", "src/logging.yaml"]