import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[#E9EDF2] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Blurb */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#171717] font-heading text-base font-semibold text-white">
                P
              </span>
              <span className="font-heading text-lg font-semibold tracking-tight text-[#171717]">
                ParkEase
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#737373]">
              Real-time parking discovery and exact bay reservation across verified Mumbai
              facilities. Calm arrival, every trip.
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#737373]">
              <li>
                <Link to="/explore" className="transition-colors hover:text-[#171717]">
                  All Mumbai garages
                </Link>
              </li>
              <li>
                <Link to="/explore?q=Bandra" className="transition-colors hover:text-[#171717]">
                  Bandra West & BKC
                </Link>
              </li>
              <li>
                <Link to="/explore?q=Marine+Drive" className="transition-colors hover:text-[#171717]">
                  South Mumbai & Colaba
                </Link>
              </li>
              <li>
                <Link to="/explore?q=Andheri" className="transition-colors hover:text-[#171717]">
                  Andheri & Powai
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
              Drivers
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#737373]">
              <li>
                <Link to="/bookings" className="transition-colors hover:text-[#171717]">
                  My bookings
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition-colors hover:text-[#171717]">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition-colors hover:text-[#171717]">
                  Create account
                </Link>
              </li>
              <li>
                <Link to="/mfa" className="transition-colors hover:text-[#171717]">
                  Two-factor security
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
              Company
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#737373]">
              <li>
                <Link to="/about" className="transition-colors hover:text-[#171717]">
                  About ParkEase
                </Link>
              </li>
              <li>
                <Link to="/about#values" className="transition-colors hover:text-[#171717]">
                  Our principles
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="transition-colors hover:text-[#171717]">
                  Password recovery
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@parkease.in"
                  className="transition-colors hover:text-[#171717]"
                >
                  support@parkease.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#E9EDF2] pt-6 text-xs text-[#737373] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} ParkEase Mobility Pvt. Ltd. All rights reserved.</p>
          <p>Mumbai · Verified bays · Instant digital pass</p>
        </div>
      </div>
    </footer>
  );
}
