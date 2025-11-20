from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class MealSessionRegister(BaseModel):
    meal_type: str
    start_time: datetime
    end_time: datetime
    total_capacity: int

class MealSessionResponse(BaseModel):
    id: UUID
    event_id: UUID
    meal_type: str
    start_time: datetime
    end_time: datetime
    is_active: bool
    total_capacity: int
    created_at: datetime
    updated_at: datetime

    class Config:

        from_attributes = True
