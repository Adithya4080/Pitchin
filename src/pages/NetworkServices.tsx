import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutGrid, Phone, ClipboardList, Heart,
  ArrowRight, Star, Search, ShieldCheck,
  MapPin, ExternalLink, Bookmark, Zap, TrendingUp,
} from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { ServicesLeftSidebar,   } from '@/components/network/ServicesLeftSidebar';
import { ServiceHeroBanner } from '@/components/network/ServiceHeroBanner';
import { ServiceCategoryGrid } from '@/components/network/ServiceCategoryGrid';
import { NetworkingOpportunitiesSection } from '@/components/network/NetworkingOpportunitiesSection';
import { useServiceProviders, useServiceCategories } from '@/hooks/useServices';
import { AllProvidersView } from '@/components/network/AllProvidersView';

// ─── Quick Actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: LayoutGrid, color: '#2563EB', bg: '#EFF6FF', label: 'Post a Requirement', sub: 'Get custom proposals', to: '/coming-soon' },
  { icon: Phone,       color: '#059669', bg: '#ECFDF5', label: 'Book a Call',         sub: 'Schedule with experts', to: '/coming-soon' },
  { icon: ClipboardList, color: '#EA580C', bg: '#FFF7ED', label: 'My Requests',       sub: 'Track submissions',    to: '/coming-soon' },
  { icon: Heart,       color: '#DB2777', bg: '#FDF2F8', label: 'Saved Providers',     sub: 'Your saved list',      to: '/coming-soon' },
];

function QuickActionsPanel() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 pt-4 pb-2 border-b border-gray-50">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-300">Quick Actions</p>
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

// ─── Recommended panel ─────────────────────────────────────────────────────────
// const LOGO_COLORS = ['#111827','#F97316','#0891B2','#7C3AED','#D97706'];

// function RecommendedPanel() {
//   const { data: providers = [], isLoading } = useServiceProviders({ sort: 'top_rated' } as any);
//   const top = providers.slice(0, 5);

//   return (
//     <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
//       <div className="px-4 pt-4 pb-2 border-b border-gray-50 flex items-center justify-between">
//         <div>
//           <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-300">Top Rated</p>
//           <p className="text-[13px] font-bold text-gray-800 mt-0.5">Recommended</p>
//         </div>
//         <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center">
//           <Zap className="h-3.5 w-3.5 text-amber-400" strokeWidth={2} />
//         </div>
//       </div>
//       <div className="p-3 space-y-2">
//         {isLoading
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="flex items-center gap-2.5 p-2 animate-pulse">
//                 <div className="h-9 w-9 rounded-xl bg-gray-100 shrink-0" />
//                 <div className="flex-1 space-y-1.5">
//                   <div className="h-3 w-24 bg-gray-100 rounded" />
//                   <div className="h-2.5 w-16 bg-gray-50 rounded" />
//                 </div>
//               </div>
//             ))
//           : top.map((p, i) => {
//               const initials = p.name.split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');
//               return (
//                 <Link key={p.id} to={`/network/services/${p.category_slug}`}
//                   className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
//                 >
//                   {p.logo_url
//                     ? <img src={p.logo_url} alt={p.name} className="h-9 w-9 rounded-xl object-cover shrink-0 border border-gray-100" />
//                     : <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shrink-0"
//                         style={{ background: LOGO_COLORS[i % LOGO_COLORS.length] }}>
//                         {initials}
//                       </div>
//                   }
//                   <div className="flex-1 min-w-0">
//                     <p className="text-[12px] font-bold text-gray-800 truncate group-hover:text-gray-900">{p.name}</p>
//                     <div className="flex items-center gap-1 mt-0.5">
//                       <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
//                       <span className="text-[11px] font-semibold text-gray-600">{p.rating}</span>
//                       <span className="text-[11px] text-gray-300">({p.review_count})</span>
//                     </div>
//                   </div>
//                   <Bookmark className="h-3.5 w-3.5 text-gray-200 group-hover:text-gray-400 transition-colors" />
//                 </Link>
//               );
//             })}
//       </div>
//       <div className="px-4 pb-3">
//         <Link to="/network/services?view=all"
//           className="flex items-center gap-1.5 text-[12px] font-bold text-gray-900 hover:text-gray-600 transition-colors"
//         >
//           See all providers <ArrowRight className="h-3.5 w-3.5" />
//         </Link>
//       </div>
//     </div>
//   );
// }

// ─── Activity feed widget ──────────────────────────────────────────────────────
const ACTIVITY = [
  { text: 'Arjun S. connected with a Legal advisor', time: '2m ago' },
  { text: 'New accelerator joined: Antler India', time: '15m ago' },
  { text: 'Priya M. booked a mentorship call', time: '1h ago' },
  { text: '3 new Design providers listed', time: '2h ago' },
];

// function LiveActivityPanel() {
//   return (
//     <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
//       <div className="px-4 pt-4 pb-2 border-b border-gray-50 flex items-center gap-2">
//         <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
//         <p className="text-[12px] font-bold text-gray-700">Live Activity</p>
//       </div>
//       <div className="p-3 space-y-2">
//         {ACTIVITY.map((a, i) => (
//           <div key={i} className="flex items-start gap-2.5 px-1 py-1.5">
//             <div className="h-1.5 w-1.5 rounded-full bg-gray-200 mt-1.5 shrink-0" />
//             <div className="flex-1 min-w-0">
//               <p className="text-[11px] text-gray-600 leading-snug">{a.text}</p>
//               <p className="text-[10px] text-gray-300 mt-0.5">{a.time}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// ─── Provider CTA ─────────────────────────────────────────────────────────────
function ProviderCTACard() {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-sm">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0C0F1D 0%, #1E1B4B 100%)' }} />
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
        <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
          <TrendingUp className="h-4 w-4 text-white" strokeWidth={1.75} />
        </div>
        <p className="text-[13px] font-bold text-white leading-snug mb-1">List Your Services</p>
        <p className="text-[11px] text-white/50 leading-relaxed mb-4">
          Get discovered by thousands of founders.
        </p>
        <Link to="/contact"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white text-gray-900 text-[12px] font-bold hover:bg-gray-100 transition-colors"
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

// ─── Right sidebar ─────────────────────────────────────────────────────────────
function RightSidebar() {
  return (
    <aside className="w-[240px] shrink-0 hidden xl:flex flex-col gap-3 sticky top-20 self-start">
      <QuickActionsPanel />
      {/* <RecommendedPanel /> */}
      {/* <LiveActivityPanel /> */}
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
        {/* <ServiceTopBar /> */}

        <div className="px-4 md:px-6 py-4 md:py-8">
          <div className="flex gap-3 md:gap-4 lg:gap-5 items-start">
            {/* Left sidebar: icon-rail on md, full panel on lg+ */}
            <ServicesLeftSidebar />

            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-6 md:space-y-8">
{isViewAll ? <AllProvidersView /> : (
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
