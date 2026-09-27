import {asset,styles,stores,products,posts,stories,postsFor} from './data.js';
import {tasteImages,discoveryDeck,computeTaste,matchScore,choosePuzzle} from './taste.js';
import {puzzleMarkup} from './puzzle.js';
import {bindMapGestures} from './map-gestures.js';
const locationLabel=value=>value==='합정 · 상수'?'HAPJEONG · SANGSU':value;
const app=document.querySelector('#app');
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem('nw-'+key))??fallback;}catch{return fallback;}};
const state={saved:read('saved',[]),likes:read('likes',[]),preferences:read('preferences',[]),reservations:read('reservations',[]),search:'',style:'ALL',open:false,distance:3,category:'ALL'};
Object.assign(state,{
 savedItems:read('savedItems',[]),tasteSaved:read('tasteSaved',[]),tasteVotes:read('tasteVotes',{}),
 explorePreference:read('explorePreference','ALL'),puzzle:read('puzzle',null),
 discovery:read('discovery',{index:0,answers:[],complete:false}),mapFilters:read('mapFilters',{}),
 location:read('location','홍대 · 연남'),notifications:read('notifications',false),mapMode:'FOR YOUR TASTE'
});
Object.assign(state,state.mapFilters);

const write=key=>{try{localStorage.setItem('nw-'+key,JSON.stringify(state[key]));}catch{toast('저장하지 못했어요. 브라우저 설정을 확인해 주세요.');}};
const money=n=>'₩'+n.toLocaleString('ko-KR');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(name)=>{const paths={arrow:'M5 12h14m-6-6 6 6-6 6',back:'m14 6-6 6 6 6',close:'m6 6 12 12M6 18 18 6',heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',map:'m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16',user:'M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',locate:'M12 2v4m0 12v4M2 12h4m12 0h4M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z',direction:'m21 3-7 18-3-8-8-3 18-7Z',bag:'M5 7h14l1 14H4L5 7Zm3 0V5a4 4 0 0 1 8 0v2',check:'m5 12 4 4L19 6',grid:'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(paths[name]||paths.arrow).split('NO').map(d=>`<path d="${d}"/>`).join('')}</svg>`;};
const img=(name,alt,cls='')=>`<img class="${cls}" src="${asset(name)}" alt="${escape(alt)}" loading="lazy">`;
const go=path=>{rememberScroll();if(location.hash.slice(1)===path)render();else location.hash=path;};
const route=()=>{const p=(location.hash.slice(1)||'/splash').split('/').filter(Boolean);return {view:p[0]||'splash',id:p[1],sub:p[2]};};
const storeOf=id=>stores.find(s=>s.id===id)||stores[0];
const productOf=id=>products.find(p=>p.id===id);
const link=(path,label,cls='')=>`<a class="${cls}" href="#${path}" ${label===icon('back')?'aria-label="뒤로 가기"':label===icon('close')?'aria-label="닫기"':''}>${label}</a>`;
const button=(action,label,cls='',extra='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
const logo=()=>'<span class="wordmark">NEARWEAR</span>';
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('visible'),2800);}
const saved=s=>state.saved.includes(s.id);
const saveButton=s=>button('save',icon('heart'),'icon-button '+(saved(s)?'is-saved':''),`data-id="${s.id}" aria-label="${saved(s)?'찜 해제':'매장 찜'}" aria-pressed="${saved(s)}"`);
const status=(p,s=storeOf(route().id))=>{const value=availabilityOf(p,s);return `<span class="stock ${value==='SOLD'?'sold':value==='RESERVED'?'reserved':''}">${value}</span>`;};
const nav=active=>`<nav class="bottom-nav" aria-label="주 메뉴">${[['map','MAP','map'],['explore','EXPLORE','grid'],['saved','SAVED','heart'],['my','MY','user']].map(([p,t,i])=>link('/'+p,icon(i)+`<span>${t}</span>`,active===p?'active':'')).join('')}</nav>`;
function shell(content,{active='map',dark=false,wide=false,back='',title='NEARWEAR'}={}){return `<div class="app-shell ${dark?'dark-shell':''}"><aside class="sidebar">${link('/map',logo(),'brand')}<div class="side-intro"><span class="eyebrow">VINTAGE AROUND YOU</span></div><nav class="side-nav">${[['map','주변 매장','map'],['explore','EXPLORE','grid'],['saved','저장한 매장','heart'],['my','나의 예약','user']].map(([p,t,i])=>link('/'+p,icon(i)+t+(p===active?'<span>↗</span>':''),p===active?'active':'')).join('')}</nav><div class="side-foot"><span>서울 · LOCAL STORES</span></div></aside><main class="main ${wide?'wide':''}" id="main"><header class="topbar">${back?link(back,icon('back'),'icon-button back-link'):link('/map','NEARWEAR','mobile-brand')}<span class="topbar-title">${title}</span></header>${content}</main>${nav(active)}</div>`;}
let activePath=location.hash.slice(1)||'/splash';
const scrollPositions=read('scrollPositions',{});
let viewCleanups=[],puzzleResultTimer=null,decisionBusy=false;
const motionBehavior=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
function later(fn,ms){const id=setTimeout(fn,ms);viewCleanups.push(()=>clearTimeout(id));return id;}
function cleanupView(){for(const fn of viewCleanups)fn();viewCleanups=[];decisionBusy=false;puzzleResultTimer=null;}
function rememberScroll(){scrollPositions[activePath]=window.scrollY;try{localStorage.setItem('nw-scrollPositions',JSON.stringify(scrollPositions));}catch{}}
function tasteProfile(){return computeTaste(state.tasteVotes,state.tasteSaved,state.preferences);}
function tasteTitle(p=tasteProfile()){return p.styles.length?p.styles.join(' / ').toUpperCase():'OPEN TASTE';}
function tasteFeatures(p=tasteProfile()){return p.features.length?p.features.join(' · '):'다양한 스타일을 둘러보세요.';}
function rankedStores(){const p=tasteProfile();return [...stores].sort((a,b)=>matchScore(b,p,state.explorePreference)-matchScore(a,p,state.explorePreference));}
function isMatched(s){return tasteProfile().styles.length>0&&rankedStores().slice(0,2).some(x=>x.id===s.id)&&matchScore(s,tasteProfile(),state.explorePreference)>0;}
function matchLabel(s){return isMatched(s)?'<span class="taste-match">✳ FOR YOUR TASTE</span>':'';}
function preferenceControl(){return `<div class="preference-switch" aria-label="Explore Preference">${['WOMENSWEAR','MENSWEAR','ALL'].map(x=>button('explore-preference',x,state.explorePreference===x?'selected':'',`data-id="${x}" aria-pressed="${state.explorePreference===x}"`)).join('')}</div>`;}
function saveMapFilters(){state.mapFilters={search:state.search,style:state.style,open:state.open,distance:state.distance,mapMode:state.mapMode};write('mapFilters');}
function reservationState(r){if(r.status==='CANCELLED')return 'CANCELLED';if(r.status==='EXPIRED'||new Date(`${r.date}T${r.time}:00`).getTime()<Date.now())return 'EXPIRED';return 'RESERVED';}
function activeReservation(p,s){return state.reservations.find(r=>r.product===p.id&&r.store===s.id&&reservationState(r)==='RESERVED');}
function availabilityOf(p,s){if(!p.stock)return 'SOLD';return activeReservation(p,s)?'RESERVED':'AVAILABLE';}
function itemSaveButton(s,p){const on=state.savedItems.some(x=>x.product===p.id&&x.store===s.id);return button('save-item',on?'ITEM SAVED':'SAVE ITEM','outline full',`data-store="${s.id}" data-id="${p.id}" aria-pressed="${on}"`);}
function tasteAction(s,p){const id=s.id+':'+p.id,on=state.tasteSaved.some(t=>t.id===id);return button('add-taste',on?'ADDED TO TASTE':'ADD TO TASTE','outline full add-taste',`data-store="${s.id}" data-id="${p.id}" aria-pressed="${on}"`);}
function storeCard(s,image=s.cover){return `<article class="explore-shop">${link(`/preview/${s.id}`,img(image,s.name))}<div class="row"><div><h2>${link('/shop/'+s.id+'/feed',s.name)}</h2><p>${s.styles.join(' · ')} · ${s.distance} km</p>${matchLabel(s)}</div>${saveButton(s)}</div></article>`;}
function gallery(images,{kind='hero',close=''}={}){return `<div class="gallery ${kind}-gallery" data-gallery><div class="carousel" tabindex="0" aria-label="${kind==='product'?'상품':'매장'} 사진. 좌우로 넘겨보세요">${images.map((entry,i)=>`<figure data-label="${entry.label||({interior:'INTERIOR',rail:'ON THE RAIL',rack:'ON THE RAIL',exterior:'EXTERIOR'})[entry.image]||''}" class="${entry.detail?'detail-crop':''}">${img(entry.image,entry.label||['매장 내부','매장 진열대','매장 공간'][i])}</figure>`).join('')}</div>${close?link(close,icon('close'),'preview-close icon-button'):''}<span class="photo-label" data-photo-label></span><div class="carousel-control">${button('prev-photo','‹','','aria-label="이전 사진"')}<span data-photo-count aria-live="polite">1 / ${images.length}</span>${button('next-photo','›','','aria-label="다음 사진"')}</div></div>`;}
function exploreView(){
 const ranked=rankedStores(),near=[...stores].sort((a,b)=>a.distance-b.distance),different=[...ranked].reverse();
 const sections=[{title:'FOR YOUR TASTE',list:ranked.slice(0,2),images:ranked.slice(0,2).map(s=>s.cover)},{title:'NEAR YOU',list:near.slice(0,2),images:['exterior','interior']},{title:'NEW IN',list:[stores[2],stores[3]],images:['accessory','coat']},{title:'TRY SOMETHING DIFFERENT',list:different.slice(0,2),images:different.slice(0,2).map(s=>postsFor(s.id)[1].image)}];
 return shell(`<section class="explore-page"><header><h1>EXPLORE</h1></header>${sections.map(section=>`<section class="explore-section"><h2>${section.title}</h2><div class="explore-grid">${section.list.map((s,i)=>storeCard(s,section.images[i])).join('')}</div></section>`).join('')}</section>`,{active:'explore',title:'EXPLORE'});
}
function ensurePuzzle(){if(!state.puzzle||state.puzzle.ids?.length!==6){state.puzzle={ids:choosePuzzle(state.tasteVotes,tasteProfile()),seen:false};write('puzzle');}return state.puzzle;}
function resultContent(){const p=tasteProfile();return `<section class="taste-result" data-result><span class="eyebrow">YOUR TASTE</span><h1>${tasteTitle(p)}</h1><div><span class="eyebrow">YOU SEEM TO LIKE</span><p>${tasteFeatures(p)}</p></div>${link('/map','FIND YOUR PLACES '+icon('arrow'),'primary full')}${link('/puzzle','VIEW MY PUZZLE','text-link')}</section>`;}
function tasteResult(){const puzzle=ensurePuzzle();return `<main class="taste-result-screen ${puzzle.seen?'show-result':''}">${puzzle.seen?resultContent():`<section class="puzzle-sequence"><p class="assembly-caption">Putting your taste together...</p>${puzzleMarkup(puzzle.ids,{assemble:true})}<p class="puzzle-hint">TAP A PIECE</p></section>${resultContent()}`}</main>`;}
function puzzleReplay(){const puzzle=ensurePuzzle();return `<main class="puzzle-replay"><header>${link('/my',icon('back'),'icon-button')}<h1>MY PUZZLE</h1></header>${puzzleMarkup(puzzle.ids)}<p>TAP A PIECE TO EXPLORE</p>${link('/your-taste','YOUR TASTE RESULT '+icon('arrow'),'outline')}</main>`;}
function finishDiscovery(){state.puzzle={ids:choosePuzzle(state.tasteVotes,tasteProfile()),seen:false};write('puzzle');state.discovery={index:0,answers:[],complete:true};write('discovery');go('/your-taste');}
function voteTaste(id,vote){
 if(decisionBusy)return;decisionBusy=true;
 state.tasteVotes[id]=vote;write('tasteVotes');
 if(!state.discovery.answers.includes(id))state.discovery.answers.push(id);write('discovery');
 const deck=discoveryDeck(state.explorePreference),index=deck.findIndex(t=>t.id===id);
 const next=[...deck.slice(index+1),...deck.slice(0,index+1)].find(t=>!state.discovery.answers.includes(t.id));
 const current=document.querySelector(`[data-taste-id="${id}"]`);current?.classList.add('decided');const likeButton=current?.querySelector('[data-action="taste-like"]');if(likeButton){likeButton.textContent=vote==='like'?'LIKED':'LIKE';likeButton.setAttribute('aria-pressed',vote==='like');}
 if(!next){later(finishDiscovery,300);return;}
 state.discovery.index=deck.indexOf(next);write('discovery');
 const el=document.querySelector('.taste-scroll'),slide=document.querySelector(`[data-taste-id="${next.id}"]`);
 el.scrollTo({top:slide.offsetTop-(el.clientHeight-slide.clientHeight)/2,behavior:motionBehavior()});
 later(()=>{decisionBusy=false;current?.classList.remove('decided');},400);
}
function mountTasteViews(){
 const r=route();
 if(['splash','start'].includes(r.view)){later(()=>{if(state.discovery.complete){state.discovery={index:0,answers:[],complete:false};write('discovery');}go('/taste');},10000);}
 if(['taste','preferences'].includes(r.view)){
 const el=document.querySelector('.taste-scroll'),slides=[...el.children];
 const select=()=>{const center=el.getBoundingClientRect().top+el.clientHeight/2;let index=0,distance=Infinity;for(let i=0;i<slides.length;i++){const b=slides[i].getBoundingClientRect(),d=Math.abs(b.top+b.height/2-center);if(d<distance){index=i;distance=d;}}slides.forEach((slide,i)=>slide.classList.toggle('current',i===index));state.discovery.index=index;write('discovery');document.querySelector('#taste-progress').textContent=String(index+1).padStart(2,'0')+' / 12';};
 const slide=slides[Math.min(state.discovery.index,slides.length-1)];el.scrollTo({top:slide.offsetTop-(el.clientHeight-slide.clientHeight)/2,behavior:'instant'});select();
 el.addEventListener('scroll',select,{passive:true});viewCleanups.push(()=>el.removeEventListener('scroll',select));
 }
 if(r.view==='your-taste'&&!state.puzzle.seen){
 later(()=>{document.querySelector('.puzzle-stage')?.classList.add('completed');document.querySelector('.assembly-caption').textContent='YOUR TASTE';},3400);
 puzzleResultTimer=later(showTasteResult,7800);
 }
}
function showTasteResult(){if(route().view!=='your-taste')return;state.puzzle.seen=true;write('puzzle');document.querySelector('.taste-result-screen')?.classList.add('show-result');}
function selectPuzzlePiece(piece){
 const stage=piece.closest('[data-puzzle-stage]');if(!stage.classList.contains('completed'))return;
 clearTimeout(puzzleResultTimer);const was=piece.classList.contains('selected');stage.querySelectorAll('.puzzle-piece').forEach(p=>{p.classList.remove('selected');p.setAttribute('aria-pressed','false');});stage.classList.toggle('has-selection',!was);
 if(!was){piece.classList.add('selected');piece.setAttribute('aria-pressed','true');piece.parentElement.appendChild(piece);}else if(route().view==='your-taste')puzzleResultTimer=later(showTasteResult,2400);
}
function clearPuzzleSelection(){const stage=document.querySelector('[data-puzzle-stage]');if(!stage?.classList.contains('has-selection'))return;stage.classList.remove('has-selection');stage.querySelectorAll('.puzzle-piece').forEach(p=>{p.classList.remove('selected');p.setAttribute('aria-pressed','false');});if(route().view==='your-taste')puzzleResultTimer=later(showTasteResult,2400);}

function splash(){return `<main class="start-screen" aria-label="NEARWEAR"><div class="start-mark">${logo()}</div></main>`;}
function preferences(){
 const deck=discoveryDeck(state.explorePreference);
 return `<main class="taste-discovery"><header class="taste-header"><h1>TASTE DISCOVERY</h1></header>${preferenceControl()}
 <div class="taste-scroll" aria-label="취향 이미지 탐색" tabindex="0">${deck.map((t,i)=>`<article class="taste-slide ${i===state.discovery.index?'current':''}" data-index="${i}" data-taste-id="${t.id}"><div class="taste-image">${img(t.image,t.title)}</div><div class="taste-actions">${button('taste-skip','SKIP','',`data-id="${t.id}" aria-label="${t.title} SKIP"`)}${button('taste-like',state.tasteVotes[t.id]==='like'?'LIKED':'LIKE','',`data-id="${t.id}" aria-label="${t.title} LIKE" aria-pressed="${state.tasteVotes[t.id]==='like'}"`)}</div></article>`).join('')}</div>
 <footer class="taste-footer"><span id="taste-progress">${String(state.discovery.index+1).padStart(2,'0')} / 12</span></footer></main>`;
}
function filteredStores(){return stores.filter(s=>(!state.search||`${s.name} ${s.styles.join(' ')} ${s.area}`.toLowerCase().includes(state.search.toLowerCase()))&&(state.style==='ALL'||s.styles.includes(state.style))&&(!state.open||s.open)&&s.distance<=state.distance);}
function mapSvg(){return `<svg class="map-drawing" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-label="주변 매장 지도"><defs><pattern id="blocks" width="125" height="115" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><rect width="125" height="115" fill="#171a1d"/><rect x="7" y="7" width="49" height="40" rx="2" fill="#22262a"/><rect x="64" y="7" width="52" height="40" rx="2" fill="#202429"/><rect x="7" y="56" width="109" height="48" rx="2" fill="#202429"/></pattern></defs><rect width="1000" height="1000" fill="url(#blocks)"/><path d="M-50 720Q270 510 430 500T1050 260" fill="none" stroke="#30353a" stroke-width="48"/><path d="M250-50Q360 310 430 500T660 1050" fill="none" stroke="#30353a" stroke-width="35"/><path d="M-50 720Q270 510 430 500T1050 260" fill="none" stroke="#4d545b" stroke-width="3" stroke-dasharray="9 9"/><path d="M750 50 825 35 935 228 860 266Z" fill="#252e29"/><path d="M80 175 180 145 240 275 133 310Z" fill="#252e29"/><g fill="#7e858c" font-family="sans-serif" font-size="18"><text x="710" y="160" transform="rotate(60 710 160)">경의선숲길</text><text x="240" y="375" transform="rotate(-20 240 375)">양화로</text><text x="450" y="755" transform="rotate(68 450 755)">와우산로</text><text x="130" y="610">합정동</text><text x="620" y="365">서교동</text><text x="660" y="90">연남동</text><text x="610" y="830">상수동</text></g><g fill="#4e565d"><rect x="380" y="460" width="95" height="30" rx="15"/></g><text x="395" y="481" font-size="14" fill="#fff">홍대입구</text></svg>`;}
function mapView(previewId){
 const s=previewId?storeOf(previewId):null;
 return shell(`<section class="discover-head"><div><span class="eyebrow">SEOUL</span><h1>${escape(locationLabel(state.location))}</h1></div>${button('locate',icon('locate'),'icon-button','aria-label="현재 위치"')}</section>
 <section class="map-workspace"><div class="map-tools"><label class="search">${icon('search')}<input id="search" placeholder="매장, 스타일, 동네 검색" value="${escape(state.search)}" aria-label="매장 검색"></label><div class="filter-row"><label class="filter"><span>STYLE</span><select id="style-filter" aria-label="스타일 필터"><option value="ALL">ALL</option>${styles.map(t=>`<option ${state.style===t?'selected':''}>${t}</option>`).join('')}</select></label>${button('open-filter','OPEN NOW','filter '+(state.open?'selected':''),`aria-pressed="${state.open}"`)}<label class="filter"><select id="distance-filter" aria-label="거리 필터">${[0.5,1,2,3].map(n=>`<option value="${n}" ${state.distance===n?'selected':''}>${n} km 이내</option>`).join('')}</select></label></div></div>
 <div class="map-modes" aria-label="매장 강조 방식">${['FOR YOUR TASTE','ALL SHOPS','SAVED'].map(mode=>button('map-mode',mode,state.mapMode===mode?'active':'',`data-id="${mode}" aria-pressed="${state.mapMode===mode}"`)).join('')}</div><div class="map-canvas"><div class="map-scene">${mapSvg()}<div id="pins">${pins()}</div><div class="current-location" style="left:42%;top:57%"><span></span><small>현재 위치</small></div></div>${button('locate',icon('locate'),'locate-button icon-button','aria-label="현재 위치로 이동"')}</div><div class="map-bottom"><span id="result-count">${filteredStores().length} SHOPS</span><span class="map-legend"><i></i> FOR YOUR TASTE</span></div>${s?preview(s):''}</section>`,{wide:true,title:'MAP'});
}
function pins(){return filteredStores().map(s=>{
 const emphasized=state.mapMode==='FOR YOUR TASTE'?isMatched(s):state.mapMode==='SAVED'&&saved(s);
 return link('/preview/'+s.id,`<span class="pin-dot">${emphasized?'✳':icon('bag')}</span><span>${s.name}${!s.open?' <small>CLOSED</small>':''}</span>`,'map-pin '+(s.id===route().id?'selected ':'')+(emphasized?(state.mapMode==='SAVED'?'saved-matched':'taste-matched'):'')).replace('class="map-pin',`style="left:${s.x}%;top:${s.y}%" class="map-pin`);
 }).join('')||'<p class="empty-map">검색 결과가 없어요.<br>검색어나 필터를 바꿔보세요.</p>';}
function preview(s){return `<section class="preview-card" aria-label="${s.name} 매장 미리보기">${gallery(s.gallery.map(image=>({image})),{kind:'preview',close:'/map'})}<div class="preview-info"><div class="row"><h2>${s.name}</h2>${saveButton(s)}</div><p>${s.styles.join(' · ')}</p><div class="preview-meta"><span>${s.distance} km</span><span class="${s.open?'open-status':'muted'}">${s.open?'OPEN · '+s.close:'CLOSED'}</span></div>${matchLabel(s)}${link('/shop/'+s.id+'/feed','VIEW SHOP '+icon('arrow'),'primary full')}</div></section>`;}
function profile(s,tab='feed'){
 const feed=postsFor(s.id);
 return shell(`<div class="shop-hero">${gallery(s.gallery.map(image=>({image})),{kind:'hero'})}</div><section class="shop-header"><div class="shop-identity">${img(s.cover,s.name+' 매장 프로필','avatar')}<div><h1>${s.name}</h1><p>${s.styles.join(' / ')}</p></div>${saveButton(s)}</div><div class="shop-meta"><span>${s.area} · ${s.distance} km</span><span class="${s.open?'open-status':''}">${s.open?'OPEN UNTIL '+s.close:'CLOSED'}</span></div><div class="row">${matchLabel(s)||'<span></span>'}${link('/directions/'+s.id,icon('direction')+' 길찾기','outline small')}</div><div class="stories" aria-label="매장 스토리">${stories.map((story,i)=>link(`/story/${s.id}/${i}`,`<span>${img(i===1?s.cover:story.image,story.name+' 스토리')}</span><b>${story.name}</b>`)).join('')}</div></section><nav class="shop-tabs" aria-label="매장 콘텐츠">${['feed','items','info'].map(t=>link(`/shop/${s.id}/${t}`,t.toUpperCase(),t===tab?'active':'')).join('')}</nav>
 ${tab==='feed'?`<div class="feed-grid">${feed.map(p=>link(`/post/${s.id}/${p.id}`,img(p.image,p.caption),'feed-tile')).join('')}</div>`:tab==='items'?`<div class="category-row">${['ALL','OUTER','TOP','BOTTOM','BAG','SHOES','ACCESSORIES'].map(c=>button('category',c,state.category===c?'active':'',`data-id="${c}"`)).join('')}</div><div class="product-grid">${products.filter(p=>state.category==='ALL'||p.category===state.category).map(p=>productCard(p,s)).join('')}</div>`:`<section class="info-section"><h2>${s.name}</h2><p>${s.styles.join(' · ')}</p><dl><dt>LOCATION</dt><dd>${s.address}</dd><dt>HOURS</dt><dd>13:00 — ${s.close}<small>오늘 ${s.open?'정상 영업':'휴무'}</small></dd><dt>CONTACT</dt><dd>hello@${s.id}.example</dd></dl>${link('/directions/'+s.id,'지도 보기 '+icon('direction'),'outline')}</section>`}`,{back:'/preview/'+s.id,title:'SHOP / '+s.area});
}
function productCard(p,s){return link(`/product/${s.id}/${p.id}`,`<div class="product-image">${img(p.image,p.ko)}${status(p,s)}</div><div class="product-caption"><span>${p.category}</span><h3>${p.name}</h3><b>${money(p.price)}</b></div>`,'product-card');}
function storyView(s,index){const i=Math.max(0,Math.min(3,Number(index)||0)),t={...stories[i]};if(i===1){t.title=s.open?'OPEN TODAY':'CLOSED TODAY';t.text=s.open?'13:00 — '+s.close:'오늘은 쉬어갑니다.';t.image=s.cover;}return `<main class="story-screen"><div class="story-frame">${img(t.image,t.title,'story-background')}<div class="story-shade"></div><div class="story-progress">${stories.map((_,j)=>`<span class="${j<=i?'viewed':''}"></span>`).join('')}</div><header class="story-header">${img(s.cover,s.name,'avatar')}<div><strong>${s.name}</strong><small>${t.name} · ${t.time}</small></div>${link(`/shop/${s.id}/feed`,icon('close'),'icon-button')}</header><div class="story-arrows">${i>0?link(`/story/${s.id}/${i-1}`,'‹','story-arrow'): '<span></span>'}${i<3?link(`/story/${s.id}/${i+1}`,'›','story-arrow'):link(`/shop/${s.id}/feed`,'✓','story-arrow')}</div><div class="story-copy"><span class="eyebrow">${t.name} / ${i+1} OF 4</span><h1>${t.title}</h1><p>${t.text}</p>${t.items?link(`/shop/${s.id}/items`,'VIEW ITEMS '+icon('arrow'),'primary light'):link(`/shop/${s.id}/info`,'STORE INFO '+icon('arrow'),'outline light')}</div></div></main>`;}
function postView(s,id,items=false){
 const p=posts.find(x=>x.id===id)||posts[0];
 return shell(`<section class="post-page"><div class="post-byline">${img(s.cover,s.name,'avatar')}<div><b>${s.name}</b><small>${s.area} · 2시간 전</small></div></div>${img(p.image,p.caption,'post-photo')}<div class="post-copy"><p>${p.caption}</p><p class="muted">${p.tags}</p>${tasteAction(s,p)}${items?`<div class="photo-items"><h2>사진 속 상품 <small>${p.items.length}</small></h2>${p.items.length?p.items.map(id=>productRow(productOf(id),s)).join(''):`<p class="empty">연결된 상품이 없어요.</p>${link(`/shop/${s.id}/items`,'전체 상품 보기 '+icon('arrow'),'outline full')}`}</div>`:link(`/photo-items/${s.id}/${p.id}`,icon('bag')+' 사진 속 상품 보기 '+`<span>${p.items.length} ITEMS ↗</span>`,'primary full')}</div></section>`,{back:items?`/post/${s.id}/${p.id}`:`/shop/${s.id}/feed`,title:items?'ITEMS IN PHOTO':'FEED'});
}
function productRow(p,s){return link(`/product/${s.id}/${p.id}`,`${img(p.image,p.ko)}<div><span>${p.name}</span><b>${money(p.price)}</b>${status(p,s)}</div>${icon('arrow')}`,'product-row');}
function productView(s,p){
 if(!p)return notFound();const availability=availabilityOf(p,s),r=activeReservation(p,s);
 return shell(`<section class="product-detail"><div class="detail-visual">${gallery(p.images,{kind:'product'})}</div><div class="detail-copy"><span class="eyebrow">${s.name} / ${p.category}</span><h1>${p.name}</h1><p class="product-korean">${p.ko}</p><div class="price-row"><b>${money(p.price)}</b>${status(p,s)}</div><dl><dt>SIZE</dt><dd>${p.size}</dd><dt>MEASUREMENTS</dt><dd>${p.measurements}</dd><dt>CONDITION</dt><dd>${p.condition}</dd><dt>FLAWS</dt><dd>${p.flaws}</dd><dt>STORE</dt><dd>${link('/shop/'+s.id+'/feed',s.name+' ↗')}</dd></dl><div class="item-actions">${itemSaveButton(s,p)}${availability==='AVAILABLE'?link(`/reserve/${s.id}/${p.id}`,'RESERVE '+icon('arrow'),'primary full'):button('unavailable',availability,'primary full','disabled')}</div>${r?link('/complete/'+r.id,'VIEW RESERVATION','text-link'):''}</div></section>`,{back:`/shop/${s.id}/items`,title:'ITEM'});
}
function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function dateBounds(){const min=new Date();min.setDate(min.getDate()+1);const max=new Date();max.setDate(max.getDate()+7);return {min:localDate(min),max:localDate(max)};}
function reservation(s,p){
 if(!p)return notFound();if(availabilityOf(p,s)!=='AVAILABLE')return productView(s,p);const bounds=dateBounds();
 return shell(`<section class="reservation-page"><h1>방문 예약</h1><div class="reservation-store">${s.name}</div>${productRow(p,s)}<form id="reservation-form" data-store="${s.id}" data-product="${p.id}"><label>SELECT A DATE<input type="date" id="visit-date" name="date" min="${bounds.min}" max="${bounds.max}" value="${bounds.min}" required></label><label>SELECT A TIME<select name="time" required><option value="">시간을 선택하세요</option>${Array.from({length:Number(s.close.split(':')[0])-13},(_,i)=>`<option value="${i+13}:00">${i+13}:00 — ${i+14}:00</option>`).join('')}</select></label><p class="hold-notice">예약 상품은 선택한 방문 시간까지 매장에서 보관됩니다.</p><p id="form-error" class="error" role="alert"></p><button class="primary full" type="submit">RESERVE ITEM ${icon('arrow')}</button></form></section>`,{back:`/product/${s.id}/${p.id}`,title:'RESERVATION'});
}
function complete(id){
 const r=state.reservations.find(x=>x.id===id);if(!r)return notFound();const s=storeOf(r.store),p=productOf(r.product),active=reservationState(r)==='RESERVED';if(!p)return notFound();
 return shell(`<section class="complete-page"><div class="complete-check">${icon(active?'check':'close')}</div><h1>${reservationState(r)}</h1><div class="reservation-ticket">${productRow(p,s)}<dl><dt>STORE</dt><dd>${s.name}</dd><dt>DATE</dt><dd>${r.date}</dd><dt>TIME</dt><dd>${r.time}</dd><dt>LOCATION</dt><dd>${s.address}</dd><dt>RESERVATION</dt><dd>${escape(r.id)}</dd></dl></div>${button('view-map','VIEW MAP '+icon('map'),'primary full',`data-id="${s.id}"`)}${link('/my/reservations','VIEW RESERVATION','text-link full')}${active?button('cancel-reservation','CANCEL RESERVATION','text-link',`data-id="${r.id}"`):availabilityOf(p,s)==='AVAILABLE'?link(`/reserve/${s.id}/${p.id}`,'RESERVE AGAIN '+icon('arrow'),'outline full'):''}</section>`,{active:'my',back:'/my/reservations',title:'RESERVATION'});
}
function savedView(){
 const tab=['shops','items','taste'].includes(route().id)?route().id:'shops';
 let body='';
 if(tab==='shops')body=state.saved.length?`<div class="saved-grid">${state.saved.filter(id=>stores.some(s=>s.id===id)).map(id=>storeCard(storeOf(id))).join('')}</div>`:'<p class="empty">저장한 매장이 없어요.</p>';
 if(tab==='items')body=state.savedItems.length?`<div class="product-grid">${state.savedItems.map(entry=>{const p=productOf(entry.product);return p?productCard(p,storeOf(entry.store)):'';}).join('')}</div>`:'<p class="empty">저장한 상품이 없어요.</p>';
 if(tab==='taste')body=state.tasteSaved.length?`<div class="saved-taste-grid">${state.tasteSaved.map(t=>`<article>${link(`/post/${t.store}/${t.post}`,img(t.image,'저장한 취향 사진'))}${button('remove-taste','REMOVE','text-link',`data-id="${t.id}" aria-label="취향 이미지 제거"`)}</article>`).join('')}</div>`:'<p class="empty">ADD TO TASTE로 취향을 모아보세요.</p>';
 return shell(`<section class="collection-page"><h1>SAVED</h1><nav class="saved-tabs" aria-label="저장 항목">${['shops','items','taste'].map(t=>link('/saved/'+t,t.toUpperCase(),t===tab?'active':'')).join('')}</nav>${body}</section>`,{active:'saved',title:'SAVED'});
}
function myView(){
 const profile=tasteProfile();
 return shell(`<section class="collection-page my-page"><h1>MY TASTE</h1><div class="my-taste-summary"><h2>${tasteTitle(profile)}</h2><span class="eyebrow">YOU SEEM TO LIKE</span><p>${tasteFeatures(profile)}</p></div><label class="setting-label">EXPLORE PREFERENCE<select id="explore-preference">${['ALL','WOMENSWEAR','MENSWEAR'].map(x=>`<option ${state.explorePreference===x?'selected':''}>${x}</option>`).join('')}</select></label><div class="my-actions">${button('refine','REFINE MY TASTE','outline')}${link('/puzzle','VIEW MY PUZZLE','outline')}</div><section id="my-reservations"><h2 class="section-label">RESERVATIONS <span>${state.reservations.length}</span></h2>${state.reservations.length?state.reservations.map(r=>{const s=storeOf(r.store),p=productOf(r.product);return p?`<article class="history-card"><div class="row"><span class="stock ${reservationState(r)==='RESERVED'?'':'sold'}">${reservationState(r)}</span><span>${r.date} / ${r.time}</span></div>${productRow(p,s)}${link('/complete/'+r.id,s.name+' · VIEW RESERVATION ↗','text-link')}</article>`:'';}).join(''):'<p class="empty">예약한 상품이 없어요.</p>'}</section><div class="settings"><label class="setting-label">LOCATION<select id="location-setting">${['홍대 · 연남','합정 · 상수'].map(x=>`<option value="${x}" ${state.location===x?'selected':''}>${locationLabel(x)}</option>`).join('')}</select></label><label class="notification-label"><span>NOTIFICATIONS</span><input id="notifications-setting" type="checkbox" role="switch" ${state.notifications?'checked':''} aria-label="예약 알림"></label></div></section>`,{active:'my',title:'MY'});
}
function directions(s){return shell(`<section class="directions-page"><h1>${s.name}</h1><p>${s.address}</p><div class="direction-map">${mapSvg()}<span class="direction-dot">${icon('bag')} ${s.name}</span></div>${button('view-map','VIEW MAP '+icon('map'),'primary full',`data-id="${s.id}"`)}<a class="outline full" target="_blank" rel="noopener noreferrer" href="https://map.naver.com/p/search/${encodeURIComponent(s.address)}">NAVER MAP ${icon('direction')}</a></section>`,{back:'/shop/'+s.id+'/info',title:'LOCATION'});}
function notFound(){return shell(`<section class="empty"><h1>페이지를 찾을 수 없어요.</h1>${link('/map','지도로 돌아가기','primary')}</section>`);}
function render(){
 cleanupView();const current=location.hash.slice(1)||'/splash',restoreTop=scrollPositions[current]||0,r=route(),s=storeOf(r.id);
 const views={start:splash,splash,preferences,taste:preferences,'your-taste':tasteResult,puzzle:puzzleReplay,map:()=>mapView(),preview:()=>mapView(s.id),shop:()=>profile(s,['feed','items','info'].includes(r.sub)?r.sub:'feed'),story:()=>storyView(s,r.sub),post:()=>postView(s,r.sub),'photo-items':()=>postView(s,r.sub,true),product:()=>productView(s,productOf(r.sub)),reserve:()=>reservation(s,productOf(r.sub)),complete:()=>complete(r.id),explore:exploreView,saved:savedView,my:myView,directions:()=>directions(s)};
 app.innerHTML=(views[r.view]||notFound)();document.title=`NEARWEAR — ${r.view==='shop'?s.name:r.view.toUpperCase()}`;activePath=current;
 bindCarousel();mountTasteViews();const mapCleanup=bindMapGestures(document.querySelector('.map-canvas'));if(mapCleanup)viewCleanups.push(mapCleanup);
 requestAnimationFrame(()=>{if(activePath!==current)return;window.scrollTo(0,restoreTop);if(r.view==='my'&&r.id==='reservations')document.querySelector('#my-reservations')?.scrollIntoView({block:'start'});});
}
function bindCarousel(){
 document.querySelectorAll('[data-gallery]').forEach(root=>{
 const el=root.querySelector('.carousel'),count=root.querySelector('[data-photo-count]'),label=root.querySelector('[data-photo-label]');
 const update=()=>{const i=Math.max(0,Math.min(el.children.length-1,Math.round(el.scrollLeft/el.clientWidth)));count.textContent=`${i+1} / ${el.children.length}`;if(label)label.textContent=el.children[i].dataset.label||'';};
 el.addEventListener('scroll',update,{passive:true});el.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();el.scrollBy({left:el.clientWidth*(e.key==='ArrowRight'?1:-1),behavior:motionBehavior()});}});update();
 });
}
app.addEventListener('click',e=>{
 const piece=e.target.closest('[data-piece]');if(piece){selectPuzzlePiece(piece);return;}else clearPuzzleSelection();
 const anchor=e.target.closest('a[href^="#"]');if(anchor)rememberScroll();
 const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,id=b.dataset.id;
 if(a==='save'){state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];write('saved');b.classList.toggle('is-saved',state.saved.includes(id));b.setAttribute('aria-pressed',state.saved.includes(id));b.setAttribute('aria-label',state.saved.includes(id)?'찜 해제':'매장 찜');toast(state.saved.includes(id)?'매장을 저장했어요.':'저장을 해제했어요.');if(route().view==='saved')renderKeepingScroll();if(document.querySelector('#pins'))document.querySelector('#pins').innerHTML=pins();}
 if(a==='save-item'){const store=b.dataset.store,on=state.savedItems.some(x=>x.store===store&&x.product===id);state.savedItems=on?state.savedItems.filter(x=>!(x.store===store&&x.product===id)):[...state.savedItems,{store,product:id}];write('savedItems');b.textContent=on?'SAVE ITEM':'ITEM SAVED';b.setAttribute('aria-pressed',!on);toast(on?'상품 저장을 해제했어요.':'상품을 저장했어요.');}
 if(a==='add-taste'){const store=b.dataset.store,key=store+':'+id,p=posts.find(p=>p.id===id),on=state.tasteSaved.some(t=>t.id===key);if(!on){state.tasteSaved.push({id:key,store,post:id,image:p.image});write('tasteSaved');b.textContent='ADDED TO TASTE';b.setAttribute('aria-pressed','true');toast('취향에 반영했어요.');}else toast('이미 취향에 담긴 사진이에요.');}
 if(a==='remove-taste'){state.tasteSaved=state.tasteSaved.filter(t=>t.id!==id);write('tasteSaved');renderKeepingScroll();toast('취향에서 제거했어요.');}
 if(a==='taste-like'||a==='taste-skip')voteTaste(id,a==='taste-like'?'like':'skip');
 if(a==='explore-preference'){state.explorePreference=id;write('explorePreference');state.discovery.index=0;write('discovery');render();}
 if(a==='refine'){state.discovery={index:0,answers:[],complete:false};write('discovery');go('/taste');}
 if(a==='open-filter'){state.open=!state.open;saveMapFilters();renderKeepingScroll();}
 if(a==='map-mode'){state.mapMode=id;saveMapFilters();renderKeepingScroll();}
 if(a==='locate'){state.search='';state.style='ALL';state.open=false;state.distance=3;saveMapFilters();go('/map');toast('현재 지역으로 이동했어요.');}
 if(a==='view-map'){state.search='';state.style='ALL';state.open=false;state.distance=3;saveMapFilters();go('/preview/'+id);}
 if(a==='category'){state.category=id;renderKeepingScroll();}
 if(a==='cancel-reservation'){const r=state.reservations.find(r=>r.id===id);if(r&&reservationState(r)==='RESERVED'){r.status='CANCELLED';r.cancelledAt=new Date().toISOString();write('reservations');renderKeepingScroll();toast('예약을 취소했어요.');}}
 if(a==='next-photo'||a==='prev-photo'){const el=b.closest('[data-gallery]').querySelector('.carousel'),index=Math.round(el.scrollLeft/el.clientWidth);el.scrollTo({left:Math.max(0,Math.min(el.children.length-1,index+(a==='next-photo'?1:-1)))*el.clientWidth,behavior:motionBehavior()});}
});
function renderKeepingScroll(){rememberScroll();render();}
app.addEventListener('input',e=>{if(e.target.id==='search'){state.search=e.target.value;saveMapFilters();document.querySelector('#pins').innerHTML=pins();document.querySelector('#result-count').textContent=filteredStores().length+' SHOPS';}});
app.addEventListener('change',e=>{
 if(e.target.id==='style-filter'){state.style=e.target.value;saveMapFilters();renderKeepingScroll();}
 if(e.target.id==='distance-filter'){state.distance=Number(e.target.value);saveMapFilters();renderKeepingScroll();}
 if(e.target.id==='explore-preference'){state.explorePreference=e.target.value;write('explorePreference');toast('탐색 선호를 변경했어요.');}
 if(e.target.id==='location-setting'){state.location=e.target.value;write('location');toast('탐색 지역을 변경했어요.');}
 if(e.target.id==='notifications-setting'){state.notifications=e.target.checked;write('notifications');toast(state.notifications?'예약 알림을 켰어요.':'예약 알림을 껐어요.');}
});
app.addEventListener('submit',e=>{
 if(e.target.id!=='reservation-form')return;e.preventDefault();const form=e.target,p=productOf(form.dataset.product),s=storeOf(form.dataset.store),data=new FormData(form),date=String(data.get('date')),time=String(data.get('time')),bounds=dateBounds(),error=document.querySelector('#form-error');
 // Refresh reservations immediately before committing, including other tabs.
 state.reservations=read('reservations',state.reservations);
 if(!p||availabilityOf(p,s)!=='AVAILABLE'){error.textContent='현재 예약할 수 없는 상품입니다.';return;}
 const visit=new Date(`${date}T${time}:00`),validDate=/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(visit.getTime())&&localDate(visit)===date;
 if(!validDate||date<bounds.min||date>bounds.max||!/^\d{2}:00$/.test(time)||Number(time.split(':')[0])<13||Number(time.split(':')[0])>=Number(s.close.split(':')[0])){error.textContent='방문 날짜와 영업시간을 확인해 주세요.';return;}
 const record={id:'NW-'+crypto.randomUUID().slice(0,8).toUpperCase(),store:s.id,product:p.id,date,time,status:'RESERVED',createdAt:new Date().toISOString()};state.reservations.unshift(record);write('reservations');go('/complete/'+record.id);
});
document.addEventListener('keydown',e=>{
 if(e.target.closest('[data-piece]')&&['Enter',' '].includes(e.key)){e.preventDefault();selectPuzzlePiece(e.target.closest('[data-piece]'));}
 if(e.key==='Escape'){clearPuzzleSelection();const r=route();if(r.view==='story')go('/shop/'+storeOf(r.id).id+'/feed');if(r.view==='preview')go('/map');}
});
window.addEventListener('scroll',()=>{if((location.hash.slice(1)||'/splash')===activePath)scrollPositions[activePath]=window.scrollY;},{passive:true});
window.addEventListener('beforeunload',rememberScroll);
window.addEventListener('storage',e=>{if(e.key==='nw-reservations'){state.reservations=read('reservations',[]);if(['product','complete','my','shop','saved'].includes(route().view))renderKeepingScroll();}});
window.addEventListener('hashchange',render);
history.scrollRestoration='manual';
render();
