/* WTZ 社区页 · 留言板 / 私聊 / 公告 / 管理 全部逻辑 */
(function(){
'use strict';

function ferr(msg){
  msg=String(msg||'');
  if(/Failed to fetch|ERR_CONNECTION|NetworkError|fetch failed/i.test(msg)) return '网络连接失败，请检查网络或稍后重试';
  if(/429/.test(msg)) return '操作太频繁，请稍候几秒再试';
  if(/5\d\d/.test(msg)) return '服务器开小差了，请稍后重试';
  if(/404/.test(msg)) return '接口或云端地址失效，请检查云端配置';
  if(/403/.test(msg)) return '没有权限执行该操作';
  if(/401/.test(msg)) return '登录已失效，请重新登录';
  if(/timeout/i.test(msg)) return '连接超时，请检查云端服务是否在线';
  if(/load failed|ERR_FAILED/i.test(msg)) return '资源加载失败，请刷新重试';
  return msg;
}
function $(id){return document.getElementById(id)}
function esc(s){
  return String(s==null?'':s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function nowStr(){
  var d=new Date(),p=function(n){return(n<10?'0':'')+n};
  return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
}
function hash(s){
  var h=5381,i;
  s=String(s);
  for(i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))|0;
  return 'h'+(h>>>0).toString(16);
}
function rid(){ return Math.random().toString(36).slice(2,10)+Date.now().toString(36); }
function on(id,ev,fn){ var el=$(id); if(el) el.addEventListener(ev,fn); }
function txt(id,val){ var el=$(id); if(el) el.textContent=val; }
function show(id,disp){ var el=$(id); if(el) el.style.display=disp; }

var TOAST_T=null;
function toast(msg,sub){
  var el=$('cmToast');
  if(!el){
    el=document.createElement('div');
    el.id='cmToast';
    el.style.cssText='position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:999;background:rgba(10,13,15,.95);border:1px solid rgba(255,255,255,.35);padding:9px 18px;font-family:var(--mono);font-size:11.5px;letter-spacing:.1em;color:#E8EDEF;opacity:0;transition:opacity .25s,transform .25s;pointer-events:none;text-align:center';
    document.body.appendChild(el);
  }
  el.innerHTML=esc(msg)+(sub?'<div style="color:#7d8a8e;font-size:10px;margin-top:3px">'+esc(sub)+'</div>':'');
  el.style.opacity='1';
  el.style.transform='translateX(-50%) translateY(-4px)';
  clearTimeout(TOAST_T);
  TOAST_T=setTimeout(function(){ el.style.opacity='0'; el.style.transform='translateX(-50%)'; },2200);
}

/* ---------- 状态 ---------- */
var K_API='gb_api_url',K_SESS='gb_session',K_DB='gb_db_v2',K_GB='gb_cache_v2';
var AUTH_ERR={ok:false,msg:'登录已失效，请重新登录'};
var S={api:'',apis:[],user:null,peer:null,timer:null,avatar:0,img:'',pmImg:'',replyTo:'',thread:[],ntF:'all'};
var AVATARS=[{c:'#3FE0C8',s:'◆'},{c:'#FF5C7A',s:'▲'},{c:'#FFD166',s:'★'},{c:'#6C8CFF',s:'●'},{c:'#B58CFF',s:'✦'},{c:'#5CE08A',s:'■'},{c:'#FF9F6B',s:'✿'},{c:'#4FD8EB',s:'☂'},{c:'#FFC36B',s:'⚡'},{c:'#8F9BB3',s:'☾'},{c:'#FF7AB8',s:'❖'},{c:'#7BFFB8',s:'☯'}];

function normalizeApi(v){
  v=String(v||'').trim().replace(/\/+$/,'');
  if(!v) return '';
  if(!/^https?:\/\//i.test(v)) return '';
  return v;
}
function parseApis(raw){
  var out=[];
  String(raw||'').replace(/^\uFEFF/,'').split(/[\n,;]+/).forEach(function(x){
    var v=normalizeApi(x);
    if(v && out.indexOf(v)<0) out.push(v);
  });
  return out;
}
function isBadApi(x){return /36c3116e|74312bf6|751e3fda/.test(x||'')}

try{ S.apis=parseApis(localStorage.getItem(K_API)); }catch(e){ S.apis=[]; }
S.apis=(S.apis||[]).filter(function(x){return !isBadApi(x)});
S.api=(S.apis&&S.apis[0])||'';
try{
  var sv=JSON.parse(localStorage.getItem(K_SESS)||'null');
  if(sv&&sv.token&&sv.username) S.user=sv;
}catch(e){}

/* ---------- 本地模式数据库 ---------- */
function dbLoad(){
  try{
    var d=JSON.parse(localStorage.getItem(K_DB));
    if(d&&d.users&&d.guests&&d.pms){
      d.sessions=d.sessions||{};
      if(typeof d.seq!=='number') d.seq=1;
      return d;
    }
  }catch(e){}
  return {users:{},guests:[],pms:[],sessions:{},seq:1};
}
function dbSave(d){ try{ localStorage.setItem(K_DB,JSON.stringify(d)); }catch(e){} }

function localCall(path,p){
  var d=dbLoad();
  function me(){
    var n=d.sessions[p.token];
    return (n&&d.users[n]) ? {name:n,is_admin:!!d.users[n].is_admin} : null;
  }
  switch(path){
    case '/register':{
      var ru=String(p.username||'').trim(), rp=String(p.password||'');
      if(!/^[\w\u4e00-\u9fa5]{2,16}$/.test(ru)) return {ok:false,msg:'账号需 2–16 位字母/数字/汉字'};
      if(rp.length<3) return {ok:false,msg:'密码至少 3 位'};
      if(d.users[ru]) return {ok:false,msg:'该账号已存在'};
      var first=Object.keys(d.users).length===0;
      d.users[ru]={pw:hash(rp),is_admin:first};
      dbSave(d);
      return {ok:true,msg:first?'注册成功 · 你已成为管理员':'注册成功，请登录'};
    }
    case '/login':{
      var lu=String(p.username||'').trim(), lp=String(p.password||'');
      var rec=d.users[lu];
      if(!rec||rec.pw!==hash(lp)) return {ok:false,msg:'账号或密码错误'};
      var tk='tk'+rid();
      d.sessions[tk]=lu; dbSave(d);
      return {ok:true,username:lu,is_admin:!!rec.is_admin,token:tk};
    }
    case '/logout':{
      if(p.token) delete d.sessions[p.token];
      dbSave(d); return {ok:true};
    }
    case '/guests': case '/guests_new':{
      var ls=d.guests.filter(function(x){return !x.hide}).sort(function(a,b){return b.id-a.id});
      var mx=0; for(var i=0;i<ls.length;i++) mx=Math.max(mx,Number(ls[i].id)||0);
      return {ok:true,list:ls,deleted:[],total:ls.length,maxId:mx,online:1,admins:{}};
    }
    case '/guest_add':{
      var gt=String(p.text||'').trim().slice(0,500);
      if(!gt) return {ok:false,msg:'内容不能为空'};
      var cu=me();
      if(!cu) return AUTH_ERR;
      var nm=(cu?cu.name:(String(p.name||'').trim()||'访客')).slice(0,16);
      var gid=d.seq++;
      d.guests.push({id:gid,user:cu?cu.name:null,name:nm,text:gt,time:nowStr(),avatar:(+p.avatar||0)%12,image:p.image||'',reply_to:p.reply_to||'',likes:[],reson:[]});
      dbSave(d);
      return {ok:true,id:gid};
    }
    case '/guest_del':{
      var cd=me(); if(!cd) return AUTH_ERR;
      var g=null,i;
      for(i=0;i<d.guests.length;i++){ if(String(d.guests[i].id)===String(p.id)){ g=d.guests[i]; break; } }
      var inCache=false;
      try{
        var cc0=JSON.parse(localStorage.getItem(K_GB)||'null');
        if(cc0&&cc0.list) inCache=cc0.list.some(function(x){return String(x&&x.id)===String(p.id)});
      }catch(e){}
      if(!g&&!inCache) return {ok:false,msg:'留言不存在'};
      if(g){
        if(!cd.is_admin&&g.user!==cd.name) return {ok:false,msg:'无权删除该留言'};
        d.guests=d.guests.filter(function(x){return x!==g});
        dbSave(d);
      }
      try{
        var cc=JSON.parse(localStorage.getItem(K_GB)||'null');
        if(cc&&cc.list) cc.list=cc.list.filter(function(x){return String(x&&x.id)!==String(p.id)});
        localStorage.setItem(K_GB,JSON.stringify(cc));
      }catch(e){}
      return {ok:true,msg:g?'已删除':'已从列表移除'};
    }
    case '/guest_like':{
      var cl=me(); if(!cl) return AUTH_ERR;
      for(var j=0;j<d.guests.length;j++) if(String(d.guests[j].id)===String(p.id)){
        var gl=d.guests[j].likes||[]; var ix=gl.indexOf(cl.name);
        if(ix>=0) gl.splice(ix,1); else gl.push(cl.name);
        d.guests[j].likes=gl; dbSave(d);
        return {ok:true,n:gl.length};
      }
      return {ok:false,msg:'留言不存在'};
    }
    case '/pm_send':{
      var cs=me(); if(!cs) return AUTH_ERR;
      var to=String(p.to||'').trim(), msg=String(p.msg||'').trim().slice(0,500);
      if(!to||(!msg&&!p.img)) return {ok:false,msg:'请填写收件人与内容'};
      if(to===cs.name) return {ok:false,msg:'不能给自己发私聊'};
      if(!d.users[to]) return {ok:false,msg:'收件人不存在'};
      var pmid=d.seq++;
      d.pms.push({id:pmid,from:cs.name,to:to,msg:msg,img:p.img||'',time:nowStr(),read:false});
      dbSave(d);
      return {ok:true,id:pmid};
    }
    case '/pm_thread':{
      var ct=me(); if(!ct) return AUTH_ERR;
      var peer=String(p.peer||'').trim();
      var list=d.pms.filter(function(m){
        return (m.from===ct.name&&m.to===peer)||(m.from===peer&&m.to===ct.name);
      });
      var ch=false;
      list.forEach(function(m){ if(m.to===ct.name&&!m.read){ m.read=true; ch=true; } });
      if(ch) dbSave(d);
      return {ok:true,list:list};
    }
    case '/pm_conv':{
      var cc2=me(); if(!cc2) return AUTH_ERR;
      var map={};
      d.pms.forEach(function(m){
        if(m.from!==cc2.name&&m.to!==cc2.name) return;
        var pr=m.from===cc2.name?m.to:m.from;
        if(!map[pr]) map[pr]={peer:pr,last:'',time:'',unread:0};
        map[pr].last=m.msg; map[pr].time=m.time;
        if(m.to===cc2.name&&!m.read) map[pr].unread++;
      });
      var arr=Object.keys(map).map(function(k){return map[k]});
      arr.sort(function(a,b){ return a.time<b.time?1:-1; });
      return {ok:true,list:arr};
    }
    case '/admin_users':{
      var au=me(); if(!au||!au.is_admin) return {ok:false,msg:'无权限'};
      var ulist=Object.keys(d.users).map(function(n){
        return {name:n,is_admin:!!d.users[n].is_admin,online:Object.keys(d.sessions).some(function(t){return d.sessions[t]===n}),pwd:'***'};
      });
      return {ok:true,list:ulist,root:false};
    }
    case '/guest_resonate':{
      var cr=me(); if(!cr) return {ok:false,msg:'请先登录后再共鸣'};
      for(var jr=0;jr<d.guests.length;jr++) if(String(d.guests[jr].id)===String(p.id)){
        var rr=d.guests[jr].reson||[]; var rx=rr.indexOf(cr.name);
        if(rx>=0) rr.splice(rx,1); else rr.push(cr.name);
        d.guests[jr].reson=rr; dbSave(d);
        return {ok:true,n:rr.length};
      }
      return {ok:false,msg:'留言不存在'};
    }
    case '/guest_report':{
      var cp2=me(); if(!cp2) return {ok:false,msg:'请先登录后再举报'};
      for(var jp=0;jp<d.guests.length;jp++) if(String(d.guests[jp].id)===String(p.id)){
        var tg2=d.guests[jp];
        if(tg2.user===cp2.name) return {ok:false,msg:'不能举报自己的留言'};
        var rp2=tg2.reporters||[];
        if(rp2.indexOf(cp2.name)>=0) return {ok:false,msg:'这条你已经举报过了'};
        rp2.push(cp2.name); tg2.reporters=rp2;
        if(rp2.length>=3) tg2.hide=true;
        dbSave(d);
        return {ok:true,n:rp2.length,hidden:!!tg2.hide};
      }
      return {ok:false,msg:'留言不存在'};
    }
    case '/pm_del':{
      var cd2=me(); if(!cd2) return AUTH_ERR;
      var n0=d.pms.length;
      d.pms=d.pms.filter(function(m){return !(String(m.id)===String(p.id)&&m.from===cd2.name)});
      if(d.pms.length===n0) return {ok:false,msg:'消息不存在或无权删除'};
      dbSave(d); return {ok:true};
    }
    case '/pm_delconv':{
      var cdc=me(); if(!cdc) return AUTH_ERR;
      var pr2=String(p.peer||'').trim(), n1=d.pms.length;
      d.pms=d.pms.filter(function(m){
        return !((m.from===cdc.name&&m.to===pr2)||(m.from===pr2&&m.to===cdc.name));
      });
      dbSave(d); return {ok:true,deleted:n1-d.pms.length};
    }
    case '/profile':{
      var pn2=String(p.name||'').trim().slice(0,24);
      var rec4=d.users[pn2];
      if(!rec4) return {ok:false,msg:'用户不存在'};
      var ck3=rec4.checkin||{};
      return {ok:true,
        profile:{name:pn2,avatar:0,is_admin:!!rec4.is_admin,banned:!!rec4.banned,lv:1,title:'初入终端',
          exp:rec4.exp||0,base:0,need:100,streak:ck3.streak||0,total:ck3.total||0,pts:rec4.pts||0,
          days:0,likes:0,ckdays:ck3.days||[],bio:rec4.bio||'',self_:!!(S.user&&S.user.username===pn2),
          ach:rec4.ach||[],badge:ck3.streak>=30?'30':(ck3.streak>=7?'7':(ck3.streak>=3?'3':'')),frame:''},
        guests:d.guests.filter(function(x){return x.user===pn2}),posts:[],comments:[]};
    }
    case '/profile_edit':{
      var pe=me(); if(!pe) return {ok:false,msg:'请先登录'};
      d.users[pe.name].bio=String(p.bio||'').trim().slice(0,120);
      dbSave(d); return {ok:true,msg:'已保存'};
    }
    case '/rank':{
      var by2=String(p.by||'exp'), lim=Math.max(1,+(p.limit||10));
      var rows=Object.keys(d.users).map(function(n){
        var r5=d.users[n];
        return {name:n,exp:r5.exp||0,pts:r5.pts||0,ach:(r5.ach||[]).length,lv:1,title:'初入终端',is_admin:!!r5.is_admin};
      });
      rows.sort(function(a,b){return (b[by2]||0)-(a[by2]||0)||(a.name<b.name?-1:1)});
      return {ok:true,by:by2==='exp'||by2==='pts'||by2==='ach'?by2:'exp',list:rows.slice(0,lim),total:rows.length};
    }
    case '/achievements':{
      return {ok:true,base:'初入终端',total:ACH20.length,items:ACH20.map(function(n){return {n:n,h:false}}).concat(
        ['终章·全成就','隐藏·新游戏+'].map(function(n){return {n:n,h:true}}))};
    }
    case '/notice_get':{
      return {ok:true,list:(d.notices||[]).slice().sort(function(a,b){return b.id-a.id})};
    }
    case '/notice_add':{
      var ca=me(); if(!ca||!ca.is_admin) return {ok:false,msg:'无管理员权限'};
      var nt=String(p.text||'').trim().slice(0,120);
      if(!nt) return {ok:false,msg:'内容不能为空'};
      d.notices=d.notices||[];
      d.notices.push({id:d.seq++,text:nt,time:nowStr(),author:ca.name});
      dbSave(d);
      return {ok:true,msg:'公告已发布'};
    }
    case '/notice_del':{
      var cnd=me(); if(!cnd||!cnd.is_admin) return {ok:false,msg:'无管理员权限'};
      d.notices=(d.notices||[]).filter(function(n){return String(n.id)!==String(p.id)});
      dbSave(d); return {ok:true,msg:'已删除'};
    }
    case '/checkin':{
      var ck=me(); if(!ck) return {ok:false,msg:'请先登录'};
      var rec3=d.users[ck.name];
      var today=nowStr().slice(0,10);
      var c3=rec3.checkin||{};
      if(c3.date===today) return {ok:true,done:true,streak:c3.streak||0,total:c3.total||0};
      var y=new Date(Date.now()-864e5), ys=y.getFullYear()+'-'+('0'+(y.getMonth()+1)).slice(-2)+'-'+('0'+y.getDate()).slice(-2);
      var st3=(c3.date===ys?(c3.streak||0)+1:1), tt3=(c3.total||0)+1;
      rec3.checkin={date:today,streak:st3,total:tt3};
      var bn=(st3>=30?50:(st3>=7?15:(st3>=3?5:0)));
      rec3.pts=(rec3.pts||0)+10+bn;
      dbSave(d);
      return {ok:true,streak:st3,total:tt3,pts:rec3.pts,badge:st3>=30?'30':(st3>=7?'7':(st3>=3?'3':''))};
    }
    case '/checkin_status':{
      var ck2=me();
      if(!ck2) return {ok:false,msg:'登录已失效，请重新登录'};
      var rc2=d.users[ck2.name], c4=rc2.checkin||{};
      var td2=nowStr().slice(0,10), s4=c4.streak||0;
      return {ok:true,done:c4.date===td2,streak:s4,total:c4.total||0,pts:rc2.pts||0,
        badge:s4>=30?'30':(s4>=7?'7':(s4>=3?'3':''))};
    }
    case '/notify_get':{
      var cn=me(); if(!cn) return {ok:false,msg:'登录已失效，请重新登录'};
      var nu=0;
      d.pms.forEach(function(m){ if(m.to===cn.name&&!m.read) nu++; });
      return {ok:true,list:[],unread:nu,pm_unread:nu,notices:(d.notices||[]).slice(-5)};
    }
    case '/notify_read': return {ok:true,msg:'已读'};
    default:
      return {ok:false,msg:'未知接口 '+path};
  }
}
function localAsync(path,body){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      try{ resolve(localCall(path,body)); }
      catch(e){ reject(e); }
    },40);
  });
}

/* ---------- 统一调用 ---------- */
function call(path,payload,method){
  var body=Object.assign({token:S.user?S.user.token:''},payload||{});
  if(!S.api) return localAsync(path,body);

  var m=method||'POST';
  var tried=[];
  function qs(o){
    var a=[];
    for(var k in o) if(o[k]!==undefined&&o[k]!==null) a.push(encodeURIComponent(k)+'='+encodeURIComponent(o[k]));
    return a.join('&');
  }
  function attempt(api){
    tried.push(api);
    var url=api+path+(m==='GET'&&body&&qs(body)?'?'+qs(body):'');
    var opt={method:m,headers:{'Content-Type':'application/json'}};
    if(m!=='GET') opt.body=JSON.stringify(body);
    return fetch(url,opt).then(function(res){
      if(!res.ok) throw new Error('HTTP '+res.status+' @ '+url);
      return res.json();
    }).catch(function(err){
      var cands=(S.apis&&S.apis.length)?S.apis:[S.api];
      var next=null;
      for(var i=0;i<cands.length;i++) if(tried.indexOf(cands[i])<0){next=cands[i];break}
      if(next){
        S.api=next;
        try{ localStorage.setItem(K_API,S.apis.join('\n')); }catch(e){}
        return attempt(next);
      }
      var e2=new Error((err&&err.message?err.message:'网络请求失败')+' — '+url);
      e2.url=url;
      e2.isNetwork=true;
      throw e2;
    });
  }
  return attempt(S.api);
}

function say(msg,ok){
  var cls='gb-say'+(ok===true?' ok':(ok===false?' bad':''));
  [$('gb_say'),$('gb_say2')].forEach(function(el){
    if(!el) return;
    el.className=cls;
    el.textContent=msg||'';
  });
  if(msg) setTimeout(function(){
    [$('gb_say'),$('gb_say2')].forEach(function(el){
      if(el&&el.textContent===msg) el.textContent='';
    });
  },4200);
}

/* ---------- 云存档 ---------- */
var CF_T=null;
function cloudSave(pref,delay){
  if(!S.user||!S.api) return;
  clearTimeout(CF_T);
  CF_T=setTimeout(function(){ call('/pref_set',{pref:pref}).catch(function(){}); },delay||0);
}
function cloudApply(){
  if(!S.user||!S.api) return Promise.resolve();
  return call('/pref_get',{}).then(function(j){
    if(!j||!j.ok||!j.pref) return;
    if(j.pref.avatar!==undefined){ S.avatar=j.pref.avatar; initAvatarPick(); }
    if(j.pref.memo){
      try{ if(!localStorage.getItem('wMemo')) localStorage.setItem('wMemo',j.pref.memo); }catch(e){}
    }
  }).catch(function(){});
}

/* ---------- 登录态 ---------- */
function applyAuth(){
  var isOn=!!S.user;
  show('gb_login_area',isOn?'none':'flex');
  show('gb_userinfo',isOn?'flex':'none');
  var pmp=$('gb_pm_panel');
  if(pmp) pmp.classList.toggle('on',isOn);
  var lt=$('gb_text'),sb=$('gb_submit'),ib=$('gb_img_btn');
  if(lt){ lt.disabled=!isOn; lt.placeholder=isOn?'写点留言…':'登录后可留言'; }
  if(sb){ sb.disabled=!isOn; sb.textContent=isOn?'发留言':'登录后可留言'; }
  if(ib) ib.disabled=!isOn;
  var gu=isOn&&S.user.is_admin;
  show('gb_users_panel',gu?'block':'none');
  if(gu){
    ['gb_risk_kw','gb_risk_btn','gb_risk_all','gb_aud_btn','gb_sta_btn','gb_ban_btn','gb_punish_btn','gb_bak_btn'].forEach(function(x){ show(x,S.api?'':'none'); });
    var rb=document.querySelector('.cm-riskbox');
    if(rb) rb.style.display=S.api?'':'none';
    if($('gb_aud')) $('gb_aud').style.display='none';
    if($('gb_sta')) $('gb_sta').style.display='none';
    if($('gb_aud_close')) $('gb_aud_close').style.display='none';
    if($('gb_ban_list')) $('gb_ban_list').style.display='none';
    if($('gb_punish_list')) $('gb_punish_list').style.display='none';
    loadUsers();
  }
  checkinStatus();
  if(isOn){
    txt('gb_curuser',S.user.username);
    show('gb_isadmin',S.user.is_admin?'inline-block':'none');
    var gn=$('gb_name');
    if(gn){ gn.value=S.user.username; gn.disabled=true; gn.placeholder='已登录账号'; }
  }else{
    var gn2=$('gb_name');
    if(gn2){ gn2.disabled=false; gn2.placeholder='昵称（访客）'; }
  }
}

function gbRegister(){
  var u=$('gb_user').value.trim(),p=$('gb_pwd').value;
  if(!u||!p) return say('填账号和密码',false);
  var dt=0; try{dt=parseInt(localStorage.getItem('wtz_danger_ts')||'0',10)}catch(e){}
  try{ localStorage.removeItem('wtz_danger_names'); }catch(e){}
  if(dt&&Date.now()-dt<86400000){
    var rh=Math.max(1,Math.ceil((86400000-(Date.now()-dt))/3600000));
    return say('本机被标记为危险来源，'+rh+' 小时内禁止注册任何账号',false);
  }
  return call('/register',{username:u,password:p}).then(function(j){
    say(j.msg||(j.ok?'注册成功':'注册失败'),!!j.ok);
    if(j.ok) $('gb_pwd').value='';
  }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
}

function gbLogin(){
  var u=$('gb_user').value.trim(),p=$('gb_pwd').value;
  if(!u||!p) return say('填账号和密码',false);
  return call('/login',{username:u,password:p}).then(function(j){
    if(!j.ok) return say(j.msg||'登录失败',false);
    S.user={username:j.username,is_admin:!!j.is_admin,token:j.token,pts:j.pts,items:j.items||[],title:j.title||'',frame:j.frame||''};
    try{ localStorage.setItem(K_SESS,JSON.stringify(S.user)); }catch(e){}
    try{ localStorage.setItem('gb_pwd',p); }catch(e){}
    $('gb_pwd').value='';
    applyAuth();
    cloudApply();
    say('欢迎回来，'+j.username,true);
    loadGuestBook();
    loadNotes();
    pmRefreshConversations();
    startPoll();
    ntRefresh();
  }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
}

function gbRcShow(){
  show('gbRecMask','flex');
  $('gb_rc_user').value=''; txt('gb_rc_q',''); show('gb_rc_q','none');
  $('gb_rc_ans').value=''; show('gb_rc_ans','none');
  $('gb_rc_pwd').value=''; show('gb_rc_pwd','none');
  show('gb_rc_go',''); show('gb_rc_ok','none');
  txt('gb_rc_say','');
}
function gbRcQ(){
  var u=$('gb_rc_user').value.trim();
  if(!u){ txt('gb_rc_say','请输入账号'); gbRcShake(); return; }
  call('/recover_q',{username:u}).then(function(j){
    if(!j.ok){ txt('gb_rc_say',j.msg||'获取失败'); gbRcShake(); return; }
    txt('gb_rc_q','问题：'+j.question); show('gb_rc_q','');
    show('gb_rc_ans',''); show('gb_rc_pwd','');
    show('gb_rc_go','none'); show('gb_rc_ok','');
    txt('gb_rc_say','');
  }).catch(function(e){ txt('gb_rc_say','请求失败：'+ferr(e.message)); });
}
function gbRcShake(){
  var m=document.getElementById('gbRecMask');
  if(!m) return;
  var box=m.querySelector('div');
  if(!box) return;
  box.classList.remove('rcShake'); void box.offsetWidth; box.classList.add('rcShake');
}
function gbRcGo(){
  var u=$('gb_rc_user').value.trim(),a=$('gb_rc_ans').value.trim(),p=$('gb_rc_pwd').value;
  if(!a||!p){ txt('gb_rc_say','请填写答案与新密码'); gbRcShake(); return; }
  call('/recover',{username:u,answer:a,newpwd:p}).then(function(j){
    txt('gb_rc_say',j.msg||(j.ok?'已重置':'失败'));
    if(j.ok){ setTimeout(function(){ show('gbRecMask','none'); },1300); }
    else gbRcShake();
  }).catch(function(e){ txt('gb_rc_say','请求失败：'+ferr(e.message)); gbRcShake(); });
}
function gbSecShow(){
  show('gbSecMask','flex');
  $('gb_sec_q').value=''; $('gb_sec_a').value=''; txt('gb_sec_say','');
}
function gbSecSave(){
  var q=$('gb_sec_q').value.trim(),a=$('gb_sec_a').value.trim();
  if(!q||!a) return txt('gb_sec_say','请填写问题与答案');
  if(!S.user) return txt('gb_sec_say','请先登录');
  call('/sec_set',{token:S.user.token,q:q,a:a}).then(function(j){
    txt('gb_sec_say',j.msg||(j.ok?'已设置':'失败'));
  }).catch(function(e){ txt('gb_sec_say','请求失败：'+ferr(e.message)); });
}
function gbLogout(){
  var done=function(){
    S.user=null; S.peer=null;
    try{ localStorage.removeItem(K_SESS); }catch(e){}
    stopPoll();
    applyAuth();
    if($('pm_box')) $('pm_box').innerHTML='';
    if($('pm_conv')) $('pm_conv').innerHTML='';
    if($('pm_target')) $('pm_target').value='';
    if($('pm_msg')) $('pm_msg').value='';
    show('pmBadge','none');
    show('ntBadge','none');
    say('已退出',true);
    loadGuestBook();
    loadNotes();
  };
  call('/logout',{}).then(done,function(){ done(); });
}
function markDanger(){
  try{ localStorage.setItem('wtz_danger_ts',String(Date.now())); }catch(e){}
}
function tokenPulse(){
  if(!S.api||!S.user||!S.user.token) return;
  call('/token_state',{}).then(function(j){
    if(!j||!j.ok) return;
    if(j.state==='deleted'){
      markDanger();
      say('你的账号已被管理员删除，本机 24 小时内禁止注册该账号',false);
      gbLogout();
    }else if(j.state==='kicked'){
      say('你的登录已被顶号或失效，已自动登出',false);
      gbLogout();
    }else if(j.state==='expired'){
      var pw='';try{pw=localStorage.getItem('gb_pwd')||''}catch(e){}
      if(pw) autoRelogin();
      else{ say('登录过期，重新登一下',false); gbLogout(); }
    }
  }).catch(function(){});
}

/* ---------- 留言 ---------- */
function likeBtn(g){
  var ls=g.likes||[], liked=S.user&&ls.indexOf(S.user.username)>=0;
  return '<div class="gb-like'+(liked?' on':'')+'" data-like="'+esc(g.id)+'">'+(liked?'♥':'♡')+' '+ls.length+'</div>';
}
function resonBtn(g){
  var rs=g.reson||[], resonated=S.user&&rs.indexOf(S.user.username)>=0;
  return '<div class="gb-like gb-reson'+(resonated?' on':'')+'" data-reson="'+esc(g.id)+'" title="共鸣 · 共振涟漪（≥3 触发共鸣潮）">'+(resonated?'⚡':'≋')+' 共鸣 '+(rs.length||0)+'</div>';
}
var _gbripple_injected=false;
function doResonRipple(n,cardEl){
  if(!_gbripple_injected){
    _gbripple_injected=true;
    var st=document.createElement('style');
    st.textContent='@keyframes gbRip{0%{box-shadow:0 0 0 0 rgba(154,111,174,.65)}100%{box-shadow:0 0 0 16px rgba(154,111,174,0)}}.gb-ripple{animation:gbRip .6s ease-out}.gb-tide .gb-item{animation:gbTide 1s ease-in-out}@keyframes gbTide{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}';
    document.head.appendChild(st);
  }
  if(cardEl) cardEl.classList.add('gb-ripple');
  if(n>=3){
    var box=$('guestbookList');
    if(box){ box.classList.add('gb-tide'); setTimeout(function(){box.classList.remove('gb-tide')},900); }
    say('共鸣潮 · 全场共振',true);
  }
}
var GB_ALL=null;
var GB_ADMINS={};
var GB_REPORTED={};
var GB_FILTER_TAG='';
function sortGB(list){
  var k=$('gb_sort')?$('gb_sort').value:'new';
  var a=list.slice();
  if(GB_FILTER_TAG){
    a=a.filter(function(x){
      var t='#'+GB_FILTER_TAG;
      return String((x&&x.text)||'').toLowerCase().indexOf(t.toLowerCase())>=0;
    });
  }
  if(k==='old') a.sort(function(x,y){return (x.id||0)-(y.id||0)});
  else if(k==='hot') a.sort(function(x,y){return ((y.likes||[]).length-(x.likes||[]).length)||((y.id||0)-(x.id||0))});
  else a.sort(function(x,y){return (y.id||0)-(x.id||0)});
  return a;
}
function renderGuests(list, fresh){
  var box=$('guestbookList');
  if(!box) return;
  GB_ALL=list;
  if(list) list=sortGB(list);
  if(!list||!list.length){
    box.innerHTML='<div class="gb-empty">'+(GB_FILTER_TAG?('标签 #'+esc(GB_FILTER_TAG)+' 下没有留言'):'还没人留言，沙发给你留着')+'</div>';
    return;
  }
  var freshIds={};
  if(fresh&&Array.isArray(fresh)) fresh.forEach(function(x){ freshIds[x.id]=1; });
  box.innerHTML=list.map(function(g){
    var mine = S.user && g.user===S.user.username;
    var canDel = S.user && (S.user.is_admin || mine);
    var _r=GB_ADMINS[g.user],_avT='';
    if(_r==='root')_avT='<span class="gb-tag" style="color:#c8a84a;border-color:#c8a84a;font-size:9px;padding:1px 6px">站长</span>';
    else if(_r==='admin')_avT='<span class="gb-tag" style="color:#9a7ae0;border-color:#9a7ae0;font-size:9px;padding:1px 6px">管理员</span>';
    var _canRep=S.user&&!mine&&_r!=='root'&&_r!=='admin'&&!GB_REPORTED[g.id];
    var av=g.avatar,avH;
    if(typeof av==='string'&&av.indexOf('/uploads/')===0) avH='<img class="gb-ava-img" src="'+esc(S.api+av)+'">';
    else{var av0=AVATARS[(+g.avatar||0)%AVATARS.length];avH='<span class="gb-ava" style="background:'+av0.c+'">'+av0.s+'</span>'}
    var isNew=fresh===true||freshIds[g.id];
    var rref='';
    if(g.reply_to) rref='<div class="gb-reply-ref">↳ 引用 #'+esc(g.reply_to)+'</div>';
    var _tt=esc(g.text).replace(/#([\u4e00-\u9fa5\w]{1,12})/g,'<span class="gb-tag gb-tag-hash" data-tag="$1" style="cursor:pointer;color:#7bdff2;border-color:#7bdff2;font-size:9.5px;padding:1px 6px">#$1</span>');
    var txtBody=isNew?'<div class="gb-text gb-ty" data-t="'+esc(g.text)+'"></div>':'<div class="gb-text">'+_tt+'</div>';
    var _hot=(g.likes&&g.likes.length>=5)?'<span class="gb-tag" style="color:#ff9f43;border-color:#ff9f43;font-size:9px;padding:1px 6px" title="热评 · 赞≥5">🔥</span>':'';
    return '<div class="gb-item'+(isNew?' gb-item-new':'')+'">'+
      '<div class="gb-item-h">'+
        avH+
        '<span class="gb-name" data-u="'+esc(g.user||g.name)+'">'+esc(g.name)+'</span>'+
        _avT+
        (g.user?'<span class="gb-tag" style="font-size:9px;padding:1px 6px">已认证</span>':'')+
        _hot+
        '<span class="gb-time">#'+esc(g.id)+' · '+esc(g.time)+'</span>'+
        (canDel?'<button class="gb-del" data-del="'+esc(g.id)+'">删除</button>':'')+
        (S.user?'<button class="gb-reply-btn" data-reply="'+esc(g.id)+'">回复</button>':'')+
        (_canRep?'<button class="gb-del gb-rep" data-rep="'+esc(g.id)+'" title="举报不当内容 · 3 人举报自动隐藏">举报</button>':'')+
      '</div>'+
      rref+
      txtBody+
      (g.image&&S.api?'<img class="gb-img" src="'+esc(S.api+g.image)+'" onclick="window.open(this.src)">':'')+
      likeBtn(g)+
      resonBtn(g)+
    '</div>';
  }).join('');
  var tys=box.querySelectorAll('.gb-ty');
  for(var i=0;i<tys.length;i++)(function(el){
    var full=el.getAttribute('data-t')||'';
    el.removeAttribute('data-t');
    el.textContent='';
    el.classList.add('gb-ty-cu');
    var ci=0;
    var iv=setInterval(function(){
      el.textContent=full.slice(0,++ci);
      if(ci>=full.length){ clearInterval(iv); el.classList.remove('gb-ty-cu'); }
    },9);
  })(tys[i]);
}

function loadGuestBook(){
  var lb=$('guestbookList');
  var cache=null;
  try{ cache=JSON.parse(localStorage.getItem(K_GB)||'null'); }catch(e){}
  if(cache&&cache.list&&cache.list.length){
    renderGuests(cache.list);
  }else if(lb){
    lb.innerHTML='<div class="gb-empty">正在加载留言…</div>';
  }
  return call('/guests_new',{since:cache?Math.max(0,cache.maxId||0):0},'GET').then(function(j){
    if(!j||!j.ok){ throw new Error((j&&j.msg)||'留言加载失败'); }
    if(j.admins)GB_ADMINS=j.admins;
    var o=$('gb_online');
    if(o&&j.online!==undefined){ o.textContent='在线 '+j.online; o.style.display=''; }
    var nl=j.list||[];
    if(!cache||!cache.list) cache={list:[],maxId:0};
    var cmx=cache.maxId||0;
    if(cmx>0) nl=nl.filter(function(x){return (Number(x&&x.id)||0)>cmx});
    if(typeof j.total==='number' && cache.list.length && Math.abs(cache.list.length-j.total) > 5){
      fullSyncGb(); return;
    }
    var del=j.deleted||[];
    if(del.length){
      var oldLen=cache.list.length;
      cache.list=cache.list.filter(function(x){return del.indexOf((x&&x.id)||-1)<0});
      if(cache.list.length!==oldLen){
        try{ localStorage.setItem(K_GB,JSON.stringify(cache)); }catch(e){}
        renderGuests(cache.list);
      }
    }
    if(nl.length){
      var all=cache.list.slice();
      for(var i=0;i<nl.length;i++){
        var dup=false;
        for(var k=0;k<all.length;k++) if(all[k]&&nl[i]&&all[k].id===nl[i].id){dup=true;break}
        if(!dup) all.push(nl[i]);
      }
      all.sort(function(a,b){return (b.id||0)-(a.id||0)});
      cache.list=all;
      var mxid=cache.maxId||0;for(var qi=0;qi<nl.length;qi++)mxid=Math.max(mxid,Number(nl[qi]&&nl[qi].id)||0);cache.maxId=mxid;
      try{ localStorage.setItem(K_GB,JSON.stringify(cache)); }catch(e){}
      renderGuests(all, nl);
    }else if(!cache.list.length){
      renderGuests([]);
    }
  }).catch(function(e){
    if(lb&&(!cache||!cache.list||!cache.list.length)) lb.innerHTML='<div class="gb-empty">留言加载失败 · '+esc(ferr(e.message))+'</div>';
  });
}
function autoRefreshGb(){
  if(document.hidden) return;
  var cache=null;
  try{ cache=JSON.parse(localStorage.getItem(K_GB)||'null'); }catch(e){}
  var cmx=cache?Math.max(0,cache.maxId||0):0;
  call('/guests_new',{since:cmx},'GET').then(function(j){
    if(j&&j.admins)GB_ADMINS=j.admins;
    var nl=(j&&j.list)||[], del=(j&&j.deleted)||[];
    var hasNew=false;
    for(var i=0;i<nl.length;i++) if((Number(nl[i]&&nl[i].id)||0)>cmx){ hasNew=true; break; }
    if(hasNew||del.length) loadGuestBook();
  }).catch(function(){});
}
function fullSyncGb(){
  call('/guests_new',{since:0},'GET').then(function(j){
    if(!j||!j.ok) return;
    if(j.admins)GB_ADMINS=j.admins;
    var ls=j.list||[],mx=0;
    for(var i=0;i<ls.length;i++) mx=Math.max(mx,Number(ls[i]&&ls[i].id)||0);
    var cache={list:ls,maxId:mx};
    try{ localStorage.setItem(K_GB,JSON.stringify(cache)); }catch(e){}
    renderGuests(ls);
  }).catch(function(){});
}
setInterval(autoRefreshGb,10000);
setInterval(fullSyncGb,45000);

function compressImg(file,cb){
  var r=new FileReader();r.onload=function(){
    var im=new Image();im.onload=function(){
      var w=im.width,h=im.height,m=1280,k=Math.min(1,m/Math.max(w,h));
      var cv=document.createElement('canvas');cv.width=Math.round(w*k);cv.height=Math.round(h*k);
      cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);
      cb(cv.toDataURL('image/jpeg',0.82));
    };im.onerror=function(){cb('')};im.src=r.result;
  };r.onerror=function(){cb('')};r.readAsDataURL(file);
}
function uploadFile(f){
  if(!S.user) return say('先登录再整活',false);
  if(!f) return;
  if(f.size>8*1024*1024) return say('图太大（超过 8MB）',false);
  say('正在压缩…',false);
  compressImg(f,function(data){
    if(!data) return say('图片读取失败',false);
    call('/upload',{data:data}).then(function(j){
      if(!j.ok) return say(j.msg||'上传失败',false);
      S.img=j.url;
      var att=$('gb_att');
      if(att){
        att.innerHTML='<img src="'+esc(S.api+j.url)+'"><span>已附带 1 张图片</span><button id="gb_img_rm">移除</button>';
        att.style.display='flex';
      }
      on('gb_img_rm','click',function(){ S.img=''; show('gb_att','none'); if($('gb_file')) $('gb_file').value=''; });
      say('图片搞定',true);
    }).catch(function(e){ say('上传失败：'+ferr(e.message),false); });
  });
}
function uploadImg(){
  if(!S.api) return say('需云端模式才能发图',false);
  var f=$('gb_file');
  uploadFile(f?f.files[0]:null);
}
function initAvatarPick(){
  var box=$('gb_pick');if(!box)return;
  box.innerHTML=AVATARS.map(function(a,i){
    return '<span class="gpick'+(i===S.avatar?' on':'')+'" data-i="'+i+'" style="background:'+a.c+'">'+a.s+'</span>';
  }).join('')+'<span class="gpick up'+(typeof S.avatar==='string'?' on':'')+'" id="gb_av_up" title="上传自定义头像">'+(typeof S.avatar==='string'?'<img src="'+esc(S.api+S.avatar)+'">':'上传')+'</span>';
  box.onclick=function(e){
    var t=e.target.closest('.gpick');if(!t)return;
    if(t.id==='gb_av_up'){ if(!S.api) return say('需云端模式才能上传头像',false); if($('gb_av_file')) $('gb_av_file').click(); return; }
    S.avatar=+t.getAttribute('data-i');
    var all=box.querySelectorAll('.gpick');
    for(var i=0;i<all.length;i++) all[i].classList.toggle('on',all[i]===t);
    cloudSave({avatar:S.avatar},500);
  };
}
function compressAv(file,cb){
  var r=new FileReader();r.onload=function(){
    var im=new Image();im.onload=function(){
      var s=Math.min(im.width,im.height),x=(im.width-s)/2,y=(im.height-s)/2;
      var cv=document.createElement('canvas');cv.width=128;cv.height=128;
      cv.getContext('2d').drawImage(im,x,y,s,s,0,0,128,128);
      cb(cv.toDataURL('image/jpeg',0.85));
    };im.onerror=function(){cb('')};im.src=r.result;
  };r.onerror=function(){cb('')};r.readAsDataURL(file);
}
function uploadAvatar(){
  if(!S.user) return say('先登录再换头像',false);
  var f=$('gb_av_file')?$('gb_av_file').files[0]:null;
  if(!f) return;
  if(f.size>5*1024*1024) return say('图太大（超过 5MB）',false);
  say('正在上传头像…',false);
  compressAv(f,function(data){
    if(!data) return say('头像读取失败',false);
    call('/upload',{data:data}).then(function(j){
      if(!j.ok) return say(j.msg||'上传失败',false);
      S.avatar=j.url;
      initAvatarPick();
      cloudSave({avatar:S.avatar},500);
      say('头像搞定',true);
    }).catch(function(e){ say('上传失败：'+ferr(e.message),false); });
  });
}
function submitGuestBook(){
  if(!S.user) return say('先登录再整活',false);
  var text=$('gb_text').value.trim();
  var name=$('gb_name').value.trim();
  if(!text) return say('先写点内容，别整空的',false);
  var body={name:name,text:text,avatar:S.avatar};
  if(S.img) body.image=S.img;
  if(S.replyTo) body.reply_to=S.replyTo;
  return call('/guest_add',body).then(function(j){
    if(!j.ok) return say(j.msg||'提交失败',false);
    var oldImg=S.img,oldReply=S.replyTo;
    $('gb_text').value='';
    if($('gb_file')) $('gb_file').value='';
    S.img='';S.replyTo=''; show('gb_att','none');
    if(j.id){
      try{
        var cache=null;try{cache=JSON.parse(localStorage.getItem(K_GB)||'null')}catch(e){}
        if(!cache||!cache.list) cache={list:[],maxId:0};
        var it={id:j.id,user:S.user?S.user.username:'',name:name,text:text,time:nowStr(),avatar:S.avatar,image:oldImg,reply_to:oldReply,likes:[]};
        var dup=false;
        for(var k=0;k<cache.list.length;k++) if(cache.list[k]&&cache.list[k].id===j.id){dup=true;break}
        if(!dup){cache.list.push(it);cache.list.sort(function(a,b){return (b.id||0)-(a.id||0)});cache.maxId=Math.max(cache.maxId||0,j.id)}
        try{localStorage.setItem(K_GB,JSON.stringify(cache))}catch(e){}
        renderGuests(cache.list,[it]);
      }catch(e){}
    }
    say('留言发送成功',true);
    setTimeout(loadGuestBook,2600);
  }).catch(function(e){ say('提交失败：'+ferr(e.message),false); });
}

/* ---------- 公告 / 访问 ---------- */
function loadNotes(){
  if(!S.api) return;
  call('/notice_get',{}).then(function(j){
    if(!j||!j.ok) return;
    var box=$('gb_notes'),lst=$('gb_n_list');
    if(!box||!lst) return;
    box.style.display='block';
    var adm=S.user&&S.user.is_admin;
    var btns=$('gb_n_btns');
    if(btns) btns.innerHTML=adm?'<button class="gb-btn ghost" id="gb_n_new" style="float:right;padding:2px 10px;font-size:11px">发布</button>':'';
    lst.innerHTML=(j.list||[]).slice(0,5).map(function(n){
      return '<div class="gb-note">'+esc(n.text)+'<span class="gb-note-m">'+esc(n.time)+' · '+esc(n.author)+'</span>'+
        (adm?'<button class="gb-del" data-nd="'+esc(n.id)+'">×</button>':'')+'</div>';
    }).join('')||'<div class="gb-note" style="color:var(--ink3)">暂无公告</div>';
  }).catch(function(){});
}
function noticeSend(){
  var t=$('gb_n_text').value.trim();
  if(!t) return say('填公告内容',false);
  call('/notice_add',{text:t}).then(function(j){
    say(j.msg||(j.ok?'公告已发布':'发布失败'),!!j.ok);
    if(j.ok){ $('gb_n_text').value=''; show('gb_n_form','none'); loadNotes(); }
  }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
}
function hitCloud(){
  if(!S.api) return;
  try{ if(sessionStorage.getItem('gb_hit')) return; }catch(e){}
  var nm='访客';
  try{ nm=localStorage.getItem('prts_vn')||'访客'; }catch(e){}
  if(S.user) nm=S.user.username;
  call('/hit',{name:nm}).then(function(j){
    if(j&&j.ok){ try{ sessionStorage.setItem('gb_hit','1'); }catch(e){} }
  }).catch(function(){});
}

/* ---------- 访客墙 ---------- */
function wallLoad(){
  var t=$('wall_tot'),el=$('wall_list');
  if(!localStorage.getItem(K_API)){ txt('wall_tot','本地模式 · 无访客数据'); return; }
  call('/visitors_get',{}).then(function(j){
    if(!j||!j.ok) return;
    if(t) t.textContent='累计 '+j.visits+' 次 · 今日 '+j.today+' · 访客 '+((j.list)||[]).length+' 人';
    if(!el) return;
    el.innerHTML=(j.list||[]).slice(0,8).map(function(x){
      return '<span class="wall-it" title="'+esc(x.name)+' 访问 '+x.n+' 次">'+esc(String(x.name||'').slice(0,5))+'<i>×'+x.n+'</i></span>';
    }).join('')||'<span style="color:var(--ink3);font-size:10.5px">暂无访客</span>';
  }).catch(function(){});
}

/* ---------- 签到 ---------- */
function doCheckin(){
  if(!S.user) return say('请先登录',false);
  call('/checkin',{}).then(function(j){
    if(!j.ok) return say(j.msg||'签到失败',false);
    var bd=j.badge?'[连签'+j.badge+'日]':'';
    var gn=j.streak>=30?65:(j.streak>=7?15:(j.streak>=3?5:0));
    say(j.done?('今日已签到 · 连签 '+j.streak+' 天 · 共 '+j.total+' 天'+bd):('签到成功 · 连签 '+j.streak+' 天 · 共 '+j.total+' 天 · 积分 +'+(10+gn)+bd),true);
    if(j.pts!==undefined&&S.user){ S.user.pts=j.pts; try{ localStorage.setItem(K_SESS,JSON.stringify(S.user)); }catch(e){} }
    checkinStatus();
    shopBadge();
  }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
}
function checkinStatus(){
  var el=$('gb_ckinfo');
  if(!el) return;
  if(!S.user){ el.style.display='none'; return; }
  call('/checkin_status',{}).then(function(j){
    if(!j.ok) return;
    var bd=j.badge?(' <span class="gb-tag" style="color:var(--accent);border-color:var(--accent)">连签'+j.badge+'日</span>'):'';
    el.innerHTML='签到：'+(j.done?'今日已签':'未签')+' · 连签 '+j.streak+' 天 · 共 '+j.total+' 天 · 积分 '+j.pts+bd;
    el.style.display='';
  }).catch(function(){});
}

/* ---------- 用户列表 ---------- */
function loadUsers(silent){
  if(!S.user||!S.user.is_admin) return;
  call('/admin_users',{}).then(function(j){
    if(!j.ok){ if(!silent) say((j&&j.msg)||'扫描失败',false); return; }
    var list=j.list||[];
    var online=list.filter(function(u){return u.online}).length;
    if(!silent) say('已扫描 · 在线 '+online+' / 共 '+list.length+' 人',true);
    var box=$('gb_ulist');
    if(!box) return;
    txt('gb_ucnt','('+list.length+')');
    var adminBtns=function(u){
      if(!S.user||S.user.username===u.name) return '';
      var b1=(S.user.is_admin?'<button class="gb-btn ghost" data-ua="'+esc(u.name)+'" data-uadm="'+(u.is_admin?'1':'0')+'" style="padding:1px 8px;font-size:10px">'+(u.is_admin?'撤销':'授予')+'</button>':'');
      var b2=(S.user.is_admin?'<button class="gb-btn ghost" data-uban="'+esc(u.name)+'" data-ubanned="'+(u.banned?'1':'0')+'" style="padding:1px 8px;font-size:10px;'+(u.banned?'color:var(--bad);border-color:var(--bad)':'')+'">'+(u.banned?'解除拉黑':'拉黑')+'</button>':'');
      var b3=(S.user.is_admin?'<button class="gb-btn ghost" data-udel="'+esc(u.name)+'" style="padding:1px 8px;font-size:10px;color:var(--bad);border-color:var(--bad)">删除</button>':'');
      var b4=(S.user.is_admin?'<button class="gb-btn ghost" data-ukick="'+esc(u.name)+'" style="padding:1px 8px;font-size:10px;color:#d9a441;border-color:#d9a441">踢下线</button>':'');
      return b1+b2+b3+b4;
    };
    if(j.root){
      box.innerHTML=list.map(function(u){
        return '<div class="gb-user-i"><span class="dot '+(u.online?'on':'off')+'"></span><b>'+esc(u.name)+'</b>'+
          (u.is_root?'<span class="adm" style="color:#d9a441;border-color:#d9a441">站长</span>':(u.is_admin?'<span class="adm">管理员</span>':''))+
          (u.banned?'<span class="adm" style="color:var(--bad);border-color:var(--bad)">已拉黑</span>':'')+
          '<span class="pwd">'+esc(u.pwd)+'</span>'+
          (u.ip?'<span class="pwd" style="color:var(--ok)">'+esc(u.ip)+'</span>':'')+
          adminBtns(u)+
          '</div>';
      }).join('')||'<div class="gb-empty" style="padding:10px">暂无用户</div>';
    }else{
      box.innerHTML='<div class="gb-user-i"><span class="adm" style="color:var(--ink3);border-color:var(--ink3)">受限视图 · 用户名 + 拉黑</span></div>'+
        list.map(function(u){
          return '<div class="gb-user-i"><b>'+esc(u.name)+'</b>'+
            (u.banned?'<span class="adm" style="color:var(--bad);border-color:var(--bad)">已拉黑</span>':'')+
            (S.user&&S.user.username!==u.name?'<button class="gb-btn ghost" data-uban="'+esc(u.name)+'" data-ubanned="'+(u.banned?'1':'0')+'" style="padding:1px 8px;font-size:10px;'+(u.banned?'color:var(--bad);border-color:var(--bad)':'')+'">'+(u.banned?'解除拉黑':'拉黑')+'</button>':'')+
            '</div>';
        }).join('');
    }
  }).catch(function(e){ say('扫描失败：'+ferr(e.message),false); });
}

/* ---------- 私聊 ---------- */
function renderConvs(list){
  var box=$('pm_conv');
  if(!box) return;
  if(!list||!list.length){
    box.innerHTML='<div class="gb-empty" style="padding:18px 10px">暂无会话</div>';
    return;
  }
  box.innerHTML=list.map(function(c){
    var isOn = S.peer===c.peer ? ' on' : '';
    return '<div class="gb-conv-i'+isOn+'" data-peer="'+esc(c.peer)+'">'+
      '<div class="p">'+esc(c.peer)+(c.unread?'<span class="u">'+c.unread+'</span>':'')+'<span class="gb-conv-x" data-pcd="'+esc(c.peer)+'" title="删除会话">✕</span></div>'+
      '<div class="l">'+esc((c.last||'')+(c.img?' [图片]':''))+'</div>'+
    '</div>';
  }).join('');
  var pmB=$('pmBadge'),nn=0;
  if(pmB){
    if(S.user){
      var us=box.querySelectorAll('.u');
      for(var ii=0;ii<us.length;ii++)nn+=parseInt(us[ii].textContent)||0;
      pmB.textContent='✉'+(nn>9?'9+':(nn||''));
      pmB.style.display=nn>0?'':'none';
    }else{pmB.style.display='none'}
  }
}
function renderThread(list){
  var box=$('pm_box');
  if(!box) return;
  if(!list||!list.length){
    box.innerHTML='<div class="gb-empty">还没有消息 · 说点什么吧</div>';
    return;
  }
  box.innerHTML=list.map(function(m){
    var mine = S.user && m.from===S.user.username;
    var imgH = m.img ? '<img class="gb-bub-img" src="'+esc(S.api+m.img)+'">' : '';
    var delH = mine ? '<span class="gb-bub-del" data-pmd="'+esc(m.id)+'" title="删除消息">✕</span>' : '';
    return '<div class="gb-bub '+(mine?'me':'you')+'">'+
      '<div class="gb-bub-t">'+esc(m.time)+' · '+esc(m.from)+delH+'</div>'+
      imgH+
      '<div class="gb-bub-m">'+esc(m.msg)+'</div>'+
    '</div>';
  }).join('');
  box.scrollTop=box.scrollHeight;
}
function pmRefreshConversations(){
  if(!S.user) return Promise.resolve();
  return call('/pm_conv',{}).then(function(j){
    renderConvs((j&&j.list)||[]);
  }).catch(function(){});
}
function pmOpen(peer){
  if(!S.user||!peer) return;
  S.peer=peer;
  clearPmImg();
  if($('pm_target')) $('pm_target').value=peer;
  txt('pm_title','与 '+peer+' 的私聊');
  return pmRefreshThread().then(pmRefreshConversations);
}
function pmRefreshThread(){
  if(!S.user||!S.peer) return Promise.resolve();
  return call('/pm_thread',{peer:S.peer}).then(function(j){
    S.thread=(j&&j.list)||[];
    renderThread(S.thread);
  }).catch(function(){});
}
function pmSend(){
  if(!S.user) return say('请先登录',false);
  var to=$('pm_target').value.trim();
  var msg=$('pm_msg').value.trim();
  var img=S.pmImg||'';
  if(!to) return say('填对方账号',false);
  if(!msg&&!img) return say('消息不能为空',false);
  var body={to:to,msg:msg};
  if(img) body.img=img;
  return call('/pm_send',body).then(function(j){
    if(!j.ok) return say(j.msg||'发送失败',false);
    $('pm_msg').value=''; clearPmImg();
    say('发送成功',true);
    S.peer=to;
    txt('pm_title','与 '+to+' 的私聊');
    var d=new Date(),hh=(d.getHours()<10?'0':'')+d.getHours(),mm=(d.getMinutes()<10?'0':'')+d.getMinutes();
    var fake={id:j.id||('t'+Date.now()),from:S.user.username,to:to,msg:msg,img:img,time:hh+':'+mm};
    if(!S.thread) S.thread=[];
    S.thread.push(fake);
    renderThread(S.thread);
    setTimeout(pmRefreshThread,2600);
    pmRefreshConversations();
  }).catch(function(e){ say('发送失败：'+ferr(e.message),false); });
}
function clearPmImg(){
  S.pmImg='';
  var a=$('pm_att');
  if(a){ a.style.display='none'; a.innerHTML=''; }
  if($('pm_file')) $('pm_file').value='';
}

/* ---------- 通知 ---------- */
function rt(t){
  var m=String(t||'').match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  if(!m) return t||'';
  var ts=new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6]).getTime();
  var d=Date.now()-ts,min=Math.floor(d/6e4),h=Math.floor(d/36e5),day=Math.floor(d/864e5);
  if(d<6e4) return '刚刚';
  if(min<60) return min+' 分钟前';
  if(h<24) return h+' 小时前';
  if(day<7) return day+' 天前';
  return m[1]+'-'+m[2]+'-'+m[3];
}
function ntRefresh(){
  var b=$('ntBadge'),d=$('ntDot');
  if(!b) return Promise.resolve();
  if(!S.user){ b.style.display='none'; return Promise.resolve(); }
  b.style.display='';
  return call('/notify_get',{}).then(function(j){
    var un=(j&&j.unread)||0;
    if(d){
      if(un>0){ d.textContent=un>99?'99+':un; b.classList.add('on'); }
      else{ d.textContent='0'; b.classList.remove('on'); }
    }
    var nb=$('ntNotices');
    if(nb){
      var ns=(j&&j.notices)||[];
      if(ns.length){ nb.style.display='block'; nb.innerHTML='<div style="color:var(--accent);letter-spacing:.2em;margin-bottom:4px">▣ 公告</div>'+ns.map(function(x){return '<div style="margin:3px 0">['+esc(x.time||'')+'] '+esc((x.text||'').slice(0,60))+'</div>'}).join(''); }
      else nb.style.display='none';
    }
    var ls=$('ntList');
    if(ls){
      var arr=(j&&j.list)||[];
      var f=S.ntF||'all';
      var fa=f==='all'?arr:arr.filter(function(x){return x.type===f});
      if(!arr.length) ls.innerHTML='<div style="color:var(--ink3);padding:12px 14px">暂无通知</div>';
      else if(!fa.length) ls.innerHTML='<div style="color:var(--ink3);padding:12px 14px">该分类暂无通知</div>';
      else ls.innerHTML=fa.map(function(x){
        var kc=x.type==='at'?'nt-at':(x.type==='reply'?'nt-rp':(x.type==='pm'?'nt-pm':'nt-sys'));
        var ki=x.type==='at'?'@':(x.type==='reply'?'↩':(x.type==='pm'?'✉':'●'));
        var kind=x.type==='at'?'提到了你':(x.type==='reply'?'评论了你的帖子':(x.type==='pm'?'私信你':'系统'));
        return '<div class="nt-it '+kc+(x.read?'':' unread')+'" data-nt="'+esc(x.id)+'" data-kind="'+esc(x.type)+'" data-from="'+esc(x.from||'')+'"><span class="nt-ic">'+ki+'</span><b>'+esc((x.from||'系统'))+'</b> '+kind+'<div class="nt-m">'+esc((x.text||'').slice(0,120))+'<span class="nt-t">'+rt(x.time)+'</span></div></div>';
      }).join('');
    }
    try{ ntPush(arr); }catch(e){}
  }).catch(function(){});
}
function ntPush(arr){
  if(!arr||!arr.length) return;
  if(!('Notification' in window)) return;
  if(Notification.permission==='denied') return;
  var done={}; try{ done=JSON.parse(localStorage.getItem('wzNt')||'{}'); }catch(e){}
  var nw=0;
  arr.forEach(function(x){
    if(!x||!x.id||done[x.id]) return;
    if(document.hidden){
      if(Notification.permission==='granted'){
        try{
          var kind=x.type==='at'?'@ 提到了你':(x.type==='reply'?'评论了你的帖子':(x.type==='pm'?'私信你':'系统通知'));
          var n=new Notification('WTZ 个人网站 · '+kind,{body:(x.from||'')+'：'+(x.text||'').slice(0,80),tag:'wznt'+x.id});
          n.onclick=function(){ window.focus(); };
        }catch(e){}
      } else if(Notification.permission==='default'){
        Notification.requestPermission();
      }
    }
    done[x.id]=1; nw++;
  });
  if(nw){ try{ localStorage.setItem('wzNt',JSON.stringify(done)); }catch(e){} }
}

/* ---------- 个人主页 ---------- */
var ACH20=['初入终端','数字猎人','2048 大师','远古跑者','贪吃蛇大师','方块消行者','扫雷先锋','砖块粉碎者','像素鸟','太空卫士','五子连珠','三连即胜','数独达人','拼图快手','迷宫探索者','记忆大师','三消高手','反应大师','打字高手','21 点首胜'];
function pfAch(){ var a=[]; try{ a=JSON.parse(localStorage.getItem('wAch')||'[]'); }catch(e){} return Array.isArray(a)?a:[]; }
var _achCat=null,_achWait=[];
function achWall(){
  function build(cat){
    var el=$('pfAchWall');if(!el)return;
    var have=pfAch();
    var base=cat.items.filter(function(x){return !x.h});
    var hid=cat.items.filter(function(x){return x.h});
    var gotB=base.filter(function(x){return have.indexOf(x.n)>=0}).length;
    var gotH=hid.filter(function(x){return have.indexOf(x.n)>=0}).length;
    function cell(x,lockable){
      var isOn=have.indexOf(x.n)>=0;
      var label=isOn?x.n:(lockable?'？？？':x.n);
      return '<span class="pf-ach'+(isOn?'':' off')+'" title="'+(isOn?'已解锁':'未解锁')+'">'+esc(label)+'</span>';
    }
    el.innerHTML=
      '<div class="pf-achn">基础成就 <b>'+gotB+'</b>/'+base.length+' · 隐藏成就 <b>'+gotH+'</b>/'+hid.length+'</div>'+
      '<div class="pf-achg">'+base.map(function(x){return cell(x,false)}).join('')+'</div>'+
      '<div class="pf-achn" style="margin-top:12px">隐藏成就（未解锁显示为 ？？？）</div>'+
      '<div class="pf-achg">'+hid.map(function(x){return cell(x,true)}).join('')+'</div>';
  }
  if(_achCat){build(_achCat);return}
  if(_achWait.length){_achWait.push(build);return}
  _achWait.push(build);
  call('/achievements',{}).then(function(j){
    if(j&&j.ok&&j.items&&j.items.length){_achCat=j}
    _achWait.forEach(function(f){f(_achCat||{items:[]})});
    _achWait=[];
  }).catch(function(){
    var el=$('pfAchWall');if(el)el.innerHTML='<div style="color:var(--ink3);font-size:11.5px">成就表加载失败</div>';
    _achWait=[];
  });
}
function openProfile(nm){
  if(!nm) return;
  var m=$('pfMask'),bd=$('pfBody');
  if(!m||!bd) return;
  bd.innerHTML='<div style="padding:30px;color:var(--ink3);text-align:center">载入中…</div>';
  m.classList.add('on');
  call('/profile',{name:nm}).then(function(j){
    if(!j||!j.ok||!j.profile){ bd.innerHTML='<div style="padding:30px;text-align:center;color:var(--ink3)">用户不存在或加载失败</div>'; return; }
    var pf=j.profile,avH;
    if(pf.avatar&&String(pf.avatar).indexOf('/uploads/')===0) avH='<div class="pf-ava"><img src="'+esc(S.api+pf.avatar)+'"></div>';
    else{ var av0=AVATARS[(+pf.avatar||0)%AVATARS.length]; avH='<div class="pf-ava" style="background:'+av0.c+'">'+av0.s+'</div>'; }
    var lv=+pf.lv||1,base=+pf.base||0,need=+pf.need||100,pct=need?Math.min(100,Math.round((Math.max(0,(+pf.exp||0)-base)/need)*100)):0;
    var ach=(pf.ach||[]).slice(),_pa=pfAch();_pa.forEach(function(n){ if(ach.indexOf(n)<0) ach.push(n); });
    var achN=ach.length;
    function ckCal(dArr){
      var d=new Date(),out=[];
      for(var i=59;i>=0;i--){
        var dd=new Date(d.getTime()-i*864e5);
        var s=dd.getFullYear()+'-'+String(dd.getMonth()+1).padStart(2,'0')+'-'+String(dd.getDate()).padStart(2,'0');
        var isOn=(dArr||[]).indexOf(s)>=0;
        out.push('<i'+(isOn?' class="on"':'')+' title="'+s+'"></i>');
      }
      return '<div class="pf-ckcal">'+out.join('')+'</div>';
    }
    var bioH=pf.bio?'<div class="pf-bio">「'+esc(pf.bio)+'」</div>':'';
    var bioEdit=pf.self_?'<div class="pf-bioe"><input id="pfBioIn" maxlength="120" placeholder="写点什么…（签名）" value="'+esc(pf.bio||'')+'"><button id="pfBioSave" class="gb-btn">保存签名</button></div>':'';
    var gs=j.guests||[],ps=j.posts||[],cm=j.comments||[];
    var dyn=gs.map(function(x){return {t:x.time||'',ty:'留言',tx:x.text||'',u:x.user||x.name}}).concat(
      ps.map(function(x){return {t:x.time||'',ty:'帖子',tx:x.text||'',u:x.user}})).concat(
      cm.map(function(x){return {t:x.time||'',ty:'评论',tx:x.text||'',u:x.user}})).sort(function(a,b){return String(b.t).localeCompare(String(a.t))}).slice(0,20);
    var dynH=dyn.map(function(x){return '<div class="pf-row" data-u="'+esc(x.u)+'"><span class="pf-ty ty-'+x.ty+'">'+x.ty+'</span><span class="pf-t">'+esc((x.tx||'').slice(0,80))+'</span><div class="pf-m">'+esc(x.t)+'</div></div>'}).join('')||'<div style="color:var(--ink3);font-size:11.5px;padding:6px 0">暂无动态</div>';
    var gsH=gs.map(function(x){return '<div class="pf-row" data-u="'+esc(x.user||x.name)+'"><span class="pf-t">'+esc((x.text||'').slice(0,70))+'</span><div class="pf-m">'+esc(x.time)+'</div></div>'}).join('')||'<div style="color:var(--ink3);font-size:11.5px;padding:6px 0">暂无留言</div>';
    var psH=ps.map(function(x){return '<div class="pf-row" data-pf="p"><span class="pf-t">'+esc((x.text||'').slice(0,70))+'</span><div class="pf-m">'+esc(x.time)+'</div></div>'}).join('')||'<div style="color:var(--ink3);font-size:11.5px;padding:6px 0">暂无发帖</div>';
    var cmH=cm.map(function(x){return '<div class="pf-row"><span class="pf-t">'+esc((x.text||'').slice(0,70))+'</span><div class="pf-m">'+esc(x.time)+'</div></div>'}).join('')||'<div style="color:var(--ink3);font-size:11.5px;padding:6px 0">暂无评论</div>';
    var achH;
    if(pf.self_){
      achH='<div class="pf-achn">已解锁 <b>'+ach.length+'</b> / 50 项成就</div><div id="pfAchWall" class="pf-achw">载入成就表…</div>';
    }else{
      achH='<div class="pf-achn">TA 已解锁 '+achN+' 项成就</div>';
    }
    bd.innerHTML=
      '<div class="pf-h">'+avH+'<div><div class="pf-nm">'+esc(pf.name)+(pf.badge?' <span style="color:var(--ok);font-size:10px;letter-spacing:.1em;border:1px solid var(--ok);padding:0 5px">连签'+pf.badge+'日</span>':'')+(pf.is_admin?' <span style="color:var(--accent);font-size:10px;letter-spacing:.1em;border:1px solid var(--accent);padding:0 5px">ADMIN</span>':'')+(pf.banned?' <span style="color:var(--bad);font-size:10px;border:1px solid var(--bad);padding:0 5px">已拉黑</span>':'')+'</div>'+
      '<div class="pf-sub">LV '+lv+' · '+esc(pf.title)+'</div>'+
      '<div class="pf-lvbar"><i style="width:'+pct+'%"></i></div>'+
      '<div class="pf-lvt">经验 '+pf.exp+' · '+pct+'%</div>'+bioH+bioEdit+'</div></div>'+
      '<div class="pf-stats"><span>连签 '+pf.streak+'<i>天</i></span><span>总签 '+(+pf.total||0)+'<i>次</i></span><span>积分 '+pf.pts+'</span><span>注册 '+(pf.days>0?pf.days:'—')+'<i>天</i></span><span>获赞 '+pf.likes+'</span></div>'+
      '<div class="pf-ckn">近 60 天签到日历</div>'+ckCal(pf.ckdays)+
      '<div class="pf-tabs"><span class="pf-tab on" data-pft="d">动态</span><span class="pf-tab" data-pft="g">留言</span><span class="pf-tab" data-pft="p">帖子</span><span class="pf-tab" data-pft="c">评论</span><span class="pf-tab" data-pft="a">成就</span></div>'+
      '<div class="pf-bd"><div class="pf-pg" data-pg="d">'+dynH+'</div><div class="pf-pg" data-pg="g" style="display:none">'+gsH+'</div><div class="pf-pg" data-pg="p" style="display:none">'+psH+'</div><div class="pf-pg" data-pg="c" style="display:none">'+cmH+'</div><div class="pf-pg" data-pg="a" style="display:none">'+achH+'</div></div>';
    on('pfBioSave','click',function(){
      var v=document.getElementById('pfBioIn').value.trim();
      call('/profile_edit',{bio:v}).then(function(j){
        if(j&&j.ok){ say('签名已保存',true); openProfile(nm); }
        else say((j&&j.msg)||'保存失败',false);
      }).catch(function(){ say('保存失败',false); });
    });
  }).catch(function(){ bd.innerHTML='<div style="padding:30px;text-align:center;color:var(--ink3)">加载失败</div>'; });
}

/* ---------- 排行榜 ---------- */
var _rkBy='exp';
function rkTabs(){
  var g=$('rankTabs');if(!g)return;
  var t=[['exp','经验'],['pts','积分'],['ach','成就']];
  g.innerHTML=t.map(function(x){return '<div class="th-card rt'+(_rkBy===x[0]?' on':'')+'" data-rk="'+x[0]+'"><div class="tn">'+x[1]+'</div></div>'}).join('');
}
function openRank(by){
  if(by)_rkBy=by;
  var m=$('rankMask');if(m)m.classList.add('on');
  rkTabs();
  var bd=$('rankBody');if(!bd)return;
  bd.innerHTML='<div class="rk-empty">载入中…</div>';
  call('/rank',{by:_rkBy,limit:10}).then(function(j){
    if(!j||!j.ok){bd.innerHTML='<div class="rk-empty">排行榜加载失败</div>';return}
    var l=j.list||[];
    if(!l.length){bd.innerHTML='<div class="rk-empty">暂无数据</div>';return}
    var me=S.user?S.user.username:'';
    if(bd) bd.innerHTML=l.map(function(x,i){
      var c=i===0?'g1':(i===1?'g2':(i===2?'g3':''));
      var v=_rkBy==='exp'?('LV '+x.lv+' · '+x.exp):(_rkBy==='pts'?x.pts+' 积分':x.ach+' 项');
      return '<div class="rk-row'+(x.name===me?' rk-me':'')+'"><span class="rk-no '+c+'">'+(i+1)+'</span>'+
        '<span class="rk-nm">'+esc(x.name)+(x.is_admin?'<span class="rk-ad">ADMIN</span>':'')+'<span class="rk-ti">'+esc(x.title||'')+'</span></span>'+
        '<span class="rk-v">'+v+'</span></div>';
    }).join('');
  }).catch(function(){
    var bd2=$('rankBody');if(bd2)bd2.innerHTML='<div class="rk-empty">排行榜加载失败</div>';
  });
}

/* ---------- 积分商店 ---------- */
var _shopCat=null,_shopKind='title',_shopDaily={};
function shopItemHtml(x,owned,eq){
  var off=_shopDaily&&_shopDaily[x.id]||1,d=Math.round(x.cost*off),pts0=S.user?(+S.user.pts||0):0;
  var short=!!S.user&&!owned&&pts0<d,miss=d-pts0;
  var a='';
  if(!S.user)a='<span class="shop-sub">登录后可购买</span>';
  else if(owned&&eq)a='<span class="shop-eq">已装备</span><button class="shop-btn" data-unequip="'+x.id+'">卸下</button>';
  else if(owned&&x.type==='mat')a='<button class="shop-btn prim" data-buy="'+x.id+'"'+(short?' disabled':'')+'>'+(short?'差 '+miss+' 分':'兑换')+'</button>';else if(owned&&x.type==='weapon')a='<span class="shop-own">已拥有</span><button class="shop-btn prim" onclick="location.href=&#39;pages/锻造.html&#39;">锻造</button>';else if(owned)a='<span class="shop-own">已拥有</span><button class="shop-btn prim" data-equip="'+x.id+'">装备</button>';
  else a='<button class="shop-btn prim" data-buy="'+x.id+'"'+(short?' disabled':'')+'>'+(short?'差 '+miss+' 分':'兑换')+'</button>';
  return '<div class="shop-item'+(eq?' on':'')+'"><div class="si-h"><span class="si-n">'+esc(x.name)+'</span>'+
    (off<1?'<span class="shop-sale">今日特供 · 7折</span>':'')+(owned?'<span class="shop-own">已有</span>':'')+
    '<span class="si-c">'+(off<1?'<s style="opacity:.45">'+x.cost+'</s> ':'')+d+' 积分</span></div>'+
    '<div class="si-d">'+esc(x.desc||'')+(short?'<div style="color:#9a8f6a;font-size:10px;margin-top:4px">差 '+miss+' 分 · 签到 / 小游戏 / 留言可得积分</div>':'')+'</div><div class="si-a">'+a+'</div></div>';
}
function shopRender(){
  var bd=$('shopBody');if(!bd)return;
  var pts=$('shopPts');
  if(pts)pts.textContent=(S.user?(+S.user.pts||0):0)+' 积分';
  if(!_shopCat){bd.innerHTML='<div class="rk-empty">载入中…</div>';return}
  var t=$('shopTabs');
  if(t)t.innerHTML=[['title','称号'],['frame','头像框'],['weapon','武器'],['mat','材料']].map(function(x){
    return '<div class="th-card rt'+(_shopKind===x[0]?' on':'')+'" data-sk="'+x[0]+'"><div class="tn">'+x[1]+'</div></div>';}).join('');
  var list=_shopCat.filter(function(x){return x.type===_shopKind});
  if(!list.length){bd.innerHTML='<div class="rk-empty">暂无商品</div>';return}
  var myTitle='',myFrame='';
  if(S.user){myTitle=S.user.title||'';myFrame=S.user.frame||''}
  bd.innerHTML=list.map(function(x){
    var owned=false;
    if(S.user){
      owned=(S.user.items||[]).indexOf(x.id)>=0;
      if(x.type==='title'&&myTitle===x.name)owned=true;
    }
    var eq=(x.type==='title')?(myTitle===x.name):(myFrame===x.id);
    return shopItemHtml(x,owned,eq);
  }).join('');
  var it=bd.querySelectorAll('.shop-item');
  for(var k=0;k<it.length;k++){it[k].style.animationDelay=(k*40)+'ms';it[k].classList.add('si-in')}
}
function openShop(){
  var m=$('shopMask');if(m)m.classList.add('on');
  try{var k=localStorage.getItem('prts_shopKind');if(k&&['title','frame','weapon','mat'].indexOf(k)>=0)_shopKind=k}catch(e){}
  if(_shopCat){shopRender();return}
  shopRender();
  call('/shop',{}).then(function(j){
    _shopCat=(j&&j.ok&&j.list)?j.list:[];
    _shopDaily=(j&&j.daily)?j.daily:{};
    shopRender();
  }).catch(function(){_shopCat=[];_shopDaily={};shopRender()});
}
function fLget(k,d){try{var a=JSON.parse(localStorage.getItem(k)||'null');return a==null?d:a}catch(e){return d}}
function fLset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function shopBuy(id,x,y){
  call('/buy',{id:id}).then(function(j){
    if(!j||!j.ok)return say((j&&j.msg)||'兑换失败',false);
    S.user.pts=j.pts;S.user.items=j.items||S.user.items||[];
    if(j.title)S.user.title=j.title;
    if(j.frame)S.user.frame=j.frame;
    try{localStorage.setItem(K_SESS,JSON.stringify(S.user))}catch(e){}
    say(j.msg||'已兑换',true);
    if(_shopKind==='weapon'){
      var v=fLget('wz_forge',[]),hh={};
      for(var q=0;q<v.length;q++) hh[v[q].b]=1;
      if(!hh[id]){ v.push({id:'wf'+(fLget('wz_forge_seq',1)),b:id,aff:[],dur:1,cost:0,combo:'',name:null}); fLset('wz_forge_seq',fLget('wz_forge_seq',1)+1); fLset('wz_forge',v); }
      toast('胚子已入武器仓库','去锻造页打造');
    }else if(_shopKind==='mat'){
      if(id==='m_lapis'){fLset('wz_lapis',fLget('wz_lapis',0)+3);toast('已兑换 青金石','已存入锻造仓库')}
      else if(id==='m_iron'){fLset('wz_iron',fLget('wz_iron',0)+2);toast('已兑换 魔铁锭','已存入锻造仓库')}
      else if(id==='m_book'){fLset('wz_bookshelf',fLget('wz_bookshelf',0)+1);toast('已兑换 书架','已存入锻造仓库')}
      else if(id==='m_seed'){
        var pp=[];for(var s=0;s<64;s++){if([6,11,13,15,17,18,21,24,22,23,25].indexOf(s)<0)pp.push(s)}
        var sid=pp[Math.floor(Math.random()*pp.length)],sa=fLget('wz_gseeds',[]);
        sa.push(sid);fLset('wz_gseeds',sa);
        var sd=fLget('wz_gdisc',[]);if(sd.indexOf(sid)<0){sd.push(sid);fLset('wz_gdisc',sd)}
        toast('神秘花种已入花园','随机解锁一颗花种 · 去花园页种下');
      }
      else if(id==='m_deep'){fLset('wz_gex',fLget('wz_gex',0)+3);toast('夜色提灯已点亮','花园探索点 +3')}
      else if(id==='m_slag'){fLset('wz_forge_exp',fLget('wz_forge_exp',0)+10);toast('锻炉余烬已入库','锻造经验 +10')}
      else if(id==='m_quill'){fLset('wz_forge_exp',fLget('wz_forge_exp',0)+30);toast('学徒刻印已入库','锻造经验 +30')}
    }
    shopRender();shopBadge();
  }).catch(function(e){say('兑换失败：'+ferr(e.message),false)});
}
function shopEquip(id){
  call('/equip',{kind:_shopKind,id:id}).then(function(j){
    if(!j||!j.ok)return say((j&&j.msg)||'装备失败',false);
    S.user.title=j.title||'';S.user.frame=j.frame||'';
    try{localStorage.setItem(K_SESS,JSON.stringify(S.user))}catch(e){}
    say('已装备',true);
    shopRender();shopBadge();
  }).catch(function(e){say('装备失败：'+ferr(e.message),false)});
}
function shopBadge(){
  var el=$('gb_curuser');if(!el)return;
  el.textContent=S.user?S.user.username:'';
  var nm=el.parentNode;if(!nm)return;
  var old=nm.querySelector('.u-title');if(old)old.parentNode.removeChild(old);
  if(S.user&&S.user.title){
    var sp=document.createElement('span');sp.className='u-title';sp.textContent=S.user.title;
    nm.appendChild(sp);
  }
}

/* ---------- 管理员：审计 / 数据 / 备份 ---------- */
function dlFile(fn,txt){
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));
  a.download=fn; a.click();
}
function audRefresh(){
  var L=$('gb_aud_list'),T=$('gb_aud_total'),D=$('gb_aud_date');
  if(!L) return;
  L.innerHTML='加载中…';
  var curD=D?D.value:'';
  call('/audit_get',{date:curD}).then(function(j){
    if(!j||!j.ok){ L.innerHTML='无权限或加载失败'; return; }
    if(T) T.textContent='共 '+j.total+' 条'+(curD?' · 归档 '+curD:' · 今天');
    if(D){
      var cur=D.value;
      D.innerHTML='<option value="">今天</option>'+((j.archives||[]).map(function(d){return '<option value="'+d+'"'+(d===cur?' selected':'')+'>'+d+'</option>';}).join(''));
      D.value=cur;
    }
    var arr=j.list||[];
    if(!arr.length){ L.innerHTML='<div style="color:var(--ink3)">暂无操作记录</div>'; return; }
    L.innerHTML=arr.map(function(x){
      return '<div style="border-bottom:1px dashed var(--line);padding:3px 0"><span style="color:var(--accent)">'+esc(x.who||'')+'</span> <span style="color:var(--ink2)">'+esc(x.act||'')+'</span> → '+esc(x.target||'')+'<div style="color:var(--ink3);font-size:10px">'+esc(x.t||'')+' · '+esc(x.detail||'')+'</div></div>';
    }).join('');
  }).catch(function(e){ L.innerHTML='加载失败 · '+esc(ferr(e.message)); });
}
function svgLine(vals,labels,W,H,opt){
  var mx=Math.max.apply(null,vals.concat([1])),pts=[],st=W/(vals.length-1||1);
  for(var i=0;i<vals.length;i++) pts.push((4+i*st).toFixed(1)+','+(H-10-(vals[i]/mx)*(H-24)).toFixed(1));
  var grid='',G=opt||{},ga=G.grid==null?4:G.grid;
  for(var i2=1;i2<ga;i2++){ var yy=(H-10-(i2/ga)*(H-24)).toFixed(1); grid+='<line x1="0" y1="'+yy+'" x2="'+W+'" y2="'+yy+'" stroke="#222" stroke-width="1"/>'; }
  var area='0,'+(H-10)+' '+pts.join(' ')+' '+W+','+(H-10);
  return '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;display:block">'+grid+
    '<polygon points="'+area+'" fill="'+esc(G.c||'#E8E8E8')+'" opacity=".07"/>'+
    '<polyline points="'+pts.join(' ')+'" fill="none" stroke="'+(G.c||'#E8E8E8')+'" stroke-width="1.8"/>'+
    pts.map(function(pt){ var c=pt.split(','); return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="2.4" fill="'+(G.c||'#E8E8E8')+'"/>'; }).join('')+
    '<g font-size="8" fill="#66767A">'+labels.map(function(lb,i4){ return '<text x="'+(4+i4*st-8).toFixed(0)+'" y="'+(H-2)+'">'+esc(String(lb).slice(5))+'</text>'; }).join('')+'</g></svg>';
}
function staRefresh(){
  var T=$('gb_sta_tot'),D=$('gb_sta_trend'),H2=$('gb_sta_hours');
  if(!D) return;
  T.innerHTML='<div style="color:var(--ink3)">载入中…</div>'; D.innerHTML=''; H2.innerHTML='';
  call('/stats2',{}).then(function(j){
    if(!j||!j.ok){ T.innerHTML='<div style="color:var(--bad)">无权限或加载失败</div>'; return; }
    var t=j.total||{};
    var cards=[['用户',t.users],['留言',t.guests],['帖子',t.posts],['评论',t.comments||0],['点赞',t.likes||0],['私信',t.pms||0],['访问',t.visits],['在线',j.online||0]];
    T.innerHTML='<div class="gb-sta-cards">'+cards.map(function(c){ return '<div class="gb-sta-card"><b>'+c[1]+'</b><span>'+c[0]+'</span></div>'; }).join('')+'</div>'+
      '<div class="gb-sta-today">今日 · 留言 <b>'+t.todayG+'</b> · 注册 <b>'+t.todayR+'</b> · 帖子 <b>'+t.todayP+'</b> · 累计访问 <b>'+t.visits+'</b></div>';
    D.innerHTML='<div style="font-size:11px;color:var(--ink3);letter-spacing:.12em;margin-bottom:4px">近 7 天 · <span style="color:#E8E8E8">■ 留言</span> · <span style="color:#FFC24B">■ 注册</span></div>'+
      svgLine(j.gday,j.days,320,84,{c:'#E8E8E8'})+
      svgLine(j.rday,j.days,320,84,{c:'#FFC24B',grid:3})+
      '<div style="font-size:11px;color:var(--ink3);letter-spacing:.12em;margin:10px 0 4px">用户增长（累计） · <span style="color:#2EE6A8">■</span></div>'+
      svgLine(j.cum,j.days,320,84,{c:'#2EE6A8',grid:4});
    var mx=Math.max.apply(null,j.hours.concat([1])),hb='';
    for(var i=0;i<24;i++){
      var hh=Math.round((j.hours[i]/mx)*56);
      hb+='<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1" title="'+i+' 时 · '+j.hours[i]+' 条"><div style="height:'+hh+'px;width:7px;background:'+(hh?'var(--accent)':'#262626')+';opacity:'+(hh?'.9':'.5')+'"></div><span style="font-size:8px;color:var(--ink3)">'+i+'</span></div>';
    }
    H2.innerHTML='<div style="font-size:11px;color:var(--ink3);letter-spacing:.12em;margin-bottom:4px">留言活跃时段（24h · 悬停看数值）</div><div style="display:flex;align-items:flex-end;gap:2px;border-bottom:1px solid var(--line);padding-bottom:2px">'+hb+'</div>';
    var tu=j.topUsers||[],tg=j.topGuests||[];
    var topU=tu.map(function(x){
      var w=tu[0]&&tu[0].n?Math.round((x.n/tu[0].n)*100):0;
      return '<div class="gb-sta-row"><span>'+esc(x.name)+'</span><div class="gb-sta-bar"><i style="width:'+w+'%"></i></div><b>'+x.n+'</b></div>';
    }).join('')||'<div style="color:var(--ink3);font-size:11px">暂无</div>';
    var topG=tg.map(function(x){
      var m0=tg[0]?tg[0].likes:1,w=Math.min(100,Math.round((x.likes/m0)*100));
      return '<div class="gb-sta-row" title="'+esc(x.user)+'"><span>'+esc((x.text.length>14?x.text.slice(0,14)+'…':x.text))+'</span><div class="gb-sta-bar g"><i style="width:'+w+'%"></i></div><b>'+x.likes+' ♥</b></div>';
    }).join('')||'<div style="color:var(--ink3);font-size:11px">暂无</div>';
    H2.innerHTML+='<div style="font-size:11px;color:var(--ink3);letter-spacing:.12em;margin:10px 0 4px">近 7 天活跃用户 Top</div>'+topU+
      '<div style="font-size:11px;color:var(--ink3);letter-spacing:.12em;margin:10px 0 4px">最热留言 Top</div>'+topG;
  }).catch(function(e){ T.innerHTML='<div style="color:var(--bad)">加载失败 · '+esc(ferr(e.message))+'</div>'; });
}

/* ---------- 风控关键词 ---------- */
function rkWShow(l){
  var rkW=$('gb_risk_words');
  if(!rkW)return;
  rkW.textContent='';
  var ls=l||[];
  if(!ls.length){
    var e=document.createElement('span');
    e.textContent='暂无关键词';
    e.style.cssText='font-size:12px;color:var(--ink3)';
    rkW.appendChild(e);
    return;
  }
  ls.forEach(function(w){
    var s=document.createElement('span');
    s.style.cssText='display:inline-flex;align-items:center;gap:5px;border:1px solid var(--bad);padding:2px 8px;font-size:12px;color:var(--bad)';
    var t=document.createElement('span');
    t.textContent=w;
    var d=document.createElement('b');
    d.textContent='×';
    d.style.cssText='cursor:pointer;color:var(--bad);font-weight:bold';
    d.onclick=function(){
      call('/risk_words_del',{word:w}).then(function(j){
        say(j.msg||'',true);
        rkWShow(j.words||[]);
      }).catch(function(e){ say('失败：'+ferr(e.message),false); });
    };
    s.appendChild(t);
    s.appendChild(d);
    rkW.appendChild(s);
  });
}
function rkBusy(isOn,btn,txt){
  if(!btn)return;
  btn.disabled=isOn;
  if(isOn){btn.dataset.t=btn.textContent;btn.textContent=txt}
  else if(btn.dataset.t){btn.textContent=btn.dataset.t;delete btn.dataset.t}
}
function riskRun(){
  var kw=$('gb_risk_kw').value||'';
  kw=kw.trim();
  if(!kw){say('请输入风控关键词',false);return}
  say('上传云端扫描中…',true);
  rkBusy(true,$('gb_risk_all'),'扫描中…');
  call('/admin_scan',{kw:kw}).then(function(j){
    rkBusy(false,$('gb_risk_all'));
    if(!j.ok){say(j.msg||'风控失败',false);return}
    say((j.msg||'')+'：'+(j.hits||[]).join('、'),true);
    loadUsers();
    rkWShow(j.words||[]);
  }).catch(function(e){rkBusy(false,$('gb_risk_all'));say('请求失败，服务器摸鱼了：'+ferr(e.message),false)});
}

/* ---------- 云端配置 / 发现 ---------- */
function updateModeLabel(){
  var el=$('gb_status');
  if(!el) return;
  if(S.api){
    el.textContent='云端 · '+S.api.replace(/^https?:\/\//,'');
    el.title='点击修改后端地址';
  }else{
    el.textContent='本地模式';
    el.title='点击配置云端接口';
  }
  var st=$('cmSt');
  if(st) st.textContent=S.api?'CLOUD LINK':'LOCAL ONLY';
}
function gbOpenConfig(){
  if($('gb_api_input')) $('gb_api_input').value=S.api;
  show('gb_config_dialog','flex');
  setTimeout(function(){ if($('gb_api_input')) $('gb_api_input').focus(); },40);
}
function gbCloseConfig(){ show('gb_config_dialog','none'); }
function gbSaveConfig(){
  var raw=$('gb_api_input').value.trim();
  var apis=parseApis(raw);
  if(raw && !apis.length){
    say('地址必须以 http:// 或 https:// 开头（可多个，用逗号/换行分隔）',false);
    return;
  }
  S.apis=apis;
  S.api=apis[0]||'';
  try{
    if(apis.length) localStorage.setItem(K_API,apis.join('\n'));
    else localStorage.removeItem(K_API);
  }catch(e){}
  gbCloseConfig();
  updateModeLabel();
  say(apis.length?(apis.length>1?'已接入多云端 · '+apis.length+' 台主机':'已切换到云端 · '+apis[0]):'已切回本地模式',true);
  loadGuestBook();
  loadNotes();
  wallLoad();
  if(S.user){ applyAuth(); pmRefreshConversations(); }
}
function fetchCloudTxt(){
  var t=Date.now();
  var u2='https://fastly.jsdelivr.net/gh/wtz-YEE/wtz-YEE.github.io@latest/cloud.txt?t='+t;
  var u1='https://wtz-YEE.github.io/cloud.txt?t='+t;
  var u0='https://raw.githubusercontent.com/wtz-YEE/wtz-YEE.github.io/main/cloud.txt?t='+t;
  return fetch(u2,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.text()}).catch(function(){
    return fetch(u1,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.text()}).catch(function(){
      return fetch(u0,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.text()});
    });
  });
}
function cloudProbe(u){
  if(!u) return Promise.resolve(false);
  var c=new AbortController(),t=setTimeout(function(){c.abort()},8000);
  return fetch(u+'/health',{cache:'no-store',signal:c.signal}).then(function(r){
    return r.ok?r.json().then(function(j){return !!(j&&j.ok)}).catch(function(){return false}):false;
  }).catch(function(){return false}).then(function(v){clearTimeout(t);return v});
}
function pickAlive(apis){
  function once(){
    return Promise.all((apis||[]).map(function(u){return cloudProbe(u).then(function(ok){return ok?u:null})})).then(function(rs){
      for(var i=0;i<rs.length;i++) if(rs[i]) return rs[i];
      return null;
    });
  }
  return once().then(function(al){
    if(al) return al;
    return new Promise(function(res){setTimeout(res,1200)}).then(once);
  }).then(function(al){
    return al||(apis&&apis[0]?apis[0]:null);
  });
}
function autoCloud(){
  fetchCloudTxt().then(function(t){
    var apis=parseApis(t||'').filter(function(x){return !isBadApi(x)});
    if(!apis.length) return;
    S.apis=apis;
    pickAlive(apis).then(function(al){
      if(!al){ S.api=''; S.apis=apis; updateModeLabel(); say('云端离线 · 地址失效',true); loadGuestBook(); return; }
      S.api=al;
      try{ localStorage.setItem(K_API,apis.join('\n')); }catch(e){}
      updateModeLabel();
      loadGuestBook();
      loadNotes();
      wallLoad();
      hitCloud();
      if(S.user){ applyAuth(); pmRefreshConversations(); ntRefresh(); }
      autoRelogin();
    });
  }).catch(function(){ updateModeLabel(); loadGuestBook(); });
}
function cloudRecover(){
  var cur=S.api;
  function fresh(){
    return fetchCloudTxt().then(function(t){
      var apis=parseApis(t||'').filter(function(x){return !isBadApi(x)});
      if(!apis.length) return false;
      var ch=apis[0]!==cur||apis.length!==(S.apis||[]).length;
      S.apis=apis;
      S.api=apis[0];
      try{ localStorage.setItem(K_API,apis.join('\n')); }catch(e){}
      pickAlive(apis).then(function(al){ if(al) S.api=al; else { S.api=''; updateModeLabel(); say('云端离线 · 地址失效',true); } });
      if(!ch) return false;
      updateModeLabel();
      say('云端地址已更新 · '+S.api,true);
      loadGuestBook();
      loadNotes();
      autoRelogin();
      ntRefresh();
      if(S.user) pmRefreshConversations();
      return true;
    }).catch(function(){return false});
  }
  if(!cur) return fresh();
  return cloudProbe(cur).then(function(ok){
    if(ok) return false;
    return fresh().then(function(done){
      if(done) return true;
      if((S.apis||[]).length>1){
        var alt=S.apis.filter(function(x){return x!==cur});
        return cloudProbe(alt[0]).then(function(a2){
          if(!a2) return false;
          S.api=alt[0];
          updateModeLabel();
          say('已切换到备用云端 · '+S.api,true);
          loadGuestBook();
          return true;
        });
      }
      return false;
    });
  });
}
function autoRelogin(){
  if(!S.user||!S.api||!S.user.username) return;
  call('/me',{}).then(function(j){
    if(j&&j.ok){
      S.user.pts=j.me.pts;S.user.items=j.me.items||S.user.items||[];
      if(j.me.title)S.user.title=j.me.title;
      if(j.me.frame)S.user.frame=j.me.frame;
      try{ localStorage.setItem(K_SESS,JSON.stringify(S.user)); }catch(e){}
      cloudApply(); return;
    }
    var pw='';
    try{ pw=localStorage.getItem('gb_pwd')||''; }catch(e){}
    if(!pw) return;
    call('/login',{username:S.user.username,password:pw}).then(function(k){
      if(!k||!k.ok) return;
      S.user={username:k.username,is_admin:!!k.is_admin,token:k.token,pts:k.pts,items:k.items||[],title:k.title||'',frame:k.frame||''};
      try{ localStorage.setItem(K_SESS,JSON.stringify(S.user)); }catch(e){}
      applyAuth(); loadGuestBook(); pmRefreshConversations(); startPoll(); ntRefresh();
      cloudApply();
    }).catch(function(){});
  }).catch(function(){});
}

/* ---------- 轮询 ---------- */
function startPoll(){
  stopPoll();
  S.timer=setInterval(function(){
    if(document.hidden) return;
    if(!S.user) return;
    pmRefreshConversations();
    ntRefresh();
    if(S.user&&S.user.is_admin) loadUsers(true);
    if(S.peer) pmRefreshThread();
  },6000);
}
function stopPoll(){
  if(S.timer){ clearInterval(S.timer); S.timer=null; }
}

/* ---------- 绑定 ---------- */
function bind(){
  on('gb_btn_reg','click',gbRegister);
  on('gb_btn_login','click',gbLogin);
  on('gb_btn_logout','click',gbLogout);
  on('gb_curuser','click',function(){ if(S.user) openProfile(S.user.username); });
  on('gb_submit','click',submitGuestBook);
  on('gb_uref','click',function(){ loadUsers(); });
  setInterval(function(){
    if(S.user&&S.user.token) call('/ping',{}).catch(function(){});
  },60000);
  on('gb_btn_ck','click',doCheckin);
  on('gb_n_btns','click',function(e){ if(e.target.id==='gb_n_new') show('gb_n_form','flex'); });
  on('gb_n_send','click',noticeSend);
  on('gb_n_cancel','click',function(){ show('gb_n_form','none'); });
  on('gb_n_list','click',function(e){
    var b=e.target.closest('[data-nd]'); if(!b) return;
    call('/notice_del',{id:b.getAttribute('data-nd')}).then(function(j){
      if(!j.ok) return say(j.msg||'删除失败',false);
      loadNotes();
    }).catch(function(e2){ say('请求失败，服务器摸鱼了：'+ferr(e2.message),false); });
  });
  on('gb_btn_recover','click',gbRcShow);
  on('gb_rc_user','keydown',function(e){ if(e.key==='Enter') gbRcQ(); });
  on('gb_rc_ans','keydown',function(e){ if(e.key==='Enter') gbRcGo(); });
  on('gb_rc_pwd','keydown',function(e){ if(e.key==='Enter') gbRcGo(); });
  on('gb_rc_go','click',gbRcQ);
  on('gb_rc_ok','click',gbRcGo);
  on('gb_rc_x','click',function(){ show('gbRecMask','none'); });
  on('gb_btn_sec','click',gbSecShow);
  on('gb_sec_ok','click',gbSecSave);
  on('gb_sec_x','click',function(){ show('gbSecMask','none'); });
  on('gb_btn_pwd','click',function(){ show('gb_pwd_dialog','flex'); });
  on('gb_pwd_cancel','click',function(){ show('gb_pwd_dialog','none'); });
  on('gb_pwd_save','click',function(){
    var o=$('gb_pwd_old').value,n=$('gb_pwd_new').value;
    if(!o||!n) return say('请填完整',false);
    call('/change_pwd',{old:o,new:n}).then(function(j){
      say(j.msg||(j.ok?'密码已修改':'修改失败'),!!j.ok);
      if(j.ok){ show('gb_pwd_dialog','none'); $('gb_pwd_old').value=''; $('gb_pwd_new').value=''; }
    }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
  });
  on('gb_pwd','keydown',function(e){ if(e.key==='Enter') gbLogin(); });
  on('gb_img_btn','click',function(){
    if(!S.api) return say('需云端模式才能发图',false);
    if($('gb_file')) $('gb_file').click();
  });
  on('gb_file','change',uploadImg);
  on('gb_av_file','change',uploadAvatar);
  initAvatarPick();

  var EMJ=['😀','😂','🤣','😊','😍','😘','😎','🤔','😭','😅','😡','👍','👎','🙏','💪','🔥','✨','🎉','❤️','💀','👻','🤖','🌈','🍀'];
  var ep=$('gb_emoji_panel');
  if(ep){
    ep.innerHTML=EMJ.map(function(x){return '<span data-e="'+x+'">'+x+'</span>'}).join('');
    on('gb_emoji_btn','click',function(ev){ev.stopPropagation();ep.classList.toggle('on')});
    ep.addEventListener('click',function(ev){
      var t=ev.target.closest('[data-e]');if(!t)return;
      var ta=$('gb_text');
      if(document.activeElement!==ta) ta.focus();
      var v=ta.value,pos=ta.selectionStart==null?v.length:ta.selectionStart;
      ta.value=v.slice(0,pos)+t.getAttribute('data-e')+v.slice(ta.selectionEnd==null?pos:ta.selectionEnd);
      ta.focus();ta.selectionStart=ta.selectionEnd=pos+t.getAttribute('data-e').length;
      ep.classList.remove('on');
    });
    document.addEventListener('click',function(ev){ if(ep.classList.contains('on')&&!ev.target.closest('.gb-emoji-w')) ep.classList.remove('on'); });
  }
  var gform=document.querySelector('.gb-form');
  if(gform){
    gform.addEventListener('dragover',function(ev){ev.preventDefault()});
    gform.addEventListener('drop',function(ev){
      ev.preventDefault();
      var f=(ev.dataTransfer&&ev.dataTransfer.files&&ev.dataTransfer.files[0])||null;
      if(!f)return;
      if(f.type.indexOf('image/')!==0) return say('仅支持图片拖拽',false);
      uploadFile(f);
    });
  }
  on('pm_send_btn','click',pmSend);
  on('gb_status','click',gbOpenConfig);
  on('gb_refresh','click',function(){ loadGuestBook(); say('留言已刷新',true); });
  on('gb_cfg_save','click',gbSaveConfig);
  on('gb_cfg_cancel','click',gbCloseConfig);
  on('gb_config_dialog','click',function(e){ if(e.target===$('gb_config_dialog')) gbCloseConfig(); });
  on('gb_sort','change',function(){ if(GB_ALL) renderGuests(GB_ALL); });

  on('guestbookList','click',function(e){
    var rb=e.target.closest('[data-reply]');
    if(rb){
      var ridv=rb.getAttribute('data-reply');
      S.replyTo=ridv;
      var ta=$('gb_text');
      ta.value='回复 #'+ridv+'：';ta.focus();
      say('正在回复 #'+ridv+' · 填写内容后提交',false);
      return;
    }
    var pu=e.target.closest('[data-u]');
    if(pu){ openProfile(pu.getAttribute('data-u')); return; }
    var rs=e.target.closest('.gb-reson');
    if(rs){
      if(!S.user) return say('先登录再共鸣',false);
      var resonId=rs.getAttribute('data-reson');
      var rCard=rs.closest('.gb-item');
      call('/guest_resonate',{id:resonId}).then(function(j){
        if(!j.ok) return say(j.msg||'共鸣失败',false);
        doResonRipple(j.n||0,rCard);
        loadGuestBook();
      }).catch(function(er){ say('共鸣失败：'+ferr(er.message),false); });
      return;
    }
    var lk=e.target.closest('.gb-like');
    if(lk&&!lk.classList.contains('gb-reson')){
      if(!S.user) return say('先登录再点赞',false);
      var likeId=lk.getAttribute('data-like');
      call('/guest_like',{id:likeId}).then(function(j){
        if(!j.ok) return say(j.msg||'点赞失败',false);
        loadGuestBook();
      }).catch(function(er){ say('点赞失败：'+ferr(er.message),false); });
      return;
    }
    var rep=e.target.closest('[data-rep]');
    if(rep){
      var rid2=rep.getAttribute('data-rep');
      call('/guest_report',{id:rid2,token:S.user&&S.user.token}).then(function(j){
        if(!j||!j.ok) return say((j&&j.msg)||'举报失败',false);
        GB_REPORTED[rid2]=1; rep.style.opacity='.4'; rep.disabled=true;
        say((j.hidden?'已自动隐藏该留言（3 人举报）':'举报已记录')+(j.n?' · '+j.n+'/3':''),true);
      }).catch(function(er){ say('举报失败：'+ferr(er.message),false); });
      return;
    }
    var tg=e.target.closest('[data-tag]');
    if(tg){
      GB_FILTER_TAG=GB_FILTER_TAG===tg.getAttribute('data-tag')?'':tg.getAttribute('data-tag');
      loadGuestBook();
      return;
    }
    var btn=e.target.closest('[data-del]');
    if(!btn) return;
    if(!confirm('确定删除这条留言？')) return;
    call('/guest_del',{id:btn.getAttribute('data-del'),token:S.user&&S.user.token}).then(function(j){
      var gone=!!(j&&(j.ok||(j.msg||'').indexOf('不存在')>=0));
      say((j&&j.msg)||(gone?'已删除':'删除失败'),gone);
      if(gone){
        var did=String(btn.getAttribute('data-del'));
        try{
          var cc=JSON.parse(localStorage.getItem(K_GB)||'null');
          if(cc&&cc.list) cc.list=cc.list.filter(function(x){return String(x&&x.id)!==did});
          localStorage.setItem(K_GB,JSON.stringify(cc));
        }catch(er){}
        loadGuestBook();
        setTimeout(fullSyncGb,1200);
      }
    }).catch(function(er){ say('删除失败：'+er.message,false); });
  });

  on('gb_ulist','click',function(e){
    var b=e.target.closest('[data-ua]');
    if(b){
      var t=b.getAttribute('data-ua'),adm=b.getAttribute('data-uadm')==='1';
      call('/admin_set_admin',{target:t,admin:!adm}).then(function(j){
        say(j.msg||(j.ok?'已更新':'失败'),!!j.ok);
        if(j.ok) loadUsers();
      }).catch(function(er){ say('请求失败，服务器摸鱼了：'+ferr(er.message),false); });
      return;
    }
    b=e.target.closest('[data-uban]');
    if(b){
      var t2=b.getAttribute('data-uban'),ban=b.getAttribute('data-ubanned')==='1';
      if(!confirm(ban?'确认解除拉黑 '+t2+' ？':'确认拉黑 '+t2+' ？（拉黑后无法留言/发帖/评论）')) return;
      call('/admin_ban_user',{target:t2,ban:!ban}).then(function(j){
        say(j.msg||(j.ok?'已操作':'失败'),!!j.ok);
        if(j.ok) loadUsers();
      }).catch(function(er){ say('请求失败，服务器摸鱼了：'+ferr(er.message),false); });
      return;
    }
    b=e.target.closest('[data-udel]');
    if(b){
      var t3=b.getAttribute('data-udel');
      if(!confirm('确认删除用户 '+t3+' ？此操作不可恢复')) return;
      call('/admin_del_user',{target:t3}).then(function(j){
        say(j.msg||(j.ok?'已删除':'失败'),!!j.ok);
        if(j.ok) loadUsers();
      }).catch(function(er){ say('请求失败，服务器摸鱼了：'+ferr(er.message),false); });
      return;
    }
    b=e.target.closest('[data-ukick]');
    if(b){
      var t4=b.getAttribute('data-ukick');
      if(!confirm('确认删除 '+t4+' 的全部登录会话（强制下线）？')) return;
      call('/admin_del_session',{user:t4}).then(function(j){
        say(j.msg||(j.ok?'已操作':'失败'),!!j.ok);
        if(j.ok) loadUsers();
      }).catch(function(er){ say('请求失败，服务器摸鱼了：'+ferr(er.message),false); });
    }
  });

  on('pm_conv','click',function(e){
    var d=e.target.closest('[data-pcd]');
    if(d){
      e.stopPropagation();
      var peer=d.getAttribute('data-pcd');
      if(!confirm('删除与 '+peer+' 的整个会话？')) return;
      call('/pm_delconv',{peer:peer}).then(function(j){
        if(!j.ok) return say(j.msg||'删除失败',false);
        if(S.peer===peer){ S.peer=''; S.thread=[]; txt('pm_title','选择会话，或直接输入对方账号'); if($('pm_box')) $('pm_box').innerHTML=''; }
        pmRefreshConversations();
      }).catch(function(er){ say('删除失败：'+ferr(er.message),false); });
      return;
    }
    var it=e.target.closest('[data-peer]');
    if(!it) return;
    pmOpen(it.getAttribute('data-peer'));
  });
  on('pm_box','click',function(e){
    var d=e.target.closest('[data-pmd]');
    if(!d) return;
    e.stopPropagation();
    var id=d.getAttribute('data-pmd');
    if(!confirm('删除这条消息？')) return;
    call('/pm_del',{id:id}).then(function(j){
      if(!j.ok) return say(j.msg||'删除失败',false);
      S.thread=(S.thread||[]).filter(function(x){return String(x.id)!==String(id)});
      renderThread(S.thread||[]);
      setTimeout(pmRefreshThread,2600);
    }).catch(function(er){ say('删除失败：'+ferr(er.message),false); });
  });
  on('pm_img_btn','click',function(){ if(!S.api) return say('需云端模式才能发图',false); if($('pm_file')) $('pm_file').click(); });
  on('pm_file','change',function(){
    var f=$('pm_file').files[0]; if(!f) return;
    if(f.size>8*1024*1024) return say('图太大（超过 8MB）',false);
    compressImg(f,function(data){
      if(!data) return say('图片读取失败',false);
      call('/upload',{data:data}).then(function(j){
        if(!j.ok) return say(j.msg||'上传失败',false);
        S.pmImg=j.url;
        var a=$('pm_att');
        if(a){
          a.innerHTML='<img src="'+esc(S.api+j.url)+'"><button id="pm_img_rm">移除</button>'; a.style.display='flex';
          on('pm_img_rm','click',clearPmImg);
        }
        say('图片搞定',true);
      }).catch(function(er){ say('上传失败：'+ferr(er.message),false); });
    });
  });
  on('pm_msg','keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); pmSend(); } });
  on('pm_target','keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); if($('pm_msg')) $('pm_msg').focus(); } });

  function banLoad(){
    var box=$('gb_ban_list');
    if(!box) return;
    call('/admin_banned_get',{}).then(function(j){
      if(!j.ok) return say(j.msg||'获取失败',false);
      if(!j.list||!j.list.length){ box.innerHTML='<div style="color:var(--ok)">暂无危险 IP</div>'; box.style.display=''; return; }
      box.innerHTML=j.list.map(function(b){
        var hh=Math.max(1,Math.ceil(b.remain/3600));
        return '<div style="display:flex;gap:8px;align-items:center;padding:3px 0;border-bottom:1px solid var(--line);flex-wrap:wrap">'+
          '<b style="color:var(--bad)">'+esc(b.ip)+'</b>'+
          '<span style="color:var(--ink3)">原账号 '+esc(b.name||'-')+'</span>'+
          '<span style="color:var(--ink3)">'+esc(b.time)+' · 由 '+esc(b.by)+' · 剩 '+hh+'h</span>'+
          '<button class="gb-btn ghost" data-bc="'+esc(b.ip)+'" style="padding:1px 8px;font-size:10px">解除</button>'+
        '</div>';
      }).join('');
      box.style.display='';
    }).catch(function(er){ say('请求失败，服务器摸鱼了：'+ferr(er.message),false); });
  }
  on('gb_ban_btn','click',function(){
    var box=$('gb_ban_list');
    if(!box) return;
    if(box.style.display!=='none'){ box.style.display='none'; return; }
    banLoad();
  });
  on('gb_ban_list','click',function(e){
    var b=e.target.closest('[data-bc]');
    if(!b) return;
    call('/admin_banned_clear',{ip:b.getAttribute('data-bc')}).then(function(j){
      say(j.msg||(j.ok?'已解除':'失败'),!!j.ok);
      if(j.ok) banLoad();
    }).catch(function(er){ say('请求失败：'+er.message,false); });
  });
  on('gb_punish_btn','click',function(){
    var box=$('gb_punish_list');
    if(!box) return;
    if(box.style.display!=='none'){ box.style.display='none'; return; }
    box.innerHTML='<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px">'+
      '<input id="gb_pun_ip" placeholder="输入 IP" style="background:var(--bg2);color:var(--ink2);border:1px solid var(--line);font-size:10.5px;padding:3px 6px;width:130px;font-family:var(--mono)">'+
      '<input id="gb_pun_name" placeholder="备注(可选)" style="background:var(--bg2);color:var(--ink2);border:1px solid var(--line);font-size:10.5px;padding:3px 6px;width:110px;font-family:var(--mono)">'+
      '<button class="gb-btn" data-pact="ban" style="padding:3px 10px;font-size:10.5px">⛔ 封禁</button>'+
      '<button class="gb-btn" data-pact="panic" style="padding:3px 10px;font-size:10.5px">☠ 崩坏惩罚</button>'+
      '</div><div id="gb_pun_rows" style="display:flex;flex-direction:column;gap:2px"></div>';
    box.style.display='';
    punishLoad();
  });
  function punishLoad(){
    call('/admin_punish',{}).then(function(j){
      if(!j.ok) return say(j.msg||'获取失败',false);
      var rows=$('gb_pun_rows'); if(!rows) return;
      var htm='';
      (j.panic||[]).forEach(function(x){
        htm+='<div style="display:flex;gap:8px;align-items:center;padding:3px 0;border-bottom:1px solid var(--line);flex-wrap:wrap"><b style="color:var(--bad)">☠ '+esc(x.ip)+'</b><span style="color:var(--ink3)">崩坏 · '+esc(x.by||'-')+' · '+esc(x.time)+'</span><button class="gb-btn ghost" data-pd="panic|'+esc(x.ip)+'" style="padding:1px 8px;font-size:10px">解除</button></div>';
      });
      (j.ban||[]).forEach(function(x){
        htm+='<div style="display:flex;gap:8px;align-items:center;padding:3px 0;border-bottom:1px solid var(--line);flex-wrap:wrap"><b style="color:var(--bad)">⛔ '+esc(x.ip)+'</b><span style="color:var(--ink3)">封禁 · '+esc(x.by||'-')+' · '+esc(x.time)+' · 剩 '+Math.max(0,x.remain)+'s</span><button class="gb-btn ghost" data-pd="ban|'+esc(x.ip)+'" style="padding:1px 8px;font-size:10px">解除</button></div>';
      });
      if(!htm) htm='<div style="color:var(--ok)">暂无惩罚记录</div>';
      rows.innerHTML=htm;
    }).catch(function(e){ say('请求失败：'+ferr(e.message),false); });
  }
  on('gb_punish_list','click',function(e){
    var add=e.target.closest('[data-pact]');
    if(add){
      var ip=$('gb_pun_ip').value.trim(); if(!ip) return say('请输入 IP',false);
      var nm=$('gb_pun_name').value.trim();
      call('/admin_punish',{ip:ip,name:nm,type:add.getAttribute('data-pact'),action:'add'}).then(function(j){
        say(j.msg||(j.ok?'已添加':'失败'),!!j.ok);
        if(j.ok){ punishLoad(); $('gb_pun_ip').value=''; $('gb_pun_name').value=''; }
      }).catch(function(er){ say('请求失败：'+er.message,false); });
      return;
    }
    var pd=e.target.closest('[data-pd]');
    if(pd){
      var a=pd.getAttribute('data-pd').split('|');
      call('/admin_punish',{ip:a[1],type:a[0],action:'remove'}).then(function(j){
        say(j.msg||(j.ok?'已解除':'失败'),!!j.ok); if(j.ok) punishLoad();
      }).catch(function(er){ say('请求失败：'+er.message,false); });
    }
  });

  on('gb_risk_btn','click',function(){
    var kw=$('gb_risk_kw').value.trim();
    if(!kw)return say('请输入风控关键词',false);
    rkBusy(true,$('gb_risk_btn'),'上传中…');
    call('/risk_words_add',{words:kw}).then(function(j){
      rkBusy(false,$('gb_risk_btn'));
      say(j.msg||'',true);
      rkWShow(j.words||[]);
      if(j.ok)$('gb_risk_kw').value='';
    }).catch(function(e){ rkBusy(false,$('gb_risk_btn')); say('失败：'+ferr(e.message),false); });
  });
  on('gb_risk_all','click',function(){
    say('云端扫描全部关键词…',true);
    rkBusy(true,$('gb_risk_all'),'扫描中…');
    call('/admin_scan',{}).then(function(j){
      rkBusy(false,$('gb_risk_all'));
      if(!j.ok){ say(j.msg||'风控失败',false); return; }
      say((j.msg||'')+'：'+(j.hits||[]).join('、'),true);
      loadUsers();
    }).catch(function(e){ rkBusy(false,$('gb_risk_all')); say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
  });
  on('gb_risk_kw','keydown',function(e){ if(e.key==='Enter') riskRun(); });
  call('/risk_words_get',{}).then(function(j){ rkWShow(j.words||[]); }).catch(function(){});

  on('gb_aud_btn','click',function(){
    var A=$('gb_aud'),S2=$('gb_sta');
    A.style.display=A.style.display==='none'?'block':'none';
    if($('gb_aud_close')) $('gb_aud_close').style.display=A.style.display;
    if(S2) S2.style.display='none';
    if(A.style.display==='block') audRefresh();
  });
  on('gb_sta_btn','click',function(){
    var A=$('gb_aud'),S2=$('gb_sta');
    S2.style.display=S2.style.display==='none'?'block':'none';
    if($('gb_aud_close')) $('gb_aud_close').style.display=S2.style.display;
    if(A) A.style.display='none';
    if(S2.style.display==='block') staRefresh();
  });
  on('gb_sta_ref','click',staRefresh);
  on('gb_aud_close','click',function(){
    var A=$('gb_aud'),S2=$('gb_sta');
    if(A) A.style.display='none'; if(S2) S2.style.display='none';
    $('gb_aud_close').style.display='none';
  });
  on('gb_aud_date','change',audRefresh);
  on('gb_bak_btn','click',function(){
    if(!S.user) return say('请先登录',false);
    say('正在打包全站数据…',true);
    call('/backup',{}).then(function(j){
      if(!j||!j.ok) return say((j&&j.msg)||'备份失败',false);
      var a=document.createElement('a');
      a.href='data:application/zip;base64,'+j.data;
      a.download='wtz-backup-'+new Date().toISOString().slice(0,10)+'.zip';
      a.click();
      say('已备份 '+j.files+' 个数据文件 · '+Math.max(1,Math.round(j.size/1024))+'KB',true);
    }).catch(function(e){ say('备份失败：'+ferr(e.message),false); });
  });
  on('gb_me_btn','click',function(){
    if(!S.user) return say('请先登录',false);
    call('/export_me',{}).then(function(j){
      if(!j||!j.ok) return say((j&&j.msg)||'导出失败',false);
      var a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([JSON.stringify(j.data,null,1)],{type:'application/json'}));
      a.download=S.user.username+'-data-'+new Date().toISOString().slice(0,10)+'.json';
      a.click();
      say('已导出 '+S.user.username+' 的个人数据',true);
    }).catch(function(e){ say('导出失败：'+ferr(e.message),false); });
  });
  on('gb_aud_json','click',function(){
    var cd=$('gb_aud_date')?$('gb_aud_date').value:'';
    call('/audit_export',{fmt:'json',date:cd}).then(function(j){ if(j&&j.ok) dlFile(cd?('audit_'+cd+'.json'):'audit_log.json',JSON.stringify(j.data,null,1)); }).catch(function(){});
  });
  on('gb_aud_csv','click',function(){
    var cd=$('gb_aud_date')?$('gb_aud_date').value:'';
    call('/audit_export',{fmt:'csv',date:cd}).then(function(j){ if(j&&j.ok) dlFile(cd?('audit_'+cd+'.csv'):'audit_log.csv',j.data); }).catch(function(){});
  });

  on('ntBadge','click',function(e){
    e.stopPropagation();
    var pn=$('ntPanel');
    if(pn){
      var isOn=pn.classList.toggle('on');
      if(isOn) ntRefresh();
    }
  });
  document.addEventListener('click',function(ev){
    var pn=$('ntPanel');
    if(pn&&pn.classList.contains('on')&&!ev.target.closest('#ntPanel')&&!ev.target.closest('#ntBadge')) pn.classList.remove('on');
  });
  on('pmBadge','click',function(e){
    e.stopPropagation();
    if(!S.user) return say('登录后可收发私聊',false);
    var p=$('gb_pm_panel');
    if(p){
      p.classList.add('on');
      if(p.scrollIntoView) p.scrollIntoView({behavior:'smooth',block:'center'});
    }
  });
  on('ntClear','click',function(){
    call('/notify_read',{}).then(function(j){ if(j&&j.ok) ntRefresh(); }).catch(function(){});
  });
  on('ntTabs','click',function(e){
    var t=e.target.closest('.nt-tab'); if(!t) return;
    S.ntF=t.getAttribute('data-f');
    var all=$('ntTabs').querySelectorAll('.nt-tab');
    for(var i=0;i<all.length;i++) all[i].classList.toggle('on',all[i]===t);
    ntRefresh();
  });
  on('ntList','click',function(e){
    var t=e.target.closest('[data-nt]');
    if(!t) return;
    var id=t.getAttribute('data-nt');
    t.classList.remove('unread');
    var d=$('ntDot'),b=$('ntBadge');
    if(d&&d.textContent&&d.textContent!=='0'){ var n=parseInt(d.textContent,10)-1; d.textContent=n>0?n:'0'; if(n<=0&&b) b.classList.remove('on'); }
    if(t.getAttribute('data-kind')==='pm'){
      var from=t.getAttribute('data-from');
      if(from&&S.user&&from!==S.user.username){
        var pn=$('ntPanel'); if(pn) pn.classList.remove('on');
        var pp=$('gb_pm_panel'); if(pp) pp.classList.add('on');
        pmOpen(from);
      }
    }
    call('/notify_read',{id:id}).then(function(){}).catch(function(){});
  });
  on('pfClose','click',function(){ $('pfMask').classList.remove('on'); });
  on('pfMask','click',function(e){ if(e.target===$('pfMask')) $('pfMask').classList.remove('on'); });
  on('pfBody','click',function(e){
    var pt=e.target.closest('.pf-tab');
    if(pt){
      var k=pt.getAttribute('data-pft');
      var tabs=$('pfBody').querySelectorAll('.pf-tab');
      for(var i=0;i<tabs.length;i++) tabs[i].classList.toggle('on',tabs[i]===pt);
      var pgs=$('pfBody').querySelectorAll('.pf-pg');
      for(var j=0;j<pgs.length;j++) pgs[j].style.display=(pgs[j].getAttribute('data-pg')===k)?'':'none';
      if(k==='a') achWall();
      return;
    }
    var t=e.target.closest('[data-u]');
    if(t){ openProfile(t.getAttribute('data-u')); return; }
    var p2=e.target.closest('[data-pf="p"]');
    if(p2) window.open('pages/守夜人论坛.html');
  });

  on('rankOpen','click',function(){ openRank(); });
  on('rankClose','click',function(){ $('rankMask').classList.remove('on'); });
  on('rankMask','click',function(e){ if(e.target===$('rankMask')) $('rankMask').classList.remove('on'); });
  on('rankTabs','click',function(e){
    var c=e.target.closest('[data-rk]');
    if(c) openRank(c.getAttribute('data-rk'));
  });
  on('shopOpen','click',openShop);
  on('shopClose','click',function(){ $('shopMask').classList.remove('on'); });
  on('shopMask','click',function(e){ if(e.target===$('shopMask')) $('shopMask').classList.remove('on'); });
  on('shopTabs','click',function(e){
    var c=e.target.closest('[data-sk]');
    if(!c) return;
    _shopKind=c.getAttribute('data-sk');
    try{ localStorage.setItem('prts_shopKind',_shopKind); }catch(er){}
    shopRender();
  });
  on('shopBody','click',function(e){
    var b=e.target.closest('[data-buy]');
    if(b){ var x=+b.getAttribute('data-buy'); shopBuy(x); return; }
    var eq=e.target.closest('[data-equip]');
    if(eq){ shopEquip(eq.getAttribute('data-equip')); return; }
    var un=e.target.closest('[data-unequip]');
    if(un){ shopEquip(''); }
  });
}

/* ---------- 启动 ---------- */
(function(){
  var clock=$('cmClock');
  function tick(){
    var d=new Date(),p=function(n){return n<10?'0'+n:n};
    if(clock) clock.textContent=p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
  }
  tick();setInterval(tick,1000);

  try{ bind(); }catch(e){}
  try{ updateModeLabel(); }catch(e){}
  try{ applyAuth(); }catch(e){}
  try{ initAvatarPick(); }catch(e){}
  try{ loadGuestBook(); }catch(e){}
  try{ wallLoad(); }catch(e){}
  try{ autoCloud(); }catch(e){}
  if(S.user){
    try{ pmRefreshConversations(); }catch(e){}
    try{ startPoll(); }catch(e){}
    try{ ntRefresh(); }catch(e){}
    try{ shopBadge(); }catch(e){}
  }
  setTimeout(autoRelogin,800);
  setInterval(tokenPulse,30000);
  setTimeout(cloudRecover,2500);
  setInterval(cloudRecover,60000);
})();

window.gbRegister=gbRegister;
window.gbLogin=gbLogin;
window.gbLogout=gbLogout;
window.submitGuestBook=submitGuestBook;
window.loadGuestBook=loadGuestBook;
window.pmSend=pmSend;
window.gbOpenConfig=gbOpenConfig;
window.gbCloseConfig=gbCloseConfig;
window.gbSaveConfig=gbSaveConfig;

})();
