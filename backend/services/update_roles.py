from models.users import User
from models.roles import Role
from sqlalchemy.orm import Session
from fastapi import HTTPException
import uuid
from sqlalchemy.dialects.postgresql import UUID

def update_role_id(user_id: uuid.UUID, new_role_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role_id = new_role_id

    db.commit()
    db.refresh(user)

    return {"message" : "role update successful", "user" : user} 
