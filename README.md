# Element Paint

Element Paint MCHJ uchun statik mahsulotlar katalogi: https://elementpaint.uz/.
HTML, CSS va JavaScript; Node.js yoki ma’lumotlar bazasi talab qilinmaydi.

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
```

Brauzer tekshiruvlari Python Playwright va Microsoft Edge’dan foydalanadi.
Lokal server ishlayotgan bo‘lishi kerak. Oxirgi test uchun boshqa sayt manzilini
`ELEMENT_PAINT_URL` muhit o‘zgaruvchisida belgilash mumkin.

## Hosting

BillurCOM Plesk. Asosiy manzil: https://elementpaint.uz/.
Let’s Encrypt sertifikati elementpaint.uz va www.elementpaint.uz ni qamrab oladi.
Sayt ommaviy katalog va aloqa havolalarini taqdim etadi; buyurtmalar telefon
va Telegram orqali olinadi.
