# -*- coding: utf-8 -*-
# PRTS 静态校验 v2（200 条档案版）
import re, io, os, sys
p = r'D:\WTZ\noida\37ed\prts\PRTS泰拉大典终端.html'
s = io.open(p, encoding='utf-8').read()
base = os.path.dirname(p)
ok = True
def chk(name, cond):
    global ok
    print(('OK  ' if cond else 'BAD ') + name)
    if not cond: ok = False

# 标签配对（排除自闭合 svg path）
for tag in ['div','span','button','table','tr','td','svg']:
    o = len(re.findall(r'<%s[ >]' % tag, s)); c = len(re.findall(r'</%s>' % tag, s))
    chk('tag %s open=%d close=%d' % (tag, o, c), o == c)
chk('script 1', s.count('<script>') == 1 and s.count('</script>') == 1)
chk('style 1', s.count('<style>') == 1 and s.count('</style>') == 1)

# 图片引用：DB 数据中的本地资源
imgs = re.findall(r'img:"(assets/[^"]+)"', s)
chk('DB img refs: %d' % len(imgs), len(imgs) == 48)
miss = [i for i in imgs if not os.path.exists(os.path.join(base, i))]
chk('missing imgs: %s' % miss, not miss)

# 数据数量
chk('DB ops=48', len(re.findall(r'\{id:"OP-', s)) == 48)
chk('DB orgs=30', len(re.findall(r'\{id:"ORG-', s)) == 30)
chk('DB geo=30', len(re.findall(r'\{id:"GEO-', s)) == 30)
chk('DB tl=38', len(re.findall(r'\{id:"TL-', s)) == 38)
chk('DB lex=38', len(re.findall(r'\{id:"LX-', s)) == 38)
chk('DB reps=16', len(re.findall(r'\{id:"RP-', s)) == 16)
chk('REEL 32', s.count('{t:"') >= 32)

# 残留
chk('no markers', '__MORE' not in s and 'something todo' not in s and 'TODO' not in s)
# id 唯一（排除模板 ${}）
ids = [i for i in re.findall(r'id="([^"]+)"', s) if '${' not in i]
chk('ids unique (%d)' % len(ids), len(set(ids)) == len(ids))
sys.exit(0 if ok else 1)
