(() => {
  if(new URLSearchParams(location.search).get('demo')!=='1')return;
  const scenes=[
    {title:'NEARWEAR 소개',id:'174:129',numbers:[1],say:'내 취향을 발견하고, 가까운 빈티지 매장을 찾아가는 서비스입니다.',action:'화면을 눌러 취향 탐색을 시작하세요.'},
    {title:'탐색 범위 선택',id:'174:131',numbers:[2],say:'WOMENS, MENS, ALL 중 원하는 탐색 범위를 선택합니다.',action:'발표에서 보여줄 범위를 선택하세요.'},
    {title:'12장의 취향 탐색',id:()=>app().state.gender==='MENS'?'586:10':app().state.gender==='ALL'?'586:2':'586:18',numbers:[3],say:'원형으로 회전하는 사진을 보며 LIKE와 SKIP으로 취향을 표현합니다.',action:'스크롤로 사진을 둘러보고 선택해 보세요. 다음 장면으로 바로 이동할 수도 있습니다.'},
    {title:'나에게 맞는 스타일',id:()=>app().state.result||'273:685',numbers:[4],say:'선택한 사진의 스타일을 바탕으로 추천 결과를 확인합니다.',action:'취향에 맞는 매장 찾기를 눌러 지도로 이동하세요.'},
    {title:'매장 지도와 필터',id:'494:14621',numbers:[5,6,7,8],say:'스타일, 저장, 취향 추천으로 매장을 살펴봅니다. 초록 핀은 등록 운영시간 기준 영업중입니다.',action:'핀을 눌러 매장명과 미리보기를 확인하세요.'},
    {title:'매장 미리보기',id:'494:13547',numbers:[9],say:'사진, 스타일, 위치를 한눈에 보고 관심 있는 매장을 저장합니다.',action:'찜 아이콘을 누르거나 상세보기로 들어가세요.'},
    {title:'매장 상세 탐색',id:'559:140',numbers:[10,12,13,14,15,16],say:'매장 사진과 피드, 상품, 안내 정보를 확인합니다.',action:'상단 사진을 옆으로 넘기고 NEW 스토리도 열어보세요.'},
    {title:'매장의 새로운 소식',id:'story/ryohe/1',numbers:[11,20],say:'매장이 올린 원본 스토리를 넘겨보며 새로운 상품과 소식을 발견합니다.',action:'다음 스토리와 닫기 버튼을 눌러보세요.'},
    {title:'상품과 방문 연결',id:'494:13290',numbers:[17],say:'상품 정보와 찜 기능을 확인하고 방문 예약 또는 당일 배송 흐름으로 연결됩니다.',action:'하트를 누른 뒤 방문 예약 또는 당일 배송을 선택하세요.'},
    {title:'로그인 안내와 마무리',id:'225:218',numbers:[18,19,23],say:'예약과 배송을 이어가기 위한 로그인 화면까지 보여줍니다.',action:'발표용 화면 시연입니다. 실제 인증·예약·결제 처리는 연결되지 않았습니다.'}
  ];
  const app=()=>window.NearwearDesign;
  let index=0,collapsed=false,panel;
  function navigate(next){index=Math.max(0,Math.min(scenes.length-1,next));const scene=scenes[index],id=typeof scene.id==='function'?scene.id():scene.id;if(id.startsWith('story/'))location.hash=id;else app().go(id);paint();}
  function paint(){if(!panel)return;const scene=scenes[index];panel.classList.toggle('is-collapsed',collapsed);panel.querySelector('.demo-toggle').textContent=collapsed?'발표 안내 열기':'안내 접기';panel.querySelector('.demo-count').textContent=String(index+1).padStart(2,'0')+' / '+scenes.length;panel.querySelector('progress').value=index+1;panel.querySelector('h2').textContent=scene.title;panel.querySelector('.demo-say').textContent=scene.say;panel.querySelector('.demo-action').textContent=scene.action;panel.querySelector('select').value=index;panel.querySelector('.demo-prev').disabled=index===0;panel.querySelector('.demo-next').textContent=index===scenes.length-1?'처음 장면':'다음 장면 →';}
  function sync(){const hash=decodeURIComponent(location.hash),id=hash.replace('#figma/','');const screen=app().screens.find(s=>s.id===id);const found=hash.startsWith('#story/')?7:scenes.findIndex(s=>s.numbers.includes(screen?.number));if(found>=0)index=found;paint();}
  function start(){if(panel)return;document.body.classList.add('presentation-demo');panel=document.createElement('aside');panel.className='demo-panel';panel.setAttribute('aria-label','발표용 데모 안내');panel.innerHTML='<div class="demo-top"><strong>NEARWEAR · DEMO</strong><button class="demo-toggle" type="button"></button></div><div class="demo-body"><div class="demo-progress"><span class="demo-count"></span><span>발표 가이드</span></div><progress max="10" value="1" aria-label="발표 진행"></progress><h2></h2><p class="demo-say"></p><p class="demo-action"></p><label class="demo-label">장면 바로가기<select aria-label="발표 장면 선택"></select></label><div class="demo-controls"><button class="demo-prev" type="button">← 이전</button><button class="demo-next" type="button">다음 장면 →</button></div><div class="demo-footer"><button class="demo-reset" type="button">데모 처음부터</button><a href="./">일반 모드</a></div><small>실제 인증·예약·결제는 미연결 상태입니다.</small></div>';
  scenes.forEach((s,i)=>panel.querySelector('select').add(new Option(String(i+1).padStart(2,'0')+' '+s.title,String(i))));document.body.append(panel);
  panel.querySelector('.demo-toggle').onclick=()=>{collapsed=!collapsed;paint();};panel.querySelector('.demo-prev').onclick=()=>navigate(index-1);panel.querySelector('.demo-next').onclick=()=>navigate(index===scenes.length-1?0:index+1);panel.querySelector('select').onchange=e=>navigate(Number(e.target.value));panel.querySelector('.demo-reset').onclick=()=>{localStorage.removeItem('nearwear-demo-v1');location.replace(location.pathname+'?demo=1#figma/174:129');location.reload();};addEventListener('hashchange',()=>setTimeout(sync,0));addEventListener('keydown',e=>{if(e.altKey&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();navigate(index+(e.key==='ArrowRight'?1:-1));}});sync();}
  addEventListener('nearwear-ready',start,{once:true});
})();
