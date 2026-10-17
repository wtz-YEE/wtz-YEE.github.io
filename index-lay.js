
/* ===== 时间碎片（每日 4 场 · 随机页面 · 随机位置） ===== */
(function(){
if(document.getElementById('tfragBtn'))return;
var DUR=30;
var TGP=['index.html','prts.html','守夜人论坛.html','卡塞尔学院官网.html','终端接口.html','机密终端.html','PRTS泰拉大典终端.html','莱茵生命终端.html','技能树.html','模组开发.html','解码器.html','guestwall.html','changelog.html','游戏-01.html','游戏-02.html','游戏-03.html','游戏-04.html','游戏-05.html','游戏-06.html','游戏-07.html','游戏-08.html'];
function tgh(s){var h=0;s=String(s);for(var i=0;i<s.length;i++)h=(h*131+s.charCodeAt(i))%100000007;return h}
function tgSlots(day){var a=[],i;for(i=0;i<4;i++)a.push(360+i*270+tgh(day+'#'+i)%240);return a}
function tgPage(sp){return TGP[tgh(sp+'@p')%TGP.length]}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function pageFile(){
  try{var m=decodeURIComponent(location.pathname.split('/').pop().split('?')[0]);if(m==='wtz-YEE.github.io'||m==='')m='index.html';return m}catch(e){return'index.html'}
}
window.apiBase=function apiBase(){
  try{var u=localStorage.getItem('gb_api_url')||'',a=(u||'').split('\n').filter(function(x){return x.indexOf('http')===0&&x.indexOf('36c3116e')<0});return (a[0]||'').replace(/\/+$/,'')}catch(e){return''}
}
function apiToken(){try{var s=JSON.parse(localStorage.getItem('gb_session')||'null');return (s&&s.token)||''}catch(e){return''}}
function call(path,payload){
  var b=apiBase();
  if(!b)return Promise.reject('no-cloud');
  var body=Object.assign({token:apiToken()},payload||{});
  var tried=[];
  function attempt(api){
    tried.push(api);
    return fetch(api+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(res){
      if(!res.ok)throw new Error('HTTP '+res.status);
      return res.json();
    }).catch(function(err){
      var u=(localStorage.getItem('gb_api_url')||'').split('\n').filter(function(x){return x.indexOf('http')===0&&x.indexOf('36c3116e')<0});
      var next=null;
      for(var i=0;i<u.length;i++) if(tried.indexOf(u[i])<0){next=u[i];break}
      if(next)return attempt(next);
      throw err;
    });
  }
  return attempt(b);
}
function pad(n){return (n<10?'0':'')+n}
function fmt(sec){
  sec=Math.max(0,Math.floor(sec));
  var h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;
  return (h?h+':'+pad(m):m)+':'+pad(s);
}
function slotNow(t){
  var day=t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());
  var v=t.getHours()*3600+t.getMinutes()*60+t.getSeconds();
  var sl=tgSlots(day),i;
  for(i=0;i<sl.length;i++){var lo=sl[i]*60;if(v>=lo&&v<lo+DUR*60)return i}
  return -1;
}
function nextAt(t){
  var day=t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());
  var v=t.getHours()*3600+t.getMinutes()*60+t.getSeconds();
  var sl=tgSlots(day),i;
  for(i=0;i<sl.length;i++){if(v<sl[i]*60)return sl[i]*60-v}
  var nd=new Date(t.getTime()+86400000);
  var d2=nd.getFullYear()+'-'+pad(nd.getMonth()+1)+'-'+pad(nd.getDate());
  return 86400-v+tgSlots(d2)[0]*60;
}
function accent(){return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#fff'}
window.toast=function toast(txt,sub){
  var d=document.createElement('div');
  d.innerHTML='<b style="display:block;letter-spacing:.14em">'+esc(txt)+'</b>'+(sub?'<span style="display:block;margin-top:6px;color:#9a9a9a;font-size:11.5px">'+esc(sub)+'</span>':'');
  d.style.cssText='position:fixed;left:50%;bottom:96px;transform:translate(-50%,14px);opacity:0;z-index:2147483000;background:rgba(8,10,12,.96);border:1px solid var(--accent,#fff);color:var(--accent,#fff);padding:12px 22px;font-family:Consolas,monospace;font-size:12.5px;text-align:center;pointer-events:none;max-width:82vw;line-height:1.8;transition:transform .3s cubic-bezier(.22,1,.36,1),opacity .3s';
  document.body.appendChild(d);
  requestAnimationFrame(function(){requestAnimationFrame(function(){d.style.transform='translate(-50%,0)';d.style.opacity='1'})});
  setTimeout(function(){d.style.transition='opacity .6s';d.style.opacity='0'},2400);
  setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d)},3100);
}
var S={open:false,left:0,next:0,spawn:'',page:'',caught:false,count:0};
var TFG=null,TFGH='';
var tick=null;
function poll(){
  call('/tfrag',{}).then(function(j){
    if(!j||!j.ok)return;
    S.open=!!j.open;S.left=j.left||0;S.next=j.next||0;
    S.spawn=j.spawn||'';S.page=j.page||'';S.caught=!!j.caught_today;S.count=j.count||0;
    TFGWatch();
    if(window.__tfPanel)window.__tfPanel();
  }).catch(function(){});
}
function TFGWatch(){
  var want=S.open&&!S.caught&&S.page;
  if(!want){if(TFG){TFG.parentNode.removeChild(TFG);TFG=null}return}
  if(S.page!==pageFile()){
    if(TFGH!==S.spawn){TFGH=S.spawn;toast('\u23f1 时间碎片出现了','它正在「'+S.page.replace('.html','')+'」颤动')}
    if(TFG){TFG.parentNode.removeChild(TFG);TFG=null}
    return
  }
  if(TFG)return;
  if(!document.getElementById('tfgkey')){
    var st=document.createElement('style');st.id='tfgkey';
    st.textContent='@keyframes tfgp{0%,100%{transform:scale(1);opacity:.75}50%{transform:scale(1.3);opacity:1}}';
    document.head.appendChild(st);
  }
  var w=window.innerWidth||1200,h=window.innerHeight||800;
  var x=60+tgh(S.spawn+'x')%Math.max(60,w-170);
  var y=70+tgh(S.spawn+'y')%Math.max(60,h-240);
  if(x<140&&y>h-210)x=Math.min(w-50,150+tgh(S.spawn+'z')%140);
  TFG=document.createElement('button');TFG.type='button';TFG.title='时间碎片 ·正在颤动';
  TFG.style.cssText='position:fixed;left:'+Math.round(x)+'px;top:'+Math.round(y)+'px;z-index:2147482500;width:16px;height:16px;padding:0;background:none;border:1px solid var(--accent,#fff);border-radius:50%;box-shadow:0 0 9px var(--accent,#fff);cursor:pointer;animation:tfgp 1.6s ease-in-out infinite';
  TFG.onclick=function(){catchIt(null)};
  document.body.appendChild(TFG);
}
window.addEventListener('resize',function(){
  if(!TFG)return;
  var w=window.innerWidth||1200,h=window.innerHeight||800;
  TFG.style.left=Math.min(Math.max(20,parseFloat(TFG.style.left)),w-40)+'px';
  TFG.style.top=Math.min(Math.max(50,parseFloat(TFG.style.top)),h-60)+'px';
});
function catchIt(btn){
  var old=btn?btn.textContent:'';
  if(btn){btn.disabled=true;btn.textContent='收集中…'}
  call('/tfrag_catch',{page:pageFile()},'POST').then(function(j){
    if(!j||!j.ok){toast(j&&j.msg||'收不到',j&&j.page?'它正在「'+j.page.replace('.html','')+'」颤动':(j&&j.next!=null?'下一场 '+fmt(j.next)+' 后':'这一场已经过去了'));return}
    if(j.new===false){toast('\u23f1 错过这一场','下一场会再出现');return}
    S.caught=true;
    var fr=TFG?TFG.getBoundingClientRect():null;
    if(TFG){TFG.parentNode.removeChild(TFG);TFG=null}
    if(window.fragFx){var fx=fr?fr:(btn?btn.getBoundingClientRect():null);if(fx)window.fragFx(fx.left+fx.width/2,fx.top+fx.height/2)}
    toast('\u23f1 '+j.name,j.desc+'　+15 积分 / +12 经验');
  }).catch(function(){toast('\u23f1 收集中断','云端没接上，稍后再试')})
    .then(function(){if(btn){btn.disabled=false;btn.textContent=old}});
}
function open(full){
  var mask=document.createElement('div');
  mask.style.cssText='position:fixed;inset:0;z-index:2147483100;background:rgba(4,5,6,.8);display:flex;align-items:center;justify-content:center;padding:18px';
  var box=document.createElement('div');
  box.style.cssText='width:min(560px,94vw);max-height:86vh;overflow-y:auto;background:#101214;border:1px solid var(--cbd,#3a3a3a);padding:20px 22px;box-sizing:border-box;font-family:Consolas,monospace';
  var st=document.createElement('div');
  var btn=document.createElement('button');
  btn.style.cssText='margin-top:16px;width:100%;border:1px solid var(--accent,#fff);background:none;color:var(--accent,#fff);padding:11px;font-family:Consolas,monospace;font-size:13px;letter-spacing:.16em;cursor:pointer';
  var cls=document.createElement('div');
  var tip=document.createElement('div');
  tip.style.cssText='color:#6e6e6e;font-size:11.5px;line-height:1.9;margin-top:12px';
  tip.innerHTML='每天随机 4 场、每场 '+DUR+' 分钟，出现时刻与页面由当天日期决定；到点后左下 ⏱ 会提示它在哪一页，去那页找一个会颤动的小圆点，点它收下。<br>由服务器时间判定，刷新不会重置；收下一枚 +15 积分 / +12 经验。';
  box.appendChild(st);box.appendChild(btn);
  if(full)box.appendChild(cls);
  box.appendChild(tip);
  var foot=document.createElement('div');
  foot.style.cssText='text-align:right;margin-top:16px';
  var cb=document.createElement('button');
  cb.textContent='关闭';
  cb.style.cssText='border:1px solid var(--cbd,#3a3a3a);background:none;color:#b8b8b8;padding:6px 18px;font-family:Consolas,monospace;font-size:11.5px;cursor:pointer';
  foot.appendChild(cb);box.appendChild(foot);
  mask.appendChild(box);
  mask.onclick=function(e){if(e.target===mask&&mask.parentNode)mask.parentNode.removeChild(mask)};
  cb.onclick=function(){if(mask.parentNode)mask.parentNode.removeChild(mask)};
  document.body.appendChild(mask);
  function paint(){
    if(!mask.parentNode)return false;
    if(S.open){
      st.innerHTML='<div style="font-size:13px;letter-spacing:.3em;color:var(--accent,#fff);margin-bottom:8px">TEMPORAL FRAGMENT</div>'+
        '<div style="font-size:12.5px;color:#e6edef;line-height:2">状态<span style="color:var(--accent,#fff)">正在出现</span><br>剩余　<b style="color:var(--accent,#fff)" id="tfLeft">'+fmt(S.left)+'</b><br>本次出现　「'+(S.page||'').replace('.html','')+'」<br>已收　'+S.count+' 枚'+(S.caught?'　（这一场已收下）':'')+'</div>';
      btn.textContent=S.caught?'这一场已经收过了':'收下这一枚';
      btn.style.borderColor='var(--accent,#fff)';btn.style.color='var(--accent,#fff)';btn.disabled=false;
    }else{
      st.innerHTML='<div style="font-size:13px;letter-spacing:.3em;color:var(--accent,#fff);margin-bottom:8px">TEMPORAL FRAGMENT</div>'+
        '<div style="font-size:12.5px;color:#e6edef;line-height:2">状态　<span style="color:#6e6e6e">现在没有</span><br>下一场　<b style="color:var(--accent,#fff)" id="tfLeft">'+fmt(S.next)+'</b> 后<br>已收　'+S.count+' 枚</div>';
      btn.textContent='还没到时间';btn.style.borderColor='#2c2c2c';btn.style.color='#5b5b5b';btn.disabled=true;
    }
    if(full){
      if(!cls.dataset.done){
        call('/frags',{}).then(function(j){
          if(!j||!j.ok)return;
          cls.dataset.done='1';
          var got={};for(var i=0;i<(j.mine||[]).length;i++)got[j.mine[i]]=1;
          var h='<div style="font-size:11px;color:#8a8a8a;margin:16px 0 10px">世界碎片 · 已收集 <b style="color:var(--accent,#fff)">'+(j.mine||[]).length+'</b> / '+(j.total||22)+'　（点各页角落那枚菱形收下）</div>'+
            '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(48px,1fr));gap:6px">';
          for(var k=1;k<=(j.total||22);k++){
            var on=!!got[k];
            h+='<div style="border:1px solid '+(on?'var(--accent,#fff)':'#2c2c2c')+';color:'+(on?'var(--accent,#fff)':'#5b5b5b')+';text-align:center;padding:8px 0;font-size:12px">'+(on?('#'+(k<10?'0':'')+k):'\u00b7')+'</div>';
          }
          cls.innerHTML=h+'</div>';
        }).catch(function(){});
      }
    }
    return true;
  }
  window.__tfPanel=paint;
  btn.onclick=function(){catchIt(btn)};
  paint();
  if(tick)clearInterval(tick);
  tick=setInterval(function(){if(!paint()){clearInterval(tick);tick=null;window.__tfPanel=null}},1000);
}
var b=document.createElement('button');
b.id='tfragBtn';b.type='button';b.title='时间碎片';
b.style.cssText='position:fixed;left:56px;bottom:74px;z-index:2147482000;width:34px;height:34px;background:rgba(8,10,12,.82);border:1px solid var(--cbd,var(--line2,#444));color:var(--accent,#fff);font-size:14px;line-height:1;cursor:pointer;font-family:Consolas,monospace;transition:.2s;opacity:.72';
b.textContent='\u23f1';
b.onmouseover=function(){b.style.opacity='1';b.style.borderColor='var(--accent,#fff)';b.title=slotNow(new Date())>=0?'时间碎片 ·正在出现':'时间碎片'};
b.onmouseout=function(){b.style.opacity='.72';b.title='时间碎片'};
b.onclick=function(){poll();open(pageFile()==='index.html')};
document.body.appendChild(b);
poll();
setInterval(poll,60000);
})();


(function(){
var LX=[['主站档案','▣','pages/prts.html','档案·技能·终端'],
 ['守夜人论坛','☰','pages/守夜人论坛.html','发帖·深夜开摆'],
 ['更新日志','≣','pages/changelog.html','版本与异动'],
 ['协作花园','✿','pages/花园.html','64 种植物'],
 ['武器锻造','⚒','pages/锻造.html','附魔词缀'],
 ['炼金工坊','⚗','pages/炼金.html','万物转化'],
 ['沉渊讨伐','⬇','pages/肉鸽.html','横板肉鸽'],
 ['密文解码','▤','pages/解码器.html','密文破译']];
var B=document.body;
var LS=document.getElementById('laySwitch');
var curLay=parseInt((function(){try{return localStorage.getItem('prts_lay')}catch(e){}})()||'1',10);
if(isNaN(curLay)||curLay<1||curLay>8)curLay=1;
var SP=document.getElementById('sphere'),SAim=document.getElementById('spAim'),SZ=document.getElementById('sphereView');
var R=Math.min(680,Math.max(540,Math.min(window.innerWidth,window.innerHeight)*0.58));
var SV={rx:10,ry:0,keys:{},on:false,aim:null,nodes:[],vel:{rx:0,ry:0}};
function mkStars(){
 if(!SZ||SZ.querySelector('.st'))return;
 var d=document.createElement('div');d.className='st';
 for(var k=0;k<3;k++){
  var l=document.createElement('i');l.className='st-l';
  for(var j=0;j<18;j++){
   var s=document.createElement('b');
   s.style.cssText='left:'+(Math.random()*2200-600)+'px;top:'+(Math.random()*2200-600)+'px;--z:'+(R+200+k*430)+'px;animation-delay:'+(Math.random()*1)+'s;animation-duration:'+(.5+Math.random()*1)+'s';
   l.appendChild(s);
  }
  d.appendChild(l);
 }
 SZ.appendChild(d);
}
function rotY(v,t){var c=Math.cos(t),s=Math.sin(t);return [c*v[0]+s*v[2],v[1],-s*v[0]+c*v[2]]}
function rotX(v,t){var c=Math.cos(t),s=Math.sin(t);return [v[0],c*v[1]-s*v[2],s*v[1]+c*v[2]]}
function aim(){
 if(!SP)return;
 var rx=SV.rx*Math.PI/180,ry=SV.ry*Math.PI/180;
 var best=null,bd=-1;
 for(var i=0;i<SV.nodes.length;i++){
  var d=SV.nodes[i];
  var n1=rotY([0,0,1],parseFloat(d.dataset.a));
  var n2=rotX(n1,parseFloat(d.dataset.b));
  var n3=rotY(n2,ry),n4=rotX(n3,rx);
  if(n4[2]<=0.05)continue;
  if(n4[2]>bd){bd=n4[2];best=d;}
 }
 for(var j=0;j<SV.nodes.length;j++)SV.nodes[j].classList.toggle('aim',SV.nodes[j]===best);
 if(SV.aim!==best){SV.aim=best;if(SAim)SAim.textContent=best?(best.querySelector('.sn-nm')||{}).textContent||'?':'—';var tip=document.querySelector('.sphere-tip');if(tip)tip.classList.toggle('lock',!!best);}
}
function tick(){
 if(!SV.on)return;
 var k=SV.keys,mv=false;
 if(k['w']||k['arrowup']){SV.vel.rx=Math.min(2.1,SV.vel.rx+.4);mv=true}
 if(k['s']||k['arrowdown']){SV.vel.rx=Math.max(-2.1,SV.vel.rx-.4);mv=true}
 if(k['a']||k['arrowleft']){SV.vel.ry=Math.min(2.1,SV.vel.ry+.4);mv=true}
 if(k['d']||k['arrowright']){SV.vel.ry=Math.max(-2.1,SV.vel.ry-.4);mv=true}
 if(!mv){SV.vel.rx*=.9;SV.vel.ry*=.9}
 SV.rx+=SV.vel.rx;SV.ry+=SV.vel.ry;
 if(SV.rx>75)SV.rx=75;if(SV.rx<-75)SV.rx=-75;
 if(SV.on){
  var prx='rotateX('+SV.rx+'deg) rotateY('+SV.ry+'deg)';
  if(SP)SP.style.transform=prx;
  var st=SZ?SZ.querySelector('.st'):null;
  if(st)st.style.transform=prx;
  var invY=(-SV.ry)+'deg',invX=(-SV.rx)+'deg';
  for(var i=0;i<SV.nodes.length;i++){
   var d=SV.nodes[i],a=parseFloat(d.dataset.a),b=parseFloat(d.dataset.b);
   d.style.transform='rotateY('+invY+') rotateX('+invX+') rotateY('+a+'rad) rotateX('+b+'rad) translateZ('+R+'px) rotateX('+(-b)+'rad) rotateY('+(-a)+'rad)';
  }
  aim();
 }
 requestAnimationFrame(tick);
}
SV.start=function(){SV.on=true;mkStars();aim();requestAnimationFrame(tick)};
SV.stop=function(){SV.on=false;SV.aim=null;var tip=document.querySelector('.sphere-tip');if(tip)tip.classList.remove('lock');if(SAim)SAim.textContent='—';var ns=SP?SP.children:[],i;for(i=0;i<ns.length;i++)ns[i].classList.remove('aim')};
document.addEventListener('visibilitychange',function(){if(document.hidden){if(SV.on)SV.stop()}else if(!SV.on&&curLay===3){SV.start()}});
function apply(n){
 for(var i=1;i<=8;i++)B.classList.remove('lay-'+i);
 B.classList.add('lay-'+n);
 B.classList.remove('lay-sw');void B.offsetWidth;B.classList.add('lay-sw');
 setTimeout(function(){B.classList.remove('lay-sw')},440);
 var bs=LS?LS.querySelectorAll('button'):[];
 for(var j=0;j<bs.length;j++)bs[j].classList.toggle('on',(j+1)===n);
 try{localStorage.setItem('prts_lay',String(n))}catch(e){}
 if(n===3)SV.start();else SV.stop();
}
if(SP&&SP.children.length===0){
 for(var i=0;i<LX.length;i++){
  var yy=1-(i/(LX.length-1))*2,rr=Math.sqrt(Math.max(0,1-yy*yy)),ph=i*2.399963;
  var a=Math.atan2(Math.cos(ph)*rr,Math.sin(ph)*rr),b=Math.asin(yy);
  var d=document.createElement('a');d.className='sphere-node';d.href=LX[i][2];
  d.dataset.a=a;d.dataset.b=b;
  d.innerHTML='<span class="sn-in"><span class="sn-fx"><span class="sn-ic">'+LX[i][1]+'</span><span class="sn-nm">'+LX[i][0]+'</span><span class="sn-ds">'+LX[i][3]+'</span></span></span>';
  d.style.transform='rotateY('+a+'rad) rotateX('+b+'rad) translateZ('+R+'px) rotateX('+(-b)+'rad) rotateY('+(-a)+'rad)';
  SP.appendChild(d);SV.nodes.push(d);
 }
}
if(LS){
 var LABS=['1现','2栏','3球','4舱','5行','6书','7流','8白'];
 for(var k=0;k<8;k++)(function(i){
  var b=document.createElement('button');b.type='button';b.title='首页布局 '+i;b.textContent=LABS[i-1];
  b.addEventListener('click',function(){curLay=i;apply(i)});
  LS.appendChild(b);
 })(k+1);
 apply(curLay);
}
var HN=document.getElementById('heroNav');
if(HN){
 var secs=[['入口',1],['工具',2],['社区',3],['设置',4]];
 for(var m=0;m<secs.length;m++)(function(s){
  var b=document.createElement('button');b.type='button';b.innerHTML='<span class="hn-ic">▸</span>'+s[0];
  b.addEventListener('click',function(){
   var t=document.querySelectorAll('.sec-tab'),q=document.querySelectorAll('.sec'),z;
   for(z=0;z<q.length;z++)q[z].style.display=(z+1)===s[1]?'':'none';
   for(z=0;z<t.length;z++)t[z].classList.toggle('on',(z+1)===s[1]);
  });
  HN.appendChild(b);
 })(secs[m]);
 var sd=document.createElement('div');sd.style.cssText='height:1px;background:var(--line);margin:10px 0';HN.appendChild(sd);
 for(var n=0;n<LX.length;n++){
  var a=document.createElement('a');a.href=LX[n][2];a.innerHTML='<span class="hn-ic">'+LX[n][1]+'</span>'+LX[n][0];
  HN.appendChild(a);
 }
}
document.addEventListener('keydown',function(e){
 var k=(e.key||'').toLowerCase();
 if(!SV.on)return;
 if(k===' '){if(SV.aim&&SV.aim.href){e.preventDefault();window.location.href=SV.aim.href}return}
 SV.keys[k]=true;
 if(k.indexOf('arrow')===0)e.preventDefault();
});
document.addEventListener('keyup',function(e){var k=(e.key||'').toLowerCase();SV.keys[k]=false});
if(SZ){
 SZ.addEventListener('click',function(e){
  if(e.target&&e.target.closest&&e.target.closest('.sphere-node'))return;
  if(SV.aim&&SV.aim.href)window.location.href=SV.aim.href;
 });
 var BK=document.getElementById('spBack');
 if(BK)BK.addEventListener('click',function(){curLay=1;apply(1)});
 window.addEventListener('resize',function(){if(SV.on)aim()});
}
})();
