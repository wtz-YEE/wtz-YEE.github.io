/* WTZ CONTROL ROOM · 独立管理后台逻辑 */
(function(){
'use strict';

var K_API='gb_api_url',K_SESS='gb_session';
var S={api:'',apis:[],user:null,view:'',users:[],root:false,stats:null,toastT:null,clockT:null,
       ctab:'guests',cdata:{},openPost:null};

function $(id){return document.getElementById(id)}
function esc(s){
  return String(s==null?'':s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function ferr(msg){
  msg=String(msg||'');
  if(/Failed to fetch|NetworkError|fetch failed|ERR_/i.test(msg)) return '网络连接失败，检查云端是否在线';
  if(/401|403/.test(msg)) return '没有权限或登录已失效';
  if(/429/.test(msg)) return '操作太频繁，稍后再试';
  if(/5\d\d/.test(msg)) return '服务器异常，稍后再试';
  if(/NO_API/i.test(msg)) return '未找到云端地址，请先打开社区页';
  return msg;
}
function toast(msg,bad){
  var el=$('toast');
  if(!el) return;
  el.textContent=msg;
  el.className='toast on'+(bad?' bad':'');
  clearTimeout(S.toastT);
  S.toastT=setTimeout(function(){el.className='toast'+(bad?' bad':'')},2600);
}
function gateMsg(msg,ok){
  var el=$('gateMsg'); if(!el) return;
  el.textContent=msg||'';
  el.className='gate-msg'+(ok?' ok':'');
}
function apiHost(){
  return S.api?S.api.replace(/^https?:\/\//,'').replace(/\/+$/,''):'NO CLOUD LINK';
}
function normalize(v){
  v=String(v||'').trim().replace(/\/+$/,'');
  return /^https?:\/\//i.test(v)?v:'';
}
function parseApis(raw){
  var out=[];
  String(raw||'').replace(/^\uFEFF/,'').split(/[\n,;]+/).forEach(function(x){
    var v=normalize(x);
    if(v&&out.indexOf(v)<0) out.push(v);
  });
  return out.filter(function(x){return !/36c3116e|74312bf6|751e3fda/.test(x)});
}
function localApis(){
  try{return parseApis(localStorage.getItem(K_API))}catch(e){return[]}
}
function readSess(){
  try{var s=JSON.parse(localStorage.getItem(K_SESS)||'null');return (s&&s.token)?s:null}catch(e){return null}
}
function storeSess(u){
  try{localStorage.setItem(K_SESS,JSON.stringify(u))}catch(e){}
}
function fetchT(url,opt,ms){
  var c=new AbortController(),t=setTimeout(function(){c.abort()},ms||20000);
  var o=Object.assign({},opt||{}, {signal:c.signal});
  return fetch(url,o).then(function(r){clearTimeout(t);return r},function(e){clearTimeout(t);throw e});
}
function probeApi(api){
  return fetchT(api+'/health',{cache:'no-store'},4500).then(function(r){return r.ok?api:null}).catch(function(){return null});
}
function chooseApis(list){
  S.apis=list;
  return Promise.all(list.map(probeApi)).then(function(rs){
    var alive=rs.filter(Boolean);
    S.api=alive[0]||list[0];
    return true;
  });
}
function initApi(){
  var a=localApis();
  if(a.length) return chooseApis(a);
  var urls=[
    'https://wtz-YEE.github.io/cloud.txt?t='+Date.now(),
    'https://fastly.jsdelivr.net/gh/wtz-YEE/wtz-YEE.github.io@latest/cloud.txt?t='+Date.now()
  ];
  function next(i){
    if(i>=urls.length) return Promise.resolve(false);
    return fetchT(urls[i],{cache:'no-store'},8000).then(function(r){
      if(!r.ok) throw 0;
      return r.text();
    }).then(function(t){
      var ap=parseApis(t);
      if(ap.length) return chooseApis(ap);
      return next(i+1);
    }).catch(function(){return next(i+1)});
  }
  return next(0);
}
function call(path,payload,method){
  if(!S.api) return Promise.reject(new Error('NO_API'));
  var body=Object.assign({token:S.user?S.user.token:''},payload||{});
  var cands=[S.api].concat((S.apis||[]).filter(function(x){return x!==S.api}));
  var last=null;
  function attempt(i){
    if(i>=cands.length) return Promise.reject(last||new Error('network'));
    var api=cands[i].replace(/\/+$/,'');
    var m=method||'POST';
    var opt={method:m,cache:'no-store',headers:{'Content-Type':'application/json'}};
    if(m!=='GET') opt.body=JSON.stringify(body);
    return fetchT(api+path,opt,20000).then(function(res){
      if(!res.ok) throw new Error('HTTP '+res.status);
      return res.json();
    }).then(function(j){
      S.api=api;
      return j;
    }).catch(function(e){
      last=e;return attempt(i+1);
    });
  }
  return attempt(0);
}

/* ---------- 登录 ---------- */
function doLogin(e){
  if(e) e.preventDefault();
  var u=$('lgUser').value.trim(),p=$('lgPwd').value;
  if(!u||!p){gateMsg('账号和密码都要填');return}
  var btn=$('lgForm').querySelector('button');
  btn.disabled=true;btn.querySelector('span').textContent='VERIFYING…';gateMsg('');
  call('/login',{username:u,password:p}).then(function(j){
    btn.disabled=false;btn.querySelector('span').textContent='VERIFY IDENTITY';
    if(!j||!j.ok){gateMsg(j&&j.msg||'登录失败');return}
    if(!j.is_admin){gateMsg('该账号不是管理员，拒绝进入');return}
    S.user={username:j.username,is_admin:true,token:j.token};
    storeSess({username:j.username,is_admin:true,token:j.token,pts:j.pts||0,items:j.items||[],title:j.title||'',frame:j.frame||''});
    $('lgPwd').value='';
    enter();
  }).catch(function(err){
    btn.disabled=false;btn.querySelector('span').textContent='VERIFY IDENTITY';
    gateMsg('验证失败：'+ferr(err.message));
  });
}
function enter(){
  $('gate').classList.add('hide');
  $('app').hidden=false;
  $('operator').textContent=S.user.username.toUpperCase()+' / ADMIN';
  $('apiHost').textContent=apiHost();
  $('apiHost').title=apiHost();
  clock();
  if(S.clockT) clearInterval(S.clockT);
  S.clockT=setInterval(clock,1000);
  S.view='';
  setView('dash');
}
function clock(){
  var d=new Date(),p=function(n){return n<10?'0'+n:n};
  var el=$('clock'); if(el) el.textContent=p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
}

/* ---------- 视图 ---------- */
function setView(v){
  if(!v||v===S.view) return;
  S.view=v;
  var views=document.querySelectorAll('.view');
  for(var i=0;i<views.length;i++) views[i].classList.toggle('on',views[i].id==='v-'+v);
  var navs=document.querySelectorAll('.nav button');
  for(var j=0;j<navs.length;j++) navs[j].classList.toggle('on',navs[j].getAttribute('data-v')===v);
  if(v==='dash') loadDash();
  if(v==='users') loadUsers();
  if(v==='audit') loadAudit();
  if(v==='risk') loadRisk();
  if(v==='punish') loadPunish();
  if(v==='content') loadContentAll();
  if(v==='notice') loadNotices();
  if(v==='changelog') loadChangelog();
}

/* ---------- 概览 ---------- */
function loadDash(){
  var cards=$('statCards'); if(!cards) return;
  cards.innerHTML='<div class="empty">SYNCING TELEMETRY…</div>';
  call('/stats2',{}).then(function(j){
    if(!j||!j.ok){cards.innerHTML='<div class="empty">数据加载失败 · 无权限或服务器异常</div>';return}
    S.stats=j;renderCards(j);
    renderChart(j);
    renderHours(j);
    renderRanks(j);
  }).catch(function(e){
    cards.innerHTML='<div class="empty">数据加载失败 · '+esc(ferr(e.message))+'</div>';
  });
}
function renderCards(j){
  var t=j.total||{};
  var defs=[
    ['USERS',t.users||0],['MESSAGES',t.guests||0],['POSTS',t.posts||0],['COMMENTS',t.comments||0],
    ['LIKES',t.likes||0],['PM',t.pms||0],['VISITS',t.visits||0],['ONLINE',j.online||0]
  ];
  var mx=1;defs.forEach(function(d){mx=Math.max(mx,d[1])});
  var h=defs.map(function(d){
    return '<div class="stat"><b>'+d[1]+'</b><span>'+d[0]+'</span><i style="--w:'+Math.round(d[1]/mx*100)+'%"></i></div>';
  }).join('');
  h+='<div class="today-strip" style="grid-column:1/-1;border:1px solid var(--line);padding:10px 14px;font-family:var(--mono);font-size:9.5px;letter-spacing:.12em;color:var(--ink3);margin-top:2px">TODAY · 留言 <b style="color:var(--acc)">'+(t.todayG||0)+'</b> · 注册 <b style="color:var(--acc)">'+(t.todayR||0)+'</b> · 帖子 <b style="color:var(--acc)">'+(t.todayP||0)+'</b> · 累计访问 <b style="color:var(--acc)">'+(t.visits||0)+'</b></div>';
  $('statCards').innerHTML=h;
}
function chart2(m,r,labels,W,H){
  m=m||[];r=r||[];labels=labels||[];
  if(!m.length&&!r.length) return '<div class="empty">暂无数据</div>';
  var all=m.concat(r,[1]),mx=Math.max.apply(null,all),n=Math.max(m.length,r.length,1),st=W/Math.max(1,n-1);
  function pts(vals){
    var p=[];
    for(var i=0;i<vals.length;i++) p.push((4+i*st).toFixed(1)+','+(H-12-((vals[i]||0)/mx)*(H-26)).toFixed(1));
    return p.join(' ');
  }
  var g='';for(var k=1;k<=4;k++){var y=(H-12-(k/4)*(H-26)).toFixed(1);g+='<line x1="0" y1="'+y+'" x2="'+W+'" y2="'+y+'" stroke="#232320"/>'}
  var labs=labels.map(function(lb,ii){return '<text x="'+(4+ii*st-8).toFixed(0)+'" y="'+(H-2)+'">'+esc(String(lb).slice(5))+'</text>'}).join('');
  return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none">'+g+
    '<polyline points="'+pts(m)+'" fill="none" stroke="#FFF100" stroke-width="1.6"/>'+
    '<polyline points="'+pts(r)+'" fill="none" stroke="#77776F" stroke-width="1.2" stroke-dasharray="4 3"/>'+
    '<g font-family="monospace" font-size="7" fill="#5E5E58">'+labs+'</g></svg>';
}
function renderChart(j){
  var w=$('chart7'); if(!w) return;
  w.innerHTML='<div style="font-family:var(--mono);font-size:8px;letter-spacing:.14em;color:var(--ink3);margin-bottom:5px"><span style="color:var(--acc)">■</span> 留言　<span style="color:#77776F">■</span> 注册</div>'+
    chart2(j.gday,j.rday,j.days,620,160);
}
function renderHours(j){
  var el=$('hours'); if(!el) return;
  var arr=j.hours||[],mx=Math.max.apply(null,arr.concat([1]));
  var h='';for(var i=0;i<24;i++){var v=arr[i]||0,hh=Math.round(v/mx*78);h+='<div title="'+i+' 时 · '+v+' 条"><i style="height:'+Math.max(1,hh)+'px;opacity:'+(hh?.9:.25)+'"></i><span>'+(i%6===0?i:'')+'</span></div>'}
  el.innerHTML=h;
}
function renderRanks(j){
  var tu=j.topUsers||[],tg=j.topGuests||[];
  $('topUsers').innerHTML=tu.length?tu.map(function(x){
    var w=tu[0]&&tu[0].n?Math.round(x.n/tu[0].n*100):0;
    return '<div class="rank-row"><span>'+esc(x.name)+'</span><div class="rank-bar"><i style="width:'+w+'%"></i></div><b>'+x.n+'</b></div>';
  }).join(''):'<div class="empty">暂无数据</div>';
  $('topGuests').innerHTML=tg.length?tg.map(function(x){
    var txt=String(x.text||''),w=tg[0]&&tg[0].likes?Math.min(100,Math.round(x.likes/tg[0].likes*100)):0;
    return '<div class="rank-row"><span title="'+esc(x.user)+'">'+esc(txt.length>18?txt.slice(0,18)+'…':txt)+'</span><div class="rank-bar"><i style="width:'+w+'%"></i></div><b>'+x.likes+'♥</b></div>';
  }).join(''):'<div class="empty">暂无数据</div>';
}

/* ---------- 用户 ---------- */
function loadUsers(){
  var box=$('userTable'); if(!box) return;
  box.innerHTML='<div class="empty">SCANNING USERS…</div>';
  call('/admin_users',{}).then(function(j){
    if(!j||!j.ok){box.innerHTML='<div class="empty">'+esc(j&&j.msg||'无权限')+'</div>';return}
    S.users=j.list||[];S.root=!!j.root;
    if($('operator')) $('operator').textContent=S.user.username.toUpperCase()+(S.root?' / ROOT':' / ADMIN');
    var online=S.users.filter(function(u){return u.online}).length;
    $('userCount').textContent=S.users.length+' USERS · '+online+' ONLINE';
    renderUsers();
  }).catch(function(e){box.innerHTML='<div class="empty">加载失败 · '+esc(ferr(e.message))+'</div>'});
}
function renderUsers(){
  var q=($('userSearch')&&$('userSearch').value||'').trim().toLowerCase();
  var list=S.users.filter(function(u){return !q||String(u.name).toLowerCase().indexOf(q)>=0||String(u.ip||'').indexOf(q)>=0});
  if(!list.length){$('userTable').innerHTML='<div class="empty">没有匹配的用户</div>';return}
  var rows=list.map(function(u){
    var acts='';
    if(S.root&&S.user&&S.user.username!==u.name){
      acts+='<button data-uact="sa" data-name="'+esc(u.name)+'" data-flag="'+(u.is_admin?'1':'0')+'">'+(u.is_admin?'撤销管理':'授予管理')+'</button>';
      acts+='<button data-uact="ban" data-name="'+esc(u.name)+'" data-flag="'+(u.banned?'1':'0')+'" class="'+(u.banned?'':'warn')+'">'+(u.banned?'解除拉黑':'拉黑')+'</button>';
      acts+='<button data-uact="kick" data-name="'+esc(u.name)+'" class="warn">踢下线</button>';
      acts+='<button data-uact="del" data-name="'+esc(u.name)+'" class="bad">删除用户</button>';
    }else if(S.user&&S.user.username!==u.name){
      acts+='<button data-uact="ban" data-name="'+esc(u.name)+'" data-flag="'+(u.banned?'1':'0')+'" class="'+(u.banned?'':'warn')+'">'+(u.banned?'解除拉黑':'拉黑')+'</button>';
    }
    return '<div class="u-row">'+
      '<span class="u-dot'+(u.online?' on':'')+'" title="'+(u.online?'在线':'离线')+'"></span>'+
      '<span class="u-name">'+esc(u.name)+'</span>'+
      '<span class="u-badges">'+
        (u.is_root?'<span class="tag root">ROOT</span>':(u.is_admin?'<span class="tag admin">ADMIN</span>':''))+
        (u.banned?'<span class="tag ban">BANNED</span>':'')+
      '</span>'+
      '<span class="u-meta">'+(u.ip?esc(u.ip)+' · ':'')+'PWD '+esc(u.pwd||'***')+'</span>'+
      '<span class="u-acts">'+acts+'</span>'+
    '</div>';
  }).join('');
  $('userTable').innerHTML=rows;
}
function userAction(btn){
  var act=btn.getAttribute('data-uact'),name=btn.getAttribute('data-name'),flag=btn.getAttribute('data-flag')==='1';
  var conf={
    sa:(flag?'撤销 ':'授予 ')+name+' 管理员权限？',
    ban:(flag?'解除拉黑 ':'拉黑 ')+name+' ？',
    kick:'强制下线 '+name+' 的全部会话？',
    del:'永久删除用户 '+name+' 及其内容？此操作不可恢复。'
  };
  if(!window.confirm(conf[act]||'确认操作？')) return;
  btn.disabled=true;
  var p,path;
  if(act==='sa'){path='/admin_set_admin';p={target:name,admin:!flag}}
  else if(act==='ban'){path='/admin_ban_user';p={target:name,ban:!flag}}
  else if(act==='kick'){path='/admin_del_session';p={user:name}}
  else {path='/admin_del_user';p={target:name}}
  call(path,p).then(function(j){
    btn.disabled=false;
    toast(j&&j.msg||(j&&j.ok?'已执行':'操作失败'),!(j&&j.ok));
    if(j&&j.ok) loadUsers();
  }).catch(function(e){btn.disabled=false;toast('请求失败：'+ferr(e.message),true)});
}

/* ---------- 审计 ---------- */
function loadAudit(){
  var D=$('auditDate'),L=$('auditList'); if(!L) return;
  L.innerHTML='<div class="empty">LOADING LOGS…</div>';
  var date=D?D.value:'';
  call('/audit_get',{date:date}).then(function(j){
    if(!j||!j.ok){L.innerHTML='<div class="empty">无权限或加载失败</div>';return}
    $('auditCount').textContent=(j.total||0)+' RECORDS'+(date?' · '+date:' · TODAY');
    if(D){
      var cur=D.value;
      D.innerHTML='<option value="">今天</option>'+((j.archives||[]).map(function(d){return '<option value="'+esc(d)+'"'+(d===cur?' selected':'')+'>'+esc(d)+'</option>'}).join(''));
      D.value=cur;
    }
    var arr=j.list||[];
    if(!arr.length){L.innerHTML='<div class="empty">暂无操作记录</div>';return}
    L.innerHTML=arr.map(function(x){
      return '<div class="a-row">'+
        '<span class="a-t">'+esc(x.t||'')+'</span>'+
        '<span class="a-who">'+esc(x.who||'')+'</span>'+
        '<span class="a-act"><b>'+esc(x.act||'')+'</b> → '+esc(x.target||'')+'<span>'+esc(x.detail||'')+'</span></span>'+
      '</div>';
    }).join('');
  }).catch(function(e){L.innerHTML='<div class="empty">加载失败 · '+esc(ferr(e.message))+'</div>'});
}
function exportAudit(fmt){
  var date=$('auditDate')?$('auditDate').value:'';
  call('/audit_export',{fmt:fmt,date:date}).then(function(j){
    if(!j||!j.ok){toast('导出失败',true);return}
    var data=fmt==='json'?JSON.stringify(j.data,null,1):j.data;
    var a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([data],{type:'text/plain;charset=utf-8'}));
    a.download='audit_'+(date||'today')+'.'+fmt;
    a.click();
    toast('已导出 '+fmt.toUpperCase());
  }).catch(function(e){toast('导出失败：'+ferr(e.message),true)});
}

/* ---------- 风控 ---------- */
function loadRisk(){
  var box=$('riskWords'); if(!box) return;
  box.innerHTML='<div class="empty">LOADING RULES…</div>';
  call('/risk_words_get',{}).then(function(j){
    if(!j||!j.ok){box.innerHTML='<div class="empty">加载失败</div>';return}
    renderRisk(j.words||[]);
  }).catch(function(e){box.innerHTML='<div class="empty">加载失败 · '+esc(ferr(e.message))+'</div>'});
}
function renderRisk(words){
  var box=$('riskWords'); if(!box) return;
  if(!words.length){box.innerHTML='<div class="empty">暂无关键词</div>';return}
  box.innerHTML=words.map(function(w){
    return '<span class="chip">'+esc(w)+'<b data-word="'+esc(w)+'" title="删除">×</b></span>';
  }).join('');
}
function addRisk(){
  var input=$('riskInput'); if(!input) return;
  var kw=input.value.trim(); if(!kw){toast('请输入关键词',true);return}
  call('/risk_words_add',{words:kw}).then(function(j){
    toast(j&&j.msg||'已添加',!(j&&j.ok));
    if(j&&j.ok){input.value='';renderRisk(j.words||[])}
  }).catch(function(e){toast('添加失败：'+ferr(e.message),true)});
}
function scanRisk(){
  var input=$('riskInput'),kw=input?input.value.trim():'';
  var res=$('riskResult');
  if(res){res.className='risk-result';res.textContent='扫描中…';}
  call('/admin_scan',kw?{kw:kw}:{}).then(function(j){
    if(!j||!j.ok){if(res){res.className='risk-result bad';res.textContent=(j&&j.msg)||'扫描失败'}return}
    if(res){res.className='risk-result ok';res.textContent=(j.msg||'扫描完成')+' · HITS: '+((j.hits||[]).join('、')||'0')}
    if(j.words) renderRisk(j.words);
    loadUsers();
  }).catch(function(e){if(res){res.className='risk-result bad';res.textContent='请求失败 · '+ferr(e.message)}});
}
function delRisk(word){
  call('/risk_words_del',{word:word}).then(function(j){
    toast(j&&j.msg||'已删除',!(j&&j.ok));
    if(j&&j.ok) renderRisk(j.words||[]);
  }).catch(function(e){toast('删除失败：'+ferr(e.message),true)});
}

/* ---------- 惩罚 ---------- */
function loadPunish(){
  var bl=$('banList'),pl=$('punishList');
  if(bl) bl.innerHTML='<div class="empty">LOADING…</div>';
  if(pl) pl.innerHTML='<div class="empty">LOADING…</div>';
  Promise.all([
    call('/admin_banned_get',{}).catch(function(e){return{ok:false,msg:ferr(e.message)}}),
    call('/admin_punish',{}).catch(function(e){return{ok:false,msg:ferr(e.message)}})
  ]).then(function(rs){
    var b=rs[0],p=rs[1];
    if(bl){
      bl.innerHTML=(b&&b.ok&&b.list&&b.list.length)?b.list.map(function(x){
        var hh=Math.max(1,Math.ceil((x.remain||0)/3600));
        return '<div class="row-i"><b>'+esc(x.ip)+'</b><span>'+esc(x.name||'-')+' · '+esc(x.time||'')+' · BY '+esc(x.by||'-')+' · '+hh+'H</span><button data-ban="'+esc(x.ip)+'">解除</button></div>';
      }).join(''):'<div class="empty">'+(b&&b.ok?'暂无危险 IP':esc(b&&b.msg||'加载失败'))+'</div>';
    }
    if(pl){
      var arr=[];
      if(p&&p.ok){
        (p.panic||[]).forEach(function(x){arr.push({t:'PANIC',ip:x.ip,meta:'崩坏 · '+esc(x.by||'-')+' · '+esc(x.time||''),k:'panic'})});
        (p.ban||[]).forEach(function(x){arr.push({t:'BAN',ip:x.ip,meta:'封禁 · '+esc(x.by||'-')+' · 剩 '+Math.max(0,x.remain||0)+'S',k:'ban'})});
      }
      pl.innerHTML=arr.length?arr.map(function(x){
        return '<div class="row-i"><b>'+x.t+' '+esc(x.ip)+'</b><span>'+x.meta+'</span><button data-pundel="'+x.k+'|'+esc(x.ip)+'">解除</button></div>';
      }).join(''):'<div class="empty">'+(p&&p.ok?'暂无惩罚记录':esc(p&&p.msg||'加载失败'))+'</div>';
    }
  });
}
function punishAdd(type){
  var ip=$('punIp').value.trim(),name=$('punName').value.trim();
  if(!ip){toast('请输入 IP',true);return}
  if(!window.confirm((type==='panic'?'崩坏惩罚 ':'封禁 ')+ip+' ？')) return;
  call('/admin_punish',{ip:ip,name:name,type:type,action:'add'}).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已添加':'失败'),!(j&&j.ok));
    if(j&&j.ok){$('punIp').value='';$('punName').value='';loadPunish()}
  }).catch(function(e){toast('请求失败：'+ferr(e.message),true)});
}
function punishDel(type,ip){
  call('/admin_punish',{ip:ip,type:type,action:'remove'}).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已解除':'失败'),!(j&&j.ok));
    if(j&&j.ok) loadPunish();
  }).catch(function(e){toast('请求失败：'+ferr(e.message),true)});
}
function banClear(ip){
  call('/admin_banned_clear',{ip:ip}).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已解除':'失败'),!(j&&j.ok));
    if(j&&j.ok) loadPunish();
  }).catch(function(e){toast('请求失败：'+ferr(e.message),true)});
}

/* ---------- 内容审核 ---------- */
var CTAB_NAME={guests:'留言',posts:'论坛',debate:'论战',videos:'视频'};
var CTAB_PATH={guests:'/guests_new',posts:'/post_get',debate:'/debate_list',videos:'/video_list'};
function cut(s,n){
  s=String(s==null?'':s);
  return s.length>n?s.slice(0,n)+'…':s;
}
function loadContent(tab){
  var box=$('contentList'); if(!box) return;
  if(tab) S.ctab=tab;
  tab=S.ctab||'guests';
  var navs=document.querySelectorAll('#contentTabs button');
  for(var i=0;i<navs.length;i++) navs[i].classList.toggle('on',navs[i].getAttribute('data-ctab')===tab);
  box.innerHTML='<div class="empty">LOADING '+CTAB_NAME[tab]+'…</div>';
  var p={};
  if(tab==='guests') p={since:0};
  if(tab==='debate') p={limit:100};
  call(CTAB_PATH[tab],p).then(function(j){
    if(!j||!j.ok){box.innerHTML='<div class="empty">'+esc(j&&j.msg||'加载失败')+'</div>';return}
    S.cdata[tab]=j;
    renderContent(tab);
    updateContentCounts();
  }).catch(function(e){box.innerHTML='<div class="empty">加载失败 · '+esc(ferr(e.message))+'</div>'});
}
function loadContentAll(){
  var box=$('contentList'); if(!box) return;
  box.innerHTML='<div class="empty">LOADING MODERATION DATA…</div>';
  var navs=document.querySelectorAll('#contentTabs button');
  for(var i=0;i<navs.length;i++) navs[i].classList.toggle('on',navs[i].getAttribute('data-ctab')===S.ctab);
  var tabs=['guests','posts','debate','videos'];
  Promise.all(tabs.map(function(t){
    var p=t==='guests'?{since:0}:(t==='debate'?{limit:100}:{});
    return call(CTAB_PATH[t],p).then(function(j){ if(j&&j.ok) S.cdata[t]=j; }).catch(function(){});
  })).then(function(){
    updateContentCounts();
    renderContent(S.ctab);
  });
}
function contentItems(tab){  var j=S.cdata[tab]||{};
  if(tab==='debate') return j.posts||[];
  return j.list||[];
}
function updateContentCounts(){
  ['guests','posts','debate','videos'].forEach(function(k){
    var el=$('cnt'+k.charAt(0).toUpperCase()+k.slice(1));
    if(el) el.textContent=contentItems(k).length;
  });
}
function renderContent(tab){
  var box=$('contentList'); if(!box) return;
  tab=tab||S.ctab;
  var q=(($('contentSearch')&&$('contentSearch').value)||'').trim().toLowerCase();
  var all=contentItems(tab);
  var list=all.filter(function(x){
    if(!q) return true;
    return (String(x.text||'')+' '+String(x.body||'')+' '+String(x.title||'')+' '+
            String(x.user||'')+' '+String(x.name||'')+' '+String(x.shown||'')+' '+
            String(x.char||'')+' '+String(x.target||'')).toLowerCase().indexOf(q)>=0;
  });
  var cnt=$('contentCount');
  if(cnt) cnt.textContent=list.length+' / '+all.length+' '+CTAB_NAME[tab].toUpperCase();
  if(!list.length){box.innerHTML='<div class="empty">没有匹配的内容</div>';return}
  if(tab==='guests') box.innerHTML=list.map(rowGuest).join('');
  else if(tab==='posts') box.innerHTML=list.map(rowPost).join('');
  else if(tab==='debate') box.innerHTML=list.map(rowDebate).join('');
  else box.innerHTML=list.map(rowVideo).join('');
}
function rowGuest(x){
  return '<div class="c-row">'+
    '<div class="c-main"><div class="c-text">'+esc(x.text||'')+'</div>'+
    '<div class="c-sub">#'+esc(x.id||'')+' · '+esc(x.name||x.user||'')+' · '+esc(x.time||'')+'</div></div>'+
    '<div class="c-meta">留言</div>'+
    '<div class="c-acts"><button class="bad" data-cdel="guest|'+esc(x.id)+'">删除</button></div>'+
  '</div>';
}
function rowPost(x){
  var cs=x.comments||[], open=S.openPost===String(x.id);
  var body=cut(x.text||'',220);
  var cm=cs.map(function(c,i){
    return '<div class="c-cmt"><span>'+esc(c.shown||c.user||c.name||'')+' · '+esc(c.time||'')+'</span>'+
      '<p>'+esc(cut(c.text||'',160))+'</p>'+
      '<button class="bad" data-cmt="'+esc(x.id)+'|'+i+'">删</button></div>';
  }).join('');
  return '<div class="c-row">'+
    '<div class="c-main"><div class="c-text">'+esc(body||'（无正文）')+'</div>'+
    '<div class="c-sub">#'+esc(x.id||'')+' · '+esc(x.shown||x.user||'')+' · '+esc(x.time||'')+
      ((x.tags||[]).length?' · '+esc((x.tags||[]).join(' / ')):'')+' · '+(x.likes||[]).length+'♥</div>'+
      (open?'<div class="c-comments on">'+(cm||'<div class="empty">暂无评论</div>')+'</div>':'')+
    '</div>'+
    '<div class="c-meta">论坛<br>评论 '+cs.length+' · 赞 '+(x.likes||[]).length+'</div>'+
    '<div class="c-acts">'+
      '<button data-ctoggle="'+esc(x.id)+'">'+(open?'收起评论':'评论 '+cs.length)+'</button>'+
      '<button class="bad" data-cdel="post|'+esc(x.id)+'">删除帖子</button>'+
    '</div>'+
  '</div>';
}
function rowDebate(x){
  var args=x.args||[], open=S.openPost===('d'+x.id);
  var body=cut(x.body||'',200);
  var WIN={host:'发布者胜',challenger:'挑战者胜',draw:'平局',void:'无效'};
  var sh=(typeof x.score_host==='number')?x.score_host:args.filter(function(a){return a.result==='host'}).length;
  var sc=(typeof x.score_ch==='number')?x.score_ch:args.filter(function(a){return a.result==='challenger'}).length;
  var ar=args.map(function(a){
    var tail=a.result?('<span class="c-sub">已裁定 · '+(WIN[a.result]||esc(a.result))+
        (a.resolved_at?' · '+esc(a.resolved_at):'')+'</span>'+
        '<div class="c-acts" style="justify-content:flex-start;margin-top:4px">'+
        '<button data-ures="'+esc(x.id)+'|'+esc(a.id)+'">撤销裁定</button></div>'):
      ('<div class="c-acts" style="justify-content:flex-start;margin-top:4px">'+
       '<button class="host" data-cres="'+esc(x.id)+'|'+esc(a.id)+'|host">发布者胜</button>'+
       '<button class="host" data-cres="'+esc(x.id)+'|'+esc(a.id)+'|challenger">挑战者胜</button>'+
       '<button data-cres="'+esc(x.id)+'|'+esc(a.id)+'|draw">平局</button>'+
       '<button data-cres="'+esc(x.id)+'|'+esc(a.id)+'|void">无效</button></div>');
    return '<div class="c-cmt"><span>'+esc(a.char||'')+' · '+esc(a.user||'')+'</span>'+
      '<p>'+esc(cut(a.text||'',150))+'<br>'+tail+'</p><span></span></div>';
  }).join('');
  var stateTxt=(x.winner&&x.status==='closed')?(WIN[x.winner]||x.winner):(x.status||'open');
  return '<div class="c-row">'+
    '<div class="c-main"><div class="c-text"><b>'+esc(x.char||'')+'</b> vs <b>'+esc(x.target||'')+'</b>'+
      (body?' — '+esc(body):'')+'</div>'+
    '<div class="c-sub">'+esc(x.user||'')+' · '+esc(x.time||'')+' · 比分 H '+sh+' : '+sc+' · '+esc(stateTxt)+' · 发言 '+args.length+'</div>'+
      (open?'<div class="c-comments on">'+(ar||'<div class="empty">暂无发言</div>')+'</div>':'')+
    '</div>'+
    '<div class="c-meta">论战<br>'+esc(stateTxt)+'<br>H '+sh+' : '+sc+'</div>'+
    '<div class="c-acts">'+
      '<button data-ctoggle="d'+esc(x.id)+'">'+(open?'收起发言':'发言 '+args.length)+'</button>'+
      '<button class="bad" data-cdel="debate|'+esc(x.id)+'">删除论战</button>'+
    '</div>'+
  '</div>';
}
function rowVideo(x){
  return '<div class="c-row">'+
    '<div class="c-main"><div class="c-text">'+esc(cut(x.title||'(无标题)',120))+'</div>'+
    '<div class="c-sub">#'+esc(x.id||'')+' · '+esc(x.user||'')+' · '+esc(x.time||'')+' · '+esc(x.src||'')+'</div></div>'+
    '<div class="c-meta">视频</div>'+
    '<div class="c-acts"><button class="bad" data-cdel="video|'+esc(x.id)+'">删除视频</button></div>'+
  '</div>';
}
function contentDel(kind,id){
  var path={guest:'/guest_del',post:'/post_del',debate:'/debate_del',video:'/video_del'}[kind];
  if(!path) return;
  if(!window.confirm('确认删除这条'+({guest:'留言',post:'帖子',debate:'论战',video:'视频'}[kind])+'？')) return;
  var p=(kind==='debate')?{pid:id}:{id:id};
  call(path,p).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已删除':'操作失败'),!(j&&j.ok));
    if(j&&j.ok){ if(kind==='post') S.openPost=null; loadContent(kind==='video'?'videos':(kind==='debate'?'debate':(kind==='post'?'posts':'guests'))); }
  }).catch(function(e){toast('删除失败：'+ferr(e.message),true)});
}
function commentDel(pid,idx){
  if(!window.confirm('删除该评论？')) return;
  call('/admin_del_comment',{pid:pid,idx:idx}).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已删除':'操作失败'),!(j&&j.ok));
    if(j&&j.ok) loadContent('posts');
  }).catch(function(e){toast('删除失败：'+ferr(e.message),true)});
}
function debateResolve(pid,aid,winner){
  call('/debate_resolve',{pid:pid,aid:aid,winner:winner}).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已裁定':'裁定失败'),!(j&&j.ok));
    if(j&&j.ok) loadContent('debate');
  }).catch(function(e){toast('裁定失败：'+ferr(e.message),true)});
}
function debateUnresolve(pid,aid){
  if(!window.confirm('撤销这条裁定？若本场已结算，经验与胜负会一并回滚。')) return;
  call('/debate_unresolve',{pid:pid,aid:aid}).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已撤销':'撤销失败'),!(j&&j.ok));
    if(j&&j.ok) loadContent('debate');
  }).catch(function(e){toast('撤销失败：'+ferr(e.message),true)});
}
function togglePost(key){
  S.openPost=(S.openPost===key)?null:key;
  renderContent(S.ctab);
}

/* ---------- 公告 ---------- */
function loadNotices(){
  var box=$('noticeList'); if(!box) return;
  box.innerHTML='<div class="empty">LOADING NOTICES…</div>';
  call('/notice_get',{}).then(function(j){
    if(!j||!j.ok){box.innerHTML='<div class="empty">加载失败</div>';return}
    var arr=(j.list||[]).slice(0,40);
    if($('noticeCount')) $('noticeCount').textContent=arr.length+' NOTICES';
    box.innerHTML=arr.length?arr.map(function(x){
      return '<div class="row-i"><div><b>'+esc(x.text||'')+'</b><span>#'+esc(x.id||'')+' · '+esc(x.author||'')+' · '+esc(x.time||'')+'</span></div>'+
        '<button data-ndel="'+esc(x.id)+'">删除</button></div>';
    }).join(''):'<div class="empty">暂无公告</div>';
  }).catch(function(e){box.innerHTML='<div class="empty">加载失败 · '+esc(ferr(e.message))+'</div>'});
}
function addNotice(e){
  if(e) e.preventDefault();
  var input=$('noticeText'), t=input?input.value.trim():'';
  if(!t){toast('公告内容不能为空',true);return}
  call('/notice_add',{text:t}).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已发布':'发布失败'),!(j&&j.ok));
    if(j&&j.ok){input.value='';loadNotices()}
  }).catch(function(err){toast('发布失败：'+ferr(err.message),true)});
}
function delNotice(id){
  if(!window.confirm('删除这条公告？')) return;
  call('/notice_del',{id:id}).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已删除':'操作失败'),!(j&&j.ok));
    if(j&&j.ok) loadNotices();
  }).catch(function(e){toast('删除失败：'+ferr(e.message),true)});
}
/* ---------- 更新日志 ---------- */
function loadChangelog(){
  var box=$('clList'); if(!box) return;
  box.innerHTML='<div class="empty">LOADING CHANGELOG…</div>';
  call('/changelog_get',{}).then(function(j){
    if(!j||!j.ok){box.innerHTML='<div class="empty">加载失败</div>';return}
    var arr=(j.list||[]).slice(0,30);
    if($('clCount')) $('clCount').textContent=arr.length+' ENTRIES';
    box.innerHTML=arr.length?arr.map(function(x){
      var items=(x.items||[]).slice(0,20).map(function(it){return '<li>'+esc(it)+'</li>'}).join('');
      return '<div class="row-i"><div><b>'+esc(x.title||'(无标题)')+'</b><span>#'+esc(x.id||'')+' · '+esc(x.user||'')+' · '+esc(x.time||'')+'</span>'+
        (items?'<ul style="margin:6px 0 0 14px;font-size:11px;line-height:1.9;color:var(--ink2)">'+items+'</ul>':'')+
        '</div><button data-cldel="'+esc(x.id)+'">删除</button></div>';
    }).join(''):'<div class="empty">暂无更新日志</div>';
  }).catch(function(e){box.innerHTML='<div class="empty">加载失败 · '+esc(ferr(e.message))+'</div>'});
}
function addChangelog(e){
  if(e) e.preventDefault();
  var t=$('clTitle'), it=$('clItems');
  var title=t?t.value.trim():'', items=it?it.value.split('\n').map(function(s){return s.trim()}).filter(Boolean):[];
  if(!title&&!items.length){toast('标题或条目至少填一项',true);return}
  call('/changelog_add',{title:title,items:items}).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已发布':'发布失败'),!(j&&j.ok));
    if(j&&j.ok){if(t)t.value='';if(it)it.value='';loadChangelog()}
  }).catch(function(err){toast('发布失败：'+ferr(err.message),true)});
}
function delChangelog(id){
  if(!window.confirm('删除这条更新日志？')) return;
  call('/changelog_del',{id:id}).then(function(j){
    toast(j&&j.msg||(j&&j.ok?'已删除':'操作失败'),!(j&&j.ok));
    if(j&&j.ok) loadChangelog();
  }).catch(function(e){toast('删除失败：'+ferr(e.message),true)});
}

/* ---------- 备份 ---------- */
function backup(){
  toast('正在打包全站数据…');
  call('/backup',{}).then(function(j){
    if(!j||!j.ok){toast(j&&j.msg||'备份失败',true);return}
    var a=document.createElement('a');
    a.href='data:application/zip;base64,'+j.data;
    a.download='wtz-backup-'+new Date().toISOString().slice(0,10)+'.zip';
    a.click();
    toast('已备份 '+j.files+' 个文件 · '+Math.max(1,Math.round((j.size||0)/1024))+'KB');
  }).catch(function(e){toast('备份失败：'+ferr(e.message),true)});
}

/* ---------- 事件 ---------- */
function bind(){
  if($('lgForm')) $('lgForm').addEventListener('submit',doLogin);
  if($('nav')) $('nav').addEventListener('click',function(e){
    var b=e.target.closest('[data-v]'); if(b) setView(b.getAttribute('data-v'));
  });
  if($('logout')) $('logout').addEventListener('click',function(){
    try{localStorage.removeItem(K_SESS)}catch(e){}
    location.href='社区.html';
  });
  document.addEventListener('click',function(e){
    var act=e.target.closest('[data-act]');
    if(act){
      var a=act.getAttribute('data-act');
      if(a==='dash-refresh') loadDash();
      if(a==='backup') backup();
      if(a==='users-refresh') loadUsers();
      if(a==='audit-json') exportAudit('json');
      if(a==='audit-csv') exportAudit('csv');
      if(a==='risk-add') addRisk();
      if(a==='risk-scan') scanRisk();
      if(a==='content-refresh') loadContent(S.ctab);
      if(a==='notice-refresh') loadNotices();
      if(a==='cl-refresh') loadChangelog();
      return;
    }
    var ua=e.target.closest('[data-uact]');
    if(ua){userAction(ua);return}
    var w=e.target.closest('[data-word]');
    if(w){delRisk(w.getAttribute('data-word'));return}
    var bc=e.target.closest('[data-ban]');
    if(bc){banClear(bc.getAttribute('data-ban'));return}
    var pd=e.target.closest('[data-pundel]');
    if(pd){var parts=pd.getAttribute('data-pundel').split('|');punishDel(parts[0],parts[1]);return}
    var pb=e.target.closest('[data-punish]');
    if(pb){punishAdd(pb.getAttribute('data-punish'));return}
    var ct=e.target.closest('[data-ctab]');
    if(ct){loadContent(ct.getAttribute('data-ctab'));return}
    var tg=e.target.closest('[data-ctoggle]');
    if(tg){togglePost(tg.getAttribute('data-ctoggle'));return}
    var cd=e.target.closest('[data-cdel]');
    if(cd){var sp=cd.getAttribute('data-cdel').split('|');contentDel(sp[0],sp[1]);return}
    var cm=e.target.closest('[data-cmt]');
    if(cm){var cp=cm.getAttribute('data-cmt').split('|');commentDel(cp[0],cp[1]);return}
    var cr=e.target.closest('[data-cres]');
    if(cr){var crs=cr.getAttribute('data-cres').split('|');debateResolve(crs[0],crs[1],crs[2]);return}
    var ur=e.target.closest('[data-ures]');
    if(ur){var urs=ur.getAttribute('data-ures').split('|');debateUnresolve(urs[0],urs[1]);return}
    var nd=e.target.closest('[data-ndel]');
    if(nd){delNotice(nd.getAttribute('data-ndel'));return}
    var cld=e.target.closest('[data-cldel]');
    if(cld){delChangelog(cld.getAttribute('data-cldel'));return}
  });
  if($('userSearch')) $('userSearch').addEventListener('input',renderUsers);
  if($('auditDate')) $('auditDate').addEventListener('change',loadAudit);
  if($('riskInput')) $('riskInput').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addRisk()}});
  if($('contentSearch')) $('contentSearch').addEventListener('input',function(){renderContent(S.ctab)});
  if($('noticeForm')) $('noticeForm').addEventListener('submit',addNotice);
  if($('clForm')) $('clForm').addEventListener('submit',addChangelog);
}

/* ---------- 启动 ---------- */
function boot(){
  bind();
  gateMsg('恢复管理员会话…','ok');
  var apiReady=false;
  initApi().then(function(ok){
    apiReady=!!ok;
    if(!ok){gateMsg('未找到云端地址，请先打开社区页建立连接');return false}
    var sess=readSess();
    if(!sess||!sess.token) return false;
    S.user=sess;
    return call('/admin_users',{}).then(function(j){
      if(j&&j.ok){
        S.root=!!j.root;
        enter();
        if($('operator')) $('operator').textContent=S.user.username.toUpperCase()+(S.root?' / ROOT':' / ADMIN');
        return true;
      }
      return false;
    }).catch(function(){return false});
  }).then(function(ok){
    if(!ok){
      S.user=null;
      gateMsg(apiReady?'':'未找到云端地址，请先打开社区页建立连接');
      if($('lgUser')) $('lgUser').focus();
    }
  });
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
else boot();

})();
