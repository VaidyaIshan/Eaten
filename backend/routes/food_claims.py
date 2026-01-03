from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db import get_db
from services.food_claims import create_food_claim, activate_food_claim, delete_food_claim
from schemas.food_claims import FoodClaimCreate, FoodClaimResponse
import uuid
from services.qr_system import get_qr_string
from services.auth import get_current_user

router = APIRouter(prefix="/food-claim", dependencies=[Depends(get_current_user)])

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
