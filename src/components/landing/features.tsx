import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FEATURES = [
  {
    image:
      "https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/feature-role-access.png",
    title: "Role-based Access",
    description:
      "Tailored experiences for innovators, investors, consultants, and ecosystem partners — everyone sees what matters most to them.",
    link: "/role-based-access",
  },
  {
    image:
      "https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/feature-networking.png",
    title: "Networking",
    description:
      "Connect with the right people through goal-driven introductions and a focused ecosystem designed for meaningful collaboration.",
    link: "/networking",
  },
  {
    image:
      "https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/feature-growth.png",
    title: "Growth",
    description:
      "Track progress, unlock opportunities, and scale your startup with the resources, partners, and support you need.",
    link: "/growth",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative w-full bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16 lg:py-28">

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Features
          </p>

          <h2 className="mt-6 text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Everything you need to grow.
          </h2>
        </div>

        <div className="mt-16 grid gap-16 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-10">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center"
            >
              <div className="w-52 overflow-hidden rounded-full bg-[#fdf3e7] md:w-60">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-8 text-2xl font-medium tracking-tight text-foreground">
                {feature.title}
              </h3>

              <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              <Link
                to={feature.link}
                className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                Learn More

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}