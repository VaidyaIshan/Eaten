from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db import get_db
from services.food_claims import create_food_claim, activate_food_claim, delete_food_claim
from schemas.food_claims import FoodClaimCreate, FoodClaimResponse
import uuid
from sqlalchemy.dialects.postgresql import UUID

router = APIRouter(prefix="/food-claim")

@router.post("/", response_model = FoodClaimResponse)
def food_claim_create(food_claim_data: FoodClaimCreate, db: Session = Depends(get_db)):
    return create_food_claim(food_claim_data, db)

@router.put("/{food_claim_id}")
def food_claim_activate(food_claim_id: uuid.UUID, db:Session = Depends(get_db)):
    return activate_food_claim(food_claim_id, db)

@router.delete("/{food_claim_id}")
def food_claim_delete(food_claim_id: uuid.UUID, db: Session = Depends(get_db)):
    return delete_food_claim(food_claim_id, db)
