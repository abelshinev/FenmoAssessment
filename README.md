# Expense Tracker (Fenmo Assessment)

## Overview

This is a minimal full-stack expense tracking application that allows users to create, view, filter, and analyze their expenses.

The system is designed to behave correctly under real-world conditions such as retries, duplicate submissions, and page refreshes.

---

## Live Links

* Frontend: https://your-vercel-app.vercel.app
* Backend API: https://fenmoassessment.onrender.com

---

## Features

### Backend

* `POST /expenses`
  Create a new expense (amount, category, description, date)

  * Handles retries safely using idempotency keys
* `GET /expenses`

  * Returns all expenses
  * Supports:

    * `category` filter
    * `sort=date_desc`

---

### Frontend

* Add expense form
* Expense list/table
* Filter by category
* Sort by newest date
* Total of visible expenses

---

## Design Decisions

### 1. Idempotency (Core Focus)

To handle retries and duplicate submissions, the backend supports an `Idempotency-Key` header.

* Same key → same result (no duplicate records)
* Different key → treated as a new request

This ensures correctness under:

* multiple clicks
* network retries
* page refreshes

---

### 2. Database Choice (SQLite)

SQLite (via `better-sqlite3`) was used because:

* simple setup (no external service required)
* synchronous and reliable
* suitable for small-scale systems

The database is automatically initialized on server startup.

---

### 3. Data Modeling

* `amount` stored as `REAL` to handle decimal values correctly
* `idem_key` stored as `UNIQUE` to enforce idempotency at DB level
* `created_at` stored for ordering and tracking

---

### 4. System Structure

* Monorepo with:

  * `/client` → frontend (Vite)
  * `/server` → backend (Express)
* Clear separation between API, models, and DB logic

---

## Handling Real-World Conditions

The system is designed to behave correctly under:

* Multiple submit clicks
* Network retries
* Slow or failed API responses
* Page refresh after submission

Idempotency ensures no duplicate records are created in these scenarios.

---

## Trade-offs

Due to the time constraint:

* Used SQLite with local file storage (ephemeral on deployment)
* No authentication layer
* No pagination (small dataset assumption)
* Minimal UI styling

In a production system:

* A persistent database (e.g., PostgreSQL) would be used
* Authentication and rate limiting would be added

---

## What Was Not Done

* Automated tests
* Advanced UI/UX improvements
* Category summaries or analytics

These were deprioritized in favor of correctness and system behavior.

---

## Testing

Idempotency and retry safety were tested by:

* Sending multiple POST requests with the same idempotency key
* Verifying no duplicate records were created
* Simulating retries via manual requests and browser tools

---

## Tech Stack

* Frontend: Vite + JavaScript
* Backend: Node.js + Express
* Database: SQLite (`better-sqlite3`)
* Deployment:

  * Frontend → Vercel
  * Backend → Render

---

## Running Locally

### Backend

```bash
cd server
npm install
node server.js
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Final Note

The focus of this implementation was on correctness, simplicity, and reliability under real-world conditions rather than feature breadth.
