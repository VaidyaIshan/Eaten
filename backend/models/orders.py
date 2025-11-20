from sqlalchemy import Column, Integer, DateTime, String, ForeignKey, UUID
from sqlalchemy.orm import relationship
from db import Base
import uuid
from datetime import datetime


class ORDERS(Base):
    __tablename__ = "orders"

    id = Column(UUID, primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False, index=True)
    service_item_id = Column(UUID, ForeignKey("service_items.service_id"), nullable=False, index=True)
    status = Column(String(25), default="Sent", nullable=False, index=True)
    quantity = Column(Integer, nullable=False, index=True, default=1)
    ordered_at = Column(DateTime, nullable=False, default=datetime.now)
    fulfilled_at = Column(DateTime, nullable=True, default=None)

    service_item = relationship("SERVICE_ITEMS", back_populates="orders")