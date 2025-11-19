from sqlalchemy.orm import Session
from datetime import datetime
from schemas.event_schemas import EventRegister
from models.events import Event
from fastapi import HTTPException

def register_event(event_data: EventRegister, db: Session):
    
    if db.query(Event).filter(Event.name == event_data.name).first():
        raise HTTPException(status_code=409, detail="Event already exists")

    event = Event(
            name = event_data.name,
            description = event_data.description,
            start_date = event_data.start_date,
            end_date = event_data.end_date,
            is_active = False,
            created_at = datetime.now(),
            updated_at = datetime.now()
            )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event
