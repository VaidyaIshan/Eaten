from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class MealSession(Base):
    __tablename__ = "meal_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False, onupdate=None)
    meal_type = Column(String(100), index=True, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_active = Column(Boolean, nullable=False, default=False)
    total_capacity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, default = datetime.now)
    updated_at = Column(DateTime, nullable=False, default = datetime.now, onupdate=datetime.now)

    event = relationship("Event", back_populates="meal_sessions")
    food_claims = relationship("FoodClaim", back_populates="meal_sessions")
