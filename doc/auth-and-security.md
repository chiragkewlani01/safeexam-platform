# Authentication & Security Architecture — SafeExam

---

## 🧠 Overview

SafeExam is built with a **security-first architecture** to ensure exam integrity and prevent malpractice.

The system implements:

* Secure authentication (Google OAuth + Admin login)
* Role-based access control (RBAC)
* JWT-based session management
* Multi-layer anti-cheating system
* Backend-enforced validation

---

# 🔐 1. Authentication System

---

## 1.1 Student Authentication (Google OAuth)

SafeExam uses **Google OAuth 2.0** for student login.

---

### Flow

```text
Student → Click "Login with Google"
        ↓
Google OAuth
        ↓
Frontend receives ID Token
        ↓
POST /api/auth/google
        ↓
Backend verifies token with Google
        ↓
User created/fetched in DB
        ↓
JWT issued
        ↓
User logged in
```

---

### Backend Verification (CRITICAL)

The backend must verify:

* Token signature
* Token expiration
* Email authenticity

```python
# Pseudo logic

verify_google_token(token)

if not valid:
    raise Unauthorized

user = get_or_create_user(email)
jwt = generate_jwt(user)
```

---

## 1.2 Admin Authentication

Admins use a **separate login system**.

---

### Flow

```text
Admin → Login (email/password)
      ↓
POST /api/auth/admin-login
      ↓
Backend validates credentials
      ↓
JWT issued
```

---

### Notes

* Passwords must be hashed (bcrypt)
* Admin access is restricted

---

# 🎫 2. JWT Session Management

---

## Token Structure

```json
{
  "user_id": 1,
  "role": "student",
  "exp": 1710000000
}
```

---

## Usage

All protected APIs require:

```http
Authorization: Bearer <JWT>
```

---

## Rules

* Token expiry (recommended: 1–2 hours)
* Refresh tokens (future enhancement)
* Never trust client-side role → always validate in backend

---

# 🛂 3. Authorization (RBAC)

---

## Roles

| Role    | Permissions             |
| ------- | ----------------------- |
| Admin   | Full access             |
| Student | Exam participation only |

---

## Enforcement

Every API must validate role:

```python
if user.role != "admin":
    raise Forbidden
```

---

## Example

* `/api/exams` → admin only
* `/api/responses` → student only

---

# 🛡️ 4. Multi-Layer Security Model

SafeExam security is implemented in **3 layers**:

---

## 4.1 Frontend Layer (UI Restrictions)

* Fullscreen enforcement
* Tab switch detection
* Focus tracking
* Input restrictions (planned)

⚠️ These are **not trusted alone**

---

## 4.2 Backend Layer (Core Enforcement)

Backend validates:

* Exam is active
* User is allowed
* Submission not duplicated
* Time constraints

---

## 4.3 Database Layer

* Constraints (FK, unique)
* Data consistency
* Logging all events

---

# 🚨 5. Anti-Cheating System

---

## 5.1 Event Tracking

Tracked events:

* TAB_SWITCH
* WINDOW_BLUR
* COPY_ATTEMPT (future)
* MULTIPLE_LOGIN (future)

---

## 5.2 Monitoring Flow

```text
Frontend Event
    ↓
POST /api/monitoring/log
    ↓
Backend stores event
    ↓
Checks violation count
```

---

## 5.3 Violation Threshold System

```text
1–2 violations → Warning
3–4 → Flagged
5+ → Auto-submit exam
```

---

## 5.4 Backend Enforcement

```python
if violation_count >= 5:
    auto_submit_exam(user)
```

---

# ⛔ 6. Critical Security Rules

---

## 6.1 Never Trust Frontend

* Always validate in backend
* Never rely on client logic

---

## 6.2 Validate Every Request

* Auth token
* Exam state
* User permissions

---

## 6.3 Prevent Replay Attacks

* Check submission status
* Prevent duplicate submissions

---

## 6.4 Rate Limiting

Apply limits on:

* Autosave APIs
* Monitoring APIs
* Login attempts

---

# 🔐 7. Password Security (Admin)

---

* Use bcrypt hashing
* Never store plain passwords
* Enforce minimum complexity

---

# 🧠 8. Secure Coding Practices

---

* Input validation (Pydantic)
* Use ORM (avoid raw SQL)
* Avoid exposing internal errors
* Log securely

---

# 📡 9. Logging & Auditing

---

## Logged Data

* Login attempts
* Exam actions
* Suspicious behavior

---

## Usage

* Review after exam
* Identify cheating patterns
* Improve system

---

# 🚀 10. Future Security Enhancements

---

* AI-based proctoring (face detection)
* Device fingerprinting
* IP tracking
* Multi-device detection
* Secure browser mode

---

# 📌 Summary

SafeExam security architecture ensures:

* Secure authentication (Google + Admin)
* Strong authorization (RBAC)
* Anti-cheating via monitoring
* Backend-enforced validation

This makes SafeExam a **reliable and secure examination platform** suitable for real-world deployment.

