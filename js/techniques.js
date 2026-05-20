let activeTechBelt = '';
let expandedTechCat = null;

// ── HELPERS ────────────────────────────────────────
function getVideoId(url) {
  if (!url) return null;
  // YouTube Shorts: /shorts/VIDEO_ID
  const shorts = url.match(/\/shorts\/([a-zA-Z0-9_-]{6,12})/);
  if (shorts && shorts[1]) return shorts[1];
  // youtu.be/VIDEO_ID (with optional ?t= timestamp)
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,12})/);
  if (short && short[1]) return short[1];
  // Standard: ?v= or &v=
  const m = url.match(/[?&]v=([^&]+)/);
  return (m && m[1]) ? m[1] : null;
}
function getVideoStart(url) {
  if (!url) return null;
  const m = url.match(/[?&]t=(\d+)/);
  return m ? parseInt(m[1]) : null;
}
function safeId(name) { return name.replace(/[^a-z0-9]/gi, '_'); }
function esc(s) { return s.replace(/'/g, "\\'"); }

// Belt dot colours & labels
const BELT_DOT_META = {
  toRed:    { color: '#c0392b', label: 'Red Belt grading'    },
  toYellow: { color: '#f1c40f', label: 'Yellow Belt grading' },
  toOrange: { color: '#e67e22', label: 'Orange Belt grading' },
  toGreen:  { color: '#27ae60', label: 'Green Belt grading'  },
  toBlue:   { color: '#2980b9', label: 'Blue Belt grading'   },
  toBrown:  { color: '#795548', label: 'Brown Belt grading'  },
};

function getBeltDotsHtml(techName) {
  // kept for backwards compat — now delegates to pill
  return '';
}

// Returns the LOWEST belt that requires this technique, as a styled pill
function getBeltRelevancePill(techName) {
  if (typeof BELT_TECHNIQUES === 'undefined') return '';
  const beltOrder = [
    {id:'toRed',    label:'Red',    color:'#e74c3c'},
    {id:'toYellow', label:'Yellow', color:'#c8a800'},
    {id:'toOrange', label:'Orange', color:'#d97706'},
    {id:'toGreen',  label:'Green',  color:'#16a34a'},
    {id:'toBlue',   label:'Blue',   color:'#2563eb'},
    {id:'toBrown',  label:'Brown',  color:'#92400e'},
  ];
  const lower = techName.toLowerCase();
  for (const b of beltOrder) {
    const list = BELT_TECHNIQUES[b.id] || [];
    if (list.some(n => n.toLowerCase() === lower)) {
      return `<span class="tc-belt-pill" style="background:${b.color}22;color:${b.color};border-color:${b.color}44">${b.label} Belt · Required</span>`;
    }
  }
  return '';
}

// Returns a one-line coaching hook from TECH_DEPTH
function getCoachingHook(techName) {
  if (typeof TECH_DEPTH === 'undefined' || !TECH_DEPTH[techName]) return '';
  const d = TECH_DEPTH[techName];
  // Use comp as the hook — it's the most motivating sentence
  if (d.comp) {
    const sentence = d.comp.split('. ')[0] + '.';
    return sentence.length < 120 ? sentence : sentence.slice(0, 117) + '…';
  }
  return '';
}


// ── TECHNIQUE DEPTH RENDERER ──────────────────────────────
function renderTechDepth(depth, compact=false) {
  if (!depth) return '';
  const listItems = arr => arr.map(x => `<li>${x}</li>`).join('');
  if (compact) {
    // modal sidebar — slightly more compressed
    return `
      <div class="tech-depth compact">
        ${depth.grips ? `<div class="td-section"><div class="td-label">🤝 Key Grips</div><div class="td-text">${depth.grips}</div></div>` : ''}
        ${depth.mistakes && depth.mistakes.length ? `<div class="td-section"><div class="td-label">❌ Common Mistakes</div><ul class="td-list">${listItems(depth.mistakes)}</ul></div>` : ''}
        ${depth.combos && depth.combos.length ? `<div class="td-section"><div class="td-label">🔗 Combinations</div><ul class="td-list">${listItems(depth.combos)}</ul></div>` : ''}
        ${depth.counters && depth.counters.length ? `<div class="td-section"><div class="td-label">⚡ Counters</div><ul class="td-list">${listItems(depth.counters)}</ul></div>` : ''}
        ${depth.comp ? `<div class="td-section"><div class="td-label">🏆 Competition</div><div class="td-text">${depth.comp}</div></div>` : ''}
      </div>`;
  }
  return `
    <div class="tech-depth">
      ${depth.grips ? `<div class="td-section"><div class="td-label">🤝 Key Grips</div><div class="td-text">${depth.grips}</div></div>` : ''}
      ${depth.mistakes && depth.mistakes.length ? `<div class="td-section"><div class="td-label">❌ Common Mistakes</div><ul class="td-list">${listItems(depth.mistakes)}</ul></div>` : ''}
      ${depth.combos && depth.combos.length ? `<div class="td-section"><div class="td-label">🔗 Combinations</div><ul class="td-list">${listItems(depth.combos)}</ul></div>` : ''}
      ${depth.counters && depth.counters.length ? `<div class="td-section"><div class="td-label">⚡ Counters</div><ul class="td-list">${listItems(depth.counters)}</ul></div>` : ''}
      ${depth.comp ? `<div class="td-section"><div class="td-label">🏆 Competition</div><div class="td-text">${depth.comp}</div></div>` : ''}
    </div>`;
}

// ── FILTER & RENDER ────────────────────────────────
function filterTechniques() { renderTechGrid(); }

function currentFilter() {
  const q = (document.getElementById('tech-search') || {}).value || '';
  // Belt filter
  const beltNames = (typeof BELT_TECHNIQUES !== 'undefined' && activeTechBelt)
    ? (BELT_TECHNIQUES[activeTechBelt] || [])
    : null;
  return TECHNIQUES.filter(t => {
    const mq = !q || t.name.toLowerCase().includes(q.toLowerCase()) || (t.en||'').toLowerCase().includes(q.toLowerCase());
    const mb = !beltNames || beltNames.some(n => n.toLowerCase() === t.name.toLowerCase());
    return mq && mb;
  });
}

function renderTechGrid() {
  const filtered = currentFilter();
  const q = (document.getElementById('tech-search') || {}).value || '';
  document.getElementById('tech-count').textContent = filtered.length + ' techniques';
  // Use accordion view when no search/filter active
  if (!q) {
    document.getElementById('tech-grid').innerHTML = renderTechAccordion(filtered);
    return;
  }
  document.getElementById('tech-grid').innerHTML = filtered.map(t => techCard(t)).join('');
  filtered.forEach(t => {
    const ta = document.getElementById('note-' + safeId(t.name));
    if (ta) {
      ta.value = techNotes[t.name] || '';
      ta.addEventListener('input', function() {
        techNotes[t.name] = this.value;
        localStorage.setItem('judo_tech_notes', JSON.stringify(techNotes));
      });
    }
  });
}

function techCard(t) {
  const vid      = getVideoId(t.url);
  const isExp    = expandedTech === t.name;
  const safeName = esc(t.name);
  const thumbUrl = vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : null;
  const beltPill = getBeltRelevancePill(t.name);
  const hook     = getCoachingHook(t.name);
  const depth    = (typeof TECH_DEPTH !== 'undefined') ? TECH_DEPTH[t.name] : null;

  const catLabel = t.sub || t.cat || '';

  return `<div class="tech-card tc-coach${isExp?' expanded':''}" id="tc-${safeId(t.name)}" onclick="openTechDetail('${safeName}')">

  <!-- VIDEO THUMBNAIL — first, dominant -->
  <div class="tc-thumb-wrap">
    ${thumbUrl
      ? `<img class="tc-thumb-img" src="${thumbUrl}" alt="${t.name}" loading="lazy">`
      : `<div class="tc-thumb-empty"><span>🥋</span></div>`}
    ${vid
      ? `<button class="tc-thumb-play" onclick="event.stopPropagation();openTechDetail('${safeName}')">&#9654;</button>`
      : ''}
    ${t.ko === 'Yes' ? `<span class="tc-kodokan-badge">Kodokan</span>` : ''}
  </div>

  <!-- CARD BODY -->
  <div class="tc-body">
    <div class="tc-header-row">
      <div style="flex:1;min-width:0">
        ${beltPill || (catLabel ? `<span class="tc-cat-pill">${catLabel}</span>` : '')}
        <div class="tc-name">${t.name}</div>
        ${t.en ? `<div class="tc-en">${t.en}</div>` : ''}
        ${hook ? `<div class="tc-hook">${hook}</div>` : ''}
      </div>
      <span class="tc-chevron${isExp?' tc-chevron-open':''}">&#8964;</span>
    </div>

    <!-- EXPANDED COACHING SECTIONS -->
    ${isExp && depth ? `
    <div class="tc-depth" onclick="event.stopPropagation()">
      ${depth.grips ? `
        <div class="tc-section">
          <div class="tc-section-label">&#129310; Grips &amp; Setup</div>
          <div class="tc-section-text">${depth.grips}</div>
        </div>` : ''}
      ${depth.mistakes && depth.mistakes.length ? `
        <div class="tc-section">
          <div class="tc-section-label">&#10060; Common Mistakes</div>
          <ul class="tc-list">${depth.mistakes.map(x=>`<li>${x}</li>`).join('')}</ul>
        </div>` : ''}
      ${depth.combos && depth.combos.length ? `
        <div class="tc-section">
          <div class="tc-section-label">&#128279; Works Well With</div>
          <ul class="tc-list">${depth.combos.map(x=>`<li>${x}</li>`).join('')}</ul>
        </div>` : ''}
      ${depth.counters && depth.counters.length ? `
        <div class="tc-section">
          <div class="tc-section-label">&#9889; Counters</div>
          <ul class="tc-list">${depth.counters.map(x=>`<li>${x}</li>`).join('')}</ul>
        </div>` : ''}
      ${depth.comp ? `
        <div class="tc-section">
          <div class="tc-section-label">&#127942; When To Use</div>
          <div class="tc-section-text">${depth.comp}</div>
        </div>` : ''}
      <div class="tc-section">
        <div class="tc-section-label">&#128221; My Notes</div>
        <textarea class="tech-notes-ta" id="note-${safeId(t.name)}" placeholder="Personal cues, timing, what works for you…" onclick="event.stopPropagation()"></textarea>
      </div>
      <button class="add-to-plan-btn" onclick="event.stopPropagation();addTechToPlan('${safeName}')">+ Add to this week&apos;s plan</button>
    </div>` : ''}
    ${isExp && !depth ? `
    <div class="tc-depth" onclick="event.stopPropagation()">
      <div class="tc-section">
        <div class="tc-section-label">&#128221; My Notes</div>
        <textarea class="tech-notes-ta" id="note-${safeId(t.name)}" placeholder="Personal cues, timing, what works for you…" onclick="event.stopPropagation()"></textarea>
      </div>
      <button class="add-to-plan-btn" onclick="event.stopPropagation();addTechToPlan('${safeName}')">+ Add to this week&apos;s plan</button>
    </div>` : ''}
  </div>
</div>`;
}

function toggleTech(e, name) {
  if (['TEXTAREA','BUTTON','INPUT'].includes(e.target.tagName)) return;
  expandedTech = (expandedTech === name) ? null : name;
  // Re-render whichever grid is currently visible
  const trGrid = document.getElementById('tr-tech-grid');
  if (trGrid && trGrid.querySelector('.tc-coach')) {
    if (typeof filterTrainTech === 'function') filterTrainTech();
  } else {
    renderTechGrid();
  }
  if (expandedTech) {
    setTimeout(() => {
      const el = document.getElementById('tc-' + safeId(name));
      if (el) el.scrollIntoView({behavior:'smooth', block:'nearest'});
    }, 40);
  }
}

function addTechToPlan(name) {
  const key = weekKey(currentWeekOffset);
  if (!weekPlans[key]) weekPlans[key] = {Mon:[],Tue:[],Wed:[],Thu:[],Fri:[],Sat:[],Sun:[]};
  const day = DAYS.reduce((a,b) => (weekPlans[key][a]||[]).length <= (weekPlans[key][b]||[]).length ? a : b);
  weekPlans[key][day].push({id:Date.now(), text:name, custom:false});
  saveWeek();
  showToast('Added "' + name + '" to ' + day);
  if (document.getElementById('view-builder').classList.contains('active')) renderWeek();
}

// ── VIDEO MODAL ────────────────────────────────────
function openModal(name) {
  modalList = currentFilter().filter(t => getVideoId(t.url));
  modalIdx  = modalList.findIndex(t => t.name === name);
  if (modalIdx < 0) {
    modalList = TECHNIQUES.filter(t => getVideoId(t.url));
    modalIdx  = modalList.findIndex(t => t.name === name);
  }
  if (modalIdx < 0) return;
  paintModal();
  document.getElementById('video-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  flushModalNotes();
  document.getElementById('vm-player').innerHTML = '';
  document.getElementById('video-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function onModalBgClick(e) {
  if (e.target === document.getElementById('video-modal')) closeVideoModal();
}

function modalNav(dir) {
  flushModalNotes();
  modalIdx = Math.max(0, Math.min(modalList.length - 1, modalIdx + dir));
  paintModal();
}

function paintModal() {
  const t   = modalList[modalIdx];
  const vid = getVideoId(t.url);
  const n   = modalList.length;

  document.getElementById('vm-title').textContent    = t.name;
  document.getElementById('vm-subtitle').textContent = t.en || '';
  document.getElementById('vm-counter').textContent  = (modalIdx + 1) + ' / ' + n;
  document.getElementById('vm-prev').disabled = modalIdx === 0;
  document.getElementById('vm-next').disabled = modalIdx === n - 1;

  const player = document.getElementById('vm-player');
  if (vid) {
    const start = getVideoStart(t.url);
    const startParam = start ? '&start=' + start : '';
    player.innerHTML = '<iframe src="https://www.youtube.com/embed/' + vid + '?rel=0&autoplay=1' + startParam + '" allowfullscreen allow="autoplay; encrypted-media" style="width:100%;height:100%;border:none;display:block;"></iframe>';
  } else {
    player.innerHTML = '<div class="vmodal-novideo"><span>\u25b6</span><span>No video for this technique</span></div>';
  }

  const subTag = t.sub  ? '<span class="tag sub" style="display:inline-block;margin:2px">' + t.sub + '</span>' : '';
  const catTag = t.cat && !['Combination','Ne-waza','Grading'].includes(t.cat) ? '<span class="tag cat" style="display:inline-block;margin:2px">' + t.cat + '</span>' : '';

  const depth = (typeof TECH_DEPTH !== 'undefined') ? TECH_DEPTH[t.name] : null;
  const vmTags  = document.getElementById('vm-tags');  if (vmTags)  vmTags.innerHTML  = subTag + catTag;
  const vmDepth = document.getElementById('vm-depth'); if (vmDepth) vmDepth.innerHTML = depth ? renderTechDepth(depth, true) : '';

  const notesEl = document.getElementById('vm-notes');
  if (notesEl) {
    notesEl.value = techNotes[t.name] || '';
    notesEl.oninput = function() {
      techNotes[t.name] = this.value;
      localStorage.setItem('judo_tech_notes', JSON.stringify(techNotes));
      const inlineEl = document.getElementById('note-' + safeId(t.name));
      if (inlineEl) inlineEl.value = this.value;
    };
  }
}

function flushModalNotes() {
  const notesEl = document.getElementById('vm-notes');
  if (notesEl && modalList[modalIdx]) {
    techNotes[modalList[modalIdx].name] = notesEl.value;
    localStorage.setItem('judo_tech_notes', JSON.stringify(techNotes));
  }
}

function addCurrentToPlan() {
  const t = modalList[modalIdx];
  if (t) addTechToPlan(t.name);
}

document.addEventListener('keydown', e => {
  const modal = document.getElementById('video-modal');
  if (!modal || !modal.classList.contains('open')) return;
  if (e.key === 'Escape')                              { closeVideoModal(); return; }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { flushModalNotes(); modalNav(1);  }
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { flushModalNotes(); modalNav(-1); }
});

// ── GRADING VIDEO OPENER ─────────────────────────────────────────
// Uses the existing video-modal so the UI is identical to technique videos
function openGradingVideo(url, title) {
  // Route through openTechDetail
  if (typeof openTechDetail === 'function') {
    const found = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === title) : null;
    if (found) { openTechDetail(title); return; }
    // Synthetic entry for grading-only techniques
    const synth = { name: title, url: url, en: 'Grading technique', cat: 'Grading', sub: '', ko: 'No' };
    if (typeof TECHNIQUES !== 'undefined') TECHNIQUES.push(synth);
    openTechDetail(title);
    setTimeout(function() {
      if (typeof TECHNIQUES !== 'undefined') {
        const idx = TECHNIQUES.findIndex(t => t.name === title && t.en === 'Grading technique');
        if (idx > -1) TECHNIQUES.splice(idx, 1);
      }
    }, 500);
  }
}

/* ─────────────────────────────────────────────────────────────
   TECHNIQUES ACCORDION VIEW
   ───────────────────────────────────────────────────────────── */

const TECH_CAT_META = {
  'Te-waza':          { en: 'Hand Techniques',   icon: 'hand'     },
  'Koshi-waza':       { en: 'Hip Techniques',    icon: 'hip'      },
  'Ashi-waza':        { en: 'Foot & Leg',        icon: 'foot'     },
  'Ma-sutemi-waza':   { en: 'Rear Sacrifice',    icon: 'sacrifice'},
  'Yoko-sutemi-waza': { en: 'Side Sacrifice',    icon: 'sacrifice'},
  'Makikomi-waza':    { en: 'Winding Throws',    icon: 'wind'     },
  'Kaeshi-waza':      { en: 'Counter Techniques',icon: 'counter'  },
  'Osaekomi-waza':    { en: 'Hold Downs',        icon: 'hold'     },
  'Shime-waza':       { en: 'Strangles',         icon: 'choke'    },
  'Kansetsu-waza':    { en: 'Joint Locks',       icon: 'joint'    },
  'Combination':      { en: 'Combinations',      icon: 'combo'    },
  'Drills':           { en: 'Drills & Training', icon: 'drill'    },
  'Ukemi':            { en: 'Ukemi (Breakfalls)', icon: 'ukemi'   },
  'Tips':             { en: 'Judo Tips',         icon: 'tip'      },
};

const JUDO_SVG = `<svg viewBox="0 0 40 40" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="28" cy="7" r="4" fill="currentColor" opacity=".9"/>
  <circle cx="13" cy="8" r="4" fill="currentColor" opacity=".6"/>
  <path d="M20 15 C16 13 10 16 9 22 L8 30 L14 30 L15 24 L18 27 L22 30 L27 30 L22 22 Z" fill="currentColor" opacity=".7"/>
  <path d="M22 14 C26 12 32 15 33 21 L34 30 L28 30 L27 24 L24 27 L20 24 Z" fill="currentColor" opacity=".9"/>
</svg>`;


function renderTechAccordion(techniques) {
  // Group by sub, preserving order
  const ORDER = ['Te-waza','Koshi-waza','Ashi-waza','Ma-sutemi-waza','Yoko-sutemi-waza',
                 'Makikomi-waza','Kaeshi-waza','Osaekomi-waza','Shime-waza','Kansetsu-waza',
                 'Combination','Drills','Ukemi','Tips'];
  const groups = {};
  ORDER.forEach(k => { groups[k] = []; });
  techniques.forEach(t => {
    const key = t.sub || t.cat || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  return Object.entries(groups)
    .filter(([, techs]) => techs.length > 0)
    .map(([sub, techs]) => {
      const meta    = TECH_CAT_META[sub] || { en: sub, icon: 'hand' };
      const isOpen  = expandedTechCat === sub;
      const withVid = techs.filter(t => getVideoId(t.url)).length;

      const rows = isOpen ? techs.map(t => {
        const vid   = getVideoId(t.url);
        const thumb = vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : null;
        const safeName = esc(t.name);
        return `
          <div class="tac-row" onclick="openTechDetail('${safeName}')">
            <div class="tac-row-thumb">
              ${thumb
                ? `<img src="${thumb}" class="tac-row-img" loading="lazy" onerror="this.style.display='none'">`
                : `<div class="tac-row-ph">${JUDO_SVG}</div>`}
            </div>
            <div class="tac-row-info">
              <div class="tac-row-name">${t.name}</div>
              ${t.en ? `<div class="tac-row-en">${t.en}</div>` : ''}
            </div>
            <div class="tac-row-actions">
              ${vid ? `<button class="tac-play-btn" onclick="event.stopPropagation();openTechDetail('${safeName}')">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
              </button>` : ''}
            </div>
          </div>`;
      }).join('') : '';

      return `
        <div class="tac-card${isOpen ? ' tac-open' : ''}" id="tac-${sub.replace(/[^a-z]/gi,'_')}" onclick="toggleTechCat('${sub}')">
          <div class="tac-header">
            <div class="tac-icon">${JUDO_SVG}</div>
            <div class="tac-meta">
              <div class="tac-name">${sub}</div>
              <div class="tac-sub">${meta.en} · ${techs.length} techniques${withVid ? ` · ${withVid} videos` : ''}</div>
            </div>
            <div class="tac-chev">${isOpen ? '▲' : '▼'}</div>
          </div>
          ${isOpen ? `<div class="tac-body">${rows}</div>` : ''}
        </div>`;
    }).join('');
}

function toggleTechCat(sub) {
  expandedTechCat = (expandedTechCat === sub) ? null : sub;
  renderTechGrid();
  if (expandedTechCat) {
    setTimeout(() => {
      const el = document.getElementById('tac-' + sub.replace(/[^a-z]/gi,'_'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}


function selectTechBelt(btn, belt) {
  activeTechBelt = belt;
  document.querySelectorAll('.tbc').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  // Preserve scroll position, keep categories open
  const vb = document.querySelector('#view-techniques .view-body');
  const sc = vb ? vb.scrollTop : 0;
  renderTechGrid();
  if (vb) requestAnimationFrame(() => { vb.scrollTop = sc; });
}

/* ── Video modal info toggle ─────────────────────────────────── */
function toggleVModalInfo() {
  const panel = document.getElementById('vm-info-panel');
  const label = document.getElementById('vm-handle-label');
  if (!panel) return;
  const open = panel.style.display === 'none';
  panel.style.display = open ? '' : 'none';
  if (label) label.innerHTML = open ? '&#8681; Close' : '&#8679; Notes &amp; Info';
}
