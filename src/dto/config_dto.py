from pydantic import BaseModel


class ConfigDto(BaseModel):
    name: str
    cron: str
    input_type: str
    input: dict
    output_type: str
    output: dict
    mapping: list


class ConfigNameDto(BaseModel):
    name: str
