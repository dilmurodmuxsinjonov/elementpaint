# Customer comments — 11 October 2026

Runtime `20261011.5` addresses the four browser comments:

- Atlas nitrolak, Element Plaster, Atlas Glatt and Milano now use white vector
  display frames. The embedded JPEG/WebP bytes are unchanged; a traced SVG
  silhouette hides the studio backdrop. Package lettering is not regenerated,
  sharpened or re-encoded. Original photos remain linked from product details.
- Category labels are easier to read: Laklar, Emal bo‘yoqlar, Devor bo‘yoqlari,
  Astarlar (gruntovka), Shpaklyovkalar and Gulqog‘oz yelimlari. Empty categories
  are omitted from the normal list; existing direct category URLs still work.
  The hero now counts the 11 populated types from the catalogue.
- Home, catalogue, manufacturer, application and contact copy is reviewed in
  UZ/RU/EN. Contact says “Mahsulot tanlashingizga yordam beramiz.” Product names
  and technical identifiers remain recognisable; “Qizg‘ish pol” is corrected to
  “Qizg‘ish jigarrang”, matching the existing Russian/English reddish-brown name.
  Colour IDs, hex values, package assignments and weights are unchanged.
- The settings button, dialog and event handlers are removed. Only the existing
  light/dark toggle remains. Retired hidden settings use standard defaults;
  device reduced motion is still respected. The supplied loader is unchanged.

Validation: 45 approved cards, 34 variants, 72 byte-identical native PDF images,
20 legacy links and complete translations. White-frame tests compare every
embedded photograph to the original bytes. Loader fidelity still matches 288
source frames. Local browser checks cover all four frames, Atlas details and
its original image link, Laklar filtering, UZ/RU/EN, 375 × 812, contact navigation
and absence of settings. No console warnings/errors.

Publish only the tested package to `preview-site`; main/server/DNS untouched.
