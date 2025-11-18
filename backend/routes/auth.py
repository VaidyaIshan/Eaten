from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db import get_db
from schemas.auth_schemas import UserRegister, UserLogin, UserResponse
from services.auth import register_user, login_user
from services.roles_services import create_roles, get_roles
from models.users import User
from services.total_users_admins import total_users, total_admins

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    return register_user(user_data, db)


@router.post("/login", response_model=UserResponse)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    return login_user(user_credentials, db)

@router.post("/")
def initial_roles(db: Session = Depends(get_db)):
    return create_roles(db)

@router.get("/roles")
def get_user_roles(username: str, db: Session = Depends(get_db)):
    return get_roles(username, db)

@router.get("/total/users")
def get_total_users(db: Session = Depends(get_db)):
    return total_users(db)

@router.get("/total/admins")
def get_total_admins(db: Session = Depends(get_db)):
    return total_admins(db)
