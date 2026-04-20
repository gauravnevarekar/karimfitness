# Smart Gym Training & Control (PWA)

Mobile-first React + Supabase web app for gym owners and members.

## Features Implemented
- Phone + password authentication with Owner and Member role routing.
- Session auto-login through Supabase session.
- First-time password change flag (`force_password_change`).
- Owner dashboard with daily workout/diet compliance and latest weight.
- Member screen with:
  - **Workout access locked by Gym WiFi/network check**.
  - Daily diet checklist available globally.
- Schema with RLS and audit table for owner password resets.
- Cloudinary/YouTube-ready workout media fields.

## Important WiFi Lock Note
A browser PWA cannot read WiFi SSID directly for privacy reasons. This implementation enforces the lock by checking public network IP/CIDR on a server endpoint (`/api/network-check`) and only then showing workouts.

## Run
```bash
npm install
npm run dev
```

## Configure
1. Copy `.env.example` -> `.env`.
2. Fill Supabase URL/key and gym CIDRs.
3. Apply `supabase-schema.sql` in Supabase SQL editor.
4. Implement `/api/network-check` in your hosting platform using `api-network-check-example.js` logic.

## Next Suggested Steps
- Build Owner member CRUD pages/forms.
- Add workout template library table (beginner/intermediate/advanced).
- Add real checkbox update handlers and diet daily reset cron.
- Add push notifications and offline caching via service worker.
