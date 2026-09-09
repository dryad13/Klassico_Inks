# Product Creatives Brief — Klassico Inks

Brief for generating **product card + detail images** for the catalog at `/products`.
Today every product card uses a placeholder icon. Replace those with real application photography or AI stills that match this guide.

Use this with Midjourney, Flux, Firefly, or a photographer. One creative per product slug below is enough for v1.

**Using ChatGPT?** Copy the separate prompts in [`product-creatives-chatgpt-prompts.md`](./product-creatives-chatgpt-prompts.md) — one full prompt per product.

---

## 1. Where images appear

| Placement | Aspect | Deliver size | Notes |
|---|---|---|---|
| **Products grid card** | **16:9** | **1600×900** WebP | Cropped into `h-48` (~3:1 on desktop). Keep subject in the **center third** so mobile crop still reads. |
| **Product detail hero** (optional later) | **21:9** or 16:9 | **2400×1080** or 1600×900 | Same master as card is fine; avoid text-heavy frames. |
| **OG / social share** (optional) | **1.91:1** | **1200×630** | Can be a crop of the card master. |

**Suggested file path when wiring into the site:**

```text
src/assets/products/{slug}.webp
```

Examples: `lam-series.webp`, `solvents-blends.webp`, `pigments.webp`.

---

## 2. Brand look (non-negotiable)

| Role | Hex | Use |
|---|---|---|
| Ground / shadows | `#0f172a` | Dark slate behind product or scene |
| Accent | `#D96914` | Sparingly — ink splash, highlight edge, not full wash |
| Brand green | `#0A2B10` | Deep forest in shadows / packaging accents |
| Light on product | Soft industrial key light | Clean B2B, not lifestyle glow |

**Mood:** industrial packaging print · real packs · wet ink · precise · Pakistani / regional flexible packaging context is fine · no luxury perfume vibes.

**Do**
- Show the **finished pack or substrate** the series is for (flyer end-use), not abstract chemistry unless the product is a raw material.
- Prefer **one hero object** filling most of the frame.
- Keep backgrounds dark or softly out-of-focus factory/packaging so images sit on `slate-900` cards.
- Slight wet sheen / ink density is on-brand.

**Don’t**
- Put logos, product names, watermarks, or UI chrome in the image (site overlays the name).
- Fake lab glassware with glowing neon / purple sci-fi.
- Stock “happy warehouse worker pointing at clipboard.”
- Collages, floating badges, or multi-product grids in one frame.
- Generic cream/terracotta editorial looks; stay dark industrial + orange accent.

---

## 3. Shot types by product kind

| Kind | Visual approach |
|---|---|
| **Ink series** (`lam`, `h-lam`, `pel`, `max`, `peak`, `kwb`, `dgi`) | Real **packaging application** from the flyer: pouch, bottle, bag, box. Hint of printed flexibles / color. |
| **Ink processes** (roto / flexo / water / offset) | **Press or print process** cue: engraved cylinder, flexo plate/anilox feel, corrugated board, offset sheet — still abstract enough to not invent a specific machine brand. |
| **Solvents & chemicals** | **Material truth**: drums/cans, pigment powder, resin beads, white TiO₂, dye liquor — clean product still life on dark ground. |

---

## 4. Per-product creative list

Copy-paste the **Prompt** into an image model. Swap “photorealistic product photography…” prefix if your tool prefers a house style.

### Ink Series

| Slug | Subject (flyer) | Prompt |
|---|---|---|
| `lam-series` | Snack / biscuit / confectionery flexible packs | Photorealistic product photography of printed flexible snack pouches and biscuit wrappers on a dark slate background, vivid food-pack print colors, soft industrial lighting, shallow depth of field, no text logos readable, B2B packaging, orange #D96914 accent reflection, 16:9 |
| `h-lam-series` | Stand-up pouches, tea / laundry / dried food bags | Photorealistic stand-up pouches and large flexible food bags (tea, dried goods) on dark industrial background, matte laminated film, clean packaging photography, no readable brands, 16:9 |
| `pel-series` | PET bottles + ice cream wrappers | Photorealistic clear PET soft-drink bottles beside ice cream bar wrappers with colorful print, dark slate ground, wet print sheen, commercial packaging photo, 16:9 |
| `max-series` | Rigid plastic bottles (juice, detergent, personal care) | Photorealistic rigid HDPE/PET bottles for juice, household detergent, and shampoo on dark background, bold label print areas blank/generic, industrial product still life, 16:9 |
| `peak-series` | Large rice / grain / feed bags | Photorealistic large woven or laminated bulk commodity bags for rice and grain, stacked, printed panel areas generic, warehouse soft light, dark moody background, 16:9 |
| `kwb-series` | Corrugated shipping boxes | Photorealistic corrugated cardboard shipping cartons with flexo-printed branding areas generic, stacked boxes, kraft texture, dark slate backdrop, 16:9 |
| `dgi-series` | Diaper / sanitary / tissue packs | Photorealistic personal-care flexible packs — diaper outer bag, sanitary napkin pack, tissue wrap — soft clinical-industrial light, dark background, no readable brands, 16:9 |

### Ink Processes

| Slug | Subject | Prompt |
|---|---|---|
| `rotogravure-inks` | Gravure cylinder / reverse print feel | Photorealistic close-up of a chrome rotogravure cylinder with fine engraved cells catching orange ink highlights, dark industrial background, macro detail, no logos, 16:9 |
| `flexographic-inks` | Flexo plate / anilox suggestion | Photorealistic flexographic print detail — rubber plate texture and wet ink on film, industrial lighting, dark ground, B2B packaging print, 16:9 |
| `water-based-inks` | Water-based / corrugated cue | Photorealistic water-based ink on corrugated board, soft matte print finish, kraft and ink contrast, dark slate edges, clean industrial photo, 16:9 |
| `offset-inks` | Offset sheet / commercial print | Photorealistic offset printed paper sheets with rich CMYK color bars (generic), dark background, press-room mood without branded machines, 16:9 |

### Solvents & Industry Products

| Slug | Subject | Prompt |
|---|---|---|
| `solvents-blends` | Solvent drums / cans | Photorealistic industrial solvent metal cans and drums on dark slate, subtle reflections, clean product still life, no hazard labels with fake text, 16:9 |
| `pigments` | Colored pigment powders | Photorealistic piles of yellow, magenta, blue, and carbon-black pigment powder on dark ground, fine particulate detail, soft side light, industrial materials photo, 16:9 |
| `titanium-dioxide` | White TiO₂ powder / bag | Photorealistic bright white titanium dioxide powder and industrial bag, high-key product on dark slate rim light, clean materials photography, 16:9 |
| `resins` | Resin pellets / chips | Photorealistic industrial ink-binder resin pellets and crushed chips (pale amber/honey/clear polymer feedstock) spilled on dark slate or in a plain lab weigh boat — dull-to-semi-gloss chemical raw material, NOT gemstones or jewelry, no logos, 16:9 |
| `nitrocellulose` | NC fibers / cotton-like industrial | Photorealistic nitrocellulose fibrous white industrial material (non-weaponized lab look), sealed industrial context, dark slate, materials photography, 16:9 |
| `solvent-dyes` | Concentrated dye liquids | Photorealistic glass vials of intense yellow, red, blue, black solvent dye liquids on dark ground, refractive color, product still life, 16:9 |

---

## 5. Delivery checklist (before handoff)

For each file:

- [ ] Filename = `{slug}.webp` matching `src/data/products.js` slugs
- [ ] 1600×900 (or larger 16:9 master)
- [ ] No logos, product series names, or fake TDS text burned in
- [ ] Subject readable at card crop (~192px tall on desktop)
- [ ] Dark enough edges to sit on `#0f172a` / slate-800 cards
- [ ] Distinct from other products (don’t reuse one pouch shot for three series)
- [ ] Rights cleared (own shoot / licensed / model terms allow commercial web use)

---

## 6. Negative prompt (AI tools)

```text
logo, watermark, readable brand text, UI mockup, collage, neon glow, purple lighting,
sci-fi lab, cartoon, illustration, stock smile worker, clipboard, cream background,
terracotta, newspaper layout, floating badges, multiple products floating, low-res, blurry
```

---

## 7. Priority order (ship in batches)

1. **Ink series first** (7) — highest traffic on Products grid  
2. **Processes** (4)  
3. **Chemicals** (6)

Minimum viable set: the 7 series alone already transforms the catalog page.

---

## 8. After assets land (dev note)

Wire each image on the Products card (`h-48` media area) and optionally Product detail hero. Keep alt text factual, e.g. `LAM Series — flexible snack packaging applications`. Do not invent press specs in alt text.

Catalog source of truth: `src/data/products.js`.
Brand colors: orange `#D96914`, green `#0A2B10`, ground `#0f172a`.
