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
  primer: tr('Bo‘yashdan avval yuzani tayyorlash uchun akril astar.', 'Акриловая грунтовка для подготовки поверхности перед окрашиванием.', 'An acrylic primer for preparing surfaces before painting.'),
  pva: tr('Yog‘och, qog‘oz va qurilish ishlari uchun PVA yelimi.', 'Клей ПВА для дерева, бумаги и строительных работ.', 'PVA adhesive for wood, paper and construction work.'),
  preparation: tr('Ichki yuzalarni pardozlash uchun gipsli aralashma.', 'Гипсовая смесь для отделки внутренних поверхностей.', 'A gypsum compound for finishing interior surfaces.'),
  water: tr('Devor yuzalari uchun suv asosidagi bo‘yoq.', 'Краска на водной основе для стен.', 'A water-based paint for wall surfaces.'),
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
const colorRows = [
  ['grey', '#818280', 'Kulrang', 'Серая', 'Grey', 'assets/atlas_grey_bank.jpg'],
  ['brown', '#5D3025', 'Shokolad jigarrang', 'Шоколадно-коричневая', 'Chocolate brown', 'assets/atlas_brown_bank.jpg'],
  ['white', '#F5F4EB', 'Qordek oq', 'Белоснежная', 'Snow white', 'assets/atlas_white_bank_v2.jpg'],
  ['dark-blue', '#24468D', 'To‘q ko‘k', 'Синяя', 'Dark blue', 'assets/atlas_darkblue_bank_v2.jpg'],
  ['red', '#CB3428', 'Qizil', 'Красная', 'Red', 'assets/atlas_red_bank_v2.jpg'],
  ['blue', '#149CD0', 'Havorang', 'Голубая', 'Blue', 'assets/atlas_blue_bank_v2.jpg'],
  ['black', '#272C2A', 'Qora', 'Чёрная', 'Black', 'assets/atlas_black_bank.jpg'],
  ['green', '#188549', 'Yashil', 'Зелёная', 'Green', 'assets/atlas_green_bank.jpg'],
  ['yellow', '#E5C42C', 'Sariq', 'Жёлтая', 'Yellow', 'assets/atlas_yellow_bank.jpg'],
  ['asphalt', '#4B5554', 'Ho‘l asfalt', 'Мокрый асфальт', 'Wet asphalt', 'assets/atlas_asphalt_bank_v2.jpg'],
];
products.splice(6, 0, {
  id: 'atlas-pf115', aliases: ['atlas-blue', 'atlas-yellow', 'atlas-brown'], categoryId: 'emal', brand: 'ATLAS',
  title: tr('PF-115 yaltiroq emal', 'Глянцевая эмаль ПФ-115', 'PF-115 gloss enamel'),
  description: descriptions.emal, image: 'assets/atlas_grey_bank.jpg',
  variants: colorRows.map(([id,color,uz,ru,en,image]) => ({ id, color, name: tr(uz,ru,en), image, packageKg: id === 'white' ? 3 : 2.7 })),
  packages: [], sourceStatus: 'generated-preview',
});
const additions = [
  ['atlas-pf266', 'ATLAS', 'emal', 'PF-266 pol emali', 'Эмаль для пола ПФ-266', 'PF-266 floor enamel'],
  ['artek-facade-black', 'ARTEK', 'water', 'Fasad bo‘yog‘i — qora qadoq', 'Фасадная краска — чёрная упаковка', 'Facade paint — black packaging'],
  ['artek-facade-white', 'ARTEK', 'water', 'Yuviladigan fasad bo‘yog‘i', 'Моющаяся фасадная краска', 'Washable facade paint'],
  ['artek-interior', 'ARTEK', 'water', 'Interior — ichki ishlar uchun', 'Interior — для внутренних работ', 'Interior — for indoor use'],
  ['artek-universal', 'ARTEK', 'emal', 'Universal emal', 'Универсальная эмаль', 'Universal enamel'],
];
products.find(p => p.id === 'berlak-white').image = 'assets/berlak_blue_bank.jpg';
const additionImages={
  'atlas-pf266':'assets/atlas_pf266_bank.jpg',
  'artek-facade-black':'assets/artek_facade_black.jpg',
  'artek-facade-white':'assets/artek_facade_white.jpg',
  'artek-interior':'assets/artek_interior.jpg',
  'artek-universal':'assets/artek_universal.jpg',
};
for (const [id, brand, categoryId, uz, ru, en] of additions) products.push({
  id, aliases: [], categoryId, brand, title: tr(uz,ru,en), description: descriptions[categoryId],
  image: additionImages[id]||null, variants: [], packages: id === 'atlas-pf266' ? [2.7] : id === 'artek-universal' ? [.9,2.8,25] : [], sourceStatus: additionImages[id]?'generated-preview':'original-image-pending',
});
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
