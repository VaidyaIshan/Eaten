from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class EventRegister(BaseModel):
    name: str
    description: str
    start_date: datetime
    end_date: datetime

class EventResponse(BaseModel):
    id: UUID
    name: str
    description: str
    start_date: datetime
    end_date: datetime
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
