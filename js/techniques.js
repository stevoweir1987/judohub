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
  if (typeof BELT_TECHNIQUES === 'undefined') return '';
  const dots = Object.entries(BELT_TECHNIQUES)
    .filter(([, names]) => names.includes(techName))
    .map(([id]) => {
      const m = BELT_DOT_META[id];
      return m ? `<span class="tech-belt-dot" style="background:${m.color}" title="${m.label}"></span>` : '';
    }).join('');
  return dots ? `<div class="tech-belt-dots">${dots}</div>` : '';
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
  const catTag   = t.cat && !['Combination','Ne-waza'].includes(t.cat) ? `<span class="tag cat">${t.cat}</span>` : '';
  const combTag  = t.cat === 'Combination' ? `<span class="tag cat">Combo</span>` : '';
  const neTag    = t.cat === 'Ne-waza' ? `<span class="tag sub">${t.sub||'Ne-waza'}</span>` : '';
  const subTag   = t.sub && t.cat !== 'Ne-waza' ? `<span class="tag sub">${t.sub}</span>` : '';
  const koTag    = t.ko === 'Yes' ? `<span class="tag ko">Kodokan</span>` : '';

  const thumbUrl = vid
    ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg`
    : null;

  return `<div class="tech-card${isExp?' expanded':''}" id="tc-${safeId(t.name)}" onclick="toggleTech(event,'${safeName}')">

  <!-- THUMBNAIL -->
  <div class="tech-thumb${vid ? '' : ' tech-thumb-novid'}">
    ${thumbUrl
      ? `<img class="tech-thumb-img" src="${thumbUrl}" alt="${t.name}" loading="lazy">`
      : `<div class="tech-thumb-placeholder">🥋</div>`}
    ${vid
      ? `<button class="tech-thumb-play" onclick="event.stopPropagation();openModal('${safeName}')" title="Watch ${t.name}">▶</button>`
      : `<div class="tech-thumb-novid-label">No video</div>`}
    ${t.ko === 'Yes' ? `<span class="tech-thumb-badge">Kodokan</span>` : ''}
  </div>

  <!-- INFO -->
  <div class="tech-card-info">
    <div class="tech-card-top">
      <div style="flex:1;min-width:0">
        <div class="tech-name">${t.name}</div>
        ${t.en ? `<div class="tech-en">${t.en}</div>` : ''}
        <div class="tech-tags" style="margin-top:6px">${subTag}${catTag}${combTag}${neTag}</div>
        ${getBeltDotsHtml(t.name)}
      </div>
      <span class="tech-chevron">⌄</span>
    </div>
  </div>

  <!-- EXPANDED BODY -->
  <div class="tech-body">
    ${(typeof TECH_DEPTH !== 'undefined' && TECH_DEPTH[t.name]) ? renderTechDepth(TECH_DEPTH[t.name]) : ''}
    <div class="td-notes-label">My Notes</div>
    <textarea class="tech-notes-ta" id="note-${safeId(t.name)}" placeholder="Personal cues, things to work on, common mistakes…" onclick="event.stopPropagation()"></textarea>
    <button class="add-to-plan-btn" onclick="event.stopPropagation();addTechToPlan('${safeName}')">+ Add to this week's plan</button>
  </div>
</div>`;
}

function toggleTech(e, name) {
  if (['TEXTAREA','BUTTON','INPUT'].includes(e.target.tagName)) return;
  expandedTech = (expandedTech === name) ? null : name;
  renderTechGrid();
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
  if (!getVideoId(url)) return;
  // Inject a synthetic entry so paintModal can render it normally
  modalList = [{ name: title, url: url, en: 'Grading technique', cat: 'Grading', sub: '' }];
  modalIdx  = 0;
  paintModal();
  document.getElementById('video-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
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
          <div class="tac-row" onclick="toggleTech(event,'${safeName}')">
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
              ${vid ? `<button class="tac-play-btn" onclick="event.stopPropagation();openModal('${safeName}')">
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
