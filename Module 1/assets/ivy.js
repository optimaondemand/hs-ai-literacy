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
  ".ivy-panel .qs button.copied{background:var(--ok-bg,#e3f5ea);color:var(--ok,#1f7a4d);border-color:var(--ok,#1f7a4d)}"+
  ".ivy-panel .go{display:flex;align-items:center;justify-content:space-between;gap:.6rem;padding:.8rem 1rem 1rem}"+
  ".ivy-panel .go a{display:inline-block;white-space:nowrap;background:var(--teal,#0e8fa8);color:#fff;text-decoration:none;font-weight:600;font-size:.9rem;padding:.55rem .95rem;border-radius:8px}"+
  ".ivy-panel .go a:hover{background:var(--teal-deep,#0b3b4f)}"+
  ".ivy-panel .go small{font-family:var(--mono,monospace);font-size:.64rem;color:var(--ink-faint,#7c8794);letter-spacing:.04em}"+
  ".ivy-panel .ivy-note{padding:0 1rem .9rem;font-size:.78rem;color:var(--ink-faint,#7c8794);line-height:1.45}"+
  ".ivy-panel{overflow:hidden}.ivy-px{position:absolute;inset:0;z-index:2;pointer-events:none;display:grid;grid-template-columns:repeat(14,1fr);grid-auto-rows:1fr;border-radius:inherit}.ivy-px i{display:block;opacity:1;animation:ivyPx .5s steps(4,end) forwards}@keyframes ivyPx{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.15)}}.ivy-fab.pulse{animation:ivyPulse .45s ease-out}@keyframes ivyPulse{0%{box-shadow:0 0 0 0 rgba(79,209,232,.7)}100%{box-shadow:0 0 0 16px rgba(79,209,232,0)}}@media (prefers-reduced-motion:reduce){.ivy-px,.ivy-fab.pulse{animation:none;display:none}}"+
  "@media print{.ivy-fab,.ivy-panel{display:none!important}}";
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}

  var fab=el("button","ivy-fab");fab.type="button";fab.setAttribute("aria-expanded","false");fab.setAttribute("aria-controls","ivyPanel");
  var dot=el("span","dot");dot.setAttribute("aria-hidden","true");dot.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z"/><path d="M12 6.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor" stroke="none"/></svg>';fab.appendChild(dot);fab.appendChild(el("span",null,"Ask your Tutor"));

  var panel=el("aside","ivy-panel");panel.id="ivyPanel";panel.setAttribute("aria-label","Ask Ivy, the course tutor");
  var hd=el("div","hd");var hl=el("div");var k=el("span","k","Course tutor");hl.appendChild(k);hl.appendChild(el("h3",null,"Stuck on "+lesson+"? Ask Ivy."));hd.appendChild(hl);
  var x=el("button","x","×");x.type="button";x.setAttribute("aria-label","Close");hd.appendChild(x);panel.appendChild(hd);
  panel.appendChild(el("p",null,"Ivy will ask what you already know, then help you work it out. She gives hints, not answers. No account needed."));

  if(qs.length){
    var lab=el("p",null,"Tap a question to copy it, then paste it to Ivy:");lab.style.marginTop=".7rem";lab.style.fontSize=".8rem";panel.appendChild(lab);
    var ul=el("ul","qs");
    qs.forEach(function(q){
      var li=el("li");var b=el("button",null,q);b.type="button";
      b.addEventListener("click",function(){
        var done=function(){b.classList.add("copied");b.textContent="Copied — now paste it to Ivy";setTimeout(function(){b.classList.remove("copied");b.textContent=q},2200)};
        if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(q).then(done,done)}else{done()}
      });
      li.appendChild(b);ul.appendChild(li);
    });
    panel.appendChild(ul);
  }

  var go=el("div","go");var a=el("a",null,"Open Ivy in a new tab ↗");a.href=url;a.target="_blank";a.rel="noopener noreferrer";go.appendChild(a);go.appendChild(el("small",null,"opens live.arthur.digital"));panel.appendChild(go);
  panel.appendChild(el("div","ivy-note","Ivy is a tutor, not a source. Your submitted work must be in your own words; if Ivy helped you, say so in your AI-use disclosure."));

  function pixels(){if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;var old=panel.querySelector(".ivy-px");if(old)old.remove();var g=el("div","ivy-px");var cols=14,rows=Math.max(8,Math.round(panel.offsetHeight/(panel.offsetWidth/cols)));g.style.gridTemplateRows="repeat("+rows+",1fr)";var pal=["#0f2233","#0b3b4f","#0e8fa8","#4fd1e8","#e3f4f8"];for(var i=0;i<cols*rows;i++){var c=el("i");c.style.background=pal[Math.floor(Math.random()*pal.length)];c.style.animationDelay=(Math.random()*.45).toFixed(2)+"s";g.appendChild(c)}panel.appendChild(g);setTimeout(function(){g.remove()},1100)}
  function setOpen(o){var was=panel.classList.contains("show");panel.classList.toggle("show",o);if(o&&!was){pixels();fab.classList.remove("pulse");void fab.offsetWidth;fab.classList.add("pulse")}fab.setAttribute("aria-expanded",o?"true":"false");try{sessionStorage.setItem(KEY,o?"1":"0")}catch(e){}}
  fab.addEventListener("click",function(){setOpen(!panel.classList.contains("show"))});
  x.addEventListener("click",function(){setOpen(false);fab.focus()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&panel.classList.contains("show")){setOpen(false);fab.focus()}});

  document.body.appendChild(panel);document.body.appendChild(fab);
  try{if(sessionStorage.getItem(KEY)==="1")setOpen(true)}catch(e){}
})();
