# ONE LDN PT Matcher

## Project overview
ONE LDN PT Matcher is a full-stack Next.js app for member-to-coach matching. It includes:
- a public member questionnaire at `/`
- an authenticated admin triage dashboard at `/admin`
- Supabase-backed leads, roster, and assignment storage

The app preserves the prototype UI/flow and uses the same matching logic for top-3 PT recommendations.

## Local setup
1. Install dependencies:
   - `npm install`
2. Add environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL=`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
   - `SUPABASE_SERVICE_ROLE_KEY=`
   - `RESEND_API_KEY=`
   - `RESEND_NOTIFY_EMAIL=`
   - `GOOGLE_CLIENT_ID=`
   - `GOOGLE_CLIENT_SECRET=`
   - `NEXTAUTH_SECRET=`
   - `NEXTAUTH_URL=`
3. Run locally:
   - `npm run dev`

## Database setup
Use a Supabase project in EU region (`eu-west-2`).

Run SQL scripts in this exact order in Supabase SQL Editor:
1. `schema.sql`
2. `seed.sql`
3. `pt_availability_seed.sql`

## Auth setup
1. Create Google OAuth credentials in Google Cloud Console.
2. Add allowed callback URL:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - your production callback URL after deploy
3. Ensure admin users sign in with `@oneldn.com` Google accounts.
4. Set:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

## Deployment
1. Push to GitHub.
2. Import repo into Vercel.
3. Set all required environment variables in Vercel project settings.
4. Deploy.

## Adding a new PT
Add a row to `pt_roster` via Supabase dashboard or SQL, then update `seed.sql` so seed data stays in sync with live roster.

## Updating PT availability
Insert/update rows in `pt_availability` directly in Supabase.  
`day_of_week` values: `0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat`.

## Updating PT capacity
Update the `capacity` column in `pt_roster` directly in Supabase.

## Troubleshooting
- Font not loading: ensure files are in `public/fonts/` named exactly `horizon.otf` and `horizon_outlined.otf`.
- Leads not appearing: confirm Supabase RLS policies and environment keys are correct.
- Email not sending: verify `RESEND_API_KEY` and `RESEND_NOTIFY_EMAIL`.
- Admin login failing: verify Google OAuth credentials and account email ends with `@oneldn.com`.
