# File Structure — SafeExam

---

## Root

```
/
├── server/
│   └── app/
│       ├── api/
│       ├── models/
│       ├── schemas/
│       ├── middlewares/
│       ├── tests/
│       ├── main.py
│       └── ...
├── client/
│   └── ...
├── docs/
│   └── ...
├── README.md
├── LICENSE
```

---

## server/app/api/

* All API route handlers (FastAPI routers)
* `code.py` — coding question submission & result APIs
## server/app/models/

* SQLAlchemy models

## server/app/schemas/

* Pydantic schemas

## server/app/middlewares/

* Custom FastAPI middlewares (auth, rate limiting, etc.)

## server/app/tests/

* All backend tests (unit, integration)

---

## client/

* Next.js app, components, pages, layouts

---

## docs/

* All documentation files

---