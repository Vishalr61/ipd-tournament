import { STRATEGIES } from './strategies.js';

const PAYOFFS = { R: 3, T: 5, P: 1, S: 0 };

export function createMatch(strategyId) {
  const strategy = STRATEGIES[strategyId];
  const myMoves    = [];
  const theirMoves = [];
  let myScore    = 0;
  let theirScore = 0;

  function step(humanMove) {
    const botMove = strategy.move(theirMoves, myMoves);

    let myPay, theirPay;
    if      (humanMove === 'C' && botMove === 'C') { myPay = PAYOFFS.R; theirPay = PAYOFFS.R; }
    else if (humanMove === 'C' && botMove === 'D') { myPay = PAYOFFS.S; theirPay = PAYOFFS.T; }
    else if (humanMove === 'D' && botMove === 'C') { myPay = PAYOFFS.T; theirPay = PAYOFFS.S; }
    else                                            { myPay = PAYOFFS.P; theirPay = PAYOFFS.P; }

    myMoves.push(humanMove);
    theirMoves.push(botMove);
    myScore    += myPay;
    theirScore += theirPay;

    const outcome = outcomeLabel(humanMove, botMove);

    return { humanMove, botMove, myPay, theirPay, myScore, theirScore, outcome, round: myMoves.length };
  }

  function getHistory() {
    return myMoves.map((m, i) => ({
      humanMove: m,
      botMove:   theirMoves[i],
      outcome:   outcomeLabel(m, theirMoves[i]),
    }));
  }

  return { step, getHistory, get myScore() { return myScore; }, get theirScore() { return theirScore; } };
}

// Returns a CSS class name for the dot color
function outcomeLabel(human, bot) {
  if (human === 'C' && bot === 'C') return 'mutual-share';
  if (human === 'D' && bot === 'D') return 'mutual-take';
  if (human === 'C' && bot === 'D') return 'exploited';
  return 'exploiter';
}
