import { mountParentSettings } from './parent-settings.js?v=1';

const exactKeys = [
  'g7a-last',
  'g7a-last-title',
  'g7a-mode',
  'gloss-hint-seen',
  'g7a-skills-resume-v2',
  // Older lesson and writing activities used these keys before their replacement.
  'l1-prep', 'l4-prep', 'l20-prep',
  'w1-try', 'w2-try', 'w3-try', 'w4-try', 'w6-try',
];

function collectBlockKeys(block, keys) {
  for (const key of [block.save, block.save1, block.save2]) {
    if (key) keys.add(key);
  }
  if (block.t === 'readlist') {
    keys.add(block.id + '-read');
    keys.add(block.id + '-mark');
  }
  block.blocks?.forEach((child) => collectBlockKeys(child, keys));
}

const entry = document.getElementById('chinese-parent-settings');
const lessons = window.LESSONS_G7A;
const extras = window.EXTRAS_G7A;
if (entry && lessons && extras) {
  const keys = new Set(exactKeys);
  for (const [id, lesson] of Object.entries(lessons)) {
    keys.add('g7a-step-' + id);
    for (const section of [lesson.prep, lesson.read, lesson.back]) {
      section.blocks.forEach((block) => collectBlockKeys(block, keys));
    }
  }
  for (const extra of Object.values(extras)) {
    for (const section of extra.sections) {
      section.blocks.forEach((block) => collectBlockKeys(block, keys));
    }
  }
  mountParentSettings({
    subject: 'chinese',
    label: '语文',
    entry,
    localKeys: Array.from(keys),
    localPrefixes: ['g7a-learning-stage:', 'g7a-skills-v1:', 'g7a-skills-v2:'],
  });
}
