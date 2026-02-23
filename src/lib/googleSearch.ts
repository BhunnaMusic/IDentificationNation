/**
 * Google Search Grounding via the Gemini API (generativelanguage.googleapis.com).
 *
 * This module calls the Gemini model with the `googleSearch` tool enabled so
 * that the model can ground its response in real-time web results.  The result
 * is a free-text string containing the song backstory and lyric meaning.
 */

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export interface ContextSearchResult {
  backstory: string;
  lyric_meaning: string;
  sub_genre: string;
}

/**
 * Retrieve song backstory, lyric meaning, and sub-genre using Google Search
 * Grounding through the Gemini generative-language API.
 */
export async function searchSongContext(
  title: string,
  artist: string
): Promise<ContextSearchResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  const prompt = [
    `You are a music historian and DJ assistant.`,
    `For the song "${title}" by ${artist}, provide the following in JSON format with these exact keys:`,
    `- "backstory": The origin story, cultural context, and interesting history of the song (2-3 paragraphs).`,
    `- "lyric_meaning": An interpretation of the lyrics, themes, and emotional content (1-2 paragraphs).`,
    `- "sub_genre": The most specific sub-genre label for DJs (e.g. "Deep House", "Progressive Trance", "Afrobeats", etc.) as a short string.`,
    `Use Google Search to ground your answer in factual, up-to-date information.`,
    `Return only valid JSON — no markdown fences, no extra text.`,
  ].join("\n");

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    tools: [{ googleSearch: {} }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  };

  const url = `${GEMINI_API_BASE}/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const json = await res.json();

  const rawText: string =
    json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  try {
    const parsed = JSON.parse(rawText) as Partial<ContextSearchResult>;
    return {
      backstory: parsed.backstory ?? "",
      lyric_meaning: parsed.lyric_meaning ?? "",
      sub_genre: parsed.sub_genre ?? "",
    };
  } catch {
    // If the model returns non-JSON prose, surface it as backstory
    return {
      backstory: rawText,
      lyric_meaning: "",
      sub_genre: "",
    };
  }
}
