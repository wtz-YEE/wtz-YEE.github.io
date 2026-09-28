# -*- coding: utf-8 -*-
# PRTS assets 恢复：复制 17 张 + URL 重下 31 张
import os, io, shutil, urllib.request, ssl, json

DST = r'D:\WTZ\noida\37ed\prts\assets'
os.makedirs(DST, exist_ok=True)

COPY = {
 'amiya.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\prts\assets\amiya.jpg',
 'chen.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\prts\assets\chen.jpg',
 'exusiai.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\prts\assets\exusiai.jpg',
 'eyjafjalla.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\prts\assets\eyjafjalla.jpg',
 'kaltsit.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\prts\assets\kaltsit.jpg',
 'lappland.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\prts\assets\lappland.jpg',
 'saria.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\prts\assets\saria.jpg',
 'silverash.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\prts\assets\silverash.jpg',
 'texas.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\prts\assets\texas.jpg',
 'w.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\prts\assets\w.jpg',
 'silence.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\assets\silence.jpg',
 'ptilopsis.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\assets\ptilopsis.jpg',
 'ifrit.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\assets\ifrit.jpg',
 'mayer.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\assets\mayer.jpg',
 'magallan.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\assets\magallan.jpg',
 'dorothy.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\assets\dorothy.jpg',
 'muelsyse.jpg': r'C:\Users\Administrator\Doubao\chats\2026-09-26\new-chat-2\assets\muelsyse.jpg',
}

URLS = {
 'xingxiong.jpg': 'https://aka.doubaocdn.com/s/4uKGdVqy6v',
 'surtr.jpg': 'https://aka.doubaocdn.com/s/zNYMOh6zci',
 'mudrock.jpg': 'https://aka.doubaocdn.com/s/SaFdUNZLzd',
 'nearl.jpg': 'https://aka.doubaocdn.com/s/6IjuY3nUct',
 'mannenna.jpg': 'https://aka.doubaocdn.com/s/5tPZ4cYciR',
 'specter.jpg': 'https://aka.doubaocdn.com/s/MS69xRkivH',
 'skadi.jpg': 'https://aka.doubaocdn.com/s/A3QMUvDpFs',
 'shining.jpg': 'https://aka.doubaocdn.com/s/faEWxgbJ0j',
 'nightingale.jpg': 'https://aka.doubaocdn.com/s/UmidrXIr38',
 'nearl2.jpg': 'https://aka.doubaocdn.com/s/4o4Nz4rxwV',
 'jessica.jpg': 'https://aka.doubaocdn.com/s/HixoKAnsG7',
 'razer.jpg': 'https://aka.doubaocdn.com/s/a2cLkxiNiX',
 'franka.jpg': 'https://aka.doubaocdn.com/s/4U08qWmaDU',
 'croissant.jpg': 'https://aka.doubaocdn.com/s/QFfw7Pg6Il',
 'sora.jpg': 'https://aka.doubaocdn.com/s/dIzBeLGv3a',
 'swire.jpg': 'https://aka.doubaocdn.com/s/fOEVjXr99W',
 'zima.jpg': 'https://aka.doubaocdn.com/s/qvml3aXD7G',
 'istina.jpg': 'https://aka.doubaocdn.com/s/B4z5lyK3Op',
 'rosa.jpg': 'https://aka.doubaocdn.com/s/dDUIunRRnA',
 'gummy.jpg': 'https://aka.doubaocdn.com/s/kGc58sN1Qj',
 'reed.jpg': 'https://aka.doubaocdn.com/s/8U66EZ7nUM',
 'goldenglow.jpg': 'https://aka.doubaocdn.com/s/S4uSUOZgmZ',
 'ling.jpg': 'https://aka.doubaocdn.com/s/igVLHFgukJ',
 'dusk.jpg': 'https://aka.doubaocdn.com/s/l93Uav8oqf',
 'nian.jpg': 'https://aka.doubaocdn.com/s/KZAnGSYegG',
 'mizuki.jpg': 'https://aka.doubaocdn.com/s/bBu9dasEK4',
 'gladiaa.jpg': 'https://aka.doubaocdn.com/s/hvUXRfeIwd',
 'siege.jpg': 'https://aka.doubaocdn.com/s/I3dmiOUSIu',
 'horn.jpg': 'https://aka.doubaocdn.com/s/urPIqVLCP3',
 'bagpipe.jpg': 'https://aka.doubaocdn.com/s/w3LJuVUnOJ',
 'hellagur.jpg': 'https://aka.doubaocdn.com/s/SfqR2II0E9',
}

ctx = ssl.create_default_context()
hdr = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'}

ok = fail = 0
for name, src in COPY.items():
    dst = os.path.join(DST, name)
    if os.path.exists(dst) and os.path.getsize(dst) > 4000:
        ok += 1; continue
    try:
        shutil.copyfile(src, dst)
        print('COPY', name, os.path.getsize(dst)); ok += 1
    except Exception as e:
        print('COPY-FAIL', name, e); fail += 1

for name, url in URLS.items():
    dst = os.path.join(DST, name)
    if os.path.exists(dst) and os.path.getsize(dst) > 4000:
        ok += 1; continue
    try:
        req = urllib.request.Request(url, headers=hdr)
        data = urllib.request.urlopen(req, timeout=30, context=ctx).read()
        if len(data) < 3000:
            print('URL-SMALL', name, len(data)); fail += 1; continue
        with open(dst, 'wb') as f:
            f.write(data)
        print('URL', name, len(data)); ok += 1
    except Exception as e:
        print('URL-FAIL', name, e); fail += 1

print('=== ok:', ok, 'fail:', fail)
