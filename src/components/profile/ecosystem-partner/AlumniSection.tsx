import { Building2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { AlumniStartupEntry } from './types';
import { ProfileSectionWrapper } from '../ProfileSectionWrapper';

interface AlumniSectionProps {
  alumni: AlumniStartupEntry[];
  isMobile?: boolean;
  isOwner?: boolean;
}

function AlumniCard({ alumni }: { alumni: AlumniStartupEntry }) {
  const statusTagColors: Record<string, string> = {
    'Alumni': 'bg-muted text-muted-foreground',
    'Unicorn': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'Public Company': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Acquired': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };

  const content = (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border/50 overflow-hidden hover:border-border/80 transition-colors">
      <div className="h-24 bg-muted/30 flex items-center justify-center p-4">
        {alumni.logo_url ? (
          <img src={alumni.logo_url} alt={alumni.startup_name} className="max-h-16 max-w-full object-contain" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-3">
        <h4 className="font-bold text-foreground text-sm line-clamp-1 mb-1">{alumni.startup_name}</h4>
        {alumni.short_description && (
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{alumni.short_description}</p>
        )}
        {alumni.status_tag && (
          <Badge variant="secondary" className={`mt-2 text-[10px] px-2 py-0.5 w-fit ${statusTagColors[alumni.status_tag] || ''}`}>
            {alumni.status_tag}
          </Badge>
        )}
      </div>
    </div>
  );

  if (alumni.external_link) {
    return (
      <a href={alumni.external_link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }

  return content;
}

export function AlumniSection({ alumni, isMobile = false, isOwner = false }: AlumniSectionProps) {
  const navigate = useNavigate();
  const hasAlumni = alumni && alumni.length > 0;

  const handleEdit = () => navigate('/edit-section?section=alumni');

  const editButton = isOwner && hasAlumni ? (
    <Button variant="ghost" size="sm" onClick={handleEdit} className={isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}>
      <Edit2 className={isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
    </Button>
  ) : null;

  return (
    <ProfileSectionWrapper
      title="Startups & Alumni"
      isEmpty={!hasAlumni}
      isOwner={isOwner}
      sectionKey="alumni"
      isMobile={isMobile}
      emptyMessage="Showcase notable startups and alumni supported by your organization."
    >
      {isMobile ? (
        <div className="w-full bg-card border-t border-border/30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Startups & Alumni</h3>
              {editButton}
            </div>
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent className="-ml-2">
                {alumni.map((item, index) => (
                  <CarouselItem key={index} className="pl-2 basis-[75%]">
                    <AlumniCard alumni={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Startups & Alumni</h3>
              {editButton}
            </div>
            <div className="relative">
              <Carousel opts={{ align: "start", loop: false }} className="w-full">
                <CarouselContent className="-ml-3">
                  {alumni.map((item, index) => (
                    <CarouselItem key={index} className="pl-3 md:basis-1/3 lg:basis-1/4">
                      <AlumniCard alumni={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 h-8 w-8" />
                <CarouselNext className="-right-4 h-8 w-8" />
              </Carousel>
            </div>
          </CardContent>
        </Card>
      )}
    </ProfileSectionWrapper>
  );
}