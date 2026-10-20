// UI-independent rules for the advanced PRD. Assets must come from verified Figma frames.
export const tasteCategories = [
 ['ARCHIVE / CLASSIC', ['아카이브','클래식','럭셔리']],
 ['DARK / AVANT-GARDE', ['다크웨어','아방가르드','해체주의']],
 ['JAPANESE / ARTISAN', ['재패니스','재패니즈','아티잔']],
 ['VINTAGE / RETRO', ['빈티지','레트로','웨스턴']],
 ['AMEKAJI / WORKWEAR', ['아메카지','워크웨어','밀리터리']],
 ['STREET / Y2K', ['스트리트','Y2K','그런지']],
 ['MINIMAL / MODERN', ['미니멀','모던','컨템포러리']],
 ['FUTURISM / TECH', ['퓨처리즘','고프코어','테크웨어']],
 ['UNIQUE / EXPERIMENTAL', ['유니크','실험적','볼드']],
 ['FEMININE / BOHEMIAN', ['페미닌','보헤미안','로맨틱']]
].map(([name,tags],i)=>({id:i+1,name,tags})).filter(category=>category.id!==8);

export function createTasteSession(gender, cards) {
 if (!['womens','mens','all'].includes(gender)) throw new Error('Invalid gender preference');
 if (cards.length !== 12 || new Set(cards.map(c=>c.id)).size !== 12 || cards.some(c=>!c.id)) throw new Error('Exactly twelve distinct cards are required');
 return {gender,cardIds:cards.map(c=>c.id),decisions:{},activeImageId:cards[0].id};
}
export function decideTaste(session,id,decision) {
 if (!session.cardIds.includes(id) || !['like','skip'].includes(decision)) throw new Error('Invalid taste decision');
 if (Object.hasOwn(session.decisions,id)) return session;
 const decisions={...session.decisions,[id]:decision};
 const index=session.cardIds.indexOf(id);
 const next=[...session.cardIds.slice(index+1),...session.cardIds.slice(0,index+1)].find(key=>!Object.hasOwn(decisions,key));
 return {...session,decisions,activeImageId:next??null};
}
export function browseTaste(session,step) {
 const i=session.cardIds.indexOf(session.activeImageId);
 const n=session.cardIds.length;
 return {...session,activeImageId:session.cardIds[(Math.max(0,i)+Math.sign(step)+n)%n]};
}
export function tasteProgress(session) {
 const count=session.cardIds.filter(id=>['like','skip'].includes(session.decisions[id])).length;
 return {count,total:session.cardIds.length,complete:count===12};
}
export function analyzeTaste(session,cards) {
 const liked=cards.filter(c=>session.cardIds.includes(c.id)&&session.decisions[c.id]==='like');
 const scores=tasteCategories.map(category=>({...category,score:liked.reduce((n,c)=>n+(c.styleTags??[]).filter(t=>category.tags.includes(t)).length,0)}));
 scores.sort((a,b)=>b.score-a.score||a.id-b.id);
 return {category:scores[0].score?scores[0]:null,likedIds:liked.map(c=>c.id),scores};
}
export function setStyleFilter(current,tag) {
 if(current.includes(tag))return current.filter(t=>t!==tag);
 return current.length<5?[...current,tag]:current;
}
export function distanceMeters(a,b) {
 if(!a||!b||![a.lat,a.lng,b.lat,b.lng].every(Number.isFinite)||[a,b].some(p=>Math.abs(p.lat)>90||Math.abs(p.lng)>180))return null;
 const rad=n=>n*Math.PI/180;
 const dlat=rad(b.lat-a.lat),dlng=rad(b.lng-a.lng);
 const h=Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlng/2)**2;
 return 6371000*2*Math.asin(Math.sqrt(Math.min(1,h)));
}
export function filterShops(shops,filters,{location=null,savedIds=[],recommendedIds=[]}={}) {
 return shops.filter(s=>{
  const distance=distanceMeters(location,s);
  return (!filters.styleTags?.length||filters.styleTags.some(t=>s.styleTags?.includes(t)))
   && (filters.distanceMeters==null||(distance!==null&&distance<=filters.distanceMeters))
   && (!filters.openNow||s.openNow===true)
   && (!filters.savedOnly||savedIds.includes(s.id))
   && (!filters.tasteMatch||recommendedIds.includes(s.id));
 });
}
export function pinState(shop,{selectedId,savedIds=[],recommendedIds=[],showOpen=true,showSaved=true,showTaste=true}={}) {
 const states=[];
 if(showOpen&&shop.openNow===true)states.push('open');
 if(showTaste&&recommendedIds.includes(shop.id))states.push('recommended');
 if(showSaved&&savedIds.includes(shop.id))states.push('saved');
 if(selectedId===shop.id)states.push('selected');
 return {primary:states.at(-1)??'default',states};
}
export function selectPin(selectedId,id){return {selectedId:id,openPreview:selectedId===id};}
export function mergeSaved(guest=[],account=[]) {return [...new Set([...account,...guest])];}
export function storyRoute(shopId,type) {
 if(!['new','today','sale','info'].includes(type))throw new Error('Invalid story type');
 return `/story/${encodeURIComponent(shopId)}/${type}`;
}
// Dates and available slots are supplied in the shop's local time, not browser time.
export function validateReservation(input,{today,availableSlots=[],reservations=[],userId}={}) {
 const errors={};
 const parsedDate=new Date(String(input.date)+'T12:00:00Z');
 const validDate=/^\d{4}-\d{2}-\d{2}$/.test(input.date??'')&&Number.isFinite(parsedDate.getTime())&&parsedDate.toISOString().slice(0,10)===input.date;
 if(!validDate||!today||input.date<today)errors.date='방문 가능한 날짜를 선택해 주세요.';
 if(!availableSlots.includes(input.time))errors.time='방문 가능한 시간을 선택해 주세요.';
 if(!Number.isInteger(input.people)||input.people<1||input.people>10)errors.people='방문 인원을 확인해 주세요.';
 if(!input.shopId||!input.productId)errors.product='상품과 매장을 확인해 주세요.';
 if(!userId)errors.user='시연용 로그인이 필요합니다.';
 if(reservations.some(r=>r.status!=='CANCELLED'&&r.status!=='EXPIRED'&&r.shopId===input.shopId&&r.productId===input.productId))errors.duplicate='이미 예약된 상품입니다.';
 return {valid:Object.keys(errors).length===0,errors};
}
export function validateSignup({email='',password='',confirmation='',age=false,terms=false,privacy=false}) {
 const errors={};
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))errors.email='이메일 형식을 확인해 주세요.';
 if(password.length<8)errors.password='비밀번호는 8자 이상 입력해 주세요.';
 if(password!==confirmation)errors.confirmation='비밀번호가 일치하지 않습니다.';
 if(!age||!terms||!privacy)errors.consent='필수 동의 항목을 확인해 주세요.';
 return {valid:Object.keys(errors).length===0,errors};
}
