import whoWeAreImage from '@/assets/who-we-are.png';

export default function WhoWeAre() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#ffff] py-20 sm:py-24 lg:py-28">
      {/* Ambient background — matches Hero's blur-orb treatment */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] right-[5%] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[0%] h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16 xl:px-24">
        {/* ── Image ────────────────────────────────────────── */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
            <img
              src={whoWeAreImage}
              alt="PitchIn's connected ecosystem of startups, investors, and service providers"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Signature detail — a real count, not decoration: the eight
              stakeholder groups named in the copy, on one shared platform. */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card px-6 py-4 shadow-lg sm:block">
            <p className="text-2xl font-semibold tracking-tight text-foreground">5 roles.</p>
            <p className="text-sm text-muted-foreground">One ecosystem.</p>
          </div>
        </div>
        {/* ── Text ─────────────────────────────────────────── */}
        <div className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Who We Are
          </span>

          <h2 className="mt-5 text-[28px] font-medium leading-[1.1] tracking-tight text-foreground sm:text-[36px] lg:text-[44px]">
            Building the Digital Ecosystem for Startups
          </h2>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            We&rsquo;re building a <strong className="font-semibold text-foreground">unified platform</strong> where{' '}
            <strong className="font-semibold text-foreground">
              startups, founders, investors, consultants, service providers, incubators, accelerators, and ecosystem partners
            </strong>{' '}
            connect, collaborate, and grow together. Instead of navigating fragmented tools, disconnected networks, and
            scattered service providers, everything exists in{' '}
            <strong className="font-semibold text-foreground">one trusted ecosystem</strong>.
          </p>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Whether you&rsquo;re launching your first startup, scaling an existing business, looking for expert support, or
            searching for meaningful partnerships, our platform brings{' '}
            <strong className="font-semibold text-foreground">the right people, opportunities, and services</strong>{' '}
            together. We make networking simpler, collaboration faster, and startup growth more accessible through{' '}
            <strong className="font-semibold text-foreground">a single professional ecosystem</strong> designed
            specifically for innovators and businesses.
          </p>
        </div>


      </div>
    </section>
  );
}