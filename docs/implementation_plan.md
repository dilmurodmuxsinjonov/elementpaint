# Amalga oshirish rejasi

## Arxitektura

Mavjud HTML, CSS va ES modules asosini davom ettirish, Three.js 0.186.1 mahalliy nusxasini qayta ishlatish. Buning sababi: katalog yozish/akkaunt/to‘lov serverini talab qilmaydi; mahsulotlar oz, statik hosting mavjud. Framework va yangi server qatlamini qo‘shish yuklanish hamda boshqarish xarajatini oshiradi, hozirgi talabga zarur emas.

Ma’lumotlar bazasi hozir talab qilinmaydi: versiyalanadigan mahsulot JSON/JS ma’lumoti statik katalog uchun yetarli. Kelajakda boshqaruv paneli kerak bo‘lsa, `product.id`, `categoryId`, `variant.id`, tarjima va media manzillari SQL jadvallariga ajratilishi mumkin; bugungi ishda panel yoki DB yaratilmaydi.

## Ma’lumot sxemasi

- Category: `id`, `core`, `order`, `name.{uz,ru,en}`, `description.{uz,ru,en}`.
- Product: `id`, `aliases[]`, `categoryId`, `brand`, `title.{uz,ru,en}`, `description.{uz,ru,en}`, `image`, `variants[]`, `packages[]`, `sourceStatus`.
- Variant: `id`, `name.{uz,ru,en}`, `color`, `image`, `packageKg` (tasdiqlangan bo‘lsa).
- UI locale: barcha interfeys satrlari uchun UZ/RU/EN lug‘atlari.
- UI state: `lang`, `category`, `brand`, `query`, `product`, `variant`. URL query orqali ulashiladi.
- 3D state: `lidOpen`, `pouring`, `rotation`, `paintLevel`; model katalog holatidan mustaqil.

O‘chirilgan brend uchun bloklash va eski mahsulot IDlari/ranglarining saqlanish sinovi bo‘ladi. Oldingi 20 yozuvdagi PF-115 ranglari bir oilaga birlashtirilishi mumkin; ularning identifikatorlari `aliases` yoki variant sifatida saqlanadi.

## Modullar

`catalog-data.js` — yo‘nalish, mahsulot va tarjimalar; `preview-app.js` — URL holati, til, kartalar, mahsulot dialogi va cheklangan kirish animatsiyasi; `preview.css` — dizayn tizimi, logo to‘lish va mobil holatlar; `berlak-scene.js` — geometriya, material, pointer boshqaruv, lid/pour/reset. Asl materiallar sayt ildiziga kirmaydi. Mavjud mahsulot rasmlari yangi tayyorlangan tasvirlar bilan almashtirilgan; ishlab chiqarish saytining fayllari alohida saqlangan.

## Bajarish

1. Alohida `design-refresh-20261005` ish nusxasida, asosiy checkout va hostingga tegmasdan ishlash.
2. Hujjatni yozish va ko‘rsatish; foydalanuvchi allaqachon ishni boshlashni so‘ragan, shu ruxsat bilan bajarish.
3. Eski mahsulotlarni saqlab 10 asosiy va qo‘shimcha lak/sirt tayyorlash yo‘nalishlarini qurish.
4. Uch til, tanlov holati, mahsulot dialogi, mobil sarlavha.
5. Berlak modelining ishlaydigan prototipi; asl yorliq bo‘lmaganda holat ish hujjatida qayd qilinadi, yakuniy tayyor mahsulot deb ko‘rsatilmaydi.
6. Bir xil fon va Atlas yorliqlari: original material olingach yuqori sifatli tanlangan rasmlarni tayyorlash.
7. Mazmunli regressiya testlari: eski katalog saqlanishi, taqiqlangan brend chiqarilishi, tarjima to‘liqligi, URL holati, 3D o‘tishlar, reduced-motion/WebGL fallback.
8. Preview paketini faqat runtime fayllaridan tuzish; tashqi jonli havolani tayyorlash va boshqa qurilma uchun tekshirish.

## Hozirgi cheklovlar

Materiallar papkasi hozir bo‘sh. Telegramdan ekran ko‘rinishlari bor; ular toza original yorliq o‘rniga public asset qilinmaydi. Berlak orqa/yon yorlig‘i va Atlas yuqori sifatli etiketkalari olinishi kerak. Artek qora/oq fasad qadoqlari alohida mahsulotligi tasdiqlandi. Shu vaqt ichida interfeys, ma’lumot modeli va 3D boshqaruvini qurish davom etadi.
