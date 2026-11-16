# -*- coding: utf-8 -*-
import os, socket, subprocess, sys, time, urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import paths

def has_flask(exe):
    try:
        r = subprocess.run([exe, "-c", "import flask, flask_cors"], capture_output=True, timeout=10)
        return r.returncode == 0
    except Exception:
        return False

def find_pythonw():
    cands = paths.python_candidates("pythonw.exe")
    for c in cands:
        if has_flask(c):
            return c
    return cands[0] if cands else (paths.find_python("python.exe") or None)

def port_active(port):
    try:
        s = socket.create_connection(("127.0.0.1", port), timeout=1)
        s.close()
        return True
    except OSError:
        return False

def resolve(script):
    if not os.path.isabs(script):
        return os.path.join(BASE, script)
    if os.path.exists(script):
        return script
    return os.path.join(BASE, os.path.basename(script))

def main():
    pyw = find_pythonw()
    if not pyw:
        print("NO_PYTHON")
        return 1
    for svc in paths.enabled():
        name = svc["name"]
        port = svc["port"]
        if port_active(port):
            print(name, "running")
            continue
        script = resolve(svc["script"])
        if not os.path.exists(script):
            print(name, "SCRIPT_MISSING", script)
            continue
        subprocess.Popen([pyw, script], cwd=BASE, creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
        print(name, "starting")
        ok = False
        for _ in range(60):
            time.sleep(1)
            try:
                r = urllib.request.urlopen(urllib.request.Request(
                    "http://127.0.0.1:%d%s" % (port, svc.get("health", "/health"))), timeout=2)
                if r.status == 200:
                    ok = True
                    break
            except Exception:
                pass
        if not ok and port_active(port):
            ok = True
        print(name, "health", "ok" if ok else "FAIL")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
