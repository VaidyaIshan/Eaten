from sqlalchemy.orm import Session
from fastapi import HTTPException
import uuid
from models.users import User 
from models.meal_sessions import MealSession
from models.events import Event

def process_qr_verification(qr_string: str, db: Session):
    
    if "+" not in qr_string:
        raise HTTPException(status_code=400, detail="Invalid QR Format")

    try:
        user_id_str, meal_id_str = qr_string.split("+", 1)
        user_uuid = uuid.UUID(user_id_str)
        meal_uuid = uuid.UUID(meal_id_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID data in QR")

    user = db.query(User).filter(User.id == user_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    meal = db.query(MealSession).filter(MealSession.id == meal_uuid).first()
    meal_is_act = meal.is_active
    event_is_act = meal.event.is_active
    if not meal or not meal_is_act or not event_is_act:
        raise HTTPException(status_code=404, detail="Meal session not found")


    return {
        "status": "success",
        "message": "Access Granted",
        "data": {
            "username": user.username,
            "meal": meal.meal_type,
            "user_id":user.id,
            "meal_id":meal.id,
         
        }
    }
