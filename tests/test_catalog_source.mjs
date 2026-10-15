import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {validateSnapshot,packageUnit} from '../element_paint_web/catalog-source.js';
const snapshot=JSON.parse(await readFile(new URL('../element_paint_web/catalog-snapshot.json',import.meta.url),'utf8'));
assert.equal(validateSnapshot(snapshot).products.length,73);
assert.throws(()=>validateSnapshot({...snapshot,products:[{...snapshot.products[0],image:'javascript:alert(1)'}]}));
assert.throws(()=>validateSnapshot({...snapshot,products:[{...snapshot.products[0],categoryId:'missing'}]}));
assert.throws(()=>validateSnapshot({...snapshot,products:[snapshot.products[0],snapshot.products[0]]}));
assert.equal(packageUnit({packageUnit:'l'},'ru'),'л');
const require=createRequire(import.meta.url),{JSDOM}=require('../tmp/dom-check/node_modules/jsdom/lib/api.js');
const mode=process.env.CATALOG_TEST_EMPTY==='1';
const data={...snapshot,products:mode?[]:[{...snapshot.products[0],title:{uz:'Admindan kelgan nom',ru:'Из админки',en:'From admin'},packageUnit:'l',packages:[2.5]}]};
const html=await readFile(new URL('../element_paint_web/preview.html',import.meta.url),'utf8');
const dom=new JSDOM(html,{url:'https://local.example/?lang=uz#catalog',pretendToBeVisual:true}),{window}=dom;
for(const key of ['window','document','location','history','localStorage','sessionStorage','Option'])globalThis[key]=key==='window'?window:window[key];
window.fetch=async()=>({ok:true,json:async()=>data});
globalThis.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
globalThis.ResizeObserver=class{observe(){}disconnect(){}};
window.HTMLElement.prototype.scrollTo=function(){};
window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};window.HTMLDialogElement.prototype.close=function(){this.open=false;};
await import('../element_paint_web/preview-app.js');
const $=id=>document.getElementById(id);
assert.equal(document.querySelectorAll('.product-card').length,mode?0:1);
if(mode){assert.equal($('featuredDetail').disabled,true);assert.equal($('emptyState').hidden,false);$('featuredNext').click();document.querySelector('[data-lang=ru]').click();assert.equal($('featuredCounter').textContent,'00 / 00');}
else{assert.equal(document.querySelector('.product-card h3').textContent,'Admindan kelgan nom');assert.match($('featuredPackages').textContent,/2,5 l|2.5 l/);document.querySelector('.product-open').click();assert.match($('packageInfo').textContent,/2,5 l|2.5 l/);}
dom.window.close();console.log('PASS: snapshot validation and '+(mode?'empty published catalogue':'admin catalogue replaces bundled data, including units')+'.');
