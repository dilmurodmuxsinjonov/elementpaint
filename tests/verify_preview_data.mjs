import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

globalThis.window = {};
const { products, categories, legacyIds, strings, findProduct } = await import('../element_paint_web/catalog-data.js');
assert.equal(legacyIds.length,20,'Unexpected source catalog: audit the migration');
assert.equal(categories.filter(c=>c.core).length,10);
assert.equal(products.length,73,'72 catalogue entries plus the supplied MILANO');
assert.equal(products.filter(p=>p.colorName).length,34);
assert.ok(products.every(p=>p.variants.length===0),'Every colour must have its own card');
assert.equal(new Set(products.map(p=>p.id)).size,products.length);
assert.deepEqual(legacyIds.filter(id=>!findProduct(id)).sort(),['atlas-glatt','atlas-nitro','ep-plaster'],'Only the three products outside the newly selected 72 + MILANO scope are removed');
for(const [oldId,variant] of [['atlas-blue','blue'],['atlas-yellow','yellow'],['atlas-brown','brown']]){
  const product=findProduct(oldId);assert.equal(product.familyId,'atlas-pf115');assert.equal(product.variantId,variant);assert.equal(findProduct('atlas-pf115',variant),product);
}
assert.notEqual(findProduct('artek-facade-black'),findProduct('artek-facade-white'));
const keys=Object.keys(strings.uz).sort();
for(const lang of ['uz','ru','en']){
  assert.deepEqual(Object.keys(strings[lang]).sort(),keys,`${lang} interface translation missing`);
  for(const product of products){assert.ok(product.title?.[lang],`${product.id} title missing: ${lang}`);assert.ok(product.description?.[lang],`${product.id} description missing: ${lang}`);for(const v of product.variants)assert.ok(v.name[lang]);}
  for(const category of categories)assert.ok(category.name[lang]);
}
for(const product of products){assert.ok(categories.some(c=>c.id===product.categoryId));for(const image of [product.image,product.originalImage,...product.variants.map(v=>v.image)].filter(Boolean)){assert.ok(image,`Missing product photo: ${product.id}`);await access(new URL(`../element_paint_web/${image}`,import.meta.url));}}
const atlasPrimer=findProduct('atlas-primer');
assert.equal(atlasPrimer.image,'assets/atlas_primer_legacy_red-2021.jpg');
assert.equal(atlasPrimer.originalImage,'assets/catalog-2026/product-018.png','Keep the 2026 PDF package available as the original');
const legacyPrimerBytes=await readFile(new URL('../element_paint_web/assets/atlas_primer_legacy_red-2021.jpg',import.meta.url));
assert.equal(createHash('sha256').update(legacyPrimerBytes).digest('hex'),'e2037f9b38ad0cbba10299756996c51d2ae9d6a9a50e79f2fb7cc3448ce2ac49','Keep the customer-selected source photo intact');
// Independent source fixture: weights extracted from the PDF's printed kg rows,
// with image-to-product assignments checked visually against package labels.
const fixture=JSON.parse(await readFile(new URL('./fixtures/catalog-2026.json',import.meta.url),'utf8'));
assert.equal(fixture.packages.length,72);
assert.equal(new Set(fixture.packages.map(row=>row.imageNumber)).size,72);
assert.deepEqual(products.map(p=>p.catalogNumber),Array.from({length:73},(_,i)=>i+1),'Catalogue numbering must cover every entry exactly once');
const approvedKeys=fixture.packages.map(row=>`${row.productId}/${row.variantId||''}`).sort();
assert.deepEqual(products.filter(p=>p.catalogNumber<=72).map(p=>`${p.familyId}/${p.variantId}`).sort(),approvedKeys,'Unapproved product added or catalogue entry missing');
for(const row of fixture.packages){
  const target=products.find(p=>p.catalogNumber===row.imageNumber);
  assert.ok(target,`PDF package ${row.imageNumber}: missing ${row.productId}/${row.variantId||''}`);
  assert.equal(target.originalImage||target.image,`assets/catalog-2026/product-${String(row.imageNumber).padStart(3,'0')}.png`,`Wrong PDF image for ${row.productId}/${row.variantId||''}`);
  assert.deepEqual(target.packages,row.packagesKg,`Wrong PDF weight for ${row.productId}/${row.variantId||''}`);
}
const images=await readdir(new URL('../element_paint_web/assets/catalog-2026/',import.meta.url));
assert.equal(images.filter(name=>/^product-\d{3}\.png$/.test(name)).length,72);
const milano=findProduct('milano-decorative');
assert.deepEqual(milano.packages,[25]);assert.equal(milano.brand,'BERLAK');assert.equal(milano.image,'assets/milano-photo-quality-20261014.webp');
assert.equal(milano.originalImage,'assets/milano-photo-original-20261014.png');
const reddishBrown=findProduct('artek-improved','dark-red');
assert.deepEqual(reddishBrown.colorName,{uz:'Qizg‘ish jigarrang',ru:'Красно-коричневая',en:'Reddish brown'});
assert.equal(findProduct('atlas-pf115','dark-red').colorName.ru,'Бордовый');
for(const product of products.filter(p=>p.colorName))for(const lang of ['uz','ru','en'])assert.ok(product.title[lang].includes(product.colorName[lang]),`${product.id}: colour missing from card title`);
for(const id of ['berlak-primer-5kg','atlas-primer','delta-primer'])assert.doesNotMatch(JSON.stringify(findProduct(id).title),/\d[,.]?\d*\s*(?:kg|кг)/,'Multi-size product title advertises only one weight');
const html=await readFile(new URL('../element_paint_web/preview.html',import.meta.url),'utf8');
assert.match(html,/noindex,nofollow/);
assert.match(html,/<strong id="brandCount">9<\/strong>/);
assert.match(html,/<strong id="assortmentCount">100<span>\+<\/span><\/strong>/);
assert.match(html,/preview-app\.js\?v=20261014\.1/);
const previewApp=await readFile(new URL('../element_paint_web/preview-app.js',import.meta.url),'utf8');
assert.doesNotMatch(previewApp,/if\(location\.hash&&location\.hash!=='#home'\)return/,'Direct #catalog visits must still show the loading animation');
assert.match(previewApp,/elementpaint-customer-preview-20261014\.1/,'New preview build must not inherit a previous session dismissal');
for(const key of [...html.matchAll(/data-i18n(?:-aria|-placeholder)?="([^"]+)"/g)].map(m=>m[1]))assert.ok(strings.uz[key],`Unknown template translation: ${key}`);
assert.doesNotMatch(JSON.stringify({products,categories}),/krata/i);
console.log(`PASS: ${products.length} cards: 72 exact PDF entries plus BERLAK MILANO; 34 separate colour cards; source images and weights, old colour links, 100+ headline and UZ/RU/EN verified.`);
