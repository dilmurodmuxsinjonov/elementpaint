# Element Paint preview — 10 October 2026

The client's final direction is glassmorphism, crystal-like translucency and realistic packaging, with a warm light appearance, premium mineral tones and subtle motion. This continues the original project; no Lovable design or generated product data is imported.

The old hero 3D studio is replaced by a horizontal selector sourced directly from the approved catalogue. It supports product-type filters, arrows, keyboard navigation and native horizontal swiping. Lowercase presentation affects only the hero heading; approved product names remain intact. Details open the same catalogue dialog, including original colour images and verified package sizes.

Warm alabaster, champagne accents and deep green frame translucent panels. Buttons have a restrained sheen and small hover movement. Settings retain light/dark appearance, motion and card density; optional product rotation is off by default and pauses for reduced motion, focus, hover, dialogs, hidden pages and an offscreen selector. Obsolete 3D quality and pour-speed controls are removed from the interface.

The brief, skippable introduction uses a real package image with an ivory stream, shaded liquid pool, ripples, rounded impact and heavy droplets. A damped height-field model propagates and settles waves. The brand mark is revealed as part of this stylized introduction; it does not represent an additional catalogue colour. The animation stops on Escape, skip, reduced motion or page hiding, and can be replayed from settings.

Validation:

- `node tests/verify_preview_data.mjs`: 45 approved cards, 34 variants, 72 PDF package images/weights, 20 legacy links and UZ/RU/EN translations.
- `node tests/test_paint_liquid.mjs`: impact, wave propagation, damping, long-frame stability and replay reset.
- Existing `node tests/test_paint_physics.mjs`: legacy simulation and preference compatibility.
- Browser checks: hero selection opens Atlas PF-115 with 11 colour variants and 0.9 / 2.7 kg; category filtering, End/arrow navigation, language switching and display settings.

Only the `preview-site` runtime is published. Production `main`, the primary server and DNS are outside this change.
