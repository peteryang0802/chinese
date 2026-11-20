(function () {
  'use strict';

  const labels = {
    unchecked: '未核对',
    retry: '待重试',
    assisted: '提示或重试后完成',
    independent: '首次独立完成',
  };

  function restore(saved, optionCount) {
    const previous = Number.isInteger(saved) ? { choice: saved } : saved;
    const choice = previous?.choice;
    const validChoice = Number.isInteger(choice) && choice >= 0 && choice < optionCount;
    const missed = previous?.missed;
    const hasStatus = Object.hasOwn(labels, previous?.status);
    return {
      choice: validChoice ? choice : null,
      status: hasStatus && (validChoice || previous.skipped === true) ? previous.status : 'unchecked',
      // Old versions showed feedback as soon as an answer was selected.
      helped: previous?.helped === true || (validChoice && !hasStatus),
      skipped: previous?.skipped === true,
      missed: Number.isInteger(missed) && missed >= 0 && missed < optionCount ? missed : null,
    };
  }

  function passed(state) {
    return state.status === 'assisted' || state.status === 'independent';
  }

  function outcome(state, correct) {
    if (!correct) return { ...state, status: 'retry', helped: true };
    return { ...state, status: state.helped ? 'assisted' : 'independent' };
  }

  function check(state, correct) {
    if (state.status !== 'unchecked' || state.choice === null) return state;
    return outcome(state.choice === correct ? state : { ...state, missed: state.choice }, state.choice === correct);
  }

  globalThis.learningCheck = {
    restore, passed, check, outcome,
    label: (state, transfer) => transfer && state.status === 'independent' ? '新材料首次独立完成' : labels[state.status],
  };
})();
