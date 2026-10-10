// Use the original logo's alpha channel, including letter counters and the crest.
export function createLogoPaint(logo) {
  const alpha=document.createElement('canvas');
  alpha.width=logo.width*2;alpha.height=logo.height*2;
  const a=alpha.getContext('2d',{willReadFrequently:true});
  if(!a)return null;
  a.drawImage(logo,0,0,alpha.width,alpha.height);
  const pixels=a.getImageData(0,0,alpha.width,alpha.height).data;
  let top=alpha.height,bottom=0;
  for(let y=0;y<alpha.height;y++)for(let x=0;x<alpha.width;x++){
    if(pixels[(y*alpha.width+x)*4+3]>16){top=Math.min(top,y);bottom=Math.max(bottom,y+1);}
  }
  const entryX=Math.round(alpha.width*.67);
  let entryY=top;
  while(entryY<bottom&&pixels[(entryY*alpha.width+entryX)*4+3]<220)entryY++;
  if(entryY===bottom)return null;
  const canvas=document.createElement('canvas');canvas.width=alpha.width;canvas.height=alpha.height;
  const ctx=canvas.getContext('2d');if(!ctx)return null;
  const scale=alpha.width/312;
  return {canvas,entry:{x:entryX/alpha.width,y:entryY/alpha.height},draw({fill,time,height,pouring}){
    const amount=Math.max(0,Math.min(1,fill)),level=bottom-(bottom-top+2)*amount;
    const envelope=Math.min(1,amount*8,(1-amount)*10),points=height.length;
    const wave=i=>level+(height[i]*5+Math.sin(i/(points-1)*Math.PI*5-time*3)*2.1)*scale*envelope;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(!amount)return canvas;
    ctx.beginPath();ctx.moveTo(0,canvas.height);
    for(let i=0;i<points;i++)ctx.lineTo(i/(points-1)*canvas.width,wave(i));
    ctx.lineTo(canvas.width,canvas.height);ctx.closePath();
    const paint=ctx.createLinearGradient(0,top,0,bottom);
    paint.addColorStop(0,'#fffefa');paint.addColorStop(.48,'#f8f6ed');paint.addColorStop(1,'#d6d8cb');
    ctx.fillStyle=paint;ctx.fill();
    // The meniscus, surface reflections and impact rings share the same clip.
    ctx.beginPath();
    for(let i=0;i<points;i++){const x=i/(points-1)*canvas.width,y=wave(i)+scale; if(!i)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    ctx.strokeStyle='#ffffffd9';ctx.lineWidth=1.5*scale*envelope;ctx.stroke();
    const impactY=wave(Math.round((points-1)*.67))+3*scale;
    if(pouring){
      const stream=ctx.createLinearGradient(entryX-7*scale,0,entryX+7*scale,0);
      stream.addColorStop(0,'#b9c3b2');stream.addColorStop(.23,'#edeedf');stream.addColorStop(.5,'#fffefa');stream.addColorStop(1,'#d6d8cb');
      ctx.strokeStyle=stream;ctx.lineWidth=8*scale;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(entryX,entryY);ctx.lineTo(entryX,Math.max(entryY,impactY));ctx.stroke();
    }
    const decay=pouring?1:Math.exp(-Math.max(0,time-3.35)*7);
    for(let ring=0;ring<4;ring++){
      const age=(time*1.1+ring/4)%1;
      ctx.globalAlpha=(1-age)*.45*envelope*decay;
      ctx.beginPath();ctx.ellipse(entryX,impactY+age*5*scale,(5+age*65)*scale,(1+age*7)*scale,0,0,Math.PI*2);
      ctx.strokeStyle=ring%2?'#9ba997':'#fffefa';ctx.lineWidth=scale;ctx.stroke();
    }
    ctx.globalAlpha=1;
    ctx.globalCompositeOperation='destination-in';ctx.drawImage(alpha,0,0);
    ctx.globalCompositeOperation='source-over';
    return canvas;
  }};
}
