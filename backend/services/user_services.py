from models.users import User
from sqlalchemy.orm import Session
from fastapi import HTTPException
import uuid
from sqlalchemy.dialects.postgresql import UUID

def set_is_active(user_id: uuid.UUID,db: Session):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")


    if user.is_active:
        user.is_active = False
    else:
        user.is_active = True

    db.commit()
    db.refresh(user)

    return {"message" : "is_active change successful"}
