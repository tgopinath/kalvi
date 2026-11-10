# Candidate photos for the shared photo set. Input: tools/photo-queries.json {key: "wiki:Title" | "q:commons search"}.
# Output: .work/photo-cands.json and labelled contact sheets .work/photo-sheet-N.jpg to vet by eye.
import json, ssl, sys, time, io, re, urllib.request, urllib.parse, urllib.error
from PIL import Image, ImageDraw
ssl._create_default_https_context = ssl._create_unverified_context
UA = {'User-Agent': 'Kalvi/0.1 (portfolio side project; github.com/tgopinath)'}
def get(url):
    for a in range(8):
        try: return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()
        except urllib.error.HTTPError as e:
            if e.code != 429: raise
            time.sleep(20 * (a + 1))
    raise RuntimeError('rate limited')
def api(host, p): time.sleep(1.2); return json.loads(get(f'https://{host}/w/api.php?' + urllib.parse.urlencode(p)))
def meta(pages):
    out = []
    for pg in sorted(pages, key=lambda x: x.get('index', 0)):
        ii = (pg.get('imageinfo') or [{}])[0]; m = ii.get('extmetadata', {})
        if not ii.get('thumburl'): continue
        out.append({'file': pg['title'].replace('File:', ''), 'thumb': ii['thumburl'], 'page': ii['descriptionurl'], 'lic': m.get('LicenseShortName', {}).get('value', ''), 'artist': re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', '')).strip()[:80]})
    return out
Q = json.load(open(sys.argv[1])); N = int(sys.argv[2]) if len(sys.argv) > 2 else 4
try: out = json.load(open('.work/photo-cands.json'))
except Exception: out = {}
for key, q in Q.items():
    if key in out and out[key]: continue
    try:
        if q.startswith('wiki:'):
            r = api('en.wikipedia.org', {'action': 'query', 'format': 'json', 'redirects': 1, 'prop': 'pageimages', 'piprop': 'name', 'titles': q[5:]})
            names = [p.get('pageimage') for p in r['query']['pages'].values() if p.get('pageimage')]
            if not names: out[key] = []; continue
            r = api('commons.wikimedia.org', {'action': 'query', 'format': 'json', 'titles': 'File:' + names[0], 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': 640})
            out[key] = meta(r['query']['pages'].values())
        else:
            r = api('commons.wikimedia.org', {'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6, 'gsrsearch': q[2:] + ' filetype:bitmap', 'gsrlimit': N, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': 640})
            out[key] = meta(r.get('query', {}).get('pages', {}).values())
    except Exception as e: print('ERR', key, e); out[key] = []
    json.dump(out, open('.work/photo-cands.json', 'w'), indent=1)
# sheets: one row per key (up to N candidates)
keys = [k for k in Q if out.get(k)]; per = 8; cw, ch = 170, 150
for s in range(0, len(keys), per):
    ks = keys[s:s + per]; sheet = Image.new('RGB', (100 + N * cw, len(ks) * ch), 'white'); d = ImageDraw.Draw(sheet)
    for row, k in enumerate(ks):
        d.text((4, row * ch + 60), k[:14], fill='black')
        for i, c in enumerate(out[k][:N]):
            try:
                time.sleep(0.5); im = Image.open(io.BytesIO(get(c['thumb']))).convert('RGB'); im.thumbnail((165, 125)); sheet.paste(im, (100 + i * cw, row * ch + 3)); d.text((100 + i * cw, row * ch + 132), f"{i} {c['lic'][:16]}", fill='black')
            except Exception as e: d.text((100 + i * cw, row * ch + 60), 'ERR', fill='red')
    sheet.save(f'.work/photo-sheet-{s // per}.jpg', quality=78)
print('ok', len(keys), 'keys with candidates;', [k for k in Q if not out.get(k)], 'empty')
