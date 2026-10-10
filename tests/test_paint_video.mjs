import assert from 'node:assert/strict';
import {createVideoIntro} from '../element_paint_web/paint-video.js';
class Video extends EventTarget{
  readyState=0;currentTime=0;muted=false;paused=true;loads=0;
  sources=[{dataset:{src:'clip.webm'}},{dataset:{src:'clip.mp4'}}];
  querySelector(){return this.sources.some(source=>source.src)?this.sources[0]:null;}
  querySelectorAll(){return this.sources;}
  load(){this.loads++;}
  pause(){this.paused=true;}
  async play(){this.paused=false;}
  loaded(){this.readyState=2;this.dispatchEvent(new Event('loadeddata'));}
}
let finished=0,failed=0;
const video=new Video(),intro=createVideoIntro(video,{onFinish:()=>finished++,onFailure:()=>failed++});
assert.equal(video.loads,0,'Catalogue pages must not download the video eagerly');
const initial=intro.play();video.loaded();assert.equal(await initial,true);
assert.equal(video.muted,true);assert.equal(video.currentTime,0);assert.equal(video.loads,1);
video.dispatchEvent(new Event('ended'));assert.equal(finished,1);
video.currentTime=4;assert.equal(await intro.play(),true);assert.equal(video.currentTime,0);assert.equal(video.loads,1);
intro.stop();video.dispatchEvent(new Event('ended'));assert.equal(finished,1,'Skipped playback must not finish again');
const slow=new Video(),slowIntro=createVideoIntro(slow,{onFailure:()=>failed++});
const cancelled=slowIntro.play();const replacement=slowIntro.play();slow.loaded();
assert.equal(await cancelled,false);assert.equal(await replacement,true);assert.equal(slow.paused,false,'Cancelled preparation must not clear the replacement');
slowIntro.stop();
const blocked=new Video();blocked.readyState=2;blocked.play=async()=>{throw new Error('Playback unavailable');};
assert.equal(await createVideoIntro(blocked,{onFailure:()=>failed++}).play(),false);assert.equal(blocked.paused,true);
const missing=new Video();assert.equal(await createVideoIntro(missing,{onFailure:()=>failed++,loadTimeout:10}).play(),false);
assert.equal(failed,2,'Unavailable playback and timeout each fail once; interruption stays silent');
const deferred=new Video();deferred.readyState=2;let resolvePlayback;
deferred.play=()=>new Promise(resolve=>{resolvePlayback=()=>{deferred.paused=false;resolve();};});
const deferredIntro=createVideoIntro(deferred),pending=deferredIntro.play();deferredIntro.stop();resolvePlayback();
assert.equal(await pending,false);assert.equal(deferred.paused,true,'Late play completion must not restart a skipped clip');
console.log('PASS: lazy download, muted playback, completion, replay, cancellation, replacement, blocked playback, timeout and late completion.');
