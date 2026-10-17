"""Apache CGI/WSGI adapter: no development HTTP server or open application port.

The public gateway imports this application from outside the document root.
The web server owns request parsing, TLS, concurrency and request time limits.
"""
import io
import json
import os
import re
from email.message import Message
from pathlib import Path
from types import SimpleNamespace
from urllib.parse import unquote, urlsplit

from .catalog import Catalogue
from .server import Handler


class WebRequest(Handler):
    def __init__(self, server, environ):
        self.server = server
        self.command = environ.get('REQUEST_METHOD', 'GET')
        self.path = environ.get('PATH_INFO', '') or '/'
        if environ.get('QUERY_STRING'):
            self.path += '?' + environ['QUERY_STRING']
        self.headers = Message()
        for key, value in environ.items():
            if key.startswith('HTTP_'):
                self.headers[key[5:].replace('_','-')] = str(value)
        for key in ('CONTENT_LENGTH', 'CONTENT_TYPE'):
            if environ.get(key):
                self.headers[key.replace('_','-')] = str(environ[key])
        self.client_address = (environ.get('REMOTE_ADDR','unknown'), 0)
        self.rfile = environ['wsgi.input']
        self.wfile = io.BytesIO()
        self.status = 500
        self.response_headers = []

    def send_response(self, status, message=None):
        self.status = status
        self.response_headers = []

    def send_header(self, key, value):
        self.response_headers.append((str(key),str(value)))

    def end_headers(self):
        pass

    def log_message(self, *_):
        pass

    def static(self, path):
        if path in ('/admin','/admin/','/admin/admin.js','/admin/admin.css'):
            super().static(path)
            return
        # Uploaded files stay outside the web root. Only currently published
        # images can be read anonymously; editors can still preview draft media.
        if not re.fullmatch(r'/assets/admin-media/[a-f0-9]{32}\.(png|jpg|webp)',path):
            self.send(404,{'error':'Fayl topilmadi.'})
            return
        relative = path.lstrip('/')
        if not self.session(False):
            published = self.server.catalog.snapshot()['products']
            if not any(relative in (p.get('image'),p.get('originalImage')) for p in published):
                self.send(404,{'error':'Fayl topilmadi.'})
                return
        super().static(path)


def create_application(config):
    origin = config['origin'].rstrip('/')
    parsed = urlsplit(origin)
    if parsed.scheme!='https' or not parsed.hostname or parsed.username or parsed.password or parsed.path or parsed.query or parsed.fragment:
        raise ValueError('Production requires a canonical HTTPS origin')
    data = Path(config['data_directory']).resolve(strict=True)
    web = Path(config['web_directory']).resolve(strict=True)
    if data.is_relative_to(web) or not (data/'catalog.sqlite3').is_file():
        raise ValueError('An existing private database outside the web root is required')
    os.umask(0o077)
    catalog = Catalogue(data, web_directory=web)
    with catalog.connect() as db:
        if not db.execute("SELECT 1 FROM users WHERE active=1 AND role='owner'").fetchone():
            raise ValueError('Provision the owner before enabling the public gateway')
    server = SimpleNamespace(catalog=catalog, origin=origin, secure=True,
        server_port=parsed.port or 443, production=True, session_cookie='__Host-ep_admin',
        preauth_cookie='__Host-ep_preauth', session_seconds=2*3600)

    def application(environ, start_response):
        request = WebRequest(server, environ)
        if environ.get('wsgi.url_scheme')!='https':
            request.send(403,{'error':'Faqat himoyalangan HTTPS ulanishidan foydalaning.'})
        else:
            path=unquote(urlsplit(request.path).path)
            if path.startswith(('/api/','/assets/admin-media/','/admin/')) or path in ('/catalog-snapshot.json','/admin'):
                request.dispatch()
            else:
                request.send(404,{'error':'Sahifa topilmadi.'})
        from http import HTTPStatus
        start_response(f'{request.status} {HTTPStatus(request.status).phrase}',request.response_headers)
        return [request.wfile.getvalue()]

    application.catalog = catalog
    return application


def from_config(path):
    """Configuration is a private local file, never request input or URL data."""
    return create_application(json.loads(Path(path).read_text(encoding='utf-8')))
