import * as THREE from './vendor/three.module.js';

// Local 3D geometry with a generated packaging texture for preview.
// The canvas label is a fallback if the texture cannot load.
function draftLabel() {
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;
  const c=canvas.getContext('2d');const gradient=c.createLinearGradient(0,0,2048,1024);gradient.addColorStop(0,'#092a52');gradient.addColorStop(.45,'#125394');gradient.addColorStop(1,'#031b3a');c.fillStyle=gradient;c.fillRect(0,0,2048,1024);
  for(let k=0;k<18;k++){c.strokeStyle=`rgba(60,160,230,${.04+k*.006})`;c.lineWidth=9;c.beginPath();c.moveTo(0,850-k*15);c.bezierCurveTo(640,100+k*13,1100,1300-k*40,2048,190+k*16);c.stroke();}
  for(const x of [512,1536]){c.textAlign='center';c.fillStyle='#d7bd79';c.font='bold 125px Georgia';c.fillText('Berlak',x,220);c.font='22px sans-serif';c.fillText('FUTURISTIC PAINT',x,268);c.fillStyle='#f4efdc';c.font='bold 35px sans-serif';c.fillText('ВЫСОКОГЛЯНЦЕВАЯ',x,530);c.font='bold 115px sans-serif';c.fillText('ЭМАЛЬ',x,654);c.font='bold 107px sans-serif';c.fillText('PF 115',x,790);c.font='25px sans-serif';c.fillText('SNOW WHITE  /  QORDEK OQ',x,838);c.font='32px sans-serif';c.fillText('American Technology',x,934);}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}
export async function createCanScene() {
  const canvas=document.getElementById('paintCanCanvas'), stage=document.getElementById('sceneStage'), fallback=document.getElementById('sceneFallback');
  const controls=document.getElementById('sceneControls'), lidButton=document.getElementById('lidButton'), pourButton=document.getElementById('pourButton'), resetButton=document.getElementById('resetButton'), status=document.getElementById('canState');
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(max-width:760px)').matches?1.25:1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,60);camera.position.set(3.3,2.25,4.9);camera.lookAt(0,.12,0);
  scene.add(new THREE.HemisphereLight(0xfff7e6,0x59615a,3));const light=new THREE.DirectionalLight(0xffffff,4.5);light.position.set(-3,6,4);scene.add(light);const rim=new THREE.DirectionalLight(0xc3dcff,2.7);rim.position.set(4,3,-4);scene.add(rim);
  const tiltGroup=new THREE.Group();scene.add(tiltGroup);const can=new THREE.Group();can.scale.setScalar(1.1);tiltGroup.add(can);const bodyGroup=new THREE.Group();can.add(bodyGroup);
  const viewAngle=Math.atan2(camera.position.x,camera.position.z);const tiltAxis=new THREE.Vector3(Math.sin(viewAngle),0,Math.cos(viewAngle));
  const metal=new THREE.MeshStandardMaterial({color:0xc0c4c4,metalness:.8,roughness:.27});const insideMaterial=new THREE.MeshStandardMaterial({color:0xaab2b2,metalness:.7,roughness:.45,side:THREE.BackSide});
  let labelTexture;try{labelTexture=await new THREE.TextureLoader().loadAsync('assets/berlak_blue_label.jpg');labelTexture.colorSpace=THREE.SRGBColorSpace;labelTexture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());}catch{labelTexture=draftLabel();}
  const label=new THREE.MeshStandardMaterial({map:labelTexture,metalness:.12,roughness:.42});const paint=new THREE.MeshStandardMaterial({color:0xfff3db,roughness:.19,metalness:.04});
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.83,.79,2.04,96,1,true),label);bodyGroup.add(body);
  const inner=new THREE.Mesh(new THREE.CylinderGeometry(.80,.76,1.97,96,1,true),insideMaterial);bodyGroup.add(inner);
  function circle(radius,y,material){const mesh=new THREE.Mesh(new THREE.CircleGeometry(radius,96),material);mesh.rotation.x=-Math.PI/2;mesh.position.y=y;return mesh;}
  const bottom=circle(.79,-1.02,metal);bodyGroup.add(bottom);bottom.material=metal.clone();bottom.material.side=THREE.DoubleSide;
  function ring(radius,y){const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,.035,12,96),metal);mesh.rotation.x=Math.PI/2;mesh.position.y=y;bodyGroup.add(mesh);return mesh;}
  ring(.82,1.02);ring(.80,-1.02);ring(.82,.98);ring(.80,-.98);
  const lid=new THREE.Group();lid.position.y=1.055;bodyGroup.add(lid);const lidDisc=new THREE.Mesh(new THREE.CylinderGeometry(.837,.837,.048,96),metal);lid.add(lidDisc);
  for(const r of [.80,.73]){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.013,8,96),metal);ring.rotation.x=Math.PI/2;ring.position.y=.028;lid.add(ring);}
  const liquid=circle(.765,.87,paint);bodyGroup.add(liquid);
  const floor=circle(3,-1.17,new THREE.MeshBasicMaterial({color:0xeadcc4,transparent:true,opacity:.26}));scene.add(floor);
  const shadow=circle(.93,-1.155,new THREE.MeshBasicMaterial({color:0x66563b,transparent:true,opacity:.10}));shadow.scale.set(1.35,.85,1);scene.add(shadow);
  const puddle=circle(.4,-1.145,paint);puddle.visible=false;scene.add(puddle);
  let stream;let lang,opened=false,pouring=false,turn=-2.55,lidAmount=0,tilt=0,amount=0,visible=true,failed=false,frame=0,last=0,dirty=true,drag=null;
  const motion=matchMedia('(prefers-reduced-motion:reduce)');
  function refreshState(){if(!lang)return;lidButton.textContent=opened?lang.close:lang.open;pourButton.textContent=pouring?lang.stop:lang.pour;resetButton.textContent=lang.reset;pourButton.disabled=!opened||amount>=1;status.textContent=amount>=1?lang.emptyCan:pouring?lang.pouring:opened?lang.opened:lang.closed;stage.dataset.lid=opened?'open':'closed';stage.dataset.pouring=String(pouring);}
  function fail(){failed=true;cancelAnimationFrame(frame);frame=0;canvas.hidden=true;controls.hidden=true;fallback.hidden=false;stage.dataset.state='fallback';status.textContent=lang?.fallback||'Berlak PF-115';}
  function updateStream(){
    if(stream){scene.remove(stream);stream.geometry.dispose();stream=null;}
    if(!pouring||tilt<.28)return;
    tiltGroup.updateMatrixWorld(true);const start=new THREE.Vector3(-.79*Math.cos(viewAngle-turn),.97,.79*Math.sin(viewAngle-turn));bodyGroup.localToWorld(start);const end=new THREE.Vector3(start.x-.25*Math.cos(viewAngle),-1.13,start.z+.25*Math.sin(viewAngle));
    const curve=new THREE.CubicBezierCurve3(start,new THREE.Vector3(start.x-.06,start.y-.2,start.z),new THREE.Vector3(end.x,-.6,end.z),end);
    stream=new THREE.Mesh(new THREE.TubeGeometry(curve,20,.04,8,false),paint);scene.add(stream);puddle.position.set(end.x,-1.145,end.z);puddle.visible=true;puddle.scale.set(1+amount*1.2,.65+amount*.65,1);
  }
  function render(now){
    frame=0;if(failed||!visible||document.hidden)return;
    const dt=Math.min((now-last)/1000,.05);last=now;
    const targetLid=opened?1:0,targetTilt=pouring?.98:0;
    const moving=Math.abs(lidAmount-targetLid)>.002||Math.abs(tilt-targetTilt)>.002||pouring;
    if(moving||dirty){const rate=motion.matches?1:Math.min(dt*7,1);lidAmount+=(targetLid-lidAmount)*rate;tilt+=(targetTilt-tilt)*rate;
      can.rotation.y=turn;tiltGroup.quaternion.setFromAxisAngle(tiltAxis,tilt);lid.position.set(-.7*lidAmount,1.055+.35*lidAmount,-.65*lidAmount);lid.rotation.x=-.9*lidAmount;
      camera.fov=32+lidAmount*(camera.aspect<1?20:12);camera.lookAt(0,.12+.30*lidAmount,0);camera.updateProjectionMatrix();
      liquid.rotation.z=-tilt*.42;liquid.position.y=.87-amount*1.72;if(pouring)amount=Math.min(1,amount+dt*.11);if(amount>=1&&pouring){pouring=false;refreshState();}updateStream();renderer.render(scene,camera);dirty=false;}
    if(moving)frame=requestAnimationFrame(render);
  }
  function refresh(){dirty=true;if(!frame&&!failed&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(render);}}
  function size(){const {width,height}=stage.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();refresh();}
  lidButton.addEventListener('click',()=>{opened=!opened;if(!opened)pouring=false;refreshState();refresh();});
  pourButton.addEventListener('click',()=>{if(!opened)return;pouring=!pouring;refreshState();refresh();});
  resetButton.addEventListener('click',()=>{opened=false;pouring=false;turn=-2.55;amount=0;liquid.position.y=.87;puddle.visible=false;refreshState();refresh();});
  const raycaster=new THREE.Raycaster();
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,id:e.pointerId};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;turn+=(e.clientX-drag.x)*.012;if(opened&&amount<1&&e.pointerType!=='touch'&&Math.abs(e.clientY-drag.y)>10)pouring=e.clientY>drag.y;drag.x=e.clientX;drag.y=e.clientY;refreshState();refresh();});
  canvas.addEventListener('pointerup',e=>{if(drag&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<6){const r=canvas.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=raycaster.intersectObject(bodyGroup,true)[0];if(hit?.object.parent===lid){opened=!opened;pouring=false;refreshState();refresh();}}drag=null;});
  for(const event of ['pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{drag=null;});
  canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();turn+=e.key==='ArrowLeft'?-.18:.18;refresh();}});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)refresh();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'80px'});observer.observe(stage);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else refresh();});new ResizeObserver(size).observe(stage);motion.addEventListener('change',refresh);
  fallback.hidden=true;canvas.hidden=false;controls.hidden=false;stage.dataset.state='ready';stage.dataset.label='generated-preview';size();refreshState();
  return {setLanguage(value){lang=value;refreshState();},refresh};
}
