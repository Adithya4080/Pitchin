import { Briefcase, Clock, FileText, DollarSign } from "lucide-react";
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
import { ConsultantProfile } from "@/api/profiles";

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited Availability" },
  { value: "busy", label: "Currently Busy" },
];

interface ConsultantSectionProps {
  profile: Partial<ConsultantProfile> | null;
  isEditable?: boolean;
  onChange?: (data: Partial<ConsultantProfile>) => void;
  isMobile?: boolean;
}

export function ConsultantSection({
  profile,
  isEditable = false,
  onChange,
  isMobile = false,
}: ConsultantSectionProps) {
  const expertiseAreas = profile?.expertise_areas || [];
  const experienceSummary = profile?.experience_summary || "";
  const servicesOffered = profile?.services_offered || "";
  const availability = profile?.availability || "";
  const hourlyRate = profile?.hourly_rate || "";

  const hasContent = expertiseAreas.length > 0 || experienceSummary || servicesOffered || availability;

  if (!isEditable && !hasContent) {
    return null;
  }

  const getAvailabilityLabel = (value: string) => {
    return AVAILABILITY_OPTIONS.find((a) => a.value === value)?.label || value;
  };

  const getAvailabilityColor = (value: string) => {
    switch (value) {
      case "available":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "limited":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "busy":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "";
    }
  };

  if (isEditable) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-5 space-y-5">
          <h3 className="text-sm font-bold text-foreground">
            Consultant Details
          </h3>

          <div className="space-y-2">
            <Label>Expertise Areas</Label>
            <TagInput
              value={expertiseAreas}
              onChange={(newTags) => onChange?.({ ...profile, expertise_areas: newTags })}
              placeholder="Add expertise area..."
              maxTags={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceSummary">Experience Summary</Label>
            <Textarea
              id="experienceSummary"
              placeholder="Summarize your experience..."
              value={experienceSummary}
              onChange={(e) => onChange?.({ ...profile, experience_summary: e.target.value })}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="servicesOffered">Services Offered</Label>
            <Textarea
              id="servicesOffered"
              placeholder="List your services (one per line or comma-separated)..."
              value={servicesOffered}
              onChange={(e) => onChange?.({ ...profile, services_offered: e.target.value })}
              rows={3}
              maxLength={500}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Availability
              </Label>
              <Select
                value={availability}
                onValueChange={(value) => onChange?.({ ...profile, availability: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_OPTIONS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Hourly Rate (Optional)
              </Label>
              <Input
                id="hourlyRate"
                placeholder="e.g., $50/hr"
                value={hourlyRate}
                onChange={(e) => onChange?.({ ...profile, hourly_rate: e.target.value })}
                maxLength={30}
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
        <div className="flex flex-wrap items-center gap-2">
          {availability && (
            <Badge variant="outline" className={`text-xs ${getAvailabilityColor(availability)}`}>
              <Clock className="h-3 w-3 mr-1" />
              {getAvailabilityLabel(availability)}
            </Badge>
          )}
          {hourlyRate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              {hourlyRate}
            </div>
          )}
        </div>

        {expertiseAreas.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Expertise Areas
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {expertiseAreas.map((area, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {experienceSummary && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Experience
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {experienceSummary}
              </p>
            </div>
          </>
        )}

        {servicesOffered && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Services Offered
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {servicesOffered}
              </p>
            </div>
          </>
        )}
      </div>
    );
  }

  // View mode - Desktop
  return (
    <Card className="border-border/50">
      <CardContent className="p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-3 p-3 bg-card border border-border rounded-lg">
          {availability && (
            <Badge variant="outline" className={getAvailabilityColor(availability)}>
              <Clock className="h-3 w-3 mr-1" />
              {getAvailabilityLabel(availability)}
            </Badge>
          )}
          {hourlyRate && (
            <div className="flex items-center gap-1 text-sm text-foreground">
              <DollarSign className="h-4 w-4" />
              {hourlyRate}
            </div>
          )}
        </div>

        {expertiseAreas.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Expertise Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {expertiseAreas.map((area, index) => (
                  <Badge key={index} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {experienceSummary && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Experience
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {experienceSummary}
              </p>
            </div>
          </>
        )}

        {servicesOffered && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Services Offered
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {servicesOffered}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
