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

  // ── Daily mission state ─────────────────────────
  let _mission = null;

  function _todayKey() { return new Date().toISOString().slice(0, 10); }

  function _getDailyMission(beltId, beltIdx) {
    const dateKey = _todayKey();
    // Return cached if date + belt match
    if (_mission && _mission.date === dateKey && _mission.beltId === beltId) return _mission;
    // Try localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('dojo_daily_quest') || '{}');
      if (stored.date === dateKey && stored.beltId === beltId && Array.isArray(stored.tasks) && stored.tasks.length) {
        _mission = stored;
        return _mission;
      }
    } catch {}

    // Generate fresh mission seeded by date
    const seed = parseInt(dateKey.replace(/-/g, ''), 10);
    const belt = (typeof BELT_DATA !== 'undefined') ? BELT_DATA.find(b => b.id === beltId) : null;
    if (!belt) { _mission = { date: dateKey, beltId, tasks: [] }; return _mission; }

    const techGroups = belt.groups.filter(g => !/Knowledge|Moral|Terminology|Contest|Referee/i.test(g.title));
    const knowGroups = belt.groups.filter(g =>  /Knowledge|Moral|Terminology|Contest|Referee/i.test(g.title));

    const techItems = techGroups.flatMap(g => g.items.map(item => ({ item, group: g.title })));
    const knowItems = knowGroups.flatMap(g => g.items.map(item => ({ item, group: g.title })));

    // Prefer unlocked + undone (respect belt path sequence)
    const undoneTech = techItems.filter(({item}) =>
      !DojoState.isDone(beltId, item) && DojoState.isItemUnlocked(beltId, item));
    const undoneKnow = knowItems.filter(({item}) =>
      !DojoState.isDone(beltId, item) && DojoState.isItemUnlocked(beltId, item));

    const pickFrom = (pool, fallback, offset) => {
      const arr = pool.length ? pool : fallback;
      return arr.length ? arr[(seed + offset) % arr.length] : null;
    };

    const tasks = [];
    const usedItems = new Set();

    // Task 1: technique
    const t1 = pickFrom(undoneTech, techItems, 0);
    if (t1) { tasks.push({ type:'technique', beltId, beltIdx, item:t1.item, group:t1.group, label:t1.item }); usedItems.add(t1.item); }

    // Task 2: knowledge item (if available), else second technique
    const t2k = pickFrom(undoneKnow, knowItems, 1);
    if (t2k) {
      tasks.push({ type:'knowledge', beltId, beltIdx, item:t2k.item, group:t2k.group, label:t2k.item });
      usedItems.add(t2k.item);
    } else {
      const pool2 = (undoneTech.length ? undoneTech : techItems).filter(({item}) => !usedItems.has(item));
      const t2 = pickFrom(pool2, techItems.filter(({item}) => !usedItems.has(item)), 2);
      if (t2) { tasks.push({ type:'technique', beltId, beltIdx, item:t2.item, group:t2.group, label:t2.item }); usedItems.add(t2.item); }
    }

    // Task 3: another technique from a different group if possible
    const pool3 = (undoneTech.length ? undoneTech : techItems).filter(({item, group}) =>
      !usedItems.has(item) && (!tasks[0] || group !== tasks[0].group));
    const t3 = pickFrom(pool3, techItems.filter(({item}) => !usedItems.has(item)), 3);
    if (t3) tasks.push({ type:'technique', beltId, beltIdx, item:t3.item, group:t3.group, label:t3.item });

    _mission = { date: dateKey, beltId, tasks: tasks.slice(0, 3) };
    try { localStorage.setItem('dojo_daily_quest', JSON.stringify(_mission)); } catch {}
    return _mission;
  }

  function openQuestTask(idx) {
    if (!_mission || !_mission.tasks[idx]) return;
    const task = _mission.tasks[idx];
    // Always pass 'home' as returnScreen so success screen knows we came from Today
    if (task.type === 'technique') {
      DojoLesson.open(task.beltId, task.item, task.beltIdx, 'home');
    } else if (task.type === 'knowledge') {
      if (typeof DojoKnowledge !== 'undefined')
        DojoKnowledge.open(task.beltId, task.item, task.group, task.beltIdx, 'home');
    }
  }

  // Returns the next incomplete quest task after a given item, or null
  function getNextQuestTask(completedItem) {
    if (!_mission) return null;
    // Find first task that isn't done yet (and isn't the one we just finished)
    for (let i = 0; i < _mission.tasks.length; i++) {
      const t = _mission.tasks[i];
      if (t.item === completedItem) continue;
      if (!DojoState.isDone(t.beltId, t.item)) return { task: t, idx: i };
    }
    return null; // all done
  }

  // ── Main render ───────────────────────────────────
  function render() {
    if (typeof BELT_DATA === 'undefined') return;
    const container = document.getElementById('home-path-container');
    if (!container) return;

    const workIdx  = DojoState.getWorkingBeltIndex();
    const belt     = BELT_DATA[workIdx];
    if (!belt) return;

    const accent   = BELT_ACCENT[belt.id] || { color:'#004ac6', shadow:'#1e40af', label: belt.to + ' Belt', img:'images/belt-white.png' };
    const profile  = DojoState.getProfile();
    const firstName = (profile.name || 'Judoka').split(' ')[0];
    const streak   = DojoState.getStreak();
    const xp       = DojoState.getXP();

    // Belt progress
    const allItems  = belt.groups.flatMap(g => g.items);
    const doneCount = allItems.filter(item => DojoState.isDone(belt.id, item)).length;
    const readPct   = allItems.length ? Math.round(doneCount / allItems.length * 100) : 0;

    // Daily mission
    const mission   = _getDailyMission(belt.id, workIdx);
    const tasksDone = mission.tasks.filter(t => DojoState.isDone(t.beltId, t.item) || t.type === 'drill').length;
    // Re-check done status live (progress may have changed since mission was generated)
    mission.tasks.forEach(t => { if (t.type !== 'drill') t._liveDone = DojoState.isDone(t.beltId, t.item); else t._liveDone = !!t.drillDone; });
    const liveDone  = mission.tasks.filter(t => t._liveDone).length;
    const allQDone  = liveDone >= mission.tasks.length && mission.tasks.length > 0;

    // Greeting
    const hour     = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const dateStr  = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'short' });

    const TASK_ICON  = { technique:'sports_kabaddi', knowledge:'menu_book', drill:'fitness_center' };
    const TASK_LABEL = { technique:'Technique', knowledge:'Knowledge', drill:'Drill' };

    let html = '';

    // ── Greeting ──────────────────────────────────────
    html += `
      <div class="pt-1 pb-2">
        <p class="text-on-surface-variant font-semibold text-sm">${greeting},</p>
        <h2 class="font-extrabold text-on-surface leading-tight" style="font-size:26px">${firstName} 🥋</h2>
      </div>`;

    // ── Daily Quest card ──────────────────────────────
    const earnedXP = liveDone * 50;
    const totalQXP = mission.tasks.length * 50;
    const qBg = allQDone
      ? 'linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)'
      : 'linear-gradient(135deg,#ffffff 0%,#eff4ff 100%)';
    const qBorder = allQDone ? '#00624240' : accent.color + '40';

    html += `
      <div class="rounded-2xl overflow-hidden border-2" style="background:${qBg};border-color:${qBorder};box-shadow:0 4px 16px rgba(0,74,198,0.08)">
        <!-- Header row -->
        <div class="flex items-center justify-between px-4 pt-4 pb-2">
          <div>
            <p class="font-extrabold uppercase tracking-widest mb-0.5" style="font-size:9px;color:${allQDone?'#006242':accent.color}">
              ${allQDone ? '✓ QUEST COMPLETE' : '⚡ DAILY QUEST'}
            </p>
            <p class="font-bold text-on-surface" style="font-size:13px">${dateStr}</p>
          </div>
          <div class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl" style="background:${allQDone?'rgba(0,98,66,0.1)':accent.color+'14'}">
            <span class="material-symbols-outlined ms-fill" style="font-size:13px;color:${allQDone?'#006242':accent.color}">bolt</span>
            <span class="font-black" style="font-size:12px;color:${allQDone?'#006242':accent.color}">${earnedXP}/${totalQXP} XP</span>
          </div>
        </div>
        <!-- Progress bar -->
        <div class="mx-4 mb-3 h-1 rounded-full overflow-hidden" style="background:${allQDone?'rgba(0,98,66,0.15)':accent.color+'15'}">
          <div class="h-full rounded-full transition-all duration-700" style="width:${mission.tasks.length?Math.round(liveDone/mission.tasks.length*100):0}%;background:${allQDone?'#006242':accent.color}"></div>
        </div>
        <!-- Tasks -->
        <div class="px-4 pb-4 space-y-2">`;

    if (mission.tasks.length === 0) {
      html += `<p class="text-on-surface-variant text-sm text-center py-3">All techniques complete! 🎉</p>`;
    }

    mission.tasks.forEach((task, i) => {
      const done  = task._liveDone;
      const icon  = TASK_ICON[task.type]  || 'star';
      const label = TASK_LABEL[task.type] || 'Task';
      const en    = (task.type === 'technique' || task.type === 'knowledge')
                    ? ((typeof TERMS_EN !== 'undefined' && TERMS_EN[task.item]) ? TERMS_EN[task.item] : task.item.replace(/-/g,' '))
                    : '';
      html += `
          <div class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer active:scale-[0.98] transition-all"
            style="background:${done?accent.color+'0a':'#ffffff'};border-color:${done?accent.color+'40':'#e5eeff'}"
            onclick="DojoHome.openQuestTask(${i})">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style="background:${done?accent.color:'#eff4ff'}">
              <span class="material-symbols-outlined ${done?'ms-fill':''}" style="font-size:18px;color:${done?'#fff':accent.color}">
                ${done ? 'check' : icon}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-on-surface leading-tight truncate" style="font-size:12px">${task.label}</p>
              ${en ? `<p class="text-on-surface-variant truncate mt-0.5" style="font-size:10px">${en}</p>` : ''}
              <p class="font-bold uppercase tracking-widest mt-0.5" style="font-size:8px;color:${done?accent.color:'#93b4f0'}">${label} · +50 XP</p>
            </div>
            ${done
              ? `<span class="material-symbols-outlined ms-fill shrink-0" style="font-size:18px;color:${accent.color}">task_alt</span>`
              : `<span class="material-symbols-outlined shrink-0" style="font-size:16px;color:#c7d7f5">chevron_right</span>`}
          </div>`;
    });

    if (allQDone && mission.tasks.length > 0) {
      html += `
          <div class="flex items-center justify-center gap-2 pt-1">
            <span class="material-symbols-outlined ms-fill text-emerald-600" style="font-size:16px">celebration</span>
            <p class="font-bold text-emerald-700" style="font-size:12px">Quest complete! Come back tomorrow.</p>
          </div>`;
    }

    html += `
        </div>
      </div>`;

    // ── Quick Stats strip (always shown) ────────────
    html += `
      <div class="grid grid-cols-3 gap-2">
        <div class="bg-white border border-outline-variant/20 rounded-2xl p-3 flex flex-col items-center">
          <span class="material-symbols-outlined ms-fill text-orange-400 mb-1" style="font-size:20px">local_fire_department</span>
          <span class="font-black text-on-surface leading-none" style="font-size:20px">${streak}</span>
          <span class="text-on-surface-variant font-bold uppercase text-center leading-tight mt-1" style="font-size:8px">STREAK</span>
        </div>
        <div class="bg-white border border-outline-variant/20 rounded-2xl p-3 flex flex-col items-center">
          <span class="material-symbols-outlined ms-fill text-primary mb-1" style="font-size:20px">bolt</span>
          <span class="font-black text-on-surface leading-none" style="font-size:20px">${xp}</span>
          <span class="text-on-surface-variant font-bold uppercase text-center leading-tight mt-1" style="font-size:8px">XP</span>
        </div>
        <div class="bg-white border border-outline-variant/20 rounded-2xl p-3 flex flex-col items-center">
          <div class="w-4 h-4 rounded-full mb-1 shrink-0" style="background:${accent.color}"></div>
          <span class="font-black text-on-surface leading-none" style="font-size:20px">${readPct}%</span>
          <span class="text-on-surface-variant font-bold uppercase text-center leading-tight mt-1" style="font-size:8px">${accent.label.replace(' Belt','').toUpperCase()}</span>
        </div>
      </div>`;

    // ── Daily Coaching Tip ────────────────────────────
    const TIPS = [
      { title:'Master Kuzushi First',  icon:'swap_vert',         body:'Every throw begins with breaking your partner\'s balance. Get kuzushi right and the technique will follow naturally.' },
      { title:'Control the Sleeve',    icon:'back_hand',         body:'Secure the sleeve before the lapel. A firm sleeve grip controls uke\'s arm and limits their attack options.' },
      { title:'Fall Better, Win More', icon:'airline_seat_flat', body:'Good ukemi is good judo. A judoka who falls confidently trains harder and learns faster.' },
      { title:'Combine Your Attacks',  icon:'shuffle',           body:'Set up your big throw with a smaller one. A convincing feint opens the space for your real technique.' },
      { title:'Win on the Ground',     icon:'rotate_right',      body:'Ne-waza wins contests. Even 5 seconds of osaekomi can change a match — stay active.' },
      { title:'Protect Your Posture',  icon:'accessibility_new', body:'Stand tall and upright. Bending forward gives your opponent your back.' },
      { title:'Randori Mindset',       icon:'psychology',        body:'In randori, experiment freely. In shiai, execute what you know. Every session is a learning lab.' },
    ];
    const tip = TIPS[new Date().getDay() % TIPS.length];
    html += `
      <div class="flex items-start gap-3 p-4 rounded-2xl border border-tertiary/20"
        style="background:linear-gradient(135deg,#f0fdf4 0%,#ecfdf5 100%)">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background:#d1fae5">
          <span class="material-symbols-outlined ms-fill text-emerald-600" style="font-size:20px">${tip.icon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold uppercase tracking-widest text-emerald-700 mb-0.5" style="font-size:8px">SENSEI'S TIP</p>
          <p class="font-bold text-on-surface leading-snug mb-1" style="font-size:13px">${tip.title}</p>
          <p class="text-on-surface-variant leading-relaxed" style="font-size:12px">${tip.body}</p>
        </div>
      </div>`;

    // ── Belt mini-card → Path ─────────────────────────
    html += `
      <button onclick="showScreen('belt-path')"
        class="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98]"
        style="background:#ffffff;border-color:${accent.color}25;box-shadow:0 2px 8px rgba(0,74,198,0.05)">
        <img src="${accent.img}" alt="${accent.label}" class="h-12 w-auto drop-shadow shrink-0" onerror="this.style.display='none'"/>
        <div class="flex-1 min-w-0 text-left">
          <p class="font-bold uppercase tracking-widest mb-0.5" style="font-size:9px;color:${accent.color}">BELT PATH</p>
          <p class="font-bold text-on-surface leading-tight" style="font-size:13px">${accent.label}</p>
          <div class="mt-1.5 w-full h-1 rounded-full overflow-hidden" style="background:#eff4ff">
            <div class="h-full rounded-full transition-all duration-700" style="width:${readPct}%;background:${accent.color}"></div>
          </div>
          <p class="text-on-surface-variant mt-1" style="font-size:10px">${doneCount} of ${allItems.length} techniques · ${readPct}%</p>
        </div>
        <span class="material-symbols-outlined shrink-0" style="font-size:20px;color:${accent.color}">arrow_forward_ios</span>
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
          const mastery  = DojoState.getMastery(belt.id, item);
          const mLabel   = mastery >= 4 ? 'MASTERED' : mastery === 3 ? 'DRILLED' : mastery === 2 ? 'TRAINED' : 'DONE';
          const mColor   = mastery >= 4 ? '#006242'  : accent.color;
          const mPips    = Math.min(mastery, 4);
          const pipsHtml = [1,2,3,4].map(p =>
            `<span class="inline-block rounded-full" style="width:10px;height:5px;background:${p<=mPips?mColor:'#dce9ff'}"></span>`
          ).join('');
          html += `
            <div class="tile-done flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all cursor-pointer"
              style="background:${mastery>=4?'#ecfdf5':accent.color+'0d'};border-color:${mastery>=4?'#00624230':accent.color+'30'}"
              onclick="DojoHome.openItem('${belt.id}','${item.replace(/'/g,"\'")}',${workIdx})">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style="background:${mastery>=4?'#006242':accent.color}">
                <span class="material-symbols-outlined ms-fill text-white" style="font-size:20px">${mastery>=4?'military_tech':'check'}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-on-surface leading-tight truncate" style="font-size:13px">${item}</p>
                <div class="flex items-center gap-2 mt-1">
                  <div class="flex gap-1">${pipsHtml}</div>
                  <span class="font-black uppercase tracking-widest" style="font-size:8px;color:${mColor}">${mLabel}</span>
                </div>
              </div>
              <span class="material-symbols-outlined shrink-0" style="font-size:16px;color:${accent.color}40">chevron_right</span>
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

  return { render, renderBeltPath, renderChecklist, openItem, startUnitExam, switchBelt, openQuestTask, getNextQuestTask };
})();
