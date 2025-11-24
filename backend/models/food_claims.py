from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship
from db import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class FoodClaim(Base):
    __tablename__ = "food_claims"

    id = Column(UUID(as_uuid=True), primary_key = True, unique = True, index = True, default = uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable = False, onupdate = None, index=True)
    meal_session_id = Column(UUID(as_uuid=True), ForeignKey("meal_sessions.id"), nullable=False, onupdate=None, index=True)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False, onupdate=None, index=True)
    claimed_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=None)
    is_claimed = Column(Boolean, nullable=False, default=False)

    users = relationship("User", back_populates="food_claims")
    meal_sessions = relationship("MealSession", back_populates="food_claims")
    events = relationship("Event", back_populates="food_claims")
