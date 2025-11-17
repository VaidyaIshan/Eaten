from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RoleCreate(BaseModel):
    id: int
    name: str
    description: str

class RoleSchema(BaseModel):
    id: int 
    name: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True
