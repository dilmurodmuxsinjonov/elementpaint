export function createPaintState() {
  return {open:false,pouring:false,remaining:1,collected:0,tilt:0,lid:0,flow:0,time:0,ripple:0};
}
export function advancePaint(state,seconds,speed=1,reduced=false) {
  speed=Number.isFinite(speed)?speed:1;
  const dt=Math.max(0,Math.min(Number(seconds)||0,.05));state.time+=dt;
  const target=state.pouring&&state.open&&state.remaining>0?1.38+state.collected*.55:0;
  const easing=reduced?1:1-Math.exp(-dt*5.5);
  state.tilt+=(target-state.tilt)*easing;state.lid+=((state.open?1:0)-state.lid)*easing;
  const height=.84-state.collected*1.76,head=height+.76*Math.tan(Math.min(state.tilt,1.45))-.98;
  state.flow=state.pouring&&state.open&&state.remaining>0&&head>0?Math.min(.19,.075+Math.sqrt(head)*.045)*Math.max(.5,Math.min(1.5,speed)):0;
  const moved=Math.min(state.remaining,state.flow*dt);
  state.remaining=Math.max(0,state.remaining-moved);state.collected=1-state.remaining;
  state.ripple=state.flow>0?1:Math.max(0,state.ripple-dt*.65);
  if(state.remaining<=1e-6){state.remaining=0;state.collected=1;state.pouring=false;state.flow=0;}
  return state;
}
export function streamRadius(progress,time,flow=1) {
  return (.063/Math.sqrt(1+progress*2.6))*(1+.075*Math.sin(time*9-progress*18))*Math.min(1,flow);
}
