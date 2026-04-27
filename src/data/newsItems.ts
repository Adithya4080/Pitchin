export type NewsCategory = 'startups' | 'business' | 'markets' | 'innovation' | 'companies';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  sourceUrl: string;
  publishedAt: string; // ISO
  category: NewsCategory;
}

// Mock weekly Indian startup/business/market/innovation news
export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    title: 'Zepto crosses $5B GMV run-rate as quick commerce wars heat up',
    description:
      'Mumbai-based Zepto has hit a $5B annualised GMV milestone, intensifying competition with Blinkit and Instamart in India\'s 10-minute delivery market.',
    imageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
    source: 'Inc42',
    sourceUrl: 'https://inc42.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    category: 'startups',
  },
  {
    id: '2',
    title: 'Reliance Jio readies AI cloud rollout with NVIDIA partnership',
    description:
      'Reliance Industries plans to launch a sovereign AI cloud service later this year, leveraging NVIDIA GPUs to serve Indian enterprises and startups.',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    source: 'Economic Times',
    sourceUrl: 'https://economictimes.indiatimes.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    category: 'companies',
  },
  {
    id: '3',
    title: 'Sensex closes at record high as FII inflows surge',
    description:
      'Indian benchmark indices hit fresh all-time highs this week, powered by strong foreign institutional buying in IT and banking heavyweights.',
    imageUrl:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    source: 'Moneycontrol',
    sourceUrl: 'https://moneycontrol.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    category: 'markets',
  },
  {
    id: '4',
    title: 'IIT Madras spinout unveils India-built humanoid robot',
    description:
      'A robotics startup incubated at IIT Madras has demonstrated a fully indigenous humanoid platform aimed at industrial inspection and elderly care.',
    imageUrl:
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=800&auto=format&fit=crop&q=80',
    source: 'YourStory',
    sourceUrl: 'https://yourstory.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    category: 'innovation',
  },
  {
    id: '5',
    title: 'Razorpay confirms IPO plans, eyes $1B raise in 2026',
    description:
      'Fintech unicorn Razorpay has begun pre-IPO discussions with bankers, targeting a public listing on Indian exchanges next year.',
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
    source: 'Business Standard',
    sourceUrl: 'https://business-standard.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    category: 'business',
  },
  {
    id: '6',
    title: 'Ola Electric launches affordable EV bike at Rs 79,999',
    description:
      'Ola Electric has unveiled its most affordable electric motorcycle yet, targeting India\'s mass-market commuter segment dominated by Hero and Honda.',
    imageUrl:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
    source: 'Mint',
    sourceUrl: 'https://livemint.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    category: 'companies',
  },
  {
    id: '7',
    title: 'Indian SaaS startup Postman valued at $5.6B in secondary deal',
    description:
      'API platform Postman has retained its $5.6B valuation in a recent employee secondary, defying the broader SaaS down-round trend.',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    source: 'Entrackr',
    sourceUrl: 'https://entrackr.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    category: 'startups',
  },
  {
    id: '8',
    title: 'ISRO partners with private startups for reusable launch vehicles',
    description:
      'ISRO has signed MoUs with Skyroot, Agnikul and three other private players to co-develop India\'s first reusable orbital rocket platforms.',
    imageUrl:
      'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&auto=format&fit=crop&q=80',
    source: 'The Hindu BusinessLine',
    sourceUrl: 'https://thehindubusinessline.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 38).toISOString(),
    category: 'innovation',
  },
  {
    id: '9',
    title: 'Nifty IT index gains 4% on strong Q3 results from TCS, Infosys',
    description:
      'India\'s top IT services firms posted better-than-expected revenue growth, signalling a recovery in discretionary tech spending by US clients.',
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    source: 'Bloomberg Quint',
    sourceUrl: 'https://bqprime.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(),
    category: 'markets',
  },
  {
    id: '10',
    title: 'Tata Group commits $90B to renewables and semiconductors by 2030',
    description:
      'Tata Sons chairman Chandrasekaran outlined a $90B capex roadmap focused on green energy, chip fabrication and EV manufacturing.',
    imageUrl:
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80',
    source: 'Economic Times',
    sourceUrl: 'https://economictimes.indiatimes.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    category: 'business',
  },
  {
    id: '11',
    title: 'Bengaluru AI startup Sarvam raises $40M to build Indic LLMs',
    description:
      'Sarvam AI, founded by ex-Microsoft Research scientists, has raised a Series A to build large language models tuned for Indian languages.',
    imageUrl:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    source: 'TechCrunch India',
    sourceUrl: 'https://techcrunch.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    category: 'startups',
  },
  {
    id: '12',
    title: 'Adani Green commissions India\'s largest solar-wind hybrid project',
    description:
      'Adani Green Energy has commissioned a 2.14 GW hybrid renewable project in Rajasthan, expected to power 1.6 million homes annually.',
    imageUrl:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    source: 'Reuters India',
    sourceUrl: 'https://reuters.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    category: 'companies',
  },
];

export const NEWS_CATEGORIES: { value: NewsCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'startups', label: 'Startups' },
  { value: 'business', label: 'Business' },
  { value: 'markets', label: 'Markets' },
  { value: 'innovation', label: 'Innovation' },
  { value: 'companies', label: 'Companies' },
];

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
