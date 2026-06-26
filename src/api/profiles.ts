// import { apiFetch, getAccessToken } from './client';

// export type UserRole = 'innovator' | 'startup' | 'investor' | 'consultant' | 'ecosystem_partner';

// // These field names match the Django backend exactly
// export interface BaseProfile {
//   id: number;
//   user_email: string;
//   user_name: string;        // maps to user.full_name in backend
//   avatar: string | null;    // backend field name is 'avatar'
//   banner: string | null;    // backend field name is 'banner'
//   bio: string;
//   location: string;
//   website: string;
//   linkedin: string;         // backend field name is 'linkedin'
//   twitter: string;          // backend field name is 'twitter'
//   is_profile_complete: boolean;
//   created_at: string;
//   updated_at: string;
//   role?: UserRole;
//   // Subscription / payment tier fields
//   subscription_tier?: 'free' | 'pro' | 'enterprise';
//   subscription_expires_at?: string | null;
//   is_pro?: boolean;
//   // Computed by backend
//   profile_strength?: number;
//   // Legacy aliases used in some components — kept for compatibility
//   avatar_url?: string | null;
//   banner_url?: string | null;
//   linkedin_url?: string | null;
//   twitter_url?: string | null;
//   website_url?: string | null;
//   full_name?: string | null;
// }

// export interface EducationEntry {
//   institution: string;
//   field_of_study: string;
//   duration: string;
// }

// export interface WorkExperienceEntry {
//   role: string;
//   organization: string;
//   description: string;
//   time_period: string;
// }

// export interface MentorBackerEntry {
//   name: string;
//   role: string;
//   profile_link?: string;
// }

// export interface JourneyTimelineEntry {
//   year: string;
//   milestone: string;
// }

// export interface InnovatorProfile extends BaseProfile {
//   skills: string[];
//   achievements: string | null;
//   featured_project_title: string | null;
//   featured_project_description: string | null;
//   professional_snapshot: string | null;
//   focus_areas: string[];
//   current_identity: string | null;
//   experience_summary: string | null;
//   background_journey: string | null;
//   education: EducationEntry[];
//   work_experience: WorkExperienceEntry[];
//   skills_capabilities: string[];
//   mentors_backers: MentorBackerEntry[];
//   journey_timeline: JourneyTimelineEntry[];
//   // Dashboard sections
//   funding_data?: import('@/components/profile').FundingData | null;
//   traction_data?: import('@/components/profile').TractionData | null;
//   trust_press_data?: import('@/components/profile').TrustPressData | null;
// }

// export interface EcosystemSupportEntry {
//   name: string;
//   type: 'accelerator' | 'community' | 'program' | 'grant';
//   description?: string;
// }

// export interface CompanyJourneyEntry {
//   year: string;
//   milestone: string;
// }

// export interface StartupProfile extends BaseProfile {
//   company_name: string | null;
//   company_overview: string | null;
//   industry: string | null;
//   stage: string | null;
//   founded_year: number | null;
//   team_size: number | null;
//   company_snapshot: string | null;
//   industry_tags: string[];
//   market_type: string | null;
//   operating_status: string | null;
//   company_background: string | null;
//   vision_direction: string | null;
//   current_focus: string | null;
//   progress_highlights: string[];
//   ecosystem_support: EcosystemSupportEntry[];
//   company_journey_timeline: CompanyJourneyEntry[];
//   looking_for: string | null;
//   // Dashboard sections
//   funding_data?: import('@/components/profile').FundingData | null;
//   traction_data?: import('@/components/profile').TractionData | null;
//   trust_press_data?: import('@/components/profile').TrustPressData | null;
// }

// export interface InvestorProfile extends BaseProfile {
//   firm_name: string;
//   investment_thesis: string;
//   sectors_of_interest: string[];
//   investment_stages: string[];
//   ticket_size_min: number | null;
//   ticket_size_max: number | null;
//   portfolio_companies: string[];
//   total_investments: number;
//   investor_type: string | null;
//   investment_range: string | null;
//   preferred_sectors: string[];
//   region_focus: string | null;
//   investment_criteria: string | null; 
// }

// export interface ConsultantProfile extends BaseProfile {
//   expertise: string[];
//   services_offered: string | null;
//   years_of_experience: number | null;
//   availability: string;
//   hourly_rate: string | null;
//   industries_served: string[];
//   certifications: string[];
//   experience_summary: string | null;
//   expertise_areas: string[];
//   services_description: string | null;
//   services_pricing: string | null;
//   services_availability: string | null;
// }

// export interface EcosystemPartnerProfile extends BaseProfile {
//   organization_name: string | null;
//   organization_type: string | null;
//   programs_offered: string[];
//   sectors_focus: string[];
//   stage_focus: string[];
//   programs: any[];
//   founded_year: string | null;
//   headquarters: string | null;
//   geographic_focus: string[];
//   mission_statement: string | null;
//   focus_areas: string[];
//   sectors: string[];
//   engagement_type: string | null;
//   program_duration: string | null;
//   equity_model: string | null;
//   partnerships: { name: string; type?: string }[];
//   startups_supported_count: number | null;
//   years_active: number | null;
//   global_alumni_reach: string | null;
//   engagement_description: string | null;
//   alumni_startups: any[];
//   supported_startups: any[];
//   leadership_voices: any[];
//   following_id: number | null;
// }

// export type AnyProfile =
//   | InnovatorProfile
//   | StartupProfile
//   | InvestorProfile
//   | ConsultantProfile
//   | EcosystemPartnerProfile;

// export async function getMyProfile(): Promise<AnyProfile> {
//   return apiFetch<AnyProfile>('/profiles/me/');
// }

// export async function getUserProfile(userId: number | string): Promise<AnyProfile> {
//   return apiFetch<AnyProfile>(`/profiles/${userId}/`);
// }

// export async function getPublicProfiles(role?: UserRole): Promise<AnyProfile[]> {
//   const query = role ? `?role=${role}` : '';
//   return apiFetch<AnyProfile[]>(`/profiles/public/${query}`);
// }

// export async function updateMyProfile(
//   data: Partial<AnyProfile> & {
//     avatarFile?: File | null;
//     bannerFile?: File | null;
//   }
// ): Promise<AnyProfile> {

//   const formData = new FormData();

//   const {
//     avatarFile,
//     bannerFile,
//     avatar,
//     banner,
//     ...rest
//   } = data;

//   // Append normal fields
//   for (const [key, value] of Object.entries(rest)) {

//     // Skip undefined values
//     if (value === undefined) continue;

//     // Handle arrays / objects
//     if (
//       typeof value === 'object' &&
//       value !== null &&
//       !(value instanceof File)
//     ) {
//       formData.append(key, JSON.stringify(value));
//     }

//     // Handle primitive values
//     else if (value !== null) {
//       formData.append(key, String(value));
//     }
//   }

//   // Upload avatar file
//   if (avatarFile instanceof File) {
//     formData.append('avatar', avatarFile);
//   }

//   // Upload banner file
//   if (bannerFile instanceof File) {
//     formData.append('banner', bannerFile);
//   }

//   // Remove avatar
//   if (avatar === null) {
//     formData.append('avatar', '');
//   }

//   // Remove banner
//   if (banner === null) {
//     formData.append('banner', '');
//   }

//   return apiFetch<AnyProfile>('/profiles/me/', {
//     method: 'PATCH',
//     body: formData,
//   });
// }

import { apiFetch, getAccessToken } from './client';

export type UserRole = 'innovator' | 'startup' | 'investor' | 'consultant' | 'ecosystem_partner';

// These field names match the Django backend exactly
export interface BaseProfile {
  id: number;
  user_email: string;
  user_name: string;        // maps to user.full_name in backend
  avatar: string | null;    // backend field name is 'avatar'
  banner: string | null;    // backend field name is 'banner'
  bio: string;
  location: string;
  website: string;
  linkedin: string;         // backend field name is 'linkedin'
  twitter: string;          // backend field name is 'twitter'
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
  role?: UserRole;
  // Subscription / payment tier fields
  subscription_tier?: 'free' | 'pro' | 'enterprise';
  subscription_expires_at?: string | null;
  is_pro?: boolean;
  // Computed by backend
  profile_strength?: number;
  // Legacy aliases used in some components — kept for compatibility
  avatar_url?: string | null;
  banner_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  website_url?: string | null;
  full_name?: string | null;
}

export interface EducationEntry {
  institution: string;
  field_of_study: string;
  duration: string;
}

export interface WorkExperienceEntry {
  role: string;
  organization: string;
  description: string;
  time_period: string;
}

export interface MentorBackerEntry {
  name: string;
  role: string;
  profile_link?: string;
}

export interface JourneyTimelineEntry {
  year: string;
  milestone: string;
}

export interface InnovatorProfile extends BaseProfile {
  skills: string[];
  achievements: string | null;
  featured_project_title: string | null;
  featured_project_description: string | null;
  professional_snapshot: string | null;
  focus_areas: string[];
  current_identity: string | null;
  experience_summary: string | null;
  background_journey: string | null;
  education: EducationEntry[];
  work_experience: WorkExperienceEntry[];
  skills_capabilities: string[];
  mentors_backers: MentorBackerEntry[];
  journey_timeline: JourneyTimelineEntry[];
  // Dashboard sections
  funding_data?: import('@/components/profile').FundingData | null;
  traction_data?: import('@/components/profile').TractionData | null;
  trust_press_data?: import('@/components/profile').TrustPressData | null;
}

export interface EcosystemSupportEntry {
  name: string;
  type: 'accelerator' | 'community' | 'program' | 'grant';
  description?: string;
}

export interface CompanyJourneyEntry {
  year: string;
  milestone: string;
}

export interface StartupProfile extends BaseProfile {
  company_name: string | null;
  company_overview: string | null;
  industry: string | null;
  stage: string | null;
  founded_year: number | null;
  team_size: number | null;
  company_snapshot: string | null;
  industry_tags: string[];
  market_type: string | null;
  operating_status: string | null;
  company_background: string | null;
  vision_direction: string | null;
  current_focus: string | null;
  progress_highlights: string[];
  ecosystem_support: EcosystemSupportEntry[];
  company_journey_timeline: CompanyJourneyEntry[];
  looking_for: string | null;
  // Dashboard sections
  funding_data?: import('@/components/profile').FundingData | null;
  traction_data?: import('@/components/profile').TractionData | null;
  trust_press_data?: import('@/components/profile').TrustPressData | null;
}

export interface InvestorProfile extends BaseProfile {
  firm_name: string;
  investment_thesis: string;
  sectors_of_interest: string[];
  investment_stages: string[];
  ticket_size_min: number | null;
  ticket_size_max: number | null;
  portfolio_companies: string[];
  total_investments: number;
  investor_type: string | null;
  investment_range: string | null;
  preferred_sectors: string[];
  region_focus: string | null;
  investment_criteria: string | null; 
}

export interface ConsultantProfile extends BaseProfile {
  expertise: string[];
  services_offered: string | null;
  years_of_experience: number | null;
  availability: string;
  hourly_rate: string | null;
  industries_served: string[];
  certifications: string[];
  experience_summary: string | null;
  expertise_areas: string[];
  services_description: string | null;
  services_pricing: string | null;
  services_availability: string | null;
}

export interface EcosystemPartnerProfile extends BaseProfile {
  organization_name: string | null;
  organization_type: string | null;
  programs_offered: string[];
  sectors_focus: string[];
  stage_focus: string[];
  programs: any[];
  founded_year: string | null;
  headquarters: string | null;
  geographic_focus: string[];
  mission_statement: string | null;
  focus_areas: string[];
  sectors: string[];
  engagement_type: string | null;
  program_duration: string | null;
  equity_model: string | null;
  partnerships: { name: string; type?: string }[];
  startups_supported_count: number | null;
  years_active: number | null;
  global_alumni_reach: string | null;
  engagement_description: string | null;
  alumni_startups: any[];
  supported_startups: any[];
  leadership_voices: any[];
  following_id: number | null;
}

export type AnyProfile =
  | InnovatorProfile
  | StartupProfile
  | InvestorProfile
  | ConsultantProfile
  | EcosystemPartnerProfile;

/**
 * The Django backend sometimes returns JSON fields as raw strings (or as
 * corrupted objects where keys are character indices, e.g. {"0":"{","1":"}","amount_raised":"…"}).
 * This helper safely parses them back into proper objects / arrays.
 */
function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined || value === '') return fallback;
  // Already a proper object / array — but check for the corrupted {0:"{", 1:"}"} shape
  if (typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    // Corrupted: keys "0" and "1" are individual characters of "{" and "}"
    if (obj['0'] === '{' && obj['1'] === '}') {
      // Reconstruct: drop the char-index keys and keep the real fields
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (isNaN(Number(k))) clean[k] = v;
      }
      return clean as unknown as T;
    }
    return value as T;
  }
  if (Array.isArray(value)) return value as unknown as T;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

/** Normalise profile fields that may arrive as strings or corrupted objects */
function normaliseProfile<T extends AnyProfile>(raw: T): T {
  const JSON_OBJECT_FIELDS = ['funding_data', 'traction_data', 'trust_press_data'] as const;
  const JSON_ARRAY_FIELDS  = [
    'looking_for', 'progress_highlights', 'ecosystem_support',
    'company_journey_timeline', 'team_members', 'industry_tags',
  ] as const;

  const out = { ...raw } as any;

  for (const field of JSON_OBJECT_FIELDS) {
    if (field in out) out[field] = parseJsonField(out[field], null);
  }
  for (const field of JSON_ARRAY_FIELDS) {
    if (field in out) out[field] = parseJsonField(out[field], []);
  }

  return out as T;
}

export async function getMyProfile(): Promise<AnyProfile> {
  const raw = await apiFetch<AnyProfile>('/profiles/me/');
  return normaliseProfile(raw);
}

export async function getUserProfile(userId: number | string): Promise<AnyProfile> {
  const raw = await apiFetch<AnyProfile>(`/profiles/${userId}/`);
  return normaliseProfile(raw);
}

export async function getPublicProfiles(role?: UserRole): Promise<AnyProfile[]> {
  const query = role ? `?role=${role}` : '';
  return apiFetch<AnyProfile[]>(`/profiles/public/${query}`);
}

export async function updateMyProfile(
  data: Partial<AnyProfile> & {
    avatarFile?: File | null;
    bannerFile?: File | null;
  }
): Promise<AnyProfile> {

  const formData = new FormData();

  const {
    avatarFile,
    bannerFile,
    avatar,
    banner,
    ...rest
  } = data;

  // Append normal fields
  for (const [key, value] of Object.entries(rest)) {

    // Skip undefined values
    if (value === undefined) continue;

    // Handle arrays / objects
    if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof File)
    ) {
      formData.append(key, JSON.stringify(value));
    }

    // Handle primitive values
    else if (value !== null) {
      formData.append(key, String(value));
    }
  }

  // Upload avatar file
  if (avatarFile instanceof File) {
    formData.append('avatar', avatarFile);
  }

  // Upload banner file
  if (bannerFile instanceof File) {
    formData.append('banner', bannerFile);
  }

  // Remove avatar
  if (avatar === null) {
    formData.append('avatar', '');
  }

  // Remove banner
  if (banner === null) {
    formData.append('banner', '');
  }

  return apiFetch<AnyProfile>('/profiles/me/', {
    method: 'PATCH',
    body: formData,
  });
}
// ─── Networking & Opportunities ────────────────────────────────────────────────

export type NetworkTab = 'investor' | 'mentor' | 'partner' | 'accelerator' | 'community';

export interface NetworkProfile {
  id: number;
  user_id: number;
  name: string;
  role: string;
  role_label: string;
  org_name: string;
  avatar: string | null;
  bio: string;
  tags: string[];
  is_verified: boolean;
  location: string;
  website: string;
}

export interface NetworkDiscoverResponse {
  results: NetworkProfile[];
  count: number;
  num_pages: number;
  page: number;
}

export async function getNetworkDiscover(params: {
  tab?: NetworkTab;
  search?: string;
  stage?: string;
  page?: number;
  page_size?: number;
}): Promise<NetworkDiscoverResponse> {
  const q = new URLSearchParams();
  if (params.tab) q.set('tab', params.tab);
  if (params.search) q.set('search', params.search);
  if (params.stage) q.set('stage', params.stage);
  if (params.page) q.set('page', String(params.page));
  if (params.page_size) q.set('page_size', String(params.page_size));
  return apiFetch(`/profiles/network/discover/?${q.toString()}`);
}