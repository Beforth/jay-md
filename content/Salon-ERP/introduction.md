---
title: Introduction
description: What Salon ERP is, who it is for, and how the documentation is organised.
order: 1
tags:
  - Overview
  - Introduction
---

**Salon ERP** is a multi-branch salon management system built for the day-to-day running of one or more salons and beauty parlours. It is a React web app for owners, managers, cashiers, and staff, backed by an Express API and PostgreSQL.

It covers the whole floor-to-finance cycle: customer tokens and the salon floor, billing with payments, services and packages, product inventory and purchases, cash reconciliation and expenses, attendance, staff incentives, and reporting.

## Who it is for

- **Owners and developers** — full cross-branch access, configuration, and reports.
- **Managers** — branch-scoped operations, staff, and reports.
- **Cashiers** — floor, billing, and customers.
- **Employees** — their own dashboard, performance, and attendance.

## What it covers

| Area | What you can do |
| --- | --- |
| Floor operations | Customer tokens, salon floor (chairs), employee status |
| Billing | End-to-end bills with cash / card / UPI / other payments |
| Catalog | Services, packages, skills, service recipes |
| Inventory | Products/SKUs, warehouses, stock levels, transfers, purchases, barcode printing |
| Finance | Cash drawer reconciliation, bank deposits, expenses, UPI accounts, savings pots |
| People | Attendance (manual + machine punch), shifts, incentives, staff performance |
| Reporting | Sales, inventory, consumption, and branch P&L for privileged roles |
| System | Branch setup, settings, attendance API keys, in-app docs, version history |

## How to use this documentation

Use the sidebar to move through the set, or press **⌘K** to search across every page:

- **[Overview](/docs/Salon-ERP/README)** — key features, tech stack, and quick start.
- **[User Guide](/docs/Salon-ERP/USER_GUIDE)** — a plain-language manual for people who use the app day to day.
- **[Developer Guide](/docs/Salon-ERP/DEVELOPER_GUIDE)** — local setup, environment variables, data model, API reference, and deployment.
- **[Architecture](/docs/Salon-ERP/ARCHITECTURE)** — diagram-first view of how the pieces connect.
- **[Help Book](/docs/Salon-ERP/HELP_BOOK)** — the in-depth help reference for every screen.
- **[Inventory Context](/docs/Salon-ERP/INVENTORY_CONTEXT)** — notes on how inventory works, and known limitations.
- **[Changelog](/docs/Salon-ERP/CHANGELOG_TEMPLATE)** — the release-log template.

## Quick start in one line

The frontend is a Vite/React SPA that talks to the backend API at `http://localhost:5001/api/v1` by default. The quickest local run:

```bash
# Backend
cd salon-erp-be && npm install && npx prisma generate && npm run db:push && npm run db:seed && npm run dev

# Frontend
cd .. && npm install && npm run dev
```

> The live demo runs at [salon-erp-eta.vercel.app](https://salon-erp-eta.vercel.app) — ask your team for the address you should actually use.
