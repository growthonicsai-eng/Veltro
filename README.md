# Veltro Talent Solutions

React/Vite recruitment website with a Supabase-backed job board, admin dashboard, contact/vacancy/candidate forms and private CV storage.

## What's included

- Public recruitment website
- Supabase/Postgres live job board
- `/admin` administrator dashboard
- Add/edit/publish/draft/close/delete jobs
- Search and filter jobs in the admin area
- Contact enquiry tracking
- Employer vacancy request tracking
- Candidate/CV submission tracking
- Candidate pipeline status updates
- Short-lived signed CV links for administrators
- Private CV storage
- Resend notification Edge Function
- Vercel SPA configuration

## Local development

From the repository root:

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

Then open http://localhost:3000.

Set the two VITE_SUPABASE variables in `.env.local` to connect the frontend to your Supabase project.

## Real Veltro data

The demo companies, fake job vacancies, fake testimonials, fake client logos, fake team members, fake contact details and unverified performance statistics have been removed. The only business identity retained in the code is the supplied Veltro Talent Solutions brand.

Before launch, fill the verified contact/social details in `apps/web/src/data/site.js` under `COMPANY` and add your real vacancies through `/admin`.

## Supabase

Follow `supabase/README.md` exactly. Run `supabase/schema.sql`; do not use demo data.

## Vercel

Recommended project settings:

- Framework preset: Vite
- Root Directory: repository root
- Build Command: `npm run build`
- Output Directory: `dist/apps/web`
- Install Command: `npm install`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

After deployment, add your custom domain in Vercel and complete the DNS verification shown by Vercel.

## Admin

Open `/admin`. Create an Auth user in Supabase and mark the user's UUID as an admin:

```sql
insert into public.profiles (id, is_admin)
values ('YOUR-USER-UUID', true)
on conflict (id) do update set is_admin = true;
```

## Future job editing

You no longer need to edit JavaScript to add vacancies. Sign in to `/admin` → **Jobs** → **Add job**. Save as Draft while preparing the vacancy, then switch to Published when ready.

## Production notes

- Do not commit `.env.local`.
- Do not expose Supabase secret/service-role keys in the browser.
- Verify your real business contact details before launch.
- Verify all legal/GDPR wording with the business before publishing.
