---
title: Developer guide
description: Setup, environment variables, data model, API reference, conventions, tests, and deployment for S&M Hub.
order: 4
tags:
  - Reference
---

# Developer Guide

> For engineers building on S&M Hub. This guide is written for the two sibling repos:
> `au-marketing-api` (FastAPI backend) and `au-marketing-fe` (React SPA frontend).
> It is a generated set — verify claims against code before relying on them in production.

## Local setup

### Prerequisites

| Tool | Version | Needed for |
| --- | --- | --- |
| Docker + Docker Compose | Compose v2 | Backend (Postgres, API, worker, vector sidecar) |
| Python | 3.11 (matches the API Dockerfile) | Running the API outside Docker / seed scripts |
| Node.js + npm | Node 18+ (Vite 6 requirement) | Frontend build/dev/test |
| PostgreSQL client (optional) | — | Inspecting the `marketing_db` container on host port **5435** |

> The frontend has **no lint script**. `npx tsc --noEmit` is the only automated static check;
> `npm run build` runs `tsc && vite build` so a green build is also a typecheck.

### Environment variables

Copy `au-marketing-api/.env.example` → `au-marketing-api/.env` and
`au-marketing-fe/.env.example` → `au-marketing-fe/.env`.

**Backend** (`app/config.py`, pydantic-settings, case-sensitive, extra=ignore):

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | ✅ | — | Postgres DSN, e.g. `postgresql://marketing_user:marketing_pass@localhost:5435/marketing_db` |
| `HRMS_RBAC_API_URL` | ✅ | `https://hrms.encryptedbar.com/api/rbac` | External auth/permissions service |
| `HRMS_API_TIMEOUT` | — | `10` | Timeout (s) for HRMS calls |
| `RBAC_CACHE_TTL_SECONDS` | — | `60` | TTL of the in-memory permission cache (NOT 5 min — see Known limitations) |
| `SECRET_KEY` | — | `change-this-in-production` | JWT signing key — set a strong value in prod |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | — | `30` | JWT lifetime |
| `CORS_ORIGINS` | — | list incl. aureolegroup/encryptedbar domains | CORS allow-list; `localhost:3000` and `127.0.0.1:*` are forced on |
| `LOG_LEVEL` | — | `INFO` | Log verbosity |
| `LEAD_SERIES_CODE` / `ORDER_SERIES_CODE` | — | — | Default numbering-series codes for auto-generated lead/order numbers |
| `UPLOAD_DIR` | — | `media` | Local file storage directory (relative to the API folder) |
| `MAX_ATTACHMENT_SIZE_MB` | — | `20` | Attachment size cap |
| `CREDENTIALS_JSON_PATH` | — | `credentials.json` | Google OAuth client for "Connect email" |
| `BACKEND_PUBLIC_URL` | — | — | Public API URL (must match the Google Console redirect URI) |
| `FRONTEND_SETTINGS_URL` | — | `http://localhost:5173/settings` | Redirect target after OAuth connect |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | — | — | FCM push credentials |
| `GROQ_API_KEY` / `GROQ_MODEL` | — | `llama-3.1-405b-reasoning` | AI SQL/widget generation (endpoint currently commented out) |
| `PQ_API_KEY` / `PQ_BASE_URL` / `PQ_PRODUCT_ID` | — | has a **hardcoded prod default** in `config.py` | BeForth PQ error tracking + support tickets |
| `BETTER_STACK_SOURCE_TOKEN` / `BETTER_STACK_INGESTING_HOST` | — | — | Vector log sidecar |
| `RUN_SCHEDULER_IN_WEB` | — | — | `1`/`true` runs the APScheduler in the web process too |
| `POPULATE_DASHBOARD_ASSIGNEE_IDS` | — | — | Seed-script helper |

**Frontend** (`.env`):

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | — | `http://localhost:8003` | Marketing API base URL |
| `VITE_HRMS_RBAC_API_URL` | — | `https://hrms.encryptedbar.com/api/rbac` | HRMS RBAC base (also read directly by the FE) |
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_VAPID_KEY` | — | empty | Web push (FCM); app works without them, push is just disabled |

### Run commands

```bash
# Backend — full stack (Postgres on :5435, API on :8003, worker, vector)
cd au-marketing-api
cp .env.example .env        # edit as needed
docker compose up --build -d
curl http://localhost:8003/health   # {"status":"healthy","service":"marketing-api",...}
docker compose logs -f web worker

# Backend tests (host Python)
pip install -r requirements.txt
pytest                        # smoke tests (health + root)

# Frontend
cd au-marketing-fe
npm install
npm run dev                   # http://localhost:3000
npx tsc --noEmit              # fast typecheck
npm run test:run              # vitest, smoke tests only
```

> Restarting the API container does **not** reload code — it is not a dev-server workflow.
> Code changes require `docker compose up -d --build`.

## Folder structure

### Backend (`au-marketing-api`)

```
app/
  main.py            # FastAPI app, CORS, lifespan, 26 include_router calls, startup schema ALTERs
  config.py          # pydantic-settings env/config
  database.py        # sync SQLAlchemy engine, pool 10 / max_overflow 20
  models.py          # 53 SQLAlchemy models (the schema)
  schemas.py         # Pydantic request/response schemas
  dependencies.py    # get_authenticated_user, require_permission, require_any_permission
  rbac.py            # HRMS RBAC client (httpx)
  rbac_cache.py      # 60s in-memory permission cache
  scope.py           # row-level visibility resolution (role priority order)
  settings_utils.py  # marketing settings (single JSONB row) + audit
  push_notifications.py  # Firebase FCM multicast
  storage.py         # local filesystem attachment storage
  audit_utils.py     # audit log writes
  lead_display.py    # lead display-name/company helpers
  follow_up.py       # follow-up reminder computation
  presence.py        # in-memory presence tracker
  scheduler.py       # APScheduler jobs (follow-up + travel reminders, 1-min interval)
  routers/           # 26 router modules (see API reference)
migrations/          # Alembic scaffold; versions/ is EMPTY (schema managed at startup)
scripts/             # seed/reset/maintenance scripts (reset_db_and_migrate, populate_data, ...)
tests/               # conftest.py + test_main.py (smoke)
Dockerfile           # python:3.11-slim, CMD uvicorn app.main:app --port 8000
docker-compose.yml   # db / web / worker / betterstack-vector services
nginx.conf           # api.marketing.aureolegroup.com (+ orielgroup.com), SSL, 100M uploads
run_worker.py        # standalone scheduler entrypoint
vector/              # Better Stack Vector config
```

### Frontend (`au-marketing-fe`)

> ⚠️ Trap: source lives at the **repo root**, NOT in `src/`. `src/` only holds Vitest setup.

```
App.tsx               # AppContext (toasts, global search, notifications), all Routes
index.tsx             # ReactDOM.createRoot; deliberately NO <StrictMode>
constants.tsx         # SIDEBAR_LINKS, SECONDARY_LINKS, name prefixes, country codes
types.ts              # shared TS types (NavItem, AppNotification, ...)
pages/                # one file per screen (35+); forms are pages, not modals
components/
  layout/             # DashboardLayout, DatabaseLayout (tabbed Orgs/Customers/Contacts), PageLayout
  ui/                 # project component library (Button, DataTable, Sidebar, Modal, ...)
  ProtectedRoute.tsx  # auth + optional requiredPermission guard
UI/                   # A SECOND component library with overlapping names — check imports!
store/                # Redux Toolkit: authSlice, dsrSlice, organizationPlantsSlice, middleware
lib/                  # api.ts (config), marketing-api.ts (API client), hrms-rbac.ts,
                      # firebase-push.ts, scope helpers, utils
hooks/                # usePresence.ts, etc.
context/AuthContext.tsx
demoData.ts           # demo simulation data (not real API data)
public/               # OneSignalSDKWorker.js, firebase-messaging-sw.js, logos, favicon
docs/                 # project's own generated docs (PROJECT_OVERVIEW.md, ...)
au-marketing-api/     # NESTED GIT REPO (gitlink) — separate backend checkout, use git -C
```

## Architecture decisions and request/data flow

Key decisions, in priority order:

1. **Auth is fully delegated to an external HRMS RBAC service.** The API never stores passwords.
   `POST /api/auth/login` exchanges HRMS credentials for a local HS256 JWT (`SECRET_KEY`,
   `ACCESS_TOKEN_EXPIRE_MINUTES`), then every protected request validates the JWT and re-checks
   permissions against HRMS (cached in memory for `RBAC_CACHE_TTL_SECONDS` = 60s).
2. **Permissions and row-scope are two separate mechanisms** and must never be conflated:
   - *Action gates*: `require_permission("marketing.xxx")` dependencies on endpoints.
   - *Row visibility*: `app/scope.py` `get_user_scope()` resolves a filter in priority order
     super_admin → domain_head/coordinator → region_head → supervisor/coordinator → employee (own
     records), falling back between `employee_id` and `user_id` lookups.
   - *Display-only setting*: `past_quarter_access` in Visibility Settings is an allow-list for
     showing past-quarter numbers — it must never gate a write.
3. **No BFF.** The SPA calls the Marketing API and HRMS directly. The backend re-checks every
   permission server-side, so frontend/backend gates can drift — never rely on the FE alone.
4. **Schema is managed at startup, not by Alembic.** `app/main.py` runs `create_all` plus a list of
   idempotent `ALTER TABLE` statements (e.g. `domains.is_export`, `events.gifting_entries`). The
   `migrations/versions/` folder is empty; the global exception handler turns "column does not
   exist" errors into a "restart backend" hint that works precisely because these startup ALTERs
   exist.
5. **No `<StrictMode>`** in `index.tsx` — StrictMode's double-invoke fires duplicate effects/API
   calls. Don't re-add without AbortController cleanup.
6. **Two frontend component libraries** — `components/ui/` and `UI/` have overlapping names
   (`Button`, `Card`, `Select`, ...). Always check the import path before editing "the Button".
7. **Backend containers are not dev servers** — code changes need `--build`. Production migration
   history does not match the repo's; don't hand-write migration files.
8. **CHANGELOG is the version source.** `app/version.py` parses the newest `## [YYYY-MM-DD] — ... (vX.Y.Z)`
   line out of `CHANGELOG.md`; the SPA mirrors it into the sidebar version badge and "What's New".

**Request flow (read):** Browser → `lib/marketing-api.ts` (attaches `Authorization: Bearer <jwt>`,
reads `X-Marketing-Settings-Version`) → router dependency `get_authenticated_user` (decode JWT +
HRMS validation) → `require_permission(...)` (HRMS, 60s cache) → handler applies `get_user_scope()`
filter → SQLAlchemy → Postgres → Pydantic response.

**Write flow adds:** audit log via `audit_utils.py`, notification creation, follow-up scheduling
(`follow_up.py`), and for lead/order/quote numbers, `series` generation (`generate-next`).

**Background flow:** `worker` container runs `run_worker.py` → `scheduler.py` every minute →
follow-up reminders (due follow-ups → notifications/FCM) and event travel reminders.

## Data / content model

53 SQLAlchemy models in `app/models.py` on PostgreSQL (JSONB used heavily). Grouped logical
diagrams below — not exhaustive.

### Master data

```mermaid
erDiagram
  DOMAIN ||--o{ REGION : contains
  DOMAIN ||--o{ EMPLOYEE_REGION_ASSIGNMENT : "heads/coordinators"
  REGION ||--o{ EMPLOYEE_REGION_ASSIGNMENT : assigns
  ORGANIZATION ||--o{ PLANT : has
  CONTACT ||--o{ CUSTOMER : "converts to"
  CUSTOMER ||--o{ PLANT : "buys from"
  LEAD }o--|| DOMAIN : belongs
  LEAD }o--|| REGION : belongs
  LEAD }o--|| CONTACT : refers
  LEAD }o--|| CUSTOMER : refers
```

### Pipeline (leads / orders)

```mermaid
erDiagram
  LEAD_STATUS_GROUP ||--o{ LEAD_STATUS_OPTION : contains
  LEAD_STATUS_OPTION ||--o{ LEAD : current
  LEAD_TYPE_OPTION ||--o{ LEAD : type
  LEAD_THROUGH_OPTION ||--o{ LEAD : source
  LEAD ||--o{ ACTIVITY : has
  ACTIVITY ||--o{ ACTIVITY_ATTACHMENT : has
  ORDER_STATUS_GROUP ||--o{ ORDER_STATUS_OPTION : contains
  ORDER_STATUS_OPTION ||--o{ ORDER : current
  ORDER ||--o{ ORDER_ACTIVITY : has
  ORDER_ACTIVITY ||--o{ ORDER_ACTIVITY_ATTACHMENT : has
  CAMPAIGN ||--o{ CAMPAIGN_LEAD : links
```

### Targets & reporting

```mermaid
erDiagram
  EMPLOYEE_MONTHLY_TARGET ||--o{ DOMAIN : "per domain"
  REGION_MONTHLY_TARGET ||--o{ REGION : "per region"
  DOMAIN_MONTHLY_TARGET ||--o{ DOMAIN : "per domain"
  EXPECTED_ORDER_REPORT ||--o{ EXPECTED_ORDER_REPORT_LEAD : details
  OD_PLAN_REPORT ||--o{ OD_PLAN_ENTRY : entries
```

### Dashboards, notifications, events, settings

```mermaid
erDiagram
  SAVED_DASHBOARD ||--o{ SAVED_DASHBOARD_ASSIGNMENT : assigned
  REPORT_TEMPLATE ||--o{ REPORT_TEMPLATE_ASSIGNMENT : assigned
  NOTIFICATION }o--|| LEAD : references
  USER_NOTIFICATION_PREFERENCE ||--|| USER : per-user
  NOTIFICATION_DEVICE ||--|| USER : fcm tokens
  EXHIBITION_EVENT ||--o{ EVENT_FILE : has
  MARKETING_SETTINGS ||--|| MARKETING_SETTINGS_AUDIT_LOG : audited
```

Key enums (Postgres): `CampaignStatus`, `EmployeeRegionRole`, `EventType`, `EventStatus`,
`PaymentStatus`, `BannerSource`, `FileType`.

Notable model details:
- `ActivityAttachment` carries `is_quotation`, `quotation_number`, `value`, `media_path` — one lead
  activity can hold multiple quotations.
- `EmployeeTask` (4 `Task` endpoints) is per-employee task storage.
- `UserEmailConnection` stores Gmail OAuth tokens for "Connect email".
- `ChangelogVersion` + `AuditLog` + `SupportTicket` are admin/meta tables.
- Cross-field duplication between `Customer` and `Organization` is documented in
  `au-marketing-api/docs/CUSTOMER_FIELDS.md` and `ENTITY_RELATIONSHIPS.md`.

## API / routing reference

All routers except auth, quotations, campaigns, leads, orders, events register under the `/api`
prefix (details below). Almost every route requires a Bearer JWT and checks one or more
`marketing.*` permissions; a 403 with a permission hint is returned otherwise. `marketing.admin`,
superuser, and staff bypass checks. Super-admin/`admin` also see all rows; other roles are filtered
by `app/scope.py`.

> The route inventory below is grouped and abbreviated from `app/routers/*.py` (26 routers).
> For the authoritative list, generate the OpenAPI spec: `docker compose exec web python -c
> "from app.main import app; print(app.openapi())"` or visit `/docs` (Swagger UI).

### Auth & profile — `/api/auth`
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | none | HRMS login → `{ token, user, employee, permissions }` |
| POST | `/api/auth/logout` | auth | Logout |
| POST | `/api/auth/refresh-permissions` | auth | Re-fetch permissions from HRMS (purge cache) |
| GET | `/api/auth/me` | auth | Current user |
| GET | `/api/auth/scope` | auth | Current user's scope/visibility |
| GET | `/api/auth/email-connection` | auth | Email (Gmail) connection status |
| GET | `/api/auth/email/authorize-url` | auth | Google OAuth authorize URL |
| GET | `/api/auth/email/callback` | auth | Google OAuth callback |
| DELETE | `/api/auth/email` | auth | Disconnect email |

### Leads — `/api/leads` (permission: view/create/edit/delete_lead, view_all_leads, lead domain variants)
| Method | Path | Description |
| --- | --- | --- |
| GET / POST | `/api/leads/` | List (paginated, scoped) / create |
| GET / PUT / DELETE | `/api/leads/{lead_id}` | Get / update / delete |
| PATCH | `/api/leads/{lead_id}/series` | Change numbering series |
| PATCH | `/api/leads/{lead_id}/follow-up` | Set follow-up |
| GET / POST | `/api/leads/statuses/` | List / create status options |
| GET / PUT / DELETE | `/api/leads/statuses/{id}` | Status option CRUD |
| GET / POST | `/api/leads/status-groups/` | List / create status groups |
| GET / PUT / DELETE | `/api/leads/status-groups/{id}` | Status group CRUD |
| GET / POST | `/api/leads/types/` | Lead type options |
| GET / PUT / DELETE | `/api/leads/types/{id}` | Lead type CRUD |
| GET | `/api/leads/through/` | Lead "through" (source) options |
| GET / POST | `/api/leads/{lead_id}/activities/` | List / add activity |
| PUT / DELETE | `/api/leads/{lead_id}/activities/{activity_id}` | Edit / delete activity |
| POST | `/api/leads/{lead_id}/activities/{activity_id}/attachments` | Upload attachment (incl. quotation PDF) |
| POST | `/api/leads/{lead_id}/activities/{activity_id}/quotations` | Add quotation |
| GET | `/api/leads/{lead_id}/activities/{activity_id}/attachments/{aid}/download` | Download |
| POST | `.../attachments/{aid}/replace` | Replace file |
| PUT / DELETE | `.../attachments/{aid}` | Update / delete attachment |

### Orders — `/api/orders` (reuses lead permissions; `marketing.delete_order` exists in HRMS but is not used here)
Mirrors the leads surface: `GET/POST /`, `GET/PUT/DELETE /{order_id}`, status-groups CRUD,
statuses CRUD, `GET/POST /{order_id}/activities/`, `PUT/DELETE .../activities/{activity_id}`,
attachments upload/download/replace/update/delete.

### Campaigns — `/api/campaigns` (view/create/edit/delete_campaign)
`GET /`, `GET /{campaign_id}`, `POST /`, `PUT /{campaign_id}`, `DELETE /{campaign_id}`.

### Contacts — `/api/contacts` (view/create/edit/delete_contact; convert also needs create_customer)
`GET /`, `GET /search`, `GET /{contact_id}`, `POST /`, `PUT /{contact_id}`, `DELETE /{contact_id}`,
`POST /{contact_id}/convert-to-customer`.

### Customers — `/api/customers` (view/create/edit/delete_customer)
`GET /`, `GET /search`, `GET /{customer_id}`, `POST /`, `PUT /{customer_id}`, `DELETE /{customer_id}`.

### Organizations & Plants — `/api/organizations`, `/api/plants`
`GET/POST /`, `GET/PATCH/DELETE /{organization_id}`, `GET/POST /{organization_id}/plants`,
`PATCH/DELETE /{organization_id}/plants/{plant_id}`; `/api/plants` list requires
`marketing.view_contact` (see code — plant list is gated by contact permission).

### Domains — `/api/domains` (list = `view_domain` or `rbac.view_domain_tab`; else domain perms)
`GET /`, `GET /{domain_id}`, `POST /`, `PUT /{domain_id}`, `DELETE /{domain_id}`.

### Regions — `/api/regions` (view/create/edit/delete_region, assign_employee_region)
`GET /` (paginated), `GET /{region_id}`, `POST /`, `POST /reorder`, `PUT /{region_id}`,
`DELETE /{region_id}`, `GET /assignments/`, `POST /assign-employee`, `POST /assignments/reorder`,
`GET /assignments/{employee_id}`, `PUT /assignments/{assignment_id}`,
`DELETE /assignments/{assignment_id}`.

### Employees — `/api/employees`
`GET /` (HRMS proxy list), `GET /departments/`, `GET /designations/`, `GET /local/`,
`GET /local/{employee_id}`, `PUT /local/{employee_id}` (edit_region), `POST /sync` (marketing.admin).

### Numbering series — `/api/series`
`GET /` (needs `marketing.admin` **or** create_contact/customer/lead), `GET /{series_id}`,
`POST /`, `PUT /{series_id}`, `DELETE /{series_id}`, `POST /{series_id}/generate-next`,
`POST /generate-next` (by code). Placeholders: `{YYYY} {YY} {MM} {DD} {HH} {mm} {ss} {0:N} {S:code}`
plus entity fields like `{customer.xxx}`.

### Quotations — `/api/quotations` (all require `marketing.view_lead`; admin=all rows, domain head=domain, region head=region, employee=own uploads)
`GET /` (paginated, search/filter/sort), `GET /lead-options`, `GET /filter-options`.

### Reports — `/api`
`GET /reports/scope` (view_report OR view_lead), `GET /reports/summary`,
`POST /reports/expected-orders`, `GET /reports/expected-orders`,
`GET /reports/od-plans`, `GET /reports/od-plans/{year}/{month}`, `PUT /reports/od-plans/{year}/{month}`.

### Dashboard — `/api/dashboard` (all `marketing.view_lead`)
`GET /target-stats`, `PUT /target`, `PUT /target/region`, `PUT /target/domain`,
`GET /domain-target-summary`, `GET /scope-target-stats`, `GET /head-summary`,
`GET /quotation-stats`, `GET /performer-of-month`.

### Saved dashboards & report templates — `/api`
`GET /saved-dashboards/assignable-users`, `GET/POST /saved-dashboards`,
`GET/PATCH/DELETE /saved-dashboards/{id}`, `GET/POST /saved-dashboards/{id}/assignments`,
`DELETE /saved-dashboards/{id}/assignments/{assignment_id}`,
`POST /saved-dashboards/preview-sql-template`, `POST /saved-dashboards/execute-widget`;
`/api/report-templates` (same shape, plus execute-templated SQL with entity scoping params:
`lead_id`, `domain_id`, `region_id`, `contact_id`, `customer_id`, `organization_id`, `plant_id`
and `_ids` variants). Permissions: view_lead for read; create_dashboard / assign_dashboard.

### Tasks / notifications / events / tickets / presence / admin
| Method | Path | Permission | Description |
| --- | --- | --- | --- |
| GET | `/api/tasks/today` | view_lead | Today's tasks |
| POST | `/api/tasks/` | view_lead | Create manual task |
| GET | `/api/tasks/{task_id}` | view_lead | Get task |
| PATCH | `/api/tasks/{task_id}/complete` | view_lead | Complete task |
| GET | `/api/notifications/` | view_lead | Notification list |
| GET | `/api/notifications/unread-count` | view_lead | Unread count |
| PATCH | `/api/notifications/{id}/read` | view_lead | Mark read |
| PATCH | `/api/notifications/read-all` | view_lead | Mark all read |
| GET / PUT | `/api/notifications/preferences` | view_lead | Notification preferences |
| POST | `/api/notifications/devices/register` `/unregister` | view_lead | FCM device tokens |
| GET | `/api/events/` | view_events | Event list (paginated) |
| GET | `/api/events/{event_id}` | view_events | Event detail |
| POST / PUT / DELETE | `/api/events/` + `/api/events/{event_id}` | create/edit/delete_events | Event CRUD |
| POST | `/api/events/{event_id}/end` | edit_events | Mark event ended |
| POST | `/api/events/{event_id}/files` | edit_events | Upload event file |
| GET | `/api/events/{event_id}/files/{file_id}/download` | view_events | Download |
| DELETE | `/api/events/{event_id}/files/{file_id}` | edit_events | Delete file |
| GET | `/api/tickets/` | view_domain | Ticket list |
| POST | `/api/tickets/` | view_domain | Create ticket (via PQ Platform) |
| POST | `/api/tickets/feedback` | view_domain | Rating 1–5 |
| POST | `/api/presence/ping` | auth | Presence heartbeat |
| GET | `/api/presence/active` | `presence.view_users` | Active users |
| WS | `/api/presence/ws` | `presence.view_users` (token query param) | Presence websocket |
| GET / PUT | `/api/marketing/settings` | GET: auth / PUT: marketing.admin | Marketing settings (JSONB); GET returns `X-Marketing-Settings-Version` |
| GET | `/api/audit-logs` | marketing.admin OR view_reports | Audit log |
| GET | `/api/whats-new` | auth | Changelog entries (the "What's New" UI) |
| POST/PUT/DELETE | `/api/whats-new[/{id}]` | marketing.admin | Manage entries |
| GET | `/api/schema` | view_lead | DB introspection |
| GET | `/health`, `/` | none | Health / root (version, docs, health) |

### Worked examples

```bash
# 1. Login (no auth required)
curl -X POST http://localhost:8003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your.name","password":"secret"}'
# → {"token":"<jwt>","user":{...},"employee":{...},"permissions":["marketing.view_lead",...]}

# 2. Authenticated call with the token
curl http://localhost:8003/api/leads/?page=1 \
  -H "Authorization: Bearer <jwt>" \
  -H "Accept: application/json"

# 3. List your scope (what you can see)
curl http://localhost:8003/api/auth/scope -H "Authorization: Bearer <jwt>"

# 4. Generate the next number for a series by code
curl -X POST http://localhost:8003/api/series/generate-next \
  -H "Authorization: Bearer <jwt>" -H "Content-Type: application/json" \
  -d '{"code":"lead_number"}'

# 5. Health (no auth)
curl http://localhost:8003/health
```

Frontend equivalents: all calls live in `lib/marketing-api.ts` (typed client mirroring these
routes) — keep it in sync with backend changes (see Known limitations).

## Coding conventions

Observed in the code (follow these when contributing):

- **Backend:**
  - One router module per domain in `app/routers/`, registered in `app/main.py` via
    `include_router`. Bare `APIRouter()` where the prefix is supplied at include time
    (e.g. `campaigns`, `quotations`); otherwise the prefix lives on the router.
  - Endpoint permissions via FastAPI dependencies `require_permission("marketing.xxx")` /
    `require_any_permission([...])` from `app/dependencies.py`.
  - Row filtering via `get_user_scope()` from `app/scope.py` — never a raw full-table query for
    user-facing list endpoints.
  - Pydantic schemas in `app/schemas.py`; models in `app/models.py`. Enums as SQLAlchemy enums.
  - Attachments through `app/storage.py`; audit through `app/audit_utils.py`.
  - Startup schema changes as **idempotent ALTERs** in `main.py`, not Alembic migrations.
- **Frontend:**
  - Pages under `pages/`, one per route; forms are separate page components (not modals).
  - Routes added in `App.tsx`; nav items added in `constants.tsx` (`SIDEBAR_LINKS` /
    `SECONDARY_LINKS`) with a `permission` field; the `Sidebar` filters by permission.
  - API calls through `lib/marketing-api.ts` (never raw `fetch` except health checks); auth state
    via `store/slices/authSlice.ts` selectors (`selectHasPermission`, etc.).
  - Styling: Tailwind utility classes; tokens per `design.md` / `UI_COMPONENTS_LIBRARY.md`.
  - Component conventions: check whether to import from `components/ui/` vs `UI/`.
  - No `<StrictMode>`; keep the "won-date / kanban status change" entry points in lockstep
    (`LeadsPage.tsx` drag/Won button and `LeadFormPage.tsx` "Mark as Won" both call the API).
  - Every change updates `CHANGES.md` (feature-grouped revision log) and, client-facing,
    both `CHANGELOG.md` files identically plus the version in `package.json` and
    `Sidebar.tsx`'s version label.

## Checklist: adding a new route / page / command

**Backend route:**
1. Add (or reuse) a router in `app/routers/`, using `require_permission`/`require_any_permission`
   dependencies and `get_user_scope()` for row filtering.
2. Add the SQLAlchemy model in `app/models.py` and Pydantic schemas in `app/schemas.py`.
3. For new columns, add an idempotent ALTER in `main.py` (do not hand-write Alembic files).
4. Register the router in `main.py` with `include_router(...)`.
5. Seed reference data via a `scripts/` script if needed.
6. Test with a curl against `http://localhost:8003`.

**Frontend page:**
1. Create the page component in `pages/`.
2. Add the `<Route path="...">` in `App.tsx` (nested under the protected layout).
3. Add the nav item in `constants.tsx` with its `permission` (or leave it out of the nav if the
   screen is reachable only via a button/URL).
4. Add any new API calls to `lib/marketing-api.ts`.
5. Typecheck: `npx tsc --noEmit`; build: `npm run build`.

**Command / script (backend):**
1. Add the script under `scripts/`; run with `docker compose exec -T web python scripts/<name>.py`.
2. Wire into `docker-compose.yml` or the deploy workflow only if it must run on every deploy
   (see the CI note below before touching the workflow).

## Tests

- **Backend:** `pytest` from `au-marketing-api` (config in `pytest.ini`: `testpaths=tests`,
  `asyncio_mode=auto`, `slow` marker). Coverage is **smoke-only**: `tests/conftest.py` swaps in a
  sqlite DB before importing the app; `tests/test_main.py` checks `GET /health` and `GET /`.
  `pytest-cov` is installed but effectively unused — no meaningful endpoint/scope tests exist.
- **Frontend:** `npm run test:run` (Vitest, jsdom). Only `src/test/setup.test.ts` +
  `src/test/setup.ts` — smoke tests. `npm run test:ui` opens the Vitest UI; `npm run test` watches.
- **No CI test step exists** for either repo (the API workflow deploys without running tests).

If you add tests, keep them runnable with `pytest` (backend) and `npm run test:run` (frontend).

## Deployment

**Backend — EC2 via GitHub Actions** (`.github/workflows/deploy-marketing-api.yml`):
1. Push to `main` triggers `appleboy/ssh-action` with secrets `EC2_HOST`, `EC2_USER`,
   `EC2_SSH_KEY`, (optional) `EC2_SSH_PORT`.
2. On the box: `cd au-marketing-api && git pull`, `docker compose down`,
   `docker system prune -af`, `docker compose up -d --build`.
3. **Then the production database is fully reset**: `docker compose exec -T web python
   scripts/reset_db_and_migrate.py` drops the public schema and re-migrates from scratch, followed
   by `scripts/populate_data.py` to seed reference/sample data, dashboards, and report templates.
4. Nginx (from `nginx.conf`) fronts the app for `api.marketing.aureolegroup.com` (and the
   `orielgroup.com` alias), HTTP→HTTPS, SSL via LetsEncrypt, `client_max_body_size 100M`, proxying
   to `web:8000`.

> ⚠️ **Read before touching CI/scripts:** the current pipeline **destroys and rebuilds production
> data on every push to `main`**. Any schema/seed change that isn't covered by the reset+seed
> scripts will be lost or break deploys. Confirm with the team before modifying
> `reset_db_and_migrate.py` or `populate_data.py`.

**Frontend — Vercel:** `vercel.json` rewrites all routes to `/index.html` (SPA). `npm run build`
(`tsc && vite build`) is the production build.

## Known limitations / tech debt

- **Docs drift:** `au-marketing-api/README.md` claims a **5-minute** RBAC cache TTL (actual 60s),
  **S3/boto3** storage (actual local `media/`), and shows **v1.1.0** (actual v1.2.7, parsed from
  CHANGELOG.md). `IMPLEMENTATION_STATUS.md` is stale. `au-marketing-fe/docs/PROJECT_OVERVIEW.md`
  cites "46 tables / 193 endpoints" (actual 53 models, 150+ endpoints).
- **Empty Alembic versions dir** — schema is `create_all` + startup idempotent ALTERs. A stale
  `alembic_version` table can break `reset_db_and_migrate.py`; see `migrations/README_ALEMBIC_RESET.md`.
- **`PQ_API_KEY` has a hardcoded production default** in `app/config.py` — a secret in source.
  Also `credentials.json`, `firebase-service-account.json`, and `Marketing-api.pem` are tracked in
  the backend git history (flagged in `PROJECT_OVERVIEW.md`). Clean these up before adding more
  secret-bearing files.
- **Smoke-only test coverage** on both sides; no lint script on the frontend.
- **AI dashboard / report-template feature is commented out, not dead** — restore per
  `au-marketing-fe/ai_dashboard_restoration.md`; don't delete it as cleanup.
- **Duplicate/unreachable routes:** `/customers` is registered twice in `App.tsx` (harmless);
  `pages/QuotationsPage.tsx` is orphaned (`/quotations` renders `EnquiryQuotationsPage`);
  `/inventory` and `/financials` render static demo pages with no nav links.
- **No `<StrictMode>`** — intentional (double-invoke protection), but means dev-mode strict
  checking is off.
- **`marketing.delete_order` exists in HRMS but is unused** — the orders router reuses lead
  permissions.
- **`orders/:id` renders the order *form*** (not a read-only detail page) per `App.tsx`.
- **Nested git repo trap:** `au-marketing-fe/au-marketing-api` is a gitlink with its own remote —
  use `git -C au-marketing-api ...`; root `git status` won't cover it.
- **CI resets production data** on every push to main (see Deployment).

## Further reading

- [Architecture](./architecture.md) — diagram-first overview.
- [User Guide](./user-guide.md) — the non-technical version.
- [README](./readme.md) — project overview.
- Repo-internal sources of truth: `au-marketing-fe/CLAUDE.md` (authoritative FE guide),
  `au-marketing-fe/AGENTS.md`, `au-marketing-fe/ROLE_SCOPING_RULES.md`,
  `au-marketing-api/REQUIRED_PERMISSIONS.md`, `au-marketing-api/docs/ENTITY_RELATIONSHIPS.md`.
