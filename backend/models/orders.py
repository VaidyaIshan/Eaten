from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship
from db import Base
import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False, index=True)
    service_item_id = Column(UUID(as_uuid=True), ForeignKey("service_items.id"), nullable=False, index=True)
    status = Column(String(25), default="Sent", nullable=False, index=True)
    quantity = Column(Integer, nullable=False, index=True, default=False)
    ordered_at = Column(DateTime, nullable=False, default=datetime.now)
    fulfilled_at = Column(DateTime, nullable=True, default=None)

    service_item = relationship("ServiceItem", back_populates="order")