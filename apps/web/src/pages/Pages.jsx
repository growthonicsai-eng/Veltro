import React, { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Search, MapPin, ArrowRight, ArrowLeft, Banknote, Clock, Building2, CheckCircle2, Briefcase, Share2, Printer, Bookmark, Mail, Phone, Send, Target, Eye, Handshake, ShieldCheck, Users, Compass } from 'lucide-react';
import Layout from '@/components/Layout';
import JobCard from '@/components/JobCard';
import { SECTORS, sectorName, jobTypes, workModes, PIPELINE, TEAM, ARTICLES, COMPANY, PROCESS } from '@/data/site';
import { usePublishedJobs, usePublishedJobsState } from '@/hooks/usePublishedJobs';
import { submitContact, submitVacancy, submitCandidate } from '@/lib/api';
import { supabaseConfigured } from '@/lib/supabase';

function PageHero({ eyebrow, title, sub }) {
  return (
    <section className="bg-primary text-white">
      <div className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16 lg:py-20">
        <p className="text-accent font-semibold text-sm uppercase tracking-wider">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl lg:text-5xl font-extrabold max-w-3xl leading-tight">{title}</h1>
        {sub && <p className="mt-4 text-lg text-white/75 max-w-2xl">{sub}</p>}
      </div>
    </section>
  );
}

/* ---------------- Job board ---------------- */
export function JobSearchPage() {
  const { jobs: liveJobs, loading } = usePublishedJobsState();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [loc, setLoc] = useState(params.get('loc') || '');
  const type = params.get('type') || '';
  const sector = params.get('sector') || '';
  const work = params.get('work') || '';
  const sort = params.get('sort') || 'newest';

  const set = (k, v) => { const p = new URLSearchParams(params); v ? p.set(k, v) : p.delete(k); setParams(p); };

  const results = useMemo(() => {
    let r = liveJobs.filter((j) => {
      const kw = (q + ' ' + loc).toLowerCase();
      const hitQ = !q || (j.title + j.company + j.skills.join(' ')).toLowerCase().includes(q.toLowerCase());
      const hitLoc = !loc || j.location.toLowerCase().includes(loc.toLowerCase()) || j.region.toLowerCase().includes(loc.toLowerCase());
      return hitQ && hitLoc && (!type || j.type === type) && (!sector || j.sector === sector) && (!work || j.work === work);
    });
    if (sort === 'salary') r = [...r].sort((a, b) => b.salaryMin - a.salaryMin);
    if (sort === 'newest') r = [...r].sort((a, b) => a.postedDays - b.postedDays);
    return r;
  }, [liveJobs, q, loc, type, sector, work, sort]);

  return (
    <Layout>
      <PageHero eyebrow="Job board" title="Find your next role" sub={loading ? 'Loading the latest vacancies…' : `${liveJobs.length} live vacancies across permanent, contract and temporary assignments.`} />
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <label className="flex items-center gap-2 px-3 rounded-lg bg-secondary/60">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Keyword or skill" className="w-full bg-transparent py-2.5 text-sm outline-none" />
              </label>
              <label className="flex items-center gap-2 px-3 rounded-lg bg-secondary/60">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Location or region" className="w-full bg-transparent py-2.5 text-sm outline-none" />
              </label>
            </div>
            <FilterGroup label="Job type" options={jobTypes} value={type} onChange={(v) => set('type', v)} />
            <FilterGroup label="Working pattern" options={workModes} value={work} onChange={(v) => set('work', v)} />
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="font-display font-semibold text-primary text-sm mb-3">Sector</p>
              <select value={sector} onChange={(e) => set('sector', e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-secondary/60 text-sm outline-none">
                <option value="">All sectors</option>
                {SECTORS.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </div>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
              <p className="font-display font-semibold text-primary text-sm">Never miss a role</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">Create a job alert for this search.</p>
              <button className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold"><Mail className="h-4 w-4" /> Create job alert</button>
            </div>
          </aside>
          {/* Results */}
          <div>
            <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
              <p className="text-sm text-muted-foreground">{loading ? 'Loading jobs…' : <><span className="font-semibold text-primary">{results.length}</span> jobs found</>}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sort by</span>
                <select value={sort} onChange={(e) => set('sort', e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-card outline-none">
                  <option value="newest">Newest</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
            </div>
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-4" aria-busy="true">
                {[0, 1, 2, 3].map((i) => <div key={i} className="h-44 rounded-xl border border-border bg-secondary/60 animate-pulse" />)}
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/40" />
                <p className="mt-3 font-display font-semibold text-primary">No jobs match your filters</p>
                <p className="text-sm text-muted-foreground">Try broadening your search or clearing a filter.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {results.map((j) => <JobCard key={j.id} job={j} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-display font-semibold text-primary text-sm mb-3">{label}</p>
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2.5 text-sm cursor-pointer text-primary/80">
            <input type="radio" name={label} checked={value === o} onChange={() => onChange(value === o ? '' : o)} className="accent-[hsl(var(--accent))]" />
            {o}
          </label>
        ))}
        {value && <button onClick={() => onChange('')} className="text-xs text-accent font-semibold">Clear</button>}
      </div>
    </div>
  );
}

/* ---------------- Job details ---------------- */
export function JobDetailPage() {
  const { jobs: liveJobs, loading } = usePublishedJobsState();
  const { id } = useParams();
  const job = liveJobs.find((j) => String(j.id) === id);
  if (!job && loading) return <Layout><div className="mx-auto max-w-3xl px-5 py-24 text-center text-muted-foreground">Loading job…</div></Layout>;
  if (!job) return <Layout><div className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-2xl font-bold text-primary">Job not found</h1><Link to="/jobs" className="text-accent font-semibold mt-3 inline-block">Back to job board</Link></div></Layout>;
  const similar = liveJobs.filter((j) => j.sector === job.sector && j.id !== job.id).slice(0, 3);
  return (
    <Layout>
      <div className="bg-primary text-white">
        <div className="mx-auto max-w-[90rem] px-5 lg:px-8 py-12">
          <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-accent"><ArrowLeft className="h-4 w-4" /> All jobs</Link>
          <div className="mt-4 flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-sm text-white/70"><Building2 className="h-4 w-4" /> {job.company} · Ref {job.ref}</div>
              <h1 className="mt-2 font-display text-3xl lg:text-4xl font-extrabold">{job.title}</h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-accent" /> {job.location} · {job.work}</span>
                <span className="flex items-center gap-1.5"><Banknote className="h-4 w-4 text-accent" /> {job.salary}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> {job.type}{job.duration ? ` · ${job.duration}` : ''}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="grid place-items-center h-10 w-10 rounded-lg bg-white/10 hover:bg-white/20"><Bookmark className="h-4 w-4" /></button>
              <button onClick={() => navigator.share?.({ title: job.title })} className="grid place-items-center h-10 w-10 rounded-lg bg-white/10 hover:bg-white/20"><Share2 className="h-4 w-4" /></button>
              <button onClick={() => window.print()} className="grid place-items-center h-10 w-10 rounded-lg bg-white/10 hover:bg-white/20"><Printer className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-12 grid lg:grid-cols-[1fr_320px] gap-10">
        <article className="space-y-8">
          <Block title="Role overview"><p className="text-muted-foreground leading-relaxed">{job.description}</p></Block>
          <Block title="Key responsibilities"><Bullets items={job.responsibilities} /></Block>
          <Block title="Skills & experience"><div className="flex flex-wrap gap-2">{job.skills.map((s) => <span key={s} className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">{s}</span>)}</div></Block>
          <Block title="Qualifications"><Bullets items={job.qualifications} /></Block>
          <Block title="Benefits"><Bullets items={job.benefits} /></Block>
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <h3 className="font-display font-semibold text-primary">How to apply</h3>
            <p className="text-sm text-muted-foreground mt-1">Apply online below or contact {job.recruiter} directly. Applications close {job.deadline}.</p>
            <Link to="/submit-cv" className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-accent-foreground font-semibold"><Send className="h-4 w-4" /> Apply now</Link>
          </div>
        </article>
        <aside className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-6 sticky top-20">
            <dl className="space-y-3 text-sm">
              {[['Reference', job.ref], ['Sector', sectorName(job.sector)], ['Type', job.type], ['Working pattern', job.work], ['Hours', job.hours], ['Salary / rate', job.salary], job.duration && ['Duration', job.duration], job.ir35 && ['IR35', job.ir35], ['Deadline', job.deadline], ['Consultant', job.recruiter]].filter(Boolean).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border pb-2 last:border-0"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium text-primary text-right">{v}</dd></div>
              ))}
            </dl>
            {COMPANY.phone && <a href={`tel:${COMPANY.phone.replace(/\s+/g, '')}`} className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-primary hover:bg-secondary"><Phone className="h-4 w-4" /> Call the consultant</a>}
          </div>
        </aside>
      </section>
      {similar.length > 0 && (
        <section className="mx-auto max-w-[90rem] px-5 lg:px-8 pb-8">
          <h2 className="font-display text-2xl font-bold text-primary mb-6">Similar jobs</h2>
          <div className="grid md:grid-cols-3 gap-4">{similar.map((j) => <JobCard key={j.id} job={j} />)}</div>
        </section>
      )}
    </Layout>
  );
}

const Block = ({ title, children }) => <div><h2 className="font-display text-xl font-bold text-primary mb-3">{title}</h2>{children}</div>;
const Bullets = ({ items }) => <ul className="space-y-2">{items.map((i) => <li key={i} className="flex gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {i}</li>)}</ul>;

/* ---------------- Employers ---------------- */
export function EmployersPage() {
  return (
    <Layout>
      <PageHero eyebrow="For employers" title="Build teams that deliver" sub="Permanent, contract and temporary recruitment with a dedicated consultant, transparent pricing and a real placement guarantee." />
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16 grid lg:grid-cols-3 gap-6">
        {[
          { t: 'Permanent search', d: 'Rigorous, market-mapped search for the people who will shape your future.', p: ['Dedicated consultant', 'Guarantee period', 'Salary benchmarking'] },
          { t: 'Contract staffing', d: 'Compliant contractors mobilised fast, with IR35 and payroll handled.', p: ['IR35 assessment', 'Timesheet workflows', 'Right-to-work checks'] },
          { t: 'Temporary cover', d: 'Reliable temporary staff for peaks, projects and absence cover.', p: ['Weekly payroll', 'Fast turnaround', 'Vetted candidates'] },
        ].map((c) => (
          <div key={c.t} className="rounded-xl border border-border bg-card p-7">
            <h3 className="font-display text-xl font-bold text-primary">{c.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            <ul className="mt-4 space-y-2">{c.p.map((x) => <li key={x} className="flex gap-2 text-sm text-primary/80"><CheckCircle2 className="h-4 w-4 text-accent" /> {x}</li>)}</ul>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 pb-8">
        <div className="rounded-2xl bg-secondary/60 p-8 lg:p-12 text-center">
          <h2 className="font-display text-3xl font-bold text-primary">Ready to hire?</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">Post a vacancy or book a no-obligation consultation with a specialist consultant.</p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link to="/upload-vacancy" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">Post a vacancy</Link>
            <Link to="/contact" className="px-6 py-3 rounded-lg border border-border bg-card font-semibold text-primary">Book a consultation</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

/* ---------------- Candidates ---------------- */
export function CandidatesPage() {
  const feats = ['Personalised job recommendations', 'Save & track applications', 'Manage CVs and documents', 'Set job alerts by sector & location', 'Secure messaging with consultants', 'Availability & notice-period settings'];
  return (
    <Layout>
      <PageHero eyebrow="For candidates" title="Your career, supported end to end" sub="Register once and let specialist consultants match you to permanent and contract roles that fit your goals." />
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">Everything in one dashboard</h2>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3">
            {feats.map((f) => <li key={f} className="flex gap-2 text-sm text-primary/80"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {f}</li>)}
          </ul>
          <div className="mt-8 flex gap-3 flex-wrap">
            <Link to="/submit-cv" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">Register &amp; submit CV</Link>
            <Link to="/jobs" className="px-6 py-3 rounded-lg border border-border bg-card font-semibold text-primary">Browse jobs</Link>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="font-display font-semibold text-primary mb-4">Application pipeline</p>
          <div className="space-y-2">
            {PIPELINE.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className={`grid place-items-center h-7 w-7 rounded-full text-xs font-bold ${i < 3 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>{i + 1}</span>
                <span className={`text-sm ${i < 3 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

/* ---------------- Services ---------------- */
export function ServicesPage() {
  return (
    <Layout>
      <PageHero eyebrow="Our services" title="Recruitment, done properly" sub="A full-service agency covering permanent, contract and temporary staffing across eight specialist sectors." />
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTORS.map((s) => (
            <Link key={s.slug} to={`/jobs?sector=${s.slug}`} className="rounded-xl border border-border bg-card p-6 hover:border-accent transition-colors">
              <h3 className="font-display font-semibold text-primary">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
              <p className="mt-3 text-xs font-semibold text-accent">View sector vacancies →</p>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}

/* ---------------- About ---------------- */
export function AboutPage() {
  const values = [
    { icon: Handshake, t: 'Relationships first', d: 'We take time to understand people and businesses properly, so every introduction we make is considered rather than a numbers game.' },
    { icon: Eye, t: 'Transparency', d: 'Clear communication on roles, rates, timelines and feedback, with no surprises for clients or candidates.' },
    { icon: ShieldCheck, t: 'Integrity & compliance', d: 'We handle personal data responsibly and follow right-to-work, IR35 and employment-law requirements as standard.' },
    { icon: Users, t: 'Fairness for everyone', d: 'We champion fair, inclusive hiring and assess candidates on skills, experience and potential.' },
  ];
  const offers = [
    { t: 'For employers', d: 'A dedicated consultant, a focused shortlist and support from first brief to start date, across permanent, contract and temporary hiring.', to: '/employers', cta: 'Explore employer services' },
    { t: 'For candidates', d: 'Honest advice, access to roles across the UK and a consultant who keeps you informed at every stage of the process.', to: '/candidates', cta: 'Explore candidate support' },
  ];
  return (
    <Layout>
      <PageHero eyebrow="About us" title="People-first recruitment, across the UK" sub="We're a team of specialist consultants who believe great hiring is built on genuine relationships, deep sector knowledge and total transparency." />

      {/* Our story */}
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-accent font-semibold text-sm uppercase tracking-wider">Our story</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-primary">Recruitment built on trust, not transactions</h2>
          <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
            <p>{COMPANY.name} was founded on a simple belief: the right hire can change a business, and the right role can change a career. Too often recruitment feels impersonal, with CVs passed around and little real conversation.</p>
            <p>We set out to do it differently. We listen first, learn the detail behind every vacancy and every career goal, and only then make an introduction. The result is fewer, better matches and relationships that last well beyond a single placement.</p>
            <p>Today we support employers and candidates across the UK in permanent, contract and temporary roles, working with specialist knowledge across eight sectors.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-7">
            <span className="grid place-items-center h-11 w-11 rounded-lg bg-accent/10 text-accent"><Target className="h-5 w-5" /></span>
            <h3 className="mt-4 font-display text-lg font-bold text-primary">Our mission</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">To connect talented people with organisations where they can do their best work, through honest, expert and personal recruitment.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-7">
            <span className="grid place-items-center h-11 w-11 rounded-lg bg-accent/10 text-accent"><Compass className="h-5 w-5" /></span>
            <h3 className="mt-4 font-display text-lg font-bold text-primary">Our vision</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">To be the UK recruiter that clients and candidates recommend first, known for the quality of our service and the integrity of our advice.</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider">What we stand for</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-primary">Our values</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-xl border border-border bg-card p-6">
                <span className="grid place-items-center h-11 w-11 rounded-lg bg-primary text-primary-foreground"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-display font-semibold text-primary">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16">
        <p className="text-accent font-semibold text-sm uppercase tracking-wider">How we work</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-primary">A clear process from brief to start date</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl">Whether you're hiring or job hunting, you'll know what happens next and who to speak to.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESS.map((p) => (
            <div key={p.n} className="rounded-xl border border-border bg-card p-6">
              <span className="font-display text-3xl font-extrabold text-accent">{p.n}</span>
              <h3 className="mt-2 font-display font-semibold text-primary">{p.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider">Where we recruit</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Specialist knowledge across eight sectors</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {SECTORS.map((s) => (
              <Link key={s.slug} to={`/jobs?sector=${s.slug}`} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors">{s.name}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* How we help */}
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16 grid md:grid-cols-2 gap-6">
        {offers.map((o) => (
          <div key={o.t} className="rounded-2xl border border-border bg-card p-8">
            <h3 className="font-display text-xl font-bold text-primary">{o.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{o.d}</p>
            <Link to={o.to} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">{o.cta} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        ))}
      </section>

      {/* Meet the team */}
      <section id="meet-the-team" className="scroll-mt-24 mx-auto max-w-[90rem] px-5 lg:px-8 pb-16">
        <p className="text-accent font-semibold text-sm uppercase tracking-wider">Our people</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-primary">Meet the team</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">Behind every placement is a real person who listens, asks the right questions and stays in touch. Our consultants specialise in their sectors, so you speak to someone who understands your market, not a generalist.</p>

        {TEAM.length > 0 && (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((m) => (
              <div key={m.name} className="rounded-2xl border border-border bg-card overflow-hidden">
                {m.img ? (
                  <img src={m.img} alt={m.name} className="h-64 w-full object-cover object-top" />
                ) : (
                  <div className="h-64 w-full grid place-items-center bg-primary text-white font-display text-5xl font-extrabold">
                    {m.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display font-semibold text-primary">{m.name}</h3>
                  <p className="text-sm text-accent font-medium">{m.role}</p>
                  {m.bio && <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-border bg-card p-8 lg:p-10">
          <h3 className="font-display text-xl font-bold text-primary">What you can expect from your consultant</h3>
          <ul className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {[
              'A named point of contact from first call to start date',
              'Sector knowledge and honest market advice',
              'Clear, timely communication and feedback',
              'Roles and candidates matched on skills, goals and culture',
              'Confidential handling of your details and enquiries',
              'Ongoing support after the placement is made',
            ].map((x) => (
              <li key={x} className="flex gap-2 text-sm text-primary/80"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {x}</li>
            ))}
          </ul>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">Speak to a consultant <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 pb-16">
        <div className="rounded-2xl bg-secondary/60 p-8 lg:p-12 text-center">
          <h2 className="font-display text-3xl font-bold text-primary">Let's talk</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">Whether you're building a team or planning your next move, we'd love to hear from you.</p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link to="/contact" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">Contact us</Link>
            <Link to="/jobs" className="px-6 py-3 rounded-lg border border-border bg-card font-semibold text-primary">Browse jobs</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

/* ---------------- Forms: Submit CV, Upload Vacancy, Contact ---------------- */
function FormShell({ eyebrow, title, sub, fields, cta, note, onSubmit }) {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState({});
  const setValue = (name, value) => setValues(v => ({ ...v, [name]: value }));

  async function handleSubmit(e) {
    e.preventDefault(); setError('');
    if (!supabaseConfigured) {
      setError('The form backend is not configured yet. Add your Supabase environment variables and run the setup SQL.');
      return;
    }
    setBusy(true);
    try { await onSubmit(values); setDone(true); }
    catch (err) { setError(err.message || 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  }

  return (
    <Layout>
      <PageHero eyebrow={eyebrow} title={title} sub={sub} />
      <section className="mx-auto max-w-3xl px-5 lg:px-8 py-16">
        {done ? (
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-accent mx-auto" />
            <h2 className="mt-4 font-display text-2xl font-bold text-primary">Thank you — we've received it</h2>
            <p className="mt-2 text-muted-foreground">{note}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8 grid sm:grid-cols-2 gap-5">
            {fields.map((f) => (
              <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-medium text-primary mb-1.5">{f.label}{f.req && <span className="text-destructive"> *</span>}</label>
                {f.type === 'textarea' ? (
                  <textarea name={f.name} value={values[f.name] || ''} onChange={e=>setValue(f.name,e.target.value)} required={f.req} rows={4} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 ring-accent" />
                ) : f.type === 'select' ? (
                  <select name={f.name} value={values[f.name] || ''} onChange={e=>setValue(f.name,e.target.value)} required={f.req} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 ring-accent"><option value="">Select…</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
                ) : f.type === 'file' ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground"><input name={f.name} type="file" accept=".pdf,.doc,.docx" onChange={e=>setValue(f.name,e.target.files?.[0] || null)} required={f.req} className="w-full text-sm" /><p className="mt-1 text-xs">PDF, DOC or DOCX up to 10MB</p></div>
                ) : (
                  <input name={f.name} type={f.type || 'text'} value={values[f.name] || ''} onChange={e=>setValue(f.name,e.target.value)} required={f.req} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 ring-accent" />
                )}
              </div>
            ))}
            <div className="sm:col-span-2 flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" required className="mt-0.5 accent-[hsl(var(--accent))]" /> I consent to my data being processed in line with the Privacy Policy (GDPR).
            </div>
            {error && <p className="sm:col-span-2 text-sm text-destructive">{error}</p>}
            <button disabled={busy} className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">{busy ? 'Sending…' : cta} <ArrowRight className="h-4 w-4" /></button>
          </form>
        )}
      </section>
    </Layout>
  );
}

export const SubmitCvPage = () => <FormShell eyebrow="Candidates" title="Submit your CV" sub="Register with Veltro Talent Solutions and we'll match you to relevant permanent and contract roles." cta="Submit CV" note="A consultant will review your CV and be in touch within two working days."
  onSubmit={v => submitCandidate({ first_name:v.first, last_name:v.last, email:v.email, phone:v.phone || null, sector:v.sector || null, job_type:v.type || null, message:v.msg || null }, v.cv)}
  fields={[{ name: 'first', label: 'First name', req: true }, { name: 'last', label: 'Last name', req: true }, { name: 'email', label: 'Email', type: 'email', req: true }, { name: 'phone', label: 'Phone', type: 'tel' }, { name: 'sector', label: 'Preferred sector', type: 'select', options: SECTORS.map((s) => s.name), full: true }, { name: 'type', label: 'Preferred job type', type: 'select', options: jobTypes, full: true }, { name: 'cv', label: 'Upload CV', type: 'file', req: true, full: true }, { name: 'msg', label: 'Anything we should know?', type: 'textarea', full: true }]} />;

export const UploadVacancyPage = () => <FormShell eyebrow="Employers" title="Post a vacancy" sub="Tell us who you're looking for and a specialist consultant will build your shortlist." cta="Submit vacancy" note="A consultant will call you to confirm the brief before we begin the search."
  onSubmit={v => submitVacancy({ company_name:v.company, contact_name:v.contact, email:v.email, job_title:v.title, recruitment_type:v.type || null, sector:v.sector || null, salary:v.salary || null, location:v.location || null, description:v.spec })}
  fields={[{ name: 'company', label: 'Company name', req: true, full: true }, { name: 'contact', label: 'Contact name', req: true }, { name: 'email', label: 'Work email', type: 'email', req: true }, { name: 'title', label: 'Job title', req: true, full: true }, { name: 'type', label: 'Recruitment type', type: 'select', options: jobTypes, req: true }, { name: 'sector', label: 'Sector', type: 'select', options: SECTORS.map((s) => s.name) }, { name: 'salary', label: 'Salary / day rate' }, { name: 'location', label: 'Location' }, { name: 'spec', label: 'Job description & requirements', type: 'textarea', full: true, req: true }]} />;

export const ContactPage = () => <FormShell eyebrow="Contact" title="Let's talk" sub="Hiring, job hunting or just have a question? Our team responds within one working day." cta="Send message" note="Thanks for getting in touch — we'll reply within one working day."
  onSubmit={v => submitContact({ name:v.name, email:v.email, phone:v.phone || null, reason:v.reason || null, message:v.msg })}
  fields={[{ name: 'name', label: 'Full name', req: true }, { name: 'email', label: 'Email', type: 'email', req: true }, { name: 'phone', label: 'Phone', type: 'tel' }, { name: 'reason', label: 'I am a…', type: 'select', options: ['Job seeker', 'Employer', 'Contractor', 'Other'] }, { name: 'msg', label: 'Your message', type: 'textarea', full: true, req: true }]} />;

/* ---------------- Resources ---------------- */
export function ResourcesPage() {
  return (
    <Layout>
      <PageHero eyebrow="Resources" title="Career advice & market insight" sub="Practical guides for candidates and employers — from CV tips to salary benchmarks and IR35." />
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map((a) => (
          <Link key={a.slug} to={`/resources/${a.slug}`} className="group flex flex-col rounded-xl border border-border bg-card p-7 hover:border-accent/50 hover:shadow-md transition-all">
            <span className="text-xs font-semibold text-accent">{a.cat} · {a.read} read</span>
            <h3 className="mt-2 font-display font-semibold text-lg text-primary leading-snug">{a.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
            <span className="pt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent mt-auto">Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </section>
    </Layout>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    return (
      <Layout>
        <PageHero eyebrow="Resources" title="Article not found" sub="We couldn't find that article. Browse our latest guides instead." />
        <section className="mx-auto max-w-3xl px-5 lg:px-8 py-16">
          <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-accent"><ArrowLeft className="h-4 w-4" /> Back to resources</Link>
        </section>
      </Layout>
    );
  }
  const others = ARTICLES.filter((a) => a.slug !== article.slug);
  return (
    <Layout>
      <PageHero eyebrow={`${article.cat} · ${article.read} read`} title={article.title} sub={article.excerpt} />
      <article className="mx-auto max-w-3xl px-5 lg:px-8 py-12 lg:py-16">
        <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-accent"><ArrowLeft className="h-4 w-4" /> All resources</Link>
        <p className="mt-6 text-lg text-primary/80 leading-relaxed">{article.intro}</p>
        {article.sections.map((sec) => (
          <div key={sec.h} className="mt-10">
            <h2 className="font-display text-2xl font-bold text-primary">{sec.h}</h2>
            {sec.p?.map((t, i) => <p key={i} className="mt-3 text-muted-foreground leading-relaxed">{t}</p>)}
            {sec.bullets && (
              <ul className="mt-4 space-y-2">
                {sec.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-primary/80"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div className="mt-12 rounded-2xl bg-secondary/60 p-8 text-center">
          <h3 className="font-display text-xl font-bold text-primary">Ready to take the next step?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Our consultants are happy to help, whether you are hiring or looking for your next role.</p>
          <div className="mt-5 flex justify-center gap-3 flex-wrap">
            <Link to={article.cta.to} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">{article.cta.label}</Link>
            <Link to="/contact" className="px-6 py-3 rounded-lg border border-border bg-card font-semibold text-primary">Contact us</Link>
          </div>
        </div>
        <div className="mt-14">
          <h3 className="font-display text-lg font-bold text-primary">More resources</h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {others.map((o) => (
              <Link key={o.slug} to={`/resources/${o.slug}`} className="rounded-xl border border-border bg-card p-5 hover:border-accent/50 transition-colors">
                <span className="text-xs font-semibold text-accent">{o.cat} · {o.read} read</span>
                <p className="mt-1 font-display font-semibold text-primary leading-snug">{o.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </Layout>
  );
}

/* ---------------- Legal ---------------- */
const LEGAL = [
  {
    id: 'privacy-policy', title: 'Privacy Policy',
    intro: 'We process personal data lawfully, fairly and transparently under UK GDPR. We collect only what we need to provide recruitment services, retain it only as long as necessary, and never sell your data. You can request access, correction, export or deletion of your data at any time.',
    bullets: ['What we collect: contact details, CVs, work history, vacancy information and messages you send us', 'Why we use it: to match candidates with roles, support clients and respond to enquiries', 'Who we share it with: only clients and service providers needed to deliver our services, and only with your agreement where required', 'Your rights: access, correction, deletion, restriction, portability and the right to object'],
  },
  {
    id: 'cookie-policy', title: 'Cookie Policy',
    intro: 'We use essential cookies to run the site and, with your consent, analytics cookies to understand usage. You can manage your preferences at any time through the cookie banner.',
    bullets: ['Essential cookies: keep the site secure and working, and cannot be switched off', 'Analytics cookies: help us understand which pages are useful so we can improve them, and are only used with your consent', 'Managing cookies: you can also block or delete cookies in your browser settings, though some parts of the site may not work as expected', 'We do not use cookies to sell your personal data'],
  },
  {
    id: 'terms-and-conditions', title: 'Terms & Conditions',
    intro: 'Use of this website and our services is governed by our standard terms of business for candidates and clients. Placement fees, guarantee periods and contractor terms are confirmed in writing before any engagement.',
    bullets: ['Website use: please use the site lawfully and provide accurate information in any forms you submit', 'Job listings: vacancies are published in good faith and may change or close without notice', 'Fees and guarantees: agreed in writing with each client before work begins', 'Contractors: engagement terms, rates and payment arrangements are confirmed before an assignment starts', 'Liability: nothing in these terms limits any rights you have under UK law'],
  },
  {
    id: 'accessibility', title: 'Accessibility Statement',
    intro: 'We aim to meet WCAG 2.1 AA. The site supports keyboard navigation, screen readers, sufficient colour contrast and visible focus states. If you encounter a barrier, contact us and we will provide the information in an alternative format.',
    bullets: ['Keyboard: pages and forms can be used without a mouse', 'Screen readers: we use meaningful headings, labels and image descriptions', 'Display: text is resizable and the layout adapts to phones, tablets and desktops', 'Feedback: if something is hard to use, tell us and we will work to fix it'],
  },
];

export function LegalPage() {
  return (
    <Layout>
      <PageHero eyebrow="Legal & policies" title="Policies, terms & accessibility" sub="Our commitment to your privacy, data protection and an accessible experience for everyone." />
      <section className="mx-auto max-w-3xl px-5 lg:px-8 py-12 lg:py-16">
        <nav aria-label="Policies" className="flex flex-wrap gap-2">
          {LEGAL.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-primary hover:border-accent/50 hover:text-accent transition-colors">{l.title}</a>
          ))}
        </nav>
        <div className="mt-10 space-y-12">
          {LEGAL.map((l) => (
            <div key={l.id} id={l.id} className="scroll-mt-24">
              <h2 className="font-display text-2xl font-bold text-primary">{l.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{l.intro}</p>
              <ul className="mt-4 space-y-2">
                {l.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-primary/80"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 rounded-2xl bg-secondary/60 p-8 text-center">
          <h3 className="font-display text-xl font-bold text-primary">Questions about our policies?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Get in touch and we'll be happy to help.</p>
          <Link to="/contact" className="mt-5 inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">Contact us</Link>
        </div>
      </section>
    </Layout>
  );
}
