import { Lock, UserPlus, Clock, UserMinus, Loader2, UserCheck, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/RoleBadge';
import { UserRole } from '@/hooks/useUserRole';
import { useFollowStatus, useFollowRequest, useUnfollow, useReverseFollowStatus, FollowStatus } from '@/hooks/useFollow';
import { RoleAboutCard } from './RoleAboutCard';
import { useRoleProfile } from '@/hooks/useRoleProfile';

interface RestrictedProfilePreviewProps {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  role?: UserRole | null;
  followersCount: number;
  followingCount: number;
  pitchCount?: number;
  totalReactions?: number;
  totalSaves?: number;
}

export function RestrictedProfilePreview({
  userId,
  fullName,
  avatarUrl,
  bannerUrl,
  bio,
  location,
  role,
  followersCount,
  followingCount,
  pitchCount = 0,
  totalReactions = 0,
  totalSaves = 0,
}: RestrictedProfilePreviewProps) {
  const { data: myFollowStatus, isLoading: myStatusLoading } = useFollowStatus(userId);
  const { data: theirFollowStatus, isLoading: theirStatusLoading } = useReverseFollowStatus(userId);
  const followRequest = useFollowRequest();
  const unfollow = useUnfollow();
  const { roleProfile } = useRoleProfile(userId);

  const isFollowLoading = followRequest.isPending || unfollow.isPending || myStatusLoading;
  const statusLoading = myStatusLoading || theirStatusLoading;

  const handleFollow = () => {
    followRequest.mutate({ followingId: Number(userId) });
  };

  const handleUnfollow = () => {
    unfollow.mutate(Number(userId));
  };

  const initials = fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  const getStatusInfo = () => {
    // Both follow each other - should not show this component
    if (myFollowStatus === 'accepted' && theirFollowStatus === 'accepted') {
      return {
        icon: Users,
        title: 'Mutual Connection',
        message: "You're connected! Full profile access granted.",
      };
    }
    
    // I follow them, they don't follow me yet
    if (myFollowStatus === 'accepted' && theirFollowStatus !== 'accepted') {
      return {
        icon: UserCheck,
        title: 'Following',
        message: theirFollowStatus === 'pending' 
          ? "You're following this user. They've sent you a follow request - check your notifications!"
          : "You're following this user. Once they follow you back, you'll have full access.",
      };
    }
    
    // My follow is pending
    if (myFollowStatus === 'pending') {
      return {
        icon: Clock,
        title: 'Request Pending',
        message: theirFollowStatus === 'accepted'
          ? "They already follow you! Your request is pending - once approved, you'll be connected."
          : "Your follow request is pending approval.",
      };
    }
    
    // They follow me, I don't follow them
    if (theirFollowStatus === 'accepted' && myFollowStatus !== 'accepted') {
      return {
        icon: UserPlus,
        title: 'They Follow You',
        message: "This user follows you. Follow them back to unlock full profile access!",
      };
    }
    
    // They have pending request to me
    if (theirFollowStatus === 'pending') {
      return {
        icon: UserPlus,
        title: 'Pending Request',
        message: "This user wants to follow you! Check your notifications to respond.",
      };
    }
    
    // Default - no connection
    return {
      icon: Lock,
      title: 'Restricted Profile',
      message: "Follow this user to connect. Mutual follows unlock full profile access.",
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const renderFollowButton = () => {
    if (statusLoading) {
      return (
        <Button variant="default" size="sm" className="shrink-0" disabled>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading...
        </Button>
      );
    }

    switch (myFollowStatus) {
      case 'accepted':
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="shrink-0"
            onClick={handleUnfollow}
            disabled={isFollowLoading}
          >
            {unfollow.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UserMinus className="h-4 w-4 mr-2" />
            )}
            Unfollow
          </Button>
        );
      case 'pending':
        return (
          <Button variant="secondary" size="sm" className="shrink-0" disabled>
            <Clock className="h-4 w-4 mr-2" />
            Pending
          </Button>
        );
      case 'rejected':
      case 'none':
      default:
        return (
          <Button 
            variant="default" 
            size="sm" 
            className="shrink-0"
            onClick={handleFollow}
            disabled={isFollowLoading}
          >
            {followRequest.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : theirFollowStatus === 'accepted' ? (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Follow Back
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Header Card - Same as public profile */}
      <Card className="overflow-hidden border-border/50">
        {/* Banner */}
        <div 
          className="h-28 sm:h-36 relative bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10"
          style={bannerUrl ? { 
            backgroundImage: `url(${bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        />
        
        {/* Profile Identity */}
        <CardContent className="pt-4 pb-5">
          <div className="flex flex-col gap-4">
            {/* Top row: Avatar + Info + Follow Button */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative shrink-0 -mt-16 sm:-mt-20">
                  <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-lg">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Name, role, location */}
                <div className="pt-2 min-w-0 flex-1">
                  <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground truncate">
                    {fullName || 'Anonymous User'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {role && <RoleBadge role={role} size="sm" />}
                    {location && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Follow Button */}
              <div className="shrink-0 self-start sm:self-auto">
                {renderFollowButton()}
              </div>
            </div>

            {/* Bio */}
            {bio && (
              <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-5 pt-4 border-t border-border/50">
            <div className="text-center">
              <p className="font-bold text-lg text-foreground">{pitchCount}</p>
              <p className="text-xs text-muted-foreground">Pitches</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-foreground">{totalReactions}</p>
              <p className="text-xs text-muted-foreground">Reactions</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-foreground">{totalSaves}</p>
              <p className="text-xs text-muted-foreground">Saves</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-foreground flex items-center justify-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                {followersCount}
              </p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-foreground">{followingCount}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role About Card */}
      {role && roleProfile && (
        <RoleAboutCard role={role} roleProfile={roleProfile} />
      )}

      {/* Restricted Notice Card */}
      <Card className="border-border/50">
        <CardContent className="py-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-3 rounded-full bg-muted/50 border border-border/50">
              <StatusIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm mb-1">{statusInfo.title}</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {statusInfo.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}