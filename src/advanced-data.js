// Transcribed from the supplied PNGs and the user's final corrections.
// Source images are intentionally never substituted with old-version or stock imagery.
export const assetKey = (group, id, index=1) => `${group}/${id}/${String(index).padStart(2,'0')}`;
export const styleNames=['아카이브','다크웨어','재패니즈','빈티지','아메카지','스트리트','페미닌','고프코어','유니크','미니멀'];
export const styleEnglish=['ARCHIVE','DARKWEAR','JAPANESE','VINTAGE','AMEKAJI','STREET','FEMININE','GOPCORE','UNIQUE','MINIMAL'];
export const results=[
 {id:1,title:'ARCHIVE / CLASSIC',description:'절제된 색감 · 정교한 테일러링 · 클래식한 실루엣'},
 {id:2,title:'DARK / AVANT-GARDE',description:'묵직한 블랙 · 비대칭 실루엣 · 해체적인 디테일'},
 {id:3,title:'JAPANESE / ARTISAN',description:'자연스러운 질감 · 수공예 디테일 · 여유로운 실루엣'},
 {id:4,title:'VINTAGE / RETRO',description:'빛바랜 색감 · 레트로한 실루엣 · 오래된 소재의 질감'},
 {id:5,title:'AMEKAJI / WORKWEAR',description:'견고한 소재 · 실용적인 디테일 · 자연스러운 워싱'},
 {id:6,title:'STREET / Y2K',description:'자유로운 실루엣 · 과감한 스타일링 · 2000년대 감성'},
 {id:7,title:'MINIMAL / MODERN',description:'담백한 색감 · 간결한 실루엣 · 정돈된 디테일'},
 {id:9,title:'UNIQUE / EXPERIMENTAL',description:'독특한 형태 · 예상 밖의 조합 · 과감한 디테일'},
 {id:10,title:'FEMININE / BOHEMIAN',description:'부드러운 소재 · 유연한 실루엣 · 섬세한 장식'}
];
const shopRows=[
 ['ototo','OTOTO',['아카이브','재패니즈','다크웨어'],'서울 마포구 동교로 29길 42 B1','화수목금토일 13:00-20:00 (월 14시 오픈)','0507-1494-2902','ototo_vintage','1483214369',5,[15,49],['13:00','20:00'],[0,1,2,3,4,5,6]],
 ['otuvintage','OTUVINTAGE',['빈티지','페미닌','스트리트'],'서울 서대문구 연희맛로 7-31 2F','화수목금토일 13:00-20:00 (월 정기휴무)','0507-1459-1498','otuvintage','2034742304',5,[23,66],['13:00','20:00'],[0,2,3,4,5,6]],
 ['baltz','BALTZ',['페미닌','빈티지','유니크'],'서울 서대문구 연희맛로 17-18 3F','월수목금토일 13:00-20:00 (화 정기휴무)','0507-1439-3517','baltz_official','2077653094',5,[80,49],['13:00','20:00'],[0,1,3,4,5,6]],
 ['pinonpippi','PINONPIPPI',['아카이브','유니크','다크웨어'],'서울 서대문구 연희로 11가길 39 4F','월화목금토일 13:00-20:00 (수 정기휴무)','0507-1428-1315','pinonpippi','1419126377',5,[63,66],['13:00','20:00'],[0,1,2,4,5,6]],
 ['gowon','GOWON',['아카이브','빈티지','유니크'],'서울특별시 마포구 동교로46길 40 B1','12:30 - 20:00','010-8399-4951','gowon.shop','2099801274',5,[45,84],['12:30','20:00'],[0,1,2,3,4,5,6]],
 ['ttul','TTUL',['빈티지','페미닌','유니크'],'서울 마포구 성미산로 19길 21 1F 102호','월화목금토일 13:00-20:00 (수 정기휴무)','0507-1475-7554','_tul','2060802299',2,[24,22],['13:00','20:00'],[0,1,2,4,5,6]],
 ['ryohe','RYOHE',['재패니즈','유니크','미니멀'],'서울 마포구 동교로 262-3 4F','금토 14:00-20:00 (월화수목일 정기휴무)','', 'ryohe.collect',null,2,[58,14],['14:00','20:00'],[5,6]]
];
export const shops=shopRows.map(([id,name,styleTags,address,hours,phone,instagram,place,galleryCount,position,range,days])=>({id,name,styleTags,address,hours,phone,instagram,galleryCount,position,range,days,hasDetail:true,naverUrl:place?`https://map.naver.com/p/entry/place/${place}`:'https://map.naver.com/p/search/%EB%A3%8C%ED%97%A4',newCount:id==='pinonpippi'?3:4,saleCount:id==='gowon'?4:2}));
export const demoPin={id:'afterdark',name:'AFTERDARK',position:[45,41],styleTags:[],hasDetail:false,isDemo:true};
const productRows=[
 ['ototo','빈티지 밀리터리 하이넥 재킷',128000,'상의','코튼 혼방 (소재 확인 필요)','L','워시드 블랙','소매 및 지퍼 주변 미세한 사용감','당일 배송 가능 (5km 이내)',2,1],
 ['otuvintage','빈티지 메탈 주얼리 컬렉션',198000,'액세서리','메탈 합금, 실버/골드 톤 도금','MIX (제품별 상이)','실버, 앤티크 골드','특성상 미세한 스크래치/변색','당일 배송 가능 (+ 3000원)',1,5],
 ['baltz','프레이드 텍스처 재킷',128000,'상의','혼방 소재 (혼용률 확인 필요)','L','차콜그레이','소매 부분 미세한 스크래치','당일 배송 가능 (+ 3000원)',4,11],
 ['pinonpippi','골지 니트 후드',130000,'상의','코튼 44%, 폴리에스터 47%','S (어깨 35, 가슴 43, 총장 58)','블랙','없음(상태 좋음)','당일 배송 가능 (+ 3000원)',2,5],
 ['gowon','발망 로프 골드 니트',150000,'상의','로프 루프와 시스루 골드튜브 장식','총장 49 / 어깨 36 / 가슴 41 / 소매 55','네이비','없음 (아주 좋은 상태)','당일 배송 가능 (+ 3000원)',4,1],
 ['ttul','패널 라이닝 레더 자켓',102000,'상의','양가죽 100% (빈티지 워싱)','L','차콜','없음 (전체적으로 좋은 상태)','당일 배송 가능 (+ 3000원)',4,11],
 ['ryohe','빈티지 워시드 그레이 자켓',89000,'상의','코튼 혼방, 코팅 가공 (추정)','M','워시드 차콜 그레이','특성상 미세한 스크래치 / 사용감','당일 배송 가능 (+ 3000원)',1,7]
];
export const products=productRows.map(([shopId,name,price,category,material,size,color,flaws,shipping,photoCount,catalogIndex])=>({id:`${shopId}-01`,shopId,name,price,category,material,size,color,flaws,shipping,photoCount,catalogIndex,brand:shops.find(s=>s.id===shopId).name}));
// Exact physical descriptions identify source photos, not newly invented catalog entries.
const deckDescriptions={
 all:['갈색 베스트와 데님','검은 테일러드 수트','그래피티 앞 레이어드 스타일','갈색 비대칭 런웨이','체크 후드 셔츠','흰 셔츠와 데님 런웨이','회색 수트 런웨이','검은 민소매와 와이드 팬츠','베이지 레이어드 수트','갈색 레이어드 런웨이','조형적인 검은 코트','검은 수트 런웨이'],
 mens:['베이지 재킷과 데님','흰 티셔츠와 짙은 팬츠','데님 레이어드 스타일','올리브 유틸리티 수트','보라색 후드','올블랙 레이어드','노란 셔츠와 프린트 데님','짙은색 아웃도어 셋업','검은 수트와 허리 가방','베이지 조형적 스타일','데님 런웨이','민트색 티셔츠'],
 womens:['흰 후드 스트리트','회색 민소매와 검은 스커트','검은 원피스와 노란 타이츠','올리브 상의와 검은 팬츠','회색 재킷과 데님','베이지 톤 스커트','네이비 상의와 올리브 팬츠','검은 조형적 수트','검은 후드 레이어드','프린트 티셔츠와 체크 스커트','회색 니트 스타일','검은 롱스커트 수트']
};
// Presentation-only heuristic metadata; original Figma style metadata was not exported.
const deckTags={all:['아메카지','클래식','스트리트','유니크','스트리트','클래식','아방가르드','미니멀','아티잔','보헤미안','아방가르드','클래식'],mens:['빈티지','미니멀','스트리트','워크웨어','스트리트','다크웨어','유니크','워크웨어','재패니스','아티잔','빈티지','유니크'],womens:['스트리트','미니멀','페미닌','워크웨어','빈티지','페미닌','아메카지','아방가르드','다크웨어','유니크','유니크','클래식']};
export const decks=Object.fromEntries(Object.entries(deckDescriptions).map(([gender,descriptions])=>[gender,descriptions.map((description,i)=>({id:`${gender}-${i+1}`,gender,description,styleTags:[deckTags[gender][i]],key:assetKey('taste',gender,i+1)}))]));
export const puzzleOrder={all:[4,2,3,5,1,9,7,8,6,10,11,12],mens:[10,2,1,4,12,6,5,8,3,9,11,7],womens:[4,5,6,1,8,3,12,11,10,7,2,9]};
export const exploreStyleOrder=[0,1,2,3,4,5,7,9,8,6];
export const exploreCounts=[124,98,156,72,113,87,87,113,113,87];
export const popularShops=[['apt','APT','빈티지 · 페미닌','서울 중구 퇴계로 41길 39 401호'],['otjip','OTJIP','미니멀 · 아메카지','서울 종로구 옥인길 21F 옷;집'],['sheep','SHEEP','페미닌 · 미니멀','서울 중구 마른내로 55 4F'],['easterpink','EASTERPINK','빈티지 · 유니크','서울 중구 을지로 20길 32-3 204호'],['sigote','SIGOTE','빈티지 · 미니멀','서울 중구 을지로 12길 5 4F 406호']].map(([id,name,styles,address])=>({id,name,styles,address}));
export const newShops=[['bronzw','BRONZWICK.2','아카이브 · 다크웨어 · 빈티지','서울 성동구 연무장길 2 2F'],['balbal','BALBALVINTAGE','아메카지 · 스트리트','서울 성동구 연무장 13길 19 B1'],['paramade','PARAMADE_PICKERS','빈티지 · 유니크','서울 성동구 연무장 15길 11 에스팩토리 B동 117, 118호'],['hydo','HYDO','스트리트 · 다크웨어 · 아메카지','서울 성동구 뚝섬로 15길 29-1 B1'],['hyso','HYSO','아메카지 · 빈티지','서울 용산구 이태원로 138'],['maker','MAKERVINTAGE','아카이브 · 아메카지','서울 종로구 지봉로 12 108호']].map(([id,name,styles,address])=>({id,name,styles,address}));
export const allAssetKeys=[...Object.values(decks).flat().map(c=>c.key),...results.flatMap(r=>Array.from({length:4},(_,i)=>assetKey('result',r.id,i+1))),...shops.flatMap(s=>[assetKey('logo',s.id),...Array.from({length:s.galleryCount},(_,i)=>assetKey('gallery',s.id,i+1)),...['feed','catalog'].flatMap(g=>Array.from({length:15},(_,i)=>assetKey(g,s.id,i+1))),...['new','sale','today','info'].flatMap(t=>Array.from({length:t==='info'&&s.id==='ttul'?0:t==='new'?s.newCount:t==='sale'?s.saleCount:1},(_,i)=>assetKey(`story-${t}`,s.id,i+1)))]),...products.flatMap(p=>[assetKey('product-hero',p.id),...Array.from({length:p.photoCount},(_,i)=>assetKey('product',p.id,i+1))]),...styleNames.map((_,i)=>assetKey('explore-style',i)),...popularShops.concat(newShops).map(s=>assetKey('explore-shop',s.id)),assetKey('explore','hero'),assetKey('map','background'),assetKey('map','info'),assetKey('my','basket'),assetKey('my','profile')];
export function shopOpenAt(shop,date=new Date()) {
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
 const part=t=>parts.find(p=>p.type===t)?.value;
 const day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(part('weekday'));
 const now=part('hour')+':'+part('minute');
 const from=shop.id==='ototo'&&day===1?'14:00':shop.range[0];
 return shop.days.includes(day)&&now>=from&&now<shop.range[1];
}
export function dateInSeoul(date=new Date()) {const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);return ['year','month','day'].map(t=>parts.find(p=>p.type===t).value).join('-');}
export function slotsForDate(shop,date) {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return [];
 const day=new Date(date+'T12:00:00+09:00').getUTCDay();
 if(!shop.days.includes(day))return [];
 const from=shop.id==='ototo'&&day===1?'14:00':shop.range[0];
 const minute=s=>Number(s.slice(0,2))*60+Number(s.slice(3));
 const slots=[];for(let m=minute(from);m<minute(shop.range[1]);m+=30)slots.push(`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`);
 return slots;
}
