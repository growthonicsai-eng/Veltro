import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Banknote, Building2, Bookmark } from 'lucide-react';
import { sectorName } from '@/data/site';

const typeStyle = {
  Permanent: 'bg-accent/10 text-accent',
  Contract: 'bg-amber-100 text-amber-700',
  Temporary: 'bg-sky-100 text-sky-700',
};

export default function JobCard({ job }) {
  return (
    <div className="group relative bg-card rounded-xl border border-border p-5 hover:border-accent hover:shadow-lg hover:shadow-primary/5 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid place-items-center h-11 w-11 shrink-0 rounded-lg bg-secondary text-primary font-display font-bold">
            {job.company.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" /> {job.company}</p>
            <h3 className="font-display font-semibold text-primary leading-tight truncate">
              <Link to={`/jobs/${job.id}`} className="after:absolute after:inset-0 group-hover:text-accent transition-colors">{job.title}</Link>
            </h3>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${typeStyle[job.type]}`}>{job.type}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
        <span className="flex items-center gap-1"><Banknote className="h-4 w-4" /> {job.salary}</span>
        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.posted}</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{sectorName(job.sector)}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{job.work}</span>
        </div>
        <Bookmark className="h-4 w-4 text-muted-foreground/60 relative z-10" />
      </div>
    </div>
  );
}
