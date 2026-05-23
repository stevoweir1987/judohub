---
name: Dojo Modern
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is built for an intentional, high-performance learning environment. It targets disciplined learners who value focus over distraction. The visual style is **Corporate Modern with a Minimalist edge**, emphasizing clarity, structured progression, and a "flow state" atmosphere.

The core of the experience is the **Dojo**, which must feel like a sanctuary for deep work. This is achieved through increased negative space, reduced visual noise, and a focus on essential information. The emotional response should be one of calm confidence—shifting from the active, high-energy "Practice" mode to the meditative, focused "Dojo" mode.

## Colors
The palette uses **Dojo Modern** logic. The Primary Blue represents the "Study" and "Practice" phases—active, reliable, and clear. The Secondary Navy is used for the "Dojo" and deep navigation elements to ground the UI in authority and depth. Tertiary Green is reserved for mastery indicators and successful completion states.

The background uses a subtle off-white (`#F8FAFC`) to reduce eye strain during long sessions, while the Dojo section may utilize a darker "Focus Mode" variant where the Secondary Navy becomes the surface color to signal a shift in environment.

## Typography
**Plus Jakarta Sans** is the sole typeface, providing a contemporary, geometric, yet approachable feel. We use tight letter-spacing for headlines to create a sophisticated, editorial look. In the Dojo section, use `display-lg` sparingly for section headers to evoke a sense of importance. Body text maintains generous line-heights to ensure legibility during intense study sessions.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

The layout philosophy shifts between the four pillars:
- **Study & Practice:** More dense, utilizing sidebars for progress and modular cards for quick interactions.
- **Dojo:** Transitions to a centered, "Zen" layout with wider margins (80px+) on desktop to minimize peripheral distraction.
- **Profile:** A dashboard-style layout with varied card sizes for statistics and history.

Use an 8px base unit for all padding and margins to maintain mathematical harmony.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Ambient Shadows**. 
- Level 0: Main background (`#F8FAFC`).
- Level 1: Standard cards with a very soft, large-radius shadow (Blur: 20px, Opacity: 4% Black).
- Level 2: Active elements or modals with a tighter, slightly darker shadow.

In the Dojo, elevation is flattened. We move away from high-contrast shadows toward **low-contrast outlines** (1px solid `#E2E8F0`) to create a more grounded, permanent feel that doesn't "hover" or distract the user.

## Shapes
A **Rounded (0.5rem)** approach is standard for most components, providing a modern and friendly feel. However, for "Dojo" specific interactive elements, use `rounded-lg` (1rem) to soften the UI further, making the environment feel more organic and less rigid than the standard "Practice" interface.

## Components
### Navigation
The bottom bar (mobile) or sidebar (desktop) features four distinct icons: **Book (Study)**, **Target (Practice)**, **Gate/Enso (Dojo)**, and **User (Profile)**. The Dojo icon should have a unique active state (e.g., a soft glow or a distinct color shift to Secondary Navy).

### Buttons
- **Primary:** Solid Blue, 0.5rem radius, Plus Jakarta Sans Bold.
- **Dojo-Action:** Secondary Navy background with a subtle border, used specifically for "Enter Deep Learning" triggers.

### Cards
Cards in the Study section include progress bars. Cards in the Dojo are simplified, focusing on a single task or concept, often using a "Ghost" style with an outline rather than a shadow.

### Input Fields
Clean, minimal borders. When focused, the border transitions to Primary Blue with a 2px outer glow. In Dojo mode, the focus ring is more subtle to prevent visual jarring.

### Progress Indicators
Use circular "Enso" style rings for the Dojo to represent holistic completion, contrasting with the linear bars used in the standard Practice section.