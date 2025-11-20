from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db import get_db
from schemas.meal_sessions_schemas import MealSessionRegister, MealSessionResponse
from services.meal_sessions import create_meal_session, delete_meal_session
import uuid
from sqlalchemy.dialects.postgresql import UUID

router = APIRouter(prefix="/mealsession")

@router.post("/create", response_model = MealSessionResponse)
def meal_session_create(event_name: str, meal_session_data: MealSessionRegister, db: Session = Depends(get_db)):
    return create_meal_session(event_name, meal_session_data, db)

@router.delete("/delete")
def meal_session_delete(meal_id: uuid.UUID, db: Session = Depends(get_db)):
    return delete_meal_session(meal_id, db)

