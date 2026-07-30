export function route(){const hash=location.hash.replace(/^#\/?/,''); if(!hash)return {name:'welcome'}; if(hash.startsWith('assessment/')){const step=Number(hash.split('/')[1]);return {name:'assessment',step:Number.isFinite(step)?step:1};} if(hash==='recommendation')return {name:'recommendation'}; return {name:'welcome'};}
export function navigate(path){location.hash=`#/${path}`;}
