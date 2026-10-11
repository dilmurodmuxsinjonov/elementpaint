import legacyProducts from './legacy-products.js';

const tr = (uz, ru, en) => ({ uz, ru, en });
export const categories = [
  ['emal', 'Emal bo‘yoqlar', 'Эмали', 'Enamel paints'],
  ['water', 'Devor bo‘yoqlari', 'Краски для стен', 'Wall paints'],
  ['pva', 'PVA yelimlari', 'Клеи ПВА', 'PVA adhesives'],
  ['primer', 'Astarlar (gruntovka)', 'Грунтовки', 'Primers'],
  ['travertin', 'Suyuq travertin', 'Жидкий травертин', 'Liquid travertine'],
  ['decor', 'Dekorativ qoplamalar', 'Декоративные покрытия', 'Decorative coatings'],
  ['ottocento', 'Ottocento', 'Отточенто', 'Ottocento'],
  ['wallpaper', 'Suyuq gulqog‘oz', 'Жидкие обои', 'Liquid wallpaper'],
  ['road', 'Yo‘l uchun bo‘yoqlar', 'Краски для дорог', 'Road paints'],
  ['salt', 'Sho‘rlashga qarshi vositalar', 'Средства против высолов', 'Anti-efflorescence products'],
  ['lak', 'Laklar', 'Лаки', 'Varnishes'],
  ['preparation', 'Shpaklyovkalar', 'Шпатлёвки', 'Fillers'],
  ['adhesive', 'Gulqog‘oz yelimlari', 'Клеи для обоев', 'Wallpaper adhesives'],
].map(([id, uz, ru, en], order) => ({ id, name: tr(uz, ru, en), core: order < 10 }));

const names = {
  'ep-travertin': tr('Premium suyuq travertin', 'Премиальный жидкий травертин', 'Premium liquid travertine'),
  'crown-travertin': tr('Crown suyuq travertin', 'Жидкий травертин Crown', 'Crown liquid travertine'),
  'berlak-travertin': tr('Berlak suyuq travertin', 'Жидкий травертин Berlak', 'Berlak liquid travertine'),
  'berlak-ottocento': tr('Ottocento — ipak va baxmal', 'Отточенто — шёлк и бархат', 'Ottocento — silk and velvet'),
  'ep-plaster': tr('Element Plaster dekorativ suvoq', 'Декоративная штукатурка Element Plaster', 'Element Plaster decorative plaster'),
  'berlak-wallpaper': tr('Fantasy suyuq gulqog‘oz', 'Жидкие обои Fantasy', 'Fantasy liquid wallpaper'),
  'atlas-white': tr('Emal Standart — oq', 'Эмаль Стандарт — белая', 'Standard enamel — white'),
  'berlak-white': tr('Berlak PF-115 — qordek oq', 'Berlak ПФ-115 — белоснежная', 'Berlak PF-115 — snow white'),
  'berlak-floor': tr('Berlak pol emali', 'Эмаль для пола Berlak', 'Berlak floor enamel'),
  'berlak-pearl': tr('Marvarid tusli lak', 'Лак с перламутровым эффектом', 'Pearl-effect varnish'),
  'berlak-travertin-lak': tr('Travertin uchun lak', 'Лак для травертина', 'Travertine varnish'),
  'atlas-nitro': tr('Nitrolak NC-2144', 'Нитролак НЦ-2144', 'NC-2144 nitro varnish'),
  'atlas-pf283': tr('PF-283 yaltiroq lak', 'Глянцевый лак ПФ-283', 'PF-283 gloss varnish'),
  'berlak-primer-5kg': tr('Akril astar 1/7 — kanistr', 'Акриловая грунтовка 1/7 — канистра', 'Acrylic primer 1/7 — canister'),
  'berlak-primer-2kg': tr('Akril astar — 2,5 kg', 'Акриловая грунтовка — 2,5 кг', 'Acrylic primer — 2.5 kg'),
  'atlas-pva': tr('801 PVA yelimi', 'Клей ПВА 801', '801 PVA adhesive'),
  'atlas-glatt': tr('Glatt gipsli shpaklyovka', 'Гипсовая шпатлёвка Glatt', 'Glatt gypsum filler'),
};
const descriptions = {
  emal: tr('Metall va yog‘och yuzalar uchun emal bo‘yoqlar.', 'Эмали для металлических и деревянных поверхностей.', 'Enamel paints for metal and wood surfaces.'),
  travertin: tr('Devorlarda tabiiy tosh ko‘rinishini hosil qiluvchi qoplama.', 'Покрытие для стен с фактурой натурального камня.', 'A wall coating with a natural stone texture.'),
  decor: tr('Devor yuzalari uchun dekorativ qoplama.', 'Декоративное покрытие для стен.', 'A decorative coating for wall surfaces.'),
  ottocento: tr('Ipak va baxmal ko‘rinishidagi dekorativ devor qoplamasi.', 'Декоративное покрытие стен с эффектом шёлка и бархата.', 'A decorative wall finish with a silk and velvet appearance.'),
  wallpaper: tr('Ichki devorlar uchun suyuq gulqog‘oz.', 'Жидкие обои для внутренних стен.', 'Liquid wallpaper for interior walls.'),
  lak: tr('Yuzaga yakuniy qoplama berish uchun lak. Qaysi yuzaga ishlatishingizga qarab tanlang.', 'Лак для финишного покрытия. Выбирайте с учётом поверхности.', 'A varnish for the final coat. Choose one suited to your surface.'),
  milano: tr('Interyer devorlari uchun dekorativ qoplama.', 'Декоративное покрытие для внутренних стен.', 'A decorative coating for interior walls.'),
  primer: tr('Bo‘yashdan avval yuzani tayyorlash uchun akril astar.', 'Акриловая грунтовка для подготовки поверхности перед окрашиванием.', 'An acrylic primer for preparing surfaces before painting.'),
  pva: tr('Yog‘och, qog‘oz va qurilish ishlari uchun PVA yelimi.', 'Клей ПВА для дерева, бумаги и строительных работ.', 'PVA adhesive for wood, paper and construction work.'),
  preparation: tr('Ichki yuzalarni tekislash uchun gipsli shpaklyovka.', 'Гипсовая шпатлёвка для выравнивания внутренних поверхностей.', 'Gypsum filler for levelling interior surfaces.'),
  water: tr('Devor yuzalari uchun suv asosidagi bo‘yoq.', 'Краска на водной основе для стен.', 'A water-based paint for wall surfaces.'),
  adhesive: tr('Gulqog‘oz yopishtirish uchun yelim.', 'Клей для обоев.', 'Adhesive for wallpaper.'),
};
const mapping = { 'berlak-ottocento': 'ottocento', 'ep-plaster': 'decor', 'berlak-wallpaper': 'wallpaper', 'atlas-pva': 'pva', 'atlas-glatt': 'preparation' };
export const legacyIds = legacyProducts.map(p => p.id);
export const products = legacyProducts.filter(p => !['atlas-blue', 'atlas-yellow', 'atlas-brown'].includes(p.id)).map(p => ({
  id: p.id, aliases: [], categoryId: mapping[p.id] || p.cat, brand: p.brand,
  title: names[p.id], description: descriptions[mapping[p.id] || p.cat], image: p.img,
  variants: [], packages: [], sourceStatus: 'existing',
}));
const catalogImage = number => `assets/catalog-2026/product-${String(number).padStart(3,'0')}.png`;
const catalogProductImages = {
  'berlak-white': 1, 'berlak-floor': 3, 'berlak-travertin': 4, 'berlak-ottocento': 9,
  'berlak-pearl': 10, 'berlak-travertin-lak': 11, 'berlak-wallpaper': 12,
  'atlas-white': 19, 'atlas-pf283': 28, 'atlas-pva': 30, 'berlak-primer-5kg': 17, 'berlak-primer-2kg': 8,
  'ep-travertin': 62, 'crown-travertin': 64,
};
for (const [id,number] of Object.entries(catalogProductImages)) {
  const product=products.find(item=>item.id===id);
  if(product) product.image=catalogImage(number);
}
const colorRows = [
  ['white', '#F5F4EB', 'Qordek oq', 'Белоснежный', 'Snow white', 13],
  ['dark-red', '#A82B2D', 'To‘q qizil', 'Бордовый', 'Dark red', 14],
  ['asphalt', '#4B5554', 'Ho‘l asfalt', 'Мокрый асфальт', 'Wet asphalt', 15],
  ['grey', '#818280', 'Kulrang', 'Серый', 'Grey', 20],
  ['brown', '#5D3025', 'Shokolad jigarrang', 'Шоколадно-коричневый', 'Chocolate brown', 21],
  ['blue', '#149CD0', 'Havorang', 'Голубой', 'Blue', 22],
  ['red', '#CB3428', 'Qizil', 'Красный', 'Red', 23],
  ['dark-blue', '#24468D', 'To‘q ko‘k', 'Тёмно-синий', 'Dark blue', 24],
  ['black', '#272C2A', 'Qora', 'Чёрный', 'Black', 25],
  ['yellow', '#E5C42C', 'Sariq', 'Жёлтый', 'Yellow', 26],
  ['green', '#188549', 'Yashil', 'Зелёный', 'Green', 27],
];
products.splice(6, 0, {
  id: 'atlas-pf115', aliases: ['atlas-blue', 'atlas-yellow', 'atlas-brown'], categoryId: 'emal', brand: 'ATLAS',
  title: tr('PF-115 yaltiroq emal', 'Глянцевая эмаль ПФ-115', 'PF-115 gloss enamel'),
  description: descriptions.emal, image: catalogImage(13),
  variants: colorRows.map(([id,color,uz,ru,en,number]) => ({ id, color, name: tr(uz,ru,en), image: catalogImage(number), packages: [.9,2.7] })),
  packages: [], sourceStatus: 'client-provided-catalog',
});
const additions = [
  ['atlas-pf266', 'ATLAS', 'emal', 'PF-266 pol emali', 'Эмаль для пола ПФ-266', 'PF-266 floor enamel'],
  ['artek-facade-black', 'ARTEK', 'water', 'Fasad bo‘yog‘i — qora qadoq', 'Фасадная краска — чёрная упаковка', 'Facade paint — black packaging'],
  ['artek-facade-white', 'ARTEK', 'water', 'Yuviladigan fasad bo‘yog‘i', 'Моющаяся фасадная краска', 'Washable facade paint'],
  ['artek-interior', 'ARTEK', 'water', 'Interior — ichki ishlar uchun', 'Interior — для внутренних работ', 'Interior — for indoor use'],
  ['artek-universal', 'ARTEK', 'emal', 'Universal emal', 'Универсальная эмаль', 'Universal enamel'],
  ['milano-decorative', 'MILANO', 'decor', 'MILANO dekorativ qoplamasi', 'Декоративное покрытие MILANO', 'MILANO decorative coating'],
  ['berlak-universal-white', 'BERLAK', 'emal', 'Universal oq emal', 'Универсальная эмаль — белая', 'Universal enamel — white'],
  ['berlak-facade', 'BERLAK', 'water', 'Akril fasad bo‘yog‘i', 'Акриловая фасадная краска', 'Acrylic facade paint'],
  ['berlak-interior', 'BERLAK', 'water', 'Akril interyer bo‘yog‘i', 'Акриловая краска для интерьера', 'Acrylic interior paint'],
  ['berlak-wallpaper-glue', 'BERLAK', 'adhesive', 'Universal gulqog‘oz yelimi', 'Универсальный клей для обоев', 'Universal wallpaper adhesive'],
  ['atlas-primer', 'ATLAS', 'primer', 'Akril astar 1/7', 'Акриловая грунтовка 1/7', 'Acrylic primer 1/7'],
  ['atlas-yacht-lacquer', 'ATLAS', 'lak', 'Suvga chidamli yaxta laki', 'Водостойкий яхтный лак', 'Water-resistant yacht lacquer'],
  ['atlas-interior', 'ATLAS', 'water', 'Akril interyer bo‘yog‘i', 'Акриловая краска для интерьера', 'Acrylic interior paint'],
  ['atlas-facade', 'ATLAS', 'water', 'Akril fasad bo‘yog‘i', 'Акриловая фасадная краска', 'Acrylic facade paint'],
  ['atlas-facade-washable', 'ATLAS', 'water', 'Yuviladigan fasad bo‘yog‘i', 'Моющаяся фасадная краска', 'Washable facade paint'],
  ['artek-floor-improved', 'ARTEK', 'emal', 'Improved pol emali', 'Эмаль Improved для пола', 'Improved floor enamel'],
  ['artek-floor-universal', 'ARTEK', 'emal', 'Universal pol emali', 'Универсальная эмаль для пола', 'Universal floor enamel'],
  ['waterlux-facade', 'WATERLUX', 'water', 'Fasad va interyer akril bo‘yog‘i', 'Акриловая краска для фасада и интерьера', 'Acrylic paint for facade and interior'],
  ['element-primer', 'ELEMENT PAINT', 'primer', 'Astar (gruntovka)', 'Грунтовка', 'Primer'],
  ['element-travertine-lacquer', 'ELEMENT PAINT', 'lak', 'Travertin uchun lak', 'Лак для травертина', 'Travertine lacquer'],
  ['element-primer-plus', 'ELEMENT PAINT', 'primer', 'Primer Plus', 'Primer Plus', 'Primer Plus'],
  ['argon-pva', 'ARGON', 'pva', 'Argon 801 PVA yelimi', 'Клей ПВА Argon 801', 'Argon 801 PVA adhesive'],
  ['dekor-red', 'DEKOR', 'decor', 'DEKOR — qizil qadoq', 'DEKOR — красная упаковка', 'DEKOR — red package'],
  ['dekor-blue', 'DEKOR', 'decor', 'DEKOR — ko‘k qadoq', 'DEKOR — синяя упаковка', 'DEKOR — blue package'],
  ['delta-travertine', 'DELTA', 'travertin', 'Delta suyuq travertin', 'Жидкий травертин Delta', 'Delta liquid travertine'],
  ['delta-primer', 'DELTA', 'primer', 'Delta akril astari', 'Акриловая грунтовка Delta', 'Delta acrylic primer'],
];
const additionNumbers={
  'atlas-pf266':16, 'artek-facade-black':61, 'artek-facade-white':59, 'artek-interior':60,
  'berlak-universal-white':2, 'berlak-facade':5, 'berlak-interior':6, 'berlak-wallpaper-glue':7,
  'atlas-primer':18, 'atlas-yacht-lacquer':29, 'atlas-interior':31, 'atlas-facade':32, 'atlas-facade-washable':33,
  'artek-floor-improved':37, 'artek-floor-universal':48, 'waterlux-facade':65, 'element-primer':66,
  'element-travertine-lacquer':67, 'element-primer-plus':68, 'argon-pva':69, 'dekor-red':70,
  'dekor-blue':71, 'delta-travertine':63, 'delta-primer':72,
};
for (const [id, brand, categoryId, uz, ru, en] of additions) products.push({
  id, aliases: [], categoryId, brand, title: tr(uz,ru,en), description: descriptions[id==='milano-decorative'?'milano':categoryId],
  image: id==='milano-decorative'?'assets/milano_decorative_coating_v2.webp':additionNumbers[id]?catalogImage(additionNumbers[id]):null, variants: [],
  packages: id === 'atlas-pf266' ? [.9,2.7] : id === 'artek-universal' ? [.9,2.7] : id==='milano-decorative' ? [25] : [],
  sourceStatus: brand==='MILANO'?'client-provided-image':'client-provided-catalog',
});
const improvedColors = [
  ['white','#F5F4EB','Oq','Белая','White',34], ['asphalt','#59605F','Ho‘l asfalt','Мокрый асфальт','Wet asphalt',35],
  ['claret','#C84237','To‘q qizil','Бордовая','Claret red',36], ['chocolate','#693E2A','Shokolad jigarrang','Шоколадная','Chocolate',38],
  ['green','#168A42','Yashil','Зелёная','Green',39], ['black','#171717','Qora','Чёрная','Black',40],
  ['yellow','#DBB56B','Sariq','Жёлтая','Yellow',41], ['red','#E43C30','Qizil','Красная','Red',42],
  ['grey','#7C8081','Kulrang','Серая','Grey',43], ['blue','#12A7D6','Havorang','Голубая','Blue',44],
  ['dark-blue','#1B4692','To‘q ko‘k','Тёмно-синяя','Dark blue',45], ['dark-red','#8E1724','Qizg‘ish jigarrang','Красно-коричневая','Reddish brown',46],
];
products.push({
  id:'artek-improved', aliases:[], categoryId:'emal', brand:'ARTEK',
  title:tr('Improved yaltiroq emal','Глянцевая эмаль Improved','Improved gloss enamel'), description:descriptions.emal,
  image:catalogImage(34), variants:improvedColors.map(([id,color,uz,ru,en,number])=>({id,color,name:tr(uz,ru,en),image:catalogImage(number),packages:[.9,2.7]})),
  packages:[], sourceStatus:'client-provided-catalog',
});
const artekUniversalColors = [
  ['yellow','#DBB56B','Sariq','Жёлтая','Yellow',47], ['grey','#7C8081','Kulrang','Серая','Grey',49],
  ['dark-blue','#1B4692','To‘q ko‘k','Тёмно-синяя','Dark blue',50], ['asphalt','#59605F','Ho‘l asfalt','Мокрый асфальт','Wet asphalt',51],
  ['white','#F5F4EB','Oq','Белая','White',52], ['black','#171717','Qora','Чёрная','Black',53],
  ['chocolate','#693E2A','Shokolad jigarrang','Шоколадная','Chocolate',54], ['blue','#12A7D6','Havorang','Голубая','Blue',55],
  ['claret','#C84237','To‘q qizil','Бордовая','Claret red',56], ['red','#E43C30','Qizil','Красная','Red',57],
  ['green','#168A42','Yashil','Зелёная','Green',58],
];
const artekUniversal=products.find(product=>product.id==='artek-universal');
artekUniversal.image=catalogImage(47);
artekUniversal.variants=artekUniversalColors.map(([id,color,uz,ru,en,number])=>({id,color,name:tr(uz,ru,en),image:catalogImage(number),packages:[.9,2.7]}));
artekUniversal.packages=[];
// Weights printed below the corresponding package in the supplied 2026 PDF.
// Image numbering follows extraction order, not left-to-right PDF column order.
const catalogPackages = {
  'berlak-white': [3], 'berlak-universal-white': [2.7], 'berlak-floor': [2.7],
  'berlak-travertin': [5,10,15], 'berlak-facade': [4,9,14,18,20], 'berlak-interior': [4,9,14,18,20],
  'berlak-wallpaper-glue': [.2,.5,1], 'berlak-primer-2kg': [2.5], 'berlak-ottocento': [3,5,15],
  'berlak-pearl': [5,10], 'berlak-travertin-lak': [5,10,15], 'berlak-wallpaper': [3,4],
  'berlak-primer-5kg': [2.8,5], 'atlas-primer': [2.8,5], 'atlas-pf266': [.9,2.7], 'atlas-white': [.9,2.7],
  'atlas-pf283': [.8,2.2], 'atlas-yacht-lacquer': [.8,2.2], 'atlas-pva': [.8],
  'atlas-interior': [18,20], 'atlas-facade': [18,20], 'atlas-facade-washable': [18,20],
  'artek-floor-improved': [.9,2.7], 'artek-floor-universal': [.9,2.7],
  'artek-facade-white': [18,20], 'artek-interior': [18,20], 'artek-facade-black': [18,20],
  'ep-travertin': [25], 'delta-travertine': [25], 'crown-travertin': [25],
  'waterlux-facade': [4,9,14,18,20], 'element-primer': [3], 'element-travertine-lacquer': [5,10,15],
  'element-primer-plus': [20], 'argon-pva': [.8], 'dekor-red': [20], 'dekor-blue': [20], 'delta-primer': [2.8,5],
};
for (const product of products) {
  if (catalogPackages[product.id]) product.packages = catalogPackages[product.id];
}
// White vector frames display the original photograph bytes without repainting
// the package label. Keep the source available from the details view.
for(const [id,image] of Object.entries({
  'atlas-nitro':'assets/nitro_lak_studio-white.svg',
  'ep-plaster':'assets/element_plaster_studio-white.svg',
  'atlas-glatt':'assets/glatt_studio-white.svg',
  'milano-decorative':'assets/milano_decorative_coating_v2-white.svg',
})){
  const product=products.find(item=>item.id===id);
  product.originalImage=product.image;product.image=image;
}
export const strings = {
  uz: {
    made: 'O‘zbekistonda ishlab chiqarilgan · 2011-yildan', catalog: 'Mahsulotlar', about: 'Zavod haqida', contact: 'Aloqa', advice: 'Maslahat olish',
    eyebrow: 'ELEMENT PAINT · 2011-YILDAN', hero: 'Har bir yuza uchun', heroAccent: 'mos bo‘yoq va qoplama.',
    intro: 'Emal, devor bo‘yoqlari va dekorativ qoplamalar. Katalogdan ishlaringizga mos mahsulot, rang va qadoqni tanlang.',
    explore: 'Katalogni ochish',
    years: 'yillik tajriba', directions: 'mahsulot turi', brands: 'brend', browse: 'Mahsulotlarni ko‘rib chiqing.', browseCopy: 'Mahsulot turini tanlang yoki nomi bo‘yicha qidiring.',
    all: 'Barchasi', search: 'Mahsulot yoki brend nomini yozing', brand: 'Brend', clear: 'Filtrlarni tozalash', results: 'ta mahsulot', detail: 'Batafsil', new: 'Yangi mahsulot', imagePending: 'Mahsulot rasmi mavjud emas',
    empty: 'Bu turdagi mahsulotlar haqida ma’lumot olish uchun biz bilan bog‘laning.', noMatch: 'Mahsulot topilmadi. Boshqa nom bilan qidiring yoki filtrlarni tozalang.', ask: 'Shu mahsulot haqida maslahat olish', colors: 'Ranglar', packages: 'Qadoqlar',
    category: 'Mahsulot turi', photoPending: 'Bu rangning qadoq rasmi mavjud emas.', back: 'Katalogga qaytish', aboutTitle: 'Namanganda ishlab chiqaramiz.',
    aboutCopy: 'Element Paint 2011-yildan Namanganda bo‘yoq va qoplamalar ishlab chiqaradi. Katalogimizda emal, devor bo‘yoqlari, astar, yelim, lak va dekorativ qoplamalarni topasiz.',
    applications: 'Qayerga ishlatmoqchisiz?', facade: 'Tashqi devorlar', interior: 'Ichki devorlar', wood: 'Yog‘och va metall',
    contactTitle: 'Mahsulot tanlashingizga yordam beramiz.', contactCopy: 'Qaysi yuzaga ishlatishingizni ayting. Sizga mos mahsulot, rang va qadoqni tanlashda yordam beramiz.',
    phone: 'Qo‘ng‘iroq qiling', telegram: 'Telegramda yozing', footer: 'Bo‘yoqlar va dekorativ qoplamalar ishlab chiqaruvchisi.', skip: 'Asosiy mazmunga o‘tish', menu: 'Menyu', closeDialog: 'Yopish',
    theme: 'Ko‘rinishni o‘zgartirish', loading: 'Logotip bo‘yoq bilan to‘lmoqda.', preview: 'Sinov versiyasi',
  },
  ru: {
    made: 'Произведено в Узбекистане · С 2011 года', catalog: 'Продукция', about: 'О производстве', contact: 'Контакты', advice: 'Консультация',
    eyebrow: 'ELEMENT PAINT · С 2011 ГОДА', hero: 'Для каждой поверхности', heroAccent: 'подходящее покрытие.',
    intro: 'Эмали, краски для стен и декоративные покрытия. Выберите продукт, цвет и упаковку для ваших работ.',
    explore: 'Открыть каталог',
    years: 'лет опыта', directions: 'видов продукции', brands: 'брендов', browse: 'Посмотрите нашу продукцию.', browseCopy: 'Выберите вид продукции или найдите продукт по названию.',
    all: 'Все', search: 'Введите название продукта или бренда', brand: 'Бренд', clear: 'Сбросить фильтры', results: 'продуктов', detail: 'Подробнее', new: 'Новый продукт', imagePending: 'Фото продукта отсутствует',
    empty: 'Свяжитесь с нами, чтобы узнать о продукции этого вида.', noMatch: 'Продукт не найден. Попробуйте другое название или сбросьте фильтры.', ask: 'Получить консультацию об этом продукте', colors: 'Цвета', packages: 'Упаковка',
    category: 'Вид продукции', photoPending: 'Фото упаковки этого цвета отсутствует.', back: 'Вернуться в каталог', aboutTitle: 'Производим в Намангане.',
    aboutCopy: 'Element Paint производит краски и покрытия в Намангане с 2011 года. В каталоге вы найдёте эмали, краски для стен, грунтовки, клеи, лаки и декоративные покрытия.',
    applications: 'Где планируете использовать?', facade: 'Наружные стены', interior: 'Внутренние стены', wood: 'Дерево и металл',
    contactTitle: 'Поможем вам выбрать продукт.', contactCopy: 'Расскажите, для какой поверхности нужен материал. Поможем выбрать продукт, цвет и упаковку.',
    phone: 'Позвоните нам', telegram: 'Напишите в Telegram', footer: 'Производитель красок и декоративных покрытий.', skip: 'Перейти к содержимому', menu: 'Меню', closeDialog: 'Закрыть',
    theme: 'Изменить оформление', loading: 'Логотип наполняется краской.', preview: 'Тестовая версия',
  },
  en: {
    made: 'Made in Uzbekistan · Since 2011', catalog: 'Products', about: 'Our factory', contact: 'Contact', advice: 'Get advice',
    eyebrow: 'ELEMENT PAINT · SINCE 2011', hero: 'For every surface,', heroAccent: 'a suitable finish.',
    intro: 'Enamels, wall paints and decorative coatings. Choose the product, colour and packaging for your project.',
    explore: 'Explore products',
    years: 'years of experience', directions: 'product types', brands: 'brands', browse: 'Browse our products.', browseCopy: 'Choose a product type or search by name.',
    all: 'All', search: 'Enter a product or brand name', brand: 'Brand', clear: 'Clear filters', results: 'products', detail: 'View product', new: 'New product', imagePending: 'Product photo unavailable',
    empty: 'Contact us to learn about products of this type.', noMatch: 'No products found. Try a different name or clear the filters.', ask: 'Get advice about this product', colors: 'Colours', packages: 'Packaging',
    category: 'Product type', photoPending: 'The packaging photo for this colour is unavailable.', back: 'Back to products', aboutTitle: 'Made in Namangan.',
    aboutCopy: 'Element Paint manufactures paints and coatings in Namangan. Our catalogue brings together solutions for different surfaces: enamels, primers, adhesives, varnishes and decorative coatings.',
    applications: 'Where will you use it?', facade: 'Exterior walls', interior: 'Interior walls', wood: 'Wood and metal',
    contactTitle: 'We’ll help you choose your product.', contactCopy: 'Tell us which surface you are working on. We will help you choose the product, colour and packaging.',
    phone: 'Call us', telegram: 'Message us on Telegram', footer: 'Manufacturer of paints and decorative coatings.', skip: 'Skip to content', menu: 'Menu', closeDialog: 'Close',
    theme: 'Change appearance', loading: 'Paint is filling the logo.', preview: 'Preview version',
  },
};
const pageCopy = {
  uz:{skipIntro:'O‘tkazib yuborish',catalogEyebrow:'MAHSULOTLAR KATALOGI',catalogEdition:'2026-yil katalogi',factoryEyebrow:'NAMANGAN / 2011',applicationCopy:'Mahsulotni ishlatiladigan yuzaga qarab tanlang.',contactEyebrow:'SIZGA YORDAM BERAMIZ'},
  ru:{skipIntro:'Пропустить',catalogEyebrow:'КАТАЛОГ ПРОДУКЦИИ',catalogEdition:'Каталог 2026',factoryEyebrow:'НАМАНГАН / 2011',applicationCopy:'Выбирайте материал с учётом поверхности.',contactEyebrow:'ПОМОЖЕМ С ВЫБОРОМ'},
  en:{skipIntro:'Skip introduction',catalogEyebrow:'PRODUCT CATALOGUE',catalogEdition:'2026 catalogue',factoryEyebrow:'NAMANGAN / 2011',applicationCopy:'Choose a product suited to the surface.',contactEyebrow:'HERE TO HELP'},
};
for(const lang of ['uz','ru','en'])Object.assign(strings[lang],pageCopy[lang]);
export function findProduct(id) { return products.find(p => p.id === id || p.aliases.includes(id)); }

const selectorCopy={
  uz:{chooseProduct:'Mahsulotni tanlang',productTypes:'Mahsulot turlari',previousProduct:'Oldingi mahsulot',nextProduct:'Keyingi mahsulot',selectorHint:'Yon tomonga suring yoki ← → tugmalaridan foydalaning.',autoSlide:'Mahsulotlarni avtomatik almashtirish'},
  ru:{chooseProduct:'Выберите продукт',productTypes:'Виды продукции',previousProduct:'Предыдущий продукт',nextProduct:'Следующий продукт',selectorHint:'Листайте в сторону или используйте клавиши ← →.',autoSlide:'Автоматически переключать продукты'},
  en:{chooseProduct:'Choose your product',productTypes:'Product types',previousProduct:'Previous product',nextProduct:'Next product',selectorHint:'Swipe sideways or use the ← → keys.',autoSlide:'Switch products automatically'},
};
for(const lang of ['uz','ru','en'])Object.assign(strings[lang],selectorCopy[lang]);
for(const [lang,fullImage] of Object.entries({uz:'Asl rasmni ochish',ru:'Открыть оригинал',en:'Open original image'}))strings[lang].fullImage=fullImage;
