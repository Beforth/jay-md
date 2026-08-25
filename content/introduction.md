---
title: Introduction
description: What S&M Hub is, who it is for, and how this documentation set is organised.
order: 1
tags:
  - Overview
  - Introduction
---

**S&M Hub** is the sales and marketing operations platform for **Aureole Group**. It manages the end-to-end commercial pipeline — domains and regions, contacts, customers, organizations, leads, quotations, orders, events, and daily reporting (DSR) — with role-based access and row-level visibility enforced by the backend.

The product is built as two repositories that work as one system:

- **[au-marketing-fe](https://github.com/Beforth/au-marketing-fe)** — the React single-page app people use every day.
- **[au-marketing-api](https://github.com/Beforth/au-marketing-api)** — the FastAPI service and PostgreSQL database behind it.

Users sign in with their company (HRMS) account; the system then shows only the leads, regions, and numbers their role is allowed to see.

## Who it is for

- **Sales employees** — track their own leads, log activities and follow-ups, submit daily sales reports.
- **Region heads and supervisors** — see and manage everything in their region.
- **Domain heads and coordinators** — oversee a whole sales domain, its regions, and targets.
- **Administrators** — configure numbering series, roles, marketing settings, and audit logs.

## What it covers

| Area | What you can do |
| --- | --- |
| Lead pipeline | Kanban-style lead tracking with statuses, types, activity logs, follow-up reminders, attachments, and "mark as won" flows |
| Orders & quotations | Order pipeline mirroring leads, enquiry-to-quotation workflow, automatic numbering series, DSR enquiry logs |
| Database (master data) | Organizations with plants, customers, and contacts; contact-to-customer conversion |
| Domains & regions | Sales territories with employee assignment, heads/coordinators, and reordering |
| Events | Exhibition management with files, stall vendors, travel and gifting entries |
| Reporting | Dashboard targets per employee/region/domain, expected orders, OD plans, saved dashboards, report templates |
| Administration | Numbering series, role scoping rules, marketing settings, audit logs, "What's New" changelog |
| Access control | Permission gates plus row-level data scoping, support tickets, live presence |
| Notifications | In-app notifications and optional web push (Firebase FCM) |

## How to use this documentation

Use the sidebar to move through the set, or press **⌘K** to search across every page:

- **[Overview](/docs/overview)** — the two repos at a glance: stacks, environments, and how they connect.
- **[Project overview](/docs/readme)** — features, tech stack table, architecture diagram, quick start.
- **[User Guide](/docs/user-guide)** — plain-language manual for day-to-day users.
- **[Help Book](/docs/help-book)** — screen-by-screen reference: prerequisites, steps, permissions, troubleshooting.
- **[Developer Guide](/docs/developer-guide)** — setup, environment variables, data model, API reference, deployment.
- **[Architecture](/docs/architecture)** — diagram-first view of what connects to what.
- **[Inventory Context](/docs/inventory-context)** — what "inventory" means in S&M Hub, and what it intentionally does not do.
- **[Changelog](/docs/changelog-template)** — release-log template.

## Quick start in one line

Two independent repos, cloned separately. The backend runs in Docker Compose (Postgres + API + worker); the frontend is a Vite dev server pointed at the API:

```bash
# Backend — needs Docker + the .env from .env.example
git clone <backend-repo-url> au-marketing-api && cd au-marketing-api
cp .env.example .env && docker compose up --build -d
curl http://localhost:8003/health

# Frontend — needs Node 18+
cd .. && git clone <frontend-repo-url> au-marketing-fe && cd au-marketing-fe
npm install && npm run dev   # http://localhost:3000
```

There is no local sign-up: login requires credentials from the external HRMS service (`https://hrms.encryptedbar.com/api/rbac`).
