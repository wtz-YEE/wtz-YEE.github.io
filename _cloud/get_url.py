# -*- coding: utf-8 -*-
import re, glob, os, json, time, base64, subprocess, sys, urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)
LOGDIR = os.path.join(os.path.expanduser('~'), '.cpolar', 'logs')
CFG = os.path.join(BASE, 'cloud_services.json')

def load_cfg():
    return json.load(open(CFG, encoding='utf-8'))

def scan_tunnel(name):
    pat = re.compile(r'\\"TunnelName\\":\\"' + name + r'\\".{0,300}?\\"Url\\":\\"http://([^"]+\.cpolar\.(?:top|cn))\\"')
    pat2 = re.compile(r'https://([0-9a-z]+\.r\d+\.cpolar\.(?:top|cn))')
    files = sorted(glob.glob(os.path.join(LOGDIR, 'cpolar_*.log*')),
                   key=lambda p: os.path.getmtime(p), reverse=True)
    for f in files:
        if name in os.path.basename(f):
            try:
                c = open(f, encoding='utf-8', errors='replace').read()
            except Exception:
                continue
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

def probe(u, path):
    try:
        urllib.request.urlopen(urllib.request.Request(u + path, timeout=5))
        return True
    except Exception:
        return False

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
        try:
            m = json.loads(urllib.request.urlopen(urllib.request.Request(api, headers=H), timeout=60).read().decode('utf-8'))
            sha = m.get('sha')
        except Exception:
            pass
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
    res = []
    for svc in cfg:
        if not svc.get('enabled', True):
            continue
        u = scan_tunnel(svc['tunnel'])
        if not u:
            af = os.path.join(REPO, svc['addrfile'])
            old = ''
            try:
                old = open(af, encoding='utf-8').read().strip().split('\n')[0]
            except Exception:
                old = ''
            if old and probe(old, svc.get('health', '/health')):
                u = old
        if u:
            af = os.path.join(REPO, svc['addrfile'])
            lines = []
            try:
                txt = open(af, encoding='utf-8').read()
                lines = [x.strip() for x in txt.splitlines() if x.strip()]
            except Exception:
                pass
            if u not in lines:
                lines.append(u)
            try:
                with open(af, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(lines) + ('\n' if lines else ''))
            except Exception:
                pass
            if svc.get('push') and '--scan-only' not in sys.argv:
                push_github(svc.get('remote_file', svc['addrfile']), '\n'.join(lines))
        res.append(svc['name'] + '=' + (u or 'NONE'))
    print(' '.join(res), flush=True)

if __name__ == '__main__':
    main()
