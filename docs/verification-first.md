# Sinov natijalari — 6 oktabr 2026

## Tasdiqlangan

- Katalog: oldingi 20 yozuv saqlandi; 23 mahsulot oilasi; 10 asosiy yo‘nalish; KRATA katalogda yo‘q. Atlas Blue/Yellow/Brown eski havolalari mos rangga yo‘naltiriladi. Artek qora/oq alohida.
- UZ/RU/EN interfeys kalitlari, barcha mahsulot nomlari/tavsiflari va ranglar to‘liq. Bo‘sh rasm yo‘q, barcha fayllar mavjud. Oq PF-115 3 kg, boshqa ranglar 2,7 kg.
- So‘nggi nusxa brauzerda: 320, 375, 390, 768, 1024, 1440, 1920 px. Har bir holatda scrollWidth == clientWidth; UZ/RU/EN 44×44 px.
- Ruscha mobil menyu 390 pxda ochilganda sig‘adi. Oldingi 320/375/390/760 px UZ/RU/EN menyu sinovlari ham o‘tgan.
- Mahsulot kartalarining rasmlari kvadrat; 23 kartaning barcha rasmlari katalog bo‘ylab o‘tganda yuklandi. Atlasning o‘nta rangini alohida bosib tekshirildi, har biri o‘z banka rasmini ochadi.
- PF 115 qidiruvi nomdagi tire bo‘lmasa ham mos mahsulotlarni topadi. RU → PVA → EN holati saqlanadi. Ruscha 1 mahsulot birlikda yoziladi.
- Dialog Escape bilan yopiladi va fokus mahsulotga qaytadi. Menyu yopilganda fokus menyu tugmasiga qaytadi.
- Qorong‘i rejim tanlangach reload light rejimni qaytaradi; til saqlanadi.
- 3D: kompyuter va 390 px ekranida ochiq qopqoq kadrga to‘liq sig‘adi; oqim bankadan chiqadi; bo‘yoq tugagach quyish avtomatik to‘xtaydi, tugma o‘chadi va qayta boshlash xabari chiqadi; reset yopiq bankani tiklaydi. Qopqoqni bevosita bosish va klaviatura aylantirishi tekshirilgan.
- Brauzer sinovi oxirida error/warn konsol yozuvlari yo‘q.
- Maxsus sinov sahifasida WebGL konteksti uzildi: 3D canvas va boshqaruvlar yashirildi, Berlak rasmi ko‘rindi; Artek qidiruvi yana 4 mahsulotni topdi. Fixture sinov fayli public runtimega kiritilmagan.
- JavaScript sintaksisi va offline ma’lumot tekshiruvi o‘tgan.
- ZIP: 55 runtime fayl, 11,42 MB; mahalliy Three.js, Manrope, litsenziyalar va tanlangan rasmlar. Git, chat, docs, xom PNG, test, ishlab chiqarish redirecti yo‘q. noindex, robots va .nojekyll bor.
- Asosiy D:\elementpaint.uz checkout toza; ishlab chiqarish HTML/CSS/JSga tegilmagan.

## Qolgan chegaralar

- Asl yuqori sifatli etiketkalar olinmagan; AI maketlarning mayda yozuvlari va texnik tavsiflari zavod bilan tasdiqlanishi kerak. Havorang / To‘q ko‘k / Oq yozuvlaridagi aniq xatolar qayta tahrirlangan rasmlarda tekshirildi.
- Haqiqiy iPhone/Android GPU va sekin tarmoq tezligi o‘lchanmagan. Reduced-motion va boshidan WebGL mavjud bo‘lmagan holatning tizim sinovi bajarilmagan; ishlayotgan kontekstning uzilish sinovi o‘tgan.
- Jonli GitHub Pages brauzerda tekshirildi; 390 px ruscha mobil menyu, 1440 px sahifa, tashqi manzildagi 3D qopqoq/quyish ishladi. Sites zaxirasi native deploy natijasida succeeded. Nashr dalillari `preview-publication.md`da.
- Mijoz tasdig‘i va asosiy serverga chiqarish keyingi bosqich.
