import { readingSkills } from './skills-content-reading.js';
import { genreSkills } from './skills-content-genres.js';
import { languageSkills } from './skills-content-language.js';

const orderedIds = ['narrative', 'paragraph', 'structure', 'theme', 'explanation', 'punctuation', 'words'];
const allSkills = [...readingSkills, ...genreSkills, ...languageSkills];
const skills = orderedIds.map((id) => allSkills.find((skill) => skill.id === id)).filter(Boolean);
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
  'practice-2': ['words', 'punctuation'],
  'writing-2': ['narrative', 'punctuation'],
  'practice-3': ['paragraph', 'theme'],
  'writing-3': ['theme'],
  'practice-4': ['paragraph', 'structure'],
  'writing-4': ['structure'],
  'task-5b': ['explanation'],
  'task-5c': ['explanation', 'narrative'],
};

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const lessonNumber = (number) => String(number).padStart(2, '0');
function lessonUrl(number, skillId, taskId) {
  const file = 'lesson-' + lessonNumber(number) + '.html';
  const back = skillId && taskId ? '?' + new URLSearchParams({ fromSkill: skillId, fromTask: taskId }) : '';
  return file + back + '#sec-read';
}
const skillUrl = (id) => 'skills.html?skill=' + encodeURIComponent(id);
const lessonTitle = (number) => window.BOOK_G7A?.units
  .flatMap((unit) => unit.lessons).find((lesson) => lesson.no === number)?.title ?? ('第 ' + number + ' 课');
const exerciseId = (entry, index) => 'lesson-' + lessonNumber(entry.lesson) + '-' + (index + 1);
const bookKey = 'g7a-skills-v1:';
const hasText = (value) => typeof value === 'string' && Boolean(value.trim());
const sessionRecords = new Map();

function readRecord(key) {
  try {
    const value = JSON.parse(localStorage.getItem(bookKey + key) || 'null');
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  } catch {
    // Continue with this page's draft when storage is unavailable.
  }
  return sessionRecords.get(key) ?? {};
}

function writeRecord(key, record) {
  sessionRecords.set(key, record);
  try {
    localStorage.setItem(bookKey + key, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

function transferStatus(skill) {
  const record = readRecord(skill.id + ':transfer');
  if (record.submitted) return hasText(record.revision) ? '换文已有订正' : '换文已交初答';
  if (hasText(record.draft)) return '换文练习有草稿';
  const worked = skill.entries.some((entry, index) =>
    readRecord(skill.id + ':' + exerciseId(entry, index)).submitted);
  return worked ? '已做课内练习' : '';
}

function renderHome(root, query) {
  root.innerHTML = `
    <div class="page-head">
      <div class="eyebrow">七年级上册</div>
      <h1>按方法练</h1>
      <p class="lead">每次选一个方法。先做一道小题，再到课文里试一次。</p>
      <a class="skill-start skill-button" href="skills.html?skill=narrative">第一次来，先试一道记事题 →</a>
    </div>
    <div class="skill-lookup">
      <label for="skill-query">你想练什么？</label>
      <input id="skill-query" type="search" autocomplete="off" placeholder="比如 六要素、分段、标点">
    </div>
    <p class="skill-count" role="status"></p>
    <div class="skill-grid"></div>
    <p class="skill-tail"><a href="index.html">按课文找 →</a></p>`;
  const search = root.querySelector('#skill-query');
  const grid = root.querySelector('.skill-grid');
  const count = root.querySelector('.skill-count');
  search.value = query;
  function renderMatches() {
    const terms = search.value.trim().split(/\s+/).filter(Boolean);
    const matching = skills.filter((skill) => terms.every((term) =>
      (skill.name + ' ' + keywords[skill.id] + ' ' + skill.goal).includes(term)));
    grid.innerHTML = matching.map((skill) => {
      const progress = transferStatus(skill);
      return `<a class="skill-card" href="${skillUrl(skill.id)}">
        <strong>${escapeHtml(skill.name)}</strong>
        <span>${escapeHtml(skill.goal)}</span>
        ${progress ? '<small>' + escapeHtml(progress) + '</small>' : ''}
      </a>`;
    }).join('');
    count.textContent = matching.length
      ? (terms.length ? '找到 ' + matching.length + ' 个方法。' : '')
      : '没找到。可以试试「分段」「六要素」或「标点」。';
  }
  search.addEventListener('input', renderMatches);
  window.addEventListener('pageshow', renderMatches);
  renderMatches();
}

function quickQuestion(data, key) {
  return `<fieldset class="skill-quick" data-quick="${key}">
    <legend>${escapeHtml(data.question)}</legend>
    <div class="skill-options">${data.options.map((option, index) =>
      `<button type="button" aria-pressed="false" data-option="${index}">${escapeHtml(option.text)}</button>`,
    ).join('')}</div>
    <p class="skill-option-feedback" role="status"></p>
  </fieldset>`;
}

function bindQuick(parent, data, key) {
  const group = parent.querySelector('[data-quick="' + key + '"]');
  const buttons = [...group.querySelectorAll('[data-option]')];
  const feedback = group.querySelector('.skill-option-feedback');
  function select(index) {
    if (!Number.isInteger(index) || !data.options[index]) return;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    const correct = index === data.correct;
    feedback.dataset.tone = correct ? 'correct' : 'hint';
    feedback.textContent = (correct ? '选对了。' : '再想一步。') + data.options[index].why
      + (correct ? ' ' + data.takeaway : '');
  }
  select(readRecord(key).choice);
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    writeRecord(key, { choice: index });
    select(index);
  }));
}

function exerciseTemplate(item, id, nextId) {
  return `<div class="skill-exercise" data-exercise="${id}">
    ${item.source ? '<p class="skill-source">' + escapeHtml(item.source) + '</p>' : ''}
    <p class="skill-material">${escapeHtml(item.passage)}</p>
    ${item.quick ? quickQuestion(item.quick, id + '-quick') : ''}
    <label class="skill-question" for="${id}-draft">${escapeHtml(item.question)}</label>
    <textarea id="${id}-draft" rows="3" placeholder="先写一句，哪怕还不完整" data-field="draft"></textarea>
    <div class="skill-actions">
      <button type="button" class="skill-button" data-action="submit">交初答，看对照</button>
      <button type="button" class="skill-secondary" data-action="hint">我卡住了，给一点提示</button>
      ${item.role === '示范' ? '<button type="button" class="skill-secondary" data-action="example">先看示范</button>' : ''}
    </div>
    <p class="skill-hint" hidden></p>
    <p class="skill-status" role="status"></p>
    <section class="skill-review" hidden aria-labelledby="${id}-review">
      <h4 id="${id}-review" tabindex="-1">看看哪一点可以改</h4>
      <ul>${item.criteria.map((criterion) => '<li>' + escapeHtml(criterion) + '</li>').join('')}</ul>
      <p><strong>一种答法</strong> ${escapeHtml(item.example)}</p>
      <p><strong>容易漏的地方</strong> ${escapeHtml(item.commonError)}</p>
      <div class="skill-correction">
        <label for="${id}-revision">我现在会这样答</label>
        <textarea id="${id}-revision" rows="3" placeholder="用自己的话写一遍" data-field="revision"></textarea>
        <div class="skill-actions">
          <button type="button" class="skill-secondary" data-action="finish">保存这次订正</button>
          ${nextId ? '<a class="skill-text-link" href="#' + nextId + '">用到下一段 →</a>' : ''}
        </div>
      </div>
    </section>
  </div>`;
}

function bindExercise(root, item, id, key) {
  const exercise = root.querySelector('[data-exercise="' + id + '"]');
  const draft = exercise.querySelector('[data-field="draft"]');
  const revision = exercise.querySelector('[data-field="revision"]');
  const hint = exercise.querySelector('.skill-hint');
  const review = exercise.querySelector('.skill-review');
  const showExample = exercise.querySelector('[data-action="example"]');
  const status = exercise.querySelector('.skill-status');
  const submit = exercise.querySelector('[data-action="submit"]');
  const showHint = exercise.querySelector('[data-action="hint"]');
  const record = readRecord(key);
  const summaryStatus = exercise.closest('.skill-task')?.querySelector('.skill-task-progress');

  function updateSummary() {
    if (!summaryStatus) return;
    summaryStatus.textContent = hasText(record.revision) ? '已有订正' :
      record.submitted ? '已交初答' : hasText(record.draft) ? '有草稿' : '';
  }

  draft.value = typeof record.draft === 'string' ? record.draft : '';
  revision.value = typeof record.revision === 'string' ? record.revision : '';
  if (item.quick) bindQuick(exercise, item.quick, id + '-quick');

  function persist(message) {
    status.textContent = writeRecord(key, record) ? message : '浏览器无法保存。这一页打开时仍能继续练习。';
    updateSummary();
  }

  function sync() {
    draft.readOnly = record.submitted === true;
    submit.hidden = record.submitted === true;
    showHint.hidden = record.submitted === true || record.usedHint === true;
    hint.hidden = !record.usedHint || record.submitted === true;
    hint.textContent = '先试着做到这一点：' + item.criteria[0];
    if (showExample) showExample.hidden = record.submitted === true || record.viewedExample === true;
    review.hidden = record.submitted !== true && record.viewedExample !== true;
    exercise.querySelector('.skill-correction').hidden = record.submitted !== true;
  }

  sync();
  updateSummary();
  if (record.submitted) {
    status.textContent = record.usedHint ? '已提交初答，作答时看过提示。' : '已提交初答，作答前未打开提示。';
  }

  draft.addEventListener('input', () => {
    if (record.submitted) return;
    record.draft = draft.value;
    persist('草稿已保存。');
  });
  showHint.addEventListener('click', () => {
    record.usedHint = true;
    persist('提示已展开，可以接着写。');
    sync();
    draft.focus();
  });
  showExample?.addEventListener('click', () => {
    record.usedHint = true;
    record.viewedExample = true;
    persist('先看示范，再写一句你自己的想法。');
    sync();
    review.querySelector('h4').focus();
  });
  submit.addEventListener('click', () => {
    if (!hasText(draft.value)) {
      status.textContent = '先写一句你的想法。如果卡住，可以打开提示。';
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
    persist('订正草稿已保存。');
  });
  exercise.querySelector('[data-action="finish"]').addEventListener('click', () => {
    if (!hasText(revision.value)) {
      status.textContent = '把现在的想法写下来，再保存这次订正。';
      revision.focus();
      return;
    }
    record.revision = revision.value;
    persist('初答和订正都已保存。');
  });
}

function renderDetail(root, skill, selectedLesson) {
  const entries = skill.entries;
  const activeIndex = entries.findIndex((entry, index) => '#' + exerciseId(entry, index) === location.hash);
  const lessonIndex = entries.findIndex((entry) => entry.lesson === selectedLesson);
  const startIndex = activeIndex >= 0 ? activeIndex : Math.max(lessonIndex, 0);
  const recallKey = skill.id + ':recall';
  document.title = skill.name + ' · 我的语文书房';
  root.innerHTML = `
    <nav class="skill-back" aria-label="返回"><a href="skills.html">← 所有方法</a>
      ${lessonIndex >= 0 ? '<a href="' + lessonUrl(selectedLesson) + '">回 ' + escapeHtml(lessonTitle(selectedLesson)) + '</a>' : ''}
    </nav>
    <div class="page-head">
      <h1>${escapeHtml(skill.name)}</h1>
      <p class="lead">${escapeHtml(skill.goal)}</p>
    </div>
    <div class="skill-jumps">
      <a href="#in-text">直接做课内题</a><a href="#transfer">换材料试试</a>
    </div>
    <section class="skill-section panel" id="recall" aria-labelledby="recall-title">
      <h2 id="recall-title">先回想一个小学学过的办法</h2>
      <p class="skill-source">${escapeHtml(skill.recall.source)}</p>
      ${quickQuestion(skill.recall, recallKey)}
      <details class="skill-method">
        <summary>做题时怎么想</summary>
        <ol>${skill.method.map((step) => '<li>' + escapeHtml(step) + '</li>').join('')}</ol>
        <p>${escapeHtml(skill.pitfall)}</p>
      </details>
    </section>
    <section class="skill-section" id="in-text" aria-labelledby="in-text-title">
      <h2 id="in-text-title">到课文里用一次</h2>
      ${entries.map((entry, index) => {
        const id = exerciseId(entry, index);
        const following = entries[index + 1];
        const nextId = following ? exerciseId(following, index + 1) : 'transfer';
        return `<details class="skill-task panel" id="${id}"${index === startIndex ? ' open' : ''}>
          <summary><strong>${escapeHtml(lessonTitle(entry.lesson))}</strong><span>${escapeHtml(entry.role)}</span><span class="skill-task-progress"></span></summary>
          <div class="skill-entry-links">
            <a class="skill-text-link" href="${escapeHtml(lessonUrl(entry.lesson, skill.id, id))}">回课文找证据</a>
            <a class="skill-text-link" href="#recall">想不起方法？先做小题</a>
          </div>
          ${exerciseTemplate(entry, id, nextId)}
        </details>`;
      }).join('')}
    </section>
    <section class="skill-section panel" id="transfer" aria-labelledby="transfer-title">
      <h2 id="transfer-title">换一段，自己试</h2>
      ${exerciseTemplate(skill.transfer, 'transfer-task')}
    </section>
    <p class="skill-tail">作答和订正保存在当前浏览器。 <a href="skills.html">回到所有方法 →</a></p>`;
  bindQuick(root, skill.recall, recallKey);
  entries.forEach((entry, index) => {
    const id = exerciseId(entry, index);
    bindExercise(root, entry, id, skill.id + ':' + id);
  });
  bindExercise(root, skill.transfer, 'transfer-task', skill.id + ':transfer');
  function openLinkedExercise() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    if (target.tagName === 'DETAILS') target.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }

  window.addEventListener('hashchange', openLinkedExercise);
  openLinkedExercise();
}

export function mountRelatedSkills() {
  const lesson = Number(document.body.dataset.lesson?.slice(1));
  const extra = document.body.dataset.extra;
  const head = document.querySelector('.lesson-stage .page-head');
  if (!head || document.querySelector('.lesson-skills')) return;
  const matching = skills.filter((skill) => lesson
    ? skill.entries.some((entry) => entry.lesson === lesson)
    : extraSkills[extra]?.includes(skill.id));
  if (!matching.length) return;

  const section = document.createElement('nav');
  section.className = 'lesson-skills';
  section.setAttribute('aria-label', '这页可以练的方法');
  const label = document.createElement('strong');
  label.textContent = '这页可以练';
  section.append(label);
  const params = new URLSearchParams(location.search);
  const fromSkill = params.get('fromSkill');
  const fromTask = params.get('fromTask');
  const backTo = matching.find((skill) => skill.id === fromSkill && skill.entries.some(
    (entry, index) => entry.lesson === lesson && exerciseId(entry, index) === fromTask,
  ));
  if (backTo) {
    const back = document.createElement('a');
    back.className = 'return-to-skill';
    back.href = skillUrl(backTo.id) + '&lesson=' + lesson + '#' + fromTask;
    back.textContent = '继续刚才的练习 →';
    section.append(back);
  }
  matching.forEach((skill) => {
    const link = document.createElement('a');
    const index = skill.entries.findIndex((entry) => entry.lesson === lesson);
    link.href = index < 0 ? skillUrl(skill.id)
      : skillUrl(skill.id) + '&lesson=' + lesson + '#' + exerciseId(skill.entries[index], index);
    link.textContent = skill.name;
    section.append(link);
  });
  head.after(section);
}

const app = document.querySelector('[data-skills-app]');
if (app) {
  const params = new URLSearchParams(location.search);
  const selected = skills.find((skill) => skill.id === params.get('skill'));
  if (selected) renderDetail(app, selected, Number(params.get('lesson')));
  else renderHome(app, params.get('q') ?? '');
}
