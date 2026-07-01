import { useState, useMemo, useRef, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  Star, ShieldCheck, MapPin, Users, Heart, Grid3X3,
  List, ChevronDown, RotateCcw, Plus, Phone, ClipboardList,
  Search, ArrowRight,
} from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { useServiceCategories, useServiceProviders, useServiceProvider } from '@/hooks/useServices';
import { useSendServiceInquiry } from '@/hooks/useServices';
import type { ProviderFilterParams } from '@/api/services';
import { toast } from 'sonner';

// ─── Category icon map ────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, JSX.Element> = {
  scale: (
    <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4v24M8 8l-4 8h8l-4-8zM24 8l-4 8h8l-4-8z" />
      <line x1="8" y1="28" x2="24" y2="28" />
    </svg>
  ),
  megaphone: (
    <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12v8h4l10 6V6L10 12H6z" />
      <path d="M24 10c2 1.5 3 3.5 3 6s-1 4.5-3 6" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="10" />
      <circle cx="11" cy="13" r="1.5" fill="#EC4899" />
      <circle cx="16" cy="10" r="1.5" fill="#EC4899" />
      <circle cx="21" cy="13" r="1.5" fill="#EC4899" />
      <circle cx="20" cy="19" r="1.5" fill="#EC4899" />
      <circle cx="12" cy="19" r="1.5" fill="#EC4899" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="10 10 4 16 10 22" />
      <polyline points="22 10 28 16 22 22" />
      <line x1="18" y1="8" x2="14" y2="24" />
    </svg>
  ),
  calculator: (
    <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="20" height="24" rx="3" />
      <rect x="10" y="8" width="12" height="5" rx="1" />
      <circle cx="11" cy="19" r="1.2" fill="#059669" />
      <circle cx="16" cy="19" r="1.2" fill="#059669" />
      <circle cx="21" cy="19" r="1.2" fill="#059669" />
      <circle cx="11" cy="24" r="1.2" fill="#059669" />
      <circle cx="16" cy="24" r="1.2" fill="#059669" />
      <circle cx="21" cy="24" r="1.2" fill="#059669" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="24" height="16" rx="2" />
      <path d="M21 11V9a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v2" />
      <line x1="4" y1="19" x2="28" y2="19" />
    </svg>
  ),
};

function getCategoryIcon(icon: string) {
  return CATEGORY_ICONS[icon] ?? CATEGORY_ICONS['briefcase'];
}

// ─── Verified badge (solid blue circle + white tick) ─────────────────────────
function VerifiedBadge() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none">
      <circle cx="8" cy="8" r="7" fill="#2563EB" />
      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Provider logo / initials avatar ─────────────────────────────────────────
function ProviderLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
  const colors = [
    'bg-indigo-700', 'bg-gray-800', 'bg-blue-700', 'bg-violet-700',
    'bg-emerald-700', 'bg-rose-700', 'bg-amber-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const bg = colors[Math.abs(hash) % colors.length];

  if (logoUrl) {
    return (
      <img src={logoUrl} alt={name}
        className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-xl object-cover shrink-0 border border-gray-200"
      />
    );
  }
  return (
    <div className={`w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-xl ${bg} flex items-center justify-center text-white text-base sm:text-lg font-bold shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Sub-category tab strip ───────────────────────────────────────────────────
const SUB_CAT_ICONS: Record<string, JSX.Element> = {
  'company-formation': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="5" width="14" height="10" rx="1.5" />
      <path d="M6 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <line x1="9" y1="9" x2="9" y2="11" /><line x1="8" y1="10" x2="10" y2="10" />
    </svg>
  ),
  'compliance-tax': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M9 2L3 5v4c0 4 3 6.5 6 7 3-.5 6-3 6-7V5L9 2z" />
    </svg>
  ),
  'legal-documents': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="2" width="12" height="14" rx="1.5" />
      <line x1="6" y1="6" x2="12" y2="6" /><line x1="6" y1="9" x2="12" y2="9" /><line x1="6" y1="12" x2="9" y2="12" />
    </svg>
  ),
  'intellectual-property': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M9 2a5 5 0 0 1 5 5c0 2.5-1.5 4.5-3.5 5.5V14h-3v-1.5C5.5 11.5 4 9.5 4 7a5 5 0 0 1 5-5z" />
      <line x1="7" y1="16" x2="11" y2="16" />
    </svg>
  ),
  'fundraising-legal': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M9 3v12M5 7l4-4 4 4" /><path d="M5 13h8" />
    </svg>
  ),
  'web-development': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="3" width="14" height="12" rx="1.5" /><path d="M2 6.5h14" />
      <path d="M6 10l-1.5 1.5L6 13M10 10l1.5 1.5L10 13" />
    </svg>
  ),
  'app-development': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="5" y="1.5" width="8" height="15" rx="1.5" /><line x1="8" y1="14" x2="10" y2="14" />
    </svg>
  ),
  'cloud-infrastructure': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13a3 3 0 0 1 .3-6 4 4 0 0 1 7.6 1.3A2.6 2.6 0 0 1 12.6 13H5z" />
    </svg>
  ),
  'ai-automation': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="10" height="8" rx="2" /><circle cx="7" cy="9" r="0.8" fill="currentColor" />
      <circle cx="11" cy="9" r="0.8" fill="currentColor" /><path d="M9 5V2M6 2h6" />
    </svg>
  ),
  'cybersecurity': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2l6 2.5v4c0 4-2.5 6.5-6 7.5-3.5-1-6-3.5-6-7.5v-4L9 2z" />
      <path d="M6.5 9l1.8 1.8L11.5 7" />
    </svg>
  ),
  'enterprise-software-saas': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="14" height="10" rx="1.5" /><line x1="2" y1="7.5" x2="16" y2="7.5" />
      <line x1="5" y1="11" x2="9" y2="11" />
    </svg>
  ),
  'it-consulting-strategy': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6.5" /><path d="M9 5.5v4l2.5 1.5" />
    </svg>
  ),
  'devops-qa-testing': (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l3 3-3 3M9 10h5" />
      <path d="M11 4l3 10" />
    </svg>
  ),
};

function getSubCatIcon(slug: string) {
  return SUB_CAT_ICONS[slug] ?? (
    <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="9" r="6" />
    </svg>
  );
}

// ─── Filter sidebar ───────────────────────────────────────────────────────────
const STAGES = [
  { value: 'idea',   label: 'Idea Stage' },
  { value: 'mvp',    label: 'MVP Stage' },
  { value: 'early',  label: 'Early Stage' },
  { value: 'growth', label: 'Growth Stage' },
  { value: 'scale',  label: 'Scale Stage' },
];

const SORT_OPTIONS = [
  { value: 'top_rated',  label: 'Top Rated' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const BUDGET_OPTIONS = [
  { label: 'All Budgets',   min: undefined, max: undefined },
  { label: 'Under ₹5,000',  min: undefined, max: 5000 },
  { label: '₹5,000–₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000–₹50,000', min: 15000, max: 50000 },
  { label: '₹50,000+',     min: 50000, max: undefined },
];

type FilterState = {
  stages: string[];
  sort: string;
  budgetIdx: number;
  location: string;
};

function FilterSidebarContent({
  filters,
  setFilters,
  subCategories,
  activeSubCat,
  setActiveSubCat,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  subCategories: { slug: string; name: string; provider_count: number }[];
  activeSubCat: string;
  setActiveSubCat: (s: string) => void;
}) {
  const toggleStage = (v: string) => {
    const next = filters.stages.includes(v)
      ? filters.stages.filter(s => s !== v)
      : [...filters.stages, v];
    setFilters({ ...filters, stages: next });
  };

  const reset = () =>
    setFilters({ stages: [], sort: 'top_rated', budgetIdx: 0, location: '' });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-gray-800">Filter Providers</span>
        <button onClick={reset}
          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-500">
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Startup Stage */}
      <div>
        <p className="text-[12px] font-semibold text-gray-700 mb-2">Startup Stage</p>
        <div className="space-y-1.5">
          {STAGES.map(s => (
            <label key={s.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.stages.includes(s.value)}
                onChange={() => toggleStage(s.value)}
                className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-[12px] text-gray-600">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Service Type (sub-categories) */}
      {subCategories.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold text-gray-700 mb-2">Service Type</p>
          <div className="space-y-1.5">
            {subCategories.map(sc => (
              <label key={sc.slug} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeSubCat === sc.slug}
                  onChange={() => setActiveSubCat(activeSubCat === sc.slug ? '' : sc.slug)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <span className="text-[12px] text-gray-600">{sc.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      <div>
        <p className="text-[12px] font-semibold text-gray-700 mb-2">Location</p>
        <div className="relative">
          <select
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            className="w-full appearance-none text-[12px] bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 text-gray-600 focus:outline-none focus:border-blue-400"
          >
            <option value="">All Locations</option>
            <option value="Delhi">Delhi, India</option>
            <option value="Mumbai">Mumbai, India</option>
            <option value="Bangalore">Bangalore, India</option>
            <option value="Chennai">Chennai, India</option>
            <option value="Hyderabad">Hyderabad, India</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <p className="text-[12px] font-semibold text-gray-700 mb-2">Budget Range</p>
        <div className="relative">
          <select
            value={filters.budgetIdx}
            onChange={e => setFilters({ ...filters, budgetIdx: Number(e.target.value) })}
            className="w-full appearance-none text-[12px] bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 text-gray-600 focus:outline-none focus:border-blue-400"
          >
            {BUDGET_OPTIONS.map((b, i) => (
              <option key={i} value={i}>{b.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>
      </div>

      {/* Sort by */}
      <div>
        <p className="text-[12px] font-semibold text-gray-700 mb-2">Sort by</p>
        <div className="relative">
          <select
            value={filters.sort}
            onChange={e => setFilters({ ...filters, sort: e.target.value })}
            className="w-full appearance-none text-[12px] bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 text-gray-600 focus:outline-none focus:border-blue-400"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>
      </div>

      {/* Apply button */}
      <button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-medium py-2.5 rounded-xl transition-colors">
        Apply Filters
      </button>
    </div>
  );
}

function FilterSidebar(props: Parameters<typeof FilterSidebarContent>[0]) {
  return (
    <aside className="w-[220px] shrink-0 hidden lg:block">
      <div className="sticky top-24">
        <FilterSidebarContent {...props} />
      </div>
    </aside>
  );
}

// ─── Mobile filter drawer ──────────────────────────────────────────────────────
function MobileFilterDrawer({
  open,
  onClose,
  ...rest
}: { open: boolean; onClose: () => void } & Parameters<typeof FilterSidebarContent>[0]) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[85%] max-w-[320px] bg-gray-50 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-semibold text-gray-900">Filters</span>
          <button onClick={onClose} className="text-[12px] text-gray-500 px-2 py-1">Close</button>
        </div>
        <FilterSidebarContent {...rest} />
        <button
          onClick={onClose}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium py-2.5 rounded-xl transition-colors"
        >
          Show Results
        </button>
      </div>
    </div>
  );
}

// ─── Right sidebar ────────────────────────────────────────────────────────────
function RightSidebar({
  categoryName,
  categoryDescription,
  popularSearches,
}: {
  categoryName: string;
  categoryDescription: string;
  popularSearches: string[];
}) {
  return (
    <aside className="w-[240px] shrink-0 hidden xl:block space-y-4">

      {/* About category */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-[13px] font-semibold text-gray-800 mb-1.5">
          About {categoryName}
        </h3>
        <p className="text-[12px] text-gray-500 leading-relaxed">
          {categoryDescription || `Find the best ${categoryName.toLowerCase()} providers for your startup.`}
        </p>
        <button className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:text-blue-500">
          Learn more <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Need help choosing */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-[13px] font-semibold text-gray-800 mb-1">
          Need Help Choosing?
        </h3>
        <p className="text-[12px] text-gray-500 mb-3">
          Talk to our team and get personalized recommendations for your startup.
        </p>
        <button className="w-full flex items-center justify-center gap-1.5 border border-gray-300 rounded-xl py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Phone className="h-3.5 w-3.5 text-blue-500" />
          Get Free Guidance
        </button>
      </div>

      {/* Popular searches */}
      {popularSearches.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-[13px] font-semibold text-gray-800 mb-2.5">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map(s => (
              <span key={s}
                className="text-[11px] text-gray-600 bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-gray-200 transition-colors">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Can't find */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-[13px] font-semibold text-gray-800 mb-1">
          Can't find what you need?
        </h3>
        <p className="text-[12px] text-gray-500 mb-3">
          Post a request and let providers come to you.
        </p>
        <button className="w-full flex items-center justify-center gap-1.5 border border-dashed border-blue-300 rounded-xl py-2 text-[12px] font-medium text-blue-600 hover:bg-blue-50 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Post a Requirement
        </button>
      </div>
    </aside>
  );
}

// ─── Provider card — thrust-forward + macOS liquid hover, mobile-stacked ──────
function ProviderCard({ provider }: { provider: ReturnType<typeof useServiceProviders>['data'] extends (infer T)[] | undefined ? T : never }) {
  const [saved, setSaved] = useState(false);
  const sendInquiry = useSendServiceInquiry();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setTilt({
      x: ((cy / rect.height) - 0.5) * -10,
      y: ((cx / rect.width) - 0.5) * 10,
    });
    setGlowPos({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  const handleBook = () => {
    sendInquiry.mutate(
      { providerId: provider.id, message: 'I would like to book a consultation.' },
      {
        onSuccess: () => toast.success(`Consultation request sent to ${provider.name}`),
        onError:   () => toast.error('Failed to send. Please try again.'),
      }
    );
  };

  return (
    <div style={{ perspective: '900px' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative bg-white rounded-xl overflow-hidden"
        style={{
          border: '1px solid #e5e7eb',
          transform: hovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(14px) scale(1.015)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          transition: hovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out'
            : 'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease-out',
          boxShadow: hovered
            ? '0 20px 60px -8px rgba(0,0,0,0.16), 0 8px 20px -4px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)'
            : '0 1px 3px rgba(0,0,0,0.05)',
          willChange: 'transform',
        }}
      >
        {/* macOS liquid glow */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl z-10"
            style={{
              background: `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Single grey top border accent */}
        <div className="h-px w-full bg-gray-200" />

        <div className="p-4 sm:p-5">

          {/* Top block: logo + name/rating/tags/meta (always a row), save button pinned top-right */}
          <div className="flex gap-3 sm:gap-4">
            <ProviderLogo name={provider.name} logoUrl={provider.logo_url} />

            <div className="flex-1 min-w-0">
              {/* Name row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-[14px] font-semibold text-gray-900 leading-snug">
                    {provider.name}
                  </h3>
                  {provider.is_verified && <VerifiedBadge />}
                  {provider.is_top_rated && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-orange-50 text-orange-500 border border-orange-200 rounded-full">
                      Top Rated
                    </span>
                  )}
                </div>

                {/* Save button — visible here on mobile only */}
                <button onClick={() => setSaved(s => !s)}
                  className={`p-1.5 rounded-lg border transition-colors shrink-0 sm:hidden ${saved ? 'border-rose-300 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <Heart className={`h-4 w-4 ${saved ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Rating row */}
              {Number(provider.rating) > 0 && (
                <div className="flex items-center whitespace-nowrap gap-1.5 mt-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[12px] font-medium text-gray-700">{provider.rating}</span>
                  <span className="text-[12px] text-gray-400">({provider.review_count} reviews)</span>
                </div>
              )}

              {/* Tagline */}
              {provider.tagline && (
                <p className="text-[12px] text-gray-500 mt-1.5 line-clamp-2">{provider.tagline}</p>
              )}

              {/* Service tags */}
              {provider.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {provider.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[11px] px-2.5 py-[3px] bg-gray-100 text-gray-600 border border-gray-200 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {provider.tags.length > 3 && (
                    <span className="text-[11px] px-2.5 py-[3px] bg-gray-100 text-gray-500 border border-gray-200 rounded-full">
                      +{provider.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5">
                {provider.stage_focus_label && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                    <Users className="h-3 w-3" />{provider.stage_focus_label}
                  </span>
                )}
                {provider.startups_served > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                    <Users className="h-3 w-3" />{provider.startups_served}+ Startups Served
                  </span>
                )}
                {provider.location && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                    <MapPin className="h-3 w-3" />{provider.location}
                  </span>
                )}
              </div>
            </div>

            {/* Desktop-only right column: save + price, buttons separated below */}
            <div className="hidden sm:flex flex-col items-end shrink-0 gap-2 min-w-[130px]">
              <button onClick={() => setSaved(s => !s)}
                className={`p-1.5 rounded-lg border transition-colors ${saved ? 'border-rose-300 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <Heart className={`h-4 w-4 ${saved ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
              </button>

              {provider.starting_price && (
                <div className="text-right flex items-center justify-center gap-1 whitespace-nowrap">
                  <p className="text-[10px] text-gray-400">Starting from</p>
                  <p className="text-[15px] font-bold text-gray-900">
                    ₹{Number(provider.starting_price).toLocaleString('en-IN')}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-1.5 w-full mt-auto">
                <Link to={`/network/provider/${provider.slug}`}
                  className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium py-2 rounded-xl transition-colors">
                  View Profile
                </Link>
                <button
                  onClick={handleBook}
                  disabled={sendInquiry.isPending}
                  className="w-full text-center border border-gray-300 hover:bg-gray-50 text-gray-700 text-[12px] font-medium py-2 rounded-xl transition-colors disabled:opacity-60">
                  Book Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Mobile-only bottom bar: price + full-width action buttons below content */}
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
            {provider.starting_price && (
              <div className="flex items-baseline gap-1 mb-2">
                <p className="text-[10px] text-gray-400">Starting from</p>
                <p className="text-[15px] font-bold text-gray-900">
                  ₹{Number(provider.starting_price).toLocaleString('en-IN')}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Link to={`/network/provider/${provider.slug}`}
                className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium py-2.5 rounded-xl transition-colors">
                View Profile
              </Link>
              <button
                onClick={handleBook}
                disabled={sendInquiry.isPending}
                className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-gray-700 text-[12px] font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60">
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 animate-pulse">
      <div className="flex gap-3 sm:gap-4">
        <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-gray-100 rounded-full" />
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2 min-w-[130px]">
          <div className="h-8 w-8 bg-gray-100 rounded-lg" />
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="h-9 w-full bg-gray-200 rounded-xl mt-auto" />
          <div className="h-9 w-full bg-gray-100 rounded-xl" />
        </div>
      </div>
      <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 flex gap-2">
        <div className="h-9 flex-1 bg-gray-200 rounded-xl" />
        <div className="h-9 flex-1 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ServiceCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubCat = searchParams.get('sub') ?? '';
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    stages: [], sort: 'top_rated', budgetIdx: 0, location: '',
  });

  const { data: categories = [] } = useServiceCategories();
  const category = categories.find(c => c.slug === slug);

  const budget = BUDGET_OPTIONS[filters.budgetIdx];
  const providerParams: ProviderFilterParams = {
    category: slug,
    sub_category: activeSubCat || undefined,
    search: search || undefined,
    stage: filters.stages.length === 1 ? filters.stages[0] : undefined,
    min_price: budget.min,
    max_price: budget.max,
    sort: filters.sort as ProviderFilterParams['sort'],
  };

  const { data: providers = [], isLoading } = useServiceProviders(providerParams);

  const subCategories = category?.sub_categories ?? [];

  // Popular searches — derived from tags across visible providers
  const popularSearches = useMemo(() => {
    const all: string[] = [];
    providers.forEach(p => p.tags?.forEach(t => all.push(t)));
    const freq: Record<string, number> = {};
    all.forEach(t => { freq[t] = (freq[t] ?? 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([t]) => t);
  }, [providers]);

  const filterSidebarProps = {
    filters,
    setFilters,
    subCategories,
    activeSubCat,
    setActiveSubCat: (s: string) => setSearchParams(s ? { sub: s } : {}),
  };

  return (
    <AppLayout showMobileHeader title={category?.name ?? 'Services'} showBottomNav>
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 py-5 md:py-6">

        {/* Breadcrumb */}
        <nav className="flex justify-start items-center gap-2 text-[12px] text-gray-400 mb-4 overflow-x-auto whitespace-nowrap">
          <span><Link to="/" className="hover:text-gray-600">Home</Link></span>
          <span>›</span>
          <span><Link to="/network/services" className="hover:text-gray-600">Services</Link></span>
          <span>›</span>
          <span className="text-blue-600 font-medium">{category?.name ?? slug}</span>
        </nav>

        {/* Category hero banner */}
        {category && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-5 flex items-center gap-4 sm:gap-5">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 p-2.5 sm:p-3">
              {getCategoryIcon(category.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[18px] sm:text-[22px] font-bold text-gray-900">{category.name}</h1>
              <p className="text-[12px] sm:text-[13px] text-gray-500 mt-0.5">{category.description}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 sm:gap-5 mt-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] text-gray-600">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                  {category.provider_count}+ Verified Providers
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] text-gray-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  4.8 Avg. Rating
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] text-gray-600">
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  10K+ Startups Served
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sub-category tabs */}
        {subCategories.length > 0 && (
          <div className="mb-5">
            <p className="text-[13px] font-semibold text-gray-700 mb-3">
              What do you need help with?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {subCategories.map(sc => (
                <button
                  key={sc.slug}
                  onClick={() => setSearchParams(activeSubCat === sc.slug ? {} : { sub: sc.slug })}
                  className={`flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl border text-center transition-all ${
                    activeSubCat === sc.slug
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className={activeSubCat === sc.slug ? 'text-blue-600' : 'text-gray-500'}>
                    {getSubCatIcon(sc.slug)}
                  </span>
                  <span className="text-[11px] font-medium leading-snug">{sc.name}</span>
                  <span className="text-[10px] text-gray-400">{sc.provider_count} providers</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3-column layout: filter | providers | right sidebar */}
        <div className="flex gap-5">

          {/* Left filter sidebar — desktop only */}
          <FilterSidebar {...filterSidebarProps} />

          {/* Provider list */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="text-[13px] text-gray-500 order-1">
                Showing <span className="font-medium text-gray-800">{providers.length}</span> providers
                {activeSubCat && (
                  <> for <span className="font-medium text-gray-800">
                    "{subCategories.find(s => s.slug === activeSubCat)?.name ?? activeSubCat}"
                  </span></>
                )}
              </p>

              <div className="flex items-center gap-2 order-3 sm:order-2 w-full sm:w-auto">
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search providers…"
                    className="pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 w-44"
                  />
                </div>

                {/* Mobile filter trigger */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1 text-[12px] border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700"
                >
                  Filters
                </button>

                <div className="flex items-center gap-1 flex-1 sm:flex-initial">
                  <span className="hidden sm:inline text-[12px] text-gray-500 mr-1">Sort by:</span>
                  <select
                    value={filters.sort}
                    onChange={e => setFilters({ ...filters, sort: e.target.value })}
                    className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-blue-400 flex-1 sm:flex-initial"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex border border-gray-200 rounded-lg overflow-hidden shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className={viewMode === 'list'
              ? 'space-y-3'
              : 'grid grid-cols-1 sm:grid-cols-2 gap-3'
            }>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
                : providers.map(p => <ProviderCard key={p.id} provider={p} />)
              }
            </div>

            {/* Empty state */}
            {!isLoading && providers.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <ClipboardList className="h-10 w-10 text-gray-200" />
                <p className="text-sm text-gray-400 font-medium">No providers found</p>
                <p className="text-xs text-gray-300">Try adjusting your filters or check back soon.</p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <RightSidebar
            categoryName={category?.name ?? ''}
            categoryDescription={category?.description ?? ''}
            popularSearches={popularSearches}
          />
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        {...filterSidebarProps}
      />
    </AppLayout>
  );
}