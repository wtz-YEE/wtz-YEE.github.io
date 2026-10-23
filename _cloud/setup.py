# -*- coding: utf-8 -*-
"""WTZ cloud deploy setup: env check + config (new-PC friendly)
Usage:
  python setup.py            interactive (prompts for cpolar authtoken if missing)
  python setup.py --token T  pass authtoken silently
  python setup.py --check    check only, no changes
"""
import os, sys, subprocess, re, json

BASE = os.path.dirname(os.path.abspath(__file__))
HOME = os.path.expanduser("~")
CFG = os.path.join(BASE, 'cloud_services.json')

def sh(args, timeout=240):
    try:
        r = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
        return r.returncode == 0, (r.stdout or r.stderr).strip()
    except Exception as e:
        return False, str(e)

def which(name):
    try:
        r = subprocess.run("where " + name, shell=True, capture_output=True, text=True)
        return r.stdout.strip().splitlines()[0] if r.returncode == 0 and r.stdout.strip() else None
    except Exception:
        return None

def find_python():
    exe = sys.executable or "python"
    if os.path.isfile(exe):
        return exe
    w = which("python")
    return w if w else None

def find_cpolar():
    for c in [which("cpolar"),
              r"D:\Program Files\cpolar\cpolar.exe",
              r"C:\Program Files\cpolar\cpolar.exe",
              r"C:\Program Files (x86)\cpolar\cpolar.exe"]:
        if c and os.path.isfile(c):
            return c
    return None

def cpolar_yml_path():
    return os.path.join(HOME, ".cpolar", "cpolar.yml")

def load_services():
    try:
        return json.load(open(CFG, encoding='utf-8'))
    except Exception:
        return []

def merge_tunnel(cfg, name, addr):
    if re.search(r'^\s*' + re.escape(name) + r'\s*:', cfg, re.M):
        return cfg, False
    if 'tunnels:' not in cfg:
        cfg = cfg.rstrip() + '\ntunnels:\n'
    cfg = cfg.rstrip() + '\n  ' + name + ':\n    proto: http\n    addr: "%s"\n' % addr
    return cfg, True

def ensure_cpolar_yml(token):
    p = cpolar_yml_path()
    os.makedirs(os.path.dirname(p), exist_ok=True)
    cfg = ""
    if os.path.exists(p):
        try:
            cfg = open(p, encoding="utf-8", errors="replace").read()
        except Exception:
            cfg = ""
    lines = [x.strip() for x in cfg.splitlines() if x.strip()]
    has_auth = any(x.startswith("authtoken:") for x in lines)
    changed = False
    if not has_auth and token:
        cfg = cfg.rstrip() + "\nauthtoken: " + token + "\n"
        has_auth = True
        changed = True
    missing = []
    for svc in load_services():
        if not svc.get('enabled', True):
            continue
        cfg, ch = merge_tunnel(cfg, svc['tunnel'], svc['port'])
        if ch:
            changed = True
            missing.append(svc['tunnel'])
    if changed:
        open(p, "w", encoding="utf-8").write(cfg)
    return p, has_auth, missing, changed

def main():
    args = sys.argv[1:]
    token = ""
    if "--token" in args:
        i = args.index("--token")
        if i + 1 < len(args):
            token = args[i + 1]
    check_only = "--check" in args

    print("=== WTZ cloud deploy check ===")
    py = find_python()
    if not py:
        print("[Python] missing - please install Python 3 first")
        print("https://www.python.org/downloads/  (tick: Add python.exe to PATH)")
        return 1
    ok, v = sh([py, "--version"])
    print("[Python] %s" % (v if ok else py))

    ok2, _ = sh([py, "-c", "import flask, flask_cors"])
    if not ok2:
        if check_only:
            print("[deps] missing: flask / flask-cors")
        else:
            print("[deps] installing flask / flask-cors ...")
            ok2, out = sh([py, "-m", "pip", "install", "flask", "flask-cors", "--quiet", "--disable-pip-version-check"])
            if not ok2:
                print("[deps] official source failed, retry with tsinghua mirror ...")
                ok2, out = sh([py, "-m", "pip", "install", "flask", "flask-cors", "--quiet", "--disable-pip-version-check",
                               "-i", "https://pypi.tuna.tsinghua.edu.cn/simple"])
            if not ok2:
                print("[deps] install failed: %s" % out)
                print("run manually: %s -m pip install flask flask-cors" % py)
                return 1
    print("[deps] flask / flask-cors OK")

    cpolar = find_cpolar()
    if cpolar:
        print("[cpolar] found: %s" % cpolar)
    else:
        print("[cpolar] NOT FOUND")
        print("install cpolar first: https://www.cpolar.com/  (add cpolar to PATH)")
        return 1

    p, has_auth, missing, changed = ensure_cpolar_yml(token)
    print("[cpolar.yml] %s" % p)
    if has_auth:
        print("[cpolar] authtoken configured")
    else:
        if check_only:
            print("[cpolar] authtoken NOT configured")
            return 1
        if not token:
            t = input("Enter cpolar authtoken (from cpolar.com dashboard): ").strip()
            if not t:
                print("[cpolar] no authtoken given")
                print("run: python setup.py --token <your_authtoken>")
                return 1
            token = t
        p, has_auth, missing, changed = ensure_cpolar_yml(token)
        print("[cpolar] authtoken written")
    if missing:
        print("[cpolar] added tunnels: %s" % ', '.join(missing))
    else:
        print("[cpolar] tunnels all defined")

    print("[data] guestbook/users/forum json auto-created on first service start")
    print("=== done, run 一键启动云端.cmd ===")
    return 0

if __name__ == "__main__":
    sys.exit(main())
