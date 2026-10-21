const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'figma-screens.json'),'utf8'));
assert.equal(data.length,132);
assert.equal(new Set(data.map(s=>s.id)).size,132);
const assets=new Set();
for(const screen of data){
 assert.ok(screen.html.includes(`data-node-id="${screen.id}"`),screen.id);
 assert.ok(!/https:\/\/www\.figma\.com\/api\/mcp/.test(screen.html),'Temporary asset URL');
 for(const [,src] of screen.html.matchAll(/src="([^"]+)"/g)){
  assert.ok(src.startsWith('assets/figma/'));
  assert.ok(fs.statSync(path.join(__dirname,src)).size>0,src);
  assets.add(src);
 }
}
assert.equal(assets.size,607);
let stories=0;
for(const shop of ['ryohe','ttul','ototo','otuvintage','baltz','pinonpippi','gowon']){
 for(let index=0;index<(shop==='pinonpippi'?3:4);index++){
  const src=path.join(__dirname,'assets/new-stories',shop,`NEW${index?'-'+index:''}.png`);
  const header=Buffer.alloc(24),fd=fs.openSync(src);fs.readSync(fd,header,0,24,0);fs.closeSync(fd);
  assert.equal(header.readUInt32BE(16),430);assert.equal(header.readUInt32BE(20),932);stories++;
 }
}
assert.equal(stories,27);
assert.ok(fs.existsSync(path.join(__dirname,'legacy.html')));
console.log('PASS: 132 unique Figma routes, 607 nonempty local assets, no temporary asset URLs, 27 original 430×932 NEW stories, preserved legacy entry.');
