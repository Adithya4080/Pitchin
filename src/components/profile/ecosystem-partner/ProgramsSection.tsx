import { FolderOpen, ExternalLink, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import type { ProgramEntry } from './types';
import { ProfileSectionWrapper } from '../ProfileSectionWrapper';

interface ProgramsSectionProps {
  programs: ProgramEntry[];
  isMobile?: boolean;
  isOwner?: boolean;
}

function MobileProgramCard({ program }: { program: ProgramEntry }) {
  return (
    <div className="h-full rounded-lg border border-border/40 bg-card overflow-hidden">
      <div className="relative w-full" style={{ height: '130px' }}>
        {program.image_url ? (
          <img src={program.image_url} alt={program.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <h4 className="font-semibold text-[15px] text-foreground leading-tight truncate">{program.title}</h4>
        <p className="text-[13px] text-muted-foreground truncate leading-snug">{program.description}</p>
        {program.tags && program.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {program.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">{tag}</span>
            ))}
          </div>
        )}
        {program.external_link && (
          <a href={program.external_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] text-primary hover:underline pt-1">
            View details <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function DesktopProgramCard({ program }: { program: ProgramEntry }) {
  return (
    <div className="flex h-full rounded-lg border border-border/40 bg-card overflow-hidden hover:border-border/80 transition-colors">
      <div className="relative w-[140px] shrink-0">
        {program.image_url ? (
          <img src={program.image_url} alt={program.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
        <h4 className="font-semibold text-[15px] text-foreground leading-tight truncate">{program.title}</h4>
        <p className="text-[13px] text-muted-foreground truncate leading-snug mt-1">{program.description}</p>
        {program.tags && program.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {program.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">{tag}</span>
            ))}
          </div>
        )}
        {program.external_link && (
          <a href={program.external_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] text-primary hover:underline mt-2">
            View details <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export function ProgramsSection({ programs, isMobile = false, isOwner = false }: ProgramsSectionProps) {
  const navigate = useNavigate();
  const hasPrograms = programs && programs.length > 0;

  const handleEdit = () => navigate('/edit-section?section=programs');

  const editButton = isOwner && hasPrograms ? (
    <Button variant="ghost" size="sm" onClick={handleEdit} className={isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}>
      <Edit2 className={isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
    </Button>
  ) : null;

  return (
    <ProfileSectionWrapper
      title="Programs & Initiatives"
      isEmpty={!hasPrograms}
      isOwner={isOwner}
      sectionKey="programs"
      isMobile={isMobile}
      emptyMessage="Showcase your accelerator programs, bootcamps, or initiatives."
      ctaText="Add Program"
    >
      {isMobile ? (
        <div className="w-full bg-card border-t border-border/30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Programs & Initiatives</h3>
              {editButton}
            </div>
            <Carousel opts={{ align: 'start', loop: programs.length > 1 }} className="w-full">
              <CarouselContent className="-ml-2">
                {programs.map((program, index) => (
                  <CarouselItem key={index} className="pl-2 basis-[80%]">
                    <MobileProgramCard program={program} />
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
              <h3 className="text-sm font-bold text-foreground">Programs & Initiatives</h3>
              {editButton}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {programs.map((program, index) => (
                <DesktopProgramCard key={index} program={program} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </ProfileSectionWrapper>
  );
}