# -*- coding: utf-8 -*-
import re, glob, os, json, time, base64, subprocess, sys, urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import paths
REPO = os.path.dirname(BASE)
LOGDIR = os.path.join(os.path.expanduser('~'), '.cpolar', 'logs')
CFG = os.path.join(BASE, 'cloud_services.json')

def load_cfg():
    return json.load(open(CFG, encoding='utf-8'))

def tail_text(p, n=400000):
    try:
        with open(p, 'rb') as f:
            f.seek(0, 2)
            size = f.tell()
            f.seek(max(0, size - n))
            return f.read().decode('utf-8', 'replace')
    except Exception:
        return ''

def recent_urls(name, limit=8):
    files = sorted(glob.glob(os.path.join(LOGDIR, 'cpolar_*.log*')),
                   key=lambda p: os.path.getmtime(p), reverse=True)
    mine = [f for f in files if name in os.path.basename(f)]
    urls = []
    for f in mine[:2]:
        c = tail_text(f)
        for u in re.findall(r'https://[0-9a-z]+\.r\d+\.cpolar\.(?:top|cn)', c):
            if u not in urls:
                urls.append(u)
    return urls[-limit:][::-1]

def scan_tunnel(name):
    urls = recent_urls(name)
    return urls[0] if urls else ''

def pick_url(svc):
    urls = recent_urls(svc['tunnel'])
    af = paths.addrfile(svc.get('addrfile', ''))
    try:
        for x in open(af, encoding='utf-8').read().splitlines():
            x = x.strip()
            if x.startswith('http') and x not in urls:
                urls.append(x)
    except Exception:
        pass
    urls = urls[:6]
    for u in urls:
        if probe(u, svc.get('health', '/health')):
            return u
    return urls[0] if urls else ''

def probe(u, path):
    try:
        urllib.request.urlopen(u + path, timeout=5)
        return True
    except Exception:
        return False

def read_text(p):
    try:
        return open(p, encoding='utf-8').read()
    except Exception:
        return ''

def push_github(remote_file, content):
    try:
        tf = os.path.join(BASE, '_ci_' + str(int(time.time() * 1000)) + '.txt')
        with open(tf, 'w', encoding='ascii') as f:
            f.write('protocol=https\nhost=github.com\n\n')
        try:
            cred = subprocess.run(['cmd', '/c', 'git credential fill < ' + tf],
                                  capture_output=True, text=True, timeout=20)
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
        if not tok:
            return
        H = {'Authorization': 'token ' + tok, 'User-Agent': 'wtz', 'Content-Type': 'application/json'}
        api = 'https://api.github.com/repos/wtz-YEE/wtz-YEE.github.io/contents/' + remote_file
        sha = None
        remote = ''
        try:
            m = json.loads(urllib.request.urlopen(urllib.request.Request(api, headers=H), timeout=60).read().decode('utf-8'))
            sha = m.get('sha')
            remote = base64.b64decode((m.get('content') or '').replace('\n', '')).decode('utf-8', 'replace')
        except Exception:
            pass
        if remote.strip() == content.strip():
            return
        body = {'message': 'cloud: update ' + remote_file,
                'content': base64.b64encode(content.encode('utf-8')).decode('ascii')}
        if sha:
            body['sha'] = sha
        req = urllib.request.Request(api, data=json.dumps(body).encode('utf-8'), headers=H, method='PUT')
        urllib.request.urlopen(req, timeout=120)
    except Exception:
        pass

def main():
    cfg = load_cfg()
    scan_only = '--scan-only' in sys.argv
    res = []
    for svc in cfg:
        if not svc.get('enabled', True):
            continue
        u = pick_url(svc)
        if u and not scan_only:
            af = paths.addrfile(svc['addrfile'])
            if read_text(af).strip() != u.strip():
                try:
                    with open(af, 'w', encoding='utf-8') as f:
                        f.write(u + '\n')
                except Exception:
                    pass
            if svc.get('push'):
                push_github(svc.get('remote_file', svc['addrfile']), u + '\n')
        res.append(svc['name'] + '=' + (u or 'NONE'))
    print(' '.join(res), flush=True)

if __name__ == '__main__':
    main()
