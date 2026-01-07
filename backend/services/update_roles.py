from models.users import User
from models.roles import Role
from sqlalchemy.orm import Session
from fastapi import HTTPException
import uuid
from sqlalchemy.dialects.postgresql import UUID

def update_role_id(user_id: uuid.UUID, new_role_id: int, current_user_id: uuid.UUID, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    current_user = db.query(User).filter(User.id == current_user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not current_user:
        raise HTTPException(status_code=404, detail="Current user not found")

    # Only superadmin (role_id=0) can change roles
    if current_user.role_id != 0:
        raise HTTPException(status_code=403, detail="Only superadmin can change user roles")
    
    # Prevent users from demoting themselves
    if current_user_id == user_id and new_role_id != current_user.role_id:
        raise HTTPException(status_code=403, detail="Cannot change your own role")
    
    # Validate role_id exists
    role = db.query(Role).filter(Role.id == new_role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    user.role_id = new_role_id

    db.commit()
    db.refresh(user)

    return {"message" : "role update successful", "user" : user} 
