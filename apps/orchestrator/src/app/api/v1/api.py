# Created automatically by Cursor AI (2024-08-24)
from fastapi import APIRouter
from app.api.v1.endpoints import health, workflows

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["workflows"])
