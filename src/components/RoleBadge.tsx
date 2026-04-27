import { Lightbulb, Building2, TrendingUp, Rocket, Handshake, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/hooks/useUserRole";

export type BadgeRole = UserRole | "admin";

interface RoleBadgeProps {
  role: BadgeRole;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const roleConfig: Record<BadgeRole, { label: string; icon: React.ElementType; gradient: string }> = {
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    gradient: "from-rose-500 to-red-600",
  },
  innovator: {
    label: "Innovator",
    icon: Lightbulb,
    gradient: "from-amber-500 to-orange-500",
  },
  startup: {
    label: "Startup",
    icon: Building2,
    gradient: "from-blue-500 to-indigo-500",
  },
  investor: {
    label: "Investor",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-teal-500",
  },
  consultant: {
    label: "Consultant",
    icon: Rocket,
    gradient: "from-purple-500 to-pink-500",
  },
  ecosystem_partner: {
    label: "Ecosystem Partner",
    icon: Handshake,
    gradient: "from-cyan-500 to-blue-500",
  },
};

export function RoleBadge({ role, size = "sm", showIcon = true, className }: RoleBadgeProps) {
  const config = roleConfig[role];
  if (!config) return null;
  
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };
  
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium text-white bg-gradient-to-r",
        config.gradient,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
}
