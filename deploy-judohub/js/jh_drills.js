const JHDrills = (() => {
  let _filter = 'all';

  const DRILL_DATA = [
    { id:'uchi-komi-basic',    cat:'solo',    title:'Uchi-komi',         sub:'Entry repetitions', icon:'person', desc:'10 entries each side on a wall or post. Focus on foot placement and hip rotation. 3 sets.', time:'5 min' },
    { id:'shadow-randori',     cat:'solo',    title:'Shadow Randori',    sub:'Movement practice', icon:'person', desc:'Move around the mat as if fighting an imaginary opponent. Practice kuzushi directions and footwork.', time:'3 min' },
    { id:'grip-fighting',      cat:'solo',    title:'Grip Strength',     sub:'Band training',     icon:'fitness_center', desc:'Use a resistance band to simulate grip fighting and pulling motions. 3x12 each direction.', time:'5 min' },
    { id:'band-kuzushi',       cat:'band',    title:'Band Kuzushi',      sub:'Off-balancing drill',icon:'fitness_center', desc:'Attach band at waist height. Practice pulling in 8 kuzushi directions, 10 reps each.', time:'6 min' },
    { id:'band-entry',         cat:'band',    title:'Band Entry Drill',  sub:'Tsukuri training',  icon:'fitness_center', desc:'Use band resistance to practice stepping in for your favourite throw. Focus on hip position.', time:'5 min' },
    { id:'nage-komi',          cat:'partner', title:'Nage-komi',         sub:'Full throws',        icon:'group', desc:'Full throws onto crash mat. 5 each side at 70% effort, then 3 at full speed. Alternate throws.', time:'10 min' },
    { id:'kakari-geiko',       cat:'partner', title:'Kakari Geiko',      sub:'Attacking practice', icon:'group', desc:'One person attacks continuously for 90 seconds while partner offers light resistance. Switch roles.', time:'8 min' },
    { id:'ne-waza-flow',       cat:'partner', title:'Ne-waza Flow',      sub:'Ground transitions', icon:'group', desc:'Start in referee position, flow between hold-downs and transitions. No submission attempts.', time:'6 min' },
    { id:'combination-drill',  cat:'partner', title:'Combination Drill', sub:'Two-technique flow', icon:'group', desc:'Drill a set combination (e.g. ko-uchi → seoi) on both sides. 10 reps each, partner gives light resistance.', time:'8 min' },
  ];

  const FILTERS = [
    { id:'all',     label:'All',     icon:'sports_martial_arts' },
    { id:'solo',    label:'Solo',    icon:'person' },
    { id:'band',    label:'Band',    icon:'fitness_center' },
    { id:'partner', label:'Partner', icon:'group' },
  ];

  function render() {
    _renderFilter();
    _renderContent();
  }

  function _renderFilter() {
    const el = document.getElementById('drills-filter');
    if (!el) return;
    el.innerHTML = FILTERS.map(f => {
      const active = f.id === _filter;
      return `<button onclick="JHDrills.setFilter('${f.id}')"
        class="flex items-center gap-1.5 px-4 py-2 rounded-full font-jakarta font-bold active-scale"
        style="font-size:12px;background:${active ? '#f2ca50' : '#1c1b1b'};color:${active ? '#1a1000' : 'rgba(229,226,225,0.5)'};border:1px solid ${active ? '#f2ca50' : 'rgba(255,255,255,0.07)'}">
        <span class="ms" style="font-size:14px">${f.icon}</span>${f.label}
      </button>`;
    }).join('');
  }

  function _renderContent() {
    const el = document.getElementById('drills-content');
    if (!el) return;
    const drills = _filter === 'all' ? DRILL_DATA : DRILL_DATA.filter(d => d.cat === _filter);
    el.innerHTML = drills.map(d => {
      const catCol = { solo:'#6366f1', band:'#f59e0b', partner:'#10b981' }[d.cat] || '#f2ca50';
      return `
        <div class="glass rounded-2xl p-4 active-scale" onclick="JHDrills.openDrill('${d.id}')" style="cursor:pointer">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style="background:${catCol}15;border:1px solid ${catCol}30">
              <span class="ms" style="font-size:22px;color:${catCol}">${d.icon}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <p class="font-jakarta font-bold" style="font-size:15px">${d.title}</p>
                <span class="font-jakarta font-bold shrink-0" style="font-size:10px;color:${catCol};background:${catCol}18;padding:2px 8px;border-radius:99px">${d.time}</span>
              </div>
              <p style="font-size:12px;color:rgba(229,226,225,0.45);margin-bottom:6px">${d.sub}</p>
              <p style="font-size:12px;color:rgba(229,226,225,0.6);line-height:1.5">${d.desc}</p>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function setFilter(id) { _filter = id; _renderFilter(); _renderContent(); }
  function openDrill(id) { /* future: open drill detail */ }

  return { render, setFilter, openDrill };
})();
