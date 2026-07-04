import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ icon: Icon, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col items-center gap-3 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-900/10 bg-white/70 backdrop-blur">
        <Icon className="h-5 w-5 text-[#2563eb]" />
      </div>
      <h2 className="font-display section-heading text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && <p className="max-w-xl text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
