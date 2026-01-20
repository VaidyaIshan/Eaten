from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from schemas.auth_schemas import UserRegister, UserResponse, Token
from services.auth import register_user, login_user, del_user, get_current_user
from services.roles_services import create_roles, get_roles
from models.users import User
from services.total_users_admins import total_users, total_admins
from services.update_roles import update_role_id
from schemas.update_role_schemas import UserRoleUpdate
from services.user_services import set_is_active, get_all_users
from services.create_superadmin import create_superadmin
from services.user_seeder import UserSeederService
from schemas.user_seeder_schemas import UserSeederResponse
import uuid
from fastapi.security import OAuth2PasswordRequestForm
from typing import List

public_router = APIRouter(prefix="/auth")

router = APIRouter(prefix="/auth", dependencies=[Depends(get_current_user)])

@public_router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    return register_user(user_data, db)

@public_router.post("/token", response_model=Token)
def login_for_access_token(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login_user(user_credentials, db)

@router.post("/initial-roles")
def initial_roles(db: Session = Depends(get_db)):
    return create_roles(db)

@public_router.post("/create-superadmin")
def create_superadmin_route(db: Session = Depends(get_db)):
    return create_superadmin(db)

@router.get("/users", response_model = List[UserResponse])
def get_all_users_route(db:Session = Depends(get_db)):
    return get_all_users(db)

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
def update_user_role_id(user_id: uuid.UUID, new_role_id: int,current_user:User = Depends(get_current_user), db: Session = Depends(get_db)):
    return update_role_id(user_id, new_role_id,current_user.id, db)

@router.delete("/delete/{user_id}")
def delete_user_data(user_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return del_user(user_id, current_user.id, db)

@router.put("/users/isActive/{user_id}")
def change_is_active(user_id: uuid.UUID, db: Session = Depends(get_db)):
    return set_is_active(user_id, db)

@router.get("/me", response_model=UserResponse)
def get_logged_in_user(current_user:User=Depends(get_current_user)):
    return current_user

@router.post("/seed-users", response_model=UserSeederResponse)
def seed_users_from_excel(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Seed users from an Excel file.
    Only accessible to admin users (role_id >= 1).
    
    Excel file should have columns: username, email, password
    Optional columns: role_id, is_active
    """
    # Check if user is admin or superadmin
    if current_user.role_id not in [0, 1]:
        raise HTTPException(status_code=403, detail="Only admins can seed users")
    
    # Read file
    file_bytes = file.file.read()
    
    if not file_bytes:
        raise HTTPException(status_code=400, detail="File is empty")
    
    # Seed users
    return UserSeederService.seed_users(file_bytes, db)
