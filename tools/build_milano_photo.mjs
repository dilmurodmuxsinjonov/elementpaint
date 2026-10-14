// White framing preserves the latest customer-supplied image and its lettering.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {cutoutMilanoBackground} from './milano-cutout.mjs';
const require=createRequire(import.meta.url);
const sharp=require(process.env.ELEMENTPAINT_SHARP||'C:/Users/dilmu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('element_paint_web/assets/milano-photo-original-20261014.png',root));
const {data,info}=await sharp(source).raw().toBuffer({resolveWithObject:true});
const {rgba,removedPixels}=cutoutMilanoBackground(data,info);
const alpha=Buffer.alloc(info.width*info.height);
for(let i=0;i<alpha.length;i++)alpha[i]=rgba[i*4+3];
// Remove single-pixel background specks and antialias only the outer edge.
// The original RGB content, especially the logo and fine lettering, is untouched.
const softAlpha=await sharp(alpha,{raw:{width:info.width,height:info.height,channels:1}}).median(3).blur(.65).toColourspace('b-w').raw().toBuffer();
if(softAlpha.length!==alpha.length)throw new Error('Unexpected matte dimensions');
for(let i=0;i<alpha.length;i++)rgba[i*4+3]=softAlpha[i];
const cutout=await sharp(rgba,{raw:{width:info.width,height:info.height,channels:4}}).png().toBuffer();
await writeFile(new URL('output/imagegen/milano-transparent-20261015.png',root),cutout);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1500" viewBox="0 0 1254 1254"><defs><radialGradient id="shadow"><stop stop-opacity=".17"/><stop offset="1" stop-opacity="0"/></radialGradient></defs><rect width="1254" height="1254" fill="#fff"/><ellipse cx="627" cy="1129" rx="465" ry="42" fill="url(#shadow)"/><g transform="translate(97,60) scale(.884)"><image width="1199" height="1312" href="data:image/png;base64,${cutout.toString('base64')}"/></g></svg>`;
const pngPath=new URL('output/imagegen/milano-photo-quality-20261015.png',root);
await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(pngPath));
const webpPath=new URL('element_paint_web/assets/milano-photo-quality-20261015.webp',root);
await sharp(fileURLToPath(pngPath)).webp({lossless:true}).toFile(fileURLToPath(webpPath));
const labelFixture=JSON.parse(await readFile(new URL('tests/fixtures/milano-label-2026.json',root),'utf8'));
const manifest={sourceSha256:createHash('sha256').update(source).digest('hex'),sourceDimensions:[1199,1312],displaySha256:createHash('sha256').update(await readFile(webpPath)).digest('hex'),displayDimensions:[1500,1500],labelPdfSha256:labelFixture.sourcePdfSha256,removedBackgroundPixels:removedPixels,method:'Source-boundary cutout: remove near-black pixels connected to the outside; median-3 and sigma-0.65 feathering on alpha only. Preserve all source RGB values and enclosed lettering. No hand-drawn clipping or colour changes. Lossless WebP; original source retained byte-for-byte.'};
await writeFile(new URL('tests/fixtures/milano-photo-20261015.json',root),JSON.stringify(manifest,null,2)+'\n');
console.log('MILANO: 1500 x 1500 white-background product image; exact original photograph retained.');
