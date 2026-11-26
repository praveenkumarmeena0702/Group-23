export type SlotType = 'standard' | 'ev' | 'accessible';
export type SlotStatus = 'available' | 'occupied' | 'unavailable';
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';
export type ParkingType = 'Covered' | 'Open' | 'Basement' | 'Multi-level';
export type FacilityType = 'CCTV' | 'EV charging' | 'Security' | 'Valet' | '24/7' | 'Covered';
export type VehicleType = 'Hatchback' | 'Sedan' | 'SUV' | 'Two-wheeler';

export interface ParkingLocation {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  description: string;
  images: string[];
  price_per_hour: number;
  rating: number;
  review_count: number;
  total_slots: number;
  available_slots: number;
  parking_type: ParkingType;
  facilities: FacilityType[];
  operating_hours: string;
  distance_km: number;
  popularity: number;
  featured: boolean;
  lat: number;
  lng: number;
}

export interface ParkingSlot {
  id: string;
  location_id: string;
  code: string;
  row: 'A' | 'B' | 'C' | 'D';
  type: SlotType;
  status: SlotStatus;
}

export interface Booking {
  id: string;
  booking_code: string;
  user_id: string;
  user_email: string;
  user_name?: string;
  location_id: string;
  location_name: string;
  location_address: string;
  location_image: string;
  slot_code: string;
  booking_date: string; // yyyy-MM-dd
  start_time: string;   // HH:mm
  end_time: string;     // HH:mm
  hours: number;
  price_per_hour: number;
  total_amount: number;
  vehicle_type: VehicleType;
  vehicle_number: string;
  payment_method: 'pay_at_venue' | 'card_upi';
  status: BookingStatus;
  created_at: string;
}

export interface Review {
  id: string;
  location_id: string;
  user_id?: string | null;
  user_name: string;
  rating: number;
  comment: string;
  date_label: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  mfaEnabled: boolean;
  role?: 'user' | 'admin';
}

export interface CreateBookingInput {
  location_id: string;
  slot_code: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  vehicle_type: VehicleType;
  vehicle_number: string;
  payment_method: 'pay_at_venue' | 'card_upi';
  user_name?: string;
}
