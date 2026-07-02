import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicSharedDashboard } from "@/api/payment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Mail,
  Building2,
  Users,
  TrendingUp,
  Star,
  AlertCircle,
  Link2Off,
  Clock,
  CheckCircle2,
  Handshake,
  Newspaper,
  Briefcase,
} from "lucide-react";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL?.replace("/api", "") ||
  "https://pitchin-backend-production.up.railway.app";

// Theme is scoped to this page only via the .dossier-theme class below —
// these CSS variables only apply to elements inside a .dossier-theme
// wrapper, so nothing else in the app is affected. Fonts are left as-is
// (whatever the app already sets globally); only color tokens change here.
function DossierThemeStyles() {
  return (
    <style>{`
      .dossier-theme {
        --background: 100 20% 96%;      /* #F5F7F3 paper */
        --foreground: 130 25% 12%;      /* #16241C ink */
        --card: 0 0% 100%;
        --card-foreground: 130 25% 12%;
        --primary: 148 38% 29%;         /* #2F6844 signal green */
        --primary-foreground: 100 20% 96%;
        --accent: 36 61% 47%;           /* #C98A2C ochre */
        --accent-foreground: 130 25% 12%;
        --muted: 100 15% 89%;           /* #E7EBE3 sage */
        --muted-foreground: 130 8% 44%; /* #6B7568 sage-gray */
        --border: 100 20% 85%;          /* #D8DFD3 hairline */
      }
    `}</style>
  );
}

function avatarSrc(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

const ROLE_LABELS: Record<string, string> = {
  innovator: "Innovator",
  startup: "Startup",
  investor: "Investor",
  consultant: "Consultant",
  ecosystem_partner: "Ecosystem Partner",
};

function roleLabel(role?: string) {
  if (!role) return "";
  return ROLE_LABELS[role] ?? role.replace("_", " ");
}

function RoleLabel({ role }: { role?: string }) {
  if (!role) return null;
  return (
    <Badge className="capitalize bg-primary text-primary-foreground hover:bg-primary/90 tracking-wide">
      {roleLabel(role)}
    </Badge>
  );
}

// ── Error screens ─────────────────────────────────────────────────────────────

function ErrorScreen({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="dossier-theme min-h-screen flex items-center justify-center bg-background p-6">
      <DossierThemeStyles />
      <Card className="max-w-sm w-full text-center border-border">
        <CardContent className="py-12 space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <Icon className="h-7 w-7 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Profile sections ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} variant="outline" className="text-xs border-border text-foreground/80">
          {item}
        </Badge>
      ))}
    </div>
  );
}

// Small helper for label/value pairs used across the "About the Company" grid
function InfoField({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

// Labeled paragraph block, used for Background / Vision / Current Focus / Pitch fields
function TextBlock({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm text-foreground leading-relaxed">{value}</p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function SharedProfile() {
  const { userId: shareId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access") ?? "";

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
      <div className="dossier-theme min-h-screen flex items-center justify-center bg-background">
        <DossierThemeStyles />
        <div className="text-muted-foreground text-sm animate-pulse">Loading dossier…</div>
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

  const p = data.profile as any;

  // role now comes back reliably at the top level of the shared-dashboard
  // response (data.role), same as /api/auth/me/. Keep the p.role fallback
  // in case an older cached response shape shows up.
  const role: string = data.role ?? p.role ?? "";

  // Parse JSON string fields returned by the backend
  function safeParse(val: any, fallback: any = null) {
    if (!val || typeof val !== "string") return val ?? fallback;
    try { return JSON.parse(val); } catch { return fallback; }
  }

  const fundingData     = safeParse(p.funding_data, {});
  const tractionData    = safeParse(p.traction_data, {});
  const teamMembers     = safeParse(p.team_members, []);
  const industryTags    = safeParse(p.industry_tags, []);
  const lookingFor      = safeParse(p.looking_for, []);
  const progressHighlights = safeParse(p.progress_highlights, []);
  const ecosystemSupport   = safeParse(p.ecosystem_support, []).filter((e: any) => e?.name);
  const companyJourney     = safeParse(p.company_journey_timeline, []);
  const trustPress         = safeParse(p.trust_press_data, {});

  return (
    <div className="dossier-theme min-h-screen bg-background">
      <DossierThemeStyles />
      {/* thin dossier ribbon */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary to-accent" />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* ── Profile Header ───────────────────────────────────────────── */}
        {p.banner && (
          <div className="h-40 rounded-xl overflow-hidden border border-border">
            <img
              src={avatarSrc(p.banner)}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <Avatar className="h-20 w-20 shrink-0 ring-2 ring-border ring-offset-2 ring-offset-background">
                <AvatarImage src={avatarSrc(p.avatar)} />
                <AvatarFallback className="text-xl font-bold bg-muted text-foreground">
                  {(p.user_name ?? p.full_name ?? "U")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1.5">
                {/* eyebrow: role stamp, sits above the name like a dossier header */}
                <div className="flex flex-wrap items-center gap-2">
                  <RoleLabel role={role} />
                  {p.stage && (
                    <Badge variant="outline" className="text-xs border-accent/50 text-accent">
                      {p.stage}
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-foreground truncate">
                  {p.user_name ?? p.full_name ?? "Anonymous"}
                </h1>

                {p.tagline && (
                  <p className="text-sm text-muted-foreground italic">{p.tagline}</p>
                )}

                {p.company_name && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {p.company_name}
                  </p>
                )}

                {p.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {p.location}
                  </p>
                )}

                {/* role + email grouped together as the identity line */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                  {role && (
                    <p className="text-sm text-foreground/80 flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-primary" />
                      {roleLabel(role)}
                    </p>
                  )}
                  {p.user_email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {p.user_email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {p.bio && (
              <p className="mt-4 text-sm text-foreground leading-relaxed">{p.bio}</p>
            )}

            {/* Social Links */}
            <div className="mt-4 flex flex-wrap gap-3">
              {p.linkedin && (
                <a
                  href={p.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {p.twitter && (
                <a
                  href={p.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              )}
              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Startup / Company Info ────────────────────────────────────── */}
        {(role === "startup" || p.company_name || p.stage || p.founded_year || p.team_size || p.industry || p.company_snapshot) && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                About the Company
              </h2>
              <Separator />

              {(p.company_snapshot || p.company_overview) && (
                <p className="text-sm text-foreground leading-relaxed">
                  {p.company_snapshot ?? p.company_overview}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoField label="Stage" value={p.stage} />
                <InfoField label="Founded" value={p.founded_year} />
                <InfoField label="Team" value={p.team_size ? `${p.team_size} people` : undefined} />
                <InfoField label="Industry" value={p.industry} />
                <InfoField label="Market Type" value={p.market_type} />
              </div>

              {industryTags?.length > 0 && <TagList items={industryTags} />}

              <TextBlock label="Background" value={p.company_background} />
              <TextBlock label="Vision & Direction" value={p.vision_direction} />
              <TextBlock label="Current Focus" value={p.current_focus} />
            </CardContent>
          </Card>
        )}

        {/* ── Company Journey ──────────────────────────────────────────── */}
        {companyJourney?.length > 0 && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Company Journey
              </h2>
              <Separator />
              <div>
                {companyJourney.map((item: any, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {i < companyJourney.length - 1 && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-xs font-semibold text-primary">{item.year}</p>
                      <p className="text-sm text-foreground leading-relaxed">{item.milestone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Milestones & Highlights ──────────────────────────────────── */}
        {progressHighlights?.length > 0 && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Milestones & Highlights
              </h2>
              <Separator />
              <ul className="space-y-2">
                {progressHighlights.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* ── The Pitch ─────────────────────────────────────────────────── */}
        {(p.problem_statement || p.solution || p.why_now || p.why_us) && (
            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-foreground">The Pitch</h2>
                <Separator />
                <TextBlock label="Problem" value={p.problem_statement} />
                <TextBlock label="Solution" value={p.solution} />
                <TextBlock label="Why Now" value={p.why_now} />
                <TextBlock label="Why Us" value={p.why_us} />
              </CardContent>
            </Card>
          )}

        {/* ── Funding ───────────────────────────────────────────────────── */}
        {fundingData && Object.keys(fundingData).length > 0 && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Funding
              </h2>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoField label="Stage" value={fundingData.stage} />
                <InfoField label="Raised" value={fundingData.amount_raised} />
                <InfoField label="Target Raise" value={fundingData.target_raise} />
                {fundingData.use_of_funds && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Use of Funds</p>
                    <p className="font-medium">{fundingData.use_of_funds}</p>
                  </div>
                )}
              </div>
              {fundingData.investors?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Investors</p>
                  <TagList items={fundingData.investors} />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Traction ──────────────────────────────────────────────────── */}
        {tractionData?.metrics?.length > 0 && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Traction
              </h2>
              <Separator />
              {tractionData.description && (
                <p className="text-sm text-muted-foreground">{tractionData.description}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {tractionData.metrics.map((m: any, i: number) => (
                  <div key={i} className="bg-muted/60 rounded-lg p-3 border border-border/60">
                    <p className="text-lg font-bold text-primary">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    {m.growth && <p className="text-xs text-accent font-medium">{m.growth}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Ecosystem & Support ──────────────────────────────────────── */}
        {ecosystemSupport?.length > 0 && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Handshake className="h-4 w-4 text-primary" />
                Ecosystem & Support
              </h2>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ecosystemSupport.map((e: any, i: number) => (
                  <div key={i} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{e.name}</p>
                      {e.type && (
                        <Badge variant="outline" className="text-xs capitalize shrink-0">
                          {e.type}
                        </Badge>
                      )}
                    </div>
                    {e.description && (
                      <p className="text-xs text-muted-foreground mt-1">{e.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Team ──────────────────────────────────────────────────────── */}
        {teamMembers?.length > 0 && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Team
              </h2>
              <Separator />
              <div className="space-y-3">
                {teamMembers.map((m: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={avatarSrc(m.avatar_url ?? m.avatar)} />
                      <AvatarFallback>
                        {(m.name ?? "?")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{m.name}</p>
                        {m.linkedin_url && (
                          <a
                            href={m.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:opacity-80"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{m.role}</p>
                      {m.background && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {m.background}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Press & Recognition ──────────────────────────────────────── */}
        {trustPress?.proofs?.length > 0 && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-primary" />
                Press & Recognition
              </h2>
              <Separator />
              <div className="space-y-3">
                {trustPress.proofs.map((item: any, i: number) => (
                  <div key={i} className="border border-border rounded-lg p-3 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      {item.type && (
                        <Badge variant="secondary" className="text-xs capitalize shrink-0">
                          {item.type.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.source}
                      {item.date ? ` · ${item.date}` : ""}
                    </p>
                    {item.description && (
                      <p className="text-sm text-foreground leading-relaxed">{item.description}</p>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" /> View source
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Skills (innovator / consultant) ───────────────────────────── */}
        {(p.skills?.length > 0 || p.expertise_areas?.length > 0) && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-3">
              <h2 className="font-semibold text-foreground">
                {role === "consultant" ? "Expertise" : "Skills"}
              </h2>
              <Separator />
              <TagList items={p.skills ?? p.expertise_areas ?? []} />
            </CardContent>
          </Card>
        )}

        {/* ── Investor info ──────────────────────────────────────────────── */}
        {role === "investor" && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Investment Focus</h2>
              <Separator />
              {p.investment_thesis && (
                <p className="text-sm text-foreground leading-relaxed">
                  {p.investment_thesis}
                </p>
              )}
              {p.sectors_of_interest?.length > 0 && (
                <Section title="Sectors">
                  <TagList items={p.sectors_of_interest} />
                </Section>
              )}
              {p.investment_stages?.length > 0 && (
                <Section title="Stages">
                  <TagList items={p.investment_stages} />
                </Section>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="/"
              className="text-primary font-semibold hover:underline"
            >
              PitchIn
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}