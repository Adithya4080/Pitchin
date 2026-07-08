import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, Twitter, Globe, Linkedin, User, FileText, Link2, MapPin, FolderOpen, Briefcase, X, Flame, Bookmark, Mail, Users, MessageCircle, Video, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLayout } from '@/components/layouts/AppLayout';
import { ProfileHeader, ReactionStatsCard, ActivePitchCard, SocialLinksCard, RoleAboutCard, IntroductionVideoSection, StartupPortfolioSection, ProfilePitchSection, TeamSection, ProfileStrengthCard, FundingSection, TractionMetricsSection, TrustPressSection, ThePitchSection } from '@/components/profile';
import type { FundingData, TractionData, TrustPressData } from '@/components/profile';
import { TeamMember } from '@/components/profile/team';
import { MobileProfilePitchSection } from '@/components/profile/pitches';
import { ProfileRightSidebar } from '@/components/profile/ProfileRightSidebar';
import { InnovatorSection, StartupSection, InvestorSection, ConsultantSection, EcosystemPartnerSection } from '@/components/profile/role-sections';
import { 
  HighlightsSection, 
  ProgramsSection, 
  SupportedStartupsSection, 
  EngagementCTASection, 
  OfferingsSection, 
  FocusAreasSection,
  OrganizationOverviewSection,
  AlumniSection,
  VoicesSection
} from '@/components/profile/ecosystem-partner';
// import type { EcosystemPartnerProfile } from '@/hooks/useRoleProfile';
import { MobileProfileView, MobileEditProfile } from '@/components/mobile';
import { PitchCard } from '@/components/PitchCard';
import { ProfileSkeleton } from '@/components/skeletons';
import { ContentTransition } from '@/components/transitions';
import { useAuth } from '@/hooks/useAuth';
import { useUserReactionStats } from '@/hooks/useUserReactionStats';
import { useFollowers, useFollowing } from '@/hooks/useFollow';
import { InnovatorProfile, StartupProfile, InvestorProfile, ConsultantProfile, EcosystemPartnerProfile as EcosystemPartnerProfileType } from '@/api/profiles';
import { useRoleProfile } from '@/hooks/useRoleProfile';
import { useProfilePitches, useCreateProfilePitch, useUpdateProfilePitch, useDeleteProfilePitch } from '@/hooks/useProfilePitches';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PaywallGate } from '@/components/PaywallGate';
import { ShareDashboardButton } from '@/components/ShareDashboardButton';

// Wrapper component for ProfilePitchSection with hooks
function ProfilePitchSectionWrapper({ 
  userId, 
  isOwner, 
  roleLabel,
  isMobile = false 
}: { 
  userId?: string; 
  isOwner: boolean; 
  roleLabel: string;
  isMobile?: boolean;
}) {
  const { data: pitches = [] } = useProfilePitches(userId);
  const createPitch = useCreateProfilePitch();
  const updatePitch = useUpdateProfilePitch();
  const deletePitch = useDeleteProfilePitch();

  // Use mobile-specific component for mobile view
  if (isMobile) {
    return (
      <MobileProfilePitchSection
        pitches={pitches}
        isEditable={isOwner}
        role={roleLabel === 'Product' ? 'startup' : 'innovator'}
        onCreatePitch={(data) => createPitch.mutate({
          title: data.title,
          description: data.description,
          image_url: data.imageUrl,
          status: data.status,
        })}
        onUpdatePitch={(id, data) => updatePitch.mutate({
          id,
          title: data.title,
          description: data.description,
          image_url: data.imageUrl,
          status: data.status,
        })}
        onDeletePitch={(id) => deletePitch.mutate(id)}
        isCreating={createPitch.isPending}
        isUpdating={updatePitch.isPending}
      />
    );
  }

  return (
    <ProfilePitchSection
      pitches={pitches}
      isOwner={isOwner}
      isMobile={isMobile}
      roleLabel={roleLabel}
      onCreatePitch={(pitch) => createPitch.mutate({
        title: pitch.title,
        description: pitch.description,
        image_url: pitch.image_url,
        status: pitch.status,
      })}
      onEditPitch={(id, updates) => updatePitch.mutate({ id, ...updates })}
      onDeletePitch={(id) => deletePitch.mutate(id)}
    />
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isOnboarded, isOnboardingChecked } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Redirect to onboarding if user is logged in but not onboarded
  useEffect(() => {
    if (user && isOnboardingChecked && isOnboarded === false) {
      navigate('/onboarding');
    }
  }, [user, isOnboarded, isOnboardingChecked, navigate]);

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  // Role profile state
  const { role: hookRole, roleProfile, saveRoleProfile } = useRoleProfile(user?.id);
  // Fall back to user.role from auth context so sections show immediately on load
  const role = hookRole || (user as any)?.role || null;
  const [roleProfileData, setRoleProfileData] = useState<any>(null);

  // Derived: whether the Company Portfolio section has any content
  const hasPortfolioContent = !!(
    roleProfileData?.company_snapshot ||
    roleProfileData?.market_type ||
    roleProfileData?.founded_year ||
    roleProfileData?.operating_status ||
    roleProfileData?.company_background ||
    roleProfileData?.vision_direction ||
    roleProfileData?.current_focus ||
    (roleProfileData?.progress_highlights && (roleProfileData.progress_highlights as any[]).length > 0) ||
    (roleProfileData?.ecosystem_support && (roleProfileData.ecosystem_support as any[]).length > 0) ||
    (roleProfileData?.company_journey_timeline && (roleProfileData.company_journey_timeline as any[]).length > 0)
  );

  // Update role profile data when loaded - ensure team_members is always an array
  useEffect(() => {
    if (roleProfile) {
      const profileWithTeam = roleProfile as any;
      setRoleProfileData({
        ...roleProfile,
        // Ensure team_members is always an array for innovator/startup
        team_members: Array.isArray(profileWithTeam?.team_members) ? profileWithTeam.team_members : [],
      });
    }
  }, [roleProfile]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const data = await (await import('@/api/profiles')).getMyProfile();
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch all user pitches (not just active)
  const { data: userPitches, isLoading: pitchLoading } = useQuery({
    queryKey: ['my-pitches', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { getMyPosts } = await import('@/api/feed');
      const posts = await getMyPosts();
      const profileData = await (await import('@/api/profiles')).getMyProfile();
      return posts.map(post => ({
        ...post,
        profiles: { full_name: String((profileData as any).bio ? profileData.user_name : post.author_name), avatar_url: profileData.avatar_url },
        is_active: true,
        expires_at: new Date(Date.now() + 86400000 * 30).toISOString(),
        reaction_count: post.like_count,
        save_count: 0,
      }));
    },
    enabled: !!user?.id,
  });

  // Get the active pitch from the list
  const activePitch = userPitches?.find(p => p.is_active && new Date(p.expires_at) > new Date());

  // Fetch saved pitches
  const { data: savedPitches, isLoading: savedLoading } = useQuery({
    queryKey: ['my-saved-pitches', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      // Saved pitches not yet supported by backend — return empty list
      return [];
    },
    enabled: !!user?.id,
  });

  const { data: reactionStats } = useUserReactionStats(user?.id);
  
  // Fetch followers and following
  const { data: followers = [] } = useFollowers(user?.id);
  const { data: following = [] } = useFollowing(user?.id);

  const { data: userStats } = useQuery({
    queryKey: ['profile-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { getMyPosts } = await import('@/api/feed');
      const pitches = await getMyPosts();
      const totalReactions = pitches.reduce((sum, p) => sum + (p.like_count || 0), 0);
      return { totalReactions, totalSaves: 0, pitchCount: pitches.length, total: 0 };
    },
    enabled: !!user?.id,
  });

  const handleDeletePitch = async () => {
    if (!activePitch?.id) return;
    
    setIsDeleting(true);
    try {
      const { deletePost } = await import('@/api/feed');
      await deletePost(Number(activePitch.id));
      queryClient.invalidateQueries({ queryKey: ['my-pitches'] });
      queryClient.invalidateQueries({ queryKey: ['pitches'] });
      toast.success('Pitch removed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove pitch');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setFullName((profile as any).user_name || profile.full_name || '');
      setBio((profile as any).bio || '');
      setLocation((profile as any).location || '');
      setContactEmail((profile as any).contact_email || '');
      setLinkedinUrl((profile as any).linkedin || profile.linkedin_url || '');
      setTwitterUrl((profile as any).twitter || (profile as any).twitter_url || '');
      setWebsiteUrl((profile as any).website || (profile as any).website_url || '');
      setPortfolioUrl((profile as any).portfolio_url || '');
      setAvatarPreview((profile as any).avatar || null);
      setBannerPreview((profile as any).banner || null);
    }
  }, [profile]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Handle cancel - reset all fields to original values
  const handleCancel = () => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio((profile as any).bio || '');
      setLocation((profile as any).location || '');
      setContactEmail((profile as any).contact_email || '');
      setPortfolioUrl((profile as any).portfolio_url || '');
      setLinkedinUrl((profile as any).linkedin || profile.linkedin_url || '');
      setTwitterUrl((profile as any).twitter || (profile as any).twitter_url || '');
      setWebsiteUrl((profile as any).website || (profile as any).website_url || '');
      setAvatarPreview((profile as any).avatar || null);
      setBannerPreview((profile as any).banner || null);
    }
    if (roleProfile) {
      setRoleProfileData(roleProfile);
    }
    setAvatarFile(null);
    setBannerFile(null);
    setIsEditing(false);
  };

  const handleAvatarSelect = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleBannerSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Banner image must be less than 5MB');
      return;
    }
    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerRemove = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };
  
  // Fields owned by the shared BaseProfile (name/bio/location/socials/media).
  // These are saved by the first updateMyProfile() call below. They must be
  // stripped out of roleProfileData before the second call, otherwise the
  // second PATCH re-sends the *stale* values captured when roleProfileData
  // was first loaded (before this edit session), silently overwriting the
  // changes the first call just saved.
  const BASE_PROFILE_FIELDS = [
    'user_name', 'full_name', 'bio', 'location', 'linkedin', 'linkedin_url',
    'twitter', 'twitter_url', 'website', 'website_url', 'avatar', 'avatar_url',
    'banner', 'banner_url', 'id', 'user_email', 'user_id', 'created_at',
    'updated_at', 'is_profile_complete', 'profile_strength', 'role',
    'subscription_tier', 'subscription_expires_at', 'is_pro',
  ];

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const { updateMyProfile } = await import('@/api/profiles');
      await updateMyProfile({
        user_name: fullName || undefined,
        bio: bio || '',
        location: location || '',
        linkedin: linkedinUrl || '',
        twitter: twitterUrl || '',
        website: websiteUrl || '',
        avatarFile: avatarFile ?? undefined,
        bannerFile: bannerFile ?? undefined,
        ...(!avatarFile && avatarPreview === null ? { avatar: null } : {}),
        ...(!bannerFile && bannerPreview === null ? { banner: null } : {}),
      } as any);

      // Save role-specific profile if data exists.
      // Strip shared base-profile fields first (see comment above) so this
      // call can't clobber what the first call just saved.
      if (roleProfileData && role) {
        const roleOnlyData = { ...roleProfileData } as Record<string, any>;
        for (const field of BASE_PROFILE_FIELDS) {
          delete roleOnlyData[field];
        }
        await saveRoleProfile.mutateAsync(roleOnlyData as any);
      }

      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      toast.success('Profile updated successfully!');
      setAvatarFile(null);
      setBannerFile(null);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  const getRoleTabLabel = () => {
    switch (role) {
      case 'innovator': return 'Skills & Portfolio';
      case 'startup': return 'Company Details';
      case 'investor': return 'Investment Info';
      case 'consultant': return 'Expertise';
      default: return 'Role Details';
    }
  };

  // Render role-specific section
  const renderRoleSection = (editable: boolean, forMobile: boolean = false) => {
    switch (role) {
      case 'innovator':
        return (
          <InnovatorSection
            profile={roleProfileData as Partial<InnovatorProfile>}
            isEditable={editable}
            onChange={setRoleProfileData}
            isMobile={forMobile}
          />
        );
      case 'startup':
        return (
          <StartupSection
            profile={roleProfileData as Partial<StartupProfile>}
            isEditable={editable}
            onChange={setRoleProfileData}
            isMobile={forMobile}
          />
        );
      case 'investor':
        return (
          <InvestorSection
            profile={roleProfileData as Partial<InvestorProfile>}
            isEditable={editable}
            onChange={setRoleProfileData}
            isMobile={forMobile}
          />
        );
      case 'consultant':
        return (
          <ConsultantSection
            profile={roleProfileData as Partial<ConsultantProfile>}
            isEditable={editable}
            onChange={setRoleProfileData}
            isMobile={forMobile}
          />
        );
      case 'ecosystem_partner':
        return (
          <EcosystemPartnerSection
            profile={roleProfileData as Partial<EcosystemPartnerProfileType>}
            isEditable={editable}
            onChange={setRoleProfileData}
            isMobile={forMobile}
          />
        );
      default:
        return null;
    }
  };

  // Render ecosystem partner specific sections (for both desktop and mobile)
  const renderEcosystemPartnerSections = (forMobile: boolean = false, isOwner: boolean = true) => {
    if (role !== 'ecosystem_partner' || !roleProfileData) return null;
    const epProfile = roleProfileData as EcosystemPartnerProfileType;
    
    return (
      <>
        {/* 1. Programs & Initiatives - concrete offerings first */}
        <ProgramsSection 
          programs={epProfile.programs || []} 
          isMobile={forMobile}
          isOwner={isOwner}
        />
        {/* 2. Organization Overview - institutional context */}
        <OrganizationOverviewSection
          data={{
            founded_year: epProfile.founded_year,
            headquarters: epProfile.headquarters,
            organization_type: epProfile.organization_type,
            geographic_focus: epProfile.geographic_focus || [],
            mission_statement: epProfile.mission_statement,
            focus_areas: epProfile.focus_areas || [],
            sectors: epProfile.sectors || [],
            engagement_type: epProfile.engagement_type,
            program_duration: epProfile.program_duration,
            equity_model: epProfile.equity_model,
            partnerships: epProfile.partnerships as any || [],
            startups_supported_count: epProfile.startups_supported_count,
            years_active: epProfile.years_active,
            global_alumni_reach: epProfile.global_alumni_reach,
          }}
          isEditable={isOwner}
          isMobile={forMobile}
        />
        {/* 6. Startups & Alumni - track record */}
        <AlumniSection
          alumni={epProfile.alumni_startups || []}
          isMobile={forMobile}
          isOwner={isOwner}
        />
        <SupportedStartupsSection
          startups={epProfile.supported_startups || []} 
          isMobile={forMobile}
          isOwner={isOwner}
        />
        {/* 7. Voices - leadership perspectives */}
        <VoicesSection
          voices={epProfile.leadership_voices || []}
          isMobile={forMobile}
          isOwner={isOwner}
        />
        {/* 8. Engagement CTA - call to action last */}
        <EngagementCTASection
          partnerId={String(user?.id) || ''}
          engagementDescription={epProfile.engagement_description}
          isMobile={forMobile}
          isOwnProfile={isOwner}
        />
      </>
    );
  };

  if (authLoading || profileLoading || pitchLoading) {
    return (
      <AppLayout showBottomNav={!isMobile}>
        <ProfileSkeleton isMobile={isMobile} />
      </AppLayout>
    );
  }

  // Mobile Profile View
  if (isMobile && !isEditing) {
    return (
      <AppLayout showBottomNav={true}>
        <MobileProfileView
          fullName={user?.full_name || 'Your Name'}
          email={user?.email}
          avatarUrl={avatarPreview}
          bannerUrl={bannerPreview}
          location={location}
          bio={bio}
          role={role}
          userId={String(user?.id)}
          stats={{
            pitchCount: userStats?.pitchCount || 0,
            totalReactions: reactionStats?.total_reactions || 0,
            totalSaves: userStats?.totalSaves || 0,
            followersCount: followers.length,
            followingCount: following.length,
            profileViews: (profile as any)?.profile_views || 0,
          }}
          socialLinks={{
            linkedin: linkedinUrl,
            twitter: twitterUrl,
            website: websiteUrl,
            portfolio: portfolioUrl,
            contactEmail: contactEmail,
          }}
          introVideo={(role === 'innovator' || role === 'startup') ? {
            url: roleProfileData?.intro_video_url,
            title: roleProfileData?.intro_video_title,
            description: roleProfileData?.intro_video_description,
            thumbnailUrl: roleProfileData?.intro_video_thumbnail_url,
          } : undefined}
          shareSection={(role === 'innovator' || role === 'startup') ? <ShareDashboardButton /> : undefined}
          roleSection={role !== 'ecosystem_partner' ? renderRoleSection(false, true) : undefined}
          portfolioSection={(role === 'startup' || role === 'innovator') ? (
            <StartupPortfolioSection
              profile={roleProfileData as Partial<StartupProfile>}
              isEditable={false}
              isOwner={true}
              onChange={setRoleProfileData}
              isMobile={true}
            />
          ) : undefined}
          teamSection={(role === 'innovator' || role === 'startup') ? (
            <TeamSection
              members={(roleProfileData?.team_members || []) as TeamMember[]}
              isEditable={false}
              onChange={(members) => setRoleProfileData((prev: any) => ({ ...prev, team_members: members }))}
              isMobile={true}
              isOwner={true}
            />
          ) : undefined}
          pitchSection={(role === 'innovator' || role === 'startup') ? (
            <ThePitchSection
              data={{
                problem: (roleProfileData as any)?.problem_statement || '',
                solution: (roleProfileData as any)?.solution || '',
                why_now: (roleProfileData as any)?.why_now || '',
                why_us: (roleProfileData as any)?.why_us || '',
              }}
              isOwner={true}
              isMobile={true}
            />
          ) : undefined}
          profileStrengthSection={
            <ProfileStrengthCard
              bio={bio}
              hasIntroVideo={!!roleProfileData?.intro_video_url}
              hasFunding={!!(roleProfileData as any)?.funding_data?.stage || !!(roleProfileData as any)?.funding_data?.amount_raised}
              hasTraction={!!(roleProfileData as any)?.traction_data?.metrics?.length}
              hasTrustPress={!!(roleProfileData as any)?.trust_press_data?.proofs?.length}
              hasTeam={!!((roleProfileData?.team_members as any[])?.length)}
              hasCompanyPortfolio={!!((roleProfileData as any)?.ecosystem_support?.length)}
              hasPitch={!!(userPitches && userPitches.length > 0)}
            />
          }
          fundingSection={
            <FundingSection
              funding={(roleProfileData as any)?.funding_data || null}
              isOwner={true}
              isMobile={true}
            />
          }
          tractionSection={
            <TractionMetricsSection
              traction={(roleProfileData as any)?.traction_data || null}
              isOwner={true}
              isMobile={true}
            />
          }
          trustPressSection={
            <TrustPressSection
              trustPress={(roleProfileData as any)?.trust_press_data || null}
              isOwner={true}
              isMobile={true}
            />
          }
          ecosystemPartnerSections={role === 'ecosystem_partner' ? renderEcosystemPartnerSections(true, true) : undefined}
          pitchFeed={
            userPitches && userPitches.length > 0 ? (
              <div className="space-y-4">
                {userPitches.map((pitch) => (
                  <PitchCard key={pitch.id} pitch={pitch} hideBorder={isMobile} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No pitches yet
              </p>
            )
          }
          onEditClick={() => setIsEditing(true)}
        />
      </AppLayout>
    );
  }

  // Mobile Edit Profile View
  if (isMobile && isEditing) {
    return (
      <MobileEditProfile
        fullName={fullName}
        setFullName={setFullName}
        bio={bio}
        setBio={setBio}
        location={location}
        setLocation={setLocation}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        linkedinUrl={linkedinUrl}
        setLinkedinUrl={setLinkedinUrl}
        twitterUrl={twitterUrl}
        setTwitterUrl={setTwitterUrl}
        websiteUrl={websiteUrl}
        setWebsiteUrl={setWebsiteUrl}
        portfolioUrl={portfolioUrl}
        setPortfolioUrl={setPortfolioUrl}
        avatarPreview={avatarPreview}
        bannerPreview={bannerPreview}
        onAvatarSelect={handleAvatarSelect}
        onBannerSelect={handleBannerSelect}
        roleSection={renderRoleSection(true)}
        roleTabLabel={getRoleTabLabel()}
        isSaving={isSaving}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <AppLayout showBottomNav={true}>
      <div className="container py-4 md:py-6">
        <div className="flex gap-6 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-3">
            {/* <PaywallGate> */}

          {/* Edit Mode Indicator */}
          {isEditing && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-primary font-medium">
                You are editing your profile
              </span>
              <Button variant="ghost" size="sm" onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          )}

          {/* Profile Header */}
          <ProfileHeader
            userId={String(user?.id) || ''}
            fullName={user?.full_name || 'Your Name'}
            email={user?.email}
            avatarUrl={avatarPreview}
            bannerUrl={bannerPreview}
            location={location}
            bio={bio}
            stats={{
              pitchCount: userStats?.pitchCount || 0,
              totalReactions: reactionStats?.total_reactions || 0,
              totalSaves: userStats?.totalSaves || 0,
              followersCount: followers.length,
              followingCount: following.length,
              profileViews: (profile as any)?.profile_views || 0,
            }}
            isEditable={true}
            isEditing={isEditing}
            onEditClick={() => setIsEditing(true)}
            onAvatarSelect={handleAvatarSelect}
            onAvatarRemove={handleAvatarRemove}
            onBannerSelect={handleBannerSelect}
            onBannerRemove={handleBannerRemove}
          />

          {/* Role-Based About Card - shown right after header */}
          <RoleAboutCard role={role} roleProfile={roleProfileData} />


          {/* VIEW MODE: Clean profile display */}
          {!isEditing && (
            <>
              {/* Share Dashboard Button — always visible in view mode */}
              <div className="flex justify-end">
                <ShareDashboardButton />
              </div>

              <ReactionStatsCard stats={reactionStats ? {
              fire: reactionStats.fire,
              love: reactionStats.clap,
              rocket: reactionStats.bulb,
              lightbulb: reactionStats.bulb,
              total: reactionStats.total_reactions,
            } : undefined} />

              {/* Active Pitch Card */}
              {/* {activePitch && (
                <ActivePitchCard
                  pitch={activePitch}
                  isEditable={true}
                  isDeleting={isDeleting}
                  onDelete={handleDeletePitch}
                />
              )} */}

              {/* {activePitch && (
                <ActivePitchCard
                  pitch={{
                    id: String(activePitch.id),
                    pitch_statement: activePitch.content ?? activePitch.title ?? '',
                    image_url: activePitch.image ?? undefined,
                    expires_at: activePitch.expires_at,
                    reaction_count: activePitch.reaction_count,
                    save_count: activePitch.save_count,
                  }}
                  isEditable={true}
                  isDeleting={isDeleting}
                  onDelete={handleDeletePitch}
                />
              )} */}

              {/* Introduction Video Section - All roles */}
              <div className="relative">
                {roleProfileData?.intro_video_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/edit-section?section=introduction')}
                    className="absolute top-4 right-4 h-8 w-8 p-0 z-10 bg-background/80 hover:bg-background border border-border/50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <IntroductionVideoSection
                  videoUrl={roleProfileData?.intro_video_url}
                  thumbnailUrl={roleProfileData?.intro_video_thumbnail_url}
                  title={roleProfileData?.intro_video_title}
                  description={roleProfileData?.intro_video_description}
                  isOwner={true}
                  isEditable={false}
                  isMobile={false}
                  userId={String(user?.id)}
                  role={role}
                  onVideoChange={() => {}}
                />
              </div>

              {/* Links & Contact Card */}
              <SocialLinksCard
                linkedinUrl={linkedinUrl}
                twitterUrl={twitterUrl}
                websiteUrl={websiteUrl}
                portfolioUrl={portfolioUrl}
                contactEmail={contactEmail}
              />

              {/* Role Section (Skills & Portfolio) in View Mode */}
              {role && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground px-1">{getRoleTabLabel()}</h3>
                  {renderRoleSection(false)}
                </div>
              )}

              {/* Profile Strength Card - only for owner */}
              <ProfileStrengthCard
                bio={bio}
                hasIntroVideo={!!roleProfileData?.intro_video_url}
                hasFunding={!!(roleProfileData as any)?.funding_data?.stage || !!(roleProfileData as any)?.funding_data?.amount_raised}
                hasTraction={!!(roleProfileData as any)?.traction_data?.metrics?.length}
                hasTrustPress={!!(roleProfileData as any)?.trust_press_data?.proofs?.length}
                hasTeam={!!((roleProfileData?.team_members as any[])?.length)}
                hasCompanyPortfolio={!!((roleProfileData as any)?.ecosystem_support?.length)}
                hasPitch={!!(userPitches && userPitches.length > 0)}
              />

              {/* The Pitch — Problem / Solution / Why Now / Why Us narrative */}
              {(role === 'startup' || role === 'innovator') && (
                <ThePitchSection
                  data={{
                    problem: (roleProfileData as any)?.problem_statement || '',
                    solution: (roleProfileData as any)?.solution || '',
                    why_now: (roleProfileData as any)?.why_now || '',
                    why_us: (roleProfileData as any)?.why_us || '',
                  }}
                  isOwner={true}
                />
              )}

              {/* Funding Section */}
              <FundingSection
                funding={(roleProfileData as any)?.funding_data || null}
                isOwner={true}
              />

              {/* Traction & Metrics Section */}
              <TractionMetricsSection
                traction={(roleProfileData as any)?.traction_data || null}
                isOwner={true}
              />

              {/* Trust & Press Section */}
              <TrustPressSection
                trustPress={(roleProfileData as any)?.trust_press_data || null}
                isOwner={true}
              />

              {/* Company Portfolio - For Startups and Innovators */}
              {(role === 'startup' || role === 'innovator') && (
                <div className="relative">
                  {hasPortfolioContent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/edit-section?section=portfolio')}
                      className="absolute top-4 right-4 h-8 w-8 p-0 z-10 bg-background/80 hover:bg-background border border-border/50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  <StartupPortfolioSection
                    profile={roleProfileData as Partial<StartupProfile>}
                    isEditable={false}
                    isOwner={true}
                    onChange={setRoleProfileData}
                    isMobile={false}
                  />
                </div>
              )}

              {/* Team Section - All roles */}
              <div className="relative">
                {(roleProfileData?.team_members as any[])?.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/edit-section?section=team')}
                    className="absolute top-4 right-4 h-8 w-8 p-0 z-10 bg-background/80 hover:bg-background border border-border/50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <TeamSection
                  members={(roleProfileData?.team_members || []) as TeamMember[]}
                  isEditable={false}
                  onChange={(members) => setRoleProfileData((prev: any) => ({ ...prev, team_members: members }))}
                  isMobile={false}
                  isOwner={true}
                />
              </div>

              {/* Pitches list — desktop */}
              {(role === 'startup' || role === 'innovator') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Pitches</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Select and reposition stories from this profile
                      </p>
                    </div>
                    <Button size="sm" onClick={() => navigate('/pitches/new')} className="gap-1.5">
                      {/* <Plus className="h-4 w-4" /> */}
                      New Pitch
                    </Button>
                  </div>
                  {pitchLoading ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">Loading…</div>
                  ) : userPitches && userPitches.length > 0 ? (
                    <div className="space-y-3">
                      {userPitches.map((pitch) => (
                        <PitchCard key={pitch.id} pitch={pitch} hideBorder={false} />
                      ))}
                    </div>
                  ) : (
                    <Card className="border-2 border-dashed border-border/50">
                      <CardContent className="py-8 text-center text-sm text-muted-foreground">
                        No pitches yet. Create your first pitch!
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Ecosystem Partner Sections - always rendered for ep role */}
              {role === 'ecosystem_partner' && (
                <div className="space-y-6">
                  {renderEcosystemPartnerSections(false, true)}
                </div>
              )}

              {/* Saved & Network Tabs */}
              <Tabs defaultValue="saved" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b border-border/50 rounded-none h-auto p-0 gap-4 flex-wrap">
                  <TabsTrigger 
                    value="saved" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-2"
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Saved
                  </TabsTrigger>
                  <TabsTrigger 
                    value="followers" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-2"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Followers ({followers.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="following" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-2"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Following ({following.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="saved" className="mt-6 space-y-4">
                  {savedPitches && savedPitches.length > 0 ? (
                    savedPitches.map((pitch) => (
                      <PitchCard 
                        key={pitch.id} 
                        pitch={pitch}
                        hideBorder={isMobile}
                      />
                    ))
                  ) : (
                    <Card className="border-border/50">
                      <CardContent className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                          <Bookmark className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No saved pitches yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="followers" className="mt-6 space-y-4">
                  {followers.length > 0 ? (
                    followers.map((follow) => (
                      <Card 
                        key={follow.id} 
                        className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/profile/${follow.id}`)}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {follow.profile?.avatar_url ? (
                              <img 
                                src={follow.profile.avatar_url} 
                                alt={follow.profile.full_name || 'User'} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {follow.profile?.full_name || 'Anonymous User'}
                            </p>
                            <p className="text-sm text-muted-foreground">Follower</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-border/50">
                      <CardContent className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No followers yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="following" className="mt-6 space-y-4">
                  {following.length > 0 ? (
                    following.map((follow) => (
                      <Card 
                        key={follow.id} 
                        className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/profile/${follow.id}`)}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {follow.profile?.avatar_url ? (
                              <img 
                                src={follow.profile.avatar_url} 
                                alt={follow.profile.full_name || 'User'} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {follow.profile?.full_name || 'Anonymous User'}
                            </p>
                            <p className="text-sm text-muted-foreground">Following</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-border/50">
                      <CardContent className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">Not following anyone yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}

          {/* EDIT MODE: Form with tabs */}
          {isEditing && (
            <>

              {/* Edit Tabs */}
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b border-border/50 rounded-none h-auto p-0 gap-4 overflow-x-auto">
                  <TabsTrigger 
                    value="profile" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-2 shrink-0"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="social" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-2 shrink-0"
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Social Links
                  </TabsTrigger>
                  {role && (
                    <TabsTrigger 
                      value="role" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-2 shrink-0"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      {getRoleTabLabel()}
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="profile" className="mt-6 space-y-4">
                  <Card className="border-border/50">
                    <CardContent className="p-5 space-y-4">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Basic Information
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Your name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          maxLength={100}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">About</Label>
                        <Textarea
                          id="bio"
                          placeholder="A short bio about yourself..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          maxLength={280}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          {bio.length}/280
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          placeholder="City, Country"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          maxLength={100}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="social" className="mt-6 space-y-4">
                  <Card className="border-border/50">
                    <CardContent className="p-5 space-y-4">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Contact
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          Contact Email (optional)
                        </Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="contact@example.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          This email will be visible on your public profile for contact purposes.
                        </p>
                      </div>

                      <Separator />

                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        Social Links
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          placeholder="https://linkedin.com/in/username"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-muted-foreground" />
                          Twitter / X
                        </Label>
                        <Input
                          id="twitter"
                          placeholder="https://twitter.com/username"
                          value={twitterUrl}
                          onChange={(e) => setTwitterUrl(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          placeholder="https://yourwebsite.com"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="portfolio" className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4 text-primary" />
                          Portfolio
                        </Label>
                        <Input
                          id="portfolio"
                          placeholder="https://yourportfolio.com"
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {role && (
                  <TabsContent value="role" className="mt-6 space-y-4">
                    {renderRoleSection(true)}
                  </TabsContent>
                )}

              </Tabs>

              {/* Save / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Discard Changes
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flash-gradient text-primary-foreground min-w-32"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
          {/* </PaywallGate> */}
          </div>

          {/* Right Sidebar - Desktop only */}
          <div className="hidden lg:block">
            <ProfileRightSidebar />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}