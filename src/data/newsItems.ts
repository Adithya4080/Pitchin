export type NewsCategory =
| "for-you"
| "top-stories"
| "startup"
| "funding"
| "investing"
| "technology"
| "business"
| "ecosystem"
| "policy";

export interface NewsItem {
id: string;
title: string;
description: string;
imageUrl: string;
source: string;
sourceUrl: string;
publishedAt: string;
category: NewsCategory;
readMinutes?: number;
sources?: number;
tags?: string[];
isTopStory?: boolean;
}

export const NEWS_ITEMS: NewsItem[] = [
{
id: "1",
title: "Zepto crosses $5B GMV run-rate as quick commerce wars heat up",
description:
"Mumbai-based Zepto has hit a $5B annualised GMV milestone, intensifying competition with Blinkit and Instamart.",
imageUrl:
"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80",
source: "Inc42",
sourceUrl: "https://inc42.com",
publishedAt: new Date().toISOString(),
category: "startup",
readMinutes: 4,
sources: 9,
tags: ["Startup", "India"],
isTopStory: true,
},

{
id: "2",
title: "Reliance Jio readies AI cloud rollout with NVIDIA partnership",
description:
"Reliance plans to launch a sovereign AI cloud service later this year.",
imageUrl:
"https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
source: "Economic Times",
sourceUrl: "https://economictimes.indiatimes.com",
publishedAt: new Date().toISOString(),
category: "technology",
readMinutes: 5,
sources: 14,
tags: ["AI", "Cloud"],
},

{
id: "3",
title: "Razorpay confirms IPO plans",
description:
"Fintech unicorn Razorpay has begun pre-IPO discussions.",
imageUrl:
"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
source: "Business Standard",
sourceUrl: "https://business-standard.com",
publishedAt: new Date().toISOString(),
category: "business",
readMinutes: 4,
sources: 8,
tags: ["IPO", "Fintech"],
}
];

export const NEWS_CATEGORIES = [
{ value: "for-you", label: "For You" },
{ value: "startup", label: "Startup" },
{ value: "funding", label: "Funding" },
{ value: "investing", label: "Investing" },
{ value: "technology", label: "Technology" },
{ value: "business", label: "Business" },
{ value: "ecosystem", label: "Ecosystem" },
];

export const INTEREST_TOPICS = [
{ label: "Startup", icon: "🚀" },
{ label: "Investing", icon: "📈" },
{ label: "Technology", icon: "💻" },
{ label: "Business", icon: "💼" },
{ label: "AI", icon: "🤖" },
{ label: "Funding", icon: "💰" },
{ label: "Policy", icon: "📄" },
{ label: "Ecosystem", icon: "🌐" },
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
