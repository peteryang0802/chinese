(function () {
  'use strict';

  const toc = document.getElementById('toc');
  if (typeof BOOK_G7A === 'undefined') {
    toc.innerHTML = '<p role="alert">目录暂时没加载出来。</p>'
      + '<button type="button" class="learning-action">重新加载</button>';
    toc.querySelector('button').addEventListener('click', () => location.reload());
    return;
  }

  const rail = document.getElementById('unit-jump');
  const results = document.getElementById('find-results');
  const resultCount = document.getElementById('find-count');
  const matchesList = document.getElementById('find-matches');
  const empty = document.getElementById('find-empty');
  const field = document.getElementById('find-input');
  const resume = document.getElementById('resume');
  const question = document.getElementById('resume-hook');
  const unitLinks = new Map();
  const sections = new Map();
  const entries = new Map();

  function entryRow(entry, setId) {
    const row = document.createElement('li');
    const link = document.createElement('a');
    link.href = entry.href;
    if (setId) link.id = entry.anchor;
    if (entry.number !== undefined) {
      const number = document.createElement('span');
      number.className = 'directory-number';
      number.textContent = entry.number;
      link.append(number);
    }
    const label = document.createElement('span');
    label.textContent = entry.title;
    if (entry.star) {
      const selfRead = document.createElement('small');
      selfRead.className = 'directory-self';
      selfRead.textContent = '（自读）';
      label.append(selfRead);
    }
    link.append(label);
    if (entry.author) {
      const author = document.createElement('span');
      author.className = 'directory-author';
      author.textContent = entry.author;
      link.append(author);
    }
    row.append(link);
    return row;
  }

  function addEntries(unit, group, list) {
    for (const entry of group) {
      entry.unit = unit.id;
      entry.anchor = 'entry-' + entry.href.replace(/\.html$/, '');
      entries.set(entry.href, entry);
      list.append(entryRow(entry, true));
    }
  }

  const railHeading = document.createElement('h2');
  railHeading.textContent = '单元目录';
  const railList = document.createElement('ol');
  rail.replaceChildren(railHeading, railList);
  toc.replaceChildren();
  for (const unit of BOOK_G7A.units) {
    const section = document.createElement('section');
    section.id = 'unit-' + unit.id;
    section.hidden = true;
    section.className = 'directory-unit';
    section.setAttribute('aria-labelledby', 'unit-title-' + unit.id);
    const heading = document.createElement('h2');
    heading.id = 'unit-title-' + unit.id;
    heading.tabIndex = -1;
    heading.textContent = unit.title;
    const theme = document.createElement('p');
    theme.className = 'directory-unit-theme';
    theme.textContent = unit.theme;
    const lessons = document.createElement('ul');
    lessons.className = 'directory-entries';
    addEntries(unit, unit.lessons.map(lesson => ({
      title: lesson.title, author: lesson.author, number: lesson.no, star: lesson.star,
      href: 'lesson-' + String(lesson.no).padStart(2, '0') + '.html',
    })), lessons);
    section.append(heading, theme, lessons);
    if (unit.extras.length) {
      const activities = document.createElement('h3');
      activities.textContent = '配套活动';
      const activityList = document.createElement('ul');
      activityList.className = 'directory-entries';
      addEntries(unit, unit.extras.map(extra => ({ title: extra.label, href: extra.href })), activityList);
      section.append(activities, activityList);
    }
    sections.set(unit.id, section);
    toc.append(section);
    const row = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#' + section.id;
    link.textContent = unit.title;
    row.append(link);
    railList.append(row);
    unitLinks.set(unit.id, link);
  }
  rail.hidden = false;

  function updateResume(unit) {
    let last;
    try { last = entries.get(localStorage.getItem('g7a-last')); } catch {}
    const first = Array.from(entries.values()).find(entry => entry.unit === (unit ?? BOOK_G7A.units[0].id));
    const next = last ?? first;
    if (next) {
      const link = document.getElementById('resume-entry');
      link.href = next.href;
      question.hidden = Boolean(last) || next.number !== 1;
      const label = last ? '继续上次：' : next.number === 1 ? '翻开' : '从本单元开始：';
      link.textContent = (next.number === 1 && !last ? label + '《' + next.title + '》' : label + next.title) + ' →';
      link.hidden = false;
    }
    return last;
  }

  const defaultUnit = updateResume()?.unit ?? BOOK_G7A.units[0].id;
  window.addEventListener('pageshow', event => { if (event.persisted) updateResume(current); });
  let current = defaultUnit;

  function clearResults() {
    results.hidden = true;
    toc.hidden = false;
    resume.hidden = false;
    matchesList.replaceChildren();
    resultCount.textContent = '';
  }

  function showUnit(unit, focusTarget) {
    current = unit;
    clearResults();
    updateResume(unit);
    for (const [id, section] of sections) {
      section.hidden = id !== unit;
      if (id === unit) unitLinks.get(id).setAttribute('aria-current', 'true');
      else unitLinks.get(id).removeAttribute('aria-current');
    }
    if (focusTarget) focusTarget.focus();
  }

  function openHash() {
    const target = location.hash.slice(1);
    if (target === 'main') return;
    const unit = /^unit-(\d+)$/.exec(target);
    if (unit && sections.has(Number(unit[1]))) {
      field.value = '';
      const id = Number(unit[1]);
      showUnit(id, sections.get(id).querySelector('h2'));
      return;
    }
    const item = Array.from(entries.values()).find(entry => entry.anchor === target);
    if (item) {
      field.value = '';
      showUnit(item.unit, document.getElementById(item.anchor));
      return;
    }
    showUnit(defaultUnit);
  }

  function search() {
    const query = field.value.normalize('NFKC').toLowerCase().trim();
    if (!query) {
      showUnit(current);
      return;
    }
    const number = query.match(/^(?:第\s*)?(\d+)(?:\s*课)?$/)?.[1];
    const matches = Array.from(entries.values()).filter(item =>
      (number !== undefined && item.number === Number(number))
      || item.title.toLowerCase().includes(query)
      || item.author?.toLowerCase().includes(query));
    matchesList.replaceChildren(...matches.map(item => entryRow(item, false)));
    resultCount.textContent = `找到 ${matches.length} 项。`;
    empty.hidden = matches.length > 0;
    toc.hidden = true;
    results.hidden = false;
    resume.hidden = true;
    for (const link of unitLinks.values()) link.removeAttribute('aria-current');
  }

  field.addEventListener('input', search);
  field.form.addEventListener('submit', event => {
    event.preventDefault();
    if (matchesList.children.length === 1) matchesList.querySelector('a').click();
  });
  document.getElementById('find-clear').addEventListener('click', () => {
    field.value = '';
    showUnit(current, unitLinks.get(current));
  });
  rail.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (link && link.hash === location.hash && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      openHash();
    }
  });
  window.addEventListener('hashchange', openHash);
  showUnit(defaultUnit);
  openHash();
})();
