import type { ServiceSubCategory } from '@/api/services';

type Props = {
  subCategories: ServiceSubCategory[];
};

/** Services grid — the sub-categories the provider selected/created in their dashboard. */
export function ServicesGrid({ subCategories }: Props) {
  if (!subCategories || subCategories.length === 0) return null;

  return (
    <div className="pd-section">
      <p className="pd-section-title">Services offered</p>
      <div className="pd-service-grid">
        {subCategories.map((sc) => (
          <div key={sc.id} className="pd-service-card">
            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{sc.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}