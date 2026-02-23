const GOOGLE_SEARCH_API = "https://www.googleapis.com/customsearch/v1";

export interface ContextResult {
  backstory: string | null;
  lyricMeaning: string | null;
}

/**
 * Search for a song's backstory and lyric meaning using the Google Custom Search API.
 * This serves as a "Context Search" to find the song's history and cultural significance.
 */
export async function fetchSongContext(
  title: string,
  artist: string
): Promise<ContextResult> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY ?? "";
  const cx = process.env.GOOGLE_SEARCH_CX ?? "";

  if (!apiKey || !cx) {
    return { backstory: null, lyricMeaning: null };
  }

  const backstoryQuery = `${title} ${artist} song history backstory origin`;
  const lyricQuery = `${title} ${artist} lyrics meaning analysis`;

  const [backstoryResult, lyricResult] = await Promise.all([
    searchGoogle(backstoryQuery, apiKey, cx),
    searchGoogle(lyricQuery, apiKey, cx),
  ]);

  return {
    backstory: backstoryResult,
    lyricMeaning: lyricResult,
  };
}

async function searchGoogle(
  query: string,
  apiKey: string,
  cx: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${GOOGLE_SEARCH_API}?q=${encodeURIComponent(query)}&key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(cx)}&num=3`
    );

    if (!res.ok) return null;

    const json = await res.json();
    const items = json?.items;
    if (!items || items.length === 0) return null;

    // Combine snippets from top results
    const snippets = items
      .slice(0, 3)
      .map((item: { snippet?: string }) => item.snippet ?? "")
      .filter(Boolean)
      .join(" ");

    return snippets || null;
  } catch {
    return null;
  }
}
