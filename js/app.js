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
                   randori:'Randori Brain', builder:'Training Builder' };
  const logoEl = document.querySelector('.app-logo span');
  if (logoEl) logoEl.textContent = titles[name] || 'JudoHub';

  if (name === 'builder')  renderWeek();
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
