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
`element_paint_web/preview.html` va `catalog-data.js` 73 ta tasdiqlangan karta:
PDFdagi 72 qadoq/rang yozuvi hamda alohida yuborilgan Berlak Milano.
Yuqoridagi 20 mahsulot eski asosiy sayt kodiga tegishli.

Sinov katalogini tekshirish: `node tests/verify_preview_data.mjs`.
Manba bilan solishtirish dalillari: `docs/catalog-2026-audit.md`.
Asosiy serverga chiqarish bu sinov yangilanishining doirasiga kirmaydi.

## Mahalliy admin paneli

Mahsulotlar, bo‘limlar, brendlar, tarjima, rasm, rang va qadoqlarni boshqarish,
savat va tiklash uchun haqiqiy Python/SQLite xizmat qo‘shilgan.
`tools/start_admin.ps1` ni ishga tushiring, http://127.0.0.1:8092/admin/ da
birinchi admin akkauntini yarating. Ma’lumot `admin-data/` da saqlanadi;
bu papka Git va ommaviy sayt paketidan chiqarilgan.
Qo‘llanma va zaxiralash tartibi: [admin/README.md](admin/README.md).
GitHub Pages admin xizmatini bajarmaydi; kompyuterda saqlash internetdagi
katalogni avtomatik yangilamaydi.

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

## 2026-10-09 sinov dizayni

GitHub Pages sinov sahifasi uchun 3D bo‘yoq studiyasi, suyuqlik bilan to‘ladigan logo,
saqlanadigan ko‘rinish sozlamalari va moslashuvchan katalog yangilandi.
Tafsilotlar va tekshiruvlar: [docs/studio-design-20261009.md](docs/studio-design-20261009.md).
Sinov paketini `tools/package_preview.py` tayyorlaydi. Asosiy hostingga chiqarilmagan.
