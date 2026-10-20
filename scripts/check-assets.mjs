import {readFile} from 'node:fs/promises';
import {allAssetKeys} from '../src/advanced-data.js';
const manifest=JSON.parse(await readFile(new URL('../public/figma/assets.json',import.meta.url),'utf8'));
const missing=allAssetKeys.filter(k=>!manifest[k]);
console.log(JSON.stringify({required:allAssetKeys.length,provided:allAssetKeys.length-missing.length,missing:missing.length,missingKeys:missing},null,2));
if(missing.length)process.exitCode=1;
