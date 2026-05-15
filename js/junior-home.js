// ── JUNIOR HOME ──────────────────────────────────────────────────

function renderJuniorHome() {
  const profile  = getProfile() || {};
  const name     = profile.name || 'Judoka';
  const xp       = getXP();
  const streak   = getStreak();
  const weekSes  = getSessionsThisWeek();

  // XP level system for kids
  const level    = Math.floor(xp / 50) + 1;
  const levelXP  = xp % 50;
  const nextLvl  = 50;

  // Mon grade progress
  const monData  = getJuniorBeltInfo();

  // Today's technique (simplified)
  const totd = getTOTD();

  // Greeting by time of day
  const hr = new Date().getHours();
  const greeting = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';

  document.getElementById('junior-home-body').innerHTML = `
    <div class="jh-wrap">

      <!-- GREETING + LEVEL BAR -->
      <div class="jh-top">
        <div class="jh-greeting">
          <span class="jh-wave">👋</span>
          <div>
            <div class="jh-hello">${greeting}, <strong>${name}!</strong></div>
            <div class="jh-level">Level ${level} Judoka</div>
          </div>
        </div>
        <div class="jh-xp-pill">
          <span class="jh-xp-val">⚡${xp}</span>
        </div>
      </div>

      <!-- XP BAR -->
      <div class="jh-xp-bar-wrap">
        <div class="jh-xp-bar-track">
          <div class="jh-xp-bar-fill" style="width:${Math.round(levelXP/nextLvl*100)}%"></div>
        </div>
        <div class="jh-xp-bar-label">${levelXP} / ${nextLvl} XP to Level ${level+1}</div>
      </div>

      <!-- STREAK BADGE -->
      ${streak >= 2 ? `<div class="jh-streak-badge">🔥 ${streak} day streak — keep it going!</div>` : ''}

      <!-- BIG THREE CARDS -->
      <div class="jh-big-cards">

        <!-- TRAIN TODAY -->
        <button class="jh-card jh-card-train" onclick="startJuniorSession()">
          <div class="jh-card-icon">🥋</div>
          <div class="jh-card-name">Train Today</div>
          <div class="jh-card-sub">Start your session</div>
          <div class="jh-card-arrow">▶</div>
        </button>

        <!-- MY BELT -->
        <button class="jh-card jh-card-belt" onclick="showJuniorView('junior-grades')">
          <div class="jh-card-icon-belt">
            <div class="jh-belt-dot-big" style="background:${monData.color};border-color:${monData.borderColor}"></div>
          </div>
          <div class="jh-card-name">My Belt</div>
          <div class="jh-card-sub">${monData.label} — ${monData.pct}% done</div>
          <div class="jh-card-mini-bar">
            <div class="jh-card-mini-fill" style="width:${monData.pct}%;background:${monData.color}"></div>
          </div>
        </button>

        <!-- MY BADGES -->
        <button class="jh-card jh-card-badges" onclick="showJuniorView('junior-progress')">
          <div class="jh-card-icon">⭐</div>
          <div class="jh-card-name">My Badges</div>
          <div class="jh-card-sub">${getBadgeCount()} badges earned</div>
          <div class="jh-badge-row">${getTopBadgesHtml()}</div>
        </button>

      </div>

      <!-- TECHNIQUE OF THE DAY -->
      ${totd ? `
      <div class="jh-totd" onclick="openModal('${esc(totd.name)}')">
        <div class="jh-totd-label">🎯 Today's Technique</div>
        <div class="jh-totd-name">${totd.en || totd.name}</div>
        <div class="jh-totd-jp">${totd.en ? totd.name : ''}</div>
        <button class="jh-totd-watch">▶ Watch video</button>
      </div>` : ''}

      <!-- JUDO FACT OF THE DAY -->
      <div class="jh-fact">
        <div class="jh-fact-label">💡 Did you know?</div>
        <div class="jh-fact-text">${getTodayJuniorFact()}</div>
      </div>

    </div>
  `;
}

// ── MON GRADE INFO ───────────────────────────────────────────────
function getJuniorBeltInfo() {
  const MON_BELTS = [
    { key:'mon1', label:'Mon 1', color:'#e74c3c', borderColor:'#c0392b' },
    { key:'mon2', label:'Mon 2', color:'#e74c3c', borderColor:'#c0392b' },
    { key:'mon3', label:'Mon 3', color:'#e74c3c', borderColor:'#c0392b' },
    { key:'mon4', label:'Mon 4', color:'#f1c40f', borderColor:'#d4ac0d' },
    { key:'mon5', label:'Mon 5', color:'#f1c40f', borderColor:'#d4ac0d' },
    { key:'mon6', label:'Mon 6', color:'#f1c40f', borderColor:'#d4ac0d' },
    { key:'mon7', label:'Mon 7', color:'#e67e22', borderColor:'#ca6f1e' },
    { key:'mon8', label:'Mon 8', color:'#e67e22', borderColor:'#ca6f1e' },
    { key:'mon9', label:'Mon 9', color:'#e67e22', borderColor:'#ca6f1e' },
  ];

  // Find current mon grade from progress
  if (typeof MON_DATA !== 'undefined') {
    for (const mon of MON_DATA) {
      const total = mon.requirements ? mon.requirements.length : 0;
      const done  = mon.requirements ? mon.requirements.filter(r => beltProgress['mon_' + mon.id + '_' + r]).length : 0;
      if (done < total || total === 0) {
        const belt = MON_BELTS.find(b => b.key === mon.id) || MON_BELTS[0];
        const pct  = total ? Math.round(done / total * 100) : 0;
        return { ...belt, pct, done, total };
      }
    }
  }

  // Fallback
  const profile = getProfile() || {};
  const beltMap = {
    white:  { label:'White Belt',  color:'#e8e8e8', borderColor:'#ccc',    pct:0 },
    red:    { label:'Red Belt',    color:'#e74c3c', borderColor:'#c0392b', pct:10 },
    yellow: { label:'Yellow Belt', color:'#f1c40f', borderColor:'#d4ac0d', pct:30 },
    orange: { label:'Orange Belt', color:'#e67e22', borderColor:'#ca6f1e', pct:60 },
  };
  return beltMap[profile.belt] || beltMap.white;
}

// ── BADGES ───────────────────────────────────────────────────────
const JUNIOR_BADGES = [
  { id:'first_session', icon:'🥋', label:'First Session',  check: () => getSessionLog().length >= 1 },
  { id:'streak3',       icon:'🔥', label:'3-Day Streak',   check: () => getStreak() >= 3 },
  { id:'streak7',       icon:'🌟', label:'Week Warrior',   check: () => getStreak() >= 7 },
  { id:'sessions5',     icon:'💪', label:'5 Sessions',     check: () => getSessionLog().length >= 5 },
  { id:'sessions10',    icon:'🏋️', label:'10 Sessions',    check: () => getSessionLog().length >= 10 },
  { id:'sessions25',    icon:'🎖️', label:'25 Sessions',    check: () => getSessionLog().length >= 25 },
  { id:'xp50',          icon:'⚡', label:'50 XP',          check: () => getXP() >= 50 },
  { id:'xp200',         icon:'⭐', label:'200 XP',         check: () => getXP() >= 200 },
  { id:'xp500',         icon:'🌠', label:'500 XP',         check: () => getXP() >= 500 },
  { id:'technique5',    icon:'🎯', label:'5 Techniques',   check: () => Object.keys(beltProgress).filter(k=>beltProgress[k]).length >= 5 },
  { id:'technique15',   icon:'🏅', label:'15 Techniques',  check: () => Object.keys(beltProgress).filter(k=>beltProgress[k]).length >= 15 },
];

function getEarnedBadges() {
  return JUNIOR_BADGES.filter(b => { try { return b.check(); } catch(e) { return false; } });
}
function getBadgeCount()    { return getEarnedBadges().length; }
function getTopBadgesHtml() {
  return getEarnedBadges().slice(0,4).map(b =>
    `<span class="jh-badge-icon" title="${b.label}">${b.icon}</span>`
  ).join('') || '<span style="font-size:12px;color:var(--text-muted)">Complete sessions to earn!</span>';
}

// ── JUNIOR FACTS ─────────────────────────────────────────────────
const JUNIOR_FACTS = [
  'Judo was invented in Japan in 1882 by Jigoro Kano.',
  '"Judo" means "The Gentle Way" in Japanese.',
  'Judo became an Olympic sport in 1964 in Tokyo.',
  'A perfect throw that wins instantly is called an Ippon!',
  'The white suit you wear is called a Judogi.',
  'You say "Oss" to show respect at the dojo.',
  'The mat you train on is called a Tatami.',
  'Kuzushi means breaking your partner\'s balance before a throw.',
  'There are over 40 official Kodokan throwing techniques.',
  'Judoka means a person who practises judo.',
  'The referee says "Hajime" to start the match.',
  '"Mate" means stop — the referee calls this to pause.',
  'Judo is practised in over 200 countries worldwide.',
  'Uke is the person receiving the throw. Tori does the throwing.',
  'A bow shows respect — always bow when entering the mat!',
];

function getTodayJuniorFact() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
  return JUNIOR_FACTS[day % JUNIOR_FACTS.length];
}

// ── JUNIOR SESSION ───────────────────────────────────────────────
function startJuniorSession() {
  currentSession = {
    title:       'Junior Training',
    themeTag:    'junior',
    themeName:   'Junior Training',
    themeEmoji:  '🥋',
    themeColor:  '#e02d2d',
    minutes:     15,
    totalDuration: 900,
    blocks: [
      { type:'warmup',    name:'Warm Up',         duration:120, cue:'Get moving!', items:[
        {name:'Arm circles',duration:20},{name:'Hip rotations',duration:20},
        {name:'Light jog',duration:40},{name:'Neck rolls',duration:20},{name:'Shadow throws',duration:20}]},
      { type:'technique', name:'Breakfalls (Ukemi)', duration:180, cue:'Stay safe — learn to fall!', items:[
        {name:'Mae-ukemi (Front breakfall)',duration:60},{name:'Ushiro-ukemi (Back breakfall)',duration:60},{name:'Yoko-ukemi (Side breakfall)',duration:60}]},
      { type:'technique', name:'Throwing Practice', duration:360, cue:'Big throws!', items:[
        {name:'O-goshi (Hip throw)',duration:120},{name:'Ouchi-gari (Inner reap)',duration:120},{name:'Tai-otoshi (Body drop)',duration:120}]},
      { type:'recovery',  name:'Cool Down',        duration:120, cue:'Breathe and stretch', items:[
        {name:'Stretching',duration:60},{name:'Bow and tidy up',duration:60}]},
    ],
  };
  startSession();
}
