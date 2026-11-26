import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Loader2 } from 'lucide-react';
import { cancelBooking, fetchBookingById } from '@/services/api';
import { formatDateDisplay, formatHours, formatINR, formatTimeDisplay } from '@/lib/format';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { QrCodeSvg } from '@/components/QrCodeSvg';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/types';

const STATUS_STYLE: Record<BookingStatus, { label: string; className: string }> = {
  confirmed: { label: 'Confirmed', className: 'bg-[#EFF6FF] text-[#3B82F6]' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700' },
};

export function BookingPassPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!bookingId || !user) return;
    let active = true;
    fetchBookingById(bookingId, user.id)
      .then((b) => {
        if (active) setBooking(b);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [bookingId, user]);

  const handleCancel = async () => {
    if (!booking || !user) return;
    setCancelling(true);
    try {
      const updated = await cancelBooking(booking.id, user.id);
      setBooking(updated);
      setConfirmOpen(false);
      toast({
        title: 'Booking cancelled',
        description: `Bay ${updated.slot_code} is now open for other drivers.`,
        variant: 'info',
      });
    } catch (err) {
      toast({
        title: 'Could not cancel booking',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'error',
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[560px] px-4 py-14 sm:px-6">
        <div className="h-[520px] animate-pulse rounded-[30px] bg-[#F3F5F8]" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-semibold text-[#171717]">Pass not found</h1>
        <p className="mt-2 text-sm text-[#737373]">
          This booking pass does not exist or belongs to another account.
        </p>
        <Button asChild className="mt-6">
          <Link to="/bookings">Back to my bookings</Link>
        </Button>
      </div>
    );
  }

  const badge = STATUS_STYLE[booking.status];

  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden pb-20 pt-10">
      <div aria-hidden="true" className="hero-dot-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[560px] px-4 sm:px-6">
        <Link
          to="/bookings"
          className="hover-lift no-print inline-flex items-center gap-1.5 text-sm font-medium text-[#737373] hover:text-[#171717]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my bookings
        </Link>

        <div className="glass-panel print-card mt-5 rounded-[30px] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
                ParkEase Digital Pass
              </p>
              <p className="mt-1.5 font-mono text-3xl font-semibold tracking-[0.14em] text-[#171717] sm:text-4xl">
                {booking.booking_code}
              </p>
            </div>
            <span
              className={cn(
                'rounded-full px-3.5 py-1 text-xs font-semibold',
                badge.className,
              )}
            >
              {badge.label}
            </span>
          </div>

          <div className="mt-6 flex justify-center">
            <QrCodeSvg
              value={JSON.stringify({
                code: booking.booking_code,
                location: booking.location_id,
                bay: booking.slot_code,
                date: booking.booking_date,
              })}
              size={156}
            />
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Location</span>
              <span className="text-right font-semibold text-[#171717]">
                {booking.location_name}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Address</span>
              <span className="max-w-[65%] text-right text-[#171717]">
                {booking.location_address}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Date</span>
              <span className="font-medium text-[#171717]">
                {formatDateDisplay(booking.booking_date)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Arrival – Departure</span>
              <span className="font-medium text-[#171717]">
                {formatTimeDisplay(booking.start_time)} – {formatTimeDisplay(booking.end_time)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Duration</span>
              <span className="font-medium text-[#171717]">{formatHours(booking.hours)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Assigned bay</span>
              <span className="rounded-full bg-[#EFF6FF] px-3 py-0.5 text-xs font-semibold text-[#3B82F6]">
                {booking.slot_code}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Vehicle</span>
              <span className="font-medium text-[#171717]">
                {booking.vehicle_type} ·{' '}
                <span className="font-mono">{booking.vehicle_number}</span>
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Amount</span>
              <span className="font-heading text-base font-semibold text-[#171717]">
                {formatINR(booking.total_amount)}
              </span>
            </div>
          </div>

          {/* Dashed Tear Line */}
          <div className="my-7 border-t-2 border-dashed border-[#E9EDF2]" />

          <div className="no-print flex flex-wrap items-center justify-between gap-3">
            {booking.status === 'confirmed' ? (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Cancel booking
              </button>
            ) : (
              <span className="text-xs text-[#737373]">
                {booking.status === 'cancelled'
                  ? 'This pass was cancelled and its bay released.'
                  : 'Completed reservation'}
              </span>
            )}

            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Download / Print
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel pass {booking.booking_code}?</DialogTitle>
            <DialogDescription>
              Bay {booking.slot_code} at {booking.location_name} will immediately become available
              for other drivers.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-2.5">
            <Button variant="outline" disabled={cancelling} onClick={() => setConfirmOpen(false)}>
              Keep pass
            </Button>
            <Button variant="danger" disabled={cancelling} onClick={handleCancel}>
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel booking'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
