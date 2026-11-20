(function(){
  'use strict';
  function render(stages){
    var rail=document.createElement('aside');
    rail.className='learning-rail';
    rail.setAttribute('aria-label','本课进度');
    rail.innerHTML='<h2>本课进度</h2><p class="learning-position"><span data-step-count></span>'
      +'<span data-step-label></span></p><ol role="list"></ol>';
    var list=rail.querySelector('ol');
    stages.forEach(function(stage,index){
      var row=document.createElement('li');
      var number=document.createElement('span');
      var label=document.createElement('span');
      number.className='learning-step-number';
      number.setAttribute('aria-hidden','true');
      number.textContent=index+1;
      label.textContent=stage.title;
      row.append(number,label);
      list.append(row);
    });
    return rail.outerHTML;
  }

  function update(rail,stages,index){
    rail.querySelector('[data-step-count]').textContent='第 '+(index+1)+' / '+stages.length+' 步';
    rail.querySelector('[data-step-label]').textContent=stages[index].title;
    rail.querySelectorAll('li').forEach(function(row,i){
      if(i===index)row.setAttribute('aria-current','step');
      else row.removeAttribute('aria-current');
    });
  }

  globalThis.learningRail={render:render,update:update};
})();
