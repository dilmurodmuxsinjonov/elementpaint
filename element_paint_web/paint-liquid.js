// The stream disturbs a damped, viscous height field.
export function createLiquidSurface(count=96){
  const height=new Float64Array(count),velocity=new Float64Array(count),acceleration=new Float64Array(count);
  return {height,advance(seconds,impact=0){
    const duration=Math.max(0,Math.min(seconds,1/20)),steps=Math.ceil(duration*240);
    if(!steps)return;
    const dt=duration/steps,center=Math.round(count*.67);
    for(let step=0;step<steps;step++){
      for(let i=0;i<count;i++){const left=height[Math.max(0,i-1)],right=height[Math.min(count-1,i+1)];acceleration[i]=1500*(left+right-2*height[i])-22*height[i]-8*velocity[i]+impact*Math.exp(-(((i-center)/3)**2));}
      for(let i=0;i<count;i++){velocity[i]+=acceleration[i]*dt;height[i]+=velocity[i]*dt;}
    }
  },reset(){height.fill(0);velocity.fill(0);}};
}
