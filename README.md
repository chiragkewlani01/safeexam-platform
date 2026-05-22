# safeexam-platform
SafeExam is a secure online exam platform with real-time monitoring, tab-switch detection, and role-based access. It supports MCQs, descriptive, and coding tests while ensuring integrity through browser restrictions, activity logging, and automated result processing.

1. Project Overview
SafeExam is a secure online examination platform with:

Role-based access: students and educators (faculty)
Question types: MCQ, descriptive, and coding
Integrity controls: tab-switch detection, fullscreen enforcement, activity logging, violation thresholds, optional auto-submit
Educator tools: exam creation, live monitoring, analytics/reports, student results
AI-assisted question generation (QIE — Question Intelligence Engine)
Remote code execution via Judge0 (or mock provider in dev)
Production domains (from config): safexam.in, backend on Render (safeexam-platform.onrender.com).

2. Technology Stack
Layer	Technology
Frontend
Next.js 15, React 18, TypeScript, Tailwind CSS, Zustand, React Hook Form + Zod
UI
Custom components + shadcn-style primitives; Monaco Editor for coding
Backend
FastAPI, Python 3.10+, SQLAlchemy 2, PostgreSQL
Auth
JWT in httpOnly cookie + DB session revocation (SessionToken); Google OAuth for students; bcrypt password for educators
AI
Gemini / OpenRouter (configurable) for QIE
Code run
Judge0 API or mock execution provider
Infra
Client: Vercel-style Next deploy; Server: Render/Docker, Gunicorn/Uvicorn
3. High-Level Architecture
Browser
Next.js Client (port 3000)
FastAPI Server (port 8000)
External
PostgreSQL
Student UI
Educator Dashboard
App Router Pages
BFF Proxy /api/v1/*
AuthSync + Zustand
API v1 Routers
Auth + Sessions
Exams + Sessions
Monitoring Rule Engine
QIE Engine
Coding / Judge0
Educator Monitor/Reports
Google OAuth
Gemini / OpenRouter
Judge0 API
Critical design choice — BFF (Backend-for-Frontend):

The browser never calls the Render backend directly.
All API traffic goes to same-origin /api/v1/... on the Next.js app.
client/app/api/v1/[...path]/route.ts proxies requests to API_BASE_URL, forwards cookies, and normalizes redirects so session cookies are not lost on cross-origin redirects.
4. Repository Structure
safeexam-platform/
├── client/          # Next.js frontend (~185 files)
│   ├── app/         # Routes (App Router)
│   ├── components/  # UI by domain (student, admin/educator, auth, ui)
│   ├── hooks/       # useExamMonitoring, useOverviewData, etc.
│   ├── lib/         # api, auth, polling, request cache
│   └── store/       # Zustand (auth, toast)
│
└── server/          # FastAPI backend (~105 app files + migrations)
    ├── app/
    │   ├── api/     # Route handlers
    │   ├── core/    # config, database, auth, dependencies
    │   ├── models/  # SQLAlchemy models
    │   ├── schemas/ # Pydantic request/response
    │   ├── services/# Business logic (monitoring, QIE, coding, sessions)
    │   └── middlewares/ # rate limit, CSRF (optional)
    └── migrations/  # SQL migration scripts
5. User Roles & Authentication
5.1 Roles
Role	Login method	Primary UI
student
Google OAuth
/student, exam lobby & exam flow
educator
Email + password (/educator-login)
/educator/* dashboard
admin (JWT claim only)
Same as educator if email matches SUPER_ADMIN_EMAIL
Elevated educator APIs
Database enum: student, educator on users.role.

5.2 Session Model
On login, server creates SessionToken row (JTI) + JWT (session_token cookie).
JWT payload: sub (user id), role, jti.
get_current_user() validates cookie JWT and DB session (not revoked, not expired).
Logout revokes JTI; logout-all revokes all sessions for user.
Cookie flags: HttpOnly, SameSite=lax, Secure in production.
5.3 Auth API Endpoints (/api/v1/auth)
Method	Path	Purpose
GET
/google/login
Start OAuth (stores state in DB)
GET
/google/callback
Complete OAuth, set cookie, redirect
POST
/educator-login
Educator password login
POST
/educator-register
New educator account
GET
/me
Current user profile
PATCH
/profile
Update profile
POST
/change-password
Educator password change
POST
/logout, /logout-all
Session revocation
5.4 Frontend Auth Flow
AuthSync component syncs session via /api/v1/auth/me into Zustand (useAuthStore) on navigation (skipped on /educator/* because EducatorLayout does its own verify).
EducatorLayout (AdminLayout.tsx) blocks educator pages until syncSessionFromServer() confirms educator/admin role.
apiFetch() enforces same-origin paths in the browser.
6. Database — Core Entities
6.1 Users & Sessions
users: id, email, name, password_hash (educators), role, created_at
session_tokens: revocable JWT sessions (jti, user_id, expires_at, last_activity)
oauth_states: temporary OAuth CSRF state
6.2 Exams & Questions
exams: title, duration (minutes), exam_code (unique join code), status (DRAFT → PUBLISHED → ACTIVE → COMPLETED), created_by, lifecycle timestamps, negative_marking settings
questions: MCQ fields (options A–D, correct_option) + coding fields (problem_statement, test cases JSON, languages, limits) + QIE metadata (source, difficulty, quality_score, usage stats)
exam_questions: links questions to exams (many-to-many style)
exam_registrations: student ↔️ exam (unique per pair)
6.3 Exam Taking
exam_sessions: per student per attempt; status, started_at, submitted_at, question_order (JSON shuffle), violations_count, behavior_score, tab_switch_count, expires_at, last_active_at
responses: saved answers per question per session
results: score_percent, total_marks, obtained_marks, correct/attempted counts after submit
activity_logs: monitoring events with idempotency_key (deduplication)
session_events / activity_snapshots: educator live monitor feed
6.4 Coding
coding_submissions: run/submit pipeline state
coding_autosave: draft code persistence
worker_lease / coding_submission_lock: concurrency control for grading workers
6.5 Educator Onboarding
educator_requests: approval workflow for new educator access (request → approve/reject via email links)
7. Exam Lifecycle (Backend)
DRAFT → (publish) → PUBLISHED → (start) → ACTIVE → (end) → COMPLETED
Action	Endpoint	Who
Create exam
POST /api/v1/exams
Educator
Update exam
PUT /api/v1/exams/{id}
Educator (owner)
Publish
POST /api/v1/exams/{id}/publish
Educator
Start (live window)
POST /api/v1/exams/{id}/start
Educator
End
POST /api/v1/exams/{id}/end
Educator
Delete
DELETE /api/v1/exams/{id}
Educator
Students:

Action	Endpoint
Join by code
POST /api/v1/exams/join
Register
POST /api/v1/exams/{id}/register
Get questions (starts session)
GET /api/v1/exams/{id}/questions
Save progress
POST /api/v1/exams/progress
Server time sync
GET /api/v1/exams/{id}/time
Submit
POST /api/v1/exams/{id}/submit
ExamSessionManager (server/app/services/exam_session_manager.py): thread-safe session creation, prevents duplicate active sessions, sets expires_at from exam duration.

8. Student Journey (Frontend)
8.1 Routes
Path	Purpose
/
Landing
/student-login
Google OAuth entry
/student
Student dashboard (upcoming exams, stats)
/student/join-exam
Enter exam code
/student/exam/[examId]/lobby
Pre-exam lobby (rules, readiness)
/student/exam/(exam)/[examId]
Active exam UI (fullscreen, timer, monitoring)
/exam/[examId]
Legacy/alternate exam entry
8.2 Exam Page Behavior (StudentExamPage)
Loads exam metadata + questions + creates/loads sessionId.
useExamMonitoring hook attaches browser listeners:
Tab switch, fullscreen exit, devtools, inactivity, network loss, shortcuts, multi-tab (BroadcastChannel), etc.
Events batched/queued → POST /api/v1/monitoring/log with idempotency_key (UUID).
Server returns violation_count, action (NONE | WARNING | FLAG | AUTO_SUBMIT).
On threshold → auto-submit via callback.
Autosave answers → POST /api/v1/exams/progress.
Timer from server time endpoint; submit → results flow.
8.3 Question Rendering
MCQ: MCQOptions, QuestionNavigator
Mixed/coding: MixedQuestionRenderer → CodingWorkspace with Monaco editor, autosave indicator, run/submit modals
Coding runs: POST /api/v1/coding/run, status poll, POST /api/v1/coding/final-submit
8.4 Student Dashboard API
GET /api/v1/student/dashboard — registered exams, stats, recent activity
9. Educator Journey (Frontend)
9.1 Layout
app/educator/layout.tsx — full-screen dashboard shell
EducatorLayout (AdminLayout.tsx) — sidebar, topbar, auth gate
Navigation in Sidebar + constants.ts (sidebar width 256px)
9.2 Routes
Path	Feature
/educator
Redirect to overview
/educator/overview
Dashboard metrics, attention items, exams table, quick nav
/educator/exams
List/manage exams
/educator/exams/create
Exam wizard (multi-step)
/educator/exams/[examId]/edit
Edit exam
/educator/exams/[examId]/results
Per-exam results
/educator/monitor
Live proctoring
/educator/students
Global students + per-exam results views
/educator/analytics
Faculty reports, charts, CSV export
/educator/settings
Profile/password
/educator/help
Help content
9.3 Exam Creation (Client)
ExamWizard — steps: question type → configuration → preview
QIE panels (QIEPanel, EnhancedQIEPanel) — AI question generation UI
ClassicExamForm / EditExamForm — manual exam editing
Integrates lib/qie-service.ts → /api/v1/qie/generate, /generate-structured, /attach/{examId}
9.4 Live Monitoring
Components under client/components/admin/monitor/:

MonitorView — orchestrates picker, metrics, session table, event feed, student panel
useMonitorOptimized — polling educator monitor APIs
lib/pollingPolicy.ts, lib/requestCache.ts — reduce duplicate fetches
Backend:

GET /api/v1/educator/monitor/{exam_id} — aggregate monitor data
GET /api/v1/educator/monitoring/active-sessions, /events, /summary
GET /api/v1/educator/monitor/session/{session_id}/events
Activity snapshots for educator timeline
9.5 Analytics & Reports
useFacultyReport hook + analytics components (OverviewSummary, MonthlyTrendsSection, PerformanceInsights, exportReport.ts)
APIs: /api/v1/educator/reports/my-report, /summary, /monthly, /faculty-performance, /export/csv
GET /api/v1/educator/overview — overview dashboard data
9.6 Students / Participants
useStudentsDashboard, GlobalStudentsTable, ExamResultsTable
GET /api/v1/educator/participants, /sessions
Per-student detail: /api/v1/educator/exams/{exam_id}/results/{student_id}
10. Monitoring & Integrity System
10.1 Philosophy (Current Implementation)
From server/app/services/monitoring/constants.py:

Hard violation: only TAB_SWITCH increments violations_count
Soft signals: fullscreen exit, devtools, inactivity, etc. — logged + UI warning, do not increment count
Thresholds (env-configurable):
WARNING_THRESHOLD = 1
FLAG_THRESHOLD = 2
AUTO_SUBMIT_THRESHOLD = 3
10.2 Processing Pipeline
Browser event → useExamMonitoring (queue, debounce, retry)
    → POST /api/v1/monitoring/log
    → process_event() in rule_engine
    → ActivityLog + update exam_sessions.violations_count
    → Response: action + immediate_action
Idempotency: duplicate idempotency_key returns cached response (no double-count).
Heartbeat: POST /api/v1/monitoring/heartbeat updates last_active_at, validates session still active.
10.3 Frontend Monitoring Features
Fullscreen API enforcement + warning overlay
BroadcastChannel for multi-tab detection
DevTools heuristics (size-based detection interval)
Event batching, max queue 100, retry up to 3
Toast cooldown to avoid spam
11. QIE — Question Intelligence Engine
Location: server/app/services/qie/

Module	Role
engine.py
Orchestrator: pool retrieval + AI fallback
retrieval.py
Smart pool selection (topic limits, difficulty distribution)
generator.py
AI generation via provider
ai_provider.py
Gemini / OpenRouter integration
validator.py
Validates generated question structure
Flow:

Educator requests N questions (subject, topic, difficulty, type).
Engine pulls from question pool (exam_id=NULL bank questions).
Shortfall filled by AI generation (if allow_ai).
Questions attached to exam via POST /api/v1/qie/attach/{exam_id}.
Metadata tracks source (manual/ai), quality_score, usage_count, cooldown for reuse (QIE_REUSE_COOLDOWN_HOURS).
12. Coding Exam Subsystem
Server: server/app/services/coding/

Component	Purpose
execution_service.py
Provider abstraction (startup/shutdown in main.py)
judge0_provider.py
Real remote execution
mock_provider.py
Local dev without Judge0
grading_engine.py
Test case evaluation
autosave_manager.py
Draft persistence
judge0_webhook.py
Async callback when runs complete
APIs (/api/v1/coding):

POST /run — execute code against sample tests
GET /status/{submission_id} — poll result
POST /final-submit — final graded submission
Client: Monaco editor, language templates (lib/codeTemplates.ts), workspace components under components/student/exam/coding/.

Config: EXECUTION_PROVIDER=mock|judge0, JUDGE0_API_KEY, JUDGE0_BASE_URL.

13. Complete API Surface (Grouped)
Auth — /api/v1/auth
Google OAuth, educator login/register, me, profile, password, logout

Exams — /api/v1/exams
CRUD, join, register, questions, progress, submit, publish/start/end, results

Student — /api/v1/student
Dashboard

Monitoring (student) — /api/v1/monitoring
log, heartbeat

Educator — /api/v1/educator
overview, monitor/, monitoring/, exams/{id}/results, reports/*, session events, snapshots

Participants — /api/v1/educator/participants
List students, sessions

QIE — /api/v1/qie
generate, generate-structured, attach

Coding — /api/v1/coding
run, status, final-submit

Judge0 — /api/v1/judge0
callback webhook

Educator requests — /api/v1/educator/request
Onboarding approval workflow

Health
/, /health, /api/v1/health

14. Server Middleware & Security
Feature	Implementation
CORS
Whitelist origins (localhost, safexam.in, Render)
Rate limiting
RateLimitMiddleware — per-minute/hour; stricter on auth
CSRF
CSRFMiddleware (disabled in debug for CORS troubleshooting)
Trusted hosts
Production TrustedHostMiddleware
Password hashing
bcrypt
Input validation
Pydantic schemas, email/password validators in auth
Session revocation
DB-backed JTI
Exception handling
Centralized in core/exceptions.py
15. Client Libraries & Patterns
File	Purpose
lib/api.ts
apiFetch, same-origin enforcement
lib/auth/proxy.ts
BFF URL building, cookie forwarding
lib/auth/client.ts
fetchMe, session sync
lib/pollingPolicy.ts
Educator polling intervals
lib/requestCache.ts
Dedupe concurrent API calls
lib/educatorExams.ts
Educator exam helpers
store/useAuthStore.ts
Global user state
store/useToastStore.ts
Toast notifications
UI conventions: Tailwind + dark mode; educator uses dashboard-shell CSS; public pages get breadcrumb + footer via AppChrome (hidden during exam/educator).

16. Deployment Topology
Component	Typical host	Port
Next.js client
Vercel / local
3000
FastAPI
Render / Docker
8000
PostgreSQL
Managed Postgres
5432
Env vars (key):

Shared: SECRET_KEY, DATABASE_URL, FRONTEND_BASE_URL, API_BASE_URL (client)
OAuth: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI (must hit Next BFF callback)
AI: GEMINI_API_KEY or OpenRouter vars
Execution: EXECUTION_PROVIDER, JUDGE0_*
Admin: SUPER_ADMIN_EMAIL
17. Data Flow Examples (For Report Diagrams)
17.1 Student Takes MCQ Exam
Login (Google) → Cookie set → Join exam code → Register
→ Lobby → Start exam page → GET questions (session created)
→ Answer questions → POST progress (autosave)
→ Monitoring events → POST monitoring/log
→ Submit → POST exams/{id}/submit → Result row created
17.2 Educator Monitors Live Exam
Educator login → /educator/monitor → Select exam
→ Poll GET educator/monitor/{exam_id}
→ View sessions table + event feed + student detail panel
→ Optional snapshots POST/GET
17.3 AI Question Generation
Educator wizard → QIE form → POST qie/generate-structured
→ Engine: pool + AI → Preview → POST qie/attach/{examId}
→ Questions linked → Publish exam
18. Recent Architectural Refactor (Current Branch State)
The codebase is mid-refactor toward a modular educator dashboard:

Old monolithic components deleted (LiveMonitor, SessionTable, ParticipantsTable, etc.)
New structure:
components/admin/analytics/* — report sections
components/admin/dashboard/* — stat cards, sections
components/admin/monitor/* — MonitorView, toolbar, metrics, feeds
components/admin/overview/* — welcome, metrics, attention, exams table
components/admin/students/* — global + per-exam tables
components/admin/layout/* — DashboardContent, DashboardFooter
New libs: pollingPolicy.ts, requestCache.ts, educatorExams.ts
Server: expanded educator reports, participants, monitoring endpoints; role fixes in migrations
19. Suggested Report Sections (NotebookLM Prompt Ideas)
When feeding this to NotebookLM, ask it to generate:

Introduction — problem statement (online exam integrity)
Objectives — secure exams, monitoring, multi-question-type support
Literature / existing systems — compare with generic LMS
System design — use Section 3 architecture diagram
Technology stack — Section 2 table
Database design — Section 6 ER description
Implementation — student flow (8), educator flow (9), monitoring (10), QIE (11), coding (12)
Security analysis — Section 14
Testing — manual test cases from flows in Section 17
Results / screenshots — (you add from running app)
Limitations — soft violations don't count; mock Judge0 in dev; CSRF disabled in debug
Future work — Redis rate limits, descriptive auto-grading, proctoring video
20. Key File Reference (Quick Lookup)
Concern	Server	Client
App entry
app/main.py
app/layout.tsx
API router
app/api/v1/__init__.py
app/api/v1/[...path]/route.ts
Auth
app/api/auth.py
lib/auth/*, AuthSync.tsx
Exams
app/api/exams.py
app/student/exam/(exam)/[examId]/page.tsx
Monitoring
app/api/monitoring.py, services/monitoring/
hooks/useExamMonitoring.ts
Educator UI
app/api/educator_*.py
components/admin/*, app/educator/*
QIE
services/qie/engine.py
components/admin/exams/QIEPanel.tsx
Coding
app/api/coding.py, services/coding/
components/student/exam/coding/*
Config
app/core/config.py
.env + lib/auth/env.ts
This is a standalone snapshot of how SafeExam works today across client/ and server/. Copy the full text into NotebookLM as a source, then ask it to draft your minor project report chapters using the suggested sections in §19.

If you want, I can also save this as SYSTEM_CONTEXT.md in the repo root (excluding doc/) so you have a permanent file to upload.
