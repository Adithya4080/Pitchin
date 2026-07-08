import { BadgeCheck, Award } from 'lucide-react';

type Props = {
  isVerified: boolean;
  isTopRated: boolean;
  accent: string;
};

/**
 * Certifications — only shows badges that are actually true on the provider
 * record. is_verified / is_top_rated are admin-controlled (trust & safety),
 * not provider-editable, so this section can't be gamed by the provider.
 */
export function CertificationsGrid({ isVerified, isTopRated, accent }: Props) {
  const items: { label: string; icon: typeof BadgeCheck }[] = [];
  if (isVerified) items.push({ label: 'Business Verified', icon: BadgeCheck });
  if (isTopRated) items.push({ label: 'Top Rated Partner', icon: Award });

  if (items.length === 0) return null;

  return (
    <div className="pd-section">
      <p className="pd-section-title">Certifications</p>
      <div className="pd-cert-grid">
        {items.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="pd-cert-item">
              <div className="pd-process-icon" style={{ background: `${accent}14` }}>
                <Icon size={15} style={{ color: accent }} />
              </div>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: '#111827', margin: 0 }}>{c.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}