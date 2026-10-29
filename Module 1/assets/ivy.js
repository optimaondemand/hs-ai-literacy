/* Ask Ivy — floating tutor launcher for AI Literacy lesson pages.
   Usage: <script src="assets/ivy.js" data-url="https://live.arthur.digital/ask/..."
            data-lesson="Lesson 1.2" data-questions="Q1|Q2|Q3"></script>
   Arthur Live refuses to load inside an iframe (X-Frame-Options: SAMEORIGIN),
   so the launcher opens Ivy in a new tab and lets the student copy a starter question. */
(function(){
  var me=document.currentScript;if(!me)return;
  var url=me.getAttribute("data-url");if(!url)return;
  var lesson=me.getAttribute("data-lesson")||"this lesson";
  var qs=(me.getAttribute("data-questions")||"").split("|").map(function(s){return s.trim()}).filter(Boolean);
  var KEY="ail-ivy-open";

  var css=
  ".ivy-fab{position:fixed;right:18px;bottom:18px;z-index:9000;display:flex;align-items:center;gap:.55rem;padding:.6rem 1rem .6rem .7rem;border:1px solid var(--teal-deep,#0b3b4f);border-radius:999px;background:var(--navy,#0f2233);color:#e6f3f7;font:600 .9rem/1 var(--sans,'IBM Plex Sans',sans-serif);cursor:pointer;box-shadow:0 6px 20px rgba(15,34,51,.28);transition:transform .15s,box-shadow .15s}"+
  ".ivy-fab:hover{transform:translateY(-1px);box-shadow:0 10px 26px rgba(15,34,51,.34)}"+
  ".ivy-fab:focus-visible{outline:3px solid var(--cyan,#4fd1e8);outline-offset:2px}"+
  ".ivy-fab .dot{width:28px;height:28px;border-radius:50%;background:var(--cyan,#4fd1e8);color:var(--navy,#0f2233);display:grid;place-items:center;font-family:var(--mono,monospace);font-size:.8rem;font-weight:600}"+
  ".ivy-panel{position:fixed;right:18px;bottom:76px;z-index:9000;width:min(360px,calc(100vw - 36px));background:var(--paper,#fff);color:var(--ink,#1b2430);border:1px solid var(--rule-strong,#c2ccd7);border-top:4px solid var(--teal,#0e8fa8);border-radius:var(--radius,12px);box-shadow:0 14px 40px rgba(15,34,51,.25);font-family:var(--sans,'IBM Plex Sans',sans-serif);display:none;animation:ivyUp .18s ease-out}"+
  ".ivy-panel.show{display:block}"+
  "@keyframes ivyUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}"+
  ".ivy-panel .hd{display:flex;align-items:flex-start;justify-content:space-between;gap:.6rem;padding:.9rem 1rem .4rem}"+
  ".ivy-panel .k{display:block;font-family:var(--mono,monospace);font-size:.64rem;letter-spacing:.12em;text-transform:uppercase;color:var(--teal,#0e8fa8);margin-bottom:.2rem}"+
  ".ivy-panel h3{margin:0;font-size:1.05rem;line-height:1.25;color:var(--teal-deep,#0b3b4f)}"+
  ".ivy-panel .x{border:0;background:transparent;color:var(--ink-faint,#7c8794);font-size:1.3rem;line-height:1;cursor:pointer;padding:.1rem .3rem;border-radius:6px}"+
  ".ivy-panel .x:hover{background:var(--teal-pale,#e3f4f8);color:var(--ink,#1b2430)}"+
  ".ivy-panel p{margin:0;padding:0 1rem;font-size:.9rem;line-height:1.5;color:var(--ink-soft,#4b5664)}"+
  ".ivy-panel .qs{list-style:none;margin:.7rem 0 0;padding:0 1rem;display:grid;gap:.4rem}"+
  ".ivy-panel .qs button{width:100%;text-align:left;border:1px solid var(--rule,#dfe5ec);background:var(--teal-pale,#e3f4f8);color:var(--teal-deep,#0b3b4f);border-radius:8px;padding:.5rem .65rem;font:500 .86rem/1.4 var(--sans,'IBM Plex Sans',sans-serif);cursor:pointer}"+
  ".ivy-panel .qs button:hover{border-color:var(--teal,#0e8fa8)}"+
  ".ivy-panel .qs .ivy-manual{display:block;width:100%;margin-top:.35rem;padding:.45rem .55rem;border:1px solid var(--teal,#0e8fa8);border-radius:8px;font:500 .86rem/1.4 var(--sans,'IBM Plex Sans',sans-serif);color:var(--ink,#1b2430);background:#fff;resize:none;box-sizing:border-box}"+
  ".ivy-panel .qs button.copied{background:var(--ok-bg,#e3f5ea);color:var(--ok,#1f7a4d);border-color:var(--ok,#1f7a4d)}"+
  ".ivy-panel .go{display:flex;align-items:center;justify-content:space-between;gap:.6rem;padding:.8rem 1rem 1rem}"+
  ".ivy-panel .go a{display:inline-block;white-space:nowrap;background:var(--teal,#0e8fa8);color:#fff;text-decoration:none;font-weight:600;font-size:.9rem;padding:.55rem .95rem;border-radius:8px}"+
  ".ivy-panel .go a:hover{background:var(--teal-deep,#0b3b4f)}"+
  ".ivy-panel .go small{font-family:var(--mono,monospace);font-size:.64rem;color:var(--ink-faint,#7c8794);letter-spacing:.04em}"+
  ".ivy-panel .ivy-note{padding:0 1rem .9rem;font-size:.78rem;color:var(--ink-faint,#7c8794);line-height:1.45}"+
  ".ivy-panel{overflow:hidden}.ivy-px{position:absolute;inset:0;z-index:2;pointer-events:none;display:grid;grid-template-columns:repeat(14,1fr);grid-auto-rows:1fr;border-radius:inherit}.ivy-px i{display:block;opacity:1;animation:ivyPx .5s steps(4,end) forwards}@keyframes ivyPx{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.15)}}.ivy-fab.pulse{animation:ivyPulse .45s ease-out}@keyframes ivyPulse{0%{box-shadow:0 0 0 0 rgba(79,209,232,.7)}100%{box-shadow:0 0 0 16px rgba(79,209,232,0)}}@media (prefers-reduced-motion:reduce){.ivy-px,.ivy-fab.pulse{animation:none;display:none}}"+
  /* waving bot perched on the pill */
  ".ivy-bot{position:absolute;left:8px;top:-34px;width:48px;height:48px;pointer-events:none;transition:opacity .2s,transform .2s}"+
  ".ivy-bot svg{display:block;width:100%;height:100%;overflow:visible}"+
  ".ivy-bot .arm{transform-origin:27px 18px;transform-box:view-box}"+
  ".ivy-bot .head{transform-origin:17px 20px;transform-box:view-box}"+
  ".ivy-bot.wave .arm{animation:ivyWave 1.1s ease-in-out}"+
  ".ivy-bot.wave .head{animation:ivyTilt 1.1s ease-in-out}"+
  "@keyframes ivyWave{0%,100%{transform:rotate(0)}15%{transform:rotate(-120deg)}35%{transform:rotate(-150deg)}55%{transform:rotate(-105deg)}75%{transform:rotate(-150deg)}}"+
  "@keyframes ivyTilt{0%,100%{transform:rotate(0)}30%,70%{transform:rotate(-8deg)}}"+
  ".ivy-fab[aria-expanded=true] .ivy-bot{opacity:0;transform:translateY(8px)}"+
  ".ivy-say{position:absolute;right:0;bottom:calc(100% + 50px);background:#fff;color:var(--teal-deep,#0b3b4f);border:1px solid var(--teal,#0e8fa8);border-radius:10px;padding:.45rem .7rem;font:500 .8rem/1.3 var(--sans,'IBM Plex Sans',sans-serif);white-space:nowrap;box-shadow:0 6px 18px rgba(15,34,51,.18);opacity:0;transform:translateY(4px);transition:opacity .25s,transform .25s;pointer-events:none}"+
  ".ivy-say:after{content:'';position:absolute;left:26px;bottom:-6px;width:10px;height:10px;background:#fff;border-right:1px solid var(--teal,#0e8fa8);border-bottom:1px solid var(--teal,#0e8fa8);transform:rotate(45deg)}"+
  ".ivy-say.show{opacity:1;transform:none}"+
  "@media (prefers-reduced-motion:reduce){.ivy-bot.wave .arm,.ivy-bot.wave .head{animation:none}}"+
  "@media print{.ivy-fab,.ivy-panel{display:none!important}}";
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}

  var fab=el("button","ivy-fab");fab.type="button";fab.setAttribute("aria-expanded","false");fab.setAttribute("aria-controls","ivyPanel");
  var dot=el("span","dot");dot.setAttribute("aria-hidden","true");dot.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z"/><path d="M12 6.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor" stroke="none"/></svg>';fab.appendChild(dot);fab.appendChild(el("span",null,"Ask your Tutor"));
  var bot=el("span","ivy-bot");bot.setAttribute("aria-hidden","true");
  bot.innerHTML='<svg viewBox="0 0 36 36" fill="none" stroke-linecap="round" stroke-linejoin="round">'+
    '<g class="arm" stroke="#4fd1e8" stroke-width="2.4"><path d="M27 18l5 5"/><circle cx="32.6" cy="23.6" r="1.6" fill="#4fd1e8" stroke="none"/></g>'+
    '<g class="head"><path d="M18 9V4" stroke="#4fd1e8" stroke-width="2"/><circle cx="18" cy="3" r="2" fill="#4fd1e8"/>'+
    '<rect x="7" y="9" width="22" height="19" rx="6" fill="#0f2233" stroke="#4fd1e8" stroke-width="2"/>'+
    '<rect x="12" y="16" width="4" height="5" rx="1" fill="#4fd1e8"/><rect x="20" y="16" width="4" height="5" rx="1" fill="#4fd1e8"/>'+
    '<path d="M14 24.5h8" stroke="#4fd1e8" stroke-width="1.6"/></g></svg>';
  fab.appendChild(bot);
  var say=el("span","ivy-say","Need help? Ask your tutor.");say.setAttribute("aria-hidden","true");fab.appendChild(say);

  var panel=el("aside","ivy-panel");panel.id="ivyPanel";panel.setAttribute("aria-label","Ask Ivy, the course tutor");
  var hd=el("div","hd");var hl=el("div");var k=el("span","k","Course tutor");hl.appendChild(k);hl.appendChild(el("h3",null,"Stuck on "+lesson+"? Ask Ivy."));hd.appendChild(hl);
  var x=el("button","x","×");x.type="button";x.setAttribute("aria-label","Close");hd.appendChild(x);panel.appendChild(hd);
  panel.appendChild(el("p",null,"Ivy will ask what you already know, then help you work it out. She gives hints, not answers. No account needed."));

  /* Copy that also works inside cross-origin iframes (Canvas), where navigator.clipboard is denied.
     execCommand("copy") runs synchronously inside the click, so it keeps the user gesture; the async
     Clipboard API is the backup. cb(false) only when both fail. */
  function execCopy(t){var ta=document.createElement("textarea");ta.value=t;ta.setAttribute("readonly","");ta.style.cssText="position:fixed;top:0;left:0;width:2px;height:2px;opacity:0;pointer-events:none";document.body.appendChild(ta);ta.focus();ta.select();var ok=false;try{ok=document.execCommand("copy")}catch(e){}ta.remove();return ok}
  function copyText(t,cb){
    if(execCopy(t)){cb(true);return}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){cb(true)},function(){cb(false)})}else{cb(false)}
  }

  if(qs.length){
    var lab=el("p",null,"Tap a question to copy it, then paste it to Ivy:");lab.style.marginTop=".7rem";lab.style.fontSize=".8rem";panel.appendChild(lab);
    var ul=el("ul","qs");
    qs.forEach(function(q){
      var li=el("li");var b=el("button",null,q);b.type="button";
      var manual=null;
      b.addEventListener("click",function(){
        if(manual){manual.remove();manual=null}
        copyText(q,function(ok){
          if(ok){b.classList.add("copied");b.textContent="Copied — now paste it to Ivy";setTimeout(function(){b.classList.remove("copied");b.textContent=q},2200);return}
          /* Clipboard blocked (e.g. inside a Canvas iframe): show the text selected so the student can copy it by hand. */
          b.textContent="Couldn't copy automatically — select the text below and press Ctrl+C (⌘C on Mac)";
          manual=el("textarea","ivy-manual");manual.value=q;manual.readOnly=true;manual.rows=2;manual.setAttribute("aria-label","Question to copy");
          li.appendChild(manual);manual.focus();manual.select();
          setTimeout(function(){b.textContent=q},4000);
        });
      });
      li.appendChild(b);ul.appendChild(li);
    });
    panel.appendChild(ul);
  }

  var go=el("div","go");var a=el("a",null,"Open Ivy in a new tab ↗");a.href=url;a.target="_blank";a.rel="noopener noreferrer";go.appendChild(a);go.appendChild(el("small",null,"opens live.arthur.digital"));panel.appendChild(go);
  panel.appendChild(el("div","ivy-note","Ivy is a tutor, not a source. Your submitted work must be in your own words; if Ivy helped you, say so in your AI-use disclosure."));

  function pixels(){if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;var old=panel.querySelector(".ivy-px");if(old)old.remove();var g=el("div","ivy-px");var cols=14,rows=Math.max(8,Math.round(panel.offsetHeight/(panel.offsetWidth/cols)));g.style.gridTemplateRows="repeat("+rows+",1fr)";var pal=["#0f2233","#0b3b4f","#0e8fa8","#4fd1e8","#e3f4f8"];for(var i=0;i<cols*rows;i++){var c=el("i");c.style.background=pal[Math.floor(Math.random()*pal.length)];c.style.animationDelay=(Math.random()*.45).toFixed(2)+"s";g.appendChild(c)}panel.appendChild(g);setTimeout(function(){g.remove()},1100)}
  /* Attention wave: first after 6s, then every 30s, at most WAVES times per page.
     Stops for good once the student opens the panel (remembered for the session). */
  var SEEN="ail-ivy-seen",WAVES=5,waves=0,waveTimer=null;
  var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function stopWaving(){if(waveTimer){clearInterval(waveTimer);waveTimer=null}say.classList.remove("show")}
  function wave(){
    if(document.hidden||panel.classList.contains("show"))return;
    waves++;
    if(!reduced){bot.classList.remove("wave");void bot.offsetWidth;bot.classList.add("wave")}
    if(waves===1){say.classList.add("show");setTimeout(function(){say.classList.remove("show")},4500)}
    if(waves>=WAVES)stopWaving();
  }
  function startWaving(){
    var seen=false;try{seen=sessionStorage.getItem(SEEN)==="1"}catch(e){}
    if(seen)return;
    setTimeout(function(){wave();if(waves<WAVES)waveTimer=setInterval(wave,30000)},6000);
  }
  bot.addEventListener("animationend",function(){bot.classList.remove("wave")});

  function setOpen(o){var was=panel.classList.contains("show");panel.classList.toggle("show",o);if(o&&!was){pixels();fab.classList.remove("pulse");void fab.offsetWidth;fab.classList.add("pulse")}if(o){stopWaving();try{sessionStorage.setItem(SEEN,"1")}catch(e){}}fab.setAttribute("aria-expanded",o?"true":"false");try{sessionStorage.setItem(KEY,o?"1":"0")}catch(e){}}
  fab.addEventListener("click",function(){setOpen(!panel.classList.contains("show"))});
  x.addEventListener("click",function(){setOpen(false);fab.focus()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&panel.classList.contains("show")){setOpen(false);fab.focus()}});

  document.body.appendChild(panel);document.body.appendChild(fab);
  try{if(sessionStorage.getItem(KEY)==="1")setOpen(true)}catch(e){}
  startWaving();
})();
