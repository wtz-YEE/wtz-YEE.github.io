(function(){
var ABY=window.ABY=window.ABY||{};
var ABY_KEY=ABY.ABY_KEY;
var PEND_KEY=ABY.PEND_KEY;
var POT_KEY=ABY.POT_KEY;
var FORGE_KEY=ABY.FORGE_KEY;
var POTS=ABY.POTS;
var SK=ABY.SK;
var OFF=ABY.OFF;
var DEF=ABY.DEF;
var UP=ABY.UP;
var MTYPE=ABY.PM;
var S=ABY.S;
var rr=ABY.rr;
var ri=ABY.ri;
var RD=ABY.RD;
var cl=ABY.cl;





function lget(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}}
function lset(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}

function rdForge(){
  var a=lget('wz_forge',null);
  if(!a||!Array.isArray(a))return [];
  var out=[];
  for(var i=0;i<a.length;i++){
    var v=a[i];
    if(!v||typeof v!=='object')continue;
    if(!v.b)continue;
    if(typeof v.dur==='number'&&v.dur<=0)continue;
    out.push(v);
  }
  return out;
}
var WK={w_dagger:'melee',w_sword:'melee',w_hammer:'melee',w_rifle:'ranged',w_staff:'ranged',w_bow:'ranged',
  w_scythe:'melee',w_shield:'melee',w_lance:'melee',w_shard:'melee'};
var WN={w_dagger:'守夜短刃',w_sword:'学院长剑',w_hammer:'泰拉巨锤',w_rifle:'终端步枪',w_staff:'星尘法杖',
  w_bow:'夜行弓',w_scythe:'花园锄镰',w_shield:'破碎圣盾',w_lance:'绯红长枪',w_shard:'神秘碎片刃'};
var RAR={w_shard:2,w_lance:1,w_hammer:1,w_staff:1,w_rifle:1};
function wKind(v){return WK[v.b]||'melee'}
function wName(v){return v&&v.name?v.name:(WN[v.b]||'无名')}
function wRar(v){return RAR[v.b]||0}
function calcW(v){
  var kind=wKind(v),f=v.fp||0;
  var af=Array.isArray(v.aff)?v.aff:[];
  if(!f){
    f=(v.atk||6)*2+(v.spd||6)+af.length*4;
  }
  var k=cl((f-14)/26,0,1);
  var o={kind:kind,n:wName(v),b:v.b,rar:wRar(v),pw:Math.round(f),aff:af.slice(0,4)};
  if(kind==='ranged'){o.atk=Math.round(lerp(0,7,k));o.spd=Math.round(lerp(0,0.1,k)*100)/100;o.ps=Math.round(lerp(0,24,k))}
  else{o.atk=Math.round(lerp(0,16,k));o.spd=Math.round(lerp(0,0.12,k)*100)/100;o.ps=Math.round(lerp(0,26,k))}
  o.af=calcAf(af);
  o.slots=slotOf(f);
  return o;
}
function slotOf(pw){
  var n=ABY.SLOT_BASE+Math.floor((pw||0)/ABY.SLOT_PER);
  return Math.max(ABY.SLOT_BASE,Math.min(ABY.SLOT_MAX,n));
}
function spellUnlocked(){
  var out={},a=lget('wz_alch',null);
  var bag=(a&&a.mats&&typeof a.mats==='object')?a.mats:null;
  var need={fire:'pot_heat',homing:'pot_flow',pierce:'pot_ward',bolt:'pot_elixir',split:'pot_elixir'};
  for(var k in ABY.UNLOCK){
    if(!Object.prototype.hasOwnProperty.call(ABY.UNLOCK,k))continue;
    var req=need[k];
    if(req){
      var c=(bag&&typeof bag[req]==='number')?bag[req]:0;
      out[k]=c>0;
    }else out[k]=true;
  }
  return out;
}
function unlockedList(){
  var u=spellUnlocked(),all=ABY.SPL.concat(ABY.MOD),out=[];
  for(var i=0;i<all.length;i++)if(u[all[i].k])out.push(all[i]);
  return out;
}
function spellDef(k){
  var all=ABY.SPL.concat(ABY.MOD);
  for(var i=0;i<all.length;i++)if(all[i].k===k)return all[i];
  return null;
}
function defaultStaff(n){
  var pool=unlockedList(),staff=[];
  for(var i=0;i<pool.length&&staff.length<n;i++)if(pool[i].t==='atk')staff.push(pool[i].k);
  if(!staff.length)staff.push('ice');
  var guard=0;
  while(staff.length<n&&guard++<20){
    var added=false;
    for(var j=0;j<pool.length&&staff.length<n;j++){
      if(pool[j].t==='mod'&&staff.indexOf(pool[j].k)<0){
        staff.splice(Math.max(0,staff.length-1),0,pool[j].k);
        added=true;break;
      }
    }
    if(!added)break;
  }
  return staff;
}
const AFX={
  sharp:{crt:8,t:'暴击 +8%'},
  smite:{ban:25,t:'对精英 +25%'},
  bane:{ban:25,t:'对精英 +25%'},
  fire:{burn:1,t:'攻击点燃'},
  ice:{ice:1,t:'攻击减速'},
  still:{ice:1,t:'攻击减速'},
  power:{dmg:15,t:'伤害 +15%'},
  frag:{dmg:10,t:'伤害 +10%'},
  quick:{spd:12,t:'攻速 +12%'},
  walk:{mov:10,t:'移速 +10%'},
  prot:{prt:8,t:'减伤 8%'},
  fort:{prt:10,t:'减伤 10%'},
  silk:{prt:6,t:'减伤 6%'},
  mend:{mnd:0.6,t:'每秒回复 0.6'},
  inf:{mnd:0.4,t:'每秒回复 0.4'},
  loot:{lut:25,t:'掉落 +25%'},
  garden:{lut:15,t:'掉落 +15%'},
  soul:{sol:4,t:'击杀回能 +4'},
  void:{sol:6,t:'击杀回能 +6'},
  van:{crt:5,t:'暴击 +5%'},
  bpr:{mnd:0.3,t:'每秒回复 0.3'},
  ppr:{prt:4,t:'减伤 4%'},
  fpr:{burn:1,t:'攻击点燃'},
  hunter:{crt:6,t:'暴击 +6%'},
  cmd:{ban:15,t:'对精英 +15%'},
  star:{spd:8,t:'攻速 +8%'}
};
function calcAf(aff){
  var o={crt:0,ban:0,burn:0,ice:0,dmg:0,spd:0,mov:0,prt:0,mnd:0,lut:0,sol:0,list:[]};
  for(var i=0;i<aff.length;i++){
    var id=aff[i];
    if(id&&typeof id==='object')id=id.k||id.id;
    var e=AFX[id];
    if(!e)continue;
    o.list.push(e.t);
    for(var kk in e)if(kk!=='t'&&Object.prototype.hasOwnProperty.call(e,kk))o[kk]=Math.max(o[kk]||0,e[kk]);
  }
  return o;
}
function lerp(a,b,t){return a+(b-a)*t}
function defWeapon(){return {kind:'melee',n:'手刃',b:'',rar:0,pw:0,atk:0,spd:0,ps:0,aff:[]}}

function rdPots(){
  var a=lget('wz_alch',null),out=[];
  if(!a||typeof a!=='object')return out;
  var bag=(a.mats&&typeof a.mats==='object')?a.mats:null;
  for(var i=0;i<POTS.length;i++){
    var p=POTS[i],c=0;
    if(bag&&typeof bag[p.k]==='number')c=bag[p.k];
    else if(a.pots&&typeof a.pots==='object'&&typeof a.pots[p.k]==='number')c=a.pots[p.k];
    else if(a.made&&typeof a.made==='object'&&typeof a.made[p.k]==='number')c=a.made[p.k];
    else if(typeof a[p.k]==='number')c=a[p.k];
    c=Math.max(0,Math.floor(c));
    if(c>0)out.push({k:p.k,n:p.n,ef:p.ef,c:Math.min(5,c)});
  }
  return out;
}
function pendForge(list){
  var p=lget(FORGE_KEY,null);
  if(!p||typeof p!=='object')p={mats:{},t:0};
  if(!p.mats||typeof p.mats!=='object')p.mats={};
  for(var i=0;i<list.length;i++){
    var k=list[i][0],c=Math.max(0,Math.floor(list[i][1]||0));
    if(!c)continue;
    p.mats[k]=(p.mats[k]||0)+c;
  }
  p.t=Date.now();
  lset(FORGE_KEY,p);
  return p;
}
function pendPots(){
  var used=S.potUsed;
  if(!used)return null;
  var keys=Object.keys(used).filter(function(k){return used[k]>0});
  if(!keys.length)return null;
  var p=lget(POT_KEY,null);
  if(!p||typeof p!=='object')p={pots:{},t:0};
  if(!p.pots||typeof p.pots!=='object')p.pots={};
  for(var i=0;i<keys.length;i++)p.pots[keys[i]]=(p.pots[keys[i]]||0)+used[keys[i]];
  p.t=Date.now();
  lset(POT_KEY,p);
  return p;
}
function pendAdd(mat){
  var p=lget(PEND_KEY,null);
  if(!p||typeof p!=='object')p={mats:{},t:0};
  if(!p.mats||typeof p.mats!=='object')p.mats={};
  for(var i=0;i<mat.length;i++){
    var k=mat[i][0],c=Math.max(0,Math.floor(mat[i][1]||0));
    if(!k||!c)continue;
    p.mats[k]=(p.mats[k]||0)+c;
  }
  p.t=Date.now();
  lset(PEND_KEY,p);
  return p;
}
function saveRun(){
  var a=lget(ABY_KEY,null);
  if(!a||typeof a!=='object')a={};
  a.best=Math.max(a.best||0,S.summ.lay);
  a.kill=(a.kill||0)+S.summ.kill;
  a.got=(a.got||0)+S.summ.got;
  a.runs=(a.runs||0)+1;
  a.mats=a.mats&&typeof a.mats==='object'?a.mats:{};
  for(var k in S.summ.mats)if(Object.prototype.hasOwnProperty.call(S.summ.mats,k))a.mats[k]=(a.mats[k]||0)+S.summ.mats[k];
  a.unlk=a.unlk&&typeof a.unlk==='object'?a.unlk:{};
  for(var u in S.unlk)if(Object.prototype.hasOwnProperty.call(S.unlk,u))a.unlk[u]=1;
  a.up=a.up&&typeof a.up==='object'?a.up:{};
  for(var x in S.up)if(Object.prototype.hasOwnProperty.call(S.up,x))a.up[x]=Math.max(a.up[x]||0,S.up[x]);
  a.bestCb=Math.max(a.bestCb||0,S.summ.cbmax);
  a.pots=(a.pots||0)+S.summ.pots;
  a.t=Date.now();
  lset(ABY_KEY,a);
  return a;
}
function loadSave(){
  var a=lget(ABY_KEY,null);
  if(!a||typeof a!=='object')return {best:0,kill:0,got:0,runs:0,mats:{},unlk:{},up:{},bestCb:0,pots:0};
  return a;
}
function pool(cur,count){
  var cand=[];
  for(var i=0;i<UP.length;i++){
    var u=UP[i],lv=S.up[u.k]||0;
    if(lv>=u.mx)continue;
    var w=u.m;
    if((S.up[u.k]||0)===0)w*=1.35;
    cand.push([u,w]);
  }
  var out=[];
  for(var c=0;c<count&&cand.length;c++){
    var tot=0;
    for(var j=0;j<cand.length;j++)tot+=cand[j][1];
    var r=RD()*tot,acc=0,pick=0;
    for(var q=0;q<cand.length;q++){acc+=cand[q][1];if(r<=acc){pick=q;break}}
    out.push(cand[pick][0]);
    cand.splice(pick,1);
  }
  return out;
}
function newSkills(){
  var a=OFF[(RD()*OFF.length)|0],b=DEF[(RD()*DEF.length)|0];
  if(a===b)b=DEF[(RD()*DEF.length)|0];
  return [a,b];
}
function skBy(k){for(var i=0;i<SK.length;i++)if(SK[i].k===k)return SK[i];return null}
function upBy(k){for(var i=0;i<UP.length;i++)if(UP[i].k===k)return UP[i];return null}
function alchOwn(id){var a=lget('wz_alch',null),bag=(a&&a.mats&&typeof a.mats==='object')?a.mats:null;return bag&&typeof bag[id]==='number'?bag[id]:0}
var ABYSS_FRAGS=[['p_citrinitas','四元素轮'],['p_nigredo','月铜之腐'],['p_rubedo','铅中炼金'],['p_albedo','露映月石'],['pot_elixir','三原质合'],['pot_heat','玫瑰之血'],['pot_flow','月光为引'],['pot_ward','霜雪凝甲'],['i_magnumopus','大炼成之钥'],['i_sagetear','贤者落泪'],['i_midassand','尾风成砂'],['g_passrune','钥照月开'],['b_owleye','守夜之眼'],['g_achstar','紫金成星'],['b_whitetigerfang','战砂磨牙'],['o_meteor','星尘破壳'],['m_darksteel','钳取玄铁'],['m_verdigris','网灼生锈'],['i_nigredoash','盖封煅烬'],['m_goldpure','称土炼金'],['t_whitedew','三水凝露'],['a_philosalt','滤硫成盐'],['a_coldmist','滴风成雾'],['t_goldcrown','蛇环加冕'],['t_eternalsand','砂星永恒'],['t_elixirprim','金月水灵'],['t_cosmictear','龙火焚泪']];
function dropFrag(){
  try{
    var st={};try{st=JSON.parse(localStorage.getItem('wz_abyss_frags')||'{}')}catch(e){st={}}
    for(var i=0;i<ABYSS_FRAGS.length;i++){
      var k=ABYSS_FRAGS[i][0];
      if(st[k]===undefined&&(!alchOwn||alchOwn(k)<=0)){st[k]=ABYSS_FRAGS[i][1];break}
    }
    localStorage.setItem('wz_abyss_frags',JSON.stringify(st));
    return 1;
  }catch(e){return 0}
}
var BLESS=[['i_magnumopus','贤者之引','技能冷却 -20%'],['i_ouroborosring','衔尾蛇之环','击杀恢复 5 生命'],['i_midassand','点石成金之砂','金币翻倍']];
function alchBlessList(){var r=[];for(var i=0;i<BLESS.length;i++)if(alchOwn(BLESS[i][0])>0)r.push(BLESS[i]);return r}
function upVal(k){
  var lv=S.up[k]||0;
  switch(k){
    case 'atk':return lv*6;
    case 'spd':return lv*5;
    case 'vit':return lv*12;
    case 'lch':return lv*3;
    case 'inv':return Math.round(lv*8)/100;
    case 'mov':return lv*8;
    case 'jmp':return lv;
    case 'rng':return lv*8;
    case 'nrg':return lv*8;
    case 'crt':return lv*5;
    case 'crd':return lv*10;
    case 'kb':return lv*5;
    case 'rgn':return Math.round(lv*80)/100;
    case 'cdr':return lv*4;
  }
  return 0;
}
function monHp(base){
  var e=1+(S.lay-1)*0.09;
  return Math.max(4,Math.round(base*e));
}
function monDmg(base){
  return Math.max(1,Math.round(base*(1+(S.lay-1)*0.05)));
}
function pickType(){
  var cand=[];
  for(var i=0;i<6;i++){
    var t=MTYPE[i];
    if(!t||t.min>S.lay)continue;
    var w=10;
    if(i===3)w=5+Math.min(6,S.lay);
    if(i===4)w=4+Math.min(5,S.lay*0.7);
    if(i===5)w=2+Math.min(4,(S.lay-3)*0.8);
    cand.push([i,w]);
  }
  if(!cand.length)cand.push([0,10]);
  var tot=0;
  for(var j=0;j<cand.length;j++)tot+=cand[j][1];
  var r=RD()*tot,acc=0;
  for(var q=0;q<cand.length;q++){acc+=cand[q][1];if(r<=acc)return cand[q][0]}
  return cand[0][0];
}

Object.assign(ABY,{lget:lget,lset:lset,rdForge:rdForge,wKind:wKind,wName:wName,wRar:wRar,calcW:calcW,calcAf:calcAf,AFX:AFX,slotOf:slotOf,spellUnlocked:spellUnlocked,unlockedList:unlockedList,spellDef:spellDef,defaultStaff:defaultStaff,defWeapon:defWeapon,rdPots:rdPots,pendPots:pendPots,pendForge:pendForge,pendAdd:pendAdd,saveRun:saveRun,loadSave:loadSave,pool:pool,newSkills:newSkills,skBy:skBy,upBy:upBy,upVal:upVal,alchOwn:alchOwn,dropFrag:dropFrag,ABYSS_FRAGS:ABYSS_FRAGS,BLESS:BLESS,alchBlessList:alchBlessList,monHp:monHp,monDmg:monDmg,pickType:pickType});
})();
