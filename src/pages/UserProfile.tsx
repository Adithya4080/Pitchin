import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft, Flame, Bookmark, AlertCircle, MessageCircle, FolderOpen, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLayout } from '@/components/layouts/AppLayout';
import { PitchCard } from '@/components/PitchCard';
import { ProfileHeader, ReactionStatsCard, SocialLinksCard, RoleAboutCard, RestrictedProfilePreview, IntroductionVideoSection, PortfolioSection, StartupPortfolioSection, ProfilePitchSection, TeamSection } from '@/components/profile';
import { TeamMember } from '@/components/profile/team';
import { MobileProfilePitchSection } from '@/components/profile/pitches';
import { ProfileRightSidebar } from '@/components/profile/ProfileRightSidebar';
import { InnovatorSection, StartupSection, InvestorSection, ConsultantSection, EcosystemPartnerSection } from '@/components/profile/role-sections';
import { MobileProfileView, MobileRestrictedProfile } from '@/components/mobile';
import { ProfileSkeleton } from '@/components/skeletons';
import { ContentTransition } from '@/components/transitions';
import { useAuth } from '@/hooks/useAuth';
import { useMutualFollowAccess, useFollowStatus, useReverseFollowStatus } from '@/hooks/useFollow';
import { useFollowers, useFollowing } from '@/hooks/useFollow';
import { useUserReactionStats } from '@/hooks/useUserReactionStats';
import { useRoleProfile } from '@/hooks/useRoleProfile';
import { InnovatorProfile, StartupProfile, InvestorProfile, ConsultantProfile, EcosystemPartnerProfile } from '@/api/profiles'
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
import { useProfilePitches } from '@/hooks/useProfilePitches';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isValidUuid } from '@/lib/validation';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  
  // Validate userId parameter
  const validUserId = !!userId && userId !== 'undefined';

  // Redirect owner to dashboard (Owner Profile view)
  useEffect(() => {
    if (!authLoading && user && userId === String(user.id)) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, userId, authLoading, navigate]);

  // Invalidate follow-related queries when viewing a profile to ensure fresh data
  useEffect(() => {
    if (userId && user && userId !== String(user.id)) {
      queryClient.invalidateQueries({ queryKey: ['mutual-follow-access', user.id, userId] });
      queryClient.invalidateQueries({ queryKey: ['follow-status', userId] });
      queryClient.invalidateQueries({ queryKey: ['reverse-follow-status', userId] });
    }
  }, [userId, user, queryClient]);

  // Check if current user has mutual follow access (both users follow each other)
  const { data: hasMutualAccess, isLoading: accessLoading } = useMutualFollowAccess(userId);
  
  // Also get individual follow statuses for better UX
  const { data: myFollowStatus } = useFollowStatus(userId);
  const { data: theirFollowStatus } = useReverseFollowStatus(userId);

  // Fetch reaction stats for this user
  const { data: reactionStats, isLoading: statsLoading } = useUserReactionStats(userId);

  // Fetch followers and following counts
  const { data: followers = [] } = useFollowers(userId);
  const { data: following = [] } = useFollowing(userId);

  // Fetch role profile for this user
  const { role, roleProfile, isLoading: roleLoading } = useRoleProfile(userId);

  // Fetch profile pitches for this user
  const { data: profilePitches = [] } = useProfilePitches(userId);

  // Fetch the profile - only if valid UUID
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { getUserProfile } = await import('@/api/profiles');
      const result = await getUserProfile(userId);
      return result ?? null;
    },
    enabled: !!validUserId && userId !== String(user?.id),
  });

  const { data: userPitches, isLoading: pitchesLoading } = useQuery({
    queryKey: ['user-pitches', userId],
    queryFn: async (): Promise<any[]> => {
      if (!userId) return [];
      const { getFeed } = await import('@/api/feed');
      const posts = await getFeed();
      return posts.filter((p: any) => String(p.author) === String(userId));
    },
    enabled: !!validUserId && userId !== String(user?.id),
  });

  // ADD THIS RIGHT HERE
  const userStats = useMemo(() => {
    if (!userPitches) return null;
    const totalReactions = userPitches.reduce((sum: number, p: any) => sum + (p.like_count || 0), 0);
    return { totalReactions, totalSaves: 0, pitchCount: userPitches.length };
  }, [userPitches]);

  // Fetch user pitches - only if valid UUID
  // const { data: userPitches, isLoading: pitchesLoading } = useQuery({
  //   queryKey: ['user-pitches', userId],
  //   queryFn: async () => {
  //     if (!userId) return [];
      
  //     const { getUserProfile } = await import('@/api/profiles');
  //     const profile = await getUserProfile(userId!);
  //     return profile;
  //   },
  //   enabled: !!validUserId && userId !==  String(user?.id),
  // });

  // Fetch user stats - only if valid UUID
// const { data: userStats } = useQuery({
//   queryKey: ['profile-stats', userId],
//   queryFn: async () => {
//     if (!userId) return null;
//     const { getFeed } = await import('@/api/feed');
//     const posts = await getFeed();
//     const pitches = posts.filter(p => String(p.author) === String(userId));
//     const totalReactions = pitches.reduce((sum, p) => sum + (p.like_count || 0), 0);
//     return { totalReactions, totalSaves: 0, pitchCount: pitches.length };
//   },
//   enabled: !!validUserId && userId !== String(user?.id),
// });


  // Render role-specific section (view-only)
  const renderRoleSection = (forMobile: boolean = false) => {
    if (!role || !roleProfile) return null;

   switch (role) {
      case 'innovator':
        return (
          <InnovatorSection
            profile={roleProfile as Partial<InnovatorProfile>}
            isEditable={false}
            isMobile={forMobile}
          />
        );
      case 'startup':
        return (
          <StartupSection
            profile={roleProfile as Partial<StartupProfile>}
            isEditable={false}
            isMobile={forMobile}
          />
        );
      case 'investor':
        return (
          <InvestorSection
            profile={roleProfile as Partial<InvestorProfile>}
            isEditable={false}
            isMobile={forMobile}
          />
        );
      case 'consultant':
        return (
          <ConsultantSection
            profile={roleProfile as Partial<ConsultantProfile>}
            isEditable={false}
            isMobile={forMobile}
          />
        );
      case 'ecosystem_partner':
        return (
          <EcosystemPartnerSection
            profile={roleProfile as Partial<EcosystemPartnerProfile>}
            isEditable={false}
            isMobile={forMobile}
          />
        );
      default:
        return null;
    }
  };

  // Render ecosystem partner specific sections
  const renderEcosystemPartnerSections = (forMobile: boolean = false) => {
    if (role !== 'ecosystem_partner' || !roleProfile) return null;
    const epProfile = roleProfile as EcosystemPartnerProfile;
    
    return (
      <>
        {/* 1. Programs & Initiatives */}
        <ProgramsSection 
          programs={epProfile.programs || []} 
          isMobile={forMobile} 
        />
        {/* 2. Organization Overview */}
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
          isEditable={false}
          isMobile={forMobile}
        />
        {/* 6. Startups & Alumni */}
        <AlumniSection
          alumni={epProfile.alumni_startups || []}
          isMobile={forMobile}
        />
        <SupportedStartupsSection 
          startups={epProfile.supported_startups || []} 
          isMobile={forMobile} 
        />
        {/* 7. Voices */}
        <VoicesSection
          voices={epProfile.leadership_voices || []}
          isMobile={forMobile}
          isOwner={false}
        />
        {/* 8. Engagement CTA */}
        <EngagementCTASection
          partnerId={userId || ''}
          engagementDescription={epProfile.engagement_description}
          isMobile={forMobile}
          isOwnProfile={false}
        />
      </>
    );
  };
  if (!authLoading && user && userId === String(user.id)) {
    return (
      <AppLayout showBottomNav={!isMobile}>
        <ProfileSkeleton isMobile={isMobile} />
      </AppLayout>
    );
  }

  const isLoading = authLoading || accessLoading || profileLoading || statsLoading || pitchesLoading || roleLoading;

  if (isLoading) {
    return (
      <AppLayout showBottomNav={!isMobile}>
        <ProfileSkeleton isMobile={isMobile} />
      </AppLayout>
    );
  }

  // If invalid userId, show error
  if (!validUserId) {
    return (
      <AppLayout showBottomNav={true}>
        <div className="container py-4 md:py-8">
          <div className="max-w-md mx-auto text-center">
            <Card className="border-border/50">
              <CardContent className="py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="font-display text-xl font-bold mb-2">Invalid Profile</h2>
                <p className="text-muted-foreground mb-6">
                  The profile you're looking for doesn't exist.
                </p>
                <Button variant="outline" onClick={() => navigate('/feed')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Feed
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  // If no mutual follow access, show restricted preview
  if (!hasMutualAccess) {
    // Mobile restricted view
    if (isMobile) {
      return (
        <AppLayout showBottomNav={true}>
          <MobileRestrictedProfile
            userId={userId || ''}
            fullName={profile?.user_name || 'Anonymous User'}
            avatarUrl={profile?.avatar_url || null}
            bannerUrl={(profile as any)?.banner_url || null}
            bio={profile?.bio}
            location={(profile as any)?.location}
            role={role}
            followersCount={followers.length}
            followingCount={following.length}
            pitchCount={userStats?.pitchCount || 0}
            totalReactions={userStats?.totalReactions || 0}
            totalSaves={userStats?.totalSaves || 0}
          />
        </AppLayout>
      );
    }

    // Desktop restricted view
    return (
      <AppLayout showBottomNav={true}>
        <div className="container py-4 md:py-8">
          <div className="max-w-lg mx-auto space-y-4">

            <RestrictedProfilePreview
              userId={userId || ''}
              fullName={profile?.user_name || 'Anonymous Userrr'}
              avatarUrl={profile?.avatar_url || null}
              bannerUrl={(profile as any)?.banner_url || null}
              bio={profile?.bio}
              location={(profile as any)?.location}
              role={role}
              followersCount={followers.length}
              followingCount={following.length}
              pitchCount={userStats?.pitchCount || 0}
              totalReactions={reactionStats?.total_reactions || 0}
              totalSaves={userStats?.totalSaves || 0}
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  // Mobile Profile View for other users
  if (isMobile) {
    return (
      <AppLayout showBottomNav={true}>
        <MobileProfileView
          userId={userId}
          fullName={profile?.full_name || 'Anonymous User'}
          avatarUrl={profile?.avatar_url || null}
          bannerUrl={(profile as any)?.banner_url || null}
          location={(profile as any)?.location}
          bio={profile?.bio}
          role={role}
          stats={{
            pitchCount: userStats?.pitchCount || 0,
            totalReactions: userStats?.totalReactions || 0,
            totalSaves: userStats?.totalSaves || 0,
            followersCount: followers.length,
            followingCount: following.length,
            profileViews: (profile as any)?.profile_views || 0,
          }}
          socialLinks={{
            linkedin: profile?.linkedin_url,
            twitter: (profile as any)?.twitter_url,
            website: (profile as any)?.website_url,
            portfolio: (profile as any)?.portfolio_url,
            contactEmail: (profile as any)?.contact_email,
          }}
          introVideo={(role === 'innovator' || role === 'startup') ? {
            url: (roleProfile as any)?.intro_video_url,
            title: (roleProfile as any)?.intro_video_title,
            description: (roleProfile as any)?.intro_video_description,
            thumbnailUrl: (roleProfile as any)?.intro_video_thumbnail_url,
          } : undefined}
          roleSection={role !== 'ecosystem_partner' ? renderRoleSection(true) : undefined}
          portfolioSection={role === 'innovator' ? (
            <PortfolioSection
              profile={roleProfile as Partial<InnovatorProfile>}
              isEditable={false}
              isMobile={true}
            />
          ) : role === 'startup' ? (
            <StartupPortfolioSection
              profile={roleProfile as Partial<StartupProfile>}
              isEditable={false}
              isMobile={true}
            />
          ) : undefined}
          teamSection={(role === 'innovator' || role === 'startup') ? (
            <TeamSection
              members={((roleProfile as any)?.team_members || []) as TeamMember[]}
              isEditable={false}
              isMobile={true}
            />
          ) : undefined}
          pitchSection={(role === 'innovator' || role === 'startup') ? (
            <MobileProfilePitchSection
              pitches={profilePitches}
              isEditable={false}
              role={role}
            />
          ) : undefined}
          ecosystemPartnerSections={role === 'ecosystem_partner' ? renderEcosystemPartnerSections(true) : undefined}
          pitchFeed={
            userPitches && userPitches.length > 0 ? (
              <div className="space-y-4">
                {userPitches.map((pitch) => (
                  <PitchCard key={pitch.id} pitch={pitch} hideBorder={isMobile} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active pitches yet
              </p>
            )
          }
          isOwnProfile={false}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={true}>
      <div className="container py-4 md:py-6">
        <div className="flex gap-6 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-6">

          {/* Profile Header - Read-only for public view */}
          <ProfileHeader
            userId={userId || ''}
            fullName={profile?.full_name || 'Anonymous User'}
            avatarUrl={profile?.avatar_url || null}
            bannerUrl={(profile as any)?.banner_url || null}
            location={(profile as any)?.location}
            bio={profile?.bio}
            stats={{
              pitchCount: userStats?.pitchCount || 0,
              totalReactions: reactionStats?.total_reactions || 0,
              totalSaves: userStats?.totalSaves || 0,
              followersCount: followers.length,
              followingCount: following.length,
              profileViews: (profile as any)?.profile_views || 0,
            }}
            isEditable={false}
          />

          {/* Role-Based About Card - shown right after header */}
          <RoleAboutCard role={role} roleProfile={roleProfile} />

          {/* Introduction Video Section - Only for innovator/startup */}
          {(role === 'innovator' || role === 'startup') && (
            <IntroductionVideoSection
              videoUrl={(roleProfile as any)?.intro_video_url}
              thumbnailUrl={(roleProfile as any)?.intro_video_thumbnail_url}
              title={(roleProfile as any)?.intro_video_title}
              description={(roleProfile as any)?.intro_video_description}
              isOwner={false}
              isEditable={false}
              isMobile={false}
              role={role}
            />
          )}

          {/* Introduction Section */}
          <Card className="border-border/50">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                Introduction
              </h3>
              <p className="text-sm text-muted-foreground">
                No introduction added yet.
              </p>
            </CardContent>
          </Card>

          {/* Links & Contact Card */}
          <SocialLinksCard
            linkedinUrl={profile?.linkedin_url}
            twitterUrl={(profile as any)?.twitter_url}
            websiteUrl={(profile as any)?.website_url}
            portfolioUrl={(profile as any)?.portfolio_url}
            contactEmail={(profile as any)?.contact_email}
          />

          {/* Role-Specific Section - skip for ecosystem_partner (handled below) */}
          {role !== 'ecosystem_partner' && renderRoleSection()}

          {/* Ecosystem Partner Sections */}
          {role === 'ecosystem_partner' && renderEcosystemPartnerSections()}

          {/* Portfolio Section - For Innovators and Startups */}
          {role === 'innovator' && (
            <PortfolioSection
              profile={roleProfile as Partial<InnovatorProfile>}
              isEditable={false}
              isMobile={false}
            />
          )}
          {role === 'startup' && (
            <StartupPortfolioSection
              profile={roleProfile as Partial<StartupProfile>}
              isEditable={false}
              isMobile={false}
            />
          )}

          {/* Pitches/Product Section - Only for Innovators/Startups */}
          {(role === 'innovator' || role === 'startup') && (
            <ProfilePitchSection
              pitches={profilePitches}
              isOwner={false}
              isMobile={false}
              roleLabel={role === 'startup' ? 'Product' : 'Pitches'}
            />
          )}

          {/* Team Section - Only for Innovators/Startups */}
          {(role === 'innovator' || role === 'startup') && (
            <TeamSection
              members={((roleProfile as any)?.team_members || []) as TeamMember[]}
              isEditable={false}
              isMobile={false}
            />
          )}

          {/* Post Section */}
          <Card className="border-border/50">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                Post
              </h3>
              {userPitches && userPitches.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {userPitches.map((pitch) => (
                    <PitchCard 
                      key={pitch.id} 
                      pitch={pitch}
                      hideBorder={isMobile}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No posts yet.
                </p>
              )}
            </CardContent>
          </Card>
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
