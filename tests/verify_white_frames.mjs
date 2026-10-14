import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {products}=await import('../element_paint_web/catalog-data.js');
// Preserve the original white frames as archived assets after the 72 + 1 scope change.
for(const [frame,original] of [['nitro_lak_studio-white.svg','nitro_lak_studio.jpg'],['element_plaster_studio-white.svg','element_plaster_studio.jpg'],['glatt_studio-white.svg','glatt_studio.jpg'],['milano_decorative_coating_v2-white.svg','milano_decorative_coating_v2.webp']]){
  const svg=await readFile(new URL(`../element_paint_web/assets/${frame}`,import.meta.url),'utf8');
  const embedded=Buffer.from(svg.match(/href="data:image\/(?:jpeg|webp);base64,([^"]+)"/)[1],'base64');
  assert.deepEqual(embedded,await readFile(new URL(`../element_paint_web/assets/${original}`,import.meta.url)),`${frame}: label photograph changed`);
  assert.match(svg,/<rect width="1254" height="1254" fill="#fff"\/>/);
  assert.match(svg,/clip-path="url\(#package\)"/);
}
const milano=products.find(p=>p.id==='milano-decorative');
const original=await readFile(new URL(`../element_paint_web/${milano.originalImage}`,import.meta.url));
const display=await readFile(new URL(`../element_paint_web/${milano.image}`,import.meta.url));
const manifest=JSON.parse(await readFile(new URL('./fixtures/milano-photo-20261014.json',import.meta.url),'utf8'));
assert.equal(createHash('sha256').update(original).digest('hex'),'de985737e87e7cc29b845ef5c5a7f86af0486212ff3d1ee339d13be26ae5bb20','Keep the latest customer image byte-for-byte intact');
assert.equal(createHash('sha256').update(display).digest('hex'),manifest.displaySha256);
assert.deepEqual([original.readUInt32BE(16),original.readUInt32BE(20)],manifest.sourceDimensions);
console.log('PASS: original white frames are intact; MILANO uses the latest clear image and links the exact original 1199 × 1312 customer image.');
