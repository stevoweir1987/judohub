// ── LESSONS.JS — Lesson view, Unit Exam, Lesson Complete ─────────────────

var _selectedLessonOption = null;

// ── CSS injected once ─────────────────────────────────────────────────────
(function() {
  var s = document.createElement('style');
  s.textContent = [
    '.lesson-quiz-option{width:100%;padding:16px;background:#201f1f;border:2px solid #353534;border-radius:12px;text-align:left;font-size:14px;font-weight:700;color:#e5e2e1;cursor:pointer;font-family:inherit;transition:border-color .15s,background .15s;-webkit-tap-highlight-color:transparent}',
    '.lesson-quiz-option:active{transform:translateY(2px)}',
    '@keyframes lesson-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}',
    '@keyframes lesson-celebrate{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}',
    '@keyframes lesson-float-up{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-100vh) rotate(720deg);opacity:0}}',
    '@keyframes exam-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
  ].join('');
  document.head.appendChild(s);
})();

// ─────────────────────────────────────────────────────────────────────────
// OPEN LESSON
// ─────────────────────────────────────────────────────────────────────────
function openLesson(techName) {
  _selectedLessonOption = null;

  var tech      = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(function(t){ return t.name === techName; }) : null;
  var beltItems = (typeof getContinueLearningItems === 'function') ? getContinueLearningItems() : [];
  var beltItem  = beltItems.find(function(i){ return i.name === techName; });

  var rawUrl = (tech && tech.url) ? tech.url
             : (typeof GRADING_VIDEOS !== 'undefined' && GRADING_VIDEOS[techName]) ? GRADING_VIDEOS[techName]
             : null;
  var vid   = rawUrl ? getVideoId(rawUrl) : null;
  var thumb = vid ? ('https://img.youtube.com/vi/' + vid + '/mqdefault.jpg') : null;
  var en    = tech ? (tech.en || tech.english || tech.translation || '') : '';
  var cat   = tech ? (tech.sub || tech.subcategory || tech.cat || tech.category || '') : '';

  var questionText = 'What is this technique called?';
  if (cat) {
    var lc = cat.toLowerCase();
    if (lc.indexOf('throw') > -1 || lc.indexOf('nage') > -1)        questionText = 'What is the name of this throw?';
    else if (lc.indexOf('hold') > -1 || lc.indexOf('osae') > -1)    questionText = 'What is the name of this hold?';
    else if (lc.indexOf('strangle') > -1 || lc.indexOf('shime') > -1) questionText = 'What is the name of this strangle?';
  }

  // Distractors from same belt or fallback
  var distractors = [];
  var others = beltItems.filter(function(i){ return i.name !== techName; });
  others.sort(function(){ return Math.random() - 0.5; });
  distractors = others.slice(0, 2).map(function(i){ return i.name; });
  var fallbacks = ['O-Goshi','Seoi-Nage','Tai-Otoshi','Harai-Goshi','De-Ashi-Barai','Kesa-Gatame','Uchi-Mata'];
  while (distractors.length < 2) {
    var d = fallbacks.find(function(f){ return f !== techName && distractors.indexOf(f) === -1; });
    if (d) distractors.push(d); else break;
  }
  var options = [techName].concat(distractors.slice(0,2)).sort(function(){ return Math.random() - 0.5; });

  var hint = en ? 'This technique is known in English as "' + en + '". Watch the body position carefully.'
                : 'Watch the key movement — identify the direction of force and which body part leads.';

  var key    = beltItem ? beltItem.key    : null;
  var beltId = beltItem ? beltItem.beltId : null;
  var xp     = (typeof getXP === 'function') ? getXP() : 0;

  // Video or thumbnail
  var mediaHtml;
  if (thumb) {
    mediaHtml = '<div style="position:relative;border-radius:12px;overflow:hidden;margin-bottom:20px;background:#0e0e0e;cursor:pointer" onclick="_openVideoForLesson(\'' + vid + '\')">'
      + '<img src="' + thumb + '" style="width:100%;display:block;opacity:.85" alt="' + techName + '" onerror="this.style.display=\'none\'">'
      + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">'
        + '<div style="width:64px;height:64px;background:#ff5262;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 0 #920022">'
          + '<span style="color:white;font-size:24px;margin-left:4px">▶</span>'
        + '</div>'
      + '</div>'
      + '<div style="position:absolute;bottom:10px;left:10px;background:rgba(53,53,52,.9);color:#e5e2e1;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:4px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.1)">Instructional View</div>'
      + '</div>';
  } else {
    mediaHtml = '<div style="height:160px;background:#1c1b1b;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;border:1px solid #353534"><span style="font-size:56px">🥋</span></div>';
  }

  var optionsHtml = options.map(function(opt){
    var safe = opt.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return '<button class="lesson-quiz-option" onclick="selectLessonOption(this,\'' + safe + '\')">' + opt + '</button>';
  }).join('');

  var safeKey    = (key    || '').replace(/'/g,"\\'");
  var safeBeltId = (beltId || '').replace(/'/g,"\\'");
  var safeName   = techName.replace(/\\/g,'\\\\').replace(/'/g,"\\'");

  var html = '<div id="lesson-overlay" class="dark font-jakarta" style="position:fixed;inset:0;z-index:1000;background:#131313;display:flex;flex-direction:column;font-family:\'Plus Jakarta Sans\',sans-serif;overflow:hidden">'

    + '<header style="position:sticky;top:0;z-index:10;background:#131313;border-bottom:3px solid #353534;display:flex;justify-content:space-between;align-items:center;padding:12px 20px;flex-shrink:0">'
      + '<div style="display:flex;align-items:center;gap:12px">'
        + '<button onclick="closeLessonOverlay()" style="background:none;border:none;color:#e5bdbd;cursor:pointer;padding:4px;display:flex"><span class="material-symbols-outlined">close</span></button>'
        + '<div style="flex:1;min-width:120px;max-width:200px;height:10px;background:#353534;border-radius:9999px;overflow:hidden"><div style="height:100%;background:#ff5262;width:70%;box-shadow:0 0 8px rgba(255,82,98,.5)"></div></div>'
      + '</div>'
      + '<span style="font-size:13px;font-weight:700;color:#ffb3b3">' + xp + ' XP • 5 ❤️</span>'
    + '</header>'

    + '<div style="flex:1;overflow-y:auto;padding:20px 20px 180px">'
      + '<h1 style="font-size:22px;font-weight:800;color:#e5e2e1;margin:0 0 4px;letter-spacing:-.5px">' + techName + '</h1>'
      + (en ? '<p style="font-size:14px;font-weight:700;color:#e5bdbd;margin:0 0 20px">' + en + '</p>' : '<div style="margin-bottom:20px"></div>')
      + mediaHtml
      + '<h2 style="font-size:20px;font-weight:800;color:#e5e2e1;margin:0 0 16px;letter-spacing:-.3px">' + questionText + '</h2>'
      + '<div id="lesson-options" style="display:flex;flex-direction:column;gap:12px">' + optionsHtml + '</div>'
      + '<div style="margin-top:20px;padding:16px;background:rgba(71,71,71,.25);border-radius:12px;border:1px solid #474747;display:flex;gap:12px;align-items:flex-start">'
        + '<span class="material-symbols-outlined ms-fill" style="color:#ff5262;flex-shrink:0">lightbulb</span>'
        + '<p style="font-size:13px;color:#e5bdbd;margin:0;font-style:italic;line-height:1.5">' + hint + '</p>'
      + '</div>'
    + '</div>'

    // CHECK button
    + '<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(19,19,19,.97);backdrop-filter:blur(8px);padding:16px 20px 36px;border-top:2px solid #353534">'
      + '<button id="lesson-check-btn" disabled onclick="handleLessonCheck(\'' + safeKey + '\',\'' + safeBeltId + '\',\'' + safeName + '\')" style="width:100%;height:52px;background:#ff5262;color:white;border:none;border-radius:12px;font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;cursor:pointer;opacity:.35;box-shadow:0 4px 0 #920022;transition:opacity .2s;font-family:inherit">CHECK</button>'
    + '</div>'

    // Success overlay (hidden under fold)
    + '<div id="lesson-success" style="position:absolute;bottom:0;left:0;right:0;background:#2a2a2a;border-top:4px solid #22c55e;padding:20px 20px 52px;z-index:20;transform:translateY(100%);transition:transform .3s ease">'
      + '<div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">'
        + '<div style="width:48px;height:48px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0"><span class="material-symbols-outlined ms-fill" style="color:white;font-size:28px">check_circle</span></div>'
        + '<div><div style="font-size:18px;font-weight:800;color:#22c55e">Amazing Work!</div><div style="font-size:13px;color:#e5bdbd">You\'ve identified the technique correctly.</div></div>'
      + '</div>'
      + '<button onclick="completeLessonAndContinue(\'' + safeKey + '\',\'' + safeName + '\')" style="width:100%;height:52px;background:#22c55e;color:white;border:none;border-radius:12px;font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;cursor:pointer;box-shadow:0 4px 0 #15803d;font-family:inherit">CONTINUE</button>'
    + '</div>'

  + '</div>';

  document.body.insertAdjacentHTML('beforeend', html);
}

function _openVideoForLesson(vid) {
  if (!vid) return;
  window.open('https://www.youtube.com/watch?v=' + vid, '_blank');
}

function selectLessonOption(el, value) {
  document.querySelectorAll('.lesson-quiz-option').forEach(function(opt){
    opt.style.borderColor = '#353534';
    opt.style.background  = '#201f1f';
    opt.style.boxShadow   = 'none';
  });
  el.style.borderColor = '#ff5262';
  el.style.background  = 'rgba(255,82,98,.15)';
  el.style.boxShadow   = '0 4px 0 #920022';
  _selectedLessonOption = value;
  var btn = document.getElementById('lesson-check-btn');
  if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
}

function handleLessonCheck(key, beltId, correctName) {
  if (!_selectedLessonOption) return;
  if (_selectedLessonOption === correctName) {
    var s = document.getElementById('lesson-success');
    if (s) { s.style.transform = 'translateY(0)'; }
  } else {
    var opts = document.getElementById('lesson-options');
    if (opts) { opts.style.animation = 'lesson-shake .4s ease-in-out'; setTimeout(function(){ if(opts) opts.style.animation=''; }, 400); }
    _selectedLessonOption = null;
    document.querySelectorAll('.lesson-quiz-option').forEach(function(opt){
      opt.style.borderColor = '#353534'; opt.style.background = '#201f1f'; opt.style.boxShadow = 'none';
    });
    var btn = document.getElementById('lesson-check-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '.35'; }
  }
}

function completeLessonAndContinue(key, techName) {
  if (key && typeof beltProgress !== 'undefined') {
    beltProgress[key] = true;
    localStorage.setItem('judo_belt_progress', JSON.stringify(beltProgress));
  }
  if (typeof addXP === 'function') addXP(10);
  closeLessonOverlay();
  showLessonComplete(techName);
}

function closeLessonOverlay() {
  _selectedLessonOption = null;
  var el = document.getElementById('lesson-overlay');
  if (el) el.remove();
}

// ─────────────────────────────────────────────────────────────────────────
// LESSON COMPLETE
// ─────────────────────────────────────────────────────────────────────────
function showLessonComplete(techName) {
  var xp         = (typeof getXP === 'function') ? getXP() : 0;
  var activeBelt = (typeof getActiveBeltInfo === 'function') ? getActiveBeltInfo() : null;
  var pct        = activeBelt ? activeBelt.pct : 0;
  var beltLabel  = activeBelt ? (activeBelt.belt.from + ' Belt Progress') : 'Belt Progress';
  var beltHex    = (typeof BELT_HEX !== 'undefined' && activeBelt) ? (BELT_HEX[activeBelt.belt.fromColor] || '#f59e0b') : '#f59e0b';

  var html = '<div id="lesson-complete-overlay" class="dark font-jakarta" style="position:fixed;inset:0;z-index:1001;background:#131313;display:flex;flex-direction:column;font-family:\'Plus Jakarta Sans\',sans-serif;overflow:hidden">'
    + '<div id="lesson-confetti" style="position:fixed;inset:0;pointer-events:none;z-index:10"></div>'

    + '<header style="background:#131313;border-bottom:3px solid #353534;display:flex;justify-content:center;align-items:center;padding:16px 20px;flex-shrink:0">'
      + '<span style="font-size:22px;font-weight:800;color:#ff5262;text-transform:uppercase;letter-spacing:-.5px">JUDOHUB</span>'
    + '</header>'

    + '<main style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 20px;text-align:center;gap:20px;max-width:28rem;margin:0 auto;width:100%;overflow-y:auto">'

      + '<div style="position:relative;animation:lesson-celebrate .6s cubic-bezier(.175,.885,.32,1.275)">'
        + '<div style="width:180px;height:180px;border-radius:50%;background:linear-gradient(to bottom,rgba(255,82,98,.2),transparent);display:flex;align-items:center;justify-content:center"><span style="font-size:90px">🥋</span></div>'
        + '<div style="position:absolute;top:-8px;right:-8px;background:#fbbf24;color:#131313;padding:4px 14px;border-radius:9999px;font-size:13px;font-weight:800;transform:rotate(12deg);box-shadow:0 4px 12px rgba(0,0,0,.4)">EXCELLENT!</div>'
      + '</div>'

      + '<div>'
        + '<h2 style="font-size:30px;font-weight:800;color:#e5e2e1;margin:0 0 6px;text-transform:uppercase;letter-spacing:-1px">Lesson Complete!</h2>'
        + '<p style="font-size:15px;color:#e5bdbd;margin:0">You\'re mastering the ' + techName + ' technique.</p>'
      + '</div>'

      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%">'
        + '<div style="background:#2c2c2c;border-radius:12px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:4px;border-top:1px solid rgba(255,255,255,.1)">'
          + '<span style="font-size:11px;font-weight:700;color:#ff5262;text-transform:uppercase;letter-spacing:.08em">Total XP</span>'
          + '<div style="display:flex;align-items:center;gap:6px"><span class="material-symbols-outlined ms-fill" style="color:#ff5262">bolt</span><span style="font-size:28px;font-weight:800;color:white">+10</span></div>'
        + '</div>'
        + '<div style="background:#2c2c2c;border-radius:12px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:4px;border-top:1px solid rgba(255,255,255,.1)">'
          + '<span style="font-size:11px;font-weight:700;color:#fbbf24;text-transform:uppercase;letter-spacing:.08em">Accuracy</span>'
          + '<div style="display:flex;align-items:center;gap:6px"><span class="material-symbols-outlined ms-fill" style="color:#fbbf24">target</span><span style="font-size:28px;font-weight:800;color:white">100%</span></div>'
        + '</div>'
      + '</div>'

      + '<div style="background:#2c2c2c;border-radius:12px;width:100%;padding:16px;border-top:1px solid rgba(255,255,255,.1)">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'
          + '<span style="font-size:12px;font-weight:700;color:#e5bdbd;text-transform:uppercase;letter-spacing:.05em">' + beltLabel + '</span>'
          + '<span style="font-size:14px;font-weight:700;color:#e5e2e1">' + pct + '%</span>'
        + '</div>'
        + '<div style="height:14px;background:#201f1f;border-radius:9999px;overflow:hidden;border:2px solid #353534">'
          + '<div id="lc-progress-fill" style="height:100%;border-radius:9999px;background:' + beltHex + ';width:0%;box-shadow:0 0 10px rgba(245,158,11,.4);transition:width 1.2s ease-out"></div>'
        + '</div>'
      + '</div>'

    + '</main>'

    + '<footer style="padding:20px;padding-bottom:40px;background:rgba(19,19,19,.9);backdrop-filter:blur(4px);flex-shrink:0">'
      + '<div style="max-width:28rem;margin:0 auto">'
        + '<button onclick="closeLessonComplete()" style="width:100%;padding:18px;background:#e62946;color:white;border:none;border-radius:12px;font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;cursor:pointer;box-shadow:0 4px 0 #a4161a;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit">CONTINUE <span class="material-symbols-outlined" style="font-size:20px">arrow_forward</span></button>'
      + '</div>'
    + '</footer>'
  + '</div>';

  document.body.insertAdjacentHTML('beforeend', html);
  setTimeout(function(){
    var fill = document.getElementById('lc-progress-fill');
    if (fill) fill.style.width = pct + '%';
    _launchConfetti();
  }, 300);
}

function closeLessonComplete() {
  var el = document.getElementById('lesson-complete-overlay');
  if (el) el.remove();
  if (typeof renderHome === 'function') renderHome();
}

// ─────────────────────────────────────────────────────────────────────────
// UNIT EXAM
// ─────────────────────────────────────────────────────────────────────────
function openExam() {
  var activeBelt = (typeof getActiveBeltInfo === 'function') ? getActiveBeltInfo() : null;
  var beltItems  = (typeof getContinueLearningItems === 'function') ? getContinueLearningItems() : [];
  var doneCount  = beltItems.filter(function(i){ return i.done; }).length;
  var totalCount = beltItems.length;
  var pct        = totalCount ? Math.round(doneCount / totalCount * 100) : 0;
  var unitName   = activeBelt ? (activeBelt.belt.from.toUpperCase() + ' BELT MASTERY') : 'WHITE BELT MASTERY';
  var xp         = (typeof getXP === 'function') ? getXP() : 0;

  var html = '<div id="exam-overlay" class="dark font-jakarta" style="position:fixed;inset:0;z-index:1000;background:#131313;display:flex;flex-direction:column;font-family:\'Plus Jakarta Sans\',sans-serif;overflow:hidden">'

    + '<div style="position:fixed;inset:0;pointer-events:none;z-index:-1;overflow:hidden;opacity:.3"><div style="position:absolute;width:150%;height:150%;top:-25%;right:-25%;background:radial-gradient(circle at center,#680016 0%,transparent 60%)"></div></div>'

    + '<header style="position:sticky;top:0;z-index:10;background:#131313;border-bottom:3px solid #353534;display:flex;justify-content:space-between;align-items:center;padding:12px 20px;flex-shrink:0">'
      + '<div style="display:flex;align-items:center;gap:12px">'
        + '<button onclick="closeExamOverlay()" style="background:none;border:none;color:#e5bdbd;cursor:pointer;padding:4px;display:flex"><span class="material-symbols-outlined">close</span></button>'
        + '<div style="width:160px;height:10px;background:#353534;border-radius:9999px;overflow:hidden"><div style="height:100%;background:#ff5262;width:100%;box-shadow:0 0 8px rgba(255,82,98,.5)"></div></div>'
      + '</div>'
      + '<span style="font-size:13px;font-weight:700;color:#ffb3b3">' + xp + ' XP • 5 ❤️</span>'
    + '</header>'

    + '<main style="flex:1;overflow-y:auto;max-width:28rem;margin:0 auto;width:100%;padding:24px 20px 200px;display:flex;flex-direction:column;align-items:center;text-align:center">'

      + '<div style="margin-bottom:20px;width:100%">'
        + '<h2 style="font-size:22px;font-weight:800;color:#ffdad9;text-transform:uppercase;letter-spacing:-.5px;margin:0 0 4px">UNIT 1 EXAM</h2>'
        + '<p style="font-size:12px;font-weight:700;color:#e5bdbd;text-transform:uppercase;letter-spacing:.12em;margin:0">' + unitName + '</p>'
      + '</div>'

      + '<div style="position:relative;width:260px;height:260px;display:flex;align-items:center;justify-content:center;margin-bottom:20px">'
        + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:.2">'
          + '<div style="width:240px;height:240px;border:4px dashed #ffb3b3;border-radius:50%;animation:exam-spin 20s linear infinite"></div>'
          + '<div style="position:absolute;width:180px;height:180px;border:2px solid #ffb3b3;border-radius:50%;opacity:.5"></div>'
        + '</div>'
        + '<div style="position:relative;z-index:1;width:180px;height:180px;border-radius:50%;background:#2c2c2c;border-bottom:8px solid #1a1a1a;display:flex;align-items:center;justify-content:center;border-top:1px solid rgba(255,255,255,.1)">'
          + '<span class="material-symbols-outlined ms-fill" style="font-size:80px;color:#E62946;filter:drop-shadow(0 0 15px rgba(230,41,70,.6))">grade</span>'
        + '</div>'
        + '<div style="position:absolute;top:30px;right:0;background:#2a2a2a;padding:8px;border-radius:10px;border-bottom:4px solid #353534;display:flex;align-items:center;gap:4px;transform:rotate(12deg)">'
          + '<span class="material-symbols-outlined" style="color:#ffb3b3;font-size:18px">timer</span>'
          + '<div><div style="font-size:16px;font-weight:800;color:#e5e2e1;line-height:1">5</div><div style="font-size:9px;font-weight:700;color:#8f909c">MIN</div></div>'
        + '</div>'
        + '<div style="position:absolute;bottom:30px;left:0;background:#2a2a2a;padding:8px;border-radius:10px;border-bottom:4px solid #353534;display:flex;align-items:center;gap:4px;transform:rotate(-12deg)">'
          + '<span class="material-symbols-outlined" style="color:#ffb3b3;font-size:18px">military_tech</span>'
          + '<span style="font-size:11px;font-weight:700;color:#e5e2e1">LEGENDARY</span>'
        + '</div>'
      + '</div>'

      + '<div style="background:#2c2c2c;border-radius:16px;padding:20px;margin-bottom:20px;width:100%;text-align:left;border-bottom:8px solid #000;border-top:1px solid rgba(255,255,255,.1)">'
        + '<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:16px">'
          + '<div style="background:rgba(255,82,98,.15);padding:10px;border-radius:10px;flex-shrink:0"><span class="material-symbols-outlined" style="color:#ff5262">format_list_bulleted</span></div>'
          + '<div><div style="font-size:18px;font-weight:800;color:#e5e2e1;margin-bottom:4px">Final Challenge</div><div style="font-size:13px;color:#e5bdbd;line-height:1.4">Prove your mastery to unlock the next unit. Complete ' + totalCount + ' techniques.</div></div>'
        + '</div>'
        + '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:#1c1b1b;border-radius:10px">'
          + '<div style="display:flex;align-items:center;gap:10px"><span class="material-symbols-outlined" style="color:#ff5262">fitness_center</span><span style="font-size:13px;font-weight:700;color:#e5e2e1">Techniques Completed</span></div>'
          + '<span style="font-size:13px;font-weight:700;color:#ff5262">' + doneCount + '/' + totalCount + '</span>'
        + '</div>'
      + '</div>'

      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%">'
        + '<div style="background:#2c2c2c;border-radius:16px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:4px;border-bottom:4px solid #000;border-top:1px solid rgba(255,255,255,.1)">'
          + '<span style="font-size:9px;font-weight:700;color:#8f909c;text-transform:uppercase;letter-spacing:.12em">Progress</span>'
          + '<span style="font-size:28px;font-weight:800;color:#ffb3b3">' + pct + '%</span>'
        + '</div>'
        + '<div style="background:#2c2c2c;border-radius:16px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:4px;border-bottom:4px solid #000;border-top:1px solid rgba(255,255,255,.1)">'
          + '<span style="font-size:9px;font-weight:700;color:#8f909c;text-transform:uppercase;letter-spacing:.12em">XP Reward</span>'
          + '<span style="font-size:28px;font-weight:800;color:#ffb3b3">+150</span>'
        + '</div>'
      + '</div>'

    + '</main>'

    + '<div style="position:absolute;bottom:0;left:0;right:0;background:#131313;border-top:3px solid #353534;padding:16px 20px 36px">'
      + '<div style="max-width:28rem;margin:0 auto;display:flex;flex-direction:column;gap:12px">'
        + '<button onclick="showView(\'belt\');closeExamOverlay()" style="width:100%;padding:16px;background:#E62946;color:white;border:none;border-radius:14px;font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;cursor:pointer;box-shadow:0 4px 0 #a4161a;font-family:inherit">START EXAM</button>'
        + '<button onclick="closeExamOverlay()" style="width:100%;padding:10px;background:transparent;border:none;font-size:13px;font-weight:700;color:#8f909c;text-transform:uppercase;letter-spacing:.08em;cursor:pointer;font-family:inherit">MAYBE LATER</button>'
      + '</div>'
    + '</div>'

  + '</div>';

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeExamOverlay() {
  var el = document.getElementById('exam-overlay');
  if (el) el.remove();
}

// ─────────────────────────────────────────────────────────────────────────
// CONFETTI
// ─────────────────────────────────────────────────────────────────────────
function _launchConfetti() {
  var container = document.getElementById('lesson-confetti');
  if (!container) return;
  var colors = ['#E62946','#FFD700','#FFFFFF','#FFB3B3','#22c55e'];
  for (var i = 0; i < 60; i++) {
    (function(){
      var p = document.createElement('div');
      var size = Math.random() * 8 + 4;
      p.style.cssText = 'position:absolute;pointer-events:none;width:' + size + 'px;height:' + size + 'px;background:' + colors[Math.floor(Math.random()*colors.length)] + ';left:' + (Math.random()*100) + 'vw;top:100vh;border-radius:' + (Math.random()>.5?'50%':'2px');
      var dur = Math.random()*2+2, delay = Math.random()*.5;
      p.style.animation = 'lesson-float-up ' + dur + 's ease-out ' + delay + 's forwards';
      container.appendChild(p);
      setTimeout(function(){ if(p.parentNode) p.remove(); }, (dur+delay)*1000);
    })();
  }
}
