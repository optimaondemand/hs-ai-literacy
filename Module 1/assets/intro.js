/* ------------------------------------------------------------
   The Sealed Box — cinematic intro for Module 1 pages
   AI Literacy • Module 1

   Usage (first thing inside <body>; optional data-words="A|B|C" replaces
   the word cycle inside the box):
     <script src="assets/intro.js"
       data-eyebrow="AI Literacy • Module 1 • Lesson 1.1 Reading"
       data-title="What Counts as Intelligent Behavior?"
       data-key="ail-intro-1.1-reading"></script>

   Plays once per device (localStorage key = data-key), silent,
   skippable from frame one, with a "Watch full screen" button for
   the Canvas iframe case, a reduced-motion fallback (one-second
   title fade), and a "Replay intro" link added to the masthead.
   window.AILIntro.replay() plays it again on demand.
   ------------------------------------------------------------ */
(function(){
  var me=document.currentScript;if(!me)return;
  var EYEBROW=me.getAttribute("data-eyebrow")||"";
  var TITLE=me.getAttribute("data-title")||document.title;
  var KEY=me.getAttribute("data-key")||("ail-intro-"+location.pathname);
  var WORDS=["?","SMART","CLEVER","AUTOMATED","LEARNED","INTELLIGENT","?"];
  if(me.getAttribute("data-words")){WORDS=["?"].concat(me.getAttribute("data-words").split("|").map(function(s){return s.trim()}).filter(Boolean)).concat(["?"])}
  var NAVY="#0f2233",CYAN="#4fd1e8",TEAL="#0e8fa8",GOLD="#d19a1e",INK="#e8f3f7";
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css=''+
  '.ail-intro{position:fixed;inset:0;z-index:10000;background:'+NAVY+';color:'+INK+';font-family:"IBM Plex Sans","Segoe UI",Helvetica,Arial,sans-serif;overflow:hidden;display:flex;align-items:center;justify-content:center}'+
  '.ail-intro.ail-fs{width:100vw;height:100vh}'+
  '.ail-intro .ail-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(79,209,232,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(79,209,232,.07) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}'+
  '.ail-intro canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'+
  '.ail-intro .ail-stage{position:relative;width:min(92vw,760px);display:flex;flex-direction:column;align-items:center;gap:1.2rem;transition:opacity .45s}'+
  '.ail-intro .ail-stage.out{opacity:0}'+
  '.ail-intro svg{display:block;width:min(88vw,620px);height:auto;overflow:visible}'+
  '.ail-intro .ln{fill:none;stroke:'+CYAN+';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}'+
  '.ail-intro .box{stroke-dasharray:1200;stroke-dashoffset:1200;transition:stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)}'+
  '.ail-intro.p1 .box{stroke-dashoffset:0}'+
  '.ail-intro .arrow{opacity:0;transition:opacity .5s}'+
  '.ail-intro.p2 .arrow{opacity:1}'+
  '.ail-intro .lbl{font-family:"IBM Plex Mono",Consolas,monospace;font-size:13px;letter-spacing:.14em;fill:'+CYAN+';opacity:0;transition:opacity .5s}'+
  '.ail-intro.p2 .lbl{opacity:1}'+
  '.ail-intro .tok{font-family:"IBM Plex Mono",Consolas,monospace;font-size:13px;fill:'+INK+';opacity:0}'+
  '.ail-intro.p2 .tok.in{animation:ail-in 1.1s linear infinite}'+
  '.ail-intro.p2 .tok.out{animation:ail-out 1.1s linear infinite}'+
  '.ail-intro .tok:nth-child(2){animation-delay:.37s!important}.ail-intro .tok:nth-child(3){animation-delay:.74s!important}'+
  '@keyframes ail-in{0%{transform:translateX(-150px);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(0);opacity:0}}'+
  '@keyframes ail-out{0%{transform:translateX(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(150px);opacity:0}}'+
  '.ail-intro .word{font-family:"IBM Plex Mono",Consolas,monospace;font-weight:600;letter-spacing:.1em;fill:'+GOLD+';text-anchor:middle;dominant-baseline:middle;opacity:0;transition:opacity .3s}'+
  '.ail-intro.p3 .word{opacity:1}'+
  '.ail-intro .word.glitch{animation:ail-glitch .18s steps(2) 1}'+
  '@keyframes ail-glitch{0%{transform:translate(-3px,1px)}50%{transform:translate(3px,-1px)}100%{transform:none}}'+
  '.ail-intro .ail-text{text-align:center;opacity:0;transform:translateY(10px);transition:opacity .7s,transform .7s}'+
  '.ail-intro.p4 .ail-text{opacity:1;transform:none}'+
  '.ail-intro .ail-eyebrow{font-family:"IBM Plex Mono",Consolas,monospace;font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:'+CYAN+';margin:0 0 .5rem}'+
  '.ail-intro h1{margin:0;font-size:clamp(1.6rem,4.6vw,2.6rem);font-weight:700;line-height:1.15;letter-spacing:-.01em;color:#fff;text-wrap:balance}'+
  '.ail-intro .ail-sub{margin:.6rem 0 0;font-size:1rem;color:#b9cfd8;opacity:0;transition:opacity .6s .5s}'+
  '.ail-intro.p4 .ail-sub{opacity:1}'+
  '.ail-intro .ail-ctl{position:absolute;left:0;right:0;bottom:1.1rem;display:flex;justify-content:space-between;gap:.6rem;padding:0 1.2rem;z-index:2}'+
  '.ail-intro .ail-btn{font:inherit;font-family:"IBM Plex Mono",Consolas,monospace;font-size:.76rem;letter-spacing:.08em;text-transform:uppercase;color:'+CYAN+';background:rgba(15,34,51,.6);border:1px solid rgba(79,209,232,.6);border-radius:8px;padding:.5rem .85rem;cursor:pointer;backdrop-filter:blur(4px)}'+
  '.ail-intro .ail-btn:hover{background:rgba(79,209,232,.15)}'+
  '.ail-intro .ail-btn:focus-visible{outline:3px solid '+GOLD+';outline-offset:2px}'+
  '.ail-intro.ail-done{pointer-events:none}'+
  '.ail-replay{font-family:"IBM Plex Mono",Consolas,monospace;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:'+CYAN+';background:none;border:1px solid rgba(79,209,232,.5);border-radius:6px;padding:.25rem .6rem;cursor:pointer;margin-top:.9rem}'+
  '.ail-replay:hover{background:rgba(79,209,232,.12)}'+
  'body.ail-lock{overflow:hidden}';
  var style=document.createElement("style");style.textContent=css;document.head.appendChild(style);

  var seen=false;try{seen=!!localStorage.getItem(KEY)}catch(e){}
  var timers=[],raf=0,overlay=null;

  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
  function svgEl(tag,attrs){var e=document.createElementNS("http://www.w3.org/2000/svg",tag);for(var k in attrs)e.setAttribute(k,attrs[k]);return e}
  function later(fn,ms){timers.push(setTimeout(fn,ms))}
  function clearAll(){timers.forEach(clearTimeout);timers=[];if(raf)cancelAnimationFrame(raf);raf=0}

  function build(){
    overlay=el("div","ail-intro");overlay.setAttribute("role","dialog");overlay.setAttribute("aria-label","Intro");
    overlay.appendChild(el("div","ail-grid"));
    var canvas=document.createElement("canvas");overlay.appendChild(canvas);
    var stage=el("div","ail-stage");

    // The box: 620 x 300 viewBox. Box body centered.
    var svg=svgEl("svg",{viewBox:"0 0 620 300","aria-hidden":"true"});
    var box=svgEl("path",{"class":"ln box",d:"M210 70 H410 V230 H210 Z M210 70 L240 50 H440 L410 70 M410 230 L440 210 V50"});
    svg.appendChild(box);
    // IN arrow and tokens
    var gIn=svgEl("g",{"class":"arrow"});
    gIn.appendChild(svgEl("path",{"class":"ln",d:"M40 150 H190 M176 140 L190 150 L176 160"}));
    var lIn=svgEl("text",{"class":"lbl",x:"40",y:"132"});lIn.textContent="IN";gIn.appendChild(lIn);
    svg.appendChild(gIn);
    var tokIn=svgEl("g",{"class":"arrow"});
    ["011","▲●","12:00"].forEach(function(t){var x=svgEl("text",{"class":"tok in",x:"150",y:"175","text-anchor":"end"});x.textContent=t;tokIn.appendChild(x)});
    svg.appendChild(tokIn);
    // OUT arrow and tokens
    var gOut=svgEl("g",{"class":"arrow"});
    gOut.appendChild(svgEl("path",{"class":"ln",d:"M430 150 H580 M566 140 L580 150 L566 160"}));
    var lOut=svgEl("text",{"class":"lbl",x:"556",y:"132"});lOut.textContent="OUT";gOut.appendChild(lOut);
    svg.appendChild(gOut);
    var tokOut=svgEl("g",{"class":"arrow"});
    ["route","label","reply"].forEach(function(t){var x=svgEl("text",{"class":"tok out",x:"436",y:"175"});x.textContent=t;tokOut.appendChild(x)});
    svg.appendChild(tokOut);
    // The word inside the box
    var word=svgEl("text",{"class":"word",x:"310",y:"150","font-size":"34"});word.textContent="?";svg.appendChild(word);
    stage.appendChild(svg);

    var text=el("div","ail-text");
    if(EYEBROW)text.appendChild(el("p","ail-eyebrow",EYEBROW));
    text.appendChild(el("h1",null,TITLE));
    text.appendChild(el("p","ail-sub","Something goes in. Something comes out. What happens inside is the question."));
    stage.appendChild(text);
    overlay.appendChild(stage);

    var ctl=el("div","ail-ctl");
    var fs=el("button","ail-btn","Watch full screen");fs.type="button";
    fs.addEventListener("click",function(){
      var r=overlay.requestFullscreen||overlay.webkitRequestFullscreen;
      if(r){try{var p=r.call(overlay);if(p&&p.catch)p.catch(function(){})}catch(e){}}
    });
    var skip=el("button","ail-btn","Skip intro");skip.type="button";
    skip.addEventListener("click",function(){finish(true)});
    ctl.appendChild(fs);ctl.appendChild(skip);overlay.appendChild(ctl);
    if(!document.fullscreenEnabled&&!document.webkitFullscreenEnabled)fs.hidden=true;

    document.body.appendChild(overlay);document.body.classList.add("ail-lock");
    skip.focus({preventScroll:true});
    return {canvas:canvas,stage:stage,word:word,svg:svg};
  }

  function play(){
    clearAll();
    var parts=build(),ov=overlay;
    function phase(p,ms){later(function(){ov.classList.add(p)},ms)}
    if(reduce){
      ov.classList.add("p1","p2","p4");
      later(function(){finish(false)},1600);
      return;
    }
    // Timeline
    requestAnimationFrame(function(){requestAnimationFrame(function(){ov.classList.add("p1")})});
    phase("p2",900);
    phase("p3",1700);
    var i=0;
    function nextWord(){
      if(i>=WORDS.length)return;
      fitWord(parts.word,WORDS[i]);
      parts.word.classList.remove("glitch");void parts.word.getBBox();parts.word.classList.add("glitch");
      i++;later(nextWord,i===WORDS.length-1?520:(i===1?500:300));
    }
    later(nextWord,1700);
    phase("p4",3700);
    later(function(){shatter(parts)},5600);
  }

  // Size the word so it sits inside the box face (inner width 200 units, keep 24 of padding).
  function fitWord(node,text){
    var MAX=176,size=34;
    node.textContent=text;
    node.setAttribute("font-size",size);
    try{
      var w=node.getComputedTextLength();
      while(w>MAX&&size>12){size-=1;node.setAttribute("font-size",size);w=node.getComputedTextLength()}
    }catch(e){}
  }

  function shatter(parts){
    var ov=overlay,cv=parts.canvas,ctx=cv.getContext("2d");
    var W=cv.width=ov.clientWidth,H=cv.height=ov.clientHeight;
    // Pixel-grid dissolve: navy cells vanish from the box outward, with a little randomness.
    var cell=Math.max(10,Math.round(Math.min(W,H)/36));
    var cols=Math.ceil(W/cell),rows=Math.ceil(H/cell);
    var cx=W/2,cy=H/2,maxd=Math.hypot(cx,cy);
    var t0=null,DUR=1250;
    var order=[];
    for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){
      var d=Math.hypot(c*cell+cell/2-cx,r*cell+cell/2-cy)/maxd;
      order.push({c:c,r:r,t:d*0.75+Math.random()*0.25});
    }
    // Falling cyan debris from the box edges
    var debris=[];for(var k=0;k<160;k++){debris.push({x:cx+(Math.random()-.5)*Math.min(W*.5,420),y:cy+(Math.random()-.5)*160,vx:(Math.random()-.5)*2.2,vy:-1-Math.random()*3,s:3+Math.random()*5,a:1})}
    parts.stage.classList.add("out");
    ov.style.background="transparent";ov.querySelector(".ail-grid").style.opacity="0";
    var ctl=ov.querySelector(".ail-ctl");if(ctl)ctl.style.opacity="0";
    function frame(ts){
      if(t0===null)t0=ts;var p=(ts-t0)/DUR;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle=NAVY;
      for(var i=0;i<order.length;i++){var o=order[i];if(o.t>p)ctx.fillRect(o.c*cell,o.r*cell,cell+1,cell+1)}
      ctx.fillStyle=CYAN;
      for(var j=0;j<debris.length;j++){var dbr=debris[j];dbr.vy+=0.18;dbr.x+=dbr.vx;dbr.y+=dbr.vy;dbr.a-=0.012;if(dbr.a>0){ctx.globalAlpha=Math.max(0,dbr.a);ctx.fillRect(dbr.x,dbr.y,dbr.s,dbr.s)}}
      ctx.globalAlpha=1;
      if(p<1.15)raf=requestAnimationFrame(frame);else finish(false);
    }
    raf=requestAnimationFrame(frame);
  }

  function finish(skipped){
    clearAll();
    if(!overlay)return;
    var ov=overlay;overlay=null;
    try{localStorage.setItem(KEY,"1")}catch(e){}
    if(document.fullscreenElement===ov&&document.exitFullscreen){try{document.exitFullscreen()}catch(e){}}
    if(skipped){ov.style.transition="opacity .35s";ov.style.opacity="0";ov.classList.add("ail-done")}
    document.body.classList.remove("ail-lock");
    setTimeout(function(){if(ov.parentNode)ov.parentNode.removeChild(ov)},skipped?380:0);
  }

  function addReplay(){
    var head=document.querySelector("header.masthead")||document.querySelector("header");
    if(!head||head.querySelector(".ail-replay"))return;
    var b=el("button","ail-replay","▸ Replay intro");b.type="button";
    b.addEventListener("click",function(){window.scrollTo(0,0);play()});
    head.appendChild(b);
  }

  window.AILIntro={replay:function(){play()},reset:function(){try{localStorage.removeItem(KEY)}catch(e){}}};

  if(document.body){
    if(!seen)play();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",addReplay);else addReplay();
})();
