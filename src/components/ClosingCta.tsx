import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/Reveal';

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <Reveal>
        <div className="rounded-[30px] bg-[#171717] px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
                Ready when you drive
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Reserve your next bay before you start the engine.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                Browse live Mumbai availability across Bandra, BKC, Marine Drive, and Lower Parel
                with zero booking fees.
              </p>
            </div>
            <Button asChild variant="white" size="lg" className="shrink-0">
              <Link to="/explore">
                Explore parking
                <ArrowRight className="arrow-slide h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
