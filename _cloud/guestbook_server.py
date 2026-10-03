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

import time as _t
DEL_LOG = []

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
    with open(USER_FILE, "w", encoding="utf-8") as f:
        json.dump(init_users, f, ensure_ascii=False)

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
    with open(USER_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False)
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
    with open(USER_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False)
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
    with open(USER_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False)
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
    with open(USER_FILE, "w", encoding="utf-8") as f:
        json.dump(us, f, ensure_ascii=False)
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
        if _time.time() - t > 300:
            return None
        if _time.time() - t > 60:
            u["__sessions"][tok] = [name, _time.time()]
            with open(USER_FILE, "w", encoding="utf-8") as f:
                json.dump(u, f, ensure_ascii=False)
        return name
    except Exception:
        return None

def _load(p, d):
    try:
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return d

def _save(p, x):
    with open(p, "w", encoding="utf-8") as f:
        json.dump(x, f, ensure_ascii=False)

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
    cut = _time.time() - 300
    for k, v in list(ses.items()):
        t = v[1] if isinstance(v, list) else 0
        if t < cut:
            del ses[k]
    return u

AUDIT_FILE = os.path.join(_BASE, "audit_log.json")

def _audit(who, act, target, detail=""):
    try:
        al = _load(AUDIT_FILE, [])
        al.append({"t": _now(), "who": who, "act": act, "target": str(target or "")[:40], "detail": str(detail or "")[:80]})
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
            with open(USER_FILE, "w", encoding="utf-8") as f:
                json.dump(us, f, ensure_ascii=False)
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
            with open(USER_FILE, "w", encoding="utf-8") as f:
                json.dump(us, f, ensure_ascii=False)
        on = after
    except Exception:
        on = 0
    deleted = [d["id"] for d in DEL_LOG if d["t"] > _t.time() - 600]
    return jsonify({"ok": True, "list": nl, "online": on, "deleted": deleted})


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
    ps = sorted(ps, key=lambda a: (-len(a.get("likes") or []), -int(a.get("id", 0) or 0)))
    return jsonify({"ok": True, "list": ps})

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
    ps.append({"id": nid, "user": cu, "name": cu, "text": txt, "tags": tags,
               "image": im, "time": _now(), "comments": [], "likes": [], "dislikes": []})
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
            cs.append({"id": cid, "user": cu, "text": txt, "time": _now(), "likes": [], "dislikes": []})
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
    _save(STAT_FILE, st)
    return jsonify({"ok": True, "visits": st["visits"], "today": st["today_visits"]})

@app.route("/stats_get", methods=["GET", "POST"])
def api_stats_get():
    st = _load(STAT_FILE, {})
    return jsonify({"ok": True, "visits": st.get("visits") or 0,
                    "today": st.get("today_visits") or 0,
                    "visitors": len(st.get("visitors") or {})})

@app.route("/checkin_status", methods=["GET", "POST"])
def api_checkin_status():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    ck = (us.get(cu) or {}).get("checkin") or {}
    today = _time.strftime("%Y-%m-%d")
    return jsonify({"ok": True, "done": ck.get("date") == today,
                    "streak": ck.get("streak") or 0, "total": ck.get("total") or 0,
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
    rec["checkin"] = {"date": today, "streak": streak, "total": total}
    _save(USER_FILE, us)
    _add_exp(_load(USER_FILE, {}), cu, 10)
    return jsonify({"ok": True, "done": False, "streak": streak, "total": total})

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
            with open(USER_FILE, "w", encoding="utf-8") as f:
                json.dump(u, f, ensure_ascii=False)
    except Exception:
        pass
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
    if cu == ROOT:
        us = _clean_sessions(us)
        ses = us.get("__sessions", {})
        now = _time.time()
        lst = [{"name": k, "pwd": v.get("pwd", ""), "is_admin": bool(v.get("is_admin")),
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
    if cu != ROOT:
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
    if tgt == ROOT:
        return jsonify({"ok": False, "msg": "不能删除最高管理员"})
    if us[tgt].get("is_admin") and cu != ROOT:
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
        if u == "__sessions" or u == ROOT or u == cu:
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
    _audit(cu, "risk_scan", "关键词: " + ",".join(words), "风控删除 " + str(len(hit)) + " 人: " + ",".join(hit))
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
    if tgt == ROOT:
        return jsonify({"ok": False, "msg": "不能拉黑最高管理员"})
    if us[tgt].get("is_admin") and cu != ROOT:
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
        if int(found.get("score") or 0) < score:
            found["score"] = score
            found["time"] = _now()
            _save(SCORE_FILE, sc)
        return jsonify({"ok": True, "best": int(found.get("score") or 0)})
    lst.append({"user": cu, "score": score, "time": _now()})
    lst.sort(key=lambda x: -int(x.get("score") or 0))
    _save(SCORE_FILE, sc)
    return jsonify({"ok": True, "best": score})


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
    al = sorted(_load(AUDIT_FILE, []), key=lambda a: str(a.get("t") or ""), reverse=True)
    off = int(p.get("off") or 0)
    return jsonify({"ok": True, "list": al[off:off + 50], "total": len(al)})


@app.route("/audit_export", methods=["GET", "POST"])
def api_audit_export():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "登录已失效，请重新登录"})
    us = _load(USER_FILE, {})
    if not us.get(cu, {}).get("is_admin"):
        return jsonify({"ok": False, "msg": "无管理员权限"})
    al = sorted(_load(AUDIT_FILE, []), key=lambda a: str(a.get("t") or ""))
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
    return jsonify({"ok": True, "days": days, "gday": gday, "rday": rday, "cum": cum,
                    "hours": hours, "total": {"guests": len(g), "posts": len(ps),
                    "users": n_user, "visits": int((_load(STAT_FILE, {})).get("visits") or 0)}})


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
    return jsonify({"ok": True, "profile": {
        "name": nm, "is_admin": bool(rec.get("is_admin")), "banned": bool(rec.get("banned")),
        "lv": info["lv"], "title": info["title"], "exp": exp,
        "streak": ck.get("streak") or 0, "total": ck.get("total") or 0,
        "reg": rec.get("reg") or "", "avatar": rec.get("avatar") or 0},
        "guests": g, "posts": ps, "comments": cm})


# ---------- 写接口限流 ----------
import time as _rl_t
_RL = {}

POST_FILE = os.path.join(_BASE, "posts.json")
NOTIFY_FILE = os.path.join(_BASE, "notifications.json")
NOTICE_FILE = os.path.join(_BASE, "notices.json")
STAT_FILE = os.path.join(_BASE, "stats.json")
ROOT = "wtz"
_WRITE_PATHS = ("/guest_add", "/guest_del", "/guest_like", "/change_pwd", "/notice_add", "/notice_del", "/hit", "/checkin", "/post_add", "/post_del", "/comment_add", "/pm_send", "/register", "/login", "/logout", "/admin_set_admin", "/admin_del_user", "/admin_ban_user", "/admin_del_session", "/admin_del_comment", "/admin_banned_clear", "/admin_scan", "/risk_words_add", "/risk_words_del", "/changelog_add", "/changelog_del", "/score_add", "/upload", "/notify_read", "/sec_set", "/recover_q", "/recover")

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
        hit = []
        for u in us:
            if u == "__sessions" or u == ROOT:
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
            _audit(ROOT, "auto_risk", "关键词: " + ",".join(words), "自动风控删除 " + str(len(hit)) + " 人: " + ",".join(hit))
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


if __name__ == "__main__":
    _th.Thread(target=_risk_loop, daemon=True).start()
    app.run(host="0.0.0.0", port=8701, debug=False)
