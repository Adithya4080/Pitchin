import { apiFetch } from './client';

export type UserRole = 'innovator' | 'startup' | 'investor' | 'consultant' | 'ecosystem_partner';

export interface BaseProfile {
  id: number;
  user: number;
  user_name: string;
  user_email?: string;
  user_full_name?: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  linkedin_url: string | null;
  is_profile_complete: boolean;
  role?: UserRole;
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
  website: string | null;
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
  sectors_of_interest: string[];
  investment_stage: string[];
  ticket_size: string | null;
  portfolio_highlights: string | null;
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
  availability: string | null;
  hourly_rate: string | null;
  expertise_areas: string[];
  experience_summary: string | null;
}

export interface EcosystemPartnerProfile extends BaseProfile {
  organization_name: string | null;
  organization_type: string | null;
  programs_offered: string[];
  focus_sectors: string[];
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

export async function updateMyProfile(data: Partial<AnyProfile>): Promise<AnyProfile> {
  return apiFetch<AnyProfile>('/profiles/me/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function getUserProfile(userId: number | string): Promise<AnyProfile> {
  return apiFetch<AnyProfile>(`/profiles/${userId}/`);
}

export async function getPublicProfiles(role?: UserRole): Promise<AnyProfile[]> {
  const query = role ? `?role=${role}` : '';
  return apiFetch<AnyProfile[]>(`/profiles/public/${query}`);
}

export interface EcosystemPartnerProfile extends BaseProfile {
  organization_name: string | null;
  organization_type: string | null;
  programs_offered: string[];
  focus_sectors: string[];
  // Add these:
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