from sqlalchemy.orm import Session
from datetime import datetime
from schemas.feedback_schemas import FeedbackAdd
from models.feedback import Feedback
from models.users import User
from fastapi import HTTPException
import uuid
from sqlalchemy.dialects.postgresql import UUID

def add_feedback(username: str, review: str, db: Session):
    

    user = db.query(User).filter(User.username==username).first()

    if not user:
        raise HTTPException(status_code=404, detail = "User not found")
    
    userid = user.id

    feedback = Feedback(
            response = review,
            user_id = userid,
            created_at = datetime.now(),
            )
    
    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return feedback

def delete_feedback(feedback_id: uuid.UUID, db: Session):
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()

    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    db.delete(feedback)
    db.commit()

    return {"message" : "feedback deleted successfully"}
