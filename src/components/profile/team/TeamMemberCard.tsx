import { User, Linkedin, Github, Twitter, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export interface TeamMember {
  name: string;
  role: string;
  background?: string;
  avatar_url?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  website_url?: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  isMobile?: boolean;
}

export function TeamMemberCard({ member, isMobile = false }: TeamMemberCardProps) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const socialLinks = [
    { url: member.linkedin_url, icon: Linkedin, label: "LinkedIn" },
    { url: member.github_url, icon: Github, label: "GitHub" },
    { url: member.twitter_url, icon: Twitter, label: "Twitter" },
    { url: member.website_url, icon: Globe, label: "Website" },
  ].filter((link) => link.url);

  // Format role text with separator if multiple parts
  const roleText = member.role;

  return (
    <div className="py-3">
      <div className="flex gap-4">
        {/* Large circular avatar on the left */}
        <Avatar className={isMobile ? "h-20 w-20" : "h-24 w-24"}>
          <AvatarImage src={member.avatar_url} alt={member.name} className="object-cover" />
          <AvatarFallback className="bg-muted text-muted-foreground text-lg">
            {initials || <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>

        {/* Content stacked on the right */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Name - prominent */}
          <p className="font-semibold text-base text-foreground">{member.name}</p>
          
          {/* Role */}
          {roleText && (
            <p className="text-sm text-muted-foreground mt-0.5">{roleText}</p>
          )}
          
          {/* Background description */}
          {member.background && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {member.background}
            </p>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 mt-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
