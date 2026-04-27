import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Zap, UserPlus, X, Briefcase, Users as UsersIcon, Lightbulb, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useFollowStatus, useFollowRequest } from '@/hooks/useFollow';
import { cn } from '@/lib/utils';

type RecTab = 'opportunities' | 'people' | 'insights';

function PersonRow({
  user,
  currentUserId,
  onDismiss,
}: {
  user: { id: string; full_name: string | null; avatar_url: string | null; bio?: string | null };
  currentUserId: string | undefined;
  onDismiss: (id: string) => void;
}) {
  const { data: followStatus } = useFollowStatus(user.id);
  const followRequest = useFollowRequest();

  const initials =
    user.full_name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?';

  const isOwnProfile = currentUserId === user.id;
  const canFollow = !isOwnProfile && followStatus === 'none';

  return (
    <div className="group flex items-start gap-3 px-1 py-2.5 hover:bg-muted/40 rounded-lg transition-colors">
      <button
        onClick={() => (window.location.href = `/profile/${user.id}`)}
        className="shrink-0"
      >
        <Avatar className="h-11 w-11">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>
      <div className="flex-1 min-w-0">
        <button
          onClick={() => (window.location.href = `/profile/${user.id}`)}
          className="block text-left w-full"
        >
          <p className="text-sm font-semibold text-foreground truncate leading-tight">
            {user.full_name || 'Anonymous User'}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {user.bio || 'Member of Pitch In'}
          </p>
        </button>
        {canFollow && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              followRequest.mutate({ followingId: Number(user.id) });
            }}
            disabled={followRequest.isPending}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
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
        onClick={() => onDismiss(user.id)}
        className="shrink-0 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

const TABS: { id: RecTab; label: string; icon: typeof Briefcase }[] = [
  { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  { id: 'people', label: 'People', icon: UsersIcon },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

const TAB_SUBTITLE: Record<RecTab, string> = {
  opportunities: 'Opportunities for you',
  people: 'People to connect with',
  insights: 'Insights worth your time',
};

export function FeedRightSidebar() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<RecTab>('people');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const { data: recommendedUsers = [] } = useQuery({
    queryKey: ['recommended-users', user?.id],
    queryFn: async () => {
      // TODO: connect to backend API
      return  [];
    },
    enabled: !!user,
  });

  const visibleUsers = recommendedUsers.filter((u) => !dismissed.has(u.id));

  return (
    <aside className="w-[22rem] shrink-0 space-y-4 sticky top-20 h-fit">
      {/* Recommended For You */}
      {user && (
        <Card className="bg-card border-border/40 rounded-2xl shadow-sm p-4">
          {/* Title */}
          <h3 className="text-sm font-semibold text-foreground mb-3 px-1">
            Recommended for You
          </h3>

          {/* Toggle pills */}
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

          {/* Subtitle */}
          <div className="flex items-center justify-between px-1 mb-1">
            <p className="text-xs text-muted-foreground">{TAB_SUBTITLE[activeTab]}</p>
          </div>

          {/* Content list */}
          <div className="divide-y divide-border/40">
            {activeTab === 'people' &&
              (visibleUsers.length > 0 ? (
                visibleUsers
                  .slice(0, 5)
                  .map((recUser) => (
                    <PersonRow
                      key={recUser.id}
                      user={recUser}
                      currentUserId={user?.id?.toString()}
                      onDismiss={(id) =>
                        setDismissed((prev) => new Set(prev).add(id))
                      }
                    />
                  ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No more suggestions right now.
                </p>
              ))}

            {activeTab === 'opportunities' && (
              <div className="text-center py-8 px-2">
                <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  No opportunities available yet.
                </p>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="text-center py-8 px-2">
                <Lightbulb className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  Insights coming soon.
                </p>
              </div>
            )}
          </div>

          {/* See more */}
          {activeTab === 'people' && visibleUsers.length > 5 && (
            <button className="w-full flex items-center justify-center gap-1 text-xs font-medium text-primary hover:underline mt-3 py-2">
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
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Permanent, persistent feed
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Discover relevant people
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Connect with interested parties
          </li>
        </ul>
      </Card>

      {/* Footer Links */}
      <div className="text-xs text-muted-foreground space-y-2 px-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:text-foreground transition-colors">About</a>
          <a href="#" className="hover:text-foreground transition-colors">Help</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </div>
        <p>© 2024 Pitch In</p>
      </div>
    </aside>
  );
}
