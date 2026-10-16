"""Pre-release boundary checks, using disposable data and exports only."""
import base64
import copy
import http.client
import io
import json
import shutil
import sqlite3
import tempfile
import threading
import time
import unittest
import zipfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from unittest.mock import patch

from PIL import Image
from admin.catalog import Catalogue, ROOT
from admin.publish import export_preview
from admin.server import AdminServer
from test_admin_api import Client
from tools import package_preview


class Preflight(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        (ROOT/'tmp').mkdir(exist_ok=True)
        cls.temp = tempfile.TemporaryDirectory(prefix='preflight-', dir=ROOT/'tmp')
        cls.directory = Path(cls.temp.name)
        cls.server = AdminServer(('127.0.0.1', 0), cls.directory/'data')
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.client = Client(cls.server)
        cls.client.request('/api/session')
        assert cls.client.request('/api/setup', 'POST', {
            'username':'preflight', 'name':'Disposable preflight',
            'password':'Disposable-preflight-6421'})[0] == 200

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()
        cls.temp.cleanup()

    def test_01_http_headers_routes_and_private_files(self):
        for path in ('/', '/admin/', '/admin/admin.js', '/admin/admin.css',
                     '/catalog-snapshot.json', '/assets/logo_light.png'):
            conn = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
            conn.request('HEAD', path)
            res = conn.getresponse()
            self.assertEqual(res.status, 200, path)
            self.assertEqual(res.read(), b'')
            self.assertGreater(int(res.getheader('Content-Length')), 0)
            self.assertEqual(res.getheader('Cache-Control'), 'no-store')
            self.assertEqual(res.getheader('X-Content-Type-Options'), 'nosniff')
            self.assertEqual(res.getheader('X-Frame-Options'), 'DENY')
            if path == '/admin/':
                self.assertIn("frame-ancestors 'none'", res.getheader('Content-Security-Policy'))
            conn.close()
        for path in ('/admin-data/catalog.sqlite3', '/admin/seed.json', '/.git/config',
                     '/.env', '/assets/%2e%2e/admin-data/catalog.sqlite3',
                     '/assets/%5c..%5cadmin-data/catalog.sqlite3', '/assets/'):
            self.assertEqual(self.client.request(path)[0], 404, path)
        for path in ('/', '/admin/', '/catalog-snapshot.json', '/assets/logo_light.png'):
            self.assertEqual(self.client.request(path, 'POST', {})[0], 405, path)
        conn = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
        conn.request('POST', '/api/admin/products', b'{broken', {
            'Origin':self.server.origin, 'Content-Type':'application/json',
            'Cookie':'; '.join(k+'='+v for k,v in self.client.cookies.items()),
            'X-CSRF-Token':self.client.csrf})
        res = conn.getresponse()
        self.assertEqual(res.status, 400)
        self.assertNotIn(b'Traceback', res.read())
        conn.close()

    def test_02_concurrent_edits_and_persistence(self):
        p = copy.deepcopy(self.client.request('/api/admin/catalog')[1]['products'][0])
        p.update(aliases=[], status='draft')
        p = self.client.request('/api/admin/products', 'POST', p)[1]['product']
        barrier = threading.Barrier(2)
        def edit(title):
            worker = Client(self.server)
            worker.cookies = self.client.cookies.copy()
            worker.csrf = self.client.csrf
            barrier.wait()
            return worker.request('/api/admin/products/'+p['id'], 'PATCH', {
                **p, 'title':{'uz':title}})[0]
        with ThreadPoolExecutor(2) as pool:
            results = list(pool.map(edit, ['Parallel one', 'Parallel two']))
        self.assertEqual(sorted(results), [200, 409])
        reopened = Catalogue(self.directory/'data')
        persisted = next(row for row in reopened.snapshot(True)['products'] if row['id']==p['id'])
        self.assertEqual(persisted['revision'], 2)

    def test_03_backup_restore_and_media_export(self):
        buffer = io.BytesIO()
        Image.new('RGB', (32,32), 'green').save(buffer, format='PNG')
        raw = buffer.getvalue()
        def upload(name):
            status,result = self.client.request('/api/admin/media', 'POST', {
                'name':name, 'base64':base64.b64encode(raw).decode()})
            self.assertEqual(status, 201)
            return result['media']['path']
        published_image, draft_image = upload('published.png'), upload('draft-only.png')
        source = copy.deepcopy(self.client.request('/api/admin/catalog')[1]['products'][0])
        source.update(aliases=[], image=published_image, originalImage=published_image, status='published')
        created = self.client.request('/api/admin/products', 'POST', source)[1]['product']
        source.update(image=draft_image, originalImage=draft_image, status='draft')
        self.assertEqual(self.client.request('/api/admin/products', 'POST', source)[0], 201)
        catalog = self.server.catalog
        snapshot = export_preview(catalog, self.directory/'public')
        self.assertTrue((self.directory/'public'/published_image).is_file())
        self.assertFalse((self.directory/'public'/draft_image).exists())
        backup = catalog.backup()
        recovered = self.directory/'recovered'
        recovered.mkdir()
        shutil.copy2(backup, recovered/'catalog.sqlite3')
        shutil.copytree(catalog.media_dir, recovered/'media')
        restored = Catalogue(recovered)
        public = restored.snapshot()
        self.assertEqual(public['products'], snapshot['products'])
        self.assertEqual((restored.media_dir/Path(published_image).name).read_bytes(), raw)
        with restored.connect() as db:
            self.assertEqual(db.execute('PRAGMA integrity_check').fetchone()[0], 'ok')
            self.assertEqual(db.execute('PRAGMA foreign_key_check').fetchall(), [])
        self.assertTrue(any(p['id']==created['id'] for p in public['products']))

    def test_04_preview_package_excludes_stale_and_draft_uploads(self):
        web = self.directory/'fixture-web'
        media = web/'assets/admin-media'
        media.mkdir(parents=True)
        (web/'preview.html').write_text('<img src="assets/admin-media/public.png">', encoding='utf-8')
        (web/'catalog-snapshot.json').write_text(json.dumps({'products':[
            {'image':'assets/admin-media/public.png', 'originalImage':None}]}), encoding='utf-8')
        for name in ('public.png', 'deleted.png', 'draft.png'):
            (media/name).write_bytes(b'image-fixture')
        output = self.directory/'public-package.zip'
        with patch.object(package_preview, 'WEB', web), patch.object(package_preview, 'CORE', ('preview.html','catalog-snapshot.json')), \
             patch('sys.argv', ['package_preview', '--output', str(output)]):
            package_preview.main()
        with zipfile.ZipFile(output) as archive:
            names = archive.namelist()
            self.assertIn('assets/admin-media/public.png', names)
            self.assertNotIn('assets/admin-media/draft.png', names)
            self.assertNotIn('assets/admin-media/deleted.png', names)
            self.assertTrue(all(not name.startswith(('admin/', 'admin-data/', '.git/')) for name in names))

    def test_05_expired_session_and_logout(self):
        anonymous = Client(self.server)
        anonymous.request('/api/session')
        self.assertEqual(anonymous.request('/api/login', 'POST', {
            'username':'preflight', 'password':'Disposable-preflight-6421'})[0], 200)
        self.assertEqual(anonymous.request('/api/logout', 'POST', {})[0], 200)
        self.assertEqual(anonymous.request('/api/admin/catalog')[0], 401)
        anonymous.request('/api/session')
        self.assertEqual(anonymous.request('/api/login', 'POST', {
            'username':'preflight', 'password':'Disposable-preflight-6421'})[0], 200)
        import hashlib
        token = hashlib.sha256(anonymous.cookies['ep_admin'].encode()).hexdigest()
        with self.server.catalog.transaction() as db:
            db.execute('UPDATE sessions SET expires=? WHERE token=?', (time.time()-1,token))
        self.assertEqual(anonymous.request('/api/admin/catalog')[0], 401)

    def test_06_preview_api_export_and_explicit_https_origin(self):
        destination = self.directory/'export-api'
        with patch('admin.publish.ROOT', destination):
            status, result = self.client.request('/api/admin/export-preview', 'POST', {})
        self.assertEqual(status, 200)
        exported = json.loads((destination/'element_paint_web/catalog-snapshot.json').read_text('utf-8'))
        self.assertEqual(result['count'], len(exported['products']))
        self.assertNotIn('brands', exported)
        self.assertNotIn('settings', exported)
        https = AdminServer(('127.0.0.1', 0), self.directory/'https-origin', origin='https://admin.example.test')
        try:
            self.assertEqual(https.origin, 'https://admin.example.test')
            self.assertTrue(https.secure)
        finally:
            https.server_close()


if __name__ == '__main__':
    unittest.main()
