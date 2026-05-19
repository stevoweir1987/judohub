// ── PERSONAL BELT STATE ────────────────────────────
const BELT_ID_ORDER  = ['toRed','toYellow','toOrange','toGreen','toBlue','toBrown'];
const BELT_PASS_KEYS = { toRed:'red', toYellow:'yellow', toOrange:'orange', toGreen:'green', toBlue:'blue', toBrown:'brown' };

function getCurrentTargetBeltId() {
  return localStorage.getItem('judo_current_belt_id') || null;
}
function setCurrentTargetBeltId(id) {
  if (id) localStorage.setItem('judo_current_belt_id', id);
  else    localStorage.removeItem('judo_current_belt_id');
}
function getNextBeltId(currentId) {
  const idx = BELT_ID_ORDER.indexOf(currentId);
  return (idx >= 0 && idx < BELT_ID_ORDER.length - 1) ? BELT_ID_ORDER[idx + 1] : null;
}
function getCurrentTargetBelt() {
  const id = getCurrentTargetBeltId();
  if (id) {
    const b = BELT_DATA.find(b => b.id === id);
    if (b) return b;
  }
  // Fallback: first incomplete belt
  for (const b of BELT_DATA) {
    const total = b.groups.reduce((s,g) => s + g.items.length, 0);
    const done  = b.groups.reduce((s,g) => s + g.items.filter(i => !!beltProgress[b.id+'_'+i]).length, 0);
    if (done < total) return b;
  }
  return BELT_DATA[0];
}

// ── GRADING PASS MODAL ──────────────────────────────
function openGradingPassModal(beltId) {
  const b = BELT_DATA.find(b => b.id === beltId);
  if (!b) return;
  const today = new Date().toISOString().slice(0,10);
  let el = document.getElementById('grading-pass-modal');
  if (!el) {
    el = document.createElement('div');
    el.id = 'grading-pass-modal';
    document.body.appendChild(el);
  }
  el.className = 'gp-overlay open';
  el.innerHTML = `
    <div class="gp-modal">
      <div class="gp-hero">&#127885;</div>
      <div class="gp-title">Record Grading Pass</div>
      <div class="gp-sub">Congratulations — lock it into your journey!</div>
      <div class="gp-belt-row">
        <div class="belt-dot ${b.fromColor}"></div>
        <span class="gp-arrow">&#8594;</span>
        <div class="belt-dot ${b.toColor}"></div>
        <span class="gp-belt-label">${b.label}</span>
      </div>
      <div class="gp-field">
        <label class="gp-label">Date passed</label>
        <input type="date" id="gp-date" class="gp-input" value="${today}">
      </div>
      <div class="gp-field">
        <label class="gp-label">Notes (optional)</label>
        <input type="text" id="gp-notes" class="gp-input" placeholder="e.g. Club grading, first attempt…">
      </div>
      <div class="gp-actions">
        <button class="gp-cancel" onclick="closeGradingPassModal()">Cancel</button>
        <button class="gp-confirm" onclick="confirmGradingPass('${beltId}')">&#10003; Confirm Pass</button>
      </div>
    </div>`;
  document.body.style.overflow = 'hidden';
}

function closeGradingPassModal() {
  const el = document.getElementById('grading-pass-modal');
  if (el) el.className = 'gp-overlay';
  document.body.style.overflow = '';
}

function confirmGradingPass(beltId) {
  const date  = document.getElementById('gp-date').value  || new Date().toISOString().slice(0,10);
  const notes = (document.getElementById('gp-notes').value || '').trim();
  const b     = BELT_DATA.find(b => b.id === beltId);
  if (!b) return;

  // 1. Save to belt timeline (keyed by belt colour, e.g. 'orange')
  const tlKey = BELT_PASS_KEYS[beltId] || beltId;
  const tl    = JSON.parse(localStorage.getItem('judo_belt_timeline') || '[]');
  const entry = tl.find(t => t.key === tlKey);
  if (entry) { entry.date = date; if (notes) entry.notes = notes; }
  else tl.push({ key: tlKey, date, notes });
  localStorage.setItem('judo_belt_timeline', JSON.stringify(tl));

  // 2. Advance current target belt to next
  const nextId = getNextBeltId(beltId);
  setCurrentTargetBeltId(nextId || beltId);

  closeGradingPassModal();

  const nextB = nextId ? BELT_DATA.find(b => b.id === nextId) : null;
  const msg   = nextB
    ? '&#127881; ' + b.to + ' Belt recorded! Now targeting ' + nextB.to
    : '&#127881; ' + b.to + ' Belt recorded!';
  showToast(msg);

  // 3. Refresh open views
  if (typeof renderBelt     === 'function') renderBelt();
  if (typeof renderHome     === 'function') renderHome();
  if (typeof renderProgress === 'function') renderProgress();
}

// ── BELT → TECHNIQUE MAPPING ───────────────────────
// Names must match entries in TECHNIQUES array
const BELT_TECHNIQUES = {
  toRed: [
    'Ushiro Ukemi','Yoko Ukemi','Mae Mawari Ukemi (3 Versions)',
    'Osoto-otoshi','Deashi-barai','Uki-goshi',
    'Kesa-gatame','Mune-gatame','Kuzure-kesa-gatame',
    'Osoto-otoshi into Kesa-gatame','Deashi-barai into Mune-gatame','Uki-goshi into Kuzure-kesa-gatame',
    "Escape from Kesa-gatame by trapping Uke's leg",
    'Escape from Mune-gatame using a bridge and roll action',
    'Escape from Kuzure-kesa-gatame using sit up and push',
  ],
  toYellow: [
    // Ukemi
    'Mae-ukemi','Ushiro-ukemi','Yoko-ukemi','Mae-mawari-ukemi',
    // Tachi-waza
    'Tai-otoshi','Ippon-seoi-nage','Ouchi-gari',
    // Osaekomi-waza
    'Yoko-shiho-gatame','Tate-shiho-gatame','Kami-shiho-gatame','Kesa-gatame','Mune-gatame',
    // Combinations
    'Tai-otoshi → Yoko-shiho-gatame','Ippon-seoi-nage → Kami-shiho-gatame','Ouchi-gari → Tate-shiho-gatame',
    // Ne-waza escapes & turnovers
    'Escape from Kami-shiho-gatame (action & reaction)',
    'Escape from Tate-shiho-gatame (clamp & roll)',
    'Escape from Yoko-shiho-gatame (trap, bridge & roll)',
    'Turnover into Kesa-gatame (uke all fours)',
    'Turnover into Yoko-shiho-gatame (uke face-down)',
    // Kumi-kata & randori
    'Standard grips — right and left','Right vs left, double lapel, high collar grips',
    'Nage-komi in light randori',
  ],
  toOrange: [
    // Tachi-waza
    'Tsurikomi-goshi','O-goshi','Seoi-otoshi','Morote-seoi-nage',
    'Ko-uchi-gari','Ko-soto-gake','Ko-soto-gari','O-soto-gari',
    // Osaekomi-waza
    'Kesa-gatame','Kuzure-kesa-gatame','Yoko-shiho-gatame','Kami-shiho-gatame','Tate-shiho-gatame',
  ],
  toGreen: [
    // Tachi-waza (BJA Jan 2025)
    'Harai-goshi','Uchi-mata','Hiza-guruma','Sasae-tsuri-komi-ashi','Hane-goshi','Okuri-ashi-barai','Morote-eri-seoi-nage',
    // Kansetsu-waza
    'Ude-gatame','Waki-gatame','Hiza-gatame','Juji-gatame',
  ],
  toBlue: [
    // Tachi-waza (BJA Jan 2025)
    'Soto-maki-komi','Tani-otoshi','Yoko-guruma','Tomoe-nage','Yoko-tomoe-nage','Uki-waza',
    // Shime-waza
    'Okuri-eri-jime','Nami-juji-jime','Gyaku-juji-jime','Kata-juji-jime','Koshi-jime','Kata-te-jime',
    // Kansetsu-waza
    'Ude-garami',
  ],
  toBrown: [
    // Tachi-waza (BJA Jan 2025)
    'Sode-tsuri-komi-goshi','Sumi-gaeshi','Yoko-gake','Ko-uchi-gake-maki-komi','Ushiro-goshi','Ura-nage','Uki-otoshi','Koshi-guruma',
    // Shime-waza
    'Kata-ha-jime','Hadaka-jime','San-gaku-jime','San-gaku-gatame','San-gaku-osae-gatame',
  ],
};

const BELT_PREP_COMBOS = {
  toYellow: [
    'Tai-otoshi → Yoko-shiho-gatame',
    'Ippon-seoi-nage → Kami-shiho-gatame',
    'Ouchi-gari → Tate-shiho-gatame',
  ],
  toOrange: [
    'Ko-uchi-gari → O-soto-gari',
    'Ko-uchi-gari → Morote-seoi-nage',
    'Ouchi-gari → Ko-uchi-gari',
  ],
  toGreen: [
    'O-goshi → Kesa-gatame',
    'Tai-otoshi → Kesa-gatame',
    'Ko-soto-gari → Yoko-shiho-gatame',
  ],
  toBlue: [
    'Uchi-mata → O-goshi',
    'Ko-soto-gari → Uchi-mata',
  ],
  toBrown: [
    'Tai-otoshi → Uchi-mata',
    'Ouchi-gari → Tani-otoshi',
  ],
};

// ── RENDER ─────────────────────────────────────────
function renderBelt() {
  // Black belt — special completion view
  const profile = (typeof getProfile === 'function') ? getProfile() : null;
  const isBlack = (profile && profile.belt === 'black') ||
                  localStorage.getItem('judo_current_belt_id') === 'black';
  if (isBlack) { renderBlackBeltAchieved(); return; }

  const b          = getCurrentTargetBelt();
  const passedDate = _getPassedDate(b.id);
  const allItems   = b.groups.flatMap(g => g.items);
  const doneCount  = allItems.filter(i => !!beltProgress[b.id + '_' + i]).length;
  const pct        = allItems.length ? Math.round(doneCount / allItems.length * 100) : 0;

  document.getElementById('belt-tab-content').innerHTML = `
    ${buildAdultHero(b, pct)}

    ${buildAdultRequirements(b, doneCount, allItems.length)}

    <div class="ab-bottom-row">
      ${passedDate
        ? `<div class="ios-passed-badge">
             <span class="ios-passed-check">&#10003;</span>
             <span class="ios-passed-text">Passed ${passedDate}</span>
             <button class="ios-passed-edit" onclick="openGradingPassModal('${b.id}')">Edit</button>
             <button class="ios-passed-clear" onclick="clearGradingPass('${b.id}')">&#10005;</button>
           </div>`
        : `<button class="ios-pass-btn" onclick="openGradingPassModal('${b.id}')">&#127881; I Passed This Belt!</button>`
      }
    </div>

    <div class="ab-browse-toggle" onclick="toggleAdultBrowse()">
      <span>Browse All Grades</span>
      <span id="ab-browse-chev">&#9660;</span>
    </div>
    <div class="ab-browse-body" id="ab-browse-body">
      ${BELT_DATA.map(belt => beltSection(belt)).join('')}
    </div>
  `;
}

function _getPassedDate(beltId) {
  const tlKey = BELT_PASS_KEYS[beltId] || beltId;
  const tl    = JSON.parse(localStorage.getItem('judo_belt_timeline') || '[]');
  return (tl.find(t => t.key === tlKey) || {}).date || null;
}

function beltSection(b) {
  const total     = b.groups.reduce((s,g) => s + g.items.length, 0);
  const done      = b.groups.reduce((s,g) => s + g.items.filter(item => beltProgress[b.id+'_'+item]).length, 0);
  const pct       = total ? Math.round(done / total * 100) : 0;
  const open      = beltProgress['__open_'  + b.id];
  const reqsOpen  = beltProgress['__reqs_'  + b.id];
  const isCurrent = (b.id === getCurrentTargetBelt().id);
  const passedDate = _getPassedDate(b.id);

  const techNames = BELT_TECHNIQUES[b.id] || [];
  const techs     = techNames.map(n => TECHNIQUES.find(t => t.name === n)).filter(Boolean);

  return `
<div class="belt-section${open?' open':''}${isCurrent?' current-target':''}" id="bs-${b.id}">

  <div class="belt-header" onclick="toggleBelt('${b.id}')">
    ${isCurrent ? '<span class="belt-active-pip">YOUR GOAL</span>' : ''}
    <div class="belt-dot ${b.fromColor}"></div>
    <span style="color:var(--text-muted);font-size:18px;margin:0 2px">→</span>
    <div class="belt-dot ${b.toColor}"></div>
    <div class="belt-title"><h3>${b.label}</h3><p>${passedDate ? '✅ Passed' : b.duration}</p></div>
    <div style="display:flex;align-items:center;gap:10px">
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <span class="progress-pct">${pct}%</span>
    </div>
    <span class="belt-chevron">⌄</span>
  </div>

  <div class="belt-body">

    <div class="belt-sub-section">
      <div class="belt-sub-heading">Required Techniques</div>
      <div class="belt-tech-grid">
        ${techs.map(t => beltTechCard(t)).join('')}
      </div>
    </div>

    <div class="belt-prep-row">
      <div class="belt-prep-info">
        <div class="belt-prep-label">&#127885; Grading Prep Session</div>
        <div class="belt-prep-desc">Every required technique + key combinations — timed drill</div>
      </div>
      <button class="belt-prep-btn" onclick="startBeltPrepSession('${b.id}')">Start &#8594;</button>
    </div>
    <button class="belt-readiness-btn" onclick="event.stopPropagation();openGradingReadiness('${b.id}')">&#127919; Check Readiness for this grade &#8594;</button>

    ${passedDate
      ? `<div class="belt-passed-row">&#10003; Passed on ${passedDate} &nbsp;<button class="belt-edit-pass-btn" onclick="event.stopPropagation();openGradingPassModal('${b.id}')">Edit</button></div>`
      : `<div class="belt-pass-row">
           <div class="belt-pass-hint">Done with this grading?</div>
           <button class="belt-pass-btn" onclick="event.stopPropagation();openGradingPassModal('${b.id}')">&#127881; I Passed This Belt</button>
         </div>`}

    <div class="belt-req-toggle" onclick="toggleBeltReqs('${b.id}')">
      <span>Full Requirements Checklist &nbsp;<span style="color:var(--accent);font-size:11px">${done}/${total} done</span></span>
      <span class="belt-req-chevron${reqsOpen?' open':''}" id="rchev-${b.id}">⌄</span>
    </div>
    <div class="belt-req-body${reqsOpen?' open':''}" id="reqs-${b.id}">
      ${b.groups.map(g => reqGroup(b.id, g)).join('')}
    </div>

  </div>
</div>`;
}

// ── TECHNIQUE CARD ─────────────────────────────────
function beltTechCard(t) {
  const vid      = getVideoId(t.url);
  const isCombo  = t.cat === 'Combination' || t.cat === 'Ne-waza';
  const subTag   = t.sub && !isCombo ? `<span class="tag sub">${t.sub}</span>` : '';
  const catTag   = t.cat && !isCombo  ? `<span class="tag cat">${t.cat}</span>` : '';
  const comboTag = isCombo ? `<span class="tag" style="background:#1a1a2e;border-color:#44448a;color:#9090e0">Combo</span>` : '';

  return `
<div class="belt-tech-card">
  <div class="belt-tc-name">${t.name}</div>
  ${t.en ? `<div class="belt-tc-en">${t.en}</div>` : ''}
  <div class="belt-tc-tags">${subTag}${catTag}${comboTag}</div>
  <div class="belt-tc-foot">
    ${vid
      ? `<button class="belt-tc-watch" onclick="event.stopPropagation();openTechDetail('${esc(t.name)}')">▶ Watch</button>`
      : `<span class="belt-tc-novid">No video</span>`}
  </div>
</div>`;
}

// ── CHECKLIST ──────────────────────────────────────
function reqGroup(beltId, g) {
  return `<div class="req-group">
  <div class="req-group-title">${g.title}</div>
  ${g.items.map(item => reqItem(beltId, item)).join('')}
</div>`;
}

function reqItem(beltId, item) {
  const done = !!beltProgress[beltId + '_' + item];
  return `<div class="req-item${done?' done':''}" onclick="toggleReq('${beltId}','${esc(item)}')">
  <div class="req-checkbox"></div>
  <span class="req-text">${item}</span>
</div>`;
}

// ── TOGGLES ────────────────────────────────────────
function toggleBelt(id) {
  beltProgress['__open_' + id] = !beltProgress['__open_' + id];
  localStorage.setItem('judo_belt_progress', JSON.stringify(beltProgress));
  renderBelt();
}

function toggleBeltReqs(id) {
  beltProgress['__reqs_' + id] = !beltProgress['__reqs_' + id];
  localStorage.setItem('judo_belt_progress', JSON.stringify(beltProgress));
  const body = document.getElementById('reqs-' + id);
  const chev = document.getElementById('rchev-' + id);
  if (body) body.classList.toggle('open', !!beltProgress['__reqs_' + id]);
  if (chev) chev.classList.toggle('open', !!beltProgress['__reqs_' + id]);
}

function toggleReq(beltId, item) {
  const key = beltId + '_' + item;
  beltProgress[key] = !beltProgress[key];
  localStorage.setItem('judo_belt_progress', JSON.stringify(beltProgress));
  renderBelt();
}

// ── GRADING PREP SESSION ───────────────────────────
function startBeltPrepSession(beltId) {
  const b = BELT_DATA.find(b => b.id === beltId);
  if (!b) return;

  const techNames = (BELT_TECHNIQUES[beltId] || []).filter(n => !n.includes('→'));
  const combos    =  BELT_PREP_COMBOS[beltId] || [];
  const items     = [];

  items.push({ name: 'Warmup — arm circles, hip rotations, shadow movement', duration: 60 });
  techNames.forEach(name => {
    items.push({ name: name + ' — uchikomi × 10, both sides', duration: 90 });
  });
  combos.forEach(combo => {
    items.push({ name: 'Combo: ' + combo, duration: 60 });
  });
  items.push({ name: 'Mindset: attack first, stay relaxed — show the examiner your judo', duration: 30 });

  const totalSecs = items.reduce((s, i) => s + i.duration, 0);

  currentSession = {
    title: b.label + ' Prep',
    themeTag: 'beltprep',
    themeName: 'Grading Prep',
    themeEmoji: '🏅',
    themeColor: '#c9952f',
    minutes: Math.max(1, Math.round(totalSecs / 60)),
    location: 'solo',
    blocks: [{
      type: 'beltprep',
      name: b.label + ' Grading Prep',
      duration: totalSecs,
      cue: 'Show control, not just technique — examiners watch your attitude',
      items,
    }],
    totalDuration: totalSecs,
  };

  startSession();
}

// ── ADULT BELT HERO ────────────────────────────────
const BELT_HEX = {
  'belt-color-white':  '#e8e8e8',
  'belt-color-red':    '#c0392b',
  'belt-color-yellow': '#f1c40f',
  'belt-color-orange': '#e67e22',
  'belt-color-green':  '#27ae60',
  'belt-color-blue':   '#2980b9',
  'belt-color-brown':  '#795548',
};

const BELT_IMG_MAP = {
  'belt-color-white':  'belt-white.png',
  'belt-color-red':    'belt-red.png',
  'belt-color-yellow': 'belt-yellow.png',
  'belt-color-orange': 'belt-orange.png',
  'belt-color-green':  'belt-green.png',
  'belt-color-blue':   'belt-blue.png',
  'belt-color-brown':  'belt-brown.png',
};

function buildAdultHero(b, pct) {
  const pctColor  = pct >= 80 ? '#4ade80' : pct >= 50 ? '#f59e0b' : '#e63946';
  const fromFile  = BELT_IMG_MAP[b.fromColor] || 'belt-white.png';
  const toFile    = BELT_IMG_MAP[b.toColor]   || 'belt-red.png';
  const statusWord = pct >= 80 ? '&#10003; Ready to grade' : pct >= 50 ? 'Good progress' : 'Keep building';

  return `
  <div class="ab-hero">
    <!-- Belt image transition -->
    <div class="ab-belt-row">
      <div class="ab-belt-img-wrap">
        <img src="images/${fromFile}" class="ab-belt-img" alt="${b.from} Belt">
        <span class="ab-belt-img-label">${b.from}</span>
      </div>
      <div class="ab-arrow-track">
        <div class="ab-arrow-line"></div>
        <div class="ab-arrow-pct" style="color:${pctColor}">${pct}%</div>
      </div>
      <div class="ab-belt-img-wrap">
        <img src="images/${toFile}" class="ab-belt-img" alt="${b.to} Belt">
        <span class="ab-belt-img-label">${b.to}</span>
      </div>
    </div>
    <!-- Progress bar -->
    <div class="ab-prog-bar">
      <div class="ab-prog-fill" style="width:${pct}%;background:${pctColor}"></div>
    </div>
    <!-- Footer -->
    <div class="ab-hero-foot">
      <span class="ab-hero-duration">&#128337; ${b.duration}</span>
      <span class="ab-hero-progress-words" style="color:${pctColor}">${statusWord}</span>
    </div>
  </div>`;
}

// ── ADULT REQUIREMENTS CARD ────────────────────────
function getSectionIcon(title) {
  if (title.includes('Ukemi'))                           return '\u{1F6E1}';
  if (title.includes('Tachi'))                           return '\u{1F94B}';
  if (title.includes('Osaekomi'))                        return '⚡';
  if (title.includes('Ne-waza'))                         return '\u{1F4AA}';
  if (title.includes('Combination') || title.includes('Transition')) return '\u{1F517}';
  if (title.includes('Counter'))                         return '\u{1F504}';
  if (title.includes('Terminology') || title.includes('Knowledge'))  return '\u{1F4D6}';
  if (title.includes('Personal'))                        return '⭐';
  if (title.includes('Performance'))                     return '\u{1F3AF}';
  if (title.includes('Randori'))                         return '⚔';
  if (title.includes('Moral') || title.includes('Referee')) return '\u{1F31F}';
  return '\u{1F4CC}';
}


// ── GRADE ACCORDION ───────────────────────────────────────────────

function buildAdultRequirements(b, doneCount, totalCount) {
  const accentMap = {
    toRed:'#e02d2d', toYellow:'#f59e0b', toOrange:'#f97316',
    toGreen:'#16a34a', toBlue:'#2563eb', toBrown:'#78350f'
  };
  const accent   = accentMap[b.id] || '#e63946';
  const checkSvg = '<svg viewBox="0 0 12 10" width="12" height="10"><polyline points="1,5 4.5,9 11,1" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const playSvg  = '<svg viewBox="0 0 24 24" width="14" height="14" fill="#2563eb"><polygon points="6,4 20,12 6,20"/></svg>';

  // Find index of first incomplete group — that one auto-opens
  const firstIncompleteIdx = b.groups.findIndex(g =>
    g.items.some(item => !beltProgress[b.id + '_' + item])
  );

  const groupsHtml = b.groups.map((g, gIdx) => {
    const gDone   = g.items.filter(item => !!beltProgress[b.id + '_' + item]).length;
    const gTotal  = g.items.length;
    const gPct    = gTotal ? Math.round(gDone / gTotal * 100) : 0;
    const isOpen  = gIdx === firstIncompleteIdx;
    const pillCol = gPct === 100 ? '#4ade80' : gPct > 0 ? '#f59e0b' : '#e63946';
    const pillBg  = gPct === 100 ? 'rgba(74,222,128,.12)' : gPct > 0 ? 'rgba(245,158,11,.12)' : 'rgba(230,57,70,.1)';
    const icon    = getSectionIcon(g.title);

    const rowsHtml = g.items.map((item, idx) => {
      const key        = b.id + '_' + item;
      const done       = !!beltProgress[key];
      const tech       = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === item) : null;
      const techVid    = tech ? getVideoId(tech.url) : null;
      const gradingUrl = (typeof GRADING_VIDEOS !== 'undefined') ? GRADING_VIDEOS[item] : null;
      const thumbUrl   = techVid ? 'https://img.youtube.com/vi/' + techVid + '/mqdefault.jpg' : null;
      const subtitle   = (tech && tech.en) ? tech.en : ((typeof TERMS_EN !== 'undefined' && TERMS_EN[item]) ? TERMS_EN[item] : '');
      const playAction = techVid
        ? "event.stopPropagation();openTechDetail('" + item.replace(/'/g, "\\'") + "')"
        : gradingUrl ? "event.stopPropagation();openGradingVideo('" + gradingUrl + "','" + item.replace(/'/g, "\\'") + "')" : null;
      const isLast     = idx === g.items.length - 1;

      return `
      <div class="gr-acc-tech${done ? ' ios-checked' : ''}" onclick="toggleAdultReq('${b.id}','${item.replace(/'/g, "\\'")}',this)">
        <div class="ios-thumb-wrap">
          ${thumbUrl ? `<img class="ios-thumb" src="${thumbUrl}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
          <div class="ios-thumb-ph" style="${thumbUrl ? 'display:none' : ''}">${icon}</div>
        </div>
        <div class="ios-req-info">
          <span class="ios-req-name">${item}</span>
          ${subtitle ? '<span class="ios-req-sub">' + subtitle + '</span>' : ''}
        </div>
        <div class="ios-req-actions">
          <div class="ios-check-pill${done ? ' ios-check-on' : ''}">${done ? checkSvg : ''}</div>
          ${playAction
            ? '<button class="ios-play-btn" onclick="' + playAction + '">' + playSvg + '</button>'
            : '<div class="ios-play-ph"></div>'}
        </div>
      </div>${!isLast ? '<div class="ios-divider"></div>' : ''}`;
    }).join('');

    return `
    <div class="gr-acc-section${isOpen ? ' gr-acc-open' : ''}" id="gr-acc-${b.id}-${gIdx}">
      <div class="gr-acc-header" onclick="toggleGradeSection('${b.id}',${gIdx})">
        <div class="ios-sec-dot" style="background:${accent}"></div>
        <span class="ios-sec-title">${g.title}</span>
        <span class="gr-acc-pill" style="color:${pillCol};background:${pillBg}">${gDone}/${gTotal}</span>
        <div class="gr-acc-mini-bar">
          <div class="gr-acc-mini-fill" style="width:${gPct}%;background:${pillCol}"></div>
        </div>
        <span class="gr-acc-chev">${isOpen ? '&#9650;' : '&#9660;'}</span>
      </div>
      <div class="gr-acc-body" style="${isOpen ? '' : 'display:none'}">
        <div class="ios-req-card">${rowsHtml}</div>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="ios-reqs-wrap">
    <div class="ios-reqs-top">
      <span class="ios-reqs-heading">Requirements</span>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="ios-reqs-badge">${doneCount} / ${totalCount}</span>
        <button class="gr-viewall-btn" onclick="openFullRequirements('${b.id}')">View All &#8594;</button>
      </div>
    </div>
    ${groupsHtml}
    <div class="ab-actions-row">
      <button class="ab-prep-btn" onclick="startBeltPrepSession('${b.id}')">&#127879; Prep</button>
      <button class="ab-test-btn" onclick="openAdultTestMode('${b.id}')">&#129514; Test Me</button>
      <button class="ab-quiz-btn" onclick="openTerminologyQuiz('${b.id}')">&#127919; Quiz</button>
    </div>
  </div>
  <button class="ios-fab" onclick="openGradingReadiness()" title="Grading Readiness">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
  </button>`;
}

function toggleGradeSection(beltId, gIdx) {
  const sec  = document.getElementById('gr-acc-' + beltId + '-' + gIdx);
  if (!sec) return;
  const body = sec.querySelector('.gr-acc-body');
  const chev = sec.querySelector('.gr-acc-chev');
  const open = sec.classList.toggle('gr-acc-open');
  if (body) body.style.display = open ? '' : 'none';
  if (chev) chev.innerHTML     = open ? '&#9650;' : '&#9660;';
}

function openFullRequirements(beltId) {
  const b = BELT_DATA.find(b => b.id === beltId);
  if (!b) return;
  const checkSvg = '<svg viewBox="0 0 12 10" width="12" height="10"><polyline points="1,5 4.5,9 11,1" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const playSvg  = '<svg viewBox="0 0 24 24" width="14" height="14" fill="#2563eb"><polygon points="6,4 20,12 6,20"/></svg>';
  const allDone  = b.groups.flatMap(g => g.items).filter(i => !!beltProgress[b.id + '_' + i]).length;
  const allTotal = b.groups.flatMap(g => g.items).length;

  const html = b.groups.map(g => {
    const icon = getSectionIcon(g.title);
    const rows = g.items.map((item, idx) => {
      const key      = b.id + '_' + item;
      const done     = !!beltProgress[key];
      const tech     = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === item) : null;
      const techVid  = tech ? getVideoId(tech.url) : null;
      const thumbUrl = techVid ? 'https://img.youtube.com/vi/' + techVid + '/mqdefault.jpg' : null;
      const subtitle = (tech && tech.en) ? tech.en : ((typeof TERMS_EN !== 'undefined' && TERMS_EN[item]) ? TERMS_EN[item] : '');
      const playAct  = techVid ? "event.stopPropagation();openTechDetail('" + item.replace(/'/g, "\\'") + "')" : null;
      const isLast   = idx === g.items.length - 1;
      return `
      <div class="gr-acc-tech${done ? ' ios-checked' : ''}" onclick="toggleAdultReq('${b.id}','${item.replace(/'/g, "\\'")}',this)">
        <div class="ios-thumb-wrap">
          ${thumbUrl ? `<img class="ios-thumb" src="${thumbUrl}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
          <div class="ios-thumb-ph" style="${thumbUrl ? 'display:none' : ''}">${icon}</div>
        </div>
        <div class="ios-req-info"><span class="ios-req-name">${item}</span>${subtitle ? '<span class="ios-req-sub">' + subtitle + '</span>' : ''}</div>
        <div class="ios-req-actions">
          <div class="ios-check-pill${done ? ' ios-check-on' : ''}">${done ? checkSvg : ''}</div>
          ${playAct ? '<button class="ios-play-btn" onclick="' + playAct + '">' + playSvg + '</button>' : '<div class="ios-play-ph"></div>'}
        </div>
      </div>${!isLast ? '<div class="ios-divider"></div>' : ''}`;
    }).join('');
    return `<div class="gr-full-group"><div class="gr-full-group-hdr"><div class="ios-sec-dot" style="background:#e63946"></div><span class="ios-sec-title">${g.title}</span></div><div class="ios-req-card">${rows}</div></div>`;
  }).join('');

  const overlay = document.createElement('div');
  overlay.className = 'gr-full-overlay';
  overlay.id = 'gr-full-overlay';
  overlay.innerHTML = `
    <div class="gr-full-sheet">
      <div class="gr-full-header">
        <div>
          <div class="gr-full-title">${b.label}</div>
          <div class="gr-full-sub">${allDone} of ${allTotal} requirements complete</div>
        </div>
        <button class="gr-full-close" onclick="closeFullRequirements()">&#10005;</button>
      </div>
      <div class="gr-full-progress">
        <div class="gr-full-bar-bg"><div class="gr-full-bar-fill" style="width:${allTotal ? Math.round(allDone/allTotal*100) : 0}%"></div></div>
      </div>
      <div class="gr-full-body">${html}</div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('gr-full-open'));
}

function closeFullRequirements() {
  const ov = document.getElementById('gr-full-overlay');
  if (!ov) return;
  ov.classList.remove('gr-full-open');
  setTimeout(() => {
    ov.remove();
    // Re-render main belt page so group pills, mini-bars and hero all reflect latest ticks
    if (typeof renderBelt === 'function') renderBelt();
  }, 300);
}


function toggleAdultReq(beltId, item, el) {
  const key = beltId + '_' + item;
  beltProgress[key] = !beltProgress[key];
  localStorage.setItem('judo_belt_progress', JSON.stringify(beltProgress));

  const checkSvg = '<svg viewBox="0 0 12 10" width="12" height="10"><polyline points="1,5 4.5,9 11,1" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const pill = el.querySelector('.ios-check-pill');
  if (pill) {
    pill.classList.toggle('ios-check-on', !!beltProgress[key]);
    pill.innerHTML = beltProgress[key] ? checkSvg : '';
  }
  el.classList.toggle('ios-checked', !!beltProgress[key]);

  const b = BELT_DATA.find(b => b.id === beltId);
  if (b) {
    const all  = b.groups.flatMap(g => g.items);
    const done = all.filter(i => beltProgress[beltId + '_' + i]).length;
    const pct  = all.length ? Math.round(done / all.length * 100) : 0;
    const pctColor = pct >= 80 ? '#4ade80' : pct >= 50 ? '#f59e0b' : '#e63946';
    const root  = document.getElementById('belt-tab-content') || document;
    const cnt   = root.querySelector('.ios-reqs-badge');
    const bar   = root.querySelector('.ab-prog-fill');
    const pctEl = root.querySelector('.ab-arrow-pct');
    if (cnt)   cnt.textContent = done + ' / ' + all.length;
    if (bar)  { bar.style.width = pct + '%'; bar.style.background = pctColor; }
    if (pctEl){ pctEl.textContent = pct + '%'; pctEl.style.color = pctColor; }
    // also update View-All overlay's own progress bar if it's open
    const ov = document.getElementById('gr-full-overlay');
    if (ov) {
      const ovFill = ov.querySelector('.gr-full-bar-fill');
      const ovSub  = ov.querySelector('.gr-full-sub');
      if (ovFill) ovFill.style.width = pct + '%';
      if (ovSub)  ovSub.textContent  = done + ' of ' + all.length + ' requirements complete';
    }
    // sync progress view if open
    if (typeof renderProgress === 'function') {
      const pv = document.getElementById('view-progress');
      if (pv && pv.classList.contains('active')) setTimeout(() => renderProgress(), 50);
    }
  }
  showToast(beltProgress[key] ? '✓ Done!' : 'Unticked');
}


function clearGradingPass(beltId) {
  if (!confirm('Remove this grading pass record?')) return;
  const tlKey = BELT_PASS_KEYS[beltId] || beltId;
  const tl    = JSON.parse(localStorage.getItem('judo_belt_timeline') || '[]');
  const idx   = tl.findIndex(t => t.key === tlKey);
  if (idx !== -1) tl.splice(idx, 1);
  localStorage.setItem('judo_belt_timeline', JSON.stringify(tl));
  // Revert current target back to this belt
  setCurrentTargetBeltId(beltId);
  showToast('Pass record removed');
  if (typeof renderBelt     === 'function') renderBelt();
  if (typeof renderHome     === 'function') renderHome();
  if (typeof renderProgress === 'function') renderProgress();
}

function toggleAdultBrowse() {
  const body = document.getElementById('ab-browse-body');
  const chev = document.getElementById('ab-browse-chev');
  if (!body) return;
  const open = body.classList.toggle('open');
  if (chev) chev.innerHTML = open ? '&#9650;' : '&#9660;';
}

// ── ADULT TEST MODE ────────────────────────────────
let adultTestState = null;

function openAdultTestMode(beltId) {
  const b = BELT_DATA.find(b => b.id === beltId);
  if (!b) return;

  const allItems = b.groups.flatMap(g => g.items);
  const unticked = allItems.filter(i => !beltProgress[beltId + '_' + i]);

  if (unticked.length === 0) {
    showToast('&#10003; All ticked &#8212; ready to grade!');
    return;
  }

  adultTestState = { beltId, items: unticked, idx: 0, ticked: 0 };
  renderAdultTestCard();
}

function renderAdultTestCard() {
  const { beltId, items, idx } = adultTestState;
  const item     = items[idx];
  const tech     = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === item) : null;
  const vid      = tech ? getVideoId(tech.url) : null;
  const progPct  = Math.round(idx / items.length * 100);

  let el = document.getElementById('adult-test-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'adult-test-overlay';
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
      <div class="jg-test-emoji">&#129355;</div>
      <div class="jg-test-label">Can you perform this?</div>
      <div class="jg-test-item">${item}</div>
      ${vid ? `<button class="jg-test-watch" onclick="openTechDetail('${esc(item)}')">&#9654; Watch technique</button>` : ''}
      <div class="jg-test-actions">
        <button class="jg-test-no"  onclick="answerAdultTest(false)">&#128517; Not yet</button>
        <button class="jg-test-yes" onclick="answerAdultTest(true)">&#10003; Yes, I can!</button>
      </div>
      <button class="jg-test-stop" onclick="closeAdultTestMode()">Stop for now</button>
    </div>`;
  document.body.style.overflow = 'hidden';
}


function answerAdultTest(knew) {
  const { beltId, items, idx } = adultTestState;
  if (knew) {
    const key = beltId + '_' + items[idx];
    beltProgress[key] = true;
    localStorage.setItem('judo_belt_progress', JSON.stringify(beltProgress));
    adultTestState.ticked++;
  }
  adultTestState.idx++;
  if (adultTestState.idx >= adultTestState.items.length) {
    const ticked = adultTestState.ticked;
    const total  = adultTestState.items.length;
    closeAdultTestMode();
    showToast('&#127881; Done! Ticked ' + ticked + ' / ' + total);
    renderBelt();
  } else {
    renderAdultTestCard();
  }
}

function closeAdultTestMode() {
  const el = document.getElementById('adult-test-overlay');
  if (el) { el.className = 'gp-overlay'; el.innerHTML = ''; }
  document.body.style.overflow = '';
  renderBelt();
}

// ── TERMINOLOGY QUIZ ────────────────────────────────────────────────
let termQuizState = null;

function openTerminologyQuiz(beltId) {
  const b = BELT_DATA.find(b => b.id === beltId);
  if (!b) return;

  // Collect all technique names in this belt that have an English translation
  const allItems = b.groups.flatMap(g => g.items);
  const quizable = allItems
    .map(name => {
      const t = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === name) : null;
      return t && t.en ? { jp: t.name, en: t.en } : null;
    })
    .filter(Boolean);

  if (quizable.length < 2) {
    showToast('Not enough named techniques to quiz on yet!');
    return;
  }

  // Shuffle and cap at 12 questions
  const shuffled = quizable.sort(() => Math.random() - 0.5).slice(0, 12);

  // Build a pool of wrong answers from ALL techniques with en fields
  const wrongPool = (typeof TECHNIQUES !== 'undefined')
    ? TECHNIQUES.filter(t => t.en).map(t => t.en)
    : [];

  termQuizState = {
    beltId,
    questions: shuffled,
    idx: 0,
    correct: 0,
    wrongPool,
  };

  renderTermQuizQuestion();
}

function renderTermQuizQuestion() {
  const { questions, idx, correct, wrongPool } = termQuizState;
  const q = questions[idx];

  // Build 4 options: 1 correct + 3 random wrong ones (not the correct answer)
  const wrongs = wrongPool
    .filter(en => en !== q.en)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [q.en, ...wrongs].sort(() => Math.random() - 0.5);

  const progPct = Math.round(idx / questions.length * 100);

  let el = document.getElementById('term-quiz-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'term-quiz-overlay';
    document.body.appendChild(el);
  }

  el.className = 'gp-overlay open';
  el.innerHTML = `
    <div class="gp-modal tq-modal">
      <div class="jg-test-toprow">
        <div class="jg-test-prog-bar">
          <div class="jg-test-prog-fill" style="width:${progPct}%"></div>
        </div>
        <span class="jg-test-count">${idx + 1}&thinsp;/&thinsp;${questions.length}</span>
      </div>
      <div class="tq-label">What does this mean in English?</div>
      <div class="tq-jp">${q.jp}</div>
      <div class="tq-options">
        ${options.map(opt => `
          <button class="tq-option" onclick="answerTermQuiz('${opt.replace(/'/g,"\\'")}','${q.en.replace(/'/g,"\\'")}',this)">
            ${opt}
          </button>`).join('')}
      </div>
      <button class="jg-test-stop" onclick="closeTerminologyQuiz()">Stop quiz</button>
    </div>`;
  document.body.style.overflow = 'hidden';
}

function answerTermQuiz(chosen, correct, btn) {
  // Disable all buttons immediately
  const overlay = document.getElementById('term-quiz-overlay');
  overlay.querySelectorAll('.tq-option').forEach(b => {
    b.disabled = true;
    if (b.textContent.trim() === correct) b.classList.add('tq-correct');
  });

  const isRight = chosen === correct;
  if (isRight) {
    btn.classList.add('tq-correct');
    termQuizState.correct++;
  } else {
    btn.classList.add('tq-wrong');
  }

  // Advance after short delay
  setTimeout(() => {
    termQuizState.idx++;
    if (termQuizState.idx >= termQuizState.questions.length) {
      const score  = termQuizState.correct;
      const total  = termQuizState.questions.length;
      const pct    = Math.round(score / total * 100);
      const emoji  = pct === 100 ? '🏆' : pct >= 70 ? '💪' : '📚';
      closeTerminologyQuiz();
      // Show score card
      let el = document.getElementById('term-quiz-overlay');
      if (!el) { el = document.createElement('div'); el.id = 'term-quiz-overlay'; document.body.appendChild(el); }
      el.className = 'gp-overlay open';
      el.innerHTML = `
        <div class="gp-modal tq-modal">
          <div class="tq-score-emoji">${emoji}</div>
          <div class="tq-score-title">${score} / ${total}</div>
          <div class="tq-score-sub">${pct === 100 ? 'Perfect — you know them all!' : pct >= 70 ? 'Great work! Keep drilling the ones you missed.' : 'Keep practising — the names will stick!'}</div>
          <button class="ab-quiz-btn" style="margin-top:16px;width:100%" onclick="openTerminologyQuiz('${termQuizState.beltId}')">&#127257; Try again</button>
          <button class="jg-test-stop" onclick="closeTerminologyQuiz()">Done</button>
        </div>`;
      document.body.style.overflow = 'hidden';
    } else {
      renderTermQuizQuestion();
    }
  }, 900);
}

function closeTerminologyQuiz() {
  const el = document.getElementById('term-quiz-overlay');
  if (el) el.className = 'gp-overlay';
  document.body.style.overflow = '';
}


// ── BLACK BELT ACHIEVEMENT VIEW ──────────────────────────────────
function renderBlackBeltAchieved() {
  document.getElementById('belt-tab-content').innerHTML = `
    <div class="bb-achieved">
      <div class="bb-ach-stars">✦ ✦ ✦</div>
      <div class="bb-ach-belt">
        <svg viewBox="0 0 320 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:300px">
          <rect x="0" y="28" width="320" height="34" rx="6" fill="#111"/>
          <rect x="130" y="18" width="60" height="54" rx="5" fill="#1a1a1a" stroke="#333" stroke-width="1.5"/>
          <rect x="140" y="24" width="40" height="42" rx="3" fill="#0d0d0d" stroke="#444" stroke-width="1"/>
          <text x="160" y="52" text-anchor="middle" fill="#c9a84c" font-size="11" font-weight="bold" font-family="serif" letter-spacing="2">黒帯</text>
          <rect x="0" y="28" width="130" height="3" rx="1" fill="#2a2a2a"/>
          <rect x="190" y="28" width="130" height="3" rx="1" fill="#2a2a2a"/>
          <rect x="0" y="55" width="130" height="3" rx="1" fill="#2a2a2a"/>
          <rect x="190" y="55" width="130" height="3" rx="1" fill="#2a2a2a"/>
        </svg>
      </div>
      <div class="bb-ach-title">Black Belt Achieved</div>
      <div class="bb-ach-sub">1st Dan &nbsp;·&nbsp; Shodan</div>
      <div class="bb-ach-divider"></div>
      <div class="bb-ach-msg">
        You've completed the full Kyu Grade journey.<br>
        Every technique mastered, every grading passed.<br>
        <strong>Osu.</strong>
      </div>
      <div class="bb-moral-title">The Judo Moral Code</div>
      <div class="bb-moral-grid">
        <div class="bb-moral-item"><span class="bb-moral-jp">礼</span><span>Courtesy</span></div>
        <div class="bb-moral-item"><span class="bb-moral-jp">勇</span><span>Courage</span></div>
        <div class="bb-moral-item"><span class="bb-moral-jp">誠</span><span>Honesty</span></div>
        <div class="bb-moral-item"><span class="bb-moral-jp">名誉</span><span>Honour</span></div>
        <div class="bb-moral-item"><span class="bb-moral-jp">謙</span><span>Modesty</span></div>
        <div class="bb-moral-item"><span class="bb-moral-jp">尊重</span><span>Respect</span></div>
        <div class="bb-moral-item"><span class="bb-moral-jp">制</span><span>Self-control</span></div>
        <div class="bb-moral-item"><span class="bb-moral-jp">友</span><span>Friendship</span></div>
      </div>
    </div>
  `;
  el.innerHTML = html;
}
