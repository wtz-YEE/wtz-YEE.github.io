// 档案静默渲染回归：openDetail 后列表行不得带 rise 动画
const fs = require('fs');
const src = fs.readFileSync('D:/WTZ/noida/37ed/prts/PRTS泰拉大典终端.html', 'utf8');
const { JSDOM, VirtualConsole } = require('C:/Users/Administrator/AppData/Local/Temp/rl_jsdom/node_modules/jsdom');
const vc = new VirtualConsole();
vc.on('jsdomError', () => {});
const dom = new JSDOM(src, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'http://localhost/' });
const { window } = dom;
const { document } = window;
const $ = s => document.querySelector(s);
setTimeout(() => {
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
  setTimeout(() => {
    window.openBrowser();
    window.openDetail('OP-001');
    const rows = [...document.querySelectorAll('.file-row')];
    const bad = rows.filter(r => (r.getAttribute('style')||'').includes('animation-delay'));
    const dossierKids = document.querySelectorAll('.dossier > *');
    const dossierAnim = [...dossierKids].filter(el => window.getComputedStyle(el).animationName !== 'none').length;
    console.log('file-row 总行数:', rows.length, '| 带动画行:', bad.length);
    console.log('dossier 子元素动画数:', dossierAnim, '/', dossierKids.length);
    if (bad.length === 0 && dossierAnim === 0) { console.log('PASS 打开档案不再重播列表/内容动画'); process.exit(0); }
    console.log('FAIL 仍有动画重播'); process.exit(1);
  }, 700);
}, 200);
