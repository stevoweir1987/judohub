// ── STATE ──────────────────────────────────────────
let expandedTech      = null;
let techNotes         = JSON.parse(localStorage.getItem('judo_tech_notes')    || '{}');
let beltProgress      = JSON.parse(localStorage.getItem('judo_belt_progress') || '{}');
let weekPlans         = JSON.parse(localStorage.getItem('judo_week_plans')    || '{}');
let currentWeekOffset = 0;
let draggingTech      = null;
let modalList         = [];
let modalIdx          = 0;
let vmSaveTimer       = null;
let activeBeltTab     = 'senior';

// ── PROFILE ────────────────────────────────────────
function getProfile() {
  return JSON.parse(localStorage.getItem('judo_profile') || 'null');
}
function saveProfile(p) {
  localStorage.setItem('judo_profile', JSON.stringify(p));
  applyProfile(p);
}
function applyProfile(p) {
  if (!p) return;
  document.body.classList.toggle('profile-junior', p.type === 'junior');
  document.body.classList.toggle('profile-adult',  p.type === 'adult');
  // header belt dot
  const dot   = document.getElementById('header-belt-dot');
  const label = document.getElementById('header-profile-label');
  const beltColors = { white:'#e8e8e8', red:'#e74c3c', yellow:'#f1c40f', orange:'#e67e22',
                        green:'#27ae60', blue:'#2980b9', brown:'#795548', black:'#1a1a1a' };
  if (dot && p.belt) dot.style.background = beltColors[p.belt] || '#ccc';
  if (label) label.textContent = p.name || (p.type === 'junior' ? 'Junior' : 'Adult');
  // Desktop nav profile
  const dDot   = document.getElementById('dnav-belt-dot');
  const dLabel = document.getElementById('dnav-profile-label');
  if (dDot   && p.belt) dDot.style.background = beltColors[p.belt] || '#ccc';
  if (dLabel) dLabel.textContent = p.name || (p.type === 'junior' ? 'Junior' : 'Adult');
  // Switch UI mode
  if (p.type === 'junior') {
    setTimeout(activateJuniorMode, 50);
  } else {
    setTimeout(activateAdultMode, 50);
  }
}
function openProfile() {
  // re-run onboarding to let user update profile
  showOnboarding();
}

// ── NAVIGATION ─────────────────────────────────────
function showView(name) {
  if (name === 'mon') { showView('belt'); switchBeltTab('junior'); return; }

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.bnav-btn[data-view], .dnav-btn[data-view]').forEach(n => n.classList.remove('active'));

  const viewEl = document.getElementById('view-' + name);
  if (!viewEl) return;
  viewEl.classList.add('active');
  document.querySelectorAll('[data-view="' + name + '"]').forEach(el => el.classList.add('active'));

  // Sync desktop nav logo text
  const dnavLogo = document.querySelector('.dnav-logo');
  if (dnavLogo) dnavLogo.innerHTML = '🥋 <span>JudoHub</span>';

  // Update header title
  const titles = { home:'JudoHub', techniques:'Techniques', belt:'Grades',
                   progress:'Progress', pt:'Personal Training',
                   randori:'Randori Brain', builder:'Training Builder', train:'Train' };
  const logoEl = document.querySelector('.app-logo span');
  if (logoEl) logoEl.textContent = titles[name] || 'JudoHub';

  if (name === 'builder')  renderWeek();
  if (name === 'train')    renderTrain();
  try { syncAppHeader(name); } catch(e) {}
  if (name === 'home')     renderHome();
  if (name === 'pt')       renderPT();
  if (name === 'progress') renderProgress();
  if (name === 'randori')  renderRandori();
  if (name === 'belt') {
    if (activeBeltTab === 'senior') renderBelt();
    else renderMon();
  }
}

function switchBeltTab(tab) {
  activeBeltTab = tab;
  document.querySelectorAll('.belt-tab').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('btab-' + tab);
  if (btn) btn.classList.add('active');
  if (tab === 'senior') renderBelt();
  else renderMon();
}

// ── MORE DRAWER ────────────────────────────────────
function openMoreDrawer() {
  document.getElementById('more-overlay').classList.add('open');
  document.getElementById('more-drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMoreDrawer() {
  document.getElementById('more-overlay').classList.remove('open');
  document.getElementById('more-drawer').classList.remove('open');
  document.body.style.overflow = '';
}


// ── JUNIOR ROUTING ──────────────────────────────────
function isJuniorMode() {
  const p = getProfile();
  return p && p.type === 'junior';
}

function showJuniorView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.jnav-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('view-' + name);
  if (el) el.classList.add('active');
  document.querySelectorAll('[data-jview="' + name + '"]').forEach(b => b.classList.add('active'));
  if (name === 'junior-home')     renderJuniorHome();
  if (name === 'junior-grades')   renderJuniorGrades();
  if (name === 'junior-progress') renderJuniorProgress();
}

function activateJuniorMode() {
  document.getElementById('bottom-nav').style.display  = 'none';
  document.getElementById('app-header').style.display  = '';
  document.getElementById('junior-nav').style.display  = '';
  // desktop nav hide
  const dn = document.getElementById('desktop-nav');
  if (dn) dn.style.display = 'none';
  document.body.classList.add('junior-mode');
  showJuniorView('junior-home');
}

function activateAdultMode() {
  const jn = document.getElementById('junior-nav');
  if (jn) jn.style.display = 'none';
  document.getElementById('bottom-nav').style.display = 'flex';
  document.body.classList.remove('junior-mode');
  showView('home');
}
// ── TOAST ──────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── INIT ───────────────────────────────────────────
window.onerror = function(msg, src, line, col, err) {
  const d = document.getElementById('error-banner');
  if (d) { d.style.display='block'; d.textContent = 'JS Error: ' + msg + ' (' + (src||'').split('/').pop() + ':' + line + ')'; }
  console.error('GLOBAL ERROR:', msg, src, line, err);
};

document.addEventListener('DOMContentLoaded', () => {
  const profile = getProfile();
  if (profile) {
    applyProfile(profile);
  }
  // Always init renders
  try { renderHome(); }        catch(e) { console.error('renderHome failed:', e); }
  try { syncAppHeader('home'); } catch(e) {}
  try { renderTechGrid(); }    catch(e) { console.error('renderTechGrid:', e); }
  try { renderBelt(); }        catch(e) { console.error('renderBelt:', e); }
  try { renderBuilderList(); } catch(e) { console.error('renderBuilderList:', e); }
  try { renderWeek(); }        catch(e) { console.error('renderWeek:', e); }

  // Route to correct mode
  if (!profile) {
    setTimeout(() => showOnboarding(), 100);
  } else if (profile.type === 'junior') {
    activateJuniorMode();
  }
});

// ── FEEDBACK OVERLAY ──────────────────────────────────────────────
let fbRating = 0;
let fbCategory = 'General';

function openFeedback() {
  fbRating = 0; fbCategory = 'General';
  document.querySelectorAll('.fb-star').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.fb-cat').forEach(c => c.classList.remove('active'));
  const firstCat = document.querySelector('.fb-cat');
  if (firstCat) firstCat.classList.add('active');
  const msg = document.getElementById('fb-message');
  if (msg) msg.value = '';
  const status = document.getElementById('fb-status');
  if (status) { status.textContent = ''; status.className = ''; }
  document.getElementById('feedback-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFeedback() {
  document.getElementById('feedback-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function onFeedbackBgClick(e) {
  if (e.target === document.getElementById('feedback-overlay')) closeFeedback();
}

function setRating(v) {
  fbRating = v;
  document.querySelectorAll('.fb-star').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.v) <= v);
  });
}

function selectCat(el, cat) {
  fbCategory = cat;
  document.querySelectorAll('.fb-cat').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function submitFeedback() {
  const message = (document.getElementById('fb-message').value || '').trim();
  if (!message) { showToast('Please add a message before sending'); return; }

  const status  = document.getElementById('fb-status');
  const profile = getProfile();
  const page    = document.querySelector('.view.active') ? (document.querySelector('.view.active').id || '') : '';

  const data = new FormData();
  data.append('form-name', 'judohub-feedback');
  data.append('rating',    fbRating ? fbRating + ' / 5 stars' : 'Not rated');
  data.append('category',  fbCategory);
  data.append('message',   message);
  data.append('page',      page);

  status.textContent = 'Sending…';
  status.className = 'fb-status-sending';

  fetch('/', { method: 'POST', body: data })
    .then(r => {
      if (r.ok) {
        status.textContent = '✓ Thanks! Feedback received.';
        status.className = 'fb-status-ok';
        setTimeout(closeFeedback, 1800);
      } else { throw new Error('Network'); }
    })
    .catch(() => {
      // Fallback: open mailto with pre-filled content
      const body = encodeURIComponent(
        'Rating: ' + (fbRating ? fbRating + '/5' : 'Not rated') +
        '\nCategory: ' + fbCategory +
        '\nPage: ' + page +
        '\n\n' + message
      );
      window.location.href = 'mailto:judohub@outlook.com?subject=JudoHub Feedback&body=' + body;
      closeFeedback();
    });
}


/* ─────────────────────────────────────────────
   TRAIN VIEW
   ───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   TODAY'S MENU — TRAIN VIEW DATA
   ───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   PLAN SETS — multiple rotations per mode
   Each card has a `sets` array; active set chosen by day + refresh offset
   ───────────────────────────────────────────── */
const PLAN_SETS = {
  adult: {
    nage: [
      { focus: "Today's focus: Uchi Mata", videoId: 'l4OEf85e1MY', items: [
        { text: 'Uchi Mata — 3×10 each side',        tech: 'Uchi-mata' },
        { text: 'Seoi Nage — 3×8 each side',          tech: 'Ippon-seoi-nage' },
        { text: 'O Goshi — 3×8 entry drills',         tech: 'O-goshi' },
        { text: 'Combination: Seoi → Harai Goshi ×5', tech: 'Harai-goshi' },
      ]},
      { focus: "Today's focus: O Soto Gari", items: [
        { text: 'O Soto Gari — 3×10 each side',       tech: 'O-soto-gari' },
        { text: 'Ko Uchi Gari — 3×8 each side',       tech: 'Ko-uchi-gari' },
        { text: 'Tai Otoshi — 3×8 entry drills',      tech: 'Tai-otoshi' },
        { text: 'Combination: O Soto → Ko Uchi ×5',   tech: 'Ko-uchi-gari' },
      ]},
      { focus: "Today's focus: Harai Goshi", items: [
        { text: 'Harai Goshi — 3×10 each side',       tech: 'Harai-goshi' },
        { text: 'Hane Goshi — 3×8 each side',         tech: 'Hane-goshi' },
        { text: 'Koshi Guruma — 3×8 entry drills',    tech: 'Koshi-guruma' },
        { text: 'Combination: Harai → Uchi Mata ×5',  tech: 'Uchi-mata' },
      ]},
      { focus: "Today's focus: Tai Otoshi", items: [
        { text: 'Tai Otoshi — 3×10 each side',        tech: 'Tai-otoshi' },
        { text: 'Sumi Otoshi — 3×8',                  tech: 'Sumi-otoshi' },
        { text: 'Kata Guruma — 3×8 entry drills',     tech: 'Kata-guruma' },
        { text: 'Combination: Tai Otoshi → Seoi ×5',  tech: 'Ippon-seoi-nage' },
      ]},
    ],
    weight: [
      { focus: 'Posterior chain + grip', items: [
        { text: 'Deadlift — 4×5 @ 75% 1RM' },
        { text: 'Pull-ups — 4×max reps' },
        { text: 'Towel pull — 3×30s grip hold' },
        { text: 'Romanian DL — 3×10' },
      ]},
      { focus: 'Upper body + explosive', items: [
        { text: 'Bench press — 4×6' },
        { text: 'Barbell row — 4×8' },
        { text: 'Farmer carry — 4×20m' },
        { text: 'Box jump — 4×6' },
      ]},
      { focus: 'Core & stability', items: [
        { text: 'Plank — 4×45s' },
        { text: 'Russian twists — 3×20' },
        { text: 'Pallof press — 3×12 each side' },
        { text: 'Hip bridge — 3×15' },
      ]},
      { focus: 'Conditioning circuit', items: [
        { text: 'Kettlebell swing — 4×15' },
        { text: 'Battle ropes — 4×30s' },
        { text: 'Sprint intervals — 6×20s' },
        { text: 'Bear crawl — 3×10m' },
      ]},
    ],
    randori: [
      { focus: 'Pressure & footwork', videoId: 'HkHZHPE5TbU', items: [
        { text: 'Shadow uchi-komi — 5 min',               tech: 'Uchi-mata' },
        { text: 'Controlled randori — 3×4 min rounds' },
        { text: 'Grip fighting drills — 2×3 min',         tech: 'Tai-otoshi' },
        { text: 'Shiai simulation — 1×5 min full contest' },
      ]},
      { focus: 'Attack from broken posture', items: [
        { text: 'Kuzushi drills — 3×3 min' },
        { text: 'Attack on the turn — 3×3 min' },
        { text: 'Grip breaks into throw — 2×3 min',       tech: 'O-soto-gari' },
        { text: 'Light contest — 2×5 min' },
      ]},
      { focus: 'Ne-waza transition', items: [
        { text: 'Throw-to-pin chains — 5 reps each side', tech: 'Tate-shiho-gatame' },
        { text: 'Controlled randori into newaza — 3×4 min' },
        { text: 'Escape then counter drill — 2×3 min' },
        { text: 'Full contest — 1×5 min' },
      ]},
    ],
    ne: [
      { focus: 'Turnovers & escapes', items: [
        { text: 'Kesa gatame hold — 3×30s each side', tech: 'Kesa-gatame' },
        { text: 'Turnover to Tate shiho — 5 reps',   tech: 'Tate-shiho-gatame' },
        { text: 'Juji gatame from guard — 3×5',       tech: 'Juji-gatame' },
        { text: 'Escape drills — 3×3 min',            tech: 'Escape from Kami-shiho-gatame (action & reaction)' },
      ]},
      { focus: 'Chokes & strangles', items: [
        { text: 'Hadaka jime — 3×5 reps',             tech: 'Hadaka-jime' },
        { text: 'Okuri eri jime — 3×5 reps',          tech: 'Okuri-eri-jime' },
        { text: 'Sankaku jime — 3×5 reps',            tech: 'Sankaku-jime' },
        { text: 'Choke escape drill — 3×3 min' },
      ]},
      { focus: 'Arm locks', items: [
        { text: 'Juji gatame — 3×5 each side',        tech: 'Juji-gatame' },
        { text: 'Ude garami — 3×5',                   tech: 'Ude-garami' },
        { text: 'Sankaku gatame — 3×5',               tech: 'Sankaku-gatame' },
        { text: 'Arm lock escape drill — 3×3 min' },
      ]},
    ],
    mental: [
      { focus: 'Tactical quiz + visualisation', quiz: [
        { q: 'Your opponent has a dominant high-collar grip. Your first move is…',
          options: [
            { text: 'Attack immediately with a big throw', correct: false, reason: 'Attacking without breaking the grip gives them control of the throw.' },
            { text: 'Break the grip, then create kuzushi',  correct: true,  reason: 'Correct — grip breaks disrupt their base and open your attacking options.' },
            { text: 'Step back and wait for them to move',  correct: false, reason: 'Passive judo invites penalties and lets them dictate the pace.' },
          ]
        },
        { q: 'You are losing by waza-ari with 45 seconds left. Best strategy?',
          options: [
            { text: 'Commit to one big ippon attack',        correct: true,  reason: 'Correct — you need ippon, so decisive committed attacks are your only path.' },
            { text: 'Play safe and wait for a mistake',      correct: false, reason: 'Playing safe when behind only secures a loss.' },
            { text: 'Focus on ne-waza after any throw attempt', correct: false, reason: 'Good in principle, but the priority must be scoring ippon on the feet first.' },
          ]
        },
      ]},
      { focus: 'Mindset & pressure', quiz: [
        { q: 'You have just been thrown for waza-ari. The best mental response is…',
          options: [
            { text: 'Panic and rush your next attack',  correct: false, reason: 'Rushing after a score leads to poor kuzushi and telegraphed attacks.' },
            { text: 'Reset your breathing and posture', correct: true,  reason: 'Correct — composure wins more points than desperation.' },
            { text: 'Switch to purely defensive judo',  correct: false, reason: 'Defensive judo risks shido penalties and concedes initiative.' },
          ]
        },
        { q: 'Your favourite throw keeps failing today. You should…',
          options: [
            { text: 'Keep forcing it until it works',   correct: false, reason: 'Persistence without adjustment just tires you out.' },
            { text: 'Switch to your combination attack',correct: true,  reason: 'Correct — adaptability is the hallmark of a high-level judoka.' },
            { text: 'Stop attacking and wait',          correct: false, reason: 'Inactivity leads to shidos and gives your opponent confidence.' },
          ]
        },
      ]},
      { focus: 'Contest strategy', quiz: [
        { q: 'You are winning by ippon with 2 minutes left. How do you manage the match?',
          options: [
            { text: 'Keep attacking aggressively',     correct: false, reason: 'Unnecessary risk when you are already winning can cost you the match.' },
            { text: 'Control the grips and pace',      correct: true,  reason: 'Correct — grip dominance controls tempo without excessive risk.' },
            { text: 'Stop moving and defend',          correct: false, reason: 'Passivity risks shido penalties even when winning.' },
          ]
        },
      ]},
    ],
  },
  junior: {
    nage: [
      { focus: "Today's focus: O Goshi", videoId: 'GdH6Y7HfpLU', items: [
        { text: 'O Goshi — 3×6 each side',   tech: 'O-goshi' },
        { text: 'De Ashi Barai — 3×6',        tech: 'Deashi-harai' },
        { text: 'Ukemi practice — 5 min' },
      ]},
      { focus: "Today's focus: O Soto Gari", items: [
        { text: 'O Soto Gari — 3×6 each side', tech: 'O-soto-gari' },
        { text: 'Ko Uchi Gari — 3×6',           tech: 'Ko-uchi-gari' },
        { text: 'Ukemi practice — 5 min' },
      ]},
      { focus: "Today's focus: Tai Otoshi", items: [
        { text: 'Tai Otoshi — 3×6 each side',  tech: 'Tai-otoshi' },
        { text: 'Harai Goshi — 3×6',           tech: 'Harai-goshi' },
        { text: 'Ukemi practice — 5 min' },
      ]},
    ],
    weight: [
      { focus: 'Core & cardio', items: [
        { text: 'Jumping jacks — 3×30' },
        { text: 'Press-ups — 3×10' },
        { text: 'Plank — 3×20s' },
      ]},
      { focus: 'Agility & speed', items: [
        { text: 'Ladder drills — 3×30s' },
        { text: 'Star jumps — 3×20' },
        { text: 'Sprint shuttles — 5×10m' },
      ]},
    ],
    randori: [
      { focus: 'Fun controlled sparring', videoId: 'HkHZHPE5TbU', items: [
        { text: 'Shadow judo — 3 min' },
        { text: 'Light randori — 2×3 min' },
        { text: 'Relay throw game' },
      ]},
      { focus: 'Grip & entry games', items: [
        { text: 'Grip challenge — 3×2 min' },
        { text: 'Entry drill game — 3×2 min' },
        { text: 'Throw-for-throw contest' },
      ]},
    ],
    ne: [
      { focus: 'Pins & rolls', items: [
        { text: 'Kesa hold — 3×20s each side', tech: 'Kesa-gatame' },
        { text: 'Roll escape drill — 5 reps',  tech: 'Escape from Kami-shiho-gatame (action & reaction)' },
        { text: 'Pin relay game' },
      ]},
      { focus: 'Turnovers', items: [
        { text: 'Tate shiho hold — 3×20s',     tech: 'Tate-shiho-gatame' },
        { text: 'Yoko shiho hold — 3×20s',     tech: 'Yoko-shiho-gatame' },
        { text: 'Escape challenge game' },
      ]},
    ],
    mental: [
      { focus: 'Think like a judoka', quiz: [
        { q: 'Your partner keeps pulling you off balance. What should you do first?',
          options: [
            { text: 'Pull them back even harder',           correct: false, reason: 'Matching force with force wastes energy and breaks your posture.' },
            { text: 'Lower your hips and find your balance', correct: true,  reason: 'Correct — good posture (shizen-tai) is always your first defence.' },
            { text: 'Try to throw immediately',              correct: false, reason: 'Throwing while off-balance usually ends with you on the floor!' },
          ]
        },
      ]},
      { focus: 'Smart judo', quiz: [
        { q: 'You are tired in your match. What is the smartest thing to do?',
          options: [
            { text: 'Stop moving and rest',                 correct: false, reason: 'Stopping gets you a shido penalty for passivity.' },
            { text: 'Control the grip and slow the pace',   correct: true,  reason: 'Correct — grip control buys you time without giving away penalties.' },
            { text: 'Go for a big throw immediately',       correct: false, reason: 'Big throws when tired often result in you being countered.' },
          ]
        },
      ]},
    ],
  },
};

/* Active set indices — keyed by mode_catId, persisted per day */
function tmGetDayKey() { return new Date().toISOString().slice(0,10); }
function tmGetSetIdx(mode, catId) {
  const stored = JSON.parse(localStorage.getItem('judohub_tm_sets') || '{}');
  const key = tmGetDayKey() + '_' + mode + '_' + catId;
  if (stored[key] !== undefined) return stored[key];
  // default: rotate by day-of-week mod number of sets
  const sets = (PLAN_SETS[mode] || {})[catId] || [];
  return sets.length ? new Date().getDay() % sets.length : 0;
}
function tmSetSetIdx(mode, catId, idx) {
  const stored = JSON.parse(localStorage.getItem('judohub_tm_sets') || '{}');
  stored[tmGetDayKey() + '_' + mode + '_' + catId] = idx;
  localStorage.setItem('judohub_tm_sets', JSON.stringify(stored));
}

function tmRefreshCard(catId) {
  const sets = (PLAN_SETS[tmMode] || {})[catId] || [];
  if (!sets.length) return;
  const cur = tmGetSetIdx(tmMode, catId);
  tmSetSetIdx(tmMode, catId, (cur + 1) % sets.length);
  // Clear done/quiz for this card only
  const prefix = tmMode + '_' + catId + '_';
  Object.keys(tmDone).forEach(k => { if (k.startsWith(prefix)) delete tmDone[k]; });
  localStorage.setItem('judohub_tm_done', JSON.stringify(tmDone));
  Object.keys(tmQuizAnswers).forEach(k => { if (k.startsWith(prefix)) delete tmQuizAnswers[k]; });
  localStorage.setItem('judohub_tm_quiz', JSON.stringify(tmQuizAnswers));
  if (tmOpenVideo && tmOpenVideo.startsWith(catId)) tmOpenVideo = null;
  renderTrain();
}

function tmRefresh() {
  // Advance every card to its next set
  const cats = ['nage','weight','randori','ne','mental'];
  cats.forEach(catId => {
    const sets = (PLAN_SETS[tmMode] || {})[catId] || [];
    if (!sets.length) return;
    const cur = tmGetSetIdx(tmMode, catId);
    tmSetSetIdx(tmMode, catId, (cur + 1) % sets.length);
  });
  // Clear done state for this day so fresh set starts clean
  const prefix = tmMode + '_';
  Object.keys(tmDone).forEach(k => { if (k.startsWith(prefix)) delete tmDone[k]; });
  localStorage.setItem('judohub_tm_done', JSON.stringify(tmDone));
  Object.keys(tmQuizAnswers).forEach(k => { if (k.startsWith(prefix)) delete tmQuizAnswers[k]; });
  localStorage.setItem('judohub_tm_quiz', JSON.stringify(tmQuizAnswers));
  tmExpanded = null;
  tmOpenVideo = null;
  renderTrain();
}

/* Build the active DAILY_PLANS from PLAN_SETS */
function buildDailyPlan(mode) {
  const modeSets = PLAN_SETS[mode] || {};
  const catMeta = {
    nage:    { id:'nage',    icon:'🥋', label:'THROWS',     title:'Nage Waza' },
    weight:  { id:'weight',  icon:'💪', label:'FITNESS',    title:'Weight Room' },
    randori: { id:'randori', icon:'🤼', label:'RANDORI',    title:'Randori Prep' },
    ne:      { id:'ne',      icon:'🟢', label:'GROUNDWORK', title:'Ne Waza' },
    mental:  { id:'mental',  icon:'🧠', label:'MENTAL',     title:'Mind Training' },
  };
  if (mode === 'junior') catMeta.weight.title = 'Body Circuit';
  if (mode === 'junior') catMeta.randori.title = 'Randori Play';
  if (mode === 'junior') catMeta.mental.title = 'Mind Training';
  return Object.entries(catMeta).map(([catId, meta]) => {
    const sets = modeSets[catId] || [];
    const idx  = tmGetSetIdx(mode, catId);
    const set  = sets[idx] || sets[0] || { focus: '', items: [] };
    return { ...meta, ...set };
  });
}


let tmMode = localStorage.getItem('judohub_user_type') === 'junior' ? 'junior' : 'adult';
let tmExpanded = null;
let tmDone = JSON.parse(localStorage.getItem('judohub_tm_done') || '{}');
let tmQuizAnswers = JSON.parse(localStorage.getItem('judohub_tm_quiz') || '{}');
let tmOpenVideo = null; // 'catId_itemIdx'

function tmSetMode(mode) {
  tmMode = mode;
  document.querySelectorAll('.tm-seg-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tm-seg-' + mode);
  if (btn) btn.classList.add('active');
  tmExpanded = null;
  renderTrain();
}

function tmToggleCard(id) {
  tmExpanded = tmExpanded === id ? null : id;
  renderTrain();
}

function tmToggleItem(catId, idx) {
  const key = tmMode + '_' + catId + '_' + idx;
  tmDone[key] = !tmDone[key];
  localStorage.setItem('judohub_tm_done', JSON.stringify(tmDone));
  renderTrain();
}

function tmAnswerQuiz(catId, qIdx, optIdx) {
  const key = tmMode + '_' + catId + '_q' + qIdx;
  if (tmQuizAnswers[key] !== undefined) return; // already answered
  tmQuizAnswers[key] = optIdx;
  localStorage.setItem('judohub_tm_quiz', JSON.stringify(tmQuizAnswers));
  renderTrain();
}

function tmGetCatProgress(cat) {
  if (cat.quiz) {
    const answered = cat.quiz.filter((q, i) => tmQuizAnswers[tmMode + '_' + cat.id + '_q' + i] !== undefined).length;
    return { done: answered, total: cat.quiz.length };
  }
  const done = cat.items.filter((_, i) => tmDone[tmMode + '_' + cat.id + '_' + i]).length;
  return { done, total: cat.items.length };
}

function tmGetProgress() {
  const plan = buildDailyPlan(tmMode);
  let total = 0, done = 0;
  plan.forEach(cat => {
    const p = tmGetCatProgress(cat);
    total += p.total;
    done  += p.done;
  });
  return total ? Math.round((done / total) * 100) : 0;
}

function tmToggleItemVideo(catId, idx, url, title) {
  event.stopPropagation();
  const key = catId + '_' + idx;
  tmOpenVideo = tmOpenVideo === key ? null : key;
  renderTrain();
}

function renderTrain() {
  const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
  const dayEl = document.getElementById('tm-day-label');
  if (dayEl) dayEl.textContent = days[new Date().getDay()];

  const pct = tmGetProgress();
  const pctEl  = document.getElementById('tm-progress-pct');
  const fillEl = document.getElementById('tm-progress-fill');
  if (pctEl)  pctEl.textContent  = pct + '%';
  if (fillEl) fillEl.style.width = pct + '%';

  document.querySelectorAll('.tm-seg-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById('tm-seg-' + tmMode);
  if (activeBtn) activeBtn.classList.add('active');

  const el = document.getElementById('tm-cards-list');
  if (!el) return;
  const plan  = buildDailyPlan(tmMode);
  const focus = localStorage.getItem('judohub_focus') || '';

  el.innerHTML = plan.map((cat) => {
    const isExpanded = tmExpanded === cat.id;
    const isFocus = (
      (focus === 'technique'  && cat.id === 'nage')    ||
      (focus === 'fitness'    && cat.id === 'weight')  ||
      (focus === 'randori'    && cat.id === 'randori') ||
      (focus === 'mental'     && cat.id === 'mental')  ||
      (focus === 'groundwork' && cat.id === 'ne')
    );
    const { done: doneN, total } = tmGetCatProgress(cat);
    const pctCat = Math.round((doneN / total) * 100);
    const C = 2 * Math.PI * 16;
    const dash = C - (pctCat / 100) * C;

    /* ── video block ── */
    const videoUrl = cat.videoId ? 'https://www.youtube.com/watch?v=' + cat.videoId : '';
    const videoBlock = (isExpanded && cat.videoId) ? `
      <div class="tm-play-row" onclick="event.stopPropagation()">
        <button class="tm-play-btn" onclick="openGradingVideo('${videoUrl}','${cat.title}')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
            <polygon points="6,4.5 12,8 6,11.5" fill="#fff"/>
          </svg>
          Watch demo
        </button>
      </div>` : '';

    /* ── quiz block ── */
    const quizBlock = (isExpanded && cat.quiz) ? `
      <div class="tm-quiz-wrap" onclick="event.stopPropagation()">
        ${cat.quiz.map((q, qi) => {
          const ansKey  = tmMode + '_' + cat.id + '_q' + qi;
          const picked  = tmQuizAnswers[ansKey];
          const answered = picked !== undefined;
          return `
          <div class="tm-quiz-q">
            <div class="tm-quiz-scenario">${q.q}</div>
            <div class="tm-quiz-options">
              ${q.options.map((opt, oi) => {
                let cls = 'tm-quiz-opt';
                if (answered) {
                  if (oi === picked) cls += opt.correct ? ' tm-quiz-correct' : ' tm-quiz-wrong';
                  else if (opt.correct) cls += ' tm-quiz-correct tm-quiz-correct-reveal';
                }
                return `<button class="${cls}" onclick="tmAnswerQuiz('${cat.id}',${qi},${oi})">${opt.text}</button>`;
              }).join('')}
            </div>
            ${answered ? `<div class="tm-quiz-explain">${q.options[picked].reason}</div>` : ''}
          </div>`;
        }).join('')}
      </div>` : '';

    /* ── checklist block ── */
    const checkBlock = (isExpanded && cat.items && !cat.quiz) ? `
      <div class="tm-card-items" onclick="event.stopPropagation()">
        ${cat.items.map((item, i) => {
          const done = !!tmDone[tmMode + '_' + cat.id + '_' + i];
          // look up video URL from TECHNIQUES library
          const techEntry = item.tech && typeof TECHNIQUES !== 'undefined'
            ? TECHNIQUES.find(t => t.name === item.tech) : null;
          const techUrl = techEntry ? techEntry.url : '';
          const vidKey = cat.id + '_' + i;
          const isVidOpen = tmOpenVideo === vidKey;
          const playBtn = techUrl
            ? `<button class="tm-item-play${isVidOpen ? ' tm-item-play-active' : ''}" onclick="tmToggleItemVideo('${cat.id}',${i},'${techUrl}','${(item.tech||'').replace(/'/g,"\'")}')">
                <svg width="13" height="13" viewBox="0 0 13 13"><circle cx="6.5" cy="6.5" r="6" stroke="rgba(255,255,255,.3)" stroke-width="1" fill="none"/><polygon points="5,3.5 10,6.5 5,9.5" fill="#fff"/></svg>
              </button>` : '';
          const vidBlock = (techUrl && isVidOpen)
            ? `<div class="tm-inline-video"><iframe src="https://www.youtube.com/embed/${techUrl.split('v=')[1]}?autoplay=1&mute=0&rel=0&playsinline=1" frameborder="0" allow="autoplay;encrypted-media" allowfullscreen></iframe></div>`
            : '';
          return `<div class="tm-item-wrap">
            <div class="tm-item${done ? ' tm-item-done' : ''}" onclick="tmToggleItem('${cat.id}',${i})">
              <div class="tm-item-check" style="border-color:#d97706;background:${done ? '#d97706' : 'transparent'}">
                ${done ? '<svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>' : ''}
              </div>
              <span class="tm-item-text">${item.text}</span>
              ${playBtn}
            </div>
            ${vidBlock}
          </div>`;
        }).join('')}
      </div>` : '';

    return `
    <div class="tm-card${isExpanded ? ' tm-card-open' : ''}" onclick="tmToggleCard('${cat.id}')">
      <div class="tm-card-main">
        <div class="tm-card-icon">${cat.icon}</div>
        <div class="tm-card-body">
          <div class="tm-card-label">${cat.label}${isFocus ? ' <span class="tm-today-badge">TODAY</span>' : ''}</div>
          <div class="tm-card-title">${cat.title}</div>
          <div class="tm-card-focus">${cat.focus}</div>
        </div>
        <div class="tm-card-circ">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="3"/>
            <circle cx="20" cy="20" r="16" fill="none" stroke="#d97706" stroke-width="3"
              stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${dash.toFixed(1)}"
              stroke-linecap="round" transform="rotate(-90 20 20)"/>
          </svg>
          <div class="tm-card-circ-txt">${doneN}/${total}</div>
        </div>
        <button class="tm-card-cycle" onclick="event.stopPropagation();tmRefreshCard('${cat.id}')" title="New moves">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12.5 2.5A6 6 0 1 0 13 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <polygon points="10,0 13.5,2.5 10.5,5.5" fill="currentColor"/>
          </svg>
        </button>
      </div>
      ${videoBlock}${quizBlock}${checkBlock}
    </div>`;
  }).join('');
}


/* ─────────────────────────────────────────────
   TYPE PICKER (Home nav tap)
   ───────────────────────────────────────────── */
function showTypePicker() {
  const current = localStorage.getItem('judohub_user_type') || 'adult';
  document.querySelectorAll('.type-picker-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector('.type-picker-btn[onclick*="' + current + '"]');
  if (activeBtn) activeBtn.classList.add('active');
  document.getElementById('type-picker-overlay').style.display = 'flex';
}

function closeTypePicker(e) {
  if (!e || e.target === document.getElementById('type-picker-overlay')) {
    document.getElementById('type-picker-overlay').style.display = 'none';
  }
}

function pickType(type) {
  localStorage.setItem('judohub_user_type', type);
  document.getElementById('type-picker-overlay').style.display = 'none';
  const nav  = document.getElementById('bottom-nav');
  const jNav = document.getElementById('junior-nav');
  if (type === 'junior') {
    if (nav)  nav.style.display  = 'none';
    if (jNav) jNav.style.display = '';
    if (typeof renderJuniorHome === 'function') renderJuniorHome();
    showJuniorView('junior-home');
  } else {
    if (nav)  nav.style.display  = '';
    if (jNav) jNav.style.display = 'none';
    if (typeof renderHome === 'function') renderHome();
    showView('home');
  }
}

/* ─────────────────────────────────────────────
   DAILY INTENT CHECK-IN
   ───────────────────────────────────────────── */
function checkDailyIntent() {
  const today = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem('judohub_focus_date') === today) return;
  setTimeout(() => {
    const el = document.getElementById('intent-overlay');
    if (el) el.style.display = 'flex';
  }, 600);
}

function setDailyIntent(focus) {
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('judohub_focus', focus);
  localStorage.setItem('judohub_focus_date', today);
  const el = document.getElementById('intent-overlay');
  if (el) el.style.display = 'none';
  // If onboarding is in progress, continue to belt step
  const ob = document.getElementById('onboarding-screen');
  if (ob && ob.classList.contains('open')) {
    if (typeof obStep !== 'undefined' && typeof renderObStep === 'function') {
      obStep = 2;
      renderObStep();
    }
    return;
  }
  if (typeof renderHome  === 'function') renderHome();
  if (typeof renderTrain === 'function') renderTrain();
}

/* ─────────────────────────────────────────────
   FEEDBACK MODAL
   ───────────────────────────────────────────── */
function openFeedbackModal() {
  const el = document.getElementById('feedback-modal-overlay');
  if (el) el.style.display = 'flex';
  setTimeout(() => { const ta = document.getElementById('feedback-modal-text'); if (ta) ta.focus(); }, 100);
}

function closeFeedbackModal(e) {
  if (!e || e.target === document.getElementById('feedback-modal-overlay')) {
    document.getElementById('feedback-modal-overlay').style.display = 'none';
  }
}

function submitFeedback() {
  const ta   = document.getElementById('feedback-modal-text');
  const text = ta ? ta.value.trim() : '';
  if (!text) { closeFeedbackModal(); return; }
  window.location.href = 'mailto:judohub@outlook.com?subject=JudoHub%20Feedback&body=' + encodeURIComponent(text);
  closeFeedbackModal();
  if (ta) ta.value = '';
}

/* ─────────────────────────────────────────────
   GLOBAL HEADER SYNC
   ───────────────────────────────────────────── */
function syncAppHeader(viewName) {
  // home has its own built-in header — hide global one
  document.body.classList.toggle('home-active', viewName === 'home');
  // Update name pill text
  const nameEl = document.getElementById('app-header-name-text');
  if (nameEl) {
    const p = (typeof getProfile === 'function') ? getProfile() : null;
    const firstName = p && p.name ? p.name.split(' ')[0] : 'Judoka';
    nameEl.textContent = firstName;
  }
}
