# API Design — SafeExam (FastAPI)

---

## Versioning

All APIs are versioned under `/api/v1/`.

---

## Session APIs

### Start Exam Session

```http
POST /api/v1/sessions/start
```

### Get Current Session

```http
GET /api/v1/sessions/current
```

---

## Middleware Concept

Use dependency injection for authentication and role-based access:

- `Depends(get_current_user)`
- `Depends(require_role("admin"))`

---

## 🧠 Overview

SafeExam backend follows a **RESTful API architecture** built using FastAPI.

* Stateless APIs
* JSON-based communication
* httpOnly cookies for authentication
* Strict validation using Pydantic

---

## 🧱 API Structure

```text
server/app/api/
├── auth.py
├── exams.py
├── questions.py
├── responses.py
├── results.py
├── monitoring.py
```

---

## 🔐 Authentication Flow

---

### Google Login (Student)

1. Frontend → Google OAuth
2. Google returns ID token
3. Frontend sends token:

```http
POST /api/v1/auth/google
```

### Request

```json
{
  "token": "google_id_token"
}
```

### Backend Flow

* Verify token with Google
* Check user in DB
* Create if not exists
* Set httpOnly cookie (secure, SameSite=strict)

### Response

```json
{
  "user": {
    "id": 1,
    "role": "student"
  }
}
```

---

### Admin Login

```http
POST /api/v1/auth/admin-login
```

---

## 🧪 Exam APIs

---

### Create Exam (Admin)

```http
POST /api/v1/exams
```

### Body

```json
{
  "title": "Mid Sem Test",
  "duration": 60,
  "questions": [...]
}
```

---

### Get Exams

```http
GET /api/v1/exams?page=1&limit=20
```

---

### Join Exam (Student)

```http
POST /api/v1/exams/join
```

```json
{
  "exam_code": "ABC123"
}
```

---

## 📝 Response APIs (Autosave + Submit)

---

### Autosave Answer

```http
POST /api/v1/responses/save
```

```json
{
  "session_id": 1,
  "question_id": 10,
  "selected_option": "A"
}
```

✔ Called frequently (rate limited to 5 req/sec)
✔ Lightweight

---

### Final Submit

```http
POST /api/v1/responses/submit
```

```json
{
  "session_id": 1
}
```

### Backend Logic

* Fetch all saved answers
* Evaluate
* Store result

---

## 📊 Result APIs

---

### Get Result (Student)

```http
GET /api/v1/results/{session_id}
```

---


### Get All Results (Admin, Paginated)

```http
GET /api/v1/results?exam_id=1&page=1&limit=20
```

---

## 👀 Monitoring APIs

---

### Log Activity

```http
POST /api/v1/monitoring/log
```

```json
{
  "session_id": 1,
  "event": "TAB_SWITCH",
  "timestamp": "2026-03-18T10:00:00Z"
}
```

---

## Backend Responsibilities

* Validate user and session
* Store log
* Update violation count (debounced, no reset during exam)
* Decide action

---

# ⚠️ Global Improvements

- **Rate Limiting:** Autosave → 5 req/sec max
- **Monitoring:** Debounced (2–3 sec)
- **Naming Fix:** `/api/exams/start` → `/api/v1/sessions/start`
- **Session-centric:** All flows use `session_id`

---

# 🧠 FINAL ARCHITECTURE

User  
↓  
Session (CORE)  
↓  
Responses + Monitoring  
↓  
Evaluation  
↓  
Result