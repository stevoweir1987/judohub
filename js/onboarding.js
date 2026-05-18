// ── ONBOARDING ──────────────────────────────────────────────────
// Step flow: type → belt → goal → name → done

let obStep    = 1; // 1=type, 2=belt, 3=goal, 4=name
let obProfile = { type: null, belt: null, goal: null, name: '' };

function showOnboarding() {
  const screen = document.getElementById('onboarding-screen');
  obStep    = 1;
  obProfile = { type: null, belt: null, goal: null, name: '' };
  screen.style.display = '';
  screen.classList.add('open');
  // Hide bottom nav during onboarding
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = 'none';
  renderObStep();
}

function closeOnboarding() {
  document.getElementById('onboarding-screen').classList.remove('open');
}

function renderObStep() {
  const el = document.getElementById('onboarding-screen');
  switch(obStep) {
    case 1: el.innerHTML = obStepType();   break;
    case 2: el.innerHTML = obStepBelt();   break;
    case 3: el.innerHTML = obStepGoal();   break;
    case 4: el.innerHTML = obStepName();   break;
  }
}

// ── STEP 1: WHO ARE YOU ─────────────────────────────────────────
function obStepType() {
  // Try logo image first; fall back to styled text logo
  const logoHtml = `
    <img class="ob-logo-img" src="images/homeicon.png"
         onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
         alt="JudoHub">
    <div class="ob-logo-fallback" style="display:none">
      <span class="logo-judo">Judo</span><span class="logo-hub">Hub</span>
    </div>`;

  return `
    <div class="ob-hero-wrap">
      <div class="ob-hero-top">
        ${logoHtml}
        <h1 class="ob-hero-title">Who's training<br>today?</h1>
        <p class="ob-hero-sub">We'll personalise everything for you</p>
      </div>
      <div class="ob-hero-cards">
        <button class="ob-hero-card ob-hero-card-adult" onclick="selectType('adult')">
          <span class="ob-hero-card-emoji">🧑‍🦱</span>
          <div class="ob-hero-card-text">
            <div class="ob-hero-card-name">Adult</div>
            <div class="ob-hero-card-desc">13 and over · Senior grades</div>
          </div>
          <span class="ob-hero-card-arrow">›</span>
        </button>
        <button class="ob-hero-card ob-hero-card-junior" onclick="selectType('junior')">
          <span class="ob-hero-card-emoji">🧒</span>
          <div class="ob-hero-card-text">
            <div class="ob-hero-card-name">Junior</div>
            <div class="ob-hero-card-desc">Under 13 · Mon grades &amp; badges</div>
          </div>
          <span class="ob-hero-card-arrow">›</span>
        </button>
      </div>
    </div>`;
}

function selectType(type) {
  obProfile.type = type;
  // Show focus prompt before entering onboarding
  const el = document.getElementById('intent-overlay');
  if (el) { el.style.display = 'flex'; return; }
  // fallback if overlay not found
  obStep = 2;
  renderObStep();
}

// ── STEP 2: CURRENT BELT ────────────────────────────────────────
function obStepBelt() {
  const isJunior = obProfile.type === 'junior';
  const belts = isJunior
    ? [
        { key:'white',  color:'#e8e8e8', border:'#ccc',    label:'White',  sub:'Just started' },
        { key:'red',    color:'#e74c3c', border:'#c0392b', label:'Red',    sub:'Mon 1-3' },
        { key:'yellow', color:'#f1c40f', border:'#d4ac0d', label:'Yellow', sub:'Mon 4-6' },
        { key:'orange', color:'#e67e22', border:'#ca6f1e', label:'Orange', sub:'Mon 7-9' },
      ]
    : [
        { key:'white',  color:'#e8e8e8', border:'#ccc',    label:'White',  sub:'Just started' },
        { key:'red',    color:'#e74c3c', border:'#c0392b', label:'Red',    sub:'6th Kyu' },
        { key:'yellow', color:'#f1c40f', border:'#d4ac0d', label:'Yellow', sub:'5th Kyu' },
        { key:'orange', color:'#e67e22', border:'#ca6f1e', label:'Orange', sub:'4th Kyu' },
        { key:'green',  color:'#27ae60', border:'#1e8449', label:'Green',  sub:'3rd Kyu' },
        { key:'blue',   color:'#2980b9', border:'#21618c', label:'Blue',   sub:'2nd Kyu' },
        { key:'brown',  color:'#795548', border:'#4e342e', label:'Brown',  sub:'1st Kyu' },
        { key:'black',  color:'#1a1a1a', border:'#000',    label:'Black',  sub:'Dan grade' },
      ];

  return `
    <div class="ob-wrap">
      <div class="ob-header">
        <button class="ob-back" onclick="obStep=1;renderObStep()">← Back</button>
        <div class="ob-steps"><span class="ob-step done"></span><span class="ob-step active"></span><span class="ob-step"></span></div>
      </div>
      <div class="ob-body">
        <h1 class="ob-title">Current belt?</h1>
        <p class="ob-sub">Be honest — this sets your starting point</p>
        <div class="ob-belt-grid">
          ${belts.map(b => `
            <button class="ob-belt-btn" onclick="selectBelt('${b.key}')">
              <div class="ob-belt-dot" style="background:${b.color};border-color:${b.border}"></div>
              <div class="ob-belt-label">${b.label}</div>
              <div class="ob-belt-sub">${b.sub}</div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>`;
}

function selectBelt(belt) {
  if (belt === 'black') {
    obProfile.belt = 'black';
    const screen = document.getElementById('onboarding-screen');
    screen.style.display = '';
    screen.innerHTML = blackBeltCelebrationHtml();
    return;
  }
  obProfile.belt = belt;
  obStep = 3;
  renderObStep();
}

function blackBeltCelebrationHtml() {
  return `
  <div class="bb-cel-wrap">
    <div class="bb-cel-inner">
      <div class="bb-cel-stars">✦ ✦ ✦</div>
      <div class="bb-belt-graphic">
        <svg viewBox="0 0 320 90" xmlns="http://www.w3.org/2000/svg" class="bb-belt-svg">
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
      <div class="bb-cel-title">Black Belt</div>
      <div class="bb-cel-kyu">1st Dan — Shodan</div>
      <div class="bb-cel-msg">
        Years of dedication, discipline and determination.<br>
        You've earned the highest Kyu grade in judo.<br>
        <em>Osu.</em>
      </div>
      <div class="bb-cel-code">
        <span>礼</span><span>勇</span><span>誠</span><span>名誉</span><span>謙</span><span>尊重</span><span>制</span><span>友</span>
      </div>
      <button class="bb-cel-btn" onclick="finishBlackBelt()">Enter JudoHub →</button>
    </div>
  </div>`;
}

function finishBlackBelt() {
  obProfile.name = obProfile.name || '';
  saveProfile(obProfile);
  localStorage.setItem('judo_current_belt_id', 'black');
  const screen = document.getElementById('onboarding-screen');
  screen.classList.remove('open');
  screen.style.display = '';
  screen.innerHTML = '';
  if (typeof renderHome === 'function') renderHome();
  showView('belt');
}

// ── STEP 3: TRAINING GOAL ───────────────────────────────────────
function obStepGoal() {
  const isJunior = obProfile.type === 'junior';
  const goals = isJunior
    ? [
        { key:'grading',     icon:'🏅', label:'Pass my next grading',  desc:'Track belt requirements' },
        { key:'techniques',  icon:'🥋', label:'Learn new techniques',   desc:'Build my move library' },
        { key:'fun',         icon:'😄', label:'Have fun & get better',  desc:'Enjoy every session' },
        { key:'competition', icon:'🏆', label:'Compete',                desc:'Win at tournaments' },
      ]
    : [
        { key:'grading',     icon:'🏅', label:'Pass my next grading',  desc:'Track syllabus requirements' },
        { key:'techniques',  icon:'🥋', label:'Learn new techniques',   desc:'Expand my technique library' },
        { key:'competition', icon:'🏆', label:'Compete & win',          desc:'Sharpen randori & tactics' },
        { key:'fitness',     icon:'💪', label:'General fitness',        desc:'Training & conditioning' },
      ];

  return `
    <div class="ob-wrap">
      <div class="ob-header">
        <button class="ob-back" onclick="obStep=2;renderObStep()">← Back</button>
        <div class="ob-steps"><span class="ob-step done"></span><span class="ob-step done"></span><span class="ob-step active"></span></div>
      </div>
      <div class="ob-body">
        <h1 class="ob-title">Main goal?</h1>
        <p class="ob-sub">This shapes what you see on your home screen</p>
        <div class="ob-goal-list">
          ${goals.map(g => `
            <button class="ob-goal-btn" onclick="selectGoal('${g.key}')">
              <span class="ob-goal-icon">${g.icon}</span>
              <div class="ob-goal-text">
                <div class="ob-goal-name">${g.label}</div>
                <div class="ob-goal-desc">${g.desc}</div>
              </div>
              <span class="ob-goal-arrow">›</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>`;
}

function selectGoal(goal) {
  obProfile.goal = goal;
  obStep = 4;
  renderObStep();
}

// ── STEP 4: NAME ────────────────────────────────────────────────
function obStepName() {
  const beltColors = { white:'#555', red:'#e74c3c', yellow:'#f1c40f', orange:'#e67e22',
                       green:'#27ae60', blue:'#2980b9', brown:'#795548', black:'#1a1a1a' };
  const beltNames  = { white:'White Belt', red:'Red Belt', yellow:'Yellow Belt', orange:'Orange Belt',
                       green:'Green Belt', blue:'Blue Belt', brown:'Brown Belt', black:'Black Belt' };
  const color = beltColors[obProfile.belt] || '#555';
  const bLabel = beltNames[obProfile.belt] || '';

  return `
    <div class="ob-wrap">
      <div class="ob-header">
        <button class="ob-back" onclick="obStep=3;renderObStep()">← Back</button>
        <div class="ob-steps"><span class="ob-step done"></span><span class="ob-step done"></span><span class="ob-step done"></span></div>
      </div>
      <div class="ob-body">
        <h1 class="ob-title">Last thing —</h1>
        <p class="ob-sub">What should we call you?</p>
        <input class="ob-name-input" id="ob-name-input" type="text" placeholder="Your name or nickname" autocomplete="off"
          oninput="obProfile.name=this.value"
          onkeydown="if(event.key==='Enter')finishOnboarding()">
        <div class="ob-profile-preview" style="border-color:${color}">
          <div class="ob-preview-dot" style="background:${color}"></div>
          <div>
            <div class="ob-preview-name" id="ob-preview-name">${obProfile.type === 'junior' ? 'Junior' : 'Adult'} • ${bLabel}</div>
            <div class="ob-preview-goal" id="ob-preview-goal">Goal: ${obProfile.goal || ''}</div>
          </div>
        </div>
        <button class="ob-finish-btn" onclick="finishOnboarding()">Let's go →</button>
        <button class="ob-skip-btn" onclick="finishOnboarding()">Skip</button>
      </div>
    </div>`;
}

// ── FINISH ──────────────────────────────────────────────────────
function finishOnboarding() {
  const nameEl = document.getElementById('ob-name-input');
  if (nameEl) obProfile.name = nameEl.value || '';
  saveProfile(obProfile);

  // Map current belt → the NEXT grade target (what they're working towards)
  const beltToTarget = {
    white:'toRed', red:'toYellow', yellow:'toOrange',
    orange:'toGreen', green:'toBlue', blue:'toBrown', brown:'toBrown'
  };
  const targetId = beltToTarget[obProfile.belt];
  if (targetId && typeof setCurrentTargetBeltId === 'function') {
    setCurrentTargetBeltId(targetId);
  }

  document.getElementById('onboarding-screen').classList.remove('open');
  document.getElementById('onboarding-screen').style.display = '';

  if (obProfile.type === 'junior') {
    document.getElementById('bottom-nav').style.display   = 'none';
    document.getElementById('junior-nav').style.display   = '';
    if (typeof renderJuniorHome === 'function') renderJuniorHome();
    showJuniorView('junior-home');
  } else {
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = '';
    if (typeof renderHome === 'function') renderHome();
    showView('home');
  }
}
