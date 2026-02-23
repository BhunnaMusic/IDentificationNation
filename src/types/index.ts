export interface Song {
  id?: string;
  isrc: string;
  title: string;
  artist: string;
  bpm: number | null;
  key_number: number | null;
  mode: number | null;
  camelot_key: string | null;
  energy: number | null;
  danceability: number | null;
  backstory: string | null;
  lyric_meaning: string | null;
  sub_genre: string | null;
  spotify_id: string | null;
  youtube_id: string | null;
  album_art: string | null;
  preview_url: string | null;
  created_at?: string;
}

export interface AudioFeatures {
  bpm: number;
  key: number;
  mode: number;
  camelot_key: string;
  energy: number;
  danceability: number;
}

export interface SearchResult {
  song: Song;
  similar_songs?: SimilarSong[];
}

export interface SimilarSong {
  title: string;
  artist: string;
  spotify_id: string | null;
  camelot_key: string | null;
  bpm: number | null;
}
