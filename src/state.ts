import type { PipState, PipConfig } from "./types/lyricfloat";

export const CONFIG: PipConfig = { pipWidth: 380, pipHeight: 520 };

export const state: PipState = {
  pipWindow: null,
  lyricsData: [],
  lyricsInterval: null,
  currentLineIndex: -1,
  fontSize: 14,
};

export function icon(name: string, size = 16): string {
  const svg = (Spicetify as any).SVGIcons?.[name] || "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="currentColor">${svg}</svg>`;
}
