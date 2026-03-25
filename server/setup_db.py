#!/usr/bin/env python3
"""
SafeExam Database Setup Script
Initializes PostgreSQL database tables for SafeExam demo
"""

import sys
import os
from pathlib import Path

# Add server directory to path
server_path = Path(__file__).parent / "server"
sys.path.insert(0, str(server_path))

from app.core.config import settings
from app.core.database import Base, engine
from app.models.user import User
from app.models.exam import Exam

def setup_database():
    """Create all tables in the database"""
    
    print("🚀 SafeExam Database Setup")
    print("==========================\n")
    
    print(f"📊 Database: {settings.DATABASE_URL}")
    print()
    
    try:
        print("📋 Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!\n")
        
        print("📊 Schema Summary:")
        print("  - users (id, email, name, password_hash, role, created_at)")
        print("  - exams (id, title, duration, exam_code, created_by, created_at)")
        print()
        
        print("✅ Setup Complete!")
        print()
        print("Next steps:")
        print("1. Make sure your .env file is configured")
        print("2. Start the backend: python -m uvicorn app.main:app --reload")
        print("3. Start the frontend: npm run dev")
        print()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Check if PostgreSQL is running")
        print("2. Verify DATABASE_URL in .env file")
        print("3. Make sure the database exists: createdb safeexam")
        sys.exit(1)

if __name__ == "__main__":
    setup_database()
