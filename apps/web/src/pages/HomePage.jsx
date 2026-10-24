import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Users, FileUp, Building2, ClipboardList, CheckCircle2, Star, Quote, Cpu, Landmark, HeartPulse, Wrench, HardHat, TrendingUp, Scale, Truck, Briefcase } from 'lucide-react';

const SECTOR_ICONS = { Cpu, Landmark, HeartPulse, Wrench, HardHat, TrendingUp, Scale, Truck };
import Layout from '@/components/Layout';
import JobCard from '@/components/JobCard';
import { SECTORS, STATS, TESTIMONIALS, CLIENTS, PROCESS, ARTICLES, IMAGES, jobTypes, COMPANY } from '@/data/site';
import { usePublishedJobs } from '@/hooks/usePublishedJobs';

function SearchBar({ compact }) {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  const [type, setType] = useState('');
  const go = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.set('q', q); if (loc) p.set('loc', loc); if (type) p.set('type', type);
    nav(`/jobs?${p.toString()}`);
  };
  return (
    <form onSubmit={go} className={`bg-white rounded-2xl p-2 shadow-xl shadow-primary/10 grid gap-2 ${compact ? 'sm:grid-cols-[1fr_1fr_auto]' : 'md:grid-cols-[1.4fr_1fr_1fr_auto]'}`}>
      <label className="flex items-center gap-2 px-3 rounded-xl bg-secondary/60 focus-within:ring-2 ring-accent">
        <Search className="h-5 w-5 text-muted-foreground shrink-0" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title, skills or keyword" className="w-full bg-transparent py-3 text-sm outline-none" />
      </label>
      <label className="flex items-center gap-2 px-3 rounded-xl bg-secondary/60 focus-within:ring-2 ring-accent">
        <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
        <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Location" className="w-full bg-transparent py-3 text-sm outline-none" />
      </label>
      {!compact && (
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-3 rounded-xl bg-secondary/60 text-sm outline-none focus:ring-2 ring-accent text-primary">
          <option value="">All job types</option>
          {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      )}
      <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:brightness-105 active:scale-[0.98] transition">
        Search <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

const CTAS = [
  { to: '/jobs', icon: Search, title: 'Find a Job', text: 'Browse live vacancies' },
  { to: '/submit-cv', icon: FileUp, title: 'Submit Your CV', text: 'Get matched to roles' },
  { to: '/employers', icon: Users, title: 'Hire Talent', text: 'Build your team' },
  { to: '/upload-vacancy', icon: Building2, title: 'Post a Vacancy', text: 'Reach great candidates' },
];

export default function HomePage() {
  const liveJobs = usePublishedJobs();
  const featured = liveJobs.filter((j) => j.featured);
  const latest = liveJobs.slice(0, 6);
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Recruitment consultants collaborating in a modern office" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/60" />
        </div>
        <div className="relative mx-auto max-w-[90rem] px-5 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl animate-rise">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Permanent · Contract · Temporary
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
              The right people, <span className="text-accent">placed right</span> — across the UK.
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-2xl leading-relaxed">
              Specialist recruitment for technology, finance, healthcare and more. Whether you're hiring or hunting your next role, Veltro Talent Solutions moves at the speed your ambition demands.
            </p>
          </div>
          <div className="relative mt-8 max-w-4xl animate-rise" style={{ animationDelay: '120ms' }}>
            <SearchBar />
            <p className="mt-3 text-sm text-white/60">Popular: <Link to="/jobs?q=React" className="underline hover:text-accent">React Engineer</Link> · <Link to="/jobs?q=Nurse" className="underline hover:text-accent">Nurse</Link> · <Link to="/jobs?type=Contract" className="underline hover:text-accent">Contract roles</Link></p>
          </div>
        </div>
        {/* client marquee */}
        {CLIENTS.length > 0 && <div className="relative border-t border-white/10 py-5 overflow-hidden"><div className="flex w-max animate-marquee gap-14 px-8 text-white/50 font-display font-semibold text-lg">{[...CLIENTS, ...CLIENTS].map((c, i) => <span key={i} className="whitespace-nowrap">{c}</span>)}</div></div>}
      </section>

      {/* CTA cards */}
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 -mt-10 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CTAS.map((c) => (
            <Link key={c.title} to={c.to} className="group bg-card rounded-xl border border-border p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all">
              <span className="grid place-items-center h-11 w-11 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors"><c.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 font-display font-semibold text-primary flex items-center gap-1">{c.title} <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></h3>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {STATS.length > 0 && <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-y border-border divide-x divide-border">{STATS.map((s) => <div key={s.label} className="text-center px-4 py-6"><p className="font-display text-3xl lg:text-4xl font-extrabold text-primary">{s.value}</p><p className="mt-1 text-sm text-muted-foreground">{s.label}</p></div>)}</div>
      </section>}

      {/* Featured jobs */}
      {featured.length > 0 && <section className="mx-auto max-w-[90rem] px-5 lg:px-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">Featured roles</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-primary">Handpicked opportunities</h2>
          </div>
          <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">View all jobs <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      </section>}

      {/* Services */}
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-6">
          {[
            { tag: 'Permanent recruitment', title: 'Hires that stay and grow', text: 'Rigorous search, deep screening and a replacement guarantee — for the people who will shape your future. From offer management to placement tracking, we own the outcome.', to: '/services', img: IMAGES.interview, points: ['Executive & specialist search', 'Salary benchmarking', 'Guarantee & aftercare'] },
            { tag: 'Contract & temporary', title: 'Flexible talent, fully compliant', text: 'Scale up fast with contractors and temporary staff. We handle IR35, timesheets, right-to-work and compliance so you can focus on delivery.', to: '/services', img: IMAGES.hero, points: ['IR35 assessment', 'Timesheet & payroll workflows', 'Compliance & document tracking'] },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl overflow-hidden border border-border bg-card flex flex-col">
              <div className="h-48 overflow-hidden"><img src={s.img} alt={s.title} className="h-full w-full object-cover" /></div>
              <div className="p-7 flex-1 flex flex-col">
                <p className="text-accent font-semibold text-sm">{s.tag}</p>
                <h3 className="mt-1 font-display text-2xl font-bold text-primary">{s.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{s.text}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {s.points.map((p) => <li key={p} className="flex items-center gap-2 text-primary/80"><CheckCircle2 className="h-4 w-4 text-accent" /> {p}</li>)}
                </ul>
                <Link to={s.to} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">Learn more <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-[90rem] px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">Sectors</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-primary">Specialists in the industries that move the UK</h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SECTORS.map((s) => {
              const Icon = SECTOR_ICONS[s.icon] || Briefcase;
              return (
                <Link key={s.slug} to={`/jobs?sector=${s.slug}`} className="group bg-card rounded-xl border border-border p-6 hover:border-accent hover:-translate-y-1 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="grid place-items-center h-11 w-11 rounded-lg bg-accent/10 text-accent"><Icon className="h-5 w-5" /></span>
                    <span className="text-xs font-semibold text-muted-foreground">View roles</span>
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-primary group-hover:text-accent transition-colors">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.blurb}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-20">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">Our process</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-primary">A proven path from brief to placement</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">Every search follows a transparent, four-stage process — so you always know exactly where things stand.</p>
            <Link to="/employers" className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"><ClipboardList className="h-4 w-4" /> Start a search</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {PROCESS.map((p) => (
              <div key={p.n} className="rounded-xl border border-border bg-card p-6">
                <span className="font-display text-3xl font-extrabold text-accent/30">{p.n}</span>
                <h3 className="mt-2 font-display font-semibold text-primary">{p.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest jobs */}
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 mt-12">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2 className="font-display text-3xl font-bold text-primary">Latest jobs</h2>
          <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">Browse job board <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {latest.length > 0 ? <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">{latest.map((j) => <JobCard key={j.id} job={j} />)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-border bg-secondary/40 p-8 text-center"><p className="font-display text-xl font-bold text-primary">Live vacancies will appear here</p><p className="mt-2 text-sm text-muted-foreground">Veltro's public job board is connected to the admin dashboard. Publish a vacancy from /admin to make it live.</p><Link to="/contact" className="mt-5 inline-flex px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold">Talk to Veltro</Link></div>}
      </section>

      {/* Testimonials */}
      {TESTIMONIALS.length > 0 && <section className="py-20 mt-8 bg-primary text-white">
        <div className="mx-auto max-w-[90rem] px-5 lg:px-8">
          <div className="flex items-center gap-2 text-accent"><Star className="h-4 w-4 fill-accent" /><Star className="h-4 w-4 fill-accent" /><Star className="h-4 w-4 fill-accent" /><Star className="h-4 w-4 fill-accent" /><Star className="h-4 w-4 fill-accent" /><span className="text-sm text-white/70 ml-2">Rated 4.9/5 by clients &amp; candidates</span></div>
          <h2 className="mt-3 font-display text-3xl font-bold">Trusted on both sides of the table</h2>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-xl bg-white/5 border border-white/10 p-6">
                <Quote className="h-6 w-6 text-accent" />
                <p className="mt-3 text-sm leading-relaxed text-white/85">{t.quote}</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-white/60">{t.role}</p>
                  <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wider text-accent">{t.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* Articles */}
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">Resources</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-primary">Latest career advice &amp; insight</h2>
          </div>
          <Link to="/resources" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">All articles <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {ARTICLES.map((a) => (
            <Link key={a.title} to="/resources" className="group rounded-xl border border-border bg-card p-6 hover:border-accent transition-colors">
              <div className="flex items-center gap-2 text-xs"><span className="font-semibold text-accent">{a.cat}</span><span className="text-muted-foreground">· {a.read} read</span></div>
              <h3 className="mt-3 font-display font-semibold text-lg text-primary group-hover:text-accent transition-colors leading-snug">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter + CTA */}
      <section className="mx-auto max-w-[90rem] px-5 lg:px-8 pb-4">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-white p-8 lg:p-14 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold">Get jobs &amp; market insight in your inbox</h2>
            <p className="mt-2 text-white/75">Weekly roles matched to your sector, plus salary benchmarks and career advice. No spam, unsubscribe anytime.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
            <input type="email" required placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-xl text-primary outline-none focus:ring-2 ring-accent" />
            <button className="px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:brightness-105 active:scale-[0.98] transition">Subscribe</button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
