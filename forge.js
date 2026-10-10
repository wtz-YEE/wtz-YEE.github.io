/* ===== 武器锻造 · 独立模块 forge.js ===== */
(function(){
'use strict';
if(typeof $!=='function'){window.$=function(i){return document.getElementById(i)}}
if(typeof toast!=='function'){window.toast=function(a,b){if(a)try{alert(a)}catch(e){}}}
if(typeof esc!=='function'){window.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}}

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
var K_PLOT='wz_forge_plot',K_GUIDE='wz_forge_guide';
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
function fNew(bid){return {id:'wf'+fSeq(),b:bid,aff:[],dur:1,cost:0,combo:'',name:null}}
function fTakeBlank(bid){var a=fVault();a.push(fNew(bid));fVaultSave(a);return a[a.length-1]}
function fForgeBlank(){
  if(fIron()<4)return toast('魔铁锭不足','手工锻造胚子需 4 魔铁锭 · 分解武器可得');
  fIronAdd(-4);
  var b=B[Math.floor(Math.random()*B.length)];
  var v=fTakeBlank(b.id);
  toast('手工锻得胚子：'+b.n,'已入武器仓库 · 去锻造台锻造');
  forgeRender();return true;
}
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
  var pool=fEnchPool(v);
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
function fRankNum(v){return{传说:4,稀有:3,魔法:2,普通:1}[fRarity(v)]||0}
function fPower(v){var bl=fBlank(v.b);if(!bl)return 0;var p=bl.atk*2+bl.spd;
  for(var i=0;i<v.aff.length;i++){var af=fAffix(v.aff[i]);if(af){p+=af.mx*2+(af.pre?2:1)*(af.mx>2?2:1)}}return Math.round(p*(v.q==='S'?1.15:v.q==='A'?1.08:v.q==='B'?1.04:1))}
function fAffNames(v){return v.aff.map(function(x){var af=fAffix(x);return af?af.n:''}).filter(Boolean)}
function fComboName(v){for(var i=0;i<COMBO.length;i++){var c=COMBO[i];if(c.ids.every(function(x){return v.aff.indexOf(x)>=0}))return c.n}return''}
function fApply(v,opt){
  var af=opt.af,lap=opt.lap;if(fLapis()<lap)return toast('青金石不足','去积分商店换或打小游戏掉');
  fLapisAdd(-lap);if(v.aff.indexOf(af)<0)v.aff.push(af);v.dur=Math.max(v.dur,1);fSaveV(v);fExpAdd(af.pre?8:5);fLexAdd([af]);return true;
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
  fIronAdd(2);fVaultSave(arr);toast('已分解，得 2 魔铁锭','');fBurst(500,300,'#b0bec5',12);return true;
}
function fMaybeDrop(){
  if(Math.random()>.12)return null;
  var p=B.filter(function(x){return x.rar==='普通'||x.rar==='魔法'});
  var bl=p[Math.floor(Math.random()*p.length)];
  var v=fTakeBlank(bl.id);
  return {b:bl.id,n:bl.n,v:v};
}
/* ===== 材料园 ===== */
var PFLOW=[
 {k:'lapis',n:'青金石花',c:'#4fa8ff',gift:4,m:30,w:1440,d:'开花 +4 青金石 · 30分熟 · 1天凋零'},
 {k:'iron',n:'魔铁花',c:'#b0bec5',gift:2,m:30,w:1440,d:'开花 +2 魔铁锭 · 30分熟 · 1天凋零'},
 {k:'book',n:'书架藤',c:'#ffb703',gift:1,m:45,w:1440,d:'开花 +1 书架 · 45分熟 · 1天凋零'}
];
function fPlots(){return jg(K_PLOT,[null,null,null,null])}
function fPlotSave(a){js(K_PLOT,a)}
function fPlotP(){return PFLOW}
function fPlantPlot(i,k){
  var a=fPlots();if(a[i])return toast('该格已有植物','先收获或等待凋零');
  var p=null;for(var j=0;j<PFLOW.length;j++)if(PFLOW[j].k===k){p=PFLOW[j];break}
  if(!p)return;
  var t=Date.now();a[i]={k:k,t:t,b:t+p.m*60000,w:t+(p.m+p.w)*60000};
  fPlotSave(a);toast('种下 '+p.n,'约 '+p.m+' 分钟后开花 · 1 天后凋零');forgeRender();
}
function fHarvestPlot(i){
  var a=fPlots(),pl=a[i];if(!pl)return;
  var p=null;for(var j=0;j<PFLOW.length;j++)if(PFLOW[j].k===pl.k){p=PFLOW[j];break}
  var now=Date.now();
  if(now<pl.b)return toast('尚未开花','再等等');
  if(now>=pl.w)return toast('已凋零','重新种一株吧');
  if(p.k==='lapis')fLapisAdd(p.gift);else if(p.k==='iron')fIronAdd(p.gift);else fBSAdd(p.gift);
  a[i]=null;fPlotSave(a);
  var nm=p.gift+(p.k==='lapis'?' 青金石':p.k==='iron'?' 魔铁锭':' 书架');
  toast('收获 '+nm,'已存入锻造仓库');fBurst(500,300,p.c,16);forgeRender();return true;
}
function fPlotHtml(){
  var a=fPlots(),now=Date.now(),h='';
  h+='<div style="font-size:11px;letter-spacing:.15em;color:#6e8a86;margin:8px 0 6px">锻造材料园 · PLOT <span style="color:#5b5b5b">种花 → 开花收获 → 1天后凋零重种</span></div>';
  h+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px">';
  for(var i=0;i<a.length;i++){
    var pl=a[i];
    if(!pl){
      h+='<div style="border:1px dashed #3a3f46;border-radius:8px;padding:10px;background:rgba(255,255,255,.02)">'+
        '<div style="color:#5b5b5b;font-size:11px;margin-bottom:6px">空地 '+(i+1)+' · 种什么？</div>'+
        PFLOW.map(function(p){return '<button onclick="fPlantPlot('+i+',\''+p.k+'\')" style="border:1px solid '+p.c+';background:none;color:'+p.c+';font-size:10px;padding:2px 8px;margin:2px;cursor:pointer">'+p.n+'</button>'}).join('')+
        '<div style="font-size:9px;color:#5b5b5b;margin-top:4px">'+PFLOW.map(function(p){return p.n+'('+p.gift+')'}).join(' · ')+'</div></div>';
    }else{
      var p=null;for(var j=0;j<PFLOW.length;j++)if(PFLOW[j].k===pl.k){p=PFLOW[j];break}
      var remainB=pl.b-now,remainW=pl.w-now;
      var state=now<pl.b?'grow':(now<pl.w?'bloom':'wither');
      var prog=Math.max(0,Math.min(100,(now-pl.t)/(pl.b-pl.t)*100));
      h+='<div style="border:1px solid '+(state==='bloom'?p.c:state==='wither'?'#ff5c7a':'#3a3f46')+';border-radius:8px;padding:10px;background:rgba(255,255,255,.03)">'+
        '<div style="color:'+p.c+';font-size:12px;font-weight:bold">'+p.n+'</div>'+
        '<div style="font-size:9px;color:#8a8a8a;margin:3px 0">'+p.d+'</div>';
      if(state==='grow'){
        h+='<div style="height:4px;background:#2a2a2a;border-radius:2px;overflow:hidden"><div style="height:100%;width:'+prog+'%;background:'+p.c+';transition:width .3s"></div></div>'+
        '<div style="font-size:10px;color:#9aa6ad;margin-top:4px">生长中 · 约 '+Math.ceil(remainB/60000)+' 分后开花</div>';
      }else if(state==='bloom'){
        h+='<div style="color:#55e08a;font-size:10px;margin:4px 0">✦ 已开花 · 可收获 +'+p.gift+'</div>'+
        '<button onclick="fHarvestPlot('+i+')" style="border:1px solid '+p.c+';background:none;color:'+p.c+';font-size:11px;padding:3px 10px;cursor:pointer">收获</button>'+
        '<div style="font-size:9px;color:#5b5b5b;margin-top:3px">约 '+Math.ceil(remainW/60000)+' 分后凋零</div>';
      }else{
        h+='<div style="color:#ff5c7a;font-size:10px;margin:4px 0">已凋零 · 点击重种</div>'+
        '<button onclick="fPlantPlot('+i+',\''+pl.k+'\')" style="border:1px solid #ff5c7a;background:none;color:#ff5c7a;font-size:11px;padding:3px 10px;cursor:pointer">重新种下</button>';
      }
      h+='</div>';
    }
  }
  h+='</div>';
  return h;
}
/* ===== B 进阶：熟练度 / 图鉴 / 改名 / 转换 / 定向 / 升阶 / 科技树 ===== */
var K_EXP='wz_forge_exp',K_LEX='wz_forge_lex';
var EXPT=[80,220,480,900,1500];
function fExp(){return jg(K_EXP,0)}
function fElv(){var e=fExp(),lv=1;for(var i=0;i<EXPT.length;i++){if(e>=EXPT[i])lv=i+2}return lv}
function fElvNext(){var lv=fElv();return lv>EXPT.length?null:EXPT[lv-1]}
function fExpAdd(n){var e=fExp()+n,old=fElv();js(K_EXP,e);var nw=fElv();if(nw>old)toast('熟练度提升至 LV'+nw,'解锁更强词缀池');forgeRender()}
function fLex(){return jg(K_LEX,[])}
function fLexAdd(ids){var a=fLex(),ch=0;for(var i=0;i<ids.length;i++){var af=fAffix(ids[i]);if(af&&a.indexOf(ids[i])<0){a.push(ids[i]);ch=1}}if(ch){js(K_LEX,a);if(a.length===AF.length)toast('词缀图鉴集齐！','锻造大师之证点亮')}return a}
function fWName(v){return v&&v.name?v.name:(fBlank(v.b)?fBlank(v.b).n:'?')}
function fRename(id){
  var v=null,arr=fVault();for(var i=0;i<arr.length;i++)if(arr[i].id===id){v=arr[i];break}
  if(!v)return;
  if(fLapis()<5)return toast('青金石不足','改名需 5 青金石');
  var nm=prompt('输入新武器名（≤12字）：',v.name||fBlank(v.b).n);
  if(nm==null)return;nm=String(nm).trim().slice(0,12);if(!nm)return;
  fLapisAdd(-5);v.name=nm;fSaveV(v);toast('已命名为 '+nm,'消耗 5 青金石');forgeRender();
}
function fConvert(){
  var old=document.getElementById('fCvtMask');if(old)old.parentNode.removeChild(old);
  var ov=document.createElement('div');ov.id='fCvtMask';
  ov.style.cssText='position:fixed;inset:0;z-index:2147483930;background:rgba(5,7,9,.8);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px)';
  ov.onclick=function(e){if(e.target===ov)ov.parentNode.removeChild(ov)};
  var bx=document.createElement('div');bx.style.cssText='background:var(--panel,#141414);border:1px solid var(--line,#333);border-radius:10px;padding:20px;min-width:340px;font-family:Consolas,monospace;color:var(--ink,#f0f0f0)';
  bx.innerHTML='<div style="font-size:14px;letter-spacing:.15em;margin-bottom:8px">材料转换</div>'+
    '<div style="font-size:10px;color:#8a8a8a;margin-bottom:8px">青金石 '+fLapis()+' · 魔铁锭 '+fIron()+' · 书架 '+fBS()+'</div>'+
    '<div id="fCvtBody"></div>'+
    '<button onclick="this.parentNode.parentNode.remove()" style="border:1px solid #666;background:none;color:#999;font-size:11px;padding:4px 12px;cursor:pointer;margin-top:12px">关闭</button>';
  ov.appendChild(bx);document.body.appendChild(ov);
  var C=[{k:'lapis2iron',a:'3 青金石',an:'魔铁锭',c:3,have:function(){return fLapis()}},
   {k:'iron2book',a:'2 魔铁锭',an:'书架',c:2,have:function(){return fIron()}},
   {k:'lapis2book',a:'6 青金石',an:'书架',c:6,have:function(){return fLapis()}}];
  bx.querySelector('#fCvtBody').innerHTML=C.map(function(r){
    var h=r.have(),dis=h<r.c;
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px dashed #333">'+
      '<span style="color:#c8ccd0">'+r.a+' → '+r.an+'</span>'+
      '<button onclick="fConvDo(\''+r.k+'\')"'+(dis?' disabled':'')+' style="border:1px solid '+(dis?'#3a3f46':'#8a8a8a')+';background:none;color:'+(dis?'#555':'#ccc')+';font-size:11px;padding:2px 10px;cursor:pointer">'+(dis?'缺资源':'转换')+'</button></div>'}).join('');
}
function fConvDo(k){
  var C={lapis2iron:function(){if(fLapis()<3)return toast('青金石不足','需 3');fLapisAdd(-3);fIronAdd(1);toast('3 青金石 → 1 魔铁锭','')},
   iron2book:function(){if(fIron()<2)return toast('魔铁锭不足','需 2');fIronAdd(-2);fBSAdd(1);toast('2 魔铁锭 → 1 书架','')},
   lapis2book:function(){if(fLapis()<6)return toast('青金石不足','需 6');fLapisAdd(-6);fBSAdd(1);toast('6 青金石 → 1 书架','')}};
  var fn=C[k];if(!fn)return;fn();forgeRender();
  var cv=document.getElementById('fCvtMask');if(cv)cv.parentNode.removeChild(cv);
}
function fEnchPool(v){
  var bl=fBlank(v.b);if(!bl)return[];
  var tend=(bl.tend||'').split(',').filter(Boolean);var elv=fElv();
  var pool=[];
  for(var i=0;i<AF.length;i++){var af=AF[i];
    if(tend.indexOf(af.id)>=0){pool.push(af);continue}
    if(af.id==='sharp'||af.id==='unbr'){pool.push(af);continue}
    if(af.t==='攻击'||af.t==='防御'||af.t==='效用'){pool.push(af);continue}
    if(af.t==='专属'&&(elv>=2||v.q==='S')){pool.push(af);continue}
    if(af.t==='负面'){pool.push(af)}
  }
  return pool;
}
function fEnchantTarget(){
  var v=FORGE_SEL;if(!v)return;
  var old=document.getElementById('fTgtMask');if(old)old.parentNode.removeChild(old);
  var ov=document.createElement('div');ov.id='fTgtMask';
  ov.style.cssText='position:fixed;inset:0;z-index:2147483940;background:rgba(5,7,9,.8);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px)';
  ov.onclick=function(e){if(e.target===ov)ov.parentNode.removeChild(ov)};
  var bx=document.createElement('div');bx.style.cssText='background:var(--panel,#141414);border:1px solid var(--line,#333);border-radius:10px;padding:20px;width:min(580px,92vw);max-height:82vh;overflow:auto;font-family:Consolas,monospace;color:var(--ink,#f0f0f0)';
  bx.innerHTML='<div style="font-size:14px;letter-spacing:.15em;margin-bottom:6px">定向附魔 · 指定词缀</div>'+
    '<div style="font-size:10px;color:#ffd60a;margin-bottom:10px">消耗 2× 青金石，从池中指定目标</div>'+
    '<div style="font-size:10px;color:#6e8a86;margin-bottom:8px">已选 '+fWName(v)+' · 现有词缀：'+(fAffNames(v).join(' / ')||'无')+'</div>'+
    '<div id="fTgtBody" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px"></div>'+
    '<button onclick="this.parentNode.parentNode.remove()" style="border:1px solid #666;background:none;color:#999;font-size:11px;padding:4px 12px;cursor:pointer;margin-top:10px">关闭</button>';
  ov.appendChild(bx);document.body.appendChild(ov);
  var pool=fEnchPool(v),have=v.aff;
  bx.querySelector('#fTgtBody').innerHTML=pool.map(function(af){
    var conflict=false;for(var i=0;i<have.length;i++){if(fConflict(fAffix(have[i]),af)){conflict=true;break}}
    var lap=2*(1+(fElv()>3?1:0));
    return '<div style="border:1px dashed '+(conflict?'#2c2c2c':'#444')+';border-radius:8px;padding:8px">'+
      '<div style="color:'+(conflict?'#3f3f3f':af.t==='负面'?'#ff5c7a':'#c8ccd0')+';font-size:12px">'+af.n+'</div>'+
      '<div style="font-size:10px;color:#9aa6ad">'+af.e+'</div>'+
      '<div style="font-size:10px;color:#4fa8ff;margin:4px 0">'+lap+' 青金石</div>'+
      (conflict?'<span style="font-size:9px;color:#5b5b5b">冲突</span>':'<button onclick="fEnchantDo(\''+af.id+'\')" style="border:1px solid #4fa8ff;background:none;color:#4fa8ff;font-size:11px;padding:2px 10px;cursor:pointer">附魔</button>')+'</div>'}).join('');
}
function fEnchantDo(afid){
  var v=FORGE_SEL;if(!v)return;
  var lap=2*(1+(fElv()>3?1:0));var af=fAffix(afid);if(!af)return;
  if(fLapis()<lap)return toast('青金石不足','定向附魔需 '+lap);
  fLapisAdd(-lap);if(v.aff.indexOf(afid)<0)v.aff.push(afid);v.dur=Math.max(v.dur,1);fSaveV(v);
  fExpAdd(af.pre?8:5);fLexAdd([afid]);
  toast('定向附魔成功：'+af.n,'消耗 '+lap+' 青金石');fBurst(500,300,'#4fa8ff',14);forgeRender();
  var m=document.getElementById('fTgtMask');if(m)m.parentNode.removeChild(m);
}
function fAscend(){
  var v=FORGE_SEL;if(!v)return;
  var arr=fVault(),same=arr.filter(function(x){return x.b===v.b});
  if(same.length<3)return toast('需 3 把同胚子武器才能升阶','当前 '+same.length+' 把');
  var bl=fBlank(v.b);var order=[['普通','魔法'],['魔法','稀有'],['稀有','传说'],['传说','传说']];
  var nxt='魔法';for(var i=0;i<order.length;i++)if(order[i][0]===bl.rar){nxt=order[i][1];break}
  var cand=B.filter(function(x){return x.rar===nxt});
  if(!cand.length)cand=B.slice();
  var all=[];for(var i=0;i<same.length;i++){for(var j=0;j<same[i].aff.length;j++)if(all.indexOf(same[i].aff[j])<0)all.push(same[i].aff[j])}
  var nb=cand[Math.floor(Math.random()*cand.length)];
  var nv=fNew(nb.id);nv.aff=all.slice(0,3);nv.dur=Math.min(6,Math.max(3,Math.ceil(same[0].dur*0.7)));
  var bq=['C','B','A','S'],mxq='C';for(var i=0;i<same.length;i++){if(bq.indexOf(same[i].q||'C')>bq.indexOf(mxq))mxq=same[i].q||'C'}nv.q=mxq;
  var ids=same.slice(0,3).map(function(x){return x.id});
  var na=arr.filter(function(x){return ids.indexOf(x.id)<0});
  na.push(nv);fVaultSave(na);
  fExpAdd(20);fLexAdd(nv.aff);
  toast('升阶成功：'+bl.rar+' → '+nb.rar,'生成 '+nb.n+' · 词缀保留');
  if(FORGE_SEL&&ids.indexOf(FORGE_SEL.id)>=0)FORGE_SEL=nv;
  fBurst(500,300,'#ffd60a',18);forgeRender();return true;
}
function fTechHtml(){
  var lv=fLv();
  var T=[
   {lv:1,n:'锻造启蒙',d:'解锁附魔三选一'},
   {lv:2,n:'词缀重掷',d:'解锁词缀重掷 · 熟练度解锁专属词缀'},
   {lv:3,n:'定向附魔',d:'解锁定向附魔（指定词缀）'},
   {lv:4,n:'材料转化',d:'解锁材料转换（青金石↔铁↔书架）'},
   {lv:5,n:'胚子升阶',d:'解锁 3 合 1 胚子升阶'}];
  var h='<div style="font-size:11px;letter-spacing:.15em;color:#6e8a86;margin:8px 0 6px">锻造台科技树 · TECH</div>';
  h+='<div style="font-size:10px;color:#8a8a8a;margin-bottom:10px">锻造台 LV'+lv+' · 熟练度 LV'+fElv()+'（经验 '+fExp()+(fElvNext()!=null?'/'+fElvNext():'/MAX')+'）</div>';
  for(var i=0;i<T.length;i++){var on=lv>=T[i].lv;
    h+='<div style="display:flex;align-items:center;gap:10px;border:1px solid '+(on?'#ffd60a':'#3a3f46')+';border-radius:8px;padding:10px;margin-bottom:8px;background:rgba(255,255,255,'+(on?'.04':'.01')+')">'+
      '<div style="width:34px;height:34px;border-radius:50%;border:2px solid '+(on?'#ffd60a':'#555')+';display:flex;align-items:center;justify-content:center;color:'+(on?'#ffd60a':'#666')+';font-size:12px">'+T[i].lv+'</div>'+
      '<div style="flex:1"><div style="color:'+(on?'#c8ccd0':'#666')+';font-size:12px;font-weight:bold">'+T[i].n+'</div><div style="font-size:10px;color:#9aa6ad">'+T[i].d+'</div></div>'+
      (on?'<span style="color:#55e08a;font-size:10px">已解锁</span>':'<span style="color:#ff5c7a;font-size:10px">需锻造台 LV'+T[i].lv+'</span>')+'</div>';
  }
  return h;
}
function fLexHtml(){
  var a=fLex();
  var h='<div style="font-size:11px;letter-spacing:.15em;color:#6e8a86;margin:8px 0 6px">词缀图鉴 · LEXICON <span style="color:#5b5b5b">已收集 '+a.length+'/'+AF.length+'</span></div>';
  h+='<div style="font-size:10px;color:#8a8a8a;margin-bottom:8px">用过即入图鉴。集齐点亮「锻造大师之证」。</div>';
  h+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px">';
  for(var i=0;i<AF.length;i++){var af=AF[i],on=a.indexOf(af.id)>=0;
    h+='<div style="border:1px solid '+(on?'#3a3f46':'#222')+';border-radius:8px;padding:8px;background:rgba(255,255,255,'+(on?'.03':'.01')+')">'+
      '<div style="color:'+(on?'#c8ccd0':'#555')+';font-size:12px;font-weight:bold">'+af.n+' <span style="font-size:9px;color:#6e8a86">'+af.t+'</span></div>'+
      '<div style="font-size:10px;color:#9aa6ad;margin:2px 0">'+af.e+'</div>'+
      '<div style="font-size:9px;color:'+(on?'#55e08a':'#5b5b5b')+'">'+(on?'✓ 已收集':'未收集')+' · Lv上限 '+af.mx+'</div></div>';
  }
  h+='</div>';
  return h;
}
function fSyncOut(){
  if(!(window.S&&window.S.user))return toast('请先登录','锻造云同步需登录账号');
  var data={v:fVault(),i:fIron(),l:fLapis(),b:fBS(),lv:fLv(),exp:fExp(),lex:fLex(),show:fShow()};
  var call=window.call||function(){};
  call('/forge_save',{data:data}).then(function(j){
    if(j&&j.ok)toast('已上传锻造数据到云端','换设备可加载');else toast('上传失败',(j&&j.msg)||'')
  }).catch(function(){toast('上传失败','网络或云端不可用')});
}
function fSyncIn(){
  if(!(window.S&&window.S.user))return toast('请先登录','');
  var call=window.call||function(){};
  call('/forge_load',{}).then(function(j){
    if(!j||!j.ok)return toast('云端无锻造存档','先用「同步上传」保存');
    var d=j.data||{};
    js(K_F,d.v||[]);js(K_I,d.i||0);js(K_L,d.l||0);js(K_BS,d.b||0);js(K_LV,d.lv||0);js(K_EXP,d.exp||0);js(K_LEX,d.lex||[]);js(K_SHOW,d.show||null);
    toast('已加载云端锻造存档','');
    forgeRender();
  }).catch(function(){toast('加载失败','网络或云端不可用')});
}
/* ===== 视觉：图标 / 粒子 / 筛选 / 引导 ===== */
function fIcon(st,col){
  var p={
   dagger:'M20 2 L30 9 L27 13 L13 22 L9 18 L17 9 Z M20 2 L23 5 M13 22 L10 24 M9 18 L6 20',
   sword:'M20 2 L30 7 L29 11 L19 6 Z M29 7 L31 12 L24 18 L20 14 L26 8 M18 14 L10 22 L8 20 L15 12 M14 22 L11 24',
   hammer:'M14 3 L28 3 L28 8 L14 8 Z M18 8 L18 22 M14 22 L22 22 M20 3 L26 7 M16 5 L22 7',
   rifle:'M12 2 L30 2 L30 6 L26 6 L26 14 L16 14 L16 6 L12 6 Z M16 14 L16 22 M12 6 L12 10 M30 6 L30 10',
   staff:'M20 2 L20 22 M16 6 L24 6 M14 12 L26 12 M20 18 L26 22 M20 18 L14 22 M20 8 L24 12',
   bow:'M10 3 C20 8 20 16 10 21 M30 5 L16 12 M30 19 L16 12',
   scythe:'M28 2 L8 20 L8 24 L12 20 M12 20 L6 24 M28 2 L24 6 M24 6 L28 10 M28 2 L30 4',
   shield:'M20 2 L30 6 L30 12 C30 18 25 21 20 22 C15 21 10 18 10 12 L10 6 Z M20 3 L20 21',
   lance:'M20 2 L20 22 M16 4 L24 4 M12 8 L28 8 M18 4 L18 22 M22 4 L22 22 M20 22 L14 24 M20 22 L26 24',
   shard:'M24 2 L28 8 L24 8 L30 12 L22 12 L28 18 L18 18 L24 24 L16 24 L20 16 L12 16 L16 10 L8 10 L14 4 Z'
  }[st]||'M20 2 L28 8 L24 12 L12 20 L8 16 L16 8 Z';
  return '<svg viewBox="0 0 40 24" width="38" height="23" style="display:block;flex:0 0 auto">'+
    '<path d="'+p+'" fill="none" stroke="'+col+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
}
function fBurst(x,y,col,n){
  var d=document.createElement('div');d.style.cssText='position:fixed;left:0;top:0;width:0;height:0;z-index:2147483900;pointer-events:none';
  document.body.appendChild(d);
  for(var i=0;i<n;i++){(function(){
    var s=document.createElement('span');s.style.cssText='position:absolute;left:'+x+'px;top:'+y+'px;width:'+(3+Math.random()*4)+'px;height:'+(3+Math.random()*4)+'px;background:'+col+';border-radius:50%;opacity:1;transition:transform .6s ease-out,opacity .6s ease-out';
    d.appendChild(s);
    var a=Math.random()*Math.PI*2,v=40+Math.random()*70;
    requestAnimationFrame(function(){s.style.transform='translate('+(Math.cos(a)*v)+'px,'+(Math.sin(a)*v)+'px)';s.style.opacity='0'});
  })()}
  setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d)},700);
}
var FORGE_FILT={t:'',r:'',q:'',s:'power'},FORGE_DRAG=null;
function fFiltT(v){FORGE_FILT.t=v;forgeRender()}
function fFiltR(v){FORGE_FILT.r=v;forgeRender()}
function fFiltQ(v){FORGE_FILT.q=v;forgeRender()}
function fFiltS(v){FORGE_FILT.s=v;forgeRender()}
function fFiltHtml(){
  function sel(arr,k,fn){return '<select onchange="'+fn+'(this.value)" style="background:#141414;color:#c8ccd0;border:1px solid #3a3f46;font-family:Consolas,monospace;font-size:11px;padding:3px 6px;border-radius:4px">'+arr.map(function(x){return '<option value="'+x[0]+'"'+(k===x[0]?' selected':'')+'>'+x[1]+'</option>'}).join('')+'</select>'}
  var t=[['','全部类型'],['近战','近战'],['远程','远程'],['重装','重装'],['法术','法术'],['采集','采集'],['防御','防御'],['传说','传说']];
  var r=[['','全部稀有'],['普通','普通'],['魔法','魔法'],['稀有','稀有'],['传说','传说']];
  var s=[['power','战力'],['name','名称'],['rar','稀有度'],['cost','铁砧']];
  return '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:8px">'+
    sel(t,FORGE_FILT.t,'fFiltT')+sel(r,FORGE_FILT.r,'fFiltR')+
    '<input placeholder="搜词缀/名称…" value="'+esc(FORGE_FILT.q)+'" oninput="fFiltQ(this.value)" style="background:#141414;color:#c8ccd0;border:1px solid #3a3f46;font-family:Consolas,monospace;font-size:11px;padding:3px 6px;border-radius:4px;width:120px">'+
    sel(s,FORGE_FILT.s,'fFiltS')+
    (FORGE_FILT.t||FORGE_FILT.r||FORGE_FILT.q?'<button onclick="fFiltClear()" style="border:1px solid #666;background:none;color:#999;font-size:10px;padding:2px 8px;cursor:pointer">清除</button>':'')+'</div>';
}
function fFiltClear(){FORGE_FILT={t:'',r:'',q:'',s:'power'};forgeRender()}
function fApplyFilt(arr){
  var out=arr.filter(function(v){var bl=fBlank(v.b);if(!bl)return false;
    if(FORGE_FILT.t&&bl.t!==FORGE_FILT.t)return false;
    var rr=fRarity(v);if(FORGE_FILT.r&&rr!==FORGE_FILT.r)return false;
    if(FORGE_FILT.q){var q=FORGE_FILT.q;if(fAffNames(v).join(' ').indexOf(q)<0&&bl.n.indexOf(q)<0)return false}
    return true});
  var m={power:function(x,y){return fPower(y)-fPower(x)},name:function(x,y){return fBlank(x.b).n<fBlank(y.b).n?-1:1},rar:function(x,y){return fRankNum(y)-fRankNum(x)},cost:function(x,y){return y.cost-x.cost}};
  out.sort(m[FORGE_FILT.s]||m.power);
  return out;
}
function fGuide(){
  if(jg(K_GUIDE,0))return;
  var steps=[
   '从仓库选一把武器开始锻造——点「锻造」或直接拖拽到下方锻造台。',
   '在三个词缀里选一个附魔，消耗青金石。词缀可重掷、修复耐久、合并同胚子。',
   '胚子不够？点上方「铁制胚子」用 4 魔铁锭手打，或去 index 积分商店买。',
   '材料缺？去「材料园」种花：开花收获资源，1 天后凋零可重种。']
  ;
  var i=0;var ov=document.createElement('div');ov.id='fGuideOv';
  ov.style.cssText='position:fixed;inset:0;z-index:2147483950;background:rgba(5,7,9,.84);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px)';
  var bx=document.createElement('div');bx.style.cssText='background:var(--panel,#141414);border:1px solid var(--line,#333);border-radius:10px;padding:22px;max-width:380px;font-family:Consolas,monospace;color:var(--ink,#f0f0f0);text-align:center';
  bx.innerHTML='<div style="font-size:14px;letter-spacing:.15em;margin-bottom:10px">⚒ 锻造台 · 快速上手</div><div id="fgT" style="font-size:12px;color:#c8ccd0;line-height:1.7;min-height:66px"></div><div style="margin-top:12px;display:flex;gap:8px;justify-content:center"><button id="fgN" style="border:1px solid var(--accent,#fff);background:none;color:var(--accent,#fff);font-size:11px;padding:4px 14px;cursor:pointer">下一步</button><button id="fgX" style="border:1px solid #666;background:none;color:#999;font-size:11px;padding:4px 14px;cursor:pointer">跳过</button></div>';
  ov.appendChild(bx);document.body.appendChild(ov);
  var T=bx.querySelector('#fgT');
  function show(){T.textContent=(i+1)+'/'+steps.length+'  '+steps[i]}
  show();
  bx.querySelector('#fgN').onclick=function(){i++;if(i>=steps.length){dismiss()}else show()};
  bx.querySelector('#fgX').onclick=dismiss;
  function dismiss(){js(K_GUIDE,1);if(ov.parentNode)ov.parentNode.removeChild(ov)}
}
/* ===== 面板 ===== */
var FORGE_VIEW='vault',FORGE_SEL=null,FORGE_MERGE=null;
function fStyle(){
  if(document.getElementById('forgeSty'))return;
  var s=document.createElement('style');s.id='forgeSty';
  s.textContent='@keyframes fGlow{0%,100%{box-shadow:0 0 12px rgba(255,214,10,.3)}50%{box-shadow:0 0 22px rgba(255,214,10,.55)}}'+
   '#forgeMask{backdrop-filter:blur(8px);background:radial-gradient(1100px 620px at 50% -8%,rgba(130,86,42,.20),transparent 60%),radial-gradient(850px 480px at 88% 112%,rgba(46,70,104,.20),transparent 60%),rgba(7,9,10,.84)!important}'+
   '#forgeMask button{transition:transform .14s,box-shadow .14s,opacity .14s}'+
   '#forgeMask button:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.55);opacity:.9}'+
   '#forgeMask button:disabled{opacity:.4;cursor:default}'+
   '#forgeMask ::-webkit-scrollbar{width:8px}#forgeMask ::-webkit-scrollbar-thumb{background:#2c2c2c;border-radius:4px}'+
   '#forgeMask .fc{transition:all .16s}#forgeMask .fc:hover{transform:translateY(-2px);border-color:var(--accent,#fff)!important}'+
   '#forgeMask .fc.drag-on{outline:2px dashed var(--accent,#fff)}'+
   '#forgeMask select:focus,#forgeMask input:focus{outline:1px solid var(--accent,#fff)}';
  document.head.appendChild(s);
}
function fRarCol(r){return r==='传说'?'#ffd60a':r==='稀有'?'#ffb703':r==='魔法'?'#4fa8ff':'#cfd8dc'}
function fQCol(q){return q==='S'?'#ff5c7a':q==='A'?'#ffb703':q==='B'?'#4fa8ff':'#8a8a8a'}
function fQName(q){return q?('['+q+']'):''}
/* ===== 锻打系统 ===== */
var FH=null;
var HMOP=[
{id:'ph',n:'重锤',d:6,c:'#ffd60a'},{id:'pl',n:'轻锤',d:3,c:'#ffb703'},
{id:'pr',n:'推右',d:2,c:'#4fa8ff'},{id:'ph2',n:'猛推',d:9,c:'#ff5c7a'},
{id:'nh',n:'逆重锤',d:-6,c:'#ffd60a'},{id:'nl',n:'逆轻锤',d:-3,c:'#ffb703'},
{id:'nr',n:'推左',d:-2,c:'#4fa8ff'},{id:'nl2',n:'猛拉',d:-9,c:'#ff5c7a'},
{id:'cool',n:'降温',d:0,c:'#55e08a'},{id:'heat',n:'升温',d:0,c:'#ff5c7a'},{id:'hold',n:'夹持',d:0,c:'#4fa8ff'}];
var CSS_STR='@keyframes fHmPop{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}'+
'@keyframes fHmShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}'+
'@keyframes fHmFlash{0%,100%{box-shadow:0 0 0 rgba(255,214,10,0)}50%{box-shadow:0 0 24px rgba(255,214,10,.8)}}'+
'@keyframes fHmPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.13)}}'+
'@keyframes fHmGlow{0%,100%{box-shadow:0 0 6px rgba(255,214,10,.25)}50%{box-shadow:0 0 20px rgba(255,214,10,.65)}}'+
'@keyframes fHmCrack{0%{transform:scale(1)}15%{transform:scale(1.03) rotate(-1deg)}30%{transform:scale(.99) rotate(1deg)}50%{transform:scale(1.045)}70%{transform:scale(.98)}100%{transform:scale(1)}}'+
'@keyframes fHmSpark{0%{transform:translateY(0) scale(1);opacity:.9}100%{transform:translateY(-110px) scale(.15);opacity:0}}'+
'.fhm-b{transition:transform .08s,box-shadow .2s;cursor:pointer}.fhm-b:hover{transform:scale(1.06);box-shadow:0 0 14px rgba(255,200,100,.15)}.fhm-b:active{transform:scale(.93)}'+
'.fhm-ptr{transition:left .12s ease-out}'+
'.fhm-step{transition:all .18s}'+
'.fhm-shake{animation:fHmShake .42s}'+
'.fhm-crack{animation:fHmCrack .5s}'+
'.fhm-flash{animation:fHmFlash 2.4s infinite}'+
'.fhm-spark{position:absolute;width:3px;height:3px;border-radius:50%;background:#ffb703;animation:fHmSpark 1.4s linear infinite;pointer-events:none}';
function hmOp(id){for(var i=0;i<HMOP.length;i++)if(HMOP[i].id===id)return HMOP[i];return null}
function hmHs(s){var h=0,i;for(i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
function hmOps(v){var bl=fBlank(v.b),L=3+(bl.atk>=10?1:0)+(bl.spd>=10?1:0);if(L>5)L=5;
  var s=hmHs(v.id),o=[],i,p=0;
  for(i=0;i<L;i++){p=(p*1103515245+12345)>>>0;var k=i===0?p%4:(i===1?4+p%4:p%8);o.push(HMOP[k].id)}
  return o}
function hmQ(){var L=FH.ops.length,n=FH.n;return n<=L+1?'S':n<=L+3?'A':n<=L+6?'B':'C'}
function hmBudget(){var L=FH.ops.length,n=FH.n;var cur=hmQ(),b={'S':L+1,'A':L+3,'B':L+6}[cur],sp=b-n;return sp>=0?('最多再点 '+sp+' 次保持 '+cur):('已超 '+cur+' 上限')}
function fHmMatch(){if(!FH||FH.seq.length!==FH.ops.length)return false;for(var i=0;i<FH.ops.length;i++)if(FH.seq[i]!==FH.ops[i])return false;return true}
function hmQN(q){return q==='S'?'完美 · S':q==='A'?'精良 · A':q==='B'?'合格 · B':'粗糙 · C'}
function hmAffClass(v,cls,q){if(FH&&FH.str>=10&&q==='S')q='B';
  var pool=[];
  for(var i=0;i<AF.length;i++){var af=AF[i];
    if(v.aff.indexOf(af.id)>=0||af.t==='负面')continue;
    if(af.t==='专属'&&(q!=='S'&&cls!=='专属'))continue;
    var cf=false;for(var k=0;k<v.aff.length;k++){if(fConflict(fAffix(v.aff[k]),af)){cf=true;break}}if(cf)continue;
    if(cls==='any'){if(af.t==='攻击'||af.t==='防御'||af.t==='效用'||(q==='S'&&af.t==='专属'))pool.push(af)}
    else if(cls==='专属'){if(af.t==='专属'||af.t==='攻击')pool.push(af)}
    else if(af.t===cls)pool.push(af)}
  if(!pool.length){for(var j=0;j<AF.length;j++){var aj=AF[j];if(aj.t!=='负面'&&v.aff.indexOf(aj.id)<0)pool.push(aj)}}
  return pool.length?pool[Math.floor(Math.random()*pool.length)].id:null}
function fStat(){var s=jg('wz_forge_stat',{h:0,ok:0,s:0,b:99});return s}
function fStatAdd(k,v){var s=fStat();s[k]=v;js('wz_forge_stat',s);return s}
function fHmRank(){var o=fStat().ok||0;return '· '+((o>=31)?'铸剑宗师':(o>=16)?'铸剑师':(o>=6)?'铁匠':(o>=1)?'学徒':'生手')}
function hmV(){var a=fVault();for(var i=0;i<a.length;i++)if(a[i].id===FH.vid)return a[i];return null}
function fHmStart(id){
  var v=null,a=fVault(),i;
  for(i=0;i<a.length;i++)if(a[i].id===id){v=a[i];break}
  if(!v)return;
  if(v.aff.length>0)return toast('已是成品','用「锻造/升阶」继续强化');
  var rw=fBlank(v.b).rar,wd=rw==='传说'?8:rw==='稀有'?14:rw==='魔法'?20:26;
  FH={vid:id,ops:hmOps(v),cur:0,pos:20,tgt:[50-wd/2,50+wd/2],n:0,str:0,st:0,fold:0,foldN:0,t:100,sp:0,tmr:null,h:0,hold:0,combo:0,seq:[],wm:100,edge:0};
  var gm=jg('wz_forge_hm',0);if(!gm){js('wz_forge_hm',1);setTimeout(function(){toast('锻打规则','趁热打铁：温度随操作下降，渐冷则位移减半·应力加剧；最后连续按谱收尾即成型(TFC式)；高温成型额外词缀；应力满裂坯；成型后→折叠→淬火→开刃',2600)},300)}
  var m=document.createElement('div');m.id='fHmMask';
  m.style.cssText='position:fixed;inset:0;z-index:2147483999;background:radial-gradient(ellipse at 50% 60%,rgba(30,16,8,.55),rgba(4,6,8,.94));display:flex;align-items:center;justify-content:center;backdrop-filter:blur(5px)';
  var bx=document.createElement('div');bx.id='fHmBox';bx.style.cssText='background:linear-gradient(160deg,#15191c,#0d1012 55%,#180f0b);border:1px solid #3a3128;border-radius:12px;padding:22px;width:min(660px,94vw);max-height:88vh;overflow:auto;font-family:Consolas,monospace;color:#f0f0f0;position:relative;box-shadow:0 0 46px rgba(255,120,40,.1),inset 0 0 90px rgba(120,60,20,.05);animation:fHmPop .28s ease-out';
  m.appendChild(bx);document.body.appendChild(m);
  if(!document.getElementById('fHmCss')){var st=document.createElement('style');st.id='fHmCss';st.textContent=CSS_STR;document.head.appendChild(st)}
  for(var i=0;i<7;i++){var s=document.createElement('div');s.className='fhm-spark';s.style.left=(8+Math.random()*84)+'%';s.style.top=(58+Math.random()*34)+'%';s.style.animationDelay=(Math.random()*1.4)+'s';s.style.animationDuration=(0.9+Math.random()*1.2)+'s';bx.appendChild(s)}
  window.addEventListener('keydown',fHmKey);
  fHmR();
}
function fHmKey(e){
  if(!FH)return;
  if(e.key==='Escape'){fHmClose();return}
  if(FH.st===1){if(e.key==='1'){fHmFold(0);return}if(e.key==='2'){fHmFold(1);return}}
  if(FH.st!==0)return;
  var map={'1':'ph','2':'pl','3':'pr','4':'ph2','q':'nh','w':'nl','e':'nr','r':'nl2','5':'cool','t':'heat','y':'hold','s':'calm'};
  var id=map[(e.key||'').toLowerCase()];
  if(!id)return;e.preventDefault();
  if(id==='calm')fHmCalm();else fHmOp(id);
}
function fHmClose(){if(FH&&FH.st<4&&FH.n>0)toast('已放弃锻打','本次进度丢弃，胚子保留');var m=document.getElementById('fHmMask');if(m)m.parentNode.removeChild(m);if(FH&&FH.tmr)clearInterval(FH.tmr);window.removeEventListener('keydown',fHmKey);FH=null}
function fHmNext(){var a=fVault(),i;for(i=0;i<a.length;i++)if(a[i].aff.length===0){fHmClose();fHmStart(a[i].id);return}toast('没有可用胚子','先去商店买胚子或锻造旧武器')}
function fHmR(){var b=document.getElementById('fHmBox');if(b)b.innerHTML=fHmHtml()}
function fHmBar(){return '<div style="font-size:13px;letter-spacing:.32em;font-weight:bold;margin-bottom:6px;background:linear-gradient(90deg,#ffd60a,#ff5c7a,#ffb703);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 10px rgba(255,150,40,.25))">W T Z · F O R G E</div>'}
function fHmHtml(){
  if(!FH)return'';var v=hmV(),bl=fBlank(v.b);if(!bl)return'';
  var q=hmQ(),sc=['#ffb703','#4fa8ff','#55e08a','#e0e0e0','#ffd60a'][FH.st],h=fHmBar();
  h+='<div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px;margin-bottom:2px">'+
    '<div style="font-size:16px;font-weight:bold;text-shadow:0 0 12px '+sc+'66">'+esc(fWName(v))+'</div>'+
    '<div style="font-size:10px;color:'+sc+';border:1px solid '+sc+'66;border-radius:20px;padding:2px 10px;text-shadow:0 0 8px '+sc+'55">'+(FH.st===0?'锻打':FH.st===1?'折叠':FH.st===2?'淬火':FH.st===3?'开刃':'成品')+'</div></div>';
  h+='<div style="font-size:10px;color:#8a8a8a;margin-bottom:10px">'+bl.t+' · 品质 '+hmQN(q)+'（锻打 '+FH.n+' / 谱 '+FH.ops.length+'）'+(FH.st===0?(' · '+hmBudget()):'')+' <span style="color:#ffd60a">'+fHmRank()+'</span></div>';
  if(FH.st===0){
    h+='<div style="position:relative;height:30px;background:linear-gradient(90deg,#171009,#2a1c10 50%,#171009);border:1px solid #4a3620;border-radius:6px;margin:10px 0;box-shadow:inset 0 0 18px rgba(120,60,20,.18)">';
    h+='<div class="fhm-flash" style="position:absolute;top:0;bottom:0;left:'+FH.tgt[0]+'%;width:'+(FH.tgt[1]-FH.tgt[0])+'%;background:linear-gradient(180deg,rgba(255,214,10,.3),rgba(255,120,40,.1));border:1px solid rgba(255,214,10,.5);border-radius:4px;box-shadow:0 0 16px rgba(255,183,3,.35)"></div>';
    h+='<div style="position:absolute;top:0;bottom:0;left:50%;width:1px;background:#fff;opacity:.2"></div>';
    for(var t=1;t<10;t++){h+='<div style="position:absolute;top:0;bottom:0;left:'+(t*10)+'%;width:1px;background:rgba(255,255,255,.06)"></div>'}
    h+='<div class="fhm-ptr" style="position:absolute;top:-5px;left:'+FH.pos+'%;transform:translateX(-50%);color:#fff;font-size:17px;text-shadow:0 0 10px rgba(255,255,255,.6)">▼</div></div>';
    h+='<div style="font-size:9px;color:#6e8a86;margin-bottom:6px">金色窗口 '+Math.round(FH.tgt[1]-FH.tgt[0])+' 宽 · 对准中央 · 操作越少品质越高（S>A>B>C）'+(FH.hold?' · <span style="color:#4fa8ff">夹持锁定 1 拍</span>':'')+(FH.str>=10?' · <span style="color:#ff5c7a">⚠ 应力高 · 词缀池受限</span>':'')+'</div>';
    h+='<div style="display:flex;gap:4px;flex-wrap:wrap;margin:6px 0">';
    var pt=['末步','次末','三末','四末','五末'];
    for(var i=0;i<FH.ops.length;i++){var ok=i<FH.seq.length&&FH.seq[i]===FH.ops[i],bd=i<FH.seq.length&&FH.seq[i]!==FH.ops[i],op=hmOp(FH.ops[i]);
      h+='<div class="fhm-step" style="border:1px solid '+(ok?'#55e08a':bd?'#ff5c7a':'#3a3a3a')+';background:'+(ok?'rgba(85,224,138,.14)':bd?'rgba(255,92,122,.12)':'none')+';border-radius:6px;padding:3px 9px;font-size:10px;color:'+(ok?'#55e08a':bd?'#ff5c7a':'#8a8a8a')+';'+(i===FH.seq.length?'box-shadow:0 0 10px rgba(255,214,10,.3);animation:fHmPulse 1.2s infinite':'')+'"><div style="font-size:8px;opacity:.7;margin-bottom:2px">'+pt[i]+'</div>'+(ok?'✓ ':'')+op.n+(i===FH.seq.length?' ◀':'')+'</div>'}
    h+='</div>';
    h+='<div style="font-size:10px;color:#8a8a8a;margin:4px 0">自由锻打调位 · 最后连续按谱收尾即成型（红=偏离谱，继续按到对齐即可） · 辅助可穿插：</div>';
    h+='<div style="font-size:9px;color:#6e8a86;margin:0 0 6px">最近手法：'+(FH.seq.length?FH.seq.slice(-3).map(function(x){return hmOp(x).n}).join(' · '):'——')+'</div>';
    h+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">';
    for(var j=0;j<8;j++){var o=HMOP[j];
      var ds=o.d>0?'→+'+o.d:'←'+o.d;
      var ky=o.id==='ph'?'1':o.id==='pl'?'2':o.id==='pr'?'3':o.id==='ph2'?'4':o.id==='nh'?'Q':o.id==='nl'?'W':o.id==='nr'?'E':o.id==='nl2'?'R':'';
      h+='<button onclick="fHmOp(\''+o.id+'\')" class="fhm-b" style="border:1px solid '+o.c+';background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(0,0,0,.18));color:'+o.c+';font-size:12px;padding:9px 0;border-radius:6px;text-shadow:0 0 8px '+o.c+'88">'+o.n+'<div style="font-size:8px;color:#8a8a8a">'+ds+'</div>'+(ky?'<div style="font-size:7px;color:#5a5a5a">['+ky+']</div>':'')+'</button>'}
    h+='</div>';
    h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:6px">';
    for(var j=8;j<11;j++){var o=HMOP[j];
      var ds=o.id==='cool'?'回中× · 5':o.id==='heat'?'累积→ · T':'锁1拍 · Y';
      var ky=o.id==='cool'?'5':o.id==='heat'?'T':'Y';
      h+='<button onclick="fHmOp(\''+o.id+'\')" class="fhm-b" style="border:1px solid '+o.c+';background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(0,0,0,.18));color:'+o.c+';font-size:12px;padding:9px 0;border-radius:6px;text-shadow:0 0 8px '+o.c+'88">'+o.n+'<div style="font-size:8px;color:#8a8a8a">'+ds+'</div><div style="font-size:7px;color:#5a5a5a">['+ky+']</div></button>'}
    h+='</div>';
    h+='<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;align-items:center">';
    h+='<button onclick="fHmCalm()" class="fhm-b" style="border:1px solid #55e08a;background:linear-gradient(180deg,rgba(85,224,138,.08),rgba(0,0,0,.15));color:#55e08a;font-size:11px;padding:5px 12px;border-radius:6px">静置 · 消应力 <span style="font-size:8px;color:#6e8a86">[S]</span></button>';
    h+='<span style="font-size:9px;color:#6e8a86">顺序走完自动成型 · 指针在金色窗口得满分，脱靶降一档</span>';
    h+='</div>';
    h+='<div style="margin-top:6px;font-size:10px;color:#8a8a8a">温度 <span style="color:'+(FH.wm<40?'#5c7cff':'#ff7a4d')+'">'+FH.wm+'</span>'+(FH.wm<40?' · 渐冷，锤击乏力':' · 趁热打铁！')+'：</div>';
    h+='<div style="height:8px;background:#2a2a2a;border-radius:4px;overflow:hidden;margin:3px 0 10px'+(FH.wm<40?';border:1px solid #5c7cff;box-shadow:0 0 12px rgba(92,124,255,.35)':'')+'"><div style="height:100%;width:'+FH.wm+'%;background:linear-gradient(90deg,#5c7cff,#ff9d5c,#ff4d4d);transition:width .15s"></div></div>';
    h+='<div style="font-size:10px;color:#8a8a8a">应力 <span style="color:'+(FH.str>=14+2*FH.ops.length-4?'#ff5c7a':'#55e08a')+'">'+FH.str+'/'+(14+2*FH.ops.length)+'</span>：</div>';
    h+='<div style="height:8px;background:#2a2a2a;border-radius:4px;overflow:hidden;margin:3px 0 10px"><div style="height:100%;width:'+Math.min(100,FH.str/(14+2*FH.ops.length)*100)+'%;background:linear-gradient(90deg,#55e08a,#ffb703,#ff5c7a);transition:width .15s"></div></div>';
    h+='<button onclick="fHmClose()" style="border:1px solid #666;background:none;color:#999;font-size:11px;padding:3px 10px;cursor:pointer;border-radius:5px">放弃（保留胚子）</button>';
  }else if(FH.st===1){
    h+='<div style="font-size:11px;color:'+sc+';margin:8px 0;text-shadow:0 0 8px '+sc+'55">折叠 '+(FH.foldN+1)+'/2 · 决定词缀方向</div>';
    h+='<div style="font-size:10px;color:#8a8a8a;margin-bottom:6px">当前趋势：'+(FH.fold>0?'锋利(攻击系)':FH.fold<0?'韧性(防御系)':'均衡(待定)')+'</div>'+(FH.foldN===1?'<div style="font-size:9px;color:#6e8a86;margin-bottom:4px">再折一次将自动进入淬火 · 温度决定词缀系</div>':'');
    h+='<button onclick="fHmFold(0)" class="fhm-b" style="border:1px solid #4fa8ff;background:linear-gradient(180deg,rgba(79,168,255,.08),rgba(0,0,0,.15));color:#4fa8ff;font-size:12px;padding:11px 18px;border-radius:6px;margin:6px">对折 → 韧性（防御系）</button>';
    h+='<button onclick="fHmFold(1)" class="fhm-b" style="border:1px solid #ff5c7a;background:linear-gradient(180deg,rgba(255,92,122,.08),rgba(0,0,0,.15));color:#ff5c7a;font-size:12px;padding:11px 18px;border-radius:6px;margin:6px">错折 → 锋利（攻击系）</button>';
  }else if(FH.st===2){
    h+='<div style="font-size:12px;color:'+sc+';margin:8px 0">淬火 · 温度 <span id="fHmT" style="color:#ffb703;font-size:15px;text-shadow:0 0 10px rgba(255,183,3,.5)">'+Math.round(FH.t)+'</span></div>';
    h+='<div style="position:relative;height:14px;background:linear-gradient(90deg,#4fa8ff,#55e08a,#ffb703,#ff5c7a);border-radius:6px;margin:6px 0;box-shadow:0 0 14px rgba(255,120,40,.2)"><div class="fhm-ptr" style="position:absolute;top:-5px;left:'+FH.t+'%;transform:translateX(-50%);color:#fff;font-size:15px;text-shadow:0 0 8px rgba(255,255,255,.6)">▼</div></div>';
    h+='<div style="font-size:9px;color:#6e8a86;margin:6px 0">高温(60+)→攻击系 · 中温(40-60)→防御系 · 低温(40-)→效用系，温度下降中，选窗口入水</div>';
    h+='<button onclick="fHmQuench()" class="fhm-b" style="border:1px solid #ffb703;background:linear-gradient(180deg,rgba(255,183,3,.12),rgba(0,0,0,.15));color:#ffb703;font-size:12px;padding:9px 18px;border-radius:6px;margin-top:6px">入水 · 淬火</button>';
  }else if(FH.st===3){
    h+='<div style="font-size:12px;color:'+sc+';margin:8px 0">开刃 · 扫掠位置 <span id="fHmSp" style="color:#4fa8ff;font-size:15px;text-shadow:0 0 10px rgba(79,168,255,.5)">'+Math.round(FH.sp)+'</span></div>';
    h+='<div style="position:relative;height:14px;background:linear-gradient(90deg,#1a1d20,#22262a);border:1px solid #2c2c2c;border-radius:6px;margin:6px 0;overflow:hidden"><div style="position:absolute;top:0;bottom:0;left:45%;width:10%;background:linear-gradient(90deg,rgba(255,214,10,.1),rgba(255,214,10,.3),rgba(255,214,10,.1));box-shadow:0 0 12px rgba(255,214,10,.4)" class="fhm-glow"></div><div class="fhm-ptr" style="position:absolute;top:-5px;left:'+FH.sp+'%;transform:translateX(-50%);color:#fff;font-size:15px;text-shadow:0 0 8px rgba(255,255,255,.6)">▼</div><div style="position:absolute;top:0;bottom:0;left:'+Math.max(0,FH.sp-18)+'%;width:36%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);transition:left .04s"></div></div>';
    h+='<div style="font-size:9px;color:#6e8a86;margin:6px 0">指针扫过，停在中央金色区（±5）得铭刻词缀，±12 内得附加词缀</div>';
    h+='<button onclick="fHmBlade()" class="fhm-b" style="border:1px solid #ffd60a;background:linear-gradient(180deg,rgba(255,214,10,.14),rgba(0,0,0,.15));color:#ffd60a;font-size:12px;padding:9px 18px;border-radius:6px;margin-top:6px">开刃</button>';
  }else{
    var qc=fQCol(q);
    h+='<div style="font-size:12px;color:#55e08a;margin:8px 0;text-shadow:0 0 14px rgba(85,224,138,.5)">锻造完成 · '+esc(fWName(v))+'</div>';
    h+='<div style="font-size:11px;color:#c8ccd0;margin:4px 0">品质 <span style="color:'+qc+';font-weight:bold;text-shadow:0 0 10px '+qc+'88">'+hmQN(q)+'</span> · 词缀：'+(fAffNames(v).join(' / ')||'无')+'</div>';
    h+='<div style="font-size:10px;color:#8a8a8a;margin:4px 0">已存入仓库，可在锻造台继续附魔/升阶</div>';
    var st=fStat();h+='<div style="font-size:9px;color:#4a4a4a;margin-top:6px">锻打统计：'+st.h+' 次 · 成功 '+st.ok+' · S 品质 '+st.s+' · 最佳有效次数 '+(st.b>90?'—':st.b)+'</div>';
    h+='<button onclick="fHmClose()" class="fhm-b" style="border:1px solid #55e08a;background:linear-gradient(180deg,rgba(85,224,138,.2),rgba(0,0,0,.15));color:#55e08a;font-size:12px;padding:7px 18px;border-radius:6px;font-weight:bold;margin-top:12px">收下 · 入库</button>';
    h+='<button onclick="fHmNext()" class="fhm-b" style="border:1px solid #ffb703;background:linear-gradient(180deg,rgba(255,183,3,.14),rgba(0,0,0,.15));color:#ffb703;font-size:12px;padding:7px 18px;border-radius:6px;font-weight:bold;margin-top:12px;margin-left:8px">再造一把</button>';
  }
  h+='<div style="font-size:9px;color:#4a4a4a;margin-top:8px">锻打次数越少品质越高 · 高温成型额外词缀 · 渐冷锤击乏力（位移减半·应力加剧） · 淬火/折叠/开刃各添一条词缀</div>';
  return h;
}
var AC=null;
function fHmSnd(k){
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    var t=AC.currentTime,g=AC.createGain(),o=AC.createOscillator();
    g.gain.setValueAtTime(0.12,t);
    if(k==='hit'){o.frequency.setValueAtTime(150,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.type='square'}
    else if(k==='done'){o.frequency.setValueAtTime(523,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);o.type='triangle'}
    else if(k==='bad'){o.frequency.setValueAtTime(98,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.type='sawtooth'}
    else if(k==='crack'){o.frequency.setValueAtTime(72,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.5);o.type='sawtooth'}
    else if(k==='quench'){o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(220,t+0.4);g.gain.exponentialRampToValueAtTime(0.001,t+0.45);o.type='sine'}
    else if(k==='blade'){o.frequency.setValueAtTime(1568,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);o.type='triangle'}
    else if(k==='fold'){o.frequency.setValueAtTime(392,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);o.type='triangle'}
    else return;
    o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+0.6);
  }catch(err){}
}
function fHmFX(){var bx=document.getElementById('fHmBox');if(!bx)return;bx.classList.add('fhm-shake');setTimeout(function(){bx.classList.remove('fhm-shake')},430)}
function fHmOp(id){
  var a=document.activeElement;if(a&&a.blur)a.blur();
  if(!FH||FH.st!==0)return;var o=hmOp(id);if(!o)return;
  FH.n++;FH.str+=2;
  FH.wm=Math.max(0,FH.wm-6);var cold=FH.wm<40;if(cold)FH.str+=2;
  if(cold&&FH.wm===34)toast('金属渐冷！','锤击乏力·位移减半·应力加剧——用「升温」保温',1800);
  var lk=FH.hold>0;if(lk)FH.hold--;
  if(id==='cool'){if(!lk)FH.pos+=Math.round((50-FH.pos)*0.25)}
  else if(id==='heat'){if(FH.h>=6){toast('过热！','升温到上限，静置降温');FH.h=0}else{FH.h=(FH.h||0)+1;if(!lk){FH.wm=Math.min(100,FH.wm+12);FH.pos=Math.max(0,Math.min(100,FH.pos+FH.h))}}}
  else if(id==='hold'){FH.hold=1;FH.h=0}
  else{var dd=cold?Math.round(o.d/2):o.d;if(!lk)FH.pos=Math.max(0,Math.min(100,FH.pos+dd))}
  var ed=FH.pos<=4||FH.pos>=96;if(ed&&!FH.edge){FH.edge=1;FH.str+=2;toast('敲过头了！','指针逼近边界，应力加剧——别把坯子打飞',1400)}if(!ed)FH.edge=0;
  if(o.d!==0){FH.seq.push(id);if(FH.seq.length>FH.ops.length)FH.seq.shift();if(fHmMatch()){fHmFinish();return}}
  fHmFX();fHmSnd('hit');
  if(FH.str>=14+2*FH.ops.length){
    var v=hmV();if(v&&!v.aff.length){v.aff.push(hmAffClass(v,'any','C'));v.q='C';fSaveV(v)}
    var st=fStat();st.h++;js('wz_forge_stat',st);
    FH.st=4;fHmSnd('crack');var bx=document.getElementById('fHmBox');if(bx)bx.classList.add('fhm-crack');toast('裂坯！','锻打中断，成品降为 C 品质');fBurst(500,300,'#ff5c7a',26);fHmR();return;
  }
  fHmR();
}
function fHmCalm(){var a=document.activeElement;if(a&&a.blur)a.blur();if(!FH||FH.st!==0)return;FH.n++;FH.str=Math.max(0,FH.str-5);FH.wm=Math.max(0,FH.wm-12);fHmR()}
function fHmFinish(){
  if(!FH||FH.st!==0)return;if(!fHmMatch())return;
  var v=hmV(),q=hmQ(),off=0,hot=0;if(!v)return;
  if(FH.pos<FH.tgt[0]||FH.pos>FH.tgt[1]){off=1;q=q==='S'?'A':q==='A'?'B':q==='B'?'C':'C'}
  v.aff.push(hmAffClass(v,'any',q));v.q=q;fSaveV(v);
  if(FH.wm>=60){v.aff.push(hmAffClass(v,q==='S'?'攻击':'any',q));fSaveV(v);hot=1}
  var st=fStat();st.h++;st.ok++;if(q==='S')st.s++;var ef=FH.n;if(ef<st.b)st.b=ef;js('wz_forge_stat',st);
  FH.st=1;FH.foldN=0;fHmSnd('done');if(q==='S')fBurst(500,300,'#ffd60a',26);toast('成型！','品质 '+hmQN(q)+(off?' · 脱靶降档':'')+(hot?' · 趁热打铁，额外词缀':'')+' · 下一步折叠');fBurst(500,300,q==='S'?'#ff5c7a':q==='A'?'#ffb703':'#ffd60a',18);fHmR();
}
function fHmFold(k){
  if(!FH||FH.st!==1)return;FH.fold+=(k?1:-1);FH.foldN++;
  if(FH.foldN>=2){
    var v=hmV(),q=v.q||'B';
    v.aff.push(hmAffClass(v,FH.fold>0?'攻击':FH.fold<0?'防御':'效用',q));fSaveV(v);
    FH.st=2;FH.t=100;FH.tmr=setInterval(function(){if(FH){FH.t=Math.max(0,FH.t-1.6);var e=document.getElementById('fHmT');if(e)e.textContent=Math.round(FH.t);if(FH.t<=0)clearInterval(FH.tmr);if(FH.t<15&&!FH.cold){FH.cold=1;toast('快过冷了','低温将落入效用系')}}},40);
    fBurst(300,300,FH.fold>0?'#ff5c7a':'#4fa8ff',14);fHmSnd('fold');
    toast('折叠完成','方向 '+(FH.fold>0?'锋利(攻击系)':FH.fold<0?'韧性(防御系)':'均衡(效用系)')+' · 下一步淬火');
  }
  fHmR();
}
function fHmQuench(){
  if(!FH||FH.st!==2)return;if(FH.tmr){clearInterval(FH.tmr);FH.tmr=null}
  var v=hmV(),q=v.q||'B';
  v.aff.push(hmAffClass(v,FH.t>60?'攻击':FH.t>=40?'防御':'效用',q));fSaveV(v);
  fBurst(300,300,'#4fa8ff',16);fHmSnd('quench');
  FH.st=3;FH.sp=0;FH.tmr=setInterval(function(){if(FH){FH.sp+=0.6;if(FH.sp>=100)FH.sp=0;var e=document.getElementById('fHmSp');if(e)e.textContent=Math.round(FH.sp)}},40);
  toast('淬火完成','落点 '+(FH.t>60?'高温':FH.t>=40?'中温':'低温')+' · 下一步开刃');fHmR();
}
function fHmBlade(){
  if(!FH||FH.st!==3)return;if(FH.tmr){clearInterval(FH.tmr);FH.tmr=null}
  var v=hmV(),q=v.q||'B',dist=Math.abs(50-FH.sp),got=null;
  if(dist<=5)got=hmAffClass(v,'专属',q);
  else if(dist<=12)got=hmAffClass(v,'any',q);
  if(got){v.aff.push(got);fSaveV(v);fExpAdd(8);fLexAdd([got])}
  FH.st=4;fVaultSave(fVault());
  toast('开刃完成',dist<=5?'完美开刃 · 铭刻词缀':dist<=12?'开刃成功':'开刃偏移，成品略钝');
  fBurst(500,300,'#ffd60a',18);fHmSnd('blade');fHmR();
}

function openForge(){
  fStyle();
  var old=document.getElementById('forgeMask');if(old)old.parentNode.removeChild(old);
  var m=document.createElement('div');m.id='forgeMask';
  m.style.cssText='position:fixed;inset:0;z-index:2147482900;display:flex;align-items:center;justify-content:center;padding:24px';
  m.onclick=function(e){if(e.target===m)closeForge()};
  var box=document.createElement('div');
  box.style.cssText='width:min(880px,95vw);max-height:90vh;overflow:auto;background:var(--panel,#141414);border:1px solid var(--line,#333);border-radius:12px;padding:16px;font-family:Consolas,monospace;color:var(--ink,#f0f0f0)';
  box.innerHTML=
  '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
    '<b style="font-size:15px;letter-spacing:.15em">⚒ 武器锻造 · FORGE</b>'+
    '<button onclick="closeForge()" style="background:none;border:1px solid var(--line,#444);color:var(--ink,#eee);cursor:pointer;padding:2px 10px">✕</button></div>'+
  '<div id="fRes" style="font-size:11px;color:#8a8a8a;margin-bottom:8px;letter-spacing:.05em">'+fResBar()+'</div>'+
  '<div id="fDrop" ondragover="event.preventDefault();this.style.outline=\'2px dashed var(--accent,#fff)\'" ondragleave="this.style.outline=\'none\'" ondrop="event.preventDefault();this.style.outline=\'none\';if(window.FORGE_DRAG){forgePick(FORGE_DRAG);FORGE_DRAG=null}" style="border:1px dashed #3a3f46;border-radius:8px;padding:8px;margin-bottom:10px;text-align:center;font-size:10px;color:#5b5b5b">把武器拖到这里选中锻造</div>'+
  '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">'+
    '<button data-fv="vault" class="f-vb on" onclick="fView(\'vault\')" style="border:1px solid var(--accent,#fff);background:none;color:var(--accent,#fff);font-size:11px;padding:3px 12px;cursor:pointer">仓库</button>'+
    '<button data-fv="plot" class="f-vb" onclick="fView(\'plot\')" style="border:1px solid #55e08a;background:none;color:#55e08a;font-size:11px;padding:3px 12px;cursor:pointer">材料园</button>'+
    '<button data-fv="lex" class="f-vb" onclick="fView(\'lex\')" style="border:1px solid #666;background:none;color:#999;font-size:11px;padding:3px 12px;cursor:pointer">图鉴</button>'+
    '<button data-fv="tech" class="f-vb" onclick="fView(\'tech\')" style="border:1px solid #666;background:none;color:#999;font-size:11px;padding:3px 12px;cursor:pointer">科技树</button>'+
    '<button data-fv="rank" class="f-vb" onclick="fView(\'rank\')" style="border:1px solid #666;background:none;color:#999;font-size:11px;padding:3px 12px;cursor:pointer">战力榜</button>'+
    '<button onclick="fConvert()" style="border:1px solid #ffb703;background:none;color:#ffb703;font-size:11px;padding:3px 12px;cursor:pointer">材料转换</button>'+
    '<button onclick="fSyncOut()" style="border:1px solid #5ad1ff;background:none;color:#5ad1ff;font-size:11px;padding:3px 12px;cursor:pointer">云上传</button>'+
    '<button onclick="fSyncIn()" style="border:1px solid #5ad1ff;background:none;color:#5ad1ff;font-size:11px;padding:3px 12px;cursor:pointer">云下载</button>'+
    '<button onclick="fUpgradeLv()" style="border:1px solid #ffb703;background:none;color:#ffb703;font-size:11px;padding:3px 12px;cursor:pointer">升级锻造台('+fLvCost(fLv())+'书架)</button>'+
    '<button onclick="fBuyGuide()" style="border:1px solid #55e08a;background:none;color:#55e08a;font-size:11px;padding:3px 12px;cursor:pointer">获取胚子</button>'+
    '<button onclick="fForgeBlank()" style="border:1px solid #b0bec5;background:none;color:#b0bec5;font-size:11px;padding:3px 12px;cursor:pointer">铁制胚子 · 4 铁</button></div>'+
  '<div id="fBody"></div>';
  m.appendChild(box);document.body.appendChild(m);forgeRender();
  setTimeout(function(){fGuide()},200);
}
function closeForge(){var m=document.getElementById('forgeMask');if(m)m.parentNode.removeChild(m)}
function fView(v){FORGE_VIEW=v;var bs=document.querySelectorAll('.f-vb');for(var i=0;i<bs.length;i++){var b=bs[i];var on=b.getAttribute('data-fv')===v;b.style.border=on?'1px solid var(--accent,#fff)':'1px solid #666';b.style.color=on?'var(--accent,#fff)':'#999'}forgeRender()}
function fBuyGuide(){toast('两种途径拿胚子','① index 积分商店「武器」分类购买 ② 上方「铁制胚子」用 4 魔铁锭手打')}
function fResBar(){
  var sh=fShow(),shN='';
  if(sh){var va=fVault();for(var i=0;i<va.length;i++)if(va[i].id===sh){shN=' · <span style="color:#ffd60a">★门面:'+fWName(va[i])+'</span>';break}}
  return '<span style="color:#4fa8ff">青金石 '+fLapis()+'</span> · <span style="color:#b0bec5">魔铁锭 '+fIron()+'</span> · <span style="color:#ffb703">书架 '+fBS()+'</span> · <span style="color:#ffd60a">锻造台 LV'+fLv()+'</span> · <span style="color:#c8a84a">熟练 LV'+fElv()+'</span>'+shN;
}
function fWCard(v,extra){
  var bl=fBlank(v.b);if(!bl)return'';var r=fRarity(v),p=fPower(v),col=fRarCol(r);
  var show=fShow()===v.id;
  var glows=r==='传说'?'box-shadow:0 0 14px rgba(255,214,10,.35);animation:fGlow 2s infinite':r==='稀有'?'box-shadow:0 0 10px rgba(255,183,3,.22)':r==='魔法'?'box-shadow:0 0 8px rgba(79,168,255,.18)':'';
  if(v.q==='S')glows+='box-shadow:0 0 18px rgba(255,92,122,.45);animation:fGlow 2s infinite';
  return '<div class="fc" draggable="true" ondragstart="FORGE_DRAG=\''+v.id+'\'" style="border:1px solid '+col+';border-radius:8px;padding:9px;background:rgba(255,255,255,.03);position:relative;overflow:hidden;'+glows+'">'+
    '<div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,'+col+',transparent);opacity:.7"></div>'+
    (show?'<div style="position:absolute;top:4px;right:6px;color:#ffd60a;font-size:9px">★门面</div>':'')+
    '<div style="display:flex;align-items:center;gap:9px">'+fIcon(bl.st,col)+
    '<div><div style="color:'+col+';font-size:12px;font-weight:bold">'+esc(fWName(v))+'</div>'+
    '<div style="font-size:9px;color:#7d858c">'+bl.t+' · '+r+' · 战力 '+p+(v.q?' · <span style="color:'+fQCol(v.q)+';font-weight:bold">品质 '+fQName(v.q)+'</span>':'')+'</div></div></div>'+
    '<div style="font-size:10px;color:#aab3bc;line-height:1.5;margin-top:5px">'+(fAffNames(v).join(' / ')||'<span style="color:#5b5b5b">未附魔</span>')+'</div>'+
    (fComboName(v)?'<div style="font-size:10px;color:#ffd60a;margin-top:2px">✦ '+fComboName(v)+'</div>':'')+
    (v.cost>0?'<div style="font-size:9px;color:'+(v.cost>=8?'#ff5c7a':'#8a8a8a')+'">'+(v.cost>=8?'⚠ 过于昂贵':'铁砧成本 '+v.cost)+'</div>':'')+
    (extra||'')+
    '<div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap">'+
      '<button onclick="'+(v.aff.length?('forgePick(\''+v.id+'\')'):('fHmStart(\''+v.id+'\')'))+'" style="border:1px solid var(--accent,#fff);background:none;color:var(--accent,#fff);font-size:10px;padding:2px 8px;cursor:pointer">'+(v.aff.length?'锻造':'锻打')+'</button>'+
      (show?'':'<button onclick="fShowSet(\''+v.id+'\')" style="border:1px solid #ffd60a;background:none;color:#ffd60a;font-size:10px;padding:2px 8px;cursor:pointer">设门面</button>')+
      '<button onclick="fDiscard(\''+v.id+'\')" style="border:1px solid #ff5c7a;background:none;color:#ff5c7a;font-size:10px;padding:2px 8px;cursor:pointer">分解+2铁</button></div></div>';
}
function fVaultHtml(){
  var a=fVault();
  if(!a.length)return '<div style="color:#5b5b5b;font-size:12px;padding:10px 0">仓库空空如也。上方「获取胚子」去 index 商店买，或点「铁制胚子」用 4 魔铁锭手打一把。</div>';
  var list=fApplyFilt(a);
  var hh=fFiltHtml();
  if(!list.length)hh+='<div style="color:#5b5b5b;font-size:11px;padding:4px 0">没有匹配的武器。</div>';
  hh+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px">'+list.map(function(v){return fWCard(v)}).join('')+'</div>';
  return hh;
}
function fRankHtml(){
  var a=fVault().slice().sort(function(x,y){return fPower(y)-fPower(x)});
  if(!a.length)return '<div style="color:#5b5b5b;font-size:12px;padding:10px 0">还没有武器，去锻造一把上榜。</div>';
  return a.map(function(v,i){var bl=fBlank(v.b),r=fRarity(v),p=fPower(v),col=fRarCol(r);
    return '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed #333;padding:8px 4px">'+
      '<span style="color:#666;width:26px">'+(i+1)+'</span>'+fIcon(bl.st,col)+
      '<span style="color:'+col+';font-weight:bold;flex:1;margin-left:8px">'+esc(fWName(v))+'</span>'+
      '<span style="color:#8a8a8a;font-size:10px;margin-right:10px">'+r+(v.q?' · '+fQName(v.q):'')+'</span>'+
      '<span style="color:var(--accent,#fff)">'+p+' 战力</span></div>'}).join('');
}
function fMergeChoices(v){
  var others=fVault().filter(function(x){return x.id!==v.id&&x.b===v.b});
  if(!others.length)return '<div style="color:#5b5b5b;font-size:11px">没有同胚子武器可合并。</div>';
  return '<div style="font-size:11px;color:#8a8a8a;margin:6px 0">选择要合并的同胚子武器（取其词缀）：</div>'+
    others.map(function(o){var or=fRarity(o);
      return '<button onclick="forgeMerge(\''+o.id+'\')" style="border:1px solid #55e08a;background:none;color:#55e08a;font-size:11px;padding:3px 10px;margin:3px;cursor:pointer">'+
      esc(fWName(o))+' · '+or+' · '+fAffNames(o).join('/')+'</button>'}).join('');
}
function forgePick(id){var a=fVault();for(var i=0;i<a.length;i++)if(a[i].id===id){FORGE_SEL=a[i];break}forgeRender()}
function fEnchantCard(o,i,af){
  var bar='<div style="height:4px;background:#2a2a2a;border-radius:2px;overflow:hidden;margin:4px 0"><div style="height:100%;width:'+Math.min(100,o.lv/(af.mx||3)*100)+'%;background:'+(af.grp?'#4fa8ff':'#8a8a8a')+';transition:width .3s"></div></div>';
  return '<div style="border:1px dashed #444;border-radius:8px;padding:9px;cursor:pointer;transition:.15s;background:rgba(255,255,255,.02)" onclick="forgeEn('+i+')" onmouseenter="this.style.borderColor=\'var(--accent,#fff)\';this.style.background=\'rgba(255,255,255,.06)\'" onmouseleave="this.style.borderColor=\'#444\';this.style.background=\'rgba(255,255,255,.02)\'">'+
    '<div style="display:flex;justify-content:space-between;align-items:center"><span style="color:var(--accent,#fff);font-size:12px">'+(af?af.n:'')+' '+(o.lv>1?'Lv'+o.lv:'')+'</span><span style="font-size:9px;color:'+(af&&af.t==='负面'?'#ff5c7a':'#6e8a86')+'">'+(af?af.t:'')+'</span></div>'+
    '<div style="font-size:10px;color:#9aa6ad">'+(af?af.e:'')+'</div>'+bar+
    '<div style="font-size:10px;color:#4fa8ff">'+o.lap+' 青金石 · '+o.xp+' 经验</div></div>';
}
function forgeRender(){
  var bd=document.getElementById('fBody');if(!bd)return;
  var res=document.getElementById('fRes');if(res)res.innerHTML=fResBar();
  var h='';
  if(FORGE_VIEW==='rank'){
    h+='<div style="font-size:11px;letter-spacing:.15em;color:#6e8a86;margin:8px 0 6px">武器战力榜 · RANK</div>';
    h+=fRankHtml();
  }else if(FORGE_VIEW==='plot'){
    h+=fPlotHtml();
  }else if(FORGE_VIEW==='lex'){
    h+=fLexHtml();
  }else if(FORGE_VIEW==='tech'){
    h+=fTechHtml();
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
        opts.map(function(o,i){var af=fAffix(o.af);return fEnchantCard(o,i,af)}).join('')+'</div>';
      var rp=FORGE_SEL?FORGE_SEL.dur:0,rc=FORGE_SEL?FORGE_SEL.cost:0;
      var ironNeed=rp>=10?0:2,ironHave=fIron();
      h+='<div style="font-size:10px;color:#6e8a86;margin:10px 0 4px">铁砧：</div>';
      h+='<div style="display:flex;gap:8px;flex-wrap:wrap">'+
        '<button onclick="forgeReroll()"'+(fLapis()<3?' disabled':'')+' style="border:1px solid #4fa8ff;background:none;color:'+(fLapis()<3?'#555':'#4fa8ff')+';font-size:11px;padding:4px 12px;cursor:pointer">重掷 · 3 青金石'+(fLapis()<3?'（缺 '+(3-fLapis())+'）':'')+'</button>'+
        '<button onclick="forgeRepair()"'+(ironHave<ironNeed?' disabled':'')+' style="border:1px solid #55e08a;background:none;color:'+(ironHave<ironNeed?'#555':'#55e08a')+';font-size:11px;padding:4px 12px;cursor:pointer">修复 · 2 魔铁锭'+(ironHave<ironNeed?'（缺 '+(ironNeed-ironHave)+'）':'')+'</button>'+
        '<button onclick="fMergeOpen()" style="border:1px solid #b0bec5;background:none;color:#b0bec5;font-size:11px;padding:4px 12px;cursor:pointer">合并</button>'+
        '<button onclick="forgeClear()" style="border:1px solid #666;background:none;color:#999;font-size:11px;padding:4px 12px;cursor:pointer">取消选择</button>'+
        '<button onclick="fEnchantTarget()" style="border:1px solid #4fa8ff;background:none;color:#4fa8ff;font-size:11px;padding:4px 12px;cursor:pointer">定向附魔</button>'+
        '<button onclick="fAscend()" style="border:1px solid #ffd60a;background:none;color:#ffd60a;font-size:11px;padding:4px 12px;cursor:pointer">升阶(3合1)</button></div>';
      if(FORGE_MERGE)h+='<div style="margin-top:8px">'+fMergeChoices(v)+'</div>';
    }else{
      h+='<div style="font-size:10px;color:#5b5b5b;margin-top:10px">从上方仓库选一把武器开始锻造（可拖拽到顶部虚线区）。胚子在 index 积分商店「武器」分类购买，或用「铁制胚子」手打。</div>';
    }
  }
  bd.innerHTML=h;
}
function fMergeOpen(){FORGE_MERGE=!FORGE_MERGE;forgeRender()}
window.fForgeBlank=fForgeBlank;window.openForge=openForge;window.closeForge=closeForge;window.fView=fView;window.fUpgradeLv=fUpgradeLv;
window.fShowSet=fShowSet;window.fMergeOpen=fMergeOpen;window.forgePick=forgePick;window.forgeRender=forgeRender;
window.forgeEn=function(i){var v=FORGE_SEL;if(!v)return;var opts=fEnchant(v);
  if(fApply(v,opts[i])){fVaultSave(fVault());toast('附魔成功','+'+fAffix(opts[i].af).n);fBurst(500,300,fRarCol(fRarity(v)),16);forgeRender()}};
window.forgeReroll=function(){if(FORGE_SEL&&fReroll(FORGE_SEL)){toast('已重掷','');forgeRender()}};
window.forgeRepair=function(){if(FORGE_SEL&&fRepair(FORGE_SEL)){toast('已修复','');forgeRender()}};
window.forgeMerge=function(id){if(!FORGE_SEL)return;var o=null;var a=fVault();for(var i=0;i<a.length;i++)if(a[i].id===id){o=a[i];break}
  if(!o)return;var r=fMerge(FORGE_SEL,o);toast(r,'');FORGE_MERGE=false;forgeRender()};
window.forgeClear=function(){FORGE_SEL=null;FORGE_MERGE=null;forgeRender()};
window.fDiscard=fDiscard;window.FORGE_DRAG=FORGE_DRAG;
window.fBlankList=function(){return B.slice()};
window.fVault=fVault;window.fPower=fPower;window.fRarity=fRarity;window.fAffNames=fAffNames;window.fShow=fShow;window.fComboName=fComboName;
window.fLapisAdd=fLapisAdd;window.fIronAdd=fIronAdd;window.fBSAdd=fBSAdd;
window.fPlantPlot=fPlantPlot;window.fHarvestPlot=fHarvestPlot;window.fPlotP=fPlotP;
window.fExpAdd=fExpAdd;window.fEnchPool=fEnchPool;window.FORGE_SEL=function(){return FORGE_SEL};window.fRename=fRename;window.fHmSnd=fHmSnd;window.fHmNext=fHmNext;window.fHmStart=fHmStart;window.fHmOp=fHmOp;window.fHmCalm=fHmCalm;window.fHmFinish=fHmFinish;window.fHmFold=fHmFold;window.fHmQuench=fHmQuench;window.fHmBlade=fHmBlade;window.fHmClose=fHmClose;window.fHmR=fHmR;window.FH=function(){return FH};window.fConvert=fConvert;window.fConvDo=fConvDo;window.fEnchantTarget=fEnchantTarget;window.fEnchantDo=fEnchantDo;window.fAscend=fAscend;window.fSyncOut=fSyncOut;window.fSyncIn=fSyncIn;window.fExp=fExp;window.fElv=fElv;window.fLexAdd=fLexAdd;
window.fFiltT=fFiltT;window.fFiltR=fFiltR;window.fFiltQ=fFiltQ;window.fFiltS=fFiltS;window.fFiltClear=fFiltClear;
window.fMaybeDrop=fMaybeDrop;window.fImportPurchased=function(ids){
  var vault=fVault(),got=[];var have={};for(var i=0;i<vault.length;i++)have[vault[i].b]=1;
  for(var j=0;j<ids.length;j++){var b=ids[j];if(B.some(function(x){return x.id===b})&&!have[b]){vault.push(fNew(b));got.push(b)}}
  if(got.length){fVaultSave(vault);return got}return[];
};
})();
