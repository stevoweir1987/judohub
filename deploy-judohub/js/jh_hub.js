const JHHub = (() => {
  let _tech   = null;
  let _beltId = null;
  let _group  = null;
  let _cards  = [];
  let _idx    = 0;

  // ── Image resolution ─────────────────────────
  // Priority: public/techniques/slug.jpg → maxresdefault → hqdefault → gradient
  function _slug(id) { return id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  function _imgSrc(id) {
    const vid = JHState.getVideoId(id);
    if (vid) return 'https://img.youtube.com/vi/' + vid + '/maxresdefault.jpg';
    return null;
  }

  function _imgEl(id, cls, style) {
    const photo = 'public/techniques/' + _slug(id) + '.jpg';
    const yt    = _imgSrc(id);
    const col   = JHState.getBeltColor(_beltId || 'red');
    // Try photo first via onerror fallback chain
    if (yt) {
      return '<img src="' + photo + '" alt="' + id + '"' +
        (cls ? ' class="' + cls + '"' : '') +
        (style ? ' style="' + style + '"' : '') +
        ' onerror="this.onerror=null;this.src=\'' + yt + '\'"' +
        '/>';
    }
    return '<div style="width:100%;height:100%;background:linear-gradient(135deg,' + col + '18,' + col + '06);display:flex;align-items:center;justify-content:center"><span class="ms" style="font-size:64px;color:' + col + '30">sports_martial_arts</span></div>';
  }

  // ── Content engine ────────────────────────────
  // Hard-coded content for core techniques; AI-pattern for the rest
  const CONTENT = {
    'Tai-otoshi': {
      principle: 'Break uke\'s balance diagonally forward to their right front corner. Your leg acts as a barrier, not a sweeping action.',
      steps: [
        { label: 'Kuzushi', text: 'Pull uke forward and to their right front corner with a lifting action on the lapel.' },
        { label: 'Tsukuri', text: 'Step across and place your right foot outside uke\'s right foot, turning your body 180°.' },
        { label: 'Kake',    text: 'Twist your body, straighten your blocking leg and use your arms to rotate uke over it.' }
      ],
      errors: ['Bending the blocking leg — it must be straight to act as a fulcrum', 'Not turning enough — hips must face same direction as uke\'s toes', 'Pulling down instead of forward and across'],
      drill: { label: 'Mirror entry drill', text: 'Stand facing a wall. Practice the entry turn — foot placement, hip rotation — without a partner. 20 reps each side.', time: '4 min' }
    },
    'O-soto-gari': {
      principle: 'Sweep uke\'s supporting leg from behind while breaking their balance backward over that leg.',
      steps: [
        { label: 'Kuzushi', text: 'Push uke back and slightly to their right rear corner, loading their right leg.' },
        { label: 'Tsukuri', text: 'Step your left foot alongside uke, get chest-to-chest contact, load your right leg.' },
        { label: 'Kake',    text: 'Drive your right leg through in a large sweeping arc, reaping uke\'s right leg away.' }
      ],
      errors: ['Reaping too early before balance is broken', 'Not making chest contact — you must be close', 'Sweeping with a bent knee — use the back of your thigh'],
      drill: { label: 'Reaping pendulum', text: 'Stand on one leg. Swing your free leg in a large controlled arc — back and through. 15 reps each side. Focus on hip height.', time: '3 min' }
    },
    'O-goshi': {
      principle: 'Load uke onto your hip and rotate them over it. The hip is the fulcrum — everything else rotates around it.',
      steps: [
        { label: 'Kuzushi', text: 'Pull uke forward and upward onto their toes, breaking their balance forward.' },
        { label: 'Tsukuri', text: 'Step deep between uke\'s legs, wrap your arm around their waist, hips lower than theirs.' },
        { label: 'Kake',    text: 'Rotate your hips, straighten your legs to lift, then drive forward and down to throw.' }
      ],
      errors: ['Hips not lower than uke\'s — you cannot lift what is above you', 'Leaning forward instead of rotating — use your core, not your back', 'Releasing the grip before the throw completes'],
      drill: { label: 'Hip bump drill', text: 'Partner stands still. Practice stepping in and making hip contact — focus on getting low enough. No throw needed. 15 reps.', time: '5 min' }
    },
    'Ippon-seoi-nage': {
      principle: 'Your arm traps uke\'s arm at the elbow. You become the fulcrum — uke rotates over your back.',
      steps: [
        { label: 'Kuzushi', text: 'Pull uke\'s sleeve arm sharply forward and upward, breaking balance to their front.' },
        { label: 'Tsukuri', text: 'Step in, turn 180°, thread your tsurite arm under uke\'s armpit to grip at their elbow.' },
        { label: 'Kake',    text: 'Bend forward, straighten your knees, and use both arms to flip uke over your shoulder.' }
      ],
      errors: ['Not bending enough — your back must be flat and below uke\'s centre of gravity', 'Elbow grip too loose — the lock must be secure before you throw', 'Standing up before bending forward'],
      drill: { label: 'Wall uchi-komi', text: 'Face a wall. Practice the entry and turn (no throw) — step, pivot, position arms. Wall prevents over-rotation. 20 reps each side.', time: '5 min' }
    },
    'Uchi-mata': {
      principle: 'Reap the inner thigh of uke\'s supporting leg while pulling them forward and over your reaping leg.',
      steps: [
        { label: 'Kuzushi', text: 'Pull uke forward and to the left, loading their right leg as their support.' },
        { label: 'Tsukuri', text: 'Step your left foot between uke\'s feet, turn in, bring your reaping leg inside.' },
        { label: 'Kake',    text: 'Drive your right leg upward through uke\'s inner thigh while pulling them over your hip.' }
      ],
      errors: ['Reaping the outside of the leg — must be inner thigh', 'Not lifting the reaping leg high enough', 'Losing forward pull while reaping'],
      drill: { label: 'Inner thigh pendulum', text: 'Hold a post for balance. Swing your reaping leg forward and up between an imaginary uke\'s legs — smooth arc, hip high. 15 each side.', time: '4 min' }
    },
    'Harai-goshi': {
      principle: 'Sweep uke\'s legs from the side-front with your extended leg while rotating them over your hip.',
      steps: [
        { label: 'Kuzushi', text: 'Pull uke forward onto their toes and slightly to your right.' },
        { label: 'Tsukuri', text: 'Step in with your left foot, pivot 180°, hips loaded in front of uke.' },
        { label: 'Kake',    text: 'Sweep your right leg across the front of uke\'s thighs while rotating hard with your upper body.' }
      ],
      errors: ['Sweeping too low — contact at thigh not calf', 'Not pivoting fully — hips must clear to the front', 'Pulling down instead of rotating around'],
      drill: { label: 'Hip sweep on mat', text: 'Kneel on one knee. Practice the sweeping leg motion — high arc, hip extension. 20 reps. Focus on height of sweep.', time: '4 min' }
    },
    'Juji-gatame': {
      principle: 'Hyperextend uke\'s elbow by applying lever force across your hips while the arm is isolated and straight.',
      steps: [
        { label: 'Control', text: 'Secure uke\'s arm with both hands, thumb pointing up. The arm must be straight.' },
        { label: 'Position', text: 'Hips pressed tight across uke\'s upper arm. Knees pinching to prevent arm escape. Feet on the floor.' },
        { label: 'Apply', text: 'Bridge your hips upward slowly and smoothly. Do not jerk. Uke taps — release immediately.' }
      ],
      errors: ['Gap between your hips and their arm — no lever effect', 'Pulling the arm instead of bridging — risk of injury', 'Knees apart — uke can pull arm free'],
      drill: { label: 'Sit-back entry reps', text: 'Partner kneels. Practice the sit-back entry from standing — grip sleeve, sit to the side, swing legs over. 10 slow reps each side.', time: '6 min' }
    },
  };

  function _getContent(id, groupTitle) {
    // Use hard-coded if available
    if (CONTENT[id]) return CONTENT[id];

    // Pattern-generate based on group type
    const en   = JHState.getEnglish(id);
    const col  = JHState.getBeltColor(_beltId);
    const isThrow   = /waza|nage|gari|goshi|gake|barai|guruma|gaeshi|otoshi|nage|harai|mata|ashi/i.test(groupTitle + ' ' + id);
    const isHold    = /osaekomi|gatame/i.test(groupTitle);
    const isStrangle= /shime/i.test(groupTitle);
    const isLock    = /kansetsu/i.test(groupTitle);

    if (isHold) return {
      principle: 'Control uke\'s upper body by distributing your weight across their chest and hips. Stability comes from low posture and active adjustments.',
      steps: [
        { label: 'Entry',     text: 'Transition smoothly from the throw or from ne-waza into the hold position without losing contact.' },
        { label: 'Position',  text: 'Stabilise your weight distribution — head down, hips low, legs spread for a wide base.' },
        { label: 'Maintain',  text: 'Constantly micro-adjust as uke attempts escapes. Move with them, do not fight them statically.' }
      ],
      errors: ['Hips too high — easy to bridge and roll', 'Head up — raises your centre of gravity', 'Rigid response to escape attempts — stay fluid'],
      drill: { label: 'Hold maintenance drill', text: 'Partner attempts slow escapes for 30 seconds. You adjust to maintain. 3 rounds each role.', time: '6 min' }
    };

    if (isStrangle) return {
      principle: 'Apply controlled pressure to the carotid arteries on both sides of the neck, not the windpipe. Clean technique is safe and fast.',
      steps: [
        { label: 'Setup',  text: 'Achieve a secure position behind or beside uke before applying the strangle.' },
        { label: 'Grip',   text: 'Establish your grip cleanly — forearm across one side, bicep against the other.' },
        { label: 'Apply',  text: 'Compress smoothly and steadily. Uke signals with two taps — release immediately.' }
      ],
      errors: ['Windpipe pressure instead of carotid — ineffective and dangerous', 'Poor position — uke can escape before strangle takes effect', 'Jerking instead of smooth compression'],
      drill: { label: 'Grip familiarisation', text: 'Practice establishing the grip from different positions — both sides. Partner is relaxed. Focus purely on clean grip placement.', time: '5 min' }
    };

    if (isLock) return {
      principle: 'Isolate the target joint and apply a single direction of force against its natural range of motion. Slow and controlled is more effective than fast.',
      steps: [
        { label: 'Isolate', text: 'Secure the target limb firmly before applying any leverage. The joint must be isolated from escape.' },
        { label: 'Lever',   text: 'Position your body as the fulcrum — your weight does the work, not your grip strength.' },
        { label: 'Apply',   text: 'Increase pressure slowly. Uke taps — release immediately and completely.' }
      ],
      errors: ['Applying too fast — uke cannot tap in time', 'Incomplete isolation — uke rotates out of the lock', 'Wrong angle — force not aligned against joint limit'],
      drill: { label: 'Slow application drill', text: 'Apply the lock at 20% speed. Hold at threshold for 3 seconds. Release. 10 reps each side. Speed kills precision.', time: '6 min' }
    };

    // Default: throw
    return {
      principle: 'Break uke\'s balance (kuzushi) in the direction of the throw before entering. The throw should feel inevitable, not forced.',
      steps: [
        { label: 'Kuzushi', text: 'Disrupt uke\'s posture in the direction of the throw. They should feel unsteady before you enter.' },
        { label: 'Tsukuri', text: 'Enter and position your body perfectly. Your feet, hips and arms must align with the throwing direction.' },
        { label: 'Kake',    text: 'Execute the throw as one flowing movement — do not pause between entry and throw.' }
      ],
      errors: ['Forcing the throw without kuzushi — strength over technique', 'Incomplete entry — body not fully positioned before throwing', 'Breaking the motion — entry and throw must be continuous'],
      drill: { label: 'Uchi-komi sets', text: 'Solo or partner. 10 entries focusing purely on foot placement, then 10 on hip position, then 10 full speed. 3 sets total.', time: '6 min' }
    };
  }

  // ── Build 6 swipe cards ───────────────────────
  function _buildCards(id, beltId, groupTitle) {
    const en      = JHState.getEnglish(id);
    const col     = JHState.getBeltColor(beltId);
    const vid     = JHState.getVideoId(id);
    const content = _getContent(id, groupTitle || '');
    const photo   = 'public/techniques/' + _slug(id) + '.jpg';
    const ytImg   = vid ? 'https://img.youtube.com/vi/' + vid + '/maxresdefault.jpg' : null;

    const imgBg = (src, fallback) => {
      if (src) return 'url(' + src + ')' + (fallback ? ',url(' + fallback + ')' : '');
      return 'none';
    };

    return [
      // ── Card 1: WHAT IS IT ──
      {
        bg: col + '12',
        content: `
          <div style="display:flex;flex-direction:column;height:100%;padding:72px 28px 100px">
            <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
              <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:10px;color:${col};letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px">WHAT IS IT?</p>
              <h1 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:clamp(32px,8vw,52px);color:#fff;line-height:1;margin-bottom:8px;letter-spacing:-0.02em">${id}</h1>
              <p style="font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;color:rgba(255,255,255,0.5);font-style:italic;margin-bottom:28px">${en}</p>
              <p style="font-family:Inter,sans-serif;font-size:15px;color:rgba(229,226,225,0.75);line-height:1.65;max-width:360px">${content.principle || 'A fundamental judo technique requiring precise timing, balance and co-ordination between kuzushi, tsukuri and kake.'}</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <span style="padding:6px 14px;border-radius:99px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:11px;background:${col}25;color:${col};text-transform:capitalize">${beltId} Belt</span>
              ${groupTitle ? '<span style="padding:6px 14px;border-radius:99px;font-family:\'Plus Jakarta Sans\',sans-serif;font-weight:700;font-size:11px;background:rgba(255,255,255,0.08);color:rgba(229,226,225,0.6)">' + groupTitle + '</span>' : ''}
            </div>
          </div>`
      },

      // ── Card 2: THE PRINCIPLE ──
      {
        bg: '#0e1a0e',
        content: `
          <div style="display:flex;flex-direction:column;height:100%;padding:72px 28px 100px">
            <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:10px;color:#4ade80;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:20px">THE PRINCIPLE</p>
            <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:24px">
              <div style="width:56px;height:56px;border-radius:16px;background:#4ade8015;border:1px solid #4ade8030;display:flex;align-items:center;justify-content:center">
                <span class="ms" style="font-size:28px;color:#4ade80">lightbulb</span>
              </div>
              <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:clamp(20px,5vw,28px);color:#fff;line-height:1.3;letter-spacing:-0.01em">${content.principle}</p>
            </div>
            <p style="font-family:Inter,sans-serif;font-size:12px;color:rgba(229,226,225,0.25);letter-spacing:0.06em">KEY CONCEPT · ${id.toUpperCase()}</p>
          </div>`
      },

      // ── Card 3: HOW TO DO IT ──
      {
        bg: '#0a0a1a',
        content: `
          <div style="display:flex;flex-direction:column;height:100%;padding:72px 28px 100px;overflow-y:auto">
            <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:10px;color:#818cf8;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:20px">HOW TO DO IT</p>
            <div style="flex:1;display:flex;flex-direction:column;gap:20px;justify-content:center">
              ${(content.steps || []).map((s, i) => `
                <div style="display:flex;gap:16px;align-items:flex-start">
                  <div style="width:36px;height:36px;border-radius:50%;background:#818cf815;border:1px solid #818cf830;display:flex;align-items:center;justify-content:center;shrink:0;flex-shrink:0">
                    <span style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:14px;color:#818cf8">${i + 1}</span>
                  </div>
                  <div>
                    <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;color:#818cf8;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.06em">${s.label}</p>
                    <p style="font-family:Inter,sans-serif;font-size:14px;color:rgba(229,226,225,0.8);line-height:1.55">${s.text}</p>
                  </div>
                </div>`).join('')}
            </div>
          </div>`
      },

      // ── Card 4: WATCH OUT ──
      {
        bg: '#1a0808',
        content: `
          <div style="display:flex;flex-direction:column;height:100%;padding:72px 28px 100px">
            <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:10px;color:#f87171;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:20px">WATCH OUT</p>
            <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:16px">
              <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:22px;color:#fff;margin-bottom:8px">Common errors</p>
              ${(content.errors || []).map(e => `
                <div style="display:flex;gap-14px;align-items:flex-start;gap:14px;padding:14px 16px;border-radius:14px;background:rgba(248,113,113,0.07);border:1px solid rgba(248,113,113,0.15)">
                  <span class="ms ms-fill" style="font-size:18px;color:#f87171;flex-shrink:0;margin-top:1px">cancel</span>
                  <p style="font-family:Inter,sans-serif;font-size:14px;color:rgba(229,226,225,0.85);line-height:1.5">${e}</p>
                </div>`).join('')}
            </div>
          </div>`
      },

      // ── Card 5: QUICK DRILL ──
      {
        bg: '#0e1018',
        content: `
          <div style="display:flex;flex-direction:column;height:100%;padding:72px 28px 100px">
            <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:10px;color:#f2ca50;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:20px">QUICK DRILL</p>
            <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:20px">
              <div style="display:flex;align-items:center;gap:12px">
                <div style="width:52px;height:52px;border-radius:16px;background:#f2ca5015;border:1px solid #f2ca5030;display:flex;align-items:center;justify-content:center">
                  <span class="ms" style="font-size:26px;color:#f2ca50">fitness_center</span>
                </div>
                <div>
                  <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:20px;color:#fff">${(content.drill || {}).label || 'Uchi-komi sets'}</p>
                  <span style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:11px;color:#f2ca50;background:#f2ca5015;padding:3px 10px;border-radius:99px">${(content.drill || {}).time || '5 min'}</span>
                </div>
              </div>
              <p style="font-family:Inter,sans-serif;font-size:15px;color:rgba(229,226,225,0.75);line-height:1.65;padding:18px;background:rgba(255,255,255,0.04);border-radius:16px;border:1px solid rgba(255,255,255,0.06)">${(content.drill || {}).text || '10 entries on each side focusing on foot placement. 3 sets.'}</p>
            </div>
          </div>`
      },

      // ── Card 6: WATCH ──
      {
        bg: '#0e0e0e',
        content: vid ? `
          <div style="display:flex;flex-direction:column;height:100%;padding:72px 0 0">
            <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:10px;color:rgba(229,226,225,0.4);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px;padding:0 28px">WATCH IT</p>
            <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 0 80px">
              <div style="position:relative;width:100%;padding-bottom:56.25%">
                <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
                  src="https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1"
                  allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>
              </div>
              <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;color:rgba(229,226,225,0.5);margin:16px 28px 0">${id} — Technique demonstration</p>
            </div>
          </div>` : `
          <div style="display:flex;flex-direction:column;height:100%;align-items:center;justify-content:center;padding:28px">
            <span class="ms" style="font-size:56px;color:rgba(229,226,225,0.15);margin-bottom:16px">videocam_off</span>
            <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:16px;color:rgba(229,226,225,0.4);text-align:center">No video available yet for ${id}</p>
          </div>`
      }
    ];
  }

  // ── Open Hub (main entry point) ───────────────
  function open(techId, beltId) {
    _tech = techId;
    if (beltId) {
      _beltId = beltId;
    } else {
      const info = JHState.findTechnique(techId);
      _beltId = info ? info.beltId : (JHState.getProfile().belt || 'red');
      if (info) _group = info.groupTitle;
    }
    JHState.addRecent(techId, _beltId);
    _renderHub();
    JHRouter.go('hub', { technique: techId });
  }

  function _renderHub() {
    _renderHero();
    _renderActionBar();
    _renderGrid();
  }

  function _renderHero() {
    const el = document.getElementById('hub-hero');
    if (!el) return;
    const en    = JHState.getEnglish(_tech);
    const col   = JHState.getBeltColor(_beltId);
    const photo = 'public/techniques/' + _slug(_tech) + '.jpg';
    const yt    = _imgSrc(_tech);

    el.innerHTML = `
      <div style="position:absolute;inset:0;background:#111">
        ${yt ? '<img id="hub-bg-img" src="' + photo + '" alt="' + _tech + '" onerror="this.onerror=null;this.src=\'' + yt + '\'" style="width:100%;height:100%;object-fit:cover;opacity:0.55"/>' : '<div style="width:100%;height:100%;background:linear-gradient(135deg,' + col + '20,' + col + '06)"></div>'}
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(14,14,14,0.2) 0%,rgba(14,14,14,0.6) 50%,rgba(14,14,14,1) 100%)"></div>
      </div>
      <button onclick="JHRouter.back()" style="position:absolute;top:calc(env(safe-area-inset-top,0px) + 60px);left:16px;width:36px;height:36px;border-radius:50%;background:rgba(14,14,14,0.7);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)">
        <span class="ms" style="font-size:18px;color:#f2ca50">arrow_back</span>
      </button>
      <div style="position:absolute;bottom:32px;left:20px;right:20px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="padding:4px 12px;border-radius:99px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:10px;background:${col};color:#fff;text-transform:uppercase;letter-spacing:0.08em">${_beltId} Belt</span>
          ${_group ? '<span style="padding:4px 12px;border-radius:99px;font-family:\'Plus Jakarta Sans\',sans-serif;font-weight:700;font-size:10px;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.7)">' + _group + '</span>' : ''}
        </div>
        <h1 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:clamp(28px,7vw,40px);color:#fff;line-height:1;letter-spacing:-0.02em;margin-bottom:4px">${_tech}</h1>
        <p style="font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;color:rgba(255,255,255,0.5);font-style:italic">${en}</p>
      </div>`;
  }

  function _renderActionBar() {
    const el = document.getElementById('hub-action-bar');
    if (!el) return;
    const fav = JHState.isFav(_tech);
    el.innerHTML = `
      <button onclick="JHHub.toggleFav()" style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer">
        <div style="width:44px;height:44px;border-radius:50%;background:#2a2a2a;display:flex;align-items:center;justify-content:center">
          <span class="ms${fav ? ' ms-fill' : ''}" style="font-size:20px;color:${fav ? '#f87171' : '#f2ca50'}">${fav ? 'favorite' : 'favorite_border'}</span>
        </div>
        <span style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:10px;color:rgba(229,226,225,0.45)">${fav ? 'Saved' : 'Save'}</span>
      </button>
      <button onclick="JHHub.togglePin()" style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer">
        <div style="width:44px;height:44px;border-radius:50%;background:#2a2a2a;display:flex;align-items:center;justify-content:center">
          <span class="ms" style="font-size:20px;color:#f2ca50">push_pin</span>
        </div>
        <span style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:10px;color:rgba(229,226,225,0.45)">Pin</span>
      </button>
      <button onclick="JHHub.startCards()" style="display:flex;align-items:center;gap:8px;padding:0 24px;height:44px;border-radius:12px;background:#f2ca50;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:13px;color:#1a1000;letter-spacing:0.03em">
        <span class="ms ms-fill" style="font-size:18px">play_arrow</span> Start Learning
      </button>
      <button onclick="JHHub.share()" style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer">
        <div style="width:44px;height:44px;border-radius:50%;background:#2a2a2a;display:flex;align-items:center;justify-content:center">
          <span class="ms" style="font-size:20px;color:#f2ca50">share</span>
        </div>
        <span style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:10px;color:rgba(229,226,225,0.45)">Share</span>
      </button>`;
  }

  function _renderGrid() {
    const el = document.getElementById('hub-cards');
    if (!el) return;
    const GRID = [
      { id:'what',   icon:'help_outline',        label:'What Is It?',       sub:'Overview & Purpose',    col:'#818cf8' },
      { id:'exec',   icon:'format_list_numbered', label:'Execution',         sub:'Step-by-step',          col:'#818cf8' },
      { id:'errors', icon:'cancel',               label:'Common Errors',     sub:'Top mistakes',          col:'#f87171' },
      { id:'drill',  icon:'fitness_center',       label:'Quick Drill',       sub:'Train it now',          col:'#f2ca50' },
      { id:'watch',  icon:'play_circle',          label:'Watch',             sub:'Video examples',        col:'#4ade80' },
    ];
    el.innerHTML = GRID.map(c => `
      <button onclick="JHHub.startCards(${GRID.indexOf(c)})"
        style="background:#1c1b1b;border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden;cursor:pointer;text-align:left;padding:0;display:flex;flex-direction:column;transition:all 0.15s">
        <div style="height:3px;background:linear-gradient(90deg,${c.col}60,transparent)"></div>
        <div style="padding:14px 14px 16px">
          <span class="ms" style="font-size:20px;color:${c.col};display:block;margin-bottom:8px">${c.icon}</span>
          <p style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;color:#e5e2e1;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.05em">${c.label}</p>
          <p style="font-family:Inter,sans-serif;font-size:11px;color:rgba(229,226,225,0.4)">${c.sub}</p>
        </div>
      </button>`).join('');
  }

  // ── Swipe card system ─────────────────────────
  function startCards(startIndex) {
    _idx   = startIndex || 0;
    _cards = _buildCards(_tech, _beltId, _group);
    _showOverlay();
  }

  function _showOverlay() {
    const overlay = document.getElementById('swipe-overlay');
    if (!overlay) return;
    overlay.style.display = 'block';
    _renderTrack();
    _updateDots();
    _initSwipe();
  }

  function closeCards() {
    const overlay = document.getElementById('swipe-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  function _renderTrack() {
    const track = document.getElementById('swipe-track');
    if (!track) return;
    track.innerHTML = _cards.map((c, i) => `
      <div style="min-width:100vw;width:100vw;height:100%;background:${c.bg};position:relative;overflow:hidden">
        ${c.content}
        <!-- Bottom nav hint -->
        <div style="position:absolute;bottom:0;left:0;right:0;padding:16px 28px calc(env(safe-area-inset-bottom,0px) + 20px);display:flex;justify-content:space-between;align-items:center;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)">
          <button onclick="JHHub.prevCard()" style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;color:rgba(255,255,255,${i > 0 ? '0.5' : '0'});background:none;border:none;cursor:pointer;padding:8px 0">← Prev</button>
          <p style="font-family:Inter,sans-serif;font-size:11px;color:rgba(255,255,255,0.25)">Swipe to navigate</p>
          <button onclick="JHHub.nextCard()" style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;color:rgba(255,255,255,${i < _cards.length - 1 ? '0.5' : '0'});background:none;border:none;cursor:pointer;padding:8px 0">Next →</button>
        </div>
      </div>`).join('');
    track.style.transition = 'none';
    track.style.transform = 'translateX(-' + (_idx * 100) + 'vw)';
  }

  function _updateDots() {
    const dots    = document.getElementById('swipe-dots');
    const counter = document.getElementById('swipe-counter');
    if (dots) {
      dots.innerHTML = _cards.map((_, i) => `
        <div style="width:${i === _idx ? 20 : 6}px;height:6px;border-radius:3px;background:${i === _idx ? '#f2ca50' : 'rgba(255,255,255,0.2)'};transition:all 0.25s"></div>`).join('');
    }
    if (counter) counter.textContent = (_idx + 1) + ' / ' + _cards.length;
  }

  function _goTo(i) {
    if (i < 0 || i >= _cards.length) return;
    _idx = i;
    const track = document.getElementById('swipe-track');
    if (track) {
      track.style.transition = 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
      track.style.transform  = 'translateX(-' + (_idx * 100) + 'vw)';
    }
    _updateDots();
  }

  function nextCard() { _goTo(_idx + 1); }
  function prevCard() { _goTo(_idx - 1); }

  function _initSwipe() {
    const overlay = document.getElementById('swipe-overlay');
    if (!overlay) return;
    let startX = 0, startY = 0, isDragging = false, moved = false;

    overlay.ontouchstart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      moved = false;
    };

    overlay.ontouchmove = (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (!moved && Math.abs(dy) > Math.abs(dx)) { isDragging = false; return; }
      moved = true;
      e.preventDefault();
      const track = document.getElementById('swipe-track');
      if (track) {
        track.style.transition = 'none';
        track.style.transform  = 'translateX(calc(-' + (_idx * 100) + 'vw + ' + dx + 'px))';
      }
    };

    overlay.ontouchend = (e) => {
      if (!isDragging || !moved) return;
      isDragging = false;
      const dx = e.changedTouches[0].clientX - startX;
      if (dx < -60)  nextCard();
      else if (dx > 60) prevCard();
      else _goTo(_idx);
    };
  }

  function toggleFav() { JHState.toggleFav(_tech); _renderActionBar(); }
  function togglePin() { JHState.togglePin(_tech); _renderActionBar(); }
  function share() {
    if (navigator.share) navigator.share({ title: _tech + ' — JudoHub', text: JHState.getEnglish(_tech), url: window.location.href });
  }

  return { open, startCards, closeCards, nextCard, prevCard, toggleFav, togglePin, share };
})();
