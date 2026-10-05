# Element Paint — sayt dizayni va foydalanish hujjati

Versiya 1.0 · 5 oktabr 2026 · Sinov versiyasini ishlab chiqish uchun.

## Maqsad va brend

Element Paint Namangandagi bo‘yoq ishlab chiqaruvchi sifatida namoyon bo‘ladi. Bosh sahifa haqiqiy qadoq, mahsulot turlari va aloqa bilan boshlanadi. Arxitektura/interyer suratlari mahsulotning qo‘llanishini tushuntirish uchun sahifaning keyingi qismida ishlatiladi. Asosiy harakat — mahsulot topish va ishlab chiqaruvchi bilan bog‘lanish.

Sayt savdo katalogi va brend tajribasini birlashtiradi. To‘lov, savat, zaxira miqdori yoki narxlar mijoz tomonidan so‘ralmagan; ular hozirgi ishga kiritilmaydi. Mahsulot xossalari, sertifikatlar, sarf, qurish vaqti yoki kafolatlar tekshirilmagan bo‘lsa o‘ylab yozilmaydi.

## Qat’iy talablar

- Har yangi tashrif va qayta yuklanish qaymoqrang tonggi ko‘rinishda boshlanadi.
- UZ / RU / EN tanlovi yuqori sarlavhada, mijoz belgilagan joyda turadi; telefonda yashirilmaydi.
- Yuklanishda Berlak bankasidan bo‘yoq quyilib Element Paint logosi rang bilan to‘ladi.
- Bosh sahifada ko‘k Berlak PF-115 ning boshqariladigan 3D bankasi: aylantirish, qopqoqni ochish, bo‘yoq quyish, qayta boshlash.
- Barcha mahsulot tasvirlari bitta studiya foniga moslanadi. Atlas etiketkalari banka ustida ko‘rsatiladi.
- Avvalgi katalogdagi ruxsat etilgan mahsulotlar yangi materiallarda yo‘q bo‘lsa ham saqlanadi. KRATA va unga tegishli rasm, matn, havola qayta kiritilmaydi.
- Yangi sayt avval alohida sinov manzilida ko‘rsatiladi; mijoz ma’qullashi va foydalanuvchining chiqarish ko‘rsatmasidan so‘ng asosiy sayt yangilanadi.

## Vizual tizim

| Vazifa | Rang | Qo‘llanish |
|---|---|---|
| Sahifa asosi | `#F5EEDF` | Iliq qaymoqrang, har yangi tashrifda |
| Sirt | `#EEE4D2` | Mahsulot studiyasi, yordamchi bo‘limlar |
| Ochroq sirt | `#FBF6EB` | Kartalar, til tanlovi, dialog |
| Asosiy matn | `#23332F` | Sarlavha va matn |
| Ikkinchi matn | `#65706A` | Tavsif va yordamchi belgilar |
| Asosiy urg‘u | `#254C47` | Tugmalar, faol tanlov |
| Oltin urg‘u | `#AD8549` | Brend detallari, ingichka chiziqlar |
| Berlak ko‘ki | `#124B89` | Banka, ayrim brend urg‘ulari |
| Chegara | `#D7CDBB` | Boshqaruv va kartalar ajratilishi |

Ranglar haqiqiy qadoqni almashtirmaydi. Sayt ko‘rkamligi mahsulot yorlig‘i hisobiga yaratilmaydi. Qora katta fonlar asosiy ko‘rinishga kiritilmaydi. Hozirgi tashrif uchun ixtiyoriy tungi ko‘rinish yumshoq kulrang-yashil sirtlardan foydalanadi; til tanlovi fon rejimidan mustaqil.

Shrift: Manrope yoki uning mahalliy nusxasi, tizim shriftiga zaxira. Interfeys uchun 14–16 px, asosiy matn 16–18 px, katta sarlavha 44–80 px kompyuterda va 36–48 px telefonda. Asosiy sarlavha ortiqcha kursiv bilan bezatilmaydi. Mobil kartaning nomi to‘liq o‘qiladi; mahsulot nomi kesib tashlanmaydi.

Maksimal kontent eni 1320 px. Yon bo‘shliq telefonda 18–24 px, katta ekranda kamida 40 px. Bazaviy oraliqlar 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px. Karta radiusi 18–24 px, kichik boshqaruv 10–14 px. Soyalar xira va tarqoq; qalin qora konturlar ishlatilmaydi.

## Sahifalar va navigatsiya

1. **Bosh sahifa:** sarlavha; 3D Berlak va qisqa ishlab chiqaruvchi taqdimoti; katalogga tez kirish; mahsulot yo‘nalishlari; tavsiya etilgan mahsulotlar; ishlab chiqaruvchi haqida; qo‘llanish namunalari; aloqa.
2. **Katalog:** yo‘nalishlar, mahsulot qidiruvi, brend tanlovi, mahsulot soni; kartalar; ma’lumot yetishmaydigan yo‘nalish uchun aloqa orqali so‘rash holati.
3. **Yo‘nalish:** yo‘nalish sarlavhasi, tavsifi va faqat tegishli mahsulotlar. Tanlov URLda saqlanadi, to‘g‘ridan-to‘g‘ri ochish va orqaga qaytish ishlaydi.
4. **Mahsulot:** nom, brend, qadoq tasviri, ma’lum qo‘llanish, rang/qadoq variantlari, tasdiqlangan ma’lumotlar va telefon/Telegram orqali bog‘lanish. Alohida URL holati va dialog/sahifa ko‘rinishi bo‘ladi; yopilganda avvalgi katalog va fokus tiklanadi.
5. **Ishlab chiqaruvchi va qo‘llanish:** zavod haqidagi mavjud tasdiqlangan ma’lumot; mavjud fotosuratlar keyinroq; tasdiqlanmagan raqam, sertifikat yoki mijoz logosi yo‘q.
6. **Aloqa:** mavjud biznes telefoni va rasmiy Telegram havolasi, mavjud manzil ma’lumotlari. Chatdagi shaxsiy kontaktlar ko‘chirilmaydi.

Sarlavhada logo chapda, navigatsiya o‘rtada, tillar va aloqa o‘ngda. Telefonda logo va uch til birinchi qatorda, menyu/aloqa sig‘imga qarab ikkinchi qatorda. Qotib turuvchi sarlavha fokuslangan yoki havola orqali kelgan kontentni yopmaydi.

## Katalog va avvalgi mahsulotlarni saqlash

Mijoz aytgan asosiy 10 yo‘nalish: alkid emallar; suvli emulsiya bo‘yoqlari; PVA yelimlari; akril astarlar; suyuq travertin; Milano va boshqa dekorativ qoplamalar; Ottocento; suyuq gul qog‘ozlari; yo‘l bo‘yoqlari; sho‘rlashga qarshi vositalar.

Avvalgi laklar va gips shpatlyovka ham yo‘qolmaydi. Ular asosiy yo‘nalishlarga noto‘g‘ri qo‘shilmasligi uchun yordamchi “Laklar” va “Sirt tayyorlash” bo‘limlarida saqlanadi. Yo‘l bo‘yoqlari va sho‘rlashga qarshi vositalar uchun hali aniq mahsulot yoki rasm olinmagan; bo‘lim haqiqiy bo‘lmagan mahsulot bilan to‘ldirilmaydi.

| Avvalgi yozuv / mahsulot | Yangi joylashuv |
|---|---|
| Element Paint, Crown, Berlak travertinlari | Suyuq travertin |
| Berlak Ottocento | Ottocento |
| Element Plaster | Dekorativ qoplamalar |
| Berlak Fantasy suyuq gul qog‘ozi | Suyuq gul qog‘ozlari |
| Atlas PF-115 Blue / Yellow / Chocolate Brown | Bitta PF-115 oilasi, rang tanlovi; eski IDlar muqobil havola |
| Atlas Emal Standart oq | Alohida mahsulot |
| Berlak Snow White PF-115 | Berlak PF-115; yangi rasm kelganda almashtiriladi |
| Berlak pol emali | Alkid emallar |
| Berlak marvarid laki, travertin laki; Atlas Nitro NC-2144, PF-283 | Laklar |
| Berlak astar 5 kg va 2,5 kg | Akril astarlar; qadoq farqi saqlanadi |
| Atlas 801 PVA | PVA yelimlari |
| Atlas Glatt | Sirt tayyorlash |
| KRATA | Taqiqlangan: qo‘shilmaydi |

Yangi yozuvlar: Atlas PF-115 ning qolgan ranglari; Atlas PF-266; Artek fasad va Interior; Artek Universal. Foydalanuvchi Artekning qora va oq fasad qadoqlarini ikkita alohida mahsulot deb tasdiqladi. Ular alohida yozuvlar sifatida kiritiladi; qo‘shimcha texnik farqlar tasdiqlanmaguncha o‘ylab yozilmaydi.

Mahsulot oilasi, rang varianti va qadoq varianti alohida tushunchalar. Katalogdagi mahsulot soni ranglar soni emas. “3.000 dona” yozuvi zaxira, narx yoki qadoq qiymatiga aylantirilmaydi.

## Uch til

- UZ boshlang‘ich til; foydalanuvchi tanlagan til URLga yoziladi va ulashilganda saqlanadi.
- RU va EN: menyu, sarlavha, katalog, kategoriyalar, mahsulot tavsifi, holatlar, dialog va 3D tugmalari to‘liq tarjima qilinadi.
- Brend, mahsulot kodi, yorliq tasviri va qadoqdagi original matn tarjima bilan almashtirilmaydi.
- Til almashganda kategoriya, qidiruv, mahsulot va variant tanlovi saqlanadi.
- `html lang`, sahifa sarlavhasi va tavsifi tanlangan tilga mos.
- Yo‘q tarjima jim turib boshqa tilda ko‘rsatilmaydi; chiqarishdan oldin tarjima to‘liqligi tekshiriladi.

## Yuklanish sahnasi

Element Paint logo shakli saqlanadi. Kichik Berlak bankasi egiladi; bo‘yoq logo ustidan o‘tib belgini rang bilan to‘ldiradi. Natija saytda ishlatilayotgan haqiqiy logoga mos. Ko‘rinish qisqa, taxminan 1–2 soniya; qidiruv yoki ichki havolaga qaytishda qayta-qayta o‘ynatilmaydi.

Animatsiya tugashi sayt funksiyalarining tayyor bo‘lishiga bog‘lanadi, soxta foiz yozilmaydi. Xato yoki sust yuklanish foydalanuvchini doimiy yopiq ekranda qoldirmaydi. JavaScript o‘chsa, sahifa boshidan ochiq. Harakat kamaytirilganda to‘ldirilgan logo va qisqa yumshoq o‘tish kifoya; majburiy oqim yo‘q.

## Interaktiv 3D Berlak

Model: ko‘k Berlak PF-115 metall banka, yuqori/pastki metall halqalar, mustaqil qopqoq, ichki bo‘yoq sathi. Old yorliq va marka mijoz tasviriga mos. Orqa yorliq asl nusxasi olinmagan bo‘lsa texnik yozuvlar o‘ylab chizilmaydi.

Holatlar: yopiq → qopqoq ochilmoqda → ochiq → egilmoqda/quymoqda → tik holatga qaytmoqda. “Qayta boshlash” bankani tiklaydi, qopqoqni yopadi va to‘kilgan bo‘yoqni sahnadan olib tashlaydi.

Sichqoncha va barmoq: sudrab aylantirish, ochiq bo‘lsa egish. Tugmalar: qopqoqni ochish/yopish; quyish/to‘xtatish; qayta boshlash. Klaviatura bilan ayni harakatlar mumkin. Quyishdan oldin qopqoq ochilishi zarur; tugma yoki holat foydalanuvchiga tushunarli bo‘ladi.

Bo‘yoq sathi banka egilishiga mos ko‘rinadi; oqim og‘izdan chiqadi; yerga tushganda tomchi va yumshoq yoyilish ko‘rinadi. Bu vizual suyuqlik animatsiyasi, muhandislik hisoblash uchun to‘liq suyuqlik modeli emas.

Render faqat sahna ko‘rinayotganda yoki uning holati o‘zgarganda ishlaydi. Telefon piksel zichligi cheklanadi; har bir kartada doimiy 3D renderer ochilmaydi. WebGL yo‘q yoki kontekst uzilsa statik Berlak rasmi va katalogga kirish qoladi. Qisqa sahna barcha mahsulotlardan oldingi majburiy o‘yin emas.

## Mahsulot tasvirlarini tayyorlash

Umumiy studiya: qaymoqrang sirt va orqa fon, mayin yo‘nalgan yorug‘lik, mahsulot tagida xira soya; 4:5 yoki kvadrat katalog kadri. Mahsulot atrofidagi bo‘shliq bir xil. Metall banka, chelak, kanistr yoki qop o‘z qadoq shaklida qoladi — faqat Atlas tekis yorliqlari banka ustiga o‘raladi.

Asl etiketka yuqori sifatda olinadi, unga mos banka geometriyasiga o‘raladi. Matn va rang texstura sifatida aynan saqlanadi. Yorliq og‘irligi mahsulot yozuvi bilan mos tekshiriladi: oq PF-115 3 kg, ko‘p rangli PF-115 2,7 kg, Standart va PF-266 2,7 kg. Har bir yorliq uchun ko‘rinish tasdiqlanadi.

Avvalgi barcha ruxsat etilgan tasvirlar ro‘yxati saqlanadi; yangisi tayyor bo‘lmaguncha yo‘q qilib yuborilmaydi. Asl fayllar D: diskdagi xususiy materiallar papkasida, sayt faqat tanlangan optimallashtirilgan rasmlarni oladi. Screenshot/chat sarlavhasi mahsulot rasmi sifatida chiqarilmaydi.

## Mikroharakatlar va foydalanish

Tugma bosilganda 120–180 ms rang/sirt javobi; karta ustida 180–240 ms mayin ko‘tarilish; bo‘lim ko‘rinishida 250–400 ms xira ochilish. Harakatni kamaytirish so‘rovi bularni soddalashtiradi. Kursordan qochadigan yoki bosishni qiyinlashtiradigan tugma yo‘q.

Mahsulot qidiruvi tez, fon rejimi va tilning tanlangan holati aniq; topilmasa qidiruvni tozalash mumkin. Dialog `Escape` bilan yopiladi, fokus ichida saqlanadi va yopilganda ochgan boshqaruvga qaytadi. Barcha boshqaruvlar kamida 44×44 px va ko‘rinadigan klaviatura fokusiga ega.

## Tezlik, maxfiylik va chiqarish

Asosiy katalog 3D modulidan mustaqil ishlaydi. 3D va katta rasmlar keragida yuklanadi; fon videosi yo‘q. Mavjud statik hostingga mos HTML/CSS/JS va mahalliy Three.js ishlatiladi. Yangi ma’lumotlar bazasi, pullik xizmat yoki akkaunt tizimi talab qilinmaydi.

Sinov manzilida `noindex`, robots va canonical siyosati aniq bo‘ladi. `noindex` parol emas; mijozga ulashiladigan havolaga xususiy material kiritilmaydi. Ish hujjati, chat, Git, test va xom etiketkalar chiqariladigan paketga kirmaydi.

Mijoz ko‘radigan nusxa ishlab chiqaruvchi bilan bog‘lanish va barcha til/katalog funksiyalarini tekshirishga yetadi. Mijoz fikri → tuzatish → qayta sinov → foydalanuvchi chiqarish ko‘rsatmasi → asosiy saytga yuklash. Eski saytni tiklash nusxasi saqlanadi.

## Qabul qilish mezonlari

- KRATA ommaviy kontent, fayllar va qidiruvda yo‘q; avvalgi boshqa mahsulotlar yoki ularning birlashtirilgan ranglari mavjud.
- UZ/RU/EN bir xil sahifa, mahsulot va tanlovni ko‘rsatadi; qolib ketgan interfeys matni yo‘q.
- Yangi tashrif tonggi ko‘rinishda; ixtiyoriy qorong‘i rejim shu tashrifda ishlaydi.
- Banka 3D shaklida aylantiriladi, qopqoq ochiladi, bo‘yoq oqimi og‘izdan chiqadi va qayta boshlash ishlaydi.
- Mobil 320 / 375 / 390 / 768 va kompyuter 1024 / 1440 / 1920 px: tugmalar bosiladi, til tanlovi ko‘rinadi, sahifa chetga chiqmaydi.
- Qidiruv, kategoriya/brend, to‘g‘ridan-to‘g‘ri havola, orqaga qaytish, mahsulot, rang, aloqa havolalari sinovdan o‘tadi.
- Harakatni kamaytirish va 3D ishlamaydigan holatda katalog to‘liq ishlaydi.
- Rasm matni va ranglari aslga mos; bir xil studiya uslubi; rasm 404 xatolari yo‘q.
- Mijozga beriladigan havola tashqi qurilmadan ochiladi. Lokal manzil ommaviy jonli havola deb ko‘rsatilmaydi.

## Ish tartibi

1. Dizayn hujjati, ma’lumot sxemasi va eski-yangi katalog xaritasi.
2. Uch tilli qaymoqrang bosh sahifa va katalogning ishlaydigan birinchi nusxasi.
3. Berlak 3D holatlari va logo to‘lish sahnasi.
4. Asl rasmlar bilan bir xil studiya ko‘rinishi, Atlas bankalar, mahsulot tarjimalari.
5. Mobil/tezlik/havola sinovi va alohida jonli ko‘rish havolasi.
6. Mijoz tuzatishlari; tasdiqlangan chiqarish.

5–6 kun — mijozga bildirilgan taxminiy ish muddati. Asl materiallarning kelishi va mijoz tuzatishlari muddatga ta’sir qiladi; bu hujjat ishning tugaganini bildirmaydi.
