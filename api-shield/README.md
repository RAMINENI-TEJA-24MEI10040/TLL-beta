# TrustLayer API Shield

TrustLayer API Shield is a real-world Active Security Monitoring Engine built with **FastAPI**, **Async SQLAlchemy**, **PostgreSQL**, **Redis**, and **ARQ**. It continuously monitors, tests, and secures live APIs against vulnerabilities like Broken Object Level Authorization (BOLA), Broken Function Level Authorization (BFLA/RBAC), Sensitive Data Leakage, JWT misconfigurations, and missing Security Headers.

---

## 🚀 Getting Started (Linux / Codespaces / WSL)

It looks like you are running in a Linux/Bash environment (like GitHub Codespaces or WSL). Here are the exact bash commands to run the application successfully.

### 1. Start Infrastructure (PostgreSQL & Redis)
Ensure you are in the `api-shield` directory and start the databases:
```bash
cd /workspaces/TLL-beta/api-shield
docker-compose up -d
```

### 2. Environment Setup
Create and activate your Python virtual environment using the **Bash** commands:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 3. Database Migrations (Alembic)
Now that PostgreSQL is running, apply the database schema.
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

---

## 🔒 CORS Configuration for the Frontend
By default, the FastAPI application will not accept requests from a frontend running on a different port. If you are running the API Guardian React frontend (which typically runs on `http://localhost:5173`), you must add the CORS middleware in `main.py` before starting the server:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🏃 Running the Application

The architecture consists of two main processes that must run concurrently: the FastAPI web server and the ARQ background worker. 

Open **two separate terminal windows**, and run the following in **each** terminal to activate the environment:
```bash
cd /workspaces/TLL-beta/api-shield
source venv/bin/activate
```

### Terminal 1: Start the FastAPI Server
```bash
uvicorn main:app --reload
```
*The API is now accessible. You can view the interactive Swagger UI documentation at: http://127.0.0.1:8000/docs*

### Terminal 2: Start the ARQ Background Worker
The ARQ worker manages the continuous monitoring pipeline and executes the scheduled tasks.
```bash
export PYTHONPATH="."
arq workers.tasks.WorkerSettings
```

---

## 🧪 Testing

The codebase includes asynchronous unit tests leveraging `pytest` and `respx` to mock external API requests. 

To run the test suite, ensure you are in the `api-shield` directory:
```bash
cd /workspaces/TLL-beta/api-shield
source venv/bin/activate
export PYTHONPATH="."
pytest tests/ -v
```
