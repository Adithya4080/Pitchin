import {
  Briefcase, Scale, Palette, Calculator, Code, Megaphone, Users, ShieldCheck, TrendingUp, HelpCircle,
} from 'lucide-react';

export const serviceCategoryIconMap: Record<string, typeof Briefcase> = {
  briefcase: Briefcase,
  scale: Scale,
  palette: Palette,
  calculator: Calculator,
  code: Code,
  megaphone: Megaphone,
  users: Users,
  'shield-check': ShieldCheck,
  'trending-up': TrendingUp,
  other: HelpCircle,
};

export function getServiceCategoryIcon(icon: string) {
  return serviceCategoryIconMap[icon] || HelpCircle;
}