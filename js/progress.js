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
  var xp        = getXP();
  var goal      = getWeeklyGoal();
  var weekSes   = getSessionsThisWeek();
  var totalMins = log.reduce(function(s,l){ return s+(l.minutes||0); }, 0);

  var milestones = [0,50,150,300,500,750,1000];
  var nextMs = milestones.find(function(m){ return m > xp; }) || Math.ceil(xp/250+1)*250;
  var prevMs = 0;
  for (var i = milestones.length-1; i >= 0; i--) { if (milestones[i] <= xp) { prevMs = milestones[i]; break; } }
  var xpPct = nextMs > prevMs ? Math.round((xp-prevMs)/(nextMs-prevMs)*100) : 100;

  // Week dots
  var today = new Date();
  var dow = (today.getDay()+6)%7;
  var weekDates = [];
  for (var d=0; d<7; d++) { var dd = new Date(today); dd.setDate(today.getDate()-dow+d); weekDates.push(dd.toISOString().slice(0,10)); }
  var todayStr2 = today.toISOString().slice(0,10);
  var doneDates = new Set(log.map(function(l){ return l.date||''; }));
  var dayLabels = ['M','T','W','T','F','S','S'];
  var weekMinsDone = log.filter(function(l){
    var mon = new Date(today); mon.setDate(today.getDate()-dow); mon.setHours(0,0,0,0);
    return l.date && new Date(l.date) >= mon;
  }).reduce(function(s,l){ return s+(l.minutes||0); }, 0);

  // Belt info
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

  // Week ring SVG
  var ringR = 27; var ringC = 2*Math.PI*ringR;
  var sesRatio = Math.min(1, weekSes/(goal.sessions||5));
  var ringOffset = ringC*(1-sesRatio);
  var minRatio = Math.min(1, weekMinsDone/(goal.minutes||60));

  // Recent activity
  var recent = log.slice().reverse().slice(0,2);

  // Build dot row
  var dotsHtml = '';
  for (var di=0; di<7; di++) {
    var isDone = doneDates.has(weekDates[di]);
    var isToday = weekDates[di] === todayStr2;
    var dotBg = isDone ? '#22c55e' : 'rgba(255,255,255,.07)';
    var dotBorder = isToday && !isDone ? '2px solid #d97706' : 'none';
    dotsHtml += '<div style="text-align:center">'
      + '<div style="width:20px;height:20px;border-radius:50%;background:'+dotBg+';border:'+dotBorder+';margin:0 auto 3px"></div>'
      + '<div style="color:#444;font-size:9px">'+dayLabels[di]+'</div>'
      + '</div>';
  }

  // Recent rows
  var recentHtml = '';
  if (!recent.length) {
    recentHtml = '<div style="color:#555;font-size:12px;padding:12px 0">No sessions yet — complete a training session to see history.</div>';
  } else {
    recent.forEach(function(s) {
      var when = s.date === todayStr2 ? 'Today' : (s.date === weekDates[Math.max(0,dow-1)] ? 'Yesterday' : (s.date||''));
      recentHtml += '<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:0.5px solid rgba(255,255,255,.04)">'
        + '<div style="width:36px;height:36px;border-radius:8px;background:#1e2030;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🥋</div>'
        + '<div style="flex:1"><div style="color:#f0f4ff;font-size:12px;font-weight:600">'+(s.category||'Training Session')+'</div>'
        + '<div style="color:#555;font-size:10px">'+(s.minutes||0)+' min</div></div>'
        + '<div style="color:#444;font-size:10px">'+when+'</div>'
        + '</div>';
    });
  }

  return '<div class="p-card" style="display:flex;align-items:flex-start;gap:12px">'
    // belt card left
    + '<div style="flex:1">'
    + '<span class="p-label">Current grade</span>'
    + '<div style="color:#f0f4ff;font-size:22px;font-weight:800;margin-bottom:2px">'+beltLabel+'</div>'
    + '<div style="color:#e53935;font-size:12px;font-weight:700;margin-bottom:8px">'+beltPct+'% Complete</div>'
    + '<div class="p-pbar-bg"><div class="p-pbar-fill" style="width:'+beltPct+'%;background:#e53935"></div></div>'
    + '<div style="color:#555;font-size:11px;margin-top:6px;margin-bottom:10px">'+beltRem+' requirement'+(beltRem!==1?'s':'')+' remaining</div>'
    + '<button class="p-cta" onclick="setProgTab(\'grades\')">View Requirements →</button>'
    + '</div>'
    // belt circle right
    + '<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:6px;padding-top:4px">'
    + '<img src="images/belt-'+userBeltKey+'.png" style="width:64px;height:64px;object-fit:contain" onerror="this.style.opacity=.3">'
    + '<div style="font-size:9px;font-weight:700;color:'+beltColor+'">'+beltLabel+'</div>'
    + '</div>'
    + '</div>'

    // This Week
    + '<div class="p-card">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<div style="color:#f0f4ff;font-size:13px;font-weight:700">This Week</div>'
    + '</div>'
    + '<div style="display:flex;align-items:center;gap:14px">'
    + '<div style="position:relative;width:64px;height:64px;flex-shrink:0">'
    + '<svg width="64" height="64" viewBox="0 0 64 64">'
    + '<circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="5"/>'
    + '<circle cx="32" cy="32" r="27" fill="none" stroke="#22c55e" stroke-width="5"'
    + ' stroke-dasharray="'+ringC.toFixed(1)+'" stroke-dashoffset="'+ringOffset.toFixed(1)+'"'
    + ' stroke-linecap="round" transform="rotate(-90 32 32)"/>'
    + '</svg>'
    + '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">'
    + '<div style="color:#f0f4ff;font-size:17px;font-weight:800;line-height:1">'+weekSes+'</div>'
    + '<div style="color:#444;font-size:9px">/'+goal.sessions+'</div>'
    + '</div>'
    + '</div>'
    + '<div style="flex:1">'
    + '<div style="color:#22c55e;font-size:13px;font-weight:700;margin-bottom:6px">'+weekMinsDone+' / '+goal.minutes+' min</div>'
    + '<div class="p-pbar-bg" style="margin-bottom:10px"><div class="p-pbar-fill" style="width:'+Math.round(minRatio*100)+'%;background:#22c55e"></div></div>'
    + '<div style="display:flex;justify-content:space-between">'+dotsHtml+'</div>'
    + '</div></div></div>'

    // 2x2 stats
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">'
    + '<div class="p-stat"><div style="font-size:18px;margin-bottom:6px">🔥</div><div style="color:#f0f4ff;font-size:20px;font-weight:800">'+streak+'</div><div style="color:#555;font-size:10px;margin-top:3px">Day Streak</div></div>'
    + '<div class="p-stat"><div style="font-size:18px;margin-bottom:6px">⚡</div><div style="color:#d97706;font-size:20px;font-weight:800">'+xp+'</div><div style="color:#555;font-size:10px;margin-top:3px">Total XP</div></div>'
    + '<div class="p-stat"><div style="font-size:18px;margin-bottom:6px">⏱</div><div style="color:#f0f4ff;font-size:20px;font-weight:800">'+totalMins+'m</div><div style="color:#555;font-size:10px;margin-top:3px">Total Trained</div></div>'
    + '<div class="p-stat"><div style="font-size:18px;margin-bottom:6px">🥋</div><div style="color:#f0f4ff;font-size:20px;font-weight:800">'+log.length+'</div><div style="color:#555;font-size:10px;margin-top:3px">Sessions</div></div>'
    + '</div>'

    // XP Progress
    + '<div class="p-card" style="display:flex;align-items:center;gap:14px">'
    + '<div style="flex:1">'
    + '<span class="p-label">XP Progress</span>'
    + '<div style="display:flex;align-items:baseline;gap:4px;margin:4px 0 8px">'
    + '<div style="color:#d97706;font-size:36px;font-weight:800;line-height:1">'+xp+'</div>'
    + '<div style="color:#d97706;font-size:14px;font-weight:700">XP</div>'
    + '</div>'
    + '<div class="p-pbar-bg"><div class="p-pbar-fill" style="width:'+xpPct+'%;background:#d97706"></div></div>'
    + '<div style="display:flex;justify-content:space-between;margin-top:4px">'
    + '<div style="color:#444;font-size:9px">'+prevMs+'</div>'
    + '<div style="color:#666;font-size:9px">Next: '+nextMs+' XP</div>'
    + '<div style="color:#444;font-size:9px">'+nextMs+'</div>'
    + '</div></div>'
    + '<div style="width:52px;height:52px;border-radius:50%;background:#1e1808;border:2px solid #d97706;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">🏆</div>'
    + '</div>'

    // Recent Activity
    + '<div class="p-card">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'
    + '<div style="color:#f0f4ff;font-size:13px;font-weight:700">Recent Activity</div>'
    + '<div style="color:#e53935;font-size:11px;font-weight:600;cursor:pointer" onclick="setProgTab(\'sessions\')">View all →</div>'
    + '</div>'
    + recentHtml
    + '</div>';
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
