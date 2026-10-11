import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const {products}=await import('../element_paint_web/catalog-data.js');
const framed=products.filter(product=>product.originalImage);
assert.equal(framed.length,4);
for(const product of framed){
  const svg=await readFile(new URL(`../element_paint_web/${product.image}`,import.meta.url),'utf8');
  const embedded=Buffer.from(svg.match(/href="data:image\/(?:jpeg|webp);base64,([^"]+)"/)[1],'base64');
  assert.deepEqual(embedded,await readFile(new URL(`../element_paint_web/${product.originalImage}`,import.meta.url)),`${product.id}: label photograph changed`);
  assert.match(svg,/<rect width="1254" height="1254" fill="#fff"\/>/);
  assert.match(svg,/clip-path="url\(#package\)"/);
}
console.log('PASS: four white vector frames embed the exact approved photograph bytes; labels are not regenerated or re-encoded.');
