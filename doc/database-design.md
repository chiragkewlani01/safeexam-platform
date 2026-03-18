# Database: Design, Connection & Query Patterns — SafeExam

---

## 🧠 Overview

SafeExam uses **PostgreSQL (Neon DB)** as its primary database.

* Fully relational → ideal for structured exam data
* ACID compliant → ensures data integrity during submissions
* Serverless (Neon) → scalable and production-ready

The backend uses **SQLAlchemy ORM** for database interaction.

---

## ⚙️ Database Connection Setup (FastAPI + SQLAlchemy)

We use a **singleton engine + session factory**.

```python
# server/app/core/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine (connection pool managed internally)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base model
Base = declarative_base()
```

---

## 🔌 Dependency Injection (FastAPI)

Always use dependency injection for DB sessions:

```python
# server/app/core/deps.py

from .database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 🌱 Environment Variables

```env
# .env
DATABASE_URL=postgresql+psycopg2://user:password@host/dbname
```

---

## 🧱 Project Structure (DB Layer)

```text
server/app/
├── models/        # SQLAlchemy models
├── schemas/       # Pydantic schemas
├── services/      # DB queries & business logic
├── core/
│   ├── database.py
│   └── deps.py
```

---

## 📊 Core Database Schema

---

### 1. Users Table

```sql
users
------
id (PK)
name
email (unique)
role (admin/student)
created_at
```

---

### 2. Exams Table

```sql
exams
------
id (PK)
title
description
duration
created_by (FK → users.id)
exam_code (unique)
created_at
```

---

### 3. Questions Table

```sql
questions
---------
id (PK)
exam_id (FK)
question_text
question_type (mcq/subjective)
options (JSONB)
correct_answer
```

---

### 4. Responses Table

```sql
responses
---------
id (PK)
student_id (FK)
exam_id (FK)
answers (JSONB)
submitted_at
```

---

### 5. Results Table

```sql
results
-------
id (PK)
student_id (FK)
exam_id (FK)
score
evaluated_at
```

---

### 6. Activity Logs Table

```sql
activity_logs
--------------
id (PK)
user_id
exam_id
event_type
timestamp
metadata (JSONB)
```

---

## 🧩 SQLAlchemy Model Example

```python
# server/app/models/exam.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    duration = Column(Integer)
    exam_code = Column(String, unique=True, index=True)
    created_by = Column(Integer, ForeignKey("users.id"))
```

---

## 🧠 Service Layer Pattern (IMPORTANT)

All database logic goes inside **services/**

```python
# server/app/services/exam_service.py

from sqlalchemy.orm import Session
from app.models.exam import Exam

def get_exams(db: Session, skip: int = 0, limit: int = 20):
    return db.query(Exam).offset(skip).limit(limit).all()

def get_exam_by_code(db: Session, code: str):
    return db.query(Exam).filter(Exam.exam_code == code).first()

def create_exam(db: Session, data):
    exam = Exam(**data)
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam
```

---

## 🔐 Query Writing Rules (CRITICAL)

---

### 1. Never use raw string queries

```python
# ❌ BAD
db.execute(f"SELECT * FROM exams WHERE id = {id}")

# ✅ GOOD
db.query(Exam).filter(Exam.id == id)
```

---

### 2. Always use ORM or parameterized queries

Prevents SQL injection.

---

### 3. Always commit explicitly

```python
db.add(obj)
db.commit()
db.refresh(obj)
```

---

### 4. Use transactions for multi-step operations

```python
def create_exam_with_questions(db: Session, exam_data, questions):
    try:
        exam = Exam(**exam_data)
        db.add(exam)
        db.flush()  # get exam.id

        for q in questions:
            q.exam_id = exam.id
            db.add(q)

        db.commit()
        return exam
    except:
        db.rollback()
        raise
```

---

### 5. Use pagination everywhere

```python
skip = (page - 1) * limit
db.query(Exam).offset(skip).limit(limit)
```

---

### 6. Avoid SELECT *

Only fetch required fields when needed.

---

### 7. Use JSONB wisely

* Store flexible data like:

  * MCQ options
  * answers
  * logs metadata

---

## ⚡ Performance Best Practices

* Add indexes on:

  * exam_code
  * user_id
  * exam_id

* Use connection pooling (handled by SQLAlchemy)

* Avoid N+1 queries (use joins when needed)

---

## 🔄 Data Integrity Rules

* Foreign keys enforced

* Unique constraints:

  * email
  * exam_code

* Validate data at:

  * API layer (Pydantic)
  * DB layer (constraints)

---

## 👀 Activity Logging Strategy

* Every suspicious event stored in `activity_logs`
* No real-time processing initially
* Used later for:

  * analytics
  * cheating detection

---

## 🚀 Future Enhancements

* Read replicas (for scaling)
* Partitioning (large exam datasets)
* Caching layer (Redis)
* Async DB support

---

## 📌 Summary

SafeExam database layer is:

* Structured (PostgreSQL)
* Secure (ORM-based queries)
* Scalable (Neon DB)
* Maintainable (service-layer pattern)

This ensures reliable exam data handling and system stability.
