import { useState } from "react";
import {
  Building2,
  Target,
  Calendar,
  MapPin,
  Compass,
  Focus,
  CheckCircle,
  Users,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TagInput } from "@/components/ui/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StartupProfile,
  EcosystemSupportEntry,
  CompanyJourneyEntry,
} from "@/api/profiles";

interface StartupPortfolioEditSectionProps {
  profile: Partial<StartupProfile> | null;
  onChange: (data: Partial<StartupProfile>) => void;
  isMobile?: boolean;
}

export function StartupPortfolioEditSection({
  profile,
  onChange,
  isMobile = false,
}: StartupPortfolioEditSectionProps) {
  const [newHighlight, setNewHighlight] = useState("");

  const companySnapshot = profile?.company_snapshot || "";
  const marketType = profile?.market_type || "";
  const foundedYear = profile?.founded_year || "";
  const operatingStatus = profile?.operating_status || "active";
  const companyBackground = profile?.company_background || "";
  const visionDirection = profile?.vision_direction || "";
  const currentFocus = profile?.current_focus || "";
  const progressHighlights = profile?.progress_highlights || [];
  const ecosystemSupport = (profile?.ecosystem_support || []) as EcosystemSupportEntry[];
  const companyJourney = (profile?.company_journey_timeline || []) as CompanyJourneyEntry[];

  // Helper to merge updates with existing profile
  const handleChange = (updates: Partial<StartupProfile>) => {
    onChange({ ...profile, ...updates });
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      handleChange({
        progress_highlights: [...progressHighlights, newHighlight.trim()],
      });
      setNewHighlight("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    const updated = progressHighlights.filter((_, i) => i !== index);
    handleChange({ progress_highlights: updated });
  };

  const handleAddEcosystem = () => {
    handleChange({
      ecosystem_support: [
        ...ecosystemSupport,
        { name: "", type: "accelerator", description: "" },
      ],
    });
  };

  const handleUpdateEcosystem = (
    index: number,
    field: keyof EcosystemSupportEntry,
    value: string
  ) => {
    const updated = ecosystemSupport.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    handleChange({ ecosystem_support: updated });
  };

  const handleRemoveEcosystem = (index: number) => {
    const updated = ecosystemSupport.filter((_, i) => i !== index);
    handleChange({ ecosystem_support: updated });
  };

  const handleAddJourney = () => {
    handleChange({
      company_journey_timeline: [
        ...companyJourney,
        { year: "", milestone: "" },
      ],
    });
  };

  const handleUpdateJourney = (
    index: number,
    field: keyof CompanyJourneyEntry,
    value: string
  ) => {
    const updated = companyJourney.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    handleChange({ company_journey_timeline: updated });
  };

  const handleRemoveJourney = (index: number) => {
    const updated = companyJourney.filter((_, i) => i !== index);
    handleChange({ company_journey_timeline: updated });
  };

  const content = (
    <div className="space-y-6">
      {/* Company Snapshot */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          Company Snapshot
        </Label>
        <Textarea
          placeholder="Describe your company in a short paragraph..."
          value={companySnapshot}
          onChange={(e) => handleChange({ company_snapshot: e.target.value })}
          className="min-h-[80px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          What kind of company is this? What space do you operate in?
        </p>
      </div>

      <Separator />

      {/* Focus Areas */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          Focus Areas
        </h4>

        <div className="space-y-2">
          <Label className="text-sm">Market Type</Label>
          <Select
            value={marketType}
            onValueChange={(value) => handleChange({ market_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select market type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="B2B">B2B</SelectItem>
              <SelectItem value="B2C">B2C</SelectItem>
              <SelectItem value="Platform">Platform</SelectItem>
              <SelectItem value="B2B2C">B2B2C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Company Identity */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Company Identity
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Founded Year</Label>
            <Input
              placeholder="e.g., 2023"
              value={foundedYear}
              onChange={(e) => handleChange({ founded_year: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Operating Status</Label>
            <Select
              value={operatingStatus}
              onValueChange={(value) => handleChange({ operating_status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="exploring">Exploring</SelectItem>
                <SelectItem value="stealth">Stealth</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Company Background */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Compass className="h-4 w-4 text-muted-foreground" />
          Company Background
        </Label>
        <Textarea
          placeholder="Why does your company exist? What problem space do you operate in?"
          value={companyBackground}
          onChange={(e) => handleChange({ company_background: e.target.value })}
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Vision & Direction */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Target className="h-4 w-4 text-muted-foreground" />
          Vision & Direction
        </Label>
        <Textarea
          placeholder="Describe your long-term intent and where you aim to grow..."
          value={visionDirection}
          onChange={(e) => handleChange({ vision_direction: e.target.value })}
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Current Stage & Focus */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Focus className="h-4 w-4 text-muted-foreground" />
          Current Stage & Focus
        </Label>
        <Textarea
          placeholder="What is your startup currently focused on? (validation, building, partnerships...)"
          value={currentFocus}
          onChange={(e) => handleChange({ current_focus: e.target.value })}
          className="min-h-[80px] resize-none"
        />
      </div>

      <Separator />

      {/* Progress Highlights */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
          Progress Highlights
        </Label>
        <p className="text-xs text-muted-foreground">
          Add lightweight bullet points (e.g., MVP built, Early users onboarded)
        </p>

        <div className="space-y-2">
          {progressHighlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm flex-1">{highlight}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleRemoveHighlight(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a highlight..."
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddHighlight();
              }
            }}
          />
          <Button variant="outline" size="sm" onClick={handleAddHighlight}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Ecosystem Support */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4 text-muted-foreground" />
          Ecosystem Support
        </Label>
        <p className="text-xs text-muted-foreground">
          Add accelerators, communities, programs, or grants
        </p>

        <div className="space-y-3">
          {ecosystemSupport.map((support, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-border/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Select
                  value={support.type}
                  onValueChange={(value) =>
                    handleUpdateEcosystem(index, "type", value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accelerator">Accelerator</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="program">Program</SelectItem>
                    <SelectItem value="grant">Grant</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveEcosystem(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                placeholder="Name"
                value={support.name}
                onChange={(e) =>
                  handleUpdateEcosystem(index, "name", e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={handleAddEcosystem}>
          <Plus className="h-4 w-4 mr-1" />
          Add Support
        </Button>
      </div>

      <Separator />

      {/* Company Journey Timeline */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Company Journey Timeline
        </Label>
        <p className="text-xs text-muted-foreground">
          Add key milestones in your company's journey
        </p>

        <div className="space-y-3">
          {companyJourney.map((entry, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 rounded-lg border border-border/50"
            >
              <div className="space-y-2 flex-1">
                <Input
                  placeholder="Year (e.g., 2023)"
                  value={entry.year}
                  onChange={(e) =>
                    handleUpdateJourney(index, "year", e.target.value)
                  }
                  className="w-24"
                />
                <Input
                  placeholder="Milestone"
                  value={entry.milestone}
                  onChange={(e) =>
                    handleUpdateJourney(index, "milestone", e.target.value)
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleRemoveJourney(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={handleAddJourney}>
          <Plus className="h-4 w-4 mr-1" />
          Add Milestone
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="bg-card px-4 py-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Edit Company Portfolio
        </h3>
        {content}
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Edit Company Portfolio
        </h3>
        {content}
      </CardContent>
    </Card>
  );
}