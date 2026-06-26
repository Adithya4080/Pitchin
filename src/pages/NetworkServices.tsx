// import { Link } from 'react-router-dom';
// import {
//   LayoutGrid, Phone, ClipboardList, Bookmark,
//   ArrowRight, Star, Heart,
// } from 'lucide-react';
// import { AppLayout } from '@/components/layouts/AppLayout';
// import { ServicesLeftSidebar } from '@/components/network/ServicesLeftSidebar';
// import { ServiceHeroBanner } from '@/components/network/ServiceHeroBanner';
// import { ServiceCategoryGrid } from '@/components/network/ServiceCategoryGrid';
// import { NetworkingOpportunitiesSection } from '@/components/network/NetworkingOpportunitiesSection';
// import { useServiceProviders } from '@/hooks/useServices';

// // ─── Quick Actions ─────────────────────────────────────────────────────────────
// const QUICK_ACTIONS = [
//   {
//     icon: <LayoutGrid className="h-5 w-5 text-blue-600" />,
//     bg: 'bg-blue-50',
//     label: 'Post a Requirement',
//     sub: 'Get custom proposals',
//     to: '/coming-soon',
//   },
//   {
//     icon: <Phone className="h-5 w-5 text-green-600" />,
//     bg: 'bg-green-50',
//     label: 'Book a Call',
//     sub: 'Schedule with experts',
//     to: '/coming-soon',
//   },
//   {
//     icon: <ClipboardList className="h-5 w-5 text-orange-500" />,
//     bg: 'bg-orange-50',
//     label: 'View My Requests',
//     sub: 'Track your submissions',
//     to: '/coming-soon',
//   },
//   {
//     icon: <Heart className="h-5 w-5 text-rose-500" />,
//     bg: 'bg-rose-50',
//     label: 'Saved Providers',
//     sub: 'View your saved list',
//     to: '/coming-soon',
//   },
// ];

// function QuickActionsPanel() {
//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-4">
//       <h3 className="text-[13px] font-semibold text-gray-800 mb-3">Quick Actions</h3>
//       <div className="space-y-1">
//         {QUICK_ACTIONS.map((a) => (
//           <Link
//             key={a.label}
//             to={a.to}
//             className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
//           >
//             <span className={`${a.bg} h-9 w-9 rounded-xl flex items-center justify-center shrink-0`}>
//               {a.icon}
//             </span>
//             <div className="min-w-0">
//               <p className="text-[12px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
//                 {a.label}
//               </p>
//               <p className="text-[11px] text-gray-400">{a.sub}</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Recommended For You ──────────────────────────────────────────────────────
// const LOGO_COLORS = [
//   'bg-indigo-700', 'bg-orange-500', 'bg-cyan-600',
//   'bg-violet-600', 'bg-amber-500', 'bg-rose-600',
// ];

// function RecommendedPanel() {
//   const { data: providers = [], isLoading } = useServiceProviders({ sort: 'top_rated' } as any);
//   const top = providers.slice(0, 5);

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-4">
//       <h3 className="text-[13px] font-semibold text-gray-800 mb-0.5">Recommended for You</h3>
//       <p className="text-[11px] text-gray-400 mb-3">Based on your startup stage</p>

//       <div className="space-y-3">
//         {isLoading
//           ? Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} className="flex items-center gap-2.5 animate-pulse">
//                 <div className="h-9 w-9 rounded-xl bg-gray-200 shrink-0" />
//                 <div className="flex-1 space-y-1.5">
//                   <div className="h-3 w-24 bg-gray-200 rounded" />
//                   <div className="h-2.5 w-16 bg-gray-100 rounded" />
//                 </div>
//               </div>
//             ))
//           : top.map((p, i) => {
//               const initials = p.name.split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');
//               const bg = LOGO_COLORS[i % LOGO_COLORS.length];
//               return (
//                 <Link
//                   key={p.id}
//                   to={`/network/provider/${p.slug}`}
//                   className="flex items-center gap-2.5 group"
//                 >
//                   {p.logo_url ? (
//                     <img src={p.logo_url} alt={p.name}
//                       className="h-9 w-9 rounded-xl object-cover shrink-0 border border-gray-100"
//                     />
//                   ) : (
//                     <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
//                       {initials}
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-[12px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
//                       {p.name}
//                     </p>
//                     <div className="flex items-center gap-1">
//                       <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
//                       <span className="text-[11px] text-gray-600">{p.rating}</span>
//                       <span className="text-[11px] text-gray-400">({p.review_count})</span>
//                     </div>
//                   </div>
//                   <span className="text-[10px] text-gray-400 shrink-0">{p.category_name}</span>
//                   <button onClick={e => e.preventDefault()}
//                     className="p-1 text-gray-300 hover:text-gray-500 transition-colors shrink-0">
//                     <Bookmark className="h-3.5 w-3.5" />
//                   </button>
//                 </Link>
//               );
//             })}
//       </div>

//       <Link to="/network/services?view=all"
//         className="mt-4 flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:text-blue-500 transition-colors">
//         View all providers <ArrowRight className="h-3.5 w-3.5" />
//       </Link>
//     </div>
//   );
// }

// // ─── Bottom trust strip ───────────────────────────────────────────────────────
// const TRUST_ITEMS = [
//   {
//     icon: (
//       <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" fill="none">
//         <circle cx="20" cy="20" r="18" fill="#EFF6FF" />
//         <path d="M20 10l-8 4v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10v-6l-8-4z"
//           fill="none" stroke="#2563EB" strokeWidth="1.6" strokeLinejoin="round" />
//         <path d="M15 20l3 3 6-6" stroke="#2563EB" strokeWidth="1.6"
//           strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//     title: 'Verified & Trusted Providers',
//     desc: 'All service providers are verified and reviewed.',
//   },
//   {
//     icon: (
//       <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" fill="none">
//         <circle cx="20" cy="20" r="18" fill="#F0FDF4" />
//         <path d="M20 12a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
//           fill="none" stroke="#16A34A" strokeWidth="1.6" />
//         <path d="M16 20l3 3 6-6" stroke="#16A34A" strokeWidth="1.6"
//           strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//     title: 'Secure & Transparent Process',
//     desc: 'Clear pricing, secure payments and full transparency.',
//   },
//   {
//     icon: (
//       <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" fill="none">
//         <circle cx="20" cy="20" r="18" fill="#EFF6FF" />
//         <path d="M14 26c0-4 2.5-6 6-6s6 2 6 6" stroke="#2563EB"
//           strokeWidth="1.6" strokeLinecap="round" />
//         <circle cx="20" cy="16" r="3" stroke="#2563EB" strokeWidth="1.6" />
//         <path d="M26 22h2M30 24h-2M26 26h2" stroke="#2563EB"
//           strokeWidth="1.4" strokeLinecap="round" />
//       </svg>
//     ),
//     title: 'Save Time & Grow Faster',
//     desc: 'Find the right help and focus on what matters most.',
//   },
//   {
//     icon: (
//       <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" fill="none">
//         <circle cx="20" cy="20" r="18" fill="#FFF7ED" />
//         <path d="M20 14v3M20 24v2M14 20h3M23 20h3"
//           stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
//         <circle cx="20" cy="20" r="3.5" stroke="#F97316" strokeWidth="1.6" />
//         <path d="M15.5 15.5l1.5 1.5M23 23l1.5 1.5M23 15.5L21.5 17M17 23l-1.5 1.5"
//           stroke="#F97316" strokeWidth="1.4" strokeLinecap="round" />
//       </svg>
//     ),
//     title: 'Opportunities Everyday',
//     desc: 'New opportunities, programs and connections daily.',
//   },
// ];

// function TrustStrip() {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-5 py-2">
//       {TRUST_ITEMS.map((item) => (
//         <div key={item.title} className="flex items-start gap-3">
//           {item.icon}
//           <div>
//             <p className="text-[12px] font-semibold text-gray-800 leading-snug">{item.title}</p>
//             <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{item.desc}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Right sidebar ────────────────────────────────────────────────────────────
// function RightSidebar() {
//   return (
//     <aside className="w-[260px] shrink-0 hidden xl:flex flex-col gap-4 sticky top-20 self-start">
//       <QuickActionsPanel />
//       <RecommendedPanel />
//     </aside>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────
// export default function NetworkServices() {
//   return (
//     <AppLayout showMobileHeader title="Services" showBottomNav>
//       <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5 md:py-8">
//         <div className="flex gap-5 items-start">

//           {/* Left sidebar */}
//           <ServicesLeftSidebar />

//           {/* Main content */}
//           <div className="flex-1 min-w-0 space-y-8">
//             <ServiceHeroBanner />
//             <ServiceCategoryGrid />
//             <NetworkingOpportunitiesSection />
//             <TrustStrip />
//           </div>

//           {/* Right sidebar */}
//           <RightSidebar />
//         </div>
//       </div>
//     </AppLayout>
//   );
// }