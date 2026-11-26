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
    id: 'skyline-parking-hub',
    name: 'Skyline Parking Hub',
    area: 'Bandra West',
    city: 'Mumbai',
    address: '14th Road, Linking Road Junction, Bandra West, Mumbai 400050',
    description:
      'A sunlit multi-level concrete garage steps from Linking Road boutiques and Bandra cafés. Features wide turning radii, license-plate entry cameras, and dedicated fast-charge EV bays on Row A.',
    images: [IMAGES.hero, IMAGES.ramp, IMAGES.entrance, IMAGES.basement],
    price_per_hour: 120,
    rating: 4.9,
    review_count: 3,
    total_slots: 24,
    available_slots: 21,
    parking_type: 'Multi-level',
    facilities: ['CCTV', 'EV charging', 'Security', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 1.1,
    popularity: 98,
    featured: true,
    lat: 19.0626,
    lng: 72.8336,
  },
  {
    id: 'marine-drive-covered',
    name: 'Marine Drive Covered Parking',
    area: 'Marine Drive',
    city: 'Mumbai',
    address: 'Netaji Subhash Chandra Bose Road, Churchgate, Mumbai 400020',
    description:
      'Weather-protected bay facility just off the Queen’s Necklace promenade. Ideal for evening walks, Nariman Point meetings, and South Mumbai dining without circling narrow heritage lanes.',
    images: [IMAGES.entrance, IMAGES.hero, IMAGES.coastal, IMAGES.plaza],
    price_per_hour: 140,
    rating: 4.8,
    review_count: 3,
    total_slots: 24,
    available_slots: 20,
    parking_type: 'Covered',
    facilities: ['CCTV', 'Security', 'Valet', 'Covered'],
    operating_hours: '6:00 AM – 11:30 PM',
    distance_km: 0.8,
    popularity: 95,
    featured: true,
    lat: 18.9432,
    lng: 72.8235,
  },
  {
    id: 'bandra-curve-garage',
    name: 'Bandra Curve Garage',
    area: 'Bandra West',
    city: 'Mumbai',
    address: 'Pali Hill Access Lane, Bandra West, Mumbai 400050',
    description:
      'Architectural curved-ramp deck built for smooth entry and quick exits toward Carter Road and Hill Road. Bright LED guidance keeps every bay crisp day and night.',
    images: [IMAGES.ramp, IMAGES.hero, IMAGES.plaza, IMAGES.entrance],
    price_per_hour: 100,
    rating: 4.7,
    review_count: 3,
    total_slots: 24,
    available_slots: 22,
    parking_type: 'Multi-level',
    facilities: ['CCTV', 'EV charging', 'Covered', '24/7'],
    operating_hours: '24 hours',
    distance_km: 1.4,
    popularity: 91,
    featured: true,
    lat: 19.0596,
    lng: 72.8266,
  },
  {
    id: 'bkc-smart-park',
    name: 'BKC Smart Park',
    area: 'BKC',
    city: 'Mumbai',
    address: 'G Block, Bandra Kurla Complex, Mumbai 400051',
    description:
      'Flagship commercial tower basement with contactless pass scanning, valet handover at the granite plaza, and high-clearance bays for executive sedans and SUVs.',
    images: [IMAGES.basement, IMAGES.plaza, IMAGES.hero, IMAGES.ramp],
    price_per_hour: 180,
    rating: 4.9,
    review_count: 3,
    total_slots: 24,
    available_slots: 20,
    parking_type: 'Basement',
    facilities: ['CCTV', 'EV charging', 'Security', 'Valet', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 0.6,
    popularity: 99,
    featured: true,
    lat: 19.0653,
    lng: 72.8681,
  },
  {
    id: 'lower-parel-tower',
    name: 'Lower Parel Tower Parking',
    area: 'Lower Parel',
    city: 'Mumbai',
    address: 'Senapati Bapat Marg, Lower Parel, Mumbai 400013',
    description:
      'Clean two-level corporate basement minutes from High Street Phoenix and Worli business towers. Guarded 24/7 with zero-wait express exit lanes.',
    images: [IMAGES.plaza, IMAGES.basement, IMAGES.hero, IMAGES.entrance],
    price_per_hour: 150,
    rating: 4.8,
    review_count: 3,
    total_slots: 24,
    available_slots: 21,
    parking_type: 'Basement',
    facilities: ['CCTV', 'Security', 'Valet', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 1.9,
    popularity: 93,
    featured: true,
    lat: 18.9977,
    lng: 72.8287,
  },
  {
    id: 'andheri-metro-park',
    name: 'Andheri Metro Park',
    area: 'Andheri East',
    city: 'Mumbai',
    address: 'Western Express Highway Service Road, Andheri East, Mumbai 400069',
    description:
      'Value park-and-ride covered structure connected directly to the Metro Line 1 concourse. Designed for daily commuters and airport travellers seeking safe overnight bays.',
    images: [IMAGES.entrance, IMAGES.basement, IMAGES.ramp, IMAGES.hero],
    price_per_hour: 60,
    rating: 4.5,
    review_count: 3,
    total_slots: 24,
    available_slots: 22,
    parking_type: 'Covered',
    facilities: ['CCTV', 'Security', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 0.4,
    popularity: 88,
    featured: true,
    lat: 19.1197,
    lng: 72.8464,
  },
  {
    id: 'powai-lake-parking',
    name: 'Powai Lake Parking',
    area: 'Powai',
    city: 'Mumbai',
    address: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai 400076',
    description:
      'Open-air paved lot bordered by shaded avenues along Hiranandani Gardens. Spacious bays make weekend brunch and lakeside visits effortless.',
    images: [IMAGES.coastal, IMAGES.plaza, IMAGES.entrance, IMAGES.hero],
    price_per_hour: 70,
    rating: 4.4,
    review_count: 3,
    total_slots: 24,
    available_slots: 21,
    parking_type: 'Open',
    facilities: ['CCTV', 'Security'],
    operating_hours: '6:00 AM – 11:00 PM',
    distance_km: 2.8,
    popularity: 82,
    featured: false,
    lat: 19.1176,
    lng: 72.906,
  },
  {
    id: 'colaba-heritage-garage',
    name: 'Colaba Heritage Garage',
    area: 'Colaba',
    city: 'Mumbai',
    address: 'Shahid Bhagat Singh Road, Apollo Bandar, Colaba, Mumbai 400001',
    description:
      'Discreet covered parking tucked behind historic Colaba Causeway facades. Eliminates street-parking stress near Gateway of India and Kala Ghoda galleries.',
    images: [IMAGES.hero, IMAGES.entrance, IMAGES.plaza, IMAGES.basement],
    price_per_hour: 130,
    rating: 4.6,
    review_count: 3,
    total_slots: 24,
    available_slots: 20,
    parking_type: 'Covered',
    facilities: ['CCTV', 'Security', 'Valet', 'Covered'],
    operating_hours: '7:00 AM – 11:30 PM',
    distance_km: 1.6,
    popularity: 89,
    featured: false,
    lat: 18.9219,
    lng: 72.8315,
  },
  {
    id: 'juhu-beach-parking',
    name: 'Juhu Beach Parking',
    area: 'Juhu',
    city: 'Mumbai',
    address: 'Juhu Tara Road, Near JW Marriott, Juhu, Mumbai 400049',
    description:
      'Well-lit coastal open lot two minutes from the Juhu shoreline. Marked wide bays accommodate family SUVs and two-wheelers cleanly.',
    images: [IMAGES.coastal, IMAGES.entrance, IMAGES.plaza, IMAGES.ramp],
    price_per_hour: 80,
    rating: 4.5,
    review_count: 3,
    total_slots: 24,
    available_slots: 21,
    parking_type: 'Open',
    facilities: ['CCTV', 'Security', 'EV charging'],
    operating_hours: '5:30 AM – 11:30 PM',
    distance_km: 3.2,
    popularity: 85,
    featured: false,
    lat: 19.0988,
    lng: 72.8264,
  },
  {
    id: 'dadar-station-parking',
    name: 'Dadar Station Parking',
    area: 'Dadar',
    city: 'Mumbai',
    address: 'Dr. Babasaheb Ambedkar Road, Dadar East, Mumbai 400014',
    description:
      'Multi-level commuter hub close to Dadar railway terminal and Worli connector. Fast ramp circulation, 24/7 CCTV coverage, and clear row signage.',
    images: [IMAGES.ramp, IMAGES.basement, IMAGES.entrance, IMAGES.hero],
    price_per_hour: 65,
    rating: 4.4,
    review_count: 3,
    total_slots: 24,
    available_slots: 22,
    parking_type: 'Multi-level',
    facilities: ['CCTV', 'Security', '24/7', 'Covered'],
    operating_hours: '24 hours',
    distance_km: 4.2,
    popularity: 80,
    featured: false,
    lat: 19.0178,
    lng: 72.8478,
  },
];

// Deterministic occupied slots per location (2 to 4 occupied per location)
const OCCUPIED_BY_LOCATION: Record<string, string[]> = {
  'skyline-parking-hub': ['A03', 'B02', 'C05'],
  'marine-drive-covered': ['A02', 'B04', 'C01', 'D03'],
  'bandra-curve-garage': ['B05', 'D02'],
  'bkc-smart-park': ['A04', 'B01', 'C03', 'D05'],
  'lower-parel-tower': ['A05', 'C02', 'D04'],
  'andheri-metro-park': ['B03', 'C06'],
  'powai-lake-parking': ['A02', 'C04', 'D01'],
  'colaba-heritage-garage': ['A04', 'B02', 'C05', 'D06'],
  'juhu-beach-parking': ['B01', 'C03', 'D04'],
  'dadar-station-parking': ['A06', 'D02'],
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
  // Skyline Parking Hub
  { id: 'rev-1', location_id: 'skyline-parking-hub', user_name: 'Aarav', rating: 5, comment: 'Spotless garage right off Linking Road. Selected A01 near the EV charger and drove straight in.', date_label: '18 Nov 2026' },
  { id: 'rev-2', location_id: 'skyline-parking-hub', user_name: 'Diya', rating: 5, comment: 'Super bright lighting and friendly security staff. Way calmer than hunting for street space in Bandra.', date_label: '11 Nov 2026' },
  { id: 'rev-3', location_id: 'skyline-parking-hub', user_name: 'Rohan', rating: 5, comment: 'Wide bays even for an SUV. QR pass scan at the boom barrier took two seconds.', date_label: '3 Nov 2026' },

  // Marine Drive Covered Parking
  { id: 'rev-4', location_id: 'marine-drive-covered', user_name: 'Ananya', rating: 5, comment: 'Saved us twenty minutes on a Sunday evening. Literally steps from the promenade.', date_label: '20 Nov 2026' },
  { id: 'rev-5', location_id: 'marine-drive-covered', user_name: 'Kabir', rating: 5, comment: 'Covered bays keep the car cool even in humid afternoon heat. Transparent pricing.', date_label: '12 Nov 2026' },
  { id: 'rev-6', location_id: 'marine-drive-covered', user_name: 'Meera', rating: 4, comment: 'Very neat facility and quick valet option when we were running late for dinner.', date_label: '29 Oct 2026' },

  // Bandra Curve Garage
  { id: 'rev-7', location_id: 'bandra-curve-garage', user_name: 'Vikram', rating: 5, comment: 'Smooth curved ramp with zero blind corners. Loved picking bay B03 beforehand.', date_label: '19 Nov 2026' },
  { id: 'rev-8', location_id: 'bandra-curve-garage', user_name: 'Ishita', rating: 5, comment: 'Clean floors and great EV charging availability on Row A.', date_label: '8 Nov 2026' },
  { id: 'rev-9', location_id: 'bandra-curve-garage', user_name: 'Siddharth', rating: 4, comment: 'Easy access from Pali Hill. Exit lane onto the main road is quick.', date_label: '1 Nov 2026' },

  // BKC Smart Park
  { id: 'rev-10', location_id: 'bkc-smart-park', user_name: 'Kavya', rating: 5, comment: 'Best corporate parking in BKC. Granite drop-off and instant pass verification.', date_label: '21 Nov 2026' },
  { id: 'rev-11', location_id: 'bkc-smart-park', user_name: 'Arjun', rating: 5, comment: 'Worth every rupee before client meetings. Never have to circle G Block anymore.', date_label: '15 Nov 2026' },
  { id: 'rev-12', location_id: 'bkc-smart-park', user_name: 'Nisha', rating: 5, comment: 'Immaculate basement and attentive guards. EV bay worked flawlessly.', date_label: '6 Nov 2026' },

  // Lower Parel Tower Parking
  { id: 'rev-13', location_id: 'lower-parel-tower', user_name: 'Dev', rating: 5, comment: 'Five-minute walk to Phoenix Palladium without the weekend mall traffic jam.', date_label: '17 Nov 2026' },
  { id: 'rev-14', location_id: 'lower-parel-tower', user_name: 'Priya', rating: 5, comment: 'Clear signage inside the basement and wide bays for large sedans.', date_label: '9 Nov 2026' },
  { id: 'rev-15', location_id: 'lower-parel-tower', user_name: 'Karan', rating: 4, comment: 'Reliable 24/7 security. Extending my booking time before arrival was effortless.', date_label: '2 Nov 2026' },

  // Andheri Metro Park
  { id: 'rev-16', location_id: 'andheri-metro-park', user_name: 'Nikhil', rating: 5, comment: 'At ₹60/hr right next to the Metro, this is unbeatable for daily work commutes.', date_label: '19 Nov 2026' },
  { id: 'rev-17', location_id: 'andheri-metro-park', user_name: 'Tanvi', rating: 4, comment: 'Well covered and safe even when returning late at night.', date_label: '10 Nov 2026' },
  { id: 'rev-18', location_id: 'andheri-metro-park', user_name: 'Aditya', rating: 5, comment: 'No chaos at the gate, pass code accepted immediately.', date_label: '4 Nov 2026' },

  // Powai Lake Parking
  { id: 'rev-19', location_id: 'powai-lake-parking', user_name: 'Sneha', rating: 4, comment: 'Peaceful open lot with wide spacing. Great for Sunday morning coffee walks.', date_label: '16 Nov 2026' },
  { id: 'rev-20', location_id: 'powai-lake-parking', user_name: 'Rahul', rating: 5, comment: 'Always know which bay is open before leaving home.', date_label: '7 Nov 2026' },
  { id: 'rev-21', location_id: 'powai-lake-parking', user_name: 'Pooja', rating: 4, comment: 'Clean paving and helpful attendant at the entrance.', date_label: '28 Oct 2026' },

  // Colaba Heritage Garage
  { id: 'rev-22', location_id: 'colaba-heritage-garage', user_name: 'Zoya', rating: 5, comment: 'Parking in Colaba used to be a nightmare. This covered garage is a lifesaver.', date_label: '18 Nov 2026' },
  { id: 'rev-23', location_id: 'colaba-heritage-garage', user_name: 'Manav', rating: 4, comment: 'Shaded, secure, and right near Kala Ghoda art galleries.', date_label: '11 Nov 2026' },
  { id: 'rev-24', location_id: 'colaba-heritage-garage', user_name: 'Riya', rating: 5, comment: 'Quick check-in and fair hourly billing.', date_label: '30 Oct 2026' },

  // Juhu Beach Parking
  { id: 'rev-25', location_id: 'juhu-beach-parking', user_name: 'Vivaan', rating: 5, comment: 'Bright floodlights in the evening and clear bay markings right off Juhu Tara Road.', date_label: '20 Nov 2026' },
  { id: 'rev-26', location_id: 'juhu-beach-parking', user_name: 'Sana', rating: 4, comment: 'Convenient EV charger spot and zero hassle finding our car later.', date_label: '13 Nov 2026' },
  { id: 'rev-27', location_id: 'juhu-beach-parking', user_name: 'Omkar', rating: 5, comment: 'Plenty of room for our SUV, fair rate for Juhu.', date_label: '5 Nov 2026' },

  // Dadar Station Parking
  { id: 'rev-28', location_id: 'dadar-station-parking', user_name: 'Harsh', rating: 4, comment: 'Practical, budget-friendly multi-level deck near Dadar terminal.', date_label: '14 Nov 2026' },
  { id: 'rev-29', location_id: 'dadar-station-parking', user_name: 'Neha', rating: 5, comment: '24-hour access and clear row markers made early-morning train pickup stress-free.', date_label: '8 Nov 2026' },
  { id: 'rev-30', location_id: 'dadar-station-parking', user_name: 'Yash', rating: 4, comment: 'Good security presence and fast entry with the ParkEase code.', date_label: '27 Oct 2026' },
];
