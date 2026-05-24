const JHProfile = (() => {

  function render() {
    const el = document.getElementById('profile-content');
    if (!el) return;
    const p       = JHState.getProfile();
    const streak  = JHState.getStreak();
    const sessions= JHState.getSessions();
    const favs    = JHState.getFavs().length;
    const col     = JHState.getBeltColor(p.belt || 'red');
    const beltPct = JHState.beltProgress(p.belt || 'red');

    el.innerHTML = `
      <!-- Avatar + name -->
      <div class="flex items-center gap-4 mb-2">
        <div class="w-16 h-16 rounded-full flex items-center justify-center font-jakarta font-extrabold" style="background:${col}22;border:2px solid ${col};font-size:24px;color:${col}">
          ${(p.name || 'J')[0].toUpperCase()}
        </div>
        <div>
          <h2 class="font-jakarta font-bold" style="font-size:20px">${p.name || 'Judoka'}</h2>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="px-2 py-0.5 rounded-full font-jakarta font-bold" style="font-size:10px;background:${col}22;color:${col};text-transform:capitalize">${p.belt || 'red'} Belt</span>
            <span style="font-size:12px;color:rgba(229,226,225,0.35)">${beltPct}% to next grade</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3">
        ${[
          { label:'Streak',   value: streak + 'd', icon:'local_fire_department', col:'#f59e0b' },
          { label:'Sessions', value: sessions,      icon:'sports_martial_arts',  col:'#f2ca50' },
          { label:'Saved',    value: favs,           icon:'favorite',             col:'#ef4444' },
        ].map(s => `
          <div class="glass rounded-2xl p-4 text-center">
            <span class="ms ms-fill" style="font-size:22px;color:${s.col}">${s.icon}</span>
            <p class="font-jakarta font-extrabold mt-1" style="font-size:22px;color:#e5e2e1">${s.value}</p>
            <p style="font-size:11px;color:rgba(229,226,225,0.4)">${s.label}</p>
          </div>`).join('')}
      </div>

      <!-- Belt progress -->
      <div class="glass rounded-2xl p-5">
        <p class="font-jakarta font-extrabold tracking-widest mb-3" style="font-size:9px;color:#f2ca50;letter-spacing:0.15em">CURRENT GRADE PROGRESS</p>
        <div class="flex items-center justify-between mb-2">
          <span class="font-jakarta font-bold" style="font-size:13px;text-transform:capitalize">${p.belt || 'red'} Belt</span>
          <span class="font-jakarta font-bold" style="font-size:13px;color:${col}">${beltPct}%</span>
        </div>
        <div class="w-full rounded-full h-2" style="background:#2a2a2a">
          <div class="h-2 rounded-full" style="width:${beltPct}%;background:${col};transition:width 0.4s"></div>
        </div>
        <button onclick="JHRouter.go('grade')" class="mt-4 w-full py-3 rounded-xl font-jakarta font-bold active-scale" style="background:#f2ca5014;border:1px solid #f2ca5030;color:#f2ca50;font-size:13px">
          View Grading Checklist →
        </button>
      </div>

      <!-- Favourites -->
      ${JHState.getFavs().length ? `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-jakarta font-bold" style="font-size:16px">Favourites</h3>
          <span style="font-size:12px;color:rgba(229,226,225,0.35)">${JHState.getFavs().length} saved</span>
        </div>
        <div class="space-y-2">` +
        JHState.getFavs().slice(0,5).map(id => {
          const info = JHState.findTechnique(id);
          const beltId = info ? info.beltId : 'red';
          const en = JHState.getEnglish(id);
          const c = JHState.getBeltColor(beltId);
          return `<div class="glass rounded-2xl p-3 flex items-center gap-3 active-scale" onclick="JHHub.open('${id}')" style="cursor:pointer">
            <span class="ms ms-fill" style="font-size:18px;color:#ef4444">favorite</span>
            <div class="flex-1"><p class="font-jakarta font-bold" style="font-size:13px">${id}</p><p style="font-size:11px;color:rgba(229,226,225,0.4)">${en}</p></div>
            <span class="px-2 py-0.5 rounded-full font-jakarta font-bold" style="font-size:9px;background:${c}22;color:${c};text-transform:capitalize">${beltId}</span>
          </div>`;
        }).join('') +
        `</div>
      </div>` : ''}

      <!-- Settings -->
      <div>
        <h3 class="font-jakarta font-bold mb-3" style="font-size:16px">Settings</h3>
        <div class="glass rounded-2xl overflow-hidden">
          ${[
            { icon:'edit',      label:'Edit Profile',   fn:'JHProfile.editProfile()' },
            { icon:'military_tech', label:'Change Belt', fn:'JHProfile.changeBelt()' },
            { icon:'info',      label:'About JUDOHUB',  fn:'' },
          ].map((s, i, arr) => `
            <button onclick="${s.fn}" class="w-full flex items-center gap-4 px-5 py-4 active-scale text-left" style="${i < arr.length-1 ? 'border-bottom:1px solid rgba(255,255,255,0.05)' : ''}">
              <span class="ms" style="font-size:20px;color:#f2ca50">${s.icon}</span>
              <span class="font-jakarta font-bold flex-1" style="font-size:14px">${s.label}</span>
              <span class="ms" style="font-size:16px;color:rgba(229,226,225,0.2)">chevron_right</span>
            </button>`).join('')}
        </div>
      </div>`;
  }

  function editProfile() { /* future */ }
  function changeBelt() { /* future — show belt picker inline */ }

  return { render, editProfile, changeBelt };
})();
