from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class FoodClaimCreate(BaseModel):
    username: str 
    meal_type: str
    event_name: str

class FoodClaimResponse(BaseModel):
    id: UUID
    user_id: UUID
    meal_session_id: UUID
    event_id: UUID
    claimed_at: datetime
    is_claimed: bool

    class Config:
        from_attributes = True
