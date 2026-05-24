// ═══════════════════════════════════════════════════
//  firebase_sync.js  —  Cloud persistence layer
//  Uses Firebase compat SDK (loaded via CDN in HTML)
//  Strategy: localStorage = instant local cache
//            Firestore    = debounced cloud backup
// ═══════════════════════════════════════════════════

const FirebaseSync = (() => {

  const FIREBASE_CONFIG = {
    apiKey:            "AIzaSyCDvBb4_8qrJ3ir_fdu6BegDp03ci2BCLY",
    authDomain:        "judohub-129ef.firebaseapp.com",
    projectId:         "judohub-129ef",
    storageBucket:     "judohub-129ef.firebasestorage.app",
    messagingSenderId: "694463085057",
    appId:             "1:694463085057:web:58a210f13b24ccf56c9e00"
  };

  let _db      = null;
  let _uid     = null;
  let _ready   = false;
  let _saveTimer = null;

  // ── Initialise Firebase & sign in anonymously ─────
  // Returns a Promise that resolves with the uid once auth is ready.
  // Includes a 5s timeout so file:// and offline environments never hang.
  function init() {
    const authPromise = new Promise((resolve) => {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        _db = firebase.firestore();

        firebase.auth().onAuthStateChanged(async user => {
          if (user) {
            _uid   = user.uid;
            _ready = true;
            resolve(_uid);
          } else {
            try {
              const cred = await firebase.auth().signInAnonymously();
              _uid   = cred.user.uid;
              _ready = true;
              resolve(_uid);
            } catch (e) {
              console.warn('[FirebaseSync] signInAnonymously failed:', e.message);
              resolve(null);
            }
          }
        });
      } catch (e) {
        console.warn('[FirebaseSync] init failed:', e.message);
        resolve(null);
      }
    });

    const timeout = new Promise(resolve => setTimeout(() => {
      console.warn('[FirebaseSync] init timed out — using localStorage only');
      resolve(null);
    }, 2500));

    return Promise.race([authPromise, timeout]);
  }

  // ── Load data from Firestore → return plain object or null ──
  async function load() {
    if (!_ready || !_db || !_uid) return null;
    try {
      const snap = await _db.collection('users').doc(_uid).get();
      return snap.exists ? snap.data() : null;
    } catch (e) {
      console.warn('[FirebaseSync] load error:', e.message);
      return null;
    }
  }

  // ── Apply loaded cloud data → overwrite localStorage ─────
  // Called once on startup if Firestore has data.
  function applyToLocalStorage(data) {
    if (!data) return;
    const safe = (key, val) => {
      try { localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : String(val)); }
      catch (e) {}
    };
    if (data.xp        !== undefined) safe('dojo_xp',          data.xp);
    if (data.hearts    !== undefined) safe('dojo_hearts',      data.hearts);
    if (data.streak    !== undefined) safe('dojo_streak',      data.streak);
    if (data.lastTrain !== undefined) safe('dojo_last_train',  data.lastTrain);
    if (data.heartsDate!== undefined) safe('dojo_hearts_date', data.heartsDate);
    if (data.progress  !== undefined) safe('dojo_progress',    data.progress);
    if (data.seen      !== undefined) safe('dojo_seen',        data.seen);
    if (data.profile   !== undefined) safe('dojo_profile',     data.profile);
  }

  // ── Debounced save — call after any state mutation ────────
  function scheduleSave() {
    if (!_ready) return;
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(_doSave, 1000);
  }

  function _doSave() {
    if (!_db || !_uid) return;
    try {
      const safeJson = (key, fallback) => {
        try { return JSON.parse(localStorage.getItem(key) || fallback); } catch { return JSON.parse(fallback); }
      };
      const payload = {
        xp:         parseInt(localStorage.getItem('dojo_xp')    || '0', 10),
        hearts:     parseInt(localStorage.getItem('dojo_hearts') || '5', 10),
        streak:     parseInt(localStorage.getItem('dojo_streak') || '0', 10),
        lastTrain:  localStorage.getItem('dojo_last_train')  || '',
        heartsDate: localStorage.getItem('dojo_hearts_date') || '',
        progress:   safeJson('dojo_progress', '{}'),
        seen:       safeJson('dojo_seen',     '{}'),
        profile:    safeJson('dojo_profile',  '{}'),
        _savedAt:   new Date().toISOString(),
      };
      _db.collection('users').doc(_uid).set(payload, { merge: true })
         .catch(e => console.warn('[FirebaseSync] save error:', e.message));
    } catch (e) {
      console.warn('[FirebaseSync] _doSave error:', e.message);
    }
  }

  // Force an immediate save (e.g. on page unload)
  function flushNow() {
    clearTimeout(_saveTimer);
    _doSave();
  }

  function getUid()     { return _uid; }
  function isReady()    { return _ready; }

  return { init, load, applyToLocalStorage, scheduleSave, flushNow, getUid, isReady };

})();
