(function(){
  'use strict';

  var META=[
    {n:1,name:'源石尘',alias:'起始之屑',page:'index.html',pn:'首页',href:'../index.html',r:'一切的起点，也是终点的入口。',d:'从罗德岛甲板缝里扫出来的第一批源石尘。编号 001，没有归档人。'},
    {n:2,name:'战术演习记录',alias:'大地之屑',page:'prts.html',pn:'档案室',href:'prts.html',r:'先有这片大地，才有后续所有故事。',d:'战术演习结束后留下的记录页，边角只有一句手写：活着回来。'},
    {n:3,name:'守夜人火把灰',alias:'守夜之屑',page:'守夜人论坛.html',pn:'守夜人论坛',href:'守夜人论坛.html',r:'守夜的人，总在深夜交换消息。',d:'火把熄灭后落下的灰。守夜人把它扫进信封，没有寄出。'},
    {n:4,name:'言灵残页',alias:'学院之屑',page:'卡塞尔学院官网.html',pn:'卡塞尔学院',href:'卡塞尔学院官网.html',r:'一所学院，只录取「能看见」的人。',d:'一页言灵残页。字迹的位置会变，但每句话都还认得你。'},
    {n:5,name:'干员工牌',alias:'街机之屑',page:'游戏-08.html',pn:'街机 08',href:'../games/游戏-08.html',r:'最旧的街机，第八号。',d:'街机厅员工的旧工牌，照片上被人用马克笔画了胡子。'},
    {n:6,name:'龙门通行证',alias:'指挥之屑',page:'终端接口.html',pn:'终端接口',href:'终端接口.html',r:'指挥官的第一台终端。',d:'龙门通行证。有效期一栏写着：直到你不需要它为止。'},
    {n:7,name:'机密终端密钥卡',alias:'密语之屑',page:'机密终端.html',pn:'机密终端',href:'机密终端.html',r:'这里说的每句话，都不该被第三个人听见。',d:'机密终端的密钥卡。背面一行小字：忘了就跑 gen_keys.py。'},
    {n:8,name:'2048 方块',alias:'解码之屑',page:'解码器.html',pn:'解码器',href:'解码器.html',r:'数字碎了一地，等你去拼。',d:'2048 里的一个方块。它一直想变成 4096，没成功。'},
    {n:9,name:'小恐龙的鳞片',alias:'恐龙之屑',page:'游戏-01.html',pn:'游戏 01',href:'../games/游戏-01.html',r:'第一只恐龙，还在横版里跑。',d:'小恐龙跳过一整天后留下的鳞片。它没撞到任何东西。'},
    {n:10,name:'贪吃蛇的尾尖',alias:'方格之屑',page:'游戏-02.html',pn:'游戏 02',href:'../games/游戏-02.html',r:'格子合到 2048，它就出现。',d:'贪吃蛇的尾尖。它咬到自己之后，学会了穿墙。'},
    {n:11,name:'诺玛的日志',alias:'迷名之屑',page:'游戏-03.html',pn:'游戏 03',href:'../games/游戏-03.html',r:'有人在问路明非是谁。',d:'诺玛的日志残页：今天又有人问我路明非是谁。'},
    {n:12,name:'学院徽章',alias:'血统之屑',page:'游戏-04.html',pn:'游戏 04',href:'../games/游戏-04.html',r:'S 级的编号，被刮掉了。',d:'学院徽章。背面 S 级血统的编号被人刮掉了。'},
    {n:13,name:'血统契副本',alias:'契约之屑',page:'游戏-05.html',pn:'游戏 05',href:'../games/游戏-05.html',r:'签名处是空的——你还没签。',d:'血统契的副本，签名处还是空的。你还没签。'},
    {n:14,name:'莱茵生命试剂',alias:'摇晃之屑',page:'莱茵生命终端.html',pn:'莱茵生命终端',href:'莱茵生命终端.html',r:'标签写着请勿摇晃，它被摇过。',d:'莱茵生命的试剂瓶。标签写着请勿摇晃，瓶身有被摇过的痕迹。'},
    {n:15,name:'技能树枯枝',alias:'分支之屑',page:'技能树.html',pn:'技能树',href:'技能树.html',r:'一条点亮过的分支。',d:'技能树上折下的一截枯枝。它曾经是一条点亮的分支。'},
    {n:16,name:'模组源码',alias:'模组之屑',page:'模组开发.html',pn:'模组开发',href:'模组开发.html',r:'注释里写着「这里应该能跑」。',d:'一段模组源码。注释写着这里应该能跑，但它不能。'},
    {n:17,name:'泰拉编年史扉页',alias:'泰拉之屑',page:'PRTS泰拉大典终端.html',pn:'泰拉大典',href:'PRTS泰拉大典终端.html',r:'第一页只有一句：泰拉没有真相。',d:'泰拉编年史的扉页。第一页只有一句：泰拉没有真相。'},
    {n:18,name:'罗德岛通讯残页',alias:'停电之屑',page:'changelog.html',pn:'更新日志',href:'changelog.html',r:'播报员念到一半停了电。',d:'罗德岛通讯残页。播报员念到一半，电停了。'},
    {n:19,name:'访客墙的签名',alias:'涂名之屑',page:'guestwall.html',pn:'访客墙',href:'guestwall.html',r:'某个名字被涂掉了，笔画还在。',d:'访客墙上的签名。某个名字被涂掉，笔画还留在下面。'},
    {n:20,name:'枫叶书签',alias:'迷路之屑',page:'404.html',pn:'404',href:'../404.html',r:'你迷路时，它也迷路了。',d:'一枚枫叶书签，夹在一本没人借过的书里。'},
    {n:21,name:'极光碎片',alias:'借光之屑',page:'游戏-06.html',pn:'游戏 06',href:'../games/游戏-06.html',r:'它不发光，只是把光借给你。',d:'极光碎片。它不发光，只是把光借给了你。'},
    {n:22,name:'系统根权限',alias:'愣神之屑',page:'游戏-07.html',pn:'游戏 07',href:'../games/游戏-07.html',r:'拿到它的人会先愣一会儿。',d:'系统根权限。拿到它的人，都会先愣一会儿。'}
  ];

  var LS='wz_frag2';
  var state={local:[],server:[],items:{},filter:'all',cloud:false,tf:null,tfAt:0,tfErr:false};
  var grid=document.getElementById('fgGrid');
  if(!grid)return;

  function $(id){return document.getElementById(id)}
  function pad(n){return(n<10?'0':'')+n}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function read(){
    try{var a=JSON.parse(localStorage.getItem(LS)||'[]');if(!Array.isArray(a))return[];var out=[],seen={};for(var i=0;i<a.length;i++){var x=a[i],n=typeof x==='object'&&x?x.n:x;n=parseInt(n,10);if(n>=1&&n<=22&&!seen[n]){seen[n]=1;out.push({n:n,t:(typeof x==='object'&&x&&x.t)?String(x.t):''})}}return out.sort(function(a,b){return a.n-b.n})}catch(e){return[]}
  }
  function write(a){try{localStorage.setItem(LS,JSON.stringify(a))}catch(e){}}
  function localMap(){var m={};state.local.forEach(function(x){m[x.n]=x.t||''});return m}
  function serverSet(){var o={};state.server.forEach(function(n){o[n]=1});return o}
  function gotSet(){var o=serverSet();state.local.forEach(function(x){o[x.n]=1});return o}
  function gotNums(){var o=gotSet(),a=[];for(var i=1;i<=22;i++)if(o[i])a.push(i);return a}
  function token(){try{var s=JSON.parse(localStorage.getItem('gb_session')||'null');return(s&&s.token)||''}catch(e){return''}}
  function user(){try{var s=JSON.parse(localStorage.getItem('gb_session')||'null');return(s&&s.username)||''}catch(e){return''}}
  function api(){try{return(window.apiBase&&window.apiBase())||''}catch(e){return''}}
  function call(path,payload){return(window.call?window.call(path,payload||{}):Promise.reject('no-api'))}
  function wait(p,ms){return new Promise(function(res,rej){var done=false,t=setTimeout(function(){done=true;rej('timeout')},ms);p.then(function(x){if(!done){done=true;clearTimeout(t);res(x)}},function(e){if(!done){done=true;clearTimeout(t);rej(e)}})})}
  function toast(a,b){try{if(window.toast)return window.toast(a,b)}catch(e){}}

  function mergeServer(nums,items){
    state.server=(nums||[]).filter(function(n){return n>=1&&n<=22});
    state.items=items||{};
    var lm=localMap(),out=state.local.slice();
    state.server.forEach(function(n){
      if(!lm[n]){out.push({n:n,t:''});lm[n]=''}
    });
    out.sort(function(a,b){return a.n-b.n});
    state.local=out;write(out);
  }

  function shardSVG(n,wire){
    var seed=(n*131+17)%233280;
    function r(){seed=(seed*9301+49297)%233280;return seed/233280}
    var cx=50+(r()*10-5), top=3+r()*12, bot=116+r()*10;
    var lx=10+r()*13, rx=90-r()*13, ly=24+r()*10, ry=60+r()*10;
    var A=[cx,top],B=[rx,ly],C=[rx-(1+r()*8),ry],D=[cx+(r()*8-4),bot],E=[lx+(r()*8),ry],F=[lx,ly];
    function p(a){return a[0].toFixed(1)+','+a[1].toFixed(1)}
    var poly=[A,B,C,D,E,F].map(p).join(' ');
    var mid=[cx+(r()*12-6),74+(r()*10)];
    var inner='M '+A[0].toFixed(1)+' '+A[1].toFixed(1)+' L '+mid[0].toFixed(1)+' '+mid[1].toFixed(1)+' L '+D[0].toFixed(1)+' '+D[1].toFixed(1)+' M '+F[0].toFixed(1)+' '+F[1].toFixed(1)+' L '+mid[0].toFixed(1)+' '+mid[1].toFixed(1)+' L '+B[0].toFixed(1)+' '+B[1].toFixed(1)+' M '+E[0].toFixed(1)+' '+E[1].toFixed(1)+' L '+mid[0].toFixed(1)+' '+mid[1].toFixed(1)+' L '+C[0].toFixed(1)+' '+C[1].toFixed(1);
    return '<svg class="fg-shard-svg'+(wire?' wire':'')+'" viewBox="0 0 100 128" aria-hidden="true"><polygon points="'+poly+'" fill="none" stroke="currentColor" stroke-width="1.4" vector-effect="non-scaling-stroke"/><path d="'+inner+'" fill="none" stroke="currentColor" stroke-width=".7" opacity=".55" vector-effect="non-scaling-stroke"/><circle cx="'+mid[0].toFixed(1)+'" cy="'+mid[1].toFixed(1)+'" r="2.2" fill="currentColor" opacity=".9"/></svg>';
  }

  function renderStat(){
    var got=gotNums(),have=got.length;
    var g=$('fgGot'),b=$('fgBar'),m=$('fgMeta'),sync=$('fgSync'),net=$('fgNet');
    if(g)g.textContent=pad(have);
    if(b)b.style.width=(have/22*100).toFixed(1)+'%';
    var t=token();
    if(!t){
      if(net)net.textContent='LOCAL ARCHIVE';
      if(m)m.innerHTML='本地存档 · 登录后可跨设备同步 · <a href="../社区.html">去登录</a>';
      if(sync)sync.style.display='none';
    }else if(state.cloud){
      if(net)net.textContent='CLOUD LINK';
      if(m)m.innerHTML='云端同步 · '+(user()?esc(user()):'已登录')+' · 已归档 '+state.server.length+' 枚';
      var missing=state.local.filter(function(x){return state.server.indexOf(x.n)<0});
      if(sync){sync.style.display=missing.length?'inline-flex':'none';sync.textContent='同步 '+missing.length+' 枚到云端'}
    }else{
      if(net)net.textContent='LOCAL ARCHIVE';
      if(m)m.textContent='云端未连接 · 当前使用本地存档';
      if(sync)sync.style.display='none';
    }
  }

  function card(n){
    var m=META[n-1],got=gotSet()[n],lm=localMap(),item=state.items[n]||{};
    var name=item.t||m.name,alias=m.alias,date=lm[n]||'';
    var body=got?(item.d||m.d):m.r;
    return '<article class="fg-card '+(got?'got':'locked')+'" data-n="'+n+'" tabindex="0" role="button" aria-label="'+(got?'查看碎片 '+name:'碎片 '+pad(n)+' 未解锁')+'">'+
      '<div class="fg-ct"><span>#'+pad(n)+'</span><span>'+(got?'COLLECTED':'LOCKED')+'</span></div>'+
      '<div class="fg-shard">'+shardSVG(n,!got)+'</div>'+
      '<div class="fg-cbody"><h3>'+(got?esc(name):'未解锁')+'</h3><em>'+(got?esc(alias):'谜语')+'</em><p>'+esc(body)+'</p></div>'+
      '<div class="fg-cf"><span>'+esc(m.pn)+'</span><span>'+(got?(date||'已归档'):'待发现')+'</span></div></article>';
  }

  function renderGrid(){
    var all=gotNums(),have=all.length,filter=state.filter;
    var list=META.filter(function(m){var got=gotSet()[m.n];if(filter==='got')return got;if(filter==='miss')return !got;return true});
    grid.innerHTML=list.length?list.map(function(m){return card(m.n)}).join(''):'<div class="fg-empty">没有符合条件的碎片。</div>';
    var ca=$('fgCAll'),cg=$('fgCGot'),cm=$('fgCMiss');
    if(ca)ca.textContent=22;if(cg)cg.textContent=have;if(cm)cm.textContent=22-have;
    renderStat();
  }

  function openDetail(n){
    var m=META[n-1],got=gotSet()[n],lm=localMap(),item=state.items[n]||{};
    var modal=$('fgModal');if(!modal)return;
    var date=lm[n]||'';
    var title=got?(item.t||m.name):'未解锁';
    var body=got?(item.d||m.d):m.r;
    modal.innerHTML='<div class="fg-mask" data-close="1"></div><div class="fg-panel" role="dialog" aria-modal="true" aria-label="碎片档案">'+
      '<button class="fg-close" type="button" data-close="1" aria-label="关闭">关闭</button>'+
      '<div class="fg-mart"><span class="fg-mno">#'+pad(n)+'</span>'+shardSVG(n,!got)+'<span class="fg-mtag">'+(got?'ARCHIVED':'SEALED')+'</span></div>'+
      '<div class="fg-mbody"><div class="fg-mkick">WORLD FRAGMENT / '+pad(n)+'</div>'+
      '<h2>'+esc(title)+'</h2><em>'+esc(m.alias)+'</em>'+
      '<div class="fg-mline"></div>'+
      '<p class="fg-mtext">'+esc(body)+'</p>'+
      '<div class="fg-meta"><span>来源 <b>'+esc(m.pn)+'</b></span><span>状态 <b>'+(got?'已收集':'未发现')+'</b></span><span>归档 <b>'+(got?(date||'云端记录'):'——')+'</b></span></div>'+
      '<a class="fg-go" href="'+m.href+'">前往来源页 <span>→</span></a></div></div>';
    modal.classList.add('on');document.body.classList.add('fg-lock');
    var close=modal.querySelector('.fg-close');if(close)close.focus();
  }

  function closeDetail(){
    var modal=$('fgModal');if(!modal)return;modal.classList.remove('on');document.body.classList.remove('fg-lock');
  }

  function renderTime(){
    var box=$('fgTime');if(!box)return;
    var tf=state.tf;
    if(state.tfErr){box.innerHTML='<div class="fg-time-k"><span>TEMPORAL FRAGMENT</span><span class="fg-dot bad"></span></div><div class="fg-time-main"><div class="fg-count">--:--</div><div class="fg-time-tx"><b>云端未连接</b><p>时间碎片由服务器时钟判定，连接后显示本场与下一场。</p></div></div>';return}
    if(!tf){box.innerHTML='<div class="fg-time-k"><span>TEMPORAL FRAGMENT</span><span class="fg-dot"></span></div><div class="fg-time-main"><div class="fg-count">--:--</div><div class="fg-time-tx"><b>正在读取时间</b><p>每天随机 4 场，每场 30 分钟。</p></div></div>';return}
    var el=Math.max(0,(Date.now()-state.tfAt)/1000);
    var sec=tf.open?Math.max(0,tf.left-el):Math.max(0,tf.next-el);
    var page=tf.page||'';
    var m=META.filter(function(x){return x.page===page})[0];
    var pn=m?m.pn:(page?page.replace('.html',''):'未知页面');
    var href=m?m.href:'../index.html';
    var label=tf.open?'本场正在出现':'下一场';
    var stateText=tf.open?(tf.caught_today?'本场已收':'可前往收集'):'等待出现';
    box.innerHTML='<div class="fg-time-k"><span>TEMPORAL FRAGMENT</span><span class="fg-dot '+(tf.open?'on':'')+'"></span></div>'+
      '<div class="fg-time-main"><div class="fg-count">'+fmt(sec)+'</div><div class="fg-time-tx">'+
      '<b>'+label+' · '+esc(stateText)+'</b><p>出现页面 <a href="'+href+'">'+esc(pn)+'</a>　已收 '+Number(tf.count||0)+' 枚</p>'+
      '<small>'+(tf.open?'到那一页找一枚颤动的小圆点，点它收下。':'到点后左下角会出现提示；收下一枚 +15 积分 / +12 经验。')+'</small></div></div>';
  }

  function fmt(sec){
    sec=Math.max(0,Math.floor(sec));var h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;
    return (h?h+':'+pad(m):pad(m))+':'+pad(s);
  }

  function loadTime(){
    if(!api()){state.tfErr=true;renderTime();return}
    wait(call('/tfrag',{}),9000).then(function(j){
      if(!j||!j.ok)throw 0;
      state.tf=j;state.tfAt=Date.now();state.tfErr=false;renderTime();
    }).catch(function(){state.tfErr=true;renderTime()});
  }

  function loadServer(){
    if(!api()||!token()){renderGrid();return}
    wait(call('/frags',{}),9000).then(function(j){
      if(!j||!j.ok)throw 0;
      var items={};(j.items||[]).forEach(function(x){items[x.n]=x});
      mergeServer(j.mine||[],items);state.cloud=true;renderGrid();
    }).catch(function(){state.cloud=false;renderStat()});
  }

  function syncLocal(){
    var btn=$('fgSync');if(!btn)return;
    var missing=state.local.filter(function(x){return state.server.indexOf(x.n)<0});
    if(!missing.length)return;
    btn.disabled=true;var old=btn.textContent;btn.textContent='同步中…';
    var i=0;
    function next(){
      if(i>=missing.length){
        btn.disabled=false;btn.textContent=old;toast('同步完成','云端已记录 '+missing.length+' 枚碎片');loadServer();return
      }
      call('/frag_get',{n:missing[i++].n}).then(next).catch(function(){btn.disabled=false;btn.textContent=old;toast('同步中断','检查登录状态或云端连接')});
    }
    next();
  }

  function bind(){
    document.querySelectorAll('.fg-tab').forEach(function(b){
      b.addEventListener('click',function(){state.filter=b.getAttribute('data-f')||'all';document.querySelectorAll('.fg-tab').forEach(function(x){x.classList.toggle('on',x===b)});renderGrid()})
    });
    grid.addEventListener('click',function(e){var c=e.target.closest('.fg-card');if(c)openDetail(Number(c.getAttribute('data-n')))});
    grid.addEventListener('keydown',function(e){var c=e.target.closest('.fg-card');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openDetail(Number(c.getAttribute('data-n')))}}
    );
    var modal=$('fgModal');
    if(modal)modal.addEventListener('click',function(e){if(e.target.closest('[data-close]'))closeDetail()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDetail()});
    var sync=$('fgSync');if(sync)sync.addEventListener('click',syncLocal);
  }

  state.local=read();
  bind();
  renderGrid();
  loadServer();
  loadTime();
  setInterval(renderTime,1000);
  setTimeout(loadTime,60000);
})();
