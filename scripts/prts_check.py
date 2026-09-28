# -*- coding: utf-8 -*-
import re, io, subprocess, os
p = r'D:\WTZ\noida\37ed\prts\PRTS泰拉大典终端.html'
s = io.open(p, encoding='utf-8').read()
m = re.search(r'<script>(.*?)</script>', s, re.S)
ck = r'D:\WTZ\noida\37ed\prts\scripts\_check.js'
io.open(ck, 'w', encoding='utf-8').write(m.group(1))
print('js length:', len(m.group(1)))
r = subprocess.run(['node', '--check', ck], capture_output=True, text=True, encoding='utf-8')
print('node --check exit:', r.returncode)
if r.returncode != 0:
    print(r.stderr[-2000:])
    raise SystemExit(1)
r = subprocess.run(['node', r'D:\WTZ\noida\37ed\prts\scripts\prts_test.js'], capture_output=True, text=True, encoding='utf-8', timeout=120)
print(r.stdout)
if r.stderr: print('STDERR:', r.stderr[-1500:])
print('test exit:', r.returncode)
os.remove(ck)
raise SystemExit(r.returncode)
