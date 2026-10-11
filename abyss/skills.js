(function(){
var ABY=window.ABY=window.ABY||{};
var PD=ABY.PD;
var ENMX=ABY.ENMX;
var IT=ABY.IT;
var FIRE_T=ABY.FIRE_T;
var FLOW_T=ABY.FLOW_T;
var WARD_T=ABY.WARD_T;
var STN=ABY.STN;
var S=ABY.S;
var P=ABY.P;
var rr=ABY.rr;
var ri=ABY.ri;
var RD=ABY.RD;
var sg=ABY.sg;
var cl=ABY.cl;
var ds=ABY.ds;
var upVal=ABY.upVal;
var pool=ABY.pool;
var skBy=ABY.skBy;
var upBy=ABY.upBy;
function shake(){return ABY.shake.apply(this,arguments)}
function freeze(){return ABY.freeze.apply(this,arguments)}
function burst(){return ABY.burst.apply(this,arguments)}
function hitFx(){return ABY.hitFx.apply(this,arguments)}
function floatS(){return ABY.floatS.apply(this,arguments)}
function dmgNum(){return ABY.dmgNum.apply(this,arguments)}
function damage(){return ABY.damage.apply(this,arguments)}
var beep=ABY.beep;
function killMob(){return ABY.killMob.apply(this,arguments)}
function hitMob(){return ABY.hitMob.apply(this,arguments)}









function gainEn(v){
  if(!P.al)return;
  var mul=1+upVal('nrg')/100;
  P.en=Math.min(ENMX,P.en+v*mul);
}
function spendEn(v){
  if(P.en<v)return 0;
  P.en-=v;
  return 1;
}
function skReady(i){
  var k=P.sk[i];
  if(!k)return 0;
  var d=skBy(k);
  if(!d)return 0;
  var cd=d.cd*(1-upVal('cdr')/100)*(S.bless==='i_magnumopus'?0.8:1);
  return P.scd[i]<=0&&P.en>=d.e?1:0;
}
function updCD(dt){
  for(var i=0;i<2;i++)if(P.scd[i]>0)P.scd[i]=Math.max(0,P.scd[i]-dt);
}
function castSkill(i){
  var k=P.sk[i],d=skBy(k);
  if(!d)return 0;
  var cd=d.cd*(1-upVal('cdr')/100)*(S.bless==='i_magnumopus'?0.8:1);
  if(P.scd[i]>0)return 0;
  if(!spendEn(d.e)){floatS(P.x+P.w/2,P.y-8,'能量不足','#ff5c7a',12);beep(110,0.08,0.04,true);return 0}
  P.scd[i]=cd;
  floatS(P.x+P.w/2,P.y-14,d.n,'#5ad1ff',13);
  beep(523,0.09,0.06);
  S.msg=d.n;S.msgt=1.1;
  switch(k){
    case 'dash':return skDash(d);
    case 'wave':return skWave(d);
    case 'quake':return skQuake(d);
    case 'guard':return skGuard(d);
    case 'heal':return skHeal(d);
    case 'slow':return skSlow(d);
  }
  return 0;
}
function skDash(){
  var dir=P.fc,dist=190;
  P.vx=dir*880;
  P.vy=Math.min(P.vy,-60);
  P.it=Math.max(P.it,0.35);
  P.ac=0.2;
  var dmg=Math.round((PD+16)*1.0),hits=0;
  for(var k=0;k<4;k++)hitFx(P.x+P.w/2-dir*k*30,P.y+rr(4,26),'#5ad1ff',3,-dir*160,rr(-60,20));
  freeze(0.06);shake(8);
  for(var i=0;i<S.mo.length;i++){var m=S.mo[i];
    if(m.dd)continue;
    if(ds(m.x,m.y,P.x+P.w/2,P.y+P.h/2)<120){
      var crt=RD()<0.08+upVal('crt')/100;
      var d2=crt?Math.round(dmg*2):dmg;
      m.hp-=d2;hitMob(m,P.x+P.w/2);
      dmgNum(m.x,m.y-m.r-6,d2,crt?1:0);
      S.dmg+=d2;S.summ.dmg+=d2;
      hits++;
      if(m.hp<=0)killMob(m,'dash');
      if(hits>=3)break;
    }
  }
  if(hits)gainEn(8);
  return 1;
}
function skWave(){
  var y=P.y+P.h*0.42,dmg=Math.round((PD+10)*1.0);
  for(var i=0;i<3;i++){
    S.bu.push({x:P.x+P.w/2+(P.fc>0?18:-18),y:y+i*12-12,
      vx:P.fc*(430+i*40),vy:(i-1)*26,r:6,l:1.9,own:1,d:dmg+i*3});
  }
  freeze(0.05);shake(6);beep(440,0.08,0.06);
  return 1;
}
function skQuake(){
  var dmg=Math.round((PD+8)*1.0);
  P.vy=Math.max(P.vy,260);
  S.fx.push({x:P.x+P.w/2,y:P.y+P.h,l:0.5,m:0.5,ring:1,r0:8,r1:150,c:'#c8a84a',k:3});
  freeze(0.08);shake(12);beep(98,0.22,0.1,true);
  for(var i=0;i<S.mo.length;i++){var m=S.mo[i];
    if(m.dd)continue;
    var dx=Math.abs(m.x-(P.x+P.w/2));
    if(dx<150&&Math.abs(m.y-(P.y+P.h))<120){
      m.hp-=dmg;hitMob(m,P.x+P.w/2);
      m.ky=-260;m.kx=sg(m.x-(P.x+P.w/2)||1)*420;
      dmgNum(m.x,m.y-m.r-6,dmg,0);
      S.dmg+=dmg;S.summ.dmg+=dmg;
      if(m.hp<=0)killMob(m,'quake');
    }
  }
  return 1;
}
function skGuard(){
  P.guard=WARD_T*0.46;
  floatS(P.x+P.w/2,P.y-24,'铁壁','#5ad1ff',14);
  beep(196,0.3,0.08,true);
  return 1;
}
function skHeal(){
  var h=35;
  P.hp=Math.min(P.mx,P.hp+h);
  P.burn=0;
  floatS(P.x+P.w/2,P.y-24,'+'+h,'#7ad08a',16);
  burst(P.x+P.w/2,P.y+P.h/2,14,'#7ad08a',0.6);
  beep(659,0.18,0.07);
  return 1;
}
function skSlow(){
  P.slow=2.6;
  floatS(P.x+P.w/2,P.y-24,'时缓','#9ad1ff',14);
  beep(880,0.35,0.05);
  return 1;
}
function drinkPot(i){
  var p=S.pots[i];
  if(!p||p.c<=0)return 0;
  p.c--;
  S.summ.pots++;
  S.potUsed[p.k]=(S.potUsed[p.k]||0)+1;
  switch(p.ef){
    case 'fire':P.burn=0;P.fire=FIRE_T;paraFire();break;
    case 'flow':P.flow=FLOW_T;break;
    case 'ward':P.ward=WARD_T;break;
    case 'elixir':P.hp=P.mx;P.burn=0;P.guard=Math.max(P.guard,2);break;
  }
  floatS(P.x+P.w/2,P.y-30,p.n,'#ffd60a',13);
  burst(P.x+P.w/2,P.y+P.h/2,12,'#ffd60a',0.5);
  beep(587,0.16,0.07);
  return 1;
}
function paraFire(){
  for(var i=0;i<S.mo.length;i++){var m=S.mo[i];
    if(m.dd)continue;
    if(ds(m.x,m.y,P.x+P.w/2,P.y+P.h/2)<180){
      m.bt=(m.bt||0)+1;
      m.burn=4;
      m.hp-=8;
      dmgNum(m.x,m.y-m.r-4,8,0);
      if(m.hp<=0)killMob(m,'fire');
    }
  }
}
function throwPot(i){
  var p=S.pots[i];
  if(!p||p.c<=0)return 0;
  p.c--;
  S.summ.pots++;
  S.potUsed[p.k]=(S.potUsed[p.k]||0)+1;
  S.bu.push({x:P.x+P.w/2,y:P.y+6,vx:P.fc*430,vy:-150,r:7,l:2.6,own:3,sp:'pot',pot:p.ef,d:20});
  beep(330,0.08,0.05);
  return 1;
}
function updPot(dt){
  if(P.guard>0)P.guard-=dt;
  if(P.flow>0)P.flow-=dt;
  if(P.ward>0)P.ward-=dt;
  if(P.slow>0)P.slow-=dt;
  if(P.fire>0)P.fire-=dt;
}
function updMobBurn(dt){
  for(var i=0;i<S.mo.length;i++){var m=S.mo[i];
    if(m.dd||!m.burn)continue;
    m.burn-=dt;
    m.bt=(m.bt||0)+dt;
    if(m.bt>=0.4){
      m.bt=0;
      m.hp-=4;
      hitFx(m.x,m.y,'#ff7a6b',3,rr(-40,40),rr(-80,-20));
      if(m.hp<=0)killMob(m,'burn');
    }
  }
}
function openPick(){
  var c=pool(S.up,3);
  if(!c.length){S.st=STN.T;S.trt=1.0;S.trd=1.0;return}
  S.psel=c.slice();
  S.psel2=0;
  S.pickT=0;
  S.st=STN.S;
}
function applyPick(i){
  var u=S.psel[i];
  if(!u)return;
  S.up[u.k]=(S.up[u.k]||0)+1;
  S.summ.up++;
  if(u.k==='vit'){P.mx=100+upVal('vit');P.hp+=12}
  if(u.k==='jmp')P.jc=1+upVal('jmp');
  floatS(P.x+P.w/2,P.y-30,u.n+' +1','#2ee6a8',15);
  burst(P.x+P.w/2,P.y+P.h/2,16,'#2ee6a8',0.7);
  beep(784,0.2,0.07);
  S.st=STN.T;S.trt=1.0;S.trd=1.0;
}
function pickNav(d){
  if(S.st!==STN.S)return;
  var n=S.psel.length;
  S.psel2=cl(S.psel2+d,0,Math.max(0,n-1));
}

Object.assign(ABY,{gainEn:gainEn,spendEn:spendEn,skReady:skReady,updCD:updCD,castSkill:castSkill,drinkPot:drinkPot,throwPot:throwPot,updPot:updPot,updMobBurn:updMobBurn,openPick:openPick,applyPick:applyPick,pickNav:pickNav});
})();
