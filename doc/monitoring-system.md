# Monitoring System — SafeExam (Anti-Cheating Architecture)

---

## 🧠 Overview

SafeExam implements a **real-time event-based monitoring system** to detect and prevent cheating during exams.

The system tracks user behavior and enforces rules using a **threshold-based violation model**.

---

## 🎯 Goals

* Detect suspicious behavior
* Prevent unfair practices
* Maintain exam integrity
* Log activity for audit and analysis

---

# 🧩 1. Monitoring Architecture

---

## Flow

```text
Frontend Event Detection
        ↓
Send Event to Backend API
        ↓
Store in activity_logs
        ↓
Evaluate violation count
        ↓
Trigger action (warning / flag / auto-submit)
```

---

## Components

| Layer    | Responsibility     |
| -------- | ------------------ |
| Frontend | Detect events      |
| Backend  | Validate & enforce |
| Database | Store logs         |

---

# 👀 2. Event Detection (Frontend)

---

## Events Tracked

| Event        | Description        |
| ------------ | ------------------ |
| TAB_SWITCH   | User switches tab  |
| WINDOW_BLUR  | User leaves window |
| WINDOW_FOCUS | User returns       |
| EXAM_START   | Exam started       |
| EXAM_SUBMIT  | Exam submitted     |

---

## Implementation (Example)

```js
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    sendEvent("TAB_SWITCH")
  }
})
```

---

## Rules

* Track only during active exam
* Avoid excessive API calls
* Debounce events if needed

---

# 📡 3. Monitoring API

---

## Endpoint

```http
POST /api/monitoring/log
```

---

## Request

```json
{
  "exam_id": 1,
  "event": "TAB_SWITCH",
  "timestamp": "2026-03-18T10:00:00Z"
}
```

---

## Backend Responsibilities

* Validate user and exam
* Store log
* Update violation count
* Decide action

---

# 🗄️ 4. Database Logging

---

## Table: activity_logs

```text
id
user_id
exam_id
event_type
timestamp
metadata (JSONB)
```

---

## Logging Rules

* Log every critical event
* Store timestamps
* Keep logs lightweight

---

# ⚖️ 5. Violation System (CORE LOGIC)

---

## Threshold Model

```text
0–2 violations → Warning
3–4 violations → Flagged
5+ violations → Auto-submit exam
```

---

## Backend Logic

```python
if violations >= 5:
    auto_submit_exam(user)
elif violations >= 3:
    mark_flagged(user)
else:
    send_warning()
```

---

## Important

* Threshold values configurable
* Applied per exam session

---

# ⚠️ 6. Warning System (Frontend)

---

## Behavior

* Show warning popup
* Notify user about violation

---

## Example

```text
"Warning: Do not switch tabs during the exam. Multiple violations may result in auto submission."
```

---

## Rules

* Non-intrusive UI
* Do not break exam flow

---

# ⛔ 7. Auto-Submission Logic

---

## Trigger

* Violation threshold exceeded

---

## Flow

```text
Backend triggers auto-submit
        ↓
Save current answers
        ↓
Mark exam completed
        ↓
Generate result
```

---

## Important

* Must be handled server-side
* Cannot rely on frontend

---

# 🔐 8. Security Considerations

---

## 8.1 Do Not Trust Frontend

* Events must be validated
* Prevent fake API calls

---

## 8.2 Prevent Event Spamming

* Apply rate limiting
* Ignore duplicate events

---

## 8.3 Session Validation

* Ensure exam is active
* Ensure user is authorized

---

# ⚡ 9. Performance Optimization

---

## Strategies

* Batch events (optional future)
* Debounce frontend triggers
* Index logs in database

---

# 📊 10. Post-Exam Analysis

---

## Admin Capabilities

* View activity logs
* Identify suspicious users
* Analyze behavior patterns

---

## Use Cases

* Cheating detection
* Exam integrity reports
* Audit logs

---

# 🚀 11. Future Enhancements

---

* Real-time admin dashboard
* AI-based cheating detection
* Face tracking / webcam monitoring
* Screen recording (advanced)
* Behavior scoring system

---

# 🧠 12. Design Principles

---

* Backend-controlled enforcement
* Lightweight frontend tracking
* Scalable logging system
* Configurable thresholds

---

# 📌 Summary

SafeExam monitoring system:

* Tracks user behavior in real-time
* Logs all critical actions
* Uses threshold-based enforcement
* Ensures fair and secure examination

This system forms the **core anti-cheating mechanism** of SafeExam.
