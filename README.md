# Expense Tracker - Technical Assessment

A minimal full-stack Expense Tracker built for Fenmo's technical assessment.

## Key Design Decisions

### Backend
- **SQLite with WAL:** Chosen for zero-config persistence with excellent performance for concurrent reads and writes.
- **Paise for Money:** Amounts are stored as integers (paise) in the database to eliminate floating-point rounding errors entirely.
- **Server-Side Idempotency:** Implemented using a unique `idem_key` passed from the client. This ensures that network retries or page refreshes don't result in duplicate transactions.
- **ES Modules:** Used modern Node.js ES modules for a cleaner, future-proof codebase.

### Frontend
- **"Adjust Render" Pattern:** Custom `useExpenses` hook uses the "adjusting state during render" pattern to avoid cascading re-renders, ensuring a smooth transition to loading states.
- **Double-Submit Protection:** The form blocks multiple clicks while a request is in flight.
- **Resilient Idempotency:** The client-side idempotency key persists across failed retries and only regenerates upon a successful response.

## Trade-offs
- **Styling:** Focused on functional clarity and accessibility over complex CSS frameworks to stay within the timebox.
- **Testing:** Implemented core logic verification via scratch scripts and manual E2E testing instead of a full Jest/Cypress suite.
- **Categories:** Hardcoded categories in the UI/Model for simplicity; a production version would likely have a separate categories table/endpoint.

## Intentionally Not Done
- **Authentication:** Omitted as it was outside the core requirements for this minimal stack.
- **Pagination:** Not implemented as the current use case focuses on a small list of personal expenses.
- **Edit/Delete:** Focused strictly on the core requirements of creating and viewing/filtering expenses.

## How to Run

### Backend
1. `cd server`
2. `npm install`
3. `npm run start` (Starts on port 3000)

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev` (Starts on port 5173)
