import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Zap, UserPlus, X, Briefcase, Users as UsersIcon,
  Lightbulb, ArrowRight, ExternalLink, Newspaper,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useFollowStatus, useFollowRequest } from '@/hooks/useFollow';
import { apiFetch } from '@/api/client';
import { cn } from '@/lib/utils';

type RecTab = 'opportunities' | 'people' | 'insights';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicProfile {
  id: number;           // profile row id (not user id)
  user_id: number;      // actual Django user id — added to serializer
  user_name: string | null;
  user_email: string;
  avatar: string | null;
  bio: string | null;
  role: string;
}

interface OpportunityPost {
  id: number;
  title: string;
  content: string;
  author_name: string;
  author_avatar: string | null;
  author_id: number;
  created_at: string;
}

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  source_url: string;
  source_name: string;
  image_url: string | null;
  published_at: string;
}

// ─── PersonRow ────────────────────────────────────────────────────────────────

function PersonRow({
  profile,
  currentUserId,
  onDismiss,
}: {
  profile: PublicProfile;
  currentUserId: number | undefined;
  onDismiss: (id: number) => void;
}) {
  // user_id is the real Django user id for navigation + follow
  const userId = profile.user_id;
  const { data: followStatus } = useFollowStatus(String(userId));
  const followRequest = useFollowRequest();

  const name = profile.user_name || 'Anonymous';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const isOwnProfile = currentUserId === userId;
  const canFollow = !isOwnProfile && followStatus === 'none';
  const roleLabel = profile.role?.replace('_', ' ') ?? '';

  return (
    <div className="group flex items-start gap-3 px-1 py-2.5 hover:bg-muted/40 rounded-lg transition-colors">
      <button onClick={() => (window.location.href = `/profile/${userId}`)} className="shrink-0">
        <Avatar className="h-11 w-11">
          <AvatarImage src={profile.avatar || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
        </Avatar>
      </button>

      <div className="flex-1 min-w-0">
        <button
          onClick={() => (window.location.href = `/profile/${userId}`)}
          className="block text-left w-full"
        >
          <p className="text-sm font-semibold text-foreground truncate leading-tight">{name}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5 capitalize">
            {roleLabel}{profile.bio ? ` · ${profile.bio}` : ''}
          </p>
        </button>

        {canFollow && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              followRequest.mutate({ followingId: userId });
            }}
            disabled={followRequest.isPending}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-50"
          >
            <UserPlus className="h-3 w-3" />
            Follow
          </button>
        )}
        {followStatus === 'pending' && (
          <span className="mt-1.5 inline-block text-xs text-muted-foreground">Pending</span>
        )}
        {followStatus === 'accepted' && (
          <span className="mt-1.5 inline-block text-xs text-primary font-medium">Following</span>
        )}
      </div>

      <button
        onClick={() => onDismiss(profile.id)}
        className="shrink-0 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── OpportunityRow ───────────────────────────────────────────────────────────

function OpportunityRow({ post }: { post: OpportunityPost }) {
  const initials = post.author_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return (
    <button
      onClick={() => (window.location.href = `/feed`)}
      className="w-full flex items-start gap-3 px-1 py-2.5 hover:bg-muted/40 rounded-lg transition-colors text-left"
    >
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={post.author_avatar || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
          {post.title || post.content?.slice(0, 80)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{post.author_name}</p>
      </div>
    </button>
  );
}

// ─── InsightRow ───────────────────────────────────────────────────────────────

function InsightRow({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 px-1 py-2.5 hover:bg-muted/40 rounded-lg transition-colors"
    >
      {article.image_url ? (
        <img src={article.image_url} alt="" loading="lazy" className="h-12 w-12 rounded-lg object-cover shrink-0 bg-muted " />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Newspaper className="h-5 w-5 text-primary/60" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{article.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          {article.source_name}
          <ExternalLink className="h-2.5 w-2.5" />
        </p>
      </div>
    </a>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { id: RecTab; label: string; icon: typeof Briefcase }[] = [
  { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  { id: 'people',        label: 'People',        icon: UsersIcon  },
  { id: 'insights',      label: 'Insights',      icon: Lightbulb  },
];

const TAB_SUBTITLE: Record<RecTab, string> = {
  opportunities: 'Opportunities for you',
  people:        'People to connect with',
  insights:      'Insights worth your time',
};

// ─── Main sidebar ─────────────────────────────────────────────────────────────

export function FeedRightSidebar() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<RecTab>('people');
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  // People — cached for a minute; still feels fresh to users but avoids
  // refetching from scratch every single time they navigate back here.
  const { data: peopleData = [], isLoading: peopleLoading } = useQuery({
    queryKey: ['recommended-people', user?.id],
    queryFn: () => apiFetch<PublicProfile[]>('/profiles/public/'),
    enabled: !!user,
    staleTime: 60_000,
    gcTime: 2 * 60_000,
  });

  // Opportunities — lazy, only fetches when tab is active
  const { data: opportunitiesData = [], isLoading: oppsLoading } = useQuery({
    queryKey: ['recommended-opportunities'],
    queryFn: () =>
      apiFetch<{ results?: OpportunityPost[] } | OpportunityPost[]>(
        '/feed/?post_type=opportunity&ordering=-created_at&page_size=6'
      ).then((res) => (Array.isArray(res) ? res : res.results ?? [])),
    enabled: !!user && activeTab === 'opportunities',
    staleTime: 0,
  });

  // Insights — lazy, only fetches when tab is active
  const { data: insightsData = [], isLoading: insightsLoading } = useQuery({
    queryKey: ['recommended-insights'],
    queryFn: () =>
      apiFetch<{ results?: NewsArticle[] } | NewsArticle[]>(
        '/news/?ordering=-published_at&page_size=6'
      ).then((res) => (Array.isArray(res) ? res : res.results ?? [])),
    enabled: !!user && activeTab === 'insights',
    staleTime: 0,
  });

  // Filter out own profile + dismissed, show 6
  const visiblePeople = peopleData
    .filter((p) => p.user_id !== user?.id)
    .filter((p) => !dismissed.has(p.id))
    .slice(0, 6);

  return (
    <aside className="w-[20rem] shrink-0 space-y-4 sticky top-[88px] self-start max-h-[calc(100vh-88px)] overflow-y-auto">

      {user && (
        <Card className="bg-card border-border/40 rounded-2xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 px-1">Recommended for You</h3>

          {/* Tab bar */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1 mb-3">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 h-8 rounded-full text-xs font-medium transition-all',
                    isActive
                      ? 'bg-card text-primary shadow-sm border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground px-1 mb-1">{TAB_SUBTITLE[activeTab]}</p>

          {/* People tab */}
          {activeTab === 'people' && (
            <div className="divide-y divide-border/40">
              {peopleLoading ? (
                <PeopleSkeletons />
              ) : visiblePeople.length > 0 ? (
                visiblePeople.map((p) => (
                  <PersonRow
                    key={p.id}
                    profile={p}
                    currentUserId={user?.id}
                    onDismiss={(id) => setDismissed((prev) => new Set(prev).add(id))}
                  />
                ))
              ) : (
                <EmptyState icon={UsersIcon} message="No more suggestions right now." />
              )}
            </div>
          )}

          {/* Opportunities tab */}
          {activeTab === 'opportunities' && (
            <div className="divide-y divide-border/40">
              {oppsLoading ? (
                <CardSkeletons />
              ) : opportunitiesData.length > 0 ? (
                opportunitiesData.map((post) => <OpportunityRow key={post.id} post={post} />)
              ) : (
                <EmptyState icon={Briefcase} message="No opportunities posted yet." />
              )}
            </div>
          )}

          {/* Insights tab */}
          {activeTab === 'insights' && (
            <div className="divide-y divide-border/40">
              {insightsLoading ? (
                <CardSkeletons />
              ) : insightsData.length > 0 ? (
                insightsData.map((article) => <InsightRow key={article.id} article={article} />)
              ) : (
                <EmptyState icon={Lightbulb} message="No insights available yet." />
              )}
            </div>
          )}

          {activeTab === 'people' && visiblePeople.length >= 6 && (
            <button
              onClick={() => (window.location.href = '/explore')}
              className="w-full flex items-center justify-center gap-1 text-xs font-medium text-primary hover:underline mt-3 py-2"
            >
              See more <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </Card>
      )}

      {/* About Pitch In */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-0 shadow-none rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">About Pitch In</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Share your idea in seconds. Get instant feedback from a community of founders and investors.
        </p>
        <ul className="text-xs space-y-2 text-muted-foreground">
          {['Permanent, persistent feed', 'Discover relevant people', 'Connect with interested parties'].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {/* Footer */}
      <div className="text-xs text-muted-foreground space-y-2 px-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {['About', 'Help', 'Privacy', 'Terms'].map((l) => (
            <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
          ))}
        </div>
        <p>© {new Date().getFullYear()} Pitch In</p>
      </div>
    </aside>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function EmptyState({ icon: Icon, message }: { icon: typeof Briefcase; message: string }) {
  return (
    <div className="text-center py-8 px-2">
      <Icon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

function PeopleSkeletons() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-3 px-1 py-2.5 animate-pulse">
          <div className="h-11 w-11 rounded-full bg-muted shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-2 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}

function CardSkeletons() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3 px-1 py-2.5 animate-pulse">
          <div className="h-12 w-12 rounded-lg bg-muted shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-2/3" />
            <div className="h-2 bg-muted rounded w-1/3" />
          </div>
        </div>
      ))}
    </>
  );
}