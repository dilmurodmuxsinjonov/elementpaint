// White framing preserves the latest customer-supplied image and its lettering.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const sharp=require(process.env.ELEMENTPAINT_SHARP||'C:/Users/dilmu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('element_paint_web/assets/milano-photo-original-20261014.png',root));
const outline='M600 55 C824 52 1052 77 1123 117 C1139 138 1139 173 1144 193 L1151 241 C1151 286 1148 309 1127 330 L1095 367 L1067 770 L1042 920 C1031 1024 978 1103 860 1149 C775 1189 647 1208 553 1201 C409 1194 254 1145 209 1095 C179 1067 167 1027 163 993 L123 676 L112 438 L106 333 C79 320 67 305 65 282 L65 220 C68 187 76 164 81 135 C98 98 300 55 600 55 Z';
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1500" viewBox="0 0 1254 1254"><defs><clipPath id="pail"><path d="${outline}"/></clipPath><radialGradient id="shadow"><stop stop-opacity=".17"/><stop offset="1" stop-opacity="0"/></radialGradient></defs><rect width="1254" height="1254" fill="#fff"/><ellipse cx="627" cy="1129" rx="465" ry="42" fill="url(#shadow)"/><g transform="translate(97,60) scale(.884)" clip-path="url(#pail)"><image width="1199" height="1312" href="data:image/png;base64,${source.toString('base64')}"/></g></svg>`;
const pngPath=new URL('output/imagegen/milano-photo-quality-20261014.png',root);
await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(pngPath));
const webpPath=new URL('element_paint_web/assets/milano-photo-quality-20261014.webp',root);
await sharp(fileURLToPath(pngPath)).webp({lossless:true}).toFile(fileURLToPath(webpPath));
const labelFixture=JSON.parse(await readFile(new URL('tests/fixtures/milano-label-2026.json',root),'utf8'));
const manifest={sourceSha256:createHash('sha256').update(source).digest('hex'),sourceDimensions:[1199,1312],displaySha256:createHash('sha256').update(await readFile(webpPath)).digest('hex'),displayDimensions:[1500,1500],labelPdfSha256:labelFixture.sourcePdfSha256,method:'Latest high-quality image supplied by customer; white vector framing, no exposure/colour changes, regenerated lettering or package artwork; lossless WebP. Source retained byte-for-byte.'};
await writeFile(new URL('tests/fixtures/milano-photo-20261014.json',root),JSON.stringify(manifest,null,2)+'\n');
console.log('MILANO: 1500 x 1500 white-background product image; exact original photograph retained.');
