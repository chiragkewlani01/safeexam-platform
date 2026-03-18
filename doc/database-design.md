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

---

## 🗄️ Tables

---

### 1. Users Table

```sql
users
-----
id (PK)
email (unique)
name
role (student/admin)
created_at
```

---

## 🔗 Foreign Key Constraints (Recommended)

All tables use **foreign key constraints** to enforce referential integrity. This ensures:

- No orphaned records (e.g., responses always reference valid sessions/questions)
- Cascading deletes/updates can be configured as needed
- Database consistency is maintained at all times

Example:

```sql
ALTER TABLE responses
ADD CONSTRAINT fk_session
FOREIGN KEY (session_id) REFERENCES exam_sessions(id)
ON DELETE CASCADE;
```

---

### 2. Exams Table

```sql
exams
-----
id (PK)
title
duration
created_by (FK → users.id)
exam_code (unique)
created_at
```

---

id (PK)
exam_id (FK)
question_text
question_type (mcq/subjective)
options (JSONB)
correct_answer

### 3. Questions Table

```sql
questions
---------
id (PK)
exam_id (FK)
question_text
question_type (mcq/coding)
question_type_details (JSONB) -- e.g., starter code, test cases for coding
options (JSONB) -- for mcq
correct_answer -- for mcq/coding
```
### 8. Coding Submissions Table

```sql
coding_submissions
------------------
id (PK)
session_id (FK)
question_id (FK)
code
language
stdout
stderr
execution_time
status
is_correct
submitted_at
```

---

### 4. Exam Sessions Table

```sql
exam_sessions
-------------
id (PK)
user_id (FK)
exam_id (FK)
start_time
end_time
status (active/completed/terminated)
violations_count
last_activity
```

---

### 5. Responses Table

```sql
responses
---------
id (PK)
session_id (FK)
question_id (FK)
selected_option
is_correct
answered_at
```

---

### 6. Results Table

```sql
results
-------
id (PK)
session_id (FK)
score
evaluated_at
```

---

### 7. Activity Logs Table

```sql
activity_logs
--------------
id (PK)
session_id (FK)
event_type
timestamp
metadata (JSONB)
```