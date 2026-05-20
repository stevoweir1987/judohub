/* ═══════════════════════════════════════════════════════
   TECHNIQUE DETAIL PANEL  — Phase 4
   Full-screen slide-up: video + coaching depth + notes
   ═══════════════════════════════════════════════════════ */

var tdpCurrentTech = null;

function openTechDetail(name) {
  let t = (typeof TECHNIQUES !== 'undefined')
    ? TECHNIQUES.find(x => x.name === name)
    : null;
  // Fall back to GRADING_VIDEOS for combination/grading-only techniques
  if (!t && typeof GRADING_VIDEOS !== 'undefined' && GRADING_VIDEOS[name]) {
    t = { name: name, url: GRADING_VIDEOS[name], en: '', cat: 'Grading', sub: '', ko: 'No' };
  }
  if (!t) return;

  tdpCurrentTech = t;

  // ── Kodokan badge ──
  const kodo = document.getElementById('tdp-kodokan');
  if (kodo) {
    if (t.ko === 'Yes') { kodo.textContent = '★ Kodokan'; kodo.classList.add('show'); }
    else kodo.classList.remove('show');
  }

  // ── Video ──
  const videoEl = document.getElementById('tdp-video');
  if (videoEl) {
    const vid = _tdpVid(t.url);
    if (vid) {
      const start = _tdpStart(t.url);
      const sp = start ? '&start=' + start : '';
      videoEl.innerHTML = '<iframe src="https://www.youtube.com/embed/' + vid + '?rel=0&autoplay=1' + sp + '" allowfullscreen allow="autoplay;encrypted-media"></iframe>';
    } else {
      videoEl.innerHTML = '<div class="tdp-video-placeholder">🥋</div>';
    }
  }

  // ── Body ──
  const bodyEl = document.getElementById('tdp-body');
  if (bodyEl) bodyEl.innerHTML = _tdpBody(t);

  // ── Wire notes ──
  const ta = document.getElementById('tdp-notes');
  if (ta) {
    ta.value = (typeof techNotes !== 'undefined' && techNotes[t.name]) || '';
    ta.addEventListener('input', function() {
      if (typeof techNotes !== 'undefined') {
        techNotes[t.name] = this.value;
        localStorage.setItem('judo_tech_notes', JSON.stringify(techNotes));
      }
    });
  }

  // ── Open panel ──
  const panel = document.getElementById('tech-detail-panel');
  if (panel) {
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeTechDetail() {
  const panel = document.getElementById('tech-detail-panel');
  if (panel) panel.classList.remove('open');
  // Kill video to stop audio
  const videoEl = document.getElementById('tdp-video');
  if (videoEl) videoEl.innerHTML = '';
  document.body.style.overflow = '';
  tdpCurrentTech = null;
}

function _tdpVid(url) {
  if (!url) return null;
  const shorts = url.match(/\/shorts\/([a-zA-Z0-9_-]{6,12})/);
  if (shorts) return shorts[1];
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,12})/);
  if (short) return short[1];
  const m = url.match(/[?&]v=([^&]+)/);
  return m ? m[1] : null;
}

function _tdpStart(url) {
  if (!url) return null;
  const m = url.match(/[?&]t=(\d+)/);
  return m ? parseInt(m[1]) : null;
}

function _tdpBeltPill(name) {
  if (typeof BELT_TECHNIQUES === 'undefined') return '';
  const order = [
    {id:'toRed',    label:'Red',    color:'#e74c3c'},
    {id:'toYellow', label:'Yellow', color:'#c8a800'},
    {id:'toOrange', label:'Orange', color:'#d97706'},
    {id:'toGreen',  label:'Green',  color:'#16a34a'},
    {id:'toBlue',   label:'Blue',   color:'#2563eb'},
    {id:'toBrown',  label:'Brown',  color:'#92400e'},
  ];
  const lower = name.toLowerCase();
  for (const b of order) {
    const list = BELT_TECHNIQUES[b.id] || [];
    if (list.some(n => n.toLowerCase() === lower)) {
      return '<span class="tc-belt-pill" style="background:' + b.color + '22;color:' + b.color + ';border-color:' + b.color + '44">' + b.label + ' Belt · Required</span>';
    }
  }
  return '';
}

function _tdpBody(t) {
  const depth = (typeof TECH_DEPTH !== 'undefined') ? TECH_DEPTH[t.name] : null;
  const beltPill = _tdpBeltPill(t.name);
  const catPill  = (t.sub || t.cat)
    ? '<span class="tc-cat-pill">' + (t.sub || t.cat) + '</span>'
    : '';

  // Coaching hook — first sentence of comp
  let hook = '';
  if (depth && depth.comp) {
    const s = depth.comp.split('. ')[0] + '.';
    hook = s.length < 130 ? s : s.slice(0, 127) + '…';
  }

  const li = arr => arr.map(x => '<li>' + x + '</li>').join('');

  return `
    <div class="tdp-pills">
      ${beltPill || catPill}
    </div>
    <div class="tdp-name">${t.name}</div>
    ${t.en ? '<div class="tdp-en">' + t.en + '</div>' : ''}
    ${hook ? '<div class="tdp-hook">' + hook + '</div>' : ''}

    ${depth ? `
      ${depth.grips ? `
        <div class="tdp-section">
          <div class="tdp-section-label">🤝 Grips &amp; Setup</div>
          <div class="tdp-section-text">${depth.grips}</div>
        </div>
        <div class="tdp-divider"></div>` : ''}

      ${depth.mistakes && depth.mistakes.length ? `
        <div class="tdp-section">
          <div class="tdp-section-label">❌ Common Mistakes</div>
          <ul class="tdp-list">${li(depth.mistakes)}</ul>
        </div>
        <div class="tdp-divider"></div>` : ''}

      ${depth.combos && depth.combos.length ? `
        <div class="tdp-section">
          <div class="tdp-section-label">🔗 Works Well With</div>
          <ul class="tdp-list">${li(depth.combos)}</ul>
        </div>
        <div class="tdp-divider"></div>` : ''}

      ${depth.counters && depth.counters.length ? `
        <div class="tdp-section">
          <div class="tdp-section-label">⚡ Counters</div>
          <ul class="tdp-list">${li(depth.counters)}</ul>
        </div>
        <div class="tdp-divider"></div>` : ''}

      ${depth.comp ? `
        <div class="tdp-section">
          <div class="tdp-section-label">🏆 When To Use</div>
          <div class="tdp-section-text">${depth.comp}</div>
        </div>
        <div class="tdp-divider"></div>` : ''}
    ` : '<div class="tdp-empty">No coaching data yet for this technique.</div><div class="tdp-divider"></div>'}

    <div class="tdp-section">
      <div class="tdp-section-label">📝 My Notes</div>
      <textarea class="tdp-notes-ta" id="tdp-notes" placeholder="Personal cues, timing, what works for you…"></textarea>
    </div>

    <button class="tdp-add-btn" onclick="tdpAddToPlan()">+ Add to this week's plan</button>
  `;
}

function tdpAddToPlan() {
  if (!tdpCurrentTech) return;
  if (typeof addTechToPlan === 'function') {
    addTechToPlan(tdpCurrentTech.name);
  }
}

// Close on back button / swipe
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const panel = document.getElementById('tech-detail-panel');
    if (panel && panel.classList.contains('open')) closeTechDetail();
  }
});
