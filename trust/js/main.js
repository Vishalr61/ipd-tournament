import { CHARACTERS } from './characters.js';
import { buildSilhouette } from './silhouette.js';
import { initColdOpen, initDilemma } from './views/intro.js';
import { initMatchView, startMatch } from './views/match-view.js';
import { initSummaryView, showSummary } from './views/summary-view.js';
import { getSavedProgress, clearProgress, markCampaignDone } from './progress.js';

// ── Router ────────────────────────────────────────────────────────────────────

const VIEWS = ['cold-open', 'dilemma', 'intro-card', 'match', 'summary', 'campaign-end', 'reveal'];

export function navigate(viewName, params = {}) {
  VIEWS.forEach(v => document.getElementById(`view-${v}`)?.classList.remove('active'));

  const target = document.getElementById(`view-${viewName}`);
  if (!target) { console.warn('Unknown view:', viewName); return; }

  target.classList.add('active', 'view-enter');
  target.addEventListener('animationend', () => target.classList.remove('view-enter'), { once: true });

  if (viewName === 'intro-card' && params.characterIndex !== undefined) {
    renderIntroCard(params.characterIndex);
  }

  if (viewName === 'summary' && params.match) {
    showSummary(params.charIndex, params.match);
  }

  if (viewName === 'campaign-end') {
    markCampaignDone();
  }

  if (viewName === 'reveal') {
    renderReveal();
  }
}

// ── Intro card ────────────────────────────────────────────────────────────────

function renderIntroCard(charIndex) {
  const char = CHARACTERS[charIndex];
  const el   = document.getElementById('view-intro-card');

  el.querySelector('.char-silhouette-wrap').innerHTML = buildSilhouette(char.id, char.color);
  el.querySelector('.char-name').textContent          = char.name;
  el.querySelector('.char-intro-text').textContent    = char.intro;
  el.querySelector('[data-action="begin-match"]').onclick = () => startMatch(charIndex);
}

// ── Reveal screen ─────────────────────────────────────────────────────────────

function renderReveal() {
  const listEl = document.getElementById('reveal-list');
  listEl.innerHTML = '';
  CHARACTERS.forEach(char => {
    const item = document.createElement('div');
    item.className = 'reveal-item';
    item.innerHTML = `
      <div class="reveal-pip" style="background:${char.color}"></div>
      <div class="reveal-item-body">
        <span class="reveal-char-name">${char.name}</span>
        <span class="reveal-strategy-name">${char.revealName}</span>
        ${char.revealNote ? `<p class="reveal-note">${char.revealNote}</p>` : ''}
      </div>`;
    listEl.appendChild(item);
  });
}

// ── Boot & resume ─────────────────────────────────────────────────────────────

function boot() {
  initColdOpen(navigate);
  initDilemma(navigate);
  initMatchView(navigate);
  initSummaryView(navigate);

  // Campaign-end "play again" button
  document.getElementById('view-campaign-end')
    ?.querySelector('[data-action="play-again"]')
    ?.addEventListener('click', () => {
      clearProgress();
      navigate('cold-open');
    });

  // Campaign-end "reveal" button
  document.getElementById('view-campaign-end')
    ?.querySelector('[data-action="reveal"]')
    ?.addEventListener('click', () => navigate('reveal'));

  // Resume from saved progress
  const saved = getSavedProgress();
  if (saved?.done) {
    navigate('campaign-end');
  } else if (saved?.charIndex !== undefined) {
    // Resume at the start of wherever they left off
    navigate('intro-card', { characterIndex: saved.charIndex });
  } else {
    navigate('cold-open');
  }
}

boot();
