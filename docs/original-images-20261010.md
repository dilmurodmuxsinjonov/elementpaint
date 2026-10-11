# Original catalogue image restoration

The client asked for clearer product pictures while protecting the original package text. The reported Atlas primer/yacht-lacquer cards showed oversized, clipped images. The prior background-removal pass had also removed the primer's red cap and damaged subtle white-container details.

All 72 embedded PNG product images have now been extracted directly from the audited PDF, without resizing, sharpening, background removal, recolouring, generated lettering or lossy re-encoding. Their native heights range from 594 to 696 pixels. This restores the available source detail; it does not invent higher-resolution label artwork.

`tools/restore_catalog_images.py` verifies the PDF's SHA-256 and writes an original-image manifest. `tests/verify_original_images.mjs` checks all 72 file hashes and native dimensions. The bytes served by the site match the native PDF extraction exactly. Existing approved pictures outside that PDF retain their files.

All product cards now place their image inside a bounded square frame with `object-fit: contain`. An absolutely positioned image prevents intrinsic portrait dimensions from stretching the square and clipping the package. The details dialog and hero selector also show the complete image. Colour-altering multiply blending is removed from product imagery. A translated “Open original image” link in product details provides direct access to the original file.

On 2026-10-11, the customer flagged the Atlas acrylic-primer image (PDF image 18). The supplied catalogue's embedded original is 319 × 604 px and already contains the visibly fragmented white label graphic. The customer chose the clearer red-label 2.8 kg photo from the BERLAK seller's older listing for product card #29. It is served as a display photo at `assets/atlas_primer_legacy_red-2021.jpg` (431 × 800 px; SHA-256 `e2037f9b38ad0cbba10299756996c51d2ae9d6a9a50e79f2fb7cc3448ce2ac49`). The product detail keeps the approved green-label 2026 PDF image under “Asl rasmni ochish”, so both the customer-selected display and the exact current catalogue package remain accessible. Product identity, approved sizes (2.8 / 5 kg), the 72 original PDF PNG files and their hashes are unchanged. Image listing source: https://glotr.uz/akrilovaya-gruntovka-atlas-p-495570/.

Verification:

- `node tests/verify_original_images.mjs`: 72 unmodified native originals.
- `node tests/verify_preview_data.mjs`: 45 approved products, 34 colours, 72 original PDF pictures and package weights; 20 legacy links; UZ/RU/EN.
- Browser: full red-capped Atlas primer and yacht-lacquer packages on desktop; correct original PNG links, detail images and 375 px phone layout without horizontal overflow.

Only the source design branch and `preview-site` runtime are changed. Production main/server/DNS are untouched.
