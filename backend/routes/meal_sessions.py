from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db import get_db
from schemas.meal_sessions_schemas import MealSessionRegister, MealSessionResponse, MealSessionUpdate
from services.meal_sessions import create_meal_session, delete_meal_session, update_meal_session
import uuid
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

router = APIRouter(prefix="/meal-session")

@router.post("/", response_model = MealSessionResponse)
def meal_session_create(event_name: str, meal_session_data: MealSessionRegister, db: Session = Depends(get_db)):
    return create_meal_session(event_name, meal_session_data, db)

@router.delete("/{meal_id}")
def meal_session_delete(meal_id: uuid.UUID, db: Session = Depends(get_db)):
    return delete_meal_session(meal_id, db)

@router.put("/{meal_id}")
def meal_session_update(meal_id: uuid.UUID, new_time: MealSessionUpdate, db: Session = Depends(get_db)):
    return update_meal_session(meal_id, new_time, db)
