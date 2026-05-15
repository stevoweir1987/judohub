// ── PROGRESS TRACKER v2 ─────────────────────────────────────

let progTab = 'overview';
let progExpandedSession = null;

// ── DATA HELPERS ─────────────────────────────────────────────
function getSessionLog()  { return JSON.parse(localStorage.getItem('judo_session_log')    || '[]'); }
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
  document.getElementById('progress-body').innerHTML = `
    <div class="prog-wrap">
      <div class="prog-tabs">
        <button class="prog-tab active" onclick="setProgTab('overview')">Overview</button>
        <button class="prog-tab"        onclick="setProgTab('sessions')">Session Log</button>
        <button class="prog-tab"        onclick="setProgTab('randori')">Randori</button>
        <button class="prog-tab"        onclick="setProgTab('belt')">Belt Journey</button>
        <button class="prog-tab"        onclick="setProgTab('goals')">Goals</button>
      </div>
      <div id="prog-tab-body"></div>
    </div>`;
  progTab = 'overview';
  renderProgTab();
}

function setProgTab(tab) {
  progTab = tab;
  document.querySelectorAll('.prog-tab').forEach((b, i) => {
    const tabs = ['overview','sessions','randori','belt','goals'];
    b.classList.toggle('active', tabs[i] === tab);
  });
  renderProgTab();
}

function renderProgTab() {
  const el = document.getElementById('prog-tab-body');
  if (!el) return;
  switch (progTab) {
    case 'overview': el.innerHTML = buildOverview();  break;
    case 'sessions': el.innerHTML = buildSessions();  afterSessions(); break;
    case 'randori':  el.innerHTML = buildRandori();   afterRandori();  break;
    case 'belt':     el.innerHTML = buildBeltJourney();afterBelt();    break;
    case 'goals':    el.innerHTML = buildGoals();     afterGoals();    break;
  }
}

// ═══════════════════════════════════════════════════════════════
// ── TAB 1: OVERVIEW ────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
function buildOverview() {
  const log       = getSessionLog();
  const streak    = getStreak();
  const xp        = getXP();
  const goal      = getWeeklyGoal();
  const weekSes   = getSessionsThisWeek();
  const totalMins = log.reduce((s,l) => s + (l.minutes||0), 0);
  const randori   = getRandoriLog();

  const milestones    = [0,50,150,300,500,750,1000];
  const nextMs        = milestones.find(m => m > xp) || (Math.ceil(xp/250)+1)*250;
  const prevMs        = [...milestones].reverse().find(m => m <= xp) || 0;
  const xpPct         = nextMs > prevMs ? Math.round((xp-prevMs)/(nextMs-prevMs)*100) : 100;

  const weekGoalPct   = Math.min(100, Math.round(weekSes / goal.sessions * 100));
  const weekMinsDone  = log.filter(l => {
    const d = new Date(); const mon = new Date(d);
    mon.setDate(d.getDate()-((d.getDay()+6)%7)); mon.setHours(0,0,0,0);
    return l.date && new Date(l.date) >= mon;
  }).reduce((s,l) => s+(l.minutes||0),0);
  const weekMinsPct   = Math.min(100, Math.round(weekMinsDone / goal.minutes * 100));

  // Active belt
  const activeBelt = getActiveBelt();
  const beltTotal  = activeBelt ? activeBelt.groups.reduce((s,g)=>s+g.items.length,0) : 1;
  const beltDone   = activeBelt ? activeBelt.groups.reduce((s,g)=>s+g.items.filter(i=>beltProgress[activeBelt.id+'_'+i]).length,0) : 0;
  const beltPct    = beltTotal ? Math.round(beltDone/beltTotal*100) : 0;

  const recent = [...log].reverse().slice(0,3);
  const lastRandori = [...randori].reverse()[0];
  const totalMatches = randori.reduce((s,r)=>s+(r.won||0)+(r.lost||0)+(r.drew||0),0);
  const totalWins    = randori.reduce((s,r)=>s+(r.won||0),0);
  const winRate = totalMatches ? Math.round(totalWins/totalMatches*100) : null;

  return `
    <div class="prog-overview">
      <div class="prog-stats-row">
        ${statCard('🔥', streak||0,           'Day Streak',   streak>=3?'var(--accent)':null)}
        ${statCard('⚡', xp,                  'Total XP',     'var(--blue)')}
        ${statCard('⏱', totalMins+'m',        'Total Trained',null)}
        ${statCard('🥋', log.length,           'Sessions',     null)}
      </div>

      <div class="prog-grid">
        <!-- BELT -->
        <div class="prog-card">
          <div class="prog-card-label">Belt Advancement ${activeBelt ? '— '+activeBelt.label : ''}</div>
          <div style="display:flex;align-items:center;gap:10px;margin:8px 0">
            <div class="prog-bar-track" style="flex:1">
              <div class="prog-bar-fill" style="width:${beltPct}%;background:linear-gradient(90deg,var(--accent),#ff6b6b)"></div>
            </div>
            <span class="prog-pct-badge" style="color:${beltPct>=100?'#16a34a':'var(--accent)'}">${beltPct}%</span>
          </div>
          ${beltPct>=100
            ? `<div style="color:#16a34a;font-size:13px">🎉 All requirements complete!</div>`
            : `<div style="color:var(--text-muted);font-size:12px">${beltTotal-beltDone} requirement${beltTotal-beltDone!==1?'s':''} remaining</div>`}
          <button class="prog-action-btn" onclick="showView('belt')" style="margin-top:10px">Open Belt Progression →</button>
        </div>

        <!-- WEEKLY GOAL -->
        <div class="prog-card">
          <div class="prog-card-label">This Week</div>
          <div class="prog-goal-row">
            <div>
              <span class="prog-goal-done">${weekSes}</span><span class="prog-goal-sep">/</span><span class="prog-goal-total">${goal.sessions}</span>
              <span style="font-size:11px;color:var(--text-muted);margin-left:4px">sessions</span>
            </div>
            <div style="margin-top:6px">
              <span class="prog-goal-done" style="font-size:18px">${weekMinsDone}</span><span class="prog-goal-sep">/</span><span class="prog-goal-total" style="font-size:18px">${goal.minutes}</span>
              <span style="font-size:11px;color:var(--text-muted);margin-left:4px">min</span>
            </div>
          </div>
          <div class="prog-bar-track" style="margin-top:8px">
            <div class="prog-bar-fill" style="width:${weekGoalPct}%;background:linear-gradient(90deg,#16a34a,#4ade80)"></div>
          </div>
          <div class="prog-mini-days">${buildWeekDots(log)}</div>
        </div>

        <!-- XP -->
        <div class="prog-card">
          <div class="prog-card-label">XP</div>
          <div class="prog-xp-display"><span class="prog-xp-val">${xp}</span><span class="prog-xp-label">XP</span></div>
          <div class="prog-xp-sub">Next milestone: <strong>${nextMs} XP</strong></div>
          <div class="prog-bar-track" style="margin:8px 0">
            <div class="prog-bar-fill" style="width:${xpPct}%;background:linear-gradient(90deg,var(--blue),#60a5fa)"></div>
          </div>
          <div class="prog-xp-range"><span>${prevMs}</span><span>${nextMs}</span></div>
        </div>

        <!-- RANDORI -->
        <div class="prog-card">
          <div class="prog-card-label">Randori Stats</div>
          ${totalMatches===0
            ? `<div class="prog-empty" style="font-size:13px">No randori logged yet.<br><button class="prog-action-btn" onclick="setProgTab('randori')" style="margin-top:8px">Log randori →</button></div>`
            : `<div style="display:flex;gap:16px;margin:8px 0">
                ${randoriStatPill(totalWins,'Wins','#16a34a')}
                ${randoriStatPill(totalMatches-totalWins-(randori.reduce((s,r)=>s+(r.drew||0),0)),'Losses','var(--accent)')}
                ${randoriStatPill(randori.reduce((s,r)=>s+(r.drew||0),0),'Draws','var(--blue)')}
               </div>
               <div style="font-size:13px;color:var(--text-muted)">Win rate: <strong style="color:${winRate>=50?'#16a34a':'var(--text)'}">${winRate}%</strong> from ${totalMatches} matches</div>
               ${lastRandori?`<div style="font-size:11px;color:var(--text-muted);margin-top:6px">Last: ${fmtDateShort(lastRandori.date)}</div>`:''}
               <button class="prog-action-btn" onclick="setProgTab('randori')" style="margin-top:10px">View all →</button>`}
        </div>
      </div>

      <!-- RECENT SESSIONS -->
      <div class="prog-card prog-card-full">
        <div class="prog-card-label" style="display:flex;justify-content:space-between;align-items:center">
          <span>Recent Sessions</span>
          ${log.length>3?`<button class="prog-action-btn" onclick="setProgTab('sessions')">See all ${log.length} →</button>`:''}
        </div>
        ${recent.length===0
          ? `<div class="prog-empty">No sessions yet — complete a training session to see history here.</div>`
          : recent.map(s => sessionRow(s, false)).join('')}
      </div>
    </div>`;
}

function getActiveBelt() {
  if (typeof BELT_DATA === 'undefined') return null;
  // find first belt not 100% complete
  for (const b of BELT_DATA) {
    const tot = b.groups.reduce((s,g)=>s+g.items.length,0);
    const don = b.groups.reduce((s,g)=>s+g.items.filter(i=>beltProgress[b.id+'_'+i]).length,0);
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
// ── TAB 5: GOALS ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
function buildGoals() {
  const goal   = getWeeklyGoal();
  const log    = getSessionLog();

  // Build last 8 weeks performance
  const weeks = [];
  const now   = new Date();
  for (let w = 0; w < 8; w++) {
    const mon = new Date(now);
    mon.setDate(now.getDate() - ((now.getDay()+6)%7) - w*7);
    mon.setHours(0,0,0,0);
    const sun = new Date(mon); sun.setDate(mon.getDate()+6); sun.setHours(23,59,59);
    const sessions = log.filter(l => {
      const d = new Date(l.date||0);
      return d >= mon && d <= sun;
    });
    const mins = sessions.reduce((s,l)=>s+(l.minutes||0),0);
    weeks.push({ label: fmtDateShort(mon.toISOString()), sessions:sessions.length, mins });
  }
  weeks.reverse();

  const maxSess = Math.max(...weeks.map(w=>w.sessions), goal.sessions);
  const barH    = 60;

  return `
    <div class="prog-goals">
      <div class="prog-card">
        <div class="prog-card-label">Weekly Goals</div>
        <div class="goals-form">
          <div class="goals-form-row">
            <label>Sessions per week</label>
            <div class="goals-counter">
              <button onclick="adjustGoal('sessions',-1)">−</button>
              <span id="goal-sess-val">${goal.sessions}</span>
              <button onclick="adjustGoal('sessions',1)">+</button>
            </div>
          </div>
          <div class="goals-form-row">
            <label>Minutes per week</label>
            <div class="goals-counter">
              <button onclick="adjustGoal('minutes',-10)">−</button>
              <span id="goal-mins-val">${goal.minutes}</span>
              <button onclick="adjustGoal('minutes',10)">+</button>
            </div>
          </div>
        </div>
      </div>

      <div class="prog-card prog-card-full">
        <div class="prog-card-label">8-Week Performance</div>
        <div class="goals-chart">
          ${weeks.map(w => {
            const pct   = maxSess > 0 ? Math.round(w.sessions/maxSess*100) : 0;
            const hit   = w.sessions >= goal.sessions;
            return `<div class="goals-bar-col">
              <div class="goals-bar-wrap" style="height:${barH}px">
                <div class="goals-bar" style="height:${pct}%;background:${hit?'#16a34a':'var(--accent)'}">
                  <span class="goals-bar-val">${w.sessions||''}</span>
                </div>
                <div class="goals-goal-line" style="bottom:${Math.round(goal.sessions/maxSess*100)}%"></div>
              </div>
              <div class="goals-bar-label">${w.label}</div>
              <div class="goals-bar-mins">${w.mins>0?w.mins+'m':''}</div>
            </div>`;
          }).join('')}
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:8px">
          <span style="display:inline-block;width:10px;height:10px;background:#16a34a;border-radius:2px;margin-right:4px"></span>Goal met &nbsp;
          <span style="display:inline-block;width:10px;height:10px;background:var(--accent);border-radius:2px;margin-right:4px"></span>Below goal
        </div>
      </div>
    </div>`;
}

function afterGoals() {}

function adjustGoal(key, delta) {
  const goal = getWeeklyGoal();
  goal[key] = Math.max(key==='sessions'?1:10, goal[key]+delta);
  saveWeeklyGoal(goal);
  const el = document.getElementById('goal-' + (key==='sessions'?'sess':'mins') + '-val');
  if (el) el.textContent = goal[key];
  showToast('Goal updated');
  // Re-render chart
  renderProgTab();
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
