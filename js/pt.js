// ── PT STATE ───────────────────────────────────────
let ptItems   = JSON.parse(localStorage.getItem('judo_pt_session') || '[]');
let ptName    = localStorage.getItem('judo_pt_name') || 'My Session';
let ptLibTab  = 'exercises'; // 'exercises' | 'techniques'
let ptLibQ    = '';

const PT_DURATIONS = [30, 60, 90, 120, 180, 300];

function savePT() {
  localStorage.setItem('judo_pt_session', JSON.stringify(ptItems));
  localStorage.setItem('judo_pt_name', ptName);
}

function fmtSecs(s) {
  if (s < 60) return s + 's';
  const m = Math.floor(s / 60), r = s % 60;
  return m + 'm' + (r ? r + 's' : '');
}

// ── RENDER ─────────────────────────────────────────
function renderPT() {
  document.getElementById('pt-body').innerHTML = `
    <div class="pt-layout">

      <div class="pt-panel">
        <div class="pt-panel-tabs">
          <button class="pt-tab${ptLibTab==='exercises'?' active':''}" onclick="setPTTab('exercises')">💪 Exercises</button>
          <button class="pt-tab${ptLibTab==='techniques'?' active':''}" onclick="setPTTab('techniques')">🥋 Techniques</button>
        </div>
        <div class="pt-lib-search">
          <input type="text" id="pt-search" placeholder="Filter…" oninput="ptLibQ=this.value;renderPTLibrary()">
        </div>
        <div class="pt-lib-list" id="pt-lib-list"></div>
      </div>

      <div class="pt-builder-panel">
        <div class="pt-builder-header">
          <input class="pt-name-input" id="pt-name-input" value="${esc(ptName)}"
            placeholder="Session name…"
            oninput="ptName=this.value;savePT();document.getElementById('pt-total').textContent=ptTotalLabel()">
          <div class="pt-total-time" id="pt-total">${ptTotalLabel()}</div>
        </div>
        <div class="pt-builder-list" id="pt-builder-list"></div>
        <div class="pt-builder-foot">
          <button class="pt-clear-btn" onclick="clearPTSession()">Clear all</button>
          <button class="pt-launch-btn" onclick="launchPTSession()">▶ Start session</button>
        </div>
      </div>

    </div>
  `;
  renderPTLibrary();
  renderPTBuilder();
}

function ptTotalLabel() {
  const t = ptItems.reduce((s, i) => s + i.duration, 0);
  return t ? fmtSecs(t) + ' total' : '';
}

// ── LIBRARY PANEL ──────────────────────────────────
function setPTTab(tab) {
  ptLibTab = tab;
  document.querySelectorAll('.pt-tab').forEach(b => {
    b.classList.toggle('active',
      (tab === 'exercises' && b.textContent.includes('Exercises')) ||
      (tab === 'techniques' && b.textContent.includes('Techniques'))
    );
  });
  renderPTLibrary();
}

function renderPTLibrary() {
  const q = (ptLibQ || '').toLowerCase();
  let html = '';

  if (ptLibTab === 'exercises') {
    const cats = {};
    EXERCISES
      .filter(e => !q || e.name.toLowerCase().includes(q) || e.cat.toLowerCase().includes(q))
      .forEach(e => { if (!cats[e.cat]) cats[e.cat] = []; cats[e.cat].push(e); });

    html = Object.entries(cats).map(([cat, items]) => `
      <div class="lib-group-head">${cat}</div>
      ${items.map(e => `
        <div class="pt-lib-item" onclick="addPTItem('${esc(e.name)}','exercise','${esc(e.note||'')}',60)">
          <div class="pt-lib-item-name">${e.name}</div>
          ${e.note ? `<div class="pt-lib-item-note">${e.note}</div>` : ''}
        </div>
      `).join('')}
    `).join('');

  } else {
    const groups = {};
    TECHNIQUES
      .filter(t => !q || t.name.toLowerCase().includes(q) || (t.en||'').toLowerCase().includes(q))
      .forEach(t => { const g = t.sub || t.cat || 'Other'; if (!groups[g]) groups[g] = []; groups[g].push(t); });

    html = Object.entries(groups).map(([g, techs]) => `
      <div class="lib-group-head">${g}</div>
      ${techs.map(t => `
        <div class="pt-lib-item" onclick="addPTItem('${esc(t.name)}','technique','',90)">
          <div class="pt-lib-item-name">${t.name}</div>
          ${t.en ? `<div class="pt-lib-item-note">${t.en}</div>` : ''}
        </div>
      `).join('')}
    `).join('');
  }

  const el = document.getElementById('pt-lib-list');
  if (el) el.innerHTML = html || '<div class="pt-lib-empty">No results</div>';
}

// ── BUILDER PANEL ──────────────────────────────────
function renderPTBuilder() {
  const list = document.getElementById('pt-builder-list');
  if (!list) return;

  document.getElementById('pt-total').textContent = ptTotalLabel();

  if (!ptItems.length) {
    list.innerHTML = '<div class="pt-builder-empty">← Tap exercises or techniques to add them<br><br><span style="font-size:11px;color:var(--border)">Tap the time badge to change duration</span></div>';
    return;
  }

  list.innerHTML = ptItems.map((item, idx) => `
    <div class="pt-builder-item ${item.type === 'technique' ? 'pt-technique' : 'pt-exercise'}">
      <div class="pt-item-reorder">
        <button onclick="movePTItem(${item.id},-1)" ${idx === 0 ? 'disabled' : ''}>↑</button>
        <button onclick="movePTItem(${item.id}, 1)" ${idx === ptItems.length - 1 ? 'disabled' : ''}>↓</button>
      </div>
      <div class="pt-item-info">
        <div class="pt-item-name">${item.text}</div>
        ${item.note ? `<div class="pt-item-note">${item.note}</div>` : ''}
      </div>
      <div class="pt-item-controls">
        <button class="pt-dur-btn" onclick="cyclePTDuration(${item.id})" title="Tap to change">${fmtSecs(item.duration)}</button>
        <button class="pt-remove-btn" onclick="removePTItem(${item.id})">×</button>
      </div>
    </div>
  `).join('');
}

// ── ITEM ACTIONS ───────────────────────────────────
function addPTItem(text, type, note, duration) {
  ptItems.push({ id: Date.now() + Math.floor(Math.random() * 1000), text, type, note, duration });
  savePT();
  renderPTBuilder();
  showToast('Added: ' + text);
}

function removePTItem(id) {
  ptItems = ptItems.filter(i => i.id !== id);
  savePT();
  renderPTBuilder();
}

function movePTItem(id, dir) {
  const idx = ptItems.findIndex(i => i.id === id);
  if (idx < 0) return;
  const to = idx + dir;
  if (to < 0 || to >= ptItems.length) return;
  const arr = [...ptItems];
  [arr[idx], arr[to]] = [arr[to], arr[idx]];
  ptItems = arr;
  savePT();
  renderPTBuilder();
}

function cyclePTDuration(id) {
  const item = ptItems.find(i => i.id === id);
  if (!item) return;
  const cur = PT_DURATIONS.indexOf(item.duration);
  item.duration = PT_DURATIONS[(cur + 1) % PT_DURATIONS.length];
  savePT();
  renderPTBuilder();
}

function clearPTSession() {
  if (ptItems.length && !confirm('Clear all items?')) return;
  ptItems = [];
  savePT();
  renderPTBuilder();
}

// ── LOAD FROM BUILDER ──────────────────────────────
function loadDayIntoPT(day) {
  const key = weekKey(currentWeekOffset);
  const items = (weekPlans[key] && weekPlans[key][day]) || [];
  if (!items.length) { showToast('Nothing planned on ' + day); return; }
  if (ptItems.length && !confirm('Replace current PT session with ' + day + '\'s plan?')) return;

  let base = Date.now();
  ptItems = items.map(i => ({
    id: base++,
    text: i.text,
    type: i.custom ? 'exercise' : 'technique',
    note: '',
    duration: 90,
  }));
  ptName = day + '\'s Session';
  savePT();
  showView('pt');
}

// ── LAUNCH ─────────────────────────────────────────
function launchPTSession() {
  if (!ptItems.length) { showToast('Add some items first!'); return; }

  const totalSecs = ptItems.reduce((s, i) => s + i.duration, 0);

  currentSession = {
    title: ptName || 'My Session',
    themeTag: 'custom',
    themeName: ptName || 'My Session',
    themeEmoji: '⚡',
    themeColor: '#e8c84a',
    minutes: Math.max(1, Math.round(totalSecs / 60)),
    location: 'custom',
    blocks: [{
      type: 'custom',
      name: ptName || 'My Session',
      duration: totalSecs,
      cue: '',
      items: ptItems.map(i => ({ name: i.text, duration: i.duration })),
    }],
    totalDuration: totalSecs,
  };

  startSession();
}
