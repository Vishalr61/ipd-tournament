import { CHARACTERS } from '../characters.js';

let go = null;

export function initSummaryView(navigateFn) {
  go = navigateFn;
  document.getElementById('view-summary')
    .querySelector('[data-action="continue"]')
    .addEventListener('click', onContinue);
}

export function showSummary(charIndex, match) {
  const char    = CHARACTERS[charIndex];
  const history = match.getHistory();
  const el      = document.getElementById('view-summary');

  el.style.setProperty('--char-color', CHARACTERS[charIndex].color);

  // Reset shown state so stagger replays correctly
  el.querySelector('.summary-final-scores').classList.remove('shown');
  el.querySelector('.summary-dots').classList.remove('shown');
  el.querySelector('.summary-text').classList.remove('shown');

  el.querySelector('.summary-score-value.you').textContent  = match.myScore;
  el.querySelector('.summary-score-value.them').textContent = match.theirScore;
  el.querySelector('.summary-score-who.them').textContent   = char.name;

  // Dots
  const dotsEl = el.querySelector('.summary-dots');
  dotsEl.innerHTML = '';
  const triggerRound = findGrimTriggerRound(char.strategyId, history);
  history.forEach(({ outcome }, i) => {
    const dot = document.createElement('span');
    dot.className = `dot ${outcome}`;
    if (i === triggerRound) dot.classList.add('trigger');
    dotsEl.appendChild(dot);
  });

  // Adaptive summary variant. Grim is binary — any defection gets summaryD.
  // All others: >50% cooperation → summaryC.
  let variant;
  if (char.strategyId === 'grim') {
    variant = history.some(r => r.humanMove === 'D') ? 'summaryD' : 'summaryC';
  } else {
    const coopCount = history.filter(r => r.humanMove === 'C').length;
    variant = coopCount > history.length / 2 ? 'summaryC' : 'summaryD';
  }
  el.querySelector('.summary-text').innerHTML =
    char[variant].map(p => `<p>${p}</p>`).join('');

  el.dataset.charIndex = charIndex;

  go('summary');

  // Stagger content in after the view transition settles
  setTimeout(() => el.querySelector('.summary-final-scores').classList.add('shown'), 120);
  setTimeout(() => el.querySelector('.summary-dots').classList.add('shown'),          400);
  setTimeout(() => el.querySelector('.summary-text').classList.add('shown'),           680);
}

function onContinue() {
  const charIndex = +document.getElementById('view-summary').dataset.charIndex;
  const next = charIndex + 1;
  if (next < CHARACTERS.length) {
    go('intro-card', { characterIndex: next });
  } else {
    go('campaign-end');
  }
}

function findGrimTriggerRound(strategyId, history) {
  if (strategyId !== 'grim') return -1;
  return history.findIndex(r => r.humanMove === 'D');
}
