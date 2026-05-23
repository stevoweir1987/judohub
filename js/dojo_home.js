// ═══════════════════════════════════════════════════
//  dojo_home.js — Sequential Tile Path (Dojo Master)
// ═══════════════════════════════════════════════════

const DojoHome = (() => {

  // Belt accent colours + imagery
  const BELT_ACCENT = {
    toRed:    { color: '#ef4444', shadow: '#7f1d1d', label: 'Red Belt',    img: 'images/belt-red.png' },
    toYellow: { color: '#eab308', shadow: '#713f12', label: 'Yellow Belt', img: 'images/belt-yellow.png' },
    toOrange: { color: '#f97316', shadow: '#7c2d12', label: 'Orange Belt', img: 'images/belt-orange.png' },
    toGreen:  { color: '#22c55e', shadow: '#14532d', label: 'Green Belt',  img: 'images/belt-green.png' },
    toBlue:   { color: '#3b82f6', shadow: '#1e3a8a', label: 'Blue Belt',   img: 'images/belt-blue.png' },
    toBrown:  { color: '#a16207', shadow: '#451a03', label: 'Brown Belt',  img: 'images/belt-brown.png' },
  };

  // ── Main render ───────────────────────────────────
  function render() {
    if (typeof BELT_DATA === 'undefined') return;

    const workIdx  = DojoState.getWorkingBeltIndex();
    const belt     = BELT_DATA[workIdx];
    if (!belt) return;

    const accent   = BELT_ACCENT[belt.id] || { color: '#004ac6', shadow: '#1e40af', label: belt.to + ' Belt', img: 'images/belt-white.png' };
    const progress = DojoState.beltProgress(belt.id);
    const readPct  = Math.round(progress * 100);

    const allItems = belt.groups.flatMap(g => g.items);
    const doneCount = allItems.filter(item => DojoState.isDone(belt.id, item)).length;
    const allDone   = allItems.every(item => DojoState.isDone(belt.id, item));

    const container = document.getElementById('home-path-container');
    if (!container) return;

    // ── Belt Header ──
    let html = `
      <div class="belt-header-card rounded-2xl overflow-hidden mb-6 border border-outline-variant/20 shadow-xl relative"
        style="background:linear-gradient(135deg,#dce9ff 0%,#eff4ff 100%)">
        <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(ellipse at top right,${accent.color}18 0%,transparent 60%)"></div>
        <div class="flex items-center gap-4 p-5">
          <img src="${accent.img}" alt="${accent.label}" class="w-20 h-auto drop-shadow-xl shrink-0" onerror="this.style.display='none'"/>
          <div class="flex-1 min-w-0">
            <p class="font-bold uppercase tracking-widest mb-0.5" style="font-size:10px;color:${accent.color}">WORKING TOWARDS</p>
            <h2 class="text-headline-lg-mobile font-bold text-on-surface leading-tight">${accent.label}</h2>
            <p class="text-xs text-on-surface-variant mt-0.5">${doneCount} of ${allItems.length} techniques</p>
            <div class="mt-3">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-bold uppercase tracking-wider" style="color:${accent.color};font-size:10px">READINESS</span>
                <span class="font-bold text-on-surface text-sm">${readPct}%</span>
              </div>
              <div class="w-full h-2.5 bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/10">
                <div class="h-full rounded-full transition-all duration-700"
                  style="width:${readPct}%;background:${accent.color};box-shadow:0 0 8px ${accent.color}80"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-5 pb-4">
          <button onclick="showScreen('grading')"
            class="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all active:scale-[0.98]"
            style="background:#ffffff;border-color:#dce9ff;box-shadow:0 1px 4px rgba(0,74,198,0.07)">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined ms-fill" style="font-size:20px;color:${accent.color}">checklist</span>
              <span class="font-bold text-sm text-on-surface">Grading Checklist</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm" style="color:${accent.color}">${readPct}% ready</span>
              <span class="material-symbols-outlined" style="font-size:18px;color:#93b4f0">chevron_right</span>
            </div>
          </button>
        </div>
      </div>`;

    // ── Next Up card ──
    const nextItem = DojoState.getNextItem(belt.id);
    if (nextItem && !allDone) {
      const nextEn = (typeof TERMS_EN !== 'undefined' && TERMS_EN[nextItem]) ? TERMS_EN[nextItem] : nextItem.replace(/-/g,' ');
      const nextGroup = belt.groups.find(g => g.items.includes(nextItem));
      const groupLabel = nextGroup ? nextGroup.title.replace(/^(Fundamental|Performance|Knowledge)\s*[—-]\s*/i,'') : '';
      html += `
        <div class="rounded-2xl border border-outline-variant/30 overflow-hidden mb-2"
          style="background:linear-gradient(135deg,#ffffff 0%,#f0f4ff 100%);box-shadow:0 2px 12px rgba(0,74,198,0.08)">
          <div class="flex items-center gap-4 p-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style="background:${accent.color}18;border:1px solid ${accent.color}30">
              <span class="material-symbols-outlined ms-fill" style="font-size:26px;color:${accent.color}">play_circle</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold uppercase tracking-widest text-on-surface-variant mb-0.5" style="font-size:9px">NEXT UP · ${groupLabel.toUpperCase()}</p>
              <p class="font-bold text-on-surface text-sm leading-tight truncate">${nextItem}</p>
              <p class="text-on-surface-variant text-xs truncate">${nextEn}</p>
            </div>
            <button onclick="DojoHome.openItem('${belt.id}','${nextItem.replace(/'/g,"\\'")}',${workIdx})"
              class="btn-tactile shrink-0 font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl"
              style="background:${accent.color};color:#fff;box-shadow:0 4px 0 0 ${accent.shadow || '#1e40af'}">
              START
            </button>
          </div>
        </div>`;
    }

    // ── Quick Stats strip (or welcome nudge on first launch) ──
    {
      const totalDone = (() => {
        let d = 0, t = 0;
        BELT_DATA.forEach(b => b.groups.forEach(g => g.items.forEach(item => { t++; if (DojoState.isDone(b.id,item)) d++; })));
        return { d, t, pct: t ? Math.round(d/t*100) : 0 };
      })();
      const streak = DojoState.getStreak();
      const xp     = DojoState.getXP();
      const isNew  = xp === 0 && totalDone.d === 0;

      if (isNew) {
        html += `
          <div class="flex items-center gap-4 p-4 rounded-2xl border-2 mb-2"
            style="background:#ffffff;border-color:${accent.color}40;border-style:dashed">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style="background:${accent.color}15">
              <span class="material-symbols-outlined ms-fill" style="font-size:26px;color:${accent.color}">waving_hand</span>
            </div>
            <div class="flex-1">
              <p class="font-bold text-on-surface text-sm leading-snug">Welcome to your judo journey!</p>
              <p class="text-on-surface-variant text-xs mt-0.5">Tap <strong>Grading Challenge</strong> below or hit <strong>Start</strong> to begin your first technique.</p>
            </div>
          </div>`;
      } else {
        html += `
          <div class="grid grid-cols-3 gap-2 mb-2">
            <div class="bg-white border border-outline-variant/30 rounded-2xl p-3 flex flex-col items-center">
              <span class="material-symbols-outlined ms-fill text-orange-400 mb-1" style="font-size:20px">local_fire_department</span>
              <span class="font-black text-on-surface text-lg leading-none">${streak}</span>
              <span class="text-on-surface-variant font-bold uppercase text-center leading-tight mt-0.5" style="font-size:9px">Day Streak</span>
            </div>
            <div class="bg-white border border-outline-variant/30 rounded-2xl p-3 flex flex-col items-center">
              <span class="material-symbols-outlined ms-fill text-primary mb-1" style="font-size:20px">bolt</span>
              <span class="font-black text-on-surface text-lg leading-none">${xp}</span>
              <span class="text-on-surface-variant font-bold uppercase text-center leading-tight mt-0.5" style="font-size:9px">Total XP</span>
            </div>
            <div class="bg-white border border-outline-variant/30 rounded-2xl p-3 flex flex-col items-center">
              <span class="material-symbols-outlined ms-fill text-secondary mb-1" style="font-size:20px">done_all</span>
              <span class="font-black text-on-surface text-lg leading-none">${totalDone.pct}%</span>
              <span class="text-on-surface-variant font-bold uppercase text-center leading-tight mt-0.5" style="font-size:9px">All Belts</span>
            </div>
          </div>`;
      }
    }

    // ── Daily Coaching Tip ──
    {
      const TIPS = [
        { title:'Master Kuzushi First',    icon:'swap_vert',         body:'Every throw begins with breaking your partner’s balance. Get kuzushi right and the technique will follow naturally.' },
        { title:'Control the Sleeve',      icon:'back_hand',         body:'Secure the sleeve before the lapel. A firm sleeve grip controls uke’s arm and limits their attack options.' },
        { title:'Fall Better, Win More',   icon:'airline_seat_flat', body:'Good ukemi is good judo. A judoka who falls confidently trains harder and learns faster.' },
        { title:'Combine Your Attacks',    icon:'shuffle',           body:'Set up your big throw with a smaller one. A convincing feint opens the space for your real technique.' },
        { title:'Win on the Ground',       icon:'rotate_right',      body:'Ne-waza wins contests. Even 5 seconds of osaekomi can change a match — stay active when it goes to ground.' },
        { title:'Protect Your Posture',    icon:'accessibility_new', body:'Stand tall and upright. Bending forward gives your opponent your back — the most dangerous position in judo.' },
        { title:'Randori Mindset',         icon:'psychology',        body:'In randori, experiment freely. In shiai, execute what you know. Treat every practice session as a learning lab.' },
      ];
      const tip = TIPS[new Date().getDay() % TIPS.length];
      html += `
        <div class="flex items-start gap-4 p-4 rounded-2xl border border-tertiary/30 mb-2"
          style="background:linear-gradient(135deg,#f0fdf4 0%,#ecfdf5 100%)">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:#d1fae5">
            <span class="material-symbols-outlined ms-fill text-emerald-600" style="font-size:22px">${tip.icon}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold uppercase tracking-widest text-emerald-700 mb-1" style="font-size:9px">SENSEI’S TIP</p>
            <p class="font-bold text-on-surface text-sm leading-snug mb-1">${tip.title}</p>
            <p class="text-on-surface-variant text-xs leading-relaxed">${tip.body}</p>
          </div>
        </div>`;
    }

    // ── Grading Challenge CTA ──
    html += `
      <button onclick="showScreen('belt-path')"
        class="w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all active:scale-[0.98] mt-1"
        style="background:#ffffff;border-color:${accent.color}40;box-shadow:0 4px 0 0 ${accent.color}30">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style="background:${accent.color}18;border:1.5px solid ${accent.color}30">
          <span class="material-symbols-outlined ms-fill" style="font-size:30px;color:${accent.color}">sports_kabaddi</span>
        </div>
        <div class="flex-1 text-left min-w-0">
          <p class="font-bold uppercase tracking-widest mb-0.5" style="font-size:10px;color:${accent.color}">GRADING CHALLENGE</p>
          <p class="font-bold text-on-surface text-base leading-tight">${accent.label} Path</p>
          <p class="text-on-surface-variant text-xs mt-0.5">${doneCount} of ${allItems.length} techniques · ${readPct}% complete</p>
        </div>
        <div class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style="background:${accent.color};box-shadow:0 4px 0 0 ${accent.shadow || '#1e40af'}">
          <span class="material-symbols-outlined text-white" style="font-size:22px">arrow_forward</span>
        </div>
      </button>`;

    container.innerHTML = html;
  }

  // ── Belt Path Screen ──────────────────────────────
  function renderBeltPath() {
    if (typeof BELT_DATA === 'undefined') return;
    const workIdx  = _overrideBeltIdx !== null ? _overrideBeltIdx : DojoState.getWorkingBeltIndex();
    const belt     = BELT_DATA[workIdx];
    if (!belt) return;
    const accent   = BELT_ACCENT[belt.id] || { color:'#004ac6', shadow:'#1e40af', label: belt.to + ' Belt', img:'images/belt-white.png' };
    const allItems = belt.groups.flatMap(g => g.items);
    const doneCount = allItems.filter(item => DojoState.isDone(belt.id, item)).length;
    const allDone   = allItems.every(item => DojoState.isDone(belt.id, item));

    // Header
    const hdrLabel  = document.getElementById('belt-path-header-label');
    const hdrSub    = document.getElementById('belt-path-header-sub');
    const hdrBar    = document.getElementById('belt-path-header-bar');
    const readPct   = allItems.length ? Math.round(doneCount / allItems.length * 100) : 0;
    if (hdrLabel) hdrLabel.textContent = accent.label + ' Path';
    if (hdrSub)   hdrSub.textContent   = doneCount + ' of ' + allItems.length + ' techniques';
    if (hdrBar)   { hdrBar.style.width = readPct + '%'; hdrBar.style.background = accent.color; }

    const container = document.getElementById('belt-path-container');
    if (!container) return;

    let html = `<div class="tile-path space-y-3 pb-4">`;
    let globalIdx = 0;

    belt.groups.forEach(group => {
      html += `
        <div class="flex items-center gap-3 px-1 pt-2 pb-1">
          <div class="h-px flex-1 bg-outline-variant/30"></div>
          <span class="text-on-surface-variant font-bold uppercase tracking-widest px-2" style="font-size:10px">${group.title}</span>
          <div class="h-px flex-1 bg-outline-variant/30"></div>
        </div>`;

      group.items.forEach(item => {
        const done     = DojoState.isDone(belt.id, item);
        const unlocked = DojoState.isItemUnlocked(belt.id, item);
        const active   = !done && unlocked;
        const seen     = DojoState.isSeen(belt.id, item);
        const en = (typeof TERMS_EN !== 'undefined' && TERMS_EN[item]) ? TERMS_EN[item] : item.replace(/-/g,' ');
        globalIdx++;

        if (done) {
          html += `
            <div class="tile-done flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer"
              style="background:${accent.color}15;border-color:${accent.color}40"
              onclick="DojoHome.openItem('${belt.id}','${item.replace(/'/g,"\'")}',${workIdx})">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style="background:${accent.color}">
                <span class="material-symbols-outlined ms-fill text-white" style="font-size:22px">check</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-on-surface text-sm leading-tight truncate">${item}</p>
                <p class="text-xs mt-0.5 truncate" style="color:${accent.color}">${en}</p>
              </div>
              <span class="material-symbols-outlined ms-fill shrink-0" style="color:${accent.color};font-size:18px">task_alt</span>
            </div>`;
        } else if (active) {
          html += `
            <div class="tile-active flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.98]"
              style="background:#ffffff;border-color:${accent.color};box-shadow:0 0 20px ${accent.color}30"
              onclick="DojoHome.openItem('${belt.id}','${item.replace(/'/g,"\'")}',${workIdx})">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 relative"
                style="background:${accent.color};box-shadow:0 6px 0 0 ${accent.shadow}">
                <span class="material-symbols-outlined ms-fill text-white" style="font-size:22px">sports_kabaddi</span>
                <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                  style="background:${accent.color};opacity:0.7"></span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-on-surface text-sm leading-tight truncate">${item}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <p class="text-xs text-on-surface-variant truncate">${en}</p>
                  ${seen ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-tertiary font-bold shrink-0" style="font-size:9px;background:rgba(113,216,198,0.12);border:1px solid rgba(113,216,198,0.25)"><span class="material-symbols-outlined" style="font-size:11px">visibility</span>SEEN</span>` : ''}
                </div>
              </div>
              <div class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style="background:${accent.color}">
                <span class="material-symbols-outlined text-white" style="font-size:18px">arrow_forward</span>
              </div>
            </div>`;
        } else {
          html += `
            <div class="tile-locked flex items-center gap-4 p-4 rounded-2xl border select-none"
              style="background:#ffffff;border-color:#dce9ff;box-shadow:0 1px 4px rgba(0,74,198,0.07)">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style="background:#eff4ff;border:1.5px solid #dce9ff">
                <span class="material-symbols-outlined" style="font-size:20px;color:#93b4f0">lock</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm leading-tight truncate" style="color:#6b7280">${item}</p>
                <p class="text-xs mt-0.5 truncate" style="color:#9ca3af">${en}</p>
              </div>
              <span class="material-symbols-outlined shrink-0" style="font-size:18px;color:#c7d7f5">chevron_right</span>
            </div>`;
        }
      });
    });

    // Unit exam tile
    const examClass = allDone ? 'cursor-pointer active:scale-[0.98]' : 'opacity-50 select-none';
    html += `
      <div class="flex items-center gap-3 px-1 pt-2 pb-1">
        <div class="h-px flex-1 bg-outline-variant/30"></div>
        <span class="text-on-surface-variant font-bold uppercase tracking-widest px-2" style="font-size:10px">FINAL TEST</span>
        <div class="h-px flex-1 bg-outline-variant/30"></div>
      </div>
      <div class="tile-exam flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${examClass}"
        style="background:${allDone?'#ffffff':'#f0f4ff'};border-color:${allDone?'#f59e0b':'#c7d7f5'};${allDone?'box-shadow:0 0 24px rgba(245,158,11,0.20)':''}"
        ${allDone ? `onclick="DojoHome.startUnitExam('${belt.id}',${workIdx})"` : ''}>
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2"
          style="background:${allDone?'rgba(245,158,11,0.12)':'#e5eeff'};border-color:${allDone?'#f59e0b':'#c7d7f5'}">
          <span class="material-symbols-outlined ms-fill" style="font-size:26px;color:${allDone?'#f59e0b':'#93b4f0'}">military_tech</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm" style="color:${allDone?'#fbbf24':'#9ca3af'}">UNIT EXAM</p>
          <p class="text-xs mt-0.5" style="color:${allDone?'rgba(251,191,36,0.7)':'#6b7280'}">
            ${allDone ? 'All techniques mastered — sit your exam!' : 'Complete all ' + allItems.length + ' techniques to unlock'}
          </p>
        </div>
        ${allDone ? '<div class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style="background:#fbbf24"><span class="material-symbols-outlined text-black" style="font-size:18px">arrow_forward</span></div>' : ''}
      </div>`;

    html += `</div>`;

    // Belt switcher
    if (BELT_DATA.length > 1) {
      html += `<div class="mt-6 mb-2">
        <p class="text-on-surface-variant/50 text-xs uppercase tracking-widest font-bold text-center mb-3">Jump to belt</p>
        <div class="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide snap-x snap-mandatory">`;
      BELT_DATA.forEach((b, i) => {
        const a = BELT_ACCENT[b.id] || { color:'#888', label: b.label };
        const pct = Math.round(DojoState.beltProgress(b.id) * 100);
        const isCurrent = i === workIdx;
        html += `<button onclick="DojoHome.switchBelt(${i})"
          class="flex flex-col items-center gap-2 shrink-0 snap-center px-4 py-3 rounded-2xl border-2 transition-all active:scale-95 min-w-[72px]"
          style="background:${isCurrent?a.color+'18':'#ffffff'};border-color:${isCurrent?a.color:'#dce9ff'}">
          <div class="w-8 h-8 rounded-full" style="background:${a.color};box-shadow:0 2px 6px ${a.color}50"></div>
          <span class="font-bold" style="font-size:11px;color:${isCurrent?a.color:'#6b7280'}">${a.label}</span>
          <span class="font-semibold" style="font-size:10px;color:${isCurrent?a.color+'cc':'#9ca3af'}">${pct}%</span>
        </button>`;
      });
      html += `</div></div>`;
    }

    container.innerHTML = html;

    // Scroll to first active tile after render
    requestAnimationFrame(() => {
      const activeEl = container.querySelector('.tile-active');
      if (activeEl) {
        const main = document.querySelector('#screen-belt-path main');
        if (main) {
          const offset = activeEl.offsetTop - 80;
          main.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }
    });
  }

  // ── Open a specific technique lesson ─────────────
  function openItem(beltId, itemName, beltIdx) {
    if (!DojoState.isItemUnlocked(beltId, itemName)) return;

    // Detect which group this item belongs to
    const belt = (typeof BELT_DATA !== 'undefined') ? BELT_DATA.find(b => b.id === beltId) : null;
    let groupTitle = '';
    if (belt) {
      for (const g of belt.groups) {
        if (g.items.includes(itemName)) { groupTitle = g.title; break; }
      }
    }
    const isKnowledge = /Knowledge|Moral|Terminology|Contest|Referee|Basics/i.test(groupTitle);
    if (isKnowledge) {
      DojoKnowledge.open(beltId, itemName, groupTitle, beltIdx, 'home');
    } else {
      DojoLesson.open(beltId, itemName, beltIdx);
    }
  }

  // ── Unit Exam — for now, open first incomplete or celebrate ──
  function startUnitExam(beltId, beltIdx) {
    // Check if there's truly nothing left
    const next = DojoState.getNextItem(beltId);
    if (next) {
      DojoLesson.open(beltId, next, beltIdx);
    } else {
      // Belt complete — trigger promotion flow
      DojoCelebration.showBeltPromo(beltId);
    }
  }

  // ── Switch active belt ────────────────────────────
  // Temporarily view a different belt path
  let _overrideBeltIdx = null;
  function switchBelt(idx) {
    _overrideBeltIdx = idx;
    render();          // refresh dashboard
    renderBeltPath();  // refresh path screen
  }

  // ── Grading Checklist ─────────────────────────────
  function renderChecklist() {
    if (typeof BELT_DATA === 'undefined') return;
    const workIdx = DojoState.getWorkingBeltIndex();
    const belt    = BELT_DATA[workIdx];
    if (!belt) return;

    const accent   = BELT_ACCENT[belt.id] || { color:'#004ac6', shadow:'#1e40af', label: belt.to + ' Belt', img:'images/belt-white.png' };
    const allItems = belt.groups.flatMap(g => g.items);
    const doneCount  = allItems.filter(i => DojoState.isDone(belt.id, i)).length;
    const totalCount = allItems.length;
    const pct     = totalCount ? Math.round(doneCount / totalCount * 100) : 0;
    const isReady = pct >= 80;

    // ── Readiness banner ──
    const banner = document.getElementById('grading-banner');
    if (banner) {
      banner.style.background  = isReady ? 'rgba(0,98,66,0.06)' : 'rgba(0,74,198,0.04)';
      banner.style.borderColor = isReady ? '#006242' : '#dce9ff';
      banner.innerHTML = `
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style="background:${isReady ? 'rgba(0,98,66,0.12)' : accent.color+'18'}">
          <span class="material-symbols-outlined ms-fill" style="font-size:30px;color:${isReady ? '#006242' : accent.color}">
            ${isReady ? 'verified' : 'pending'}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-extrabold text-lg leading-tight" style="color:${isReady ? '#006242' : '#0b1c30'}">
            ${isReady ? 'Grading Ready!' : pct + '% Complete'}
          </p>
          <p class="text-xs text-on-surface-variant mt-0.5">
            ${isReady
              ? 'You have covered enough material to attempt grading. Speak to your sensei.'
              : doneCount + ' of ' + totalCount + ' items complete for ' + accent.label + '.'}
          </p>
          <div class="mt-2 w-full h-2 rounded-full overflow-hidden" style="background:#dce9ff">
            <div class="h-full rounded-full transition-all duration-700"
              style="width:${pct}%;background:${isReady ? '#006242' : accent.color}"></div>
          </div>
        </div>`;
    }

    // ── Group rows ──
    const container = document.getElementById('grading-groups');
    if (!container) return;

    const ICON_MAP = [
      ['Ukemi',       'self_improvement'],
      ['Tachi-waza',  'sports_kabaddi'],
      ['Osaekomi',    'lock'],
      ['Kansetsu',    'back_hand'],
      ['Shime',       'sports_martial_arts'],
      ['Ne-waza',     'airline_seat_flat'],
      ['Transition',  'sync_alt'],
      ['Combination', 'join_inner'],
      ['Counter',     'cached'],
      ['Randori',     'repeat'],
      ['Knowledge',   'menu_book'],
      ['Moral',       'shield_person'],
      ['Personal',    'star'],
      ['Kumi',        'handshake'],
    ];

    function groupIcon(title) {
      for (const [key, ic] of ICON_MAP) { if (title.includes(key)) return ic; }
      return 'checklist';
    }

    container.innerHTML = belt.groups.map(group => {
      const total    = group.items.length;
      const done     = group.items.filter(i => DojoState.isDone(belt.id, i)).length;
      const complete = done === total;
      const gpct     = total ? Math.round(done / total * 100) : 0;
      const icon     = groupIcon(group.title);
      const shortTitle = group.title.replace(/^(Fundamental|Performance|Knowledge) — /, '').replace(/^(Fundamental|Performance|Knowledge) — /, '');
      const remaining  = total - done;

      return `
        <div class="bg-white rounded-2xl border p-4" style="border-color:${complete ? '#006242' : '#dce9ff'}">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style="background:${complete ? 'rgba(0,98,66,0.10)' : '#eff4ff'}">
              <span class="material-symbols-outlined ms-fill" style="font-size:20px;color:${complete ? '#006242' : accent.color}">${icon}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <p class="font-bold text-sm text-on-surface leading-tight truncate">${shortTitle}</p>
                <span class="font-bold text-xs shrink-0" style="color:${complete ? '#006242' : accent.color}">${done}/${total}</span>
              </div>
              <div class="mt-1.5 w-full h-1.5 rounded-full overflow-hidden" style="background:#eff4ff">
                <div class="h-full rounded-full transition-all duration-500"
                  style="width:${gpct}%;background:${complete ? '#006242' : accent.color}"></div>
              </div>
              ${(!complete && done > 0) ? `<p class="text-xs text-on-surface-variant mt-1">${remaining} item${remaining !== 1 ? 's' : ''} remaining</p>` : ''}
            </div>
            <span class="material-symbols-outlined ms-fill shrink-0" style="font-size:22px;color:${complete ? '#006242' : '#c7d7f5'}">
              ${complete ? 'check_circle' : 'radio_button_unchecked'}
            </span>
          </div>
        </div>`;
    }).join('');
  }

  return { render, renderBeltPath, renderChecklist, openItem, startUnitExam, switchBelt };
})();
