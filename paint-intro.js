const image=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});
export async function createPaintIntro({loader,canvas,onProgress}) {
  const [can,logo]=await Promise.all([image('assets/berlak_loader_can_v1.webp'),image('assets/logo_light.png')]);
  const ctx=canvas.getContext('2d');if(!ctx)return null;
  canvas.width=840;canvas.height=760;
  const mask=document.createElement('canvas');mask.width=700;mask.height=220;const m=mask.getContext('2d');
  let frame=0,start=0,running=false,finish;
  function stop(){running=false;cancelAnimationFrame(frame);frame=0;}
  function render(now){
    if(!running)return;
    const elapsed=(now-start)/1000,tip={x:263,y:105},fill=Math.min(1,Math.max(0,(elapsed-.48)/1.95));
    ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,420,380);
    const angle=(22+43*Math.sin(Math.min(1,elapsed/.6)*Math.PI/2))*Math.PI/180;
    ctx.save();ctx.translate(tip.x,tip.y);ctx.rotate(angle);ctx.shadowColor='#49331b24';ctx.shadowBlur=12;ctx.shadowOffsetY=8;ctx.drawImage(can,-.853*162,-.164*202,162,202);ctx.restore();
    const lx=50,ly=285,lw=320,lh=logo.height/logo.width*lw;
    ctx.globalAlpha=.16;ctx.filter=document.documentElement.dataset.theme==='dark'?'invert(1)':'none';ctx.drawImage(logo,lx,ly,lw,lh);ctx.filter='none';ctx.globalAlpha=1;
    m.clearRect(0,0,700,220);const surface=220*(1-fill);m.beginPath();m.moveTo(0,220);m.lineTo(0,surface);
    for(let x=0;x<=700;x+=4)m.lineTo(x,surface+Math.sin(x*.035-elapsed*7)*Math.sin(Math.PI*fill)*8+Math.sin(x*.017+elapsed*4)*3*(1-fill));
    m.lineTo(700,220);m.closePath();const gold=m.createLinearGradient(0,0,700,220);gold.addColorStop(0,'#b58b43');gold.addColorStop(.5,'#f0ce84');gold.addColorStop(1,'#a97b36');m.fillStyle=gold;m.fill();
    m.globalCompositeOperation='destination-in';m.drawImage(logo,0,0,700,220);m.globalCompositeOperation='source-over';ctx.drawImage(mask,lx,ly,lw,lh);
    if(elapsed>.4&&fill<1){
      const endY=ly+lh*(1-fill)+10,steps=44;ctx.beginPath();
      for(let side=0;side<2;side++)for(let j=0;j<=steps;j++){const t=side?1-j/steps:j/steps,y=tip.y+(endY-tip.y)*t,x=tip.x+Math.sin(t*4+elapsed*6)*t*3,r=(7.2/Math.sqrt(1+t*2))*(1+.12*Math.sin(elapsed*11-t*20));if(!side&&!j)ctx.moveTo(x-r,y);else ctx.lineTo(x+(side?r:-r),y);}
      ctx.closePath();const stream=ctx.createLinearGradient(tip.x-7,0,tip.x+7,0);stream.addColorStop(0,'#a77932');stream.addColorStop(.38,'#f6da9b');stream.addColorStop(.72,'#d0a554');stream.addColorStop(1,'#a77832');ctx.fillStyle=stream;ctx.fill();ctx.strokeStyle='#efd194';ctx.lineWidth=1.5;
      for(let i=0;i<3;i++){const age=(elapsed*2+i/3)%1;ctx.globalAlpha=(1-age)*.65;ctx.beginPath();ctx.ellipse(tip.x,endY+2,4+age*19,1+age*4,0,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;
      for(let i=0;i<10;i++){const age=(elapsed*2.1+i*.13)%1,x=tip.x+(i%2?1:-1)*age*(12+i*1.6),y=endY-28*age+40*age*age;ctx.globalAlpha=1-age;ctx.beginPath();ctx.ellipse(x,y,1.5,2.5,age,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    }
    onProgress?.(fill);loader.dataset.fill=String(Math.round(fill*100));
    if(elapsed>2.6){stop();finish?.();}else frame=requestAnimationFrame(render);
  }
  return {play(done){stop();finish=done;start=performance.now();running=true;frame=requestAnimationFrame(render);},stop};
}
