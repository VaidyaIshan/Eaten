from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserOut(BaseModel):
    id: int
    username: str
    email: Optional[str]
    role_id: int
    created_at: datetime
    updated_at: datetime
    qr_code: Optional[str] = None
    
    class Config:
       from_attributes = True

class UserRoleUpdate(BaseModel):
    message: str
    user: UserOut
