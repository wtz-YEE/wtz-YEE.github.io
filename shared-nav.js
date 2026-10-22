/* ===== 全站通用登录条 + 折叠导航面板（shared-nav.js） =====
   用法：任意页面引入本脚本即可。页面若存在 <header id="status">，脚本会自动：
   1) 把 .st-nav 的导航链接收进右侧折叠面板（☰ 菜单 按钮触发）；
   2) 把工具按钮（bgm/srch/th/ui/vm）移入面板；
   3) 顶栏保留：站点名 + 时钟 + 汉堡 + 登录状态徽章（LV 权限/签到/私聊/通知）。
   不破坏原有元素 id，原页面 JS 对 permBadge/lvBtn/pmBadge/ntBadge 的绑定继续有效。
*/
(function(){
  function boot(){
    var st = document.getElementById('status');
    if(!st){ console.warn('[nav] no #status, skip'); return; }
    if(st.getAttribute('data-nav') === '1') return;
    st.setAttribute('data-nav', '1');

    var css = '\
.nav-burger{background:none;border:1px solid var(--line2,#555);color:var(--accent2,#ccc);margin-left:10px;cursor:pointer;display:inline-flex;flex-direction:column;justify-content:center;align-items:center;padding:2px 8px;min-height:30px;height:30px;border-radius:2px;font-family:var(--mono,monospace);font-size:11px;letter-spacing:.08em;white-space:nowrap}\
.nav-burger b{display:block;font-weight:400}\
.nav-burger .nb-i{display:flex;gap:2px;margin-bottom:2px}\
.nav-burger .nb-i i{display:block;width:11px;height:1px;background:currentColor}\
.nav-burger:hover{border-color:var(--accent,#fff);color:var(--accent,#fff)}\
.nav-mask{position:fixed;inset:0;z-index:160;background:rgba(0,0,0,.55);display:none;justify-content:flex-end}\
.nav-mask.on{display:flex}\
.nav-panel{width:min(340px,86vw);height:100%;background:var(--panel2,#101010);border-left:1px solid var(--line2,#333);padding:16px 18px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;box-sizing:border-box}\
.np-head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line2,#333);padding-bottom:10px;font-family:var(--mono,monospace);letter-spacing:.14em;color:var(--accent2,#bbb);font-size:12px}\
.np-head button{font-family:inherit;background:none;border:1px solid var(--line2,#444);color:var(--ink,#eee);cursor:pointer;padding:3px 10px;font-size:11px;min-height:28px}\
.np-head button:hover{border-color:var(--accent,#fff);color:var(--accent,#fff)}\
.np-user{border:1px dashed var(--line2,#444);padding:10px 12px;font-family:var(--mono,monospace);font-size:12px;color:var(--ink2,#aaa);letter-spacing:.06em;line-height:1.8}\
.np-user b{color:var(--accent,#fff)}\
.np-links{display:flex;flex-direction:column;gap:2px;border-bottom:1px solid var(--line2,#333);padding-bottom:12px}\
.np-links a{padding:10px 8px;font-family:var(--mono,monospace);color:var(--ink,#eee);text-decoration:none;font-size:13px;letter-spacing:.1em;border-left:2px solid transparent;display:block}\
.np-links a:before{content:"\25B2 ";color:var(--accent,#fff)}\
.np-links a:hover{background:var(--panel,#181818);border-left-color:var(--accent,#fff);color:var(--accent,#fff)}\
.np-tools{display:flex;flex-direction:column;gap:6px}\
.np-tools .th-btn{width:100%;text-align:left;min-height:44px}\
.np-hint{font-size:11px;color:var(--ink3,#888);letter-spacing:.06em;font-family:var(--mono,monospace)}';
    var stl = document.createElement('style');
    stl.textContent = css;
    document.head.appendChild(stl);

    var burger = document.createElement('button');
    burger.type = 'button';
    burger.id = 'navBurger';
    burger.className = 'nav-burger';
    burger.setAttribute('aria-label', '导航菜单');
    burger.setAttribute('title', '导航菜单');
    burger.innerHTML = '<span class="nb-i"><i></i><i></i><i></i></span><b>菜单</b>';

    var mask = document.createElement('div');
    mask.id = 'navMask';
    mask.className = 'nav-mask';
    var panel = document.createElement('div');
    panel.id = 'navPanel';
    panel.className = 'nav-panel';
    mask.appendChild(panel);
    document.body.appendChild(mask);

    var links = [];
    var nav = st.querySelector('.st-nav');
    if(nav){
      var as = nav.querySelectorAll('a');
      for(var i = 0; i < as.length; i++){
        links.push({ t: as[i].textContent, h: as[i].getAttribute('href') });
      }
      nav.style.display = 'none';
    }

    var tools = [];
    ['bgmBtn','srchBtn','thBtn','uiBtn','vmBtn'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) tools.push(el);
    });

    var head = document.createElement('div');
    head.className = 'np-head';
    head.textContent = 'NAV // 全站通用登录条';
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '\u2715 关闭';
    head.appendChild(closeBtn);
    panel.appendChild(head);

    var user = document.createElement('div');
    user.className = 'np-user';
    var lv = (document.getElementById('permBadge') || {}).textContent || 'LV --';
    user.innerHTML = '用户状态：<b>' + lv + '</b><br>签到 / 私聊 / 通知 徽章在顶栏右侧';
    panel.appendChild(user);

    var lg = document.createElement('nav');
    lg.className = 'np-links';
    links.forEach(function(l){
      var d = document.createElement('a');
      d.textContent = l.t;
      d.setAttribute('href', l.h);
      d.addEventListener('click', function(){ mask.classList.remove('on'); });
      lg.appendChild(d);
    });
    panel.appendChild(lg);

    if(tools.length){
      var tg = document.createElement('div');
      tg.className = 'np-tools';
      tools.forEach(function(b){ tg.appendChild(b); });
      panel.appendChild(tg);
    }

    var hint = document.createElement('div');
    hint.className = 'np-hint';
    hint.textContent = 'WTZ // 个人站 · 黑白终端';
    panel.appendChild(hint);

    var clock = document.getElementById('clock');
    if(clock && clock.nextSibling) st.insertBefore(burger, clock.nextSibling);
    else st.appendChild(burger);

    burger.addEventListener('click', function(){ mask.classList.add('on'); });
    closeBtn.addEventListener('click', function(){ mask.classList.remove('on'); });
    mask.addEventListener('click', function(e){ if(e.target === mask) mask.classList.remove('on'); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') mask.classList.remove('on'); });

    console.log('[nav] booted: links=' + links.length + ' tools=' + tools.length);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
