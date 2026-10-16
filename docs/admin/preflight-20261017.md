# Element Paint: server oldi tekshiruvi — 17 oktabr 2026

## Xulosa

Mahalliy admin va katalog ulanishi tekshiruvdan o‘tdi. Ommaviy sinov katalogi
ishlaydi. Internetdagi admin xizmatini ishlab chiqarishga chiqarish **hali
tayyor deb tasdiqlanmadi**: joriy xizmat mahalliy Python `http.server` asosida.
Billur hostingda doimiy Python jarayoni, HTTPS ortidagi admin ulanishi va xizmat
boshqaruvi alohida tayyorlanishi kerak. Serverga hech qanday fayl yuklanmadi,
hosting sozlamalari saqlanmadi, DNS va asosiy sayt o‘zgartirilmadi.

Tekshiruv 16 oktabrda boshlangan, 17 oktabrda yakunlangan. Xom dalillar va
suratlar: `D:/Codex/ElementPaint/preflight-20261016/`.

## Tuzatilgan xatolar

1. Snapshot yuklanmasa eski to‘plamdagi mahsulotlar yana ko‘rinishi mumkin edi.
   Endi HTTP xatosi, uzilgan aloqa, vaqt tugashi yoki buzilgan katalogda eski
   mahsulotlar chiqarilmaydi; uch tilda qayta urinish xabari ko‘rsatiladi.
   Ataylab bo‘sh qoldirilgan katalog ham to‘g‘ri ishlaydi. Vaqt cheklovi odatiy
   AbortController bilan ishlaydi, yangi AbortSignal.timeout APIga bog‘liq emas.
2. Paketlovchi katalog papkasidagi eski va qoralama yuklamalarni ham olishi
   mumkin edi. Endi `assets/admin-media/` ichidan faqat joriy ommaviy snapshot
   ishlatgan fayllar nashr paketiga kiradi. Asl mahalliy media o‘chirilmaydi.
3. Sessiya tahrir vaqtida tugasa modal kirish sahifasini yopib qolardi.
   Endi barcha modallar yopiladi va tahrir maydonlari tozalanadi.
4. O‘qish uchun mo‘ljallangan statik/katalog manzillariga yozish usullari endi
   HTTP 405 va Allow sarlavhasini qaytaradi. Tasodifiy port bilan sinovda
   berilgan HTTPS origin endi almashtirib yuborilmaydi.

## Bajarilgan tekshiruvlar

| Yo‘nalish | Natija va dalil |
| --- | --- |
| Haqiqiy foydalanuvchi bazasi | Faqat o‘qib tekshirildi: 73 mahsulot, bitta faol owner, savat 0. SQLite integrity: ok; FK xatosi: 0. Login/parol almashtirilmadi. |
| API va ma’lumot saqlash | 9 mavjud hamda 6 qo‘shimcha sinov guruhi o‘tdi. Haqiqiy HTTP va SQLite, alohida vaqtinchalik ma’lumotlar. |
| Himoya | Kirishsiz admin API rad etiladi; CSRF, Host/Origin, rollar, login urinishlari chegarasi, parol almashtirilganda sessiyalar bekor bo‘lishi, logout va sessiya muddati tekshirildi. Maxfiy fayl/traversal manzillari 404. CSP, nosniff, frame-deny va no-store tekshirildi. |
| Mahsulotlar | Qo‘shish, tahrir, nusxa, holatlar, UZ/RU/EN, qadoq birliklari, rasmlar, tarix, eskirgan revision, guruhli amallarning to‘liq bekor bo‘lishi tekshirildi. |
| Savat | Barcha maydonlar va rasmlar saqlanishi, muddati o‘tganda ham tiklash, owner va alohida tasdiq bilan butunlay o‘chirish sinovdan o‘tdi. Haqiqiy foydalanuvchi mahsuloti o‘chirilmadi. |
| Bir vaqtdagi tahrir | Ikkita parallel PATCHdan biri 200, ikkinchisi 409: ma’lumot jim ustiga yozilmaydi. |
| Zaxira va tiklash | SQLite zaxirasi va media alohida joyga tiklandi; mahsulotlar va rasm baytlari mos, tiklangan baza integrity/FK tekshiruvlaridan o‘tdi. JSONning o‘zi to‘liq zaxira emas. |
| Brauzer | Test akkaunt bilan kirish, Milano tahririni saytda ko‘rish, savatga o‘tkazib yo‘qolishini, tiklab qaytishini tekshirish, asl nomini qaytarish, 25 kg va asl rasm havolasi. Qayd etilgan konsol xato/ogohlantirishlari: 0. |
| Katalog | 73 karta, 34 rang kartasi, 9 brend, qidiruv, filtrlar va eski rang havolalari. Uch til, bo‘sh katalog va xato holati DOM sinovlaridan o‘tdi. |
| Rasmlar va animatsiya | 72 PDF tasviri baytma-bayt mos. Milano yorlig‘ining 398161 pikseli va qirqish chegaralari mos. Oq ramkalar hamda mijoz animatsiyasining 288 kadri saqlangan. |
| Internetdagi preview | 145 mavjud runtime fayli HTTP 200; rasmlarda yo‘qolgan havola yo‘q. Mahalliy deploy checkout bilan farqlar faqat CRLF/LF satr oxirlari. Admin/API/baza/.env/.git manzillari 404. |
| Mahalliy parallel o‘qish | 6 parallel ishchi bilan 30 so‘rov: hammasi 200; median 0.017 s, p95 0.332 s. Bu ishlab chiqarish yuklamasi sertifikati emas. |
| Sinov paketi | 127 runtime fayli, taxminan 29 MB. Admin kodi, akkaunt, SQLite, savat va audit paketga kirmaydi. |

## Billur hosting — faqat ko‘rish

- Faol sayt ildizi: `elementpaint-refresh-20261003`; unda avvalgi statik sayt bor.
- HTTP → HTTPS va www → asosiy domen: 301; yakuniy HTTPS sahifa: 200.
- TLS 1.3; tekshirilgan sertifikat ikkala domenni qamraydi, 31 dekabr
  2026-yilgacha amal qiladi.
- Panel PHP 8.1.34 ni eskirgan deb ko‘rsatmoqda. Joriy admin Python bilan
  ishlaydi; PHP versiyasini o‘zgartirish uni ishga tushirmaydi.
- Chrooted SSH ko‘rsatilgan. Bu doimiy Python jarayoni yoki reverse proxy
  sozlash huquqi borligini o‘z-o‘zidan tasdiqlamaydi; bu imkoniyat tekshirilmagan.
- Sozlamalar oynasi “Bekor qilish” orqali yopildi. Hech qanday credential,
  SSL, papka, DNS yoki hosting turi o‘zgartirilmadi.

## Ishlab chiqarishdan oldin qolgan shartlar

1. Hostingda Python 3.11+, Pillow talabi, SQLite va doimiy xizmat ishlashi
   tasdiqlanadi yoki shu imkoniyatga mos server tanlanadi. Mahalliy muhit:
   Python 3.12.14, Pillow 12.3.0, SQLite 3.53.1.
2. Mahalliy HTTP xizmatiga ishlab chiqarishga mos xizmat qatlami tayyorlanadi;
   avtomatik qayta ishga tushish, so‘rov hajmi/vaqti chegaralari va kuzatuv
   tekshiriladi. HTTPS tashqi origin/Host, cookie va proxy yo‘li bilan qayta
   integratsiya sinovi kerak. Joriy launcher faqat loopback uchun.
3. `admin-data` web ildizidan tashqarida, cheklangan xizmat foydalanuvchisi
   ostida saqlanadi. Baza akkaunt/parol xeshlari va sessiya ma’lumotlarini
   tutadi; uni ommaviy fayl sifatida tarqatish mumkin emas. Zaxiraga ham shu
   cheklovlar qo‘llanadi. Admin uchun qo‘shimcha 2FA yoki VPN kirish qatlami
   server imkoniyatiga qarab tanlanadi.
4. Serverdagi avtomatik to‘liq zaxira, qayta tiklash sinovi va avvalgi saytga
   qaytish rejasi ishlab chiqarish muhitida bajariladi. Lokal tiklash sinovi
   serverdagi tiklashning o‘rnini bosmaydi.
5. Mobil brauzerda vizual yakuniy sinov qaytariladi: brauzer vositasidagi 390 px
   sozlama amalda 1280 px bo‘lib qoldi. Ushbu tekshiruv mobil sinov o‘tdi deb
   hisoblanmadi. Desktop brauzer va DOM sinovlari o‘tgan.

Rasmiy manbalar: Python `http.server` ishlab chiqarish uchun tavsiya etilmaydi
([Python hujjati](https://docs.python.org/3.12/library/http.server.html));
[PHP qo‘llab-quvvatlanadigan versiyalar](https://www.php.net/supported-versions.php).

## Qayta tekshirish

```powershell
python -m unittest discover -s tests -p test_admin_api.py -v
python -m unittest discover -s tests -p test_preflight.py -v
node tests/test_admin_dom.mjs
node tests/test_catalog_source.mjs
node tests/test_catalog_failure.mjs
node tests/test_catalog_cards_dom.mjs
node tests/verify_preview_data.mjs
```

DOM sinovlari uchun Node.js va `tmp/dom-check` ichidagi jsdom kerak.
Ma’lumotlarni o‘zgartiradigan sinovlar haqiqiy admin bazasida ishlamaydi.
Tekshiruv yakunida vaqtinchalik 8093 xizmat to‘xtatildi; haqiqiy mahalliy
admin 127.0.0.1:8092 da mavjud akkaunt bilan qayta ishga tushirildi.
