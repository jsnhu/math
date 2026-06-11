// ── app.js — shared utilities ──

// ── Theme ──
function initTheme() {
  const saved = localStorage.getItem('mm-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButtons();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('mm-theme', next);
  updateThemeButtons();
}

function updateThemeButtons() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
  });
}

// ── Shuffle (Fisher-Yates) ──
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Random int in [min, max] inclusive
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Numbers with exactly `digits` digits
function randomWithDigits(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return randInt(min, max);
}

// ── Flash ──
function flashCorrect() {
  const overlay = document.getElementById('flashOverlay');
  if (!overlay) return;
  overlay.classList.add('active');
  setTimeout(() => overlay.classList.remove('active'), 140);
}

// ── Keyboard map: letter-layout numpad (789 / uio / jkl / m) ──
// Maps keyboard keys → digit strings
const KEY_MAP = {
  // Top letter row (7-9)
  '7':'7', '8':'8', '9':'9',
  // QWERTY home-ish rows
  'u':'4', 'i':'5', 'o':'6',
  'j':'1', 'k':'2', 'l':'3',
  'm':'0', ',':'0',
  // Standard numpad (NumLock on) — already digit keys, handled below
};

// ── Numpad wiring ──
function wireNumpad(onInput) {
  // touch-action: manipulation prevents double-tap zoom on each key
  document.querySelectorAll('.key').forEach(key => {
    key.style.touchAction = 'manipulation';
    key.addEventListener('pointerdown', e => {
      e.preventDefault();
      key.classList.add('pressed');
      onInput(key.dataset.val);
    });
    key.addEventListener('pointerup',    () => key.classList.remove('pressed'));
    key.addEventListener('pointerleave', () => key.classList.remove('pressed'));
  });

  // Extra iOS safety: prevent zoom on rapid double-tap of keys
  document.addEventListener('touchend', e => {
    if (e.target.closest('.key, .btn, .stepper-btn')) e.preventDefault();
  }, { passive: false });

  // Physical keyboard input
  document.addEventListener('keydown', e => {
    // Don't intercept while typing in settings inputs
    if (e.target.tagName === 'INPUT') return;

    // Regular digit row & numpad digits
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      onInput(e.key);
      return;
    }
    // Backspace / numpad delete
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      onInput('del');
      return;
    }
    // Letter-layout numpad mapping
    const mapped = KEY_MAP[e.key.toLowerCase()];
    if (mapped !== undefined) {
      e.preventDefault();
      onInput(mapped);
    }
  });
}

// ── Answer input helpers ──
function applyInput(current, val) {
  if (val === 'del') return current.slice(0, -1);
  if (current.length >= 9) return current;
  if (current === '' && val === '0') return current;
  return current + val;
}

function renderAnswer(typed, displayId) {
  const el = document.getElementById(displayId);
  if (!el) return;
  const textEl = el.querySelector('.ans-text');
  if (textEl) textEl.textContent = typed;
  el.classList.toggle('empty', typed === '');
  el.classList.remove('correct');
}

function markCorrect(displayId) {
  const el = document.getElementById(displayId);
  if (el) el.classList.add('correct');
}

// ── Slowest N items from a times array ──
// timesArr: [{label, time, data}]
function getSlowest(timesArr, n) {
  return [...timesArr].sort((a, b) => b.time - a.time).slice(0, n);
}
