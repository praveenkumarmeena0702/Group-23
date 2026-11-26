-- ParkEase Seed Data (10 Mumbai locations, 240 slots, 30 reviews)

insert into public.parking_locations (
  id, name, area, city, address, description, images, price_per_hour, rating, review_count,
  total_slots, available_slots, parking_type, facilities, operating_hours, distance_km, popularity, featured, lat, lng
) values
  ('skyline-parking-hub', 'Skyline Parking Hub', 'Bandra West', 'Mumbai', '14th Road, Linking Road Junction, Bandra West, Mumbai 400050',
   'A sunlit multi-level concrete garage steps from Linking Road boutiques and Bandra cafés. Features wide turning radii, license-plate entry cameras, and dedicated fast-charge EV bays on Row A.',
   array['/images/hero-garage.jpg','/images/garage-ramp.jpg','/images/garage-entrance.jpg','/images/tower-basement.jpg'],
   120, 4.9, 3, 24, 21, 'Multi-level', array['CCTV','EV charging','Security','24/7','Covered'], '24 hours', 1.1, 98, true, 19.0626, 72.8336),

  ('marine-drive-covered', 'Marine Drive Covered Parking', 'Marine Drive', 'Mumbai', 'Netaji Subhash Chandra Bose Road, Churchgate, Mumbai 400020',
   'Weather-protected bay facility just off the Queen’s Necklace promenade. Ideal for evening walks, Nariman Point meetings, and South Mumbai dining without circling narrow heritage lanes.',
   array['/images/garage-entrance.jpg','/images/hero-garage.jpg','/images/coastal-open.jpg','/images/street-plaza.jpg'],
   140, 4.8, 3, 24, 20, 'Covered', array['CCTV','Security','Valet','Covered'], '6:00 AM – 11:30 PM', 0.8, 95, true, 18.9432, 72.8235),

  ('bandra-curve-garage', 'Bandra Curve Garage', 'Bandra West', 'Mumbai', 'Pali Hill Access Lane, Bandra West, Mumbai 400050',
   'Architectural curved-ramp deck built for smooth entry and quick exits toward Carter Road and Hill Road. Bright LED guidance keeps every bay crisp day and night.',
   array['/images/garage-ramp.jpg','/images/hero-garage.jpg','/images/street-plaza.jpg','/images/garage-entrance.jpg'],
   100, 4.7, 3, 24, 22, 'Multi-level', array['CCTV','EV charging','Covered','24/7'], '24 hours', 1.4, 91, true, 19.0596, 72.8266),

  ('bkc-smart-park', 'BKC Smart Park', 'BKC', 'Mumbai', 'G Block, Bandra Kurla Complex, Mumbai 400051',
   'Flagship commercial tower basement with contactless pass scanning, valet handover at the granite plaza, and high-clearance bays for executive sedans and SUVs.',
   array['/images/tower-basement.jpg','/images/street-plaza.jpg','/images/hero-garage.jpg','/images/garage-ramp.jpg'],
   180, 4.9, 3, 24, 20, 'Basement', array['CCTV','EV charging','Security','Valet','24/7','Covered'], '24 hours', 0.6, 99, true, 19.0653, 72.8681),

  ('lower-parel-tower', 'Lower Parel Tower Parking', 'Lower Parel', 'Mumbai', 'Senapati Bapat Marg, Lower Parel, Mumbai 400013',
   'Clean two-level corporate basement minutes from High Street Phoenix and Worli business towers. Guarded 24/7 with zero-wait express exit lanes.',
   array['/images/street-plaza.jpg','/images/tower-basement.jpg','/images/hero-garage.jpg','/images/garage-entrance.jpg'],
   150, 4.8, 3, 24, 21, 'Basement', array['CCTV','Security','Valet','24/7','Covered'], '24 hours', 1.9, 93, true, 18.9977, 72.8287),

  ('andheri-metro-park', 'Andheri Metro Park', 'Andheri East', 'Mumbai', 'Western Express Highway Service Road, Andheri East, Mumbai 400069',
   'Value park-and-ride covered structure connected directly to the Metro Line 1 concourse. Designed for daily commuters and airport travellers seeking safe overnight bays.',
   array['/images/garage-entrance.jpg','/images/tower-basement.jpg','/images/garage-ramp.jpg','/images/hero-garage.jpg'],
   60, 4.5, 3, 24, 22, 'Covered', array['CCTV','Security','24/7','Covered'], '24 hours', 0.4, 88, true, 19.1197, 72.8464),

  ('powai-lake-parking', 'Powai Lake Parking', 'Powai', 'Mumbai', 'Central Avenue, Hiranandani Gardens, Powai, Mumbai 400076',
   'Open-air paved lot bordered by shaded avenues along Hiranandani Gardens. Spacious bays make weekend brunch and lakeside visits effortless.',
   array['/images/coastal-open.jpg','/images/street-plaza.jpg','/images/garage-entrance.jpg','/images/hero-garage.jpg'],
   70, 4.4, 3, 24, 21, 'Open', array['CCTV','Security'], '6:00 AM – 11:00 PM', 2.8, 82, false, 19.1176, 72.906),

  ('colaba-heritage-garage', 'Colaba Heritage Garage', 'Colaba', 'Mumbai', 'Shahid Bhagat Singh Road, Apollo Bandar, Colaba, Mumbai 400001',
   'Discreet covered parking tucked behind historic Colaba Causeway facades. Eliminates street-parking stress near Gateway of India and Kala Ghoda galleries.',
   array['/images/hero-garage.jpg','/images/garage-entrance.jpg','/images/street-plaza.jpg','/images/tower-basement.jpg'],
   130, 4.6, 3, 24, 20, 'Covered', array['CCTV','Security','Valet','Covered'], '7:00 AM – 11:30 PM', 1.6, 89, false, 18.9219, 72.8315),

  ('juhu-beach-parking', 'Juhu Beach Parking', 'Juhu', 'Mumbai', 'Juhu Tara Road, Near JW Marriott, Juhu, Mumbai 400049',
   'Well-lit coastal open lot two minutes from the Juhu shoreline. Marked wide bays accommodate family SUVs and two-wheelers cleanly.',
   array['/images/coastal-open.jpg','/images/garage-entrance.jpg','/images/street-plaza.jpg','/images/garage-ramp.jpg'],
   80, 4.5, 3, 24, 21, 'Open', array['CCTV','Security','EV charging'], '5:30 AM – 11:30 PM', 3.2, 85, false, 19.0988, 72.8264),

  ('dadar-station-parking', 'Dadar Station Parking', 'Dadar', 'Mumbai', 'Dr. Babasaheb Ambedkar Road, Dadar East, Mumbai 400014',
   'Multi-level commuter hub close to Dadar railway terminal and Worli connector. Fast ramp circulation, 24/7 CCTV coverage, and clear row signage.',
   array['/images/garage-ramp.jpg','/images/tower-basement.jpg','/images/garage-entrance.jpg','/images/hero-garage.jpg'],
   65, 4.4, 3, 24, 22, 'Multi-level', array['CCTV','Security','24/7','Covered'], '24 hours', 4.2, 80, false, 19.0178, 72.8478)
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
    "skyline-parking-hub": ["A03","B02","C05"],
    "marine-drive-covered": ["A02","B04","C01","D03"],
    "bandra-curve-garage": ["B05","D02"],
    "bkc-smart-park": ["A04","B01","C03","D05"],
    "lower-parel-tower": ["A05","C02","D04"],
    "andheri-metro-park": ["B03","C06"],
    "powai-lake-parking": ["A02","C04","D01"],
    "colaba-heritage-garage": ["A04","B02","C05","D06"],
    "juhu-beach-parking": ["B01","C03","D04"],
    "dadar-station-parking": ["A06","D02"]
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
  ('skyline-parking-hub', 'Aarav', 5, 'Spotless garage right off Linking Road. Selected A01 near the EV charger and drove straight in.', '18 Nov 2026'),
  ('skyline-parking-hub', 'Diya', 5, 'Super bright lighting and friendly security staff. Way calmer than hunting for street space in Bandra.', '11 Nov 2026'),
  ('skyline-parking-hub', 'Rohan', 5, 'Wide bays even for an SUV. QR pass scan at the boom barrier took two seconds.', '3 Nov 2026'),
  ('marine-drive-covered', 'Ananya', 5, 'Saved us twenty minutes on a Sunday evening. Literally steps from the promenade.', '20 Nov 2026'),
  ('marine-drive-covered', 'Kabir', 5, 'Covered bays keep the car cool even in humid afternoon heat. Transparent pricing.', '12 Nov 2026'),
  ('marine-drive-covered', 'Meera', 4, 'Very neat facility and quick valet option when we were running late for dinner.', '29 Oct 2026'),
  ('bandra-curve-garage', 'Vikram', 5, 'Smooth curved ramp with zero blind corners. Loved picking bay B03 beforehand.', '19 Nov 2026'),
  ('bandra-curve-garage', 'Ishita', 5, 'Clean floors and great EV charging availability on Row A.', '8 Nov 2026'),
  ('bandra-curve-garage', 'Siddharth', 4, 'Easy access from Pali Hill. Exit lane onto the main road is quick.', '1 Nov 2026'),
  ('bkc-smart-park', 'Kavya', 5, 'Best corporate parking in BKC. Granite drop-off and instant pass verification.', '21 Nov 2026'),
  ('bkc-smart-park', 'Arjun', 5, 'Worth every rupee before client meetings. Never have to circle G Block anymore.', '15 Nov 2026'),
  ('bkc-smart-park', 'Nisha', 5, 'Immaculate basement and attentive guards. EV bay worked flawlessly.', '6 Nov 2026'),
  ('lower-parel-tower', 'Dev', 5, 'Five-minute walk to Phoenix Palladium without the weekend mall traffic jam.', '17 Nov 2026'),
  ('lower-parel-tower', 'Priya', 5, 'Clear signage inside the basement and wide bays for large sedans.', '9 Nov 2026'),
  ('lower-parel-tower', 'Karan', 4, 'Reliable 24/7 security. Extending my booking time before arrival was effortless.', '2 Nov 2026'),
  ('andheri-metro-park', 'Nikhil', 5, 'At ₹60/hr right next to the Metro, this is unbeatable for daily work commutes.', '19 Nov 2026'),
  ('andheri-metro-park', 'Tanvi', 4, 'Well covered and safe even when returning late at night.', '10 Nov 2026'),
  ('andheri-metro-park', 'Aditya', 5, 'No chaos at the gate, pass code accepted immediately.', '4 Nov 2026'),
  ('powai-lake-parking', 'Sneha', 4, 'Peaceful open lot with wide spacing. Great for Sunday morning coffee walks.', '16 Nov 2026'),
  ('powai-lake-parking', 'Rahul', 5, 'Always know which bay is open before leaving home.', '7 Nov 2026'),
  ('powai-lake-parking', 'Pooja', 4, 'Clean paving and helpful attendant at the entrance.', '28 Oct 2026'),
  ('colaba-heritage-garage', 'Zoya', 5, 'Parking in Colaba used to be a nightmare. This covered garage is a lifesaver.', '18 Nov 2026'),
  ('colaba-heritage-garage', 'Manav', 4, 'Shaded, secure, and right near Kala Ghoda art galleries.', '11 Nov 2026'),
  ('colaba-heritage-garage', 'Riya', 5, 'Quick check-in and fair hourly billing.', '30 Oct 2026'),
  ('juhu-beach-parking', 'Vivaan', 5, 'Bright floodlights in the evening and clear bay markings right off Juhu Tara Road.', '20 Nov 2026'),
  ('juhu-beach-parking', 'Sana', 4, 'Convenient EV charger spot and zero hassle finding our car later.', '13 Nov 2026'),
  ('juhu-beach-parking', 'Omkar', 5, 'Plenty of room for our SUV, fair rate for Juhu.', '5 Nov 2026'),
  ('dadar-station-parking', 'Harsh', 4, 'Practical, budget-friendly multi-level deck near Dadar terminal.', '14 Nov 2026'),
  ('dadar-station-parking', 'Neha', 5, '24-hour access and clear row markers made early-morning train pickup stress-free.', '8 Nov 2026'),
  ('dadar-station-parking', 'Yash', 4, 'Good security presence and fast entry with the ParkEase code.', '27 Oct 2026');
