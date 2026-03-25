import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/safeexam")
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "demo-secret-key-change-in-production")
    
    # Server
    HOST: str = os.getenv("HOST", "localhost")
    PORT: int = int(os.getenv("PORT", 8000))
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

settings = Settings()
