# -*- coding: utf-8 -*-
# PRTS 特效抽风修复 v2.3
import io
p = r'D:\WTZ\noida\37ed\prts\PRTS泰拉大典终端.html'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, must=1):
    global s
    n = s.count(old)
    assert n == must, f"count={n} for: {old[:70]!r}"
    s = s.replace(old, new)

# 1) goReel 加转场锁（_fxBusy），tilt 在转场期间让位
rep('''function goReel(d){
  sfx.switch();
  S.reel = (S.reel + d + REEL.length) % REEL.length;
  const c = $("#reelCenter");''',
'''let _fxBusy = false;
function goReel(d){
  sfx.switch();
  S.reel = (S.reel + d + REEL.length) % REEL.length;
  _fxBusy = true;
  const c = $("#reelCenter");''')
rep('''    c.style.transition = "transform .55s cubic-bezier(.16,.8,.28,1),opacity .32s ease";
    c.style.transform = "translateX(0) translateZ(0) rotateY(0)";
    c.style.opacity = "1";
  }));''',
'''    c.style.transition = "transform .55s cubic-bezier(.16,.8,.28,1),opacity .32s ease";
    c.style.transform = "translateX(0) translateZ(0) rotateY(0)";
    c.style.opacity = "1";
    setTimeout(() => { _fxBusy = false; }, 620);
  }));''')

# 2) 视差倾斜：转场期间让位 + 不再擅自改 transition（避免清掉 goReel 的转场过渡）
rep('''  let raf = null;
  reel.addEventListener("mousemove", e => {
    if(raf) return;
    raf = requestAnimationFrame(() => {
      const r = reel.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - .5;
      const ny = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(1100px) rotateY(${nx*7}deg) rotateX(${-ny*5}deg)`;
      raf = null;
    });
  });
  reel.addEventListener("mouseleave", () => {
    c.style.transform = "perspective(1100px) rotateY(0) rotateX(0)";
    c.style.transition = "transform .5s ease";
    setTimeout(() => c.style.transition = "", 520);
  });''',
'''  let raf = null;
  reel.addEventListener("mousemove", e => {
    if(_fxBusy) return;
    if(raf) return;
    raf = requestAnimationFrame(() => {
      const r = reel.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - .5;
      const ny = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(1100px) rotateY(${nx*7}deg) rotateX(${-ny*5}deg)`;
      raf = null;
    });
  });
  reel.addEventListener("mouseleave", () => {
    if(_fxBusy) return;
    c.style.transform = "perspective(1100px) rotateY(0) rotateX(0)";
  });''')

# 3) 双滑动监听去重：document 级只保留图库大图滑动，reel 交给 reel 级监听
rep('''/* 触控滑动 */
let tx = 0;
document.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, {passive:true});
document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - tx;
  if(Math.abs(dx) < 60) return;
  if(S.mode === "reel"){ goReel(dx < 0 ? 1 : -1); }
  else if($("#gView").classList.contains("on")){ openGView(dx < 0 ? S.gIndex+1 : S.gIndex-1); }
}, {passive:true});''',
'''/* 触控滑动（图库大图） */
let tx = 0;
document.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, {passive:true});
document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - tx;
  if(Math.abs(dx) < 60) return;
  if($("#gView").classList.contains("on")){ openGView(dx < 0 ? S.gIndex+1 : S.gIndex-1); }
}, {passive:true});''')

# 4) detail 抽屉去掉 3D 动画（与 margin 滑入过渡打架），回归稳定滑入
rep('''#detail:not(.hidden){animation:det3d .32s cubic-bezier(.16,.8,.28,1)}
@keyframes det3d{from{opacity:.3;transform:rotateY(-8deg)}to{opacity:1;transform:rotateY(0)}}''',
'''#detail:not(.hidden){animation:det3d .3s cubic-bezier(.16,.8,.28,1)}
@keyframes det3d{from{opacity:.25}to{opacity:1}}''')

# 5) 图库卡片去掉 will-change（低端机性能抖动）
rep('transform:perspective(720px) rotateX(var(--rx,0)) rotateY(var(--ry,0));will-change:transform',
    'transform:perspective(720px) rotateX(var(--rx,0)) rotateY(var(--ry,0))')

io.open(p, 'w', encoding='utf-8').write(s)
print('fx fix done, len:', len(s))
