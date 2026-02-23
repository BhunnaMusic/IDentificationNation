import { toCamelot } from "@/lib/camelot";

describe("toCamelot", () => {
  // Full Camelot wheel – all 24 key/mode combinations
  const ALL_EXPECTED: Array<[number, number, string]> = [
    // Major keys (mode = 1)
    [0,  1, "8B"],
    [1,  1, "3B"],
    [2,  1, "10B"],
    [3,  1, "5B"],
    [4,  1, "12B"],
    [5,  1, "7B"],
    [6,  1, "2B"],
    [7,  1, "9B"],
    [8,  1, "4B"],
    [9,  1, "11B"],
    [10, 1, "6B"],
    [11, 1, "1B"],
    // Minor keys (mode = 0)
    [0,  0, "5A"],
    [1,  0, "12A"],
    [2,  0, "7A"],
    [3,  0, "2A"],
    [4,  0, "9A"],
    [5,  0, "4A"],
    [6,  0, "11A"],
    [7,  0, "6A"],
    [8,  0, "1A"],
    [9,  0, "8A"],
    [10, 0, "3A"],
    [11, 0, "10A"],
  ];

  test.each(ALL_EXPECTED)(
    "key=%i mode=%i → %s",
    (key, mode, expected) => {
      expect(toCamelot(key, mode)).toBe(expected);
    }
  );

  describe("edge cases", () => {
    it("returns null for Spotify's 'no key detected' sentinel (-1)", () => {
      expect(toCamelot(-1, 1)).toBeNull();
    });

    it("returns null for a key below valid range", () => {
      expect(toCamelot(-2, 0)).toBeNull();
    });

    it("returns null for a key above valid range", () => {
      expect(toCamelot(12, 1)).toBeNull();
    });

    it("returns null for an invalid mode", () => {
      expect(toCamelot(0, 2)).toBeNull();
    });

    it("returns null for a negative mode", () => {
      expect(toCamelot(0, -1)).toBeNull();
    });
  });

  describe("well-known DJ examples", () => {
    it("A major (key=9, mode=1) → 11B", () => {
      expect(toCamelot(9, 1)).toBe("11B");
    });

    it("F# minor (key=6, mode=0) → 11A", () => {
      expect(toCamelot(6, 0)).toBe("11A");
    });

    it("126 BPM track in G major (key=7, mode=1) → 9B", () => {
      expect(toCamelot(7, 1)).toBe("9B");
    });
  });
});
