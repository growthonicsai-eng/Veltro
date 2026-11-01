import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, ArrowRight, MapPin, Mail, Phone, Linkedin, Twitter, Facebook } from 'lucide-react';
import { COMPANY } from '@/data/site';

const NAV = [
  { to: '/jobs', label: 'Find a Job' },
  { to: '/employers', label: 'Employers' },
  { to: '/candidates', label: 'Candidates' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function Logo({ light }) {
  return (
    <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl">
      <span className="grid place-items-center h-9 w-9 rounded-lg bg-accent text-accent-foreground"><Briefcase className="h-5 w-5" strokeWidth={2.5} /></span>
      <span className={light ? 'text-white' : 'text-primary'}>Veltro<span className="text-accent">Talent Solutions</span></span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  React.useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-[90rem] px-5 lg:px-8 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-primary/80 hover:text-primary hover:bg-secondary'}`}>{n.label}</NavLink>)}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <Link to="/candidates" className="px-4 py-2 text-sm font-semibold text-primary hover:text-accent transition-colors">Candidate portal</Link>
          <Link to="/submit-cv" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-[0.98]">Submit CV <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <button className="lg:hidden p-2 -mr-2 text-primary" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </div>
      {open && <div className="lg:hidden border-t border-border bg-white px-5 py-4 space-y-1">{NAV.map((n) => <NavLink key={n.to} to={n.to} className="block px-3 py-2.5 rounded-md text-base font-medium text-primary hover:bg-secondary">{n.label}</NavLink>)}<Link to="/submit-cv" className="mt-2 flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">Submit CV <ArrowRight className="h-4 w-4" /></Link></div>}
    </header>
  );
}

const FOOT = {
  Candidates: [['Job Search', '/jobs'], ['Submit CV', '/submit-cv'], ['Career Advice', '/resources'], ['Candidate Portal', '/candidates']],
  Employers: [['Hire Talent', '/employers'], ['Post a Vacancy', '/upload-vacancy'], ['Permanent', '/services'], ['Contract & Temp', '/services']],
  Company: [['About Us', '/about'], ['Meet the Team', '/about#meet-the-team'], ['Contact', '/contact']],
  Legal: [['Privacy Policy', '/legal#privacy-policy'], ['Cookie Policy', '/legal#cookie-policy'], ['Terms & Conditions', '/legal#terms-and-conditions'], ['Accessibility', '/legal#accessibility']],
};

export function Footer() {
  const socials = [[Linkedin, COMPANY.linkedin, 'LinkedIn'], [Twitter, COMPANY.twitter, 'X'], [Facebook, COMPANY.facebook, 'Facebook']].filter(([, href]) => href);
  return (
    <footer className="bg-primary text-white/80 mt-24">
      <div className="mx-auto max-w-[90rem] px-5 lg:px-8 py-16 grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo light />
          <p className="mt-4 text-sm max-w-xs leading-relaxed">Specialist permanent, contract and temporary recruitment across the UK. People-first, results-driven.</p>
          <div className="mt-5 space-y-2 text-sm">
            {COMPANY.phone && <a href={`tel:${COMPANY.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-accent"><Phone className="h-4 w-4" /> {COMPANY.phone}</a>}
            {COMPANY.email && <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 hover:text-accent"><Mail className="h-4 w-4" /> {COMPANY.email}</a>}
            {COMPANY.address && <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {COMPANY.address}</p>}
          </div>
          {socials.length > 0 && <div className="mt-5 flex gap-3">{socials.map(([I, href, label]) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid place-items-center h-9 w-9 rounded-lg bg-white/10 hover:bg-accent transition-colors"><I className="h-4 w-4" /></a>)}</div>}
        </div>
        {Object.entries(FOOT).map(([head, links]) => <div key={head}><h4 className="text-white font-semibold text-sm mb-4">{head}</h4><ul className="space-y-2.5 text-sm">{links.map(([label, to]) => <li key={label}><Link to={to} className="hover:text-accent transition-colors">{label}</Link></li>)}</ul></div>)}
      </div>
      <div className="border-t border-white/10"><div className="mx-auto max-w-[90rem] px-5 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs"><p>© {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.</p><p>UK recruitment · Privacy-first · Accessibility focused</p></div></div>
    </footer>
  );
}

export default function Layout({ children }) { return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1">{children}</main><Footer /></div>; }
