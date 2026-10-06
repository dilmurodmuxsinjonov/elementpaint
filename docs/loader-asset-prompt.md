# Haqiqiy Berlak bankasi — 6 oktabr 2026

Boshlanishdagi CSS shakl o‘rniga ko‘k Berlak PF115 qadoq tasviridan tayyorlangan ochiq metall banka ishlatiladi. Banka og‘zining o‘ng cheti harakat davomida bir joyda qoladi, oqim shu nuqtadan logoga tushadi. Qaymoqrang fon va qisqa animatsiya saqlanadi.

Vosita: built-in ImageGen, mavjud mahsulot tasvirini tahrirlash. Transparent alpha saqlangan. WebP faqat faylni yengillashtirish uchun kodlangan; o‘lcham va alpha o‘zgarmagan. Public asset: `element_paint_web/assets/berlak_loader_can_v1.webp` (1122 × 1402, 160638 bytes). Master: `design-assets/berlak-loader-can-v1.png`, Git va nashr paketidan tashqarida.

## Ishlatilgan yakuniy prompt

Use case: precise-object-edit / background-extraction. Asset type: transparent product photograph for a short website paint-pouring intro. Input image 1 is the edit target: the actual blue Berlak PF115 metallic paint can. Preserve its cylindrical shape, blue wrap artwork, gold Berlak tree and wordmark, PF115 lettering, reflective silver rims and photographic materials. Remove only the cream studio background and the closed lid. Show the can upright with an OPEN top: a realistic silver rim and visible warm gold paint just inside the opening. No detached lid, no stream, no puddle, no extra objects. Front label remains facing the viewer, same product design and lettering as reference, not a generic illustrated can. Isolate on genuine transparent alpha, no floor shadow or background. Tight centered portrait composition, whole can visible with about 5 percent transparent padding. Soft realistic studio highlights, crisp natural metal details.

## Ko‘rish tekshiruvi

Animatsiyaning o‘rtasidagi kadr uchun `tests/loader_visual_fixture.html` aynan sahifadagi loader HTML va CSSni ishlatadi, vaqtni to‘xtatadi. U ommaviy runtime paketiga kiritilmaydi. 320 px ekranda bankaning o‘zi kesilmaydi; oqim og‘izdan logoga yetadi. Oddiy sahifada intro tugagach 23 mahsulotli katalog va 3D bosh sahifa ishlaydi. Reduced motion tanlanganida intro o‘tkaziladi. Rasm yuklanmasa yoki juda kechiksa foydalanuvchining ochilgan sahifasi berkitilmaydi.
