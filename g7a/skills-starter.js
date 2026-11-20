import { currentLearningEpoch } from './skills-storage.js?v=parents1';

const progressKey = 'g7a-skills-v1:walk-starter';
const choicesKey = progressKey + ':choices';
const stages = [{ title: '找出分歧' }, { title: '找出转折' }, { title: '换段文字练概括' }];

const questions = [
  {
    evidence: '母亲想走平顺的大路，儿子想走有意思的小路。',
    prompt: '他们为什么要商量？',
    choices: [
      { text: '两条路都走不通', reply: '两条路都能走。找找母亲和儿子各想走哪一条。' },
      { text: '他们想走不同的路', reply: '母亲选大路，儿子选小路。两人的想法不同，事情才需要商量。', correct: true },
      { text: '一家人走累了', reply: '这里写的是他们想走哪条路。看看两人的选择是否一样。' },
    ],
    next: '看看后来怎么变 →',
  },
  {
    evidence: '“我”先决定走大路。母亲摸摸孙儿的头，提议改走小路。',
    prompt: '哪一步改变了结果？',
    choices: [
      { text: '“我”先决定走大路', reply: '这是较早的决定。再找找后来谁提议换一条路。' },
      { text: '一家人出来散步', reply: '散步是事情的背景。决定走大路以后，发生了什么变化？' },
      { text: '母亲提议改走小路', reply: '母亲的新提议改变了原来的决定。最后一家人走了小路。', correct: true },
    ],
    next: '看看怎样讲清这件事 →',
  },
];

export const walkSummary =
  '一家人散步时在走大路还是小路上有了分歧。“我”先顾及母亲，决定走大路。母亲后来想到孙儿，提议走小路，全家最后走了小路。';

function savedStage() {
  try {
    const stored = localStorage.getItem(progressKey);
    return stored === '1' ? 1 : stored === '2' ? 2 : 0;
  } catch {
    return 0;
  }
}

function saveStage(stage) {
  if (!currentLearningEpoch()) return;
  try {
    if (stage === 0) localStorage.removeItem(progressKey);
    else localStorage.setItem(progressKey, String(stage));
  } catch {
    // The current round can still be completed when storage is unavailable.
  }
}

function centerUrl(href) {
  const url = new URL(href, location.href);
  url.searchParams.set('from', 'walk');
  return url.href;
}

export function mountStarter(root, { narrativeHref, themeHref, transferHref }) {
  let stage = savedStage();
  let savedChoices = {};
  try { savedChoices = JSON.parse(localStorage.getItem(choicesKey) || '{}') || {}; } catch {}
  document.title = '《散步》开场练习 · 我的语文书房';
  root.classList.add('guided-starter');
  root.innerHTML = `
    <div class="page-head">
      <h1 id="walk-title">一次散步，走哪条路？</h1>
      <p class="walk-source">题旁材料为课文情节改写。纸书《散步》第 27–28 页。</p>
    </div>
    <div class="learning-layout">${learningRail.render(stages)}<section class="learning-content walk-starter" aria-labelledby="walk-title">
      <div class="walk-card" id="walk-stage"></div>
      <div class="learning-controls"><button class="learning-back" type="button" data-walk-back hidden>← 上一步</button></div>
    </section></div>`;
  const stageNode = root.querySelector('#walk-stage');
  const rail = root.querySelector('.learning-rail');
  const back = root.querySelector('[data-walk-back]');
  back.addEventListener('click', () => moveTo(stage - 1));

  function moveTo(nextStage) {
    stage = nextStage;
    saveStage(stage);
    render();
    stageNode.querySelector('h2').focus();
  }

  function render() {
    learningRail.update(rail, stages, stage);
    back.hidden = stage === 0;
    if (stage === questions.length) {
      stageNode.innerHTML = `
        <h2 tabindex="-1">把散步的经过讲清楚</h2>
        <p class="walk-rule">讲一件事，先说遇到了什么，再说哪一步让结果变了。</p>
        <p class="walk-evidence walk-result"></p>
        <div class="walk-followups">
          <a class="walk-primary walk-transfer">换一段，试同一个方法 →</a>
          <details class="walk-other">
            <summary>其他练习</summary>
            <a class="walk-secondary walk-center">用这件事读懂文章中心</a>
            <a class="walk-secondary walk-narrative">回七上记叙方法</a>
            <button type="button" class="walk-restart">重新练这两步</button>
          </details>
        </div>`;
      stageNode.querySelector('.walk-result').textContent = walkSummary;
      stageNode.querySelector('.walk-center').href = centerUrl(themeHref);
      stageNode.querySelector('.walk-transfer').href = transferHref;
      stageNode.querySelector('.walk-narrative').href = narrativeHref;
      stageNode.querySelector('.walk-restart').addEventListener('click', () => moveTo(0));
      return;
    }
    const question = questions[stage];
    stageNode.innerHTML = `
      <h2 id="walk-question" tabindex="-1">${question.prompt}</h2>
      <p id="walk-evidence" class="walk-evidence">${question.evidence}</p>
      <fieldset class="walk-choices" aria-labelledby="walk-question" aria-describedby="walk-evidence">
        ${question.choices.map((choice) => '<button type="button" aria-pressed="false">' + choice.text + '</button>').join('')}
      </fieldset>
      <p class="learning-state" role="status"></p>
      <p class="walk-feedback" role="status" aria-atomic="true"></p>
      <div class="learning-controls">
        <button type="button" class="walk-primary walk-check">核对答案</button>
        <button type="button" class="walk-primary walk-next" hidden>${question.next}</button>
        <button type="button" class="learning-back learning-skip" data-walk-skip>先跳过</button>
      </div>`;
    const buttons = [...stageNode.querySelectorAll('.walk-choices button')];
    const status = stageNode.querySelector('.learning-state');
    const feedback = stageNode.querySelector('.walk-feedback');
    const check = stageNode.querySelector('.walk-check');
    const skip = stageNode.querySelector('[data-walk-skip]');
    const next = stageNode.querySelector('.walk-next');
    let state = learningCheck.restore(savedChoices[stage], buttons.length);
    function paint() {
      const passed = learningCheck.passed(state);
      const retry = state.status === 'retry';
      buttons.forEach((option, index) => {
        option.setAttribute('aria-pressed', String(index === state.choice));
        option.disabled = passed || retry;
      });
      status.textContent = learningCheck.label(state);
      feedback.textContent = passed ? question.choices[state.choice].reply
        : state.skipped ? '已留到下次。可以回到上一步重试。' : question.choices[state.missed]?.reply ?? '';
      feedback.classList.toggle('is-correct', passed);
      check.hidden = passed;
      check.disabled = state.choice === null && !retry;
      check.textContent = retry ? '按线索再试' : '核对答案';
      next.hidden = !passed;
      skip.hidden = passed;
    }
    function update(changed) {
      if (!currentLearningEpoch()) return;
      state = changed;
      savedChoices[stage] = state;
      try { localStorage.setItem(choicesKey, JSON.stringify(savedChoices)); } catch {}
      paint();
    }
    paint();
    buttons.forEach((button, index) => button.addEventListener('click', () => update({ ...state, choice: index })));
    check.addEventListener('click', () => {
      if (state.status === 'retry') {
        update({ ...state, status: 'unchecked', skipped: false });
        (buttons[state.choice] ?? buttons[0]).focus();
      } else {
        update(learningCheck.check(state, question.choices.findIndex((choice) => choice.correct)));
        if (learningCheck.passed(state)) next.focus();
      }
    });
    skip.addEventListener('click', () => {
      update({ ...state, status: 'retry', skipped: true });
      moveTo(stage + 1);
    });
    next.addEventListener('click', () => moveTo(stage + 1));
  }

  render();
}
