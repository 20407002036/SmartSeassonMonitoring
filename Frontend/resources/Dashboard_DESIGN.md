# Design System Specification: Precision Vitality

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Precision Arable Editorial."** 

Agriculture is often viewed through a lens of grit and dirt; we are pivoting to a lens of high-end scientific clarity and organic sophistication. This system rejects the "clunky dashboard" trope. Instead, it treats agricultural data as a premium editorial experience. By utilizing intentional asymmetry, staggered layouts, and sophisticated tonal layering, we create a space that feels as breathable as a field and as precise as a laboratory. 

The goal is to move away from rigid, boxed-in templates toward a "flowing" interface where data density does not compromise visual tranquility.

---

## 2. Colors: Tonal Architecture
The palette is rooted in a sophisticated interpretation of growth and risk. We avoid "flat" application, preferring a tiered approach to surfaces.

### The "No-Line" Rule
**Explicit Instruction:** Use of 1px solid borders for sectioning or containment is prohibited. 
Structure must be defined through background color shifts. For example, a `surface-container-lowest` card should sit atop a `surface-container-low` section. Visual boundaries are created by the eye's perception of tonal shifts, not artificial lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical layers. 
- **Base Layer:** `surface` (#f8fafb) or `background` (#f8fafb).
- **Secondary Tier:** `surface-container-low` (#f2f4f5) for large layout sections.
- **Floating/Card Tier:** `surface-container-lowest` (#ffffff) for primary interactive components.
- **Emphasis Tier:** `surface-container-high` (#e6e8e9) for sidebars or "drilled-down" content.

### The "Glass & Gradient" Rule
To elevate the experience, the main CTAs and "Hero" metrics should utilize a subtle linear gradient:
- **Primary Gradient:** From `primary` (#006d43) to `primary-container` (#00a86b) at a 135-degree angle.
- **Glassmorphism:** For floating overlays (modals/tooltips), use `surface` at 80% opacity with a `24px` backdrop-blur. This ensures the agricultural data "bleeds" through the UI, feeling integrated rather than pasted on.

---

## 3. Typography: The Editorial Voice
We utilize a dual-typeface system to balance authority with utility.

- **Display & Headlines:** **Manrope.** This is our editorial voice. It is used for `display-lg` through `headline-sm`. Its modern, geometric construction provides a premium "tech-forward" feel.
- **Body & Labels:** **Inter.** This is our workhorse. Used for `title-lg` through `label-sm`. Inter's high x-height ensures that complex agricultural metrics (e.g., moisture percentages, soil pH) remain legible even on low-bandwidth, high-glare outdoor screens.

**Hierarchy Strategy:** Use extreme scale contrast. A `display-md` headline for a field name paired with a `label-sm` for its coordinates creates an intentional, high-end "magazine" aesthetic that guides the eye instantly to the most important information.

---

## 4. Elevation & Depth
Depth in this design system is achieved through **Tonal Layering**, not heavy shadows.

- **The Layering Principle:** Instead of standard shadows, stack surfaces. A `surface-container-lowest` card on a `surface-container-low` background provides enough "lift" for the user to perceive interactable objects.
- **Ambient Shadows:** Shadows are reserved for "Floating" elements (Modals, FABs). They must be diffused: `blur: 40px`, `y-offset: 12px`, and color `on-surface` at 6% opacity. This mimics natural, ambient daylight.
- **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use a "Ghost Border": `outline-variant` (#bccabe) at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

### Cards & Lists
- **Layout:** Strictly no dividers. Use `24px` or `32px` of vertical white space to separate list items.
- **Styling:** Use `roundedness-lg` (0.5rem) for cards.
- **Data Tables:** Forbid horizontal and vertical lines. Use alternating row colors—`surface` and `surface-container-low`—to maintain readability in high-density views.

### Buttons
- **Primary:** Gradient fill (Primary to Primary-Container), `on-primary` text, `roundedness-md`.
- **Secondary:** `surface-container-high` fill with `primary` text. No border.
- **Tertiary/Ghost:** No fill. `primary` text. Use for low-priority actions.

### Status Badges (High Contrast)
- **Active/Growth:** `primary-fixed` (#78fbb6) background with `on-primary-fixed` (#002111) text.
- **At Risk/Warning:** `secondary-container` (#ff8f00) background with `on-secondary-container` (#623400) text.
- **System/Neutral:** `tertiary-fixed` (#cfe6f2) background with `on-tertiary-fixed` (#071e27) text.

### Input Fields
- **Style:** Understated. Use `surface-container-high` as the field background with a bottom-only "Ghost Border" (2px) using `primary` only during the `focus` state. 

### Signature Component: The "Vitality Gauge"
A custom data visualization component for soil health. Use a thick, non-rounded stroke for the track (`surface-variant`) and a vibrant `primary` gradient for the progress, utilizing `display-sm` for the central metric.

---

## 6. Do's and Don'ts

### Do
- **Do** use whitespace as a functional tool. If a screen feels cluttered, increase the spacing between tiers rather than adding lines.
- **Do** use `on-surface-variant` for secondary text to create a sophisticated grey-scale hierarchy.
- **Do** align large display typography to a deliberate asymmetrical grid to create visual interest.

### Don't
- **Don't** use pure black (#000000). Use `on-surface` (#191c1d) to maintain a soft, premium feel.
- **Don't** use standard Material Design drop shadows. They look "cheap" in a high-end editorial system.
- **Don't** use borders to separate table cells. Rely on the typography scale and column spacing.
- **Don't** use bright red for warnings unless it is a critical system error (`error` token). Use the Amber/Orange `secondary` tokens for agricultural "At Risk" states to avoid inducing unnecessary panic.