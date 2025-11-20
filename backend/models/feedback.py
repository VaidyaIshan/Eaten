from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    response = Column(Text, unique=True, index=True, nullable=False) 
    user_id = Column(UUID(as_uuid=True),ForeignKey("users.id") ,nullable=False, default=2, onupdate=None)
    created_at = Column(DateTime, nullable=False, default = datetime.now)

    users = relationship("User", back_populates="feedback")

