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
var state={posts:[],profile:null,local:false,loading:false,card:'',code:'',arc:''};

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
    var c=String(p.char||'').trim().slice(0,24),t=String(p.target||'').trim().slice(0,30),b=String(p.body||'').trim().slice(0,300),card=String(p.card||'').trim().slice(0,600),code=String(p.code||'').trim().slice(0,300),arc=String(p.arc||'').trim().slice(0,300);
    if(!c||!t) return {ok:false,msg:'角色和挑战目标不能为空'};
    var id=rid('dl');
    d.users[u.username]=d.users[u.username]||{exp:0,wins:0,losses:0};
    d.posts.push({id:id,user:u.username,char:c,target:t,body:b,card:card,code:code,arc:arc,time:now(),status:'open',args:[]});
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
    if(post.status==='closed') return {ok:false,msg:'该论战已封盘'};
    if(post.status==='closed'||post.winner) return {ok:false,msg:'本场已判定终局'};
    var chN=args.filter(function(a){return (a.side||'challenger')==='challenger'}).length;
    var hostN=args.length-chN;
    if(isHost){
      if(chN<=hostN) return {ok:false,msg:'等待挑战者发言后再反击'};
      char=post.char;side='host';
    }else{
      if(post.challenger&&post.challenger!==u.username) return {ok:false,msg:'本场已由 '+post.challenger+' 应战，无法再加入'};
      if(chN>hostN) return {ok:false,msg:'等待发布者反击后再发言'};
      if(!char) return {ok:false,msg:'请选择你的角色'};
      if([post.char,post.target].indexOf(char)<0) return {ok:false,msg:'只能选择帖主指定的角色或对手'};
      post.challenger=u.username;
    }
    if(!char) return {ok:false,msg:'请填写你的角色名'};
    var aid=rid('da');
    d.users[u.username]=d.users[u.username]||{exp:0,wins:0,losses:0};
    post.args=args;
    post.args.push({id:aid,user:u.username,char:char,text:text,time:now(),side:side,result:'',host_delta:null,ch_delta:null,resolved_at:'',ai:{}});
    lsave(d);
    return {ok:true,msg:(side==='host'?'反击':'发言')+'已加入论战 · 本机暂存',id:aid,side:side,_local:true};
  }
  if(path==='/debate_resolve'){
    return {ok:false,msg:'论战胜负由 AI 自动裁定；本机离线模式不结算',_local:true};
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
  var cls='db-arg'+((a.result==='host'||a.result==='challenger')?(a.result===speaker?' win':' lose'):(a.result?' draw':''));
  var res=a.result==='host'?'发布者胜':(a.result==='challenger'?'挑战者胜':(a.result==='draw'?'平局':(a.result==='void'?'无效':'')));
  var deltaTxt='';
  if(a.result&&(a.host_delta!=null||a.ch_delta!=null)){
    deltaTxt='发布者 '+(a.host_delta>0?'+':'')+(a.host_delta==null?'':a.host_delta)+' / 挑战者 '+(a.ch_delta>0?'+':'')+(a.ch_delta==null?'':a.ch_delta);
  }
  return '<div class="'+cls+'">'+
    '<div class="db-arg-h"><b>'+esc(a.author?a.author.name:a.user)+'</b><em>'+esc(a.author?a.author.rank:'')+' · '+escapeExp(a.author)+(a.char?' · 角色「'+esc(a.char)+'」':'')+' · '+(a.side==='host'?'发布者':'挑战者')+(a.ai_player?' · AI 陪练':'')+'</em>'+
    (res?'<span class="db-result '+esc(a.result)+'">'+res+'</span>':'')+'</div>'+
    '<p>'+esc(a.text)+'</p>'+
    (a.ai_player?'':pkHTML(a,hostChar,chChar))+
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
function betHTML(p,u,ended){
  if(state.local||!u||ended)return '';
  var mk=p.market||{};
  var total=+mk.total||0,ph=+mk.pool_host||0,pc=+mk.pool_ch||0;
  var open=!!mk.open&&!p.ai_spar&&!ended;
  var st=mk.settled?'已结算':(open?'下注中':'已封盘');
  var head='<div class="db-bet-h"><span>盘口 / MARKET</span><em>'+st+' · 抽水 8% 销毁</em></div>';
  if(p.ai_spar){
    return '<div class="db-bet">'+head+'<div class="db-bet-tip">AI 陪练场不开放竞猜。</div></div>';
  }
  var participant=(p.user===u.username)||(p.challenger&&p.challenger===u.username);
  var odds='';
  if(total>0){
    odds='<div class="db-bet-odds">'+
      '<span>发布者池 <b>'+ph+'</b> 分 · 赔率 '+(ph?'×'+mk.host_odds:'—')+' · '+esc(mk.host_count||0)+' 人</span>'+
      '<span>挑战者池 <b>'+pc+'</b> 分 · 赔率 '+(pc?'×'+mk.ch_odds:'—')+' · '+esc(mk.ch_count||0)+' 人</span>'+
      '</div>';
  }else{
    odds='<div class="db-bet-odds"><span>暂无下注 · 发帖后、挑战者发言前可下注</span></div>';
  }
  var mine='';
  if(mk.my_bet){
    mine='<div class="db-bet-mine">你已押 '+esc(mk.my_bet.amount)+' 分 · '+(mk.my_bet.side==='host'?'发布者胜':'挑战者胜')+'</div>';
  }
  var body='';
  if(open&&participant){
    mine='<div class="db-bet-mine">你是本场参与者，不能下注。</div>';
  }else if(open&&!mk.my_bet){
    body='<div class="db-bet-row"><input type="number" min="1" max="50" step="1" value="10" data-bet-amount="1">'+
      '<button type="button" data-bet="host" data-pid="'+esc(p.id)+'">押发布者</button>'+
      '<button type="button" data-bet="challenger" data-pid="'+esc(p.id)+'">押挑战者</button></div>';
  }
  var tip='<div class="db-bet-tip">彩池赔率：赢家按押注占比分输家池；单注 1~50 分且不超过当日所得/余额的 50%；一人一边、不可重复；平局/无效全退不抽水。</div>';
  return '<div class="db-bet">'+head+odds+mine+body+tip+'</div>';
}
function postHTML(p,u){
  var isHost=!!(u&&p.user===u.username);
  var admin=!!(u&&u.is_admin);
  var canDel=!!(u&&(isHost||admin));
  var ended=p.status==='closed'||!!p.winner;
  var pending=0,sh=0,sc=0;
  (p.args||[]).forEach(function(a){
    if(!a.result&&!a.ai)pending++;
    if(a.result==='host')sh++;
    else if(a.result==='challenger')sc++;
  });
  if(typeof p.score_host==='number')sh=p.score_host;
  if(typeof p.score_ch==='number')sc=p.score_ch;
  var winner=p.winner||'';
  var winTxt=winner==='host'?'发布者胜':(winner==='challenger'?'挑战者胜':(winner==='draw'?'平局':(winner==='void'?'无效':'')));
  var scoreTxt='AI '+sh+' : '+sc;
  var argsLen=(p.args||[]).length;
  var aiSpar=!!p.ai_spar;
  var verdict=p.ai_verdict||{};
  var args='',hasChallengerArg=false;
  (p.args||[]).forEach(function(a){
    if((a.side||'challenger')==='challenger')hasChallengerArg=true;
    var opp=a.side==='host'?chCharBefore(p,a):(a.char||'');
    args+=argHTML(a,p.char,opp);
    if(!a.result&&!a.ai){
      args+='<div class="db-aiwait"><span>MACHINE VERDICT</span><b>'+(a.ai_state==='error'?'AI 暂不可用，自动重试中':'AI 研判中…')+'</b></div>';
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
    reply='<div class="db-reply-note">'+(winTxt?('AI 判定：'+winTxt+'。'):'')+'帖子已移入历史。</div>';
  }else if(u&&isHost){
    if(aiSpar&&!hasChallengerArg){
      reply='<div class="db-reply-note">AI 陪练正在组织开场发言…</div>';
    }else if(hasChallengerArg){
      reply='<div class="db-reply db-reply-host"><input type="hidden" data-arg-char="1" value="'+esc(p.char)+'"><input data-arg-input="1" maxlength="300" placeholder="以「'+esc(p.char)+'」反击…"><button type="button" data-reply="'+esc(p.id)+'">反击</button></div>'+
        '<div class="db-reply-note">不限回合：双方交替发言，AI 判定一方已无翻盘可能时自动收场。</div>';
    }else{
      reply='<div class="db-reply-note">等待挑战者发言后再反击。没人应战可以让 AI 当陪练。</div>'+
        (state.local?'':'<div class="db-spar"><button type="button" data-spar="'+esc(p.id)+'">召唤 AI 陪练</button><span>以「'+esc(p.target)+'」身份接战，不计经验、不开放竞猜</span></div>');
    }
  }else if(u&&!isHost){
    if(aiSpar){
      reply='<div class="db-reply-note">本场由 AI 陪练接战，其他账号无法加入。</div>';
    }else if(p.challenger&&p.challenger!==u.username){
      reply='<div class="db-reply-note">本场已由「'+esc(p.challenger)+'」应战，其他账号无法再加入。</div>';
    }else{
      reply='<div class="db-reply"><select data-arg-char="1">'+pick+'</select><input data-arg-input="1" maxlength="300" placeholder="发表你的言论，和发布者论战…"><button type="button" data-reply="'+esc(p.id)+'">发言</button></div>'+
        '<div class="db-reply-note">一场论战只允许一位挑战者；挑战者先发言，之后双方交替，不限回合，AI 判定终局后自动结算。</div>';
    }
  }else{
    reply='<div class="db-reply-note">登录后可以发言，和发布者论战。</div>';
  }
  var bet=betHTML(p,u,ended);
  return '<article class="db-post" data-post="'+esc(p.id)+'">'+
    '<div class="db-post-h"><span class="db-ava">◆</span><div class="db-who"><b>'+esc(p.host?p.host.name:p.user)+'</b><em>'+esc(p.host?p.host.rank:'')+' · EXP '+esc(p.host?p.host.exp:0)+' · 胜 '+esc(p.host?p.host.wins:0)+' / 负 '+esc(p.host?p.host.losses:0)+'</em></div>'+
    '<span class="db-status '+(ended?'':'open')+'">'+(ended?'CLOSED':'OPEN')+'</span>'+
    (canDel?'<button type="button" class="db-del" data-del="'+esc(p.id)+'">删除</button>':'')+'</div>'+
    '<div class="db-match"><b>「'+esc(p.char)+'」</b><i>CHALLENGE</i><span>挑战「'+esc(p.target)+'」</span>'+(aiSpar?'<em class="db-spar-tag">AI 陪练</em>':'')+'</div>'+
    (p.body?'<p class="db-body">'+esc(p.body)+'</p>':'')+
    '<div class="db-meta">'+esc(p.time)+' · '+scoreTxt+' · 发言 '+argsLen+(pending?' · '+pending+' 条待 AI 研判':'')+
      (ended?(winTxt?' · '+winTxt+' · 已结算':' · 已封盘'):' · AI 持续研判，未到终局')+'</div>'+
    '<div class="db-args"><div class="db-args-h"><b>ARGUMENTS / '+argsLen+'</b><span>'+(ended?'AI 已判定终局':(pending?'AI 研判中':'AI 已研判，继续论战'))+'</span></div>'+
    (args||'<div class="db-reply-note">还没有人发言。登录后成为第一个挑战者。</div>')+bet+reply+'</div></article>';
}
function renderList(){
  var box=$('dbList'),cnt=$('dbCount');if(!box)return;
  var u=me();
  if(state.loading){box.innerHTML='<div class="db-empty">正在读取论战档案…</div>';if(cnt)cnt.textContent='读取中…';return}
  if(!state.posts.length){box.innerHTML='<div class="db-empty">还没有论战。登录后发起第一场。</div>';if(cnt)cnt.textContent='0 帖';return}
  var active=[],history=[];
  state.posts.forEach(function(p){
    var ended=p.status==='closed'||!!p.winner;
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
    state.posts.forEach(function(p){(p.args||[]).forEach(function(a){if(!a.result&&!a.ai)pending++})});
    cnt.textContent=state.posts.length+' 帖 · '+(active.length)+' 进行中 · '+history.length+' 帖历史 · '+pending+' 条待 AI 研判'+(state.local?' · 本机':'');
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
  callApi('/debate_add',{char:p.char,target:p.target,body:p.body,card:p.card||'',code:p.code||'',arc:p.arc||''}).then(function(j){
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
  callApi('/debate_list',{limit:50,sort:'hot'}).then(function(j){
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
  callApi('/debate_add',{char:c,target:t,body:b,card:state.card||'',code:state.code||'',arc:state.arc||''}).then(function(j){
    btn.disabled=false;btn.textContent='发布论战';
    if(!j.ok){say(j.msg||'发布失败',false);return}
    $('dbChar').value='';$('dbTarget').value='';$('dbBody').value='';state.card='';state.code='';state.arc='';
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
function placeBet(pid,pick,btn){
  var u=me();
  if(!u){say('请先登录再下注',false);return}
  if(state.local){say('本机模式不支持竞猜',false);return}
  var wrap=btn.closest('.db-bet'),input=wrap?wrap.querySelector('[data-bet-amount]'):null;
  var amount=parseInt(input?input.value:'',10);
  if(!amount||amount<1||amount>50){say('单注积分需在 1~50 之间',false);return}
  var btns=wrap?wrap.querySelectorAll('button'):[btn];
  for(var i=0;i<btns.length;i++)btns[i].disabled=true;
  callApi('/debate_bet',{pid:pid,pick:pick,amount:amount}).then(function(j){
    for(var i=0;i<btns.length;i++)btns[i].disabled=false;
    if(!j.ok){say(j.msg||'下注失败',false);return}
    say(j.msg||'已下注',true);load();
  }).catch(function(err){
    for(var i=0;i<btns.length;i++)btns[i].disabled=false;
    say('下注失败：'+errText(err),false);
  });
}
function summonSpar(pid,btn){
  var u=me();
  if(!u){say('请先登录',false);return}
  if(state.local){say('本机模式不支持 AI 陪练',false);return}
  if(!confirm('召唤 AI 以「挑战目标」身份接战？AI 发言不计经验、不开放竞猜。'))return;
  btn.disabled=true;btn.textContent='召唤中…';
  callApi('/debate_ai_spar',{pid:pid}).then(function(j){
    btn.disabled=false;btn.textContent='召唤 AI 陪练';
    if(!j.ok){say(j.msg||'召唤失败',false);return}
    say(j.msg||'AI 陪练已接战',true);
    setTimeout(function(){load(true)},4000);
    setTimeout(function(){load(true)},12000);
    setTimeout(function(){load(true)},25000);
  }).catch(function(err){
    btn.disabled=false;btn.textContent='召唤 AI 陪练';
    say('召唤失败：'+errText(err),false);
  });
}
function bind(){
  var form=$('dbForm');if(form)form.addEventListener('submit',publish);  var list=$('dbList');
  if(list){
    list.addEventListener('click',function(e){
      var del=e.target.closest('[data-del]');
      if(del){removePost(del.getAttribute('data-del'),del);return}
      var rb=e.target.closest('[data-reply]');
      if(rb){reply(rb.getAttribute('data-reply'),rb);return}
      var bet=e.target.closest('[data-bet]');
      if(bet){placeBet(bet.getAttribute('data-pid'),bet.getAttribute('data-bet'),bet);return}
      var sp=e.target.closest('[data-spar]');
      if(sp){summonSpar(sp.getAttribute('data-spar'),sp);return}
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
window.__dbReload=load;
function prefillFromQuery(){
  try{
    var q=new URLSearchParams(location.search),c=q.get('char')||'',t=q.get('target')||'',b=q.get('body')||'',card=q.get('card')||'',code=q.get('code')||'',arc=q.get('arc')||'';
    if(c&&$('dbChar'))$('dbChar').value=c.slice(0,24);
    if(t&&$('dbTarget'))$('dbTarget').value=t.slice(0,30);
    if(b&&$('dbBody'))$('dbBody').value=b.slice(0,300);
    state.card=card.slice(0,600);state.code=code.slice(0,300);state.arc=arc.slice(0,300);
    if(c&&$('debate'))setTimeout(function(){$('debate').scrollIntoView({behavior:'smooth',block:'start'})},100);
    if(c)say('已从咒术轮盘预填角色卡，可直接发布论战',true);
  }catch(e){}
}
function boot(){
  if(!$('debate')||!window.WZCM)return;
  renderLadder(null);
  bind();
  prefillFromQuery();
  renderMe(null,me());
  if(location.hash==='#debate')setTimeout(function(){var d=$('debate');if(d)d.scrollIntoView({behavior:'smooth',block:'start'})},80);
  load();
}
boot();

})();
