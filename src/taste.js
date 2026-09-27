// Pure metadata scoring. No shop is removed as a consequence of taste matching.
export const tasteImages = [
 {id:'t01',image:'editorial',title:'Leather, worn in',gender:'WOMENSWEAR',weights:{Archive:3,Street:2},traits:{'Dark tones':3,'Leather textures':2}},
 {id:'t02',image:'denim',title:'Faded indigo',gender:'ALL',weights:{Archive:3,Workwear:2},traits:{'Worn denim':3,'Relaxed silhouettes':1}},
 {id:'t03',image:'coat',title:'Field layers',gender:'WOMENSWEAR',weights:{Workwear:3,Japanese:2},traits:{'Earth tones':3,'Utility details':2}},
 {id:'t04',image:'shirt',title:'Clean lines',gender:'MENSWEAR',weights:{Classic:3,Minimal:2},traits:{'Clean lines':3,'Light tones':2}},
 {id:'t05',image:'bag',title:'Lived-in leather',gender:'ALL',weights:{Archive:2,Classic:3},traits:{'Leather textures':3,'Earth tones':1}},
 {id:'t06',image:'knit',title:'Graphic stories',gender:'ALL',weights:{Y2K:3,Street:2},traits:{'Graphic prints':3,'Relaxed silhouettes':1}},
 {id:'t07',image:'shoes',title:'Everyday classics',gender:'MENSWEAR',weights:{Classic:3,Minimal:1},traits:{'Dark tones':2,'Clean lines':2}},
 {id:'t08',image:'accessory',title:'Silver details',gender:'ALL',weights:{Designer:3,Y2K:2},traits:{'Silver details':3,'Dark tones':2}},
 {id:'t09',image:'jacket',title:'The leather edit',gender:'MENSWEAR',weights:{Archive:3,Street:2},traits:{'Leather textures':3,'Dark tones':2}},
 {id:'t10',image:'detail',title:'Soft essentials',gender:'ALL',weights:{Minimal:3,Classic:1},traits:{'Light tones':3,'Clean lines':2}},
 {id:'t11',image:'rail',title:'Utility archive',gender:'ALL',weights:{Workwear:3,Archive:2},traits:{'Earth tones':2,'Utility details':3}},
 {id:'t12',image:'rack',title:'Collected colors',gender:'WOMENSWEAR',weights:{Japanese:3,Designer:2},traits:{'Layering':3,'Earth tones':2}}
];
export function discoveryDeck(preference='ALL') {
 return [...tasteImages].sort((a,b)=>preference==='ALL'?0:Number(b.gender===preference)-Number(a.gender===preference));
}
export function metadataFor(image) {
 return tasteImages.find(t=>t.image===image)||{weights:{Archive:1},traits:{'Layering':1}};
}
export function computeTaste(votes={},added=[],legacy=[]) {
 const weights={},traits={};
 const add=(meta)=>{for(const [key,value] of Object.entries(meta.weights))weights[key]=(weights[key]||0)+value;for(const [key,value] of Object.entries(meta.traits))traits[key]=(traits[key]||0)+value;};
 for(const image of tasteImages)if(votes[image.id]==='like')add(image);
 for(const entry of added)add(metadataFor(entry.image));
 // Retain the original chosen styles as weak priors; image choices dominate.
 for(const style of legacy)weights[style]=(weights[style]||0)+1;
 const rank=obj=>Object.entries(obj).sort((a,b)=>b[1]-a[1]).map(([key])=>key);
 return {weights,traits,styles:rank(weights).slice(0,2),features:rank(traits).slice(0,3)};
}
export function matchScore(store,profile,preference='ALL') {
 const total=Object.values(profile.weights).reduce((a,b)=>a+b,0);
 if(!total)return 0;
 const style=store.styles.reduce((n,s)=>n+(profile.weights[s]||0),0)/total;
 return style+(preference!=='ALL'&&store.audience?.includes(preference)?0.08:0);
}
export function choosePuzzle(votes,profile) {
 const liked=tasteImages.filter(t=>votes[t.id]==='like');
 const score=t=>Object.entries(t.weights).reduce((n,[k,v])=>n+v*(profile.weights[k]||0),0);
 const fill=tasteImages.filter(t=>!liked.includes(t)).sort((a,b)=>score(b)-score(a));
 return [...liked,...fill].slice(0,6).map(t=>t.id);
}
