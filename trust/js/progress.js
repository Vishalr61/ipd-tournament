const KEY = 'tg_state';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private browsing or storage full — degrade silently
  }
}

// Called after each completed round
export function saveProgress(charIndex, history) {
  const state = load() || {};
  state.charIndex  = charIndex;
  state.myMoves    = history.map(r => r.humanMove);
  state.theirMoves = history.map(r => r.botMove);
  save(state);
}

// Called when a character match is fully completed
export function markCompleted(charId, coopRate) {
  const state = load() || {};
  state.completed = state.completed || {};
  state.completed[charId] = coopRate >= 0.5 ? 'C' : 'D';
  // Clear mid-match state
  delete state.myMoves;
  delete state.theirMoves;
  save(state);
}

// Called when the whole campaign is finished
export function markCampaignDone() {
  const state = load() || {};
  state.done = true;
  save(state);
}

export function clearProgress() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

// Returns { charIndex, myMoves, theirMoves } or null if no saved state
export function getSavedProgress() {
  return load();
}
