import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile(new URL('./fixtures/catalog-image-originals.json',import.meta.url),'utf8'));
assert.equal(manifest.images.length,72);
for(const original of manifest.images){
  const bytes=await readFile(new URL(`../element_paint_web/${original.file}`,import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),original.sha256,`Original package artwork changed: ${original.file}`);
  assert.equal(bytes.readUInt32BE(16),original.width);
  assert.equal(bytes.readUInt32BE(20),original.height);
}
console.log('PASS: all 72 package images match the original PDF extraction byte-for-byte, with native dimensions and untouched labels.');
