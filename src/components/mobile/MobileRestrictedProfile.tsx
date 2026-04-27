import { motion } from 'framer-motion';
import { Lock, UserPlus, Clock, UserMinus, Loader2, ArrowLeft, MapPin, UserCheck, Users, Flame, Bookmark, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/RoleBadge';
import { UserRole } from '@/hooks/useUserRole';
import { useFollowStatus, useFollowRequest, useUnfollow, useReverseFollowStatus } from '@/hooks/useFollow';
import { useNavigate } from 'react-router-dom';
import { RoleAboutCard } from '@/components/profile/RoleAboutCard';
import { useRoleProfile } from '@/hooks/useRoleProfile';

interface MobileRestrictedProfileProps {
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

export function MobileRestrictedProfile({
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
}: MobileRestrictedProfileProps) {
  const navigate = useNavigate();
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
        <Button variant="default" size="sm" disabled>
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
          <Button variant="secondary" size="sm" disabled>
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
    <div className="min-h-screen bg-background pb-24 w-full max-w-full overflow-x-hidden">
      {/* Header with Banner */}
      <div className="relative w-full">
        {/* Banner */}
        <div 
          className="h-28 w-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10"
          style={bannerUrl ? { 
            backgroundImage: `url(${bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        />
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 p-2 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </motion.button>
      </div>

      {/* Profile Content - Full width white background */}
      <div className="bg-card w-full">
        <div className="px-4 pb-4">
          {/* Avatar and Follow Button Row */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="-mt-12 flex items-end justify-between"
          >
          <Avatar className="h-28 w-28 border-4 border-card shadow-lg flex-shrink-0">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
            
            {/* Follow Button */}
            <div className="pb-1 flex-shrink-0">
              {renderFollowButton()}
            </div>
          </motion.div>

          {/* Name and Role */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-3"
          >
            <h1 className="font-display text-lg font-bold text-foreground leading-tight break-words">
              {fullName || 'Anonymous User'}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {role && <RoleBadge role={role} size="sm" />}
              {location && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location}
                </span>
              )}
            </div>
          </motion.div>

          {/* Bio */}
          {bio && (
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18 }}
              className="mt-2 text-sm text-muted-foreground leading-relaxed break-words"
            >
              {bio}
            </motion.p>
          )}
        </div>
      </div>

      {/* Stats Grid - Full width with white background */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-4 w-full bg-card py-3 border-t border-border/30"
      >
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">{pitchCount}</p>
          <p className="text-[10px] text-muted-foreground">Pitches</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground flex items-center justify-center gap-0.5">
            <Flame className="h-3 w-3 text-primary" />
            {totalReactions}
          </p>
          <p className="text-[10px] text-muted-foreground">Reactions</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">{followersCount}</p>
          <p className="text-[10px] text-muted-foreground">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">{followingCount}</p>
          <p className="text-[10px] text-muted-foreground">Following</p>
        </div>
      </motion.div>

      {/* Role About Card - Full width */}
      {role && roleProfile && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="mt-2 w-full bg-card border-t border-border/30"
        >
          <RoleAboutCard role={role} roleProfile={roleProfile} isMobile />
        </motion.div>
      )}

      {/* Restricted Notice Card - Full width */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-2 p-4 w-full bg-card border-t border-border/30"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-muted/50 border border-border/30">
            <StatusIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center px-4">
            <h3 className="font-medium text-foreground mb-1">{statusInfo.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {statusInfo.message}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}