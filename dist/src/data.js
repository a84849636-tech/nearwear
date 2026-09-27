export const asset = name => `/public/assets/${name}.${['exterior','editorial','rail','bag','shoes','accessory'].includes(name)?'png':'jpg'}`;
export const styles = ['Archive','Y2K','Minimal','Street','Workwear','Classic','Japanese','Designer'];
export const stores = [
 {id:'afterdark',name:'AFTERDARK',subtitle:'Old clothes. New stories.',styles:['Archive','Street','Vintage'],distance:0.4,open:true,close:'22:00',address:'서울 마포구 와우산로29길 일대',area:'서교동',x:48,y:44},
 {id:'ordinary',name:'ORDINARY ARCHIVE',subtitle:'Everyday, collected.',styles:['Minimal','Classic'],distance:0.8,open:true,close:'20:00',address:'서울 마포구 동교로 일대',area:'연남동',x:71,y:25},
 {id:'room',name:'ROOM 203',subtitle:'Pieces with a past.',styles:['Y2K','Japanese'],distance:1.2,open:false,close:'20:00',address:'서울 마포구 독막로 일대',area:'상수동',x:68,y:72},
 {id:'worn',name:'WORN STUDIO',subtitle:'Made to be worn again.',styles:['Workwear','Designer'],distance:1.7,open:true,close:'21:00',address:'서울 마포구 잔다리로 일대',area:'합정동',x:24,y:63}
];
// Additional fictional shops spread across the pannable neighborhood map.
stores.push(
 {id:'second-room',name:'SECOND ROOM',styles:['Minimal','Japanese'],distance:0.6,open:true,close:'21:00',address:'서울 마포구 성미산로 일대',area:'연남동',x:19,y:34},
 {id:'faded',name:'FADED',styles:['Archive','Workwear'],distance:0.9,open:true,close:'20:00',address:'서울 마포구 와우산로 일대',area:'서교동',x:83,y:51},
 {id:'moss',name:'MOSS VINTAGE',styles:['Classic','Japanese'],distance:1.1,open:false,close:'20:00',address:'서울 마포구 양화로 일대',area:'합정동',x:43,y:84},
 {id:'off-record',name:'OFF RECORD',styles:['Street','Y2K'],distance:1.4,open:true,close:'22:00',address:'서울 마포구 독막로 일대',area:'상수동',x:8,y:82},
 {id:'slow-archive',name:'SLOW ARCHIVE',styles:['Archive','Designer'],distance:1.6,open:true,close:'20:00',address:'서울 마포구 동교로 일대',area:'연남동',x:8,y:-20},
 {id:'thread',name:'THREAD',styles:['Workwear','Classic'],distance:1.8,open:true,close:'21:00',address:'서울 마포구 잔다리로 일대',area:'합정동',x:-38,y:45},
 {id:'blue-hour',name:'BLUE HOUR',styles:['Street','Archive'],distance:2.0,open:true,close:'22:00',address:'서울 마포구 와우산로 일대',area:'서교동',x:127,y:29},
 {id:'form',name:'FORM & FOUND',styles:['Minimal','Designer'],distance:2.1,open:false,close:'19:00',address:'서울 마포구 토정로 일대',area:'상수동',x:97,y:116},
 {id:'odd-season',name:'ODD SEASON',styles:['Y2K','Designer'],distance:2.3,open:true,close:'21:00',address:'서울 마포구 성미산로 일대',area:'연남동',x:86,y:-28},
 {id:'west-end',name:'WEST END',styles:['Workwear','Street'],distance:2.5,open:true,close:'20:00',address:'서울 마포구 월드컵로 일대',area:'합정동',x:-46,y:107},
 {id:'still',name:'STILL',styles:['Classic','Minimal'],distance:2.7,open:false,close:'19:00',address:'서울 마포구 독막로 일대',area:'상수동',x:32,y:135},
 {id:'recollect',name:'RECOLLECT',styles:['Japanese','Archive'],distance:2.9,open:true,close:'21:00',address:'서울 마포구 신촌로 일대',area:'서교동',x:146,y:87}
);
export const products = [
 {id:'leather',name:'Faded leather jacket',ko:'페이디드 레더 재킷',price:128000,category:'OUTER',size:'L · 어깨 48 / 가슴 56 / 총장 66 cm',condition:'B+ · 자연스러운 가죽 에이징',image:'jacket',stock:true,description:'시간이 남긴 주름과 부드러운 질감. 여유 있는 실루엣의 블랙 레더 재킷입니다. 소매 끝의 사용감까지 빈티지 고유의 매력으로 남아 있어요.'},
 {id:'denim',name:'Washed straight denim',ko:'워시드 스트레이트 데님',price:68000,category:'BOTTOM',size:'W30 · 허리 39 / 총장 102 cm',condition:'B · 워싱 및 밑단 사용감',image:'denim',stock:true,description:'차분하게 바랜 인디고 컬러와 곧게 떨어지는 스트레이트 핏. 계절을 넘어 자주 손이 갈 데님입니다.'},
 {id:'shirt',name:'Everyday cotton shirt',ko:'에브리데이 코튼 셔츠',price:42000,category:'TOP',size:'M · 어깨 45 / 가슴 53 / 총장 72 cm',condition:'A · 좋은 컨디션',image:'shirt',stock:true,description:'담백한 코튼 소재의 셔츠. 단독으로도, 가벼운 레이어드로도 어울리는 한 벌입니다.'},
 {id:'knit',name:'Printed cotton tee',ko:'프린티드 코튼 티셔츠',price:36000,category:'TOP',size:'M · 가슴 52 / 총장 68 cm',condition:'B+ · 미세한 사용감',image:'knit',stock:false,description:'빈티지 프린트와 편안한 실루엣이 어울리는 코튼 티셔츠입니다.'},
 {id:'coat',name:'Olive field jacket',ko:'올리브 필드 재킷',price:89000,category:'OUTER',size:'L · 어깨 47 / 총장 74 cm',condition:'A · 좋은 컨디션',image:'coat',stock:true,description:'차분한 올리브 컬러와 넉넉한 포켓의 필드 재킷. 데님과 함께 일상의 룩으로 연출해 보세요.'},
 {id:'cotton',name:'Soft cotton essentials',ko:'소프트 코튼 에센셜',price:32000,category:'TOP',size:'M · 가슴 51 / 총장 65 cm',condition:'B+ · 가벼운 사용감',image:'detail',stock:false,description:'부드러운 코튼 질감이 돋보이는 데일리 아이템입니다.'}
];
export const posts = [
 {id:'p1',image:'editorial',label:'WORN IN, NEVER OUT.',caption:'레더 재킷 스타일링.',tags:'#Leather #Archive #NewArrival',items:['leather'],kind:'NEW ARRIVAL'},
 {id:'p2',image:'denim',label:'THE BLUE EDIT',caption:'이번 주 입고된 워시드 데님.',tags:'#Denim #Vintage',items:['denim'],kind:'CURATED PIECES'},
 {id:'p3',image:'rail',label:'A SLOW AFTERNOON',caption:'매장 아우터 진열.',tags:'#OurSpace #Seogyo',items:[],kind:'OUR SPACE'},
 {id:'p4',image:'exterior',label:'A PLACE TO FIND',caption:'매장 입구. 위치는 INFO에서 확인하세요.',tags:'#OurSpace #VintageShop',items:[],kind:'OUR SPACE'},
 {id:'p5',image:'jacket',label:'THE LEATHER EDIT',caption:'블랙 레더 재킷. 소매와 가죽 상태를 확인하세요.',tags:'#Leather #Details',items:['leather'],kind:'DETAILS'},
 {id:'p6',image:'coat',label:'EVERYDAY ARCHIVE',caption:'올리브 필드 재킷 스타일링.',tags:'#Classic #Outer',items:['coat'],kind:'THE ARCHIVE'}
];
export const stories = [
 {name:'NEW',image:'editorial',time:'2시간 전',title:'NEW ARRIVALS',text:'오늘 들어온 레더 & 데님 셀렉션. 먼저 둘러보세요.',items:true},
 {name:'TODAY',image:'interior',time:'3시간 전',title:'오늘도, 열려 있어요.',text:'오늘의 영업시간 13:00 — 22:00. 천천히 들러주세요.'},
 {name:'SALE',image:'rail',time:'5시간 전',title:'SELECTED SALE',text:'선택 상품 최대 20% 할인. 가격은 상품 페이지를 확인하세요.',items:true},
 {name:'INFO',image:'exterior',time:'1일 전',title:'STORE INFO',text:'피팅 가능합니다. 빈티지는 같은 상품도 한 벌씩 다르니 직접 확인해 주세요.'}
];

// Additive catalog refinement: existing IDs, prices and stock fields stay valid.
products.push(
 {id:'bag',name:'Worn leather shoulder bag',ko:'레더 숄더백',price:72000,category:'BAG',size:'ONE SIZE',measurements:'가로 28 / 높이 19 / 폭 9 cm',condition:'B · 사용감 있음',flaws:'모서리 마모, 버클 미세 스크래치',image:'bag',stock:true},
 {id:'shoes',name:'Leather penny loafers',ko:'레더 페니 로퍼',price:84000,category:'SHOES',size:'EU 40',measurements:'인솔 25.5 / 발볼 9.5 cm',condition:'B · 가죽 주름 있음',flaws:'밑창 마모, 앞코 미세 스크래치',image:'shoes',stock:true},
 {id:'accessory',name:'Silver chain & ring set',ko:'실버 체인·링 세트',price:48000,category:'ACCESSORIES',size:'ONE SIZE',measurements:'체인 48 cm / 링 내경 18 mm',condition:'B+ · 빈티지 변색',flaws:'표면 미세 스크래치',image:'accessory',stock:true}
);
for(const p of products){
 const split=p.size.split(' · ');p.measurements??=split[1]||'상세 치수는 매장에서 확인';p.size=split[0];
 p.flaws??=({leather:'소매 끝 마모, 가죽 표면 주름',denim:'밑단 해짐, 워싱 편차',shirt:'소매 안쪽 옅은 얼룩',knit:'프린트 미세 갈라짐',coat:'소매 끝 마모',cotton:'넥라인 미세 늘어남'})[p.id]||'미세한 사용감';
 p.images=[{image:p.image,label:'FRONT'},{image:p.id==='leather'?'editorial':p.image,label:p.id==='leather'?'STYLING':'DETAIL',detail:p.id!=='leather'}];
}
posts.push(
 {id:'p7',image:'bag',label:'LEATHER BAG',caption:'버클과 가죽의 사용감을 확인해 보세요.',tags:'#Leather #Bag',items:['bag'],kind:'BAGS'},
 {id:'p8',image:'shoes',label:'PENNY LOAFERS',caption:'주름과 밑창 상태까지 확인할 수 있는 레더 로퍼.',tags:'#Classic #Shoes',items:['shoes'],kind:'SHOES'},
 {id:'p9',image:'accessory',label:'SILVER DETAILS',caption:'체인과 링, 작은 디테일의 조합.',tags:'#Silver #Accessories',items:['accessory'],kind:'ACCESSORIES'},
 {id:'p10',image:'shirt',label:'COTTON SHIRT',caption:'코튼 셔츠. 실측과 컨디션을 확인하세요.',tags:'#Classic #Cotton',items:['shirt'],kind:'TOPS'},
 {id:'p11',image:'knit',label:'GRAPHIC TEE',caption:'빈티지 프린트 티셔츠.',tags:'#Graphic #Street',items:['knit'],kind:'TOPS'},
 {id:'p12',image:'detail',label:'COTTON ESSENTIALS',caption:'단독으로도 레이어드로도 입기 좋은 코튼.',tags:'#Minimal #Cotton',items:['cotton'],kind:'TOPS'}
);
const storeMedia={afterdark:['rail','rack','exterior'],ordinary:['interior','rail','rack'],room:['rack','interior','rail'],worn:['exterior','rail','interior']};
const audiences={afterdark:['WOMENSWEAR','MENSWEAR'],ordinary:['MENSWEAR'],room:['WOMENSWEAR'],worn:['MENSWEAR','WOMENSWEAR']};
for(const [i,s] of stores.entries()){s.gallery=storeMedia[s.id]||Object.values(storeMedia)[i%4];s.cover=s.gallery[0];s.audience=audiences[s.id]||['WOMENSWEAR','MENSWEAR'];}
export function postsFor(storeId){
 const orders={afterdark:['p1','p2','p7','p3','p8','p9','p5','p6','p4','p10','p11','p12'],ordinary:['p10','p8','p12','p6','p7','p3','p2','p9','p4'],room:['p11','p9','p7','p1','p12','p10','p3','p8','p2'],worn:['p6','p2','p3','p5','p8','p10','p7','p9','p4']};
 return (orders[storeId]||Object.values(orders)[Math.max(0,stores.findIndex(s=>s.id===storeId))%4]).map(id=>posts.find(p=>p.id===id));
}
