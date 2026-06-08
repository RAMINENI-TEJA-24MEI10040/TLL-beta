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

API Guardian is built for speed and seamless UX:

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | Ensures lightning-fast HMR and an optimized production build. |
| **Data Visualization** | Recharts | Renders complex latency, uptime, and threat distribution metrics smoothly. |
| **Styling Engine** | Custom CSS Variables | A lightweight, zero-dependency theme engine supporting dynamic Light/Dark modes and custom hue switching. |
| **AI Integration** | Anthropic API | Handles complex language tasks, powered by Claude. |

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16.0 or higher)
* NPM or Yarn

### Local Installation
