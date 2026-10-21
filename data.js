/* All stores, stock and locations below are fictional MVP data. */
const styles=['Y2K','Feminine','90s Casual','Grunge','Minimal','Street'];
const areas=['성수','한남','홍대','을지로'];
const categoryLabels={ALL:'전체',TOP:'상의',BOTTOM:'하의',OUTER:'아우터',ETC:'기타'};
const tasteCards=[{style:'Y2K',img:0},{style:'Feminine',img:1},{style:'90s Casual',img:4},{style:'Grunge',img:3},{style:'Minimal',img:4},{style:'Street',img:5}];
const stores=[
 {id:0,name:'LOST & FOUND',area:'성수',styles:['Y2K','Feminine','90s Casual'],match:92,price:'₩₩',minutes:7,isOpen:true,hours:'12:00–21:00',image:2,mood:0,description:'레이스와 오래된 데님 사이에서 발견하는 90년대의 일상. 부드러운 실루엣과 자연스러운 워싱을 중심으로 고릅니다.'},
 {id:1,name:'ARCHIVE ROOM',area:'성수',styles:['Minimal','90s Casual'],match:84,price:'₩₩₩',minutes:11,isOpen:true,hours:'13:00–20:00',image:4,mood:1,description:'정돈된 실루엣과 담백한 소재를 모으는 아카이브. 데님과 단색 의류를 천천히 둘러보세요.'},
 {id:2,name:'SECOND SCENE',area:'성수',styles:['Street','Grunge'],match:76,price:'₩₩',minutes:14,isOpen:false,hours:'14:00–20:00 · 월요일 휴무',image:5,mood:3,description:'바랜 프린트와 거친 질감, 음악이 남긴 옷을 찾습니다. 그래픽 티셔츠와 스트리트 아이템 중심의 셀렉션.'},
 {id:3,name:'ODD HOURS',area:'성수',styles:['Grunge','Y2K'],match:89,price:'₩',minutes:9,isOpen:true,hours:'12:00–22:00',image:3,mood:5,description:'가죽의 시간과 낡은 프린트의 표정을 좋아합니다. 조금은 낯선 조합을 제안하는 작은 숍.'},
 {id:4,name:'AFTER SCHOOL',area:'홍대',styles:['Street','Y2K'],match:87,price:'₩',minutes:6,isOpen:true,hours:'12:00–21:00',image:5,mood:0,description:'가볍게 입기 좋은 그래픽과 데님. 편안한 일상 속 작은 포인트를 모았습니다.'},
 {id:5,name:'STILL LIFE',area:'한남',styles:['Minimal','Feminine'],match:82,price:'₩₩₩',minutes:12,isOpen:true,hours:'11:00–19:00',image:1,mood:4,description:'소재의 결이 드러나는 빈티지. 섬세한 레이스와 차분한 기본 아이템을 만나보세요.'},
 {id:6,name:'OLD WORKS',area:'을지로',styles:['Grunge','90s Casual'],match:79,price:'₩₩',minutes:8,isOpen:true,hours:'13:00–21:00',image:3,mood:2,description:'오랫동안 입을 수 있는 옷을 고릅니다. 가죽과 데님, 워크웨어의 질감을 살린 셀렉션.'}
];
const products=[
 {id:0,storeId:0,name:'Vintage Lace Top',ko:'빈티지 레이스 톱',price:48000,img:1,cat:'TOP',size:'M',chest:46,length:53,condition:'A',flaw:'밑단 안쪽 미세한 얼룩',style:'Feminine',status:'AVAILABLE'},
 {id:1,storeId:0,name:'Worn Leather Jacket',ko:'워시드 레더 재킷',price:128000,img:3,cat:'OUTER',size:'L',chest:58,length:65,condition:'B+',flaw:'소매와 어깨의 자연스러운 마모',style:'Grunge',status:'AVAILABLE'},
 {id:2,storeId:0,name:'90s Straight Denim',ko:'90s 스트레이트 데님',price:68000,img:4,cat:'BOTTOM',size:'28',chest:36,length:102,condition:'A',flaw:'밑단의 미세한 워싱 흔적',style:'90s Casual',status:'SOLD_OUT'},
 {id:3,storeId:0,name:'Faded Graphic Tee',ko:'페이디드 그래픽 티',price:38000,img:5,cat:'TOP',size:'S',chest:43,length:51,condition:'B+',flaw:'프린트의 자연스러운 갈라짐',style:'Street',status:'AVAILABLE'},
 {id:4,storeId:0,name:'Cotton Bandana',ko:'코튼 반다나',price:18000,img:null,cat:'ETC',size:'FREE',chest:52,length:52,condition:'B+',flaw:'모서리의 작은 보풀',style:'Y2K',status:'AVAILABLE'},
 {id:5,storeId:1,name:'Archive Straight Denim',ko:'아카이브 스트레이트 데님',price:78000,img:4,cat:'BOTTOM',size:'30',chest:39,length:104,condition:'A',flaw:'왼쪽 무릎의 작은 워싱 자국',style:'Minimal',status:'AVAILABLE'},
 {id:6,storeId:1,name:'Delicate Lace Camisole',ko:'레이스 캐미솔',price:52000,img:1,cat:'TOP',size:'S',chest:42,length:49,condition:'A',flaw:'눈에 띄는 하자 없음',style:'Feminine',status:'AVAILABLE'},
 {id:7,storeId:2,name:'Music Graphic Tee',ko:'뮤직 그래픽 티',price:42000,img:5,cat:'TOP',size:'M',chest:48,length:62,condition:'B',flaw:'앞면 프린트의 부분적인 벗겨짐',style:'Street',status:'AVAILABLE'},
 {id:8,storeId:3,name:'Distressed Leather',ko:'디스트레스드 레더 재킷',price:98000,img:3,cat:'OUTER',size:'M',chest:55,length:61,condition:'B',flaw:'지퍼 주변의 마모',style:'Grunge',status:'RESERVED'},
 {id:9,storeId:4,name:'School Graphic Tee',ko:'스쿨 그래픽 티',price:32000,img:5,cat:'TOP',size:'M',chest:49,length:60,condition:'B+',flaw:'목 부분의 자연스러운 늘어남',style:'Street',status:'AVAILABLE'},
 {id:10,storeId:5,name:'Soft Lace Top',ko:'소프트 레이스 톱',price:58000,img:1,cat:'TOP',size:'M',chest:45,length:52,condition:'A',flaw:'안쪽 라벨의 변색',style:'Feminine',status:'AVAILABLE'},
 {id:11,storeId:6,name:'Old Works Leather',ko:'올드 워크스 레더',price:118000,img:3,cat:'OUTER',size:'L',chest:59,length:66,condition:'B+',flaw:'팔꿈치 부분의 마모',style:'Grunge',status:'AVAILABLE'}
];
const statusLabels={AVAILABLE:'판매 가능',RESERVED:'예약 중',SOLD_OUT:'품절',ACTIVE:'예약 유지 중',EXPIRED:'예약 만료',CANCELLED:'예약 취소'};
