import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  Star,
  Zap,
  Accessibility,
  ShieldCheck,
  CarFront,
  Navigation,
  Check,
  Building2,
} from 'lucide-react';
import {
  createReview,
  fetchLocationById,
  fetchReviewsByLocation,
  fetchSlotsByLocation,
} from '@/services/api';
import { formatINR } from '@/lib/format';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ParkingLocation, ParkingSlot, Review } from '@/types';

const ROWS: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

export function ParkingDetailPage() {
  const { parkingId } = useParams<{ parkingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [location, setLocation] = useState<ParkingLocation | null>(null);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSlotCode, setSelectedSlotCode] = useState<string | null>(null);
  const [hours, setHours] = useState(2);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!parkingId) return;
    let active = true;
    setLoading(true);
    Promise.all([
      fetchLocationById(parkingId),
      fetchSlotsByLocation(parkingId),
      fetchReviewsByLocation(parkingId),
    ])
      .then(([loc, sl, rev]) => {
        if (!active) return;
        setLocation(loc);
        setSlots(sl);
        setReviews(rev);
        setActiveImageIdx(0);
        setSelectedSlotCode(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [parkingId]);

  const groupedRows = useMemo(() => {
    const map: Record<'A' | 'B' | 'C' | 'D', ParkingSlot[]> = {
      A: [],
      B: [],
      C: [],
      D: [],
    };
    for (const slot of slots) {
      if (map[slot.row]) {
        map[slot.row].push(slot);
      }
    }
    return map;
  }, [slots]);

  const freeCount = useMemo(
    () => slots.filter((s) => s.status === 'available').length,
    [slots],
  );

  const selectedSlot = useMemo(
    () => slots.find((s) => s.code === selectedSlotCode) ?? null,
    [slots, selectedSlotCode],
  );

  const handleContinue = () => {
    if (!location || !selectedSlotCode) return;
    const targetUrl = `/book/${location.id}?slot=${encodeURIComponent(
      selectedSlotCode,
    )}&hours=${hours}`;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
      return;
    }
    navigate(targetUrl);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !user) return;
    setSubmittingReview(true);
    try {
      const created = await createReview(location.id, reviewRating, reviewComment, user);
      setReviews((prev) => [created, ...prev]);
      setReviewComment('');
      toast({ title: 'Review published', description: 'Thanks for sharing your experience.', variant: 'success' });
    } catch (err) {
      toast({
        title: 'Could not submit review',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'error',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="h-5 w-32 animate-pulse rounded-full bg-[#F3F5F8]" />
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="h-[340px] animate-pulse rounded-[24px] bg-[#F3F5F8]" />
            <div className="h-10 w-2/3 animate-pulse rounded-full bg-[#F3F5F8]" />
            <div className="h-64 animate-pulse rounded-[24px] bg-[#F3F5F8]" />
          </div>
          <div className="h-80 animate-pulse rounded-[24px] bg-[#F3F5F8]" />
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-[#171717]">
          Location not found
        </h1>
        <p className="mt-2 text-sm text-[#737373]">
          The parking facility you are looking for may have moved or is unavailable.
        </p>
        <Button asChild className="mt-6">
          <Link to="/explore">Back to explore</Link>
        </Button>
      </div>
    );
  }

  const estimatedTotal = Math.round(location.price_per_hour * hours);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      {/* Breadcrumb Back Link */}
      <Link
        to="/explore"
        className="hover-lift inline-flex items-center gap-1.5 text-sm font-medium text-[#737373] hover:text-[#171717]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to explore
      </Link>

      <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]">
        {/* LEFT COLUMN */}
        <div className="space-y-10">
          {/* Gallery */}
          <div>
            <div className="photo-frame overflow-hidden rounded-[24px]">
              <img
                src={location.images[activeImageIdx] ?? location.images[0]}
                alt={`${location.name} view ${activeImageIdx + 1}`}
                className="h-[260px] w-full rounded-[22px] object-cover sm:h-[380px]"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {location.images.slice(0, 4).map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`View photo ${idx + 1}`}
                  className={cn(
                    'photo-frame overflow-hidden rounded-[18px] transition-all',
                    activeImageIdx === idx
                      ? 'ring-2 ring-[#3B82F6] ring-offset-2'
                      : 'opacity-75 hover:opacity-100',
                  )}
                >
                  <img
                    src={img}
                    alt={`${location.name} thumbnail ${idx + 1}`}
                    className="h-16 w-full rounded-[16px] object-cover sm:h-20"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Header Block */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-heading text-[32px] font-semibold tracking-tight text-[#171717] sm:text-[36px]">
                  {location.name}
                </h1>
                <p className="mt-2 flex items-start gap-1.5 text-sm text-[#737373]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                  <span>{location.address}</span>
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E9EDF2] bg-white px-3 py-1 text-xs font-semibold text-[#171717]">
                  <Star className="h-3.5 w-3.5 fill-[#3B82F6] text-[#3B82F6]" />
                  <span>{location.rating.toFixed(1)}</span>
                  <span className="font-normal text-[#737373]">
                    ({reviews.length} reviews)
                  </span>
                </div>
                <p className="mt-2 font-heading text-2xl font-semibold text-[#171717]">
                  {formatINR(location.price_per_hour)}
                  <span className="text-sm font-normal text-[#737373]"> / hour</span>
                </p>
              </div>
            </div>

            {/* Meta Row of 4 Glass Chips */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="glass-chip rounded-[18px] border border-[#E9EDF2] px-3.5 py-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#737373]">
                  <Clock className="h-3.5 w-3.5 text-[#3B82F6]" />
                  Hours
                </p>
                <p className="mt-1 text-sm font-medium text-[#171717]">{location.operating_hours}</p>
              </div>
              <div className="glass-chip rounded-[18px] border border-[#E9EDF2] px-3.5 py-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#737373]">
                  <Building2 className="h-3.5 w-3.5 text-[#3B82F6]" />
                  Type
                </p>
                <p className="mt-1 text-sm font-medium text-[#171717]">{location.parking_type}</p>
              </div>
              <div className="glass-chip rounded-[18px] border border-[#E9EDF2] px-3.5 py-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#737373]">
                  <CarFront className="h-3.5 w-3.5 text-[#3B82F6]" />
                  Total bays
                </p>
                <p className="mt-1 text-sm font-medium text-[#171717]">{location.total_slots} bays</p>
              </div>
              <div className="glass-chip rounded-[18px] border border-[#E9EDF2] px-3.5 py-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#737373]">
                  <Navigation className="h-3.5 w-3.5 text-[#3B82F6]" />
                  Distance
                </p>
                <p className="mt-1 text-sm font-medium text-[#171717]">
                  {location.distance_km.toFixed(1)} km away
                </p>
              </div>
            </div>

            <p className="mt-6 text-[15px] leading-relaxed text-[#737373]">
              {location.description}
            </p>

            {/* Facilities */}
            <div className="mt-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
                Facilities
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {location.facilities.map((fac) => (
                  <span
                    key={fac}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E9EDF2] bg-white px-3.5 py-1.5 text-xs font-medium text-[#171717]"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[#3B82F6]" />
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SLOT SELECTION */}
          <section className="rounded-[24px] border border-[#E9EDF2] bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
                  Live bay map
                </p>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-[#171717]">
                  Choose your bay
                </h2>
              </div>
              <p className="rounded-full bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#3B82F6]">
                {freeCount} of {slots.length || location.total_slots} bays free
              </p>
            </div>

            {/* Bay Layout */}
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="inline-flex min-w-full items-stretch gap-4">
                {/* Vertical ENTRANCE marker */}
                <div className="flex w-8 shrink-0 items-center justify-center rounded-[14px] border border-[#E9EDF2] bg-[#F9FAFB]">
                  <span className="-rotate-90 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-[#737373]">
                    ENTRANCE
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {ROWS.map((row, rowIdx) => (
                    <React.Fragment key={row}>
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 text-xs font-semibold text-[#737373]">{row}</span>
                        <div className="flex flex-wrap gap-2.5">
                          {groupedRows[row].map((slot) => {
                            const isOccupied = slot.status !== 'available';
                            const isSelected = selectedSlotCode === slot.code;

                            return (
                              <button
                                key={slot.id}
                                type="button"
                                disabled={isOccupied}
                                onClick={() =>
                                  setSelectedSlotCode((prev) =>
                                    prev === slot.code ? null : slot.code,
                                  )
                                }
                                aria-label={`Bay ${slot.code}, ${slot.type}, ${slot.status}`}
                                className={cn(
                                  'relative flex h-[56px] w-[48px] flex-col items-center justify-center rounded-[14px] text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]',
                                  isOccupied &&
                                    'slot-occupied-hatch cursor-not-allowed border border-[#E9EDF2] text-[#737373]/60',
                                  !isOccupied &&
                                    !isSelected &&
                                    'border border-[#E9EDF2] bg-white text-[#171717] hover:border-[#3B82F6] hover:bg-[#EFF6FF]/60',
                                  isSelected &&
                                    'border border-[#3B82F6] bg-[#3B82F6] text-white ring-4 ring-[#EFF6FF]',
                                )}
                              >
                                <span>{slot.code}</span>
                                {slot.type === 'ev' && (
                                  <Zap
                                    className={cn(
                                      'mt-0.5 h-3 w-3',
                                      isSelected ? 'text-white' : 'text-[#3B82F6]',
                                    )}
                                  />
                                )}
                                {slot.type === 'accessible' && (
                                  <Accessibility
                                    className={cn(
                                      'mt-0.5 h-3 w-3',
                                      isSelected ? 'text-white' : 'text-[#3B82F6]',
                                    )}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dashed driving lane between rows B and C */}
                      {rowIdx === 1 && (
                        <div className="flex items-center gap-3 py-2 pl-7">
                          <div className="h-px flex-1 border-t border-dashed border-[#cbd5e1]" />
                          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#737373]">
                            Driving lane
                          </span>
                          <div className="h-px flex-1 border-t border-dashed border-[#cbd5e1]" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend Row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#E9EDF2] pt-4 text-xs text-[#737373]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-[4px] border border-[#E9EDF2] bg-white" />
                Available
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="slot-occupied-hatch h-3.5 w-3.5 rounded-[4px] border border-[#E9EDF2]" />
                Occupied
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-[4px] bg-[#3B82F6]" />
                Selected
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#3B82F6]" />
                EV charging
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Accessibility className="h-3.5 w-3.5 text-[#3B82F6]" />
                Accessible
              </span>
            </div>
          </section>

          {/* REVIEWS */}
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
                  Driver feedback
                </p>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-[#171717]">
                  Reviews
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-heading text-4xl font-semibold text-[#171717]">
                  {location.rating.toFixed(1)}
                </span>
                <div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < Math.round(location.rating)
                            ? 'fill-[#3B82F6] text-[#3B82F6]'
                            : 'text-[#E9EDF2]',
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-0.5 text-xs text-[#737373]">
                    Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>
            </div>

            {user && (
              <form
                onSubmit={handleReviewSubmit}
                className="rounded-[24px] border border-[#E9EDF2] bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#171717]">Leave a review</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        aria-label={`Rate ${star} stars`}
                        className="rounded-full p-1 hover:bg-[#EFF6FF]"
                      >
                        <Star
                          className={cn(
                            'h-4 w-4',
                            star <= reviewRating
                              ? 'fill-[#3B82F6] text-[#3B82F6]'
                              : 'text-[#cbd5e1]',
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share how your arrival and bay experience went..."
                    className="h-11 flex-1 rounded-full border border-[#E9EDF2] px-4 text-sm text-[#171717] placeholder:text-[#737373]/75 focus:border-[#3B82F6] focus:outline-none"
                  />
                  <Button type="submit" disabled={submittingReview || !reviewComment.trim()}>
                    {submittingReview ? 'Posting...' : 'Post review'}
                  </Button>
                </div>
              </form>
            )}

            {reviews.length === 0 ? (
              <div className="rounded-[24px] border border-[#E9EDF2] bg-white p-8 text-center">
                <p className="text-sm text-[#737373]">
                  No reviews yet for this facility. Be the first driver to review after parking.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-[24px] border border-[#E9EDF2] bg-white p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] font-heading text-xs font-semibold text-[#3B82F6]">
                          {rev.user_name.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#171717]">{rev.user_name}</p>
                          <p className="text-xs text-[#737373]">{rev.date_label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-3.5 w-3.5',
                              i < rev.rating
                                ? 'fill-[#3B82F6] text-[#3B82F6]'
                                : 'text-[#E9EDF2]',
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#737373]">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT STICKY SIDEBAR (380px) */}
        <aside className="lg:sticky lg:top-[108px]">
          <div className="glass-panel rounded-[24px] p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-heading text-2xl font-semibold text-[#171717]">
                  {formatINR(location.price_per_hour)}
                </span>
                <span className="text-sm text-[#737373]"> / hour</span>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {freeCount} bays open
              </span>
            </div>

            <div className="mt-6 space-y-4 rounded-[20px] border border-[#E9EDF2] bg-white/80 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#737373]">Selected bay</span>
                {selectedSlot ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-3 py-0.5 font-semibold text-[#3B82F6]">
                    <Check className="h-3.5 w-3.5" />
                    {selectedSlot.code}
                    {selectedSlot.type !== 'standard' && ` · ${selectedSlot.type.toUpperCase()}`}
                  </span>
                ) : (
                  <span className="font-medium text-[#737373]">No bay selected</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#737373]">Duration</span>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E9EDF2] bg-white px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setHours((h) => Math.max(1, h - 1))}
                    aria-label="Decrease hours"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium text-[#171717] hover:bg-[#EFF6FF]"
                  >
                    −
                  </button>
                  <span className="min-w-[44px] text-center text-xs font-semibold text-[#171717]">
                    {hours} {hours === 1 ? 'hr' : 'hrs'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHours((h) => Math.min(24, h + 1))}
                    aria-label="Increase hours"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium text-[#171717] hover:bg-[#EFF6FF]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-[#E9EDF2] pt-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#737373]">Estimated total</span>
                  <span className="font-heading text-xl font-semibold text-[#171717]">
                    {formatINR(estimatedTotal)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-5 w-full"
              disabled={!selectedSlot}
              onClick={handleContinue}
            >
              Continue to booking
              <ArrowRight className="arrow-slide h-4 w-4" />
            </Button>

            <p className="mt-3.5 text-center text-xs leading-relaxed text-[#737373]">
              Free cancellation up to 1 hour before arrival · Pay at the venue
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
