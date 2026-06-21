import { Link } from 'react-router-dom';
import { Search, Compass, Briefcase, Users, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GrowthSidebar } from '@/components/network/GrowthSidebar';
import { ImagePlaceholder } from '@/components/network/ImagePlaceholder';
import { getServiceCategoryIcon } from '@/components/network/iconMap';
import { useServiceCategories } from '@/hooks/useServices';

const journeyStages = [
  { id: 'idea', stageLabel: 'Stage 1', title: 'Validate Your Idea', description: 'Talk to mentors and test your concept.', cta: 'Get started' },
  { id: 'build', stageLabel: 'Stage 2', title: 'Build Your MVP', description: 'Find tech & design partners to build fast.', cta: 'Find help' },
  { id: 'launch', stageLabel: 'Stage 3', title: 'Launch & Get Users', description: 'Marketing and growth services to launch right.', cta: 'Explore' },
  { id: 'scale', stageLabel: 'Stage 4', title: 'Raise & Scale', description: 'Connect with investors and scale operations.', cta: 'Connect' },
];

export default function Network() {
  const { data: serviceCategories = [], isLoading, isError } = useServiceCategories();

  return (
    <AppLayout showMobileHeader title="Growth Hub" showBottomNav>
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 py-5 md:py-8 flex gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-8 md:space-y-10">

          {/* HERO */}
          <section>
            <Card className="bg-white border-foreground/10 p-5 md:p-8">
              <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 md:gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-foreground/60 mb-3">
                    <Compass className="h-3.5 w-3.5" /> Startup Growth Hub
                  </div>
                  <h1 className="font-display text-2xl md:text-4xl font-bold leading-tight text-foreground">
                    Everything Your Startup Needs to Build, Grow &amp; Scale
                  </h1>
                  <p className="text-sm md:text-base text-foreground/70 mt-3 max-w-xl">
                    Discover vetted services, curated for founders at every stage.
                  </p>

                  <div className="mt-5 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <Input
                      placeholder="Search services or providers…"
                      className="pl-9 h-11 bg-background border-foreground/15"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild variant="outline" className="bg-white border-foreground/30 hover:bg-foreground/[0.04]">
                      <Link to="/network/services"><Briefcase className="h-4 w-4 mr-1.5" />Find Services</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white border-foreground/30 hover:bg-foreground/[0.04]">
                      <Link to="/network"><Users className="h-4 w-4 mr-1.5" />Connect with Experts</Link>
                    </Button>
                  </div>
                </div>

                <ImagePlaceholder label="Ecosystem illustration" aspect="aspect-[4/3] md:aspect-square" />
              </div>
            </Card>
          </section>

          {/* JOURNEY */}
          <section>
            <SectionHeader title="Your Startup Journey" subtitle="Pick where you are — we'll show what matters next." />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {journeyStages.map((s) => (
                <Card key={s.id} className="bg-white border-foreground/10 p-4 h-full flex flex-col">
                  <p className="text-[10px] uppercase tracking-wide text-foreground/50">{s.stageLabel}</p>
                  <h3 className="text-base font-semibold text-foreground mt-0.5">{s.title}</h3>
                  <p className="text-xs text-foreground/60 mt-1 flex-1">{s.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* SERVICES MARKETPLACE — live data */}
          <section>
            <SectionHeader
              title="Find Services For Your Startup"
              subtitle="Vetted providers across legal, tech, design, finance and more."
              link={{ label: 'All services', to: '/network/services' }}
            />

            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-xl bg-foreground/[0.04] animate-pulse" />
                ))}
              </div>
            )}

            {isError && (
              <p className="text-sm text-foreground/60 mt-4">
                Couldn't load services right now. Please try again shortly.
              </p>
            )}

            {!isLoading && !isError && serviceCategories.length === 0 && (
              <p className="text-sm text-foreground/60 mt-4">No service categories yet — check back soon.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {serviceCategories.map((c) => {
                const Icon = getServiceCategoryIcon(c.icon);
                return (
                  <Link key={c.id} to={`/network/services?category=${c.slug}`}>
                    <Card className="bg-white border-foreground/10 hover:border-foreground/30 transition-colors p-4 h-full">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-foreground/[0.05] flex items-center justify-center shrink-0">
                          <Icon className="h-4.5 w-4.5 text-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                          <p className="text-xs text-foreground/60 mt-0.5">{c.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[11px] text-foreground/50">{c.provider_count} providers</span>
                            <span className="text-xs font-medium text-foreground inline-flex items-center gap-1">
                              Explore <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sticky sidebar */}
        <div className="sticky top-20 self-start">
          <GrowthSidebar />
        </div>
      </div>
    </AppLayout>
  );
}

function SectionHeader({ title, subtitle, link }: { title: string; subtitle?: string; link?: { label: string; to: string } }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-lg md:text-xl font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs md:text-sm text-foreground/60 mt-0.5">{subtitle}</p>}
      </div>
      {link && (
        <Link to={link.to} className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1 shrink-0">
          {link.label} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}