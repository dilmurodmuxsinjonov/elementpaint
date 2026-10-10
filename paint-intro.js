import {createLiquidSurface} from './paint-liquid.js?v=20261010.4';
import {createLogoPaint} from './paint-logo.js?v=20261010.4';
const image=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});
const clamp=value=>Math.max(0,Math.min(1,value));

export async function createPaintIntro({loader,canvas,onProgress}) {
  const [can,logo]=await Promise.all([image('assets/berlak_loader_can_v1.webp'),image('assets/logo_light.png')]);
  const ctx=canvas.getContext('2d');if(!ctx)return null;
  const liquid=createLogoPaint(logo);if(!liquid)return null;
  canvas.width=840;canvas.height=800;
  const surface=createLiquidSurface();
  const box={x:54,y:278,width:312,height:logo.height/logo.width*312};
  const tip={x:box.x+box.width*liquid.entry.x,y:106};
  let frame=0,start=0,previous=0,running=false,finish;
  function stop(){running=false;cancelAnimationFrame(frame);frame=0;}

  function render(now){
    if(!running)return;
    const elapsed=(now-start)/1000,dt=(now-previous)/1000;previous=now;
    const fill=clamp((elapsed-.65)/2.7),pouring=elapsed>.65&&elapsed<3.35;
    surface.advance(dt,pouring?35+20*Math.sin(elapsed*9):0);
    ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,420,400);
    // Translucent relief: the logo remains visible before any paint arrives.
    const dark=document.documentElement.dataset.theme==='dark';
    ctx.save();ctx.filter=dark?'invert(1)':'none';ctx.globalAlpha=dark?.26:.17;
    ctx.shadowColor=dark?'#00000080':'#324b3a38';ctx.shadowBlur=3;ctx.shadowOffsetY=2;
    ctx.drawImage(logo,box.x,box.y,box.width,box.height);ctx.restore();
    ctx.save();ctx.filter='invert(1)';ctx.globalAlpha=dark?.18:.55;
    ctx.drawImage(logo,box.x-.6,box.y-.8,box.width,box.height);ctx.restore();

    const tilt=clamp(elapsed/.65),returning=clamp((elapsed-3.35)/.65);
    const angle=(18+49*Math.sin(tilt*Math.PI/2)-49*returning)*Math.PI/180;
    const cw=162,ch=can.height/can.width*cw;
    ctx.save();ctx.translate(tip.x,tip.y);ctx.rotate(angle);
    ctx.shadowColor='#163b3429';ctx.shadowBlur=16;ctx.shadowOffsetY=10;
    ctx.drawImage(can,-.853*cw,-.164*ch,cw,ch);ctx.shadowColor='transparent';
    // This PF-115 package is labelled Snow White / Qordek oq. Match the liquid.
    const inside=ctx.createLinearGradient(0,-7,0,6);
    inside.addColorStop(0,'#b9c3b2');inside.addColorStop(.45,'#fffefa');inside.addColorStop(1,'#e7e9dc');
    ctx.fillStyle=inside;ctx.beginPath();ctx.ellipse(-.353*cw,.015*ch,.288*cw,.036*ch,0,0,Math.PI*2);ctx.fill();ctx.restore();

    if(pouring){
      // Only the falling stream is outside the logo; its lower portion is alpha-clipped below.
      const endY=box.y+box.height*liquid.entry.y+1,steps=55;
      const taper=clamp((elapsed-.65)*7)*clamp((3.35-elapsed)*8);
      ctx.beginPath();
      for(let side=0;side<2;side++)for(let j=0;j<=steps;j++){
        const t=side?1-j/steps:j/steps,y=tip.y+(endY-tip.y)*t;
        const x=tip.x+Math.sin(t*Math.PI)*Math.sin(elapsed*5)*1.5;
        const radius=8/Math.sqrt(1+t*3)*(1+.06*Math.sin(elapsed*9-t*15))*taper;
        if(!side&&!j)ctx.moveTo(x-radius,y);else ctx.lineTo(x+(side?radius:-radius),y);
      }
      ctx.closePath();
      const stream=ctx.createLinearGradient(tip.x-9,0,tip.x+9,0);
      stream.addColorStop(0,'#b9c3b2');stream.addColorStop(.23,'#edeedf');stream.addColorStop(.5,'#fffefa');stream.addColorStop(1,'#d6d8cb');
      ctx.fillStyle=stream;ctx.fill();
    }
    const paint=liquid.draw({fill,time:elapsed,height:surface.height,pouring});
    ctx.save();ctx.shadowColor=dark?'#00000050':'#354d3c88';ctx.shadowBlur=2.5;ctx.shadowOffsetY=1.5;
    ctx.drawImage(paint,box.x,box.y,box.width,box.height);ctx.restore();
    onProgress?.(fill);loader.dataset.fill=String(Math.round(fill*100));
    loader.dataset.phase=elapsed<.65?'glass':pouring?'pouring':elapsed<3.85?'settling':'filled';
    if(elapsed>4.15){stop();finish?.();}else frame=requestAnimationFrame(render);
  }
  return {play(done){stop();surface.reset();finish=done;start=previous=performance.now();running=true;frame=requestAnimationFrame(render);},stop};
}
