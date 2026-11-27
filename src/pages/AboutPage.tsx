import { Eye, ShieldCheck, Wind, Handshake } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { ClosingCta } from '@/components/ClosingCta';

const VALUES = [
  {
    icon: Eye,
    title: 'Clarity first',
    copy: 'Every bay number, hourly rate, and facility detail is visible before you start driving—never buried behind vague estimates.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe by default',
    copy: 'We partner only with well-lit, CCTV-monitored facilities featuring clear pedestrian walkways and staffed entry points.',
  },
  {
    icon: Wind,
    title: 'Fewer circling cars',
    copy: 'Knowing your exact bay beforehand cuts unnecessary lane-cruising, reducing congestion and idle emissions across Lucknow.',
  },
  {
    icon: Handshake,
    title: 'Fair to operators',
    copy: 'Transparent occupancy tracking helps local garage operators run higher utilisation without predatory surge commissions.',
  },
];

export function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
            About ParkEase
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] text-[#171717] sm:text-[52px]">
            Making every urban arrival calm, predictable, and effortless.
          </h1>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid grid-cols-1 gap-8 text-[15.5px] leading-relaxed text-[#737373] md:grid-cols-2">
            <p>
              Across busy hubs from Hazratganj to Gomti Nagar Extension, drivers spend up to twenty
              minutes every trip hunting for an open spot. Meanwhile, structured garages near
              Palassio Mall or Lulu Mall often sit partially empty simply because nobody can see what
              is free inside.
            </p>
            <p>
              ParkEase bridges that gap with real-time bay inventory, exact row selection, and
              instant digital passes. Whether you need an EV charger near IIIT Lucknow for two hours
              or a safe bay at Charbagh Metro, you arrive knowing your space is already waiting.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Wide Photographic Band */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Reveal>
          <div className="photo-frame overflow-hidden rounded-[30px]">
            <img
              src="/images/garage-ramp.jpg"
              alt="Architectural curved ramp inside a modern parking facility"
              className="h-[260px] w-full rounded-[28px] object-cover sm:h-[404px]"
            />
          </div>
        </Reveal>
      </section>

      {/* 2x2 Values Grid */}
      <section id="values" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
            Principles
          </p>
          <h2 className="mt-2 font-heading text-[28px] font-semibold tracking-tight text-[#171717] sm:text-[32px]">
            What guides every decision
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <Reveal key={val.title} delay={idx * 0.06}>
                <div className="rounded-[24px] border border-[#E9EDF2] bg-white p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-semibold text-[#171717]">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#737373]">{val.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <ClosingCta />
    </div>
  );
}
