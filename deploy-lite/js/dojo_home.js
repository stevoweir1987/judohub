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

  function openFirstIncompleteTask() {
    if (!_mission) return;
    const idx = _mission.tasks.findIndex(t => !DojoState.isDone(t.beltId, t.item));
    if (idx !== -1) openQuestTask(idx);
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

    let html = '';

    // ── Status bar (date + streak + XP) ──────────────
    const dateStr  = new Date().toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' });
    html += `
      <div class="flex items-center justify-between pt-1 pb-3">
        <span class="font-bold text-on-surface-variant" style="font-size:12px">${dateStr}</span>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined ms-fill" style="font-size:15px;color:#f97316">local_fire_department</span>
            <span class="font-black text-on-surface" style="font-size:13px">${streak}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined ms-fill" style="font-size:15px;color:${accent.color}">bolt</span>
            <span class="font-black text-on-surface" style="font-size:13px">${xp} XP</span>
          </div>
        </div>
      </div>`;

    // ── Session mode state ───────────────────────────
    const SESSION_MODES = [
      { mins: 2,  label: '2 min',  tasks: 1 },
      { mins: 5,  label: '5 min',  tasks: 2 },
      { mins: 10, label: '10 min', tasks: 3 },
      { mins: 0,  label: 'Any',    tasks: 3 },
      { mins: -1, label: 'Tired',  tasks: 1 },
    ];
    const isTiredMode    = _sessionMins === -1;
    const taskLimit      = SESSION_MODES.find(m => m.mins === _sessionMins)?.tasks ?? 3;
    const visibleTasks   = mission.tasks.slice(0, taskLimit);
    const visibleDone    = visibleTasks.filter(t => t._liveDone).length;
    const allVisibleDone = visibleTasks.length > 0 && visibleDone >= visibleTasks.length;
    const firstIncompleteIdx = visibleTasks.findIndex(t => !t._liveDone);

    // Session context line
    const _tc  = visibleTasks.filter(t => t.type === 'technique').length;
    const _kc  = visibleTasks.filter(t => t.type === 'knowledge').length;
    const _est = _tc * 5 + _kc * 3;
    const sessionDesc = visibleTasks.length === 0
      ? 'All techniques complete!'
      : [_tc > 0 ? _tc + (_tc === 1 ? ' technique' : ' techniques') : '', _kc > 0 ? _kc + ' knowledge' : ''].filter(Boolean).join(' + ') + ' · ~' + _est + ' min';

    // ── Hero card ────────────────────────────────────
    if (allVisibleDone) {
      html += `
        <div class="rounded-3xl" style="background:linear-gradient(135deg,#065f46,#047857);box-shadow:0 6px 0 #064e3b">
          <div class="p-5">
            <p class="font-black uppercase tracking-widest mb-2" style="font-size:9px;color:rgba(255,255,255,0.6)">TODAY'S SESSION</p>
            <p class="font-black text-white leading-tight mb-1" style="font-size:22px">Session Complete!</p>
            <p style="font-size:12px;color:rgba(255,255,255,0.7);margin-bottom:16px">Come back tomorrow to keep your streak going.</p>
            <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:12px;text-align:center">
              <span class="font-black text-white" style="font-size:13px">&#10003; ${visibleDone} task${visibleDone !== 1 ? 's' : ''} done &middot; +${visibleDone * 50} XP earned</span>
            </div>
          </div>
        </div>`;
    } else {
      const _heroLabel = isTiredMode ? "TIRED SESSION" : "TODAY'S SESSION";
      const _heroTitle = isTiredMode ? "One technique. That's enough." : sessionDesc;
      const _heroSub   = isTiredMode
        ? "Every session counts. Even small ones."
        : accent.label + ' path · ' + readPct + '% ready';
      html += `
        <div class="rounded-3xl" style="background:linear-gradient(135deg,${accent.color},${accent.shadow});box-shadow:0 6px 0 ${accent.shadow}">
          <div class="p-5">
            <p class="font-black uppercase tracking-widest mb-1" style="font-size:9px;color:rgba(255,255,255,0.6)">${_heroLabel}</p>
            <p class="font-black text-white leading-tight mb-1" style="font-size:22px">${_heroTitle}</p>
            <p style="font-size:11px;color:rgba(255,255,255,0.65);margin-bottom:14px">${_heroSub}</p>
            <div class="flex gap-2 mb-4">`;
      SESSION_MODES.forEach(m => {
        const active = m.mins === _sessionMins;
        const isTiredBtn = m.mins === -1;
        html += '<button onclick="DojoHome.setSessionMode(' + m.mins + ')"'
          + ' style="flex:1;padding:8px 4px;border-radius:10px;border:1.5px solid '
          + (active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)')
          + ';background:'
          + (active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)')
          + ';color:'
          + (active ? '#fff' : 'rgba(255,255,255,0.45)')
          + ';font-weight:800;font-size:' + (isTiredBtn ? '10' : '11') + 'px;cursor:pointer;letter-spacing:0.02em;transition:all 0.15s">'
          + m.label + '</button>';
      });
      html += `</div>
            <button class="w-full flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
              style="background:#fff;color:${accent.color};border-radius:14px;padding:15px;font-weight:900;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;border:none;cursor:pointer;box-shadow:0 3px 0 rgba(0,0,0,0.18)"
              onclick="DojoHome.openFirstIncompleteTask()">
              <span class="material-symbols-outlined ms-fill" style="font-size:20px">play_arrow</span>
              Start Training
            </button>
          </div>
        </div>`;
    }

    // ── Quest receipt (task list) ────────────────────
    const TASK_ICON  = { technique:'sports_kabaddi', knowledge:'menu_book', drill:'fitness_center' };
    const TASK_LABEL = { technique:'Technique', knowledge:'Knowledge', drill:'Drill' };
    const TIME_EST   = { technique:'~5 min', knowledge:'~3 min', drill:'~3 min' };

    if (visibleTasks.length > 0) {
      const earnedXP = visibleDone * 50;
      const totalQXP = visibleTasks.length * 50;
      html += `
        <div class="rounded-2xl border" style="background:#fff;border-color:${allVisibleDone ? '#00624230' : accent.color + '25'};box-shadow:0 2px 8px rgba(0,74,198,0.05)">
          <div class="flex items-center justify-between px-4 pt-3 pb-2">
            <p class="font-black uppercase tracking-widest" style="font-size:9px;color:${allVisibleDone ? '#006242' : '#93b4f0'}">${allVisibleDone ? 'COMPLETE' : "TODAY'S TASKS"}</p>
            <span class="font-black" style="font-size:11px;color:${allVisibleDone ? '#006242' : accent.color}">${earnedXP}/${totalQXP} XP</span>
          </div>
          <div class="mx-4 mb-3 h-1 rounded-full overflow-hidden" style="background:${accent.color}12">
            <div class="h-full rounded-full transition-all duration-700" style="width:${Math.round(visibleDone / visibleTasks.length * 100)}%;background:${allVisibleDone ? '#006242' : accent.color}"></div>
          </div>
          <div class="px-3 pb-3 space-y-2">`;

      visibleTasks.forEach((task, i) => {
        const done    = task._liveDone;
        const icon    = TASK_ICON[task.type]  || 'star';
        const label   = TASK_LABEL[task.type] || 'Task';
        const timeEst = TIME_EST[task.type]   || '~5 min';
        const en      = (task.type === 'technique' || task.type === 'knowledge')
                        ? ((typeof TERMS_EN !== 'undefined' && TERMS_EN[task.item]) ? TERMS_EN[task.item] : task.item.replace(/-/g,' '))
                        : '';
        const isNext  = !done && i === firstIncompleteIdx;
        html += `
            <div class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer active:scale-[0.98] transition-all"
              style="background:${done ? accent.color + '08' : isNext ? accent.color + '05' : '#fafcff'};border-color:${done ? accent.color + '40' : isNext ? accent.color + '40' : '#eef2ff'}"
              onclick="DojoHome.openQuestTask(${i})">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style="background:${done ? accent.color : isNext ? accent.color + '20' : '#eff4ff'}">
                <span class="material-symbols-outlined ${done ? 'ms-fill' : ''}" style="font-size:16px;color:${done ? '#fff' : accent.color}">
                  ${done ? 'check' : icon}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-on-surface leading-tight truncate" style="font-size:12px">${task.label}</p>
                ${en ? '<p class="text-on-surface-variant truncate mt-0.5" style="font-size:10px">' + en + '</p>' : ''}
                <p class="font-bold uppercase tracking-widest mt-0.5" style="font-size:8px;color:${done ? '#22c55e' : '#93b4f0'}">${label} &middot; ${timeEst} &middot; +50 XP</p>
              </div>
              ${done
                ? '<span class="material-symbols-outlined ms-fill shrink-0" style="font-size:18px;color:' + accent.color + '">task_alt</span>'
                : '<span class="material-symbols-outlined shrink-0" style="font-size:16px;color:#c7d7f5">chevron_right</span>'}
            </div>`;
      });

      html += `
          </div>
        </div>`;
    }

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
          <p class="text-on-surface-variant mt-1" style="font-size:10px">${doneCount} of ${allItems.length} techniques &middot; ${readPct}%</p>
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

    // ── Next Up banner ──────────────────────────────
    let nextUpItem = null, nextUpGroup = '';
    for (const g of belt.groups) {
      for (const item of g.items) {
        if (!DojoState.isDone(belt.id, item) && DojoState.isItemUnlocked(belt.id, item)) {
          nextUpItem  = item;
          nextUpGroup = g.title;
          break;
        }
      }
      if (nextUpItem) break;
    }

    let html = '';
    if (nextUpItem && !allDone) {
      const _en = (typeof TERMS_EN !== 'undefined' && TERMS_EN[nextUpItem]) ? TERMS_EN[nextUpItem] : nextUpItem.replace(/-/g,' ');
      html += '<div style="background:linear-gradient(135deg,' + accent.color + ',' + accent.shadow + ');border-radius:20px;padding:18px;margin-bottom:12px;box-shadow:0 4px 0 ' + accent.shadow + '">'
        + '<p style="font-size:9px;font-weight:800;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px">UP NEXT</p>'
        + '<p style="font-size:19px;font-weight:900;color:#fff;margin-bottom:2px">' + nextUpItem + '</p>'
        + '<p style="font-size:11px;color:rgba(255,255,255,0.7);margin-bottom:14px">' + _en + ' · ' + nextUpGroup + '</p>'
        + '<button onclick=\'DojoHome.openBeltItem("' + belt.id + '","' + nextUpItem.replace(/"/g,'') + '","' + nextUpGroup.replace(/"/g,'') + '",' + workIdx + ')\''
        + ' style="background:#fff;color:' + accent.color + ';border:none;border-radius:12px;padding:12px 20px;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;width:100%;box-shadow:0 3px 0 rgba(0,0,0,0.15)">'
        + 'Train Now</button>'
        + '</div>';
    } else if (allDone) {
      html += '<div style="background:linear-gradient(135deg,#065f46,#047857);border-radius:20px;padding:18px;margin-bottom:12px;text-align:center">'
        + '<p style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px">Belt Path Complete!</p>'
        + '<p style="font-size:12px;color:rgba(255,255,255,0.75)">All techniques done. Grading time.</p>'
        + '</div>';
    }

    html += `<div class="tile-path space-y-3 pb-4">`;
    let globalIdx = 0;

    // Reset expanded groups when belt changes (override set)
    const expandedGroups = _getExpandedGroups(belt);

    belt.groups.forEach(group => {
      const groupDone    = group.items.filter(i => DojoState.isDone(belt.id, i)).length;
      const groupTotal   = group.items.length;
      const isExpanded   = expandedGroups.has(group.title);
      const hasActive    = group.items.some(i => !DojoState.isDone(belt.id, i) && DojoState.isItemUnlocked(belt.id, i));
      const chevron      = isExpanded ? 'expand_less' : 'expand_more';
      const statusColor  = hasActive ? accent.color : (groupDone === groupTotal ? '#006242' : '#93b4f0');
      const statusText   = groupDone === groupTotal ? 'Complete' : groupDone + '/' + groupTotal;

      html += `
        <div class="flex items-center gap-3 px-1 pt-2 pb-1 cursor-pointer select-none"
          onclick="DojoHome.toggleGroup(${JSON.stringify(group.title)})">
          <div class="h-px flex-1 bg-outline-variant/30"></div>
          <div class="flex items-center gap-1.5 px-2">
            <span class="text-on-surface-variant font-bold uppercase tracking-widest" style="font-size:10px">${group.title}</span>
            <span style="font-size:9px;font-weight:700;color:${statusColor};background:${statusColor}18;border-radius:6px;padding:1px 5px">${statusText}</span>
            <span class="material-symbols-outlined" style="font-size:16px;color:#93b4f0">${chevron}</span>
          </div>
          <div class="h-px flex-1 bg-outline-variant/30"></div>
        </div>`;

      if (!isExpanded) return; // collapsed — skip tiles

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

    // Technique Library
    html += `
      <div class="mt-6">
        <button onclick="DojoHome.toggleTechLib()" class="w-full flex items-center gap-3 mb-3 px-1 group">
          <div class="h-px flex-1 bg-outline-variant/30"></div>
          <span class="text-on-surface-variant/60 font-bold uppercase tracking-widest group-active:text-primary transition-colors" style="font-size:10px;white-space:nowrap">&#9660; BROWSE ALL TECHNIQUES</span>
          <div class="h-px flex-1 bg-outline-variant/30"></div>
        </button>
        <div id="tech-lib-body" class="hidden space-y-5">`;
    belt.groups.forEach(function(group) {
      const color = BELT_ACCENT[belt.id] ? BELT_ACCENT[belt.id].color : '#004ac6';
      html += `<div>
        <p class="font-black uppercase tracking-widest mb-2 px-1" style="font-size:9px;color:${color}">${group.title}</p>
        <div class="space-y-1">`;
      group.items.forEach(function(item) {
        const done = DojoState.isDone(belt.id, item);
        const en = (typeof TERMS_EN !== 'undefined' && TERMS_EN[item]) ? TERMS_EN[item] : item.replace(/-/g, ' ');
        const pipColor = done ? color : '#d1d5db';
        html += `<button onclick="DojoHome.openBeltItem('${belt.id}','${item}','${group.title.replace(/'/g,"\'")}',${workIdx})"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl active:scale-[0.98] transition-all text-left"
          style="background:${done ? color+'0d' : '#f8faff'};border:1px solid ${done ? color+'33' : '#e8edf8'}">
          <span class="w-2 h-2 rounded-full shrink-0" style="background:${pipColor}"></span>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm truncate" style="color:#1a1a2e">${item}</p>
            <p class="text-xs truncate" style="color:#6b7280">${en}</p>
          </div>
          ${done ? '<span class="material-symbols-outlined shrink-0" style="font-size:14px;color:'+color+'">check_circle</span>' : '<span class="material-symbols-outlined shrink-0" style="font-size:14px;color:#d1d5db">radio_button_unchecked</span>'}
        </button>`;
      });
      html += `</div></div>`;
    });
    html += `</div></div>`;

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
  let _overrideBeltIdx   = null;
  let _sessionMins       = parseInt(localStorage.getItem('dojo_session_mins') || '5', 10); // 5 = default 5 min

  function setSessionMode(mins) {
    _sessionMins = mins;
    try { localStorage.setItem('dojo_session_mins', String(mins)); } catch {}
    render();
  }
  function getSessionMins() { return _sessionMins; }
  let _expandedGroups    = null; // Set of group titles that are expanded (null = auto)

  function _getExpandedGroups(belt) {
    if (_expandedGroups !== null) return _expandedGroups;
    // Auto: expand only the group containing the first active (unlocked, not done) item
    const autoExpand = new Set();
    for (const group of belt.groups) {
      for (const item of group.items) {
        if (!DojoState.isDone(belt.id, item) && DojoState.isItemUnlocked(belt.id, item)) {
          autoExpand.add(group.title);
          return autoExpand;
        }
      }
    }
    // All done — expand first group
    if (belt.groups.length > 0) autoExpand.add(belt.groups[0].title);
    return autoExpand;
  }

  function toggleTechLib() {
    const body = document.getElementById('tech-lib-body');
    if (!body) return;
    const btn = body.previousElementSibling;
    if (body.classList.contains('hidden')) {
      body.classList.remove('hidden');
      if (btn) btn.querySelector('span:not(.h-px)') && (btn.querySelectorAll('span')[1].textContent = '▲ BROWSE ALL TECHNIQUES');
    } else {
      body.classList.add('hidden');
      if (btn) btn.querySelectorAll('span')[1] && (btn.querySelectorAll('span')[1].textContent = '▼ BROWSE ALL TECHNIQUES');
    }
  }

  function toggleGroup(groupTitle) {
    const belt = BELT_DATA[_overrideBeltIdx !== null ? _overrideBeltIdx : DojoState.getWorkingBeltIndex()];
    if (!belt) return;
    if (_expandedGroups === null) _expandedGroups = _getExpandedGroups(belt);
    if (_expandedGroups.has(groupTitle)) {
      _expandedGroups.delete(groupTitle);
    } else {
      _expandedGroups.add(groupTitle);
    }
    renderBeltPath();
  }
  function switchBelt(idx) {
    _expandedGroups = null; // reset so new belt auto-expands correctly
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

  function getMissionTaskCount() { return _mission ? _mission.tasks.length : 3; }

  // Returns { total, done } for the current mission — used by celebration screen
  function getMissionStats() {
    if (!_mission) return { total: 3, done: 1 };
    const total = _mission.tasks.length;
    const done  = _mission.tasks.filter(t => DojoState.isDone(t.beltId, t.item)).length;
    return { total, done };
  }

  // openBeltItem — called by Next Up banner (groupTitle already known)
  function openBeltItem(beltId, itemName, groupTitle, beltIdx) {
    if (!DojoState.isItemUnlocked(beltId, itemName)) return;
    const isKnowledge = /Knowledge|Moral|Terminology|Contest|Referee|Basics/i.test(groupTitle);
    if (isKnowledge) {
      DojoKnowledge.open(beltId, itemName, groupTitle, beltIdx, 'belt-path');
    } else {
      DojoLesson.open(beltId, itemName, beltIdx, 'belt-path');
    }
  }

  return { render, renderBeltPath, renderChecklist, openItem, openBeltItem, startUnitExam, switchBelt, openQuestTask, openFirstIncompleteTask, getNextQuestTask, getMissionTaskCount, getMissionStats, toggleGroup, toggleTechLib, setSessionMode, getSessionMins };
})();
