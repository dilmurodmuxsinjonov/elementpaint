// Decorative pigment mixing; never required for navigation or product content.
const canvas = document.getElementById("paintBackground");
const hero = document.getElementById("home");
const motion = matchMedia("(prefers-reduced-motion: reduce)");
let renderer, scene, camera, material, geometry, frame = 0;
let visible = true, failed = false, last = 0, time = 0;
const mobile = matchMedia("(max-width: 640px)");
function stop() { cancelAnimationFrame(frame); frame = 0; }
function allowed() { return visible && !failed && !document.hidden && !motion.matches; }
function draw(now) {
  if (!allowed()) { stop(); return; }
  frame = requestAnimationFrame(draw);
  const interval = mobile.matches ? 1000 / 18 : 1000 / 24;
  if (now - last < interval) return;
  time += Math.min((now - last) / 1000, .1);
  last = now;
  material.uniforms.uTime.value = time;
  material.uniforms.uDark.value = document.documentElement.dataset.theme === "dark" ? 1 : 0;
  renderer.render(scene, camera);
}
function sync() {
  if (failed) { stop(); canvas.hidden = true; canvas.dataset.state = "fallback"; return; }
  if (motion.matches) { stop(); canvas.hidden = true; canvas.dataset.state = "reduced-motion"; }
  else if (renderer) {
    canvas.hidden = false;
    canvas.dataset.state = "ready";
    if (allowed() && !frame) { last = performance.now(); frame = requestAnimationFrame(draw); }
    if (!allowed()) stop();
  }
}
async function init() {
  if (renderer) { sync(); return; }
  if (motion.matches) { sync(); return; }
  try {
    const context = canvas.getContext("webgl2", { alpha: true, antialias: false, powerPreference: "low-power" });
    if (!context) throw new Error("WebGL unavailable");
    const THREE = await import("./vendor/three.module.js");
    renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile.matches ? 1 : 1.5));
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    scene = new THREE.Scene();
    geometry = new THREE.PlaneGeometry(2, 2);
    material = new THREE.ShaderMaterial({
      transparent: true, depthTest: false, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uAspect: { value: 1 }, uDark: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
      fragmentShader: `
        varying vec2 vUv; uniform float uTime; uniform float uAspect; uniform float uDark;
        void main(){
          vec2 p=vUv; float t=uTime*.12;
          // Long, soft brush passes and a slowly stirred pool of pigment.
          float wave=sin(p.x*7.+t)*.05+sin(p.x*13.-t*.7)*.017;
          float brush=1.-smoothstep(.025,.14,abs(p.y-.18-wave));
          float grain=.86+.14*sin(p.y*240.+sin(p.x*15.)*2.);
          vec2 q=(p-vec2(.92,.72))*vec2(uAspect,1.);
          float swirl=sin(atan(q.y,q.x)*3.+length(q)*14.-t)*.026;
          float pool=1.-smoothstep(.13,.48,length(q)+swirl);
          vec3 teal=vec3(.20,.49,.49), clay=vec3(.77,.43,.32), honey=vec3(.82,.67,.36);
          vec3 pigment=mix(teal,clay,.5+.5*sin(p.x*5.+t*.5));
          pigment=mix(pigment,honey,pool*.55);
          float alpha=(brush*.10*grain+pool*.12)*(1.+uDark*.45);
          gl_FragColor=vec4(pigment,alpha);
        }`,
    });
    scene.add(new THREE.Mesh(geometry, material));
    function resize() {
      renderer.setSize(hero.clientWidth, hero.clientHeight, false);
      material.uniforms.uAspect.value = hero.clientWidth / hero.clientHeight;
    }
    const sizes = new ResizeObserver(resize);
    sizes.observe(hero); resize();
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    visibility.observe(hero);
    canvas.addEventListener("webglcontextlost", event => {
      event.preventDefault(); stop(); canvas.hidden = true; canvas.dataset.state = "fallback";
      failed = true;
    });
    canvas.addEventListener("webglcontextrestored", () => { failed = false; resize(); sync(); });
    window.addEventListener("pagehide", event => {
      stop();
      if (!event.persisted) { sizes.disconnect(); visibility.disconnect(); geometry.dispose(); material.dispose(); renderer.dispose(); }
    });
    window.addEventListener("pageshow", sync);
    canvas.dataset.engine = `three-${THREE.REVISION}`;
    sync();
  } catch {
    failed = true;
    stop(); canvas.hidden = true; canvas.dataset.state = "fallback";
  }
}
document.addEventListener("visibilitychange", sync);
motion.addEventListener("change", () => motion.matches ? sync() : init());
canvas.dataset.state = "loading";
init();
