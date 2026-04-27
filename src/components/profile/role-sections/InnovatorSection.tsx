import { Lightbulb, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TagInput } from "@/components/ui/tag-input";
import { Separator } from "@/components/ui/separator";
import { InnovatorProfile } from "@/api/profiles";

interface InnovatorSectionProps {
  profile: Partial<InnovatorProfile> | null;
  isEditable?: boolean;
  onChange?: (data: Partial<InnovatorProfile>) => void;
  isMobile?: boolean;
}

export function InnovatorSection({
  profile,
  isEditable = false,
  onChange,
  isMobile = false,
}: InnovatorSectionProps) {
  const skills = profile?.skills || [];
  const achievements = profile?.achievements || "";
  const featuredTitle = profile?.featured_project_title || "";
  const featuredDescription = profile?.featured_project_description || "";

  const hasContent = skills.length > 0 || achievements || featuredTitle;

  if (!isEditable && !hasContent) {
    return null;
  }

  if (isEditable) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-5 space-y-5">
          <h3 className="text-sm font-bold text-foreground">
            Innovator Details
          </h3>

          <div className="space-y-2">
            <Label>Skills & Expertise</Label>
            <TagInput
              value={skills}
              onChange={(newSkills) => onChange?.({ ...profile, skills: newSkills })}
              placeholder="Add a skill..."
              maxTags={10}
            />
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add tags
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements</Label>
            <Textarea
              id="achievements"
              placeholder="List your key achievements..."
              value={achievements}
              onChange={(e) => onChange?.({ ...profile, achievements: e.target.value })}
              rows={3}
              maxLength={500}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground">
              Featured Project (Optional)
            </h4>

            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input
                id="projectTitle"
                placeholder="My Amazing Project"
                value={featuredTitle}
                onChange={(e) =>
                  onChange?.({ ...profile, featured_project_title: e.target.value })
                }
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea
                id="projectDescription"
                placeholder="Brief description of your project..."
                value={featuredDescription}
                onChange={(e) =>
                  onChange?.({ ...profile, featured_project_description: e.target.value })
                }
                rows={2}
                maxLength={300}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // View mode - Mobile: full-width with white background
  if (isMobile) {
    return (
      <div className="bg-card px-4 py-4 space-y-4">
        {skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {achievements && (
          <>
            {skills.length > 0 && <Separator />}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Achievements
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {achievements}
              </p>
            </div>
          </>
        )}

        {featuredTitle && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Featured Project
              </h3>
              <div className="p-3 bg-muted/50">
                <p className="font-medium text-foreground text-sm">{featuredTitle}</p>
                {featuredDescription && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {featuredDescription}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // View mode - Desktop
  return (
    <Card className="border-border/50">
      <CardContent className="p-5 space-y-5">
        {skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {achievements && (
          <>
            {skills.length > 0 && <Separator />}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Achievements
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {achievements}
              </p>
            </div>
          </>
        )}

        {featuredTitle && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Featured Project
              </h3>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium text-foreground">{featuredTitle}</p>
                {featuredDescription && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {featuredDescription}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
