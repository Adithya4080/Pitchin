// import { useParams, useSearchParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { getPublicSharedDashboard } from "@/api/payment";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//   MapPin,
//   Globe,
//   Linkedin,
//   Twitter,
//   Mail,
//   Building2,
//   Users,
//   TrendingUp,
//   Star,
//   AlertCircle,
//   Link2Off,
// } from "lucide-react";

// const API_BASE =
//   (import.meta as any).env?.VITE_API_BASE_URL?.replace("/api", "") ||
//   "https://pitchin-backend-production.up.railway.app";

// function avatarSrc(path: string | null | undefined): string | undefined {
//   if (!path) return undefined;
//   return path.startsWith("http") ? path : `${API_BASE}${path}`;
// }

// function RoleLabel({ role }: { role?: string }) {
//   if (!role) return null;
//   const labels: Record<string, string> = {
//     innovator: "Innovator",
//     startup: "Startup",
//     investor: "Investor",
//     consultant: "Consultant",
//     ecosystem_partner: "Ecosystem Partner",
//   };
//   return (
//     <Badge variant="secondary" className="capitalize">
//       {labels[role] ?? role.replace("_", " ")}
//     </Badge>
//   );
// }

// // ── Error screens ─────────────────────────────────────────────────────────────

// function ErrorScreen({ icon: Icon, title, description }: {
//   icon: React.ElementType;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-6">
//       <Card className="max-w-sm w-full text-center">
//         <CardContent className="py-12 space-y-4">
//           <div className="flex justify-center">
//             <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
//               <Icon className="h-7 w-7 text-muted-foreground" />
//             </div>
//           </div>
//           <h2 className="text-lg font-semibold text-foreground">{title}</h2>
//           <p className="text-sm text-muted-foreground">{description}</p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // ── Profile sections ──────────────────────────────────────────────────────────

// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <div className="space-y-3">
//       <h3 className="text-sm font-semibold text-foreground">{title}</h3>
//       {children}
//     </div>
//   );
// }

// function TagList({ items }: { items: string[] }) {
//   if (!items?.length) return null;
//   return (
//     <div className="flex flex-wrap gap-1.5">
//       {items.map((item) => (
//         <Badge key={item} variant="outline" className="text-xs">
//           {item}
//         </Badge>
//       ))}
//     </div>
//   );
// }

// // ── Main component ─────────────────────────────────────────────────────────────

// export default function SharedProfile() {
//   const { userId: shareId } = useParams<{ userId: string }>();
//   const [searchParams] = useSearchParams();
//   const accessToken = searchParams.get("access") ?? "";

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["public-shared-dashboard", shareId, accessToken],
//     queryFn: () => getPublicSharedDashboard(shareId!, accessToken),
//     enabled: !!(shareId && accessToken),
//     retry: false,
//   });

//   if (!shareId || !accessToken) {
//     return (
//       <ErrorScreen
//         icon={AlertCircle}
//         title="Invalid Link"
//         description="This share link appears to be malformed. Please ask the owner for the correct link."
//       />
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-muted-foreground text-sm animate-pulse">Loading profile…</div>
//       </div>
//     );
//   }

//   if (error) {
//     const msg = (error as Error).message;
//     if (msg === "share_revoked") {
//       return (
//         <ErrorScreen
//           icon={Link2Off}
//           title="Link Revoked"
//           description="The owner has revoked access to this profile. This link is no longer valid."
//         />
//       );
//     }
//     if (msg === "invalid_access_token") {
//       return (
//         <ErrorScreen
//           icon={AlertCircle}
//           title="Access Denied"
//           description="This access token is invalid. Please use the exact link provided by the profile owner."
//         />
//       );
//     }
//     return (
//       <ErrorScreen
//         icon={AlertCircle}
//         title="Profile Not Found"
//         description="This shared profile could not be found. The link may have expired."
//       />
//     );
//   }

//   if (!data) return null;

//   const p = data.profile as any;

//   // role comes from the top-level data object (not nested in profile in this API)
//   const role: string = data.role ?? p.role ?? "";

//   // Parse JSON string fields returned by the backend
//   function safeParse(val: any, fallback: any = null) {
//     if (!val || typeof val !== "string") return val ?? fallback;
//     try { return JSON.parse(val); } catch { return fallback; }
//   }

//   const fundingData  = safeParse(p.funding_data, {});
//   const tractionData = safeParse(p.traction_data, {});
//   const teamMembers  = safeParse(p.team_members, []);
//   const industryTags = safeParse(p.industry_tags, []);
//   const lookingFor   = safeParse(p.looking_for, []);

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Watermark header */}
//       <div className="bg-primary/5 border-b border-primary/10 px-4 py-2 text-center">
//         <p className="text-xs text-muted-foreground">
//           Shared via{" "}
//           <a href="https://pich-in.lovable.app" className="text-primary font-medium hover:underline">
//             PitchIn
//           </a>{" "}
//           · {data.view_count} view{data.view_count !== 1 ? "s" : ""}
//         </p>
//       </div>

//       <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
//         {/* ── Profile Header ───────────────────────────────────────────── */}
//         {p.banner && (
//           <div className="h-40 rounded-xl overflow-hidden">
//             <img
//               src={avatarSrc(p.banner)}
//               alt="Banner"
//               className="w-full h-full object-cover"
//             />
//           </div>
//         )}

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-start gap-5">
//               <Avatar className="h-20 w-20 shrink-0">
//                 <AvatarImage src={avatarSrc(p.avatar)} />
//                 <AvatarFallback className="text-xl font-bold">
//                   {(p.user_name ?? p.full_name ?? "U")[0].toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>

//               <div className="flex-1 min-w-0 space-y-1.5">
//                 <h1 className="text-xl font-bold text-foreground truncate">
//                   {p.user_name ?? p.full_name ?? "Anonymous"}
//                 </h1>

//                 {p.company_name && (
//                   <p className="text-sm text-muted-foreground flex items-center gap-1">
//                     <Building2 className="h-3.5 w-3.5" />
//                     {p.company_name}
//                   </p>
//                 )}

//                 {p.location && (
//                   <p className="text-sm text-muted-foreground flex items-center gap-1">
//                     <MapPin className="h-3.5 w-3.5" />
//                     {p.location}
//                   </p>
//                 )}

//                 <RoleLabel role={role} />
//               </div>
//             </div>

//             {p.bio && (
//               <p className="mt-4 text-sm text-foreground leading-relaxed">{p.bio}</p>
//             )}

//             {/* Social Links */}
//             <div className="mt-4 flex flex-wrap gap-3">
//               {p.linkedin && (
//                 <a
//                   href={p.linkedin}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-1.5 text-sm text-primary hover:underline"
//                 >
//                   <Linkedin className="h-4 w-4" />
//                   LinkedIn
//                 </a>
//               )}
//               {p.twitter && (
//                 <a
//                   href={p.twitter}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-1.5 text-sm text-primary hover:underline"
//                 >
//                   <Twitter className="h-4 w-4" />
//                   Twitter
//                 </a>
//               )}
//               {p.website && (
//                 <a
//                   href={p.website}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-1.5 text-sm text-primary hover:underline"
//                 >
//                   <Globe className="h-4 w-4" />
//                   Website
//                 </a>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* ── Startup / Company Info ────────────────────────────────────── */}
//         {(role === "startup" || p.company_name || p.stage || p.founded_year || p.team_size || p.industry) && (
//           <Card>
//             <CardContent className="p-6 space-y-4">
//               <h2 className="font-semibold text-foreground flex items-center gap-2">
//                 <Building2 className="h-4 w-4 text-primary" />
//                 About the Company
//               </h2>
//               <Separator />

//               {p.company_overview && (
//                 <p className="text-sm text-foreground leading-relaxed">
//                   {p.company_overview}
//                 </p>
//               )}

//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 {p.stage && (
//                   <div>
//                     <p className="text-xs text-muted-foreground uppercase tracking-wide">Stage</p>
//                     <p className="font-medium">{p.stage}</p>
//                   </div>
//                 )}
//                 {p.founded_year && (
//                   <div>
//                     <p className="text-xs text-muted-foreground uppercase tracking-wide">Founded</p>
//                     <p className="font-medium">{p.founded_year}</p>
//                   </div>
//                 )}
//                 {p.team_size && (
//                   <div>
//                     <p className="text-xs text-muted-foreground uppercase tracking-wide">Team</p>
//                     <p className="font-medium">{p.team_size} people</p>
//                   </div>
//                 )}
//                 {p.industry && (
//                   <div>
//                     <p className="text-xs text-muted-foreground uppercase tracking-wide">Industry</p>
//                     <p className="font-medium">{p.industry}</p>
//                   </div>
//                 )}
//               </div>

//               {industryTags?.length > 0 && <TagList items={industryTags} />}
//             </CardContent>
//           </Card>
//         )}

//         {/* ── The Pitch ─────────────────────────────────────────────────── */}
//         {(p.problem_statement || p.solution || p.why_now || p.why_us) && (
//             <Card>
//               <CardContent className="p-6 space-y-4">
//                 <h2 className="font-semibold text-foreground">The Pitch</h2>
//                 <Separator />
//                 {[
//                   { label: "Problem", value: p.problem_statement },
//                   { label: "Solution", value: p.solution },
//                   { label: "Why Now", value: p.why_now },
//                   { label: "Why Us", value: p.why_us },
//                 ]
//                   .filter((i) => i.value)
//                   .map(({ label, value }) => (
//                     <div key={label} className="space-y-1">
//                       <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
//                         {label}
//                       </p>
//                       <p className="text-sm text-foreground leading-relaxed">{value}</p>
//                     </div>
//                   ))}
//               </CardContent>
//             </Card>
//           )}

//         {/* ── Funding ───────────────────────────────────────────────────── */}
//         {fundingData && Object.keys(fundingData).length > 0 && (
//           <Card>
//             <CardContent className="p-6 space-y-4">
//               <h2 className="font-semibold text-foreground flex items-center gap-2">
//                 <TrendingUp className="h-4 w-4 text-primary" />
//                 Funding
//               </h2>
//               <Separator />
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 {fundingData.stage && (
//                   <div>
//                     <p className="text-xs text-muted-foreground uppercase tracking-wide">Stage</p>
//                     <p className="font-medium">{fundingData.stage}</p>
//                   </div>
//                 )}
//                 {fundingData.amount_raised && (
//                   <div>
//                     <p className="text-xs text-muted-foreground uppercase tracking-wide">Raised</p>
//                     <p className="font-medium">{fundingData.amount_raised}</p>
//                   </div>
//                 )}
//                 {fundingData.target_raise && (
//                   <div>
//                     <p className="text-xs text-muted-foreground uppercase tracking-wide">Target Raise</p>
//                     <p className="font-medium">{fundingData.target_raise}</p>
//                   </div>
//                 )}
//                 {fundingData.use_of_funds && (
//                   <div className="col-span-2">
//                     <p className="text-xs text-muted-foreground uppercase tracking-wide">Use of Funds</p>
//                     <p className="font-medium">{fundingData.use_of_funds}</p>
//                   </div>
//                 )}
//               </div>
//               {fundingData.investors?.length > 0 && (
//                 <div>
//                   <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Investors</p>
//                   <TagList items={fundingData.investors} />
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {/* ── Traction ──────────────────────────────────────────────────── */}
//         {tractionData?.metrics?.length > 0 && (
//           <Card>
//             <CardContent className="p-6 space-y-4">
//               <h2 className="font-semibold text-foreground flex items-center gap-2">
//                 <Star className="h-4 w-4 text-primary" />
//                 Traction
//               </h2>
//               <Separator />
//               {tractionData.description && (
//                 <p className="text-sm text-muted-foreground">{tractionData.description}</p>
//               )}
//               <div className="grid grid-cols-2 gap-3">
//                 {tractionData.metrics.map((m: any, i: number) => (
//                   <div key={i} className="bg-muted/40 rounded-lg p-3">
//                     <p className="text-lg font-bold text-primary">{m.value}</p>
//                     <p className="text-xs text-muted-foreground">{m.label}</p>
//                     {m.growth && <p className="text-xs text-green-600 font-medium">{m.growth}</p>}
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* ── Team ──────────────────────────────────────────────────────── */}
//         {teamMembers?.length > 0 && (
//           <Card>
//             <CardContent className="p-6 space-y-4">
//               <h2 className="font-semibold text-foreground flex items-center gap-2">
//                 <Users className="h-4 w-4 text-primary" />
//                 Team
//               </h2>
//               <Separator />
//               <div className="space-y-3">
//                 {teamMembers.map((m: any, i: number) => (
//                   <div key={i} className="flex items-center gap-3">
//                     <Avatar className="h-9 w-9">
//                       <AvatarImage src={avatarSrc(m.avatar)} />
//                       <AvatarFallback>
//                         {(m.name ?? "?")[0].toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="text-sm font-medium text-foreground">{m.name}</p>
//                       <p className="text-xs text-muted-foreground">{m.role}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* ── Skills (innovator / consultant) ───────────────────────────── */}
//         {(p.skills?.length > 0 || p.expertise_areas?.length > 0) && (
//           <Card>
//             <CardContent className="p-6 space-y-3">
//               <h2 className="font-semibold text-foreground">
//                 {role === "consultant" ? "Expertise" : "Skills"}
//               </h2>
//               <Separator />
//               <TagList items={p.skills ?? p.expertise_areas ?? []} />
//             </CardContent>
//           </Card>
//         )}

//         {/* ── Investor info ──────────────────────────────────────────────── */}
//         {role === "investor" && (
//           <Card>
//             <CardContent className="p-6 space-y-4">
//               <h2 className="font-semibold text-foreground">Investment Focus</h2>
//               <Separator />
//               {p.investment_thesis && (
//                 <p className="text-sm text-foreground leading-relaxed">
//                   {p.investment_thesis}
//                 </p>
//               )}
//               {p.sectors_of_interest?.length > 0 && (
//                 <Section title="Sectors">
//                   <TagList items={p.sectors_of_interest} />
//                 </Section>
//               )}
//               {p.investment_stages?.length > 0 && (
//                 <Section title="Stages">
//                   <TagList items={p.investment_stages} />
//                 </Section>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {/* ── Footer ────────────────────────────────────────────────────── */}
//         <div className="text-center py-6">
//           <p className="text-xs text-muted-foreground">
//             Powered by{" "}
//             <a
//               href="/"
//               className="text-primary font-semibold hover:underline"
//             >
//               PitchIn
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicSharedDashboard } from "@/api/payment";
import { AlertCircle, Link2Off, type LucideIcon } from "lucide-react";
import { parseSharedProfile, avatarSrc } from "@/lib/parseSharedProfile";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import AuroraBackground from "@/components/shared-profile/AuroraBackground";
import ScrollProgress from "@/components/shared-profile/ScrollProgress";
import HeroSection from "@/components/shared-profile/HeroSection";
import AboutSection from "@/components/shared-profile/AboutSection";
import TimelineSection from "@/components/shared-profile/TimelineSection";
import MilestonesSection from "@/components/shared-profile/MilestonesSection";
import FundingTractionSection from "@/components/shared-profile/FundingTractionSection";
import TeamSection from "@/components/shared-profile/TeamSection";
import EcosystemSection from "@/components/shared-profile/EcosystemSection";
import PressTestimonials from "@/components/shared-profile/PressTestimonials";
import ContactCTA from "@/components/shared-profile/ContactCTA";
import GlassCard from "@/components/shared-profile/GlassCard";
import FloatingDivider from "@/components/shared-profile/FloatingDivider";
import "@/components/shared-profile/theme.css";
import PitchSection from "@/components/shared-profile/PitchSection";
import ProfileLoader from "@/components/shared-profile/Profileloader";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL?.replace("/api", "") ||
  "https://pitchin-backend-production.up.railway.app";

function ErrorScreen({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="sp-root relative flex min-h-screen items-center justify-center bg-[#f5f7fb] p-6">
      <AuroraBackground />
      <div className="relative z-10 w-full max-w-sm">
        <GlassCard tilt={false} className="p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-900/10 bg-white/70">
            <Icon className="h-7 w-7 text-slate-600" />
          </div>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </GlassCard>
      </div>
    </div>
  );
}

export default function SharedProfile() {
  const { userId: shareId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access") ?? "";
  const reducedMotion = useReducedMotion();

  useLenisScroll(!reducedMotion);

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-shared-dashboard", shareId, accessToken],
    queryFn: () => getPublicSharedDashboard(shareId!, accessToken),
    enabled: !!(shareId && accessToken),
    retry: false,
  });

  if (!shareId || !accessToken) {
    return (
      <ErrorScreen
        icon={AlertCircle}
        title="Invalid Link"
        description="This share link appears to be malformed. Please ask the owner for the correct link."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ProfileLoader />
      </div>
    );
  }

  if (error) {
    const msg = (error as Error).message;
    if (msg === "share_revoked") {
      return (
        <ErrorScreen
          icon={Link2Off}
          title="Link Revoked"
          description="The owner has revoked access to this profile. This link is no longer valid."
        />
      );
    }
    if (msg === "invalid_access_token") {
      return (
        <ErrorScreen
          icon={AlertCircle}
          title="Access Denied"
          description="This access token is invalid. Please use the exact link provided by the profile owner."
        />
      );
    }
    return (
      <ErrorScreen
        icon={AlertCircle}
        title="Profile Not Found"
        description="This shared profile could not be found. The link may have expired."
      />
    );
  }

  if (!data) return null;

  const profile = parseSharedProfile(data);
  const resolveAvatar = (path?: string) => avatarSrc(path, API_BASE);

  return (
    <div className="sp-root relative min-h-screen bg-[#f5f7fb] text-slate-900">
      <AuroraBackground />
      <ScrollProgress />

      <main className="relative z-10">
        <HeroSection profile={profile} avatarUrl={resolveAvatar(profile.avatar)} />

        <AboutSection profile={profile} />
        <PitchSection profile={profile} />

        <div className="relative">
          <FloatingDivider variant="orb" side="left" />
        </div>

        <TimelineSection items={profile.companyJourney} />
        <MilestonesSection items={profile.progressHighlights} />

        <div className="relative">
          <FloatingDivider variant="cube" side="right" />
        </div>

        <FundingTractionSection profile={profile} />
        <TeamSection members={profile.teamMembers} resolveAvatar={resolveAvatar} />
        <EcosystemSection items={profile.ecosystemSupport} />
        <PressTestimonials proofs={profile.trustPress.proofs ?? []} />
        {/* <ContactCTA profile={profile} /> */}

        <footer className="border-t border-slate-900/5 py-10 text-center">
          <p className="text-xs text-slate-400">
            Powered by{" "}
            <a href="/" className="font-semibold text-slate-500 hover:text-slate-900">
              PitchIn
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
