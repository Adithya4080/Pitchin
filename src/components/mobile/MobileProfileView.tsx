import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, MapPin, Mail, Globe, Linkedin, Twitter, 
  Edit2, Settings, UserPlus, UserMinus, Clock, Loader2,
  MessageCircle, FolderOpen, Users, Video, Play, X, Save, MoreVertical, Redo
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/RoleBadge';
import { UserRole } from '@/hooks/useUserRole';
import { ReactNode } from 'react';
import { useFollowStatus, useFollowRequest, useUnfollow, FollowStatus } from '@/hooks/useFollow';
import { Separator } from '@/components/ui/separator';
import { useProfileShare } from '@/hooks/useProfileShare';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Helper to get the section name based on role
const getPitchesSectionName = (role?: UserRole | null) => {
  return role === 'startup' ? 'Product' : 'Pitches';
};

// Mobile Video Section with thumbnail support
function MobileVideoSection({ introVideo }: { 
  introVideo: { 
    url?: string | null; 
    title?: string | null; 
    description?: string | null;
    thumbnailUrl?: string | null;
  } 
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-1 w-full bg-card border-t border-border/30"
    >
      <div className="px-4 py-4">
        <h3 className="text-sm font-bold text-foreground mb-2">
          Introduction
        </h3>
        {introVideo.description && (
          <p className="text-sm text-muted-foreground mb-3">{introVideo.description}</p>
        )}
        <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
          {!isPlaying && introVideo.thumbnailUrl ? (
            // Show thumbnail with play button
            <button
              onClick={() => setIsPlaying(true)}
              className="w-full h-full relative group"
            >
              <img
                src={introVideo.thumbnailUrl}
                alt={introVideo.title || 'Video thumbnail'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Play className="h-6 w-6 text-primary-foreground ml-1" fill="currentColor" />
                </div>
              </div>
            </button>
          ) : (
            // Show video player
            <video
              src={introVideo.url || ''}
              controls
              autoPlay={isPlaying}
              className="w-full h-full object-cover"
              playsInline
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface MobileProfileViewProps {
  fullName: string;
  email?: string;
  avatarUrl: string | null;
  bannerUrl?: string | null;
  location?: string | null;
  bio?: string | null;
  role?: UserRole | null;
  userId?: string;
  stats: {
    pitchCount: number;
    totalReactions: number;
    totalSaves: number;
    followersCount?: number;
    followingCount?: number;
    profileViews?: number;
    total?: number;
  };
  socialLinks?: {
    linkedin?: string | null;
    twitter?: string | null;
    website?: string | null;
    portfolio?: string | null;
    contactEmail?: string | null;
  };
  introVideo?: {
    url?: string | null;
    title?: string | null;
    description?: string | null;
    thumbnailUrl?: string | null;
  };
  roleSection?: ReactNode;
  portfolioSection?: ReactNode;
  teamSection?: ReactNode;
  pitchSection?: ReactNode;
  ecosystemPartnerSections?: ReactNode;
  pitchFeed?: ReactNode;
  onEditClick?: () => void;
  onEditIntroVideo?: () => void;
  onEditPortfolio?: () => void;
  onEditTeam?: () => void;
  // Edit state props for showing save/cancel buttons
  isEditingPortfolio?: boolean;
  isEditingTeam?: boolean;
  onSaveSection?: () => Promise<void>;
  onCancelSection?: () => void;
  isSaving?: boolean;
  isOwnProfile?: boolean;
  isSharedView?: boolean;
  hideStats?: boolean;
}
export function MobileProfileView({
  fullName,
  email,
  avatarUrl,
  bannerUrl,
  location,
  bio,
  role,
  userId,
  stats,
  socialLinks,
  introVideo,
  roleSection,
  portfolioSection,
  teamSection,
  pitchSection,
  ecosystemPartnerSections,
  pitchFeed,
  onEditClick,
  onEditIntroVideo,
  onEditPortfolio,
  onEditTeam,
  isEditingPortfolio = false,
  isEditingTeam = false,
  onSaveSection,
  onCancelSection,
  isSaving = false,
  isOwnProfile = true,
  isSharedView = false,
  hideStats = false,
}: MobileProfileViewProps) {
  const navigate = useNavigate();
  
  // Follow functionality
  const { data: followStatus, isLoading: statusLoading } = useFollowStatus(isOwnProfile ? undefined : userId);
  const followRequest = useFollowRequest();
  const unfollow = useUnfollow();

  // Check if profile can be shared (only innovator and startup)
  const canShare = isOwnProfile && (role === 'innovator' || role === 'startup');
  
  // Profile sharing hook - always pass userId when isOwnProfile to avoid race condition
  const { 
    copyToClipboard, 
    regenerateToken, 
    hasShareLink,
    isLoading: shareLoading,
    isRegenerating 
  } = useProfileShare(isOwnProfile ? userId : undefined);

  const handleFollow = () => {
    if (!userId) return;
    followRequest.mutate({ followingId: Number(userId) });
  };

  const handleUnfollow = () => {
    if (!userId) return;
    unfollow.mutate(Number(userId));
  };

  const isFollowLoading = followRequest.isPending || unfollow.isPending || statusLoading;

  const renderFollowButton = () => {
    if (statusLoading) {
      return (
        <Button variant="outline" size="sm" className="flex-1" disabled>
          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          Loading...
        </Button>
      );
    }

    switch (followStatus) {
      case 'accepted':
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleUnfollow}
            disabled={isFollowLoading}
          >
            {unfollow.isPending ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <UserMinus className="h-3.5 w-3.5 mr-1.5" />
            )}
            Unfollow
          </Button>
        );
      case 'pending':
        return (
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1"
            disabled
          >
            <Clock className="h-3.5 w-3.5 mr-1.5" />
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
            className="flex-1"
            onClick={handleFollow}
            disabled={isFollowLoading}
          >
            {followRequest.isPending ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            )}
            Follow
          </Button>
        );
    }
  };
  const initials = fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || email?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-background pb-24 w-full max-w-full overflow-x-hidden">
      {/* Header with Settings */}
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
        
        {/* Top Right Actions - Settings Menu */}
        {isOwnProfile && (
          <div className="absolute top-3 right-3 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 rounded-full bg-card/90 backdrop-blur-sm shadow-md"
                >
                  <MoreVertical className="h-4 w-4 text-foreground" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Profile Content - Full width white background */}
      <div className="bg-card w-full">
        <div className="px-4 pb-4">
          {/* Avatar row with share button */}
          <div className="flex items-end justify-between -mt-12">
            {/* Avatar - Overlapping banner */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Avatar className={`h-28 w-28 border-4 border-card shadow-lg flex-shrink-0 ${role === 'ecosystem_partner' ? 'rounded-lg' : ''}`}>
                <AvatarImage src={avatarUrl || undefined} className={role === 'ecosystem_partner' ? 'rounded-lg' : ''} />
                <AvatarFallback className={`bg-primary/10 text-primary text-3xl font-bold ${role === 'ecosystem_partner' ? 'rounded-lg' : ''}`}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            
            {/* Share button - below banner, right side */}
            {canShare && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("[MobileProfileView] Share button clicked", { shareLoading, isRegenerating, hasShareLink });
                  if (shareLoading || isRegenerating) return;
                  if (hasShareLink) {
                    copyToClipboard();
                  } else {
                    regenerateToken();
                  }
                }}
                className={`p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted transition-colors mb-2 ${(shareLoading || isRegenerating) ? 'opacity-50 pointer-events-none' : ''}`}
                title={shareLoading ? "Loading..." : hasShareLink ? "Copy share link" : "Generate share link"}
                aria-label={shareLoading ? "Loading..." : hasShareLink ? "Copy share link" : "Generate share link"}
              >
                {(shareLoading || isRegenerating) ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Redo className="h-5 w-5" />
                )}
              </motion.button>
            )}
          </div>

          {/* Name and Role - Same line, Location below */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-3"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-lg font-bold text-foreground leading-tight break-words">
                {fullName || 'Your Name'}
              </h1>
              {role && <RoleBadge role={role} size="sm" />}
            </div>
            {location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5">
                <MapPin className="h-3 w-3" />
                {location}
              </p>
            )}
          </motion.div>

          {/* Bio */}
          {bio && (
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-sm text-muted-foreground mt-2 leading-relaxed break-words"
            >
              {bio}
            </motion.p>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mt-4"
          >
            {isOwnProfile ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-card text-foreground border-foreground/20 hover:bg-muted"
                onClick={onEditClick}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                Edit Profile
              </Button>
            ) : !isSharedView ? (
              renderFollowButton()
            ) : null}
            
            {/* Social Links - Inline */}
            {socialLinks && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {socialLinks.linkedin && (
                  <a 
                    href={socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted/50 hover:bg-accent transition-colors"
                  >
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a 
                    href={socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted/50 hover:bg-accent transition-colors"
                  >
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                  </a>
                )}
                {socialLinks.website && (
                  <a 
                    href={socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted/50 hover:bg-accent transition-colors"
                  >
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </a>
                )}
                {socialLinks.contactEmail && (
                  <a 
                    href={`mailto:${socialLinks.contactEmail}`}
                    className="p-2 rounded-full bg-muted/50 hover:bg-accent transition-colors"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Stats Grid - Full width with white background - Hidden when hideStats is true */}
      {!hideStats && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-4 w-full bg-card py-3 border-t border-border/30"
        >
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">{stats.pitchCount}</p>
            <p className="text-[10px] text-muted-foreground">Pitches</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-primary flex items-center justify-center gap-0.5">
              <Flame className="h-3 w-3" />
              {stats.totalReactions}
            </p>
            <p className="text-[10px] text-muted-foreground">Reactions</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">{stats.followersCount || 0}</p>
            <p className="text-[10px] text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">{stats.followingCount || 0}</p>
            <p className="text-[10px] text-muted-foreground">Following</p>
          </div>
        </motion.div>
      )}

      {/* Introduction Video Section - Only for innovator/startup with video */}
      {(role === 'innovator' || role === 'startup') && introVideo?.url && (
        <div className="relative">
          {isOwnProfile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/edit-section?section=introduction')}
              className="absolute top-3 right-3 h-8 w-8 p-0 z-10 bg-background/80 hover:bg-background border border-border/50"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          <MobileVideoSection introVideo={introVideo} />
        </div>
      )}

      {/* Role-based Section - Full width white background */}
      {roleSection && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-1 w-full bg-card border-t border-border/30"
        >
          {roleSection}
        </motion.div>
      )}

      {/* Ecosystem Partner Sections */}
      {ecosystemPartnerSections && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-1 w-full"
        >
          {ecosystemPartnerSections}
        </motion.div>
      )}

      {/* Portfolio Section - Only for innovators with portfolio content */}
      {portfolioSection && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-1 w-full bg-card border-t border-border/30 relative"
        >
          {isOwnProfile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/edit-section?section=portfolio')}
              className="absolute top-3 right-3 h-8 w-8 p-0 z-10 bg-background/80 hover:bg-background border border-border/50"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {portfolioSection}
        </motion.div>
      )}

      {/* Pitches/Product Section */}
      {pitchSection ? (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-1 w-full bg-card border-t border-border/30"
        >
          <div className="px-4 py-4">
            {pitchSection}
          </div>
        </motion.div>
      ) : (role === 'innovator' || role === 'startup') && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-1 w-full bg-card border-t border-border/30"
        >
          <div className="px-4 py-4">
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              {getPitchesSectionName(role)}
            </h3>
            <p className="text-sm text-muted-foreground">
              No {getPitchesSectionName(role).toLowerCase()} added yet.
            </p>
          </div>
        </motion.div>
      )}

      {/* Team Section - After Pitches/Product */}
      {teamSection && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-1 w-full bg-card border-t border-border/30 relative"
        >
          {isOwnProfile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/edit-section?section=team')}
              className="absolute top-3 right-3 h-8 w-8 p-0 z-10 bg-background/80 hover:bg-background border border-border/50"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {teamSection}
        </motion.div>
      )}

    </div>
  );
}
