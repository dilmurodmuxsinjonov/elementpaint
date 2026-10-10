# Jonli sinov — 7 oktabr 2026

## 9 oktabr 2026: 2026 katalog mosligi

45 tasdiqlangan karta, 34 rang va 72 PDF qadoq rasmi saqlandi. Qadoq
og‘irliklari va ayrim nomlar asl katalogga moslandi; yangi mahsulot qo‘shilmadi.
Batafsil tekshiruv: `docs/catalog-2026-audit.md`.

- Manba commit: `d377f79251a84081c880248fb3707650839ed2cf`,
  `design-refresh-20261005`.
- Sinov runtime commit: `f7069467b1e9c8489b8eeba2f25b32784442564d`,
  `preview-site`.
- GitHub Pages build va deploy muvaffaqiyatli:
  https://github.com/dilmurodmuxsinjonov/elementpaint/actions/runs/37957471192.
- Jonli havola brauzerda tekshirildi:
  https://dilmurodmuxsinjonov.github.io/elementpaint/?lang=uz#catalog.
  45 karta, 10 brend, Berlak universal 2,7 kg, Atlas astari 2,8 / 5 kg
  va Artek `Qizg‘ish pol` rang nomi ko‘rindi.
- `main` SHA o‘zgarmadi: `14fcd39e1a70198117537ee676a3874067eac6a1`.
  Asosiy server, domen va Sites zaxira nusxasi yangilanmadi.

Quyida avvalgi sinov nashrlarining tarixiy qaydlari.

Asosiy sinov havolasi: https://dilmurodmuxsinjonov.github.io/elementpaint/

Zaxira sinov havolasi: https://elementpaint-client-preview.muxsinjonovdilmurod.chatgpt.site

Kod va hujjatlar: https://github.com/dilmurodmuxsinjonov/elementpaint/tree/design-refresh-20261005

Ikkala havola alohida mijoz ko‘rish nusxasi. elementpaint.uz, Billur hosting, asosiy domen DNS va main tarmog‘i o‘zgartirilmagan.

## 7 oktabr yangilanishi

MILANO dekorativ qoplamasi, 25 kg qadoq bilan qo‘shildi. Katalog 24 mahsulot oilasidan iborat. Milano qadoq rasmi mijoz yuborgan qora fonli asl ko‘rinishda saqlandi. Mobil mahsulot oynasida butun qadoq ko‘rinadi. Asosiy GitHub Pages runtime commit `fec439b2e5d953f0e295b6430a50795ddc07c14e`; build va jonli sahifa brauzerda tekshirildi.

7 oktabrdagi yangilanish faqat GitHub Pages asosiy sinov havolasiga chiqarildi. Sites zaxira havolasi avvalgi ko‘rinishda qolgan.

## Nashr dalillari

- GitHub Pages: `preview-site` tarmog‘i, ildiz `/`, custom domain yo‘q, HTTPS yoqilgan. Dastlabki runtime commit: `e753ad8ae117e6b583065413f4b94a33153431e6`; 7 oktabr yangilanishi yuqorida qayd etilgan.
- GitHub manzili brauzerda ochildi: 24 mahsulot, Milano qidiruvi va mahsulot oynasi ko‘rsatildi. 25 kg yozuvi va butun qadoq rasmi telefonda tekshirildi. Qopqoq ochish va bo‘yoq oqimi avvalgi tashqi HTTPS ko‘rishda tekshirildi.
- Sites zaxirasi: `appgprj_6ac4152529e081919dfac8f2e3d2fad0`; versiya 1; deploy `appgdep_6ac415eac3288191bb9923c2606a40f5`, natija `succeeded`. Shu natijadagi literal URL yuqorida. Audience: public, havolani mijoz ochishi uchun.
- Sites checkout: `D:\Codex\elementpaint-client-site`; source commit `1ccb6ade81ad4f907a6651f5d6d6bc5a219c0f52`. `.openai/hosting.json` project identity va static directoryni saqlaydi. Credential faylga yozilmagan.

Sinov nusxasi yakuniy ishlab chiqarish chiqarilishi emas. Mijoz tuzatishlari, asl yorliq va haqiqiy telefondagi ishlash tekshiruvi keyingi bosqich.

## 2026-10-09: studio design follow-up

- Source implementation: `5d0b4489e3811d3b43432e3b7d0a13773e609db0` on `design-refresh-20261005`.
- Preview runtime: `80ac35a555861863440923da4c71088bd609220d` on `preview-site`.
- GitHub Pages run [37961169520](https://github.com/dilmurodmuxsinjonov/elementpaint/actions/runs/37961169520): completed successfully.
- Live preview checked at https://dilmurodmuxsinjonov.github.io/elementpaint/?lang=uz#home : app version `20261009.2`, 45 cards, new settings dialog, active WebGL scene and increasing receiving fill. The logo introduction was replayed and its liquid filling captured at 63%.
- Main stayed at `14fcd39e1a70198117537ee676a3874067eac6a1`; no production server access or deployment.
- Validation details: [studio-design-20261009.md](studio-design-20261009.md).

## 2026-10-10: warm crystal glass design

- Source: `9ee6e95` on `design-refresh-20261005`.
- Preview runtime: `e404a73efca3f2088cd71ebeb6aa1f25471b06bf` on `preview-site`.
- [GitHub Pages run 38069939822](https://github.com/dilmurodmuxsinjonov/elementpaint/actions/runs/38069939822) completed successfully.
- Live preview shows app version `20261010.2`, 45 catalogue cards and 45 hero slides. The hero's Next/Details action opened Crown travertine with its verified 25 kg package. No browser warnings or errors were reported on the live page.
- Local browser checks covered UZ/RU/EN, light/dark, 375 and 320 px phone widths, keyboard navigation, category filters, optional automatic switching and reduced motion. The fluid introduction was captured during pouring at 53% and completed automatically.
- `main` remained `14fcd39e1a70198117537ee676a3874067eac6a1`. No production server or DNS deployment.
- Design and checks: [glass-design-20261010.md](glass-design-20261010.md).

## 2026-10-10: original package images

- Source implementation: `c43b525` on `design-refresh-20261005`.
- Preview runtime: `046f5f447cc086853c307ed9c90c31099115eefe` on `preview-site`.
- [Pages run 38070626901](https://github.com/dilmurodmuxsinjonov/elementpaint/actions/runs/38070626901) completed successfully.
- Live app version `20261010.3` verified: 45 products, native Atlas primer PNG at 319 × 604 px, its original-image link, complete red cap and uncropped package framing. Browser reported no warnings or errors.
- All 72 served PNG files match native PDF extraction hashes; no image-text regeneration or lossy re-encoding. Mobile and desktop image containment were checked. The available native resolution is retained, rather than synthesizing missing lettering.
- `main` stayed at `14fcd39e1a70198117537ee676a3874067eac6a1`; production server and DNS untouched.
- Details: [original-images-20261010.md](original-images-20261010.md).
