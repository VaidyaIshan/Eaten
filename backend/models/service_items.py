from sqlalchemy import Column, Integer, String,ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from db import Base
import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID

class ServiceItem(Base):
    __tablename__ = "service_items"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    service_id = Column(UUID(as_uuid=True), ForeignKey("ordering_services.id"), nullable=False, index=True)
    item_name = Column(String(25), index=True, nullable=False)
    description = Column(String(250), nullable=True)
    stock_quantity = Column(Integer, nullable=True)
    price = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)
    is_available = Column(Boolean, nullable=False, default=True)

    order = relationship("Order", back_populates="service_item")