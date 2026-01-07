from sqlalchemy.orm import Session
from schemas.food_claims import FoodClaimCreate 
from models.food_claims import FoodClaim
from models.users import User
from models.meal_sessions import MealSession
from models.events import Event
from fastapi import HTTPException
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

def get_all_food_claims(db: Session):
    return db.query(FoodClaim).all()

def create_food_claim_from_qr(user_id: uuid.UUID, meal_session_id: uuid.UUID, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    meal_session = db.query(MealSession).filter(MealSession.id == meal_session_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not meal_session:
        raise HTTPException(status_code=404, detail="Meal session not found")
    
    # Check if food claim already exists for this user and meal session
    existing_claim = db.query(FoodClaim).filter(
        FoodClaim.user_id == user_id,
        FoodClaim.meal_session_id == meal_session_id
    ).first()
    
    if existing_claim:
        raise HTTPException(status_code=409, detail="Food claim already exists for this user and meal session")
    
    foodclaim = FoodClaim(
        user_id=user.id,
        meal_session_id=meal_session.id,
        event_id=meal_session.event_id,
        claimed_at=datetime.now(),
        is_claimed=True  # Set to True when scanned
    )
    
    db.add(foodclaim)
    db.commit()
    db.refresh(foodclaim)
    
    return foodclaim

def create_food_claim(food_claim_data: FoodClaimCreate, db: Session):

    user = db.query(User).filter(User.username == food_claim_data.username).first()
    mealtype = db.query(MealSession).filter(MealSession.meal_type == food_claim_data.meal_type).first()
    event = db.query(Event).filter(Event.name == food_claim_data.event_name).first()

    userIntable = db.query(FoodClaim).filter(FoodClaim.user_id == user.id).first()
    mealIntable= db.query(FoodClaim).filter(FoodClaim.meal_session_id == mealtype.id).first()
    eventIntable = db.query(FoodClaim).filter(FoodClaim.event_id == event.id).first()

    if userIntable and mealIntable and eventIntable:
        raise HTTPException(status_code=409, detail="Food claim already exists")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not mealtype:
        raise HTTPException(status_code=404, detail="Meal session not found")

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    foodclaim = FoodClaim(
            user_id = user.id,
            meal_session_id = mealtype.id,
            event_id = event.id,
            claimed_at = datetime.now(),
            is_claimed = False
            )

    db.add(foodclaim)
    db.commit()
    db.refresh(foodclaim)

    return foodclaim

def activate_food_claim(food_claim_id: uuid.UUID, db: Session):
    
    foodclaim = db.query(FoodClaim).filter(FoodClaim.id == food_claim_id).first()

    if not foodclaim:
        raise HTTPException(status_code=404, detail="Food claim not found")

    if foodclaim.is_claimed:
        foodclaim.is_claimed = False
    else:
        foodclaim.is_claimed = True

    db.commit()
    db.refresh(foodclaim)

    return {"message" : "Food session claimed"}

def delete_food_claim(food_claim_id: uuid.UUID, db: Session):

    foodclaim = db.query(FoodClaim).filter(FoodClaim.id == food_claim_id).first()

    if not foodclaim:
        raise HTTPException(status_code=404, detail="Food claim not found")

    db.delete(foodclaim)
    db.commit()

    return {"message" : "Food claim deleted"}
