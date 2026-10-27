/* ------------------------------------------------------------
   The Record — cinematic intro for Module 2 pages
   AI Literacy • Module 2

   A Module 2 variant of the Module 1 "Sealed Box" intro, same
   contract: the world on the left, an arrow marked RECORD, and a
   thin data record on the right that fills with values while a
   word cycles in it (observation, label, category, claim, decision).

   Usage (first thing inside <body>; optional data-words="A|B|C"
   replaces the word cycle inside the record, optional data-sub
   replaces the one-line subtitle):
     <script src="assets/intro.js"
       data-eyebrow="AI Literacy • Module 2 • Lesson 2.1"
       data-title="Data, Information, and Representation"
       data-key="ail-intro-2.1-lesson"></script>

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
  var WORDS=["?","OBSERVATION","LABEL","CATEGORY","CLAIM","DECISION","?"];
  if(me.getAttribute("data-words")){WORDS=["?"].concat(me.getAttribute("data-words").split("|").map(function(s){return s.trim()}).filter(Boolean)).concat(["?"])}
  var SUB=me.getAttribute("data-sub")||"The world is rich. The record is thin. What was left out is the question.";
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
  '.ail-intro .thin{stroke-width:1.2;opacity:.55}'+
  '.ail-intro .world{opacity:0;transition:opacity .9s}'+
  '.ail-intro.p1 .world{opacity:1}'+
  '.ail-intro .world .dot{fill:'+CYAN+';opacity:.75}'+
  '.ail-intro .world .dot.g{fill:'+GOLD+'}'+
  '.ail-intro .world .wv{fill:none;stroke:'+CYAN+';stroke-width:1.4;opacity:.6}'+
  '.ail-intro .rec{stroke-dasharray:1200;stroke-dashoffset:1200;transition:stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)}'+
  '.ail-intro.p1 .rec{stroke-dashoffset:0}'+
  '.ail-intro .row{stroke-dasharray:300;stroke-dashoffset:300;transition:stroke-dashoffset .8s .6s cubic-bezier(.4,0,.2,1)}'+
  '.ail-intro.p1 .row{stroke-dashoffset:0}'+
  '.ail-intro .arrow{opacity:0;transition:opacity .5s}'+
  '.ail-intro.p2 .arrow{opacity:1}'+
  '.ail-intro .lbl{font-family:"IBM Plex Mono",Consolas,monospace;font-size:13px;letter-spacing:.14em;fill:'+CYAN+';opacity:0;transition:opacity .5s}'+
  '.ail-intro.p2 .lbl{opacity:1}'+
  '.ail-intro.p1 .lbl.w{opacity:1}'+
  '.ail-intro .tok{font-family:"IBM Plex Mono",Consolas,monospace;font-size:13px;fill:'+INK+';opacity:0}'+
  '.ail-intro.p2 .tok{animation:ail-fly 1.4s linear infinite}'+
  '.ail-intro .tok:nth-child(2){animation-delay:.47s!important}.ail-intro .tok:nth-child(3){animation-delay:.94s!important}'+
  '@keyframes ail-fly{0%{transform:translateX(-120px);opacity:0}15%{opacity:1}80%{opacity:1}100%{transform:translateX(0);opacity:0}}'+
  '.ail-intro .cell{font-family:"IBM Plex Mono",Consolas,monospace;font-size:13px;fill:'+INK+';opacity:0;transition:opacity .4s}'+
  '.ail-intro.p2 .cell{opacity:.9}'+
  '.ail-intro .cell:nth-of-type(2){transition-delay:.5s}.ail-intro .cell:nth-of-type(3){transition-delay:1s}'+
  '.ail-intro .ck{font-family:"IBM Plex Mono",Consolas,monospace;font-size:11px;letter-spacing:.1em;fill:'+CYAN+';opacity:0;transition:opacity .4s}'+
  '.ail-intro.p2 .ck{opacity:.7}'+
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

  // Deterministic pseudo-random so the world looks the same on every play.
  function rnd(seed){return function(){seed=(seed*9301+49297)%233280;return seed/233280}}

  function build(){
    overlay=el("div","ail-intro");overlay.setAttribute("role","dialog");overlay.setAttribute("aria-label","Intro");
    overlay.appendChild(el("div","ail-grid"));
    var canvas=document.createElement("canvas");overlay.appendChild(canvas);
    var stage=el("div","ail-stage");

    // 620 x 300 viewBox. The world on the left (centre 150,150), the record on the right (x 380..590).
    var svg=svgEl("svg",{viewBox:"0 0 620 300","aria-hidden":"true"});

    // THE WORLD: a crowded cluster of marks inside a soft circle, far more detail than the record will keep.
    var world=svgEl("g",{"class":"world"});
    world.appendChild(svgEl("circle",{"class":"ln thin",cx:"150",cy:"150",r:"96"}));
    var r=rnd(7);
    for(var i=0;i<110;i++){
      var a=r()*Math.PI*2,d=Math.sqrt(r())*84;
      var cx=150+Math.cos(a)*d,cy=150+Math.sin(a)*d;
      world.appendChild(svgEl("circle",{"class":"dot"+(i%9===0?" g":""),cx:cx.toFixed(1),cy:cy.toFixed(1),r:(1+r()*2.2).toFixed(1)}));
    }
    // a few wavy strokes: weather, sound, movement
    world.appendChild(svgEl("path",{"class":"wv",d:"M86 120 q12 -10 24 0 t24 0 t24 0 t24 0 t24 0"}));
    world.appendChild(svgEl("path",{"class":"wv",d:"M96 186 q12 10 24 0 t24 0 t24 0 t24 0"}));
    world.appendChild(svgEl("path",{"class":"wv",d:"M120 150 q10 -16 20 0 t20 0 t20 0"}));
    var lw=svgEl("text",{"class":"lbl w",x:"150",y:"270","text-anchor":"middle"});lw.textContent="THE WORLD";world.appendChild(lw);
    svg.appendChild(world);

    // THE RECORD: a thin card with three rows.
    var rec=svgEl("path",{"class":"ln rec",d:"M380 70 H590 V230 H380 Z"});svg.appendChild(rec);
    svg.appendChild(svgEl("path",{"class":"ln thin row",d:"M380 110 H590 M380 150 H590 M380 190 H590"}));
    var lr=svgEl("text",{"class":"lbl",x:"485",y:"270","text-anchor":"middle"});lr.textContent="THE RECORD";svg.appendChild(lr);
    var keys=["TEMP","TIME","NOTE"],vals=["72°F","09:00","late"];
    for(var k=0;k<3;k++){
      var kk=svgEl("text",{"class":"ck",x:"392",y:String(96+k*40)});kk.textContent=keys[k];svg.appendChild(kk);
    }
    var cells=svgEl("g");
    for(var c=0;c<3;c++){
      var cv=svgEl("text",{"class":"cell",x:"578",y:String(96+c*40),"text-anchor":"end"});cv.textContent=vals[c];cells.appendChild(cv);
    }
    svg.appendChild(cells);

    // RECORD arrow and the values flying across
    var gA=svgEl("g",{"class":"arrow"});
    gA.appendChild(svgEl("path",{"class":"ln",d:"M258 150 H364 M350 140 L364 150 L350 160"}));
    var la=svgEl("text",{"class":"lbl",x:"311",y:"132","text-anchor":"middle"});la.textContent="RECORD";gA.appendChild(la);
    svg.appendChild(gA);
    var toks=svgEl("g",{"class":"arrow"});
    vals.forEach(function(t,i){var x=svgEl("text",{"class":"tok",x:String(352-i*6),y:String(170+i*14),"text-anchor":"end"});x.textContent=t;toks.appendChild(x)});
    svg.appendChild(toks);

    // The word inside the record (over the bottom row)
    var word=svgEl("text",{"class":"word",x:"485",y:"212","font-size":"22"});word.textContent="?";svg.appendChild(word);
    stage.appendChild(svg);

    var text=el("div","ail-text");
    if(EYEBROW)text.appendChild(el("p","ail-eyebrow",EYEBROW));
    text.appendChild(el("h1",null,TITLE));
    text.appendChild(el("p","ail-sub",SUB));
    stage.appendChild(text);
    overlay.appendChild(stage);

    var ctl=el("div","ail-ctl");
    var fs=el("button","ail-btn","Watch full screen");fs.type="button";
    fs.addEventListener("click",function(){
      var rq=overlay.requestFullscreen||overlay.webkitRequestFullscreen;
      if(rq){try{var p=rq.call(overlay);if(p&&p.catch)p.catch(function(){})}catch(e){}}
    });
    var skip=el("button","ail-btn","Skip intro");skip.type="button";
    skip.addEventListener("click",function(){finish(true)});
    ctl.appendChild(fs);ctl.appendChild(skip);overlay.appendChild(ctl);
    if(!document.fullscreenEnabled&&!document.webkitFullscreenEnabled)fs.hidden=true;

    document.body.appendChild(overlay);document.body.classList.add("ail-lock");
    skip.focus({preventScroll:true});
    return {canvas:canvas,stage:stage,word:word,svg:svg,world:world};
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
    requestAnimationFrame(function(){requestAnimationFrame(function(){ov.classList.add("p1")})});
    phase("p2",1000);
    phase("p3",1900);
    var i=0;
    function nextWord(){
      if(i>=WORDS.length)return;
      fitWord(parts.word,WORDS[i]);
      parts.word.classList.remove("glitch");void parts.word.getBBox();parts.word.classList.add("glitch");
      i++;later(nextWord,i===WORDS.length-1?520:(i===1?500:320));
    }
    later(nextWord,1900);
    // the world dims a little once the record has taken what it keeps
    later(function(){parts.world.style.opacity=".45"},2600);
    phase("p4",3900);
    later(function(){shatter(parts)},5800);
  }

  // Size the word so it sits inside the record (inner width 210 units, keep 20 of padding).
  function fitWord(node,text){
    var MAX=190,size=22;
    node.textContent=text;
    node.setAttribute("font-size",size);
    try{
      var w=node.getComputedTextLength();
      while(w>MAX&&size>11){size-=1;node.setAttribute("font-size",size);w=node.getComputedTextLength()}
    }catch(e){}
  }

  function shatter(parts){
    var ov=overlay,cv=parts.canvas,ctx=cv.getContext("2d");
    var W=cv.width=ov.clientWidth,H=cv.height=ov.clientHeight;
    // Pixel-grid dissolve: navy cells vanish from the centre outward, like a table being cleared cell by cell.
    var cell=Math.max(10,Math.round(Math.min(W,H)/36));
    var cols=Math.ceil(W/cell),rows=Math.ceil(H/cell);
    var cx=W/2,cy=H/2,maxd=Math.hypot(cx,cy);
    var t0=null,DUR=1250;
    var order=[];
    for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){
      var d=Math.hypot(c*cell+cell/2-cx,r*cell+cell/2-cy)/maxd;
      order.push({c:c,r:r,t:d*0.75+Math.random()*0.25});
    }
    var debris=[];for(var k=0;k<160;k++){debris.push({x:cx+(Math.random()-.5)*Math.min(W*.5,420),y:cy+(Math.random()-.5)*160,vx:(Math.random()-.5)*2.2,vy:-1-Math.random()*3,s:3+Math.random()*5,a:1,g:Math.random()<.12})}
    parts.stage.classList.add("out");
    ov.style.background="transparent";ov.querySelector(".ail-grid").style.opacity="0";
    var ctl=ov.querySelector(".ail-ctl");if(ctl)ctl.style.opacity="0";
    function frame(ts){
      if(t0===null)t0=ts;var p=(ts-t0)/DUR;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle=NAVY;
      for(var i=0;i<order.length;i++){var o=order[i];if(o.t>p)ctx.fillRect(o.c*cell,o.r*cell,cell+1,cell+1)}
      for(var j=0;j<debris.length;j++){var dbr=debris[j];dbr.vy+=0.18;dbr.x+=dbr.vx;dbr.y+=dbr.vy;dbr.a-=0.012;if(dbr.a>0){ctx.globalAlpha=Math.max(0,dbr.a);ctx.fillStyle=dbr.g?GOLD:CYAN;ctx.fillRect(dbr.x,dbr.y,dbr.s,dbr.s)}}
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
