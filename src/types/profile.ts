// Types mirror the real payload from
// GET /api/payment/shared/<share_id>/?access=<token>
// Fields that come back as JSON-encoded strings are typed here as their
// *parsed* shape — see parseSharedProfile() in lib/parseSharedProfile.ts

export interface FundingData {
  is_raising?: boolean;
  stage?: string;
  amount_raised?: string;
  target_raise?: string;
  investors?: string[];
  use_of_funds?: string;
}

export interface TractionMetric {
  label: string;
  value: string;
  growth?: string;
}

export interface TractionData {
  description?: string;
  metrics?: TractionMetric[];
}

export interface TeamMember {
  name: string;
  role?: string;
  background?: string;
  avatar_url?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  website_url?: string;
}

export interface JourneyMilestone {
  year: string;
  milestone: string;
}

export interface EcosystemEntry {
  name: string;
  type?: string;
  description?: string;
}

export type ProofType =
  | "press"
  | "award"
  | "customer_logo"
  | "certification"
  | "testimonial"
  | string;

export interface TrustProof {
  type: ProofType;
  title: string;
  source?: string;
  url?: string;
  description?: string;
  date?: string;
}

export interface TrustPressData {
  proofs?: TrustProof[];
}

export interface SharedProfileRaw {
  id: number;
  user_email?: string;
  user_id?: number;
  user_name?: string;
  full_name?: string;
  avatar?: string;
  banner?: string;
  profile_strength?: number;
  is_pro?: boolean;
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  is_profile_complete?: boolean;
  company_name?: string;
  tagline?: string;
  industry?: string;
  stage?: string;
  founded_year?: number;
  team_size?: number | null;
  funding_raised?: string | null;
  problem_statement?: string;
  solution?: string;
  why_now?: string;
  why_us?: string;
  target_market?: string;
  pitch_deck_url?: string;
  company_snapshot?: string;
  company_overview?: string;
  operating_status?: string;
  company_background?: string;
  vision_direction?: string;
  current_focus?: string;
  market_type?: string;
  role?: string;
  skills?: string[];
  expertise_areas?: string[];
  investment_thesis?: string;
  sectors_of_interest?: string[];
  investment_stages?: string[];

  // JSON-encoded-as-string fields on the wire
  looking_for?: string;
  industry_tags?: string;
  funding_data?: string;
  traction_data?: string;
  trust_press_data?: string;
  progress_highlights?: string;
  ecosystem_support?: string;
  company_journey_timeline?: string;
  team_members?: string;
}

export interface SharedDashboardResponse {
  share_id: string;
  view_count: number;
  role?: string;
  profile: SharedProfileRaw;
}

// Parsed, UI-ready shape
export interface ParsedProfile extends SharedProfileRaw {
  role: string;
  fundingData: FundingData;
  tractionData: TractionData;
  teamMembers: TeamMember[];
  industryTags: string[];
  lookingFor: string[];
  progressHighlights: string[];
  ecosystemSupport: EcosystemEntry[];
  companyJourney: JourneyMilestone[];
  trustPress: TrustPressData;
}
