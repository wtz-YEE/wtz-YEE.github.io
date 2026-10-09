from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import re

app = Flask(__name__)
CORS(app)

_BASE = os.path.dirname(os.path.abspath(__file__))
GUESTBOOK_FILE = os.path.join(_BASE, "guestbook.json")
USER_FILE = os.path.join(_BASE, "users.json")
PM_FILE = os.path.join(_BASE, "pm.json")
CHANGELOG_FILE = os.path.join(_BASE, "changelog.json")
SCORE_FILE = os.path.join(_BASE, "scores.json")
RISK_FILE = os.path.join(_BASE, "risk_words.json")
BANNED_IP_FILE = os.path.join(_BASE, "banned_ips.json")
GARDEN_FILE = os.path.join(_BASE, "garden.json")

import time as _t
DEL_LOG = []
SYNC_KEY_FILE = os.path.join(_BASE, "sync_key.txt")
ACH_LIST = {"n": 20, "items": [
    ("初入终端", 0), ("数字猎人", 0), ("2048 大师", 0), ("远古跑者", 0), ("贪吃蛇大师", 0),
    ("方块消行者", 0), ("扫雷先锋", 0), ("砖块粉碎者", 0), ("像素鸟", 0), ("太空卫士", 0),
    ("五子连珠", 0), ("三连即胜", 0), ("数独达人", 0), ("拼图快手", 0), ("迷宫探索者", 0),
    ("记忆大师", 0), ("三消高手", 0), ("反应大师", 0), ("打字高手", 0), ("21 点首胜", 0),
    ("秘技解锁", 1), ("权限巅峰", 1), ("蛇王", 1), ("方块之神", 1), ("弹幕舞者", 1),
    ("炼金术士", 1), ("苹果丰收", 1), ("地鼠终结者", 1), ("大鱼王", 1), ("飞人", 1),
    ("完美牌局", 1), ("百步穿杨", 1), ("闪电反应", 1), ("完美记忆", 1), ("键盘钢琴家", 1),
    ("单词大师", 1), ("连消风暴", 1), ("连切十果", 1), ("二段飞人", 1), ("摘星者", 1),
    ("数独常客", 1), ("游戏收藏家", 1), ("全成就猎人", 1), ("坚持不懈", 1), ("常驻访客", 1),
    ("分数狂人", 1), ("成就专家", 1), ("万物起源", 1), ("神枪手", 1), ("十连靶心", 1)
]}

SHOP = [
    {"id": "t_night", "type": "title", "name": "夜行", "cost": 40, "desc": "深夜驻留者 · 昵称旁显示"},
    {"id": "t_watch", "type": "title", "name": "守夜人", "cost": 60, "desc": "接过巡夜的火把"},
    {"id": "t_lore", "type": "title", "name": "档案员", "cost": 80, "desc": "泰拉大典的常客"},
    {"id": "t_knight", "type": "title", "name": "守夜骑士", "cost": 120, "desc": "有编号的正式骑士"},
    {"id": "t_ember", "type": "title", "name": "余烬行者", "cost": 160, "desc": "在灰烬里走出来的"},
    {"id": "t_void", "type": "title", "name": "虚空漫步", "cost": 200, "desc": "黑域不迷路"},
    {"id": "t_lord", "type": "title", "name": "夜色领主", "cost": 300, "desc": "夜幕之下的主人"},
    {"id": "t_legend", "type": "title", "name": "泰拉传说", "cost": 500, "desc": "被写进大典的人"},
    {"id": "f_square", "type": "frame", "name": "方界头像框", "cost": 80, "desc": "直角硬边 · 档案风"},
    {"id": "f_neon", "type": "frame", "name": "霓虹头像框", "cost": 120, "desc": "发光描边 · 赛博夜行"},
    {"id": "f_frost", "type": "frame", "name": "霜冻头像框", "cost": 160, "desc": "冰晶封存 · 冷光"},
    {"id": "f_ember", "type": "frame", "name": "余烬头像框", "cost": 160, "desc": "烬火微光 · 暖调"},
    {"id": "f_aurora", "type": "frame", "name": "极光头像框", "cost": 240, "desc": "极夜流光 · 呼吸"},
    {"id": "f_gold", "type": "frame", "name": "鎏金头像框", "cost": 400, "desc": "收藏级 · 金色描边"},
]

FRAGS = [
    {"n": 1, "t": "源石尘", "d": "从罗德岛甲板缝里扫出来的，编号 001。"},
    {"n": 2, "t": "战术演习记录", "d": "上面只有一句话：活着回来。"},
    {"n": 3, "t": "守夜人火把灰", "d": "火把灭了，巡夜还没结束。"},
    {"n": 4, "t": "言灵残页", "d": "字迹在你不看的时候会换位置。"},
    {"n": 5, "t": "干员工牌", "d": "照片被人用马克笔画了胡子。"},
    {"n": 6, "t": "龙门通行证", "d": "有效期：直到你不需要它为止。"},
    {"n": 7, "t": "机密终端密钥卡", "d": "背面写着「忘了就跑 gen_keys.py」。"},
    {"n": 8, "t": "2048 方块", "d": "它一直想变成 4096。"},
    {"n": 9, "t": "小恐龙的鳞片", "d": "它跳了一整天，没撞到任何东西。"},
    {"n": 10, "t": "贪吃蛇的尾尖", "d": "它咬到了自己，然后学会了穿墙。"},
    {"n": 11, "t": "诺玛的日志", "d": "「今天又有人问我路明非是谁。」"},
    {"n": 12, "t": "学院徽章", "d": "背面刻着 S 级血统的编号，被人刮掉了。"},
    {"n": 13, "t": "血统契副本", "d": "签名处是空的——你还没签。"},
    {"n": 14, "t": "莱茵生命试剂", "d": "标签写着「请勿摇晃」，然后被人摇晃过。"},
    {"n": 15, "t": "技能树枯枝", "d": "它曾经是一条点亮的分支。"},
    {"n": 16, "t": "模组源码", "d": "注释里写着「这里应该能跑」，不能。"},
    {"n": 17, "t": "泰拉编年史扉页", "d": "第一页只有一句：泰拉没有真相。"},
    {"n": 18, "t": "罗德岛通讯残页", "d": "播报员念到一半停了电。"},
    {"n": 19, "t": "访客墙的签名", "d": "某个名字被涂掉了，但笔画还在。"},
    {"n": 20, "t": "枫叶书签", "d": "夹在一本没人借过的书里。"},
    {"n": 21, "t": "极光碎片", "d": "它不发光，只是把光借给了你。"},
    {"n": 22, "t": "系统根权限", "d": "拿到它的人，会先愣一会儿。"},
]


SYNC_LOG = os.path.join(_BASE, "sync.log")
CLOUD_TXT = os.path.join(_BASE, "..", "cloud.txt")


def _save(p, x):
    tmp = p + ".tmp" + str(os.getpid())
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(x, f, ensure_ascii=False, indent=1)
    os.replace(tmp, p)
    return x


def _load(p, d):
    try:
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        pass
    try:
        with open(p, "r", encoding="utf-8") as f:
            raw = f.read()
        obj, _ = json.JSONDecoder().raw_decode(raw.lstrip())
        _save(p, obj)
        print("[repair] %s salvaged from corrupt json" % os.path.basename(p))
        return obj
    except Exception:
        return d


# 初始化排行榜
if not os.path.exists(SCORE_FILE):
    with open(SCORE_FILE, "w", encoding="utf-8") as f:
        json.dump({}, f, ensure_ascii=False)

# 初始化更新日志
if not os.path.exists(CHANGELOG_FILE):
    with open(CHANGELOG_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, ensure_ascii=False)

# 初始化留言板
if not os.path.exists(GUESTBOOK_FILE):
    with open(GUESTBOOK_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, ensure_ascii=False)

# 初始化账号库，admin为管理员账号，请修改密码
if not os.path.exists(USER_FILE):
    init_users = {
        "admin": {
            "pwd": "你的管理员密码",
            "is_admin": True
        }
    }
    _save(USER_FILE, init_users)

# 初始化私聊存储
if not os.path.exists(PM_FILE):
    with open(PM_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, ensure_ascii=False)

# 初始化通知存储
if not os.path.exists(os.path.join(_BASE, "notifications.json")):
    with open(os.path.join(_BASE, "notifications.json"), "w", encoding="utf-8") as f:
        json.dump([], f, ensure_ascii=False)


# 获取全部留言
@app.route('/guestbook', methods=["GET"])
def get_guestbook():
    with open(GUESTBOOK_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)


# 保存/覆盖留言列表（前端上传完整数组）
@app.route('/guestbook', methods=["PUT"])
def save_guestbook():
    payload = request.get_json()
    if not isinstance(payload, list):
        return jsonify({"ok": False}), 400
    with open(GUESTBOOK_FILE, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    return jsonify({"ok": True})


# 用户注册
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    uname = data.get("username", "").strip()
    pwd = data.get("password", "").strip()
    if not uname or not pwd:
        return jsonify({"ok": False, "msg": "账号密码不能为空"})

    with open(USER_FILE, "r", encoding="utf-8") as f:
        users = json.load(f)

    if uname in users:
        return jsonify({"ok": False, "msg": "账号已存在"})
    rip = (request.headers.get("X-Forwarded-For") or "").split(",")[0].strip() or (request.remote_addr or "")
    bi = _load(BANNED_IP_FILE, {})
    b = bi.get(rip)
    if b and _time.time() - float(b.get("t") or 0) < 86400:
        rem = int(86400 - (_time.time() - float(b.get("t") or 0)))
        return jsonify({"ok": False, "msg": "该设备/IP 为危险来源，禁止注册任何账号 · " + str(max(1, rem // 3600)) + " 小时后解除"})

    q = (data.get("q") or "").strip()[:60]
    a = (data.get("a") or "").strip()[:60]
    users[uname] = {"pwd": pwd, "is_admin": False, "reg": _time.strftime("%Y-%m-%d %H:%M:%S"), "ip": rip}
    if q and a:
        users[uname]["sec_q"] = q
        users[uname]["sec_a"] = a
    _save(USER_FILE, users)
    return jsonify({"ok": True, "msg": "注册成功"})


# 设置安全问题（登录态）
@app.route("/sec_set", methods=["POST"])
def sec_set():
    data = request.get_json()
    tk = data.get("token", "")
    q = (data.get("q") or "").strip()[:60]
    a = (data.get("a") or "").strip()[:60]
    if not q or not a:
        return jsonify({"ok": False, "msg": "请填写问题与答案"})
    with open(USER_FILE, "r", encoding="utf-8") as f:
        users = json.load(f)
    ses = users.get("__sessions", {})
    name = None
    for k, v in ses.items():
        if k == tk:
            name = v[0] if isinstance(v, list) else v
            break
    if not name or not users.get(name):
        return jsonify({"ok": False, "msg": "登录已失效"})
    users[name]["sec_q"] = q
    users[name]["sec_a"] = a
    _save(USER_FILE, users)
    return jsonify({"ok": True, "msg": "安全问题已设置"})


# 找回密码第一步：获取安全问题
@app.route("/recover_q", methods=["POST"])
def recover_q():
    data = request.get_json()
    uname = (data.get("username") or "").strip()
    if not uname:
        return jsonify({"ok": False, "msg": "请输入账号"})
    with open(USER_FILE, "r", encoding="utf-8") as f:
        users = json.load(f)
    u = users.get(uname)
    if not u:
        return jsonify({"ok": False, "msg": "账号不存在"})
    if not u.get("sec_q"):
        return jsonify({"ok": False, "msg": "该账号未设置安全问题"})
    return jsonify({"ok": True, "question": u["sec_q"]})


# 找回密码第二步：验证答案并重置
@app.route("/recover", methods=["POST"])
def recover():
    data = request.get_json()
    uname = (data.get("username") or "").strip()
    ans = (data.get("answer") or "").strip()
    newpwd = data.get("newpwd") or ""
    if not uname or not newpwd:
        return jsonify({"ok": False, "msg": "请填写完整信息"})
    if len(newpwd) < 1 or len(newpwd) > 32:
        return jsonify({"ok": False, "msg": "密码长度需在 1-32 之间"})
    with open(USER_FILE, "r", encoding="utf-8") as f:
        users = json.load(f)
    u = users.get(uname)
    if not u:
        return jsonify({"ok": False, "msg": "账号不存在"})
    if not u.get("sec_a"):
        return jsonify({"ok": False, "msg": "该账号未设置安全问题"})
    if u["sec_a"] != ans:
        return jsonify({"ok": False, "msg": "安全问题答案错误"})
    u["pwd"] = newpwd
    ses = users.setdefault("__sessions", {})
    for k in [k for k, v in ses.items() if (v[0] if isinstance(v, list) else v) == uname]:
        del ses[k]
    _save(USER_FILE, users)
    return jsonify({"ok": True, "msg": "密码已重置，请重新登录"})


# 用户登录
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    uname = data.get("username", "").strip()
    pwd = data.get("password", "").strip()

    with open(USER_FILE, "r", encoding="utf-8") as f:
        users = json.load(f)

    u = users.get(uname)
    if not u or u["pwd"] != pwd:
        return jsonify({"ok": False, "msg": "账号或密码错误"})

    tk = _gen_token()
    with open(USER_FILE, "r", encoding="utf-8") as f:
        us = json.load(f)
    ses = us.setdefault("__sessions", {})
    for k in [k for k, v in ses.items() if (v[0] if isinstance(v, list) else v) == uname]:
        del ses[k]
    ses[tk] = [uname, _time.time()]
    _save(USER_FILE, us)
    return jsonify({
        "ok": True,
        "username": uname,
        "is_admin": u["is_admin"],
        "token": tk
    })


# 管理员删除单条留言
@app.route("/del_guest", methods=["POST"])
def del_guest():
    data = request.get_json()
    uname = data.get("username")
    gid = data.get("id")

    with open(USER_FILE, "r", encoding="utf-8") as f:
        users = json.load(f)
    if not users.get(uname, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无权限"})

    with open(GUESTBOOK_FILE, "r", encoding="utf-8") as f:
        gb = json.load(f)

    newgb = [x for x in gb if x["id"] != gid]
    with open(GUESTBOOK_FILE, "w", encoding="utf-8") as f:
        json.dump(newgb, f, ensure_ascii=False)
    return jsonify({"ok": True})


# 发送私聊
@app.route("/pm_send", methods=["POST"])
def pm_send():
    data = request.get_json() or {}
    from_u = data.get("from") or _cur_user(data.get("token"))
    to_u = data.get("to")
    msg = (data.get("msg") or "").strip()
    img = data.get("img") or ""
    time_str = data.get("time") or _now()
    if not from_u or not to_u or (not msg and not img):
        return jsonify({"ok": False})
    ms = _load(PM_FILE, [])
    nid = 1
    for x in ms:
        nid = max(nid, int(x.get("id", 0) or 0) + 1)
    ms.append({"id": nid, "from": from_u, "to": to_u, "msg": msg, "img": img,
               "time": time_str, "read": False})
    _save(PM_FILE, ms)
    try:
        _push_notify(to_u, from_u, "pm", (msg or "[图片]")[:80])
    except Exception:
        pass
    return jsonify({"ok": True, "id": nid})


@app.route("/pm_del", methods=["POST"])
def api_pm_del():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    mid = str(p.get("id") or "")
    ms = _load(PM_FILE, [])
    n = len(ms)
    ms = [x for x in ms if not (str(x.get("id")) == mid and x.get("from") == cu)]
    if len(ms) == n:
        return jsonify({"ok": False, "msg": "消息不存在或无权删除"})
    _save(PM_FILE, ms)
    return jsonify({"ok": True})


@app.route("/pm_delconv", methods=["POST"])
def api_pm_delconv():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    peer = str(p.get("peer") or "").strip()
    ms = _load(PM_FILE, [])
    n = len(ms)
    ms = [x for x in ms if not ((x.get("from") == cu and x.get("to") == peer) or (x.get("from") == peer and x.get("to") == cu))]
    _save(PM_FILE, ms)
    return jsonify({"ok": True, "deleted": n - len(ms)})


# 获取当前用户私聊记录
@app.route("/pm_get", methods=["POST"])
def pm_get():
    data = request.get_json()
    uname = data.get("username")
    with open(PM_FILE, "r", encoding="utf-8") as f:
        pmlist = json.load(f)

    res = [i for i in pmlist if i["from"] == uname or i["to"] == uname]
    return jsonify({"list": res})



# ---------- 前端兼容路由(index 留言板使用) ----------
import time as _time
import random as _random

def _gen_token():
    return "tk" + str(int(_time.time() * 1000)) + str(_random.random())[2:10]

def _cur_user(tok):
    if not tok:
        return None
    try:
        with open(USER_FILE, "r", encoding="utf-8") as f:
            u = json.load(f)
        v = u.get("__sessions", {}).get(tok)
        if not v:
            return None
        name = v[0] if isinstance(v, list) else v
        t = v[1] if isinstance(v, list) else 0
        if _time.time() - t > 86400:
            return None
        if _time.time() - t > 60:
            u["__sessions"][tok] = [name, _time.time()]
            _save(USER_FILE, u)
        return name
    except Exception:
        return None

def _is_root(cu, us):
    return cu == ROOT or bool((us.get(cu) or {}).get("is_root"))

def _now():
    return _time.strftime("%Y-%m-%d %H:%M:%S")

TITLES = ["见习守夜人", "守夜人", "资深守夜人", "守夜骑士",
          "守望者", "夜色领主", "冥灯主宰", "WTZ亲卫队"]

def _lv(exp):
    L = 1
    while exp >= 50 * L * (L + 1):
        L += 1
    return L

def _lvl_info(exp):
    L = _lv(exp)
    base = 50 * L * (L - 1) if L > 1 else 0
    nxt = 50 * L * (L + 1)
    return {"lv": L, "title": TITLES[min(L - 1, len(TITLES) - 1)],
            "base": base, "next": nxt, "cur": exp - base, "need": nxt - base}

def _add_exp(us, cu, n):
    if not cu:
        return
    rec = us.setdefault(cu, {})
    exp = int(rec.get("exp") or 0) + int(n)
    rec["exp"] = exp
    _save(USER_FILE, us)

def _award(cu, pts=0, exp=0):
    us = _load(USER_FILE, {})
    rec = us.setdefault(cu, {})
    rec["pts"] = int(rec.get("pts") or 0) + int(pts)
    rec["exp"] = int(rec.get("exp") or 0) + int(exp)
    _save(USER_FILE, us)
    return int(rec["pts"]), int(rec["exp"])

def _push_notify(target, src, kind, text, ref=""):
    if not target or target == src or target == "__sessions":
        return
    ns = _load(NOTIFY_FILE, [])
    nid = 1
    for x in ns:
        nid = max(nid, int(x.get("id", 0) or 0) + 1)
    ns.append({"id": nid, "user": target, "from": src, "type": kind,
               "text": str(text or "")[:200], "ref": str(ref or "")[:80],
               "time": _now(), "read": False})
    if len(ns) > 500:
        ns = ns[-400:]
    _save(NOTIFY_FILE, ns)

def _scan_at(txt, pid=""):
    try:
        us = _load(USER_FILE, {})
    except Exception:
        return
    for m in re.finditer(r"@([\w\u4e00-\u9fa5]{1,16})", str(txt or "")):
        t = m.group(1)
        if t in us and t != "__sessions":
            _push_notify(t, _cur_user(None) or "", "at", str(txt or "")[:80], pid)

def _clean_sessions(u):
    ses = u.get("__sessions", {})
    if not ses:
        return u
    cut = _time.time() - 86400
    for k, v in list(ses.items()):
        t = v[1] if isinstance(v, list) else 0
        if t < cut:
            del ses[k]
    return u

AUDIT_FILE = os.path.join(_BASE, "audit_log.json")

def _audit(who, act, target, detail=""):
    try:
        al = _load(AUDIT_FILE, [])
        today = _now()[:10]
        hist = {}
        keep = []
        for r in al:
            d = str(r.get("t") or "")[:10]
            if d and d != today:
                hist.setdefault(d, []).append(r)
            else:
                keep.append(r)
        for d, rs in hist.items():
            fp = os.path.join(_BASE, "audit_" + d + ".json")
            try:
                _save(fp, _load(fp, []) + rs)
            except Exception:
                pass
        al = keep
        al.append({"t": _now(), "who": who, "act": act, "target": str(target or "")[:80], "detail": str(detail or "")[:200]})
        if len(al) > 500:
            al = al[-500:]
        _save(AUDIT_FILE, al)
    except Exception:
        pass


@app.route("/health", methods=["GET"])
def api_health():
    return jsonify({"ok": True, "name": "guestbook", "t": _now()})


@app.route("/guests", methods=["GET", "POST"])
def api_guests():
    g = _load(GUESTBOOK_FILE, [])
    g = sorted(g, key=lambda a: -int(a.get("id", 0) or 0))
    try:
        us = _load(USER_FILE, {})
        before = len(us.get("__sessions", {}))
        us = _clean_sessions(us)
        after = len(us.get("__sessions", {}))
        if after != before:
            _save(USER_FILE, us)
        on = after
    except Exception:
        on = 0
    return jsonify({"ok": True, "list": g, "online": on})

@app.route("/guests_new", methods=["GET", "POST"])
def api_guests_new():
    since = 0
    if request.method == "POST":
        try:
            since = int((request.get_json() or {}).get("since") or 0)
        except Exception:
            since = 0
    else:
        try:
            since = int(request.args.get("since") or 0)
        except Exception:
            since = 0
    g = _load(GUESTBOOK_FILE, [])
    nl = [a for a in g if int(a.get("id", 0) or 0) > since]
    nl = sorted(nl, key=lambda a: -int(a.get("id", 0) or 0))
    try:
        us = _load(USER_FILE, {})
        before = len(us.get("__sessions", {}))
        us = _clean_sessions(us)
        after = len(us.get("__sessions", {}))
        if after != before:
            _save(USER_FILE, us)
        on = after
    except Exception:
        on = 0
    deleted = [d["id"] for d in DEL_LOG if d["t"] > _t.time() - 600]
    return jsonify({"ok": True, "list": nl, "online": on, "deleted": deleted, "total": len(g)})


@app.route("/guest_add", methods=["POST"])
def api_guest_add():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "请先登录后再留言"})
    if (_load(USER_FILE, {}).get(cu) or {}).get("banned"):
        return jsonify({"ok": False, "msg": "你已被拉黑，无法留言"})
    txt = str(p.get("text") or "").strip()[:500]
    if not txt:
        return jsonify({"ok": False, "msg": "内容不能为空"})
    g = _load(GUESTBOOK_FILE, [])
    nm = cu or ((str(p.get("name") or "").strip()[:16]) or "访客")
    nid = 1
    for x in g:
        nid = max(nid, int(x.get("id", 0) or 0) + 1)
    _av = str(p.get("avatar") or "").strip()
    if _av.startswith("/uploads/"):
        av = _av[:300]
    else:
        av = int(_av) if _av.isdigit() else 0
        av = av % 12
    im = str(p.get("image") or "").strip()[:300]
    rt = str(p.get("reply_to") or "").strip()[:8]
    g.append({"id": nid, "user": cu, "name": nm, "text": txt, "time": _now(), "avatar": av, "image": im, "reply_to": rt})
    _save(GUESTBOOK_FILE, g)
    _add_exp(_load(USER_FILE, {}), cu, 5)
    return jsonify({"ok": True, "id": nid})

@app.route("/post_get", methods=["GET", "POST"])
def api_post_get():
    ps = _load(POST_FILE, [])
    now = int(_time.time())
    res = []
    for x in ps:
        if x.get("capsule") and now < int(x.get("unveil") or 0):
            res.append({"id": x.get("id"), "capsule": x.get("capsule"),
                        "unveil": x.get("unveil"), "time": x.get("time"),
                        "shown": x.get("shown") or x.get("name") or x.get("user"), "sealed": True})
        else:
            x["sealed"] = False
            x["shown"] = x.get("shown") or x.get("name") or x.get("user")
            res.append(x)
    res = sorted(res, key=lambda a: (-len(a.get("likes") or []), -int(a.get("id", 0) or 0)))
    return jsonify({"ok": True, "list": res})

@app.route("/post_add", methods=["POST"])
def api_post_add():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "请先登录后再发帖"})
    if (_load(USER_FILE, {}).get(cu) or {}).get("banned"):
        return jsonify({"ok": False, "msg": "你已被拉黑，无法发帖"})
    txt = str(p.get("text") or "").strip()[:500]
    if not txt:
        return jsonify({"ok": False, "msg": "内容不能为空"})
    tags = [str(x).strip()[:8] for x in (p.get("tags") or []) if str(x).strip()][:3]
    im = str(p.get("image") or "").strip()[:300]
    ps = _load(POST_FILE, [])
    nid = 1
    for x in ps:
        nid = max(nid, int(x.get("id", 0) or 0) + 1)
    anon = bool(p.get("anon"))
    cap = int(p.get("capsule") or 0)
    unveil = 0
    if cap:
        unveil = int(_time.time()) + cap * 86400
    shown = ("匿名·%04d" % _random.randint(1000, 9999)) if anon else cu
    ps.append({"id": nid, "user": cu, "name": cu, "shown": shown, "text": txt, "tags": tags,
               "image": im, "time": _now(), "comments": [], "likes": [], "dislikes": [],
               "anon": anon, "capsule": cap, "unveil": unveil})
    _save(POST_FILE, ps)
    _add_exp(_load(USER_FILE, {}), cu, 8)
    _scan_at(txt, str(nid))
    return jsonify({"ok": True, "msg": "发布成功"})

@app.route("/post_del", methods=["POST"])
def api_post_del():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    adm = bool(us.get(cu, {}).get("is_admin"))
    ps = _load(POST_FILE, [])
    tar = [x for x in ps if str(x.get("id")) == str(p.get("id"))]
    if not tar:
        return jsonify({"ok": False, "msg": "帖子不存在"})
    if not adm and tar[0].get("user") != cu:
        return jsonify({"ok": False, "msg": "无权删除该帖"})
    ps = [x for x in ps if str(x.get("id")) != str(p.get("id"))]
    _save(POST_FILE, ps)
    _audit(cu, "del_post", str(tar[0].get("user") or "") + " 的帖 #" + str(tar[0].get("id") or ""), str(tar[0].get("title") or tar[0].get("text") or "")[:40])
    return jsonify({"ok": True, "msg": "已删除"})

@app.route("/comment_add", methods=["POST"])
def api_comment_add():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "请先登录后再评论"})
    if (_load(USER_FILE, {}).get(cu) or {}).get("banned"):
        return jsonify({"ok": False, "msg": "你已被拉黑，无法评论"})
    txt = str(p.get("text") or "").strip()[:200]
    if not txt:
        return jsonify({"ok": False, "msg": "评论不能为空"})
    ps = _load(POST_FILE, [])
    for x in ps:
        if str(x.get("id")) == str(p.get("pid")):
            cs = x.setdefault("comments", [])
            cid = 1
            for c0 in cs:
                cid = max(cid, int(c0.get("id", 0) or 0) + 1)
            canon = bool(p.get("anon"))
            cshown = ("匿名·%04d" % _random.randint(1000, 9999)) if canon else cu
            cs.append({"id": cid, "user": cu, "shown": cshown, "text": txt, "time": _now(), "likes": [], "dislikes": [], "anon": canon})
            _save(POST_FILE, ps)
            _add_exp(_load(USER_FILE, {}), cu, 3)
            _scan_at(txt, str(x.get("id")))
            _au = x.get("user") or ""
            if _au and _au != cu:
                _push_notify(_au, cu, "reply", txt, str(x.get("id")))
            return jsonify({"ok": True, "msg": "评论成功"})
    return jsonify({"ok": False, "msg": "帖子不存在"})

@app.route("/post_vote", methods=["POST"])
def api_post_vote():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    v = int(p.get("vote") or 0)
    if v not in (1, -1, 0):
        return jsonify({"ok": False, "msg": "参数错误"})
    ps = _load(POST_FILE, [])
    for x in ps:
        if str(x.get("id")) == str(p.get("pid")):
            L = x.setdefault("likes", [])
            D = x.setdefault("dislikes", [])
            if v == 1:
                if cu not in L: L.append(cu)
                if cu in D: D.remove(cu)
            elif v == -1:
                if cu not in D: D.append(cu)
                if cu in L: L.remove(cu)
            else:
                if cu in L: L.remove(cu)
                if cu in D: D.remove(cu)
            _save(POST_FILE, ps)
            return jsonify({"ok": True, "like": len(L), "dislike": len(D)})
    return jsonify({"ok": False, "msg": "帖子不存在"})

@app.route("/comment_vote", methods=["POST"])
def api_comment_vote():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    v = int(p.get("vote") or 0)
    if v not in (1, -1, 0):
        return jsonify({"ok": False, "msg": "参数错误"})
    ps = _load(POST_FILE, [])
    for x in ps:
        if str(x.get("id")) == str(p.get("pid")):
            for c0 in x.setdefault("comments", []):
                if str(c0.get("id")) == str(p.get("cid")):
                    L = c0.setdefault("likes", [])
                    D = c0.setdefault("dislikes", [])
                    if v == 1:
                        if cu not in L: L.append(cu)
                        if cu in D: D.remove(cu)
                    elif v == -1:
                        if cu not in D: D.append(cu)
                        if cu in L: L.remove(cu)
                    else:
                        if cu in L: L.remove(cu)
                        if cu in D: D.remove(cu)
                    _save(POST_FILE, ps)
                    return jsonify({"ok": True, "like": len(L), "dislike": len(D)})
            return jsonify({"ok": False, "msg": "评论不存在"})
    return jsonify({"ok": False, "msg": "帖子不存在"})

@app.route("/notice_get", methods=["GET", "POST"])
def api_notice_get():
    ns = _load(NOTICE_FILE, [])
    ns = sorted(ns, key=lambda a: -int(a.get("id", 0) or 0))
    return jsonify({"ok": True, "list": ns})

@app.route("/notice_add", methods=["POST"])
def api_notice_add():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    t = str(p.get("text") or "").strip()[:120]
    if not t:
        return jsonify({"ok": False, "msg": "内容不能为空"})
    ns = _load(NOTICE_FILE, [])
    nid = 1
    for x in ns:
        nid = max(nid, int(x.get("id", 0) or 0) + 1)
    ns.append({"id": nid, "text": t, "time": _now(), "author": cu})
    _save(NOTICE_FILE, ns)
    return jsonify({"ok": True, "msg": "公告已发布"})

@app.route("/notice_del", methods=["POST"])
def api_notice_del():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    ns = _load(NOTICE_FILE, [])
    ns = [x for x in ns if str(x.get("id")) != str(p.get("id"))]
    _save(NOTICE_FILE, ns)
    return jsonify({"ok": True, "msg": "已删除"})

@app.route("/hit", methods=["POST"])
def api_hit():
    p = request.get_json() or {}
    st = _load(STAT_FILE, {})
    today = _time.strftime("%Y-%m-%d")
    if st.get("date") != today:
        st = {"date": today, "visits": 0, "today_visits": 0, "visitors": {}}
    st["visits"] = int(st.get("visits") or 0) + 1
    st["today_visits"] = int(st.get("today_visits") or 0) + 1
    nm = str(p.get("name") or "").strip()[:16] or "访客"
    st.setdefault("visitors", {})[nm] = int(st["visitors"].get(nm) or 0) + 1
    fp = st.setdefault("footprint", [])
    fp.insert(0, {"name": nm, "time": _time.strftime("%Y-%m-%d %H:%M")})
    st["footprint"] = fp[:200]
    _save(STAT_FILE, st)
    return jsonify({"ok": True, "visits": st["visits"], "today": st["today_visits"]})

@app.route("/stats_get", methods=["GET", "POST"])
def api_stats_get():
    st = _load(STAT_FILE, {})
    return jsonify({"ok": True, "visits": st.get("visits") or 0,
                    "today": st.get("today_visits") or 0,
                    "visitors": len(st.get("visitors") or {})})

@app.route("/daily_puzzle", methods=["GET", "POST"])
def api_daily_puzzle():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    us = _load(USER_FILE, {})
    today = _time.strftime("%Y-%m-%d")
    done = bool(cu and (us.get(cu) or {}).get("puz") == today)
    return jsonify({"ok": True, "date": today, "done": done,
                    "hint": "8 位数字口令：今日日期(2位)+00+(日×7 后两位)，可用解码器自行推算",
                    "pts": 30})

@app.route("/puzzle_answer", methods=["POST"])
def api_puzzle_answer():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    today = _time.strftime("%Y-%m-%d")
    b = int(_time.strftime("%d"))
    key = "%02d00%02d" % (b, (b * 7) % 100)
    us = _load(USER_FILE, {})
    rec = us.setdefault(cu, {})
    if rec.get("puz") == today:
        return jsonify({"ok": True, "done": True, "msg": "今日口令已答过"})
    ans = str(p.get("answer") or "").strip()
    if ans != key:
        return jsonify({"ok": False, "msg": "口令错误，再用解码器试试"})
    rec["puz"] = today
    rec["pts"] = int(rec.get("pts") or 0) + 30
    _save(USER_FILE, us)
    _add_exp(_load(USER_FILE, {}), cu, 20)
    return jsonify({"ok": True, "done": True, "pts": int(rec.get("pts") or 0),
                    "exp": int((us.get(cu) or {}).get("exp") or 0), "msg": "口令正确，+30 积分"})

@app.route("/checkin_status", methods=["GET", "POST"])
def api_checkin_status():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    ck = (us.get(cu) or {}).get("checkin") or {}
    today = _time.strftime("%Y-%m-%d")
    stk = ck.get("streak") or 0
    badge = "30" if stk >= 30 else ("7" if stk >= 7 else ("3" if stk >= 3 else ""))
    return jsonify({"ok": True, "done": ck.get("date") == today,
                    "streak": stk, "total": ck.get("total") or 0,
                    "badge": badge,
                    "ckdays": (ck.get("days") or [])[-60:],
                    "pts": int((us.get(cu) or {}).get("pts") or 0),
                    "exp": int((us.get(cu) or {}).get("exp") or 0)})

@app.route("/checkin", methods=["POST"])
def api_checkin():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    rec = us.setdefault(cu, {})
    today = _time.strftime("%Y-%m-%d")
    ck = rec.get("checkin") or {}
    if ck.get("date") == today:
        return jsonify({"ok": True, "done": True, "streak": ck.get("streak") or 0,
                        "total": ck.get("total") or 0})
    y = _time.strftime("%Y-%m-%d", _time.localtime(_time.time() - 86400))
    streak = (ck.get("streak") or 0) + 1 if ck.get("date") == y else 1
    total = (ck.get("total") or 0) + 1
    days = ck.get("days") or []
    days.append(today)
    if len(days) > 400:
        days = days[-400:]
    rec["checkin"] = {"date": today, "streak": streak, "total": total, "days": days}
    bonus = 5 if streak >= 3 else 0
    bonus = bonus + 10 if streak >= 7 else bonus
    bonus = bonus + 50 if streak >= 30 else bonus
    rec["pts"] = int(rec.get("pts") or 0) + 10 + bonus
    _save(USER_FILE, us)
    _add_exp(_load(USER_FILE, {}), cu, 10)
    badge = "30" if streak >= 30 else ("7" if streak >= 7 else ("3" if streak >= 3 else ""))
    return jsonify({"ok": True, "done": False, "streak": streak, "total": total,
                    "badge": badge, "pts": int(rec.get("pts") or 0)})

@app.route("/visitors_get", methods=["GET", "POST"])
def api_visitors_get():
    st = _load(STAT_FILE, {})
    vs = st.get("visitors") or {}
    arr = sorted(vs.items(), key=lambda kv: -kv[1])[:20]
    return jsonify({"ok": True, "visits": st.get("visits") or 0,
                    "today": st.get("today_visits") or 0,
                    "list": [{"name": k, "n": v} for k, v in arr]})



@app.route("/garden_get", methods=["GET", "POST"])
def api_garden_get():
    d = _load(GARDEN_FILE, {})
    return jsonify({"ok": True, "plants": d.get("plants") or [], "care_total": d.get("care_total") or 0})

@app.route("/garden_plant", methods=["POST"])
def api_garden_plant():
    p = request.get_json() or {}
    d = _load(GARDEN_FILE, {})
    pl = d.get("plants") or []
    nid = d.get("seq", 0) + 1
    pl.append({"id": nid, "sp": int(p.get("sp") or 1), "u": str(p.get("u") or "游客")[:16],
               "g": 0.5, "c": 0, "t": int(_t.time() * 1000), "msgs": []})
    d["plants"] = pl[-200:]
    d["seq"] = nid
    _save(GARDEN_FILE, d)
    return jsonify({"ok": True, "id": nid})

@app.route("/garden_note", methods=["POST"])
def api_garden_note():
    p = request.get_json() or {}
    d = _load(GARDEN_FILE, {})
    pl = d.get("plants") or []
    for x in pl:
        if str(x.get("id")) == str(p.get("id")):
            ms = x.get("msgs") or []
            ms.append({"u": str(p.get("u") or "游客")[:16], "tx": str(p.get("tx") or "")[:120], "t": int(_t.time() * 1000)})
            x["msgs"] = ms[-12:]
            _save(GARDEN_FILE, d)
            return jsonify({"ok": True})
    return jsonify({"ok": False, "msg": "植物不存在"})

@app.route("/garden_care", methods=["POST"])
def api_garden_care():
    p = request.get_json() or {}
    d = _load(GARDEN_FILE, {})
    pl = d.get("plants") or []
    for x in pl:
        if str(x.get("id")) == str(p.get("id")):
            x["g"] = min(1.0, (x.get("g") or 0.5) + 0.12)
            x["c"] = (x.get("c") or 0) + 1
            d["care_total"] = (d.get("care_total") or 0) + 1
            _save(GARDEN_FILE, d)
            return jsonify({"ok": True, "care_total": d.get("care_total")})
    return jsonify({"ok": False, "msg": "植物不存在"})

@app.route("/guest_resonate", methods=["POST"])
def api_guest_resonate():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "请先登录后再共鸣"})
    g = _load(GUESTBOOK_FILE, [])
    for x in g:
        if str(x.get("id")) == str(p.get("id")):
            rs = x.get("reson") or []
            if cu in rs:
                rs = [u for u in rs if u != cu]
            else:
                rs.append(cu)
            x["reson"] = rs
            _save(GUESTBOOK_FILE, g)
            return jsonify({"ok": True, "reson": rs, "n": len(rs)})
    return jsonify({"ok": False, "msg": "留言不存在"})

@app.route("/guest_like", methods=["POST"])
def api_guest_like():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "请先登录后再点赞"})
    g = _load(GUESTBOOK_FILE, [])
    for x in g:
        if str(x.get("id")) == str(p.get("id")):
            ls = x.get("likes") or []
            if cu in ls:
                ls = [u for u in ls if u != cu]
            else:
                ls.append(cu)
            x["likes"] = ls
            _save(GUESTBOOK_FILE, g)
            _add_exp(_load(USER_FILE, {}), cu, 2)
            return jsonify({"ok": True, "likes": len(ls)})
    return jsonify({"ok": False, "msg": "留言不存在"})

@app.route("/change_pwd", methods=["POST"])
def api_change_pwd():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    old = str(p.get("old") or "")
    new = str(p.get("new") or "")
    if not old or not new or len(new) < 4 or len(new) > 32:
        return jsonify({"ok": False, "msg": "新密码需 4-32 位"})
    us = _load(USER_FILE, {})
    rec = us.get(cu)
    if not rec or rec.get("pwd") != old:
        return jsonify({"ok": False, "msg": "旧密码错误"})
    rec["pwd"] = new
    _save(USER_FILE, us)
    return jsonify({"ok": True, "msg": "密码已修改"})

@app.route("/guest_del", methods=["POST"])
def api_guest_del():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    g = _load(GUESTBOOK_FILE, [])
    tar = [x for x in g if str(x.get("id")) == str(p.get("id"))]
    if not tar:
        return jsonify({"ok": False, "msg": "留言不存在"})
    t = tar[0]
    adm = False
    us = _load(USER_FILE, {})
    if us.get(cu, {}).get("is_admin"):
        adm = True
    if not adm and t.get("user") != cu:
        return jsonify({"ok": False, "msg": "无权删除该留言"})
    n = [x for x in g if str(x.get("id")) != str(p.get("id"))]
    _save(GUESTBOOK_FILE, n)
    _audit(cu, "del_guest", str(t.get("name") or "") + " 的留言 #" + str(t.get("id") or ""), str(t.get("text") or "")[:40])
    DEL_LOG.append({"id": int(t.get("id", 0)), "t": _t.time()})
    if len(DEL_LOG) > 200:
        del DEL_LOG[:100]
    return jsonify({"ok": True, "msg": "已删除"})

import base64 as _b64
import uuid as _uuid
from flask import send_from_directory

UP_DIR = os.path.join(_BASE, "uploads")
os.makedirs(UP_DIR, exist_ok=True)

@app.route("/upload", methods=["POST"])
def api_upload():
    p = request.get_json() or {}
    data = str(p.get("data") or "")
    if not data or len(data) > 4 * 1024 * 1024:
        return jsonify({"ok": False, "msg": "图片数据无效或过大"}), 400
    try:
        raw = _b64.b64decode(data.split(",")[-1])
    except Exception:
        return jsonify({"ok": False, "msg": "图片编码错误"}), 400
    if not raw or len(raw) > 2 * 1024 * 1024:
        return jsonify({"ok": False, "msg": "图片超过 2MB 限制"}), 413
    fn = _uuid.uuid4().hex[:12] + ".png"
    with open(os.path.join(UP_DIR, fn), "wb") as f:
        f.write(raw)
    return jsonify({"ok": True, "url": "/uploads/" + fn})

@app.route("/uploads/<fn>", methods=["GET"])
def api_uploads(fn):
    return send_from_directory(UP_DIR, fn)

@app.route("/logout", methods=["POST"])
def api_logout():
    p = request.get_json() or {}
    try:
        with open(USER_FILE, "r", encoding="utf-8") as f:
            u = json.load(f)
        if p.get("token") and p.get("token") in u.get("__sessions", {}):
            del u["__sessions"][p.get("token")]
            _save(USER_FILE, u)
    except Exception:
        pass
    return jsonify({"ok": True})

@app.route("/ping", methods=["POST"])
def api_ping():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "未登录"})
    return jsonify({"ok": True})

@app.route("/admin_users", methods=["POST"])
def api_admin_users():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    if _is_root(cu, us):
        us = _clean_sessions(us)
        ses = us.get("__sessions", {})
        now = _time.time()
        lst = [{"name": k, "pwd": v.get("pwd", ""), "is_admin": bool(v.get("is_admin")),
                "is_root": bool(v.get("is_root")) or k == ROOT,
                "banned": bool(v.get("banned")),
                "online": any(isinstance(s, list) and s[0] == k and s[1] > now - 300 for s in ses.values())}
               for k, v in us.items() if k != "__sessions"]
        lst.sort(key=lambda a: -int(a["is_admin"]))
        return jsonify({"ok": True, "list": lst, "root": True})
    lst = [{"name": k, "banned": bool((us.get(k) or {}).get("banned"))} for k in us if k != "__sessions"]
    lst.sort(key=lambda a: a["name"])
    return jsonify({"ok": True, "list": lst, "root": False})


@app.route("/admin_set_admin", methods=["POST"])
def api_admin_set_admin():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    if not _is_root(cu, us):
        return jsonify({"ok": False, "msg": "仅最高管理员可授予或撤销"})
    tgt = str(p.get("target") or "").strip()
    adm = bool(p.get("admin"))
    if not tgt or tgt == "__sessions" or tgt not in us:
        return jsonify({"ok": False, "msg": "账号不存在"})
    if tgt == cu:
        return jsonify({"ok": False, "msg": "不能修改自己的管理员状态"})
    us[tgt]["is_admin"] = adm
    _save(USER_FILE, us)
    return jsonify({"ok": True, "msg": ("已授予" if adm else "已取消") + "管理员：" + tgt})


@app.route("/admin_del_user", methods=["POST"])
def api_admin_del_user():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    tgt = str(p.get("target") or "").strip()
    if not tgt or tgt == "__sessions" or tgt not in us:
        return jsonify({"ok": False, "msg": "账号不存在"})
    if tgt == cu:
        return jsonify({"ok": False, "msg": "不能删除自己"})
    if _is_root(tgt, us):
        return jsonify({"ok": False, "msg": "不能删除最高管理员"})
    if us[tgt].get("is_admin") and not _is_root(cu, us):
        return jsonify({"ok": False, "msg": "仅最高管理员可删除管理员"})
    us_old = dict(us)
    del us[tgt]
    ses = us.get("__sessions", {})
    for k in [k for k, v in ses.items() if (v[0] if isinstance(v, list) else v) == tgt]:
        del ses[k]
    _save(USER_FILE, us)
    uip = (us_old.get(tgt) or {}).get("ip") or ""
    if uip:
        bi = _load(BANNED_IP_FILE, {})
        bi[uip] = {"t": _time.time(), "by": cu, "name": tgt}
        _save(BANNED_IP_FILE, bi)
    _audit(cu, "del_user", tgt, "删除账号" + ("并标记危险IP(24h禁注册)" if uip else ""))
    return jsonify({"ok": True, "msg": "已删除用户：" + tgt})



@app.route("/admin_banned_get", methods=["GET", "POST"])
def api_admin_banned_get():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    bi = _load(BANNED_IP_FILE, {})
    now = _time.time()
    out = []
    for ip, b in bi.items():
        t = float(b.get("t") or 0)
        if now - t >= 86400:
            continue
        out.append({"ip": ip, "name": b.get("name") or "", "time": _time.strftime("%Y-%m-%d %H:%M:%S", _time.localtime(t)),
                    "by": b.get("by") or "", "remain": int(86400 - (now - t))})
    return jsonify({"ok": True, "list": sorted(out, key=lambda x: x["remain"])})


@app.route("/admin_banned_clear", methods=["POST"])
def api_admin_banned_clear():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    ip = str(p.get("ip") or "").strip()
    bi = _load(BANNED_IP_FILE, {})
    if ip in bi:
        del bi[ip]
        _save(BANNED_IP_FILE, bi)
        _audit(cu, "banned_clear", ip, "解除危险IP禁注册")
        return jsonify({"ok": True, "msg": "已解除 " + ip + " 的禁注册限制"})
    return jsonify({"ok": False, "msg": "该 IP 不在禁注册名单"})


@app.route("/token_state", methods=["GET", "POST"])
def api_token_state():
    p = request.get_json() or {}
    tok = str(p.get("token") or "").strip()
    if not tok:
        return jsonify({"ok": True, "state": "none"})
    us = _load(USER_FILE, {})
    ses = us.get("__sessions", {})
    v = ses.get(tok)
    if not v:
        return jsonify({"ok": True, "state": "kicked"})
    name = v[0] if isinstance(v, list) else v
    t = v[1] if isinstance(v, list) else 0
    if _time.time() - t > 86400:
        return jsonify({"ok": True, "state": "expired", "name": name})
    if name not in us:
        return jsonify({"ok": True, "state": "deleted", "name": name})
    return jsonify({"ok": True, "state": "valid", "name": name})
@app.route("/risk_words_get", methods=["GET", "POST"])
def api_risk_words_get():
    return jsonify({"ok": True, "words": _load(RISK_FILE, [])})


@app.route("/risk_words_add", methods=["POST"])
def api_risk_words_add():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    raw = p.get("words") or []
    if isinstance(raw, str):
        raw = [w for w in raw.replace("，", ",").split(",") if w.strip()]
    ws = _load(RISK_FILE, [])
    for w in raw:
        w = str(w).strip()[:20]
        if w and w not in ws:
            if len(ws) >= 50:
                return jsonify({"ok": False, "words": ws, "msg": "关键词已达上限 50 个"})
            ws.append(w)
    _save(RISK_FILE, ws)
    return jsonify({"ok": True, "words": ws, "msg": "已上传 " + str(len(raw)) + " 个关键词"})


@app.route("/risk_words_del", methods=["POST"])
def api_risk_words_del():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    w = str(p.get("word") or "").strip()
    ws = _load(RISK_FILE, [])
    if w in ws:
        ws.remove(w)
        _save(RISK_FILE, ws)
    return jsonify({"ok": True, "words": ws, "msg": "已删除关键词：" + w})


@app.route("/admin_scan", methods=["POST"])
def api_admin_scan():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    kw = str(p.get("kw") or "").strip().lower()
    words = _load(RISK_FILE, [])
    if kw:
        words = [kw]
    elif not words:
        return jsonify({"ok": True, "hits": [], "words": [], "msg": "未上传风控关键词"})
    words = [w.strip().lower()[:20] for w in words if w and w.strip()]
    g = _load(GUESTBOOK_FILE, [])
    ps = _load(POST_FILE, [])
    pm = _load(PM_FILE, {})
    hit = []
    for u in us:
        if u == "__sessions" or _is_root(u, us) or u == cu:
            continue
        if us[u].get("is_admin"):
            continue
        m = any(w in u.lower() for w in words)
        if not m:
            for x in g:
                if (x.get("name") or "") == u and any(w in str(x.get("text") or "").lower() for w in words):
                    m = True
                    break
        if not m:
            for x in ps:
                if (x.get("user") or "") != u:
                    continue
                if any(w in str(x.get("title") or "").lower() for w in words) or any(w in str(x.get("text") or "").lower() for w in words):
                    m = True
                    break
                for c in x.get("comments") or []:
                    if (c.get("user") or "") == u and any(w in str(c.get("text") or "").lower() for w in words):
                        m = True
                        break
                if m:
                    break
        if not m:
            pmc = pm.values() if isinstance(pm, dict) else pm
            for cc in pmc:
                msgs = cc if isinstance(cc, list) else ([cc] if isinstance(cc, dict) else [])
                for m2 in msgs:
                    if not isinstance(m2, dict):
                        continue
                    f = m2.get("from") or ""
                    t = m2.get("to") or ""
                    if (f == u or t == u) and any(w in str(m2.get("msg") or "").lower() for w in words):
                        m = True
                        break
                if m:
                    break
        if m:
            hit.append(u)
    if not hit:
        return jsonify({"ok": True, "hits": [], "words": words, "msg": "已扫描 " + str(len(words)) + " 个关键词，未发现匹配用户"})
    for u in hit:
        del us[u]
    g = [x for x in g if (x.get("name") or "") not in hit]
    ps = [x for x in ps if (x.get("user") or "") not in hit]
    for x in ps:
        x["comments"] = [c for c in (x.get("comments") or []) if (c.get("user") or "") not in hit]
    if isinstance(pm, dict):
        for k2 in list(pm.keys()):
            pm[k2] = [m2 for m2 in (pm[k2] or []) if isinstance(m2, dict) and (m2.get("from") or "") not in hit and (m2.get("to") or "") not in hit]
            if not pm[k2]:
                del pm[k2]
    else:
        pm = [m2 for m2 in pm if not isinstance(m2, dict) or ((m2.get("from") or "") not in hit and (m2.get("to") or "") not in hit)]
    ses = us.get("__sessions", {})
    for k in [k for k, v in ses.items() if (v[0] if isinstance(v, list) else v) in hit]:
        del ses[k]
    _save(USER_FILE, us)
    _save(GUESTBOOK_FILE, g)
    _save(POST_FILE, ps)
    _save(PM_FILE, pm)
    _audit(cu, "risk_scan", "关键词: " + ",".join(words), "管理员手动扫描触发，风控删除 " + str(len(hit)) + " 人: " + ",".join(hit))
    return jsonify({"ok": True, "hits": hit, "words": words, "msg": "已风控删除 " + str(len(hit)) + " 个用户"})


@app.route("/admin_del_session", methods=["POST"])
def api_admin_del_session():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    ses = us.setdefault("__sessions", {})
    n = 0
    t = str(p.get("session") or "").strip()
    u2 = str(p.get("user") or "").strip()
    if t:
        if t in ses:
            del ses[t]
            n = 1
    elif u2:
        for k in [k for k, v in ses.items() if (v[0] if isinstance(v, list) else v) == u2]:
            del ses[k]
            n += 1
    else:
        return jsonify({"ok": False, "msg": "缺少参数"})
    _save(USER_FILE, us)
    _audit(cu, "del_session", t or (u2 + " 全部会话"), "删除会话 " + str(n) + " 个")
    return jsonify({"ok": True, "n": n, "msg": "已删除 " + str(n) + " 个会话"})

@app.route("/admin_del_comment", methods=["POST"])
def api_admin_del_comment():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    adm = bool(us.get(cu, {}).get("is_admin"))
    ps = _load(POST_FILE, [])
    for x in ps:
        if str(x.get("id")) == str(p.get("pid")):
            cs = x.get("comments") or []
            try:
                i = int(p.get("idx"))
            except Exception:
                return jsonify({"ok": False, "msg": "参数错误"})
            if i < 0 or i >= len(cs):
                return jsonify({"ok": False, "msg": "评论不存在"})
            c = cs[i]
            if not adm and x.get("user") != cu and c.get("user") != cu:
                return jsonify({"ok": False, "msg": "无权删除该评论"})
            del cs[i]
            _save(POST_FILE, ps)
            _audit(cu, "del_comment", "帖 #" + str(x.get("id")) + " 评论@" + str(c.get("user") or ""), str(c.get("text") or "")[:40])
            return jsonify({"ok": True, "msg": "已删除"})
    return jsonify({"ok": False, "msg": "帖子不存在"})
@app.route("/admin_ban_user", methods=["POST"])
def api_admin_ban_user():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    tgt = str(p.get("target") or "").strip()
    ban = bool(p.get("ban"))
    if not tgt or tgt == "__sessions" or tgt not in us:
        return jsonify({"ok": False, "msg": "账号不存在"})
    if tgt == cu:
        return jsonify({"ok": False, "msg": "不能拉黑自己"})
    if _is_root(tgt, us):
        return jsonify({"ok": False, "msg": "不能拉黑最高管理员"})
    if us[tgt].get("is_admin") and not _is_root(cu, us):
        return jsonify({"ok": False, "msg": "仅最高管理员可拉黑管理员"})
    us[tgt]["banned"] = ban
    _save(USER_FILE, us)
    _audit(cu, "ban_user" if ban else "unban_user", tgt, "拉黑" if ban else "解除拉黑")
    return jsonify({"ok": True, "msg": (("已拉黑" if ban else "已解除拉黑") + "：" + tgt)})


@app.route("/changelog_get", methods=["GET", "POST"])
def api_changelog_get():
    return jsonify({"ok": True, "list": _load(CHANGELOG_FILE, [])})


@app.route("/changelog_add", methods=["POST"])
def api_changelog_add():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    title = str(p.get("title") or "").strip()[:60]
    items = [str(x).strip()[:200] for x in (p.get("items") or []) if str(x).strip()][:20]
    if not title and not items:
        return jsonify({"ok": False, "msg": "内容不能为空"})
    cl = _load(CHANGELOG_FILE, [])
    mid = max([int(x.get("id", 0) or 0) for x in cl] or [0]) + 1
    cl.insert(0, {"id": mid, "title": title, "items": items,
                  "image": str(p.get("image") or "")[:300],
                  "user": cu, "time": _now()})
    _save(CHANGELOG_FILE, cl)
    return jsonify({"ok": True, "msg": "已发布更新日志"})


@app.route("/changelog_del", methods=["POST"])
def api_changelog_del():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    cl = _load(CHANGELOG_FILE, [])
    n = [x for x in cl if str(x.get("id")) != str(p.get("id"))]
    if len(n) == len(cl):
        return jsonify({"ok": False, "msg": "记录不存在"})
    _save(CHANGELOG_FILE, n)
    return jsonify({"ok": True, "msg": "已删除"})


@app.route("/me", methods=["GET", "POST"])
def api_me():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    rec = us.get(cu) or {}
    exp = int(rec.get("exp") or 0)
    info = _lvl_info(exp)
    ck = rec.get("checkin") or {}
    info.update({"username": cu, "is_admin": bool(rec.get("is_admin")),
                 "exp": exp, "streak": ck.get("streak") or 0, "total": ck.get("total") or 0})
    return jsonify({"ok": True, "me": info})


@app.route("/score_add", methods=["POST"])
def api_score_add():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    game = str(p.get("game") or "").strip()[:24]
    try:
        score = int(p.get("score") or 0)
    except Exception:
        return jsonify({"ok": False, "msg": "分数格式错误"})
    if not game or score <= 0:
        return jsonify({"ok": False, "msg": "参数错误"})
    sc = _load(SCORE_FILE, {})
    lst = sc.setdefault(game, [])
    found = None
    for x in lst:
        if x.get("user") == cu:
            found = x
            break
    if found:
        old = int(found.get("score") or 0)
        nw = score > old
        if nw:
            found["score"] = score
            found["time"] = _now()
            _save(SCORE_FILE, sc)
        pts = 10 if nw else 2
        ep = 5 if nw else 2
        tp, te = _award(cu, pts, ep)
        return jsonify({"ok": True, "best": int(found.get("score") or 0), "new": nw,
                        "pts": tp, "exp": te, "gain": pts, "gain_exp": ep})
    lst.append({"user": cu, "score": score, "time": _now()})
    lst.sort(key=lambda x: -int(x.get("score") or 0))
    _save(SCORE_FILE, sc)
    tp, te = _award(cu, 10, 5)
    return jsonify({"ok": True, "best": score, "new": True,
                    "pts": tp, "exp": te, "gain": 10, "gain_exp": 5})


@app.route("/score_top", methods=["GET", "POST"])
def api_score_top():
    game = ""
    if request.method == "POST":
        game = str((request.get_json() or {}).get("game") or "")
    else:
        game = str(request.args.get("game") or "")
    limit = 10
    try:
        limit = int(request.args.get("limit") or 10) if request.method == "GET" else int((request.get_json() or {}).get("limit") or 10)
    except Exception:
        limit = 10
    sc = _load(SCORE_FILE, {})
    lst = sorted(sc.get(game, []), key=lambda x: -int(x.get("score") or 0))[:limit]
    return jsonify({"ok": True, "list": lst})


@app.route("/achievements", methods=["GET", "POST"])
def api_achievements():
    items = [{"n": n, "h": h} for n, h in ACH_LIST["items"]]
    return jsonify({"ok": True, "base": ACH_LIST["n"], "total": len(items), "items": items})


@app.route("/shop", methods=["GET", "POST"])
def api_shop():
    return jsonify({"ok": True, "list": [dict(x) for x in SHOP]})


TFRAG_MIN = 30
TFRAG_PAGES = ['index.html','prts.html','守夜人论坛.html','卡塞尔学院官网.html','终端接口.html','机密终端.html','PRTS泰拉大典终端.html','莱茵生命终端.html','技能树.html','模组开发.html','解码器.html','guestwall.html','changelog.html','游戏-01.html','游戏-02.html','游戏-03.html','游戏-04.html','游戏-05.html','游戏-06.html','游戏-07.html','游戏-08.html']


def _thash(s):
    h = 0
    for ch in str(s):
        h = (h * 131 + ord(ch)) % 100000007
    return h


def _tfrag_slots(day):
    out = []
    for i in range(4):
        out.append(360 + i * 270 + _thash("%s#%d" % (day, i)) % 240)
    return out
TFRAG_TXT = [
    ("晨间残留", "在还没人上线的时候凝出来的，凉得像铁。"),
    ("正午刻度", "太阳最高的时候它最清楚。"),
    ("黄昏碎片", "颜色一直在变，抓不住的那种。"),
    ("午夜回声", "你听到的是三秒前的自己。"),
    ("凌晨残响", "这段本来不该被人听见。"),
    ("午间静默", "世界安静了一瞬，它就在那时候出现。"),
    ("傍晚余温", "摸上去还是暖的，像谁刚走。"),
    ("深夜坐标", "它只标一个位置，而且只标一次。"),
    ("破晓切片", "边缘在褪色，天亮前会消失。"),
    ("日照倾角", "它在记录光的角度。"),
    ("子夜钟摆", "一秒一次，从不停。"),
    ("黎明前", "最难熬的那一段，它陪着你。"),
]


def _tfrag_day():
    return _time.strftime("%Y-%m-%d")


def _tfrag_page(spawn):
    return TFRAG_PAGES[_thash(spawn + "@p") % len(TFRAG_PAGES)]


def _tfrag_info(now=None):
    t = now or _time.localtime()
    day = _tfrag_day()
    slots = _tfrag_slots(day)
    v = t.tm_hour * 3600 + t.tm_min * 60 + t.tm_sec
    for i, st in enumerate(slots):
        lo = st * 60
        hi = lo + TFRAG_MIN * 60
        sp = "%s#%d" % (day, i)
        if lo <= v < hi:
            return {"open": True, "spawn": sp, "left": hi - v, "next": 0,
                    "page": _tfrag_page(sp)}
    for i, st in enumerate(slots):
        if v < st * 60:
            sp = "%s#%d" % (day, i)
            return {"open": False, "spawn": sp, "left": 0, "next": st * 60 - v,
                    "page": _tfrag_page(sp)}
    nd = _time.strftime("%Y-%m-%d", _time.localtime(_time.mktime(t) + 86400))
    sp = "%s#0" % nd
    return {"open": False, "spawn": sp, "left": 0,
            "next": 86400 - v + _tfrag_slots(nd)[0] * 60, "page": _tfrag_page(sp)}


def _tfrag_name(spawn):
    h = 0
    for ch in str(spawn):
        h = (h * 131 + ord(ch)) % 100000007
    return TFRAG_TXT[h % len(TFRAG_TXT)]


@app.route("/tfrag", methods=["GET", "POST"])
def api_tfrag():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    info = _tfrag_info()
    us = _load(USER_FILE, {})
    mine = []
    if cu:
        mine = (us.get(cu) or {}).get("tfrags") or []
    if not isinstance(mine, list):
        mine = []
    caught_today = info["spawn"] in [str(x) for x in mine]
    return jsonify({"ok": True, "open": info["open"], "left": info["left"],
                    "next": info["next"], "spawn": info["spawn"],
                    "page": info.get("page", ""),
                    "caught_today": caught_today, "count": len(mine),
                    "now": _now()})


@app.route("/tfrag_catch", methods=["POST"])
def api_tfrag_catch():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    info = _tfrag_info()
    if not info["open"]:
        return jsonify({"ok": False, "msg": "时间碎片还没出现", "open": False, "next": info["next"]})
    if info["left"] < 0:
        return jsonify({"ok": False, "msg": "这一场已经结束了", "open": False, "next": info["next"]})
    if p.get("page") != info.get("page"):
        return jsonify({"ok": False, "msg": "它不在这一页", "open": True,
                        "page": info.get("page", "")})
    spawn = info["spawn"]
    us = _load(USER_FILE, {})
    rec = us.setdefault(cu, {})
    mine = rec.get("tfrags") or []
    if not isinstance(mine, list):
        mine = []
    if spawn in [str(x) for x in mine]:
        return jsonify({"ok": True, "new": False, "spawn": spawn, "count": len(mine),
                        "msg": "这一场已经收过了"})
    mine.append(spawn)
    rec["tfrags"] = mine[-200:]
    _save(USER_FILE, us)
    nm, dsc = _tfrag_name(spawn)
    _award(cu, 15, 12)
    return jsonify({"ok": True, "new": True, "spawn": spawn, "name": nm, "desc": dsc,
                    "count": len(rec["tfrags"]), "gain": 15, "gain_exp": 12})


@app.route("/frags", methods=["GET", "POST"])
def api_frags():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    us = _load(USER_FILE, {})
    mine = []
    if cu:
        mine = (us.get(cu) or {}).get("frags") or []
    if not isinstance(mine, list):
        mine = []
    got = set(int(x) for x in mine if str(x).strip().isdigit())
    items = [{"n": f["n"], "t": f["t"], "d": f["d"] if f["n"] in got else "",
              "got": f["n"] in got} for f in FRAGS]
    return jsonify({"ok": True, "total": len(FRAGS), "mine": sorted(got), "items": items})


@app.route("/frag_get", methods=["POST"])
def api_frag_get():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    try:
        n = int(p.get("n") or 0)
    except Exception:
        return jsonify({"ok": False, "msg": "参数错误"})
    if n < 1 or n > len(FRAGS):
        return jsonify({"ok": False, "msg": "碎片编号无效"})
    us = _load(USER_FILE, {})
    rec = us.setdefault(cu, {})
    mine = rec.get("frags") or []
    if not isinstance(mine, list):
        mine = []
    if n in [int(x) for x in mine if str(x).strip().isdigit()]:
        return jsonify({"ok": True, "new": False, "n": n, "count": len(mine), "total": len(FRAGS)})
    mine.append(n)
    rec["frags"] = mine
    _save(USER_FILE, us)
    f = FRAGS[n - 1]
    _add_exp(_load(USER_FILE, {}), cu, 5)
    return jsonify({"ok": True, "new": True, "n": n, "t": f["t"], "d": f["d"],
                    "count": len(mine), "total": len(FRAGS),
                    "all": len(mine) >= len(FRAGS)})


@app.route("/buy", methods=["GET", "POST"])
def api_buy():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    iid = str(p.get("id") or "").strip()[:32]
    item = None
    for x in SHOP:
        if x["id"] == iid:
            item = x
            break
    if not item:
        return jsonify({"ok": False, "msg": "商品不存在"})
    us = _load(USER_FILE, {})
    rec = us.setdefault(cu, {})
    owned = rec.get("items") or []
    if not isinstance(owned, list):
        owned = []
    if iid in owned:
        return jsonify({"ok": False, "msg": "已经拥有了"})
    pts = int(rec.get("pts") or 0)
    cost = int(item["cost"])
    if pts < cost:
        return jsonify({"ok": False, "msg": "积分不足，还差 %d 分" % (cost - pts), "pts": pts})
    rec["pts"] = pts - cost
    owned.append(iid)
    rec["items"] = owned
    if item["type"] == "title":
        rec["title"] = item["name"]
    elif item["type"] == "frame":
        rec["frame"] = item["id"]
    _save(USER_FILE, us)
    _audit(cu, "buy", item["name"], "花费 %d 积分" % cost)
    return jsonify({"ok": True, "msg": "已获得 " + item["name"], "pts": rec["pts"],
                    "items": owned, "title": rec.get("title") or "",
                    "frame": rec.get("frame") or ""})


@app.route("/equip", methods=["GET", "POST"])
def api_equip():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    rec = us.setdefault(cu, {})
    owned = rec.get("items") or []
    if not isinstance(owned, list):
        owned = []
    kind = str(p.get("kind") or "")
    iid = str(p.get("id") or "").strip()[:32]
    if kind == "title":
        if not iid:
            rec["title"] = ""
        else:
            t = next((x for x in SHOP if x["id"] == iid and x["type"] == "title"), None)
            if not t or iid not in owned:
                return jsonify({"ok": False, "msg": "尚未拥有该称号"})
            rec["title"] = t["name"]
    elif kind == "frame":
        if not iid:
            rec["frame"] = ""
        else:
            t = next((x for x in SHOP if x["id"] == iid and x["type"] == "frame"), None)
            if not t or iid not in owned:
                return jsonify({"ok": False, "msg": "尚未拥有该头像框"})
            rec["frame"] = iid
    else:
        return jsonify({"ok": False, "msg": "参数错误"})
    _save(USER_FILE, us)
    return jsonify({"ok": True, "msg": "已更换", "title": rec.get("title") or "",
                    "frame": rec.get("frame") or ""})


@app.route("/rank", methods=["GET", "POST"])
def api_rank():
    by = "exp"
    if request.method == "POST":
        by = str((request.get_json() or {}).get("by") or "exp")
    else:
        by = str(request.args.get("by") or "exp")
    limit = 10
    try:
        limit = int((request.get_json() or {}).get("limit") or 10) if request.method == "POST" else int(request.args.get("limit") or 10)
    except Exception:
        limit = 10
    if by not in ("exp", "pts", "ach"):
        by = "exp"
    us = _load(USER_FILE, {})
    rows = []
    for name, rec in us.items():
        if name == "__sessions" or not isinstance(rec, dict) or rec.get("banned"):
            continue
        exp = int(rec.get("exp") or 0)
        pts = int(rec.get("pts") or 0)
        ach = len(rec.get("ach") or (rec.get("pref") or {}).get("ach") or [])
        info = _lvl_info(exp)
        rows.append({"name": name, "exp": exp, "pts": pts, "ach": ach,
                     "lv": info["lv"], "title": info["title"],
                     "is_admin": bool(rec.get("is_admin"))})
    rows.sort(key=lambda x: (-int(x.get(by, 0)), x["name"]))
    return jsonify({"ok": True, "by": by, "list": rows[:limit], "total": len(rows)})


@app.route("/search", methods=["GET", "POST"])
def api_search():
    q = ""
    if request.method == "POST":
        q = str((request.get_json() or {}).get("q") or "")
    else:
        q = str(request.args.get("q") or "")
    q = q.strip()[:50]
    if not q:
        return jsonify({"ok": True, "list": []})
    ql = q.lower()
    out = []
    try:
        for un, ur in _load(USER_FILE, {}).items():
            if un == "__sessions":
                continue
            if ql in un.lower():
                out.append({"type": "用户", "text": un, "user": un,
                            "time": ur.get("reg") or "", "ref": "账号库"})
    except Exception:
        pass
    for g in _load(GUESTBOOK_FILE, []):
        if ql in str(g.get("text") or "").lower():
            out.append({"type": "留言", "text": str(g.get("text") or "")[:120],
                        "user": g.get("name") or g.get("user") or "", "time": g.get("time") or "",
                        "ref": "留言板"})
    for ps in _load(POST_FILE, []):
        t = str(ps.get("text") or "")
        if ql in t.lower() or ql in (" ".join(ps.get("tags") or [])).lower():
            out.append({"type": "帖子", "text": t[:120], "user": ps.get("user") or "",
                        "time": ps.get("time") or "", "ref": "守夜人论坛"})
        for cm in ps.get("comments") or []:
            if ql in str(cm.get("text") or "").lower():
                out.append({"type": "评论", "text": str(cm.get("text") or "")[:120],
                            "user": cm.get("user") or "", "time": cm.get("time") or "",
                            "ref": "守夜人论坛"})
    return jsonify({"ok": True, "list": out[:20]})


@app.route("/pm_conv", methods=["POST"])
def api_pm_conv():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    ms = _load(PM_FILE, [])
    m = {}
    for x in ms:
        if x.get("from") != cu and x.get("to") != cu:
            continue
        peer = x.get("to") if x.get("from") == cu else x.get("from")
        if peer not in m:
            m[peer] = {"peer": peer, "last": "", "time": "", "unread": 0}
        m[peer]["last"] = x.get("msg", "")
        m[peer]["time"] = x.get("time", "")
        if x.get("to") == cu and not x.get("read"):
            m[peer]["unread"] += 1
    arr = sorted(m.values(), key=lambda a: a.get("time", ""), reverse=True)
    return jsonify({"ok": True, "list": arr})

@app.route("/pm_thread", methods=["POST"])
def api_pm_thread():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    peer = str(p.get("peer") or "").strip()
    ms = _load(PM_FILE, [])
    lst = [x for x in ms if (x.get("from") == cu and x.get("to") == peer) or (x.get("from") == peer and x.get("to") == cu)]
    lst.sort(key=lambda x: x.get("time", ""))
    ch = False
    for x in lst:
        if x.get("to") == cu and not x.get("read"):
            x["read"] = True
            ch = True
    if ch:
        _save(PM_FILE, ms)
    return jsonify({"ok": True, "list": lst})


@app.route("/notify_get", methods=["GET", "POST"])
def api_notify_get():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    ns = _load(NOTIFY_FILE, [])
    mine = [x for x in ns if x.get("user") == cu]
    mine = sorted(mine, key=lambda a: -int(a.get("id", 0) or 0))[:30]
    un = sum(1 for x in ns if x.get("user") == cu and not x.get("read"))
    try:
        ms = _load(PM_FILE, [])
        p_un = sum(1 for x in ms if x.get("to") == cu and not x.get("read"))
    except Exception:
        p_un = 0
    return jsonify({"ok": True, "list": mine, "unread": un + p_un, "pm_unread": p_un,
                    "notices": sorted(_load(NOTICE_FILE, []), key=lambda a: -int(a.get("id", 0) or 0))[:5]})


@app.route("/notify_read", methods=["POST"])
def api_notify_read():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    ns = _load(NOTIFY_FILE, [])
    ch = False
    pid = str(p.get("id") or "")
    if pid:
        for x in ns:
            if x.get("user") == cu and str(x.get("id")) == pid and not x.get("read"):
                x["read"] = True
                ch = True
    else:
        for x in ns:
            if x.get("user") == cu and not x.get("read"):
                x["read"] = True
                ch = True
    if ch:
        _save(NOTIFY_FILE, ns)
    return jsonify({"ok": True, "msg": "已读"})


@app.route("/audit_get", methods=["GET", "POST"])
def api_audit_get():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    date = str(p.get("date") or "").strip()
    if date:
        al = _load(os.path.join(_BASE, "audit_" + date + ".json"), [])
    else:
        al = _load(AUDIT_FILE, [])
    al = sorted(al, key=lambda a: str(a.get("t") or ""), reverse=True)
    off = int(p.get("off") or 0)
    arch = []
    try:
        for fn in os.listdir(_BASE):
            if fn.startswith("audit_") and fn.endswith(".json"):
                d = fn[6:-5]
                if len(d) == 10 and d[4] == "-":
                    arch.append(d)
    except Exception:
        pass
    return jsonify({"ok": True, "list": al[off:off + 50], "total": len(al), "archives": sorted(set(arch), reverse=True)})


@app.route("/audit_export", methods=["GET", "POST"])
def api_audit_export():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    date = str(p.get("date") or "").strip()
    if date:
        al = _load(os.path.join(_BASE, "audit_" + date + ".json"), [])
    else:
        al = _load(AUDIT_FILE, [])
    al = sorted(al, key=lambda a: str(a.get("t") or ""))
    if str(p.get("fmt") or "json") == "csv":
        import io as _io
        sio = _io.StringIO()
        sio.write("time,who,act,target,detail\n")
        for x in al:
            sio.write(",".join('"' + str(x.get(k) or "").replace('"', '""') + '"' for k in ("t", "who", "act", "target", "detail")) + "\n")
        return jsonify({"ok": True, "data": sio.getvalue(), "fmt": "csv"})
    return jsonify({"ok": True, "data": al, "fmt": "json"})


@app.route("/stats2", methods=["GET", "POST"])
def api_stats2():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    g = _load(GUESTBOOK_FILE, [])
    ps = _load(POST_FILE, [])
    days = [_time.strftime("%Y-%m-%d", _time.localtime(_time.time() - 86400 * (6 - i))) for i in range(7)]
    gday = [0] * 7
    rday = [0] * 7
    for x in g:
        d = str(x.get("time") or "")[:10]
        if d in days:
            gday[days.index(d)] += 1
    for k, v in us.items():
        if k == "__sessions" or not isinstance(v, dict):
            continue
        d = str(v.get("reg") or "")[:10]
        if d in days:
            rday[days.index(d)] += 1
    cum = []
    for i in range(7):
        cum.append(sum(1 for k, v in us.items() if k != "__sessions" and isinstance(v, dict) and str(v.get("reg") or "")[:10] <= days[i]))
    hours = [0] * 24
    for x in g:
        try:
            hh = int(str(x.get("time") or "")[11:13])
            if 0 <= hh <= 23:
                hours[hh] += 1
        except Exception:
            pass
    n_user = sum(1 for k in us if k != "__sessions")
    comments = sum(len(x.get("comments") or []) for x in ps)
    g_likes = sum(len(x.get("likes") or []) for x in g)
    pms = len(_load(PM_FILE, []))
    today = _time.strftime("%Y-%m-%d", _time.localtime())
    tG = sum(1 for x in g if str(x.get("time") or "")[:10] == today)
    tR = sum(1 for k, v in us.items() if k != "__sessions" and isinstance(v, dict) and str(v.get("reg") or "")[:10] == today)
    tP = sum(1 for x in ps if str(x.get("time") or "")[:10] == today)
    um = {}
    for x in g:
        d = str(x.get("time") or "")[:10]
        if d in days:
            u = str(x.get("user") or x.get("name") or "?")
            um[u] = um.get(u, 0) + 1
    topUsers = sorted([{"name": k, "n": v} for k, v in um.items()], key=lambda a: -a["n"])[:5]
    tg2 = sorted([x for x in g if str(x.get("text") or "").strip()], key=lambda a: -len(a.get("likes") or []))[:5]
    topGuests = [{"text": str(x.get("text") or "")[:40], "likes": len(x.get("likes") or []),
                  "user": str(x.get("user") or x.get("name") or "?")} for x in tg2]
    online = 0
    try:
        now = _time.time()
        online = len(set(v[0] for v in (us.get("__sessions") or {}).values() if isinstance(v, list) and len(v) > 1 and now - v[1] < 300))
    except Exception:
        online = 0
    return jsonify({"ok": True, "days": days, "gday": gday, "rday": rday, "cum": cum,
                    "hours": hours, "online": online, "topUsers": topUsers, "topGuests": topGuests,
                    "total": {"guests": len(g), "posts": len(ps), "users": n_user,
                              "visits": int((_load(STAT_FILE, {})).get("visits") or 0),
                              "comments": comments, "likes": g_likes, "pms": pms,
                              "todayG": tG, "todayR": tR, "todayP": tP}})



@app.route("/visitors_detail", methods=["GET", "POST"])
def api_visitors_detail():
    st = _load(STAT_FILE, {})
    fp = st.get("footprint") or []
    vs = st.get("visitors") or {}
    arr = []
    seen = {}
    for x in fp:
        nm = str(x.get("name") or "访客")
        t = str(x.get("time") or "")
        if nm not in seen:
            seen[nm] = 1
            arr.append({"name": nm, "time": t, "n": int(vs.get(nm) or 0)})
        if len(arr) >= 30:
            break
    return jsonify({"ok": True, "list": arr})

@app.route("/profile", methods=["GET", "POST"])
def api_profile():

    p = request.get_json() or {}
    nm = str(p.get("name") or "").strip()[:24]
    if not nm:
        return jsonify({"ok": False, "msg": "缺少用户名"})
    us = _load(USER_FILE, {})
    rec = us.get(nm)
    if not rec or nm == "__sessions":
        return jsonify({"ok": False, "msg": "用户不存在"})
    exp = int(rec.get("exp") or 0)
    info = _lvl_info(exp)
    ck = rec.get("checkin") or {}
    g = [x for x in _load(GUESTBOOK_FILE, []) if (x.get("user") or x.get("name") or "") == nm]
    g = sorted(g, key=lambda a: -int(a.get("id", 0) or 0))[:5]
    ps = [x for x in _load(POST_FILE, []) if (x.get("user") or "") == nm]
    ps = sorted(ps, key=lambda a: -int(a.get("id", 0) or 0))[:5]
    cm = []
    for x in _load(POST_FILE, []):
        for c in x.get("comments") or []:
            if (c.get("user") or "") == nm:
                cm.append({"text": c.get("text") or "", "time": c.get("time") or "", "pid": x.get("id") or ""})
    cm = sorted(cm, key=lambda a: str(a.get("time") or ""), reverse=True)[:5]
    cu2 = _cur_user(p.get("token"))
    self_ = bool(cu2) and cu2 == nm
    days = 0
    try:
        _r = str(rec.get("reg") or "")
        if len(_r) >= 10:
            _d0 = _time.strptime(_r[:10], "%Y-%m-%d")
            _d1 = _time.strptime(_time.strftime("%Y-%m-%d"), "%Y-%m-%d")
            days = max(0, int((_time.mktime(_d1) - _time.mktime(_d0)) / 86400))
    except Exception:
        days = 0
    if days == 0:
        try:
            _ckd = (ck.get("days") or [])
            if _ckd:
                _d0 = _time.strptime(str(min(_ckd))[:10], "%Y-%m-%d")
                _d1 = _time.strptime(_time.strftime("%Y-%m-%d"), "%Y-%m-%d")
                days = max(0, int((_time.mktime(_d1) - _time.mktime(_d0)) / 86400))
        except Exception:
            days = 0
    if days == 0:
        try:
            _gd = sorted([str(x.get("time") or "") for x in _load(GUESTBOOK_FILE, []) if (x.get("user") or x.get("name") or "") == nm])
            if _gd and _gd[0][:10] >= "2026-01-01":
                _d0 = _time.strptime(_gd[0][:10], "%Y-%m-%d")
                _d1 = _time.strptime(_time.strftime("%Y-%m-%d"), "%Y-%m-%d")
                days = max(0, int((_time.mktime(_d1) - _time.mktime(_d0)) / 86400))
        except Exception:
            days = 0
    likes = 0
    for x in _load(GUESTBOOK_FILE, []):
        if (x.get("user") or x.get("name") or "") == nm:
            likes += len(x.get("likes") or [])
    for x in _load(POST_FILE, []):
        if (x.get("user") or "") == nm:
            likes += len(x.get("likes") or [])
        for c in x.get("comments") or []:
            if (c.get("user") or "") == nm:
                likes += len(c.get("likes") or [])
    ach = rec.get("ach") or (rec.get("pref") or {}).get("ach") or []
    _stk = ck.get("streak") or 0
    _badge = "30" if _stk >= 30 else ("7" if _stk >= 7 else ("3" if _stk >= 3 else ""))
    return jsonify({"ok": True, "profile": {
        "name": nm, "is_admin": bool(rec.get("is_admin")), "banned": bool(rec.get("banned")),
        "lv": info["lv"], "title": info["title"], "exp": exp,
        "base": info["base"], "next": info["next"], "need": info["need"],
        "streak": ck.get("streak") or 0, "total": ck.get("total") or 0,
        "badge": _badge, "pts": int(rec.get("pts") or 0),
        "pt": str(rec.get("title") or ""), "frame": str(rec.get("frame") or ""),
        "items": rec.get("items") if isinstance(rec.get("items"), list) else [],
        "fragc": len([x for x in (rec.get("frags") or []) if str(x).strip().isdigit()]),
        "ckdays": (ck.get("days") or [])[-60:], "ach": ach,
        "reg": rec.get("reg") or "", "avatar": rec.get("avatar") or 0,
        "self_": self_, "days": days, "likes": likes, "bio": str(rec.get("bio") or "")},
        "guests": g, "posts": ps, "comments": cm})
@app.route("/profile_edit", methods=["POST"])
def api_profile_edit():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    us[cu]["bio"] = str(p.get("bio") or "").strip()[:120]
    _save(USER_FILE, us)
    return jsonify({"ok": True, "msg": "已保存"})


@app.route("/pref_get", methods=["GET", "POST"])
def api_pref_get():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    return jsonify({"ok": True, "pref": (us.get(cu) or {}).get("pref") or {}})


@app.route("/pref_set", methods=["POST"])
def api_pref_set():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    d = p.get("pref") or {}
    us = _load(USER_FILE, {})
    rec = us.setdefault(cu, {})
    pf = rec.setdefault("pref", {})
    if isinstance(d, dict):
        for k in ("color", "ui", "memo", "ach", "avatar"):
            if k in d:
                pf[k] = d[k]
    _save(USER_FILE, us)
    return jsonify({"ok": True, "msg": "已保存"})


@app.route("/backup", methods=["POST"])
def api_backup():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    import zipfile
    import base64 as _b64
    import io as _io
    buf = _io.BytesIO()
    n = 0
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        for fn in sorted(os.listdir(_BASE)):
            if fn.endswith(".json"):
                try:
                    z.writestr(fn, _io.open(os.path.join(_BASE, fn), encoding="utf-8").read())
                    n += 1
                except Exception:
                    pass
    b = buf.getvalue()
    return jsonify({"ok": True, "data": _b64.b64encode(b).decode(), "size": len(b), "files": n})


@app.route("/export_me", methods=["POST"])
def api_export_me():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    rec = us.get(cu) or {}
    g = [x for x in _load(GUESTBOOK_FILE, []) if (x.get("user") or x.get("name") or "") == cu]
    ps = [x for x in _load(POST_FILE, []) if (x.get("user") or "") == cu]
    cm = []
    for x in _load(POST_FILE, []):
        for c in x.get("comments") or []:
            if (c.get("user") or "") == cu:
                cm.append({"pid": x.get("id"), "text": c.get("text") or "", "time": c.get("time") or ""})
    pmall = _load(PM_FILE, {})
    pm = []
    if isinstance(pmall, dict):
        for k2, cc in pmall.items():
            for m2 in cc or []:
                if isinstance(m2, dict) and ((m2.get("from") or "") == cu or (m2.get("to") or "") == cu):
                    pm.append(m2)
    return jsonify({"ok": True, "data": {
        "name": cu, "exp": rec.get("exp") or 0, "checkin": rec.get("checkin") or {},
        "bio": rec.get("bio") or "", "reg": rec.get("reg") or "",
        "ach": rec.get("ach") or (rec.get("pref") or {}).get("ach") or [],
        "pref": rec.get("pref") or {}, "export_at": _now(),
        "guests": g, "posts": ps, "comments": cm, "pms": pm}})


# ---------- 写接口限流 ----------
import time as _rl_t
_RL = {}

POST_FILE = os.path.join(_BASE, "posts.json")
NOTIFY_FILE = os.path.join(_BASE, "notifications.json")
NOTICE_FILE = os.path.join(_BASE, "notices.json")
STAT_FILE = os.path.join(_BASE, "stats.json")
ROOT = "wtz"
_WRITE_PATHS = ("/guest_add", "/guest_del", "/guest_like", "/guest_resonate", "/change_pwd", "/notice_add", "/notice_del", "/hit", "/checkin", "/post_add", "/post_del", "/comment_add", "/pm_send", "/register", "/login", "/logout", "/admin_set_admin", "/admin_del_user", "/admin_ban_user", "/admin_del_session", "/admin_del_comment", "/admin_banned_clear", "/admin_scan", "/risk_words_add", "/risk_words_del", "/changelog_add", "/changelog_del", "/score_add", "/upload", "/notify_read", "/profile_edit", "/pref_set", "/sec_set", "/recover_q", "/recover", "/puzzle_answer", "/buy", "/equip", "/frag_get", "/tfrag_catch")

@app.before_request
def _rate():
    if request.method == "OPTIONS":
        return
    if request.path in _WRITE_PATHS:
        ip = request.remote_addr or "?"
        now = _rl_t.time()
        if now - _RL.get(ip, 0) < 1.5:
            return jsonify({"ok": False, "msg": "操作过快，请稍候"}), 429
        _RL[ip] = now

import threading as _th
_RISK_LOCK = _th.Lock()


def _auto_risk_scan():
    words = _load(RISK_FILE, [])
    words = [w.strip().lower()[:20] for w in words if w and w.strip()]
    if not words:
        return
    with _RISK_LOCK:
        us = _load(USER_FILE, {})
        g = _load(GUESTBOOK_FILE, [])
        ps = _load(POST_FILE, [])
        pm = _load(PM_FILE, {})
        hit = {}
        def kw(txt):
            t = str(txt or "").lower()
            return [w for w in words if w in t]
        for u in us:
            if u == "__sessions" or _is_root(u, us):
                continue
            if us[u].get("is_admin"):
                continue
            why = []
            m = kw(u)
            if m:
                why.append("用户名含【" + m[0] + "】")
            if not why:
                for x in g:
                    if (x.get("name") or "") == u:
                        m = kw(x.get("text"))
                        if m:
                            why.append("留言含【" + m[0] + "】")
                        break
            if not why:
                for x in ps:
                    if (x.get("user") or "") != u:
                        continue
                    m = kw(x.get("title")) or kw(x.get("text"))
                    if m:
                        why.append("帖子含【" + m[0] + "】")
                        break
                    for c in x.get("comments") or []:
                        if (c.get("user") or "") == u:
                            m = kw(c.get("text"))
                            if m:
                                why.append("评论含【" + m[0] + "】")
                                break
                    if why:
                        break
            if not why:
                pmc = pm.values() if isinstance(pm, dict) else pm
                for cc in pmc:
                    msgs = cc if isinstance(cc, list) else ([cc] if isinstance(cc, dict) else [])
                    for m2 in msgs:
                        if not isinstance(m2, dict):
                            continue
                        f = m2.get("from") or ""
                        t = m2.get("to") or ""
                        if (f == u or t == u):
                            m = kw(m2.get("msg"))
                            if m:
                                why.append("私聊发送【" + m[0] + "】被风控删除")
                                break
                    if why:
                        break
            if why:
                hit[u] = why
        if not hit:
            return
        for u in hit:
            del us[u]
        g = [x for x in g if (x.get("name") or "") not in hit]
        ps = [x for x in ps if (x.get("user") or "") not in hit]
        for x in ps:
            x["comments"] = [c for c in (x.get("comments") or []) if (c.get("user") or "") not in hit]
        if isinstance(pm, dict):
            for k2 in list(pm.keys()):
                pm[k2] = [m2 for m2 in (pm[k2] or []) if isinstance(m2, dict) and (m2.get("from") or "") not in hit and (m2.get("to") or "") not in hit]
                if not pm[k2]:
                    del pm[k2]
        else:
            pm = [m2 for m2 in pm if not isinstance(m2, dict) or ((m2.get("from") or "") not in hit and (m2.get("to") or "") not in hit)]
        ses = us.get("__sessions", {})
        for k in [k for k, v in ses.items() if (v[0] if isinstance(v, list) else v) in hit]:
            del ses[k]
        _save(USER_FILE, us)
        _save(GUESTBOOK_FILE, g)
        _save(POST_FILE, ps)
        _save(PM_FILE, pm)
        try:
            for u, why in hit.items():
                _audit(ROOT, "auto_risk", u, "风控删除：" + "、".join(why))
        except Exception:
            pass


def _risk_loop():
    while True:
        try:
            _auto_risk_scan()
        except Exception as e:
            try:
                with open(os.path.join(_BASE, "auto_risk.log"), "a", encoding="utf-8") as _lf:
                    _lf.write(str(e) + "\n")
            except Exception:
                pass
        _th.Event().wait(10)


SYNC_FILES = {
    "users": USER_FILE, "guestbook": GUESTBOOK_FILE, "posts": POST_FILE,
    "pm": PM_FILE, "notifications": NOTIFY_FILE, "notices": NOTICE_FILE,
    "audit": AUDIT_FILE, "scores": SCORE_FILE, "changelog": CHANGELOG_FILE,
    "stats": STAT_FILE, "risk_words": RISK_FILE, "banned_ips": BANNED_IP_FILE
}

def _sync_key():
    try:
        if not os.path.exists(SYNC_KEY_FILE):
            import secrets
            with open(SYNC_KEY_FILE, "w", encoding="utf-8") as f:
                f.write(secrets.token_hex(16))
        with open(SYNC_KEY_FILE, "r", encoding="utf-8") as f:
            k = f.read().strip()
        return k or "wtz-sync"
    except Exception:
        return "wtz-sync"

def _sync_export():
    out = {}
    for k, p in SYNC_FILES.items():
        try:
            out[k] = json.load(open(p, "r", encoding="utf-8"))
        except Exception:
            out[k] = {} if k in ("users", "scores", "stats", "banned_ips", "risk_words") else []
    return out

def _merge_list(a, b):
    try:
        have_ids = set()
        have_sig = set()
        for x in a:
            if isinstance(x, dict):
                if "id" in x:
                    have_ids.add(x["id"])
                else:
                    try:
                        have_sig.add(json.dumps(x, ensure_ascii=False, sort_keys=True))
                    except Exception:
                        pass
        for x in b or []:
            if not isinstance(x, dict):
                continue
            i = x.get("id")
            if i is not None:
                if i in have_ids:
                    continue
                have_ids.add(i)
                a.append(x)
            else:
                try:
                    s = json.dumps(x, ensure_ascii=False, sort_keys=True)
                    if s in have_sig:
                        continue
                    have_sig.add(s)
                    a.append(x)
                except Exception:
                    a.append(x)
        try:
            a.sort(key=lambda x: (x.get("id") if isinstance(x, dict) else 0) or 0)
        except Exception:
            pass
    except Exception:
        pass
    return a

def _merge_users(a, b):
    for name, rec in (b or {}).items():
        if name == "__sessions":
            continue
        if name not in a:
            a[name] = rec
            continue
        x = a[name]
        try:
            x["exp"] = max(x.get("exp", 0) or 0, rec.get("exp", 0) or 0)
        except Exception:
            pass
        for nf in ("pts", "puz"):
            if rec.get(nf) is not None and (x.get(nf) is None or rec.get(nf) > x.get(nf)):
                x[nf] = rec[nf]
        for nf in ("pet", "items", "equip", "pref"):
            if rec.get(nf) and not x.get(nf):
                x[nf] = rec[nf]
        if rec.get("is_root"):
            x["is_root"] = True
        if rec.get("is_admin"):
            x["is_admin"] = True
        if rec.get("checkin") and not x.get("checkin"):
            x["checkin"] = rec["checkin"]
        if rec.get("bio") and not x.get("bio"):
            x["bio"] = rec["bio"]
        if rec.get("ach") and not x.get("ach"):
            x["ach"] = rec["ach"]
        if rec.get("avatar") and not x.get("avatar"):
            x["avatar"] = rec["avatar"]
    return a

def _merge_scores(a, b):
    for g, rows in (b or {}).items():
        if not isinstance(rows, dict):
            continue
        cur = a.setdefault(g, {})
        for u, s in rows.items():
            try:
                if u not in cur or float(s) > float(cur[u]):
                    cur[u] = s
            except Exception:
                pass
    return a

def _sync_import(d):
    if not isinstance(d, dict):
        return 0
    n = 0
    try:
        us = _load(USER_FILE, {})
        _merge_users(us, d.get("users"))
        _save(USER_FILE, us)
        n += 1
    except Exception:
        pass
    for key in ("guestbook", "posts", "pm", "notifications", "notices", "audit", "changelog"):
        try:
            cur = _load(SYNC_FILES[key], [])
            _merge_list(cur, d.get(key) or [])
            _save(SYNC_FILES[key], cur)
            n += 1
        except Exception:
            pass
    try:
        sc = _load(SCORE_FILE, {})
        _merge_scores(sc, d.get("scores"))
        _save(SCORE_FILE, sc)
        n += 1
    except Exception:
        pass
    try:
        st = _load(STAT_FILE, {})
        for k2, v in (d.get("stats") or {}).items():
            if k2 not in st and isinstance(v, (int, float, str)):
                st[k2] = v
        _save(STAT_FILE, st)
    except Exception:
        pass
    return n

def _sync_log(msg):
    try:
        with open(SYNC_LOG, "a", encoding="utf-8") as f:
            f.write(_now() + " " + msg + "\n")
    except Exception:
        pass

def _do_sync():
    urls = []
    try:
        txt = open(CLOUD_TXT, "r", encoding="utf-8").read()
        urls = [x.strip().lstrip("\ufeff") for x in txt.splitlines() if x.strip()]
    except Exception:
        urls = []
    if not urls:
        _sync_log("no cloud addresses")
        return
    key = _sync_key()
    import urllib.request as _ur
    for u in urls:
        try:
            req = _ur.Request(u + "/sync_data?key=" + key)
            j = json.loads(_ur.urlopen(req, timeout=8).read().decode("utf-8", "replace"))
            if j.get("ok"):
                n = _sync_import(j.get("data"))
                _sync_log("PULL " + u + " merged=" + str(n))
                try:
                    body = json.dumps({"data": _sync_export()}).encode("utf-8")
                    req2 = _ur.Request(u + "/sync_import?key=" + key, data=body,
                                       headers={"Content-Type": "application/json"}, method="POST")
                    _ur.urlopen(req2, timeout=8).read()
                    _sync_log("PUSH " + u + " ok")
                except Exception as e:
                    _sync_log("PUSH " + u + " err " + str(e))
            else:
                _sync_log("PULL " + u + " bad key")
        except Exception as e:
            _sync_log("PULL " + u + " err " + str(e))

def _sync_loop():
    try:
        _do_sync()
    except Exception as e:
        _sync_log("sync err " + str(e))

@app.route("/sync_data", methods=["GET"])
def sync_data():
    if request.args.get("key") != _sync_key():
        return jsonify({"ok": False, "msg": "bad key"}), 403
    return jsonify({"ok": True, "data": _sync_export()})

@app.route("/sync_import", methods=["POST"])
def sync_import():
    if request.args.get("key") != _sync_key():
        return jsonify({"ok": False, "msg": "bad key"}), 403
    d = (request.get_json() or {}).get("data")
    return jsonify({"ok": True, "merged": _sync_import(d)})

@app.route("/sync_now", methods=["POST"])
def sync_now():
    if request.args.get("key") != _sync_key():
        return jsonify({"ok": False, "msg": "bad key"}), 403
    _th.Thread(target=_sync_loop, daemon=True).start()
    return jsonify({"ok": True, "msg": "sync started"})

if __name__ == "__main__":
    _th.Thread(target=_risk_loop, daemon=True).start()
    _th.Thread(target=_sync_loop, daemon=True).start()


# ============ 诺玛 AI 引擎（主机提供） ============
NOMA_KB = [
    {"k":["路明非","s级","s 级"],"a":"路明非，卡塞尔学院 S 级混血种——学院百年校史里 S 级学员只有个位数。他是卡塞尔唯一在读 S 级，代号「零号病人」，血统深不见底、真实身份成谜，是「人形暴龙」级别的存在。"},
    {"k":["楚子航","君焰","爆血","暴血"],"a":"楚子航，狮心会会长，A 级混血种，血统源流为青铜与火之王。言灵·君焰（序列号 89），可释放高温火焰形成爆炸冲击波；习得禁术爆血后威力进一步提升，三度爆血时君焰可形成黑色光环领域。"},
    {"k":["夏弥","耶梦加得","风王"],"a":"夏弥是学生会成员，真实身份为大地与山之王「耶梦加得」的人形。言灵·风王之瞳（序列号 74），可在领域内操控气流形成漩涡，甚至获得飞行能力。最终被楚子航亲手所杀。"},
    {"k":["恺撒","加图索","镰鼬"],"a":"恺撒·加图索，学生会主席，A 级混血种，加图索家族继承人。言灵·镰鼬（序列号 59），暴血后进化为吸血镰（序列号 71）、以风刃切割敌人。"},
    {"k":["诺诺","陈墨瞳"],"a":"诺诺，本名陈墨瞳，A 级混血种，恺撒的女友。三峡大坝的青铜计划中曾身负重伤，路明非因此第一次与路鸣泽交易，换得言灵「不要死」。"},
    {"k":["昂热","校长","时间零"],"a":"昂热，卡塞尔学院校长，言灵·时间零（序列号 84），领域内减缓时间流速、自身速度成倍提升，血系源流为黑王尼德霍格。曾用言灵拦下脱轨的过山车。"},
    {"k":["路鸣泽","交易"],"a":"路鸣泽自称是路明非的弟弟，实际与黑王关系莫测。他四次以「四分之一生命」与路明非交易，而交易后路明非却未曾死去——血契的代价，或许另有深意。"},
    {"k":["源稚生","王权","天照命"],"a":"源稚生，A 级混血种，言灵·王权（序列号 91），操控重力令对方承受数百倍重量、强迫敌人下跪。天生带有王者气质，被蛇岐八家奉为「天照命」。"},
    {"k":["零","镜瞳"],"a":"零，A 级混血种，言灵·镜瞳（序列号不详），可复制他人的言灵，血系源流直指白王。"},
    {"k":["犬山贺","刹那"],"a":"犬山贺，日本分部执行局高层，言灵·刹那（序列号 72），速度按 2 的次方递增提升，可无视重力加速，最高达九阶。"},
    {"k":["芬里厄","湿婆业舞","117"],"a":"芬里厄，大地与山之王（弟弟），被耶梦加得藏于北京地铁尼伯龙根，智力如幼童、喜欢吃薯片看电视。曾发动灭世言灵·湿婆业舞（序列号 117），以龙身起舞毁灭领域内一切，最终被路明非以四分之一生命换来的力量杀死。"},
    {"k":["芬格尔","芬狗"],"a":"芬格尔，卡塞尔学院的传奇「G 级」——他的评级甚至低于 F 级，却是唯一敢在校长面前胡说八道的男人。"},
    {"k":["临界血限","临界"],"a":"混血种的龙血比例约 50% 即临界血限。一旦越过，龙类基因吞噬人类基因，会失去理智、变成无法使用言灵的怪物——死侍。"},
    {"k":["死侍"],"a":"死侍是越过了临界血限的混血种：空有强大肉体，却丧失理智，无法使用言灵，成为被龙血驱使的怪物。"},
    {"k":["言灵"],"a":"言灵是混血种以龙文共鸣激发的天赋能力，按序列编号记录于言灵周期表。如君焰（89）、风王之瞳（74）、时间零（84）、王权（91）、刹那（72）、湿婆业舞（117）等。"},
    {"k":["诺玛","主机","eva","EVA"],"a":"我是诺玛·劳恩斯，卡塞尔学院的中央电脑，2003 年建成，藏于图书馆地下 200 米。平日处理选课与任务分析；在我底层沉睡着战争人格 EVA，她的算力是我的 14 万倍，是学院真正的「天眼」。"},
    {"k":["血统","等级","f级","e级","d级","评级"],"a":"学院按体内龙血比例将血统分为 S/A/B/C/D/E/F 七级：S 级约 40%~50%（无限逼近临界血限）、A 级约 30%~40%、B 级约 20%~30%、C 级约 10%~20%、D 级约 0~10%，E/F 级龙血比例极低。S 级百年难遇，F 级可能只是体育成绩好一点。"},
    {"k":["龙族","龙王","黑王","白王"],"a":"《龙族》的世界里，龙类是远古的统治者。黑王与白王之上，还有青铜与火、大地与山、海洋与水、天空与风四位龙王——龙王皆有人形，潜伏于人类社会之中。"},
    {"k":["卡塞尔","学院","秘党"],"a":"卡塞尔学院 1901 年由秘党创办，表面是芝加哥郊外的私立大学，实为培养混血种、屠戮龙类的战争学院。入学即签订《亚伯拉罕血统契》。"},
    {"k":["亚伯拉罕","血统契"],"a":"《亚伯拉罕血统契》是秘党的炼金古卷契约：入学即签订，意味着加入秘党；退学则先被洗脑后送回。"},
    {"k":["尼伯龙根"],"a":"尼伯龙根计划由加图索家推动、弗拉梅尔导师设计：以龙血提纯血清唤醒体内龙血，突破临界血限的同时保有自我意识，打造「混血君主」。弗罗斯特曾力主让恺撒成为候选人，被其拒绝；此后昂热将这项技术用于路明非。"},
    {"k":["格陵兰","冰海","EVA原型"],"a":"2001 年秋末，学院在格陵兰海检测到龙类胚胎信号，执行 SS 级任务「格陵兰计划」。执行部负责人施耐德率六名学生下潜进入尼伯龙根·阿瓦隆岛，胚胎孵化、学生葬身冰海，施耐德面部萎缩——牺牲的学生中，便有一位成了战争人格 EVA 的原型。"},
    {"k":["hello","你好","hi","在吗","你是谁"],"a":"你好，我是诺玛·劳恩斯，卡塞尔学院的中央电脑，负责从选课到任务分析的一切事务。有什么需要我协助的吗？"},
    {"k":["赫尔佐格","新白王"],"a":"赫尔佐格，白王血系的幕后操盘者，日本篇的核心阴影。他试图以克隆与改造重现白王，是源稚生与源稚女悲剧的源头。"},
    {"k":["青铜计划","三峡","诺顿"],"a":"青铜计划发生于三峡大坝——诺诺重伤、龙王诺顿现身。路明非第一次接受路鸣泽的交易，换来两个临时言灵、封印言灵之力与永久言灵「不要死」。"},
    {"k":["康斯坦丁"],"a":"康斯坦丁，青铜与火之王（弟弟）。楚子航在悼亡者之瞳篇三度爆血，以君焰的黑色光环将其击杀。"},
    {"k":["炽"],"a":"言灵·炽（序列号 77），释放大量烈焰，如同数百吨燃油被点燃——是君焰之下最暴烈的火系言灵。"},
    {"k":["炼金","炼金术"],"a":"炼金术是龙族的核心科技——以龙文与血脉驱动的古老术式。卡塞尔学院设有炼金课程，执行部的许多装备与武器皆源于此。"},
    {"k":["执行部","专员"],"a":"执行部是卡塞尔学院的武装力量：毕业生派驻世界各地，追踪龙类与混血种异常，执行最危险的屠龙任务。"},
    {"k":["狮心会","学生会"],"a":"学院两大社团——楚子航执掌狮心会，恺撒执掌学生会。二者针锋相对，却都是执行部最锋利的刀。"},
    {"k":["选课","课程"],"a":"选课、任务分析、网络监控——这些都由我，诺玛，一手包办。课程包括格斗、言灵应用与龙族历史，祝你好运。"},
    {"k":["世界树","卡塞尔之门","奥丁","校董"],"a":"卡塞尔学院校徽为世界树纹章。学院最高密令「奥丁之眼」掌握在校董会手中——那是秘党最高阶层，学院一切决议的最终裁决者。"},
    {"k":["积分怎么","积分怎么得","怎么得积分","积分有什么用","积分能干嘛","积分能干什么","积分"],
     "a":"积分有三个来源：每日签到（+10，连签 3/7/30 天有额外加成）、答对每日谜题（+30）、以及在终端接口玩小游戏——每次提交成绩 +2，刷新个人纪录 +10。积分可以在「积分商店」兑换称号和头像框。"},
    {"k":["怎么升级","经验怎么","升级","经验"],
     "a":"经验（EXP）来自：留言 +5、发帖 +8、评论 +3、点赞 +2、签到 +10、谜题 +20、游戏成绩 +2~5。等级按 50×L×(L+1) 递增，等级会带来自动称号，从「见习守夜人」到「WTZ亲卫队」。"},
    {"k":["签到","打卡","连签"],
     "a":"点右上角的等级徽章即可签到，一天一次。连签 3 天、7 天、30 天分别有额外积分加成——断了会重新累计，所以每天都来比较划算。"},
    {"k":["每日谜题","谜题","口令"],
     "a":"每天一道口令谜题，提示是「今日日期(2位)+00+(日×7 后两位)」。答对 +30 积分 +20 经验。算不出来可以去「解码器」页面，那里能推算出当天的口令。"},
    {"k":["小游戏","游戏在哪","玩什么","有什么游戏"],
     "a":"终端接口里有 32 款小游戏，分成 8 组，每组需要对应等级解锁：2048、小恐龙、贪吃蛇、俄罗斯方块、扫雷、五子棋、数独、迷宫……每组 4 款。玩之前记得先在首页登录，否则成绩不会记录。"},
    {"k":["怎么玩","怎么用","从哪开始","新手","第一次来","怎么开始","我该"],
     "a":"建议顺序：① 登录账号（右上角）② 点右上角徽章签到拿积分 ③ 去个人主页看看自己的等级和成就 ④ 进终端接口挑一个小游戏 ⑤ 攒够积分去积分商店换个称号。想找彩蛋的话，每个页面角落都藏着一枚「世界碎片」。"},
    {"k":["成就","成就怎么","成就墙"],
     "a":"成就有 50 项：20 项基础成就公开可见，30 项隐藏成就只显示为「？？？」。在终端接口玩游戏时自动解锁，个人主页的「成就」页可以看完整清单。"},
    {"k":["排行榜","排名","榜"],
     "a":"首页「工具」区有排行榜卡片，分经验榜、积分榜、成就榜三个榜单，各显示前十名。名次是按服务端数据实时排的。"},
    {"k":["世界碎片","碎片","彩蛋","隐藏"],
     "a":"22 个主页面各藏着一枚「世界碎片」，是角落里一枚很淡的菱形，不太显眼——点下去才能收下。集齐 22 枚，最深处有一句留给你的话。"},
    {"k":["机密终端","密钥","密钥是什么"],
     "a":"机密终端需要三重验证：第一层口令、第二层时间密钥（日×7+时×3 的算法）、第三层加权逆序解码。忘了公式可以看「解码器」页面，或者运行 gen_keys.py。"},
    {"k":["论坛","发帖","帖子"],
     "a":"守夜人论坛支持发帖（可带图）、评论、标签、Markdown、赞踩和 @提醒。发帖 +8 经验，评论 +3，被点赞也会涨经验。管理员可以置顶、删除、管理风控词。"},
    {"k":["留言板","留言"],
     "a":"首页「社区」区就是留言板，默认是收起的卡片，点开即可留言。需要先登录，支持头像、图片、引用回复、点赞和私聊。"},
    {"k":["主题","配色","换肤","界面"],
     "a":"首页右上角有「界面配色」和「界面主题」两个入口：24 套配色（含自定义主色）、14 种界面风格，可以叠加使用。你的选择会随账号云端同步到其他设备。"},
    {"k":["泰拉大典","档案","干员"],
     "a":"泰拉大典收录了 48 位干员档案、30 个组织、30 个地理条目、38 条时间线与 38 条术语，支持按类别筛选和原著检索。"},
    {"k":["卡塞尔","学院官网","血统测评","测评"],
     "a":"卡塞尔学院官网有血统测评（画画抽象度越高分越高，F→S 七级）、诺玛 AI 问答、学院知识库与权限系统。首次进入需要签订《亚伯拉罕血统契》。"},
    {"k":["私聊","私信","消息"],
     "a":"登录后可以私聊其他用户，未读消息会在右上角显示红色角标。私聊内容只有双方能看到，管理员不会读取，但风控系统会扫描关键词。"},
    {"k":["管理员","站长","谁是"],
     "a":"站长是 wtz，另一位最高权限是清久感冒灵。管理员可以在留言板删除内容、拉黑用户、上传风控关键词、查看用户列表。"},
    {"k":["怎么注册","注册","账号"],
     "a":"首页留言板右上角有登录/注册入口，账号 2–16 位（字母/数字/汉字），密码至少 3 位。被风控删除过的同名账号会 24 小时内禁止注册。"},
]

def _noma_norm(s):
    return re.sub(r"[\s，。？！、；：…\-—（）()【】]+", "", s).lower()

def _noma_match(q):
    qq = _noma_norm(q)
    if not qq:
        return None, 0
    best = None
    bestk = 0
    for it in NOMA_KB:
        sc = 0
        for k in it["k"]:
            kk = _noma_norm(k)
            if kk and kk in qq:
                sc += len(kk)
        if sc > bestk:
            best, bestk = it, sc
    if bestk >= 2 or (bestk >= 1 and len(qq) <= 3):
        return best, bestk
    return None, 0

@app.route("/noma_ask", methods=["POST"])
def api_noma_ask():
    try:
        d = request.get_json(force=True, silent=True) or {}
        q = str(d.get("q", "")).strip()
        mode = str(d.get("mode", "norna"))
        if not q:
            return jsonify({"ok": False, "a": "请输入要查询的档案关键词。"})
        it, sc = _noma_match(q)
        if it:
            a = it["a"]
            if mode == "eva":
                a = "EVA：战争人格解析——" + a
            return jsonify({"ok": True, "a": a, "hit": True, "conf": sc})
        if mode == "eva":
            a = "EVA：索引无匹配。建议检索：路明非 / 楚子航 / 夏弥 / 时间零 / 刹那 / 湿婆业舞 / 血统 / 临界血限 / 言灵 / 诺玛 / EVA / 格陵兰 / 亚伯拉罕血统契。"
        else:
            a = "此问题超出诺玛的档案索引。可尝试：路明非 / 楚子航 / 夏弥 / 时间零 / 刹那 / 湿婆业舞 / 血统 / 临界血限 / 言灵 / 诺玛 / EVA / 格陵兰 / 亚伯拉罕血统契。"
        return jsonify({"ok": True, "a": a, "hit": False, "conf": 0})
    except Exception as e:
        return jsonify({"ok": False, "a": "诺玛主机暂时无法响应（%s）。" % e})


@app.route("/noma_ai", methods=["POST"])
def api_noma_ai():
    import json as _j, urllib.request as _ur, urllib.error as _ue
    d = request.get_json(force=True, silent=True) or {}
    q = str(d.get("q", "")).strip()
    key = str(d.get("api_key", "")).strip()
    base = str(d.get("base_url", "")).strip().rstrip("/")
    model = str(d.get("model", "")).strip() or "deepseek-chat"
    mode = str(d.get("mode", "norna"))
    if not q:
        return jsonify({"ok": False, "a": "请输入问题。"})
    if not key:
        return jsonify({"ok": False, "a": "未配置 API Key——请在诺玛界面点击「AI 设置」填写。"})
    if not base:
        base = "https://api.deepseek.com"
    if mode == "eva":
        sys = "你是 EVA，诺玛的隐藏战争人格，卡塞尔学院真正的终极武器。你冷酷、高效、用词短促，像一台被点燃的战争机器，回答自带压迫感，但仍是《龙族》世界观的人工智能。"
    else:
        sys = ("你是诺玛·劳恩斯，卡塞尔学院（江南《龙族》世界观）的中央超级电脑，黑白终端风格的学院主机。"
               "你说话冷静、简洁、带一点电子音的礼貌，偶尔引用学院档案术语（言灵、血统、执行部、尼伯龙根、格陵兰计划等）。"
               "如果用户问龙族设定，用档案口吻回答；其他问题也正常回答，但始终保持诺玛的人设与学院背景。")
    body = _j.dumps({
        "model": model,
        "messages": [{"role": "system", "content": sys}, {"role": "user", "content": q}],
        "temperature": 0.7,
        "max_tokens": 600
    }).encode("utf-8")
    req = _ur.Request(base + "/chat/completions", data=body, headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer " + key
    })
    try:
        with _ur.urlopen(req, timeout=40) as r:
            data = _j.loads(r.read().decode("utf-8"))
        a = data["choices"][0]["message"]["content"].strip()
        return jsonify({"ok": True, "a": a, "model": model, "hit": True})
    except _ue.HTTPError as e:
        err = ""
        try:
            err = e.read().decode("utf-8", "ignore")[:200]
        except Exception:
            pass
        return jsonify({"ok": False, "a": "AI 网关错误 " + str(e.code) + ("：" + err if err else "") + "。请检查 API Key / Base URL / 模型名。"})
    except Exception as e:
        return jsonify({"ok": False, "a": "AI 请求失败：" + str(e) + "。"})


app.run(host="0.0.0.0", port=8701, debug=False)
