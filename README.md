# Business Web Application

A Vue.js business web application with Square API integration for payments.

## Project Structure

- Frontend: Vue.js application with components for business management
- Backend: Node.js server with Square API integration

## Setup

### Frontend
\\\
npm install
npm run dev
\\\

### Backend
\\\
cd backend
npm install
npm start
\\\

# Square API Admin Panel

## Overview
This project is a full-featured admin panel for managing customers, invoices, estimates, scheduling, and chatbot integration, built with Vue.js (frontend) and Node.js/Express (backend). It integrates with Square for payments and catalog, and supports local data storage for system awareness and chatbot context.

## Features
- Customer, invoice, estimate, and scheduling management
- Square API integration (invoices, customers, catalog)
- System metadata and business rules for chatbot/system awareness
- Chatbot integration (toggle, endpoint, API key, chat history)
- System logs and diagnostics
- Modern, responsive UI with white backgrounds and sidebar navigation
- Local JSON DB for all business and system data
- UI for DB viewing, integrity testing, and export (coming soon)

## Data Storage
All business and system data is stored in the backend `/backend/data/` directory as JSON files:
- `customers.json` — Customer records and interactions
- `invoices.json` — Invoice records
- `estimates.json` — Estimate records
- `schedule.json` — Appointments and scheduling
- `system_metadata.json` — API endpoints, UI components, business rules, docs
- `chatbot_history.json` — Chatbot conversation history
- `system_logs.json` — System events and logs

## How to Run
1. Install dependencies:
   ```powershell
   cd backend
   npm install
   cd ../
   npm install
   ```
2. Start the backend:
   ```powershell
   cd backend
   node index.js
   ```
3. Start the frontend:
   ```powershell
   npm run dev
   ```

## Exporting Data
You can export any JSON file in `/backend/data/` for backup or migration. (A UI for export is planned.)

## Database Viewer & Integrity Tools
A UI for viewing, searching, and testing the integrity of all local DB files is planned. This will allow you to:
- Browse and search all records (customers, invoices, etc.)
- Test for missing/corrupt data
- Export data as JSON/CSV

## Security
- All sensitive data (API keys, tokens) should be stored in environment variables or the settings page.
- Do not expose `/backend/data/` files directly to the public web.

## Contributing
Pull requests and feature suggestions are welcome!

## License
MIT

