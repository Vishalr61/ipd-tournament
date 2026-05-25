export function getPayoffs() {
  return {
    R: +document.getElementById('pay-R').value,
    T: +document.getElementById('pay-T').value,
    P: +document.getElementById('pay-P').value,
    S: +document.getElementById('pay-S').value,
  };
}

export function runMatch(stratA, stratB, rounds, payoffs) {
  const { R, T, P, S } = payoffs;
  const mA = [], mB = [];
  let sA = 0, sB = 0;
  const roundLog = [];

  for (let r = 0; r < rounds; r++) {
    const ma = stratA.move(mA, mB);
    const mb = stratB.move(mB, mA);

    let pa, pb;
    if      (ma === 'C' && mb === 'C') { pa = R; pb = R; }
    else if (ma === 'C' && mb === 'D') { pa = S; pb = T; }
    else if (ma === 'D' && mb === 'C') { pa = T; pb = S; }
    else                               { pa = P; pb = P; }

    sA += pa; sB += pb;
    mA.push(ma); mB.push(mb);
    roundLog.push({ ma, mb, pa, pb });
  }

  return { scoreA: sA / rounds, scoreB: sB / rounds, roundLog };
}

export function runTournament(strategies, rounds, payoffs) {
  const n = strategies.length;
  const scores  = Array.from({ length: n }, () => new Array(n).fill(null));
  const matches = {};

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const key = `${i}-${j}`;
      const rev = `${j}-${i}`;
      if (matches[key]) continue;

      const result = runMatch(strategies[i], strategies[j], rounds, payoffs);
      matches[key] = result;
      scores[i][j] = result.scoreA;

      if (i !== j) {
        // Store reverse view without re-running (deterministic strategies only differ by RNG)
        const revResult = {
          scoreA: result.scoreB,
          scoreB: result.scoreA,
          roundLog: result.roundLog.map(r => ({ ma: r.mb, mb: r.ma, pa: r.pb, pb: r.pa })),
        };
        matches[rev] = revResult;
        scores[j][i] = revResult.scoreA;
      }
    }
  }

  return { scores, matches };
}

export function runEvolution(strategies, rounds, generations, noiseFrac, payoffs) {
  const n = strategies.length;
  let pop = new Array(n).fill(1 / n);
  const history = [pop.slice()];

  for (let g = 0; g < generations; g++) {
    const { scores } = runTournament(strategies, rounds, payoffs);

    // Fitness: expected score against population-weighted opponent
    const fitness = strategies.map((_, i) =>
      scores[i].reduce((acc, s, j) => acc + pop[j] * (s ?? 0), 0)
    );

    // Replicator dynamics: p_i' ∝ p_i * f_i
    const avgF = fitness.reduce((acc, f, i) => acc + f * pop[i], 0);
    if (avgF === 0) break;
    pop = pop.map((p, i) => p * fitness[i] / avgF);

    // Mutation: blend toward uniform
    if (noiseFrac > 0) {
      pop = pop.map(p => p * (1 - noiseFrac) + noiseFrac / n);
    }

    // Normalise (float drift)
    const total = pop.reduce((a, b) => a + b, 0);
    pop = pop.map(p => p / total);

    history.push(pop.slice());
  }

  return history;
}
