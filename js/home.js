/* home.js v_TEST_2024 */

// ── DAILY THEMES (index = day of week, 0=Sun) ──────
const DAILY_THEMES = [
  { name: 'Recovery',      tag: 'recovery',     emoji: '🧘', color: '#27ae60' },
  { name: 'Throws',        tag: 'throws',       emoji: '🥋', color: '#e8c84a' },
  { name: 'Grip Fighting', tag: 'grips',        emoji: '✊', color: '#e67e22' },
  { name: 'Ne-waza',       tag: 'newaza',       emoji: '🤼', color: '#2980b9' },
  { name: 'Conditioning',  tag: 'conditioning', emoji: '💪', color: '#F05A1A' },
  { name: 'Combinations',  tag: 'combos',       emoji: '🔗', color: '#8e44ad' },
  { name: 'Belt Prep',     tag: 'beltprep',     emoji: '🏅', color: '#c9952f' },
];

// ── JUDO IQ CARDS ──────────────────────────────────
const IQ_CARDS = [
  { q: 'What is Kuzushi?', a: 'Breaking your opponent\'s balance before the throw. Without it, throws become strength battles and counters happen.' },
  { q: 'What does O-soto-gari mean?', a: 'Major outer reap. O = major, soto = outer, gari = reap. Attack the far leg.' },
  { q: 'What is the difference between Shido and Hansoku-make?', a: 'Shido is a minor penalty (warning). Hansoku-make is disqualification — for serious infractions or accumulating too many Shido.' },
  { q: 'What is Tsurikomi-goshi?', a: 'Lifting pulling hip throw. Tsuri = lift, komi = pull, goshi = hip. Lift the sleeve and pull the lapel as you enter.' },
  { q: 'What is Uke?', a: 'The person receiving the technique. Tori is the person executing it.' },
  { q: 'What is the standard gripping position?', a: 'Right hand on left lapel, left hand on right sleeve (for right-handed judoka). Sleeve grip controls direction, lapel controls distance.' },
  { q: 'What is Randori?', a: 'Free practice — both partners attack and defend. The foundation of judo development.' },
  { q: 'What does Hajime mean?', a: 'Begin — the referee\'s command to start or resume the contest.' },
  { q: 'What is Mate?', a: 'Stop — the referee\'s command to temporarily halt the contest.' },
  { q: 'What is Osaekomi?', a: 'Holding — called when a pin is established. 10+ seconds = Waza-ari, 20+ seconds = Ippon.' },
  { q: 'What is Kumi-kata?', a: 'Gripping technique. How you grip determines how you attack — grip first, then throw.' },
  { q: 'Name a Ko-uchi-gari combination.', a: 'Ko-uchi-gari → Morote-seoi-nage. Drive the minor reap, then enter for the shoulder throw as they step back.' },
  { q: 'What is Toketa?', a: 'The hold is broken — referee calls this when a pin is escaped.' },
  { q: 'What is Seiryoku Zenyo?', a: 'Maximum efficiency with minimum effort — one of Judo\'s founding principles by Jigoro Kano.' },
  { q: 'What is Jita Kyoei?', a: 'Mutual welfare and benefit — the idea that training together improves both partners.' },
  { q: 'What is Waza-ari?', a: 'Half point. Two Waza-ari equal Ippon. Scored when a throw is partially successful or a pin held 10–19 seconds.' },
  { q: 'What does Ko-soto-gari mean?', a: 'Minor outer reap. Ko = minor, soto = outer, gari = reap. Attack the near ankle from the outside.' },
  { q: 'What is the grip order principle?', a: 'Establish sleeve grip first, then lapel. Losing your grip mid-throw loses the throw.' },
  { q: 'What is Tsukuri?', a: 'Fitting in — the entry phase where you position your body to execute the throw.' },
  { q: 'What is Kake?', a: 'Execution — the actual throwing action, after kuzushi and tsukuri.' },
  { q: 'What are the Moral Code values?', a: 'Courtesy, Courage, Honesty, Honour, Modesty, Respect, Self-control, Friendship.' },
  { q: 'What is a counter (gaeshi)?', a: 'Turning your opponent\'s attack into your own scoring technique. Requires reading their commitment and timing.' },
  { q: 'What is Tachi-waza?', a: 'Standing techniques — throws and takedowns performed from a standing position.' },
  { q: 'What is the purpose of shadow uchikomi?', a: 'Building muscle memory for entry movements without a partner. Perfect reps build the reflex.' },
  { q: 'What does Seoi mean?', a: 'Carrying on the back/shoulder. Seoi-nage = shoulder throw, the family of techniques that load uke onto your back.' },
];

// ── TECHNIQUE OF THE DAY ────────────────────────────
const ORANGE_BELT_TECHS = [
  'Tsurikomi-goshi','O-goshi','Seoi-otoshi','Morote-seoi-nage',
  'Ko-uchi-gari','Ko-soto-gake','Ko-soto-gari','O-soto-gari',
  'Tai-otoshi','Ippon-seoi-nage','Ouchi-gari',
];

function getTOTD() {
  // Belt-aware: prioritise first uncompleted technique from active belt
  const ab = getActiveBeltInfo();
  if (ab && ab.nextItems && ab.nextItems.length) {
    const found = TECHNIQUES.find(t => t.name === ab.nextItems[0]);
    if (found) return found;
  }
  // Fallback: day-of-year rotation through orange belt techs
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const name = ORANGE_BELT_TECHS[dayOfYear % ORANGE_BELT_TECHS.length];
  return TECHNIQUES.find(t => t.name === name) || TECHNIQUES[0];
}

function getTodayIQ() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return IQ_CARDS[dayOfYear % IQ_CARDS.length];
}

// ── MODULE-LEVEL HELPERS ───────────────────────────
const BLOCK_COLORS = {
  warmup: '#e8c84a', technique: '#2980b9', strength: '#c0392b',
  conditioning: '#8e44ad', iq: '#27ae60', recovery: '#27ae60', custom: '#e8c84a',
};

function fmtTime(secs) {
  if (!secs) return '0s';
  if (secs < 60) return secs + 's';
  const m = Math.floor(secs / 60), r = secs % 60;
  return m + ' min' + (r ? ' ' + r + 's' : '');
}

// ── XP ─────────────────────────────────────────────
function getXP()       { return parseInt(localStorage.getItem('judo_xp') || '0'); }
function addXP(amount) {
  const xp = getXP() + amount;
  localStorage.setItem('judo_xp', String(xp));
  return xp;
}
function calcSessionXP(session) {
  const base  = Math.max(1, Math.round(session.totalDuration / 60));
  const bonus = getStreak() > 1 ? 5 : 0;
  return base + bonus;
}

// ── STREAK ─────────────────────────────────────────
function getSessionLog()        { return JSON.parse(localStorage.getItem('judo_session_log') || '[]'); }
function saveSessionLog(log)    { localStorage.setItem('judo_session_log', JSON.stringify(log)); }

// Normalise entry — handles old string entries and new object entries
function _sessionDate(s) { return typeof s === 'string' ? s : (s.date || '').slice(0, 10); }

function getStreak() {
  const log  = getSessionLog();
  if (!log.length) return 0;
  const today = todayStr(), yesterday = dateStr(-1);
  const hasDay = d => log.some(s => _sessionDate(s) === d);
  if (!hasDay(today) && !hasDay(yesterday)) return 0;
  let streak = 0, d = hasDay(today) ? 0 : -1;
  while (hasDay(dateStr(d))) { streak++; d--; }
  return streak;
}

function getMatHours() {
  const log = getSessionLog();
  const totalMins = log.reduce(function(sum, s){ return sum + (parseInt(s.minutes) || 0); }, 0);
  if (totalMins === 0) return '0h';
  if (totalMins < 60) return totalMins + 'm';
  var h = (totalMins / 60);
  return (h % 1 === 0 ? h : h.toFixed(1)) + 'h';
}

function getDaysSinceLast() {
  var log = getSessionLog();
  if (!log.length) return 0;  // New user — not 'returning', just starting
  var dates = log.map(function(s){ return _sessionDate(s); }).filter(Boolean).sort();
  var last = dates[dates.length - 1];
  var diff = (new Date(todayStr()) - new Date(last)) / 86400000;
  return Math.max(0, Math.round(diff));
}

function getAdaptiveTip(activeBelt, streak, totdName) {
  var days = getDaysSinceLast();
  if (days >= 5) {
    return { cls: 'nh-adapt-returning', tag: days + ' days since last session', title: 'Welcome back', body: 'A short session is better than none. Start easy — 8 minutes is enough to rebuild momentum.' };
  }
  if (activeBelt && activeBelt.nextItems && activeBelt.nextItems.length) {
    var remaining = activeBelt.total - activeBelt.done;
    return { cls: 'nh-adapt-belt', tag: activeBelt.belt.to + ' Belt · ' + activeBelt.pct + '% complete', title: "Today’s focus", body: remaining + ' technique' + (remaining !== 1 ? 's' : '') + ' left for grading. Work on ' + (totdName || activeBelt.nextItems[0]) + ' today.' };
  }
  if (streak >= 3) {
    return { cls: 'nh-adapt-belt', tag: streak + ' day streak 🔥', title: 'Keep the momentum', body: 'Consistency is the foundation of judo. Show up again today.' };
  }
  return null;
}

function getWeekDaysDone() {
  var log = getSessionLog();
  var today = new Date();
  var jsDay = today.getDay();
  var monOffset = (jsDay === 0) ? -6 : 1 - jsDay;
  return [0,1,2,3,4,5,6].map(function(i){
    var offset = monOffset + i;
    var d = dateStr(offset);
    return log.some(function(s){ return _sessionDate(s) === d; });
  });
}

function getSessionsThisWeek() {
  const log = getSessionLog();
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return log.filter(s => new Date(_sessionDate(s)) >= monday).length;
}

function logSessionComplete() {
  const log   = getSessionLog();
  const today = todayStr();
  if (log.some(s => _sessionDate(s) === today)) return; // already logged today
  const xp = calcSessionXP(currentSession);
  log.push({
    id:         's' + Date.now(),
    date:       today,
    title:      currentSession.title || 'Training Session',
    themeEmoji: currentSession.themeEmoji || '🥋',
    minutes:    currentSession.minutes || Math.round((currentSession.totalDuration || 0) / 60),
    xp,
    notes:      '',
    techniques: (currentSession.blocks || []).flatMap(b => b.items || []).map(i => i.name).filter(Boolean),
  });
  saveSessionLog(log);
}

function todayStr()          { return new Date().toISOString().slice(0, 10); }
function dateStr(offset)     { return new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10); }

// ── SESSION CONTENT ────────────────────────────────
const WARMUP_MOVES = ['Arm circles', 'Hip rotations', 'Light footwork', 'Shadow grips', 'Neck rolls'];

const THEME_CONTENT = {
  throws: {
    focus: 'O-soto-gari',
    cue: 'Pull sleeve before blocking leg',
    mistake: 'Rushing the entry — feet first, then the throw',
    phases: [
      'Slow reps — perfect posture, sleeve pull, hip turn',
      'Movement entries — attack from motion, not standing still',
      'Explosive attacks — fast, clean, fully committed',
    ],
  },
  grips: {
    focus: 'Kumi-kata drilling',
    cue: 'Establish sleeve before lapel',
    mistake: 'Passive grip — fight for your grip from the first second',
    phases: [
      'Standard grip — right lapel, left sleeve — feel the control',
      'Breaking opponent grips — snap and re-grip',
      'Grip fighting in motion — attack when grip is established',
    ],
  },
  newaza: {
    focus: 'Kesa-gatame escape',
    cue: 'Bridge and roll — timing beats strength',
    mistake: 'Pushing straight up — angle the bridge before you roll',
    phases: [
      'Slow escape drill — feel the weight shift and timing',
      'Add resistance — partner holds tighter, find the moment',
      'Transition straight to counterpin',
    ],
  },
  conditioning: {
    focus: 'Judo fitness circuit',
    cue: 'Short hard efforts transfer best to randori',
    mistake: 'Going too fast early — pace the first two intervals',
    phases: [
      'Explosive squats — judo stance width',
      'Shadow uchikomi × 20 — full speed entries',
      'Sprawl and recover — drop fast, hips low',
    ],
  },
  combos: {
    focus: 'Ko-uchi-gari → O-soto-gari',
    cue: 'First attack creates the reaction — second attack scores',
    mistake: 'Pausing between attacks — it must be one fluid motion',
    phases: [
      'Drill each throw individually — feel the mechanics',
      'Link slowly — feel the transition moment',
      'Full speed — trust the combination',
    ],
  },
  beltprep: {
    focus: 'Orange belt requirements',
    cue: 'Show control, not just technique — examiners watch attitude',
    mistake: 'Forgetting transitions — every throw should flow to ne-waza',
    phases: [
      'Required throws run-through — Tsurikomi-goshi, O-goshi, O-soto-gari',
      'Combinations — Ko-uchi-gari into Morote-seoi-nage',
      'Counter practice — Ouchi-gari countered by Tsurikomi-goshi',
    ],
  },
  recovery: {
    focus: 'Mobility and movement',
    cue: 'Active recovery beats lying on the sofa',
    mistake: 'Skipping it — recovery days are where adaptation happens',
    phases: [
      'Hip circles and deep squats — open the hips',
      'Shoulder rotation and posture work',
      'Light shadow movement — stay connected to judo',
    ],
  },
};

const STRENGTH_EXERCISES = [
  { name: 'Judo squats',            note: 'Shoulder-width, judo stance' },
  { name: 'Explosive pushups',      note: 'Fast off the floor' },
  { name: 'Band rows / Towel rows', note: 'Drive with elbow, grip tight' },
  { name: 'Isometric grip hold',    note: 'Hold belt or towel — squeeze hard for 30s' },
];

const CONDITIONING_EXERCISES = [
  { name: 'Sprawls',               note: 'Drop fast, hips low' },
  { name: 'Fast footwork',         note: 'Light, quick, stay on toes' },
  { name: 'Burpee + shadow throw', note: 'Explosive — full commitment' },
  { name: 'Shadow uchikomi',       note: 'Full speed entries, both sides' },
];

// ── SESSION GENERATOR ──────────────────────────────
function generateSession(minutes, location, themeTag) {
  const theme = DAILY_THEMES.find(t => t.tag === themeTag) || DAILY_THEMES[1];
  const scale = minutes / 10;
  const blocks = [];

  // ── BELT PREP: dynamically use the user's actual grading requirements ──
  if (themeTag === 'beltprep') {
    const activeBelt  = (typeof getActiveBeltForGrading === 'function') ? getActiveBeltForGrading() : null;
    const beltId      = activeBelt ? activeBelt.id : 'toOrange';
    const beltLabel   = activeBelt ? activeBelt.title : 'Next Grading';

    // All technique names for this belt — filter out combos, escapes, grip notes
    const NE_WAZA_NAMES = new Set([
      'Kesa-gatame','Kuzure-kesa-gatame','Mune-gatame','Yoko-shiho-gatame',
      'Kami-shiho-gatame','Tate-shiho-gatame','Kata-gatame',
      'Hadaka-jime','Okuri-eri-jime','Kata-ha-jime','Sankaku-jime',
      'Juji-gatame','Ude-garami','Ude-hishigi-ude-gatame','Ude-hishigi-hiza-gatame',
      'Nami-juji-jime','Gyaku-juji-jime','Kata-juji-jime','Sode-guruma-jime',
    ]);
    const allNames  = (typeof BELT_TECHNIQUES !== 'undefined' ? (BELT_TECHNIQUES[beltId] || []) : [])
      .filter(n => !n.includes('→') && !n.includes('Escape') && !n.includes('Turnover')
                && !n.toLowerCase().includes('grip') && !n.toLowerCase().includes('randori')
                && !n.toLowerCase().includes('ukemi'));
    const combos    = (typeof BELT_PREP_COMBOS !== 'undefined' ? (BELT_PREP_COMBOS[beltId] || []) : []);
    const throws    = allNames.filter(n => !NE_WAZA_NAMES.has(n));
    const neWaza    = allNames.filter(n =>  NE_WAZA_NAMES.has(n));

    // Scale how many items to include based on session length
    const maxThrows = minutes <= 5 ? 3 : minutes <= 10 ? 5 : throws.length;
    const maxNe     = minutes <= 5 ? 0 : minutes <= 10 ? 3 : neWaza.length;
    const maxCombos = minutes <= 7 ? 0 : minutes <= 15 ? 2 : combos.length;

    const selectedThrows = throws.slice(0, maxThrows);
    const selectedNe     = neWaza.slice(0, maxNe);
    const selectedCombos = combos.slice(0, maxCombos);

    // Time budget: split available time proportionally
    const warmupSecs = Math.round(Math.max(30, 60 * Math.min(scale, 2)));
    const moveCount  = minutes <= 5 ? 3 : 5;
    const iqSecs     = Math.round(Math.max(30, 60 * Math.min(1, scale)));
    const remaining  = Math.max(60, minutes * 60 - warmupSecs - iqSecs);

    const totalItems = selectedThrows.length + selectedNe.length + selectedCombos.length;
    const perItem    = totalItems > 0 ? Math.round(remaining / totalItems) : 60;

    // WARMUP
    blocks.push({
      type: 'warmup', name: 'Warmup', duration: warmupSecs,
      note: 'No static stretching — wake the nervous system up',
      items: WARMUP_MOVES.slice(0, moveCount).map(m => ({
        name: m, duration: Math.round(warmupSecs / moveCount),
      })),
    });

    // THROWS — each item is a real technique name → watch buttons work
    if (selectedThrows.length) {
      const throwDur = Math.round(remaining * (selectedThrows.length / Math.max(totalItems, 1)));
      blocks.push({
        type: 'technique',
        name: beltLabel + ' — Throws',
        duration: throwDur,
        cue: 'Show control, not just power — examiners watch attitude',
        mistake: 'Rushing entries — kuzushi first, every time',
        items: selectedThrows.map(n => ({ name: n, duration: Math.round(throwDur / selectedThrows.length) })),
      });
    }

    // COMBINATIONS
    if (selectedCombos.length) {
      const comboDur = Math.round(remaining * (selectedCombos.length / Math.max(totalItems, 1)));
      blocks.push({
        type: 'technique',
        name: 'Combinations',
        duration: comboDur,
        cue: 'Commit to the first attack — make uke react',
        mistake: 'Stopping after the first technique',
        items: selectedCombos.map(n => ({ name: n, duration: Math.round(comboDur / selectedCombos.length) })),
      });
    }

    // NE-WAZA / HOLDS
    if (selectedNe.length) {
      const neDur = Math.round(remaining * (selectedNe.length / Math.max(totalItems, 1)));
      blocks.push({
        type: 'technique',
        name: 'Ne-waza / Holds',
        duration: neDur,
        cue: 'Weight on far shoulder — stay on your side, not flat',
        mistake: 'Lying flat — you lose the control point',
        items: selectedNe.map(n => ({ name: n, duration: Math.round(neDur / selectedNe.length) })),
      });
    }

    // JUDO IQ
    const iqCard = getTodayIQ();
    blocks.push({
      type: 'iq', name: 'Judo IQ', duration: iqSecs, card: iqCard,
      items: [{ name: iqCard.q, duration: iqSecs }],
    });

    return {
      title: beltLabel + ' Prep',
      themeTag, themeName: 'Belt Prep', themeEmoji: '🏅', themeColor: '#c9952f',
      minutes, location, blocks,
      totalDuration: blocks.reduce((s, b) => s + b.duration, 0),
    };
  }

  // ── ALL OTHER THEMES ──────────────────────────────────────────────
  const content = THEME_CONTENT[themeTag] || THEME_CONTENT.throws;

  // WARMUP
  const warmupSecs = Math.round(Math.max(30, 60 * Math.min(scale, 2)));
  const moveCount  = minutes <= 5 ? 3 : 5;
  blocks.push({
    type: 'warmup', name: 'Warmup', duration: warmupSecs,
    note: 'No static stretching — wake the nervous system up',
    items: WARMUP_MOVES.slice(0, moveCount).map(m => ({
      name: m, duration: Math.round(warmupSecs / moveCount),
    })),
  });

  // TECHNIQUE
  const techSecs   = Math.round(Math.max(60, 180 * Math.min(scale, 3)));
  const phaseCount = minutes >= 10 ? 3 : 2;
  const phaseSecs  = Math.round(techSecs / phaseCount);
  blocks.push({
    type: 'technique', name: content.focus, duration: techSecs,
    cue: content.cue, mistake: content.mistake,
    items: content.phases.slice(0, phaseCount).map(p => ({ name: p, duration: phaseSecs })),
  });

  // STRENGTH (skip for recovery)
  if (themeTag !== 'recovery' && minutes >= 5) {
    const strSecs = Math.round(Math.max(60, 180 * Math.min(scale, 2.5)));
    const rounds  = minutes >= 20 ? 3 : 2;
    const exSecs  = Math.round(strSecs / (rounds * STRENGTH_EXERCISES.length));
    const items   = [];
    for (let r = 0; r < rounds; r++) {
      STRENGTH_EXERCISES.forEach(ex => items.push({ name: ex.name, note: ex.note, duration: exSecs }));
    }
    blocks.push({ type: 'strength', name: 'Strength Block', duration: strSecs, rounds, items });
  }

  // CONDITIONING
  if (minutes >= 7) {
    const condSecs = Math.round(Math.max(60, 120 * Math.min(scale, 2)));
    const exCount  = Math.min(4, Math.max(2, Math.round(condSecs / 30)));
    const itemSecs = Math.round(condSecs / exCount);
    blocks.push({
      type: 'conditioning', name: 'Conditioning', duration: condSecs,
      note: '20 sec ON / 10 sec OFF',
      items: CONDITIONING_EXERCISES.slice(0, exCount).map(ex => ({
        name: ex.name, note: ex.note, duration: itemSecs,
      })),
    });
  }

  // JUDO IQ
  const iqSecs = Math.round(Math.max(30, 60 * Math.min(1, scale)));
  const iqCard = getTodayIQ();
  blocks.push({
    type: 'iq', name: 'Judo IQ', duration: iqSecs, card: iqCard,
    items: [{ name: iqCard.q, duration: iqSecs }],
  });

  return {
    title: theme.name + ' Session',
    themeTag, themeName: theme.name, themeEmoji: theme.emoji, themeColor: theme.color,
    minutes, location, blocks,
    totalDuration: blocks.reduce((s, b) => s + b.duration, 0),
  };
}

// ── HOME STATE ─────────────────────────────────────
let selectedMinutes  = 10;
let selectedLocation = 'solo';
let currentSession   = null;

// ── TODAY'S BUILDER PLAN DETECTION ─────────────────
function getTodayBuilderPlan() {
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today    = dayNames[new Date().getDay()];
  const key      = weekKey(0); // always current week
  const plan     = weekPlans[key];
  if (!plan || !plan[today] || !plan[today].length) return null;
  return { day: today, items: plan[today] };
}

function loadBuilderPlanAsSession(day, items) {
  const secsEach = 120;
  const total    = items.length * secsEach;
  const dateStr  = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  currentSession = {
    title:         day + ' · ' + dateStr,
    themeTag:      'custom',
    themeName:     'Planned Session',
    themeEmoji:    '📅',
    themeColor:    '#1B3E8B',
    minutes:       Math.max(1, Math.round(total / 60)),
    location:      selectedLocation,
    blocks: [{
      type:     'custom',
      name:     'Your Plan — ' + day,
      duration: total,
      cue:      'Work through each item with focus',
      items:    items.map(i => ({ name: i.text, duration: secsEach })),
    }],
    totalDuration: total,
    fromBuilder:   true,
    plannedDay:    day,
  };
  renderHome();
}

// ── BELT PROGRESS HELPER ──────────────────────────
function getActiveBeltInfo() {
  if (typeof BELT_DATA === 'undefined') return null;
  // Use the explicitly set personal target belt
  const b = (typeof getCurrentTargetBelt === 'function') ? getCurrentTargetBelt() : null;
  if (!b) return null;
  const total = b.groups.reduce((s, g) => s + g.items.length, 0);
  const done  = b.groups.reduce((s, g) =>
    s + g.items.filter(item => beltProgress[b.id + '_' + item]).length, 0);
  const pct = total ? Math.round(done / total * 100) : 0;
  const nextItems = [];
  for (const g of b.groups) {
    for (const item of g.items) {
      if (!beltProgress[b.id + '_' + item]) {
        nextItems.push(item);
        if (nextItems.length >= 3) break;
      }
    }
    if (nextItems.length >= 3) break;
  }
  return { belt: b, done, total, pct, nextItems };
}

// ── BELT IMAGE — one file per colour ──────────────
const BELT_IMG_MAP = {
  'belt-color-white':  'belt-white.png',
  'belt-color-red':    'belt-red.png',
  'belt-color-yellow': 'belt-yellow.png',
  'belt-color-orange': 'belt-orange.png',
  'belt-color-green':  'belt-green.png',
  'belt-color-blue':   'belt-blue.png',
  'belt-color-brown':  'belt-brown.png',
};
function beltImg(colorClass) {
  const file = BELT_IMG_MAP[colorClass] || 'belt-red.png';
  return `<img src="images/${file}" class="hd-belt-img" alt="Belt" draggable="false">`;
}

// ── HOME RENDER ────────────────────────────────────
function renderHome() {
  try {
  var activeBelt = getActiveBeltInfo();
  var profile    = getProfile ? getProfile() : null;
  var firstName  = (profile && profile.name) ? profile.name.split(' ')[0] : 'Judoka';
  var streak     = getStreak();
  var totd       = getTOTD();
  var matHours   = getMatHours();
  var pct        = activeBelt ? activeBelt.pct : 0;
  var beltName   = activeBelt ? activeBelt.belt.from + ' Belt' : 'Judoka';
  var targetBeltName = activeBelt ? activeBelt.belt.to + ' Belt' : '';
  var fromHex    = activeBelt ? (BELT_HEX[activeBelt.belt.fromColor] || '#e8e8e8') : '#e8e8e8';
  var toBeltColor = activeBelt ? (BELT_HEX[activeBelt.belt.toColor] || '#888') : '#888';
  var toBeltFile  = activeBelt ? (BELT_IMG_MAP[activeBelt.belt.toColor] || 'belt-red.png') : 'belt-red.png';

  // Adaptive tip
  var tip = getAdaptiveTip(activeBelt, streak, totd ? totd.name : null);

  // Today's technique
  var totdVid   = totd ? getVideoId(totd.url) : null;
  var totdThumb = totdVid ? ('https://img.youtube.com/vi/' + totdVid + '/mqdefault.jpg') : null;
  var techName  = totd ? totd.name : 'Judo Training';
  var techEn    = totd ? (totd.english || totd.translation || '') : '';
  var techCat   = totd ? (totd.subcategory || totd.category || '') : '';
  var techSub   = [techEn, techCat].filter(Boolean).join(' · ');

  // Dynamic CTA
  var hasActive = (typeof currentSession !== 'undefined' && currentSession &&
                   typeof timerInterval !== 'undefined' && timerInterval !== null);
  var donedToday = getSessionLog().some(function(s){ return _sessionDate(s) === todayStr(); });

  // Week streak dots
  var weekDaysDone = getWeekDaysDone();
  var today = new Date();
  var todayDisplayIdx = (today.getDay() + 6) % 7;
  var dayLetters = ['M','T','W','T','F','S','S'];
  var streakDots = dayLetters.map(function(d, i){
    var done = weekDaysDone[i];
    var isToday = (i === todayDisplayIdx);
    if (done) return '<div class="nh-sd nh-sd-done">' + d + '</div>';
    if (isToday) return '<div class="nh-sd nh-sd-today">' + d + '</div>';
    return '<div class="nh-sd nh-sd-rest">' + d + '</div>';
  }).join('');

  // Belt tag label
  var beltTagLabel = targetBeltName
    ? (targetBeltName + ' &nbsp;·&nbsp; ' + (activeBelt && activeBelt.nextItems && activeBelt.nextItems.length ? 'Required' : 'Recommended'))
    : 'Recommended';

  // Tip HTML
  var tipHtml = '';
  if (tip) {
    var tipBg    = (tip.cls === 'nh-adapt-returning') ? '#0a1420' : '#0f1a0f';
    var tipBord  = (tip.cls === 'nh-adapt-returning') ? '#1a3060' : '#1a4a1a';
    var tipCol   = (tip.cls === 'nh-adapt-returning') ? '#60a5fa' : '#4ade80';
    var tagBg    = (tip.cls === 'nh-adapt-returning') ? 'rgba(59,130,246,.12)' : 'rgba(74,222,128,.12)';
    var tagBord  = (tip.cls === 'nh-adapt-returning') ? 'rgba(59,130,246,.25)' : 'rgba(74,222,128,.25)';
    tipHtml = '<div class="nh-adapt-box" style="background:' + tipBg + ';border-color:' + tipBord + '">' +
      '<div class="nh-adapt-tag" style="background:' + tagBg + ';border-color:' + tagBord + ';color:' + tipCol + '">' + tip.tag + '</div>' +
      '<div class="nh-adapt-title" style="color:' + tipCol + '">' + tip.title + '</div>' +
      '<div class="nh-adapt-body">' + tip.body + '</div>' +
      '</div>';
  }

  // Thumb HTML
  var thumbHtml = totdThumb
    ? '<img src="' + totdThumb + '" class="nh-video-thumb" onerror="this.style.display=\'none\'" alt="Technique demo">'
    : '';

  // CTA HTML
  var ctaHtml;
  if (hasActive) {
    ctaHtml = '<button class="nh-hero-btn" style="background:#f59e0b;color:#0d0d12" onclick="showView(\'train\')">' +
      '<span class="nh-btn-icon">&#9654;</span> CONTINUE SESSION' +
      '</button>' +
      '<button class="nh-sec-btn" onclick="onStartFocused()">+ Start today&#39;s training instead</button>';
  } else {
    ctaHtml = '<button class="nh-hero-btn" style="background:#e63946;color:#fff" onclick="onStartFocused()">' +
      '<span class="nh-btn-icon">&#9654;</span> START TODAY&#39;S TRAINING' +
      '</button>';
  }

  document.getElementById('home-body').innerHTML =
  '<style>' +
  /* ── Layout foundation ── */
  '.hf-wrap{display:flex;flex-direction:column;min-height:100%;padding:0 0 80px;box-sizing:border-box}' +
  /* ── Header ── */
  '.hf-header{display:flex;flex-direction:column;gap:2px;padding:8px 14px 6px;flex-shrink:0}' +
  '' +
  '.hf-logo{display:flex;align-items:center;gap:9px}' +
  '.hf-logo-icon{width:32px;height:32px;flex-shrink:0}' +
  '.hf-logo-text{display:flex;flex-direction:column;gap:0}' +
  '.hf-logo-name{font-size:16px;font-weight:800;color:#f4f4f8;letter-spacing:-.3px;line-height:1}' +
  '.hf-logo-sub{font-size:8px;font-weight:700;color:#d97706;letter-spacing:2px;text-transform:uppercase;margin-top:1px}' +
  '.hf-header-right{display:flex;align-items:center;gap:8px;flex-shrink:0}' +
  '.hf-name-pill{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:5px 10px 5px 8px;cursor:pointer;font-size:12px;font-weight:600;color:#f4f4f8;-webkit-tap-highlight-color:transparent}' +
  '.hf-pill-arrow{font-size:9px;color:rgba(255,255,255,.35);margin-left:1px}' +
  '.hf-envelope-btn{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:7px;cursor:pointer;color:#bbb;display:flex;align-items:center;justify-content:center;flex-shrink:0;-webkit-tap-highlight-color:transparent}' +
  /* ── Greeting + identity ── */
  '.hf-greeting{font-size:22px;font-weight:800;color:#f0f0f5;letter-spacing:-.5px;line-height:1.15}' +
  '.hf-identity-row{display:flex;align-items:center;gap:5px;margin-top:1px}' +
  '.hf-belt-colordot{display:inline-block;border-radius:50%;flex-shrink:0}' +
  '.hf-belt-label{font-size:12px;color:#ccc;font-weight:500}' +
  '.hf-identity-sep{color:#444;font-size:11px}' +
  '.hf-streak-fire{font-size:12px}' +
  '.hf-streak-num{font-size:12px;color:#ccc}' +
  /* ── Adaptive tip ── */
  '.nh-adapt-box{border-radius:12px;padding:8px 12px;margin:0 14px 8px;border:1px solid}@media(max-height:680px){.nh-adapt-box{display:none!important}}' +
  '.nh-adapt-tag{display:inline-block;border-radius:5px;border:1px solid;padding:2px 8px;font-size:9px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;margin-bottom:5px}' +
  '.nh-adapt-title{font-size:12px;font-weight:700;margin-bottom:2px}' +
  '.nh-adapt-body{font-size:11px;color:#999;line-height:1.45}' +
  /* ── Today training card ── */
  '.nh-today-card{background:#14090a;border:1px solid #3d1015;border-radius:14px;padding:10px 14px 8px;margin:0 14px 8px}' +
  '.nh-belt-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:7px;padding:3px 9px;font-size:9px;font-weight:700;color:#999;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px}' +
  '.nh-belt-dot-sm{display:inline-block;width:7px;height:7px;border-radius:50%;flex-shrink:0}' +
  '.nh-tech-name{font-size:21px;font-weight:900;color:#fff;line-height:1.1;margin-bottom:2px;letter-spacing:-.4px}' +
  '.nh-tech-sub{font-size:11px;color:#666;margin-bottom:6px}' +
  '.nh-meta-row{display:flex;align-items:center;gap:7px;margin-bottom:7px;flex-wrap:wrap}' +
  '.nh-meta-chip{display:inline-flex;align-items:center;gap:3px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:7px;padding:3px 8px;font-size:10px;font-weight:600;color:#999}' +
  '.nh-meta-done{color:#4ade80!important;background:rgba(74,222,128,.09)!important;border-color:rgba(74,222,128,.18)!important}' +
  '.nh-meta-focus{color:#f97316!important;background:rgba(249,115,22,.09)!important;border-color:rgba(249,115,22,.18)!important}' +
  /* ── Video thumbnail ── */
  '.nh-video-thumb{width:100%;height:130px;object-fit:cover;object-position:center center;border-radius:10px;margin-bottom:12px;background:#0d0d12;display:block}' +
  /* ── CTA buttons ── */
  '.nh-hero-btn{width:100%;border:none;border-radius:11px;padding:10px 14px;font-size:13px;font-weight:800;cursor:pointer;margin-bottom:5px;letter-spacing:.1px;display:flex;align-items:center;justify-content:center;gap:7px;-webkit-tap-highlight-color:transparent}' +
  '.nh-btn-icon{font-size:11px}' +
  '.nh-sec-btn{width:100%;background:transparent;border:none;color:#e63946;font-size:11px;font-weight:600;padding:5px;cursor:pointer;opacity:.75;-webkit-tap-highlight-color:transparent}' +
  /* ── Week streak ── */
  '.nh-streak-section{margin:0 14px 8px;background:#0f0f14;border:1px solid #1e1e28;border-radius:13px;padding:10px 13px}' +
  '.nh-streak-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}' +
  '.nh-section-lbl{font-size:9px;font-weight:700;color:#444;text-transform:uppercase;letter-spacing:.8px}' +
  '.nh-streak-count{font-size:11px;font-weight:700;color:#f59e0b}' +
  '.nh-streak-row{display:flex;gap:5px;justify-content:space-between}' +
  '.nh-sd{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}' +
  '.nh-sd-done{background:#e63946;color:#fff}' +
  '.nh-sd-today{background:transparent;border:1.5px dashed #e63946;color:#e63946}' +
  '.nh-sd-rest{background:rgba(255,255,255,.04);color:#3a3a48}' +
  /* ── Stats row ── */
  '.nh-stats-row{display:flex;gap:8px;margin:0 14px 8px}' +
  '.nh-stat-card{flex:1;background:#0f0f14;border:1px solid #1e1e28;border-radius:13px;padding:11px 8px;text-align:center}' +
  '.nh-stat-val{font-size:19px;font-weight:800;line-height:1}' +
  '.nh-stat-lbl{font-size:9px;color:#444;text-transform:uppercase;letter-spacing:.5px;margin-top:4px}' +
'</style>' +
  '<div class="hf-wrap">' +

    '<div class="hf-header">' +
      '<div class="hf-greeting">Good ' + getTimeOfDay() + ', ' + firstName + '</div>' +
      '<div class="hf-identity-row">' +
        '<span class="hf-belt-colordot" style="background:' + fromHex + '"></span>' +
        '<span class="hf-belt-label">' + beltName + '</span>' +
        '<span class="hf-identity-sep">&nbsp;·&nbsp;</span>' +
        '<span class="hf-streak-fire">🔥</span>' +
        '<span class="hf-streak-num">' + streak + ' day streak</span>' +
      '</div>' +
    '</div>' +

    '<!-- ADAPTIVE TIP -->' +
    tipHtml +

    '<!-- TODAYS TRAINING -->' +
    '<div class="nh-today-card">' +
      '<div class="nh-belt-tag">' +
        '<span class="nh-belt-dot-sm" style="background:' + toBeltColor + '"></span>' +
        beltTagLabel +
      '</div>' +
      '<div class="nh-tech-name">' + techName + '</div>' +
      '<div class="nh-tech-sub">' + techSub + '</div>' +
      '<div class="nh-meta-row">' +
        '<span class="nh-meta-chip"><span>&#9200;</span> 12 min</span>' +
        (donedToday
          ? '<span class="nh-meta-chip nh-meta-done">&#10003; Done today</span>'
          : '<span class="nh-meta-chip nh-meta-focus">&#128293; Today&#39;s focus</span>') +
      '</div>' +
      thumbHtml +
      ctaHtml +
    '</div>' +

    '<!-- WEEK STREAK -->' +
    '<div class="nh-streak-section">' +
      '<div class="nh-streak-top">' +
        '<span class="nh-section-lbl">THIS WEEK</span>' +
        '<span class="nh-streak-count">&#128293; ' + streak + ' day streak</span>' +
      '</div>' +
      '<div class="nh-streak-row">' + streakDots + '</div>' +
    '</div>' +

    '<!-- QUICK STATS -->' +
    '<div class="nh-stats-row">' +
      '<div class="nh-stat-card">' +
        '<div class="nh-stat-val">' + streak + '</div>' +
        '<div class="nh-stat-lbl">Day streak</div>' +
      '</div>' +
      '<div class="nh-stat-card">' +
        '<div class="nh-stat-val" style="font-size:15px;color:#f59e0b">' + matHours + '</div>' +
        '<div class="nh-stat-lbl">Mat hours</div>' +
      '</div>' +
      '<div class="nh-stat-card">' +
        '<div class="nh-stat-val" style="font-size:15px;color:#4ade80">' + pct + '%</div>' +
        '<div class="nh-stat-lbl">Belt done</div>' +
      '</div>' +
    '</div>' +

  '</div>';
  } catch(e) {
    var el=document.getElementById('home-body');
    if(el) el.innerHTML='<div style="padding:20px;color:#e63946;font-size:12px;background:#14090a;margin:14px;border-radius:12px;border:1px solid #3d1015"><b>JS Error:</b><br>'+e.message+'<br><small style="color:#888">'+e.stack+'</small></div>';
  }
}


function revealIQCard() {
  const sub = document.getElementById('hf-iq-sub');
  const tap = document.getElementById('hf-iq-tap');
  if (sub && tap) {
    sub.style.display = 'block';
    tap.style.display = 'none';
  }
}

// Time-of-day greeting
function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

// Start focused session from home CTA
function onStartFocused() {
  const theme = DAILY_THEMES[new Date().getDay()];
  currentSession = generateSession(selectedMinutes || 15, selectedLocation || 'home', theme.tag);
  showView('train');
}



function selectTime(m) {
  selectedMinutes = m;
  const theme = DAILY_THEMES[new Date().getDay()];
  currentSession = generateSession(selectedMinutes, selectedLocation, theme.tag);
  renderHome();
}

function selectLocation(v) {
  selectedLocation = v;
  const theme = DAILY_THEMES[new Date().getDay()];
  currentSession = generateSession(selectedMinutes, selectedLocation, theme.tag);
  renderHome();
}

function revealIQ() {
  document.getElementById('iq-answer').style.display = 'block';
  document.getElementById('iq-btn').style.display = 'none';
}

function onJustStart() {
  const tag = DAILY_THEMES[new Date().getDay()].tag;
  currentSession = {
    title: 'Just 60 Seconds',
    themeTag: tag, themeName: 'Quick', themeEmoji: '⚡', themeColor: '#e8c84a',
    minutes: 1, location: selectedLocation,
    blocks: [{
      type: 'technique',
      name: THEME_CONTENT[tag] ? THEME_CONTENT[tag].focus : 'Shadow Uchikomi',
      duration: 60,
      cue: THEME_CONTENT[tag] ? THEME_CONTENT[tag].cue : 'Just move.',
      mistake: '',
      items: [{ name: 'Just move. Shadow uchikomi. Anything. Go.', duration: 60 }],
    }],
    totalDuration: 60,
  };
  startSession();
}

// ── BEFORE CLASS ───────────────────────────────────
function generateBeforeClassSession() {
  const totd = getTOTD();
  return {
    title: 'Class Prep',
    themeTag: 'beltprep', themeName: 'Class Prep', themeEmoji: '🥊', themeColor: '#27ae60',
    minutes: 2, location: 'solo',
    blocks: [{
      type: 'warmup',
      name: '2-min Class Prep',
      duration: 120,
      cue: 'Wake the body up — don\'t exhaust it',
      items: [
        { name: 'Hip circles — big and slow, both ways',              duration: 20 },
        { name: 'Shoulder rolls and arm swings',                      duration: 20 },
        { name: 'Shadow uchikomi — your best throw × 10',            duration: 30 },
        { name: 'Grip reminder: sleeve first, then lapel',            duration: 15 },
        { name: totd.name + ' — 3 slow entries, feel the mechanics', duration: 25 },
        { name: 'Mindset: attack first, stay relaxed',                duration: 10 },
      ],
    }],
    totalDuration: 120,
  };
}

function startBeforeClassSession() {
  currentSession = generateBeforeClassSession();
  startSession();
}

// ── AFTER CLASS CAPTURE ────────────────────────────
let captureSelectedTechs = [];

function openCapture() {
  captureSelectedTechs = [];
  renderCapture();
  document.getElementById('capture-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCapture() {
  document.getElementById('capture-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function toggleCaptureTech(name) {
  const idx = captureSelectedTechs.indexOf(name);
  if (idx > -1) captureSelectedTechs.splice(idx, 1);
  else captureSelectedTechs.push(name);
  // Re-render just the chips
  document.querySelectorAll('.capture-chip').forEach(b => {
    b.classList.toggle('active', captureSelectedTechs.includes(b.dataset.name));
  });
}

function renderCapture() {
  // Show orange belt techs + a handful of ground techs as quick-tap chips
  const quickTechs = [
    ...ORANGE_BELT_TECHS,
    'Kesa-gatame','Kuzure-kesa-gatame','Yoko-shiho-gatame','Kami-shiho-gatame',
  ];

  document.getElementById('capture-inner').innerHTML = `
    <div class="capture-header">
      <h3>📝 Log your training</h3>
      <button class="capture-close" onclick="closeCapture()">✕</button>
    </div>

    <div class="capture-section-label">Techniques drilled today</div>
    <div class="capture-chips">
      ${quickTechs.map(name => `
        <button class="capture-chip" data-name="${name}" onclick="toggleCaptureTech('${esc(name)}')">${name}</button>
      `).join('')}
    </div>

    <div class="capture-section-label">What clicked? 💡</div>
    <textarea class="capture-ta" id="capture-win" placeholder="Something that worked…"></textarea>

    <div class="capture-section-label">What to fix next time? 🔧</div>
    <textarea class="capture-ta" id="capture-fix" placeholder="Something to drill harder…"></textarea>

    <div class="capture-actions">
      <button class="capture-skip-btn" onclick="closeCapture()">Skip</button>
      <button class="capture-save-btn" onclick="saveCapture()">Save log</button>
    </div>
  `;
}

function saveCapture() {
  const win = (document.getElementById('capture-win').value || '').trim();
  const fix = (document.getElementById('capture-fix').value || '').trim();
  const log = JSON.parse(localStorage.getItem('judo_capture_log') || '[]');
  log.push({ date: todayStr(), techniques: [...captureSelectedTechs], win, fix, ts: Date.now() });
  localStorage.setItem('judo_capture_log', JSON.stringify(log));
  showToast('Training logged! 💪');
  closeCapture();
  renderHome(); // refresh streak/XP
}

// ── SESSION TIMER ──────────────────────────────────
let timerInterval = null;
let timerPaused   = false;
let timerBlockIdx = 0;
let timerItemIdx  = 0;
let timerSecsLeft = 0;
let timerMode     = 'item'; // 'item' | 'rest'
const BLOCK_REST_SECS = 12;

function getTotalItemCount() {
  return (currentSession && currentSession.blocks ? currentSession.blocks : []).reduce((s, b) => s + b.items.length, 0);
}
function getCurrentItemNum() {
  let n = 0;
  for (let b = 0; b < timerBlockIdx; b++) n += currentSession.blocks[b].items.length;
  return n + timerItemIdx + 1;
}

function startSession() {
  if (!currentSession || !currentSession.blocks.length) return;
  timerBlockIdx = 0;
  timerItemIdx  = 0;
  timerMode     = 'item';
  timerSecsLeft = currentSession.blocks[0].items[0].duration;
  // Auto-pause at start of technique blocks so user can preview the move
  timerPaused   = (currentSession.blocks[0].type === 'technique');
  document.getElementById('session-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  paintTimer();
  timerInterval = setInterval(timerTick, 1000);
}

function timerTick() {
  if (timerPaused) return;
  timerSecsLeft--;
  if (timerSecsLeft <= 0) advanceTimer();
  else paintTimer();
}

function advanceTimer() {
  if (!currentSession || !currentSession.blocks) return;
  if (timerBlockIdx >= currentSession.blocks.length) { finishSession(); return; }
  if (timerMode === 'rest') {
    timerMode = 'item';
    const restBlock = currentSession.blocks[timerBlockIdx];
    if (!restBlock || !restBlock.items || !restBlock.items[timerItemIdx]) { finishSession(); return; }
    timerSecsLeft = restBlock.items[timerItemIdx].duration;
    // Auto-pause at new technique block so user can preview the move
    if (restBlock.type === 'technique') timerPaused = true;
    paintTimer();
    return;
  }
  const session = currentSession;
  const block   = session.blocks[timerBlockIdx];
  if (!block || !block.items) { finishSession(); return; }
  timerItemIdx++;
  if (timerItemIdx >= block.items.length) {
    timerBlockIdx++;
    timerItemIdx = 0;
    if (timerBlockIdx >= session.blocks.length) { finishSession(); return; }
    timerMode     = 'rest';
    timerSecsLeft = BLOCK_REST_SECS;
    paintTimer();
    return;
  }
  timerSecsLeft = session.blocks[timerBlockIdx].items[timerItemIdx].duration;
  // Auto-pause on each new technique item so user can preview the move
  if (block.type === 'technique') timerPaused = true;
  paintTimer();
}

function paintTimer() {
  if (!currentSession || !currentSession.blocks) return;
  if (timerMode === 'rest') { paintRestScreen(); return; }
  if (timerBlockIdx >= currentSession.blocks.length) return;
  const session = currentSession;
  const block   = session.blocks[timerBlockIdx];
  if (!block || !block.items || !block.items[timerItemIdx]) return;
  const item    = block.items[timerItemIdx];
  const col     = BLOCK_COLORS[block.type] || '#e8c84a';

  const circumference = 2 * Math.PI * 54;
  const progress      = Math.max(0, timerSecsLeft / item.duration);
  const dashOffset    = circumference * (1 - progress);

  const mins    = Math.floor(timerSecsLeft / 60);
  const secs    = timerSecsLeft % 60;
  const timeStr = mins > 0 ? mins + ':' + String(secs).padStart(2, '0') : secs + 's';

  const currentNum = getCurrentItemNum();
  const totalItems = getTotalItemCount();

  let nextLabel = '';
  if (timerItemIdx + 1 < block.items.length) {
    nextLabel = block.items[timerItemIdx + 1].name;
  } else if (timerBlockIdx + 1 < session.blocks.length) {
    nextLabel = session.blocks[timerBlockIdx + 1].name + ' →';
  }

  let cueLine = '';
  if (block.cue)     cueLine  = `<div class="timer-cue">💡 ${block.cue}</div>`;
  if (block.mistake) cueLine += `<div class="timer-mistake">⚠️ Avoid: ${block.mistake}</div>`;
  if (block.type === 'iq') cueLine = `<div class="timer-cue">🧠 ${block.card.q}<br><br><strong>${block.card.a}</strong></div>`;

  const techMatch = TECHNIQUES.find(t => t.name === item.name);
  const videoId   = techMatch ? getVideoId(techMatch.url) : null;

  // Prominent video thumbnail — shown above the ring so users see the move
  const videoSection = videoId
    ? `<div class="timer-video-preview" onclick="timerPaused=true; paintTimer(); openModal('${esc(item.name)}')">
         <img class="timer-video-thumb"
              src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg"
              alt="${esc(item.name)}"
              onerror="this.parentElement.style.display='none'"/>
         <div class="timer-video-overlay">
           <div class="timer-video-play-btn">&#9654;</div>
           <div class="timer-video-label">Watch ${item.name}</div>
         </div>
       </div>`
    : '';

  const dots = session.blocks.map((b, i) =>
    `<div class="timer-dot${i === timerBlockIdx ? ' active' : i < timerBlockIdx ? ' done' : ''}"` +
    ` style="${i === timerBlockIdx ? 'background:' + col : ''}"></div>`
  ).join('');

  document.getElementById('session-overlay-inner').innerHTML = `
    <div class="timer-header">
      <button class="timer-close-btn" onclick="closeSession()">&#10005; End</button>
      <div class="timer-progress-label">${currentNum} / ${totalItems}</div>
      <div class="timer-dots">${dots}</div>
    </div>
    <div class="timer-block-name" style="color:${col}">${block.name}</div>
    <div class="timer-exercise">${item.name}</div>
    ${item.note ? `<div class="timer-item-note">${item.note}</div>` : ''}
    ${videoSection}
    <div class="timer-ring-wrap${videoSection ? ' timer-ring-sm' : ''}">
      <svg class="timer-ring" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
        <circle cx="60" cy="60" r="54" fill="none" stroke="${col}" stroke-width="8"
          stroke-linecap="round"
          stroke-dasharray="${circumference.toFixed(2)}"
          stroke-dashoffset="${dashOffset.toFixed(2)}"
          transform="rotate(-90 60 60)"/>
      </svg>
      <div class="timer-countdown-inner" style="color:${col}">${timeStr}</div>
    </div>
    ${cueLine}
    ${nextLabel ? `<div class="timer-next">Up next: ${nextLabel}</div>` : ''}
    <div class="timer-controls">
      <button class="timer-btn" onclick="timerSkip()">Skip &#8594;</button>
      <button class="timer-btn timer-btn-primary" onclick="timerTogglePause()">
        ${timerPaused ? '&#9654; Start' : '&#9646;&#9646; Pause'}
      </button>
    </div>
  `;
}

function paintRestScreen() {
  const session   = currentSession;
  const nextBlock = session.blocks[timerBlockIdx];
  const col       = BLOCK_COLORS[nextBlock.type] || '#e8c84a';
  const circumference = 2 * Math.PI * 54;
  const dashOffset    = (circumference * (1 - timerSecsLeft / BLOCK_REST_SECS)).toFixed(2);

  document.getElementById('session-overlay-inner').innerHTML = `
    <div class="timer-header">
      <button class="timer-close-btn" onclick="closeSession()">&#10005; End</button>
    </div>
    <div class="timer-rest-label">REST</div>
    <div class="timer-ring-wrap">
      <svg class="timer-ring" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
        <circle cx="60" cy="60" r="54" fill="none" stroke="#27ae60" stroke-width="8"
          stroke-linecap="round"
          stroke-dasharray="${circumference.toFixed(2)}"
          stroke-dashoffset="${dashOffset}"
          transform="rotate(-90 60 60)"/>
      </svg>
      <div class="timer-countdown-inner" style="color:#27ae60">${timerSecsLeft}s</div>
    </div>
    <div class="timer-rest-next">Next: <strong style="color:${col}">${nextBlock.name}</strong></div>
    <div class="timer-rest-items">
      ${nextBlock.items.slice(0, 4).map(i => `<div class="timer-rest-item">&middot; ${i.name}</div>`).join('')}
    </div>
    <button class="timer-btn timer-btn-primary" style="margin-top:20px" onclick="timerSkipRest()">Ready &#8594;</button>
  `;
}

function timerTogglePause() { timerPaused = !timerPaused; paintTimer(); }
function timerSkip()        { timerSecsLeft = 0; advanceTimer(); }
function timerSkipRest()    { timerSecsLeft = 0; advanceTimer(); }

// ── FINISH SESSION ─────────────────────────────────
function finishSession() {
  clearInterval(timerInterval);
  timerInterval = null;
  if (!currentSession) return;
  logSessionComplete();

  const xpEarned    = calcSessionXP(currentSession);
  const totalXP     = addXP(xpEarned);
  const streakCount = getStreak();
  const itemCount   = getTotalItemCount();

  document.getElementById('session-overlay-inner').innerHTML = `
    <div class="timer-finish">
      <div class="timer-finish-emoji">&#129355;</div>
      <div class="timer-finish-title">Session complete!</div>
      <div class="timer-finish-xp">+${xpEarned} XP</div>
      <div class="timer-finish-total">${totalXP} total XP</div>
      <div class="timer-finish-sub">
        ${currentSession.minutes} min &middot; ${itemCount} exercises &middot; ${(currentSession.themeName||currentSession.title||'training').toLowerCase()}
        ${streakCount > 1 ? '<br>&#128293; ' + streakCount + '-day streak!' : ''}
      </div>
      <button class="home-start-btn" onclick="closeSessionAndCapture()">&#128221; Log training</button>
      <button class="timer-finish-skip" onclick="closeSession()">Skip</button>
    </div>
  `;
}

function closeSession() {
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById('session-overlay').classList.remove('open');
  document.body.style.overflow = '';
  renderHome();
}

function closeSessionAndCapture() {
  clearInterval(timerInterval);
nt.getElementById('session-overlay').classList.remove('open');
  document.body.style.overflow = '';
  const overlay = document.getElementById('capture-overlay');
  if (!overlay) { renderHome(); return; }
  const techs = currentSession.blocks.filter(b => b.type === 'technique').map(b => b.name);
  overlay.innerHTML = `
    <div class="cap-inner">
      <div class="cap-title">Log this session?</div>
      <div class="cap-list" id="cap-list">
        ${techs.map((t,i) => `
          <label class="cap-item">
            <input type="checkbox" checked data-tech="${t}">
            <span>${t}</span>
          </label>`).join('')}
      </div>
      <textarea class="cap-notes" id="cap-notes" placeholder="Notes on today's session (optional)…"></textarea>
      <div class="cap-actions">
        <button class="cap-save" onclick="saveCapture()">Save session log</button>
        <button class="cap-skip" onclick="closeCapture()">Skip</button>
      </div>
    </div>`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCapture() {
  document.getElementById('capture-overlay').classList.remove('open');
  document.body.style.overflow = '';
  renderHome();
}

function saveCapture() {
  const boxes = document.querySelectorAll('#cap-list input[type=checkbox]');
  const logged = Array.from(boxes).filter(b => b.checked).map(b => b.dataset.tech);
  const notes  = (document.getElementById('cap-notes') || {}).value || '';

  const entry = {
    date:       new Date().toISOString().slice(0,10),
    sessionId:  currentSession ? currentSession.id : null,
    title:      currentSession ? (currentSession.title || currentSession.themeName || 'Training') : 'Training',
    minutes:    currentSession ? currentSession.minutes : 0,
    techniques: logged,
    notes:      notes,
  };

  const log = JSON.parse(localStorage.getItem('judo_session_log') || '[]');
  log.push(entry);
  localStorage.setItem('judo_session_log', JSON.stringify(log));

  closeCapture();
  showToast('Session logged ✓');
}

// ══════════════════════════════════════════════════════════════════
// HOME SECTION BUILDERS
// ══════════════════════════════════════════════════════════════════

// ── ① CONTINUE LEARNING ───────────────────────────────────────────
function buildContinueLearning(activeBelt) {
  if (!activeBelt) return '';
  const b = activeBelt.belt;

  // Collect all technique items for this belt (up to 5)
  const rows = [];
  for (const g of b.groups) {
    for (const itemName of g.items) {
      if (rows.length >= 5) break;
      const tech      = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === itemName) : null;
      const vid       = tech ? getVideoId(tech.url) : null;
      const thumb     = vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : null;
      const thumbIsIllus = false;
      const isDone    = !!beltProgress[b.id + '_' + itemName];
      rows.push({ name: itemName, en: tech ? tech.en : '', thumb, vid, isDone });
    }
    if (rows.length >= 5) break;
  }

  const rowsHtml = rows.map((r, idx) => `
    <div class="cl-row${r.isDone ? ' cl-done' : ''}" ${!r.isDone && r.vid ? `onclick="openModal('${r.name.replace(/'/g,"\\'")}')"` : ''}>
      <div class="cl-thumb-wrap">
        ${r.thumb
          ? `<img class="${r.thumbIsIllus ? 'cl-thumb cl-thumb-illus' : 'cl-thumb'}" src="${r.thumb}" alt="${r.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : ''}
        <div class="cl-thumb-fallback"${r.thumb ? ' style="display:none"' : ''}>
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <circle cx="20" cy="10" r="5" fill="#bbb"/>
            <path d="M10 28c0-6 4-10 10-10s10 4 10 10" stroke="#bbb" stroke-width="2.5" fill="none"/>
            <path d="M14 22l-4 8M26 22l4 8" stroke="#bbb" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      <div class="cl-info">
        <div class="cl-name">${r.name}</div>
        ${r.en ? `<div class="cl-en">${r.en}</div>` : ''}
        ${r.isDone ? `<div class="cl-status-done">Completed</div>` : `<div class="cl-mini-bar"><div class="cl-mini-fill" style="width:${r.vid ? '45' : '20'}%"></div></div>`}
      </div>
      <div class="cl-action">
        ${r.isDone
          ? `<div class="cl-check"><svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="11" stroke="#22c55e" stroke-width="1.8" fill="none"/><polyline points="7,12 10.5,16 17,8" stroke="#22c55e" stroke-width="2" fill="none" stroke-linecap="round"/></svg></div>`
          : `<button class="cl-play${!r.vid ? ' cl-play-dim' : ''}" onclick="${r.vid ? `event.stopPropagation();openModal('${r.name.replace(/'/g,"\\'")}')` : 'void(0)'}"><svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="11" stroke="#999" stroke-width="1.5" fill="none"/><polygon points="10,8 17,12 10,16" fill="#555"/></svg></button>`}
      </div>
    </div>
  `).join('');

  // Belt Quiz row
  const quizRow = `
    <div class="cl-row cl-quiz-row" onclick="showView('belt')">
      <div class="cl-thumb-wrap">
        <div class="cl-quiz-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <rect x="4" y="4" width="32" height="32" rx="8" fill="#3b82f6" opacity=".15"/>
            <rect x="4" y="4" width="32" height="32" rx="8" stroke="#3b82f6" stroke-width="1.5"/>
            <text x="20" y="27" text-anchor="middle" font-size="18" fill="#3b82f6">?</text>
          </svg>
        </div>
      </div>
      <div class="cl-info">
        <div class="cl-name">${b.to} Belt Quiz</div>
        <div class="cl-en">${activeBelt.total} questions</div>
        <div class="cl-mini-bar"><div class="cl-mini-fill" style="width:${activeBelt.pct}%"></div></div>
      </div>
      <div class="cl-action">
        <button class="cl-play"><svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="11" stroke="#999" stroke-width="1.5" fill="none"/><polygon points="10,8 17,12 10,16" fill="#555"/></svg></button>
      </div>
    </div>`;

  return `
  <div class="cl-section">
    <div class="cl-header">
      <span class="cl-title">Continue Learning</span>
      <button class="cl-viewall" onclick="showView('belt')">View all</button>
    </div>
    <div class="cl-card">
      ${rowsHtml}
      ${quizRow}
    </div>
  </div>`;
}

// ── ② QUICK STATS ─────────────────────────────────────────────────
function getOverallProgress() {
  if (typeof BELT_DATA === 'undefined') return 0;
  const total = BELT_DATA.reduce((s, b) => s + b.groups.reduce((gs, g) => gs + g.items.length, 0), 0);
  const done  = BELT_DATA.reduce((s, b) => s + b.groups.reduce((gs, g) =>
    gs + g.items.filter(i => !!beltProgress[b.id + '_' + i]).length, 0), 0);
  return total ? Math.round(done / total * 100) : 0;
}

function buildQuickStats(streak, xp) {
  const overall = getOverallProgress();
  // SVG donut: r=28, circumference ≈ 175.9
  const r = 28, circ = +(2 * Math.PI * r).toFixed(1);
  const offset = +(circ * (1 - overall / 100)).toFixed(1);
  return `
  <div class="qs-section">
    <div class="qs-title">Quick Stats</div>
    <div class="qs-card">
      <div class="qs-half qs-left">
        <div class="qs-streak-row">
          <span class="qs-big">${streak || 0}</span>
          <span class="qs-fire">🔥</span>
        </div>
        <div class="qs-label">Day Streak</div>
      </div>
      <div class="qs-divider"></div>
      <div class="qs-half qs-right">
        <div class="qs-donut-row">
          <div>
            <div class="qs-big">${overall}%</div>
            <div class="qs-label">Overall Progress</div>
          </div>
          <svg class="qs-donut" viewBox="0 0 72 72" width="56" height="56">
            <circle cx="36" cy="36" r="${r}" fill="none" stroke="#333" stroke-width="7"/>
            <circle cx="36" cy="36" r="${r}" fill="none" stroke="#F5C542" stroke-width="7"
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
              stroke-linecap="round"
              transform="rotate(-90 36 36)"/>
          </svg>
        </div>
      </div>
    </div>
  </div>`;
}

// ── ③ COACHING TIP ────────────────────────────────────────────────
const COACHING_TIPS = [
  { title: 'Focus on Kuzushi',      body: 'Every throw starts with balance breaking. Master kuzushi and the throw will follow.',                      img: 'tech-o-goshi.png' },
  { title: 'Control Your Grip',     body: 'Secure the sleeve before the lapel. A dominant grip wins half the battle before the throw begins.',         img: 'tech-tsuri-komi-goshi.png' },
  { title: 'Perfect Your Ukemi',    body: 'Good falling is good judo. Train your ukemi daily — it builds confidence and protects your body.',           img: 'tech-o-soto-gari.png' },
  { title: 'Use Combinations',      body: 'Set up your big throw with a smaller attack first. Two-attack combinations catch opponents off guard.',       img: 'tech-tai-otoshi.png' },
  { title: 'Ne-Waza Wins Contests', body: 'Ground work decides matches. Even 3 seconds of osaekomi-waza can turn a contest around.',                    img: 'tech-ne-waza-hold.png' },
  { title: 'Drive Through the Throw',body: 'Commit fully to every entry. Half-hearted attempts give your opponent the chance to counter.',              img: 'tech-harai-goshi.png' },
  { title: 'Randori Mindset',       body: 'In randori, experiment freely. In shiai, execute only what you know. Train both modes separately.',          img: 'tech-uchi-mata.png' },
];

function buildCoachingTip() {
  const tip = COACHING_TIPS[new Date().getDay() % COACHING_TIPS.length];
  return `
  <div class="ct-card">
    <div class="ct-header-row">
      <div class="ct-icon-wrap">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path d="M12 2a7 7 0 0 1 4 12.9V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.1A7 7 0 0 1 12 2z" stroke="#3b82f6" stroke-width="1.8" fill="none"/>
          <path d="M9 21h6M10 18v1M14 18v1" stroke="#3b82f6" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="ct-label">Coaching Tip</span>
    </div>
    <div class="ct-body-wrap">
      <div class="ct-text-col">
        <div class="ct-title">${tip.title}</div>
        <div class="ct-body">${tip.body}</div>
      </div>
      <div class="ct-illo">
        ${tip.img ? `<img src="images/${tip.img}" class="ct-illo-img" alt="${tip.title}">` : ''}
      </div>
    </div>
  </div>`;
}

// ── ④ QUICK REVISION ──────────────────────────────────────────────
function buildQuickRevision() {
  const timerSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6M12 2v3"/>
  </svg>`;
  return `
  <div class="qr-card">
    <div class="qr-title">Quick Revision</div>
    <div class="qr-sub">Short on time? Try a quick revision session.</div>
    <button class="qr-btn" onclick="startQuickRevision(5)">
      <span class="qr-btn-icon">${timerSvg}</span>
      <span class="qr-btn-label">5 Min Session</span>
    </button>
    <button class="qr-btn" onclick="startQuickRevision(10)">
      <span class="qr-btn-icon">${timerSvg}</span>
      <span class="qr-btn-label">10 Min Session</span>
    </button>
    <button class="qr-btn" onclick="startQuickRevision(0)">
      <span class="qr-btn-icon">${timerSvg}</span>
      <span class="qr-btn-label">Custom Quiz</span>
    </button>
  </div>`;
}

// ── COACHING TIP AUTO-ROTATE ────────────────────────────────────
let _ctIndex = new Date().getDay() % COACHING_TIPS.length;
let _ctInterval = null;

function startCoachingTipRotation(intervalMinutes) {
  if (_ctInterval) clearInterval(_ctInterval);
  _ctInterval = setInterval(() => {
    _ctIndex = (_ctIndex + 1) % COACHING_TIPS.length;
    const card = document.querySelector('.ct-card');
    if (!card) return;
    card.classList.add('ct-fade-out');
    setTimeout(() => {
      const tip = COACHING_TIPS[_ctIndex];
      card.querySelector('.ct-title').textContent = tip.title;
      card.querySelector('.ct-body').textContent  = tip.body;
      const img = card.querySelector('.ct-illo-img');
      if (img) {
        img.src = tip.img ? 'images/' + tip.img : '';
        img.style.display = tip.img ? '' : 'none';
      }
      card.classList.remove('ct-fade-out');
      card.classList.add('ct-fade-in');
      setTimeout(() => card.classList.remove('ct-fade-in'), 400);
    }, 300);
  }, intervalMinutes * 60 * 1000);
}

// ── QUICK REVISION QUIZ ENGINE ───────────────────────────────────
let _quizState = null;

function startQuickRevision(minutes) {
  const activeBelt = getActiveBeltInfo();
  // Build question pool from TECHNIQUES — prefer belt techniques, pad with others
  let pool = [];
  if (activeBelt) {
    const b = activeBelt.belt;
    for (const g of b.groups) {
      for (const name of g.items) {
        const t = (typeof TECHNIQUES !== 'undefined') ? TECHNIQUES.find(t => t.name === name) : null;
        if (t && t.en) pool.push(t);
      }
    }
  }
  // Pad with random techniques if needed
  if (typeof TECHNIQUES !== 'undefined') {
    const extras = TECHNIQUES.filter(t => t.en && !pool.find(p => p.name === t.name));
    extras.sort(() => Math.random() - .5);
    pool = pool.concat(extras);
  }
  pool.sort(() => Math.random() - .5);

  const qCount = minutes === 5 ? 8 : minutes === 10 ? 15 : 10;
  const questions = pool.slice(0, Math.min(qCount, pool.length)).map(t => {
    // Wrong answers: 3 random English names
    const wrong = TECHNIQUES
      .filter(x => x.en && x.en !== t.en)
      .sort(() => Math.random() - .5)
      .slice(0, 3)
      .map(x => x.en);
    const choices = [t.en, ...wrong].sort(() => Math.random() - .5);
    return { q: t.name, a: t.en, choices, img: getTechImg(t.name) };
  });

  _quizState = { questions, current: 0, score: 0, minutes };
  renderQuizModal();
}

function renderQuizModal() {
  const existing = document.getElementById('quiz-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'quiz-modal';

  if (!_quizState || _quizState.current >= _quizState.questions.length) {
    // Results screen
    const total = _quizState ? _quizState.questions.length : 0;
    const score = _quizState ? _quizState.score : 0;
    const pct   = total ? Math.round(score / total * 100) : 0;
    const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪';
    modal.innerHTML = `
      <div class="qm-overlay" onclick="closeQuizModal()"></div>
      <div class="qm-sheet">
        <div class="qm-result-emoji">${emoji}</div>
        <div class="qm-result-score">${score} / ${total}</div>
        <div class="qm-result-pct">${pct}% correct</div>
        <div class="qm-result-msg">${pct >= 80 ? 'Excellent work, Judoka!' : pct >= 50 ? 'Good effort - keep training!' : 'Keep practising - you will get there!'}</div>
        <button class="qm-close-btn" onclick="startQuickRevision(${_quizState ? _quizState.minutes : 5})">Try Again</button>
        <button class="qm-close-btn qm-close-secondary" onclick="closeQuizModal()">Done</button>
      </div>`;
  } else {
    const q   = _quizState.questions[_quizState.current];
    const num = _quizState.current + 1;
    const tot = _quizState.questions.length;
    const pct = Math.round((_quizState.current / tot) * 100);
    modal.innerHTML = `
      <div class="qm-overlay" onclick="closeQuizModal()"></div>
      <div class="qm-sheet">
        <div class="qm-top-bar">
          <button class="qm-x" onclick="closeQuizModal()">✕</button>
          <div class="qm-progress-track"><div class="qm-progress-fill" style="width:${pct}%"></div></div>
          <span class="qm-counter">${num}/${tot}</span>
        </div>
        ${q.img ? `<img src="${q.img}" class="qm-tech-img" alt="${q.q}">` : '<div class="qm-tech-img-placeholder"></div>'}
        <div class="qm-question">What does <strong>${q.q}</strong> mean?</div>
        <div class="qm-choices">
          ${q.choices.map(c => `
            <button class="qm-choice" onclick="answerQuiz('${c.replace(/'/g,"\'")}', '${q.a.replace(/'/g,"\'")}', this)">${c}</button>
          `).join('')}
        </div>
      </div>`;
  }

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.querySelector('.qm-sheet').classList.add('qm-sheet-open'));
}

function answerQuiz(chosen, correct, btn) {
  const choices = document.querySelectorAll('.qm-choice');
  choices.forEach(b => b.disabled = true);
  if (chosen === correct) {
    btn.classList.add('qm-correct');
    _quizState.score++;
  } else {
    btn.classList.add('qm-wrong');
    choices.forEach(b => { if (b.textContent === correct) b.classList.add('qm-correct'); });
  }
  setTimeout(() => {
    _quizState.current++;
    renderQuizModal();
  }, 900);
}

function closeQuizModal() {
  const m = document.getElementById('quiz-modal');
  if (m) {
    m.querySelector('.qm-sheet').classList.remove('qm-sheet-open');
    setTimeout(() => m.remove(), 300);
  }
}

// ══════════════════════════════════════════════════════════════════
// TECHNIQUE ILLUSTRATION MAP
// Keys normalised to match TECHNIQUES array name field (lowercase)
// ══════════════════════════════════════════════════════════════════
const TECH_IMG = {
  'de-ashi-barai':           'tech-de-ashi-barai.png',
  'de-ashi-harai':           'tech-de-ashi-barai.png',
  'hiza-guruma':             'tech-hiza-guruma.png',
  'sasae-tsuri-komi-ashi':   'tech-sasae-tsuri-komi-ashi.png',
  'o-goshi':                 'tech-o-goshi.png',
  'o-soto-gari':             'tech-o-soto-gari.png',
  'uki-goshi':               'tech-uki-goshi.png',
  'o-uchi-gari':             'tech-o-uchi-gari.png',
  'seoi-nage':               'tech-seoi-nage.png',
  'ippon-seoi-nage':         'tech-seoi-nage.png',
  'morote-seoi-nage':        'tech-seoi-nage.png',
  'eri-seoi-nage':           'tech-seoi-nage.png',
  'ko-soto-gari':            'tech-ko-soto-gari.png',
  'ko-uchi-gari':            'tech-ko-uchi-gari.png',
  'koshi-guruma':            'tech-koshi-guruma.png',
  'tsuri-komi-goshi':        'tech-tsuri-komi-goshi.png',
  'okuri-ashi-barai':        'tech-okuri-ashi-barai.png',
  'okuri-ashi-harai':        'tech-okuri-ashi-barai.png',
  'tai-otoshi':              'tech-tai-otoshi.png',
  'harai-goshi':             'tech-harai-goshi.png',
  'uchi-mata':               'tech-uchi-mata.png',
  'ko-soto-gake':            'tech-ko-soto-gake.png',
  'tsuri-goshi':             'tech-tsuri-goshi.png',
  'yoko-otoshi':             'tech-yoko-otoshi.png',
  'ashi-guruma':             'tech-ashi-guruma.png',
  'hane-goshi':              'tech-hane-goshi.png',
  'harai-tsuri-komi-ashi':   'tech-harai-tsuri-komi-ashi.png',
  'sumi-gaeshi':             'tech-sumi-gaeshi.png',
  'tani-otoshi':             'tech-tani-otoshi.png',
  'hane-maki-komi':          'tech-hane-maki-komi.png',
  'sukui-nage':              'tech-sukui-nage.png',
  'utsuri-goshi':            'tech-utsuri-goshi.png',
  'o-guruma':                'tech-o-guruma.png',
  'soto-maki-komi':          'tech-soto-maki-komi.png',
  'uki-otoshi':              'tech-uki-otoshi.png',
  'o-soto-guruma':           'tech-o-soto-guruma.png',
  'uki-waza':                'tech-uki-waza.png',
  'yoko-wakare':             'tech-yoko-wakare.png',
  'yoko-guruma':             'tech-yoko-guruma.png',
  'ushiro-goshi':            'tech-ushiro-goshi.png',
  'ura-nage':                'tech-ura-nage.png',
  'sumi-otoshi':             'tech-sumi-otoshi.png',
  'yoko-gake':               'tech-yoko-gake.png',
};

/**
 * Get illustration path for a technique name.
 * Returns null if no illustration exists.
 */
function getTechImg(techName) {
  if (!techName) return null;
  const key = techName.toLowerCase().trim();
  return TECH_IMG[key] ? 'images/' + TECH_IMG[key] : null;
}
