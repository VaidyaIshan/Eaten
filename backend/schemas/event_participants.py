from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ParticipantCreate(BaseModel):
    event_id: UUID
    user_id: UUID

class ParticipantResponse(BaseModel):
    id: UUID
    event_id: UUID
    user_id: UUID
    register_at: datetime

    class Config:
        from_attributes = True
