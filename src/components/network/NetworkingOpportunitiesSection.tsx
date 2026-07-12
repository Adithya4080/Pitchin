// import { useState, useRef, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ArrowRight, Globe } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useNetworkDiscover } from '@/hooks/useNetworkDiscover';
// import type { NetworkTab } from '@/api/profiles';
// import { useSendInterest } from '@/hooks/useSendInterest';
// import { useAuth } from '@/hooks/useAuth';
// import { toast } from 'sonner';

// const TAB_ICONS: Record<NetworkTab, JSX.Element> = {
//   investor: (
//     <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M2 11l3-3 3 3 4-5" />
//       <path d="M14 6h-3v3" />
//     </svg>
//   ),
//   mentor: (
//     <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="8" cy="5" r="2.5" />
//       <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
//     </svg>
//   ),
//   partner: (
//     <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M5 8l2 2 4-4" />
//       <rect x="2" y="2" width="12" height="12" rx="2" />
//     </svg>
//   ),
//   accelerator: (
//     <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M8 2s4 1 4 6l-4 4-4-4c0-5 4-6 4-6z" />
//       <path d="M5 11l-2 2M11 11l2 2" />
//       <circle cx="8" cy="7" r="1" fill="currentColor" stroke="none" />
//     </svg>
//   ),
//   community: (
//     <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="5.5" cy="5" r="2" />
//       <circle cx="10.5" cy="5" r="2" />
//       <path d="M1 13c0-2.5 2-4 4.5-4" />
//       <path d="M15 13c0-2.5-2-4-4.5-4" />
//       <path d="M5.5 9c0-2 2-3.5 4.5-3.5s4.5 1.5 4.5 3.5" />
//     </svg>
//   ),
// };

// const TABS: { key: NetworkTab; label: string }[] = [
//   { key: 'investor',    label: 'Investors & VC Firms' },
//   { key: 'mentor',      label: 'Mentors' },
//   { key: 'partner',     label: 'Partners' },
//   { key: 'accelerator', label: 'Accelerators' },
//   { key: 'community',   label: 'Communities' },
// ];

// const AVATAR_PALETTES = [
//   { bg: 'bg-gray-900',    text: 'text-white' },
//   { bg: 'bg-orange-500',  text: 'text-white' },
//   { bg: 'bg-blue-600',    text: 'text-white' },
//   { bg: 'bg-emerald-600', text: 'text-white' },
//   { bg: 'bg-violet-600',  text: 'text-white' },
//   { bg: 'bg-rose-500',    text: 'text-white' },
//   { bg: 'bg-amber-500',   text: 'text-white' },
//   { bg: 'bg-cyan-600',    text: 'text-white' },
// ];

// function getAvatarPalette(name: string) {
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
// }

// function Avatar({ src, name }: { src: string | null; name: string }) {
//   const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
//   const { bg, text } = getAvatarPalette(name);
//   if (src) {
//     return <img src={src} alt={name} loading="lazy" className="h-12 w-12 rounded-xl object-cover shrink-0" />;
//   }
//   return (
//     <div className={`h-12 w-12 rounded-xl ${bg} ${text} flex items-center justify-center text-sm font-bold shrink-0`}>
//       {initials || '?'}
//     </div>
//   );
// }

// function VerifiedPill() {
//   return (
//     <span className="absolute top-4 right-4 z-20 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
//       <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none">
//         <circle cx="8" cy="8" r="7" fill="#2563EB" />
//         <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//       VERIFIED
//     </span>
//   );
// }

// type NetworkProfile = {
//   id: number;
//   user_id: number;
//   name: string;
//   role: string;
//   role_label: string;
//   org_name: string;
//   avatar: string | null;
//   bio: string;
//   tags: string[];
//   is_verified: boolean;
//   location: string;
//   website: string;
// };

// // ─── Same card model as ServiceCategoryGrid's CategoryCard: border, icon slot,
// //     top-right badge, bold title, gray desc, footer link + arrow, tilt/glow hover ──
// function ProfileCard({ profile }: { profile: NetworkProfile }) {
//   const sendInterest = useSendInterest();
//   const navigate = useNavigate();
//   const cardRef = useRef<HTMLDivElement>(null);
//   const [tilt, setTilt] = useState({ x: 0, y: 0 });
//   const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
//   const [hovered, setHovered] = useState(false);
//   const [pressed, setPressed] = useState(false);

//   const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
//     const card = cardRef.current;
//     if (!card) return;
//     const rect = card.getBoundingClientRect();
//     const cx = e.clientX - rect.left;
//     const cy = e.clientY - rect.top;
//     setTilt({
//       x: ((cy / rect.height) - 0.5) * -14,
//       y: ((cx / rect.width) - 0.5) * 14,
//     });
//     setGlowPos({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100 });
//   }, []);

//   const handleMouseLeave = useCallback(() => {
//     setTilt({ x: 0, y: 0 });
//     setHovered(false);
//   }, []);

//   const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
//     const card = cardRef.current;
//     if (card) {
//       const rect = card.getBoundingClientRect();
//       const touch = e.touches[0];
//       setGlowPos({
//         x: ((touch.clientX - rect.left) / rect.width) * 100,
//         y: ((touch.clientY - rect.top) / rect.height) * 100,
//       });
//     }
//     setPressed(true);
//   }, []);

//   const handleTouchEnd = useCallback(() => {
//     window.setTimeout(() => setPressed(false), 220);
//   }, []);

//   const active = hovered || pressed;

//   const handleConnect = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     sendInterest.mutate(
//       {
//         receiverId: profile.user_id,
//         subject: 'Connection request from PitchIn',
//         message: `Hi ${profile.name}, I'd like to connect with you on PitchIn.`,
//         tag: 'collaboration',
//       },
//       {
//         onSuccess: () => toast.success(`Request sent to ${profile.name}`),
//         onError: ()  => toast.error('Could not send request. Please try again.'),
//       }
//     );
//   };

//   return (
//     <div style={{ perspective: '800px' }} className="h-full">
//       <motion.div
//         ref={cardRef}
//         onMouseMove={handleMouseMove}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={handleMouseLeave}
//         onTouchStart={handleTouchStart}
//         onTouchEnd={handleTouchEnd}
//         onClick={() => navigate(`/profile/${profile.user_id}`)}
//         whileTap={{ scale: 0.97 }}
//         className="group relative flex flex-col rounded-xl bg-white overflow-hidden h-full touch-manipulation cursor-pointer"
//         style={{
//           border: '1px solid #e5e7eb',
//           transform: hovered
//             ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(16px) scale(1.02)`
//             : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
//           transition: hovered
//             ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out'
//             : 'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease-out',
//           boxShadow: active
//             ? '0 18px 50px -8px rgba(0,0,0,0.16), 0 6px 16px -4px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)'
//             : '0 1px 3px rgba(0,0,0,0.05)',
//           willChange: 'transform',
//         }}
//       >
//         {/* macOS liquid glow */}
//         {active && (
//           <div
//             className="absolute inset-0 pointer-events-none rounded-xl z-10"
//             style={{
//               background: `radial-gradient(240px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)`,
//               mixBlendMode: 'screen',
//             }}
//           />
//         )}

//         {/* top border accent line */}
//         <div className="h-px w-full bg-gray-200" />

//         {/* Subtle colour tint on hover/press */}
//         <div
//           className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
//           style={{
//             background: 'linear-gradient(135deg, #EFF6FF 0%, white 60%)',
//             opacity: active ? 1 : 0,
//           }}
//         />

//         {profile.is_verified && <VerifiedPill />}

//         <div className="relative p-4 flex flex-col h-full">
//           {/* Avatar */}
//           <span
//             className="inline-flex shrink-0 mb-3"
//             style={{
//               transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
//               transform: active ? 'scale(1.08)' : 'scale(1)',
//             }}
//           >
//             <Avatar src={profile.avatar} name={profile.name} />
//           </span>

//           {/* Name */}
//           <p className="text-sm font-semibold text-foreground leading-snug mb-1 truncate">
//             {profile.name}
//           </p>

//           {/* Role / org */}
//           <p className="text-[11px] text-foreground/50 leading-snug mb-2">
//             {profile.role_label}{profile.org_name ? ` · ${profile.org_name}` : ''}
//           </p>

//           {/* Bio */}
//           <p className="text-[11px] text-foreground/50 leading-snug line-clamp-2 mb-3 flex-1">
//             {profile.bio || 'No description yet.'}
//           </p>

//           {/* Tags */}
//           {profile.tags.length > 0 && (
//             <div className="flex flex-wrap gap-1 mb-3">
//               {profile.tags.slice(0, 2).map((tag) => (
//                 <span key={tag} className="text-[10px] font-medium px-2 py-[2px] rounded-full bg-gray-100 text-gray-500 border border-gray-200">
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Footer — same as CategoryCard: link text + arrow, color shifts on hover */}
//           <div className="flex items-center justify-between mt-auto">
//             <button
//               onClick={handleConnect}
//               disabled={sendInterest.isPending}
//               className="text-[11px] font-medium transition-colors duration-200 disabled:opacity-60"
//               style={{ color: active ? '#2563EB' : 'rgba(0,0,0,0.25)' }}
//             >
//               Connect
//             </button>
//             <ArrowRight
//               className="h-3.5 w-3.5 transition-all duration-200"
//               style={{
//                 color: active ? '#2563EB' : 'rgba(0,0,0,0.2)',
//                 transform: active ? 'translateX(2px)' : 'translateX(0)',
//               }}
//             />
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// function CardSkeleton() {
//   return (
//     <div className="rounded-xl border border-foreground/10 bg-white p-4 animate-pulse flex-shrink-0">
//       <div className="h-12 w-12 rounded-xl bg-foreground/[0.06] mb-3" />
//       <div className="h-4 w-24 bg-foreground/[0.06] rounded mb-2" />
//       <div className="h-3 w-32 bg-foreground/[0.04] rounded mb-3" />
//       <div className="h-3 w-16 bg-foreground/[0.04] rounded" />
//     </div>
//   );
// }

// function DotPagination({ total, current, onChange }: {
//   total: number;
//   current: number;
//   onChange: (n: number) => void;
// }) {
//   if (total <= 1) return null;
//   return (
//     <div className="flex items-center justify-center gap-1.5 mt-5">
//       {Array.from({ length: total }).map((_, i) => (
//         <button
//           key={i}
//           onClick={() => onChange(i + 1)}
//           className={`rounded-full transition-all duration-200 ${
//             i + 1 === current ? 'w-5 h-2 bg-gray-800' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
//           }`}
//           aria-label={`Page ${i + 1}`}
//         />
//       ))}
//     </div>
//   );
// }

// export function NetworkingOpportunitiesSection() {
//   const [activeTab, setActiveTab] = useState<NetworkTab>('investor');
//   const [page, setPage] = useState(1);
//   const { user, loading: authLoading } = useAuth();
//   const { data, isLoading, isError } = useNetworkDiscover({
//     tab: activeTab,
//     page,
//     enabled: !!user && !authLoading,
//   });

//   const profiles = data?.results ?? [];
//   const numPages  = data?.num_pages ?? 1;

//   const handleTabChange = (tab: NetworkTab) => {
//     setActiveTab(tab);
//     setPage(1);
//   };

//   return (
//     <section>
//       {/* Header — matches ServiceCategoryGrid header style */}
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h2 className="text-lg md:text-xl font-bold text-foreground">
//             Networking &amp; Opportunities
//           </h2>
//           <p className="text-sm text-foreground/55 mt-0.5">
//             Connect with investors, mentors, partners and explore opportunities.
//           </p>
//         </div>
//         <Link
//           to="/network"
//           className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-foreground border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors shrink-0 mt-1"
//         >
//           View all networking <ArrowRight className="h-4 w-4" />
//         </Link>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pointer-events-none opacity-50 mb-4">
//         {TABS.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => handleTabChange(tab.key)}
//             className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium px-4 py-[7px] rounded-full border border-gray-300 bg-white text-gray-600 transition-all shrink-0"
//           >
//             {TAB_ICONS[tab.key]}
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Card grid with blur overlay */}
//       <div className="relative">
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 min-h-[160px]">
//           {isLoading
//             ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
//             : isError
//             ? null
//             : profiles.map((p) => <ProfileCard key={p.id} profile={p} />)}
//         </div>

//         {/* Empty state */}
//         {!isLoading && !isError && profiles.length === 0 && (
//           <div className="mt-6 flex flex-col items-center gap-2 py-10 text-center">
//             <Globe className="h-8 w-8 text-gray-300" />
//             <p className="text-sm text-gray-400">
//               No {TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} yet.
//             </p>
//             <p className="text-xs text-gray-300">Check back soon — more are joining every day.</p>
//           </div>
//         )}

//         {/* Blur overlay — visible but not interactive */}
//         <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] rounded-xl z-30 cursor-not-allowed" />
//       </div>

//       {/* Dot pagination */}
//       <DotPagination total={numPages} current={page} onChange={setPage} />

//       {/* Mobile view all */}
//       <div className="flex md:hidden justify-center mt-4">
//         <Link
//           to="/network"
//           className="inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:text-blue-500 transition-colors"
//         >
//           View all networking <ArrowRight className="h-3.5 w-3.5" />
//         </Link>
//       </div>
//     </section>
//   );
// }

import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import type { NetworkTab } from '@/api/profiles';
import { useSendInterest } from '@/hooks/useSendInterest';
import { toast } from 'sonner';

const TAB_ICONS: Record<NetworkTab, JSX.Element> = {
  investor: (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 11l3-3 3 3 4-5" />
      <path d="M14 6h-3v3" />
    </svg>
  ),
  mentor: (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5" r="2.5" />
      <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    </svg>
  ),
  partner: (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8l2 2 4-4" />
      <rect x="2" y="2" width="12" height="12" rx="2" />
    </svg>
  ),
  accelerator: (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2s4 1 4 6l-4 4-4-4c0-5 4-6 4-6z" />
      <path d="M5 11l-2 2M11 11l2 2" />
      <circle cx="8" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  community: (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="5" r="2" />
      <circle cx="10.5" cy="5" r="2" />
      <path d="M1 13c0-2.5 2-4 4.5-4" />
      <path d="M15 13c0-2.5-2-4-4.5-4" />
      <path d="M5.5 9c0-2 2-3.5 4.5-3.5s4.5 1.5 4.5 3.5" />
    </svg>
  ),
};

const TABS: { key: NetworkTab; label: string }[] = [
  { key: 'investor',    label: 'Investors & VC Firms' },
  { key: 'mentor',      label: 'Mentors' },
  { key: 'partner',     label: 'Partners' },
  { key: 'accelerator', label: 'Accelerators' },
  { key: 'community',   label: 'Communities' },
];

const AVATAR_PALETTES = [
  { bg: 'bg-gray-900',    text: 'text-white' },
  { bg: 'bg-orange-500',  text: 'text-white' },
  { bg: 'bg-blue-600',    text: 'text-white' },
  { bg: 'bg-emerald-600', text: 'text-white' },
  { bg: 'bg-violet-600',  text: 'text-white' },
  { bg: 'bg-rose-500',    text: 'text-white' },
  { bg: 'bg-amber-500',   text: 'text-white' },
  { bg: 'bg-cyan-600',    text: 'text-white' },
];

function getAvatarPalette(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
}

function Avatar({ src, name }: { src: string | null; name: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  const { bg, text } = getAvatarPalette(name);
  if (src) {
    return <img src={src} alt={name} loading="lazy" className="h-12 w-12 rounded-xl object-cover shrink-0" />;
  }
  return (
    <div className={`h-12 w-12 rounded-xl ${bg} ${text} flex items-center justify-center text-sm font-bold shrink-0`}>
      {initials || '?'}
    </div>
  );
}

function VerifiedPill() {
  return (
    <span className="absolute top-4 right-4 z-20 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
      <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none">
        <circle cx="8" cy="8" r="7" fill="#2563EB" />
        <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      VERIFIED
    </span>
  );
}

type NetworkProfile = {
  id: number;
  user_id: number;
  name: string;
  role: string;
  role_label: string;
  org_name: string;
  avatar: string | null;
  bio: string;
  tags: string[];
  is_verified: boolean;
  location: string;
  website: string;
};

// ─── Same card model as ServiceCategoryGrid's CategoryCard: border, icon slot,
//     top-right badge, bold title, gray desc, footer link + arrow, tilt/glow hover ──
function ProfileCard({ profile }: { profile: NetworkProfile }) {
  const sendInterest = useSendInterest();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setTilt({
      x: ((cy / rect.height) - 0.5) * -14,
      y: ((cx / rect.width) - 0.5) * 14,
    });
    setGlowPos({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
      const touch = e.touches[0];
      setGlowPos({
        x: ((touch.clientX - rect.left) / rect.width) * 100,
        y: ((touch.clientY - rect.top) / rect.height) * 100,
      });
    }
    setPressed(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    window.setTimeout(() => setPressed(false), 220);
  }, []);

  const active = hovered || pressed;

  const handleConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sendInterest.mutate(
      {
        receiverId: profile.user_id,
        subject: 'Connection request from PitchIn',
        message: `Hi ${profile.name}, I'd like to connect with you on PitchIn.`,
        tag: 'collaboration',
      },
      {
        onSuccess: () => toast.success(`Request sent to ${profile.name}`),
        onError: ()  => toast.error('Could not send request. Please try again.'),
      }
    );
  };

  return (
    <div style={{ perspective: '800px' }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => navigate(`/profile/${profile.user_id}`)}
        whileTap={{ scale: 0.97 }}
        className="group relative flex flex-col rounded-xl bg-white overflow-hidden h-full touch-manipulation cursor-pointer"
        style={{
          border: '1px solid #e5e7eb',
          transform: hovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(16px) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          transition: hovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out'
            : 'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease-out',
          boxShadow: active
            ? '0 18px 50px -8px rgba(0,0,0,0.16), 0 6px 16px -4px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)'
            : '0 1px 3px rgba(0,0,0,0.05)',
          willChange: 'transform',
        }}
      >
        {active && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl z-10"
            style={{
              background: `radial-gradient(240px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}

        <div className="h-px w-full bg-gray-200" />

        <div
          className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, white 60%)',
            opacity: active ? 1 : 0,
          }}
        />

        {profile.is_verified && <VerifiedPill />}

        <div className="relative p-4 flex flex-col h-full">
          <span
            className="inline-flex shrink-0 mb-3"
            style={{
              transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
              transform: active ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            <Avatar src={profile.avatar} name={profile.name} />
          </span>

          <p className="text-sm font-semibold text-foreground leading-snug mb-1 truncate">
            {profile.name}
          </p>

          <p className="text-[11px] text-foreground/50 leading-snug mb-2">
            {profile.role_label}{profile.org_name ? ` · ${profile.org_name}` : ''}
          </p>

          <p className="text-[11px] text-foreground/50 leading-snug line-clamp-2 mb-3 flex-1">
            {profile.bio || 'No description yet.'}
          </p>

          {profile.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {profile.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] font-medium px-2 py-[2px] rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-auto">
            <button
              onClick={handleConnect}
              disabled={sendInterest.isPending}
              className="text-[11px] font-medium transition-colors duration-200 disabled:opacity-60"
              style={{ color: active ? '#2563EB' : 'rgba(0,0,0,0.25)' }}
            >
              Connect
            </button>
            <ArrowRight
              className="h-3.5 w-3.5 transition-all duration-200"
              style={{
                color: active ? '#2563EB' : 'rgba(0,0,0,0.2)',
                transform: active ? 'translateX(2px)' : 'translateX(0)',
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DotPagination({ total, current, onChange }: {
  total: number;
  current: number;
  onChange: (n: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-5">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`rounded-full transition-all duration-200 ${
            i + 1 === current ? 'w-5 h-2 bg-gray-800' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Page ${i + 1}`}
        />
      ))}
    </div>
  );
}

export function NetworkingOpportunitiesSection() {
  const [activeTab, setActiveTab] = useState<NetworkTab>('investor');

  const handleTabChange = (tab: NetworkTab) => {
    setActiveTab(tab);
  };

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">
            Networking &amp; Opportunities
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Connect with investors, mentors, partners and explore opportunities.
          </p>
        </div>
        <Link
          to="/network"
          className="hidden md:inline-flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:text-blue-500 transition-colors shrink-0 mt-1"
        >
          View all networking <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pointer-events-none opacity-50 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium px-4 py-[7px] rounded-full border border-gray-300 bg-white text-gray-600 transition-all shrink-0"
          >
            {TAB_ICONS[tab.key]}
            {tab.label}
          </button>
        ))}
      </div>

      {/* No live data source — useNetworkDiscover has been removed. Section
          renders in a static locked/"coming soon" state. */}
      <div className="relative">
        <div className="grid grid-cols-1 min-h-[200px] rounded-xl border border-dashed border-gray-200 bg-gray-50/60">
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center px-4">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-50">
              <Globe className="h-6 w-6 text-blue-500" />
            </span>
            <p className="text-[15px] font-semibold text-gray-700">
              {TABS.find((t) => t.key === activeTab)?.label} coming soon
            </p>
            <p className="text-sm text-gray-500 max-w-xs">Check back soon — this section is launching shortly.</p>
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl z-30 cursor-not-allowed" />
      </div>

      <DotPagination total={1} current={1} onChange={() => {}} />

      <div className="flex md:hidden items-center justify-center mt-5">
        <Link
          to="/network"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
        >
          View all networking <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}