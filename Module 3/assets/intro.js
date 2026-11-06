/* ------------------------------------------------------------
   The Prompt — cinematic intro for Module 3 pages
   AI Literacy • Module 3

   A Module 3 variant of the Module 1 "Sealed Box" and Module 2
   "The Record" intros, same contract: a one-line prompt on the
   left, an arrow marked GENERATE, and an output that fans out on
   the right while a word cycles in it (audience, purpose, context,
   constraints, format, examples, verification).

   Usage (first thing inside <body>; optional data-words="A|B|C"
   replaces the word cycle inside the output, optional data-sub
   replaces the one-line subtitle, optional data-prompt replaces
   the prompt line):
     <script src="assets/intro.js"
       data-eyebrow="AI Literacy • Module 3 • Lesson 3.4"
       data-title="Prompting as Rhetoric and Specification"
       data-key="ail-intro-3.4-lesson"></script>

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
  var WORDS=["?","AUDIENCE","PURPOSE","CONTEXT","CONSTRAINTS","FORMAT","EXAMPLES","VERIFICATION","?"];
  if(me.getAttribute("data-words")){WORDS=["?"].concat(me.getAttribute("data-words").split("|").map(function(s){return s.trim()}).filter(Boolean)).concat(["?"])}
  var SUB=me.getAttribute("data-sub")||"The system does exactly what it was asked. The question is what it was asked.";
  var PROMPT=me.getAttribute("data-prompt")||"Write about the water cycle.";
  var NAVY="#0f2233",CYAN="#4fd1e8",TEAL="#0e8fa8",GOLD="#d19a1e",INK="#e8f3f7";
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css=''+
  '.ail-intro{position:fixed;inset:0;z-index:10000;background:'+NAVY+';color:'+INK+';font-family:"IBM Plex Sans","Segoe UI",Helvetica,Arial,sans-serif;overflow:hidden;display:flex;align-items:center;justify-content:center}'+
  '.ail-intro.ail-fs{width:100vw;height:100vh}'+
  '.ail-intro .ail-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(79,209,232,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(79,209,232,.07) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}'+
  '.ail-intro canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'+
  '.ail-intro .ail-stage{position:relative;width:min(94vw,820px);display:flex;flex-direction:column;align-items:center;gap:1.2rem;transition:opacity .45s}'+
  '.ail-intro .ail-stage.out{opacity:0}'+
  '.ail-intro svg{display:block;width:min(92vw,800px);height:auto;overflow:visible}'+
  '.ail-intro .ln{fill:none;stroke:'+CYAN+';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}'+
  '.ail-intro .thin{stroke-width:1.2;opacity:.55}'+
  '.ail-intro .card{stroke-dasharray:700;stroke-dashoffset:700;transition:stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)}'+
  '.ail-intro.p1 .card{stroke-dashoffset:0}'+
  '.ail-intro .ptxt{font-family:"IBM Plex Mono",Consolas,monospace;font-size:16px;fill:#fff;opacity:0;transition:opacity .5s .5s}'+
  '.ail-intro.p1 .ptxt{opacity:1}'+
  '.ail-intro .caret{fill:'+CYAN+';opacity:0}'+
  '.ail-intro.p1 .caret{animation:ail-blink .9s steps(2) infinite}'+
  '@keyframes ail-blink{0%{opacity:1}100%{opacity:0}}'+
  '.ail-intro .lbl{font-family:"IBM Plex Mono",Consolas,monospace;font-size:13px;letter-spacing:.14em;fill:'+CYAN+';opacity:0;transition:opacity .5s}'+
  '.ail-intro.p2 .lbl{opacity:1}'+
  '.ail-intro.p1 .lbl.w{opacity:1}'+
  '.ail-intro .arrow{opacity:0;transition:opacity .5s}'+
  '.ail-intro.p2 .arrow{opacity:1}'+
  '.ail-intro .tok{font-family:"IBM Plex Mono",Consolas,monospace;font-size:13px;fill:'+INK+';opacity:0}'+
  '.ail-intro.p2 .tok{animation:ail-fly 1.4s linear infinite}'+
  '.ail-intro .tok:nth-child(2){animation-delay:.47s!important}.ail-intro .tok:nth-child(3){animation-delay:.94s!important}'+
  '@keyframes ail-fly{0%{transform:translateX(-120px);opacity:0}15%{opacity:1}80%{opacity:1}100%{transform:translateX(0);opacity:0}}'+
  '.ail-intro .fan{stroke-dasharray:320;stroke-dashoffset:320;transition:stroke-dashoffset .9s cubic-bezier(.4,0,.2,1)}'+
  '.ail-intro.p2 .fan{stroke-dashoffset:0}'+
  '.ail-intro .fan.g{stroke:'+GOLD+'}'+
  '.ail-intro .fan:nth-of-type(2){transition-delay:.12s}.ail-intro .fan:nth-of-type(3){transition-delay:.24s}.ail-intro .fan:nth-of-type(4){transition-delay:.36s}.ail-intro .fan:nth-of-type(5){transition-delay:.48s}.ail-intro .fan:nth-of-type(6){transition-delay:.6s}.ail-intro .fan:nth-of-type(7){transition-delay:.72s}'+
  '.ail-intro .ftxt{font-family:"IBM Plex Mono",Consolas,monospace;font-size:13px;letter-spacing:.06em;fill:#c7dbe3;opacity:0;transition:opacity .4s .9s}'+
  '.ail-intro.p2 .ftxt{opacity:.85}'+
  '.ail-intro .ftxt.g{fill:'+GOLD+'}'+
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

    // 800 x 300 viewBox. The prompt on the left (x 20..316), the output fanning out on the right (x 436..610, labels to ~790).
    var svg=svgEl("svg",{viewBox:"0 0 800 300","aria-hidden":"true"});

    // THE PROMPT: one short line in a card, with a blinking caret.
    var card=svgEl("path",{"class":"ln card",d:"M20 108 H316 V192 H20 Z"});svg.appendChild(card);
    var pt=svgEl("text",{"class":"ptxt",x:"36",y:"156"});pt.textContent=PROMPT;svg.appendChild(pt);
    var caret=svgEl("rect",{"class":"caret",x:"306",y:"141",width:"3",height:"20"});svg.appendChild(caret);
    var lw=svgEl("text",{"class":"lbl w",x:"168",y:"272","text-anchor":"middle"});lw.textContent="THE PROMPT";svg.appendChild(lw);

    // THE OUTPUT: seven lines fanning out from one point. Each is one thing the system could legitimately produce.
    var fanG=svgEl("g");
    var fans=[
      ["M436 150 L610 42","FOR A THIRD GRADER",false],
      ["M436 150 L610 78","FOR A BIOLOGIST",false],
      ["M436 150 L610 114","A POEM",false],
      ["M436 150 L610 150","FIVE BULLETS",true],
      ["M436 150 L610 186","TWO THOUSAND WORDS",false],
      ["M436 150 L610 222","IN SPANISH",false],
      ["M436 150 L610 258","WITH MADE-UP FACTS",false]
    ];
    fans.forEach(function(f){fanG.appendChild(svgEl("path",{"class":"ln thin fan"+(f[2]?" g":""),d:f[0]}))});
    svg.appendChild(fanG);
    fans.forEach(function(f){var m=/L(\d+) (\d+)/.exec(f[0]);var t=svgEl("text",{"class":"ftxt"+(f[2]?" g":""),x:String(+m[1]+8),y:String(+m[2]+4)});t.textContent=f[1];svg.appendChild(t)});
    svg.appendChild(svgEl("circle",{"class":"ln",cx:"436",cy:"150",r:"5"}));
    var lr=svgEl("text",{"class":"lbl",x:"620",y:"292","text-anchor":"middle"});lr.textContent="THE OUTPUT";svg.appendChild(lr);

    // GENERATE arrow and the tokens flying across
    var gA=svgEl("g",{"class":"arrow"});
    gA.appendChild(svgEl("path",{"class":"ln",d:"M326 150 H420 M406 140 L420 150 L406 160"}));
    var la=svgEl("text",{"class":"lbl",x:"373",y:"132","text-anchor":"middle"});la.textContent="GENERATE";gA.appendChild(la);
    svg.appendChild(gA);
    var toks=svgEl("g",{"class":"arrow"});
    ["write","about","the"].forEach(function(t,i){var x=svgEl("text",{"class":"tok",x:String(410-i*6),y:String(206+i*14),"text-anchor":"end"});x.textContent=t;toks.appendChild(x)});
    svg.appendChild(toks);

    // The word that was never specified, under the prompt card
    var word=svgEl("text",{"class":"word",x:"168",y:"224","font-size":"24"});word.textContent="?";svg.appendChild(word);
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
    return {canvas:canvas,stage:stage,word:word,svg:svg,fan:fanG};
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
    phase("p3",2100);
    var i=0;
    function nextWord(){
      if(i>=WORDS.length)return;
      fitWord(parts.word,WORDS[i]);
      parts.word.classList.remove("glitch");void parts.word.getBBox();parts.word.classList.add("glitch");
      i++;later(nextWord,i===WORDS.length-1?520:(i===1?500:320));
    }
    later(nextWord,2100);
    // the fan dims a little once the words have named what was missing
    later(function(){parts.fan.style.opacity=".5"},3200);
    phase("p4",4300);
    later(function(){shatter(parts)},6200);
  }

  // Size the word so it sits under the prompt card (keep it within 290 units).
  function fitWord(node,text){
    var MAX=280,size=24;
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
    // Pixel-grid dissolve: navy cells vanish from the centre outward.
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
