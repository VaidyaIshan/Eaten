from fastapi import APIRouter
from routes.auth import router as auth_router
from routes.auth import public_router as public_auth_router
from routes.events import router as event_router
from routes.feedbacks import router as feedback_router
from routes.meal_sessions import router as meal_sessions_router
from routes.orders import router as order_router
from routes.food_claims import router as food_claims_router 
from routes.qr import router as qr_router

api_router = APIRouter(prefix="/Eaten")

api_router.include_router(auth_router, tags=["Authentication"])
api_router.include_router(public_auth_router, tags=["Authentication"])
api_router.include_router(event_router, tags=["Events"])
api_router.include_router(feedback_router, tags=["Feedbacks"])
api_router.include_router(meal_sessions_router, tags=["Meal-Sessions"])
api_router.include_router(order_router, tags=["Orders"])
api_router.include_router(food_claims_router, tags=["Food-Claims"])
api_router.include_router(qr_router, tags=["QR-Verification"])

all = ["api_router"]
