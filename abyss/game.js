(function(){
var ABY=window.ABY=window.ABY||{};
var G=ABY.G;
var JV=ABY.JV;
var JV2=ABY.JV2;
var HAX=ABY.HAX;
var SPB=ABY.SPB;
var SPG=ABY.SPG;
var SPMX=ABY.SPMX;
var GB=ABY.GB;
var PN=ABY.PN;
var LO=ABY.LO;
var STN=ABY.STN;
var CS=ABY.CS;
var CHG_T=ABY.CHG_T;
var BOSSEV=ABY.BOSSEV;
var SHOP=ABY.SHOP;
var OFF=ABY.OFF;
var DEF=ABY.DEF;
var SK=ABY.SK;
var MPMX=ABY.MPMX;
var S=ABY.S;
var P=ABY.P;
var cl=ABY.cl;
var rr=ABY.rr;
var RD=ABY.RD;
var upVal=ABY.upVal;
var pool=ABY.pool;
var skBy=ABY.skBy;
function buildWorld(){return ABY.buildWorld.apply(this,arguments)}
function mvMobs(){return ABY.mvMobs.apply(this,arguments)}
function spawnQ(){return ABY.spawnQ.apply(this,arguments)}
function spawnBoss(){return ABY.spawnBoss.apply(this,arguments)}
function isBossLayer(){return ABY.isBossLayer.apply(this,arguments)}
function makeDeco(){return ABY.makeDeco.apply(this,arguments)}
function aliveCount(){return ABY.aliveCount.apply(this,arguments)}
function layerClear(){return ABY.layerClear.apply(this,arguments)}
function spawnPortal(){return ABY.spawnPortal.apply(this,arguments)}
function updPortal(){return ABY.updPortal.apply(this,arguments)}
function enterMtn(){return ABY.enterMtn.apply(this,arguments)}
function buildMtn(){return ABY.buildMtn.apply(this,arguments)}
function mtnStep(){return ABY.mtnStep.apply(this,arguments)}
function nearStall(){return ABY.nearStall.apply(this,arguments)}
function buyStall(){return ABY.buyStall.apply(this,arguments)}
function rescueMobs(){return ABY.rescueMobs.apply(this,arguments)}
function playerAtk(){return ABY.playerAtk.apply(this,arguments)}
function damage(){return ABY.damage.apply(this,arguments)}
function bullets(){return ABY.bullets.apply(this,arguments)}
function updDrops(){return ABY.updDrops.apply(this,arguments)}
function updFx(){return ABY.updFx.apply(this,arguments)}
function updAtk(){return ABY.updAtk.apply(this,arguments)}
function combo(){return ABY.combo.apply(this,arguments)}
function burnTick(){return ABY.burnTick.apply(this,arguments)}
function shake(){return ABY.shake.apply(this,arguments)}
function floatS(){return ABY.floatS.apply(this,arguments)}
function burst(){return ABY.burst.apply(this,arguments)}
function updCD(){return ABY.updCD.apply(this,arguments)}
function updPot(){return ABY.updPot.apply(this,arguments)}
function updMobBurn(){return ABY.updMobBurn.apply(this,arguments)}
function castSkill(){return ABY.castSkill.apply(this,arguments)}
function drinkPot(){return ABY.drinkPot.apply(this,arguments)}
function throwPot(){return ABY.throwPot.apply(this,arguments)}
function castSpell(){return ABY.castSpell.apply(this,arguments)}
function cycleSpell(){return ABY.cycleSpell.apply(this,arguments)}
function updMp(){return ABY.updMp.apply(this,arguments)}
function spellBullets(){return ABY.spellBullets.apply(this,arguments)}
function updMobSlow(){return ABY.updMobSlow.apply(this,arguments)}
function mobSlowMul(){return ABY.mobSlowMul.apply(this,arguments)}
var beep=ABY.beep;











function layReset(hard){
  S.mo=[];S.bu=[];S.dr=[];
  S.prg=0;S.pnd=Math.min(210,68+S.lay*12);
  S.boss=null;S.bossKilled=0;S.shop=0;S.shopSel=0;
  S.pt=null;S.zone='cave';S.mtn=null;S.near=-1;S.enterT=0;
  S.layerT=0;S.noKillT=0;S.stuckT=0;
  S.spq=isBossLayer()?0:8+Math.min(24,S.lay*2);
  S.spawnTotal=S.spq+3;
  S.spt=0;
  S.evt=null;
  if(!isBossLayer()&&S.lay>1&&RD()<0.42){
    var e=ABY.EVT[(RD()*ABY.EVT.length)|0];
    S.evt=e;
    S.msg='第 '+S.lay+' 层 · '+e.n+' — '+e.d;S.msgt=2.8;
  }
  buildWorld();
  P.x=PN;P.y=S.gd-P.h;P.vx=0;P.vy=0;P.jc=1+upVal('jmp');P.gr=1;P.al2=0;P.it=1.4;
  P.hp=Math.min(P.mx,P.hp+25);
  S.cam.x=cl(P.x-S.vw*0.34,0,Math.max(0,S.wx-S.vw));
  S.cam.tx=S.cam.x;S.cam.sh=0.6;
  if(isBossLayer()){spawnBoss();S.msg='第 '+S.lay+' 层 · 渊主';S.msgt=2.6}
  else for(var i=0;i<3;i++)spawnQ();
  makeDeco();
  S.summ.lay=Math.max(S.summ.lay,S.lay);
  if(hard)for(var q=0;q<24;q++)
    S.fx.push({x:P.x+P.w/2,y:P.y+P.h/2,vx:(Math.random()*2-1)*320,vy:-Math.random()*340,l:1,m:1,s:3,c:'#5ad1ff',k:1});
}
function normalizeStaff(list){
  var n=P.slots||ABY.SLOT_BASE,out=[];
  if(!list||!list.length)return ABY.defaultStaff(n);
  for(var i=0;i<list.length&&out.length<n;i++){
    var d=ABY.spellDef(list[i]);
    if(d)out.push(list[i]);
  }
  if(!out.length)return ABY.defaultStaff(n);
  return out;
}
function setStaff(list){P.staff=normalizeStaff(list);return P.staff}
function nextLayer(){
  S.lay++;
  layReset(1);
  S.st=STN.T;S.trt=1.0;S.trd=1.0;
}
function startRun(){
  S.pl=[];S.mo=[];S.bu=[];S.dr=[];S.fx=[];
  S.lay=1;S.prg=0;S.pnd=70;S.kll=0;S.got=0;S.sc=0;S.vl=1;
  S.dmg=0;S.tkn=0;S.hit=0;S.cb=0;S.cbt=0;S.cbx=0;S.freeze=0;S.slowt=0;
  S.dead='';S.deadt=0;S.msg='';S.msgt=0;
  S.potT=0;S.throwT=0;
  S._saved=0;
  S.gold=0;S.boss=null;S.bossKilled=0;S.shop=0;S.shopSel=0;S.shopBought=null;S.shopWash=0;
  S.durmax=(S.wpn&&S.wpn.b)?100:0;
  S.dur=S.durmax;
  S.relic={frag:0,iron:0,book:0};
  S.evt=null;S.layerT=0;S.noKillT=0;S.stuckT=0;
  S.zone='cave';S.mtn=null;S.pt=null;S.near=-1;
  S.potUsed={};
  S.summ={lay:1,kill:0,got:0,dmg:0,tkn:0,cbmax:0,mats:{},time:0,pots:0,up:0,boss:0};
  S.up={};S.psel=[];
  P.mx=100+(ABY.alchOwn&&ABY.alchOwn('p_nigredo')>0?40:0);
  P.hp=P.mx;P.al=1;P.al2=0;P.vx=0;P.vy=0;P.jc=1;P.cd=0;P.it=0;P.ac=0;P.gr=1;P.fc=1;
  P.en=0;P.chg=0;P.guard=0;P.slow=0;P.burn=0;P.flow=0;P.ward=0;P.hitA=0;P.hitT=0;
  P.mp=MPMX;P.mpmx=MPMX;P.spl=0;P.spcd=0;
  P.slots=(S.wpn&&S.wpn.slots?S.wpn.slots:ABY.SLOT_BASE)+(P.slotBonus||0)+(ABY.alchOwn&&ABY.alchOwn('t_goldcrown')>0?2:0);
  P.staff=P.staff&&P.staff.length?normalizeStaff(P.staff):ABY.defaultStaff(P.slots);
  P.scd=[0,0];P.pc=0;P.bt=0;
  layReset(0);
  S.st=STN.R;
  S.lt=0;S.acc=0;
}
function update(dt,ik){
  updAtk(dt);
  if(S.freeze>0){S.freeze-=dt;return}
  S.fn++;
  combo(dt);
  burnTick(dt);
  updPot(dt);
  updMobBurn(dt);
  updCD(dt);
  updMp(dt);
  updMobSlow(dt);
  if(P.cd>0)P.cd-=dt;
  if(P.ac>0)P.ac-=dt;
  if(P.it>0)P.it-=dt;
  if(P.dn>0)P.dn-=dt;
  if(S.potT>0)S.potT-=dt;
  if(S.throwT>0)S.throwT-=dt;
  if(S.msg&&S.msgt>0)S.msgt-=dt;
  if(S.st===STN.R||S.st===STN.T){
    var kk=P.slow>0?0.45:1;
    if(S.zone==='mtn'){
      pu(dt,kk,ik);
      mtnStep(dt);
      if(ik.a&&ik.na){
        var ni=nearStall();
        if(ni>=0)buyStall(ni);
      }
    }else{
      pu(dt,kk,ik);
      mvMobs(dt*kk);
      bullets(dt*kk);
      spellBullets(dt*kk);
      updDrops(dt);
      spawnTick(dt);
      rescueMobs(dt);
      S.layerT=(S.layerT||0)+dt;
      progCheck();
      updPortal(dt);
    }
  }
  if(S.st===STN.T){
    S.trt-=dt;
    if(S.trt<=0)S.st=STN.R;
  }
  if(S.pending==='pick'&&S.st===STN.R){
    S.pending='';
    var cc=pool(S.up,3);
    if(cc.length){S.psel=cc;S.psel2=0;S.st=STN.S}
    else nextLayer();
  }
  if(S.zone==='mtn'&&S.mtn){
    for(var mi=0;mi<S.mtn.length;mi++)S.mtn[mi].ph+=dt;
  }
  S.spEvt=(S.evt&&S.evt.k==='swift')?1.3:1;
  if(S.wpn.af&&S.wpn.af.mnd&&S.st===STN.R&&S.zone==='cave')
    P.hp=Math.min(P.mx,P.hp+S.wpn.af.mnd*dt);
  if(S.evt&&S.evt.k==='calm'){
    for(var bi=0;bi<S.mo.length;bi++)if(!S.mo[bi].dd&&!S.mo[bi].slow)S.mo[bi].slow=0.2;
  }
  updFx(dt);
  if(S.hit>0)S.hit-=dt;
  if(S.sx>0)S.sx-=dt;
  S.cam.sh*=Math.pow(0.02,dt);
}
function pu(dt,kk,ik){
  var sp=((SPB+Math.min(SPMX,(S.lay-1)*SPG))*(P.flow>0?1.22:1)+upVal('mov')+(ABY.alchOwn&&ABY.alchOwn('p_albedo')>0?16:0)+(P.sp||0))*(S.spEvt||1)*(1+((S.wpn.af&&S.wpn.af.mov)||0)/100);
  var ax=(ik.r?1:0)-(ik.l?1:0);
  if(ax){P.vx+=ax*HAX*dt;P.fc=ax}
  else P.vx*=Math.pow(0.004,dt);
  P.vx=cl(P.vx,-sp,sp);
  if(ik.j&&ik.nj&&P.al){
    if(P.gr){P.vy=JV;P.gr=0;P.jc=1+upVal('jmp');P.al2=0;jumpFx('#e6edef')}
    else if(P.jc>0&&!P.al2){P.vy=JV2;P.jc--;P.al2=1;jumpFx('#5ad1ff')}
  }
  var py=P.y;
  P.vy=cl(P.vy+G*dt,-980,1500);
  P.x+=P.vx*dt*kk;
  pw();
  P.y+=P.vy*dt*kk;
  land(py);
  if(P.y>S.vh+GB){
    damage(20,0,0,'坠渊');
    P.x=cl(P.x,LO+40,S.wx-80);
    P.y=S.gd-260;P.vx=0;P.vy=0;P.gr=0;
  }
  if(ik.a&&ik.na&&P.cd<=0)playerAtk(0);
  else if(P.aHeld>=7&&P.cd<=0)playerAtk(P.chg>=CHG_T?1:0);
  if(P.aHeld>0||ik.a){
    var tgt=null,td2=1e9;
    for(var q=0;q<S.mo.length;q++){var mm=S.mo[q];
      if(mm.dd)continue;
      var ddx=Math.abs(mm.x-(P.x+P.w/2)),ddy=Math.abs(mm.y-(P.y+P.h/2));
      if(ddy<48&&ddx<td2){td2=ddx;tgt=mm}
    }
    if(tgt&&td2<96)P.fc=tgt.x>P.x+P.w/2?1:-1;
  }
  if(ik.e&&ik.ne)castSkill(0);
  if(ik.q&&ik.nq)castSkill(1);
  if(ik.tb&&ik.ntb)cycleSpell();
  if(ik.ms&&ik.nms)castSpell();
  S.cam.tx=cl(P.x+P.w/2-S.vw*0.34,0,Math.max(0,S.wx-S.vw));
}
function pw(){
  var b0=P.x,b1=P.x+P.w,wall=0;
  for(var i=0;i<S.pl.length;i++){var q=S.pl[i];
    if(P.y<q.y+q.h&&P.y+P.h>q.y){
      if(b0<q.x&&b1>q.x){P.x=q.x-P.w;wall=1}
      else if(b0<q.x+q.w&&b1>q.x+q.w){P.x=q.x+q.w;wall=1}
    }
  }
  if(wall)P.vx=0;
  if(P.x<LO)P.x=LO;
  if(P.x>S.wx-P.w)P.x=S.wx-P.w;
}
function land(py){
  var was=P.gr,gy=1e9;
  for(var j=0;j<S.pl.length;j++){var g=S.pl[j];
    if(P.x+P.w<=g.x||P.x>=g.x+g.w)continue;
    if(P.vy>=0&&P.y+P.h>=g.y&&py+P.h<=g.y+10){if(g.y<gy)gy=g.y}
    else if(P.vy<0&&py>=g.y+g.h-10&&P.y<=g.y+g.h){P.y=g.y+g.h;P.vy=0}
  }
  if(gy<1e9){P.y=gy-P.h;P.vy=0;P.gr=1;if(!was){P.jc=1+upVal('jmp');P.al2=0}}
  else if(P.vy>=0)P.gr=0;
}
function jumpFx(c){
  for(var i=0;i<7;i++)S.fx.push({x:P.x+P.w/2,y:P.y+P.h,vx:(Math.random()*2-1)*130,vy:Math.random()*70,l:0.3,m:0.3,s:2,c:c,k:1});
  shake(2);
}
function spawnTick(dt){
  if(S.spq<=0)return;
  S.spt-=dt;
  if(S.mo.length<5&&S.spt<=0){
    if(spawnQ())S.spq--;
    S.spt=0.35;
  }
}
function progCheck(){
  if(S.st!==STN.R||S.zone==='mtn')return;
  var boss=isBossLayer();
  if(boss&&S.boss&&S.boss.dd&&!S.bossKilled){S.bossKilled=1}
  if(boss&&S.bossKilled&&!S.pt){spawnPortal();return}
  if(!boss&&layerClear()&&!S.pt){spawnPortal();return}
  if(!boss&&!S.pt&&(S.noKillT||0)>25){spawnPortal();return}
  if(!boss&&!S.pt&&(S.layerT||0)>60)spawnPortal();
}
function relicAltar(){
  var f=S.relic&&S.relic.frag?S.relic.frag:0;
  if(f<2){floatS(P.x+P.w/2,P.y-30,'配方碎片不足（需 2）','#ff5c7a',13);beep(131,0.08,0.05,true);return 0}
  var c=pool(S.up,3);
  if(!c.length){floatS(P.x+P.w/2,P.y-30,'强化已满','#8a9499',13);return 0}
  S.relic.frag=f-2;
  S.psel=c;S.psel2=0;S.st=STN.S;
  beep(740,0.2,0.08);
  return 1;
}
function shopBuyKey(k){
  var it=null;
  for(var i=0;i<SHOP.length;i++)if(SHOP[i].k===k)it=SHOP[i];
  if(!it)return 0;
  if(S.shopBought&&S.shopBought[k]){floatS(P.x+P.w/2,P.y-20,'已兑换','#ff5c7a',13);return 0}
  if(S.gold<it.c){floatS(P.x+P.w/2,P.y-20,'黄金不足','#ff5c7a',13);beep(110,0.1,0.05,true);return 0}
  S.gold-=it.c;
  S.shopBought=S.shopBought||{};
  S.shopBought[k]=1;
  applyShop(k);
  if(S.mtn)for(var j=0;j<S.mtn.length;j++)if(S.mtn[j].k===k)S.mtn[j].bought=1;
  floatS(P.x+P.w/2,P.y-30,it.n,'#ffd60a',15);
  burst(P.x+P.w/2,P.y+P.h/2,18,'#ffd60a',0.7);
  beep(784,0.2,0.08);
  return 1;
}
function applyShop(k){
  switch(k){
    case 'heal':P.hp=P.mx;break;
    case 'maxhp':P.mx+=20;P.hp=Math.min(P.mx,P.hp+20);break;
    case 'life':P.mx+=25;P.hp=P.mx;break;
    case 'power':P.pw=(P.pw||0)+8;break;
    case 'wpn':P.wpw=(P.wpw||0)+6;break;
    case 'speed':P.sp=(P.sp||0)+30;break;
    case 'energy':P.mxe=(P.mxe||0)+20;P.en=P.mxe;break;
    case 'potion':
      for(var q=0;q<S.pots.length&&q<2;q++)S.pots[q].c=Math.min(5,S.pots[q].c+2);
      break;
    case 'shield':P.shd=(P.shd||0)+15;break;
    case 'slot':
      P.slotBonus=(P.slotBonus||0)+1;
      P.slots=(S.wpn&&S.wpn.slots?S.wpn.slots:ABY.SLOT_BASE)+P.slotBonus;
      floatS(P.x+P.w/2,P.y-50,'法杖槽位 '+P.slots,'#9ad1ff',14);
      break;
    case 'repair':
      S.dur=S.durmax;
      floatS(P.x+P.w/2,P.y-50,'武器已修复','#2ee6a8',14);
      break;
    case 'skill':{
      var idx=(RD()<0.5?0:1);
      var pool2=idx===0?OFF:DEF;
      var cur=P.sk[idx],alt=cur,n=0;
      do{alt=pool2[(RD()*pool2.length)|0];n++}while(alt===cur&&n<12);
      P.sk[idx]=alt;P.scd[idx]=0;
      floatS(P.x+P.w/2,P.y-50,'技能 → '+skBy(alt).n,'#5ad1ff',14);
      break;
    }
    case 'wash':
      S.up={};S.shopWash=1;
      floatS(P.x+P.w/2,P.y-50,'强化已洗练','#2ee6a8',14);
      break;
  }
}
function shopBuy(i){
  if(!S.shop||!S.shopPool)return 0;
  var it=S.shopPool[i];
  if(!it)return 0;
  return shopBuyKey(it.k);
}
function shopNext(){
  if(!S.shop)return;
  S.shop=0;
  var c=pool(S.up,3);
  if(c.length){S.psel=c;S.psel2=0;S.st=STN.S}
  else nextLayer();
}
function shopNav(d){
  if(!S.shop||!S.shopPool)return;
  S.shopSel=cl((S.shopSel||0)+d,0,S.shopPool.length-1);
}
function doPick(i){
  var u=S.psel[i];
  if(!u)return 0;
  S.up[u.k]=(S.up[u.k]||0)+1;
  S.summ.up++;
  if(u.k==='vit'){P.mx=100+upVal('vit');P.hp+=12}
  if(u.k==='jmp')P.jc=1+upVal('jmp');
  if(u.k==='rgn')P.rgn=(P.rgn||0)+1;
  S.psel=[];
  if(S.zone==='mtn'){S.st=STN.R}
  else nextLayer();
  return 1;
}
function usePot(i){
  if(S.potT>0)return 0;
  var ok=drinkPot(i);
  if(ok)S.potT=1.2;
  return ok;
}
function useThrow(i){
  if(S.throwT>0)return 0;
  var ok=throwPot(i);
  if(ok)S.throwT=1.6;
  return ok;
}
function pickAt(i){
  if(S.st!==STN.S)return 0;
  return doPick(i);
}
function pickMove(d){
  if(S.st!==STN.S)return;
  var n=S.psel.length;
  S.psel2=cl((S.psel2||0)+d,0,Math.max(0,n-1));
}
function pickEnter(){
  if(S.st!==STN.S)return 0;
  return doPick(S.psel2||0);
}

Object.assign(ABY,{layReset:layReset,startRun:startRun,update:update,nextLayer:nextLayer,setStaff:setStaff,normalizeStaff:normalizeStaff,shopBuy:shopBuy,shopBuyKey:shopBuyKey,applyShop:applyShop,relicAltar:relicAltar,shopNext:shopNext,shopNav:shopNav,doPick:doPick,usePot:usePot,useThrow:useThrow,pickAt:pickAt,pickMove:pickMove,pickEnter:pickEnter,progCheck:progCheck});
})();
