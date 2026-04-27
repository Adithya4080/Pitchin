import { useState, useRef } from "react";
import {
  Users,
  Plus,
  Trash2,
  User,
  Linkedin,
  Github,
  Twitter,
  Globe,
  ChevronDown,
  Upload,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TeamMember } from "./TeamMemberCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TeamEditSectionProps {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
  isMobile?: boolean;
}

export function TeamEditSection({
  members,
  onChange,
  isMobile = false,
}: TeamEditSectionProps) {
  const [expandedMembers, setExpandedMembers] = useState<Record<number, boolean>>({});
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const toggleMember = (index: number) => {
    setExpandedMembers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const addMember = () => {
    const newMember: TeamMember = {
      name: "",
      role: "",
      background: "",
      avatar_url: "",
      linkedin_url: "",
      github_url: "",
      twitter_url: "",
      website_url: "",
    };
    onChange([...members, newMember]);
    // Expand the newly added member
    setExpandedMembers((prev) => ({ ...prev, [members.length]: true }));
  };

  // Filter out incomplete members before saving (called by parent)
  // Members must have at least a name to be considered valid
  const getValidMembers = () => {
    return members.filter(member => member.name && member.name.trim() !== "");
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = members.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    onChange(updated);
  };

  const removeMember = (index: number) => {
    onChange(members.filter((_, i) => i !== index));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarUpload = async (index: number, file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setUploadingIndex(index);

    try {
      // Get current user
      const { data: { user } } = await (supabase as any).auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload images');
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload avatar (base64 until backend storage configured)
      const { error: uploadError } = await (supabase as any).storage
        .from('team-avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = await (supabase as any).storage
        .from('team-avatars')
        .getPublicUrl(fileName);

      // Update member with new avatar URL
      updateMember(index, 'avatar_url', publicUrl);
      toast.success('Avatar uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleFileInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(index, file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const content = (
    <div className="space-y-3">
      {members.map((member, index) => (
        <Collapsible
          key={index}
          open={expandedMembers[index] ?? false}
          onOpenChange={() => toggleMember(index)}
        >
          <div className={`p-3 rounded-lg border bg-muted/20 ${!member.name?.trim() ? 'border-destructive/50' : 'border-border/50'}`}>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar_url} alt={member.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(member.name) || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className={`text-sm font-medium ${!member.name?.trim() ? 'text-destructive' : 'text-foreground'}`}>
                    {member.name?.trim() || "⚠️ Name required"}
                  </p>
                  {member.role && (
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMember(index);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    expandedMembers[index] ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-4 space-y-4">
              {/* Avatar Upload Section */}
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar_url} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(member.name) || <User className="h-6 w-6" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      onChange={(e) => handleFileInputChange(index, e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRefs.current[index]?.click()}
                      disabled={uploadingIndex === index}
                      className="w-full sm:w-auto"
                    >
                      {uploadingIndex === index ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, GIF or WebP. Max 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`name-${index}`}
                    placeholder="John Doe"
                    value={member.name}
                    onChange={(e) => updateMember(index, "name", e.target.value)}
                    maxLength={100}
                    className={!member.name?.trim() ? "border-destructive/50" : ""}
                  />
                  {!member.name?.trim() && (
                    <p className="text-xs text-destructive">Name is required for member to be saved</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`role-${index}`}>Role / Title</Label>
                  <Input
                    id={`role-${index}`}
                    placeholder="Co-Founder, CTO"
                    value={member.role}
                    onChange={(e) => updateMember(index, "role", e.target.value)}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`background-${index}`}>
                  Professional Background (1-2 lines)
                </Label>
                <Textarea
                  id={`background-${index}`}
                  placeholder="10+ years in software engineering. Previously at Google, Meta."
                  value={member.background || ""}
                  onChange={(e) => updateMember(index, "background", e.target.value)}
                  rows={2}
                  maxLength={200}
                />
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">
                  Social Links (Optional)
                </Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="LinkedIn URL"
                      value={member.linkedin_url || ""}
                      onChange={(e) =>
                        updateMember(index, "linkedin_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="GitHub URL"
                      value={member.github_url || ""}
                      onChange={(e) =>
                        updateMember(index, "github_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="Twitter/X URL"
                      value={member.twitter_url || ""}
                      onChange={(e) =>
                        updateMember(index, "twitter_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="Website URL"
                      value={member.website_url || ""}
                      onChange={(e) =>
                        updateMember(index, "website_url", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}

      <Button variant="outline" size="sm" onClick={addMember} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Team Member
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="bg-card px-4 py-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Team
        </h3>
        {content}
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Team
        </h3>
        {content}
      </CardContent>
    </Card>
  );
}
