(function () {
  'use strict';

  const activities = new WeakMap();

  function groups(step) {
    return step.passages.map((passage, index) => ({ ...passage, key: String(index) }))
      .concat(step.synthesis ? { ...step.synthesis, key: 'synthesis' } : []);
  }

  function render(step, escape) {
    const rows = groups(step);
    const options = (group) => (group.evidence ? group.lines : group.options).map((text, index) => (
      '<button type="button" data-evidence-part="' + group.key + '" data-evidence-choice="' + index
      + '" aria-pressed="false">' + escape(text) + '</button>'
    )).join('');
    const passages = rows.slice(0, step.passages.length).map((passage) => (
      '<fieldset class="evidence-passage" data-evidence-group="' + passage.key + '"><legend>' + escape(passage.title) + '</legend>'
      + (passage.evidence ? '' : '<div class="evidence-excerpt">' + passage.lines.map(text => '<p>' + escape(text) + '</p>').join('') + '</div>')
      + (passage.source ? '<p class="evidence-source">' + escape(passage.source) + '</p>' : '')
      + '<div class="evidence-options">' + options(passage) + '</div></fieldset>'
    )).join('');
    const synthesis = rows.find((row) => row.key === 'synthesis');
    return '<div class="evidence-exercise" data-evidence-exercise>'
      + '<p class="evidence-instruction">' + escape(step.instruction) + '</p>'
      + '<div class="evidence-passages">' + passages + '</div>'
      + (synthesis ? '<fieldset class="evidence-synthesis" data-evidence-group="synthesis"><legend>' + escape(synthesis.title)
        + '</legend><div class="evidence-options">' + options(synthesis) + '</div></fieldset>' : '')
      + '<p class="learning-state" role="status"></p><p class="learning-choice-note" role="status"></p></div>';
  }

  function connect(section, step, storageKey, notify, canSave) {
    const root = section.querySelector('[data-evidence-exercise]');
    const rows = groups(step);
    const buttons = [...root.querySelectorAll('[data-evidence-choice]')];
    const status = root.querySelector('.learning-state');
    const note = root.querySelector('.learning-choice-note');
    const draft = section.querySelector('[data-evidence-draft]');
    let saved;
    try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
    let state = { ...learningCheck.restore(saved, 0), answers: {}, missedPart: null };
    for (const row of rows) {
      const value = saved?.answers?.[row.key];
      if (Number.isInteger(value) && value >= 0 && value < (row.options ?? row.lines).length) state.answers[row.key] = value;
    }
    if (rows.every(row => state.answers[row.key] !== undefined) || saved?.skipped === true) {
      if (['retry', 'assisted', 'independent'].includes(saved?.status)) state.status = saved.status;
      const miss = rows.find(row => row.key === saved?.missedPart?.key);
      if (miss && typeof miss.hints[saved.missedPart.index] === 'string') state.missedPart = saved.missedPart;
    }

    function paint() {
      const passed = learningCheck.passed(state);
      const wrongRow = rows.find(row => row.key === state.missedPart?.key);
      for (const button of buttons) {
        const index = Number(button.dataset.evidenceChoice);
        const selected = state.answers[button.dataset.evidencePart] === index;
        button.setAttribute('aria-pressed', String(selected));
        button.disabled = passed || state.status === 'retry';
      }
      root.querySelectorAll('[data-evidence-group]').forEach((group) => {
        const active = group.dataset.evidenceGroup === wrongRow?.key;
        if (active && state.status === 'retry' && !state.skipped) group.dataset.needsReview = '';
        else delete group.dataset.needsReview;
      });
      root.dataset.checkStatus = state.status;
      status.textContent = step.transfer && state.status === 'independent'
        ? rows.some(row => row.evidence) ? '新材料 · 首次独立选证正确' : '新材料 · 首次作答正确'
        : learningCheck.label(state);
      note.dataset.result = passed ? 'correct' : state.status === 'retry' || wrongRow ? 'retry' : '';
      note.textContent = passed ? step.success : state.skipped ? '已留到下次。仍可回到这道题重试。'
        : wrongRow?.hints[state.missedPart.index] ?? '';
      if (draft) draft.hidden = !passed;
    }

    function update(next) {
      if (!canSave()) return;
      state = next;
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
      paint();
      notify();
    }

    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-evidence-choice]');
      if (!button || button.disabled) return;
      update({ ...state, answers: { ...state.answers, [button.dataset.evidencePart]: Number(button.dataset.evidenceChoice) } });
    });
    activities.set(section, {
      get status() { return state.status; },
      get passed() { return learningCheck.passed(state); },
      get ready() { return rows.every(row => state.answers[row.key] !== undefined); },
      check() {
        if (state.status === 'retry') {
          update({ ...state, status: 'unchecked', skipped: false });
          const part = state.missedPart?.key;
          const focus = buttons.find(button => button.dataset.evidencePart === part && button.getAttribute('aria-pressed') === 'true');
          (focus ?? buttons[0]).focus();
        } else if (this.ready) {
          const wrong = rows.find(row => state.answers[row.key] !== row.correct);
          const missedPart = wrong ? { key: wrong.key, index: state.answers[wrong.key] } : null;
          update({ ...learningCheck.outcome(state, !wrong), missedPart });
        }
      },
    });
    paint();
  }

  globalThis.learningEvidence = { render, connect, activity: section => activities.get(section) };
})();
