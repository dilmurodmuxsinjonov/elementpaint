# Original catalogue image restoration

The client asked for clearer product pictures while protecting the original package text. The reported Atlas primer/yacht-lacquer cards showed oversized, clipped images. The prior background-removal pass had also removed the primer's red cap and damaged subtle white-container details.

All 72 embedded PNG product images have now been extracted directly from the audited PDF, without resizing, sharpening, background removal, recolouring, generated lettering or lossy re-encoding. Their native heights range from 594 to 696 pixels. This restores the available source detail; it does not invent higher-resolution label artwork.

`tools/restore_catalog_images.py` verifies the PDF's SHA-256 and writes an original-image manifest. `tests/verify_original_images.mjs` checks all 72 file hashes and native dimensions. The bytes served by the site match the native PDF extraction exactly. Existing approved pictures outside that PDF retain their files.

All product cards now place their image inside a bounded square frame with `object-fit: contain`. An absolutely positioned image prevents intrinsic portrait dimensions from stretching the square and clipping the package. The details dialog and hero selector also show the complete image. Colour-altering multiply blending is removed from product imagery. A translated “Open original image” link in product details provides direct access to the original file.

Verification:

- `node tests/verify_original_images.mjs`: 72 unmodified native originals.
- `node tests/verify_preview_data.mjs`: 45 approved products, 34 colours, 72 original PDF pictures and package weights; 20 legacy links; UZ/RU/EN.
- Browser: full red-capped Atlas primer and yacht-lacquer packages on desktop; correct original PNG links, detail images and 375 px phone layout without horizontal overflow.

Only the source design branch and `preview-site` runtime are changed. Production main/server/DNS are untouched.
