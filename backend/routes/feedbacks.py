from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db import get_db
from schemas.feedback_schemas import FeedbackResponse, FeedbackAdd 
from services.feedbacks import add_feedback, delete_feedback
from sqlalchemy.dialects.postgresql import UUID
import uuid

router = APIRouter(prefix="/feedback")

@router.post("/response", response_model= FeedbackResponse)
def feedback_add(username: str, review:str, db: Session = Depends(get_db)):
    return add_feedback(username, review, db)

@router.delete("/delete")
def feedback_delete(feedback_id: uuid.UUID, db: Session = Depends(get_db)):
    return delete_feedback(feedback_id, db)