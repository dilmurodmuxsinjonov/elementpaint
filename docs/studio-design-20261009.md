# Preview studio design — 2026-10-09

Scope: client demonstration on GitHub Pages only. Source branch: `design-refresh-20261005`; runtime branch: `preview-site`. No production deployment or changes to `main`.

## Result

- Reworked header, hero, catalogue, product details, factory/applications, contact and footer with the existing cream/green brand palette, consistent type, readable controls, responsive layouts and dark appearance.
- Rebuilt the Berlak can using a rolled metal profile, recessed lid, original approved label, studio reflections, clearcoat and shadows. Open/close, drag and keyboard rotation, pour/pause/reset remain available.
- Added a gravity-directed stream with variable thickness, droplets, impact rings and a deforming receiving surface. A conserved paint amount drives the can level, receiving pool and logo readout. This is a lightweight visual simulation, not an industrial fluid solver.
- Added a 2.6-second branded introduction: the approved can image tilts and pours a reflective gold stream into the actual Element Paint logo. The mask fills with a moving liquid surface. Skip, Escape and replay are available; catalogue/deep links bypass the intro. Reduced-motion settings bypass it too.
- Added saved browser preferences: light/dark, full/reduced motion, automatic/economy/high 3D quality, rotation, flow speed and comfortable/compact catalogue cards. Reset restores defaults. Device reduced-motion preferences are respected; denied storage does not stop the site.
- 3D pauses when hidden or outside the viewport; idle frames stop. A failed/lost graphics context switches to the approved product photograph and keeps the catalogue usable.

## Validation

- `node tests/verify_preview_data.mjs`: 45 approved products, 34 colour variants, 72 catalogue images and package weights, 20 legacy links, all three languages, excluded brand absent.
- `node tests/test_paint_physics.mjs`: conservation, closed/paused/empty states, speed, reduced motion, bounded timing, invalid preferences and blocked storage.
- Syntax checks for the scene, app and intro; `git diff --check`.
- Browser checks at 320, 390, 768 and 1440 pixels in Uzbek, Russian and English: 45 cards and no horizontal page overflow.
- Browser verification of lid/pour/pause/drain/reset, keyboard rotation, colour/image changes, mobile settings, saved theme after reload, reduced-motion replay disabled, introduction frames with progress 0–67%, and deliberate WebGL context loss with all 45 cards retained.
- Packaged runtime: 119 files, approximately 11.34 MB including existing catalogue assets. No production redirects or work documents.

Catalog product identities, colours, images and package data are preserved from the previously audited catalogue. Only interface translations were added to `catalog-data.js`.

Preview publication details are recorded in `preview-publication.md` after deployment.
