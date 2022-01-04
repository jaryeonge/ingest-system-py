from pydantic import BaseModel


class UserDto(BaseModel):
    username: str
    password: str


class RefreshTokenDto(BaseModel):
    accessToken: str
    refreshToken: str
