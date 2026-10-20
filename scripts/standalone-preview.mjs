// Portable interactive review artifact. Does not publish or contact Vercel.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const output=process.argv[2]||'/workspace/nearwear-artifacts/NEARWEAR-preview.html';
const modules=[];
for(const name of ['advanced-data.js','advanced-domain.js','advanced-app.js']){
 let source=await readFile(path.join(root,'src',name),'utf8');
 source=source.replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
 if(name==='advanced-app.js'){
  const manifest=JSON.parse(await readFile(path.join(root,'public/figma/assets.json'),'utf8'));
  // Embed source bytes if files are later supplied, keeping the artifact offline.
  for(const [key,entry] of Object.entries(manifest)){
   const src=typeof entry==='string'?entry:entry.src;
   const bytes=await readFile(path.join(root,src));
   const type=src.endsWith('.webp')?'image/webp':src.endsWith('.jpg')||src.endsWith('.jpeg')?'image/jpeg':'image/png';
   const inline='data:'+type+';base64,'+bytes.toString('base64');
   manifest[key]=typeof entry==='string'?inline:{...entry,src:inline};
  }
  source=source.replace("let assets={};try{const response=await fetch('/public/figma/assets.json');if(response.ok)assets=await response.json();}catch{}",'let assets='+JSON.stringify(manifest)+';');
  source=source.replace("!url.startsWith('/public/figma/')", "(!url.startsWith('/public/figma/')&&!url.startsWith('data:image/'))");
 }
 modules.push(source);
}
let css=await readFile(path.join(root,'src/advanced.css'),'utf8');
const font=(await readFile(path.join(root,'public/fonts/PretendardVariable.woff2'))).toString('base64');
css=css.replace('/public/fonts/PretendardVariable.woff2','data:font/woff2;base64,'+font);
const html=`<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NEARWEAR — 검토용 미리보기</title><style>${css}</style></head><body><div id="app"></div><div id="toast" role="status" aria-live="polite"></div><script type="module">${modules.join('\n').replaceAll('</script','<\\/script')}</script></body></html>`;
await mkdir(path.dirname(output),{recursive:true});await writeFile(output,html);console.log('Portable preview saved: '+output);
