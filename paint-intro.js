import {startSuppliedLoader} from './supplied-loader.js?v=20261014.1';

// Keep the supplied drawing intact; mount a fresh scene for each replay.
export async function createPaintIntro({loader}){
  const response=await fetch(new URL('./supplied-loader.html?v=20261014.1',import.meta.url));
  if(!response.ok)throw new Error('Loader artwork unavailable');
  const markup=await response.text();
  // Decode the supplied can before mounting the scene: never pour from an
  // empty SVG image on a slow connection. Failure releases the existing page.
  const product=new Image();
  product.src=new URL('./assets/product-open-amber-v3.png',import.meta.url).href;
  await product.decode();
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
