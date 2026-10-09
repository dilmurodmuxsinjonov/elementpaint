# 2026 katalog tekshiruvi — 9 oktabr 2026

Ish `design-refresh-20261005` tarmog‘idagi `e9b91f3` holatidan boshlandi.
Natija faqat mijoz uchun GitHub Pages sinov nusxasiga chiqariladi.
Asosiy server, domen va `main` tarmog‘i o‘zgartirilmaydi.

## Manba va doira

Asl manba: mijoz bergan `Element katalog 2026.pdf`, 1 katta sahifa.
SHA-256: `d776654829ddd795674ff9ecf6d3fd5c44ce3d19dc2f6b65c701a8681bdec997`.

PDFdagi 72 ta qadoq tasviri, etiketka nomlari va har bir mahsulot ostidagi
`kg` qatori tekshirildi. Rasm raqamlari chiqarib olish tartibidir: masalan,
7 — gulqog‘oz yelimi, 8 — 2,5 kg astar; 72 — oxirgi qatordagi Delta astari.
Ularni PDFdagi chapdan o‘ngga ustun tartibi deb qabul qilish mumkin emas.

`tests/fixtures/catalog-2026.json` PDFdan olingan qadoq og‘irliklari, sahifadagi
joylashuv va ko‘z bilan tekshirilgan mahsulot/rasm bog‘lanishini saqlaydi.
Tekshiruv sayt ma’lumotlarini shu mustaqil manbaga solishtiradi.

45 ta tasdiqlangan karta, 34 ta rang varianti va 72 ta PDF rasmi saqlandi.
Avvalgi 20 mahsulot havolasi ham ishlaydi. PDFdan tashqaridagi oldindan
tasdiqlangan Element Plaster, Atlas Nitro, Atlas Glatt va Milano saqlandi.
Milano uchun avval tasdiqlangan 25 kg qoldirildi; qolgan uch mahsulot uchun
yangi og‘irlik taxmin qilinmadi. Yangi mahsulot yoki rang qo‘shilmadi.

## Tuzatilgan ma’lumotlar

- Berlak universal oq emali: 3 kg o‘rniga PDFdagi 2,7 kg.
- Berlak, Atlas va Delta kanistrli astarlari: 2,8 / 5 kg to‘liq ko‘rsatiladi.
  Ko‘p qadoqli mahsulot nomlaridan bitta og‘irlik olib tashlandi; eski ID saqlandi.
- Atlas PF-283 va yaxta laki: 0,8 / 2,2 kg.
- Berlak fasad/interyer va Waterlux: 4 / 9 / 14 / 18 / 20 kg.
- Atlas hamda Artek fasad/interyer oilalari: 18 / 20 kg.
- Element, Crown va Delta travertinlari: 25 kg.
- Artek Improved va Universal pol emallari: 0,9 / 2,7 kg.
- Element gruntovkasi: 3 kg; Element travertin laki: 5 / 10 / 15 kg;
  Primer Plus: 20 kg; Argon 801: 0,8 kg; ikki Dekor qadoqi: 20 kg.
- Artek Improved 46-rasm: `Qizg‘ish pol` / `Красно-коричневая` / `Reddish brown`.
  Avval ikki rang bir xil o‘zbekcha nomlangan. Mavjud `dark-red` havola IDsi saqlandi.
- Atlas PF-115 14-rasm ruscha nomi etiketkadagi `Бордовый` bilan moslandi.
- Brendlar soni avvalgi 5 o‘rniga amaldagi 10; endi katalogdan hisoblanadi.

Rasm bog‘lanishlari allaqachon to‘g‘ri bo‘lgan; 72 ta rasm qayta yaratilmagan
yoki almashtirilmagan. Kesh versiyasi `20261009.1` ga yangilandi.

## Tekshiruv

- `node tests/verify_preview_data.mjs`: 45 tasdiqlangan karta, 34 rang,
  72 rasm va PDF qadoq og‘irliklari, uch til, eski havolalar, KRATA yo‘qligi.
- Mahalliy nashr paketida brauzer orqali barcha 45 karta va barcha 34 rang
  ochildi: mahsulot oynalari va rasmlar ishladi, buzilgan rasm aniqlanmadi.
- 390 × 844 mobil ekran: UZ/RU/EN rang nomi va qadoq yozuvlari, qidiruv,
  Delta brend filtri, Escape bilan yopish; gorizontal chiqib ketish yo‘q.
- Brauzer konsolida xato yoki ogohlantirish qayd etilmadi.
- Sinov ZIP faqat runtime fayllarini oladi: PDF, fixture, hujjatlar va ish
  fayllari ommaviy Pages nusxasiga kiritilmaydi.

Jonli nashr natijasi `docs/preview-publication.md` da qayd etiladi.
