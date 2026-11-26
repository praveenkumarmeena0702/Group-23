import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { ParkingDetailPage } from '@/pages/ParkingDetailPage';
import { BookingFlowPage } from '@/pages/BookingFlowPage';
import { MyBookingsPage } from '@/pages/MyBookingsPage';
import { BookingPassPage } from '@/pages/BookingPassPage';
import { AboutPage } from '@/pages/AboutPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { MfaPage } from '@/pages/auth/MfaPage';
import { Button } from '@/components/ui/button';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">404</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold text-[#171717]">Page not found</h1>
      <p className="mt-2 text-sm text-[#737373]">
        The page you requested does not exist or has moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Return home</Link>
      </Button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/parking/:parkingId" element={<ParkingDetailPage />} />
              <Route path="/book/:parkingId" element={<BookingFlowPage />} />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/:bookingId"
                element={
                  <ProtectedRoute>
                    <BookingPassPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/mfa" element={<MfaPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
