const fs=require('node:fs'),path=require('node:path');
const output=path.join(__dirname,'site-build');fs.mkdirSync(output,{recursive:true});
const files=['index.html','demo.js','demo.css','figma-app.js','figma-app.css','figma-screens.json','legacy.html','app.js','data.js','styles.css','stories.js','stories.css'];
for(const name of files)fs.copyFileSync(path.join(__dirname,name),path.join(output,name));
fs.cpSync(path.join(__dirname,'assets'),path.join(output,'assets'),{recursive:true});
console.log('Built 132 Figma screens and local assets into site-build');
