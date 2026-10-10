import {createLiquidSurface} from './paint-liquid.js?v=20261010.2';
const image=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});
export async function createPaintIntro({loader,canvas,onProgress}) {
  const [can,logo]=await Promise.all([image('assets/berlak_loader_can_v1.webp'),image('assets/logo_light.png')]);
  const ctx=canvas.getContext('2d');if(!ctx)return null;
  canvas.width=840;canvas.height=800;
  const surface=createLiquidSurface(),mask=document.createElement('canvas');mask.width=700;mask.height=220;
  const m=mask.getContext('2d');if(!m)return null;
  let frame=0,start=0,previous=0,running=false,finish;
  function stop(){running=false;cancelAnimationFrame(frame);frame=0;}
  function render(now){
    if(!running)return;
    const elapsed=(now-start)/1000,dt=(now-previous)/1000;previous=now;
    const fill=Math.min(1,Math.max(0,(elapsed-.5)/2.7)),pouring=elapsed>.45&&elapsed<3.15;
    surface.advance(dt,pouring?40+28*Math.sin(elapsed*9):0);
    ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,420,400);
    const tip={x:264,y:106},tilt=Math.min(1,elapsed/.8),returning=Math.max(0,Math.min(1,(elapsed-3.15)/.7));
    const angle=(18+49*Math.sin(tilt*Math.PI/2)-15*returning)*Math.PI/180;
    ctx.save();ctx.translate(tip.x,tip.y);ctx.rotate(angle);ctx.shadowColor='#163b3429';ctx.shadowBlur=16;ctx.shadowOffsetY=10;ctx.drawImage(can,-.853*162,-.164*202,162,202);
    ctx.shadowColor='transparent';const inside=ctx.createLinearGradient(0,-7,0,6);inside.addColorStop(0,'#c7caba');inside.addColorStop(.45,'#f8f6e9');inside.addColorStop(1,'#e6e3d1');ctx.fillStyle=inside;ctx.beginPath();ctx.ellipse(-.353*162,0,.288*162,.026*202,0,0,Math.PI*2);ctx.fill();ctx.restore();
    // Ivory matches the can's white label; this is not a new catalogue colour.
    const poolY=316,spread=40+fill*124,poolX=tip.x-54*fill;
    ctx.save();ctx.globalAlpha=Math.min(1,fill*12);ctx.shadowColor='#354d3c24';ctx.shadowBlur=20;ctx.shadowOffsetY=13;
    ctx.beginPath();ctx.ellipse(poolX,poolY+5,spread,27+fill*15,0,0,Math.PI*2);
    const pool=ctx.createRadialGradient(tip.x,poolY-10,4,poolX,poolY,spread);
    pool.addColorStop(0,'#fffdf4');pool.addColorStop(.5,'#eee9d8');pool.addColorStop(.85,'#d7d0bc');pool.addColorStop(1,'#b8b6a4');ctx.fillStyle=pool;ctx.fill();ctx.restore();
    ctx.save();ctx.beginPath();ctx.ellipse(poolX,poolY,spread*.99,25+fill*14,0,0,Math.PI*2);ctx.clip();
    for(let ring=0;ring<6;ring++){
      const age=(elapsed*.85+ring/6)%1,decay=pouring?1:Math.exp(-Math.max(0,elapsed-3.15)*5);
      ctx.globalAlpha=(1-age)*.35*decay*Math.min(1,fill*12);ctx.lineWidth=1.2;
      ctx.beginPath();ctx.ellipse(tip.x,poolY,8+age*140,2+age*31,0,0,Math.PI*2);ctx.strokeStyle='#fffdf6';ctx.stroke();
      ctx.beginPath();ctx.ellipse(tip.x,poolY+2,8+age*140,2+age*31,0,0,Math.PI*2);ctx.strokeStyle='#969d8a';ctx.stroke();
    }ctx.restore();
    const lx=54,ly=278,lw=312,lh=logo.height/logo.width*lw;
    ctx.globalAlpha=.13;ctx.filter=document.documentElement.dataset.theme==='dark'?'invert(1)':'none';ctx.drawImage(logo,lx,ly,lw,lh);ctx.filter='none';ctx.globalAlpha=1;
    m.clearRect(0,0,700,220);const level=220*(1-fill);m.beginPath();m.moveTo(0,220);m.lineTo(0,level);
    for(let i=0;i<surface.height.length;i++)m.lineTo(i/(surface.height.length-1)*700,level+surface.height[i]*15);
    m.lineTo(700,220);m.closePath();const paint=m.createLinearGradient(0,0,0,220);paint.addColorStop(0,'#496553');paint.addColorStop(.4,'#254a3d');paint.addColorStop(1,'#1c3c32');m.fillStyle=paint;m.fill();
    m.globalCompositeOperation='destination-in';m.drawImage(logo,0,0,700,220);m.globalCompositeOperation='source-over';ctx.drawImage(mask,lx,ly,lw,lh);
    if(pouring){
      const endY=poolY-5,steps=55,taper=Math.min(1,(elapsed-.45)*5,Math.max(0,(3.15-elapsed)*6));
      ctx.beginPath();
      for(let side=0;side<2;side++)for(let j=0;j<=steps;j++){
        const progress=side?1-j/steps:j/steps,y=tip.y+(endY-tip.y)*progress;
        const x=tip.x+Math.sin(progress*4+elapsed*5)*progress*2;
        const radius=(8/Math.sqrt(1+progress*2))*(1+.07*Math.sin(elapsed*10-progress*16))*taper;
        if(!side&&!j)ctx.moveTo(x-radius,y);else ctx.lineTo(x+(side?radius:-radius),y);
      }
      ctx.closePath();const stream=ctx.createLinearGradient(tip.x-9,0,tip.x+9,0);stream.addColorStop(0,'#b4baa8');stream.addColorStop(.2,'#e2e3d4');stream.addColorStop(.48,'#fffef5');stream.addColorStop(.7,'#eee9d9');stream.addColorStop(1,'#c3c6b5');ctx.fillStyle=stream;ctx.fill();
      ctx.beginPath();ctx.ellipse(tip.x,endY+2,12,5,0,0,Math.PI*2);ctx.fillStyle='#f7f5e8';ctx.fill();
      // Rounded impact and heavy droplets give the paint a viscous appearance.
      ctx.beginPath();ctx.moveTo(tip.x-17,endY+3);ctx.bezierCurveTo(tip.x-14,endY-8,tip.x-9,endY+1,tip.x-5,endY-5);ctx.bezierCurveTo(tip.x+2,endY-9,tip.x+9,endY+2,tip.x+17,endY+3);ctx.strokeStyle='#fffdf1';ctx.lineWidth=2.5;ctx.stroke();
      for(let i=0;i<4;i++){const age=(elapsed*1.9+i*.26)%1,sign=i%2?1:-1;ctx.globalAlpha=(1-age)*.7;ctx.beginPath();ctx.ellipse(tip.x+sign*age*(13+i*3),endY-16*age+20*age*age,1.4,2,sign*age,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    }
    onProgress?.(fill);loader.dataset.fill=String(Math.round(fill*100));
    if(elapsed>4.05){stop();finish?.();}else frame=requestAnimationFrame(render);
  }
  return {play(done){stop();surface.reset();finish=done;start=previous=performance.now();running=true;frame=requestAnimationFrame(render);},stop};
}
