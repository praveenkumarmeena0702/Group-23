import { buildSeedSlots, SEED_LOCATIONS, SEED_REVIEWS } from '@/data/seedData';
import {
  calculateDurationHours,
  formatDateDisplay,
  generateBookingCode,
} from '@/lib/format';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type {
  Booking,
  CreateBookingInput,
  ParkingLocation,
  ParkingSlot,
  Review,
  UserProfile,
} from '@/types';

const STORAGE_KEYS = {
  LOCATIONS: 'parkease_locations_v1',
  SLOTS: 'parkease_slots_v1',
  BOOKINGS: 'parkease_bookings_v1',
  REVIEWS: 'parkease_reviews_v1',
  USERS: 'parkease_users_v1',
  SESSION: 'parkease_session_v1',
  PENDING_OTPS: 'parkease_pending_otps_v1',
  RESET_TOKENS: 'parkease_reset_tokens_v1',
};

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
  verified: boolean;
  mfaEnabled: boolean;
  mfaSecret?: string;
  recoveryCodes?: string[];
}

interface PendingOtp {
  email: string;
  code: string;
  expiresAt: number;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureLocalSeed(): void {
  if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
    writeStorage(STORAGE_KEYS.LOCATIONS, SEED_LOCATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SLOTS)) {
    writeStorage(STORAGE_KEYS.SLOTS, buildSeedSlots());
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    writeStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    writeStorage(STORAGE_KEYS.BOOKINGS, []);
  }
}

function generateSixDigitCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateTotpSecret(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i += 1) {
    secret += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return secret;
}

function generateRecoveryCodes(): string[] {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => {
    let part1 = '';
    let part2 = '';
    for (let i = 0; i < 4; i += 1) {
      part1 += chars[Math.floor(Math.random() * chars.length)];
      part2 += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${part1}-${part2}`;
  });
}

// ---------- LOCATIONS, SLOTS, REVIEWS ----------

export async function fetchLocations(): Promise<ParkingLocation[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('parking_locations')
      .select('*')
      .order('popularity', { ascending: false });
    if (error) throw new ApiError(error.message, 500);
    return (data ?? []) as ParkingLocation[];
  }
  ensureLocalSeed();
  return readStorage<ParkingLocation[]>(STORAGE_KEYS.LOCATIONS, SEED_LOCATIONS);
}

export async function fetchLocationById(locationId: string): Promise<ParkingLocation | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('parking_locations')
      .select('*')
      .eq('id', locationId)
      .maybeSingle();
    if (error) throw new ApiError(error.message, 500);
    return (data as ParkingLocation | null) ?? null;
  }
  ensureLocalSeed();
  const list = readStorage<ParkingLocation[]>(STORAGE_KEYS.LOCATIONS, SEED_LOCATIONS);
  return list.find((l) => l.id === locationId) ?? null;
}

export async function fetchSlotsByLocation(locationId: string): Promise<ParkingSlot[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('parking_slots')
      .select('*')
      .eq('location_id', locationId)
      .order('code', { ascending: true });
    if (error) throw new ApiError(error.message, 500);
    return (data ?? []) as ParkingSlot[];
  }
  ensureLocalSeed();
  const slots = readStorage<ParkingSlot[]>(STORAGE_KEYS.SLOTS, []);
  return slots
    .filter((s) => s.location_id === locationId)
    .sort((a, b) => a.code.localeCompare(b.code));
}

export async function fetchReviewsByLocation(locationId: string): Promise<Review[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('location_id', locationId)
      .order('created_at', { ascending: false });
    if (error) throw new ApiError(error.message, 500);
    return (data ?? []) as Review[];
  }
  ensureLocalSeed();
  const reviews = readStorage<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  return reviews.filter((r) => r.location_id === locationId);
}

export async function createReview(
  locationId: string,
  rating: number,
  comment: string,
  user: UserProfile,
): Promise<Review> {
  if (!comment.trim()) throw new ApiError('Please write a short comment.', 400);
  if (rating < 1 || rating > 5) throw new ApiError('Rating must be between 1 and 5.', 400);

  const dateLabel = formatDateDisplay(new Date().toISOString().slice(0, 10));

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        location_id: locationId,
        user_id: user.id,
        user_name: user.name || user.email.split('@')[0],
        rating,
        comment: comment.trim(),
        date_label: dateLabel,
      })
      .select()
      .single();
    if (error) throw new ApiError(error.message, 400);
    return data as Review;
  }

  ensureLocalSeed();
  const reviews = readStorage<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    location_id: locationId,
    user_id: user.id,
    user_name: user.name || user.email.split('@')[0],
    rating,
    comment: comment.trim(),
    date_label: dateLabel,
    created_at: new Date().toISOString(),
  };
  writeStorage(STORAGE_KEYS.REVIEWS, [newReview, ...reviews]);

  // Update cached location rating & review_count
  const locations = readStorage<ParkingLocation[]>(STORAGE_KEYS.LOCATIONS, SEED_LOCATIONS);
  const locReviews = [newReview, ...reviews].filter((r) => r.location_id === locationId);
  const avg = locReviews.reduce((sum, r) => sum + r.rating, 0) / locReviews.length;
  const updatedLocations = locations.map((loc) =>
    loc.id === locationId
      ? {
          ...loc,
          review_count: locReviews.length,
          rating: Number(avg.toFixed(1)),
        }
      : loc,
  );
  writeStorage(STORAGE_KEYS.LOCATIONS, updatedLocations);

  return newReview;
}

// ---------- BOOKINGS (TRANSACTIONAL) ----------

export async function createBooking(
  input: CreateBookingInput,
  currentUser: UserProfile,
): Promise<Booking> {
  const computedHours = calculateDurationHours(input.start_time, input.end_time);
  if (computedHours <= 0) {
    throw new ApiError('Please select a valid arrival and departure time range.', 400);
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('create_booking', {
      p_location_id: input.location_id,
      p_slot_code: input.slot_code,
      p_booking_date: input.booking_date,
      p_start_time: input.start_time,
      p_end_time: input.end_time,
      p_hours: computedHours,
      p_vehicle_type: input.vehicle_type,
      p_vehicle_number: input.vehicle_number,
      p_payment_method: input.payment_method,
      p_user_name: input.user_name ?? currentUser.name,
    });
    if (error) {
      if (error.message.includes('CONFLICT_409') || error.message.includes('just taken')) {
        throw new ApiError('That slot was just taken. Please pick another bay.', 409);
      }
      throw new ApiError(error.message, 400);
    }
    return data as Booking;
  }

  // Local transactional booking engine
  ensureLocalSeed();
  const locations = readStorage<ParkingLocation[]>(STORAGE_KEYS.LOCATIONS, SEED_LOCATIONS);
  const slots = readStorage<ParkingSlot[]>(STORAGE_KEYS.SLOTS, []);
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);

  const locationIdx = locations.findIndex((l) => l.id === input.location_id);
  if (locationIdx === -1) {
    throw new ApiError('Parking location not found.', 404);
  }
  const location = locations[locationIdx];

  const slotIdx = slots.findIndex(
    (s) => s.location_id === input.location_id && s.code === input.slot_code,
  );
  if (slotIdx === -1 || slots[slotIdx].status !== 'available') {
    throw new ApiError('That slot was just taken. Please choose another bay.', 409);
  }

  const existingCodes = new Set(bookings.map((b) => b.booking_code));
  let bookingCode = generateBookingCode();
  while (existingCodes.has(bookingCode)) {
    bookingCode = generateBookingCode();
  }

  const totalAmount = Math.round(computedHours * location.price_per_hour);
  const newBooking: Booking = {
    id: crypto.randomUUID ? crypto.randomUUID() : `bk-${Date.now()}`,
    booking_code: bookingCode,
    user_id: currentUser.id,
    user_email: currentUser.email,
    user_name: input.user_name || currentUser.name,
    location_id: location.id,
    location_name: location.name,
    location_address: location.address,
    location_image: location.images[0],
    slot_code: slots[slotIdx].code,
    booking_date: input.booking_date,
    start_time: input.start_time,
    end_time: input.end_time,
    hours: computedHours,
    price_per_hour: location.price_per_hour,
    total_amount: totalAmount,
    vehicle_type: input.vehicle_type,
    vehicle_number: input.vehicle_number.trim().toUpperCase(),
    payment_method: input.payment_method,
    status: 'confirmed',
    created_at: new Date().toISOString(),
  };

  slots[slotIdx] = { ...slots[slotIdx], status: 'occupied' };
  locations[locationIdx] = {
    ...location,
    available_slots: Math.max(0, location.available_slots - 1),
  };

  writeStorage(STORAGE_KEYS.SLOTS, slots);
  writeStorage(STORAGE_KEYS.LOCATIONS, locations);
  writeStorage(STORAGE_KEYS.BOOKINGS, [newBooking, ...bookings]);

  return newBooking;
}

export async function fetchUserBookings(userId: string): Promise<Booking[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new ApiError(error.message, 500);
    return (data ?? []) as Booking[];
  }
  ensureLocalSeed();
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  return bookings.filter((b) => b.user_id === userId);
}

export async function fetchBookingById(bookingId: string, userId: string): Promise<Booking | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .maybeSingle();
    if (error) throw new ApiError(error.message, 500);
    return (data as Booking | null) ?? null;
  }
  ensureLocalSeed();
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  return bookings.find((b) => b.id === bookingId && b.user_id === userId) ?? null;
}

export async function cancelBooking(bookingId: string, userId: string): Promise<Booking> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('cancel_booking', {
      p_booking_id: bookingId,
    });
    if (error) throw new ApiError(error.message, 400);
    return data as Booking;
  }

  ensureLocalSeed();
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const slots = readStorage<ParkingSlot[]>(STORAGE_KEYS.SLOTS, []);
  const locations = readStorage<ParkingLocation[]>(STORAGE_KEYS.LOCATIONS, SEED_LOCATIONS);

  const bIdx = bookings.findIndex((b) => b.id === bookingId && b.user_id === userId);
  if (bIdx === -1) throw new ApiError('Booking not found.', 404);
  if (bookings[bIdx].status !== 'confirmed') {
    throw new ApiError('Only confirmed bookings can be cancelled.', 400);
  }

  const updatedBooking: Booking = { ...bookings[bIdx], status: 'cancelled' };
  bookings[bIdx] = updatedBooking;

  const sIdx = slots.findIndex(
    (s) => s.location_id === updatedBooking.location_id && s.code === updatedBooking.slot_code,
  );
  if (sIdx !== -1) {
    slots[sIdx] = { ...slots[sIdx], status: 'available' };
  }

  const lIdx = locations.findIndex((l) => l.id === updatedBooking.location_id);
  if (lIdx !== -1) {
    locations[lIdx] = {
      ...locations[lIdx],
      available_slots: Math.min(locations[lIdx].total_slots, locations[lIdx].available_slots + 1),
    };
  }

  writeStorage(STORAGE_KEYS.BOOKINGS, bookings);
  writeStorage(STORAGE_KEYS.SLOTS, slots);
  writeStorage(STORAGE_KEYS.LOCATIONS, locations);

  return updatedBooking;
}

// ---------- AUTHENTICATION (SUPABASE + LOCAL FALLBACK) ----------

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const mfaEnabled = Boolean(factors?.totp?.some((f) => f.status === 'verified'));
    return {
      id: data.user.id,
      email: data.user.email ?? '',
      name:
        (data.user.user_metadata?.full_name as string | undefined) ||
        (data.user.email?.split('@')[0] ?? 'Driver'),
      mfaEnabled,
      role: (data.user.app_metadata?.role as 'user' | 'admin' | undefined) ?? 'user',
    };
  }

  const session = readStorage<{ userId: string } | null>(STORAGE_KEYS.SESSION, null);
  if (!session) return null;
  const users = readStorage<StoredUser[]>(STORAGE_KEYS.USERS, []);
  const found = users.find((u) => u.id === session.userId && u.verified);
  if (!found) return null;
  return {
    id: found.id,
    email: found.email,
    name: found.name,
    mfaEnabled: found.mfaEnabled,
    role: 'user',
  };
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ user: UserProfile; requiresMfa: boolean; factorId?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (error) throw new ApiError(error.message, 401);

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const verifiedFactor = factors?.totp?.find((f) => f.status === 'verified');

    const profile: UserProfile = {
      id: data.user.id,
      email: data.user.email ?? normalizedEmail,
      name:
        (data.user.user_metadata?.full_name as string | undefined) ||
        normalizedEmail.split('@')[0],
      mfaEnabled: Boolean(verifiedFactor),
    };

    if (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2' && verifiedFactor) {
      return { user: profile, requiresMfa: true, factorId: verifiedFactor.id };
    }
    return { user: profile, requiresMfa: false };
  }

  const users = readStorage<StoredUser[]>(STORAGE_KEYS.USERS, []);
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user || user.password !== password) {
    throw new ApiError('Invalid email or password.', 401);
  }
  if (!user.verified) {
    throw new ApiError('Please verify your email address with the 6-digit code first.', 403);
  }

  const profile: UserProfile = {
    id: user.id,
    email: user.email,
    name: user.name,
    mfaEnabled: user.mfaEnabled,
  };

  if (user.mfaEnabled) {
    return { user: profile, requiresMfa: true, factorId: 'local-totp' };
  }

  writeStorage(STORAGE_KEYS.SESSION, { userId: user.id });
  return { user: profile, requiresMfa: false };
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<{ email: string; demoOtpCode?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });
    if (error) throw new ApiError(error.message, 400);
    return { email: normalizedEmail };
  }

  const users = readStorage<StoredUser[]>(STORAGE_KEYS.USERS, []);
  const existing = users.find((u) => u.email === normalizedEmail);
  if (existing && existing.verified) {
    throw new ApiError('An account with this email already exists. Please sign in.', 409);
  }

  const nextUser: StoredUser = {
    id: existing?.id ?? (crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`),
    email: normalizedEmail,
    name: name.trim() || normalizedEmail.split('@')[0],
    password,
    verified: false,
    mfaEnabled: false,
  };

  const filtered = users.filter((u) => u.email !== normalizedEmail);
  writeStorage(STORAGE_KEYS.USERS, [...filtered, nextUser]);

  const otpCode = generateSixDigitCode();
  const otps = readStorage<PendingOtp[]>(STORAGE_KEYS.PENDING_OTPS, []).filter(
    (o) => o.email !== normalizedEmail,
  );
  otps.push({
    email: normalizedEmail,
    code: otpCode,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
  writeStorage(STORAGE_KEYS.PENDING_OTPS, otps);

  // Never sign the user in before the 6-digit code is verified!
  return { email: normalizedEmail, demoOtpCode: otpCode };
}

export async function verifyEmailOtp(email: string, token: string): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanCode = token.trim();

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: cleanCode,
      type: 'signup',
    });
    if (error || !data.user) throw new ApiError(error?.message || 'Invalid verification code.', 400);
    return {
      id: data.user.id,
      email: data.user.email ?? normalizedEmail,
      name:
        (data.user.user_metadata?.full_name as string | undefined) ||
        normalizedEmail.split('@')[0],
      mfaEnabled: false,
    };
  }

  const otps = readStorage<PendingOtp[]>(STORAGE_KEYS.PENDING_OTPS, []);
  const match = otps.find((o) => o.email === normalizedEmail && o.code === cleanCode);
  if (!match || match.expiresAt < Date.now()) {
    throw new ApiError('Invalid or expired 6-digit verification code.', 400);
  }

  const users = readStorage<StoredUser[]>(STORAGE_KEYS.USERS, []);
  const idx = users.findIndex((u) => u.email === normalizedEmail);
  if (idx === -1) throw new ApiError('Account record not found.', 404);

  users[idx] = { ...users[idx], verified: true };
  writeStorage(STORAGE_KEYS.USERS, users);
  writeStorage(
    STORAGE_KEYS.PENDING_OTPS,
    otps.filter((o) => o.email !== normalizedEmail),
  );
  writeStorage(STORAGE_KEYS.SESSION, { userId: users[idx].id });

  return {
    id: users[idx].id,
    email: users[idx].email,
    name: users[idx].name,
    mfaEnabled: users[idx].mfaEnabled,
  };
}

export async function resendEmailOtp(email: string): Promise<{ demoOtpCode?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizedEmail,
    });
    if (error) throw new ApiError(error.message, 400);
    return {};
  }

  const otpCode = generateSixDigitCode();
  const otps = readStorage<PendingOtp[]>(STORAGE_KEYS.PENDING_OTPS, []).filter(
    (o) => o.email !== normalizedEmail,
  );
  otps.push({
    email: normalizedEmail,
    code: otpCode,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
  writeStorage(STORAGE_KEYS.PENDING_OTPS, otps);
  return { demoOtpCode: otpCode };
}

export async function requestPasswordReset(email: string): Promise<{ demoToken?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return {};
  }

  const users = readStorage<StoredUser[]>(STORAGE_KEYS.USERS, []);
  const exists = users.some((u) => u.email === normalizedEmail);
  if (!exists) {
    // Always behave identically so caller shows generic success message
    return {};
  }
  const token = `rst-${Math.random().toString(36).slice(2, 10)}`;
  const tokens = readStorage<Array<{ email: string; token: string; expiresAt: number }>>(
    STORAGE_KEYS.RESET_TOKENS,
    [],
  );
  tokens.push({ email: normalizedEmail, token, expiresAt: Date.now() + 30 * 60 * 1000 });
  writeStorage(STORAGE_KEYS.RESET_TOKENS, tokens);
  return { demoToken: token };
}

export async function resetPassword(newPassword: string, token?: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new ApiError(error.message, 400);
    await supabase.auth.signOut();
    return;
  }

  if (!token) {
    throw new ApiError('Missing or invalid password reset token.', 400);
  }

  const tokens = readStorage<Array<{ email: string; token: string; expiresAt: number }>>(
    STORAGE_KEYS.RESET_TOKENS,
    [],
  );
  const found = tokens.find((t) => t.token === token && t.expiresAt > Date.now());
  if (!found) {
    throw new ApiError('This reset link is invalid or has expired.', 400);
  }

  const users = readStorage<StoredUser[]>(STORAGE_KEYS.USERS, []);
  const idx = users.findIndex((u) => u.email === found.email);
  if (idx === -1) throw new ApiError('Account not found.', 404);

  users[idx] = { ...users[idx], password: newPassword };
  writeStorage(STORAGE_KEYS.USERS, users);
  writeStorage(
    STORAGE_KEYS.RESET_TOKENS,
    tokens.filter((t) => t.token !== token),
  );
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export async function enrollMfa(user: UserProfile): Promise<{
  factorId: string;
  secret: string;
  otpauthUri: string;
  recoveryCodes: string[];
}> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'ParkEase Authenticator',
    });
    if (error) throw new ApiError(error.message, 400);
    return {
      factorId: data.id,
      secret: data.totp.secret,
      otpauthUri: data.totp.uri,
      recoveryCodes: generateRecoveryCodes(),
    };
  }

  const secret = generateTotpSecret();
  const recoveryCodes = generateRecoveryCodes();
  const otpauthUri = `otpauth://totp/ParkEase:${encodeURIComponent(user.email)}?secret=${secret}&issuer=ParkEase`;
  return {
    factorId: 'local-totp',
    secret,
    otpauthUri,
    recoveryCodes,
  };
}

export async function verifyMfaEnrollment(
  factorId: string,
  code: string,
  user: UserProfile,
  secret?: string,
  recoveryCodes?: string[],
): Promise<UserProfile> {
  if (!/^\d{6}$/.test(code.trim())) {
    throw new ApiError('Enter a valid 6-digit authenticator code.', 400);
  }

  if (isSupabaseConfigured && supabase) {
    const { data: challenge, error: chError } = await supabase.auth.mfa.challenge({ factorId });
    if (chError) throw new ApiError(chError.message, 400);
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });
    if (error) throw new ApiError(error.message, 400);
    return { ...user, mfaEnabled: true };
  }

  const users = readStorage<StoredUser[]>(STORAGE_KEYS.USERS, []);
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) throw new ApiError('User not found.', 404);
  users[idx] = {
    ...users[idx],
    mfaEnabled: true,
    mfaSecret: secret,
    recoveryCodes,
  };
  writeStorage(STORAGE_KEYS.USERS, users);
  return { ...user, mfaEnabled: true };
}

export async function verifyMfaChallenge(
  user: UserProfile,
  factorId: string,
  codeOrRecovery: string,
): Promise<UserProfile> {
  const clean = codeOrRecovery.trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    const { data: challenge, error: chError } = await supabase.auth.mfa.challenge({ factorId });
    if (chError) throw new ApiError(chError.message, 400);
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: clean,
    });
    if (error) throw new ApiError(error.message, 401);
    return user;
  }

  const users = readStorage<StoredUser[]>(STORAGE_KEYS.USERS, []);
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) throw new ApiError('Account not found.', 404);

  const isSixDigits = /^\d{6}$/.test(clean);
  const recoveryMatch = users[idx].recoveryCodes?.includes(clean);

  if (!isSixDigits && !recoveryMatch) {
    throw new ApiError('Invalid 6-digit authenticator code or recovery code.', 401);
  }

  if (recoveryMatch && users[idx].recoveryCodes) {
    users[idx] = {
      ...users[idx],
      recoveryCodes: users[idx].recoveryCodes!.filter((c) => c !== clean),
    };
    writeStorage(STORAGE_KEYS.USERS, users);
  }

  writeStorage(STORAGE_KEYS.SESSION, { userId: users[idx].id });
  return user;
}

export async function disableMfa(user: UserProfile): Promise<UserProfile> {
  if (isSupabaseConfigured && supabase) {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    for (const f of factors?.totp ?? []) {
      await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    return { ...user, mfaEnabled: false };
  }

  const users = readStorage<StoredUser[]>(STORAGE_KEYS.USERS, []);
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], mfaEnabled: false, mfaSecret: undefined, recoveryCodes: undefined };
    writeStorage(STORAGE_KEYS.USERS, users);
  }
  return { ...user, mfaEnabled: false };
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
    return;
  }
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}
