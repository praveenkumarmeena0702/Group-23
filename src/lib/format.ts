import { format, parseISO } from 'date-fns';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

/** Format number in Indian Rupees with Indian digit grouping (e.g. ₹1,20,000). */
export function formatINR(amount: number): string {
  return `₹${inrFormatter.format(Math.round(amount))}`;
}

/** Format ISO date ("yyyy-MM-dd" or ISO timestamp) as "23 Nov 2026". */
export function formatDateDisplay(dateStr: string): string {
  try {
    const parsed = dateStr.includes('T') ? parseISO(dateStr) : parseISO(`${dateStr}T00:00:00`);
    return format(parsed, 'd MMM yyyy');
  } catch {
    return dateStr;
  }
}

/** Format 24-hour time string "HH:mm" as "7:30 PM". */
export function formatTimeDisplay(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const mins = String(m).padStart(2, '0');
  return `${hour12}:${mins} ${period}`;
}

/**
 * Compute parking duration in hours from HH:mm start and end times.
 * Wraps past midnight when end <= start only if explicitly allowed; wait:
 * Business rules: "hours = (end - start), wrapping past midnight; reject zero/invalid ranges."
 * If start === end -> 0 (invalid). If end < start -> wraps past midnight (+24h).
 */
export function calculateDurationHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return 0;

  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  if (startMins === endMins) return 0;

  let diffMins = endMins - startMins;
  if (diffMins < 0) {
    diffMins += 24 * 60;
  }
  return Math.round((diffMins / 60) * 100) / 100;
}

/** Format hours count cleanly, e.g. "2 hrs", "1.5 hrs", "1 hr". */
export function formatHours(hours: number): string {
  const rounded = Number(hours.toFixed(2));
  return `${rounded} ${rounded === 1 ? 'hr' : 'hrs'}`;
}

/** Format Indian vehicle registration plate uppercase without invalid chars. */
export function formatVehiclePlate(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9\s-]/g, '').slice(0, 15);
}

/** Validate Indian vehicle registration number (e.g. MH 02 AB 1234 or MH02AB1234). */
export function isValidVehiclePlate(plate: string): boolean {
  const compact = plate.replace(/[\s-]/g, '').toUpperCase();
  return /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{3,4}$/.test(compact);
}

/** Generate "PE-" + 5 uppercase base36 characters. */
export function generateBookingCode(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = 'PE-';
  for (let i = 0; i < 5; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Get today's date in yyyy-MM-dd local format. */
export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
