from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserRegister(BaseModel):
    username: str
    password: str
    email: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: UUID
    username: str
    email: Optional[str]
    role_id: int
    created_at: datetime
    updated_at: datetime
    qr_code: Optional[str] = None
    is_active: bool
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type:str

class TokenReponse(UserResponse):
    pass