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
  var prev = getProfile();
  localStorage.setItem('judo_profile', JSON.stringify(p));
  // Auto-complete past belts when belt changes
  if (p && p.belt && (!prev || prev.belt !== p.belt)) {
    autoCompletePassedBelts(p.belt);
  }
  applyProfile(p);
}

// ── AUTO-COMPLETE PAST BELT REQUIREMENTS ──────────────
// When a user sets their belt, every grading BELOW that
// belt is already done by definition. Mark all those items
// complete. Clear anything above current belt.
function autoCompletePassedBelts(currentBeltKey) {
  if (typeof BELT_DATA === 'undefined') return;
  var beltOrder = ['white','red','yellow','orange','green','blue','brown','black'];
  var currentIdx = beltOrder.indexOf((currentBeltKey||'').toLowerCase());
  if (currentIdx < 0) return;

  // Reload from storage to avoid overwriting manual ticks
  var bp = JSON.parse(localStorage.getItem('judo_belt_progress') || '{}');

  BELT_DATA.forEach(function(b) {
    var toIdx = beltOrder.indexOf((b.to||'').toLowerCase());
    var allItems = b.groups.reduce(function(a,g){ return a.concat(g.items); }, []);

    if (toIdx > 0 && toIdx <= currentIdx) {
      // Belt already passed — mark every requirement done
      allItems.forEach(function(item){ bp[b.id+'_'+item] = true; });
    } else if (toIdx > currentIdx) {
      // Future belt — clear any stale auto-ticks
      allItems.forEach(function(item){ delete bp[b.id+'_'+item]; });
    }
    // toIdx === currentIdx means the CURRENT working belt — leave untouched
  });

  localStorage.setItem('judo_belt_progress', JSON.stringify(bp));
  // Sync the in-memory global so belt.js sees the update immediately
  Object.keys(beltProgress).forEach(function(k){ delete beltProgress[k]; });
  Object.assign(beltProgress, bp);
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
  // Close session panel if open when navigating away
  const sp = document.getElementById('train-session-panel');
  if (sp && sp.classList.contains('open')) { closeTrainSession(); }

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

  // Toggle dark body background for Training view
  document.body.classList.toggle('training-active', name === 'train');

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
  try { renderHome(); } catch(e) { console.error('renderHome failed:', e); }
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
  // Route to whichever inner tab is active
  switchTrainTab(trainActiveTab || 'overview');
}

function _renderTrainLegacy() {
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
  // Render belt grid
  renderBeltPickerGrid();
  document.getElementById('type-picker-overlay').style.display = 'flex';
}

function renderBeltPickerGrid() {
  var grid = document.getElementById('belt-picker-grid');
  if (!grid) return;
  var p = getProfile();
  var currentBelt = (p && p.belt) ? p.belt : 'white';
  var belts = [
    { key:'white',  label:'White',  color:'#e5e5e5' },
    { key:'red',    label:'Red',    color:'#e63946' },
    { key:'yellow', label:'Yellow', color:'#f5c542' },
    { key:'orange', label:'Orange', color:'#f97316' },
    { key:'green',  label:'Green',  color:'#22c55e' },
    { key:'blue',   label:'Blue',   color:'#3b82f6' },
    { key:'brown',  label:'Brown',  color:'#92400e' },
    { key:'black',  label:'Black',  color:'#2a2a2a' },
  ];
  grid.innerHTML = belts.map(function(b) {
    var isActive = b.key === currentBelt;
    return '<button onclick="pickBelt(\'' + b.key + '\')" style="'
      + 'background:' + (isActive ? b.color : 'rgba(255,255,255,.05)') + ';'
      + 'border:2px solid ' + (isActive ? b.color : 'rgba(255,255,255,.1)') + ';'
      + 'border-radius:10px;padding:8px 4px;cursor:pointer;display:flex;flex-direction:column;'
      + 'align-items:center;gap:5px;-webkit-tap-highlight-color:transparent;transition:all .15s">'
      + '<div style="width:18px;height:18px;border-radius:50%;background:' + b.color + ';'
      + (isActive ? '' : 'opacity:.7;') + 'border:1.5px solid rgba(255,255,255,.15)"></div>'
      + '<div style="font-size:9px;font-weight:700;color:' + (isActive ? (b.key==='white'||b.key==='yellow'?'#0d0d12':'#fff') : '#888') + ';letter-spacing:.2px">'
      + b.label + '</div>'
      + '</button>';
  }).join('');
}

function pickBelt(beltKey) {
  var p = getProfile() || {};
  p.belt = beltKey;
  saveProfile(p);          // triggers autoCompletePassedBelts automatically

  // Set the working-towards belt (next grade up)
  var beltToTarget = {
    white:'toRed', red:'toYellow', yellow:'toOrange',
    orange:'toGreen', green:'toBlue', blue:'toBrown', brown:'toBrown'
  };
  var targetId = beltToTarget[beltKey];
  if (targetId && typeof setCurrentTargetBeltId === 'function') {
    setCurrentTargetBeltId(targetId);
  }

  renderBeltPickerGrid();  // refresh active state
  syncAppHeader('home');
  if (typeof renderHome === 'function') renderHome();
  if (typeof renderProgress === 'function') renderProgress();
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
  document.body.classList.toggle('home-active', viewName === 'home');
  const p = (typeof getProfile === 'function') ? getProfile() : null;
  // Update name text
  const nameEl = document.getElementById('app-header-name-text');
  if (nameEl) {
    nameEl.textContent = p && p.name ? p.name.split(' ')[0] : 'Judoka';
  }
  // Update belt dot colour
  const dotEl = document.getElementById('app-header-belt-dot');
  if (dotEl) {
    const beltKey = (p && p.belt) ? p.belt : 'white';
    const beltColors = {
      white:'#e8e8e8', red:'#e74c3c', yellow:'#f1c40f', orange:'#e67e22',
      green:'#27ae60', blue:'#2980b9', brown:'#795548', black:'#1a1a1a'
    };
    dotEl.style.background = beltColors[beltKey] || '#e8e8e8';
  }
}


/* ═══════════════════════════════════════════════════════════
   TRAINING VIEW — REDESIGN (inner tabs + session panel)
   ═══════════════════════════════════════════════════════════ */

let trainActiveTab = 'overview';
let sessionActiveCat  = null;
let sessionActiveTab  = 'checklist';
let sessionVideoTech  = null; // {catId, itemIdx, techName, techUrl}
let trainTechBelt    = '';

/* ─── Inner tab routing ─── */
function switchTrainTab(tab) {
  trainActiveTab = tab;
  document.querySelectorAll('.train-tab').forEach(t => t.classList.remove('active'));
  const btn = document.getElementById('ttab-' + tab);
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.train-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('tp-' + tab);
  if (panel) panel.classList.add('active');

  if (tab === 'overview')    renderTrainOverview();
  if (tab === 'training')    renderTrainingHub();
  if (tab === 'techniques')  renderTrainTech();
  if (tab === 'randori')     renderTrainRandori();
}

/* ═══════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════ */
// COACHING_TIPS defined in home.js

// BELT_ORDER defined in progress.js (array of {key,color,label,border})

function renderTrainOverview() {
  const el = document.getElementById('tp-overview');
  if (!el) return;

  const p = (typeof getProfile === 'function') ? getProfile() : null;
  const beltKey  = (p && p.belt) ? p.belt : 'white';
  const beltName = beltKey.charAt(0).toUpperCase() + beltKey.slice(1) + ' Belt';
  const beltImg  = 'images/belt-' + beltKey + '.png';

  const curIdx  = BELT_ORDER.findIndex(b => b.key === beltKey);
  const nextObj = BELT_ORDER[Math.min(curIdx + 1, BELT_ORDER.length - 1)] || {};
  const nextKey = nextObj.key || beltKey;
  const nextName = nextObj.label || (nextKey.charAt(0).toUpperCase() + nextKey.slice(1) + ' Belt');

  // Belt syllabus progress
  const allProg = JSON.parse(localStorage.getItem('judo_belt_progress') || '{}');
  const doneCount = Object.values(allProg).filter(Boolean).length;
  const gradesPct = Math.min(100, Math.round((doneCount / 28) * 100));

  // XP & streak
  const xp     = parseInt(localStorage.getItem('judohub_xp')     || '0');
  const streak = parseInt(localStorage.getItem('judohub_streak') || '0');

  // Week sessions
  const sessLog = JSON.parse(localStorage.getItem('judohub_sessions_log') || '[]');
  const today   = new Date();
  const dow     = (today.getDay() + 6) % 7; // Mon=0
  const monday  = new Date(today); monday.setDate(today.getDate() - dow);
  const weekStart = monday.toISOString().slice(0,10);
  const weekSessions = sessLog.filter(s => s.date >= weekStart);
  const weekDays  = new Set(weekSessions.map(s => s.date)).size;
  const weekMins  = weekSessions.reduce((a,s) => a + (s.duration || 20), 0);
  const weekTarget = 5;

  // Today's focus
  const focus = localStorage.getItem('judohub_focus') || 'technique';
  const focusMap = {
    technique:  { title: 'Nage Waza Drills',   sub: 'Perfect your throwing technique', icon: '🥋', cat: 'training' },
    randori:    { title: 'Randori Session',      sub: 'Sharpen your contest mindset',   icon: '🤼', cat: 'training' },
    fitness:    { title: 'S&C Circuit',          sub: "Build a judoka's body",           icon: '💪', cat: 'training' },
    mental:     { title: 'Mind Training',        sub: 'Focus & tactical quiz',           icon: '🧠', cat: 'training' },
    groundwork: { title: 'Ne Waza Drills',       sub: 'Pins, chokes & arm locks',        icon: '🟢', cat: 'training' },
  };
  const foc = focusMap[focus] || focusMap.technique;

  // Coaching tip (rotates daily) — COACHING_TIPS is [{title,body,img}] from home.js
  const _tipObj = (typeof COACHING_TIPS !== 'undefined') ? COACHING_TIPS[new Date().getDay() % COACHING_TIPS.length] : null;
  const tip = _tipObj ? _tipObj.body : 'Focus on kuzushi — every great throw starts with breaking balance.';

  // Week ring SVG
  const R = 36, C2 = 2 * Math.PI * R;
  const dash2 = C2 - Math.min(weekDays / weekTarget, 1) * C2;

  el.innerHTML = `
    <div class="ov-scroll">
      <!-- Grade card (tap → Grades) -->
      <div class="ov-grade-card" onclick="showView('belt')" style="cursor:pointer">
        <img class="ov-belt-img" src="${beltImg}" alt="${beltName}" onerror="this.style.opacity='.3'">
        <div class="ov-grade-body">
          <div class="ov-grade-name">${beltName}</div>
          <div class="ov-grade-next">Working towards ${nextName}</div>
          <div class="ov-grade-bar"><div class="ov-grade-bar-fill" style="width:${gradesPct}%"></div></div>
          <div class="ov-grade-pct">${gradesPct}% of syllabus complete</div>
        </div>
      </div>

      <!-- Today's focus (tap → Training hub) -->
      <div class="ov-focus-card" onclick="switchTrainTab('training')">
        <div class="ov-focus-label">TODAY&apos;S FOCUS &rsaquo;</div>
        <div class="ov-focus-title">${foc.icon} ${foc.title}</div>
        <div class="ov-focus-sub">${foc.sub}</div>
      </div>

      <!-- Week ring + stats -->
      <div class="ov-row">
        <div class="ov-week-card">
          <div class="ov-week-label">THIS WEEK</div>
          <svg width="88" height="88" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="${R}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="7"/>
            <circle cx="44" cy="44" r="${R}" fill="none" stroke="#d97706" stroke-width="7"
              stroke-dasharray="${C2.toFixed(1)}" stroke-dashoffset="${dash2.toFixed(1)}"
              stroke-linecap="round" transform="rotate(-90 44 44)"/>
            <text x="44" y="40" text-anchor="middle" fill="#f0f4ff" font-size="20" font-weight="900" font-family="system-ui,sans-serif">${weekDays}</text>
            <text x="44" y="56" text-anchor="middle" fill="#888" font-size="10" font-family="system-ui,sans-serif">of ${weekTarget}</text>
          </svg>
          <div class="ov-week-sub">${weekMins} mins<br>this week</div>
        </div>
        <div class="ov-stats">
          <div class="ov-stat"><div class="ov-stat-val">🔥 ${streak}</div><div class="ov-stat-label">Day streak</div></div>
          <div class="ov-stat"><div class="ov-stat-val">⚡ ${xp}</div><div class="ov-stat-label">Total XP</div></div>
          <div class="ov-stat"><div class="ov-stat-val">🎖️ ${doneCount}</div><div class="ov-stat-label">Syllabus items</div></div>
        </div>
      </div>

      <!-- Coaching tip -->
      <div class="ov-tip-card">
        <div class="ov-tip-label">🧠 COACHING INSIGHT</div>
        <div class="ov-tip-text">&ldquo;${tip}&rdquo;</div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════
   TRAINING HUB TAB
   ═══════════════════════════════ */
const HUB_CATS = [
  { id:'nage',    icon:'🥋', title:'Daily Drills',   sub:'Throws & technique work',   xp:30 },
  { id:'randori', icon:'🤼', title:'Randori Prep',    sub:'Contest & sparring drills', xp:40 },
  { id:'weight',  icon:'💪', title:'S&C',             sub:'Strength & conditioning',  xp:25 },
  { id:'mental',  icon:'🧠', title:'Study & Theory',  sub:'Tactical quiz & mindset',  xp:20 },
  { id:'ne',      icon:'🟢', title:'Ne Waza',         sub:'Groundwork & submission',  xp:30 },
];

function renderTrainingHub() {
  const el = document.getElementById('train-hub-cards');
  if (!el) return;

  const focus  = localStorage.getItem('judohub_focus') || 'technique';
  const recMap = { technique:'nage', randori:'randori', fitness:'weight', mental:'mental', groundwork:'ne' };
  const recId  = recMap[focus] || 'nage';
  const plan   = buildDailyPlan(tmMode);

  // Count items/questions per category
  const countMap = {};
  plan.forEach(c => {
    countMap[c.id] = c.quiz ? c.quiz.length : (c.items || []).length;
  });
  const labelMap = { nage:'Drills', randori:'Drills', weight:'Workouts', mental:'Topics', ne:'Drills' };

  // Streak + week dots
  const streak    = parseInt(localStorage.getItem('judohub_streak') || '0');
  const sessLog   = JSON.parse(localStorage.getItem('judohub_sessions_log') || '[]');
  const today     = new Date();
  const dow       = (today.getDay() + 6) % 7; // Mon=0
  const weekDates = Array.from({length:7}, (_,i) => {
    const d = new Date(today); d.setDate(today.getDate() - dow + i);
    return d.toISOString().slice(0,10);
  });
  const doneDates = new Set(sessLog.map(s => s.date));
  const weekDayLabels = ['M','T','W','T','F','S','S'];
  const weekGoal  = 5;
  const weekDone  = weekDates.slice(0,5).filter(d => doneDates.has(d)).length;
  const weekBadge = weekDone >= weekGoal;
  const weekBadgeKey = 'judohub_week_badge_' + weekDates[0];
  if (weekBadge && !localStorage.getItem(weekBadgeKey)) {
    localStorage.setItem(weekBadgeKey, '1');
    setTimeout(() => { if (typeof showToast === 'function') showToast('🏆 Weekly goal complete! Great week!'); }, 300);
  }

  const dotRow = weekDates.map((d,i) => {
    const done    = doneDates.has(d);
    const isToday = d === today.toISOString().slice(0,10);
    const bg      = done ? '#d97706' : isToday ? 'rgba(217,119,6,.3)' : 'rgba(255,255,255,.1)';
    const border  = isToday ? '1.5px solid #d97706' : 'none';
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">
      <div style="width:28px;height:28px;border-radius:50%;background:${bg};border:${border};display:flex;align-items:center;justify-content:center">
        ${done ? '<svg width="11" height="11" viewBox="0 0 11 11"><polyline points="1.5,5.5 4.5,8.5 9.5,2" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/></svg>' : ''}
      </div>
      <span style="font-size:9px;font-weight:700;color:${isToday?'#d97706':'#555'}">${weekDayLabels[i]}</span>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div style="padding:0 14px 6px">
      <div style="font-size:10px;font-weight:800;letter-spacing:.12em;color:#666;padding-top:12px">TRAINING HUB</div>
      <div style="font-size:12px;color:#444;margin-top:2px;margin-bottom:4px">Structure your daily work</div>
    </div>

    <div class="hub-cards-wrap">
      ${HUB_CATS.map(cat => {
        const isRec    = cat.id === recId;
        const count    = countMap[cat.id] || 0;
        const lbl      = labelMap[cat.id] || 'Items';
        const plan_cat = plan.find(c => c.id === cat.id);
        const vidId    = plan_cat && plan_cat.videoId;
        const thumb    = vidId ? 'https://img.youtube.com/vi/' + vidId + '/mqdefault.jpg' : '';
        const todayStr2 = new Date().toISOString().slice(0,10);
        const doneToday = sessLog.some(s => s.date === todayStr2 && s.cat === cat.id);
        const thumbHtml = thumb
          ? `<div style="flex-shrink:0;width:64px;height:44px;border-radius:7px;overflow:hidden;background:#000;position:relative">
              <img src="${thumb}" style="width:100%;height:100%;object-fit:cover" loading="lazy" onerror="this.parentElement.style.display='none'">
              <div style="position:absolute;inset:0;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center">
                <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6.5" fill="rgba(0,0,0,.4)"/><polygon points="5.5,4 11,7 5.5,10" fill="#fff"/></svg>
              </div>
            </div>`
          : `<div class="hub-card-icon">${cat.icon}</div>`;

        return `<div class="hub-card${isRec ? ' hub-card-rec' : ''}${doneToday ? ' hub-card-done' : ''}" onclick="openTrainSession('${cat.id}')">
          ${thumbHtml}
          <div class="hub-card-body">
            ${isRec && !doneToday ? '<div class="hub-rec-badge">RECOMMENDED</div>' : ''}
            ${doneToday ? '<div class="hub-done-badge">&#10003; Done today</div>' : ''}
            <div class="hub-card-title">${cat.title}</div>
            <div class="hub-card-sub">${count} ${lbl}</div>
          </div>
          <div class="hub-card-xp">${doneToday ? '<span style="color:#4ade80;font-size:18px">&#10003;</span>' : '+' + cat.xp + ' XP'}</div>
          <div class="hub-card-arr">›</div>
        </div>`;
      }).join('')}
    </div>

    <div class="hub-streak-banner" style="margin:0 14px 10px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:18px">🔥</span>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:800;color:#f0f4ff">${streak} Day Streak</div>
          <div style="font-size:10px;color:#666">${weekDone} of ${weekGoal} sessions this week</div>
        </div>
        ${weekBadge ? '<div class="hub-week-badge" title="Weekly goal achieved!">🏆</div>' : ''}
      </div>
      <div style="background:rgba(255,255,255,0.06);border-radius:4px;height:4px;margin-bottom:10px">
        <div style="height:4px;border-radius:4px;background:#d97706;width:${Math.round((weekDone/weekGoal)*100)}%;max-width:100%;transition:width .4s"></div>
      </div>
      <div style="display:flex;justify-content:space-around;align-items:flex-end">
        ${dotRow}
        <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
          <div style="width:28px;height:28px;border-radius:50%;background:${weekBadge?'#d97706':'rgba(255,255,255,0.07)'};border:${weekBadge?'none':'1.5px dashed rgba(255,255,255,0.2)'};display:flex;align-items:center;justify-content:center;font-size:13px">🏆</div>
          <span style="font-size:9px;font-weight:700;color:${weekBadge?'#d97706':'#333'}">Goal</span>
        </div>
      </div>
    </div>

  `;
}

function _OLD_renderTrainingHub() {
  const el = document.getElementById('train-hub-cards');
  if (!el) return;
  const focus = localStorage.getItem('judohub_focus') || 'technique';
  const recMap = { technique:'nage', randori:'randori', fitness:'weight', mental:'mental', groundwork:'ne' };
  const recId  = recMap[focus] || 'nage';

  // Pull video IDs from the currently active plan sets so thumbnails are real
  const plan = buildDailyPlan(tmMode);
  const vidMap = {};
  plan.forEach(c => { if (c.videoId) vidMap[c.id] = c.videoId; });

  el.innerHTML = '<div class="hub-cards-wrap">' + HUB_CATS.map(cat => {
    const isRec  = cat.id === recId;
    const vidId  = vidMap[cat.id];
    const thumb  = vidId ? 'https://img.youtube.com/vi/' + vidId + '/mqdefault.jpg' : '';

    // Thumbnail strip (only when video exists)
    const thumbHtml = thumb ? `
      <div class="hub-card-thumb" style="flex-shrink:0;width:72px;height:48px;border-radius:8px;overflow:hidden;background:#000;position:relative">
        <img src="${thumb}" style="width:100%;height:100%;object-fit:cover" loading="lazy" onerror="this.parentElement.style.display='none'">
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35)">
          <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8.5" fill="rgba(0,0,0,.5)"/><polygon points="7,5.5 14,9 7,12.5" fill="#fff"/></svg>
        </div>
      </div>` : '';

    return `
      <div class="hub-card${isRec ? ' hub-card-rec' : ''}" onclick="openTrainSession('${cat.id}')">
        ${thumbHtml || ('<div class="hub-card-icon">' + cat.icon + '</div>')}
        <div class="hub-card-body">
          ${isRec ? '<div class="hub-rec-badge">RECOMMENDED</div>' : ''}
          <div class="hub-card-title">${cat.title}</div>
          <div class="hub-card-sub">${cat.sub}</div>
        </div>
        <div class="hub-card-xp">+${cat.xp} XP</div>
        <div class="hub-card-arr">›</div>
      </div>`;
  }).join('') + '</div>';
}

/* ═══════════════════════════════
   FULL-SCREEN SESSION PANEL
   ═══════════════════════════════ */
function openSessionVideo(catId, itemIdx, techName, techUrl) {
  if (event) event.stopPropagation();
  sessionVideoTech = { catId, itemIdx, techName, techUrl };
  switchSessionTab('video');
  renderSessionBody();
}

function openTrainSession(catId) {
  sessionActiveCat = catId;
  sessionActiveTab = 'checklist';
  const panel = document.getElementById('train-session-panel');
  if (!panel) return;
  const cat   = HUB_CATS.find(c => c.id === catId) || {};
  const titleEl = document.getElementById('tsp-title');
  const xpEl    = document.getElementById('tsp-xp');
  if (titleEl) titleEl.textContent = cat.title || '';
  if (xpEl)    xpEl.textContent    = '+' + (cat.xp || 30) + ' XP';
  // Reset complete button
  const completeBtn = document.getElementById('tsp-complete-btn');
  if (completeBtn) { completeBtn.textContent = 'Complete Drill ✓'; completeBtn.classList.remove('done'); completeBtn.disabled = false; }
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
  _activateSessionTab('checklist');
  renderSessionBody();
}

function closeTrainSession() {
  const panel = document.getElementById('train-session-panel');
  if (panel) panel.classList.remove('open');
  document.body.style.overflow = '';
  sessionActiveCat = null;
}

function switchSessionTab(tab) {
  sessionActiveTab = tab;
  _activateSessionTab(tab);
  renderSessionBody();
}

function _activateSessionTab(tab) {
  document.querySelectorAll('.tsp-tab').forEach(t => t.classList.remove('active'));
  const btn = document.getElementById('tsp-tab-' + tab);
  if (btn) btn.classList.add('active');
}

function renderSessionBody() {
  const el = document.getElementById('tsp-body');
  if (!el || !sessionActiveCat) return;

  const plan = buildDailyPlan(tmMode);
  const cat  = plan.find(c => c.id === sessionActiveCat);

  /* ── CHECKLIST ── */
  if (sessionActiveTab === 'checklist') {
    if (!cat) { el.innerHTML = '<p style="color:#666;padding:24px;text-align:center">No session data</p>'; return; }

    if (cat.quiz) {
      el.innerHTML = '<div style="padding:16px">' + cat.quiz.map((q, qi) => {
        const ansKey  = tmMode + '_' + sessionActiveCat + '_q' + qi;
        const picked  = tmQuizAnswers[ansKey];
        const answered = picked !== undefined;
        return `<div style="margin-bottom:22px">
          <div style="font-size:14px;font-weight:700;color:#dde;line-height:1.45;margin-bottom:10px">${q.q}</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${q.options.map((opt, oi) => {
              let cls = 'tm-quiz-opt';
              if (answered) {
                if (oi === picked) cls += opt.correct ? ' tm-quiz-correct' : ' tm-quiz-wrong';
                else if (opt.correct) cls += ' tm-quiz-correct tm-quiz-correct-reveal';
              }
              return `<button class="${cls}" onclick="tmAnswerQuiz('${sessionActiveCat}',${qi},${oi});renderSessionBody()">${opt.text}</button>`;
            }).join('')}
          </div>
          ${answered ? `<div class="tm-quiz-explain">${q.options[picked].reason}</div>` : ''}
        </div>`;
      }).join('') + '</div>';
      return;
    }

    // Regular checklist items
    const items = cat.items || [];
    const DIFF = ['Beginner','Intermediate','Advanced'];
    const DIFF_COLORS = ['#16a34a','#d97706','#dc2626'];

    el.innerHTML = `
      <div style="padding:14px 16px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#888;margin-bottom:14px">${cat.focus}</div>
        ${items.map((item, i) => {
          const done = !!tmDone[tmMode + '_' + sessionActiveCat + '_' + i];
          const techEntry = item.tech && typeof TECHNIQUES !== 'undefined'
            ? TECHNIQUES.find(t => t.name === item.tech) : null;
          const techUrl = techEntry ? techEntry.url : '';
          const playBtn = techUrl
            ? `<button class="sp-play-btn" onclick="openSessionVideo('${sessionActiveCat}',${i},'${(item.tech||'').replace(/'/g,"\\'")}','${techUrl.replace(/'/g,"\\'")}')">
                <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" stroke="rgba(217,119,6,.5)" stroke-width="1.2" fill="none"/><polygon points="7,5.5 14,9 7,12.5" fill="#d97706"/></svg>
              </button>` : '';
          const diffIdx = i === 0 ? 0 : i === items.length - 1 ? 2 : 1;
          const diffColor = DIFF_COLORS[diffIdx];
          const dots = [0,1,2].map(d => `<span style="width:6px;height:6px;border-radius:50%;background:${d <= diffIdx ? diffColor : 'rgba(255,255,255,.15)'};display:inline-block"></span>`).join('');

          return `<div class="sp-item${done ? ' sp-item-done' : ''}" onclick="tmToggleItem('${sessionActiveCat}',${i});renderSessionBody()">
            <div class="sp-check" style="background:${done?'#d97706':'transparent'}">
              ${done ? '<svg width="11" height="11" viewBox="0 0 11 11"><polyline points="1.5,5.5 4.5,8.5 9.5,2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>' : ''}
            </div>
            <div class="sp-item-body">
              <div class="sp-item-text">${item.text}</div>
              <div class="sp-item-meta">
                <span class="sp-diff-tag" style="background:${diffColor}22;color:${diffColor}">${DIFF[diffIdx]}</span>
                <div style="display:flex;gap:3px">${dots}</div>
              </div>
            </div>
            ${playBtn}
          </div>`;
        }).join('')}
      </div>`;
    return;
  }

  /* ── VIDEO TAB ── */
  if (sessionActiveTab === 'video') {
    // If user tapped a play button, show that technique; otherwise show session overview
    const svt = sessionVideoTech;
    const depth = (svt && typeof TECH_DEPTH !== 'undefined') ? TECH_DEPTH[svt.techName] : null;
    const getVid = url => { if (!url) return ''; const m = (url||'').match(/[?&]v=([^&]+)/)||url.match(/youtu\.be\/([^?]+)/); return m?m[1]:''; };

    if (svt && svt.techUrl) {
      // ── Technique-specific video view ──
      const vidId = getVid(svt.techUrl);
      const thumb = vidId ? `https://img.youtube.com/vi/${vidId}/mqdefault.jpg` : '';
      const keyPoints = depth ? [
        depth.grips,
        ...((depth.mistakes||[]).slice(0,2).map(m => 'Avoid: ' + m.charAt(0).toLowerCase() + m.slice(1)))
      ] : ['Focus on clean entry and full commitment to the throw.'];
      const coachNote = depth ? depth.comp : '';

      el.innerHTML = `<div style="padding:12px 14px 80px">
        <div style="font-size:9px;font-weight:800;letter-spacing:.12em;color:#888;margin-bottom:8px">TECHNIQUE VIDEO</div>
        <div style="border-radius:10px;overflow:hidden;aspect-ratio:16/9;background:#000;margin-bottom:12px;position:relative">
          ${vidId
            ? `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${vidId}?autoplay=1&rel=0&playsinline=1"
                frameborder="0" allow="autoplay;encrypted-media" allowfullscreen style="display:block"></iframe>`
            : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#555;font-size:13px">No video available</div>`}
        </div>

        <div style="font-size:15px;font-weight:800;color:#f0f4ff;margin-bottom:2px">${svt.techName}</div>
        <div style="font-size:11px;color:#666;margin-bottom:14px">${svt.catId ? cat && cat.focus || '' : ''}</div>

        <div style="font-size:9px;font-weight:800;letter-spacing:.12em;color:#888;margin-bottom:8px">KEY POINTS</div>
        ${keyPoints.map(pt => `
          <div style="display:flex;gap:8px;margin-bottom:7px;align-items:flex-start">
            <span style="color:#d97706;font-size:12px;flex-shrink:0;margin-top:1px">✓</span>
            <span style="font-size:12px;color:#dde;line-height:1.45">${pt}</span>
          </div>`).join('')}

        ${coachNote ? `
          <div style="background:rgba(255,255,255,.04);border:.5px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 12px;margin-top:10px">
            <div style="font-size:9px;font-weight:800;letter-spacing:.12em;color:#888;margin-bottom:6px">COACH NOTES</div>
            <div style="font-size:12px;color:#999;line-height:1.6">${coachNote}</div>
          </div>` : ''}

        <button onclick="spIPracticed()" style="width:100%;margin-top:14px;padding:14px;background:#d97706;color:#000;border:none;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer">
          ✓ I Practiced This
        </button>
      </div>`;
    } else {
      // ── No technique selected yet — show session overview video ──
      const videoId = cat && cat.videoId;
      if (videoId) {
        el.innerHTML = `<div style="padding:12px 14px 20px">
          <div style="font-size:9px;font-weight:800;letter-spacing:.12em;color:#888;margin-bottom:8px">SESSION OVERVIEW</div>
          <div style="border-radius:10px;overflow:hidden;aspect-ratio:16/9;background:#000;margin-bottom:10px">
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&playsinline=1"
              frameborder="0" allow="autoplay;encrypted-media" allowfullscreen style="display:block"></iframe>
          </div>
          <div style="font-size:12px;color:#666;line-height:1.5;margin-bottom:12px">${cat.focus || ''}</div>
          <div style="background:rgba(217,119,6,.08);border:.5px solid rgba(217,119,6,.2);border-radius:9px;padding:10px 12px">
            <div style="font-size:11px;color:#d97706;font-weight:700">💡 Tap ▶ next to any drill in Checklist to watch that technique</div>
          </div>
        </div>`;
      } else {
        el.innerHTML = `<div style="padding:40px 24px;text-align:center">
          <div style="font-size:36px;margin-bottom:12px">▶</div>
          <div style="font-size:14px;color:#555;line-height:1.6">Tap the <span style="color:#d97706">▶</span> play button<br>next to any drill in the Checklist tab<br>to watch the technique here.</div>
        </div>`;
      }
    }
    return;
  }

  /* ── NOTES ── */
  if (sessionActiveTab === 'notes') {
    const notesKey = 'judohub_session_notes_' + sessionActiveCat;
    const saved    = localStorage.getItem(notesKey) || '';
    el.innerHTML = `<div style="padding:16px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#888;margin-bottom:10px">SESSION NOTES</div>
      <textarea id="session-notes-ta"
        placeholder="What worked?\nWhat needs work?\nPersonal cues and reminders…"
        style="width:100%;min-height:200px;background:#13131c;border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#f0f4ff;font-size:14px;padding:14px;resize:vertical;font-family:inherit;line-height:1.55;box-sizing:border-box"
        oninput="localStorage.setItem('${notesKey}',this.value)">${saved}</textarea>
    </div>`;
  }
}

function spIPracticed() {
  if (!sessionVideoTech) { switchSessionTab('checklist'); return; }
  const { catId, itemIdx } = sessionVideoTech;
  const key = tmMode + '_' + catId + '_' + itemIdx;
  tmDone[key] = true;
  localStorage.setItem('judohub_tm_done', JSON.stringify(tmDone));
  sessionVideoTech = null;
  switchSessionTab('checklist');
  renderSessionBody();
}

function completeTrainSession() {
  if (!sessionActiveCat) return;
  const btn = document.getElementById('tsp-complete-btn');
  if (btn && btn.disabled) return;
  if (btn) { btn.innerHTML = '&#10003; Session Complete!'; btn.classList.add('done'); btn.disabled = true; }

  const cat    = HUB_CATS.find(c => c.id === sessionActiveCat) || {};
  const xpGain = cat.xp || 30;
  const today  = new Date().toISOString().slice(0,10);

  // ── XP: write to canonical key (judo_xp) that Progress/Home both read ──
  if (typeof addXP === 'function') {
    addXP(xpGain);
  } else {
    const curXP = parseInt(localStorage.getItem('judo_xp') || '0');
    localStorage.setItem('judo_xp', curXP + xpGain);
  }
  // Also keep judohub_xp in sync for the training hub XP display
  const hubXP = parseInt(localStorage.getItem('judohub_xp') || '0');
  localStorage.setItem('judohub_xp', hubXP + xpGain);

  // ── Session log: write to BOTH logs so Progress + streak both update ──
  const hubLog = JSON.parse(localStorage.getItem('judohub_sessions_log') || '[]');
  hubLog.push({ date: today, cat: sessionActiveCat, duration: 20, xp: xpGain });
  localStorage.setItem('judohub_sessions_log', JSON.stringify(hubLog));

  // Also push to canonical judo_session_log so getStreak() / buildOverview() see it
  const mainLog = JSON.parse(localStorage.getItem('judo_session_log') || '[]');
  const catLabel = cat.title || sessionActiveCat;
  mainLog.push({ date: today, category: catLabel, minutes: 20, id: today + '_' + sessionActiveCat });
  localStorage.setItem('judo_session_log', JSON.stringify(mainLog));

  // ── Streak (judohub key for hub display) ──
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
  const lastDay   = localStorage.getItem('judohub_streak_date');
  let   streak    = parseInt(localStorage.getItem('judohub_streak') || '0');
  if (lastDay !== today) {
    streak = (lastDay === yesterday) ? streak + 1 : 1;
    localStorage.setItem('judohub_streak', streak);
    localStorage.setItem('judohub_streak_date', today);
  }

  // XP flash
  const flash = document.createElement('div');
  flash.className = 'xp-flash';
  flash.textContent = '+' + xpGain + ' XP';
  document.body.appendChild(flash);
  setTimeout(() => { try { flash.remove(); } catch(e){} }, 1600);

  if (typeof showToast === 'function') showToast('Session complete! +' + xpGain + ' XP 🏆');

  // Refresh progress & home if open
  setTimeout(() => {
    if (typeof renderProgress === 'function') {
      const pv = document.getElementById('view-progress');
      if (pv && pv.classList.contains('active')) renderProgress();
    }
    if (typeof renderHome === 'function') {
      const hv = document.getElementById('view-home');
      if (hv && hv.classList.contains('active')) renderHome();
    }
  }, 200);

  // Close session then re-render hub so card shows done-today state
  setTimeout(() => {
    closeTrainSession();
    renderTrainingHub();
  }, 1900);
}

/* ═══════════════════════════════
   TECHNIQUES INNER TAB
   ═══════════════════════════════ */
function renderTrainTech() {
  filterTrainTech();
}

function selectTrainTechBelt(el, belt) {
  trainTechBelt = belt;
  document.querySelectorAll('#tr-tech-chips .tbc').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  filterTrainTech();
}
function selectTrainTechCat(el, cat) {
  trainTechBelt = cat;
  document.querySelectorAll('#tr-tech-chips .tbc').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  filterTrainTech();
}

function filterTrainTech() {
  if (typeof TECHNIQUES === 'undefined') return;
  const q    = ((document.getElementById('tr-tech-search') || {}).value || '').toLowerCase();
  const belt = trainTechBelt;
  let list   = TECHNIQUES.slice();
  if (belt) list = list.filter(t => t.sub === belt || t.cat === belt);
  if (q)    list = list.filter(t => (t.name + ' ' + (t.en || '')).toLowerCase().includes(q));

  const countEl = document.getElementById('tr-tech-count');
  if (countEl) countEl.textContent = list.length + ' technique' + (list.length !== 1 ? 's' : '');

  const grid = document.getElementById('tr-tech-grid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = '<div style="padding:40px;text-align:center;color:#666">No techniques found</div>';
    return;
  }

  // Use the coach card renderer from techniques.js when available
  if (typeof techCard === 'function') {
    grid.innerHTML = list.map(t => techCard(t)).join('');
    // Wire up notes textareas
    list.forEach(t => {
      const ta = document.getElementById('note-' + t.name.replace(/[^a-z0-9]/gi,'_'));
      if (ta) {
        ta.value = (typeof techNotes !== 'undefined' && techNotes[t.name]) || '';
        ta.addEventListener('input', function() {
          if (typeof techNotes !== 'undefined') {
            techNotes[t.name] = this.value;
            localStorage.setItem('judo_tech_notes', JSON.stringify(techNotes));
          }
        });
      }
    });
    return;
  }

  // Fallback plain cards
  const getVid = url => {
    if (!url) return '';
    const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
    return m ? m[1] : '';
  };
  grid.innerHTML = list.map(t => {
    const vid   = getVid(t.url || '');
    const thumb = vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : '';
    return `<div style="background:#13131c;border-radius:12px;overflow:hidden;cursor:pointer;border:0.5px solid rgba(255,255,255,0.07)"
      onclick="openGradingVideo('${(t.url||'').replace(/'/g,"\\'")}','${t.name.replace(/'/g,"\\'")}')">
      ${thumb ? `<img src="${thumb}" loading="lazy" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block">` : ''}
      <div style="padding:9px 10px 10px">
        <div style="color:#f0f4ff;font-size:12px;font-weight:700">${t.name}</div>
        <div style="color:#555;font-size:10px;margin-top:2px">${t.en || ''}</div>
      </div>
    </div>`;
  }).join('');
}

/* ═══════════════════════════════
   RANDORI BRAIN INNER TAB
   ═══════════════════════════════ */
function renderTrainRandori() {
  const el = document.getElementById('tp-randori');
  if (!el) return;

  const SCENARIOS = [
    { icon:'🤜', title:'Grip Battle',         sub:'Establish dominant kumi-kata',        tags:['Attack','Kumi-kata'],  color:'#e53935' },
    { icon:'🔄', title:'Kuzushi Drills',      sub:'Break balance before every throw',    tags:['Kuzushi','Entry'],     color:'#d97706' },
    { icon:'🦵', title:'Leg Attack Flows',    sub:'Ashi-waza combination chains',        tags:['Ashi-waza','Combo'],   color:'#3b82f6' },
    { icon:'🧩', title:'Combination Plays',   sub:'Feint to set up, commit to finish',   tags:['Combo','Timing'],      color:'#22c55e' },
    { icon:'🛡', title:'Counter Strategies',  sub:'Read and counter common entries',     tags:['Counter','Defence'],   color:'#8b5cf6' },
    { icon:'🤼', title:'Ne Waza Transitions', sub:'Seamless tachi to ground flow',       tags:['Ne-waza','Osaekomi'],  color:'#f97316' },
    { icon:'🧠', title:'Contest Mindset',     sub:'Score management and time awareness', tags:['Mental','Contest'],    color:'#ec4899' },
    { icon:'📐', title:'Scouting Patterns',   sub:'Read opponent tendencies early',      tags:['Tactics','Scout'],     color:'#14b8a6' },
  ];

  var cards = SCENARIOS.map(function(s) {
    var tagHtml = s.tags.map(function(tag) {
      return '<span style="background:'+s.color+'18;color:'+s.color+';border:0.5px solid '+s.color+'40;border-radius:5px;font-size:9px;font-weight:700;padding:2px 7px">'+tag+'</span>';
    }).join('');
    return '<div style="background:#13131c;border-radius:14px;padding:13px 14px;margin-bottom:9px;border:0.5px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:12px;cursor:pointer" onclick="showView(\'randori\')">'
      + '<div style="width:42px;height:42px;border-radius:11px;background:'+s.color+'18;border:1px solid '+s.color+'40;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">'+s.icon+'</div>'
      + '<div style="flex:1;min-width:0">'
      + '<div style="color:#f0f4ff;font-size:13px;font-weight:700;margin-bottom:3px">'+s.title+'</div>'
      + '<div style="color:#555;font-size:11px;line-height:1.35;margin-bottom:6px">'+s.sub+'</div>'
      + '<div style="display:flex;gap:5px">'+tagHtml+'</div>'
      + '</div>'
      + '<svg width="14" height="14" viewBox="0 0 16 16" style="flex-shrink:0;opacity:.25"><polyline points="5,2 11,8 5,14" fill="none" stroke="#f0f4ff" stroke-width="2.5" stroke-linecap="round"/></svg>'
      + '</div>';
  }).join('');

  el.innerHTML = '<div style="padding:12px 14px 80px">'
    + '<div style="font-size:10px;font-weight:800;letter-spacing:.12em;color:#666;margin-bottom:4px">RANDORI BRAIN</div>'
    + '<div style="font-size:12px;color:#444;margin-bottom:14px">Tactical awareness &amp; contest intelligence</div>'
    + cards
    + '<div style="background:#1a0d04;border:0.5px solid rgba(217,119,6,.3);border-radius:14px;padding:13px 14px;margin-top:4px;display:flex;align-items:center;gap:12px;cursor:pointer" onclick="showView(\'randori\')">'
    + '<span style="font-size:22px">🧠</span>'
    + '<div style="flex:1">'
    + '<div style="color:#d97706;font-size:12px;font-weight:800">Open Full Randori Brain &#8594;</div>'
    + '<div style="color:#555;font-size:10px;margin-top:2px">AI scenarios, live feedback &amp; sparring analysis</div>'
    + '</div></div></div>';
}
