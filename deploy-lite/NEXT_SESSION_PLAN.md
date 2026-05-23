# Dojo Master — Next Session Plan
## Goal: Make the app feel solid, complete, and genuinely useful for a judoka

---

## BLOCK 1 — Lesson Content (biggest impact, do first)
**Problem:** 97% of the 226 technique lessons show identical generic content.
Only 8 have real breakdown cards, 7 real tips, 4 real mistakes.

**Fix:** Build a `TECHNIQUE_DATA` object in data.js covering all belt path techniques with:
- 3-step breakdown (technique-specific icon + label + instruction)
- 2 common mistakes (specific to each technique)
- 1 Sensei tip (concise, coaching-voice)
- category tag (throw / hold / strangle / lock / ukemi / knowledge)

Prioritise the ~80 techniques that appear most in grading paths.
For knowledge items (Terminology, Contest Rules, Moral Code) the lesson format
changes to a flashcard/definition layout rather than video+breakdown.

---

## BLOCK 2 — Quiz Overhaul
**Problem:** Every quiz asks "What does X mean?" — one question type, gets boring fast.

**Fix:** 4 rotating question types based on what data is available:
1. Translation — "What does Harai-goshi mean?" (existing, keep)
2. Category — "Which type of technique is Uchi-mata?" (Tachi-waza / Ne-waza / etc.)
3. Position — "Kesa-gatame is a hold applied from which position?" (multiple choice)
4. Belt level — "At which belt is Harai-goshi introduced?" (multiple choice)

Knowledge items (terminology tiles) get a different quiz:
- Show English, pick Japanese term

---

## BLOCK 3 — Navigation Polish (quick wins)
**Problems:**
- Lesson back button says "Back" with no context
- Nav bar loses its highlight when inside lesson/success/belt-promo screens
- "Other belts" switcher at bottom of home path is hard to use

**Fixes:**
- Back button: dynamically set "← Back to Learn" or "← Back to Practice"
  (already have `_returnScreen`, just update the label text in `open()`)
- Nav highlight: call `updateNavHighlight(navName)` when entering lesson,
  passing the return screen's nav name so the right tab stays lit
- Other belts: replace tiny pills with a small horizontal scroll strip with
  belt colour dots + progress %, slightly larger tap targets

---

## BLOCK 4 — Grading Readiness Checklist
**Problem:** App teaches techniques but doesn't answer "am I ready to grade?"
The BJA syllabus requires techniques + terminology + knowledge + moral code.
All this data is already in BELT_DATA groups — it's not surfaced.

**Fix:** Add a "Grading Checklist" view accessible from the Learn home screen
(button below the belt header card). Shows per-group completion:
- ✅ Fundamental Tachi-waza (3/3)
- ✅ Fundamental Osaekomi-waza (3/3)
- 🔒 Performance — Combinations (0/5)
- ✅ Knowledge — Terminology (11/11)
- ✅ Moral Code (8/8)

Uses existing `isDone()` state — no new storage needed.
Show overall % and a clear "Ready / Not Ready" indicator.

---

## BLOCK 5 — Hearts System Completion
**Problem:** Losing hearts works but reaching 0 does nothing — dead-end UX.

**Fix:**
- 0 hearts → show overlay card "Hearts depleted — come back tomorrow!"
  with a countdown to midnight reset (hearts already reset daily)
- Wrong answer → animated heart shake in HUD, not just silent removal
- 3-streak → show "+STREAK BONUS" toast when XP is awarded

---

## BLOCK 6 — Practice Drills (real content)
**Problem:** 0 drills currently defined in dojo_practice.js.

**Fix:** Add 12 real drills organised by belt level:

White-Red:
- Ushiro Ukemi — 3 sets of 10 (with rest timer)
- Uchi-komi Osoto-otoshi — 5 sets of 10 each side
- Groundwork escape drill — 3 rounds

Yellow-Orange:
- Combination uchi-komi: Ouchi → Ko-uchi → Morote-seoi
- Grip fighting awareness drill
- Ne-waza transition rounds

Green+:
- Randori prep circuit
- Counter-technique drill pairs
- Kata movement drill (Nage-no-kata entry positions)

Each drill has: name, set/rep structure, rest timer, coaching cue.

---

## BLOCK 7 — Profile Progression Story
**Problem:** Profile shows raw numbers but no sense of journey.

**Fix — 3 additions:**
1. Per-belt progress bars — horizontal strip showing each belt's completion %
   with the belt colour. Immediately shows the whole journey at a glance.
2. Category mastery breakdown — small pill stats:
   "Throws: 12 ✓ | Holds: 8 ✓ | Grappling: 4 ✓"
3. First badge set (3 badges to start):
   - 🥋 First Throw — complete first technique
   - 🔥 On Fire — 3-day streak
   - ⭐ Belt Earned — complete all techniques for a belt

---

## BLOCK 8 — Lesson Knowledge Items (different layout)
**Problem:** Knowledge tiles (Terminology, Contest Rules, Moral Code, Questions)
currently open the same video+breakdown lesson layout which makes no sense.

**Fix:** Detect knowledge tiles by group title or item prefix and render a
different lesson layout:
- Flashcard style for terminology (front: Japanese term, flip: definition)
- Checklist style for contest rules (read and confirm)
- Moral code items link directly to the Dojo > Moral Code screen

---

## EXECUTION ORDER
1. BLOCK 3 nav polish (30 min — quick wins, makes everything feel better)
2. BLOCK 5 hearts completion (30 min)
3. BLOCK 1 lesson content — build TECHNIQUE_DATA for Red + Yellow belt first (2 hrs)
4. BLOCK 2 quiz overhaul (1 hr)
5. BLOCK 8 knowledge item layout (45 min)
6. BLOCK 4 grading checklist (1 hr)
7. BLOCK 6 practice drills (1 hr)
8. BLOCK 7 profile progression (1 hr)

Total estimate: ~8 hrs of focused work across 2 sessions.
Start with Blocks 3+5 since they're polish, then deep-dive Block 1.
