# 10. External Services

- Judge0 API (for code execution)
    - Set API key as environment variable
    - Ensure outbound network access to Judge0 service
# Deployment Guide — SafeExam

---

## 🧠 Overview

SafeExam is designed for secure, scalable deployment using FastAPI (backend), Next.js (frontend), and PostgreSQL (Neon DB).

---

## 1. Backend Deployment (FastAPI)

* Use Uvicorn or Gunicorn for production
* Set environment variables for DB, secrets, etc.

---

## 2. Frontend Deployment (Next.js)

* Deploy on Vercel, Netlify, or any Node.js-compatible host

---

## 3. Database (Neon DB)

* Provision database and set credentials in backend

---

## 4. CORS Configuration (FastAPI)

Add the following to your FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 5. Environment Variables

* Store secrets and config in environment variables

---

## 6. HTTPS

* Always use HTTPS in production
* Set Secure flag on all cookies

---

## 7. Monitoring & Logging

* Enable backend logging
* Monitor error rates and performance

---

## 8. Scaling

* Use stateless containers for backend
* Use managed DB for scaling


## 9. Health Check

Add a health check endpoint to your FastAPI app:

```python
@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}
```