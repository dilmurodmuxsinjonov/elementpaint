import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

globalThis.window = {};
const { products, categories, legacyIds, strings, findProduct } = await import('../element_paint_web/catalog-data.js');
assert.equal(legacyIds.length,20,'Unexpected source catalog: audit the migration');
assert.equal(categories.filter(c=>c.core).length,10);
assert.equal(products.length,23);
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
const atlas=findProduct('atlas-pf115');assert.equal(atlas.variants.find(v=>v.id==='white').packageKg,3);assert.equal(atlas.variants.find(v=>v.id==='blue').packageKg,2.7);
const html=await readFile(new URL('../element_paint_web/preview.html',import.meta.url),'utf8');
assert.match(html,/noindex,nofollow/);
for(const key of [...html.matchAll(/data-i18n(?:-aria|-placeholder)?="([^"]+)"/g)].map(m=>m[1]))assert.ok(strings.uz[key],`Unknown template translation: ${key}`);
assert.doesNotMatch(JSON.stringify({products,categories}),/krata/i);
console.log(`PASS: ${legacyIds.length} old records preserved; ${products.length} product families; 10 core categories; UZ/RU/EN complete; original asset references exist; excluded brand absent.`);
