// ═══════════════════════════════════════════════════
//  dojo_lesson.js — Lesson View, Quiz & Navigation
// ═══════════════════════════════════════════════════

const DojoLesson = (() => {

  // Current lesson state
  let _beltId   = '';
  let _itemName = '';
  let _beltIdx  = 0;
  let _videoUrl = '';
  let _returnScreen = 'home';
  let _quizCorrectAnswer = '';
  let _selectedAnswer    = '';
  let _answered          = false;
  let _quizAttemptCount  = 0;   // increments on retry to rotate question types

  // ── Technique metadata helpers ────────────────────

  // Get English translation from BELT_TERMINOLOGY or infer from combined data
  function _getTranslation(name) {
    if (typeof TERMS_EN !== 'undefined' && TERMS_EN[name]) {
      return TERMS_EN[name];
    }
    // Fallback: strip dashes and capitalise
    return name.replace(/-/g, ' ');
  }

  // Alias map — BELT_DATA spelling → TECHNIQUES spelling
  const _VIDEO_ALIASES = {
    'Deashi-barai':           'Deashi-harai',
    'Okuri-ashi-barai':       'Okuri-ashi-harai',
    'Osoto-otoshi':           'O-soto-otoshi',
    'Sasae-tsuri-komi-ashi':  'Sasae-tsurikomi-ashi',
    'Morote-eri-seoi-nage':   'Morote-seoi-nage',
    'San-gaku-jime':          'Sankaku-jime',
    'San-gaku-gatame':        'Sankaku-gatame',
    'San-gaku-osae-gatame':   'Sankaku-gatame',
    'Soto-maki-komi':         'Soto-makikomi',
    'Ko-uchi-gake-maki-komi': 'Ko-uchi-makikomi',
    'Ude-gatame':             'Ude-garami',
    'Mae Ukemi':              'Mae-ukemi',
    'Ushiro Ukemi':           'Ushiro-ukemi',
    'Yoko Ukemi':             'Yoko-ukemi',
    'Mae Mawari Ukemi (3 Versions)': 'Mae-ukemi',
    'Koshi-jime':             'Hadaka-jime',
    'Kata-te-jime':           'Kata-juji-jime',
    'Juji-gatame — sit-back entry':       'Juji-gatame',
    'Juji-gatame — rollover entry':       'Juji-gatame',
    'Juji-gatame — over-the-shoulder entry': 'Juji-gatame',
    'Juji-gatame — entry from beneath':   'Juji-gatame',
    'Sumi-gaeshi — two variations':       'Sumi-gaeshi',
    'Counter Koshi-guruma with Ura-nage': 'Ura-nage',
  };

  // Normalise a name for loose matching: lowercase, strip hyphens/spaces
  function _norm(s) { return s.toLowerCase().replace(/[-\s]/g, ''); }

  // Get video URL — multi-strategy lookup
  function _getVideoUrl(name) {
    if (!name) return '';
    // 1. GRADING_VIDEOS exact
    if (typeof GRADING_VIDEOS !== 'undefined' && GRADING_VIDEOS[name]) return GRADING_VIDEOS[name];

    if (typeof TECHNIQUES === 'undefined') return '';

    // Helper: find in TECHNIQUES by name string
    const find = n => TECHNIQUES.find(t => t.name === n || t.name.toLowerCase() === n.toLowerCase());

    // 2. Exact match
    let t = find(name);
    if (t && t.url) return t.url;

    // 3. Strip " — English translation" suffix  (e.g. "O-soto-gari — Major Outer Reaping")
    const stripped = name.split(' — ')[0].trim();
    if (stripped !== name) {
      t = find(stripped);
      if (t && t.url) return t.url;
    }

    // 4. Alias map
    const aliased = _VIDEO_ALIASES[stripped] || _VIDEO_ALIASES[name];
    if (aliased) {
      t = find(aliased);
      if (t && t.url) return t.url;
    }

    // 5. Normalised match (handles hyphen/spacing variants)
    const normName = _norm(stripped);
    t = TECHNIQUES.find(t => _norm(t.name) === normName);
    if (t && t.url) return t.url;

    // 6. Combination items (e.g. "Osoto-otoshi into Kesa-gatame") — use first technique
    const firstPart = stripped.split(/\s+into\s+|\s+→\s+|\s+countered\s+/i)[0].trim();
    if (firstPart !== stripped) {
      t = find(firstPart) || TECHNIQUES.find(t => _norm(t.name) === _norm(firstPart));
      if (t && t.url) return t.url;
    }

    return '';
  }

  // Extract YouTube video ID from various URL formats
  function _ytId(url) {
    if (!url) return '';
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
  }

  // Extract start-time (seconds) from YouTube ?t= or &t= param
  function _ytStart(url) {
    if (!url) return 0;
    const m = url.match(/[?&]t=(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  // Get sub-category label for a technique name
  function _getSubCat(name) {
    if (typeof JUDO_TECHNIQUES !== 'undefined') {
      const t = JUDO_TECHNIQUES.find(t => t.Name === name);
      if (t && t['Sub-category']) return t['Sub-category'];
    }
    // Infer from belt group title
    if (typeof BELT_DATA !== 'undefined') {
      for (const belt of BELT_DATA) {
        for (const group of belt.groups) {
          if (group.items.includes(name)) {
            const t = group.title;
            if (t.includes('Tachi-waza') || t.includes('Fundamental')) return 'Tachi-waza';
            if (t.includes('Ne-waza')) return 'Ne-waza';
            if (t.includes('Osaekomi')) return 'Osaekomi-waza';
            if (t.includes('Kansetsu')) return 'Kansetsu-waza';
            if (t.includes('Shime'))    return 'Shime-waza';
            if (t.includes('Ukemi'))    return 'Ukemi';
          }
        }
      }
    }
    return '';
  }

  // ── Technical Breakdown / Mistakes / Tips ────────
  // Data lives in TECHNIQUE_DATA (data.js) — these helpers fall back gracefully

  function _getBreakdown(name) {
    const td = (typeof TECHNIQUE_DATA !== 'undefined') ? TECHNIQUE_DATA[name] : null;
    if (td && td.steps) return td.steps;
    return [
      ['front_hand', 'Kuzushi',  'Break uke\'s balance before committing.'],
      ['rotate_right','Tsukuri', 'Precise entry and body positioning.'],
      ['trending_up', 'Kake',    'Commit fully and complete the technique.']
    ];
  }

  function _getMistakes(name) {
    const td = (typeof TECHNIQUE_DATA !== 'undefined') ? TECHNIQUE_DATA[name] : null;
    if (td && td.mistakes) return td.mistakes;
    return [
      ['Incomplete kuzushi', 'Attempting the technique without first breaking uke\'s balance.'],
      ['Rushing the entry',  'Speed without structure leads to uke countering or escaping.']
    ];
  }

  function _getTip(name) {
    const td = (typeof TECHNIQUE_DATA !== 'undefined') ? TECHNIQUE_DATA[name] : null;
    if (td && td.tip) return td.tip;
    return 'Focus on kuzushi (balance breaking) before committing to any technique.';
  }

  // ── Quiz generation ───────────────────────────────
  // Question format: "What does [name] mean?" → correct answer = translation
  // Distractors: 2 random other translations from BELT_TERMINOLOGY

  // ── Category display labels ──────────────────────
  const CAT_LABELS = {
    ukemi:    'Breakfall (Ukemi)',
    throw:    'Throwing technique (Nage-waza)',
    hold:     'Hold-down (Osaekomi-waza)',
    lock:     'Armlock (Kansetsu-waza)',
    strangle: 'Strangle (Shime-waza)',
  };

  const BELT_SHORT = {
    'Novice → 6th Kyu':  'White → Red Belt',
    '6th Kyu → 5th Kyu': 'Red → Yellow Belt',
    '5th Kyu → 4th Kyu': 'Yellow → Orange Belt',
    '4th Kyu → 3rd Kyu': 'Orange → Green Belt',
    '3rd Kyu → 2nd Kyu': 'Green → Blue Belt',
    '2nd Kyu → 1st Kyu': 'Blue → Brown Belt',
  };

  // Type 1: Translation
  function _quizTranslation(name) {
    const correct = _getTranslation(name);
    let pool = [];
    if (typeof TERMS_EN !== 'undefined') {
      pool = Object.values(TERMS_EN).filter(v => v && v !== correct);
    }
    pool = pool.sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [correct, ...pool].sort(() => Math.random() - 0.5);
    return { question: `What does "${name}" mean?`, options, correct, type: 'translation' };
  }

  // Type 2: Category
  function _quizCategory(name, cat) {
    const correct = CAT_LABELS[cat] || CAT_LABELS.throw;
    const pool = Object.values(CAT_LABELS).filter(v => v !== correct)
      .sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [correct, ...pool].sort(() => Math.random() - 0.5);
    return { question: `"${name}" is a…`, options, correct, type: 'category' };
  }

  // Type 3: Belt level
  function _quizBelt(name) {
    let correct = null;
    if (typeof BELT_DATA !== 'undefined') {
      for (const belt of BELT_DATA) {
        for (const group of belt.groups) {
          if (group.items.includes(name)) {
            correct = BELT_SHORT[belt.label] || belt.label;
            break;
          }
        }
        if (correct) break;
      }
    }
    if (!correct) return _quizTranslation(name);
    const pool = Object.values(BELT_SHORT).filter(v => v !== correct)
      .sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [correct, ...pool].sort(() => Math.random() - 0.5);
    return { question: `At which grade is ${name} first introduced?`, options, correct, type: 'belt' };
  }

  // Type 4: Technique family — "which group does X belong to?"
  function _quizFamily(name) {
    let correct = null, groupTitle = null;
    if (typeof BELT_DATA !== 'undefined') {
      for (const belt of BELT_DATA) {
        for (const group of belt.groups) {
          if (group.items.includes(name)) { groupTitle = group.title; break; }
        }
        if (groupTitle) break;
      }
    }
    // Extract short family label from group title
    const familyMap = {
      'Tachi-waza': 'Standing technique (Tachi-waza)',
      'Osaekomi':   'Hold-down (Osaekomi-waza)',
      'Kansetsu':   'Armlock (Kansetsu-waza)',
      'Shime':      'Strangle (Shime-waza)',
      'Ukemi':      'Breakfall (Ukemi)',
    };
    if (groupTitle) {
      for (const [key, label] of Object.entries(familyMap)) {
        if (groupTitle.includes(key)) { correct = label; break; }
      }
    }
    if (!correct) return _quizCategory(name, (typeof TECHNIQUE_DATA !== 'undefined' && TECHNIQUE_DATA[name]) ? TECHNIQUE_DATA[name].cat : 'throw');
    const pool = Object.values(familyMap).filter(v => v !== correct)
      .sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [correct, ...pool].sort(() => Math.random() - 0.5);
    return { question: `Which group does ${name} belong to?`, options, correct, type: 'family' };
  }

  // ── Main quiz router ──────────────────────────────
  function _generateQuiz(name) {
    const td = (typeof TECHNIQUE_DATA !== 'undefined') ? TECHNIQUE_DATA[name] : null;
    const cat = td ? td.cat : null;
    const hasTranslation = (typeof TERMS_EN !== 'undefined') && !!TERMS_EN[name];

    // Build priority list of available types
    const types = [];
    if (hasTranslation) types.push('translation');
    if (cat)            types.push('category');
    types.push('belt');
    types.push('family');

    // Deterministic rotation: seed by name hash + retry count for variety
    const nameHash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const type = types[(nameHash + _quizAttemptCount) % types.length];

    switch (type) {
      case 'translation': return _quizTranslation(name);
      case 'category':    return _quizCategory(name, cat);
      case 'belt':        return _quizBelt(name);
      case 'family':      return _quizFamily(name);
      default:            return _quizTranslation(name);
    }
  }

  // ── Open a lesson ─────────────────────────────────
  function open(beltId, itemName, beltIdx, returnScreen) {
    _beltId        = beltId;
    _itemName      = itemName;
    _beltIdx       = beltIdx || 0;
    _returnScreen  = returnScreen || 'home';
    _answered      = false;
    _selectedAnswer = '';
    _quizAttemptCount = 0;
    DojoState.markSeen(beltId, itemName);

    const belt = (typeof BELT_DATA !== 'undefined') ? BELT_DATA.find(b => b.id === beltId) : null;
    const en   = _getTranslation(itemName);
    const vid  = _getVideoUrl(itemName);
    const sub  = _getSubCat(itemName);
    _videoUrl  = vid;

    // ── Populate DOM ──
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

    const areaNum = (typeof BELT_DATA !== 'undefined')
      ? (BELT_DATA.findIndex(b => b.id === beltId) + 1) : 1;
    set('lesson-area-label',   `AREA 0${areaNum} · ${belt ? belt.label.toUpperCase() : beltId.toUpperCase()}`);
    set('lesson-technique-name', itemName);
    set('lesson-technique-en',   en);
    set('lesson-sub-cat',        sub);
    set('lesson-tip',            _getTip(itemName));

    // Reset video
    const iframe = document.getElementById('lesson-iframe');
    const thumb  = document.getElementById('lesson-video-thumb');
    const playBtn= document.getElementById('lesson-play-btn');
    if (iframe)  { iframe.src = ''; iframe.classList.add('hidden'); }
    if (thumb)   { thumb.classList.remove('hidden'); }
    if (playBtn) { playBtn.classList.remove('hidden'); }

    // Technical Breakdown
    _renderBreakdown(itemName);

    // Common Mistakes
    _renderMistakes(itemName);

    // Quiz
    _renderQuiz(itemName);

    showScreen('lesson');

    // Update back button label to match return context
    const backLabel = document.getElementById('lesson-back-label');
    if (backLabel) {
      const labels = { home: 'Back to Learn', practice: 'Back to Practice', syllabus: 'Back to Syllabus', dojo: 'Back to Dojo' };
      backLabel.textContent = labels[_returnScreen] || 'Back';
    }
  }

  // ── Play video ────────────────────────────────────
  function playLesson() {
    const vid = _ytId(_videoUrl);
    if (!vid) return;
    const iframe = document.getElementById('lesson-iframe');
    const thumb  = document.getElementById('lesson-video-thumb');
    const playBtn= document.getElementById('lesson-play-btn');
    if (iframe) {
      const startSec = _ytStart(_videoUrl);
      iframe.src = `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0${startSec ? '&start='+startSec : ''}`;
      iframe.classList.remove('hidden');
    }
    if (thumb)   thumb.classList.add('hidden');
    if (playBtn) playBtn.classList.add('hidden');
  }

  // ── Breakdown cards ───────────────────────────────
  function _renderBreakdown(name) {
    const container = document.getElementById('lesson-breakdown-cards');
    if (!container) return;
    const items = _getBreakdown(name);
    const colors = ['text-primary', 'text-tertiary', 'text-secondary'];
    container.innerHTML = items.map((item, i) => `
      <div class="bg-surface-container border border-outline-variant p-4 rounded-xl hover:border-primary/40 transition-colors">
        <span class="material-symbols-outlined ${colors[i]} mb-2 block" style="font-size:28px">${item[0]}</span>
        <h4 class="font-semibold text-on-surface text-sm mb-1">${item[1]}</h4>
        <p class="text-on-surface-variant text-xs leading-relaxed">${item[2]}</p>
      </div>`).join('');
  }

  // ── Mistakes list ─────────────────────────────────
  function _renderMistakes(name) {
    const container = document.getElementById('lesson-mistakes');
    if (!container) return;
    container.innerHTML = _getMistakes(name).map(([title, desc]) => `
      <li class="flex gap-3">
        <span class="material-symbols-outlined text-error shrink-0" style="font-size:20px">cancel</span>
        <div>
          <span class="font-semibold text-on-surface text-sm block">${title}</span>
          <p class="text-on-surface-variant text-xs mt-0.5">${desc}</p>
        </div>
      </li>`).join('');
  }

  // ── Quiz type badge labels ────────────────────────
  const QUIZ_TYPE_BADGES = {
    translation: 'TRANSLATION',
    category:    'TECHNIQUE TYPE',
    belt:        'BELT LEVEL',
    family:      'TECHNIQUE GROUP',
  };

  // ── Quiz ──────────────────────────────────────────
  function _renderQuiz(name) {
    const quiz = _generateQuiz(name);
    _quizCorrectAnswer = quiz.correct;
    _selectedAnswer    = '';
    _answered          = false;

    const qEl = document.getElementById('quiz-question');
    if (qEl) qEl.textContent = quiz.question;

    // Show type badge
    const badge = document.getElementById('quiz-type-badge');
    if (badge) {
      const label = QUIZ_TYPE_BADGES[quiz.type];
      if (label) { badge.textContent = label; badge.classList.remove('hidden'); }
      else        { badge.classList.add('hidden'); }
    }

    const container = document.getElementById('quiz-options');
    if (!container) return;
    container.innerHTML = quiz.options.map((opt) => `
      <div class="quiz-opt" onclick="DojoLesson.selectOption(this, '${opt.replace(/'/g,"\'")}')" data-value="${opt.replace(/"/g,'&quot;')}">
        <span class="text-on-surface text-sm font-medium leading-snug">${opt}</span>
        <div class="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center shrink-0 opt-indicator">
          <span class="material-symbols-outlined text-on-primary hidden" style="font-size:14px">check</span>
        </div>
      </div>`).join('');

    // Reset check button
    const btn = document.getElementById('check-btn');
    if (btn) {
      btn.disabled = true;
      btn.classList.add('opacity-40','pointer-events-none');
      btn.classList.remove('bg-tertiary','text-on-tertiary');
      btn.classList.add('bg-primary-container','text-on-primary-container');
      btn.onclick = handleCheck;
      btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px">done_all</span> CHECK';
    }
  }

  // ── Select a quiz option ─────────────────────────
  function selectOption(el, value) {
    if (_answered) return;
    _selectedAnswer = value;
    document.querySelectorAll('.quiz-opt').forEach(opt => {
      const sel = opt === el;
      opt.classList.toggle('selected', sel);
      opt.style.background = sel ? 'rgba(37,99,235,0.06)' : '';
      opt.style.borderColor = sel ? '#2563eb' : '';
      const indicator = opt.querySelector('.opt-indicator');
      if (indicator) {
        indicator.style.background     = sel ? 'var(--color-primary-container, #2563eb)' : '';
        indicator.style.borderColor    = sel ? 'var(--color-primary-container, #2563eb)' : '';
        const check = indicator.querySelector('.material-symbols-outlined');
        if (check) check.classList.toggle('hidden', !sel);
      }
    });
    const btn = document.getElementById('check-btn');
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-40', 'pointer-events-none');
    }
  }

  // ── Check answer ──────────────────────────────────
  function handleCheck() {
    if (_answered || !_selectedAnswer) return;
    _answered = true;
    const correct = _selectedAnswer === _quizCorrectAnswer;
    const btn = document.getElementById('check-btn');

    if (correct) {
      // Show correct answer highlighted green on all options
      document.querySelectorAll('.quiz-opt').forEach(opt => {
        const val = opt.dataset.value;
        if (val === _quizCorrectAnswer) {
          opt.style.background   = 'rgba(0,98,66,0.08)';
          opt.style.borderColor  = '#006242';
          opt.querySelector('.opt-indicator').style.background  = '#006242';
          opt.querySelector('.opt-indicator').style.borderColor = '#006242';
          const chk = opt.querySelector('.opt-indicator .material-symbols-outlined');
          if (chk) chk.classList.remove('hidden');
        }
      });
      if (btn) {
        btn.innerHTML = '<span class="material-symbols-outlined ms-fill" style="font-size:18px">check_circle</span> CORRECT!';
        btn.style.background = '#006242';
        btn.style.color = '#ffffff';
        btn.style.borderBottomColor = '#004d2e';
      }
      // Show XP toast then advance
      setTimeout(() => {
        if (btn) { btn.style.background=''; btn.style.color=''; btn.style.borderBottomColor=''; }
        const result = DojoState.completeLesson(_beltId, _itemName);
        _showXPToast(result);
        setTimeout(() => DojoCelebration.showSuccess(_beltId, _itemName, _beltIdx, result, _returnScreen), 600);
      }, 900);
    } else {
      // Wrong — lose a heart, allow retry
      DojoState.loseHeart();
      // Show wrong answer in red, correct in green
      document.querySelectorAll('.quiz-opt').forEach(opt => {
        const val = opt.dataset.value;
        if (val === _selectedAnswer) {
          opt.style.background  = 'rgba(186,26,26,0.06)';
          opt.style.borderColor = '#ba1a1a';
        } else if (val === _quizCorrectAnswer) {
          opt.style.background  = 'rgba(0,98,66,0.08)';
          opt.style.borderColor = '#006242';
        }
      });
      if (btn) {
        btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px">refresh</span> TRY AGAIN';
        btn.style.background = '#ba1a1a';
        btn.style.color = '#ffffff';
        btn.style.borderBottomColor = '#7f0d0d';
        btn.classList.remove('opacity-40', 'pointer-events-none');
        btn.disabled = false;
        btn.onclick = () => {
          btn.style.background=''; btn.style.color=''; btn.style.borderBottomColor='';
          _answered = false;
          _selectedAnswer = '';
          _quizAttemptCount++;
          _renderQuiz(_itemName);
        };
      }
    }
  }

  // ── XP Toast ─────────────────────────────────────
  function _showXPToast(result) {
    const toast   = document.getElementById('xp-toast');
    const toastTxt= document.getElementById('xp-toast-text');
    if (!toast || !toastTxt) return;

    const hasBonus = result.streak >= 3;
    toastTxt.textContent = hasBonus
      ? '+' + result.xpGained + ' XP  🔥 STREAK BONUS!'
      : '+' + result.xpGained + ' XP';
    toast.style.background = hasBonus ? '#f97316' : '#004ac6';
    toast.style.boxShadow  = hasBonus ? '0 4px 20px rgba(249,115,22,0.5)' : '0 4px 20px rgba(0,74,198,0.4)';

    toast.classList.remove('hidden', 'xp-toast');
    void toast.offsetWidth;
    toast.classList.add('xp-toast');
    setTimeout(() => toast.classList.add('hidden'), 2500);
  }

  function goBack() { showScreen(_returnScreen); }
  function getReturnScreen() { return _returnScreen; }

  return { open, playLesson, selectOption, handleCheck, goBack, getReturnScreen };

})();

// ── Global wrappers (called from inline HTML onclick) ──
function playLesson()  { DojoLesson.playLesson(); }
function handleCheck() { DojoLesson.handleCheck(); }

// ═══════════════════════════════════════════════════
//  DojoKnowledge — Specialised knowledge item screens
// ═══════════════════════════════════════════════════
const DojoKnowledge = (() => {
  let _beltId   = '';
  let _itemName = '';
  let _beltIdx  = 0;
  let _groupTitle = '';
  let _returnScreen = 'home';

  const MORAL_CODE = {
    'Courtesy':    { icon:'waving_hand',      desc:'Show respect and politeness on and off the mat — bow with sincerity.' },
    'Courage':     { icon:'whatshot',          desc:'Face challenges and opponents with a brave and open spirit.' },
    'Honesty':     { icon:'verified',          desc:'Be truthful in training and competition — never deceive.' },
    'Honour':      { icon:'military_tech',     desc:'Keep your word and uphold the dignity of Judo at all times.' },
    'Modesty':     { icon:'self_improvement',  desc:'Win without arrogance; lose without excuses.' },
    'Respect':     { icon:'favorite',          desc:'Respect your sensei, training partners, and the dojo.' },
    'Self-control':{ icon:'psychology',        desc:'Manage your reactions under pressure — on and off the mat.' },
    'Friendship':  { icon:'groups',            desc:'Build bonds through shared training — judo connects people worldwide.' },
  };

  const GROUP_ICONS = {
    'Terminology':  'translate',
    'Referee':      'sports',
    'Contest':      'gavel',
    'Moral':        'shield_person',
    'Basics':       'menu_book',
    'default':      'menu_book',
  };

  function _groupIcon(title) {
    for (const [key, icon] of Object.entries(GROUP_ICONS)) {
      if (title.includes(key)) return icon;
    }
    return GROUP_ICONS.default;
  }

  function _isTerminology(groupTitle) {
    return /Terminology|Referee/i.test(groupTitle);
  }
  function _isMoralCode(groupTitle, itemName) {
    return /Moral/i.test(groupTitle) || MORAL_CODE[itemName];
  }

  function open(beltId, itemName, groupTitle, beltIdx, returnScreen) {
    _beltId      = beltId;
    _itemName    = itemName;
    _groupTitle  = groupTitle || '';
    _beltIdx     = beltIdx || 0;
    _returnScreen = returnScreen || 'home';
    DojoState.markSeen(beltId, itemName);

    const belt = (typeof BELT_DATA !== 'undefined') ? BELT_DATA.find(b => b.id === beltId) : null;
    const areaNum = (typeof BELT_DATA !== 'undefined') ? (BELT_DATA.findIndex(b => b.id === beltId) + 1) : 1;

    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('knowledge-area-label', `AREA 0${areaNum} · ${belt ? belt.label.toUpperCase() : beltId.toUpperCase()}`);
    set('knowledge-group-label', _groupTitle.replace(/^Knowledge\s*[—-]\s*/i, '') || 'Knowledge');
    set('knowledge-back-label', ({ home:'Back to Learn', practice:'Back to Practice', syllabus:'Back to Syllabus' })[_returnScreen] || 'Back');

    const groupIcon = document.getElementById('knowledge-group-icon');
    if (groupIcon) groupIcon.textContent = _groupIcon(_groupTitle);

    const content = document.getElementById('knowledge-content');
    if (content) {
      if (_isMoralCode(_groupTitle, itemName)) {
        content.innerHTML = _moralCodeHTML(itemName);
      } else if (_isTerminology(_groupTitle)) {
        content.innerHTML = _terminologyHTML(itemName);
      } else {
        content.innerHTML = _questionHTML(itemName);
      }
    }

    showScreen('knowledge');
  }

  function _terminologyHTML(name) {
    // Term might be "Word — English meaning" or just "Word" (look up in TERMS_EN)
    const parts    = name.split(' — ');
    const japanese = parts[0].trim();
    const english  = parts[1] ? parts[1].trim()
                   : (typeof TERMS_EN !== 'undefined' && TERMS_EN[japanese]) ? TERMS_EN[japanese]
                   : '';
    return `
      <p class="text-xs text-on-surface-variant text-center mb-2">Tap the card to reveal the meaning</p>
      <div id="knowledge-flashcard" onclick="DojoKnowledge.flipCard()" class="cursor-pointer select-none"
        style="perspective:1000px;min-height:220px">
        <div id="knowledge-card-inner" class="relative w-full transition-all duration-500"
          style="transform-style:preserve-3d;min-height:220px">
          <!-- Front -->
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-surface-container border border-outline-variant/40 rounded-3xl p-8 shadow-lg"
            style="backface-visibility:hidden">
            <span class="material-symbols-outlined text-primary/30 mb-4" style="font-size:40px">translate</span>
            <h2 class="font-black text-on-surface text-3xl text-center leading-tight mb-2">${japanese}</h2>
            <p class="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Japanese</p>
          </div>
          <!-- Back -->
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-primary-container rounded-3xl p-8 shadow-lg"
            style="backface-visibility:hidden;transform:rotateY(180deg)">
            <span class="material-symbols-outlined text-primary/40 mb-4" style="font-size:40px">check_circle</span>
            <h2 class="font-black text-on-primary-container text-2xl text-center leading-tight mb-2">${english || '—'}</h2>
            <p class="text-on-primary-container/60 text-xs uppercase tracking-widest font-bold">English Meaning</p>
          </div>
        </div>
      </div>
      <p class="text-center text-xs text-on-surface-variant mt-3">
        <span class="material-symbols-outlined align-middle" style="font-size:14px">touch_app</span>
        Tap card to flip · tap below when you know it
      </p>`;
  }

  function _moralCodeHTML(name) {
    const info = MORAL_CODE[name] || { icon:'shield_person', desc:'A core principle of the Judo Moral Code.' };
    // Show all 8 values, highlight current
    const allValues = Object.keys(MORAL_CODE);
    const pills = allValues.map(v => {
      const active = v === name;
      return `<span class="px-2 py-1 rounded-lg font-bold text-center" style="font-size:10px;${active ? 'background:#004ac618;color:#004ac6;border:1px solid #004ac640' : 'color:#94a3b8'}">${v}</span>`;
    }).join('');
    return `
      <div class="bg-surface-container border border-outline-variant/30 rounded-3xl p-8 flex flex-col items-center text-center shadow-md">
        <div class="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style="background:#004ac618">
          <span class="material-symbols-outlined ms-fill text-primary" style="font-size:44px">${info.icon}</span>
        </div>
        <h2 class="font-black text-on-surface text-3xl mb-3">${name}</h2>
        <p class="text-on-surface-variant text-sm leading-relaxed">${info.desc}</p>
      </div>
      <div class="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4">
        <p class="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">The Eight Values</p>
        <div class="grid grid-cols-4 gap-1.5">${pills}</div>
      </div>
      <button onclick="showScreen('dojo')"
        class="w-full border-2 border-primary/30 text-primary font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <span class="material-symbols-outlined" style="font-size:18px">temple_buddhist</span>
        Explore Moral Code in Dojo
      </button>`;
  }

  function _questionHTML(name) {
    const answers = (typeof QUIZ_ANSWERS !== 'undefined' && QUIZ_ANSWERS[name]) ? QUIZ_ANSWERS[name] : [];
    const answerItems = answers.length
      ? answers.map(a => `
          <div class="flex items-start gap-3 p-3 bg-surface-container-high rounded-xl">
            <span class="material-symbols-outlined ms-fill text-primary shrink-0 mt-0.5" style="font-size:18px">check_circle</span>
            <span class="text-sm text-on-surface leading-relaxed">${a}</span>
          </div>`).join('')
      : `<div class="text-on-surface-variant text-sm text-center py-2">Discuss with your sensei.</div>`;
    return `
      <div class="bg-surface-container border border-outline-variant/30 rounded-2xl p-5">
        <p class="text-xs font-bold uppercase tracking-widest text-primary mb-3">Requirement</p>
        <h3 class="font-bold text-on-surface text-base leading-snug">${name}</h3>
      </div>
      <div class="space-y-2">
        <p class="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Key Points</p>
        ${answerItems}
      </div>
      <div class="flex items-start gap-3 p-4 bg-surface-container-low/50 border-l-4 border-tertiary rounded-r-xl">
        <span class="material-symbols-outlined text-tertiary mt-0.5 shrink-0" style="font-size:20px">psychology</span>
        <p class="text-on-surface-variant text-sm leading-relaxed">Practise this with your sensei or training partner until you can answer confidently.</p>
      </div>`;
  }

  function flipCard() {
    const inner = document.getElementById('knowledge-card-inner');
    if (!inner) return;
    const flipped = inner.style.transform === 'rotateY(180deg)';
    inner.style.transform = flipped ? '' : 'rotateY(180deg)';
  }

  function markDone() {
    if (!_beltId || !_itemName) return;
    const result = DojoState.completeLesson(_beltId, _itemName);
    DojoCelebration.showSuccess(_beltId, _itemName, _beltIdx, result, 'knowledge');
  }

  function back() { showScreen(_returnScreen); }

  return { open, flipCard, markDone, back };
})();
