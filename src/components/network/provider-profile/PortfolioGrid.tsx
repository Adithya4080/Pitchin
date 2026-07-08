import { ExternalLink, ImageIcon } from 'lucide-react';
import type { ProviderMediaItem } from '@/api/services';

type Props = {
  media: ProviderMediaItem[];
  accent: string;
};

function ProjectCardInner({ m, accent }: { m: ProviderMediaItem; accent: string }) {
  return (
    <>
      <div className="pd-project-image">
        {m.image_url ? (
          <img src={m.image_url} alt={m.title || 'Work sample'} />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={20} style={{ color: '#d1d5db' }} />
          </div>
        )}
      </div>
      {(m.title || m.description || m.link) && (
        <div className="pd-project-body">
          {m.title && <p className="pd-project-title">{m.title}</p>}
          {m.description && <p className="pd-project-desc">{m.description}</p>}
          {m.link && (
            <span className="pd-project-link" style={{ color: accent }}>
              View project <ExternalLink size={11} />
            </span>
          )}
        </div>
      )}
    </>
  );
}

/**
 * Past work & collaborations — real project showcases the provider added in
 * their dashboard: an image, a title, a short description, and (optionally)
 * a live link to the actual project / case study.
 */
export function PortfolioGrid({ media, accent }: Props) {
  if (!media || media.length === 0) return null;

  return (
    <div className="pd-section">
      <p className="pd-section-title">Past work & collaborations</p>
      <div className="pd-project-grid">
        {media.map((m) =>
          m.link ? (
            <a key={m.id} className="pd-project-card" href={m.link} target="_blank" rel="noopener noreferrer">
              <ProjectCardInner m={m} accent={accent} />
            </a>
          ) : (
            <div key={m.id} className="pd-project-card">
              <ProjectCardInner m={m} accent={accent} />
            </div>
          )
        )}
      </div>
    </div>
  );
}