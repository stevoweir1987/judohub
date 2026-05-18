// ── PROGRESS TRACKER v2 ─────────────────────────────────────

let progTab = 'overview';
let progGradeSubTab = 'current';
let progExpandedSession = null;

// ── DATA HELPERS ─────────────────────────────────────────────
function getSessionLog() {
  var log1 = JSON.parse(localStorage.getItem('judo_session_log') || '[]');
  var log2 = JSON.parse(localStorage.getItem('judohub_sessions_log') || '[]').map(function(s) {
    return { date: s.date, category: s.cat || 'Training', minutes: s.duration || 20, id: s.date + '_' + (s.cat||'') };
  });
  // Merge, deduplicate by date+category
  var seen = new Set(log1.map(function(s){ return s.date+'_'+(s.category||''); }));
  var merged = log1.slice();
  log2.forEach(function(s){ if (!seen.has(s.date+'_'+s.category)) merged.push(s); });
  merged.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
  return merged;
}
function getRandoriLog()  { return JSON.parse(localStorage.getItem('judo_randori_log')    || '[]'); }
function getBeltTimeline(){ return JSON.parse(localStorage.getItem('judo_belt_timeline')  || '[]'); }
function getWeeklyGoal()  { return JSON.parse(localStorage.getItem('judo_weekly_goal')    || '{"sessions":4,"minutes":60}'); }
function saveRandoriLog(l){ localStorage.setItem('judo_randori_log',   JSON.stringify(l)); }
function saveBeltTimeline(l){localStorage.setItem('judo_belt_timeline',JSON.stringify(l)); }
function saveWeeklyGoal(g){ localStorage.setItem('judo_weekly_goal',   JSON.stringify(g)); }
function saveSessionLog(l){ localStorage.setItem('judo_session_log',   JSON.stringify(l)); }

function fmtDate(str) {
  if (!str) return '–';
  return new Date(str).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}
function fmtDateShort(str) {
  if (!str) return '–';
  return new Date(str).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
}
function todayStr() { return new Date().toISOString().slice(0,10); }

// ── MAIN RENDER ──────────────────────────────────────────────
function renderProgress() {
  const el = document.getElementById('progress-body');
  if (!el) return;
  el.innerHTML = '<div style="padding:14px 14px 0;background:#09090e">'
    + '<div style="color:#f0f4ff;font-size:20px;font-weight:800;margin-bottom:12px">Progress</div>'
    + '<div style="display:flex;background:#13131c;border-radius:10px;padding:3px;gap:2px">'
    + '<button class="prog-seg-btn active" id="psb-overview" onclick="setProgTab(\'overview\')">Overview</button>'
    + '<button class="prog-seg-btn" id="psb-grades" onclick="setProgTab(\'grades\')">Grades</button>'
    + '<button class="prog-seg-btn" id="psb-goals" onclick="setProgTab(\'goals\')">Goals</button>'
    + '</div></div>'
    + '<div id="prog-tab-body" style="padding:12px 14px 80px;background:#09090e"></div>';
  progTab = 'overview';
  renderProgTab();
}

function setProgTab(tab) {
  progTab = tab;
  ['overview','grades','goals'].forEach(function(id) {
    var btn = document.getElementById('psb-' + id);
    if (btn) { btn.className = id === tab ? 'prog-seg-btn active' : 'prog-seg-btn'; }
  });
  renderProgTab();
}

function renderProgTab() {
  var el = document.getElementById('prog-tab-body');
  if (!el) return;
  if (progTab === 'overview') { el.innerHTML = buildOverview(); }
  else if (progTab === 'grades') { el.innerHTML = buildGrades(); setPGradeSubTab('current'); }
  else if (progTab === 'goals')  { el.innerHTML = buildGoals(); }
}

function buildOverview() {
  var log       = getSessionLog();
  var streak    = getStreak();
  var goal      = getWeeklyGoal();
  var weekSes   = getSessionsThisWeek();
  var totalMins = log.reduce(function(s,l){ return s+(l.minutes||0); }, 0);
  var matHours  = totalMins >= 60 ? (totalMins/60).toFixed(1)+'h' : totalMins+'m';

  // Profile
  var p = (typeof getProfile === 'function') ? getProfile() : null;
  var userBeltKey = (p && p.belt) ? p.belt : 'white';

  // ── Overall mastery (all belt requirements combined) ──────
  var totalItems = 0, doneItems = 0;
  if (typeof BELT_DATA !== 'undefined') {
    BELT_DATA.forEach(function(b) {
      b.groups.forEach(function(g) {
        g.items.forEach(function(item) {
          totalItems++;
          if (beltProgress && beltProgress[b.id+'_'+item]) doneItems++;
        });
      });
    });
  }
  var masteryPct = totalItems ? Math.round(doneItems/totalItems*100) : 0;

  // Mastery donut ring
  var ringR = 52; var ringC = 2*Math.PI*ringR;
  var ringDone   = ringC * (masteryPct/100);
  var ringRemain = ringC - ringDone;

  // ── Weekly consistency bars ───────────────────────────────
  var today = new Date();
  var dow = (today.getDay()+6)%7;
  var dayLabels = ['M','T','W','T','F','S','S'];
  var weekDates = [];
  for (var d=0; d<7; d++) {
    var dd = new Date(today); dd.setDate(today.getDate()-dow+d);
    weekDates.push(dd.toISOString().slice(0,10));
  }
  var todayStr2 = today.toISOString().slice(0,10);
  var minutesByDay = {};
  weekDates.forEach(function(dt){ minutesByDay[dt] = 0; });
  log.forEach(function(s){ if (minutesByDay.hasOwnProperty(s.date)) minutesByDay[s.date] += (s.minutes||20); });
  var maxMins = Math.max(60, Math.max.apply(null, weekDates.map(function(d){ return minutesByDay[d]; })));
  var weekMinsDone = weekDates.reduce(function(s,d){ return s+(minutesByDay[d]||0); }, 0);
  var weekPct  = goal.minutes ? Math.min(100, Math.round(weekMinsDone/(goal.minutes*goal.sessions||240)*100)) : 0;
  var weekMatH = weekMinsDone >= 60 ? (weekMinsDone/60).toFixed(1)+'h' : weekMinsDone+'m';

  // ── Belt roadmap ──────────────────────────────────────────
  var beltColorMap = {red:'#dc2626',yellow:'#f5c542',orange:'#f97316',green:'#22c55e',blue:'#3b82f6',brown:'#92400e',black:'#2a2a2a'};
  var activeBelt = (typeof getActiveBelt === 'function') ? getActiveBelt() : null;
  var roadmapHtml = '';
  if (typeof BELT_DATA !== 'undefined') {
    BELT_DATA.forEach(function(b) {
      var allItems = b.groups.reduce(function(a,g){ return a.concat(g.items); }, []);
      var bDone  = allItems.filter(function(i){ return beltProgress && !!beltProgress[b.id+'_'+i]; }).length;
      var bTotal = allItems.length;
      var bPct   = bTotal ? Math.round(bDone/bTotal*100) : 0;
      var bColor = beltColorMap[(b.to||'').toLowerCase()] || '#888';
      var isActive = activeBelt && activeBelt.id === b.id;
      roadmapHtml +=
        '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;'+(isActive?'':'opacity:.75')+'">' +
          '<div style="width:10px;height:10px;border-radius:50%;background:'+bColor+';flex-shrink:0'+(isActive?';box-shadow:0 0 6px '+bColor:'')+'"></div>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
              '<div style="font-size:11px;font-weight:'+(isActive?'700':'600')+';color:'+(isActive?'#f0f4ff':'#888')+'">'+b.to+' Belt</div>' +
              '<div style="font-size:11px;font-weight:700;color:'+bColor+'">'+bPct+'%</div>' +
            '</div>' +
            '<div style="height:4px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden">' +
              '<div style="height:100%;width:'+bPct+'%;background:'+bColor+';border-radius:3px;transition:width .4s"></div>' +
            '</div>' +
          '</div>' +
        '</div>';
    });
  }

  // ── Consistency bars HTML ─────────────────────────────────
  var barsHtml = '<div style="display:flex;align-items:flex-end;gap:5px;height:52px">';
  weekDates.forEach(function(dt, di) {
    var mins    = minutesByDay[dt] || 0;
    var pct     = Math.round((mins/maxMins)*100);
    var isToday = dt === todayStr2;
    var isFuture = dt > todayStr2;
    var barColor = mins > 0 ? '#e63946' : (isToday ? 'rgba(230,57,70,.2)' : 'rgba(255,255,255,.06)');
    var border   = isToday ? '1px solid rgba(230,57,70,.4)' : 'none';
    barsHtml +=
      '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">' +
        '<div style="width:100%;border-radius:3px 3px 0 0;background:'+barColor+';height:'+(mins>0?Math.max(6,Math.round(pct*0.48)):4)+'px;border:'+border+';transition:height .3s;align-self:flex-end"></div>' +
        '<div style="font-size:9px;color:'+(isToday?'#d97706':'#444')+';font-weight:'+(isToday?'700':'400')+'">'+dayLabels[di]+'</div>' +
      '</div>';
  });
  barsHtml += '</div>';

  // ── Stats row ─────────────────────────────────────────────
  var statsHtml =
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid rgba(255,255,255,.07);border-radius:12px;overflow:hidden;margin-bottom:14px">' +
    _pStat(weekMatH,   'Mat hours',  '#f0f4ff', true) +
    _pStat(weekSes+'', 'Sessions',   '#f0f4ff', false) +
    _pStat(log.length+'','All time',  '#f0f4ff', false) +
    _pStat(weekPct+'%','This week',  '#e63946', false) +
    '</div>';

  return (
    // ── Mastery ring ─────────────────────────────────────
    '<div class="p-card" style="text-align:center;padding:20px 16px 16px">' +
      '<div style="font-size:9px;font-weight:700;color:#444;letter-spacing:.9px;text-transform:uppercase;margin-bottom:14px">Mastery Overall</div>' +
      '<div style="position:relative;display:inline-block">' +
        '<svg width="128" height="128" viewBox="0 0 128 128">' +
          '<circle cx="64" cy="64" r="52" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="10"/>' +
          '<circle cx="64" cy="64" r="52" fill="none" stroke="#e63946" stroke-width="10"' +
            ' stroke-dasharray="'+ringDone.toFixed(1)+' '+ringRemain.toFixed(1)+'"' +
            ' stroke-linecap="round" transform="rotate(-90 64 64)"/>' +
        '</svg>' +
        '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">' +
          '<div style="font-size:34px;font-weight:900;color:#f0f4ff;line-height:1">'+masteryPct+'%</div>' +
          '<div style="font-size:10px;color:#555;margin-top:2px">'+doneItems+' / '+totalItems+'</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;justify-content:center;gap:16px;margin-top:12px">' +
        '<div style="display:flex;align-items:center;gap:5px"><div style="width:8px;height:8px;border-radius:2px;background:#e63946"></div><span style="font-size:10px;color:#666">Mastered</span></div>' +
        '<div style="display:flex;align-items:center;gap:5px"><div style="width:8px;height:8px;border-radius:2px;background:rgba(255,255,255,.08)"></div><span style="font-size:10px;color:#666">Remaining</span></div>' +
      '</div>' +
    '</div>' +

    // ── Stats row ─────────────────────────────────────────
    statsHtml +

    // ── Weekly consistency ────────────────────────────────
    '<div class="p-card" style="padding:14px 14px 12px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
        '<div style="font-size:11px;font-weight:700;color:#f0f4ff">Weekly Consistency</div>' +
        '<div style="font-size:10px;color:#555">'+weekSes+' / '+goal.sessions+' sessions</div>' +
      '</div>' +
      barsHtml +
    '</div>' +

    // ── Belt roadmap ──────────────────────────────────────
    '<div class="p-card">' +
      '<div style="font-size:11px;font-weight:700;color:#f0f4ff;margin-bottom:10px">Belt Roadmap</div>' +
      roadmapHtml +
      '<div style="margin-top:10px">' +
        '<button class="p-cta" onclick="setProgTab(\'grades\')">View Full Requirements →</button>' +
      '</div>' +
    '</div>' +

    // ── Streak footer ─────────────────────────────────────
    '<div style="display:flex;justify-content:center;align-items:center;gap:6px;padding:4px 0 8px;color:#555;font-size:12px">' +
      '<span style="color:#e63946">🔥</span>' +
      '<span style="font-weight:700;color:#f0f4ff">'+streak+'</span>' +
      '<span>day streak</span>' +
    '</div>'
  );
}

function _pStat(val, lbl, col, hasBorder) {
  return '<div style="padding:12px 6px;text-align:center'+(hasBorder?'':';border-left:1px solid rgba(255,255,255,.07)')+'">' +
    '<div style="font-size:19px;font-weight:800;color:'+col+';line-height:1">'+val+'</div>' +
    '<div style="font-size:9px;color:#444;text-transform:uppercase;letter-spacing:.5px;margin-top:3px">'+lbl+'</div>' +
  '</div>';
}


function buildGrades() {
  return '<div style="display:flex;background:#13131c;border-radius:10px;padding:3px;gap:2px;margin-bottom:12px" id="pgrades-subtabs">'
    + '<button class="prog-sub-btn active" id="pgsb-current" onclick="setPGradeSubTab(\'current\')">Current Grade</button>'
    + '<button class="prog-sub-btn" id="pgsb-path" onclick="setPGradeSubTab(\'path\')">Grade Path</button>'
    + '</div>'
    + '<div id="pgrades-body"></div>';
}

function setPGradeSubTab(sub) {
  progGradeSubTab = sub;
  ['current','path'].forEach(function(id) {
    var btn = document.getElementById('pgsb-' + id);
    if (btn) btn.className = id === sub ? 'prog-sub-btn active' : 'prog-sub-btn';
  });
  var el = document.getElementById('pgrades-body');
  if (!el) return;
  if (sub === 'current') el.innerHTML = buildGradesCurrent();
  else el.innerHTML = buildGradesPath();
}

function buildGradesCurrent() {
  var p = (typeof getProfile === 'function') ? getProfile() : null;
  var userBeltKey = (p && p.belt) ? p.belt : 'white';
  var beltColorMap = {white:'#e5e5e5',red:'#dc2626',yellow:'#f5c542',orange:'#f97316',green:'#22c55e',blue:'#3b82f6',brown:'#92400e'};
  var beltLabelMap = {white:'White Belt',red:'Red Belt',yellow:'Yellow Belt',orange:'Orange Belt',green:'Green Belt',blue:'Blue Belt',brown:'Brown Belt'};
  var beltColor = beltColorMap[userBeltKey] || '#e5e5e5';
  var beltLabel = beltLabelMap[userBeltKey] || 'White Belt';

  var activeBelt = (typeof getActiveBelt === 'function') ? getActiveBelt() : null;
  var beltTotal = activeBelt ? activeBelt.groups.reduce(function(s,g){ return s+g.items.length; },0) : 1;
  var beltDone  = activeBelt ? activeBelt.groups.reduce(function(s,g){ return s+g.items.filter(function(i){ return !!beltProgress[activeBelt.id+'_'+i]; }).length; },0) : 0;
  var beltPct   = beltTotal ? Math.round(beltDone/beltTotal*100) : 0;
  var beltRem   = beltTotal - beltDone;

  // Build requirement rows (first 6 items across groups)
  var allItems = [];
  if (activeBelt) {
    activeBelt.groups.forEach(function(g) {
      g.items.forEach(function(item) {
        allItems.push({ name: item, group: g.name, done: !!beltProgress[activeBelt.id+'_'+item] });
      });
    });
  }
  var shown = allItems.slice(0,6);

  var beltIdForReq = activeBelt ? activeBelt.id : '';
  var reqRowsHtml = shown.map(function(item) {
    var ringHtml = item.done
      ? '<div style="width:26px;height:26px;border-radius:50%;background:#e53935;display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="12" height="12" viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9 10.5,3" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg></div>'
      : '<div style="width:26px;height:26px;border-radius:50%;border:2px solid rgba(255,255,255,.15);flex-shrink:0"></div>';
    var escapedName = item.name.replace(/'/g,"\\'");
    var escapedBeltId = beltIdForReq.replace(/'/g,"\\'");
    return '<div class="p-req-row" style="cursor:pointer" onclick="toggleBeltReqFromProgress(\'' + escapedBeltId + '\',\'' + escapedName + '\');">'
      + '<div style="width:40px;height:40px;border-radius:8px;background:#1e2030;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🥋</div>'
      + '<div style="flex:1;min-width:0">'
      + '<div style="color:#f0f4ff;font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+item.name+'</div>'
      + '<div style="color:#555;font-size:10px">'+item.group+'</div>'
      + '</div>'
      + ringHtml
      + '</div>';
  }).join('');

  return '<div class="p-card" style="display:flex;align-items:flex-start;gap:12px">'
    + '<div style="flex:1">'
    + '<div style="color:#f0f4ff;font-size:22px;font-weight:800">'+beltLabel+'</div>'
    + '<div style="color:#e53935;font-size:12px;font-weight:700;margin:4px 0 8px">'+beltPct+'% Complete</div>'
    + '<div class="p-pbar-bg"><div class="p-pbar-fill" style="width:'+beltPct+'%;background:#e53935"></div></div>'
    + '<div style="color:#666;font-size:11px;margin-top:6px">'+beltRem+' requirements remaining</div>'
    + '<div style="color:#555;font-size:10px;margin-top:2px;margin-bottom:10px">Keep training!</div>'
    + '<button class="p-cta-ghost" onclick="showView(\'belt\')">View All Requirements →</button>'
    + '</div>'
    + '<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:6px">'
    + '<img src="images/belt-'+userBeltKey+'.png" style="width:64px;height:64px;object-fit:contain" onerror="this.style.opacity=.3">'
    + '<div style="font-size:9px;font-weight:700;color:'+beltColor+'">'+beltDone+'/'+beltTotal+'</div>'
    + '</div></div>'
    + '<div class="p-card">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'
    + '<div style="color:#f0f4ff;font-size:13px;font-weight:700">Requirements</div>'
    + '<div style="display:flex;align-items:center;gap:6px">'
    + '<div style="background:#1e1808;border:0.5px solid #d97706;border-radius:20px;padding:3px 8px;font-size:9px;color:#d97706;font-weight:700">'+beltDone+'/'+beltTotal+'</div>'
    + '<div style="color:#e53935;font-size:11px;font-weight:600;cursor:pointer" onclick="showView(\'belt\')">View All →</div>'
    + '</div></div>'
    + reqRowsHtml
    + (allItems.length>6?'<button class="p-cta-ghost" onclick="showView(\'belt\')" style="margin-top:6px">View All Requirements →</button>':'')
    + '</div>';
}

function buildGradesPath() {
  var belts = [
    {key:'white', label:'White', color:'#e5e5e5'},
    {key:'yellow',label:'Yellow',color:'#f5c542'},
    {key:'orange',label:'Orange',color:'#f97316'},
    {key:'green', label:'Green', color:'#22c55e'},
    {key:'blue',  label:'Blue',  color:'#3b82f6'},
    {key:'brown', label:'Brown', color:'#92400e'},
  ];
  var p = (typeof getProfile === 'function') ? getProfile() : null;
  var userBelt = (p && p.belt) ? p.belt : 'white';
  var pathHtml = '<div style="display:flex;align-items:center">';
  belts.forEach(function(b, i) {
    var isCurrent = b.key === userBelt;
    var isPast = belts.indexOf(belts.find(function(x){return x.key===userBelt;})) > i;
    var circleStyle = isCurrent
      ? 'width:34px;height:34px;border-radius:50%;background:'+b.color+'22;border:2.5px solid '+b.color+';display:flex;align-items:center;justify-content:center;font-size:13px'
      : (isPast ? 'width:34px;height:34px;border-radius:50%;background:'+b.color+'33;border:2.5px solid '+b.color+'88;display:flex;align-items:center;justify-content:center;font-size:13px;opacity:.6'
               : 'width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-size:13px;opacity:.4');
    pathHtml += '<div style="display:flex;flex-direction:column;align-items:center;flex:1">'
      + '<div style="'+circleStyle+'">🥋</div>'
      + '<div style="font-size:9px;margin-top:4px;font-weight:'+(isCurrent?'700':'500')+';color:'+(isCurrent?b.color:'#444')+'">'+b.label+'</div>'
      + '</div>';
    if (i < belts.length-1) {
      pathHtml += '<div style="height:2px;flex:0 0 14px;background:'+(isPast?belts[i].color+'44':'rgba(255,255,255,.07)')+';margin-bottom:14px"></div>';
    }
  });
  pathHtml += '</div>';
  return '<div class="p-card">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'
    + '<div style="color:#f0f4ff;font-size:13px;font-weight:700">Grade Path</div>'
    + '<div style="color:#e53935;font-size:11px;font-weight:600;cursor:pointer" onclick="showView(\'belt\')">View full path →</div>'
    + '</div>'
    + pathHtml
    + '</div>';
}

function buildGoals() {
  return '<div class="p-card" style="text-align:center;padding:32px 16px">'
    + '<div style="font-size:40px;margin-bottom:12px">🎯</div>'
    + '<div style="color:#f0f4ff;font-size:16px;font-weight:700;margin-bottom:6px">Set Your Goals</div>'
    + '<div style="color:#555;font-size:12px;line-height:1.6;margin-bottom:16px">Track weekly session targets, technique milestones and grading timelines</div>'
    + '<button class="p-cta">Add First Goal →</button>'
    + '</div>';
}

function toggleBeltReqFromProgress(beltId, item) {
  var key = beltId + '_' + item;
  beltProgress[key] = !beltProgress[key];
  localStorage.setItem('judo_belt_progress', JSON.stringify(beltProgress));
  // Re-render current grades sub-tab so ring updates
  setPGradeSubTab('current');
  // Refresh overview if showing
  if (progTab === 'overview') { var el = document.getElementById('prog-tab-body'); if (el) el.innerHTML = buildOverview(); }
  // Sync belt tab if open
  if (typeof renderBelt === 'function') {
    var bv = document.getElementById('view-belt');
    if (bv && bv.classList.contains('active')) setTimeout(function(){ renderBelt(); }, 50);
  }
}

function getActiveBelt() {
  if (typeof BELT_DATA === 'undefined') return null;
  // Use the same belt as belt.js (respects judo_current_belt_id set by user/grading pass)
  var savedId = localStorage.getItem('judo_current_belt_id');
  if (savedId) {
    var found = BELT_DATA.find(function(b){ return b.id === savedId; });
    if (found) return found;
  }
  // Fallback: first incomplete belt
  for (var i = 0; i < BELT_DATA.length; i++) {
    var b = BELT_DATA[i];
    var tot = b.groups.reduce(function(s,g){ return s+g.items.length; }, 0);
    var don = b.groups.reduce(function(s,g){ return s+g.items.filter(function(i){ return !!beltProgress[b.id+'_'+i]; }).length; }, 0);
    if (don < tot) return b;
  }
  return BELT_DATA[BELT_DATA.length-1];
}

function randoriStatPill(n, label, color) {
  return `<div style="text-align:center">
    <div style="font-size:22px;font-weight:700;color:${color}">${n}</div>
    <div style="font-size:11px;color:var(--text-muted)">${label}</div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════
// ── TAB 2: SESSION LOG ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
function buildSessions() {
  const log = [...getSessionLog()].reverse();
  return `
    <div class="prog-sessions">
      <div class="prog-sessions-toolbar">
        <input type="text" id="sess-search" placeholder="Search sessions…" oninput="filterSessions()">
        <select id="sess-month" onchange="filterSessions()">
          <option value="">All time</option>
          ${buildMonthOptions(getSessionLog())}
        </select>
      </div>
      <div id="sess-list">
        ${log.length===0
          ? `<div class="prog-empty">No sessions logged yet.</div>`
          : log.map(s => sessionRow(s, true)).join('')}
      </div>
    </div>`;
}

function afterSessions() {
  // restore expanded state
  document.querySelectorAll('.sess-row').forEach(row => {
    row.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'TEXTAREA') return;
      const id = this.dataset.id;
      progExpandedSession = (progExpandedSession === id) ? null : id;
      filterSessions();
    });
  });
}

function filterSessions() {
  const q   = (document.getElementById('sess-search')||{}).value||'';
  const mon = (document.getElementById('sess-month')||{}).value||'';
  const log = [...getSessionLog()].reverse();
  const filtered = log.filter(s => {
    const mq = !q || (s.title||'').toLowerCase().includes(q.toLowerCase());
    const mm = !mon || (s.date||'').startsWith(mon);
    return mq && mm;
  });
  const el = document.getElementById('sess-list');
  if (!el) return;
  el.innerHTML = filtered.length===0
    ? `<div class="prog-empty">No sessions match.</div>`
    : filtered.map(s => sessionRow(s, true)).join('');
  afterSessions();
}

function sessionRow(s, expandable) {
  const date = fmtDateShort(s.date);
  const emoji = s.themeEmoji || '🥋';
  const expanded = expandable && progExpandedSession === s.id;
  return `<div class="sess-row${expanded?' expanded':''}" data-id="${s.id||''}">
    <div class="sess-row-main">
      <div class="sess-icon">${emoji}</div>
      <div class="sess-info">
        <div class="sess-title">${s.title||'Training Session'}</div>
        <div class="sess-meta">${date}${s.minutes?' · '+s.minutes+' min':''}</div>
      </div>
      <div class="sess-xp">+${s.xp||0} XP</div>
    </div>
    ${expanded ? `<div class="sess-expand">
      ${s.techniques && s.techniques.length ? `<div class="sess-expand-label">Techniques</div><div class="sess-techs">${s.techniques.map(t=>`<span class="sess-tech-tag">${t}</span>`).join('')}</div>` : ''}
      <div class="sess-expand-label">Notes</div>
      <textarea class="sess-note-ta" placeholder="Add a note about this session…" onclick="event.stopPropagation()" oninput="saveSessionNote('${s.id||''}',this.value)">${s.notes||''}</textarea>
    </div>` : ''}
  </div>`;
}

function saveSessionNote(id, val) {
  const log = getSessionLog();
  const s = log.find(x => x.id === id || String(x.id) === String(id));
  if (s) { s.notes = val; saveSessionLog(log); }
}

function buildMonthOptions(log) {
  const months = [...new Set(log.map(s => (s.date||'').slice(0,7)).filter(Boolean))].sort().reverse();
  return months.map(m => {
    const d = new Date(m+'-01');
    const label = d.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
    return `<option value="${m}">${label}</option>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
// ── TAB 3: RANDORI NOTES ───────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
function buildRandori() {
  const log = [...getRandoriLog()].reverse();
  const totalMatches = log.reduce((s,r)=>s+(r.won||0)+(r.lost||0)+(r.drew||0),0);
  const totalWins    = log.reduce((s,r)=>s+(r.won||0),0);
  const totalLosses  = log.reduce((s,r)=>s+(r.lost||0),0);
  const totalDraws   = log.reduce((s,r)=>s+(r.drew||0),0);

  return `
    <div class="prog-randori">
      ${totalMatches>0?`
      <div class="prog-stats-row" style="margin-bottom:0">
        ${statCard('✅', totalWins,   'Wins',    '#16a34a')}
        ${statCard('❌', totalLosses, 'Losses',  'var(--accent)')}
        ${statCard('🤝', totalDraws,  'Draws',   'var(--blue)')}
        ${statCard('📊', totalMatches,'Matches', null)}
      </div>`:''}

      <div class="prog-card">
        <div class="prog-card-label">Log Randori Session</div>
        <div class="rand-form">
          <div class="rand-form-row">
            <label>Date</label>
            <input type="date" id="rand-date" value="${todayStr()}">
          </div>
          <div class="rand-form-row">
            <label>Partner / Club</label>
            <input type="text" id="rand-partner" placeholder="e.g. John, Club night…">
          </div>
          <div class="rand-form-row rand-wld">
            <div><label>Won</label><input type="number" id="rand-won" value="0" min="0"></div>
            <div><label>Lost</label><input type="number" id="rand-lost" value="0" min="0"></div>
            <div><label>Drew</label><input type="number" id="rand-drew" value="0" min="0"></div>
          </div>
          <div class="rand-form-row">
            <label>What worked</label>
            <textarea id="rand-worked" placeholder="Techniques that landed, movements that felt good…" rows="2"></textarea>
          </div>
          <div class="rand-form-row">
            <label>What to improve</label>
            <textarea id="rand-improve" placeholder="What got countered, gaps in defence, gripping issues…" rows="2"></textarea>
          </div>
          <div class="rand-form-row">
            <label>Other notes</label>
            <textarea id="rand-notes" placeholder="General observations…" rows="2"></textarea>
          </div>
          <button class="rand-submit-btn" onclick="submitRandori()">Save Entry</button>
        </div>
      </div>

      <div class="prog-card prog-card-full">
        <div class="prog-card-label">Randori History</div>
        ${log.length===0
          ? `<div class="prog-empty">No randori logged yet.</div>`
          : log.map(r => randoriRow(r)).join('')}
      </div>
    </div>`;
}

function afterRandori() {}

function randoriRow(r) {
  const date   = fmtDateShort(r.date);
  const matches = (r.won||0)+(r.lost||0)+(r.drew||0);
  return `<div class="rand-row">
    <div class="rand-row-head">
      <div>
        <div class="rand-row-date">${date}${r.partner?' — '+r.partner:''}</div>
        <div class="rand-row-wld">
          <span class="rand-pill win">W ${r.won||0}</span>
          <span class="rand-pill loss">L ${r.lost||0}</span>
          <span class="rand-pill draw">D ${r.drew||0}</span>
          <span class="rand-pill total">${matches} match${matches!==1?'es':''}</span>
        </div>
      </div>
      <button class="rand-del-btn" onclick="deleteRandori('${r.id}')" title="Delete">✕</button>
    </div>
    ${r.worked  ? `<div class="rand-note-block"><span class="rand-note-lbl">✅ Worked:</span> ${r.worked}</div>`  : ''}
    ${r.improve ? `<div class="rand-note-block"><span class="rand-note-lbl">🎯 Improve:</span> ${r.improve}</div>` : ''}
    ${r.notes   ? `<div class="rand-note-block"><span class="rand-note-lbl">📝 Notes:</span> ${r.notes}</div>`   : ''}
  </div>`;
}

function submitRandori() {
  const entry = {
    id:      'r' + Date.now(),
    date:    document.getElementById('rand-date').value    || todayStr(),
    partner: document.getElementById('rand-partner').value || '',
    won:     parseInt(document.getElementById('rand-won').value)  || 0,
    lost:    parseInt(document.getElementById('rand-lost').value) || 0,
    drew:    parseInt(document.getElementById('rand-drew').value) || 0,
    worked:  document.getElementById('rand-worked').value  || '',
    improve: document.getElementById('rand-improve').value || '',
    notes:   document.getElementById('rand-notes').value   || '',
  };
  const log = getRandoriLog();
  log.push(entry);
  saveRandoriLog(log);
  showToast('Randori entry saved!');
  renderProgTab();
}

function deleteRandori(id) {
  if (!confirm('Delete this randori entry?')) return;
  saveRandoriLog(getRandoriLog().filter(r => r.id !== id));
  renderProgTab();
}

// ═══════════════════════════════════════════════════════════════
// ── TAB 4: BELT JOURNEY ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

const BELT_ORDER = [
  { key:'white',  color:'#e8e8e8',  label:'White Belt',       border:'#ccc'    },
  { key:'red',    color:'#e74c3c',  label:'Red Belt (6th Kyu)',border:'#c0392b' },
  { key:'yellow', color:'#f1c40f',  label:'Yellow Belt (5th Kyu)',border:'#d4ac0d'},
  { key:'orange', color:'#e67e22',  label:'Orange Belt (4th Kyu)',border:'#ca6f1e'},
  { key:'green',  color:'#27ae60',  label:'Green Belt (3rd Kyu)',border:'#1e8449' },
  { key:'blue',   color:'#2980b9',  label:'Blue Belt (2nd Kyu)', border:'#21618c' },
  { key:'brown',  color:'#795548',  label:'Brown Belt (1st Kyu)',border:'#4e342e' },
  { key:'black',  color:'#1a1a1a',  label:'Black Belt (Shodan)',border:'#000'    },
];

// Map BELT_DATA ids → BELT_ORDER keys
const BELT_ID_TO_KEY = { toYellow:'yellow', toOrange:'orange', toGreen:'green', toBlue:'blue', toBrown:'brown' };

function buildBeltJourney() {
  const timeline = getBeltTimeline();

  // Work out which BELT_ORDER key is the current target
  const activeBeltData   = (typeof getCurrentTargetBelt === 'function') ? getCurrentTargetBelt() : null;
  const activeKey        = activeBeltData ? (BELT_ID_TO_KEY[activeBeltData.id] || null) : null;

  const rows = BELT_ORDER.map((b, i) => {
    const entry    = timeline.find(t => t.key === b.key) || {};
    const achieved = !!entry.date;
    const isCurrent = (b.key === activeKey);

    // State label + action
    let stateHtml = '';
    if (achieved) {
      stateHtml = `
        <div class="btl-achieved-badge">&#10003; Passed ${fmtDate(entry.date)}</div>
        ${entry.notes ? `<div class="btl-notes">${entry.notes}</div>` : ''}
        <button class="btl-edit-btn" onclick="openBtlEdit('${b.key}')">Edit</button>`;
    } else if (isCurrent) {
      stateHtml = `
        <div class="btl-current-label">Your current target</div>
        <button class="btl-pass-btn" onclick="openGradingPassModal('${activeBeltData ? activeBeltData.id : ''}')">&#127881; I Passed This Belt!</button>`;
    } else {
      stateHtml = `<div class="btl-future-label">Future grade</div>`;
    }

    return `<div class="belt-tl-row${achieved?' achieved':''}${isCurrent?' btl-current':''}">
      <div class="belt-tl-line-wrap">
        ${i < BELT_ORDER.length-1 ? `<div class="belt-tl-connector${achieved?' filled':''}"></div>` : ''}
        <div class="belt-tl-dot${isCurrent?' btl-dot-pulse':''}" style="background:${b.color};border-color:${b.border}"></div>
      </div>
      <div class="belt-tl-content">
        <div class="belt-tl-name">${b.label}${isCurrent?' <span class="btl-current-chip">NOW</span>':''}</div>
        ${stateHtml}
      </div>
    </div>`;
  }).join('');

  // Edit panel (hidden by default, shown per-belt)
  const editPanels = BELT_ORDER.map(b => {
    const entry = timeline.find(t => t.key === b.key) || {};
    return `<div class="btl-edit-panel" id="btl-edit-${b.key}" style="display:none">
      <input type="date"  class="belt-tl-date-input"  value="${entry.date||''}"  onchange="saveBeltDate('${b.key}',this.value)" placeholder="Date">
      <input type="text"  class="belt-tl-notes-input" value="${entry.notes||''}" onchange="saveBeltNotes('${b.key}',this.value)" placeholder="Notes…">
    </div>`;
  }).join('');

  // Projection
  const log        = getSessionLog();
  const avgPerWeek = calcAvgSessionsPerWeek(log);
  const nextBelt   = BELT_ORDER.find(b => !timeline.find(t=>t.key===b.key && t.date));
  let projHtml = '';
  if (nextBelt && avgPerWeek > 0) {
    const weeksNeeded = Math.round(24 / avgPerWeek);
    const projDate    = new Date();
    projDate.setDate(projDate.getDate() + weeksNeeded * 7);
    projHtml = `<div class="prog-card btl-proj-card">
      <div class="prog-card-label">Grading Estimate</div>
      <div class="btl-proj-line">Training <strong>${avgPerWeek.toFixed(1)}×/week</strong></div>
      <div class="btl-proj-line"><strong>${nextBelt.label}</strong> in ~${weeksNeeded} weeks</div>
      <div class="btl-proj-sub">${projDate.toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</div>
    </div>`;
  }

  return `
    <div class="prog-belt-journey">
      ${projHtml}
      <div class="prog-card prog-card-full">
        <div class="prog-card-label">Your Belt Journey</div>
        <div class="belt-timeline">${rows}</div>
        ${editPanels}
      </div>
    </div>`;
}

function openBtlEdit(key) {
  document.querySelectorAll('.btl-edit-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById('btl-edit-' + key);
  if (panel) panel.style.display = 'flex';
}

function afterBelt() {}

function saveBeltDate(key, val) {
  const tl = getBeltTimeline();
  const entry = tl.find(t => t.key===key);
  if (entry) entry.date = val;
  else tl.push({ key, date:val, notes:'' });
  saveBeltTimeline(tl);
  showToast('Belt date saved');
  // Re-render to update achieved state
  document.getElementById('prog-tab-body').innerHTML = buildBeltJourney();
  afterBelt();
}

function saveBeltNotes(key, val) {
  const tl = getBeltTimeline();
  const entry = tl.find(t => t.key===key);
  if (entry) entry.notes = val;
  else tl.push({ key, date:'', notes:val });
  saveBeltTimeline(tl);
}

function calcAvgSessionsPerWeek(log) {
  if (!log.length) return 0;
  const now  = new Date();
  const cutoff = new Date(now); cutoff.setDate(now.getDate()-56); // 8 weeks
  const recent = log.filter(l => l.date && new Date(l.date) >= cutoff);
  return recent.length / 8;
}

// ═══════════════════════════════════════════════════════════════
// ── SHARED HELPERS ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
function statCard(emoji, val, label, color) {
  return `<div class="prog-stat-card">
    <div class="prog-stat-emoji">${emoji}</div>
    <div class="prog-stat-val" style="${color?'color:'+color:''}">${val}</div>
    <div class="prog-stat-lbl">${label}</div>
  </div>`;
}

function buildWeekDots(log) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const now  = new Date();
  const mon  = new Date(now);
  mon.setDate(now.getDate()-((now.getDay()+6)%7));
  mon.setHours(0,0,0,0);
  return days.map((d,i) => {
    const day = new Date(mon); day.setDate(mon.getDate()+i);
    const key = day.toISOString().slice(0,10);
    const done= log.some(l => l.date && l.date.slice(0,10)===key);
    return `<div class="prog-day-dot${done?' done':''}">
      <div class="prog-dot${done?' done':''}"></div>
      <span>${d}</span>
    </div>`;
  }).join('');
}
