# SmartSeason Field Monitoring System

A full-stack assessment project for monitoring crop progress across multiple fields during a growing season.

## What This Project Demonstrates

- Role-based access for Admin (Coordinator) and Field Agent
- Field creation, assignment, lifecycle updates, and notes
- Computed field status logic (`Active`, `At Risk`, `Completed`)
- Separate dashboards for Admin and Field Agent
- JWT-based API authentication and protected endpoints

## Tech Stack

- Backend: Django + Django REST Framework + JWT (SimpleJWT)
- Frontend: React + Vite + Tailwind
- Database: SQLite (default, development), PostgreSQL (supported via env vars)

## Repository Structure

- `Backend/`: Django API, models, permissions, endpoints, tests
- `Frontend/`: React application and API client layer

## Core Features vs Assessment Requirements

1. Users and Access
- Two roles are supported: `admin` and `field_agent`
- JWT authentication is used for protected API access
- Role checks restrict access to admin-only operations

2. Field Management
- Admin can create and manage fields
- Admin can assign fields to field agents
- Field model includes: name, crop type, planting date, current stage

3. Field Updates
- Assigned field agents can update field stage
- Assigned field agents and admins can add field notes
- Admin can view all fields and monitor updates/notifications

4. Field Stages
- Supported stages include assessment stages:
- `planted`, `growing`, `ready`, `harvested`
- Additional stages are also supported: `no_status`, `done`

5. Field Status Logic

Status is computed on the backend in `Backend/fields/models.py` as follows:

- `Completed`: if stage is `harvested` or `done`
- `At Risk`: if stage is `planted` or `growing` and planting date is older than 14 days
- `Active`: all other cases

6. Dashboard
- Admin dashboard includes system-wide field summary and status breakdown
- Agent dashboard shows assigned fields and at-risk count

## Local Setup

## Prerequisites

- Python 3.11+ (tested with 3.12)
- Node.js 20+
- npm

## Backend Setup

1. Create and activate virtual environment (if not already created):

```bash
cd Backend
python -m venv venv
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create env file:

```bash
cp .env.example .env
```

4. Run migrations:

```bash
python manage.py migrate
```

5. Start API server:

```bash
python manage.py runserver
```

API base URL: `http://127.0.0.1:8000/api`

## Frontend Setup

1. Install dependencies:

```bash
cd Frontend
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Start development server:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## Demo Credentials

Frontend includes demo login values in the login screen:

- `grace.admin` / `Harvest@2026`
- `daniel.admin` / `Fields#2026`
- `faith.agent` / `SeasonTrack!7`
- `mercy.agent` / `GreenFarm@9`

Notes:
- In mock mode (`VITE_USE_API=false`), demo users are sourced from frontend mock data.
- In API mode (`VITE_USE_API=true`), these users must exist in the backend database.

### Optional: Create Demo Users in Backend

Run this from `Backend/` after migrations:

```bash
python manage.py shell -c "from users.models import User; User.objects.update_or_create(username='admin', defaults={'role':'admin','email':'admin@smartseason.io','first_name':'Admin','last_name':'User'}); u=User.objects.get(username='admin'); u.set_password('admin123'); u.save(); User.objects.update_or_create(username='agent', defaults={'role':'field_agent','email':'agent@smartseason.io','first_name':'Field','last_name':'Agent'}); a=User.objects.get(username='agent'); a.set_password('agent123'); a.save(); print('Demo users ready')"
```

## Running Tests

From `Backend/`:

```bash
./venv/bin/python manage.py test --keepdb
```

If PostgreSQL is configured and another session is attached to the test DB, `--keepdb` avoids teardown drop conflicts.

## API Documentation

Detailed endpoint reference is available in:

- `Backend/API_ENDPOINTS.md`

Notification routing is namespaced under:

- `GET /api/notifications/`
- `PUT /api/notifications/{id}/read/`

## Assumptions and Trade-Offs

- Prioritized clear role separation and simple, testable endpoint behavior.
- Kept the data model intentionally compact for assessment scope.
- Used computed backend status logic to keep status source-of-truth server-side.
- UI focuses on usability and clarity over enterprise-level complexity.

## Notes for Reviewers

- This repository is a monorepo with separate backend and frontend apps.
- Backend and frontend can run independently for local evaluation.
- Frontend can run in either API mode or mock-data mode via `VITE_USE_API`.
