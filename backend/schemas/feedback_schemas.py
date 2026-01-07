from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class FeedbackAdd(BaseModel):
    review: str
    username:str

class FeedbackResponse(BaseModel):
    id: UUID
    response: str
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True  


class GetAllFeedback(BaseModel):
    id: UUID
    response: str
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
