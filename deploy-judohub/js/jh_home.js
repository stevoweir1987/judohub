const JHHome = (() => {

  function _el(id) { return document.getElementById(id); }

  function render() {
    _renderWelcome();
    _renderHero();
    _renderQuickActions();
    _renderFocus();
    _renderRecent();
  }

  function _renderWelcome() {
    const el = _el('home-welcome');
    if (!el) return;
    const p    = JHState.getProfile();
    const name = p.name || 'Judoka';
    const h    = new Date().getHours();
    const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    el.innerHTML = `
      <h2 class="font-jakarta font-bold" style="font-size:22px;color:#e5e2e1">${greet}, ${name}.</h2>
      <p style="font-size:14px;color:rgba(229,226,225,0.5);margin-top:2px">What's your focus today?</p>`;
  }

  function _renderHero() {
    const el = _el('home-hero');
    if (!el) return;
    const last = JHState.getLastViewed();

    if (!last) {
      // No history — show a start card
      el.innerHTML = `
        <div class="glass rounded-2xl p-5 gold-glow active-scale" onclick="JHRouter.go('browse')" style="cursor:pointer">
          <p class="font-jakarta font-extrabold tracking-widest mb-2" style="font-size:10px;color:#f2ca50;letter-spacing:0.15em">GET STARTED</p>
          <h3 class="font-jakarta font-bold mb-1" style="font-size:20px">Explore Techniques</h3>
          <p style="font-size:13px;color:rgba(229,226,225,0.55);margin-bottom:16px">Browse the full technique library and start learning.</p>
          <div class="flex items-center gap-2 px-4 py-2 rounded-xl w-fit font-jakarta font-bold" style="background:#f2ca50;color:#1a1000;font-size:13px">
            <span class="ms" style="font-size:16px">school</span> Browse Techniques
          </div>
        </div>`;
      return;
    }

    const tech  = last.id;
    const beltId = last.beltId || JHState.findTechnique(tech)?.beltId || 'red';
    const en    = JHState.getEnglish(tech);
    const thumb = JHState.getThumbUrl(tech);
    const pct   = JHState.beltProgress(beltId);
    const col   = JHState.getBeltColor(beltId);

    // Progress ring values
    const r = 28, circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;

    el.innerHTML = `
      <div class="glass rounded-2xl overflow-hidden active-scale" onclick="JHHub.open('${tech}')" style="cursor:pointer">
        <div class="relative" style="aspect-ratio:16/7;background:#1a1a1a">
          ${thumb ? `<img src="${thumb}" alt="${tech}" class="w-full h-full object-cover opacity-70" style="position:absolute;inset:0"/>` : `<div style="position:absolute;inset:0;background:linear-gradient(135deg,${col}22,${col}08)"></div>`}
          <div style="position:absolute;inset:0;background:linear-gradient(to right, rgba(19,19,19,0.9) 0%, rgba(19,19,19,0.3) 100%)"></div>
          <div class="absolute inset-0 flex items-center justify-between p-5">
            <div>
              <p class="font-jakarta font-extrabold tracking-widest mb-1" style="font-size:9px;color:#f2ca50;letter-spacing:0.18em">CONTINUE LEARNING</p>
              <h3 class="font-jakarta font-bold" style="font-size:20px;color:#fff">${tech}</h3>
              <p style="font-size:12px;color:rgba(255,255,255,0.55)">${en}</p>
            </div>
            <div class="relative shrink-0" style="width:56px;height:56px">
              <svg viewBox="0 0 64 64" style="width:56px;height:56px;transform:rotate(-90deg)">
                <circle cx="32" cy="32" r="${r}" fill="none" stroke="#2a2a2a" stroke-width="5"/>
                <circle cx="32" cy="32" r="${r}" fill="none" stroke="#f2ca50" stroke-width="5"
                  stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}" stroke-linecap="round"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center font-jakarta font-bold" style="font-size:11px;color:#f2ca50">${pct}%</div>
            </div>
          </div>
        </div>
        <div class="p-4 flex items-center justify-between" style="border-top:1px solid rgba(255,255,255,0.05)">
          <p style="font-size:12px;color:rgba(229,226,225,0.4)">Tap to continue →</p>
          <span class="px-2 py-0.5 rounded-full font-jakarta font-bold" style="font-size:9px;background:${col}33;color:${col};text-transform:uppercase">${beltId} belt</span>
        </div>
      </div>`;
  }

  function _renderQuickActions() {
    const el = _el('home-quick-actions');
    if (!el) return;
    const actions = [
      { icon:'military_tech', label:'Syllabus',  screen:'grade'  },
      { icon:'fitness_center',label:'Drills',    screen:'drills' },
      { icon:'school',        label:'Browse',    screen:'browse' },
      { icon:'shuffle',       label:'Random',    fn:'JHHome.openRandom()' },
    ];
    el.innerHTML = `<div class="grid grid-cols-4 gap-3">` +
      actions.map(a => `
        <button class="flex flex-col items-center gap-2 active-scale" onclick="${a.fn || `JHRouter.go('${a.screen}')`}">
          <div class="w-full aspect-square glass rounded-2xl flex items-center justify-center" style="border:1px solid rgba(255,255,255,0.06)">
            <span class="ms" style="font-size:22px;color:#f2ca50">${a.icon}</span>
          </div>
          <span class="font-jakarta font-bold" style="font-size:10px;color:rgba(229,226,225,0.6);letter-spacing:0.04em">${a.label}</span>
        </button>`).join('') + `</div>`;
  }

  function _renderFocus() {
    const el = _el('home-focus');
    if (!el) return;
    // Pick a technique the user hasn't seen yet or hasn't mastered
    const p = JHState.getProfile();
    let focusTech = null, focusBelt = null;
    if (typeof BELT_DATA !== 'undefined') {
      const belt = BELT_DATA.find(b => b.id === p.belt) || BELT_DATA[0];
      if (belt) {
        for (const g of belt.groups) {
          for (const item of g.items) {
            const key = belt.id + '::' + item;
            if (!JHState.isDone(key)) { focusTech = item; focusBelt = belt.id; break; }
          }
          if (focusTech) break;
        }
      }
    }

    if (!focusTech) {
      el.innerHTML = '';
      return;
    }
    const en  = JHState.getEnglish(focusTech);
    const col = JHState.getBeltColor(focusBelt);

    el.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-jakarta font-bold" style="font-size:16px">Today's Focus</h3>
        <button onclick="JHHome.refreshFocus()" style="font-size:12px;color:#f2ca50;font-family:'Plus Jakarta Sans'">Refresh</button>
      </div>
      <div class="rounded-2xl p-5 active-scale" onclick="JHHub.open('${focusTech}')" style="background:${col}14;border:1px solid ${col}30;cursor:pointer">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h4 class="font-jakarta font-bold mb-1" style="font-size:18px">${focusTech}</h4>
            <p style="font-size:13px;color:rgba(229,226,225,0.5);margin-bottom:12px">${en}</p>
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full w-fit font-jakarta font-bold" style="background:#f2ca50;color:#1a1000;font-size:12px">
              <span class="ms" style="font-size:14px">play_arrow</span> Start Session
            </div>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style="background:${col}22;border:1px solid ${col}40">
            <span class="ms" style="font-size:26px;color:${col}">sports_martial_arts</span>
          </div>
        </div>
      </div>`;
  }

  function _renderRecent() {
    const el = _el('home-recent');
    if (!el) return;
    const recent = JHState.getRecent(8);
    if (!recent.length) { el.innerHTML = ''; return; }

    const cards = recent.map(r => {
      const thumb = JHState.getThumbUrl(r.id);
      const en    = JHState.getEnglish(r.id);
      const col   = JHState.getBeltColor(r.beltId);
      return `
        <div class="min-w-[160px] glass rounded-2xl overflow-hidden active-scale" onclick="JHHub.open('${r.id}')" style="cursor:pointer">
          <div class="relative" style="aspect-ratio:4/3;background:#1a1a1a">
            ${thumb ? `<img src="${thumb}" alt="${r.id}" class="w-full h-full object-cover opacity-65"/>` : `<div class="w-full h-full flex items-center justify-center" style="background:${col}15"><span class="ms" style="font-size:28px;color:${col}40">sports_martial_arts</span></div>`}
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full font-jakarta font-bold" style="font-size:9px;background:rgba(0,0,0,0.7);color:${col};border:1px solid ${col}40;text-transform:uppercase">${r.beltId}</span>
          </div>
          <div class="p-3">
            <p class="font-jakarta font-bold" style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.id}</p>
            <p style="font-size:11px;color:rgba(229,226,225,0.45);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${en}</p>
          </div>
        </div>`;
    }).join('');

    el.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-jakarta font-bold" style="font-size:16px">Recently Viewed</h3>
        <button onclick="JHRouter.go('browse')" style="font-size:12px;color:rgba(229,226,225,0.4);font-family:'Plus Jakarta Sans'">See all</button>
      </div>
      <div class="flex gap-3 overflow-x-auto hide-scroll -mx-5 px-5 pb-2">${cards}</div>`;
  }

  function openRandom() {
    if (typeof BELT_DATA === 'undefined') return;
    const all = BELT_DATA.flatMap(b => b.groups.flatMap(g => g.items.map(item => ({ id: item, beltId: b.id }))));
    if (!all.length) return;
    const pick = all[Math.floor(Math.random() * all.length)];
    JHHub.open(pick.id, pick.beltId);
  }

  function refreshFocus() { _renderFocus(); }

  return { render, openRandom, refreshFocus };
})();
