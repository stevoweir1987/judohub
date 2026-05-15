// ── RANDORI BRAIN ─────────────────────────────────

const RANDORI_CATEGORIES = [
  { id: 'all',     label: 'Random Mix',    emoji: '🎲', desc: 'All scenarios shuffled — the full test' },
  { id: 'chain',   label: 'Attack Chains', emoji: '🔗', desc: 'First attack fails — what\'s your follow-up?' },
  { id: 'counter', label: 'Counters',      emoji: '⚡', desc: 'Uke attacks — can you turn it around?' },
  { id: 'newaza',  label: 'Ne-waza',       emoji: '🤼', desc: 'Ground transitions and escapes' },
  { id: 'grip',    label: 'Grip Battle',   emoji: '✊', desc: 'Kumi-kata and gripping decisions' },
  { id: 'contest', label: 'Contest Brain', emoji: '🎯', desc: 'Tactics, timing and smart judo' },
];

const RANDORI_LEVELS = {
  beginner:     { label: 'Beginner',     color: '#f1c40f', text: '#5a4000' },
  intermediate: { label: 'Intermediate', color: '#e67e22', text: '#fff'    },
  advanced:     { label: 'Advanced',     color: '#2980b9', text: '#fff'    },
};

// ── SCENARIOS ─────────────────────────────────────
const RANDORI_SCENARIOS = [

  // ── ATTACK CHAINS ────────────────────────────────
  {
    id: 1, cat: 'chain', level: 'beginner',
    situation: 'You drive in hard with O Soto Gari — but uke hops their leg away just in time and steps back. Their weight is now sitting on their heels.',
    tip: 'When uke pulls back to defend, their heel weight and open front leg become a target.',
    options: [
      { label: 'Ko Uchi Gari', correct: true,
        reason: 'Perfect read. Uke\'s weight is back and their heel is planted — Ko Uchi Gari hooks it cleanly before they recover.' },
      { label: 'O Soto Gari again', correct: false,
        reason: 'They just defended it once. Repeating immediately gives them the same escape route.' },
      { label: 'O Goshi', correct: false,
        reason: 'O Goshi needs you to close distance and turn in — uke stepping back gives them time to reset their posture.' },
      { label: 'Stand back and reset', correct: false,
        reason: 'You have the momentum advantage right now. Resetting gives it back for free.' },
    ],
  },
  {
    id: 2, cat: 'chain', level: 'beginner',
    situation: 'You attack with Ippon Seoi Nage — uke feels it early and ducks their chest over your back, blocking the throw. You\'re stuck bent over.',
    tip: 'When uke blocks a seoi by going over your back, their legs are wide and front-heavy.',
    options: [
      { label: 'Ouchi Gari', correct: true,
        reason: 'Exactly right. Uke has bent forward over you — Ouchi hooks the inner leg while they\'re front-heavy and off-balance.' },
      { label: 'Keep lifting with Seoi', correct: false,
        reason: 'They\'ve already blocked it by going over your back — forcing it will pull you both down awkwardly.' },
      { label: 'Tai Otoshi', correct: false,
        reason: 'Tai Otoshi needs kuzushi with uke moving forward into you — they\'ve already killed your entry.' },
      { label: 'Kata Guruma', correct: false,
        reason: 'Uke is draped over your back — getting lower for Kata Guruma from here is nearly impossible.' },
    ],
  },
  {
    id: 3, cat: 'chain', level: 'beginner',
    situation: 'You attack Tai Otoshi but uke steps their right foot around your blocking leg and ends up side-on to you.',
    tip: 'Uke circling around your blocking leg puts their weight onto the inside foot.',
    options: [
      { label: 'Ko Uchi Gari', correct: true,
        reason: 'As uke circles, their weight transfers onto the inner foot — Ko Uchi sweeps it perfectly.' },
      { label: 'O Soto Gari', correct: false,
        reason: 'O Soto attacks the outside leg — uke has moved inside so the angle is wrong.' },
      { label: 'Harai Goshi', correct: false,
        reason: 'Harai needs a clean forward entry — uke has already disrupted your position.' },
      { label: 'Tomoe Nage', correct: false,
        reason: 'Dropping for Tomoe while uke is sidestepping is too slow — they\'ll step over it.' },
    ],
  },
  {
    id: 4, cat: 'chain', level: 'intermediate',
    situation: 'You launch into Harai Goshi but uke squats low and pushes their hip in to block your sweeping leg. You can\'t complete the throw.',
    tip: 'A blocked Harai means uke has bent their knees — Tai Otoshi is designed for that bent-knee posture.',
    options: [
      { label: 'Tai Otoshi', correct: true,
        reason: 'Smart switch. Uke has bent their knees to block — Tai Otoshi catches that exact posture before they straighten up.' },
      { label: 'Uchi Mata', correct: false,
        reason: 'Uchi Mata attacks the same leg line as Harai — uke\'s blocking position defends both.' },
      { label: 'Seoi Nage', correct: false,
        reason: 'Seoi needs a tight turn-in — awkward when you\'re mid-Harai and uke has squatted low.' },
      { label: 'O Goshi', correct: false,
        reason: 'O Goshi to the same side meets the same hip block they just used.' },
    ],
  },
  {
    id: 5, cat: 'chain', level: 'intermediate',
    situation: 'You attack with Uchi Mata but uke steps their left foot over your sweeping leg, landing off to your left side.',
    tip: 'Uke stepping over Uchi Mata lands them side-on with their right leg now weight-bearing.',
    options: [
      { label: 'Ko Soto Gari', correct: true,
        reason: 'As uke steps over to your left, their right leg is loaded and exposed — Ko Soto hooks it cleanly.' },
      { label: 'Ouchi Gari', correct: false,
        reason: 'Ouchi attacks the inner leg — but uke has stepped wide to your left, so the angle doesn\'t work.' },
      { label: 'Uchi Mata again', correct: false,
        reason: 'They just stepped over it — trying the same attack immediately will get the same result.' },
      { label: 'Tomoe Nage', correct: false,
        reason: 'Dropping for Tomoe while uke is stepping over is dangerous — you\'ll end up in a poor position.' },
    ],
  },
  {
    id: 6, cat: 'chain', level: 'advanced',
    situation: 'You attack with Deashi Harai but uke hops over your sweeping foot and keeps moving forward, now driving into you.',
    tip: 'Uke hopping and driving forward is giving you their momentum — use it.',
    options: [
      { label: 'O Goshi — use their forward drive', correct: true,
        reason: 'Perfect use of momentum. Uke is already driving forward — O Goshi or Seoi catches that energy and turns it into the throw.' },
      { label: 'Deashi Harai again', correct: false,
        reason: 'They just hopped it and are now moving INTO you — a foot sweep needs them moving away.' },
      { label: 'Step back and regroup', correct: false,
        reason: 'Surrendering momentum here is a mistake — uke\'s forward drive is your best weapon right now.' },
      { label: 'Ko Soto Gari', correct: false,
        reason: 'Ko Soto works when uke is stepping back — this one is driving forward into you.' },
    ],
  },
  {
    id: 7, cat: 'chain', level: 'advanced',
    situation: 'You attack Morote Seoi Nage. Uke sprawls their weight back and wraps around your waist from behind. You\'re bent forward.',
    tip: 'When uke locks around your waist from behind, their own forward pressure can be used against them.',
    options: [
      { label: 'Sumi Gaeshi', correct: true,
        reason: 'Exactly right. With uke behind and bearing down, drop and use Sumi Gaeshi — their own pressure throws them over your body.' },
      { label: 'Stand up and reset', correct: false,
        reason: 'Standing with uke gripping your waist from behind gives them a powerful platform to throw you.' },
      { label: 'Continue the Seoi Nage', correct: false,
        reason: 'They\'re behind you now — the entry is completely blocked.' },
      { label: 'O Goshi to the opposite side', correct: false,
        reason: 'Turning into a hip throw while uke has your waist from behind will put you in danger.' },
    ],
  },

  // ── COUNTERS ─────────────────────────────────────
  {
    id: 8, cat: 'counter', level: 'beginner',
    situation: 'Uke commits hard to O Soto Gari — they lean all their body weight over to complete the reap.',
    tip: 'When uke overcommits to O Soto, their weight is entirely on the attacking side and they can\'t change direction.',
    options: [
      { label: 'Uchi Mata', correct: true,
        reason: 'Classic counter. As uke reaps and shifts their weight, step in and Uchi Mata sweeps the leg they\'re balancing on.' },
      { label: 'Run backwards', correct: false,
        reason: 'Going with the direction of the throw just completes it for them.' },
      { label: 'O Soto Gari back at them', correct: false,
        reason: 'You\'re tangled together — no clean angle for a counter O Soto.' },
      { label: 'Juji Gatame', correct: false,
        reason: 'Ground techniques don\'t apply here — you\'re standing and need to react before you fall.' },
    ],
  },
  {
    id: 9, cat: 'counter', level: 'beginner',
    situation: 'Uke attacks with Ippon Seoi Nage and gets under you — but their entry is shallow and their hip isn\'t quite under your centre.',
    tip: 'A shallow seoi entry means their hip isn\'t loaded — stepping over and wrapping from above is available.',
    options: [
      { label: 'Ushiro Goshi', correct: true,
        reason: 'Ushiro Goshi is the textbook counter — wrap around uke\'s waist from above and use their bent position to lift and throw backward.' },
      { label: 'Try to jump over them', correct: false,
        reason: 'Jumping is not a technique and is dangerous — you\'ll land badly or get thrown.' },
      { label: 'Push them away with both hands', correct: false,
        reason: 'Pushing without a technique just breaks the action without scoring.' },
      { label: 'Deliberately drop to ne-waza', correct: false,
        reason: 'Dropping while uke is underneath puts them in a strong position to control.' },
    ],
  },
  {
    id: 10, cat: 'counter', level: 'intermediate',
    situation: 'Uke attacks Harai Goshi from your right. Their sweeping leg is fully extended and they\'re committed. You read it early.',
    tip: 'When uke sweeps and commits with one leg, their supporting leg is alone and exposed.',
    options: [
      { label: 'Ouchi Gari on the supporting leg', correct: true,
        reason: 'As uke commits to Harai, step in and Ouchi hooks their supporting leg — they\'re on one foot, extremely vulnerable.' },
      { label: 'Tai Otoshi', correct: false,
        reason: 'Tai Otoshi needs you to turn in — there\'s no time when uke is mid-Harai.' },
      { label: 'Lean forward into the throw', correct: false,
        reason: 'Going with the throw is not a counter — that\'s how you get thrown for Ippon.' },
      { label: 'Uchi Mata', correct: false,
        reason: 'Uchi Mata and Harai Goshi attack the same direction — their throw blocks your entry.' },
    ],
  },
  {
    id: 11, cat: 'counter', level: 'intermediate',
    situation: 'Uke drives forward with a big O Goshi and gets their hip in. You manage to sprawl slightly but they still have hold of you.',
    tip: 'When uke has hip entry but you\'ve sprawled, your upper body is behind and above theirs.',
    options: [
      { label: 'Utsuri Goshi — switch hips', correct: true,
        reason: 'You\'re in the perfect position — your body is behind theirs. Utsuri Goshi catches the opposite hip and turns their throw into yours.' },
      { label: 'Block with your knee', correct: false,
        reason: 'Knee blocking without a technique just stalls — uke will readjust and re-attack.' },
      { label: 'Tomoe Nage', correct: false,
        reason: 'Tomoe needs uke walking forward into your foot — they\'ve already turned their back on you.' },
      { label: 'Ko Uchi Gari', correct: false,
        reason: 'Foot sweeps are difficult when uke already has a tight hip-to-hip connection.' },
    ],
  },
  {
    id: 12, cat: 'counter', level: 'advanced',
    situation: 'Uke attacks with a deep Uchi Mata. You step over their sweeping leg and land on top of uke\'s back.',
    tip: 'Landing behind uke in ne-waza after stepping over Uchi Mata is a scoring opportunity — but only if you act in the first second.',
    options: [
      { label: 'Drop immediately into Kesa Gatame', correct: true,
        reason: 'You\'re already behind and above uke — drop your weight and flatten them into Kesa Gatame before they can recover.' },
      { label: 'Stand back up and reset', correct: false,
        reason: 'You\'re in a dominant ne-waza position — standing throws it away completely.' },
      { label: 'Try to throw them forward', correct: false,
        reason: 'You don\'t have the grip or position to throw forward from here — secure the hold first.' },
      { label: 'Try a strangle immediately', correct: false,
        reason: 'Strangles need a controlled entry — secure the hold first, then transition to strangles.' },
    ],
  },

  // ── NE-WAZA ──────────────────────────────────────
  {
    id: 13, cat: 'newaza', level: 'beginner',
    situation: 'You\'ve thrown uke with O Soto Gari but they roll through and land face-down on the mat. You\'re standing beside them.',
    tip: 'Uke face-down is a vulnerable position — get to their side quickly before they can get to their knees.',
    options: [
      { label: 'Circle to their side and lock in Kesa Gatame', correct: true,
        reason: 'Classic transition. Move to their side, drop your body low and secure Kesa Gatame before they can get to their knees.' },
      { label: 'Jump on their back', correct: false,
        reason: 'Jumping without a technique leaves you in a poor position — uke can roll and reverse it.' },
      { label: 'Wait for them to stand', correct: false,
        reason: 'Never give away a ne-waza advantage. Once they\'re on their feet the opportunity is gone.' },
      { label: 'Go straight for Juji Gatame', correct: false,
        reason: 'Juji from standing with uke face-down is a complex entry — secure the hold first, armlocks come after.' },
    ],
  },
  {
    id: 14, cat: 'newaza', level: 'beginner',
    situation: 'You\'re holding uke in Kesa Gatame. They sit up and push your face away with their free hand to escape.',
    tip: 'When uke sits up from Kesa, they expose the gap beside their head — switch before they complete the escape.',
    options: [
      { label: 'Switch to Kata Gatame', correct: true,
        reason: 'Perfect switch. As uke sits up and raises their arm, trap it with your head — Kata Gatame locks the arm and keeps full control.' },
      { label: 'Push them back down', correct: false,
        reason: 'Pushing without a grip change is tiring and buys uke time to finish their escape.' },
      { label: 'Release and attempt a strangle', correct: false,
        reason: 'Releasing a secure hold to set a strangle from scratch is risky — uke is already moving.' },
      { label: 'Roll over their head', correct: false,
        reason: 'Rolling over is a classic mistake — uke uses your momentum to reverse into a top position.' },
    ],
  },
  {
    id: 15, cat: 'newaza', level: 'intermediate',
    situation: 'You have Yoko Shiho Gatame. Uke brings their knees up and turns in toward you — you feel the hold weakening.',
    tip: 'When uke turns into you from Yoko Shiho, they\'re rotating onto their side. Ride that rotation.',
    options: [
      { label: 'Ride the rotation into Tate Shiho Gatame', correct: true,
        reason: 'Move with them. As uke turns in, slide up and settle your weight into Tate Shiho — their escape attempt puts you in a stronger hold.' },
      { label: 'Grip harder and hold your position', correct: false,
        reason: 'Fighting the rotation is exhausting and usually fails — uke\'s legs are stronger than your grip.' },
      { label: 'Release and go for a strangle', correct: false,
        reason: 'Releasing gives uke a free moment to escape entirely before you can set a strangle.' },
      { label: 'Reach for their belt', correct: false,
        reason: 'Reaching for the belt without changing position gives uke the gap they need to complete the escape.' },
    ],
  },
  {
    id: 16, cat: 'newaza', level: 'intermediate',
    situation: 'Uke is on all fours, defending strongly. You\'re beside them trying to turn them over. You have a collar grip but they won\'t move.',
    tip: 'Uke on all fours has a strong base — instead of fighting it, attack the arm that\'s holding them up.',
    options: [
      { label: 'Pull the near arm away and push them over', correct: true,
        reason: 'Remove their support. Once the arm goes, their base collapses and you can flatten them into Kesa or Yoko Shiho.' },
      { label: 'Jump over their back', correct: false,
        reason: 'Jumping gives uke momentum to roll and reverse — rarely works above beginner level.' },
      { label: 'Drag them forward by the collar', correct: false,
        reason: 'A judoka on all fours can resist collar drags well — they\'ll drop lower and dig in.' },
      { label: 'Stand up and wait', correct: false,
        reason: 'Standing up gives uke time to recover their feet — never retreat from a ne-waza advantage.' },
    ],
  },
  {
    id: 17, cat: 'newaza', level: 'advanced',
    situation: 'You have Kami Shiho Gatame. Uke hip-bridges hard toward their legs — you feel your balance tipping forward.',
    tip: 'When uke bridges toward their legs, they\'re using leverage not strength — counter it by redirecting your weight.',
    options: [
      { label: 'Step one leg over and drop chest forward', correct: true,
        reason: 'Step one leg over their hip and drive your chest down — this kills their leverage and re-flattens them before the escape completes.' },
      { label: 'Grip tighter', correct: false,
        reason: 'Gripping harder does nothing if uke has the leverage — bridge power beats grip strength.' },
      { label: 'Release and re-grip', correct: false,
        reason: 'Releasing during an active escape gives uke exactly the moment they need to complete the roll.' },
      { label: 'Try a strangle mid-escape', correct: false,
        reason: 'Attempting a strangle while uke is mid-escape is too late — neutralise the escape first.' },
    ],
  },
  {
    id: 18, cat: 'newaza', level: 'advanced',
    situation: 'Your armlock attempt fails and uke pulls their arm free. You\'re both scrambling — uke is turning away from you.',
    tip: 'When an armlock fails and uke turns away, their neck and collar are exposed — strangles become the natural follow-up.',
    options: [
      { label: 'Reach for the collar — Okuri Eri Jime', correct: true,
        reason: 'Smart transition. As uke turns away, slide your hand into their collar from behind — Okuri Eri Jime is the natural follow-up when uke\'s back is to you.' },
      { label: 'Try the armlock again', correct: false,
        reason: 'Uke just escaped it and is moving — the same arm isn\'t available in the same position.' },
      { label: 'Stand up', correct: false,
        reason: 'Standing surrenders a scramble you could win — stay in ne-waza and hunt.' },
      { label: 'Grab their belt and hold on', correct: false,
        reason: 'Holding the belt without attacking just stalls — the referee will stand you both up.' },
    ],
  },

  // ── GRIP BATTLE ──────────────────────────────────
  {
    id: 19, cat: 'grip', level: 'beginner',
    situation: 'Uke grabs a high collar grip on your right lapel — higher than normal, pulling your collar tight and restricting your head movement.',
    tip: 'A high collar grip is a control grip — remove it before uke settles into their attack position.',
    options: [
      { label: 'Circle your elbow up and over to break the grip', correct: true,
        reason: 'Circular elbow break is the most effective counter to high collar — breaks their grip without pulling you out of position.' },
      { label: 'Attack with Seoi Nage immediately', correct: false,
        reason: 'Attacking with a restricted lapel means uke can steer your entry — deal with the grip first.' },
      { label: 'Mirror them with your own high collar', correct: false,
        reason: 'Matching their high collar often leads to a stalemate and passive judo — break and attack.' },
      { label: 'Step back to create distance', correct: false,
        reason: 'Stepping back rewards the grip and gives uke time to establish their full attacking position.' },
    ],
  },
  {
    id: 20, cat: 'grip', level: 'beginner',
    situation: 'Uke grabs both your sleeves — a double-sleeve grip. They\'re pulling your arms down and stopping any entry.',
    tip: 'Double sleeve means uke has no lapel grip — their body is open and their pull can become your weapon.',
    options: [
      { label: 'Tai Otoshi — use their sleeve pull for kuzushi', correct: true,
        reason: 'Clever. They\'ve handed you a perfect Tai Otoshi setup — use their own pull to accelerate your kuzushi and step through.' },
      { label: 'Break both grips at once', correct: false,
        reason: 'Breaking both simultaneously is nearly impossible — they\'ll just re-grip. Attack into it instead.' },
      { label: 'Pull back and separate', correct: false,
        reason: 'Separating just resets to neutral — but they\'ve shown their gripping style, use it against them.' },
      { label: 'Duck under for Kata Guruma', correct: false,
        reason: 'Kata Guruma needs your hand between their legs — with double-sleeve you can\'t reach down there.' },
    ],
  },
  {
    id: 21, cat: 'grip', level: 'intermediate',
    situation: 'Uke is left-handed (southpaw). They keep getting under your arm on your right side and you can\'t establish your standard grip.',
    tip: 'Against left-handers, your standard right entry puts you at a structural disadvantage — the geometry is against you.',
    options: [
      { label: 'Switch to left-hand attacks or attack their open side', correct: true,
        reason: 'Correct adjustment. Mirror their stance or target their weaker side — fighting into their dominant side is a losing battle.' },
      { label: 'Keep forcing your standard right grip', correct: false,
        reason: 'If they keep getting under your arm, repeating the same approach just repeats the same problem.' },
      { label: 'Grab their belt with your free hand', correct: false,
        reason: 'A belt grip can help in specific situations but doesn\'t solve the fundamental angle problem.' },
      { label: 'Go straight to ne-waza', correct: false,
        reason: 'Deliberately dropping to avoid a grip battle is not a sustainable strategy — and you\'ll still face their dominant side.' },
    ],
  },
  {
    id: 22, cat: 'grip', level: 'advanced',
    situation: 'Uke has gripped your collar and sleeve and is pulling you sideways to create an angle for Harai Goshi. You can feel the kuzushi starting.',
    tip: 'When uke is building kuzushi for Harai, the key is to destroy the angle before the attack lands.',
    options: [
      { label: 'Step offline — forward-diagonal into their pull', correct: true,
        reason: 'Step forward-diagonally in the direction they\'re pulling — this collapses their angle and puts you in a counter-attacking position.' },
      { label: 'Stiffen and lean backward', correct: false,
        reason: 'Leaning back against Harai kuzushi is the worst response — it loads you perfectly onto their hip.' },
      { label: 'Let go of your grips', correct: false,
        reason: 'Releasing grips mid-kuzushi removes your ability to counter and leaves you unbalanced.' },
      { label: 'Step backward to create distance', correct: false,
        reason: 'Stepping back goes exactly in the direction they\'re pulling — it accelerates their kuzushi.' },
    ],
  },

  // ── CONTEST BRAIN ────────────────────────────────
  {
    id: 23, cat: 'contest', level: 'beginner',
    situation: 'You\'re winning by waza-ari with 30 seconds left. Uke is desperate, pushing forward hard.',
    tip: 'When leading late, the worst thing is going defensive — movement and controlled attacking beats standing still.',
    options: [
      { label: 'Keep moving, use ashi-waza to stay in control', correct: true,
        reason: 'Stay active. Moving and using light foot attacks keeps the clock running and prevents passivity calls. Don\'t plant your feet.' },
      { label: 'Lock up tight and hold on', correct: false,
        reason: 'Stalling invites a shido penalty — and if uke breaks free and scores, you\'ve lost the initiative.' },
      { label: 'Go to ne-waza deliberately', correct: false,
        reason: 'Deliberately dropping loses your positional advantage and risks being turned for a score.' },
      { label: 'Go for a big throw to finish it', correct: false,
        reason: 'Going for a big throw when tired and under pressure risks a counter — unnecessary when you\'re already winning.' },
    ],
  },
  {
    id: 24, cat: 'contest', level: 'beginner',
    situation: 'You\'re tied with one minute left. Both players need a score. Uke is being very passive and not attacking.',
    tip: 'In a tied match late on, the judoka with forward intent controls the narrative — and often wins Golden Score on momentum.',
    options: [
      { label: 'Apply pressure with combinations and force uke to react', correct: true,
        reason: 'Right approach. Continuous combinations force uke to defend rather than wait — and shows the referee who\'s working.' },
      { label: 'Wait for uke to attack and counter', correct: false,
        reason: 'If neither attacks, it\'s Golden Score on a coin toss or penalty — not ideal when you can control the match.' },
      { label: 'Go to ne-waza immediately', correct: false,
        reason: 'Dropping without a throw attempt gives uke the ground position choice.' },
      { label: 'One big attack and then wait', correct: false,
        reason: 'A single big attack without combinations is easy to read — uke is waiting for exactly this.' },
    ],
  },
  {
    id: 25, cat: 'contest', level: 'intermediate',
    situation: 'Uke is significantly heavier than you. They keep driving into you and your usual throws aren\'t generating any kuzushi.',
    tip: 'Against heavier opponents, timing and angles beat strength — foot attacks and sacrifice throws level the playing field.',
    options: [
      { label: 'Switch to ashi-waza and sacrifice throws — use their weight', correct: true,
        reason: 'Smart adjustment. Ashi-waza (Deashi, Ko Uchi, Harai) use timing not strength. Sacrifice throws like Tomoe Nage convert their forward drive into the throwing force.' },
      { label: 'Try harder with Seoi Nage', correct: false,
        reason: 'Out-muscling a heavier judoka is exhausting and ineffective — work smarter, not harder.' },
      { label: 'Step back and stay defensive', correct: false,
        reason: 'Retreating just lets them drive you to the edge and invites passivity calls.' },
      { label: 'Lock up and wait for them to tire', correct: false,
        reason: 'This invites shido penalties and teaches you nothing about dealing with bigger players.' },
    ],
  },
  {
    id: 26, cat: 'contest', level: 'intermediate',
    situation: 'You\'ve just received a shido. One more loses you the match. Uke knows this and is being deliberately passive to bait a rash attack.',
    tip: 'When under penalty pressure, controlled attacking is better than desperate attacking — technique beats urgency.',
    options: [
      { label: 'Stay composed — attack in control, don\'t gamble', correct: true,
        reason: 'Exactly right. Uke wants you to panic. Attack positively but with technique — good combinations may draw uke\'s own passivity penalty.' },
      { label: 'Drop to ne-waza immediately', correct: false,
        reason: 'Dropping without a throw attempt will draw the second shido for passivity.' },
      { label: 'Grab double lapel and drive forward', correct: false,
        reason: 'Pushing without technique is a shido — exactly what uke is waiting for.' },
      { label: 'Attempt a big sacrifice throw', correct: false,
        reason: 'Panicking into a sacrifice throw is exactly what uke wants — if it fails you\'re in ne-waza with them on top.' },
    ],
  },
  {
    id: 27, cat: 'contest', level: 'advanced',
    situation: 'It\'s Golden Score. You\'re exhausted. Uke gets a marginal grip advantage. The referee is watching both players for passivity.',
    tip: 'In Golden Score, showing intent is more important than perfect execution — attack first, even imperfectly.',
    options: [
      { label: 'Attack immediately — pressure matters more than perfection', correct: true,
        reason: 'In Golden Score, even an imperfect Ko Uchi or Deashi shows the referee you\'re working — and forces uke to react, potentially opening a real chance.' },
      { label: 'Wait for the perfect grip before attacking', correct: false,
        reason: 'Waiting for perfect grips in Golden Score leads to passivity penalties — attack with what you have.' },
      { label: 'Drop to ne-waza to slow the pace', correct: false,
        reason: 'Dropping without a throw attempt draws a shido — and ne-waza scrambles when exhausted are hard to control.' },
      { label: 'Spend 20 seconds breaking their grip', correct: false,
        reason: 'Extended grip-fighting without attacking will bring a passivity call from the referee.' },
    ],
  },
  {
    id: 28, cat: 'contest', level: 'advanced',
    situation: 'You\'re at the edge of the mat. Uke is driving hard, pushing you toward the line. One more step and you get a shido.',
    tip: 'The edge is not just a danger zone — it\'s an attacking opportunity. Uke\'s forward drive is their vulnerability.',
    options: [
      { label: 'Pivot and use their drive — Tomoe Nage or Tai Otoshi at the edge', correct: true,
        reason: 'The edge is your weapon. Use uke\'s forward drive for Tomoe Nage, or pivot for Tai Otoshi — their aggression becomes your throw and you stay on the mat.' },
      { label: 'Lock up and stop moving', correct: false,
        reason: 'Stopping while uke pushes gives them the grip leverage to drive you off cleanly.' },
      { label: 'Step out deliberately to reset to centre', correct: false,
        reason: 'Deliberately stepping out is a shido — and resets to centre where uke still has the momentum.' },
      { label: 'Lean backward and hold your ground', correct: false,
        reason: 'Leaning backward at the edge puts you unbalanced and defensive — uke has you exactly where they want you.' },
    ],
  },
];

// ── STATE ─────────────────────────────────────────
let rBrain = {
  screen: 'hub',
  scenarios: [],
  idx: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  answered: false,
  chosenIdx: -1,
  lastCorrect: false,
  catFilter: 'all',
};

// ── STATS ─────────────────────────────────────────
function getRandoriStats() {
  return JSON.parse(localStorage.getItem('judo_randori_stats') || '{}');
}
function saveRandoriStats(s) {
  localStorage.setItem('judo_randori_stats', JSON.stringify(s));
}

// ── MAIN RENDER ───────────────────────────────────
function renderRandori() {
  if      (rBrain.screen === 'quiz')    renderRandoriQuiz();
  else if (rBrain.screen === 'results') renderRandoriResults();
  else                                  renderRandoriHub();
}

// ── SHUFFLE ───────────────────────────────────────
function rbShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── HUB SCREEN ────────────────────────────────────
function renderRandoriHub() {
  rBrain.screen = 'hub';
  const stats = getRandoriStats();
  const total   = stats.attempts  || 0;
  const correct = stats.correct   || 0;
  const accuracy = total > 0 ? Math.round(correct / total * 100) : '-';
  const bestStreak = stats.bestStreak || 0;

  const catCounts = {};
  RANDORI_SCENARIOS.forEach(s => { catCounts[s.cat] = (catCounts[s.cat] || 0) + 1; });

  document.getElementById('rb-body').innerHTML = `
    <div class="rb-hub">

      <div class="rb-hero">
        <div class="rb-hero-icon">🧠</div>
        <div>
          <div class="rb-hero-title">Randori Brain</div>
          <div class="rb-hero-sub">Real scenarios. Real decisions. Train how you think — not just what you know.</div>
        </div>
      </div>

      ${total > 0 ? `
      <div class="rb-stats-row">
        <div class="rb-stat"><div class="rb-stat-val">${total}</div><div class="rb-stat-lbl">Attempts</div></div>
        <div class="rb-stat"><div class="rb-stat-val">${accuracy}%</div><div class="rb-stat-lbl">Accuracy</div></div>
        <div class="rb-stat"><div class="rb-stat-val">${bestStreak}</div><div class="rb-stat-lbl">Best streak</div></div>
      </div>` : ''}

      <div class="rb-cat-grid">
        ${RANDORI_CATEGORIES.map(c => {
          const count = c.id === 'all' ? RANDORI_SCENARIOS.length : (catCounts[c.id] || 0);
          const cs    = stats['cat_' + c.id] || {};
          const cacc  = cs.attempts > 0 ? Math.round(cs.correct / cs.attempts * 100) + '%' : null;
          return `
          <div class="rb-cat-card${c.id === 'all' ? ' rb-cat-all' : ''}" onclick="startRandoriQuiz('${c.id}')">
            <span class="rb-cat-emoji">${c.emoji}</span>
            <div class="rb-cat-info">
              <div class="rb-cat-name">${c.label}</div>
              <div class="rb-cat-desc">${c.desc}</div>
            </div>
            <div class="rb-cat-right">
              <div class="rb-cat-count">${count} Q</div>
              ${cacc ? `<div class="rb-cat-acc">${cacc}</div>` : ''}
              <span class="rb-cat-arr">→</span>
            </div>
          </div>`;
        }).join('')}
      </div>

    </div>`;
}

// ── START QUIZ ────────────────────────────────────
function startRandoriQuiz(cat) {
  const pool = cat === 'all'
    ? rbShuffle(RANDORI_SCENARIOS)
    : rbShuffle(RANDORI_SCENARIOS.filter(s => s.cat === cat));

  rBrain = {
    screen: 'quiz',
    scenarios: pool,
    idx: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    answered: false,
    chosenIdx: -1,
    lastCorrect: false,
    catFilter: cat,
  };
  renderRandoriQuiz();
}

// ── QUIZ SCREEN ───────────────────────────────────
function renderRandoriQuiz() {
  const s       = rBrain.scenarios[rBrain.idx];
  const total   = rBrain.scenarios.length;
  const pct     = Math.round(rBrain.idx / total * 100);
  const catInfo = RANDORI_CATEGORIES.find(c => c.id === s.cat) || {};
  const lvl     = RANDORI_LEVELS[s.level] || RANDORI_LEVELS.beginner;
  const letters = ['A','B','C','D'];

  const optionsHtml = s.options.map((o, i) => {
    let cls = 'rb-option';
    if (rBrain.answered) {
      if (o.correct)                              cls += ' rb-opt-correct';
      else if (i === rBrain.chosenIdx && !o.correct) cls += ' rb-opt-wrong';
      else                                        cls += ' rb-opt-dim';
    }
    const icon = rBrain.answered
      ? (o.correct ? '<span class="rb-opt-icon">✓</span>'
        : i === rBrain.chosenIdx ? '<span class="rb-opt-icon">✗</span>' : '')
      : '';
    return `<button class="${cls}" onclick="${rBrain.answered ? '' : 'selectRandoriAnswer(' + i + ')'}" ${rBrain.answered ? 'disabled' : ''}>
      <span class="rb-opt-letter">${letters[i]}</span>
      <span class="rb-opt-text">${o.label}</span>
      ${icon}
    </button>`;
  }).join('');

  document.getElementById('rb-body').innerHTML = `
    <div class="rb-quiz">

      <div class="rb-quiz-top">
        <button class="rb-back" onclick="renderRandoriHub()">← Hub</button>
        <div class="rb-prog-wrap">
          <div class="rb-prog-bar"><div class="rb-prog-fill" style="width:${pct}%"></div></div>
          <span class="rb-prog-lbl">${rBrain.idx + 1} / ${total}</span>
        </div>
        <div class="rb-live-score">
          <span>✓ ${rBrain.score}</span>
          ${rBrain.streak > 1 ? `<span class="rb-live-streak">🔥 ${rBrain.streak}</span>` : ''}
        </div>
      </div>

      <div class="rb-card">
        <div class="rb-card-tags">
          <span class="rb-lvl-badge" style="background:${lvl.color};color:${lvl.text}">${lvl.label}</span>
          <span class="rb-cat-badge">${catInfo.emoji || ''} ${catInfo.label || s.cat}</span>
        </div>

        <div class="rb-situation">${s.situation}</div>

        <div class="rb-options">${optionsHtml}</div>

        ${rBrain.answered ? `
        <div class="rb-tip-box">💡 <strong>Key principle:</strong> ${s.tip}</div>
        <div class="rb-feedback ${rBrain.lastCorrect ? 'rb-fb-correct' : 'rb-fb-wrong'}">
          <span class="rb-fb-verdict">${rBrain.lastCorrect ? '✓ Correct!' : '✗ Not quite —'}</span>
          ${s.options[rBrain.chosenIdx].reason}
        </div>
        <button class="rb-next-btn" onclick="nextRandoriQuestion()">
          ${rBrain.idx + 1 < total ? 'Next question →' : 'See results →'}
        </button>` : ''}
      </div>

    </div>`;
}

// ── SELECT ANSWER ─────────────────────────────────
function selectRandoriAnswer(i) {
  if (rBrain.answered) return;
  const s       = rBrain.scenarios[rBrain.idx];
  const correct = s.options[i].correct;

  rBrain.answered    = true;
  rBrain.chosenIdx   = i;
  rBrain.lastCorrect = correct;

  if (correct) {
    rBrain.score++;
    rBrain.streak++;
    rBrain.maxStreak = Math.max(rBrain.maxStreak, rBrain.streak);
  } else {
    rBrain.streak = 0;
  }

  // persist stats
  const st = getRandoriStats();
  st.attempts  = (st.attempts  || 0) + 1;
  st.correct   = (st.correct   || 0) + (correct ? 1 : 0);
  st.bestStreak = Math.max(st.bestStreak || 0, rBrain.maxStreak);
  const ck = 'cat_' + s.cat;
  if (!st[ck]) st[ck] = { attempts: 0, correct: 0 };
  st[ck].attempts++;
  if (correct) st[ck].correct++;
  saveRandoriStats(st);

  renderRandoriQuiz();
}

// ── NEXT QUESTION ─────────────────────────────────
function nextRandoriQuestion() {
  if (rBrain.idx + 1 >= rBrain.scenarios.length) {
    renderRandoriResults();
    return;
  }
  rBrain.idx++;
  rBrain.answered  = false;
  rBrain.chosenIdx = -1;
  renderRandoriQuiz();
}

// ── RESULTS SCREEN ────────────────────────────────
function renderRandoriResults() {
  rBrain.screen = 'results';
  const total = rBrain.scenarios.length;
  const score = rBrain.score;
  const pct   = Math.round(score / total * 100);

  let grade, gradeColor, gradeMsg;
  if      (pct >= 90) { grade = 'Ippon!';       gradeColor = '#27ae60'; gradeMsg = 'Outstanding. Your randori brain is sharp.'; }
  else if (pct >= 70) { grade = 'Waza-ari';     gradeColor = '#2980b9'; gradeMsg = 'Solid. A few more sessions and you\'ll be dominant.'; }
  else if (pct >= 50) { grade = 'Yuko';         gradeColor = '#e67e22'; gradeMsg = 'Good foundation — focus on the categories you missed.'; }
  else                { grade = 'Keep drilling'; gradeColor = '#e02d2d'; gradeMsg = 'Every mistake is a lesson. Read the feedback and go again.'; }

  document.getElementById('rb-body').innerHTML = `
    <div class="rb-results">
      <div class="rb-res-grade" style="color:${gradeColor}">${grade}</div>
      <div class="rb-res-score">${score} / ${total}</div>
      <div class="rb-res-pct">${pct}% correct</div>
      <div class="rb-res-msg">${gradeMsg}</div>
      ${rBrain.maxStreak > 2 ? `<div class="rb-res-streak">🔥 Best streak: ${rBrain.maxStreak}</div>` : ''}
      <div class="rb-res-actions">
        <button class="btn-primary rb-res-btn" onclick="startRandoriQuiz('${rBrain.catFilter}')">Play Again</button>
        <button class="rb-res-btn rb-res-back" onclick="renderRandoriHub()">← Back to Hub</button>
      </div>
    </div>`;
}
