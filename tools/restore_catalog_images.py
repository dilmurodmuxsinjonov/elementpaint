"""Restore the PDF's embedded product images byte-for-byte, without image editing."""
import argparse
import hashlib
import json
import sys
from pathlib import Path

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pdf',type=Path,required=True)
    parser.add_argument('--python-packages',type=Path)
    args=parser.parse_args()
    if args.python_packages:sys.path.insert(0,str(args.python_packages))
    import pymupdf
    root=Path(__file__).resolve().parent.parent
    fixture=json.loads((root/'tests/fixtures/catalog-2026.json').read_text(encoding='utf-8'))
    source_hash=hashlib.sha256(args.pdf.read_bytes()).hexdigest()
    if source_hash!=fixture['sourceSha256']:raise SystemExit('The PDF is not the audited source.')
    doc=pymupdf.open(args.pdf);page=doc[0];items=[]
    for item in page.get_images(full=True):
        xref,smask,width,height=item[:4]
        for rect in page.get_image_rects(xref):
            if rect.y0>=3700 and 70<=rect.width<=160 and 125<=rect.height<=180:
                items.append((rect.y0,rect.x0,xref,width,height,smask))
    items.sort()
    if len(items)!=72:raise SystemExit(f'Unexpected image count: {len(items)}')
    output=root/'element_paint_web/assets/catalog-2026';output.mkdir(parents=True,exist_ok=True)
    records=[]
    for number,(_,_,xref,width,height,smask) in enumerate(items,1):
        extracted=doc.extract_image(xref)
        if extracted['ext']!='png':raise SystemExit(f'Unexpected native format for image {number}')
        name=f'product-{number:03d}.png';data=extracted['image'];(output/name).write_bytes(data)
        records.append({'imageNumber':number,'file':f'assets/catalog-2026/{name}','width':width,'height':height,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'pdfXref':xref,'pdfMask':smask})
    manifest={'sourceSha256':source_hash,'method':'Direct embedded-image extraction; no resizing, background removal, sharpening, generated text or lossy re-encoding.','images':records}
    (root/'tests/fixtures/catalog-image-originals.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Restored {len(records)} original PNG images: {sum(r["bytes"] for r in records)/1024/1024:.2f} MB; heights {min(r["height"] for r in records)}–{max(r["height"] for r in records)} px.')

if __name__=='__main__':main()
