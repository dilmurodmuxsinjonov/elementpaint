"""Build private backend and public site separately inside a hosting-home ZIP.

The resulting ZIP contains private account hashes: never publish or commit it.
The existing runtime is installed separately outside the document root.
"""
import argparse
import json
import re
import sqlite3
import stat
import tempfile
import zipfile
from contextlib import closing
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent

def put(archive,name,data=b'',mode=0o644,directory=False):
    item=zipfile.ZipInfo(name.rstrip('/')+'/' if directory else name)
    item.create_system=3
    item.external_attr=((stat.S_IFDIR if directory else stat.S_IFREG)|mode)<<16
    item.compress_type=zipfile.ZIP_DEFLATED
    archive.writestr(item,data)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--preview',type=Path,required=True)
    parser.add_argument('--database',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--private-name',default='elementpaint-private-20261017')
    parser.add_argument('--public-name',default='elementpaint-release-20261017')
    args=parser.parse_args()
    for value in (args.private_name,args.public_name):
        if not re.fullmatch(r'elementpaint-[a-z0-9-]+',value):raise ValueError('Unsafe release name')
    private='/var/www/vhosts/elementpaint.uz/'+args.private_name
    public='/var/www/vhosts/elementpaint.uz/'+args.public_name
    args.output.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(dir=args.output.parent) as tmp:
        copied=Path(tmp)/'catalog.sqlite3'
        source=sqlite3.connect(args.database.resolve().as_uri()+'?mode=ro',uri=True)
        with closing(sqlite3.connect(copied)) as db:
            source.backup(db)
            db.execute('DELETE FROM sessions');db.execute('DELETE FROM attempts')
            if not db.execute("SELECT 1 FROM users WHERE active=1 AND role='owner'").fetchone():raise ValueError('Existing owner required')
            count=db.execute("SELECT count(*) FROM products WHERE deleted_at IS NULL AND status='published'").fetchone()[0]
            db.commit()
            db.execute('PRAGMA journal_mode=DELETE')
        source.close()
        with zipfile.ZipFile(args.output,'w') as out:
            put(out,args.private_name,directory=True,mode=0o700)
            put(out,args.private_name+'/data',directory=True,mode=0o700)
            put(out,args.private_name+'/data/media',directory=True,mode=0o700)
            put(out,args.private_name+'/data/catalog.sqlite3',copied.read_bytes(),0o600)
            for item in (args.database.parent/'media').glob('*'):
                if item.is_file():put(out,args.private_name+'/data/media/'+item.name,item.read_bytes(),0o600)
            config={'origin':'https://elementpaint.uz','data_directory':private+'/data','web_directory':public}
            put(out,args.private_name+'/config.json',json.dumps(config).encode(),0o600)
            for name in ('__init__.py','catalog.py','publish.py','server.py','wsgi.py','seed.json'):
                put(out,args.private_name+'/app/admin/'+name,(ROOT/'admin'/name).read_bytes(),0o600)
            put(out,args.public_name,directory=True,mode=0o755)
            with zipfile.ZipFile(args.preview) as preview:
                for name in preview.namelist():
                    if name in {'.nojekyll','robots.txt','catalog-snapshot.json','preview.html'} or name.startswith('assets/admin-media/'):continue
                    data=preview.read(name)
                    if name=='index.html':
                        html=data.decode('utf-8-sig').replace('noindex,nofollow','index,follow').replace('href="preview.html"','href="/"')
                        html=re.sub(r'<small data-i18n="preview">.*?</small>','',html)
                        html=html.replace('</head>','  <link rel="canonical" href="https://elementpaint.uz/">\n</head>')
                        data=html.encode()
                    put(out,args.public_name+'/'+name,data)
            for name in ('index.html','admin.js','admin.css'):
                data=(ROOT/'admin/web'/name).read_text(encoding='utf-8')
                if name=='index.html':
                    data=data.replace('Ma’lumotlar shu kompyuterda saqlanadi.','Kirish faqat vakolatli administratorlar uchun.')
                    data=data.replace('Mahalliy saytni','Saytni').replace('Mahalliy katalogni','Saytdagi katalogni').replace('Mahalliy katalog boshqaruvi','Katalog boshqaruvi')
                    data=data.replace('Faqat shu kompyuterda. Asosiy saytga joylanmaydi.','Nashr qilingan mahsulotlar saytda ko‘rinadi.')
                    data=data.replace('SINOV SAYTI','SAYTDAGI KATALOG').replace('Nashrga tayyorlash','Saytni yangilash')
                    data=re.sub(r'<p class="muted">Mahalliy sayt saqlangan.*?</p>','<p class="muted">Nashr qilingan mahsulotlar va o‘zgarishlar saytda darhol yangilanadi. Qoralamalar faqat admin panelida ko‘rinadi.</p>',data)
                    data=data.replace('id="exportPreview"','id="exportPreview" hidden')
                    data=data.replace('Rasmlarning o‘zi va mahalliy baza admin-data papkasida qoladi; to‘liq zaxira uchun shu papkani ham nusxalang.','Rasmlar va kirish ma’lumotlari bu faylga kirmaydi. To‘liq zaxira serverdagi yopiq ma’lumotlar papkasidan olinadi.')
                put(out,args.private_name+'/app/admin/web/'+name,data.encode(),0o600)
            template=ROOT/'tools/production'
            put(out,args.public_name+'/api/gateway.cgi',(template/'gateway.cgi.in').read_text().replace('@@PRIVATE@@',private).encode(),0o755)
            put(out,args.public_name+'/.htaccess',(template/'htaccess.in').read_bytes())
            put(out,args.public_name+'/robots.txt',b'User-agent: *\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://elementpaint.uz/sitemap.xml\n')
            put(out,args.public_name+'/sitemap.xml',b'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://elementpaint.uz/</loc></url></urlset>')
    print(json.dumps({'archive':str(args.output),'published_products':count,'bytes':args.output.stat().st_size}))

if __name__=='__main__':main()
