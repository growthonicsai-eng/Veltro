import { supabase, supabaseConfigured } from './supabase';

export async function getPublishedJobs() {
  if (!supabaseConfigured) return null;
  const { data, error } = await supabase.from('jobs').select('*').eq('status', 'published').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(normalizeJob);
}

export async function getJobById(id) {
  if (!supabaseConfigured) return null;
  const { data, error } = await supabase.from('jobs').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? normalizeJob(data) : null;
}

export async function getAdminJobs() {
  const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(normalizeJob);
}


export async function getAdminSubmissions() {
  const [contacts, vacancies, candidates] = await Promise.all([
    supabase.from('contact_enquiries').select('*').order('created_at', { ascending: false }).limit(20),
    supabase.from('vacancy_requests').select('*').order('created_at', { ascending: false }).limit(20),
    supabase.from('candidate_submissions').select('*').order('created_at', { ascending: false }).limit(20),
  ]);
  if (contacts.error) throw contacts.error;
  if (vacancies.error) throw vacancies.error;
  if (candidates.error) throw candidates.error;
  return { contacts: contacts.data, vacancies: vacancies.data, candidates: candidates.data };
}

export async function saveJob(job) {
  const payload = {
    ...(job.id ? { id: job.id } : {}),
    ref: job.ref || `VT-${Date.now().toString().slice(-6)}`,
    title: job.title,
    company: job.company,
    sector: job.sector,
    location: job.location,
    region: job.region || job.location,
    type: job.type,
    work: job.work,
    salary: job.salary,
    salary_min: Number(job.salaryMin) || 0,
    level: job.level || 'Mid',
    hours: job.hours || 'Full-time',
    deadline: job.deadline || null,
    duration: job.duration || null,
    ir35: job.ir35 || null,
    recruiter: job.recruiter || null,
    featured: Boolean(job.featured),
    description: job.description || '',
    responsibilities: job.responsibilities || [],
    skills: job.skills || [],
    qualifications: job.qualifications || [],
    benefits: job.benefits || [],
    status: job.status || 'published',
  };
  const { data, error } = await supabase.from('jobs').upsert(payload).select().single();
  if (error) throw error;
  return normalizeJob(data);
}

export async function deleteJob(id) {
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) throw error;
}

export async function submitContact(payload) {
  const { error } = await supabase
    .from('contact_enquiries')
    .insert(payload);

  if (error) throw error;

  await notify('contact', payload);
  return payload;
}

export async function submitVacancy(payload) {
  // Note: no .select() here. Public visitors only have INSERT rights on
  // vacancy_requests (see schema.sql) — chaining .select() after insert
  // asks PostgREST to read the row back, which requires a SELECT policy
  // and fails RLS ("new row violates row-level-security policy") even
  // though the insert itself succeeded. We already have the payload
  // locally, so just use that instead of reading it back.
  const { error } = await supabase.from('vacancy_requests').insert(payload);
  if (error) throw error;
  await notify('vacancy', payload);
  return payload;
}

export async function submitCandidate(payload, file) {
  let cv_path = null;
  if (file) {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    cv_path = `public/${crypto.randomUUID()}-${safe}`;
    const { error: uploadError } = await supabase.storage.from('candidate-cvs').upload(cv_path, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });
    if (uploadError) throw uploadError;
  }
  // Same reasoning as submitVacancy: public visitors only have INSERT
  // rights on candidate_submissions, so we can't .select() the row back
  // without violating RLS. Use the local payload instead.
  const submission = { ...payload, cv_path };
  const { error } = await supabase.from('candidate_submissions').insert(submission);
  if (error) throw error;
  await notify('candidate', submission);
  return submission;
}

async function notify(type, payload) {
  if (!supabase) return;
  const { error } = await supabase.functions.invoke('notify-submission', { body: { type, payload } });
  // Email is optional during initial setup; the database submission remains successful.
  if (error) console.warn('Email notification is not configured:', error.message);
}

function normalizeJob(row) {
  return {
    ...row,
    id: row.id,
    salaryMin: row.salary_min,
    posted: row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB') : 'Recently',
    postedDays: row.created_at ? Math.max(0, Math.floor((Date.now() - new Date(row.created_at)) / 86400000)) : 0,
    remote: row.work === 'Remote',
    salary_min: undefined,
  };
}


export async function updateSubmissionStatus(type, id, status) {
  const table = { contacts: 'contact_enquiries', vacancies: 'vacancy_requests', candidates: 'candidate_submissions' }[type];
  if (!table) throw new Error('Unknown submission type');
  const { data, error } = await supabase.from(table).update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function getCandidateCvUrl(path) {
  if (!path) throw new Error('No CV is attached to this submission.');
  const { data, error } = await supabase.storage.from('candidate-cvs').createSignedUrl(path, 600);
  if (error) throw error;
  return data.signedUrl;
}
