"""Create a minimal Plesk deployment ZIP from runtime dependencies."""
import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "element_paint_web"
CORE = ("index.html", "style.css", "theme.js", "products.js", "app.js",
        ".htaccess", "robots.txt", "sitemap.xml")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    sources = "\n".join((WEB / name).read_text(encoding="utf-8-sig") for name in CORE)
    assets = sorted(set(re.findall(r"assets/[A-Za-z0-9_.-]+\.(?:jpg|jpeg|png|webp|svg)", sources)))
    files = [*CORE, *assets]
    args.output.parent.mkdir(parents=True, exist_ok=True)
    manifest = []
    with zipfile.ZipFile(args.output, "w", zipfile.ZIP_DEFLATED) as archive:
        for relative in files:
            file = WEB / relative
            if not file.is_file():
                raise FileNotFoundError(file)
            data = file.read_bytes()
            entry = zipfile.ZipInfo(relative)
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            entry.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(entry, data)
            manifest.append({"path": relative, "bytes": len(data),
                             "sha256": hashlib.sha256(data).hexdigest()})
    args.output.with_suffix(".manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Packaged {len(files)} runtime files ({len(assets)} images): {args.output}")
    print(f"ZIP size: {args.output.stat().st_size / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
