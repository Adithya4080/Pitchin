import { Building2, Users, Target, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TagInput } from "@/components/ui/tag-input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StartupProfile } from "@/api/profiles";

const STAGES = [
  { value: "idea", label: "Idea Stage" },
  { value: "mvp", label: "MVP" },
  { value: "revenue", label: "Generating Revenue" },
];

interface StartupSectionProps {
  profile: Partial<StartupProfile> | null;
  isEditable?: boolean;
  onChange?: (data: Partial<StartupProfile>) => void;
  isMobile?: boolean;
}

export function StartupSection({
  profile,
  isEditable = false,
  onChange,
  isMobile = false,
}: StartupSectionProps) {
  const companyName = profile?.company_name || "";
  const companyOverview = profile?.company_overview || "";
  const industryTags = profile?.industry_tags || [];
  const stage = profile?.stage || "";
  const lookingFor = profile?.looking_for || "";

  const hasContent = companyName || companyOverview || industryTags.length > 0 || stage || lookingFor;

  if (!isEditable && !hasContent) {
    return null;
  }

  const getStageLabel = (stageValue: string) => {
    return STAGES.find((s) => s.value === stageValue)?.label || stageValue;
  };

  if (isEditable) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-5 space-y-5">
          <h3 className="text-sm font-bold text-foreground">
            Startup Details
          </h3>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Your company name"
              value={companyName}
              onChange={(e) => onChange?.({ ...profile, company_name: e.target.value })}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyOverview">Company Overview</Label>
            <Textarea
              id="companyOverview"
              placeholder="What does your company do?"
              value={companyOverview}
              onChange={(e) => onChange?.({ ...profile, company_overview: e.target.value })}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label>Industry / Domain</Label>
            <TagInput
              value={industryTags}
              onChange={(newTags) => onChange?.({ ...profile, industry_tags: newTags })}
              placeholder="Add industry tag..."
              maxTags={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Stage</Label>
            <Select
              value={stage}
              onValueChange={(value) => onChange?.({ ...profile, stage: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your stage" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="lookingFor" className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              What are you looking for?
            </Label>
            <Textarea
              id="lookingFor"
              placeholder="Funding, mentorship, collaboration, talent..."
              value={lookingFor}
              onChange={(e) => onChange?.({ ...profile, looking_for: e.target.value })}
              rows={2}
              maxLength={300}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // View mode - Mobile: full-width with white background
  if (isMobile) {
    return (
      <div className="bg-card px-4 py-4 space-y-4">
        {(companyName || companyOverview) && (
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">
              Company Overview
            </h3>
            {companyName && (
              <p className="font-medium text-foreground text-sm mb-1">{companyName}</p>
            )}
            {companyOverview && (
              <p className="text-sm text-muted-foreground">{companyOverview}</p>
            )}
          </div>
        )}

        {(industryTags.length > 0 || stage) && (
          <>
            {(companyName || companyOverview) && <Separator />}
            <div className="flex flex-wrap items-center gap-2">
              {stage && (
                <div className="flex items-center gap-1.5">
                  <Rocket className="h-3.5 w-3.5 text-primary" />
                  <Badge variant="outline" className="text-xs">{getStageLabel(stage)}</Badge>
                </div>
              )}
              {industryTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {industryTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {lookingFor && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Looking For
              </h3>
              <p className="text-sm text-muted-foreground">{lookingFor}</p>
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
        {(companyName || companyOverview) && (
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">
              Company Overview
            </h3>
            {companyName && (
              <p className="font-medium text-foreground mb-1">{companyName}</p>
            )}
            {companyOverview && (
              <p className="text-sm text-muted-foreground">{companyOverview}</p>
            )}
          </div>
        )}

        {(industryTags.length > 0 || stage) && (
          <>
            {(companyName || companyOverview) && <Separator />}
            <div className="flex flex-wrap items-center gap-3">
              {stage && (
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  <Badge variant="outline">{getStageLabel(stage)}</Badge>
                </div>
              )}
              {industryTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {industryTags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {lookingFor && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Looking For
              </h3>
              <p className="text-sm text-muted-foreground">{lookingFor}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
