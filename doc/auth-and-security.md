# Authentication & Security Architecture — SafeExam

---

## 🧠 Overview

SafeExam is built with a **security-first architecture** to ensure exam integrity and prevent malpractice.

The system implements:

* Secure authentication (Google OAuth + Admin login)
* Role-based access control (RBAC)
* Session management via httpOnly cookies (Secure, SameSite=strict)
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
POST /api/v1/auth/google
        ↓
Backend verifies token with Google
        ↓
User created/fetched in DB
        ↓
Session cookie set (httpOnly, Secure, SameSite=strict)
        ↓
User logged in
```

---

### Backend Verification (CRITICAL)

The backend must verify:

* Token signature
* Token expiration
* Email authenticity

---

## 1.2 Admin Authentication

Admins use a **separate login system**.

---

### Flow

```text
Admin → Login (email/password)
      ↓
POST /api/v1/auth/admin-login
      ↓
Backend validates credentials
      ↓
Session cookie set (httpOnly, Secure, SameSite=strict)
      ↓
User logged in
```

---

### Notes

* Passwords must be hashed (bcrypt)
* Admin access is restricted

---

# 🎫 2. Session Management

---

* All authentication uses httpOnly cookies (Secure, SameSite=strict)
* No Authorization header is used
* Single device login enforced: new login invalidates previous session

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

* `/api/v1/exams` → admin only

---

# 🛡️ 4. Security Best Practices

# 🛡️ 4. Security Best Practices

* All cookies: httpOnly, Secure, SameSite=strict
* No sensitive data in localStorage/sessionStorage
* All endpoints protected by authentication middleware
* Single device login enforced

---

# 🛡️ 5. CSRF Protection

SafeExam uses cookies for authentication, so **CSRF protection is required**.

- A CSRF token is generated and sent to the frontend (e.g., as a cookie or in a response header).
- The frontend must include the CSRF token in a custom header (e.g., `X-CSRF-Token`) for all state-changing requests (POST, PUT, DELETE).
- The backend validates the CSRF token on every such request.

This prevents cross-site request forgery attacks when using cookies for session management.