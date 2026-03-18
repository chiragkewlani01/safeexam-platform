# Coding Question Flow

1. Student submits code via UI.
2. Backend sends code to Judge0 for execution.
3. Judge0 executes code asynchronously.
4. Backend polls Judge0 for result.
5. Result (output, status) is saved and returned to student.
# Exam Flow — SafeExam (Lifecycle & System Behavior)

---

## 🧠 Overview

This document defines the **complete lifecycle of an exam session** in SafeExam, covering:

* Student journey
* Backend interactions
* Autosave system
* Resume logic
* Edge cases

The system is designed to be **fault-tolerant, secure, and user-friendly**.

---

# 🧪 1. High-Level Flow

```text
Login → Dashboard → Join Exam → Instructions → Start Exam
     → Attempt Questions → Autosave → Submit
     → Result Generation → View Result
```

---

## Session Binding

Every exam request includes `session_id`.

---

## Timer Sync

Frontend syncs timer every 15–20 seconds with backend. Timer is backend-controlled.

---

# 🎯 2. Pre-Exam Phase

---

## 2.1 Join Exam

### Flow

```text
Student enters exam code / URL
        ↓
POST /api/v1/exams/join
        ↓
Backend validates:
  - exam exists
  - exam is active
        ↓
Return exam metadata
```

---

## 2.2 Instructions Screen

### UI Behavior

* Show:

  * exam title
  * duration
  * instructions
  * rules (no tab switch, etc.)

---

### Important Rule

👉 Timer does NOT start here

---

## 2.3 Start Exam

### Trigger

Student clicks **"Start Exam"**

---

### Backend Call

```http
POST /api/v1/sessions/start
```

---

### Backend Logic

* Create exam session
* Record start time
* Initialize tracking

---

### Timer Behavior

* Timer starts ONLY after clicking start
* Stored and controlled on backend (not frontend)

---

# 🧠 3. Exam Session Phase

---

## 3.1 Question Loading

### Behavior

* Questions randomized per student
* Same randomness pattern per session
* Loaded from backend

---

### API

```http
GET /api/v1/sessions/{session_id}/questions
```

---

## 3.2 Navigation

### Mode → Free Navigation

* Student can:

  * move between questions
  * revisit answers
  * skip questions

---

## 3.3 Autosave System (CRITICAL)

---

### Strategy → Hybrid (Best Practice)

---

### 1. On Change

```text
User selects answer
        ↓
POST /api/v1/responses/save
```

---

### 2. Periodic Sync

* Every 15–20 seconds:

  * send unsaved answers

---

# 📝 4. Submit & Evaluation

---

### Submit

```http
POST /api/v1/responses/submit
```

```json
{
  "session_id": 1
}
```

---

### Backend Logic

* Fetch all saved answers for session
* Evaluate
* Store result

---

# 🧩 5. Resume & Edge Cases

* Session can be resumed if not completed/terminated
* All actions require valid `session_id`
* Timer always validated against backend

---

# 🛡️ 6. Security & Monitoring

* All monitoring and activity logs use `session_id`
* Debounce logic for monitoring (2–3 sec)
* Violation count does NOT reset during exam

---