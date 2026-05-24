const JHBrowse = (() => {
  let _filter  = 'all';
  let _query   = '';

  const FILTERS = [
    { id:'all',       label:'All' },
    { id:'nage-waza', label:'Nage-waza' },
    { id:'katame-waza',label:'Katame-waza' },
    { id:'az',        label:'A–Z' },
  ];

  const CAT_ICONS = {
    'Te-waza':          'front_hand',
    'Koshi-waza':       'accessibility_new',
    'Ashi-waza':        'directions_walk',
    'Ma-sutemi-waza':   'airline_stops',
    'Yoko-sutemi-waza': 'rotate_90_degrees_cw',
    'Osaekomi-waza':    'lock',
    'Shime-waza':       'do_not_touch',
    'Kansetsu-waza':    'back_hand',
  };

  function render() {
    _renderFilters();
    _renderContent();
  }

  function _renderFilters() {
    const el = document.getElementById('browse-filters');
    if (!el) return;
    el.innerHTML = FILTERS.map(f => {
      const active = f.id === _filter;
      return `<button onclick="JHBrowse.setFilter('${f.id}')"
        class="px-4 py-1.5 rounded-full font-jakarta font-bold shrink-0 active-scale"
        style="font-size:12px;background:${active ? '#f2ca50' : '#1c1b1b'};color:${active ? '#1a1000' : 'rgba(229,226,225,0.55)'};border:1px solid ${active ? '#f2ca50' : 'rgba(255,255,255,0.07)'};white-space:nowrap">
        ${f.label}</button>`;
    }).join('');
  }

  function _renderContent() {
    const el = document.getElementById('browse-content');
    if (!el) return;
    if (typeof BELT_DATA === 'undefined') { el.innerHTML = '<p style="color:rgba(229,226,225,0.3)">Loading…</p>'; return; }

    let html = '';

    // Search results mode
    if (_query.length >= 2) {
      html += _renderSearchResults();
      el.innerHTML = html;
      return;
    }

    // Pinned
    const pinned = JHState.getPinned();
    if (pinned.length) {
      html += `<div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-jakarta font-bold" style="font-size:16px">Pinned</h3>
          <span style="font-size:12px;color:#f2ca50;font-family:'Plus Jakarta Sans'">Edit</span>
        </div>
        <div class="grid grid-cols-2 gap-3">`;
      html += pinned.slice(0,4).map(id => _bigCard(id)).join('');
      html += `</div></div>`;
    }

    // Categories or filtered list
    if (_filter === 'all' || _filter === 'nage-waza' || _filter === 'katame-waza') {
      html += _renderCategories();
    } else if (_filter === 'az') {
      html += _renderAZ();
    }

    // Recently viewed
    const recent = JHState.getRecent(5);
    if (recent.length) {
      html += `<div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-jakarta font-bold" style="font-size:16px">Recently Viewed</h3>
          <span style="font-size:12px;color:rgba(229,226,225,0.35)">See all</span>
        </div>
        <div class="space-y-2">`;
      html += recent.map(r => _listRow(r.id, r.beltId)).join('');
      html += `</div></div>`;
    }

    el.innerHTML = html;
  }

  function _renderCategories() {
    if (typeof BELT_DATA === 'undefined') return '';
    // Collect all unique sub-categories (groups)
    const groupMap = {}; // groupTitle -> { items, beltId }
    for (const belt of BELT_DATA) {
      const show = _filter === 'all' ||
        (_filter === 'nage-waza' && belt.id !== 'ne-waza') ||
        (_filter === 'katame-waza');
      if (!show) continue;
      for (const g of belt.groups) {
        if (!groupMap[g.title]) groupMap[g.title] = { items:[], belts:new Set() };
        groupMap[g.title].items.push(...g.items);
        groupMap[g.title].belts.add(belt.id);
      }
    }

    let html = `<div>
      <h3 class="font-jakarta font-bold mb-4" style="font-size:16px">Categories</h3>
      <div class="grid grid-cols-2 gap-3">`;
    for (const [title, data] of Object.entries(groupMap)) {
      const icon = CAT_ICONS[title] || 'sports_martial_arts';
      html += `
        <button onclick="JHBrowse.openCategory('${title.replace(/'/g,"\\'")}') "
          class="glass rounded-2xl p-4 flex flex-col items-center gap-3 text-center active-scale"
          style="border:1px solid rgba(255,255,255,0.06)">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center" style="background:#f2ca5014">
            <span class="ms" style="font-size:22px;color:#f2ca50">${icon}</span>
          </div>
          <div>
            <p class="font-jakarta font-bold" style="font-size:13px">${title}</p>
            <p style="font-size:11px;color:rgba(229,226,225,0.4)">${data.items.length} techniques</p>
          </div>
        </button>`;
    }
    html += `</div></div>`;
    return html;
  }

  function _renderAZ() {
    if (typeof BELT_DATA === 'undefined') return '';
    const all = [];
    for (const belt of BELT_DATA) {
      for (const g of belt.groups) {
        for (const item of g.items) all.push({ id: item, beltId: belt.id });
      }
    }
    all.sort((a,b) => a.id.localeCompare(b.id));

    return `<div>
      <h3 class="font-jakarta font-bold mb-4" style="font-size:16px">All Techniques</h3>
      <div class="space-y-2">${all.map(t => _listRow(t.id, t.beltId)).join('')}</div>
    </div>`;
  }

  function _renderSearchResults() {
    if (typeof BELT_DATA === 'undefined') return '';
    const q = _query.toLowerCase();
    const results = [];
    for (const belt of BELT_DATA) {
      for (const g of belt.groups) {
        for (const item of g.items) {
          const en = JHState.getEnglish(item);
          if (item.toLowerCase().includes(q) || en.toLowerCase().includes(q)) {
            results.push({ id: item, beltId: belt.id });
          }
        }
      }
    }
    if (!results.length) return `<p style="color:rgba(229,226,225,0.3);font-size:14px">No techniques found for "${_query}"</p>`;
    return `<div>
      <p class="mb-3" style="font-size:12px;color:rgba(229,226,225,0.4)">${results.length} results</p>
      <div class="space-y-2">${results.map(r => _listRow(r.id, r.beltId)).join('')}</div>
    </div>`;
  }

  function _bigCard(id) {
    const info  = JHState.findTechnique(id);
    const beltId = info ? info.beltId : 'red';
    const thumb = JHState.getThumbUrl(id);
    const en    = JHState.getEnglish(id);
    const col   = JHState.getBeltColor(beltId);
    return `
      <div class="relative rounded-2xl overflow-hidden active-scale" style="aspect-ratio:1;cursor:pointer;background:#1a1a1a" onclick="JHHub.open('${id}')">
        ${thumb ? `<img src="${thumb}" alt="${id}" class="absolute inset-0 w-full h-full object-cover opacity-60"/>` : `<div class="absolute inset-0" style="background:${col}15"></div>`}
        <div class="absolute inset-0" style="background:linear-gradient(to top, rgba(19,19,19,0.95) 0%, rgba(19,19,19,0.2) 60%)"></div>
        <div class="absolute bottom-0 left-0 right-0 p-3">
          <span class="inline-block px-2 py-0.5 rounded-full mb-1 font-jakarta font-bold" style="font-size:9px;background:rgba(0,0,0,0.6);color:${col};text-transform:uppercase">${beltId} belt</span>
          <p class="font-jakarta font-bold" style="font-size:13px">${id}</p>
          <p style="font-size:11px;color:rgba(229,226,225,0.5)">${en}</p>
        </div>
      </div>`;
  }

  function _listRow(id, beltId) {
    const en  = JHState.getEnglish(id);
    const col = JHState.getBeltColor(beltId);
    const done = JHState.isDone(beltId + '::' + id);
    return `
      <div class="glass rounded-2xl p-3 flex items-center gap-4 active-scale" onclick="JHHub.open('${id}','${beltId}')" style="cursor:pointer">
        <div class="w-14 h-14 rounded-xl overflow-hidden shrink-0" style="background:#1a1a1a">
          ${(() => { const t = JHState.getThumbUrl(id); return t ? `<img src="${t}" alt="${id}" class="w-full h-full object-cover opacity-70"/>` : `<div class="w-full h-full flex items-center justify-center" style="background:${col}15"><span class="ms" style="font-size:20px;color:${col}40">sports_martial_arts</span></div>`; })()}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-jakarta font-bold" style="font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${id}</p>
          <p style="font-size:12px;color:rgba(229,226,225,0.45)">${en}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="px-2 py-0.5 rounded-full font-jakarta font-bold" style="font-size:9px;background:${col}22;color:${col};text-transform:uppercase">${beltId}</span>
          ${done ? '<span class="ms ms-fill" style="font-size:16px;color:#f2ca50">check_circle</span>' : '<span class="ms" style="font-size:16px;color:rgba(229,226,225,0.2)">radio_button_unchecked</span>'}
        </div>
      </div>`;
  }

  function setFilter(id) { _filter = id; _renderFilters(); _renderContent(); }
  function search(q) { _query = q; _renderContent(); }

  function openCategory(title) {
    // Render a category-filtered browse
    _query = '';
    const el = document.getElementById('browse-content');
    if (!el || typeof BELT_DATA === 'undefined') return;
    const items = [];
    for (const belt of BELT_DATA) {
      for (const g of belt.groups) {
        if (g.title === title) g.items.forEach(item => items.push({ id: item, beltId: belt.id }));
      }
    }
    const icon = CAT_ICONS[title] || 'sports_martial_arts';
    el.innerHTML = `
      <div>
        <button onclick="JHBrowse.render()" class="flex items-center gap-2 mb-4 active-scale" style="font-size:13px;color:#f2ca50">
          <span class="ms" style="font-size:16px">arrow_back</span> Back
        </button>
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#f2ca5014">
            <span class="ms" style="font-size:20px;color:#f2ca50">${icon}</span>
          </div>
          <div>
            <h3 class="font-jakarta font-bold" style="font-size:18px">${title}</h3>
            <p style="font-size:12px;color:rgba(229,226,225,0.4)">${items.length} techniques</p>
          </div>
        </div>
        <div class="space-y-2">${items.map(t => _listRow(t.id, t.beltId)).join('')}</div>
      </div>`;
  }

  return { render, setFilter, search, openCategory };
})();
