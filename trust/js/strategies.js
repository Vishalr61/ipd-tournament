// move(myMoves, theirMoves) → 'C' | 'D'
// myMoves / theirMoves are arrays of past moves from each player's perspective

export const STRATEGIES = {
  allC: {
    move: () => 'C',
  },

  allD: {
    move: () => 'D',
  },

  tft: {
    move: (_my, their) => their.length === 0 ? 'C' : their[their.length - 1],
  },

  grim: {
    move: (_my, their) => their.includes('D') ? 'D' : 'C',
  },

  tf2t: {
    move: (_my, their) => {
      const n = their.length;
      if (n < 2) return 'C';
      return (their[n - 1] === 'D' && their[n - 2] === 'D') ? 'D' : 'C';
    },
  },

  pavlov: {
    move: (my, their) => {
      if (my.length === 0) return 'C';
      const lastMy    = my[my.length - 1];
      const lastTheir = their[their.length - 1];
      // Win (R or T) → stay; Lose (S or P) → shift
      const won = (lastMy === 'C' && lastTheir === 'C') || (lastMy === 'D' && lastTheir === 'C');
      return won ? lastMy : (lastMy === 'C' ? 'D' : 'C');
    },
  },
};
