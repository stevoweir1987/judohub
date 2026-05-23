// ===================================================
//  dojo_celebration.js -- Success & Belt Promotion screens
// ===================================================

const DojoCelebration = (() => {

  // Belt config: id -> { beltName, kyuLabel, kyuBadge, img, metricsXP }
  const BELT_CONFIG = {
    toRed:    { beltName: 'Red Belt Achieved',    kyuLabel: '6th Kyu Mastery Level', kyuBadge: '6TH KYU', img: 'images/belt-red.png',    metricsXP: [350, 150, 100] },
    toYellow: { beltName: 'Yellow Belt Achieved', kyuLabel: '5th Kyu Mastery Level', kyuBadge: '5TH KYU', img: 'images/belt-yellow.png', metricsXP: [450, 200, 150] },
    toOrange: { beltName: 'Orange Belt Achieved', kyuLabel: '4th Kyu Mastery Level', kyuBadge: '4TH KYU', img: 'images/belt-orange.png', metricsXP: [500, 250, 150] },
    toGreen:  { beltName: 'Green Belt Achieved',  kyuLabel: '3rd Kyu Mastery Level', kyuBadge: '3RD KYU', img: 'images/belt-green.png',  metricsXP: [600, 300, 200] },
    toBlue:   { beltName: 'Blue Belt Achieved',   kyuLabel: '2nd Kyu Mastery Level', kyuBadge: '2ND KYU', img: 'images/belt-blue.png',   metricsXP: [700, 350, 250] },
    toBrown:  { beltName: 'Brown Belt Achieved',  kyuLabel: '1st Kyu Mastery Level', kyuBadge: '1ST KYU', img: 'images/belt-brown.png',  metricsXP: [800, 400, 300] },
  };

  // State
  let _pendingBeltId      = null;
  let _successBeltId      = '';
  let _successItem        = '';
  let _successBeltIdx     = 0;
  let _successReturn      = 'home';
  let _confettiBurst2Done = false;

  // -- Show Technique Mastered screen ---------------------
  function showSuccess(beltId, itemName, beltIdx, result, returnScreen) {
    // Handle legacy 2-arg call: showSuccess(itemName, result)
    if (typeof beltIdx === 'object' && beltIdx !== null && 'xpGained' in beltIdx) {
      returnScreen = result;
      result       = beltIdx;
      beltIdx      = 0;
      itemName     = beltId;
      beltId       = (typeof DojoLesson !== 'undefined') ? DojoLesson.getReturnScreen && '' : '';
      if (typeof DojoLesson !== 'undefined' && DojoLesson._getBeltId) beltId = DojoLesson._getBeltId();
    }
    const { xpGained, totalXP, streak, isBeltComplete } = result;

    _successBeltId  = beltId  || '';
    _successItem    = itemName || '';
    _successBeltIdx = beltIdx  || 0;
    _successReturn  = returnScreen || (typeof DojoLesson !== 'undefined' ? DojoLesson.getReturnScreen() : 'home');

    // Adapt button labels based on context
    const isQuestMode = _successReturn === 'home';

    // Pre-check: is this the last quest task? (completeLesson already ran so isDone is current)
    let isLastQuestTask = false;
    if (isQuestMode && typeof DojoHome !== 'undefined') {
      isLastQuestTask = !DojoHome.getNextQuestTask(_successItem);
    }

    const nextBtn = document.getElementById('success-next-btn');
    const contBtn = document.querySelector('#screen-success button:last-of-type');
    if (nextBtn) {
      if (isQuestMode && isLastQuestTask) {
        nextBtn.innerHTML = '<span class="material-symbols-outlined ms-fill" style="font-size:22px">celebration</span> Quest Complete!';
        nextBtn.style.background = '#006242';
        nextBtn.style.borderBottomColor = '#004d2e';
      } else {
        nextBtn.style.background = '';
        nextBtn.style.borderBottomColor = '';
        nextBtn.innerHTML = isQuestMode
          ? '<span class="material-symbols-outlined ms-fill" style="font-size:22px">skip_next</span> Next Quest Task'
          : '<span class="material-symbols-outlined ms-fill" style="font-size:22px">skip_next</span> Next Technique';
      }
    }
    if (contBtn && contBtn !== nextBtn) {
      contBtn.innerHTML = isQuestMode
        ? '<span class="material-symbols-outlined" style="font-size:18px">wb_sunny</span> Back to Today'
        : '<span class="material-symbols-outlined" style="font-size:18px">home</span> Back to Path';
    }

    // Store pending promotion check
    _pendingBeltId = isBeltComplete ? (beltId || _currentBeltId()) : null;

    // Populate
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    set('success-tech-name', _successItem || beltId || '');
    set('success-xp',        '+' + xpGained + ' XP');
    set('success-dan',       streak + ' Day Dan');

    // Dan status pips (7 pips)
    const pipsContainer = document.getElementById('success-dan-pips');
    if (pipsContainer) {
      const total  = 7;
      const filled = Math.min(streak % total || (streak > 0 ? total : 0), total);
      pipsContainer.innerHTML = Array.from({ length: total }, (_, i) => {
        const active = i < filled;
        const isLast = i === filled - 1 && i < total - 1;
        if (isLast) {
          return '<div class="h-2 flex-1 rounded-full bg-primary animate-pulse ring-4 ring-primary/20 ring-offset-1 ring-offset-surface-container-low"></div>';
        }
        return active
          ? '<div class="h-2 flex-1 rounded-full bg-secondary pip-glow"></div>'
          : '<div class="h-2 flex-1 rounded-full bg-surface-container-highest"></div>';
      }).join('');
    }

    // XP progress bar
    const barPct = Math.min((totalXP % 1000) / 10, 100);
    const bar = document.getElementById('success-xp-bar');
    if (bar) {
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = barPct + '%'; }, 600);
    }

    // Quest progress indicator: "Task 2 of 3"
    const questProgressEl = document.getElementById('success-quest-progress');
    if (questProgressEl) {
      if (isQuestMode && typeof DojoHome !== 'undefined' && DojoHome.getMissionStats) {
        const { total, done } = DojoHome.getMissionStats(); // done already includes just-completed item
        questProgressEl.className = 'mt-3 flex items-center justify-center gap-2';
        let pipsHtml = '';
        for (let p = 1; p <= total; p++) {
          const filled = p <= done;
          pipsHtml += '<div style="width:' + (filled ? '24px' : '16px') + ';height:6px;border-radius:3px;'
            + 'background:' + (filled ? '#004ac6' : '#dbe1ff') + ';transition:all 0.3s"></div>';
        }
        questProgressEl.innerHTML = pipsHtml
          + '<span style="font-size:11px;font-weight:700;color:#93b4f0;letter-spacing:0.05em;margin-left:6px">'
          + 'TASK ' + done + ' OF ' + total + '</span>';
      } else {
        questProgressEl.className = 'hidden';
      }
    }

    _launchConfetti();
    showScreen('success');
  }

  // -- CONTINUE button handler ----------------------------
  function handleSuccessContinue() {
    if (_pendingBeltId) {
      showBeltPromo(_pendingBeltId);
      _pendingBeltId = null;
      return;
    }
    DojoHome.render();
    DojoProfile.render();
    const dest = ['practice','syllabus','dojo'].includes(_successReturn) ? _successReturn : _successReturn === 'home' ? 'home' : 'belt-path';
    showScreen(dest);
  }

  function handleSuccessNext() {
    if (_pendingBeltId) {
      showBeltPromo(_pendingBeltId);
      _pendingBeltId = null;
      return;
    }

    // -- Quest mode: came from Today screen ---------------
    if (_successReturn === 'home' && typeof DojoHome !== 'undefined') {
      const next = DojoHome.getNextQuestTask(_successItem);
      DojoHome.render();
      if (next) {
        const t = next.task;
        if (t.type === 'knowledge' && typeof DojoKnowledge !== 'undefined') {
          DojoKnowledge.open(t.beltId, t.item, t.group, t.beltIdx, 'home');
        } else {
          DojoLesson.open(t.beltId, t.item, t.beltIdx, 'home');
        }
      } else {
        // All quest tasks done -- celebrate!
        _showQuestComplete();
      }
      return;
    }

    // -- Belt path mode: find next item in sequence -------
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
      DojoHome.render();
      DojoProfile.render();
      showScreen('belt-path');
    }
  }

  // -- Quest Complete overlay -----------------------------
  function _showQuestComplete() {
    const existing = document.getElementById('quest-complete-overlay');
    if (existing) existing.remove();

    const totalTasks = (typeof DojoHome !== 'undefined' && DojoHome.getMissionTaskCount)
      ? DojoHome.getMissionTaskCount() : 3;

    const overlay = document.createElement('div');
    overlay.id = 'quest-complete-overlay';
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:500',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'padding:24px',
      'background:rgba(0,74,198,0.88)',
      'backdrop-filter:blur(14px)'
    ].join(';');

    const card = document.createElement('div');
    card.style.cssText = [
      'background:#fff',
      'border-radius:28px',
      'padding:36px 24px 28px',
      'text-align:center',
      'width:100%',
      'max-width:340px',
      'box-shadow:0 24px 64px rgba(0,0,0,0.35)'
    ].join(';');

    const kanji = document.createElement('div');
    kanji.style.cssText = 'font-size:56px;line-height:1;margin-bottom:16px';
    kanji.textContent = '🥋'; // judo gi emoji

    const label = document.createElement('p');
    label.style.cssText = 'font-weight:900;font-size:10px;letter-spacing:0.25em;color:#004ac6;text-transform:uppercase;margin-bottom:6px;margin-top:0';
    label.textContent = 'Daily Quest';

    const title = document.createElement('p');
    title.style.cssText = 'font-weight:900;font-size:28px;color:#004ac6;margin:0 0 10px;line-height:1.1';
    title.textContent = 'Complete!';

    const body = document.createElement('p');
    body.style.cssText = 'font-size:13px;color:#5f6b80;line-height:1.5;margin-bottom:24px;margin-top:0';
    body.textContent = "Outstanding judo! You've trained all of today's techniques. Your dedication is building real skill.";

    const stats = document.createElement('div');
    stats.style.cssText = 'display:flex;gap:8px;margin-bottom:20px';

    const s1 = document.createElement('div');
    s1.style.cssText = 'background:#eff4ff;border-radius:12px;padding:10px 14px;flex:1';
    s1.innerHTML = '<div style="font-weight:900;font-size:20px;color:#004ac6">' + totalTasks + '</div>'
      + '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#93b4f0;margin-top:2px">Tasks Done</div>';

    const s2 = document.createElement('div');
    s2.style.cssText = 'background:#eff4ff;border-radius:12px;padding:10px 14px;flex:1';
    s2.innerHTML = '<div style="font-weight:900;font-size:20px;color:#004ac6">+' + (totalTasks * 50) + '</div>'
      + '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#93b4f0;margin-top:2px">XP Earned</div>';

    stats.appendChild(s1);
    stats.appendChild(s2);

    const btn = document.createElement('button');
    btn.style.cssText = [
      'background:#004ac6',
      'color:#fff',
      'border:none',
      'border-radius:14px',
      'padding:15px 0',
      'font-weight:800',
      'font-size:14px',
      'cursor:pointer',
      'width:100%',
      'letter-spacing:0.08em',
      'text-transform:uppercase',
      'box-shadow:0 6px 0 #003494'
    ].join(';');
    btn.textContent = '✓ Back to Today';
    btn.onclick = function() {
      overlay.remove();
      DojoProfile.render();
      showScreen('home');
    };

    const footer = document.createElement('p');
    footer.style.cssText = 'font-size:11px;color:#aab8d4;margin-top:12px;margin-bottom:0';
    footer.textContent = 'Come back tomorrow for your next quest';

    card.appendChild(kanji);
    card.appendChild(label);
    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(stats);
    card.appendChild(btn);
    card.appendChild(footer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    _launchConfetti();
  }

  // -- Show Belt Promotion screen -------------------------
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

    const metricsContainer = document.getElementById('promo-metrics');
    if (metricsContainer) {
      const labels = ['TECHNIQUE PROFICIENCY', 'DOJO CONSISTENCY', 'SPARRING ETIQUETTE'];
      const widths = [85, 100, 65];
      metricsContainer.innerHTML = labels.map((label, i) =>
        '<div>'
        + '<div class="flex justify-between items-end mb-2">'
        + '<span class="text-on-surface-variant font-bold uppercase tracking-wider opacity-60" style="font-size:11px">' + label + '</span>'
        + '<span class="font-bold text-tertiary text-sm">+' + cfg.metricsXP[i] + ' XP</span>'
        + '</div>'
        + '<div class="h-3 w-full bg-background rounded-full overflow-hidden border border-surface-variant">'
        + '<div class="h-full bg-gradient-to-r from-tertiary to-tertiary-container rounded-full" style="width:' + widths[i] + '%; animation: pulse 2s infinite"></div>'
        + '</div></div>'
      ).join('');
    }

    _launchConfetti();
    showScreen('belt-promo');
  }

  // -- BACK TO THE FLOOR handler --------------------------
  function handlePromoBack() {
    const ret = (typeof DojoLesson !== 'undefined') ? DojoLesson.getReturnScreen() : 'home';
    DojoHome.render();
    DojoProfile.render();
    showScreen(ret);
  }

  // -- Confetti -------------------------------------------
  function _launchConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';

    const colors = ['#004ac6','#ffffff','#2563eb','#60a5fa','#dbe1ff','#93b4f0'];
    const count  = 80;

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

    // One second burst only (guard prevents infinite loop)
    if (!_confettiBurst2Done) {
      _confettiBurst2Done = true;
      setTimeout(() => { _confettiBurst2Done = false; _launchConfetti(); }, 3500);
    }
  }

  // Helper: current belt id
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

// -- Global wrappers ----------------------------------------
function handleSuccessContinue() { DojoCelebration.handleSuccessContinue(); }
function handleSuccessNext()     { DojoCelebration.handleSuccessNext(); }
function handlePromoBack()       { DojoCelebration.handlePromoBack(); }
