# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build (runs type-check + lint)
npm run lint     # ESLint only
```

There is no test suite. Verification is manual via the dev server or Vercel preview deployments.

## Architecture

Next.js 14 App Router, TypeScript, deployed on Vercel (project: `personal-trainer-matcher-rcdx`). Supabase (EU region `eu-west-2`) for the database. All API routes use the service-role Supabase client (bypasses RLS).

### The single UI component

`components/PTMatcher.tsx` (~730 lines) is the entire frontend. It renders both the **member-facing form/results** and the **admin triage dashboard** in one component, controlled by a `mode` prop (`"member"` | `"admin"`). Pages just mount it:

- `app/page.tsx` → `<PTMatcher mode="member" />`
- `app/admin/page.tsx` → `<PTMatcher mode="admin" />` (session-gated)

CSS is a template-literal string injected via `dangerouslySetInnerHTML` inside the component. All styling lives there.

### AI matching flow

1. Member submits form → `POST /api/submit`
2. Route fetches the system prompt and PT profiles from external URLs (env vars `MATCHING_PROMPT_URL`, `PT_PROFILES_URL`) — these are not local files at runtime; they are hosted externally and cached in-memory for 5 minutes (`lib/claude.ts`)
3. Calls Claude (`claude-haiku-4-5-20251001`) via Anthropic SDK
4. Claude returns JSON with 3 matches, each having:
   - `reasoning` — third-person, used in the ops notification email
   - `client_reasoning` — second-person ("You mentioned…"), shown to the member on the results page
   - `caveat` — optional flag for the ops team
5. Matches enriched with full PT data from `pt_roster`, inserted into `leads` and `match_log`, ops email sent, response returned to client

The matching prompt (`matching-prompt.md`) and PT profiles (`pt-profiles.md`) in the repo are the **source of truth for content** but must be re-published to their hosted URLs to take effect in production.

### API routes

| Route | Auth | Purpose |
|---|---|---|
| `POST /api/submit` | none | Member form submission — runs AI match, saves lead, sends ops email |
| `GET /api/leads` | session | Admin: fetch all leads |
| `POST /api/assign` | session | Admin: assign a PT to a lead |
| `POST /api/brief` | session | Admin: email a brief to the assigned PT |

### Email

Two email functions in `lib/email.ts`, both using Nodemailer via Google Workspace SMTP:
- `sendLeadNotificationEmail` — sent automatically on every form submission; includes third-person `reasoning` per match
- `sendPtBriefEmail` — triggered manually by admin via `/api/brief`

PT email addresses are hardcoded in `lib/pt-emails.ts`, keyed by `pt_roster.id`. **When adding a new PT to the database, their email must also be added here.**

### Auth

NextAuth with Google OAuth (`lib/auth.ts`). The `signIn` callback restricts access to `@oneldn.com` email addresses only. The admin page redirects to `/api/auth/signin` if no session exists.

**Each deployment domain needs its own `Authorized redirect URI` in Google Cloud Console** (`https://<domain>/api/auth/callback/google`), and `NEXTAUTH_URL` must match the deployment's own domain.

## Required environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
MATCHING_PROMPT_URL        # URL to matching-prompt.md (externally hosted)
PT_PROFILES_URL            # URL to pt-profiles.md (externally hosted)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL               # must match the deployment's own domain
SMTP_USER                  # @oneldn.com Google Workspace mailbox
SMTP_PASS                  # Google App Password (16 chars, requires 2FA)
NOTIFY_EMAIL               # ops notification recipient
```

## Key data relationships

- `pt_roster` — active PT list; `active=false` rows are excluded from matching
- `leads` — one row per form submission; `assigned_pt_id` set to the top AI match on submit
- `match_log` — full AI response stored per submission for audit
- `lead_assignments` — audit trail of every manual PT assignment from the admin panel
- Gender-preference filtering happens **before** the AI call — non-matching PTs are removed from the candidate pool entirely so Claude cannot recommend them

## Updating PT profiles or matching logic

Edit `matching-prompt.md` (prompt instructions) or `pt-profiles.md` (PT bios/exclusions), then re-publish both files to the URLs referenced by `MATCHING_PROMPT_URL` and `PT_PROFILES_URL`. The in-memory cache expires after 5 minutes, so production picks up changes automatically after that.
