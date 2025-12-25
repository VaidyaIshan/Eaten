from sqlalchemy import Column, Integer, String, DateTime, Boolean, Date
from datetime import datetime
from db import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(String(255), unique=True, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)
    picture = Column(String, nullable=True)

    meal_sessions = relationship("MealSession", back_populates = "event")
    ordering_services = relationship("OrderingService", back_populates="event")
    food_claims = relationship("FoodClaim", back_populates = "events")
