import assert from 'node:assert/strict';
import {startSuppliedLoader} from '../element_paint_web/supplied-loader.js';
let next=0;const frames=new Map();
globalThis.requestAnimationFrame=callback=>{frames.set(++next,callback);return next;};
globalThis.cancelAnimationFrame=id=>frames.delete(id);
globalThis.matchMedia=()=>({matches:false});globalThis.window={matchMedia};
class Node {
  attrs=new Map();children=[];dataset={};isConnected=true;listeners=new Map();
  classList={values:new Set(),add(value){this.values.add(value);},contains(value){return this.values.has(value);}};
  setAttribute(k,v){this.attrs.set(k,String(v));}getAttribute(k){return this.attrs.get(k);}
  appendChild(c){this.children.push(c);}addEventListener(k,v){this.listeners.set(k,v);}removeEventListener(k){this.listeners.delete(k);}
}
globalThis.document={createElementNS:()=>new Node()};
const root=new Node(),nodes=new Map();root.querySelector=selector=>{if(!nodes.has(selector))nodes.set(selector,new Node());return nodes.get(selector);};
let completed=0;const api=startSuppliedLoader(root,()=>completed++);
let timestamp=performance.now();
function advance(seconds){for(let i=0;i<Math.ceil(seconds*60);i++){timestamp+=1000/60;const current=[...frames];frames.clear();for(const [,callback]of current)callback(timestamp);}}
advance(3);assert.equal(root.dataset.fill,'0','Time alone must not invent readiness');assert.equal(completed,0);
api.progress(.5);advance(3);assert.equal(root.dataset.fill,'50');assert.equal(root.dataset.phase,'pour');
api.progress(.1);advance(1);assert.equal(root.dataset.fill,'50','A late callback cannot lower readiness');
api.done();advance(5);assert.equal(root.dataset.fill,'100');assert.equal(root.dataset.phase,'leaving');
assert.ok(root.classList.contains('is-leaving'));root.listeners.get('transitionend')({target:root,propertyName:'transform'});
assert.equal(completed,1);assert.equal(frames.size,0,'Exit must cancel animation frames');
advance(1);assert.equal(completed,1);
const skipped=startSuppliedLoader(root,()=>completed++);skipped.stop();advance(2);assert.equal(completed,1);assert.equal(frames.size,0);
for(const node of nodes.values())for(const value of node.attrs.values())assert.ok(!/NaN|Infinity/.test(value),'Stream geometry remains finite');
console.log('PASS: actual readiness gates pour, monotonic progress, full fill, supplied curtain exit, callback once, cancellation and finite liquid geometry.');
