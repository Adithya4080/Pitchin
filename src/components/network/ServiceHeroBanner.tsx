import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, TrendingUp } from 'lucide-react';
import banner from '@/assets/banner.jpeg';

// const pillars = [
//   {
//     icon: <Users className="h-5 w-5" />,
//     label: 'Explore',
//     desc: 'Browse trusted experts',
//     color: 'bg-blue-50 text-blue-600',
//   },
//   {
//     icon: <Target className="h-5 w-5" />,
//     label: 'Connect',
//     desc: 'Reach the right people',
//     color: 'bg-sky-50 text-sky-600',
//   },
//   {
//     icon: <TrendingUp className="h-5 w-5" />,
//     label: 'Grow',
//     desc: 'Scale your startup faster',
//     color: 'bg-indigo-50 text-indigo-600',
//   },
// ];

const trustBadges = [
  { icon: '✦', text: 'Verified & Trusted Providers' },
  { icon: '✦', text: 'Secure & Transparent Process' },
  { icon: '✦', text: 'Save Time & Grow Faster' },
  { icon: '✦', text: 'Opportunities Everyday' },
];

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

          {/* Pillars */}
          {/* <div className="flex flex-wrap gap-2 mb-4">
            {pillars.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10"
              >
                <span className={`flex items-center justify-center rounded-lg p-1.5 ${p.color}`}>
                  {p.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold leading-none">{p.label}</p>
                  <p className="text-[11px] text-white/60 mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div> */}

          <Link
            to="/network/services?view=all"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Trust badges strip */}
      {/* <div className="relative mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-2">
        {trustBadges.map((b) => (
          <div key={b.text} className="flex items-center gap-2">
            <span className="text-sky-200 text-xs">✦</span>
            <span className="text-xs text-white/70">{b.text}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
}