"""Copy generated masters and encode smaller JPEGs; does not alter artwork."""
import json
import shutil
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
records = json.loads((ROOT / 'design-assets/assets-generation.json').read_text(encoding='utf-8'))
for record in records:
    master = ROOT / 'design-assets' / (record['id'] + '.png')
    shutil.copyfile(record['path'], master)
    output = ROOT / 'element_paint_web/assets' / (record['id'] + '.jpg')
    with Image.open(master) as image:
        image.convert('RGB').save(output, quality=93, optimize=True)
    print(output.name, output.stat().st_size)
