(function(){
var ABY=window.ABY=window.ABY||{};
var MPMX=ABY.MPMX;
var MPREG=ABY.MPREG;
var SPL=ABY.SPL;
var PD=ABY.PD;
var ENMX=ABY.ENMX;
var LO=ABY.LO;
var S=ABY.S;
var P=ABY.P;
var cl=ABY.cl;
var ds=ABY.ds;
var rr=ABY.rr;
var ri=ABY.ri;
var RD=ABY.RD;
var sg=ABY.sg;
var upVal=ABY.upVal;
function burst(){return ABY.burst.apply(this,arguments)}
function hitFx(){return ABY.hitFx.apply(this,arguments)}
function floatS(){return ABY.floatS.apply(this,arguments)}
function dmgNum(){return ABY.dmgNum.apply(this,arguments)}
function shake(){return ABY.shake.apply(this,arguments)}
function freeze(){return ABY.freeze.apply(this,arguments)}
function damage(){return ABY.damage.apply(this,arguments)}
function boom(){return ABY.boom.apply(this,arguments)}
var beep=ABY.beep;
function killMob(){return ABY.killMob.apply(this,arguments)}
function hitMob(){return ABY.hitMob.apply(this,arguments)}









function spellKeys(){
  if(P.staff&&P.staff.length){
    var ok=[],u=upVal?null:null;
    for(var i=0;i<P.staff.length;i++)ok.push(P.staff[i]);
    return ok;
  }
  return ['ice'];
}
function resolveCast(){
  var ks=spellKeys(),n=ks.length;
  if(!n)return {sp:'ice',mods:[],next:0};
  var i=P.spl%n,mods=[],guard=0;
  while(guard++<n&&ABY.spellDef(ks[i%n])&&ABY.spellDef(ks[i%n]).t==='mod'){
    mods.push(ks[i%n]);i++;
  }
  var sp=ks[i%n];
  var d=ABY.spellDef(sp);
  if(!d||d.t==='mod'){sp='ice';mods=[]}
  return {sp:sp,mods:mods,next:(i+1)%n};
}
function curSpell(){
  var r=resolveCast(),d=ABY.spellDef(r.sp);
  return d||SPL[0];
}
function cycleSpell(){
  var ks=spellKeys();
  P.spl=(P.spl+1)%ks.length;
  var d=curSpell();
  floatS(P.x+P.w/2,P.y-30,d.n,'#9ad1ff',14);
  S.msg='法术 → '+d.n;S.msgt=1.0;
  beep(660,0.06,0.05);
  return d;
}
function modCost(mods){
  var c=0;
  for(var i=0;i<mods.length;i++){
    var d=ABY.spellDef(mods[i]);
    if(d)c+=d.c||0;
  }
  return c;
}
function updMp(dt){
  if(P.spcd>0)P.spcd-=dt;
  if(P.mp<P.mpmx)P.mp=Math.min(P.mpmx,P.mp+MPREG*dt);
}
function castSpell(){
  if(!P.al||S.st!==1)return 0;
  if(P.spcd>0)return 0;
  var r=resolveCast(),d=ABY.spellDef(r.sp)||SPL[0];
  var cost=(d.c||0)+modCost(r.mods);
  if(P.mp<cost){floatS(P.x+P.w/2,P.y-24,'法力不足','#5ad1ff',12);beep(131,0.05,0.03,true);return 0}
  P.mp-=cost;
  P.spcd=0.42;
  var M={split:0,pierce:0,homing:0,heavy:0,n:r.mods.length};
  for(var i=0;i<r.mods.length;i++)M[r.mods[i]]=1;
  var waf=S.wpn.af||{};
  M.dmg=(1+(waf.spell||0)/100)*(M.heavy?1.8:1);
  if(ABY.alchOwn&&ABY.alchOwn('p_rubedo')>0)M.dmg*=1.3;
  M.burn=waf.burn?1:0;
  M.ice=waf.ice?1:0;
  switch(d.k){
    case 'fire':spFire(M);break;
    case 'ice':spIce(M);break;
    case 'bolt':spBolt(M);break;
  }
  P.spl=r.next;
  return 1;
}
function wallOff(b){
  var r=280;
  for(var i=0;i<S.mo.length;i++){
    var m=S.mo[i];
    if(m.dd)continue;
    var d=ds(b.x,b.y,m.x,m.y);
    if(d<r)return {x:m.x,y:m.y,d:d};
  }
  return null;
}
function homingTick(b,dt){
  if(!b.homing)return;
  var t=wallOff(b),ax=0,ay=0;
  if(t){
    var dx=t.x-b.x,dy=t.y-b.y,l=Math.sqrt(dx*dx+dy*dy)||1;
    ax=dx/l*620*dt;ay=dy/l*420*dt;
  }
  b.vx+=ax;b.vy+=ay;
  var sp=Math.sqrt(b.vx*b.vx+b.vy*b.vy),mx=b.vmax||520;
  if(sp>mx){b.vx=b.vx/sp*mx;b.vy=b.vy/sp*mx}
}
function spFire(M){
  var dmg=Math.round((26+upVal('atk')+(P.pw||0))*(M.dmg||1));
  var n=M.split?3:1;
  for(var i=0;i<n;i++){
    var ang=(n===1?0:(i-1)*0.22);
    var r=M.heavy?11:7;
    S.bu.push({x:P.fc>0?P.x+P.w+4:P.x-4,y:P.y+P.h*0.42,
      vx:P.fc*430*Math.cos(ang),vy:-90+(n===1?0:(i-1)*70),r:r,l:2.4,own:3,d:dmg,sp:'fire',
      boom:M.heavy?76:52,pierce:M.pierce?3:0,homing:M.homing,vmax:560,burn:M.burn,ice:M.ice});
  }
  beep(330,0.1,0.06);
  burst(P.x+P.w/2+P.fc*14,P.y+P.h*0.42,6,'#ff7a6b',0.3);
}
function spIce(M){
  var dmg=Math.round((16+upVal('atk')*0.6)*(M.dmg||1));
  var n=(M.split?6:3);
  for(var i=0;i<n;i++){
    S.bu.push({x:P.fc>0?P.x+P.w+4:P.x-4,y:P.y+P.h*0.4+i*(16/n)-8,
      vx:P.fc*520,vy:0,r:M.heavy?8:5,l:1.9,own:3,d:dmg,sp:'ice',
      pierce:M.pierce?3:1,homing:M.homing,vmax:600,burn:M.burn,ice:1});
  }
  beep(880,0.08,0.05);
}
function spBolt(M){
  var dmg=Math.round((22+Math.round(upVal('atk')*0.8))*(M.dmg||1));
  var chains=3+(M.split?2:0)+(M.pierce?1:0);
  var px=P.x+P.w/2,py=P.y+P.h/2,rng=300,used={},chain=0;
  S.fx.push({x:px,y:py,l:0.22,m:0.22,bolt:1,cx:px,cy:py,tx:px,ty:py,c:'#9ad1ff',k:3});
  for(var step=0;step<chains;step++){
    var best=null,bd=rng;
    for(var i=0;i<S.mo.length;i++){var m=S.mo[i];
      if(m.dd||used[i])continue;
      var dx=m.x-px,dy=m.y-py,dd=ds(m.x,m.y,px,py);
      if(dd<bd&&sg(dx)===P.fc){bd=dd;best=i}
    }
    if(best===null)break;
    used[best]=1;chain++;
    var t=S.mo[best];
    S.fx.push({x:px,y:py,l:0.2,m:0.2,bolt:1,cx:px,cy:py,tx:t.x,ty:t.y,c:'#9ad1ff',k:3});
    t.hp-=dmg;hitMob(t,px);
    dmgNum(t.x,t.y-t.r-6,dmg,0);
    S.dmg+=dmg;S.summ.dmg+=dmg;
    burst(t.x,t.y,7,'#9ad1ff',0.3);
    if(t.hp<=0)killMob(t,'bolt');
    px=t.x;py=t.y;rng=220;
  }
  if(chain){shake(4);freeze(0.03);beep(1200,0.12,0.06,true)}
  else hitFx(P.x+P.w/2+P.fc*60,P.y+P.h*0.5,'#9ad1ff',4,P.fc*80,0);
}
function spellBullets(dt){
  var w=0;
  for(var i=0;i<S.bu.length;i++){var b=S.bu[i];
    if(b.own!==3){S.bu[w++]=b;continue}
    b.l-=dt;
    if(b.l<=0||b.x<S.cam.x-200||b.x>S.wx+200||b.y>S.vh+200){if(b.sp==='fire')fireBoom(b);continue}
    if(b.sp==='pot'){
      b.vy+=520*dt;
      b.x+=b.vx*dt;b.y+=b.vy*dt;
      var pg=0;
      for(var j2=0;j2<S.pl.length;j2++){var g3=S.pl[j2];
        if(b.x>g3.x&&b.x<g3.x+g3.w&&b.y>g3.y&&b.y<g3.y+g3.h){pg=1;break}
      }
      if(pg||b.y>S.vh-70){boom(b.x,b.y,70,20,'pot');continue}
      S.fx.push({x:b.x,y:b.y,vx:rr(-30,30),vy:rr(-20,10),l:0.3,m:0.3,s:4,c:'#ffd60a',k:1});
      S.bu[w++]=b;continue;
    }
    if(b.sp==='fire'){
      if(b.homing)homingTick(b,dt);
      b.vy+=520*dt;
      b.x+=b.vx*dt;b.y+=b.vy*dt;
      var hitG=0;
      for(var j=0;j<S.pl.length;j++){var g=S.pl[j];
        if(b.x>g.x&&b.x<g.x+g.w&&b.y>g.y&&b.y<g.y+g.h){hitG=1;break}
      }
      var struck=0;
      for(var q=0;q<S.mo.length;q++){var m=S.mo[q];
        if(m.dd)continue;
        if(ds(b.x,b.y,m.x,m.y)<m.r+b.r){struck=1;break}
      }
      if(hitG||struck){fireBoom(b);continue}
      S.fx.push({x:b.x,y:b.y,vx:rr(-40,40),vy:rr(-30,10),l:0.3,m:0.3,s:Math.max(2,Math.round(b.r*0.5)),c:'#ff9a6b',k:1});
    }else{
      if(b.homing)homingTick(b,dt);
      b.x+=b.vx*dt;b.y+=b.vy*dt;
      var done=0;
      for(var k=0;k<S.pl.length;k++){var g2=S.pl[k];
        if(b.x>g2.x&&b.x<g2.x+g2.w&&b.y>g2.y&&b.y<g2.y+g2.h){done=1;break}
      }
      for(var z=0;z<S.mo.length&&!done;z++){var m2=S.mo[z];
        if(m2.dd)continue;
        if(b.hitSet&&b.hitSet[z])continue;
        if(ds(b.x,b.y,m2.x,m2.y)<m2.r+b.r){
          m2.hp-=b.d;hitMob(m2,b.x);
          if(b.ice||b.sp!=='ice')m2.slow=(m2.slow||0)+1.6;
          if(b.burn){m2.burn=4;m2.bt=0}
          dmgNum(m2.x,m2.y-m2.r-6,b.d,0);
          S.dmg+=b.d;S.summ.dmg+=b.d;
          burst(b.x,b.y,5,'#7ad1ff',0.24);
          beep(988,0.04,0.04);
          if(m2.hp<=0)killMob(m2,'ice');
          if(b.pierce>0){
            b.pierce--;
            b.hitSet=b.hitSet||{};
            b.hitSet[z]=1;
          }else done=1;
        }
      }
      if(done)continue;
    }
    S.bu[w++]=b;
  }
  S.bu.length=w;
}
function fireBoom(b){
  var r=b.boom||52;
  burst(b.x,b.y,22,'#ff7a6b',0.6,true);
  shake(7);freeze(0.05);beep(110,0.18,0.09,true);
  S.fx.push({x:b.x,y:b.y,l:0.4,m:0.4,ring:1,r0:6,r1:r,c:'#ff9a6b',k:3});
  for(var i=0;i<S.mo.length;i++){var m=S.mo[i];
    if(m.dd)continue;
    if(ds(b.x,b.y,m.x,m.y)<r+m.r){
      var dd=b.d||26;
      m.hp-=dd;hitMob(m,b.x);
      m.burn=4;m.bt=0;
      dmgNum(m.x,m.y-m.r-6,dd,0);
      S.dmg+=dd;S.summ.dmg+=dd;
      if(m.hp<=0)killMob(m,'fire');
    }
  }
}
function updMobSlow(dt){
  for(var i=0;i<S.mo.length;i++){var m=S.mo[i];
    if(m.dd||!m.slow)continue;
    m.slow-=dt;
    if(m.slow<=0){m.slow=0}
  }
}
function mobSlowMul(m){return m.slow>0?0.45:1}

Object.assign(ABY,{curSpell:curSpell,spellKeys:spellKeys,resolveCast:resolveCast,cycleSpell:cycleSpell,updMp:updMp,castSpell:castSpell,spellBullets:spellBullets,updMobSlow:updMobSlow,mobSlowMul:mobSlowMul,homingTick:homingTick});
})();
