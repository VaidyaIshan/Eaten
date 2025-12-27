from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from schemas.auth_schemas import UserRegister, UserResponse, Token, TokenReponse
from services.auth import register_user, login_user, del_user, get_current_user, verify_token_endpoint
from services.roles_services import create_roles, get_roles
from models.users import User
from services.total_users_admins import total_users, total_admins
from services.update_roles import update_role_id
from schemas.update_role_schemas import UserRoleUpdate
from services.user_services import set_is_active
import uuid
from fastapi.security import OAuth2PasswordRequestForm

public_router = APIRouter(prefix="/auth")

router = APIRouter(prefix="/auth", dependencies=[Depends(get_current_user)])

@public_router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    return register_user(user_data, db)

@public_router.post("/token", response_model=Token)
def login_for_access_token(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
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

@router.put("/users/{user_id}", response_model=UserRoleUpdate)
def update_user_role_id(user_id: uuid.UUID, new_role_id: int, db: Session = Depends(get_db)):
    return update_role_id(user_id, new_role_id, db)

@router.delete("/delete/{user_id}")
def delete_user_data(user_id: uuid.UUID, db: Session = Depends(get_db)):
    return del_user(user_id, db)

@router.put("/users/isActive/{user_id}")
def change_is_active(user_id: uuid.UUID, db: Session = Depends(get_db)):
    return set_is_active(user_id, db)

@router.get("/me", response_model=TokenReponse)
def get_logged_in_user(current_user:User=Depends(get_current_user)):
    return current_user

@router.get("/verify-token")
def verify_token():
    return verify_token_endpoint()
    

