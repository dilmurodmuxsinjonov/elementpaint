"""Real HTTP/SQLite tests. All changes use disposable directories."""
import base64
import copy
import hashlib
import http.client
import io
import json
import tempfile
import threading
import unittest
from pathlib import Path
from PIL import Image
from admin.catalog import Catalogue, Problem, password_hash
from admin.publish import export_preview
from admin.server import AdminServer


class Client:
    def __init__(self, server):
        self.server = server
        self.cookies = {}
        self.csrf = ''

    def request(self, path, method='GET', data=None, headers=None):
        connection = http.client.HTTPConnection('127.0.0.1', self.server.server_port, timeout=15)
        send_headers = {'Origin': self.server.origin, 'Content-Type': 'application/json',
                        'X-CSRF-Token': self.csrf,
                        'Cookie': '; '.join(k+'='+v for k,v in self.cookies.items())}
        send_headers.update(headers or {})
        connection.request(method, path, None if data is None else json.dumps(data), send_headers)
        response = connection.getresponse()
        raw = response.read()
        for key,value in response.getheaders():
            if key.lower() == 'set-cookie':
                name,token = value.split(';')[0].split('=',1)
                self.cookies[name] = token
        status = response.status
        content_type = response.getheader('Content-Type') or ''
        result = json.loads(raw) if 'application/json' in content_type else raw
        connection.close()
        if isinstance(result,dict) and result.get('csrf'):
            self.csrf = result['csrf']
        return status,result


class AdminAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix='element-admin-test-')
        cls.server = AdminServer(('127.0.0.1',0), cls.temp.name)
        cls.thread = threading.Thread(target=cls.server.serve_forever,daemon=True)
        cls.thread.start()
        cls.owner = Client(cls.server)
        cls.owner.request('/api/session')
        status,_ = cls.owner.request('/api/setup','POST',{'username':'testowner','name':'Test owner','password':'Only-test-password-991'})
        assert status == 200
        with cls.server.catalog.transaction() as db:
            db.execute('INSERT INTO users VALUES(?,?,?,?,?,1)',('editor1','editor','Editor',password_hash('Editor-test-password-44'),'editor'))
        cls.editor = Client(cls.server)
        cls.editor.request('/api/session')
        assert cls.editor.request('/api/login','POST',{'username':'editor','password':'Editor-test-password-44'})[0] == 200

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()
        cls.temp.cleanup()

    def catalog(self):
        status,data = self.owner.request('/api/admin/catalog')
        self.assertEqual(status,200)
        return data

    def create(self, **changes):
        product = copy.deepcopy(next(p for p in self.catalog()['products'] if not p['deletedAt']))
        product.update(changes)
        product['aliases'] = []
        status,result = self.owner.request('/api/admin/products','POST',product)
        self.assertEqual(status,201,result)
        return result['product']

    def bulk(self, product, action, client=None, **extra):
        return (client or self.owner).request('/api/admin/products/bulk','POST',
            {'items':[{'id':product['id'],'revision':product['revision']}],'action':action,**extra})

    def current(self, key):
        return next(p for p in self.catalog()['products'] if p['id']==key)

    def test_01_seed_auth_and_no_private_leak(self):
        anon = Client(self.server)
        self.assertEqual(anon.request('/api/admin/catalog')[0],401)
        self.assertEqual(anon.request('/api/session')[1]['setupRequired'],False)
        self.assertEqual(anon.request('/api/setup','POST',{'username':'owner2','name':'Other','password':'Other-password-33'})[0],409)
        self.assertEqual(len(self.catalog()['products']),73)
        status,public = anon.request('/catalog-snapshot.json')
        self.assertEqual(status,200)
        self.assertEqual(len(public['products']),73)
        for field in ('users','sessions','audit','settings','brands'):
            self.assertNotIn(field,public)
        self.assertNotIn('revision',public['products'][0])
        self.assertEqual(anon.request('/admin-data/catalog.sqlite3')[0],404)
        self.assertEqual(anon.request('/assets/../admin-data/catalog.sqlite3')[0],404)
        self.assertEqual(anon.request('/admin/')[0],200)
        self.assertEqual(anon.request('/admin/admin.js')[0],200)
        with self.server.catalog.connect() as db:
            stored = db.execute('SELECT token FROM sessions WHERE user_id=(SELECT id FROM users WHERE username=?)',('testowner',)).fetchone()[0]
            self.assertEqual(stored,hashlib.sha256(self.owner.cookies['ep_admin'].encode()).hexdigest())
            password = db.execute('SELECT password FROM users WHERE username=?',('testowner',)).fetchone()[0]
            self.assertNotIn('Only-test-password',password)

    def test_02_csrf_origin_host_and_role(self):
        self.assertEqual(self.owner.request('/api/admin/products','POST',{}, {'X-CSRF-Token':'wrong'})[0],403)
        self.assertEqual(self.owner.request('/api/admin/products','POST',{}, {'Origin':'https://attacker.test'})[0],403)
        self.assertEqual(self.owner.request('/api/admin/catalog',headers={'Host':'attacker.test'})[0],403)
        self.assertEqual(self.editor.request('/api/admin/settings','PATCH',{'trashDays':60})[0],403)
        self.assertEqual(self.editor.request('/api/admin/export')[0],403)

    def test_03_crud_revision_history_and_status(self):
        p = self.create(status='draft',sku='EP-TEST',packageUnit='l',packages=[1,2.5],color='#123456',colorName={'uz':'Sinov','ru':'Тест','en':'Test'})
        self.assertFalse(any(r['id']==p['id'] for r in self.owner.request('/catalog-snapshot.json')[1]['products']))
        updated = {**p,'title':{'uz':'Yangilangan mahsulot','ru':'Обновлённый продукт','en':'Updated product'},'status':'published'}
        status,data = self.owner.request('/api/admin/products/'+p['id'],'PATCH',updated)
        self.assertEqual(status,200,data)
        self.assertEqual(data['product']['revision'],2)
        self.assertEqual(self.owner.request('/api/admin/products/'+p['id'],'PATCH',updated)[0],409)
        self.assertTrue(any(r['id']==p['id'] for r in self.owner.request('/catalog-snapshot.json')[1]['products']))
        history = self.owner.request('/api/admin/products/'+p['id']+'/history')[1]['history']
        self.assertEqual(len(history),1)
        status,_ = self.owner.request('/api/admin/products/'+p['id']+'/revision','POST',{'revision':2,'historyId':history[0]['id']})
        self.assertEqual(status,200)
        restored = self.current(p['id'])
        for field in ('title','description','image','packages','packageUnit','color','colorName','status'):
            self.assertEqual(restored[field],p[field],field)
        status,result = self.owner.request('/api/admin/products/'+p['id']+'/duplicate','POST',{})
        self.assertEqual(status,201)
        self.assertEqual(result['product']['status'],'draft')
        self.assertNotEqual(result['product']['id'],p['id'])

    def test_04_trash_retains_every_field_and_can_restore_after_expiry(self):
        p = self.create(status='published',packages=[2.5,25],color='#00AACC',colorName={'uz':'Ko‘k','ru':'Синий','en':'Blue'})
        self.assertEqual(self.bulk(p,'trash')[0],200)
        trashed = self.current(p['id'])
        self.assertTrue(trashed['deletedAt'])
        self.assertTrue(trashed['trashUntil'])
        for key in ('image','originalImage','packages','title','description','color','colorName','status','order','sku'):
            self.assertEqual(trashed[key],p[key],key)
        self.assertFalse(any(r['id']==p['id'] for r in self.owner.request('/catalog-snapshot.json')[1]['products']))
        self.assertEqual(self.owner.request('/api/admin/products/'+p['id'],'PATCH',trashed)[0],409)
        with self.server.catalog.transaction() as db:
            db.execute("UPDATE products SET trash_until='2000-01-01T00:00:00+00:00' WHERE id=?",(p['id'],))
        reopened = Catalogue(self.temp.name)
        persisted = next(r for r in reopened.snapshot(True)['products'] if r['id']==p['id'])
        self.assertEqual(persisted['image'],p['image'])
        self.assertTrue(persisted['deletedAt'])
        self.assertEqual(self.bulk(trashed,'restore')[0],200)
        restored = self.current(p['id'])
        self.assertIsNone(restored['deletedAt'])
        for key in ('image','originalImage','packages','title','description','color','colorName','status'):
            self.assertEqual(restored[key],p[key])

    def test_05_purge_requires_owner_confirmation_and_trash(self):
        p = self.create()
        self.assertEqual(self.bulk(p,'purge',confirm='O‘CHIRISH')[0],409)
        self.assertEqual(self.bulk(p,'trash')[0],200)
        p = self.current(p['id'])
        self.assertEqual(self.bulk(p,'purge',client=self.editor,confirm='O‘CHIRISH')[0],403)
        self.assertEqual(self.bulk(p,'purge',confirm='yes')[0],400)
        self.assertEqual(self.bulk(p,'purge',confirm='O‘CHIRISH')[0],200)
        self.assertFalse(any(r['id']==p['id'] for r in self.catalog()['products']))
        self.assertTrue(list((Path(self.temp.name)/'backups').glob('*.sqlite3')))

    def test_06_bulk_is_atomic_and_fk_protects_trash(self):
        p = self.create()
        before = self.current(p['id'])
        status,_ = self.owner.request('/api/admin/products/bulk','POST',{'items':[{'id':p['id'],'revision':p['revision']},{'id':'missing','revision':1}],'action':'trash'})
        self.assertEqual(status,404)
        self.assertEqual(self.current(p['id']),before)
        self.assertEqual(self.bulk(p,'trash')[0],200)
        self.assertEqual(self.owner.request('/api/admin/categories','DELETE',{'id':p['categoryId']})[0],409)
        self.assertEqual(self.owner.request('/api/admin/brands','DELETE',{'id':p['brandId']})[0],409)
        for endpoint,doc in [('/api/admin/brands',{'id':'new-brand','name':'New brand'}),('/api/admin/categories',{'id':'new-category','name':{'uz':'Yangi bo‘lim'}})]:
            self.assertEqual(self.owner.request(endpoint,'POST',doc)[0],200)
            self.assertEqual(self.owner.request(endpoint,'DELETE',{'id':doc['id']})[0],200)

    def test_07_upload_original_bytes_and_public_export(self):
        buffer = io.BytesIO()
        Image.new('RGB',(64,64),'white').save(buffer,format='PNG')
        raw = buffer.getvalue()
        status,data = self.owner.request('/api/admin/media','POST',{'name':'../label.png','base64':base64.b64encode(raw).decode()})
        self.assertEqual(status,201,data)
        path = data['media']['path']
        self.assertNotIn('..',path)
        self.assertEqual(self.owner.request('/'+path)[1],raw)
        self.assertEqual(self.owner.request('/api/admin/media','POST',{'name':'bad.svg','base64':base64.b64encode(b'<svg><script>alert(1)</script></svg>').decode()})[0],400)
        p = self.create(image=path,originalImage=path,status='published')
        out = Path(self.temp.name)/'public-test'
        result = export_preview(self.server.catalog,out)
        self.assertTrue((out/path).is_file())
        self.assertEqual((out/path).read_bytes(),raw)
        self.assertEqual(json.loads((out/'catalog-snapshot.json').read_text('utf-8')),result)
        self.assertNotIn('settings',result)
        self.assertEqual(self.bulk(p,'trash')[0],200)
        self.assertEqual(self.bulk(self.current(p['id']),'purge',confirm='O‘CHIRISH')[0],200)
        self.assertEqual(self.owner.request('/'+path)[1],raw)

    def test_08_validation_and_import_rollback(self):
        p = self.create()
        for changes in ({'brandId':{}},{'colorName':[]},{'image':'assets/../../bad.png'},{'packages':[-2]},{'status':'unknown'},{'title':{'uz':' '}},{'image':None,'status':'published'}):
            status,_ = self.owner.request('/api/admin/products/'+p['id'],'PATCH',{**p,**changes})
            self.assertEqual(status,400,changes)
        before = self.current(p['id'])
        imported = {'schemaVersion':1,'products':[{**p,'title':{'uz':'Should rollback'}},{**p,'id':'new-invalid-import','brandId':'missing'}]}
        self.assertEqual(self.owner.request('/api/admin/import','POST',{'catalog':imported,'confirm':'IMPORT'})[0],400)
        self.assertEqual(self.current(p['id']),before)
        self.assertEqual(self.owner.request('/api/admin/import','POST',{'catalog':{'schemaVersion':1,'products':[{**p,'id':'new-valid-import','status':'published'}]},'confirm':'IMPORT'})[0],200)
        self.assertEqual(self.current('new-valid-import')['status'],'draft')

    def test_09_rate_limit_and_password_revokes_session(self):
        anon = Client(self.server)
        anon.request('/api/session')
        for _ in range(6):
            self.assertEqual(anon.request('/api/login','POST',{'username':'wronguser','password':'wrong-password-33'})[0],401)
        self.assertEqual(anon.request('/api/login','POST',{'username':'wronguser','password':'wrong-password-33'})[0],429)
        self.assertEqual(self.editor.request('/api/admin/password','POST',{'current':'Editor-test-password-44','password':'Changed-password-55'})[0],200)
        self.assertEqual(self.editor.request('/api/admin/catalog')[0],401)


if __name__ == '__main__':
    unittest.main()
