from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated
from db import get_db
from services.order_services import get_all_orders

db_dependency = Annotated[Depends, get_db]

router = APIRouter(prefix="/orders")

@router.get("/all")
def get_all_orders(db = db_dependency):
    get_all_orders(db)
