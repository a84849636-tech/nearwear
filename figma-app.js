/* Native HTML/JS implementation of the supplied Figma page. */
(async () => {
  'use strict';
  const response = await fetch('figma-screens.json');
  if (!response.ok) throw new Error('디자인 화면을 불러오지 못했습니다.');
  const screens = await response.json(), byId = new Map(screens.map(s => [s.id,s]));
  const root = document.getElementById('design');
  const reviewMode=new URLSearchParams(location.search).get('review')==='1';
  const mainFrames=['174:129','174:131','586:18','273:685','494:14621','494:14527','494:14424','494:14330','494:13547','559:140','614:870','494:13473','494:13453','494:13433','494:13374','494:13326','494:13290','225:218','225:342','260:2','174:1242','219:1236','225:3','225:119'];
  const reviewNav=document.createElement('nav');reviewNav.id='frame-navigation';reviewNav.setAttribute('aria-label','Figma 01~24 화면 검토');reviewNav.hidden=!reviewMode;document.body.prepend(reviewNav);
  function updateReviewNav(){if(!reviewMode)return;reviewNav.replaceChildren();const group=document.createElement('select');group.setAttribute('aria-label','화면 번호 선택');mainFrames.forEach((id,i)=>{const s=byId.get(id);group.add(new Option(String(i+1).padStart(2,'0')+' '+s.name.split('/').slice(1).join('/').trim(),id))});group.value=mainFrames[(current?.number||1)-1];group.onchange=()=>go(group.value);reviewNav.append(group);const variants=document.createElement('select');variants.setAttribute('aria-label','파생 화면 선택');screens.filter(s=>s.number===(current?.number||1)).sort((a,b)=>(a.store||'').localeCompare(b.store||'')||a.x-b.x).forEach(s=>variants.add(new Option((s.store?s.store+' · ':'')+s.name+' · '+s.id,s.id)));variants.value=current?.id||mainFrames[0];variants.onchange=()=>go(variants.value);reviewNav.append(variants);for(const [label,fn] of [['이전',()=>go(mainFrames[Math.max(0,(current?.number||1)-2)])],['다음',()=>go(mainFrames[Math.min(23,current?.number||1)])],['전체 화면',()=>location.hash='screens']]){const b=document.createElement('button');b.textContent=label;b.onclick=fn;reviewNav.append(b)}const mode=document.createElement('span');mode.textContent='디자인 미리보기 · 실제 로그인 아님';reviewNav.append(mode);}
  function renderBoard(){const review=document.getElementById('review');review.replaceChildren();for(let number=1;number<=24;number++){const group=document.createElement('section');group.className='screen-group';const heading=document.createElement('h2');heading.textContent=String(number).padStart(2,'0')+' '+byId.get(mainFrames[number-1]).name.split('/').slice(1).join('/').trim();group.append(heading);const cards=document.createElement('div');cards.className='screen-cards';const variants=screens.filter(s=>s.number===number).sort((a,b)=>{if(a.id===mainFrames[number-1])return -1;if(b.id===mainFrames[number-1])return 1;return(a.store||'').localeCompare(b.store||'')||a.x-b.x});variants.forEach(s=>{const a=document.createElement('a');a.href='?review=1#figma/'+s.id;a.className='screen-card';a.setAttribute('aria-label',(s.store?s.store+' ':'')+s.name+' '+s.id);const title=document.createElement('strong');title.textContent=(s.store?s.store+' · ':'')+s.name;const preview=document.createElement('div');preview.className='screen-thumbnail';const canvas=document.createElement('div');canvas.className='screen-thumbnail-canvas';canvas.style.height=s.height+'px';canvas.innerHTML=s.html;canvas.firstElementChild.style.height=s.height+'px';canvas.querySelectorAll('img').forEach(im=>im.loading='lazy');preview.append(canvas);a.append(title,preview);cards.append(a)});group.append(cards);review.append(group)}}
  const shops = {
    RYOHE:{preview:'494:13547',feed:'559:140',info:'494:13374',items:'494:13326',product:'494:13290',instagram:'ryohe.collect',map:'https://map.naver.com/p/search/료헤'},
    TTUL:{preview:'494:12838',feed:'559:182',info:'494:12665',items:'494:12617',product:'494:12581',instagram:'_______ttul',map:'https://map.naver.com/p/entry/place/2060802299'},
    OTOTO:{preview:'174:650',feed:'559:224',info:'174:900',items:'174:957',product:'174:1002',instagram:'ototo_vintage',map:'https://map.naver.com/p/entry/place/1483214369'},
    OTUVINTAGE:{preview:'494:10002',feed:'559:266',info:'494:9829',items:'494:9781',product:'494:9745',instagram:'otuvintage',map:'https://map.naver.com/p/entry/place/2034742304'},
    BALTZ:{preview:'513:60',feed:'559:56',info:'494:10538',items:'494:10490',product:'494:10454',instagram:'baltz__official',map:'https://map.naver.com/p/entry/place/2077653094'},
    PINONPIPPI:{preview:'494:11420',feed:'559:14',info:'494:11247',items:'494:11199',product:'494:11163',instagram:'pinonpippi',map:'https://map.naver.com/p/entry/place/1419126377'},
    GOWON:{preview:'494:12129',feed:'494:12097',info:'494:11956',items:'494:11908',product:'494:11872',instagram:'gowon.shop',map:'https://map.naver.com/p/entry/place/2099801274'}
  };
  const defaults={gender:'WOMENS',choices:{},result:'273:685',savedStores:['OTUVINTAGE','RYOHE','OTOTO'],savedProducts:[],filters:{styles:[],distance:'전체',open:false,recommended:false,saved:false},reservations:[],deliveries:[],store:'RYOHE'};
  const storageKey=new URLSearchParams(location.search).get('demo')==='1'?'nearwear-demo-v1':'nearwear-v3';
  let cached={};try{cached=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{}
  let state={...defaults,...cached,filters:{...defaults.filters,...cached.filters}},current,last='494:14621',timer,auth=null;
  const persist=()=>{try{localStorage.setItem(storageKey,JSON.stringify(state))}catch{notice('저장 공간을 사용할 수 없습니다.');}};
  const norm=t=>t.replace(/\s+/g,' ').trim();
  const all=(selector)=>[...root.querySelectorAll(selector)];
  const name=(value)=>all('[data-name]').filter(e=>e.dataset.name.includes(value));
  const text=(value)=>all('p').filter(e=>norm(e.textContent)===value);
  function notice(message){const e=document.getElementById('notice');e.textContent=message;clearTimeout(timer);timer=setTimeout(()=>e.textContent='',5000);}
  function activate(element,fn,label){if(!element)return;element.querySelectorAll('[role=button]').forEach(child=>{child.removeAttribute('role');child.removeAttribute('tabindex');child.removeAttribute('aria-label');child.onclick=null;child.onkeydown=null});element.tabIndex=0;element.setAttribute('role','button');element.setAttribute('aria-label',label||norm(element.textContent)||element.dataset.name);element.onclick=e=>{e.stopPropagation();fn(e)};element.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();fn(e)}};}
  const bindText=(label,fn)=>text(label).forEach(e=>activate(e,fn,label));
  const bindName=(label,fn)=>name(label).forEach(e=>activate(e,fn));
  function go(id){if(current?.id!==id)last=current?.id||last;location.hash='figma/'+id;}
  function back(){if(history.length>1)history.back();else go('494:14621');}
  const shopName=()=>state.store in shops?state.store:'RYOHE';
  function chooseShop(key,target='feed'){state.store=key;persist();go(shops[key][target]);}
  function toggle(list,id){state[list]=state[list].includes(id)?state[list].filter(x=>x!==id):[...state[list],id];persist();render();}
  const resultIds=['174:193','273:461','273:489','273:517','273:545','273:573','273:601','273:657','273:685'];
  function getImages(id){const temp=document.createElement('div');temp.innerHTML=byId.get(id).html;return [...temp.querySelectorAll('[data-name]')].filter(e=>/写真|사진|image/i.test(e.dataset.name)&&e.querySelector('img')).map(e=>({src:e.querySelector('img').getAttribute('src'),top:parseFloat(e.style.top)||0,node:e.dataset.nodeId,name:e.dataset.name}));}
  function puzzleId(){return state.gender==='MENS'?'443:39':state.gender==='ALL'?'174:1399':'443:85';}
  // Style tags assigned from each supplied taste photograph, in its displayed order.
  const tasteTags={
    MENS:[[6,8],[0,6],[3,4],[4,2],[7,5],[1,0],[5,3],[1,7],[5,3],[1,0],[4,3],[3,7]],
    ALL:[[8,7],[0,6],[5,3],[2,7],[4,3],[2,8],[0,7],[1,7],[0,3],[8,3],[1,7],[0,6]],
    WOMENS:[[4,2],[2,3],[8,6],[5,3],[1,7],[8,3],[1,6],[7,8],[5,3],[4,2],[6,0],[1,7]]
  };
  function tasteResult(decisions){
    const labels=window.NearwearTasteLabels?.[state.gender]||tasteTags[state.gender].map(tags=>tags.map(i=>resultIds[i]));
    const votes=new Map();
    Object.entries(decisions).forEach(([i,liked])=>(labels[i]||[]).forEach((id,rank)=>{if(resultIds.includes(id))votes.set(id,(votes.get(id)||0)+(liked?1:-.2)*(rank===0?2:1));}));
    const fallback=state.gender==='MENS'?'174:193':state.gender==='ALL'?'273:517':'273:685';
    return Object.values(decisions).some(Boolean)?[...votes].sort((a,b)=>b[1]-a[1]||resultIds.indexOf(a[0])-resultIds.indexOf(b[0]))[0]?.[0]||fallback:fallback;
  }
  function resultPhotos(){
    if(!['MENS','ALL'].includes(state.gender))return;
    const sources=getImages(puzzleId()).slice(0,12),category=resultIds.indexOf(current.id),choices=state.choices[state.gender]||{};
    const ranked=sources.map((photo,i)=>({photo,i,score:(tasteTags[state.gender][i].includes(category)?10:0)+(choices[i]===true?4:0)})).sort((a,b)=>b.score-a.score||a.i-b.i);
    const frames=name('사진').filter(e=>e.querySelector('img')&&!e.parentElement.closest('[data-name^="사진"]'));
    frames.slice(0,4).forEach((frame,i)=>{const img=new Image();img.src=ranked[i].photo.src;img.alt=state.gender+' 추천 스타일 '+(i+1);img.style.cssText='display:block;width:100%;height:100%;object-fit:cover';frame.replaceChildren(img);frame.style.overflow='hidden';});
  }
  function taste(){
    root.style.height='932px';root.firstElementChild.style.height='932px';
    const host=root.firstElementChild;host.innerHTML='';
    const cards=getImages(puzzleId()).slice(0,12),radius=680;
    if(cards.length!==12){notice('취향 이미지 12장을 확인하지 못했습니다.');return;}
    const area=document.createElement('div');area.className='taste-ring-viewport';area.tabIndex=0;area.setAttribute('aria-label','12장 취향 사진 세로 원통');
    const ring=document.createElement('div');ring.className='taste-ring';area.append(ring);host.append(area);
    cards.forEach((card,i)=>{const frame=document.createElement('div');frame.className='taste-ring-card';frame.dataset.tasteIndex=i;frame.style.transform=`rotateX(${-i*30}deg) translateZ(${radius}px)`;const image=new Image();image.src=card.src;image.alt=`${state.gender} 취향 이미지 ${i+1} / 12`;image.draggable=false;frame.append(image);ring.append(frame)});
    const previous=state.choices[state.gender]||{},decisions=Object.keys(previous).length===12?{}:previous;state.choices[state.gender]=decisions;
    let position=cards.findIndex((_,i)=>decisions[i]===undefined),busy=false,rotating=false,drag;
    if(position<0)position=0;let angle=position*30;
    const progress=document.createElement('p');progress.className='taste-progress';progress.setAttribute('aria-live','polite');host.append(progress);
    const buttons=[false,true].map(like=>{const button=document.createElement('button');button.className='taste-choice '+(like?'like':'skip');button.textContent=like?'LIKE':'SKIP';button.onclick=()=>decide(like);host.append(button);return button});
    const mod=n=>(n%12+12)%12;
    const update=()=>{ring.style.transform=`translateZ(${-radius}px) rotateX(${angle}deg)`;area.dataset.currentIndex=position;progress.textContent=`${Object.keys(decisions).length} / 12`;buttons.forEach(button=>button.disabled=busy||rotating||decisions[position]!==undefined);[...ring.children].forEach((frame,i)=>frame.classList.toggle('is-current',i===position));};
    async function rotate(target){if(rotating)return;rotating=true;ring.style.transition='transform 240ms cubic-bezier(.16,.7,.25,1)';angle=target;position=mod(Math.round(angle/30));update();await new Promise(resolve=>setTimeout(resolve,240));if(!area.isConnected)return;rotating=false;update();}
    const move=direction=>{if(!busy&&!rotating)rotate(angle+direction*30)};
    root.onwheel=e=>{if(e.ctrlKey)return;e.preventDefault();if(Math.abs(e.deltaY)>8)move(Math.sign(e.deltaY))};
    area.onkeydown=e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp'].includes(e.key)){e.preventDefault();move(e.key.includes('Down')?1:-1)}};
    area.onpointerdown=e=>{if(busy||rotating||e.button!==0)return;drag={y:e.clientY,angle};area.setPointerCapture(e.pointerId);ring.style.transition='none'};
    area.onpointermove=e=>{if(!drag)return;angle=drag.angle+Math.max(-30,Math.min(30,(drag.y-e.clientY)/(3.5*Math.min(1,innerWidth/430))));update()};
    area.onpointerup=e=>{if(!drag)return;const delta=drag.y-e.clientY,target=drag.angle+(Math.abs(delta)>22?Math.sign(delta)*30:0);drag=null;rotate(target)};
    area.onpointercancel=()=>{if(!drag)return;const target=drag.angle;drag=null;rotate(target)};
    async function decide(like){
      if(busy||rotating||decisions[position]!==undefined)return;busy=true;decisions[position]=like;persist();buttons[1].classList.toggle('taste-liked',like);
      let steps=1;while(steps<12&&decisions[mod(position+steps)]!==undefined)steps++;
      await rotate(angle+steps*30);if(!area.isConnected)return;
      if(Object.keys(decisions).length===12){state.result=tasteResult(decisions);persist();go(state.result);return;}
      busy=false;buttons[1].classList.remove('taste-liked');update();
    }
    ring.style.transition='none';update();requestAnimationFrame(()=>ring.style.transition='');
  }
  function viewportLayout(){
    const canvas=root.firstElementChild;if(!canvas)return;
    canvas.style.width='430px';canvas.style.borderWidth='0';canvas.style.borderRadius='0';
    const fullBleed=/지도 배경|카드 배경|내비게이션 배경|하단 메뉴|오버레이|안내 시트|상단 노치|배터리|셀룰러|Wi-Fi|스토리 배경/;
    for(const e of canvas.children){
      const label=e.dataset.name||'',x=parseFloat(e.style.left),w=parseFloat(e.style.width),y=parseFloat(e.style.top);
      if(fullBleed.test(label)||e.classList.contains('booking-sheet-backing')||e.classList.contains('map-selected-name')||e.className?.includes?.('taste-'))continue;
      if(y<48)continue;
      // Normalize content blocks, preserving edge-to-edge media and intentional inner columns.
      if(x>=18&&x<=25){e.style.left='24px';if(w>=350&&w<=390)e.style.width='382px';}
      if(/예약 양식/.test(label)&&!name('로그인 안내 시트').length){e.style.left='24px';e.style.width='382px';}
    }
    root.dataset.viewportWidth='430';root.dataset.contentGutter='24';
  }
  function styleFilterLayout(){
    if(current.id!=='454:98')return;
    const bar=name('필터').find(e=>e.dataset.name==='필터'),grid=name('스타일 카드 그리드')[0];if(!bar||!grid)return;
    bar.style.width='382px';bar.style.overflow='auto hidden';bar.style.touchAction='pan-x pan-y';bar.style.scrollbarWidth='none';bar.classList.add('style-filter-scroll');
    const cards=[...grid.querySelectorAll('[data-name^="스타일 / "]')];
    grid.style.display='grid';grid.style.gridTemplateColumns='repeat(2,187px)';grid.style.gap='8px';
    [...grid.children].forEach(row=>row.style.display='contents');
    const chips=[...bar.children];let drag,moved=false;
    bar.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag={x:e.clientX,left:bar.scrollLeft};moved=false;}});
    bar.addEventListener('pointermove',e=>{if(drag&&Math.abs(e.clientX-drag.x)>5){moved=true;bar.setPointerCapture(e.pointerId);bar.scrollLeft=drag.left+drag.x-e.clientX;}});
    bar.addEventListener('pointerup',()=>drag=null);bar.addEventListener('pointercancel',()=>drag=null);
    bar.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false;}},true);
    bar.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){bar.scrollLeft+=e.deltaY;e.preventDefault();}},{passive:false});
    const selected=new Set(state.exploreStyles||[]);
    const paintStyles=()=>{chips.forEach(chip=>{const label=norm(chip.textContent),active=label==='전체'?selected.size===0:selected.has(label);chip.style.backgroundColor=active?'#eee':'#171717';chip.setAttribute('aria-pressed',String(active));chip.querySelectorAll('p').forEach(p=>p.style.color=active?'#111':'#999');});cards.forEach(card=>{const labels=[...card.querySelectorAll('p')].map(p=>norm(p.textContent));card.style.display=!selected.size||labels.some(label=>selected.has(label))?'':'none';});};
    chips.forEach(chip=>activate(chip,()=>{const label=norm(chip.textContent);if(label==='전체')selected.clear();else if(selected.has(label))selected.delete(label);else selected.add(label);state.exploreStyles=[...selected];persist();paintStyles();chip.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'});},norm(chip.textContent)));
    paintStyles();
    cards.forEach(card=>activate(card,()=>{const label=norm(card.querySelectorAll('p')[1]?.textContent||'');state.filters.styles=[label==='재패니스'?'재패니즈':label];persist();go('494:14621');},norm(card.textContent)));
  }
  function exploreLayout(){
    const sections=['지금 눈여겨볼 빈티지샵','스타일별 발견','새로운 매장'].map((label,i)=>({id:['454:2','454:98','454:197'][i],top:parseFloat(text(label)[0]?.style.top)||0}));
    text('전체보기').forEach(label=>{
      const y=parseFloat(label.style.top),section=sections.filter(s=>s.top).sort((a,b)=>Math.abs(a.top-y)-Math.abs(b.top-y))[0];
      label.style.height='22px';label.style.lineHeight='22px';
      const arrow=name('right').sort((a,b)=>Math.abs(parseFloat(a.style.top)-y)-Math.abs(parseFloat(b.style.top)-y))[0];
      if(arrow&&Math.abs(parseFloat(arrow.style.top)-y)<30){arrow.style.top=(y+(22-parseFloat(arrow.style.height))/2)+'px';if(section)activate(arrow,()=>go(section.id),'전체보기');}
      if(section)activate(label,()=>go(section.id),'전체보기');
    });
    all('p').filter(p=>norm(p.textContent).startsWith('서울 ')).forEach(p=>{const width=400-parseFloat(p.style.left);p.textContent=norm(p.textContent);p.style.width=width+'px';p.style.whiteSpace='nowrap';const size=parseFloat(getComputedStyle(p).fontSize);if(p.scrollWidth>width)p.style.fontSize=(size*width/p.scrollWidth)+'px';});
    name('bookmark').forEach((icon,i)=>{
      const y=parseFloat(icon.style.top),title=all('p').filter(p=>parseFloat(p.style.left)>180&&Math.abs(parseFloat(p.style.top)-y)<14).sort((a,b)=>parseFloat(b.style.fontWeight||0)-parseFloat(a.style.fontWeight||0))[0];
      if(title){const line=parseFloat(getComputedStyle(title).lineHeight)||parseFloat(getComputedStyle(title).fontSize)*1.4;icon.style.top=(parseFloat(title.style.top)+(line-parseFloat(icon.style.height))/2)+'px';}
      const id=title?norm(title.textContent):current.id+':'+i;
      icon.classList.add('store-bookmark');icon.style.color='#aaa';icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>';
      const paint=()=>icon.setAttribute('aria-pressed',String((state.savedExplore||[]).includes(id)));
      activate(icon,()=>{state.savedExplore=state.savedExplore||[];state.savedExplore=state.savedExplore.includes(id)?state.savedExplore.filter(k=>k!==id):[...state.savedExplore,id];persist();paint();},id+' 찜');paint();
    });
  }
  function storiesLayout(){
    if(!text('STORIES').length)return;
    root.classList.add('stories-screen');
    const brand=text('NEARWEAR')[0],bell=name('아이콘 / 알림')[0];
    if(brand&&bell){brand.style.height='24px';brand.style.lineHeight='24px';bell.style.top=(parseFloat(brand.style.top)+(24-parseFloat(bell.style.height))/2)+'px';}
    const children=[...root.firstElementChild.children];
    name('사진 / avatar').forEach(avatar=>{const top=parseFloat(avatar.style.top),center=top+parseFloat(avatar.style.height)/2;
      children.filter(e=>e!==avatar&&parseFloat(e.style.left)>=65&&Math.abs(parseFloat(e.style.top)-top)<32).forEach(e=>{
        if(e.tagName==='P'){e.style.height='22px';e.style.lineHeight='22px';e.style.top=(center-11)+'px';}else if(/영업 상태 표시|아이콘 \/ right/.test(e.dataset.name||''))e.style.top=(center-parseFloat(e.style.height)/2)+'px';
      });
    });
    text('매장 스토리').forEach(e=>e.closest('[data-name^="스토리 카드"]')?.remove());
    all('[data-name]').filter(e=>/스크롤 트랙|스크롤 손잡이|스크롤바/.test(e.dataset.name)).forEach(e=>e.remove());
  }
  function bookingLayout(){
    const sheet=name('로그인 안내 시트')[0],card=name('예약 양식')[0];
    if(sheet&&card){
      card.style.left='0';card.style.top='156px';card.style.width='430px';card.style.height='224px';card.style.borderRadius='0';
      sheet.style.top='380px';sheet.style.height=(current.height-380)+'px';
      const backing=document.createElement('div');backing.className='booking-sheet-backing';backing.style.cssText='position:absolute;left:0;top:380px;width:430px;height:32px;background:#fff';const overlay=name('로그인 전 어두운 오버레이')[0];root.firstElementChild.insertBefore(backing,overlay||sheet);
      const input=name('입력 /')[0];if(input){input.style.top='348px';input.style.height='32px';input.style.left='32px';input.style.width='350px';input.style.overflow='hidden';input.querySelectorAll('input,select').forEach(e=>{e.style.color='#555';e.style.backgroundColor='#fff';e.style.padding='3px 10px';e.style.fontSize='16px';e.style.height='100%';});}
      name('입력 /').forEach(e=>{e.style.zIndex='auto';e.querySelectorAll('input,select,textarea').forEach(field=>field.style.zIndex='auto');});
      const divider=name('구분선')[0];
      if(input&&divider){input.style.left=divider.style.left;input.style.width=divider.style.width;input.querySelectorAll('input,select').forEach(field=>field.style.width='100%');}
      name('로그인 전 어두운 오버레이').forEach(e=>{e.style.left='0';e.style.width='430px';e.style.pointerEvents='none';});
      const children=[...root.firstElementChild.children];
      children.filter(e=>parseFloat(e.style.top)>=400&&!e.dataset.name?.includes('오버레이')).forEach(e=>{
        if(e===sheet||e===card)return;
        const width=parseFloat(e.style.width);
        if(Number.isFinite(width)){e.style.left='215px';e.style.translate='-50% 0';}
        if(e.tagName==='P'||e.querySelector('p'))e.style.textAlign='center';
      });
    }
    if(sheet){
      name('잠금').forEach(e=>{e.style.left='215px';e.style.translate='-50% 0';e.style.top=(parseFloat(e.style.top)+12)+'px';});
      text('로그인이 필요해요.').forEach(e=>{e.style.left='215px';e.style.translate='-50% 0';e.style.top=(parseFloat(e.style.top)+12)+'px';e.style.width='310px';e.style.textAlign='center';});
    }
    name('입력 /').forEach(box=>box.querySelectorAll('input,select,textarea').forEach(e=>{e.style.color='#555';e.style.backgroundColor='#fff';}));
    name('펼치기').forEach(arrow=>{const y=parseFloat(arrow.style.top);const box=name('입력 /').find(b=>y>=parseFloat(b.style.top)&&y<=parseFloat(b.style.top)+parseFloat(b.style.height));if(box){arrow.style.left=(parseFloat(box.style.left)+parseFloat(box.style.width)-28)+'px';arrow.style.top=(parseFloat(box.style.top)+(parseFloat(box.style.height)-parseFloat(arrow.style.height))/2)+'px';arrow.style.pointerEvents='none';}});
  }
  function productTypography(){
    const paragraphs=all('p'),labels=['브랜드','카테고리','소재','사이즈','색상','하자','배송'];
    const rows=labels.map(label=>{const key=text(label)[0];if(!key)return null;const y=parseFloat(key.style.top);const value=paragraphs.filter(p=>parseFloat(p.style.left)>100&&Math.abs(parseFloat(p.style.top)-y)<12).sort((a,b)=>Math.abs(parseFloat(a.style.top)-y)-Math.abs(parseFloat(b.style.top)-y))[0];return value?{key,value}:null;}).filter(Boolean);
    const fit=(e,width)=>{e.textContent=norm(e.textContent);e.style.width=width+'px';e.style.whiteSpace='nowrap';e.style.wordBreak='normal';const size=parseFloat(getComputedStyle(e).fontSize);if(e.scrollWidth>width)e.style.fontSize=(size*width/e.scrollWidth)+'px';};
    const start=rows.length?parseFloat(rows[0].key.style.top):554;
    rows.forEach(({key,value},i)=>{const y=start+i*35;for(const e of [key,value]){e.style.top=y+'px';e.style.height='24px';e.style.lineHeight='24px';}key.style.left='45.94px';value.style.left='162px';fit(value,244);});
    const heart=name('heart')[0],title=paragraphs.find(p=>parseFloat(p.style.fontSize)>=20&&parseFloat(p.style.top)>340&&!p.textContent.includes('₩'));
    if(title){const right=heart?parseFloat(heart.style.left)-12:382;fit(title,right-parseFloat(title.style.left));}
  }
  function storeGallery(){
    const hero=name('사진').find(e=>/매장 외관/.test(e.dataset.name));
    if(!hero)return;
    const source=document.createElement('div');source.innerHTML=byId.get(shops[shopName()].preview).html;
    const thumbs=[...source.querySelectorAll('[data-name]')].filter(e=>/매장 썸네일/.test(e.dataset.name)).sort((a,b)=>(parseFloat(a.style.left)||0)-(parseFloat(b.style.left)||0));
    const original=[...hero.querySelectorAll('img')].at(-1)?.getAttribute('src');
    const images=[...new Set([original,...thumbs.map(e=>[...e.querySelectorAll('img')].at(-1)?.getAttribute('src'))].filter(Boolean))];
    if(!images.length)return;
    hero.replaceChildren();hero.classList.add('store-gallery');
    images.forEach((src,i)=>{const slide=document.createElement('div');slide.className='store-gallery-slide';const img=new Image();img.src=src;img.alt=shopName()+' 매장 사진 '+(i+1);img.draggable=false;slide.append(img);hero.append(slide);});
    let drag;
    hero.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag={x:e.clientX,left:hero.scrollLeft};hero.style.scrollSnapType='none';hero.setPointerCapture(e.pointerId);e.preventDefault();}});
    hero.addEventListener('pointermove',e=>{if(drag)hero.scrollLeft=drag.left+drag.x-e.clientX;});
    const end=e=>{if(drag){const dx=e.clientX-drag.x,start=Math.round(drag.left/hero.clientWidth),target=Math.max(0,Math.min(images.length-1,start+(Math.abs(dx)>35?(dx<0?1:-1):0)));drag=null;hero.style.scrollSnapType='x mandatory';hero.scrollTo({left:target*hero.clientWidth,behavior:'smooth'});}};
    hero.addEventListener('pointerup',end);hero.addEventListener('pointercancel',end);
  }
  function thumbSwap(){const photos=name('사진');const thumbs=photos.filter(e=>/썸네일/.test(e.dataset.name));const hero=photos.find(e=>!e.dataset.name.includes('썸네일')&&!e.dataset.name.includes('지도')&&e.querySelector('img'));if(!hero)return;const sources=[hero.querySelector('img').src,...thumbs.map(e=>e.querySelector('img')?.src).filter(Boolean)];let position=0;const swap=src=>{const img=new Image();img.src=src;img.alt='선택한 매장 또는 상품 사진';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover';hero.replaceChildren(img)};thumbs.forEach(e=>activate(e,()=>{const frame=document.createElement('div');const w=parseFloat(e.style.width),h=parseFloat(e.style.height),scale=Math.max(parseFloat(hero.style.width)/w,parseFloat(hero.style.height)/h);frame.innerHTML=e.innerHTML;frame.style.cssText='position:absolute;left:50%;top:50%;width:'+w+'px;height:'+h+'px;transform:translate(-50%,-50%) scale('+scale+');overflow:hidden';frame.querySelectorAll('[data-node-id]').forEach(n=>n.removeAttribute('data-node-id'));hero.style.overflow='hidden';hero.replaceChildren(frame);},'이미지 크게 보기'));if(current.name.startsWith('10 /')){const previews=getImages(shops[shopName()].preview).filter(i=>byId.get(shops[shopName()].preview).html.includes(i.node));previews.filter(i=>/매장 카드|썸네일/.test(i.name)).forEach(i=>sources.push(new URL(i.src,location.href).href));}let x;hero.style.touchAction='pan-y';hero.onpointerdown=e=>{x=e.clientX;hero.setPointerCapture(e.pointerId)};hero.onpointerup=e=>{if(x===undefined)return;const dx=e.clientX-x;x=undefined;if(Math.abs(dx)>45){position=(position+(dx<0?1:-1)+sources.length)%sources.length;swap(sources[position])}};}
  function inputs(){
    const fields=[];
    name('입력 /').forEach((box,i)=>{if(box.querySelector('input,select,textarea'))return;const label=box.dataset.name.slice(box.dataset.name.indexOf('/')+1).trim();let type=/이메일/.test(label)?'email':/비밀번호/.test(label)?'password':/2026/.test(label)?'date':/오후/.test(label)?'time':'text';const tag=/1명|오후|카드|오늘드림/.test(label)?'select':/간단|요청|부재/.test(label)?'textarea':'input';const input=document.createElement(tag);input.setAttribute('aria-label',label);if(tag==='input')input.type=type;input.placeholder=label;input.style.cssText='position:absolute;inset:0;width:100%;height:100%;color:inherit;z-index:3';box.append(input);if(tag==='select'){const values=/1명/.test(label)?['1명','2명','3명','4명','5명','6명']:/오후/.test(label)?['13:00','14:00','15:00','16:00','17:00','18:00','19:00']:/카드/.test(label)?['결제수단 선택','카드 (시연용)']:['당일 배송 (시연용)'];values.forEach((v,i)=>input.add(new Option(v,/카드/.test(label)&&i===0?'':v)))}if([18,19].includes(Number(current.name.slice(0,2)))&&!current.name.includes('로그인'))input.style.color='#111';if(type==='password')input.style.width='calc(100% - 52px)';if(type==='date')input.min=new Date().toLocaleDateString('sv-SE');
      // Remove the separate visual placeholder occupying this field.
      const y=parseFloat(box.style.top),x=parseFloat(box.style.left);all('p').filter(p=>{const py=parseFloat(p.style.top),px=parseFloat(p.style.left);return py>=y&&py<y+parseFloat(box.style.height)&&px>=x&&px<x+parseFloat(box.style.width)}).forEach(p=>p.style.visibility='hidden');fields.push(input);
    });
    const agreementRows=[];
    [...new Set([...name('체크박스'),...name('로그인 상태 유지 체크')])].forEach((box,i)=>{
      const oldY=parseFloat(box.style.top),input=document.createElement('input');input.type='checkbox';input.className='agreement-checkbox';input.style.cssText='inset:0;width:100%;height:100%';input.setAttribute('aria-label',current.name.includes('회원가입')?['만 14세 이상','이용약관 동의','개인정보 수집 및 이용 동의','마케팅 정보 수신 동의'][i]:'로그인 상태 유지');
      box.replaceChildren(input);box.style.border='0';box.style.background='transparent';box.style.boxShadow='none';box.style.borderRadius='4px';box.style.outline='none';box.style.overflow='hidden';
      const label=all('p').find(p=>Math.abs(parseFloat(p.style.top)-oldY)<8&&parseFloat(p.style.left)>55);
      if(label){const top=agreementRows.length?agreementRows[0].top+i*53.04:oldY;box.style.top=top+'px';label.style.top=top+'px';label.style.left='72.66px';label.style.height=box.style.height;label.style.lineHeight=box.style.height;label.style.width='333.34px';label.style.whiteSpace='nowrap';label.textContent=norm(label.textContent);label.style.fontSize='17.572px';label.style.cursor='pointer';label.onclick=()=>{input.checked=!input.checked;input.dispatchEvent(new Event('change',{bubbles:true}));};agreementRows.push({label,top});}
    });
    if(agreementRows.length){const size=Math.min(...agreementRows.map(({label})=>17.572*Math.min(1,333.34/label.scrollWidth)));agreementRows.forEach(({label})=>label.style.fontSize=size+'px');}

    fields.filter(f=>f.type==='password').forEach(f=>{const box=f.parentElement;box.style.backgroundColor='#fff';f.style.width='100%';f.style.paddingRight='55px';f.style.color='#555';});
    [...name('eye'),...name('비밀번호 표시')].forEach(e=>{e.style.zIndex='5';e.style.filter='brightness(0)';});
    fields.filter(f=>f.type==='password').forEach(field=>{
      const box=field.parentElement,top=parseFloat(box.style.top),height=parseFloat(box.style.height);
      const existing=[...name('eye'),...name('비밀번호 표시')].some(e=>{const y=parseFloat(e.style.top);return y>=top&&y<top+height;});
      if(!existing){const eye=document.createElement('div');eye.dataset.name='비밀번호 표시';eye.style.cssText='position:absolute;width:24px;height:24px;z-index:5;left:'+(parseFloat(box.style.left)+parseFloat(box.style.width)-38)+'px;top:'+(top+(height-24)/2)+'px';root.firstElementChild.append(eye);}
    });
    [...new Set([...name('eye'),...name('비밀번호 표시')])].forEach(eye=>{
      const y=parseFloat(eye.style.top),password=fields.filter(f=>f.type==='password').sort((a,b)=>Math.abs(parseFloat(a.parentElement.style.top)-y)-Math.abs(parseFloat(b.parentElement.style.top)-y))[0];
      if(!password)return;
      const paint=()=>{const visible=password.type==='text';eye.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" style="display:block;width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'+(visible?'':'<path d="M3 3l18 18"/>')+'</svg>';eye.style.filter='none';eye.style.color='#555';eye.setAttribute('aria-label',visible?'비밀번호 숨기기':'비밀번호 보기');eye.setAttribute('aria-pressed',String(visible));eye.style.boxShadow='none';};
      activate(eye,()=>{password.type=password.type==='password'?'text':'password';paint();});paint();
    });
    const submit=async signup=>{const email=fields.find(f=>f.type==='email'),password=fields.find(f=>/비밀번호/.test(f.ariaLabel));if(!email?.value||!email.checkValidity()||!password?.value){notice('이메일 주소와 비밀번호를 확인해 주세요.');return;}if(signup){const passwords=fields.filter(f=>/비밀번호/.test(f.ariaLabel));if(password.value.length<8||passwords[1]?.value!==password.value){notice('8자 이상의 비밀번호와 비밀번호 확인을 입력해 주세요.');return;}if([...root.querySelectorAll('input[type=checkbox]')].slice(0,3).some(e=>!e.checked)){notice('필수 약관에 모두 동의해 주세요.');return;}}
      if(!window.NearwearAuth){notice('인증 서비스 연결이 필요합니다. 입력한 비밀번호는 저장하지 않습니다.');return;}
      try{const provider=window.NearwearAuth;auth=await provider[signup?'signUp':'signIn']({email:email.value,password:password.value,nickname:fields.find(f=>/닉네임/.test(f.ariaLabel))?.value});if(!auth?.user)throw Error();fields.forEach(f=>{if(f.type==='password')f.value=''});go(signup?'225:105':state.returnTo||'225:119')}catch{notice('인증하지 못했습니다. 입력값과 인증 서비스 상태를 확인해 주세요.');}
    };
    bindText('로그인하기',()=>submit(false));bindText('회원가입하기',()=>submit(true));
    const socialLogin=async provider=>{
      const adapter=window.NearwearAuth;
      if(!adapter?.signInWithOAuth){notice('이 서비스의 로그인 연결 설정이 아직 없습니다. OAuth 인증 설정이 필요합니다.');return;}
      try{const result=await adapter.signInWithOAuth({provider,redirectTo:location.origin+location.pathname});if(result?.url)location.assign(result.url);else if(result?.user){auth=result;go(state.returnTo||'225:119');}}catch{notice('소셜 로그인 연결을 확인해 주세요.');}
    };
    for(const [provider,labels] of [['apple',['Apple로 계속하기','Apple 로그인']],['google',['Google로 계속하기','Google 로그인']],['kakao',['Kakao로 계속하기','카카오로 계속하기','Kakao 로그인']]])labels.forEach(label=>{bindText(label,()=>socialLogin(provider));bindName(label,()=>socialLogin(provider));});
    bindText('비밀번호 찾기',()=>notice('인증 서비스 설정 후 사용할 수 있습니다.'));

    return fields;
  }
  function story(key,index){location.hash=`story/${key.toLowerCase()}/${index+1}`;}
  function originalStory(match){const key=match[1].toUpperCase(),index=Number(match[2])-1,count=key==='PINONPIPPI'?3:4;if(!shops[key]||index<0||index>=count){go('494:14621');return;}state.store=key;root.style.height='932px';root.innerHTML=`<div style="position:relative;width:430px;height:932px"><img class="story-original" src="assets/new-stories/${key.toLowerCase()}/NEW${index?'-'+index:''}.png" alt="${key} NEW ${index+1}/${count}"><button class="story-control story-close" aria-label="스토리 닫기"></button><button class="story-control story-prev" aria-label="이전 스토리"></button><button class="story-control story-next" aria-label="다음 스토리"></button><button class="story-control story-product" aria-label="상품 보기"></button></div>`;root.querySelector('.story-close').onclick=()=>go(shops[key].feed);root.querySelector('.story-prev').onclick=()=>index>0&&story(key,index-1);root.querySelector('.story-next').onclick=()=>index<count-1&&story(key,index+1);root.querySelector('.story-prev').disabled=index===0;root.querySelector('.story-next').disabled=index===count-1;root.querySelector('.story-product').onclick=()=>notice('이 스토리에 연결된 상품 상세가 제공되지 않았습니다.');let x;root.onpointerdown=e=>{x=e.clientX};root.onpointerup=e=>{if(x===undefined)return;const dx=e.clientX-x;x=undefined;if(Math.abs(dx)>45){const next=index+(dx<0?1:-1);if(next>=0&&next<count)story(key,next)}};}
  function wire(){
    if(current.store)state.store=current.store;
    const n=Number(current.name.slice(0,2)),key=shopName(),shop=shops[key];
    Object.entries(shops).forEach(([k,v])=>{if([v.preview,v.feed,v.info,v.items,v.product].includes(current.id))state.store=k;});
    bindName('back',back);bindName('뒤로',back);bindName('cross',()=>go(shops[shopName()].feed));
    const nav={'홈':'494:14621','MAP':'494:14621','탐색':'174:1242','EXPLORE':'174:1242','업로드':'260:2','UPLOAD':'260:2','소식':'219:1236','저장':'219:1236','SAVED':'219:1236','마이':auth?'225:119':'225:3','MY':auth?'225:119':'225:3'};
    Object.entries(nav).forEach(([label,id])=>text(label).filter(e=>parseFloat(e.style.top)>800).forEach(e=>activate(e,()=>go(id),label)));
    const iconNav={home:'494:14621',search:'174:1242',pin:'260:2',heart:'219:1236',user:auth?'225:119':'225:3'};
    Object.entries(iconNav).forEach(([icon,id])=>name('아이콘 / '+icon).filter(e=>parseFloat(e.style.top)>800).forEach(e=>activate(e,()=>go(id),icon+' 메뉴')));
    name('아이콘 / pin').filter(e=>parseFloat(e.style.top)>800).forEach(e=>{
      const image=e.querySelector('img'),light=root.firstElementChild.style.backgroundColor;
      e.style.color=light==='rgb(255, 255, 255)'?'#828282':'#bdbdbd';e.style.overflow='visible';
      e.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" style="display:block;width:100%;height:100%;overflow:visible;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"><path d="M20 9c0 6-8 13-8 13S4 15 4 9a8 8 0 0 1 16 0Z"/><circle cx="12" cy="9" r="3"/></svg>';
    });
    if(n===1){activate(root.firstElementChild,()=>go('174:131'),'NEARWEAR 시작하기');}
    if(n===2){
      const group=document.createElement('div');group.className='gender-center';
      const question=all('p').find(p=>!['WOMENS','MENS','ALL'].includes(norm(p.textContent)));
      if(question){question.removeAttribute('style');question.className='gender-question';group.append(question);}
      const choices=document.createElement('div');choices.className='gender-options';
      ['WOMENS','MENS','ALL'].forEach(g=>{const item=text(g)[0];if(!item)return;item.removeAttribute('style');choices.append(item);activate(item,()=>{state.gender=g;state.choices[g]={};persist();go(g==='WOMENS'?'586:18':g==='MENS'?'586:10':'586:2');},g);});
      group.append(choices);root.firstElementChild.append(group);
    }
    if(n===3){state.gender=current.id==='586:10'?'MENS':current.id==='586:2'?'ALL':'WOMENS';persist();taste();return;}
    if(n===4){resultPhotos();bindText('취향에 맞는 매장 찾기',()=>go('494:14621'));}
    if(n>=5&&n<=9){
      bindName('전체매장',()=>go('494:14527'));bindName('버튼 / 스타일',()=>go('494:14424'));
      bindName('내 취향 추천',()=>{state.filters.recommended=!state.filters.recommended;if(state.filters.recommended)state.filters.saved=false;state.selectedMapStore=null;persist();render()});
      bindName('버튼 / 저장',()=>{state.filters.saved=!state.filters.saved;if(state.filters.saved)state.filters.recommended=false;state.selectedMapStore=null;persist();render()});
      bindName('버튼 / 영업 중',()=>{state.filters.open=!state.filters.open;persist();go(state.filters.open?'494:14330':'494:14621')});
      bindName('현재 위치',()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{state.location={lat:p.coords.latitude,lng:p.coords.longitude};persist();notice('현재 위치를 확인했습니다. 지도는 Figma 시연 지역입니다.');},()=>notice('위치 권한을 사용할 수 없어 연남·연희를 표시합니다.')):notice('위치 기능을 지원하지 않습니다.'));
      const searchBox=name('검색 입력')[0];if(searchBox){searchBox.querySelectorAll('p').forEach(p=>p.style.visibility='hidden');const search=document.createElement('input');search.type='search';search.setAttribute('aria-label','매장 검색');search.placeholder='매장, 스타일, 동네 검색';search.style.cssText='inset:0;width:100%;height:100%;padding-left:38.46px;z-index:4;color:#bcbcbc;font-size:15.926px';searchBox.append(search);search.oninput=()=>applyPins(search.value);}
      if(n===8)state.filters.open=true;
      installMapPins();
      const options=['아카이브','다크웨어','재패니즈','빈티지','아메카지','스트리트','미니멀','고프코어','유니크','페미닌'];
      if(n===6){options.forEach(t=>bindText(t,()=>{const selected=state.filters.styles;if(selected.includes(t))state.filters.styles=selected.filter(x=>x!==t);else if(selected.length<5)selected.push(t);else notice('스타일은 최대 5개까지 선택할 수 있습니다.');persist();text(t).forEach(e=>e.setAttribute('aria-pressed',state.filters.styles.includes(t)));}));['적용하기','적용','매장 보기','선택 완료'].forEach(t=>bindText(t,()=>go('494:14621')));}
      if(n===7)['전체','500m','3km','5km','10km'].forEach(t=>bindText(t,()=>{state.filters.distance=t;persist();go('494:14621')}));
      if(n===5||n===8){let zoom=1;const base=name('지도 배경')[0];bindText('+',()=>{zoom=Math.min(2.5,zoom+.2);if(base)base.style.transform=`scale(${zoom})`});bindText('−',()=>{zoom=Math.max(.6,zoom-.2);if(base)base.style.transform=`scale(${zoom})`});}
      if(n===6)bindName('버튼 / 전체매장',()=>go('494:14621'));
      applyPins('');
      if(n===9){['상세보기','상세 보기','매장 상세 보기'].forEach(t=>bindText(t,()=>go(shops[shopName()].feed)));bindName('상세보기',()=>go(shops[shopName()].feed));}
    }
    if(n>=9&&n<=17){
      if(n===10)storeGallery();else thumbSwap();
      if(n>=10&&root.firstElementChild.style.backgroundColor==='rgb(255, 255, 255)')root.firstElementChild.style.borderRadius='0';
      ['피드','FEED'].forEach(t=>bindText(t,()=>go(shops[shopName()].feed)));
      ['상품','ITEMS'].forEach(t=>bindText(t,()=>go(shops[shopName()].items)));
      ['안내','매장 안내'].forEach(t=>bindText(t,()=>go(shops[shopName()].info)));
      bindText('NEW',()=>story(shopName(),0));
      ['TODAY','SALE','INFO'].forEach((t,i)=>bindText(t,()=>{const s=screens.find(s=>s.name.startsWith(String(i+12)+' /')&&s.html.includes('>'+shopName()+'</p>'));if(s)go(s.id);}));
      if(n===9){
        const title=text(shopName()).find(e=>parseFloat(e.style.top)>500);
        if(title){title.classList.add('store-preview-title');title.style.left='24px';title.style.top='599px';title.style.height='42px';title.style.width='344px';title.style.display='flex';title.style.alignItems='center';title.style.whiteSpace='nowrap';title.style.fontSize=shopName().length>9?'30px':'32.576px';}
        name('bookmark').forEach(e=>{e.style.top='608.4px';e.style.left='382.55px';});
      }
      if(n>=10){
        const title=text(shopName()).find(e=>parseFloat(e.style.fontSize)>=24);
        if(title){const top=parseFloat(title.style.top)-5;title.style.left='24px';title.style.top=top+'px';title.style.height='43px';title.style.width='344px';title.style.display='flex';title.style.alignItems='center';title.style.whiteSpace='nowrap';if(shopName().length>9)title.style.fontSize='30px';name('bookmark').forEach(e=>{e.style.left='381.39px';e.style.top=(top+(43-parseFloat(e.style.height))/2)+'px';});}
      }
      name('bookmark').forEach(e=>{e.classList.add('store-bookmark');e.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>';});
      bindName('bookmark',()=>toggle('savedStores',shopName()));
      name('heart').forEach(e=>{e.classList.add('store-heart');e.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21 3.5 12.5C-2 7 5.5-1 12 5.5 18.5-1 26 7 20.5 12.5Z"/></svg>';});
      if(n===17)productTypography();
      bindName('heart',()=>toggle(n===17?'savedProducts':'savedStores',n===17?current.id:shopName()));
      [...name('heart'),...name('bookmark')].forEach(e=>e.setAttribute('aria-pressed',n===17?state.savedProducts.includes(current.id):state.savedStores.includes(shopName())));
      ['상품 보기','상품보기'].forEach(t=>bindText(t,()=>notice('해당 스토리와 연결된 상품 상세 화면이 제공되지 않았습니다.')));
      if(n===15){const instagram=()=>window.open('https://www.instagram.com/'+shops[shopName()].instagram+'/','_blank','noopener');bindText('인스타그램',instagram);all('p').filter(p=>norm(p.textContent).startsWith('@')||norm(p.textContent).toLowerCase()===shops[shopName()].instagram.toLowerCase()).forEach(p=>activate(p,instagram,'매장 인스타그램'));bindText('지도에서 보기',()=>window.open(shops[shopName()].map,'_blank','noopener'));bindName('버튼 / 지도에서 보기',()=>window.open(shops[shopName()].map,'_blank','noopener'));}
      if(n===16){name('사진 /').filter(e=>e.querySelector('img')).forEach((e,i)=>activate(e,()=>i===0?go(shops[shopName()].product):notice('해당 상품의 상세 화면이 제공되지 않았습니다.'),'상품 상세 보기'));['전체','상의','하의','잡화','액세서리'].forEach(t=>bindText(t,()=>{text(t).forEach(e=>e.setAttribute('aria-pressed','true'));if(t!=='전체')notice('이 카테고리의 별도 결과 화면은 제공되지 않았습니다.');}));}
      if(n===17){all('p').filter(p=>p.textContent.includes('(5km 이내)')).forEach(p=>p.style.whiteSpace='nowrap');['방문 예약','방문예약'].forEach(t=>bindText(t,()=>{state.returnTo='225:305';persist();go(auth?'225:305':'225:218')}));['당일 배송','당일배송'].forEach(t=>bindText(t,()=>{state.returnTo='225:429';persist();go(auth?'225:429':'225:342')}));}
      if(n>=11&&n<=14){const siblings=screens.filter(s=>s.number===n&&s.store===shopName()).sort((a,b)=>a.x-b.x);let i=siblings.indexOf(current);bindName('right',()=>siblings[i+1]&&go(siblings[i+1].id));bindName('left',()=>siblings[i-1]&&go(siblings[i-1].id));}
    }
    if(n===18||n===19||n===23){inputs();if(n===18||n===19)bookingLayout();['로그인','로그인하고 계속하기'].forEach(t=>bindText(t,()=>go(n===18?'265:2':n===19?'227:49':'265:43')));['회원가입','회원가입하기'].forEach(t=>{if(!current.name.includes('회원가입 '))bindText(t,()=>go('225:75'))});bindText('나중에 하기',()=>go(shops[shopName()].product));bindText('시작하기',()=>go('225:119'));
      if(n===18)bindText('예약하기',()=>submitBooking(false));if(n===19)['당일배송 신청하기','당일 배송 신청하기'].forEach(t=>bindText(t,()=>submitBooking(true)));}
    if(n===20){['OTUVINTAGE','RYOHE','OTOTO'].forEach(k=>bindText(k,()=>chooseShop(k)));name('NEW').forEach(e=>activate(e,()=>story(shopName(),0),'NEW 스토리'));all('p').filter(e=>['NEW','TODAY','SALE'].includes(norm(e.textContent))).forEach(e=>{const top=parseFloat(e.style.top)||0;const k=top<400?'OTUVINTAGE':top<700?'RYOHE':'OTOTO';activate(e,()=>{state.store=k;if(norm(e.textContent)==='NEW')story(k,0);else{const s=screens.find(s=>s.name.startsWith(norm(e.textContent)==='TODAY'?'12 /':'13 /')&&s.html.includes('>'+k+'</p>'));if(s)go(s.id)}},k+' '+e.textContent)});}
    if(n===21){['인천','경기','부산','대구','대전','광주','제주'].forEach(t=>bindText(t,()=>notice('현재 제공된 지역 화면은 서울입니다.')));['지금 눈여겨볼 빈티지샵','스타일별 발견','새로운 매장'].forEach((t,i)=>bindText(t,()=>go(['454:2','454:98','454:197'][i])));const arrows=name('right');if(current.id==='174:1242'){const sections=['지금 눈여겨볼 빈티지샵','스타일별 발견','새로운 매장'].map((label,i)=>({id:['454:2','454:98','454:197'][i],top:parseFloat(text(label)[0]?.style.top)||0}));arrows.forEach(e=>{const y=parseFloat(e.style.top)||0,section=sections.slice().sort((a,b)=>Math.abs(a.top-y)-Math.abs(b.top-y))[0];activate(e,()=>go(section.id),'섹션 더 보기');});}}
    if(n===21){
      exploreLayout();
      if(current.id==='174:1242'){bindName('아이콘 / arrow',()=>go('454:2'));name('사진 / 스타일 /').forEach((e,i)=>activate(e,()=>go('454:98'),'스타일 카드 '+(i+1)+' 보기'));}
      name('지역 탐색 탭').forEach(e=>{e.style.overflowX='auto';e.style.scrollbarWidth='none'});
      name('필터').filter(e=>e.dataset.name==='필터').forEach(e=>{e.style.width='382px';e.style.overflowX='auto';e.style.scrollbarWidth='none';});
      name('필터 /').forEach(e=>activate(e,()=>{name('필터 /').forEach(other=>{other.style.backgroundColor=other===e?'#eee':'#171717';other.style.color=other===e?'#111':'#fff';other.querySelectorAll('p').forEach(p=>p.style.color=other===e?'#111':'#fff');other.setAttribute('aria-pressed',other===e)});},norm(e.textContent)));
    }
    if(n===20){
      const sectionKey=y=>y<440?'OTUVINTAGE':y<710?'RYOHE':'OTOTO';
      name('스토리 카드 /').forEach(card=>{const y=(card.getBoundingClientRect().top-root.getBoundingClientRect().top)/Math.min(1,innerWidth/430),k=sectionKey(y),type=[...card.querySelectorAll('p')].map(p=>norm(p.textContent)).find(t=>['NEW','TODAY','SALE'].includes(t))||'NEW';activate(card,()=>{state.store=k;if(type==='NEW')story(k,0);else{const s=screens.find(s=>s.name.startsWith(type==='TODAY'?'12 /':'13 /')&&s.html.includes('>'+k+'</p>'));if(s)go(s.id)}},k+' '+type+' 스토리');});
      [...root.firstElementChild.children].forEach(e=>{const top=parseFloat(e.style.top);if(!reviewMode&&top>=165&&top<950&&!state.savedStores.includes(sectionKey(top)))e.style.display='none';});
      if(!reviewMode&&!state.savedStores.some(k=>['OTUVINTAGE','RYOHE','OTOTO'].includes(k))){const empty=document.createElement('p');empty.textContent='저장한 매장의 스토리가 여기에 표시됩니다.';empty.style.cssText='position:absolute;left:24px;top:225px;color:#aaa;font-size:14px';root.firstElementChild.append(empty);}
    }
    if(n===22){bindText('매장',()=>go('219:1236'));bindText('상품',()=>go('174:1292'));if(current.id==='219:1236'&&state.savedStores.length===3&&['OTUVINTAGE','RYOHE','OTOTO'].every(k=>state.savedStores.includes(k))){['OTUVINTAGE','RYOHE','OTOTO'].forEach((k,i)=>{bindText(k,()=>chooseShop(k));const tile=name('saved-store-'+(i+1))[0];activate(tile,()=>chooseShop(k),k+' 저장 매장');});name('bookmark').forEach((e,i)=>activate(e,()=>toggle('savedStores',['OTUVINTAGE','RYOHE','OTOTO'][i]),'매장 저장 해제'));}else if(!reviewMode)saved();}
    if(n===24){bindText('취향 재발견',()=>go('174:131'));bindText('취향 재탐색',()=>go('174:131'));bindText('내 취향 퍼즐',()=>go(puzzleId()));bindName('설정',()=>go('225:174'));if(!reviewMode&&current.id==='225:119'){const result=byId.get(state.result),temp=document.createElement('div');temp.innerHTML=result.html;const p=[...temp.querySelectorAll('p')];const style=text('FEMININE / UNIQUE')[0];if(style){style.textContent=(p[1]?.textContent||style.textContent).replace('BOHEMINAN','BOHEMIAN');style.style.width='382px';style.style.whiteSpace='nowrap';style.style.fontSize='24px';}}if(current.name.includes('퍼즐')){name('heart').forEach((e,i)=>{if(state.choices[state.gender]?.[i])e.style.filter='brightness(3)';});}}
  }
  function installMapPins(){
    const pins=[];const used=new Set();
    name('매장 위치 핀').forEach(marker=>{
      const next=marker.nextElementSibling;
      const candidate=next?.tagName==='P'?norm(next.textContent):next?.dataset.name==='선택한 매장'?norm(next.textContent):'';
      const key=Object.keys(shops).find(k=>candidate===k||(k==='PINONPIPPI'&&candidate==='PINONPPI'));
      if(!key||used.has(key)){marker.remove();return;}used.add(key);
      const image=marker.querySelector('img');if(!image)return;
      const shape=document.createElement('span');shape.className='map-pin-shape';shape.style.maskImage=`url("${image.getAttribute('src')}")`;shape.style.webkitMaskImage=shape.style.maskImage;marker.append(shape);marker.classList.add('map-pin-marker');
      const label=next?.tagName==='P'?next:null;
      if(label){marker.style.top=(parseFloat(label.style.top)-(parseFloat(marker.style.height)||24.629)-5)+'px';marker.style.left=Math.max(8,(parseFloat(label.style.left)||18)-10.25)+'px';}
      const select=()=>{state.store=key;state.selectedMapStore=key;persist();if(current.id===shops[key].preview)applyPins('');else go(shops[key].preview)};
      activate(marker,select,key+' 매장 핀');marker.ondblclick=null;if(label){activate(label,select,key+' 매장 선택');label.ondblclick=null;}
      pins.push({key,marker,label});
    });
    text('AFTERDARK').forEach(e=>e.remove());name('AFTERDARK').forEach(e=>e.remove());name('선택한 매장').forEach(e=>e.remove());name('스크롤 트랙').forEach(e=>e.remove());name('스크롤 손잡이').forEach(e=>e.remove());
    root._mapPins=pins;
  }
  // Store information screen hours, evaluated in Korean local time.
  function shopIsOpen(key, now=new Date()){
    const schedules={RYOHE:[[5,6],14],TTUL:[[0,1,2,4,5,6],13],OTOTO:[[0,1,2,3,4,5,6],13],OTUVINTAGE:[[0,2,3,4,5,6],13],BALTZ:[[0,1,3,4,5,6],13],PINONPIPPI:[[0,1,2,4,5,6],13],GOWON:[[0,1,2,3,4,5,6],12]};
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
    const day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday),minute=Number(parts.hour)*60+Number(parts.minute),schedule=schedules[key];
    const start=key==='OTOTO'&&day===1?14:schedule?.[1];
    return !!schedule&&schedule[0].includes(day)&&minute>=start*60&&minute<20*60;
  }
  function applyPins(query){
    const pins=root._mapPins||[],styles=state.filters.styles;
    const resultTags={'174:193':['아카이브'],'273:461':['다크웨어'],'273:489':['재패니스','재패니즈'],'273:517':['빈티지'],'273:545':['아메카지'],'273:573':['스트리트'],'273:601':['미니멀'],'273:657':['유니크'],'273:685':['페미닌']};
    const selected=current.number===9?shopName():state.selectedMapStore;
    for(const {key,marker,label} of pins){const info=byId.get(shops[key].info).html;
      const visible=(!query||key.toLowerCase().includes(query.toLowerCase()))&&(!state.filters.saved||state.savedStores.includes(key))&&(!styles.length||styles.some(s=>info.includes(s)||info.includes(s.replace('재패니즈','재패니스'))));
      marker.style.display=visible?'':'none';if(label)label.style.display=visible?'':'none';
      const color=key===selected?'#ef4056':state.filters.saved&&state.savedStores.includes(key)?'#f3a6c1':state.filters.recommended&&(resultTags[state.result]||[]).some(t=>info.includes(t))?'#f4e9a5':shopIsOpen(key)?'#95e181':'#ffffff';
      marker.style.setProperty('--pin-color',color);marker.classList.toggle('map-pin-active',key===selected);marker.dataset.pinColor=color;
    }
    root.querySelectorAll('.map-selected-name').forEach(e=>e.remove());
    const active=pins.find(p=>p.key===selected&&p.marker.style.display!=='none');
    if(active){const label=document.createElement('button');label.className='map-selected-name';label.textContent=selected;label.setAttribute('aria-label',selected+' 매장 미리보기');const x=parseFloat(active.marker.style.left)||0,y=parseFloat(active.marker.style.top)||0,width=Math.max(106,selected.length*9+28);label.style.width=width+'px';label.style.left=(x+width+36<418?x+31:Math.max(12,x-width-16))+'px';label.style.top=(y-4)+'px';label.onclick=()=>go(shops[selected].preview);root.firstElementChild.append(label);}
    for(const [fragment,active] of [['버튼 / 저장',state.filters.saved],['내 취향 추천',state.filters.recommended],['버튼 / 영업 중',state.filters.open]])name(fragment).forEach(button=>{button.setAttribute('aria-pressed',String(active));button.style.backgroundColor=active?'#fff':'transparent';button.style.color=active?'#111':'#fff';button.style.borderColor=active?'#b9b9b9':'#515151';button.style.boxShadow='none';button.querySelectorAll('p').forEach(p=>p.style.color=active?'#111':'#fff');});
  }
  function saved(){const product=current.id==='174:1292',ids=product?state.savedProducts:state.savedStores;const content=document.createElement('div');content.className='saved-content';content.style.cssText='background:#fff;color:#111;height:650px';if(!ids.length)content.innerHTML='<p class="saved-empty">아직 저장한 '+(product?'상품':'매장')+'이 없습니다.</p>';ids.forEach(id=>{const item=byId.get(product?id:shops[id]?.feed);if(!item)return;const temp=document.createElement('div');temp.innerHTML=item.html;const image=temp.querySelector('[data-name^="사진"] img, img');const button=document.createElement('button');button.className='saved-tile';button.style.color='#111';if(image){const im=new Image();im.src=image.getAttribute('src');im.alt='';button.append(im)}const label=document.createElement('span');label.textContent=product?norm(temp.querySelectorAll('p')[2]?.textContent||'상품'):id;button.append(label);button.onclick=()=>go(product?id:shops[id].feed);content.append(button)});root.firstElementChild.append(content);}
  async function submitBooking(delivery){if(!auth?.user){notice('실제 인증 서비스에 로그인한 후 신청할 수 있습니다.');return;}const fields=all('input,select,textarea');if(fields.some(f=>f.tagName!=='TEXTAREA'&&!f.value)){notice('필수 항목을 입력해 주세요.');return;}const list=delivery?'deliveries':'reservations';const data={id:crypto.randomUUID(),store:shopName(),values:fields.map(f=>f.value),createdAt:Date.now(),demo:true};if(state[list].some(x=>x.store===data.store&&JSON.stringify(x.values)===JSON.stringify(data.values))){notice('이미 같은 내용으로 신청했습니다.');return;}state[list].push(data);persist();notice(delivery?'시연용 배송 신청을 저장했습니다. 결제는 진행되지 않습니다.':'시연용 방문 예약을 저장했습니다.');}
  function scale(){root.style.zoom=Math.min(1,innerWidth/430);}
  async function render(){root.onwheel=null;root._mapPins=null;root.onpointerdown=null;root.onpointerup=null;const match=/^#story\/([a-z]+)\/(\d+)$/.exec(location.hash);if(match){current=screens.filter(s=>s.number===11&&s.store===match[1].toUpperCase()).sort((a,b)=>a.x-b.x)[Number(match[2])-1];originalStory(match);scale();updateReviewNav();return;}
    if(location.hash==='#screens'){root.style.display='none';document.getElementById('review').hidden=false;renderBoard();updateReviewNav();document.title='NEARWEAR — 01~24 전체 화면';return;}
    root.style.display='';document.getElementById('review').hidden=true;const id=location.hash.startsWith('#figma/')?decodeURIComponent(location.hash.slice(7)):location.hash==='#screen-5'?'494:14621':'174:129';current=byId.get(id)||byId.get('174:129');root.style.height=current.height+'px';root.innerHTML=current.html;root.firstElementChild.style.height=current.height+'px';root.classList.remove('stories-screen');wire();styleFilterLayout();storiesLayout();viewportLayout();text('회원맵').forEach(e=>e.remove());text('설정').filter(e=>!e.closest('[role=button]')).forEach(e=>e.remove());scale();updateReviewNav();document.body.classList.toggle('review-mode',reviewMode);scrollTo(0,0);document.title='NEARWEAR — '+current.name;}
  addEventListener('hashchange',render);addEventListener('resize',scale);addEventListener('storage',e=>{if(e.key===storageKey){try{state={...defaults,...JSON.parse(e.newValue||'{}')};render()}catch{}}});
  setInterval(()=>{if(root._mapPins?.length)applyPins(root.querySelector('input[type=search]')?.value||'');},60000);
  window.NearwearDesign={screens,go,get state(){return state}};
  await render();
  dispatchEvent(new Event('nearwear-ready'));
})().catch(error=>{document.getElementById('notice').textContent=error.message;console.error(error)});









