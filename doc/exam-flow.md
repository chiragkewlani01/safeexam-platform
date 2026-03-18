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

# 🎯 2. Pre-Exam Phase

---

## 2.1 Join Exam

### Flow

```text
Student enters exam code / URL
        ↓
POST /api/exams/join
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
POST /api/exams/start
```

---

### Backend Logic

* Create exam session
* Record start time
* Initialize tracking

---

### Timer Behavior

* Timer starts ONLY after clicking start
* Stored on backend (not frontend)

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
GET /api/exams/{exam_id}/questions
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
POST /api/responses/save
```

---

### 2. Periodic Sync

* Every 10–15 seconds:

  * send unsaved answers

---

### Benefits

* Prevent data loss
* Handle network issues
* Ensure consistency

---

## 3.4 Monitoring Integration

During exam:

* Track events:

  * tab switch
  * window blur

```http
POST /api/monitoring/log
```

---

### UI Behavior

* Show warnings
* Continue exam unless threshold crossed

---

# 🔄 4. Resume Logic (IMPORTANT)

---

## Trigger

* Page refresh
* Network disconnect
* Browser crash

---

## Flow

```text
Student reloads page
        ↓
GET /api/exams/session
        ↓
Backend returns:
  - remaining time
  - saved answers
        ↓
Resume exam
```

---

## Rules

* Resume only if:

  * exam is active
  * time is remaining

---

## Important

* Timer always controlled by backend
* Prevent cheating via refresh

---

# ⏱ 5. Timer System

---

## Source of Truth → Backend

---

## Behavior

* Timer stored on server
* Frontend displays synced time
* Cannot be manipulated by client

---

## Auto Expiry

```text
If time <= 0 → auto-submit
```

---

# 📤 6. Submission Phase

---

## 6.1 Manual Submission

```http
POST /api/responses/submit
```

---

## 6.2 Auto Submission

Triggered when:

* Timer expires
* Violation threshold exceeded

---

## Backend Logic

```text
Fetch all answers
        ↓
Evaluate (MCQ auto)
        ↓
Store result
        ↓
Mark exam completed
```

---

## Important

* Submission handled server-side
* Prevent duplicate submissions

---

# 📊 7. Result Phase

---

## Student View

```http
GET /api/results/{exam_id}
```

---

## Behavior

* Show:

  * score
  * basic performance

---

## Admin View

* All student results
* Export (future)

---

# ⚠️ 8. Edge Cases (VERY IMPORTANT)

---

## 8.1 Network Failure

* Autosave ensures data persistence
* Resume restores session

---

## 8.2 Refresh / Reload

* Resume allowed
* Timer continues from backend

---

## 8.3 Multiple Tabs

* Logged as violation
* Counted in monitoring system

---

## 8.4 Duplicate Submission

* Backend prevents second submit

---

## 8.5 Expired Exam Code

* Join request rejected

---

# 🔐 9. Security Rules

---

* Never trust frontend timer
* Validate exam state on every request
* Ensure user is authorized
* Prevent replay attacks

---

# 🧠 10. Design Principles

---

* Fault-tolerant (resume supported)
* Secure (backend-controlled)
* User-friendly (autosave + warnings)
* Scalable (stateless APIs)

---

# 🚀 11. Future Enhancements

---

* Live progress tracking
* AI-based evaluation
* Offline mode support
* Advanced analytics

---

# 📌 Summary

SafeExam exam flow ensures:

* Smooth user experience
* No data loss (autosave + resume)
* Strong backend control
* Secure and fair examination

This design makes the system robust, scalable, and reliable for real-world usage.
