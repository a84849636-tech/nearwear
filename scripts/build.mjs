import {mkdir,cp,access,readFile,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
for(const directory of ['src','scripts'])for(const file of await readdir(path.join(root,directory)))if(/\.(js|mjs)$/.test(file))execFileSync(process.execPath,['--check',path.join(root,directory,file)],{stdio:'inherit'});
for(const file of ['src/advanced.css','src/advanced-app.js','src/advanced-data.js','src/advanced-domain.js','public/figma/assets.json','public/fonts/PretendardVariable.woff2'])await access(path.join(root,file));
const manifest=JSON.parse(await readFile(path.join(root,'public/figma/assets.json'),'utf8'));
for(const [key,entry] of Object.entries(manifest)){
 const src=typeof entry==='string'?entry:entry?.src;
 if(typeof src!=='string'||!src.startsWith('/public/figma/')||src.includes('..'))throw new Error(`Invalid asset source: ${key}`);
 await access(path.join(root,src));
}
await mkdir(path.join(root,'dist'),{recursive:true});
for(const entry of ['index.html','src','public'])await cp(path.join(root,entry),path.join(root,'dist',entry),{recursive:true});
console.log('Build complete: dist/; all JavaScript parsed; assets manifest validated.');
console.log(`Original image bindings: ${Object.keys(manifest).length}. Run npm run assets:check for missing source assets.`);
