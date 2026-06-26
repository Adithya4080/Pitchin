// import { Link } from 'react-router-dom';
// import { Search, Compass, Briefcase, Users, ArrowRight } from 'lucide-react';
// import { AppLayout } from '@/components/layouts/AppLayout';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { GrowthSidebar } from '@/components/network/GrowthSidebar';
// import { ImagePlaceholder } from '@/components/network/ImagePlaceholder';
// import { getServiceCategoryIcon } from '@/components/network/iconMap';
// import { useServiceCategories } from '@/hooks/useServices';

// const journeyStages = [
//   { id: 'idea', stageLabel: 'Stage 1', title: 'Validate Your Idea', description: 'Talk to mentors and test your concept.', cta: 'Get started' },
//   { id: 'build', stageLabel: 'Stage 2', title: 'Build Your MVP', description: 'Find tech & design partners to build fast.', cta: 'Find help' },
//   { id: 'launch', stageLabel: 'Stage 3', title: 'Launch & Get Users', description: 'Marketing and growth services to launch right.', cta: 'Explore' },
//   { id: 'scale', stageLabel: 'Stage 4', title: 'Raise & Scale', description: 'Connect with investors and scale operations.', cta: 'Connect' },
// ];

// export default function Network() {
//   const { data: serviceCategories = [], isLoading, isError } = useServiceCategories();

//   return (
//     <AppLayout showMobileHeader title="Growth Hub" showBottomNav>
//       <div className="max-w-[1180px] mx-auto px-4 md:px-6 py-5 md:py-8 flex gap-6">
//         {/* Main column */}
//         <div className="flex-1 min-w-0 space-y-8 md:space-y-10">

//           {/* HERO */}
//           <section>
//             <Card className="bg-white border-foreground/10 p-5 md:p-8">
//               <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 md:gap-8 items-center">
//                 <div>
//                   <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-foreground/60 mb-3">
//                     <Compass className="h-3.5 w-3.5" /> Startup Growth Hub
//                   </div>
//                   <h1 className="font-display text-2xl md:text-4xl font-bold leading-tight text-foreground">
//                     Everything Your Startup Needs to Build, Grow &amp; Scale
//                   </h1>
//                   <p className="text-sm md:text-base text-foreground/70 mt-3 max-w-xl">
//                     Discover vetted services, curated for founders at every stage.
//                   </p>

//                   <div className="mt-5 relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
//                     <Input
//                       placeholder="Search services or providers…"
//                       className="pl-9 h-11 bg-background border-foreground/15"
//                     />
//                   </div>

//                   <div className="mt-4 flex flex-wrap gap-2">
//                     <Button asChild variant="outline" className="bg-white border-foreground/30 hover:bg-foreground/[0.04]">
//                       <Link to="/network/services"><Briefcase className="h-4 w-4 mr-1.5" />Find Services</Link>
//                     </Button>
//                     <Button asChild variant="outline" className="bg-white border-foreground/30 hover:bg-foreground/[0.04]">
//                       <Link to="/network"><Users className="h-4 w-4 mr-1.5" />Connect with Experts</Link>
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="aspect-[4/3] md:aspect-square overflow-hidden rounded-3xl border border-border/50 bg-white shadow-sm">
//                   <img
//                     src="https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/pitch-connect-image.png"
//                     alt="PitchIn Ecosystem"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>
//             </Card>
//           </section>
//           {/* SERVICES MARKETPLACE — live data */}
//           <section>
//             <SectionHeader
//               title="Find Services For Your Startup"
//               subtitle="Vetted providers across legal, tech, design, finance and more."
//               link={{ label: 'All services', to: '/network/services' }}
//             />

//             {isLoading && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
//                 {Array.from({ length: 6 }).map((_, i) => (
//                   <div key={i} className="h-24 rounded-xl bg-foreground/[0.04] animate-pulse" />
//                 ))}
//               </div>
//             )}

//             {isError && (
//               <p className="text-sm text-foreground/60 mt-4">
//                 Couldn't load services right now. Please try again shortly.
//               </p>
//             )}

//             {!isLoading && !isError && serviceCategories.length === 0 && (
//               <p className="text-sm text-foreground/60 mt-4">No service categories yet — check back soon.</p>
//             )}

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
//               {serviceCategories.map((c) => {
//                 const Icon = getServiceCategoryIcon(c.icon);
//                 return (
//                   <Link key={c.id} to={`/network/services?category=${c.slug}`}>
//                     <Card className="bg-white border-foreground/10 hover:border-foreground/30 transition-colors p-4 h-full">
//                       <div className="flex items-start gap-3">
//                         <div className="h-10 w-10 rounded-lg bg-foreground/[0.05] flex items-center justify-center shrink-0">
//                           <Icon className="h-4.5 w-4.5 text-foreground" />
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
//                           <p className="text-xs text-foreground/60 mt-0.5">{c.description}</p>
//                           <div className="flex items-center justify-between mt-3">
//                             <span className="text-[11px] text-foreground/50">{c.provider_count} providers</span>
//                             <span className="text-xs font-medium text-foreground inline-flex items-center gap-1">
//                               Explore <ArrowRight className="h-3 w-3" />
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </Card>
//                   </Link>
//                 );
//               })}
//             </div>
//           </section>
//         </div>

//         {/* Sticky sidebar */}
//         <div className="sticky top-20 self-start">
//           <GrowthSidebar />
//         </div>
//       </div>
//     </AppLayout>
//   );
// }

// function SectionHeader({ title, subtitle, link }: { title: string; subtitle?: string; link?: { label: string; to: string } }) {
//   return (
//     <div className="flex items-end justify-between gap-3">
//       <div>
//         <h2 className="font-display text-lg md:text-xl font-semibold text-foreground">{title}</h2>
//         {subtitle && <p className="text-xs md:text-sm text-foreground/60 mt-0.5">{subtitle}</p>}
//       </div>
//       {link && (
//         <Link to={link.to} className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1 shrink-0">
//           {link.label} <ArrowRight className="h-3 w-3" />
//         </Link>
//       )}
//     </div>
//   );
// }
import { Link } from 'react-router-dom';
import {
  LayoutGrid, Phone, ClipboardList, Bookmark,
  ArrowRight, Star, Heart,
} from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { ServicesLeftSidebar } from '@/components/network/ServicesLeftSidebar';
import { ServiceHeroBanner } from '@/components/network/ServiceHeroBanner';
import { ServiceCategoryGrid } from '@/components/network/ServiceCategoryGrid';
import { NetworkingOpportunitiesSection } from '@/components/network/NetworkingOpportunitiesSection';
import { useServiceProviders } from '@/hooks/useServices';

// ─── Quick Actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    icon: <LayoutGrid className="h-5 w-5 text-blue-600" />,
    bg: 'bg-blue-50',
    label: 'Post a Requirement',
    sub: 'Get custom proposals',
    to: '/coming-soon',
  },
  {
    icon: <Phone className="h-5 w-5 text-green-600" />,
    bg: 'bg-green-50',
    label: 'Book a Call',
    sub: 'Schedule with experts',
    to: '/coming-soon',
  },
  {
    icon: <ClipboardList className="h-5 w-5 text-orange-500" />,
    bg: 'bg-orange-50',
    label: 'View My Requests',
    sub: 'Track your submissions',
    to: '/coming-soon',
  },
  {
    icon: <Heart className="h-5 w-5 text-rose-500" />,
    bg: 'bg-rose-50',
    label: 'Saved Providers',
    sub: 'View your saved list',
    to: '/coming-soon',
  },
];

function QuickActionsPanel() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-[13px] font-semibold text-gray-800 mb-3">Quick Actions</h3>
      <div className="space-y-1">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <span className={`${a.bg} h-9 w-9 rounded-xl flex items-center justify-center shrink-0`}>
              {a.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {a.label}
              </p>
              <p className="text-[11px] text-gray-400">{a.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Recommended For You ──────────────────────────────────────────────────────
const LOGO_COLORS = [
  'bg-indigo-700', 'bg-orange-500', 'bg-cyan-600',
  'bg-violet-600', 'bg-amber-500', 'bg-rose-600',
];

function RecommendedPanel() {
  const { data: providers = [], isLoading } = useServiceProviders({ sort: 'top_rated' } as any);
  const top = providers.slice(0, 5);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-[13px] font-semibold text-gray-800 mb-0.5">Recommended for You</h3>
      <p className="text-[11px] text-gray-400 mb-3">Based on your startup stage</p>

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 animate-pulse">
                <div className="h-9 w-9 rounded-xl bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-2.5 w-16 bg-gray-100 rounded" />
                </div>
              </div>
            ))
          : top.map((p, i) => {
              const initials = p.name.split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');
              const bg = LOGO_COLORS[i % LOGO_COLORS.length];
              return (
                <Link
                  key={p.id}
                  to={`/network/provider/${p.slug}`}
                  className="flex items-center gap-2.5 group"
                >
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name}
                      className="h-9 w-9 rounded-xl object-cover shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] text-gray-600">{p.rating}</span>
                      <span className="text-[11px] text-gray-400">({p.review_count})</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{p.category_name}</span>
                  <button onClick={e => e.preventDefault()}
                    className="p-1 text-gray-300 hover:text-gray-500 transition-colors shrink-0">
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                </Link>
              );
            })}
      </div>

      <Link to="/network/services?view=all"
        className="mt-4 flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:text-blue-500 transition-colors">
        View all providers <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// ─── Bottom trust strip ───────────────────────────────────────────────────────
const TRUST_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" fill="none">
        <circle cx="20" cy="20" r="18" fill="#EFF6FF" />
        <path d="M20 10l-8 4v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10v-6l-8-4z"
          fill="none" stroke="#2563EB" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M15 20l3 3 6-6" stroke="#2563EB" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Verified & Trusted Providers',
    desc: 'All service providers are verified and reviewed.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" fill="none">
        <circle cx="20" cy="20" r="18" fill="#F0FDF4" />
        <path d="M20 12a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
          fill="none" stroke="#16A34A" strokeWidth="1.6" />
        <path d="M16 20l3 3 6-6" stroke="#16A34A" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Secure & Transparent Process',
    desc: 'Clear pricing, secure payments and full transparency.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" fill="none">
        <circle cx="20" cy="20" r="18" fill="#EFF6FF" />
        <path d="M14 26c0-4 2.5-6 6-6s6 2 6 6" stroke="#2563EB"
          strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="20" cy="16" r="3" stroke="#2563EB" strokeWidth="1.6" />
        <path d="M26 22h2M30 24h-2M26 26h2" stroke="#2563EB"
          strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: 'Save Time & Grow Faster',
    desc: 'Find the right help and focus on what matters most.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" fill="none">
        <circle cx="20" cy="20" r="18" fill="#FFF7ED" />
        <path d="M20 14v3M20 24v2M14 20h3M23 20h3"
          stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="20" cy="20" r="3.5" stroke="#F97316" strokeWidth="1.6" />
        <path d="M15.5 15.5l1.5 1.5M23 23l1.5 1.5M23 15.5L21.5 17M17 23l-1.5 1.5"
          stroke="#F97316" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: 'Opportunities Everyday',
    desc: 'New opportunities, programs and connections daily.',
  },
];

function TrustStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 py-2">
      {TRUST_ITEMS.map((item) => (
        <div key={item.title} className="flex items-start gap-3">
          {item.icon}
          <div>
            <p className="text-[12px] font-semibold text-gray-800 leading-snug">{item.title}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Right sidebar ────────────────────────────────────────────────────────────
function RightSidebar() {
  return (
    <aside className="w-[260px] shrink-0 hidden xl:flex flex-col gap-4 sticky top-20 self-start">
      <QuickActionsPanel />
      <RecommendedPanel />
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NetworkServices() {
  return (
    <AppLayout showMobileHeader title="Services" showBottomNav>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5 md:py-8">
        <div className="flex gap-5 items-start">

          {/* Left sidebar */}
          <ServicesLeftSidebar />

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-8">
            <ServiceHeroBanner />
            <ServiceCategoryGrid />
            <NetworkingOpportunitiesSection />
            <TrustStrip />
          </div>

          {/* Right sidebar */}
          <RightSidebar />
        </div>
      </div>
    </AppLayout>
  );
}