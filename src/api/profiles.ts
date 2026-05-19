// import { apiFetch } from './client';

// export type UserRole = 'innovator' | 'startup' | 'investor' | 'consultant' | 'ecosystem_partner';

// export interface BaseProfile {
//   id: number;
//   user: number;
//   user_name: string;
//   user_email?: string;
//   user_full_name?: string;
//   full_name: string | null;
//   bio: string | null;
//   avatar_url: string | null;
//   banner_url: string | null;
//   linkedin_url: string | null;
//   is_profile_complete: boolean;
//   role?: UserRole;
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
//   website: string | null;
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
// }

// export interface InvestorProfile extends BaseProfile {
//   sectors_of_interest: string[];
//   investment_stage: string[];
//   ticket_size: string | null;
//   portfolio_highlights: string | null;
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
//   availability: string | null;
//   hourly_rate: string | null;
//   expertise_areas: string[];
//   experience_summary: string | null;
// }

// export interface EcosystemPartnerProfile extends BaseProfile {
//   organization_name: string | null;
//   organization_type: string | null;
//   programs_offered: string[];
//   focus_sectors: string[];
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

// export async function updateMyProfile(data: Partial<AnyProfile>): Promise<AnyProfile> {
//   return apiFetch<AnyProfile>('/profiles/me/', {
//     method: 'PATCH',
//     body: JSON.stringify(data),
//   });
// }

// export async function getUserProfile(userId: number | string): Promise<AnyProfile> {
//   return apiFetch<AnyProfile>(`/profiles/${userId}/`);
// }

// export async function getPublicProfiles(role?: UserRole): Promise<AnyProfile[]> {
//   const query = role ? `?role=${role}` : '';
//   return apiFetch<AnyProfile[]>(`/profiles/public/${query}`);
// }

// export interface EcosystemPartnerProfile extends BaseProfile {
//   organization_name: string | null;
//   organization_type: string | null;
//   programs_offered: string[];
//   focus_sectors: string[];
//   // Add these:
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

export async function getMyProfile(): Promise<AnyProfile> {
  return apiFetch<AnyProfile>('/profiles/me/');
}

export async function getUserProfile(userId: number | string): Promise<AnyProfile> {
  return apiFetch<AnyProfile>(`/profiles/${userId}/`);
}

export async function getPublicProfiles(role?: UserRole): Promise<AnyProfile[]> {
  const query = role ? `?role=${role}` : '';
  return apiFetch<AnyProfile[]>(`/profiles/public/${query}`);
}

/**
 * Update the current user's profile.
 * Accepts an optional avatarFile and bannerFile for image uploads.
 * All other fields are sent as JSON via the base64 path (Base64ImageField on backend).
 */
export async function updateMyProfile(
  data: Partial<AnyProfile> & { avatarFile?: File | null; bannerFile?: File | null }
): Promise<AnyProfile> {
  const { avatarFile, bannerFile, ...rest } = data;

  // If there are actual File objects, use FormData (multipart)
  if (avatarFile || bannerFile) {
    const formData = new FormData();

    // Append all scalar/JSON fields
    for (const [key, value] of Object.entries(rest)) {
      if (value === null || value === undefined) continue;
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }

    if (avatarFile) formData.append('avatar', avatarFile);
    if (bannerFile) formData.append('banner', bannerFile);

    return apiFetch<AnyProfile>('/profiles/me/', {
      method: 'PATCH',
      body: formData,
      // Don't set Content-Type — browser sets multipart boundary automatically
    });
  }

  // No files — send as JSON (base64 strings for avatar/banner are fine here too)
  return apiFetch<AnyProfile>('/profiles/me/', {
    method: 'PATCH',
    body: JSON.stringify(rest),
  });
}