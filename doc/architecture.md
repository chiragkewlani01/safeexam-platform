# Code Execution Flow

Backend receives code submission → Sends to Judge0 (external code execution API) → Receives result → Stores in `coding_submissions` table → Returns result to frontend.
# System Architecture — SafeExam

SafeExam is a secure, scalable, full-stack online examination platform designed with a **security-first and API-driven architecture**. It ensures exam integrity through controlled environments, backend validation, and activity monitoring.

---

## 🧱 Architectural Overview

SafeExam follows a **3-tier architecture** with clear separation of concerns:

```text
Client (Browser)
      ↓
Frontend (Next.js / React)
      ↓
Backend API (FastAPI)
      ↓
Database (PostgreSQL — Neon DB)
```

---

## 🧩 Exam Session Layer (CORE)

Each exam attempt is tracked as a session.

```
user + exam = session
```

This enables:
- resume functionality
- timer tracking
- monitoring integration
- single attempt enforcement

---

## 🖥️ 1. Client Layer (Frontend — Next.js)

### Responsibilities

* Render UI for students and admins
* Handle authentication flow (Google OAuth for students)
* Manage exam interface (questions, timer, navigation)
* Enforce UI-level restrictions
* Communicate with backend via REST APIs

---

### Key Interfaces

#### 1. Landing Page

* Marketing content
* Product overview
* Entry point (login)

#### 2. Student Dashboard

* Enter exam code / URL
* View results

#### 3. Admin Dashboard

* Create exams
* Manage questions
* View results

#### 4. Exam Interface

* Fullscreen mode (enforced)
* Timer-based session
* Auto-save answers
* Navigation across questions

---

## 🗄️ 2. Backend Layer (FastAPI)

* Stateless REST APIs
* All endpoints versioned under `/api/v1/`
* Session-centric: all flows use `session_id`
* Authentication via httpOnly cookies (Secure, SameSite=strict)
* Rate limiting and monitoring integrated

---

## 🗄️ 3. Database Layer (PostgreSQL)

* Normalized schema
* Core entities: users, exams, exam_sessions, responses, activity_logs, results
* All monitoring and responses tied to `session_id`

---

## ⚡ Scalability Strategy

SafeExam is designed to scale:

### Horizontal Scalability

* Backend can be deployed independently
* Stateless APIs allow load balancing

### Database Scalability

* Neon DB supports scaling automatically
* Connection pooling handled efficiently

### Future Enhancements

* WebSockets (real-time proctoring)
* Microservices (auth, exam, analytics)
* Queue system (for evaluation)
* CDN for static assets

---

## 🧠 Design Principles

* **Separation of Concerns**
* **Security-first approach**
* **Stateless backend**
* **API-driven system**
* **Scalable by design**

---

## 📌 Summary

SafeExam architecture ensures:

* Clean separation between frontend and backend
* Strong backend validation for security
* Reliable data storage using PostgreSQL
* Scalable structure for future growth
* Session-centric design for all exam flows

This design makes SafeExam suitable for both academic use and real-world deployment.
