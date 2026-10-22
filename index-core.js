
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

(function(){
function pz(){if(window.__pz)return;window.__pz=1;
try{document.documentElement.style.overflow='hidden'}catch(e){}
var d=document.createElement('div');d.id='pz';d.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#000;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-direction:column';
var c=document.createElement('canvas');c.width=window.innerWidth;c.height=window.innerHeight;c.style.cssText='position:absolute;inset:0;width:100%;height:100%';d.appendChild(c);
var t=document.createElement('div');t.style.cssText='position:relative;z-index:2;color:#f00;font:900 min(6vw,84px) Consolas,monospace;text-shadow:0 0 24px #f00;text-align:center;letter-spacing:.25em';t.innerHTML='&#31070;&#24323;&#20043;&#20154;&#26080;&#27861;&#36827;&#20837;&#27492;&#22320;';d.appendChild(t);
var sub=document.createElement('div');sub.style.cssText='position:relative;z-index:2;color:#fff;font:13px Consolas;margin-top:16px;opacity:.75;letter-spacing:.2em';sub.textContent='点击退出';d.appendChild(sub);
document.body.appendChild(d);
var ac=null;
function audio(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();var n=ac.sampleRate;var b=ac.createBuffer(1,n*2,n);var ch=b.getChannelData(0);for(var i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;var s=ac.createBufferSource();s.buffer=b;s.loop=true;var gn=ac.createGain();gn.gain.value=0.8;var f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=250;var wf=ac.createWaveShaper();var cu=new Float32Array(256);for(var k=0;k<256;k++){var x=k/128-1;cu[k]=Math.tanh(x*7)}wf.curve=cu;s.connect(wf);wf.connect(f);f.connect(gn);gn.connect(ac.destination);s.start();var o=ac.createOscillator();o.type='sawtooth';o.frequency.value=110;var og=ac.createGain();og.gain.value=0.55;o.connect(og);og.connect(ac.destination);o.start();ac.resume()}catch(e){}}
d.addEventListener('click',function(){audio();out()});d.addEventListener('touchstart',function(){audio();out()});audio();function out(){var f=document.createElement('div');f.style.cssText='position:absolute;inset:0;z-index:9;background:#fff;opacity:0;transition:.3s';d.appendChild(f);requestAnimationFrame(function(){f.style.opacity='1'});setTimeout(function(){try{window.close()}catch(e){}setTimeout(function(){try{document.body.innerHTML='<div style="position:fixed;inset:0;background:#000;color:#f00;display:flex;align-items:center;justify-content:center;font:700 min(5vw,46px) monospace;letter-spacing:.4em;text-align:center">已被驱逐 · 退出本站</div>'}catch(e){}},500)},350)}
var ctx=c.getContext('2d'),fr=0;
function glitch(){fr++;ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(0,0,c.width,c.height);for(var i=0;i<14;i++){var y=Math.random()*c.height,h=10+Math.random()*78,x=Math.random()*c.width;ctx.fillStyle='rgba('+(Math.random()>.5?255:0)+','+Math.floor(Math.random()*255)+','+(Math.random()>.5?255:0)+','+(0.4+Math.random()*0.5)+')';ctx.fillRect(x,y,c.width*Math.random(),h)}for(var i=0;i<9;i++){var sx=Math.random()*c.width,sy=Math.random()*c.height;ctx.fillStyle='rgba('+(Math.random()>.5?255:0)+','+Math.floor(Math.random()*255)+','+(Math.random()>.5?255:0)+',.6)';ctx.fillRect(sx,sy,Math.random()*70+10,Math.random()*70+10)}ctx.fillStyle='rgba(255,0,0,.95)';ctx.font='bold '+Math.floor(12+Math.random()*46)+'px monospace';for(var i=0;i<90;i++){ctx.fillText(String.fromCharCode(0x30A0+Math.floor(Math.random()*96)),Math.random()*c.width,Math.random()*c.height)}if(Math.random()<0.3){ctx.fillStyle='rgba(255,255,255,'+(0.05+Math.random()*0.15)+')';ctx.fillRect(0,0,c.width,c.height)}d.style.transform='translate('+Math.floor(Math.random()*42-21)+'px,'+Math.floor(Math.random()*42-21)+'px) skewX('+(Math.random()*14-7)+'deg) scale('+(1+Math.random()*0.07)+')';requestAnimationFrame(glitch)}
glitch();
var st=document.createElement('style');st.textContent='@keyframes pzFl{0%{opacity:.1}50%{opacity:.85}100%{opacity:.3}}';document.head.appendChild(st);
var fl=document.createElement('div');fl.style.cssText='position:fixed;inset:0;z-index:2147483646;background:rgba(255,0,0,.22);pointer-events:none;animation:pzFl .22s steps(2) infinite';document.body.appendChild(fl);
}
window.pz=pz;
var __f=window.fetch;
window.fetch=function(u,o){return __f(u,o).then(function(r){try{if(r&&r.status===403){var c=r.clone();c.json().then(function(j){if(j&&j.panic)pz()}).catch(function(){})}}catch(e){}return r})};
})();
(function(){var m=document.getElementById('fixMask');if(!m)return;fetch('https://wtz-YEE.github.io/cloud_fixing.txt?v='+Date.now(),{cache:'no-store'}).then(function(r){return r.text()}).then(function(t){var ls=String(t||'').split(/\r?\n/);if((ls[0]||'').trim().toLowerCase()==='t'){var rr=document.getElementById('fixReason'),ee=document.getElementById('fixEta');var rs=(ls[1]||'').trim(),es=(ls[2]||'').trim();if(rr) rr.textContent=rs||'系统维护 · 请稍后刷新页面';if(ee) ee.textContent=es?('预计恢复：'+es):'';m.style.display='flex';document.documentElement.style.overflow='hidden';}}).catch(function(){});})();
(function(){try{setTimeout(function(){var b=document.getElementById('boot');if(b&&b.style.display!=='none'&&!document.body.classList.contains('ready')){b.style.display='none';document.body.classList.add('ready')}},7000)}catch(e){}})();

(function(){
'use strict';

/* ===== 配色主题 ===== */
var THEMES=[
{id:'t1',n:'墨黑档案',d:'默认 · 档案室黑白',bg:'#0A0A0A',a:'#FFFFFF',card:'#222222',cbd:'#919191',cgl:'#FFFFFF'},
{id:'t2',n:'终端青',d:'青绿 · 复古终端',bg:'#0A1012',a:'#3FE0C8',card:'#22282A',cbd:'#278276',cgl:'#3FE0C8'},
{id:'t3',n:'烈焰橙',d:'暖橙 · 能量跃动',bg:'#120B07',a:'#FF8A3D',card:'#2A2320',cbd:'#945125',cgl:'#FF8A3D'},
{id:'t4',n:'深渊蓝',d:'冰蓝 · 深海回声',bg:'#070D16',a:'#4FA8FF',card:'#20252D',cbd:'#2F6296',cgl:'#4FA8FF'},
{id:'t5',n:'紫夜',d:'暗紫 · 秘夜徽记',bg:'#0E0916',a:'#B08CFF',card:'#26222D',cbd:'#675196',cgl:'#B08CFF'},
{id:'t6',n:'绯红',d:'红警 · 警戒终端',bg:'#14080C',a:'#FF5C7A',card:'#2C2124',cbd:'#953648',cgl:'#FF5C7A'},
{id:'t7',n:'琥珀金',d:'暖金 · 学院风格',bg:'#120E05',a:'#D4A643',card:'#2A261E',cbd:'#7D6227',cgl:'#D4A643'},
{id:'t8',n:'森林绿',d:'深林 · 生命跃动',bg:'#07110A',a:'#55E08A',card:'#202922',cbd:'#328350',cgl:'#55E08A'},
{id:'t9',n:'樱花粉',d:'粉调 · 轻语',bg:'#160A10',a:'#FF8FB3',card:'#2D2228',cbd:'#96536A',cgl:'#FF8FB3'},
{id:'t10',n:'电光紫',d:'电流 · 炫紫',bg:'#0B0614',a:'#8B5CF6',card:'#231F2C',cbd:'#513590',cgl:'#8B5CF6'},
{id:'t11',n:'荒漠金',d:'沙金 · 遗迹',bg:'#12100A',a:'#E0B86A',card:'#2A2822',cbd:'#836C3F',cgl:'#E0B86A'},
{id:'t12',n:'深海蓝',d:'墨蓝 · 沉潜',bg:'#07141A',a:'#33D6C0',card:'#202C31',cbd:'#1F7F75',cgl:'#33D6C0'},
{id:'t13',n:'血月',d:'暗红 · 禁忌',bg:'#160A0A',a:'#FF3B4D',card:'#2D2222',cbd:'#96252F',cgl:'#FF3B4D'},
{id:'t14',n:'晨光白',d:'亮色 · 纸白',bg:'#F2F0EA',a:'#B4532A',card:'#DAD8D3',cbd:'#D09A80',cgl:'#B4532A'},
{id:'t15',n:'雾钢',d:'亮色 · 冷钢',bg:'#E8EAEE',a:'#2B6CB0',card:'#D1D3D6',cbd:'#80A5CC',cgl:'#2B6CB0'},
{id:'t16',n:'极光',d:'极夜 · 流光',bg:'#070D1A',a:'#5CE8D8',card:'#202531',cbd:'#368582',cgl:'#5CE8D8'}
];
var TK='wz_theme';
function hexR(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function mix(h,f){var c=hexR(h);return 'rgb('+Math.round(c[0]+(255-c[0])*f)+','+Math.round(c[1]+(255-c[1])*f)+','+Math.round(c[2]+(255-c[2])*f)+')'}
function rgba(h,a){var c=hexR(h);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'}
function lum(h){var c=hexR(h);return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]}
function setV(bg,a,c,cd,cl){
  var dark=lum(bg)>150;
  var ink=dark?'#101010':'#F0F0F0';
  var ink2=dark?'#4A4A4A':'#A6A6A6';
  var ink3=dark?'#7A7A7A':'#707070';
  var line=dark?'rgba(0,0,0,.12)':'rgba(255,255,255,.10)';
  var line2=dark?'rgba(0,0,0,.26)':'rgba(255,255,255,.22)';
  var panel=dark?'#E9E9E9':'#141414';
  var panel2=dark?'#DDDDDD':'#1C1C1C';
  var card=c||mix(bg,.10);
  var st=document.documentElement.style;
  st.setProperty('--bg',bg);st.setProperty('--bg2',mix(bg,.04));
  st.setProperty('--panel',panel);st.setProperty('--panel2',panel2);
  st.setProperty('--card',card);
  st.setProperty('--cbd',cd||rgba(a,dark?.28:.20));
  st.setProperty('--cgl',cl||a);
  st.setProperty('--ink',ink);st.setProperty('--ink2',ink2);st.setProperty('--ink3',ink3);
  st.setProperty('--accent',a);st.setProperty('--accent2',mix(a,.22));st.setProperty('--accent-soft',rgba(a,.12));
  st.setProperty('--line',line);st.setProperty('--line2',line2);
  st.setProperty('--ok',a);st.setProperty('--warn',mix(a,.28));st.setProperty('--bad','#FF5C7A');
  try{document.body.classList.toggle('light',dark)}catch(e){}
}
function applyT(t){
  setV(t.bg,t.a,t.card,t.cbd,t.cgl);
  try{var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',t.bg)}catch(e){}
  var sv={id:t.id,bg:t.bg,a:t.a};
  if(t.card)sv.card=t.card;
  if(t.cbd)sv.cbd=t.cbd;
  if(t.cgl)sv.cgl=t.cgl;
  try{localStorage.setItem(TK,JSON.stringify(sv))}catch(e){}
  cloudSave({color:sv},700);
  var au=document.querySelector('.aurora-bg');
  if(!au){au=document.createElement('div');au.className='aurora-bg';au.innerHTML='<i></i><i></i><i></i><i></i>';document.body.insertBefore(au,document.body.firstChild);}
  document.body.classList.toggle('aurora',t.id==='t16');
}
function loadT(){
  try{
    var s=JSON.parse(localStorage.getItem(TK)||'null');
    if(s&&s.a){setV(s.bg||'#0A0A0A',s.a,s.card,s.cbd,s.cgl);return}
  }catch(e){}
  setV('#0A0A0A','#FFFFFF');
}
loadT();
/* ===== 界面主题 ===== */
var UITHEMES=[
{id:'square',n:'方界',d:'直角 · 硬边 · 档案锐利'},
{id:'round',n:'圆润',d:'大圆角 · 柔和 · 亲和'},
{id:'pixel',n:'像素',d:'像素块 · 8-bit 复古'},
{id:'neon',n:'霓虹',d:'发光边框 · 赛博夜行'},
{id:'paper',n:'纸张',d:'纸感 · 噪点 · 温暖'},
{id:'term',n:'终端',d:'扫描线 · 复古显示'},
{id:'glass',n:'玻璃',d:'毛玻璃 · 半透明层'},
{id:'crt',n:'绿光',d:'荧光字 · CRT 显像管'},
{id:'aurora',n:'极光',d:'光晕 · 极夜流光'},
{id:'hologram',n:'全息',d:'色散 · 棱镜流光'},
{id:'frost',n:'霜冻',d:'冰晶 · 寒霜封存'},
{id:'void',n:'虚空',d:'极简 · 无界暗域'},
{id:'ember',n:'余烬',d:'暖灰 · 烬火微光'},
{id:'mesh',n:'网格',d:'线框 · 工业制图'}
];
var UIK='wz_uitheme';
/* ===== 界面主题 · 页面氛围层 ===== */
var AMB_IDS=['square','round','pixel','paper','term','glass','aurora','hologram','frost','void','ember','mesh'];
var AMB_OP={square:.18,round:.85,pixel:1,paper:.9,term:1,glass:.9,aurora:.9,hologram:.9,frost:.95,void:1,ember:.95,mesh:1};
function ambRnd(a,b){return a+Math.random()*(b-a)}
var PT_SNOW='snow',PT_EMBER='ember',PT_STAR='star',PT_DOT='dot',PT_FIRE='fire',PT_PRISM='prism',PT_SPARK='spark',PT_GLYPH='glyph',PT_ASH='ash',PT_ICE='ice';
var PT_OUT=[PT_SNOW,PT_EMBER,PT_STAR,PT_DOT,PT_FIRE,PT_PRISM,PT_SPARK,PT_GLYPH,PT_ASH,PT_ICE];
var PT_AMB={frost:PT_SNOW,ember:PT_EMBER,void:PT_STAR,pixel:PT_DOT,mesh:PT_FIRE,hologram:PT_PRISM,term:PT_GLYPH,paper:PT_ASH,glass:PT_ICE,aurora:PT_SPARK};
var PT_CARD={frost:PT_SNOW,ember:PT_EMBER,void:PT_STAR,pixel:PT_DOT,mesh:PT_FIRE,hologram:PT_PRISM,term:PT_GLYPH,paper:PT_ASH,glass:PT_ICE};
var PT_N={snow:70,ember:24,star:42,dot:26,fire:18,prism:30,spark:44,glyph:22,ash:26,ice:30};
var PT_NC={snow:5,ember:4,star:6,dot:5,fire:3,prism:3,spark:4,glyph:4,ash:4,ice:4};
var PT_G='01{}[]<>/\\|#*+=~';
function pr(a,b){return (a+Math.random()*(b-a)).toFixed(1)}
function pClamp(v,a,b){return v<a?a:(v>b?b:v)}
function pBuild(kind,n,card){
  var out=[],i;
  var h=card?70:(window.innerHeight||800);
  var H=card?1:((window.innerHeight||800)/100);
  for(i=0;i<n;i++){
    var sz,dx,dy,so,dur,dl,top,ex='';
    var tw=(kind===PT_STAR||kind===PT_SPARK);
    var up=(kind===PT_EMBER||kind===PT_FIRE);
    if(up){top=card?pr(66,104):pr(64,100)}
    else if(tw){top=card?pr(8,92):pr(3,95)}
    if(kind===PT_SNOW){
      var r=Math.random();
      if(r<.35){sz=pr(1.3,2.4);so=pr(.35,.6);dur=pr(11,19);dx=pr(-3,3);ex=';filter:blur(.4px)'}
      else if(r<.75){sz=pr(2.4,4.2);so=pr(.5,.8);dur=pr(8,13);dx=pr(-5,5)}
      else {sz=pr(4.4,7);so=pr(.6,.95);dur=pr(6,9.5);dx=pr(-8,8);ex=';filter:blur(1.1px)'}
      dy=card?pr(26,74):pr(h*1.1,h*1.35);
      top=card?pr(-14,-4):pr(-12,-2);
    }else if(kind===PT_EMBER){
      sz=pr(1.5,3.4);so=pr(.4,.95);dur=pr(7,15);dx=pr(card?-26:-82,card?26:82);dy=-pr(card?36:82,card?84:150);
      top=card?pr(58,104):pr(60,108);
      if(Math.random()<.5)ex=';animation-name:pRise,pFlick;animation-duration:'+dur+'s,'+pr(.8,1.9)+'s;animation-timing-function:linear,ease-in-out';
    }else if(kind===PT_STAR||kind===PT_SPARK){
      /* 星点/光点原地明灭：必须直接落在视口内，否则位移为 0 就永远看不见 */
      sz=kind===PT_SPARK?pr(1,2.2):pr(1,2.8);so=pr(.4,1);dur=pr(2.6,6.5);dx='0.0';dy='0.0';
      top=card?pr(8,92):pr(3,95);
    }else if(kind===PT_DOT){
      sz=pr(2,3.4);so=pr(.25,.7);dur=pr(5,11);dx=pr(-4,4);dy=card?pr(24,60):pr(h*.9,h*1.15);top=card?pr(-14,-4):pr(-8,0);
    }else if(kind===PT_FIRE){
      sz=pr(1.4,2.6);so=pr(.3,.85);dur=pr(6,14);dx=pr(-16,16);dy=-pr(card?30:60,card?70:120);top=card?pr(52,100):pr(58,104);
    }else if(kind===PT_PRISM){
      sz=pr(2,3.6);so=pr(.35,.85);dur=pr(7,14);dx=pr(-20,20);dy=card?pr(30,70):pr(h*.9,h*1.2);top=card?pr(-14,-4):pr(-10,-2);
    }else if(kind===PT_GLYPH){
      sz=pr(9,13);so=pr(.25,.7);dur=pr(6,13);dx=pr(-16,16);dy=card?pr(28,64):pr(h*.9,h*1.15);top=card?pr(-14,-4):pr(-10,0);
    }else if(kind===PT_ASH){
      sz=pr(1.2,2.4);so=pr(.2,.5);dur=pr(12,22);dx=pr(-26,26);dy=card?pr(24,56):pr(h*.9,h*1.2);top=card?pr(-14,-4):pr(-10,0);
    }else{
      sz=pr(2,3.6);so=pr(.35,.85);dur=pr(9,18);dx=pr(-14,14);dy=card?pr(28,66):pr(h*.9,h*1.2);top=card?pr(-14,-4):pr(-10,0);
    }
    dl=pr(-dur,0);
    var glyph='';
    if(kind===PT_GLYPH){var gs=PT_G||'01';glyph='>'+gs.charAt(Math.floor(Math.random()*gs.length))+'<'}
    var st='left:'+pClamp(parseFloat(pr(0,100)),0,99)+'%;';
    if(tw)st+='top:'+top+(card?'%':'vh')+';';
    else if(up)st+='top:'+top+(card?'%':'vh')+';';
    else st+=(card?'top:'+pr(-14,-4)+'px;':'top:'+pr(-12,-2)+'vh;');
    st+='width:'+sz+'px;height:'+sz+'px;';
    st+='--dx:'+dx+'px;--dy:'+dy+'px;--so:'+so+';';
    st+='animation-duration:'+dur+'s;animation-delay:'+dl+'s';
    if(kind===PT_PRISM)st+=';background:linear-gradient(120deg,#FF2E93,#1BFFFF,#FFD600)';
    st+=ex;
    out.push('<i style="'+st+'">'+glyph+'</i>');
  }
  return out.join('');
}
function pSpawn(container,kind,opts){
  if(!container||!kind)return null;
  opts=opts||{};
  var wrap=document.createElement('div');
  wrap.className=(opts.card?'card-pt card-pt-':'pt pt-')+kind;
  wrap.setAttribute('aria-hidden','true');
  var n=opts.n;
  if(n===undefined){n=opts.card?(PT_NC[kind]||4):(PT_N[kind]||20);if(!opts.card&&(window.innerWidth||1200)<700)n=Math.round(n*.55)}
  wrap.innerHTML=pBuild(kind,n,!!opts.card);
  container.appendChild(wrap);
  return wrap;
}
function pAttachCards(kind){
  var cs=document.querySelectorAll('.card');
  for(var i=0;i<cs.length;i++){
    var c=cs[i];
    if(c.querySelector('.card-pt'))continue;
    pSpawn(c,kind,{card:true});
  }
}
function pClearUnit(unit){
  /* 只清掉我们自己生成的粒子层，其它氛围元素（极光层等）保留 */
  if(!unit)return;
  var kids=unit.childNodes;
  for(var i=kids.length-1;i>=0;i--){
    var n=kids[i];
    if(!n||!n.className)continue;
    var cn=String(n.className);
    if(cn.indexOf('card-pt')===0||cn.indexOf('pt ' )===0||cn==='pt')unit.removeChild(n);
  }
}
function ambParts(kind){
  var el=document.querySelector('.amb');
  if(!el)return;
  pClearUnit(el);
  if(!kind||el._pt===kind)return;
  el._pt=kind;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  pSpawn(el,kind,{});
}
function applyAmb(id){
  var el=document.querySelector('.amb');
  if(!el){
    el=document.createElement('div');
    el.className='amb';
    el.setAttribute('aria-hidden','true');
    document.body.insertBefore(el,document.body.firstChild);
  }
  for(var i=0;i<AMB_IDS.length;i++)el.classList.remove('amb-'+AMB_IDS[i]);
  var o=AMB_OP[id]||0;
  document.body.classList.toggle('amb-on',!!o);
  document.body.classList.toggle('amb-soft',!!o&&o<.5);
  if(o){
    el.classList.add('amb-'+id);
    el.style.setProperty('--amb-o',String(o));
    el.style.setProperty('--fall',Math.round((window.innerHeight||800)*1.14)+'px');
    el.style.setProperty('--rise',Math.round((window.innerHeight||800)*1.12)+'px');
  }
  try{
    var a=PT_AMB[id]||'';
    var c=PT_CARD[id]||'';
    ambParts(a);
    var cs=document.querySelectorAll('.card');
    for(var k=0;k<cs.length;k++){
      var card=cs[k];
      pClearUnit(card);
      if(c)pSpawn(card,c,{card:true});
    }
  }catch(e){}
}
/* 页面加载与动态内容刷新后，补挂卡片粒子 */
setTimeout(function(){try{pAttachCards(PT_CARD[localStorage.getItem(UIK)||'']||'')}catch(e){}},1200);
setTimeout(function(){try{pAttachCards(PT_CARD[localStorage.getItem(UIK)||'']||'')}catch(e){}},4000);
function applyUi(id){
  var b=document.body;
  b.classList.remove('ui-square','ui-round','ui-pixel','ui-neon','ui-paper','ui-term','ui-glass','ui-crt','ui-aurora','ui-hologram','ui-frost','ui-void','ui-ember','ui-mesh');
  if(id&&id!=='default')b.classList.add('ui-'+id);
  var au=document.querySelector('.aurora-bg');
  if(!au){au=document.createElement('div');au.className='aurora-bg';au.innerHTML='<i></i><i></i><i></i><i></i>';document.body.insertBefore(au,document.body.firstChild);}
  try{applyAmb(id)}catch(e){}
  try{localStorage.setItem(UIK,id||'')}catch(e){}
  cloudSave({ui:id||''},700);
}
function loadUi(){
  var id='';try{id=localStorage.getItem(UIK)||''}catch(e){}
  applyUi(id);
}
var loadUiReady=function(){
  loadUi();
  try{renderTh()}catch(e){}
  try{if(window.renderUi)renderUi()}catch(e){}
  /* 卡片与氛围层依赖 DOM 里的 .card，等解析完补挂粒子 */
  try{pAttachCards(PT_CARD[localStorage.getItem(UIK)||'']||'')}catch(e){}
};
if(document.readyState==='loading'||document.readyState==='interactive')document.addEventListener('DOMContentLoaded',loadUiReady);
else loadUiReady();
var VK='wz_view';
function vToast(t){
  var d=document.createElement('div');
  d.textContent=t;
  d.style.cssText='position:fixed;left:50%;top:58px;transform:translateX(-50%);z-index:200;background:var(--panel2);border:1px solid var(--line2);color:var(--accent2);font-family:var(--mono);font-size:11px;letter-spacing:.12em;padding:8px 16px;transition:.5s;opacity:0;white-space:nowrap';
  document.body.appendChild(d);
  requestAnimationFrame(function(){d.style.opacity='1'});
  setTimeout(function(){d.style.opacity='0';setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d)},500)},1700);
}
function applyView(m){
  var meta=document.querySelector('meta[name="viewport"]');
  if(m==='pc'){
    if(meta) meta.setAttribute('content','width=1280');
    document.body.classList.remove('view-mobile');
    vToast('已切换到电脑界面 · 可双指缩放');
  }else{
    if(meta) meta.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover');
    document.body.classList.add('view-mobile');
    vToast('已切换到手机界面 · 单列自适应');
  }
  try{localStorage.setItem(VK,m)}catch(e){}
  var b=document.getElementById('vmBtn');
  if(b) b.textContent=(m==='pc')?'▦ 手机':'▦ 电脑';
  b.title=(m==='pc')?'切换为手机界面':'切换为电脑界面';
}
function loadView(){
  var m='';
  try{m=localStorage.getItem(VK)||''}catch(e){}
  if(m!=='pc'&&m!=='mobile') m=(window.innerWidth<=640)?'mobile':'pc';
  var meta=document.querySelector('meta[name="viewport"]');
  if(m==='pc'&&meta) meta.setAttribute('content','width=1280');
  if(m==='mobile') document.body.classList.add('view-mobile');
  try{localStorage.setItem(VK,m)}catch(e){}
  var b=document.getElementById('vmBtn');
  if(b){b.textContent=(m==='pc')?'▦ 手机':'▦ 电脑';b.title=(m==='pc')?'切换为手机界面':'切换为电脑界面'}
}
loadView();
function renderUi(){
  var g=document.getElementById('uiGrid');if(!g)return;
  var n=document.getElementById('uiN');if(n)n.textContent=UITHEMES.length;
  var cur='';try{cur=localStorage.getItem(UIK)||''}catch(e){}
  g.innerHTML=UITHEMES.map(function(t){
    return '<div class="th-card'+(cur===t.id?' on':'')+'" data-ui="'+t.id+'"><div class="th-swat ui-prev"><i class="u-'+t.id+'"></i></div><div class="tn">'+t.n+'</div><div class="td">'+t.d+'</div></div>';
  }).join('');
}
function renderTh(){
  var g=document.getElementById('thGrid');
  if(!g)return;
  var n=document.getElementById('thN');if(n)n.textContent=THEMES.length;
  var cur='';
  try{cur=(JSON.parse(localStorage.getItem(TK)||'null')||{}).id}catch(e){}
  g.innerHTML=THEMES.map(function(t){
    return '<div class="th-card'+(cur===t.id?' on':'')+'" data-id="'+t.id+'"><div class="th-swat"><i style="background:'+t.bg+'"></i><i style="background:'+(t.card||t.bg)+'"></i><i style="background:'+t.a+'"></i></div><div class="tn">'+t.n+'</div><div class="td">'+t.d+'</div></div>';
  }).join('');
}
function thSay(t){var m=document.getElementById('thBox');if(m){var d=document.createElement('div');d.style.cssText='font-size:10.5px;color:var(--ink3);margin-top:10px;letter-spacing:.08em';d.textContent=t;m.appendChild(d);setTimeout(function(){d.style.opacity='0';d.style.transition='.6s'},1600);setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d)},2300)}}
document.addEventListener('click',function(e){
  var t=e.target;
  if(t&&t.id==='thBtn'){document.getElementById('thMask').classList.remove('hidden');renderTh();return}
  if(t&&t.id==='thClose'){document.getElementById('thMask').classList.add('hidden');return}
  var tc=t;
  while(tc&&tc.classList&&!tc.classList.contains('th-card'))tc=tc.parentNode;
  if(tc&&tc.classList&&tc.classList.contains('th-card')){
    var id=tc.getAttribute('data-id');
    var th=null;
    for(var i=0;i<THEMES.length;i++)if(THEMES[i].id===id)th=THEMES[i];
    if(th){applyT(th);renderTh();thSay('已应用配色 · '+th.n);return}
  }
  if(t&&t.id==='uiBtn'){document.getElementById('uiMask').classList.remove('hidden');renderUi();return}
  if(t&&t.id==='vmBtn'){
    var cur='';
    try{cur=localStorage.getItem(VK)||''}catch(e){}
    if(cur!=='pc'&&cur!=='mobile') cur=(window.innerWidth<=640)?'mobile':'pc';
    applyView(cur==='pc'?'mobile':'pc');
    return;
  }
  if(t&&t.id==='uiClose'){document.getElementById('uiMask').classList.add('hidden');return}
  var uc=t;
  while(uc&&uc.classList&&!uc.getAttribute('data-ui'))uc=uc.parentNode;
  if(uc&&uc.getAttribute&&uc.getAttribute('data-ui')){
    var uid=uc.getAttribute('data-ui');
    applyUi(uid);renderUi();thSay('已应用界面 · '+uid);
    return;
  }
  if(t&&t.id==='thApply'){
    var a=document.getElementById('thC').value,b=document.getElementById('thB').value;
    applyT({id:'custom',bg:b,a:a});
    renderTh();
    thSay('已应用自定义配色');
    return;
  }
  if(t&&t.id==='thReset'){
    try{localStorage.removeItem(TK)}catch(e){}
    setV('#0A0A0A','#FFFFFF');
    renderTh();
    thSay('已恢复默认配色');
    return;
  }
  if(t&&t.id==='thMask'){t.classList.add('hidden');return}
});

/* ---------- 常量 & 工具 ---------- */
(function(){var o=['gb_cache_v1','gb_db_v1','gb_cache','gb_db'];for(var i=0;i<o.length;i++){try{localStorage.removeItem(o[i])}catch(e){}}})();
var K_API='gb_api_url', K_SESS='gb_session', K_DB='gb_db_v2', K_GB='gb_cache_v2';
var AUTH_ERR={ok:false,msg:'登录已失效，请重新登录'};
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
/* 仅用于本地模式的弱哈希，别拿它当生产安全 */
function hash(s){
  var h=5381,i;
  s=String(s);
  for(i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))|0;
  return 'h'+(h>>>0).toString(16);
}
function rid(){
  return Math.random().toString(36).slice(2,10)+Date.now().toString(36);
}

/* ---------- 状态 ---------- */
var S={api:'',user:null,peer:null,timer:null,avatar:0,img:''};
var AVATARS=[{c:'#3FE0C8',s:'◆'},{c:'#FF5C7A',s:'▲'},{c:'#FFD166',s:'★'},{c:'#6C8CFF',s:'●'},{c:'#B58CFF',s:'✦'},{c:'#5CE08A',s:'■'},{c:'#FF9F6B',s:'✿'},{c:'#4FD8EB',s:'☂'},{c:'#FFC36B',s:'⚡'},{c:'#8F9BB3',s:'☾'},{c:'#FF7AB8',s:'❖'},{c:'#7BFFB8',s:'☯'}];
/* 只有 http(s):// 开头的地址才认，否则一律回落到本地模式 */
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
setTimeout(autoRelogin,800);

/* ---------- 云存档（pref 跨设备同步） ---------- */
var CF_T=null;
function cloudSave(pref,delay){
  if(!S.user||!S.api) return;
  clearTimeout(CF_T);
  CF_T=setTimeout(function(){
    call('/pref_set',{pref:pref}).catch(function(){});
  },delay||0);
}
window.cloudSave=cloudSave;
function cloudApply(){
  if(!S.user||!S.api) return Promise.resolve();
  return call('/pref_get',{}).then(function(j){
    if(!j||!j.ok||!j.pref) return;
    S.cPref=j.pref;
    var c=j.pref;
    if(c.color&&c.color.a){
      var sv={id:c.color.id,bg:c.color.bg,a:c.color.a};
      if(c.color.card)sv.card=c.color.card;
      if(c.color.cbd)sv.cbd=c.color.cbd;
      if(c.color.cgl)sv.cgl=c.color.cgl;
      try{ localStorage.setItem(TK,JSON.stringify(sv)); }catch(e){}
      applyT(sv);
      try{ if(window.renderTh) renderTh(); }catch(e){}
    }
    if(c.ui){
      try{ localStorage.setItem(UIK,c.ui); }catch(e){}
      applyUi(c.ui);
      try{ if(window.renderTh) renderTh(); }catch(e){}
    }
    if(c.avatar!==undefined){ S.avatar=c.avatar; try{ initAvatarPick&&initAvatarPick(); }catch(e){} }
    if(c.memo){
      var m=''; try{ m=localStorage.getItem(K_MEMO)||''; }catch(e){}
      if(!m&&c.memo){ try{ localStorage.setItem(K_MEMO,c.memo); }catch(e){} try{ memoRender&&memoRender(); }catch(e){} }
    }
    if(c.ach){
      var la=[]; try{ la=JSON.parse(localStorage.getItem('wAch')||'[]'); }catch(e){ la=[]; }
      var merged=(la||[]).slice();
      (c.ach||[]).forEach(function(n){ if(merged.indexOf(n)<0) merged.push(n); });
      try{ localStorage.setItem('wAch',JSON.stringify(merged)); }catch(e){}
      if(merged.length!==(c.ach||[]).length||merged.length!==(la||[]).length){
        cloudSave({ach:merged},900);
      }
    }
  }).catch(function(){});
}

function wallLoad(){
  call('/visitors_get',{}).then(function(j){
    if(!j||!j.ok) return;
    var t=$('wall_tot'); if(t) t.textContent='累计 '+j.visits+' 次 · 今日 '+j.today+' · 访客 '+((j.list)||[]).length+' 人';
    var el=$('wall_list'); if(!el) return;
    el.innerHTML=(j.list||[]).slice(0,8).map(function(x){
      return '<span class="wall-it" title="'+esc(x.name)+' 访问 '+x.n+' 次">'+esc(x.name.slice(0,5))+'<i>×'+x.n+'</i></span>';
    }).join('')||'<span style="color:var(--ink3);font-size:10.5px">暂无访客</span>';
  }).catch(function(){});
}
var wallMode = 0;
function wallLoad(){
  if(wallMode){
    call('/visitors_detail',{}).then(function(j){
      if(!j||!j.ok) return;
      var t=$('wall_tot'); if(t) t.textContent='访客足迹 · 最近 30 条';
      var el=$('wall_list'); if(!el) return;
      el.innerHTML=(j.list||[]).map(function(x){
        return '<span class="wall-it" title="'+esc(x.name)+'">'+esc(x.name.slice(0,5))+'<i>×'+x.n+'</i><span class="fp-t">'+esc((x.time||'').slice(5,16))+'</span></span>';
      }).join('')||'<span style="color:var(--ink3);font-size:10.5px">暂无足迹</span>';
    }).catch(function(){});
  }else{
    call('/visitors_get',{}).then(function(j){
      if(!j||!j.ok) return;
      var t=$('wall_tot'); if(t) t.textContent='累计 '+j.visits+' 次 · 今日 '+j.today+' · 访客 '+((j.list)||[]).length+' 人';
      var el=$('wall_list'); if(!el) return;
      el.innerHTML=(j.list||[]).slice(0,8).map(function(x){
        return '<span class="wall-it" title="'+esc(x.name)+' 访问 '+x.n+' 次">'+esc(x.name.slice(0,5))+'<i>×'+x.n+'</i></span>';
      }).join('')||'<span style="color:var(--ink3);font-size:10.5px">暂无访客</span>';
    }).catch(function(){});
  }
}
function mapLoad(){
  var el=$('map_grid'); if(!el) return;
  var nodes=[
    ['指挥中心','index.html','index'],
    ['守夜人论坛','pages/守夜人论坛.html','forum'],
    ['卡塞尔学院','pages/卡塞尔学院官网.html','cassel'],
    ['更新日志','pages/changelog.html','chg'],
    ['终端接口','pages/终端接口.html','term'],
    ['泰拉大典','pages/PRTS泰拉大典终端.html','prts'],
    ['莱茵生命','pages/莱茵生命终端.html','rhine'],
    ['技能树','pages/技能树.html','skill'],
    ['模组开发','pages/模组开发.html','mod'],
    ['密文解码器','pages/解码器.html','dec']
  ];
  el.innerHTML=nodes.map(function(n){
    var on=false;
    try{ on=!!localStorage.getItem('wz_map_'+n[2]); }catch(e){}
    var nm=location.pathname.split('/').pop().split('?')[0];
    if(nm===n[1]){ on=true; try{localStorage.setItem('wz_map_'+n[2],'1')}catch(e){} }
    return '<a class="map-node'+(on?' on':'')+'" href="'+n[1]+'" data-map="'+n[2]+'">'+n[0]+'</a>';
  }).join('');
}
(function(){
  setTimeout(wallLoad, 400);
  setTimeout(mapLoad, 900);
})();
(function(){
  var sw=$('wall_sw');
  if(sw) sw.addEventListener('click',function(){
    wallMode=1-wallMode;
    sw.textContent=wallMode?'访客榜':'足迹';
    wallLoad();
  });
})();

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

/* ---------- 本地模式路由（与后端接口完全一致） ---------- */
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
    case '/guests':
      return {ok:true,list:d.guests.slice().sort(function(a,b){return b.id-a.id})};

    case '/guest_add':{
      var txt=String(p.text||'').trim().slice(0,500);
      if(!txt) return {ok:false,msg:'内容不能为空'};
      var cu=me();
      var nm=(cu?cu.name:(String(p.name||'').trim()||'访客')).slice(0,16);
      d.guests.push({id:d.seq++,user:cu?cu.name:null,name:nm,text:txt,time:nowStr(),avatar:(+p.avatar||0)%12});
      dbSave(d);
      return {ok:true};
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
    case '/pm_send':{
      var cs=me(); if(!cs) return AUTH_ERR;
      var to=String(p.to||'').trim(), msg=String(p.msg||'').trim().slice(0,500);
      if(!to||!msg) return {ok:false,msg:'请填写收件人与内容'};
      if(to===cs.name) return {ok:false,msg:'不能给自己发私聊'};
      if(!d.users[to]) return {ok:false,msg:'收件人不存在'};
      d.pms.push({id:d.seq++,from:cs.name,to:to,msg:msg,time:nowStr(),read:false});
      dbSave(d);
      return {ok:true};
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
      var cc=me(); if(!cc) return AUTH_ERR;
      var map={};
      d.pms.forEach(function(m){
        if(m.from!==cc.name&&m.to!==cc.name) return;
        var peer=m.from===cc.name?m.to:m.from;
        if(!map[peer]) map[peer]={peer:peer,last:'',time:'',unread:0};
        map[peer].last=m.msg; map[peer].time=m.time;
        if(m.to===cc.name&&!m.read) map[peer].unread++;
      });
      var arr=Object.keys(map).map(function(k){return map[k]});
      arr.sort(function(a,b){ return a.time<b.time?1:-1; });
      return {ok:true,list:arr};
    }
    default:
      return {ok:false,msg:'未知接口 '+path};
  }
}

/* ---------- 统一调用：云端 fetch / 本地 localCall ---------- */
/* ---------- 统一调用：云端 fetch / 本地 localCall ---------- */
function localAsync(path,body){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      try{ resolve(localCall(path,body)); }
      catch(e){ reject(e); }
    },40);
  });
}

function call(path,payload,method){
  var body=Object.assign({token:S.user?S.user.token:''},payload||{});

  /* 没有合法 API 地址 → 走本地模式，永不发网络请求 */
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
      /* 多云端故障转移：当前主机失败自动尝试下一个候选地址 */
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

/* ---------- 提示 ---------- */
function say(msg,ok){
  var el1=$('gb_say'), el2=$('gb_say2');
  var cls='gb-say'+(ok===true?' ok':(ok===false?' bad':''));
  [el1,el2].forEach(function(el){
    if(!el) return;
    el.className=cls;
    el.textContent=msg||'';
  });
  if(msg) setTimeout(function(){
    [el1,el2].forEach(function(el){
      if(el&&el.textContent===msg) el.textContent='';
    });
  },4200);
}

/* ---------- 登录态 UI ---------- */
function applyAuth(){
  var on=!!S.user;
  $('gb_login_area').style.display=on?'none':'flex';
  $('gb_userinfo').style.display=on?'flex':'none';
  $('gb_pm_panel').classList.toggle('on',on);
  var lt=$('gb_text'),sb=$('gb_submit'),ib=$('gb_img_btn');
  lt.disabled=!on; sb.disabled=!on; ib.disabled=!on;
  lt.placeholder=on?'写点留言…':'登录后可留言';
  sb.textContent=on?'发留言':'登录后可留言';
  var gu=on&&S.user.is_admin;
  $('gb_users_panel').style.display=gu?'block':'none';
  if(gu) loadUsers();
  checkinStatus();
  if(on){
    $('gb_curuser').textContent=S.user.username;
    $('gb_isadmin').style.display=S.user.is_admin?'inline-block':'none';
    $('gb_name').value=S.user.username;
    $('gb_name').disabled=true;
    $('gb_name').placeholder='已登录账号';
  }else{
    $('gb_name').disabled=false;
    $('gb_name').placeholder='昵称（访客）';
  }
}

/* ---------- 注册 / 登录 / 登出 ---------- */
function gbRegister(){
  var u=$('gb_user').value.trim(), p=$('gb_pwd').value;
  if(!u||!p) return say('填账号和密码',false);
  var dt=0; try{dt=parseInt(localStorage.getItem('wtz_danger_ts')||'0',10)}catch(e){}
  try{ localStorage.removeItem('wtz_danger_names'); }catch(e){}
  if(dt&&Date.now()-dt<86400000){
    var rh=Math.max(1,Math.ceil((86400000-(Date.now()-dt))/3600000));
    return say('本机被标记为危险来源，'+rh+' 小时内禁止注册任何账号',false);
  }
  return call('/register',{username:u,password:p}).then(function(j){
    say(j.msg||(j.ok?'注册成功':'注册失败'), !!j.ok);
    if(j.ok) $('gb_pwd').value='';
  }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
}

function gbLogin(){
  var u=$('gb_user').value.trim(), p=$('gb_pwd').value;
  if(!u||!p) return say('填账号和密码',false);
  return call('/login',{username:u,password:p}).then(function(j){
    if(!j.ok) return say(j.msg||'登录失败',false);
    S.user={username:j.username,is_admin:!!j.is_admin,token:j.token,pts:j.pts,items:j.items||[]};
    try{ localStorage.setItem(K_SESS,JSON.stringify(S.user)); }catch(e){}
    try{ localStorage.setItem('gb_pwd',p); }catch(e){}
    $('gb_pwd').value='';
    applyAuth();
    cloudApply();
    say('欢迎回来，'+j.username,true);
    loadGuestBook();
    pmRefreshConversations();
    startPoll();
  }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
}

/* 找回密码 + 安全问题 */
function gbRcShow(){
  $('gbRecMask').style.display='flex';
  $('gb_rc_user').value=''; $('gb_rc_q').textContent=''; $('gb_rc_q').style.display='none';
  $('gb_rc_ans').value=''; $('gb_rc_ans').style.display='none';
  $('gb_rc_pwd').value=''; $('gb_rc_pwd').style.display='none';
  $('gb_rc_go').style.display=''; $('gb_rc_ok').style.display='none';
  $('gb_rc_say').textContent='';
}
function gbRcQ(){
  var u=$('gb_rc_user').value.trim();
  if(!u){ $('gb_rc_say').textContent='请输入账号'; gbRcShake(); return; }
  call('/recover_q',{username:u}).then(function(j){
    if(!j.ok){ $('gb_rc_say').textContent=j.msg||'获取失败'; gbRcShake(); return; }
    $('gb_rc_q').textContent='问题：'+j.question; $('gb_rc_q').style.display='';
    $('gb_rc_ans').style.display=''; $('gb_rc_pwd').style.display='';
    $('gb_rc_go').style.display='none'; $('gb_rc_ok').style.display='';
    $('gb_rc_say').textContent='';
  }).catch(function(e){ $('gb_rc_say').textContent='请求失败：'+ferr(e.message); });
}
function gbRcShake(){
  var m=document.getElementById('gbRecMask').querySelector('div');
  m.classList.remove('rcShake'); void m.offsetWidth; m.classList.add('rcShake');
}
function gbRcGo(){
  var u=$('gb_rc_user').value.trim(), a=$('gb_rc_ans').value.trim(), p=$('gb_rc_pwd').value;
  if(!a||!p){ $('gb_rc_say').textContent='请填写答案与新密码'; gbRcShake(); return; }
  call('/recover',{username:u,answer:a,newpwd:p}).then(function(j){
    $('gb_rc_say').textContent=j.msg||(j.ok?'已重置':'失败');
    if(j.ok){ setTimeout(function(){ $('gbRecMask').style.display='none'; },1300); }
    else gbRcShake();
  }).catch(function(e){ $('gb_rc_say').textContent='请求失败：'+ferr(e.message); gbRcShake(); });
}
function gbSecShow(){
  $('gbSecMask').style.display='flex';
  $('gb_sec_q').value=''; $('gb_sec_a').value=''; $('gb_sec_say').textContent='';
}
function gbSecSave(){
  var q=$('gb_sec_q').value.trim(), a=$('gb_sec_a').value.trim();
  if(!q||!a) return $('gb_sec_say').textContent='请填写问题与答案';
  if(!S.user) return $('gb_sec_say').textContent='请先登录';
  call('/sec_set',{token:S.user.token,q:q,a:a}).then(function(j){
    $('gb_sec_say').textContent=j.msg||(j.ok?'已设置':'失败');
  }).catch(function(e){ $('gb_sec_say').textContent='请求失败：'+ferr(e.message); });
}
function gbLogout(){
  var done=function(){
    S.user=null; S.peer=null;
    try{ localStorage.removeItem(K_SESS); }catch(e){}
    stopPoll();
    applyAuth();
    $('pm_box').innerHTML='';
    $('pm_conv').innerHTML='';
    $('pm_target').value='';
    $('pm_msg').value='';
    say('已退出',true);
    loadGuestBook();
  };
  call('/logout',{}).then(done,function(){ done(); });
}
function markDanger(name){
  try{ localStorage.setItem('wtz_danger_ts',String(Date.now())); }catch(e){}
}
function tokenPulse(){
  if(!S.api||!S.user||!S.user.token) return;
  call('/token_state',{}).then(function(j){
    if(!j||!j.ok) return;
    if(j.state==='deleted'){
      markDanger(j.name||S.user.username);
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
setInterval(tokenPulse,30000);

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
    var s=document.createElement('style');
    s.textContent='@keyframes gbRip{0%{box-shadow:0 0 0 0 rgba(154,111,174,.65)}100%{box-shadow:0 0 0 16px rgba(154,111,174,0)}}.gb-ripple{animation:gbRip .6s ease-out}.gb-tide .gb-item{animation:gbTide 1s ease-in-out}@keyframes gbTide{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}';
    document.head.appendChild(s);
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
function fLget(k,d){try{var a=JSON.parse(localStorage.getItem(k)||'null');return a==null?d:a}catch(e){return d}}
function fLset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function sortGB(list){
  var k=$('gb_sort')?$('gb_sort').value:'new';
  var a=list.slice();
  if(k==='old') a.sort(function(x,y){return (x.id||0)-(y.id||0)});
  else if(k==='hot') a.sort(function(x,y){return ((y.likes||[]).length-(x.likes||[]).length)||((y.id||0)-(x.id||0))});
  else a.sort(function(x,y){return (y.id||0)-(x.id||0)});
  return a;
}
var GB_REPORTED={};
function renderGuests(list, fresh){
  var box=$('guestbookList');
  GB_ALL=list;
  if(list) list=sortGB(list);
  if(!list||!list.length){
    box.innerHTML='<div class="gb-empty">还没人留言，沙发给你留着</div>';
    return;
  }
  var freshIds={};
  if(fresh){
    if(Array.isArray(fresh)) fresh.forEach(function(x){ freshIds[x.id]=1; });
    else if(fresh===true){}
  }
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

(function(){
  var gs=$('gb_sort');
  if(gs) gs.addEventListener('change',function(){ if(GB_ALL) renderGuests(GB_ALL); });
})();
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
    if(j.admins)GB_ADMINS=j.admins;
    var o=$('gb_online');
    if(o&&j.online!==undefined){ o.textContent='在线 '+j.online; o.style.display=''; }
    var nl=j.list||[];
    if(!cache||!cache.list) cache={list:[],maxId:0};
    if(typeof j.total==='number' && cache.list.length && Math.abs(cache.list.length-j.total) > 5){
      if(typeof fullSyncGb==='function'){ fullSyncGb(); return; }
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
  call('/guests_new',{since:cache?Math.max(0,cache.maxId||0):0},'GET').then(function(j){
    if(j&&j.admins)GB_ADMINS=j.admins;
    var nl=(j&&j.list)||[], del=(j&&j.deleted)||[];
    if(nl.length||del.length) loadGuestBook();
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
      $('gb_att').innerHTML='<img src="'+esc(S.api+j.url)+'"><span>已附带 1 张图片</span><button id="gb_img_rm">移除</button>';
      $('gb_att').style.display='flex';
      $('gb_img_rm').addEventListener('click',function(){S.img='';$('gb_att').style.display='none';$('gb_file').value=''});
      say('图片搞定',true);
    }).catch(function(e){ say('上传失败：'+ferr(e.message),false); });
  });
}
function uploadImg(){
  if(!S.api) return say('需云端模式才能发图',false);
  uploadFile($('gb_file').files[0]);
}
function initAvatarPick(){
  var box=$('gb_pick');if(!box)return;
  box.innerHTML=AVATARS.map(function(a,i){
    return '<span class="gpick'+(i===S.avatar?' on':'')+'" data-i="'+i+'" style="background:'+a.c+'">'+a.s+'</span>';
  }).join('')+'<span class="gpick up'+(typeof S.avatar==='string'?' on':'')+'" id="gb_av_up" title="上传自定义头像">'+(typeof S.avatar==='string'?'<img src="'+esc(S.api+S.avatar)+'">':'上传')+'</span>';
  box.onclick=function(e){
    var t=e.target.closest('.gpick');if(!t)return;
    if(t.id==='gb_av_up'){ if(!S.api) return say('需云端模式才能上传头像',false); $('gb_av_file').click(); return; }
    S.avatar=+t.getAttribute('data-i');
    var all=box.querySelectorAll('.gpick');all.forEach(function(x){x.classList.toggle('on',x===t)});
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
  var f=$('gb_av_file').files[0];
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
    $('gb_text').value='';$('gb_file').value='';
    S.img='';S.replyTo='';$('gb_att').style.display='none';
    if(j.id){
      try{
        var cache=null;try{cache=JSON.parse(localStorage.getItem(K_GB)||'null')}catch(e){}
        if(!cache||!cache.list) cache={list:[],maxId:0};
        var now=new Date(),pad=function(x){return x<10?'0'+x:''+x};
        var tstr=now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate())+' '+pad(now.getHours())+':'+pad(now.getMinutes())+':'+pad(now.getSeconds());
        var it={id:j.id,user:S.user?S.user.username:'',name:name,text:text,time:tstr,avatar:S.avatar,image:oldImg,reply_to:oldReply,likes:[]};
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

function loadNotes(){
  if(!S.api) return;
  call('/notice_get',{}).then(function(j){
    if(!j.ok) return;
    var box=$('gb_notes'),lst=$('gb_n_list');
    box.style.display='block';
    var adm=S.user&&S.user.is_admin;
    $('gb_n_btns').innerHTML=adm?'<button class="gb-btn ghost" id="gb_n_new" style="float:right;padding:2px 10px;font-size:11px">发布</button>':'';
    var nb=$('gb_n_new');
    if(nb) nb.addEventListener('click',function(){ $('gb_n_form').style.display='flex'; });
    lst.innerHTML=j.list.slice(0,5).map(function(n){
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
    if(j.ok){ $('gb_n_text').value=''; $('gb_n_form').style.display='none'; loadNotes(); }
  }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
}
function hitCloud(){
  if(!S.api) return;
  try{ if(sessionStorage.getItem('gb_hit')) return; }catch(e){}
  var nm='访客';
  try{ nm=localStorage.getItem('prts_vn')||'访客'; }catch(e){}
  if(S.user) nm=S.user.username;
  call('/hit',{name:nm}).then(function(j){
    if(!j.ok) return;
    try{ sessionStorage.setItem('gb_hit','1'); }catch(e){}
    loadStats();
  }).catch(function(){});
}
function loadStats(){
  if(!S.api) return;
  call('/stats_get',{}).then(function(j){
    if(!j.ok) return;
    var el=document.getElementsByClassName('site-stat');
    for(var i=0;i<el.length;i++) el[i].innerHTML='SITE // 云端 '+ (j.visits||0) +' VIEWS · '+(j.visitors||0)+' VISITORS · 今日 '+(j.today||0);
  }).catch(function(){});
}
function doCheckin(){
  if(!S.user) return say('请先登录',false);
  call('/checkin',{}).then(function(j){
    if(!j.ok) return say(j.msg||'签到失败',false);
    var bd=j.badge?'[连签'+j.badge+'日]':'';
    var gn=j.streak>=30?65:(j.streak>=7?15:(j.streak>=3?5:0));
    say(j.done?('今日已签到 · 连签 '+j.streak+' 天 · 共 '+j.total+' 天'+bd):('签到成功 · 连签 '+j.streak+' 天 · 共 '+j.total+' 天 · 积分 +'+(10+gn)+bd),true);
    checkinStatus();
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
    if(typeof window.lvUpd==='function')window.lvUpd(j);
  }).catch(function(){});
}
function loadUsers(){
  if(!S.user||!S.user.is_admin) return;
  call('/admin_users',{}).then(function(j){
    if(!j.ok){ say((j&&j.msg)||'扫描失败',false); return; }
    var on=j.list.filter(function(u){return u.online}).length;
    say('已扫描 · 在线 '+on+' / 共 '+j.list.length+' 人',true);
    var box=$('gb_ulist');
    $('gb_ucnt').textContent='('+j.list.length+')';
    var adminBtns=function(u){
      if(!S.user||S.user.username===u.name) return '';
      var b1=(S.user.is_admin?'<button class="gb-btn ghost" data-ua="'+esc(u.name)+'" data-uadm="'+(u.is_admin?'1':'0')+'" style="padding:1px 8px;font-size:10px">'+(u.is_admin?'撤销':'授予')+'</button>':'');
      var b2=(S.user.is_admin?'<button class="gb-btn ghost" data-uban="'+esc(u.name)+'" data-ubanned="'+(u.banned?'1':'0')+'" style="padding:1px 8px;font-size:10px;'+(u.banned?'color:var(--bad);border-color:var(--bad)':'')+'">'+(u.banned?'解除拉黑':'拉黑')+'</button>':'');
      var b3=(S.user.is_admin?'<button class="gb-btn ghost" data-udel="'+esc(u.name)+'" style="padding:1px 8px;font-size:10px;color:var(--bad);border-color:var(--bad)">删除</button>':'');
      var b4=(S.user.is_admin?'<button class="gb-btn ghost" data-ukick="'+esc(u.name)+'" style="padding:1px 8px;font-size:10px;color:#d9a441;border-color:#d9a441">踢下线</button>':'');
      return b1+b2+b3+b4;
    };
    if(j.root){
      box.innerHTML=j.list.map(function(u){
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
        j.list.map(function(u){
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
  if(!list||!list.length){
    box.innerHTML='<div class="gb-empty" style="padding:18px 10px">暂无会话</div>';
    return;
  }
  box.innerHTML=list.map(function(c){
    var on = S.peer===c.peer ? ' on' : '';
    return '<div class="gb-conv-i'+on+'" data-peer="'+esc(c.peer)+'">'+
      '<div class="p">'+esc(c.peer)+(c.unread?'<span class="u">'+c.unread+'</span>':'')+'<span class="gb-conv-x" data-pcd="'+esc(c.peer)+'" title="删除会话">✕</span></div>'+
      '<div class="l">'+esc((c.last||'')+(c.img?' [图片]':''))+'</div>'+
    '</div>';
  }).join('');
  var pmB=document.getElementById('pmBadge'),nn=0;
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
    renderConvs(j.list||[]);
  }).catch(function(){});
}

/* ---------- v2.8 自动重登 / 通知中心 / 个人主页 / 转场 ---------- */
function autoRelogin(){
  if(!S.user||!S.api||!S.user.username) return;
  call('/me',{}).then(function(j){
    if(j&&j.ok){ S.user.pts=j.me.pts;S.user.items=j.me.items||S.user.items||[];cloudApply(); return; }
    var pw='';
    try{ pw=localStorage.getItem('gb_pwd')||''; }catch(e){}
    if(!pw) return;
    call('/login',{username:S.user.username,password:pw}).then(function(k){
      if(!k||!k.ok) return;
      S.user={username:k.username,is_admin:!!k.is_admin,token:k.token,pts:k.pts,items:k.items||[]};
      try{ localStorage.setItem(K_SESS,JSON.stringify(S.user)); }catch(e){}
      applyAuth(); loadGuestBook(); pmRefreshConversations(); startPoll(); ntRefresh();
      cloudApply();
    }).catch(function(){});
  }).catch(function(){});
}
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
    if(un>0){ d.textContent=un>99?'99+':un; b.classList.add('on'); }
    else{ d.textContent='0'; b.classList.remove('on'); }
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
      var on=have.indexOf(x.n)>=0;
      var label=on?x.n:(lockable?'？？？':x.n);
      return '<span class="pf-ach'+(on?'':' off')+'" title="'+(on?'已解锁':'未解锁')+'">'+esc(label)+'</span>';
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
function pushAch(){
  if(!S.user||!S.api)return;
  var a=pfAch();if(!a.length)return;
  call('/pref_set',{pref:{ach:a}}).catch(function(){});
}
setTimeout(function(){ if(S.user) pushAch(); },6000);
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
        var on=(dArr||[]).indexOf(s)>=0;
        out.push('<i'+(on?' class="on"':'')+' title="'+s+'"></i>');
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
    var _showH='';
    if(pf.self_){var _vn=fLget('wz_forge',[]);if(_vn.length)_showH='<div class="pf-forge">⚒ 武器库已归档 <b>'+_vn.length+'</b> 件 · 门面与锻造见<a href="pages/锻造.html" style="color:var(--accent,#fff)">锻造页</a></div>'}
    var achH;
    if(pf.self_){
      var got=ACH20.filter(function(n){return ach.indexOf(n)>=0});
      achH='<div class="pf-achn">已解锁 <b>'+ach.length+'</b> / 50 项成就</div><div id="pfAchWall" class="pf-achw">载入成就表…</div>';
    }else{
      achH='<div class="pf-achn">TA 已解锁 '+achN+' 项成就</div>';
    }
    bd.innerHTML=
      '<div class="pf-h">'+avH+'<div><div class="pf-nm">'+esc(pf.name)+(pf.badge?' <span style="color:var(--ok);font-size:10px;letter-spacing:.1em;border:1px solid var(--ok);padding:0 5px">连签'+pf.badge+'日</span>':'')+(pf.is_admin?' <span style="color:var(--accent);font-size:10px;letter-spacing:.1em;border:1px solid var(--accent);padding:0 5px">ADMIN</span>':'')+(pf.banned?' <span style="color:var(--bad);font-size:10px;border:1px solid var(--bad);padding:0 5px">已拉黑</span>':'')+'</div>'+
      '<div class="pf-sub">LV '+lv+' · '+esc(pf.title)+(pf.pt?' <span class="u-title">· ' + esc(pf.pt) + '</span>':'')+'</div>'+
      '<div class="pf-lvbar"><i style="width:'+pct+'%"></i></div>'+
      '<div class="pf-lvt">经验 '+pf.exp+' · '+pct+'%</div>'+bioH+bioEdit+'</div></div>'+
      '<div class="pf-stats"><span>连签 '+pf.streak+'<i>天</i></span><span>总签 '+(+pf.total||0)+'<i>次</i></span><span>积分 '+pf.pts+'</span><span>注册 '+(pf.days>0?pf.days:'—')+'<i>天</i></span><span>获赞 '+pf.likes+'</span></div>'+_showH+
      '<div class="pf-ckn">近 60 天签到日历</div>'+ckCal(pf.ckdays)+
      '<div class="pf-tabs"><span class="pf-tab on" data-pft="d">动态</span><span class="pf-tab" data-pft="g">留言</span><span class="pf-tab" data-pft="p">帖子</span><span class="pf-tab" data-pft="c">评论</span><span class="pf-tab" data-pft="a">成就</span></div>'+
      '<div class="pf-bd"><div class="pf-pg" data-pg="d">'+dynH+'</div><div class="pf-pg" data-pg="g" style="display:none">'+gsH+'</div><div class="pf-pg" data-pg="p" style="display:none">'+psH+'</div><div class="pf-pg" data-pg="c" style="display:none">'+cmH+'</div><div class="pf-pg" data-pg="a" style="display:none">'+achH+'</div></div>';
    var pbSave=document.getElementById('pfBioSave');
    if(pbSave) pbSave.addEventListener('click',function(){
      var v=document.getElementById('pfBioIn').value.trim();
      call('/profile_edit',{bio:v}).then(function(j){
        if(j&&j.ok){ say('签名已保存',true); openProfile(nm); }
        else say((j&&j.msg)||'保存失败',false);
      }).catch(function(){ say('保存失败',false); });
    });
  }).catch(function(){ bd.innerHTML='<div style="padding:30px;text-align:center;color:var(--ink3)">加载失败</div>'; });
}
function go(u){
  var L=$('tvLayer');
  if(!L||!S.api){ location.href=u; return; }
  var lb=$('tvLbl'),segs=['接入节点','同步档案','握手中','校验密级','传送中'],i=0;
  var iv=setInterval(function(){ lb.textContent=' · '+segs[i%segs.length]; i++; },140);
  L.classList.add('on');
  setTimeout(function(){ clearInterval(iv); location.href=u; },650);
}
(function(){
  var nb=$('ntBadge');
  if(nb) nb.addEventListener('click',function(e){
    e.stopPropagation();
    var pn=$('ntPanel');
    if(pn){
      var on=pn.classList.toggle('on');
      if(on) ntRefresh();
    }
  });
  var cl=$('ntClear');
  if(cl) cl.addEventListener('click',function(){
    call('/notify_read',{}).then(function(j){ if(j&&j.ok) ntRefresh(); }).catch(function(){});
  });
  var tabs=$('ntTabs');
  if(tabs) tabs.addEventListener('click',function(e){
    var t=e.target.closest('.nt-tab'); if(!t) return;
    S.ntF=t.getAttribute('data-f');
    var all=tabs.querySelectorAll('.nt-tab');
    for(var i=0;i<all.length;i++) all[i].classList.toggle('on',all[i]===t);
    ntRefresh();
  });
  var nl=$('ntList');
  if(nl) nl.addEventListener('click',function(e){
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
  var pc=$('pfClose');
  if(pc) pc.addEventListener('click',function(){ $('pfMask').classList.remove('on'); });
  var pm=$('pfMask');
  if(pm) pm.addEventListener('click',function(e){ if(e.target===pm) pm.classList.remove('on'); });
  var pb=$('pfBody');
  if(pb) pb.addEventListener('click',function(e){
    var pt=e.target.closest('.pf-tab');
    if(pt){
      var k=pt.getAttribute('data-pft');
      pb.querySelectorAll('.pf-tab').forEach(function(x){x.classList.toggle('on',x===pt)});
      pb.querySelectorAll('.pf-pg').forEach(function(x){x.style.display=(x.getAttribute('data-pg')===k)?'':'none'});
      if(k==='a') achWall();
      return;
    }
    var t=e.target.closest('[data-u]');
    if(t){ openProfile(t.getAttribute('data-u')); return; }
    var p2=e.target.closest('[data-pf="p"]');
    if(p2) window.open('pages/守夜人论坛.html');
  });
})();

function clearPmImg(){ S.pmImg=''; var a=$('pm_att'); if(a){ a.style.display='none'; a.innerHTML=''; } var f=$('pm_file'); if(f) f.value=''; }

function pmOpen(peer){
  if(!S.user||!peer) return;
  S.peer=peer;
  $('pm_target').value=peer;
  $('pm_title').textContent='与 '+peer+' 的私聊';
  return pmRefreshThread().then(pmRefreshConversations);
}

function pmRefreshThread(){
  if(!S.user||!S.peer) return Promise.resolve();
  return call('/pm_thread',{peer:S.peer}).then(function(j){
    S.thread=j.list||[];
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
  var body={to:to,msg:msg,token:S.user&&S.user.token};
  if(img) body.img=img;
  return call('/pm_send',body).then(function(j){
    if(!j.ok) return say(j.msg||'发送失败',false);
    $('pm_msg').value=''; clearPmImg();
    say('发送成功',true);
    S.peer=to;
    $('pm_title').textContent='与 '+to+' 的私聊';
    var d=new Date(),hh=(d.getHours()<10?'0':'')+d.getHours(),mm=(d.getMinutes()<10?'0':'')+d.getMinutes();
    var fake={id:j.id||('t'+Date.now()),from:S.user.username,to:to,msg:msg,img:img,time:hh+':'+mm};
    if(!S.thread) S.thread=[];
    S.thread.push(fake);
    renderThread(S.thread);
    setTimeout(pmRefreshThread,2600);
    pmRefreshConversations();
  }).catch(function(e){ say('发送失败：'+ferr(e.message),false); });
}

/* ---------- 轮询 ---------- */
function startPoll(){
  stopPoll();
  S.timer=setInterval(function(){
    if(document.hidden) return;
    if(!S.user) return;
    pmRefreshConversations();
    ntRefresh();
    if(S.user&&S.user.is_admin) loadUsers();
    if(S.peer) pmRefreshThread();
  },6000);
}
function stopPoll(){
  if(S.timer){ clearInterval(S.timer); S.timer=null; }
}

/* ---------- 云端配置 ---------- */
function updateModeLabel(){
  var el=$('gb_status');
  if(S.api){
    el.textContent='云端 · '+S.api.replace(/^https?:\/\//,'');
    el.title='点击修改后端地址';
  }else{
    el.textContent='本地模式';
    el.title='点击配置云端接口';
  }
}
function gbOpenConfig(){
  $('gb_api_input').value=S.api;
  $('gb_config_dialog').style.display='flex';
  setTimeout(function(){ $('gb_api_input').focus(); },40);
}
function gbCloseConfig(){ $('gb_config_dialog').style.display='none'; }
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
  if(S.user) pmRefreshConversations();
}

/* 启动时自动从 GitHub 读取云端地址（由「一键启动云端.bat」推送）
   源顺序：jsDelivr CDN（国内可达，raw 超时的替代）→ GitHub Pages → raw.githubusercontent */
function fetchCloudTxt(){
  var t=Date.now();
  var u2='https://fastly.jsdelivr.net/gh/wtz-YEE/wtz-YEE.github.io@main/cloud.txt?t='+t;
  var u1='https://wtz-YEE.github.io/cloud.txt?t='+t;
  var u0='https://raw.githubusercontent.com/wtz-YEE/wtz-YEE.github.io/main/cloud.txt?t='+t;
  return fetch(u2,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.text()}).catch(function(){
    return fetch(u1,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.text()}).catch(function(){
      return fetch(u0,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.text()});
    });
  });
}
function autoCloud(){
  var lb=$('guestbookList');
  if(lb && !S.api) lb.innerHTML='<div class="gb-empty">正在连接云端…</div>';
  fetchCloudTxt().then(function(t){
    var apis=parseApis(t||'').filter(function(x){return !isBadApi(x)});
    if(!apis.length) return;
    S.apis=apis;
    pickAlive(apis).then(function(al){
     if(!al){S.api='';S.apis=apis;updateModeLabel();say('云端离线 · 地址失效',true);loadGuestBook();return;}
     var a=al;S.api=a;
     try{ localStorage.setItem(K_API,apis.join('\n')); }catch(e){}
     updateModeLabel();
     say(apis.length>1?('已接入多云端 · '+apis.length+' 台主机'):('已自动接入云端 · '+a),true);
     loadGuestBook();loadNotes();hitCloud();
     if(S.user) pmRefreshConversations();
     autoRelogin();ntRefresh();
    });
  }).catch(function(){});
}

function cloudProbe(u){
  if(!u) return Promise.resolve(false);
  var c=new AbortController(),t=setTimeout(function(){c.abort()},6000);
  return fetch(u+'/health',{cache:'no-store',signal:c.signal}).then(function(r){
    return r.ok?r.json().then(function(j){return !!(j&&j.ok)}).catch(function(){return false}):false;
  }).catch(function(){return false}).then(function(v){clearTimeout(t);return v});
}
function pickAlive(apis){
 return Promise.all((apis||[]).map(function(u){return cloudProbe(u).then(function(ok){return ok?u:null})})).then(function(rs){for(var i=0;i<rs.length;i++)if(rs[i])return rs[i];return apis&&apis[0]?apis[0]:null});
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
      pickAlive(apis).then(function(al){if(al)S.api=al;else{S.api='';updateModeLabel();say('云端离线 · 地址失效',true);}});
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
window.cloudRecover=cloudRecover;
setTimeout(cloudRecover,2500);
setInterval(cloudRecover,60000);

/* 全局：新版本清理旧版本残留（仅清纯缓存，保留全部用户数据/偏好/会话） */
window.cleanLegacy=function(){
  var ks=['gb_cache_v1','gb_db_v1'];
  for(var i=0;i<ks.length;i++){ try{localStorage.removeItem(ks[i]);}catch(e){} }
};
/* 主机版本检测（60s 自动轮询 · 检测到新版本提示刷新） */
(function(){
  var VK='wz_ver';
  var bar=document.getElementById('updBar');
  var btn=document.getElementById('updBtn');
  btn.addEventListener('click',function(){location.reload()});
  function chk(){
    fetch('https://api.github.com/repos/wtz-YEE/wtz-YEE.github.io/commits/main').then(function(r){
      if(!r.ok)throw 0;
      return r.json();
    }).then(function(j){
      var sha=j.sha||'';
      if(!sha)return;
      var old='';
      try{old=localStorage.getItem(VK)||''}catch(e){}
      if(old&&old!==sha){
        try{window.cleanLegacy&&window.cleanLegacy()}catch(e){}
        bar.classList.remove('hidden');
        try{
          var v=String(sha).slice(0,7);
          setTimeout(function(){
            location.href=location.href.split('#')[0]+(location.href.indexOf('?')<0?'?':'&')+'v='+v;
          },3000);
        }catch(e){}
      }
      try{localStorage.setItem(VK,sha)}catch(e){}
    }).catch(function(){});
  }
  setTimeout(chk,1200);
  setInterval(chk,60000);
})();

/* ---------- 顶栏动态 ---------- */
(function(){
  var st=document.getElementById('status');
  if(!st) return;
  var on=function(){ st.classList.toggle('scrl',(window.scrollY||document.documentElement.scrollTop)>40); };
  window.addEventListener('scroll',on,{passive:true}); on();
})();

/* ---------- 节日彩蛋 ---------- */
(function(){
  var fxmap={
    '01-01':{t:'fire',n:'元旦'},'02-14':{t:'heart',n:'情人节'},'03-08':{t:'balloon',n:'妇女节'},
    '04-01':{t:'confetti',n:'愚人节'},'05-01':{t:'confetti',n:'劳动节'},'06-01':{t:'confetti',n:'儿童节'},
    '10-01':{t:'fire',n:'国庆节'},'10-31':{t:'ghost',n:'万圣节'},'12-24':{t:'snow',n:'平安夜'},'12-25':{t:'snow',n:'圣诞节'}
  };
  var q=(location.search.match(/[?&]fx=([\w-]+)/)||[])[1];
  var d=new Date(), k=('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
  var ev=q?{t:q,n:'彩蛋预览'}:(fxmap[k]||null);
  if(!ev) return;
  var cv=document.getElementById('fx'); if(!cv) return;
  cv.style.display='block';
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ cv.style.opacity='1'; }); });
  var tg=document.getElementById('fxTag'),tgN=document.getElementById('fxTagN');
  if(tg){ tgN.textContent=ev.n; tg.style.display='block'; requestAnimationFrame(function(){ requestAnimationFrame(function(){ tg.style.opacity='1'; }); }); }
  var ctx=cv.getContext('2d'),W=0,H=0,ps=[],TY=ev.t;
  var _cap=(innerWidth<600)?60:120,_rate=(innerWidth<600)?0.18:0.35;
  function rs(){ W=cv.width=innerWidth; H=cv.height=innerHeight; }
  rs(); addEventListener('resize',rs);
  var C={snow:'#FFFFFF',heart:'#FF5C7A',confetti:'#FFC24B',balloon:'#E6EDEF',ghost:'#9BA9AD',fire:'#FFC24B'}[TY]||'#FFFFFF';
  var star=[];
  function mkTop(){ return {x:40+Math.random()*W*.6,y:H+10,vy:-3-Math.random()*4,vx:(Math.random()-.5)*2,s:2}; }
  function mkPart(p){
    var a2=[];
    for(var i=0;i<60;i++){ var a=Math.random()*6.283,sp=1+Math.random()*3.5;
      a2.push({x:p.x,y:p.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,s:1+Math.random()*2.5,life:28+Math.random()*22,b:1}); }
    return a2;
  }
  function frame(){
    requestAnimationFrame(frame);
    ctx.clearRect(0,0,W,H);
    if(TY==='fire'){
      if(star.length<2&&Math.random()<.06) star.push(mkTop());
      for(var i=star.length-1;i>=0;i--){
        var s=star[i]; s.x+=s.vx; s.y+=s.vy; s.vy+=.06;
        ctx.fillStyle=C; ctx.globalAlpha=.95;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.s,0,6.283); ctx.fill();
        if(s.vy>-1){ ps=ps.concat(mkPart(s)); star.splice(i,1); }
      }
    }
    if(ps.length<_cap&&Math.random()<_rate){
      var p={x:Math.random()*W,y:TY==='balloon'?H+30:-30,vx:(Math.random()-.5)*.8,vy:1+Math.random()*2,s:TY==='balloon'?9+Math.random()*11:2+Math.random()*4,b:0};
      if(TY==='snow'){p.vy=.5+Math.random()*1.1;p.vx=(Math.random()-.5)*.5;}
      if(TY==='confetti'){p.vy=1.5+Math.random()*2.5;p.vx=(Math.random()-.5)*2;}
      if(TY==='heart'){p.vy=.8+Math.random()*1.1;p.vx=(Math.random()-.5)*.9;p.s=5+Math.random()*7;}
      if(TY==='ghost'){p.vy=.5+Math.random()*1.1;p.vx=(Math.random()-.5)*1.5;p.s=7+Math.random()*9;}
      if(TY==='balloon'){p.vy=-(.5+Math.random()*.7);p.vx=(Math.random()-.5)*.8;}
      ps.push(p);
    }
    for(var j=ps.length-1;j>=0;j--){
      var q2=ps[j];
      if(q2.b){ q2.x+=q2.vx; q2.y+=q2.vy; q2.vy+=.035; q2.life--; if(q2.life<=0){ps.splice(j,1);continue} }
      else { q2.x+=q2.vx; q2.y+=q2.vy; }
      ctx.globalAlpha=q2.b?Math.min(1,q2.life/20)*.9:.75;
      ctx.fillStyle=q2.b?C:'#E6EDEF';
      if(TY==='heart'){
        ctx.save(); ctx.translate(q2.x,q2.y); ctx.scale(q2.s/10,q2.s/10);
        ctx.beginPath(); ctx.moveTo(0,3);
        ctx.bezierCurveTo(-6,-3,-2,-8,0,-4); ctx.bezierCurveTo(2,-8,6,-3,0,3);
        ctx.fill(); ctx.restore();
      } else if(TY==='ghost'){
        ctx.beginPath(); ctx.arc(q2.x,q2.y,q2.s,Math.PI,0); ctx.rect(q2.x-q2.s,q2.y,q2.s*2,q2.s*.8); ctx.fill();
      } else if(TY==='balloon'){
        ctx.beginPath(); ctx.ellipse(q2.x,q2.y,q2.s,q2.s*1.3,0,0,6.283); ctx.fill();
        ctx.strokeStyle=C; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(q2.x,q2.y+q2.s*1.3); ctx.lineTo(q2.x,q2.y+q2.s*2.2); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(q2.x,q2.y,q2.s,0,6.283); ctx.fill();
      }
      if(q2.y>H+40||q2.y<-80||q2.x<-60||q2.x>W+60) ps.splice(j,1);
    }
    ctx.globalAlpha=1;
  }
  frame();
})();

/* ---------- 事件绑定 ---------- */
function bind(){
  $('gb_btn_reg').addEventListener('click',gbRegister);
  $('gb_btn_login').addEventListener('click',gbLogin);
  $('gb_btn_logout').addEventListener('click',gbLogout);
  var cur=$('gb_curuser');
  if(cur) cur.addEventListener('click',function(){ if(S.user) openProfile(S.user.username); });
  $('gb_submit').addEventListener('click',submitGuestBook);
  $('gb_uref').addEventListener('click',loadUsers);
  setInterval(function(){
    if(S.user&&S.user.token) call('/ping',{}).catch(function(){});
  },60000);
  $('gb_btn_ck').addEventListener('click',doCheckin);
  $('gb_n_send').addEventListener('click',noticeSend);
  $('gb_n_cancel').addEventListener('click',function(){ $('gb_n_form').style.display='none'; });
  $('gb_n_list').addEventListener('click',function(e){
    var b=e.target.closest('[data-nd]'); if(!b) return;
    call('/notice_del',{id:b.getAttribute('data-nd')}).then(function(j){
      if(!j.ok) return say(j.msg||'删除失败',false);
      loadNotes();
    }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
  });
  $('gb_btn_recover').addEventListener('click',gbRcShow);
  $('gb_rc_user').addEventListener('keydown',function(e){ if(e.key==='Enter') gbRcQ(); });
  $('gb_rc_ans').addEventListener('keydown',function(e){ if(e.key==='Enter') gbRcGo(); });
  $('gb_rc_pwd').addEventListener('keydown',function(e){ if(e.key==='Enter') gbRcGo(); });
  $('gb_rc_go').addEventListener('click',gbRcQ);
  $('gb_rc_ok').addEventListener('click',gbRcGo);
  $('gb_rc_x').addEventListener('click',function(){ $('gbRecMask').style.display='none'; });
  $('gb_btn_sec').addEventListener('click',gbSecShow);
  $('gb_sec_ok').addEventListener('click',gbSecSave);
  $('gb_sec_x').addEventListener('click',function(){ $('gbSecMask').style.display='none'; });
  $('gb_btn_pwd').addEventListener('click',function(){ $('gb_pwd_dialog').style.display='flex'; });
  $('gb_pwd_cancel').addEventListener('click',function(){ $('gb_pwd_dialog').style.display='none'; });
  $('gb_pwd_save').addEventListener('click',function(){
    var o=$('gb_pwd_old').value,n=$('gb_pwd_new').value;
    if(!o||!n) return say('请填完整',false);
    call('/change_pwd',{old:o,new:n}).then(function(j){
      say(j.msg||(j.ok?'密码已修改':'修改失败'),!!j.ok);
      if(j.ok){ $('gb_pwd_dialog').style.display='none'; $('gb_pwd_old').value=''; $('gb_pwd_new').value=''; }
    }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
  });
  $('guestbookList').addEventListener('click',function(e){
    var rb=e.target.closest('[data-reply]');
    if(rb){
      var rid=rb.getAttribute('data-reply');
      S.replyTo=rid;
      var ta=$('gb_text');
      ta.value='回复 #'+rid+'：';ta.focus();
      say('正在回复 #'+rid+' · 填写内容后提交',false);
      return;
    }
    var pu=e.target.closest('[data-u]');
    if(pu){ openProfile(pu.getAttribute('data-u')); return; }
    var rb=e.target.closest('.gb-reson');
    if(rb){
      if(!S.user) return say('先登录再共鸣',false);
      var resonId=rb.getAttribute('data-reson');
      var rCard=rb.closest('.gb-item');
      call('/guest_resonate',{id:resonId}).then(function(j){
        if(!j.ok) return say(j.msg||'共鸣失败',false);
        doResonRipple(j.n||0,rCard);
        try{
          var cache=null;try{cache=JSON.parse(localStorage.getItem(K_GB)||'null')}catch(e){}
          if(cache&&cache.list){
            var un=S.user.username;
            for(var k=0;k<cache.list.length;k++){
              var g0=cache.list[k];
              if(g0&&String(g0.id)===String(resonId)){
                var rs=g0.reson||[];
                var ix=rs.indexOf(un);
                if(ix>=0) rs.splice(ix,1); else rs.push(un);
                g0.reson=rs;
                break;
              }
            }
            try{localStorage.setItem(K_GB,JSON.stringify(cache))}catch(e){}
            renderGuests(cache.list);
          }
        }catch(e){}
        setTimeout(loadGuestBook,2600);
      }).catch(function(e){ say('共鸣失败：'+ferr(e.message)+(ferr(e.message).indexOf('429')>=0?' · 操作过快请稍候':''),false); });
      return;
    }
    var b=e.target.closest('.gb-like'); if(!b) return;
    if(!S.user) return say('先登录再点赞',false);
    var likeId=b.getAttribute('data-like');
    call('/guest_like',{id:likeId}).then(function(j){
      if(!j.ok) return say(j.msg||'点赞失败',false);
      try{
        var cache=null;try{cache=JSON.parse(localStorage.getItem(K_GB)||'null')}catch(e){}
        if(cache&&cache.list){
          var un=S.user.username;
          for(var k=0;k<cache.list.length;k++){
            var g0=cache.list[k];
            if(g0&&String(g0.id)===String(likeId)){
              var ls=g0.likes||[];
              var ix=ls.indexOf(un);
              if(ix>=0) ls.splice(ix,1); else ls.push(un);
              g0.likes=ls;
              break;
            }
          }
          try{localStorage.setItem(K_GB,JSON.stringify(cache))}catch(e){}
          renderGuests(cache.list);
        }
      }catch(e){}
      setTimeout(loadGuestBook,2600);
    }).catch(function(e){ say('点赞失败：'+ferr(e.message)+ (ferr(e.message).indexOf('429')>=0?' · 操作过快请稍候':''),false); });
  });
  $('gb_ulist').addEventListener('click',function(e){
    var b=e.target.closest('[data-ua]');
    if(b){
      var t=b.getAttribute('data-ua'),adm=b.getAttribute('data-uadm')==='1';
      call('/admin_set_admin',{target:t,admin:!adm}).then(function(j){
        say(j.msg||(j.ok?'已更新':'失败'),!!j.ok);
        if(j.ok) loadUsers();
      }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
      return;
    }
    b=e.target.closest('[data-uban]');
    if(b){
      var t2=b.getAttribute('data-uban'),ban=b.getAttribute('data-ubanned')==='1';
      if(!confirm(ban?'确认解除拉黑 '+t2+' ？':'确认拉黑 '+t2+' ？（拉黑后无法留言/发帖/评论）')) return;
      call('/admin_ban_user',{target:t2,ban:!ban}).then(function(j){
        say(j.msg||(j.ok?'已操作':'失败'),!!j.ok);
        if(j.ok) loadUsers();
      }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
      return;
    }
    b=e.target.closest('[data-udel]');
    if(b){
      var t3=b.getAttribute('data-udel');
      if(!confirm('确认删除用户 '+t3+' ？此操作不可恢复')) return;
      call('/admin_del_user',{target:t3}).then(function(j){
        say(j.msg||(j.ok?'已删除':'失败'),!!j.ok);
        if(j.ok) loadUsers();
      }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
      return;
    }
    b=e.target.closest('[data-ukick]');
    if(b){
      var t4=b.getAttribute('data-ukick');
      if(!confirm('确认删除 '+t4+' 的全部登录会话（强制下线）？')) return;
      call('/admin_del_session',{user:t4}).then(function(j){
        say(j.msg||(j.ok?'已操作':'失败'),!!j.ok);
        if(j.ok) loadUsers();
      }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
    }
  });
  $('gb_img_btn').addEventListener('click',function(){
    if(!S.api) return say('需云端模式才能发图',false);
    $('gb_file').click();
  });
  var EMJ=['😀','😂','🤣','😊','😍','😘','😎','🤔','😭','😅','😡','👍','👎','🙏','💪','🔥','✨','🎉','❤️','💀','👻','🤖','🌈','🍀'];
  var ep=$('gb_emoji_panel');
  if(ep){
    ep.innerHTML=EMJ.map(function(x){return '<span data-e="'+x+'">'+x+'</span>'}).join('');
    $('gb_emoji_btn').addEventListener('click',function(ev){ev.stopPropagation();ep.classList.toggle('on')});
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
  $('gb_file').addEventListener('change',uploadImg);
  $('gb_av_file').addEventListener('change',uploadAvatar);
  initAvatarPick();
  $('pm_send_btn').addEventListener('click',pmSend);
  $('gb_status').addEventListener('click',gbOpenConfig);
  $('gb_refresh').addEventListener('click',function(){
    loadGuestBook();
    say('留言已刷新',true);
  });
  $('gb_cfg_save').addEventListener('click',gbSaveConfig);
  $('gb_cfg_cancel').addEventListener('click',gbCloseConfig);
  $('gb_ban_btn').addEventListener('click',function(){
    var box=$('gb_ban_list');
    if(box.style.display!=='none'){ box.style.display='none'; return; }
    call('/admin_banned_get',{}).then(function(j){
      if(!j.ok) return say(j.msg||'获取失败',false);
      if(!j.list||!j.list.length){ box.innerHTML='<div style="color:var(--ok)">暂无危险 IP</div>'; box.style.display=''; return; }
      box.innerHTML=j.list.map(function(b){
        var hh=Math.max(1,Math.ceil(b.remain/3600));
        return '<div style="display:flex;gap:8px;align-items:center;padding:3px 0;border-bottom:1px solid var(--line)">'+
          '<b style="color:var(--bad)">'+esc(b.ip)+'</b>'+
          '<span style="color:var(--ink3)">原账号 '+esc(b.name||'-')+'</span>'+
          '<span style="color:var(--ink3)">'+esc(b.time)+' · 由 '+esc(b.by)+' · 剩 '+hh+'h</span>'+
          '<button class="gb-btn ghost" data-bc="'+esc(b.ip)+'" style="padding:1px 8px;font-size:10px">解除</button>'+
        '</div>';
      }).join('');
      box.style.display='';
    }).catch(function(e){ say('请求失败，服务器摸鱼了：'+ferr(e.message),false); });
  });
  $('gb_ban_list').addEventListener('click',function(e){
    var b=e.target.closest('[data-bc]');
    if(!b) return;
    call('/admin_banned_clear',{ip:b.getAttribute('data-bc')}).then(function(j){
      say(j.msg||(j.ok?'已解除':'失败'),!!j.ok);
      if(j.ok) $('gb_ban_btn').click();
    }).catch(function(e2){ say('请求失败：'+e2.message,false); });
  });
  $('gb_punish_btn').addEventListener('click',function(){
    var box=$('gb_punish_list');
    if(box.style.display!=='none'){ box.style.display='none'; return; }
    box.innerHTML='<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px">'+
      '<input id="gb_pun_ip" placeholder="输入 IP" style="background:var(--bg2);color:var(--ink2);border:1px solid var(--line);font-size:10.5px;padding:3px 6px;border-radius:3px;width:130px;font-family:var(--mono)">'+
      '<input id="gb_pun_name" placeholder="备注(可选)" style="background:var(--bg2);color:var(--ink2);border:1px solid var(--line);font-size:10.5px;padding:3px 6px;border-radius:3px;width:110px;font-family:var(--mono)">'+
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
      var html='';
      (j.panic||[]).forEach(function(x){
        html+='<div style="display:flex;gap:8px;align-items:center;padding:3px 0;border-bottom:1px solid var(--line)"><b style="color:var(--bad)">☠ '+esc(x.ip)+'</b><span style="color:var(--ink3)">崩坏 · '+esc(x.by||'-')+' · '+esc(x.time)+'</span><button class="gb-btn ghost" data-pd="panic|'+esc(x.ip)+'" style="padding:1px 8px;font-size:10px">解除</button></div>';
      });
      (j.ban||[]).forEach(function(x){
        html+='<div style="display:flex;gap:8px;align-items:center;padding:3px 0;border-bottom:1px solid var(--line)"><b style="color:var(--bad)">⛔ '+esc(x.ip)+'</b><span style="color:var(--ink3)">封禁 · '+esc(x.by||'-')+' · '+esc(x.time)+' · 剩 '+Math.max(0,x.remain)+'s</span><button class="gb-btn ghost" data-pd="ban|'+esc(x.ip)+'" style="padding:1px 8px;font-size:10px">解除</button></div>';
      });
      if(!html) html='<div style="color:var(--ok)">暂无惩罚记录</div>';
      rows.innerHTML=html;
    }).catch(function(e){ say('请求失败：'+ferr(e.message),false); });
  }
  $('gb_punish_list').addEventListener('click',function(e){
    var add=e.target.closest('[data-pact]');
    if(add){
      var ip=$('gb_pun_ip').value.trim(); if(!ip) return say('请输入 IP',false);
      var nm=$('gb_pun_name').value.trim();
      call('/admin_punish',{ip:ip,name:nm,type:add.getAttribute('data-pact'),action:'add'}).then(function(j){
        say(j.msg||(j.ok?'已添加':'失败'),!!j.ok); if(j.ok){ punishLoad(); $('gb_pun_ip').value=''; $('gb_pun_name').value=''; }
      }).catch(function(e2){ say('请求失败：'+e2.message,false); });
      return;
    }
    var pd=e.target.closest('[data-pd]');
    if(pd){
      var a=pd.getAttribute('data-pd').split('|');
      call('/admin_punish',{ip:a[1],type:a[0],action:'remove'}).then(function(j){
        say(j.msg||(j.ok?'已解除':'失败'),!!j.ok); if(j.ok) punishLoad();
      }).catch(function(e2){ say('请求失败：'+e2.message,false); });
    }
  });
  $('gb_config_dialog').addEventListener('click',function(e){
    if(e.target===$('gb_config_dialog')) gbCloseConfig();
  });

  /* 密码框回车即登录 */
  $('gb_pwd').addEventListener('keydown',function(e){
    if(e.key==='Enter') gbLogin();
  });

  /* 留言删除（事件委托，管理员 / 本人可删） */
  $('guestbookList').addEventListener('click',function(e){
    var rep=e.target.closest('[data-rep]');
    if(rep){
      var rid=rep.getAttribute('data-rep');
      call('/guest_report',{id:rid,token:S.user&&S.user.token}).then(function(j){
        if(!j||!j.ok) return say((j&&j.msg)||'举报失败',false);
        GB_REPORTED[rid]=1; rep.style.opacity='.4'; rep.disabled=true;
        say((j.hidden?'已自动隐藏该留言（3 人举报）':'举报已记录')+(j.n?' · '+j.n+'/3':''),true);
      }).catch(function(err){ say('举报失败：'+ferr(err.message),false); });
      return;
    }
    var tag=e.target.closest('[data-tag]');
    if(tag){
      GB_FILTER_TAG=GB_FILTER_TAG===tag.getAttribute('data-tag')?'':tag.getAttribute('data-tag');
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
        }catch(e){}
        loadGuestBook();
        if(typeof fullSyncGb==='function') setTimeout(fullSyncGb,1200);
      }
    }).catch(function(err){ say('删除失败：'+err.message,false); });
  });

  /* 会话列表点击 */
  $('pm_conv').addEventListener('click',function(e){
    var d=e.target.closest('[data-pcd]');
    if(d){
      e.stopPropagation();
      var peer=d.getAttribute('data-pcd');
      if(!confirm('删除与 '+peer+' 的整个会话？')) return;
      call('/pm_delconv',{peer:peer}).then(function(j){
        if(!j.ok) return say(j.msg||'删除失败',false);
        if(S.peer===peer){ S.peer=''; S.thread=[]; $('pm_title').textContent='选择会话，或直接输入对方账号'; $('pm_box').innerHTML=''; }
        pmRefreshConversations();
      }).catch(function(e){ say('删除失败：'+ferr(e.message),false); });
      return;
    }
    var it=e.target.closest('[data-peer]');
    if(!it) return;
    pmOpen(it.getAttribute('data-peer'));
  });
  var pb=$('pm_box');
  if(pb) pb.addEventListener('click',function(e){
    var d=e.target.closest('[data-pmd]');
    if(!d) return;
    e.stopPropagation();
    var id=d.getAttribute('data-pmd');
    if(!confirm('删除这条消息？')) return;
    call('/pm_del',{id:id}).then(function(j){
      if(!j.ok) return say(j.msg||'删除失败',false);
      if(S.thread) S.thread=S.thread.filter(function(x){return String(x.id)!==String(id)});
      renderThread(S.thread||[]);
      setTimeout(pmRefreshThread,2600);
    }).catch(function(e){ say('删除失败：'+ferr(e.message),false); });
  });
  var ib=$('pm_img_btn');
  if(ib) ib.addEventListener('click',function(){ if(!S.api) return say('需云端模式才能发图',false); $('pm_file').click(); });
  var pf=$('pm_file');
  if(pf) pf.addEventListener('change',function(){
    var f=pf.files[0]; if(!f) return;
    if(f.size>8*1024*1024) return say('图太大（超过 8MB）',false);
    compressImg(f,function(data){
      if(!data) return say('图片读取失败',false);
      call('/upload',{data:data}).then(function(j){
        if(!j.ok) return say(j.msg||'上传失败',false);
        S.pmImg=j.url;
        var a=$('pm_att');
        if(a){ a.innerHTML='<img src="'+esc(S.api+j.url)+'"><button id="pm_img_rm">移除</button>'; a.style.display='flex';
          var rm=$('pm_img_rm'); if(rm) rm.addEventListener('click',clearPmImg); }
        say('图片搞定',true);
      }).catch(function(e){ say('上传失败：'+ferr(e.message),false); });
    });
  });

  /* 私聊回车发送 */
  $('pm_msg').addEventListener('keydown',function(e){
    if(e.key==='Enter'){ e.preventDefault(); pmSend(); }
  });
  $('pm_target').addEventListener('keydown',function(e){
    if(e.key==='Enter'){ e.preventDefault(); $('pm_msg').focus(); }
  });
}

/* ---------- 启动 ---------- */
(function(){
try{bind()}catch(e){}
try{updateModeLabel()}catch(e){}
try{applyAuth()}catch(e){}
try{loadGuestBook()}catch(e){}
try{autoCloud()}catch(e){}
if(S.user){
  try{pmRefreshConversations()}catch(e){}
  try{startPoll()}catch(e){}
  try{applyAuth()}catch(e){}
  try{shopBadge()}catch(e){}
}
})();

/* 暴露到全局，兼容页面里可能存在的内联调用 */
window.gbRegister=gbRegister;
window.gbLogin=gbLogin;
window.gbLogout=gbLogout;
window.submitGuestBook=submitGuestBook;
window.loadGuestBook=loadGuestBook;
window.pmSend=pmSend;
window.pmRefresh=pmRefreshThread;
window.gbOpenConfig=gbOpenConfig;
window.gbCloseConfig=gbCloseConfig;
window.gbSaveConfig=gbSaveConfig;

(function(){
var TITLES=['见习守夜人','守夜人','资深守夜人','守夜骑士','守望者','夜色领主','冥灯主宰','WTZ亲卫队'];
function lvOf(e){var l=1;while(e>=50*l*(l+1))l++;return l}
window.lvOf=lvOf;
window.titleOf=function(e){return TITLES[Math.min(lvOf(e),TITLES.length)-1]};
function lvUpd(j){
  var b=document.getElementById('lvBtn');if(!b)return;
  if(!S.user){b.style.display='none';return}
  if(j&&j.exp!==undefined){var e=+j.exp||0,l=lvOf(e);b.textContent='LV '+l+' · '+TITLES[Math.min(l,TITLES.length)-1]}
  b.style.display='';
  b.title='点击签到';
}
window.lvUpd=lvUpd;
var lvB=document.getElementById('lvBtn');
if(lvB)lvB.onclick=function(){if(typeof doCheckin==='function')doCheckin()};
var pmB=document.getElementById('pmBadge');
if(pmB)pmB.onclick=function(){var p=document.getElementById('gb_pm_panel');if(p)p.classList.toggle('on')};
var AC=null,bgmG=null,bgmT=null;
var bgmSeq=[[220,261.63,329.63],[174.61,220,261.63],[261.63,329.63,392],[196,246.94,293.66]];
var bgmOn=localStorage.getItem('wzBgm')==='1';
var bgmB=document.getElementById('bgmBtn');
var bgmA=null,bgmErr=false;
function bgmPlay(){
  if(bgmErr) return;
  if(!bgmA){
    bgmA=new Audio('bgm.mp3');
    bgmA.loop=true;
    bgmA.volume=0.4;
    bgmA.addEventListener('error',function(){ bgmErr=true; if(bgmB)bgmB.textContent='♪'; });
  }
  var pr=bgmA.play();
  if(pr&&pr.catch) pr.catch(function(){});
  bgmOn=true;localStorage.setItem('wzBgm','1');
  if(bgmB)bgmB.textContent='♫';
}
function bgmStop(){
  if(bgmA){ try{bgmA.pause()}catch(e){} try{bgmA.currentTime=0}catch(e){} }
  bgmOn=false;localStorage.setItem('wzBgm','0');
  if(bgmB)bgmB.textContent='♪';
}
if(bgmB)bgmB.onclick=function(){if(bgmOn)bgmStop();else bgmPlay()};
if(bgmOn){var bd1=function(){bgmPlay();document.removeEventListener('click',bd1);document.removeEventListener('touchstart',bd1);document.removeEventListener('keydown',bd1)};document.addEventListener('click',bd1);document.addEventListener('touchstart',bd1);document.addEventListener('keydown',bd1)}
var srchB=document.getElementById('srchBtn'),srchM=document.getElementById('srchM'),srchIn=document.getElementById('srchIn'),srchGo=document.getElementById('srchGo'),srchOut=document.getElementById('srchOut');
function escS(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function hlW(q,s){ var qq=String(q||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); return escS(s).replace(new RegExp('('+qq+')','ig'),'<mark class="hl">$1</mark>'); }
function srchRender(res, cur, q){
  var keys=['用户','留言','帖子','评论'];
  var tabs='<div class="srch-tabs"><button class="srch-tab'+(cur===''?' on':'')+'" data-t="">全部</button>';
  var total=0;
  keys.forEach(function(k){ var n=(res[k]||[]).length; total+=n; if(n) tabs+='<button class="srch-tab'+(cur===k?' on':'')+'" data-t="'+k+'">'+k+' ('+n+')</button>'; });
  tabs+='</div>';
  var h=tabs;
  if(cur===''){ keys.forEach(function(k){ var arr=res[k]||[]; if(!arr.length) return; h+='<div style="margin:8px 0 4px;color:var(--accent)">'+k+' ('+arr.length+')</div>'; h+=arr.slice(0,6).map(function(x){ return srchRow(x,q,k); }).join(''); }); }
  else{ var arr=res[cur]||[]; h+=arr.slice(0,20).map(function(x){ return srchRow(x,q,cur); }).join(''); }
  if(!total) h+='<div style="color:var(--ink3);padding:8px">未找到相关结果</div>';
  srchOut.innerHTML=h;
  var ts=srchOut.querySelectorAll('.srch-tab');
  for(var i=0;i<ts.length;i++) ts[i].addEventListener('click',function(){ srchRender(res,this.getAttribute('data-t'),q); });
}
function srchRow(x,q,k){
  var body=hlW(q,(x.text||'').slice(0,90));
  var usr=hlW(q,x.user||'');
  if(k==='用户') body=usr;
  var jump=k==='用户'?'<span style="color:var(--ink)">'+body+'</span><div style="color:var(--ink3);font-size:10.5px">账号库</div>':'<span style="color:var(--ink)">'+usr+' · '+escS(x.time)+'</span><br>'+body+'<div style="color:var(--ink3);font-size:10.5px">'+escS(x.ref||'')+'</div>';
  return '<div class="pf-row" data-srch="'+k+'">'+jump+'</div>';
}
function doSearch(){
  var q=(srchIn.value||'').trim();
  if(!q){srchOut.innerHTML='<div style="color:var(--ink3);padding:8px">输入关键词</div>';return}
  srchOut.innerHTML='<div style="color:var(--ink3);padding:8px">搜索中…</div>';
  var ql=q.toLowerCase(),res={用户:[],留言:[],帖子:[],评论:[]};
  try{var c=JSON.parse(localStorage.getItem(K_GB)||'null');
    if(c&&c.list)c.list.forEach(function(x){
      if((x.text||'').toLowerCase().indexOf(ql)>=0||(x.name||'').toLowerCase().indexOf(ql)>=0)res['留言'].push({text:x.text,user:x.name||x.user||'',time:x.time,ref:'留言板'})});
  }catch(e){}
  var done=false;
  call('/search',{q:q},'GET').then(function(j){
    if(done)return;done=true;
    if(j&&j.ok&&j.list) j.list.forEach(function(x){
      var k=x.type==='用户'?'用户':(x.type==='帖子'?'帖子':(x.type==='评论'?'评论':'留言'));
      if(k==='留言'&&res['留言'].some(function(y){return y.time===x.time&&y.text===x.text})) return;
      res[k].push(x);
    });
    srchRender(res,'',q);
  }).catch(function(){
    if(done)return;done=true;
    if(res['留言'].length) srchRender(res,'',q);
    else srchOut.innerHTML='<div style="color:var(--ink3);padding:8px">云端未连接 · 仅本地留言</div>';
  });
}
if(srchOut) srchOut.addEventListener('click',function(e){
  var t=e.target.closest('[data-srch]');
  if(!t) return;
  var k=t.getAttribute('data-srch');
  if(k==='用户'){
    var nm=(t.querySelector('.pf-t')||t.querySelector('span')||{}).textContent||'';
    nm=nm.replace(/<[^>]+>/g,'');
    openProfile(nm);
  }else{ window.open('pages/守夜人论坛.html'); }
});
if(srchB)srchB.onclick=function(){if(srchM){srchM.style.display='flex';setTimeout(function(){if(srchIn)srchIn.focus()},60)}};
if(srchGo)srchGo.onclick=doSearch;
if(srchIn)srchIn.addEventListener('keydown',function(e){if(e.key==='Enter')doSearch()});
var rkB=document.getElementById('gb_risk_btn');
var rkIn=document.getElementById('gb_risk_kw');
var rkAll=document.getElementById('gb_risk_all');
var rkW=document.getElementById('gb_risk_words');
function rkWShow(l){
  if(!rkW)return;
  rkW.textContent='';
  var ls=l||[];
  if(!ls.length){
    var e=document.createElement('span');
    e.textContent='暂无关键词';
    e.style.cssText='font-size:12px;color:var(--dim)';
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
        if(typeof say==='function')say(j.msg||'',true);
        rkWShow(j.words||[]);
      }).catch(function(e){if(typeof say==='function')say('失败：'+ferr(e.message),false)});
    };
    s.appendChild(t);
    s.appendChild(d);
    rkW.appendChild(s);
  });
}
function rkBusy(on,btn,txt){
  if(!btn)return;
  btn.disabled=on;
  if(on){btn.dataset.t=btn.textContent;btn.textContent=txt}
  else if(btn.dataset.t){btn.textContent=btn.dataset.t;delete btn.dataset.t}
}
function riskRun(){
  var kw=(rkIn.value||'').trim();
  if(!kw){if(typeof say==='function')say('请输入风控关键词',false);return}
  if(typeof say==='function')say('上传云端扫描中…',true);
  rkBusy(true,rkAll,'扫描中…');
  call('/admin_scan',{kw:kw}).then(function(j){
    rkBusy(false,rkAll);
    if(!j.ok){if(typeof say==='function')say(j.msg||'风控失败',false);return}
    if(typeof say==='function')say((j.msg||'')+'：'+(j.hits||[]).join('、'),true);
    if(typeof loadUsers==='function')loadUsers();
    rkWShow(j.words||[]);
  }).catch(function(e){rkBusy(false,rkAll);if(typeof say==='function')say('请求失败，服务器摸鱼了：'+ferr(e.message),false)});
}
if(rkB)rkB.onclick=function(){
  var kw=(rkIn.value||'').trim();
  if(!kw){if(typeof say==='function')say('请输入风控关键词',false);return}
  rkBusy(true,rkB,'上传中…');
  call('/risk_words_add',{words:kw}).then(function(j){
    rkBusy(false,rkB);
    if(typeof say==='function')say(j.msg||'',true);
    rkWShow(j.words||[]);
    if(j.ok)rkIn.value='';
  }).catch(function(e){rkBusy(false,rkB);if(typeof say==='function')say('失败：'+ferr(e.message),false)});
};
if(rkAll)rkAll.onclick=function(){
  if(typeof say==='function')say('云端扫描全部关键词…',true);
  rkBusy(true,rkAll,'扫描中…');
  call('/admin_scan',{}).then(function(j){
    rkBusy(false,rkAll);
    if(!j.ok){if(typeof say==='function')say(j.msg||'风控失败',false);return}
    if(typeof say==='function')say((j.msg||'')+'：'+(j.hits||[]).join('、'),true);
    if(typeof loadUsers==='function')loadUsers();
  }).catch(function(e){rkBusy(false,rkAll);if(typeof say==='function')say('请求失败，服务器摸鱼了：'+ferr(e.message),false)});
};
if(rkIn)rkIn.addEventListener('keydown',function(e){if(e.key==='Enter')riskRun()});
call('/risk_words_get',{}).then(function(j){rkWShow(j.words||[])}).catch(function(){});
})();
window.$=$;window.esc=esc;window.call=call;window.go=go;window.S=S;
})();