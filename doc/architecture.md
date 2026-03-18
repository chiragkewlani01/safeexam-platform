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

### Frontend Constraints (Security)

* Prevent tab switching (track via visibility API)
* Restrict copy/paste (planned)
* Force fullscreen mode
* Detect focus loss events

> ⚠️ Frontend restrictions are **not trusted alone** — backend validation is mandatory.

---

## ⚙️ 2. Backend Layer (FastAPI — Core System)

The backend is the **central authority** of the system.

---

### Responsibilities

* Handle authentication and authorization
* Manage exam lifecycle (create → start → submit → evaluate)
* Validate all user actions
* Process and store responses
* Generate results
* Track and log suspicious activity
* Enforce security rules

---

### Backend Structure

```text
server/
└── app/
    ├── main.py              # FastAPI entry point
    ├── api/                 # Route handlers
    │   ├── auth.py
    │   ├── exams.py
    │   ├── responses.py
    │   ├── results.py
    │   └── monitoring.py
    │
    ├── models/              # SQLAlchemy models
    ├── schemas/             # Pydantic schemas
    ├── services/            # Business logic layer
    ├── core/                # Config, security, auth utils
    └── utils/
```

---

### Architectural Pattern

SafeExam backend follows:

> **Controller → Service → Database**

| Layer            | Responsibility           |
| ---------------- | ------------------------ |
| API (Controller) | Handles request/response |
| Service          | Business logic           |
| Models/DB        | Data interaction         |

---

### Example Flow (Submit Exam)

```text
Frontend → POST /api/exam/submit
        ↓
API Layer (validate request)
        ↓
Service Layer (evaluate answers)
        ↓
Database (store responses + result)
        ↓
Response → Frontend
```

---

## 🗄️ 3. Data Layer (PostgreSQL — Neon DB)

### Why PostgreSQL (Neon)?

* Serverless & scalable
* Strong relational integrity
* ACID compliance
* Efficient for structured exam data

---

### Core Data Entities

* **users** → students/admins
* **exams** → exam metadata
* **questions** → exam questions
* **responses** → student answers
* **results** → scores and evaluation
* **activity_logs** → monitoring & cheating detection

---

### Data Flow

```text
User Action → Backend → Validation → DB Write → Response
```

---

## 🔐 Security Architecture

SafeExam implements **multi-layered security**:

---

### 1. Authentication Layer

* Students → Google OAuth
* Admin → Credential-based login
* Session handled via JWT or secure cookies

---

### 2. Authorization Layer

* Role-based access control (RBAC)

| Role    | Access                    |
| ------- | ------------------------- |
| Admin   | Full system control       |
| Student | Limited to assigned exams |

---

### 3. Exam Security Layer

* Fullscreen enforcement
* Tab-switch detection
* Focus loss tracking
* Activity logging

---

### 4. Backend Enforcement (CRITICAL)

Frontend signals are **not trusted blindly**

Backend validates:

* Exam timing
* Submission state
* Attempt limits
* Suspicious activity thresholds

---

## 👀 Monitoring & Activity Logging

### Approach

* No live real-time dashboard (initially)
* Logs stored in database
* Admin can view logs post-exam

---

### Events Tracked

* Tab switch
* Window blur/focus loss
* Exam start/end
* Submission time
* Suspicious behavior flags

---

### Flow

```text
Frontend Event → API (/monitoring/log)
               → Stored in activity_logs table
```

---

## 🔄 End-to-End System Flow

---

### Student Flow

```text
Login → Dashboard → Enter Code → Join Exam
     → Attempt Questions → Submit
     → Result Generated → View Result
```

---

### Admin Flow

```text
Login → Dashboard → Create Exam
     → Generate Code → Share
     → After Exam → View Results + Logs
```

---

## 📡 API Communication Model

* REST-based communication
* JSON request/response
* Stateless backend

---

### Request Lifecycle

```text
Client Request
   ↓
API Route (FastAPI)
   ↓
Schema Validation (Pydantic)
   ↓
Service Layer
   ↓
Database
   ↓
Response
```

---

## ⚡ Scalability Strategy (Startup Mindset)

SafeExam is designed to scale:

---

### Horizontal Scalability

* Backend can be deployed independently
* Stateless APIs allow load balancing

---

### Database Scalability

* Neon DB supports scaling automatically
* Connection pooling handled efficiently

---

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

This design makes SafeExam suitable for both academic use and real-world deployment.
