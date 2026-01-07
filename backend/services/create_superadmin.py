from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime
from models.users import User
from models.roles import Role
from fastapi import HTTPException

hasher = CryptContext(schemes=["bcrypt"])

def create_superadmin(db: Session):
    # Check if superadmin already exists
    superadmin_user = db.query(User).filter(User.email == "eaten@softwareclub.com").first()
    if superadmin_user:
        return {"message": "Superadmin already exists", "user": superadmin_user}
    
    # Ensure roles exist
    superadmin_role = db.query(Role).filter(Role.id == 0).first()
    if not superadmin_role:
        raise HTTPException(status_code=500, detail="Superadmin role does not exist. Please run initial_roles endpoint first.")
    
    # Create superadmin user
    superadmin = User(
        username="eaten@softwareclub.com",
        email="eaten@softwareclub.com",
        hashed_password=hasher.hash("deerhackloveseaten@SoftwareClub"),
        role_id=0,  # superadmin
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True  # Active by default
    )
    
    db.add(superadmin)
    db.commit()
    db.refresh(superadmin)
    
    return {"message": "Superadmin created successfully", "user": superadmin}

