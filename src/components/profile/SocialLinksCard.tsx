import { Linkedin, Twitter, Globe, FolderOpen, Link2, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SocialLinksCardProps {
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  websiteUrl?: string | null;
  portfolioUrl?: string | null;
  contactEmail?: string | null;
}

export function SocialLinksCard({ linkedinUrl, twitterUrl, websiteUrl, portfolioUrl, contactEmail }: SocialLinksCardProps) {
  const hasSocialLinks = linkedinUrl || twitterUrl || websiteUrl || portfolioUrl;
  const hasContent = hasSocialLinks || contactEmail;

  if (!hasContent) {
    return null;
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-6 space-y-5">
        {/* Contact Email */}
        {contactEmail && (
          <div>
            <h3 className="text-base font-bold text-foreground mb-3">
              Contact
            </h3>
            <a 
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors"
            >
              <Mail className="h-6 w-6 text-primary" />
              <span className="text-base text-foreground">{contactEmail}</span>
            </a>
          </div>
        )}

        {/* Social Links */}
        {hasSocialLinks && (
          <div>
            <h3 className="text-base font-bold text-foreground mb-3">
              Links
            </h3>
            <div className="space-y-2">
              {linkedinUrl && (
                <a 
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors"
                >
                  <Linkedin className="h-6 w-6 text-[#0A66C2]" />
                  <span className="text-base text-foreground">LinkedIn Profile</span>
                </a>
              )}

              {twitterUrl && (
                <a 
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors"
                >
                  <Twitter className="h-6 w-6 text-foreground" />
                  <span className="text-base text-foreground">Twitter / X</span>
                </a>
              )}

              {websiteUrl && (
                <a 
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors"
                >
                  <Globe className="h-6 w-6 text-primary" />
                  <span className="text-base text-foreground">Website</span>
                </a>
              )}

              {portfolioUrl && (
                <a 
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors"
                >
                  <FolderOpen className="h-6 w-6 text-primary" />
                  <span className="text-base text-foreground">Portfolio</span>
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
