(function () {
  'use strict';

  const title = document.getElementById('home-title');
  const prompt = document.getElementById('available-volume');
  const opening = document.getElementById('home-opening');
  const material = document.getElementById('home-material');
  const options = document.getElementById('home-options');
  const feedback = document.getElementById('home-feedback');
  const enter = document.getElementById('enter-directory');
  const resume = document.getElementById('home-resume');
  let current;

  function read(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function readState(key) {
    try { return JSON.parse(read(key)); } catch { return null; }
  }

  function render() {
    const epoch = read('school-parent:reset:chinese');
    const last = read('g7a-last');
    const lastTitle = read('g7a-last-title');
    const lastStage = read('g7a-learning-stage:' + last);
    const feature = Object.entries(SHORT_LESSONS_G7A).find(([id]) => {
      const review = readState('g7a-learning-check:self:g7a-learning-answer:short:' + id);
      return !review?.done || review.choice?.includes(1);
    });
    const canResume = /^[a-z]+-\d+[a-z]?\.html$/.test(last || '') && lastTitle
      && (lastStage && lastStage !== 'sec-prep' || read('g7a-learning-check:resume:' + last) === '1');
    const separateResume = canResume && last !== feature?.[1].href;
    resume.hidden = !separateResume;
    if (separateResume) {
      resume.href = 'g7a/' + last;
      resume.textContent = '继续上次 · ' + lastTitle;
    }
    options.replaceChildren();
    material.replaceChildren();
    feedback.textContent = '';
    if (!feature) {
      current = null;
      title.textContent = '七年级上册';
      prompt.textContent = '接着读一课';
      opening.hidden = true;
      enter.hidden = false;
      enter.href = canResume ? 'g7a/' + last : 'g7a/index.html';
      enter.textContent = canResume ? '继续上次 · ' + lastTitle + ' →' : '打开七上课文 →';
      resume.hidden = true;
      return;
    }

    const [id, sample] = feature;
    const key = 'g7a-learning-check:short-open:' + id;
    const [, question, choices, answer, response, clues, hint] = sample.open;
    current = { key, epoch, answer, response, hint, state: learningCheck.restore(readState(key), choices.length) };
    title.textContent = '七年级上册 · ' + sample.name;
    prompt.textContent = question;
    clues?.forEach(line => {
      const paragraph = document.createElement('p');
      paragraph.textContent = line;
      material.append(paragraph);
    });
    material.hidden = !clues?.length;
    for (const [index, choice] of choices.entries()) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.index = index;
      button.textContent = choice;
      options.append(button);
    }
    opening.hidden = false;
    enter.href = 'g7a/' + sample.href;
    enter.textContent = last === sample.href && lastStage && lastStage !== 'sec-prep'
      ? '继续上次 · ' + lastTitle + ' →' : '到原文里看一看 →';
    paint();
  }

  function paint() {
    const { state, answer, response, hint } = current;
    const passed = answer === null ? state.choice !== null : learningCheck.passed(state);
    for (const button of options.children) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.index) === state.choice));
      button.disabled = passed;
    }
    feedback.dataset.result = passed ? 'correct' : state.status === 'retry' ? 'retry' : '';
    feedback.textContent = passed ? answer === null ? response[state.choice] : response
      : state.status === 'retry' ? hint : '';
    enter.hidden = !passed;
  }

  options.addEventListener('click', event => {
    const button = event.target.closest('[data-index]');
    if (!button || !current || button.disabled) return;
    const epoch = read('school-parent:reset:chinese');
    if (epoch !== current.epoch || epoch?.startsWith('pending:')) return;
    const state = { ...current.state, choice: Number(button.dataset.index), status: 'unchecked' };
    current.state = current.answer === null ? state : learningCheck.check(state, current.answer);
    try { localStorage.setItem(current.key, JSON.stringify(current.state)); } catch {}
    paint();
    if (!enter.hidden) enter.focus();
  });

  render();
  window.addEventListener('pageshow', event => { if (event.persisted) render(); });
})();
