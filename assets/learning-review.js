(function () {
  'use strict';

  const activities = new WeakMap();
  const placeholders = /^(?:(?:我(?:也)?)?不知道[啊呀呢的]*|(?:我)?不会[写答做啊呀这个题]*|没想好|不知道怎么写|待补充|先跳过|还没写|随便|占位|测试|草稿|略|哈哈|嗯|asdf|test|abc|x)+$/iu;

  function meaningful(text) {
    const content = text.normalize('NFKC').replace(/[^\p{L}\p{N}]/gu, '');
    return [...content].length >= 4 && /\p{L}/u.test(content) && !placeholders.test(content);
  }

  function render(review, escape) {
    return '<div class="draft-self-review" data-self-review><p class="learning-state" role="status"></p>'
      + '<div class="draft-review-panel" hidden><p><strong>一种答法</strong> '+escape(review.example)+'</p>'
      + review.criteria.map((criterion, index) => '<fieldset><legend>'+escape(criterion)+'</legend>'
        + ['做到了','还要补'].map((label, choice) => '<button type="button" data-review-criterion="'+index
          +'" data-review-choice="'+choice+'" aria-pressed="false">'+label+'</button>').join('')+'</fieldset>').join('')
      + '</div></div>';
  }

  function connect(section, prefix, notify, canSave) {
    const review = section.querySelector('[data-self-review]');
    const drafts = [...section.querySelectorAll('textarea[data-save]')];
    const panel = review.querySelector('.draft-review-panel');
    const status = review.querySelector('.learning-state');
    const buttons = [...panel.querySelectorAll('button')];
    const total = panel.querySelectorAll('fieldset').length;
    const storageKey = prefix + drafts[0].dataset.save;
    const responses = () => drafts.map(draft => draft.value.trim());
    const snapshot = () => JSON.stringify(responses());
    let saved;
    try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
    let state = saved?.text === snapshot() && meaningful(drafts[0].value) && Array.isArray(saved.choice)
      ? { text: saved.text, choice: saved.choice, done: saved.done && saved.choice.length === total && saved.choice.every(value => value === 0 || value === 1) }
      : { text: null, choice: [], done: false };

    function paint(error = '') {
      panel.hidden = state.text === null;
      status.textContent = error || (state.done ? state.choice.includes(1) ? '已自评 · 有地方可以再补' : '已自评'
        : panel.hidden ? '草稿待自评' : '对照范例，检查下面两点');
      for (const button of buttons) {
        const selected = Number(button.dataset.reviewChoice) === state.choice[Number(button.dataset.reviewCriterion)];
        button.setAttribute('aria-pressed', String(selected));
      }
    }

    function update(next) {
      if (!canSave()) return;
      state = next;
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
      paint();
      notify();
    }

    for (const draft of drafts) draft.addEventListener('input', () => {
      if (state.text !== null && state.text !== snapshot()) {
        update({ text: meaningful(drafts[0].value) ? snapshot() : null, choice: [], done: false });
      }
    });
    panel.addEventListener('click', (event) => {
      const picked = event.target.closest('[data-review-choice]');
      if (!picked) return;
      const choice = state.choice.slice();
      choice[Number(picked.dataset.reviewCriterion)] = Number(picked.dataset.reviewChoice);
      update({ ...state, choice, done: false });
    });

    activities.set(section, {
      get status() { return state.done ? 'reviewed' : 'unchecked'; },
      get label() { return panel.hidden ? '看范例并自评' : '完成自评'; },
      get passed() { return state.done; },
      get ready() { return panel.hidden || Array.from({ length: total }, (_, index) => state.choice[index]).every(value => value === 0 || value === 1); },
      check() {
        if (panel.hidden) {
          if (!meaningful(drafts[0].value)) {
            paint('先用几个词把自己的想法写清楚，再来对照。');
            drafts[0].focus();
            return;
          }
          update({ text: snapshot(), choice: [], done: false });
          panel.querySelector('button').focus();
        } else if (this.ready) update({ ...state, done: true });
      },
    });
    paint();
  }

  globalThis.learningReview = { render, connect, meaningful, activity: section => activities.get(section) };
})();
