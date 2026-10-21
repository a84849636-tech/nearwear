const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf'};
const files=new Set(['index.html','demo.js','demo.css','legacy.html','styles.css','app.js','data.js','stories.css','stories.js','figma-app.css','figma-app.js','figma-screens.json']);
const port=Number(process.env.PORT||4174);
http.createServer((req,res)=>{
  let requested;try{requested=decodeURIComponent(req.url.split('?')[0]).replace(/^\//,'')||'index.html'}catch{res.writeHead(400);return res.end('Bad request')}
  const allowed=files.has(requested)||/^assets\/figma\/[a-z0-9.-]+\.(png|svg|woff2|ttf)$/.test(requested)||/^assets\/new-stories\/(ryohe|ttul|ototo|otuvintage|baltz|pinonpippi|gowon)\/(NEW(?:-[1-3])?|store-feed-reference)\.png$/.test(requested);
  if(!allowed){res.writeHead(404);return res.end('Not found')}
  const target=path.join(__dirname,requested);
  if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);return res.end('Not found')}
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  fs.createReadStream(target).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`NEARWEAR: http://127.0.0.1:${port}`));
