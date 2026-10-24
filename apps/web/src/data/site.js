export const COMPANY = {
  name: 'Veltro Talent Solutions',
  legalName: 'Veltro Talent Solutions Ltd',
  tagline: 'The right people, placed right — across the UK.',
  serviceArea: 'UK-wide recruitment',
  phone: '',
  email: '',
  address: '',
  linkedin: '',
  twitter: '',
  facebook: '',
};

export const IMAGES = {
  hero: 'https://images.hostinger.com/08759df2-86b9-4889-8028-d50b593b2a68.png',
  interview: 'https://images.hostinger.com/4e71cc21-d5bd-490e-b254-ff72c0e16470.png',
};

export const SECTORS = [
  { slug: 'technology', name: 'Technology & IT', icon: 'Cpu', blurb: 'Software, cloud, data & cyber roles.' },
  { slug: 'finance', name: 'Finance & Accounting', icon: 'Landmark', blurb: 'Qualified accountants, analysts and finance leadership.' },
  { slug: 'healthcare', name: 'Healthcare & Life Sciences', icon: 'HeartPulse', blurb: 'Clinical, care and life-science professionals.' },
  { slug: 'engineering', name: 'Engineering & Manufacturing', icon: 'Wrench', blurb: 'Mechanical, electrical and process engineering talent.' },
  { slug: 'construction', name: 'Construction & Property', icon: 'HardHat', blurb: 'Site, trades and professional construction staffing.' },
  { slug: 'sales', name: 'Sales & Marketing', icon: 'TrendingUp', blurb: 'Commercial, digital and brand specialists.' },
  { slug: 'legal', name: 'Legal & Compliance', icon: 'Scale', blurb: 'Legal, risk and compliance professionals.' },
  { slug: 'logistics', name: 'Supply Chain & Logistics', icon: 'Truck', blurb: 'Operations, warehousing and driving cover.' },
];

// Production jobs are stored in Supabase. Keep this empty so demo vacancies can never appear on the live site.
export const JOBS = [];

// Only use verified business metrics here. Add real figures when you have them.
export const STATS = [];
export const TESTIMONIALS = [];
export const CLIENTS = [];
// PLACEHOLDER TEAM: dummy names and illustrated avatars for layout purposes only.
// Replace these with real team members (or set TEAM = []) before launch.
// `img` is optional; initials are shown if omitted.
export const TEAM = [
  { name: 'Alex Morgan', role: 'Managing Director', bio: 'Leads the business and works closely with clients on long-term hiring strategy.', img: 'https://api.dicebear.com/9.x/notionists/svg?seed=AlexMorgan&backgroundColor=c0f0e8' },
  { name: 'Priya Shah', role: 'Head of Technology Recruitment', bio: 'Specialises in software, cloud and data roles across permanent and contract hiring.', img: 'https://api.dicebear.com/9.x/notionists/svg?seed=PriyaShah&backgroundColor=d6e4ff' },
  { name: 'James Carter', role: 'Senior Consultant, Finance', bio: 'Supports finance teams with qualified accountants, analysts and finance leaders.', img: 'https://api.dicebear.com/9.x/notionists/svg?seed=JamesCarter&backgroundColor=ffe8cc' },
  { name: 'Sophie Williams', role: 'Senior Consultant, Healthcare', bio: 'Connects clinical, care and life-science professionals with the right organisations.', img: 'https://api.dicebear.com/9.x/notionists/svg?seed=SophieWilliams&backgroundColor=ffd9e0' },
  { name: 'Daniel Okafor', role: 'Engineering & Construction Consultant', bio: 'Places engineering, site and trades professionals on projects across the UK.', img: 'https://api.dicebear.com/9.x/notionists/svg?seed=DanielOkafor&backgroundColor=e0f0c8' },
  { name: 'Emma Clarke', role: 'Candidate Experience Manager', bio: 'Makes sure every candidate gets clear communication and support from first call to start date.', img: 'https://api.dicebear.com/9.x/notionists/svg?seed=EmmaClarke&backgroundColor=e8dcff' },
];

export const PROCESS = [
  { n: '01', t: 'Understand', d: 'We clarify the role, team, priorities and hiring timeline.' },
  { n: '02', t: 'Search', d: 'We identify and engage relevant candidates through our network and market reach.' },
  { n: '03', t: 'Shortlist', d: 'You receive a focused shortlist aligned to the brief.' },
  { n: '04', t: 'Support', d: 'We coordinate interviews, offers and onboarding through to start date.' },
];

export const PIPELINE = ['New Candidate', 'Screening', 'Qualified', 'Submitted to Client', 'Interview', 'Offer', 'Placement', 'Hired / Started'];

export const ARTICLES = [
  { cat: 'Candidates', read: '5 min', title: 'How to prepare for your next recruitment conversation', excerpt: 'Practical preparation tips for speaking with a recruiter about your experience, goals and availability.' },
  { cat: 'Employers', read: '6 min', title: 'Writing a job brief that attracts the right candidates', excerpt: 'The information that helps recruiters understand a vacancy and build a stronger shortlist.' },
  { cat: 'Hiring', read: '4 min', title: 'Permanent, contract or temporary: which hiring model fits?', excerpt: 'A straightforward guide to the main recruitment options and when each can work well.' },
];

export const jobTypes = ['Permanent', 'Contract', 'Temporary'];
export const workModes = ['Remote', 'Hybrid', 'Onsite'];
export const sectorName = (slug) => (SECTORS.find((s) => s.slug === slug) || {}).name || slug;
