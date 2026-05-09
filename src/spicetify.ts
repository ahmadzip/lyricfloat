import type { TrackInfo, Progress, LyricLine } from "./types/lyricfloat";

export function getCurrentPlay(): TrackInfo {
  const track = Spicetify.Player.data?.item;
  if (!track) return { title: "", artist: "", art: "" };

  return {
    title: track.metadata?.title || track.name || "",
    artist: track.metadata?.artist_name || track.artists?.[0]?.name || "",
    art: track.metadata?.image_url || track.album?.images?.[0]?.url || "",
  };
}

export function getProgress(): Progress {
  return {
    ms: Spicetify.Player.getProgress(),
    total: Spicetify.Player.data?.item?.duration?.milliseconds || 0,
  };
}

export async function getLyrics(): Promise<LyricLine[]> {
  const uri = Spicetify.Player.data?.item?.uri;
  if (!uri) return [];

  const trackId = uri.split(":").pop();
  if (!trackId) return [];

  try {
    const response = await Spicetify.CosmosAsync.get(
      `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&vocalRemoval=false`
    );
    const rawLines = response?.lyrics?.lines;
    if (!Array.isArray(rawLines)) return [];

    return rawLines.map((line: { startTimeMs: string; words: string }) => ({
      startTimeMs: parseInt(line.startTimeMs, 10),
      words: line.words,
    }));
  } catch {
    return [];
  }
}

export function seek(ms: number): void {
  Spicetify.Player.seek(ms);
}
