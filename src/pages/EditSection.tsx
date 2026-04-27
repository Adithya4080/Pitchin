import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRoleProfile } from '@/hooks/useRoleProfile';
import { InnovatorProfile, StartupProfile, EcosystemPartnerProfile } from '@/api/profiles';
import { useIsMobile } from '@/hooks/use-mobile';
import { IntroductionVideoSection, PortfolioSection, StartupPortfolioSection, TeamSection } from '@/components/profile';
import { TeamMember } from '@/components/profile/team';
import { ProgramsEditSection, OrganizationOverviewEditSection, AlumniEditSection, HighlightsEditSection, VoicesEditSection, SupportedStartupsEditSection, FocusAreasEditSection, OfferingsEditSection } from '@/components/profile/ecosystem-partner';
import type { ProgramEntry, AlumniStartupEntry, HighlightEntry, VoiceEntry, SupportedStartupEntry } from '@/components/profile/ecosystem-partner';
import { toast } from 'sonner';

type SectionType = 'introduction' | 'portfolio' | 'team' | 'programs' | 'organization-overview' | 'alumni' | 'highlights' | 'voices' | 'supported-startups' | 'focus-areas' | 'offerings';

export default function EditSection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sectionType = searchParams.get('section') as SectionType;
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const [isSaving, setIsSaving] = useState(false);

  const { role, roleProfile, saveRoleProfile } = useRoleProfile(user?.id);
  const [roleProfileData, setRoleProfileData] = useState<any>(null);

  // Update role profile data when loaded - ensure team_members is always an array (only for innovator/startup)
  useEffect(() => {
    if (roleProfile) {
      // Only add team_members for roles that have this column
      if (role === 'innovator' || role === 'startup') {
        const profileWithTeam = roleProfile as any;
        setRoleProfileData({
          ...roleProfile,
          team_members: Array.isArray(profileWithTeam?.team_members) ? profileWithTeam.team_members : [],
        });
      } else {
        setRoleProfileData(roleProfile);
      }
    }
  }, [roleProfile, role]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Redirect if invalid section type
  useEffect(() => {
    if (!sectionType || !['introduction', 'portfolio', 'team', 'programs', 'organization-overview', 'alumni', 'highlights', 'voices', 'supported-startups', 'focus-areas', 'offerings'].includes(sectionType)) {
      navigate('/dashboard');
    }
  }, [sectionType, navigate]);

  const handleSave = async () => {
    if (!roleProfileData || !role) return;
    
    setIsSaving(true);
    try {
      // For team section, filter out incomplete members (those without names)
      let dataToSave = roleProfileData;
      if (sectionType === 'team' && Array.isArray(roleProfileData.team_members)) {
        const validMembers = roleProfileData.team_members.filter(
          (member: any) => member && member.name && member.name.trim() !== ""
        );
        dataToSave = { ...roleProfileData, team_members: validMembers };
        
        // Warn user if some members were filtered out
        const removedCount = roleProfileData.team_members.length - validMembers.length;
        if (removedCount > 0) {
          toast.info(`${removedCount} incomplete member(s) without names were not saved.`);
        }
      }
      
      await saveRoleProfile.mutateAsync(dataToSave);
      toast.success('Changes saved successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const getSectionTitle = () => {
    switch (sectionType) {
      case 'introduction':
        return 'Edit Introduction';
      case 'portfolio':
        return role === 'startup' ? 'Edit Company Portfolio' : 'Edit Portfolio';
      case 'team':
        return 'Edit Team';
      case 'programs':
        return 'Edit Programs';
      case 'organization-overview':
        return 'Edit Organization Overview';
      case 'alumni':
        return 'Edit Startups & Alumni';
      case 'highlights':
        return 'Edit Featured Highlights';
      case 'voices':
        return 'Edit Voices';
      case 'supported-startups':
        return 'Edit Supported Startups';
      case 'focus-areas':
        return 'Edit Focus Areas & Stages';
      case 'offerings':
        return 'Edit Offerings';
      default:
        return 'Edit Section';
    }
  };

  const renderSectionContent = () => {
    if (!roleProfileData) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    switch (sectionType) {
      case 'introduction':
        return (
          <IntroductionVideoSection
            videoUrl={roleProfileData?.intro_video_url}
            thumbnailUrl={roleProfileData?.intro_video_thumbnail_url}
            title={roleProfileData?.intro_video_title}
            description={roleProfileData?.intro_video_description}
            isOwner={true}
            isEditable={true}
            isMobile={isMobile}
            userId={String(user?.id)}
            role={role as 'innovator' | 'startup'}
            onVideoChange={(data) => {
              setRoleProfileData((prev: any) => ({
                ...prev,
                ...data,
              }));
            }}
          />
        );
      case 'portfolio':
        if (role === 'startup') {
          return (
            <StartupPortfolioSection
              profile={roleProfileData as Partial<StartupProfile>}
              isEditable={true}
              onChange={setRoleProfileData}
              isMobile={isMobile}
            />
          );
        }
        return (
          <PortfolioSection
            profile={roleProfileData as Partial<InnovatorProfile>}
            isEditable={true}
            onChange={setRoleProfileData}
            isMobile={isMobile}
          />
        );
      case 'team':
        // Ensure team_members is a proper array before passing
        const teamMembers = Array.isArray(roleProfileData?.team_members) 
          ? roleProfileData.team_members 
          : [];
        return (
          <TeamSection
            members={teamMembers as TeamMember[]}
            isEditable={true}
            onChange={(members) => {
              console.log('Team members updated:', members);
              setRoleProfileData((prev: any) => ({ 
                ...prev, 
                team_members: members 
              }));
            }}
            isMobile={isMobile}
            isOwner={true}
          />
        );
      case 'programs':
        if (role !== 'ecosystem_partner') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              Programs section is only available for Ecosystem Partners.
            </div>
          );
        }
        const programs = Array.isArray(roleProfileData?.programs) 
          ? roleProfileData.programs 
          : [];
        return (
          <ProgramsEditSection
            programs={programs as ProgramEntry[]}
            onChange={(updatedPrograms) => {
              setRoleProfileData((prev: any) => ({
                ...prev,
                programs: updatedPrograms,
              }));
            }}
            userId={String(user?.id)}
            isMobile={isMobile}
          />
        );
      case 'organization-overview':
        if (role !== 'ecosystem_partner') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              Organization Overview is only available for Ecosystem Partners.
            </div>
          );
        }
        return (
          <OrganizationOverviewEditSection
            data={{
              founded_year: roleProfileData?.founded_year,
              headquarters: roleProfileData?.headquarters,
              organization_type: roleProfileData?.organization_type,
              geographic_focus: roleProfileData?.geographic_focus || [],
              mission_statement: roleProfileData?.mission_statement,
              focus_areas: roleProfileData?.focus_areas || [],
              sectors: roleProfileData?.sectors || [],
              engagement_type: roleProfileData?.engagement_type,
              program_duration: roleProfileData?.program_duration,
              equity_model: roleProfileData?.equity_model,
              partnerships: roleProfileData?.partnerships || [],
              startups_supported_count: roleProfileData?.startups_supported_count,
              years_active: roleProfileData?.years_active,
              global_alumni_reach: roleProfileData?.global_alumni_reach,
            }}
            onChange={(updatedData) => {
              setRoleProfileData((prev: any) => ({
                ...prev,
                ...updatedData,
              }));
            }}
          />
        );
      case 'alumni':
        if (role !== 'ecosystem_partner') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              Startups & Alumni section is only available for Ecosystem Partners.
            </div>
          );
        }
        const alumniStartups = Array.isArray(roleProfileData?.alumni_startups) 
          ? roleProfileData.alumni_startups 
          : [];
        return (
          <AlumniEditSection
            alumni={alumniStartups as AlumniStartupEntry[]}
            onChange={(updatedAlumni) => {
              setRoleProfileData((prev: any) => ({
                ...prev,
                alumni_startups: updatedAlumni,
              }));
            }}
            userId={String(user?.id)}
            isMobile={isMobile}
          />
        );
      case 'highlights':
        if (role !== 'ecosystem_partner') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              Featured Highlights section is only available for Ecosystem Partners.
            </div>
          );
        }
        const highlights = Array.isArray(roleProfileData?.featured_highlights) 
          ? roleProfileData.featured_highlights 
          : [];
        return (
          <HighlightsEditSection
            highlights={highlights as HighlightEntry[]}
            onChange={(updatedHighlights) => {
              setRoleProfileData((prev: any) => ({
                ...prev,
                featured_highlights: updatedHighlights,
              }));
            }}
          />
        );
      case 'voices':
        if (role !== 'ecosystem_partner') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              Voices section is only available for Ecosystem Partners.
            </div>
          );
        }
        const voicesData = Array.isArray(roleProfileData?.leadership_voices) 
          ? roleProfileData.leadership_voices 
          : [];
        return (
          <VoicesEditSection
            voices={voicesData as VoiceEntry[]}
            onChange={(updatedVoices) => {
              setRoleProfileData((prev: any) => ({
                ...prev,
                leadership_voices: updatedVoices,
              }));
            }}
            userId={String(user?.id)}
            isMobile={isMobile}
          />
        );
      case 'supported-startups':
        if (role !== 'ecosystem_partner') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              Supported Startups section is only available for Ecosystem Partners.
            </div>
          );
        }
        const supportedStartups = Array.isArray(roleProfileData?.supported_startups) 
          ? roleProfileData.supported_startups 
          : [];
        return (
          <SupportedStartupsEditSection
            startups={supportedStartups as SupportedStartupEntry[]}
            onChange={(updatedStartups) => {
              setRoleProfileData((prev: any) => ({
                ...prev,
                supported_startups: updatedStartups,
              }));
            }}
            userId={String(user?.id)}
            isMobile={isMobile}
          />
        );
      case 'focus-areas':
        if (role !== 'ecosystem_partner') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              Focus Areas section is only available for Ecosystem Partners.
            </div>
          );
        }
        return (
          <FocusAreasEditSection
            focusIndustries={Array.isArray(roleProfileData?.focus_industries) ? roleProfileData.focus_industries : []}
            supportedStages={Array.isArray(roleProfileData?.supported_stages) ? roleProfileData.supported_stages : []}
            geographicFocus={Array.isArray(roleProfileData?.geographic_focus) ? roleProfileData.geographic_focus : []}
            onChange={(data) => {
              setRoleProfileData((prev: any) => ({
                ...prev,
                ...data,
              }));
            }}
          />
        );
      case 'offerings':
        if (role !== 'ecosystem_partner') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              Offerings section is only available for Ecosystem Partners.
            </div>
          );
        }
        return (
          <OfferingsEditSection
            offerings={Array.isArray(roleProfileData?.offerings) ? roleProfileData.offerings : []}
            onChange={(updatedOfferings) => {
              setRoleProfileData((prev: any) => ({
                ...prev,
                offerings: updatedOfferings,
              }));
            }}
          />
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-9 w-9 p-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">
              {getSectionTitle()}
            </h1>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-9"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={`${isMobile ? 'px-4 py-4' : 'container max-w-3xl py-6'}`}>
        {renderSectionContent()}
      </div>
    </div>
  );
}
