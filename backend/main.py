from fastapi import FastAPI
from db import engine, Base, SessionLocal
from routes import api_router
from fastapi.middleware.cors import CORSMiddleware
import models
from contextlib import asynccontextmanager  
from services.roles_services import create_roles
from services.create_superadmin import create_superadmin

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        create_roles(db)
        create_superadmin(db)
    except Exception as e:
        print(f"Startup error: {e}")
    finally:
        db.close()
    yield

app = FastAPI(lifespan=lifespan)  
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)