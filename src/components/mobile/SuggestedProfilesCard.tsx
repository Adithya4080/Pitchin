import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/RoleBadge';
import { useFollowRequest, useFollowStatus } from '@/hooks/useFollow';
import { useAuth } from '@/hooks/useAuth';
import { SuggestedProfile } from '@/hooks/useSuggestedProfiles';

function ProfileCard({ profile }: { profile: SuggestedProfile }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: followStatus } = useFollowStatus(profile.id);
  const followRequest = useFollowRequest();

  const initials = profile.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  const roleLabel: Record<string, string> = {
    startup: 'Startup',
    investor: 'Investor',
    ecosystem_partner: 'Ecosystem Partner',
    innovator: 'Innovator',
    consultant: 'Consultant',
  };

  const isFollowed = followStatus === 'accepted' || followStatus === 'pending';

  return (
    <div
      className="flex-shrink-0 w-36 bg-background rounded-xl border border-border/60 p-3 flex flex-col items-center gap-2 snap-start"
    >
      <button
        onClick={() => navigate(`/profile/${profile.id}`)}
        className="flex flex-col items-center gap-1.5 w-full touch-manipulation"
      >
        <Avatar className="h-14 w-14 ring-2 ring-border/40">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs font-semibold text-foreground text-center line-clamp-1 w-full">
          {profile.full_name || 'User'}
        </span>
        {profile.role && (
          <span className="text-[10px] text-muted-foreground font-medium">
            {roleLabel[profile.role] || profile.role}
          </span>
        )}
      </button>
      <p className="text-[10px] text-muted-foreground text-center line-clamp-2 min-h-[24px] w-full">
        {profile.bio || 'No bio yet'}
      </p>
      <Button
        size="sm"
        variant={isFollowed ? 'outline' : 'default'}
        className="w-full h-7 text-[10px] rounded-full mt-auto"
        disabled={isFollowed || followRequest.isPending}
        onClick={(e) => {
          e.stopPropagation();
          if (!isFollowed && user) {
            followRequest.mutate({ followingId: profile.id });
          }
        }}
      >
        {followStatus === 'pending' ? 'Pending' : followStatus === 'accepted' ? 'Following' : (
          <>
            <UserPlus className="h-3 w-3 mr-1" />
            Follow
          </>
        )}
      </Button>
    </div>
  );
}

interface SuggestedProfilesCardProps {
  profiles: SuggestedProfile[];
}

export function SuggestedProfilesCard({ profiles }: SuggestedProfilesCardProps) {
  if (!profiles.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-3 px-4 bg-card border-b border-border/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-foreground">Suggested for you</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </motion.div>
  );
}
