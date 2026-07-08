type Props = {
  tags: string[];
};

/** Expertise / skill tags — set by the provider themselves in their dashboard. */
export function ExpertiseSection({ tags }: Props) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="pd-section">
      <p className="pd-section-title">Expertise</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {tags.map((tag) => (
          <span key={tag} className="pd-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}