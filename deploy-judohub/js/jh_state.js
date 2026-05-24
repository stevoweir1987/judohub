const JHState = (() => {
  // ── Keys ──────────────────────────────────────
  const K = {
    PROFILE:  'jh_profile',
    RECENT:   'jh_recent',
    FAVS:     'jh_favs',
    PROGRESS: 'jh_progress',
    PINNED:   'jh_pinned',
    SESSIONS: 'jh_sessions',
    STREAK:   'jh_streak',
    LAST:     'jh_last_train',
  };

  function _get(key, def) {
    try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; }
  }
  function _set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); _fsync(); } catch {}
  }
  function _fsync() {
    if (typeof FirebaseSync !== 'undefined' && FirebaseSync.scheduleSave) FirebaseSync.scheduleSave();
  }

  // ── Profile ───────────────────────────────────
  function hasProfile() { return !!localStorage.getItem(K.PROFILE); }
  function saveProfile(p) { _set(K.PROFILE, p); }
  function getProfile() { return _get(K.PROFILE, { name:'Judoka', belt:'red' }); }

  // ── Recently Viewed ───────────────────────────
  // Stored as array of { id, beltId } max 20
  function addRecent(techniqueId, beltId) {
    let r = _get(K.RECENT, []);
    r = r.filter(x => x.id !== techniqueId);
    r.unshift({ id: techniqueId, beltId: beltId, ts: Date.now() });
    if (r.length > 20) r = r.slice(0, 20);
    _set(K.RECENT, r);
  }
  function getRecent(limit) {
    const r = _get(K.RECENT, []);
    return limit ? r.slice(0, limit) : r;
  }
  function getLastViewed() {
    const r = _get(K.RECENT, []);
    return r[0] || null;
  }

  // ── Favourites ────────────────────────────────
  function isFav(techniqueId) {
    return _get(K.FAVS, []).includes(techniqueId);
  }
  function toggleFav(techniqueId) {
    let f = _get(K.FAVS, []);
    if (f.includes(techniqueId)) {
      f = f.filter(x => x !== techniqueId);
    } else {
      f.unshift(techniqueId);
    }
    _set(K.FAVS, f);
    return f.includes(techniqueId);
  }
  function getFavs() { return _get(K.FAVS, []); }

  // ── Pinned ────────────────────────────────────
  function isPinned(techniqueId) { return _get(K.PINNED, []).includes(techniqueId); }
  function togglePin(techniqueId) {
    let p = _get(K.PINNED, []);
    if (p.includes(techniqueId)) { p = p.filter(x => x !== techniqueId); }
    else { p.unshift(techniqueId); if (p.length > 6) p = p.slice(0,6); }
    _set(K.PINNED, p);
  }
  function getPinned() { return _get(K.PINNED, []); }

  // ── Progress ──────────────────────────────────
  // { 'techniqueId': { seen:true, done:true, mastery:N } }
  function getProgress(id) { return _get(K.PROGRESS, {})[id] || {}; }
  function markSeen(id) {
    const p = _get(K.PROGRESS, {});
    p[id] = Object.assign({}, p[id], { seen: true });
    _set(K.PROGRESS, p);
  }
  function markDone(id) {
    const p = _get(K.PROGRESS, {});
    p[id] = Object.assign({}, p[id], { done: true, mastery: (p[id]?.mastery || 0) + 1 });
    _set(K.PROGRESS, p);
    _touchStreak();
    _incSessions();
  }
  function isDone(id) { return !!getProgress(id).done; }
  function getMastery(id) { return getProgress(id).mastery || 0; }

  // Belt progress: count done items for a beltId
  function beltProgress(beltId) {
    if (typeof BELT_DATA === 'undefined') return 0;
    const belt = BELT_DATA.find(b => b.id === beltId);
    if (!belt) return 0;
    const all = belt.groups.flatMap(g => g.items);
    if (!all.length) return 0;
    const done = all.filter(item => isDone(beltId + '::' + item)).length;
    return Math.round(done / all.length * 100);
  }

  // ── Streak ────────────────────────────────────
  function _touchStreak() {
    const today = new Date().toISOString().slice(0,10);
    const last  = localStorage.getItem(K.LAST) || '';
    if (last === today) return;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0,10);
    let streak = _get(K.STREAK, 0);
    streak = (last === yesterday) ? streak + 1 : 1;
    _set(K.STREAK, streak);
    localStorage.setItem(K.LAST, today);
  }
  function getStreak() { return _get(K.STREAK, 0); }

  // ── Sessions ──────────────────────────────────
  function _incSessions() { _set(K.SESSIONS, _get(K.SESSIONS, 0) + 1); }
  function getSessions() { return _get(K.SESSIONS, 0); }

  // ── Find technique across BELT_DATA ──────────
  function findTechnique(id) {
    if (typeof BELT_DATA === 'undefined') return null;
    for (const belt of BELT_DATA) {
      for (const group of belt.groups) {
        if (group.items.includes(id)) {
          return { beltId: belt.id, beltLabel: belt.label, groupTitle: group.title, id };
        }
      }
    }
    return null;
  }

  // ── Helpers ───────────────────────────────────
  function getEnglish(id) {
    if (typeof TERMS_EN !== 'undefined' && TERMS_EN[id]) return TERMS_EN[id];
    return id.replace(/-/g, ' ');
  }

  function getVideoId(id) {
    if (typeof GRADING_VIDEOS === 'undefined') return null;
    const entry = GRADING_VIDEOS.find(v => v.technique === id || v.technique === id.replace(/ /g,'-'));
    return entry ? entry.videoId : null;
  }

  function getThumbUrl(id) {
    const vid = getVideoId(id);
    return vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : null;
  }

  function getBeltColor(beltId) {
    const MAP = { red:'#dc2626', yellow:'#eab308', orange:'#f97316', green:'#16a34a', blue:'#2563eb', brown:'#92400e', black:'#111827' };
    return MAP[beltId] || '#6b7280';
  }

  function init() { /* placeholder for future init logic */ }

  return {
    init, hasProfile, saveProfile, getProfile,
    addRecent, getRecent, getLastViewed,
    isFav, toggleFav, getFavs,
    isPinned, togglePin, getPinned,
    getProgress, markSeen, markDone, isDone, getMastery, beltProgress,
    getStreak, getSessions,
    findTechnique, getEnglish, getVideoId, getThumbUrl, getBeltColor,
  };
})();
