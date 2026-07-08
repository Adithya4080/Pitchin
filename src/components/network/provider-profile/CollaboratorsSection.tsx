import { Building2 } from 'lucide-react';
import type { ProviderCollaboratorItem } from '@/api/services';

type Props = {
  collaborators: ProviderCollaboratorItem[];
};

/** "Trusted by" logo strip — real companies/brands the provider has worked with. */
export function CollaboratorsSection({ collaborators }: Props) {
  if (!collaborators || collaborators.length === 0) return null;

  return (
    <div className="pd-section">
      <p className="pd-section-title">Trusted by</p>
      <div className="pd-collab-strip">
        {collaborators.map((c) => {
          const content = (
            <>
              {c.logo_url ? (
                <img src={c.logo_url} alt={c.name} className="pd-collab-logo" />
              ) : (
                <div className="pd-collab-logo pd-collab-logo-fallback">
                  <Building2 size={16} />
                </div>
              )}
              <span className="pd-collab-name">{c.name}</span>
            </>
          );
          return c.website ? (
            <a key={c.id} href={c.website} target="_blank" rel="noopener noreferrer" className="pd-collab-item">
              {content}
            </a>
          ) : (
            <div key={c.id} className="pd-collab-item">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}