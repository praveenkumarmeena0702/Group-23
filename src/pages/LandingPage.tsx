import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  MapPin,
  Radar,
  ShieldCheck,
  ReceiptIndianRupee,
  RotateCcw,
  Zap,
  Smartphone,
  Star,
  Search,
  LayoutGrid,
  CarFront,
} from 'lucide-react';
import { fetchLocations } from '@/services/api';
import { getTodayISO } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { ParkingCard, ParkingCardSkeleton } from '@/components/ParkingCard';
import { Reveal } from '@/components/Reveal';
import { ClosingCta } from '@/components/ClosingCta';
import type { ParkingLocation } from '@/types';

const SUGGESTED_AREAS = [
  'Palassio Mall',
  'Lulu Mall',
  'IIIT Lucknow',
  'Hazratganj',
  'Gomti Nagar',
  'Charbagh',
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    title: 'Search your area',
    copy: 'Enter where and when you are heading across Lucknow to see live open bays.',
  },
  {
    step: '02',
    icon: LayoutGrid,
    title: 'Pick your exact bay',
    copy: 'Inspect the interactive row layout and choose standard, EV, or accessible slots.',
  },
  {
    step: '03',
    icon: CarFront,
    title: 'Park and go',
    copy: 'Show your digital pass code at the barrier and settle effortlessly at the venue.',
  },
];

const BENEFITS = [
  {
    icon: Radar,
    title: 'Real-time availability',
    copy: 'Every bay status updates atomically as drivers arrive, reserve, or cancel.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified & monitored',
    copy: 'Every garage is audited for lighting, CCTV coverage, and 24/7 entry access.',
  },
  {
    icon: ReceiptIndianRupee,
    title: 'Transparent pricing',
    copy: 'Clear hourly rates in INR upfront with zero hidden platform or convenience fees.',
  },
  {
    icon: RotateCcw,
    title: 'Free cancellation',
    copy: 'Plans shifted? Cancel up to 1 hour before arrival with a single click.',
  },
  {
    icon: Zap,
    title: 'Instant confirmation',
    copy: 'Receive your PE booking code and scannable pass immediately on checkout.',
  },
  {
    icon: Smartphone,
    title: 'No app needed',
    copy: 'Reserve from any mobile or desktop browser without downloading extra software.',
  },
];

const STATS = [
  { value: '240+', label: 'Managed bays' },
  { value: '10', label: 'Lucknow locations' },
  { value: '4.9', label: 'Average rating' },
  { value: '24/7', label: 'Driver support' },
];

const TESTIMONIALS = [
  {
    initials: 'RM',
    name: 'Rhea Malhotra',
    role: 'Architect, Gomti Nagar',
    quote:
      'Picking my exact bay near Palassio Mall before leaving home completely removed the fifteen-minute weekend circling ritual.',
  },
  {
    initials: 'AK',
    name: 'Aditya Kulkarni',
    role: 'Software Engineer, IIIT Lucknow',
    quote:
      'Clean, fast, and reliable. I book Row A EV bays at IIIT Lucknow College Parking whenever I visit C.G. City for events.',
  },
  {
    initials: 'NS',
    name: 'Nandini Shah',
    role: 'Retail Owner, Hazratganj',
    quote:
      'Transparent hourly rates with zero surprise surcharges at the gate. The pass QR opens cleanly even offline.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [time, setTime] = useState('10:00');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let active = true;
    fetchLocations()
      .then((list) => {
        if (active) setLocations(list);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const popularLocations = locations.filter((l) => l.featured).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (date) params.set('date', date);
    if (time) params.set('time', time);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div>
      {/* HERO SECTION WITH FAINT DOT GRID */}
      <section className="relative overflow-hidden pb-12 pt-10 sm:pb-16 sm:pt-16">
        <div aria-hidden="true" className="hero-dot-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-[900px]">
            <Reveal delay={0}>
              <div className="glass-chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-[#171717]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live availability · updated in real time
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 font-heading text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] text-[#171717] sm:text-[52px]">
                Skip the search.
                <br />
                Reserve your parking bay in seconds.
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-[#737373]">
                Browse verified covered, basement, and EV-ready parking across Lucknow. Choose your
                exact bay on the floor map and drive straight in with an instant digital pass.
              </p>
            </Reveal>

            {/* Glass Search Card */}
            <Reveal delay={0.18}>
              <form
                onSubmit={handleSearch}
                className="glass-panel mt-8 rounded-[28px] p-2.5 sm:rounded-full sm:p-2"
              >
                <div className="flex flex-col divide-y divide-[#E9EDF2] sm:flex-row sm:items-center sm:divide-x sm:divide-y-0">
                  {/* Where */}
                  <div className="relative flex-1 px-4 py-2.5 sm:py-2">
                    <label
                      htmlFor="hero-where"
                      className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#737373]"
                    >
                      Where
                    </label>
                    <div className="mt-0.5 flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                      <input
                        id="hero-where"
                        type="text"
                        value={query}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 160)}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Palassio Mall, Lulu Mall, IIIT Lucknow..."
                        className="w-full bg-transparent text-sm font-medium text-[#171717] placeholder:text-[#737373]/70 focus:outline-none"
                      />
                    </div>
                    {showSuggestions && (
                      <div className="absolute left-0 top-full z-30 mt-3 w-full min-w-[220px] rounded-[20px] border border-[#E9EDF2] bg-white p-2 shadow-glass">
                        <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3B82F6]">
                          Popular areas
                        </p>
                        {SUGGESTED_AREAS.filter((a) =>
                          a.toLowerCase().includes(query.toLowerCase()),
                        ).map((area) => (
                          <button
                            key={area}
                            type="button"
                            onMouseDown={() => {
                              setQuery(area);
                              setShowSuggestions(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-left text-sm text-[#171717] hover:bg-[#EFF6FF] hover:text-[#3B82F6]"
                          >
                            <MapPin className="h-3.5 w-3.5 text-[#3B82F6]" />
                            {area}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="px-4 py-2.5 sm:w-44 sm:py-2">
                    <label
                      htmlFor="hero-date"
                      className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#737373]"
                    >
                      Date
                    </label>
                    <div className="mt-0.5 flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                      <input
                        id="hero-date"
                        type="date"
                        min={getTodayISO()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-[#171717] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Arrival Time */}
                  <div className="px-4 py-2.5 sm:w-40 sm:py-2">
                    <label
                      htmlFor="hero-time"
                      className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#737373]"
                    >
                      Arrival time
                    </label>
                    <div className="mt-0.5 flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                      <input
                        id="hero-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-[#171717] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-2 sm:pl-2 sm:pt-0">
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      Find parking
                      <ArrowRight className="arrow-slide h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </Reveal>

            {/* Trust markers */}
            <Reveal delay={0.24}>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#737373]">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#3B82F6]" />
                  No booking fee
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#3B82F6]" />
                  Free cancellation up to 1 hour
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#3B82F6]" />
                  Verified facilities
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WIDE PHOTOGRAPHIC BAND */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <Reveal>
          <div className="photo-frame overflow-hidden rounded-[30px]">
            <img
              src="/images/hero-garage.jpg"
              alt="Clean modern covered parking garage interior"
              className="h-[260px] w-full rounded-[28px] object-cover sm:h-[404px]"
            />
          </div>
        </Reveal>
      </section>

      {/* POPULAR LOCATIONS */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
                Popular locations
              </p>
              <h2 className="mt-2 font-heading text-[28px] font-semibold tracking-tight text-[#171717] sm:text-[32px]">
                High-demand Lucknow garages
              </h2>
            </div>
            <Link
              to="/explore"
              className="hover-lift inline-flex items-center gap-1.5 text-sm font-medium text-[#171717] hover:text-[#3B82F6]"
            >
              View all
              <ArrowRight className="arrow-slide h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => <ParkingCardSkeleton key={idx} />)
            : popularLocations.map((loc, idx) => (
                <Reveal key={loc.id} delay={idx * 0.06}>
                  <ParkingCard location={loc} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
            How it works
          </p>
          <h2 className="mt-2 font-heading text-[28px] font-semibold tracking-tight text-[#171717] sm:text-[32px]">
            Three steps from street to bay
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.step} delay={idx * 0.06}>
                <div className="rounded-[24px] border border-[#E9EDF2] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-4xl font-semibold tracking-tight text-[#E9EDF2]">
                      {item.step}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-semibold text-[#171717]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#737373]">{item.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* WHY PARKEASE (3x2 GRID) */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
            Why ParkEase
          </p>
          <h2 className="mt-2 font-heading text-[28px] font-semibold tracking-tight text-[#171717] sm:text-[32px]">
            Built for calm city arrivals
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={idx * 0.06}>
                <div className="rounded-[24px] border border-[#E9EDF2] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-[#171717]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#737373]">{item.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* STATS BAND */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Reveal>
          <div className="grid grid-cols-2 divide-y divide-[#E9EDF2] rounded-[28px] border border-[#E9EDF2] bg-white sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-6 py-8 text-center">
                <p className="font-heading text-4xl font-semibold tracking-tight text-[#171717] sm:text-[44px]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
            Driver notes
          </p>
          <h2 className="mt-2 font-heading text-[28px] font-semibold tracking-tight text-[#171717] sm:text-[32px]">
            Trusted by daily Lucknow drivers
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 0.06}>
              <div className="flex h-full flex-col rounded-[24px] border border-[#E9EDF2] bg-white p-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className="h-4 w-4 fill-[#3B82F6] text-[#3B82F6]"
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[#171717]">
                  “{t.quote}”
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-[#E9EDF2] pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] font-heading text-sm font-semibold text-[#3B82F6]">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#171717]">{t.name}</p>
                    <p className="text-xs text-[#737373]">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <ClosingCta />
    </div>
  );
}
