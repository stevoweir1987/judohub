// ── GRADING READINESS ────────────────────────────────────────────

function openGradingReadiness(beltId) {
  const overlay = document.getElementById('grading-overlay');
  overlay.innerHTML = buildGradingReport(beltId);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGradingReadiness() {
  document.getElementById('grading-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── ACTIVE BELT DETECTION ────────────────────────────────────────
function getActiveBeltForGrading() {
  if (typeof BELT_DATA === 'undefined') return null;
  // Prefer the explicitly set target belt (set via "I Passed" flow)
  if (typeof getCurrentTargetBelt === 'function') return getCurrentTargetBelt();
  // Fallback: first incomplete belt
  for (const b of BELT_DATA) {
    const tot = b.groups.reduce((s,g) => s + g.items.length, 0);
    const don = b.groups.reduce((s,g) => s + g.items.filter(i => beltProgress[b.id+'_'+i]).length, 0);
    if (don < tot) return b;
  }
  return BELT_DATA[BELT_DATA.length - 1];
}

// ── REPORT BUILDER ───────────────────────────────────────────────
function buildGradingReport(beltId) {
  const belt = beltId ? (BELT_DATA.find(b => b.id === beltId) || getActiveBeltForGrading()) : getActiveBeltForGrading();
  if (!belt) return `<div class="gr-wrap"><div class="gr-empty">No belt data found.</div></div>`;

  const log       = JSON.parse(localStorage.getItem('judo_session_log') || '[]');
  const profile   = JSON.parse(localStorage.getItem('judo_profile')     || 'null');

  // ── 1. Syllabus completion ──────────────────────────────────────
  const allItems  = belt.groups.flatMap(g => g.items);
  const doneItems = allItems.filter(i => beltProgress[belt.id + '_' + i]);
  const missingItems = allItems.filter(i => !beltProgress[belt.id + '_' + i]);
  const sylPct    = allItems.length ? Math.round(doneItems.length / allItems.length * 100) : 0;

  // ── 2. Training frequency ──────────────────────────────────────
  const now     = new Date();
  const cutoff  = new Date(now); cutoff.setDate(now.getDate() - 56); // 8 weeks
  const recentLog = log.filter(l => l.date && new Date(l.date) >= cutoff);
  const sessPerWk = recentLog.length / 8;
  const targetSpW = 3;
  const freqPct   = Math.min(100, Math.round(sessPerWk / targetSpW * 100));

  // ── 3. Required technique coverage ────────────────────────────
  const requiredTechs = BELT_TECHNIQUES[belt.id] || [];
  const loggedTechs   = new Set(log.flatMap(s => s.techniques || []));
  const coveredTechs  = requiredTechs.filter(t => loggedTechs.has(t));
  const missingTechs  = requiredTechs.filter(t => !loggedTechs.has(t));
  const techPct       = requiredTechs.length ? Math.round(coveredTechs.length / requiredTechs.length * 100) : 0;

  // ── 4. Weighted readiness score ────────────────────────────────
  const score = Math.round(sylPct * 0.5 + freqPct * 0.25 + techPct * 0.25);

  // ── 5. Verdict ────────────────────────────────────────────────
  let verdict, verdictColor, verdictEmoji, verdictDetail;
  if (score >= 85) {
    verdict = 'Ready to Grade!';     verdictColor = '#16a34a'; verdictEmoji = '🏅';
    verdictDetail = 'You\'ve put in the work. Book your grading.';
  } else if (score >= 65) {
    verdict = 'Nearly There';        verdictColor = '#d97706'; verdictEmoji = '🔥';
    verdictDetail = 'A few more sessions and tick the remaining requirements.';
  } else if (score >= 40) {
    verdict = 'Getting There';       verdictColor = '#e67e22'; verdictEmoji = '📈';
    verdictDetail = 'Solid foundation — keep showing up and ticking off requirements.';
  } else {
    verdict = 'Keep Training';       verdictColor = '#e02d2d'; verdictEmoji = '💪';
    verdictDetail = 'You\'re early in this belt journey. Focus on the basics below.';
  }

  // ── 6. Priority actions ────────────────────────────────────────
  const actions = [];
  if (sylPct < 100) {
    const first3 = missingItems.slice(0, 3);
    actions.push({ icon:'📋', label:'Tick off requirements', detail: first3.join(', ') + (missingItems.length > 3 ? ' + ' + (missingItems.length - 3) + ' more' : '') });
  }
  if (sessPerWk < targetSpW) {
    const needed = Math.ceil((targetSpW - sessPerWk) * 8);
    actions.push({ icon:'📅', label:'Train more consistently', detail: Math.round(sessPerWk * 10) / 10 + ' sessions/wk avg — aim for ' + targetSpW });
  }
  if (missingTechs.length > 0) {
    actions.push({ icon:'🥋', label:'Practice missing techniques', detail: missingTechs.slice(0, 3).join(', ') + (missingTechs.length > 3 ? '…' : '') });
  }

  // ── BUILD HTML ────────────────────────────────────────────────
  const circumference = 2 * Math.PI * 54; // r=54
  const dashOffset    = circumference * (1 - score / 100);

  return `
  <div class="gr-wrap">
    <div class="gr-ios-header">
      <button class="gr-ios-close" onclick="closeGradingReadiness()">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="gr-ios-title">Grading Readiness</div>
      <div class="gr-ios-belt-pill">${belt.label}</div>
    </div>

    <div class="gr-ios-hero-card">
      <div class="gr-ios-ring-wrap">
        <svg viewBox="0 0 120 120" width="110" height="110">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,.08)" stroke-width="10"/>
          <circle cx="60" cy="60" r="54" fill="none" stroke="${verdictColor}"
            stroke-width="10" stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${dashOffset}"
            transform="rotate(-90 60 60)"
            style="transition:stroke-dashoffset .9s cubic-bezier(.4,0,.2,1)"/>
        </svg>
        <div class="gr-ios-ring-inner">
          <div class="gr-ios-score" style="color:${verdictColor}">${score}</div>
          <div class="gr-ios-score-sub">/100</div>
        </div>
      </div>
      <div class="gr-ios-verdict-col">
        <div class="gr-ios-verdict-emoji">${verdictEmoji}</div>
        <div class="gr-ios-verdict" style="color:${verdictColor}">${verdict}</div>
        <div class="gr-ios-verdict-detail">${verdictDetail}</div>
      </div>
    </div>

    <div class="gr-ios-pillars">
      ${gradingPillar('Syllabus',   sylPct,  doneItems.length,       allItems.length,       'ticked')}
      ${gradingPillar('Training',   freqPct, Math.round(sessPerWk*10)/10, targetSpW,         '/wk')}
      ${gradingPillar('Techniques', techPct, coveredTechs.length,   requiredTechs.length,   'done')}
    </div>

    ${actions.length ? `
    <div class="gr-ios-section">
      <div class="gr-ios-section-label">Focus Points</div>
      <div class="gr-ios-card">
        ${actions.map((a,i) => `
        <div class="gr-ios-action-row">
          <div class="gr-ios-action-icon">${a.icon}</div>
          <div class="gr-ios-action-body">
            <div class="gr-ios-action-label">${a.label}</div>
            <div class="gr-ios-action-detail">${a.detail}</div>
          </div>
        </div>${i < actions.length-1 ? '<div class="gr-ios-row-div"></div>' : ''}
        `).join('')}
      </div>
    </div>` : ''}

    ${missingItems.length ? `
    <div class="gr-ios-section">
      <div class="gr-ios-section-label">Unticked Requirements <span class="gr-ios-count-badge">${missingItems.length}</span></div>
      <div class="gr-ios-card">
        ${(() => {
          const rows = [];
          belt.groups.forEach(g => {
            const gm = g.items.filter(i => !beltProgress[belt.id + '_' + i]);
            gm.forEach((item, idx) => {
              const tech     = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === item) : null;
              const vid      = tech ? getVideoId(tech.url) : null;
              const gUrl     = (typeof GRADING_VIDEOS !== 'undefined') ? GRADING_VIDEOS[item] : null;
              const gVid     = gUrl ? getVideoId(gUrl) : null;
              const subtitle = (tech && tech.en) ? tech.en : ((typeof TERMS_EN !== 'undefined' && TERMS_EN[item]) ? TERMS_EN[item] : '');
              const thumbUrl = vid ? 'https://img.youtube.com/vi/' + vid + '/mqdefault.jpg' : null;
              const checkSvg = '<svg viewBox="0 0 12 10" width="12" height="10"><polyline points="1,5 4.5,9 11,1" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
              const playSvg  = '<svg viewBox="0 0 24 24" width="15" height="15" fill="#2563eb"><polygon points="6,4 20,12 6,20"/></svg>';
              const playAction = vid  ? `event.stopPropagation();openTechDetail('${esc(item)}')`
                               : gVid ? `event.stopPropagation();openGradingVideo('${gUrl}','${esc(item)}')`
                               : null;
              const thumbHtml = `<div class="ios-thumb-wrap">
                  ${thumbUrl ? `<img class="ios-thumb" src="${thumbUrl}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
                  <div class="ios-thumb-ph" style="${thumbUrl ? 'display:none' : ''}">&#129354;</div>
                </div>`;
              const rowHtml = `<div class="ios-req-row gr-ios-row-clickable" onclick="tickFromGrading('${belt.id}','${esc(item)}',this)">
                  ${thumbHtml}
                  <div class="ios-req-info">
                    <span class="ios-req-name">${item}</span>
                    ${subtitle ? `<span class="ios-req-sub">${subtitle}</span>` : ''}
                  </div>
                  <div class="ios-req-actions">
                    <div class="ios-check-pill" data-item="${esc(item)}">${''}</div>
                    ${playAction ? `<button class="ios-play-btn" onclick="${playAction}">${playSvg}</button>` : '<div class="ios-play-ph"></div>'}
                  </div>
                </div>`;
              rows.push(rowHtml);
              if (idx < gm.length - 1) rows.push('<div class="ios-divider"></div>');
            });
          });
          return rows.join('');
        })()}
      </div>
    </div>` : `
    <div class="gr-ios-section">
      <div class="gr-ios-card gr-ios-all-done">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round"><polyline points="20,6 9,17 4,12"/></svg>
        All requirements ticked!
      </div>
    </div>`}

    ${missingTechs.length ? `
    <div class="gr-ios-section">
      <div class="gr-ios-section-label">Techniques to Log <span class="gr-ios-count-badge">${missingTechs.length}</span></div>
      <div class="gr-ios-chips">
        ${missingTechs.map(t => `<button class="gr-ios-chip" onclick="closeGradingReadiness();openTechDetail('${esc(t)}')">${t} ▶</button>`).join('')}
      </div>
    </div>` : ''}

    <div class="gr-ios-footer">
      <button class="gr-ios-cta" onclick="closeGradingReadiness();showView('belt')">
        Open Belt Checklist
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9,18 15,12 9,6"/></svg>
      </button>
    </div>
  </div>`;
}

function gradingPillar(label, pct, done, total, unit) {
  const color = pct >= 80 ? '#16a34a' : pct >= 50 ? '#d97706' : '#e02d2d';
  return `<div class="gr-ios-pillar">
    <div class="gr-ios-pillar-pct" style="color:${color}">${pct}<span style="font-size:12px;font-weight:600;opacity:.7">%</span></div>
    <div class="gr-ios-pillar-bar"><div class="gr-ios-pillar-fill" style="width:${pct}%;background:${color}"></div></div>
    <div class="gr-ios-pillar-label">${label}</div>
    <div class="gr-ios-pillar-sub">${done}/${total} ${unit}</div>
  </div>`;
}


function tickFromGrading(beltId, item, btn) {
  const key = beltId + '_' + item;
  const nowDone = !beltProgress[key];
  beltProgress[key] = nowDone;
  localStorage.setItem('judo_belt_progress', JSON.stringify(beltProgress));

  if (nowDone) {
    btn.textContent = '✓';
    btn.classList.add('ticked');
  } else {
    btn.textContent = '';
    btn.classList.remove('ticked');
  }

  // Works with both old button rows and new ios-req-row style
  const row = btn.closest('.ios-req-row') || btn.closest('.gr-ios-missing-row') || btn.closest('.gr-missing-item');
  if (row) {
    const checkSvg = '<svg viewBox="0 0 12 10" width="12" height="10"><polyline points="1,5 4.5,9 11,1" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // New ios-check-pill style (div)
    const pill = row.querySelector('.ios-check-pill');
    if (pill) {
      pill.classList.toggle('ios-check-on', nowDone);
      pill.innerHTML = nowDone ? checkSvg : '';
    }
    // Legacy button style fallback
    const legacyBtn = row.querySelector('.gr-ios-tick-btn');
    if (legacyBtn) {
      legacyBtn.innerHTML = nowDone ? checkSvg : '';
      legacyBtn.classList.toggle('gr-ios-tick-on', nowDone);
    }
    row.classList.toggle('ios-checked', nowDone);
    row.style.opacity = nowDone ? '0.55' : '1';
  }

  if (typeof renderBelt === 'function') renderBelt();
  showToast(nowDone ? '✓ Ticked: ' + item : 'Unticked: ' + item);
}
