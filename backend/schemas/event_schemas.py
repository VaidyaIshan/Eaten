from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from uuid import UUID

class EventRegister(BaseModel):
    name: str
    description: str
    start_date: date
    end_date: date
    picture: str

class EventResponse(BaseModel):
    id: UUID
    name: str
    description: str
    start_date: date
    end_date: date
    is_active: bool
    created_at: datetime
    updated_at: datetime
    picture: str

    class Config:
        from_attributes = True
