# -*- coding: utf-8 -*-
import re, glob, os, json, urllib.request

LOGDIR = r'C:\Users\Administrator\.cpolar\logs'
CLOUD_TXT = r'D:\WTZ\prts\cloud.txt'
GITHUB_URL = 'https://wtz-YEE.github.io/cloud.txt'
pat = re.compile(r'\\"TunnelName\\":\\"guestbook\\".{0,300}?\\"Url\\":\\"http://([^"]+\.cpolar\.top)\\"')
u = ''

# 1. 搜所有日志(按修改时间从新到旧), 找 guestbook 隧道 Url
files = sorted(glob.glob(os.path.join(LOGDIR, 'cpolar_service.log*')),
               key=lambda p: os.path.getmtime(p), reverse=True)
for f in files:
    try:
        c = open(f, encoding='utf-8', errors='replace').read()
    except Exception:
        continue
    m = pat.search(c)
    if m:
        u = 'https://' + m.group(1)
        break

if not u:
    # 2. 找不到新地址 -> 回退旧 cloud.txt 并验证连通(200 沿用)
    old = ''
    try:
        old = open(CLOUD_TXT, encoding='utf-8').read().strip().split('\n')[0]
    except Exception:
        old = ''
    if old:
        try:
            urllib.request.urlopen(urllib.request.Request(old + '/guests', timeout=5))
            u = old
        except Exception:
            u = ''

# 3. 多主机合并：保留 GitHub 上其他主机的地址，更新/追加本机地址
lines = []
try:
    req = urllib.request.Request(GITHUB_URL + '?t=' + str(int(__import__('time').time() * 1000)), timeout=8)
    txt = urllib.request.urlopen(req, timeout=8).read().decode('utf-8', 'replace')
    lines = [x.strip() for x in txt.splitlines() if x.strip()]
except Exception:
    try:
        txt = open(CLOUD_TXT, encoding='utf-8').read()
        lines = [x.strip() for x in txt.splitlines() if x.strip()]
    except Exception:
        lines = []

if u:
    if u in lines:
        pass
    else:
        lines.append(u)

try:
    with open(CLOUD_TXT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + ('\n' if lines else ''))
except Exception:
    pass

print(u, end='')
