// DOM integration against a real disposable local backend; no browser automation.
import assert from 'node:assert/strict';
import {readFile,mkdtemp} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import path from 'node:path';
const require=createRequire(import.meta.url),{JSDOM}=require('../tmp/dom-check/node_modules/jsdom/lib/api.js');
const root=fileURLToPath(new URL('../',import.meta.url));
const directory=await mkdtemp(path.join(root,'tmp','admin-dom-'));
const python=process.env.ELEMENTPAINT_PYTHON||'C:/Users/dilmu/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const service=spawn(python,['-m','admin.server','--port','0','--data-dir',directory],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});
let dom;
try{
  const origin=await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(Error('Backend startup timed out')),15000);
    service.once('error',reject);service.once('exit',code=>{if(code)reject(Error('Backend exited '+code));});
    service.stdout.on('data',chunk=>{const match=chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);resolve(match[0]);}});
  });
  const cookies=new Map(),nativeFetch=globalThis.fetch;
  const http=async(url,options={})=>{
    const response=await nativeFetch(new URL(url,origin),{...options,headers:{...options.headers,Origin:origin,Cookie:[...cookies].map(([k,v])=>k+'='+v).join('; ')}});
    for(const cookie of response.headers.getSetCookie()){const [key,...value]=cookie.split(';')[0].split('=');cookies.set(key,value.join('='));}
    return response;
  };
  const html=await readFile(new URL('../admin/web/index.html',import.meta.url),'utf8');
  dom=new JSDOM(html,{url:origin+'/admin/',pretendToBeVisual:true});
  const {window}=dom;
  for(const key of ['window','document','Option','FormData','FileReader','Blob'])globalThis[key]=key==='window'?window:window[key];
  globalThis.fetch=http;
  window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  window.HTMLDialogElement.prototype.close=function(){this.open=false;};
  const $=id=>document.getElementById(id);
  const wait=async check=>{const start=Date.now();while(!check()){if(Date.now()-start>8000)throw Error('UI wait timeout: '+check);await new Promise(r=>setTimeout(r,15));}};
  const submit=form=>form.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
  const clickView=view=>document.querySelector('#nav [data-view='+view+']').click();
  await import('../admin/web/admin.js');
  await wait(()=>$('authTitle').textContent==='Admin akkauntini yarating');
  assert.equal($('auth').hidden,false);
  $('authForm').elements.name.value='DOM test owner';$('authForm').elements.username.value='domowner';$('authForm').elements.password.value='Disposable-test-password-124';
  submit($('authForm'));await wait(()=>!$('app').hidden&&document.querySelectorAll('#productRows tr').length===73);
  assert.equal($('navProducts').textContent,'73');
  $('addProduct').click();assert.equal($('editor').open,true);
  const form=$('productForm');
  form.elements.title_uz.value='Sinov mahsuloti';form.elements.description_uz.value='Aniq mahsulot tavsifi';
  form.elements.brandId.value=form.elements.brandId.options[1].value;form.elements.categoryId.value=form.elements.categoryId.options[1].value;
  form.elements.packages.value='1; 2,5; 25';form.elements.packageUnit.value='l';form.elements.status.value='draft';form.elements.sku.value='DOM-TEST';
  submit(form);await wait(()=>!$('editor').open);
  assert.equal($('navProducts').textContent,'74');
  const productRow=()=>[...document.querySelectorAll('#productRows tr')].find(r=>r.textContent.includes('DOM-TEST'));
  assert.ok(productRow());assert.match(productRow().textContent,/1 \/ 2.5 \/ 25 l/);
  productRow().querySelector('button').click();
  form.elements.title_uz.value='Sinov <img src=x onerror=alert(1)>';
  document.querySelector('#languageTabs [data-lang=en]').click();assert.equal(document.querySelector('[data-translation=en]').hidden,false);
  form.elements.title_en.value='Test paint';form.elements.description_en.value='Test description';
  submit(form);await wait(()=>!$('editor').open);
  assert.equal(productRow().querySelectorAll('.product-cell img').length,0);
  assert.ok(productRow().textContent.includes('<img src=x'));
  // Trash through the actual UI; confirmation is required.
  [...productRow().querySelectorAll('button')].find(b=>b.textContent==='Savatga').click();
  await wait(()=>$('smallDialog').open);submit($('smallBody').querySelector('form'));
  await wait(()=>$('navTrash').textContent==='1');
  assert.equal($('navProducts').textContent,'73');
  clickView('trash');await wait(()=>$('viewTitle').textContent==='Savat');
  assert.ok(productRow());assert.equal($('trashNote').hidden,false);
  [...productRow().querySelectorAll('button')].find(b=>b.textContent==='Tiklash').click();
  await wait(()=>$('navTrash').textContent==='0');
  clickView('products');await wait(()=>!!productRow());assert.equal($('navProducts').textContent,'74');
  // Previous edited state can be restored through the revision UI.
  productRow().querySelector('button').click();$('showHistory').click();
  await wait(()=>$('smallDialog').open&&document.querySelectorAll('.history-row').length===1);
  document.querySelector('.history-row button').click();await wait(()=>!$('editor').open&&!$('smallDialog').open);
  assert.ok(productRow().textContent.includes('Sinov mahsuloti'));
  // Permanent deletion accepts a normal keyboard apostrophe, only inside trash.
  [...productRow().querySelectorAll('button')].find(b=>b.textContent==='Savatga').click();
  await wait(()=>$('smallDialog').open);submit($('smallBody').querySelector('form'));await wait(()=>$('navTrash').textContent==='1');
  clickView('trash');await wait(()=>!!productRow());
  [...productRow().querySelectorAll('button')].find(b=>b.textContent==='Butunlay o‘chirish').click();await wait(()=>$('smallDialog').open);
  $('smallBody').querySelector('input').value="O'CHIRISH";submit($('smallBody').querySelector('form'));
  await wait(()=>$('navTrash').textContent==='0');
  clickView('categories');await wait(()=>document.querySelectorAll('.dictionary-card').length===13);
  clickView('media');await wait(()=>document.querySelectorAll('#mediaGrid .media-item').length>70);
  clickView('audit');await wait(()=>document.querySelectorAll('#auditRows tr').length>0);
  clickView('settings');await wait(()=>$('trashDays').value==='30');
  $('logout').click();await wait(()=>!$('auth').hidden);assert.equal($('app').hidden,true);
  console.log('PASS: actual backend + admin DOM: setup/login, 73 seeded items, add/edit translations and litres, safe text, trash/restore, revision restore, confirmed purge, dictionaries/media/audit/settings/logout.');
}finally{
  await new Promise(r=>setTimeout(r,150));dom?.window.close();service.kill();await once(service,'exit').catch(()=>{});
}
