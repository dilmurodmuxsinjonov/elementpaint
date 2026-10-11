import {startSuppliedLoader} from './supplied-loader.js?v=20261011.2';

// Keep the supplied drawing intact; mount a fresh scene for each replay.
export async function createPaintIntro({loader}){
  const response=await fetch(new URL('./supplied-loader.html?v=20261011.2',import.meta.url));
  if(!response.ok)throw new Error('Loader artwork unavailable');
  const markup=await response.text();
  const artwork=loader.querySelector('.intro-artwork');
  let animation;
  return {
    play(done){
      animation?.stop();artwork.innerHTML=markup;
      loader.classList.remove('is-leaving');loader.dataset.theme=document.documentElement.dataset.theme||'light';
      loader.dataset.fill='0';loader.dataset.phase='enter';loader.setAttribute('aria-valuenow','0');
      animation=startSuppliedLoader(loader,done);
    },
    setProgress(value){animation?.progress(value);},
    stop(){animation?.stop();animation=undefined;loader.classList.remove('is-leaving');}
  };
}