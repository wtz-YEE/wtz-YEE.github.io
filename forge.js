/* ===== 武器锻造 · 独立模块 forge.js ===== */
(function(){
'use strict';
if(typeof $!=='function'){window.$=function(i){return document.getElementById(i)}}
if(typeof toast!=='function'){window.toast=function(a,b){if(a)try{alert(a)}catch(e){}}}

/* ===== 胚子 ===== */
var B=[
{id:'w_dagger',n:'守夜短刃',st:'dagger',c:'#c0c0c0',t:'近战',atk:6,spd:9,rar:'普通',cost:60,tend:'锋利,快速,抢夺'},
{id:'w_sword',n:'学院长剑',st:'sword',c:'#9ab4ff',t:'近战',atk:8,spd:6,rar:'普通',cost:90,tend:'锋利,横扫,火焰附加'},
{id:'w_hammer',n:'泰拉巨锤',st:'hammer',c:'#7a9e9f',t:'重装',atk:12,spd:3,rar:'魔法',cost:140,tend:'击退,冲击,耐久'},
{id:'w_rifle',n:'终端步枪',st:'rifle',c:'#5ad1ff',t:'远程',atk:9,spd:7,rar:'魔法',cost:160,tend:'穿透,弹幕,经验修补'},
{id:'w_staff',n:'星尘法杖',st:'staff',c:'#c8a84a',t:'法术',atk:10,spd:5,rar:'稀有',cost:260,tend:'魔法强度,快速施法,经验修补'},
{id:'w_bow',n:'夜行弓',st:'bow',c:'#8a5ae0',t:'远程',atk:8,spd:6,rar:'稀有',cost:240,tend:'精准,冲击,虚空'},
{id:'w_scythe',n:'花园锄镰',st:'scythe',c:'#55e08a',t:'采集',atk:4,spd:5,rar:'普通',cost:80,tend:'时运,花园共鸣,生长'},
{id:'w_shield',n:'破碎圣盾',st:'shield',c:'#9a7ae0',t:'防御',atk:2,spd:2,rar:'魔法',cost:120,tend:'保护,弹射保护,耐久'},
{id:'w_lance',n:'绯红长枪',st:'lance',c:'#ff5c7a',t:'近战',atk:11,spd:5,rar:'稀有',cost:220,tend:'锋利,亡灵,吸血'},
{id:'w_shard',n:'神秘碎片刃',st:'shard',c:'#ffd60a',t:'传说',atk:14,spd:6,rar:'传说',cost:500,tend:'任意,隐藏专属'}
];
/* ===== 词缀 ===== */
var AF=[
{id:'sharp',n:'锋利',grp:'dmg',mx:5,pre:1,t:'攻击',e:'+伤害'},
{id:'smite',n:'亡灵杀手',grp:'dmg',mx:5,pre:1,t:'攻击',e:'+对亡灵伤害'},
{id:'bane',n:'节肢杀手',grp:'dmg',mx:5,pre:1,t:'攻击',e:'+对节肢伤害'},
{id:'knock',n:'击退',grp:'',mx:2,pre:0,t:'效用',e:'击退敌人'},
{id:'fire',n:'火焰附加',grp:'',mx:2,pre:0,t:'效用',e:'点燃目标'},
{id:'loot',n:'抢夺',grp:'harv',mx:3,pre:0,t:'效用',e:'掉落↑'},
{id:'sweep',n:'横扫之刃',grp:'',mx:3,pre:1,t:'攻击',e:'横扫范围↑'},
{id:'unbr',n:'耐久',grp:'',mx:3,pre:0,t:'效用',e:'耐久↑'},
{id:'mend',n:'经验修补',grp:'inf',mx:1,pre:0,t:'效用',e:'经验修耐久'},
{id:'inf',n:'无限',grp:'inf',mx:1,pre:0,t:'效用',e:'弹药不消耗'},
{id:'ppr',n:'弹射物保护',grp:'prot',mx:4,pre:0,t:'防御',e:'弹射减伤'},
{id:'bpr',n:'爆炸保护',grp:'prot',mx:4,pre:0,t:'防御',e:'爆炸减伤'},
{id:'fpr',n:'火焰保护',grp:'prot',mx:4,pre:0,t:'防御',e:'火焰减伤'},
{id:'prot',n:'保护',grp:'prot',mx:4,pre:0,t:'防御',e:'全减伤'},
{id:'silk',n:'精准采集',grp:'harv',mx:1,pre:0,t:'效用',e:'整块采集'},
{id:'fort',n:'时运',grp:'harv',mx:3,pre:0,t:'效用',e:'掉落翻倍'},
{id:'power',n:'冲击',grp:'',mx:5,pre:1,t:'攻击',e:'弓伤害↑'},
{id:'quick',n:'快速拉弓',grp:'',mx:2,pre:0,t:'效用',e:'蓄力↓'},
{id:'van',n:'消失诅咒',grp:'',mx:1,pre:0,t:'负面',e:'死亡丢装'},
{id:'check',n:'签到共鸣',grp:'',mx:1,pre:0,t:'专属',e:'每日签到 +1 次'},
{id:'garden',n:'花园共鸣',grp:'',mx:1,pre:0,t:'专属',e:'照料/种植收益↑'},
{id:'frag',n:'碎片共鸣',grp:'',mx:1,pre:0,t:'专属',e:'碎片概率双份'},
{id:'walk',n:'夜行者',grp:'',mx:1,pre:0,t:'专属',e:'夜行探索 +1'},
{id:'star',n:'星尘亲和',grp:'',mx:1,pre:0,t:'专属',e:'星雨掉落加成'},
{id:'cmd',n:'指挥官',grp:'',mx:1,pre:0,t:'专属',e:'排行积分 +5%'},
{id:'soul',n:'吸血之魂',grp:'',mx:2,pre:1,t:'攻击',e:'击杀回复'},
{id:'ice',n:'霜',grp:'el',mx:2,pre:1,t:'专属',e:'命中减速'},
{id:'still',n:'凝滞',grp:'el',mx:1,pre:0,t:'专属',e:'暴击率↑'},
{id:'void',n:'虚空',grp:'dark',mx:2,pre:1,t:'专属',e:'对暗影增伤'},
{id:'hunter',n:'猎魔',grp:'dark',mx:2,pre:1,t:'专属',e:'对恶魔增伤'}
];
var COMBO=[
{ids:['fire','cmd'],n:'狂战士之焰',e:'伤害+暴击'},
{ids:['ice','still'],n:'霜语',e:'减速+暴击率'},
{ids:['void','hunter'],n:'虚空狩猎',e:'对暗影增伤'},
{ids:['sharp','sweep'],n:'利刃风暴',e:'攻速+暴击'},
{ids:['loot','fort'],n:'丰收之镰',e:'掉落翻倍'},
{ids:['soul','smite'],n:'亡灵收割',e:'击杀回血翻倍'}
];
function fBlank(id){for(var i=0;i<B.length;i++)if(B[i].id===id)return B[i];return null}
function fAffix(id){for(var i=0;i<AF.length;i++)if(AF[i].id===id)return AF[i];return null}
/* ===== 存储 ===== */
var K_F='wz_forge',K_L='wz_lapis',K_I='wz_iron',K_LV='wz_forge_lv',K_BS='wz_bookshelf',K_SEQ='wz_forge_seq',K_SHOW='wz_show';
function jg(k,d){try{var a=JSON.parse(localStorage.getItem(k)||'null');return a==null?d:a}catch(e){return d}}
function js(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function fLapis(){return jg(K_L,0)}
function fIron(){return jg(K_I,0)}
function fLv(){return jg(K_LV,0)}
function fBS(){return jg(K_BS,0)}
function fShow(){return jg(K_SHOW,null)}
function fLapisAdd(n){js(K_L,fLapis()+n)}
function fIronAdd(n){js(K_I,fIron()+n)}
function fBSAdd(n){js(K_BS,fBS()+n)}
function fSeq(){var s=jg(K_SEQ,1);js(K_SEQ,s+1);return s}
function fVault(){return jg(K_F,[])}
function fVaultSave(a){js(K_F,a)}
function fSaveV(v){fVaultSave(fVault().map(function(x){return x.id===v.id?v:x}))}
function fNew(bid){return {id:'wf'+fSeq(),b:bid,aff:[],dur:1,cost:0,combo:''}}
function fTakeBlank(bid){var a=fVault();a.push(fNew(bid));fVaultSave(a);return a[a.length-1]}
function fLvCost(n){return 1+2*n}
function fUpgradeLv(){
  var lv=fLv();if(lv>=5)return toast('锻造台已满级','');
  var c=fLvCost(lv);if(fBS()<c)return toast('书架不足','升级需要 '+c+' 书架（积分商店/成就获取）');
  fBSAdd(-c);js(K_LV,lv+1);toast('锻造台升级至 LV'+(lv+1),'解锁更强词缀');return true;
}
function fShowSet(id){js(K_SHOW,id);toast('已设为个人门面','');if(typeof forgeRender==='function')forgeRender();return true}
/* ===== 引擎 ===== */
function fConflict(x,y){
  if(!x||!y)return false;var gx=x.grp,gy=y.grp;
  if(gx&&gx===gy)return true;
  if((x.id==='mend'&&y.id==='inf')||(x.id==='inf'&&y.id==='mend'))return true;
  return false;
}
function fEnchant(v,seed){
  var bl=fBlank(v.b);if(!bl)return[];
  var tend=(bl.tend||'').split(',').filter(Boolean);var pool=[];
  for(var i=0;i<AF.length;i++){var af=AF[i];if(tend.indexOf(af.id)>=0||af.t==='专属'||af.id==='sharp'||af.id==='unbr')pool.push(af)}
  var out=[];for(var k=0;k<3;k++){
    var af=pool[Math.floor(Math.random()*pool.length)];var ok=true;
    for(var j=0;j<v.aff.length;j++){if(fConflict(fAffix(v.aff[j]),af)){ok=false;break}}
    if(!ok){k--;if(k<-20)break;continue}
    var lv=fLv()+1;
    out.push({af:af.id,lv:1+(Math.random()<.5?0:Math.min(af.mx-1,Math.floor(Math.random()*lv))),xp:(af.pre?8:5)*(k+1),lap:1+k});
  }
  return out;
}
function fRarity(v){var n=v.aff.length;if(n>=5)return'传说';if(n>=3)return'稀有';if(n>=1)return'魔法';return'普通'}
function fPower(v){var bl=fBlank(v.b);if(!bl)return 0;var p=bl.atk*2+bl.spd;
  for(var i=0;i<v.aff.length;i++){var af=fAffix(v.aff[i]);if(af){p+=af.mx*2+(af.pre?2:1)*(af.mx>2?2:1)}}return p}
function fAffNames(v){return v.aff.map(function(x){var af=fAffix(x);return af?af.n:''}).filter(Boolean)}
function fComboName(v){for(var i=0;i<COMBO.length;i++){var c=COMBO[i];if(c.ids.every(function(x){return v.aff.indexOf(x)>=0}))return c.n}return''}
function fApply(v,opt){
  var af=opt.af,lap=opt.lap;if(fLapis()<lap)return toast('青金石不足','去积分商店换或打小游戏掉');
  fLapisAdd(-lap);if(v.aff.indexOf(af)<0)v.aff.push(af);v.dur=Math.max(v.dur,1);fSaveV(v);return true;
}
function fReroll(v){
  if(!v.aff.length)return toast('没有词缀可重洗','先附魔');
  if(fLapis()<3)return toast('青金石不足','重洗需 3 青金石');
  fLapisAdd(-3);var a=v.aff;var idx=Math.floor(Math.random()*a.length);var old=a[idx];var alt=null;
  for(var i=0;i<AF.length;i++){var af=AF[i];var ok=af.id!==old&&af.t!=='负面';for(var j=0;j<a.length;j++){if(j!==idx&&fConflict(fAffix(a[j]),af)){ok=false;break}}if(ok){alt=af;break}}
  if(alt)a[idx]=alt.id;v.cost+=1;fSaveV(v);return true;
}
function fRepair(v){
  if(v.dur>=10)return toast('耐久已满','');
  if(fIron()<2)return toast('魔铁锭不足','分解武器获得');
  fIronAdd(-2);v.dur=Math.min(10,v.dur+1);v.cost+=1;fSaveV(v);return true;
}
function fMerge(a,b){
  if(a.b!==b.b)return toast('只能合并同胚子武器','');
  if(a.cost>=8||b.cost>=8)return toast('过于昂贵，无法合并','');
  var ok=0;for(var i=0;i<b.aff.length;i++){if(a.aff.indexOf(b.aff[i])<0){a.aff.push(b.aff[i]);ok++}}
  a.cost+=1;a.dur=Math.min(10,a.dur+Math.floor(b.dur/2));fSaveV(a);return ok?'合并成功':'该武器没有新词缀';
}
function fDiscard(id){
  var v=null;var arr=fVault();
  for(var i=0;i<arr.length;i++)if(arr[i].id===id){v=arr[i];arr.splice(i,1);break}
  if(!v)return false;
  if(v.id===fShow())js(K_SHOW,null);
  fIronAdd(2);fVaultSave(arr);toast('已分解，得 2 魔铁锭','');return true;
}
function fMaybeDrop(){
  if(Math.random()>.12)return null;
  var p=B.filter(function(x){return x.rar==='普通'||x.rar==='魔法'});
  var bl=p[Math.floor(Math.random()*p.length)];
  var v=fTakeBlank(bl.id);
  return {b:bl.id,n:bl.n,v:v};
}
/* ===== 面板 ===== */
var FORGE_VIEW='vault',FORGE_SEL=null,FORGE_MERGE=null;
function fResBar(){
  var sh=fShow(),shN='';
  if(sh){var va=fVault();for(var i=0;i<va.length;i++)if(va[i].id===sh){var bl=fBlank(va[i].b);shN=' · <span style="color:#ffd60a">★门面:'+(bl?bl.n:'?')+'</span>';break}}
  return '<span style="color:#4fa8ff">青金石 '+fLapis()+'</span> · <span style="color:#b0bec5">魔铁锭 '+fIron()+'</span> · <span style="color:#ffb703">书架 '+fBS()+'</span> · <span style="color:#ffd60a">锻造台 LV'+fLv()+'</span>'+shN;
}
function fStyle(){
  if(document.getElementById('forgeSty'))return;
  var s=document.createElement('style');s.id='forgeSty';
  s.textContent='#forgeMask{backdrop-filter:blur(6px)}#forgeMask button{transition:transform .14s,box-shadow .14s,opacity .14s}#forgeMask button:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.55);opacity:.9}#forgeMask ::-webkit-scrollbar{width:8px}#forgeMask ::-webkit-scrollbar-thumb{background:#2c2c2c;border-radius:4px}#forgeMask .fc{transition:all .16s}#forgeMask .fc:hover{border-color:var(--accent,#fff)!important;background:rgba(255,255,255,.07)}';
  document.head.appendChild(s);
}
function fRarCol(r){return r==='传说'?'#ffd60a':r==='稀有'?'#ffb703':r==='魔法'?'#4fa8ff':'#cfd8dc'}
function openForge(){
  fStyle();
  var old=document.getElementById('forgeMask');if(old)old.parentNode.removeChild(old);
  var m=document.createElement('div');m.id='forgeMask';
  m.style.cssText='position:fixed;inset:0;z-index:2147482900;background:rgba(7,9,10,.78);display:flex;align-items:center;justify-content:center;padding:24px';
  m.onclick=function(e){if(e.target===m)closeForge()};
  var box=document.createElement('div');
  box.style.cssText='width:min(820px,94vw);max-height:88vh;overflow:auto;background:var(--panel,#141414);border:1px solid var(--line,#333);padding:16px;font-family:Consolas,monospace;color:var(--ink,#f0f0f0)';
  box.innerHTML=
  '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
    '<b style="font-size:15px;letter-spacing:.15em">⚒ 武器锻造 · FORGE</b>'+
    '<button onclick="closeForge()" style="background:none;border:1px solid var(--line,#444);color:var(--ink,#eee);cursor:pointer;padding:2px 10px">✕</button></div>'+
  '<div id="fRes" style="font-size:11px;color:#8a8a8a;margin-bottom:8px;letter-spacing:.05em">'+fResBar()+'</div>'+
  '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">'+
    '<button data-fv="vault" class="f-vb on" onclick="fView(\'vault\')" style="border:1px solid var(--accent,#fff);background:none;color:var(--accent,#fff);font-size:11px;padding:3px 12px;cursor:pointer">仓库</button>'+
    '<button data-fv="rank" class="f-vb" onclick="fView(\'rank\')" style="border:1px solid #666;background:none;color:#999;font-size:11px;padding:3px 12px;cursor:pointer">战力榜</button>'+
    '<button onclick="fUpgradeLv()" style="border:1px solid #ffb703;background:none;color:#ffb703;font-size:11px;padding:3px 12px;cursor:pointer">升级锻造台('+fLvCost(fLv())+'书架)</button>'+
    '<button onclick="fBuyGuide()" style="border:1px solid #55e08a;background:none;color:#55e08a;font-size:11px;padding:3px 12px;cursor:pointer">获取胚子</button></div>'+
  '<div id="fBody"></div>';
  m.appendChild(box);document.body.appendChild(m);forgeRender();
}
function closeForge(){var m=document.getElementById('forgeMask');if(m)m.parentNode.removeChild(m)}
function fView(v){FORGE_VIEW=v;var bs=document.querySelectorAll('.f-vb');for(var i=0;i<bs.length;i++){var b=bs[i];var on=b.getAttribute('data-fv')===v;b.style.border=on?'1px solid var(--accent,#fff)':'1px solid #666';b.style.color=on?'var(--accent,#fff)':'#999'}forgeRender()}
function fBuyGuide(){toast('去 index 积分商店「武器」分类购买胚子','买完自动入仓库')}
function fWCard(v,extra){
  var bl=fBlank(v.b);if(!bl)return'';var r=fRarity(v),p=fPower(v),col=fRarCol(r);
  var show=fShow()===v.id;
  return '<div class="fc" style="border:1px solid '+col+';border-radius:8px;padding:8px;background:rgba(255,255,255,.03);position:relative">'+
    (show?'<div style="position:absolute;top:2px;right:6px;color:#ffd60a;font-size:9px">★门面</div>':'')+
    '<div style="color:'+col+';font-size:12px;font-weight:bold">'+esc(bl.n)+'</div>'+
    '<div style="font-size:10px;color:#8a8a8a;margin:2px 0">'+r+' · 战力 '+p+'</div>'+
    '<div style="font-size:10px;color:#aab3bc;line-height:1.5">'+(fAffNames(v).join(' / ')||'<span style="color:#5b5b5b">未附魔</span>')+'</div>'+
    (fComboName(v)?'<div style="font-size:10px;color:#ffd60a;margin-top:2px">✦ '+fComboName(v)+'</div>':'')+
    (v.cost>0?'<div style="font-size:9px;color:'+(v.cost>=8?'#ff5c7a':'#8a8a8a')+'">'+(v.cost>=8?'⚠ 过于昂贵':'铁砧成本 '+v.cost)+'</div>':'')+
    (extra||'')+
    '<div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap">'+
      '<button onclick="forgePick(\''+v.id+'\')" style="border:1px solid var(--accent,#fff);background:none;color:var(--accent,#fff);font-size:10px;padding:2px 8px;cursor:pointer">锻造</button>'+
      (show?'':'<button onclick="fShowSet(\''+v.id+'\')" style="border:1px solid #ffd60a;background:none;color:#ffd60a;font-size:10px;padding:2px 8px;cursor:pointer">设门面</button>')+
      '<button onclick="fDiscard(\''+v.id+'\')" style="border:1px solid #ff5c7a;background:none;color:#ff5c7a;font-size:10px;padding:2px 8px;cursor:pointer">分解+2铁</button></div></div>';
}
function fVaultHtml(){
  var a=fVault();
  if(!a.length)return '<div style="color:#5b5b5b;font-size:12px;padding:10px 0">仓库空空如也。点上方「获取胚子」去 index 商店买一把吧。</div>';
  return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px">'+a.map(function(v){return fWCard(v)}).join('')+'</div>';
}
function fRankHtml(){
  var a=fVault().slice().sort(function(x,y){return fPower(y)-fPower(x)});
  if(!a.length)return '<div style="color:#5b5b5b;font-size:12px;padding:10px 0">还没有武器，去锻造一把上榜。</div>';
  return a.map(function(v,i){var bl=fBlank(v.b),r=fRarity(v),p=fPower(v),col=fRarCol(r);
    return '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed #333;padding:8px 4px">'+
      '<span style="color:#666;width:26px">'+(i+1)+'</span>'+
      '<span style="color:'+col+';font-weight:bold;flex:1">'+esc(bl.n)+'</span>'+
      '<span style="color:#8a8a8a;font-size:10px;margin-right:10px">'+r+'</span>'+
      '<span style="color:var(--accent,#fff)">'+p+' 战力</span></div>'}).join('');
}
function fMergeChoices(v){
  var others=fVault().filter(function(x){return x.id!==v.id&&x.b===v.b});
  if(!others.length)return '<div style="color:#5b5b5b;font-size:11px">没有同胚子武器可合并。</div>';
  return '<div style="font-size:11px;color:#8a8a8a;margin:6px 0">选择要合并的同胚子武器（取其词缀）：</div>'+
    others.map(function(o){var or=fRarity(o);
      return '<button onclick="forgeMerge(\''+o.id+'\')" style="border:1px solid #55e08a;background:none;color:#55e08a;font-size:11px;padding:3px 10px;margin:3px;cursor:pointer">'+
      esc(fBlank(o.b).n)+' · '+or+' · '+fAffNames(o).join('/')+'</button>'}).join('');
}
function forgePick(id){var a=fVault();for(var i=0;i<a.length;i++)if(a[i].id===id){FORGE_SEL=a[i];break}forgeRender()}
function forgeRender(){
  var bd=document.getElementById('fBody');if(!bd)return;
  var res=document.getElementById('fRes');if(res)res.innerHTML=fResBar();
  var h='';
  if(FORGE_VIEW==='rank'){
    h+='<div style="font-size:11px;letter-spacing:.15em;color:#6e8a86;margin:8px 0 6px">武器战力榜 · RANK</div>';
    h+=fRankHtml();
  }else{
    h+='<div style="font-size:11px;letter-spacing:.15em;color:#6e8a86;margin:8px 0 6px">武器仓库 · VAULT</div>';
    h+=fVaultHtml();
    if(FORGE_SEL){
      var v=FORGE_SEL,bl=fBlank(v.b),opts=fEnchant(v);
      h+='<div style="font-size:11px;letter-spacing:.15em;color:#6e8a86;margin:14px 0 6px">锻造台 · 已选 '+esc(bl.n)+'</div>';
      h+='<div style="font-size:10px;color:#8a8a8a;margin-bottom:6px">词缀：'+(fAffNames(v).join(' / ')||'<span style="color:#5b5b5b">未附魔</span>')+(fComboName(v)?' · ✦'+fComboName(v):'')+'</div>';
      if(v.cost>=8)h+='<div style="color:#ff5c7a;font-size:11px;margin-bottom:6px">⚠ 过于昂贵：这把武器已无法继续铁砧操作</div>';
      h+='<div style="font-size:10px;color:#6e8a86;margin:4px 0">附魔（随机三选一）：</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">'+
        opts.map(function(o,i){var af=fAffix(o.af);
          return '<div style="border:1px dashed #444;border-radius:6px;padding:8px;cursor:pointer" onclick="forgeEn('+i+')">'+
            '<div style="color:var(--accent,#fff);font-size:12px">'+(af?af.n:'')+' '+(o.lv>1?'Lv'+o.lv:'')+'</div>'+
            '<div style="font-size:10px;color:#9aa6ad">'+(af?af.e:'')+'</div>'+
            '<div style="font-size:10px;color:#4fa8ff">'+o.lap+' 青金石 · '+o.xp+' 经验</div></div>'}).join('')+'</div>';
      h+='<div style="font-size:10px;color:#6e8a86;margin:10px 0 4px">铁砧：</div>';
      h+='<div style="display:flex;gap:8px;flex-wrap:wrap">'+
        '<button onclick="forgeReroll()" style="border:1px solid #4fa8ff;background:none;color:#4fa8ff;font-size:11px;padding:4px 12px;cursor:pointer">重掷词缀 · 3 青金石</button>'+
        '<button onclick="forgeRepair()" style="border:1px solid #55e08a;background:none;color:#55e08a;font-size:11px;padding:4px 12px;cursor:pointer">修复 · 2 魔铁锭</button>'+
        '<button onclick="fMergeOpen()" style="border:1px solid #b0bec5;background:none;color:#b0bec5;font-size:11px;padding:4px 12px;cursor:pointer">合并</button>'+
        '<button onclick="forgeClear()" style="border:1px solid #666;background:none;color:#999;font-size:11px;padding:4px 12px;cursor:pointer">取消选择</button></div>';
      if(FORGE_MERGE)h+='<div style="margin-top:8px">'+fMergeChoices(v)+'</div>';
    }else{
      h+='<div style="font-size:10px;color:#5b5b5b;margin-top:10px">从上方仓库选一把武器开始锻造。胚子可在 index 积分商店「武器」分类购买。</div>';
    }
  }
  bd.innerHTML=h;
}
function fMergeOpen(){FORGE_MERGE=!FORGE_MERGE;forgeRender()}
window.openForge=openForge;window.closeForge=closeForge;window.fView=fView;window.fUpgradeLv=fUpgradeLv;
window.fShowSet=fShowSet;window.fMergeOpen=fMergeOpen;window.forgePick=forgePick;window.forgeRender=forgeRender;
window.forgeEn=function(i){var v=FORGE_SEL;if(!v)return;var opts=fEnchant(v);
  if(fApply(v,opts[i])){fVaultSave(fVault());toast('附魔成功','+'+fAffix(opts[i].af).n);forgeRender()}};
window.forgeReroll=function(){if(FORGE_SEL&&fReroll(FORGE_SEL)){toast('已重掷','');forgeRender()}};
window.forgeRepair=function(){if(FORGE_SEL&&fRepair(FORGE_SEL)){toast('已修复','');forgeRender()}};
window.forgeMerge=function(id){if(!FORGE_SEL)return;var o=null;var a=fVault();for(var i=0;i<a.length;i++)if(a[i].id===id){o=a[i];break}
  if(!o)return;var r=fMerge(FORGE_SEL,o);toast(r,'');FORGE_MERGE=false;forgeRender()};
window.forgeClear=function(){FORGE_SEL=null;FORGE_MERGE=null;forgeRender()};
window.fDiscard=fDiscard;
window.fBlankList=function(){return B.slice()};
window.fVault=fVault;window.fPower=fPower;window.fRarity=fRarity;window.fAffNames=fAffNames;window.fShow=fShow;window.fComboName=fComboName;
window.fLapisAdd=fLapisAdd;window.fIronAdd=fIronAdd;window.fBSAdd=fBSAdd;
window.fMaybeDrop=fMaybeDrop;window.fImportPurchased=function(ids){
  var vault=fVault(),got=[];var have={};for(var i=0;i<vault.length;i++)have[vault[i].b]=1;
  for(var j=0;j<ids.length;j++){var b=ids[j];if(B.some(function(x){return x.id===b})&&!have[b]){vault.push(fNew(b));got.push(b)}}
  if(got.length){fVaultSave(vault);return got}return[];
};
})();
