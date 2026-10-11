"""Preserve the user-supplied SVG and adapt its animation to the preview lifecycle."""
from pathlib import Path
import re

repo=Path(__file__).resolve().parent.parent
source=repo/'docs/reference/loader-uzlashgan.html'
web=repo/'element_paint_web'
text = source.read_text(encoding='utf-8-sig')
css = re.search(r'<style>(.*?)</style>', text, re.S).group(1)
css = css.replace('  html, body { margin: 0; height: 100%; }\n', '')
css = css.replace('  html.ep-loading { overflow: hidden; }\n', '')
start = css.index('  .ep-brand{')
end = css.index('  @keyframes ep-draw', start)
css = css[:start] + '''  @media(max-width:600px){.ep-scene{width:min(96vw,160svh);top:38%}}
  @media(max-height:620px){.ep-scene{top:40%;width:min(76vw,138svh)}}

''' + css[end:]
css += '\n/* Preview integration: preserve the supplied scene and curtain exit. */\n.ep-loader[hidden]{display:none}\n.ep-loader::before{content:none}\n.ep-loader{pointer-events:auto}\n.ep-loader .intro-artwork{display:contents}\n.ep-loader .intro-skip{z-index:3}\n.ep-loader[data-theme="dark"]{background:radial-gradient(120% 95% at 50% 42%,#24232a 38%,var(--ep-bg) 76%,var(--ep-bg-edge) 100%)}\n.ep-loader[data-theme="dark"] .intro-skip{color:#f2f0eb;background:#25242b99;border-color:#f2f0eb33}\n'
fragment = re.search(r'<div class="ep-loader"[^>]*>(.*?)\n</div>\s*<div class="ep-done-screen"', text, re.S).group(1)
# Standalone demo controls and its completion page are replaced by the site's
# existing skip button and settings replay. The user requested artwork only.
fragment = re.sub(r'  <header class="ep-brand">.*?</header>\n', '', fragment)
fragment = re.sub(r'  <div class="ep-caption"[^>]*>.*?</div>\n', '', fragment)
fragment = re.sub(r'  <footer class="ep-controls">.*?</footer>\s*', '', fragment, flags=re.S)
script = re.search(r'<script>(.*?)</script>', text, re.S).group(1).strip()
script = script.replace("(function () {\n  var root = document.getElementById('ep-loader');\n  if (!root) return;", "export function startSuppliedLoader(root,onFinish){\n  let active=true,raf=0,exitTimer=0;\n  function finishExit(){if(!active)return;stop();onFinish?.();}\n  function stop(){active=false;cancelAnimationFrame(raf);clearTimeout(exitTimer);root.removeEventListener('transitionend',exitTransition);}\n  function exitTransition(e){if(e.target===root&&e.propertyName==='transform')finishExit();}")
start = script.index('  var search = location.search;')
end = script.index('  var REDUCE =', start)
script = script[:start] + "  var LOOP = false;\n" + script[end:]
script = script.replace('manual = null, loaded = false', 'manual = 0, loaded = false')
start = script.index('  var productReady=false;')
end = script.index('  function go(s)', start)
script = script[:start] + script[end:]
script = script.replace('(loaded && productReady && pt > MIN_POUR)', '(loaded && pt > MIN_POUR)')
start = script.index('  function leave() {')
end = script.index('\n  function frame(ts)', start)
script = script[:start] + '''  function leave() {
    root.classList.add('is-leaving');root.dataset.phase='leaving';
    root.addEventListener('transitionend',exitTransition);
    exitTimer=setTimeout(finishExit,1300);
  }
''' + script[end:]
script = script.replace('    if (!root.isConnected || root.hidden) return;', '    if (!active || !root.isConnected) return;')
script = script.replace('    frameId=requestAnimationFrame(frame);\n    if(paused){last=ts;return;}\n', '')
# Keep the supplied timeline and smoothing exactly. Readiness is only a ceiling:
# cached assets must not teleport the can across the original pouring sequence.
script = script.replace('if (manual !== null) target = manual;', 'if (manual !== null) target = Math.min(manual, scripted(pt));')
script = script.replace("    var pct = Math.round(p * 100);", "    root.dataset.fill=String(Math.round(p*100));\n    if(!root.classList.contains('is-leaving'))root.dataset.phase=paintDone?'filled':phase;\n    var pct = Math.round(p * 100);")
script = script.replace('requestAnimationFrame(frame);', 'raf=requestAnimationFrame(frame);')
script = script.replace('frameId=raf=', 'raf=')
script = script.replace("caption.setAttribute('aria-valuenow', pct)", "root.setAttribute('aria-valuenow', pct)")
script = script.replace(" captionNumber.textContent=pct+'%';", '')
script = re.sub(r'    captionText.textContent=.*?;\n', '    raf=requestAnimationFrame(frame);\n', script)
start = script.index('  function restart(){')
script = script[:start] + '''  return {stop,progress(v){if(Number.isFinite(v))manual=Math.max(manual,clamp(v,0,1));},done(){manual=1;}};
}
'''
assert 'window.EPLoader' not in script and 'frameId' not in script
assert 'product-open-amber-v3.png' in fragment and 'data-ep-pause' not in fragment
assert 'ep-caption' not in fragment and 'captionText' not in script
for name, content in [('supplied-loader.css',css),('supplied-loader.html',fragment),('supplied-loader.js',script)]:
    (web/name).write_text(content,encoding='utf-8')
print('Imported latest supplied logo, Berlak photograph and amber flow without captions; lifecycle is scoped to the preview.')
