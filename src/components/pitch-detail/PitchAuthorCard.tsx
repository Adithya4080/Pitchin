import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/RoleBadge';
import { ChevronRight } from 'lucide-react';

interface PitchAuthorCardProps {
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  role?: string | null;
  linkOverride?: string;
}

export function PitchAuthorCard({ userId, fullName, avatarUrl, role, linkOverride }: PitchAuthorCardProps) {
  const navigate = useNavigate();

  const initials = fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <Card className="border-border/50 rounded-none md:rounded-lg border-x-0 md:border-x">
      <CardContent className="p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Posted by</h3>
        <div
          className="flex items-center justify-between gap-4 cursor-pointer group"
          onClick={() => navigate(linkOverride || `/profile/${userId}`)}
        >
          <div className="flex items-center gap-3">
            <Avatar className={`h-12 w-12 border-2 border-background shadow ${role === 'ecosystem_partner' ? 'rounded-lg' : ''}`}>
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className={`bg-primary/10 text-primary font-semibold ${role === 'ecosystem_partner' ? 'rounded-lg' : ''}`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {fullName || 'Anonymous'}
                </p>
                {role && (
                  <RoleBadge 
                    role={role as 'innovator' | 'startup' | 'investor' | 'consultant'} 
                    size="sm" 
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground">View Profile</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}
