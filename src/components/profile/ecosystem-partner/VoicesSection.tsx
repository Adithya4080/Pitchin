import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Edit2, Linkedin, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { VoiceEntry } from './types';
import { ProfileSectionWrapper } from '../ProfileSectionWrapper';

interface VoicesSectionProps {
  voices: VoiceEntry[];
  isMobile?: boolean;
  isOwner?: boolean;
}

function VoiceCard({ voice, isMobile = false }: { voice: VoiceEntry; isMobile?: boolean }) {
  return (
    <div className={`flex-shrink-0 overflow-hidden rounded-lg relative ${isMobile ? 'w-[160px] h-[200px] snap-center' : 'w-[170px] h-[220px]'}`}>
      {voice.portrait_url ? (
        <img src={voice.portrait_url} alt={voice.name} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
          <span className="text-3xl font-semibold text-muted-foreground">{voice.name?.charAt(0)?.toUpperCase() || '?'}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'p-2.5' : 'p-3'}`}>
        <div className="flex items-start justify-between gap-1.5 mb-0.5">
          <h4 className={`font-semibold text-white leading-tight ${isMobile ? 'text-xs' : 'text-sm'}`}>{voice.name}</h4>
          {(voice.linkedin_url || voice.website_url) && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {voice.linkedin_url && (
                <a href={voice.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  <Linkedin className="h-3 w-3" />
                </a>
              )}
              {voice.website_url && (
                <a href={voice.website_url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  <Globe className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
        <p className={`text-white/70 leading-tight ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{voice.role}</p>
        {voice.quote && (
          <p className={`text-white/60 italic mt-1 line-clamp-2 leading-tight ${isMobile ? 'text-[10px]' : 'text-[11px]'}`}>"{voice.quote}"</p>
        )}
      </div>
    </div>
  );
}

export function VoicesSection({ voices, isMobile = false, isOwner = false }: VoicesSectionProps) {
  const navigate = useNavigate();
  const hasVoices = voices && voices.length > 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const displayVoices = voices?.slice(0, 6) || [];

  const handleEdit = () => navigate('/edit-section?section=voices');

  const editButton = isOwner && hasVoices ? (
    <Button variant="ghost" size="sm" onClick={handleEdit} className={isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}>
      <Edit2 className={isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
    </Button>
  ) : null;

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current || isMobile) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    };

    const container = scrollRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }

    return () => {
      if (container) container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [displayVoices, isMobile]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <ProfileSectionWrapper
      title="Voices"
      isEmpty={!hasVoices}
      isOwner={isOwner}
      sectionKey="voices"
      isMobile={isMobile}
      emptyMessage="Showcase key people and leadership perspectives."
      ctaText="Add Voice"
    >
      {isMobile ? (
        <div className="w-full bg-card border-t border-border/30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Voices</h3>
              {editButton}
            </div>
            <div 
              className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayVoices.map((voice, index) => (
                <VoiceCard key={index} voice={voice} isMobile={true} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Voices</h3>
              {editButton}
            </div>
            <div className="relative">
              {showLeftArrow && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/90 border-border shadow-sm"
                  onClick={() => scroll('left')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {showRightArrow && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/90 border-border shadow-sm"
                  onClick={() => scroll('right')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayVoices.map((voice, index) => (
                  <VoiceCard key={index} voice={voice} isMobile={false} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </ProfileSectionWrapper>
  );
}