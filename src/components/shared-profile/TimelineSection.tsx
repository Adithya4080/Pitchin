import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import SectionReveal from "./SectionReveal";
import SectionHeading from "./SectionHeading";
import type { JourneyMilestone } from "@/types/profile";

interface TimelineSectionProps {
  items: JourneyMilestone[];
}

export default function TimelineSection({ items }: TimelineSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id="journey" className="relative mx-auto max-w-3xl px-6 py-24">
      <SectionReveal>
        <SectionHeading icon={Clock} title="Company Journey" />
      </SectionReveal>

      <div className="relative">
        <div className="absolute bottom-2 left-[15px] top-2 w-px bg-gradient-to-b from-[#53bbff] via-[#a855f7] to-transparent sm:left-[19px]" />
        <div className="space-y-10">
          {items.map((entry, i) => (
            <motion.div
              key={`${entry.year}-${i}`}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative flex gap-6 pl-2"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0.4 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: i * 0.05 + 0.1 }}
                className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#53bbff]/50 bg-white shadow-[0_0_14px_rgba(83,187,255,0.35)] sm:h-10 sm:w-10"
              >
                <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#53bbff] to-[#a855f7]" />
              </motion.div>
              <div className="pb-2">
                <p className="mb-1 text-xs font-semibold text-[#2563eb]">{entry.year}</p>
                <p className="text-sm leading-relaxed text-slate-600">{entry.milestone}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
