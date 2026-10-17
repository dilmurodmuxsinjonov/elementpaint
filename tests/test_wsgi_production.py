"""Production gateway contracts without any public server or real user data."""
import copy
import io
import json
import tempfile
import unittest
from pathlib import Path
from admin.catalog import Catalogue, password_hash
from admin.wsgi import create_application


class Gateway(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.root=Path(self.temp.name)
        self.web=self.root/'public';self.web.mkdir()
        self.catalog=Catalogue(self.root/'data')
        with self.catalog.transaction() as db:
            db.execute('INSERT INTO users VALUES(?,?,?,?,?,1)',('owner','owner','Owner',password_hash('Test-gateway-password-42'),'owner'))
        self.config={'origin':'https://elementpaint.example.test','data_directory':str(self.root/'data'),'web_directory':str(self.web)}
        self.app=create_application(self.config)
        self.cookies={};self.csrf=''

    def tearDown(self):
        self.temp.cleanup()

    def request(self,path,method='GET',data=None,**changes):
        raw=b'' if data is None else json.dumps(data).encode()
        env={'REQUEST_METHOD':method,'PATH_INFO':path,'QUERY_STRING':'',
            'HTTP_HOST':'elementpaint.example.test','HTTP_ORIGIN':self.config['origin'],
            'HTTP_X_CSRF_TOKEN':self.csrf,'HTTP_COOKIE':'; '.join(k+'='+v for k,v in self.cookies.items()),
            'CONTENT_TYPE':'application/json','CONTENT_LENGTH':str(len(raw)),
            'REMOTE_ADDR':'192.0.2.10','wsgi.url_scheme':'https','wsgi.input':io.BytesIO(raw)}
        env.update(changes);result={}
        def start(status,headers):result.update(status=int(status.split()[0]),headers=dict(headers))
        body=b''.join(self.app(env,start))
        cookie=result['headers'].get('Set-Cookie')
        if cookie:
            name,value=cookie.split(';')[0].split('=',1);self.cookies[name]=value
        result['body']=json.loads(body) if result['headers'].get('Content-Type','').startswith('application/json') else body
        if isinstance(result['body'],dict) and result['body'].get('csrf'):self.csrf=result['body']['csrf']
        return result

    def login(self):
        self.request('/api/session')
        r=self.request('/api/login','POST',{'username':'owner','password':'Test-gateway-password-42'})
        self.assertEqual(r['status'],200)
        return r

    def test_private_config_requires_existing_owner_and_https(self):
        with self.assertRaises(ValueError):create_application({**self.config,'origin':'http://example.test'})
        with self.assertRaises(ValueError):create_application({**self.config,'data_directory':str(self.web)})
        with self.assertRaises(ValueError):create_application({**self.config,'origin':'https://example.test/path'})

    def test_admin_shell_uses_security_headers_and_no_cache(self):
        r=self.request('/admin/')
        self.assertEqual(r['status'],200)
        self.assertEqual(r['headers']['Cache-Control'],'no-store')
        self.assertEqual(r['headers']['X-Frame-Options'],'DENY')
        self.assertIn("frame-ancestors 'none'",r['headers']['Content-Security-Policy'])
        self.assertEqual(self.request('/admin/','POST',{})['status'],405)

    def test_login_host_origin_secure_cookies_and_disabled_setup(self):
        r=self.request('/api/session')
        self.assertEqual(r['body']['deployment'],'production')
        self.assertFalse(r['body']['setupRequired'])
        self.assertIn('__Host-ep_preauth=',r['headers']['Set-Cookie'])
        self.assertIn('; Secure',r['headers']['Set-Cookie'])
        self.assertEqual(self.request('/api/setup','POST',{})['status'],403)
        self.assertEqual(self.request('/api/admin/catalog')['status'],401)
        self.assertEqual(self.request('/api/session',HTTP_HOST='wrong.example')['status'],403)
        self.assertEqual(self.request('/api/login','POST',{},HTTP_ORIGIN='https://attacker.test')['status'],403)
        r=self.login()
        self.assertIn('__Host-ep_admin=',r['headers']['Set-Cookie'])
        self.assertIn('HttpOnly; SameSite=Strict; Secure',r['headers']['Set-Cookie'])
        self.assertEqual(self.request('/api/admin/catalog')['status'],200)
        self.assertEqual(self.request('/api/admin/export-preview','POST',{})['status'],409)
        self.assertEqual(self.request('/api/session',**{'wsgi.url_scheme':'http'})['status'],403)
        self.assertEqual(self.request('/api/logout','POST',{})['status'],200)
        self.assertEqual(self.request('/api/admin/catalog')['status'],401)

    def test_public_catalogue_and_no_private_file_routes(self):
        r=self.request('/catalog-snapshot.json')
        self.assertEqual(r['status'],200);self.assertEqual(len(r['body']['products']),73)
        self.assertNotIn('settings',r['body'])
        for path in ('/admin-data/catalog.sqlite3','/.env','/config.json','/api/gateway.cgi','/assets/admin-media/../../data/catalog.sqlite3'):
            self.assertIn(self.request(path)['status'],(401,404))
        self.assertEqual(self.request('/catalog-snapshot.json','POST',{})['status'],405)

    def test_uploaded_draft_media_is_private_then_published(self):
        from PIL import Image
        import base64
        self.login();buffer=io.BytesIO();Image.new('RGB',(32,32),'white').save(buffer,format='PNG')
        raw=buffer.getvalue()
        upload=self.request('/api/admin/media','POST',{'name':'test.png','base64':base64.b64encode(raw).decode()})
        self.assertEqual(upload['status'],201)
        path=upload['body']['media']['path']
        self.assertEqual(self.request('/'+path)['body'],raw)
        saved=self.cookies.copy();self.cookies={}
        self.assertEqual(self.request('/'+path)['status'],404)
        self.cookies=saved
        seed=json.loads((Path(__file__).resolve().parent.parent/'admin/seed.json').read_text('utf-8'))['products'][0]
        p={**seed,'aliases':[],'image':path,'originalImage':path,'status':'published'}
        self.assertEqual(self.request('/api/admin/products','POST',p)['status'],201)
        self.cookies={};self.assertEqual(self.request('/'+path)['body'],raw)


if __name__=='__main__':unittest.main()
