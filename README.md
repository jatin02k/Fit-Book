# FitBook: Single-Vendor Appointment Booking MVP

**Project Status:** Technical Blueprint Complete, Core Backend Logic in Development (Phase A3)

## Overview

*FitBook* is a single-vendor scheduling application that replaces manual booking for service businesses. Its core function is the **Crux Logic**, which instantly calculates and presents bookable time slots by dynamically filtering business hours, service duration, and real-time appointments. The focus is on minimizing administrative overhead and reducing no-shows.

### Core Technology Stack

* **Frontend:** Next.js (App Router) + Tailwind CSS
* **Backend:** Next.js Route Handlers (Node.js)
* **Database:** Supabase (PostgreSQL)

### Getting Started

1. **Dependencies:** Ensure Node.js is installed.
   ```bash
   npm install
   ```
   
2. **Database Setup:**

  Create a Supabase project, run the schema SQL, and seed the required data in the services and business_hours tables (Phase A2).
  
  Install the Supabase CLI (supabase login, supabase link YOUR_PROJECT_REF_ID).
  
  Generate local TypeScript types:

  ```Bash
  supabase gen types typescript --linked > src/types/supabase.ts
  ```

3. **Environment Variables:** Create a .env.local file in the root of the project with your keys:

```
  NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL_HERE
  NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
  SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_SERVICE_ROLE_KEY
  Note on SUPABASE_SERVICE_ROLE_KEY: This key is highly sensitive as it grants full admin access to the database (bypassing RLS). Use it ONLY in server environments (Route Handlers).
```

4. **Run Development Server:**

Bash

npm run dev
Access the application at http://localhost:3000. Test the Crux API manually via your browser:
http://localhost:3000/api/public/availability?serviceId=[ID]&date=[YYYY-MM-DD]

### Coding Flow Checkpoint
We are currently completing Phase A3: Crux Logic API (/api/public/availability). This is the core algorithm that calculates available time slots.

### Next Step:
Proceed to Phase A4: Booking API by implementing the /api/public/bookings/route.ts handler (C-4, C-5 Logic).
