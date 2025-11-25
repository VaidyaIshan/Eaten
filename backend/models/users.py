from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role_id = Column(Integer,ForeignKey("roles.id") ,nullable=False, default=2, onupdate=None)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)
    qr_code = Column(String(500), nullable=True)
    is_active = Column(Boolean, nullable=True, default=False)
   
    role = relationship("Role", back_populates="users")
    feedback = relationship("Feedback", back_populates="users")
    orders = relationship("Order", back_populates="user")
    food_claims = relationship("FoodClaim", back_populates="users")
