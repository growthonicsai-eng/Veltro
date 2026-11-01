import { useEffect, useState } from 'react';
import { JOBS } from '@/data/site';
import { getPublishedJobs } from '@/lib/api';
import { supabaseConfigured } from '@/lib/supabase';

// Returns the job list plus a loading flag so pages can show "Loading…"
// instead of "0 jobs" while the database request is in flight.
export function usePublishedJobsState() {
  const [jobs, setJobs] = useState(JOBS);
  const [loading, setLoading] = useState(supabaseConfigured);
  useEffect(() => {
    let alive = true;
    if (!supabaseConfigured) { setLoading(false); return () => { alive = false; }; }
    getPublishedJobs()
      .then((data) => { if (alive && data) setJobs(data); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  return { jobs, loading };
}

export function usePublishedJobs() {
  return usePublishedJobsState().jobs;
}
