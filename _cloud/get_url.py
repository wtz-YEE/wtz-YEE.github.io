# -*- coding: utf-8 -*-
import re, glob, os, json, urllib.request

LOGDIR = os.path.join(os.path.expanduser('~'), '.cpolar', 'logs')
CLOUD_TXT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'cloud.txt')
GITHUB_URL = 'https://wtz-YEE.github.io/cloud.txt'
pat = re.compile(r'\\"TunnelName\\":\\"guestbook\\".{0,300}?\\"Url\\":\\"http://([^"]+\.cpolar\.top)\\"')
u = ''

# 1. scan all logs (newest first), find guestbook tunnel Url
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
    if u not in lines:
        lines.append(u)

try:
    with open(CLOUD_TXT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + ('\n' if lines else ''))
except Exception:
    pass

print(u, end='')
