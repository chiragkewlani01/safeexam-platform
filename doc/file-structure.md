# File Structure — SafeExam (Scalable Project Architecture)

---

## 🧠 Overview

SafeExam follows a **monorepo structure** with clear separation between:

* Frontend (Next.js)
* Backend (FastAPI)
* Database
* Documentation

The architecture is designed to be:

* Scalable
* Maintainable
* Team-friendly

---

# 📂 Root Structure

```text id="v2i2b0"
safe-exam/
├── client/            # Frontend (Next.js)
├── server/            # Backend (FastAPI)
├── database/          # Schema & migrations
├── docs/              # Documentation
├── .env.example
├── README.md
```

---

# 🖥️ 1. Frontend Structure (client/)

---

## Architecture → Feature-Based

Each feature is self-contained.

```text id="q9j8ur"
client/
├── src/
│   ├── app/                # Next.js app router
│   ├── components/         # Shared UI components
│   ├── features/           # Feature modules
│   ├── hooks/              # Custom hooks
│   ├── store/              # Zustand stores
│   ├── services/           # API calls
│   ├── lib/                # utilities
│   ├── styles/             # global styles
│   └── config/             # constants
```

---

## 📦 Feature Example

```text id="74mdks"
features/
├── exam/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   └── index.ts
```

---

## Rules

* One feature = one folder
* No cross-feature logic
* Keep components reusable

---

# ⚙️ 2. Backend Structure (server/)

---

## Architecture → Strict Layered

```text id="r1b3od"
server/
└── app/
    ├── main.py
    ├── api/                # Controllers (routes)
    ├── services/           # Business logic
    ├── models/             # DB models
    ├── schemas/            # Pydantic schemas
    ├── core/               # config, auth, db
    ├── utils/              # helpers
```

---

## 📦 API Layer

```text id="n8a8dy"
api/
├── auth.py
├── exams.py
├── responses.py
├── results.py
├── monitoring.py
```

---

## 📦 Service Layer

```text id="zq88ai"
services/
├── auth_service.py
├── exam_service.py
├── response_service.py
├── monitoring_service.py
```

---

## Rules

* No DB logic inside API
* All logic inside services
* Models only define schema

---

# 🗄️ 3. Database Folder

---

```text id="3xkmqk"
database/
├── schema.sql
├── migrations/
```

---

## Rules

* Update schema first
* Then update models
* Keep migrations consistent

---

# 📄 4. Docs Folder

---

```text id="r8yp4z"
docs/
├── architecture.md
├── database-design.md
├── api-design.md
├── auth-and-security.md
├── exam-flow.md
├── monitoring-system.md
├── frontend-guidelines.md
├── file-structure.md
```

---

# 🔐 5. Environment Files

---

```text id="d50tq0"
.env.example
```

---

## Rules

* Never push real `.env`
* Use `.env.example` for reference

---

# 🧠 6. Naming Conventions

---

## Frontend

* Components → PascalCase
  `ExamCard.jsx`

* Hooks → camelCase
  `useExam.js`

---

## Backend

* Files → snake_case
  `exam_service.py`

---

# ⚡ 7. Development Rules

---

## Frontend

* UI logic only
* API calls via services

---

## Backend

* API → validation only
* Services → logic
* Models → schema only

---

## General

* No duplicate logic
* Keep code modular
* Follow separation of concerns

---

# 🚀 8. Scaling Strategy

---

## When Project Grows

* Split frontend/backend repos
* Add microservices
* Introduce CI/CD
* Add testing folders

---

# ⚠️ 9. Common Mistakes

---

❌ Mixing frontend and backend
❌ Writing logic inside API routes
❌ Large components
❌ No folder structure

---

# 📌 Summary

SafeExam file structure ensures:

* Clean separation of frontend and backend
* Modular feature-based frontend
* Strict backend architecture
* Scalable and maintainable system

This structure supports both **development speed and long-term scalability**.
