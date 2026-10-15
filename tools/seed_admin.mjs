import {writeFile} from 'node:fs/promises';
import {products,categories} from '../element_paint_web/catalog-data.js';
const names=[...new Set(products.map(p=>p.brand))];
const brands=names.map(name=>({id:name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),name}));
const seed={schemaVersion:1,brands,categories,products:products.map((p,i)=>({...p,brandId:brands.find(b=>b.name===p.brand).id,status:'published',order:i,packageUnit:'kg',sku:`EP-${String(i+1).padStart(3,'0')}`}))};
await writeFile(new URL('../admin/seed.json',import.meta.url),JSON.stringify(seed,null,2)+'\n');
console.log(`Seed: ${seed.products.length} approved products, ${brands.length} brands; no accounts or secrets.`);
