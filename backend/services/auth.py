from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime
from fastapi import HTTPException, status, Depends
from models.users import User
from schemas.auth_schemas import UserRegister, TokenResponse
import uuid
from sqlalchemy.dialects.postgresql import UUID
from datetime import timedelta, datetime, timezone
from jose import jwt, JWTError
from config import SECRET_KEY, ALGORITHM, TOKEN_EXPIRES
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from db import get_db

hasher = CryptContext(schemes=["bcrypt"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "Eaten/auth/token")

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


def create_access_token(data:dict, expires_delta:timedelta):
    to_encode = data.copy()
    if expires_delta:
        expires_at=datetime.now(timezone.utc)+expires_delta
    else:
        expires_at = datetime.now(timezone.utc)+timedelta(minutes=15)


    to_encode.update({"exp":expires_at})

    to_encode.update({"exp":expires_at})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
    return encoded_jwt
   

def verify_password(pwd:str, hashed_pwd:str):
     return hasher.verify(pwd, hashed_pwd)


def verify_token(token:str)->TokenResponse:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username : str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Could not verify credentials",headers={"WWW-Authenticate":"Bearer"})
        
        return TokenResponse(username=username)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Could not verify credentials",headers={"WWW-Authenticate":"Bearer"})


def login_user(user_credentials: OAuth2PasswordRequestForm, db: Session):
    user = db.query(User).filter(User.username == user_credentials.username).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,  detail="User not found")
    
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,  detail="Invalid Password")
    
    access_token_expires = timedelta(minutes=TOKEN_EXPIRES)
    access_token = create_access_token(data={"sub":user.username}, expires_delta=access_token_expires)
    return {"access_token":access_token, "token_type":"Bearer"}

def get_current_user(db:Session = Depends(get_db), token:str=Depends(oauth2_scheme)):
    token_data = verify_token(token)
    user= db.query(User).filter(User.username==token_data.username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="User does not exist",headers={"WWW-Authenticate":"Bearer"})

    return user

def del_user(user_id: uuid.UUID, current_user_id: uuid.UUID, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    current_user = db.query(User).filter(User.id == current_user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not current_user:
        raise HTTPException(status_code=404, detail="Current user not found")

    # Prevent users from deleting themselves
    if current_user_id == user_id:
        raise HTTPException(status_code=403, detail="Cannot delete your own account")
    
    # Prevent admins from deleting superadmin users (only superadmin can delete superadmin)
    if user.role_id == 0 and current_user.role_id != 0:
        raise HTTPException(status_code=403, detail="Only superadmin can delete superadmin users")

    db.delete(user)
    db.commit()

    return {"message" : "User deleted successfully"}
