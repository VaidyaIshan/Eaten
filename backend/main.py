from fastapi import FastAPI

from db import engine, Base
from routes.auth import router as auth_router
from routes.events import router as event_router
from routes.feedbacks import router as feedback_router
from routes.meal_sessions import router as meal_session_router


Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(auth_router)
app.include_router(event_router)
app.include_router(feedback_router)
app.include_router(meal_session_router)

