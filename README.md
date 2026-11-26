# ParkEase

Production-quality parking discovery and reservation web application built with React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui primitives, Framer Motion, React Router, Leaflet, and Supabase (Postgres + Auth + Row Level Security).

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

The app runs out of the box with all 10 Mumbai locations, 240 parking bays, 30 driver reviews, full 6-digit email OTP verification, MFA enrollment/challenge, transactional slot reservations, and cancellation flows.

## Connecting Supabase (Postgres + Auth + RLS)

1. Copy `.env.example` to `.env` and fill in your Supabase project credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Run [001_schema_and_rls.sql](supabase/migrations/001_schema_and_rls.sql) in the Supabase SQL Editor to create the tables, enums, Row Level Security policies, and transactional `create_booking` / `cancel_booking` RPCs.
3. Run [seed.sql](supabase/seed.sql) in the Supabase SQL Editor to seed the 10 Mumbai locations, 240 bays, and 30 reviews.
