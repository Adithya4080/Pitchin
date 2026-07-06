import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function GrowthSidebar() {
  return (
    <div className="hidden xl:block w-[18rem] shrink-0 space-y-4">
      <Card className="bg-white border-foreground/10 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
          <ShieldCheck className="h-4 w-4" />
          Vetted Providers Only
        </div>
        <p className="text-xs text-foreground/60">
          Every provider listed in the Services Marketplace is reviewed before going live.
        </p>
      </Card>

      <Card className="bg-white border-foreground/10 p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Are you a service provider?</h3>
        <p className="text-xs text-foreground/60 mb-3">
          List your services and get discovered by founders on PitchIn.
        </p>
        <Link
          to="/contact"
          className="text-xs font-medium text-foreground inline-flex items-center gap-1 hover:underline"
        >
          Apply to list <ArrowRight className="h-3 w-3" />
        </Link>
      </Card>
    </div>
  );
}