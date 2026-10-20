import test from 'node:test';
import assert from 'node:assert/strict';
import * as d from '../src/advanced-domain.js';
const cards=Array.from({length:12},(_,i)=>({id:`c${i}`,styleTags:[i%2?'페미닌':'빈티지']}));
test('all three preferences require exactly twelve unique cards',()=>{
 for(const g of ['womens','mens','all'])assert.equal(d.createTasteSession(g,cards).cardIds.length,12);
 assert.throws(()=>d.createTasteSession('all',cards.slice(1)));
 assert.throws(()=>d.createTasteSession('all',Array(12).fill(cards[0])));
});
test('browsing never records decisions; only distinct decisions complete onboarding',()=>{
 let s=d.createTasteSession('all',cards);
 s=d.browseTaste(s,-1);assert.equal(s.activeImageId,'c11');assert.equal(d.tasteProgress(s).count,0);
 s=d.decideTaste(s,'c11','like');assert.equal(d.decideTaste(s,'c11','skip'),s);
 for(const c of cards.slice(0,10))s=d.decideTaste(s,c.id,'skip');
 assert.equal(d.tasteProgress(s).complete,false);
 s=d.decideTaste(s,'c10','like');assert.equal(d.tasteProgress(s).complete,true);assert.equal(s.activeImageId,null);
});
test('all SKIP is neutral, tie is deterministic and SKIP contributes no scores',()=>{
 let s=d.createTasteSession('womens',cards);
 for(const c of cards)s=d.decideTaste(s,c.id,'skip');
 assert.equal(d.analyzeTaste(s,cards).category,null);
 s=d.createTasteSession('womens',cards);s=d.decideTaste(s,'c0','like');s=d.decideTaste(s,'c1','like');
 assert.equal(d.analyzeTaste(s,cards).category.id,4);
});
test('style limit five, OR within styles and AND across filter groups',()=>{
 assert.equal(d.setStyleFilter(['a','b','c','d','e'],'f').length,5);
 assert.deepEqual(d.setStyleFilter(['a','b'],'a'),['b']);
 const shops=[{id:'a',styleTags:['빈티지'],openNow:true,lat:37,lng:127},{id:'b',styleTags:['페미닌'],openNow:true,lat:37,lng:127},{id:'c',styleTags:['빈티지'],openNow:null}];
 const f={styleTags:['빈티지','페미닌'],openNow:true,distanceMeters:500,tasteMatch:true,savedOnly:true};
 assert.deepEqual(d.filterShops(shops,f,{location:{lat:37,lng:127},savedIds:['a','b'],recommendedIds:['b']}).map(s=>s.id),['b']);
 assert.deepEqual(d.filterShops(shops,f),[]);
 assert.equal(d.distanceMeters({lat:37,lng:127},{lat:37,lng:127}),0);
});
test('pin states retain lower priorities and require second click for preview',()=>{
 const opts={selectedId:'a',savedIds:['a'],recommendedIds:['a']};
 assert.deepEqual(d.pinState({id:'a',openNow:true},opts),{primary:'selected',states:['open','recommended','saved','selected']});
 assert.equal(d.pinState({id:'a',openNow:true},{...opts,selectedId:null}).primary,'saved');
 assert.equal(d.selectPin(null,'a').openPreview,false);assert.equal(d.selectPin('a','a').openPreview,true);
 assert.equal(d.storyRoute('ryohe','today'),'/story/ryohe/today');
 assert.deepEqual(d.mergeSaved(['a','b'],['b','c']),['b','c','a']);
});
test('reservation rejects past dates, missing auth, unavailable slots and duplicates',()=>{
 const input={shopId:'demo',productId:'coat',date:'2026-10-23',time:'14:00',people:2};
 const context={today:'2026-10-22',availableSlots:['14:00'],reservations:[],userId:'demo'};
 assert.equal(d.validateReservation(input,context).valid,true);
 for(const changes of [{date:'2026-10-20'},{date:'2026-02-30'},{date:'2026-99-99'},{time:'03:00'},{people:0}])assert.equal(d.validateReservation({...input,...changes},context).valid,false);
 assert.equal(d.validateReservation(input,{...context,userId:null}).valid,false);
 assert.equal(d.validateReservation(input,{...context,reservations:[{...input,status:'RESERVED'}]}).valid,false);
});
test('signup checks email, password confirmation and each required consent',()=>{
 const input={email:'demo@example.com',password:'password123',confirmation:'password123',age:true,terms:true,privacy:true};
 assert.equal(d.validateSignup(input).valid,true);
 for(const changes of [{age:false},{terms:false},{privacy:false},{email:'bad'},{password:'short'},{confirmation:'different'}])assert.equal(d.validateSignup({...input,...changes}).valid,false);
});
