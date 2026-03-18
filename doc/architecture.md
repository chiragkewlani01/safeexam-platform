# docs/architecture.md

# System Architecture — SafeExam

SafeExam follows a full-stack architecture with clear separation of concerns.

---

## 🧱 High-Level Flow

User (Browser)
↓
Frontend (React / Next.js)
↓
Backend (Node.js / API Layer)
↓
Database (Student, Exam, Results)

---

## 🧩 Components

### 1. Frontend

* Handles UI and user interaction
* Manages authentication state
* Sends API requests

### 2. Backend

* Handles business logic
* Validates exam rules
* Processes submissions
* Manages security checks

### 3. Database

* Stores users, exams, responses, results

---

## 🔐 Security Layer

* Role-based access (Admin / Student)
* Session validation
* Exam restrictions (fullscreen, tab switch detection)
* Activity logging

---

## 🔄 Data Flow Example

Student → Login → Join Exam → Submit Answers
→ Backend validates → Stores in DB → Generates Result

---

## ⚙️ Design Principles

* Modular architecture
* API-driven communication
* Secure by default
* Scalable structure
