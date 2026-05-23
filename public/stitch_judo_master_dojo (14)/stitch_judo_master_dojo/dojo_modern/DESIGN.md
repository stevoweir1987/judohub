---
name: Dojo Modern
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
  secondary: '#b0c6ff'
  on-secondary: '#002d6e'
  secondary-container: '#0068ed'
  on-secondary-container: '#f2f3ff'
  tertiary: '#71d8c6'
  on-tertiary: '#003730'
  tertiary-container: '#33a191'
  on-tertiary-container: '#00302a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ffb3b3'
  on-primary-fixed: '#40000a'
  on-primary-fixed-variant: '#920022'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b0c6ff'
  on-secondary-fixed: '#001945'
  on-secondary-fixed-variant: '#00429b'
  tertiary-fixed: '#8ef5e2'
  tertiary-fixed-dim: '#71d8c6'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005047'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
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
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 64px
  max-width: 1200px
---

## Brand & Style
The design system establishes a high-performance, immersive environment for martial arts mastery. Moving away from the soft, rounded aesthetic of typical gamified apps, this system adopts a **Minimalist-Tactile** style—balancing the focus of a traditional Dojo with the precision of modern athletic technology. 

The UI evokes a sense of discipline, respect, and technical progression. It targets serious practitioners who seek a training tool that feels professional yet engaging. The interface utilizes a deep dark mode to reduce eye strain during evening study, accented by a subtle, repeating tatami mat weave texture in the background (linear patterns at 45-degree offsets) to provide tactile depth without visual clutter.

## Colors
The palette is rooted in the tradition of the Judo Dojo. The primary accent, **Judo Red**, is used sparingly for critical actions, calls to progress, and branding elements. 

The background is a tiered dark grey-to-black system to maintain depth. Functional colors are replaced by **Belt Colors** for progression-based UI:
- **Primary Action/Brand:** Judo Red (#E62946).
- **Stamina/Energy:** A technical blue-to-green gradient representing physiological readiness.
- **Progression:** Belt colors are used as semantic markers for difficulty levels and user rank.
- **Surface:** Deep charcoal tones to allow the belt colors to vibrate with high contrast.

## Typography
**Plus Jakarta Sans** is the sole typeface, chosen for its modern, athletic geometry and high legibility. 

- **Headlines:** Use Bold and ExtraBold weights to command attention, mirroring the strength of a successful throw (Ippon).
- **Labels:** Small caps with increased letter spacing are used for technical Japanese terminology (e.g., *UCHI-MATA*) to provide an editorial, instructional feel.
- **Body:** Regular weights with generous line height ensure techniques and descriptions are readable during active movement or quick review.

## Layout & Spacing
The layout follows a **Fixed-Scroll** philosophy. Unlike standard zig-zag maps, this system uses a horizontal Japanese scroll-style progression for the main syllabus. Content flows from right to left (traditional) or left to right (modern), appearing on a continuous "Dojo Floor Map."

- **Grid:** A 12-column grid for desktop, collapsing to a single column for mobile.
- **Rhythm:** An 8px base unit governs all spacing.
- **Safe Zones:** Generous margins are maintained at the top for the Stamina and Belt Streak HUD, ensuring they never overlap instructional content.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Hard Shadows**. 
- **The Mat:** The base layer is the darkest, featuring the subtle tatami weave texture.
- **Instructional Cards:** Use a slightly lighter surface color with a 1px "inner-glow" stroke on the top edge to simulate overhead dojo lighting.
- **Tactile 3D:** Elements meant for interaction use a hard, offset shadow (non-diffused) that matches the element's brand color, creating a "pressed" physical feel without the "cartoonish" softness of neomorphism.

## Shapes
The shape language is **Technical and Precise**. We use a "Soft" (0.25rem) corner radius for most components to maintain a professional, athletic edge. 

Buttons and input fields avoid full pill shapes to distance the design from "toy-like" apps, instead using consistent, small radii that feel architectural. Larger containers (cards) use a 0.75rem radius to frame content clearly.

## Components
- **Stamina Bar:** A horizontal gauge with a dual-tone gradient (Teal to Blue). When stamina is low, the bar pulses subtly.
- **Belt Streak Icon:** A minimalist Judo belt icon. As the streak grows, white vertical "Dan" stripes are added to the black section of the icon.
- **Tactile Buttons:** High-contrast background color with a 4px bottom-border shadow in a darker shade of the same hue. On "active" state, the button translates 2px down to simulate a physical press.
- **Dojo Map Nodes:** Rectangular "Tatami" tiles that highlight the user's path. Completed nodes turn the color of the current belt level.
- **Gi Cards:** Instructional cards featuring a subtle "Gi collar" fold graphic in the top right corner, indicating technical category (Throwing, Grappling, Striking).
- **Checkboxes:** Styled as "Sensei Stamps"—circular marks that look like traditional Japanese hanko seals when checked.