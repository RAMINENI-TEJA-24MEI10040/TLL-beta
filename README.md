<div align="center">
  <img src="https://img.shields.io/badge/API-Guardian-3b82f6?style=for-the-badge&logo=shield&logoColor=white" alt="API Guardian Logo" />
  <h1>🛡️ API Guardian</h1>
  <p><strong>The Ultimate API Security, Observability, and Developer Experience Platform.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Claude_AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude AI" />
    <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=react&logoColor=white" alt="Recharts" />
  </p>
</div>

---

## 📖 What is API Guardian?

**API Guardian** is a unified security and observability dashboard built to protect modern backend infrastructures. Instead of juggling fragmented tools for traffic monitoring, threat detection, and API testing, API Guardian combines them all into a single, intuitive interface. 

It doesn't just block threats; it helps developers understand their APIs better, generate comprehensive documentation using AI, and simulate heavy traffic loads—all without leaving the dashboard.

---

## ✨ Comprehensive Feature Breakdown

### 1. Real-Time Security & Observability 
* **Granular Traffic Analytics:** Monitor API latency, request volumes (RPS), and error rates in real-time through dynamic charts.
* **Threat Shielding:** Automatically detect and flag critical vulnerabilities such as **BOLA (Broken Object Level Authorization)**, **SQL Injections**, **DDoS attempts**, and **JWT misconfigurations**.
* **Live Alert Feed:** Get instantaneous notifications with specific mitigation steps (e.g., "Rate limit missing on /auth/login -> Fix: Add sliding window rate limiter").

### 2. AI Security Copilot (Powered by Claude)
Leveraging the `claude-sonnet-4` model, API Guardian acts as an intelligent assistant for your backend:
* **Auto-Documentation:** Instantly generate complete, markdown-formatted API docs from your endpoints.
* **Test Case Generation:** Automatically write exhaustive test suites (happy paths, edge cases, security exploits) for Jest or Pytest.
* **Smart Security Reviews:** Feed an endpoint to the AI and receive an OWASP-aligned vulnerability report with recommended code fixes.

### 3. Developer-First Integrations
* **OpenAPI & Swagger Import:** Drag and drop your `.json` or `.yaml` schema files to instantly populate the dashboard with all your API routes.
* **Postman Sync:** Connect your Postman v2.1 collections to map out testing environments effortlessly.
* **GitHub Repository Tracking:** Link your codebase to monitor the security status of specific branches, track recent pull requests, and detect endpoint changes across deployments.

### 4. Built-in QA & Testing
* **Load Testing Engine:** Simulate massive traffic spikes (100 to 1,000+ virtual users) directly from the browser to visualize how your API handles stress.
* **Instant Mock Servers:** Automatically spin up live mock endpoints based on your OpenAPI schema—perfect for frontend teams blocked by backend development.

---

## 🏗️ Architecture & Tech Stack

API Guardian is built for speed, security, and seamless UX across a robust microservices architecture:

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 18 + Vite | Ensures lightning-fast HMR and an optimized production build. |
| **Backend Engine** | FastAPI (Python) | High-performance asynchronous API server for running security engines and load tests. |
| **Database** | PostgreSQL + asyncpg | Relational database for storing targets, scan history, findings, and configurations. |
| **Message Broker / Cache** | Redis + ARQ | Powers background workers for continuous monitoring without blocking the main web server. |
| **Data Visualization** | Recharts | Renders complex latency, uptime, and threat distribution metrics smoothly. |
| **Styling Engine** | Custom CSS Variables | A lightweight, zero-dependency theme engine supporting dynamic Light/Dark modes. |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0 or higher) & NPM
* **Python** (3.9 or higher)
* **Docker & Docker Compose** (for running PostgreSQL and Redis)

### Quick Start Guide

#### 1. Start the Infrastructure
```bash
cd api-shield
docker-compose up -d
```
*Ensure both Postgres and Redis containers are healthy (`docker-compose ps`).*

#### 2. Start the Backend API (FastAPI)
Open a new terminal window:
```bash
cd api-shield
python -m venv venv
# On Windows: venv\Scripts\activate
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn main:app --reload
```
*The API is now running at `http://localhost:8000`.*

#### 3. Start the Background Worker (ARQ)
Open another terminal window to run the background scanner:
```bash
cd api-shield
python -m venv venv
# On Windows: venv\Scripts\activate
source venv/bin/activate
# Activate your venv again
export PYTHONPATH="." # (Or set PYTHONPATH=. on Windows)
arq workers.engine.WorkerSettings
```

#### 4. Start the Frontend Dashboard (React)
Open a final terminal window:
```bash
npm install
npm run dev
```
*Access the API Guardian Dashboard at `http://localhost:5173`.*
