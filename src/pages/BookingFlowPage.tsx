import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Car,
  CarFront,
  Check,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { addHours, format } from 'date-fns';
import { createBooking, fetchLocationById, fetchSlotsByLocation } from '@/services/api';
import {
  calculateDurationHours,
  formatDateDisplay,
  formatHours,
  formatINR,
  formatTimeDisplay,
  formatVehiclePlate,
  getTodayISO,
  isValidVehiclePlate,
} from '@/lib/format';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { Booking, ParkingLocation, ParkingSlot, VehicleType } from '@/types';

const STEPS = [
  { num: 1, label: 'Date & time' },
  { num: 2, label: 'Vehicle' },
  { num: 3, label: 'Review' },
  { num: 4, label: 'Payment' },
];

const VEHICLE_OPTIONS: Array<{ type: VehicleType; icon: typeof Car; hint: string }> = [
  { type: 'Hatchback', icon: Car, hint: 'Swift, Baleno, i20' },
  { type: 'Sedan', icon: CarFront, hint: 'City, Virtus, Slavia' },
  { type: 'SUV', icon: Truck, hint: 'Creta, Safari, XUV700' },
  { type: 'Two-wheeler', icon: Bike, hint: 'Scooter or motorcycle' },
];

export function BookingFlowPage() {
  const { parkingId } = useParams<{ parkingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const slotParam = searchParams.get('slot') ?? '';
  const initialHours = Math.max(1, Math.min(24, Number(searchParams.get('hours') ?? 2) || 2));

  const [location, setLocation] = useState<ParkingLocation | null>(null);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [selectedSlotCode, setSelectedSlotCode] = useState(slotParam);

  // Step 1 state
  const [bookingDate, setBookingDate] = useState(getTodayISO());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState(() => {
    const start = new Date();
    start.setHours(10, 0, 0, 0);
    return format(addHours(start, initialHours), 'HH:mm');
  });
  const [timeError, setTimeError] = useState('');

  // Step 2 state
  const [vehicleType, setVehicleType] = useState<VehicleType>('Hatchback');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleError, setVehicleError] = useState('');

  // Step 4 state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Guard: if not signed in, redirect to /login with return URL
  useEffect(() => {
    if (!authLoading && !user) {
      const returnPath = `/book/${parkingId}${window.location.search}`;
      navigate(`/login?redirect=${encodeURIComponent(returnPath)}`, { replace: true });
    }
  }, [authLoading, user, parkingId, navigate]);

  useEffect(() => {
    if (!parkingId) return;
    let active = true;
    Promise.all([fetchLocationById(parkingId), fetchSlotsByLocation(parkingId)])
      .then(([loc, sl]) => {
        if (!active) return;
        setLocation(loc);
        setSlots(sl);
        if (!slotParam && sl.length > 0) {
          const firstAvailable = sl.find((s) => s.status === 'available');
          if (firstAvailable) setSelectedSlotCode(firstAvailable.code);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [parkingId, slotParam]);

  const durationHours = useMemo(
    () => calculateDurationHours(startTime, endTime),
    [startTime, endTime],
  );

  const estimatedTotal = useMemo(() => {
    if (!location || durationHours <= 0) return 0;
    return Math.round(durationHours * location.price_per_hour);
  }, [location, durationHours]);

  const validateStep1 = (): boolean => {
    if (!bookingDate || bookingDate < getTodayISO()) {
      setTimeError('Please select today or an upcoming date.');
      return false;
    }
    if (durationHours <= 0) {
      setTimeError('Departure time cannot be the same as arrival time.');
      return false;
    }
    if (!selectedSlotCode) {
      setTimeError('Please select an available bay.');
      return false;
    }
    setTimeError('');
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!vehicleNumber.trim()) {
      setVehicleError('Please enter your vehicle registration number.');
      return false;
    }
    if (!isValidVehiclePlate(vehicleNumber)) {
      setVehicleError('Enter a valid plate number (e.g. UP 32 AB 1234).');
      return false;
    }
    setVehicleError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = async () => {
    if (!location || !user) return;
    if (!acceptedTerms) {
      setTermsError('Please accept the booking terms and cancellation policy.');
      return;
    }
    setTermsError('');
    setSubmitting(true);

    try {
      const booking = await createBooking(
        {
          location_id: location.id,
          slot_code: selectedSlotCode,
          booking_date: bookingDate,
          start_time: startTime,
          end_time: endTime,
          hours: durationHours,
          vehicle_type: vehicleType,
          vehicle_number: vehicleNumber,
          payment_method: 'pay_at_venue',
          user_name: user.name,
        },
        user,
      );
      setConfirmedBooking(booking);
      toast({
        title: 'Booking confirmed',
        description: `Pass ${booking.booking_code} is ready for bay ${booking.slot_code}.`,
        variant: 'success',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to complete booking.';
      toast({ title: 'Could not confirm booking', description: msg, variant: 'error' });
      // Refresh slot list in case of 409 conflict
      if (parkingId) {
        fetchSlotsByLocation(parkingId).then(setSlots);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="h-12 animate-pulse rounded-full bg-[#F3F5F8]" />
        <div className="mt-8 h-96 animate-pulse rounded-[24px] bg-[#F3F5F8]" />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-semibold text-[#171717]">Location not found</h1>
        <Button asChild className="mt-6">
          <Link to="/explore">Back to explore</Link>
        </Button>
      </div>
    );
  }

  // Confirmation Screen
  if (confirmedBooking) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-[30px] border border-[#E9EDF2] bg-white p-8 text-center shadow-glass">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-[#171717]">
            Booking confirmed
          </h1>
          <p className="mt-2 text-sm text-[#737373]">
            Show your pass code at the entrance barrier when you arrive.
          </p>

          <div className="mt-6 rounded-[20px] border border-[#E9EDF2] bg-[#F9FAFB] px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
              Booking code
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold tracking-[0.14em] text-[#171717]">
              {confirmedBooking.booking_code}
            </p>
          </div>

          <div className="mt-6 space-y-2.5 rounded-[20px] border border-[#E9EDF2] bg-white p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Location</span>
              <span className="text-right font-medium text-[#171717]">
                {confirmedBooking.location_name}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Bay</span>
              <span className="font-semibold text-[#3B82F6]">{confirmedBooking.slot_code}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Date</span>
              <span className="font-medium text-[#171717]">
                {formatDateDisplay(confirmedBooking.booking_date)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#737373]">Time</span>
              <span className="font-medium text-[#171717]">
                {formatTimeDisplay(confirmedBooking.start_time)} –{' '}
                {formatTimeDisplay(confirmedBooking.end_time)} ({formatHours(confirmedBooking.hours)})
              </span>
            </div>
            <div className="flex justify-between gap-4 border-t border-[#E9EDF2] pt-2.5">
              <span className="font-medium text-[#171717]">Total due at venue</span>
              <span className="font-heading text-base font-semibold text-[#171717]">
                {formatINR(confirmedBooking.total_amount)}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1" size="lg">
              <Link to={`/bookings/${confirmedBooking.id}`}>View pass</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1" size="lg">
              <Link to="/explore">Back to explore</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Sticky Stepper */}
      <div className="sticky top-[76px] z-30 border-b border-[#E9EDF2] bg-white/95 backdrop-blur-md md:top-[88px]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3.5 sm:px-6">
          {STEPS.map((s) => {
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            return (
              <button
                key={s.num}
                type="button"
                disabled={s.num > step}
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
                className={cn(
                  'relative flex items-center gap-2 pb-1.5 text-sm font-medium transition-colors disabled:cursor-default',
                  isActive ? 'text-[#171717]' : isCompleted ? 'text-[#3B82F6]' : 'text-[#737373]',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                    isCompleted
                      ? 'bg-[#3B82F6] text-white'
                      : isActive
                        ? 'bg-[#EFF6FF] text-[#3B82F6]'
                        : 'bg-[#F3F5F8] text-[#737373]',
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#3B82F6]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Container */}
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <Link
          to={`/parking/${location.id}`}
          className="hover-lift inline-flex items-center gap-1.5 text-sm font-medium text-[#737373] hover:text-[#171717]"
        >
          <ArrowLeft className="h-4 w-4" />
          {location.name}
        </Link>

        {/* STEP 1: DATE & TIME */}
        {step === 1 && (
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
                Step 1 of 4
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold text-[#171717]">
                Choose arrival & departure
              </h1>
            </div>

            <div className="rounded-[24px] border border-[#E9EDF2] bg-white p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]"
                  >
                    Arrival date
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    min={getTodayISO()}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="mt-2 h-11 w-full rounded-[14px] border border-[#E9EDF2] px-3.5 text-sm font-medium text-[#171717] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="start-time"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]"
                  >
                    Arrival time
                  </label>
                  <input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-2 h-11 w-full rounded-[14px] border border-[#E9EDF2] px-3.5 text-sm font-medium text-[#171717] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="end-time"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]"
                  >
                    Departure time
                  </label>
                  <input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-2 h-11 w-full rounded-[14px] border border-[#E9EDF2] px-3.5 text-sm font-medium text-[#171717] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick bay check/selector */}
              <div className="mt-6 border-t border-[#E9EDF2] pt-5">
                <label
                  htmlFor="bay-select"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]"
                >
                  Selected bay
                </label>
                <select
                  id="bay-select"
                  value={selectedSlotCode}
                  onChange={(e) => setSelectedSlotCode(e.target.value)}
                  className="mt-2 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 text-sm font-medium text-[#171717] focus:border-[#3B82F6] focus:outline-none"
                >
                  <option value="">Select an open bay</option>
                  {slots
                    .filter((s) => s.status === 'available')
                    .map((s) => (
                      <option key={s.id} value={s.code}>
                        Bay {s.code} ({s.type.toUpperCase()})
                      </option>
                    ))}
                </select>
              </div>

              {timeError && <p className="mt-3 text-xs font-medium text-red-600">{timeError}</p>}
            </div>

            {/* Live Price Summary Card */}
            <div className="glass-panel rounded-[24px] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#737373]">
                    Duration readout
                  </p>
                  <p className="mt-1 font-heading text-xl font-semibold text-[#171717]">
                    {durationHours > 0 ? formatHours(durationHours) : 'Invalid range'}
                  </p>
                  <p className="mt-0.5 text-xs text-[#737373]">
                    {formatDateDisplay(bookingDate)} · {formatTimeDisplay(startTime)} –{' '}
                    {formatTimeDisplay(endTime)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#737373]">
                    Estimated total
                  </p>
                  <p className="mt-1 font-heading text-2xl font-semibold text-[#171717]">
                    {formatINR(estimatedTotal)}
                  </p>
                  <p className="text-xs text-[#737373]">
                    {formatINR(location.price_per_hour)} / hr
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button size="lg" onClick={handleNext}>
                Continue to vehicle
                <ArrowRight className="arrow-slide h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: VEHICLE */}
        {step === 2 && (
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
                Step 2 of 4
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold text-[#171717]">
                Vehicle details
              </h1>
            </div>

            <div className="rounded-[24px] border border-[#E9EDF2] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">
                Vehicle type
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {VEHICLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = vehicleType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setVehicleType(opt.type)}
                      className={cn(
                        'flex items-center gap-3 rounded-full border px-4 py-3 text-left transition-all',
                        active
                          ? 'border-[#3B82F6] bg-[#EFF6FF] text-[#171717]'
                          : 'border-[#E9EDF2] bg-white text-[#171717] hover:border-[#cfd7e3]',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                          active ? 'bg-[#3B82F6] text-white' : 'bg-[#F5F7FA] text-[#3B82F6]',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{opt.type}</p>
                        <p className="text-xs text-[#737373]">{opt.hint}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="vehicle-number"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]"
                >
                  Registration number
                </label>
                <input
                  id="vehicle-number"
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => {
                    setVehicleNumber(formatVehiclePlate(e.target.value));
                    if (vehicleError) setVehicleError('');
                  }}
                  placeholder="UP 32 AB 1234"
                  className="mt-2 h-12 w-full rounded-[14px] border border-[#E9EDF2] px-4 font-mono text-base font-medium uppercase tracking-wider text-[#171717] placeholder:font-sans placeholder:tracking-normal placeholder:text-[#737373]/70 focus:border-[#3B82F6] focus:outline-none"
                />
                {vehicleError && (
                  <p className="mt-2 text-xs font-medium text-red-600">{vehicleError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button size="lg" onClick={handleNext}>
                Review booking
                <ArrowRight className="arrow-slide h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
                Step 3 of 4
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold text-[#171717]">
                Review your reservation
              </h1>
            </div>

            <div className="divide-y divide-[#E9EDF2] rounded-[24px] border border-[#E9EDF2] bg-white">
              {/* Location & Bay */}
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">
                    Location & Bay
                  </p>
                  <p className="mt-1 font-heading text-lg font-semibold text-[#171717]">
                    {location.name}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#737373]">
                    <MapPin className="h-3.5 w-3.5 text-[#3B82F6]" />
                    {location.address}
                  </p>
                  <p className="mt-2 inline-block rounded-full bg-[#EFF6FF] px-3 py-0.5 text-xs font-semibold text-[#3B82F6]">
                    Bay {selectedSlotCode}
                  </p>
                </div>
                <Link
                  to={`/parking/${location.id}`}
                  className="text-xs font-medium text-[#3B82F6] hover:underline"
                >
                  Edit
                </Link>
              </div>

              {/* Date & Time */}
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">
                    Schedule
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#171717]">
                    {formatDateDisplay(bookingDate)}
                  </p>
                  <p className="mt-0.5 text-sm text-[#737373]">
                    {formatTimeDisplay(startTime)} – {formatTimeDisplay(endTime)} (
                    {formatHours(durationHours)})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-[#3B82F6] hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Vehicle */}
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">
                    Vehicle
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#171717]">{vehicleType}</p>
                  <p className="mt-0.5 font-mono text-sm text-[#737373]">{vehicleNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-medium text-[#3B82F6] hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">
                  Fare breakdown
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-[#737373]">
                    <span>
                      {formatINR(location.price_per_hour)} × {formatHours(durationHours)}
                    </span>
                    <span>{formatINR(estimatedTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#737373]">
                    <span>Booking fee</span>
                    <span>{formatINR(0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E9EDF2] pt-3 font-heading text-lg font-semibold text-[#171717]">
                    <span>Total</span>
                    <span>{formatINR(estimatedTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button size="lg" onClick={handleNext}>
                Continue to payment
                <ArrowRight className="arrow-slide h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT */}
        {step === 4 && (
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
                Step 4 of 4
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold text-[#171717]">
                Payment method
              </h1>
            </div>

            <div className="space-y-3 rounded-[24px] border border-[#E9EDF2] bg-white p-6">
              {/* Pay at venue */}
              <div className="flex items-center justify-between rounded-[20px] border-2 border-[#3B82F6] bg-[#EFF6FF]/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6] text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#171717]">Pay at venue</p>
                    <p className="text-xs text-[#737373]">
                      Settle {formatINR(estimatedTotal)} via UPI or cash when exiting
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#3B82F6]">
                  Recommended
                </span>
              </div>

              {/* Card / UPI disabled */}
              <div
                aria-disabled="true"
                className="flex cursor-not-allowed items-center justify-between rounded-[20px] border border-[#E9EDF2] bg-[#F9FAFB] p-4 opacity-70"
              >
                <div>
                  <p className="text-sm font-medium text-[#737373]">Card / UPI online</p>
                  <p className="text-xs text-[#737373]">Instant pre-authorized checkout</p>
                </div>
                <span className="rounded-full border border-[#E9EDF2] bg-white px-3 py-1 text-xs font-medium text-[#737373]">
                  Coming soon
                </span>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-4">
                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#737373]">
                  <Checkbox
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => {
                      setAcceptedTerms(Boolean(checked));
                      if (checked) setTermsError('');
                    }}
                    className="mt-0.5"
                  />
                  <span>
                    I confirm my arrival schedule and agree to ParkEase’s free cancellation policy up
                    to 1 hour before arrival.
                  </span>
                </label>
                {termsError && (
                  <p className="mt-2 text-xs font-medium text-red-600">{termsError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" size="lg" disabled={submitting} onClick={() => setStep(3)}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button size="lg" disabled={submitting} onClick={handleConfirmBooking}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    Confirm booking · {formatINR(estimatedTotal)}
                    <ArrowRight className="arrow-slide h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
