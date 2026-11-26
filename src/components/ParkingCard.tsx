import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { formatINR } from '@/lib/format';
import type { ParkingLocation } from '@/types';

interface ParkingCardProps {
  location: ParkingLocation;
}

export function ParkingCard({ location }: ParkingCardProps) {
  const visibleFacilities = location.facilities.slice(0, 3);
  const extraCount = Math.max(0, location.facilities.length - 3);

  return (
    <Link
      to={`/parking/${location.id}`}
      className="surface-card group flex flex-col overflow-hidden rounded-[24px] p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
    >
      <div className="photo-frame relative h-44 w-full overflow-hidden rounded-[20px]">
        <img
          src={location.images[0]}
          alt={location.name}
          loading="lazy"
          className="h-full w-full rounded-[18px] object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50/95 px-3 py-1 text-xs font-medium text-emerald-700 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {location.available_slots} slots free
        </div>
        <div className="glass-chip absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-[#171717]">
          <Star className="h-3.5 w-3.5 fill-[#3B82F6] text-[#3B82F6]" />
          <span>{location.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-[#171717]">
          {location.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#737373]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
          <span className="truncate">
            {location.area}, {location.city}
          </span>
          <span className="text-[#cbd5e1]">·</span>
          <span className="shrink-0">{location.distance_km.toFixed(1)} km</span>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {visibleFacilities.map((facility) => (
            <span
              key={facility}
              className="rounded-full border border-[#E9EDF2] bg-[#F9FAFB] px-2.5 py-0.5 text-xs font-medium text-[#737373]"
            >
              {facility}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-medium text-[#3B82F6]">
              +{extraCount} more
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#E9EDF2] pt-3.5 mt-4">
          <div className="text-sm text-[#737373]">
            <span className="font-heading text-base font-semibold text-[#171717]">
              {formatINR(location.price_per_hour)}
            </span>{' '}
            / hour
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#E9EDF2] px-3.5 py-1.5 text-xs font-medium text-[#171717] transition-colors group-hover:border-[#3B82F6] group-hover:bg-[#EFF6FF] group-hover:text-[#3B82F6]">
            Reserve
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ParkingCardSkeleton() {
  return (
    <div className="rounded-[24px] border border-[#E9EDF2] bg-white p-3">
      <div className="h-44 w-full animate-pulse rounded-[20px] bg-[#F3F5F8]" />
      <div className="space-y-3 px-2 pb-2 pt-4">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-[#F3F5F8]" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-[#F3F5F8]" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 animate-pulse rounded-full bg-[#F3F5F8]" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-[#F3F5F8]" />
        </div>
        <div className="flex items-center justify-between border-t border-[#E9EDF2] pt-3.5">
          <div className="h-5 w-20 animate-pulse rounded-full bg-[#F3F5F8]" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-[#F3F5F8]" />
        </div>
      </div>
    </div>
  );
}
