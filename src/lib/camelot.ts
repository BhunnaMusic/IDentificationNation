/**
 * Converts Spotify's key (0-11) and mode (0 or 1) into Camelot Wheel notation.
 *
 * Spotify key mapping: 0=C, 1=C#/Db, 2=D, 3=D#/Eb, 4=E, 5=F,
 *                      6=F#/Gb, 7=G, 8=G#/Ab, 9=A, 10=A#/Bb, 11=B
 * Spotify mode: 1 = Major, 0 = Minor
 *
 * Camelot Wheel: Major keys use "B" suffix, Minor keys use "A" suffix.
 */

// Minor (mode=0) -> "A" suffix, Major (mode=1) -> "B" suffix
const CAMELOT: { minor: Record<number, string>; major: Record<number, string> } = {
  minor: {
    0: "5A",   // C minor
    1: "12A",  // C# minor
    2: "7A",   // D minor
    3: "2A",   // Eb minor
    4: "9A",   // E minor
    5: "4A",   // F minor
    6: "11A",  // F# minor
    7: "6A",   // G minor
    8: "1A",   // Ab minor
    9: "8A",   // A minor
    10: "3A",  // Bb minor
    11: "10A", // B minor
  },
  major: {
    0: "8B",   // C major
    1: "3B",   // Db major
    2: "10B",  // D major
    3: "5B",   // Eb major
    4: "12B",  // E major
    5: "7B",   // F major
    6: "2B",   // F# major
    7: "9B",   // G major
    8: "4B",   // Ab major
    9: "11B",  // A major
    10: "6B",  // Bb major
    11: "1B",  // B major
  },
};

/**
 * Convert Spotify key (0-11) and mode (0=minor, 1=major) to Camelot notation.
 * Returns null if key or mode is invalid.
 */
export function toCamelot(key: number, mode: number): string | null {
  if (key < 0 || key > 11 || (mode !== 0 && mode !== 1)) {
    return null;
  }

  if (mode === 1) {
    return CAMELOT.major[key];
  }
  return CAMELOT.minor[key];
}
