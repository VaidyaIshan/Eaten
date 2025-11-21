from fastapi import FastAPI
from db import engine, Base
from routes import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(api_router)



