---
name: JudoHub Gamified System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e5bdbd'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ac8888'
  outline-variant: '#5c3f40'
  surface-tint: '#ffb3b3'
  primary: '#ffb3b3'
  on-primary: '#680016'
  primary-container: '#ff5262'
  on-primary-container: '#5b0012'
  inverse-primary: '#bf0030'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474747'
  on-secondary-container: '#b6b5b4'
  tertiary: '#c5c5d3'
  on-tertiary: '#2e303a'
  tertiary-container: '#8f909c'
  on-tertiary-container: '#272933'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ffb3b3'
  on-primary-fixed: '#40000a'
  on-primary-fixed-variant: '#920022'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e1e1ef'
  tertiary-fixed-dim: '#c5c5d3'
  on-tertiary-fixed: '#191b25'
  on-tertiary-fixed-variant: '#444651'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '800'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
  button-text:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '800'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The brand personality is energetic, disciplined, and encouraging, mirroring the journey of a martial artist. It targets a broad demographic of learners who value structured progression and gamified motivation.

The design style is **Tactile Gamification**. It adapts the "Duolingo-style" physical UI—characterized by 3D-effect buttons, bold outlines, and illustrative elements—into a sleek, high-energy dark mode. The aesthetic emphasizes "physicality" in a digital space; buttons feel like they can be pressed down, and cards feel like tangible tiles. The emotional response is one of high stakes and high reward, using red accents to drive urgency and "belt colors" to signal status and achievement.

## Colors

The palette is anchored by a deep **Neutral Black (#121212)** background to ensure the vibrant accent colors pop with maximum contrast. 

- **Primary Red (#E62946):** Used for critical calls to action, active states, and brand-identifying flourishes. It is high-chroma to instill a sense of energy.
- **Surface Grey (#2C2C2C):** Used for card backgrounds and container layers to provide a softer contrast than pure black.
- **Belt Progression System:** These colors are reserved strictly for rank-based indicators, progress bars, and achievement badges. They follow the traditional Judo ranking: White, Yellow, Orange, Green, Blue, Brown, and Black. 
- **Functional Semantics:** Use Red for errors, Green for success (matching the Green Belt), and Yellow for warnings (matching the Yellow Belt).

## Typography

The system utilizes **Plus Jakarta Sans** for its friendly yet geometric and modern qualities. To achieve the "DIN-style" look requested, we rely heavily on the **Extra Bold (800)** weight for headings and buttons.

- **Headlines:** Always bold and tight-set. Use `headline-xl` for major achievement screens and `headline-lg` for standard page titles.
- **Body:** Set in Medium weight (500) to ensure readability against dark backgrounds without the "blooming" effect of pure white text.
- **Buttons:** Text is always uppercase with slight letter spacing to enhance the "pro" athletic aesthetic.
- **Numbers:** Large, bold weights are used for XP, streaks, and progress counts to make achievements feel substantial.

## Layout & Spacing

This design system uses a **Fluid Grid** model with high internal padding to maintain the "chunky," tactile feel. 

- **Grid:** A 12-column grid for desktop and a 4-column grid for mobile.
- **Gutter & Margins:** 16px gutters are standard. On mobile, we use a generous 20px side margin to prevent the rounded cards from feeling cramped.
- **Vertical Rhythm:** Spacing follows a 4px baseline, with 16px (stack-md) being the default gap between components.
- **Safe Areas:** On mobile, ensure large bottom-fixed containers (for 3D buttons) account for device home indicators with at least 32px of bottom padding.

## Elevation & Depth

Depth is created through **Tonal Layering** and **Shadow Offsets** rather than traditional blurs.

- **The 3D Effect:** Buttons and active cards use a "bottom-heavy" border (typically 4px-6px) in a darker shade of the element's color. This creates the illusion of height. When "pressed," the element translates Y-axis down by 2px-4px, and the bottom border shrinks, simulating physical displacement.
- **Cards:** Use a soft, high-spread ambient shadow (`0px 8px 24px rgba(0,0,0,0.4)`) to separate Surface Grey containers from the Neutral Black background.
- **Overlays:** Modals use a 60% black backdrop blur to keep focus on the tactile content tiers.

## Shapes

The shape language is extremely soft and approachable. 
- **Cards:** Use a `rounded-xl` (24px) radius to emphasize the friendly, gamified nature of the app.
- **Buttons:** Use a `rounded-lg` (16px) radius. This is slightly less rounded than cards to keep them feeling "sturdy."
- **Progress Bars:** Fully rounded (pill-shaped) to represent a continuous flow of energy.
- **Icons:** Contained within circular or heavily rounded square frames with consistent internal padding.

## Components

- **3D Primary Button:** High-contrast Red (#E62946) with a Dark Red (#A4161A) 4px bottom border. Text is white, uppercase, and bold.
- **Tactile Cards:** Surface Grey (#2C2C2C) background with a subtle 1px top-border highlight. Content inside (icons/text) should be centered.
- **Belt Progress Bars:** A grey track with a fill color corresponding to the user's current belt goal. Include a "glow" effect using a low-opacity shadow of the same color.
- **Lesson Path Nodes:** Circular icons representing the Judo journey. Unlocked nodes are colorful (belt colors) and 3D; locked nodes are flat grey with a padlock icon.
- **Streak Indicator:** A flaming icon next to a bold number, always using the Primary Red or Orange to signify "heat" and activity.
- **Input Fields:** Darker than the surface (`#1A1A1A`) with a 2px border that turns Red on focus.