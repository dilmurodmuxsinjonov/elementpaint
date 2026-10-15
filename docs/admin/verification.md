# Mahalliy admin tekshiruvi — 2026-10-15

Foydalanuvchi kompyuterda sinashni tanladi. Panel 127.0.0.1:8092 da ishga
tushirildi; birinchi akkaunt foydalanuvchi tomonidan yaratilishi uchun ochiq.
Haqiqiy bazada sun’iy admin yoki sinov mahsuloti yaratilmagan.

## Bajarilgan tekshiruvlar

- Python real HTTP + SQLite: 9 ta sinov guruhi muvaffaqiyatli. Alohida
  vaqtinchalik kataloglar: 73 seed, setup/login, parol/token xeshlari,
  autentifikatsiya, CSRF/Host/Origin, rollar, CRUD, to‘qnashgan revision,
  tahrir tarixi, nusxa, holatlar, savat/tiklash va muddati o‘tgan yozuv.
  Bazani qayta ochganda savat va rasm havolasi saqlanishi tekshirildi.
- Butunlay o‘chirish faqat savat + owner + aniq tasdiq bilan; oldindan
  zaxira nusxasi yaratiladi. Tiklash barcha mahsulot maydonlarini qaytaradi.
  Ko‘p mahsulotli amal bitta xatoda to‘liq bekor qilinishi tekshirildi.
- Brend/bo‘lim FK himoyasi savatni ham hisoblaydi. Yaroqsiz import
  tranzaksiyasi oldingi tahrirlarni ham qaytaradi. Yangi import qoralama.
- PNG yuklashda baytlar o‘zgarmaydi. Soxta SVG rad etiladi. Path traversal,
  maxfiy baza URLi va yaroqsiz maydonlar rad etiladi. Ommaviy snapshotda
  qoralama, savat, revision, akkaunt, sozlama va audit yo‘q.
- Admin DOM testi real vaqtinchalik backend bilan: birinchi akkaunt,
  qo‘shish, tarjimalar, litr qadoq, tahrir, HTML matnining xavfsiz ko‘rinishi,
  savat, tiklash, oldingi tahrir, O'CHIRISH tasdig‘i, bo‘lim/media/audit,
  sozlamalar va chiqish. Bu brauzer avtomatlashtirishi emas.
- Ochiq katalog DOMi admin snapshotini oladi; eski to‘plamni almashtiradi,
  birliklar to‘g‘ri, barcha mahsulotlar yashirilgan bo‘sh holat ham ishlaydi.
- Mavjud 73 karta, 34 rang, 72 PDF PNG xeshlari, oq ramkalar, Milano
  yorlig‘i RGB qiymatlari va yuklanishning asl 288 kadri saqlangan.
- Runtime ZIP: 127 fayl. Admin, DB, akkaunt, savat va audit fayllari yo‘q.
  Ichidagi snapshotda 73 ta ochiq mahsulot. Mahalliy CSS va logo HTTP 200.

To‘liq brauzer vizual tekshiruvi bu bosqichda bajarilmadi. API va DOM
natijalari vizual sinov sifatida ko‘rsatilmaydi. Panel mahalliy sinov uchun;
GitHub Pages server o‘rnida ishlatilmaydi va asosiy serverga nashr yo‘q.

Ishga tushirish va to‘liq zaxira ko‘rsatmasi: [admin qo‘llanma](../../admin/README.md).
