# 🐳 The Complete Docker & CI/CD Master Guide
### Tailored for Car Rental System (FastAPI + React Vite + PostgreSQL + Redis)

Welcome! This documentation is designed to teach you **how Docker works from the ground up**, explain the core concepts through real-world mental models, and provide step-by-step instructions for running your full-stack application locally and deploying it live to customers via automated CI/CD.

---

## 📑 Table of Contents
1. [Core Docker Concepts Demystified](#1-core-docker-concepts-demystified)
2. [Stack Architecture: How the Pieces Fit Together](#2-stack-architecture-how-the-pieces-fit-together)
3. [Understanding the Configured Files in Your Repo](#3-understanding-the-configured-files-in-your-repo)
4. [Local Development: Step-by-Step Execution](#4-local-development-step-by-step-execution)
5. [Development vs. Production Docker: Key Differences](#5-development-vs-production-docker-key-differences)
6. [CI/CD Pipeline: Deploying Live to Customers](#6-cicd-pipeline-deploying-live-to-customers)
7. [Essential Docker Cheat Sheet & Troubleshooting](#7-essential-docker-cheat-sheet--troubleshooting)

---

## 1. Core Docker Concepts Demystified

Before looking at YAML or Dockerfiles, let's establish clear mental models for the fundamental Docker building blocks:

### 🔹 1. Image vs. Container (Recipe vs. Cake)
- **Docker Image**: A frozen, read-only snapshot containing your application code, system libraries, tools, and runtime (e.g., Python, Node, PostgreSQL). It is the **blueprint** or recipe.
- **Docker Container**: A running, isolated instance created from an Image. You can start 1, 5, or 100 identical containers from the exact same image.

### 🔹 2. Dockerfile
A Dockerfile is a text script containing sequential commands to construct an Image.
- FROM: The starting base OS/environment (e.g., python:3.11-slim, 
ode:20-alpine).
- WORKDIR: The folder inside the container where commands run.
- COPY: Copies files from your computer into the container image.
- RUN: Executes build-time commands (e.g., pip install -r requirements.txt, 
pm install).
- EXPOSE: Documents which network port the container listens on (e.g., 8000, 5173).
- CMD: The default command executed when the container starts running (e.g., uvicorn app.main:app).

### 🔹 3. Docker Compose (docker compose)
Running multiple separate docker run commands manually for Backend, Frontend, Postgres, and Redis becomes tedious. 
**Docker Compose** lets you describe your entire multi-container architecture in a single file (docker-compose.yml) and manage everything with one command:
`ash
docker compose up -d
`

### 🔹 4. Volumes (Data Persistence)
Containers are **ephemeral** by default: if you stop or delete a container, any data written inside its filesystem is lost forever.
- **Named Volumes** (e.g., postgres_data, 
edis_data): Managed by Docker on your computer's disk. When your database container restarts or rebuilds, your database tables and records are completely safe!
- **Bind Mounts** (e.g., ./Backend:/app): Directly maps a folder on your computer into the container. When you edit code in VS Code, the running container sees the changes instantly without rebuilding!

### 🔹 5. Networks & Service Discovery
Docker Compose creates an isolated private virtual network (car_rental_net). 
Containers discover each other by **service name** rather than unstable IP addresses:
- In your backend configuration: POSTGRES_SERVER=postgres (Docker automatically routes postgres to the database container).
- REDIS_HOST=redis (Docker routes 
edis to the Redis container).

---

## 2. Stack Architecture: How the Pieces Fit Together

Here is the complete data flow of your project:

`
[ Customer Browser ]
        │
        ▼ (Port 80 / 443)
┌───────────────────────────────────────────────────────────┐
│ NGINX REVERSE PROXY (Production)                          │
│  ├─ /api/*  ──────► Forward to Backend (FastAPI :8000)    │
│  ├─ /docs   ──────► Forward to Backend Swagger UI         │
│  └─ /*      ──────► Forward to Frontend (React/Vite :80)  │
└───────────────────────────────────────────────────────────┘
        │                                 │
        ▼                                 ▼
┌────────────────────────┐      ┌─────────────────────────┐
│ FRONTEND CONTAINER     │      │ BACKEND CONTAINER       │
│ React + Vite + Tailwind│      │ FastAPI + SQLAlchemy    │
└────────────────────────┘      └───────────┬─────────────┘
                                            │
                      ┌─────────────────────┴────────────────────┐
                      ▼                                          ▼
           ┌──────────────────────┐                   ┌──────────────────────┐
           │ POSTGRESQL CONTAINER │                   │ REDIS CONTAINER      │
           │ Port: 5432           │                   │ Port: 6379           │
           │ Volume: postgres_data│                   │ Volume: redis_data   │
           └──────────────────────┘                   └──────────────────────┘
`

---

## 3. Understanding the Configured Files in Your Repo

Your repository is now pre-configured with industry-standard Docker and CI/CD files:

| File | Purpose |
|------|---------|
| docker-compose.yml | Orchestrates Postgres, Redis, Backend, and Frontend for **local development** with instant hot-reload. |
| docker-compose.prod.yml | Production configuration with Nginx reverse proxy, security hardening, and private networking. |
| Backend/Dockerfile.dev | Fast development image for FastAPI with uvicorn --reload. |
| Backend/Dockerfile | Production multi-stage build: compiles dependencies, runs as secure non-root ppuser, and includes healthchecks. |
| Frontend/Dockerfile.dev | Node.js Alpine image running Vite dev server with polling enabled. |
| Frontend/Dockerfile | Multi-stage production build: builds static JS/CSS and packages it into a tiny, high-performance Nginx web server. |
| Frontend/nginx.conf | Handles SPA routing (redirects all client routes like /cars to index.html) with gzip compression and caching. |
| 
ginx/nginx.conf | Production reverse-proxy: receives user requests and routes /api to FastAPI and / to React. |
| .env.example | Template for environment variables (passwords, ports, URLs). |
| .github/workflows/ci-cd.yml | Automated pipeline: tests code, builds Docker images, and deploys to your live server. |

---

## 4. Local Development: Step-by-Step Execution

Follow these steps on your development machine:

### Step 1: Install Docker Desktop
Make sure Docker Desktop for Windows is installed and running.

### Step 2: Prepare Environment File
Copy .env.example to .env (already done in your repo):
`ash
cp .env.example .env
`

### Step 3: Start All 4 Services with One Command
Run inside the project root:
`ash
docker compose up --build
`
> **What Docker does now:**
> 1. Pulls official postgres:16-alpine and 
edis:7-alpine.
> 2. Builds Backend/Dockerfile.dev and installs Python packages.
> 3. Builds Frontend/Dockerfile.dev and installs npm packages.
> 4. Waits for Postgres and Redis to pass healthchecks before starting the backend.
> 5. Mounts your local files so edits take effect immediately!

### Step 4: Verify Your Running App
- **React Frontend**: Open http://localhost:5173
- **FastAPI Documentation (Swagger)**: Open http://localhost:8000/docs
- **Health Check Endpoint**: Open http://localhost:8000/health (verifies live Postgres & Redis connectivity)
- **Redis Counter Demo**: Open http://localhost:8000/api/demo-counter (increments a counter in Redis on each refresh)

### Step 5: Live Code Editing (Hot Reload)
- Edit any file in Frontend/src/... → Vite instantly updates your browser without a full reload.
- Edit any file in Backend/app/... → Uvicorn automatically detects the change and reloads the API server.

---

## 5. Development vs. Production Docker: Key Differences

| Feature | Development Mode (docker-compose.yml) | Production Mode (docker-compose.prod.yml) |
|---|---|---|
| **Code Loading** | Bind-mounted from your computer (./Backend:/app) | Baked permanently into the Docker image |
| **Server** | uvicorn --reload / Vite Dev Server | uvicorn --workers 4 / Nginx static web server |
| **Performance** | Optimized for fast build time & live reloading | Optimized for minimal image size & maximum speed |
| **Security** | Ports 5432 & 6379 open for easy local debugging | Postgres & Redis ports are completely hidden inside internal network |
| **User Rights** | Root user inside container | Non-privileged ppuser (prevents container breakouts) |
| **Public Ports** | 5173 (Frontend) & 8000 (Backend) | Single entry point on port 80 (HTTP) & 443 (HTTPS) |

---

## 6. CI/CD Pipeline: Deploying Live to Customers

The .github/workflows/ci-cd.yml workflow automates the deployment lifecycle:

### How the Pipeline Works:
`
Git Push to 'main'
       │
       ▼
[ Job 1: Lint & Test ]
  ├── Install Python & check dependencies
  └── Run npm build to verify no syntax/JSX errors
       │
       ▼ (if tests pass)
[ Job 2: Build & Push Images ]
  ├── Login to GitHub Container Registry (ghcr.io)
  ├── Build Backend production image & tag with commit SHA
  └── Build Frontend production image & tag with commit SHA
       │
       ▼ (if images push successfully)
[ Job 3: Deploy to Live Server ]
  ├── SSH into your VPS (DigitalOcean / AWS EC2 / Hetzner)
  ├── Pull latest images from ghcr.io
  ├── Execute zero-downtime rolling restart:
  │     docker compose -f docker-compose.prod.yml up -d
  └── Clean up old docker layers
`

### Setting Up GitHub Repository Secrets
To allow GitHub Actions to securely deploy to your live VPS, navigate to:
**Your GitHub Repo → Settings → Secrets and variables → Actions → New repository secret**

Add these 3 secrets:
1. SERVER_HOST: The public IP address of your VPS (e.g., 198.51.100.24).
2. SERVER_USER: The SSH username (usually ubuntu or 
oot).
3. SERVER_SSH_KEY: Your private SSH key (id_rsa or ed25519) matching the server's uthorized_keys.

---

## 7. Essential Docker Cheat Sheet & Troubleshooting

### Daily Commands
| Goal | Command |
|---|---|
| Start all services in background | docker compose up -d |
| Rebuild containers after adding a package | docker compose up --build -d |
| View live logs from all services | docker compose logs -f |
| View logs from a specific service | docker compose logs -f backend |
| Stop all services | docker compose down |
| Stop and wipe database volumes (clean reset) | docker compose down -v |
| Check status of running containers | docker compose ps |

### Interacting with Database & Redis Inside Containers
- **Enter PostgreSQL CLI (psql)**:
  `ash
  docker compose exec postgres psql -U car_rental_user -d car_rental_db
  `
- **Enter Redis CLI**:
  `ash
  docker compose exec redis redis-cli -a redis_secure_password
  `
- **Run Alembic Migrations Inside Backend**:
  `ash
  docker compose exec backend alembic upgrade head
  `
