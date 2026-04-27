

## Goal

Produce a comprehensive **Technical Handover Document** that allows your in-house team to replicate, replace, and extend the current Lovable + Supabase MVP with a custom backend — while keeping the existing UI intact.

## Deliverables

I will generate three downloadable artifacts in `/mnt/documents/`:

1. **`PitchIn_Technical_Handover.md`** — The main handover document (~10–15 pages), covering all 10 sections you requested.
2. **`PitchIn_Architecture_Diagram.mmd`** — A Mermaid diagram of the system architecture (frontend → Supabase → Edge Functions → Resend).
3. **`PitchIn_Data_Flow_Diagram.mmd`** — A Mermaid diagram of the auth + data flow (login → onboarding → feed → notifications).

## Document Structure

The handover doc will mirror your 10 sections exactly:

1. **Frontend Architecture** — React 18 + Vite + TS + Tailwind + shadcn/ui, React Router v6, TanStack Query for server state, React Context for auth. Folder map of `src/` (pages, components, hooks, integrations, lib).
2. **Feature Mapping** — Table of every feature (Auth, Onboarding, Feed/Posts, Profiles by role, Follows, Reactions, Saves, Contact Interest, Notifications, Sharing, Admin, Suggested Profiles) → file locations → DB tables touched.
3. **Database & Storage** — All 16 tables with columns, RLS policies, all 18 DB functions, all 8 storage buckets (`avatars`, `pitch-images`, `pitch-attachments`, `profile-banners`, `intro-videos`, `intro-thumbnails`, `team-avatars`, `startup-logos`) with purpose and access rules.
4. **API & Data Flow** — How `supabase-js` is used (direct table queries via RLS, RPC calls like `get_full_shared_profile`, `get_user_id_by_email`), the 4 edge functions (`send-interest`, `send-follow-request`, `send-partner-interest`, `create-notification`), OAuth flow, and absence of realtime subscriptions.
5. **Business Logic on Frontend** — Validation (Zod in `src/lib/validation.ts`), role gating (`useUserRole`, `is_pitchin_admin`), feed injection logic (suggested profiles), contact gating, mobile detection.
6. **Dependencies** — Full list from `package.json` grouped by purpose (UI, forms, data, animation, dates), plus Supabase JS SDK, Resend (in edge functions).
7. **Environment & Deployment** — `.env` vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`), edge function secrets (`RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), Vite build config, Lovable hosting.
8. **Limitations & Workarounds** — No FK constraints (logical relations only), admin check via hardcoded email, in-app interest gating before contact reveal, LinkedIn OAuth disabled, no realtime, email = identity anchor for migration.
9. **Migration Guidance** — Recommended target stack options (Node/Express + Postgres, NestJS, Django, etc.), endpoint-by-endpoint API spec mapped from current Supabase calls, JWT auth replacement strategy, RLS → middleware translation, storage migration (S3/R2), the `email` column already added as the migration anchor, frontend decoupling via a thin API client layer (`src/integrations/api/client.ts`) replacing `supabase` imports.
10. **Code Export** — How to export from Lovable (GitHub sync via the GitHub button → clone repo), Supabase database export (Cloud → Database → Tables → Export), storage bucket download via Supabase CLI, considerations (auto-generated files: `client.ts`, `types.ts`, `.env`).

## Diagrams

- **Architecture**: Browser → React SPA → Supabase (Auth, Postgres+RLS, Storage, Edge Functions) → Resend
- **Data flow**: OAuth login → `handle_new_user` trigger → profile creation → onboarding → role selection → feed/profile interactions → notifications

## Approach

After approval, I'll switch to default mode and run a script that writes all three files to `/mnt/documents/`, then emit `<lov-artifact>` tags so you can download them directly.

