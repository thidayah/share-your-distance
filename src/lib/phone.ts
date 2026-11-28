export function normalizeIndonesianPhone(value: string): string | null {
  const compact = value.trim().replace(/[\s-]/g, '');
  const digits = compact.startsWith('+') ? compact.slice(1) : compact;

  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith('0') && digits.length > 1) return `62${digits.slice(1)}`;
  if (digits.startsWith('62') && digits.length > 2) return digits;

  return null;
}
