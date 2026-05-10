import { getCurrentPlay, seek } from "./spicetify";
import { state, CONFIG, icon } from "./state";
import { applyThemeVars, getStyles } from "./theme";
import { fetchAndRenderLyrics, updatePlayerControls, startLyricsSync, stopLyricsSync } from "./lyrics";

function updateNowPlaying(doc: Document): void {
  const track = getCurrentPlay();
  const t = doc.getElementById("pip-title");
  const a = doc.getElementById("pip-artist");
  const img = doc.getElementById("pip-album-art") as HTMLImageElement | null;
  if (t) t.textContent = track.title || "No track";
  if (a) a.textContent = track.artist || "";
  if (img) img.src = track.art || "";
}

function applyFontSize(doc: Document): void {
  doc.querySelectorAll(".pip-lyric-line").forEach((el) => {
    const h = el as HTMLElement;
    h.style.fontSize = (el.classList.contains("active") ? state.fontSize + 1 : state.fontSize) + "px";
  });
}

function setupDrag(doc: Document): void {
  const header = doc.getElementById("pip-header");
  if (!header) return;
  let dragging = false, lastX = 0, lastY = 0;

  header.addEventListener("mousedown", (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragging = true; lastX = e.screenX; lastY = e.screenY;
    header.style.cursor = "grabbing";
  });
  doc.addEventListener("mousemove", (e: MouseEvent) => {
    if (!dragging) return;
    state.pipWindow?.moveBy(e.screenX - lastX, e.screenY - lastY);
    lastX = e.screenX; lastY = e.screenY;
  });
  doc.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false; header.style.cursor = "grab";
  });
}

function setupEvents(doc: Document): void {
  doc.getElementById("pip-close")?.addEventListener("click", () => {
    stopLyricsSync(); state.pipWindow?.close(); state.pipWindow = null;
  });
  doc.getElementById("pip-font-down")?.addEventListener("click", () => {
    state.fontSize = Math.max(10, state.fontSize - 1); applyFontSize(doc);
  });
  doc.getElementById("pip-font-up")?.addEventListener("click", () => {
    state.fontSize = Math.min(22, state.fontSize + 1); applyFontSize(doc);
  });
  doc.getElementById("pip-play")?.addEventListener("click", () => Spicetify.Player.togglePlay());
  doc.getElementById("pip-prev")?.addEventListener("click", () => Spicetify.Player.back());
  doc.getElementById("pip-next")?.addEventListener("click", () => Spicetify.Player.next());
  doc.getElementById("pip-shuffle")?.addEventListener("click", () => Spicetify.Player.toggleShuffle());
  doc.getElementById("pip-heart")?.addEventListener("click", () => {
    Spicetify.Player.toggleHeart();
    setTimeout(() => updatePlayerControls(doc), 300);
  });
  doc.getElementById("pip-mute")?.addEventListener("click", () => {
    Spicetify.Player.toggleMute();
    setTimeout(() => updateVolumeControls(doc), 100);
  });
  const volumeSlider = doc.getElementById("pip-volume-slider") as HTMLInputElement | null;
  if (volumeSlider) {
    volumeSlider.value = String(Math.round(Spicetify.Player.getVolume() * 100));
    volumeSlider.addEventListener("input", (e: Event) => {
      const val = Number((e.target as HTMLInputElement).value) / 100;
      Spicetify.Player.setVolume(val);
      updateVolumeIcon(doc, val);
      updateSliderFill(doc, val * 100);
    });
  }
  doc.getElementById("pip-lyrics-list")?.addEventListener("click", (e: Event) => {
    const line = (e.target as HTMLElement).closest(".pip-lyric-line") as HTMLElement | null;
    if (!line) return;
    const idx = parseInt(line.dataset.index || "", 10);
    if (!isNaN(idx) && state.lyricsData[idx]) seek(state.lyricsData[idx].startTimeMs);
  });
  setupDrag(doc);
}

function getVolumeIconName(vol: number): string {
  if (Spicetify.Player.getMute() || vol <= 0) return "volume-off";
  if (vol < 0.33) return "volume-one-wave";
  if (vol < 0.66) return "volume-two-wave";
  return "volume";
}

function updateVolumeIcon(doc: Document, vol: number): void {
  const muteBtn = doc.getElementById("pip-mute");
  if (muteBtn) muteBtn.innerHTML = icon(getVolumeIconName(vol), 14);
}

function updateSliderFill(doc: Document, pct: number): void {
  const slider = doc.getElementById("pip-volume-slider") as HTMLInputElement | null;
  if (slider) slider.style.setProperty("--pip-vol-pct", pct + "%");
}

export function updateVolumeControls(doc: Document): void {
  const vol = Spicetify.Player.getVolume();
  const muted = Spicetify.Player.getMute();
  updateVolumeIcon(doc, muted ? 0 : vol);
  const slider = doc.getElementById("pip-volume-slider") as HTMLInputElement | null;
  if (slider) {
    const display = muted ? 0 : Math.round(vol * 100);
    slider.value = String(display);
    updateSliderFill(doc, display);
  }
}

function getHTML(): string {
  return `
    <div id="pip-header-wrap">
      <div id="pip-header">
        <div id="pip-song-info">
          <img id="pip-album-art" src="" alt="" />
          <div id="pip-meta">
            <span id="pip-title">No track playing</span>
            <span id="pip-artist"></span>
          </div>
        </div>
        <div id="pip-controls">
          <button id="pip-font-down" title="Perkecil teks">A-</button>
          <button id="pip-font-up" title="Perbesar teks">A+</button>
          <button id="pip-close" title="Tutup">✕</button>
        </div>
      </div>
      <div id="pip-progress"><div id="pip-progress-fill"></div></div>
      <div id="pip-player">
        <button id="pip-shuffle" title="Shuffle">${icon("shuffle", 14)}</button>
        <button id="pip-prev" title="Previous">${icon("skip-back", 16)}</button>
        <button id="pip-play" title="Play/Pause">${icon("play", 18)}</button>
        <button id="pip-next" title="Next">${icon("skip-forward", 16)}</button>
        <button id="pip-heart" title="Like">${icon("heart", 14)}</button>
      </div>
      <div id="pip-volume-row">
        <button id="pip-mute" title="Mute">${icon(getVolumeIconName(Spicetify.Player.getVolume()), 14)}</button>
        <input id="pip-volume-slider" type="range" min="0" max="100" value="${Math.round(Spicetify.Player.getVolume() * 100)}" style="--pip-vol-pct:${Math.round(Spicetify.Player.getVolume() * 100)}%" />
      </div>
    </div>
    <div id="pip-lyrics-container">
      <div id="pip-lyrics-list"></div>
      <div id="pip-no-lyrics">♪ Lirik tidak tersedia</div>
    </div>
  `;
}

export async function openPictureInPicture(): Promise<void> {
  if (state.pipWindow && !state.pipWindow.closed) {
    state.pipWindow.close();
    state.pipWindow = null;
    stopLyricsSync();
    return;
  }

  if ("documentPictureInPicture" in window) {
    state.pipWindow = await (window as any).documentPictureInPicture.requestWindow({
      width: CONFIG.pipWidth, height: CONFIG.pipHeight,
    });
  }

  if (!state.pipWindow || state.pipWindow.closed) {
    state.pipWindow = window.open(
      "about:blank", "lyricfloat",
      `width=${CONFIG.pipWidth},height=${CONFIG.pipHeight},left=${screen.width - CONFIG.pipWidth - 30},top=30,resizable=yes,scrollbars=no`
    );
  }

  if (!state.pipWindow) throw new Error("Failed to open PiP window");

  const doc = state.pipWindow.document;
  doc.title = "lyricfloat";
  doc.body.innerHTML = `<style>${getStyles()}</style>${getHTML()}`;

  applyThemeVars(doc);
  setupEvents(doc);
  updateNowPlaying(doc);
  updatePlayerControls(doc);
  await fetchAndRenderLyrics(doc);
  startLyricsSync(doc);

  Spicetify.Player.addEventListener("songchange", async () => {
    if (!state.pipWindow || state.pipWindow.closed) { stopLyricsSync(); return; }
    const d = state.pipWindow.document;
    updateNowPlaying(d);
    updatePlayerControls(d);
    await fetchAndRenderLyrics(d);
  });

  state.pipWindow.addEventListener("beforeunload", () => {
    stopLyricsSync();
    state.pipWindow = null;
  });
}
