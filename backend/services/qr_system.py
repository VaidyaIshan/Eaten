from sqlalchemy.orm import Session
import uuid
from sqlalchemy.dialects.postgresql import UUID
from fastapi import HTTPException
from models.users import User
from models.meal_sessions import MealSession
from models.events import Event

def get_qr_string(username, mealname, eventname, db: Session):

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    userid = user.id

    event = db.query(Event).filter(Event.name == eventname).first()
    if not event: 
        raise HTTPException(status_code=404, detail="event not found")

    eventid = event.id

    meal = db.query(MealSession).filter(MealSession.meal_type == mealname and MealSession.event_id == eventid).first()
    if not meal:
        raise HTTPException(status_code=404, detail="meal session not found")

    mealid = meal.id

    qrcode = f"{userid}+{mealid}"

    return qrcode

def get_qr_string_by_meal_id(user_id: uuid.UUID, meal_id: uuid.UUID, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    meal = db.query(MealSession).filter(MealSession.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="meal session not found")

    qrcode = f"{user_id}+{meal_id}"
    return qrcode