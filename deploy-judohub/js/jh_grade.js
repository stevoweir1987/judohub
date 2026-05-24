const JHGrade = (() => {
  let _activeBelt = null;

  function render() {
    if (typeof BELT_DATA === 'undefined') return;
    if (!_activeBelt) _activeBelt = BELT_DATA[0]?.id || 'red';
    _renderPicker();
    _renderContent();
  }

  function _renderPicker() {
    const el = document.getElementById('grade-belt-picker');
    if (!el || typeof BELT_DATA === 'undefined') return;
    el.innerHTML = BELT_DATA.map(b => {
      const col  = JHState.getBeltColor(b.id);
      const pct  = JHState.beltProgress(b.id);
      const active = b.id === _activeBelt;
      return `
        <button onclick="JHGrade.selectBelt('${b.id}')"
          class="flex flex-col items-center gap-1 shrink-0 px-4 py-2 rounded-2xl active-scale"
          style="background:${active ? col + '22' : '#1c1b1b'};border:1.5px solid ${active ? col : 'rgba(255,255,255,0.07)'}">
          <div class="w-5 h-5 rounded-full" style="background:${col}"></div>
          <span class="font-jakarta font-bold" style="font-size:10px;color:${active ? col : 'rgba(229,226,225,0.4)'};text-transform:capitalize">${b.id}</span>
          <span class="font-jakarta font-bold" style="font-size:9px;color:${active ? col + 'cc' : 'rgba(229,226,225,0.25)'}">${pct}%</span>
        </button>`;
    }).join('');
  }

  function _renderContent() {
    const el = document.getElementById('grade-content');
    if (!el || typeof BELT_DATA === 'undefined') return;
    const belt = BELT_DATA.find(b => b.id === _activeBelt);
    if (!belt) return;

    const col  = JHState.getBeltColor(belt.id);
    const pct  = JHState.beltProgress(belt.id);
    const allItems = belt.groups.flatMap(g => g.items);
    const doneCount = allItems.filter(item => JHState.isDone(belt.id + '::' + item)).length;

    let html = `
      <!-- Progress summary -->
      <div class="glass rounded-2xl p-5 mb-2" style="border:1px solid ${col}30">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="font-jakarta font-extrabold" style="font-size:11px;color:${col};letter-spacing:0.12em;text-transform:uppercase">${belt.label}</p>
            <p style="font-size:13px;color:rgba(229,226,225,0.5);margin-top:2px">${doneCount} / ${allItems.length} techniques completed</p>
          </div>
          <div class="relative w-14 h-14">
            <svg viewBox="0 0 56 56" style="width:56px;height:56px;transform:rotate(-90deg)">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#2a2a2a" stroke-width="4"/>
              <circle cx="28" cy="28" r="24" fill="none" stroke="${col}" stroke-width="4"
                stroke-dasharray="${(2*Math.PI*24).toFixed(1)}" stroke-dashoffset="${((2*Math.PI*24)*(1-pct/100)).toFixed(1)}" stroke-linecap="round"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center font-jakarta font-bold" style="font-size:11px;color:${col}">${pct}%</div>
          </div>
        </div>
        <div class="w-full rounded-full h-1.5" style="background:#2a2a2a">
          <div class="h-1.5 rounded-full" style="width:${pct}%;background:${col};transition:width 0.3s"></div>
        </div>
      </div>`;

    // Groups
    for (const group of belt.groups) {
      const doneInGroup = group.items.filter(item => JHState.isDone(belt.id + '::' + item)).length;
      html += `
        <div class="mb-2">
          <div class="flex items-center justify-between px-1 mb-2">
            <p class="font-jakarta font-extrabold tracking-widest" style="font-size:10px;color:${col};letter-spacing:0.12em;text-transform:uppercase">${group.title}</p>
            <p style="font-size:11px;color:rgba(229,226,225,0.35)">${doneInGroup}/${group.items.length}</p>
          </div>
          <div class="space-y-1.5">` +
          group.items.map(item => {
            const key  = belt.id + '::' + item;
            const done = JHState.isDone(key);
            const en   = JHState.getEnglish(item);
            return `
              <div class="flex items-center gap-3 p-3 rounded-xl active-scale" onclick="JHHub.open('${item}','${belt.id}')"
                style="background:${done ? col + '10' : '#1c1b1b'};border:1px solid ${done ? col + '30' : 'rgba(255,255,255,0.05)'};cursor:pointer">
                <button onclick="event.stopPropagation();JHGrade.toggleDone('${key}','${item}','${belt.id}')"
                  class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
                  style="background:${done ? col : 'rgba(255,255,255,0.08)'}">
                  ${done ? '<span class="ms ms-fill" style="font-size:14px;color:#fff">check</span>' : ''}
                </button>
                <div class="flex-1 min-w-0">
                  <p class="font-jakarta font-bold" style="font-size:13px">${item}</p>
                  <p style="font-size:11px;color:rgba(229,226,225,0.4)">${en}</p>
                </div>
                <span class="ms" style="font-size:16px;color:rgba(229,226,225,0.2)">chevron_right</span>
              </div>`;
          }).join('') +
          `</div>
        </div>`;
    }

    el.innerHTML = html;
  }

  function selectBelt(id) { _activeBelt = id; _renderPicker(); _renderContent(); }

  function toggleDone(key, techId, beltId) {
    if (!JHState.isDone(key)) {
      JHState.markDone(key);
    }
    _renderContent();
    _renderPicker();
  }

  return { render, selectBelt, toggleDone };
})();
