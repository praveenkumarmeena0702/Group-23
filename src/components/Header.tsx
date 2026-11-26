import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldCheck, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/explore', label: 'Explore', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/bookings', label: 'My bookings', end: false },
];

export function Header() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    toast({ title: 'Signed out', description: 'You have been signed out of ParkEase.', variant: 'info' });
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-3 md:top-5 md:px-6 md:pt-0">
      <div className="glass-panel mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full px-4 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-full py-1 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#171717] font-heading text-base font-semibold text-white">
            P
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight text-[#171717]">
            ParkEase
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors',
                  isActive
                    ? 'bg-[#EFF6FF] text-[#3B82F6]'
                    : 'text-[#737373] hover:text-[#171717]',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link
                to="/mfa"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E9EDF2] bg-white/80 px-3.5 py-1.5 text-xs font-medium text-[#171717] transition-colors hover:border-[#3B82F6] hover:bg-[#EFF6FF] hover:text-[#3B82F6]"
                title="Security & 2FA settings"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#3B82F6]" />
                <span className="max-w-[120px] truncate">{user.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover-lift rounded-full px-4 py-2 text-sm font-medium text-[#171717] hover:text-[#3B82F6]"
              >
                Sign in
              </Link>
              <Button asChild size="sm" className="h-10 px-5">
                <Link to="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9EDF2] bg-white/80 text-[#171717] md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Glass Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            className="glass-panel mx-auto mt-2.5 max-w-6xl rounded-[24px] p-4 md:hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#EFF6FF] text-[#3B82F6]'
                        : 'text-[#171717] hover:bg-[#F9FAFB]',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-3 flex flex-col gap-2 border-t border-[#E9EDF2] pt-3">
              {user ? (
                <>
                  <Link
                    to="/mfa"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-full border border-[#E9EDF2] bg-white px-4 py-2.5 text-sm font-medium text-[#171717]"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#3B82F6]" />
                      {user.name}
                    </span>
                    <span className="text-xs text-[#737373]">
                      {user.mfaEnabled ? '2FA On' : 'Security'}
                    </span>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="w-full" onClick={() => setMobileOpen(false)}>
                    <Link to="/register">Get started</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
