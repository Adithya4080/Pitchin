// import { motion, type Variants } from "framer-motion";
// import { MapPin, Building2, TrendingUp, Globe, Mail, FileDown } from "lucide-react";
// import MagneticButton from "./MagneticButton";
// import type { ParsedProfile } from "@/types/profile";

// interface HeroSectionProps {
//   profile: ParsedProfile;
//   avatarUrl?: string;
// }

// const container: Variants = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
// };

// const item: Variants = {
//   hidden: { opacity: 0, y: 16 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
// };

// export default function HeroSection({ profile, avatarUrl }: HeroSectionProps) {
//   const displayName =
//     profile.company_name || profile.user_name || profile.full_name || "Untitled Startup";

//   return (
//     <section className="relative px-6 pb-14 pt-24 sm:pt-28">
//       <motion.div
//         variants={container}
//         initial="hidden"
//         animate="show"
//         className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center gap-6"
//       >
//         {/* Identity card */}
//         <motion.div
//           variants={item}
//           className="flex w-full items-center gap-4 rounded-3xl border border-slate-900/10 bg-white p-5 shadow-sm sm:p-6"
//         >
//           {avatarUrl ? (
//             <img
//               src={avatarUrl}
//               alt={displayName}
//               className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-slate-900/5 sm:h-20 sm:w-20"
//             />
//           ) : (
//             <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#53bbff] to-[#a855f7] text-xl font-bold text-white sm:h-20 sm:w-20 sm:text-2xl">
//               {displayName[0]?.toUpperCase() ?? "?"}
//             </div>
//           )}
//           <div className="min-w-0">
//             <h1 className="font-display truncate text-xl font-bold text-slate-900 sm:text-2xl">
//               {displayName}
//             </h1>
//             {profile.user_email && (
//               <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
//                 <Mail className="h-3.5 w-3.5 shrink-0" />
//                 <span className="truncate">{profile.user_email}</span>
//               </p>
//             )}
//           </div>
//         </motion.div>

//         {profile.tagline && (
//           <motion.p variants={item} className="max-w-xl text-center text-lg text-slate-600">
//             {profile.tagline}
//           </motion.p>
//         )}

//         <motion.div
//           variants={item}
//           className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600"
//         >
//           {profile.location && (
//             <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white px-3 py-1.5">
//               <MapPin className="h-3.5 w-3.5" /> {profile.location}
//             </span>
//           )}
//           {profile.industry && (
//             <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white px-3 py-1.5">
//               <Building2 className="h-3.5 w-3.5" /> {profile.industry}
//             </span>
//           )}
//           {profile.stage && (
//             <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white px-3 py-1.5">
//               <TrendingUp className="h-3.5 w-3.5" /> {profile.stage}
//             </span>
//           )}
//         </motion.div>

//         <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 pt-1">
//           {profile.website && (
//             <MagneticButton href={profile.website} variant="primary">
//               <Globe className="h-4 w-4" /> Visit Website
//             </MagneticButton>
//           )}
//           {/* {profile.user_email && (
//             <MagneticButton href={`mailto:${profile.user_email}`} variant="secondary">
//               <Mail className="h-4 w-4" /> Contact Founder
//             </MagneticButton>
//           )} */}
//           {profile.pitch_deck_url && (
//             <MagneticButton href={profile.pitch_deck_url} variant="secondary">
//               <FileDown className="h-4 w-4" /> Download Pitch Deck
//             </MagneticButton>
//           )}
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// }

import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import {
  MapPin,
  Building2,
  TrendingUp,
  Globe,
  Mail,
  FileDown,
  Link2,
  Check,
  Sparkles,
} from "lucide-react";
import MagneticButton from "./MagneticButton";
import type { ParsedProfile } from "@/types/profile";

interface HeroSectionProps {
  profile: ParsedProfile;
  avatarUrl?: string;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const AVATAR_SIZE = 96; // px, matches h-24 w-24
const RING_STROKE = 3;
const RING_RADIUS = AVATAR_SIZE / 2 + 5;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function RoleBadge({ role }: { role: string }) {
  const isInvestor = role.toLowerCase().includes("invest");
  const Icon = isInvestor ? TrendingUp : Building2;
  return (
    <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-[#53bbff] to-[#a855f7] text-white shadow-md sm:h-9 sm:w-9">
      <Icon className="h-4 w-4" />
    </div>
  );
}

export default function HeroSection({ profile, avatarUrl }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);
  const displayName =
    profile.company_name || profile.user_name || profile.full_name || "Untitled Startup";

  const strength =
    typeof profile.profile_strength === "number"
      ? Math.max(0, Math.min(100, profile.profile_strength))
      : null;
  const ringOffset =
    strength !== null ? RING_CIRCUMFERENCE * (1 - strength / 100) : RING_CIRCUMFERENCE;

  const hasTags = !!(profile.location || profile.industry || profile.stage);
  const hasActions = !!(profile.website || profile.user_email || profile.pitch_deck_url);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — fail silently, button just won't confirm
    }
  }

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-24 sm:pt-28">
      {/* Spotlight glow behind the identity block — separate from the ambient
          aurora background, focused specifically on the hero's center of mass */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px,92vw] -translate-x-1/2 rounded-full opacity-[0.18] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, #53bbff 0%, #a855f7 45%, transparent 72%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center gap-5 text-center"
      >
        {profile.role && (
          <motion.div
            variants={item}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 backdrop-blur-sm"
          >
            <Sparkles className="h-3 w-3 text-[#a855f7]" />
            <span
              className="bg-gradient-to-r from-[#53bbff] to-[#a855f7] bg-clip-text text-transparent"
            >
              {profile.role}
            </span>
          </motion.div>
        )}

        {/* Avatar with optional profile-strength ring + role badge */}
        <motion.div variants={item} className="relative flex items-center justify-center">
          {strength !== null && (
            <svg
              width={(RING_RADIUS + RING_STROKE) * 2}
              height={(RING_RADIUS + RING_STROKE) * 2}
              className="absolute -rotate-90"
            >
              <circle
                cx={RING_RADIUS + RING_STROKE}
                cy={RING_RADIUS + RING_STROKE}
                r={RING_RADIUS}
                fill="none"
                stroke="rgba(15,23,42,0.08)"
                strokeWidth={RING_STROKE}
              />
              <circle
                cx={RING_RADIUS + RING_STROKE}
                cy={RING_RADIUS + RING_STROKE}
                r={RING_RADIUS}
                fill="none"
                stroke="url(#heroRingGradient)"
                strokeWidth={RING_STROKE}
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={ringOffset}
              />
              <defs>
                <linearGradient id="heroRingGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#53bbff" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          )}

          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-24 w-24 rounded-full object-cover shadow-xl ring-4 ring-white"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#53bbff] to-[#a855f7] text-3xl font-bold text-white shadow-xl ring-4 ring-white">
                {displayName[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            {profile.role && <RoleBadge role={profile.role} />}
          </div>

          {/* {strength !== null && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-900/10 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 shadow-sm">
              {Math.round(strength)}% complete
            </span>
          )} */}
        </motion.div>

        <motion.div variants={item} className="flex flex-col items-center gap-2">
          <h1 className="font-display bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl">
            {displayName}
          </h1>
          {profile.user_email && (
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{profile.user_email}</span>
            </p>
          )}
        </motion.div>

        {profile.tagline && (
          <motion.p variants={item} className="max-w-xl text-balance text-lg text-slate-600">
            {profile.tagline}
          </motion.p>
        )}

        {hasTags && (
          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600"
          >
            {profile.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white px-3 py-1.5 shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-[#53bbff]" /> {profile.location}
              </span>
            )}
            {profile.industry && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white px-3 py-1.5 shadow-sm">
                <Building2 className="h-3.5 w-3.5 text-[#a855f7]" /> {profile.industry}
              </span>
            )}
            {profile.stage && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white px-3 py-1.5 shadow-sm">
                <TrendingUp className="h-3.5 w-3.5 text-[#ec4899]" /> {profile.stage}
              </span>
            )}
          </motion.div>
        )}

        {(hasActions || true) && (
          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center gap-3 pt-1"
          >
            {profile.website && (
              <MagneticButton href={profile.website} variant="primary">
                <Globe className="h-4 w-4" /> Visit Website
              </MagneticButton>
            )}
            {profile.pitch_deck_url && (
              <MagneticButton href={profile.pitch_deck_url} variant="secondary">
                <FileDown className="h-4 w-4" /> Download Pitch Deck
              </MagneticButton>
            )}
            <MagneticButton onClick={handleCopyLink} variant="ghost">
              {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              {copied ? "Link copied" : "Copy profile link"}
            </MagneticButton>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}