# Element Paint mahalliy admin paneli

PowerShell orqali loyiha papkasida:

```powershell
powershell -ExecutionPolicy Bypass -File tools/start_admin.ps1
```

[Panel](http://127.0.0.1:8092/admin/) va
[mahalliy katalog](http://127.0.0.1:8092/?lang=uz#catalog).
Birinchi kirishda o‘z login/parolingizni yarating. Tayyor parol yo‘q.
Parol kamida 12 belgi. Panel faqat shu kompyuterdan ochiladi.
Yopilgan xizmatni shu buyruq bilan qayta ishga tushiring; ma’lumot saqlanadi.
Python 3.11+ va `admin/requirements.txt` dagi Pillow kerak. Launcher mavjud
Codex Python muhitidan foydalanadi, bo‘lmasa tizim Pythonini ishlatadi.

Mahsulotlarni qo‘shish, tahrirlash, nusxalash, qidirish va filtrlash mumkin.
UZ/RU/EN matnlar, brend, bo‘lim, qadoq, birlik, rang, SKU, tartib va rasmlar
tahrirlanadi. Yangi nusxalar qoralama. Faqat “Saytda ko‘rinadi” holati ochiq
katalogga chiqadi. Mahalliy saytni yangilab natijani ko‘ring.

O‘chirish mahsulotni **savatga** ko‘chiradi. Rasmlar va barcha ma’lumotlar
saqlanadi; tiklanganda avvalgi nashr holatiga qaytadi. Dastlabki muddat 30 kun,
sozlamada 1–365 kun. Bu yangi o‘chirishlarga taalluqli. Muddat o‘tganda avtomatik
yo‘qolmaydi. Butunlay o‘chirish faqat bosh admin va alohida “O‘CHIRISH” tasdig‘i
bilan; undan oldin baza zaxiralanadi. O‘chirilgan mahsulotning media fayllari
ham avtomatik o‘chirilmaydi.

Tahrir tarixi oldingi holatga qaytish imkonini beradi. Ikki oynada bir mahsulot
o‘zgarsa, eski tahrir jim ustiga yozilmaydi — ro‘yxatni yangilang.
Bog‘langan brend/bo‘limni, jumladan savatdagi mahsulot ishlatganini o‘chirib
bo‘lmaydi.

Ma’lumot: `D:/Codex/elementpaint-preview/admin-data/`
- `catalog.sqlite3`: katalog, akkaunt va amallar tarixi;
- `media/`: yuklangan asl raster rasmlar;
- `backups/`: muhim amallardan oldingi SQLite nusxalar.

**To‘liq zaxira:** xizmatni to‘xtating va butun `admin-data` papkasini nusxalang.
Tiklashda xizmat o‘chiq holda shu papkani qaytaring. Dastlabki tasdiqlangan
rasmlar loyiha `element_paint_web/assets` papkasida; uni ham saqlang.
JSON eksportda rasmlarning o‘zi va akkauntlar yo‘q; u to‘liq zaxira o‘rnini
bosmaydi. JSON import mavjud faol yozuvlarni birlashtiradi, yangilarni
qoralama qiladi, yetishmagan yozuvlarni o‘chirmaydi. Savatdagi yozuvni avval
tiklamasdan import bilan o‘zgartirib bo‘lmaydi. Import xatosida hammasi
orqaga qaytariladi; importdan oldin baza zaxirasi yaratiladi.

“Sinov sayti fayllarini tayyorlash” faqat ochiq katalog va uning media
fayllarini `element_paint_web/catalog-snapshot.json` va `assets/admin-media/`
ga chiqaradi. Bu tugma internetga joylamaydi. So‘ng mavjud preview paketlash
jarayoni bilan **preview-site** branch yangilanadi. Admin kodi, akkauntlar,
savat va baza GitHub Pages paketiga kirmaydi. Production katalogi serverda
Apache gateway orqali darhol yangilanadi; unga statik eksport ishlatilmaydi.

Tekshiruv:
```powershell
python -m unittest discover -s tests -p test_admin_api.py -v
node tests/test_admin_dom.mjs
node tests/test_catalog_source.mjs
```
API sinovlari vaqtinchalik alohida bazada ishlaydi, haqiqiy admin akkauntini
yaratmaydi va foydalanuvchi katalogini o‘zgartirmaydi.

Server oldi tekshiruvi: `python -m unittest discover -s tests -p test_preflight.py -v`
va `node tests/test_catalog_failure.mjs`. Parallel tahrir, zaxiradan haqiqiy
tiklash, sessiya tugashi, yopiq fayllar va nashrga ortiqcha media chiqmasligi
tekshiriladi. [2026-10-17 tekshiruv xulosasi](../docs/admin/preflight-20261017.md).

`http.server` ishga tushirgichi mahalliy sinov uchun. Billur hostingidagi
production admini Apache CGI orqali Python 3.12 WSGI adapterini ishlatadi;
server porti internetga ochilmaydi. Joylash va rollback tartibi
[production deployment qaydida](../docs/admin/billur-deployment-20261017.md)
yozilgan. Plesk’da takroriy zaxira jadvali yoqilmagan; katta katalog
o‘zgarishidan oldin xususiy `data/` papkasini alohida nusxalang.
`admin-data` bazasi akkaunt/parol xeshlari va sessiyalarni ham saqlaydi;
u ochiq sayt ildiziga yoki GitHubga joylanmasligi kerak.
