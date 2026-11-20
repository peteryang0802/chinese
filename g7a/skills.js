import { loadRecord, saveRecord, listConflicts, saveConflictDraft, currentLearningEpoch } from './skills-storage.js?v=parents1';
import { methodEvidence } from './skill-transfer-evidence.js?v=1';

const orderedIds = ['narrative', 'paragraph', 'structure', 'theme', 'explanation', 'punctuation', 'words'];
let skills = [];
let contentRequest;

async function readContent(load, exportName) {
  let timer;
  try {
    const module = await Promise.race([
      load(),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('练习加载超时')), 6000);
      }),
    ]);
    return module[exportName];
  } finally {
    clearTimeout(timer);
  }
}

function loadSkills() {
  contentRequest ??= Promise.allSettled([
    readContent(() => import('./skills-content-reading.js'), 'readingSkills'),
    readContent(() => import('./skills-content-genres.js'), 'genreSkills'),
    readContent(() => import('./skills-content-language.js'), 'languageSkills'),
  ]).then((results) => {
    const loaded = results.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
    skills = orderedIds.map((id) => loaded.find((skill) => skill.id === id)).filter(Boolean);
  });
  return contentRequest;
}
const keywords = {
  narrative: '叙事概括 记事 记叙文 六要素 起因经过结果 主要内容 复述',
  paragraph: '段意 段落大意 段落概括 关键句 中心句',
  structure: '分段 层次 层意 文章结构 思路 顺序 线索 过渡',
  theme: '中心思想 全文主旨 主题 中心 选材 详略',
  explanation: '说明文 说明方法 列数字 作比较 观察事实 推断 数据 说明对象',
  punctuation: '标点符号 问号 分号 冒号 引号 逗号 句号 对话',
  words: '词义 词语 语境 代词 感情色彩 褒贬义',
};
const extraSkills = {
  'practice-1': ['paragraph', 'punctuation'],
  'writing-1': ['words', 'paragraph'],
  'practice-2': ['words', 'punctuation'],
  'writing-2': ['narrative', 'punctuation'],
  'topic-2': ['narrative', 'theme'],
  'practice-3': ['paragraph', 'theme'],
  'writing-3': ['theme'],
  'book-3': ['theme', 'paragraph'],
  'poems-3': ['words'],
  'practice-4': ['paragraph', 'structure'],
  'writing-4': ['structure'],
  'topic-4': ['theme'],
  'task-5b': ['explanation'],
  'task-5c': ['explanation', 'narrative'],
  'practice-6': ['words', 'narrative'],
  'writing-6': ['narrative', 'structure'],
  'book-6': ['narrative', 'theme'],
  'poems-6': ['words'],
};

const relatedLessonMethods = {
  1: ['words','paragraph'], 2: ['paragraph','theme'], 3: ['paragraph','structure'],
  4: ['words'], 5: ['narrative','theme'], 6: ['narrative','punctuation','theme'],
  7: ['words','punctuation'], 8: ['narrative','words'], 9: ['paragraph','theme','structure'],
  10: ['theme','structure'], 11: ['narrative','structure'], 12: ['words'],
  13: ['explanation','theme'], 14: ['narrative','theme'], 15: ['structure','words'],
  16: ['structure','theme'], 17: ['narrative','explanation'], 18: ['words','paragraph'],
  19: ['explanation'], 20: ['narrative','structure'], 21: ['narrative','structure'],
  22: ['theme','punctuation'], 23: ['narrative'], 24: ['narrative','theme'],
};

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const lessonNumber = (number) => String(number).padStart(2, '0');
function lessonUrl(number, skillId, taskId) {
  const file = 'lesson-' + lessonNumber(number) + '.html';
  if (!skillId || !taskId) return file + '#sec-read';
  const back = new URLSearchParams({ fromSkill: skillId, fromTask: taskId });
  const query = new URLSearchParams(location.search).get('backq');
  if (query) back.set('methodQuery', query);
  return file + '?' + back + '#sec-read';
}
const skillUrl = (id) => 'skills.html?skill=' + encodeURIComponent(id);
const lessonTitle = (number) => window.BOOK_G7A?.units
  .flatMap((unit) => unit.lessons).find((lesson) => lesson.no === number)?.title ?? ('第 ' + number + ' 课');
const legacyId = (entry, index) => 'lesson-' + lessonNumber(entry.lesson) + '-' + (index + 1);
const exerciseId = (entry, index) => entry.id ?? legacyId(entry, index);
function entryUrl(id, entry, index, query) {
  const search = query ? '&backq=' + encodeURIComponent(query) : '';
  return skillUrl(id) + '&lesson=' + entry.lesson + search + '#' + exerciseId(entry, index);
}
const hasText = (value) => typeof value === 'string' && Boolean(value.trim());
const resumeKey = 'g7a-skills-resume-v2';

function remember(skill, id) {
  if (!currentLearningEpoch()) return;
  try {
    localStorage.setItem(resumeKey, JSON.stringify({ skill, id }));
  } catch {
    // The exercise remains available when the device cannot remember the entry.
  }
}

function lastExercise() {
  try {
    const record = JSON.parse(localStorage.getItem(resumeKey) || 'null');
    const skill = skills.find((item) => item.id === record?.skill);
    if (!skill) return null;
    const index = skill.entries.findIndex((entry, i) => exerciseId(entry, i) === record.id);
    if (index >= 0) {
      const entry = skill.entries[index];
      return { title: lessonTitle(entry.lesson), href: entryUrl(skill.id, entry, index) };
    }
    if (record.id === 'transfer-task') return { title: skill.name + ' · 换文练习', href: skillUrl(skill.id) + '#transfer' };
    if (record.id === 'recall') return { title: skill.name + ' · 热身', href: skillUrl(skill.id) + '#recall' };
  } catch {
    // Ignore an unavailable or invalid resume pointer.
  }
  return null;
}

function attemptStatus(record) {
  if (record.selfReviewed === true) return '已自评';
  if (hasText(record.revision)) return '有改答草稿';
  if (record.submitted) return '已交初答';
  return hasText(record.draft) ? '有草稿' : '';
}

function transferStatus(skill) {
  const transfer = attemptStatus(loadRecord(skill.id + ':transfer').data);
  if (transfer) return '换文 · ' + transfer;
  const progress = skill.entries.map((entry, index) => attemptStatus(loadRecord(
    skill.id + ':' + exerciseId(entry, index), skill.id + ':' + legacyId(entry, index),
  ).data));
  if (progress.some((status) => status.includes('草稿'))) return '课内有草稿';
  return progress.some(Boolean) ? '已做课内练习' : '';
}

function searchTerms(query) {
  return query.normalize('NFKC').replace(/[《》？?。！!]/g, '').trim()
    .replace(/^(?:请问|我想知道|我想|想知道)/, '').replace(/^(?:怎么|怎样|如何|什么是|练习|学会)/, '')
    .replace(/(?:吗|呢)$/, '').trim().split(/[、,，和及\s]+/).filter(Boolean);
}

const searchAliases = {
  paragraph: '段落的主要意思 段落主要意思 概括这一段 概括段意',
  theme: '概括中心 归纳主旨 表达什么 作者想说什么',
  punctuation: '加标点 正确使用标点 写标点',
};

function searchMatches(skill, terms) {
  const text = [skill.name, keywords[skill.id], searchAliases[skill.id] ?? '', skill.goal,
    ...skill.entries.map((entry) => lessonTitle(entry.lesson))].join(' ');
  return terms.some((term) => text.includes(term));
}

function evidenceList(item) {
  if (!item.evidence?.length) return '<p class="skill-material">' + escapeHtml(item.passage) + '</p>';
  return '<ol class="skill-material skill-evidence">' + item.evidence.map(
    (line) => '<li>' + escapeHtml(line) + '</li>',
  ).join('') + '</ol>';
}

function incompleteContent() {
  return skills.length < orderedIds.length;
}

function retryMarkup(message) {
  return '<p class="skill-unavailable" role="status">' + escapeHtml(message)
    + ' <button type="button" data-reload class="skill-secondary">重新加载</button></p>';
}

function bindReload(root) {
  root.querySelector('[data-reload]')?.addEventListener('click', () => location.reload());
}

function renderHome(root, query) {
  root.classList.add('skills-hub');
  setSkillsHeader('index.html', '七上目录');
  root.innerHTML = `
    <div class="page-head">
      <div class="eyebrow">七年级上册</div>
      <h1>按方法练</h1>
      <p class="lead">每次选一个方法。先做一道小题，再到课文里试一次。</p>
      <div class="skill-actions" id="practice-entry" tabindex="-1"></div>
    </div>
    <form class="skill-lookup" role="search">
      <label for="skill-query">你想练什么？</label>
      <input id="skill-query" type="search" autocomplete="off" placeholder="比如 六要素、分段、标点">
    </form>
    <p class="skill-count" role="status"></p>
    ${incompleteContent() ? retryMarkup('有些方法暂时没打开，下面的练习可以先做。') : ''}
    <div class="skill-grid"></div>
    <button class="skill-button" type="button" data-skill-clear hidden>查看全部方法</button>`;
  const search = root.querySelector('#skill-query');
  const grid = root.querySelector('.skill-grid');
  const count = root.querySelector('.skill-count');
  const start = root.querySelector('#practice-entry');
  const clear = root.querySelector('[data-skill-clear]');
  search.value = query;
  function renderStart() {
    const resume = lastExercise();
    let walkStage = null;
    try { walkStage = localStorage.getItem('g7a-skills-v1:walk-starter'); } catch {}
    const starterLabel = walkStage === '1' || walkStage === '2' ? '继续《散步》开场练习' : '先试一道记事题';
    start.innerHTML = (resume ? '<a class="skill-start skill-button" href="' + escapeHtml(resume.href)
      + '">继续上次 · ' + escapeHtml(resume.title) + ' →</a>' : '')
      + '<a class="skill-start ' + (resume ? 'skill-text-link' : 'skill-button')
      + '" href="skills.html?start=walk">' + starterLabel + ' →</a>';
  }
  function renderMatches() {
    const raw = search.value.trim();
    const terms = searchTerms(search.value);
    const matching = raw ? skills.filter((skill) => searchMatches(skill, terms)) : skills;
    grid.innerHTML = matching.map((skill) => {
      const progress = transferStatus(skill);
      const href = skillUrl(skill.id) + (raw ? '&backq=' + encodeURIComponent(raw) : '');
      return `<a class="skill-card" id="method-${skill.id}" href="${escapeHtml(href)}">
        <strong>${escapeHtml(skill.name)}</strong>
        <span>${escapeHtml(skill.goal)}</span>
        ${progress ? '<small>' + escapeHtml(progress) + '</small>' : ''}
      </a>`;
    }).join('');
    count.textContent = raw
      ? (matching.length ? '找到 ' + matching.length + ' 个方法。' : '没有找到相符的方法。')
      : '';
    start.hidden = Boolean(raw);
    clear.hidden = !raw || matching.length > 0;
  }
  function updateQuery() {
    const url = new URL(location.href);
    if (search.value.trim()) url.searchParams.set('q', search.value.trim());
    else url.searchParams.delete('q');
    url.hash = '';
    history.replaceState(null, '', url);
    renderMatches();
  }
  search.addEventListener('input', updateQuery);
  search.form.addEventListener('submit', event => {
    event.preventDefault();
    if (grid.children.length === 1) grid.querySelector('a').click();
  });
  clear.addEventListener('click', () => {
    search.value = '';
    updateQuery();
    search.focus();
  });
  bindReload(root);
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      const focused = document.activeElement?.id;
      renderStart();
      renderMatches();
      if (focused?.startsWith('method-')) document.getElementById(focused)?.focus({ preventScroll: true });
    }
  });
  renderStart();
  renderMatches();
  const target = location.hash.slice(1);
  if (target === 'practice-entry' || target.startsWith('method-')) document.getElementById(target)?.focus();
}

function quickQuestion(data, key, nextId) {
  return `<fieldset class="skill-quick" data-quick="${key}">
    <legend>${escapeHtml(data.question)}</legend>
    <div class="skill-options">${data.options.map((option, index) =>
      `<button type="button" aria-pressed="false" data-option="${index}">${escapeHtml(option.text)}</button>`,
    ).join('')}</div>
    <p class="learning-state" role="status"></p>
    <p class="skill-option-feedback" role="status"></p>
    <div class="skill-actions">
      <button type="button" class="${nextId ? 'skill-button' : 'skill-secondary'}" data-quick-check>核对答案</button>
      ${nextId ? '<a class="skill-button" href="#' + nextId + '" data-recall-next hidden>到课文里试一步 →</a>' : ''}
    </div>
  </fieldset>`;
}

function bindQuick(parent, data, key, onChoice) {
  const group = parent.querySelector('[data-quick="' + key + '"]');
  const buttons = [...group.querySelectorAll('[data-option]')];
  const status = group.querySelector('.learning-state');
  const feedback = group.querySelector('.skill-option-feedback');
  const next = group.querySelector('[data-recall-next]');
  const check = group.querySelector('[data-quick-check]');
  const method = next && group.parentElement.querySelector('.skill-method');
  let state = learningCheck.restore(loadRecord(key).data, data.options.length);
  let pending = Promise.resolve();

  function paint() {
    const passed = learningCheck.passed(state);
    const retry = state.status === 'retry';
    buttons.forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === state.choice));
      button.disabled = passed || retry;
    });
    status.textContent = learningCheck.label(state);
    group.dataset.checkStatus = state.status;
    group.dataset.result = passed ? 'correct' : state.missed !== null || retry ? 'retry' : 'unchecked';
    feedback.dataset.tone = passed ? 'correct' : group.dataset.result === 'retry' ? 'hint' : '';
    feedback.textContent = passed ? data.options[state.choice].why : state.skipped ? '已留到下次。仍可回来重试。'
      : state.missed !== null ? data.options[state.missed].why : '';
    check.hidden = passed;
    check.disabled = state.choice === null && !retry;
    check.textContent = retry ? '按线索再试' : '核对答案';
    if (next) next.hidden = !passed;
  }

  function update(changed) {
    if (!currentLearningEpoch()) return;
    state = changed;
    paint();
    onChoice?.();
    pending = pending.then(async () => {
      const { version } = loadRecord(key);
      const result = await saveRecord(key, changed, version);
      if (result.status === 'unavailable') feedback.textContent += '（本次选择未能保存。）';
    });
    trackWrite(pending);
  }

  paint();
  buttons.forEach((button, index) => button.addEventListener('click', () => update({ ...state, choice: index })));
  method?.addEventListener('toggle', () => {
    if (method.open && !state.helped && !learningCheck.passed(state)) update({ ...state, helped: true });
  });
  check.addEventListener('click', () => {
    if (state.status === 'retry') {
      update({ ...state, status: 'unchecked', skipped: false });
      (buttons[state.choice] ?? buttons[0]).focus();
    } else {
      update(learningCheck.check({ ...state, helped: state.helped || Boolean(method?.open) }, data.correct));
      if (learningCheck.passed(state)) (next ?? status).focus();
    }
  });
}

function exerciseTemplate(item, id, nextId, skillId) {
  return `<div class="skill-exercise" data-exercise="${id}">
    <label class="skill-question" for="${id}-draft">${escapeHtml(item.question)}</label>
    <details class="skill-inline-material" open>
      <summary>题旁材料</summary>
      ${item.source ? '<p class="skill-source">' + escapeHtml(item.source) + '</p>' : ''}
      ${evidenceList(item)}
      ${item.lesson ? '<a class="skill-text-link" href="' + escapeHtml(lessonUrl(item.lesson, skillId, id)) + '">查看课文学习页</a>' : ''}
    </details>
    ${item.quick ? '<details class="skill-support"><summary>先试一小题（可选）</summary>'
      + quickQuestion(item.quick, id + '-quick') + '</details>' : ''}
    <textarea id="${id}-draft" rows="3" placeholder="先写一句，哪怕还不完整" data-field="draft"></textarea>
    <div class="skill-actions">
      <button type="button" class="skill-button" data-action="submit">交初答，看对照</button>
      <details class="skill-support" data-help>
        <summary>需要提示</summary>
        <button type="button" class="skill-secondary" data-action="hint">给一点提示</button>
        ${item.role === '示范' ? '<button type="button" class="skill-secondary" data-action="example">先看示范</button>' : ''}
      </details>
    </div>
    <p class="skill-hint" tabindex="-1" hidden></p>
    <p class="skill-status" role="status"></p>
    <div class="skill-conflict" hidden></div>
    <div class="skill-history" hidden></div>
    <section class="skill-review" hidden aria-labelledby="${id}-review">
      <h4 id="${id}-review" tabindex="-1">看看哪一点可以改</h4>
      <p><strong>一种答法</strong> ${escapeHtml(item.example)}</p>
      <p><strong>容易漏的地方</strong> ${escapeHtml(item.commonError)}</p>
      <div class="skill-correction">
        ${item.criteria.map((criterion, index) => '<fieldset class="skill-review-check"><legend>' + escapeHtml(criterion) + '</legend>'
          + ['做到了','还要补'].map((label, choice) => '<button type="button" aria-pressed="false" data-skill-criterion="'+index
            +'" data-skill-self-check="'+choice+'">'+label+'</button>').join('') + '</fieldset>').join('')}
        <details class="skill-original"><summary>对照我的初答</summary><p></p></details>
        <label for="${id}-revision">我现在会这样答（选做）</label>
        <textarea id="${id}-revision" rows="3" placeholder="补上漏掉的部分，或用自己的话写一遍" data-field="revision"></textarea>
        <div class="skill-actions">
          <button type="button" class="skill-button" data-action="finish">完成自评</button>
          <a class="skill-button" data-action="continue" href="${nextId ? '#' + nextId : 'skills.html'}" hidden>
            ${nextId === 'transfer' ? '换一段试试' : nextId ? '用到下一段' : '回到方法目录'} →
          </a>
          <details class="skill-support">
            <summary>其他作答操作</summary>
            <button type="button" class="skill-secondary" data-action="restart">保留记录，再练一次</button>
            ${item.lesson === 6 && skillId === 'narrative' ? '<a class="skill-text-link" href="' + skillUrl('theme')
              + '&amp;lesson=6&amp;from=narrative">用刚才的梗概读《散步》的中心</a>' : ''}
          </details>
        </div>
        <p class="skill-status skill-revision-status" role="status"></p>
      </div>
    </section>
  </div>`;
}

function bindExercise(root, item, id, skillId, oldId = id) {
  const key = skillId + ':' + (id === 'transfer-task' ? 'transfer' : id);
  const oldKey = skillId + ':' + (id === 'transfer-task' ? 'transfer' : oldId);
  const exercise = root.querySelector('[data-exercise="' + id + '"]');
  const draft = exercise.querySelector('[data-field="draft"]');
  const revision = exercise.querySelector('[data-field="revision"]');
  const hint = exercise.querySelector('.skill-hint');
  const review = exercise.querySelector('.skill-review');
  const showExample = exercise.querySelector('[data-action="example"]');
  const status = exercise.querySelector('.skill-status');
  const reviewStatus = exercise.querySelector('.skill-revision-status');
  const submit = exercise.querySelector('[data-action="submit"]');
  const showHint = exercise.querySelector('[data-action="hint"]');
  const help = exercise.querySelector('[data-help]');
  const finish = exercise.querySelector('[data-action="finish"]');
  const proceed = exercise.querySelector('[data-action="continue"]');
  const history = exercise.querySelector('.skill-history');
  const conflictBox = exercise.querySelector('.skill-conflict');
  const summaryStatus = exercise.closest('.skill-task')?.querySelector('.skill-task-progress');
  const original = exercise.querySelector('.skill-original p');
  const checks = [...review.querySelectorAll('[data-skill-self-check]')];
  let { data: record, version } = loadRecord(key, oldKey);
  let pending = Promise.resolve();
  let updateNumber = 0;
  let conflict = false;
  let conflictBackupKey;
  let storageUnavailable = false;
  const hasEveryCheck = () => item.criteria.every((_, index) => [0, 1].includes(record.selfChoices?.[index]));

  function updateSummary() {
    if (summaryStatus) summaryStatus.textContent = attemptStatus(record);
  }

  function showBackups(extraRecord, message) {
    const backups = listConflicts(key, oldKey);
    const available = extraRecord ? [{ data: extraRecord }, ...backups] : backups;
    conflictBox.hidden = false;
    conflictBox.innerHTML = '<p role="status">' + escapeHtml(message) + '</p>';
    available.slice(0, 3).forEach((backup) => {
      const details = document.createElement('details');
      details.innerHTML = '<summary>查看这份副本</summary><textarea readonly rows="3" aria-label="可复制的作答副本"></textarea>';
      details.querySelector('textarea').value = [backup.data?.draft, backup.data?.revision].filter(hasText).join('\n\n');
      conflictBox.append(details);
    });
  }

  function drawHistory() {
    const attempts = Array.isArray(record.history) ? record.history : [];
    history.hidden = !attempts.length;
    if (!attempts.length) return;
    const previous = attempts.at(-1);
    history.innerHTML = '<details><summary>上一次练习</summary><p><strong>初答</strong> '
      + escapeHtml(previous.draft) + '</p>'
      + (hasText(previous.revision) ? '<p><strong>改答</strong> ' + escapeHtml(previous.revision) + '</p>' : '')
      + '</details>';
  }

  function sync() {
    draft.readOnly = record.submitted === true;
    draft.hidden = record.submitted === true;
    submit.hidden = record.submitted === true;
    showHint.hidden = record.submitted === true || record.usedHint === true;
    hint.hidden = !record.usedHint || record.submitted === true;
    hint.textContent = item.hint ?? ('先找一处能支持你判断的词句。' + item.criteria[0]);
    if (showExample) showExample.hidden = record.submitted === true || record.viewedExample === true;
    help.hidden = record.submitted === true || showHint.hidden && (!showExample || showExample.hidden);
    review.hidden = record.submitted !== true && record.viewedExample !== true;
    exercise.querySelector('.skill-correction').hidden = record.submitted !== true;
    const done = record.selfReviewed === true && hasEveryCheck() && learningReview.meaningful(record.draft ?? '');
    checks.forEach((button) => {
      const picked = Number(button.dataset.skillSelfCheck) === record.selfChoices?.[Number(button.dataset.skillCriterion)];
      button.setAttribute('aria-pressed', String(picked));
    });
    finish.hidden = done;
    finish.disabled = !hasEveryCheck();
    proceed.hidden = !done;
    original.textContent = record.draft ?? '';
    updateSummary();
    drawHistory();
  }

  function persist(message, where = status, preserveTransition = false) {
    const number = ++updateNumber;
    const snapshot = { ...record };
    remember(skillId, id);
    updateSummary();
    const saving = pending.then(async () => {
      if (number !== updateNumber && !preserveTransition) return;
      if (conflict) {
        const savedBackupKey = saveConflictDraft(key, snapshot, conflictBackupKey);
        if (savedBackupKey) conflictBackupKey = savedBackupKey;
        showBackups(savedBackupKey ? null : snapshot, savedBackupKey
          ? '本页的最新修改已存到作答副本。刷新后可看正式记录。'
          : '请复制本页内容后再刷新，最新修改暂时无法保存。');
        if (where !== status) where.textContent = '修改保留在这一页的并行作答中。';
        return;
      }
      const result = await saveRecord(key, snapshot, version, oldKey);
      if (result.status === 'reset') return;
      if (result.status === 'conflict') {
        conflict = true;
        conflictBackupKey = result.backupKey;
        showBackups(conflictBackupKey ? null : result.backupData ?? snapshot, conflictBackupKey
          ? '另一页已有更新。正式记录保留，本页内容已另存为副本。'
          : '另一页已有更新。正式记录保留，请复制本页内容后再刷新。');
        where.textContent = '本页有一份并行作答。';
      } else if (result.status === 'saved') {
        version = result.version;
        storageUnavailable = false;
        where.textContent = message;
        if (!listConflicts(key, oldKey).length) conflictBox.hidden = true;
      } else {
        storageUnavailable = true;
        where.textContent = '这一页可以继续练。当前浏览器无法保存，离开前可复制作答。';
        showBackups(snapshot, '复制这次作答后再离开此页。');
        conflictBox.querySelector('details')?.setAttribute('open', '');
      }
    });
    pending = saving.catch(() => {
      storageUnavailable = true;
      where.textContent = '这次没能保存。你可以从答题框复制内容。';
    });
    trackWrite(pending);
  }

  function loadFields() {
    draft.value = typeof record.draft === 'string' ? record.draft : '';
    revision.value = typeof record.revision === 'string' ? record.revision : '';
    sync();
  }

  loadFields();
  if (item.quick) bindQuick(exercise, item.quick, id + '-quick');
  if (record.submitted) {
    status.textContent = record.usedHint ? '已提交初答，作答时看过提示。' : '已提交初答，作答前未打开提示。';
    if (record.selfReviewed === true) reviewStatus.textContent = '这次自评已保存。';
  }
  if (listConflicts(key, oldKey).length) showBackups(null, '这题留有并行作答的副本。');

  draft.addEventListener('input', () => {
    if (record.submitted) return;
    record.draft = draft.value;
    persist('草稿已保存。');
  });
  showHint.addEventListener('click', () => {
    record.usedHint = true;
    persist('提示已展开，可以接着写。');
    sync();
    hint.focus({ preventScroll: true });
    hint.scrollIntoView({ block: 'nearest' });
  });
  showExample?.addEventListener('click', () => {
    record.usedHint = true;
    record.viewedExample = true;
    persist('先看示范，再写一句你自己的想法。');
    sync();
    review.querySelector('h4').focus();
  });
  submit.addEventListener('click', () => {
    if (!learningReview.meaningful(draft.value)) {
      status.textContent = '先用几个词把自己的想法写清楚。如果卡住，可以打开提示。';
      draft.focus();
      return;
    }
    record.draft = draft.value;
    record.submitted = true;
    persist(record.usedHint ? '初答已保存，作答时看过提示。' : '初答已保存，作答前未打开提示。');
    sync();
    review.querySelector('h4').focus();
  });
  revision.addEventListener('input', () => {
    record.revision = revision.value;
    record.selfReviewed = false;
    record.revisionDone = false;
    record.keptOriginal = false;
    sync();
    persist('改答草稿已保存。', reviewStatus);
  });
  checks.forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.skillCriterion);
    const choice = Number(button.dataset.skillSelfCheck);
    const selected = { ...record.selfChoices, [index]: choice };
    record.selfChoices = selected;
    record.selfReviewed = false;
    sync();
    persist('自评选项已记录。', reviewStatus);
  }));
  finish.addEventListener('click', () => {
    if (!learningReview.meaningful(record.draft ?? '')) {
      reviewStatus.textContent = '这份旧初答还需要补充。请展开其他作答操作，选「保留记录，再练一次」。';
      return;
    }
    record.revision = revision.value;
    record.selfReviewed = true;
    record.revisionDone = learningReview.meaningful(revision.value);
    record.keptOriginal = !record.revisionDone;
    sync();
    persist(Object.values(record.selfChoices).includes(1) ? '已自评。可以继续补写刚才标记的地方。' : '已自评。初答及已有草稿已保存。', reviewStatus);
    proceed.focus();
  });
  exercise.querySelector('[data-action="restart"]').addEventListener('click', () => {
    if (conflict || storageUnavailable) {
      reviewStatus.textContent = '请先复制这次作答，再重新打开练习。';
      return;
    }
    const { history: prior = [], ...attempt } = record;
    record = {
      draft: '', submitted: false, attempt: (Number(attempt.attempt) || 1) + 1,
      history: [...(Array.isArray(prior) ? prior : []), attempt],
    };
    persist('上一次答案已保留。可以重新作答。', status, true);
    reviewStatus.textContent = '';
    exercise.querySelector('.skill-original').open = false;
    loadFields();
    draft.focus();
  });
}

const pendingWrites = new Set();

function trackWrite(promise) {
  pendingWrites.add(promise);
  promise.finally(() => pendingWrites.delete(promise));
}

function waitForWrites(root) {
  root.addEventListener('click', async (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || !pendingWrites.size || link.hash && link.pathname === location.pathname && link.search === location.search) return;
    event.preventDefault();
    const href = link.href;
    await Promise.allSettled([...pendingWrites]);
    location.assign(href);
  });
}

function setSkillsHeader(href, label) {
  const header = document.querySelector('.site-head');
  document.body.classList.add('guided-learning');
  const crumb = header.querySelector('.crumb');
  const link = document.createElement('a');
  link.className = 'learning-directory';
  link.href = href;
  link.textContent = '← ' + label;
  crumb.replaceChildren(link);
}

function usePracticeHeader(skillId) {
  const url = new URL('skills.html', location.href);
  const query = new URLSearchParams(location.search).get('backq');
  if (query) url.searchParams.set('q', query);
  url.hash = skillId ? 'method-' + skillId : 'practice-entry';
  setSkillsHeader(url.href, '方法目录');
  return url.href;
}

function bindTransferEvidence(section, step, skillId) {
  const check = section.querySelector('[data-method-evidence-check]');
  const evidence = section.querySelector('[data-evidence-exercise]');
  const status = section.querySelector('[data-method-evidence-status]');
  const draft = section.querySelector('[data-method-open-transfer]');
  const update = () => {
    const activity = learningEvidence.activity(section);
    evidence.hidden = check.hidden = activity.passed;
    draft.hidden = !activity.passed;
    status.hidden = !activity.passed;
    if (activity.passed) status.textContent = '证据核对 · ' + evidence.querySelector('.learning-state').textContent;
    check.textContent = activity.status === 'retry' ? '按线索再试' : '核对答案';
    check.disabled = !activity.ready && activity.status !== 'retry';
  };
  learningEvidence.connect(section, step, 'g7a-learning-check:method:' + skillId, update, currentLearningEpoch);
  check.addEventListener('click', () => {
    const activity = learningEvidence.activity(section);
    activity.check();
    if (activity.passed) draft.querySelector('textarea:not([hidden]), h4').focus();
  });
  update();
}

function renderDetail(root, skill, selectedLesson, reusedSummary = '') {
  const entries = skill.entries;
  const lessonIndex = entries.findIndex((entry) => entry.lesson === selectedLesson);
  const startIndex = Math.max(lessonIndex, 0);
  const recallKey = skill.id + ':recall';
  const taskIds = entries.map(exerciseId);
  const stageVerbs = { '示范': '看示例', '带练': '跟着找依据', '独立练': '独立作答' };
  const stages = [{ id: 'recall', title: '先试一道' },
    ...entries.map((entry, index) => ({
      id: taskIds[index],
      title: (stageVerbs[entry.role] ?? '用到') + ' · ' + lessonTitle(entry.lesson),
    })),
    { id: 'transfer', title: '换新材料再试' }];
  document.title = skill.name + ' · 我的语文书房';
  root.classList.add('guided-skill');
  const directory = usePracticeHeader(skill.id);
  const transfer = methodEvidence(skill.id);
  root.innerHTML = `
    <div class="page-head">
      <h1>${escapeHtml(skill.name)}</h1>
      <p class="lead">${escapeHtml(skill.goal)}</p>
    </div>
    <div class="learning-layout">${learningRail.render(stages)}<div class="learning-content">
    <section class="skill-section panel" id="recall" data-skill-pane hidden aria-labelledby="recall-title">
      <h2 id="recall-title" tabindex="-1">先回想一个小学学过的办法</h2>
      <p class="skill-source">${escapeHtml(skill.recall.source)}</p>
      ${quickQuestion(skill.recall, recallKey, taskIds[startIndex])}
      <details class="skill-method">
        <summary>做题时怎么想</summary>
        ${skill.recall.takeaway ? '<p>' + escapeHtml(skill.recall.takeaway) + '</p>' : ''}
        <ol>${skill.method.map((step) => '<li>' + escapeHtml(step) + '</li>').join('')}</ol>
        <p>${escapeHtml(skill.pitfall)}</p>
      </details>
    </section>
    <section class="skill-section" id="in-text" data-skill-pane hidden aria-label="到课文里用一次">
      ${entries.map((entry, index) => {
        const id = taskIds[index];
        const nextId = taskIds[index + 1] ?? 'transfer';
        const related = reusedSummary && index === startIndex ? '<p class="skill-material skill-reused"><strong>刚才整理的《散步》梗概</strong><br>'
          + escapeHtml(reusedSummary) + '</p>' : '';
        return `<section class="skill-task panel" id="${id}" hidden>
          <h2 tabindex="-1">${escapeHtml(lessonTitle(entry.lesson))}</h2>
          <p class="skill-task-progress"></p>
          ${related}
          ${exerciseTemplate(entry, id, nextId, skill.id)}
        </section>`;
      }).join('')}
    </section>
    <section class="skill-section panel" id="transfer" data-skill-pane hidden aria-labelledby="transfer-title">
      <h2 id="transfer-title" tabindex="-1">换一段，自己试</h2>
      ${learningEvidence.render(transfer, escapeHtml)}
      <button type="button" class="skill-button" data-method-evidence-check>核对答案</button>
      <p class="learning-state" data-method-evidence-status role="status" hidden></p>
      <div data-method-open-transfer hidden>${exerciseTemplate(skill.transfer, 'transfer-task')}</div>
    </section>
    <div class="learning-controls"><button class="learning-back" type="button" data-skill-back hidden>← 上一步</button></div>
    </div></div>`;
  bindQuick(root, skill.recall, recallKey, () => remember(skill.id, 'recall'));
  entries.forEach((entry, index) => bindExercise(root, entry, taskIds[index], skill.id, legacyId(entry, index)));
  bindExercise(root, skill.transfer, 'transfer-task', skill.id);
  bindTransferEvidence(root.querySelector('#transfer'), transfer, skill.id);
  root.querySelector('#transfer [data-action=continue]').href = directory;
  waitForWrites(root);

  const rail = root.querySelector('.learning-rail');
  const back = root.querySelector('[data-skill-back]');
  let currentIndex = 0;
  back.addEventListener('click', () => {
    const previous = stages[currentIndex - 1];
    if (previous) location.hash = previous.id;
  });

  function openLinkedExercise(moveFocus) {
    const hash = location.hash.slice(1);
    const linkedIndex = entries.findIndex((entry, index) => taskIds[index] === hash || legacyId(entry, index) === hash);
    const step = hash === 'transfer' || hash === 'transfer-task' ? 'transfer'
      : linkedIndex >= 0 || hash === 'in-text' || (!hash && lessonIndex >= 0) ? 'in-text' : 'recall';
    const taskIndex = linkedIndex >= 0 ? linkedIndex : startIndex;
    const active = step === 'in-text' ? taskIds[taskIndex] : step;
    root.querySelectorAll('[data-skill-pane]').forEach((pane) => { pane.hidden = pane.id !== step; });
    root.querySelectorAll('.skill-task').forEach((task) => { task.hidden = task.id !== active; });
    currentIndex = stages.findIndex((item) => item.id === active);
    learningRail.update(rail, stages, currentIndex);
    back.hidden = currentIndex === 0;
    if (moveFocus) document.getElementById(active).querySelector('h2')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', () => openLinkedExercise(true));
  openLinkedExercise(Boolean(location.hash));
}

export async function mountRelatedSkills() {
  const lesson = Number(document.body.dataset.lesson?.slice(1));
  const extra = document.body.dataset.extra;
  const head = document.querySelector('.lesson-stage .page-head');
  if (!head || document.querySelector('.lesson-skills')) return;
  await loadSkills();
  const matching = skills.filter((skill) => lesson
    ? skill.entries.some((entry) => entry.lesson === lesson) || relatedLessonMethods[lesson]?.includes(skill.id)
    : extraSkills[extra]?.includes(skill.id));
  if (!matching.length) return;

  const disclosure = document.createElement('details');
  disclosure.className = 'lesson-skills-disclosure';
  const summary = document.createElement('summary');
  summary.textContent = '用这课再练一个方法';
  const section = document.createElement('nav');
  section.className = 'lesson-skills';
  disclosure.append(summary, section);
  section.setAttribute('aria-label', '这页可以练的方法');
  const params = new URLSearchParams(location.search);
  const fromSkill = params.get('fromSkill');
  const fromTask = params.get('fromTask');
  const methodQuery = params.get('methodQuery');
  const sourceSkill = matching.find((skill) => skill.id === fromSkill);
  const taskIndex = sourceSkill?.entries.findIndex((entry, index) => entry.lesson === lesson
    && (exerciseId(entry, index) === fromTask || legacyId(entry, index) === fromTask)) ?? -1;
  const reading = document.getElementById('sec-read');
  if (taskIndex >= 0 && reading) {
    const task = sourceSkill.entries[taskIndex];
    const evidence = document.createElement('section');
    evidence.className = 'panel lesson-evidence';
    evidence.innerHTML = '<h3>刚才那道题的证据</h3><p>' + escapeHtml(task.source) + '</p>'
      + evidenceList(task) + '<a class="return-to-skill" href="' + escapeHtml(entryUrl(sourceSkill.id, task, taskIndex, methodQuery))
      + '">继续刚才的练习 →</a>';
    reading.querySelector('.section-label')?.after(evidence);
    if (location.hash === '#sec-read') {
      requestAnimationFrame(() => {
        evidence.querySelector('a').focus({ preventScroll: true });
        evidence.scrollIntoView({ block: 'nearest' });
      });
    }
  }
  matching.forEach((skill) => {
    const link = document.createElement('a');
    const index = skill.entries.findIndex((entry) => entry.lesson === lesson);
    link.href = index < 0 ? skillUrl(skill.id) : entryUrl(skill.id, skill.entries[index], index);
    link.textContent = skill.name;
    section.append(link);
  });
  document.querySelector('#sec-recap, [data-learning-pane]:last-of-type')?.append(disclosure);
}

function renderFailure(root) {
  setSkillsHeader('index.html', '七上目录');
  root.innerHTML = '<div class="page-head"><h1>按方法练</h1></div>'
    + retryMarkup('这道练习暂时没打开。');
  bindReload(root);
}

async function boot(root) {
  const params = new URLSearchParams(location.search);
  if (params.get('start') === 'walk') {
    const mountStarter = await readContent(() => import('./skills-starter.js?v=strict-check'), 'mountStarter');
    usePracticeHeader();
    mountStarter(root, {
      narrativeHref: skillUrl('narrative') + '&lesson=6#in-text',
      themeHref: skillUrl('theme') + '&lesson=6',
      transferHref: skillUrl('narrative') + '#transfer',
    });
    return;
  }
  await loadSkills();
  const selectedId = params.get('skill');
  const selected = skills.find((skill) => skill.id === selectedId);
  if (selected) {
    let summary = '';
    if (selected.id === 'theme' && Number(params.get('lesson')) === 6) {
      if (params.get('from') === 'walk') {
        const { walkSummary } = await import('./skills-starter.js?v=strict-check').catch(() => ({}));
        summary = walkSummary ?? '';
      } else if (params.get('from') === 'narrative') {
        const narrative = skills.find((skill) => skill.id === 'narrative');
        const index = narrative?.entries.findIndex((entry) => entry.lesson === 6) ?? -1;
        if (index >= 0) {
          const entry = narrative.entries[index];
          const record = loadRecord('narrative:' + exerciseId(entry, index), 'narrative:' + legacyId(entry, index)).data;
          summary = record.revisionDone && hasText(record.revision) ? record.revision : record.draft ?? '';
        }
      }
    }
    renderDetail(root, selected, Number(params.get('lesson')), summary);
  } else if (!skills.length || selectedId && orderedIds.includes(selectedId)) {
    renderFailure(root);
  } else {
    renderHome(root, params.get('q') ?? '');
  }
}

const app = document.querySelector('[data-skills-app]');
if (app) {
  import('../assets/parent-settings.js?v=1').then(({ mountParentSettings }) => {
    mountParentSettings({
      subject: 'chinese',
      label: '语文',
      onReload: () => location.replace('index.html'),
    });
  }).catch(() => {});
  boot(app).catch(() => renderFailure(app));
}
