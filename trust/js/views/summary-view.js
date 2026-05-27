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

  el.querySelector('.summary-score-value.you').textContent  = match.myScore;
  el.querySelector('.summary-score-value.them').textContent = match.theirScore;
  el.querySelector('.summary-score-who.them').textContent   = char.name;

  const dotsEl = el.querySelector('.summary-dots');
  dotsEl.innerHTML = '';
  history.forEach(({ outcome }) => {
    const dot = document.createElement('span');
    dot.className = `dot ${outcome}`;
    dotsEl.appendChild(dot);
  });

  el.querySelector('.summary-text').innerHTML =
    char.summary.map(p => `<p>${p}</p>`).join('');

  el.dataset.charIndex = charIndex;
}

function onContinue() {
  const charIndex = +document.getElementById('view-summary').dataset.charIndex;
  const next = charIndex + 1;
  if (next < CHARACTERS.length) {
    go('intro-card', { characterIndex: next });
  } else {
    go('reveal');
  }
}
