# -*- coding: utf-8 -*-
"""项目体检：JS 语法 / CSS 校验 / 跨 script 块重名覆盖 / 资源引用 / 空引用风险 / 残留调试代码"""
import io, os, re, subprocess, sys, glob

ROOT = r'D:\WTZ\prts'
out = io.open(os.path.join(ROOT, 'scripts', '_audit.txt'), 'w', encoding='utf-8', newline='\n')


def w(s=''):
    out.write(s + '\n')


HTML = sorted(glob.glob(os.path.join(ROOT, '*.html')))
issues = []

w('#' * 78)
w('# 项目体检报告')
w('#' * 78)
w()

# ---------- 1) JS 语法 ----------
w('=' * 78)
w('1) JS 语法检查（每个 <script> 块 node --check）')
w('=' * 78)
for p in HTML:
    s = io.open(p, encoding='utf-8').read()
    blocks = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', s, re.S)
    bad = []
    for i, b in enumerate(blocks):
        tmp = os.path.join(ROOT, 'scripts', '_c%d.js' % i)
        io.open(tmp, 'w', encoding='utf-8').write(b)
        r = subprocess.run(['node', '--check', tmp], capture_output=True, text=True, encoding='utf-8')
        os.remove(tmp)
        if r.returncode:
            bad.append((i, r.stderr.strip().splitlines()[-1][:110]))
    if bad:
        issues.append('%s: JS 语法错误 %s' % (os.path.basename(p), bad))
        w('  BAD  %-28s %s' % (os.path.basename(p), bad))
    else:
        w('  ok   %-28s %d 块' % (os.path.basename(p), len(blocks)))

# ---------- 2) CSS 括号 + var() ----------
w('')
w('=' * 78)
w('2) CSS 校验（括号平衡 / var() 是否都有定义）')
w('=' * 78)
for p in HTML:
    s = io.open(p, encoding='utf-8').read()
    css = '\n'.join(re.findall(r'<style[^>]*>(.*?)</style>', s, re.S))
    if not css.strip():
        continue
    bal = css.count('{') == css.count('}')
    defined = set(re.findall(r'(--[a-zA-Z0-9-]+)\s*:', s))
    used = set(re.findall(r'var\((--[a-zA-Z0-9-]+)', css))
    runtime = {'--dx', '--dy', '--so', '--mx', '--my'}
    # variables set at runtime by JS (any quote style, incl. setProperty)
    js_set = set(re.findall(r"setProperty\(\s*['\"](--[a-zA-Z0-9-]+)", s))
    js_set |= set(re.findall(r"style\.setProperty\(\s*['\"](--[a-zA-Z0-9-]+)", s))
    # var() calls that carry a fallback cannot break even if undefined
    with_fallback = set(re.findall(r'var\((--[a-zA-Z0-9-]+)\s*,', css))
    missing = sorted(used - defined - runtime - js_set - with_fallback)
    tag = []
    if not bal:
        tag.append('括号不平衡 %d/%d' % (css.count('{'), css.count('}')))
    if missing:
        tag.append('未定义变量 %s' % missing)
    if tag:
        issues.append('%s: CSS %s' % (os.path.basename(p), '; '.join(tag)))
        w('  BAD  %-28s %s' % (os.path.basename(p), '; '.join(tag)))
    else:
        w('  ok   %-28s braces=%d/%d vars ok' % (os.path.basename(p), css.count('{'), css.count('}')))

# ---------- 3) 跨 script 块重名覆盖（仅统计真正的全局声明） ----------
w('')
w('=' * 78)
w('3) 跨 <script> 块重名（仅统计全局作用域；IIFE 内的同名互不影响）')
w('=' * 78)


def top_level_funcs(src):
    """Return function names declared at script top level (brace depth 0),
    ignoring anything nested inside a function/IIFE."""
    names = set()
    depth = 0
    i = 0
    n = len(src)
    in_str = None
    while i < n:
        c = src[i]
        if in_str:
            if c == '\\':
                i += 2
                continue
            if c == in_str:
                in_str = None
            i += 1
            continue
        if c in '"\'`':
            in_str = c
            i += 1
            continue
        if c == '/' and i + 1 < n and src[i + 1] == '/':
            j = src.find('\n', i)
            i = n if j < 0 else j + 1
            continue
        if c == '/' and i + 1 < n and src[i + 1] == '*':
            j = src.find('*/', i)
            i = n if j < 0 else j + 2
            continue
        if c == '{':
            depth += 1
            i += 1
            continue
        if c == '}':
            depth -= 1
            i += 1
            continue
        if depth == 0 and src.startswith('function', i):
            m = re.match(r'function\s+([A-Za-z_$][\w$]*)\s*\(', src[i:])
            if m:
                names.add(m.group(1))
                i += m.end()
                continue
        i += 1
    return names


for p in HTML:
    s = io.open(p, encoding='utf-8').read()
    blocks = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', s, re.S)
    if len(blocks) < 2:
        continue
    seen = {}
    dups = []
    for bi, b in enumerate(blocks):
        for name in top_level_funcs(b):
            if name in seen and seen[name] != bi:
                dups.append((name, seen[name], bi))
            seen[name] = bi
    if dups:
        w('  WARN %-28s 全局重名:' % os.path.basename(p))
        for n_, a_, b_ in dups:
            w('        %s(): 块%d 被 块%d 覆盖' % (n_, a_, b_))
        issues.append('%s: 全局函数重名 %s' % (os.path.basename(p), ','.join(sorted(set(d[0] for d in dups)))))
    else:
        w('  ok   %-28s 无全局重名' % os.path.basename(p))

# ---------- 4) 资源引用 ----------
w('')
w('=' * 78)
w('4) 本地资源引用是否存在')
w('=' * 78)
for p in HTML:
    s = io.open(p, encoding='utf-8').read()
    refs = set(re.findall(r'(?:src|href)="([^"#][^"]*)"', s))
    miss = []
    for r in refs:
        if r.startswith(('http://', 'https://', 'data:', 'javascript:', 'mailto:', '#')):
            continue
        # 跳过模板/拼接出来的动态路径，以及正则替换占位符（$1/$2）
        if any(t in r for t in ('${', "'+", '"+', '`+', '$1', '$2', '$3')):
            continue
        rp = r.split('?')[0].split('#')[0]
        if not rp or rp.endswith('/'):
            continue
        if not os.path.exists(os.path.join(ROOT, rp.replace('/', os.sep))):
            miss.append(r)
    if miss:
        w('  WARN %-28s 缺失: %s' % (os.path.basename(p), sorted(miss)[:6]))
        issues.append('%s: 缺失资源 %s' % (os.path.basename(p), sorted(miss)[:4]))
    else:
        w('  ok   %-28s %d 个引用全部存在' % (os.path.basename(p), len(refs)))

# ---------- 5) 残留调试代码 ----------
w('')
w('=' * 78)
w('5) 残留调试代码 / 占位符')
w('=' * 78)
pat = {
    'console.log': re.compile(r'console\.log\('),
    'debugger': re.compile(r'\bdebugger\b'),
    'TODO/FIXME': re.compile(r'\b(TODO|FIXME|XXX)\b'),
    'alert(': re.compile(r'\balert\('),
}
for p in HTML:
    s = io.open(p, encoding='utf-8').read()
    hits = []
    for name, rx in pat.items():
        n = len(rx.findall(s))
        if n:
            hits.append('%s×%d' % (name, n))
    if hits:
        w('  note %-28s %s' % (os.path.basename(p), ', '.join(hits)))
    else:
        w('  ok   %-28s 干净' % os.path.basename(p))

# ---------- 6) Python ----------
w('')
w('=' * 78)
w('6) Python 编译')
w('=' * 78)
for p in sorted(glob.glob(os.path.join(ROOT, '*.py')) + glob.glob(os.path.join(ROOT, '_cloud', '*.py')) + glob.glob(os.path.join(ROOT, 'scripts', '*.py'))):
    r = subprocess.run([sys.executable, '-m', 'py_compile', p], capture_output=True, text=True)
    rel = os.path.relpath(p, ROOT)
    if r.returncode:
        issues.append('%s: Python 编译失败' % rel)
        w('  BAD  %-34s %s' % (rel, r.stderr.strip()[:110]))
    else:
        w('  ok   %-34s' % rel)

# ---------- 7) JSON ----------
w('')
w('=' * 78)
w('7) JSON 数据文件')
w('=' * 78)
import json
n_ok = 0
for p in sorted(glob.glob(os.path.join(ROOT, '_gb', '*.json')) + glob.glob(os.path.join(ROOT, '_cloud', '*.json')) + glob.glob(os.path.join(ROOT, '*.json'))):
    rel = os.path.relpath(p, ROOT)
    if any(x in p for x in ('.corrupt', '.bak', '.tmp')):
        continue
    try:
        json.load(io.open(p, encoding='utf-8'))
        n_ok += 1
    except Exception as e:
        issues.append('%s: JSON 损坏 %s' % (rel, e))
        w('  BAD  %-34s %s' % (rel, str(e)[:80]))
w('  合法 JSON 文件: %d' % n_ok)

# ---------- 8) 两份服务端一致性 ----------
w('')
w('=' * 78)
w('8) _gb 与 _cloud 服务端一致性')
w('=' * 78)
a = io.open(os.path.join(ROOT, '_gb', 'guestbook_server.py'), encoding='utf-8').read()
b = io.open(os.path.join(ROOT, '_cloud', 'guestbook_server.py'), encoding='utf-8').read()
if a == b:
    w('  ok   两份完全一致（%d 字符）' % len(a))
else:
    import difflib
    d = list(difflib.unified_diff(a.splitlines(), b.splitlines(), lineterm='', n=0))
    issues.append('_gb 与 _cloud 服务端不一致（%d 行差异）' % len(d))
    w('  BAD  存在差异 %d 行:' % len(d))
    for line in d[:24]:
        w('        ' + line[:110])

# ---------- 汇总 ----------
w('')
w('#' * 78)
if issues:
    w('# 发现 %d 个问题：' % len(issues))
    for i, x in enumerate(issues, 1):
        w('#  %d. %s' % (i, x))
else:
    w('# 未发现问题')
w('#' * 78)
out.close()
print('audit written, issues=%d' % len(issues))
