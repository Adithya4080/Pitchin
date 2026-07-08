import { Star, Users, Rocket, ShieldCheck, TrendingUp, Award } from 'lucide-react';
import type { ServiceProvider } from '@/api/services';

type Props = {
  provider: Pick<
    ServiceProvider,
    'rating' | 'review_count' | 'startups_served' | 'is_verified' | 'is_top_rated' | 'created_at'
  >;
  accent: string;
};

/**
 * Trust snapshot row — every stat here comes straight from real provider
 * fields (rating, reviews, verification status, member-since year). Nothing
 * here is fabricated placeholder copy.
 */
export function TrustSnapshot({ provider, accent }: Props) {
  const memberSince = provider.created_at ? new Date(provider.created_at).getFullYear() : null;

  const stats: { icon: typeof Star; value: string; label: string }[] = [];
  if (Number(provider.rating) > 0) {
    stats.push({ icon: Star, value: `${provider.rating}`, label: 'Average rating' });
  }
  stats.push({ icon: Users, value: `${provider.review_count}`, label: 'Reviews' });
  if (provider.startups_served > 0) {
    stats.push({ icon: Rocket, value: `${provider.startups_served}+`, label: 'Startups served' });
  }
  if (provider.is_verified) {
    stats.push({ icon: ShieldCheck, value: 'Verified', label: 'Business status' });
  }
  if (provider.is_top_rated) {
    stats.push({ icon: TrendingUp, value: 'Top rated', label: 'On PitchIn' });
  }
  if (memberSince) {
    stats.push({ icon: Award, value: `${memberSince}`, label: 'Member since' });
  }

  if (stats.length === 0) return null;

  return (
    <div className="pd-section">
      <p className="pd-section-title">Trust snapshot</p>
      <div className="pd-trust-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="pd-trust-item">
              <Icon size={16} style={{ color: accent }} />
              <p className="pd-trust-val">{s.value}</p>
              <p className="pd-trust-label">{s.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}