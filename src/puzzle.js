import {asset} from './data.js';
import {tasteImages} from './taste.js';

// Shared boundaries are generated once: neighboring pieces use the SAME curve
// in reverse, so every tab fits its slot without gaps or overlapping images.
// Construct clockwise paths directly, using complementary neighbor sides.
function edge(x,y,dx,dy,bump=0){
 const pt=(along,normal=0)=>`${x+dx*along-dy*normal} ${y+dy*along+dx*normal}`;
 if(!bump)return `L ${pt(160)}`;
 return `L ${pt(58)} C ${pt(72)} ${pt(53,bump)} ${pt(80,bump)} C ${pt(107,bump)} ${pt(88)} ${pt(102)} L ${pt(160)}`;
}
export function piecePath(i){
 const col=i%2,row=Math.floor(i/2),x=col*160,y=row*160;
 // Top and bottom opposite orientation; tab signs complement across rows.
 const top=row===0?0:((row-1+col)%2?19:-19);
 const right=col===1?0:(row%2?19:-19);
 const bottom=row===2?0:((row+col)%2?-19:19);
 const left=col===0?0:(row%2?-19:19);
 return `M ${x} ${y} ${edge(x,y,1,0,top)} ${edge(x+160,y,0,1,right)} ${edge(x+160,y+160,-1,0,bottom)} ${edge(x,y+160,0,-1,left)} Z`;
}
export function puzzleMarkup(ids,{assemble=false}={}) {
 const entries=ids.map(id=>tasteImages.find(t=>t.id===id)).filter(Boolean);
 return `<div class="puzzle-stage ${assemble?'assembling':'completed'}" data-puzzle-stage>
 <svg class="taste-puzzle" viewBox="-35 -35 390 550" role="group" aria-label="나의 취향을 담은 6조각 퍼즐">
 <defs>${entries.map((t,i)=>`<clipPath id="piece-clip-${i}"><path d="${piecePath(i)}"/></clipPath>`).join('')}</defs>
 ${entries.map((t,i)=>{const x=(i%2)*160,y=Math.floor(i/2)*160;return `<g class="puzzle-piece" data-piece="${i}" data-image="${t.id}" role="button" tabindex="0" aria-label="${t.title} 퍼즐 조각" aria-pressed="false" style="--i:${i};--cx:${x+80}px;--cy:${y+80}px;--from-x:${[-250,280,-310,330,-220,240][i]}px;--from-y:${[-210,-180,40,70,250,260][i]}px;--rotation:${[-18,17,12,-16,-13,20][i]}deg"><g class="piece-zoom" style="transform-origin:${x+80}px ${y+80}px"><image href="${asset(t.image)}" x="${x-22}" y="${y-22}" width="204" height="204" preserveAspectRatio="xMidYMid slice" clip-path="url(#piece-clip-${i})"/><path d="${piecePath(i)}" fill="none" stroke="#070707" stroke-width="2.2" pointer-events="none"/></g></g>`;}).join('')}
 </svg></div>`;
}
