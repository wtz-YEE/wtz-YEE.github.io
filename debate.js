/* WTZ 社区 · 论战 */
(function(){
'use strict';

var RANKS=[
  {n:'论战小区',e:0},{n:'论战区',e:100},{n:'论战大区',e:250},
  {n:'论战小狗',e:500},{n:'论战中狗',e:800},{n:'论战大狗',e:1200},
  {n:'论战野狗',e:1700},{n:'论战小猪',e:2300},{n:'论战中猪',e:3000},
  {n:'论战大猪',e:3800},{n:'论战野猪',e:4700}
];
var LKEY='wz_debate_v1';
var state={posts:[],profile:null,local:false,loading:false};

function $(id){return document.getElementById(id)}
function esc(s){
  return String(s==null?'':s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function me(){return window.WZCM?window.WZCM.user():null}
function now(){
  var d=new Date(),p=function(n){return(n<10?'0':'')+n};
  return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
}
function rid(p){return p+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}
function rankOf(exp){
  exp=Math.max(0,+exp||0);var i=0;
  for(var k=0;k<RANKS.length;k++) if(exp>=RANKS[k].e) i=k;
  var r=RANKS[i],nx=RANKS[i+1]||null;
  return {name:r.n,index:i,base:r.e,next:nx?nx.n:'',next_exp:nx?nx.e:null,
    progress:exp-r.e,span:nx?nx.e-r.e:0};
}
function delta(myExp,oppExp,win){
  var a=rankOf(myExp).index,b=rankOf(oppExp).index;
  if(win) return 14+b*6+Math.max(0,b-a)*8;
  return 6+b*3+Math.max(0,a-b)*2;
}

/* ---------- 本机档案 ---------- */
function ldb(){
  try{
    var d=JSON.parse(localStorage.getItem(LKEY)||'null');
    if(d&&Array.isArray(d.posts)&&d.users&&typeof d.users==='object') return d;
  }catch(e){}
  return {posts:[],users:{}};
}
function lsave(d){try{localStorage.setItem(LKEY,JSON.stringify(d))}catch(e){}}
function luser(d,n){return d.users[n]||{exp:0,wins:0,losses:0}}
function lview(d,n){
  var r=luser(d,n),rk=rankOf(r.exp||0);
  return {name:n,exp:Math.max(0,+r.exp||0),rank:rk.name,rank_i:rk.index,
    wins:+r.wins||0,losses:+r.losses||0};
}
function lprofile(d,n){
  var r=luser(d,n),rk=rankOf(r.exp||0);
  return {name:n,exp:Math.max(0,+r.exp||0),rank:rk.name,rank_i:rk.index,
    next:rk.next,next_exp:rk.next_exp,progress:rk.progress,span:rk.span,
    wins:+r.wins||0,losses:+r.losses||0};
}
function lwrite(d,n,dl,win){
  var r=d.users[n]||(d.users[n]={exp:0,wins:0,losses:0});
  r.exp=Math.max(0,(+r.exp||0)+dl);
  if(win) r.wins=(+r.wins||0)+1; else r.losses=(+r.losses||0)+1;
}
function lposts(d){
  return d.posts.map(function(p){
    return {
      id:p.id,user:p.user,char:p.char,target:p.target,body:p.body,time:p.time,
      status:p.status||'open',host:lview(d,p.user),_local:true,
      args:(p.args||[]).map(function(a){
        return {id:a.id,user:a.user,char:a.char||'',text:a.text,time:a.time,result:a.result||'',
          host_delta:a.host_delta,ch_delta:a.ch_delta,resolved_at:a.resolved_at||'',
          ai:a.ai||{},author:lview(d,a.user)};
      })
    };
  }).sort(function(a,b){return (b.time||'').localeCompare(a.time||'')});
}
function localApi(path,p){
  var d=ldb(),u=me();
  p=p||{};
  if(path==='/debate_list'){
    return {ok:true,posts:lposts(d),total:d.posts.length,ranks:RANKS.map(function(x){return {name:x.n,exp:x.e}}),_local:true};
  }
  if(path==='/debate_profile'){
    if(!u) return {ok:false,msg:'请先登录'};
    return {ok:true,profile:lprofile(d,u.username),_local:true};
  }
  if(path==='/debate_add'){
    if(!u) return {ok:false,msg:'请先登录'};
    var c=String(p.char||'').trim().slice(0,24),t=String(p.target||'').trim().slice(0,30),b=String(p.body||'').trim().slice(0,300);
    if(!c||!t) return {ok:false,msg:'角色和挑战目标不能为空'};
    var id=rid('dl');
    d.users[u.username]=d.users[u.username]||{exp:0,wins:0,losses:0};
    d.posts.push({id:id,user:u.username,char:c,target:t,body:b,time:now(),status:'open',args:[]});
    lsave(d);
    return {ok:true,msg:'论战已发布 · 本机暂存',id:id,_local:true};
  }
  if(path==='/debate_del'){
    if(!u) return {ok:false,msg:'请先登录'};
    var pid=String(p.pid||''),found=null;
    for(var i=0;i<d.posts.length;i++) if(d.posts[i].id===pid) found=d.posts[i];
    if(!found) return {ok:false,msg:'论战帖不存在'};
    if(found.user!==u.username&&!u.is_admin) return {ok:false,msg:'只有帖主或管理员可以删除'};
    d.posts=d.posts.filter(function(x){return x.id!==pid});
    lsave(d);
    return {ok:true,msg:'论战帖已删除 · 本机',id:pid,_local:true};
  }
  if(path==='/debate_arg'){
    if(!u) return {ok:false,msg:'请先登录'};
    var text=String(p.text||'').trim().slice(0,300),post=null;
    var char=String(p.char||'').trim().slice(0,24);
    if(!text) return {ok:false,msg:'发言不能为空'};
    for(var i=0;i<d.posts.length;i++) if(d.posts[i].id===p.pid) post=d.posts[i];
    if(!post) return {ok:false,msg:'论战帖不存在'};
    var args=post.args||[],isHost=post.user===u.username,side='challenger';
    if(isHost){
      var challengers=args.filter(function(a){return (a.side||'challenger')==='challenger'});
      if(!challengers.length) return {ok:false,msg:'需要挑战者先发言'};
      char=post.char;side='host';
    }else{
      if(!char) return {ok:false,msg:'请选择你的角色'};
      if([post.char,post.target].indexOf(char)<0) return {ok:false,msg:'只能选择帖主指定的角色或对手'};
    }
    if(!char) return {ok:false,msg:'请填写你的角色名'};
    if(post.status==='closed') return {ok:false,msg:'该论战已封盘'};
    var aid=rid('da');
    d.users[u.username]=d.users[u.username]||{exp:0,wins:0,losses:0};
    post.args=args;
    post.args.push({id:aid,user:u.username,char:char,text:text,time:now(),side:side,result:'',host_delta:null,ch_delta:null,resolved_at:'',ai:{}});
    lsave(d);
    return {ok:true,msg:(side==='host'?'反击':'发言')+'已加入论战 · 本机暂存',id:aid,side:side,_local:true};
  }
  if(path==='/debate_resolve'){
    if(!u||!u.is_admin) return {ok:false,msg:'只有管理员可以定胜负'};
    var post2=null,arg=null;
    for(var j=0;j<d.posts.length;j++) if(d.posts[j].id===p.pid) post2=d.posts[j];
    if(!post2) return {ok:false,msg:'论战帖不存在'};
    var ar=post2.args||[];
    for(var k=0;k<ar.length;k++) if(ar[k].id===p.aid) arg=ar[k];
    if(!arg) return {ok:false,msg:'发言记录不存在'};
    if(arg.result) return {ok:false,msg:'这条论战已经定过胜负'};
    var chName=arg.user||'';
    if(arg.side==='host'){
      chName='';
      for(var n=0;n<ar.length;n++){
        if(ar[n].id===arg.id) break;
        if((ar[n].side||'challenger')==='challenger') chName=ar[n].user||chName;
      }
    }
    if(!chName) return {ok:false,msg:'挑战者记录不存在'};
    if(!d.users[post2.user]||!d.users[chName]) return {ok:false,msg:'参与者尚未有论战档案'};
    if(p.winner!=='host'&&p.winner!=='challenger') return {ok:false,msg:'请选择胜方'};
    var he=luser(d,post2.user).exp,ce=luser(d,chName).exp,hd,cd;
    if(p.winner==='host'){hd=delta(he,ce,true);cd=-delta(ce,he,false)}
    else{hd=-delta(he,ce,false);cd=delta(ce,he,true)}
    var hb=rankOf(he).name,cb=rankOf(ce).name;
    lwrite(d,post2.user,hd,p.winner==='host');
    lwrite(d,chName,cd,p.winner==='challenger');
    arg.result=p.winner;arg.host_delta=hd;arg.ch_delta=cd;arg.resolved_at=now();
    if(ar.length&&ar.every(function(a){return a.result})){post2.status='closed';post2.closed_at=now()}
    lsave(d);
    return {ok:true,msg:'胜负已记录 · 本机',host:{name:post2.user,delta:hd,rank_before:hb,rank_after:rankOf(luser(d,post2.user).exp).name},
      challenger:{name:chName,delta:cd,rank_before:cb,rank_after:rankOf(luser(d,chName).exp).name},_local:true};
  }
  return {ok:false,msg:'本机接口不存在'};
}

function offlineError(err){
  if(!err) return true;
  if(err.isNetwork) return true;
  var m=String(err.message||'');
  return /Failed to fetch|NetworkError|ERR_CONNECTION|load failed|HTTP 404/i.test(m);
}
function callApi(path,payload){
  var cm=window.WZCM;
  if(!cm||!cm.api()){state.local=true;return Promise.resolve(localApi(path,payload))}
  return cm.call(path,payload).then(function(j){
    if(j&&j.ok) state.local=false;
    return j;
  },function(err){
    if(offlineError(err)){state.local=true;return localApi(path,payload)}
    throw err;
  });
}

/* ---------- 渲染 ---------- */
function errText(err){
  var m=String(err&&err.message?err.message:'网络错误');
  if(/429/.test(m))return '操作太频繁，请稍后再试';
  if(/401|403/.test(m))return '登录已失效或没有权限';
  if(/HTTP 404/.test(m))return '云端论战接口尚未部署';
  if(/HTTP 5\d\d/.test(m))return '服务器开小差了，请稍后再试';
  return m.split(' @ ')[0];
}
function say(msg,ok){
  var el=$('dbSay');if(!el)return;
  el.textContent=msg||'';el.className='db-say'+(ok===true?' ok':(ok===false?' bad':''));
  clearTimeout(say.t);
  say.t=setTimeout(function(){if(el.textContent===msg)el.textContent=''},4200);
}
function renderMe(profile,u){
  var rk=$('dbMeRank'),ex=$('dbMeExp'),bar=$('dbMeBar'),hint=$('dbLoginHint'),pb=$('dbPublish');
  if(hint)hint.style.display=u?'none':'';
  if(pb)pb.disabled=!u;
  if(!u){rk.textContent='未登录';ex.textContent='登录后查看论战经验';if(bar)bar.style.width='0';return}
  if(!profile){rk.textContent='读取中…';ex.textContent='经验同步中';if(bar)bar.style.width='0';return}
  rk.textContent=profile.rank||'论战小区';
  var ratio=profile.next_exp?Math.min(100,Math.max(0,Math.round((profile.progress/(profile.span||1))*100))):100;
  if(bar)bar.style.width=ratio+'%';
  ex.textContent='经验 '+profile.exp+(profile.next_exp?' / '+profile.next_exp:' · 顶阶')+' · 胜 '+profile.wins+' / 负 '+profile.losses;
}
function renderLadder(pi){
  var list=$('dbLadder');if(!list)return;
  list.innerHTML=RANKS.map(function(r,i){
    return '<div class="db-r'+(i===(pi==null?-1:pi)?' on':'')+'"><i>'+String(i+1).padStart(2,'0')+'</i><b>'+esc(r.n)+'</b><em></em></div>';
  }).join('');
}
function pkHTML(a,hostChar,chChar){
  var ai=a.ai||{},hw=+ai.host_win,ch=+ai.ch_win;
  if(!ai.host_win&&!ai.ch_win){
    if(a.ai_state==='error'){
      return '<div class="db-pk db-pk-wait"><div class="db-pk-top"><span>AI 研判</span><span>暂不可用</span></div><div class="db-pk-track"><i class="db-pk-a" style="width:50%"></i><i class="db-pk-b" style="width:50%"></i></div>'+(a.ai_error?'<div class="db-pk-meta">'+esc(a.ai_error)+'</div>':'')+'</div>';
    }
    return '<div class="db-pk db-pk-wait"><div class="db-pk-top"><span>AI 研判</span><span>'+(state.local?'AI 需云端在线':'研判中…')+'</span></div><div class="db-pk-track"><i class="db-pk-a" style="width:50%"></i><i class="db-pk-b" style="width:50%"></i></div></div>';
  }
  var oppChar=chChar||a.char||'挑战者';
  var loser=ai.loser==='host'?hostChar:(ai.loser==='challenger'?oppChar:'');
  return '<div class="db-pk"><div class="db-pk-top"><span>「'+esc(hostChar)+'」<b>'+hw+'%</b></span><span><b>'+ch+'%</b>「'+esc(oppChar)+'」</span></div>'+
    '<div class="db-pk-track"><i class="db-pk-a" style="width:'+hw+'%"></i><i class="db-pk-b" style="width:'+ch+'%"></i></div>'+
    '<div class="db-pk-meta">AI / '+esc(ai.model||'gpt-5.6-luna')+(loser?' · 判定「'+esc(loser)+'」将失败':' · 暂未判定败势')+(ai.reason?' · '+esc(ai.reason):'')+'</div></div>';
}
function argHTML(a,hostChar,chChar){
  var speaker=(a.side||'challenger');
  var cls='db-arg'+(a.result?(a.result===speaker?' win':' lose'):'');
  var res=a.result==='host'?'发布者胜':(a.result==='challenger'?'挑战者胜':'');
  var deltaTxt='';
  if(a.result){
    deltaTxt='发布者 '+(a.host_delta>0?'+':'')+(a.host_delta==null?'':a.host_delta)+' / 挑战者 '+(a.ch_delta>0?'+':'')+(a.ch_delta==null?'':a.ch_delta);
  }
  return '<div class="'+cls+'">'+
    '<div class="db-arg-h"><b>'+esc(a.author?a.author.name:a.user)+'</b><em>'+esc(a.author?a.author.rank:'')+' · '+escapeExp(a.author)+(a.char?' · 角色「'+esc(a.char)+'」':'')+' · '+(a.side==='host'?'发布者':'挑战者')+'</em>'+
    (res?'<span class="db-result '+esc(a.result)+'">'+res+'</span>':'')+'</div>'+
    '<p>'+esc(a.text)+'</p>'+
    pkHTML(a,hostChar,chChar)+
    (deltaTxt?'<div class="db-arg-delta">'+deltaTxt+' · '+esc(a.resolved_at||'')+'</div>':'')+
    '</div>';
}
function escapeExp(a){return a?('EXP '+a.exp):''}
function chCharBefore(p,a){
  var c='',list=p.args||[];
  for(var i=0;i<list.length;i++){
    var x=list[i];
    if(x.id===a.id)break;
    if((x.side||'challenger')==='challenger'&&x.char)c=x.char;
  }
  return c;
}
function postHTML(p,u){
  var isHost=!!(u&&p.user===u.username);
  var admin=!!(u&&u.is_admin);
  var canDel=!!(u&&(isHost||admin));
  var ended=p.status==='closed'||((p.args||[]).length>0&&(p.args||[]).every(function(a){return !!a.result}));
  var pending=0;
  (p.args||[]).forEach(function(a){if(!a.result)pending++});
  var args='',hasChallengerArg=false;
  (p.args||[]).forEach(function(a){
    if((a.side||'challenger')==='challenger')hasChallengerArg=true;
    var opp=a.side==='host'?chCharBefore(p,a):(a.char||'');
    args+=argHTML(a,p.char,opp);
    if(!a.result&&admin){
      args+='<div class="db-resolve" data-pid="'+esc(p.id)+'" data-aid="'+esc(a.id)+'">'+
        '<span>裁定 / ADMIN</span>'+
        '<button type="button" data-win="host" data-pid="'+esc(p.id)+'" data-aid="'+esc(a.id)+'">发布者胜</button>'+
        '<button type="button" data-win="challenger" data-pid="'+esc(p.id)+'" data-aid="'+esc(a.id)+'">挑战者胜</button></div>';
    }
  });
  var reply='';
  var pick='<option value="">选择角色 / 对手</option>',seenChar={};
  [p.char,p.target].forEach(function(x){
    x=String(x||'');
    if(!x||seenChar[x])return;
    seenChar[x]=1;
    pick+='<option value="'+esc(x)+'">'+esc(x)+'</option>';
  });
  if(ended){
    reply='<div class="db-reply-note">本场已裁定，帖子已移入历史。</div>';
  }else if(u&&isHost){
    if(hasChallengerArg){
      reply='<div class="db-reply db-reply-host"><input type="hidden" data-arg-char="1" value="'+esc(p.char)+'"><input data-arg-input="1" maxlength="300" placeholder="以「'+esc(p.char)+'」继续反击…"><button type="button" data-reply="'+esc(p.id)+'">反击</button></div>'+
        '<div class="db-reply-note">你是发布者，可以用自己的角色无限次反击；AI 每轮重新研判胜率。</div>';
    }else{
      reply='<div class="db-reply-note">这是你的论战，等待挑战者发言后再反击。</div>';
    }
  }else if(u&&!isHost){
    reply='<div class="db-reply"><select data-arg-char="1">'+pick+'</select><input data-arg-input="1" maxlength="300" placeholder="发表你的言论，和发布者论战…"><button type="button" data-reply="'+esc(p.id)+'">发言</button></div>'+
      '<div class="db-reply-note">只能选择帖主指定的角色或对手；双方可无限次发言，AI 每轮给出胜率，管理员裁定胜负。</div>';
  }else{
    reply='<div class="db-reply-note">登录后可以发言，和发布者论战。</div>';
  }
  return '<article class="db-post" data-post="'+esc(p.id)+'">'+
    '<div class="db-post-h"><span class="db-ava">◆</span><div class="db-who"><b>'+esc(p.host?p.host.name:p.user)+'</b><em>'+esc(p.host?p.host.rank:'')+' · EXP '+esc(p.host?p.host.exp:0)+' · 胜 '+esc(p.host?p.host.wins:0)+' / 负 '+esc(p.host?p.host.losses:0)+'</em></div>'+
    '<span class="db-status '+(ended?'':'open')+'">'+(ended?'CLOSED':'OPEN')+'</span>'+
    (canDel?'<button type="button" class="db-del" data-del="'+esc(p.id)+'">删除</button>':'')+'</div>'+
    '<div class="db-match"><b>「'+esc(p.char)+'」</b><i>CHALLENGE</i><span>挑战「'+esc(p.target)+'」</span></div>'+
    (p.body?'<p class="db-body">'+esc(p.body)+'</p>':'')+
    '<div class="db-meta">'+esc(p.time)+(pending?' · '+pending+' 条待裁定':'')+'</div>'+
    '<div class="db-args"><div class="db-args-h"><b>ARGUMENTS / '+((p.args||[]).length)+'</b><span>'+(pending?'等待管理员':'已全部裁定')+'</span></div>'+
    (args||'<div class="db-reply-note">还没有人发言。登录后成为第一个挑战者。</div>')+reply+'</div></article>';
}
function renderList(){
  var box=$('dbList'),cnt=$('dbCount');if(!box)return;
  var u=me();
  if(state.loading){box.innerHTML='<div class="db-empty">正在读取论战档案…</div>';if(cnt)cnt.textContent='读取中…';return}
  if(!state.posts.length){box.innerHTML='<div class="db-empty">还没有论战。登录后发起第一场。</div>';if(cnt)cnt.textContent='0 帖';return}
  var active=[],history=[];
  state.posts.forEach(function(p){
    var ended=p.status==='closed'||((p.args||[]).length>0&&(p.args||[]).every(function(a){return !!a.result}));
    if(ended)history.push(p);else active.push(p);
  });
  var html=active.map(function(p){return postHTML(p,u)}).join('');
  if(history.length){
    html+='<div class="db-history-head"><b>HISTORY / 历史</b><span>已裁定 · 共 '+history.length+' 帖</span></div>';
    html+=history.map(function(p){return postHTML(p,u)}).join('');
  }
  box.innerHTML=html||'<div class="db-empty">还没有论战。登录后发起第一场。</div>';
  if(cnt){
    var pending=0;
    state.posts.forEach(function(p){(p.args||[]).forEach(function(a){if(!a.result)pending++})});
    cnt.textContent=state.posts.length+' 帖 · '+(active.length)+' 进行中 · '+history.length+' 帖历史 · '+pending+' 条待裁定'+(state.local?' · 本机':'');
  }
}
function checkVerdicts(){
  var u=me();if(!u)return;
  var seen={};
  try{seen=JSON.parse(localStorage.getItem('wz_debate_pop')||'{}')}catch(e){seen={}}
  for(var i=0;i<state.posts.length;i++){
    var p=state.posts[i];
    for(var j=0;j<(p.args||[]).length;j++){
      var a=p.args[j],ai=a.ai||{};
      if(!ai.loser||ai.host_win===undefined)continue;
      if(u.username!==p.user&&!(p.args||[]).some(function(x){return x.user===u.username}))continue;
      if(seen[u.username+'::'+a.id])continue;
      var loserChar=ai.loser==='host'?p.char:(ai.loser==='challenger'?(a.side==='host'?chCharBefore(p,a):(a.char||'')):'');
      if(!loserChar)continue;
      seen[u.username+'::'+a.id]=1;
      try{localStorage.setItem('wz_debate_pop',JSON.stringify(seen))}catch(e){}
      showVerdict(loserChar);
      return;
    }
  }
}
function showVerdict(char){
  var box=$('dbVerdict'),tx=$('dbVerdictText');if(!box||!tx)return;
  tx.textContent='所以说，是“'+char+'”赢了！';
  box.classList.add('on');document.body.classList.add('db-verdict-lock');
}
function closeVerdict(){
  var box=$('dbVerdict');if(!box||!box.classList.contains('on'))return;
  box.classList.remove('on');document.body.classList.remove('db-verdict-lock');
  checkVerdicts();
}
function renderAll(){renderLadder(state.profile?state.profile.rank_i:null);renderList();renderMe(state.profile,me());checkVerdicts()}

function syncLocalPosts(){
  var u=me();
  if(!u||state.local)return;
  var d=ldb();
  var cloud=state.posts.filter(function(p){return !p._local});
  var mine=d.posts.filter(function(p){return p.user===u.username});
  var same=function(a,b){
    return a.user===b.user&&a.char===b.char&&a.target===b.target&&(a.body||'')===(b.body||'');
  };
  var matched=mine.filter(function(p){return cloud.some(function(c){return same(c,p)})});
  if(matched.length){
    matched.forEach(function(p){d.posts=d.posts.filter(function(x){return x.id!==p.id})});
    lsave(d);
  }
  var pending=mine.filter(function(p){
    return !cloud.some(function(c){return same(c,p)})&&!matched.some(function(m){return m.id===p.id});
  });
  if(!pending.length)return;
  var p=pending[0];
  callApi('/debate_add',{char:p.char,target:p.target,body:p.body}).then(function(j){
    if(!j||!j.ok||j._local)return;
    var d2=ldb();
    d2.posts=d2.posts.filter(function(x){return x.id!==p.id});
    lsave(d2);
    say('本机论战已同步到云端',true);
    load();
  }).catch(function(){});
}

/* ---------- 数据 ---------- */
function load(silent){
  if(!silent){state.loading=true;renderList();}
  var local=localApi('/debate_list',{});
  callApi('/debate_list',{limit:50}).then(function(j){
    if(!j||!j.ok) throw new Error(j&&j.msg?j.msg:'读取失败');
    var posts=(j.posts||[]).slice(),ids={};
    posts.forEach(function(p){ids[p.id]=1});
    (local.posts||[]).forEach(function(p){if(!ids[p.id])posts.push(p)});
    posts.sort(function(a,b){return (b.time||'').localeCompare(a.time||'')});
    state.posts=posts;
    state.loading=false;
    renderAll();
    refreshProfile();
    syncLocalPosts();
  }).catch(function(e){
    state.posts=local.posts||[];
    state.local=true;state.loading=false;
    renderAll();
    if($('dbCount'))$('dbCount').textContent=(state.posts.length||0)+' 帖 · 云端未连接，暂存本机';
  });
}
function refreshProfile(){
  var u=me();
  if(!u){state.profile=null;renderMe(null,null);renderLadder(null);return}
  callApi('/debate_profile',{}).then(function(j){
    if(!j||!j.ok) throw new Error(j&&j.msg?j.msg:'读取失败');
    state.profile=j.profile||null;
    renderMe(state.profile,u);renderLadder(state.profile?state.profile.rank_i:null);
    if(!state.local)renderList();
  }).catch(function(){
    state.profile=localApi('/debate_profile',{}).profile||null;
    renderMe(state.profile,u);renderLadder(state.profile?state.profile.rank_i:null);
  });
}

/* ---------- 交互 ---------- */
function publish(e){
  if(e)e.preventDefault();
  var u=me();
  if(!u){say('请先登录再发起论战',false);return}
  var c=$('dbChar').value.trim(),t=$('dbTarget').value.trim(),b=$('dbBody').value.trim();
  if(!c||!t){say('角色和挑战目标都要填',false);return}
  var btn=$('dbPublish');btn.disabled=true;btn.textContent='发布中…';
  callApi('/debate_add',{char:c,target:t,body:b}).then(function(j){
    btn.disabled=false;btn.textContent='发布论战';
    if(!j.ok){say(j.msg||'发布失败',false);return}
    $('dbChar').value='';$('dbTarget').value='';$('dbBody').value='';
    say(j.msg||'论战已发布',true);load();
  }).catch(function(err){
    btn.disabled=false;btn.textContent='发布论战';
    say('发布失败：'+errText(err),false);
  });
}
function reply(pid,btn){
  var u=me();
  if(!u){say('请先登录再发言',false);return}
  var wrap=btn.closest('.db-reply'),input=wrap?wrap.querySelector('[data-arg-input]'):null;
  var charInput=wrap?wrap.querySelector('[data-arg-char]'):null;
  var hostReply=!!(wrap&&wrap.className.indexOf('db-reply-host')>=0);
  var idle=hostReply?'反击':'发言';
  var text=input?input.value.trim():'',char=charInput?charInput.value.trim():'';
  if(!char){say('先填写你的角色名',false);return}
  if(!text){say('先写点言论',false);return}
  btn.disabled=true;btn.textContent='发送中…';
  callApi('/debate_arg',{pid:pid,text:text,char:char}).then(function(j){
    btn.disabled=false;btn.textContent=idle;
    if(!j.ok){say(j.msg||'发言失败',false);return}
    if(input)input.value='';
    if(charInput)charInput.value='';
    say((j.msg||'发言已提交')+' · AI 研判中',true);
    load();
    runAI(pid,j.id);
  }).catch(function(err){
    btn.disabled=false;btn.textContent=idle;
    say('发言失败：'+errText(err),false);
  });
}
function runAI(pid,aid){
  say('AI 正在研判本轮…',null);
  callApi('/debate_ai',{pid:pid,aid:aid}).then(function(j){
    if(j&&j.pending){
      say('AI 研判中，稍后自动刷新…',null);
      setTimeout(function(){load(true)},5000);
      setTimeout(function(){load(true)},12000);
      return;
    }
    if(!j||!j.ok){say('AI 研判不可用：'+((j&&j.msg)||'云端未连接'),false);return}
    say('AI 研判完成 · 本轮胜率已更新',true);load();
  }).catch(function(err){
    say('AI 研判失败：'+errText(err),false);
  });
}
function removePost(pid,btn){
  var u=me();
  if(!u){say('请先登录再删除',false);return}
  if(!confirm('确定删除这张论战帖？发言与裁定记录会一起删除。'))return;
  btn.disabled=true;btn.textContent='删除中…';
  callApi('/debate_del',{pid:pid}).then(function(j){
    btn.disabled=false;btn.textContent='删除';
    if(!j.ok){say(j.msg||'删除失败',false);return}
    say(j.msg||'论战帖已删除',true);load();
  }).catch(function(err){
    btn.disabled=false;btn.textContent='删除';
    say('删除失败：'+errText(err),false);
  });
}
function resolve(pid,aid,win,btn){
  var u=me();
  if(!u||!u.is_admin){say('只有管理员可以定胜负',false);return}
  btn.disabled=true;btn.textContent='裁定中…';
  callApi('/debate_resolve',{pid:pid,aid:aid,winner:win}).then(function(j){
    btn.disabled=false;btn.textContent=win==='host'?'发布者胜':'挑战者胜';
    if(!j.ok){say(j.msg||'裁定失败',false);return}
    say(j.msg||'胜负已记录',true);load();
  }).catch(function(err){
    btn.disabled=false;btn.textContent=win==='host'?'发布者胜':'挑战者胜';
    say('裁定失败：'+errText(err),false);
  });
}

function bind(){
  var form=$('dbForm');if(form)form.addEventListener('submit',publish);
  var list=$('dbList');
  if(list){
    list.addEventListener('click',function(e){
      var del=e.target.closest('[data-del]');
      if(del){removePost(del.getAttribute('data-del'),del);return}
      var rb=e.target.closest('[data-reply]');
      if(rb){reply(rb.getAttribute('data-reply'),rb);return}
      var win=e.target.closest('[data-win]');
      if(win){resolve(win.getAttribute('data-pid'),win.getAttribute('data-aid'),win.getAttribute('data-win'),win);return}
    });
    list.addEventListener('keydown',function(e){
      if(e.key!=='Enter')return;
      var input=e.target.closest('[data-arg-input]');
      if(!input)return;
      e.preventDefault();
      var wrap=input.closest('.db-reply'),btn=wrap?wrap.querySelector('[data-reply]'):null;
      if(btn)reply(btn.getAttribute('data-reply'),btn);
    });
  }
  document.addEventListener('wz:auth',function(){refreshProfile();renderList()});
  window.addEventListener('storage',function(e){if(e.key===LKEY){load()}});
  var verdict=$('dbVerdict');
  if(verdict)verdict.addEventListener('click',function(e){if(e.target.closest('[data-verdict-close]'))closeVerdict()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeVerdict()});
  setInterval(function(){
    if(document.hidden)return;
    var list=$('dbList');
    if(list&&list.contains(document.activeElement))return;
    load(true);
  },18000);
}
function boot(){
  if(!$('debate')||!window.WZCM)return;
  renderLadder(null);
  bind();
  renderMe(null,me());
  if(location.hash==='#debate')setTimeout(function(){var d=$('debate');if(d)d.scrollIntoView({behavior:'smooth',block:'start'})},80);
  load();
}
boot();

})();
