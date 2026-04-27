import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Users, UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useFollowStatus, useFollowRequest } from '@/hooks/useFollow';

interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
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

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="relative w-24 h-14 rounded-md overflow-hidden bg-muted shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
          <Play className="h-6 w-6 text-white" fill="white" />
        </div>
        <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 text-white px-1 rounded">
          {video.duration}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
          {video.title}
        </p>
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

  // Placeholder videos for now - these can be connected to actual data later
  const placeholderVideos: VideoItem[] = [
    { id: '1', title: 'How to create a compelling pitch', thumbnailUrl: '', duration: '3:45' },
    { id: '2', title: 'Top 10 tips for startup founders', thumbnailUrl: '', duration: '5:20' },
    { id: '3', title: 'Understanding investor expectations', thumbnailUrl: '', duration: '4:15' },
    { id: '4', title: 'Building your MVP in 30 days', thumbnailUrl: '', duration: '6:30' },
    { id: '5', title: 'Networking strategies for startups', thumbnailUrl: '', duration: '4:00' },
  ];

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
          {placeholderVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
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
