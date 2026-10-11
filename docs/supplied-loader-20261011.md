# User supplied loader — 11 October 2026

The customer supplied `loader.html` and explicitly selected that animation. Its
original copy is kept in `docs/reference/loader.html` (SHA-256
`5ea2d2b99f52e8cdeed20fa56c1d2c16b5a0c7dce9ea1528fe94dee738f8f7e7`).
All supplied SVG paths, masks, gradients, the stylized paint can, sketch,
top-down flowing paint, sheen and upward curtain exit are retained. This choice
replaces the previous video and the unpublished canvas experiment. There are
no videos, new package art, captions or additional products in this change.

The SVG and CSS are extracted into runtime files by
`tools/import_supplied_loader.py`. The script is adapted to a scoped controller:
no demo looping, global page resets, query-string theme overrides or global
`EPLoader` state. Progress comes from settled critical image decoding, fonts and
page load readiness. It is resource readiness, not a byte download percentage.
Failures settle so an unavailable image cannot keep the overlay open forever.
The original fluid choreography smooths readiness and continues flowing to
complete the mark before the curtain exits.

The app displays the animation once per session on the home entry. Catalogue
and product links open directly. Settings can replay it; reduced motion disables
it. Skip, Escape, hidden tab, route changes, initialization failure and a
nine-second fallback release the page. A fresh SVG scene restarts the sketch
and droplets on replay. Stopping cancels frames, exit listeners and timers.
Background controls are inert during the loader and keyboard focus is restored.

Validation:

- `test_supplied_loader.mjs`: pending progress, monotonic readiness, complete
  fill, curtain completion exactly once, cancellation and finite stream paths.
- `test_loading_progress.mjs`: pending tasks, failed image settlement, ignored
  late callbacks after cancellation and empty task lists.
- `verify_preview_data.mjs`: 45 cards, 34 colours, 72 original packages, native
  weights and UZ/RU/EN; no unapproved products.
- `verify_original_images.mjs`: all 72 native PNG files still match the PDF.
- Local browser: pending 50% stays in pour; Ready reaches 100% and completes;
  375 × 812 layout; light/dark; catalogue entry; settings replay; reduced motion
  disables replay; Skip hides the overlay, clears inert and restores focus.

Only the tested preview package is published to `preview-site`.
