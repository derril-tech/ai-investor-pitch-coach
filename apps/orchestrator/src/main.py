# Created automatically by Cursor AI (2024-08-24)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from app.core.config import settings
from app.api.v1.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Investor Pitch Coach Orchestrator...")
    yield
    # Shutdown
    print("🛑 Shutting down Investor Pitch Coach Orchestrator...")


app = FastAPI(
    title="Investor Pitch Coach Orchestrator",
    description="CrewAI-powered orchestration service for pitch coaching",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "pitch-coach-orchestrator",
        "version": "0.1.0"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
