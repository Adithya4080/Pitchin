export interface ProgramEntry {
  title: string;
  description: string;
  image_url?: string;
  status: 'active' | 'upcoming' | 'completed';
  external_link?: string;
  tags?: string[];
}

export interface HighlightEntry {
  title: string; // max 40 chars - bold headline metric/milestone
  description?: string; // max 60 chars - optional supporting text
  icon?: string; // optional lucide icon name (e.g., 'trophy', 'target', 'globe')
}

export interface SupportedStartupEntry {
  name: string;
  logo_url?: string;
  stage?: string;
  description?: string;
  profile_id?: string;
  linkedin_url?: string;
  website_url?: string;
}

export interface TestimonialEntry {
  quote: string;
  author_name: string;
  author_role: string;
}

export interface AlumniStartupEntry {
  startup_name: string;
  logo_url?: string;
  short_description?: string;
  status_tag?: 'Alumni' | 'Unicorn' | 'Public Company' | 'Acquired';
  external_link?: string;
}

export interface VoiceEntry {
  name: string; // required
  role: string; // required - title/role
  credibility_description: string; // required - max 120 chars
  portrait_url?: string; // optional - square or 4:5 ratio
  quote?: string; // optional - max 100 chars
  linkedin_url?: string; // optional
  website_url?: string; // optional
}

export interface EcosystemPartnerProfileData {
  id: string;
  user_id: string;
  organization_name: string | null;
  organization_type: string | null;
  overview: string | null;
  primary_website_url: string | null;
  is_verified: boolean;
  focus_industries: string[];
  supported_stages: string[];
  geographic_focus: string[];
  offerings: string[];
  programs: ProgramEntry[];
  featured_highlights: HighlightEntry[];
  supported_startups: SupportedStartupEntry[];
  testimonials: TestimonialEntry[];
  leadership_voices: VoiceEntry[];
  engagement_description: string | null;
  intro_video_url: string | null;
  intro_video_title: string | null;
  intro_video_description: string | null;
  intro_video_thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}
