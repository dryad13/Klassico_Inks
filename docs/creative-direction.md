# Creative Direction — Klassico Inks

Diagnosis: the rebuild fixed the old site's dishonesty by removing everything, colour included.
It is now technically better and visually forgettable. This plan puts the colour back with the
discipline the old site never had.

Sources of truth, in order: the five flyer panels (repo root) → `src/config/site.js` → nothing else.

---

## 1. Palette — corrected against sampled brand colour

The current tokens are a darkened, hue-shifted approximation. Values below were sampled
directly from the flyer artwork, not eyeballed.

| Role | Current | **Corrected** | Evidence | Delta |
|---|---|---|---|---|
| Orange | `#D96914` | **`#F6931E`** | Logo mark, flyer panel 1 | +6° hue, +8% lum — current is redder and darker |
| Green | `#0A2B10` | **`#136B43`** | Logo mark, flyer panel 1 | **+22° hue, +15% lum** — current is a shadow, and the wrong green |
| Magenta | — | **`#E53693`** | CMYK splash, flyer panel 1 | new |
| Yellow | — | **`#FAE100`** | CMYK splash, flyer panel 1 | new |

The green is the significant error. `#0A2B10` sits at hue 131° / luminance 0.10 — near-black and
yellow-shifted. The real mark is 153° / 0.25, a proper blue-leaning forest green. It currently
reads as "dark card background", never as brand colour.

Magenta and yellow are **not inventions** — they are process inks in Klassico's own flyer art.
Adding them completes a CMYK-adjacent range, which is the correct semantic for a printing ink
company and something no competitor in this market is doing.

### Token plan (`tailwind.config.js`)

```
primary   #F6931E   orange   — CTAs, active nav, key emphasis
brand     #136B43   green    — secondary actions, section marks, borders
accent    #E53693   magenta  — sparingly: hover states, one stat, chart series
highlight #FAE100   yellow   — rarest: focus rings, single hero word
ground    #0f172a   slate    — unchanged
paper     #F7F5EF   warm off-white — new, see §2
```

**Usage discipline — the rule that stops this becoming a clown car:**
one accent dominant per section, at most one secondary, never three saturated accents in one
viewport. Orange carries the site. Green carries structure. Magenta and yellow are punctuation.

---

## 2. Ground strategy — resolve dark vs light

Do **not** rewrite to a light theme. Do **not** keep an unbroken dark slab either.

Keep `slate-900` as the base, and alternate in **light "paper" sections** (`#F7F5EF`) for
content that wants to breathe — the product catalog, the FAQ, About's history. Pigment reads
truer on paper; ink glows on dark. Using both is the argument, not a compromise.

Rhythm for the homepage: `dark hero → paper products → paper proof → dark CTA`

Two grounds means every component needs both variants. Budget for that; it is the largest
mechanical cost in this plan.

---

## 3. Typography

Oswald + Inter is already better than the old site's Chakra Petch + Titillium. Keep it. Fix scale:

- Hero: heavier weight, tighter tracking, and let it get genuinely large (clamp to ~8vw)
- Introduce a **mono** for grade codes — `Rutile R2310`, `RS Type 15/20`, `Red 57:1`.
  These are the highest-value strings on the site for a formulator. Setting them in mono makes
  them read as specifications rather than marketing prose.
- Body line-height up to 1.65; current copy is dense.

---

## 4. Hero

"DRIVING INNOVATION IN MANUFACTURING" is the weakest line on the site — it is inherited from the
legacy site and would suit a cement company equally well. It must go.

Direction: name the product and the outcome. The old site's "Bringing colors to life" is closer
to right despite everything else about that site.

The hero is a live Three.js shader, not generated frames or a scroll sequence — see
`hero-spec.md`. It always reflects the current palette, with no regeneration step.

---

## 5. Imagery policy — unchanged and non-negotiable

No synthetic or stock facilities, machinery, presses, staff or labs. The legacy site put a BOBST
press on the homepage; the WhatsApp stock photos carry Doritos, Colgate and Dalda. Both imply
relationships that do not exist.

Permitted: abstract ink and pigment (generated), the flyer's own blurred pack silhouettes, and
any first-party photography the client supplies later.

---

## 6. Sequence

Ordered by dependency, not by size. Each phase ships independently.

**Phase 1 — Palette foundation.** Correct the two wrong tokens, add magenta and yellow, add the
paper ground. Sweep every hardcoded `secondary-900` usage. *Blocks everything else — the scroll
shader's palette constants key off the final ground.*

**Phase 2 — Hero copy.** New headline and subhead. Cheap, high impact, independent of visuals.

**Phase 3 — Section rhythm.** Introduce paper sections and build the light component variants.
Largest mechanical cost.

**Phase 4 — Typography pass.** Hero scale, mono for grade codes, line-height.

**Phase 5 — Hero shader.** Per `hero-spec.md`, once Phase 1 fixes the ground.

**Phase 6 — Product card redesign.** Surface each series' end-market list on the card. The flyer
answers "which ink for my pack?" in one glance; the site currently takes three clicks.

---

## 7. Explicitly out of scope

- Light-theme rewrite of the whole site
- Any imagery implying facilities or clients
- Restoring anything stripped in the 2026-09-03 content pass without client evidence
