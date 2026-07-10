import stepOneImg from '@/assets/seeking-picture-one.jpeg';
import stepTwoImg from '@/assets/seeking-picture-two.jpeg';
import stepThreeImg from '@/assets/seeking-picture-three.jpeg';

type Step = {
  number: string;
  badgeBg: string;
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  titleLine2Color: string;
  description: string;
  image: string;
  imageAlt: string;
};

const STEPS: Step[] = [
  {
    number: '01',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-600',
    titleLine1: 'List Your Startup &',
    titleLine2: 'Seek Services',
    titleLine2Color: 'text-blue-600',
    description:
      'Create a professional profile for your startup, showcase your vision, and connect with the right services to grow faster.',
    image: stepOneImg,
    imageAlt: 'Founder building a startup profile on PitchIn',
  },
  {
    number: '02',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-600',
    titleLine1: 'Find the Services',
    titleLine2: 'You Need',
    titleLine2Color: 'text-emerald-600',
    description:
      'Explore a wide range of trusted services across every domain of your startup journey and find the perfect match for your needs.',
    image: stepTwoImg,
    imageAlt: 'Browsing trusted service categories on PitchIn',
  },
  {
    number: '03',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-600',
    titleLine1: 'Collaborate & Partner with',
    titleLine2: 'the Right People',
    titleLine2Color: 'text-amber-500',
    description:
      'Connect, communicate, and collaborate with investors, consultants, incubators, and partners who can help you scale and succeed.',
    image: stepThreeImg,
    imageAlt: 'Founder shaking hands with a partner after connecting on PitchIn',
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <div
      className="w-full sm:w-[420px] rounded-2xl border border-border/80 bg-white p-6 sm:p-7 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.12)]"
      style={{
        marginLeft: `${index * 0}px`,
      }}
    >
      <div className="flex items-center gap-5">
        <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
            src={step.image}
            alt={step.imageAlt}
            loading="lazy"
            className="h-full w-full object-contain p-2"
          />
        </div>

        <div className="min-w-0 flex-1">
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${step.badgeBg} ${step.badgeText}`}
          >
            {step.number}
          </span>
          <h3 className="mt-2 text-[16px] sm:text-[17px] font-bold leading-snug tracking-tight text-foreground">
            {step.titleLine1} <span className={step.titleLine2Color}>{step.titleLine2}</span>
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-20 overflow-hidden">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <div className="mx-auto max-w-xl text-center mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            How It Works
          </span>
          <h2 className="mt-2 text-[24px] sm:text-[28px] font-medium leading-tight tracking-tight text-foreground">
            Three steps from idea to opportunity
          </h2>
        </div>

        {/* Staircase */}
        <div className="flex flex-col items-start gap-6">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              style={{
                marginLeft: `${index * 48}px`,
                marginTop: index === 0 ? 0 : '-8px',
              }}
              className="w-full sm:w-auto"
            >
              <StepCard step={step} index={index} />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}