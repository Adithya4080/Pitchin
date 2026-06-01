import { Link } from "react-router-dom";

const LOGO_URL =
  "https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/logo-full.png";

export function SiteFooter() {
  return (
    <footer className="bg-[#1f1d1a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[1.5fr_0.7fr_0.7fr]">
          <div>
            <img
              src={LOGO_URL}
              alt="Pitchin"
              className="h-12 w-auto object-contain"
            />

            <p className="mt-8 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              A smarter ecosystem for ideas, people, and growth —
              connecting innovators, investors, and experts to turn
              ideas into real-world startups.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Explore
            </h3>

            <ul className="mt-8 space-y-5 text-sm sm:text-base">
              <li>
                <Link to="/#about">About</Link>
              </li>

              <li>
                <Link to="/#problem">Problem</Link>
              </li>

              <li>
                <Link to="/#solution">Solution</Link>
              </li>

              <li>
                <Link to="/#features">Features</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Get Started
            </h3>

            <ul className="mt-8 space-y-5 text-sm sm:text-base">
              <li>
                <Link to="/#waitlist">Join Waitlist</Link>
              </li>

              <li>
                <a href="mailto:hello@pitchin.app">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10" />

        <div className="mt-8 flex flex-col gap-4 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Pitchin. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}