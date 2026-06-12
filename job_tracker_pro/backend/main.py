import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import seed
from database import Base, SessionLocal, engine
from models import Application
from routers import ai, analytics, applications, pdf
from services.scheduler import start_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if db.query(Application).count() == 0:
            seed.run_seed(db)
    finally:
        db.close()

    start_scheduler(app)
    yield


app = FastAPI(title="Job Tracker Pro API", lifespan=lifespan)

default_origins = "http://localhost:5173,http://127.0.0.1:5173"
cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(applications.router)
app.include_router(analytics.router)
app.include_router(ai.router)
app.include_router(pdf.router)


@app.get("/")
def root():
    return {"message": "Job Tracker Pro API", "docs": "/docs"}
