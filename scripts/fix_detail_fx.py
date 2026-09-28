# -*- coding: utf-8 -*-
# PRTS 干员档案特效抽风修复 v2.4
import io
p = r'D:\WTZ\noida\37ed\prts\PRTS泰拉大典终端.html'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, must=1):
    global s
    n = s.count(old)
    assert n == must, f"count={n} for: {old[:70]!r}"
    s = s.replace(old, new)

# 1) renderFiles 支持静默模式（不重播列表入场动画）
rep('''function renderFiles(){
  const dir = S.curDir;''',
'''function renderFiles(anim){
  if(anim === undefined) anim = true;
  const dir = S.curDir;''')
rep('''      <div class="tl-item ${x.id===S.curId?"selected":""}" data-id="${x.id}" style="animation:rise .35s ease backwards;animation-delay:${Math.min(i*30,240)}ms">''',
'''      <div class="tl-item ${x.id===S.curId?"selected":""}" data-id="${x.id}" style="${anim?"animation:rise .35s ease backwards;animation-delay:"+Math.min(i*30,240)+"ms":"animation:none"}">''')
rep('''      <div class="file-row ${x.id===S.curId?"selected":""}" data-id="${x.id}" style="animation-delay:${Math.min(i*22,300)}ms">''',
'''      <div class="file-row ${x.id===S.curId?"selected":""}" data-id="${x.id}" style="${anim?"animation-delay:"+Math.min(i*22,300)+"ms":"animation:none"}">''')

# 2) openDetail / closeDetail 静默重渲染（点开档案时列表不再集体重播 rise）
rep('''  $("#detail").classList.remove("hidden");
  renderFiles();
}
function closeDetail(){ sfx.close(); $("#detail").classList.add("hidden"); S.curId = null; renderFiles(); }''',
'''  $("#detail").classList.remove("hidden");
  renderFiles(false);
}
function closeDetail(){ sfx.close(); $("#detail").classList.add("hidden"); S.curId = null; renderFiles(false); }''')

# 3) 档案内容不再逐元素升起（每次 innerHTML 重建都重播 rise = 抽风主因）
rep('.dossier>*{animation:rise .4s cubic-bezier(.16,.8,.28,1) backwards}',
    '.dossier>*{animation:none}')

# 4) 立绘 hover 放大仅限鼠标设备（触屏 tap 不再粘滞放大）
rep('''.dossier .portrait img{width:100%;height:100%;object-fit:cover;object-position:top center;transition:transform .3s}
.dossier .portrait:hover img{transform:scale(1.05)}''',
'''.dossier .portrait img{width:100%;height:100%;object-fit:cover;object-position:top center;transition:transform .3s}
@media (hover:hover){.dossier .portrait:hover img{transform:scale(1.05)}}''')

# 5) d-tabs hover 仅限鼠标设备
rep('''.d-tabs button:hover{color:var(--ink2)}''',
'''@media (hover:hover){.d-tabs button:hover{color:var(--ink2)}}''')

io.open(p, 'w', encoding='utf-8').write(s)
print('detail fx fix done, len:', len(s))
