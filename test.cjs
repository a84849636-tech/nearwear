const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const source=['data.js','app.js'].map(f=>fs.readFileSync(path.join(__dirname,f),'utf8')).join('\n');
function setup(saved){
 const storage=new Map(saved?[['nearwear-v2',saved]]:[]),els=new Map();
 const el=id=>{if(!els.has(id))els.set(id,{innerHTML:'',textContent:'',style:{},classList:{toggle(){}},addEventListener(){},showModal(){this.open=true},close(){this.open=false}});return els.get(id)};
 const context=vm.createContext({console,Date,JSON,Number,String,Math,Set,Map,Array,encodeURIComponent,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},document:{getElementById:el,querySelectorAll:()=>[],body:{classList:{toggle(){}}}},window:{scrollTo(){},addEventListener(){}},location:{hash:'',pathname:'/',search:''},history:{replaceState(){},pushState(){}},setInterval(){},setTimeout(){},clearTimeout(){}});
 vm.runInContext(source,context);
 return {run:s=>vm.runInContext(s,context),storage};
}
const a=setup();
assert.ok(a.run('products.length')>=8);
assert.ok(a.run('stores.length')>=4);
assert.equal(a.run('products.every(p=>stores[p.storeId]&&p.status)'),true);
a.run('startTaste();swipe(true);swipe(false);swipe(false);swipe(false);swipe(false);swipe(false)');
assert.equal(a.run('page'),3);assert.equal(a.run('state.taste.length'),3);
a.run("state.location='전체';state.selectedStyles=['Grunge']");assert.equal(a.run('visibleStores().length'),7);
a.run("state.location='성수';state.selectedStyles=[]");assert.equal(a.run('visibleStores().length'),4);
a.run('selectProduct(5)');assert.equal(a.run('store'),1);
a.run('saveProduct();saveStore()');
const b=setup(a.storage.get('nearwear-v2'));
assert.equal(b.run('state.saved.includes(5)&&state.savedStores.includes(1)'),true);
b.run('selectProduct(2)');assert.equal(b.run('reserve()'),false); // sold out
b.run('selectProduct(8)');assert.equal(b.run('reserve()'),false); // another reservation
b.run('selectProduct(0)');assert.equal(b.run('reserve()'),true);
assert.equal(b.run('state.reservation.expires-state.reservation.createdAt'),10800000);
assert.equal(b.run('productStatus(0)'), 'RESERVED');
const c=setup(b.storage.get('nearwear-v2'));
assert.equal(c.run('state.reservation.expires'),b.run('state.reservation.expires'));
assert.match(c.run('body(12)'), /Vintage Lace Top/);
c.run('selectProduct(1)');assert.equal(c.run('reserve()'),false); // cannot overwrite active
assert.equal(c.run('expireReservation(state.reservation.expires)'),true);
assert.equal(c.run('state.reservation'),null);
assert.equal(c.run('state.history[0].status'),'EXPIRED');
assert.equal(c.run('productStatus(0)'),'AVAILABLE');
assert.match(c.run('body(12)'),/EXPIRED/);
c.run('selectProduct(0);reserve();finishReservation("CANCELLED")');
assert.equal(c.run('state.history[0].status'),'CANCELLED');
assert.equal(c.run('state.history[1].status'),'EXPIRED');
c.run('selectProduct(0);reserve();state.reservation.expires=Date.now()-1;persist()');
const d=setup(c.storage.get('nearwear-v2'));
assert.equal(d.run('state.reservation'),null);assert.equal(d.run('state.history[0].status'),'EXPIRED');
for(let n=1;n<=12;n++)assert.ok(d.run(`phone(${n})`).length>100);
console.log('PASS: 12 screens, taste fallback, independent filters, store ownership, saved state reload, unavailable stock guards, 3-hour reservation, reload continuity, collision guard, expiry history, cancellation, expired-on-load.');
