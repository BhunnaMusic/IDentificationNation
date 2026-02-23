import { toCamelot } from "@/lib/camelot";

describe("toCamelot", () => {
  // All 12 minor keys
  it.each([
    [0, 0, "5A"],   // C minor
    [1, 0, "12A"],  // C# minor
    [2, 0, "7A"],   // D minor
    [3, 0, "2A"],   // Eb minor
    [4, 0, "9A"],   // E minor
    [5, 0, "4A"],   // F minor
    [6, 0, "11A"],  // F# minor
    [7, 0, "6A"],   // G minor
    [8, 0, "1A"],   // Ab minor
    [9, 0, "8A"],   // A minor
    [10, 0, "3A"],  // Bb minor
    [11, 0, "10A"], // B minor
  ])("converts key=%i mode=%i (minor) to %s", (key, mode, expected) => {
    expect(toCamelot(key, mode)).toBe(expected);
  });

  // All 12 major keys
  it.each([
    [0, 1, "8B"],   // C major
    [1, 1, "3B"],   // Db major
    [2, 1, "10B"],  // D major
    [3, 1, "5B"],   // Eb major
    [4, 1, "12B"],  // E major
    [5, 1, "7B"],   // F major
    [6, 1, "2B"],   // F# major
    [7, 1, "9B"],   // G major
    [8, 1, "4B"],   // Ab major
    [9, 1, "11B"],  // A major
    [10, 1, "6B"],  // Bb major
    [11, 1, "1B"],  // B major
  ])("converts key=%i mode=%i (major) to %s", (key, mode, expected) => {
    expect(toCamelot(key, mode)).toBe(expected);
  });

  // Invalid inputs
  it("returns null for key < 0", () => {
    expect(toCamelot(-1, 0)).toBeNull();
  });

  it("returns null for key > 11", () => {
    expect(toCamelot(12, 1)).toBeNull();
  });

  it("returns null for invalid mode", () => {
    expect(toCamelot(5, 2)).toBeNull();
  });

  it("returns null for negative mode", () => {
    expect(toCamelot(5, -1)).toBeNull();
  });
});
