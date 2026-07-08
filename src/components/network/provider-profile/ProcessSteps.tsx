import { Compass, ClipboardList, Lightbulb, Wrench } from 'lucide-react';

const STEPS = [
  { title: 'Discovery', description: 'Share your requirement', icon: Compass },
  { title: 'Proposal', description: 'Get a scoped quote', icon: ClipboardList },
  { title: 'Kickoff', description: 'Align on plan & timeline', icon: Lightbulb },
  { title: 'Delivery', description: 'Work gets done, with updates', icon: Wrench },
] as const;

type Props = {
  accent: string;
};

/** Generic "how it works" steps — descriptive marketing copy, not per-provider data. */
export function ProcessSteps({ accent }: Props) {
  return (
    <div className="pd-section">
      <p className="pd-section-title">How it works</p>
      <div className="pd-process-grid">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="pd-process-step">
              <div className="pd-process-icon">
                <Icon size={15} style={{ color: accent }} />
              </div>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', margin: 0 }}>{step.title}</p>
                <p style={{ fontSize: 11.5, color: '#9ca3af', margin: '2px 0 0', lineHeight: 1.4 }}>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}