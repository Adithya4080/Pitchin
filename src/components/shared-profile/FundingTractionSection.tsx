import { Wallet, Target, Handshake, DollarSign, Users, Activity, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import GlassCard from "./GlassCard";
import MetricCard from "./MetricCard";
import SectionReveal from "./SectionReveal";
import SectionHeading from "./SectionHeading";
import type { ParsedProfile } from "@/types/profile";

interface FundingTractionSectionProps {
  profile: ParsedProfile;
}

function metricIcon(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (l.includes("mrr") || l.includes("arr") || l.includes("revenue")) return DollarSign;
  if (l.includes("user")) return Users;
  if (l.includes("dau") || l.includes("mau") || l.includes("retention")) return Activity;
  return TrendingUp;
}

interface CardData {
  label: string;
  value: string;
  growth?: string;
  icon: LucideIcon;
  gradient: string;
}

export default function FundingTractionSection({ profile }: FundingTractionSectionProps) {
  const { fundingData, tractionData } = profile;
  const hasFunding = fundingData && Object.keys(fundingData).length > 0;
  const hasTraction = (tractionData?.metrics?.length ?? 0) > 0;

  if (!hasFunding && !hasTraction) return null;

  const fundingCards: CardData[] = [
    fundingData.amount_raised && {
      label: "Raised",
      value: fundingData.amount_raised,
      icon: Wallet,
      gradient: "from-[#53bbff] to-[#3b82f6]",
    },
    fundingData.target_raise && {
      label: "Target Raise",
      value: fundingData.target_raise,
      icon: Target,
      gradient: "from-[#a855f7] to-[#7c3aed]",
    },
    fundingData.investors?.length && {
      label: "Investors",
      value: String(fundingData.investors.length),
      icon: Handshake,
      gradient: "from-[#ec4899] to-[#a855f7]",
    },
  ].filter((c): c is CardData => Boolean(c));

  const tractionCards: CardData[] = (tractionData.metrics ?? []).map((m) => ({
    label: m.label,
    value: m.value,
    growth: m.growth,
    icon: metricIcon(m.label),
    gradient: "from-[#22d3ee] to-[#53bbff]",
  }));

  const allCards = [...fundingCards, ...tractionCards];

  return (
    <section id="funding" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionReveal>
        <SectionHeading
          icon={TrendingUp}
          title="Funding & Traction"
          subtitle={fundingData.stage ? `Currently raising: ${fundingData.stage}` : undefined}
        />
      </SectionReveal>

      {allCards.length > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {allCards.map((card, i) => (
            <SectionReveal key={`${card.label}-${i}`} delay={i * 0.05}>
              <MetricCard {...card} />
            </SectionReveal>
          ))}
        </div>
      )}

      {tractionData.description && (
        <SectionReveal delay={0.1}>
          <GlassCard className="mb-6 p-6" tilt={false}>
            <p className="text-sm leading-relaxed text-slate-600">{tractionData.description}</p>
          </GlassCard>
        </SectionReveal>
      )}

      {(fundingData.use_of_funds || (fundingData.investors && fundingData.investors.length > 0)) && (
        <SectionReveal delay={0.15}>
          <GlassCard className="p-6" tilt={false}>
            {fundingData.use_of_funds && (
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Use of Funds
                </p>
                <p className="text-sm leading-relaxed text-slate-600">{fundingData.use_of_funds}</p>
              </div>
            )}
            {fundingData.investors && fundingData.investors.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Investors
                </p>
                <div className="flex flex-wrap gap-2">
                  {fundingData.investors.map((inv) => (
                    <span
                      key={inv}
                      className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 text-xs text-slate-600"
                    >
                      {inv}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </SectionReveal>
      )}
    </section>
  );
}
