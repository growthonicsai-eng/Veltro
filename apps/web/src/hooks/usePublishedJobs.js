import { useEffect, useState } from 'react';
import { JOBS } from '@/data/site';
import { getPublishedJobs } from '@/lib/api';

export function usePublishedJobs() {
  const [jobs, setJobs] = useState(JOBS);
  useEffect(() => {
    let alive = true;
    getPublishedJobs().then(data => { if (alive && data) setJobs(data); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return jobs;
}
