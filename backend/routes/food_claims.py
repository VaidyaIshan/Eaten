from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db import get_db
from services.food_claims import create_food_claim, activate_food_claim, delete_food_claim, get_all_food_claims, create_food_claim_from_qr
from schemas.food_claims import FoodClaimCreate, FoodClaimResponse
import uuid
from services.qr_system import get_qr_string, get_qr_string_by_meal_id
from services.auth import get_current_user
from models.users import User
from typing import List

router = APIRouter(prefix="/food-claim", dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[FoodClaimResponse])
def get_all_food_claims_route(db: Session = Depends(get_db)):
    return get_all_food_claims(db)

@router.post("/scan", response_model = FoodClaimResponse)
def food_claim_create_from_scan(user_id: uuid.UUID, meal_session_id: uuid.UUID, db: Session = Depends(get_db)):
    return create_food_claim_from_qr(user_id, meal_session_id, db)

@router.post("/", response_model = FoodClaimResponse)
def food_claim_create(food_claim_data: FoodClaimCreate, db: Session = Depends(get_db)):
    return create_food_claim(food_claim_data, db)

@router.put("/{food_claim_id}")
def food_claim_activate(food_claim_id: uuid.UUID, db:Session = Depends(get_db)):
    return activate_food_claim(food_claim_id, db)

@router.delete("/{food_claim_id}")
def food_claim_delete(food_claim_id: uuid.UUID, db: Session = Depends(get_db)):
    return delete_food_claim(food_claim_id, db)

@router.get("/qr-code")
def qr_code_generate(username: str, mealname: str, eventname: str, db: Session = Depends(get_db)):
    return get_qr_string(username, mealname, eventname, db)

@router.get("/qr-code/{meal_id}")
def qr_code_by_meal_id(meal_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {"qr_code": get_qr_string_by_meal_id(current_user.id, meal_id, db)}