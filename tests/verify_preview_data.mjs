import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';

globalThis.window = {};
const { products, categories, legacyIds, strings, findProduct } = await import('../element_paint_web/catalog-data.js');
assert.equal(legacyIds.length,20,'Unexpected source catalog: audit the migration');
assert.equal(categories.filter(c=>c.core).length,10);
assert.equal(products.length,45);
assert.equal(products.reduce((total,p)=>total+p.variants.length,0),34);
assert.equal(new Set(products.map(p=>p.id)).size,products.length);
for(const id of legacyIds)assert.ok(findProduct(id),`Previous product lost: ${id}`);
for(const [oldId,variant] of [['atlas-blue','blue'],['atlas-yellow','yellow'],['atlas-brown','brown']]){
  const product=findProduct(oldId);assert.equal(product.id,'atlas-pf115');assert.ok(product.variants.some(v=>v.id===variant));
}
assert.notEqual(findProduct('artek-facade-black'),findProduct('artek-facade-white'));
const keys=Object.keys(strings.uz).sort();
for(const lang of ['uz','ru','en']){
  assert.deepEqual(Object.keys(strings[lang]).sort(),keys,`${lang} interface translation missing`);
  for(const product of products){assert.ok(product.title?.[lang],`${product.id} title missing: ${lang}`);assert.ok(product.description?.[lang],`${product.id} description missing: ${lang}`);for(const v of product.variants)assert.ok(v.name[lang]);}
  for(const category of categories)assert.ok(category.name[lang]);
}
for(const product of products){assert.ok(categories.some(c=>c.id===product.categoryId));for(const image of [product.image,...product.variants.map(v=>v.image)]){assert.ok(image,`Missing product photo: ${product.id}`);await access(new URL(`../element_paint_web/${image}`,import.meta.url));}}
// Independent source fixture: weights extracted from the PDF's printed kg rows,
// with image-to-product assignments checked visually against package labels.
const fixture=JSON.parse(await readFile(new URL('./fixtures/catalog-2026.json',import.meta.url),'utf8'));
assert.equal(fixture.packages.length,72);
assert.equal(new Set(fixture.packages.map(row=>row.imageNumber)).size,72);
const approvedIds=new Set([...fixture.packages.map(row=>row.productId),...Object.keys(fixture.existingApproved)]);
assert.deepEqual([...new Set(products.map(p=>p.id))].sort(),[...approvedIds].sort(),'Unapproved product added or approved product missing');
for(const row of fixture.packages){
  const product=findProduct(row.productId);
  const target=row.variantId?product.variants.find(v=>v.id===row.variantId):product;
  assert.ok(target,`PDF package ${row.imageNumber}: missing ${row.productId}/${row.variantId||''}`);
  assert.equal(target.image,`assets/catalog-2026/product-${String(row.imageNumber).padStart(3,'0')}.webp`,`Wrong PDF image for ${row.productId}/${row.variantId||''}`);
  assert.deepEqual(target.packages,row.packagesKg,`Wrong PDF weight for ${row.productId}/${row.variantId||''}`);
}
const images=await readdir(new URL('../element_paint_web/assets/catalog-2026/',import.meta.url));
assert.equal(images.filter(name=>/^product-\d{3}\.webp$/.test(name)).length,72);
for(const [id,packages] of Object.entries(fixture.existingApproved))assert.deepEqual(findProduct(id).packages,packages,`Unverified weight added to ${id}`);
const expectedVariants=fixture.packages.filter(row=>row.variantId).map(row=>`${row.productId}/${row.variantId}`).sort();
assert.deepEqual(products.flatMap(p=>p.variants.map(v=>`${p.id}/${v.id}`)).sort(),expectedVariants,'Unapproved colour added or catalog colour missing');
const reddishBrown=findProduct('artek-improved').variants.find(v=>v.id==='dark-red');
assert.deepEqual(reddishBrown.name,{uz:'Qizg‘ish pol',ru:'Красно-коричневая',en:'Reddish brown'});
assert.equal(findProduct('atlas-pf115').variants.find(v=>v.id==='dark-red').name.ru,'Бордовый');
for(const id of ['berlak-primer-5kg','atlas-primer','delta-primer'])assert.doesNotMatch(JSON.stringify(findProduct(id).title),/\d[,.]?\d*\s*(?:kg|кг)/,'Multi-size product title advertises only one weight');
const html=await readFile(new URL('../element_paint_web/preview.html',import.meta.url),'utf8');
assert.match(html,/noindex,nofollow/);
assert.match(html,/<strong id="brandCount">10<\/strong>/);
for(const key of [...html.matchAll(/data-i18n(?:-aria|-placeholder)?="([^"]+)"/g)].map(m=>m[1]))assert.ok(strings.uz[key],`Unknown template translation: ${key}`);
assert.doesNotMatch(JSON.stringify({products,categories}),/krata/i);
console.log(`PASS: ${products.length} approved cards, 34 colours, 72 PDF packages and weights; ${legacyIds.length} legacy links preserved; UZ/RU/EN complete; excluded brand absent.`);
