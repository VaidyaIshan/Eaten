from models.ordering_services import ORDERING_SERVICES
from models.orders import ORDERS
from models.service_items import SERVICE_ITEMS

def get_all_orders(db):
    return db.query(ORDERING_SERVICES).all()


