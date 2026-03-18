# Monitoring & Proctoring System — SafeExam

---

## 🧠 Overview

SafeExam includes a robust monitoring system to ensure exam integrity and detect suspicious behavior.

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

## Debounce Strategy

Ignore duplicate events within 2–3 seconds.

---

## No Reset Rule

Violation count does NOT reset during exam.

---

# 📡 3. Monitoring API

---

## Endpoint

```http
POST /api/v1/monitoring/log
```

---

## Request

```json
{
  "session_id": 1,
  "event": "TAB_SWITCH",
  "timestamp": "2026-03-18T10:00:00Z"
}
```

---

## Backend Responsibilities

* Validate user and session
* Store log
* Update violation count (debounced, no reset during exam)
* Decide action

---

# 🗄️ 4. Database Logging

---

## Table: activity_logs

```text
id
session_id
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

* Debounce violation events (2–3 sec)
* Do not reset violation count during exam
* Take action based on threshold

---