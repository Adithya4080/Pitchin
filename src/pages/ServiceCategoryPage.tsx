import { useState, useMemo, useRef, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  Star, ShieldCheck, MapPin, Users, Grid3X3,
  List, ChevronDown, RotateCcw, Plus, Phone, ClipboardList,
  Search, ArrowRight, SlidersHorizontal,
} from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { ServicesLeftSidebar, ServicesTopBar } from '@/components/network/ServicesLeftSidebar';
import { useServiceCategories, useServiceProviders, useServiceProvider } from '@/hooks/useServices';
import { useSendServiceInquiry } from '@/hooks/useServices';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { ProviderFilterParams } from '@/api/services';
import { toast } from 'sonner';

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
        loading="lazy"
        decoding="async"
        width={72}
        height={72}
        className="w-12 h-12 sm:w-[72px] sm:h-[72px] rounded-xl object-cover shrink-0 border border-gray-200"
      />
    );
  }
  return (
    <div className={`w-12 h-12 sm:w-[72px] sm:h-[72px] rounded-xl ${bg} flex items-center justify-center text-white text-sm sm:text-lg font-bold shrink-0`}>
      {initials}
    </div>
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
    <aside className="w-[240px] shrink-0 hidden xl:block space-y-4 sticky top-24 self-start">

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

// ─── Provider card — no save/heart button, matches reference exactly ─────────
function ProviderCard({ provider }: { provider: ReturnType<typeof useServiceProviders>['data'] extends (infer T)[] | undefined ? T : never }) {
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
    <div style={{ perspective: '900px' }} className="sm:h-[156px]">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative bg-white rounded-none overflow-hidden sm:h-[156px] border-r border-b border-gray-200"
        style={{
          // transform: hovered
          //   ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(14px) scale(1.015)`
          //   : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          // transition: hovered
          //   ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out'
          //   : 'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease-out',
          boxShadow: hovered
            ? '0 20px 60px -8px rgba(0,0,0,0.16), 0 8px 20px -4px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)'
            : '0 1px 3px rgba(0,0,0,0.05)',
          willChange: 'transform',
          zIndex: hovered ? 1 : 0,
        }}
      >
        {/* macOS liquid glow */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-none z-10"
            style={{
              background: `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}

        <div className="p-4 sm:p-5 sm:h-full sm:flex sm:flex-col sm:justify-center">

          {/* Top block: logo + name/rating/tags/meta, price + buttons pinned right on desktop */}
          <div className="flex gap-3 sm:gap-4">
            <ProviderLogo name={provider.name} logoUrl={provider.logo_url} />

            <div className="flex-1 min-w-0">
              {/* Name row — name, verified badge, and Top Rated all in one line */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-[14px] font-semibold text-gray-900 leading-snug truncate max-w-[180px]">
                  {provider.name}
                </h3>
                {provider.is_verified && <VerifiedBadge />}
                {provider.is_top_rated && (
                  <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 bg-orange-50 text-orange-500 border border-orange-200 rounded-full">
                    Top Rated
                  </span>
                )}
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
                <p className="hidden sm:block text-[12px] text-gray-500 mt-1 leading-relaxed truncate">{provider.tagline}</p>
              )}

              {/* Service tags */}
              {provider.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {provider.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[11px] px-2.5 py-[3px] bg-gray-100 text-gray-600 border border-gray-200 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {provider.tags.slice(2, 3).map(tag => (
                    <span key={tag} className="hidden sm:inline-block text-[11px] px-2.5 py-[3px] bg-gray-100 text-gray-600 border border-gray-200 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {provider.tags.length > 2 && (
                    <span className="sm:hidden text-[11px] px-2.5 py-[3px] bg-gray-100 text-gray-500 border border-gray-200 rounded-full">
                      +{provider.tags.length - 2} more
                    </span>
                  )}
                  {provider.tags.length > 3 && (
                    <span className="hidden sm:inline-block text-[11px] px-2.5 py-[3px] bg-gray-100 text-gray-500 border border-gray-200 rounded-full">
                      +{provider.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Meta row */}
              <div className="hidden sm:flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
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

            {/* Desktop-only right column: price + stacked buttons */}
            <div className="hidden sm:flex flex-col items-end shrink-0 gap-2 min-w-[130px]">
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
                  className="w-full justify-center text-center bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium py-2 rounded-xl transition-colors">
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
          <div className="sm:hidden mt-4 pt-3 border-t border-gray-100">
            {/* {provider.starting_price && (
              <div className="flex items-baseline gap-1 mb-2.5">
                <p className="text-[10px] text-gray-400">Starting from</p>
                <p className="text-[15px] font-bold text-gray-900">
                  ₹{Number(provider.starting_price).toLocaleString('en-IN')}
                </p>
              </div>
            )} */}
            <div className="flex gap-2">
              <Link to={`/network/provider/${provider.slug}`}
                className="flex-1 justify-center text-center bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium py-2.5 rounded-xl transition-colors">
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
    <div className="bg-white border-r border-b border-gray-200 rounded-none p-4 sm:p-5 animate-pulse sm:h-[156px]">
      <div className="flex gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-[72px] sm:h-[72px] rounded-xl bg-gray-200 shrink-0" />
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

  const debouncedSearch = useDebouncedValue(search, 400);

  const budget = BUDGET_OPTIONS[filters.budgetIdx];
  const providerParams: ProviderFilterParams = {
    category: slug,
    sub_category: activeSubCat || undefined,
    search: debouncedSearch || undefined,
    stage: filters.stages.length === 1 ? filters.stages[0] : undefined,
    min_price: budget.min,
    max_price: budget.max,
    sort: filters.sort as ProviderFilterParams['sort'],
  };

  const { data: providers = [], isLoading, isFetching } = useServiceProviders(providerParams);
  const showSkeleton = isLoading || isFetching;

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
      <div className="max-w-[1400px] mx-auto">
        {/* Mobile/tablet sticky nav bar — same as network page */}
        <ServicesTopBar />

        <div className="px-4 md:px-6 py-4 md:py-6">

          {/* Breadcrumb */}
          <nav className="flex justify-start items-center gap-2 text-[12px] text-gray-400 mb-4 overflow-x-auto whitespace-nowrap">
            <span><Link to="/" className="hover:text-gray-600">Home</Link></span>
            <span>›</span>
            <span><Link to="/network/services" className="hover:text-gray-600">Services</Link></span>
            <span>›</span>
            <span className="text-blue-600 font-medium">{category?.name ?? slug}</span>
          </nav>

          {/* 4-column layout: nav rail | filters | providers | right sidebar */}
          <div className="flex gap-3 md:gap-4 lg:gap-5 items-start">

            {/* Left nav rail — same Discover / My Space sections as the network page */}
            {/* <ServicesLeftSidebar /> */}

            {/* Filter sidebar — desktop only */}
            <FilterSidebar {...filterSidebarProps} />

            {/* Provider list */}
            <div className="flex-1 min-w-0">

              {/* Toolbar */}
              <div className="mb-4">
                <p className="text-[13px] text-gray-500 mb-2.5">
                  Showing <span className="font-medium text-gray-800">{providers.length}</span> providers
                  {activeSubCat && (
                    <> for <span className="font-medium text-gray-800">
                      "{subCategories.find(s => s.slug === activeSubCat)?.name ?? activeSubCat}"
                    </span></>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search providers…"
                      className="pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 w-52"
                    />
                  </div>

                  {/* Mobile filter trigger */}
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center justify-center gap-1.5 text-[12px] font-medium border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 shrink-0"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">Filters</span>
                  </button>

                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="hidden sm:inline text-[12px] text-gray-500 shrink-0">Sort by:</span>
                    <select
                      value={filters.sort}
                      onChange={e => setFilters({ ...filters, sort: e.target.value })}
                      className="text-[12px] border border-gray-200 rounded-lg pl-2 pr-6 py-2 bg-white text-gray-700 focus:outline-none focus:border-blue-400 w-full min-w-0"
                    >
                      {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex border border-gray-200 rounded-lg overflow-hidden shrink-0">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className={viewMode === 'list'
                ? 'flex flex-col border-t border-l border-gray-200'
                : 'grid grid-cols-1 sm:grid-cols-2 border-t border-l border-gray-200'
              }>
                {showSkeleton
                  ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
                  : providers.map(p => <ProviderCard key={p.id} provider={p} />)
                }
              </div>

              {/* View more */}
              {!showSkeleton && providers.length > 0 && (
                <div className="flex justify-center mt-5">
                  <Link
                    to={`/network/services?view=all${slug ? `` : ''}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    View more providers <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {/* Empty state */}
              {!showSkeleton && providers.length === 0 && (
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