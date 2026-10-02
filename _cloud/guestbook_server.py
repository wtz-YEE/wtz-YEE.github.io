from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

_BASE = os.path.dirname(os.path.abspath(__file__))
GUESTBOOK_FILE = os.path.join(_BASE, "guestbook.json")
USER_FILE = os.path.join(_BASE, "users.json")
PM_FILE = os.path.join(_BASE, "pm.json")

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

    users[uname] = {"pwd": pwd, "is_admin": False}
    with open(USER_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False)
    return jsonify({"ok": True, "msg": "注册成功"})


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
    data = request.get_json()
    from_u = data.get("from") or _cur_user(data.get("token"))
    to_u = data.get("to")
    msg = data.get("msg", "").strip()
    time_str = data.get("time", "")

    if not from_u or not to_u or not msg:
        return jsonify({"ok": False})

    with open(PM_FILE, "r", encoding="utf-8") as f:
        pmlist = json.load(f)

    pmlist.append({
        "from": from_u,
        "to": to_u,
        "msg": msg,
        "time": time_str
    })
    with open(PM_FILE, "w", encoding="utf-8") as f:
        json.dump(pmlist, f, ensure_ascii=False)
    return jsonify({"ok": True})


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
    return jsonify({"ok": True, "list": nl, "online": on})


@app.route("/guest_add", methods=["POST"])
def api_guest_add():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "请先登录后再留言"})
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
    g.append({"id": nid, "user": cu, "name": nm, "text": txt, "time": _now(), "avatar": av, "image": im})
    _save(GUESTBOOK_FILE, g)
    return jsonify({"ok": True})

@app.route("/post_get", methods=["GET", "POST"])
def api_post_get():
    ps = _load(POST_FILE, [])
    ps = sorted(ps, key=lambda a: -int(a.get("id", 0) or 0))
    return jsonify({"ok": True, "list": ps})

@app.route("/post_add", methods=["POST"])
def api_post_add():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "请先登录后再发帖"})
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
               "image": im, "time": _now(), "comments": []})
    _save(POST_FILE, ps)
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
    return jsonify({"ok": True, "msg": "已删除"})

@app.route("/comment_add", methods=["POST"])
def api_comment_add():
    p = request.get_json() or {}
    cu = _cur_user(p.get("token"))
    if not cu:
        return jsonify({"ok": False, "msg": "请先登录后再评论"})
    txt = str(p.get("text") or "").strip()[:200]
    if not txt:
        return jsonify({"ok": False, "msg": "评论不能为空"})
    ps = _load(POST_FILE, [])
    for x in ps:
        if str(x.get("id")) == str(p.get("pid")):
            cs = x.setdefault("comments", [])
            cs.append({"user": cu, "text": txt, "time": _now()})
            _save(POST_FILE, ps)
            return jsonify({"ok": True, "msg": "评论成功"})
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
                    "streak": ck.get("streak") or 0, "total": ck.get("total") or 0})

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
                "online": any(isinstance(s, list) and s[0] == k and s[1] > now - 300 for s in ses.values())}
               for k, v in us.items() if k != "__sessions"]
        lst.sort(key=lambda a: -int(a["is_admin"]))
        return jsonify({"ok": True, "list": lst, "root": True})
    lst = [{"name": k} for k in us if k != "__sessions"]
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


# ---------- 写接口限流 ----------
import time as _rl_t
_RL = {}

POST_FILE = os.path.join(_BASE, "posts.json")
NOTICE_FILE = os.path.join(_BASE, "notices.json")
STAT_FILE = os.path.join(_BASE, "stats.json")
ROOT = "wtz"
_WRITE_PATHS = ("/guest_add", "/guest_del", "/guest_like", "/change_pwd", "/notice_add", "/notice_del", "/hit", "/checkin", "/post_add", "/post_del", "/comment_add", "/pm_send", "/register", "/login", "/logout", "/admin_set_admin", "/upload")

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8701, debug=False)
