"""Export public catalogue data only; never publish accounts or the database."""
import json
import os
import shutil
import tempfile
from pathlib import Path
from .catalog import ROOT, Problem


def export_preview(catalog, destination=None):
    target = Path(destination or ROOT / 'element_paint_web').resolve()
    snapshot = catalog.snapshot()
    folder = target / 'assets/admin-media'
    folder.mkdir(parents=True, exist_ok=True)
    for product in snapshot['products']:
        for key in ('image', 'originalImage'):
            asset = product.get(key) or ''
            if asset.startswith('assets/admin-media/'):
                source = catalog.media_dir / Path(asset).name
                if not source.is_file():
                    raise Problem('Nashr uchun mahsulot rasmi topilmadi.')
                shutil.copy2(source, folder / source.name)
    target.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix='.catalog-', dir=target)
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as file:
            json.dump(snapshot, file, ensure_ascii=False, indent=2, allow_nan=False)
            file.write('\n')
        os.replace(temporary, target / 'catalog-snapshot.json')
    finally:
        Path(temporary).unlink(missing_ok=True)
    return snapshot
