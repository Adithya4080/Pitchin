import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Users, UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useFollowStatus, useFollowRequest } from '@/hooks/useFollow';

const CURATED_VIDEOS: { id: string; description?: string }[] = [
  { id: 'Th8JoIan4dg' },
  { id: 'z1iF1c8w5Lg' },
  { id: 'QRZ_l7cVzzU' },
  { id: 'hyYCn_kAngI' },
  { id: 'u36A-YTxiOw' },
  { id: 'zBUhQPPS9AY' },
];

interface YoutubeOEmbed {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

function RecommendedUserCard({ 
  user, 
  currentUserId 
}: { 
  user: { id: string | number; full_name: string | null; avatar_url: string | null }; 
  currentUserId?: string;
}) {
  const navigate = useNavigate();
  const { data: followStatus } = useFollowStatus(user.id);
  const followRequest = useFollowRequest();

  const initials = user.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    followRequest.mutate({ followingId: Number(user.id) });
  };

  const isOwnProfile = currentUserId === String(user.id);
  const canFollow = !isOwnProfile && followStatus === 'none';

  return (
    <div 
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      <Avatar className="h-9 w-9">
        <AvatarImage src={user.avatar_url || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {user.full_name || 'Anonymous User'}
        </p>
      </div>
      {canFollow && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2"
          onClick={handleFollow}
          disabled={followRequest.isPending}
        >
          <UserPlus className="h-3.5 w-3.5" />
        </Button>
      )}
      {followStatus === 'pending' && (
        <span className="text-xs text-muted-foreground">Pending</span>
      )}
      {followStatus === 'accepted' && (
        <span className="text-xs text-primary">Following</span>
      )}
    </div>
  );
}

function VideoCard({ id, description }: { id: string; description?: string }) {
  // Pull title/thumbnail/channel straight from YouTube — no API key needed.
  const { data, isLoading } = useQuery({
    queryKey: ['youtube-oembed', id],
    queryFn: async (): Promise<YoutubeOEmbed> => {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`
      );
      if (!res.ok) throw new Error('Failed to load video info');
      return res.json();
    },
    staleTime: 1000 * 60 * 60 * 24, // titles/thumbnails don't change often — cache for a day
  });

  const handleOpen = () => {
    window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={handleOpen}
    >
      <div className="relative w-24 h-14 rounded-md overflow-hidden bg-muted shrink-0">
        {data?.thumbnail_url ? (
          <img
            src={data.thumbnail_url}
            alt={data.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
            <Play className="h-6 w-6 text-white" fill="white" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors">
          <Play className="h-5 w-5 text-white drop-shadow" fill="white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
          {isLoading ? 'Loading…' : data?.title || 'Untitled video'}
        </p>
        {(description || data?.author_name) && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {description || data?.author_name}
          </p>
        )}
      </div>
    </div>
  );
}

export function ProfileRightSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch recommended users (all users except current user)
const { data: recommendedUsers = [] } = useQuery({
  queryKey: ['recommended-users-profile', user?.id],
  queryFn: async (): Promise<{ id: string | number; full_name: string | null; avatar_url: string | null }[]> => {
    return [];
  },
  enabled: !!user,
});

  return (
    <aside className="w-72 shrink-0 space-y-4 sticky top-20 h-fit">
      {/* Videos Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" />
            Suggested Videos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-2">
          {CURATED_VIDEOS.map((video) => (
            <VideoCard key={video.id} id={video.id} description={video.description} />
          ))}
        </CardContent>
      </Card>

      {/* People to Connect */}
      {user && recommendedUsers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              People to Connect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-2">
          {recommendedUsers.map((recUser) => (
            <RecommendedUserCard 
              key={recUser.id} 
              user={{ ...recUser, id: String(recUser.id) }} 
              currentUserId={user?.id ? String(user.id) : undefined}
            />
          ))}
          </CardContent>
        </Card>
      )}
    </aside>
  );
}