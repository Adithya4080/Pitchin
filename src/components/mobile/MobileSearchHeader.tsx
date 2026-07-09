import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { AppMenuDrawer } from '@/components/mobile/AppMenuDrawer';

/**
 * Shared mobile header: hamburger (opens the app menu drawer) + "Pitchin"
 * logo on the left, and a tappable search bar (with animated typing
 * placeholder) filling the rest of the row. Tapping the search bar
 * navigates to /search.
 *
 * Used by: Feed, Network, and Alerts (Notifications) mobile pages.
 * NOTE: this is intentionally separate from MobileHeader.tsx, which is
 * still used (unchanged) by other pages (Admin, ProviderDetail,
 * ServiceCategoryPage, News, Messages) so this change doesn't affect them.
 */
export function MobileSearchHeader() {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-40 bg-card backdrop-blur-md border-b border-border/50">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Left - Hamburger (opens the shared app menu drawer) + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <AppMenuDrawer
            trigger={
              <button
                aria-label="Open menu"
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors touch-manipulation"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </button>
            }
          />
          <span className="font-display font-bold text-xl tracking-tight text-sky-400">
            Pitchin
          </span>
        </div>

        {/* Right - Search bar with animated typing placeholder */}
        <button
          onClick={() => navigate('/search')}
          className="flex-1 flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-muted/50 border border-border/50 text-left touch-manipulation active:scale-[0.98] transition-transform"
        >
          <Search className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="flex-1 text-xs text-muted-foreground overflow-hidden">
            <AnimatedPlaceholder text="Search anything" />
          </span>
        </button>
      </div>
    </div>
  );
}

/**
 * Typewriter-style animated placeholder, matching the hero-section typing
 * animation style used on the landing page: types the text out, holds,
 * deletes it, and loops.
 */
function AnimatedPlaceholder({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'waiting'>('typing');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), 1400);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 200);
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), 40);
      } else {
        timeout = setTimeout(() => setPhase('waiting'), 400);
      }
    } else if (phase === 'waiting') {
      timeout = setTimeout(() => setPhase('typing'), 300);
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, text]);

  return (
    <span className="inline-flex items-center">
      {displayed}
      <span className="ml-0.5 w-[1px] h-3 bg-muted-foreground/60 animate-pulse" />
    </span>
  );
}