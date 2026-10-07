import { categories, products, strings, findProduct } from './catalog-data.js?v=20261007.18';

const $ = id => document.getElementById(id);
const validLang = value => ['uz','ru','en'].includes(value) ? value : 'uz';
let sceneApi, returnFocus, urlTimer;
const params = new URLSearchParams(location.search);
export const state = { lang: validLang(params.get('lang')), category: categories.some(c=>c.id===params.get('category')) ? params.get('category') : 'all', brand: params.get('brand') || 'all', query: params.get('q') || '', product: params.get('product') || '', variant: params.get('variant') || '' };
const t = key => strings[state.lang][key];
const node = (tag, cls, text) => { const n = document.createElement(tag); if(cls)n.className=cls; if(text!==undefined)n.textContent=text; return n; };
const normal = s => String(s).toLowerCase().normalize('NFKC').replace(/[\p{P}\s]+/gu,'');
function saveURL(push=false) {
  const url = new URL(location.href); const values = {lang:state.lang,category:state.category,brand:state.brand,q:state.query,product:state.product,variant:state.variant};
  for(const [key,value] of Object.entries(values)){if(value && value!=='all')url.searchParams.set(key,value);else url.searchParams.delete(key);}
  history[push?'pushState':'replaceState']({},'',url);
}
function imageMedia(product,image=product.image) {
  const media=node('div','product-media');
  if(image){const img=node('img');img.src=image;img.alt=product.title[state.lang];img.loading='lazy';img.decoding='async';img.width=1024;img.height=1024;img.addEventListener('error',()=>{media.replaceChildren(...imageMedia(product,null).childNodes);},{once:true});media.append(img);}
  else {const pending=node('div','image-pending');pending.append(node('strong','',product.brand),node('p','',t('imagePending')));media.append(pending);}
  return media;
}
function renderCatalog() {
  const list=$('categoryList');list.replaceChildren();
  for(const category of [{id:'all',name:{[state.lang]:t('all')}},...categories]){
    const button=node('button',category.id===state.category?'active':'');button.type='button';button.dataset.category=category.id;button.setAttribute('aria-pressed',String(category.id===state.category));
    button.append(node('span','',category.name[state.lang]),node('small','',String(products.filter(p=>category.id==='all'||p.categoryId===category.id).length)));
    button.addEventListener('click',()=>{state.category=category.id;saveURL(true);renderCatalog();});list.append(button);
  }
  const query=normal(state.query.trim());
  const filtered=products.filter(p=>(state.category==='all'||p.categoryId===state.category)&&(state.brand==='all'||p.brand===state.brand)&&normal([p.brand,...Object.values(p.title),...Object.values(p.description),...p.variants.flatMap(v=>Object.values(v.name))].join(' ')).includes(query));
  $('categoryTitle').textContent=categories.find(c=>c.id===state.category)?.name[state.lang]||t('all');
  const form=new Intl.PluralRules(state.lang).select(filtered.length);
  const resultWord=state.lang==='ru' ? (form==='one'?'продукт':form==='few'?'продукта':'продуктов') : state.lang==='en'&&form==='one'?'product':t('results');
  $('resultCount').textContent=`${filtered.length} ${resultWord}`;
  $('productGrid').replaceChildren(...filtered.map(product=>{
    const card=node('article','product-card');card.dataset.product=product.id;
    const button=node('button','product-open');button.type='button';button.setAttribute('aria-label',`${product.brand} ${product.title[state.lang]} — ${t('detail')}`);
    const media=imageMedia(product);
    const colorWord={uz:'ta rang',ru:'цветов',en:'colours'}[state.lang];
    const copy=node('div','product-copy');copy.append(node('div','product-brand',product.brand),node('h3','',product.title[state.lang]),node('p','',product.variants.length?`${product.variants.length} ${colorWord}`:categories.find(c=>c.id===product.categoryId).name[state.lang]));
    const detail=node('span','detail-link');detail.append(node('span','',t('detail')),node('span','','↗'));copy.append(detail);button.append(media,copy);button.addEventListener('click',()=>showProduct(product.id,button));card.append(button);return card;
  }));
  $('emptyState').hidden=filtered.length>0;$('emptyState').querySelector('p').textContent=state.query||state.brand!=='all'?t('noMatch'):t('empty');
}
function renderProduct() {
  const product=findProduct(state.product);if(!product)return;
  if(product.aliases.includes(state.product)){state.variant=state.product.replace('atlas-','');state.product=product.id;saveURL();}
  const variant=product.variants.find(v=>v.id===state.variant)||product.variants[0];
  if(variant)state.variant=variant.id;else state.variant='';
  $('productBrand').textContent=product.brand;$('productTitle').textContent=product.title[state.lang];$('productDescription').textContent=product.description[state.lang];
  $('productCategory').textContent=`${t('category')} / ${categories.find(c=>c.id===product.categoryId).name[state.lang]}`;
  const media=imageMedia(product,variant?(variant.image||null):product.image);$('productMedia').replaceChildren(...media.childNodes);
  $('variantPanel').hidden=!product.variants.length;$('variantList').replaceChildren();
  for(const v of product.variants){const button=node('button');button.type='button';button.style.setProperty('--swatch',v.color);button.title=v.name[state.lang];button.setAttribute('aria-label',v.name[state.lang]);button.setAttribute('aria-pressed',String(v.id===state.variant));button.append(node('span'));button.addEventListener('click',()=>{state.variant=v.id;saveURL();renderProduct();});$('variantList').append(button);}
  $('variantName').textContent=variant?`${variant.name[state.lang]}${variant.image?'':` · ${t('photoPending')}`}`:'';
  const packages=variant?[variant.packageKg]:product.packages;
  const mass=new Intl.NumberFormat(state.lang==='uz'?'uz-Latn-UZ':state.lang,{maximumFractionDigits:2});
  $('packageInfo').textContent=packages.length?`${t('packages')}: ${packages.map(kg=>mass.format(kg)).join(' / ')} ${state.lang==='ru'?'кг':'kg'}`:'';
}
function showProduct(id,focus) {
  if(!findProduct(id))return;returnFocus=focus||document.activeElement;state.product=id;state.variant='';saveURL(true);renderProduct();
  if(!$('productDialog').open)$('productDialog').showModal();$('closeProduct').focus();
}
function closeProduct(fromHistory=false) {
  const productId=findProduct(state.product)?.id;
  if($('productDialog').open)$('productDialog').close();state.product='';state.variant='';if(!fromHistory)saveURL();
  const target=returnFocus?.isConnected?returnFocus:productId?document.querySelector(`[data-product="${productId}"] .product-open`):$('searchInput');target?.focus({preventScroll:true});
}
function applyLanguage() {
  document.documentElement.lang=state.lang;document.title=`Element Paint — ${t('catalog')}`;
  document.querySelector('.logo').href=`preview.html?lang=${state.lang}`;
  document.querySelector('meta[name=description]').content=t('footer');
  for(const el of document.querySelectorAll('[data-i18n]'))el.textContent=t(el.dataset.i18n);
  for(const el of document.querySelectorAll('[data-i18n-aria]'))el.setAttribute('aria-label',t(el.dataset.i18nAria));
  for(const el of document.querySelectorAll('[data-i18n-placeholder]')){el.placeholder=t(el.dataset.i18nPlaceholder);el.setAttribute('aria-label',t(el.dataset.i18nPlaceholder));}
  for(const button of document.querySelectorAll('[data-lang]'))button.setAttribute('aria-pressed',String(button.dataset.lang===state.lang));
  const brands=[...new Set(products.map(p=>p.brand))];if(!brands.includes(state.brand))state.brand='all';
  $('brandSelect').replaceChildren(new Option(t('all'),'all'),...brands.map(b=>new Option(b,b)));$('brandSelect').value=state.brand;
  $('searchInput').value=state.query;renderCatalog();renderProduct();sceneApi?.setLanguage(strings[state.lang]);
  const altKeys=[['.about-image img','catalog'],['.application-grid article:nth-child(1) img','facade'],['.application-grid article:nth-child(2) img','interior'],['.application-grid article:nth-child(3) img','wood']];
  for(const [selector,key] of altKeys)document.querySelector(selector).alt=t(key);
}
for(const button of document.querySelectorAll('[data-lang]'))button.addEventListener('click',()=>{state.lang=button.dataset.lang;saveURL();applyLanguage();});
$('searchInput').addEventListener('input',e=>{state.query=e.target.value;renderCatalog();clearTimeout(urlTimer);urlTimer=setTimeout(()=>saveURL(),160);});
$('brandSelect').addEventListener('change',e=>{state.brand=e.target.value;saveURL(true);renderCatalog();});
$('clearFilters').addEventListener('click',()=>{state.category='all';state.brand='all';state.query='';saveURL(true);applyLanguage();$('searchInput').focus();});
$('closeProduct').addEventListener('click',()=>closeProduct());$('backToCatalog').addEventListener('click',()=>closeProduct());
$('productDialog').addEventListener('cancel',e=>{e.preventDefault();closeProduct();});
$('productDialog').addEventListener('click',e=>{if(e.target===$('productDialog')){const r=$('productDialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeProduct();}});
$('themeButton').addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='light'?'dark':'light';$('themeButton').setAttribute('aria-pressed',String(document.documentElement.dataset.theme==='dark'));sceneApi?.refresh();});
function closeMenu(){const restore=$('navigationLinks').classList.contains('open')&&$('navigationLinks').contains(document.activeElement);$('navigationLinks').classList.remove('open');$('menuButton').setAttribute('aria-expanded','false');if(restore)$('menuButton').focus({preventScroll:true});}
$('menuButton').addEventListener('click',()=>{$('menuButton').setAttribute('aria-expanded',String($('navigationLinks').classList.toggle('open')));});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.navigation'))closeMenu();});
function adaptHeader(){const mobile=matchMedia('(max-width:760px)').matches;const theme=$('themeButton');if(mobile)$('navigationLinks').append(theme);else document.querySelector('.nav-tools').insertBefore(theme,$('menuButton'));closeMenu();}
matchMedia('(min-width:761px)').addEventListener('change',adaptHeader);adaptHeader();
window.addEventListener('popstate',()=>{const q=new URLSearchParams(location.search);state.lang=validLang(q.get('lang'));state.category=categories.some(c=>c.id===q.get('category'))?q.get('category'):'all';state.brand=q.get('brand')||'all';state.query=q.get('q')||'';state.product=q.get('product')||'';state.variant=q.get('variant')||'';applyLanguage();if(findProduct(state.product)){if(!$('productDialog').open)$('productDialog').showModal();}else closeProduct(true);});
$('year').textContent=new Date().getFullYear();applyLanguage();
if(findProduct(state.product)){$('productDialog').showModal();renderProduct();}
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
async function showBrandIntro(){
  if(reduced.matches||state.product)return;
  const loader=$('brandLoader'),can=loader.querySelector('.loader-can');
  // Skip a late or failed image rather than covering an already usable page.
  const ready=await Promise.race([can.decode().then(()=>true,()=>false),new Promise(resolve=>setTimeout(()=>resolve(false),700))]);
  if(!ready||reduced.matches||document.hidden||state.product)return;
  loader.hidden=false;
  setTimeout(()=>loader.classList.add('leaving'),1650);
  setTimeout(()=>{loader.hidden=true;},1900);
}
showBrandIntro();
import('./berlak-scene.js?v=20261006.13').then(async module=>{sceneApi=await module.createCanScene();sceneApi?.setLanguage(strings[state.lang]);}).catch(()=>{$('sceneStage').dataset.state='fallback';});
