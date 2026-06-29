import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { useNetworkDiscover } from '@/hooks/useNetworkDiscover';
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
    return <img src={src} alt={name} loading="lazy" className="h-11 w-11 rounded-full object-cover shrink-0 ring-1 ring-black/5" />;
  }
  return (
    <div className={`h-11 w-11 rounded-full ${bg} ${text} flex items-center justify-center text-sm font-bold shrink-0 ring-1 ring-black/5`}>
      {initials || '?'}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none">
      <circle cx="8" cy="8" r="7" fill="#2563EB" />
      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1s3.5 1 3.5 5L7 10 3.5 6C3.5 2 7 1 7 1z" />
      <path d="M4.5 9.5l-2 2M9.5 9.5l2 2" />
      <circle cx="7" cy="5.5" r="1" fill="currentColor" stroke="none" />
    </svg>
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

function ProfileCard({ profile }: { profile: NetworkProfile }) {
  const sendInterest = useSendInterest();

  const handleConnect = () => {
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
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <Avatar src={profile.avatar} name={profile.name} />
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[13px] font-semibold text-gray-900 leading-snug">{profile.name}</span>
            {profile.is_verified && <VerifiedBadge />}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5 leading-none">{profile.role_label}</p>
        </div>
      </div>
      <p className="text-[12px] text-gray-500 leading-[1.55] line-clamp-3 min-h-[3.6rem]">
        {profile.bio || 'No description yet.'}
      </p>
      {profile.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[11px] font-medium px-2.5 py-[3px] rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-auto pt-0.5">
        <Link
          to={`/profile/${profile.user_id}`}
          className="flex-1 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-[12px] font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          View Profile
        </Link>
        <button
          onClick={handleConnect}
          disabled={sendInterest.isPending}
          className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium transition-colors disabled:opacity-60"
        >
          <RocketIcon />
          Connect
        </button>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 gap-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 pt-0.5 space-y-1.5">
          <div className="h-3.5 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-14 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-5/6 bg-gray-100 rounded" />
        <div className="h-3 w-4/6 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
      </div>
      <div className="flex gap-2 mt-auto pt-0.5">
        <div className="flex-1 h-8 bg-gray-100 rounded-lg" />
        <div className="flex-1 h-8 bg-gray-200 rounded-lg" />
      </div>
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
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useNetworkDiscover({ tab: activeTab, page });

  const profiles = data?.results ?? [];
  const numPages  = data?.num_pages ?? 1;

  const handleTabChange = (tab: NetworkTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <section>
      {/* Section header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">
            Networking &amp; Opportunities
          </h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Connect with investors, mentors, partners and explore opportunities.
          </p>
        </div>
        <Link
          to="/network"
          className="hidden md:inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:text-blue-500 transition-colors shrink-0 mt-1"
        >
          View all networking <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Tabs — pointer-events-none so users cannot click */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pointer-events-none opacity-50">
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

      {/* Card grid with blur overlay */}
      <div className="relative mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : isError
            ? null
            : profiles.map((p) => <ProfileCard key={p.id} profile={p} />)}
        </div>

        {/* Empty state */}
        {!isLoading && !isError && profiles.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-2 py-10 text-center">
            <Globe className="h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-400">
              No {TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} yet.
            </p>
            <p className="text-xs text-gray-300">Check back soon — more are joining every day.</p>
          </div>
        )}

        {/* Blur overlay — visible but not interactive */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] rounded-xl z-10 cursor-not-allowed" />
      </div>

      {/* Dot pagination */}
      <DotPagination total={numPages} current={page} onChange={setPage} />

      {/* Mobile view all */}
      <div className="flex md:hidden justify-center mt-4">
        <Link
          to="/network"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          View all networking <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}