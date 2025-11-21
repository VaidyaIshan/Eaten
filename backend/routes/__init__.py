from fastapi import APIRouter
from routes.auth import router as auth_router
from routes.events import router as event_router
from routes.feedbacks import router as feedback_router

api_router = APIRouter(prefix="/Eaten")

api_router.include_router(auth_router, tags=["Authentication"])
api_router.include_router(event_router, tags=["Events"])
api_router.include_router(feedback_router, tags=["Feedbacks"])

__all__ = ["api_router"]