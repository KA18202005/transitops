# 🚚 TransitOps — Smart Transport Operations Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2017-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%204-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

TransitOps is a centralized, secure command center and fleet coordination platform built for modern transport operations. It offers real-time operational insights, role-based access controls, and modular tracking for vehicles, drivers, trips, fuel logs, maintenance scheduling, and expenses.

---

## 🚀 Key Modules & Features

- **🔐 Robust RBAC Authentication**: Full signup, login, and token-based session verification (`/auth/me`) protecting sensitive operations. Users can register specific operational roles (Fleet Manager, Driver, Safety Officer, Financial Analyst).
- **🚛 Fleet Management**: Real-time tracking of active, available, or out-of-service vehicles, including detailed metadata (odometer, load capacity, type, and acquisition costs).
- **👨‍✈️ Driver Coordination**: Profiles, licensing expiration tracking, status states, and safety score analytics.
- **🗺️ Live Trip Dispatching**: Track source, destination, planned distance, fuel consumption, revenue, and status states (Draft, Dispatched, Completed, Cancelled).
- **🔧 Maintenance Scheduler**: Repair logs, start/end dates, technician assignments, status states (Pending, In Progress, Completed), and cost calculators.
- **⛽ Fuel Logging**: Quantities in liters, cost monitoring, station logs, and fuel efficiency metrics.
- **💰 Expense Tracking**: Categorized trip expenses (Fuel, Toll, Parking, Maintenance, Miscellaneous) with date-wise breakdowns.
- **📊 Real-time Dashboard**: Interactive charts tracking dispatch operations, cost distributions, utilization rates, and activity modules.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Next.js 16 (App Router), Tailwind CSS v4, Lucide React, Axios, React Hook Form, Zod (validation), Recharts (data visualization), React Hot Toast (notifications).
- **Backend**: Python 3.12+, FastAPI, Uvicorn (ASGI server), SQLAlchemy ORM, Alembic (database migrations), Pydantic (data validation), native Bcrypt hashing.
- **Database**: PostgreSQL (v17).

---

## 📂 Directory Layout

```text
TransitOps/
├── frontend/                 # Next.js App Router Frontend
│   ├── src/
│   │   ├── app/              # Routes (login, signup, dashboard, vehicles, etc.)
│   │   ├── components/       # UI (Button, Input, Select) & Shared Components
│   │   ├── context/          # AuthState Provider Context
│   │   └── services/         # API Client & Axios Endpoints Hookup
│   └── package.json          # Node Dependencies & Build Scripts
│
├── backend/                  # FastAPI Backend API
│   ├── app/
│   │   ├── api/              # Endpoints (auth, users, vehicles, drivers, etc.)
│   │   ├── core/             # DB sessions, Security (Bcrypt/JWT), Config
│   │   ├── models/           # SQLAlchemy DB Schemas
│   │   ├── schemas/          # Pydantic Schemas for Requests/Responses
│   │   └── services/         # Core Business Logic Layer
│   ├── migrations/           # Alembic DB Migration Versions
│   ├── main.py               # API Router Entrypoint
│   └── requirements.txt      # Python Backend Dependencies
│
└── database/                 # SQL Scripts & Documentation
    ├── schema.sql            # Table definitions (PostgreSQL dump)
    ├── seed.sql              # Initial roles, regions, and vehicle types data
    └── Database_Dictionary.md# In-depth columns dictionary
```

---

## ⚙️ Quick Start & Installation

### 1. Database Setup
Ensure PostgreSQL is running locally and create a database named `transitops_db`.
```bash
# Log in to PostgreSQL CLI and create database
psql -U postgres
CREATE DATABASE transitops_db;
```
Restore the database schema and seed data:
```bash
psql -U postgres -d transitops_db -f database/schema.sql
psql -U postgres -d transitops_db -f database/seed.sql
```

### 2. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` root directory (refer to `.env` example):
   ```ini
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/transitops_db
   SECRET_KEY=TransitOpsSecretKey
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
5. Run the FastAPI development server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

### 3. Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend/` root:
   ```ini
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```
4. Start the Next.js Turbopack development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 🔒 Authentication Flow Detail

TransitOps enforces role-based endpoint validation via JSON Web Tokens (JWT).
1. **Signup**: User registers with details (Full Name, Email, Password, Phone, and Role). The frontend hashes inputs client-side for format validity and submits to backend `POST /users/`. The backend hashes the password using native `bcrypt` and records the active user in the PostgreSQL `users` table.
2. **Login**: User supplies email & password to `POST /auth/login`. On validation, the server signs a JWT bearer token containing the user identity, returned to the client and stored in `localStorage`.
3. **Session Verification**: Whenever a user navigates the app, the `AuthProvider` executes a request to `GET /auth/me` containing the bearer token in headers. If validated, the client state is updated with the user profile, matching the sidebar view.