# Berlak-to-logo video introduction

Replaced the live canvas intro with a locally rendered 3D video. `tools/render_brand_video.py` builds a curved can with the original Berlak photograph projected onto its front, steel rim and open inner wall, Snow White paint, a continuous narrowing 3D jet, and the original Element Paint alpha silhouette as shared logo geometry. Shader waves raise the white paint inside that silhouette. No AI-generated lettering, added caption, progress meter, sound, product or colour variant.

Timing: 0–0.7 s tilt; 0.7–3.7 s pouring and rising fill; 3.7–4.5 s can return and settling; final 0.5 s holds the filled mark. Camera is static. The liquid is a deterministic mesh/shader effect rather than a computational fluid solver or filmed footage.

Media: 150 frames, 1080 × 1080, 30 fps, 5.000 s. WebM uses VP9/yuv420p without audio; an H.264 MP4 with fast-start is provided for browser fallback. Both are encoded from the same rendered PNG frames. Large intermediate PNGs and `.blend` files remain in D: work storage, outside the runtime bundle.

The page loads video lazily: no media URL is attached on catalogue deep links or with reduced motion. It waits for decoded media before displaying the overlay. A failed/blocked/slow clip leaves the site usable. Playback is muted, inline and single-shot. Completion fades to the page; Escape, the accessible × button, page hiding or reduced motion stop playback. Settings replay restarts at zero. The overlay contains no visible words beyond original branding in the clip.

Validation: `tests/test_paint_video.mjs` covers lazy download, completion, replay, cancellation/replacement races, blocked playback, timeout and late completion. Browser checks cover actual WebM decoding, 5-second duration, muted playback, automatic end, skip/pause, reduced-motion replay suppression, no captions/progress, zero media source on catalogue entry, and uncut 375 × 812 phone layout. Catalogue and original-image checks retain 45 products, 34 colours, 72 byte-identical native PNGs and 20 legacy links.

Publication remains restricted to `preview-site` with app version `20261010.5`. Main, production hosting and DNS are untouched.
