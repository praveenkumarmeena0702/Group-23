import type { ParkingLocation, ParkingSlot, Review } from '@/types';

const IMAGES = {
  hero: '/images/hero-garage.jpg',
  entrance: '/images/garage-entrance.jpg',
  ramp: '/images/garage-ramp.jpg',
  basement: '/images/tower-basement.jpg',
  coastal: '/images/coastal-open.jpg',
  plaza: '/images/street-plaza.jpg',
};

export const SEED_LOCATIONS: ParkingLocation[] = [
  {
    id: 'palassio-mall-parking',
    name: 'Phoenix Palassio Mall Parking',
    area: 'Gomti Nagar Extension',
    city: 'Lucknow',
    address: 'Amar Shaheed Path, Sector 7, Gomti Nagar Extension, Lucknow 226010',
    description:
      'Multi-level smart garage serving Phoenix Palassio Mall with wide turning radii, license-plate entry cameras, and dedicated fast-charge EV bays on Row A right off Shaheed Path.',
    images: [IMAGES.hero, IMAGES.ramp, IMAGES.entrance, IMAGES.basement],
    price_per_hour: 60,
    rating: 4.9,
    review_count: 3,
    total_slots: 24,
    available_slots: 21,
    parking_type: 'Multi-level',
    facilities: ['CCTV', 'EV charging', 'Security', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 1.1,
    popularity: 99,
    featured: true,
    lat: 26.8091,
    lng: 81.0125,
  },
  {
    id: 'lulu-mall-parking',
    name: 'Lulu Mall Multi-Level Parking',
    area: 'Sushant Golf City',
    city: 'Lucknow',
    address: 'Amar Shaheed Path, Sushant Golf City, Lucknow 226030',
    description:
      'High-capacity covered parking deck adjacent to Lulu Mall Lucknow. Features bright LED row guidance, contactless pass scanning, and direct lift access to the mall atrium.',
    images: [IMAGES.basement, IMAGES.plaza, IMAGES.hero, IMAGES.ramp],
    price_per_hour: 50,
    rating: 4.9,
    review_count: 3,
    total_slots: 24,
    available_slots: 20,
    parking_type: 'Multi-level',
    facilities: ['CCTV', 'EV charging', 'Security', 'Valet', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 1.4,
    popularity: 98,
    featured: true,
    lat: 26.7834,
    lng: 80.9901,
  },
  {
    id: 'iiit-lucknow-parking',
    name: 'IIIT Lucknow College Parking',
    area: 'Chak Ganjaria',
    city: 'Lucknow',
    address: 'Chak Ganjaria, C.G. City, Sultanpur Road, Lucknow 226002',
    description:
      'Verified campus-side covered and shaded bays near IIIT Lucknow College in C.G. City. Ideal for students, visiting faculty, and tech event attendees along Sultanpur Road.',
    images: [IMAGES.entrance, IMAGES.coastal, IMAGES.plaza, IMAGES.hero],
    price_per_hour: 30,
    rating: 4.8,
    review_count: 3,
    total_slots: 24,
    available_slots: 22,
    parking_type: 'Covered',
    facilities: ['CCTV', 'EV charging', 'Security', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 0.8,
    popularity: 96,
    featured: true,
    lat: 26.8007,
    lng: 81.0241,
  },
  {
    id: 'hazratganj-central-garage',
    name: 'Hazratganj Central Garage',
    area: 'Hazratganj',
    city: 'Lucknow',
    address: 'Mahatma Gandhi Marg, Near Janpath Market, Hazratganj, Lucknow 226001',
    description:
      'Weather-protected basement and plaza facility steps from Janpath Market and Hazratganj heritage arcades. Skip street congestion with pre-booked bays and optional valet handover.',
    images: [IMAGES.plaza, IMAGES.basement, IMAGES.hero, IMAGES.entrance],
    price_per_hour: 70,
    rating: 4.8,
    review_count: 3,
    total_slots: 24,
    available_slots: 20,
    parking_type: 'Basement',
    facilities: ['CCTV', 'Security', 'Valet', 'Covered'],
    operating_hours: '6:00 AM – 11:30 PM',
    distance_km: 0.6,
    popularity: 95,
    featured: true,
    lat: 26.8489,
    lng: 80.9462,
  },
  {
    id: 'gomti-nagar-summit-park',
    name: 'Gomti Nagar Summit Park',
    area: 'Gomti Nagar',
    city: 'Lucknow',
    address: 'Vibhuti Khand, Near Summit Building, Gomti Nagar, Lucknow 226010',
    description:
      'Modern corporate basement minutes from Vibhuti Khand business towers, cafés, and Wave Mall. Guarded 24/7 with zero-wait express exit lanes and EV charging.',
    images: [IMAGES.ramp, IMAGES.basement, IMAGES.hero, IMAGES.plaza],
    price_per_hour: 60,
    rating: 4.7,
    review_count: 3,
    total_slots: 24,
    available_slots: 21,
    parking_type: 'Basement',
    facilities: ['CCTV', 'EV charging', 'Security', 'Valet', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 1.9,
    popularity: 92,
    featured: true,
    lat: 26.8624,
    lng: 81.0077,
  },
  {
    id: 'ekana-stadium-park',
    name: 'Ekana Stadium Smart Park',
    area: 'Gomti Nagar Extension',
    city: 'Lucknow',
    address: 'Sector 7, Amar Shaheed Path, Near Ekana Cricket Stadium, Lucknow 226010',
    description:
      'Spacious multi-level deck built for smooth match-day arrivals and quick exits onto Shaheed Path. Clear row signage and floodlit walkways keep every bay effortless.',
    images: [IMAGES.ramp, IMAGES.hero, IMAGES.entrance, IMAGES.plaza],
    price_per_hour: 55,
    rating: 4.7,
    review_count: 3,
    total_slots: 24,
    available_slots: 22,
    parking_type: 'Multi-level',
    facilities: ['CCTV', 'Security', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 1.3,
    popularity: 90,
    featured: true,
    lat: 26.8116,
    lng: 81.0172,
  },
  {
    id: 'janeshwar-mishra-parking',
    name: 'Janeshwar Mishra Park Lot',
    area: 'Gomti Nagar',
    city: 'Lucknow',
    address: 'Gate 4, Gomti Nagar Extension Bypass, Lucknow 226010',
    description:
      'Open-air paved lot bordered by shaded avenues beside Janeshwar Mishra Park. Wide marked bays make morning walks, family picnics, and weekend visits effortless.',
    images: [IMAGES.coastal, IMAGES.plaza, IMAGES.entrance, IMAGES.hero],
    price_per_hour: 40,
    rating: 4.6,
    review_count: 3,
    total_slots: 24,
    available_slots: 21,
    parking_type: 'Open',
    facilities: ['CCTV', 'Security', 'EV charging'],
    operating_hours: '5:30 AM – 11:00 PM',
    distance_km: 2.4,
    popularity: 87,
    featured: false,
    lat: 26.8371,
    lng: 80.9924,
  },
  {
    id: 'charbagh-station-parking',
    name: 'Charbagh Metro & Rail Hub',
    area: 'Charbagh',
    city: 'Lucknow',
    address: 'Station Road, Near Charbagh Metro Station, Lucknow 226004',
    description:
      'Value park-and-ride covered structure connected to Charbagh Metro and Lucknow Junction railway terminal. Designed for daily commuters and intercity travellers.',
    images: [IMAGES.entrance, IMAGES.basement, IMAGES.ramp, IMAGES.hero],
    price_per_hour: 40,
    rating: 4.5,
    review_count: 3,
    total_slots: 24,
    available_slots: 22,
    parking_type: 'Covered',
    facilities: ['CCTV', 'Security', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 2.8,
    popularity: 85,
    featured: false,
    lat: 26.8317,
    lng: 80.9209,
  },
  {
    id: 'alambagh-transit-garage',
    name: 'Alambagh Transit Garage',
    area: 'Alambagh',
    city: 'Lucknow',
    address: 'Kanpur Road, Near Alambagh Bus Terminal, Lucknow 226005',
    description:
      'Clean covered parking along Kanpur Road steps from Alambagh Metro and ISBT terminal. Reliable 24/7 security and wide bays for family SUVs and airport transfers.',
    images: [IMAGES.hero, IMAGES.entrance, IMAGES.plaza, IMAGES.basement],
    price_per_hour: 45,
    rating: 4.5,
    review_count: 3,
    total_slots: 24,
    available_slots: 20,
    parking_type: 'Covered',
    facilities: ['CCTV', 'Security', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 3.5,
    popularity: 83,
    featured: false,
    lat: 26.8124,
    lng: 80.9036,
  },
  {
    id: 'aminabad-heritage-parking',
    name: 'Aminabad Heritage Parking',
    area: 'Aminabad',
    city: 'Lucknow',
    address: 'Latouche Road, Near Pratap Market, Aminabad, Lucknow 226018',
    description:
      'Discreet multi-level parking tucked just off bustling Aminabad markets. Eliminates narrow-lane parking stress near Tunday Kababi and Chowk heritage bazaars.',
    images: [IMAGES.plaza, IMAGES.ramp, IMAGES.entrance, IMAGES.hero],
    price_per_hour: 50,
    rating: 4.4,
    review_count: 3,
    total_slots: 24,
    available_slots: 21,
    parking_type: 'Multi-level',
    facilities: ['CCTV', 'Security', 'Covered'],
    operating_hours: '7:00 AM – 11:30 PM',
    distance_km: 3.1,
    popularity: 81,
    featured: false,
    lat: 26.8467,
    lng: 80.9277,
  },
];

// Deterministic occupied slots per location (2 to 4 occupied per location)
const OCCUPIED_BY_LOCATION: Record<string, string[]> = {
  'palassio-mall-parking': ['A03', 'B02', 'C05'],
  'lulu-mall-parking': ['A02', 'B04', 'C01', 'D03'],
  'iiit-lucknow-parking': ['B05', 'D02'],
  'hazratganj-central-garage': ['A04', 'B01', 'C03', 'D05'],
  'gomti-nagar-summit-park': ['A05', 'C02', 'D04'],
  'ekana-stadium-park': ['B03', 'C06'],
  'janeshwar-mishra-parking': ['A02', 'C04', 'D01'],
  'charbagh-station-parking': ['A06', 'D02'],
  'alambagh-transit-garage': ['A04', 'B02', 'C05', 'D06'],
  'aminabad-heritage-parking': ['B01', 'C03', 'D04'],
};

const EV_CODES = new Set(['A01', 'A02', 'A05']);
const ACCESSIBLE_CODES = new Set(['D01', 'D06']);

export function buildSeedSlots(): ParkingSlot[] {
  const rows: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  const slots: ParkingSlot[] = [];

  for (const loc of SEED_LOCATIONS) {
    const occupiedSet = new Set(OCCUPIED_BY_LOCATION[loc.id] || ['B02', 'C04']);
    for (const row of rows) {
      for (let num = 1; num <= 6; num += 1) {
        const code = `${row}0${num}`;
        const type = EV_CODES.has(code)
          ? 'ev'
          : ACCESSIBLE_CODES.has(code)
            ? 'accessible'
            : 'standard';
        const status = occupiedSet.has(code) ? 'occupied' : 'available';
        slots.push({
          id: `${loc.id}-${code}`,
          location_id: loc.id,
          code,
          row,
          type,
          status,
        });
      }
    }
  }
  return slots;
}

export const SEED_REVIEWS: Review[] = [
  // Phoenix Palassio Mall Parking
  { id: 'rev-1', location_id: 'palassio-mall-parking', user_name: 'Aarav', rating: 5, comment: 'Spotless garage right off Shaheed Path. Selected A01 near the EV charger and walked straight into Palassio Mall.', date_label: '18 Nov 2026' },
  { id: 'rev-2', location_id: 'palassio-mall-parking', user_name: 'Diya', rating: 5, comment: 'Super bright lighting and friendly security staff. Way calmer than weekend mall queues.', date_label: '11 Nov 2026' },
  { id: 'rev-3', location_id: 'palassio-mall-parking', user_name: 'Rohan', rating: 5, comment: 'Wide bays even for an SUV. QR pass scan at the boom barrier took two seconds.', date_label: '3 Nov 2026' },

  // Lulu Mall Multi-Level Parking
  { id: 'rev-4', location_id: 'lulu-mall-parking', user_name: 'Ananya', rating: 5, comment: 'Saved us twenty minutes on a Sunday evening at Lulu Mall. Direct elevator access to the food court.', date_label: '20 Nov 2026' },
  { id: 'rev-5', location_id: 'lulu-mall-parking', user_name: 'Kabir', rating: 5, comment: 'Covered bays keep the car cool even in warm Lucknow afternoons. Transparent pricing.', date_label: '12 Nov 2026' },
  { id: 'rev-6', location_id: 'lulu-mall-parking', user_name: 'Meera', rating: 4, comment: 'Very neat facility and quick valet option when we arrived for dinner.', date_label: '29 Oct 2026' },

  // IIIT Lucknow College Parking
  { id: 'rev-7', location_id: 'iiit-lucknow-parking', user_name: 'Vikram', rating: 5, comment: 'Super convenient right outside IIIT Lucknow College in CG City. Loved picking bay B03 beforehand.', date_label: '19 Nov 2026' },
  { id: 'rev-8', location_id: 'iiit-lucknow-parking', user_name: 'Ishita', rating: 5, comment: 'Clean shaded bays and reliable EV charging availability on Row A during tech fest.', date_label: '8 Nov 2026' },
  { id: 'rev-9', location_id: 'iiit-lucknow-parking', user_name: 'Siddharth', rating: 4, comment: 'Easy access from Sultanpur Road and affordable hourly rate for full-day campus visits.', date_label: '1 Nov 2026' },

  // Hazratganj Central Garage
  { id: 'rev-10', location_id: 'hazratganj-central-garage', user_name: 'Kavya', rating: 5, comment: 'Best parking in Hazratganj. Just steps from Janpath Market with instant pass verification.', date_label: '21 Nov 2026' },
  { id: 'rev-11', location_id: 'hazratganj-central-garage', user_name: 'Arjun', rating: 5, comment: 'Worth every rupee during evening shopping. Never have to circle MG Marg anymore.', date_label: '15 Nov 2026' },
  { id: 'rev-12', location_id: 'hazratganj-central-garage', user_name: 'Nisha', rating: 4, comment: 'Immaculate basement and attentive guards. Valet handover was smooth.', date_label: '6 Nov 2026' },

  // Gomti Nagar Summit Park
  { id: 'rev-13', location_id: 'gomti-nagar-summit-park', user_name: 'Dev', rating: 5, comment: 'Two-minute walk to Summit Building in Vibhuti Khand without evening traffic stress.', date_label: '17 Nov 2026' },
  { id: 'rev-14', location_id: 'gomti-nagar-summit-park', user_name: 'Priya', rating: 5, comment: 'Clear signage inside the basement and wide bays for large sedans.', date_label: '9 Nov 2026' },
  { id: 'rev-15', location_id: 'gomti-nagar-summit-park', user_name: 'Karan', rating: 4, comment: 'Reliable 24/7 security. Extending my booking time before arrival was effortless.', date_label: '2 Nov 2026' },

  // Ekana Stadium Smart Park
  { id: 'rev-16', location_id: 'ekana-stadium-park', user_name: 'Nikhil', rating: 5, comment: 'Smooth entry on match evenings near Ekana Stadium and easy exit back onto Shaheed Path.', date_label: '19 Nov 2026' },
  { id: 'rev-17', location_id: 'ekana-stadium-park', user_name: 'Tanvi', rating: 4, comment: 'Well lit and safe even when leaving late after night matches.', date_label: '10 Nov 2026' },
  { id: 'rev-18', location_id: 'ekana-stadium-park', user_name: 'Aditya', rating: 5, comment: 'No chaos at the gate, ParkEase pass code accepted immediately.', date_label: '4 Nov 2026' },

  // Janeshwar Mishra Park Lot
  { id: 'rev-19', location_id: 'janeshwar-mishra-parking', user_name: 'Sneha', rating: 4, comment: 'Peaceful open lot right by Gate 4. Great for early morning walks in Janeshwar Mishra Park.', date_label: '16 Nov 2026' },
  { id: 'rev-20', location_id: 'janeshwar-mishra-parking', user_name: 'Rahul', rating: 5, comment: 'Always know which bay is open before leaving home.', date_label: '7 Nov 2026' },
  { id: 'rev-21', location_id: 'janeshwar-mishra-parking', user_name: 'Pooja', rating: 4, comment: 'Clean paving and helpful attendant at the entrance.', date_label: '28 Oct 2026' },

  // Charbagh Metro & Rail Hub
  { id: 'rev-22', location_id: 'charbagh-station-parking', user_name: 'Harsh', rating: 4, comment: 'Practical, budget-friendly covered deck right next to Charbagh Metro and station.', date_label: '14 Nov 2026' },
  { id: 'rev-23', location_id: 'charbagh-station-parking', user_name: 'Neha', rating: 5, comment: '24-hour access and clear row markers made early-morning train pickup stress-free.', date_label: '8 Nov 2026' },
  { id: 'rev-24', location_id: 'charbagh-station-parking', user_name: 'Yash', rating: 4, comment: 'Good security presence and fast entry with the ParkEase code.', date_label: '27 Oct 2026' },

  // Alambagh Transit Garage
  { id: 'rev-25', location_id: 'alambagh-transit-garage', user_name: 'Vivaan', rating: 5, comment: 'Bright floodlights and clear bay markings right off Kanpur Road.', date_label: '20 Nov 2026' },
  { id: 'rev-26', location_id: 'alambagh-transit-garage', user_name: 'Sana', rating: 4, comment: 'Very handy for catching early morning buses from Alambagh terminal.', date_label: '13 Nov 2026' },
  { id: 'rev-27', location_id: 'alambagh-transit-garage', user_name: 'Omkar', rating: 5, comment: 'Plenty of room for our SUV and fair hourly rate.', date_label: '5 Nov 2026' },

  // Aminabad Heritage Parking
  { id: 'rev-28', location_id: 'aminabad-heritage-parking', user_name: 'Zoya', rating: 5, comment: 'Parking in Aminabad used to be a nightmare. This covered deck is a lifesaver.', date_label: '18 Nov 2026' },
  { id: 'rev-29', location_id: 'aminabad-heritage-parking', user_name: 'Manav', rating: 4, comment: 'Shaded, secure, and an easy walk to Pratap Market and Tunday Kababi.', date_label: '11 Nov 2026' },
  { id: 'rev-30', location_id: 'aminabad-heritage-parking', user_name: 'Riya', rating: 4, comment: 'Quick check-in and fair hourly billing.', date_label: '30 Oct 2026' },
];
