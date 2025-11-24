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

def create_food_claim(food_claim_data: FoodClaimCreate, db: Session):

    user = db.query(User).filter(User.username == food_claim_data.username).first()
    mealtype = db.query(MealSession).filter(MealSession.meal_type == food_claim_data.meal_type).first()
    event = db.query(Event).filter(Event.name == food_claim_data.event_name).first()

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
