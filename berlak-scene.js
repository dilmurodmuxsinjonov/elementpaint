import * as THREE from './vendor/three.module.js';
import {createPaintState,advancePaint,streamRadius} from './paint-physics.js';

export async function createCanScene(initial={}) {
  const $=id=>document.getElementById(id),canvas=$('paintCanCanvas'),stage=$('sceneStage'),fallback=$('sceneFallback');
  const controls=$('sceneControls'),lidButton=$('lidButton'),pourButton=$('pourButton'),resetButton=$('resetButton'),status=$('canState');
  let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{stage.dataset.state='fallback';return null;}
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  const settings={quality:'auto',autoRotate:false,motion:'full',flowSpeed:1,...initial},state=createPaintState(),motion=matchMedia('(prefers-reduced-motion:reduce)');
  let lang,turn=0,drag=null,visible=false,failed=false,frame=0,last=0,lastDraw=0,dirty=true;
  const reduced=()=>motion.matches||settings.motion!=='full';
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(37,1,.1,40);camera.position.set(0,1.65,7.1);camera.lookAt(0,.25,0);
  scene.add(new THREE.HemisphereLight(0xfffaf0,0x50645b,2.1));
  const key=new THREE.DirectionalLight(0xfff7e8,3.8);key.position.set(-3,5,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-3,right:3,top:4,bottom:-3});key.shadow.normalBias=.025;scene.add(key);
  const rimLight=new THREE.DirectionalLight(0xb6d8f5,2.1);rimLight.position.set(3,2,-3);scene.add(rimLight);
  // Locally generated softbox environment gives metal real studio reflections.
  const room=new THREE.Scene();room.add(new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshBasicMaterial({color:0x77736c,side:THREE.BackSide})));
  for(const [x,y,z,sx,sy,sz] of [[-3,2,2,.1,5,3],[3,2,-1,.1,3,4],[0,4,0,4,.1,4]]){const box=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),new THREE.MeshBasicMaterial({color:0xffffff}));box.position.set(x,y,z);room.add(box);}
  const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;pmrem.dispose();room.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
  const metal=new THREE.MeshPhysicalMaterial({color:0xbec6cb,metalness:1,roughness:.23,clearcoat:.6,clearcoatRoughness:.16,envMapIntensity:1.3});
  const innerMetal=new THREE.MeshStandardMaterial({color:0x858f96,metalness:.95,roughness:.35,side:THREE.DoubleSide});
  const paint=new THREE.MeshPhysicalMaterial({color:0xf7f3e7,roughness:.16,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.2});
  let labelImage;try{labelImage=await new THREE.TextureLoader().loadAsync('assets/berlak_blue_label.jpg');}catch{renderer.dispose();return null;}
  const textureCanvas=document.createElement('canvas');textureCanvas.width=4096;textureCanvas.height=1536;const tc=textureCanvas.getContext('2d');tc.fillStyle='#073976';tc.fillRect(0,0,4096,1536);for(const x of [0,2048])tc.drawImage(labelImage.image,x,0,2048,1536);labelImage.dispose();
  const labelTexture=new THREE.CanvasTexture(textureCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;labelTexture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  const labelMaterial=new THREE.MeshPhysicalMaterial({map:labelTexture,roughness:.32,metalness:.1,clearcoat:.6,clearcoatRoughness:.25});
  const can=new THREE.Group(),bodyGroup=new THREE.Group();can.add(bodyGroup);scene.add(can);
  const profile=[[.74,-1.02],[.79,-1],[.81,-.96],[.805,-.89],[.805,.89],[.82,.97],[.79,1.01]].map(([r,y])=>new THREE.Vector2(r,y));const body=new THREE.Mesh(new THREE.LatheGeometry(profile,96),metal);body.castShadow=true;bodyGroup.add(body);
  const label=new THREE.Mesh(new THREE.CylinderGeometry(.809,.809,1.77,96,1,true),labelMaterial);label.rotation.y=-Math.PI/2;label.castShadow=true;bodyGroup.add(label);bodyGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(.764,.75,1.95,96,1,true),innerMetal));
  function disc(radius,material,y,parent=bodyGroup){const mesh=new THREE.Mesh(new THREE.CircleGeometry(radius,80),material);mesh.rotation.x=-Math.PI/2;mesh.position.y=y;parent.add(mesh);return mesh;}
  disc(.76,innerMetal,-.97);
  function ring(radius,width,y,parent=bodyGroup,material=metal){const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,width,12,96),material);mesh.rotation.x=Math.PI/2;mesh.position.y=y;parent.add(mesh);return mesh;}
  for(const [r,w,y] of [[.80,.031,1.005],[.77,.018,.972],[.80,.027,-1.015],[.765,.014,-.984]])ring(r,w,y);
  const lid=new THREE.Group();bodyGroup.add(lid);const lidProfile=[[0,-.013],[.67,-.013],[.72,.012],[.78,.015],[.815,.048],[.835,.03],[.835,-.02],[.79,-.032]].map(([r,y])=>new THREE.Vector2(r,y));const lidBody=new THREE.Mesh(new THREE.LatheGeometry(lidProfile,96),metal);lidBody.castShadow=true;lid.add(lidBody);disc(.79,innerMetal,-.028,lid).rotation.x=Math.PI/2;disc(.68,paint,-.036,lid).rotation.x=Math.PI/2;for(const r of [.70,.76,.817])ring(r,.009,.032,lid);
  function liquidDisc(radius){
    const radial=18,angular=80,vertices=[],indices=[];
    for(let j=0;j<=radial;j++)for(let i=0;i<=angular;i++){const a=i/angular*Math.PI*2,r=radius*j/radial;vertices.push(Math.cos(a)*r,0,Math.sin(a)*r);}
    for(let j=0;j<radial;j++)for(let i=0;i<angular;i++){const a=j*(angular+1)+i,b=a+angular+1;indices.push(a,a+1,b,b,a+1,b+1);}
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3).setUsage(THREE.DynamicDrawUsage));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
  }
  const liquidGeometry=liquidDisc(.754);const liquidBase=Float32Array.from(liquidGeometry.attributes.position.array),liquid=new THREE.Mesh(liquidGeometry,paint);bodyGroup.add(liquid);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.ShadowMaterial({opacity:.16}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.15;floor.receiveShadow=true;scene.add(floor);
  const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(.97,1.02,.20,96),new THREE.MeshStandardMaterial({color:0xd7cbb4,roughness:.7,metalness:.05}));pedestal.position.set(-.50,-1.04,0);pedestal.receiveShadow=true;pedestal.castShadow=true;scene.add(pedestal);
  const tray=new THREE.Mesh(new THREE.CylinderGeometry(.78,.75,.075,96,1,true),new THREE.MeshPhysicalMaterial({color:0xd6e1d9,roughness:.14,metalness:.45,transparent:true,opacity:.58,side:THREE.DoubleSide}));tray.position.set(.83,-1.08,0);scene.add(tray);ring(.78,.012,-1.035,scene).position.x=.83;
  const poolGeometry=liquidDisc(.725);const poolBase=Float32Array.from(poolGeometry.attributes.position.array),pool=new THREE.Mesh(poolGeometry,paint);pool.position.set(.83,-1.11,0);pool.visible=false;scene.add(pool);
  // Reuse the same vertices throughout the pour, avoiding GPU allocation churn.
  const segments=42,sides=10,positions=new Float32Array((segments+1)*(sides+1)*3),indices=[];
  for(let j=0;j<segments;j++)for(let i=0;i<sides;i++){const a=j*(sides+1)+i,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1);}
  const streamGeometry=new THREE.BufferGeometry();streamGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));streamGeometry.setIndex(indices);const stream=new THREE.Mesh(streamGeometry,paint);stream.frustumCulled=false;stream.visible=false;scene.add(stream);
  const ripples=[];for(let i=0;i<4;i++){const material=paint.clone();material.transparent=true;material.opacity=.35;const mesh=new THREE.Mesh(new THREE.TorusGeometry(.1,.006,6,48),material);mesh.rotation.x=Math.PI/2;mesh.visible=false;scene.add(mesh);ripples.push(mesh);}
  const drops=[],dropGeometry=new THREE.SphereGeometry(.018,8,6);for(let i=0;i<16;i++){const mesh=new THREE.Mesh(dropGeometry,paint);mesh.visible=false;scene.add(mesh);drops.push(mesh);}
  const tip=new THREE.Vector3(),end=new THREE.Vector3();
  function updateFluid(){
    const height=.84-state.collected*1.76,lp=liquidGeometry.attributes.position;
    for(let i=0;i<lp.count;i++){const x=liquidBase[i*3],z=liquidBase[i*3+2],r=Math.hypot(x,z),wave=Math.sin(r*22-state.time*5)*.012*(1-r/.78);lp.setY(i,Math.max(-.965,Math.min(.962,height+(x*Math.cos(turn)+z*Math.sin(turn))*Math.tan(Math.min(state.tilt,1.43))+(reduced()?0:wave))));}lp.needsUpdate=true;liquidGeometry.computeVertexNormals();liquid.visible=state.remaining>.005;
    pool.visible=state.collected>0;pool.position.y=-1.105+state.collected*.065;pool.scale.setScalar(Math.min(1,.35+Math.sqrt(state.collected)*.65));const pp=poolGeometry.attributes.position;
    for(let i=0;i<pp.count;i++){const r=Math.hypot(poolBase[i*3],poolBase[i*3+2]);pp.setY(i,reduced()?0:Math.sin(r*35-state.time*10)*.012*state.ripple*(1-r/.75));}pp.needsUpdate=true;poolGeometry.computeVertexNormals();
    can.updateMatrixWorld(true);tip.set(.768,.976,0);can.localToWorld(tip);end.set(Math.min(1.3,Math.max(.28,tip.x+.18)),pool.position.y+.012,0);stream.visible=state.flow>0;
    if(stream.visible){const length=Math.max(.05,tip.y-end.y);for(let j=0;j<=segments;j++){const t=j/segments,cx=tip.x+(end.x-tip.x)*t+Math.sin(t*4+state.time*5)*.012*t,cy=tip.y-length*t,cz=Math.sin(t*6+state.time*4)*.01*t,r=streamRadius(t,state.time,Math.min(1,state.flow/.1));for(let i=0;i<=sides;i++){const a=i/sides*Math.PI*2,k=(j*(sides+1)+i)*3;positions[k]=cx+Math.cos(a)*r;positions[k+1]=cy;positions[k+2]=cz+Math.sin(a)*r;}}streamGeometry.attributes.position.needsUpdate=true;streamGeometry.computeVertexNormals();}
    ripples.forEach((mesh,i)=>{const age=(state.time*1.4+i/4)%1;mesh.visible=!reduced()&&state.ripple>0&&state.collected>0;mesh.position.copy(end);mesh.position.y+=.004;mesh.scale.setScalar(.3+age*2.8);mesh.material.opacity=(1-age)*.38*state.ripple;});
    drops.forEach((mesh,i)=>{const age=(state.time*2+i*.137)%1,a=i*2.399;mesh.visible=!reduced()&&state.flow>0;mesh.position.set(end.x+Math.cos(a)*age*.19,end.y+.24*age-.29*age*age,end.z+Math.sin(a)*age*.19);mesh.scale.set(.8,1.1+age,.8);});
    $('paintFill').style.setProperty('--fill',`${state.collected*100}%`);$('paintPercent').textContent=`${Math.round(state.collected*100)}%`;$('paintLevel').value=Math.round(state.remaining*100);
  }
  function refreshState(){if(!lang)return;lidButton.textContent=state.open?lang.close:lang.open;pourButton.textContent=state.pouring?lang.stop:lang.pour;resetButton.textContent=lang.reset;pourButton.disabled=!state.open||state.remaining===0;lidButton.disabled=state.pouring;const text=lang[state.remaining===0?'emptyCan':state.pouring?'pouring':state.open?'opened':'closed'];if(status.textContent!==text)status.textContent=text;stage.dataset.lid=state.open?'open':'closed';stage.dataset.pouring=String(state.pouring);stage.dataset.fill=String(Math.round(state.collected*100));}
  function fail(){failed=true;$('sceneUnavailable').hidden=false;$('sceneHint').hidden=true;document.querySelector('.paint-readout').hidden=true;cancelAnimationFrame(frame);frame=0;canvas.hidden=true;controls.hidden=true;fallback.hidden=false;stage.dataset.state='fallback';status.textContent=lang?.fallback||'Berlak PF-115';renderer.dispose();}
  function draw(now){frame=0;if(failed||!visible||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;advancePaint(state,dt,settings.flowSpeed,reduced());if(settings.autoRotate&&!reduced()&&!state.open&&!drag)turn+=dt*.18;
    const animated=state.pouring||Math.abs(state.tilt)>.002||Math.abs(state.lid-(state.open?1:0))>.002||state.ripple>0||(settings.autoRotate&&!reduced()&&!state.open);
    if(dirty||now-lastDraw>1000/(settings.quality==='eco'||reduced()?24:40)){const lift=Math.min(1,state.tilt/1.2);can.position.set(-.50,.09+lift*.76,0);can.rotation.z=-state.tilt;bodyGroup.rotation.y=turn;lid.position.set(-.28*state.lid,1.045+.48*state.lid,-.60*state.lid);lid.rotation.x=-.75*state.lid;lid.rotation.z=.20*state.lid;updateFluid();refreshState();renderer.render(scene,camera);lastDraw=now;dirty=false;}
    if(animated)frame=requestAnimationFrame(draw);
  }
  function refresh(){dirty=true;if(!frame&&!failed&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(draw);}}
  function size(){const {width,height}=stage.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.fov=camera.aspect<.85?47:37;camera.updateProjectionMatrix();refresh();}
  function configure(value={}){Object.assign(settings,value);renderer.setPixelRatio(Math.min(devicePixelRatio,settings.quality==='eco'?1:settings.quality==='high'?2:1.5));renderer.shadowMap.enabled=settings.quality!=='eco';size();refresh();}
  lidButton.addEventListener('click',()=>{state.open=!state.open;if(!state.open)state.pouring=false;refreshState();refresh();});pourButton.addEventListener('click',()=>{if(!state.open||state.remaining===0)return;state.pouring=!state.pouring;refreshState();refresh();});resetButton.addEventListener('click',()=>{Object.assign(state,createPaintState());turn=0;refreshState();refresh();});
  const raycaster=new THREE.Raycaster();canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,startX:e.clientX,startY:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!drag||state.pouring)return;turn+=(e.clientX-drag.x)*.008;drag.x=e.clientX;refresh();});canvas.addEventListener('pointerup',e=>{if(drag&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<6&&!state.pouring){const r=canvas.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);if(raycaster.intersectObject(lid,true)[0]){state.open=!state.open;refreshState();refresh();}}drag=null;});
  for(const event of ['pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{drag=null;});canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();turn+=e.key==='ArrowLeft'?-.15:.15;refresh();}});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)refresh();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'60px'}).observe(stage);new ResizeObserver(size).observe(stage);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else refresh();});motion.addEventListener('change',refresh);
  fallback.hidden=true;canvas.hidden=false;controls.hidden=false;stage.dataset.state='ready';configure();return {setLanguage(value){lang=value;refreshState();},refresh,configure};
}
