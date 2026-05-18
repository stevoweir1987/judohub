// ── WEEK HELPERS ───────────────────────────────────
function weekKey(offset) {
  const now = new Date();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
  return mon.toISOString().slice(0, 10);
}

function weekLabel(offset) {
  const now = new Date();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const fmt = d => d.toLocaleDateString('en-GB', {day:'numeric', month:'short'});
  const tag = offset === 0 ? ' (This week)' : offset === -1 ? ' (Last week)' : offset === 1 ? ' (Next week)' : '';
  return fmt(mon) + ' – ' + fmt(sun) + tag;
}

function saveWeek() { localStorage.setItem('judo_week_plans', JSON.stringify(weekPlans)); }
function prevWeek()  { currentWeekOffset--; renderWeek(); }
function nextWeek()  { currentWeekOffset++; renderWeek(); }

function clearWeek() {
  if (!confirm('Clear all items from this week?')) return;
  weekPlans[weekKey(currentWeekOffset)] = {Mon:[],Tue:[],Wed:[],Thu:[],Fri:[],Sat:[],Sun:[]};
  saveWeek(); renderWeek();
}

// ── WEEK RENDER ────────────────────────────────────
function getWeekDates(offset) {
  const now = new Date();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
  mon.setHours(0, 0, 0, 0);
  const map = {};
  DAYS.forEach((d, i) => {
    const dt = new Date(mon);
    dt.setDate(mon.getDate() + i);
    map[d] = dt;
  });
  return map;
}

function isTodayDate(date) {
  const now = new Date();
  return date.getDate()     === now.getDate()    &&
         date.getMonth()    === now.getMonth()   &&
         date.getFullYear() === now.getFullYear();
}

function renderWeek() {
  document.getElementById('week-label').textContent = weekLabel(currentWeekOffset);
  const key   = weekKey(currentWeekOffset);
  if (!weekPlans[key]) weekPlans[key] = {Mon:[],Tue:[],Wed:[],Thu:[],Fri:[],Sat:[],Sun:[]};
  const plan  = weekPlans[key];
  const dates = getWeekDates(currentWeekOffset);

  document.getElementById('week-grid').innerHTML = DAYS.map(day => {
    const items   = plan[day] || [];
    const date    = dates[day];
    const isToday = isTodayDate(date);
    const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const itemsHtml = items.length
      ? items.map(item => `<div class="day-item${item.custom?' custom-item':''}" draggable="true"
          ondragstart="onItemDragStart(event,'${day}',${item.id})"
          ondragend="onDragEnd()">
          <span style="flex:1;line-height:1.35;word-break:break-word">${item.text}</span>
          <span class="day-item-remove" onclick="removeItem('${day}',${item.id})">×</span>
        </div>`).join('')
      : `<div class="drop-hint">Drop here</div>`;

    return `<div class="day-col${isToday ? ' day-col-today' : ''}" id="day-${day}"
      ondragover="onDragOver(event,'${day}')"
      ondragleave="onDragLeave(event,'${day}')"
      ondrop="onDrop(event,'${day}')">
      <div class="day-header">
        <div class="day-header-label">
          <span class="day-name">${day}${isToday ? ' <span class="day-today-badge">Today</span>' : ''}</span>
          <span class="day-date">${dateStr}</span>
        </div>
        <div style="display:flex;gap:4px;align-items:center">
          ${items.length ? `<button class="day-home-btn" onclick="sendDayToHome('${day}')" title="Send to Home">⌂</button>` : ''}
          <button class="day-pt-btn" onclick="loadDayIntoPT('${day}')" title="Send to PT builder">▶ PT</button>
          <button class="day-clear" onclick="clearDay('${day}')">✕</button>
        </div>
      </div>
      <div class="day-drop-zone" id="dz-${day}">${itemsHtml}</div>
      <div class="add-custom-row">
        <input type="text" placeholder="+ custom item…" onkeydown="addCustom(event,'${day}')">
      </div>
    </div>`;
  }).join('');
}

function clearDay(day) {
  const key = weekKey(currentWeekOffset);
  if (weekPlans[key]) { weekPlans[key][day] = []; saveWeek(); renderWeek(); }
}

function removeItem(day, id) {
  const key = weekKey(currentWeekOffset);
  if (weekPlans[key]) {
    weekPlans[key][day] = weekPlans[key][day].filter(i => i.id !== id);
    saveWeek(); renderWeek();
  }
}

function addCustom(e, day) {
  if (e.key !== 'Enter') return;
  const val = e.target.value.trim();
  if (!val) return;
  const key = weekKey(currentWeekOffset);
  if (!weekPlans[key]) weekPlans[key] = {Mon:[],Tue:[],Wed:[],Thu:[],Fri:[],Sat:[],Sun:[]};
  weekPlans[key][day].push({id: Date.now(), text: val, custom: true});
  saveWeek(); renderWeek();
}

// ── DRAG & DROP ────────────────────────────────────
function onTechDragStart(e, name) {
  draggingTech = {type:'lib', name};
  e.dataTransfer.effectAllowed = 'copy';
}

function onItemDragStart(e, day, id) {
  draggingTech = {type:'item', day, id};
  e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd() { draggingTech = null; }

function onDragOver(e, day) {
  e.preventDefault();
  document.getElementById('day-' + day).classList.add('drag-over');
}

function onDragLeave(e, day) {
  document.getElementById('day-' + day).classList.remove('drag-over');
}

function onDrop(e, day) {
  e.preventDefault();
  document.getElementById('day-' + day).classList.remove('drag-over');
  if (!draggingTech) return;
  const key = weekKey(currentWeekOffset);
  if (!weekPlans[key]) weekPlans[key] = {Mon:[],Tue:[],Wed:[],Thu:[],Fri:[],Sat:[],Sun:[]};

  if (draggingTech.type === 'lib') {
    weekPlans[key][day].push({id: Date.now(), text: draggingTech.name, custom: false});
  } else if (draggingTech.type === 'item') {
    const fromDay = draggingTech.day;
    const id      = draggingTech.id;
    const item    = (weekPlans[key][fromDay] || []).find(i => i.id === id);
    if (item) {
      weekPlans[key][fromDay] = weekPlans[key][fromDay].filter(i => i.id !== id);
      weekPlans[key][day].push(item);
    }
  }
  saveWeek(); renderWeek();
}

// ── SEND DAY TO HOME ───────────────────────────────
function sendDayToHome(day) {
  const key   = weekKey(currentWeekOffset);
  const items = (weekPlans[key] && weekPlans[key][day]) || [];
  if (!items.length) { showToast('No items on ' + day + ' to send'); return; }

  const dates   = getWeekDates(currentWeekOffset);
  const dateStr = dates[day].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const secsEach = 120; // 2 min default per item
  const total    = items.length * secsEach;

  currentSession = {
    title:      day + ' · ' + dateStr,
    themeTag:   'custom',
    themeName:  'Planned Session',
    themeEmoji: '📅',
    themeColor: '#2563eb',
    minutes:    Math.max(1, Math.round(total / 60)),
    location:   selectedLocation,
    blocks: [{
      type:     'custom',
      name:     'Your Plan — ' + day,
      duration: total,
      cue:      'Work through each item with focus — adjust pace as needed',
      items:    items.map(i => ({ name: i.text, duration: secsEach })),
    }],
    totalDuration: total,
    fromBuilder:   true,
    plannedDay:    day,
    plannedDate:   dates[day].toISOString().slice(0, 10),
  };

  // Persist so Home page can detect it next visit
  localStorage.setItem('judo_planned_session', JSON.stringify(currentSession));

  showView('home');
  showToast('📅 ' + day + ' plan loaded on Home');
}

// ── BUILDER LIBRARY ────────────────────────────────
function filterBuilderList() { renderBuilderList(); }

function renderBuilderList() {
  const q = (document.getElementById('builder-search') || {}).value || '';
  const filtered = TECHNIQUES.filter(t =>
    !q ||
    t.name.toLowerCase().includes(q.toLowerCase()) ||
    (t.en||'').toLowerCase().includes(q.toLowerCase())
  );

  const groups = {};
  filtered.forEach(t => {
    const g = t.sub || t.cat || 'Other';
    if (!groups[g]) groups[g] = [];
    groups[g].push(t);
  });

  document.getElementById('builder-list').innerHTML = Object.entries(groups).map(([g, techs]) => `
    <div class="lib-group-head">${g}</div>
    ${techs.map(t => `<div class="draggable-tech" draggable="true" ondragstart="onTechDragStart(event,'${esc(t.name)}')">
      <span class="drag-handle">⠿</span>
      <div class="tech-label">
        <span>${t.name}</span>
        <small>${t.en||''}</small>
      </div>
    </div>`).join('')}
  `).join('');
}
