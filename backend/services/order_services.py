from models.ordering_services import OrderingService
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.users import User
from schemas.ordering_service import OrderCreate,OrderUpdate, OrderingServiceCreate,ServiceItemBase, ServiceItemCreate, ServiceItemPriceUpdate, ServiceItemQuantityUpdate
from models.orders import Order
from models.ordering_services import OrderingService
from models.service_items import ServiceItem
import uuid

def create_ordering_service(db:Session,OrderingServiceCreate: OrderingServiceCreate ):
    user = db.query(User).filter(OrderingServiceCreate.user_id==User.id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    orderingservice = OrderingService(
        event_id = OrderingServiceCreate.event_id,
        service_name = OrderingServiceCreate.service_name,
        description = OrderingServiceCreate.description,
        service_start = OrderingServiceCreate.service_start,
        service_end = OrderingServiceCreate.service_end
    )

    db.add(orderingservice)
    db.commit()
    db.refresh(orderingservice)

    return orderingservice

def show_all_ordering_services(db:Session):
    return db.query(OrderingService).all()


def create_service_item(db:Session,ServiceItemCreate:ServiceItemCreate):
    if db.query(ServiceItem).filter(ServiceItemCreate.item_name ==ServiceItem.item_name).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Service Item already exists")
    
    service_item = ServiceItem(
        item_name = ServiceItemCreate.item_name,
        service_id = ServiceItemCreate.service_id,
        description = ServiceItemCreate.description,
        stock_quantity = ServiceItemCreate.stock_quantity,
        price=ServiceItemCreate.price
    )

    db.add(service_item)
    db.commit()
    db.refresh(service_item)

    return service_item

def update_price(db:Session, ServiceItemPriceUpdate:ServiceItemPriceUpdate):
    service_item = db.query(ServiceItem).filter(ServiceItem.id == ServiceItemPriceUpdate.id).first()

    if not service_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service Item not Found.")
    
    service_item.price = ServiceItemPriceUpdate.price

    db.commit()
    db.refresh(service_item)

    return service_item

def update_quantity(db:Session, ServiceItemQuantityUpdate:ServiceItemQuantityUpdate):
    service_item = db.query(ServiceItem).filter(ServiceItem.id == ServiceItemQuantityUpdate.id).first()

    if not service_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service Item not Found.")
    
    service_item.stock_quantity = ServiceItemQuantityUpdate.quantity

    db.commit()
    db.refresh(service_item)

    return service_item

def get_item_stock(db:Session, item_id:uuid.UUID):
    service_item = db.query(ServiceItem).filter(ServiceItem.id == item_id).first()
    if not service_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service Item not found")
    
    return service_item.stock_quantity


def get_all_orders(db:Session):
    return db.query(Order).all()

def create_order(db:Session, OrderCreate:OrderCreate):
    user = db.query(User).filter(User.id==OrderCreate.user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    
    service_item = db.query(ServiceItem).filter(ServiceItem.id==OrderCreate.service_item_id).first()
    if not service_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service item not found.")
    
    if service_item.stock_quantity>= OrderCreate.quantity:
        service_item.stock_quantity -= OrderCreate.quantity
        order =Order(
        user_id = OrderCreate.user_id,
        service_item_id = OrderCreate.service_item_id,
        quantity = OrderCreate.quantity
        )
        db.add(order)
        db.commit()
        db.refresh(order)

        return order
    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="Not enough stock available.")

def update_order(db: Session, order_id: uuid.UUID, data: OrderUpdate):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found."
        )

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(order, field, value)

    db.commit()
    db.refresh(order)

    return order


    




