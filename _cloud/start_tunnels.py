# -*- coding: utf-8 -*-
import subprocess, os, time, shutil, json, re, glob, urllib.request

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

def tunnels_alive(cfg):
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
        if not u:
            return False
    return True

def main():
    cfg = load_cfg()
    if tunnels_alive(cfg):
        print('ALIVE_SKIP', flush=True)
        return 0
    try:
        os.makedirs(LOGDIR, exist_ok=True)
    except Exception:
        pass
    cp = shutil.which('cpolar')
    if not cp:
        print('NO_CPOLAR', flush=True)
        return 1
    subprocess.run(['taskkill', '/f', '/im', 'cpolar.exe'], capture_output=True)
    time.sleep(2)
    for svc in cfg:
        if not svc.get('enabled', True):
            continue
        name = svc['tunnel']
        p = os.path.join(LOGDIR, 'cpolar_' + name + '.log')
        kw = {}
        try:
            f = open(p, 'a', encoding='utf-8', buffering=1)
            kw = {'stdout': f, 'stderr': subprocess.STDOUT}
        except Exception:
            pass
        subprocess.Popen([cp, 'start', name, '-log', 'stdout'], **kw,
                         creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
        print('started', name, flush=True)
        time.sleep(1)
    print('STARTED_ALL', flush=True)
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
