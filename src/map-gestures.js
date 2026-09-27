// Transform the map, pins and current position together. UI controls stay fixed.
export function bindMapGestures(canvas){
 if(!canvas)return;
 const scene=canvas.querySelector('.map-scene'),points=new Map();
 // Extend the original SVG pattern itself, so zooming out has no separate tile edge.
 const drawing=scene.querySelector('.map-drawing');
 const ground=drawing.querySelector(':scope > rect');
 const coverGround=()=>{
  const matrix=drawing.getScreenCTM();if(!matrix)return;
  const inverse=matrix.inverse(),r=canvas.getBoundingClientRect();
  const a=new DOMPoint(r.left,r.top).matrixTransform(inverse),b=new DOMPoint(r.right,r.bottom).matrixTransform(inverse);
  ground.setAttribute('x',a.x-1000);ground.setAttribute('y',a.y-1000);
  ground.setAttribute('width',b.x-a.x+2000);ground.setAttribute('height',b.y-a.y+2000);
 };
 drawing.querySelectorAll(':scope > path').forEach(path=>{
  const d=path.getAttribute('d');
  if(d.startsWith('M-50 720'))path.setAttribute('d',d.replace('M-50 720','M-50000 33500 L-50 720')+' L50000 -19000');
  if(d.startsWith('M250-50'))path.setAttribute('d',d.replace('M250-50','M-15000-50000 L250-50')+' L22000 50000');
 });
 const STEP=1.5,MIN=STEP**-3,MAX=STEP**3;
 const controls=document.createElement('div');controls.className='map-zoom-controls';controls.innerHTML='<button type="button" data-zoom="1" aria-label="지도 확대">+</button><button type="button" data-zoom="-1" aria-label="지도 축소">−</button>';canvas.appendChild(controls);
 let scale=1,x=0,y=0,previous=null,moved=false,start=null,blockClick=false;
 const metrics=()=>{const p=[...points.values()];return p.length>1?{x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2,d:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)}:{...p[0],d:0};};
 const paint=()=>{scene.style.transform=`translate(${x}px,${y}px) scale(${scale})`;coverGround();controls.querySelector('[data-zoom="1"]').disabled=scale>=MAX-1e-6;controls.querySelector('[data-zoom="-1"]').disabled=scale<=MIN+1e-6;};
 const position=e=>{const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
 const zoom=(next,cx,cy)=>{next=Math.max(MIN,Math.min(MAX,next));const ratio=next/scale;x=cx-(cx-x)*ratio;y=cy-(cy-y)*ratio;scale=next;};
 const down=e=>{if(e.target.closest('button')||e.button>0)return;points.set(e.pointerId,position(e));previous=metrics();if(points.size===1){start=previous;moved=false;blockClick=false;}};
 const move=e=>{if(!points.has(e.pointerId))return;points.set(e.pointerId,position(e));const current=metrics();if(points.size>1&&previous.d){zoom(scale*current.d/previous.d,previous.x,previous.y);moved=true;}if(previous){x+=current.x-previous.x;y+=current.y-previous.y;}if(start&&Math.hypot(current.x-start.x,current.y-start.y)>6)moved=true;previous=current;paint();};
 const up=e=>{if(!points.has(e.pointerId))return;points.delete(e.pointerId);blockClick=moved;previous=points.size?metrics():null;};
 const click=e=>{if(blockClick&&!e.target.closest('button')){e.preventDefault();e.stopPropagation();blockClick=false;}};
 const control=e=>{const button=e.target.closest('[data-zoom]');if(!button)return;zoom(scale*STEP**Number(button.dataset.zoom),canvas.clientWidth/2,canvas.clientHeight/2);paint();};
 const drag=e=>e.preventDefault();
 controls.addEventListener('click',control);canvas.addEventListener('dragstart',drag);
 const wheel=e=>{if(e.target.closest('button'))return;e.preventDefault();const p=position(e);zoom(scale*Math.exp(-e.deltaY*.002),p.x,p.y);paint();};
 coverGround();
 canvas.addEventListener('pointerdown',down);window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);canvas.addEventListener('click',click,true);canvas.addEventListener('wheel',wheel,{passive:false});
 return ()=>{controls.remove();canvas.removeEventListener('dragstart',drag);canvas.removeEventListener('pointerdown',down);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);canvas.removeEventListener('click',click,true);canvas.removeEventListener('wheel',wheel);};
}
