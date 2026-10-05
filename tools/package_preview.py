"""Package only the preview runtime; do not include production redirects or work files."""
import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent / 'element_paint_web'
CORE = ('preview.html', 'preview.css', 'preview-app.js', 'catalog-data.js',
        'legacy-products.js', 'berlak-scene.js', 'vendor/three.module.js',
        'vendor/three.core.js', 'vendor/THREE-LICENSE.txt', 'vendor/MANROPE-OFL.txt')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    source = '\n'.join((WEB / item).read_text(encoding='utf-8-sig') for item in CORE)
    assets = sorted(set(re.findall(r'assets/[A-Za-z0-9_.-]+\.(?:jpg|png|webp|svg|woff2)', source)))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    manifest = []
    with zipfile.ZipFile(args.output, 'w', zipfile.ZIP_DEFLATED) as archive:
        for name in [*CORE, *assets]:
            data = (WEB / name).read_bytes()
            archive.writestr(name, data)
            manifest.append({'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
        archive.writestr('index.html', (WEB / 'preview.html').read_bytes())
        archive.writestr('robots.txt', 'User-agent: *\nDisallow: /\n')
        archive.writestr('.nojekyll', '')
    args.output.with_suffix('.manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Preview package: {len(manifest)+3} runtime files, {args.output.stat().st_size/1024/1024:.2f} MB. Work documents and production redirects excluded.')

if __name__ == '__main__':
    main()
