// Run after node tools/build_milano_photo.mjs; inspect the produced native matte.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const sharp=require(process.env.ELEMENTPAINT_SHARP||'C:/Users/dilmu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const original=await sharp(fileURLToPath(new URL('../element_paint_web/assets/milano-photo-original-20261014.png',import.meta.url))).raw().toBuffer({resolveWithObject:true});
const cutout=await sharp(fileURLToPath(new URL('../output/imagegen/milano-transparent-20261015.png',import.meta.url))).raw().toBuffer({resolveWithObject:true});
assert.deepEqual([cutout.info.width,cutout.info.height,cutout.info.channels],[1199,1312,4]);
const pixel=(x,y)=>cutout.data.subarray((y*1199+x)*4,(y*1199+x)*4+4);
for(const [x,y] of [[0,0],[1198,0],[0,1311],[1198,1311],[1130,320],[119,500]])assert.equal(pixel(x,y)[3],0,'Outside background must be transparent');
// The old hand-drawn top contour cut into the actual rim here.
assert.ok(pixel(600,54)[3]>150,'Restore the top rim instead of trimming it flat');
assert.ok(pixel(65,230)[3]>150,'Keep the complete left lid edge');
assert.equal(pixel(1050,700)[3],255,'Keep the actual right side');
assert.equal(pixel(600,1197)[3],255,'Keep the bottom rim');
let checked=0;
for(let y=420;y<=1050;y++)for(let x=300;x<=930;x++){
  const p=pixel(x,y),i=(y*1199+x)*3;
  assert.equal(p[3],255,'Printed label must remain fully opaque');
  for(let c=0;c<3;c++)assert.equal(p[c],original.data[i+c],'Printed label pixels must not be regenerated or recoloured');
  checked++;
}
console.log(`PASS: complete lid/sides/base, transparent outside, and ${checked} label pixels retain their exact source RGB values.`);
