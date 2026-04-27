import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Trash2, MapPin, Eye, Users, ImagePlus, Pencil, UserPlus, UserCheck, Clock, UserMinus, MoreVertical, Settings, Redo, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/RoleBadge';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { useFollowStatus, useFollowRequest, useUnfollow } from '@/hooks/useFollow';
import { useAuth } from '@/hooks/useAuth';
import { useProfileShare } from '@/hooks/useProfileShare';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfileHeaderProps {
  userId: string;
  fullName: string;
  email?: string;
  avatarUrl: string | null;
  bannerUrl?: string | null;
  location?: string | null;
  bio?: string | null;
  stats: {
    pitchCount: number;
    totalReactions: number;
    totalSaves: number;
    followersCount?: number;
    followingCount?: number;
    profileViews?: number;
  };
  hideStats?: boolean;
  isEditable?: boolean;
  isEditing?: boolean;
  isSharedView?: boolean;
  onEditClick?: () => void;
  onAvatarSelect?: (file: File) => void;
  onAvatarRemove?: () => void;
  onBannerSelect?: (file: File) => void;
  onBannerRemove?: () => void;
}

export function ProfileHeader({
  userId,
  fullName,
  email,
  avatarUrl,
  bannerUrl,
  location,
  bio,
  stats,
  hideStats = false,
  isEditable = false,
  isEditing = false,
  isSharedView = false,
  onEditClick,
  onAvatarSelect,
  onAvatarRemove,
  onBannerSelect,
  onBannerRemove,
}: ProfileHeaderProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: userRole } = useUserRole(userId);
  const { user } = useAuth();
  
  // Follow functionality - only for viewing other profiles
  const isOwnProfile = user?.id === Number(userId);
  const { data: followStatus, isLoading: followStatusLoading } = useFollowStatus(userId);
  const followRequest = useFollowRequest();
  const unfollow = useUnfollow();

  // Check if profile can be shared (only innovator and startup)
  const canShare = isOwnProfile && (userRole?.role === 'innovator' || userRole?.role === 'startup');
  
  // Profile sharing hook - always pass userId when isOwnProfile to avoid race condition
  const { 
    copyToClipboard, 
    regenerateToken, 
    hasShareLink,
    isLoading: shareLoading,
    isRegenerating 
  } = useProfileShare(isOwnProfile ? userId : undefined);

  const initials = fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || email?.charAt(0)?.toUpperCase() || '?';

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarSelect) {
      onAvatarSelect(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onBannerSelect) {
      onBannerSelect(file);
    }
  };

  const handleFollow = () => {
    if (userId) {
      followRequest.mutate({ followingId: Number(userId) });
    }
  };

  const handleUnfollow = () => {
    if (userId) {
      unfollow.mutate(Number(userId));
    }
  };

  // Show edit controls only when in editing mode
  const showEditControls = isEditable && isEditing;

  // Render follow button based on status - hide on shared views
  const renderFollowButton = () => {
    if (isOwnProfile || !user || isSharedView) return null;

    const isLoading = followStatusLoading || followRequest.isPending || unfollow.isPending;

    if (followStatus === 'accepted') {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0" disabled={isLoading}>
              <UserCheck className="h-4 w-4 mr-2" />
              Following
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleUnfollow} className="text-destructive">
              <UserMinus className="h-4 w-4 mr-2" />
              Unfollow
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (followStatus === 'pending') {
      return (
        <Button variant="outline" size="sm" className="shrink-0" disabled>
          <Clock className="h-4 w-4 mr-2" />
          Pending
        </Button>
      );
    }

    return (
      <Button 
        variant="default" 
        size="sm" 
        className="shrink-0"
        onClick={handleFollow}
        disabled={isLoading}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Follow
      </Button>
    );
  };

  return (
    <Card className="overflow-hidden border-border/50">
      {/* Banner */}
      <div 
        className="h-36 sm:h-48 relative group bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10"
        style={bannerUrl ? { 
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {/* Top Right Actions - Settings Menu */}
        {isOwnProfile && (
          <div className="absolute top-3 right-3 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-9 w-9 bg-card/90 hover:bg-card shadow-md"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
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

        {showEditControls && (
          <>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
            />
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => bannerInputRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                {bannerUrl ? 'Change Banner' : 'Add Banner'}
              </Button>
              {bannerUrl && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={onBannerRemove}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Profile Identity */}
      <CardContent className="pt-0 pb-6 px-6">
        {/* Avatar row with Edit button */}
        <div className="flex items-end justify-between">
          {/* Avatar */}
          <div className="relative group shrink-0 -mt-16 sm:-mt-20">
            <Avatar className={`h-28 w-28 sm:h-36 sm:w-36 border-4 border-background shadow-lg ${userRole?.role === 'ecosystem_partner' ? 'rounded-lg' : ''}`}>
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className={`bg-primary/10 text-primary text-3xl sm:text-4xl font-semibold ${userRole?.role === 'ecosystem_partner' ? 'rounded-lg' : ''}`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            {showEditControls && (
              <button
                onClick={() => avatarInputRef.current?.click()}
                className={`absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity ${userRole?.role === 'ecosystem_partner' ? 'rounded-lg' : 'rounded-full'}`}
              >
                <Camera className="h-7 w-7 text-foreground" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0 mb-2 items-center">
            {/* Share button - Only for innovator/startup owner */}
            {canShare && (
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                disabled={shareLoading || isRegenerating}
                onClick={() => {
                  if (hasShareLink) {
                    copyToClipboard();
                  } else {
                    regenerateToken();
                  }
                }}
                title={shareLoading ? "Loading..." : hasShareLink ? "Copy share link" : "Generate share link"}
              >
                {(shareLoading || isRegenerating) ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Redo className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* Follow button for other profiles */}
            {renderFollowButton()}

            {/* Edit Profile button - only shown in view mode for owner */}
            {isEditable && !isEditing && onEditClick && (
              <Button 
                variant="outline" 
                size="default" 
                onClick={onEditClick}
                className="bg-card text-foreground border-foreground/20 hover:bg-muted"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}

            {/* Photo controls - only shown in edit mode */}
            {showEditControls && (
              <>
                {avatarUrl && (
                  <Button variant="outline" size="default" onClick={onAvatarRemove}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Photo
                  </Button>
                )}
                <Button variant="outline" size="default" onClick={() => avatarInputRef.current?.click()}>
                  <Camera className="h-4 w-4 mr-2" />
                  {avatarUrl ? 'Change' : 'Add Photo'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Name, role, location - Below avatar, left-aligned */}
        <div className="mt-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {fullName || 'Anonymous User'}
            </h1>
            {userRole?.role && (
              <RoleBadge role={userRole.role as UserRole} size="sm" />
            )}
          </div>
          {location && (
            <p className="text-sm sm:text-base text-muted-foreground flex items-center gap-1.5 mt-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{location}</span>
            </p>
          )}
          {email && !location && !userRole?.role && (
            <p className="text-sm sm:text-base text-muted-foreground mt-1.5">{email}</p>
          )}
          {!isEditable && !email && !userRole?.role && !location && (
            <p className="text-sm sm:text-base text-muted-foreground mt-1.5">Public Profile</p>
          )}
        </div>

        {/* Bio - shown in view mode only */}
        {bio && !isEditing && (
          <p className="text-base text-muted-foreground leading-relaxed mt-3">{bio}</p>
        )}

        {/* Stats Row - Hidden when hideStats is true */}
        {!hideStats && (
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-6 pt-5 border-t border-border/50">
            <div className="text-center">
              <p className="font-bold text-xl text-foreground">{stats.pitchCount}</p>
              <p className="text-sm text-muted-foreground">Pitches</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl text-foreground">{stats.totalReactions}</p>
              <p className="text-sm text-muted-foreground">Reactions</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl text-foreground">{stats.totalSaves}</p>
              <p className="text-sm text-muted-foreground">Saves</p>
            </div>
            {stats.followersCount !== undefined && (
              <div className="text-center">
                <p className="font-bold text-xl text-foreground flex items-center justify-center gap-1.5">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  {stats.followersCount}
                </p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
            )}
            {stats.followingCount !== undefined && (
              <div className="text-center">
                <p className="font-bold text-xl text-foreground">{stats.followingCount}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            )}
            {stats.profileViews !== undefined && (
              <div className="text-center">
                <p className="font-bold text-xl text-foreground flex items-center justify-center gap-1.5">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  {stats.profileViews}
                </p>
                <p className="text-sm text-muted-foreground">Views</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

    </Card>
  );
}
