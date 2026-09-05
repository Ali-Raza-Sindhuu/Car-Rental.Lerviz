from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import redis

from app.config import settings
from app.database import get_db, engine, Base
from app.redis_client import get_redis

# Create tables if not using Alembic migrations initially
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Car Rental API with FastAPI, PostgreSQL, and Redis",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Car Rental API is running",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
    }


@app.get("/health")
def health_check(
    db: Session = Depends(get_db),
    r: redis.Redis = Depends(get_redis),
):
    health_status = {
        "status": "healthy",
        "database": "unknown",
        "redis": "unknown",
    }

    # Check PostgreSQL
    try:
        db.execute(text("SELECT 1"))
        health_status["database"] = "connected"
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["database"] = f"error: {str(e)}"

    # Check Redis
    try:
        if r.ping():
            health_status["redis"] = "connected"
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["redis"] = f"error: {str(e)}"

    if health_status["status"] != "healthy":
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=health_status,
        )

    return health_status


@app.get("/api/demo-counter")
def demo_counter(r: redis.Redis = Depends(get_redis)):
    """Simple demo endpoint showing Redis cache / counter in action."""
    count = r.incr("page_hits")
    return {"hits": count, "message": "Redis counter working successfully!"}