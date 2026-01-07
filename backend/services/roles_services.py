from models.roles import Role
from sqlalchemy.orm import Session
from models.users import User

def create_roles(db: Session):
    if db.query(Role).first() is None:
        try:
            superadmin = Role(
                    id=0,
                    name="superadmin",
                    description="superadmin role description"
                    )
            
            admin = Role(
                    id=1,
                    name="admin",
                    description="admin role description"
                    )

            user = Role(
                    id=2,
                    name="user",
                    description="user role description",
                    )
        
            db.add_all([superadmin, admin, user])
            db.commit()

            return [superadmin, admin, user]

        except Exception as e:
            db.rollback()
            print(f"Error creating initial roles: {e}")


def get_roles(username: str, db: Session):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    return user.role
