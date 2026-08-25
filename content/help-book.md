---
title: Help Book
description: Screen-by-screen guide to S&M Hub — access, roles, leads, quotations, orders, database, events, reports, DSR, administration, settings, and troubleshooting.
order: 7
tags:
  - Help
  - Reference
---

# Help Book

A comprehensive, screen-by-screen reference for using S&M Hub. Every section states exactly what to click to reach the screen, taken from the application's navigation.

---

## Table of contents

1. [Access & sign-in](#1-access--sign-in)
2. [Getting to know the screen](#2-getting-to-know-the-screen)
3. [Roles & permissions](#3-roles--permissions)
4. [Dashboard](#4-dashboard)
5. [Leads](#5-leads)
6. [Quotations](#6-quotations)
7. [Orders](#7-orders)
8. [Database](#8-database)
9. [Domains & regions](#9-domains--regions)
10. [My Team](#10-my-team)
11. [Events](#11-events)
12. [Reports](#12-reports)
13. [DSR — daily sales report](#13-dsr--daily-sales-report)
14. [Administration](#14-administration)
15. [Settings](#15-settings)
16. [Support & Tickets](#16-support--tickets)
17. [Screens not in the main menu](#17-screens-not-in-the-main-menu)
18. [Example workflows](#18-example-workflows)
19. [Troubleshooting & FAQ](#19-troubleshooting--faq)

---

## 1. Access & sign-in

S&M Hub is a web app — there is nothing to install. Open it in your browser and sign in with your normal office (HRMS) username and password.

**To sign in:**

1. Open the app address in Chrome, Edge, or Firefox.
2. On the **Sign in** screen, enter your **Username** (left box).
3. Enter your **Password** (right box).
4. Press **Sign in**.

> **Note:** There is no public self-sign-up. Accounts and permissions are managed centrally in HRMS, not inside this app. If you do not know your credentials, or you get a "permission" error, contact your office administrator.

## 2. Getting to know the screen

After signing in you land on the **Dashboard**. The layout never changes, which makes the rest of the app easy to learn once.

- **Left panel — the menu.** Divided into **Main Menu** (day-to-day screens) and, for administrators, an **Administration** section near the bottom. The bottom also has **Settings** and **Support & Tickets**. Menu items you are not allowed to use do not appear at all.
- **Top of the menu — logo and version.** Clicking the logo returns to the Dashboard. The small blue version button (e.g. `v1.2.7`) opens the **"What's New"** window listing recent changes.
- **Your name at the bottom** of the menu shows who is signed in and your job title.
- **The main area** shows either a **list** or a **board**:
  - **List view** — a table of rows with a **search box** (usually top-right) and **filters**. Click a row's pencil or eye icon to open it.
  - **Board view** (Leads and Orders) — columns of cards you can **drag** between status columns.
  - **Forms** — full pages for creating or editing a record; required boxes are marked with `*`.
  - **Page numbers** at the bottom of long lists.
- **Common buttons:** blue **+** creates something new; **pencil** edits; **trash bin** deletes (usually asks to confirm); **magnifying glass** searches.
- **Notifications:** the bell in the top bar shows unread alerts (new inquiries, follow-ups due, system messages). Click one to jump to the related record.

## 3. Roles & permissions

Access has two layers that work together:

1. **Permission gates** — each action (view, create, edit, delete) checks a `marketing.*` permission from HRMS. If your role lacks the permission, the button or menu item simply does not appear.
2. **Row-level scope** — even with permission, you only see the rows your role allows: super admins see everything; domain heads see their domain; region heads their region; employees their own records.

| Role (scope) | Typically sees |
| --- | --- |
| Super admin / admin | All rows, all actions |
| Domain head / coordinator | Everything inside their sales domain |
| Region head | Everything inside their region(s) |
| Supervisor / coordinator | Their assigned groups within a region |
| Employee | Only records they created or that refer to them |

Common permission names you may hear referenced: `marketing.view_lead`, `marketing.create_lead`, `marketing.edit_lead`, `marketing.delete_lead`, `marketing.view_contact`, `marketing.create_customer`, `marketing.view_events`, `marketing.create_events`, `presence.view_users`, `marketing.admin`.

> **Note:** Visibility Settings (**past quarter access**) controls how far back numbers are *displayed*. It never blocks saving or editing data.

## 4. Dashboard

**Reached by clicking Main Menu → Dashboard**

The home screen. It shows summary numbers and charts for your sales activity:

- Targets achieved
- Won/lost leads
- Status breakdown
- Region breakdown
- Inquiries vs quotations

A **"What's New"** panel shows the latest system changes, and an activity log lists recent events. Nothing to enter here — it is for reading your numbers at a glance.

## 5. Leads

**Reached by clicking Main Menu → Leads**

The heart of the app. Two ways to view your opportunities:

1. **Board view** (default) — cards in columns by status. **Drag** a card from one column to another to change its status.
2. **List view** — switch using the layout icon near the top; the same records as a table.

### Add a lead

1. Click the blue **+** ("Add Lead") button.
2. Fill in the company/person, domain, region, and contact details.
3. Choose a **status** (it starts in the first status group) and a **type/source** if needed.
4. Click **Save**. The lead gets an automatic number if numbering is set up (e.g. `LEAD-00001`).

### Follow up

1. Open the lead (click its card or row).
2. Add an **activity** (a note or call log) and enter/tick the **follow-up date**.
3. The reminder appears on screen and as a notification when due.

### Mark won or lost

Use the board's **Won** / **Lost** buttons, drag the card to that column, or use **"Mark as Won"** inside the lead form. All entry points update the same record.

### Attachments & quotations on activities

Open an activity to attach files (e.g. a PDF quotation). An activity attachment can be flagged as a **quotation** with its own quotation number and value — a single activity can hold multiple quotations.

## 6. Quotations

**Reached by clicking Main Menu → Quotations**

A list of all enquiry-to-quotation activity across the leads you can see.

- Use **search** and **filters** to find a quotation.
- Clicking an entry takes you to the related lead.
- Quotation numbers come automatically from the numbering series.
- Scoping follows your role: admin sees all, domain head sees their domain, region head their region, employees see their own uploads.

Quotations are added from a lead's activity log — there is no standalone "new quotation" form.

## 7. Orders

**Reached by clicking Main Menu → Orders**

Confirmed orders, shown exactly like Leads: a board with status columns plus a list view.

- Blue **+** records a new order against a customer.
- Open an order to add activities or attachments.
- Move it between status columns as it progresses.
- Order numbering uses its own series if configured.

## 8. Database

**Reached by clicking Main Menu → Database**

Master records of the people and companies you deal with. Three tabs:

- **Organizations** — company records; open one to see its **Plants** (sites/factories). Add new ones with **+**.
- **Customers** — the companies that buy from you.
- **Contacts** — individual people.

You can search across each list, open records, and create new ones. On a contact's detail screen there is also a **Convert to Customer** action (needs contact view plus customer-create permission).

> **Note:** A Plant belongs to an Organization. Plants are sites, not stock locations — see [Inventory Context](/docs/inventory-context).

## 9. Domains & regions

Sales territories structure everything in S&M Hub: leads, orders, targets, and visibility.

- **Domain** — a sales territory or business line (e.g. a product family). Reached via **Main Menu → Domains** (visible if your role includes domain permissions).
- **Region** — a geographical area within a domain. Each region can have a **region head**, coordinators, and assigned employees.

Typical tasks:

- Create/edit domains and regions (**+** / pencil icons).
- **Assign employees** to a region (with roles like head/coordinator).
- **Reorder** regions to control how they appear in pickers and boards.

## 10. My Team

**Reached by clicking Main Menu → My Team**

A view of your team members and their activity — visible only if your role includes it. It shows who is assigned where and how the team is performing.

## 11. Events

**Reached by clicking Main Menu → Events**

Exhibition and event management.

1. The list shows all events you can see; **+** creates a new event (name, dates, domain).
2. Open an event's detail page to attach **files**, manage **stall vendors**, and record **travel** and **gifting** entries.
3. Mark events **ended** when finished.

## 12. Reports

**Reached by clicking Main Menu → Reports**

The reporting hub:

- **Summary** — headline numbers for your scope.
- **Expected Orders** — add a forecast with **+**: customer, value, expected date. Existing forecasts are listed and reviewable.
- **OD Plan** — monthly order forecast; open the current month to enter planned values.
- Target statistics and domain summaries appear here too.

Targets can be set per employee, per region, and per domain (administrators/head roles).

## 13. DSR — daily sales report

**No menu link — direct address only: `/dsr`**

The DSR is the record of the day's enquiries and sales activity. Sales staff use it for daily reporting; entries feed the enquiry logs.

> ⚠️ NEEDS CONFIRMATION: exact field list and any submission cut-off rules for the DSR form.

## 14. Administration

**Reached by opening Administration at the bottom of the menu (administrators only)**

- **Numbering Series** — rules that generate automatic lead/order/quotation numbers. Each row shows a code, a pattern, and the next number. Create with **+**, edit, or set a default series for leads/orders. Placeholders include `{YYYY}`, `{MM}`, `{DD}`, `{0:N}` sequence padding, and entity fields like `{customer.xxx}`.
- **Roles** — reference list of roles and their scoping rules (who can see what).

Administrators also manage **Marketing settings** (system preferences, under Settings), **audit logs**, and **"What's New"** changelog entries.

## 15. Settings

**Reached by clicking Settings at the bottom of the menu**

- **Visibility** — how far back in time numbers are shown (e.g. "Past quarter access"). Controls what you can *see*, not what you can do.
- **Notifications** — choose which notification types you receive.
- **Email connection** — connect your Gmail account to send emails from the app ("Connect email" via Google).
- **Marketing settings** (administrators) — system-level preferences.

## 16. Support & Tickets

**Reached by clicking Support & Tickets at the bottom of the menu**

Raise a support request: describe the problem and submit it. After the support team replies, rate the response (1–5 stars). Tickets are handled through the PQ Platform integration.

## 17. Screens not in the main menu

These exist but have no left-menu link. Reach them through other pages or a direct web address:

| Screen | How it is reached |
| --- | --- |
| Lead / order / contact / customer forms | The **+** button on each list screen, or the pencil icon on a record |
| Event detail | Click an event in **Events** |
| Domain / region forms | The **+** or edit buttons inside **Domains** |
| DSR | Direct address only: `/dsr` |
| Live Activity | Direct address only: `/live-activity` (requires `presence.view_users`) |
| Report Templates | Direct address only: `/report-templates` |
| Schema (DB reference) | Direct address only: `/schema` |
| Employees | Direct address only: `/employees` |

> `/inventory` and `/financials` render static demo pages with no nav links — they are not product features.

## 18. Example workflows

### Record a new opportunity and follow it up

1. Click **Leads** in the menu.
2. Click **+**.
3. Enter the company/person details, pick the **domain** and **region**, click **Save**.
4. Open the lead and add an **activity** (e.g. "Called — will revert next week") with a **follow-up date**.
5. When you hear back, drag the card to the matching status column.
6. Won? Drag to **Won** (or **Mark as Won**). Lost? Use **Lost**.

### Turn a contact into a customer and create an order

1. **Database** → **Contacts** tab.
2. Find the person via search, open them, click **Convert to Customer**.
3. Switch to **Customers** — the new customer is there.
4. **Orders** → **+** to create the order against that customer.
5. Move the order through its status columns as it is delivered.

### Submit expected orders and check the dashboard

1. Click **Reports**.
2. Open **Expected Orders** → **+**, add value and expected date.
3. Return to **Dashboard** and check your **Targets** chart — the new forecast is reflected there.
4. Managers using **My Team** see the same numbers on the team view.

## 19. Troubleshooting & FAQ

### "I can't sign in"

Check caps-lock and that you use your office username/password (same as HRMS login), not an email address. If it still fails, ask your administrator — passwords are not managed in this app.

### "A menu item I need is missing"

Menu items hide when your role lacks the related permission. Tell your administrator which screen you need and which task you're trying to do; they can adjust the role.

### "I can see a record exists but I can't open it / can't see the numbers"

Visibility is enforced by role and region. Ask your administrator — they may need to assign the region or domain to you, or extend visibility.

### "I can't find the DSR / Live Activity / Report Templates screens"

Those screens have no menu link. Type the direct address from the table above (e.g. add `/dsr` to the app address).

### "Why is my lead number not what I expected?"

Automatic numbers come from the **Numbering Series** configured by your administrator. Ask an administrator to check **Administration → Numbering Series**.

### "I deleted something by accident"

Most deletes ask for confirmation first. There is no recycle bin — if something important was deleted, contact **Support & Tickets** so the administrator can restore from backup.

### Notifications aren't arriving

In-app notifications appear under the bell. Web push (browser notifications) is optional and needs permission granted to the site plus Firebase push configured by the team.

---

## Appendix: quick glossary

| Term | Meaning |
| --- | --- |
| Lead | A sales opportunity being followed up before it becomes an order |
| Customer | A company that buys from you |
| Contact | A person at a company |
| Organization | A company record holding one or more Plants (sites) |
| Domain | A sales territory/business line; leads belong to a domain |
| Region | A geographical area within a domain, assigned to sales people |
| Quotation | A formal price quote sent to a customer |
| Status group / status | Stages a lead or order moves through (New → Follow-up → Won/Lost) |
| Numbering series | Pattern generating automatic lead/order/quotation numbers |
| DSR | Daily Sales Report — the day's enquiries and sales activity |
| Expected order | A forecast for an order you expect to receive |
| OD Plan | Order Disposition Plan — month-by-month order forecast |
| Scope / visibility | What rows your role is allowed to see |
