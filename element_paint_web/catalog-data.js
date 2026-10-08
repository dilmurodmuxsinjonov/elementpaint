import legacyProducts from './legacy-products.js';

const tr = (uz, ru, en) => ({ uz, ru, en });
export const categories = [
  ['emal', 'Alkid emal bo‘yoqlari', 'Алкидные эмали', 'Alkyd enamels'],
  ['water', 'Suvli emulsiya bo‘yoqlari', 'Водно-дисперсионные краски', 'Water-based paints'],
  ['pva', 'PVA yelimlari', 'Клеи ПВА', 'PVA adhesives'],
  ['primer', 'Akril astar bo‘yoqlari', 'Акриловые грунтовки', 'Acrylic primers'],
  ['travertin', 'Suyuq travertin', 'Жидкий травертин', 'Liquid travertine'],
  ['decor', 'Dekorativ qoplamalar', 'Декоративные покрытия', 'Decorative coatings'],
  ['ottocento', 'Ottocento', 'Отточенто', 'Ottocento'],
  ['wallpaper', 'Suyuq gul qog‘ozlari', 'Жидкие обои', 'Liquid wallpaper'],
  ['road', 'Yo‘l uchun bo‘yoqlar', 'Краски для дорог', 'Road paints'],
  ['salt', 'Sho‘rlashga qarshi vositalar', 'Средства против высолов', 'Anti-efflorescence products'],
  ['lak', 'Himoyalovchi laklar', 'Защитные лаки', 'Protective varnishes'],
  ['preparation', 'Sirt tayyorlash', 'Подготовка поверхности', 'Surface preparation'],
  ['adhesive', 'Yelimlar', 'Клеи', 'Adhesives'],
].map(([id, uz, ru, en], order) => ({ id, name: tr(uz, ru, en), core: order < 10 }));

const names = {
  'ep-travertin': tr('Premium suyuq travertin', 'Премиальный жидкий травертин', 'Premium liquid travertine'),
  'crown-travertin': tr('Crown suyuq travertin', 'Жидкий травертин Crown', 'Crown liquid travertine'),
  'berlak-travertin': tr('Berlak suyuq travertin', 'Жидкий травертин Berlak', 'Berlak liquid travertine'),
  'berlak-ottocento': tr('Ottocento — ipak va baxmal', 'Отточенто — шёлк и бархат', 'Ottocento — silk and velvet'),
  'ep-plaster': tr('Element Plaster dekorativ suvoq', 'Декоративная штукатурка Element Plaster', 'Element Plaster decorative plaster'),
  'berlak-wallpaper': tr('Fantasy suyuq gul qog‘ozi', 'Жидкие обои Fantasy', 'Fantasy liquid wallpaper'),
  'atlas-white': tr('Emal Standart — oq', 'Эмаль Стандарт — белая', 'Standard enamel — white'),
  'berlak-white': tr('Berlak PF-115 — qordek oq', 'Berlak ПФ-115 — белоснежная', 'Berlak PF-115 — snow white'),
  'berlak-floor': tr('Berlak pol emali', 'Эмаль для пола Berlak', 'Berlak floor enamel'),
  'berlak-pearl': tr('Marvarid effektli lak', 'Лак с перламутровым эффектом', 'Pearl-effect varnish'),
  'berlak-travertin-lak': tr('Travertin uchun lak', 'Лак для травертина', 'Travertine varnish'),
  'atlas-nitro': tr('Nitro lak NC-2144', 'Нитролак НЦ-2144', 'NC-2144 nitro varnish'),
  'atlas-pf283': tr('PF-283 porloq lak', 'Глянцевый лак ПФ-283', 'PF-283 gloss varnish'),
  'berlak-primer-5kg': tr('Akril astar 1/7 — 5 kg', 'Акриловая грунтовка 1/7 — 5 кг', 'Acrylic primer 1/7 — 5 kg'),
  'berlak-primer-2kg': tr('Akril astar — 2,5 kg', 'Акриловая грунтовка — 2,5 кг', 'Acrylic primer — 2.5 kg'),
  'atlas-pva': tr('801 PVA yelimi', 'Клей ПВА 801', '801 PVA adhesive'),
  'atlas-glatt': tr('Glatt gips shpatlyovka', 'Гипсовая шпатлёвка Glatt', 'Glatt gypsum finishing filler'),
};
const descriptions = {
  emal: tr('Metall va yog‘och yuzalar uchun emal bo‘yoqlar.', 'Эмали для металлических и деревянных поверхностей.', 'Enamel paints for metal and wood surfaces.'),
  travertin: tr('Devorlarda tabiiy tosh ko‘rinishini hosil qiluvchi qoplama.', 'Покрытие для стен с фактурой натурального камня.', 'A wall coating with a natural stone texture.'),
  decor: tr('Devor yuzalari uchun dekorativ qoplama.', 'Декоративное покрытие для стен.', 'A decorative coating for wall surfaces.'),
  ottocento: tr('Ipak va baxmal ko‘rinishidagi dekorativ devor qoplamasi.', 'Декоративное покрытие стен с эффектом шёлка и бархата.', 'A decorative wall finish with a silk and velvet appearance.'),
  wallpaper: tr('Interyer devorlari uchun suyuq gul qog‘ozi.', 'Жидкие обои для внутренних стен.', 'Liquid wallpaper for interior walls.'),
  lak: tr('Yuzani pardozlash uchun lak. Mos mahsulotni tanlashda maslahat oling.', 'Лак для финишной отделки. Уточните подходящий продукт у специалиста.', 'A finishing varnish. Contact us to select a suitable product.'),
  milano: tr('Interyer devorlari uchun dekorativ qoplama.', 'Декоративное покрытие для внутренних стен.', 'A decorative coating for interior walls.'),
  primer: tr('Bo‘yashdan avval yuzani tayyorlash uchun akril astar.', 'Акриловая грунтовка для подготовки поверхности перед окрашиванием.', 'An acrylic primer for preparing surfaces before painting.'),
  pva: tr('Yog‘och, qog‘oz va qurilish ishlari uchun PVA yelimi.', 'Клей ПВА для дерева, бумаги и строительных работ.', 'PVA adhesive for wood, paper and construction work.'),
  preparation: tr('Ichki yuzalarni pardozlash uchun gipsli aralashma.', 'Гипсовая смесь для отделки внутренних поверхностей.', 'A gypsum compound for finishing interior surfaces.'),
  water: tr('Devor yuzalari uchun suv asosidagi bo‘yoq.', 'Краска на водной основе для стен.', 'A water-based paint for wall surfaces.'),
  adhesive: tr('Gulqog‘oz yopishtirish uchun yelim.', 'Клей для надёжного приклеивания обоев.', 'Adhesive for securely attaching wallpaper.'),
};
const mapping = { 'berlak-ottocento': 'ottocento', 'ep-plaster': 'decor', 'berlak-wallpaper': 'wallpaper', 'atlas-pva': 'pva', 'atlas-glatt': 'preparation' };
export const legacyIds = legacyProducts.map(p => p.id);
export const products = legacyProducts.filter(p => !['atlas-blue', 'atlas-yellow', 'atlas-brown'].includes(p.id)).map(p => ({
  id: p.id, aliases: [], categoryId: mapping[p.id] || p.cat, brand: p.brand,
  title: names[p.id], description: descriptions[mapping[p.id] || p.cat], image: p.img,
  variants: [], packages: [], sourceStatus: 'existing',
}));
products.find(p => p.id === 'atlas-white').packages = [2.7];
products.find(p => p.id === 'berlak-primer-5kg').packages = [5];
products.find(p => p.id === 'berlak-primer-2kg').packages = [2.5];
const catalogImage = number => `assets/catalog-2026/product-${String(number).padStart(3,'0')}.webp`;
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
products.find(p => p.id === 'atlas-white').packages = [.9,2.7];
const colorRows = [
  ['white', '#F5F4EB', 'Qordek oq', 'Белоснежный', 'Snow white', 13],
  ['dark-red', '#A82B2D', 'To‘q qizil', 'Тёмно-красный', 'Dark red', 14],
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
  ['atlas-primer', 'ATLAS', 'primer', 'Akril astar 1/7 — 2,8 kg', 'Акриловая грунтовка 1/7 — 2,8 кг', 'Acrylic primer 1/7 — 2.8 kg'],
  ['atlas-yacht-lacquer', 'ATLAS', 'lak', 'Suvga chidamli yaxta laki', 'Водостойкий яхтный лак', 'Water-resistant yacht lacquer'],
  ['atlas-interior', 'ATLAS', 'water', 'Akril interyer bo‘yog‘i', 'Акриловая краска для интерьера', 'Acrylic interior paint'],
  ['atlas-facade', 'ATLAS', 'water', 'Akril fasad bo‘yog‘i', 'Акриловая фасадная краска', 'Acrylic facade paint'],
  ['atlas-facade-washable', 'ATLAS', 'water', 'Yuviladigan fasad bo‘yog‘i', 'Моющаяся фасадная краска', 'Washable facade paint'],
  ['artek-floor-improved', 'ARTEK', 'emal', 'Improved pol emali', 'Эмаль Improved для пола', 'Improved floor enamel'],
  ['artek-floor-universal', 'ARTEK', 'emal', 'Universal pol emali', 'Универсальная эмаль для пола', 'Universal floor enamel'],
  ['waterlux-facade', 'WATERLUX', 'water', 'Fasad va interyer akril bo‘yog‘i', 'Акриловая краска для фасада и интерьера', 'Acrylic paint for facade and interior'],
  ['element-primer', 'ELEMENT PAINT', 'primer', 'Gruntovka', 'Грунтовка', 'Primer'],
  ['element-travertine-lacquer', 'ELEMENT PAINT', 'lak', 'Travertin uchun lak', 'Лак для травертина', 'Travertine lacquer'],
  ['element-primer-plus', 'ELEMENT PAINT', 'primer', 'Primer Plus', 'Primer Plus', 'Primer Plus'],
  ['argon-pva', 'ARGON', 'pva', 'Argon 801 PVA yelimi', 'Клей ПВА Argon 801', 'Argon 801 PVA adhesive'],
  ['dekor-red', 'DEKOR', 'decor', 'DEKOR — qizil qadoq', 'DEKOR — красная упаковка', 'DEKOR — red package'],
  ['dekor-blue', 'DEKOR', 'decor', 'DEKOR — ko‘k qadoq', 'DEKOR — синяя упаковка', 'DEKOR — blue package'],
  ['delta-travertine', 'DELTA', 'travertin', 'Delta suyuq travertin', 'Жидкий травертин Delta', 'Delta liquid travertine'],
  ['delta-primer', 'DELTA', 'primer', 'Delta akril astari — 5 kg', 'Акриловая грунтовка Delta — 5 кг', 'Delta acrylic primer — 5 kg'],
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
  ['claret','#C84237','To‘q qizil','Бордовая','Claret red',36], ['chocolate','#693E2A','Shokolad','Шоколадная','Chocolate',38],
  ['green','#168A42','Yashil','Зелёная','Green',39], ['black','#171717','Qora','Чёрная','Black',40],
  ['yellow','#DBB56B','Sariq','Жёлтая','Yellow',41], ['red','#E43C30','Qizil','Красная','Red',42],
  ['grey','#7C8081','Kulrang','Серая','Grey',43], ['blue','#12A7D6','Havorang','Голубая','Blue',44],
  ['dark-blue','#1B4692','To‘q ko‘k','Тёмно-синяя','Dark blue',45], ['dark-red','#8E1724','To‘q qizil','Красно-коричневая','Dark red',46],
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
  ['chocolate','#693E2A','Shokolad','Шоколадная','Chocolate',54], ['blue','#12A7D6','Havorang','Голубая','Blue',55],
  ['claret','#C84237','To‘q qizil','Бордовая','Claret red',56], ['red','#E43C30','Qizil','Красная','Red',57],
  ['green','#168A42','Yashil','Зелёная','Green',58],
];
const artekUniversal=products.find(product=>product.id==='artek-universal');
artekUniversal.image=catalogImage(47);
artekUniversal.variants=artekUniversalColors.map(([id,color,uz,ru,en,number])=>({id,color,name:tr(uz,ru,en),image:catalogImage(number),packages:[.9,2.7]}));
artekUniversal.packages=[];
for(const product of products){
  if(product.id==='berlak-white') product.packages=[3];
  if(product.id==='berlak-floor') product.packages=[2.7];
  if(product.id==='berlak-travertin') product.packages=[5,10,15];
  if(product.id==='berlak-primer-5kg') product.packages=[5];
  if(product.id==='berlak-primer-2kg') product.packages=[2.5];
  if(product.id==='atlas-pf266') product.packages=[.9,2.7];
  if(product.id==='atlas-pva') product.packages=[.8];
  if(product.id==='berlak-ottocento') product.packages=[3,5,15];
  if(product.id==='berlak-pearl') product.packages=[5,10];
  if(product.id==='berlak-travertin-lak') product.packages=[5,10,15];
  if(product.id==='berlak-wallpaper') product.packages=[3,4];
  if(product.id==='berlak-universal-white') product.packages=[3];
  if(product.id==='berlak-wallpaper-glue') product.packages=[.2,.5,1];
}
export const strings = {
  uz: {
    made: 'O‘zbekistonda ishlab chiqarilgan · 2011-yildan', catalog: 'Mahsulotlar', about: 'Zavod haqida', contact: 'Aloqa', advice: 'Maslahat olish',
    eyebrow: 'RANG. SIFAT. ISHLAB CHIQARISH.', hero: 'Har bir sirt uchun', heroAccent: 'o‘z bo‘yog‘imiz.',
    intro: 'Emaldan dekorativ qoplamagacha. Element Paint mahsulotlari bilan rangni, qadoqni va o‘zingizga mos yechimni tanlang.',
    explore: 'Katalogni ochish', interact: 'Bankani aylantirib ko‘ring', open: 'Qopqoqni ochish', close: 'Qopqoqni yopish', pour: 'Bo‘yoq quyish', stop: 'Quyishni to‘xtatish', reset: 'Qayta boshlash',
    closed: 'Banka yopiq', opened: 'Qopqoq ochiq', pouring: 'Bo‘yoq quyilmoqda', emptyCan: 'Bo‘yoq tugadi — qayta boshlang', fallback: 'Berlak PF-115',
    years: 'yillik tajriba', directions: 'asosiy yo‘nalish', brands: 'mahsulot brendi', browse: 'Mahsulotni toping.', browseCopy: 'Yo‘nalishdan boshlang yoki mahsulot nomini qidiring.',
    all: 'Barchasi', search: 'Mahsulot yoki brendni qidirish', brand: 'Brend', clear: 'Tozalash', results: 'ta mahsulot', detail: 'Batafsil', new: 'Yangi mahsulot', imagePending: 'Mahsulot rasmi tayyorlanmoqda',
    empty: 'Bu yo‘nalish bo‘yicha batafsil ma’lumotni bizdan oling.', noMatch: 'Qidiruvingizga mos mahsulot topilmadi.', ask: 'Mahsulot haqida so‘rash', colors: 'Ranglar', packages: 'Qadoqlar',
    category: 'Yo‘nalish', photoPending: 'Bu rangning yangi qadoq rasmi tayyorlanmoqda.', back: 'Katalogga qaytish', aboutTitle: 'Rang yaratadigan ishlab chiqaruvchi.',
    aboutCopy: 'Element Paint — Namanganda ishlab chiqariladigan bo‘yoq va qoplamalar. Turli yuzalar uchun mahsulotlarni bir katalogda jamladik: emal, astar, yelim, lak va dekorativ qoplamalar.',
    applications: 'Mahsulotlarimiz qo‘llanadigan joylar', facade: 'Fasad', interior: 'Interyer', wood: 'Yog‘och va metall',
    contactTitle: 'Mos mahsulotni birga tanlaymiz.', contactCopy: 'Qaysi yuzani bo‘yamoqchisiz? Biz bilan bog‘laning — mahsulot va qadoqni tanlashda yordam beramiz.',
    phone: 'Qo‘ng‘iroq qilish', telegram: 'Telegram', footer: 'Bo‘yoqlar va dekorativ qoplamalar ishlab chiqaruvchisi.', skip: 'Asosiy mazmunga o‘tish', menu: 'Menyu', closeDialog: 'Yopish',
    theme: 'Ko‘rinishni o‘zgartirish', loading: 'Rang bilan boshlanadi.', preview: 'Sinov versiyasi',
  },
  ru: {
    made: 'Произведено в Узбекистане · С 2011 года', catalog: 'Продукция', about: 'О производстве', contact: 'Контакты', advice: 'Консультация',
    eyebrow: 'ЦВЕТ. КАЧЕСТВО. ПРОИЗВОДСТВО.', hero: 'Для каждой поверхности', heroAccent: 'своя краска.',
    intro: 'От эмалей до декоративных покрытий. Выберите цвет, упаковку и подходящее решение в каталоге Element Paint.',
    explore: 'Открыть каталог', interact: 'Попробуйте вращать банку', open: 'Открыть крышку', close: 'Закрыть крышку', pour: 'Налить краску', stop: 'Остановить', reset: 'Начать заново',
    closed: 'Банка закрыта', opened: 'Крышка открыта', pouring: 'Краска наливается', emptyCan: 'Краска закончилась — начните заново', fallback: 'Berlak ПФ-115',
    years: 'лет опыта', directions: 'основных направлений', brands: 'брендов продукции', browse: 'Найдите свою краску.', browseCopy: 'Выберите направление или найдите продукт по названию.',
    all: 'Все', search: 'Поиск продукта или бренда', brand: 'Бренд', clear: 'Очистить', results: 'продуктов', detail: 'Подробнее', new: 'Новый продукт', imagePending: 'Фото продукта готовится',
    empty: 'Свяжитесь с нами для подробностей о продукции этого направления.', noMatch: 'По вашему запросу ничего не найдено.', ask: 'Спросить о продукте', colors: 'Цвета', packages: 'Упаковка',
    category: 'Направление', photoPending: 'Фото новой упаковки этого цвета готовится.', back: 'Вернуться в каталог', aboutTitle: 'Производитель, создающий цвет.',
    aboutCopy: 'Element Paint — краски и покрытия из Намангана. В одном каталоге собраны решения для разных поверхностей: эмали, грунтовки, клеи, лаки и декоративные покрытия.',
    applications: 'Где применяются наши продукты', facade: 'Фасад', interior: 'Интерьер', wood: 'Дерево и металл',
    contactTitle: 'Подберём подходящий продукт вместе.', contactCopy: 'Какую поверхность вы хотите покрасить? Свяжитесь с нами — поможем выбрать продукт и упаковку.',
    phone: 'Позвонить', telegram: 'Telegram', footer: 'Производитель красок и декоративных покрытий.', skip: 'Перейти к содержимому', menu: 'Меню', closeDialog: 'Закрыть',
    theme: 'Изменить оформление', loading: 'Всё начинается с цвета.', preview: 'Тестовая версия',
  },
  en: {
    made: 'Made in Uzbekistan · Since 2011', catalog: 'Products', about: 'Our factory', contact: 'Contact', advice: 'Get advice',
    eyebrow: 'COLOUR. QUALITY. MANUFACTURING.', hero: 'For every surface,', heroAccent: 'a paint of our own.',
    intro: 'From enamels to decorative coatings. Find your colour, packaging and the right solution in the Element Paint catalogue.',
    explore: 'Explore products', interact: 'Try rotating the can', open: 'Open the lid', close: 'Close the lid', pour: 'Pour the paint', stop: 'Stop pouring', reset: 'Start again',
    closed: 'Can closed', opened: 'Lid open', pouring: 'Pouring paint', emptyCan: 'The can is empty — start again', fallback: 'Berlak PF-115',
    years: 'years of experience', directions: 'core categories', brands: 'product brands', browse: 'Find your paint.', browseCopy: 'Choose a category or search by product name.',
    all: 'All', search: 'Search products or brands', brand: 'Brand', clear: 'Clear', results: 'products', detail: 'View product', new: 'New product', imagePending: 'Product photo in preparation',
    empty: 'Contact us for details about products in this category.', noMatch: 'No products match your search.', ask: 'Ask about this product', colors: 'Colours', packages: 'Packaging',
    category: 'Category', photoPending: 'The new packaging photo for this colour is in preparation.', back: 'Back to products', aboutTitle: 'A manufacturer that creates colour.',
    aboutCopy: 'Element Paint manufactures paints and coatings in Namangan. Our catalogue brings together solutions for different surfaces: enamels, primers, adhesives, varnishes and decorative coatings.',
    applications: 'Where our products are used', facade: 'Facades', interior: 'Interiors', wood: 'Wood and metal',
    contactTitle: 'Let’s find the right product.', contactCopy: 'What surface are you painting? Contact us and we will help you choose the product and packaging.',
    phone: 'Call us', telegram: 'Telegram', footer: 'Manufacturer of paints and decorative coatings.', skip: 'Skip to content', menu: 'Menu', closeDialog: 'Close',
    theme: 'Change appearance', loading: 'It begins with colour.', preview: 'Preview version',
  },
};
export function findProduct(id) { return products.find(p => p.id === id || p.aliases.includes(id)); }
