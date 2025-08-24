# Created automatically by Cursor AI (2024-08-24)
import os
import sys
from celery import Celery
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Create Celery app
celery_app = Celery(
    "pitch_coach_workers",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    include=[
        "app.tasks.deck_writer",
        "app.tasks.evidence_binder", 
        "app.tasks.finance_linter",
        "app.tasks.market_sizer",
        "app.tasks.qa_generator",
        "app.tasks.speech_analyzer",
        "app.tasks.exporter"
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
)

if __name__ == "__main__":
    celery_app.start()
