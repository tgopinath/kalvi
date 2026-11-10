# Search Wikimedia Commons (no key) for replacement photos and build a labelled contact sheet.
# Usage: python3 tools/commons-search.py tools/commons-queries.json  -> .work/cands.json + .work/cands-*.jpg
import json, ssl, sys, time, io, urllib.request, urllib.parse, urllib.error
from PIL import Image, ImageDraw
ssl._create_default_https_context = ssl._create_unverified_context
UA = {'User-Agent': 'Kalvi/0.1 (portfolio side project; github.com/tgopinath)'}
Q = json.load(open(sys.argv[1])); N = 6; out = {}
def get(url):
    for a in range(6):
        try: return urllib.request.urlopen(urllib.request.Request(url, headers=UA)).read()
        except urllib.error.HTTPError as e:
            if e.code != 429: raise
            time.sleep(15 * (a + 1))
    raise RuntimeError('rate limited: ' + url)
for key, q in Q.items():
    p = {'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6, 'gsrsearch': q + ' filetype:bitmap', 'gsrlimit': N,
         'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': 480}
    r = json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p))); time.sleep(2)
    cs = []
    for pg in sorted(r.get('query', {}).get('pages', {}).values(), key=lambda x: x.get('index', 0)):
        ii = pg['imageinfo'][0]; m = ii.get('extmetadata', {})
        import re
        artist = re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', '')).strip()[:60]
        cs.append({'file': pg['title'][5:], 'thumb': ii['thumburl'], 'page': ii['descriptionurl'], 'lic': m.get('LicenseShortName', {}).get('value', ''), 'artist': artist})
    out[key] = cs
json.dump(out, open('.work/cands.json', 'w'), indent=1)
keys = list(out); rows_per_sheet = 7; cw, ch = 200, 165
for s in range(0, len(keys), rows_per_sheet):
    ks = keys[s:s + rows_per_sheet]; sheet = Image.new('RGB', (N * cw + 90, len(ks) * ch), 'white'); d = ImageDraw.Draw(sheet)
    for row, k in enumerate(ks):
        d.text((4, row * ch + 70), k, fill='black')
        for i, c in enumerate(out[k]):
            try:
                time.sleep(0.6); im = Image.open(io.BytesIO(get(c['thumb']))).convert('RGB'); im.thumbnail((190, 140))
                sheet.paste(im, (90 + i * cw, row * ch + 4)); d.text((90 + i * cw, row * ch + 148), f"{k}:{i} {c['lic'][:14]}", fill='black')
            except Exception as e: d.text((90 + i * cw, row * ch + 60), 'ERR', fill='red')
    sheet.save(f'.work/cands-{s // rows_per_sheet}.jpg', quality=80)
print('ok', len(keys))
