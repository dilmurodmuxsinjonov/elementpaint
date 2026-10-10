// Lazy video loading keeps catalogue deep links free of intro media downloads.
export function createVideoIntro(video,{onFinish,onFailure,loadTimeout=2200}={}){
  let generation=0,waiting,playing=false,active=false;
  const loaded=()=>{if(waiting){const load=waiting;waiting=undefined;clearTimeout(load.timer);load.resolve();}};
  const failed=()=>{if(waiting){const load=waiting;waiting=undefined;clearTimeout(load.timer);load.reject(new Error('Intro video unavailable'));}else onFailure?.();};
  video.addEventListener('loadeddata',loaded);
  video.addEventListener('error',failed);
  video.addEventListener('ended',()=>{if(playing){playing=false;active=false;onFinish?.();}});
  function stop(){
    generation++;playing=false;active=false;video.pause();
    if(waiting){const load=waiting;waiting=undefined;clearTimeout(load.timer);load.reject(new Error('Intro interrupted'));}
  }
  return {stop,async play(){
    stop();const current=generation;active=true;let pending;
    try{
      if(video.readyState<2){
        await new Promise((resolve,reject)=>{
          pending={resolve,reject};waiting=pending;
          pending.timer=setTimeout(()=>{if(waiting===pending)waiting=undefined;reject(new Error('Intro load timed out'));},loadTimeout);
          if(!video.querySelector('source[src]')){
            for(const source of video.querySelectorAll('source[data-src]'))source.src=source.dataset.src;
          }
          video.load();
        });
      }
      if(current!==generation)return false;
      video.currentTime=0;video.muted=true;
      await video.play();
      if(current!==generation){if(!active)video.pause();return false;}
      playing=true;return true;
    }catch{
      if(pending)clearTimeout(pending.timer);
      if(waiting===pending)waiting=undefined;
      if(current===generation){active=false;video.pause();onFailure?.();}
      return false;
    }
  }};
}
