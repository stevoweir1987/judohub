// ── TECHNIQUE DEPTH DATA ──────────────────────────────────────────────────────
// grips: key grip & loading note
// mistakes: array of common errors (2-3)
// combos: array of combination strings
// counters: array of counter options
// comp: competition context tip

const TECH_DEPTH = {

  'O-soto-gari': {
    grips: 'Standard sleeve-lapel. Drive the sleeve arm forward and upward as you lean chest-to-chest — this loads your bodyweight onto uke before the reap.',
    mistakes: [
      'Reaping before kuzushi — the leg does nothing if uke is still balanced',
      'Standing upright during entry — lean in and press your chest onto theirs',
      'Half-hearted reap — drive the leg all the way through, not just a tap',
    ],
    combos: [
      'Ko-uchi-gari → O-soto-gari (minor reap draws uke\'s foot forward, major reap scores)',
      'Ouchi-gari → O-soto-gari (attack inside leg first, switch outside when they resist)',
    ],
    counters: [
      'O-soto-gaeshi — step past the reap and throw back over the same leg',
      'O-uchi-gari — as tori commits their weight, attack the inner leg',
    ],
    comp: 'One of the most scored throws at every level. Most effective against opponents with an upright stance or who push forward. Attack when uke\'s right foot is planted and weighted.',
  },

  'Ouchi-gari': {
    grips: 'Standard grip. Drive the lapel hand backwards and down to break uke\'s balance rearward. Your reaping leg sweeps between their legs, hooking the far heel.',
    mistakes: [
      'Reaching with the foot instead of driving with the hip — the whole body must commit',
      'Breaking your own posture forward — stay upright or slightly back as you reap',
      'Reaping the wrong leg — attack the leg that\'s bearing weight',
    ],
    combos: [
      'Ouchi-gari → Morote-seoi-nage (reap draws them forward, shoulder throw scores)',
      'Ko-uchi-gari → Ouchi-gari (minor reap shifts weight, switch to major inner reap)',
    ],
    counters: [
      'Ouchi-gaeshi — post your foot and throw them back the other way',
      'Ko-uchi-gari — as they lean forward into the reap',
    ],
    comp: 'Works especially well against opponents who lean forward. Attack when uke steps with the leg you intend to reap. Very effective in combination with Ko-uchi-gari as a two-attack sequence.',
  },

  'Ko-uchi-gari': {
    grips: 'Standard. Pull the sleeve arm down and across your body. Trap the heel with the sole of your foot — this is a hook, not a kick.',
    mistakes: [
      'Kicking instead of hooking the heel — you must catch and hold the ankle momentarily',
      'Not breaking balance forward first — pull uke onto their toes before the reap',
      'Attacking the wrong ankle — reap the foot that\'s bearing weight',
    ],
    combos: [
      'Ko-uchi-gari → Morote-seoi-nage (classic: reap draws reaction, enter for shoulder throw)',
      'Ko-uchi-gari → O-soto-gari (pressure inside, score outside)',
    ],
    counters: [
      'Ko-uchi-gaeshi — redirect tori\'s momentum and throw back',
      'Ouchi-gari — as tori lifts their foot for the reap',
    ],
    comp: 'The most important entry attack in judo. Even if it doesn\'t score, it draws a reaction that sets up the second attack. Drive hard — a committed Ko-uchi-gari scores on its own.',
  },

  'Ko-soto-gari': {
    grips: 'Standard. Pull the sleeve forward and up, push with the lapel hand across uke\'s body. Hook the near ankle from the outside.',
    mistakes: [
      'Sweeping too wide — the hook must be tight against the ankle, not out to the side',
      'Not pushing uke\'s upper body toward the reaping direction before hooking',
      'Attacking when uke\'s weight is on both feet — wait for the step',
    ],
    combos: [
      'Ouchi-gari → Ko-soto-gari (attack inside, switch to outside when they resist)',
      'Ko-uchi-gari → Ko-soto-gari (shift from inner to outer ankle attack)',
    ],
    counters: [
      'Tai-otoshi as tori reaches in low for the ankle',
      'Ouchi-gari — step across and attack their inner leg',
    ],
    comp: 'Fast, low-risk throw. Excellent setup technique. Most effective against opponents who resist with a wide stance — attack the near foot as they plant it.',
  },

  'O-goshi': {
    grips: 'Wrap your arm fully around uke\'s waist (or grip the belt). Sleeve hand drives uke\'s elbow down to hip level. Load uke onto your hip — their feet should almost leave the ground.',
    mistakes: [
      'Bending forward at the waist — your back must stay straight, hips do the work',
      'Not pulling uke close enough — gap between bodies means the throw fails',
      'Feet too wide — narrower stance lets you pivot fully',
    ],
    combos: [
      'Deashi-harai → O-goshi (sweep misses, immediately load onto hip)',
      'O-goshi → Kesa-gatame (natural landing position — go straight to the hold)',
    ],
    counters: [
      'Ushiro-goshi — lift from behind as tori loads their hip',
      'Utsuri-goshi — shift hips to the side and counter-throw',
    ],
    comp: 'The foundation hip throw. Essential for understanding all hip throws. At competition level, transitions to Uki-goshi or Tsurikomi-goshi — but O-goshi scores too.',
  },

  'Ippon-seoi-nage': {
    grips: 'Drop under and place the sleeve elbow on your shoulder (or into your elbow pit for the one-arm version). Drive with your legs — the throw comes from the legs and hips, not the back.',
    mistakes: [
      'Bending at the waist during the throw — spinal alignment must stay neutral',
      'Hips too high — get below uke\'s centre of gravity before throwing',
      'Feet too wide on entry — narrow stance enables a full pivot',
    ],
    combos: [
      'Ko-uchi-gari → Ippon-seoi-nage (reap creates the forward reaction, enter fast)',
      'Deashi-harai feint → Ippon-seoi-nage (fake sweep, drop under as they adjust)',
    ],
    counters: [
      'Sumi-otoshi — as tori drops under, pull back and push to the corner',
      'Ushiro-goshi — if tori stands up mid-throw, lift from behind',
    ],
    comp: 'One of the highest-scoring throws in world competition. Very effective from a sleeve-only or broken grip. Master the drop seoi entry — it\'s harder to telegraph. Works at any belt level.',
  },

  'Morote-seoi-nage': {
    grips: 'Both arms slide under uke\'s arms, driving elbows into the armpit region. The lapel grip arm controls direction; both elbows press down to load uke on your back.',
    mistakes: [
      'Not turning in fully — hips must cross the centreline and be below uke\'s hips',
      'Standing up during the throw instead of driving forward and down',
      'Slow entry — the turn must be explosive, not gradual',
    ],
    combos: [
      'Ko-uchi-gari → Morote-seoi-nage (the classic youth judo combination)',
      'Ouchi-gari → Morote-seoi-nage (attack backwards, counter-attack forwards)',
    ],
    counters: [
      'Sumi-otoshi — redirect tori\'s forward momentum to the corner',
      'Tani-otoshi — sit behind tori as they turn in',
    ],
    comp: 'Extremely common at all levels, especially youth competition. The double-lapel grip variant is very popular for its control. Drop seoi is dangerous — hard to read and very fast.',
  },

  'Tai-otoshi': {
    grips: 'Standard sleeve-lapel. Your blocking leg is a post — it doesn\'t reap. The throw comes from pulling the sleeve across and rotating uke over the block.',
    mistakes: [
      'Reaping the leg — Tai-otoshi is a block, not a reap; your leg just stops their forward movement',
      'Turning past 90 degrees — find the throw at 90° and pull through from there',
      'Not pulling the sleeve arm across and down simultaneously with the block',
    ],
    combos: [
      'Ko-uchi-gari → Tai-otoshi (reap draws step, block and rotate as they plant)',
      'Ouchi-gari → Tai-otoshi (inner reap forces a step, block the next one)',
    ],
    counters: [
      'Tai-otoshi-gaeshi — pull back as tori extends and throw over the same leg',
      'Uchi-mata — as tori turns in, drive between their legs',
    ],
    comp: 'High-level competitive throw. Works brilliantly off broken grips and fast footwork. The key is to attack from movement — static Tai-otoshi is easy to defend.',
  },

  'Tsurikomi-goshi': {
    grips: 'Lapel hand lifts to shoulder height (tsuri = lift). Sleeve hand pulls forward and across (komi = pull). Both actions together load uke onto your hip.',
    mistakes: [
      'Pulling down with the lapel hand instead of lifting — it must go up to break balance',
      'Poor hip position — your hip must be in front of uke\'s hip centre, not beside it',
      'Too much distance between bodies — pull uke tight before turning',
    ],
    combos: [
      'Ko-uchi-gari → Tsurikomi-goshi (reap creates forward break, load the hip)',
      'Deashi-harai → Tsurikomi-goshi (sweep misses, immediately hip throw)',
    ],
    counters: [
      'Utsuri-goshi — shift hips as tori loads and throw them off',
      'Ushiro-goshi — step behind and lift as they turn in',
    ],
    comp: 'A core belt requirement throw that also scores at competition level. The lifting lapel action makes it effective against opponents with a strong downward grip. Often overlooked — very effective with good kuzushi.',
  },

  'Harai-goshi': {
    grips: 'Standard. The sweeping leg drives through the back of uke\'s thighs — not the calves, not the knees. Load the hip fully first, then sweep.',
    mistakes: [
      'Sweeping before the hip is loaded — kuzushi and tsukuri must come first',
      'Bending forward at the waist during the sweep',
      'Sweeping at the calf or knee level — the thigh is the target',
    ],
    combos: [
      'Ouchi-gari → Harai-goshi (attack backwards first, force the step forward)',
      'Ko-uchi-gari → Harai-goshi (minor reap sets up the hip loading)',
    ],
    counters: [
      'Harai-goshi-gaeshi — catch the sweeping leg and throw back',
      'Tani-otoshi — sit behind tori as they load and sweep',
    ],
    comp: 'One of the most powerful throws in competition. Elite players score ippon with it regularly. Works especially well when uke is pulled strongly off-balance forward. High risk/reward.',
  },

  'Hane-goshi': {
    grips: 'Standard. The throwing leg bends and springs (hane = spring) against uke\'s inner thigh. Unlike Harai-goshi, the leg is active — it bounces, not sweeps.',
    mistakes: [
      'Using a static block rather than an active spring — the leg must push upward',
      'Poor hip loading — hips must come across and under uke\'s centre first',
      'Throwing while standing too upright',
    ],
    combos: [
      'Ouchi-gari → Hane-goshi (set up forward kuzushi then spring the hip)',
      'Ko-uchi-gari → Hane-goshi (minor reap disrupts balance, enter for hip spring)',
    ],
    counters: [
      'Hane-goshi-gaeshi — catch tori\'s throwing leg and redirect',
      'Tani-otoshi — sit straight down as they turn in',
    ],
    comp: 'Powerful but technically demanding. Works very well on opponents with a lower stance. The springing action makes it harder to counter than Harai-goshi.',
  },

  'Uchi-mata': {
    grips: 'Standard. Drive your throwing leg up between uke\'s legs, sweeping the inner thigh. Your upper body pulls forward and to the throwing side simultaneously.',
    mistakes: [
      'Driving into the knee — the leg must sweep the inner thigh, not block the knee',
      'Bending forward — upper body rotation must pull uke around, not push them down',
      'Not loading the hip first — hip must cross before the leg sweeps',
    ],
    combos: [
      'Ouchi-gari → Uchi-mata (classic combination — inside, inside, different direction)',
      'Ko-uchi-gari → Uchi-mata (set up with minor reap, score with inner thigh)',
    ],
    counters: [
      'Uchi-mata-gaeshi — catch the sweeping leg and throw',
      'Ko-uchi-gari — as tori lifts their attacking leg, hook the supporting foot',
      'Tani-otoshi — sit behind tori\'s supporting leg',
    ],
    comp: 'The most scored throw in elite judo. Infinite variation — left-side, right-side, drop entries, combinations. Master this throw and combinations off it. Every top player has it.',
  },

  'Deashi-harai': {
    grips: 'Standard. The sweep is all timing — catch the advancing foot as weight transfers OFF it, not onto it. A sweep, not a kick.',
    mistakes: [
      'Sweeping too early or late — the timing window is half a second as uke steps',
      'Sweeping with force instead of timing — a perfectly timed sweep needs no power',
      'Sweeping the planted foot — only sweep the advancing (unweighted) foot',
    ],
    combos: [
      'Deashi-harai → Tsurikomi-goshi (sweep disrupts rhythm, immediately hip throw)',
      'Deashi-harai → Ippon-seoi-nage (sweep draws a defensive step, drop under)',
    ],
    counters: [
      'Ko-uchi-gari — as tori reaches low for the sweep',
      'Ouchi-gari — step through and attack as tori over-commits to the sweep',
    ],
    comp: 'Pure timing throw. Devastating when drilled. Scores against anyone when the timing is right. Practise with a moving partner — never from a static position. Works in all directions of movement.',
  },

  'Okuri-ashi-harai': {
    grips: 'Standard. As uke shuffles sideways, both feet are swept simultaneously — first the lead foot, immediately followed by the trailing foot. Never split the sweep.',
    mistakes: [
      'Sweeping one foot at a time — both feet must be caught in the same motion',
      'Wrong timing — sweep as the feet come together at the end of the shuffle, not mid-step',
      'Breaking your own posture sideways to reach for the feet',
    ],
    combos: [
      'Use as a counter to uke\'s sideways grip-fighting movement',
      'Combine with O-soto-gari approach — feint with O-soto, switch to Okuri as they step sideways',
    ],
    counters: [
      'O-soto-gari — if tori over-commits their body sideways',
      'Uchi-mata — step across and attack as tori extends for the sweep',
    ],
    comp: 'Works specifically on opponents who shuffle sideways. Practice by creating movement patterns. Often a surprise score — opponents don\'t see it coming because they\'re focused on the forward-backward game.',
  },

  'Sasae-tsurikomi-ashi': {
    grips: 'Standard. Place the sole of your foot against uke\'s ankle (not shin) as you lift with the lapel hand. The lifting and blocking happen simultaneously.',
    mistakes: [
      'Placing the foot too high on the shin instead of the ankle',
      'Blocking first, then lifting — both must happen at the same moment',
      'Not pulling uke forward first — they must be committed forward before the block',
    ],
    combos: [
      'O-soto-gari approach → Sasae-tsurikomi-ashi (feint outside, block ankle as they step)',
      'Deashi-harai feint → Sasae-tsurikomi-ashi (suggest the sweep, then prop)',
    ],
    counters: [
      'O-soto-gari — step around the block and attack from behind',
      'Simply lifting the blocked foot and stepping through',
    ],
    comp: 'Works well against opponents who move forward aggressively. The simultaneous lift-and-block is the key — practise the coordination. Less common at high level but scores when clean.',
  },

  'Hiza-guruma': {
    grips: 'Standard. Place the sole of your foot on uke\'s kneecap. Pull uke forward and rotate them around the fixed knee point — like a wheel turning.',
    mistakes: [
      'Blocking the shin instead of the knee — must be on the kneecap specifically',
      'Pushing through the block instead of rotating around it',
      'Not creating forward kuzushi first — uke must be off balance toward the blocked knee',
    ],
    combos: [
      'Deashi-harai → Hiza-guruma (sweep misses low, block the knee on the next step)',
      'Hiza-guruma → Ouchi-gari (wheel creates reaction, follow with inner reap)',
    ],
    counters: [
      'Ko-uchi-gari — as tori lifts their blocking foot',
      'Stepping through and turning to avoid the rotation',
    ],
    comp: 'A timing-based technique that works well from circular movement. Less common at elite level but effective as a combination setup. The rotation mechanic is different from all other throws — master it separately.',
  },

  'Kesa-gatame': {
    grips: 'Arm tight around uke\'s neck (close to the head, not wide). Other hand traps uke\'s near arm, pulled up into your armpit. Sit with legs wide, weight down on uke\'s chest.',
    mistakes: [
      'Sitting upright — drop all your weight down, not up',
      'Leaving your head raised — press into uke to prevent the bridge counter',
      'Arm too wide around the neck — must be tight to prevent neck escape',
    ],
    combos: [
      'O-soto-gari → Kesa-gatame (natural landing position after the reap)',
      'Seoi-nage → Kesa-gatame (roll and pin as uke lands)',
    ],
    counters: [
      'Uke bridges into tori — tori must keep weight low and hip-in',
      'Uke rolls away — switch to Kuzure-kesa-gatame to follow',
    ],
    comp: 'Most basic pinning position. 20 seconds = Ippon. Must control the trapped arm — if the elbow escapes, uke rolls out. Keep hips heavy and legs wide for stability.',
  },

  'Kuzure-kesa-gatame': {
    grips: 'Arm under uke\'s armpit (not around neck). Same side hand grabs uke\'s collar or belt. Other arm controls uke\'s near arm. Sit with hip close to uke\'s shoulder.',
    mistakes: [
      'Losing the armpit control — keep elbow deep under the shoulder',
      'Sitting too far from uke\'s body — must be hip-to-shoulder',
      'Allowing uke to create bridge space with their hips',
    ],
    combos: [
      'Seoi-nage landing → Kuzure-kesa-gatame (very natural transition)',
      'Any throw that lands uke on their side — go straight to this hold',
    ],
    counters: [
      'Bridge and roll is harder than basic Kesa — uke must bridge away from tori',
      'Hip escape toward tori\'s back if tori sits high',
    ],
    comp: 'Preferred by many over basic Kesa-gatame — the armpit grip makes the bridge counter harder. Excellent hold-down when uke is on their side after a throw.',
  },

  'Yoko-shiho-gatame': {
    grips: 'Chest on uke\'s chest (perpendicular — 90°). One arm under uke\'s neck, other arm between their legs grabbing the belt. Head presses down on the chest.',
    mistakes: [
      'Lying parallel to uke instead of perpendicular — must be at 90°',
      'Head too high — keep face toward uke\'s stomach to resist the neck arm',
      'Hips too high — post both knees for a wide, low base',
    ],
    combos: [
      'Tai-otoshi landing → Yoko-shiho-gatame (uke lands face-up, go straight to this)',
      'Any forward throw where uke lands flat on their back',
    ],
    counters: [
      'Uke bridges — keep chest pressure down, shift weight to resist',
      'Uke rolls toward tori — transition to Kami-shiho-gatame to follow the roll',
    ],
    comp: 'Most stable pinning position when executed correctly. 20 seconds = Ippon. Post knees wide, keep chest pressure constant. Extremely hard to escape from chest-to-chest.',
  },

  'Kami-shiho-gatame': {
    grips: 'Both arms reach through uke\'s armpits and grip the belt (or trouser leg). Head presses down on the chest/stomach. Spread your weight across uke\'s entire upper body.',
    mistakes: [
      'Head too far up — uke can triangle your neck; keep head low on their chest',
      'Arms reaching too far forward — lose the armpit control',
      'Hips too high — lower your bodyweight, spread it across uke',
    ],
    combos: [
      'Harai-goshi → Kami-shiho-gatame (uke lands face-up, walk around to the top)',
      'O-soto-gari landing — step over uke\'s head to the position',
    ],
    counters: [
      'Uke hip-escapes sideways — follow and transition to Yoko-shiho-gatame',
      'Uke rolls to one side — chase and maintain chest-to-chest contact',
    ],
    comp: 'Best for very flexible opponents who escape side holds. Applies pressure directly down the long axis of the body. Difficult to bridge out of because there\'s no side leverage.',
  },


 
  'Eri-seoi-nage': {
    grips: 'Collar grip on the same-side lapel, sleeve grip on the opposite arm. Drop under with a deep collar grip pulling uke chest-to-chest, sleeve arm drives the elbow up and over.',
    mistakes: ['Not getting the collar grip deep enough — must reach the back of the collar',
      'Staying upright — you must drop low and turn in completely under uke',
      'Losing the sleeve pull — keep tension throughout the entry'],
    combos: ['Ko-uchi-gari -> Eri-seoi-nage (minor reap draws reaction, enter under on the response)',
      'Eri-seoi-nage -> O-soto-gari (failed entry, use momentum to transition outside)'],
    counters: ['Ushiro-goshi — wrap and lift as tori turns in',
      'Sumi-gaeshi — drop under and roll as tori bends forward'],
    comp: 'Popular at junior and senior level. The collar grip bypasses sleeve-lapel grip fighting. Effective against opponents who give a high collar or pull strongly.',
  },

  'Ippon-seoi-otoshi': {
    grips: 'Same as Ippon-seoi-nage but knees hit the mat. Drive the elbow up and over, drop to both knees simultaneously.',
    mistakes: ['Landing on one knee only — both knees must hit the mat together',
      'Dropping too far away from uke — stay tight throughout the drop',
      'Losing the elbow drive — the sleeve arm must stay active all the way down'],
    combos: ['Ko-uchi-gari -> Ippon-seoi-otoshi (sweep creates forward movement, drop under and kneel)',
      'Ippon-seoi-otoshi -> Kami-shiho-gatame (smooth transition on the mat after throw)'],
    counters: ['Step over the dropping tori and apply a strangle from behind',
      'Block the hip and sprawl — prevents the turn-in'],
    comp: 'Excellent when uke has a strong sprawl or posture that prevents a standing seoi. The drop bypasses their defensive base. Common in groundwork transition combinations.',
  },

  'Morote-seoi-otoshi': {
    grips: 'Both arms thread under uke shoulders — sleeve and lapel. Drop to knees and drive both arms upward to tip uke over.',
    mistakes: ['Not getting both arms deep enough under the armpits',
      'Pulling outward instead of up — the drive must be vertical',
      'Dropping too slowly — the movement must be explosive'],
    combos: ['O-uchi-gari -> Morote-seoi-otoshi (break balance backward then drop in front)',
      'Morote-seoi-otoshi -> Tate-shiho-gatame (follow uke down into mount)'],
    counters: ['Ushiro-goshi — wrap uke from behind as they thread the arms',
      'Block the entry with strong posture and a stiff arm'],
    comp: 'Devastating in youth competition where uke is same height. Less effective against taller opponents. Good surprise throw when uke expects a standing entry.',
  },

  'Seoi-nage': {
    grips: 'Standard sleeve-lapel. Turn in fully, drive the lapel elbow up and over the shoulder, pull the sleeve tight into your hip.',
    mistakes: ['Half-turning — you must face the same direction as uke to load correctly',
      'Standing up during the throw — stay low and drive up through the legs',
      'Letting the sleeve arm drop — keep it tight to your hip throughout'],
    combos: ['Ko-uchi-gari -> Seoi-nage (classic: minor reap draws response, turn in fast)',
      'Deashi-harai -> Seoi-nage (sweep misses, use the momentum to enter)'],
    counters: ['Ushiro-goshi — counter as tori bends forward to load',
      'Seoi-nage-gaeshi — redirect and throw back over the same shoulder'],
    comp: 'One of the highest scoring throws at all competition levels. Works on both sides. Most effective when uke pulls you forward.',
  },

  'Seoi-otoshi': {
    grips: 'Same as seoi-nage entry but with a knee drop rather than a hip entry. The lapel arm hooks over and the sleeve pulls tight.',
    mistakes: ['Dropping too far in front of uke — stay underneath them',
      'One-knee drop — must be a controlled two-knee or single-knee depending on variation',
      'Not rotating the shoulder enough to lift uke over'],
    combos: ['Tai-otoshi -> Seoi-otoshi (if uke resists the leg block, drop under for shoulder)',
      'Seoi-otoshi -> Juji-gatame (uke hits mat, attack the near arm immediately)'],
    counters: ['Sumi-gaeshi — uke drops under as tori kneels, rolls through',
      'Sprawl back and attack the back when tori is on the mat'],
    comp: 'Popular as a changeup against opponents who defend standing seoi well. The drop eliminates the hip-loading step.',
  },

  'Tai-otoshi-gaeshi': {
    grips: 'Counter to Tai-otoshi. Catch tori blocking leg and redirect.',
    mistakes: ['Not stepping over the blocking leg during the counter'],
    combos: [],
    counters: [],
    comp: 'Specialist counter drill technique.',
  },

  'Kata-guruma': {
    grips: 'Sleeve grip stays, lapel hand reaches around and between the legs. Load uke across both shoulders like a fireman carry, then tip to one side.',
    mistakes: ['Not getting low enough — must drop below uke hip level',
      'Grabbing the inside of the thigh too high — reach between the legs',
      'Throwing straight down instead of sweeping to the side'],
    combos: ['Ko-uchi-gari -> Kata-guruma (reap drops uke forward, go low for the shoulder load)',
      'Morote-gari -> Kata-guruma (leg grab fails, shift to shoulder carry)'],
    counters: ['Sprawl and take the back when tori reaches for the legs',
      'Guillotine-style grip on the neck as tori bends down'],
    comp: 'Restricted at junior level — check current IJF rules. Very effective in no-gi grappling. Can still be used in certain forms at senior level.',
  },

  'Sukui-nage': {
    grips: 'Release the lapel, reach around the outside of both legs from the rear, scoop and drive forward.',
    mistakes: ['Reaching around the front instead of the rear — must go behind the hips',
      'Not driving the hips forward as you scoop — the hip drive is the throw',
      'Grabbing too high up the thighs'],
    combos: ['O-uchi-gari -> Sukui-nage (inside attack draws weight shift, go for the scoop)',
      'Harai-goshi -> Sukui-nage (failed hip throw, step around and scoop from behind)'],
    counters: ['Block by sitting the hips back and squatting',
      'Grip the belt and sprawl as tori bends'],
    comp: 'Surprise throw — unexpected at most levels. Works against opponents who bend forward heavily. Often appears as a second-attack option.',
  },

  'Te-guruma': {
    grips: 'Both hands grip uke body or belt. Rotate and sweep uke in a wheel-like motion over your extended leg.',
    mistakes: ['Losing the grip midway through the rotation',
      'Not positioning the pivot leg correctly as a fulcrum',
      'Rotating too slowly — must be explosive'],
    combos: ['Te-guruma -> Kami-shiho-gatame (uke lands prone, pin from above)'],
    counters: ['Shift weight to the leg being swept, post and counter'],
    comp: 'Rare in competition — regarded as a specialist throw. Tends to appear in kata rather than randori. Effective at close quarters when a standard grip is broken.',
  },

  'Sumi-otoshi': {
    grips: 'Standard grip. Move uke diagonally backward to the corner — both hands push into the back corner as tori steps to the side.',
    mistakes: ['Pushing straight back instead of diagonally to the corner',
      'Not stepping out to the side to create the angle',
      'Losing grip tension during the diagonal push'],
    combos: ['O-soto-gari -> Sumi-otoshi (major reap is blocked, redirect to the corner)',
      'Ko-soto-gari -> Sumi-otoshi (minor outside sweep transitions to diagonal push)'],
    counters: ['Step around the push and attack from the other side'],
    comp: 'Works as a surprise or combination finish. Not commonly seen but effective against opponents who resist linear attacks by pushing back hard.',
  },

  'Uki-otoshi': {
    grips: 'Sleeve-lapel. Drop one knee to the mat, pull uke directly forward and down over the leading knee.',
    mistakes: ['Not pulling diagonally — the direction must be forward and down at 45 degrees',
      'Standing up to throw instead of staying low',
      'Slow, predictable movement — must create sudden kuzushi first'],
    combos: ['Deashi-harai -> Uki-otoshi (sweep misses, immediately drop and pull forward)'],
    counters: ['Step over the kneeling tori and apply rear strangle'],
    comp: 'One of the oldest nage-waza. Rarely seen in modern competition but excellent in kata. The key is creating genuine kuzushi — without it the technique fails completely.',
  },

  'O-uchi-barai': {
    grips: 'Standard grip. Sweep from inside — the sole of the foot catches the back of uke heel in a large inner circle.',
    mistakes: ['Using the toe instead of the sole of the foot',
      'Sweeping too low — catch the heel not the ankle',
      'No kuzushi before the sweep — must break balance first'],
    combos: ['O-uchi-barai -> Ippon-seoi-nage (sweep shifts uke weight, enter for shoulder throw)'],
    counters: ['Lift the swept foot and reap back with the same leg'],
    comp: 'Variation of inner reaping family. Most effective when uke is moving forward and has weight on the target foot.',
  },

  'Obi-otoshi': {
    grips: 'Belt grip. Pull and tip uke sideways off balance, then drop them to the mat by collapsing their base.',
    mistakes: ['Pulling upward instead of sideways',
      'Gripping the belt too loosely',
      'Not maintaining close body contact'],
    combos: [],
    counters: ['Spread the legs and lower the base to resist the belt pull'],
    comp: 'Niche technique. Mainly appears when a belt grip opportunity arises during a scramble or grip fight.',
  },

  'Kibisu-gaeshi': {
    grips: 'Release standard grip — reach down and grab the heel with one or both hands, pull the heel directly up and back.',
    mistakes: ['Reaching too slowly — must shoot for the heel in one motion',
      'Pulling the heel forward instead of up and back',
      'Telegraphing the shot by looking down first'],
    combos: ['Ko-uchi-gari -> Kibisu-gaeshi (reap misses, slide down to the heel)'],
    counters: ['Jump the foot back and sprawl to avoid the heel grab'],
    comp: 'Effective against opponents who stand with a wide stance. Often used as a desperation or surprise technique. Very popular in wrestling-influenced judo styles.',
  },

  'Kuchiki-taoshi': {
    grips: 'One hand grips the collar, the other shoots down to the ankle. Pull the ankle up while driving forward.',
    mistakes: ['Grabbing too high on the shin — must catch the ankle',
      'Not driving through with the body weight',
      'Stopping halfway — commit fully to the leg pull'],
    combos: ['Harai-goshi -> Kuchiki-taoshi (hip throw blocked, drop for the single leg)'],
    counters: ['Hop the targeted leg back and counter-attack',
      'Guillotine as tori drives their head into your body'],
    comp: 'Subject to IJF rule restrictions — check current rules regarding single leg attacks. Effective in submission grappling contexts.',
  },

  'Morote-gari': {
    grips: 'Both hands reach around and behind both thighs simultaneously. Drive forward and down.',
    mistakes: ['Reaching for both legs instead of shooting in close first',
      'Driving sideways instead of forward through uke',
      'Not keeping head up during the shot'],
    combos: ['O-soto-gari -> Morote-gari (outside attack draws weight shift, shoot for double legs)'],
    counters: ['Sprawl — throw hips back and drive chest onto tori head',
      'Guillotine from the front as tori shoots'],
    comp: 'Restricted or banned in some IJF competition formats — check rules. Highly effective in MMA and wrestling. Common at junior international level.',
  },

  'Tsubame-gaeshi': {
    grips: 'Standard. Perform Deashi-harai — if blocked, immediately reverse the sweep direction on the same foot.',
    mistakes: ['Hesitating between the first and second sweep — must be one fluid reversal',
      'Trying this without a committed first sweep — the counter only works if uke reacts',
      'Poor foot position on the reversal — sole must be flat for the return sweep'],
    combos: ['Tsubame-gaeshi -> Okuri-ashi-harai (reverse sweep sets up double sweep)'],
    counters: [],
    comp: 'A reflex combination throw. Practise with a partner who blocks deashi-harai consistently. Devastating when the timing is right because uke commits weight into the counter.',
  },

  'Yama-arashi': {
    grips: 'High collar grip pulling uke forward and diagonally. Similar entry to seoi-nage but with a large sweeping leg action.',
    mistakes: ['Not pulling uke far enough forward before the leg sweep',
      'Weak collar grip — the pull direction drives the whole throw',
      'Sweeping too early before uke is off balance'],
    combos: ['Ko-uchi-gari -> Yama-arashi (minor reap creates kuzushi, then enter with high collar)'],
    counters: ['Lower the hips and base against the pull'],
    comp: 'Associated with Jigoro Kano. Rare in competition but spectacular when it works. Most effective against opponents with upright posture who grip high.',
  },

  'O-tsuri-goshi': {
    grips: 'Deep belt or jacket grip around the back. Pull uke in very close, load them on the hip and lever upward and forward.',
    mistakes: ['Not getting the belt grip deep enough around the back',
      'Standing next to uke instead of turning in fully under them',
      'Lifting without the turn — both the lift and the rotation must combine'],
    combos: ['O-goshi -> O-tsuri-goshi (shallow hip throw becomes deep belt grip variation)'],
    counters: ['Base wide and keep hips away from tori hip loading',
      'Ushiro-goshi as tori turns in'],
    comp: 'Excellent when belt grip is obtained. Often occurs in scrambles. Less grip-fight dependent than sleeve-lapel throws.',
  },

  'Tsuri-goshi': {
    grips: 'Same-side hand grips the belt at the back. Turn in, lift with the belt grip, sweep uke over the hip.',
    mistakes: ['Belt grip is too low on the back — reach higher',
      'Not turning in completely under uke centre of gravity',
      'Relying on arm strength rather than hip and leg drive'],
    combos: ['O-uchi-gari -> Tsuri-goshi (inner reap shifts weight, go for the belt and turn in)'],
    counters: ['Ushiro-goshi — step in behind and lift as tori loads'],
    comp: 'Classic koshi-waza. The belt grip makes it more reliable against opponents who defend standard grip throws. Good in a clinch.',
  },

  'Koshi-guruma': {
    grips: 'Lapel hand wraps around uke neck rather than gripping the collar. Sleeve grip stays standard. Turn in and wheel uke over the hip.',
    mistakes: ['Gripping the neck too tightly — it is a guiding wrap not a strangle',
      'Not turning in close enough — the hip must connect with uke hip',
      'Pulling uke head down instead of forward and around'],
    combos: ['O-uchi-gari -> Koshi-guruma (reap draws forward, wrap neck and turn in)',
      'Ko-uchi-gari -> Koshi-guruma (standard combination)'],
    counters: ['Duck under the neck wrap and counter',
      'Ushiro-goshi as the neck wrap is applied'],
    comp: 'Works well against opponents who defend hip throws by pulling away. The neck wrap controls uke upper body more firmly than a standard lapel grip.',
  },

  'Uki-goshi': {
    grips: 'Same-side hand wraps around uke waist or hip. Sleeve grip controls the arm. Light hip contact rotates uke over.',
    mistakes: ['Heavy hip contact — this throw uses a floating hip, not a loaded hip',
      'Pulling the sleeve too far instead of rotating the body',
      'Standing beside uke instead of turning in front'],
    combos: ['O-soto-gari -> Uki-goshi (outside attack forces uke to step in, rotate over the hip)'],
    counters: ['Lower hips and block the waist wrap'],
    comp: 'One of the original Kodokan techniques. More commonly seen in kata than competition. The floating hip action is distinct from O-goshi and requires precise distance control.',
  },

  'Utsuri-goshi': {
    grips: 'Counter to a hip throw. As uke loads onto their hip, tori lifts them, steps around, and throws in the opposite direction.',
    mistakes: ['Lifting too late — must catch uke mid-load before they commit',
      'Not stepping completely to the other side',
      'Weak lift — must fully raise uke off the mat'],
    combos: ['Utsuri-goshi -> Kami-shiho-gatame (uke lands prone after the counter throw)'],
    counters: [],
    comp: 'A pure counter technique. Practise the reflex response to O-goshi and Harai-goshi entries. Requires timing rather than strength.',
  },

  'Sode-tsurikomi-goshi': {
    grips: 'Both sleeves gripped at the cuff. Lift both sleeves, turn in, and rotate uke over the hip using sleeve control.',
    mistakes: ['Gripping the sleeve mid-arm instead of the cuff',
      'Pulling outward with both arms instead of lifting and rotating',
      'Not turning in close enough to uke'],
    combos: ['Sode-tsurikomi-goshi -> Juji-gatame (uke lands on arm — attack immediately)'],
    counters: ['Drop the hips and resist the sleeve pull',
      'Step to the side of the entry direction'],
    comp: 'Favoured by judoka who prefer double-sleeve control. Neutralises opponents with strong collar grips. Used extensively by some Eastern European and Japanese internationals.',
  },

  'Ashi-guruma': {
    grips: 'Standard sleeve-lapel. Sweep the leg in a large circular motion using the calf or shin across uke thigh or knee.',
    mistakes: ['Using the foot instead of the full leg as the sweeping surface',
      'Not turning in enough — the body must face the throw direction',
      'Sweeping too low on the shin instead of across the thigh'],
    combos: ['Harai-goshi -> Ashi-guruma (hip throw blocked, lower sweep instead)',
      'Tai-otoshi -> Ashi-guruma (body drop entry transitions to wheel sweep)'],
    counters: ['Lift the swept leg and attack inside with Ko-uchi-gari'],
    comp: 'Often confused with O-guruma. The distinction is the sweep point. Works best when uke has a wide stance.',
  },

  'Hiza-guruma': {
    grips: 'Standard. Pull uke forward onto their toes — place the sole of the foot flat against the outside of uke knee, then rotate.',
    mistakes: ['Using the toes instead of the flat sole of the foot',
      'Pushing the knee instead of placing and rotating',
      'Not pulling uke forward onto their toes first'],
    combos: ['Deashi-harai -> Hiza-guruma (level changes from ankle to knee)',
      'Sasae-tsurikomi-ashi -> Hiza-guruma (same foot action, different target point)'],
    counters: ['Step the blocked leg back and reap the other leg'],
    comp: 'A classical ashi-waza technique. Very effective in kata. In competition, works when uke is moving forward and the weight is on the target knee.',
  },

  'Harai-tsurikomi-ashi': {
    grips: 'Standard. Tsurikomi action — lift the lapel and pull the sleeve simultaneously. The sweep catches the front of the ankle as uke steps.',
    mistakes: ['Sweeping too late — must catch the foot as it lands, not after',
      'Not combining the tsurikomi lift with the sweep',
      'Sweeping the shin instead of the ankle'],
    combos: ['Deashi-harai -> Harai-tsurikomi-ashi (change the side of attack)',
      'Harai-tsurikomi-ashi -> Okuri-ashi-harai (double foot sweep sequence)'],
    counters: ['Hop the target foot back before the sweep lands'],
    comp: 'Part of the third group (Sankyo) of the Gokyo. Works with good timing when uke is stepping forward. Popular in kata competition.',
  },

  'Ko-soto-gake': {
    grips: 'Standard or collar tie. Hook the back of uke heel with your heel and lean body weight forward and through.',
    mistakes: ['Using the toes to hook instead of the heel',
      'Not pressing chest-to-chest to load uke',
      'Hooking without forward drive — must combine hook and forward pressure'],
    combos: ['Ko-soto-gari -> Ko-soto-gake (sweep misses, immediately hook and drive)',
      'O-uchi-gari -> Ko-soto-gake (inner attack draws step, catch the outside ankle)'],
    counters: ['Step the hooked foot forward away from the hook'],
    comp: 'Good at close quarters when a full throw is not possible. Works in a clinch or chest-to-chest position when uke is squared up.',
  },

  'Ko-soto-gaeshi': {
    grips: 'Counter to Ko-soto-gari. As tori sweeps, post the foot and redirect their momentum back.',
    mistakes: ['Reacting after the sweep lands — must post before losing balance',
      'Pulling in the wrong direction — redirect, do not just resist'],
    combos: [],
    counters: [],
    comp: 'Reflex counter. Train as a pair drill where uke always counters Ko-soto-gari.',
  },

  'Ko-uchi-gake': {
    grips: 'Standard. Hook the inside of uke ankle with the back of your calf, then drive forward.',
    mistakes: ['Hooking too high on the calf instead of at the ankle',
      'Not driving with the body — arm strength alone will not work'],
    combos: ['Ko-uchi-gari -> Ko-uchi-gake (reap misses, immediately hook and drive forward)'],
    counters: [],
    comp: 'Close-range technique. Most effective in a forward-moving exchange or when uke steps in to attack.',
  },

  'Ko-uchi-gaeshi': {
    grips: 'Counter to Ko-uchi-gari. As tori reaches for the inside ankle, post and throw back.',
    mistakes: ['Waiting too long — must react as soon as the sweep begins',
      'Falling backward instead of controlling the counter direction'],
    combos: [],
    counters: [],
    comp: 'Pure counter. Practise as a reflex drill specifically against Ko-uchi-gari.',
  },

  'Ko-uchi-makikomi': {
    grips: 'Same as Ko-uchi-gari setup but tori wraps the arm around uke arm and falls into them, rolling the throw.',
    mistakes: ['Not wrapping the arm tightly before the fall',
      'Falling to the side instead of rotating forward over uke'],
    combos: ['Ko-uchi-gari -> Ko-uchi-makikomi (reap blocked, wrap and roll)'],
    counters: ['Step back from the wrap and let tori fall forward alone'],
    comp: 'Effective surprise move when a standard Ko-uchi-gari is blocked. Lands uke on their back with tori on top — good transition to ne-waza.',
  },

  'O-soto-gaeshi': {
    grips: 'Counter to O-soto-gari. As tori reaps, hook over their reaping leg and throw them to the rear.',
    mistakes: ['Not hooking tori reaping leg — must catch it at its highest point',
      'Reacting too late — must feel the reap and respond instantly'],
    combos: [],
    counters: [],
    comp: 'A classic competition counter. Drill as a reflex against O-soto-gari attacks. Effective because tori is already committing their weight.',
  },

  'O-soto-makikomi': {
    grips: 'O-soto-gari entry but tori wraps the lapel arm around uke arm and falls into the reap.',
    mistakes: ['Falling sideways instead of rotating through uke',
      'Loose arm wrap — must trap uke arm tightly'],
    combos: ['O-soto-gari -> O-soto-makikomi (standard reap blocked, wrap and roll)'],
    counters: ['Step inside as tori wraps — attack O-uchi-gari'],
    comp: 'When O-soto-gari is consistently blocked, the makikomi variation surprises. Good way to score ippon when a standard reap only scores waza-ari.',
  },

  'O-soto-otoshi': {
    grips: 'Both hands grip uke same side. Step to the side and drop uke straight down rather than reaping.',
    mistakes: ['Reaping instead of dropping — O-soto-otoshi is a drop, not a sweep',
      'Not getting to uke side before the drop'],
    combos: ['O-soto-gari -> O-soto-otoshi (transition from reap to drop when leg is blocked)'],
    counters: [],
    comp: 'Variation of O-soto that surprises defenders. Often used as a changeup against opponents who step back against the standard reap.',
  },

  'O-soto-guruma': {
    grips: 'Standard. Reap both of uke legs simultaneously with the back of your leg — a large double-leg reap.',
    mistakes: ['Only catching one leg — must drive through both simultaneously',
      'Not breaking balance backward first',
      'Stopping the reap halfway — drive all the way through'],
    combos: ['O-soto-gari -> O-soto-guruma (single reap transitions to double when uke steps)'],
    counters: [],
    comp: 'High-scoring when it lands. Effective against opponents with a wide stance. The double reap is hard to defend.',
  },

  'O-uchi-gaeshi': {
    grips: 'Counter to O-uchi-gari. Post the foot against tori reap and throw them back.',
    mistakes: ['Not posting before losing balance',
      'Pulling in the wrong direction on the counter'],
    combos: [],
    counters: [],
    comp: 'Reflex counter — drill specifically against O-uchi-gari. Effective because tori is leaning forward to reap.',
  },

  'Okuri-ashi-harai': {
    grips: 'Standard. Move laterally with uke — as both feet come together in a side step, sweep both feet at the same moment.',
    mistakes: ['Sweeping one foot instead of catching both as they close',
      'Being out of sync with uke movement — must move with them',
      'Sweeping too early or too late in the step cycle'],
    combos: ['Deashi-harai -> Okuri-ashi-harai (first sweep draws step response, double sweep)'],
    counters: ['Stop moving and base wide to resist the side-step sweep'],
    comp: 'A timing throw — it only works when tori is in perfect sync with uke lateral movement. Drilling with a partner moving in circles is essential.',
  },

  'Tani-otoshi': {
    grips: 'Come behind uke. One hand blocks the hip, the other grips the collar or belt from behind. Sit out behind and throw uke backward over your extended leg.',
    mistakes: ['Not extending the leg far enough back as a block',
      'Sitting straight down instead of diagonally behind uke',
      'Gripping too high on uke — must control the hip or belt'],
    combos: ['Harai-goshi -> Tani-otoshi (step around hip throw attempt and attack from behind)'],
    counters: [],
    comp: 'A counter and surprise attack. Particularly effective against forward-leaning opponents. Often appears when tori steps to the rear of uke during a scramble.',
  },

  'Yoko-gake': {
    grips: 'Standard. Step to the side, hook uke ankle with the sole of your foot, and fall sideways, pulling uke down with you.',
    mistakes: ['Not catching the ankle before falling — the hook and fall must be simultaneous',
      'Falling straight down instead of to the side',
      'Holding on instead of pulling uke into the fall'],
    combos: ['Deashi-harai -> Yoko-gake (sweep misses, step out and fall into ankle hook)'],
    counters: ['Step back and let tori fall without you'],
    comp: 'A sacrifice throw. Effective as a surprise element or when a conventional sweep is consistently blocked. The fall can open ne-waza.',
  },

  'Yoko-otoshi': {
    grips: 'Standard. Drop to the side, hook uke legs at the ankle with your lower leg, and pull them sideways to the mat.',
    mistakes: ['Dropping too far away from uke legs',
      'Not hooking both legs — must contact both ankles',
      'No kuzushi before dropping — must break balance first'],
    combos: ['Harai-goshi -> Yoko-otoshi (hip throw fails, drop to the side)'],
    counters: ['Step over the falling tori body'],
    comp: 'Sutemi-waza — a sacrifice throw. Higher risk but good surprise value. Creates immediate ne-waza opportunity.',
  },

  'Yoko-wakare': {
    grips: 'Standard. Drop diagonally under and to the side of uke — pulling them over you as you fall.',
    mistakes: ['Not pulling uke over as you fall — the pull is what makes the throw',
      'Falling straight back instead of to the side',
      'Falling too far from uke'],
    combos: ['Ko-uchi-gari -> Yoko-wakare (reap attacks, drop under and pull)'],
    counters: ['Step over tori as they fall'],
    comp: 'Rare but spectacular. A sacrifice throw that can be set up off a failed attack.',
  },

  'Yoko-guruma': {
    grips: 'Step around uke — reach under and around. Pull uke into a rolling wheel over your body as you drop to the side.',
    mistakes: ['Not rotating fully — must commit to the rolling action',
      'Dropping straight down instead of rolling through'],
    combos: ['O-goshi -> Yoko-guruma (hip throw fails, step around and roll)'],
    counters: [],
    comp: 'Sutemi-waza. Very creative and effective when landed. Difficult to drill out of context — needs a committed setup.',
  },

  'Sumi-gaeshi': {
    grips: 'Standard or modified. Drop backward — place your foot in uke hip or groin, roll back and kick upward to throw uke over.',
    mistakes: ['Placing the foot on the stomach instead of the hip/inner thigh',
      'Rolling back without enough pull on uke upper body',
      'Kicking before uke is pulled into the right position'],
    combos: ['O-goshi -> Sumi-gaeshi (tori grabs for hip throw, uke drops under and rolls)',
      'Tsurikomi-goshi -> Sumi-gaeshi (hip throw resisted, drop and roll through)'],
    counters: [],
    comp: 'Can be attack or counter. Excellent as a counter to hip throws. Creates immediate ne-waza because both judoka end up on the mat.',
  },

  'Tomoe-nage': {
    grips: 'Standard. Drop directly backward — place one foot in uke stomach, roll back and kick up to throw uke forward over your head.',
    mistakes: ['Placing the foot too low on the stomach — must be in the belt area',
      'Not rolling back far enough',
      'Losing the grip as you kick up'],
    combos: ['O-soto-gari -> Tomoe-nage (attack outside, uke resists by pushing into you — drop and kick)'],
    counters: ['Sprawl and avoid the backward drop',
      'Step over the foot placement'],
    comp: 'High-risk, high-reward. Often used to counter aggressive forward pressure. The landing frequently creates armlock or hold-down opportunities.',
  },

  'Hikikomi-gaeshi': {
    grips: 'Belt grip, drop to the floor and pull uke on top — then roll them over.',
    mistakes: ['Not rolling all the way through — must complete the rotation',
      'Pulling straight down instead of over and past'],
    combos: [],
    counters: [],
    comp: 'Sacrifice technique involving a seated or backward drop. Used when in a very close clinch. Can lead directly to ne-waza.',
  },

  'Tawara-gaeshi': {
    grips: 'Bear-hug from the front or back. Lift and tip uke sideways like a bale of straw.',
    mistakes: ['Not getting the arms fully around uke before the lift',
      'Tipping to the front instead of the side'],
    combos: [],
    counters: ['Sprawl and drop the hips to prevent the lift'],
    comp: 'Unusual technique most common in kata or as a desperation move. Good when a bear-hug occurs in a scramble.',
  },

  'Hane-makikomi': {
    grips: 'Harai-goshi or Hane-goshi entry — wrap the lapel arm around uke arm and fall into the throw.',
    mistakes: ['Loose arm wrap — must trap uke arm firmly before the fall',
      'Falling to the wrong side'],
    combos: ['Hane-goshi -> Hane-makikomi (standard spring blocked, wrap and roll)'],
    counters: [],
    comp: 'The makikomi variation is used when the standard spring throw is consistently blocked. Common at international level.',
  },

  'Harai-makikomi': {
    grips: 'Harai-goshi entry but wrap uke arm and fall into a rolling finish.',
    mistakes: ['Losing the arm wrap on entry',
      'Not driving the hip through before wrapping'],
    combos: ['Harai-goshi -> Harai-makikomi (hip throw blocked, wrap and roll)'],
    counters: [],
    comp: 'High-level combination. Frequently seen when uke defends Harai-goshi by pulling their arm away.',
  },

  'Uchi-makikomi': {
    grips: 'Wrap the sleeve arm around uke arm from the inside — fall forward and rotate uke over.',
    mistakes: ['Wrapping too loosely — the arm trap must be firm',
      'Not rotating through uke centre'],
    combos: ['O-uchi-gari -> Uchi-makikomi (reap misses, wrap inside arm and roll)'],
    counters: [],
    comp: 'A makikomi (winding throw) variation. Effective as a surprise and creates a tight clinch that often leads to ne-waza.',
  },

  'Soto-makikomi': {
    grips: 'Wrap the outside of uke arm — fall into a rolling throw to the outside.',
    mistakes: ['Not wrapping tightly enough before the fall',
      'Falling backward instead of rotating forward'],
    combos: ['O-soto-gari -> Soto-makikomi (outside reap, switch to outside wrap and roll)'],
    counters: [],
    comp: 'Similar mechanics to O-soto-makikomi. Falls to the outside of uke. Good transition when a standard outside attack is blocked.',
  },

  'Daki-wakare': {
    grips: 'Bear-hug from behind — lift and tip uke over to the side.',
    mistakes: ['Not lifting high enough before the tip',
      'Tipping forward instead of sideways'],
    combos: [],
    counters: ['Drop the hips and squat to resist the lift'],
    comp: 'Rare in competition. Occasionally seen in heavy weight divisions during chest-to-chest scrambles.',
  },

  'Daki-age': {
    grips: 'Lift uke completely off the mat in a bear-hug and drop them.',
    mistakes: ['Not getting the hips under uke centre of mass to generate the lift'],
    combos: [],
    counters: ['Sprawl immediately when tori wraps'],
    comp: 'Restricted in IJF competition (illegal to lift and slam). Still seen in some formats. Demonstrably effective in MMA contexts.',
  },

  'Kani-basami': {
    grips: 'Scissors throw — fall to the side, one leg hooks uke chest or hip, the other hooks the legs. Scissor action throws uke.',
    mistakes: ['Not catching both target points simultaneously',
      'Weak scissoring action — must apply both legs with force'],
    combos: [],
    counters: ['Jump both feet away from the scissor attempt'],
    comp: 'BANNED in IJF competition due to injury risk at the knee. Legal in some other rulesets. Train with caution — controlled environment only.',
  },

  'Kawazu-gake': {
    grips: 'Hook one of uke legs from outside and fall backward, taking uke with you.',
    mistakes: ['Not hooking firmly enough before the fall',
      'Falling straight back instead of at an angle'],
    combos: [],
    counters: ['Hop the hooked leg out of the grip'],
    comp: 'ILLEGAL in IJF competition due to knee injury risk. Legal in kata. Handle with care in randori.',
  },

  'Ura-nage': {
    grips: 'Wrap both arms around uke from the front or side. Arch backward and throw uke over your head.',
    mistakes: ['Not arching far enough backward',
      'Losing the grip during the arch',
      'Starting the arch before uke is off balance'],
    combos: ['Seoi-nage -> Ura-nage (uke turns into seoi, wrap and arch backward)'],
    counters: [],
    comp: 'Spectacular throw often seen as a counter to hip and shoulder throws. Very high ippon rate when landed. Requires full commitment.',
  },

  'Ushiro-goshi': {
    grips: 'Counter to O-goshi or similar hip throws. Wrap uke from behind as they load onto their hip, lift and throw them sideways.',
    mistakes: ['Wrapping too late — must catch uke mid-load',
      'Lifting without stepping around first',
      'Not fully rotating through the throw after the lift'],
    combos: ['O-goshi -> Ushiro-goshi (uke enters for hip throw, wrap from behind and counter)'],
    counters: [],
    comp: 'Classic counter to koshi-waza. Difficult to time but decisive. Most effective against large, committed hip throw entries.',
  },

  'Hane-goshi-gaeshi': {
    grips: 'Counter to Hane-goshi. Catch tori spring leg and throw them over their own leg.',
    mistakes: ['Not catching the spring leg early enough',
      'Pulling backward instead of over'],
    combos: [],
    counters: [],
    comp: 'Reflex counter. Drill specifically against Hane-goshi attacks.',
  },

  'Harai-goshi-gaeshi': {
    grips: 'Counter to Harai-goshi. As tori sweeps, post the foot and redirect.',
    mistakes: ['Reacting after the sweep has landed',
      'Not redirecting — must change the direction of momentum'],
    combos: [],
    counters: [],
    comp: 'Reflex counter. Practise as a pair drill.',
  },

  'O-guruma': {
    grips: 'Standard. Sweep with the back of the full leg (not the reaping hook) across uke thigh — like a large wheel.',
    mistakes: ['Bending the sweeping leg — must keep it fully extended',
      'Targeting the lower leg instead of the thigh',
      'Not breaking balance forward enough before the wheel sweep'],
    combos: ['Tai-otoshi -> O-guruma (body drop entry, raise the leg contact to the thigh)'],
    counters: [],
    comp: 'Often confused with Ashi-guruma. O-guruma contacts the thigh with the full extended leg. High amplitude throw — spectacular when landed.',
  },

  'Uki-goshi-gaeshi': {
    grips: 'Counter to Uki-goshi. Block the hip wrap and redirect.',
    mistakes: ['Reacting too late — must feel the entry and respond immediately'],
    combos: [],
    counters: [],
    comp: 'Specialist counter. Practise as a reaction drill against Uki-goshi.',
  },

  'Uki-waza': {
    grips: 'Standard. Drop to one knee or hip at the side of uke, pull them directly forward and over your body.',
    mistakes: ['Not pulling at a low enough angle',
      'Dropping too far from uke — must stay connected'],
    combos: [],
    counters: ['Step over the dropping tori'],
    comp: 'Sacrifice throw. Good counter to forward rushes and grip attacks. Landing often creates ne-waza opportunities.',
  },

  'Ko-soto-gari': {
    grips: 'Standard sleeve-lapel. Step to the outside, sweep the back of uke heel with the sole of your foot.',
    mistakes: ['Using the toes instead of the sole — this is a sweep, not a kick',
      'Not pulling uke weight onto the target foot first',
      'Sweeping too high on the calf instead of catching the heel'],
    combos: ['Ko-soto-gari -> O-uchi-gari (outside sweep sets up inner reap)',
      'O-uchi-gari -> Ko-soto-gari (inner attack draws the step, sweep outside foot)'],
    counters: ['Ko-soto-gaeshi — post the foot and redirect',
      'Lift the target foot back before the sweep lands'],
    comp: 'Excellent in combination. Very common at all competition levels. Most effective when uke steps backward or has weight on the outside foot.',
  },

  'Yoko-tomoe-nage': {
    grips: 'Standard or modified. Drop to the side rather than directly back — place the foot in uke hip and roll through at an angle.',
    mistakes: ['Dropping straight back instead of to the side',
      'Not directing uke over the angled throw path'],
    combos: ['Tomoe-nage -> Yoko-tomoe-nage (mix angles to bypass uke defences)'],
    counters: [],
    comp: 'Variation of Tomoe-nage that catches opponents who have learned to sprawl against the direct backward version.',
  },

  'Yoko-sumi-gaeshi': {
    grips: 'Modified. Drop to the side rather than directly backward for the Sumi-gaeshi rolling action.',
    mistakes: ['Not angling the drop sufficiently to the side'],
    combos: [],
    counters: [],
    comp: 'Variation of Sumi-gaeshi with an angled drop. Useful when a direct drop is telegraphed.',
  },

  'Obi-tori-gaeshi': {
    grips: 'Belt grip from the rear. Drop backward while maintaining the belt grip, rolling uke over.',
    mistakes: ['Releasing the belt grip during the drop',
      'Not rotating through fully'],
    combos: [],
    counters: [],
    comp: 'Rear sacrifice throw using belt grip. Unusual — most effective in a rear clinch scramble.',
  },

  'Uchi-mata-gaeshi': {
    grips: 'Counter to Uchi-mata. Catch tori lifting leg and throw them back.',
    mistakes: ['Not catching the leg early in the lift',
      'Pulling backward instead of redirecting diagonally'],
    combos: [],
    counters: [],
    comp: 'High-level counter frequently seen at international competition. Drill as a reflex against committed Uchi-mata attacks.',
  },

  'Uchi-mata-sukashi': {
    grips: 'Counter to Uchi-mata. Step the targeted leg away and throw tori forward as they miss.',
    mistakes: ['Moving the leg too slowly — must clear before tori leg makes contact',
      'Not following up immediately with a throw as tori overcommits'],
    combos: [],
    counters: [],
    comp: 'A slip-and-score counter. Very effective at elite level because Uchi-mata is so common. Requires excellent timing.',
  },

  'Uchi-mata-makikomi': {
    grips: 'Uchi-mata entry — wrap uke arm and fall into a rolling finish.',
    mistakes: ['Losing the arm wrap before the roll',
      'Not driving the lifting leg high enough first'],
    combos: ['Uchi-mata -> Uchi-mata-makikomi (inner thigh throw blocked, wrap and roll)'],
    counters: [],
    comp: 'Common at senior level when the standard Uchi-mata is consistently blocked. The makikomi secures ippon when a normal throw scores only waza-ari.',
  },

  'Tate-shiho-gatame': {
    grips: 'Mounted position. Chest on uke chest. Hook both feet inside uke thighs. Control the head and near arm.',
    mistakes: ['Riding too high on the chest — hips should be low near uke belt',
      'Hooking the outside of the thighs instead of inside',
      'Neglecting uke arm control — they will bridge and roll'],
    combos: ['Juji-gatame from Tate-shiho-gatame — when uke pushes the arm up',
      'Kata-ha-jime from Tate-shiho-gatame — when uke turns in'],
    counters: ['Bridge and roll — bridge strongly toward the control side',
      'Clamp and roll — trap one arm and roll toward it'],
    comp: 'Full mount is the dominant position in ne-waza. Score osaekomi at 5 seconds for waza-ari, 10 seconds for ippon. Essential to control from here.',
  },

  'Kuzure-yoko-shiho-gatame': {
    grips: 'Modified Yoko-shiho-gatame — one arm controls uke near arm differently, often with an underhook rather than between the legs.',
    mistakes: ['Allowing the hips to lift off uke',
      'Leaving the arm position loose — must have a firm underhook or over-hook'],
    combos: ['Kuzure-yoko-shiho-gatame -> Ude-garami when uke extends the near arm'],
    counters: ['Bridge and turn away from the control side'],
    comp: 'Frequently occurs naturally in randori. The kuzure (modified) version is often easier to maintain than the classical form.',
  },

  'Kami-shiho-gatame': {
    grips: 'Lie behind uke head — both arms reach under their arms and grip the belt. Drive chest into uke face area.',
    mistakes: ['Gripping too low on the belt — reach around and into the back of the belt',
      'Sitting up too high — hips must be down to prevent bridging escapes',
      'Not hooking uke arms — they will push off your chest'],
    combos: ['Juji-gatame from Kami-shiho-gatame when uke pushes on your chest',
      'Sankaku-jime if uke rolls to their side to escape'],
    counters: ['Bridge straight up and pull arms through to sit up',
      'Escape from Kami-shiho-gatame: action and reaction — bridge and roll to the side'],
    comp: 'Head control pin. Often occurs naturally after big throws. Very effective because uke cannot use their full strength against it.',
  },

  'Kuzure-kami-shiho-gatame': {
    grips: 'Modified Kami-shiho-gatame — one arm controls the belt, the other controls uke arm differently or goes under the armpit.',
    mistakes: ['Releasing the head-area control',
      'Hips too high — must stay heavy and low'],
    combos: ['Kuzure-kami-shiho-gatame -> Juji-gatame when uke straightens the far arm'],
    counters: ['Roll toward the lighter control side'],
    comp: 'Variation that can be more comfortable to maintain. Often preferred by judoka with longer torsos.',
  },

  'Mune-gatame': {
    grips: 'Side chest control — chest on chest, perpendicular. One arm goes under the neck, other controls uke near arm.',
    mistakes: ['Chest contact is too loose — must feel tori weight on them',
      'Hips too far from uke — creates space for escape',
      'Ignoring the far arm — uke will push off'],
    combos: ['Mune-gatame -> Kata-gatame when uke pushes the near arm into the neck area'],
    counters: ['Bridge toward tori head and roll',
      'Create frame with both arms and push tori chest away'],
    comp: 'A solid intermediate hold. Frequently occurs after throws to the uke front or side. Slightly less secure than Kesa-gatame but good for transitions.',
  },

  'Kata-gatame': {
    grips: 'Uke near arm is trapped between tori head and uke own neck. Tori grips hands together to complete the hold and choke simultaneously.',
    mistakes: ['Not pinning uke arm against their own neck — must trap the arm tightly',
      'Head not pressing uke arm down firmly',
      'Hips too far away — maintain hip-to-hip contact'],
    combos: ['Kesa-gatame -> Kata-gatame when uke pushes the near arm up'],
    counters: ['Pull the trapped arm out before it is fully locked',
      'Bridge and roll toward the pinned arm side'],
    comp: 'Also functions as a choke (Kata-gatame jime). Often uke taps to the hold before realising it is also a strangle. Very high submission rate at lower grades.',
  },

  'Hon-kesa-gatame': {
    grips: 'Classic scarf hold. Sit beside uke, control head under armpit, grip uke far arm at the wrist. Hips on the mat, legs spread for base.',
    mistakes: ['Gripping the sleeve instead of the wrist — must control right at the wrist',
      'Legs too close together — spread wide for base and stability',
      'Sitting upright instead of leaning toward uke head'],
    combos: ['Kesa-gatame -> Juji-gatame when uke extends the near arm to push',
      'Kesa-gatame -> Kata-gatame when uke pushes up with the trapped arm'],
    counters: ['Roll toward tori and get to knees',
      'Bridge and roll tori over the head side'],
    comp: 'The fundamental scarf hold. Every judoka should master this position. Very hard to escape from correctly applied Kesa-gatame.',
  },

  'Ushiro-kesa-gatame': {
    grips: 'Reverse scarf hold — tori sits facing away from uke head. Control uke near arm behind tori back.',
    mistakes: ['Not controlling the near arm tightly enough',
      'Sitting too far up toward uke shoulders'],
    combos: ['Ushiro-kesa-gatame -> Ude-garami when uke bends the arm'],
    counters: ['Sit up toward tori hips and roll'],
    comp: 'Less commonly taught but effective after certain throws that land uke in a specific position. Creates direct armlock opportunities.',
  },

  'Sankaku-gatame': {
    grips: 'Triangle hold — legs lock around uke neck and one arm in a triangle shape. No strangle applied — pure body hold.',
    mistakes: ['Not locking the triangle tightly enough',
      'Allowing the hips to be flat on the mat — angle them to maintain control'],
    combos: ['Sankaku-gatame -> Sankaku-jime (convert to strangle by adjusting leg lock)',
      'Sankaku-gatame -> Juji-gatame (pull the trapped arm into an armlock)'],
    counters: ['Stack tori and drive forward to relieve pressure'],
    comp: 'Powerful holding and transitioning position. Once the triangle is locked, osaekomi can be scored and joint locks or strangles threatened simultaneously.',
  },

  'Hadaka-jime': {
    grips: 'Rear naked choke — one forearm crosses uke throat, the other hand cups the back of the head.',
    mistakes: ['Pressing the wrist bone into the throat instead of the forearm',
      'Not pulling the elbow to uke centre-line',
      'Allowing uke to tuck their chin before the grip is set'],
    combos: ['Tate-shiho-gatame -> Hadaka-jime when uke rolls forward',
      'Take the back -> Hadaka-jime immediately'],
    counters: ['Tuck chin and grab tori wrist before the grip is set',
      'Bridge and roll to break the rear body lock first'],
    comp: 'Highest submission rate strangle in judo. Once both hands are locked in, uke has seconds before unconsciousness. Practise securing rear position first.',
  },

  'Okuri-eri-jime': {
    grips: 'Sliding lapel strangle — reach across with one hand and grip the far lapel, slide it across the throat while the other hand pushes the near lapel.',
    mistakes: ['Not pulling uke back into you before applying the strangle',
      'Crossing the arms instead of sliding one lapel across',
      'Allowing uke head to come forward breaking the choke angle'],
    combos: ['Kami-shiho-gatame -> Okuri-eri-jime when uke bridges and creates lapel access',
      'Rear position -> Okuri-eri-jime (most effective from behind)'],
    counters: ['Tuck chin and pull the sliding hand down before the choke is set'],
    comp: 'Highly effective from the rear and from Kami-shiho-gatame. The sliding action means it can be applied relatively quickly.',
  },

  'Kata-ha-jime': {
    grips: 'Single wing strangle — one arm goes under uke armpit and behind their neck, the other hand controls uke head or collar.',
    mistakes: ['Not getting the hand fully behind uke neck',
      'Allowing uke to protect the armpit with their arm',
      'Not driving the trapped arm upward enough'],
    combos: ['Tate-shiho-gatame -> Kata-ha-jime when uke turns to escape',
      'Ushiro-kesa-gatame -> Kata-ha-jime (natural transition)'],
    counters: ['Keep the elbow down to block the armpit entry',
      'Roll toward the strangle side before it is fully set'],
    comp: 'Very high submission rate. Legal from Tate-shiho-gatame or rear position. Often catches uke who are focused on the hold-down rather than the strangle.',
  },

  'Gyaku-juji-jime': {
    grips: 'Reverse cross choke — both hands grip uke lapels with palms facing outward (thumbs inside). Cross the forearms and squeeze.',
    mistakes: ['Palms facing inward — must be thumbs-in, palms out for the gyaku variation',
      'Not breaking uke posture back before applying from guard',
      'Applying with bent arms instead of extending to the sides'],
    combos: ['Juji-gatame -> Gyaku-juji-jime when uke defends the armlock by bending the arm'],
    counters: ['Posture up and pull both lapels down to break the grip'],
    comp: 'Effective from guard position. The reversed palm position creates a different angle that bypasses some defences to the standard cross choke.',
  },

  'Nami-juji-jime': {
    grips: 'Normal cross choke — both hands grip uke lapels with thumbs inside, palms facing inward.',
    mistakes: ['Applying with stiff straight arms instead of pulling inward with the wrists',
      'Too wide a grip — hands should be close to uke windpipe'],
    combos: ['Nami-juji-jime -> Kata-juji-jime (change grip when uke defends)'],
    counters: ['Pull both wrists down and away from the throat',
      'Posture up out of guard'],
    comp: 'Classic cross lapel choke. Effective from mount or guard. Often the first strangle taught at beginner level.',
  },

  'Kata-juji-jime': {
    grips: 'Half cross choke — one hand palm in (thumb inside), the other palm out (thumb outside). Cross the wrists.',
    mistakes: ['Both hands in the same orientation — one must be in, one out',
      'Not pulling the wrists in the correct crossing motion'],
    combos: ['Nami-juji-jime -> Kata-juji-jime (variation when uke defends normal cross choke)'],
    counters: ['Same as standard cross choke defences'],
    comp: 'Medium-difficulty cross choke variation. The mixed grip orientation can bypass defences to the standard version.',
  },

  'Sankaku-jime': {
    grips: 'Triangle strangle — legs lock around uke neck and one arm. Inside leg goes over the back of uke neck, feet lock together or foot hooks behind knee.',
    mistakes: ['Locking the feet instead of the knee — the knee lock is stronger',
      'Triangle is flat — must angle the hips to increase pressure',
      'Including uke shoulder in the triangle rather than just one arm and neck'],
    combos: ['Juji-gatame -> Sankaku-jime when uke bends the arm to escape the armlock',
      'Guard position -> Sankaku-jime when uke postures up and gives the arm'],
    counters: ['Stack and drive forward before the triangle is locked',
      'Clear the arm out of the triangle before it tightens'],
    comp: 'One of the highest-percentage submissions in ne-waza. Once locked correctly it is extremely difficult to escape. Drills from multiple entries are essential.',
  },

  'Sode-guruma-jime': {
    grips: 'Sleeve wheel choke — grip both sleeves and pull them across uke throat in a scissoring motion.',
    mistakes: ['Gripping mid-sleeve instead of at the cuff',
      'Pulling in the same direction instead of scissoring the wrists'],
    combos: ['Kami-shiho-gatame -> Sode-guruma-jime when uke tries to pull sleeves for escape'],
    counters: ['Pull sleeves away from the throat before they cross'],
    comp: 'Unusual and unexpected. The sleeve-based grip means it can appear when normal collar grips are unavailable.',
  },

  'Morote-jime': {
    grips: 'Two-handed strangle — both hands grip the same collar or lapel and compress the throat.',
    mistakes: ['Using palms instead of the blade edge of the hand',
      'Not enough body weight behind the compression'],
    combos: [],
    counters: ['Tuck chin and grab both wrists to pull the hands down'],
    comp: 'Rarely seen in competition but appears in kata. Limited by rules in some formats.',
  },

  'Tsukkomi-jime': {
    grips: 'Thrust choke — drive one or both hands straight into uke throat with a thrusting motion.',
    mistakes: ['Using the palm instead of the wrist or fingers',
      'No forward body weight behind the thrust'],
    combos: [],
    counters: ['Pull the thrusting arms down and away'],
    comp: 'Legal in judo but rarely used. More common in kata demonstration. Effective in street self-defence contexts.',
  },

  'Ryote-jime': {
    grips: 'Both hands grip both of uke collars and compress inward.',
    mistakes: ['Squeezing with the fingers instead of the wrist bones'],
    combos: [],
    counters: ['Posture up and break both grips'],
    comp: 'Classic two-hand throat hold. More effective in kata than competition due to the difficulty of holding both collars while maintaining position.',
  },

  'Ashi-jime': {
    grips: 'Leg strangle — use the legs (thighs or calves) to compress uke throat.',
    mistakes: ['Using the back of the knee instead of the inner calf',
      'Not angling the hips to increase leg compression'],
    combos: ['Ashi-jime from Sankaku-gatame position'],
    counters: ['Pull the legs apart at the ankles before they lock'],
    comp: 'Legal in judo when applied correctly. Often appears as a Sankaku-jime variation. Particularly effective when uke has strong arms and grips that make arm-based chokes difficult.',
  },

  'Juji-gatame': {
    grips: 'Cross armlock — uke arm held between both hands, fully extended. Hips apply pressure to the elbow joint. Knees squeeze.',
    mistakes: ['Lying parallel to uke instead of perpendicular across their body',
      'Not fully extending uke arm — must be straight before applying hip pressure',
      'Squeezing with the knees too loosely — uke can pull the arm out'],
    combos: ['Kami-shiho-gatame -> Juji-gatame when uke pushes on your chest with straight arm',
      'Tate-shiho-gatame -> Juji-gatame when uke extends an arm upward',
      'Sankaku-jime -> Juji-gatame (convert triangle to armlock if choke is not finishing)'],
    counters: ['Bend the arm immediately and grab your own collar before full extension',
      'Stack and drive forward before tori locks the position'],
    comp: 'The highest scoring submission in judo. Every competitor should know multiple entries. Submissions from Juji-gatame occur at every level from beginner to Olympic.',
  },

  'Ude-garami': {
    grips: 'Figure-four armlock — uke elbow is bent and the forearm is rotated. One hand grips uke wrist, the other arm threads under uke upper arm and grips own wrist.',
    mistakes: ['Not bending uke arm to 90 degrees before applying',
      'Rotating the wrong direction — must rotate toward uke thumb side',
      'Not controlling uke shoulder on the mat'],
    combos: ['Kesa-gatame -> Ude-garami when uke reaches up with the far arm',
      'Juji-gatame attempt -> Ude-garami when uke bends their arm to defend'],
    counters: ['Keep elbows in and do not extend the arm',
      'Roll toward the armlock side before it is set'],
    comp: 'Effective from many hold-down positions. Works best when uke tries to push or reach up with the arm. Very common at intermediate and advanced competition levels.',
  },

  'Ude-hishigi-juji-gatame': {
    grips: 'Same as Juji-gatame — the term is often used interchangeably. Cross-body armbar with hips over the elbow.',
    mistakes: ['See Juji-gatame entries'],
    combos: ['See Juji-gatame combinations'],
    counters: ['See Juji-gatame counters'],
    comp: 'The formal Kodokan name for the standard cross armbar.',
  },

  'Ude-hishigi-ude-gatame': {
    grips: 'Straight arm crush — both hands grip uke wrist and pull back while pressing the arm across your chest or shoulder.',
    mistakes: ['Bending the arm before applying — must keep uke arm straight',
      'Not pressing against the elbow joint specifically'],
    combos: ['From Kesa-gatame position when uke pushes with a straight arm'],
    counters: ['Bend the arm immediately'],
    comp: 'Effective when uke presents a straight arm. Can be applied in several positions including from side control and Kesa-gatame.',
  },

  'Ude-hishigi-hiza-gatame': {
    grips: 'Knee armlock — uke arm is extended across tori knee. Tori drives their knee into the elbow joint while controlling the wrist.',
    mistakes: ['Placing the knee under the arm instead of above the elbow joint',
      'Not controlling uke wrist and shoulder simultaneously'],
    combos: ['From Kami-shiho-gatame or Tate-shiho-gatame when uke posts with the arm'],
    counters: ['Bend the arm and tuck the elbow close to the body'],
    comp: 'Less common than Juji-gatame but highly effective when applied. The knee creates a rigid fulcrum that is hard to resist.',
  },

  'Ude-hishigi-waki-gatame': {
    grips: 'Armpit armlock — uke arm is locked under tori armpit. Tori drives down and inward, leveraging the elbow against the body.',
    mistakes: ['Not trapping the arm tightly enough in the armpit',
      'Pulling the wrist outward instead of pressing down on the elbow'],
    combos: ['From standing grip fight — when tori catches uke arm in the armpit during a grip exchange'],
    counters: ['Pull the arm out of the armpit before it is locked'],
    comp: 'Can be applied standing or on the ground. Unique in that it can threaten from a standing position during grip fighting.',
  },

  'Ude-hishigi-te-gatame': {
    grips: 'Hand armlock — hyper-extend uke wrist or elbow using hand-based control rather than body weight.',
    mistakes: ['Applying on the wrong joint direction',
      'Weak grip on uke wrist'],
    combos: [],
    counters: ['Relax the wrist or bend the arm before the lock is applied'],
    comp: 'Rarely seen in competition. More common in kata. Effective in self-defence contexts.',
  },

  'Ude-hishigi-ashi-gatame': {
    grips: 'Leg armlock — uke arm is extended and tori uses the leg (not the hip) to apply pressure to the elbow joint.',
    mistakes: ['Using the knee joint instead of the shin as the lever'],
    combos: ['From Sankaku-gatame position with far arm extended'],
    counters: ['Roll toward the lock before the leg secures the joint'],
    comp: 'Specialist technique. Effective from Sankaku-gatame when the standard Juji-gatame angle is blocked.',
  },

  'Ude-hishigi-hara-gatame': {
    grips: 'Stomach armlock — uke arm is extended across tori stomach. Tori grips the wrist and arches back against the elbow.',
    mistakes: ['Not arching back far enough — must create full extension on the joint',
      'Gripping uke wrist too loosely'],
    combos: [],
    counters: ['Bend the elbow immediately'],
    comp: 'Less common. Appears occasionally from turtle or side control positions.',
  },

  'Ude-hishigi-sankaku-gatame': {
    grips: 'Triangle armlock — the triangle leg position locks uke arm while simultaneously threatening a strangle.',
    mistakes: ['Pointing the knee down instead of maintaining horizontal triangle',
      'Not including the correct arm inside the triangle'],
    combos: ['Sankaku-jime -> Ude-hishigi-sankaku-gatame (switch between strangle and armlock)'],
    counters: ['Clear the arm from inside the triangle before it locks'],
    comp: 'Highly effective from Sankaku position. The simultaneous strangle and armlock threat divides uke attention.',
  },

  'Ashi-garami': {
    grips: 'Leg entanglement — wrap around uke leg to attack the knee joint.',
    mistakes: ['Applying before securing a stable ground position',
      'Rotating in the wrong direction'],
    combos: [],
    counters: ['Roll and create distance before the entanglement locks'],
    comp: 'ILLEGAL in IJF competition due to knee injury risk. Legal in some other rulesets. Handle with extreme care in training.',
  },

  'Waki-gatame': {
    grips: 'Armpit lock applied standing — jam uke arm under the armpit and drive the elbow down and outward.',
    mistakes: ['Not trapping the arm deeply enough in the armpit',
      'Applying with the arm bent — must straighten uke arm first'],
    combos: ['From grip fighting — catch the sleeve and jam the arm under the pit'],
    counters: ['Pull the arm back before it is trapped'],
    comp: 'Can be applied during standing grip exchanges. Very quick submission when timed correctly. Requires a committed sleeve grip from uke.',
  },
};
