from sqlalchemy import Column, Integer, DateTime, String, ForeignKey, UUID, Boolean
from sqlalchemy.orm import relationship
from db import Base
import uuid
from datetime import datetime


class ORDERING_SERVICES(Base):
    __tablename__ = "ordering_services"

    id = Column(UUID, primary_key=True, index=True, default=uuid.uuid4)
    event_id = Column(UUID, ForeignKey("events.id"), nullable=False, index=True)
    service_name = Column(String(50), index=True, nullable=False)
    description = Column(String(250), nullable=True)
    is_active = Column(Boolean, default=False, index=True)
    service_start = Column(DateTime, nullable=True, default=None)
    service_end = Column(DateTime, nullable=True, default=None)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=True, default=datetime.now, onupdate=datetime.now)

    event = relationship("EVENTS", back_populates="ordering_services")