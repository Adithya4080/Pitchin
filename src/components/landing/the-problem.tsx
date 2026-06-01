import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PROBLEM_IMAGE =
  "https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/problem-newspaper.png";

export default function TheProblem() {
  return (
    <section
      id="problem"
      className="relative w-full overflow-hidden bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16 lg:py-28">

        <div className="grid items-center gap-10 lg:grid-cols-[420px_1fr] lg:gap-16">

          {/* Image */}
          <div className="relative overflow-hidden rounded-none">

            <img
              src={PROBLEM_IMAGE}
              alt="Newspaper clippings illustrating common reasons startups fail"
              className="w-full object-cover"
            />

          </div>

          {/* Content */}
          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              The Problem
            </p>

            <h2 className="mt-6 text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Why most ideas never
              <span className="block">
                become startups.
              </span>
            </h2>

            <div className="mt-10 space-y-8">

              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Early-stage startups face a complex set of challenges that go
                far beyond just building a product. In highly competitive
                markets, standing out becomes difficult while access to funding
                remains limited and unpredictable.
              </p>

              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                At the same time, founders struggle to find the right team,
                balance limited resources, and make critical decisions under
                constant time pressure. With unclear market demand and frequent
                investor rejections, the journey becomes uncertain and
                overwhelming.
              </p>

              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Beyond these visible challenges, many startups silently deal
                with deeper issues—lack of proper guidance, inconsistent cash
                flow, and the absence of the right network.
              </p>

              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Without access to experienced mentors, strategic support, and
                meaningful connections, even promising ideas fail to reach
                their potential. This gap between ambition and execution is
                where most early-stage ventures get stuck.
              </p>

            </div>

            <Link
              to="/problem"
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-6 py-3 text-sm font-medium text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
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