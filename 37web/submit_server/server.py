import http.server, json, os, re, uuid, time, base64, threading, datetime
from http.server import ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # 37web 根
SUBDIR = os.path.join(ROOT, 'submit_server', 'submissions')
DATA = os.path.join(SUBDIR, 'data.json')
VOTES = os.path.join(SUBDIR, 'votes.json')
ADMIN_KEY = 'wtz37'
MAX_BYTES = 4 * 1024 * 1024

os.makedirs(SUBDIR, exist_ok=True)
LOCK = threading.Lock()

def load():
    try:
        with open(DATA, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save(items):
    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=1)

def load_v():
    try:
        with open(VOTES, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}

def save_v(v):
    with open(VOTES, 'w', encoding='utf-8') as f:
        json.dump(v, f, ensure_ascii=False)

def pub(i):
    return {'id': i['id'], 'title': i['title'], 'desc': i['desc'],
            'votes': i['votes'], 't': i['t'], 'img': '/api/img?id=' + i['id'],
            'adopted': bool(i.get('adopted'))}

CT = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.moc3': 'application/octet-stream',
    '.cmo3': 'application/octet-stream', '.txt': 'text/plain; charset=utf-8',
    '.md': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
}

class H(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, code, body, ctype='application/json; charset=utf-8'):
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        n = int(self.headers.get('Content-Length', 0) or 0)
        if n <= 0 or n > MAX_BYTES * 2:
            return None
        try:
            return json.loads(self.rfile.read(n).decode('utf-8'))
        except Exception:
            return None

    def _static(self, p):
        if p == '/':
            p = '/index.html'
        fp = os.path.normpath(os.path.join(ROOT, p.lstrip('/')))
        if not fp.startswith(ROOT) or not os.path.isfile(fp):
            self._send(404, b'{}')
            return
        ext = os.path.splitext(fp)[1].lower()
        ctype = CT.get(ext, 'application/octet-stream')
        with open(fp, 'rb') as f:
            self._send(200, f.read(), ctype)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Length', '0')
        self.end_headers()

    def do_GET(self):
        u = urlparse(self.path)
        p = u.path
        if p == '/api/list':
            with LOCK:
                items = sorted(load(), key=lambda x: -x['votes'])
            self._send(200, json.dumps({'ok': True, 'list': [pub(i) for i in items]}, ensure_ascii=False).encode('utf-8'))
        elif p == '/api/img':
            q = parse_qs(u.query)
            iid = (q.get('id') or [''])[0]
            with LOCK:
                items = load()
                ok = any(i['id'] == iid for i in items)
            if not ok:
                self._send(404, b'{}')
                return
            fp = os.path.join(SUBDIR, iid + '.png')
            if not os.path.isfile(fp):
                self._send(404, b'{}')
                return
            with open(fp, 'rb') as f:
                self._send(200, f.read(), 'image/png')
        elif p == '/admin':
            q = parse_qs(u.query)
            if (q.get('key') or [''])[0] != ADMIN_KEY:
                self._send(403, b'key error')
                return
            if q.get('del'):
                iid = (q.get('del') or [''])[0]
                with LOCK:
                    items = load()
                    items = [i for i in items if i['id'] != iid]
                    save(items)
                fp = os.path.join(SUBDIR, iid + '.png')
                if os.path.isfile(fp):
                    os.remove(fp)
            if q.get('adopt') or q.get('unadopt'):
                iid = (q.get('adopt') or q.get('unadopt') or [''])[0]
                val = 1 if q.get('adopt') else 0
                with LOCK:
                    items = load()
                    for i in items:
                        if i['id'] == iid:
                            i['adopted'] = val
                            save(items)
                            break
            with LOCK:
                items = sorted(load(), key=lambda x: (-(1 if x.get('adopted') else 0), -x['votes']))
            rows = ''.join(
                '<div class="r%s"><img src="/api/img?id=%s"><div class="m"><b>%s</b><span>%s</span><p>%s</p><i>票数 %d · 编号 %s%s</i></div><div class="a">%s<a href="/admin?key=%s&del=%s" onclick="return confirm(\'确定删除?\')">删除</a></div></div>'
                % (' ad' if i.get('adopted') else '',
                   i['id'], i['title'], time.strftime('%m-%d %H:%M', time.localtime(i['t'])), i['desc'], i['votes'], i['id'],
                   ' · ★ 已采用' if i.get('adopted') else '',
                   ('<a href="/admin?key=%s&unadopt=%s">取消采用</a>' % (ADMIN_KEY, i['id']) if i.get('adopted') else '<a class="ad" href="/admin?key=%s&adopt=%s">采用</a>' % (ADMIN_KEY, i['id'])),
                   ADMIN_KEY, i['id'])
                for i in items)
            html = ('<!DOCTYPE html><meta charset="utf-8"><title>37web 投稿管理</title>'
                    '<style>body{font-family:system-ui;background:#10121c;color:#e8e6f2;margin:0;padding:24px}'
                    '.r{display:flex;gap:14px;background:#1a1d30;border:1px solid #333a5c;border-radius:6px;padding:12px;margin-bottom:12px;align-items:center}'
                    'img{width:150px;height:150px;object-fit:contain;background:#000;border-radius:4px}'
                    '.m b{display:block;font-size:16px}.m span{color:#9aa1c4;font-size:12px}.m p{color:#cfd3ea;font-size:13px;margin:6px 0}.m i{color:#e8c987;font-size:12px;font-style:normal}'
                    '.a a{color:#ff9d94;font-size:13px;white-space:nowrap;margin-left:10px}'
                    '.a a.ad{color:#7ee787}.r.ad{background:#22301d;border-color:#4c7a3a}'
                    '.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}'
                    '.top h1{font-size:20px}.cnt{color:#9aa1c4;font-size:13px}</style>'
                    '<div class="top"><h1>37web 投稿管理 · 按票数排序</h1><span class="cnt">共 %d 条 · 选最高票数的那张做 L2D</span></div>' % len(items) + rows)
            self._send(200, html.encode('utf-8'), 'text/html; charset=utf-8')
        else:
            self._static(p)

    def do_POST(self):
        u = urlparse(self.path)
        if u.path == '/api/submit':
            d = self._read_json()
            if not d or not d.get('img') or not d.get('title'):
                self._send(400, json.dumps({'ok': False, 'msg': '缺字段'}).encode('utf-8'))
                return
            R = ['赌博', '博彩', '诈骗', '代购', '发票', '刷单', '裸聊', '援交', '约炮', '卖淫',
                 '毒品', '冰毒', '摇头丸', '枪支', '弹药', '管制刀具', '作弊', '外挂', '黑客攻击']
            txt = (d.get('title') or '') + (d.get('desc') or '')
            for w in R:
                if w in txt:
                    self._send(400, json.dumps({'ok': False, 'msg': '含敏感词'}).encode('utf-8'))
                    return
            img = d['img']
            if ',' in img:
                img = img.split(',', 1)[1]
            try:
                raw = base64.b64decode(img)
            except Exception:
                self._send(400, json.dumps({'ok': False, 'msg': '图片解码失败'}).encode('utf-8'))
                return
            if len(raw) > MAX_BYTES:
                self._send(413, json.dumps({'ok': False, 'msg': '图片过大(>4MB)'}).encode('utf-8'))
                return
            iid = uuid.uuid4().hex[:10]
            with open(os.path.join(SUBDIR, iid + '.png'), 'wb') as f:
                f.write(raw)
            with LOCK:
                items = load()
                items.append({'id': iid, 'title': (d.get('title') or '未命名')[:40],
                              'desc': (d.get('desc') or '')[:200], 'votes': 0, 't': time.time()})
                save(items)
            self._send(200, json.dumps({'ok': True, 'id': iid}).encode('utf-8'))
        elif u.path == '/api/vote':
            d = self._read_json()
            iid = d.get('id') if d else None
            ip = (self.headers.get('X-Forwarded-For') or '').split(',')[0].strip() or self.client_address[0]
            day = datetime.date.today().isoformat()
            with LOCK:
                items = load()
                for i in items:
                    if i['id'] == iid:
                        v = load_v()
                        k = ip + '|' + iid + '|' + day
                        if k in v:
                            self._send(403, json.dumps({'ok': False, 'msg': '今日已投过'}).encode('utf-8'))
                            return
                        i['votes'] = i.get('votes', 0) + 1
                        save(items)
                        v[k] = 1
                        save_v(v)
                        self._send(200, json.dumps({'ok': True, 'votes': i['votes']}).encode('utf-8'))
                        return
            self._send(404, json.dumps({'ok': False, 'msg': 'not found'}).encode('utf-8'))
        else:
            self._send(404, b'{}')

def main():
    port = int(os.environ.get('PORT', '8000'))
    srv = ThreadingHTTPServer(('0.0.0.0', port), H)
    print('37web server (static + submit api) on http://localhost:%d  admin: /admin?key=%s' % (port, ADMIN_KEY))
    srv.serve_forever()

if __name__ == '__main__':
    main()
