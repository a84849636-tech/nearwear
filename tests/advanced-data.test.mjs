import test from 'node:test';
import assert from 'node:assert/strict';
import {shops,products,decks,results,puzzleOrder,slotsForDate,shopOpenAt,allAssetKeys} from '../src/advanced-data.js';
import {tasteCategories} from '../src/advanced-domain.js';
test('nine result screens and exact seven-shop product ownership',()=>{
 assert.equal(results.length,9);assert.equal(tasteCategories.length,9);assert.ok(!results.some(r=>r.id===8));
 assert.deepEqual(results.map(r=>r.id),tasteCategories.map(r=>r.id));
 assert.deepEqual(shops.map(s=>s.name),['OTOTO','OTUVINTAGE','BALTZ','PINONPIPPI','GOWON','TTUL','RYOHE']);
 assert.equal(products.length,7);for(const s of shops)assert.equal(products.filter(p=>p.shopId===s.id).length,1);
 assert.equal(new Set(allAssetKeys).size,allAssetKeys.length);
});
test('three original decks have independent IDs and exact puzzle image membership',()=>{
 assert.equal(Object.values(decks).flat().length,36);
 assert.equal(new Set(Object.values(decks).flat().map(c=>c.id)).size,36);
 for(const gender of ['all','mens','womens']){assert.equal(decks[gender].length,12);assert.deepEqual([...puzzleOrder[gender]].sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i+1));}
});
test('final corrected schedules, TTUL handle and RYOHE closed days',()=>{
 const gowon=shops.find(s=>s.id==='gowon'),ryohe=shops.find(s=>s.id==='ryohe'),ttul=shops.find(s=>s.id==='ttul');
 assert.equal(ttul.instagram,'_tul');assert.equal(gowon.range[0],'12:30');assert.equal(ryohe.range[0],'14:00');
 assert.equal(slotsForDate(gowon,'2026-10-23')[0],'12:30');
 assert.equal(slotsForDate(ryohe,'2026-10-23')[0],'14:00');assert.deepEqual(slotsForDate(ryohe,'2026-10-22'),[]);
 assert.equal(shopOpenAt(ryohe,new Date('2026-10-23T05:00:00Z')),true);
 assert.equal(shopOpenAt(ryohe,new Date('2026-10-23T04:59:00Z')),false);
 assert.equal(shopOpenAt(ryohe,new Date('2026-10-23T11:00:00Z')),false);
});
