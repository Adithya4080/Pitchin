// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowRight, Globe } from 'lucide-react';
// import { useNetworkDiscover } from '@/hooks/useNetworkDiscover';
// import type { NetworkTab } from '@/api/profiles';
// import { useSendInterest } from '@/hooks/useSendInterest';
// import { toast } from 'sonner';

// // ─── Tab icons — exact SVG paths matching the screenshot icons ────────────────
// const TAB_ICONS: Record<NetworkTab, JSX.Element> = {
//   investor: (
//     // bar-chart / trending icon
//     <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M2 11l3-3 3 3 4-5" />
//       <path d="M14 6h-3v3" />
//     </svg>
//   ),
//   mentor: (
//     // person icon
//     <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="8" cy="5" r="2.5" />
//       <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
//     </svg>
//   ),
//   partner: (
//     // link/handshake icon
//     <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M5 8l2 2 4-4" />
//       <rect x="2" y="2" width="12" height="12" rx="2" />
//     </svg>
//   ),
//   accelerator: (
//     // rocket icon
//     <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M8 2s4 1 4 6l-4 4-4-4c0-5 4-6 4-6z" />
//       <path d="M5 11l-2 2M11 11l2 2" />
//       <circle cx="8" cy="7" r="1" fill="currentColor" stroke="none" />
//     </svg>
//   ),
//   community: (
//     // people/community icon
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

// // ─── Deterministic avatar bg color from name (like screenshot's SC, YC, Accel) 
// const AVATAR_PALETTES = [
//   { bg: 'bg-gray-900',   text: 'text-white'      }, // Sequoia = dark
//   { bg: 'bg-orange-500', text: 'text-white'       }, // YC = orange
//   { bg: 'bg-blue-600',   text: 'text-white'       },
//   { bg: 'bg-emerald-600',text: 'text-white'       },
//   { bg: 'bg-violet-600', text: 'text-white'       },
//   { bg: 'bg-rose-500',   text: 'text-white'       },
//   { bg: 'bg-amber-500',  text: 'text-white'       },
//   { bg: 'bg-cyan-600',   text: 'text-white'       },
// ];

// function getAvatarPalette(name: string) {
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
// }

// // ─── Avatar component ────────────────────────────────────────────────────────
// function Avatar({ src, name }: { src: string | null; name: string }) {
//   const initials = name
//     .split(' ')
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((w) => w[0].toUpperCase())
//     .join('');

//   const { bg, text } = getAvatarPalette(name);

//   if (src) {
//     return (
//       <img
//         src={src}
//         alt={name}
//         className="h-11 w-11 rounded-full object-cover shrink-0 ring-1 ring-black/5"
//       />
//     );
//   }

//   return (
//     <div className={`h-11 w-11 rounded-full ${bg} ${text} flex items-center justify-center text-sm font-bold shrink-0 ring-1 ring-black/5`}>
//       {initials || '?'}
//     </div>
//   );
// }

// // ─── Blue verified checkmark — exact to screenshot ───────────────────────────
// function VerifiedBadge() {
//   return (
//     <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none">
//       <circle cx="8" cy="8" r="7" fill="#2563EB" />
//       <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }

// // ─── Connect rocket icon — matches screenshot blue button icon ────────────────
// function RocketIcon() {
//   return (
//     <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M7 1s3.5 1 3.5 5L7 10 3.5 6C3.5 2 7 1 7 1z" />
//       <path d="M4.5 9.5l-2 2M9.5 9.5l2 2" />
//       <circle cx="7" cy="5.5" r="1" fill="currentColor" stroke="none" />
//     </svg>
//   );
// }

// // ─── Profile card — pixel matched to screenshot ───────────────────────────────
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

// function ProfileCard({ profile }: { profile: NetworkProfile }) {
//   const sendInterest = useSendInterest();

//   const handleConnect = () => {
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
//     <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 gap-3 hover:shadow-md transition-shadow">

//       {/* ── Row 1: Avatar + Name + Role ── */}
//       <div className="flex items-start gap-3">
//         <Avatar src={profile.avatar} name={profile.name} />
//         <div className="min-w-0 flex-1 pt-0.5">
//           {/* Name + verified badge on same line */}
//           <div className="flex items-center gap-1 flex-wrap">
//             <span className="text-[13px] font-semibold text-gray-900 leading-snug">
//               {profile.name}
//             </span>
//             {profile.is_verified && <VerifiedBadge />}
//           </div>
//           {/* Role label: "VC Firm" / "Accelerator" etc */}
//           <p className="text-[11px] text-gray-400 mt-0.5 leading-none">
//             {profile.role_label}
//           </p>
//         </div>
//       </div>

//       {/* ── Row 2: Bio text ── */}
//       <p className="text-[12px] text-gray-500 leading-[1.55] line-clamp-3 min-h-[3.6rem]">
//         {profile.bio || 'No description yet.'}
//       </p>

//       {/* ── Row 3: Stage/focus tags ── */}
//       {profile.tags.length > 0 && (
//         <div className="flex flex-wrap gap-1.5">
//           {profile.tags.slice(0, 3).map((tag) => (
//             <span
//               key={tag}
//               className="text-[11px] font-medium px-2.5 py-[3px] rounded-full bg-gray-100 text-gray-500 border border-gray-200"
//             >
//               {tag}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* ── Row 4: Action buttons — full width, equal split ── */}
//       <div className="flex gap-2 mt-auto pt-0.5">
//         {/* View Profile — outline */}
//         <Link
//           to={`/profile/${profile.user_id}`}
//           className="flex-1 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-[12px] font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//         >
//           View Profile
//         </Link>
//         {/* Connect — blue filled with rocket icon */}
//         <button
//           onClick={handleConnect}
//           disabled={sendInterest.isPending}
//           className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium transition-colors disabled:opacity-60"
//         >
//           <RocketIcon />
//           Connect
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Skeleton — same layout as real card ─────────────────────────────────────
// function CardSkeleton() {
//   return (
//     <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 gap-3 animate-pulse">
//       <div className="flex items-start gap-3">
//         <div className="h-11 w-11 rounded-full bg-gray-200 shrink-0" />
//         <div className="flex-1 pt-0.5 space-y-1.5">
//           <div className="h-3.5 w-28 bg-gray-200 rounded" />
//           <div className="h-3 w-14 bg-gray-100 rounded" />
//         </div>
//       </div>
//       <div className="space-y-1.5">
//         <div className="h-3 w-full bg-gray-100 rounded" />
//         <div className="h-3 w-5/6 bg-gray-100 rounded" />
//         <div className="h-3 w-4/6 bg-gray-100 rounded" />
//       </div>
//       <div className="flex gap-1.5">
//         <div className="h-5 w-20 bg-gray-100 rounded-full" />
//         <div className="h-5 w-16 bg-gray-100 rounded-full" />
//       </div>
//       <div className="flex gap-2 mt-auto pt-0.5">
//         <div className="flex-1 h-8 bg-gray-100 rounded-lg" />
//         <div className="flex-1 h-8 bg-gray-200 rounded-lg" />
//       </div>
//     </div>
//   );
// }

// // ─── Dot pagination — matches the 4-dot indicator in screenshot ───────────────
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
//             i + 1 === current
//               ? 'w-5 h-2 bg-gray-800'
//               : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
//           }`}
//           aria-label={`Page ${i + 1}`}
//         />
//       ))}
//     </div>
//   );
// }

// // ─── Main section ─────────────────────────────────────────────────────────────
// export function NetworkingOpportunitiesSection() {
//   const [activeTab, setActiveTab] = useState<NetworkTab>('investor');
//   const [page, setPage] = useState(1);

//   const { data, isLoading, isError } = useNetworkDiscover({ tab: activeTab, page });

//   const profiles = data?.results ?? [];
//   const numPages  = data?.num_pages ?? 1;

//   const handleTabChange = (tab: NetworkTab) => {
//     setActiveTab(tab);
//     setPage(1);
//   };

//   return (
//     <section>
//       {/* ── Section header ── */}
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h2 className="text-[17px] font-bold text-gray-900">
//             Networking &amp; Opportunities
//           </h2>
//           <p className="text-[13px] text-gray-500 mt-0.5">
//             Connect with investors, mentors, partners and explore opportunities.
//           </p>
//         </div>
//         <Link
//           to="/network"
//           className="hidden md:inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:text-blue-500 transition-colors shrink-0 mt-1"
//         >
//           View all networking <ArrowRight className="h-3.5 w-3.5" />
//         </Link>
//       </div>

//       {/* ── Tab pills — match screenshot exactly ── */}
//       <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
//         {TABS.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => handleTabChange(tab.key)}
//             className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium px-4 py-[7px] rounded-full border transition-all shrink-0 ${
//               activeTab === tab.key
//                 ? 'bg-gray-900 text-white border-gray-900'
//                 : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-800'
//             }`}
//           >
//             {TAB_ICONS[tab.key]}
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* ── Card grid: 4 columns on desktop ── */}
//       <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//         {isLoading
//           ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
//           : isError
//           ? null
//           : profiles.map((p) => <ProfileCard key={p.id} profile={p} />)}
//       </div>

//       {/* ── Empty state ── */}
//       {!isLoading && !isError && profiles.length === 0 && (
//         <div className="mt-6 flex flex-col items-center gap-2 py-10 text-center">
//           <Globe className="h-8 w-8 text-gray-300" />
//           <p className="text-sm text-gray-400">
//             No {TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} yet.
//           </p>
//           <p className="text-xs text-gray-300">Check back soon — more are joining every day.</p>
//         </div>
//       )}

//       {/* ── Pagination dots ── */}
//       <DotPagination total={numPages} current={page} onChange={setPage} />

//       {/* ── Mobile "view all" ── */}
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


import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNetworkDiscover } from '@/hooks/useNetworkDiscover';
import type { NetworkTab } from '@/api/profiles';
import { useSendInterest } from '@/hooks/useSendInterest';
import { toast } from 'sonner';

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS: { key: NetworkTab; label: string; emoji: string; count: string; desc: string }[] = [
  { key: 'investor',    label: 'Investors',     emoji: '💼', count: '240+', desc: 'VC firms & angel investors' },
  { key: 'mentor',      label: 'Mentors',       emoji: '🎯', count: '380+', desc: 'Domain experts & advisors' },
  { key: 'partner',     label: 'Partners',      emoji: '🤝', count: '120+', desc: 'Ecosystem & growth partners' },
  { key: 'accelerator', label: 'Accelerators',  emoji: '🚀', count: '60+',  desc: 'Programs & cohorts' },
  { key: 'community',   label: 'Communities',   emoji: '🌐', count: '90+',  desc: 'Founder & domain networks' },
];

const PALETTES = [
  { bg: '#111827', fg: '#fff', ring: '#374151' },
  { bg: '#F97316', fg: '#fff', ring: '#EA580C' },
  { bg: '#2563EB', fg: '#fff', ring: '#1D4ED8' },
  { bg: '#059669', fg: '#fff', ring: '#047857' },
  { bg: '#7C3AED', fg: '#fff', ring: '#6D28D9' },
  { bg: '#DB2777', fg: '#fff', ring: '#BE185D' },
  { bg: '#D97706', fg: '#fff', ring: '#B45309' },
  { bg: '#0891B2', fg: '#fff', ring: '#0E7490' },
];

function getPalette(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return PALETTES[Math.abs(h) % PALETTES.length];
}

type NetworkProfile = {
  id: number; user_id: number; name: string; role: string;
  role_label: string; org_name: string; avatar: string | null;
  bio: string; tags: string[]; is_verified: boolean;
  location: string; website: string;
};

// ─── Verified badge ───────────────────────────────────────────────────────────
function VerifiedBadge() {
  return (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0" fill="none">
      <circle cx="7" cy="7" r="7" fill="#2563EB" />
      <path d="M4.2 7.2l2 1.8 3.6-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Profile card — premium version ──────────────────────────────────────────
function ProfileCard({ profile, index }: { profile: NetworkProfile; index: number }) {
  const sendInterest = useSendInterest();
  const palette = getPalette(profile.name);
  const initials = profile.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = useCallback(() => {
    setConnecting(true);
    sendInterest.mutate(
      {
        receiverId: profile.user_id,
        subject: 'Connection request from PitchIn',
        message: `Hi ${profile.name}, I'd like to connect with you on PitchIn.`,
        tag: 'collaboration',
      },
      {
        onSuccess: () => {
          toast.success(`Request sent to ${profile.name}`);
          setConnected(true);
          setConnecting(false);
        },
        onError: () => {
          toast.error('Could not send request. Please try again.');
          setConnecting(false);
        },
      }
    );
  }, [profile, sendInterest]);

  return (
    <div
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-100 hover:border-gray-200 hover:-translate-y-1"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Color band top */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${palette.bg}, ${palette.ring})` }} />

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name}
              className="h-12 w-12 rounded-xl object-cover shrink-0 ring-2 ring-gray-100" />
          ) : (
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0 ring-2"
              style={{ background: palette.bg, color: palette.fg }}
            >
              {initials || '?'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[13px] font-bold text-gray-900 leading-tight">{profile.name}</span>
              {profile.is_verified && <VerifiedBadge />}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 font-semibold uppercase tracking-wide">{profile.role_label}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-[12px] text-gray-500 leading-[1.65] line-clamp-3 flex-1">
          {profile.bio || 'No description yet.'}
        </p>

        {/* Tags */}
        {profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100 tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Location */}
        {profile.location && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>{profile.location}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1 mt-auto">
          <Link
            to={`/profile/${profile.user_id}`}
            className="flex-1 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-[12px] font-bold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
          >
            View Profile
          </Link>
          <button
            onClick={handleConnect}
            disabled={connecting || connected}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 disabled:opacity-70"
            style={connected
              ? { background: '#ECFDF5', color: '#059669', border: '1px solid #D1FAE5' }
              : { background: '#111827', color: '#fff' }
            }
          >
            {connected ? '✓ Sent' : connecting ? '...' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-1.5 w-full bg-gray-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-28 bg-gray-100 rounded" />
            <div className="h-3 w-16 bg-gray-50 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-50 rounded" />
          <div className="h-3 w-5/6 bg-gray-50 rounded" />
          <div className="h-3 w-4/6 bg-gray-50 rounded" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-16 bg-gray-50 rounded-full" />
          <div className="h-5 w-14 bg-gray-50 rounded-full" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-gray-50 rounded-xl" />
          <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export function NetworkingOpportunitiesSection() {
  const [activeTab, setActiveTab] = useState<NetworkTab>('investor');
  const [page, setPage] = useState(1);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  const { data, isLoading, isError } = useNetworkDiscover({ tab: activeTab, page });
  const profiles = data?.results ?? [];
  const numPages = data?.num_pages ?? 1;

  const active = TABS.find(t => t.key === activeTab)!;

  // Floating pill indicator
  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const idx = TABS.findIndex(t => t.key === activeTab);
    const btn = bar.querySelectorAll('[data-tab]')[idx] as HTMLElement;
    if (btn) setPillStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [activeTab]);

  const handleTabChange = (tab: NetworkTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <section>
      {/* Section header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
            Networking & Opportunities
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {active.count} {active.desc} — find your next connection.
          </p>
        </div>
        <Link to="/network" className="hidden md:inline-flex items-center gap-1 text-[12px] font-bold text-gray-900 border border-gray-200 rounded-xl px-3.5 py-2 hover:bg-gray-50 transition-colors">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Tab bar — floating pill style */}
      <div className="relative mb-6">
        <div
          className="absolute top-0 bottom-0 rounded-xl bg-gray-950 transition-all duration-300 ease-out pointer-events-none"
          style={{ left: pillStyle.left, width: pillStyle.width }}
        />
        <div
          ref={tabBarRef}
          className="relative flex gap-1 bg-gray-50 rounded-2xl p-1 overflow-x-auto scrollbar-none"
        >
          {TABS.map(tab => (
            <button
              key={tab.key}
              data-tab={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`inline-flex items-center gap-2 whitespace-nowrap text-[12px] font-bold px-4 py-2.5 rounded-xl transition-colors duration-200 shrink-0 ${
                activeTab === tab.key ? 'text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="text-sm leading-none">{tab.emoji}</span>
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : isError ? null
          : profiles.map((p, i) => <ProfileCard key={p.id} profile={p} index={i} />)}
      </div>

      {/* Empty state */}
      {!isLoading && !isError && profiles.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <Globe className="h-6 w-6 text-gray-200" />
          </div>
          <p className="text-[14px] font-semibold text-gray-400">No {active.label.toLowerCase()} yet</p>
          <p className="text-[12px] text-gray-300">More are joining every day.</p>
        </div>
      )}

      {/* Pagination */}
      {numPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-7">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: numPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`rounded-full transition-all duration-200 ${
                  i + 1 === page ? 'w-6 h-2.5 bg-gray-900' : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setPage(p => Math.min(numPages, p + 1))}
            disabled={page === numPages}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex md:hidden justify-center mt-5">
        <Link to="/network" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-gray-900">
          View all networking <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
