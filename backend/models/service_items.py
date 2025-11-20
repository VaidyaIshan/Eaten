from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from db import Base
import uuid
from datetime import datetime


class SERVICE_ITEMS(Base):
    __tablename__ = "service_items"

    service_id = Column(Integer, primary_key=True, index=True, default=uuid.uuid4)
    item_name = Column(String(25), index=True, nullable=False)
    description = Column(String(250), nullable=True)
    stock_quantity = Column(Integer, nullable=True)
    price = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)
    is_available = Column(Boolean, nullable=False, default=True)

    orders = relationship("ORDERS", back_populates="service_items")