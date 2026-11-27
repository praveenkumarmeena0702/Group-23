import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, List, Map as MapIcon, CarFront, X } from 'lucide-react';
import { fetchLocations } from '@/services/api';
import { formatINR } from '@/lib/format';
import { ParkingCard, ParkingCardSkeleton } from '@/components/ParkingCard';
import { ExploreMap } from '@/components/ExploreMap';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FacilityType, ParkingLocation, ParkingType } from '@/types';

const PARKING_TYPES: ParkingType[] = ['Covered', 'Open', 'Basement', 'Multi-level'];
const FACILITIES: FacilityType[] = ['CCTV', 'EV charging', 'Security', 'Valet', '24/7', 'Covered'];

type SortKey = 'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'distance';

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [selectedTypes, setSelectedTypes] = useState<ParkingType[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<FacilityType[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('recommended');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

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

  const toggleType = (type: ParkingType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleFacility = (fac: FacilityType) => {
    setSelectedFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac],
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setMaxPrice(200);
    setSelectedTypes([]);
    setSelectedFacilities([]);
    setSortBy('recommended');
    setSearchParams({});
  };

  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = locations.filter((loc) => {
      if (
        q &&
        !loc.name.toLowerCase().includes(q) &&
        !loc.area.toLowerCase().includes(q) &&
        !loc.address.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (loc.price_per_hour > maxPrice) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(loc.parking_type)) return false;
      if (
        selectedFacilities.length > 0 &&
        !selectedFacilities.every((f) => loc.facilities.includes(f))
      ) {
        return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price_per_hour - b.price_per_hour;
        case 'price_desc':
          return b.price_per_hour - a.price_per_hour;
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return a.distance_km - b.distance_km;
        case 'recommended':
        default:
          return b.popularity - a.popularity;
      }
    });
  }, [locations, searchQuery, maxPrice, selectedTypes, selectedFacilities, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    maxPrice < 200 ||
    selectedTypes.length > 0 ||
    selectedFacilities.length > 0 ||
    sortBy !== 'recommended';

  const FilterControls = (
    <div className="space-y-7">
      {/* Price slider */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#737373]">
            Max price / hour
          </p>
          <span className="font-heading text-sm font-semibold text-[#171717]">
            Up to {formatINR(maxPrice)}
          </span>
        </div>
        <div className="mt-4">
          <Slider
            min={20}
            max={200}
            step={5}
            value={[maxPrice]}
            onValueChange={(vals) => setMaxPrice(vals[0] ?? 200)}
            aria-label="Maximum price per hour"
          />
          <div className="mt-2 flex justify-between text-xs text-[#737373]">
            <span>{formatINR(20)}</span>
            <span>{formatINR(200)}</span>
          </div>
        </div>
      </div>

      {/* Parking type */}
      <div className="border-t border-[#E9EDF2] pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#737373]">
          Parking type
        </p>
        <div className="mt-3.5 space-y-2.5">
          {PARKING_TYPES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-[#171717]"
            >
              <Checkbox
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggleType(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Facilities */}
      <div className="border-t border-[#E9EDF2] pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#737373]">
          Facilities
        </p>
        <div className="mt-3.5 space-y-2.5">
          {FACILITIES.map((fac) => (
            <label
              key={fac}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-[#171717]"
            >
              <Checkbox
                checked={selectedFacilities.includes(fac)}
                onCheckedChange={() => toggleFacility(fac)}
              />
              <span>{fac}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="border-t border-[#E9EDF2] pt-6">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#737373]">
          Sort by
        </p>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
          <SelectTrigger aria-label="Sort parking locations">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="price_asc">Price: low to high</SelectItem>
            <SelectItem value="price_desc">Price: high to low</SelectItem>
            <SelectItem value="rating">Highest rated</SelectItem>
            <SelectItem value="distance">Nearest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="border-t border-[#E9EDF2] pt-5">
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-medium text-[#3B82F6] transition-colors hover:text-[#171717]"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="pb-20">
      {/* Sticky Sub-Header */}
      <div className="sticky top-[76px] z-30 border-b border-[#E9EDF2] bg-white/90 backdrop-blur-md md:top-[88px]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, garage, or street..."
              aria-label="Search parking locations"
              className="h-10 w-full rounded-full border border-[#E9EDF2] bg-white pl-10 pr-8 text-sm text-[#171717] placeholder:text-[#737373]/75 focus:border-[#3B82F6] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#737373] hover:bg-[#EFF6FF] hover:text-[#171717]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden text-sm text-[#737373] sm:inline">
              {loading
                ? 'Loading locations...'
                : `${filteredLocations.length} ${
                    filteredLocations.length === 1 ? 'location' : 'locations'
                  }`}
            </span>

            {/* Mobile filter button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </Button>

            {/* List / Map Segmented Toggle */}
            <div
              role="group"
              aria-label="Results view mode"
              className="inline-flex rounded-full border border-[#E9EDF2] bg-[#F9FAFB] p-1"
            >
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#EFF6FF] text-[#3B82F6]'
                    : 'text-[#737373] hover:text-[#171717]'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-[#EFF6FF] text-[#3B82F6]'
                    : 'text-[#737373] hover:text-[#171717]'
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" />
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
            Lucknow Network
          </p>
          <h1 className="mt-2 font-heading text-[32px] font-semibold tracking-tight text-[#171717] sm:text-[40px]">
            Explore verified parking
          </h1>
          <p className="mt-1 text-sm text-[#737373] sm:hidden">
            {loading ? 'Loading...' : `${filteredLocations.length} locations available`}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop Left Filter Rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-[160px] rounded-[24px] border border-[#E9EDF2] bg-white p-6">
              {FilterControls}
            </div>
          </aside>

          {/* Results Area */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ParkingCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[24px] border border-[#E9EDF2] bg-white px-6 py-16 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
                  <CarFront className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-heading text-xl font-semibold text-[#171717]">
                  No parking matches those filters
                </h2>
                <p className="mt-1.5 max-w-sm text-sm text-[#737373]">
                  Try widening your hourly price limit or clearing one of the facility filters.
                </p>
                <Button variant="outline" className="mt-6" onClick={resetFilters}>
                  Reset filters
                </Button>
              </div>
            ) : viewMode === 'map' ? (
              <ExploreMap locations={filteredLocations} />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredLocations.map((loc) => (
                  <ParkingCard key={loc.id} location={loc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Dialog */}
      <Dialog open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter locations</DialogTitle>
          </DialogHeader>
          <div className="mt-4">{FilterControls}</div>
          <div className="mt-6">
            <Button className="w-full" onClick={() => setMobileFilterOpen(false)}>
              Show {filteredLocations.length} results
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
