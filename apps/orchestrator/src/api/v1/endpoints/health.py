# Created automatically by Cursor AI (2024-08-24)
from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "pitch-coach-orchestrator",
        "version": "0.1.0"
    }
