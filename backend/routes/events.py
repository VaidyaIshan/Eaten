from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db import get_db
from schemas.event_schemas import EventRegister, EventResponse
from services.events import register_event, delete_event, activate_event, get_all_events, get_event_by_id
import uuid
from sqlalchemy.dialects.postgresql import UUID
from services.auth import get_current_user
from typing import List

router = APIRouter(prefix="/event", dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[EventResponse])
def get_events(db: Session = Depends(get_db)):
    return get_all_events(db)

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: uuid.UUID, db: Session = Depends(get_db)):
    return get_event_by_id(event_id, db)

@router.post("/", response_model=EventResponse)
def event_register(event_data: EventRegister, db: Session = Depends(get_db)):
    return register_event(event_data, db)

@router.delete("/{event_id}")
def event_delete(event_id: uuid.UUID, db: Session = Depends(get_db)):
    return delete_event(event_id, db)

@router.put("/{event_id}", response_model=EventResponse)
def event_activate(event_id: uuid.UUID, db: Session = Depends(get_db)):
    return activate_event(event_id, db)
