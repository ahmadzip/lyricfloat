export interface TrackInfo {
  title: string;
  artist: string;
  art: string;
}

export interface Progress {
  ms: number;
  total: number;
}

export interface LyricLine {
  startTimeMs: number;
  words: string;
}

export interface PipConfig {
  pipWidth: number;
  pipHeight: number;
}

export interface PipState {
  pipWindow: Window | null;
  lyricsData: LyricLine[];
  lyricsInterval: ReturnType<typeof setInterval> | null;
  currentLineIndex: number;
  fontSize: number;
}
