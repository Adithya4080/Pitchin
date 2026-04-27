import { Building2, Linkedin, Globe, ExternalLink, Edit2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SupportedStartupEntry } from './types';
import { ProfileSectionWrapper } from '../ProfileSectionWrapper';

interface SupportedStartupsSectionProps {
  startups: SupportedStartupEntry[];
  isMobile?: boolean;
  isOwner?: boolean;
}

function StartupCard({ startup, isMobile }: { startup: SupportedStartupEntry; isMobile: boolean }) {
  const content = (
    <div className={`flex items-start gap-3 py-3.5 border-t border-border/30 first:border-t-0 ${
      startup.profile_id || startup.website_url ? 'cursor-pointer group' : ''
    }`}>
      <Avatar className={`${isMobile ? 'h-12 w-12' : 'h-14 w-14'} shrink-0 rounded-lg border border-border/30`}>
        {startup.logo_url ? (
          <AvatarImage src={startup.logo_url} alt={startup.name} className="object-cover" />
        ) : (
          <AvatarFallback className="rounded-lg bg-primary/10">
            <Building2 className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-primary`} />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h4 className={`font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors ${isMobile ? 'text-sm' : 'text-base'}`}>
            {startup.name}
          </h4>
          <div className="flex items-center gap-1.5 shrink-0">
            {startup.linkedin_url && (
              <a href={startup.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {startup.website_url && (
              <a href={startup.website_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-3.5 w-3.5" />
              </a>
            )}
            {startup.profile_id && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        </div>
        {startup.stage && (
          <Badge variant="secondary" className={`mb-1.5 font-medium ${isMobile ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'}`}>
            {startup.stage}
          </Badge>
        )}
        {startup.description && (
          <p className={`text-muted-foreground line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>{startup.description}</p>
        )}
      </div>
    </div>
  );

  if (startup.profile_id) return <Link to={`/profile/${startup.profile_id}`}>{content}</Link>;
  if (startup.website_url) return <a href={startup.website_url} target="_blank" rel="noopener noreferrer">{content}</a>;
  return content;
}

export function SupportedStartupsSection({ startups, isMobile = false, isOwner = false }: SupportedStartupsSectionProps) {
  const hasStartups = startups && startups.length > 0;
  const navigate = useNavigate();

  const handleEdit = () => navigate('/edit-section?section=supported-startups');

  const editButton = isOwner && hasStartups ? (
    <Button variant="ghost" size="sm" onClick={handleEdit} className={isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}>
      <Edit2 className={isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
    </Button>
  ) : null;

  return (
    <ProfileSectionWrapper
      title="Backed / Supported Startups"
      isEmpty={!hasStartups}
      isOwner={isOwner}
      sectionKey="supported-startups"
      isMobile={isMobile}
      emptyMessage="Showcase startups you've backed or supported."
    >
      {isMobile ? (
        <div className="w-full bg-card border-t border-border/30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-foreground">Backed / Supported Startups</h3>
              {editButton}
            </div>
            <div className="divide-y divide-border/30">
              {startups.map((startup, index) => (
                <StartupCard key={index} startup={startup} isMobile={true} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">Backed / Supported Startups</h3>
              {editButton}
            </div>
            <div className="divide-y divide-border/30">
              {startups.map((startup, index) => (
                <StartupCard key={index} startup={startup} isMobile={false} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </ProfileSectionWrapper>
  );
}