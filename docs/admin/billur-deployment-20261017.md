# Billur production deployment · 2026-10-17

The production domain now serves the approved 2026 catalogue from the
`elementpaint-release-20261017` document root. The original document root,
`elementpaint-refresh-20261003`, remains intact for rollback. Its pre-deployment
copy is also stored outside the public web root in
`/var/www/vhosts/elementpaint.uz/elementpaint-backups-20261017/elementpaint-refresh-20261003/`.

The verified ZIP backup is `elementpaint-server-before-20261017.zip` in the
hosting account home directory. The local copy is
`D:/Codex/ElementPaint/server-release-20261017/elementpaint-server-before-20261017.zip`;
SHA-256: `6d5521850c224c6a0417df6b0bd1130c98054868795836f2e920b80cba0f7184`.

The live application and database are separate from the document root:

- Runtime and application: `/var/www/vhosts/elementpaint.uz/elementpaint-private-20261017/`
- Catalogue database and uploaded media: `.../elementpaint-private-20261017/data/`
- Public files: `/var/www/vhosts/elementpaint.uz/elementpaint-release-20261017/`
- Apache CGI gateway: `/admin/` and `/api/` are rewritten to the private Python WSGI adapter.

The existing owner login and password hash were retained. Previously open local
sessions were removed from the production copy. The first owner login expires
after two hours; the `__Host-` cookies are Secure, HttpOnly and SameSite=Strict.
New public account setup is disabled. The admin pages are served through the
gateway with `no-store`, a frame-denying policy and a restrictive content
security policy. Public API access to the database and private configuration
was checked and returned 404. An unauthenticated admin API request returned
401.

The site was checked at `https://elementpaint.uz/`; the `www` name and HTTP both
redirect to the canonical HTTPS domain. The existing certificate covers both
names and negotiates TLS 1.3. All 128 public runtime files in the prepared
release matched their local SHA-256 digests. The live catalogue returns 73
products, and all product image paths resolve in the public release.

## Rollback

In Plesk, open **Sites & Domains → Hosting Settings** and set the document root
back to `elementpaint-refresh-20261003`. The original directory was left in
place. The pre-deployment archive is an additional recovery copy. Restore its
contents into a separate folder first; do not extract it over the live release.

The first production database snapshot is in the private release package and
the local `production-final.zip`; neither archive belongs on GitHub Pages or in
the repository. The local package includes a preserved owner hash, so treat it
as private. Keep it on the protected D: drive.

No recurring hosting backup schedule was changed in Plesk. Save a fresh copy of
the private `data/` folder before a substantial catalogue import or other
administrative change, and test restoration in a separate folder.

## Source checks

The production adapter is `admin/wsgi.py`. Its contract tests use disposable
databases and run with:

```powershell
python -m unittest tests.test_wsgi_production
```

The production ZIP builder is `tools/package_production.py`; it copies only
approved public assets and stores the SQLite catalogue outside the web root.
The private Python 3.12 runtime package and production ZIP are release artifacts
kept outside the Git repository.
