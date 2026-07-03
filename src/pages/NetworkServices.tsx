import { useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutGrid, Phone, ClipboardList, Heart,
  ArrowRight, Star, Search, ShieldCheck,
  MapPin, ExternalLink, Bookmark, Zap, TrendingUp,
} from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { ServicesLeftSidebar, ServicesTopBar } from '@/components/network/ServicesLeftSidebar';
import { ServiceHeroBanner } from '@/components/network/ServiceHeroBanner';
import { ServiceCategoryGrid } from '@/components/network/ServiceCategoryGrid';
import { NetworkingOpportunitiesSection } from '@/components/network/NetworkingOpportunitiesSection';
import { useServiceProviders, useServiceCategories } from '@/hooks/useServices';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

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
    <div className="relative overflow-hidden rounded-2xl shadow-sm">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #fdfdfd 0%, #ffffff 100%)' }} />
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const initials = p.name.split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setTilt({ x: ((cy / rect.height) - 0.5) * -10, y: ((cx / rect.width) - 0.5) * 10 });
    setGlowPos({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  return (
    <div style={{ perspective: '900px' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group relative bg-white rounded-2xl overflow-hidden"
        style={{
          border: hovered ? '1px solid #d1d5db' : '1px solid #f3f4f6',
          transform: hovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(14px) scale(1.015)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          transition: hovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out'
            : 'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease-out, border-color 0.45s ease-out',
          boxShadow: hovered
            ? '0 20px 60px -8px rgba(0,0,0,0.16), 0 8px 20px -4px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)'
            : '0 1px 3px rgba(0,0,0,0.05)',
          willChange: 'transform',
        }}
      >
        {hovered && (
          <div className="absolute inset-0 pointer-events-none rounded-2xl z-10"
            style={{
              background: `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}
        <div className={`h-1 w-full bg-gradient-to-r ${getCategoryGradient(p.category_name)} opacity-60 group-hover:opacity-100 transition-opacity duration-200`} />
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            {p.logo_url
              ? <img src={p.logo_url} alt={p.name} loading="lazy" decoding="async" width={44} height={44} className="h-11 w-11 rounded-xl object-cover shrink-0 border border-gray-100" />
              : <div className="h-11 w-11 rounded-xl bg-gray-950 flex items-center justify-center text-white text-sm font-bold shrink-0">{initials}</div>
            }
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-bold text-gray-900 truncate">{p.name}</p>
                {p.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
              </div>
              <p className="text-[11px] text-gray-400 font-semibold">{p.category_name}</p>
              {p.location && (
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-300 mt-0.5">
                  <MapPin className="h-3 w-3" />{p.location}
                </span>
              )}
            </div>
          </div>
          {p.tagline && <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">{p.tagline}</p>}
          {Number(p.rating) > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[12px] font-bold text-gray-700">{p.rating}</span>
              <span className="text-[11px] text-gray-300">({p.review_count})</span>
            </div>
          )}
          <div className="flex gap-2 mt-auto">
            <Link to={`/network/services/${p.category_slug}`}
              className="flex-1 text-center text-[12px] font-bold bg-gray-950 hover:bg-gray-800 text-white py-2.5 rounded-xl transition-colors"
            >View Profile</Link>
            {p.website && (
              <a href={p.website} target="_blank" rel="noreferrer"
                className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── All Providers browse ─────────────────────────────────────────────────────
function AllProvidersView() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const { data: categories = [] } = useServiceCategories();
  const { data: providers = [], isLoading } = useServiceProviders({
    category: activeCategory || undefined,
    search: debouncedSearch || undefined,
    sort: 'top_rated',
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">All Service Providers</h2>
          <p className="text-[13px] text-gray-400 mt-0.5">Browse vetted providers across every category.</p>
        </div>
        <Link to="/network/services" className="text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-colors">← Back</Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search providers…"
          className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-400 placeholder:text-gray-300"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setActiveCategory('')}
          className={`text-[12px] font-bold px-3.5 py-1.5 rounded-full border transition-all ${
            !activeCategory ? 'bg-gray-950 text-white border-gray-950' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >All</button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(activeCategory === c.slug ? '' : c.slug)}
            className={`text-[12px] font-bold px-3.5 py-1.5 rounded-full border transition-all ${
              activeCategory === c.slug ? 'bg-gray-950 text-white border-gray-950' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >{c.name}</button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-gray-50 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && providers.length === 0 && (
        <p className="text-[13px] text-gray-400 py-12 text-center">No providers found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {providers.map(p => <ProviderMiniCard key={p.id} provider={p} />)}
      </div>
    </div>
  );
}

// ─── Right sidebar ─────────────────────────────────────────────────────────────
function RightSidebar() {
  return (
    <aside className="w-[240px] shrink-0 hidden xl:flex flex-col gap-3 sticky top-20 self-start">
      <QuickActionsPanel />
      <ProviderCTACard />
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NetworkServices() {
  const [searchParams] = useSearchParams();
  const isViewAll = searchParams.get('view') === 'all';

  return (
    <AppLayout showMobileHeader title="Services" showBottomNav>
      <div className="max-w-[1400px] mx-auto">
        {/* Mobile/tablet sticky nav bar — lives above the flex row, full width */}
        <ServicesTopBar />

        <div className="px-4 md:px-6 py-4 md:py-8">
          <div className="flex gap-3 md:gap-4 lg:gap-5 items-start">
            {/* Left sidebar: icon-rail on md, full panel on lg+ */}
            <ServicesLeftSidebar />

            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-6 md:space-y-8">
              {isViewAll ? (
                <AllProvidersView />
              ) : (
                <>
                  <ServiceHeroBanner />
                  <ServiceCategoryGrid />
                  <NetworkingOpportunitiesSection />
                  <TrustStrip />
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