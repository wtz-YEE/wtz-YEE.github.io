# -*- coding: utf-8 -*-
"""Extract and syntax-check every inline <script> block of the given HTML files."""
import re, io, subprocess, os, sys

base = r'D:\WTZ\prts\scripts'
bad = 0
for t in sys.argv[1:]:
    s = io.open(t, encoding='utf-8').read()
    blocks = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', s, re.S)
    n_bad = 0
    for i, b in enumerate(blocks):
        p = os.path.join(base, '_chk_%d.js' % i)
        io.open(p, 'w', encoding='utf-8').write(b)
        r = subprocess.run(['node', '--check', p], capture_output=True, text=True, encoding='utf-8')
        if r.returncode:
            n_bad += 1
            bad += 1
            print('  BLOCK %d FAIL in %s' % (i, os.path.basename(t)))
            print(r.stderr[-800:])
        os.remove(p)
    print('%-26s blocks=%-3d %s' % (os.path.basename(t), len(blocks), 'OK' if n_bad == 0 else 'FAIL'))
print('TOTAL FAILURES = %d' % bad)
sys.exit(1 if bad else 0)
