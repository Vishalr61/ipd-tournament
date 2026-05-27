// Cold open and dilemma screens.
// Both receive `go` (the navigate callback) during init.

const PAYOFFS = { R: 3, T: 5, P: 1, S: 0 };

export function initColdOpen(go) {
  document.getElementById('view-cold-open')
    .querySelector('[data-action="continue"]')
    .addEventListener('click', () => go('dilemma'));
}

export function initDilemma(go) {
  const el       = document.getElementById('view-dilemma');
  const btnShare = el.querySelector('[data-action="share"]');
  const btnTake  = el.querySelector('[data-action="take"]');
  let played     = false;

  const questionWrap = el.querySelector('.dilemma-question-wrap');
  const btnContinue  = el.querySelector('[data-action="continue"]');

  function play(humanMove) {
    if (played) return;
    played = true;
    btnShare.disabled = true;
    btnTake.disabled  = true;
    btnShare.style.display = 'none';
    btnTake.style.display  = 'none';
    questionWrap.style.display = 'none';

    const botMove = 'D'; // scripted: stranger always takes

    let myPay, theirPay;
    if      (humanMove === 'C') { myPay = PAYOFFS.S; theirPay = PAYOFFS.T; }
    else                        { myPay = PAYOFFS.P; theirPay = PAYOFFS.P; }

    const yourSide  = el.querySelector('.reveal-your');
    const theirSide = el.querySelector('.reveal-their');
    const payoffEl  = el.querySelector('.reveal-payoff');
    const afterEl   = el.querySelector('.after-dilemma');

    el.querySelector('.reveal-your .move-chip').textContent  = humanMove === 'C' ? 'Shared' : 'Took';
    el.querySelector('.reveal-your .move-chip').className    = `move-chip ${humanMove === 'C' ? 'share' : 'take'}`;
    el.querySelector('.reveal-their .move-chip').textContent = 'Took';
    el.querySelector('.reveal-their .move-chip').className   = 'move-chip take';

    payoffEl.innerHTML = buildPayoffHTML(humanMove, botMove, myPay, theirPay);

    el.querySelector('.dilemma-reveal').style.display = 'flex';

    setTimeout(() => yourSide.classList.add('shown'),             50);
    setTimeout(() => theirSide.classList.add('shown'),           450);
    setTimeout(() => {
      payoffEl.classList.add('shown');
      afterEl.classList.add('shown');
      setTimeout(() => { btnContinue.style.display = ''; }, 600);
    }, 850);
  }

  btnShare.addEventListener('click', () => play('C'));
  btnTake.addEventListener('click',  () => play('D'));

  el.querySelector('[data-action="continue"]')
    .addEventListener('click', () => go('intro-card', { characterIndex: 0 }));
}

function buildPayoffHTML(human, _bot, myPay, theirPay) {
  if (human === 'C') {
    return `<p class="payoff-line">You got <span class="payoff-number bad">${myPay}</span>. They got <span class="payoff-number good">${theirPay}</span>.</p>`;
  }
  return `<p class="payoff-line">You each got <span class="payoff-number meh">${myPay}</span>.</p>`;
}
