import urllib.request
import re

html = urllib.request.urlopen('https://instant-virtuals-sporty.netlify.app').read().decode()
assets = re.findall(r'src="(/assets/[^"]+)"', html)
print('Assets:', assets)

if assets:
    js_url = 'https://instant-virtuals-sporty.netlify.app' + assets[0]
    js = urllib.request.urlopen(js_url).read().decode()
    matches = re.findall(r'(\b\w+\.png|\b\w+\.jpg)', js)
    print('Images in bundle:', set(matches))
