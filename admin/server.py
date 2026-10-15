"""Local authenticated catalogue administration; default bind is loopback only."""
import argparse
import hashlib
import hmac
import json
import mimetypes
import os
import secrets
import threading
import time
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

from .catalog import Catalogue, Problem, ROOT, ID, text, translations, password_hash, check_password, stamp

COOKIE='ep_admin'
PREAUTH='ep_preauth'
SESSION_SECONDS=8*3600


class AdminServer(ThreadingHTTPServer):
    daemon_threads=True
    def __init__(self,address,directory,seed=None,origin=None):
        self.catalog=Catalogue(directory,seed)
        self.origin=origin or f'http://127.0.0.1:{address[1]}'
        self.secure=self.origin.startswith('https://')
        super().__init__(address,Handler)
        if address[1]==0:
            self.origin=f'http://127.0.0.1:{self.server_port}'


class Handler(BaseHTTPRequestHandler):
    server_version='ElementPaint'

    def log_message(self,fmt,*args):
        # Never log request bodies, credentials, cookies or query parameters.
        print(f'{stamp()} {self.command} {urlsplit(self.path).path} {args[1] if len(args)>1 else ""}',flush=True)

    def cookie(self,name):
        try:
            values=SimpleCookie(self.headers.get('Cookie',''))
            return values[name].value if name in values else ''
        except Exception:
            return ''

    def set_cookie(self,name,value,remove=False):
        return f'{name}={value}; Path=/; HttpOnly; SameSite=Strict'+('; Secure' if self.server.secure else '')+('; Max-Age=0' if remove else '')

    def send(self,status,data=None,content_type='application/json; charset=utf-8',headers=None):
        if isinstance(data,(dict,list)):
            data=json.dumps(data,ensure_ascii=False,allow_nan=False).encode()
        elif isinstance(data,str):
            data=data.encode()
        data=data or b''
        self.send_response(status)
        self.send_header('Content-Type',content_type)
        self.send_header('Content-Length',str(len(data)))
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('X-Frame-Options','DENY')
        self.send_header('Referrer-Policy','same-origin')
        self.send_header('Cross-Origin-Resource-Policy','same-origin')
        self.send_header('X-Robots-Tag','noindex, nofollow')
        if urlsplit(self.path).path.startswith('/admin'):
            self.send_header('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
        for key,value in (headers or {}).items():
            self.send_header(key,value)
        self.end_headers()
        if self.command!='HEAD':
            self.wfile.write(data)

    def body(self):
        if self.headers.get('Content-Type','').split(';')[0]!='application/json':
            raise Problem('JSON so‘rovi kutilgan.',415)
        try:
            length=int(self.headers.get('Content-Length','0'))
        except ValueError:
            raise Problem('So‘rov uzunligi noto‘g‘ri.')
        if not 0<length<=12*1024*1024:
            raise Problem('So‘rov hajmi 12 MBdan oshmasin.',413)
        try:
            data=json.loads(self.rfile.read(length),parse_constant=lambda _: (_ for _ in ()).throw(ValueError()))
        except (ValueError,UnicodeError):
            raise Problem('JSON fayli buzilgan.')
        if not isinstance(data,dict):
            raise Problem('So‘rov obyekti noto‘g‘ri.')
        return data

    def session(self,required=True):
        token=self.cookie(COOKIE)
        with self.server.catalog.connect() as db:
            row=db.execute('SELECT s.*,u.username,u.name,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>? AND u.active=1',
                           (hashlib.sha256(token.encode()).hexdigest(),time.time())).fetchone() if token else None
        if required and row is None:
            raise Problem('Avval admin sifatida kiring.',401)
        return dict(row) if row else None

    def owner(self,session):
        if session['role']!='owner':
            raise Problem('Bu amal faqat bosh adminga ruxsat.',403)

    def guard(self):
        origin=urlsplit(self.server.origin)
        allowed={origin.netloc}
        if origin.hostname=='127.0.0.1':
            allowed.add(f'localhost:{self.server.server_port}')
        if self.headers.get('Host') not in allowed:
            raise Problem('Bu hostga ruxsat yo‘q.',403)
        if self.command not in ('GET','HEAD'):
            if self.headers.get('Origin') not in {self.server.origin,*('http://'+h for h in allowed if h.startswith('localhost:'))}:
                raise Problem('So‘rov admin sahifasidan yuborilishi kerak.',403)

    def do_GET(self):
        self.dispatch()

    def do_POST(self):
        self.dispatch()

    def do_PATCH(self):
        self.dispatch()

    def do_DELETE(self):
        self.dispatch()

    def do_HEAD(self):
        self.dispatch()

    def dispatch(self):
        try:
            self.guard()
            path=unquote(urlsplit(self.path).path)
            if path.startswith('/api/'):
                self.api(path)
            elif path=='/catalog-snapshot.json':
                self.send(200,self.server.catalog.snapshot())
            else:
                self.static(path)
        except Problem as exc:
            self.send(exc.status,{'error':str(exc)})
        except (BrokenPipeError,ConnectionResetError):
            pass
        except Exception as exc:
            print(f'Internal error: {type(exc).__name__}',flush=True)
            self.send(500,{'error':'Serverda xatolik. O‘zgarishlar saqlanmagan bo‘lishi mumkin; ro‘yxatni yangilang.'})

    def static(self,path):
        if '\\' in path or '\x00' in path or any(part in ('.','..') for part in path.split('/')):
            raise Problem('Manzil noto‘g‘ri.',404)
        if path in ('/admin','/admin/'):
            file=ROOT/'admin/web/index.html'
        elif path in ('/admin/admin.js','/admin/admin.css'):
            file=ROOT/'admin/web'/Path(path).name
        elif path.startswith('/assets/admin-media/'):
            file=self.server.catalog.media_dir/Path(path).name
        elif path.startswith('/assets/'):
            file=ROOT/'element_paint_web'/path.lstrip('/')
        elif path in ('/','/preview.html','/index.html'):
            file=ROOT/'element_paint_web/preview.html'
        elif path.count('/')==1 and path.endswith(('.js','.css')):
            file=ROOT/'element_paint_web'/path.lstrip('/')
        else:
            raise Problem('Sahifa topilmadi.',404)
        if not file.is_file() or file.suffix.lower() not in ('.html','.js','.css','.png','.jpg','.jpeg','.webp','.svg','.woff2'):
            raise Problem('Fayl topilmadi.',404)
        content_type={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2'}.get(file.suffix.lower()) or mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
        self.send(200,file.read_bytes(),content_type)

    def api(self,path):
        catalog=self.server.catalog
        method=self.command
        if path=='/api/session' and method=='GET':
            session=self.session(False)
            with catalog.connect() as db:
                setup=not db.execute('SELECT 1 FROM users').fetchone()
            csrf=session['csrf'] if session else secrets.token_urlsafe(32)
            user={k:session[k] for k in ('username','name','role')} if session else None
            self.send(200,{'user':user,'csrf':csrf,'setupRequired':setup},headers={} if session else {'Set-Cookie':self.set_cookie(PREAUTH,csrf)})
            return
        if path in ('/api/login','/api/setup') and method=='POST':
            csrf=self.cookie(PREAUTH)
            if not csrf or not hmac.compare_digest(csrf,self.headers.get('X-CSRF-Token','')):
                raise Problem('Sahifani yangilab qayta urinib ko‘ring.',403)
            self.login(path,self.body())
            return
        session=self.session()
        if method not in ('GET','HEAD') and not hmac.compare_digest(session['csrf'],self.headers.get('X-CSRF-Token','')):
            raise Problem('So‘rov tasdiqlanmadi. Sahifani yangilang.',403)
        actor=session['username']
        if path=='/api/logout' and method=='POST':
            with catalog.transaction() as db:
                db.execute('DELETE FROM sessions WHERE token=?',(session['token'],))
            self.send(200,{'ok':True},headers={'Set-Cookie':self.set_cookie(COOKIE,'',True)})
        elif path=='/api/admin/catalog' and method=='GET':
            self.send(200,catalog.snapshot(True))
        elif path=='/api/admin/products' and method=='POST':
            with catalog.transaction() as db:
                product=catalog.insert(db,self.body(),actor)
            self.send(201,{'product':product})
        elif path=='/api/admin/products/bulk' and method=='POST':
            data=self.body()
            count=catalog.bulk(data.get('items'),data.get('action'),actor,session['role']=='owner',data.get('confirm',''))
            self.send(200,{'count':count})
        elif path.startswith('/api/admin/products/'):
            parts=path.split('/')
            key=parts[4]
            if len(parts)==5 and method=='PATCH':
                with catalog.transaction() as db:
                    product=catalog.edit(db,key,self.body(),actor)
                self.send(200,{'product':product})
            elif len(parts)==6 and parts[5]=='duplicate' and method=='POST':
                with catalog.transaction() as db:
                    product=catalog.get(db,key)
                    product.update(status='draft',aliases=[],sku='',familyId='',variantId='')
                    product['title']={k:v+' — nusxa' for k,v in product['title'].items()}
                    product=catalog.insert(db,product,actor)
                self.send(201,{'product':product})
            elif len(parts)==6 and parts[5]=='history' and method=='GET':
                with catalog.connect() as db:
                    catalog.get(db,key)
                    history=[dict(r) for r in db.execute('SELECT id,at,actor,action FROM revisions WHERE product_id=? ORDER BY id DESC LIMIT 50',(key,))]
                self.send(200,{'history':history})
            elif len(parts)==6 and parts[5]=='revision' and method=='POST':
                data=self.body()
                if type(data.get('historyId')) is not int:
                    raise Problem('Tarix IDsi noto‘g‘ri.')
                with catalog.transaction() as db:
                    row=db.execute('SELECT doc FROM revisions WHERE id=? AND product_id=?',(data.get('historyId'),key)).fetchone()
                    if row is None:
                        raise Problem('Tarixdagi holat topilmadi.',404)
                    previous=json.loads(row['doc'])
                    previous['revision']=data.get('revision')
                    product=catalog.edit(db,key,previous,actor,'restore-version')
                self.send(200,{'product':product})
            else:
                raise Problem('Amal topilmadi.',404)
        elif path in ('/api/admin/brands','/api/admin/categories') and method in ('POST','PATCH','DELETE'):
            data=self.body()
            table='brands' if path.endswith('brands') else 'categories'
            key=data.get('id') or ('brand-' if table=='brands' else 'category-')+secrets.token_hex(5)
            if not isinstance(key,str) or not ID.fullmatch(key):
                raise Problem('ID noto‘g‘ri.')
            with catalog.transaction() as db:
                if method=='DELETE':
                    self.owner(session)
                    db.execute(f'DELETE FROM {table} WHERE id=?',(key,))
                else:
                    order=data.get('order',0)
                    if type(order) is not int or not -100000<=order<=100000:
                        raise Problem('Tartib noto‘g‘ri.')
                    if table=='brands':
                        name=text(data.get('name',''),100,True)
                        db.execute('INSERT INTO brands VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,sort_order=excluded.sort_order',(key,name,order))
                    else:
                        name=json.dumps(translations(data.get('name')),ensure_ascii=False)
                        db.execute('INSERT INTO categories VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET names=excluded.names,sort_order=excluded.sort_order',(key,name,order))
                catalog.log(db,actor,method.lower()+'-'+table,key)
                catalog.bump(db)
            self.send(200,{'ok':True})
        elif path=='/api/admin/media' and method=='POST':
            self.send(201,{'media':catalog.upload(self.body(),actor)})
        elif path=='/api/admin/media' and method=='GET':
            with catalog.connect() as db:
                media=[dict(r) for r in db.execute('SELECT * FROM media ORDER BY created_at DESC')]
            with catalog.connect() as db:
                paths={m['path'] for m in media}
                for p in catalog.rows(db):
                    for image in (p.get('image'),p.get('originalImage')):
                        if image and image not in paths:
                            media.append({'path':image,'name':p['title']['uz'],'width':None,'height':None})
                            paths.add(image)
            self.send(200,{'media':media})
        elif path=='/api/admin/audit' and method=='GET':
            with catalog.connect() as db:
                entries=[dict(r) for r in db.execute('SELECT * FROM audit ORDER BY id DESC LIMIT 200')]
            self.send(200,{'entries':entries})
        elif path=='/api/admin/settings' and method=='PATCH':
            self.owner(session)
            days=self.body().get('trashDays')
            if type(days) is not int or not 1<=days<=365:
                raise Problem('Savat muddati 1–365 kun bo‘lsin.')
            with catalog.transaction() as db:
                db.execute("UPDATE settings SET value=? WHERE key='trashDays'",(str(days),))
                catalog.log(db,actor,'settings','','Savat: '+str(days))
            self.send(200,{'ok':True})
        elif path=='/api/admin/export' and method=='GET':
            self.owner(session)
            self.send(200,catalog.snapshot(True),headers={'Content-Disposition':'attachment; filename="elementpaint-catalog-backup.json"'})
        elif path=='/api/admin/import' and method=='POST':
            self.owner(session)
            data=self.body()
            if data.get('confirm')!='IMPORT':
                raise Problem('Importni tasdiqlang.')
            self.send(200,{'count':catalog.import_data(data.get('catalog'),actor)})
        elif path=='/api/admin/export-preview' and method=='POST':
            self.owner(session)
            from .publish import export_preview
            export_preview(catalog)
            self.send(200,{'ok':True,'count':len(catalog.snapshot()['products'])})
        elif path=='/api/admin/password' and method=='POST':
            data=self.body()
            with catalog.transaction() as db:
                user=db.execute('SELECT * FROM users WHERE id=?',(session['user_id'],)).fetchone()
                if not check_password(data.get('current'),user['password']):
                    raise Problem('Joriy parol noto‘g‘ri.',403)
                db.execute('UPDATE users SET password=? WHERE id=?',(password_hash(data.get('password')),user['id']))
                db.execute('DELETE FROM sessions WHERE user_id=?',(user['id'],))
                catalog.log(db,actor,'password')
            self.send(200,{'ok':True},headers={'Set-Cookie':self.set_cookie(COOKIE,'',True)})
        else:
            raise Problem('API manzili topilmadi.',404)

    def login(self,path,data):
        catalog=self.server.catalog
        username=text(data.get('username',''),50,True).lower()
        if not __import__('re').fullmatch(r'[a-z0-9_.-]{3,50}',username):
            raise Problem('Login: 3–50 ta lotin harfi, raqam, nuqta yoki tire.')
        key=self.client_address[0]+':'+username
        with catalog.transaction() as db:
            db.execute('DELETE FROM attempts WHERE at<?',(time.time()-900,))
            if db.execute('SELECT COUNT(*) FROM attempts WHERE key=?',(key,)).fetchone()[0]>=6:
                raise Problem('Ko‘p urinish. 15 daqiqadan keyin qayta kiring.',429)
            if db.execute('SELECT COUNT(*) FROM attempts WHERE key LIKE ?',(self.client_address[0]+':%',)).fetchone()[0]>=30:
                raise Problem('Ko‘p urinish. 15 daqiqadan keyin qayta kiring.',429)
            user=db.execute('SELECT * FROM users WHERE username=?',(username,)).fetchone()
            if path=='/api/setup':
                if db.execute('SELECT 1 FROM users').fetchone():
                    raise Problem('Admin akkaunti avval yaratilgan.',409)
                name=text(data.get('name',''),100,True)
                encoded=password_hash(data.get('password'))
                user_id=secrets.token_hex(16)
                db.execute('INSERT INTO users VALUES(?,?,?,?,?,1)',(user_id,username,name,encoded,'owner'))
                user=db.execute('SELECT * FROM users WHERE id=?',(user_id,)).fetchone()
            else:
                valid=check_password(data.get('password'),user['password'] if user else catalog.dummy_password)
                if not valid or not user or not user['active']:
                    db.execute('INSERT INTO attempts VALUES(?,?)',(key,time.time()))
                    catalog.log(db,username,'login-failed')
                    # Commit the rate-limit record before returning the error.
                    db.commit()
                    raise Problem('Login yoki parol noto‘g‘ri.',401)
            db.execute('DELETE FROM attempts WHERE key=?',(key,))
            token,csrf=secrets.token_urlsafe(40),secrets.token_urlsafe(32)
            db.execute('DELETE FROM sessions WHERE expires<?',(time.time(),))
            db.execute('INSERT INTO sessions VALUES(?,?,?,?)',(hashlib.sha256(token.encode()).hexdigest(),user['id'],csrf,time.time()+SESSION_SECONDS))
            catalog.log(db,username,'login')
        self.send(200,{'user':{'username':username,'name':user['name'],'role':user['role']},'csrf':csrf},headers={'Set-Cookie':self.set_cookie(COOKIE,token)})


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port',type=int,default=8092)
    parser.add_argument('--data-dir',type=Path,default=ROOT/'admin-data')
    args=parser.parse_args()
    server=AdminServer(('127.0.0.1',args.port),args.data_dir)
    print(f'Element Paint admin: http://127.0.0.1:{server.server_port}/admin/',flush=True)
    print('Data directory: '+str(args.data_dir.resolve()),flush=True)
    server.serve_forever()


if __name__=='__main__':
    main()
