import jwt
from datetime import datetime
from fastapi import APIRouter, HTTPException, Request

from properties import ADMIN_USER, ADMIN_PASSWORD, SECRET, ALGORITHM, ACCESS_TOKEN_VALID, REFRESH_TOKEN_VALID
from dto import UserDto, RefreshTokenDto
from utils.exception import ExpiredTokenException

router = APIRouter()


def create_token(username: str):
    access = {
        'username': username,
        'exp': datetime.utcnow() + ACCESS_TOKEN_VALID,
    }
    refresh = {
        'username': username,
        'exp': datetime.utcnow() + REFRESH_TOKEN_VALID,
    }

    access_token = jwt.encode(payload=access, key=SECRET, algorithm=ALGORITHM)
    refresh_token = jwt.encode(payload=refresh, key=SECRET, algorithm=ALGORITHM)
    return access_token.decode('utf-8'), refresh_token.decode('utf-8')


def validate_token(token: str) -> bool:
    try:
        byte_token = token.encode('utf-8')
        payload = jwt.decode(jwt=byte_token, key=SECRET, algorithms=ALGORITHM)

        return payload.get('username') == ADMIN_USER
    except jwt.exceptions.ExpiredSignatureError:
        raise ExpiredTokenException


def get_username(token: str) -> str:
    byte_token = token.encode('utf-8')
    payload = jwt.decode(jwt=byte_token, key=SECRET, algorithms=ALGORITHM)
    return payload.get('username')


async def request_filter(request: Request):
    token = str(request.headers.get('Authorization'))
    if not token.startswith('Bearer '):
        raise HTTPException(status_code=403, detail='token is not bearer type')

    try:
        token = token.replace('Bearer ', '')
        validation = validate_token(token)
    except ExpiredTokenException:
        raise HTTPException(status_code=401, detail='token has expired')

    if not validation:
        raise HTTPException(status_code=403, detail='Unauthorized')


@router.post('/is/security/authenticate')
async def login(body: UserDto):
    if body.username == ADMIN_USER and body.password == ADMIN_PASSWORD:
        access_token, refresh_token = create_token(body.username)
        return {'accessToken': access_token, 'refreshToken': refresh_token}
    else:
        raise HTTPException(status_code=403, detail='Unauthorized')


@router.post('/is/security/reissue')
async def reissue(body: RefreshTokenDto):
    try:
        validation = validate_token(body.refreshToken)
    except ExpiredTokenException:
        raise HTTPException(status_code=403, detail='token has expired')

    if not validation:
        raise HTTPException(status_code=403, detail='Unauthorized')

    username = get_username(body.refreshToken)
    access_token, refresh_token = create_token(username)
    return {'accessToken': access_token, 'refreshToken': refresh_token}
