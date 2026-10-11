(function(){
var ABY=window.ABY=window.ABY||{};
var G=ABY.G;
var LO=ABY.LO;
var PN=ABY.PN;
var PM=ABY.PM;
var EL_HP=ABY.EL_HP;
var EL_D=ABY.EL_D;
var EN_KIL=ABY.EN_KIL;
var CB_T=ABY.CB_T;
var MTL=ABY.MTL;
var FTK=ABY.FTK;
var CRT=ABY.CRT;
var CRD=ABY.CRD;
var PS=ABY.PS;
var PR=ABY.PR;
var IT=ABY.IT;
var BOSS=ABY.BOSS;
var BOSSEV=ABY.BOSSEV;
var GOLD_KILL=ABY.GOLD_KILL;
var GOLD_ELITE=ABY.GOLD_ELITE;
var GOLD_BOSS=ABY.GOLD_BOSS;
var S=ABY.S;
var P=ABY.P;
var rr=ABY.rr;
var ri=ABY.ri;
var RD=ABY.RD;
var sg=ABY.sg;
var cl=ABY.cl;
var ds=ABY.ds;
var monHp=ABY.monHp;
var monDmg=ABY.monDmg;
var pickType=ABY.pickType;
var upVal=ABY.upVal;
function damage(){return ABY.damage.apply(this,arguments)}
function burst(){return ABY.burst.apply(this,arguments)}
function shake(){return ABY.shake.apply(this,arguments)}
function floatT(){return ABY.floatT.apply(this,arguments)}
function freeze(){return ABY.freeze.apply(this,arguments)}
function floatS(){return ABY.floatS.apply(this,arguments)}
function hitFx(){return ABY.hitFx.apply(this,arguments)}
var beep=ABY.beep;
function gainEn(){return ABY.gainEn.apply(this,arguments)}









function theme(){
  var z=Math.floor((S.lay-1)/5);
  var T=[
    {a:'#0b0d0f',b:'#12161a',c:'#1b2228',g:'#5ad1ff',n:'渊底'},
    {a:'#0f0c0b',b:'#191412',c:'#241d18',g:'#ffd60a',n:'熔层'},
    {a:'#0a0e0c',b:'#101a15',c:'#16241d',g:'#2ee6a8',n:'苔窟'},
    {a:'#0d0a12',b:'#151020',c:'#1d1730',g:'#9ad1ff',n:'幽界'},
    {a:'#120a0d',b:'#1e1016',c:'#2a1620',g:'#ff7a6b',n:'血隙'}
  ];
  return T[z%T.length];
}
function makeDeco(){
  S.deco=[];
  var th=theme();
  var n=Math.floor(S.wx/90)+18;
  for(var i=0;i<n;i++){
    var x=rr(LO,S.wx);
    var w=rr(14,54),h=rr(20,110);
    var kind=RD()<0.5?0:1;
    S.deco.push({x:x,y:kind?0:S.gd-h,w:w,h:h,k:kind,c:RD()<0.6?th.b:th.c,d:rr(0.55,1)});
  }
  for(var j=0;j<Math.floor(S.wx/200);j++){
    S.deco.push({x:rr(LO,S.wx),y:rr(80,S.gd-80),w:rr(40,120),h:rr(30,80),k:2,c:th.c,d:rr(0.3,0.5)});
  }
  for(var g=0;g<Math.floor(S.wx/260)+6;g++){
    S.deco.push({x:rr(LO,S.wx),y:rr(40,S.gd-40),w:0,h:0,k:3,c:th.g,d:rr(0.5,1),ph:rr(0,6.28)});
  }
}
function isBossLayer(){return S.lay%BOSSEV===0}
function bossDef(){return BOSS[Math.min(BOSS.length-1,Math.floor(S.lay/BOSSEV)-1)]||BOSS[0]}

function aliveCount(){
  var n=0;
  for(var i=0;i<S.mo.length;i++)if(!S.mo[i].dd)n++;
  return n;
}
function layerClear(){return S.spq<=0&&aliveCount()===0}
function rescueMobs(dt){
  if(S.pt)return;
  var alive=aliveCount();
  if(!alive&&S.spq<=0){S.stuckT=0;S.noKillT=0;return}
  S.noKillT=(S.noKillT||0)+dt;
  var far=null,fd=0,cx=P.x+P.w/2;
  for(var i=0;i<S.mo.length;i++){
    var m=S.mo[i];
    if(m.dd)continue;
    var d=Math.abs(m.x-cx);
    if(d>fd){fd=d;far=m}
  }
  if(far&&fd>900){
    S.stuckT=(S.stuckT||0)+dt;
    if(S.stuckT>4){
      S.stuckT=0;
      pull(far,cx);
    }
  }else S.stuckT=0;
  if(S.noKillT>10){
    S.noKillT=0;
    for(var q=0;q<S.mo.length;q++){
      if(S.mo[q].dd)continue;
      pull(S.mo[q],cx);
    }
    floatS(P.x+P.w/2,P.y-64,'深渊牵引','#9ad1ff',14);
    beep(196,0.18,0.06,true);
  }
}
function pull(m,cx){
  m.x=cl(cx+(m.x>cx?rr(130,320):-rr(130,320)),LO+120,S.wx-100);
  m.y=S.gd-120;
  m.vx=0;m.vy=0;m.on=0;
}
function spawnPortal(){
  if(S.pt)return S.pt;
  var cand=[];
  for(var i=1;i<S.pl.length;i++){
    var g=S.pl[i];
    if(!g||g.t===2)continue;
    for(var s=0;s<3;s++){
      var x=g.x+g.w*(0.25+s*0.25);
      if(x<LO+160||x>S.wx-120)continue;
      if(Math.abs(x-(P.x+P.w/2))<180&&Math.abs(g.y-P.y)<220)continue;
      cand.push([x,g.y-8]);
    }
  }
  if(!cand.length){
    var x2=cl(P.x+P.w/2+(RD()<0.5?260:-200),LO+200,S.wx-160);
    cand.push([x2,S.gd-8]);
  }
  var c=null,bs=1e9,cxp=P.x+P.w/2;
  for(var _k=0;_k<cand.length;_k++){var _dd=Math.abs(cand[_k][0]-cxp)+Math.abs(cand[_k][1]-P.y);if(_dd<bs){bs=_dd;c=cand[_k]}}
  S.pt={x:c[0],y:c[1],r:ABY.PT_R,ph:0,on:1};
  floatS(c[0],c[1]-70,'传送门已开启','#2ee6a8',17);
  burst(c[0],c[1]-20,26,'#2ee6a8',0.8,true);
  beep(660,0.3,0.09);beep(990,0.36,0.06);
  return S.pt;
}
function portalHit(){
  var p=S.pt;
  if(!p||!p.on)return 0;
  var cx=P.x+P.w/2,cy=P.y+P.h/2;
  return ds(cx,cy,p.x,p.y)<p.r+PR+6;
}
function updPortal(dt){
  if(!S.pt)return;
  S.pt.ph+=dt;
  if(!S.pt.on)return;
  if(S.pt.ph%0.16<dt){
    S.fx.push({x:S.pt.x+rr(-20,20),y:S.pt.y+rr(-24,24),vx:rr(-14,14),vy:rr(-46,-16),
      l:0.7,m:0.7,s:rr(1.5,3),c:'#2ee6a8',k:0});
  }
  if(portalHit())enterPortal();
}
function enterPortal(){
  if(!S.pt||!S.pt.on)return;
  S.pt.on=0;
  beep(880,0.2,0.09);
  burst(S.pt.x,S.pt.y,30,'#2ee6a8',0.9,true);
  shake(6);
  if(isBossLayer())enterMtn();
  else S.pending='pick';
}
function enterMtn(){
  S.zone='mtn';
  S.pending='';
  buildMtn();
  S.f.a=0;S.f.l=0;S.f.r=0;S.f.j=0;S.f.e=0;S.f.q=0;
  S.vk.a=0;S.vk.l=0;S.vk.r=0;S.vk.j=0;
  S.pk.a=1;S.pk.l=1;S.pk.r=1;S.pk.j=1;
  S.st=ABY.STN.T;
  S.trt=1.0;S.trd=1.0;
  S.msg='圣 山';S.msgt=2.4;
}
function buildMtn(){
  S.pl=[];S.bu=[];S.dr=[];S.mo=[];S.pt=null;S.near=-1;
  S.wx=1560;
  S.pl.push({x:LO,y:S.gd,w:S.wx-LO+420,h:Math.max(120,S.vh-S.gd+100),t:0});
  S.pl.push({x:LO,y:S.gd-120,w:200,h:16,t:1});
  S.pl.push({x:S.wx-260,y:S.gd-140,w:190,h:16,t:1});
  S.mtn=[];S.deco=[];
  var list=ABY.SHOP;
  var n=list.length,x0=300,step=(S.wx-620)/Math.max(1,n-1);
  for(var i=0;i<n;i++){
    S.mtn.push({x:Math.round(x0+i*step),y:S.gd-8,k:list[i].k,n:list[i].n,c:list[i].c,d:list[i].d,
      bought:!!(S.shopBought&&S.shopBought[list[i].k]),ph:rr(0,6.28)});
  }
  S.mtn.push({x:S.wx-330,y:S.gd-8,k:'__relic',n:'遗物祭坛',c:2,d:'消耗 2 配方碎片换一次强化',
    bought:false,ph:0,relic:1});
  S.pt={x:S.wx-120,y:S.gd-8,r:ABY.PT_R,ph:0,on:1,out:1};
  for(var k=0;k<70;k++){
    S.deco.push({x:rr(LO,S.wx),y:rr(0,S.gd*0.6),w:rr(10,26),h:rr(10,26),k:3,c:'#e6edef',d:rr(0.2,0.6),ph:rr(0,6.28)});
  }
  P.x=PN+40;P.y=S.gd-P.h;P.vx=0;P.vy=0;P.gr=1;P.al2=0;P.it=1.0;
  S.cam.x=0;S.cam.tx=0;S.cam.sh=0.7;
}
function nearStall(){
  if(S.zone!=='mtn'||!S.mtn)return -1;
  var cx=P.x+P.w/2;
  for(var i=0;i<S.mtn.length;i++){
    if(Math.abs(cx-S.mtn[i].x)<52)return i;
  }
  return -1;
}
function mtnStep(dt){
  S.near=nearStall();
  for(var i=0;i<S.mtn.length;i++)S.mtn[i].ph+=dt;
  if(S.pt&&S.pt.ph!==undefined)S.pt.ph+=dt;
  var cx=P.x+P.w/2;
  if(S.pt&&cx>S.pt.x-30){
    S.zone='cave';
    S.mtn=null;
    S.pending='pick';
    beep(880,0.2,0.09);
  }
}
function buyStall(i){
  if(S.zone!=='mtn'||!S.mtn||!S.mtn[i])return 0;
  var m=S.mtn[i];
  if(m.k==='__relic')return ABY.relicAltar();
  if(m.bought)return 0;
  return ABY.shopBuyKey(m.k);
}
function spawnBoss(){
  var x=S.px0||(P.x+520);
  x=cl(x+520,LO+200,S.wx-160);
  var m=mBoss(x,S.gd-120);
  S.boss=m;
  floatS(P.x+P.w/2,S.vh*0.3,'渊 主 降 临','#ff5c7a',22);
  beep(82,0.7,0.14,true);
  shake(18);
  return m;
}

function caveType(){
  var h=(S.lay*2654435761)>>>0;
  return (h>>>13)%3;
}
function caveInfo(){
  var t=caveType();
  if(t===0)return {n:'平缓洞厅',t:t,pl:4,ph:0.85,pw:1.25,pi:0.4};
  if(t===1)return {n:'破碎断层',t:t,pl:7,ph:1.0,pw:0.62,pi:1.6};
  return {n:'垂直裂隙',t:t,pl:3,ph:1.5,pw:0.9,pi:0.9};
}
function buildWorld(){
  S.pl=[];S.bu=[];S.dr=[];
  var lim=1180+(S.lay-1)*230;
  S.wx=lim+720;
  var ci=caveInfo();
  S.cave=ci;
  S.pl.push({x:LO,y:S.gd,w:S.wx-LO+520,h:Math.max(96,S.vh-S.gd+90),t:0});
  var np=Math.round((3+Math.min(8,Math.floor(S.lay*0.85)))*ci.pl/5);
  for(var i=0;i<np;i++)plat(rr(112,232)*ci.pw,rr(300,S.wx-360),rr(56,104)*ci.ph,16,1,46);
  var nq=Math.min(6,Math.floor((S.lay/2)*ci.pi));
  for(var q=0;q<nq;q++)pillar();
  for(var f=0;f<Math.min(34,8+S.lay*2);f++)
    S.fx.push({x:rr(0,S.vw)+Math.max(0,S.cam.x-220),y:rr(0,S.vh),vx:rr(-9,9),vy:rr(-20,-4),
      l:rr(1.6,3.2),m:3.2,s:rr(1,2.5),c:'#39464e',k:0});
}
function plat(w,x,up,h,t,gap){
  if(x<PN+240)return 0;
  for(var j=0;j<S.pl.length;j++){var g=S.pl[j];
    if(x<g.x+g.w+gap&&x+w>g.x-gap&&Math.abs((S.gd-up)-g.y)<52)return 0}
  S.pl.push({x:x,y:S.gd-up,w:w,h:h,t:t});
  return 1;
}
function pillar(){
  var cw=rr(34,58),cx=rr(520,S.wx-320),cy=S.gd-rr(88,140);
  if(cx<PN+320)return 0;
  for(var k=0;k<S.pl.length;k++){var g=S.pl[k];
    if(cx<g.x+g.w+44&&cx+cw>g.x-44&&cy<g.y+g.h+30&&cy+104>g.y-20)return 0}
  S.pl.push({x:cx,y:cy,w:cw,h:S.gd-cy,t:2});
  return 1;
}
function spawnQ(){
  var x0=P.x+P.w/2,lo=cl(x0-460,LO+80,S.wx-90),hi=cl(x0+540,LO+80,S.wx-90),cand=[];
  for(var i=1;i<S.pl.length;i++){var g=S.pl[i];
    if(!g||g.t===2)continue;
    for(var s=0;s<4;s++){
      var x=g.x+g.w*(0.15+s*0.24),y=g.y-16;
      if(x<lo||x>hi||x>S.wx-90)continue;
      if(ds(x,y,P.x+P.w/2,P.y+P.h/2)<210)continue;
      var bad=0;
      for(var q=0;q<S.mo.length;q++)if(Math.abs(S.mo[q].x-x)<46&&Math.abs(S.mo[q].y-y)<48){bad=1;break}
      if(!bad)cand.push([x,y]);
    }
  }
  if(!cand.length){
    var x1=cl(x0+(RD()<0.6?420:-280),LO+80,S.wx-90),y1=S.gd-16;
    cand.push([x1,y1]);
  }
  if(!cand.length)return 0;
  var c=cand[(RD()*cand.length)|0];
  madd(pickType(),c[0],c[1],1);
  return 1;
}
function madd(t,x,y,scale){
  var d=PM[t],el=!!d.el,sc=scale||1;
  var hp=Math.round(monHp(d.hp)*sc*(el?EL_HP:1));
  var m={t:t,x:x,y:y,vx:0,vy:0,hp:hp,mx:hp,r:d.r*(el?1.25:1),
    d:monDmg(d.d)*(el?EL_D:1),f:0,st:0,kx:0,ky:0,sd:RD()<0.5?1:-1,
    wt:rr(0.3,1.1),cd:rr(0.9,2.0),on:0,ph:rr(0,6.28),dd:0,el:el?1:0,
    chg:0,chgT:0,sc:sc,sp2:0};
  m.d=Math.round(m.d);
  S.mo.push(m);
  return m;
}
function mBoss(x,y){
  var d=bossDef();
  var hp=Math.round(monHp(d.hp));
  var m={boss:1,t:0,x:x,y:y,vx:0,vy:0,hp:hp,mx:hp,r:d.r,
    d:monDmg(d.d),f:0,st:0,kx:0,ky:0,sd:-1,wt:1,cd:2.4,on:0,ph:0,dd:0,el:1,chg:0,chgT:2,
    sc:1,sp2:0,ph2:0,bdef:d};
  S.mo.push(m);
  return m;
}
function updBoss(m,dt){
  var px=P.x+P.w/2,py=P.y+P.h/2,dx=px-m.x,dy=py-m.y,ad=Math.abs(dx);
  var d=m.bdef||bossDef();
  var frac=m.hp/m.mx,phase=frac>0.62?0:(frac>0.32?1:2);
  m.ph2=phase;
  m.sd=dx>0?1:-1;
  m.cd-=dt;
  if(m.cd<=0){
    var pick=RD();
    if(ad>230||(pick<0.3&&ad>90)){
      m.chg=rr(0.55,0.9);m.chgT=0.3;
      beep(110,0.2,0.08,true);
      floatS(m.x,m.y-m.r-14,'冲 锋','#ff7a6b',13);
    }else if(pick<0.62){
      var n=phase>=1?5:3;
      for(var i=0;i<n;i++){
        var a=Math.atan2(dy,dx)+(i-(n-1)/2)*0.3;
        S.bu.push({x:m.x+Math.cos(a)*m.r,y:m.y+Math.sin(a)*m.r*0.6,
          vx:Math.cos(a)*300,vy:Math.sin(a)*300-30,r:6,l:2.8,own:0,d:0});
      }
      beep(220,0.12,0.07);
    }else{
      for(var k=0;k<3+phase*2;k++)
        burst(m.x,m.y,6,'#ff7a6b',rr(0.3,0.6),true);
      shake(10);
      if(ds(m.x,m.y,px,py)<m.r+120)damage(m.d+3,m.x,m.y,'渊爆');
      beep(88,0.3,0.1,true);
    }
    m.cd=cl(2.6-phase*0.45-m.hp/m.mx*0.6,0.9,3);
  }
  if(m.chg>0){
    m.chg-=dt;
    m.vx=m.sd*(300+phase*40);
  }else m.vx=ad>40?m.sd*(d.sp+phase*14):0;
  if(m.chgT>0)m.chgT-=dt;
  m.x+=m.vx*dt;
  var on=0,oy=m.y;
  m.vy=cl(m.vy+G*0.7*dt,-1000,1400);
  m.y+=m.vy*dt;
  if(m.boss)for(var j=0;j<S.pl.length;j++){var g=S.pl[j];
    if(m.x>g.x-6&&m.x<g.x+g.w+6&&m.vy>=0&&oy+m.r<=g.y+8&&m.y+m.r>=g.y){m.y=g.y-m.r;m.vy=0;on=1}
  }
  m.on=on;
  if(m.x<LO+40){m.x=LO+40;m.sd=1}
  if(m.x>S.wx-40){m.x=S.wx-40;m.sd=-1}
  if(m.y>S.vh+320)m.dd=1;
}
function mSplit(m){
  if(!PM[m.t].sp2&&!m.sp2)return;
  for(var i=0;i<2;i++){
    var c=madd(0,m.x+(i?16:-16),m.y-6,Math.max(1,m.sc-1));
    c.hp=c.mx=Math.max(4,Math.round(m.mx*0.34));
    c.r=Math.max(8,m.r*0.68);
    c.d=Math.max(2,Math.round(m.d*0.6));
    c.kx=i?130:-130;c.ky=-170;c.st=0.18;
  }
}
function mAI(m,dt){
  var px=P.x+P.w/2,py=P.y+P.h/2,dx=px-m.x,ad=Math.abs(dx),dy=py-m.y,d=PM[m.t];
  var sm=(m.slow>0?0.45:1);
  dt=dt*sm;
  m.wt-=dt;
  if(m.boss){updBoss(m,dt);return}
  if(m.t===1){
    if(m.wt<=0){m.sd=ad>150?-sg(dx)||1:(RD()<0.5?1:-1);m.wt=rr(1.1,2.0)}
    m.vx=m.sd*(d.sp+S.lay*2.2);
    m.vy=m.vy*0.94+Math.sin(S.fn*0.05+m.ph)*54*dt*8;
    m.vy=cl(m.vy,-70,70);
    m.x+=m.vx*dt;m.y+=m.vy*dt;
    mbounds(m);
    return;
  }
  if(m.t===3){
    m.chgT-=dt;
    if(m.chg>0){
      m.chg-=dt;
      m.vx=m.sd*236;
      if(m.chg<=0){m.vx=0;m.chgT=rr(1.4,2.2)}
    }else{
      m.sd=dx>0?1:-1;
      if(m.on&&m.chgT<=0&&ad<380&&ad>56){m.chg=rr(0.5,0.85);m.wt=0.4}
      else m.vx=ad>26?m.sd*(d.sp+S.lay*2):0;
      if(m.on&&m.wt<=0&&dy<-30&&ad<220){m.vy=-560;m.on=0;m.wt=rr(0.8,1.4)}
    }
  }else if(m.t===2){
    m.sd=dx>0?1:-1;
    var keep=210+m.el*40;
    if(ad>keep+50)m.vx=m.sd*d.sp;
    else if(ad<keep-60)m.vx=-sg(dx)*d.sp*0.9;
    else m.vx=0;
    if(m.cd>0)m.cd-=dt;
    if(ad<680&&m.cd<=0&&Math.abs(dy)<260){
      m.cd=rr(1.5,2.4);
      var a=Math.atan2(dy,dx);
      S.bu.push({x:m.x+m.sd*15,y:m.y-2,vx:Math.cos(a)*256,vy:Math.sin(a)*256-46,r:4,l:2.6,own:0,d:0});
      beep(262,0.03,0.05);
      burst(m.x+m.sd*15,m.y,4,'#c8a84a',0.25);
    }
  }else{
    m.sd=dx>0?1:-1;
    m.vx=ad>10?m.sd*(d.sp+S.lay*2.6):0;
    if(m.on&&m.wt<=0&&dy<-30&&ad<220){m.vy=-560;m.on=0;m.wt=rr(0.7,1.3)}
    if(m.on&&dy>56&&ad<64&&m.wt<=0){m.vy=-150;m.vx=m.sd*170;m.on=0;m.wt=rr(0.9,1.6)}
  }
  m.x+=m.vx*dt;
  var oy=m.y,on=0;
  m.vy=cl(m.vy+G*0.72*dt,-980,1320);
  m.y+=m.vy*dt;
  for(var i=0;i<S.pl.length;i++){var g=S.pl[i];
    if(m.x>g.x-4&&m.x<g.x+g.w+4&&m.vy>=0&&oy+m.r<=g.y+8&&m.y+m.r>=g.y){m.y=g.y-m.r;m.vy=0;on=1}
  }
  m.on=on;
  mbounds(m);
}
function mbounds(m){
  if(m.x<LO+12){m.x=LO+12;m.sd=1}
  if(m.x>S.wx-12){m.x=S.wx-12;m.sd=-1}
  if(m.y<24)m.y=24;
  if(m.y>S.vh+100)m.y=S.vh+100;
}
function mvMobs(dt){
  for(var i=0;i<S.mo.length;i++){var m=S.mo[i];
    if(m.dd)continue;
    if(m.f>0)m.f=Math.max(0,m.f-dt*5);
    if(m.st>0){m.st-=dt;m.x+=m.kx*dt;m.y+=m.ky*dt;m.kx*=Math.pow(0.003,dt);m.ky*=Math.pow(0.004,dt)}
    else mAI(m,dt);
    touch(m);
  }
  var w=0;
  for(var j=0;j<S.mo.length;j++)if(!S.mo[j].dd)S.mo[w++]=S.mo[j];
  S.mo.length=w;
}
function touch(m){
  if(P.it>0||!P.al)return;
  if(ds(m.x,m.y,P.x+P.w/2,P.y+P.h/2)>=m.r+P.r-3)return;
  damage(m.d,m.x,m.y,'接触');
  m.kx=sg(P.x+P.w/2-m.x||1)*320;m.ky=-90;m.st=0.22;
}
function hitMob(m,src){
  var kb=1+upVal('kb')/100;
  m.kx=sg(m.x-(src||P.x+P.w/2)||P.fc)*150*kb;
  m.ky=((m.t===1||m.t===2)?-40:-80)*kb;
  m.st=0.22;
  m.f=0.13;
}
function killMob(m,by){
  if(m.dd)return 0;
  m.dd=1;
  S.noKillT=0;
  var isB=!!m.boss;
  S.kll++;
  S.prg+=isB?30:8;
  S.summ.kill++;
  S.cb++;
  S.cbt=CB_T;
  if(S.cb>S.summ.cbmax)S.summ.cbmax=S.cb;
  S.cbx=Math.min(1,S.cb/24);
  var afl=S.wpn.af||{};
  gainEn((isB?40:EN_KIL)+(afl.sol||0));
  var col=isB?(m.bdef?m.bdef.cl:'#ff5c7a'):PM[m.t].cl;
  burst(m.x,m.y,isB?46:16,col,rr(0.28,0.62),true);
  shake(isB?22:6);
  beep(isB?110:(by==='crt'?494:392),isB?0.5:0.06,isB?0.13:0.07,isB);
  freeze(isB?0.22:FTK);
  var gold=isB?GOLD_BOSS:(m.el?GOLD_ELITE:GOLD_KILL);
  if(ABY.alchOwn&&ABY.alchOwn('p_citrinitas')>0)gold=Math.round(gold*1.3);
  if(S.bless==='i_midassand')gold*=2;
  S.gold+=gold;
  floatS(m.x,m.y-m.r-20,'+'+gold+' 黄金','#ffd60a',isB?18:13);
  if(isB){
    for(var z=0;z<8;z++){
      var kk=ri(0,MTL.length-1);
      S.dr.push({x:m.x+rr(-60,60),y:m.y+rr(-40,40),vx:rr(-150,150),vy:rr(-280,-140),k:kk,on:0,ag:0.5,pull:0});
    }
    S.boss=null;
    S.prg=S.pnd;
    S.bossKilled=1;
    S.summ.boss++;
    floatS(P.x+P.w/2,S.vh*0.32,'渊 主 已 灭','#2ee6a8',22);
    S.bossKilled=1;
    for(var r2=0;r2<ABY.RELIC.length;r2++){
      var rk=ABY.RELIC[r2].k;
      S.relic[rk]=(S.relic[rk]||0)+2;
      floatS(m.x+rr(-40,40),m.y+rr(-30,10),'+'+ABY.RELIC[r2].n+' x2',ABY.RELIC[r2].c,13);
    }
    if(ABY.dropFrag&&ABY.dropFrag())floatS(m.x,m.y-m.r-40,'配方残页 · 已刻入','#ffd60a',12);
  }else{
    if(m.el){shake(10);beep(131,0.16,0.1,true)}
    var chance=(m.el?0.95:0.62)*(1+((S.wpn.af&&S.wpn.af.lut)||0)/100);
    if(chance>1)chance=1;
    var mult=(S.evt&&S.evt.k==='rich')?2:1;
    for(var c2=0;c2<mult;c2++){
      if(RD()<chance){
        var k=ri(0,MTL.length-1);
        S.dr.push({x:m.x,y:m.y,vx:rr(-80,80),vy:rr(-240,-130),k:k,on:0,ag:0.5,pull:0});
      }
    }
    var rc=m.el?[0.30,0.25,0.18]:[0.08,0.05,0.03];
    for(var r3=0;r3<ABY.RELIC.length;r3++){
      if(RD()<rc[r3]){
        var rk2=ABY.RELIC[r3].k;
        S.relic[rk2]=(S.relic[rk2]||0)+1;
        floatS(m.x+rr(-24,24),m.y-m.r-30,'+'+ABY.RELIC[r3].n,ABY.RELIC[r3].c,12);
      }
    }
    if(PM[m.t].sp2||m.sp2)mSplit(m);
  }
  return 1;
}

Object.assign(ABY,{theme:theme,makeDeco:makeDeco,isBossLayer:isBossLayer,bossDef:bossDef,spawnBoss:spawnBoss,caveType:caveType,caveInfo:caveInfo,buildWorld:buildWorld,spawnQ:spawnQ,madd:madd,mBoss:mBoss,updBoss:updBoss,mSplit:mSplit,mAI:mAI,mvMobs:mvMobs,hitMob:hitMob,killMob:killMob,aliveCount:aliveCount,layerClear:layerClear,rescueMobs:rescueMobs,spawnPortal:spawnPortal,
portalHit:portalHit,updPortal:updPortal,enterPortal:enterPortal,enterMtn:enterMtn,buildMtn:buildMtn,mtnStep:mtnStep,nearStall:nearStall,buyStall:buyStall});
})();
