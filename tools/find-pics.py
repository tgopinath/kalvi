# Fetch Wikipedia lead images for the vocabulary list and build a contact sheet to vet by eye.
# Usage: python3 tools/find-pics.py  -> .work/pics.json + .work/sheet-*.jpg
import json, ssl, urllib.request, urllib.parse, io, sys, time
from PIL import Image, ImageDraw
ssl._create_default_https_context = ssl._create_unverified_context   # local Python has no root certs
UA = {'User-Agent': 'Kalvi/0.1 (portfolio side project; contact via github.com/tgopinath)'}
W = json.load(open('tools/pic-titles.json'))
out = {}
# one batched MediaWiki query per 40 titles (the REST summary endpoint rate-limits quickly)
items = list(W.items()); found = {}
for s0 in range(0, len(items), 40):
    titles = '|'.join(t for _, t in items[s0:s0 + 40])
    q = {'action': 'query', 'format': 'json', 'redirects': 1, 'prop': 'pageimages', 'piprop': 'thumbnail|name', 'pithumbsize': 480, 'titles': titles}
    r = json.load(urllib.request.urlopen(urllib.request.Request('https://en.wikipedia.org/w/api.php?' + urllib.parse.urlencode(q), headers=UA)))
    red = {x['from']: x['to'] for x in r['query'].get('redirects', []) + r['query'].get('normalized', [])}
    time.sleep(1.5)
    for pg in r['query']['pages'].values(): found[pg['title']] = pg
    for k, v in red.items(): found.setdefault(k, None); found[k] = found.get(v) or found.get(red.get(v, ''), None)
for word, title in items:
    pg = found.get(title) or {}
    th = pg.get('thumbnail', {}).get('source')
    out[word] = {'title': pg.get('title', title), 'thumb': th, 'file': pg.get('pageimage'), 'page': 'https://en.wikipedia.org/wiki/' + urllib.parse.quote(pg.get('title', title).replace(' ', '_'))}
json.dump(out, open('.work/pics.json', 'w'), indent=1)
keys = list(out); per = 48
for s in range(0, len(keys), per):
    chunk = keys[s:s + per]; cols = 8; cw, ch = 200, 170
    sheet = Image.new('RGB', (cols * cw, ((len(chunk) + cols - 1) // cols) * ch), 'white'); d = ImageDraw.Draw(sheet)
    for i, k in enumerate(chunk):
        x, y = (i % cols) * cw, (i // cols) * ch
        src = out[k].get('thumb')
        if src:
            try:
                time.sleep(0.35); im = Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(src, headers=UA)).read())).convert('RGB'); im.thumbnail((190, 140)); sheet.paste(im, (x + 5, y + 5))
            except Exception as e: d.text((x + 5, y + 60), 'ERR', fill='red')
        else: d.text((x + 5, y + 60), 'NO IMAGE', fill='red')
        d.text((x + 5, y + 150), f"{s + i} {k}", fill='black')
    sheet.save(f'.work/sheet-{s // per}.jpg', quality=82)
print(len(out), 'words;', sum(1 for v in out.values() if v.get('thumb')), 'with images')
