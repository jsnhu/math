// ── app.js — shared utilities ──

// Shuffle an array in place (Fisher-Yates)
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

// Flash the screen green briefly
function flashCorrect() {
  const overlay = document.getElementById('flashOverlay');
  if (!overlay) return;
  overlay.classList.add('active');
  setTimeout(() => overlay.classList.remove('active'), 180);
}

// Numpad wiring — call once after DOM ready
// onInput(val) receives '0'-'9' or 'del'
function wireNumpad(onInput) {
  document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('pointerdown', e => {
      e.preventDefault();
      key.classList.add('pressed');
      onInput(key.dataset.val);
    });
    key.addEventListener('pointerup',    () => key.classList.remove('pressed'));
    key.addEventListener('pointerleave', () => key.classList.remove('pressed'));
  });

  document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') onInput(e.key);
    else if (e.key === 'Backspace')    onInput('del');
  });
}

// Answer input state helpers
function applyInput(current, val) {
  if (val === 'del') return current.slice(0, -1);
  if (current.length >= 9) return current;        // safety cap
  if (current === '' && val === '0') return current; // no leading zero
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
