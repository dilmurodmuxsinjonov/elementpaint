"""Transactional catalogue storage and server-side validation."""
import base64
import hashlib
import hmac
import io
import json
import re
import secrets
import sqlite3
import time
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANGS = ('uz', 'ru', 'en')
ID = re.compile(r'^[a-z0-9][a-z0-9-]{0,89}$')
ASSET = re.compile(r'^assets/(?:[a-zA-Z0-9_-]+/)*[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp|svg)$')


class Problem(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


def stamp(value=None):
    return datetime.fromtimestamp(value or time.time(), timezone.utc).isoformat(timespec='seconds')


def text(value, maximum=200, required=False):
    if not isinstance(value, str) or len(value) > maximum or any(ord(c) < 32 and c not in '\n\t' for c in value):
        raise Problem('Matn formati yoki uzunligi noto‘g‘ri.')
    value = value.strip()
    if required and not value:
        raise Problem('Majburiy maydonni to‘ldiring.')
    return value


def translations(value, maximum=200):
    if not isinstance(value, dict):
        raise Problem('Tarjimalar formati noto‘g‘ri.')
    uz = text(value.get('uz', ''), maximum, True)
    return {lang: text(value.get(lang, ''), maximum) or uz for lang in LANGS}


def image_path(value, required=False):
    if (value is None or value == '') and not required:
        return None
    if not isinstance(value, str) or not ASSET.fullmatch(value) or '..' in value:
        raise Problem('Rasmni kutubxonadan tanlang yoki fayl yuklang.')
    return value


def password_hash(password):
    if not isinstance(password, str) or not 12 <= len(password) <= 256:
        raise Problem('Parol 12–256 ta belgidan iborat bo‘lsin.')
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=16384, r=8, p=1)
    return f'{salt.hex()}:{digest.hex()}'


def check_password(password, encoded):
    if not isinstance(password, str) or len(password) > 256:
        return False
    try:
        salt, expected = encoded.split(':')
        actual = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), n=16384, r=8, p=1)
        return hmac.compare_digest(actual.hex(), expected)
    except (ValueError, TypeError):
        return False


SCHEMA = '''
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL,
 name TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 csrf TEXT NOT NULL, expires REAL NOT NULL);
CREATE TABLE IF NOT EXISTS attempts(key TEXT NOT NULL, at REAL NOT NULL);
CREATE INDEX IF NOT EXISTS attempts_key ON attempts(key,at);
CREATE TABLE IF NOT EXISTS brands(id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS categories(id TEXT PRIMARY KEY, names TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS products(id TEXT PRIMARY KEY, brand_id TEXT NOT NULL REFERENCES brands(id),
 category_id TEXT NOT NULL REFERENCES categories(id), doc TEXT NOT NULL, status TEXT NOT NULL,
 sort_order INTEGER NOT NULL, revision INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 deleted_at TEXT, deleted_by TEXT, trash_until TEXT);
CREATE INDEX IF NOT EXISTS product_state ON products(deleted_at,status,sort_order);
CREATE TABLE IF NOT EXISTS revisions(id INTEGER PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
 at TEXT NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL, doc TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY, path TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
 mime TEXT NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL, bytes INTEGER NOT NULL,
 sha256 TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY, at TEXT NOT NULL, actor TEXT NOT NULL,
 action TEXT NOT NULL, entity TEXT NOT NULL, detail TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);
'''


class ClosingConnection(sqlite3.Connection):
    def __exit__(self, *args):
        try:
            return super().__exit__(*args)
        finally:
            self.close()


class Catalogue:
    def __init__(self, directory, seed=None):
        self.directory = Path(directory).resolve()
        self.directory.mkdir(parents=True, exist_ok=True)
        self.media_dir = self.directory / 'media'
        self.media_dir.mkdir(exist_ok=True)
        self.path = self.directory / 'catalog.sqlite3'
        with self.connect() as db:
            db.executescript(SCHEMA)
            db.execute('PRAGMA journal_mode=WAL')
            db.execute("INSERT OR IGNORE INTO settings VALUES('trashDays','30')")
            db.execute("INSERT OR IGNORE INTO settings VALUES('version','1')")
            if not db.execute('SELECT 1 FROM products').fetchone() and not db.execute("SELECT 1 FROM settings WHERE key='seeded'").fetchone():
                data = seed or json.loads((ROOT / 'admin/seed.json').read_text(encoding='utf-8'))
                for i, b in enumerate(data['brands']):
                    db.execute('INSERT INTO brands VALUES(?,?,?)', (b['id'], b['name'], i))
                for i, c in enumerate(data['categories']):
                    db.execute('INSERT INTO categories VALUES(?,?,?)', (c['id'], json.dumps(c['name'], ensure_ascii=False), i))
                for i, p in enumerate(data['products']):
                    self.insert(db, p, 'Boshlang‘ich katalog', p['id'], i)
                db.execute("INSERT INTO settings VALUES('seeded','true')")
        self.dummy_password = password_hash(secrets.token_urlsafe(24))

    def connect(self):
        db = sqlite3.connect(self.path, timeout=15, factory=ClosingConnection)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA foreign_keys=ON')
        db.execute('PRAGMA busy_timeout=15000')
        return db

    @contextmanager
    def transaction(self):
        db = self.connect()
        try:
            db.execute('BEGIN IMMEDIATE')
            yield db
            db.commit()
        except sqlite3.IntegrityError as exc:
            db.rollback()
            raise Problem('Bu nom band yoki yozuv boshqa mahsulotlarda ishlatilgan.', 409) from exc
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def log(self, db, actor, action, entity='', detail=''):
        db.execute('INSERT INTO audit(at,actor,action,entity,detail) VALUES(?,?,?,?,?)',
                   (stamp(), actor, action, entity, str(detail)[:250]))

    def bump(self, db):
        db.execute("UPDATE settings SET value=CAST(value AS INTEGER)+1 WHERE key='version'")

    def dictionaries(self, db):
        brands = [dict(r) for r in db.execute('SELECT * FROM brands ORDER BY sort_order,name')]
        categories = [{'id': r['id'], 'name': json.loads(r['names']), 'sort_order': r['sort_order']}
                      for r in db.execute('SELECT * FROM categories ORDER BY sort_order,id')]
        return brands, categories

    def document(self, row):
        doc = json.loads(row['doc'])
        doc.update(id=row['id'], brandId=row['brand_id'], categoryId=row['category_id'], brand=row['brand_name'],
                   status=row['status'], order=row['sort_order'], revision=row['revision'], createdAt=row['created_at'],
                   updatedAt=row['updated_at'], deletedAt=row['deleted_at'], deletedBy=row['deleted_by'], trashUntil=row['trash_until'])
        return doc

    def rows(self, db):
        return [self.document(r) for r in db.execute('SELECT p.*,b.name brand_name FROM products p JOIN brands b ON b.id=p.brand_id ORDER BY p.sort_order,p.created_at')]

    def get(self, db, product_id):
        if not isinstance(product_id, str) or not ID.fullmatch(product_id):
            raise Problem('Mahsulot IDsi noto‘g‘ri.')
        row = db.execute('SELECT p.*,b.name brand_name FROM products p JOIN brands b ON b.id=p.brand_id WHERE p.id=?', (product_id,)).fetchone()
        if row is None:
            raise Problem('Mahsulot topilmadi.', 404)
        return self.document(row)

    def validate(self, db, data):
        if not isinstance(data, dict):
            raise Problem('Mahsulot formati noto‘g‘ri.')
        brand_id, category = data.get('brandId'), data.get('categoryId')
        if not isinstance(brand_id, str) or not isinstance(category, str):
            raise Problem('Brend va mahsulot bo‘limini tanlang.')
        if not db.execute('SELECT 1 FROM brands WHERE id=?', (brand_id,)).fetchone():
            raise Problem('Brendni tanlang.')
        if not db.execute('SELECT 1 FROM categories WHERE id=?', (category,)).fetchone():
            raise Problem('Mahsulot bo‘limini tanlang.')
        status = data.get('status', 'draft')
        if status not in ('draft', 'published', 'hidden'):
            raise Problem('Nashr holati noto‘g‘ri.')
        packages = data.get('packages', [])
        if not isinstance(packages, list) or len(packages) > 30 or any(type(n) not in (int, float) or not 0 < n <= 10000 for n in packages):
            raise Problem('Qadoq hajmlari musbat son bo‘lsin.')
        unit = data.get('packageUnit', 'kg')
        if unit not in ('kg', 'g', 'l', 'pcs'):
            raise Problem('Qadoq birligi noto‘g‘ri.')
        aliases = data.get('aliases', [])
        if not isinstance(aliases, list) or len(aliases) > 30 or any(not isinstance(a, str) or not ID.fullmatch(a) for a in aliases):
            raise Problem('Eski havolalar formati noto‘g‘ri.')
        colour = data.get('color')
        if colour == '':
            colour = None
        if colour and (not isinstance(colour, str) or not re.fullmatch('#[0-9a-fA-F]{6}', colour)):
            raise Problem('Rang kodi #RRGGBB shaklida bo‘lsin.')
        image = image_path(data.get('image'), status == 'published')
        original = image_path(data.get('originalImage'))
        for path in (image, original):
            if path and not self.asset_exists(path):
                raise Problem('Tanlangan rasm topilmadi. Qayta yuklang.')
        colour_name = data.get('colorName')
        if colour_name is None:
            colour_name = {}
        if not isinstance(colour_name, dict):
            raise Problem('Rang nomi formati noto‘g‘ri.')
        return {'title': translations(data.get('title')), 'description': translations(data.get('description'), 8000),
                'brandId': brand_id, 'categoryId': category, 'status': status, 'image': image, 'originalImage': original,
                'packages': sorted(set(packages)), 'packageUnit': unit, 'aliases': aliases, 'variants': [],
                'sku': text(data.get('sku', ''), 80), 'color': colour,
                'colorName': translations(colour_name) if colour_name.get('uz') else None,
                'familyId': text(data.get('familyId', ''), 90), 'variantId': text(data.get('variantId', ''), 90),
                'sourceStatus': data.get('sourceStatus') if data.get('sourceStatus') in ('client-provided-catalog', 'client-provided-label', 'client-provided-image') else 'admin',
                'catalogNumber': data.get('catalogNumber') if type(data.get('catalogNumber')) is int else None}

    def asset_exists(self, path):
        if path.startswith('assets/admin-media/'):
            return (self.media_dir / Path(path).name).is_file()
        return (ROOT / 'element_paint_web' / path).is_file()

    def insert(self, db, data, actor, product_id=None, order=None):
        doc = self.validate(db, data)
        product_id = product_id or 'product-' + uuid.uuid4().hex[:16]
        if not isinstance(product_id, str) or not ID.fullmatch(product_id):
            raise Problem('Mahsulot IDsi noto‘g‘ri.')
        if order is None:
            order = data.get('order', db.execute('SELECT COALESCE(MAX(sort_order),0)+1 FROM products').fetchone()[0])
        if type(order) is not int or not -100000 <= order <= 100000:
            raise Problem('Tartib soni noto‘g‘ri.')
        now = stamp()
        db.execute('INSERT INTO products VALUES(?,?,?,?,?,?,1,?,?,NULL,NULL,NULL)',
                   (product_id, doc['brandId'], doc['categoryId'], json.dumps(doc, ensure_ascii=False), doc['status'], int(order), now, now))
        self.log(db, actor, 'create', product_id, doc['title']['uz'])
        self.bump(db)
        return self.get(db, product_id)

    def edit(self, db, product_id, data, actor, action='edit'):
        before = self.get(db, product_id)
        if data.get('revision') != before['revision']:
            raise Problem('Mahsulot boshqa oynada o‘zgargan. Ro‘yxatni yangilab qayta oching.', 409)
        if before['deletedAt']:
            raise Problem('Mahsulot savatda. Avval qayta tiklang.', 409)
        doc = self.validate(db, data)
        order = data.get('order', before['order'])
        if type(order) is not int or not -100000 <= order <= 100000:
            raise Problem('Tartib soni noto‘g‘ri.')
        db.execute('INSERT INTO revisions(product_id,at,actor,action,doc) VALUES(?,?,?,?,?)',
                   (product_id, stamp(), actor, action, json.dumps(before, ensure_ascii=False)))
        db.execute('UPDATE products SET brand_id=?,category_id=?,doc=?,status=?,sort_order=?,revision=revision+1,updated_at=? WHERE id=?',
                   (doc['brandId'], doc['categoryId'], json.dumps(doc, ensure_ascii=False), doc['status'], order, stamp(), product_id))
        self.log(db, actor, action, product_id, doc['title']['uz'])
        self.bump(db)
        return self.get(db, product_id)

    def bulk(self, items, action, actor, owner=False, confirm=''):
        if not isinstance(items, list) or not 1 <= len(items) <= 200 or len({str(i.get('id')) for i in items if isinstance(i, dict)}) != len(items):
            raise Problem('1–200 ta mahsulotni tanlang.')
        if action not in ('trash', 'restore', 'purge', 'published', 'draft', 'hidden'):
            raise Problem('Amal noto‘g‘ri.')
        if action == 'purge':
            if not owner:
                raise Problem('Butunlay o‘chirish faqat bosh adminga ruxsat.', 403)
            if confirm != "O‘CHIRISH":
                raise Problem('Butunlay o‘chirish tasdiqlanmadi.')
            self.backup()
        with self.transaction() as db:
            current = [self.get(db, item.get('id')) for item in items]
            for item, row in zip(items, current):
                if item.get('revision') != row['revision']:
                    raise Problem('Ro‘yxat eskirgan. Yangilab qayta urinib ko‘ring.', 409)
                if action in ('restore', 'purge') and not row['deletedAt']:
                    raise Problem('Bu amal faqat savatdagi mahsulotlarga qo‘llanadi.', 409)
                if action not in ('restore', 'purge') and row['deletedAt']:
                    raise Problem('Mahsulot avvaldan savatda.', 409)
            days = int(db.execute("SELECT value FROM settings WHERE key='trashDays'").fetchone()[0])
            for row in current:
                if action == 'purge':
                    db.execute('DELETE FROM products WHERE id=?', (row['id'],))
                elif action == 'trash':
                    db.execute('UPDATE products SET deleted_at=?,deleted_by=?,trash_until=?,revision=revision+1,updated_at=? WHERE id=?',
                               (stamp(), actor, stamp(time.time() + days*86400), stamp(), row['id']))
                elif action == 'restore':
                    db.execute('UPDATE products SET deleted_at=NULL,deleted_by=NULL,trash_until=NULL,revision=revision+1,updated_at=? WHERE id=?', (stamp(), row['id']))
                else:
                    row.update(status=action)
                    self.edit(db, row['id'], row, actor, action)
                self.log(db, actor, action, row['id'], row['title']['uz'])
            self.bump(db)
        return len(current)

    def snapshot(self, private=False):
        with self.connect() as db:
            brands, categories = self.dictionaries(db)
            items = self.rows(db)
            if not private:
                allowed = ('id','aliases','categoryId','brand','title','description','image','originalImage','packages','packageUnit','variants','colorName','color','familyId','variantId','sourceStatus','catalogNumber','sku')
                items = [{k: p.get(k) for k in allowed} for p in items if not p['deletedAt'] and p['status'] == 'published']
            return {'schemaVersion': 1, 'version': int(db.execute("SELECT value FROM settings WHERE key='version'").fetchone()[0]),
                    'generatedAt': stamp(), 'products': items, 'categories': categories,
                    **({'brands': brands, 'settings': {'trashDays': int(db.execute("SELECT value FROM settings WHERE key='trashDays'").fetchone()[0])}} if private else {})}

    def backup(self):
        folder = self.directory / 'backups'
        folder.mkdir(exist_ok=True)
        target = folder / (datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S-') + secrets.token_hex(3) + '.sqlite3')
        with self.connect() as source, sqlite3.connect(target, factory=ClosingConnection) as destination:
            source.backup(destination)
        return target

    def upload(self, data, actor):
        from PIL import Image, UnidentifiedImageError
        if not isinstance(data.get('base64'), str):
            raise Problem('Rasm fayli buzilgan.')
        try:
            raw = base64.b64decode(data.get('base64', ''), validate=True)
        except (ValueError, TypeError):
            raise Problem('Rasm fayli buzilgan.')
        if not raw or len(raw) > 8*1024*1024:
            raise Problem('Rasm hajmi 8 MBdan oshmasin.')
        try:
            with Image.open(io.BytesIO(raw)) as im:
                kind, width, height = im.format, im.width, im.height
                if kind not in ('PNG', 'JPEG', 'WEBP') or width*height > 25_000_000 or max(width,height) > 8000 or min(width,height) < 16:
                    raise Problem('PNG, JPEG yoki WebP tanlang; o‘lcham 16–8000 px, jami 25 MPgacha.')
                if getattr(im, 'n_frames', 1) != 1:
                    raise Problem('Harakatsiz mahsulot rasmini tanlang.')
                im.verify()
        except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
            raise Problem('Bu fayl to‘g‘ri rasm emas.')
        extension = {'PNG':'png','JPEG':'jpg','WEBP':'webp'}[kind]
        token = uuid.uuid4().hex
        filename = token + '.' + extension
        path = 'assets/admin-media/' + filename
        name = text(data.get('name', 'Rasm'), 180)
        (self.media_dir / filename).write_bytes(raw)
        try:
            with self.transaction() as db:
                db.execute('INSERT INTO media VALUES(?,?,?,?,?,?,?,?,?)', (token,path,name,'image/'+('jpeg' if kind=='JPEG' else extension),width,height,len(raw),hashlib.sha256(raw).hexdigest(),stamp()))
                self.log(db, actor, 'upload', token, name)
        except Exception:
            (self.media_dir / filename).unlink(missing_ok=True)
            raise
        return {'id': token, 'path': path, 'name': name, 'width': width, 'height': height}

    def import_data(self, data, actor):
        if not isinstance(data, dict) or data.get('schemaVersion') != 1 or not isinstance(data.get('products'), list) or not 1 <= len(data['products']) <= 5000:
            raise Problem('Katalog JSON formati noto‘g‘ri yoki 5000 yozuvdan ko‘p.')
        self.backup()
        with self.transaction() as db:
            seen=set()
            for field in ('brands', 'categories'):
                if not isinstance(data.get(field, []), list) or any(not isinstance(r, dict) for r in data.get(field, [])):
                    raise Problem('Importdagi bo‘limlar formati noto‘g‘ri.')
            for row in data.get('brands', []):
                if not ID.fullmatch(str(row.get('id',''))):
                    raise Problem('Importdagi brend IDsi noto‘g‘ri.')
                db.execute('INSERT INTO brands(id,name) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name', (row['id'],text(row.get('name',''),100,True)))
            for row in data.get('categories', []):
                if not ID.fullmatch(str(row.get('id',''))):
                    raise Problem('Importdagi bo‘lim IDsi noto‘g‘ri.')
                db.execute('INSERT INTO categories(id,names) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET names=excluded.names', (row['id'],json.dumps(translations(row.get('name')),ensure_ascii=False)))
            for row in data['products']:
                if not isinstance(row, dict):
                    raise Problem('Importdagi mahsulot formati noto‘g‘ri.')
                key=row.get('id')
                if not isinstance(key,str) or not ID.fullmatch(key) or key in seen:
                    raise Problem('Importdagi mahsulot IDsi takror yoki noto‘g‘ri.')
                seen.add(key)
                before=db.execute('SELECT id FROM products WHERE id=?',(key,)).fetchone()
                if before:
                    current=self.get(db,key)
                    if current['deletedAt']:
                        raise Problem('Importdagi mahsulot savatda. Avval tiklang: '+key,409)
                    self.edit(db,key,{**row,'revision':current['revision']},actor,'import')
                else:
                    self.insert(db,{**row,'status':'draft'},actor,key)
            self.log(db,actor,'import','',f'{len(seen)} mahsulot')
        return len(seen)
