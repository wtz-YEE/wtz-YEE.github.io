# -*- coding: utf-8 -*-
import json, os, re, socket, subprocess, sys, threading, time, glob, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE = os.path.dirname(os.path.abspath(__file__))
CFG = os.path.join(BASE, 'cloud_services.json')
HEART = os.path.join(BASE, 'guard.heartbeat')
GLOG = os.path.join(BASE, 'guard.log')
SYNC = os.path.join(BASE, 'sync.log')
PORT = 8702
CNW = getattr(subprocess, 'CREATE_NO_WINDOW', 0)
OPS = []
_SNAP = {'d': None, 'lock': threading.Lock()}

def sh(cmd, t=8):
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, timeout=t, encoding='gbk', errors='replace')
        return r.stdout or ''
    except Exception:
        return ''

def port_pid(port):
    out = sh('netstat -ano | findstr ":%s "' % port)
    for ln in out.splitlines():
        if 'LISTENING' in ln:
            t = ln.split()
            if len(t) >= 5 and t[4].isdigit():
                return t[4]
    return ''

def http_status(port, path='/health'):
    try:
        r = urllib.request.urlopen('http://127.0.0.1:%s%s' % (port, path), timeout=1.5)
        return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0

def proc_batch(pids):
    info = {}
    if not pids:
        return info
    out = sh('tasklist /FO CSV /NH', t=10)
    for ln in out.splitlines():
        parts = ln.split('","')
        if len(parts) < 5:
            continue
        pid = parts[1].strip('"')
        if pid not in pids:
            continue
        mem = parts[4].strip('"').replace(',', '').replace(' K', '').strip()
        info[pid] = int(mem) if mem.isdigit() else 0
    return info

def find_pythonw():
    out = sh('where pythonw')
    if out.strip():
        return out.splitlines()[0].strip()
    hits = glob.glob(os.path.expanduser(r'C:\Users\*\AppData\Local\Programs\Python\*\pythonw.exe'))
    if hits:
        return hits[0]
    for c in (r'C:\Python312\pythonw.exe', r'C:\Python311\pythonw.exe', r'C:\Python310\pythonw.exe'):
        if os.path.exists(c):
            return c
    return None

def load_cfg():
    try:
        return json.load(open(CFG, encoding='utf-8'))
    except Exception:
        return []

def read_tail(path, n=4000):
    try:
        with open(path, 'rb') as f:
            f.seek(0, 2)
            size = f.tell()
            f.seek(max(0, size - n))
            b = f.read()
        for enc in ('utf-8', 'gbk', 'utf-16'):
            try:
                return b.decode(enc)
            except Exception:
                continue
        return b.decode('utf-8', 'replace')
    except Exception:
        return ''

def read_addr(addrfile):
    for base in (BASE, os.path.dirname(BASE)):
        p = os.path.join(base, addrfile)
        if os.path.exists(p):
            try:
                return open(p, encoding='utf-8').read().strip()
            except Exception:
                return ''
    return ''

def tunnel_url(patname):
    pat2 = re.compile(r'https://([0-9a-z]+\.r\d+\.cpolar\.(?:top|cn))')
    d = os.path.join(os.path.expanduser('~'), '.cpolar', 'logs')
    files = sorted(glob.glob(os.path.join(d, 'cpolar_*.log*')),
                   key=lambda p: os.path.getmtime(p), reverse=True)[:30]
    for f in files:
        if patname not in os.path.basename(f):
            continue
        c = read_tail(f, 262144)
        ms = pat2.findall(c)
        if ms:
            return 'https://' + ms[-1]
    return ''

def probe_https(u, path='/health'):
    try:
        urllib.request.urlopen(u + path, timeout=2.5)
        return True
    except Exception:
        return False

def svc_status():
    out = []
    for svc in load_cfg():
        if not svc.get('enabled', True):
            continue
        name = svc['name']
        port = str(svc['port'])
        pid = port_pid(port)
        hp = svc.get('health', '/health')
        http = http_status(port, hp) if pid else 0
        out.append({
            'name': name, 'desc': svc.get('desc', ''),
            'port': port, 'pid': pid,
            'alive': bool(pid) and http > 0,
            'http': http, 'mem': 0, 'up': 0,
            'script': svc.get('script', ''),
            'health': hp, 'tunnel': svc.get('tunnel', ''),
            'addrfile': svc.get('addrfile', '')
        })
    pids = set(s['pid'] for s in out if s['pid'])
    if pids:
        info = proc_batch(pids)
        for s in out:
            if s['pid'] in info:
                s['mem'] = info[s['pid']]
    return out

def guard_status():
    hb = ''
    try:
        with open(HEART) as f:
            hb = f.read().strip()
    except Exception:
        pass
    age = -1
    if hb.isdigit():
        age = int(time.time()) - int(hb)
    alive = age >= 0 and age < 150
    w = sh('schtasks /query /tn "WTZ云端看门狗" /fo list', t=6)
    configured = 'WTZ云端看门狗' in w
    running = '正在运行' in w or 'Running' in w
    return {'age': age, 'alive': alive, 'watchdog': configured, 'watch_run': running}

def compute_status():
    svcs = svc_status()
    guard = guard_status()
    cfgs = [s for s in load_cfg() if s.get('enabled', True) and s.get('tunnel')]
    tunnels = []
    if cfgs:
        for s in cfgs:
            url = ''
            af = s.get('addrfile', '')
            if af:
                for ln in reversed(read_addr(af).splitlines()):
                    ln = ln.strip()
                    if ln.startswith('http'):
                        url = ln
                        break
            if not url:
                url = tunnel_url(s.get('tunnel', ''))
            tunnels.append({'name': s.get('tunnel', ''), 'svc': s['name'],
                            'url': url, 'ok': False})
        with ThreadPoolExecutor(max_workers=8) as ex:
            oks = list(ex.map(probe_https, [t['url'] for t in tunnels]))
        for i, t in enumerate(tunnels):
            t['ok'] = oks[i] if t['url'] else False
    addrs = {}
    for svc in svcs:
        if svc['addrfile']:
            addrs[svc['name']] = read_addr(svc['addrfile'])
    return {
        'time': int(time.time()),
        'guard': guard,
        'services': svcs,
        'tunnels': tunnels,
        'addrs': addrs,
        'ops': OPS[-20:],
        'monitor': port_pid(PORT)
    }

def snap():
    with _SNAP['lock']:
        if _SNAP['d'] is None:
            _SNAP['d'] = compute_status()
        return _SNAP['d']

def _loop():
    while True:
        try:
            with _SNAP['lock']:
                _SNAP['d'] = compute_status()
        except Exception:
            pass
        time.sleep(3)

threading.Thread(target=_loop, daemon=True).start()

def start_svc(script):
    pyw = find_pythonw()
    if not pyw:
        return 'NO_PYTHONW'
    if not os.path.isabs(script):
        script = os.path.join(BASE, script)
    if not os.path.exists(script):
        return 'SCRIPT_MISSING'
    subprocess.Popen([pyw, script], creationflags=CNW)
    return 'OK'

def stop_svc(port):
    pid = port_pid(port)
    if pid:
        sh('taskkill /F /PID %s' % pid)
        return 'OK'
    return 'NOT_RUNNING'

def guard_stop():
    sh('powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object {$_.CommandLine -like \'*云端守护.cmd*\' -or $_.CommandLine -like \'*guard_core.ps1*\'} | ForEach-Object {Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue}"')
    return 'OK'

def guard_start():
    subprocess.Popen(['cmd', '/c', os.path.join(BASE, '云端守护.cmd')], creationflags=CNW)
    return 'OK'

def tunnel_restart():
    subprocess.Popen([sys.executable, os.path.join(BASE, 'start_tunnels.py')], creationflags=CNW)
    return 'OK'

def action(q):
    op = q.get('op', '')
    svc = q.get('svc', '')
    cfg = load_cfg()
    entry = next((s for s in cfg if s.get('enabled', True) and s['name'] == svc), None)
    if op == 'start':
        if not entry:
            return {'ok': False, 'msg': 'service not found'}
        m = start_svc(entry['script'])
        OPS.append([time.strftime('%H:%M:%S'), '启动 ' + svc + ' → ' + m])
        return {'ok': True, 'msg': m}
    if op == 'stop':
        if not entry:
            return {'ok': False, 'msg': 'service not found'}
        m = stop_svc(entry['port'])
        OPS.append([time.strftime('%H:%M:%S'), '停止 ' + svc + ' → ' + m])
        return {'ok': True, 'msg': m}
    if op == 'restart':
        if not entry:
            return {'ok': False, 'msg': 'service not found'}
        m1 = stop_svc(entry['port'])
        time.sleep(0.6)
        m2 = start_svc(entry['script'])
        OPS.append([time.strftime('%H:%M:%S'), '重启 ' + svc + ' → ' + m1 + ' / ' + m2])
        return {'ok': True, 'msg': m1 + ' / ' + m2}
    if op == 'guard_start':
        m = guard_start()
        OPS.append([time.strftime('%H:%M:%S'), '启动云端守护'])
        return {'ok': True, 'msg': m}
    if op == 'guard_stop':
        m = guard_stop()
        OPS.append([time.strftime('%H:%M:%S'), '停止云端守护'])
        return {'ok': True, 'msg': m}
    if op == 'tunnel_restart':
        m = tunnel_restart()
        OPS.append([time.strftime('%H:%M:%S'), '重启隧道'])
        return {'ok': True, 'msg': m}
    return {'ok': False, 'msg': 'unknown op'}

class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _h(self, code, body, ctype='application/json; charset=utf-8'):
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if isinstance(body, str):
            body = body.encode('utf-8')
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_GET(self):
        path = self.path.split('?')[0]
        q = {}
        if '?' in self.path:
            for kv in self.path.split('?', 1)[1].split('&'):
                if '=' in kv:
                    k, v = kv.split('=', 1)
                    q[k] = v
        try:
            if path in ('/', '/monitor.html'):
                html = open(os.path.join(BASE, 'monitor.html'), encoding='utf-8').read()
                return self._h(200, html, 'text/html; charset=utf-8')
            if path == '/api/status':
                return self._h(200, json.dumps(snap(), ensure_ascii=False))
            if path == '/api/log':
                try:
                    n = int(q.get('n', '4000'))
                except Exception:
                    n = 4000
                return self._h(200, json.dumps({
                    'guard': read_tail(GLOG, n),
                    'sync': read_tail(SYNC, n)
                }, ensure_ascii=False))
            if path == '/api/action':
                return self._h(200, json.dumps(action(q), ensure_ascii=False))
            return self._h(404, json.dumps({'error': 'not found'}))
        except Exception as e:
            return self._h(500, json.dumps({'error': str(e)}))

if __name__ == '__main__':
    try:
        ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
    except KeyboardInterrupt:
        pass
    except Exception as e:
        try:
            open(os.path.join(BASE, 'monitor.err.log'), 'a', encoding='utf-8').write(
                time.strftime('[%Y-%m-%d %H:%M:%S] ') + str(e) + '\n')
        except Exception:
            pass
        raise
