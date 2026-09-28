// 滑动去重回归：一次 swipe 只触发一次 goReel（+1 页）
const fs = require('fs');
const path = 'D:/WTZ/noida/37ed/prts/PRTS泰拉大典终端.html';
const src = fs.readFileSync(path, 'utf8');
const { JSDOM, VirtualConsole } = require('C:/Users/Administrator/AppData/Local/Temp/rl_jsdom/node_modules/jsdom');
const vc = new VirtualConsole();
vc.on('jsdomError', () => {});
const dom = new JSDOM(src, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'http://localhost/' });
const { window } = dom;
const { document } = window;
const $ = s => document.querySelector(s);
setTimeout(() => {
  const reel = $('#reel');
  // 进入系统（boot 只拦 Enter）
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
  setTimeout(() => {
    if (!$('#shell').classList.contains('on')) { console.log('FAIL 未进入系统'); process.exit(1); }
    const before = window.eval('S.reel');
    // 模拟一次左滑（300 → 200，dx=-100，应 +1）
    const ts = new window.Event('touchstart', { bubbles: true, cancelable: true });
    ts.touches = [{ clientX: 300, clientY: 300 }];
    ts.changedTouches = [{ clientX: 300, clientY: 300 }];
    reel.dispatchEvent(ts);
    const te = new window.Event('touchend', { bubbles: true, cancelable: true });
    te.touches = [];
    te.changedTouches = [{ clientX: 200, clientY: 300 }];
    reel.dispatchEvent(te);
    setTimeout(() => {
      const after = window.eval('S.reel');
      const delta = (after - before + 32) % 32;
      console.log('before:', before, 'after:', after, 'delta:', delta);
      if (delta === 1) { console.log('PASS 一次滑动只翻一页'); process.exit(0); }
      console.log('FAIL 滑动翻页次数异常（应 +1，实际 +' + delta + '）');
      process.exit(1);
    }, 300);
  }, 700);
}, 200);
