from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import HTTPException
import uuid
from sqlalchemy.dialects.postgresql import UUID
from schemas.event_participants import ParticipantCreate
from models.users import User
from models.events import Event
from models.event_participants import EventParticipant

def register_participants(participant_data: ParticipantCreate, db: Session):

    user = db.query(User).filter(User.id == participant_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    event = db.query(Event).filter(Event.id == participant_data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="event not found")

    participant = EventParticipant(
            event_id = event.id,
            user_id = user.id,
            registered_at = datetime.now()
            )

    return participant
