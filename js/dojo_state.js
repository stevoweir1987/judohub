// ═══════════════════════════════════════════════════
//  dojo_state.js — State management for Dojo Master
// ═══════════════════════════════════════════════════

const DojoState = (() => {

  const MAX_HEARTS = 5;
  const XP_PER_LESSON = 50;
  const XP_STREAK_BONUS = 25;

  function today() { return new Date().toISOString().slice(0, 10); }

  // ── Raw getters / setters ─────────────────────────
  function getXP()        { return parseInt(localStorage.getItem('dojo_xp') || '0', 10); }
  function getHearts()    { return parseInt(localStorage.getItem('dojo_hearts') || String(MAX_HEARTS), 10); }
  function getStreak()    { return parseInt(localStorage.getItem('dojo_streak') || '0', 10); }
  function getLastTrain() { return localStorage.getItem('dojo_last_train') || ''; }
  function getProgress()  {
    try { return JSON.parse(localStorage.getItem('dojo_progress') || '{}'); } catch { return {}; }
  }

  // ── Firebase cloud sync helper ────────────────────
  function _fsync() {
    if (typeof FirebaseSync !== 'undefined' && FirebaseSync.isReady()) {
      FirebaseSync.scheduleSave();
    }
  }

  function saveXP(v)        { localStorage.setItem('dojo_xp', v); _fsync(); }
  function saveHearts(v)    { localStorage.setItem('dojo_hearts', Math.max(0, Math.min(MAX_HEARTS, v))); _fsync(); }
  function saveStreak(v)    { localStorage.setItem('dojo_streak', v); _fsync(); }
  function saveLastTrain(v) { localStorage.setItem('dojo_last_train', v); _fsync(); }
  function saveProgress(p)  { localStorage.setItem('dojo_progress', JSON.stringify(p)); _fsync(); }

  // ── Profile ───────────────────────────────────────
  // profile: { name, belt, avatarDataUrl }
  // belt = 'WHITE' | 'RED' | 'YELLOW' | 'ORANGE' | 'GREEN' | 'BLUE' | 'BROWN' | 'BLACK'
  function hasProfile()   { return !!localStorage.getItem('dojo_profile'); }
  function getProfile()   {
    try { return JSON.parse(localStorage.getItem('dojo_profile') || '{}'); } catch { return {}; }
  }
  function saveProfile(p) { localStorage.setItem('dojo_profile', JSON.stringify(p)); _fsync(); }

  // Belt the user currently HOLDS → index of belt path they are WORKING ON
  const BELT_WORK_INDEX = { WHITE:0, RED:1, YELLOW:2, ORANGE:3, GREEN:4, BLUE:5, BROWN:5, BLACK:5 };
  function getWorkingBeltIndex() {
    const p = getProfile();
    return BELT_WORK_INDEX[p.belt || 'WHITE'] ?? 0;
  }

  // ── Daily heart reset ─────────────────────────────
  function checkHeartReset() {
    const lastReset = localStorage.getItem('dojo_hearts_date') || '';
    const t = today();
    if (lastReset !== t) { saveHearts(MAX_HEARTS); localStorage.setItem('dojo_hearts_date', t); _fsync(); }
  }

  // ── Streak ────────────────────────────────────────
  function touchStreak() {
    const t = today();
    const last = getLastTrain();
    if (last === t) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    saveStreak(last === yesterday ? getStreak() + 1 : 1);
    saveLastTrain(t);
  }

  // ── Public API ────────────────────────────────────
  function init() { checkHeartReset(); }

  function updateHUD() {
    const h = getHearts();
    // Individual heart icons
    for (let i = 1; i <= MAX_HEARTS; i++) {
      const el = document.getElementById('h' + i);
      if (!el) continue;
      if (i <= h) {
        el.textContent = 'favorite';
        el.style.color = '';
        el.classList.add('ms-fill');
      } else {
        el.textContent = 'favorite_border';
        el.style.color = '#c7d7f5';
        el.classList.remove('ms-fill');
      }
    }
    // Fallback text (hidden but kept for other references)
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('hud-hearts', h + '/' + MAX_HEARTS);
    set('hud-streak', getStreak());
  }

  function shakeHearts() {
    const pill = document.getElementById('hud-hearts-pill');
    if (!pill) return;
    pill.classList.remove('heart-shake');
    void pill.offsetWidth; // reflow to restart animation
    pill.classList.add('heart-shake');
    setTimeout(() => pill.classList.remove('heart-shake'), 600);
  }

  function showDepleted() {
    const overlay = document.getElementById('hearts-depleted-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    // Start countdown tick
    function tick() {
      const now  = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const hh = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      const el = document.getElementById('hearts-countdown');
      if (el) el.textContent = hh + ':' + mm + ':' + ss;
      if (!document.getElementById('hearts-depleted-overlay').classList.contains('hidden')) {
        setTimeout(tick, 1000);
      }
    }
    tick();
  }

  function loseHeart() {
    const h = Math.max(0, getHearts() - 1);
    saveHearts(h);
    updateHUD();
    shakeHearts();
    if (h === 0) showDepleted();
    return h > 0;
  }

  function completeLesson(beltId, itemName) {
    const progress = getProgress();
    const key = beltId + '::' + itemName;
    progress[key] = true;
    saveProgress(progress);
    _incrementMastery(beltId, itemName);
    touchStreak();
    const streak = getStreak();
    const bonus = streak >= 3 ? XP_STREAK_BONUS : 0;
    const xpGained = XP_PER_LESSON + bonus;
    const newTotal = getXP() + xpGained;
    saveXP(newTotal);
    updateHUD();
    const belt = (typeof BELT_DATA !== 'undefined') ? BELT_DATA.find(b => b.id === beltId) : null;
    let isBeltComplete = false;
    if (belt) {
      const allItems = belt.groups.flatMap(g => g.items);
      isBeltComplete = allItems.every(item => progress[beltId + '::' + item]);
    }
    return { xpGained, totalXP: newTotal, streak, isBeltComplete };
  }

  function beltProgress(beltId) {
    if (typeof BELT_DATA === 'undefined') return 0;
    const belt = BELT_DATA.find(b => b.id === beltId);
    if (!belt) return 0;
    const progress = getProgress();
    const allItems = belt.groups.flatMap(g => g.items);
    if (!allItems.length) return 0;
    const done = allItems.filter(item => progress[beltId + '::' + item]).length;
    return done / allItems.length;
  }

  function isDone(beltId, itemName) {
    return !!getProgress()[beltId + '::' + itemName];
  }

  function isAreaUnlocked(beltIndex) {
    if (beltIndex === 0) return true;
    if (typeof BELT_DATA === 'undefined') return false;
    const prevBelt = BELT_DATA[beltIndex - 1];
    if (!prevBelt) return false;
    return beltProgress(prevBelt.id) >= 0.8;
  }

  // Returns the first item in a belt that is not yet done
  // Returns null if all done
  function getNextItem(beltId) {
    if (typeof BELT_DATA === 'undefined') return null;
    const belt = BELT_DATA.find(b => b.id === beltId);
    if (!belt) return null;
    const progress = getProgress();
    for (const group of belt.groups) {
      for (const item of group.items) {
        if (!progress[beltId + '::' + item]) return item;
      }
    }
    return null; // all done
  }

  // Is an individual item unlocked? (prev item in same belt must be done, or it's the first)
  function isItemUnlocked(beltId, itemName) {
    if (typeof BELT_DATA === 'undefined') return false;
    const belt = BELT_DATA.find(b => b.id === beltId);
    if (!belt) return false;
    const allItems = belt.groups.flatMap(g => g.items);
    const idx = allItems.indexOf(itemName);
    if (idx === 0) return true; // first item always unlocked
    return isDone(beltId, allItems[idx - 1]);
  }

  // ── Seen (mastery indicator) ──────────────────────
  function isSeen(beltId, itemName) {
    try { return !!JSON.parse(localStorage.getItem('dojo_seen') || '{}')[beltId + '::' + itemName]; } catch { return false; }
  }
  function markSeen(beltId, itemName) {
    try {
      const s = JSON.parse(localStorage.getItem('dojo_seen') || '{}');
      s[beltId + '::' + itemName] = true;
      localStorage.setItem('dojo_seen', JSON.stringify(s));
      _fsync();
    } catch {}
  }

  // ── Mastery (repeat completions) ──────────────────
  // Levels: 0=untouched, 1=done, 2=trained, 3=drilled, 4+=mastered
  function getMastery(beltId, itemName) {
    try { return parseInt(JSON.parse(localStorage.getItem('dojo_mastery') || '{}')[beltId + '::' + itemName] || '0', 10); }
    catch { return 0; }
  }
  function _incrementMastery(beltId, itemName) {
    try {
      const m = JSON.parse(localStorage.getItem('dojo_mastery') || '{}');
      const key = beltId + '::' + itemName;
      m[key] = (parseInt(m[key] || '0', 10) + 1);
      localStorage.setItem('dojo_mastery', JSON.stringify(m));
      _fsync();
    } catch {}
  }

  return {
    init, updateHUD, loseHeart, shakeHearts, showDepleted, completeLesson,
    beltProgress, isDone, isAreaUnlocked, isItemUnlocked, getNextItem,
    hasProfile, getProfile, saveProfile, getWorkingBeltIndex,
    getXP, getStreak, getHearts, MAX_HEARTS,
    isSeen, markSeen, getMastery,
  };

})();


// ── Profile screen renderer ────────────────────────
const DojoProfile = {
  // ── Badge definitions ──────────────────────────────
  BADGES: [
    { id:'first_throw',  icon:'sports_martial_arts', label:'First Throw',   color:'#71d8c6', desc:'Complete your first throw technique', check: (stats) => stats.throwsDone >= 1 },
    { id:'on_fire',      icon:'local_fire_department',label:'On Fire',       color:'#f97316', desc:'7-day training streak',              check: (stats) => stats.streak >= 7 },
    { id:'belt_earned',  icon:'military_tech',        label:'Belt Earned',   color:'#eab308', desc:'Complete a full belt path',           check: (stats) => stats.beltsComplete >= 1 },
    { id:'ukemi_master', icon:'self_improvement',     label:'Ukemi Master',  color:'#a78bfa', desc:'Complete all ukemi techniques',       check: (stats) => stats.ukemiDone >= 4 },
    { id:'iron_grip',    icon:'fitness_center',       label:'Iron Grip',     color:'#94a3b8', desc:'Complete 50 total techniques',        check: (stats) => stats.totalDone >= 50 },
    { id:'sensei',       icon:'school',               label:'Sensei',        color:'#004ac6', desc:'Reach 1000 XP',                       check: (stats) => stats.xp >= 1000 },
  ],

  _getStats() {
    const xp     = DojoState.getXP();
    const streak = DojoState.getStreak();
    let totalDone = 0, throwsDone = 0, ukemiDone = 0, beltsComplete = 0;
    if (typeof BELT_DATA !== 'undefined') {
      BELT_DATA.forEach(belt => {
        const beltItems = belt.groups.flatMap(g => g.items);
        const doneBelt  = beltItems.filter(item => DojoState.isDone(belt.id, item)).length;
        if (doneBelt === beltItems.length && beltItems.length > 0) beltsComplete++;
        belt.groups.forEach(g => {
          const isThrow = /throw|nage|waza/i.test(g.title);
          const isUkemi = /ukemi/i.test(g.title);
          g.items.forEach(item => {
            if (DojoState.isDone(belt.id, item)) {
              totalDone++;
              if (isThrow) throwsDone++;
              if (isUkemi) ukemiDone++;
            }
          });
        });
      });
    }
    return { xp, streak, totalDone, throwsDone, ukemiDone, beltsComplete };
  },

  render() {
    const profile = DojoState.getProfile();
    const xp      = DojoState.getXP();
    const streak  = DojoState.getStreak();

    // Avatar
    const avatarImg  = document.getElementById('profile-avatar');
    const avatarIcon = document.getElementById('profile-avatar-icon');
    if (profile.avatarDataUrl && avatarImg) {
      avatarImg.src = profile.avatarDataUrl;
      avatarImg.classList.remove('hidden');
      if (avatarIcon) avatarIcon.classList.add('hidden');
    } else {
      if (avatarImg)  avatarImg.classList.add('hidden');
      if (avatarIcon) avatarIcon.classList.remove('hidden');
    }

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('profile-name',  profile.name || 'Judoka');
    set('profile-belt',  (profile.belt ? profile.belt.charAt(0) + profile.belt.slice(1).toLowerCase() : 'White') + ' Belt');
    set('profile-xp',    xp);
    set('profile-streak', streak);

    // Technique count
    let techCount = 0;
    if (typeof BELT_DATA !== 'undefined') {
      BELT_DATA.forEach(belt => belt.groups.forEach(g => g.items.forEach(item => {
        if (DojoState.isDone(belt.id, item)) techCount++;
      })));
    }
    set('profile-techniques', techCount);

    // Belt readiness
    const workBelt = (typeof BELT_DATA !== 'undefined') ? BELT_DATA[DojoState.getWorkingBeltIndex()] : null;
    set('profile-readiness', Math.round(DojoState.beltProgress(workBelt?.id || '') * 100) + '%');

    // Goal buttons
    const goal = profile.goal || 'belt';
    ['belt','training','culture'].forEach(g => {
      const btn = document.getElementById('pg-' + g);
      if (!btn) return;
      const active = g === goal;
      btn.classList.toggle('border-primary-container', active);
      btn.style.background = active ? 'rgba(0,74,198,0.08)' : '';
    });

    // Belt progress bars
    this._renderBeltProgress();

    // Category mastery
    this._renderCategoryMastery();

    // Badges
    this._renderBadges();
  },

  _renderBeltProgress() {
    const el = document.getElementById('profile-belt-progress');
    if (!el || typeof BELT_DATA === 'undefined') return;
    const BELT_COLORS = {
      toRed:'#ef4444', toYellow:'#eab308', toOrange:'#f97316',
      toGreen:'#22c55e', toBlue:'#3b82f6', toBrown:'#a16207'
    };
    const BELT_LABELS = {
      toRed:'Red', toYellow:'Yellow', toOrange:'Orange',
      toGreen:'Green', toBlue:'Blue', toBrown:'Brown'
    };
    el.innerHTML = BELT_DATA.map(belt => {
      const color  = BELT_COLORS[belt.id] || '#888';
      const label  = BELT_LABELS[belt.id] || belt.id;
      const pct    = Math.round(DojoState.beltProgress(belt.id) * 100);
      const done   = belt.groups.flatMap(g => g.items).filter(i => DojoState.isDone(belt.id, i)).length;
      const total  = belt.groups.flatMap(g => g.items).length;
      const isWork = belt === (BELT_DATA[DojoState.getWorkingBeltIndex()]);
      return `<div class="mb-3 ${isWork ? 'opacity-100' : 'opacity-60'}">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" style="background:${color}"></div>
            <span class="font-bold text-on-surface text-xs uppercase tracking-wide">${label} Belt</span>
            ${isWork ? '<span class="text-xs font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary" style="font-size:9px">CURRENT</span>' : ''}
          </div>
          <span class="font-bold text-on-surface-variant" style="font-size:11px">${done}/${total}</span>
        </div>
        <div class="h-2 rounded-full bg-outline-variant/30 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-700" style="width:${pct}%;background:${color}"></div>
        </div>
      </div>`;
    }).join('');
  },

  _renderCategoryMastery() {
    const el = document.getElementById('profile-category-mastery');
    if (!el || typeof BELT_DATA === 'undefined') return;
    // Aggregate done/total per category type across all belts
    const cats = {};
    const EXCLUDE = ['Knowledge','Terminology','Moral Code','Contest Rules','Referee','Personal Choice','Nage-komi','Randori','Kumi-kata'];
    BELT_DATA.forEach(belt => {
      belt.groups.forEach(g => {
        if (EXCLUDE.some(ex => g.title.includes(ex))) return;
        // Derive a short cat name
        const cat = g.title.replace(/^(Fundamental|Performance|Supplementary)\s*/i,'').split(' ')[0] || g.title;
        if (!cats[cat]) cats[cat] = { done:0, total:0 };
        g.items.forEach(item => {
          cats[cat].total++;
          if (DojoState.isDone(belt.id, item)) cats[cat].done++;
        });
      });
    });
    const rows = Object.entries(cats).filter(([,v]) => v.total > 0).slice(0,6);
    if (!rows.length) { el.innerHTML = '<p class="text-on-surface-variant text-xs text-center py-2">No data yet</p>'; return; }
    el.innerHTML = rows.map(([cat, {done, total}]) => {
      const pct = Math.round((done/total)*100);
      return `<div class="flex items-center gap-3">
        <span class="text-on-surface font-medium text-xs w-24 truncate capitalize">${cat}</span>
        <div class="flex-1 h-1.5 rounded-full bg-outline-variant/30 overflow-hidden">
          <div class="h-full rounded-full bg-primary transition-all duration-700" style="width:${pct}%"></div>
        </div>
        <span class="text-on-surface-variant font-bold w-8 text-right" style="font-size:10px">${pct}%</span>
      </div>`;
    }).join('');
  },

  _renderBadges() {
    const el = document.getElementById('profile-badges');
    if (!el) return;
    const stats = this._getStats();
    el.innerHTML = this.BADGES.map(b => {
      const earned = b.check(stats);
      return `<div class="flex flex-col items-center gap-1.5 ${earned ? '' : 'opacity-35'}">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all"
          style="background:${earned ? b.color+'18' : 'transparent'};border-color:${earned ? b.color : '#cbd5e1'}">
          <span class="material-symbols-outlined ${earned ? 'ms-fill' : ''}" style="font-size:26px;color:${earned ? b.color : '#94a3b8'}">${b.icon}</span>
        </div>
        <span class="font-bold text-center leading-tight text-on-surface" style="font-size:9px;max-width:56px">${b.label.toUpperCase()}</span>
      </div>`;
    }).join('');
  },

  setGoal(goal) {
    const profile = DojoState.getProfile();
    profile.goal = goal;
    DojoState.saveProfile(profile);
    DojoProfile.render();
  }
};
