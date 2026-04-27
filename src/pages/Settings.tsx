import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Shield, Bell, Settings2, HelpCircle, 
  ChevronRight, Globe, Moon, Sun, Monitor, LogOut, Trash2,
  Mail, Lock, UserCog, Eye, FileText, MessageSquare, Info,
  Tag, AlertTriangle, Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfileShare } from '@/hooks/useProfileShare';
import { cn } from '@/lib/utils';

type SettingsSection = 'account' | 'profile' | 'privacy' | 'notifications' | 'preferences' | 'support';

const sectionConfig = {
  account: { icon: User, label: 'Account Settings' },
  profile: { icon: UserCog, label: 'Profile Settings' },
  privacy: { icon: Shield, label: 'Privacy & Security' },
  notifications: { icon: Bell, label: 'Notifications' },
  preferences: { icon: Settings2, label: 'Preferences' },
  support: { icon: HelpCircle, label: 'Support & Legal' },
};

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: userRole } = useUserRole(user?.id);
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');

  // Notification toggles (placeholder state)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [platformUpdates, setPlatformUpdates] = useState(true);
  const [opportunityAlerts, setOpportunityAlerts] = useState(false);
  const [announcements, setAnnouncements] = useState(true);

  // Theme preference
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');

  // Profile language
  const [profileLanguage, setProfileLanguage] = useState('en');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleLabel = (role: string | undefined) => {
    switch (role) {
      case 'innovator': return 'Innovator';
      case 'startup': return 'Startup';
      case 'investor': return 'Investor';
      case 'consultant': return 'Ecosystem Partner';
      default: return 'Not set';
    }
  };

  // Account Settings Section
  const AccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
        <div className="space-y-4">
          {/* Full Name */}
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div>
              <p className="text-sm font-medium text-foreground">Full Name</p>
              <p className="text-sm text-muted-foreground">{user?.full_name || 'Not set'}</p>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Read only</span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Email Address</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Password</p>
                <p className="text-sm text-muted-foreground">••••••••</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Change
            </Button>
          </div>

          {/* Account Role */}
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <UserCog className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Account Role</p>
                <p className="text-sm text-muted-foreground">{getRoleLabel(userRole?.role)}</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div>
              <p className="text-sm font-medium text-foreground">Account Status</p>
              <p className="text-sm text-success">Active</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-success" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Danger Zone */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Actions</h3>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign out
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground opacity-50 cursor-not-allowed"
            disabled
          >
            <Trash2 className="h-4 w-4 mr-3" />
            Delete Account
            <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded">Coming soon</span>
          </Button>
        </div>
      </div>
    </div>
  );

  // Profile Settings Section
  const ProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Profile Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Default Profile Language</p>
                <p className="text-xs text-muted-foreground">Language used for your profile content</p>
              </div>
            </div>
            <Select value={profileLanguage} onValueChange={setProfileLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  // Check if user can share profile (innovator or startup)
  const canShareProfile = userRole?.role === 'innovator' || userRole?.role === 'startup';
  
  // Profile sharing hook
  const {
    shareSettings,
    isEnabled: isShareEnabled,
    hasShareLink,
    updateShareSettings,
    regenerateToken,
    isRegenerating,
    isUpdating: isShareUpdating,
    copyToClipboard,
  } = useProfileShare(user?.id);

  // Privacy & Security Section
  const PrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Privacy Controls</h3>
        <div className="space-y-4">
          {/* Profile Link Visibility - Only for innovator/startup */}
          {canShareProfile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Profile link visibility</p>
                    <p className="text-xs text-muted-foreground">
                      {isShareEnabled ? 'Your profile is accessible via share link' : 'Share link is disabled'}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={isShareEnabled} 
                  onCheckedChange={(checked) => updateShareSettings({ isEnabled: checked })}
                  disabled={isShareUpdating || !hasShareLink}
                />
              </div>

              {/* Generate/Regenerate Link */}
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Share link</p>
                    <p className="text-xs text-muted-foreground">
                      {hasShareLink ? 'Regenerate to invalidate old links' : 'Generate a new share link'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => regenerateToken()}
                  disabled={isRegenerating}
                >
                  {isRegenerating ? 'Generating...' : hasShareLink ? 'Regenerate' : 'Generate'}
                </Button>
              </div>

              {/* Copy Link */}
              {hasShareLink && (
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Copy share link</p>
                      <p className="text-xs text-muted-foreground">Share your profile with others</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard()}
                    disabled={!isShareEnabled}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Link Visibility</p>
                  <p className="text-xs text-muted-foreground">Profile sharing is available for Innovators and Startups</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Not available</span>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Data & Privacy</h3>
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">How we use your data</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Pitchin collects and processes your data to provide personalized recommendations, 
                  improve platform features, and connect you with relevant opportunities. Your data 
                  is never sold to third parties. For more details, please review our Privacy Policy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Notifications Section
  const NotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Platform Updates</p>
              <p className="text-xs text-muted-foreground">New features and improvements</p>
            </div>
            <Switch checked={platformUpdates} onCheckedChange={setPlatformUpdates} />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Opportunity Alerts</p>
              <p className="text-xs text-muted-foreground">Matching pitches and connections</p>
            </div>
            <Switch checked={opportunityAlerts} onCheckedChange={setOpportunityAlerts} />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Announcement Highlights</p>
              <p className="text-xs text-muted-foreground">Important platform announcements</p>
            </div>
            <Switch checked={announcements} onCheckedChange={setAnnouncements} />
          </div>
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-xs">These toggles are placeholders. Notification preferences will be saved in a future update.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Preferences Section
  const PreferencesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Theme</p>
            <RadioGroup value={theme} onValueChange={(value: 'system' | 'light' | 'dark') => setTheme(value)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                  <Monitor className="h-4 w-4" />
                  System
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                  <Sun className="h-4 w-4" />
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  Dark
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Content Interests</h3>
        <div className="flex items-center gap-3 py-3">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Interest Tags</p>
            <p className="text-xs text-muted-foreground">Customize your feed based on interests</p>
          </div>
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Coming soon</span>
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-xs">Theme and interest preferences are placeholders. These settings will be saved in a future update.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Support & Legal Section
  const SupportSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Get Help</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4" disabled>
            <div className="flex items-center gap-3">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Help Center</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4" disabled>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Report an Issue</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Legal</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4" disabled>
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Terms of Service</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4" disabled>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Privacy Policy</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">About</h3>
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="py-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Pitchin</p>
              <p className="text-xs text-muted-foreground mt-1">Version 1.0.0</p>
              <p className="text-xs text-muted-foreground mt-3">
                Connecting innovators, startups, investors, and ecosystem partners worldwide.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSection = (section: SettingsSection) => {
    switch (section) {
      case 'account': return <AccountSection />;
      case 'profile': return <ProfileSection />;
      case 'privacy': return <PrivacySection />;
      case 'notifications': return <NotificationsSection />;
      case 'preferences': return <PreferencesSection />;
      case 'support': return <SupportSection />;
      default: return <AccountSection />;
    }
  };

  // Mobile Layout with Collapsible Headings
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 bg-background border-b border-border/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          </div>
        </div>

        {/* Mobile Collapsible Sections */}
        <div className="divide-y divide-border/30">
          {(Object.keys(sectionConfig) as SettingsSection[]).map((section) => {
            const config = sectionConfig[section];
            const Icon = config.icon;
            return (
              <Collapsible key={section} className="w-full">
                <CollapsibleTrigger className="w-full px-4 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{config.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-6 pt-2">
                  {renderSection(section)}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop Layout with Sidebar Navigation
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          </div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar Navigation */}
          <div className="w-64 shrink-0">
            <nav className="space-y-1 sticky top-24">
              {(Object.keys(sectionConfig) as SettingsSection[]).map((section) => {
                const config = sectionConfig[section];
                const Icon = config.icon;
                const isActive = activeSection === section;
                return (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {config.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Card className="border-border/50">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-3">
                  {(() => {
                    const Icon = sectionConfig[activeSection].icon;
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                  {sectionConfig[activeSection].label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderSection(activeSection)}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
