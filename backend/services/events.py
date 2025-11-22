from sqlalchemy.orm import Session
from datetime import datetime
from schemas.event_schemas import EventRegister
from models.events import Event
from fastapi import HTTPException
import uuid
from sqlalchemy.dialects.postgresql import UUID

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
            updated_at = datetime.now(),
            picture = event_data.picture
            )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event

def delete_event(event_id: uuid.UUID, db: Session):
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()

    return {"message" : "event deleted successfully"}
