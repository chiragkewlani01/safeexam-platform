# Deployment & Setup Guide — SafeExam

---

## 🧠 Overview

This document explains how to **set up and run SafeExam locally** for development.

The project consists of:

* Frontend → Next.js (client/)
* Backend → FastAPI (server/)
* Database → PostgreSQL (Neon DB)

---

# ⚙️ 1. Prerequisites

---

## Required Tools

* Node.js (v18+)
* Python (v3.10+)
* Git

---

# 📦 2. Project Setup

---

## Clone Repository

```bash
git clone https://github.com/your-repo/safe-exam.git
cd safe-exam
```

---

# 🖥️ 3. Frontend Setup (client/)

---

```bash
cd client
npm install
```

---

## Environment Variables

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Run Frontend

```bash
npm run dev
```

---

## Runs on

```text
http://localhost:3000
```

---

# ⚙️ 4. Backend Setup (server/)

---

```bash
cd server
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Environment Variables

Create `.env`

```env
DATABASE_URL=postgresql+psycopg2://user:password@host/db
SECRET_KEY=your_secret_key
```

---

## Run Backend

```bash
uvicorn app.main:app --reload
```

---

## Runs on

```text
http://localhost:8000
```

---

# 🗄️ 5. Database Setup (Neon)

---

## Steps

1. Create Neon account
2. Create PostgreSQL database
3. Copy connection string
4. Add to `.env`

---

## Example

```env
DATABASE_URL=postgresql+psycopg2://user:pass@host/db
```

---

# 🔗 6. Connecting Frontend & Backend

---

Ensure:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

# 🚀 7. Running Full System

---

## Step-by-step

1. Start backend → port 8000
2. Start frontend → port 3000
3. Open browser → http://localhost:3000

---

# ⚠️ 8. Common Issues

---

## Backend not starting

* Check Python version
* Check virtual environment

---

## DB connection error

* Verify DATABASE_URL
* Check Neon DB status

---

## CORS issues

* Enable CORS in FastAPI

---

# 🔐 9. Basic Security Notes

---

* Never commit `.env`
* Use strong SECRET_KEY
* Do not expose DB credentials

---

# 🚀 10. Future Deployment (Not Required Now)

---

* Frontend → Vercel
* Backend → Render / Railway
* Database → Neon

---

# 📌 Summary

SafeExam setup is simple:

* Run backend (FastAPI)
* Run frontend (Next.js)
* Connect to Neon DB

This setup supports fast development and easy collaboration.

