import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Target, Lightbulb, Users, HelpCircle, Paperclip, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useProfilePitch, useUpdateProfilePitch } from '@/hooks/useProfilePitches';
import { useQuery } from '@tanstack/react-query';
import { isValidUuid } from '@/lib/validation';
import { PitchDetailSkeleton } from '@/components/skeletons';
import { ContentTransition } from '@/components/transitions';
import {
  PitchDetailHeader,
  PitchDetailSection,
  PitchStageBadge,
  PitchLookingForTags,
  PitchSupportingMaterials,
  PitchAuthorCard,
  AttachmentsSection,
} from '@/components/pitch-detail';
import { EditPitchForm, type PitchFormData } from '@/components/pitch-detail/EditPitchForm';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type UserRole = 'innovator' | 'startup' | 'investor' | 'consultant';

// Role-specific configuration
const getRoleConfig = (role: UserRole | null) => {
  const isStartup = role === 'startup';
  return {
    pitchType: isStartup ? 'Product' : 'Idea Pitch',
    editTitle: isStartup ? 'Edit Product' : 'Edit Pitch',
    problemLabel: isStartup ? 'Problem We Solve' : 'Problem',
    solutionLabel: isStartup ? 'Our Solution' : 'Proposed Solution',
    targetLabel: isStartup ? 'Target Market' : 'Who Is This For',
    stageLabel: isStartup ? 'Product Stage' : 'Current Stage',
    lookingForLabel: isStartup ? "What We're Looking For" : "What I'm Looking For",
    considerationsLabel: isStartup ? 'Key Challenges' : 'Open Considerations',
  };
};

export default function PitchDetail() {
  const { pitchId } = useParams<{ pitchId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const updatePitch = useUpdateProfilePitch();
  const isMobile = useIsMobile();

  const isEditMode = searchParams.get('edit') === 'true';
  const validPitchId = isValidUuid(pitchId);

  // Fetch the pitch
  const { data: pitch, isLoading, refetch } = useProfilePitch(validPitchId ? pitchId : undefined);

  // Fetch author profile and role
  const { data: authorProfile } = useQuery({
    queryKey: ['pitch-author', pitch?.user_id],
    queryFn: async () => {
      if (!pitch?.user_id) return null;
      try {
        return await (await import('@/api/profiles')).getUserProfile(pitch.user_id);
      } catch {
        return null;
      }
    },
    enabled: !!pitch?.user_id,
  });

  // Fetch author's role
  const { data: authorRole } = useQuery({
    queryKey: ['pitch-author-role', pitch?.user_id],
    queryFn: async (): Promise<string | null> => {
      if (!pitch?.user_id) return null;
      try {
        const profile = await (await import('@/api/profiles')).getUserProfile(pitch.user_id);
        return (profile as any).role ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!pitch?.user_id,
  });

  const roleConfig = getRoleConfig((authorRole as UserRole) ?? null);
  const isOwner = String(user?.id) === String(pitch?.user_id);

  const handleEditClick = () => {
    setSearchParams({ edit: 'true' });
  };

  const handleCancelEdit = () => {
    setSearchParams({});
  };

  const handleSubmit = async (data: PitchFormData) => {
    if (!pitch?.id) return;

    await updatePitch.mutateAsync({
      id: pitch.id,
      title: data.title,
      description: data.short_summary || data.title,
      short_summary: data.short_summary || null,
      image_url: data.image_url,
      problem_statement: data.problem_statement || null,
      solution_overview: data.solution_overview || null,
      target_users: data.target_users || null,
      current_stage: data.current_stage,
      open_considerations: data.open_considerations || null,
      looking_for: data.looking_for.length > 0 ? data.looking_for : null,
      status: data.status,
    });

    setSearchParams({});
    refetch();
  };

  // Redirect if not owner tries to access draft
  useEffect(() => {
    if (pitch && !isLoading && pitch.status === 'draft' && !isOwner) {
      navigate('/feed');
    }
  }, [pitch, isLoading, isOwner, navigate]);

  // Invalid pitch ID
  if (!validPitchId) {
    return (
      <AppLayout showBottomNav={true}>
        <div className="min-h-screen bg-background">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Invalid Pitch</h2>
              <p className="text-muted-foreground mb-6">
                The pitch you're looking for doesn't exist.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="bg-card text-foreground border-foreground/20 hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <AppLayout showBottomNav={true}>
        <PitchDetailSkeleton isMobile={isMobile} />
      </AppLayout>
    );
  }

  // Pitch not found
  if (!pitch) {
    return (
      <AppLayout showBottomNav={true}>
        <div className="min-h-screen bg-background">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Pitch Not Found</h2>
              <p className="text-muted-foreground mb-6">
                This pitch may have been removed or doesn't exist.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="bg-card text-foreground border-foreground/20 hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Edit Mode
  if (isEditMode && isOwner) {
    return (
      <AppLayout showBottomNav={false}>
        <div className="min-h-screen bg-background">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">{roleConfig.editTitle}</h1>

            <EditPitchForm
              pitch={pitch}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
              isSubmitting={updatePitch.isPending}
              roleConfig={roleConfig}
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  // View Mode - LinkedIn-style card layout
  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-0 md:px-4 py-0 md:py-8">
          {/* Main content - Card stack layout like profile */}
          <div className="space-y-0 md:space-y-4">
            {/* Header Card - like ProfileHeader */}
            <PitchDetailHeader
              title={pitch.title}
              shortSummary={pitch.short_summary || pitch.description}
              coverImage={pitch.image_url}
              status={pitch.status as 'draft' | 'published'}
              updatedAt={pitch.updated_at}
              isOwner={isOwner}
              onEdit={handleEditClick}
              pitchType={roleConfig.pitchType}
            />

            {/* Problem Section */}
            {pitch.problem_statement && (
              <PitchDetailSection title={roleConfig.problemLabel} icon={Target}>
                <p className="whitespace-pre-wrap">{pitch.problem_statement}</p>
              </PitchDetailSection>
            )}

            {/* Solution Section */}
            {pitch.solution_overview && (
              <PitchDetailSection title={roleConfig.solutionLabel} icon={Lightbulb}>
                <p className="whitespace-pre-wrap">{pitch.solution_overview}</p>
              </PitchDetailSection>
            )}

            {/* Target Users Section */}
            {pitch.target_users && (
              <PitchDetailSection title={roleConfig.targetLabel} icon={Users}>
                <p className="whitespace-pre-wrap">{pitch.target_users}</p>
              </PitchDetailSection>
            )}

            {/* Current Stage Section */}
            {pitch.current_stage && (
              <PitchDetailSection title={roleConfig.stageLabel} icon={Zap}>
                <PitchStageBadge stage={pitch.current_stage} />
              </PitchDetailSection>
            )}

            {/* Supporting Materials Section (legacy) */}
            {pitch.supporting_materials && pitch.supporting_materials.length > 0 && (
              <PitchDetailSection title="Supporting Materials" icon={Paperclip}>
                <PitchSupportingMaterials materials={pitch.supporting_materials} />
              </PitchDetailSection>
            )}

            {/* Attachments Section (new structured uploads) */}
            <AttachmentsSection pitchId={pitch.id} isOwner={isOwner} />

            {/* Open Considerations Section */}
            {pitch.open_considerations && (
              <PitchDetailSection title={roleConfig.considerationsLabel} icon={HelpCircle}>
                <p className="whitespace-pre-wrap">{pitch.open_considerations}</p>
              </PitchDetailSection>
            )}

            {/* Looking For Section */}
            {pitch.looking_for && pitch.looking_for.length > 0 && (
              <PitchDetailSection title={roleConfig.lookingForLabel}>
                <PitchLookingForTags items={pitch.looking_for} />
              </PitchDetailSection>
            )}

            {/* Author Card - like a mini profile card */}
            <PitchAuthorCard
              userId={pitch.user_id}
              fullName={authorProfile?.full_name || null}
              avatarUrl={authorProfile?.avatar_url || null}
              role={authorRole}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
