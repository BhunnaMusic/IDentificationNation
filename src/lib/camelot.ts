/**
 * Camelot Wheel conversion utility.
 *
 * Spotify represents musical key as an integer 0–11 using Pitch Class notation
 * (0 = C, 1 = C♯/D♭, … 11 = B) and mode as 0 (minor) or 1 (major).
 *
 * The Camelot Wheel maps each key+mode combination to a number (1–12) and a
 * letter (A = minor, B = major) that DJs use to identify harmonically compatible
 * tracks.
 */

/** Maps [keyNumber][mode] → Camelot string. */
const CAMELOT_MAP: Record<number, Record<number, string>> = {
  0:  { 1: "8B",  0: "5A" },  // C  major / A  minor
  1:  { 1: "3B",  0: "12A" }, // C♯ major / A♯ minor
  2:  { 1: "10B", 0: "7A" },  // D  major / B  minor
  3:  { 1: "5B",  0: "2A" },  // D♯ major / C  minor
  4:  { 1: "12B", 0: "9A" },  // E  major / C♯ minor
  5:  { 1: "7B",  0: "4A" },  // F  major / D  minor
  6:  { 1: "2B",  0: "11A" }, // F♯ major / D♯ minor
  7:  { 1: "9B",  0: "6A" },  // G  major / E  minor
  8:  { 1: "4B",  0: "1A" },  // G♯ major / F  minor
  9:  { 1: "11B", 0: "8A" },  // A  major / F♯ minor
  10: { 1: "6B",  0: "3A" },  // A♯ major / G  minor
  11: { 1: "1B",  0: "10A" }, // B  major / G♯ minor
};

/**
 * Convert a Spotify key (0–11) and mode (0 = minor, 1 = major) to the
 * corresponding Camelot Wheel notation string (e.g. "8A", "3B").
 *
 * Returns `null` when either value is outside the valid range or when Spotify
 * reports that the key could not be detected (key = -1).
 */
export function toCamelot(key: number, mode: number): string | null {
  if (key === -1) return null;
  if (key < 0 || key > 11) return null;
  if (mode !== 0 && mode !== 1) return null;
  return CAMELOT_MAP[key][mode] ?? null;
}
