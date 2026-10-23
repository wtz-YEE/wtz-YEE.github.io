# -*- coding: utf-8 -*-
import re, glob, os, json, time, subprocess, urllib.request, urllib.error

LOGDIR = os.path.join(os.path.expanduser('~'), '.cpolar', 'logs')
CLOUD_TXT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'cloud.txt')
W37_REPO = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '37web', 'cloud-url.txt')
W37_LOCAL = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '37web', 'cloud-url.txt')
GITHUB_URL = 'https://wtz-YEE.github.io/cloud.txt'

def scan_tunnel(name):
    pat = re.compile(r'\\"TunnelName\\":\\"' + name + r'\\".{0,300}?\\"Url\\":\\"http://([^"]+\.cpolar\.(?:top|cn))\\"')
    pat2 = re.compile(r'https://([0-9a-z]+\.r\d+\.cpolar\.(?:top|cn))')
    files = sorted(glob.glob(os.path.join(LOGDIR, 'cpolar_*.log*')),
                   key=lambda p: os.path.getmtime(p), reverse=True)
    for f in files:
        try:
            c = open(f, encoding='utf-8', errors='replace').read()
        except Exception:
            continue
        if name in os.path.basename(f):
            ms = pat2.findall(c)
            if ms:
                return 'https://' + ms[-1]
    for f in files:
        try:
            c = open(f, encoding='utf-8', errors='replace').read()
        except Exception:
            continue
        m = pat.search(c)
        if m:
            return 'https://' + m.group(1)
    return ''

def probe(u, path='/health'):
    try:
        urllib.request.urlopen(urllib.request.Request(u + path, timeout=5))
        return True
    except Exception:
        return False

u = scan_tunnel('guestbook')
w = scan_tunnel('web37')

if not u:
    old = ''
    try:
        old = open(CLOUD_TXT, encoding='utf-8').read().strip().split('\n')[0]
    except Exception:
        old = ''
    if old and probe(old, '/guests'):
        u = old

lines = []
try:
    req = urllib.request.Request(GITHUB_URL + '?t=' + str(int(time.time() * 1000)), timeout=8)
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

# 37web: sync cloud-url.txt (repo copy + local run copy, no BOM)
if w:
    for p in (W37_REPO, W37_LOCAL):
        try:
            with open(p, 'wb') as f:
                f.write(w.encode('utf-8'))
        except Exception:
            pass

    # push online 37web/cloud-url.txt via GitHub API
    try:
        tf = os.path.join(os.path.dirname(os.path.abspath(__file__)), '_ci_' + str(int(time.time() * 1000)) + '.txt')
        with open(tf, 'w', encoding='ascii') as f:
            f.write('protocol=https\nhost=github.com\n\n')
        try:
            cred = subprocess.run(['cmd', '/c', 'git credential fill < ' + tf], capture_output=True, text=True, timeout=20)
            tok = ''
            for line in (cred.stdout or '').splitlines():
                if line.startswith('password='):
                    tok = line[len('password='):]
                    break
        finally:
            try:
                os.remove(tf)
            except Exception:
                pass
        if tok:
            import base64
            H = {'Authorization': 'token ' + tok, 'User-Agent': 'wtz', 'Content-Type': 'application/json'}
            api = 'https://api.github.com/repos/wtz-YEE/wtz-YEE.github.io/contents/37web/cloud-url.txt'
            sha = None
            try:
                m = json.loads(urllib.request.urlopen(urllib.request.Request(api, headers=H), timeout=60).read().decode('utf-8'))
                sha = m.get('sha')
            except Exception:
                pass
            b64 = base64.b64encode(w.encode('utf-8')).decode('ascii')
            body = {'message': 'cloud: update 37web url', 'content': b64}
            if sha:
                body['sha'] = sha
            req = urllib.request.Request(api, data=json.dumps(body).encode('utf-8'), headers=H, method='PUT')
            urllib.request.urlopen(req, timeout=120)
    except Exception:
        pass

print('guestbook=' + (u or 'NONE') + ' web37=' + (w or 'NONE'))
