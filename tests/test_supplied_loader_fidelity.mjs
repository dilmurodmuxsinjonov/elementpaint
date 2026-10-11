import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

class Node {
  attrs=new Map();children=[];dataset={};isConnected=true;hidden=false;
  classList={add(){},remove(){},contains(){return false;}};
  setAttribute(k,v){this.attrs.set(k,String(v));}getAttribute(k){return this.attrs.get(k);}
  appendChild(c){this.children.push(c);}addEventListener(){}removeEventListener(){}
  hasAttribute(k){return k==='data-loop';}
}
function scene(code){
  const root=new Node(),nodes=new Map(),frames=new Map();let next=0;
  root.querySelector=selector=>{if(!nodes.has(selector))nodes.set(selector,new Node());return nodes.get(selector);};
  const context=vm.createContext({performance:{now:()=>0},location:{search:''},
    document:{readyState:'complete',getElementById:()=>root,querySelector:root.querySelector,
      createElementNS:()=>new Node(),documentElement:new Node()},
    window:{matchMedia:()=>({matches:false}),addEventListener(){}},matchMedia:()=>({matches:false}),
    Image:class{set src(value){this.onload?.();}},
    requestAnimationFrame:callback=>{frames.set(++next,callback);return next;},
    cancelAnimationFrame:id=>frames.delete(id),setTimeout:()=>0,clearTimeout(){}});
  vm.runInContext(code,context);
  return {nodes,root,step(ts){const pending=[...frames.values()];frames.clear();pending.forEach(cb=>cb(ts));}};
}
const source=readFileSync(new URL('../docs/reference/loader-uzlashgan.html',import.meta.url),'utf8');
const baseline=scene(source.match(/<script>([\s\S]*?)<\/script>/)[1]);
const adapted=readFileSync(new URL('../element_paint_web/supplied-loader.js',import.meta.url),'utf8');
const actual=scene(adapted.replace('export function','function')+'\nstartSuppliedLoader(document.getElementById("ep-loader")).progress(1);');
const selectors=['.ep-paint','.ep-paint-gloss','.ep-sheen','.ep-can','.ep-stream','.ep-stream-hi','.ep-stream-lo','.ep-splash'];
for(let frame=1;frame<=288;frame++){
  baseline.step(frame*1000/60);actual.step(frame*1000/60);
  for(const selector of selectors){
    assert.deepEqual([...actual.nodes.get(selector).attrs],[...baseline.nodes.get(selector).attrs],`${selector} differs from supplied frame ${frame}`);
  }
  assert.deepEqual(actual.nodes.get('.ep-drops').children.map(node=>[...node.attrs]),
    baseline.nodes.get('.ep-drops').children.map(node=>[...node.attrs]),`Droplets differ at frame ${frame}`);
}
assert.ok(!/ep-caption|ep-brand|ep-controls/.test(readFileSync(new URL('../element_paint_web/supplied-loader.html',import.meta.url),'utf8')));
console.log('PASS: 288 frames match supplied can motion, liquid, splash, droplets, logo fill and sheen exactly; surrounding captions remain absent.');
