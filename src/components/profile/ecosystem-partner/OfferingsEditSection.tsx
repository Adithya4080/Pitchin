import { 
  Heart, Building, Banknote, Users, GraduationCap, Coins,
  Handshake, Megaphone, Target, Lightbulb, BookOpen, Wrench
} from 'lucide-react';

interface OfferingsEditSectionProps {
  offerings: string[];
  onChange: (offerings: string[]) => void;
}

const allOfferings = [
  { key: 'mentorship', label: 'Mentorship', icon: Heart },
  { key: 'incubation', label: 'Incubation', icon: Building },
  { key: 'grants', label: 'Grants', icon: Banknote },
  { key: 'network', label: 'Network Access', icon: Users },
  { key: 'workshops', label: 'Workshops', icon: GraduationCap },
  { key: 'funding', label: 'Funding', icon: Coins },
  { key: 'partnerships', label: 'Partnerships', icon: Handshake },
  { key: 'marketing', label: 'Marketing Support', icon: Megaphone },
  { key: 'strategy', label: 'Strategy', icon: Target },
  { key: 'innovation', label: 'Innovation', icon: Lightbulb },
  { key: 'resources', label: 'Resources', icon: BookOpen },
  { key: 'technical', label: 'Technical Support', icon: Wrench },
];

export function OfferingsEditSection({ offerings, onChange }: OfferingsEditSectionProps) {
  const toggle = (key: string) => {
    if (offerings.includes(key)) {
      onChange(offerings.filter(o => o !== key));
    } else {
      onChange([...offerings, key]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground mb-1">What We Offer</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Select the offerings your organization provides. Tap to toggle.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {allOfferings.map(({ key, label, icon: Icon }) => {
          const selected = offerings.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all text-sm font-medium
                ${selected
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'bg-card border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
                }
              `}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {offerings.length} offering{offerings.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  );
}
