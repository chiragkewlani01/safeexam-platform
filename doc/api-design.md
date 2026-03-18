# API Design — SafeExam (FastAPI)

---

## 🧠 Overview

SafeExam backend follows a **RESTful API architecture** built using FastAPI.

* Stateless APIs
* JSON-based communication
* JWT authentication
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
POST /api/auth/google
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
* Issue JWT

### Response

```json
{
  "access_token": "jwt_token",
  "user": {
    "id": 1,
    "role": "student"
  }
}
```

---

### Admin Login

```http
POST /api/auth/admin-login
```

---

## 🧪 Exam APIs

---

### Create Exam (Admin)

```http
POST /api/exams
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
GET /api/exams?page=1&limit=20
```

---

### Join Exam (Student)

```http
POST /api/exams/join
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
POST /api/responses/save
```

```json
{
  "exam_id": 1,
  "question_id": 10,
  "answer": "A"
}
```

✔ Called frequently
✔ Lightweight

---

### Final Submit

```http
POST /api/responses/submit
```

```json
{
  "exam_id": 1
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
GET /api/results/{exam_id}
```

---

### Get All Results (Admin)

```http
GET /api/results?exam_id=1
```

---

## 👀 Monitoring APIs

---

### Log Activity

```http
POST /api/monitoring/log
```

```json
{
  "exam_id": 1,
  "event": "TAB_SWITCH",
  "timestamp": "2026-03-18T10:00:00Z"
}
```

---

### Backend Logic

* Count violations
* Store logs
* Trigger actions

---

### Example Rule

```text
1–2 switches → warning
3–4 → flag
5+ → auto-submit exam
```

---

## 🔐 Security Design

---

### 1. JWT Authentication

* All protected routes require:

```http
Authorization: Bearer <token>
```

---

### 2. Validation (Pydantic)

All requests validated before processing.

---

### 3. Rate Limiting

* Prevent spam (autosave, monitoring APIs)

---

### 4. Backend Validation

Never trust frontend:

* Check exam active
* Check user eligibility
* Check submission state

---

## 📦 Response Format

---

### Success

```json
{
  "success": true,
  "data": {...}
}
```

---

### Error

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## ⚡ HTTP Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 200  | Success          |
| 201  | Created          |
| 400  | Bad request      |
| 401  | Unauthorized     |
| 403  | Forbidden        |
| 404  | Not found        |
| 422  | Validation error |
| 500  | Server error     |

---

## 🔄 Request Lifecycle

```text
Client Request
   ↓
API Route (FastAPI)
   ↓
Pydantic Validation
   ↓
Service Layer
   ↓
Database
   ↓
Response
```

---

## 🧠 Best Practices

* Keep APIs small and focused
* Use consistent naming
* Always validate input
* Never expose internal logic

---

## 🚀 Future Enhancements

* WebSocket-based monitoring
* GraphQL (optional)
* API versioning
* Caching layer

---

## 📌 Summary

SafeExam APIs are:

* RESTful
* Secure
* Scalable
* Designed for real-time interaction

They ensure reliable exam flow, secure submissions, and efficient monitoring.
