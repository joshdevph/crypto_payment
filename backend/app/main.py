import os
from fastapi import FastAPI
from app.api import checkout_router, webhook_router
from fastapi.middleware.cors import CORSMiddleware
from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    checkout_router,
    prefix="/api/checkout",
    tags=["Checkout"]
)

app.include_router(
    webhook_router,
    prefix="/api/webhook",
    tags=["Webhook"]
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}