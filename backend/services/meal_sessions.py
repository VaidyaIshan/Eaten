from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import HTTPException
import uuid
from sqlalchemy.dialects.postgresql import UUID
from schemas.meal_sessions_schemas import MealSessionRegister
from models.events import Event
from models.meal_sessions import MealSession

def create_meal_session(event_name: str, meal_session_data: MealSessionRegister, db: Session):
    eventname = db.query(Event).filter(Event.name == event_name).first()

    if not eventname:
        raise HTTPException(status_code=404, detail="Event not found")

    eventid = eventname.id

    mealsession = MealSession(
            event_id = eventid,
            meal_type = meal_session_data.meal_type,
            start_time = meal_session_data.start_time,
            end_time = meal_session_data.end_time,
            is_active = False,
            total_capacity = meal_session_data.total_capacity,
            created_at = datetime.now(),
            updated_at = datetime.now()
            )

    db.add(mealsession)
    db.commit()
    db.refresh(mealsession)

    return mealsession

def delete_meal_session(meal_id: uuid.UUID, db: Session):
    mealsession = db.query(MealSession).filter(MealSession.id == meal_id).first()

    if not mealsession:
        raise HTTPException(status_code=404, detail="Meal session not found")

    db.delete(mealsession)
    db.commit()

    return {"message" : "meal session deleted successfully"}
