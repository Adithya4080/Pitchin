import { useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutGrid, Phone, ClipboardList, Heart,
  ArrowRight, Star, Search, ShieldCheck,
  MapPin, Bookmark, Zap, TrendingUp, SlidersHorizontal, Check,
} from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { ServicesLeftSidebar, ServicesTopBar } from '@/components/network/ServicesLeftSidebar';
import { ServiceHeroBanner } from '@/components/network/ServiceHeroBanner';
import { ServiceCategoryGrid } from '@/components/network/ServiceCategoryGrid';
import { NetworkingOpportunitiesSection } from '@/components/network/NetworkingOpportunitiesSection';
import { useServiceProviders, useServiceCategories } from '@/hooks/useServices';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ProfileStrengthCard } from '@/components/profile/ProfileStrengthCard';
import { useMyProfile } from '@/hooks/useRoleProfile';
import { useUserPitches } from '@/hooks/usePitches';
import { NetworkingForOpportunitySection } from '@/components/network/OpportunitiesAndSurveysSection';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// ─── Quick Actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: LayoutGrid, color: '#2563EB', bg: '#EFF6FF', label: 'Post a Requirement', sub: 'Get custom proposals', to: '/coming-soon' },
  { icon: Phone,       color: '#059669', bg: '#ECFDF5', label: 'Book a Call',         sub: 'Schedule with experts', to: '/coming-soon' },
  { icon: ClipboardList, color: '#EA580C', bg: '#FFF7ED', label: 'My Requests',       sub: 'Track submissions',    to: '/coming-soon' },
  { icon: Heart,       color: '#DB2777', bg: '#FDF2F8', label: 'Saved Providers',     sub: 'Your saved list',      to: '/coming-soon' },
];

function QuickActionsPanel() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)]">
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">Quick Actions</p>
      </div>
      <div className="p-2">
        {QUICK_ACTIONS.map(a => {
          const Icon = a.icon;
          return (
            <Link key={a.label} to={a.to}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <span className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: a.bg }}>
                <Icon className="h-4 w-4" style={{ color: a.color }} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-gray-800 leading-none group-hover:text-gray-900">{a.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{a.sub}</p>
              </div>
              <ArrowRight className="h-3 w-3 text-gray-200 group-hover:text-gray-400 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Activity feed widget ──────────────────────────────────────────────────────
const ACTIVITY = [
  { text: 'Arjun S. connected with a Legal advisor', time: '2m ago' },
  { text: 'New accelerator joined: Antler India', time: '15m ago' },
  { text: 'Priya M. booked a mentorship call', time: '1h ago' },
  { text: '3 new Design providers listed', time: '2h ago' },
];

// ─── Provider CTA ─────────────────────────────────────────────────────────────
function ProviderCTACard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)]">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #fdfdfd 0%, #ffffff 100%)' }} />
      {/* <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div> */}
      <div className="relative p-4">
        <div className="h-8 w-8 rounded-lg text-black flex items-center justify-center mb-3">
        </div>
        <p className="text-[13px] font-bold text-black leading-snug mb-1">List Your Services</p>
        <p className="text-[11px] text-black leading-relaxed mb-4">
          Get discovered by thousands of founders.
        </p>
        <Link to="/contact"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#0950c3] text-white text-[12px] font-bold hover:bg-blue-400 transition-colors"
        >
          Apply to List <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ─── Trust strip ──────────────────────────────────────────────────────────────
const TRUST = [
  {
    num: '100%', label: 'Verified Providers', sub: 'Every provider reviewed before going live',
    icon: <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none"><circle cx="20" cy="20" r="18" fill="#EFF6FF"/><path d="M20 10l-8 4v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10v-6l-8-4z" stroke="#2563EB" strokeWidth="1.6" strokeLinejoin="round"/><path d="M15 20l3 3 6-6" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    num: '2 hrs', label: 'Avg Response Time', sub: 'Connect with experts, fast',
    icon: <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none"><circle cx="20" cy="20" r="18" fill="#F0FDF4"/><circle cx="20" cy="20" r="7" stroke="#16A34A" strokeWidth="1.6"/><path d="M20 16v4l2.5 2.5" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    num: 'Free', label: 'To Browse & Connect', sub: 'No hidden fees or paywalls',
    icon: <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none"><circle cx="20" cy="20" r="18" fill="#FFF7ED"/><path d="M14 22c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round"/><path d="M17 26h6M20 16v-2" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round"/><circle cx="20" cy="22" r="2" stroke="#F97316" strokeWidth="1.4"/></svg>,
  },
  {
    num: 'Daily', label: 'New Opportunities', sub: 'Fresh programs and connections',
    icon: <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none"><circle cx="20" cy="20" r="18" fill="#F5F3FF"/><path d="M13 27l4-8 4 4 3-6" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="27" cy="14" r="2" fill="#7C3AED"/></svg>,
  },
];
function TrustStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
      {TRUST.map(item => (
        <div key={item.label} className="flex flex-col items-start gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
          <div className="shrink-0">{item.icon}</div>
          <div>
            <p className="text-[15px] font-bold text-gray-900 leading-none">{item.num}</p>
            <p className="text-[12px] font-semibold text-gray-700 leading-snug mt-0.5">{item.label}</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-snug">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Category → gradient color map ───────────────────────────────────────────
const CATEGORY_GRADIENT: Record<string, string> = {
  'marketing':          'from-orange-400 to-rose-400',
  'design':             'from-pink-500 to-fuchsia-500',
  'designing':          'from-pink-500 to-fuchsia-500',
  'designing & branding': 'from-pink-500 to-fuchsia-500',
  'legal':              'from-red-400 to-rose-500',
  'legel':              'from-red-400 to-rose-500',
  'web development':    'from-blue-500 to-indigo-500',
  'web devolepment':    'from-blue-500 to-indigo-500',
  'technology':         'from-blue-500 to-indigo-500',
  'finance':            'from-emerald-400 to-teal-500',
  'accounting':         'from-emerald-400 to-teal-500',
  'book keeping':       'from-emerald-400 to-teal-500',
  'hr':                 'from-violet-400 to-purple-500',
  'documentation':      'from-cyan-400 to-sky-500',
};

function getCategoryGradient(categoryName: string): string {
  const key = categoryName?.toLowerCase().trim() ?? '';
  return CATEGORY_GRADIENT[key] ?? 'from-blue-500 to-indigo-500';
}

// ─── ProviderMiniCard — 3D tilt + liquid glow (matches ServiceCategoryPage) ───
type ProviderItem = {
  id: number; name: string; logo_url: string | null; is_verified: boolean;
  category_name: string; category_slug: string; location: string | null;
  tagline: string | null; rating: string | number; review_count: number; website: string | null;
};

function ProviderMiniCard({ provider: p }: { provider: ProviderItem }) {
  const [hovered, setHovered] = useState(false);
  const initials = p.name.split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-white border border-gray-200 rounded-sm overflow-hidden h-[196px] flex flex-col"
      style={{
        border: hovered ? '1px solid #d1d5db' : '1px solid #e5e7eb',
        boxShadow: hovered
          ? '0 12px 32px -8px rgba(0,0,0,0.12), 0 4px 12px -4px rgba(0,0,0,0.06)'
          : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'border-color 0.2s ease-out, box-shadow 0.2s ease-out',
      }}
    >
      <div className="p-3.5 flex flex-col gap-2 flex-1 min-h-0">
        {/* Logo + identity block */}
        <div className="flex items-start gap-2.5">
          {p.logo_url
            ? <img src={p.logo_url} alt={p.name} loading="lazy" decoding="async" width={48} height={48} className="h-12 w-12 rounded-xl object-cover shrink-0 border border-gray-100" />
            : <div className="h-12 w-12 rounded-xl bg-gray-950 flex items-center justify-center text-white text-sm font-bold shrink-0">{initials}</div>
          }
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-1.5">
              <p className="text-[13px] font-bold text-gray-900 truncate">{p.name}</p>
              {p.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
            </div>
            <p className="text-[11px] text-gray-400 font-semibold truncate mt-0.5">{p.category_name}</p>
            {p.location && (
              <span className="inline-flex items-center gap-1 text-[10.5px] text-gray-300 mt-0.5 truncate max-w-full">
                <MapPin className="h-2.5 w-2.5 shrink-0" /><span className="truncate">{p.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[11.5px] text-gray-500 leading-snug truncate">
          {p.tagline || '\u00A0'}
        </p>

        {/* Rating */}
        <div className="h-3.5 flex items-center gap-1">
          {Number(p.rating) > 0 && (
            <>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11.5px] font-bold text-gray-700">{p.rating}</span>
              <span className="text-[10.5px] text-gray-300">({p.review_count})</span>
            </>
          )}
        </div>

        {/* Button */}
        <Link to={`/network/services/${p.category_slug}`}
          className="mt-auto block text-center text-[11.5px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-xl transition-colors"
        >View Profile</Link>
      </div>
    </div>
  );
}

// ─── All Providers browse ─────────────────────────────────────────────────────
const CATEGORY_PILLS_COLLAPSED_COUNT = 6;

function FilterPanel({
  categories,
  activeCategory,
  setActiveCategory,
  showAllCategories,
  setShowAllCategories,
  onClose,
}: {
  categories: { id: number; slug: string; name: string }[];
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  showAllCategories: boolean;
  setShowAllCategories: (v: boolean) => void;
  onClose: () => void;
}) {
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, CATEGORY_PILLS_COLLAPSED_COUNT);
  const hasMoreCategories = categories.length > CATEGORY_PILLS_COLLAPSED_COUNT;

  return (
    <div className="w-72">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-bold text-gray-900">Filter by Category</p>
        {activeCategory && (
          <button
            onClick={() => setActiveCategory('')}
            className="text-[11px] font-semibold text-primary hover:text-primary/80"
          >Clear</button>
        )}
      </div>

      <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
        <label className="flex items-center gap-2.5 py-1.5 px-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
          <span className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
            !activeCategory ? 'bg-primary border-primary' : 'border-gray-300'
          }`}>
            {!activeCategory && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          </span>
          <input type="radio" name="category" className="sr-only" checked={!activeCategory} onChange={() => setActiveCategory('')} />
          <span className="text-[12.5px] text-gray-700 font-medium">All Categories</span>
        </label>
        {visibleCategories.map(c => (
          <label key={c.id} className="flex items-center gap-2.5 py-1.5 px-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
            <span className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
              activeCategory === c.slug ? 'bg-primary border-primary' : 'border-gray-300'
            }`}>
              {activeCategory === c.slug && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </span>
            <input type="radio" name="category" className="sr-only" checked={activeCategory === c.slug}
              onChange={() => setActiveCategory(activeCategory === c.slug ? '' : c.slug)} />
            <span className="text-[12.5px] text-gray-700 font-medium truncate">{c.name}</span>
          </label>
        ))}
      </div>

      {hasMoreCategories && (
        <button
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="mt-2 text-[12px] font-bold text-primary hover:text-primary/80 transition-colors"
        >
          {showAllCategories ? 'Show Less' : `Show More (${categories.length - CATEGORY_PILLS_COLLAPSED_COUNT})`}
        </button>
      )}

      <button
        onClick={onClose}
        className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-bold py-2.5 rounded-xl transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
}

function AllProvidersView() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 400);
  const { data: categories = [] } = useServiceCategories();
  const { data: providers = [], isLoading, isFetching } = useServiceProviders({
    category: activeCategory || undefined,
    search: debouncedSearch || undefined,
    sort: 'top_rated',
  });

  const showSkeleton = isLoading || isFetching;
  const activeCategoryName = categories.find(c => c.slug === activeCategory)?.name;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">All Service Providers</h2>
          <p className="text-[13px] text-gray-400 mt-0.5">Browse vetted providers across every category.</p>
        </div>
        <Link to="/network/services" className="text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-colors">← Back</Link>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search providers…"
            className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-400 placeholder:text-gray-300"
          />
        </div>

        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <button
              className={`inline-flex items-center gap-1.5 text-[12.5px] font-bold px-3.5 py-2.5 rounded-xl border transition-all ${
                activeCategory ? 'bg-primary/5 border-primary/30 text-primary' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter
              {activeCategory && <span className="h-4 min-w-4 px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">1</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-4">
            <FilterPanel
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              showAllCategories={showAllCategories}
              setShowAllCategories={setShowAllCategories}
              onClose={() => setFilterOpen(false)}
            />
          </PopoverContent>
        </Popover>

        {isFetching && !isLoading && (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
            <span className="h-3 w-3 rounded-full border-2 border-gray-300 border-t-primary animate-spin" />
            Filtering…
          </span>
        )}
      </div>

      {activeCategoryName && (
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-primary/20">
            {activeCategoryName}
            <button onClick={() => setActiveCategory('')} className="hover:text-primary/60">×</button>
          </span>
        </div>
      )}

      {showSkeleton && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[196px] rounded-2xl border border-gray-100 bg-gray-50 animate-pulse" />
          ))}
        </div>
      )}

      {!showSkeleton && providers.length === 0 && (
        <p className="text-[13px] text-gray-400 py-12 text-center">No providers found.</p>
      )}

      {!showSkeleton && providers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {providers.map(p => <ProviderMiniCard key={p.id} provider={p} />)}
        </div>
      )}
    </div>
  );
}

// ─── Profile strength widget — reuses the dashboard's ProfileStrengthCard ─────
// Pulls the signed-in user's own profile + pitches so the same completeness
// logic used on the Dashboard applies here too.
function MyProfileStrengthWidget() {
  const { data: profile } = useMyProfile();
  const { data: userPitches } = useUserPitches();

  if (!profile) return null;

  const p = profile as any;

  return (
    <ProfileStrengthCard
      bio={p.bio}
      hasIntroVideo={!!p.intro_video_url}
      hasFunding={!!(p.funding_data?.stage || p.funding_data?.amount_raised)}
      hasTraction={!!p.traction_data?.metrics?.length}
      hasTrustPress={!!p.trust_press_data?.proofs?.length}
      hasTeam={!!(p.team_members as any[])?.length}
      hasCompanyPortfolio={!!(p.ecosystem_support as any[])?.length}
      hasPitch={!!(userPitches && userPitches.length > 0)}
      className="rounded-2xl border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)]"
    />
  );
}

// ─── Right sidebar ─────────────────────────────────────────────────────────────
function RightSidebar() {
  return (
    <aside className="w-[240px] shrink-0 hidden xl:flex flex-col gap-3 sticky top-20 self-start">
      <QuickActionsPanel />
      <ProviderCTACard />
      <MyProfileStrengthWidget />
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NetworkServices() {
  const [searchParams] = useSearchParams();
  const isViewAll = searchParams.get('view') === 'all';

  return (
    <AppLayout showMobileHeader title="Services" showBottomNav mobileHeaderVariant="search">
      <div className="max-w-[1400px] mx-auto">
        {/* Mobile/tablet sticky nav bar — lives above the flex row, full width */}
        <ServicesTopBar />

        <div className="px-4 md:px-6 py-4 md:py-8">
          <div className="flex gap-3 md:gap-4 lg:gap-5 items-start">
            {/* Left sidebar: icon-rail on md, full panel on lg+ */}
            <ServicesLeftSidebar />

            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-6 ">
              {isViewAll ? (
                <AllProvidersView />
              ) : (
                <>
                  <ServiceHeroBanner />
                  <ServiceCategoryGrid />
                  <NetworkingOpportunitiesSection />
                  {/* <NetworkingForOpportunitySection /> */}
                  {/* <TrustStrip /> */}
                </>
              )}
            </div>

            {/* Right sidebar */}
            <RightSidebar />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}