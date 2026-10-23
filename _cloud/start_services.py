# -*- coding: utf-8 -*-
import json, os, subprocess, time, shutil, glob, socket, urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)
CFG = os.path.join(BASE, 'cloud_services.json')

def find_pythonw():
    for c in ('pythonw.exe',):
        p = shutil.which(c)
        if p:
            return p
    hits = glob.glob(os.path.expanduser(r'C:\Users\*\AppData\Local\Programs\Python\*\pythonw.exe'))
    if hits:
        return hits[0]
    for c in (r'C:\Python312\pythonw.exe', r'C:\Python311\pythonw.exe', r'C:\Python310\pythonw.exe'):
        if os.path.exists(c):
            return c
    return None

def port_active(port):
    try:
        s = socket.create_connection(('127.0.0.1', port), timeout=1)
        s.close()
        return True
    except OSError:
        return False

def main():
    cfg = json.load(open(CFG, encoding='utf-8'))
    pyw = find_pythonw()
    if not pyw:
        print('NO_PYTHONW')
        return 1
    for svc in cfg:
        if not svc.get('enabled', True):
            continue
        name = svc['name']
        port = svc['port']
        if port_active(port):
            print(name, 'running')
            continue
        script = svc['script']
        if not os.path.isabs(script):
            script = os.path.join(BASE, script)
        if not os.path.exists(script):
            print(name, 'SCRIPT_MISSING', script)
            continue
        subprocess.Popen([pyw, script], creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
        print(name, 'starting')
        ok = False
        for _ in range(20):
            time.sleep(1)
            try:
                r = urllib.request.urlopen(urllib.request.Request(
                    'http://127.0.0.1:%d%s' % (port, svc.get('health', '/health')), timeout=2))
                if r.status == 200:
                    ok = True
                    break
            except Exception:
                pass
        print(name, 'health', 'ok' if ok else 'FAIL')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
