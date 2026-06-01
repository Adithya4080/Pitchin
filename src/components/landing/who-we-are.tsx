import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const WHO_WE_ARE_BG =
  "https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/who-we-are-bg.png";

export default function WhoWeAre() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#f2f2f2]"
    >
      {/* Background Image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08]"
        style={{
          backgroundImage: `url(${WHO_WE_ARE_BG})`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16 lg:py-32">

        {/* Label */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Who We Are
          </span>
        </div>

        {/* Content */}
        <div className="max-w-4xl">

          <h2 className="text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Bridging the gap between
            <span className="block">
              ideas and execution.
            </span>
          </h2>

          <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Pitch is a platform designed to help innovators find the right
            people, resources, and opportunities to build impactful startups.
          </p>

          <p className="mt-6 max-w-4xl text-base leading-relaxed text-muted-foreground md:text-lg">
            At its core, Pitch acts as a bridge between potential and progress.
            Users can showcase ideas, explore relevant profiles, connect with
            the right stakeholders, and collaborate in a focused ecosystem
            designed for real outcomes.
          </p>

          <p className="mt-6 max-w-4xl text-base leading-relaxed text-muted-foreground md:text-lg">
            By combining intelligent discovery, role-based experiences, and a
            growing network of contributors, Pitch enables stronger
            connections, faster decision-making, and more effective
            collaboration. The result is a dynamic ecosystem where innovation
            is not just shared, but actively developed and scaled.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <Link
              to="/who-we-are"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-6 py-3 text-sm font-medium text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              Learn More

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}