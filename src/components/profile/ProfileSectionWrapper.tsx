import { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ProfileSectionWrapperProps {
  /** The section title displayed in empty state */
  title: string;
  /** Whether the section has content */
  isEmpty: boolean;
  /** Whether the viewer is the profile owner */
  isOwner: boolean;
  /** The section key for navigation (e.g., 'portfolio', 'team', 'alumni') */
  sectionKey: string;
  /** Children to render when section has content */
  children: ReactNode;
  /** Whether viewing on mobile */
  isMobile?: boolean;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Custom CTA button text (defaults to "Add {title}") */
  ctaText?: string;
}

/**
 * Universal wrapper component for profile sections.
 * Handles empty state rendering logic consistently across all sections:
 * - Public viewers: Hidden when empty
 * - Profile owners: Show placeholder with "Add" CTA when empty
 * - Everyone: Normal render when has content
 */
export function ProfileSectionWrapper({
  title,
  isEmpty,
  isOwner,
  sectionKey,
  children,
  isMobile = false,
  emptyMessage = 'No content added yet',
  ctaText,
}: ProfileSectionWrapperProps) {
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate(`/edit-section?section=${sectionKey}`);
  };

  // If empty and not owner, don't render anything
  if (isEmpty && !isOwner) {
    return null;
  }

  // If empty and is owner, show placeholder
  if (isEmpty && isOwner) {
    const buttonText = ctaText || `Add ${title}`;

    if (isMobile) {
      return (
        <div className="bg-card px-4 py-6 border-t border-border/30">
          <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
            <h3 className="text-sm font-bold text-foreground mb-1.5">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {emptyMessage}
            </p>
            <Button
              size="sm"
              onClick={handleAdd}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              {buttonText}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <Card className="border-2 border-dashed border-border/50 bg-muted/5">
        <CardContent className="py-8 text-center">
          <h3 className="text-sm font-bold text-foreground mb-1.5">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {emptyMessage}
          </p>
          <Button
            size="sm"
            onClick={handleAdd}
            className="gap-1.5 h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Has content - render children normally
  return <>{children}</>;
}
