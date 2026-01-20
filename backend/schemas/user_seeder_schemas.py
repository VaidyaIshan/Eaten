from pydantic import BaseModel
from typing import List, Optional

class SeededUserResponse(BaseModel):
    id: str
    username: str
    email: str
    role_id: int
    is_active: bool

class FailedUserResponse(BaseModel):
    row: int
    username: str
    error: str

class UserSeederResponse(BaseModel):
    total_rows: int
    created_users: int
    failed_users: int
    created_users_list: List[SeededUserResponse]
    failed_users_list: List[FailedUserResponse]
    message: str
