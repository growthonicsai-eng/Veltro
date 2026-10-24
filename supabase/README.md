# Veltro Talent Solutions — Supabase setup

This project uses Supabase for jobs, admin authentication, enquiries, candidate submissions and private CV storage.

## 1. Create the Supabase project

1. Go to https://supabase.com/dashboard and create a new project.
2. Choose a strong database password and keep it private.
3. Wait for the project to finish provisioning.
4. Open **Project Settings → API** and copy the Project URL and the browser-safe Publishable/anon key.

## 2. Create the database

1. Open **SQL Editor** in the Supabase dashboard.
2. Create a new query.
3. Paste the complete contents of `schema.sql`.
4. Run it.
5. Confirm that the tables `profiles`, `jobs`, `contact_enquiries`, `vacancy_requests` and `candidate_submissions` exist.
6. Confirm the private Storage bucket `candidate-cvs` exists.

Do **not** run the old demo seed. `seed.sql` is intentionally empty of sample jobs.

## 3. Create the first administrator

1. Open **Authentication → Users**.
2. Create a user with the email address and password you want to use for `/admin`.
3. Copy the user's UUID.
4. In SQL Editor run:

```sql
insert into public.profiles (id, is_admin)
values ('PASTE-USER-UUID-HERE', true)
on conflict (id) do update set is_admin = true;
```

5. Sign in at your deployed site's `/admin` URL.

The database RLS policies are the security boundary: public visitors can submit forms and read published jobs, while only users marked `is_admin = true` can manage jobs and read submissions.

## 4. Local environment

Copy `apps/web/.env.example` to `apps/web/.env.local` and set:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_BROWSER_SAFE_PUBLISHABLE_KEY
```

Never put a Supabase secret/service-role key in `.env.local` for the browser app.

## 5. Deploy email notifications

The `notify-submission` Edge Function sends notification emails through Resend.

Install/authenticate the Supabase CLI, then from the repository root:

```bash
supabase login
supabase projects list
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy notify-submission --use-api
```

Set the function secrets:

```bash
supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY
supabase secrets set NOTIFICATION_TO=YOUR_REAL_VELTRO_INBOX
supabase secrets set FROM_EMAIL="Veltro Website <notifications@YOUR_VERIFIED_DOMAIN>"
```

Use a sender address/domain that is verified in Resend. Never commit the Resend API key.

## 6. Test before launch

- Submit the Contact form and confirm a row appears in `contact_enquiries`.
- Submit Post a Vacancy and confirm a row appears in `vacancy_requests`.
- Submit a CV and confirm the row appears in `candidate_submissions` and the CV is stored in the private bucket.
- Open `/admin`, sign in, and confirm you can see all three submission types.
- Open a candidate and click **CV**. The dashboard should generate a short-lived signed URL.
- Add a real job as Draft, then edit it to Published. Confirm it appears on `/jobs`.
- Close the job and confirm it disappears from the public job board.

## 7. Production security checklist

- Enable your real business email/domain in Resend.
- Add CAPTCHA/rate limiting to public forms before significant traffic.
- Review UK GDPR/privacy wording with your legal/privacy adviser.
- Keep CVs private; do not make the Storage bucket public.
- Use a separate admin account for each staff member rather than sharing a password.
- Never expose a service-role/secret key in Vercel client environment variables.
