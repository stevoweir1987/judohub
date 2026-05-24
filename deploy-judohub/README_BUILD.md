# JudoHub Build State

## Location
- Source: C:\Users\steve\Documents\Judo\deploy-judohub\

## Design System
- Premium dark: #131313 background, #f2ca50 gold primary
- Fonts: Plus Jakarta Sans (headlines) + Inter (body)
- Glass cards, gold glow, Material Symbols Outlined icons
- Design tokens in index.html Tailwind config

## Nav (5 tabs)
Home | Learn (Browse) | Grade (Syllabus) | Drills | Me (Profile)

## Screens
onboarding, home, browse, hub, card, grade, drills, profile

## Files (all v=1)
- index.html — shell, router, onboarding, Firebase init
- js/data.js (v5) — carried from deploy-lite
- js/firebase_sync.js (v2) — carried from deploy-lite
- js/jh_state.js — profile, recent, favs, pinned, progress, streak
- js/jh_home.js — Continue Learning hero, quick actions, today focus, recent
- js/jh_browse.js — search, filter chips, categories, A-Z, list rows
- js/jh_hub.js — technique hub hero, 8-card grid, all card content renderers
- js/jh_grade.js — belt picker, grading checklist with done toggles
- js/jh_drills.js — solo/band/partner drill library
- js/jh_profile.js — stats, favourites, settings

## Key patterns
- JHRouter.go(screenName, opts) — navigate
- JHHub.open(techId, beltId) — open technique
- JHHub.openCard(cardId) — open deep dive card
- YouTube thumbnails: img.youtube.com/vi/VIDEO_ID/hqdefault.jpg
- All modules are IIFEs: const JHFoo = (() => { ... })()
