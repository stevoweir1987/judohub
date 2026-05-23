// ═══════════════════════════════════════════════════
//  dojo_dojo.js — The Dojo screen (philosophy hub)
// ═══════════════════════════════════════════════════

const DojoDojo = (() => {

  // ── Sub-screen routing ────────────────────────────
  const SUB_SCREENS = ['dojo-hub','dojo-moral','dojo-terms','dojo-history','dojo-kata'];

  function showSub(name) {
    SUB_SCREENS.forEach(id => {
      const el = document.getElementById('screen-' + id);
      if (el) el.classList.toggle('active', id === name);
    });
  }

  // ── Hub ───────────────────────────────────────────
  function renderHub() {
    const el = document.getElementById('dojo-hub-content');
    if (!el) return;
    el.innerHTML = `
      <!-- Hero -->
      <div class="text-center py-8 px-5">
        <div class="inline-flex items-center gap-2 px-4 py-1 border border-primary/40 rounded-full bg-primary/5 mb-5">
          <span class="text-primary font-bold uppercase tracking-[0.2em]" style="font-size:10px">道場 DOJO</span>
        </div>
        <h1 class="text-headline-lg-mobile font-bold text-on-surface mb-3">The Sanctuary of Focus</h1>
        <p class="text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto">
          Step beyond technique. Refine your spirit through the philosophy, history, and traditions of Judo.
        </p>
      </div>

      <!-- Cards grid -->
      <div class="px-5 space-y-4 pb-8">

        <!-- Moral Code — hero card -->
        <button onclick="DojoDojo.open('moral')"
          class="w-full text-left bg-white border border-outline-variant/30 rounded-2xl overflow-hidden active:scale-[0.98] transition-all"
          style="box-shadow:0 4px 0 0 #c7d7f5">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span class="font-bold text-primary" style="font-size:20px;font-family:serif">礼</span>
              </div>
              <div>
                <p class="font-bold uppercase tracking-widest text-primary" style="font-size:10px">THE DOJO WAY</p>
                <h2 class="text-title-md font-bold text-on-surface">Moral Code</h2>
              </div>
            </div>
            <p class="text-sm text-on-surface-variant leading-relaxed mb-5">
              Explore the eight core principles: Courtesy, Courage, Sincerity, Honour, Modesty, Respect, Self-Control, and Friendship.
            </p>
            <div class="flex flex-wrap gap-2">
              ${[['礼','Rei'],['勇','Yuuki'],['誠','Makoto'],['名','Meiyo'],['謙','Kenkyo'],['尊','Sonkei'],['克','Jisei'],['友','Yujo']].map(([k,r]) =>
                `<div class="flex items-center gap-1.5 bg-surface-container-high px-2 py-1 rounded-lg border border-outline-variant/20">
                  <span class="text-primary font-bold" style="font-family:serif;font-size:13px">${k}</span>
                  <span class="text-on-surface-variant font-bold uppercase tracking-wider" style="font-size:9px">${r}</span>
                </div>`
              ).join('')}
            </div>
          </div>
          <div class="flex items-center justify-between px-6 py-3 bg-primary/5 border-t border-primary/10">
            <span class="font-bold uppercase tracking-widest text-primary" style="font-size:10px">EXPLORE PRINCIPLES</span>
            <span class="material-symbols-outlined text-primary" style="font-size:18px">arrow_forward</span>
          </div>
        </button>

        <!-- Terminology -->
        <button onclick="DojoDojo.open('terms')"
          class="w-full text-left bg-white border border-outline-variant/30 rounded-2xl p-5 active:scale-[0.98] transition-all flex items-center gap-4"
          style="box-shadow:0 4px 0 0 #c7d7f5">
          <div class="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-secondary" style="font-size:24px">menu_book</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-on-surface mb-0.5">Terminology Glossary</h3>
            <p class="text-sm text-on-surface-variant">Master the language of the tatami — from Kuzushi to Waza-ari.</p>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant shrink-0" style="font-size:20px">chevron_right</span>
        </button>

        <!-- Judo History -->
        <button onclick="DojoDojo.open('history')"
          class="w-full text-left bg-white border border-outline-variant/30 rounded-2xl p-5 active:scale-[0.98] transition-all flex items-center gap-4"
          style="box-shadow:0 4px 0 0 #c7d7f5">
          <div class="w-12 h-12 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-tertiary" style="font-size:24px">history_edu</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-on-surface mb-0.5">Judo History</h3>
            <p class="text-sm text-on-surface-variant">From feudal Jiu-jitsu to the Olympic stage. The story of Jigoro Kano.</p>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant shrink-0" style="font-size:20px">chevron_right</span>
        </button>

        <!-- Kata -->
        <button onclick="DojoDojo.open('kata')"
          class="w-full text-left bg-white border border-outline-variant/30 rounded-2xl p-5 active:scale-[0.98] transition-all flex items-center gap-4"
          style="box-shadow:0 4px 0 0 #c7d7f5">
          <div class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-primary" style="font-size:24px">self_improvement</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-on-surface mb-0.5">Kata Introductions</h3>
            <p class="text-sm text-on-surface-variant">The formal grammar of Judo — Nage-no-kata, Katame-no-kata and more.</p>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant shrink-0" style="font-size:20px">chevron_right</span>
        </button>

      </div>

      <!-- Kano quote -->
      <div class="mx-5 mb-8 p-5 border-l-4 border-primary/30 bg-surface-container-low rounded-r-2xl">
        <span class="material-symbols-outlined text-primary/40 mb-2 block" style="font-size:28px">format_quote</span>
        <p class="text-sm text-on-surface-variant italic leading-relaxed mb-2">
          "It is not important to be better than someone else, but to be better than yesterday."
        </p>
        <p class="font-bold uppercase tracking-widest text-primary/60" style="font-size:10px">— KANO JIGORO —</p>
      </div>
    `;
  }

  // ── Moral Code ────────────────────────────────────
  const MORAL_CODE = [
    { kanji:'礼', romaji:'Rei',     en:'Courtesy',     desc:'Respect shown through good manners. In the dojo, it begins and ends with the bow.' },
    { kanji:'勇', romaji:'Yuuki',   en:'Courage',       desc:'Doing what is right even when difficult. Facing your fears on and off the mat.' },
    { kanji:'誠', romaji:'Makoto',  en:'Sincerity',     desc:'Speaking without disguise and acting with honesty — true to yourself and your peers.' },
    { kanji:'名', romaji:'Meiyo',   en:'Honour',        desc:'Being true to your word and maintaining integrity in all actions on and off the mat.' },
    { kanji:'謙', romaji:'Kenkyo',  en:'Modesty',       desc:'Humble about your achievements. The higher the rank, the deeper the bow.' },
    { kanji:'尊', romaji:'Sonkei',  en:'Respect',       desc:'Without respect, trust cannot exist. Mutual respect is essential for progress.' },
    { kanji:'克', romaji:'Jisei',   en:'Self-Control',  desc:'Mastering your emotions and impulses. The strongest Judoka controls themselves first.' },
    { kanji:'友', romaji:'Yujo',    en:'Friendship',    desc:'Judo builds bonds. The trust between Tori and Uke is the foundation of all learning.' },
  ];

  function renderMoral() {
    const el = document.getElementById('dojo-moral-content');
    if (!el) return;
    el.innerHTML = `
      <div class="px-5 py-6 space-y-5">
        <p class="text-sm text-on-surface-variant leading-relaxed">
          The Moral Code is the spiritual backbone of Judo — eight principles that Jigoro Kano believed were inseparable from technical mastery.
        </p>
        <div class="grid grid-cols-1 gap-4">
          ${MORAL_CODE.map((p, i) => `
            <div class="bg-surface-container border border-outline-variant/30 rounded-2xl p-5 flex gap-4"
              style="border-left: 3px solid rgba(255,82,98,${0.3 + i*0.09})">
              <div class="shrink-0 w-14 h-14 rounded-xl bg-surface-container-high border border-outline-variant/40 flex items-center justify-center">
                <span class="font-bold text-primary" style="font-size:26px;font-family:serif">${p.kanji}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-baseline gap-2 mb-1">
                  <h3 class="font-bold text-on-surface">${p.en}</h3>
                  <span class="font-bold uppercase tracking-widest text-on-surface-variant" style="font-size:10px">${p.romaji}</span>
                </div>
                <p class="text-sm text-on-surface-variant leading-relaxed">${p.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Bow reminder -->
        <div class="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-3 mt-4">
          <span class="material-symbols-outlined text-primary shrink-0 mt-0.5" style="font-size:20px">info</span>
          <div>
            <p class="font-bold text-primary uppercase tracking-widest mb-1" style="font-size:10px">SENSEI'S NOTE</p>
            <p class="text-sm text-on-surface-variant leading-relaxed">
              "Before you learn to throw, you must learn to bow. The mat is a mirror — it reflects the grace you bring to it."
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // ── Terminology ───────────────────────────────────
  const TERMS = [
    { cat:'Core Principles', items:[
      { word:'Kuzushi',   pron:'[koo-zoo-shee]', def:'Breaking your opponent\'s balance. The first stage of every successful technique.' },
      { word:'Tsukuri',   pron:'[tsoo-koo-ree]', def:'Precise positioning and entry — moving into the optimal spot to execute the throw.' },
      { word:'Kake',      pron:'[kah-keh]',      def:'The final execution. The point of no return where the technique is fully applied.' },
      { word:'Kuzushi',   pron:'[koo-zoo-shee]', def:'Breaking your opponent\'s balance before the throw.' },
    ]},
    { cat:'Technique Modifiers', items:[
      { word:'O',     pron:'Major',  def:'Large / Great — used in O-soto-gari, O-goshi.' },
      { word:'Ko',    pron:'Minor',  def:'Small / Little — used in Ko-soto-gari, Ko-uchi-gari.' },
      { word:'Uchi',  pron:'Inner',  def:'Inside — technique attacking the inner leg or body.' },
      { word:'Soto',  pron:'Outer',  def:'Outside — technique attacking the outer side.' },
      { word:'Gari',  pron:'Reap',   def:'A clipping or reaping action of the leg.' },
      { word:'Gake',  pron:'Hook',   def:'A hooking action — e.g. Ko-soto-gake.' },
      { word:'Goshi', pron:'Hip',    def:'Hip — the centre of power in many throws.' },
      { word:'Waza',  pron:'Technique', def:'A technique or skill — the building block of all Judo.' },
    ]},
    { cat:'Contest Terms', items:[
      { word:'Hajime',      pron:'[hah-jee-meh]',  def:'Begin! The referee\'s call to start the contest.' },
      { word:'Matte',       pron:'[mah-teh]',       def:'Wait / Stop — contest paused by the referee.' },
      { word:'Ippon',       pron:'[ip-pon]',        def:'Full point — the highest score, immediately wins the contest.' },
      { word:'Waza-ari',    pron:'[wah-zah-ah-ree]', def:'Half point. Two Waza-ari equal one Ippon.' },
      { word:'Shido',       pron:'[shee-doh]',      def:'A minor penalty for passivity or minor rule infringements.' },
      { word:'Hansoku-make',pron:'[han-so-koo]',    def:'Disqualification — immediate loss for a major infringement.' },
    ]},
    { cat:'Practice Terms', items:[
      { word:'Randori',   pron:'[ran-doh-ree]', def:'Free practice — applying techniques against a resisting partner.' },
      { word:'Uchikomi',  pron:'[oo-chee-koh-mee]', def:'Repetition drilling — entering a technique repeatedly without completing the throw.' },
      { word:'Nagekomi',  pron:'[nah-geh-koh-mee]', def:'Throwing practice — completing the full throw repeatedly.' },
      { word:'Kata',      pron:'[kah-tah]',     def:'Pre-arranged form — practised sequences that encode the principles of Judo.' },
      { word:'Newaza',    pron:'[neh-wah-zah]', def:'Ground techniques — work done after a throw or when the contest goes to the floor.' },
      { word:'Tachi-waza',pron:'[tah-chee]',    def:'Standing techniques — all throwing and takedown techniques performed upright.' },
    ]},
    { cat:'Roles & Etiquette', items:[
      { word:'Tori',    pron:'[toh-ree]',    def:'The person executing the technique.' },
      { word:'Uke',     pron:'[oo-keh]',     def:'The person receiving the technique — equally important in Judo.' },
      { word:'Sensei',  pron:'[sen-say]',    def:'Teacher or instructor. Literally "one who came before."' },
      { word:'Judoka',  pron:'[joo-doh-kah]', def:'A practitioner of Judo.' },
      { word:'Dojo',    pron:'[doh-joh]',    def:'The place of the way — where Judo is practised.' },
      { word:'Tatami',  pron:'[tah-tah-mee]', def:'The mat. The surface on which Judo is practised — sacred ground.' },
      { word:'Rei',     pron:'[ray]',         def:'Bow — the fundamental gesture of respect in Judo etiquette.' },
    ]},
  ];

  let _termSearch = '';

  function renderTerms() {
    const el = document.getElementById('dojo-terms-content');
    if (!el) return;
    const q = _termSearch.toLowerCase();
    const filtered = TERMS.map(cat => ({
      cat: cat.cat,
      items: cat.items.filter(t =>
        !q || t.word.toLowerCase().includes(q) || t.def.toLowerCase().includes(q)
      )
    })).filter(c => c.items.length > 0);

    el.innerHTML = `
      <!-- Search -->
      <div class="px-5 pt-5 pb-4 sticky top-16 bg-background z-10">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style="font-size:20px">search</span>
          <input id="term-search" type="text" value="${_termSearch}"
            placeholder="Search e.g. Kuzushi, Ippon…"
            class="w-full bg-surface-container border-2 border-outline-variant rounded-xl pl-10 pr-10 py-3 text-on-surface text-sm font-semibold placeholder-on-surface-variant/30 outline-none transition-all focus:border-primary-container"
            style="background:#f0f4ff"
            oninput="DojoDojo.searchTerms(this.value)"/>
          ${_termSearch ? `<button onclick="DojoDojo.searchTerms('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
            <span class="material-symbols-outlined" style="font-size:18px">close</span>
          </button>` : ''}
        </div>
      </div>

      <div class="px-5 pb-8 space-y-8">
        ${filtered.map(cat => `
          <div>
            <div class="flex items-center gap-3 mb-4">
              <h2 class="font-bold text-on-surface uppercase tracking-widest whitespace-nowrap" style="font-size:11px">${cat.cat}</h2>
              <div class="flex-1 h-px bg-outline-variant/40"></div>
            </div>
            <div class="space-y-3">
              ${cat.items.map(t => `
                <div class="bg-surface-container border border-outline-variant/30 rounded-xl p-4 flex gap-3">
                  <div class="shrink-0 pt-0.5">
                    <div class="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-baseline gap-2 flex-wrap mb-1">
                      <span class="font-bold text-primary">${t.word}</span>
                      <span class="text-on-surface-variant italic" style="font-size:11px">${t.pron}</span>
                    </div>
                    <p class="text-sm text-on-surface-variant leading-relaxed">${t.def}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
        ${filtered.length === 0 ? `
          <div class="text-center py-12 text-on-surface-variant">
            <span class="material-symbols-outlined mb-3 block" style="font-size:40px;opacity:0.3">search_off</span>
            <p class="text-sm">No terms found for "<strong>${_termSearch}</strong>"</p>
          </div>
        ` : ''}
      </div>
    `;

    // Re-focus search if searching
    if (_termSearch) {
      const inp = document.getElementById('term-search');
      if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    }
  }

  function searchTerms(q) {
    _termSearch = q;
    renderTerms();
  }

  // ── History ───────────────────────────────────────
  function renderHistory() {
    const el = document.getElementById('dojo-history-content');
    if (!el) return;
    el.innerHTML = `
      <div class="px-5 py-6 space-y-6">
        <!-- Intro -->
        <div>
          <p class="font-bold uppercase tracking-widest text-primary mb-2" style="font-size:10px">THE GENTLE WAY</p>
          <h2 class="text-headline-lg-mobile font-bold text-on-surface mb-3">From Jutsu to Dō</h2>
          <p class="text-sm text-on-surface-variant leading-relaxed">
            Traditional Jiu-jitsu focused on the 'Jutsu' — the art of lethal combat. Jigoro Kano introduced 'Dō', transforming a weapon of war into a path of self-improvement, physical education, and moral development.
          </p>
        </div>

        <!-- Kano card -->
        <div class="bg-surface-container border border-outline-variant/30 rounded-2xl overflow-hidden">
          <div class="h-40 bg-surface-container-high flex items-center justify-center border-b border-outline-variant/20 relative overflow-hidden">
            <span class="material-symbols-outlined absolute text-on-surface/5 select-none" style="font-size:180px">person</span>
            <div class="relative z-10 text-center">
              <div class="text-primary font-bold" style="font-size:36px;font-family:serif">嘉納 治五郎</div>
              <div class="text-on-surface-variant font-bold uppercase tracking-widest mt-1" style="font-size:10px">Jigoro Kano — Founder of Judo</div>
            </div>
          </div>
          <div class="p-5">
            <p class="text-sm text-on-surface-variant leading-relaxed">
              Born in 1860, Kano began studying Jiu-jitsu at 17 after being physically bullied. By 22 he had synthesised the best elements of multiple schools into a new discipline — Judo. He went on to become the first Asian member of the International Olympic Committee and fought for Judo's Olympic inclusion until his death in 1938.
            </p>
          </div>
        </div>

        <!-- Timeline -->
        <div>
          <h3 class="font-bold text-on-surface uppercase tracking-widest mb-4" style="font-size:11px">HISTORICAL MILESTONES</h3>
          <div class="space-y-0">
            ${[
              ['1860','Jigoro Kano born in Mikage, Hyogo Prefecture, Japan.'],
              ['1877','Kano begins studying Tenjin Shin\'yo-ryu Jiu-jitsu under Fukuda Hachinosuke.'],
              ['1882','The Kodokan is founded with 9 tatami mats at Eishoji Temple, Tokyo.'],
              ['1886','Kodokan Judo defeats rival Ryu in a famous Tokyo police tournament — credibility established.'],
              ['1909','Kano becomes the first Asian elected to the International Olympic Committee.'],
              ['1938','Kano dies aboard the ship Hikawa Maru, aged 77, after securing Judo\'s Olympic future.'],
              ['1964','Judo debuts at the Tokyo Olympics — the first martial art to become an Olympic sport.'],
              ['1992','Judo becomes a full Olympic sport for women in Barcelona.'],
            ].map(([yr, ev], i) => `
              <div class="flex gap-4 pb-5 relative">
                <div class="flex flex-col items-center shrink-0">
                  <div class="w-8 h-8 rounded-full bg-surface-container border-2 border-primary/40 flex items-center justify-center z-10">
                    <div class="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  ${i < 7 ? '<div class="w-px flex-1 bg-outline-variant/30 mt-1"></div>' : ''}
                </div>
                <div class="pb-1">
                  <span class="font-bold text-primary block mb-0.5" style="font-size:11px">${yr}</span>
                  <p class="text-sm text-on-surface-variant leading-relaxed">${ev}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- The Kodokan -->
        <div class="bg-tertiary/5 border border-tertiary/20 rounded-2xl p-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-tertiary" style="font-size:20px">temple_buddhist</span>
            <h3 class="font-bold text-tertiary uppercase tracking-widest" style="font-size:11px">THE KODOKAN</h3>
          </div>
          <p class="text-sm text-on-surface-variant leading-relaxed">
            Started with only 9 mats in a small Buddhist temple, the Kodokan — "Place for Expounding the Way" — became the global home of Judo. Today it stands as a nine-storey building in Tokyo, training thousands of Judoka every year.
          </p>
        </div>

        <!-- Max Degrees quote -->
        <div class="border-l-4 border-primary/30 pl-4">
          <p class="text-sm text-on-surface-variant italic leading-relaxed mb-2">
            "The purpose of Judo is to perfect yourself and contribute to the world."
          </p>
          <p class="font-bold uppercase tracking-widest text-primary/60" style="font-size:10px">— JIGORO KANO —</p>
        </div>
      </div>
    `;
  }

  // ── Kata ──────────────────────────────────────────
  const KATA_LIST = [
    { name:'Nage-no-kata',    jp:'投の形', sets:'5 sets · 15 throws',
      desc:'The foundational throwing Kata — Te-waza, Koshi-waza, Ashi-waza, Ma-sutemi-waza, Yoko-sutemi-waza.',
      color:'#60a5fa', icon:'sports_kabaddi' },
    { name:'Katame-no-kata',  jp:'固の形', sets:'3 sets · 15 techniques',
      desc:'Ground technique Kata covering the three pillars: Osaekomi-waza, Shime-waza, and Kansetsu-waza.',
      color:'#b0c6ff', icon:'accessibility_new' },
    { name:'Ju-no-kata',      jp:'柔の形', sets:'3 sets · 15 forms',
      desc:'Forms of Gentleness. Performed without throwing, emphasising the principle of Ju — yielding to overcome.',
      color:'#71d8c6', icon:'self_improvement' },
    { name:'Kime-no-kata',    jp:'極の形', sets:'2 sets · 20 techniques',
      desc:'Forms of decision — originally for self-defence. Demonstrates Judo\'s roots in practical application.',
      color:'#fbbf24', icon:'shield' },
    { name:'Itsutsu-no-kata', jp:'五の形', sets:'5 techniques',
      desc:'Five timeless forms representing universal forces — considered the most philosophical and advanced Kata.',
      color:'#a78bfa', icon:'blur_circular' },
  ];

  function renderKata() {
    const el = document.getElementById('dojo-kata-content');
    if (!el) return;
    el.innerHTML = `
      <div class="px-5 py-6 space-y-6">
        <!-- Intro -->
        <div class="bg-surface-container border border-outline-variant/30 rounded-2xl p-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-primary" style="font-size:20px">lightbulb</span>
            <h3 class="font-bold text-primary uppercase tracking-widest" style="font-size:11px">THE PURPOSE OF KATA</h3>
          </div>
          <p class="text-sm text-on-surface-variant leading-relaxed mb-3">
            While Randori (free practice) focuses on application, Kata focuses on perfect form. It allows precise study of principles that would be impossible in live resistance.
          </p>
          <p class="text-sm text-on-surface-variant italic border-l-2 border-primary/30 pl-3">
            "Kata is not just a performance — it is a live conversation between Tori and Uke."
          </p>
        </div>

        <!-- Kata cards -->
        <div class="space-y-4">
          ${KATA_LIST.map((k, i) => `
            <div class="bg-surface-container border border-outline-variant/30 rounded-2xl overflow-hidden">
              <div class="flex items-center gap-4 p-5">
                <div class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style="background:${k.color}15;border:1px solid ${k.color}30">
                  <span class="material-symbols-outlined" style="font-size:28px;color:${k.color}">${k.icon}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-baseline gap-2 flex-wrap mb-1">
                    <h3 class="font-bold text-on-surface">${k.name}</h3>
                    <span class="font-bold" style="font-family:serif;color:${k.color};font-size:13px">${k.jp}</span>
                  </div>
                  <span class="font-bold uppercase tracking-widest text-on-surface-variant" style="font-size:9px">${k.sets}</span>
                </div>
              </div>
              <div class="px-5 pb-5">
                <p class="text-sm text-on-surface-variant leading-relaxed">${k.desc}</p>
              </div>
              <div class="px-5 pb-5">
                <div class="flex items-center gap-2 text-on-surface-variant/50 border border-outline-variant/20 rounded-xl px-3 py-2">
                  <span class="material-symbols-outlined" style="font-size:16px">lock</span>
                  <span class="font-bold uppercase tracking-wider" style="font-size:10px">Video guide — coming soon</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Progress note -->
        <div class="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-5 flex gap-3">
          <span class="material-symbols-outlined text-secondary shrink-0 mt-0.5" style="font-size:20px">workspace_premium</span>
          <p class="text-sm text-on-surface-variant leading-relaxed">
            Complete all five Kata to earn the <strong class="text-secondary">'Scroll Keeper'</strong> achievement — unlocking the advanced Dojo content.
          </p>
        </div>
      </div>
    `;
  }

  // ── Public API ────────────────────────────────────
  function open(section) {
    switch (section) {
      case 'moral':   renderMoral();   showSub('dojo-moral');   break;
      case 'terms':   renderTerms();   showSub('dojo-terms');   break;
      case 'history': renderHistory(); showSub('dojo-history'); break;
      case 'kata':    renderKata();    showSub('dojo-kata');    break;
      default:        renderHub();     showSub('dojo-hub');
    }
  }

  function renderForDojo() {
    renderHub();
    showSub('dojo-hub');
  }

  return { renderForDojo, open, searchTerms };

})();
