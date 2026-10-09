export const defaultPreferences={theme:'light',motion:'full',quality:'auto',autoRotate:false,flowSpeed:1,density:'comfortable'};
export function normalizePreferences(value={}) {
  if(!value||typeof value!=='object')value={};
  return {theme:['light','dark'].includes(value.theme)?value.theme:'light',motion:['full','reduced'].includes(value.motion)?value.motion:'full',quality:['auto','eco','high'].includes(value.quality)?value.quality:'auto',autoRotate:value.autoRotate===true,flowSpeed:Number.isFinite(value.flowSpeed)?Math.min(1.5,Math.max(.5,value.flowSpeed)):1,density:value.density==='compact'?'compact':'comfortable'};
}
export function readPreferences(){try{return normalizePreferences(JSON.parse(localStorage.getItem('elementpaint-studio')||'{}'));}catch{return {...defaultPreferences};}}
export function savePreferences(value){try{localStorage.setItem('elementpaint-studio',JSON.stringify(normalizePreferences(value)));}catch{/* A blocked store must not block the catalogue. */}}
