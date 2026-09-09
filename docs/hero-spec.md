# Hero — Build Spec

Single-viewport homepage hero for Klassico Inks.
Technique: **live Three.js shader** as a pinned backdrop behind static copy. No scroll
hijacking, no pre-rendered frames, no generation pipeline — the shader runs continuously
on its own clock and reacts to the pointer, so there is nothing to regenerate when the
palette or copy changes.

---

## 1. Architecture

`src/v2/components/Hero.jsx` renders one `min-h-[calc(100vh-4rem)]` section. `HeroBackdrop`
mounts `InkHeroScene` (`src/v2/components/InkHeroScene.jsx`) — a raw WebGL/GLSL fragment
shader painting a mouse-reactive, continuously animating CMYK ink swirl on an orthographic
full-screen quad, sized to fill the hero section only (not the page).

Stacking order inside the section, bottom to top:
1. `HeroBackdrop` (`PigmentField` CSS fallback, or `InkHeroScene` canvas at `z-[1]`)
2. Bottom scrim gradient at `z-[2]`, so the ink stays visible behind the headline but text
   stays readable at the bottom edge
3. Headline/subhead/CTA copy at `z-10`

Get the z-index wrong here and the copy renders but is painted over by the canvas —
anything sitting on top of the backdrop must be `z-10` or higher.

## 2. Fallbacks — required, not nice-to-have

- `prefers-reduced-motion: reduce` → `InkHeroScene` is mounted `paused`: shader time is
  frozen to a constant and pointer tracking is disabled, so the scene renders once and
  holds still. Check `System Settings → Accessibility → Display → Reduce Motion` (macOS)
  or the OS equivalent before assuming the shader itself is broken — a paused shader looks
  static and won't react to the mouse, by design.
- WebGL unavailable, or the shader throws / loses context → `HeroBackdrop` swaps to
  `PigmentField`, a CSS/`framer-motion` blurred-blob approximation in the same CMYK
  palette.

The homepage must be fully functional and readable with WebGL entirely absent.

## 3. Editing the shader

The fragment shader lives inline in `InkHeroScene.jsx`. Palette, swirl strength, and
mouse-reactivity constants are uniforms/GLSL constants near the top of the shader string
— tune there. Bump `INK_SHADER_REV` (same file) after a shader edit if you need to force
a remount during development.
