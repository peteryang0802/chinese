/* ============================================================
   共享渲染器与交互 common.js
   课文薄页面只需 <body data-lesson="l1">，由本脚本渲染并绑定交互
   ============================================================ */

var BOOK = (typeof BOOK_G7A!=='undefined') ? BOOK_G7A : null;
var LESSONS = (typeof LESSONS_G7A!=='undefined') ? LESSONS_G7A : null;

function parentResetEpoch(){
  try{return localStorage.getItem('school-parent:reset:chinese');}catch(e){return null;}
}
var openedLearningEpoch=parentResetEpoch();
function currentLearningEpoch(){
  var epoch=parentResetEpoch();
  return openedLearningEpoch===epoch&&!(epoch&&epoch.startsWith('pending:'));
}
window.addEventListener('parent-learning-reset',function(event){
  if(event.detail?.subject==='chinese'&&event.detail.phase==='failed')openedLearningEpoch=parentResetEpoch();
});


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

/* 只记真实学习动作。打开一页看看，不覆盖上次学习的位置。 */
function rememberLearning(){
  if(!learningPath||!currentLearningEpoch())return;
  try{
    localStorage.setItem('g7a-last',learningPath);
    localStorage.setItem('g7a-last-title',learningTitle);
    localStorage.setItem('g7a-learning-check:resume:'+learningPath,'1');
  }catch(e){}
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

function renderBlock(b, material){
  var nearby=material||'';
  switch(b.t){
    case 'step':
      return '<section class="step"'+(b.id?' id="'+b.id+'"':'')+(b.hidden?' hidden':'')+'>'
        +(b.title?'<h3 class="step-title">'+b.title+'</h3>':'')
        +b.blocks.map(function(block){return renderBlock(block);}).join('')+'</section>';
    case 'compare':
      var selected=b.options[0].v;
      if(b.save){
        selected='';
        try{selected=localStorage.getItem(b.save)||'';}catch(e){}
      }
      var ctabs=b.options.map(function(o){
        return '<button type="button" class="cmp-tab" data-cmp="'+b.id+'" data-v="'+o.v
          +'" aria-pressed="'+(selected===o.v)+'">'+o.label+'</button>';
      }).join('');
      var cpanels=b.options.map(function(o){
        var result=o.result?' data-result="'+o.result+'"':'';
        return '<div class="cmp-panel" id="'+b.id+'-'+o.v+'"'+result+(selected===o.v?'':' hidden')+'>'
          +(o.svg||'')+(o.note?'<p class="cmp-note">'+o.note+'</p>':'')+'</div>';
      }).join('');
      return '<div class="compare" id="'+b.id+'"'+(b.save?' data-compare-save="'+b.save+'"':'')+'>'
        +'<div class="cmp-tabs" role="group" aria-label="切换对比">'+ctabs+'</div>'+cpanels
        +(b.options.some(o=>o.result)?'<p class="learning-state" role="status" data-compare-status></p>':'')+'</div>';
    case 'twodraft':
      var tdAskId=b.id+'-ask';
      var tdAsk=b.ask?'<p class="guess-ask" id="'+tdAskId+'">'+b.ask+'</p>':'';
      return '<div class="two-draft" id="'+b.id+'">'
        +tdAsk+nearby
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
        +'<p class="save-tip" hidden>草稿已保存在本浏览器</p></div>';
    case 'readlist':
      var rlrows=b.items.map(function(it){
        return '<li class="rl-item"><span class="rl-name">'+it.label+'</span>'
          +'<button type="button" class="rl-btn" data-rl="'+b.id+'" data-v="'+it.v+'" data-k="read" aria-pressed="false">已读</button>'
          +'<button type="button" class="rl-btn" data-rl="'+b.id+'" data-v="'+it.v+'" data-k="mark" aria-pressed="false">书签</button></li>';
      }).join('');
      return '<details class="readlist learning-extra" id="'+b.id+'" data-save="'+b.id+'">'
        +'<summary>展开篇目和阅读进度</summary><p class="rl-summary" id="'+b.id+'-sum"></p>'
        +'<ul>'+rlrows+'</ul></details>';
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
      return '<p class="big-q" id="'+qid+'">'+b.q+'</p>'+nearby
        +'<textarea class="answer-box" data-save="'+b.save+'" aria-labelledby="'+qid+'" placeholder="'+placeholderFor(b.q,b.ph)+'"></textarea>'
        +'<p class="save-tip" hidden>草稿已保存在本浏览器</p>'+renderPreviousAnswer(b.previous);
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

function renderPreviousAnswer(previous){
  if(!previous)return '';
  var answer='';
  try{answer=localStorage.getItem(previous.save)||'';}catch(e){}
  return answer?'<details class="learning-extra"><summary>回看以前的作答</summary>'
    +'<p>'+escapeHtml(previous.question)+'</p><p class="learning-old-answer">'+escapeHtml(answer)+'</p></details>':'';
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

function renderSection(sec, labClass, id, material, review){
  if(!sec)return '';
  var question=sec.blocks.findIndex(function(block){return block.t==='bigq'||block.t==='twodraft';});
  return '<section data-learning-pane class="section-wrap '+labClass+'" id="'+id+'" hidden>'
    +'<h2 class="section-label" tabindex="-1">'+sec.title+'</h2>'
    +'<div class="panel">'+sec.blocks.map(function(block,index){
      var content=renderBlock(block,index===question?material:undefined);
      if(block.t==='cards'&&sec.blocks.length>1){
        content='<details class="learning-extra"><summary>看词句与写法提示</summary>'+content+'</details>';
      }
      return content;
    }).join('')+'</div>'+(review&&question>=0?learningReview.render(review,escapeHtml):'')+'</section>';
}

function headHTML(href){
  var directoryHref='index.html#entry-'+href.replace(/\.html$/,'');
  return '<a class="skip" href="#main">跳到正文</a>'
    +'<header class="site-head"><div class="wrap row"><span class="brand">'
    +'<svg class="logo" viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" rx="8" fill="#f4ecd8"/>'
    +'<path d="M9 8h16v18H9z" fill="#1d2a33"/><path d="M17 8v18" stroke="#f4ecd8" stroke-width="1.4"/></svg>'
    +'我的语文书房</span><a class="learning-directory" href="'+directoryHref+'">← 七上目录</a></div></header>';
}

var learningAnswers={};

function learningChoiceItem(key){
  var [phase,id]=key.split(':');
  if(phase==='short-open')return SHORT_LESSONS_G7A[id].open;
  return phase==='open'?FLOW_OPENERS_G7A[id]:phase==='read'?FLOW_READING_CHECKS_G7A[id]:FLOW_CHECKS_G7A[id];
}

function selectLearningAnswer(fieldset,state){
  var key=fieldset.dataset.learningChoice;
  learningAnswers[key]=state;
  try{localStorage.setItem('g7a-learning-check:'+key,JSON.stringify(state));}catch(e){}
  paintLearningChoice(fieldset);
  updateLearningAction();
}

function renderLearningChoice(item,key,method){
  var saved=null;
  try{saved=JSON.parse(localStorage.getItem('g7a-learning-check:'+key));}catch(e){}
  learningAnswers[key]=learningCheck.restore(saved,item[2].length);
  var evidence=item[5]||[];
  var instant=key.startsWith('short-open:');
  return '<fieldset class="learning-quick" data-learning-choice="'+key+'"'+(instant?' data-instant-choice':'')+'>'
    +'<legend>'+escapeHtml(item[1])+'</legend>'
    +(evidence.length?'<div class="learning-material">'+evidence.map(function(line){
      return '<p>'+escapeHtml(line)+'</p>';
    }).join('')+'</div>':'')
    +'<div class="learning-quick-options">'+item[2].map(function(option,index){
      return '<button type="button" data-choice-index="'+index+'" aria-pressed="false">'+escapeHtml(option)+'</button>';
    }).join('')+'</div>'
    +(item[3]===null||instant?'':'<p class="learning-state" role="status"></p>')
    +'<p class="learning-choice-note" role="status"></p>'
    +(method?'<details class="learning-extra" data-learning-hint><summary>卡住时看方法</summary>'
      +'<p class="learning-method">'+escapeHtml(method)+'</p></details>':'')+'</fieldset>';
}

function paintLearningChoice(fieldset){
  var key=fieldset.dataset.learningChoice;
  var item=learningChoiceItem(key);
  var state=learningAnswers[key];
  var passed=learningCheck.passed(state);
  var instant=fieldset.hasAttribute('data-instant-choice');
  fieldset.querySelectorAll('[data-choice-index]').forEach(function(button,index){
    button.setAttribute('aria-pressed',String(index===state.choice));
    button.disabled=passed||(!instant&&state.status==='retry');
  });
  var feedback=fieldset.querySelector('.learning-choice-note');
  if(item[3]===null){
    feedback.textContent=item[4][state.choice]||'';
    return;
  }
  if(instant){
    feedback.dataset.result=passed?'correct':state.status==='retry'?'retry':'';
    feedback.textContent=passed?item[4]:state.status==='retry'?item[6]:'';
    return;
  }
  var help=fieldset.querySelector('[data-learning-hint]');
  var hint=help?.querySelector('p').textContent||'再读一遍题目。先指出题目让你找什么，再看每项有没有贴着材料。';
  var status=fieldset.querySelector('.learning-state');
  status.textContent=learningCheck.label(state,key.startsWith('check:'));
  fieldset.dataset.checkStatus=state.status;
  feedback.dataset.result=passed?'correct':state.helped||state.status==='retry'?'retry':'';
  feedback.textContent=passed?item[4]:state.skipped?'已留到下次。仍可回到这道题重试。':state.helped?hint:'';
  if(help)help.hidden=passed||state.helped||state.status==='retry';
}

function renderCore(id, prep){
  var opener=FLOW_OPENERS_G7A[id];
  var task=opener?renderLearningChoice(opener,'open:'+id):prep.blocks.filter(function(block){
    return block.t!=='buttons';
  }).map(function(block){return renderBlock(block);}).join('');
  return '<section id="sec-prep" class="learning-core" data-learning-pane hidden>'
    +'<h2 class="section-label" tabindex="-1">'+(opener?escapeHtml(opener[0]):'判断狼的下一步')+'</h2>'
    +task+'</section>';
}

function renderRecap(id,method){
  return '<section class="learning-recap" id="sec-recap" data-learning-pane hidden>'
    +'<h2 class="section-label" tabindex="-1">换一份材料试方法</h2>'
    +renderLearningChoice(FLOW_CHECKS_G7A[id],'check:'+id,method)+'</section>';
}

function renderLearningControls(href){
  var seq=buildSequence();
  var index=seq.findIndex(function(item){return item.href===href;});
  var next=index>=0?seq[index+1]:null;
  return '<div class="learning-controls">'
    +'<button id="learning-back" class="learning-back" type="button" data-learning-go="" hidden>← 上一步</button>'
    +'<button id="learning-check" class="learning-action" type="button" hidden></button>'
    +'<button id="learning-next" type="button" data-learning-go="" class="learning-action" hidden></button>'
    +'<a id="learning-finish" href="'+(next?next.href:'index.html')+'" class="learning-action" hidden>'
    +(next?'下一项 · '+escapeHtml(next.title)+' →':'回七上目录 →')+'</a></div>';
}

var learningStages=[];
var learningIndex=0;
var learningPath='';
var learningTitle='';
var learningAliases={};

function mountLearning(title, eyebrow, lead, stages, sections, href, activities, aliases = {}, shortWriting){
  var root=document.createElement('div');
  root.className='app-root';
  root.innerHTML=headHTML(href)
    +'<main id="main" class="wrap lesson-stage guided-flow">'
    +'<div class="page-head"><div class="eyebrow">'+eyebrow+'</div><h1>'+title+'</h1>'
    +(lead?'<p class="lead">'+lead+'</p>':'')+'</div>'
    +'<div class="learning-layout">'+learningRail.render(stages)+'<div class="learning-content">'
    +sections+renderLearningControls(href)+'</div></div></main>'
    +'<footer class="foot wrap">我的语文书房 · 七年级上册</footer>';
  document.body.classList.add('guided-learning');
  document.body.appendChild(root);
  learningPath=href;
  learningTitle=title;
  learningStages=stages;
  learningAliases=aliases;
  activities?.forEach(function(activity){
    learningEvidence.connect(el(activity.id),activity,'g7a-learning-check:evidence:'+href+':'+activity.id,updateLearningAction,currentLearningEpoch);
  });
  restoreSaved();
  root.querySelectorAll('[data-compare-status]').forEach(bindGradedComparison);
  root.querySelectorAll('[data-self-review]').forEach(function(review){
    var section=review.closest('[data-learning-pane]');
    learningReview.connect(section,'g7a-learning-check:self:',updateLearningAction,currentLearningEpoch,
      section.classList.contains('short-writing')?shortWriting:undefined);
  });
  root.querySelectorAll('[data-learning-choice]').forEach(function(fieldset){
    paintLearningChoice(fieldset);
    var hint=fieldset.querySelector('[data-learning-hint]');
    hint?.addEventListener('toggle',function(){
      var state=learningAnswers[fieldset.dataset.learningChoice];
      if(hint.open&&currentLearningEpoch()&&!state.helped&&!learningCheck.passed(state)){
        learningAnswers[fieldset.dataset.learningChoice]={ ...state, helped:true };
        try{localStorage.setItem('g7a-learning-check:'+fieldset.dataset.learningChoice,JSON.stringify(learningAnswers[fieldset.dataset.learningChoice]));}catch(e){}
      }
    });
  });
  enhanceA11y();
  restoreStepState();
  fillGuessRecall();

  var stored='';
  try{stored=localStorage.getItem('g7a-learning-stage:'+href)||'';}catch(e){}
  var linked=learningHash();
  activateLearningStage(linked||learningAliases[stored]||stored||stages[0].id,Boolean(linked),false);
}

function learningHash(){
  var raw=location.hash.slice(1);
  var id=learningAliases[raw]||raw;
  return learningStages.some(function(stage){return stage.id===id;})?id:'';
}

function activateLearningStage(id, focus, updateUrl){
  var index=learningStages.findIndex(function(stage){return stage.id===id;});
  learningIndex=Math.max(0,index);
  var stage=learningStages[learningIndex];
  if(!stage)return;
  document.querySelectorAll('[data-learning-pane]').forEach(function(pane){pane.hidden=pane.id!==stage.id;});
  learningRail.update(document.querySelector('.learning-rail'),learningStages,learningIndex);
  if(currentLearningEpoch()){
    try{localStorage.setItem('g7a-learning-stage:'+learningPath,stage.id);}catch(e){}
  }
  if(updateUrl)history.replaceState(null,'','#'+stage.id);
  var carry=el('walk-choice-carry');
  if(carry){
    var route=FLOW_OPENERS_G7A.l6[2][learningAnswers['open:l6']?.choice];
    carry.hidden=!route;
    if(route)carry.textContent='刚才你选择了“'+route.replace(/。$/,'')+'”。对照原文，找出“我”和母亲分别怎样决定。';
  }
  updateLearningAction();
  if(focus){
    var heading=el(stage.id).querySelector('.section-label');
    if(heading)heading.focus({preventScroll:true});
  }
  window.scrollTo(0,0);
}

function currentActivity(pane){
  return globalThis.learningEvidence?.activity(pane)||globalThis.learningReview?.activity(pane)
    ||pane.querySelector('[data-compare-status]')?.parentElement.reviewActivity;
}

function bindGradedComparison(statusLine){
  var group=statusLine.parentElement;
  var choices=Array.from(group.querySelectorAll('.cmp-tab'));
  var storage='g7a-learning-check:compare:'+group.id;
  var saved;
  try{saved=JSON.parse(localStorage.getItem(storage));}catch(e){}
  var state=learningCheck.restore(saved,choices.length);
  if(!saved&&choices.some(choice=>choice.getAttribute('aria-pressed')==='true'))state.helped=true;
  function paint(){
    statusLine.textContent=learningCheck.label(state);
    choices.forEach(function(choice){
      choice.disabled=learningCheck.passed(state)||state.status==='retry';
    });
  }
  function update(next){
    state=next;
    try{localStorage.setItem(storage,JSON.stringify(state));}catch(e){}
    paint();updateLearningAction();
  }
  group.reviewActivity={
    get status(){return state.status;},
    get passed(){return learningCheck.passed(state);},
    get ready(){return state.status==='retry';},
    get label(){return state.status==='retry'?'按线索再试':'先选一个词';},
    select(choice,panel){
      var index=choices.indexOf(choice);
      update(learningCheck.outcome({ ...state, choice:index },panel.dataset.result==='correct'));
    },
    check(){
      update({ ...state, status:'unchecked' });
      choices[state.choice]?.focus();
    },
  };
  paint();
}

function updateLearningAction(){
  if(!learningStages.length)return;
  var current=el(learningStages[learningIndex].id);
  var linkedReturn=current.querySelector('.lesson-evidence .return-to-skill');
  var backButton=el('learning-back');
  backButton.hidden=learningIndex===0||Boolean(linkedReturn);
  if(learningIndex>0)backButton.dataset.learningGo=learningStages[learningIndex-1].id;
  var required=null;
  current.querySelectorAll('.btn.primary[data-show]').forEach(function(button){
    var target=document.querySelector(button.getAttribute('data-show'));
    var step=button.closest('.step');
    var available=target&&target.hidden&&(!step||!step.closest('[hidden]'));
    button.hidden=!available||Boolean(required)||Boolean(linkedReturn);
    if(!button.hidden)required=button;
  });
  var next=learningStages[learningIndex+1];
  var nextButton=el('learning-next');
  var quick=current.querySelector('[data-learning-choice]');
  var state=quick&&learningAnswers[quick.dataset.learningChoice];
  var scored=quick&&learningChoiceItem(quick.dataset.learningChoice)[3]!==null;
  var activity=currentActivity(current);
  var pending=activity?!activity.passed:scored&&!learningCheck.passed(state);
  var needsChoice=activity?pending:Boolean(state&&(scored?pending:state.choice===null));
  var wolfChoice=current.querySelector('#l20-guess');
  if(wolfChoice&&!wolfChoice.querySelector('[aria-pressed="true"]'))needsChoice=true;
  var checkButton=el('learning-check');
  checkButton.hidden=Boolean(required)||Boolean(linkedReturn)||!pending||Boolean(quick?.hasAttribute('data-instant-choice'));
  checkButton.disabled=activity?!activity.ready&&activity.status!=='retry':!state||state.choice===null&&state.status!=='retry';
  checkButton.textContent=activity?.label||((activity?.status??state?.status)==='retry'?'按线索再试':'核对答案');
  nextButton.hidden=Boolean(required)||Boolean(linkedReturn)||needsChoice||!next;
  if(next){
    nextButton.dataset.learningGo=next.id;
    nextButton.textContent=next.action+' →';
  }
  el('learning-finish').hidden=Boolean(required)||Boolean(linkedReturn)||Boolean(next)||needsChoice;
}

window.addEventListener('hashchange',function(){
  if(!currentLearningEpoch())return;
  var linked=learningHash();
  if(linked)activateLearningStage(linked,true,false);
});

var longerReadings={
  l1: [[2,'比较“钻”和“长”'],[5,'读出五幅春景的写法']],
  l4: [[1,'读《观沧海》'],[1,'读《次北固山下》'],[1,'读《闻王昌龄左迁龙标遥有此寄》'],[1,'读《天净沙·秋思》']],
  l8: [[2,'读《咏雪》'],[2,'读《陈太丘与友期行》']],
  l12: [[3,'读第一至三章'],[3,'读第四至六章'],[3,'读第七至九章'],[4,'读第十至十二章']],
  l15: [[2,'读小序和第一首'],[1,'读第二首'],[2,'读第三首']],
  l24: [[1,'读两则外国寓言'],[1,'读《穿井得一人》'],[2,'读《杞人忧天》']]
};

function renderReading(id, reading, stages){
  var groups=longerReadings[id]||[[reading.blocks.length,FLOW_READ_ACTIONS_G7A[id]]];
  var offset=0;
  return groups.map(function(group,index){
    var stageId=index===0?'sec-read':'sec-read-'+(index+1);
    var blocks=reading.blocks.slice(offset,offset+group[0]);
    offset+=group[0];
    stages.push({id:stageId,title:group[1],action:group[1]});
    var check=index===0&&FLOW_READING_CHECKS_G7A[id];
    if(check){
      return '<section class="section-wrap lab-read" id="'+stageId+'" data-learning-pane hidden>'
        +'<h2 class="section-label" tabindex="-1">'+escapeHtml(group[1])+'</h2>'
        +'<p class="learning-material" id="walk-choice-carry" hidden></p>'
        +'<div class="reading-step-check">'+renderLearningChoice(check,'read:'+id)+'</div>'
        +'<details class="learning-extra"><summary>展开原文选段与词句</summary>'
        +blocks.map(function(block){return renderBlock(block);}).join('')+'</details></section>';
    }
    return renderSection({title:groups.length===1?reading.title:group[1],blocks:blocks},'lab-read',stageId);
  }).join('');
}

function renderLesson(){
  var id=document.body.dataset.lesson;
  var lesson=LESSONS&&LESSONS[id];
  if(!lesson||!BOOK){failScreen();return;}
  var current=BOOK.units.flatMap(function(unit){return unit.lessons;}).find(function(item){return item.id===id;});
  var href='lesson-'+pad(current.no)+'.html';
  document.title=current.title+' · 我的语文书房';
  setMetaDesc('七年级上册《'+current.title+'》逐步学习。带着核心问题读课文，用材料练，再回顾方法。');

  var shortLesson=globalThis.learningReview&&globalThis.learningEvidence
    &&typeof SHORT_LESSONS_G7A!=='undefined'&&SHORT_LESSONS_G7A[id];
  if(shortLesson){
    renderShortLesson(id,current,lesson,href,shortLesson);
    return;
  }
  var guide=FLOW_GUIDES_G7A[id];
  var activities=courseActivities(id);
  var stages=[{id:'sec-prep',title:FLOW_OPENERS_G7A[id]?.[0]||'判断狼的下一步'}];
  var reading=renderReading(id,lesson.read,stages);
  var apply=activities?appendEvidenceStage(stages,activities[0]):'';
  var evidence=renderInlineMaterial(guide[2]);
  var practice=lesson.back.blocks.map(function(block,index){
    var first=index===0;
    var stageId=first?'sec-back':'sec-back-'+(index+1);
    var focused=FLOW_WRITING_TASKS_G7A[id]?.[index];
    var title=focused?.[0]||(first?(id==='l6'?'用原句说明理由':'用课文找依据'):'换角度再作答');
    var exercise=focused?{
      ...block,
      q:focused[1],
      save:'g7a-learning-answer:'+id+':'+index,
      previous:{save:block.save,question:block.q},
    }:block;
    stages.push({id:stageId,title:title,action:title});
    return renderSection({title:focused?title:first?lesson.back.title:title,blocks:[exercise]},'lab-back',stageId,
      first||id==='l4'?evidence:undefined,courseReview(id,index));
  }).join('');
  var recap=activities?appendEvidenceStage(stages,activities[1]):appendRecap(stages,id,guide[3]);
  var sections=renderCore(id,lesson.prep)+reading+apply+practice+recap;
  var author=current.author||lesson.author;
  var eyebrow=(lesson.kind||current.type||'课文')+(author?' · '+author:'');
  mountLearning(current.title,eyebrow,lesson.lead,stages,sections,href,activities);
}

function renderShortLesson(id,current,lesson,href,sample){
  var stages=[{id:'sec-prep',title:sample.open[0]}];
  var opening='<section class="learning-core" id="sec-prep" data-learning-pane hidden>'
    +'<h2 class="section-label" tabindex="-1">'+escapeHtml(sample.open[0])+'</h2>'
    +renderLearningChoice(sample.open,'short-open:'+id)+'</section>';
  var excerpts=lesson.read.blocks.flatMap(function(block){
    if(block.t==='step')return block.blocks.filter(function(entry){return entry.t==='verse'||entry.t==='scene';});
    return ['prose','verse','cards','html','scene'].includes(block.t)?[block]:[];
  });
  var more='<details class="learning-extra"><summary>展开课文选段与词句</summary>'
    +excerpts.map(function(block){return renderBlock(block);}).join('')+'</details>';
  var study=appendEvidenceStage(stages,sample.study,more);
  var oldDrafts=lesson.back.blocks.filter(block=>block.save)
    .flatMap(function(block,index){
      var earlier=(typeof FLOW_WRITING_TASKS_G7A!=='undefined'&&FLOW_WRITING_TASKS_G7A[id]?.[index]);
      return [
        ...(earlier?[{save:'g7a-learning-answer:'+id+':'+index,question:earlier[1]}]:[]),
        {save:block.save,question:block.q},
        ...(block.previous?[block.previous]:[]),
      ];
    });
  var writing=appendShortWriting(stages,sample.write,'sec-recap','g7a-learning-answer:short:'+id,
    oldDrafts);
  var aliases={'sec-read-2':'sec-read','sec-apply':'sec-read','sec-back':'sec-recap','sec-back-2':'sec-recap'};
  var author=current.author||lesson.author;
  mountLearning(current.title,(lesson.kind||current.type)+(author?' · '+author:''),'',stages,
    opening+study+writing,href,[sample.study],aliases,sample.write);
}

function appendShortWriting(stages,task,id,save,previous = []){
  stages.push({id,title:task.title,action:task.title});
  var material='<div class="learning-material">'+task.material.map(line=>'<p>'+escapeHtml(line)+'</p>').join('')+'</div>';
  var question={t:'bigq',q:escapeHtml(task.prompt),ph:escapeHtml(task.placeholder),save};
  var old=previous.map(renderPreviousAnswer).join('');
  var blocks=old?[question,{t:'html',h:old}]:[question];
  return renderSection({title:escapeHtml(task.title),blocks},'lab-back short-writing',id,material,task);
}

function renderInlineMaterial(clue){
  return '<details class="learning-inline"><summary>看答题线索</summary>'
    +'<p class="learning-material">'+escapeHtml(clue)+'</p></details>';
}

function appendEvidenceStage(stages,activity,more = ''){
  stages.push({id:activity.id,title:activity.title,action:activity.title});
  var draft=activity.draft?'<details class="learning-extra" data-evidence-draft hidden><summary>用自己的话写一句（选做）</summary>'
    +renderBlock(activity.draft)+'</details>':'';
  return '<section class="section-wrap evidence-stage" id="'+activity.id+'" data-learning-pane hidden>'
    +'<h2 class="section-label" tabindex="-1">'+escapeHtml(activity.title)+'</h2>'
    +learningEvidence.render(activity,escapeHtml)+draft+more+'</section>';
}

function appendRecap(stages,id,method){
  stages.push({id:'sec-recap',title:FLOW_CHECKS_G7A[id][0],action:'换份材料试方法'});
  return renderRecap(id,method);
}

function renderEvidenceCourse(extra,key,href,activities){
  var stages=[{id:'sec-prep',title:FLOW_OPENERS_G7A[key][0]}];
  var sections=renderCore(key)+activities.map(activity=>appendEvidenceStage(stages,activity)).join('');
  var writing=typeof FLOW_EVIDENCE_WRITING_G7A!=='undefined'&&FLOW_EVIDENCE_WRITING_G7A[key];
  if(writing){
    sections+=appendShortWriting(stages,writing,'sec-recap','g7a-learning-answer:'+key+':proof');
  }
  mountLearning(extra.title,extra.eyebrow,extra.lead,stages,sections,href,activities,{},writing);
}

function courseActivities(id){
  var coaching=typeof COURSE_COACHING_G7A==='undefined'?null:COURSE_COACHING_G7A[id];
  if(!coaching||!globalThis.learningEvidence)return null;
  return [coaching.study,coaching.transfer].map(function(task,index){
    var basis=Array.from(id).reduce((total,letter)=>total+letter.codePointAt(0),index);
    var [instruction,items,judgments,hint]=task;
    function variants(answer,distractor,clue,order){
      return order%2 ? { items:[distractor,answer], correct:1, hints:[clue,''] }
        : { items:[answer,distractor],correct:0,hints:['',clue] };
    }
    var passages=items.map(function([title,answer,distractor,clue],part){
      var field=variants(answer,distractor,clue,basis+part);
      return {title,lines:field.items,correct:field.correct,hints:field.hints,evidence:true};
    });
    var synthesis=variants(judgments[0],judgments[1],hint,basis+items.length+1);
    return {
      id:index?'sec-recap':'sec-apply',title:index?'换份材料试方法':'用本课材料找依据',transfer:Boolean(index),
      instruction,passages,
      synthesis:{title:'哪一句能解释你选的依据？',options:synthesis.items,correct:synthesis.correct,hints:synthesis.hints},
      success:judgments[0],
    };
  });
}

function courseReview(id,index){
  if(typeof COURSE_COACHING_G7A==='undefined'||!globalThis.learningReview)return null;
  var review=COURSE_COACHING_G7A[id]?.reviews[index];
  return review?{example:review[0],criteria:review.slice(1)}:null;
}

function renderExtra(){
  var key=document.body.dataset.extra;
  var extra=typeof EXTRAS_G7A!=='undefined'&&EXTRAS_G7A[key];
  if(!extra){failScreen();return;}
  var href=key+'.html';
  document.title=extra.title+' · 我的语文书房';
  setMetaDesc('七年级上册'+extra.title+'：跟着任务动手练。');
  var evidence=typeof FLOW_EVIDENCE_G7A==='undefined'?null:FLOW_EVIDENCE_G7A[key];
  if(evidence&&globalThis.learningEvidence){renderEvidenceCourse(extra,key,href,evidence);return;}
  var stages=[{id:'sec-prep',title:FLOW_OPENERS_G7A[key][0]}];
  var guide=FLOW_GUIDES_G7A[key];
  var activities=courseActivities(key);
  var reviewIndex=0;
  var sections=extra.sections.flatMap(function(section){
    var first=section.blocks.findIndex(function(block){return block.t==='bigq';});
    var second=section.blocks.findIndex(function(block,index){return index>first&&block.t==='bigq';});
    if(second<0)return [section];
    return [
      {...section,blocks:section.blocks.slice(0,second)},
      {...section,title:'用这个办法再练一个任务',blocks:section.blocks.slice(second)}
    ];
  }).map(function(section,index){
    var id='sec-task-'+(index+1);
    var action=FLOW_EXTRA_STAGE_NAMES_G7A[key][index]||section.title;
    var task=section.blocks.find(function(block){return block.t==='bigq'||block.t==='twodraft';});
    var apply=task&&reviewIndex===0&&activities?appendEvidenceStage(stages,activities[0]):'';
    var review=task?courseReview(key,reviewIndex++):null;
    stages.push({id:id,title:action,action:action});
    var clue=task&&(task.clue||guide[2]);
    return apply+renderSection(section,section.lab||'lab-read',id,clue?renderInlineMaterial(clue):undefined,review);
  }).join('');
  var recap=activities?appendEvidenceStage(stages,activities[1]):appendRecap(stages,key,FLOW_EXTRA_METHODS_G7A[key]);
  sections=renderCore(key)+sections+recap;
  mountLearning(extra.title,extra.eyebrow||'拓展板块',extra.lead,stages,sections,href,activities);
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
      if(currentLearningEpoch()){
        try{localStorage.setItem('gloss-hint-seen','1');}catch(e){}
      }
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
  var selected=document.querySelector('#l20-guess .choice[aria-pressed="true"]');
  slot.textContent=selected?('你刚才猜：'+selected.textContent+'。下面有新证据，可以改主意。')
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
  if(!currentLearningEpoch())return;
  var tb=e.target.closest('.answer-box[data-save]');
  if(tb){
    if(tb.value.trim())rememberLearning();
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
  if(!currentLearningEpoch())return;
  var node=e.target;
  if(node.closest('.learning-content :is([data-choice-index],[data-evidence-choice],.cmp-tab,.choice,[data-show],#learning-check,#learning-next,#learning-finish)')){
    rememberLearning();
  }

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
    d2.dispatchEvent(new Event('input',{bubbles:true}));
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
    ud2.dispatchEvent(new Event('input',{bubbles:true}));
    draftUndo.hidden=true;
    ud2.focus();
    return;
  }

  var choiceAction=node.closest('#learning-check');
  if(choiceAction){
    var current=el(learningStages[learningIndex].id);
    var activity=currentActivity(current);
    if(activity){
      activity.check();
      if(activity.passed)document.querySelector('#learning-next:not([hidden]), #learning-finish:not([hidden])')?.focus();
      return;
    }
    var choiceFieldset=current.querySelector('[data-learning-choice]');
    var answer=learningAnswers[choiceFieldset.dataset.learningChoice];
    if(answer.status==='retry'){
      selectLearningAnswer(choiceFieldset,{ ...answer, status:'unchecked', skipped:false });
      (choiceFieldset.querySelector('[aria-pressed="true"]')||choiceFieldset.querySelector('[data-choice-index]'))?.focus();
    }else{
      var item=learningChoiceItem(choiceFieldset.dataset.learningChoice);
      var helped=answer.helped||Boolean(choiceFieldset.querySelector('[data-learning-hint][open]'));
      var checked=learningCheck.check({ ...answer, helped },item[3]);
      selectLearningAnswer(choiceFieldset,checked);
      if(learningCheck.passed(checked))document.querySelector('#learning-next:not([hidden]), #learning-finish:not([hidden])')?.focus();
    }
    return;
  }

  var stageButton=node.closest('[data-learning-go]');
  if(stageButton){
    activateLearningStage(stageButton.dataset.learningGo,true,true);
    return;
  }

  var selection=node.closest('[data-choice-index]');
  if(selection){
    var fieldset=selection.closest('[data-learning-choice]');
    var key=fieldset.dataset.learningChoice;
    var choice=Number(selection.dataset.choiceIndex);
    var response={ ...learningAnswers[key], choice };
    var item=learningChoiceItem(key);
    if(fieldset.hasAttribute('data-instant-choice')&&item[3]!==null){
      response=learningCheck.check({ ...response, status:'unchecked' },item[3]);
    }
    selectLearningAnswer(fieldset,response);
    if(fieldset.hasAttribute('data-instant-choice')&&learningCheck.passed(response))el('learning-next').focus();
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
    var key=ctab.closest('.compare').dataset.compareSave;
    if(key){try{localStorage.setItem(key,ctab.dataset.v);}catch(e){}}
    ctab.closest('.compare').reviewActivity?.select(ctab,cp);
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
    if(sk==='l20-guess'){
      fillGuessRecall();
      updateLearningAction();
    }
    return;
  }

  // 通用显示/隐藏/揭示/切换
  var act=node.closest('[data-show],[data-hide],[data-reveal],[data-toggle],[data-post]');
  if(act){
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
    updateLearningAction();
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
    import('../g7a/skills.js?v=course-coaching').then(function(module){
      return module.mountRelatedSkills();
    }).then(updateLearningAction).catch(function(){});
  }catch(err){failScreen();}
}
safeStart();

import('./parent-settings.js?v=1').then(function(module){
  module.mountParentSettings({
    subject:'chinese',
    label:'语文',
    onReload:function(){location.replace('index.html');}
  });
}).catch(function(){});
