import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Loader2, Camera, User, MapPin, Mail, 
  Linkedin, Twitter, Globe, FolderOpen
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactNode, useState } from 'react';

interface MobileEditProfileProps {
  fullName: string;
  setFullName: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (value: string) => void;
  twitterUrl: string;
  setTwitterUrl: (value: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (value: string) => void;
  portfolioUrl: string;
  setPortfolioUrl: (value: string) => void;
  avatarPreview: string | null;
  bannerPreview: string | null;
  onAvatarSelect: (file: File) => void;
  onBannerSelect: (file: File) => void;
  roleSection?: ReactNode;
  roleTabLabel?: string;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

type TabType = 'profile' | 'social' | 'role';

export function MobileEditProfile({
  fullName,
  setFullName,
  bio,
  setBio,
  location,
  setLocation,
  contactEmail,
  setContactEmail,
  linkedinUrl,
  setLinkedinUrl,
  twitterUrl,
  setTwitterUrl,
  websiteUrl,
  setWebsiteUrl,
  portfolioUrl,
  setPortfolioUrl,
  avatarPreview,
  bannerPreview,
  onAvatarSelect,
  onBannerSelect,
  roleSection,
  roleTabLabel,
  isSaving,
  onSave,
  onCancel,
}: MobileEditProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const initials = fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'avatar') {
        onAvatarSelect(file);
      } else {
        onBannerSelect(file);
      }
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'social' as TabType, label: 'Links', icon: Globe },
    ...(roleSection ? [{ id: 'role' as TabType, label: roleTabLabel || 'Role', icon: FolderOpen }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card backdrop-blur-sm">
        <button 
          onClick={onCancel}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <h1 className="font-semibold text-foreground">Edit Profile</h1>
        <Button 
          size="sm" 
          onClick={onSave}
          disabled={isSaving}
          className="flash-gradient text-primary-foreground"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border/50 bg-card">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id 
                ? 'text-primary' 
                : 'text-muted-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 pb-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                {/* Avatar & Banner Section */}
                <div className="space-y-4">
                  {/* Banner */}
                  <div className="relative">
                    <div 
                      className="h-24 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-accent/20 overflow-hidden"
                      style={bannerPreview ? { 
                        backgroundImage: `url(${bannerPreview})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      } : undefined}
                    >
                      <label className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="h-6 w-6 text-foreground" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileSelect(e, 'banner')}
                        />
                      </label>
                    </div>
                    
                    {/* Avatar overlapping banner */}
                    <div className="absolute -bottom-8 left-4">
                      <div className="relative">
                        <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                          <AvatarImage src={avatarPreview || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <label className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera className="h-5 w-5 text-foreground" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileSelect(e, 'avatar')}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for avatar overlap */}
                  <div className="h-6" />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      maxLength={100}
                      className="bg-card border-border/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      About
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="A short bio about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={280}
                      rows={4}
                      className="bg-card border-border/50 resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {bio.length}/280
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      maxLength={100}
                      className="bg-card border-border/50"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Contact Email
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="bg-card border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Visible on your public profile
                  </p>
                </div>

                <div className="h-px bg-border/50 my-4" />

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-sm font-medium flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="bg-card border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-sm font-medium flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/username"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    className="bg-card border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="bg-card border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="text-sm font-medium flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    Portfolio
                  </Label>
                  <Input
                    id="portfolio"
                    placeholder="https://yourportfolio.com"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="bg-card border-border/50"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'role' && roleSection && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                {roleSection}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
