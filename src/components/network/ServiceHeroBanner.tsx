import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, TrendingUp } from 'lucide-react';
import banner from '@/assets/banner.jpeg';


export function ServiceHeroBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl text-foreground px-6 md:px-8 py-5 md:py-6 bg-cover bg-center border border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)]"
      style={{ backgroundImage: `url(${banner})` }}
      >
      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        {/* Left: copy */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
            Explore. Connect. Grow.
          </p>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-2">
            Everything your startup needs, 
            <br />
            <span className="text-primary whitespace-nowrap">
              all in one place.
            </span>
          </h1>
          <p className="text-sm text-foreground/70 mb-4 max-w-md">
            Discover trusted services, connect with the right people, and unlock
            unlimited opportunities to grow your startup.
          </p>
          <Link
            to="/network/services?view=all"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}