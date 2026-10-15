# Element Paint katalog admini

## Maqsad va doira

Mijoz buyurgan mahsulot/katalog boshqaruvi, vaqtinchalik savat va tiklash.
Mavjud 73 tasdiqlangan yozuv boshlang‘ich ma’lumot. Asosiy serverga deploy yo‘q.
Hozirgi GitHub Pages statik hosting; haqiqiy autentifikatsiya va doimiy yozish
uchun alohida xizmat kerak. Dastlab 127.0.0.1 da ishlaydigan to‘liq panel
tayyorlanadi. Foydalanuvchi hozir kompyuterda sinash variantini tanladi.

## Texnologiya va asos

- Mavjud JavaScript/HTML/CSS va iliq kristall dizayn saqlanadi. Alohida admin UI.
- Python HTTP xizmati va SQLite: Windowsda sodda ishga tushadi, tranzaksiyalar,
  tashqi kalitlar va bitta faylda zaxiralash bor. 73–minglab katalog yozuvlari
  uchun ortiqcha xizmat yoki pulli baza talab qilmaydi.
- Pillow faqat yuklangan raster fayllarni tekshiradi; yorliqlar qayta chizilmaydi.
- Brauzer paroli yoki ma’lumot bazasi localStorage’da saqlanmaydi. Server
  scrypt parol xeshlari, HttpOnly sessiya cookie va CSRF tekshiruvini boshqaradi.

## Baza

- users: login, ism, scrypt hash, owner/editor roli, faol holat.
- sessions: token SHA-256, CSRF token, foydalanuvchi, tugash vaqti.
- brands: ID, yagona nom, tartib; mahsulotlar FK bilan bog‘lanadi.
- categories: ID, UZ/RU/EN nomi, tartib; o‘chirish faqat bo‘sh bo‘limda.
- products: barqaror ID, brend/bo‘lim FK, tarjimalar/rang/qadoq/rasm JSONi,
  draft/published/hidden holati, tartib, revision, deleted_at/deleted_by,
  trash_until. O‘chirilganda ma’lumot va rasm manzillari saqlanadi.
- revisions: mahsulotning avvalgi holatlari; optimistik revision nazorati.
- media: tasodifiy fayl nomi, manba nomi, format, o‘lcham, hash.
- audit: amal, kim, qachon va o‘zgargan obyekt; parollar yozilmaydi.
- settings: savat muddati (30 kun), katalog versiyasi.

SQLite tranzaksiyasi mahsulot + revision + audit o‘zgarishini birga saqlaydi.
Kutilgan revision mos kelmasa 409; ikki oynadagi o‘zgarishlar jim yo‘qolmaydi.

## Tuzilma va amallar

admin/: xizmat, DB, xavfsizlik/validatsiya va web interfeys.
tools/: 73 yozuvdan boshlang‘ich seed va ishga tushirish.
element_paint_web/: faqat nashr etilgan ochiq katalog snapshotini o‘qiydi.

1. Birinchi admin akkaunti; kirish/chiqish va parolni almashtirish.
2. Mahsulot: qo‘shish, tahrirlash, nusxalash, izlash, filtrlash, tartiblash,
   draft/published/hidden, rang, qadoq, SKU, tarjima va rasm.
3. Savat: alohida ro‘yxat, sana/muddat, bir yoki ko‘p mahsulotni tiklash.
   30 kunlik muddat ko‘rsatiladi. Avtomatik qaytmas tozalash yo‘q; owner
   alohida tasdiqlab butunlay o‘chiradi. Muhim amallardan oldin zaxira.
4. Brend va bo‘lim qo‘shish/tahrirlash/o‘chirish; ishlatilganlarini o‘chirishni
   FK va server to‘sadi, jumladan savatdagi mahsulotlar ham hisobga olinadi.
5. Rasm yuklash/kutubxona: PNG/JPEG/WebP, o‘lcham/hajm tekshiruvi, xavfsiz nom.
6. Tarix/revision, JSON import/eksport va zaxira nusxa; nashr snapshoti draft,
   savat, akkaunt va audit ma’lumotlarini o‘z ichiga olmaydi.
7. Mahalliy sayt bazadagi nashr etilgan katalogni ko‘rsatadi. GitHub Pages
   uchun snapshot va media runtime paketiga chiqariladi; akkaunt/xususiy
   baza hech qachon ommaviy preview paketiga qo‘shilmaydi.

## Himoya va tekshiruv

Bind 127.0.0.1; Host/Origin nazorati; CSRF; login tezlik cheklovi; kuchli
parol hash; serverdagi rollar; parametrli SQL; textContent; path traversal
va faol SVG yuklashni taqiqlash; max body/piksel/hajm cheklovlari. Maxfiy
fayllar D: dagi ignored ma’lumot papkasida. HTTPS uchun secure cookie sozlamasi.

Testlar vaqtinchalik alohida bazada: auth/CSRF, CRUD, revision to‘qnashuvi,
savat/to‘liq tiklash/butunlay o‘chirish, FK cheklovi, import rollback,
ochiq snapshotdan draft/savat chiqarilishi, zararli upload/pathlar.
UI DOM: forma, qidiruv/filtr, savat, tiklash, tasdiqlar va server xatolari.
Mavjud 73 mahsulot, rang/qadoq/PDF baytlari va loader tekshiruvlari saqlanadi.
