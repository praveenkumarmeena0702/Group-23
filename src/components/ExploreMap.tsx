import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { formatINR } from '@/lib/format';
import type { ParkingLocation } from '@/types';

interface ExploreMapProps {
  locations: ParkingLocation[];
}

function createPinIcon(price: number) {
  return L.divIcon({
    className: 'parkease-map-pin',
    html: `<div style="display:inline-flex;align-items:center;justify-content:center;padding:5px 10px;border-radius:9999px;background:#171717;color:#ffffff;font-family:'Inter Tight',sans-serif;font-size:12px;font-weight:600;border:2px solid #ffffff;box-shadow:0 8px 20px rgba(16,24,40,0.22);white-space:nowrap;">${formatINR(price)}</div>`,
    iconSize: [58, 28],
    iconAnchor: [29, 14],
    popupAnchor: [0, -14],
  });
}

export function ExploreMap({ locations }: ExploreMapProps) {
  const center = useMemo<[number, number]>(() => {
    if (locations.length === 0) return [26.83, 80.97];
    const avgLat = locations.reduce((sum, l) => sum + l.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, l) => sum + l.lng, 0) / locations.length;
    return [avgLat, avgLng];
  }, [locations]);

  return (
    <div className="photo-frame overflow-hidden rounded-[24px]">
      <div className="h-[540px] w-full overflow-hidden rounded-[22px]">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createPinIcon(loc.price_per_hour)}
            >
              <Popup>
                <div className="min-w-[200px] p-1.5 font-sans">
                  <p className="font-heading text-sm font-semibold text-[#171717]">{loc.name}</p>
                  <p className="mt-0.5 text-xs text-[#737373]">
                    {loc.area} · {loc.available_slots} slots free
                  </p>
                  <div className="mt-2.5 flex items-center justify-between border-t border-[#E9EDF2] pt-2">
                    <span className="text-xs font-semibold text-[#171717]">
                      {formatINR(loc.price_per_hour)} / hr
                    </span>
                    <Link
                      to={`/parking/${loc.id}`}
                      className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#3B82F6] hover:bg-[#dbeafe]"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
