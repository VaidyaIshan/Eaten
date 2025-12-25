from sqlalchemy import Column, DateTime, Date, ForeignKey
from datetime import datetime
from db import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

class EventParticipant(Base):
    __tablename__ = "event_participants"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default = uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False, index=True, onupdate=None)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True, onupdate=None)
    registered_at = Column(DateTime, nullable=False, default=datetime.now)

    event = relationship("Event", back_populates="event_participants")
    user = relationship("User", back_populates="event_participants")

