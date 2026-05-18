// ── MON GRADE PROGRESS ─────────────────────────────
function getMonProgress() {
  return JSON.parse(localStorage.getItem('judo_mon_progress') || '{}');
}
function saveMonProgress(p) {
  localStorage.setItem('judo_mon_progress', JSON.stringify(p));
}
function monKey(grade, item) {
  return 'mon' + grade + '_' + item.replace(/[^a-z0-9]/gi, '_');
}
function toggleMonItem(grade, item) {
  const p = getMonProgress();
  const k = monKey(grade, item);
  p[k] = !p[k];
  saveMonProgress(p);
  renderMon();
}

// ── BELT COLOURS ────────────────────────────────────
// Official BJA Mon Grade belt colours (January 2025 syllabus)
const MON_BANDS = [
  { band: 1, grades: [1,2,3],   beltColor: '#e53e3e', tagColor: '#f1c40f',
    label: 'Red Belt', tag: 'Yellow Tags (1–3)',   textColor: '#fff'    },
  { band: 2, grades: [4,5,6],   beltColor: '#f1c40f', tagColor: '#e53e3e',
    label: 'Yellow Belt', tag: 'Red Tags (4–6)',   textColor: '#5a4000' },
  { band: 3, grades: [7,8,9],   beltColor: '#e67e22', tagColor: '#e53e3e',
    label: 'Orange Belt', tag: 'Red Tags (7–9)',   textColor: '#fff'    },
  { band: 4, grades: [10,11,12], beltColor: '#27ae60', tagColor: '#e53e3e',
    label: 'Green Belt', tag: 'Red Tags (10–12)', textColor: '#fff'    },
  { band: 5, grades: [13,14,15], beltColor: '#2980b9', tagColor: '#e53e3e',
    label: 'Blue Belt',  tag: 'Red Tags (13–15)', textColor: '#fff'    },
  { band: 6, grades: [16,17,18], beltColor: '#795548', tagColor: '#e53e3e',
    label: 'Brown Belt', tag: 'Red Tags (16–18)', textColor: '#fff'    },
];

// ── MON GRADE DATA ──────────────────────────────────
// Source: BJA Mon Grade Promotion Syllabus, January 2025
// Each entry covers the grading FROM the previous grade TO this grade number.
const MON_DATA = [

  // ── RED BELT ─────────────────────────────────────
  {
    id: 1, band: 1,
    fromLabel: 'Novice (White Belt)',
    ageRec: '8–10 yrs',
    groups: [
      { title: '🛡️ Ukemi (Breakfalls)', items: [
        'Ushiro-ukemi — rear breakfall',
      ]},
      { title: '🥋 Tachi-waza (Standing)', items: [
        'O-soto-otoshi — major outer drop throw',
      ]},
      { title: '📌 Osae-komi-waza (Holds)', items: [
        'Kesa-gatame — scarf hold',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Transition: O-soto-otoshi into Kesa-gatame',
        'Escape from Kesa-gatame by trapping Uke\'s leg',
      ]},
      { title: '⭐ Personal Choice', items: [
        'One additional tachi-waza of your choice',
        'One additional osaekomi-waza of your choice',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'Meaning of: Hajime (begin), Mate (stop), Rei (bow)',
        'In which country was Judo devised?',
        'Japanese terms: Judogi, Judoka, Ne-waza, Osae-komi-waza, Tachi-waza, Ushiro-ukemi',
      ]},
    ],
  },
  {
    id: 2, band: 1,
    fromLabel: '1st Mon (Red + 1 Yellow Tag)',
    ageRec: '8–10 yrs',
    groups: [
      { title: '🛡️ Ukemi (Breakfalls)', items: [
        'Yoko-ukemi — side breakfall',
      ]},
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Deashi-barai — advancing foot sweep',
      ]},
      { title: '📌 Osae-komi-waza (Holds)', items: [
        'Mune-gatame — chest hold',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Transition: Deashi-barai into Mune-gatame',
        'Escape from Mune-gatame using \'bridge and roll\'',
      ]},
      { title: '⭐ Personal Choice', items: [
        'One additional tachi-waza of your choice',
        'One additional osaekomi-waza of your choice',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'Meaning of: Osae-komi (holding), Randori (free practice), Toketa (hold broken)',
        'Correct procedure for standing and kneeling bows',
        'Who was the founder of modern Judo?',
        'What is the Judo Moral Code?',
        'Japanese terms: Deashi-barai, Mune-gatame, Osae-komi, Randori, Rei, Toketa, Yoko-ukemi',
      ]},
    ],
  },
  {
    id: 3, band: 1,
    fromLabel: '2nd Mon (Red + 2 Yellow Tags)',
    ageRec: '8–10 yrs',
    groups: [
      { title: '🛡️ Ukemi (Breakfalls)', items: [
        'Mae-mawari-ukemi — forward rolling breakfall (3 versions)',
      ]},
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Uki-goshi — floating hip throw',
      ]},
      { title: '📌 Osae-komi-waza (Holds)', items: [
        'Kuzure-kesa-gatame — modified scarf hold',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Transition: Uki-goshi into Kuzure-kesa-gatame',
        'Escape from Kuzure-kesa-gatame using \'sit up and push\'',
      ]},
      { title: '⭐ Personal Choice', items: [
        'One additional tachi-waza of your choice',
        'One additional osaekomi-waza of your choice',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'Meaning of: Dojo, Judogi, Zori, Uke, Tori',
        'Correct wearing of judogi and tying of belt',
        'Japanese terms: Dojo, Judogi, Kuzure-kesa-gatame, Mae-mawari-ukemi, Tori, Uke, Uki-goshi, Zori',
      ]},
    ],
  },

  // ── YELLOW BELT ───────────────────────────────────
  {
    id: 4, band: 2,
    fromLabel: '3rd Mon (Red + 3 Yellow Tags)',
    ageRec: '8–10 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Tai-otoshi — body drop throw',
      ]},
      { title: '📌 Osae-komi-waza (Holds)', items: [
        'Yoko-shiho-gatame — side four quarters hold',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Transition: Tai-otoshi into Yoko-shiho-gatame',
        'Escape from Yoko-shiho-gatame using \'trap, bridge and roll\'',
        'With Uke face-down, turn them into Yoko-shiho-gatame',
      ]},
      { title: '✊ Kumi-kata (Gripping)', items: [
        'Demonstrate the right and left standard grips',
      ]},
      { title: '⭐ Personal Choice', items: [
        'One additional tachi-waza of your choice',
        'One additional osaekomi-waza of your choice',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'Meaning of all Japanese terminology used in this grade',
        'Basic knowledge of the Judo Moral Code',
        'Japanese terms: Kumi-kata, Tai-otoshi, Yoko-shiho-gatame',
      ]},
    ],
  },
  {
    id: 5, band: 2,
    fromLabel: '4th Mon (Yellow + 1 Red Tag)',
    ageRec: '8–10 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Ippon-seoi-nage — one arm shoulder throw',
      ]},
      { title: '📌 Osae-komi-waza (Holds)', items: [
        'Kami-shiho-gatame — upper four quarters hold',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Transition: Ippon-seoi-nage into Kami-shiho-gatame',
        'With Uke in \'all fours\' position, turn them into Kesa-gatame',
        'Escape from Kami-shiho-gatame using \'action and reaction\'',
      ]},
      { title: '✊ Kumi-kata (Gripping)', items: [
        'Demonstrate alternatives to the right and left standard grips',
      ]},
      { title: '⭐ Personal Choice', items: [
        'One additional tachi-waza of your choice',
        'One additional osaekomi-waza of your choice',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'Know the meaning of all Japanese terminology in this grade',
        'Sound knowledge of the Judo Moral Code',
        'Japanese terms: Ippon-seoi-nage, Kami-shiho-gatame',
      ]},
    ],
  },
  {
    id: 6, band: 2,
    fromLabel: '5th Mon (Yellow + 2 Red Tags)',
    ageRec: '8–10 yrs',
    groups: [
      { title: '🛡️ Ukemi (Breakfalls)', items: [
        'Mae-ukemi — front breakfall',
      ]},
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Ouchi-gari — major inner reaping throw',
      ]},
      { title: '📌 Osae-komi-waza (Holds)', items: [
        'Tate-shiho-gatame — lengthwise four quarters hold',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Transition: Ouchi-gari into Tate-shiho-gatame',
        'Escape from Tate-shiho-gatame using \'clamp and roll\'',
        'With Uke in \'all fours\' position, turn them into Mune-gatame',
      ]},
      { title: '✊ Kumi-kata (Gripping)', items: [
        'Demonstrate double lapel grip',
        'Demonstrate high collar grip',
      ]},
      { title: '🤸 Nage-komi / Randori', items: [
        'Demonstrate Nage-komi with a cooperative partner (~2 min light randori)',
        'Alternate throwing your partner — variety of techniques, both sides if possible',
      ]},
      { title: '⭐ Personal Choice', items: [
        'One additional tachi-waza of your choice',
        'One additional osaekomi-waza of your choice',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'Know the meaning of all Japanese terminology in this grade',
        'Give two examples of actions against the contest rules',
        'Japanese terms: Mae-ukemi, Nage-komi, Ouchi-gari, Randori, Tate-shiho-gatame',
      ]},
    ],
  },

  // ── ORANGE BELT ───────────────────────────────────
  {
    id: 7, band: 3,
    fromLabel: '6th Mon (Yellow + 3 Red Tags)',
    ageRec: '8–11 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Ko-uchi-gari — minor inner reaping throw',
        'Tsuri-komi-goshi — drawing hip throw',
        'O-goshi — major hip throw',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Combination: Ouchi-gari into Ko-uchi-gari',
        'Combination: Ko-uchi-gari into O-soto-gari or O-soto-gake',
        'Counter: Ouchi-gari countered by Tsuri-komi-goshi',
        'Ne-waza: Escape from Kesa-gatame using \'bridge and roll\'',
        'Ne-waza: Move into Kesa-gatame from between Uke\'s legs',
      ]},
      { title: '🤸 Randori', items: [
        'Light Randori with a cooperative partner (~3 min)',
        'Variety of techniques and kumi-kata — throws to both sides if possible',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Two tachi-waza of your choice',
        'One ne-waza technique of your choice',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'Give two examples of actions against the contest rules',
        'Name three items from the Judo Moral Code',
        'Meaning of: Waza-ari-awasete-ippon',
        'All Japanese terminology in this grade',
        'Correct procedure for entering and leaving the mat for a contest',
        'Japanese terms: Ko-uchi-gari, O-goshi, Tsuri-komi-goshi, Waza-ari-awasete-ippon, Yoko-shiho-gatame',
      ]},
    ],
  },
  {
    id: 8, band: 3,
    fromLabel: '7th Mon (Orange + 1 Red Tag)',
    ageRec: '8–11 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Ko-soto-gari — minor outer reaping throw',
        'Ko-soto-gake — minor outer hook throw',
        'Morote-seoi-nage — two-handed shoulder throw',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Combination: Ko-uchi-gari into Morote-seoi-nage',
        'Counter: Tai-otoshi countered by Ko-soto-gake or Ko-soto-gari',
        'Ne-waza: Move into Yoko-shiho-gatame from between Uke\'s legs',
        'Ne-waza: Turnover from underneath Uke into Tate-shiho-gatame',
      ]},
      { title: '🤸 Randori', items: [
        'Light Randori with a cooperative partner (~3 min)',
        'Variety of techniques and kumi-kata — throws to both sides if possible',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Two tachi-waza of your choice',
        'One ne-waza technique of your choice',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'Name three items from the Judo Moral Code',
        'All Japanese terminology in this grade',
        'Meaning of: Shido (minor infringement), Hansoku-make (disqualification)',
        'Referee signals: Mate, Osaekomi, Toketa, Adjusting the judogi',
        'Give two examples of actions (not grips) against the contest rules',
        'Japanese terms: Ko-soto-gake, Ko-soto-gari, Morote-seoi-nage, Shido, Hansoku-make',
      ]},
    ],
  },
  {
    id: 9, band: 3,
    fromLabel: '8th Mon (Orange + 2 Red Tags)',
    ageRec: '8–11 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'O-soto-gari — major outer reaping throw',
        'Seoi-otoshi — shoulder drop throw',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Combination: Ippon-seoi-nage into Ko-uchi-gari',
        'Any technique as a combination with Seoi-otoshi',
        'Any technique as a combination with Ko-uchi-gari',
        'Ne-waza: Arm roll with Uke approaching from the front',
        'Ne-waza: Arm roll with Uke approaching from behind',
      ]},
      { title: '🤸 Randori', items: [
        'Light Randori with a cooperative partner (~3 min)',
        'Variety of techniques and kumi-kata — throws to both sides if possible',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Two tachi-waza of your choice',
        'One ne-waza technique of your choice',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'Name three items from the Judo Moral Code',
        'All Japanese terminology in this grade',
        'Meaning of: Hiki-wake (draw)',
        'Give two examples of grips against the contest rules',
        'Japanese terms: O-soto-gari, Seoi-otoshi, Hiki-wake',
      ]},
    ],
  },

  // ── GREEN BELT ────────────────────────────────────
  {
    id: 10, band: 4,
    fromLabel: '9th Mon (Orange + 3 Red Tags)',
    ageRec: '11–15 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Harai-goshi — sweeping hip throw',
        'Uchi-mata — inner thigh throw',
      ]},
      { title: '🔒 Kansetsu-waza (Arm Locks)', items: [
        'Ude-gatame — straight arm lock (controlled — not to submission)',
        'Waki-gatame — armlock applied with the armpit (controlled)',
      ]},
      { title: '🤸 Randori', items: [
        'Light Randori with a cooperative partner (~3 min)',
        'Demonstrate combinations and counters during randori',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Four techniques demonstrated individually',
        'Show those techniques as combinations and counters',
        'Demonstrate as: combination, counter, AND transition into ne-waza',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'All Japanese terminology in this grade',
        'Japanese terms: Harai-goshi, Kan-setsu-waza, Uchi-mata, Ude-gatame, Waki-gatame',
      ]},
    ],
  },
  {
    id: 11, band: 4,
    fromLabel: '10th Mon (Green + 1 Red Tag)',
    ageRec: '11–15 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Hiza-guruma — knee wheel throw',
        'Sasae-tsuri-komi-ashi — propping drawing ankle throw',
      ]},
      { title: '🔒 Kansetsu-waza (Arm Locks)', items: [
        'Juji-gatame — cross arm lock: sit-back entry',
        'Juji-gatame — cross arm lock: rollover entry',
        'Hiza-gatame — arm lock applied with the knee',
      ]},
      { title: '🤸 Randori', items: [
        'Light Randori with a cooperative partner (~3 min)',
        'Demonstrate combinations and counters during randori',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Four techniques demonstrated individually',
        'Show as combinations and counters, including ne-waza transitions',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'All Japanese terminology in this grade',
        'Japanese terms: Hiza-gatame, Hiza-guruma, Juji-gatame, Kan-setsu-waza, Sasae-tsuri-komi-ashi',
      ]},
    ],
  },
  {
    id: 12, band: 4,
    fromLabel: '11th Mon (Green + 2 Red Tags)',
    ageRec: '11–15 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Hane-goshi — spring hip throw',
        'Okuri-ashi-barai — double foot sweep throw',
        'Morote-eri-seoi-nage — two-handed lapel shoulder throw',
      ]},
      { title: '🔒 Kansetsu-waza (Arm Locks)', items: [
        'Juji-gatame — entry over the shoulder',
        'Juji-gatame — entry from beneath',
      ]},
      { title: '🤸 Randori', items: [
        'Light Randori with a cooperative partner (~3 min)',
        'Demonstrate combinations and counters during randori',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Four techniques demonstrated individually',
        'Show as combinations and counters, including ne-waza transitions',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'All Japanese terminology in this grade',
        'Japanese terms: Hane-goshi, Juji-gatame, Morote-eri-seoi-nage, Okuri-ashi-barai',
      ]},
    ],
  },

  // ── BLUE BELT ─────────────────────────────────────
  {
    id: 13, band: 5,
    fromLabel: '12th Mon (Green + 3 Red Tags)',
    ageRec: '11–15 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Tani-otoshi — valley drop throw',
        'Yoko-guruma — side wheel throw',
      ]},
      { title: '🔒 Kansetsu-waza (Arm Locks)', items: [
        'Ude-garami — entangled arm lock',
        'Ne-waza: Ude-garami from Kuzure-kesa-gatame',
      ]},
      { title: '🤸 Randori', items: [
        'Randori — attacking and defending with a cooperative partner (~3 min)',
        'Demonstrate combinations and counters during randori',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Four techniques individually, then as combinations and counters',
        'Show understanding of judo principles — adapt to different opponents',
        'Combinations/counters can be tachi-waza, ne-waza, or both',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'All Japanese terminology in this grade',
        'Japanese terms: Kuzure-kesa-gatame, Tani-otoshi, Ude-garami, Yoko-guruma',
      ]},
    ],
  },
  {
    id: 14, band: 5,
    fromLabel: '13th Mon (Blue + 1 Red Tag)',
    ageRec: '11–15 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Tomoe-nage — circle throw',
        'Yoko-tomoe-nage — side circle throw',
      ]},
      { title: '🔴 Shime-waza (Strangles — controlled)', items: [
        'Okuri-eri-jime — sliding collar strangle',
        'Kata-juji-jime — half cross strangle',
        'Nami-juji-jime — normal cross strangle',
        'Gyaku-juji-jime — reverse cross strangle',
      ]},
      { title: '🤼 Shime-waza Situations', items: [
        'Nami-juji-jime — Uke underneath (between Tori\'s legs)',
        'Gyaku-juji-jime — Uke on top (between Tori\'s legs)',
        'Okuri-eri-jime — Uke attempts a dropping attack',
      ]},
      { title: '🤸 Randori', items: [
        'Randori — attacking and defending (~3 min)',
        'Demonstrate combinations and counters',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Four techniques individually, then as combinations and counters',
        'Combinations/counters can be tachi-waza, ne-waza, or both',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'All Japanese terminology in this grade',
        'Japanese terms: Gyaku-juji-jime, Kata-juji-jime, Nami-juji-jime, Okuri-eri-jime, Tomoe-nage, Yoko-tomoe-nage',
      ]},
    ],
  },
  {
    id: 15, band: 5,
    fromLabel: '14th Mon (Blue + 2 Red Tags)',
    ageRec: '11–15 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Uki-waza — floating throw',
        'Soto-maki-komi — outside winding throw',
      ]},
      { title: '🔴 Shime-waza (Strangles — controlled)', items: [
        'Koshi-jime — strangle using the hip',
        'Kata-te-jime — strangle with one hand',
      ]},
      { title: '🤼 Shime-waza Situations', items: [
        'Koshi-jime — Uke has attempted a dropping attack',
        'Kata-te-jime — Uke in \'all fours\' position',
      ]},
      { title: '🤸 Randori', items: [
        'Randori — attacking and defending (~3 min)',
        'Demonstrate combinations and counters',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Four techniques individually, then as combinations and counters',
        'Combinations/counters can be tachi-waza, ne-waza, or both',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'All Japanese terminology in this grade',
        'Japanese terms: Kata-te-jime, Koshi-jime, Shime-waza, Soto-maki-komi, Uki-waza',
      ]},
    ],
  },

  // ── BROWN BELT ────────────────────────────────────
  {
    id: 16, band: 6,
    fromLabel: '15th Mon (Blue + 3 Red Tags)',
    ageRec: '13–15 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Uki-otoshi — floating drop throw',
        'Koshi-guruma — hip wheel throw',
        'Ura-nage — rear throw (safety focus — full throw not required)',
      ]},
      { title: '🔴 Shime-waza (Strangles — controlled)', items: [
        'Kata-ha-jime — single collar strangle',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Counter: Koshi-guruma with Ura-nage',
        'Kata-ha-jime — Uke in \'all fours\' position',
      ]},
      { title: '🤸 Randori', items: [
        'Randori — attacking and defending (~3 min)',
        'Demonstrate combinations and counters',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Four techniques individually, then as combinations and counters',
        'Combinations/counters can be tachi-waza, ne-waza, or both',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'All Japanese terminology in this grade',
        'Japanese terms: Kata-ha-jime, Koshi-guruma, Uki-otoshi, Ura-nage',
      ]},
    ],
  },
  {
    id: 17, band: 6,
    fromLabel: '16th Mon (Brown + 1 Red Tag)',
    ageRec: '13–15 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Ushiro-goshi — rear hip throw',
        'Sumi-gaeshi — corner throw',
        'Yoko-gake — side hook throw',
      ]},
      { title: '🔴 Shime-waza (Strangles — controlled)', items: [
        'Hadaka-jime — naked strangle',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Combination: Sumi-gaeshi as a combination with Uchi-mata',
        'Counter: Ushiro-goshi as a counter to Harai-goshi',
        'Hadaka-jime — Uke in a face-down prone position',
      ]},
      { title: '🤸 Randori', items: [
        'Randori — attacking and defending (~3 min)',
        'Demonstrate combinations and counters',
      ]},
      { title: '⭐ Personal Choice', items: [
        'Four techniques individually, then as combinations and counters',
        'Combinations/counters can be tachi-waza, ne-waza, or both',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'All Japanese terminology in this grade',
        'Japanese terms: Hadaka-jime, Sumi-gaeshi, Ushiro-goshi, Yoko-gake',
      ]},
    ],
  },
  {
    id: 18, band: 6,
    fromLabel: '17th Mon (Brown + 2 Red Tags)',
    ageRec: '13–15 yrs',
    groups: [
      { title: '🥋 Tachi-waza (Standing)', items: [
        'Sode-tsuri-komi-goshi — sleeve lift pull hip throw',
        'Ko-uchi-gake-maki-komi — minor inner hook thigh winding throw',
      ]},
      { title: '🔴 Shime-waza (Strangles — controlled)', items: [
        'San-gaku-jime — triangular strangle',
      ]},
      { title: '🤼 Performance Skills', items: [
        'Demonstrate any two variations of Sumi-gaeshi',
        'Ne-waza: San-gaku-gatame — complex entry',
        'Ne-waza: San-gaku-jime — complex entry',
        'Ne-waza: San-gaku-osae-gatame — turnover and hold',
      ]},
      { title: '🤸 Randori', items: [
        'Randori — attacking and defending (~3 min)',
        'Demonstrate combinations and counters',
      ]},
      { title: '⭐ Personal Choice (choose one)', items: [
        'OPTION A: Four techniques individually, then as combinations and counters',
        'OPTION B: Demonstrate one set of Nage-no-kata OR Katame-no-kata',
      ]},
      { title: '🧠 Supplementary Knowledge', items: [
        'All Japanese terminology in this grade',
        'Give three examples of any competition rule penalties',
        'Japanese terms: Kata, Katame-no-kata, Ko-uchi-gake-maki-komi, Nage-no-kata, San-gaku-gatame, San-gaku-jime, San-gaku-osae-gatame, Sode-tsuri-komi-goshi, Sumi-gaeshi',
      ]},
    ],
  },

];

// ── VIDEO HELPER ────────────────────────────────────
// Maps BJA syllabus spelling → TECHNIQUES array name where they differ
const MON_NAME_ALIASES = {
  'Deashi-barai':           'Deashi-harai',
  'Okuri-ashi-barai':       'Okuri-ashi-harai',
  'Tsuri-komi-goshi':       'Tsurikomi-goshi',
  'Sode-tsuri-komi-goshi':  'Sode-tsurikomi-goshi',
  'Sasae-tsuri-komi-ashi':  'Sasae-tsurikomi-ashi',
  'Hiza-gatame':            'Ude-hishigi-hiza-gatame',
  'Ude-gatame':             'Ude-hishigi-ude-gatame',
  'San-gaku-jime':          'Sankaku-jime',
  'Soto-maki-komi':         'Soto-makikomi',
  // Ne-waza: prefixed entries
  'Ne-waza: San-gaku-jime':         'Sankaku-jime',
  'Ne-waza: San-gaku-gatame':       'Sankaku-gatame',
  'Ne-waza: San-gaku-osae-gatame':  'Sankaku-gatame',
};

// Extract technique name from "Tai-otoshi — body drop throw" and check TECHNIQUES
function monItemTechName(itemStr) {
  let raw = itemStr.split(/\s+[—–-]\s+/)[0].trim();
  if (!raw || raw.length < 3) return null;
  const name = MON_NAME_ALIASES[raw] || raw;
  const tech = TECHNIQUES.find(t => t.name === name);
  return (tech && getVideoId(tech.url)) ? name : null;
}

// ── RENDER ──────────────────────────────────────────
function renderMon() {
  const progress = getMonProgress();

  const gradeStats = (gradeId) => {
    const g = MON_DATA.find(d => d.id === gradeId);
    if (!g) return { done: 0, total: 0 };
    const total = g.groups.reduce((s, gr) => s + gr.items.length, 0);
    const done  = g.groups.reduce((s, gr) =>
      s + gr.items.filter(item => progress[monKey(gradeId, item)]).length, 0);
    return { done, total };
  };

  const html = `
    <div class="mon-intro">
      <div class="mon-intro-emoji">🥋</div>
      <div class="mon-intro-title">Mon Grade Tracker</div>
      <div class="mon-intro-sub">Junior BJA syllabus — 18 grades. Tick off each requirement as you nail it! All progress saves automatically.</div>
    </div>

    ${MON_BANDS.map(band => {
      const allKeys = band.grades.flatMap(g => {
        const gd = MON_DATA.find(d => d.id === g);
        return gd ? gd.groups.flatMap(gr => gr.items.map(item => monKey(g, item))) : [];
      });
      const bandDone    = allKeys.filter(k => progress[k]).length;
      const bandTotal   = allKeys.length;
      const bandPct     = bandTotal ? Math.round(bandDone / bandTotal * 100) : 0;
      const bandComplete = bandDone === bandTotal && bandTotal > 0;

      return `
      <div class="mon-band">
        <div class="mon-band-header" onclick="toggleMonBand(${band.band})" style="border-left:5px solid ${band.beltColor}">
          <div class="mon-band-belt-vis">
            <div class="mon-belt-bar" style="background:${band.beltColor}"></div>
            <div class="mon-belt-tag" style="background:${band.tagColor}"></div>
          </div>
          <div class="mon-band-info">
            <div class="mon-band-name">${bandComplete ? '🏆 ' : ''}${band.label}</div>
            <div class="mon-band-sub">${band.tag}</div>
          </div>
          <div class="mon-band-right">
            <div class="mon-band-pct-bar">
              <div class="mon-band-pct-fill" style="width:${bandPct}%;background:${band.beltColor}"></div>
            </div>
            <div class="mon-band-pct-label">${bandDone}/${bandTotal}</div>
            <div class="mon-band-chev" id="mon-band-chev-${band.band}">▼</div>
          </div>
        </div>
        <div class="mon-band-body" id="mon-band-body-${band.band}" style="display:none">
          ${band.grades.map(gradeId => {
            const g = MON_DATA.find(d => d.id === gradeId);
            if (!g) return '';
            const { done, total } = gradeStats(gradeId);
            const pct      = total ? Math.round(done / total * 100) : 0;
            const complete = done === total && total > 0;
            return `
            <div class="mon-grade-card${complete ? ' mon-grade-complete' : ''}">
              <div class="mon-grade-header" onclick="toggleMonGrade(${gradeId})" style="border-left:4px solid ${band.beltColor}">
                <div class="mon-grade-badge" style="background:${band.beltColor};color:${band.textColor}">
                  ${complete ? '🏆' : gradeId + nth(gradeId)}
                </div>
                <div class="mon-grade-meta">
                  <div class="mon-grade-title">${gradeId}${nth(gradeId)} Mon${complete ? ' ✅' : ''}</div>
                  <div class="mon-grade-from">From: ${g.fromLabel}</div>
                  <div class="mon-grade-age">Age: ${g.ageRec}</div>
                  <div class="mon-progress-bar-wrap">
                    <div class="mon-progress-bar" style="width:${pct}%;background:${band.beltColor}"></div>
                  </div>
                  <div class="mon-progress-label">${done} / ${total} done${complete ? ' — Amazing! 🎉' : ''}</div>
                </div>
                <div class="mon-grade-chev" id="mon-grade-chev-${gradeId}">›</div>
              </div>
              <div class="mon-grade-body" id="mon-grade-body-${gradeId}" style="display:none">
                ${g.groups.map(group => `
                  <div class="mon-group">
                    <div class="mon-group-title">${group.title}</div>
                    ${group.items.map(item => {
                      const k         = monKey(gradeId, item);
                      const checked   = !!progress[k];
                      const watchName = monItemTechName(item);
                      const safeName  = watchName ? watchName.replace(/\\/g,'\\\\').replace(/'/g,"\\'") : '';
                      return `
                      <div class="mon-item${checked ? ' mon-item-done' : ''}"
                           onclick="toggleMonItem(${gradeId}, '${item.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}')">
                        <div class="mon-check" style="border-color:${band.beltColor};${checked ? 'background:'+band.beltColor : ''}">
                          ${checked ? `<span style="color:${band.textColor};font-weight:700;font-size:13px">✓</span>` : ''}
                        </div>
                        <span class="mon-item-text${checked ? ' mon-item-text-done' : ''}">${item}</span>
                        ${watchName ? `<button class="mon-item-watch" onclick="event.stopPropagation();openModal('${safeName}')">▶ Watch</button>` : ''}
                      </div>`;
                    }).join('')}
                  </div>
                `).join('')}
                ${complete ? `
                  <div class="mon-complete-msg" style="border-color:${band.beltColor};color:${band.beltColor}">
                    🎉 ${gradeId}${nth(gradeId)} Mon complete — fantastic work!
                  </div>` : ''}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('')}
  `;

  document.getElementById('belt-tab-content').innerHTML = html;

  // Auto-open bands 2 (Yellow) and 3 (Orange) since son is grades 4–9
  [2, 3].forEach(b => openMonBand(b));

  // Re-apply open state for grades
  Object.entries(monGradeOpen).forEach(([g, open]) => {
    if (open) _openMonGrade(parseInt(g));
  });
}

function nth(n) {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

const monBandOpen  = {};
const monGradeOpen = {};

function toggleMonBand(band) {
  monBandOpen[band] = !monBandOpen[band];
  const body = document.getElementById('mon-band-body-' + band);
  const chev = document.getElementById('mon-band-chev-' + band);
  if (body) body.style.display = monBandOpen[band] ? 'block' : 'none';
  if (chev) chev.textContent  = monBandOpen[band] ? '▲' : '▼';
}

function openMonBand(band) {
  monBandOpen[band] = true;
  const body = document.getElementById('mon-band-body-' + band);
  const chev = document.getElementById('mon-band-chev-' + band);
  if (body) body.style.display = 'block';
  if (chev) chev.textContent  = '▲';
}

function toggleMonGrade(gradeId) {
  monGradeOpen[gradeId] = !monGradeOpen[gradeId];
  _openMonGrade(gradeId);
}

function _openMonGrade(gradeId) {
  const open = monGradeOpen[gradeId];
  const body = document.getElementById('mon-grade-body-' + gradeId);
  const chev = document.getElementById('mon-grade-chev-' + gradeId);
  if (body) body.style.display = open ? 'block' : 'none';
  if (chev) chev.textContent  = open ? '↓' : '›';
}
