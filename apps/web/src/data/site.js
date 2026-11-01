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
// PLACEHOLDER TEAM: dummy names and stock portrait photos (randomuser.me) for layout purposes only.
// Replace with real team members and your own photos (e.g. img: '/team/name.jpg') before launch.
// `img` is optional; initials are shown if omitted.
export const TEAM = [
  { name: 'Alex Morgan', role: 'Managing Director', bio: 'Leads the business and works closely with clients on long-term hiring strategy.', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Priya Shah', role: 'Head of Technology Recruitment', bio: 'Specialises in software, cloud and data roles across permanent and contract hiring.', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'James Carter', role: 'Senior Consultant, Finance', bio: 'Supports finance teams with qualified accountants, analysts and finance leaders.', img: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { name: 'Sophie Williams', role: 'Senior Consultant, Healthcare', bio: 'Connects clinical, care and life-science professionals with the right organisations.', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Daniel Okafor', role: 'Engineering & Construction Consultant', bio: 'Places engineering, site and trades professionals on projects across the UK.', img: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { name: 'Emma Clarke', role: 'Candidate Experience Manager', bio: 'Makes sure every candidate gets clear communication and support from first call to start date.', img: 'https://randomuser.me/api/portraits/women/26.jpg' },
];

export const PROCESS = [
  { n: '01', t: 'Understand', d: 'We clarify the role, team, priorities and hiring timeline.' },
  { n: '02', t: 'Search', d: 'We identify and engage relevant candidates through our network and market reach.' },
  { n: '03', t: 'Shortlist', d: 'You receive a focused shortlist aligned to the brief.' },
  { n: '04', t: 'Support', d: 'We coordinate interviews, offers and onboarding through to start date.' },
];

export const PIPELINE = ['New Candidate', 'Screening', 'Qualified', 'Submitted to Client', 'Interview', 'Offer', 'Placement', 'Hired / Started'];

// PLACEHOLDER ARTICLES: sample copy for layout purposes. Replace with your own content before launch.
// Each article: slug (URL), cat, read, title, excerpt, intro, sections[{h, p[], bullets[]}], cta{label,to}
export const ARTICLES = [
  {
    slug: 'prepare-for-your-next-recruitment-conversation',
    cat: 'Candidates', read: '5 min',
    title: 'How to prepare for your next recruitment conversation',
    excerpt: 'Practical preparation tips for speaking with a recruiter about your experience, goals and availability.',
    intro: 'A good conversation with a recruiter can open doors to roles you would not find on your own. A little preparation helps you explain what you offer, what you want next and how we can help.',
    sections: [
      { h: 'Know your story', p: ['Be ready to summarise your career in a couple of minutes: where you have worked, what you are proud of and why you are looking for a change.'], bullets: ['Pick two or three achievements and note the result of each', 'Keep your CV to hand and make sure it is up to date', 'Be ready to explain any gaps or moves clearly and positively'] },
      { h: 'Be clear about what you want', p: ['The more specific you are, the better the match. Think about the role, the environment and the practical details that matter to you.'], bullets: ['Target job titles, sectors and the type of company', 'Salary or day-rate expectations, and what is flexible', 'Location, commute and your preferred working pattern', 'Your notice period or availability to start'] },
      { h: 'Share the practical details', p: ['Recruiters need a few facts to move quickly on your behalf. Having these ready avoids delays when a good role comes up.'], bullets: ['Right to work in the UK', 'Any holidays or commitments in the next few weeks', 'Referees you are happy for us to contact later'] },
      { h: 'Ask questions too', p: ['A conversation works both ways. Ask about the role, the team and what happens next so you can make an informed decision.'], bullets: ['What does the hiring process look like and how long does it take?', 'What is the team like and why is the role open?', 'How and when will I receive feedback?'] },
      { h: 'After the call', p: ['Follow up on anything you promised, such as an updated CV or references. Keep your consultant informed if your situation changes so they can adjust their search.'] },
    ],
    cta: { label: 'Submit your CV', to: '/submit-cv' },
  },
  {
    slug: 'writing-a-job-brief-that-attracts-the-right-candidates',
    cat: 'Employers', read: '6 min',
    title: 'Writing a job brief that attracts the right candidates',
    excerpt: 'The information that helps recruiters understand a vacancy and build a stronger shortlist.',
    intro: 'A clear job brief is the foundation of a strong shortlist. When we understand the role, the team and what success looks like, we can approach the right people and represent your business accurately.',
    sections: [
      { h: 'Start with the purpose of the role', p: ['Explain why the role exists and what it needs to achieve in the first year. Candidates respond to a clear sense of impact.'], bullets: ['Why the vacancy has opened', 'Key responsibilities and priorities', 'How success will be measured'] },
      { h: 'Separate essentials from nice-to-haves', p: ['A long list of requirements can rule out strong candidates. Be honest about what is essential and what can be learned on the job.'], bullets: ['Must-have skills, experience and qualifications', 'Desirable extras that would help', 'Areas where you would consider potential over experience'] },
      { h: 'Be open about the package', p: ['Salary, benefits and flexibility are among the first things candidates look at. Sharing a realistic range early saves time on both sides.'], bullets: ['Salary or day-rate range', 'Benefits, bonus and progression', 'Hybrid, remote or onsite expectations'] },
      { h: 'Describe the team and culture', p: ['Tell us who the role works with, how the team operates and what makes your organisation a good place to work. This helps us find people who will thrive, not just people who fit the job description.'] },
      { h: 'Agree the hiring process and timeline', p: ['Candidates move quickly. Let us know who is involved, how many interview stages there are and how fast you can make decisions.'], bullets: ['Number and format of interview stages', 'Who is involved in decisions', 'Target start date'] },
    ],
    cta: { label: 'Upload a vacancy', to: '/upload-vacancy' },
  },
  {
    slug: 'permanent-contract-or-temporary-which-hiring-model-fits',
    cat: 'Hiring', read: '4 min',
    title: 'Permanent, contract or temporary: which hiring model fits?',
    excerpt: 'A straightforward guide to the main recruitment options and when each can work well.',
    intro: 'The right hiring model depends on the work, the timeline and the budget. Here is a simple overview of the three main options and when each tends to work well.',
    sections: [
      { h: 'Permanent hiring', p: ['A permanent employee joins your team for the long term. This suits roles that are core to your business and where continuity, culture and development matter.'], bullets: ['Best for ongoing, business-critical roles', 'Builds long-term knowledge and team culture', 'Usually involves a longer search and notice periods'] },
      { h: 'Contract hiring', p: ['Contractors are engaged for a defined project or period and bring specialist skills quickly. This suits project delivery or when you need expertise you do not have in-house.'], bullets: ['Best for projects, transformation and specialist skills', 'Fast to start and easy to scale up or down', 'Consider IR35 status and day rates in your planning'] },
      { h: 'Temporary hiring', p: ['Temporary workers cover short-term needs such as absence, seasonal peaks or urgent workload, often at short notice.'], bullets: ['Best for cover, peaks and urgent requirements', 'Flexible and quick to arrange', 'Can lead to a permanent role if it is a good fit'] },
      { h: 'How to choose', p: ['Start with how long you need the skills and how central the role is. If you are unsure, talk it through with a consultant. Many clients use a mix of models as their needs change.'] },
    ],
    cta: { label: 'Talk to our team', to: '/contact' },
  },
];

export const jobTypes = ['Permanent', 'Contract', 'Temporary'];
export const workModes = ['Remote', 'Hybrid', 'Onsite'];
export const sectorName = (slug) => (SECTORS.find((s) => s.slug === slug) || {}).name || slug;
