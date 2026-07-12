# TransitOps

Smart Transport Operations Platform — built for Odoo Hackathon 2026.

## Overview
TransitOps digitizes vehicle, driver, dispatch, maintenance, and expense management for logistics fleets, replacing manual spreadsheets with a centralized platform that enforces business rules and provides real-time operational visibility.

## Team
- Surya Kesharwani — Team Lead, Backend (Odoo integration)
- Jay1719-git — UI/UX
- Chaitanya Pal — Frontend
- shiiikha08 — API layer

## Features
- Role-based authentication (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst)
- Real-time dashboard with fleet KPIs
- Vehicle registry with unique registration enforcement
- Driver management with license expiry and safety score tracking
- Trip dispatcher with automatic cargo capacity validation
- Automatic status transitions (vehicle/driver availability on dispatch/completion)
- Fuel and expense tracking with auto-calculated operational cost
- Reports & analytics with CSV export
- Settings with RBAC permissions matrix

## Tech Stack
- Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Framer Motion, Recharts, Lucide React
- Backend: Odoo (JSON-RPC API integration)

## Business Rules Enforced
- Cargo weight cannot exceed vehicle max capacity
- Expired-license or suspended drivers blocked from trip assignment
- Retired/In Shop vehicles hidden from dispatch
- Dispatch/complete/cancel automatically updates vehicle and driver status

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# add your Odoo API credentials to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

## Demo Login Credentials

Use any of the following to sign in and explore role-based access:

| Role | Email | Password |
|---|---|---|
| Fleet Manager | manager@transitops.com | demo123 |
| Dispatcher | dispatcher@transitops.com | demo123 |
| Safety Officer | safety@transitops.com | demo123 |
| Financial Analyst | finance@transitops.com | demo123 |
