export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      consultant_profiles: {
        Row: {
          availability: string | null
          created_at: string | null
          experience_summary: string | null
          expertise_areas: string[] | null
          hourly_rate: string | null
          id: string
          services_offered: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability?: string | null
          created_at?: string | null
          experience_summary?: string | null
          expertise_areas?: string[] | null
          hourly_rate?: string | null
          id?: string
          services_offered?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability?: string | null
          created_at?: string | null
          experience_summary?: string | null
          expertise_areas?: string[] | null
          hourly_rate?: string | null
          id?: string
          services_offered?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          pitch_id: string
          requester_id: string
          responded_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          pitch_id: string
          requester_id: string
          responded_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          pitch_id?: string
          requester_id?: string
          responded_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      ecosystem_partner_profiles: {
        Row: {
          alumni_startups: Json | null
          created_at: string | null
          engagement_description: string | null
          engagement_type: string | null
          equity_model: string | null
          featured_highlights: Json | null
          focus_areas: string[] | null
          focus_industries: string[] | null
          founded_year: string | null
          geographic_focus: string[] | null
          global_alumni_reach: string | null
          headquarters: string | null
          id: string
          intro_video_description: string | null
          intro_video_thumbnail_url: string | null
          intro_video_title: string | null
          intro_video_url: string | null
          is_verified: boolean | null
          leadership_voices: Json | null
          mission_statement: string | null
          offerings: string[] | null
          organization_name: string | null
          organization_type: string | null
          overview: string | null
          partnerships: Json | null
          primary_website_url: string | null
          program_duration: string | null
          programs: Json | null
          sectors: string[] | null
          startups_supported_count: number | null
          supported_stages: string[] | null
          supported_startups: Json | null
          testimonials: Json | null
          updated_at: string | null
          user_id: string
          years_active: number | null
        }
        Insert: {
          alumni_startups?: Json | null
          created_at?: string | null
          engagement_description?: string | null
          engagement_type?: string | null
          equity_model?: string | null
          featured_highlights?: Json | null
          focus_areas?: string[] | null
          focus_industries?: string[] | null
          founded_year?: string | null
          geographic_focus?: string[] | null
          global_alumni_reach?: string | null
          headquarters?: string | null
          id?: string
          intro_video_description?: string | null
          intro_video_thumbnail_url?: string | null
          intro_video_title?: string | null
          intro_video_url?: string | null
          is_verified?: boolean | null
          leadership_voices?: Json | null
          mission_statement?: string | null
          offerings?: string[] | null
          organization_name?: string | null
          organization_type?: string | null
          overview?: string | null
          partnerships?: Json | null
          primary_website_url?: string | null
          program_duration?: string | null
          programs?: Json | null
          sectors?: string[] | null
          startups_supported_count?: number | null
          supported_stages?: string[] | null
          supported_startups?: Json | null
          testimonials?: Json | null
          updated_at?: string | null
          user_id: string
          years_active?: number | null
        }
        Update: {
          alumni_startups?: Json | null
          created_at?: string | null
          engagement_description?: string | null
          engagement_type?: string | null
          equity_model?: string | null
          featured_highlights?: Json | null
          focus_areas?: string[] | null
          focus_industries?: string[] | null
          founded_year?: string | null
          geographic_focus?: string[] | null
          global_alumni_reach?: string | null
          headquarters?: string | null
          id?: string
          intro_video_description?: string | null
          intro_video_thumbnail_url?: string | null
          intro_video_title?: string | null
          intro_video_url?: string | null
          is_verified?: boolean | null
          leadership_voices?: Json | null
          mission_statement?: string | null
          offerings?: string[] | null
          organization_name?: string | null
          organization_type?: string | null
          overview?: string | null
          partnerships?: Json | null
          primary_website_url?: string | null
          program_duration?: string | null
          programs?: Json | null
          sectors?: string[] | null
          startups_supported_count?: number | null
          supported_stages?: string[] | null
          supported_startups?: Json | null
          testimonials?: Json | null
          updated_at?: string | null
          user_id?: string
          years_active?: number | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
          message: string | null
          responded_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
          message?: string | null
          responded_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
          message?: string | null
          responded_at?: string | null
          status?: string
        }
        Relationships: []
      }
      innovator_profiles: {
        Row: {
          achievements: string | null
          background_journey: string | null
          created_at: string | null
          current_identity: string | null
          education: Json | null
          experience_summary: string | null
          featured_project_description: string | null
          featured_project_title: string | null
          focus_areas: string[] | null
          id: string
          intro_video_description: string | null
          intro_video_thumbnail_url: string | null
          intro_video_title: string | null
          intro_video_url: string | null
          journey_timeline: Json | null
          mentors_backers: Json | null
          professional_snapshot: string | null
          skills: string[] | null
          skills_capabilities: string[] | null
          team_members: Json | null
          updated_at: string | null
          user_id: string
          work_experience: Json | null
        }
        Insert: {
          achievements?: string | null
          background_journey?: string | null
          created_at?: string | null
          current_identity?: string | null
          education?: Json | null
          experience_summary?: string | null
          featured_project_description?: string | null
          featured_project_title?: string | null
          focus_areas?: string[] | null
          id?: string
          intro_video_description?: string | null
          intro_video_thumbnail_url?: string | null
          intro_video_title?: string | null
          intro_video_url?: string | null
          journey_timeline?: Json | null
          mentors_backers?: Json | null
          professional_snapshot?: string | null
          skills?: string[] | null
          skills_capabilities?: string[] | null
          team_members?: Json | null
          updated_at?: string | null
          user_id: string
          work_experience?: Json | null
        }
        Update: {
          achievements?: string | null
          background_journey?: string | null
          created_at?: string | null
          current_identity?: string | null
          education?: Json | null
          experience_summary?: string | null
          featured_project_description?: string | null
          featured_project_title?: string | null
          focus_areas?: string[] | null
          id?: string
          intro_video_description?: string | null
          intro_video_thumbnail_url?: string | null
          intro_video_title?: string | null
          intro_video_url?: string | null
          journey_timeline?: Json | null
          mentors_backers?: Json | null
          professional_snapshot?: string | null
          skills?: string[] | null
          skills_capabilities?: string[] | null
          team_members?: Json | null
          updated_at?: string | null
          user_id?: string
          work_experience?: Json | null
        }
        Relationships: []
      }
      investor_profiles: {
        Row: {
          created_at: string | null
          id: string
          investment_criteria: string | null
          investment_range: string | null
          investor_type: string | null
          preferred_sectors: string[] | null
          region_focus: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_criteria?: string | null
          investment_range?: string | null
          investor_type?: string | null
          preferred_sectors?: string[] | null
          region_focus?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_criteria?: string | null
          investment_range?: string | null
          investor_type?: string | null
          preferred_sectors?: string[] | null
          region_focus?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          pitch_id: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          pitch_id?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          pitch_id?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_attachments: {
        Row: {
          created_at: string
          description: string | null
          file_size: number
          file_type: string
          file_url: string
          id: string
          original_filename: string
          pitch_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_size: number
          file_type: string
          file_url: string
          id?: string
          original_filename: string
          pitch_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          original_filename?: string
          pitch_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_attachments_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "profile_pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      pitches: {
        Row: {
          category: Database["public"]["Enums"]["pitch_category"] | null
          contact_email: string | null
          contact_linkedin: string | null
          contact_visibility:
            | Database["public"]["Enums"]["contact_visibility"]
            | null
          created_at: string
          cta_label: string | null
          cta_open_new_tab: boolean | null
          cta_url: string | null
          description: string | null
          expires_at: string
          external_link_description: string | null
          external_link_title: string | null
          external_link_url: string | null
          id: string
          image_url: string | null
          is_active: boolean
          links: Json | null
          pitch_statement: string
          post_title: string | null
          reaction_count: number
          save_count: number
          supporting_line: string | null
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["pitch_category"] | null
          contact_email?: string | null
          contact_linkedin?: string | null
          contact_visibility?:
            | Database["public"]["Enums"]["contact_visibility"]
            | null
          created_at?: string
          cta_label?: string | null
          cta_open_new_tab?: boolean | null
          cta_url?: string | null
          description?: string | null
          expires_at?: string
          external_link_description?: string | null
          external_link_title?: string | null
          external_link_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          links?: Json | null
          pitch_statement: string
          post_title?: string | null
          reaction_count?: number
          save_count?: number
          supporting_line?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["pitch_category"] | null
          contact_email?: string | null
          contact_linkedin?: string | null
          contact_visibility?:
            | Database["public"]["Enums"]["contact_visibility"]
            | null
          created_at?: string
          cta_label?: string | null
          cta_open_new_tab?: boolean | null
          cta_url?: string | null
          description?: string | null
          expires_at?: string
          external_link_description?: string | null
          external_link_title?: string | null
          external_link_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          links?: Json | null
          pitch_statement?: string
          post_title?: string | null
          reaction_count?: number
          save_count?: number
          supporting_line?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profile_pitches: {
        Row: {
          created_at: string
          current_stage: string | null
          description: string
          id: string
          image_url: string | null
          looking_for: string[] | null
          open_considerations: string | null
          problem_statement: string | null
          short_summary: string | null
          solution_overview: string | null
          status: string
          supporting_materials: Json | null
          target_users: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_stage?: string | null
          description: string
          id?: string
          image_url?: string | null
          looking_for?: string[] | null
          open_considerations?: string | null
          problem_statement?: string | null
          short_summary?: string | null
          solution_overview?: string | null
          status?: string
          supporting_materials?: Json | null
          target_users?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_stage?: string | null
          description?: string
          id?: string
          image_url?: string | null
          looking_for?: string[] | null
          open_considerations?: string | null
          problem_statement?: string | null
          short_summary?: string | null
          solution_overview?: string | null
          status?: string
          supporting_materials?: Json | null
          target_users?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_shares: {
        Row: {
          access_token: string
          created_at: string
          id: string
          is_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          contact_email: string | null
          created_at: string
          email: string | null
          followers_count: number | null
          full_name: string | null
          id: string
          is_onboarded: boolean
          linkedin_url: string | null
          location: string | null
          portfolio_url: string | null
          profile_views: number | null
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          email?: string | null
          followers_count?: number | null
          full_name?: string | null
          id: string
          is_onboarded?: boolean
          linkedin_url?: string | null
          location?: string | null
          portfolio_url?: string | null
          profile_views?: number | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          email?: string | null
          followers_count?: number | null
          full_name?: string | null
          id?: string
          is_onboarded?: boolean
          linkedin_url?: string | null
          location?: string | null
          portfolio_url?: string | null
          profile_views?: number | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string
          id: string
          pitch_id: string
          reaction_type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pitch_id: string
          reaction_type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pitch_id?: string
          reaction_type?: Database["public"]["Enums"]["reaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      saves: {
        Row: {
          created_at: string
          id: string
          pitch_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pitch_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pitch_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saves_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_profile_feedback: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          source_profile_id: string
          usefulness_response: string | null
          visitor_role: string | null
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          source_profile_id: string
          usefulness_response?: string | null
          visitor_role?: string | null
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          source_profile_id?: string
          usefulness_response?: string | null
          visitor_role?: string | null
        }
        Relationships: []
      }
      startup_profiles: {
        Row: {
          company_background: string | null
          company_journey_timeline: Json | null
          company_name: string | null
          company_overview: string | null
          company_snapshot: string | null
          created_at: string | null
          current_focus: string | null
          ecosystem_support: Json | null
          founded_year: string | null
          id: string
          industry_tags: string[] | null
          intro_video_description: string | null
          intro_video_thumbnail_url: string | null
          intro_video_title: string | null
          intro_video_url: string | null
          looking_for: string | null
          market_type: string | null
          operating_status: string | null
          progress_highlights: string[] | null
          stage: string | null
          team_members: Json | null
          updated_at: string | null
          user_id: string
          vision_direction: string | null
        }
        Insert: {
          company_background?: string | null
          company_journey_timeline?: Json | null
          company_name?: string | null
          company_overview?: string | null
          company_snapshot?: string | null
          created_at?: string | null
          current_focus?: string | null
          ecosystem_support?: Json | null
          founded_year?: string | null
          id?: string
          industry_tags?: string[] | null
          intro_video_description?: string | null
          intro_video_thumbnail_url?: string | null
          intro_video_title?: string | null
          intro_video_url?: string | null
          looking_for?: string | null
          market_type?: string | null
          operating_status?: string | null
          progress_highlights?: string[] | null
          stage?: string | null
          team_members?: Json | null
          updated_at?: string | null
          user_id: string
          vision_direction?: string | null
        }
        Update: {
          company_background?: string | null
          company_journey_timeline?: Json | null
          company_name?: string | null
          company_overview?: string | null
          company_snapshot?: string | null
          created_at?: string | null
          current_focus?: string | null
          ecosystem_support?: Json | null
          founded_year?: string | null
          id?: string
          industry_tags?: string[] | null
          intro_video_description?: string | null
          intro_video_thumbnail_url?: string | null
          intro_video_title?: string | null
          intro_video_url?: string | null
          looking_for?: string | null
          market_type?: string | null
          operating_status?: string | null
          progress_highlights?: string[] | null
          stage?: string | null
          team_members?: Json | null
          updated_at?: string | null
          user_id?: string
          vision_direction?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_shared_feedback: {
        Args: never
        Returns: {
          created_at: string
          feedback_id: string
          feedback_text: string
          profile_avatar: string
          profile_name: string
          source_profile_id: string
          usefulness_response: string
          visitor_role: string
        }[]
      }
      get_admin_shared_profiles: {
        Args: never
        Returns: {
          access_token: string
          avatar_url: string
          created_at: string
          full_name: string
          is_enabled: boolean
          share_id: string
          updated_at: string
          user_email: string
          user_id: string
        }[]
      }
      get_full_shared_profile: {
        Args: { _access_token: string; _user_id: string }
        Returns: Json
      }
      get_pitch_contact_info: {
        Args: { _pitch_id: string; _requester_id: string }
        Returns: {
          contact_email: string
          contact_linkedin: string
        }[]
      }
      get_shared_pitch_detail: {
        Args: { _access_token: string; _pitch_id: string; _user_id: string }
        Returns: Json
      }
      get_shared_profile: {
        Args: { _access_token: string; _user_id: string }
        Returns: {
          is_valid: boolean
          user_role: string
        }[]
      }
      get_user_id_by_email: { Args: { _email: string }; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_approved_contact_access: {
        Args: { _pitch_owner_id: string; _requester_id: string }
        Returns: boolean
      }
      has_follow_access: {
        Args: { _follower_id: string; _following_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_pitchin_admin: { Args: never; Returns: boolean }
      user_has_active_pitch: { Args: { user_uuid: string }; Returns: boolean }
      validate_profile_share_token: {
        Args: { _access_token: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      contact_visibility: "direct" | "approval_required"
      notification_type:
        | "save"
        | "reaction"
        | "contact_request"
        | "contact_approved"
        | "follow_request"
        | "follow_approved"
      pitch_category:
        | "tech"
        | "consumer"
        | "b2b"
        | "creative"
        | "social_impact"
        | "other"
      reaction_type: "fire" | "love" | "rocket" | "lightbulb"
      user_role:
        | "innovator"
        | "startup"
        | "investor"
        | "consultant"
        | "ecosystem_partner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_visibility: ["direct", "approval_required"],
      notification_type: [
        "save",
        "reaction",
        "contact_request",
        "contact_approved",
        "follow_request",
        "follow_approved",
      ],
      pitch_category: [
        "tech",
        "consumer",
        "b2b",
        "creative",
        "social_impact",
        "other",
      ],
      reaction_type: ["fire", "love", "rocket", "lightbulb"],
      user_role: [
        "innovator",
        "startup",
        "investor",
        "consultant",
        "ecosystem_partner",
      ],
    },
  },
} as const
