from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from schemas.meal_sessions_schemas import MealSessionRegister, MealSessionResponse, MealSessionUpdate, MealIdResponse
from services.meal_sessions import create_meal_session, delete_meal_session, update_meal_session, activate_meal_session, get_meal_session_by_id
import uuid
from services.auth import get_current_user

router = APIRouter(prefix="/meal-session", dependencies=[Depends(get_current_user)])

@router.post("/", response_model = MealSessionResponse)
def meal_session_create(event_name: str, meal_session_data: MealSessionRegister, db: Session = Depends(get_db)):
    return create_meal_session(event_name, meal_session_data, db)

@router.delete("/{meal_id}")
def meal_session_delete(meal_id: uuid.UUID, db: Session = Depends(get_db)):
    return delete_meal_session(meal_id, db)

@router.put("/{meal_id}")
def meal_session_update(meal_id: uuid.UUID, new_time: MealSessionUpdate, db: Session = Depends(get_db)):
    return update_meal_session(meal_id, new_time, db)

@router.put("/activate/{meal_id}")
def meal_session_activate(meal_id: uuid.UUID, db: Session = Depends(get_db)):
    return activate_meal_session(meal_id, db)

@router.get("/get", response_model=MealSessionResponse)
def meal_session_get(meal_id: uuid.UUID, db: Session = Depends(get_db)):
    return get_meal_session_by_id(meal_id, db)