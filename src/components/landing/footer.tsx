import { Link } from "react-router-dom";

const LOGO_URL =
  "https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/logo-full.png";

export function SiteFooter() {
  return (
    <footer className="bg-[#1f1d1a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <img
              src={LOGO_URL}
              alt="Pitchin"
              className="h-8 w-auto object-contain"
            />

            <p className="mt-2 text-xs leading-relaxed text-white/60 sm:text-sm">
              A smarter ecosystem for ideas, people, and growth —
              connecting innovators, investors, and experts.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Explore
              </h3>

              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm">
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
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Get Started
              </h3>

              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm">
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
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 flex flex-col gap-2 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Pitchin. All rights reserved.
          </p>

          <div className="flex gap-4">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}