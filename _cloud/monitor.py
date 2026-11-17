# -*- coding: utf-8 -*-
import json, os, re, socket, subprocess, sys, threading, time, glob, ctypes, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import paths
CFG = os.path.join(BASE, 'cloud_services.json')
HEART = os.path.join(BASE, 'guard.heartbeat')
GLOG = os.path.join(BASE, 'guard.log')
SYNC = os.path.join(BASE, 'sync.log')
SNAP_FILE = os.path.join(BASE, 'monitor_snap.json')
PORT = int(os.environ.get('WTZ_MONITOR_PORT') or 8702)
CNW = getattr(subprocess, 'CREATE_NO_WINDOW', 0)
OPS = []
_SNAP = {'d': None, 'lock': threading.Lock()}
SYSTEM32 = os.path.join(os.environ.get('SystemRoot', r'C:\Windows'), 'System32')
PS_DIR = os.path.join(SYSTEM32, 'WindowsPowerShell', 'v1.0')

def _env():
    e = dict(os.environ)
    e['PATH'] = SYSTEM32 + os.pathsep + PS_DIR + os.pathsep + e.get('PATH', '')
    return e

def sh(cmd, t=8):
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, timeout=t,
                           encoding='gbk', errors='replace', env=_env())
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
        r = urllib.request.urlopen('http://127.0.0.1:%s%s' % (port, path), timeout=1.2)
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
    return paths.find_python('pythonw.exe') or paths.find_python('python.exe')

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
    try:
        p = paths.addrfile(addrfile)
        if os.path.exists(p):
            return open(p, encoding='utf-8').read().strip()
    except Exception:
        pass
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
    for i in range(2):
        try:
            urllib.request.urlopen(u + path, timeout=2)
            return True
        except Exception:
            if i == 0:
                time.sleep(0.5)
    return False

_PROBE = {}

def probe_cached(u, path='/health'):
    hit = _PROBE.get(u)
    if hit and time.time() - hit[0] < 60:
        return hit[1]
    ok = probe_https(u, path)
    _PROBE[u] = (time.time(), ok)
    return ok

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

def compute_status(fast=False):
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
        if fast:
            for t in tunnels:
                t['ok'] = False
        else:
            with ThreadPoolExecutor(max_workers=8) as ex:
                oks = list(ex.map(probe_cached, [t['url'] for t in tunnels],
                                  [s.get('health', '/health') for s in cfgs]))
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
    d = _SNAP['d']
    if d is None:
        d = placeholder()
    return d

def placeholder():
    svcs = []
    for s in load_cfg():
        if not s.get('enabled', True):
            continue
        svcs.append({'name': s['name'], 'desc': s.get('desc', ''), 'port': str(s.get('port', '')),
                     'pid': '', 'alive': False, 'http': 0, 'mem': 0, 'up': 0,
                     'script': s.get('script', ''), 'health': s.get('health', '/health'),
                     'tunnel': s.get('tunnel', ''), 'addrfile': s.get('addrfile', '')})
    tunnels = []
    for s in load_cfg():
        if s.get('enabled', True) and s.get('tunnel'):
            tunnels.append({'name': s.get('tunnel', ''), 'svc': s['name'], 'url': '', 'ok': False})
    return {'time': 0, 'guard': {'age': -1, 'alive': False, 'watchdog': False, 'watch_run': False},
            'services': svcs, 'tunnels': tunnels, 'addrs': {}, 'ops': OPS[-20:], 'monitor': ''}

try:
    _d0 = json.load(open(SNAP_FILE, encoding='utf-8'))
    _SNAP['d'] = _d0 if isinstance(_d0, dict) and 'services' in _d0 else None
except Exception:
    _SNAP['d'] = None

def _loop():
    first = True
    while True:
        try:
            d = compute_status(fast=first)
            first = False
            _SNAP['d'] = d
            try:
                tmp = SNAP_FILE + '.tmp'
                with open(tmp, 'w', encoding='utf-8') as f:
                    json.dump(d, f, ensure_ascii=False)
                os.replace(tmp, SNAP_FILE)
            except Exception:
                pass
        except Exception:
            pass
        time.sleep(5)

threading.Thread(target=_loop, daemon=True).start()

def _boot_guard():
    time.sleep(3)
    try:
        r = guard_start()
        OPS.append([time.strftime('%H:%M:%S'), '启动自检：云端守护 ' + r])
    except Exception:
        pass

threading.Thread(target=_boot_guard, daemon=True).start()

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

def pid_alive(pid):
    try:
        h = ctypes.windll.kernel32.OpenProcess(0x1000, False, int(pid))
        if h:
            ctypes.windll.kernel32.CloseHandle(h)
            return True
    except Exception:
        pass
    return False

def guard_start():
    try:
        lp = int(open(os.path.join(BASE, 'guard.lock', 'pid')).read().strip())
        if pid_alive(lp):
            return 'ALREADY_RUNNING'
    except Exception:
        pass
    lk = os.path.join(BASE, 'guard.lock')
    if os.path.isdir(lk):
        try:
            sh('rmdir /s /q "%s"' % lk)
        except Exception:
            pass
    path = os.path.join(BASE, '云端守护.cmd')
    subprocess.Popen('start "WTZ 云端守护" /min cmd /c ""%s" /watchdog"' % path, shell=True)
    return 'OK'

def tunnel_restart():
    py = sys.executable
    st = os.path.join(BASE, 'start_tunnels.py')
    gu = os.path.join(BASE, 'get_url.py')
    try:
        subprocess.run([py, st, '--force'], capture_output=True, timeout=35)
    except Exception as ex:
        return 'RESTART_FAIL ' + str(ex)[:80]
    time.sleep(3)
    url = ''
    ok = False
    deadline = time.time() + 45
    while time.time() < deadline:
        try:
            left = max(8, min(20, int(deadline - time.time())))
            subprocess.run([py, gu], capture_output=True, timeout=left)
        except Exception:
            pass
        url = read_addr('cloud.txt').strip()
        if url:
            ok = probe_https(url, '/health')
        if ok:
            break
        time.sleep(2)
    _PROBE.clear()
    if url:
        return 'RESTARTED ' + url + ('' if ok else ' （等待隧道就绪）')
    return 'RESTARTED_NO_URL'

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
        OPS.append([time.strftime('%H:%M:%S'), '重启隧道 → ' + m])
        return {'ok': m.startswith('RESTARTED') and 'NO_URL' not in m, 'msg': m}
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
            if path == '/health':
                return self._h(200, json.dumps({'ok': True, 'time': int(time.time())}, ensure_ascii=False))
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
