// An unavailable authoritative snapshot must not resurrect deleted bundled items.
import assert from 'node:assert/strict';
import {loadCatalogue} from '../element_paint_web/catalog-source.js';
for(const fetch of [async()=>{throw Error('Offline');},async()=>({ok:false,status:500}),async()=>({ok:false,status:404}),async()=>({ok:true,json:async()=>({schemaVersion:1,products:'broken'})})]){
  globalThis.window={fetch};
  const products=[{id:'old-deleted-product'}],categories=[{id:'old'}];
  assert.equal(await loadCatalogue(products,categories),false);
  assert.deepEqual(products,[]);assert.deepEqual(categories,[]);
}
const products=[{id:'old-deleted-product'}],categories=[];
window.fetch=async()=>({ok:true,json:async()=>({schemaVersion:1,products:[],categories:[]})});
assert.equal(await loadCatalogue(products,categories),true);
assert.deepEqual(products,[]);
console.log('PASS: offline, HTTP 500/404 and invalid JSON cannot resurrect old products; intentional empty catalogue accepted.');
