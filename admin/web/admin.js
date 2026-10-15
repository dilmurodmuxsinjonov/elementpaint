const $=id=>document.getElementById(id);
const state={csrf:'',user:null,setup:false,data:null,view:'products',selected:new Set(),visible:[],editing:null,media:[]};
const labels={published:'Saytda ko‘rinadi',draft:'Qoralama',hidden:'Yashirilgan'};
const titles={products:'Mahsulotlar',trash:'Savat',categories:'Katalog bo‘limlari',brands:'Brendlar',media:'Rasmlar kutubxonasi',audit:'Amallar tarixi',settings:'Sozlamalar va zaxira'};
const actions={create:'Mahsulot qo‘shildi',edit:'Mahsulot tahrirlandi',trash:'Savatga ko‘chirildi',restore:'Savatdan tiklandi',purge:'Butunlay o‘chirildi',published:'Saytga chiqarildi',draft:'Qoralamaga o‘tkazildi',hidden:'Yashirildi',upload:'Rasm yuklandi',login:'Tizimga kirildi','login-failed':'Kirish muvaffaqiyatsiz','restore-version':'Oldingi holat tiklandi',import:'Katalog import qilindi',settings:'Sozlamalar yangilandi',password:'Parol almashtirildi','post-brands':'Brend qo‘shildi','patch-brands':'Brend yangilandi','delete-brands':'Brend o‘chirildi','post-categories':'Bo‘lim qo‘shildi','patch-categories':'Bo‘lim yangilandi','delete-categories':'Bo‘lim o‘chirildi'};
const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;};
const button=(title,run,cls='')=>{const n=el('button',cls,title);n.type='button';n.addEventListener('click',()=>attempt(run,n));return n;};
const option=(value,label)=>new Option(label,value);
const date=value=>value?new Date(value).toLocaleString('uz-Latn-UZ',{dateStyle:'medium',timeStyle:'short'}):'';
const normal=value=>String(value).toLocaleLowerCase().normalize('NFKC').replace(/[\p{P}\s]+/gu,'');
let toastTimer;
function toast(message,error=false){window.clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.toggle('error',error);$('toast').hidden=false;toastTimer=window.setTimeout(()=>$('toast').hidden=true,error?9000:5000);}
async function attempt(run,control){if(control)control.disabled=true;try{return await run();}catch(error){toast(error.message,true);}finally{if(control)control.disabled=false;}}
async function api(path,method='GET',data){
  const response=await fetch(path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':state.csrf},...(data===undefined?{}:{body:JSON.stringify(data)})});
  const result=await response.json();
  if(!response.ok){if(response.status===401&&path.startsWith('/api/admin'))await session();throw new Error(result.error||'So‘rov bajarilmadi.');}
  return result;
}
async function session(){
  const data=await api('/api/session');state.csrf=data.csrf;state.user=data.user;state.setup=data.setupRequired;
  $('auth').hidden=!!state.user;$('app').hidden=!state.user;
  if(state.user){$('userName').textContent=state.user.name;await reload();}
  else{$('nameLabel').hidden=!state.setup;$('authForm').elements.name.required=state.setup;$('authTitle').textContent=state.setup?'Admin akkauntini yarating':'Xush kelibsiz';
    $('authCopy').textContent=state.setup?'Birinchi kirish uchun o‘z login va parolingizni belgilang. Parol kamida 12 ta belgidan iborat bo‘lsin.':'Katalogni boshqarish uchun akkauntingizga kiring.';
    $('authForm').elements.password.minLength=state.setup?12:1;$('authForm').elements.password.autocomplete=state.setup?'new-password':'current-password';$('authSubmit').textContent=state.setup?'Akkaunt yaratish':'Kirish';}
}
async function reload(){
  state.data=await api('/api/admin/catalog');state.selected.clear();
  const products=state.data.products,active=products.filter(p=>!p.deletedAt),trash=products.filter(p=>p.deletedAt);
  $('navProducts').textContent=active.length;$('navTrash').textContent=trash.length;
  $('metrics').replaceChildren(...[[active.length,'Faol mahsulot'],[active.filter(p=>p.status==='published').length,'Saytda ko‘rinadi'],[active.filter(p=>p.status==='draft').length,'Qoralama'],[trash.length,'Savatda saqlanmoqda']].map(([count,label])=>{const n=el('div','glass metric');n.append(el('strong','',count),el('span','',label));return n;}));
  populateFilters();await renderView();
}
function populateFilters(){
  for(const [id,rows,label] of [['categoryFilter',state.data.categories,'Barcha bo‘limlar'],['brandFilter',state.data.brands,'Barcha brendlar']]){
    const selected=$(id).value;$(id).replaceChildren(option('all',label),...rows.map(row=>option(row.id,typeof row.name==='string'?row.name:row.name.uz)));$(id).value=[...$(id).options].some(o=>o.value===selected)?selected:'all';
  }
}
async function renderView(){
  const view=state.view;$('viewTitle').textContent=titles[view];
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  for(const [id,shown] of Object.entries({productSection:['products','trash'].includes(view),dictionarySection:['brands','categories'].includes(view),mediaSection:view==='media',auditSection:view==='audit',settingsSection:view==='settings'}))$(id).hidden=!shown;
  if(['products','trash'].includes(view))renderProducts();
  else if(['brands','categories'].includes(view))renderDictionary();
  else if(view==='media'){state.media=(await api('/api/admin/media')).media;renderMedia($('mediaGrid'),false);}
  else if(view==='audit'){
    const {entries}=await api('/api/admin/audit');
    $('auditRows').replaceChildren(...entries.map(row=>{const tr=el('tr');for(const value of [date(row.at),row.actor,actions[row.action]||row.action,row.detail||row.entity])tr.append(el('td','',value));return tr;}));
  }else if(view==='settings')$('trashDays').value=state.data.settings.trashDays;
}
function renderProducts(){
  const trash=state.view==='trash',query=normal($('search').value);
  $('addProduct').hidden=trash;$('statusFilterLabel').hidden=trash;$('trashNote').hidden=!trash;
  $('trashNote').textContent='Mahsulotlar rasmlari, ranglari va qadoq ma’lumotlari bilan saqlanadi. Yangi o‘chiriladigan mahsulotlar uchun muddat: '+state.data.settings.trashDays+' kun. Muddat tugagach ham tiklash mumkin; avtomatik butunlay o‘chirish yo‘q.';
  $('stateHeading').textContent=trash?'O‘chirilgan / muddat':'Holat / qadoq';
  const choice=$('bulkAction').value;
  $('bulkAction').replaceChildren(...(trash?[['restore','Qayta tiklash'],['purge','Butunlay o‘chirish']]:[['trash','Savatga ko‘chirish'],['published','Saytga chiqarish'],['draft','Qoralama qilish'],['hidden','Yashirish']]).map(([v,l])=>option(v,l)));
  if([...$('bulkAction').options].some(o=>o.value===choice))$('bulkAction').value=choice;
  const rows=state.data.products.filter(p=>!!p.deletedAt===trash&&($('categoryFilter').value==='all'||p.categoryId===$('categoryFilter').value)&&($('brandFilter').value==='all'||p.brandId===$('brandFilter').value)&&(trash||$('statusFilter').value==='all'||p.status===$('statusFilter').value)&&normal([p.brand,p.sku,...Object.values(p.title)].join(' ')).includes(query));
  state.visible=rows;const ids=new Set(rows.map(p=>p.id));state.selected=new Set([...state.selected].filter(id=>ids.has(id)));
  $('resultCount').textContent=rows.length+' ta mahsulot';$('listEmpty').hidden=rows.length>0;
  $('productRows').replaceChildren(...rows.map(p=>{
    const tr=el('tr');tr.dataset.id=p.id;
    const selectCell=el('td'),check=el('input');check.type='checkbox';check.checked=state.selected.has(p.id);check.setAttribute('aria-label',p.title.uz+'ni tanlash');check.addEventListener('change',()=>{check.checked?state.selected.add(p.id):state.selected.delete(p.id);updateSelection();});selectCell.append(check);
    const productCell=el('td'),wrap=el('div','product-cell');if(p.image){const img=el('img','product-thumb');img.src='/'+p.image;img.alt=p.title.uz;img.loading='lazy';wrap.append(img);}
    const name=el('div');name.append(el('strong','',p.title.uz),el('small','',p.sku||p.id));wrap.append(name);productCell.append(wrap);
    const categoryCell=el('td','',state.data.categories.find(c=>c.id===p.categoryId)?.name.uz||'');categoryCell.append(el('span','cell-secondary',p.brand));
    const status=el('td');
    if(trash){status.append(el('span','badge trash','Savatda'),el('span','cell-secondary',date(p.deletedAt)),el('span','cell-secondary','Muddat: '+date(p.trashUntil)));}
    else{status.append(el('span','badge '+p.status,labels[p.status]),el('span','cell-secondary',p.packages.length?p.packages.join(' / ')+' '+(p.packageUnit==='pcs'?'dona':p.packageUnit):'Qadoq ko‘rsatilmagan'));}
    const controls=el('td'),row=el('div','table-actions');
    if(trash)row.append(button('Tiklash',()=>bulk('restore',[p])),button('Butunlay o‘chirish',()=>bulk('purge',[p]),'danger'));
    else row.append(button('Tahrirlash',()=>editProduct(p)),button('Nusxa',async()=>{const result=await api('/api/admin/products/'+p.id+'/duplicate','POST',{});await reload();editProduct(result.product);toast('Nusxa qoralama sifatida yaratildi.');}),button('Savatga',()=>bulk('trash',[p]),'quiet'));
    controls.append(row);tr.append(selectCell,productCell,categoryCell,status,controls);return tr;
  }));updateSelection();
}
function updateSelection(){const size=state.selected.size;$('selectedCount').textContent=size?size+' ta tanlandi':'';$('applyBulk').disabled=!size;$('selectAll').checked=!!size&&size===state.visible.length;$('selectAll').indeterminate=size>0&&size<state.visible.length;}
function showSmall(title,...children){$('smallTitle').textContent=title;$('smallBody').replaceChildren(...children);if(!$('smallDialog').open)$('smallDialog').showModal();}
async function bulk(action,products){
  if(!products.length)return;
  const count=products.length;
  const execute=async confirm=>{await api('/api/admin/products/bulk','POST',{items:products.map(({id,revision})=>({id,revision})),action,confirm});$('smallDialog').close();await reload();toast(count+' ta mahsulot: '+({trash:'savatga ko‘chirildi',restore:'tiklandi',purge:'butunlay o‘chirildi',...labels}[action]||action)+'.');};
  if(action==='restore')return execute('');
  const form=el('form','dialog-form'),copy=el('p','muted');
  copy.textContent=action==='purge'?count+' ta mahsulotni butunlay o‘chirish qaytarib bo‘lmaydigan amal. Avval bazaning zaxira nusxasi yaratiladi. Tasdiqlash uchun O‘CHIRISH deb yozing.':action==='trash'?count+' ta mahsulot savatga ko‘chiriladi va saytdan olib tashlanadi. Keyin barcha ma’lumotlari bilan qayta tiklashingiz mumkin.':count+' ta mahsulotning holati “'+labels[action]+'” bo‘ladi.';
  form.append(copy);let input;
  if(action==='purge'){const label=el('label','','Tasdiqlash');input=el('input');input.required=true;input.autocomplete='off';input.placeholder='O‘CHIRISH';label.append(input);form.append(label);}
  const row=el('div','row');row.append(button('Bekor qilish',()=>$('smallDialog').close()));const submit=el('button',action==='purge'?'danger':'primary',action==='purge'?'Butunlay o‘chirish':'Tasdiqlash');submit.type='submit';row.append(submit);form.append(row);
  form.addEventListener('submit',e=>{e.preventDefault();attempt(async()=>{let confirm=input?.value.trim().toLocaleUpperCase().replace(/['’ʻʼ]/g,'‘')||'';await execute(confirm);},submit);});
  showSmall(action==='purge'?'Butunlay o‘chirish':action==='trash'?'Savatga ko‘chirish':'Holatni o‘zgartirish',form);
}
function formField(labelText,name,value='',type='text'){
  const label=el('label','',labelText),input=el(type==='textarea'?'textarea':'input');input.name=name;if(type!=='textarea')input.type=type;input.value=value??'';label.append(input);return label;
}
function editProduct(product=null){
  state.editing=product?structuredClone(product):null;
  const form=$('productForm');form.reset();$('editorError').textContent='';$('editorTitle').textContent=product?'Mahsulotni tahrirlash':'Mahsulot qo‘shish';
  for(const [name,rows] of [['brandId',state.data.brands],['categoryId',state.data.categories]])form.elements[name].replaceChildren(option('','Tanlang'),...rows.map(r=>option(r.id,typeof r.name==='string'?r.name:r.name.uz)));
  $('translationFields').replaceChildren(...['uz','ru','en'].map(lang=>{
    const panel=el('div','translation-panel');panel.dataset.translation=lang;panel.hidden=lang!=='uz';
    const title=formField('Mahsulot nomi'+(lang==='uz'?' *':''),'title_'+lang,product?.title[lang]);title.firstElementChild.maxLength=200;
    const description=formField('Tavsif'+(lang==='uz'?' *':''),'description_'+lang,product?.description[lang],'textarea');description.firstElementChild.maxLength=8000;
    const colour=formField('Rang nomi (ixtiyoriy)','colorName_'+lang,product?.colorName?.[lang]);colour.firstElementChild.maxLength=200;
    panel.append(title,description,colour);return panel;
  }));
  document.querySelectorAll('#languageTabs button').forEach(b=>b.classList.toggle('active',b.dataset.lang==='uz'));
  const values=product||{status:'draft',order:Math.max(0,...state.data.products.map(p=>p.order))+1,packageUnit:'kg'};
  for(const key of ['brandId','categoryId','sku','status','packageUnit','color','order','image','originalImage'])if(form.elements[key])form.elements[key].value=values[key]??'';
  form.elements.packages.value=product?.packages.join('; ')||'';
  $('editorMeta').textContent=product?'Yaratilgan: '+date(product.createdAt)+' · Yangilangan: '+date(product.updatedAt)+' · Holat '+product.revision:'Yangi mahsulot. O‘zbekcha nom va tavsifni to‘ldiring. Bo‘sh tarjimalar o‘zbekcha matndan olinadi.';
  $('showHistory').hidden=!product;updateImage();$('editor').showModal();
}
function updateImage(){
  const path=$('productForm').elements.image.value;
  $('imagePreview').replaceChildren();if(path){const img=el('img');img.src='/'+path;img.alt='Tanlangan mahsulot rasmi';$('imagePreview').append(img);}else $('imagePreview').append(el('span','muted','Mahsulot rasmi'));
}
async function saveProduct(){
  const form=$('productForm'),v=name=>form.elements[name].value.trim();
  const translations=prefix=>Object.fromEntries(['uz','ru','en'].map(l=>[l,v(prefix+'_'+l)]));
  const packages=v('packages')?v('packages').split(';').map(s=>Number(s.trim().replace(',','.'))):[];
  if(packages.some(n=>!Number.isFinite(n)||n<=0))throw new Error('Qadoq hajmlarini to‘g‘ri kiriting. Masalan: 1; 2.5; 5');
  if(!v('title_uz')||!v('description_uz')){document.querySelector('#languageTabs [data-lang=uz]').click();throw new Error('O‘zbekcha nom va tavsifni to‘ldiring.');}
  const p={...(state.editing||{}),title:translations('title'),description:translations('description'),colorName:translations('colorName'),packages,order:Number(v('order'))};
  for(const key of ['brandId','categoryId','sku','status','packageUnit','color','image','originalImage'])p[key]=v(key)||null;
  p.sku=p.sku||'';if(!p.colorName.uz)p.colorName=null;
  await api('/api/admin/products'+(state.editing?'/'+state.editing.id:''),state.editing?'PATCH':'POST',p);
  await reload();$('editor').close();toast('Mahsulot saqlandi.');
}
async function upload(file){
  if(!file)return null;if(file.size>8*1024*1024)throw new Error('Rasm hajmi 8 MBdan oshmasin.');
  const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(new Error('Faylni o‘qib bo‘lmadi.'));reader.readAsDataURL(file);});
  const {media}=await api('/api/admin/media','POST',{name:file.name,base64});return media;
}
function renderMedia(target,picker){
  target.replaceChildren(...state.media.map(m=>{
    const item=picker?button('',()=>{$('productForm').elements.image.value=m.path;updateImage();$('mediaPicker').close();},'media-item glass'):el('article','media-item glass');
    const img=el('img');img.src='/'+m.path;img.alt=m.name;img.loading='lazy';
    item.append(img,el('span','',m.name),el('small','',m.width?m.width+' × '+m.height+' px':'Katalog rasmi'));return item;
  }));
}
async function pickImage(){state.media=(await api('/api/admin/media')).media;renderMedia($('pickerGrid'),true);$('mediaPicker').showModal();}
function renderDictionary(){
  const type=state.view,rows=state.data[type];$('dictionaryCopy').textContent=type==='brands'?'Mahsulotlarda ishlatiladigan brendlar.':'Mahsulot turini aniq ifodalovchi katalog bo‘limlari. Ishlatilayotgan bo‘limni o‘chirib bo‘lmaydi.';
  $('dictionaryList').replaceChildren(...rows.map(r=>{const card=el('article','glass dictionary-card'),count=state.data.products.filter(p=>p[type==='brands'?'brandId':'categoryId']===r.id).length;
    card.append(el('h3','',typeof r.name==='string'?r.name:r.name.uz),el('p','muted',count+' ta mahsulot bilan bog‘langan (savat ham hisobda)'));
    const row=el('div','row');row.append(button('Tahrirlash',()=>editDictionary(r)),button('O‘chirish',()=>deleteDictionary(r),'quiet'));card.append(row);return card;
  }));
}
function editDictionary(record=null){
  const type=state.view,form=el('form','dialog-form');
  if(type==='brands')form.append(formField('Brend nomi','name',record?.name));
  else for(const lang of ['uz','ru','en'])form.append(formField('Bo‘lim nomi · '+lang.toUpperCase(),'name_'+lang,record?.name[lang]));
  form.append(formField('Ro‘yxatdagi tartib','order',record?.sort_order||0,'number'));
  const submit=el('button','primary','Saqlash');submit.type='submit';form.append(submit);
  form.addEventListener('submit',e=>{e.preventDefault();attempt(async()=>{
    const name=type==='brands'?form.elements.name.value:Object.fromEntries(['uz','ru','en'].map(l=>[l,form.elements['name_'+l].value]));
    await api('/api/admin/'+type,record?'PATCH':'POST',{...(record?{id:record.id}:{}),name,order:Number(form.elements.order.value)});
    $('smallDialog').close();await reload();toast('Saqlandi.');
  },submit);});showSmall(record?'Tahrirlash':type==='brands'?'Brend qo‘shish':'Katalog bo‘limini qo‘shish',form);
}
function deleteDictionary(record){
  const type=state.view,count=state.data.products.filter(p=>p[type==='brands'?'brandId':'categoryId']===record.id).length;
  if(count){toast('Bu yozuv '+count+' ta mahsulotda ishlatilmoqda. Avval mahsulotlarni boshqa bo‘lim yoki brendga o‘tkazing. Savatdagi mahsulotlar ham hisobga olinadi.',true);return;}
  showSmall('O‘chirishni tasdiqlang',el('p','muted',(typeof record.name==='string'?record.name:record.name.uz)+' o‘chirilsinmi?'),button('O‘chirish',async()=>{await api('/api/admin/'+type,'DELETE',{id:record.id});$('smallDialog').close();await reload();toast('O‘chirildi.');},'danger'));
}
async function history(){
  const product=state.editing,{history}=await api('/api/admin/products/'+product.id+'/history');
  const list=el('div');
  if(!history.length)list.append(el('p','muted','Mahsulot hali tahrirlanmagan.'));
  for(const row of history){
    const item=el('div','history-row'),copy=el('div','',date(row.at));copy.append(el('small','',row.actor+' · '+(actions[row.action]||row.action)));
    item.append(copy,button('Shu holatga qaytish',async()=>{await api('/api/admin/products/'+product.id+'/revision','POST',{historyId:row.id,revision:product.revision});await reload();$('smallDialog').close();$('editor').close();toast('Mahsulotning oldingi holati tiklandi.');}));list.append(item);
  }showSmall('Mahsulotning oldingi holatlari',el('p','muted','Tiklash joriy saqlangan ma’lumotlarni almashtiradi. Hozirgi holat ham tarixda qoladi.'),list);
}
async function importFile(file){
  if(!file)return;if(file.size>10*1024*1024)throw new Error('JSON hajmi 10 MBdan oshmasin.');
  let catalog;try{catalog=JSON.parse(await file.text());}catch{throw new Error('JSON fayli buzilgan.');}
  if(catalog.schemaVersion!==1||!Array.isArray(catalog.products))throw new Error('Bu fayl katalog zaxirasi emas.');
  const active=new Set(state.data.products.map(p=>p.id)),added=catalog.products.filter(p=>!active.has(p.id)).length;
  const form=el('form','dialog-form');form.append(el('p','muted',catalog.products.length+' ta yozuv: '+added+' ta yangi qoralama, '+(catalog.products.length-added)+' ta mavjud mahsulot yangilanadi. Ro‘yxatda bo‘lmagan mahsulotlar saqlanadi. Importdan oldin baza zaxiralanadi.'));
  const label=formField('Tasdiqlash uchun IMPORT deb yozing','confirm');form.append(label);
  const submit=el('button','primary','Import qilish');submit.type='submit';form.append(submit);
  form.addEventListener('submit',e=>{e.preventDefault();attempt(async()=>{const result=await api('/api/admin/import','POST',{catalog,confirm:form.elements.confirm.value.trim()});$('smallDialog').close();await reload();toast(result.count+' ta mahsulot import qilindi.');},submit);});showSmall('Katalogni import qilish',form);
}
$('authForm').addEventListener('submit',e=>{e.preventDefault();$('authError').textContent='';const form=e.currentTarget;$('authSubmit').disabled=true;api(state.setup?'/api/setup':'/api/login','POST',Object.fromEntries(new FormData(form))).then(async()=>{form.reset();await session();}).catch(error=>$('authError').textContent=error.message).finally(()=>$('authSubmit').disabled=false);});
$('nav').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(!b)return;state.view=b.dataset.view;state.selected.clear();attempt(renderView);});
$('refresh').addEventListener('click',()=>attempt(reload,$('refresh')));
$('logout').addEventListener('click',()=>attempt(async()=>{await api('/api/logout','POST',{});state.data=null;await session();},$('logout')));
for(const id of ['search','categoryFilter','brandFilter','statusFilter'])$(id).addEventListener(id==='search'?'input':'change',renderProducts);
$('selectAll').addEventListener('change',()=>{state.selected=new Set($('selectAll').checked?state.visible.map(p=>p.id):[]);renderProducts();});
$('applyBulk').addEventListener('click',()=>attempt(()=>bulk($('bulkAction').value,state.visible.filter(p=>state.selected.has(p.id)))));
$('addProduct').addEventListener('click',()=>editProduct());
$('addDictionary').addEventListener('click',()=>editDictionary());
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).close()));
$('languageTabs').addEventListener('click',e=>{const lang=e.target.dataset.lang;if(!lang)return;document.querySelectorAll('#languageTabs button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));document.querySelectorAll('[data-translation]').forEach(p=>p.hidden=p.dataset.translation!==lang);});
$('productForm').addEventListener('submit',e=>{e.preventDefault();$('editorError').textContent='';$('saveProduct').disabled=true;saveProduct().catch(error=>$('editorError').textContent=error.message).finally(()=>$('saveProduct').disabled=false);});
$('chooseImage').addEventListener('click',()=>attempt(pickImage,$('chooseImage')));
$('clearImage').addEventListener('click',()=>{$('productForm').elements.image.value='';updateImage();});
$('useAsOriginal').addEventListener('click',()=>{$('productForm').elements.originalImage.value=$('productForm').elements.image.value;});
for(const id of ['editorUpload','libraryUpload'])$(id).addEventListener('change',()=>attempt(async()=>{const media=await upload($(id).files[0]);$(id).value='';if(!media)return;if(id==='editorUpload'){$('productForm').elements.image.value=media.path;updateImage();}else{state.media=(await api('/api/admin/media')).media;renderMedia($('mediaGrid'),false);}toast('Rasm yuklandi.');}));
$('showHistory').addEventListener('click',()=>attempt(history,$('showHistory')));
$('retentionForm').addEventListener('submit',e=>{e.preventDefault();attempt(async()=>{await api('/api/admin/settings','PATCH',{trashDays:Number($('trashDays').value)});await reload();toast('Savat muddati saqlandi. Avval o‘chirilgan mahsulotlarning muddati o‘zgarmaydi.');},e.submitter);});
$('passwordForm').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;attempt(async()=>{await api('/api/admin/password','POST',Object.fromEntries(new FormData(form)));form.reset();await session();toast('Parol yangilandi. Yangi parol bilan kiring.');},e.submitter);});
$('backup').addEventListener('click',()=>attempt(async()=>{const data=await api('/api/admin/export'),blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='elementpaint-katalog-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('JSON nusxa tayyor. To‘liq zaxira uchun admin-data papkasini ham nusxalang.');},$('backup')));
$('importFile').addEventListener('change',()=>attempt(async()=>{const file=$('importFile').files[0];$('importFile').value='';await importFile(file);}));
$('exportPreview').addEventListener('click',()=>attempt(async()=>{const result=await api('/api/admin/export-preview','POST',{});toast(result.count+' ta mahsulot sinov sayti fayllariga chiqarildi. Internetdagi havola hali yangilanmadi.');},$('exportPreview')));
session().catch(error=>{ $('auth').hidden=false;$('authError').textContent='Panelga ulanib bo‘lmadi: '+error.message;$('authSubmit').disabled=true;});
