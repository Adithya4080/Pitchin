type Props = {
  stageFocusLabel: string;
};

/** Which startup stage the provider focuses on — set by the provider, not a fabricated industry list. */
export function BestFitFor({ stageFocusLabel }: Props) {
  if (!stageFocusLabel) return null;

  return (
    <div className="pd-section">
      <p className="pd-section-title">Best fit for</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        <span className="pd-tag">{stageFocusLabel}</span>
      </div>
    </div>
  );
}