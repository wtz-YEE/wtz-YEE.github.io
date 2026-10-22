/* ===== 全站通用登录条 + 折叠导航面板 + 登录功能（shared-nav.js） =====
   任意页面引入即生效（页面需存在 <header id="status">）。
   - 顶栏：站点名 + 时钟 + 「☰ 菜单」+ 「登录/用户名」按钮 + 状态徽章（LV/私聊/通知）
   - 折叠面板：登录区（登录/注册/退出）+ 导航链接 + 工具按钮
   - 登录走主站云端 API（/login /register /logout），地址存 localStorage['gb_api_url']，
     会话存 localStorage['gb_session']（与 index-core 共用同一存储，主站登录态互通）。
*/
(function(){
  var K_API = 'gb_api_url', K_SESS = 'gb_session';

  function LGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function LSet(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  function LDel(k){ try{ localStorage.removeItem(k); }catch(e){} }
  function navApi(){
    var v = String(LGet(K_API) || '').trim().replace(/\/+$/, '');
    return /^https?:\/\//i.test(v) ? v : '';
  }
  function navUser(){
    try{ var s = JSON.parse(LGet(K_SESS) || 'null'); if(s && s.token && s.username) return s; }catch(e){}
    return null;
  }
  function navSetUser(u){
    if(u){ LSet(K_SESS, JSON.stringify(u)); if(window.S) window.S.user = u; }
    else { LDel(K_SESS); if(window.S) window.S.user = null; }
  }
  function navCall(path, payload){
    var base = navApi();
    if(!base) return Promise.resolve({ ok:false, msg:'云端地址未配置' });
    var body = Object.assign({}, payload || {});
    var u = navUser();
    if(u && u.token && !body.token) body.token = u.token;
    return fetch(base + path, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      .then(function(r){ return r.json().catch(function(){ return { ok:false, msg:'响应解析失败' }; }); })
      .catch(function(){ return { ok:false, msg:'网络错误（云端不可达）' }; });
  }
  function toast(msg, ok){
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:50%;top:56px;transform:translateX(-50%);z-index:300;background:var(--panel2,#121212);border:1px solid ' + (ok ? 'var(--ok,#5CE08A)' : 'var(--bad,#FF5C7A)') + ';color:var(--ink,#eee);font-family:var(--mono,monospace);font-size:12px;letter-spacing:.08em;padding:9px 18px;transition:.5s;opacity:0;white-space:nowrap';
    d.textContent = msg;
    document.body.appendChild(d);
    requestAnimationFrame(function(){ d.style.opacity = '1'; });
    setTimeout(function(){ d.style.opacity = '0'; setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 500); }, 2200);
  }

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
.nav-login{background:none;border:1px solid var(--accent,#fff);color:var(--accent,#fff);margin-left:10px;cursor:pointer;display:inline-block;padding:5px 12px;min-height:30px;border-radius:2px;font-family:var(--mono,monospace);font-size:12px;letter-spacing:.08em;white-space:nowrap}\
.nav-login:hover{background:rgba(255,255,255,.08)}\
.nav-login.on{border-style:dashed}\
.nav-mask{position:fixed;inset:0;z-index:160;background:rgba(0,0,0,.55);display:none;justify-content:flex-end}\
.nav-mask.on{display:flex}\
.nav-panel{width:min(340px,86vw);height:100%;background:var(--panel2,#101010);border-left:1px solid var(--line2,#333);padding:16px 18px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;box-sizing:border-box}\
.np-head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line2,#333);padding-bottom:10px;font-family:var(--mono,monospace);letter-spacing:.14em;color:var(--accent2,#bbb);font-size:12px}\
.np-head button{font-family:inherit;background:none;border:1px solid var(--line2,#444);color:var(--ink,#eee);cursor:pointer;padding:3px 10px;font-size:11px;min-height:28px}\
.np-head button:hover{border-color:var(--accent,#fff);color:var(--accent,#fff)}\
.np-login{border:1px solid var(--line2,#444);padding:12px;display:flex;flex-direction:column;gap:8px}\
.np-login h4{margin:0;font-size:12px;color:var(--accent2,#bbb);letter-spacing:.1em;font-family:var(--mono,monospace);font-weight:400}\
.np-login input{background:var(--panel,#181818);border:1px solid var(--line2,#444);color:var(--ink,#eee);font:inherit;font-size:13px;padding:8px 10px;min-height:40px;width:100%;box-sizing:border-box}\
.np-login input:focus{outline:none;border-color:var(--accent,#fff)}\
.np-login .nr{display:flex;gap:8px}\
.np-login .nr button{flex:1;background:none;border:1px solid var(--line2,#555);color:var(--ink,#eee);cursor:pointer;padding:8px 0;font-size:12px;font-family:var(--mono,monospace);min-height:40px}\
.np-login .nr button.primary{border-color:var(--accent,#fff);color:var(--accent,#fff)}\
.np-login .nr button:hover{border-color:var(--accent,#fff);color:var(--accent,#fff)}\
.np-login .nl-hint{font-size:11px;color:var(--ink3,#888);font-family:var(--mono,monospace);letter-spacing:.04em;line-height:1.6}\
.np-login .nl-user{display:flex;align-items:center;justify-content:space-between;gap:8px}\
.np-login .nl-user b{color:var(--accent,#fff);font-size:13px;font-family:var(--mono,monospace)}\
.np-login .nl-user span{color:var(--ink2,#aaa);font-size:11px;font-family:var(--mono,monospace)}\
.np-login .nl-user button{background:none;border:1px solid var(--bad,#FF5C7A);color:var(--bad,#FF5C7A);cursor:pointer;padding:5px 12px;font-size:11px;font-family:var(--mono,monospace);min-height:34px}\
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

    /* 顶栏登录按钮 */
    var loginBtn = document.createElement('button');
    loginBtn.type = 'button';
    loginBtn.id = 'navLoginBtn';
    loginBtn.className = 'nav-login';
    loginBtn.setAttribute('title', '登录 / 账号');

    /* 汉堡 */
    var burger = document.createElement('button');
    burger.type = 'button';
    burger.id = 'navBurger';
    burger.className = 'nav-burger';
    burger.setAttribute('aria-label', '导航菜单');
    burger.innerHTML = '<span class="nb-i"><i></i><i></i><i></i></span><b>菜单</b>';

    /* 面板 */
    var mask = document.createElement('div');
    mask.id = 'navMask';
    mask.className = 'nav-mask';
    var panel = document.createElement('div');
    panel.id = 'navPanel';
    panel.className = 'nav-panel';
    mask.appendChild(panel);
    document.body.appendChild(mask);

    var head = document.createElement('div');
    head.className = 'np-head';
    head.textContent = 'NAV // 全站通用登录条';
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '\u2715 关闭';
    head.appendChild(closeBtn);
    panel.appendChild(head);

    /* 登录区 */
    var loginBox = document.createElement('div');
    loginBox.className = 'np-login';
    loginBox.id = 'npLogin';
    panel.appendChild(loginBox);

    /* 导航链接 */
    var links = [];
    var nav = st.querySelector('.st-nav');
    if(nav){
      var as = nav.querySelectorAll('a');
      for(var i = 0; i < as.length; i++) links.push({ t: as[i].textContent, h: as[i].getAttribute('href') });
      nav.style.display = 'none';
    }
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

    /* 工具按钮 */
    var tools = [];
    ['bgmBtn','srchBtn','thBtn','uiBtn','vmBtn'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) tools.push(el);
    });
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

    /* 插入顶栏：汉堡 + 登录按钮（时钟后） */
    var clock = document.getElementById('clock');
    var after = (clock && clock.nextSibling) ? clock.nextSibling : null;
    st.insertBefore(burger, after);
    st.insertBefore(loginBtn, after);

    /* ---- 登录区渲染 ---- */
    function renderLogin(){
      var u = navUser();
      if(u){
        loginBtn.textContent = u.username.slice(0, 8);
        loginBtn.classList.add('on');
        loginBtn.title = u.username + (u.is_admin ? ' · 管理员' : '') + ' — 点击打开账号面板';
        loginBox.innerHTML = '<h4>账号 // ' + (u.is_admin ? '管理员' : '访客') + '</h4>' +
          '<div class="nl-user"><b>' + u.username + '</b><span>LV ' + (u.pts || 0) + ' pt</span></div>' +
          '<button type="button" id="npLogoutBtn">退出登录</button>';
        var lo = document.getElementById('npLogoutBtn');
        if(lo) lo.addEventListener('click', function(){
          navCall('/logout', { token: u.token }).then(function(){ navSetUser(null); toast('已退出登录', true); renderLogin(); });
        });
      } else {
        loginBtn.textContent = '登录';
        loginBtn.classList.remove('on');
        loginBtn.title = '登录 / 注册 — 全站通用';
        var base = navApi();
        var addrBox = base ? '' :
          '<input type="text" id="npApi" placeholder="云端地址，如 https://xxx.cpolar.top" value="">' +
          '<div class="nl-hint">本地环境可先访问主站一次（自动写入地址），或手动填入云端 API 地址并保存。</div>' +
          '<button type="button" id="npApiSave" style="border:1px solid var(--line2,#555);background:none;color:var(--ink,#eee);cursor:pointer;padding:6px 0;font-size:12px;min-height:36px">保存地址</button>';
        loginBox.innerHTML = '<h4>登录 // 全站通用</h4>' + addrBox +
          '<input type="text" id="npUser" placeholder="用户名" autocomplete="username">' +
          '<input type="password" id="npPass" placeholder="密码" autocomplete="current-password">' +
          '<div class="nr"><button type="button" id="npLoginGo" class="primary">登录</button><button type="button" id="npRegGo">注册</button></div>' +
          '<div class="nl-hint" id="npLoginHint">登录状态全站同步（留言墙/签到/私聊）。</div>';
        if(!base){
          var saveBtn = document.getElementById('npApiSave');
          if(saveBtn) saveBtn.addEventListener('click', function(){
            var v = (document.getElementById('npApi').value || '').trim().replace(/\/+$/, '');
            if(!/^https?:\/\//i.test(v)){ toast('地址需以 http(s):// 开头', false); return; }
            LSet(K_API, v);
            toast('云端地址已保存', true);
            renderLogin();
          });
        }
        var go = document.getElementById('npLoginGo');
        if(go) go.addEventListener('click', function(){
          var u2 = (document.getElementById('npUser').value || '').trim();
          var p2 = document.getElementById('npPass').value || '';
          if(!u2 || !p2){ toast('请输入用户名和密码', false); return; }
          go.disabled = true; go.textContent = '登录中…';
          navCall('/login', { username:u2, password:p2 }).then(function(j){
            go.disabled = false; go.textContent = '登录';
            if(j.ok && j.token){
              navSetUser({ username:j.username, is_admin:!!j.is_admin, token:j.token, pts:j.pts || 0, items:j.items || [] });
              toast('欢迎回来，' + j.username, true);
              renderLogin();
            } else {
              toast(j.msg || '登录失败', false);
              var h = document.getElementById('npLoginHint');
              if(h) h.textContent = j.msg || '登录失败';
            }
          });
        });
        var rg = document.getElementById('npRegGo');
        if(rg) rg.addEventListener('click', function(){
          var u2 = (document.getElementById('npUser').value || '').trim();
          var p2 = document.getElementById('npPass').value || '';
          if(!u2 || !p2){ toast('请输入用户名和密码', false); return; }
          rg.disabled = true; rg.textContent = '注册中…';
          navCall('/register', { username:u2, password:p2 }).then(function(j){
            rg.disabled = false; rg.textContent = '注册';
            toast(j.msg || (j.ok ? '注册成功' : '注册失败'), !!j.ok);
            if(j.ok){
              document.getElementById('npLoginHint').textContent = '注册成功，请直接点击上方「登录」。';
            } else {
              document.getElementById('npLoginHint').textContent = j.msg || '注册失败';
            }
          });
        });
      }
    }
    renderLogin();

    /* 顶栏登录按钮 → 打开面板并聚焦登录区 */
    loginBtn.addEventListener('click', function(){
      mask.classList.add('on');
      var box = document.getElementById('npLogin');
      if(box){ try{ box.scrollIntoView({ block:'start' }); }catch(e){} }
    });

    burger.addEventListener('click', function(){ mask.classList.add('on'); });
    closeBtn.addEventListener('click', function(){ mask.classList.remove('on'); });
    mask.addEventListener('click', function(e){ if(e.target === mask) mask.classList.remove('on'); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') mask.classList.remove('on'); });

    console.log('[nav] booted: links=' + links.length + ' tools=' + tools.length + ' user=' + (navUser() ? navUser().username : 'guest'));
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
