(async()=>{for(;!Spicetify.React||!Spicetify.ReactDOM;)await new Promise(i=>setTimeout(i,10));var e,o,l,r,i;function a(){var i;return{ms:Spicetify.Player.getProgress(),total:(null==(i=null==(i=null==(i=Spicetify.Player.data)?void 0:i.item)?void 0:i.duration)?void 0:i.milliseconds)||0}}function n(i,e=16){return`<svg width="${e}" height="${e}" viewBox="0 0 16 16" fill="currentColor">${(null==(e=Spicetify.SVGIcons)?void 0:e[i])||""}</svg>`}function p(i){var e,t,n=(()=>{var i,e=getComputedStyle(document.documentElement),t={};for(i of l)t["--spice-"+i]=e.getPropertyValue("--spice-"+i).trim();return t})(),r=i.documentElement;for([e,t]of Object.entries(n))t&&r.style.setProperty(e,t);i=getComputedStyle(document.body).fontFamily;i&&r.style.setProperty("--spice-font",i)}function s(i){var t=i.getElementById("pip-lyrics-list"),i=i.getElementById("pip-no-lyrics");if(t)if(o.lyricsData.length){null!=i&&i.classList.remove("visible");var n,r=a().ms;let e=-1;for(let i=o.lyricsData.length-1;0<=i;i--)if(r>=o.lyricsData[i].startTimeMs){e=i;break}e!==o.currentLineIndex&&(o.currentLineIndex=e,(n=t.querySelectorAll(".pip-lyric-line")).forEach((i,e)=>{i.classList.remove("active","past"),i.style.fontSize=o.fontSize+"px",e<o.currentLineIndex?i.classList.add("past"):e===o.currentLineIndex&&(i.classList.add("active"),i.style.fontSize=o.fontSize+1+"px")}),0<=o.currentLineIndex)&&n[o.currentLineIndex]&&n[o.currentLineIndex].scrollIntoView({behavior:"smooth",block:"center"})}else t.innerHTML="",null!=i&&i.classList.add("visible")}async function t(i){var e,t=i.getElementById("pip-lyrics-list");t&&(t.innerHTML='<div class="pip-loading">Loading...</div>'),null!=(t=i.getElementById("pip-no-lyrics"))&&t.classList.remove("visible"),o.lyricsData=await(async()=>{var i,e=null==(e=null==(e=Spicetify.Player.data)?void 0:e.item)?void 0:e.uri;if(!e)return[];if(!(e=e.split(":").pop()))return[];try{var t=await Spicetify.CosmosAsync.get(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${e}?format=json&vocalRemoval=false`),n=null==(i=null==t?void 0:t.lyrics)?void 0:i.lines;return Array.isArray(n)?n.map(i=>({startTimeMs:parseInt(i.startTimeMs,10),words:i.words})):[]}catch(i){return[]}})(),e=(t=i).getElementById("pip-lyrics-list"),t=t.getElementById("pip-no-lyrics"),e&&(o.currentLineIndex=-1,o.lyricsData.length?(null!=t&&t.classList.remove("visible"),e.innerHTML=o.lyricsData.map((i,e)=>`<div class="pip-lyric-line" data-index="${e}" data-time="${i.startTimeMs}" style="font-size:${o.fontSize}px">${i.words||"♪"}</div>`).join("")):(e.innerHTML="",null!=t&&t.classList.add("visible"))),s(i)}function c(i){var e=i.getElementById("pip-play"),t=i.getElementById("pip-shuffle"),i=i.getElementById("pip-heart");e&&(e.innerHTML=Spicetify.Player.isPlaying()?n("pause",18):n("play",18)),t&&(e=!1!==(null==(e=null==(e=Spicetify.Player.data)?void 0:e.restrictions)?void 0:e.canToggleShuffle),t.style.opacity=e?Spicetify.Player.getShuffle()?"1":"0.4":"0.15",t.style.pointerEvents=e?"auto":"none",t.style.cursor=e?"pointer":"default"),i&&(t=Spicetify.Player.getHeart(),i.innerHTML=n(t?"heart-active":"heart",14),i.style.color=t?"#1db954":"")}function d(n){y(),r=0,o.lyricsInterval=setInterval(()=>{var i,e,t;s(n),c(n),(i=(i=n).getElementById("pip-progress-fill"))&&({ms:e,total:t}=a(),i.style.width=0<t?Math.min(e/t*100,100)+"%":"0%"),++r%20==0&&p(n)},250)}function y(){o.lyricsInterval&&(clearInterval(o.lyricsInterval),o.lyricsInterval=null)}function u(i){var e=(e=null==(e=Spicetify.Player.data)?void 0:e.item)?{title:(null==(t=e.metadata)?void 0:t.title)||e.name||"",artist:(null==(t=e.metadata)?void 0:t.artist_name)||(null==(t=null==(t=e.artists)?void 0:t[0])?void 0:t.name)||"",art:(null==(t=e.metadata)?void 0:t.image_url)||(null==(t=null==(e=null==(t=e.album)?void 0:t.images)?void 0:e[0])?void 0:t.url)||""}:{title:"",artist:"",art:""},t=i.getElementById("pip-title"),n=i.getElementById("pip-artist"),i=i.getElementById("pip-album-art");t&&(t.textContent=e.title||"No track"),n&&(n.textContent=e.artist||""),i&&e.art&&(i.src=(n=e.art)?n.startsWith("spotify:image:")?n.replace("spotify:image:","https://i.scdn.co/image/"):n:"")}function f(i){i.querySelectorAll(".pip-lyric-line").forEach(i=>{i.style.fontSize=(i.classList.contains("active")?o.fontSize+1:o.fontSize)+"px"})}function v(i){null!=(l=i.getElementById("pip-close"))&&l.addEventListener("click",()=>{var i;y(),null!=(i=o.pipWindow)&&i.close(),o.pipWindow=null}),null!=(l=i.getElementById("pip-font-down"))&&l.addEventListener("click",()=>{o.fontSize=Math.max(10,o.fontSize-1),f(i)}),null!=(l=i.getElementById("pip-font-up"))&&l.addEventListener("click",()=>{o.fontSize=Math.min(22,o.fontSize+1),f(i)}),null!=(l=i.getElementById("pip-play"))&&l.addEventListener("click",()=>Spicetify.Player.togglePlay()),null!=(l=i.getElementById("pip-prev"))&&l.addEventListener("click",()=>Spicetify.Player.back()),null!=(l=i.getElementById("pip-next"))&&l.addEventListener("click",()=>Spicetify.Player.next()),null!=(l=i.getElementById("pip-shuffle"))&&l.addEventListener("click",()=>Spicetify.Player.toggleShuffle()),null!=(l=i.getElementById("pip-heart"))&&l.addEventListener("click",()=>{Spicetify.Player.toggleHeart(),setTimeout(()=>c(i),300)}),null!=(l=i.getElementById("pip-lyrics-list"))&&l.addEventListener("click",i=>{var i=i.target.closest(".pip-lyric-line");i&&(i=parseInt(i.dataset.index||"",10),!isNaN(i))&&o.lyricsData[i]&&(i=o.lyricsData[i].startTimeMs,Spicetify.Player.seek(i))});{var l=i;let e=l.getElementById("pip-header");if(e){let t=!1,n=0,r=0;e.addEventListener("mousedown",i=>{i.target.closest("button")||(t=!0,n=i.screenX,r=i.screenY,e.style.cursor="grabbing")}),l.addEventListener("mousemove",i=>{var e;t&&(null!=(e=o.pipWindow)&&e.moveBy(i.screenX-n,i.screenY-r),n=i.screenX,r=i.screenY)}),l.addEventListener("mouseup",()=>{t&&(t=!1,e.style.cursor="grab")})}}}async function g(){if(o.pipWindow&&!o.pipWindow.closed)o.pipWindow.close(),o.pipWindow=null,y();else{if("documentPictureInPicture"in window&&(o.pipWindow=await window.documentPictureInPicture.requestWindow({width:e.pipWidth,height:e.pipHeight})),o.pipWindow&&!o.pipWindow.closed||(o.pipWindow=window.open("about:blank","lyricfloat",`width=${e.pipWidth},height=${e.pipHeight},left=${screen.width-e.pipWidth-30},top=30,resizable=yes,scrollbars=no`)),!o.pipWindow)throw new Error("Failed to open PiP window");var i=o.pipWindow.document;i.title="lyricfloat",i.body.innerHTML=`<style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:var(--spice-main,rgba(10,10,18,.96));color:var(--spice-text,#e0e0e0);font-family:var(--spice-font,'Circular','Spotify Circular',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif);overflow:hidden;height:100vh;display:flex;flex-direction:column}
    #pip-header-wrap{flex-shrink:0}
    #pip-header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--spice-player,rgba(255,255,255,.03));border-bottom:none;gap:8px;cursor:grab;user-select:none}
    #pip-song-info{display:flex;align-items:center;gap:8px;overflow:hidden;flex:1}
    #pip-album-art{width:36px;height:36px;border-radius:6px;object-fit:cover;flex-shrink:0;background:var(--spice-card,rgba(255,255,255,.1))}
    #pip-meta{display:flex;flex-direction:column;overflow:hidden}
    #pip-title{font-size:12px;font-weight:600;color:var(--spice-text,#fff);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #pip-artist{font-size:10px;color:var(--spice-subtext,rgba(255,255,255,.45));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
    #pip-controls{display:flex;gap:4px;flex-shrink:0}
    #pip-controls button{background:rgba(255,255,255,.07);border:none;color:var(--spice-subtext,rgba(255,255,255,.6));width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s}
    #pip-controls button:hover{background:rgba(255,255,255,.14);color:var(--spice-text,#fff)}
    #pip-close:hover{background:rgba(255,80,80,.3)!important;color:#ff6b6b!important}
    #pip-font-down,#pip-font-up{opacity:0;visibility:hidden;pointer-events:none;transition:opacity .2s,visibility .2s}
    #pip-controls:hover #pip-font-down,#pip-controls:hover #pip-font-up{opacity:1;visibility:visible;pointer-events:auto}
    #pip-progress{height:3px;background:var(--spice-card,rgba(255,255,255,.06));flex-shrink:0}
    #pip-progress-fill{height:100%;width:0%;background:var(--spice-button,#1db954);transition:width .25s linear}
    #pip-player{display:flex;align-items:center;justify-content:center;gap:6px;padding:0;max-height:0;overflow:hidden;opacity:0;background:var(--spice-player,rgba(255,255,255,.02));border-bottom:1px solid transparent;transition:max-height .25s,opacity .2s,padding .25s,border-color .25s}
    #pip-header-wrap:hover #pip-player{max-height:48px;padding:6px 12px;opacity:1;border-bottom-color:rgba(255,255,255,.04)}
    #pip-player button{background:none;border:none;color:var(--spice-subtext,rgba(255,255,255,.55));width:30px;height:30px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s,transform .1s}
    #pip-player button:hover{color:var(--spice-text,#fff);background:rgba(255,255,255,.08)}
    #pip-player button:active{transform:scale(.92)}
    #pip-play{width:36px!important;height:36px!important;background:rgba(255,255,255,.1)!important}
    #pip-play:hover{background:rgba(29,185,84,.25)!important;color:#1db954!important}
    #pip-lyrics-container{flex:1;overflow-y:auto;padding:12px 6px;position:relative;scrollbar-width:none;-ms-overflow-style:none}
    #pip-lyrics-container::-webkit-scrollbar{display:none}
    #pip-lyrics-list{display:flex;flex-direction:column;gap:2px;}
    #pip-no-lyrics{display:none;position:absolute;inset:0;align-items:center;justify-content:center;color:var(--spice-misc,rgba(255,255,255,.25));font-size:13px}
    #pip-no-lyrics.visible{display:flex}
    .pip-lyric-line{padding:5px 10px;border-radius:8px;line-height:1.55;color:var(--spice-misc,rgba(255,255,255,.28));cursor:pointer;transition:color .25s,background .25s;text-align:center;word-break:break-word}
    .pip-lyric-line:hover{color:var(--spice-subtext,rgba(255,255,255,.5));background:rgba(255,255,255,.04)}
    .pip-lyric-line.active{color:var(--spice-text,#fff);font-weight:600;background:rgba(255,255,255,.06)}
    .pip-lyric-line.past{color:rgba(255,255,255,.18)}
    .pip-loading{display:flex;align-items:center;justify-content:center;height:100%;font-size:13px;color:var(--spice-misc,rgba(255,255,255,.3));animation:pulse 1.5s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
  </style>`+`
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
        <button id="pip-shuffle" title="Shuffle">${n("shuffle",14)}</button>
        <button id="pip-prev" title="Previous">${n("skip-back",16)}</button>
        <button id="pip-play" title="Play/Pause">${n("play",18)}</button>
        <button id="pip-next" title="Next">${n("skip-forward",16)}</button>
        <button id="pip-heart" title="Like">${n("heart",14)}</button>
      </div>
    </div>
    <div id="pip-lyrics-container">
      <div id="pip-lyrics-list"></div>
      <div id="pip-no-lyrics">♪ Lirik tidak tersedia</div>
    </div>
  `,p(i),v(i),u(i),c(i),await t(i),d(i),Spicetify.Player.addEventListener("songchange",async()=>{var i;!o.pipWindow||o.pipWindow.closed?y():(u(i=o.pipWindow.document),c(i),await t(i))}),o.pipWindow.addEventListener("beforeunload",()=>{y(),o.pipWindow=null})}}e={pipWidth:380,pipHeight:520},o={pipWindow:null,lyricsData:[],lyricsInterval:null,currentLineIndex:-1,fontSize:14},l=["main","player","text","subtext","button","card","misc"],r=0,i=async function(){for(var i;null==Spicetify||!Spicetify.Player||null==(i=null==Spicetify?void 0:Spicetify.Topbar)||!i.Button;)await new Promise(i=>setTimeout(i,300));var e=new Spicetify.Topbar.Button("lyricfloat","lyrics",()=>{g()},!1);e.element&&(e.element.style.alignSelf="center")},(async()=>{await i()})()})();