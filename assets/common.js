/* ============================================================
   共享渲染器与交互 common.js
   课文薄页面只需 <body data-lesson="l1">，由本脚本渲染并绑定交互
   ============================================================ */

var BOOK = (typeof BOOK_G7A!=='undefined') ? BOOK_G7A : null;
var LESSONS = (typeof LESSONS_G7A!=='undefined') ? LESSONS_G7A : null;

function el(id){return document.getElementById(id);}
function pad(n){return (n<10?'0':'')+n;}

/* 完整教材顺序：按单元，课内先课文、再拓展，pager 与续读共用这一条 */
function buildSequence(){
  var seq=[];
  if(!BOOK)return seq;
  BOOK.units.forEach(function(u){
    u.lessons.forEach(function(l){
      seq.push({kind:'lesson', unit:u.id, no:l.no, title:l.title, href:'lesson-'+pad(l.no)+'.html'});
    });
    u.extras.forEach(function(x){
      seq.push({kind:'extra', unit:u.id, title:x.label, href:x.href});
    });
  });
  return seq;
}

/* 通用 pager：上一项 / 目录 / 下一项，都写具体标题，含拓展 */
function renderPager(currentHref){
  var seq=buildSequence();
  var i=seq.findIndex(function(s){return s.href===currentHref;});
  var prev=i>0?seq[i-1]:null, next=i>=0&&i<seq.length-1?seq[i+1]:null;
  function side(item,dir){
    if(!item)return '<span class="pager-placeholder" aria-hidden="true"></span>';
    return '<a href="'+item.href+'">'+(dir==='prev'?'← ':'')+item.title+(dir==='next'?' →':'')+'</a>';
  }
  return '<nav class="pager" aria-label="上一项或下一项">'
    +side(prev,'prev')+'<a href="index.html">七上目录</a>'+side(next,'next')+'</nav>';
}

/* 记录最近一次访问的页面，供目录“继续上次”和定位单元用 */
function markVisited(href){
  try{localStorage.setItem('g7a-last',href);}catch(e){}
}

/* 动态写入 meta description，已存在则更新 */
function setMetaDesc(text){
  if(!text) return;
  var m=document.querySelector('meta[name="description"]');
  if(!m){
    m=document.createElement('meta');
    m.setAttribute('name','description');
    var head=document.querySelector('head');
    if(head) head.appendChild(m);
  }
  m.setAttribute('content', text);
}

/* ---------- 小块渲染 ---------- */
function noteLine(id){return '<div class="note-line"'+(id?' id="'+id+'"':'')+'></div>';}

function renderButton(b){
  var attr=' type="button"';
  if(b.show) attr+=' data-show="'+b.show+'"';
  if(b.hide) attr+=' data-hide="'+b.hide+'"';
  if(b.reveal) attr+=' data-reveal="'+b.reveal+'"';
  if(b.toggle) attr+=' data-toggle="'+b.toggle+'"';
  if(b.post) attr+=' data-post="1"';
  if(b.bring) attr+=' data-bring="'+b.bring+'" data-bring-to="'+(b.bringTo||'')+'"';
  var cls='btn '+(b.kind||'');
  return '<button class="'+cls.trim()+'"'+attr+'>'+b.label+'</button>';
}

function renderBlock(b){
  switch(b.t){
    case 'step':
      return '<section class="step"'+(b.id?' id="'+b.id+'"':'')+(b.hidden?' hidden':'')+'>'
        +(b.title?'<h3 class="step-title">'+b.title+'</h3>':'')
        +b.blocks.map(renderBlock).join('')+'</section>';
    case 'compare':
      var ctabs=b.options.map(function(o,i){
        return '<button type="button" class="cmp-tab" data-cmp="'+b.id+'" data-v="'+o.v+'" aria-pressed="'+(i===0)+'">'+o.label+'</button>';
      }).join('');
      var cpanels=b.options.map(function(o,i){
        return '<div class="cmp-panel" id="'+b.id+'-'+o.v+'"'+(i?' hidden':'')+'>'+(o.svg||'')
          +(o.note?'<p class="cmp-note">'+o.note+'</p>':'')+'</div>';
      }).join('');
      return '<div class="compare" id="'+b.id+'"><div class="cmp-tabs" role="group" aria-label="切换对比">'+ctabs+'</div>'+cpanels+'</div>';
    case 'twodraft':
      var tdAskId=b.id+'-ask';
      var tdAsk=b.ask?'<p class="guess-ask" id="'+tdAskId+'">'+b.ask+'</p>':'';
      return '<div class="two-draft" id="'+b.id+'">'
        +tdAsk
        +'<div class="draft-grid">'
        +'<div class="draft-col"><span class="draft-label" id="'+b.id+'-l1">初稿</span>'
        +'<textarea class="answer-box" data-save="'+b.save1+'" aria-labelledby="'+(b.ask?tdAskId+' ':'')+b.id+'-l1" placeholder="先把想法写下来，不用求好"></textarea></div>'
        +'<div class="draft-col"><span class="draft-label" id="'+b.id+'-l2">修改稿</span>'
        +'<textarea class="answer-box" data-save="'+b.save2+'" aria-labelledby="'+(b.ask?tdAskId+' ':'')+b.id+'-l2" placeholder="在初稿基础上改：加细节、改不顺的地方"></textarea></div>'
        +'</div>'
        +'<div class="draft-tools">'
        +'<button type="button" class="btn ghost" data-draft-copy="'+b.id+'">把初稿复制到修改稿</button>'
        +'<button type="button" class="btn ghost" data-draft-undo="'+b.id+'" hidden>撤回复制</button>'
        +'</div>'
        +'<p class="save-tip" hidden>已保存在本浏览器</p></div>';
    case 'readlist':
      var rlrows=b.items.map(function(it){
        return '<li class="rl-item"><span class="rl-name">'+it.label+'</span>'
          +'<button type="button" class="rl-btn" data-rl="'+b.id+'" data-v="'+it.v+'" data-k="read" aria-pressed="false">已读</button>'
          +'<button type="button" class="rl-btn" data-rl="'+b.id+'" data-v="'+it.v+'" data-k="mark" aria-pressed="false">书签</button></li>';
      }).join('');
      return '<div class="readlist" id="'+b.id+'" data-save="'+b.id+'"><ul>'+rlrows+'</ul>'
        +'<p class="rl-summary" id="'+b.id+'-sum"></p></div>';
    case 'speak':
      var spHtml=b.sentence;
      var spEms=[];
      b.reads.forEach(function(r){if(spEms.indexOf(r.em)<0)spEms.push(r.em);});
      spEms.forEach(function(em){
        spHtml=spHtml.split(em).join('<span class="sp-em" data-em="'+em+'">'+em+'</span>');
      });
      var spIcon='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a4 4 0 010 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
      var spBtns=b.reads.map(function(r){
        return '<button type="button" class="sp-btn" data-sp="'+b.id+'" data-em="'+r.em+'">'+spIcon+'<span>'+r.label+'</span></button>';
      }).join('');
      return '<div class="speak-box" id="'+b.id+'" data-sentence="'+b.sentence+'">'
        +'<p class="sp-sentence">'+spHtml+'</p>'
        +'<div class="sp-btns">'+spBtns+'</div></div>';
    case 'html':
      return '<div class="prose">'+b.h+'</div>';
    case 'scene':
      return '<div class="scene" id="'+(b.id||'')+'">'+b.svg
        +(b.cap?'<p class="scene-cap">'+b.cap+'</p>':'')+'</div>';
    case 'verse':
      return '<div class="verse">'+b.lines.map(function(l){return '<p class="verse-line">'+l+'</p>';}).join('')+noteLine(b.noteId)+'</div>';
    case 'prose':
      return '<div class="prose">'+b.paras.map(function(p){return '<p>'+p+'</p>';}).join('')
        +(b.noteId?noteLine(b.noteId):'')+'</div>';
    case 'cards':
      return '<div class="cards">'+b.items.map(function(i){
        return '<div class="flip"><button type="button" aria-pressed="false">'
          +'<span class="face front">'+i.front+'<span class="hint-tap" aria-hidden="true">点一下看解释</span></span>'
          +'<span class="face back" aria-hidden="true">'+i.back+'</span></button></div>';
      }).join('')+'</div>';
    case 'bigq':
      var qid='bq-'+b.save;
      return '<p class="big-q" id="'+qid+'">'+b.q+'</p>'
        +'<textarea class="answer-box" data-save="'+b.save+'" aria-labelledby="'+qid+'" placeholder="'+placeholderFor(b.q,b.ph)+'"></textarea>'
        +'<p class="save-tip" hidden>已保存在本浏览器</p>';
    case 'choices':
      return '<div class="btn-row"'+(b.id?' id="'+b.id+'"':'')+(b.save?' data-save="'+b.save+'"':'')+'>'+b.options.map(function(o){
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

/* 按题干动作给开放题一个更贴合的提示；数据里显式给 ph 时优先用 ph */
function placeholderFor(q, ph){
  if(ph) return ph;
  q=q||'';
  if(/几个字|几个词|哪几句|摘|抄|圈出/.test(q)) return '把那几个字摘下来，再写一句你为什么选它';
  if(/提纲|思路|分点|顺序/.test(q)) return '分几点列出来，先不用写成完整文章';
  if(/对比|区别|不同|两边/.test(q)) return '两边各写一点，对着比';
  if(/为什么|怎么|什么意思|读出了|哪一|说说|写下来/.test(q)) return '写清你的想法，最好能指回原文';
  return '把想法写在这，只有你自己看得到';
}

function renderSection(sec, labClass, wrapId){
  if(!sec) return '';
  return '<div class="section-wrap '+labClass+'"'+(wrapId?' id="'+wrapId+'"':'')+'>'
    +'<h2 class="section-label">'+sec.title+'</h2>'
    +'<div class="panel">'+sec.blocks.map(renderBlock).join('')+'</div></div>';
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
  if(typeof LESSONS==='undefined'||!LESSONS){failScreen();return;}
  var L=LESSONS[id];
  if(!L){document.body.innerHTML='<p class="wrap" style="padding:40px">这一课还在准备中。</p>';return;}

  var all=[];
  BOOK.units.forEach(function(u){u.lessons.forEach(function(l){all.push(l);});});
  var idx=all.findIndex(function(l){return l.id===id;});
  var cur=all[idx];
  var curHref='lesson-'+pad(cur.no)+'.html';
  var pager=renderPager(curHref);
  markVisited(curHref);
  try{localStorage.setItem('g7a-last-title',cur.title);}catch(e){}

  document.documentElement.lang='zh-CN';
  document.title=cur.title+' · 我的语文书房';
  var lessonTitle=(cur.title.indexOf('《')>=0)?cur.title:'《'+cur.title+'》';
  setMetaDesc('七年级上册'+lessonTitle+'预习复习：先热身、再读懂、最后回味，跟着原文一步步练。');
  var inPageNav='<nav class="inpage-nav" aria-label="本课环节">'
    +'<a href="#sec-prep" data-stage="pre" data-target="sec-prep">预习</a>'
    +'<a href="#sec-read" data-stage="post" data-target="sec-read">读课文</a>'
    +'<a href="#sec-back" data-stage="post" data-target="sec-back">课后</a></nav>';
  var appRoot=document.createElement('div');
  appRoot.className='app-root';
  appRoot.innerHTML=headHTML()
    +'<main id="main" class="wrap lesson-stage">'
    +'<div class="page-head"><div class="eyebrow">'+(L.kind||cur.type||'课文')+' · '+ (cur.author||L.author||'')+'</div>'
    +'<h1>'+cur.title+'</h1>'+(L.lead?'<p class="lead">'+L.lead+'</p>':'')+'</div>'
    +inPageNav
    +renderSection(L.prep,'lab-prep','sec-prep')
    +renderSection(L.read,'lab-read','sec-read')
    +renderSection(L.back,'lab-back','sec-back')
    +pager+'</main>'
    +'<footer class="foot wrap">我的语文书房 · 课前预习 · 课后复习</footer>';
  document.body.appendChild(appRoot);

  restoreSaved();
  enhanceA11y();
  var hadOpenSteps=restoreStepState();
  fillGuessRecall();
  var hashStage=stageFromHash();
  if(hashStage){try{localStorage.setItem('g7a-mode',hashStage.mode);}catch(e){}}
  applyMode(getMode());
  if(hashStage){
    var hashTarget=document.getElementById(hashStage.id);
    if(hashTarget){hashTarget.scrollIntoView({block:'start'});}
    setActiveStage(hashStage.id);
  }else if(hadOpenSteps){
    var openSteps=document.querySelectorAll('.step:not([hidden])');
    var lastOpen=openSteps[openSteps.length-1];
    if(lastOpen){lastOpen.scrollIntoView({block:'start'});}
    setActiveStage(getMode()==='pre'?'sec-prep':'sec-read');
  }else{
    window.scrollTo(0,0);
    setActiveStage(getMode()==='pre'?'sec-prep':'sec-read');
  }
}

/* 深链：URL 里的 #sec-xx 优先于本地记住的模式 */
function stageFromHash(){
  var map={'#sec-prep':{mode:'pre',id:'sec-prep'},'#sec-read':{mode:'post',id:'sec-read'},'#sec-back':{mode:'post',id:'sec-back'}};
  return map[location.hash||'']||null;
}
function setActiveStage(targetId){
  document.querySelectorAll('.inpage-nav a').forEach(function(a){
    a.setAttribute('aria-current',a.getAttribute('data-target')===targetId?'true':'false');
  });
}

/* ---------- 课前 / 课后模式 ---------- */
function getMode(){
  var m; try{m=localStorage.getItem('g7a-mode');}catch(e){}
  return (m==='post'||m==='pre')?m:'pre';
}
function applyMode(mode){
  var pre=document.querySelector('.lab-prep');
  var post=document.querySelectorAll('.lab-read,.lab-back');
  if(mode==='post'){
    if(pre)pre.hidden=true;
    post.forEach(function(s){s.hidden=false;});
  }else{
    if(pre)pre.hidden=false;
    post.forEach(function(s){s.hidden=true;});
  }
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
  if(typeof EXTRAS_G7A==='undefined'||!EXTRAS_G7A){failScreen();return;}
  var X=EXTRAS_G7A[key];
  if(!X){document.body.innerHTML='<p class="wrap" style="padding:40px">这个板块还在准备中。</p>';return;}

  var secs=(X.sections||[]).map(function(s){
    return renderSection({title:s.title, blocks:s.blocks}, s.lab||'lab-prep');
  }).join('');
  var back=renderPager(key+'.html');
  markVisited(key+'.html');
  try{localStorage.setItem('g7a-last-title',X.title);}catch(e){}

  document.documentElement.lang='zh-CN';
  document.title=X.title+' · 我的语文书房';
  var extraTitle=(X.title.indexOf('《')>=0)?X.title:'《'+X.title+'》';
  setMetaDesc('七年级上册拓展板块'+extraTitle+'：跟着任务动手练，本地保存进度。');
  var extraRoot=document.createElement('div');
  extraRoot.className='app-root';
  extraRoot.innerHTML=extraHeadHTML()
    +'<main id="main" class="wrap lesson-stage">'
    +'<div class="page-head"><div class="eyebrow">'+(X.eyebrow||'拓展板块')+'</div>'
    +'<h1>'+X.title+'</h1>'+(X.lead?'<p class="lead">'+X.lead+'</p>':'')+'</div>'
    +secs+back+'</main>'
    +'<footer class="foot wrap">我的语文书房 · 课前预习 · 课后复习</footer>';
  document.body.appendChild(extraRoot);

  restoreSaved();
  enhanceA11y();
  window.scrollTo(0,0);
}

/* ---------- 本地保存恢复 ---------- */
function restoreSaved(){
  document.querySelectorAll('.answer-box[data-save]').forEach(function(tb){
    var k=tb.getAttribute('data-save');
    try{tb.value=localStorage.getItem(k)||'';}catch(e){}
  });
  document.querySelectorAll('.btn-row[data-save]').forEach(function(g){
    var v; try{v=localStorage.getItem(g.getAttribute('data-save'));}catch(e){}
    if(v){g.querySelectorAll('.choice').forEach(function(c){
      c.setAttribute('aria-pressed', c.getAttribute('data-v')===v?'true':'false');
    });}
  });
  document.querySelectorAll('.readlist').forEach(function(box){
    var rlId=box.getAttribute('id');
    ['read','mark'].forEach(function(k){
      getRLArr(rlId,k).forEach(function(v){
        var b=box.querySelector('.rl-btn[data-k="'+k+'"][data-v="'+v+'"]');
        if(b)b.setAttribute('aria-pressed','true');
      });
    });
    updateReadlistSummary(rlId);
  });
}

/* 渲染后给可点词补键盘可达性与展开状态关联 */
function enhanceA11y(){
  document.querySelectorAll('.word').forEach(function(w){
    w.setAttribute('tabindex','0');
    w.setAttribute('role','button');
    if(!w.getAttribute('aria-label')){w.setAttribute('aria-label', w.textContent);}
    var host=w.closest('.verse,.prose');
    var note=host?host.querySelector('.note-line'):null;
    if(note){
      if(!note.id){note.id='note-'+Math.random().toString(36).slice(2,10);}
      w.setAttribute('aria-controls',note.id);
      w.setAttribute('aria-expanded',w.classList.contains('on')?'true':'false');
    }
  });
  /* 第一次遇到可点词，给一句操作提示，之后不再出现 */
  var firstWord=document.querySelector('.word');
  if(firstWord){
    var seen=false;
    try{seen=localStorage.getItem('gloss-hint-seen')==='1';}catch(e){}
    if(!seen&&!document.querySelector('.gloss-hint')){
      var hint=document.createElement('p');
      hint.className='gloss-hint';
      hint.textContent='带下划线的字词能点，点一下就在原句旁边看释义。';
      var host=firstWord.closest('.verse,.prose');
      if(host&&host.parentNode){host.parentNode.insertBefore(hint,host);}
      try{localStorage.setItem('gloss-hint-seen','1');}catch(e){}
    }
  }
}

/* ---------- 课内步骤展开状态持久化（刷新不丢） ---------- */
function stepStorageKey(){
  var lid=document.body.getAttribute('data-lesson');
  return lid?('g7a-step-'+lid):null;
}
function saveStepState(){
  var key=stepStorageKey();
  if(!key)return;
  var open=[];
  document.querySelectorAll('.step[id]').forEach(function(s){ if(!s.hidden)open.push(s.id); });
  try{localStorage.setItem(key,JSON.stringify(open));}catch(e){}
}
function restoreStepState(){
  var key=stepStorageKey();
  if(!key)return false;
  var raw=localStorage.getItem(key);
  if(raw===null)return false; // 从没存过，保留 data.js 里的默认显隐
  var open=[];
  try{open=JSON.parse(raw);}catch(e){return false;}
  document.querySelectorAll('.step[id]').forEach(function(s){
    s.hidden=open.indexOf(s.id)<0;
  });
  return open.length>0;
}
/* 展开新步骤后滚入视野，焦点落到该步骤标题 */
function bringStepIntoFocus(target){
  if(!target)return;
  target.scrollIntoView({behavior:'smooth',block:'start'});
  var heading=target.querySelector('.step-title')||target;
  if(heading===target&&!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');
  if(heading!==target&&!heading.hasAttribute('tabindex'))heading.setAttribute('tabindex','-1');
  setTimeout(function(){ try{heading.focus({preventScroll:true});}catch(e){} },180);
}
/* 《狼》复盘：把第一步的猜想贴在当前证据旁，允许修正 */
function fillGuessRecall(){
  var slot=document.getElementById('l20-guess-recall');
  if(!slot)return;
  var v;try{v=localStorage.getItem('l20-guess');}catch(e){}
  var labels={gone:'真走了，不用管',trap:'可能有埋伏',unsure:'证据还不够，先不下结论'};
  slot.textContent=v?('你刚才猜：'+(labels[v]||v)+'。下面有新证据，可以改主意。')
    :'你第一步还没选，先看下面的线索，回头再选也来得及。';
}

/* ---------- 观察记录独立参考区（不覆盖提纲） ---------- */
function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function openReference(btn,srcKey,toKey){
  var val;try{val=localStorage.getItem(srcKey);}catch(e){}
  if(!val){
    var old=btn.textContent;
    btn.textContent='还没有观察记录，先去上一页记一笔';
    setTimeout(function(){btn.textContent=old;},2200);
    return;
  }
  var panel=document.getElementById(toKey+'-ref');
  if(!panel){appendReferenceToTarget(toKey,val);return;}
  panel.innerHTML=
    '<h4 class="ref-title">上次的观察记录（参考，不会动你的提纲）</h4>'
    +'<div class="ref-content">'+escapeHtml(val)+'</div>'
    +'<p class="ref-status" id="'+toKey+'-ref-status"></p>'
    +'<div class="ref-actions">'
    +'<button type="button" class="btn solid" data-ref-append="'+toKey+'">追加到提纲末尾</button>'
    +'<button type="button" class="btn" data-ref-copy>复制这段</button>'
    +'<button type="button" class="btn ghost" data-ref-close>收起</button>'
    +'</div>'
    +'<p class="ref-undo" id="'+toKey+'-ref-undo" hidden></p>';
  panel.hidden=false;
  updateRefStatus(toKey);
  panel.scrollIntoView({behavior:'smooth',block:'start'});
}
function updateRefStatus(toKey){
  var st=document.getElementById(toKey+'-ref-status');
  if(!st)return;
  var target=document.querySelector('.answer-box[data-save="'+toKey+'"]');
  var cur=target?target.value:'';
  st.textContent=cur?('你的提纲里已经有 '+cur.length+' 个字，追加只会接在后面，不会盖住。')
    :'提纲还是空的，追加后这段会成为开头。';
}
function appendReferenceToTarget(toKey,val){
  var target=document.querySelector('.answer-box[data-save="'+toKey+'"]');
  if(!target)return;
  var before=target.value;
  var add=before?(before.replace(/\s+$/,'')+'\n'+val):val;
  target.value=add;
  try{localStorage.setItem(toKey,add);}catch(e){}
  var tip=target.parentElement.querySelector('.save-tip');
  if(tip)tip.hidden=false;
  var undo=document.getElementById(toKey+'-ref-undo');
  if(undo){
    undo.hidden=false;
    undo.setAttribute('data-before',before);
    undo.setAttribute('data-added',val);
    undo.setAttribute('data-joined',add);
    undo.innerHTML='已追加到提纲。 <button type="button" class="btn ghost" data-ref-undo="'+toKey+'">撤销刚才的追加</button>';
    updateRefStatus(toKey);
  }
  target.focus();
}
function undoReference(toKey){
  var target=document.querySelector('.answer-box[data-save="'+toKey+'"]');
  var undo=document.getElementById(toKey+'-ref-undo');
  if(!target||!undo)return;
  var before=undo.getAttribute('data-before')||'';
  var joined=undo.getAttribute('data-joined')||'';
  var cur=target.value;
  var next=null;
  if(cur===joined){
    /* 追加后没动过：直接恢复追加前 */
    next=before;
  }else if(cur.indexOf(joined)===0&&cur.length>joined.length){
    /* 追加段后面又写了新内容：只移除追加段，保留后面新写的 */
    var tail=cur.slice(joined.length).replace(/^\n+/,'');
    next=before?(before+(tail?'\n'+tail:'')):tail;
  }
  if(next===null){
    /* 追加段被手动改过，不做破坏性覆盖：给可恢复副本，由用户决定 */
    undo.hidden=false;
    undo.innerHTML='这段被手动改过，撤销可能删掉你新写的内容。 '
      +'<button type="button" class="btn ghost" data-ref-copy-before>复制追加前的提纲</button> '
      +'<button type="button" class="btn ghost" data-ref-undo-force="'+toKey+'">仍要恢复追加前</button>';
    var cb=undo.querySelector('[data-ref-copy-before]');
    if(cb)cb.addEventListener('click',function(){fallbackCopy(before,function(){cb.textContent='已复制';});});
    var fb=undo.querySelector('[data-ref-undo-force]');
    if(fb)fb.addEventListener('click',function(){
      target.value=before;
      try{localStorage.setItem(toKey,before);}catch(e){}
      undo.hidden=true;updateRefStatus(toKey);target.focus();
    });
    return;
  }
  target.value=next;
  try{localStorage.setItem(toKey,next);}catch(e){}
  undo.hidden=true;
  updateRefStatus(toKey);
  target.focus();
}
function fallbackCopy(text,done){
  var ta=document.createElement('textarea');
  ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
  document.body.appendChild(ta);ta.select();
  try{document.execCommand('copy');done();}catch(e){}
  document.body.removeChild(ta);
}
function copyReference(btn){
  var panel=btn.closest('.ref-panel');
  var content=panel?panel.querySelector('.ref-content'):null;
  var text=content?content.textContent:'';
  function done(){var old=btn.textContent;btn.textContent='已复制';setTimeout(function(){btn.textContent=old;},1600);}
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(function(){fallbackCopy(text,done);});
  }else{fallbackCopy(text,done);}
}

/* 整本书篇目清单：已读 / 书签 状态 */
function getRLArr(rlId,k){
  try{return JSON.parse(localStorage.getItem(rlId+'-'+k)||'[]');}catch(e){return [];}
}
function updateReadlistSummary(rlId){
  var total=document.querySelectorAll('#'+rlId+' .rl-item').length;
  var reads=getRLArr(rlId,'read').length;
  var marks=getRLArr(rlId,'mark').length;
  var sum=document.getElementById(rlId+'-sum');
  if(sum){sum.textContent='已读 '+reads+' / '+total+' 篇'+(marks?'，书签 '+marks+' 篇':'');}
}

/* 听同一句两种读法：浏览器自带朗读，目标词放慢 + 视觉高亮 */
function setSpStatus(btn,msg){
  var sp=btn.querySelector('span');
  if(sp)sp.textContent=msg;
}
function speakSentence(box, btn){
  if(!('speechSynthesis' in window)){setSpStatus(btn,'这个浏览器不支持朗读');return;}
  var synth=window.speechSynthesis;
  synth.cancel();
  setSpStatus(btn,'正在准备朗读…');
  var sentence=box.getAttribute('data-sentence');
  var em=btn.getAttribute('data-em');
  box.querySelectorAll('.sp-em').forEach(function(s){
    s.classList.toggle('on', s.getAttribute('data-em')===em);
  });
  function go(){
    var voice=synth.getVoices().filter(function(v){return v.lang==='zh-CN';})[0];
    var esc=em.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    var tokens=sentence.split(new RegExp('('+esc+')','g'));
    var started=false, failed=false;
    var valid=tokens.filter(Boolean);
    valid.forEach(function(tok,i){
      var ut=new SpeechSynthesisUtterance(tok);
      ut.lang='zh-CN';
      if(voice)ut.voice=voice;
      if(tok===em)ut.rate=0.72;
      ut.onstart=function(){if(!started){started=true;setSpStatus(btn,'正在朗读…');}};
      ut.onerror=function(){failed=true;setSpStatus(btn,'无法朗读');};
      ut.onend=function(){if(i===valid.length-1&&!failed)setSpStatus(btn,'再听一次');};
      synth.speak(ut);
    });
  }
  if(synth.getVoices().length){go();return;}
  var settled=false;
  function tryGo(){
    if(settled)return;
    if(synth.getVoices().length){settled=true;go();}
  }
  if(synth.addEventListener){synth.addEventListener('voiceschanged',tryGo);}
  setTimeout(function(){
    if(settled)return;
    if(synth.getVoices().length){tryGo();}
    else{settled=true;setSpStatus(btn,'无法朗读');}
  },1500);
}

/* ---------- 统一交互（事件委托） ---------- */
document.addEventListener('input',function(e){
  var tb=e.target.closest('.answer-box[data-save]');
  if(tb){
    var ok=false;
    try{localStorage.setItem(tb.getAttribute('data-save'),tb.value);ok=true;}catch(err){}
    var tipHost=tb.closest('.two-draft')||tb.parentElement;
    var tip=tipHost.querySelector('.save-tip');
    if(tip){tip.hidden=!ok;}
    var fail=tipHost.querySelector('.save-fail');
    if(ok){
      if(fail)fail.hidden=true;
    }else{
      if(!fail){
        fail=document.createElement('p');
        fail.className='save-fail';
        fail.innerHTML='这次没存下来，浏览器不让写本地记录。 <button type="button" class="btn ghost fail-copy">复制这份草稿</button>';
        fail.querySelector('.fail-copy').addEventListener('click',function(){
          var btn=this;
          fallbackCopy(tb.value,function(){btn.textContent='已复制';});
        });
        tipHost.appendChild(fail);
      }
      fail.hidden=false;
    }
  }
});

document.addEventListener('keydown',function(e){
  if(e.key!=='Enter'&&e.key!==' '&&e.key!=='Spacebar')return;
  var w=e.target.closest('.word');
  if(w){e.preventDefault();w.click();}
});

document.addEventListener('click',function(e){
  var node=e.target;

  // 可点词
  var w=node.closest('.word');
  if(w){
    var host=w.closest('.verse,.prose');
    if(host){
      host.querySelectorAll('.word').forEach(function(x){
        if(x!==w){x.classList.remove('on');x.setAttribute('aria-expanded','false');}
      });
      w.classList.toggle('on');
      var note=host.querySelector('.note-line');
      var won=w.classList.contains('on');
      if(note){
        if(won){
          note.innerHTML=w.getAttribute('data-note')||'';
          /* 释义就近插到词所在行后面，原词、原句和释义同区，不用滚到篇末 */
          var line=w.closest('.verse-line,p');
          if(line&&line.parentNode===host){line.insertAdjacentElement('afterend',note);}
          else{host.insertBefore(note,w.closest('.verse-line,p')||null);}
        }else{
          note.innerHTML='';
        }
      }
      w.setAttribute('aria-expanded',won?'true':'false');
    }
    return;
  }

  // 观察记录：进独立参考区，不覆盖提纲
  var bringBtn=node.closest('[data-bring]');
  if(bringBtn){
    openReference(bringBtn,bringBtn.getAttribute('data-bring'),bringBtn.getAttribute('data-bring-to'));
    return;
  }

  // 参考区按钮：追加 / 复制 / 收起 / 撤销
  var refAppend=node.closest('[data-ref-append]');
  if(refAppend){
    var toKey=refAppend.getAttribute('data-ref-append');
    var srcVal;try{srcVal=localStorage.getItem('t5b-try');}catch(e){}
    var panel=document.getElementById(toKey+'-ref');
    var rc=panel?panel.querySelector('.ref-content'):null;
    appendReferenceToTarget(toKey,rc?rc.textContent:srcVal||'');
    return;
  }
  var refUndo=node.closest('[data-ref-undo]');
  if(refUndo){undoReference(refUndo.getAttribute('data-ref-undo'));return;}
  var refCopy=node.closest('[data-ref-copy]');
  if(refCopy){copyReference(refCopy);return;}
  if(node.closest('[data-ref-close]')){
    var rp=node.closest('.ref-panel');
    if(rp)rp.hidden=true;
    return;
  }

  // 双稿：把初稿复制到空白修改稿，可撤回（不覆盖已有修改稿）
  var draftCopy=node.closest('[data-draft-copy]');
  if(draftCopy){
    var dbox=document.getElementById(draftCopy.getAttribute('data-draft-copy'));
    var dtas=dbox.querySelectorAll('textarea.answer-box');
    var d1=dtas[0],d2=dtas[1];
    function flash(btn,msg){var old=btn.textContent;btn.textContent=msg;setTimeout(function(){btn.textContent=old;},1800);}
    if(!d1.value){flash(draftCopy,'初稿还是空的，先写一句');return;}
    if(d2.value){flash(draftCopy,'修改稿已有内容，没动它');return;}
    dbox.setAttribute('data-prev-d2',d2.value);
    d2.value=d1.value;
    try{localStorage.setItem(d2.getAttribute('data-save'),d2.value);}catch(err){}
    var dUndo=dbox.querySelector('[data-draft-undo]');
    if(dUndo)dUndo.hidden=false;
    d2.focus();
    return;
  }
  var draftUndo=node.closest('[data-draft-undo]');
  if(draftUndo){
    var ubox=document.getElementById(draftUndo.getAttribute('data-draft-undo'));
    var utas=ubox.querySelectorAll('textarea.answer-box');
    var ud2=utas[1];
    ud2.value=ubox.getAttribute('data-prev-d2')||'';
    try{localStorage.setItem(ud2.getAttribute('data-save'),ud2.value);}catch(err){}
    draftUndo.hidden=true;
    ud2.focus();
    return;
  }

  // 统一三阶段导航：切模式 + 滚动定位 + 焦点 + 可复制地址
  var stageLink=node.closest('.inpage-nav a[data-stage]');
  if(stageLink){
    e.preventDefault();
    var stageMode=stageLink.getAttribute('data-stage');
    var targetId=stageLink.getAttribute('data-target');
    try{localStorage.setItem('g7a-mode',stageMode);}catch(err){}
    applyMode(stageMode);
    setActiveStage(targetId);
    var stageTarget=document.getElementById(targetId);
    if(stageTarget){
      stageTarget.scrollIntoView({behavior:'smooth',block:'start'});
      var label=stageTarget.querySelector('.section-label');
      if(label){
        if(!label.hasAttribute('tabindex'))label.setAttribute('tabindex','-1');
        setTimeout(function(){try{label.focus({preventScroll:true});}catch(err){}},200);
      }
    }
    try{history.replaceState(null,'','#'+targetId);}catch(err){}
    return;
  }

  // 同屏对比切换
  var ctab=node.closest('.cmp-tab');
  if(ctab){
    var cid=ctab.getAttribute('data-cmp');
    document.querySelectorAll('.cmp-tab[data-cmp="'+cid+'"]').forEach(function(t){t.setAttribute('aria-pressed','false');});
    ctab.setAttribute('aria-pressed','true');
    document.querySelectorAll('#'+cid+' .cmp-panel').forEach(function(p){p.hidden=true;});
    var cp=document.getElementById(cid+'-'+ctab.getAttribute('data-v'));
    if(cp)cp.hidden=false;
    return;
  }

  // 翻转卡
  var flip=node.closest('.flip button');
  if(flip){
    var flipped=flip.classList.toggle('flipped');
    flip.setAttribute('aria-pressed', flipped?'true':'false');
    var bk=flip.querySelector('.face.back');
    if(bk){bk.setAttribute('aria-hidden', flipped?'false':'true');}
    return;
  }

  // 整本书篇目：已读 / 书签
  var rlb=node.closest('.rl-btn');
  if(rlb){
    var rlId=rlb.getAttribute('data-rl');
    var rv=rlb.getAttribute('data-v');
    var rk=rlb.getAttribute('data-k');
    var arr=getRLArr(rlId,rk);
    var ri=arr.indexOf(rv);
    var ron;
    if(ri>=0){arr.splice(ri,1);ron=false;}else{arr.push(rv);ron=true;}
    try{localStorage.setItem(rlId+'-'+rk,JSON.stringify(arr));}catch(err){}
    rlb.setAttribute('aria-pressed',ron?'true':'false');
    updateReadlistSummary(rlId);
    return;
  }

  // 听两种读法
  var spb=node.closest('.sp-btn');
  if(spb){
    var spbox=document.getElementById(spb.getAttribute('data-sp'));
    if(spbox)speakSentence(spbox,spb);
    return;
  }

  // 猜想按钮（同组互斥）
  var ch=node.closest('.choice');
  if(ch){
    var group=ch.parentElement;
    var on=ch.getAttribute('aria-pressed')==='true';
    group.querySelectorAll('.choice').forEach(function(c){c.setAttribute('aria-pressed','false');});
    if(!on){ch.setAttribute('aria-pressed','true');}
    var sk=group.getAttribute('data-save');
    if(sk){try{localStorage.setItem(sk, on?'':ch.getAttribute('data-v'));}catch(err){}}
    return;
  }

  // 通用显示/隐藏/揭示/切换
  var act=node.closest('[data-show],[data-hide],[data-reveal],[data-toggle],[data-post]');
  if(act){
    if(act.hasAttribute('data-post')){
      try{localStorage.setItem('g7a-mode','post');}catch(err){}
      applyMode('post');
      setActiveStage('sec-read');
      try{history.replaceState(null,'','#sec-read');}catch(err){}
    }
    var firstShown=null;
    if(act.getAttribute('data-show')){
      document.querySelectorAll(act.getAttribute('data-show')).forEach(function(x){
        if(x.hidden&&!firstShown)firstShown=x;
        x.hidden=false;
      });
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
    saveStepState();
    if(firstShown&&firstShown.classList.contains('step'))bringStepIntoFocus(firstShown);
  }
});

function failScreen(){
  document.documentElement.lang='zh-CN';
  document.body.innerHTML='<main class="wrap" style="padding:60px 20px">'
    +'<h1 style="font-family:songti sc,serif">这一页没读出来</h1>'
    +'<p style="margin-top:12px;color:var(--muted)">多半是网络断了一下，或者浏览器缓存出了问题。先刷新试试，还不行就重新打开这个页面。</p>'
    +'<p style="margin-top:18px"><a class="btn solid" href="index.html">回七上目录</a></p></main>';
}

function clearBootSkeleton(){
  window.__G7A_BOOTED=true;
  var sk=document.getElementById('boot-skeleton');
  if(sk&&sk.parentNode)sk.parentNode.removeChild(sk);
}
function safeStart(){
  clearBootSkeleton();
  try{
    if(document.body.getAttribute('data-lesson')){renderLesson();}
    else if(document.body.getAttribute('data-extra')){renderExtra();}
  }catch(err){failScreen();}
}
safeStart();
