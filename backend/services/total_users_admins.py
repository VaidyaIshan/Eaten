from models.roles import Role
from models.users import User
from sqlalchemy.orm import Session

def total_users(db: Session):
    count = db.query(User).filter(User.role_id == 2).count()

    return {"total_users" : count}

def total_admins(db: Session):
    count = db.query(User).filter(User.role_id == 1).count()

    return {"total_admins" : count}
