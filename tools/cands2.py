# Like photo-cands.py but via curl with a browser-like User-Agent and backoff (Wikimedia rate-limits urllib).
# python3 tools/cands2.py queries.json sheetprefix [N]  → merges into .work/photo-cands.json, writes .work/<prefix>-N.jpg
import json, sys, time, io, re, subprocess, urllib.parse
from PIL import Image, ImageDraw
UA = 'Mozilla/5.0 (Macintosh) KalviBuild/0.1 (gopinath.t portfolio; github.com/tgopinath)'
def curl(url):
    for a in range(6):
        r = subprocess.run(['curl', '-s', '-m', '30', '-w', '\n%{http_code}', '-A', UA, url], capture_output=True)
        body, code = r.stdout.rsplit(b'\n', 1)
        if code == b'200': return body
        time.sleep(8 * (a + 1))
    return b''
def api(host, p): time.sleep(0.8); b = curl(f'https://{host}/w/api.php?' + urllib.parse.urlencode(p)); return json.loads(b) if b else {}
def meta(pages):
    out = []
    for pg in sorted(pages, key=lambda x: x.get('index', 0)):
        ii = (pg.get('imageinfo') or [{}])[0]; m = ii.get('extmetadata', {})
        if ii.get('thumburl'): out.append({'file': pg['title'].replace('File:', ''), 'thumb': ii['thumburl'], 'page': ii['descriptionurl'], 'lic': m.get('LicenseShortName', {}).get('value', ''), 'artist': re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', '')).strip()[:80]})
    return out
Q = json.load(open(sys.argv[1])); pre = sys.argv[2]; N = int(sys.argv[3]) if len(sys.argv) > 3 else 4
try: out = json.load(open('.work/photo-cands.json'))
except Exception: out = {}
for key, q in Q.items():
    if out.get(key): continue
    if q.startswith('wiki:'):
        r = api('en.wikipedia.org', {'action': 'query', 'format': 'json', 'redirects': 1, 'prop': 'pageimages', 'piprop': 'name', 'titles': q[5:]})
        names = [p.get('pageimage') for p in r.get('query', {}).get('pages', {}).values() if p.get('pageimage')]
        out[key] = meta(api('commons.wikimedia.org', {'action': 'query', 'format': 'json', 'titles': 'File:' + names[0], 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': 500}).get('query', {}).get('pages', {}).values()) if names else []
    else:
        r = api('commons.wikimedia.org', {'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6, 'gsrsearch': q[2:] + ' filetype:bitmap', 'gsrlimit': N, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': 500})
        out[key] = meta(r.get('query', {}).get('pages', {}).values())
    json.dump(out, open('.work/photo-cands.json', 'w'), indent=1)
keys = list(Q); per = 12; cw, ch = 170, 150
for s in range(0, len(keys), per):
    ks = keys[s:s + per]; sheet = Image.new('RGB', (100 + N * cw, len(ks) * ch), 'white'); d = ImageDraw.Draw(sheet)
    for row, k in enumerate(ks):
        d.text((4, row * ch + 60), k[:14], fill='black')
        for i, c in enumerate((out.get(k) or [])[:N]):
            b = curl(c['thumb'])
            try: im = Image.open(io.BytesIO(b)).convert('RGB'); im.thumbnail((165, 125)); sheet.paste(im, (100 + i * cw, row * ch + 3)); d.text((100 + i * cw, row * ch + 132), f"{i} {c['lic'][:16]}", fill='black')
            except Exception: d.text((100 + i * cw, row * ch + 60), 'ERR', fill='red')
            time.sleep(0.2)
    sheet.save(f'.work/{pre}-{s // per}.jpg', quality=72)
print('ok', [k for k in keys if not out.get(k)])
