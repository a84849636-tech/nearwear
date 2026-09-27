import {mkdir,cp,readFile,access} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
for(const file of ['src/app.js','src/data.js','src/taste.js','src/puzzle.js'])execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
for(const file of ['src/v21.css','public/assets/interior.jpg','public/assets/rack.jpg','public/assets/exterior.png','public/assets/bag.png','public/assets/shoes.png','public/assets/accessory.png'])await access(file);
await mkdir('dist',{recursive:true});
for(const file of ['index.html','src','public'])await cp(file,`dist/${file}`,{recursive:true});
console.log('Build complete: dist/ — JavaScript syntax and required assets checked.');
