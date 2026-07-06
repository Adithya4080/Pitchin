import type {
  ParsedProfile,
  FundingData,
  TractionData,
  TeamMember,
  EcosystemEntry,
  JourneyMilestone,
  TrustPressData,
  SharedProfileRaw,
} from "@/types/profile";

function safeParse<T>(val: unknown, fallback: T): T {
  if (val == null) return fallback;
  if (typeof val !== "string") return val as T;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

/**
 * Accepts whatever your actual API function returns (e.g. the real
 * `PublicSharedDashboard` type from `@/api/payment`, which likely types
 * `profile` as `Record<string, unknown>`). We don't require the exact
 * `SharedDashboardResponse` shape here on purpose — that would force your
 * API layer's return type to structurally match this file's types, which
 * is backwards. Instead we accept anything with a `profile` object and
 * cast internally, since the actual parsing below already handles missing
 * fields gracefully.
 */
export function parseSharedProfile(data: { role?: string; profile: unknown }): ParsedProfile {
  const p = (data.profile ?? {}) as SharedProfileRaw;

  return {
    ...p,
    role: data.role ?? p.role ?? "",
    fundingData: safeParse<FundingData>(p.funding_data, {}),
    tractionData: safeParse<TractionData>(p.traction_data, {}),
    teamMembers: safeParse<TeamMember[]>(p.team_members, []),
    industryTags: safeParse<string[]>(p.industry_tags, []),
    lookingFor: safeParse<string[]>(p.looking_for, []),
    progressHighlights: safeParse<string[]>(p.progress_highlights, []),
    ecosystemSupport: safeParse<EcosystemEntry[]>(p.ecosystem_support, []).filter(
      (e) => !!e?.name
    ),
    companyJourney: safeParse<JourneyMilestone[]>(p.company_journey_timeline, []),
    trustPress: safeParse<TrustPressData>(p.trust_press_data, {}),
  };
}

export function avatarSrc(path: string | null | undefined, apiBase: string): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${apiBase}${path}`;
}

export function splitNumericFormat(raw: string): {
  prefix: string;
  value: number;
  decimals: number;
  suffix: string;
} | null {
  const match = raw.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, numStr, suffix] = match;
  const cleaned = numStr.replace(/,/g, "");
  const value = parseFloat(cleaned);
  if (Number.isNaN(value)) return null;
  const decimals = cleaned.includes(".") ? cleaned.split(".")[1].length : 0;
  return { prefix, value, decimals, suffix };
}
