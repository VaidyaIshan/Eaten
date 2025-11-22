from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated
from db import get_db
import services.order_services as order_services
from schemas.ordering_service import OrderCreate,OrderResponse,OrderUpdate, OrderingServiceCreate, ServiceItemCreate, ServiceItemPriceUpdate, ServiceItemQuantityUpdate
import uuid
from typing import Annotated, List

router = APIRouter(prefix="/orders")

db_dependency = Annotated[Session, Depends(get_db)]

@router.get("/all", response_model=List[OrderResponse])
def get_all_orders(db:db_dependency):
    return order_services.get_all_orders(db)

@router.get("/orderInfo/{order_id}",response_model=OrderResponse)
def get_order_info(order_id:uuid.UUID, db:db_dependency):
    return order_services.get_order_info(order_id,db)

@router.post("/create")
def create_order(OrderCreate :OrderCreate,db:db_dependency):
    return order_services.create_order(db=db,OrderCreate=OrderCreate)

@router.put("/update/{order_id}")
def update_order_route(order_id: uuid.UUID, data: OrderUpdate, db: db_dependency):
    return order_services.update_order(db, order_id, data)

@router.post("/createOrderingService")
def create_ordering_service(OrderingServiceCreate :OrderingServiceCreate,db:db_dependency):
    return order_services.create_ordering_service(db=db,
                                           OrderingServiceCreate=OrderingServiceCreate)

@router.get("/showAllOrderingServices")
def show_all_ordering_services(db:db_dependency):
    return order_services.show_all_ordering_services(db=db)

@router.post("/createServiceItem")
def create_service_item(ServiceItemCreate:ServiceItemCreate,db:db_dependency ):
    return order_services.create_service_item(db=db, ServiceItemCreate=ServiceItemCreate)

@router.post("/updateItemPrice")
def update_item_price(ServiceItemPriceUpdate: ServiceItemPriceUpdate, db:db_dependency):
    return order_services.update_price(db=db, ServiceItemPriceUpdate=ServiceItemPriceUpdate)

@router.post("/updateItemQuantity")
def update_item_quantity(ServiceItemQuantityUpdate:ServiceItemQuantityUpdate, db:db_dependency):
    return order_services.update_quantity(db=db, ServiceItemQuantityUpdate=ServiceItemQuantityUpdate)

@router.get("/getItemCount/{item_id}")
def get_service_item_count(item_id :uuid.UUID,db:db_dependency):
    return order_services.get_item_stock(db=db, item_id=item_id)