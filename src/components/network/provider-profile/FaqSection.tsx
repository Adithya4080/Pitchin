import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ProviderFAQItem } from '@/api/services';

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pd-faq-item">
      <button className="pd-faq-question" onClick={() => setOpen((o) => !o)}>
        {question}
        <ChevronDown
          size={15}
          style={{ color: '#9ca3af', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}
        />
      </button>
      {open && <p className="pd-faq-answer">{answer}</p>}
    </div>
  );
}

type Props = {
  /** Real FAQs the provider wrote themselves in their dashboard, if any. */
  faqs?: ProviderFAQItem[];
  /** Used only as a fallback when the provider hasn't written their own FAQs yet. */
  fallback: { question: string; answer: string }[];
};

export function FaqSection({ faqs, fallback }: Props) {
  const items = faqs && faqs.length > 0 ? faqs : fallback;
  if (items.length === 0) return null;

  return (
    <div className="pd-section">
      <p className="pd-section-title">Frequently asked</p>
      <div>
        {items.map((f, i) => (
          <FaqItem key={i} question={f.question} answer={f.answer} />
        ))}
      </div>
    </div>
  );
}