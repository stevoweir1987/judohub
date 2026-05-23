// ═══════════════════════════════════════════════════
//  dojo_practice.js — Practice Hub, Drills & Syllabus
// ═══════════════════════════════════════════════════

const DojoPractice = (() => {

  // ── Drill data ────────────────────────────────────
  const DRILLS = [
    // ── White / Red belt (Beginner) ───────────────────
    {
      id: 'ukemi-ushiro', type: 'ukemi', cat: 'Ukemi', catColor: '#94a3b8',
      belt: 'Beginner', title: 'Ushiro Ukemi Reps', duration: '8 MIN', repGoal: 30, videoUrl: '',
      breakdown: [
        ['Chin', 'Tuck chin firmly to chest before every rep — protects your head.'],
        ['Round', 'Roll through a curved spine, not a flat back — no thud.'],
        ['Slap', 'Both arms slap simultaneously at 45 °, loud and confident.'],
      ],
      tip: 'If the slap is quiet, the technique is wrong. Chase the loud slap.'
    },
    {
      id: 'ukemi-yoko', type: 'ukemi', cat: 'Ukemi', catColor: '#94a3b8',
      belt: 'Beginner', title: 'Yoko Ukemi Both Sides', duration: '8 MIN', repGoal: 20, videoUrl: '',
      breakdown: [
        ['Lead leg', 'Kick the lead leg across to start the roll — it drives the momentum.'],
        ['Side flat', 'Land on the whole side of the body, not the shoulder point.'],
        ['Alternate', 'Switch sides every rep. Never neglect your weaker side.'],
      ],
      tip: 'Right side then left side, every time — both sides must be equal on the mat.'
    },
    {
      id: 'uchikomi-osoto', type: 'uchikomi', cat: 'Uchikomi', catColor: '#71d8c6',
      belt: 'Beginner', title: 'Osoto-gari Uchikomi', duration: '10 MIN', repGoal: 50, videoUrl: '',
      breakdown: [
        ['Entry',   'Step alongside uke, shoulder to shoulder, weight balanced.'],
        ['Kuzushi', 'Drive uke\'s weight onto their target leg with sleeve pull.'],
        ['Reap',    'Reaping leg swings powerfully back through — repeat with control.'],
      ],
      tip: 'Each rep should feel identical. Consistency builds muscle memory.'
    },

    // ── Yellow / Orange belt (Intermediate) ──────────
    {
      id: 'uchikomi-tai', type: 'uchikomi', cat: 'Uchikomi', catColor: '#71d8c6',
      belt: 'Intermediate', title: 'Tai-otoshi Uchikomi', duration: '10 MIN', repGoal: 40, videoUrl: '',
      breakdown: [
        ['Turn',  'Rotate fully into uke — feet planted, hips driving through.'],
        ['Block', 'Place the blocking leg like a wall, knee low and committed.'],
        ['Drive', 'Arms extend forward as you pull through the technique.'],
      ],
      tip: 'The block is everything — commit the leg, then the throw follows naturally.'
    },
    {
      id: 'combo-kouchi-seoi', type: 'combo', cat: 'Combination', catColor: '#f9a8d4',
      belt: 'Intermediate', title: 'Ko-uchi → Morote-seoi Combo', duration: '12 MIN', repGoal: 30, videoUrl: '',
      breakdown: [
        ['Attack 1', 'Ko-uchi-gari — threaten uke\'s inside foot to shift their weight back.'],
        ['React',    'The moment they step back to defend, they are off-balance forward.'],
        ['Attack 2', 'Explode into Morote-seoi-nage — drive through the created space.'],
      ],
      tip: 'The second attack must come before uke resets. Speed of transition is everything.'
    },
    {
      id: 'grip-awareness', type: 'conditioning', cat: 'Gripping', catColor: '#fdba74',
      belt: 'Intermediate', title: 'Grip Fighting Awareness', duration: '10 MIN', sets: 4, reps: 12, rest: 45, videoUrl: '',
      tasks: [
        'Set 1 — 12 grip breaks each hand (pull down, twist out, push through)',
        'Set 2 — 12 grip breaks each hand',
        'Set 3 — 12 lapel grips held 5 s then released',
        'Set 4 — 12 lapel grips held 5 s then released',
      ],
      tip: 'Never let uke settle into their preferred grip. Disrupt early and often.'
    },
    {
      id: 'newaza-turnover', type: 'newaza', cat: 'Ne-waza', catColor: '#a78bfa',
      belt: 'Intermediate', title: 'Ne-waza Turnover Circuit', duration: '12 MIN', sets: 3, reps: 10, rest: 60, videoUrl: '',
      tasks: [
        'Set 1 — 10 turnovers into Kesa-gatame (5 each side)',
        'Set 2 — 10 turnovers into Yoko-shiho-gatame (5 each side)',
        'Set 3 — 10 free-choice turnovers, hold for 3 s each',
      ],
      tip: 'The turnover must be explosive and committed — hesitation gives uke time to defend.'
    },

    // ── Green / Blue belt (Advanced) ─────────────────
    {
      id: 'uchikomi-harai', type: 'uchikomi', cat: 'Uchikomi', catColor: '#71d8c6',
      belt: 'Advanced', title: 'Harai-goshi Uchikomi', duration: '10 MIN', repGoal: 40, videoUrl: '',
      breakdown: [
        ['Kuzushi', 'Pull up and slightly forward — get uke rising onto their toes.'],
        ['Pivot',   'Drive the hip past uke\'s hip line before the leg comes through.'],
        ['Sweep',   'Straight leg sweeps fully through — committed, not tentative.'],
      ],
      tip: 'Hip past the hip first. If you sweep before you pivot, the throw has no power.'
    },
    {
      id: 'randori-prep', type: 'conditioning', cat: 'Randori Prep', catColor: '#6ee7b7',
      belt: 'Advanced', title: 'Randori Preparation Circuit', duration: '15 MIN', sets: 3, reps: 8, rest: 90, videoUrl: '',
      tasks: [
        'Round 1 — 3 min light grip fighting, no throws',
        'Round 2 — 3 min entry practice: enter for every attack even without completing',
        'Round 3 — 3 min full randori at 70 % intensity',
      ],
      tip: 'Round 2 trains the commitment reflex. Entering badly is better than not entering.'
    },
    {
      id: 'counter-pairs', type: 'combo', cat: 'Counter', catColor: '#f9a8d4',
      belt: 'Advanced', title: 'Counter Technique Pairs', duration: '12 MIN', repGoal: 20, videoUrl: '',
      breakdown: [
        ['Read',    'Wait for uke to commit to their attack — do not guess early.'],
        ['Redirect','Use uke\'s energy — pull when they push, push when they pull.'],
        ['Counter', 'Apply your counter in the same motion as the redirect — one movement.'],
      ],
      tip: 'Counters only work when uke has truly committed. Patient timing wins.'
    },

    // ── All belt levels ───────────────────────────────
    {
      id: 'cond-bands', type: 'conditioning', cat: 'Strength', catColor: '#b0c6ff',
      belt: 'All levels', title: 'Band Uchikomi Circuit', duration: '12 MIN', sets: 3, reps: 20, rest: 60, videoUrl: '',
      tasks: [
        'Complete Set 1 — 20 reps with resistance band',
        'Complete Set 2 — 20 reps with resistance band',
        'Complete Set 3 — 20 reps with resistance band',
      ],
      tip: 'Focus on explosive hip rotation. Keep posture upright throughout each rep.'
    },
    {
      id: 'cond-grip', type: 'conditioning', cat: 'Strength', catColor: '#b0c6ff',
      belt: 'All levels', title: 'Grip Strength Circuit', duration: '8 MIN', sets: 3, reps: 15, rest: 45, videoUrl: '',
      tasks: [
        'Complete Set 1 — 15 reps each hand',
        'Complete Set 2 — 15 reps each hand',
        'Complete Set 3 — 15 reps each hand',
      ],
      tip: 'A strong grip is your first weapon. Squeeze from the shoulder, not just the hand.'
    },
  ];

  // ── Belt accent colours ───────────────────────────
  const BELT_ACCENT = {
    toRed:    { color:'#ef4444', label:'Red Belt' },
    toYellow: { color:'#eab308', label:'Yellow Belt' },
    toOrange: { color:'#f97316', label:'Orange Belt' },
    toGreen:  { color:'#22c55e', label:'Green Belt' },
    toBlue:   { color:'#3b82f6', label:'Blue Belt' },
    toBrown:  { color:'#a16207', label:'Brown Belt' },
  };

  // Groups to exclude from Technique Library (knowledge-only)
  const EXCLUDE_GROUPS = ['Knowledge','Terminology','Moral Code','Contest Rules','Referee','Personal Choice','Nage-komi','Randori','Kumi-kata'];
  function _isPhysical(groupTitle) {
    return !EXCLUDE_GROUPS.some(ex => groupTitle.includes(ex));
  }

  // ── State ─────────────────────────────────────────
  let _currentDrill = null;
  let _timerInterval = null;
  let _timerSecs    = 60;
  let _timerRunning = false;
  let _repCount     = 0;
  let _filterCat    = null; // null = all
  let _searchQuery  = '';   // live search string

  // ── Render Hub ────────────────────────────────────
  function renderHub() {
    _renderReadiness();
    _renderDrills();
    _renderTechLibrary(_filterCat);
    _renderMasteryFooter();
  }

  function _renderReadiness() {
    const workIdx  = DojoState.getWorkingBeltIndex();
    const belt     = (typeof BELT_DATA !== 'undefined') ? BELT_DATA[workIdx] : null;
    const pct      = belt ? Math.round(DojoState.beltProgress(belt.id) * 100) : 0;
    const accent   = belt ? BELT_ACCENT[belt.id] : null;
    const label    = accent ? accent.label : 'Next Belt';
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('practice-belt-label', label);
    set('practice-readiness-pct', pct + '%');
    const bar = document.getElementById('practice-readiness-bar');
    if (bar) bar.style.width = pct + '%';
  }

  function _renderDrills() {
    const container = document.getElementById('practice-drills-list');
    if (!container) return;
    const GROUPS = [
      { label: 'Beginner', icon: 'circle', color: '#ef4444', levels: ['Beginner'] },
      { label: 'Intermediate', icon: 'circle', color: '#f97316', levels: ['Intermediate'] },
      { label: 'Advanced', icon: 'circle', color: '#22c55e', levels: ['Advanced'] },
      { label: 'All Levels', icon: 'star', color: '#004ac6', levels: ['All levels'] },
    ];
    let html = '';
    GROUPS.forEach(grp => {
      const drills = DRILLS.filter(d => grp.levels.includes(d.belt));
      if (!drills.length) return;
      html += `<div class="flex items-center gap-2 mt-4 mb-2 first:mt-0">
        <span class="material-symbols-outlined ms-fill" style="font-size:14px;color:${grp.color}">${grp.icon}</span>
        <span class="font-black uppercase tracking-widest text-on-surface-variant" style="font-size:10px">${grp.label}</span>
        <div class="flex-1 h-px bg-outline-variant/40"></div></div>`;
      drills.forEach(d => {
        const meta = d.repGoal ? d.repGoal + ' REPS' : d.sets + '×' + d.reps + ' REPS';
        html += `<div class="bg-surface-container border border-outline-variant/40 p-4 rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-all mb-3"
          onclick="DojoPractice.openDrill('${d.id}')">
          <div class="flex items-center justify-between gap-3">
            <div class="flex-1 min-w-0">
              <span class="inline-block px-2 py-0.5 rounded border font-bold uppercase mb-2"
                style="font-size:10px;color:${d.catColor};border-color:${d.catColor}40;background:${d.catColor}12">${d.cat}</span>
              <h3 class="font-bold text-on-surface text-sm leading-tight">${d.title}</h3>
              <div class="flex items-center gap-1.5 mt-1.5 text-on-surface-variant">
                <span class="material-symbols-outlined" style="font-size:13px">schedule</span>
                <span class="font-bold uppercase" style="font-size:10px">${d.duration}</span>
                <span class="text-on-surface-variant/40 mx-1">·</span>
                <span class="font-bold uppercase" style="font-size:10px">${meta}</span>
              </div>
            </div>
            <div class="btn-tactile shrink-0 bg-primary-container text-on-primary-container font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider">
              START
            </div>
          </div>
        </div>`;
      });
    });
    container.innerHTML = html;
  }

  // ── Technique Library ─────────────────────────────
  function _renderTechLibrary(catFilter) {
    const container = document.getElementById('practice-tech-list');
    if (!container || typeof BELT_DATA === 'undefined') return;

    const q = _searchQuery.toLowerCase().trim();

    let techs = [];
    BELT_DATA.forEach((belt, bi) => {
      const accent = BELT_ACCENT[belt.id] || { color:'#888', label: belt.label };
      belt.groups.forEach(group => {
        if (!_isPhysical(group.title)) return;
        if (catFilter && !group.title.includes(catFilter)) return;
        const catLabel = group.title.replace('Fundamental — ','').replace('Performance — ','');
        group.items.forEach(item => {
          const done = DojoState.isDone(belt.id, item);
          const en   = (typeof TERMS_EN !== 'undefined' && TERMS_EN[item]) ? TERMS_EN[item] : item.replace(/-/g,' ');
          // Search filter — match on name or english translation
          if (q && !item.toLowerCase().includes(q) && !en.toLowerCase().includes(q)) return;
          techs.push({ name: item, en, catLabel, beltLabel: accent.label, color: accent.color, done, beltId: belt.id, beltIdx: bi });
        });
      });
    });

    if (techs.length === 0) {
      container.innerHTML = `<div class="text-on-surface-variant text-sm px-2 py-4">No techniques found for this filter.</div>`;
      return;
    }

    container.innerHTML = techs.map(t => `
      <div class="shrink-0 w-44 bg-surface-container-low border border-outline-variant/40 rounded-2xl overflow-hidden shadow-lg cursor-pointer active:scale-[0.98] transition-all"
        onclick="DojoPractice.openTechLesson('${t.beltId}','${t.name.replace(/'/g,"\\'")}',${t.beltIdx})">
        <div class="h-24 flex items-center justify-center relative" style="background:${t.color}18;border-bottom:1px solid ${t.color}30">
          <span class="material-symbols-outlined ms-fill" style="font-size:48px;color:${t.color}60">sports_kabaddi</span>
          ${t.done ? `<div class="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style="background:${t.color}">
            <span class="material-symbols-outlined ms-fill text-white" style="font-size:14px">check</span></div>` : ''}
        </div>
        <div class="p-3">
          <span class="font-bold uppercase tracking-wider block mb-0.5" style="font-size:9px;color:${t.color}">${t.catLabel}</span>
          <h4 class="font-bold text-on-surface text-sm leading-tight truncate">${t.name}</h4>
          <p class="text-on-surface-variant truncate mt-0.5" style="font-size:11px">${t.en}</p>
        </div>
      </div>`).join('');
  }

  function _renderMasteryFooter() {
    const streak = DojoState.getStreak();
    const el = document.getElementById('practice-streak-num');
    if (el) el.textContent = streak;
  }

  // ── Filter ────────────────────────────────────────
  function openFilter() {
    const panel = document.getElementById('practice-filter-panel');
    if (panel) panel.classList.toggle('hidden');
  }

  function searchTech(query) {
    _searchQuery = query || '';
    // Show/hide clear button
    const clearBtn = document.getElementById('tech-search-clear');
    if (clearBtn) clearBtn.classList.toggle('hidden', !_searchQuery);
    _renderTechLibrary(_filterCat);
    // Scroll list back to start
    const list = document.getElementById('practice-tech-list');
    if (list) list.scrollLeft = 0;
  }

  function clearSearch() {
    _searchQuery = '';
    const input = document.getElementById('tech-search-input');
    if (input) input.value = '';
    const clearBtn = document.getElementById('tech-search-clear');
    if (clearBtn) clearBtn.classList.add('hidden');
    _renderTechLibrary(_filterCat);
  }

  function filterBy(cat) {
    _filterCat = (_filterCat === cat) ? null : cat;
    document.querySelectorAll('.filter-cat-btn').forEach(btn => {
      const active = btn.dataset.cat === _filterCat;
      btn.classList.toggle('border-primary-container', active);
      btn.classList.toggle('bg-primary-container/10', active);
      btn.classList.toggle('text-primary', active);
      btn.classList.toggle('border-outline-variant/30', !active);
      btn.classList.toggle('text-on-surface-variant', !active);
    });
    _renderTechLibrary(_filterCat);
    const list = document.getElementById('practice-tech-list');
    if (list) list.scrollLeft = 0;
    document.getElementById('practice-filter-panel')?.classList.add('hidden');
  }

  // ── Belt images ───────────────────────────────────
  const BELT_IMG = {
    toRed:'images/belt-red.png', toYellow:'images/belt-yellow.png',
    toOrange:'images/belt-orange.png', toGreen:'images/belt-green.png',
    toBlue:'images/belt-blue.png', toBrown:'images/belt-brown.png',
  };

  // ── Grading Syllabus — belt card grid ─────────────
  function renderSyllabus() {
    const container = document.getElementById('syllabus-belt-cards');
    if (!container || typeof BELT_DATA === 'undefined') return;

    container.innerHTML = BELT_DATA.map((belt, bi) => {
      const accent   = BELT_ACCENT[belt.id] || { color:'#888', label: belt.label };
      const img      = BELT_IMG[belt.id] || '';
      const allItems = belt.groups.flatMap(g => g.items);
      const doneCount = allItems.filter(item => DojoState.isDone(belt.id, item)).length;
      const pct = allItems.length ? Math.round(doneCount / allItems.length * 100) : 0;
      const physCount = belt.groups.filter(g => _isPhysical(g.title)).flatMap(g => g.items).length;

      return `
        <div class="relative rounded-2xl overflow-hidden border-2 cursor-pointer active:scale-[0.97] transition-all shadow-xl"
          style="border-color:${accent.color}40;background:#ffffff"
          onclick="DojoPractice.openBeltDrawer('${belt.id}',${bi})">
          <!-- Glow blob -->
          <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(ellipse at top,${accent.color}18 0%,transparent 70%)"></div>
          <!-- Belt image -->
          <div class="flex justify-center pt-5 pb-2 relative z-10">
            <img src="${img}" alt="${accent.label}" class="w-20 h-auto drop-shadow-lg" onerror="this.style.display='none'"/>
          </div>
          <!-- Info -->
          <div class="px-4 pb-4 relative z-10">
            <h4 class="font-bold text-on-surface text-sm text-center leading-tight mb-1">${accent.label}</h4>
            <p class="text-center mb-3" style="font-size:10px;color:${accent.color}">${physCount} techniques</p>
            <!-- Progress bar -->
            <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mb-1">
              <div class="h-full rounded-full transition-all" style="width:${pct}%;background:${accent.color}"></div>
            </div>
            <p class="text-right font-bold" style="font-size:10px;color:${accent.color}40">${pct}%</p>
          </div>
          <!-- Arrow -->
          <div class="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style="background:${accent.color}20">
            <span class="material-symbols-outlined" style="font-size:14px;color:${accent.color}">chevron_right</span>
          </div>
        </div>`;
    }).join('');
  }

  // ── Belt drawer ───────────────────────────────────
  function openBeltDrawer(beltId, beltIdx) {
    if (typeof BELT_DATA === 'undefined') return;
    const belt   = BELT_DATA.find(b => b.id === beltId);
    if (!belt) return;
    const accent  = BELT_ACCENT[beltId] || { color:'#888', label: belt.label };
    const bi      = beltIdx ?? BELT_DATA.findIndex(b => b.id === beltId);

    // Update header — just the belt colour name
    const nameEl = document.getElementById('drawer-belt-name');
    const kyuEl  = document.getElementById('drawer-kyu-label');
    if (nameEl) nameEl.textContent = accent.label;
    if (kyuEl)  kyuEl.style.color  = accent.color;
    // Hide kyu label — just show belt name
    if (kyuEl)  kyuEl.style.display = 'none';

    // Readiness bar
    const allItems  = belt.groups.flatMap(g => g.items);
    const doneCount = allItems.filter(item => DojoState.isDone(beltId, item)).length;
    const pct = allItems.length ? Math.round(doneCount / allItems.length * 100) : 0;
    const pctEl = document.getElementById('drawer-readiness-pct');
    const barEl = document.getElementById('drawer-readiness-bar');
    if (pctEl) pctEl.textContent = pct + '%';
    if (barEl) { barEl.style.width = pct + '%'; barEl.style.background = accent.color; }

    // Path content
    const content = document.getElementById('syllabus-drawer-content');
    if (content) content.innerHTML = _buildDrawerPath(belt, bi, accent);

    // Slide in
    const drawer   = document.getElementById('syllabus-drawer');
    const backdrop = document.getElementById('syllabus-backdrop');
    if (drawer)   { drawer.classList.remove('translate-x-full'); }
    if (backdrop) { backdrop.classList.remove('opacity-0','pointer-events-none'); backdrop.classList.add('opacity-100'); }
  }

  function closeBeltDrawer() {
    const drawer   = document.getElementById('syllabus-drawer');
    const backdrop = document.getElementById('syllabus-backdrop');
    if (drawer)   drawer.classList.add('translate-x-full');
    if (backdrop) { backdrop.classList.add('opacity-0','pointer-events-none'); backdrop.classList.remove('opacity-100'); }
  }

  function _buildDrawerPath(belt, bi, accent) {
    let html = '';
    belt.groups.forEach(group => {
      const physical = _isPhysical(group.title);
      const groupColor = physical ? accent.color : '#6b7280';
      const shortTitle = group.title.replace('Fundamental — ','').replace('Performance — ','').replace('Knowledge — ','');

      // Section divider
      html += `
        <div class="flex items-center gap-2 pt-3 pb-1">
          <div class="h-px flex-1 rounded-full" style="background:${groupColor}30"></div>
          <span class="font-bold uppercase tracking-widest px-1" style="font-size:9px;color:${groupColor}80">${shortTitle}</span>
          <div class="h-px flex-1 rounded-full" style="background:${groupColor}30"></div>
        </div>`;

      group.items.forEach(item => {
        const done = DojoState.isDone(belt.id, item);
        const en   = (typeof TERMS_EN !== 'undefined' && TERMS_EN[item]) ? TERMS_EN[item] : item.replace(/-/g,' ');

        if (physical) {
          // Tappable technique tile
          html += `
            <div class="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.97]"
              style="background:${done ? accent.color+'18' : '#f0f4ff'};border-color:${done ? accent.color+'50' : '#c7d7f5'}"
              onclick="DojoPractice.openTechLesson('${belt.id}','${item.replace(/'/g,"\\'")}',${bi})">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background:${done ? accent.color : '#2a2a2a'}">
                ${done
                  ? `<span class="material-symbols-outlined ms-fill text-white" style="font-size:16px">check</span>`
                  : `<span class="material-symbols-outlined ms-fill" style="font-size:16px;color:${accent.color}80">sports_kabaddi</span>`}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-on-surface text-sm leading-tight truncate">${item}</p>
                <p class="text-on-surface-variant truncate" style="font-size:11px">${en}</p>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant/30 shrink-0" style="font-size:18px">play_circle</span>
            </div>`;
        } else {
          // Knowledge / non-physical — simple tag
          html += `
            <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-outline-variant/10 opacity-50">
              <span class="material-symbols-outlined text-on-surface-variant/40 shrink-0" style="font-size:16px">menu_book</span>
              <p class="text-on-surface-variant text-sm truncate">${item}</p>
            </div>`;
        }
      });
    });
    return html;
  }

  // ── Drill detail ──────────────────────────────────
  function openDrill(drillId) {
    const drill = DRILLS.find(d => d.id === drillId);
    if (!drill) return;
    _currentDrill = drill;
    _repCount     = 0;
    _timerRunning = false;
    _timerSecs    = drill.rest || 60;
    clearInterval(_timerInterval);

    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('drill-cat-label', drill.cat.toUpperCase() + ' DRILL');
    set('drill-title',     drill.title);

    const iframe  = document.getElementById('drill-iframe');
    const thumb   = document.getElementById('drill-video-thumb');
    const playBtn = document.getElementById('drill-play-btn');
    if (iframe)  { iframe.src = ''; iframe.classList.add('hidden'); }
    if (thumb)   thumb.classList.remove('hidden');
    if (playBtn) { playBtn.classList.remove('hidden'); playBtn.dataset.url = drill.videoUrl || ''; }

    const content = document.getElementById('drill-content');
    if (content) content.innerHTML = drill.breakdown ? _uchikomiHTML(drill) : _conditioningHTML(drill);

    showScreen('practice-drill');
  }

  function _uchikomiHTML(drill) {
    const steps = drill.breakdown.map((step, i) => {
      const borders = ['border-primary','border-tertiary','border-secondary'];
      return `<div class="flex gap-4 p-4 bg-surface-container-low rounded-xl border-l-4 ${borders[i]||borders[0]}">
        <div class="shrink-0 text-3xl font-black text-on-surface/20 leading-none">0${i+1}</div>
        <div><p class="font-bold text-on-surface text-sm mb-1">${step[0]}</p>
        <p class="text-on-surface-variant text-xs leading-relaxed">${step[1]}</p></div></div>`;
    }).join('');
    return `
      <div class="bg-surface-container border border-outline-variant/30 p-5 rounded-2xl space-y-3">
        <h3 class="font-semibold text-on-surface flex items-center gap-2">
          <span class="material-symbols-outlined text-primary" style="font-size:20px">architecture</span>Technique Breakdown</h3>
        ${steps}
      </div>
      <div class="flex items-start gap-3 p-4 bg-surface-container-low/50 border-l-4 border-tertiary rounded-r-xl">
        <span class="material-symbols-outlined text-tertiary mt-0.5 shrink-0" style="font-size:20px">psychology</span>
        <div><p class="text-tertiary font-bold uppercase tracking-wider mb-1" style="font-size:10px">Sensei's Tip</p>
        <p class="text-on-surface-variant text-sm leading-relaxed">${drill.tip}</p></div>
      </div>
      <div class="flex flex-col items-center bg-surface-container-high rounded-2xl p-8 border border-outline-variant/20 shadow-inner">
        <p class="text-on-surface-variant font-bold uppercase tracking-widest mb-4" style="font-size:10px">REPETITION GOAL</p>
        <div class="flex items-baseline gap-2 mb-8">
          <span class="font-extrabold text-on-surface transition-colors" style="font-size:72px;line-height:1" id="drill-rep-count">0</span>
          <span class="text-2xl font-bold text-on-surface-variant">/ ${drill.repGoal}</span>
        </div>
        <button onclick="DojoPractice.addReps(10)"
          class="btn-tactile w-full bg-primary-container text-on-primary-container font-bold py-5 rounded-2xl text-lg uppercase tracking-widest flex items-center justify-center gap-3" id="drill-rep-btn">
          <span class="material-symbols-outlined" style="font-size:24px">add_circle</span>+10 REPS
        </button>
        <p class="mt-4 text-on-surface-variant text-xs text-center">Tap after each set of 10 repetitions</p>
      </div>`;
  }

  function _conditioningHTML(drill) {
    const tasks = (drill.tasks||[]).map(task => `
      <button class="w-full bg-surface-container-high p-4 rounded-xl flex items-center justify-between active:scale-[0.99] transition-transform"
        onclick="DojoPractice.toggleTask(this)">
        <div class="flex items-center gap-4">
          <div class="hanko-seal w-7 h-7 rounded-full border-2 border-outline-variant/60 transition-all relative shrink-0"></div>
          <span class="text-sm font-medium text-on-surface">${task}</span>
        </div>
        <span class="material-symbols-outlined text-on-surface-variant/40" style="font-size:20px">chevron_right</span>
      </button>`).join('');

    return `
      <div class="bg-surface-container border border-outline-variant/30 p-5 rounded-2xl">
        <div class="flex items-center gap-2 mb-4"><div class="w-1.5 h-6 bg-primary rounded-full"></div>
          <h3 class="font-bold text-on-surface text-base">${drill.title}</h3></div>
        <div class="grid grid-cols-3 gap-3 mb-5">
          ${['Sets|'+drill.sets,'Reps|'+drill.reps,'Rest|'+drill.rest+'s'].map(x=>{const[l,v]=x.split('|');return`
          <div class="bg-surface-container-high p-3 rounded-xl text-center border border-outline-variant/20">
            <span class="block text-2xl font-black text-primary leading-none">${v}</span>
            <span class="text-on-surface-variant font-bold uppercase tracking-widest mt-1 block" style="font-size:9px">${l}</span>
          </div>`;}).join('')}
        </div>
        <div class="flex items-start gap-3 p-4 bg-tertiary/10 border-l-4 border-tertiary rounded-r-xl">
          <span class="material-symbols-outlined text-tertiary shrink-0 mt-0.5" style="font-size:20px">psychology</span>
          <div><p class="text-tertiary font-bold uppercase tracking-wider mb-1" style="font-size:10px">Sensei's Tip</p>
          <p class="text-on-surface-variant text-sm leading-relaxed">${drill.tip}</p></div>
        </div>
      </div>
      <div class="space-y-3">${tasks}</div>
      <button id="drill-timer-btn" onclick="DojoPractice.toggleTimer(${drill.rest})"
        class="btn-tactile w-full bg-primary-container text-on-primary-container font-black py-5 rounded-2xl text-xl flex items-center justify-center gap-3 uppercase tracking-widest">
        <span class="material-symbols-outlined ms-fill" style="font-size:28px">timer</span>
        <span id="drill-timer-label">START REST TIMER</span>
      </button>`;
  }

  function addReps(n) {
    if (!_currentDrill) return;
    _repCount = Math.min(_currentDrill.repGoal, _repCount + n);
    const el = document.getElementById('drill-rep-count');
    if (el) { el.textContent = _repCount; el.classList.add('text-primary'); setTimeout(()=>el.classList.remove('text-primary'),300); }
    if (_repCount >= _currentDrill.repGoal) {
      const btn = document.getElementById('drill-rep-btn');
      if (btn) {
        btn.innerHTML = '<span class="material-symbols-outlined ms-fill" style="font-size:24px">check_circle</span> DRILL COMPLETE!';
        btn.classList.replace('bg-primary-container','bg-tertiary');
        btn.classList.replace('text-on-primary-container','text-on-tertiary');
        btn.style.boxShadow = '0 6px 0 0 #005047'; btn.disabled = true;
      }
    }
  }

  function toggleTimer(restSecs) {
    const btn = document.getElementById('drill-timer-btn');
    const lbl = document.getElementById('drill-timer-label');
    if (!btn||!lbl) return;
    if (_timerRunning) {
      clearInterval(_timerInterval); _timerRunning = false; _timerSecs = restSecs;
      lbl.textContent = 'START REST TIMER'; btn.classList.remove('opacity-70');
    } else {
      _timerRunning = true; _timerSecs = restSecs; btn.classList.add('opacity-70');
      _timerInterval = setInterval(()=>{
        _timerSecs--;
        lbl.textContent = `REST: ${_timerSecs}s`;
        if (_timerSecs <= 0) {
          clearInterval(_timerInterval); _timerRunning = false;
          lbl.textContent = 'REST COMPLETE ✓'; btn.classList.remove('opacity-70');
          setTimeout(()=>{ lbl.textContent = 'START REST TIMER'; }, 2000);
        }
      }, 1000);
    }
  }

  function toggleTask(btn) {
    const seal = btn.querySelector('.hanko-seal');
    if (!seal) return;
    const done = seal.classList.toggle('border-primary');
    seal.classList.toggle('bg-primary/20', done);
    btn.classList.toggle('border-l-4', done);
    btn.classList.toggle('border-primary/40', done);
  }

  function playDrillVideo() {
    const playBtn = document.getElementById('drill-play-btn');
    const url = playBtn?.dataset.url || '';
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    if (!m) return;
    const iframe = document.getElementById('drill-iframe');
    const thumb  = document.getElementById('drill-video-thumb');
    if (iframe) { iframe.src=`https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`; iframe.classList.remove('hidden'); }
    if (thumb) thumb.classList.add('hidden');
    if (playBtn) playBtn.classList.add('hidden');
  }

  function openTechLesson(beltId, itemName, beltIdx) {
    closeBeltDrawer();
    // Route knowledge items to knowledge screen
    const belt = (typeof BELT_DATA !== 'undefined') ? BELT_DATA.find(b => b.id === beltId) : null;
    let groupTitle = '';
    if (belt) {
      for (const g of belt.groups) {
        if (g.items.includes(itemName)) { groupTitle = g.title; break; }
      }
    }
    const isKnowledge = /Knowledge|Moral|Terminology|Contest|Referee|Basics/i.test(groupTitle);
    if (isKnowledge) {
      DojoKnowledge.open(beltId, itemName, groupTitle, beltIdx, 'practice');
    } else {
      DojoLesson.open(beltId, itemName, beltIdx, 'practice');
    }
  }

  function startUnitExam() { showScreen('unit-exam'); }

  return { renderHub, renderSyllabus, openBeltDrawer, closeBeltDrawer, openDrill, openFilter, filterBy, searchTech, clearSearch, addReps, toggleTimer, toggleTask, playDrillVideo, openTechLesson, startUnitExam };
})();

function playDrillVideo() { DojoPractice.playDrillVideo(); }
