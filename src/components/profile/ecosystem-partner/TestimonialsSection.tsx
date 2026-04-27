import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { TestimonialEntry } from './types';
import { ProfileSectionWrapper } from '../ProfileSectionWrapper';

interface TestimonialsSectionProps {
  testimonials: TestimonialEntry[];
  isMobile?: boolean;
  isOwner?: boolean;
}

export function TestimonialsSection({ testimonials, isMobile = false, isOwner = false }: TestimonialsSectionProps) {
  const hasTestimonials = testimonials && testimonials.length > 0;

  // Limit to max 2 testimonials
  const displayTestimonials = testimonials?.slice(0, 2) || [];

  return (
    <ProfileSectionWrapper
      title="Voices"
      isEmpty={!hasTestimonials}
      isOwner={isOwner}
      sectionKey="testimonials"
      isMobile={isMobile}
      emptyMessage="Add testimonials from founders or partners."
      ctaText="Add Testimonial"
    >
      {isMobile ? (
        <div className="w-full bg-card border-t border-border/30">
          <div className="px-4 py-4">
            <h3 className="text-sm font-bold text-foreground mb-3">
              Voices
            </h3>
            <div className="space-y-3">
              {displayTestimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-muted/30 border border-border/30"
                >
                  <Quote className="h-4 w-4 text-primary/40 mb-2" />
                  <p className="text-sm text-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <p className="text-xs font-medium text-foreground">{testimonial.author_name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.author_role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">
              Voices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayTestimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-muted/20 border border-border/30"
                >
                  <Quote className="h-5 w-5 text-primary/30 mb-3" />
                  <p className="text-sm text-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <p className="text-sm font-medium text-foreground">{testimonial.author_name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.author_role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </ProfileSectionWrapper>
  );
}
