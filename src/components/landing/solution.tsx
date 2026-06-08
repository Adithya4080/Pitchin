import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SOLUTION_IMAGE =
  "https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/solution-illustration.png";

export default function TheSolution() {
  return (
    <section
      id="solution"
      className="relative w-full overflow-hidden bg-[#f5ede3]"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16 lg:py-28">

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">

          {/* Content */}
          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              The Solution
            </p>

            <h2 className="mt-6 text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              One platform to build,
              <span className="block">
                connect, and execute.
              </span>
            </h2>

            <div className="mt-10 space-y-8">

              <p className="text-base leading-relaxed text-foreground/90 md:text-lg">
                Pitch is designed to bridge the gap between ideas and execution
                by bringing the right people, resources, and opportunities into
                one structured ecosystem. Instead of navigating challenges
                alone, founders can discover relevant investors, connect with
                experienced consultants, and engage with ecosystem partners
                such as accelerators and incubators—all in one place.
              </p>

              <p className="text-base leading-relaxed text-foreground/90 md:text-lg">
                The platform transforms scattered efforts into focused progress
                by enabling meaningful connections based on real needs and
                goals.
              </p>

              <p className="text-base leading-relaxed text-foreground/90 md:text-lg">
                By combining intelligent discovery, role-based experiences, and
                a collaborative environment, Pitch empowers startups to move
                faster and make better decisions.
              </p>

              <p className="text-base leading-relaxed text-foreground/90 md:text-lg">
                Whether it's validating an idea, securing funding, building the
                right team, or gaining expert guidance, the platform ensures
                that every user has access to what they need at the right time.
                Pitch doesn't just connect people—it creates a system where
                innovation can grow, partnerships can form, and real outcomes
                can happen.
              </p>

            </div>

            <Link
              to="/solution"
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-6 py-3 text-sm font-medium text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              Learn More

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>

          {/* Illustration */}
          <div className="relative mx-auto w-full max-w-[420px]">

            <img
              src={SOLUTION_IMAGE}
              alt="Illustration of people collaborating around the Pitch platform"
              className="w-full object-contain"
            />

          </div>

        </div>
      </div>
    </section>
  );
}