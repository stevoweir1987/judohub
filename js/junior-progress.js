// ── JUNIOR PROGRESS / BADGES ─────────────────────────────────────

function renderJuniorProgress() {
  const el = document.getElementById('junior-progress-body');
  if (!el) return;

  const xp      = getXP();
  const streak  = getStreak();
  const log     = getSessionLog();
  const level   = Math.floor(xp / 50) + 1;
  const levelXP = xp % 50;
  const earned  = getEarnedBadges();
  const locked  = JUNIOR_BADGES.filter(b => !earned.find(e => e.id === b.id));

  el.innerHTML = `
    <div class="jp-wrap">

      <!-- LEVEL CARD -->
      <div class="jp-level-card">
        <div class="jp-level-num">Level ${level}</div>
        <div class="jp-level-title">${getJuniorRank(level)}</div>
        <div class="jp-xp-bar-wrap">
          <div class="jp-xp-bar">
            <div class="jp-xp-fill" style="width:${Math.round(levelXP/50*100)}%"></div>
          </div>
          <div class="jp-xp-label">${levelXP} / 50 XP</div>
        </div>
        <div class="jp-stats-row">
          <div class="jp-stat"><div class="jp-stat-val">🔥${streak}</div><div class="jp-stat-lbl">Streak</div></div>
          <div class="jp-stat"><div class="jp-stat-val">🥋${log.length}</div><div class="jp-stat-lbl">Sessions</div></div>
          <div class="jp-stat"><div class="jp-stat-val">⚡${xp}</div><div class="jp-stat-lbl">Total XP</div></div>
          <div class="jp-stat"><div class="jp-stat-val">⭐${earned.length}</div><div class="jp-stat-lbl">Badges</div></div>
        </div>
      </div>

      <!-- EARNED BADGES -->
      <div class="jp-section-title">🏆 Badges Earned</div>
      ${earned.length === 0
        ? `<div class="jp-empty">Complete your first session to earn a badge!</div>`
        : `<div class="jp-badge-grid">
            ${earned.map(b => `
              <div class="jp-badge jp-badge-earned">
                <div class="jp-badge-icon">${b.icon}</div>
                <div class="jp-badge-label">${b.label}</div>
              </div>`).join('')}
           </div>`}

      <!-- LOCKED BADGES -->
      <div class="jp-section-title">🔒 Next to Unlock</div>
      <div class="jp-badge-grid">
        ${locked.slice(0, 6).map(b => `
          <div class="jp-badge jp-badge-locked">
            <div class="jp-badge-icon jp-badge-icon-locked">${b.icon}</div>
            <div class="jp-badge-label">${b.label}</div>
          </div>`).join('')}
      </div>

      <!-- RECENT SESSIONS -->
      <div class="jp-section-title">📅 Recent Sessions</div>
      ${log.length === 0
        ? `<div class="jp-empty">No sessions yet — tap Train Today to start!</div>`
        : [...log].reverse().slice(0,5).map(s => `
          <div class="jp-session-row">
            <span class="jp-session-icon">${s.themeEmoji||'🥋'}</span>
            <div class="jp-session-info">
              <div class="jp-session-title">${s.title||'Training Session'}</div>
              <div class="jp-session-date">${new Date(s.date||0).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</div>
            </div>
            <div class="jp-session-xp">+${s.xp||0} XP</div>
          </div>`).join('')}

    </div>`;
}

function getJuniorRank(level) {
  const ranks = ['','White Belt','Red Tag','Yellow Tag','Orange Tag','Green Belt',
                 'Blue Belt','Brown Belt','Junior Champion','Dojo Legend','Judo Master'];
  return ranks[Math.min(level, ranks.length-1)] || 'Judo Master';
}
