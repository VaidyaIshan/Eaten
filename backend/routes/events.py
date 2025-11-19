from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db import get_db
from schemas.event_schemas import EventRegister, EventResponse
from services.events import register_event

router = APIRouter(prefix="/event")

@router.post("/register", response_model=EventResponse)
def event_register(event_data: EventRegister, db: Session = Depends(get_db)):
    return register_event(event_data, db)
