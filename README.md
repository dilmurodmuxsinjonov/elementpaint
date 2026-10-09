# Element Paint

Element Paint MCHJ uchun statik mahsulotlar katalogi: https://elementpaint.uz/.
HTML, CSS va JavaScript; Node.js yoki ma’lumotlar bazasi talab qilinmaydi.
4 brend va 20 mahsulot. Har bir tashrif qaymoqrang tonggi rejimda boshlanadi.
Three.js 0.186.1 (MIT) sayt bilan birga saqlanadi; fondagi bo‘yoq animatsiyasi
ko‘rinmayotganda to‘xtaydi, harakatni kamaytirish sozlamasiga rioya qiladi.
WebGL mavjud bo‘lmasa, statik fon va barcha katalog imkoniyatlari ishlaydi.

## Mijoz uchun 2026 sinov katalogi

`design-refresh-20261005` — sinov saytining manba tarmog‘i;
`preview-site` — faqat GitHub Pages uchun tayyorlangan runtime.
`element_paint_web/preview.html` va `catalog-data.js` 45 ta tasdiqlangan karta,
34 ta rang varianti hamda PDFdan tayyorlangan 72 ta qadoq rasmini ishlatadi.
Yuqoridagi 20 mahsulot eski asosiy sayt kodiga tegishli.

Sinov katalogini tekshirish: `node tests/verify_preview_data.mjs`.
Manba bilan solishtirish dalillari: `docs/catalog-2026-audit.md`.
Asosiy serverga chiqarish bu sinov yangilanishining doirasiga kirmaydi.

## Fayllar

`element_paint_web/` — HTML, CSS, JavaScript, mahsulot rasmlari, HTTPS va eski
havolalar uchun `.htaccess`, `robots.txt` va `sitemap.xml`.
`element-paint-data.json` — aloqa ma’lumotlarining tekshiruv manbasi.

## Lokal ko‘rish

Loyiha ildizida `python -m http.server 8080 --bind 127.0.0.1`.
Brauzerda http://localhost:8080/ ni oching.

## Hosting paketi

```powershell
python tools/package_site.py --output D:\Codex\ElementPaint\elementpaint-release.zip
```

ZIP ichidagi `index.html` hostingdagi sayt ildizida turishi kerak.
Paket faqat sayt ishlashi uchun zarur fayllarni oladi. Testlar, README, chat tarixi
va Git fayllari serverga yuklanmaydi. Manifest SHA-256 xeshlarini saqlaydi.

## Tekshirish

```powershell
python tests/verify_catalog.py
python tests/test_interactions.py
python tests/test_design_regressions.py
python tests/test_morning_fallback.py
```

Brauzer tekshiruvlari Python Playwright va Microsoft Edge’dan foydalanadi.
Lokal server ishlayotgan bo‘lishi kerak. Oxirgi test uchun boshqa sayt manzilini
`ELEMENT_PAINT_URL` muhit o‘zgaruvchisida belgilash mumkin.

## Hosting

BillurCOM Plesk. Asosiy manzil: https://elementpaint.uz/.
Let’s Encrypt sertifikati elementpaint.uz va www.elementpaint.uz ni qamrab oladi.
Sayt ommaviy katalog va aloqa havolalarini taqdim etadi; buyurtmalar telefon
va Telegram orqali olinadi.
