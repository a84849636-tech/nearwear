import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const port=Number(process.env.PORT||4173),host=process.env.HOST||'127.0.0.1';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'}).end();return;}
  const requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(requested!=='/'&&requested!=='/index.html'&&!requested.startsWith('/src/')&&!requested.startsWith('/public/')){res.writeHead(404).end('Not found');return;}
  if(requested.split('/').some(p=>p.startsWith('.'))){res.writeHead(403).end();return;}
  let file=path.resolve(root,'.'+requested);
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
  if((await stat(file).catch(()=>null))?.isDirectory())file=path.join(file,'index.html');
  const body=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404).end('Not found');}
});
server.on('error',error=>{console.error(error.message);process.exit(1);});
server.listen(port,host,()=>console.log(`NEARWEAR development server listening on ${host}:${port}`));
