# -*- coding: utf-8 -*-
# PRTS 竖屏功能栏修复 v2.2
import io
p = r'D:\WTZ\noida\37ed\prts\PRTS泰拉大典终端.html'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, must=1):
    global s
    n = s.count(old)
    assert n == must, f"count={n} for: {old[:70]!r}"
    s = s.replace(old, new)

# 1) 900 断点：pv-menu 由隐藏改为图标化显示，stat 隐藏腾位
rep('''/* 中屏细化 900px */
@media (max-width:900px){
  #sidebar{width:200px}
  .pv-menu{display:none}
  #infoLine{display:none}
  .file-row{grid-template-columns:30px 1fr 80px 90px;gap:8px}
  .file-row .meta:last-child{display:none}
  #search{width:130px}
}''',
'''/* 中屏细化 900px */
@media (max-width:900px){
  #sidebar{width:200px}
  .pv-menu{display:flex;gap:4px}
  .pv-menu span{width:34px;height:34px;padding:0;font-size:0;border:1px solid var(--line2);color:var(--ink2);display:inline-flex;align-items:center;justify-content:center;background:none;transition:all .15s;touch-action:manipulation}
  .pv-menu span b{font-size:11px;color:var(--accent2);font-weight:700}
  .pv-menu span:active{transform:scale(.93);border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}
  .pv-stat{display:none}
  #infoLine{display:none}
  .file-row{grid-template-columns:30px 1fr 80px 90px;gap:8px}
  .file-row .meta:last-child{display:none}
  #search{width:130px}
}''')

# 2) 680 断点：pv-menu 由隐藏改为紧凑图标钮；topbar 全部功能保留（横向滚动兜底）
rep('''  .pv-brand .l3{font-size:8px;letter-spacing:.3em}
  .pv-menu{display:none}''',
'''  .pv-brand .l3{font-size:8px;letter-spacing:.3em}
  .pv-menu{display:flex;gap:3px}
  .pv-menu span{width:32px;height:32px}
  .pv-menu span b{font-size:10px}''')

# 3) 820 断点：不再隐藏功能按钮，改横向滚动 + 紧凑
rep('''@media (max-width:820px){
  #topbar .crumb{display:none}
  #topbar .nav-btn:not(.keep){display:none}
  #clock{display:none}
}''',
'''@media (max-width:820px){
  #topbar{overflow-x:auto;scrollbar-width:none}
  #topbar::-webkit-scrollbar{display:none}
  #topbar .crumb{display:none}
  #topbar .right{flex:none}
  #clock{display:none}
  .nav-btn{height:30px;padding:0 8px;font-size:9.5px}
  .nav-btn .key{display:none}
}''')

# 4) 480 断点：菜单钮再收一点
rep('''  #pvTop{padding:12px 14px 0;min-height:62px;gap:10px}''',
'''  #pvTop{padding:12px 14px 0;min-height:62px;gap:10px}
  .pv-menu span{width:30px;height:30px}
  .pv-menu span b{font-size:9.5px}''')

io.open(p, 'w', encoding='utf-8').write(s)
print('menu fix done, len:', len(s))
