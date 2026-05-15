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
    <div class="gr-header">
      <button class="gr-close" onclick="closeGradingReadiness()">✕</button>
      <div class="gr-title">Grading Readiness</div>
      <div class="gr-belt-label">${belt.label}</div>
    </div>

    <div class="gr-hero">
      <div class="gr-ring-wrap">
        <svg class="gr-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--surface3)" stroke-width="10"/>
          <circle cx="60" cy="60" r="54" fill="none" stroke="${verdictColor}"
            stroke-width="10" stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${dashOffset}"
            transform="rotate(-90 60 60)"
            style="transition: stroke-dashoffset .8s ease"/>
        </svg>
        <div class="gr-ring-inner">
          <div class="gr-score" style="color:${verdictColor}">${score}</div>
          <div class="gr-score-label">/ 100</div>
        </div>
      </div>
      <div class="gr-verdict-wrap">
        <div class="gr-verdict-emoji">${verdictEmoji}</div>
        <div class="gr-verdict" style="color:${verdictColor}">${verdict}</div>
        <div class="gr-verdict-detail">${verdictDetail}</div>
      </div>
    </div>

    <div class="gr-pillars">
      ${gradingPillar('Syllabus', sylPct, doneItems.length, allItems.length, 'requirements ticked')}
      ${gradingPillar('Training', freqPct, Math.round(sessPerWk * 10) / 10, targetSpW, 'sessions/wk')}
      ${gradingPillar('Techniques', techPct, coveredTechs.length, requiredTechs.length, 'practiced in sessions')}
    </div>

    ${actions.length ? `
    <div class="gr-section">
      <div class="gr-section-title">Focus Points</div>
      ${actions.map(a => `
        <div class="gr-action">
          <span class="gr-action-icon">${a.icon}</span>
          <div class="gr-action-text">
            <div class="gr-action-label">${a.label}</div>
            <div class="gr-action-detail">${a.detail}</div>
          </div>
        </div>`).join('')}
    </div>` : ''}

    ${missingItems.length ? `
    <div class="gr-section">
      <div class="gr-section-title">Unticked Requirements <span class="gr-count">${missingItems.length}</span></div>
      <div class="gr-missing-list">
        ${belt.groups.map(g => {
          const groupMissing = g.items.filter(i => !beltProgress[belt.id + '_' + i]);
          if (!groupMissing.length) return '';
          return `
          <div class="gr-group-label">${g.title}</div>
          ${groupMissing.map(item => {
            const tech       = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === item) : null;
            const techVid    = tech ? getVideoId(tech.url) : null;
            const gradingUrl = (typeof GRADING_VIDEOS !== 'undefined') ? GRADING_VIDEOS[item] : null;
            const gradingVid = gradingUrl ? getVideoId(gradingUrl) : null;
            const watchBtn   = techVid
              ? `<button class="gr-watch-btn" onclick="event.stopPropagation();openModal('${esc(item)}')">&#9654;</button>`
              : gradingVid
                ? `<button class="gr-watch-btn" onclick="event.stopPropagation();openGradingVideo('${gradingUrl}','${esc(item)}')">&#9654;</button>`
                : '';
            return `
            <div class="gr-missing-item">
              <button class="gr-tick-btn" onclick="tickFromGrading('${belt.id}','${esc(item)}',this)"></button>
              <span class="gr-missing-text">${item}</span>
              ${watchBtn}
            </div>`;
          }).join('')}`;
        }).join('')}
      </div>
    </div>` : '<div class="gr-section"><div class="gr-all-done">&#10003; All syllabus requirements ticked!</div></div>'}

    ${missingTechs.length ? `
    <div class="gr-section">
      <div class="gr-section-title">Techniques Not Yet Logged <span class="gr-count">${missingTechs.length}</span></div>
      <div class="gr-tech-chips">
        ${missingTechs.map(t => `<span class="gr-tech-chip" onclick="openModal('${esc(t)}')">${t} ▶</span>`).join('')}
      </div>
    </div>` : ''}

    <div class="gr-footer">
      <button class="gr-cta" onclick="closeGradingReadiness();showView('belt')">Open Belt Checklist →</button>
    </div>
  </div>`;
}

function gradingPillar(label, pct, done, total, unit) {
  const color = pct >= 80 ? '#16a34a' : pct >= 50 ? '#d97706' : '#e02d2d';
  return `<div class="gr-pillar">
    <div class="gr-pillar-pct" style="color:${color}">${pct}%</div>
    <div class="gr-pillar-bar">
      <div class="gr-pillar-fill" style="width:${pct}%;background:${color}"></div>
    </div>
    <div class="gr-pillar-label">${label}</div>
    <div class="gr-pillar-sub">${done}/${total} ${unit}</div>
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

  const row = btn.closest('.gr-missing-item');
  if (row) {
    const label = row.querySelector('.gr-missing-text');
    if (label) {
      label.style.textDecoration = nowDone ? 'line-through' : '';
      label.style.color = nowDone ? 'var(--text-muted)' : '';
    }
    row.style.opacity = nowDone ? '0.6' : '1';
  }

  if (typeof renderBelt === 'function') renderBelt();
  showToast(nowDone ? '✓ Ticked: ' + item : 'Unticked: ' + item);
}
