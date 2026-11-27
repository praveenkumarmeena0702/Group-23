import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, SquareParking, Loader2 } from 'lucide-react';
import { cancelBooking, fetchUserBookings } from '@/services/api';
import { formatDateDisplay, formatHours, formatINR, formatTimeDisplay } from '@/lib/format';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/types';

type TabValue = 'all' | 'upcoming' | 'completed' | 'cancelled';

const STATUS_BADGE: Record<BookingStatus, { label: string; className: string }> = {
  confirmed: { label: 'Confirmed', className: 'bg-[#EFF6FF] text-[#3B82F6]' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700' },
};

export function MyBookingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabValue>('all');
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    fetchUserBookings(user.id)
      .then((list) => {
        if (active) setBookings(list);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const filteredBookings = useMemo(() => {
    if (tab === 'all') return bookings;
    if (tab === 'upcoming') return bookings.filter((b) => b.status === 'confirmed');
    return bookings.filter((b) => b.status === tab);
  }, [bookings, tab]);

  const handleConfirmCancel = async () => {
    if (!cancelTarget || !user) return;
    setCancelling(true);
    try {
      const updated = await cancelBooking(cancelTarget.id, user.id);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setCancelTarget(null);
      toast({
        title: 'Booking cancelled',
        description: `Bay ${updated.slot_code} has been released back to availability.`,
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

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
            Reservations
          </p>
          <h1 className="mt-2 font-heading text-[36px] font-semibold tracking-tight text-[#171717] sm:text-[44px]">
            My bookings
          </h1>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="h-72 animate-pulse rounded-[24px] border border-[#E9EDF2] bg-[#F9FAFB]"
            />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-[24px] border border-[#E9EDF2] bg-white px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
            <Calendar className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-heading text-xl font-semibold text-[#171717]">
            No bookings yet
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-[#737373]">
            {tab === 'all'
              ? 'Reserve a Lucknow parking bay in seconds and your digital passes will appear here.'
              : `You have no ${tab} reservations right now.`}
          </p>
          <Button asChild className="mt-6">
            <Link to="/explore">Explore parking</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredBookings.map((b) => {
            const badge = STATUS_BADGE[b.status];
            return (
              <div
                key={b.id}
                className="flex flex-col overflow-hidden rounded-[24px] border border-[#E9EDF2] bg-white p-3"
              >
                <div className="photo-frame relative h-[128px] w-full overflow-hidden rounded-[18px]">
                  <img
                    src={b.location_image}
                    alt={b.location_name}
                    className="h-full w-full rounded-[16px] object-cover"
                  />
                  <span
                    className={cn(
                      'absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md',
                      badge.className,
                    )}
                  >
                    {badge.label}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                  <h2 className="font-heading text-xl font-semibold text-[#171717]">
                    {b.location_name}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#737373]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                    <span className="truncate">{b.location_address}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[16px] border border-[#E9EDF2] bg-[#F9FAFB] px-3.5 py-2.5 text-xs font-medium text-[#171717]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#3B82F6]" />
                      {formatDateDisplay(b.booking_date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#3B82F6]" />
                      {formatTimeDisplay(b.start_time)} – {formatTimeDisplay(b.end_time)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <SquareParking className="h-3.5 w-3.5 text-[#3B82F6]" />
                      Bay {b.slot_code}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#E9EDF2] pt-3.5">
                    <div>
                      <span className="font-heading text-lg font-semibold text-[#171717]">
                        {formatINR(b.total_amount)}
                      </span>
                      <span className="ml-2 text-xs text-[#737373]">{formatHours(b.hours)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => setCancelTarget(b)}
                          className="rounded-full px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                      <Button asChild size="sm">
                        <Link to={`/bookings/${b.id}`}>View pass</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={Boolean(cancelTarget)} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this booking?</DialogTitle>
            <DialogDescription>
              {cancelTarget &&
                `This will cancel pass ${cancelTarget.booking_code} for Bay ${cancelTarget.slot_code} at ${cancelTarget.location_name} and release the bay immediately.`}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-2.5">
            <Button
              variant="outline"
              disabled={cancelling}
              onClick={() => setCancelTarget(null)}
            >
              Keep booking
            </Button>
            <Button variant="danger" disabled={cancelling} onClick={handleConfirmCancel}>
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Confirm cancellation'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
