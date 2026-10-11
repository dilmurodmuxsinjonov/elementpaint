"""Preserve the user-supplied SVG and adapt its animation to the preview lifecycle."""
from pathlib import Path
import re

repo=Path(__file__).resolve().parent.parent
source=repo/'docs/reference/loader.html'
web=repo/'element_paint_web'
text = source.read_text(encoding='utf-8-sig')
css = re.search(r'<style>(.*?)</style>', text, re.S).group(1)
css = css.replace('  html, body { margin: 0; height: 100%; }\n', '')
css += '\n/* Preview integration: preserve the supplied scene and curtain exit. */\n.ep-loader[hidden]{display:none}\n.ep-loader::before{content:none}\n.ep-loader{pointer-events:auto}\n.ep-loader .intro-artwork{display:contents}\n.ep-loader .ep-scene{width:min(92vw,820px,170dvh)}\n.ep-loader .intro-skip{z-index:1}\n.ep-loader[data-theme="dark"] .intro-skip{color:#f2f0eb;background:#25242b99;border-color:#f2f0eb33}\n'
fragment = re.search(r'<div class="ep-loader"[^>]*>(.*?)\n</div>\s*<script>', text, re.S).group(1)
script = re.search(r'<script>(.*?)</script>', text, re.S).group(1).strip()
script = script.replace("(function () {\n  var root = document.getElementById('ep-loader');\n  if (!root) return;", "export function startSuppliedLoader(root,onFinish){\n  let active=true,raf=0,exitTimer=0;\n  function finishExit(){if(!active)return;stop();onFinish?.();}\n  function stop(){active=false;cancelAnimationFrame(raf);clearTimeout(exitTimer);root.removeEventListener('transitionend',exitTransition);}\n  function exitTransition(e){if(e.target===root&&e.propertyName==='transform')finishExit();}")
script = script.replace("  var search = location.search;\n  if (/[?&]dark\\b/.test(search)) root.setAttribute('data-theme', 'dark');\n  var LOOP = root.hasAttribute('data-loop') && !/[?&]exit\\b/.test(search);", "  var LOOP = false;")
script = script.replace('manual = null, loaded = false', 'manual = 0, loaded = false')
script = script.replace("  if (document.readyState === 'complete') loaded = true;\n  else window.addEventListener('load', function () { loaded = true; });", '')
start = script.index('  function leave() {')
end = script.index('\n  function frame(ts)', start)
script = script[:start] + '''  function leave() {
    root.classList.add('is-leaving');root.dataset.phase='leaving';
    root.addEventListener('transitionend',exitTransition);
    exitTimer=setTimeout(finishExit,1300);
  }
''' + script[end:]
script = script.replace('    if (!root.isConnected) return;', '    if (!active || !root.isConnected) return;')
script = script.replace('var dt = Math.min(.05, (ts - last) / 1000);', 'var elapsedDt = Math.max(0,(ts-last)/1000);\n    var dt = Math.min(.05,elapsedDt);')
script = script.replace('Math.exp(-dt * 5)', 'Math.exp(-Math.min(1,elapsedDt) * 5)')
script = script.replace("    var pct = Math.round(p * 100);", "    root.dataset.fill=String(Math.round(p*100));\n    if(!root.classList.contains('is-leaving'))root.dataset.phase=paintDone?'filled':phase;\n    var pct = Math.round(p * 100);")
script = script.replace('requestAnimationFrame(frame);', 'raf=requestAnimationFrame(frame);')
start = script.index('  window.EPLoader = {')
script = script[:start] + '''  return {stop,progress(v){if(Number.isFinite(v))manual=Math.max(manual,clamp(v,0,1));},done(){manual=1;}};
}
'''
for name, content in [('supplied-loader.css',css),('supplied-loader.html',fragment),('supplied-loader.js',script)]:
    (web/name).write_text(content,encoding='utf-8')
print('Imported original SVG paths, paint geometry, colours and curtain exit; lifecycle is scoped to the preview.')
