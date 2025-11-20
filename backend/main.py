from fastapi import FastAPI

from db import engine, Base
from routes.auth import router as auth_router
from routes.events import router as event_router


Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(auth_router)
app.include_router(event_router)

