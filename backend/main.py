from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from db import engine, Base, SessionLocal
from routes import api_router
import models

from services.roles_services import create_roles
from services.create_superadmin import create_superadmin


@asynccontextmanager
async def lifespan(app: FastAPI):

    # ✅ Create tables
    Base.metadata.create_all(bind=engine)

    # ✅ Seed default data
    db = SessionLocal()
    try:
        create_roles(db)
        create_superadmin(db)
        print("Startup tasks completed")
    except Exception as e:
        print(f"Startup error: {e}")
    finally:
        db.close()

    yield


app = FastAPI(lifespan=lifespan)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
