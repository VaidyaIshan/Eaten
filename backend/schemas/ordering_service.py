from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class OrderingServiceCreate(BaseModel):
    event_id: UUID
    service_name: str
    description: Optional[str] = None
    service_start:Optional[datetime] =None
    service_end:Optional[datetime] = None

class ServiceItemCreate(BaseModel):
    item_name:str
    service_id:UUID
    description:Optional[str]=None
    stock_quantity:Optional[int] = None
    price:Optional[int] = None

class ServiceItemUpdate(BaseModel):
    price:Optional[int] = None
    quantity:Optional[int] = None
    is_Available: Optional[bool] = None

class OrderBase(BaseModel):
    service_item_id: UUID
    quantity: int = 1

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    quantity: Optional[int] = None
    fulfilled_at: Optional[datetime] = None

class OrderResponse(BaseModel):
    id: UUID
    user_id: UUID
    service_item_id: UUID
    status: str
    quantity: int
    ordered_at: datetime
    fulfilled_at: Optional[datetime]

    class Config:
        from_attributes = True