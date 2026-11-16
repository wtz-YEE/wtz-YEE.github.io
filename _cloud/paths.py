# -*- coding: utf-8 -*-
import glob, json, os, shutil, sys

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)
CFG = os.path.join(BASE, "cloud_services.json")

def load_cfg():
    try:
        data = json.load(open(CFG, encoding="utf-8"))
        return data if isinstance(data, list) else []
    except Exception:
        return []

def enabled():
    return [s for s in load_cfg() if s.get("enabled", True)]

def svc_port(name="guestbook", default=8701):
    for s in load_cfg():
        if s.get("name") == name:
            try:
                return int(s.get("port") or default)
            except Exception:
                break
    return default

def _roots():
    r = []
    for k in ("LOCALAPPDATA", "PROGRAMFILES", "PROGRAMFILES(X86)", "ProgramW6432"):
        v = os.environ.get(k)
        if v and os.path.isdir(v) and v not in r:
            r.append(v)
    for d in "CDEFGH":
        p = d + ":\\"
        if os.path.isdir(p) and p not in r:
            r.append(p)
    return r

def find_python(exe="python.exe"):
    for c in python_candidates(exe):
        return c
    return None

def python_candidates(exe="python.exe"):
    out = []
    def add(p):
        if p and os.path.isfile(p) and p not in out:
            out.append(p)
    if os.path.isfile(sys.executable):
        add(os.path.join(os.path.dirname(sys.executable), exe))
    add(shutil.which(exe))
    pats = []
    for b in _roots():
        pats.append(os.path.join(b, "Programs", "Python", "Python3*", exe))
        pats.append(os.path.join(b, "Python", "pythoncore-*", exe))
        pats.append(os.path.join(b, "Python3*", exe))
        pats.append(os.path.join(b, "Program Files", "Python3*", exe))
        pats.append(os.path.join(b, "Program Files", "Python", "Python3*", exe))
    for pat in pats:
        for hit in sorted(glob.glob(pat), reverse=True):
            add(hit)
    return out

def find_cpolar():
    env = os.environ.get("WTZ_CPOLAR")
    if env and os.path.isfile(env):
        return env
    for c in ("cpolar.exe", "cpolar"):
        w = shutil.which(c)
        if w:
            return w
    cands = []
    for b in _roots():
        cands.append(os.path.join(b, "cpolar", "cpolar.exe"))
        cands.append(os.path.join(b, "cpolar.exe"))
        cands.append(os.path.join(b, "Program Files", "cpolar", "cpolar.exe"))
        cands.append(os.path.join(b, "Program Files", "cpolar.exe"))
        cands.append(os.path.join(b, "Program Files (x86)", "cpolar", "cpolar.exe"))
        cands.append(os.path.join(b, "Program Files (x86)", "cpolar.exe"))
    cands.append(os.path.join(os.path.expanduser("~"), ".cpolar", "cpolar.exe"))
    for c in cands:
        if os.path.isfile(c):
            return c
    return None

def repo_mode():
    return os.path.isdir(os.path.join(REPO, "pages")) or os.path.isfile(os.path.join(REPO, "cloud.txt"))

def addrfile(name):
    if repo_mode():
        return os.path.join(REPO, name)
    return os.path.join(BASE, name)

def cloud_txt():
    return addrfile("cloud.txt")
