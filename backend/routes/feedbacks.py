from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db import get_db
from schemas.feedback_schemas import FeedbackResponse, FeedbackAdd 
from services.feedbacks import add_feedback, delete_feedback, get_feedback
from sqlalchemy.dialects.postgresql import UUID
import uuid
from typing import List
from services.auth import get_current_user

router = APIRouter(prefix="/feedback", dependencies=[Depends(get_current_user)])

@router.post("/response", response_model= FeedbackResponse)
def feedback_add(feedback_add:FeedbackAdd, db: Session = Depends(get_db)):
    return add_feedback(feedback_add.username, feedback_add.review, db)

@router.delete("/delete")
def feedback_delete(feedback_id: uuid.UUID, db: Session = Depends(get_db)):
    return delete_feedback(feedback_id, db)

@router.get("/get-all-feedbacks", response_model = List[FeedbackResponse])
def get_all_feedback(db: Session = Depends(get_db)):
    return get_feedback(db)
