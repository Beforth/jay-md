---
title: User guide
description: How to use S&M Hub — sign-in, navigation, every screen, workflows, and FAQ.
order: 3
tags:
  - Guide
---

# User guide

> For a non-technical reader — no code, no jargon. Every screen below states exactly
> what to click to reach it, taken from the application's navigation.

## How to access the project

S&M Hub is a web app — there is nothing to install. You open it in your browser and sign in with
your normal office (HRMS) username and password. There is no public self-sign-up; your account is
created by your company.

- **The production address** is: ⚠️ NEEDS CONFIRMATION — the frontend is deployed behind the
  marketing domain (see the backend's `FRONTEND_SETTINGS_URL`, e.g. `https://marketing.aureolegroup.com/settings`).
  Ask your administrator for the exact URL.
- **During development** the app runs at `http://localhost:3000`.

**To sign in:**
1. Open the app address in Chrome, Edge, or Firefox.
2. On the **Sign in** screen, enter your **Username** (left box).
3. Enter your **Password** (right box).
4. Press **Sign in**.

If you do not know your username or password, or you get a "permission" error, contact your office
administrator — accounts and permissions are managed centrally, not inside this app.

## Getting to know the screen

After signing in you land on the **Dashboard**. The layout never changes, which makes the rest of
the app easy to learn once.

- **Left panel — the menu.** This is your map. It is divided into **Main Menu** (your day-to-day
  screens) and, if you are an administrator, an **Administration** section near the bottom. The
  bottom also has **Settings** and **Support & Tickets**. Menu items you are not allowed to use do
  not appear at all.
- **Top of the menu — the logo and version.** Clicking the logo takes you back to the Dashboard.
  The small blue button with a version number (e.g. `v1.2.7`) opens the "What's New" window, which
  lists recent changes.
- **Your name at the bottom** of the menu shows who is signed in and your job title.
- **The main area.** Every screen shows a heading, then either a **list** or a **board**:

  - **List view** — a table of rows with a **search box** (usually top-right) and **filters**.
    Click a row's edit (pencil) or eye icon to open it.
  - **Board view** (used for Leads) — columns of cards you can **drag** from one column to another.
  - **Forms** — screens for creating or editing one record, with boxes for each piece of
    information and **Save** / **Cancel** buttons. Required boxes are marked with `*`.
  - **Page numbers** at the bottom of long lists let you move between pages.

- **Common buttons:** a blue **+** (or "New…") creates something new; a **pencil** edits; a
  **trash bin** deletes (it usually asks you to confirm first); a **magnifying glass** searches.
- **Notifications:** the bell in the top bar shows unread alerts (new inquiries, follow-ups due,
  system messages). Click a notification to jump to the related record.

## Glossary

Plain-language meanings of words used in the app:

| Word | What it means |
| --- | --- |
| **Lead** | A sales opportunity — a company or person you are following up with, before it becomes an order. |
| **Customer** | A company that buys from you. |
| **Contact** | A person — usually someone you deal with at a company. |
| **Organization** | A company record; it can hold one or more **Plants** (factories/sites). |
| **Domain** | A sales territory or business line (e.g. a product family). Leads belong to a domain. |
| **Region** | A geographical area within a domain, assigned to sales people and a region head. |
| **Quotation** | A formal price quote sent to a customer (an "enquiry" becomes a quotation). |
| **Order** | A confirmed purchase. |
| **Status group / status** | The stages a lead or order moves through (e.g. New → Follow-up → Won / Lost). |
| **Follow-up** | A planned next action on a lead, with a reminder date. |
| **Numbering series** | The pattern used to generate automatic numbers for leads, orders, and quotations (e.g. `LEAD-00001`). |
| **DSR** | Daily Sales Report — the record of the day's enquiries and sales activity. |
| **Expected order** | A forecast you enter for an order you expect to receive. |
| **OD Plan** | Order Disposition Plan — a month-by-month forecast of orders. |
| **Scope / visibility** | What you are allowed to see. The system shows you only the records your role is entitled to (your own leads, your region, your domain). |
| **Won / Lost** | Final statuses of a lead: the deal was won, or it was lost. |

## Quick start — most common tasks

| Task | What to do |
| --- | --- |
| Record a new sales opportunity | **Main Menu → Leads →** blue **+** button → fill in the form → **Save** |
| Find a lead or customer | Use the **search** box on the **Leads**, **Database**, or **Quotations** screen |
| Follow up on a lead | **Main Menu → Leads →** open the lead → open an activity → set the next **follow-up date** |
| Send a quotation | **Main Menu → Leads →** open the lead → add a **quotation** to the activity log |
| Log your daily sales | **Main Menu → Leads** (or the DSR screen at `/dsr`) and add your enquiries/orders for the day |
| See how your team is performing | **Main Menu → Dashboard** or **Main Menu → My Team** |

## Screens and what you can do

### Dashboard — reached by clicking **Main Menu → Dashboard**

The home screen. It shows summary numbers and charts for your sales activity: targets achieved,
won/lost leads, status breakdown, region breakdown, and inquiries vs quotations. A "What's New"
panel shows the latest system changes, and an activity log shows recent events. There is nothing to
enter here — it is for reading your numbers at a glance.

### Leads — reached by clicking **Main Menu → Leads**

The heart of the app. Two ways to view your opportunities:

1. **Board view** (default) — opportunities as cards in columns by status. **Drag** a card from one
   column to another to change its status (for example, drag to "Won" when the deal is won).
2. **List view** — switch using the layout icon near the top; shows the same records in a table.

**To add a lead:**
1. Click the blue **+** (or "Add Lead") button.
2. Fill in the company/person, domain, region, and contact details.
3. Choose a **status** (it starts in the first status group) and a **type/source** if needed.
4. Click **Save**. The lead gets an automatic number if numbering is set up.

**To follow up:**
1. Open the lead (click its card or row).
2. Add an **activity** (a note or a call log) and tick/enter the **follow-up** date.
3. The reminder appears on the screen and as a notification when it is due.

**To mark a lead won or lost:** use the board's **Won** / **Lost** buttons or the "Mark as Won"
option inside the lead form. You can also attach files (e.g. a PDF quotation) to a lead's activity.

### Quotations — reached by clicking **Main Menu → Quotations**

A list of all enquiry-to-quotation activity across the leads you can see. Use the search and
filters to find a quotation; clicking an entry takes you to the related lead. Quotation numbers are
generated automatically from the numbering series.

### Orders — reached by clicking **Main Menu → Orders**

Confirmed orders, shown exactly like Leads: a board with status columns and a list view. Use the
blue **+** to record a new order, open an order to add activities or attachments, and move it
between status columns as it progresses.

### Database — reached by clicking **Main Menu → Database**

Master records of the people and companies you deal with. This screen has **three tabs**:

- **Organizations** — company records; open one to see its **Plants** (sites). Add new ones with
  the **+** button.
- **Customers** — the companies that buy from you.
- **Contacts** — individual people.

You can **search** across the list, **open** a record to see its details, and use the **+** button
to create new ones. On a contact's detail screen there is also a **Convert to Customer** action.

### My Team — reached by clicking **Main Menu → My Team**

A view of your team members and their activity — only visible if your role has the "My Team"
permission. It shows who is assigned where and how the team is performing.

### Events — reached by clicking **Main Menu → Events**

Exhibition and event management. The list shows all events you can see; the **+** button creates a
new event (name, dates, domain). Open an event to see its detail page: attach **files**, manage
**stall vendors**, and record **travel** and **gifting** entries. Events can be marked **ended**
when finished.

### Reports — reached by clicking **Main Menu → Reports**

The reporting hub:

- **Summary** — headline numbers for your scope.
- **Expected Orders** — add a forecast with the **+** button; enter customer, value, and expected
  date. Existing forecasts are listed and can be reviewed.
- **OD Plan** — monthly order forecast; open the current month to enter planned values.
- Target statistics and domain summaries appear here too.

### Administration — reached by opening **Administration** at the bottom of the menu (only shown to administrators)

- **Numbering Series** — the rules that generate automatic lead/order/quotation numbers. Each row
  shows a code, a pattern, and the next number. Create a series with **+**, edit it, or set a
  series as the default for leads/orders.
- **Roles** — the list of roles and their scoping rules (who can see what). This is a reference
  screen for administrators.

### Settings — reached by clicking **Settings** at the bottom of the menu

Personal and system settings:

- **Visibility** — how far back in time numbers are shown (e.g. "Past quarter access"). This
  controls what you can *see*, not what you can do.
- **Notifications** — choose which notification types you receive.
- **Email connection** — connect your Gmail account if you want to send emails from the app
  ("Connect email" via Google).
- **Marketing settings** (administrators) — system-level preferences.

### Support & Tickets — reached by clicking **Support & Tickets** at the bottom of the menu

Raise a support request: describe the problem, submit it, and rate the response (1–5 stars) after
the support team replies.

### Screens not in the main menu

These exist but are not in the left-hand menu. You reach them only through other pages or a direct
web address:

| Screen | How it is reached |
| --- | --- |
| **Lead / order / contact / customer forms** | The **+** button on each list screen, or the pencil icon on a record |
| **Event detail** | Click an event in **Events** |
| **Domain form / region form** | The **+** or edit buttons inside **Domains** |
| **DSR (daily sales report)** | No menu link — direct address only: `/dsr` |
| **Live Activity** | No menu link — direct address only: `/live-activity` (requires the "view users" permission) |
| **Report Templates** | No menu link — direct address only: `/report-templates` |
| **Schema (database reference)** | No menu link — direct address only: `/schema` (technical reference) |
| **Employees** | No menu link — direct address only: `/employees` |

## Example workflows

### 1. Record a new opportunity and follow it up

1. Click **Leads** in the menu.
2. Click the **+** button.
3. Enter the company/person details, pick the **domain** and **region**, and click **Save**.
4. Back on the board, open the lead and add an **activity** (e.g. "Called — will revert next
   week") with a **follow-up date**.
5. When you hear back, drag the card to the matching status column.
6. If the deal closes, drag it to **Won** (or use **Mark as Won**); if it falls through, use
   **Lost**.

### 2. Turn an existing contact into a customer and create an order

1. Click **Database** → the **Contacts** tab.
2. Find the person with the search box, open them, and click **Convert to Customer**.
3. Switch to the **Customers** tab — the new customer is there.
4. Click **Orders** in the menu → **+** to create the order against that customer.
5. Move the order through its status columns as it is delivered.

### 3. Submit your expected orders and check the dashboard

1. Click **Reports** in the menu.
2. Open **Expected Orders** and click **+** to add the value and expected date.
3. Return to the **Dashboard** and check your **Targets** chart — your new forecast is reflected
   there.
4. If your manager uses **My Team**, they can see the same numbers on the team view.

## FAQ

### "I can't sign in"
Check caps-lock and that you use your office username/password (same as your HRMS login), not an
email address. If it still fails, ask your administrator — passwords are not managed in this app.

### "A menu item I need is missing"
Menu items are hidden when your role doesn't include the related permission. Tell your
administrator which screen you need and which task you are trying to do; they can adjust the role.

### "I can see a record exists but I can't open it / can't see the numbers"
Visibility is enforced by your role and region. If you believe you should see it, ask your
administrator — they may need to assign the region or domain to you, or extend visibility.

### "I can't find the DSR / Live Activity / Report Templates screens"
Those screens have no menu link. Open them directly by typing the web address from the "Screens
not in the main menu" table above (e.g. add `/dsr` to the app address).

### "Why is my lead number not what I expected?"
Automatic numbers come from the **Numbering Series** configured by your administrator. If numbers
look wrong, ask an administrator to check **Administration → Numbering Series**.

### "I deleted something by accident"
Most deletes ask for confirmation first. There is no recycle bin in the app — if something
important is deleted, contact **Support & Tickets** so the administrator can restore it from a
backup.

## Further reading

- [README](./readme.md) — project overview.
- [Developer Guide](./developer-guide.md) — the technical version of this guide.
