-- ParkEase Seed Data (10 Lucknow locations, 240 slots, 30 reviews)

insert into public.parking_locations (
  id, name, area, city, address, description, images, price_per_hour, rating, review_count,
  total_slots, available_slots, parking_type, facilities, operating_hours, distance_km, popularity, featured, lat, lng
) values
  ('palassio-mall-parking', 'Phoenix Palassio Mall Parking', 'Gomti Nagar Extension', 'Lucknow', 'Amar Shaheed Path, Sector 7, Gomti Nagar Extension, Lucknow 226010',
   'Multi-level smart garage serving Phoenix Palassio Mall with wide turning radii, license-plate entry cameras, and dedicated fast-charge EV bays on Row A right off Shaheed Path.',
   array['/images/hero-garage.jpg','/images/garage-ramp.jpg','/images/garage-entrance.jpg','/images/tower-basement.jpg'],
   60, 4.9, 3, 24, 21, 'Multi-level', array['CCTV','EV charging','Security','24/7','Covered'], '24 hours', 1.1, 99, true, 26.8091, 81.0125),

  ('lulu-mall-parking', 'Lulu Mall Multi-Level Parking', 'Sushant Golf City', 'Lucknow', 'Amar Shaheed Path, Sushant Golf City, Lucknow 226030',
   'High-capacity covered parking deck adjacent to Lulu Mall Lucknow. Features bright LED row guidance, contactless pass scanning, and direct lift access to the mall atrium.',
   array['/images/tower-basement.jpg','/images/street-plaza.jpg','/images/hero-garage.jpg','/images/garage-ramp.jpg'],
   50, 4.9, 3, 24, 20, 'Multi-level', array['CCTV','EV charging','Security','Valet','24/7','Covered'], '24 hours', 1.4, 98, true, 26.7834, 80.9901),

  ('iiit-lucknow-parking', 'IIIT Lucknow College Parking', 'Chak Ganjaria', 'Lucknow', 'Chak Ganjaria, C.G. City, Sultanpur Road, Lucknow 226002',
   'Verified campus-side covered and shaded bays near IIIT Lucknow College in C.G. City. Ideal for students, visiting faculty, and tech event attendees along Sultanpur Road.',
   array['/images/garage-entrance.jpg','/images/coastal-open.jpg','/images/street-plaza.jpg','/images/hero-garage.jpg'],
   30, 4.8, 3, 24, 22, 'Covered', array['CCTV','EV charging','Security','24/7','Covered'], '24 hours', 0.8, 96, true, 26.8007, 81.0241),

  ('hazratganj-central-garage', 'Hazratganj Central Garage', 'Hazratganj', 'Lucknow', 'Mahatma Gandhi Marg, Near Janpath Market, Hazratganj, Lucknow 226001',
   'Weather-protected basement and plaza facility steps from Janpath Market and Hazratganj heritage arcades. Skip street congestion with pre-booked bays and optional valet handover.',
   array['/images/street-plaza.jpg','/images/tower-basement.jpg','/images/hero-garage.jpg','/images/garage-entrance.jpg'],
   70, 4.8, 3, 24, 20, 'Basement', array['CCTV','Security','Valet','Covered'], '6:00 AM – 11:30 PM', 0.6, 95, true, 26.8489, 80.9462),

  ('gomti-nagar-summit-park', 'Gomti Nagar Summit Park', 'Gomti Nagar', 'Lucknow', 'Vibhuti Khand, Near Summit Building, Gomti Nagar, Lucknow 226010',
   'Modern corporate basement minutes from Vibhuti Khand business towers, cafés, and Wave Mall. Guarded 24/7 with zero-wait express exit lanes and EV charging.',
   array['/images/garage-ramp.jpg','/images/tower-basement.jpg','/images/hero-garage.jpg','/images/street-plaza.jpg'],
   60, 4.7, 3, 24, 21, 'Basement', array['CCTV','EV charging','Security','Valet','24/7','Covered'], '24 hours', 1.9, 92, true, 26.8624, 81.0077),

  ('ekana-stadium-park', 'Ekana Stadium Smart Park', 'Gomti Nagar Extension', 'Lucknow', 'Sector 7, Amar Shaheed Path, Near Ekana Cricket Stadium, Lucknow 226010',
   'Spacious multi-level deck built for smooth match-day arrivals and quick exits onto Shaheed Path. Clear row signage and floodlit walkways keep every bay effortless.',
   array['/images/garage-ramp.jpg','/images/hero-garage.jpg','/images/garage-entrance.jpg','/images/street-plaza.jpg'],
   55, 4.7, 3, 24, 22, 'Multi-level', array['CCTV','Security','24/7','Covered'], '24 hours', 1.3, 90, true, 26.8116, 81.0172),

  ('janeshwar-mishra-parking', 'Janeshwar Mishra Park Lot', 'Gomti Nagar', 'Lucknow', 'Gate 4, Gomti Nagar Extension Bypass, Lucknow 226010',
   'Open-air paved lot bordered by shaded avenues beside Janeshwar Mishra Park. Wide marked bays make morning walks, family picnics, and weekend visits effortless.',
   array['/images/coastal-open.jpg','/images/street-plaza.jpg','/images/garage-entrance.jpg','/images/hero-garage.jpg'],
   40, 4.6, 3, 24, 21, 'Open', array['CCTV','Security','EV charging'], '5:30 AM – 11:00 PM', 2.4, 87, false, 26.8371, 80.9924),

  ('charbagh-station-parking', 'Charbagh Metro & Rail Hub', 'Charbagh', 'Lucknow', 'Station Road, Near Charbagh Metro Station, Lucknow 226004',
   'Value park-and-ride covered structure connected to Charbagh Metro and Lucknow Junction railway terminal. Designed for daily commuters and intercity travellers.',
   array['/images/garage-entrance.jpg','/images/tower-basement.jpg','/images/garage-ramp.jpg','/images/hero-garage.jpg'],
   40, 4.5, 3, 24, 22, 'Covered', array['CCTV','Security','24/7','Covered'], '24 hours', 2.8, 85, false, 26.8317, 80.9209),

  ('alambagh-transit-garage', 'Alambagh Transit Garage', 'Alambagh', 'Lucknow', 'Kanpur Road, Near Alambagh Bus Terminal, Lucknow 226005',
   'Clean covered parking along Kanpur Road steps from Alambagh Metro and ISBT terminal. Reliable 24/7 security and wide bays for family SUVs and airport transfers.',
   array['/images/hero-garage.jpg','/images/garage-entrance.jpg','/images/street-plaza.jpg','/images/tower-basement.jpg'],
   45, 4.5, 3, 24, 20, 'Covered', array['CCTV','Security','24/7','Covered'], '24 hours', 3.5, 83, false, 26.8124, 80.9036),

  ('aminabad-heritage-parking', 'Aminabad Heritage Parking', 'Aminabad', 'Lucknow', 'Latouche Road, Near Pratap Market, Aminabad, Lucknow 226018',
   'Discreet multi-level parking tucked just off bustling Aminabad markets. Eliminates narrow-lane parking stress near Tunday Kababi and Chowk heritage bazaars.',
   array['/images/street-plaza.jpg','/images/garage-ramp.jpg','/images/garage-entrance.jpg','/images/hero-garage.jpg'],
   50, 4.4, 3, 24, 21, 'Multi-level', array['CCTV','Security','Covered'], '7:00 AM – 11:30 PM', 3.1, 81, false, 26.8467, 80.9277)
on conflict (id) do nothing;

-- Generate 24 slots (A01..D06) per location
do $$
declare
  loc_rec record;
  r text;
  n int;
  c text;
  stype public.slot_type;
  sstatus public.slot_status;
  occ_map jsonb := '{
    "palassio-mall-parking": ["A03","B02","C05"],
    "lulu-mall-parking": ["A02","B04","C01","D03"],
    "iiit-lucknow-parking": ["B05","D02"],
    "hazratganj-central-garage": ["A04","B01","C03","D05"],
    "gomti-nagar-summit-park": ["A05","C02","D04"],
    "ekana-stadium-park": ["B03","C06"],
    "janeshwar-mishra-parking": ["A02","C04","D01"],
    "charbagh-station-parking": ["A06","D02"],
    "alambagh-transit-garage": ["A04","B02","C05","D06"],
    "aminabad-heritage-parking": ["B01","C03","D04"]
  }'::jsonb;
begin
  for loc_rec in select id from public.parking_locations loop
    foreach r in array array['A','B','C','D'] loop
      for n in 1..6 loop
        c := r || '0' || n::text;
        stype := case
          when c in ('A01','A02','A05') then 'ev'::public.slot_type
          when c in ('D01','D06') then 'accessible'::public.slot_type
          else 'standard'::public.slot_type
        end;
        sstatus := case
          when (occ_map -> loc_rec.id) ? c then 'occupied'::public.slot_status
          else 'available'::public.slot_status
        end;
        insert into public.parking_slots (location_id, code, row, type, status)
        values (loc_rec.id, c, r, stype, sstatus)
        on conflict (location_id, code) do nothing;
      end loop;
    end loop;
  end loop;
end $$;

-- Seed 30 reviews (3 per location)
insert into public.reviews (location_id, user_name, rating, comment, date_label) values
  ('palassio-mall-parking', 'Aarav', 5, 'Spotless garage right off Shaheed Path. Selected A01 near the EV charger and walked straight into Palassio Mall.', '18 Nov 2026'),
  ('palassio-mall-parking', 'Diya', 5, 'Super bright lighting and friendly security staff. Way calmer than weekend mall queues.', '11 Nov 2026'),
  ('palassio-mall-parking', 'Rohan', 5, 'Wide bays even for an SUV. QR pass scan at the boom barrier took two seconds.', '3 Nov 2026'),
  ('lulu-mall-parking', 'Ananya', 5, 'Saved us twenty minutes on a Sunday evening at Lulu Mall. Direct elevator access to the food court.', '20 Nov 2026'),
  ('lulu-mall-parking', 'Kabir', 5, 'Covered bays keep the car cool even in warm Lucknow afternoons. Transparent pricing.', '12 Nov 2026'),
  ('lulu-mall-parking', 'Meera', 4, 'Very neat facility and quick valet option when we arrived for dinner.', '29 Oct 2026'),
  ('iiit-lucknow-parking', 'Vikram', 5, 'Super convenient right outside IIIT Lucknow College in CG City. Loved picking bay B03 beforehand.', '19 Nov 2026'),
  ('iiit-lucknow-parking', 'Ishita', 5, 'Clean shaded bays and reliable EV charging availability on Row A during tech fest.', '8 Nov 2026'),
  ('iiit-lucknow-parking', 'Siddharth', 4, 'Easy access from Sultanpur Road and affordable hourly rate for full-day campus visits.', '1 Nov 2026'),
  ('hazratganj-central-garage', 'Kavya', 5, 'Best parking in Hazratganj. Just steps from Janpath Market with instant pass verification.', '21 Nov 2026'),
  ('hazratganj-central-garage', 'Arjun', 5, 'Worth every rupee during evening shopping. Never have to circle MG Marg anymore.', '15 Nov 2026'),
  ('hazratganj-central-garage', 'Nisha', 4, 'Immaculate basement and attentive guards. Valet handover was smooth.', '6 Nov 2026'),
  ('gomti-nagar-summit-park', 'Dev', 5, 'Two-minute walk to Summit Building in Vibhuti Khand without evening traffic stress.', '17 Nov 2026'),
  ('gomti-nagar-summit-park', 'Priya', 5, 'Clear signage inside the basement and wide bays for large sedans.', '9 Nov 2026'),
  ('gomti-nagar-summit-park', 'Karan', 4, 'Reliable 24/7 security. Extending my booking time before arrival was effortless.', '2 Nov 2026'),
  ('ekana-stadium-park', 'Nikhil', 5, 'Smooth entry on match evenings near Ekana Stadium and easy exit back onto Shaheed Path.', '19 Nov 2026'),
  ('ekana-stadium-park', 'Tanvi', 4, 'Well lit and safe even when leaving late after night matches.', '10 Nov 2026'),
  ('ekana-stadium-park', 'Aditya', 5, 'No chaos at the gate, ParkEase pass code accepted immediately.', '4 Nov 2026'),
  ('janeshwar-mishra-parking', 'Sneha', 4, 'Peaceful open lot right by Gate 4. Great for early morning walks in Janeshwar Mishra Park.', '16 Nov 2026'),
  ('janeshwar-mishra-parking', 'Rahul', 5, 'Always know which bay is open before leaving home.', '7 Nov 2026'),
  ('janeshwar-mishra-parking', 'Pooja', 4, 'Clean paving and helpful attendant at the entrance.', '28 Oct 2026'),
  ('charbagh-station-parking', 'Harsh', 4, 'Practical, budget-friendly covered deck right next to Charbagh Metro and station.', '14 Nov 2026'),
  ('charbagh-station-parking', 'Neha', 5, '24-hour access and clear row markers made early-morning train pickup stress-free.', '8 Nov 2026'),
  ('charbagh-station-parking', 'Yash', 4, 'Good security presence and fast entry with the ParkEase code.', '27 Oct 2026'),
  ('alambagh-transit-garage', 'Vivaan', 5, 'Bright floodlights and clear bay markings right off Kanpur Road.', '20 Nov 2026'),
  ('alambagh-transit-garage', 'Sana', 4, 'Very handy for catching early morning buses from Alambagh terminal.', '13 Nov 2026'),
  ('alambagh-transit-garage', 'Omkar', 5, 'Plenty of room for our SUV and fair hourly rate.', '5 Nov 2026'),
  ('aminabad-heritage-parking', 'Zoya', 5, 'Parking in Aminabad used to be a nightmare. This covered deck is a lifesaver.', '18 Nov 2026'),
  ('aminabad-heritage-parking', 'Manav', 4, 'Shaded, secure, and an easy walk to Pratap Market and Tunday Kababi.', '11 Nov 2026'),
  ('aminabad-heritage-parking', 'Riya', 4, 'Quick check-in and fair hourly billing.', '30 Oct 2026');
