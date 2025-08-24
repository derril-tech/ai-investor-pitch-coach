# Created automatically by Cursor AI (2024-08-24)
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Investor Pitch Coach Orchestrator"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/pitch_coach_dev"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # NATS
    NATS_URL: str = "nats://localhost:4222"
    
    # AI Services
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    
    # Storage
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY_ID: str = "minioadmin"
    S3_SECRET_ACCESS_KEY: str = "minioadmin"
    S3_BUCKET_NAME: str = "pitch-coach-dev"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
