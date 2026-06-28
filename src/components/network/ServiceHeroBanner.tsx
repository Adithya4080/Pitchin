// import { Link } from 'react-router-dom';
// import { ArrowRight, Users, Target, TrendingUp } from 'lucide-react';

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
//     color: 'bg-purple-50 text-purple-600',
//   },
//   {
//     icon: <TrendingUp className="h-5 w-5" />,
//     label: 'Grow',
//     desc: 'Scale your startup faster',
//     color: 'bg-emerald-50 text-emerald-600',
//   },
// ];

// const trustBadges = [
//   { icon: '✦', text: 'Verified & Trusted Providers' },
//   { icon: '✦', text: 'Secure & Transparent Process' },
//   { icon: '✦', text: 'Save Time & Grow Faster' },
//   { icon: '✦', text: 'Opportunities Everyday' },
// ];

// export function ServiceHeroBanner() {
//   return (
//     <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0F2C] via-[#0D1540] to-[#1a237e] text-white px-6 md:px-10 py-8 md:py-10">
//       {/* Decorative background circles */}
//       <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-blue-500/10" />
//       <div className="pointer-events-none absolute -bottom-10 right-32 h-40 w-40 rounded-full bg-indigo-400/10" />
//       <div className="pointer-events-none absolute top-8 right-[22%] h-3 w-3 rounded-full bg-blue-300/60" />
//       <div className="pointer-events-none absolute top-16 right-[28%] h-2 w-2 rounded-full bg-blue-200/50" />

//       <div className="relative flex flex-col md:flex-row md:items-center gap-8">
//         {/* Left: copy */}
//         <div className="flex-1 min-w-0">
//           <p className="text-xs font-semibold tracking-widest text-blue-300 uppercase mb-3">
//             Explore. Connect. Grow.
//           </p>
//           <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-3">
//             Everything your startup needs,{' '}
//             <span className="text-blue-300">all in one place.</span>
//           </h1>
//           <p className="text-sm md:text-base text-white/70 mb-6 max-w-md">
//             Discover trusted services, connect with the right people, and unlock
//             unlimited opportunities to grow your startup.
//           </p>

//           {/* Pillars */}
//           <div className="flex flex-wrap gap-3 mb-6">
//             {pillars.map((p) => (
//               <div
//                 key={p.label}
//                 className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10"
//               >
//                 <span className={`flex items-center justify-center rounded-lg p-1.5 ${p.color}`}>
//                   {p.icon}
//                 </span>
//                 <div>
//                   <p className="text-sm font-semibold leading-none">{p.label}</p>
//                   <p className="text-[11px] text-white/60 mt-0.5">{p.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <Link
//             to="/network/services?view=all"
//             className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
//           >
//             View all services <ArrowRight className="h-4 w-4" />
//           </Link>
//         </div>

//         {/* Right: rocket illustration (SVG) */}
//         <div className="hidden md:flex shrink-0 items-center justify-center w-48">
//           <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-40 opacity-90">
//             {/* rocket body */}
//             <ellipse cx="80" cy="74" rx="18" ry="38" fill="#3B82F6" />
//             <ellipse cx="80" cy="74" rx="18" ry="38" fill="url(#rg1)" />
//             {/* nose cone */}
//             <path d="M62 60 Q80 20 98 60Z" fill="#60A5FA" />
//             {/* wings */}
//             <path d="M62 90 L44 118 L62 108Z" fill="#1D4ED8" />
//             <path d="M98 90 L116 118 L98 108Z" fill="#1D4ED8" />
//             {/* window */}
//             <circle cx="80" cy="68" r="8" fill="#E0F2FE" opacity="0.9" />
//             <circle cx="80" cy="68" r="5" fill="#38BDF8" />
//             {/* flame */}
//             <path d="M70 112 Q80 140 90 112 Q80 128 70 112Z" fill="#FCD34D" opacity="0.9" />
//             <path d="M74 112 Q80 132 86 112 Q80 122 74 112Z" fill="#F97316" />
//             {/* dots */}
//             <circle cx="38" cy="50" r="3" fill="#93C5FD" opacity="0.6" />
//             <circle cx="122" cy="44" r="2" fill="#93C5FD" opacity="0.5" />
//             <circle cx="130" cy="90" r="2.5" fill="#BFDBFE" opacity="0.4" />
//             <circle cx="28" cy="100" r="2" fill="#BFDBFE" opacity="0.4" />
//             <defs>
//               <linearGradient id="rg1" x1="62" y1="36" x2="98" y2="112" gradientUnits="userSpaceOnUse">
//                 <stop stopColor="#60A5FA" stopOpacity="0" />
//                 <stop offset="1" stopColor="#1D4ED8" stopOpacity="0.5" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
//       </div>

//       {/* Trust badges strip */}
//       <div className="relative mt-6 pt-5 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3">
//         {trustBadges.map((b) => (
//           <div key={b.text} className="flex items-center gap-2">
//             <span className="text-blue-300 text-xs">✦</span>
//             <span className="text-xs text-white/70">{b.text}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, TrendingUp } from 'lucide-react';

const pillars = [
  {
    icon: <Users className="h-5 w-5" />,
    label: 'Explore',
    desc: 'Browse trusted experts',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <Target className="h-5 w-5" />,
    label: 'Connect',
    desc: 'Reach the right people',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    label: 'Grow',
    desc: 'Scale your startup faster',
    color: 'bg-emerald-50 text-emerald-600',
  },
];

const trustBadges = [
  { icon: '✦', text: 'Verified & Trusted Providers' },
  { icon: '✦', text: 'Secure & Transparent Process' },
  { icon: '✦', text: 'Save Time & Grow Faster' },
  { icon: '✦', text: 'Opportunities Everyday' },
];

export function ServiceHeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0F2C] via-[#0D1540] to-[#1a237e] text-white px-6 md:px-8 py-5 md:py-6">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-blue-500/10" />
      <div className="pointer-events-none absolute -bottom-10 right-32 h-40 w-40 rounded-full bg-indigo-400/10" />
      <div className="pointer-events-none absolute top-8 right-[22%] h-3 w-3 rounded-full bg-blue-300/60" />
      <div className="pointer-events-none absolute top-16 right-[28%] h-2 w-2 rounded-full bg-blue-200/50" />

      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        {/* Left: copy */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold tracking-widest text-blue-300 uppercase mb-2">
            Explore. Connect. Grow.
          </p>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-2">
            Everything your startup needs,{' '}
            <span className="text-blue-300 whitespace-nowrap">all in one place.</span>
          </h1>
          <p className="text-sm text-white/70 mb-4 max-w-md">
            Discover trusted services, connect with the right people, and unlock
            unlimited opportunities to grow your startup.
          </p>

          {/* Pillars */}
          <div className="flex flex-wrap gap-2 mb-4">
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
          </div>

          <Link
            to="/network/services?view=all"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Right: rocket illustration (SVG) */}
        <div className="hidden md:flex shrink-0 items-center justify-center w-44">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-36 h-36 opacity-90">
            {/* rocket body */}
            <ellipse cx="80" cy="74" rx="18" ry="38" fill="#3B82F6" />
            <ellipse cx="80" cy="74" rx="18" ry="38" fill="url(#rg1)" />
            {/* nose cone */}
            <path d="M62 60 Q80 20 98 60Z" fill="#60A5FA" />
            {/* wings */}
            <path d="M62 90 L44 118 L62 108Z" fill="#1D4ED8" />
            <path d="M98 90 L116 118 L98 108Z" fill="#1D4ED8" />
            {/* window */}
            <circle cx="80" cy="68" r="8" fill="#E0F2FE" opacity="0.9" />
            <circle cx="80" cy="68" r="5" fill="#38BDF8" />
            {/* flame */}
            <path d="M70 112 Q80 140 90 112 Q80 128 70 112Z" fill="#FCD34D" opacity="0.9" />
            <path d="M74 112 Q80 132 86 112 Q80 122 74 112Z" fill="#F97316" />
            {/* dots */}
            <circle cx="38" cy="50" r="3" fill="#93C5FD" opacity="0.6" />
            <circle cx="122" cy="44" r="2" fill="#93C5FD" opacity="0.5" />
            <circle cx="130" cy="90" r="2.5" fill="#BFDBFE" opacity="0.4" />
            <circle cx="28" cy="100" r="2" fill="#BFDBFE" opacity="0.4" />
            <defs>
              <linearGradient id="rg1" x1="62" y1="36" x2="98" y2="112" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" stopOpacity="0" />
                <stop offset="1" stopColor="#1D4ED8" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Trust badges strip */}
      <div className="relative mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-2">
        {trustBadges.map((b) => (
          <div key={b.text} className="flex items-center gap-2">
            <span className="text-blue-300 text-xs">✦</span>
            <span className="text-xs text-white/70">{b.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}