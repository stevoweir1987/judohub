// ── JUNIOR GRADES — My Belt screen ────────────────────────────────

// ── MON GRADE STATE ───────────────────────────────────────────────
function getCurrentMonGrade() {
  const p = getProfile() || {};
  if (typeof p.mon_grade === 'number') return p.mon_grade;
  // Migrate from old belt-colour-only storage
  const migrate = { white:0, red:3, yellow:6, orange:9, green:12, blue:15, brown:18 };
  return migrate[p.belt] || 0;
}

function setMonGrade(n) {
  const p = getProfile() || {};
  p.mon_grade = n;
  p.belt = monGradeToBelt(n);
  saveProfile(p);
}

function monGradeToBelt(n) {
  if (n <= 0)  return 'white';
  if (n <= 3)  return 'red';
  if (n <= 6)  return 'yellow';
  if (n <= 9)  return 'orange';
  if (n <= 12) return 'green';
  if (n <= 15) return 'blue';
  return 'brown';
}

const BELT_DISPLAY = {
  white:  { color:'#f2f2f2', border:'#ccc',     text:'#444',    label:'White Belt'  },
  red:    { color:'#e74c3c', border:'#c0392b',  text:'#fff',    label:'Red Belt'    },
  yellow: { color:'#f1c40f', border:'#d4ac0d',  text:'#5a4000', label:'Yellow Belt' },
  orange: { color:'#e67e22', border:'#ca6f1e',  text:'#fff',    label:'Orange Belt' },
  green:  { color:'#27ae60', border:'#1e8449',  text:'#fff',    label:'Green Belt'  },
  blue:   { color:'#2980b9', border:'#1a6a9a',  text:'#fff',    label:'Blue Belt'   },
  brown:  { color:'#795548', border:'#4e342e',  text:'#fff',    label:'Brown Belt'  },
};

function monReqKey(monId, req) {
  return 'mon_' + monId + '_' + req;
}

// ── MAIN RENDER ───────────────────────────────────────────────────
function renderJuniorGrades() {
  const el = document.getElementById('junior-grades-body');
  if (!el) return;

  const currentMon = getCurrentMonGrade();
  const nextMonId  = currentMon + 1;
  const nextMon    = (typeof MON_DATA !== 'undefined') ? MON_DATA.find(m => m.id === nextMonId) : null;
  const beltKey    = monGradeToBelt(currentMon);
  const bd         = BELT_DISPLAY[beltKey] || BELT_DISPLAY.white;
  const isMax      = currentMon >= 18;

  el.innerHTML = `
    <div class="jg-wrap">
      <div class="jg-title">&#11088; My Belt</div>

      <div class="jg-hero">
        <div class="jg-belt-circle" style="background:${bd.color};border-color:${bd.border}">
          <span class="jg-belt-num" style="color:${bd.text}">${currentMon === 0 ? '&#129355;' : currentMon}</span>
        </div>
        <div class="jg-hero-right">
          <div class="jg-hero-belt">${bd.label}</div>
          <div class="jg-hero-sub">${currentMon === 0 ? "Novice &#8212; let's get started!" : currentMon + ' Mon Grade' + (currentMon !== 1 ? 's' : '') + ' earned'}</div>
          ${!isMax ? buildTagPips(currentMon) : ''}
        </div>
      </div>

      ${isMax
        ? '<div class="jg-max">&#127942; All 18 Mon Grades complete! Amazing!</div>'
        : nextMon
          ? buildNextMonSection(nextMon)
          : '<div style="padding:24px;text-align:center;color:var(--text-muted)">Grade data loading&#8230;</div>'
      }

      ${!isMax ? `
      <div class="jg-pass-section">
        <div class="jg-pass-title">Did your coach say you passed? &#127881;</div>
        <button class="jg-pass-btn" onclick="openJuniorPassModal()">&#127885; I Passed Mon ${nextMonId}!</button>
      </div>` : ''}

    </div>`;
}

// ── TAG PIPS ──────────────────────────────────────────────────────
function buildTagPips(currentMon) {
  const posInBand = currentMon % 3;
  if (currentMon > 0 && posInBand === 0) {
    return '<div class="jg-band-complete">&#10024; Belt complete! Earning tags toward next colour</div>';
  }
  const dots = [0, 1, 2].map(i =>
    `<div class="jg-tag-pip${i < posInBand ? ' earned' : ''}"></div>`
  ).join('');
  return `<div class="jg-tag-row">${dots}<span class="jg-tag-hint">${posInBand}&thinsp;/&thinsp;3 tags</span></div>`;
}

// ── NEXT MON GRADE CARD ───────────────────────────────────────────
function buildNextMonSection(mon) {
  const allReqs   = mon.groups.flatMap(g => g.items);
  const doneCount = allReqs.filter(r => beltProgress[monReqKey(mon.id, r)]).length;
  const pct       = allReqs.length ? Math.round(doneCount / allReqs.length * 100) : 0;
  const pctColor  = pct >= 80 ? '#16a34a' : pct >= 50 ? '#d97706' : 'var(--accent)';

  return `
  <div class="jg-next-mon">
    <div class="jg-next-header">
      <div class="jg-next-title-wrap">
        <div class="jg-next-title">&#127919; Next: Mon ${mon.id}</div>
        <div class="jg-next-sub">${mon.fromLabel || ''}</div>
      </div>
      <div class="jg-next-pct-wrap">
        <div class="jg-next-pct" style="color:${pctColor}">${pct}%</div>
        <div class="jg-next-pct-lbl">ready</div>
      </div>
    </div>
    <div class="jg-prog-bar">
      <div class="jg-prog-fill" style="width:${pct}%;background:${pctColor}"></div>
    </div>

    ${mon.groups.map(g => `
    <div class="jg-req-group">
      <div class="jg-req-group-title">${g.title}</div>
      ${g.items.map(r => {
        const key      = monReqKey(mon.id, r);
        const done     = !!beltProgress[key];
        const techName = r.split(' — ')[0].trim();
        const tech     = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === techName) : null;
        const vid      = tech ? getVideoId(tech.url) : null;
        return `
        <div class="jg-req-row${done ? ' done' : ''}" onclick="toggleJuniorReq('${mon.id}','${esc(r)}',this)">
          <div class="jg-req-tick">${done ? '&#10003;' : '&#9675;'}</div>
          <span class="jg-req-text">${r}</span>
          ${vid ? `<button class="jg-req-watch" onclick="event.stopPropagation();openTechDetail('${esc(techName)}')">&#9654;</button>` : ''}
        </div>`;
      }).join('')}
    </div>`).join('')}

    <div class="jg-test-row">
      <button class="jg-test-btn" onclick="openJuniorTestMode(${mon.id})">&#129514; Test Me!</button>
    </div>
  </div>`;
}

// ── TEST MODE ─────────────────────────────────────────────────────
let jgTestState = null;

function openJuniorTestMode(monId) {
  const mon = (typeof MON_DATA !== 'undefined') ? MON_DATA.find(m => m.id === monId) : null;
  if (!mon) return;

  const allReqs  = mon.groups.flatMap(g => g.items);
  const unticked = allReqs.filter(r => !beltProgress[monReqKey(monId, r)]);

  if (unticked.length === 0) {
    showToast('&#10003; All ticked &#8212; ready to pass!');
    return;
  }

  jgTestState = { monId, items: unticked, idx: 0, ticked: 0 };
  renderTestCard();
}

function renderTestCard() {
  const { monId, items, idx } = jgTestState;
  const item     = items[idx];
  const techName = item.split(' — ')[0].trim();
  const tech     = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === techName) : null;
  const vid      = tech ? getVideoId(tech.url) : null;
  const progPct  = Math.round(idx / items.length * 100);

  let el = document.getElementById('jg-test-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'jg-test-overlay';
    document.body.appendChild(el);
  }

  el.className = 'gp-overlay open';
  el.innerHTML = `
    <div class="gp-modal jg-test-card">
      <div class="jg-test-toprow">
        <div class="jg-test-prog-bar">
          <div class="jg-test-prog-fill" style="width:${progPct}%"></div>
        </div>
        <span class="jg-test-count">${idx + 1}&thinsp;/&thinsp;${items.length}</span>
      </div>
      <div class="jg-test-emoji">&#129300;</div>
      <div class="jg-test-label">Can you do this?</div>
      <div class="jg-test-item">${item}</div>
      ${vid ? `<button class="jg-test-watch" onclick="openTechDetail('${esc(techName)}')">&#9654; Watch technique</button>` : ''}
      <div class="jg-test-actions">
        <button class="jg-test-no"  onclick="answerJuniorTest(false)">&#128517; Not yet</button>
        <button class="jg-test-yes" onclick="answerJuniorTest(true)">&#10003; Yes, I can!</button>
      </div>
      <button class="jg-test-stop" onclick="closeJuniorTestMode()">Stop for now</button>
    </div>`;
  document.body.style.overflow = 'hidden';
}

function answerJuniorTest(knew) {
  const { monId, items, idx } = jgTestState;
  if (knew) {
    const key = monReqKey(monId, items[idx]);
    beltProgress[key] = true;
    localStorage.setItem('judo_belt_progress', JSON.stringify(beltProgress));
    jgTestState.ticked++;
  }
  jgTestState.idx++;
  if (jgTestState.idx >= jgTestState.items.length) {
    const ticked = jgTestState.ticked;
    const total  = jgTestState.items.length;
    closeJuniorTestMode();
    showToast('&#127881; Done! Ticked ' + ticked + ' / ' + total);
    renderJuniorGrades();
  } else {
    renderTestCard();
  }
}

function closeJuniorTestMode() {
  const el = document.getElementById('jg-test-overlay');
  if (el) { el.className = 'gp-overlay'; el.innerHTML = ''; }
  document.body.style.overflow = '';
  renderJuniorGrades();
}

// ── JUNIOR GRADING PASS ───────────────────────────────────────────
const JUNIOR_BELT_ORDER = [
  { key:'white',  color:'#f2f2f2', border:'#ccc',    label:'White Belt'  },
  { key:'red',    color:'#e74c3c', border:'#c0392b', label:'Red Belt'    },
  { key:'yellow', color:'#f1c40f', border:'#d4ac0d', label:'Yellow Belt' },
  { key:'orange', color:'#e67e22', border:'#ca6f1e', label:'Orange Belt' },
  { key:'green',  color:'#27ae60', border:'#1e8449', label:'Green Belt'  },
];

function openJuniorPassModal() {
  const currentMon  = getCurrentMonGrade();
  const nextMonId   = currentMon + 1;
  if (nextMonId > 18) { showToast('&#127942; Already completed all Mon grades!'); return; }

  const prevBeltKey = monGradeToBelt(currentMon);
  const newBeltKey  = monGradeToBelt(nextMonId);
  const beltChange  = newBeltKey !== prevBeltKey;
  const prevBd      = BELT_DISPLAY[prevBeltKey] || BELT_DISPLAY.white;
  const newBd       = BELT_DISPLAY[newBeltKey]  || BELT_DISPLAY.white;
  const today       = new Date().toISOString().slice(0, 10);

  let el = document.getElementById('junior-pass-modal');
  if (!el) {
    el = document.createElement('div');
    el.id = 'junior-pass-modal';
    document.body.appendChild(el);
  }

  el.className = 'gp-overlay open';
  el.innerHTML = `
    <div class="gp-modal jr-pass-modal">
      <div class="gp-hero">&#127881;</div>
      <div class="gp-title">Amazing Work!</div>
      <div class="gp-sub">Recording Mon ${nextMonId} pass</div>

      ${beltChange ? `
      <div class="jr-pass-belt-row">
        <div class="jr-pass-from" style="background:${prevBd.color};border:3px solid ${prevBd.border}"></div>
        <span class="jr-pass-arrow">&#8594;</span>
        <div class="jr-pass-to"   style="background:${newBd.color};border:3px solid ${newBd.border}"></div>
        <div class="jr-pass-belt-label">${newBd.label}!</div>
      </div>` : `
      <div class="jr-pass-tag-msg">&#127991; You earn another tag on your ${prevBd.label}!</div>`}

      <div class="gp-field">
        <label class="gp-label">Date you passed</label>
        <input type="date" id="jr-pass-date" class="gp-input" value="${today}">
      </div>
      <div class="gp-actions">
        <button class="gp-cancel"  onclick="closeJuniorPassModal()">Cancel</button>
        <button class="gp-confirm" onclick="confirmJuniorPass(${nextMonId})">&#10003; Yes, I Passed!</button>
      </div>
    </div>`;
  document.body.style.overflow = 'hidden';
}

function closeJuniorPassModal() {
  const el = document.getElementById('junior-pass-modal');
  if (el) el.className = 'gp-overlay';
  document.body.style.overflow = '';
}

function confirmJuniorPass(newMonGrade) {
  const date        = document.getElementById('jr-pass-date').value || new Date().toISOString().slice(0, 10);
  const prevBeltKey = monGradeToBelt(getCurrentMonGrade());

  setMonGrade(newMonGrade);

  const tl = JSON.parse(localStorage.getItem('judo_belt_timeline') || '[]');
  tl.push({ key: 'mon_' + newMonGrade, date, notes: 'Mon ' + newMonGrade + ' pass' });
  localStorage.setItem('judo_belt_timeline', JSON.stringify(tl));

  closeJuniorPassModal();

  const newBeltKey = monGradeToBelt(newMonGrade);
  const msg = newBeltKey !== prevBeltKey
    ? '&#127881; ' + BELT_DISPLAY[newBeltKey].label + '! You levelled up!'
    : '&#127881; Mon ' + newMonGrade + ' earned! Keep going!';
  showToast(msg);
  renderJuniorGrades();
}

// ── TOGGLE REQUIREMENT ────────────────────────────────────────────
function toggleJuniorReq(monId, req, el) {
  const key = monReqKey(monId, req);
  beltProgress[key] = !beltProgress[key];
  localStorage.setItem('judo_belt_progress', JSON.stringify(beltProgress));

  const tick = el.querySelector('.jg-req-tick');
  if (tick) tick.innerHTML = beltProgress[key] ? '&#10003;' : '&#9675;';
  el.classList.toggle('done', !!beltProgress[key]);

  // Live-update progress bar + pct without full re-render
  const iMon = parseInt(monId);
  const mon  = (typeof MON_DATA !== 'undefined') ? MON_DATA.find(m => m.id === iMon) : null;
  if (mon) {
    const all  = mon.groups.flatMap(g => g.items);
    const done = all.filter(r => beltProgress[monReqKey(iMon, r)]).length;
    const pct  = all.length ? Math.round(done / all.length * 100) : 0;
    const bar   = document.querySelector('.jg-prog-fill');
    const pctEl = document.querySelector('.jg-next-pct');
    if (bar)   bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
  }
  showToast(beltProgress[key] ? '&#10003; Ticked!' : 'Unticked');
}

// ── LEGACY HELPERS (used by other views) ─────────────────────────
function getCurrentJuniorBeltColor() {
  return (BELT_DISPLAY[monGradeToBelt(getCurrentMonGrade())] || BELT_DISPLAY.white).color;
}
function getCurrentJuniorBeltBorder() {
  return (BELT_DISPLAY[monGradeToBelt(getCurrentMonGrade())] || BELT_DISPLAY.white).border;
}
function getCurrentJuniorBeltLabel() {
  return (BELT_DISPLAY[monGradeToBelt(getCurrentMonGrade())] || BELT_DISPLAY.white).label;
}
