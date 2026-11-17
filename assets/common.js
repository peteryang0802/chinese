/* ============================================================
   共享渲染器与交互 common.js
   课文薄页面只需 <body data-lesson="l1">，由本脚本渲染并绑定交互
   ============================================================ */

var BOOK = BOOK_G7A;
var LESSONS = LESSONS_G7A;

function el(id){return document.getElementById(id);}
function pad(n){return (n<10?'0':'')+n;}

/* ---------- 小块渲染 ---------- */
function noteLine(id){return '<div class="note-line"'+(id?' id="'+id+'"':'')+'></div>';}

function renderButton(b){
  var attr=' type="button"';
  if(b.show) attr+=' data-show="'+b.show+'"';
  if(b.hide) attr+=' data-hide="'+b.hide+'"';
  if(b.reveal) attr+=' data-reveal="'+b.reveal+'"';
  if(b.toggle) attr+=' data-toggle="'+b.toggle+'"';
  var cls='btn '+(b.kind||'');
  return '<button class="'+cls.trim()+'"'+attr+'>'+b.label+'</button>';
}

function renderBlock(b){
  switch(b.t){
    case 'html':
      return '<div class="prose">'+b.h+'</div>';
    case 'scene':
      return '<div class="scene" id="'+(b.id||'')+'">'+b.svg
        +(b.cap?'<p class="scene-cap">'+b.cap+'</p>':'')+'</div>';
    case 'verse':
      return '<div class="verse">'+b.lines.join('')+'</div>'+noteLine(b.noteId);
    case 'prose':
      return '<div class="prose">'+b.paras.map(function(p){return '<p>'+p+'</p>';}).join('')+'</div>'
        +(b.noteId?noteLine(b.noteId):'');
    case 'cards':
      return '<div class="cards">'+b.items.map(function(i){
        return '<div class="flip"><button type="button">'
          +'<span class="face front">'+i.front+'<span class="hint-tap">点一下看解释</span></span>'
          +'<span class="face back">'+i.back+'</span></button></div>';
      }).join('')+'</div>';
    case 'bigq':
      return '<p class="big-q">'+b.q+'</p>'
        +'<textarea class="answer-box" data-save="'+b.save+'" placeholder="写几句自己的想法，只有你自己看得到"></textarea>'
        +'<p class="save-tip">自动保存在这台设备上，随时能改</p>';
    case 'choices':
      return '<div class="btn-row" id="'+(b.id||'')+'">'+b.options.map(function(o){
        return '<button type="button" class="choice" data-v="'+o.v+'" aria-pressed="false">'+o.label+'</button>';
      }).join('')+'</div>';
    case 'timeline':
      return '<div class="timeline">'+b.items.map(function(i){
        return '<div class="tl-item"><div class="tl-t">'+i.t+'</div><div class="tl-d">'+i.d+'</div></div>';
      }).join('')+'</div>';
    case 'dots':
      return '<ul class="dot-list">'+b.items.map(function(i){return '<li>'+i+'</li>';}).join('')+'</ul>';
    case 'buttons':
      return '<div class="btn-row">'+b.buttons.map(renderButton).join('')+'</div>';
    default: return '';
  }
}

function renderSection(sec, labClass){
  if(!sec) return '';
  return '<h2 class="section-label '+labClass+'">'+sec.title+'</h2>'
    +'<div class="panel">'+sec.blocks.map(renderBlock).join('')+'</div>';
}

/* ---------- 页面骨架 ---------- */
function headHTML(){
  return '<a class="skip" href="#main">跳到正文</a>'
  +'<header class="site-head"><div class="wrap row">'
  +'<a class="brand" href="../index.html">'
  +'<svg class="logo" viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" rx="8" fill="#f4ecd8"/>'
  +'<path d="M9 8h16v18H9z" fill="#1d2a33"/><path d="M17 8v18" stroke="#f4ecd8" stroke-width="1.4"/></svg>'
  +'我的语文书房</a>'
  +'<span class="crumb"><a href="../index.html">书架</a> / <a href="index.html">七上</a> / 课文</span>'
  +'</div></header>';
}

function renderLesson(){
  var id=document.body.getAttribute('data-lesson');
  var L=LESSONS[id];
  if(!L){document.body.innerHTML='<p class="wrap" style="padding:40px">这一课还在准备中。</p>';return;}

  var all=[];
  BOOK.units.forEach(function(u){u.lessons.forEach(function(l){all.push(l);});});
  var idx=all.findIndex(function(l){return l.id===id;});
  var prev=all[idx-1], next=all[idx+1];

  var pager='<nav class="pager">'
    +(prev?'<a href="lesson-'+pad(prev.no)+'.html">← 第'+prev.no+'课 '+prev.title+'</a>'
          :'<a href="index.html">← 回目录</a>')
    +'<a href="index.html">七上目录</a>'
    +(next?'<a href="lesson-'+pad(next.no)+'.html">第'+next.no+'课 '+next.title+' →</a>'
          :'<span></span>')+'</nav>';

  var cur=all[idx];
  document.documentElement.lang='zh-CN';
  document.title=cur.title+' · 我的语文书房';
  document.body.innerHTML=headHTML()
    +'<main id="main" class="wrap lesson-stage">'
    +'<div class="page-head"><div class="eyebrow">'+(L.kind||cur.type||'课文')+' · '+ (cur.author||L.author||'')+'</div>'
    +'<h1>'+cur.title+'</h1>'+(L.lead?'<p class="lead">'+L.lead+'</p>':'')+'</div>'
    +renderSection(L.prep,'lab-prep')
    +renderSection(L.read,'lab-read')
    +renderSection(L.back,'lab-back')
    +pager+'</main>'
    +'<footer class="foot wrap">我的语文书房 · 课前预习 · 课后复习</footer>';

  restoreSaved();
  window.scrollTo(0,0);
}

/* ---------- 拓展板块（实践/写作/专题/整本书/课外诗词） ---------- */
function extraHeadHTML(){
  return '<a class="skip" href="#main">跳到正文</a>'
  +'<header class="site-head"><div class="wrap row">'
  +'<a class="brand" href="../index.html">'
  +'<svg class="logo" viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" rx="8" fill="#f4ecd8"/>'
  +'<path d="M9 8h16v18H9z" fill="#1d2a33"/><path d="M17 8v18" stroke="#f4ecd8" stroke-width="1.4"/></svg>'
  +'我的语文书房</a>'
  +'<span class="crumb"><a href="../index.html">书架</a> / <a href="index.html">七上</a> / 拓展</span>'
  +'</div></header>';
}

function renderExtra(){
  var key=document.body.getAttribute('data-extra');
  var X=EXTRAS_G7A[key];
  if(!X){document.body.innerHTML='<p class="wrap" style="padding:40px">这个板块还在准备中。</p>';return;}

  var secs=(X.sections||[]).map(function(s){
    return renderSection({title:s.title, blocks:s.blocks}, s.lab||'lab-prep');
  }).join('');
  var back='<nav class="pager"><a href="index.html">← 回七上目录</a><span></span><span></span></nav>';

  document.documentElement.lang='zh-CN';
  document.title=X.title+' · 我的语文书房';
  document.body.innerHTML=extraHeadHTML()
    +'<main id="main" class="wrap lesson-stage">'
    +'<div class="page-head"><div class="eyebrow">'+(X.eyebrow||'拓展板块')+'</div>'
    +'<h1>'+X.title+'</h1>'+(X.lead?'<p class="lead">'+X.lead+'</p>':'')+'</div>'
    +secs+back+'</main>'
    +'<footer class="foot wrap">我的语文书房 · 课前预习 · 课后复习</footer>';

  restoreSaved();
  window.scrollTo(0,0);
}

/* ---------- 本地保存恢复 ---------- */
function restoreSaved(){
  document.querySelectorAll('.answer-box[data-save]').forEach(function(tb){
    var k=tb.getAttribute('data-save');
    try{tb.value=localStorage.getItem(k)||'';}catch(e){}
  });
}

/* ---------- 统一交互（事件委托） ---------- */
document.addEventListener('input',function(e){
  var tb=e.target.closest('.answer-box[data-save]');
  if(tb){try{localStorage.setItem(tb.getAttribute('data-save'),tb.value);}catch(err){}}
});

document.addEventListener('click',function(e){
  var node=e.target;

  // 可点词
  var w=node.closest('.word');
  if(w){
    var host=w.closest('.verse,.prose');
    if(host){
      host.querySelectorAll('.word').forEach(function(x){if(x!==w)x.classList.remove('on');});
      w.classList.toggle('on');
      var note=host.parentElement.querySelector('.note-line');
      if(note){ note.innerHTML = w.classList.contains('on') ? (w.getAttribute('data-note')||'') : ''; }
    }
    return;
  }

  // 翻转卡
  var flip=node.closest('.flip button');
  if(flip){flip.classList.toggle('flipped');return;}

  // 猜想按钮（同组互斥）
  var ch=node.closest('.choice');
  if(ch){
    var group=ch.parentElement;
    var on=ch.getAttribute('aria-pressed')==='true';
    group.querySelectorAll('.choice').forEach(function(c){c.setAttribute('aria-pressed','false');});
    if(!on){ch.setAttribute('aria-pressed','true');}
    return;
  }

  // 通用显示/隐藏/揭示/切换
  var act=node.closest('[data-show],[data-hide],[data-reveal],[data-toggle]');
  if(act){
    if(act.getAttribute('data-show')){
      document.querySelectorAll(act.getAttribute('data-show')).forEach(function(x){x.hidden=false;});
    }
    if(act.getAttribute('data-hide')){
      document.querySelectorAll(act.getAttribute('data-hide')).forEach(function(x){x.hidden=true;});
    }
    var rv=act.getAttribute('data-reveal');
    if(rv){
      document.querySelectorAll(rv).forEach(function(x){x.classList.add('revealed');});
    }
    var tg=act.getAttribute('data-toggle');
    if(tg){
      var parts=tg.split('|');
      document.querySelectorAll(parts[0]).forEach(function(x){x.classList.toggle(parts[1]);});
    }
  }
});

if(document.body.getAttribute('data-lesson')){renderLesson();}
else if(document.body.getAttribute('data-extra')){renderExtra();}
