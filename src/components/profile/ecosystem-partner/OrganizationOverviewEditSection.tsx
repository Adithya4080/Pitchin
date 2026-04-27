import { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PartnershipEntry {
  name: string;
  type?: string;
}

interface OrganizationOverviewData {
  founded_year?: string | null;
  headquarters?: string | null;
  organization_type?: string | null;
  geographic_focus?: string[];
  mission_statement?: string | null;
  focus_areas?: string[];
  sectors?: string[];
  engagement_type?: string | null;
  program_duration?: string | null;
  equity_model?: string | null;
  partnerships?: PartnershipEntry[];
  startups_supported_count?: number | null;
  years_active?: number | null;
  global_alumni_reach?: string | null;
}

interface OrganizationOverviewEditSectionProps {
  data: OrganizationOverviewData;
  onChange: (data: OrganizationOverviewData) => void;
}

const organizationTypes = [
  { value: 'accelerator', label: 'Accelerator' },
  { value: 'incubator', label: 'Incubator' },
  { value: 'vc', label: 'Venture Capital' },
  { value: 'nonprofit', label: 'Non-Profit' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'university', label: 'University' },
  { value: 'government', label: 'Government' },
  { value: 'community', label: 'Community' },
  { value: 'hybrid', label: 'Hybrid' },
];

const engagementTypes = [
  'Cohort-based',
  'Application-based',
  'Rolling intake',
  'Invitation only',
];

const equityModels = [
  'Equity-based',
  'Non-equity',
  'Grant-based',
  'Mixed',
];

const partnershipTypes = [
  'Corporate',
  'University',
  'Government',
  'Ecosystem',
  'Media',
];

export function OrganizationOverviewEditSection({ data, onChange }: OrganizationOverviewEditSectionProps) {
  const [newFocusArea, setNewFocusArea] = useState('');
  const [newSector, setNewSector] = useState('');
  const [newRegion, setNewRegion] = useState('');
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerType, setNewPartnerType] = useState('');

  const updateField = <K extends keyof OrganizationOverviewData>(
    field: K,
    value: OrganizationOverviewData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const addTag = (field: 'focus_areas' | 'sectors' | 'geographic_focus', value: string) => {
    if (!value.trim()) return;
    const current = data[field] || [];
    if (!current.includes(value.trim())) {
      updateField(field, [...current, value.trim()]);
    }
  };

  const removeTag = (field: 'focus_areas' | 'sectors' | 'geographic_focus', index: number) => {
    const current = data[field] || [];
    updateField(field, current.filter((_, i) => i !== index));
  };

  const addPartnership = () => {
    if (!newPartnerName.trim()) return;
    const current = data.partnerships || [];
    updateField('partnerships', [...current, { name: newPartnerName.trim(), type: newPartnerType || undefined }]);
    setNewPartnerName('');
    setNewPartnerType('');
  };

  const removePartnership = (index: number) => {
    const current = data.partnerships || [];
    updateField('partnerships', current.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Institutional Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="founded_year">Founded Year</Label>
              <Input
                id="founded_year"
                placeholder="e.g., 2005"
                value={data.founded_year || ''}
                onChange={(e) => updateField('founded_year', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headquarters">Headquarters</Label>
              <Input
                id="headquarters"
                placeholder="e.g., San Francisco, USA"
                value={data.headquarters || ''}
                onChange={(e) => updateField('headquarters', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization_type">Organization Type</Label>
            <Select
              value={data.organization_type || ''}
              onValueChange={(value) => updateField('organization_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent>
                {organizationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Operating Regions</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add region (e.g., North America)"
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('geographic_focus', newRegion);
                    setNewRegion('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  addTag('geographic_focus', newRegion);
                  setNewRegion('');
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {data.geographic_focus && data.geographic_focus.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.geographic_focus.map((region, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {region}
                    <button
                      type="button"
                      onClick={() => removeTag('geographic_focus', index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mission Statement */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Mission & Ecosystem Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="mission_statement">Mission Statement</Label>
            <Textarea
              id="mission_statement"
              placeholder="Describe what your organization does and its role in the startup ecosystem (2-3 sentences)"
              value={data.mission_statement || ''}
              onChange={(e) => updateField('mission_statement', e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Keep this concise and institutional in tone.</p>
          </div>
        </CardContent>
      </Card>

      {/* Focus Areas & Sectors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Focus Areas & Sectors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Focus Areas</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Early-stage acceleration"
                value={newFocusArea}
                onChange={(e) => setNewFocusArea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('focus_areas', newFocusArea);
                    setNewFocusArea('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  addTag('focus_areas', newFocusArea);
                  setNewFocusArea('');
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {data.focus_areas && data.focus_areas.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.focus_areas.map((area, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {area}
                    <button
                      type="button"
                      onClick={() => removeTag('focus_areas', index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Sectors</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., SaaS, AI, FinTech"
                value={newSector}
                onChange={(e) => setNewSector(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('sectors', newSector);
                    setNewSector('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  addTag('sectors', newSector);
                  setNewSector('');
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {data.sectors && data.sectors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.sectors.map((sector, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {sector}
                    <button
                      type="button"
                      onClick={() => removeTag('sectors', index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Model */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Engagement Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Engagement Type</Label>
              <Select
                value={data.engagement_type || ''}
                onValueChange={(value) => updateField('engagement_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {engagementTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="program_duration">Program Duration</Label>
              <Input
                id="program_duration"
                placeholder="e.g., 3 months"
                value={data.program_duration || ''}
                onChange={(e) => updateField('program_duration', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Equity Model</Label>
              <Select
                value={data.equity_model || ''}
                onValueChange={(value) => updateField('equity_model', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {equityModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partnerships */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Partnerships & Network</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              placeholder="Partner name"
              value={newPartnerName}
              onChange={(e) => setNewPartnerName(e.target.value)}
              className="flex-1"
            />
            <Select value={newPartnerType} onValueChange={setNewPartnerType}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type (optional)" />
              </SelectTrigger>
              <SelectContent>
                {partnershipTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={addPartnership}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          {data.partnerships && data.partnerships.length > 0 && (
            <div className="space-y-2">
              {data.partnerships.map((partner, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <span className="text-sm">
                    {partner.name}
                    {partner.type && <span className="text-muted-foreground ml-1">({partner.type})</span>}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removePartnership(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legacy & Impact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Legacy & Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startups_supported_count">Startups Supported</Label>
              <Input
                id="startups_supported_count"
                type="number"
                placeholder="e.g., 500"
                value={data.startups_supported_count || ''}
                onChange={(e) => updateField('startups_supported_count', e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_active">Years Active</Label>
              <Input
                id="years_active"
                type="number"
                placeholder="e.g., 18"
                value={data.years_active || ''}
                onChange={(e) => updateField('years_active', e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="global_alumni_reach">Global Alumni Reach</Label>
              <Input
                id="global_alumni_reach"
                placeholder="e.g., 50+ countries"
                value={data.global_alumni_reach || ''}
                onChange={(e) => updateField('global_alumni_reach', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
