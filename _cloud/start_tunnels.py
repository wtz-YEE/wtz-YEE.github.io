# -*- coding: utf-8 -*-
import subprocess, os, time, shutil, json, re, glob, urllib.request, sys

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

def scan_tunnel(name):
    files = sorted(glob.glob(os.path.join(LOGDIR, 'cpolar_*.log*')),
                   key=lambda p: os.path.getmtime(p), reverse=True)
    mine = [f for f in files if name in os.path.basename(f)]
    for f in mine[:2]:
        ms = re.findall(r'https://[0-9a-z]+\.r\d+\.cpolar\.(?:top|cn)', tail_text(f))
        if ms:
            return ms[-1]
    return ''

def probe(u, path):
    try:
        urllib.request.urlopen(u + path, timeout=5)
        return True
    except Exception:
        return False

def tunnels_alive(cfg):
    for svc in cfg:
        if not svc.get('enabled', True):
            continue
        cands = []
        u = scan_tunnel(svc['tunnel'])
        if u:
            cands.append(u)
        af = paths.addrfile(svc['addrfile'])
        try:
            for x in open(af, encoding='utf-8').read().splitlines():
                x = x.strip()
                if x.startswith('http') and x not in cands:
                    cands.append(x)
        except Exception:
            pass
        if not cands:
            return False
        ok = False
        for x in cands[:4]:
            if probe(x, svc.get('health', '/health')):
                ok = True
                break
        if not ok:
            return False
    return True

def main():
    cfg = load_cfg()
    force = '--force' in sys.argv
    if not force and tunnels_alive(cfg):
        print('ALIVE_SKIP', flush=True)
        return 0
    if force:
        print('FORCE_RESTART', flush=True)
    try:
        os.makedirs(LOGDIR, exist_ok=True)
    except Exception:
        pass
    cp = paths.find_cpolar()
    if not cp:
        print('NO_CPOLAR', flush=True)
        return 1
    tk = os.path.join(os.environ.get('SystemRoot', r'C:\Windows'), 'System32', 'taskkill.exe')
    try:
        subprocess.run([tk, '/f', '/im', 'cpolar.exe'], capture_output=True, timeout=10)
    except Exception:
        pass
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
