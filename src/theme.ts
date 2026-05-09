const SPICE_VARS = [
  "main", "player", "text", "subtext", "button", "button-active", "button-disabled",
  "card", "misc", "sidebar", "shadow", "selected-row", "tab-active",
  "accent", "accent-active", "accent-inactive",
  "border-active", "border-inactive", "highlight", "header", "banner",
  "notification", "notification-error",
] as const;

const CSS_VARS = [
  "--font-family", "--font-size", "--font-weight", "--line-height",
  "--border-radius", "--border-width", "--border-style", "--border-transition",
] as const;

export function extractThemeVars(): Record<string, string> {
  const style = getComputedStyle(document.documentElement);
  const vars: Record<string, string> = {};
  for (const name of SPICE_VARS) {
    vars[`--spice-${name}`] = style.getPropertyValue(`--spice-${name}`).trim();
  }
  for (const name of CSS_VARS) {
    vars[name] = style.getPropertyValue(name).trim();
  }
  return vars;
}

export function applyThemeVars(doc: Document): void {
  const vars = extractThemeVars();
  const root = doc.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    if (value) root.style.setProperty(key, value);
  }
  const font = getComputedStyle(document.body).fontFamily;
  if (font) root.style.setProperty("--spice-font", font);
}

export function getStyles(): string {
  return `
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:var(--spice-main,#121212);color:var(--spice-text,#e0e0e0);font-family:var(--spice-font,var(--font-family,'Segoe UI',sans-serif));overflow:hidden;height:100vh;display:flex;flex-direction:column}
    #pip-header-wrap{flex-shrink:0}
    #pip-header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--spice-player,var(--spice-main));border-bottom:var(--border-width,1px) var(--border-style,solid) var(--spice-border-inactive,rgba(255,255,255,.06));gap:8px;cursor:grab;user-select:none;border-radius:var(--border-radius,0) var(--border-radius,0) 0 0;transition:border-color var(--border-transition,.2s ease)}
    #pip-header:hover{border-color:var(--spice-border-active,var(--spice-accent,rgba(255,255,255,.12)))}
    #pip-song-info{display:flex;align-items:center;gap:8px;overflow:hidden;flex:1}
    #pip-album-art{width:36px;height:36px;border-radius:var(--border-radius,6px);object-fit:cover;flex-shrink:0;background:var(--spice-card,var(--spice-main));border:var(--border-width,1px) var(--border-style,solid) var(--spice-border-inactive,rgba(255,255,255,.06))}
    #pip-meta{display:flex;flex-direction:column;overflow:hidden}
    #pip-title{font-size:12px;font-weight:600;color:var(--spice-text,#fff);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #pip-artist{font-size:10px;color:var(--spice-subtext,rgba(255,255,255,.45));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
    #pip-controls{display:flex;gap:4px;flex-shrink:0}
    #pip-controls button{background:var(--spice-highlight,rgba(255,255,255,.07));border:var(--border-width,1px) var(--border-style,solid) var(--spice-border-inactive,transparent);color:var(--spice-subtext,rgba(255,255,255,.6));width:24px;height:24px;border-radius:var(--border-radius,6px);cursor:pointer;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s,border-color var(--border-transition,.2s ease)}
    #pip-controls button:hover{background:var(--spice-highlight,rgba(255,255,255,.14));color:var(--spice-text,#fff);border-color:var(--spice-border-active,var(--spice-accent,rgba(255,255,255,.2)))}
    #pip-close:hover{background:rgba(255,80,80,.3)!important;color:#ff6b6b!important;border-color:rgba(255,80,80,.5)!important}
    #pip-font-down,#pip-font-up{opacity:0;visibility:hidden;pointer-events:none;transform:scale(0.8) translateX(10px);transition:opacity .25s ease,visibility .25s ease,transform .25s ease}
    #pip-header-wrap:hover #pip-font-down,#pip-header-wrap:hover #pip-font-up{opacity:1;visibility:visible;pointer-events:auto;transform:scale(1) translateX(0)}
    #pip-progress{height:3px;background:var(--spice-button-disabled,var(--spice-accent-inactive,rgba(255,255,255,.06)));flex-shrink:0}
    #pip-progress-fill{height:100%;width:0%;background:var(--spice-button-active,var(--spice-accent-active,var(--spice-accent,#1db954)));transition:width .25s linear}
    #pip-player{display:flex;align-items:center;justify-content:center;gap:6px;padding:0;max-height:0;overflow:hidden;opacity:0;background:var(--spice-player,var(--spice-main));border-bottom:var(--border-width,1px) var(--border-style,solid) transparent;transition:max-height .25s,opacity .2s,padding .25s,border-color var(--border-transition,.2s ease)}
    #pip-header-wrap:hover #pip-player{max-height:48px;padding:6px 12px;opacity:1;border-bottom-color:var(--spice-border-inactive,rgba(255,255,255,.04))}
    #pip-player button{background:none;border:var(--border-width,1px) var(--border-style,solid) transparent;color:var(--spice-subtext,rgba(255,255,255,.55));width:30px;height:30px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s,transform .1s,border-color var(--border-transition,.2s ease)}
    #pip-player button:hover{color:var(--spice-text,#fff);background:var(--spice-highlight,rgba(255,255,255,.08));border-color:var(--spice-border-active,var(--spice-accent,rgba(255,255,255,.1)))}
    #pip-player button:active{transform:scale(.92)}
    #pip-play{width:36px!important;height:36px!important;background:var(--spice-highlight,rgba(255,255,255,.1))!important;border-color:var(--spice-border-inactive,transparent)!important}
    #pip-play:hover{background:var(--spice-accent-inactive,rgba(29,185,84,.15))!important;color:var(--spice-accent,#1db954)!important;border-color:var(--spice-border-active,var(--spice-accent,#1db954))!important}
    #pip-lyrics-container{flex:1;overflow-y:auto;padding:12px 6px;position:relative;scrollbar-width:none;-ms-overflow-style:none}
    #pip-lyrics-container::-webkit-scrollbar{display:none}
    #pip-lyrics-list{display:flex;flex-direction:column;gap:2px}
    #pip-no-lyrics{display:none;position:absolute;inset:0;align-items:center;justify-content:center;color:var(--spice-misc,var(--spice-subtext,rgba(255,255,255,.25)));font-size:13px}
    #pip-no-lyrics.visible{display:flex}
    .pip-lyric-line{padding:5px 10px;border-radius:var(--border-radius,8px);line-height:1.55;color:var(--spice-misc,rgba(255,255,255,.28));cursor:pointer;transition:color .25s,background .25s,border-color var(--border-transition,.2s ease);text-align:center;word-break:break-word;border:var(--border-width,1px) var(--border-style,solid) transparent}
    .pip-lyric-line:hover{color:var(--spice-subtext,rgba(255,255,255,.5));background:var(--spice-highlight,rgba(255,255,255,.04));border-color:var(--spice-border-inactive,rgba(255,255,255,.06))}
    .pip-lyric-line.active{color:var(--spice-text,#fff);font-weight:600;background:var(--spice-highlight,rgba(255,255,255,.06));border-color:var(--spice-border-active,var(--spice-accent,rgba(255,255,255,.1)))}
    .pip-lyric-line.past{color:var(--spice-subtext,rgba(255,255,255,.35));opacity:.45}
    .pip-loading{display:flex;align-items:center;justify-content:center;height:100%;font-size:13px;color:var(--spice-misc,rgba(255,255,255,.3));animation:pulse 1.5s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
  `;
}
