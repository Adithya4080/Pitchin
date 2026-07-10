import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, User, Handshake, Bell, Users, Sprout, Rocket, ClipboardList } from 'lucide-react';

type Row = { icon: React.ReactNode; label: string; sub: string; to: string };

const NETWORKING_ROWS: Row[] = [
  { icon: <TrendingUp className="h-[18px] w-[18px]" />, label: 'Investors & VC Firms', sub: 'Meet investors',       to: '/network?tab=investor' },
  { icon: <User className="h-[18px] w-[18px]" />,       label: 'Mentors',              sub: 'Get guidance',         to: '/network?tab=mentor' },
  { icon: <Handshake className="h-[18px] w-[18px]" />,  label: 'Partners',             sub: 'Find collaborators',   to: '/network?tab=partner' },
  { icon: <Bell className="h-[18px] w-[18px]" />,       label: 'Accelerators',         sub: 'Join programs',        to: '/network?tab=accelerator' },
  { icon: <Users className="h-[18px] w-[18px]" />,      label: 'Communities',          sub: 'Be part of groups',    to: '/network?tab=community' },
];

const SURVEY_ROWS: Row[] = [
  { icon: <Sprout className="h-[18px] w-[18px]" />,        label: 'For Early Stage Startups', sub: '', to: '/coming-soon' },
  { icon: <TrendingUp className="h-[18px] w-[18px]" />,    label: 'For Growth Stage Startups', sub: '', to: '/coming-soon' },
  { icon: <Rocket className="h-[18px] w-[18px]" />,        label: 'For Scale Stage Startups', sub: '', to: '/coming-soon' },
  { icon: <User className="h-[18px] w-[18px]" />,          label: 'Networking Group Survey', sub: '', to: '/coming-soon' },
  { icon: <ClipboardList className="h-[18px] w-[18px]" />, label: 'Community Duties Survey', sub: '', to: '/coming-soon' },
];

function RowLink({ row }: { row: Row }) {
  return (
    <Link to={row.to} className="group flex items-start gap-2.5">
      <span className="text-gray-400 group-hover:text-blue-600 transition-colors mt-0.5 shrink-0">
        {row.icon}
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-gray-900 leading-snug">{row.label}</p>
        {row.sub && <p className="text-[12px] text-gray-400 mt-0.5">{row.sub}</p>}
      </div>
    </Link>
  );
}

function SectionCard({
  title, subtitle, viewAllLabel, viewAllTo, rows,
}: {
  title: string; subtitle: string; viewAllLabel: string; viewAllTo: string; rows: Row[];
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">{title}</h2>
          <p className="text-[13px] text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <Link
          to={viewAllTo}
          className="hidden md:inline-flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:text-blue-500 transition-colors shrink-0 mt-1"
        >
          {viewAllLabel} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-5 border-t border-gray-100 pt-5">
        {rows.map((row) => (
          <RowLink key={row.label} row={row} />
        ))}
      </div>
      <div className="flex md:hidden justify-center mt-5">
        <Link to={viewAllTo} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
          {viewAllLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function NetworkingForOpportunitySection() {
  return (
    <SectionCard
      title="Networking for Opportunity"
      subtitle="Connect with investors, mentors, partners and explore opportunities."
      viewAllLabel="View all networking"
      viewAllTo="/network"
      rows={NETWORKING_ROWS}
    />
  );
}

export function SurveysSection() {
  return (
    <SectionCard
      title="Surveys"
      subtitle="Share your feedback and help the community grow."
      viewAllLabel="View all surveys"
      viewAllTo="/coming-soon"
      rows={SURVEY_ROWS}
    />
  );
}