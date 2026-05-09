import type { LyricLine } from "./types/lyricfloat";
import { getLyrics, getProgress } from "./spicetify";
import { state, icon } from "./state";
import { applyThemeVars } from "./theme";

let themeTick = 0;

export function renderLyrics(doc: Document): void {
  const list = doc.getElementById("pip-lyrics-list");
  const noLyrics = doc.getElementById("pip-no-lyrics");
  if (!list) return;

  if (!state.lyricsData.length) {
    list.innerHTML = "";
    noLyrics?.classList.add("visible");
    return;
  }
  noLyrics?.classList.remove("visible");

  const currentMs = getProgress().ms;
  let newIndex = -1;
  for (let i = state.lyricsData.length - 1; i >= 0; i--) {
    if (currentMs >= state.lyricsData[i].startTimeMs) { newIndex = i; break; }
  }

  if (newIndex === state.currentLineIndex) return;
  state.currentLineIndex = newIndex;

  const lines = list.querySelectorAll(".pip-lyric-line");
  lines.forEach((el, i) => {
    const h = el as HTMLElement;
    h.classList.remove("active", "past");
    h.style.fontSize = state.fontSize + "px";
    if (i < state.currentLineIndex) h.classList.add("past");
    else if (i === state.currentLineIndex) {
      h.classList.add("active");
      h.style.fontSize = (state.fontSize + 1) + "px";
    }
  });

  if (state.currentLineIndex >= 0 && lines[state.currentLineIndex]) {
    lines[state.currentLineIndex].scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function buildLyricsList(doc: Document): void {
  const list = doc.getElementById("pip-lyrics-list");
  const noLyrics = doc.getElementById("pip-no-lyrics");
  if (!list) return;

  state.currentLineIndex = -1;

  if (!state.lyricsData.length) {
    list.innerHTML = "";
    noLyrics?.classList.add("visible");
    return;
  }

  noLyrics?.classList.remove("visible");
  list.innerHTML = state.lyricsData.map((line: LyricLine, i: number) =>
    `<div class="pip-lyric-line" data-index="${i}" data-time="${line.startTimeMs}" style="font-size:${state.fontSize}px">${line.words || "♪"}</div>`
  ).join("");
}

export async function fetchAndRenderLyrics(doc: Document): Promise<void> {
  const list = doc.getElementById("pip-lyrics-list");
  if (list) list.innerHTML = `<div class="pip-loading">Loading...</div>`;
  doc.getElementById("pip-no-lyrics")?.classList.remove("visible");

  state.lyricsData = await getLyrics();
  buildLyricsList(doc);
  renderLyrics(doc);
}

function updateProgressBar(doc: Document): void {
  const fill = doc.getElementById("pip-progress-fill");
  if (!fill) return;
  const { ms, total } = getProgress();
  fill.style.width = total > 0 ? Math.min((ms / total) * 100, 100) + "%" : "0%";
}

export function updatePlayerControls(doc: Document): void {
  const playBtn = doc.getElementById("pip-play");
  const shuffleBtn = doc.getElementById("pip-shuffle");
  const heartBtn = doc.getElementById("pip-heart");

  if (playBtn) playBtn.innerHTML = Spicetify.Player.isPlaying() ? icon("pause", 18) : icon("play", 18);
  if (shuffleBtn) {
    const canShuffle = Spicetify.Player.data?.restrictions?.canToggleShuffle !== false;
    shuffleBtn.style.opacity = !canShuffle ? "0.15" : Spicetify.Player.getShuffle() ? "1" : "0.4";
    shuffleBtn.style.pointerEvents = canShuffle ? "auto" : "none";
    shuffleBtn.style.cursor = canShuffle ? "pointer" : "default";
  }
  if (heartBtn) {
    const liked = Spicetify.Player.getHeart();
    heartBtn.innerHTML = icon(liked ? "heart-active" : "heart", 14);
    heartBtn.style.color = liked ? "#1db954" : "";
  }
}

export function startLyricsSync(doc: Document): void {
  stopLyricsSync();
  themeTick = 0;
  state.lyricsInterval = setInterval(() => {
    renderLyrics(doc);
    updatePlayerControls(doc);
    updateProgressBar(doc);
    themeTick++;
    if (themeTick % 20 === 0) applyThemeVars(doc);
  }, 250);
}

export function stopLyricsSync(): void {
  if (state.lyricsInterval) {
    clearInterval(state.lyricsInterval);
    state.lyricsInterval = null;
  }
}
