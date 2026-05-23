// ═══════════════════════════════════════════════════
//  dojo_celebration.js — Success & Belt Promotion screens
// ═══════════════════════════════════════════════════

const DojoCelebration = (() => {

  // Belt config: id → { beltName, kyuLabel, kyuBadge, img, metricsXP }
  const BELT_CONFIG = {
    toRed:    { beltName: 'Red Belt Achieved',    kyuLabel: '6th Kyu Mastery Level', kyuBadge: '6TH KYU', img: 'images/belt-red.png',    metricsXP: [350, 150, 100] },
    toYellow: { beltName: 'Yellow Belt Achieved', kyuLabel: '5th Kyu Mastery Level', kyuBadge: '5TH KYU', img: 'images/belt-yellow.png', metricsXP: [450, 200, 150] },
    toOrange: { beltName: 'Orange Belt Achieved', kyuLabel: '4th Kyu Mastery Level', kyuBadge: '4TH KYU', img: 'images/belt-orange.png', metricsXP: [500, 250, 150] },
    toGreen:  { beltName: 'Green Belt Achieved',  kyuLabel: '3rd Kyu Mastery Level', kyuBadge: '3RD KYU', img: 'images/belt-green.png',  metricsXP: [600, 300, 200] },
    toBlue:   { beltName: 'Blue Belt Achieved',   kyuLabel: '2nd Kyu Mastery Level', kyuBadge: '2ND KYU', img: 'images/belt-blue.png',   metricsXP: [700, 350, 250] },
    toBrown:  { beltName: 'Brown Belt Achieved',  kyuLabel: '1st Kyu Mastery Level', kyuBadge: '1ST KYU', img: 'images/belt-brown.png',  metricsXP: [800, 400, 300] },
  };

  // State for pending belt promotion + current lesson context
  let _pendingBeltId  = null;
  let _successBeltId  = '';
  let _successItem    = '';
  let _successBeltIdx = 0;
  let _successReturn  = 'home';

  // ── Show Technique Mastered (成功) screen ──────────
  function showSuccess(beltId, itemName, beltIdx, result, returnScreen) {
    // Handle legacy 2-arg call: showSuccess(itemName, result)
    if (typeof beltIdx === 'object' && beltIdx !== null && 'xpGained' in beltIdx) {
      returnScreen = result;
      result       = beltIdx;
      beltIdx      = 0;
      itemName     = beltId;
      beltId       = (typeof DojoLesson !== 'undefined') ? DojoLesson.getReturnScreen && '' : '';
      // Get beltId from DojoLesson internal state via getReturnScreen workaround
      if (typeof DojoLesson !== 'undefined' && DojoLesson._getBeltId) beltId = DojoLesson._getBeltId();
    }
    const { xpGained, totalXP, streak, isBeltComplete } = result;

    _successBeltId  = beltId  || '';
    _successItem    = itemName || '';
    _successBeltIdx = beltIdx  || 0;
    _successReturn  = returnScreen || (typeof DojoLesson !== 'undefined' ? DojoLesson.getReturnScreen() : 'home');

    // Store pending promotion check
    _pendingBeltId = isBeltComplete ? (beltId || _currentBeltId()) : null;

    // Populate
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    set('success-tech-name', _successItem || beltId || '');
    set('success-xp',        '+' + xpGained + ' XP');
    set('success-dan',       streak + ' Day Dan');

    // Dan status pips (7 pips, filled up to streak % 7)
    const pipsContainer = document.getElementById('success-dan-pips');
    if (pipsContainer) {
      const total = 7;
      const filled = Math.min(streak % total || (streak > 0 ? total : 0), total);
      pipsContainer.innerHTML = Array.from({ length: total }, (_, i) => {
        const active = i < filled;
        const isLast  = i === filled - 1 && i < total - 1;
        if (isLast) {
          return `<div class="h-2 flex-1 rounded-full bg-primary animate-pulse ring-4 ring-primary/20 ring-offset-1 ring-offset-surface-container-low"></div>`;
        }
        return active
          ? `<div class="h-2 flex-1 rounded-full bg-secondary pip-glow"></div>`
          : `<div class="h-2 flex-1 rounded-full bg-surface-container-highest"></div>`;
      }).join('');
    }

    // XP progress bar (% of 1000 XP per "level")
    const barPct = Math.min((totalXP % 1000) / 10, 100);
    const bar = document.getElementById('success-xp-bar');
    if (bar) {
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = barPct + '%'; }, 600);
    }

    _launchConfetti();
    showScreen('success');
  }

  // ── CONTINUE button handler ────────────────────────
  function handleSuccessContinue() {
    if (_pendingBeltId) {
      showBeltPromo(_pendingBeltId);
      _pendingBeltId = null;
      return;
    }
    DojoHome.render();
    DojoProfile.render();
    // Return to belt path if that was the origin, otherwise home
    const dest = ['practice','syllabus','dojo'].includes(_successReturn) ? _successReturn : 'belt-path';
    showScreen(dest);
  }

  function handleSuccessNext() {
    if (_pendingBeltId) {
      showBeltPromo(_pendingBeltId);
      _pendingBeltId = null;
      return;
    }
    // Find next item in the belt and open it directly
    const nextItem = _successBeltId ? DojoState.getNextItem(_successBeltId) : null;
    if (nextItem) {
      const belt = (typeof BELT_DATA !== 'undefined') ? BELT_DATA.find(b => b.id === _successBeltId) : null;
      let groupTitle = '';
      if (belt) { for (const g of belt.groups) { if (g.items.includes(nextItem)) { groupTitle = g.title; break; } } }
      const isKnowledge = /Knowledge|Moral|Terminology|Contest|Referee|Basics/i.test(groupTitle);
      DojoHome.render();
      if (isKnowledge) {
        DojoKnowledge.open(_successBeltId, nextItem, groupTitle, _successBeltIdx, _successReturn);
      } else {
        DojoLesson.open(_successBeltId, nextItem, _successBeltIdx, _successReturn);
      }
    } else {
      // Belt complete — go to belt path to see the finished state
      DojoHome.render();
      DojoProfile.render();
      showScreen('belt-path');
    }
  }

  // ── Show Belt Promotion screen ─────────────────────
  function showBeltPromo(beltId) {
    const cfg = BELT_CONFIG[beltId] || BELT_CONFIG.toYellow;
    const totalXP = cfg.metricsXP.reduce((a, b) => a + b, 0);

    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    set('promo-belt-name',  cfg.beltName);
    set('promo-kyu-level',  cfg.kyuLabel);
    set('promo-kyu-badge',  cfg.kyuBadge);
    set('promo-total-xp',   totalXP + ' XP');

    const img = document.getElementById('promo-belt-img');
    if (img) img.src = cfg.img;

    // Mastery Metrics
    const metricsContainer = document.getElementById('promo-metrics');
    if (metricsContainer) {
      const labels  = ['TECHNIQUE PROFICIENCY', 'DOJO CONSISTENCY', 'SPARRING ETIQUETTE'];
      const widths  = [85, 100, 65];
      metricsContainer.innerHTML = labels.map((label, i) => `
        <div>
          <div class="flex justify-between items-end mb-2">
            <span class="text-on-surface-variant font-bold uppercase tracking-wider opacity-60" style="font-size:11px">${label}</span>
            <span class="font-bold text-tertiary text-sm">+${cfg.metricsXP[i]} XP</span>
          </div>
          <div class="h-3 w-full bg-background rounded-full overflow-hidden border border-surface-variant">
            <div class="h-full bg-gradient-to-r from-tertiary to-tertiary-container rounded-full"
              style="width:${widths[i]}%; animation: pulse 2s infinite"></div>
          </div>
        </div>`).join('');
    }

    _launchConfetti();
    showScreen('belt-promo');
  }

  // ── BACK TO THE FLOOR handler ──────────────────────
  function handlePromoBack() {
    const ret = (typeof DojoLesson !== 'undefined') ? DojoLesson.getReturnScreen() : 'home';
    DojoHome.render();
    DojoProfile.render();
    showScreen(ret);
  }

  // ── Confetti ───────────────────────────────────────
  function _launchConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';

    const colors = ['#004ac6','#ffffff','#2563eb','#60a5fa','#dbe1ff','#93b4f0'];
    const count = 80;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = Math.random() * 100 + 'vw';
      const size = 5 + Math.random() * 7;
      piece.style.width  = size + 'px';
      piece.style.height = size + 'px';
      const dur   = 2.5 + Math.random() * 3.5;
      const delay = Math.random() * 1.5;
      piece.style.animationDuration = dur + 's';
      piece.style.animationDelay    = delay + 's';
      container.appendChild(piece);
      setTimeout(() => piece.remove(), (dur + delay) * 1000);
    }

    // Second burst for premium feel
    setTimeout(() => _launchConfetti(), 3500);
  }

  // Helper: get current belt id (first incomplete unlocked belt)
  function _currentBeltId() {
    if (typeof BELT_DATA === 'undefined') return 'toYellow';
    for (let i = 0; i < BELT_DATA.length; i++) {
      if (DojoState.isAreaUnlocked(i) && DojoState.beltProgress(BELT_DATA[i].id) >= 1.0) {
        return BELT_DATA[i].id;
      }
    }
    return 'toYellow';
  }

  return { showSuccess, handleSuccessContinue, handleSuccessNext, showBeltPromo, handlePromoBack };

})();

// ── Global wrappers ──────────────────────────────────────────────────
function handleSuccessContinue() { DojoCelebration.handleSuccessContinue(); }
function handleSuccessNext()    { DojoCelebration.handleSuccessNext(); }
function handlePromoBack()        { DojoCelebration.handlePromoBack(); }
