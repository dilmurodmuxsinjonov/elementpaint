"""Build vector display frames around unchanged approved package photographs.

No raster is re-encoded or regenerated. Each SVG contains the exact source
bytes, a white frame and a hand-traced vector silhouette around the package.
"""
from pathlib import Path
import base64

web = Path(__file__).resolve().parent.parent / 'element_paint_web'
frames = {
    'nitro_lak_studio': 'M626 232 C456 232 308 244 308 266 L309 278 Q310 286 316 292 L314 958 Q305 969 308 983 C310 1019 462 1037 627 1037 C792 1037 943 1018 945 983 Q947 971 940 960 L940 292 Q946 287 945 267 C945 243 793 232 626 232 Z',
    'element_plaster_studio': 'M334 202 Q335 197 344 195 L446 181 L467 173 L494 166 L939 204 Q941 205 941 212 L931 1082 Q931 1093 915 1098 L503 1130 Q492 1130 484 1128 L337 1094 Q325 1091 325 1080 L333 202 Z',
    'glatt_studio': 'M337 200 L451 179 L490 163 L932 204 Q935 205 934 214 L927 1064 Q927 1075 915 1079 L503 1112 Q491 1113 481 1110 L341 1083 Q330 1080 331 1069 L334 211 Q334 202 337 200 Z',
    'milano_decorative_coating_v2': 'M626 13 C447 13 106 26 104 79 L88 103 L87 123 L76 146 L74 211 Q51 207 46 232 Q36 267 46 291 L53 314 Q54 344 77 382 L100 400 L143 1172 Q144 1211 629 1228 Q1088 1227 1109 1185 L1149 400 Q1190 382 1204 336 L1208 294 Q1225 292 1225 270 L1224 245 Q1224 224 1202 213 L1194 153 Q1194 133 1182 118 L1174 84 C1174 35 841 13 626 13 Z M62 290 L77 299 L89 367 Q70 349 62 320 Z M1180 302 L1200 288 Q1203 344 1170 380 Z',
}
for name, silhouette in frames.items():
    suffix = '.webp' if name.startswith('milano') else '.jpg'
    mime = 'image/webp' if suffix == '.webp' else 'image/jpeg'
    source = web / 'assets' / (name + suffix)
    encoded = base64.b64encode(source.read_bytes()).decode('ascii')
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1254" height="1254" viewBox="0 0 1254 1254">
<rect width="1254" height="1254" fill="#fff"/>
<defs><clipPath id="package"><path d="{silhouette}" clip-rule="evenodd" fill-rule="evenodd"/></clipPath></defs>
<image width="1254" height="1254" href="data:{mime};base64,{encoded}" clip-path="url(#package)"/>
</svg>
'''
    target = web / 'assets' / (name + '-white.svg')
    target.write_text(svg, encoding='utf-8')
    print(target.name)
