// PRTS 泰拉大典终端 jsdom 回归测试（200 条档案版）
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('C:/Users/Administrator/AppData/Local/Temp/rl_jsdom/node_modules/jsdom');
const htmlPath = 'D:/WTZ/noida/37ed/prts/PRTS泰拉大典终端.html';
const src = fs.readFileSync(htmlPath, 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + e.message));
const dom = new JSDOM(src, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'http://localhost/' });
const { window } = dom;
const { document } = window;
const $ = s => document.querySelector(s);
function fire(el, type, opts) {
  el.dispatchEvent(new window.MouseEvent(type, Object.assign({ bubbles: true, cancelable: true }, opts || {})));
}
function key(k) {
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
}
const log = [];
function t(name, ok) { log.push((ok ? 'PASS ' : 'FAIL ') + name); if (!ok) errors.push('assert: ' + name); }
const DB = () => window.eval('DB');
const S = () => window.eval('S');
setTimeout(() => {
  try {
    t('结构: boot 存在', !!$('#boot'));
    t('结构: reel 存在', !!$('#reel'));
    t('结构: browser 存在', !!$('#browser'));
    t('数据: 干员 48', DB().ops.length === 48);
    t('数据: 组织 30', DB().orgs.length === 30);
    t('数据: 地理 30', DB().geo.length === 30);
    t('数据: 年表 38', DB().tl.length === 38);
    t('数据: 词库 38', DB().lex.length === 38);
    t('数据: 轮播 32', window.eval('REEL').length === 32);
    t('boot: 初始 hidden', !$('#shell').classList.contains('on'));
    key('Enter');
    setTimeout(() => {
      t('boot: Enter 后进入系统', $('#shell').classList.contains('on'));
      t('reel: 首个条目 阿米娅', $('#rcName').textContent === '阿米娅');
      t('reel: 页码 01', $('#rpCur').textContent === '01');
      fire($('#rcOpen'), 'click');
      t('pvDetail: 打开', $('#pvDetail').classList.contains('on'));
      t('pvDetail: 标题 阿米娅', $('#pcName').textContent === '阿米娅');
      fire($('#pdClose'), 'click');
      t('pvDetail: 关闭', !$('#pvDetail').classList.contains('on'));
      window.openBrowser();
      t('browser: 打开', $('#browser').classList.contains('on'));
      t('browser: tree 6 项', document.querySelectorAll('#tree .tree-item').length === 6);
      t('browser: 列表行数', document.querySelectorAll('.file-row').length === 48);
      const first = document.querySelector('.file-row');
      fire(first, 'click');
      t('detail: 打开', !$('#detail').classList.contains('hidden'));
      t('detail: 标题 阿米娅', $('#dTtl').textContent === '阿米娅');
      t('detail: 三页签', document.querySelectorAll('#dTabs button').length === 3);
      const tabs = document.querySelectorAll('#dTabs button');
      fire(tabs[2], 'click');
      t('detail: 访问日志页签', $('#dBody').textContent.includes('访问日志'));
      window.openSearch();
      t('search: 模态打开', $('#t-modal').classList.contains('on'));
      $('#tmIn').value = '源石';
      $('#tmIn').dispatchEvent(new window.Event('input', { bubbles: true }));
      t('search: 命中记录', $('#tmCount').textContent.includes('RECORDS FOUND'));
      window.closeSearch();
      $('#cmd').classList.add('on');
      t('cmd: 打开', $('#cmd').classList.contains('on'));
      window.runCmd('help');
      t('cmd: help 输出', $('#conOut').children.length > 10);
      window.runCmd('cd lex');
      t('cmd: cd lex', S().curDir === 'lex');
      window.runCmd('cat LX-001');
      t('cmd: cat 源石', $('#dTtl').textContent === '源石');
      window.runCmd('theme');
      const bg = window.getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
      t('cmd: theme 切换', bg !== '#0A0C0E');
      window.runCmd('theme');
      window.runCmd('clear');
      t('cmd: clear', $('#conOut').children.length === 0);
      window.toggleFav('OP-001');
      t('fav: 已收藏', window.eval('saved').includes('OP-001'));
      // 时间轴
      S().curDir = 'tl';
      window.renderFiles();
      t('tl: 时间轴渲染', document.querySelectorAll('.tl-item').length === 38);
      // 六维条 + 关联
      window.openDetail('OP-001');
      t('detail: 六维条 6 个', document.querySelectorAll('.pbar').length === 6);
      t('detail: 关联按钮', !!document.querySelector('.rel-btn'));
      const rel = document.querySelector('.rel-btn');
      if (rel) fire(rel, 'click');
      t('rel: 跳转罗德岛', $('#dTtl').textContent === '罗德岛');
      // 随机
      window.runCmd('rand');
      t('cmd rand: 输出随机', $('#conOut').textContent.includes('随机档案'));
      // 图片引用
      const imgs = [...document.querySelectorAll('img')].map(i => i.getAttribute('src')).filter(Boolean);
      const local = imgs.filter(s => s.startsWith('assets/'));
      t('图片: 本地引用存在', local.length >= 48);
      const missing = local.filter(s => !fs.existsSync(path.join(path.dirname(htmlPath), s)));
      t('图片: 文件齐全', missing.length === 0);
      console.log(log.join('\n'));
      const real = errors.filter(x => !x.includes('Not implemented') && !x.includes('Could not parse CSS'));
      console.log('\n=== ERRORS ===');
      console.log(real.length ? real.join('\n') : '(none)');
      process.exit(real.length ? 1 : 0);
    }, 700);
  } catch (e) {
    console.log('FATAL', e);
    process.exit(1);
  }
}, 200);
