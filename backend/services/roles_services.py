from models.roles import Role
from sqlalchemy.orm import Session

def create_roles(db: Session):
    if db.query(Role).first() is None:
        try:
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
        
            db.add_all([admin, user])
            db.commit()

            return [admin, user]

        except Exception as e:
            db.rollback()
            print(f"Error creating initial roles: {e}")
