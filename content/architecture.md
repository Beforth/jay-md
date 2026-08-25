---
title: Architecture
description: Diagram-first reference of what connects to what in S&M Hub, and why.
order: 5
tags:
  - Reference
---

# Architecture

> Diagram-first reference: what connects to what, and why. Each diagram is small on purpose —
> several small ones beat one giant one. For exhaustive detail see the
> [Developer Guide](./developer-guide.md).

## System landscape

Two independent repos, deployed separately:

- **`au-marketing-fe`** — React 19 SPA ("S&M Hub"), served by Vercel (SPA rewrite to `index.html`).
- **`au-marketing-api`** — FastAPI service in Docker Compose (web + worker + Postgres + optional
  vector log sidecar), fronted by Nginx on EC2. Auth and permissions come from an external HRMS
  RBAC service; there is **no BFF** — the SPA talks to the API directly.

```mermaid
flowchart LR
  subgraph Browser
    FE["React SPA<br/>S&M Hub (Vercel / :3000)"]
  end
  subgraph EC2 [EC2 — Docker Compose]
    NX["Nginx<br/>api.marketing.aureolegroup.com"]
    WEB["Marketing API<br/>FastAPI :8000 (:8003 host)"]
    WK["Worker<br/>APScheduler"]
    DB[("PostgreSQL 16<br/>:5435 host")]
    MED["media/ local storage"]
    VS["Vector → Better Stack"]
  end
  subgraph External
    HRMS["HRMS RBAC<br/>hrms.encryptedbar.com"]
    PQ["PQ Platform / BeForth"]
    FCM["Firebase FCM"]
    GMAIL["Google Gmail OAuth"]
  end
  FE -->|"REST + Bearer JWT"| NX
  NX --> WEB
  WEB --> HRMS
  WEB --> DB
  WEB --> MED
  WEB --> PQ
  WEB --> FCM
  WEB --> GMAIL
  WK --> DB
  WK --> FCM
  WK --> HRMS
  WEB --> VS
  WK --> VS
```

## Request / auth flow

Login happens once via HRMS; afterwards every request carries the JWT and the API re-checks
permissions against HRMS with a 60-second in-memory cache.

```mermaid
sequenceDiagram
  participant U as User (browser)
  participant F as React SPA
  participant A as Marketing API
  participant H as HRMS RBAC
  participant D as PostgreSQL
  U->>F: enters HRMS username/password on Login
  F->>A: POST /api/auth/login
  A->>H: validate credentials, fetch permissions
  H-->>A: user + permissions
  A-->>F: JWT (30-min) + user + permissions
  F->>A: GET /api/leads/ (Authorization: Bearer JWT)
  A->>A: decode JWT → get_authenticated_user
  A->>H: require_permission("marketing.view_lead") (cached 60s)
  A->>A: get_user_scope() → row-level filter
  A->>D: SELECT ... WHERE scope
  D-->>A: rows
  A-->>F: JSON
  F-->>U: render
```

Key rule: **permission ≠ scope**. The permission dependency gates *whether* you may call the
endpoint; `app/scope.py` decides *which rows* you may see. Visibility Settings
(`past_quarter_access`) is a display-only filter and must never gate a write.

## Data layer

PostgreSQL 16, SQLAlchemy models, heavy JSONB use. Grouped (not exhaustive — 53 models in
`app/models.py`).

### Master data

```mermaid
erDiagram
  DOMAIN ||--o{ REGION : contains
  DOMAIN ||--o{ EMPLOYEE_REGION_ASSIGNMENT : heads
  REGION ||--o{ EMPLOYEE_REGION_ASSIGNMENT : assigns
  ORGANIZATION ||--o{ PLANT : has
  CONTACT }o--o{ CUSTOMER : convert
  LEAD }o--|| DOMAIN : belongs_to
  LEAD }o--|| REGION : belongs_to
  LEAD }o--o{ CONTACT : refers
  LEAD }o--o{ CUSTOMER : refers
```

### Pipeline & reporting

```mermaid
erDiagram
  LEAD_STATUS_GROUP ||--o{ LEAD_STATUS_OPTION : contains
  LEAD_STATUS_OPTION ||--o{ LEAD : current_status
  LEAD ||--o{ ACTIVITY : has
  ACTIVITY ||--o{ ACTIVITY_ATTACHMENT : has
  ORDER_STATUS_GROUP ||--o{ ORDER_STATUS_OPTION : contains
  ORDER_STATUS_OPTION ||--o{ ORDER : current_status
  EMPLOYEE_MONTHLY_TARGET ||--o{ DOMAIN : per_domain
  EXPECTED_ORDER_REPORT ||--o{ EXPECTED_ORDER_REPORT_LEAD : details
  OD_PLAN_REPORT ||--o{ OD_PLAN_ENTRY : entries
  SAVED_DASHBOARD ||--o{ SAVED_DASHBOARD_ASSIGNMENT : assigned
  REPORT_TEMPLATE ||--o{ REPORT_TEMPLATE_ASSIGNMENT : assigned
  NOTIFICATION }o--|| LEAD : references
```

## External integrations

| Integration | Required / optional | Notes |
| --- | --- | --- |
| HRMS RBAC (`hrms.encryptedbar.com/api/rbac`) | **Required** | Login, JWT permissions, employee data; permission checks cached 60s; connectivity probe at startup |
| PostgreSQL 16 | **Required** | Primary store; container `marketing_db`, host port 5435 |
| PQ Platform / BeForth (`crm.beforth.in`, product id 4) | Required | Error tracking middleware + support tickets/feedback (`pq-befu 0.1.0`) |
| APScheduler | Required | Background jobs in the worker: follow-up + event-travel reminders every 1 min |
| Firebase FCM | Optional | Web push via `firebase-admin`; lazy init from service-account path; only HTTPS links |
| Google Gmail OAuth | Optional | "Connect email" — `credentials.json`, `gmail.send` scope, OAuth callback on the API |
| Better Stack (Vector sidecar) | Optional | Docker-log shipping to Better Stack (needs `BETTER_STACK_SOURCE_TOKEN`) |
| Groq (LLM) | Wired-but-inactive | AI SQL/widget generation endpoint is commented out; `GROQ_API_KEY`/`GROQ_MODEL` still configured |
| Object storage (S3) | — | **Does not exist.** README mentions S3/boto3 but attachments live in local `media/` via `app/storage.py` |

## Deployment / infrastructure

```mermaid
flowchart LR
  GIT[push to main] -->|GitHub Actions<br/>appleboy/ssh-action| EC2[EC2]
  EC2 -->|docker compose up --build| WEB[web :8003]
  EC2 -->|reset_db_and_migrate.py| DB[(Postgres)]
  EC2 -->|populate_data.py| DB
  FE[au-marketing-fe] -->|npm run build + push| Vercel[Vercel SPA]
  Vercel -->|rewrite /* → /index.html| BR[Browser]
```

- **API deploy:** push to `main` → SSH to EC2 → pull → prune → `compose up --build` → **full DB
  reset + migrate + seed**. ⚠️ This destroys and rebuilds production data on every push.
- **Frontend deploy:** Vercel; `vercel.json` rewrites all paths to `index.html`.
- **Nginx:** serves `api.marketing.aureolegroup.com` (+ `api.marketing.orielgroup.com`), HTTPS,
  100 MB upload limit, proxy to `web:8000`.

## Tech stack

| Area | Stack |
| --- | --- |
| Frontend | React 19, TypeScript 5.7, Vite 6, Tailwind 3.4, Radix UI, react-router 6, Redux Toolkit 2.5 + Zustand 5, Recharts 2.15, Firebase 11 |
| Backend | Python 3.11, FastAPI 0.115, Uvicorn 0.32, SQLAlchemy 2.0, Pydantic 2.9, Alembic 1.14 (scaffold only) |
| Data | PostgreSQL 16, psycopg2, JSONB, startup `create_all` + idempotent ALTERs |
| Jobs | APScheduler (worker container) |
| Infra | Docker Compose, Nginx, GitHub Actions (EC2), Vercel, Better Stack Vector |

## Glossary

| Term | Meaning |
| --- | --- |
| **HRMS RBAC** | External HRMS service that authenticates users and grants `marketing.*` permissions |
| **Permission** | An action gate (e.g. `marketing.view_lead`) checked on every endpoint |
| **Scope** | Row-level visibility filter resolved from the user's role/domain/region |
| **JWT** | HS256 token the API issues after login (30-min expiry), sent as `Authorization: Bearer` |
| **Worker** | The separate Docker container running the APScheduler background jobs |
| **BFF** | Backend-for-frontend — deliberately not used; the SPA calls the API directly |
| **JSONB** | Postgres JSON column type used for flexible config (settings, dashboards, event entries) |
| **Startup ALTERs** | Idempotent schema changes applied in `main.py` on boot (the de-facto migrations) |
