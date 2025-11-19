from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime
from fastapi import HTTPException
from models.users import User
from schemas.auth_schemas import UserRegister, UserLogin
import uuid
from sqlalchemy.dialects.postgresql import UUID

hasher = CryptContext(schemes=["bcrypt"])


def register_user(user_data: UserRegister, db: Session):
   
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(detail="Username already exists")
    

    if user_data.email and db.query(User).filter(User.email == user_data.email).first(): #Email check
        raise HTTPException(detail="Email already exists")
    
   
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hasher.hash(user_data.password),
        role_id=2, # 2 role_id will be normal users and 1 will be admin
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active = False
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_user(user_credentials: UserLogin, db: Session):
    # Find user
    user = db.query(User).filter(User.username == user_credentials.username).first()
    
    if not user:
        raise HTTPException(detail="Invalid username or password")
    
    # Check password
    if not hasher.verify(user_credentials.password, user.hashed_password):
        raise HTTPException(detail="Invalid username or password")
    
    return user

def del_user(user_id: uuid.UUID, db: Session):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message" : "User deleted successfully"}
