import { TrendingUp, Globe, Target, DollarSign } from "lucide-react";
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
import { InvestorProfile } from "@/api/profiles";

const INVESTOR_TYPES = [
  { value: "angel", label: "Angel Investor" },
  { value: "vc", label: "Venture Capital" },
  { value: "corporate", label: "Corporate Investor" },
  { value: "individual", label: "Individual Investor" },
];

interface InvestorSectionProps {
  profile: Partial<InvestorProfile> | null;
  isEditable?: boolean;
  onChange?: (data: Partial<InvestorProfile>) => void;
  isMobile?: boolean;
}

export function InvestorSection({
  profile,
  isEditable = false,
  onChange,
  isMobile = false,
}: InvestorSectionProps) {
  const investorType = profile?.investor_type || "";
  const investmentRange = profile?.investment_range || "";
  const preferredSectors = profile?.preferred_sectors || [];
  const regionFocus = profile?.region_focus || "";
  const investmentCriteria = profile?.investment_criteria || "";

  const hasContent = investorType || investmentRange || preferredSectors.length > 0 || regionFocus || investmentCriteria;

  if (!isEditable && !hasContent) {
    return null;
  }

  const getTypeLabel = (typeValue: string) => {
    return INVESTOR_TYPES.find((t) => t.value === typeValue)?.label || typeValue;
  };

  if (isEditable) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-5 space-y-5">
          <h3 className="text-sm font-bold text-foreground">
            Investor Details
          </h3>

          <div className="space-y-2">
            <Label>Investor Type</Label>
            <Select
              value={investorType}
              onValueChange={(value) => onChange?.({ ...profile, investor_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select investor type" />
              </SelectTrigger>
              <SelectContent>
                {INVESTOR_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentRange">Investment Range</Label>
            <Input
              id="investmentRange"
              placeholder="e.g., $10K - $100K"
              value={investmentRange}
              onChange={(e) => onChange?.({ ...profile, investment_range: e.target.value })}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label>Preferred Sectors</Label>
            <TagInput
              value={preferredSectors}
              onChange={(newTags) => onChange?.({ ...profile, preferred_sectors: newTags })}
              placeholder="Add sector..."
              maxTags={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regionFocus">Region Focus</Label>
            <Input
              id="regionFocus"
              placeholder="e.g., Global, North America, Europe"
              value={regionFocus}
              onChange={(e) => onChange?.({ ...profile, region_focus: e.target.value })}
              maxLength={100}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="investmentCriteria" className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              What I Look For
            </Label>
            <Textarea
              id="investmentCriteria"
              placeholder="Describe your investment criteria..."
              value={investmentCriteria}
              onChange={(e) => onChange?.({ ...profile, investment_criteria: e.target.value })}
              rows={3}
              maxLength={500}
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
        <div className="flex flex-wrap items-center gap-2">
          {investorType && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <Badge variant="outline" className="text-xs">{getTypeLabel(investorType)}</Badge>
            </div>
          )}
          {investmentRange && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">{investmentRange}</span>
            </div>
          )}
          {regionFocus && (
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{regionFocus}</span>
            </div>
          )}
        </div>

        {preferredSectors.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Preferred Sectors
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {preferredSectors.map((sector, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {investmentCriteria && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                What I Look For
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {investmentCriteria}
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
      <CardContent className="p-5 space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          {investorType && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <Badge variant="outline">{getTypeLabel(investorType)}</Badge>
            </div>
          )}
          {investmentRange && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{investmentRange}</span>
            </div>
          )}
          {regionFocus && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{regionFocus}</span>
            </div>
          )}
        </div>

        {preferredSectors.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Preferred Sectors
              </h3>
              <div className="flex flex-wrap gap-2">
                {preferredSectors.map((sector, index) => (
                  <Badge key={index} variant="secondary">
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {investmentCriteria && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                What I Look For
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {investmentCriteria}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
