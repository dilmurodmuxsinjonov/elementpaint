// Public snapshots contain catalogue data only. On older preview deployments the
// bundled catalogue remains available when this optional file cannot be fetched.
const idPattern=/^[a-z0-9][a-z0-9-]{0,89}$/;
const translations=value=>value&&['uz','ru','en'].every(lang=>typeof value[lang]==='string'&&value[lang].trim());
const asset=value=>value===null||value===undefined||typeof value==='string'&&/^assets\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+\.(png|jpe?g|webp|svg)$/.test(value)&&!value.includes('..');
export function validateSnapshot(data){
  if(data?.schemaVersion!==1||!Array.isArray(data.categories)||!Array.isArray(data.products)||data.products.length>5000)throw Error('Invalid catalogue');
  const ids=new Set(),categories=new Set();
  for(const c of data.categories){if(!idPattern.test(c.id)||categories.has(c.id)||!translations(c.name))throw Error('Invalid category');categories.add(c.id);}
  for(const p of data.products){
    if(!idPattern.test(p.id)||ids.has(p.id)||!categories.has(p.categoryId)||typeof p.brand!=='string'||!translations(p.title)||!translations(p.description)||!asset(p.image)||!asset(p.originalImage)||!Array.isArray(p.packages)||p.packages.some(n=>typeof n!=='number'||!Number.isFinite(n)||n<=0)||!Array.isArray(p.aliases)||p.aliases.some(a=>!idPattern.test(a))||!Array.isArray(p.variants)||p.variants.length)throw Error('Invalid product');
    if(p.colorName&&!translations(p.colorName))throw Error('Invalid colour');ids.add(p.id);
  }
  return data;
}
export async function loadCatalogue(products,categories){
  if(typeof window.fetch!=='function')return false;
  try{
    const response=await window.fetch('./catalog-snapshot.json',{cache:'no-store',signal:AbortSignal.timeout(5000)});
    if(!response.ok)return false;
    const data=validateSnapshot(await response.json());
    products.splice(0,products.length,...data.products);categories.splice(0,categories.length,...data.categories);return true;
  }catch{return false;}
}
export function packageUnit(product,lang){
  const unit=product.packageUnit||'kg';
  return ({kg:{ru:'кг'},g:{ru:'г'},l:{uz:'l',ru:'л',en:'l'},pcs:{uz:'dona',ru:'шт.',en:'pcs'}}[unit]?.[lang])||unit;
}
