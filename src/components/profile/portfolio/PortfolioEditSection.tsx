import { useState } from "react";
import {
  User,
  Target,
  Briefcase,
  GraduationCap,
  Clock,
  Wrench,
  Users,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TagInput } from "@/components/ui/tag-input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import {
  InnovatorProfile,
  EducationEntry,
  WorkExperienceEntry,
  MentorBackerEntry,
  JourneyTimelineEntry,
} from "@/api/profiles";

interface PortfolioEditSectionProps {
  profile: Partial<InnovatorProfile> | null;
  onChange: (data: Partial<InnovatorProfile>) => void;
  isMobile?: boolean;
}

export function PortfolioEditSection({
  profile,
  onChange,
  isMobile = false,
}: PortfolioEditSectionProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    snapshot: true,
    background: false,
    education: false,
    experience: false,
    skills: false,
    mentors: false,
    timeline: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const professionalSnapshot = profile?.professional_snapshot || "";
  const focusAreas = profile?.focus_areas || [];
  const currentIdentity = profile?.current_identity || "";
  const experienceSummary = profile?.experience_summary || "";
  const backgroundJourney = profile?.background_journey || "";
  const education = (profile?.education || []) as EducationEntry[];
  const workExperience = (profile?.work_experience || []) as WorkExperienceEntry[];
  const skillsCapabilities = profile?.skills_capabilities || [];
  const mentorsBackers = (profile?.mentors_backers || []) as MentorBackerEntry[];
  const journeyTimeline = (profile?.journey_timeline || []) as JourneyTimelineEntry[];

  const addEducation = () => {
    const newEducation: EducationEntry = { institution: "", field_of_study: "", duration: "" };
    onChange({ ...profile, education: [...education, newEducation] });
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    const updated = education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    onChange({ ...profile, education: updated });
  };

  const removeEducation = (index: number) => {
    onChange({ ...profile, education: education.filter((_, i) => i !== index) });
  };

  const addWorkExperience = () => {
    const newExp: WorkExperienceEntry = {
      role: "",
      organization: "",
      description: "",
      time_period: "",
    };
    onChange({ ...profile, work_experience: [...workExperience, newExp] });
  };

  const updateWorkExperience = (
    index: number,
    field: keyof WorkExperienceEntry,
    value: string
  ) => {
    const updated = workExperience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange({ ...profile, work_experience: updated });
  };

  const removeWorkExperience = (index: number) => {
    onChange({ ...profile, work_experience: workExperience.filter((_, i) => i !== index) });
  };

  const addMentor = () => {
    const newMentor: MentorBackerEntry = { name: "", role: "", profile_link: "" };
    onChange({ ...profile, mentors_backers: [...mentorsBackers, newMentor] });
  };

  const updateMentor = (index: number, field: keyof MentorBackerEntry, value: string) => {
    const updated = mentorsBackers.map((mentor, i) =>
      i === index ? { ...mentor, [field]: value } : mentor
    );
    onChange({ ...profile, mentors_backers: updated });
  };

  const removeMentor = (index: number) => {
    onChange({ ...profile, mentors_backers: mentorsBackers.filter((_, i) => i !== index) });
  };

  const addTimelineEntry = () => {
    const newEntry: JourneyTimelineEntry = { year: "", milestone: "" };
    onChange({ ...profile, journey_timeline: [...journeyTimeline, newEntry] });
  };

  const updateTimelineEntry = (
    index: number,
    field: keyof JourneyTimelineEntry,
    value: string
  ) => {
    const updated = journeyTimeline.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    onChange({ ...profile, journey_timeline: updated });
  };

  const removeTimelineEntry = (index: number) => {
    onChange({ ...profile, journey_timeline: journeyTimeline.filter((_, i) => i !== index) });
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    section,
  }: {
    icon: React.ElementType;
    title: string;
    section: string;
  }) => (
    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/30 rounded-lg px-2 -mx-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      <ChevronDown
        className={`h-4 w-4 text-muted-foreground transition-transform ${
          expandedSections[section] ? "rotate-180" : ""
        }`}
      />
    </CollapsibleTrigger>
  );

  const content = (
    <div className="space-y-4">
      {/* Professional Snapshot & Core Info */}
      <Collapsible open={expandedSections.snapshot} onOpenChange={() => toggleSection("snapshot")}>
        <SectionHeader icon={User} title="Professional Snapshot" section="snapshot" />
        <CollapsibleContent className="space-y-4 pt-3">
          <div className="space-y-2">
            <Label htmlFor="professionalSnapshot">About You</Label>
            <Textarea
              id="professionalSnapshot"
              placeholder="Write a short paragraph about who you are, what you work on, and your focus..."
              value={professionalSnapshot}
              onChange={(e) =>
                onChange({ ...profile, professional_snapshot: e.target.value })
              }
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {professionalSnapshot.length}/500 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentIdentity">Current Identity (Optional)</Label>
            <Input
              id="currentIdentity"
              placeholder="e.g., Independent Innovator, Founder, Builder"
              value={currentIdentity}
              onChange={(e) => onChange({ ...profile, current_identity: e.target.value })}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label>Focus Areas & Expertise</Label>
            <TagInput
              value={focusAreas}
              onChange={(tags) => onChange({ ...profile, focus_areas: tags })}
              placeholder="Add focus area..."
              maxTags={8}
            />
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add tags (e.g., Product Thinking, SaaS, AI)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceSummary">Experience Summary</Label>
            <Textarea
              id="experienceSummary"
              placeholder="1-2 lines summarizing your overall experience or journey..."
              value={experienceSummary}
              onChange={(e) => onChange({ ...profile, experience_summary: e.target.value })}
              rows={2}
              maxLength={200}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Background & Journey */}
      <Collapsible
        open={expandedSections.background}
        onOpenChange={() => toggleSection("background")}
      >
        <SectionHeader icon={MapPin} title="Background & Journey" section="background" />
        <CollapsibleContent className="pt-3">
          <div className="space-y-2">
            <Textarea
              placeholder="Share your story, motivation, and path into innovation..."
              value={backgroundJourney}
              onChange={(e) => onChange({ ...profile, background_journey: e.target.value })}
              rows={5}
              maxLength={1500}
            />
            <p className="text-xs text-muted-foreground">
              {backgroundJourney.length}/1500 characters
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Education */}
      <Collapsible
        open={expandedSections.education}
        onOpenChange={() => toggleSection("education")}
      >
        <SectionHeader icon={GraduationCap} title="Education (Optional)" section="education" />
        <CollapsibleContent className="space-y-3 pt-3">
          {education.map((edu, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs text-muted-foreground">Entry {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <Input
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(index, "institution", e.target.value)}
              />
              <Input
                placeholder="Field of Study"
                value={edu.field_of_study}
                onChange={(e) => updateEducation(index, "field_of_study", e.target.value)}
              />
              <Input
                placeholder="Duration (e.g., 2018-2022)"
                value={edu.duration}
                onChange={(e) => updateEducation(index, "duration", e.target.value)}
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addEducation}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Work Experience */}
      <Collapsible
        open={expandedSections.experience}
        onOpenChange={() => toggleSection("experience")}
      >
        <SectionHeader icon={Briefcase} title="Experience & Work" section="experience" />
        <CollapsibleContent className="space-y-3 pt-3">
          {workExperience.map((exp, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs text-muted-foreground">Entry {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeWorkExperience(index)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <Input
                placeholder="Role / Title"
                value={exp.role}
                onChange={(e) => updateWorkExperience(index, "role", e.target.value)}
              />
              <Input
                placeholder="Organization or context"
                value={exp.organization}
                onChange={(e) => updateWorkExperience(index, "organization", e.target.value)}
              />
              <Textarea
                placeholder="Short description of your work..."
                value={exp.description}
                onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                rows={2}
              />
              <Input
                placeholder="Time period (e.g., 2020-Present)"
                value={exp.time_period}
                onChange={(e) => updateWorkExperience(index, "time_period", e.target.value)}
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addWorkExperience}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Skills & Capabilities */}
      <Collapsible open={expandedSections.skills} onOpenChange={() => toggleSection("skills")}>
        <SectionHeader icon={Wrench} title="Skills & Capabilities" section="skills" />
        <CollapsibleContent className="pt-3">
          <TagInput
            value={skillsCapabilities}
            onChange={(tags) => onChange({ ...profile, skills_capabilities: tags })}
            placeholder="Add skill..."
            maxTags={15}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Skills, tools, and domains you're proficient in
          </p>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Mentors & Backers */}
      <Collapsible open={expandedSections.mentors} onOpenChange={() => toggleSection("mentors")}>
        <SectionHeader icon={Users} title="Mentors & Backers (Optional)" section="mentors" />
        <CollapsibleContent className="space-y-3 pt-3">
          {mentorsBackers.map((mentor, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs text-muted-foreground">Entry {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeMentor(index)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <Input
                placeholder="Name"
                value={mentor.name}
                onChange={(e) => updateMentor(index, "name", e.target.value)}
              />
              <Input
                placeholder="Role (e.g., Advisor, Mentor)"
                value={mentor.role}
                onChange={(e) => updateMentor(index, "role", e.target.value)}
              />
              <Input
                placeholder="Profile link (optional)"
                value={mentor.profile_link || ""}
                onChange={(e) => updateMentor(index, "profile_link", e.target.value)}
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addMentor}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Mentor/Backer
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Journey Timeline */}
      <Collapsible
        open={expandedSections.timeline}
        onOpenChange={() => toggleSection("timeline")}
      >
        <SectionHeader icon={Clock} title="Journey Timeline (Optional)" section="timeline" />
        <CollapsibleContent className="space-y-3 pt-3">
          {journeyTimeline.map((entry, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs text-muted-foreground">Entry {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeTimelineEntry(index)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <Input
                placeholder="Year (e.g., 2020)"
                value={entry.year}
                onChange={(e) => updateTimelineEntry(index, "year", e.target.value)}
              />
              <Textarea
                placeholder="Milestone or achievement..."
                value={entry.milestone}
                onChange={(e) => updateTimelineEntry(index, "milestone", e.target.value)}
                rows={2}
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addTimelineEntry}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Timeline Entry
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  if (isMobile) {
    return <div className="space-y-4">{content}</div>;
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Portfolio
        </h3>
        {content}
      </CardContent>
    </Card>
  );
}
