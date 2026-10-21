# ZIVAH Public Site Redesign — Design Spec (Seafood-first)

**Date:** 2026-10-20
**Status:** Approved for implementation planning
**Scope:** Public marketing site (Home, Products, Quality, Markets, Contact, Quote, Legal, Auth). Admin dashboard is out of scope.

---

## 1. Context

The current public site is content-rich but visually overloaded. The home page combines a three-slide autoplay carousel, a hero side panel, a stats strip, two nearly identical feature sections, four "why Ecuador" cards, a category grid, a process section, three testimonial cards, and a newsletter block. Navigation duplicates the quote action, and six UI colors compete for attention (navy, teal, orange, red, green, gold) alongside emoji used as icons.

Internal pages are calmer but inconsistent with each other. The result is a site that reads as a collection of sections rather than one institution.

The redesign keeps the business content and brand recognition while reducing noise, establishing one visual system, making the quote request the dominant action, and re-centering the public site on seafood and aquaculture. Frutas, café, and other agricultural lines remain in the catalog as secondary offerings.

## 2. Goals and non-goals

### Goals

1. Make a qualified FOB quote request the primary action on every public page.
2. Project an institutional, export-grade image: rigorous, traceable, well edited.
3. Reduce visual overload through hierarchy, restraint, and fewer sections.
4. Unify public pages under one design system (color, type, spacing, components, motion).
5. Improve perceived and measured performance by removing the carousel, remote stock images, and decorative motion.
6. Keep the site fully bilingual (Spanish/English) and functional in light and dark mode.
7. Position ZIVAH primarily as a seafood and aquaculture exporter, with agricultural lines clearly secondary.

### Non-goals

- No changes to authentication, database schema, API contracts, or admin dashboard.
- No new UI library, animation library, or CSS framework.
- No e-commerce, payments, or customer portal.
- No new pages beyond the existing public routes.
- No change to the logo artwork.

## 3. Approved direction

**Personality:** institutional with an editorial finish. Structure and data convey rigor; typography, whitespace, and photography keep it from feeling bureaucratic.

**Palette:** deep navy, warm paper neutrals, one accent. Teal, red, green, and gold are removed as interface colors.

**Typography:** Newsreader (serif) for headings; Inter for UI, body, and forms.

**Content:** sections may be merged, removed, and rewritten. All key information is preserved: products, certifications, markets, process, contact.

**Photography:** a curated, locally hosted stock set with one art direction.

**Category focus:** seafood and aquaculture first. Camarón, larvas, and atún carry the home page, the hero, the photography, and the primary conversion path. Frutas, café, cacao, and other agricultural lines remain available in the catalog and footer as secondary lines, without equal visual weight on the home.

**Modes:** light and dark, with the existing theme toggle retained.

## 4. Design system

### 4.1 Color tokens

Light mode:

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#F6F4EF` | Page background (warm paper) |
| `--surface` | `#FFFFFF` | Cards, forms, alternating sections |
| `--foreground` | `#14202B` | Primary text |
| `--muted-foreground` | `#5C6A75` | Secondary text, captions |
| `--border` | `#D8D3C8` | Hairlines, dividers, input borders |
| `--primary` | `#0B2239` | Institutional navy; brand surfaces and dark bands |
| `--primary-foreground` | `#F6F4EF` | Text on navy |
| `--accent` | `#C0451F` | Primary CTA, eyebrow marks, active state |
| `--accent-foreground` | `#FFFFFF` | Text on solid accent |
| `--accent-hover` | `#A93A18` | Hover state |
| `--ring` | `#C0451F` | Focus outline |

Dark mode:

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#0A1622` | Page background |
| `--surface` | `#0F1E2C` | Cards, forms |
| `--foreground` | `#ECE8DF` | Primary text |
| `--muted-foreground` | `#A9B6C0` | Secondary text |
| `--border` | `rgba(255,255,255,0.14)` | Hairlines |
| `--primary` | `#071829` | Institutional navy bands and brand surfaces |
| `--primary-foreground` | `#ECE8DF` | Text on navy |
| `--accent` | `#F07048` | Primary CTA |
| `--accent-foreground` | `#0A1622` | Text on accent |
| `--accent-hover` | `#F58A68` | Hover state |
| `--ring` | `#F07048` | Focus outline |

Rules:

- The accent is used only for the primary CTA, small eyebrow labels, active indicators, and inline links of consequence. Never for full headlines, backgrounds, or decorative blocks. On navy surfaces only, the italic emphasis word in the hero H1 may use the warm tint `#F3B39C`.
- The accent value is slightly deeper than the `#D9532B` used in the exploratory mockup so that white button text meets AA (5.1:1). Do not revert to the brighter value for text-bearing buttons.
- Destructive and success colors exist only for form validation and system feedback, never as brand decoration.
- Certification marks are monochrome: 1 px border, uppercase label, muted text. No colored pills.
- Contrast must meet WCAG 2.1 AA: body text ≥ 4.5:1; large display text ≥ 3:1; focus indicators ≥ 3:1.

### 4.2 Typography

- `--font-serif`: Newsreader, weights 400/500/600 + italic. Used for H1, H2, H3, pull quotes, and stat numerals.
- `--font-sans`: Inter, weights 400/500/600/700. Used for navigation, body, labels, buttons, tables, and legal copy.
- Fonts are loaded with `next/font/google`, self-hosted at build time, `display: swap`, latin + latin-ext subsets.

Scale (desktop values; use `clamp()` for fluid behavior):

| Style | Size | Line height | Tracking | Weight |
| --- | --- | --- | --- | --- |
| H1 | 44–72 px | 1.02 | -0.018em | 500 |
| H2 | 32–44 px | 1.08 | -0.012em | 500 |
| H3 | 20–28 px | 1.2 | -0.005em | 500 |
| Lead paragraph | 17–19 px | 1.6 | 0 | 400 |
| Body | 16 px | 1.65 | 0 | 400 |
| Small | 13 px | 1.55 | 0 | 400 |
| Eyebrow | 11 px | 1.2 | 0.17em uppercase | 600 |
| Button | 11.5 px | 1 | 0.1em uppercase | 600 |

Rules:

- Headings are sentence case. No all-caps headings.
- Body copy is left-aligned; centered text is limited to short legal or empty states.
- Numerals in evidence bars use tabular lining figures.
- Maximum measure: 68 characters for body, 24 words per paragraph.

### 4.3 Layout and spacing

- Container: 1240 px max width; gutters 40 px desktop, 24 px mobile.
- 12-column grid, 24 px gutter.
- Section padding: 92 px desktop, 64 px tablet, 56 px mobile.
- Vertical rhythm in multiples of 4 px.
- Rules (1 px hairlines) replace card borders and shadows for grouping.
- Alternating section surfaces: paper, white, navy. Never more than two surface changes in a row without a content reason.
- Asymmetry is preferred over centered stacks: 7/5 or 8/4 splits for heading + supporting content.

### 4.4 Shape, elevation, and imagery

- Border radius: 2 px for buttons, inputs, cards, and images. No pill shapes except status dots.
- No drop shadows in the base system. A single soft shadow is permitted for overlays (mobile drawer, dropdowns).
- Photography: natural light, warm grade, real product and operations. Avoid blue-tinted stock, heavy filters, and collages.
- Image ratios: 3:2 for plates, 16:9 for wide bands, 4:5 for portrait crops.
- Hero scrim: linear gradient of navy at 90–94% opacity on the text side, fading to 25% on the image side.
- All images are local under `public/assets/images/photos/`, converted to AVIF/WebP at build or import time, with explicit width/height and `sizes`.

### 4.5 Iconography

- Use `lucide-react` at `strokeWidth={1.5}` or update the existing custom icons to the same stroke.
- Icons are monochrome (`currentColor`), 16–20 px, and always paired with a text label.
- No emoji as icons anywhere in the public UI (current offenders: package, ship, trophy, gear, document, lock, chart).
- Social icons may remain filled brand glyphs in the footer, at 16 px, muted.

### 4.6 Motion

- Transitions: 200 ms ease-out for color, border, and transform; 300 ms for overlays.
- Scroll reveal: opacity 0 → 1 and translateY 8–12 px, once per element, disabled under `prefers-reduced-motion`.
- No autoplay, parallax, counters, or continuous animation.
- Hover states: border/color change and at most a 1 px lift. No scale on cards.

## 5. Components

| Component | Description |
| --- | --- |
| `Button` | Variants: `primary` (solid accent), `outline` (1 px navy border), `ghost` (text + arrow), `inverse` (solid paper on navy). Sizes: default and small. Optional trailing arrow. |
| `SectionHeader` | Eyebrow, H2, optional lead, optional aside paragraph/action. Left-aligned by default; supports a right-aligned aside at ≥1024 px. |
| `PageHeader` | Breadcrumbs, eyebrow, H1, lead, optional action. Replaces the current tinted icon tile. |
| `EvidenceBar` | 4-column strip of numeral + uppercase label, separated by hairlines. Used on home and quote. |
| `ProductCard` | Image, category eyebrow, name, one-line spec, single "Ver ficha" link. No per-card quote button. Used for the three seafood lines on Home and for the catalog grid. |
| `SecondaryLines` | Single line of text with inline links to agricultural lines ("También exportamos…"). No images, no cards, no CTA. |
| `CertificationMark` | Monochrome bordered label + name + one-line description. |
| `ProcessStep` | Number, title, one-line description. No card, no icon. |
| `MarketRow` | Country, ISO code, status (Activo/Expansión). |
| `Quote` | Large serif pull quote with attribution. One per page maximum. |
| `CTABand` | Navy band with H2, one-line support, one primary CTA, and optional direct-contact text links. |
| `FormField` | Label, input, help text, error text. 44 px minimum height. Focus ring uses `--ring`. |
| `Breadcrumbs` | Muted small text with `/` separators; current page not linked. |

## 6. Page architecture

### 6.1 Global shell

**Navigation**

- Height 76 px desktop, 64 px mobile.
- Transparent over the home hero with white text and a hairline; solid paper with navy text after 50 px of scroll. Internal pages always use the solid paper header.
- Items: Productos, Calidad, Mercados, Contacto. The logo links home and serves as "Inicio".
- Right cluster: language switcher, theme toggle, primary CTA "Solicitar cotización". The duplicate "Cotizar" nav item is removed.
- Mobile: full-height drawer with the four links, language switcher, theme toggle, CTA, and legal links. Focus trap and Escape to close.
- The WhatsApp floating button is removed from the public site; WhatsApp remains as a text link in Contact, Quote, and the final CTA.

**Footer**

- Four columns: brand + one-sentence description; Productos (seafood and aquaculture first, agricultural lines second); Compañía; Contacto (Samborondón, Miami, email, phone).
- Social icons in the brand column, 16 px muted.
- Legal row: copyright left; privacy, terms, cookies, data protection right.
- No duplicated main navigation, no certification badges, no newsletter form, no long "specialists" paragraph.
- Paper background with a top hairline in light mode; surface background in dark mode.

### 6.2 Home

Order and purpose:

1. **Hero (static).** Navy scrim over one photograph of marine product.
   - Eyebrow: "Productos del mar · Ecuador".
   - H1: "Productos del mar ecuatorianos, listos para exportar."
   - Lead: "Camarón, atún y larvas de acuicultura con documentación BAP / HACCP / BRC y trazabilidad completa por lote. Cotización FOB confirmada en 24 horas."
   - Primary CTA: "Solicitar cotización FOB". Secondary text link: "Ver catálogo completo".
   - Small caption bottom-right: "Guayas, Ecuador".
   - No carousel, arrows, dots, counter, side panel, or autoplay.
2. **Evidence bar.** 6 mercados (4 activos) · 24 h respuesta comercial · 4 certificaciones internacionales · 100% trazabilidad por lote.
3. **Seafood lines.** H2 "Productos del mar. Un mismo estándar." Three plates: Camarón Blanco Premium, Larvas de camarón Post-Larva, Atún Fresco del Pacífico. Each with a one-line specification and a single "Ver ficha" link. Below, a secondary text strip: "También exportamos frutas tropicales, café de altura y cacao" with inline links. One "Ver catálogo completo" link at the end.
4. **Why ZIVAH.** Split layout: left heading "Menos intermediarios. Más control." + paragraph focused on marine operations + link; right four numbered rows: Origen controlado (granjas y laboratorio), Documentación completa, Cadena de frío y logística FOB, Soporte comercial directo.
5. **Quality band (navy).** H2 "Certificación que abre mercados." Four marine-relevant certification marks (BAP, HACCP, BRC, MSC) with one-line descriptions, plus a small note that agricultural lines carry GlobalGAP. Link to Quality.
6. **Process.** H2 "De la consulta al embarque." Four numbered steps. Single outline CTA "Iniciar cotización".
7. **Markets.** H2 "Dónde llega el producto." Six market rows with status, ordered by seafood demand. Link to Markets.
8. **Testimonial.** One quote from a seafood importer, serif, with attribution (role + market). No cards, no carousel.
9. **Final CTA (navy).** H2 "Recibe una cotización FOB de productos del mar en 24 horas." Support line + primary CTA + email/WhatsApp text links.

Removed from home: autoplay hero, side "Compra sin fricción" panel, blue stats strip, second feature section, why-Ecuador cards, newsletter, three testimonial cards, duplicated CTAs.

### 6.3 Products list

- `PageHeader`: breadcrumb "Inicio / Productos", eyebrow "Catálogo de exportación", H1, lead that names seafood first and agricultural lines second, one CTA "Solicitar cotización" at the right.
- Category filter: text buttons with active underline and a discreet count. No filled pills. Seafood is the default filter; "Todos" remains available for buyers looking for other lines.
- Grid order: marine products first, then aquaculture, then agricultural lines. Agricultural products are never mixed ahead of seafood.
- Grid: 3 columns desktop, 2 tablet, 1 mobile. Product cards as defined above.
- Empty state: brief explanation that the catalog is updated periodically + "Consultar disponibilidad" CTA to Contact. No broken icon or "0 products" badge.
- No duplicate quote CTA per card.

### 6.4 Product detail

- Two columns: image left; right with category eyebrow, H1, one-line description, specification table (origin, calibre, empaque, certificaciones, temporada), primary CTA "Solicitar cotización para este producto", secondary ghost link "Descargar ficha técnica".
- Below: short description, certifications row, related products (max 3).
- No colored feature badges, no emoji.

### 6.5 Technical sheet (`/products/[slug]/ficha-tecnica`)

- Print-friendly, max 800 px, white background in both modes.
- Logo, product name, date, specification table, certifications, contact block, and print button (screen only).
- Uses `@media print` to hide navigation, footer, and buttons.

### 6.6 Quality

- `PageHeader` with H1 "Certificaciones que abren mercados".
- Four marine-relevant certification rows with monochrome marks and descriptions: BAP, HACCP, BRC, MSC.
- A small secondary note: "Líneas agrícolas: GlobalGAP."
- Quality control process as a four-step horizontal timeline with hairlines, no cards. Steps cover reception, cold chain, microbiology, and shipment documentation.
- Recognition figures in an evidence bar.
- One navy CTA band at the end. No trophy emoji, no tinted cards.

### 6.7 Markets

- `PageHeader` with H1 "Desde Guayas y Miami al mundo".
- Monochrome world map (static SVG) with accent dots for active markets; accessible text alternative.
- Market list with country, city/hub, status, and one-line note.
- "Por qué elegir ZIVAH" as four compact evidence rows, not cards.
- One CTA band.

### 6.8 Quote

- Two-column layout: left intro ("Recibe una propuesta comercial en 24 horas"), short explanation of what the proposal includes, direct contact (email, WhatsApp, phone), and trust markers as text.
- Right: form on a white surface with 2 px radius, grouped in two columns where fields are short (name/email, country/phone), full width for company, products, message.
- One primary button "Enviar solicitud". Privacy note directly below.
- States: inline validation, disabled/loading button with label change, success confirmation with next steps, error summary for server failures.
- No emoji chips, no competing CTA above the form.

### 6.9 Contact

- Two columns: office details (Samborondón, Ecuador; Miami, FL), email, phone, hours; short form on the right.
- WhatsApp as a text link with icon, not a floating button.
- No map embed (performance and privacy); a link to directions instead.

### 6.10 Legal and auth

- Legal pages: 720 px measure, H1 serif, "Última actualización" line, simple anchor index, body in Inter.
- Sign-in/sign-up: same tokens, centered 420 px surface, logo, one primary action, clear error states. Functional behavior unchanged.

## 7. Content and tone

- Language: Spanish neutral with "tú" in Spanish; consistent English mirror. Remove voseo ("Contanos", "buscás", "Recibí") and mixed register.
- Positioning: a seafood and aquaculture exporter from Ecuador. Camarón, larvas, and atún lead every message. Agricultural lines are introduced as "también exportamos", never as the headline.
- Tone: declarative, specific, no superlatives without evidence. Remove "sin fricción", "premium" as a filler, and exclamation marks.
- One primary action per view. Secondary actions are text links.
- Numbers always carry units and a source/context: "24 h", "6 mercados", "4 certificaciones", "100% trazabilidad por lote".
- Business figures are defined once and reused from the same translation keys across Home, Quality, and Markets. No page may claim a different number of active markets or certifications.
- Microcopy for forms: short labels, help text only where the field is ambiguous, errors that state how to fix.
- Both `src/messages/es.json` and `src/messages/en.json` must keep key parity. Remove keys for deleted sections.
- SEO metadata and structured data are preserved and updated to the new headings; one H1 per page.

## 8. Responsive behavior

- Breakpoints: 375, 768, 1024, 1440.
- Hero: 700 px desktop, `72svh` mobile with a minimum of 560 px; headline scales via `clamp()`, CTA full width on mobile.
- Evidence bar: 4 columns desktop, 2×2 mobile.
- Product grid: 3 / 2 / 1 columns.
- Split sections stack with heading first; images never precede the heading on mobile.
- Navigation: full drawer below 1024 px.
- Tables scroll horizontally with a visible edge fade; no layout overflow.
- Touch targets ≥ 44×44 px.

## 9. Accessibility

- WCAG 2.1 AA contrast for all text and UI states.
- Visible focus ring on every interactive element (`outline: 2px solid var(--ring); outline-offset: 2px`).
- Semantic landmarks: `header`, `nav`, `main`, `section` with accessible names, `footer`.
- Carousel removal eliminates the pause/controls accessibility burden.
- Images: meaningful `alt`; decorative images `alt=""`.
- Forms: explicit labels, `aria-describedby` for help/error, error summary with links, no placeholder-only labels.
- Motion respects `prefers-reduced-motion`.
- Language switcher exposes the active language and updates `lang` on the document.
- Keyboard: drawer focus trap, Escape to close, logical tab order, skip-to-content link.

## 10. Performance and SEO

- Remove remote image hosts after migrating assets; delete their `remotePatterns` from `next.config.ts`.
- Hero image: local, `priority`, explicit dimensions, AVIF/WebP.
- Fonts: `next/font` with only the weights used; remove Montserrat.
- Remove autoplay and unused carousel JavaScript; convert static sections to server components where translations allow.
- Targets: LCP < 2.5 s on mobile 4G, CLS < 0.1, INP < 200 ms.
- Preserve metadata, `hreflang`, sitemap, and JSON-LD. Update JSON-LD to the new H1 and section names. The title and description lead with seafood and aquaculture; agricultural keywords remain secondary.
- No layout shift from images or font swap.

## 11. Implementation map

Primary files:

- `src/app/globals.css` — tokens, base typography, focus, print styles.
- `tailwind.config.ts` — font families, radii, color mapping.
- `src/app/[locale]/layout.tsx` — replace Montserrat with Newsreader; keep Inter.
- `src/components/Navigation.tsx` — simplify links and scroll states.
- `src/components/Footer.tsx` — rewrite to four columns.
- `src/components/HeroSlider.tsx` — replace with a static `Hero` component (rename or delete carousel logic).
- `src/components/sections/*` — replace `FeatureSection`, `WhyEcuadorSection`, `CategoriesSection`, `ProcessSection`, `TestimonialsSection`; delete `NewsletterSection`. Add `SeafoodLinesSection` (three marine products + secondary agricultural strip) and `SecondaryLines`.
- `src/components/ui/button.tsx` — add the new variants and sizes.
- New shared components: `PageHeader`, `SectionHeader`, `EvidenceBar`, `ProductCard`, `SecondaryLines`, `CertificationMark`, `CTABand`.
- `src/app/[locale]/{page,products,quality,markets,contact,quote}/page.tsx` — apply the new layout.
- `src/messages/{es,en}.json` — rewrite copy and remove stale keys.
- `src/lib/product-images.ts` — replace remote fallback URLs with local photo paths.
- `public/assets/images/photos/` — curated local photography: marine hero, camaron, larvas/lab, atún, quality control, port/containers, team or office. Tropical fruit and coffee images are used only in catalog and product detail, never on the home. One image per use; no repeated hero photo inside product plates.

Constraints:

- Reuse Radix primitives and existing UI components; do not add a competing UI library.
- No changes to `src/app/admin`, API routes, Prisma schema, or auth logic.
- Keep `pg` parameterized queries and Zod validation untouched.
- Use `pnpm`; verify with `pnpm format:check`, `pnpm type-check`, `pnpm lint`, `pnpm build`, `git diff --check`.

## 12. Acceptance criteria

1. Home has no carousel, autoplay, side hero panel, blue stats strip, duplicate feature section, newsletter, or testimonial cards.
2. Home leads with seafood: three marine product plates (camarón, larvas, atún), marine photography, and a seafood-first H1. Agricultural lines appear only as a secondary text strip.
3. Every public page has one visually dominant CTA and no duplicate quote action in the navigation.
4. All public pages use the approved tokens, typography, and component set in light and dark mode.
5. No emoji used as icons in the public UI.
6. No remote Pexels/Unsplash images remain; all photography is local and optimized.
7. Spanish and English copy are complete, consistent, seafood-first, and free of voseo.
8. WCAG AA contrast and keyboard navigation verified on Home, Products, Quote, and Contact.
9. Lighthouse mobile: LCP < 2.5 s and CLS < 0.1 on Home.
10. `pnpm format:check`, `pnpm type-check`, `pnpm lint`, and `pnpm build` pass.
11. Admin dashboard and API behavior are unchanged.

## 13. Out of scope

- Admin dashboard redesign.
- API, database, auth, and analytics changes.
- New content types or CMS.
- Movement of legal copy into new documents.
- Logo redesign.
