(function(){
var ABY=window.ABY=window.ABY||{};
var PD=ABY.PD;
var PC=ABY.PC;
var PS=ABY.PS;
var PR=ABY.PR;
var IT=ABY.IT;
var G=ABY.G;
var CRT=ABY.CRT;
var CRD=ABY.CRD;
var FTL=ABY.FTL;
var FTK=ABY.FTK;
var CB_T=ABY.CB_T;
var KC=ABY.KC;
var LO=ABY.LO;
var STN=ABY.STN;
var MTL=ABY.MTL;
var CHG_T=ABY.CHG_T;
var S=ABY.S;
var P=ABY.P;
var rr=ABY.rr;
var ri=ABY.ri;
var RD=ABY.RD;
var sg=ABY.sg;
var cl=ABY.cl;
var ds=ABY.ds;
var ov=ABY.ov;
var upVal=ABY.upVal;
var monDmg=ABY.monDmg;
function killMob(){return ABY.killMob.apply(this,arguments)}
function hitMob(){return ABY.hitMob.apply(this,arguments)}
function gainEn(){return ABY.gainEn.apply(this,arguments)}
var beep=ABY.beep;









function shake(a){S.sx=Math.max(S.sx,a*0.007+0.07)}
function freeze(t){if(S.freeze<t)S.freeze=t}
function freezeAdd(t){S.freeze+=t}
function hitFx(x,y,c,n,vx,vy){
  n=n||6;
  for(var i=0;i<n;i++)S.fx.push({x:x,y:y,vx:vx===undefined?rr(-170,170):vx*rr(0.5,1.2),
    vy:vy===undefined?rr(-210,40):vy*rr(0.5,1.2),l:rr(0.15,0.34),m:0.34,s:rr(1,3),c:c,k:1});
}
function burst(x,y,n,c,l,heavy){
  for(var i=0;i<n;i++)S.fx.push({x:x+rr(-6,6),y:y+rr(-8,8),vx:rr(-280,280),vy:rr(-300,60),
    l:l||0.4,m:l||0.4,s:rr(2,heavy?6:4),c:c,k:1});
}
function floatT(x,y,t,c,sz){
  S.fx.push({x:x,y:y,vx:0,vy:-48,l:0.85,m:0.85,s:sz||12,c:c,k:2,t:t,b:1});
}
function floatS(x,y,t,c,sz){
  S.fx.push({x:x,y:y,vx:0,vy:-40,l:0.9,m:0.9,s:sz||13,c:c,k:2,t:t});
}
function dmgNum(x,y,v,crt){
  var t=String(v);
  S.fx.push({x:x+rr(-5,5),y:y,vx:crt?rr(-24,24):rr(-8,8),vy:crt?-96:-72,
    l:crt?0.75:0.55,m:crt?0.75:0.55,s:crt?18:13,c:crt?'#ffd60a':'#e6edef',k:2,t:t,g:crt?1:0});
}
function playerAtk(force){
  if(P.cd>0||!P.al)return 0;
  var chg=!!force;
  var af=S.wpn.af||{crt:0,dmg:0,spd:0,ban:0,burn:0,ice:0};
  var broke=S.durmax>0&&S.dur<=0;
  var spdM=1-upVal('spd')/100-(af.spd||0)/100;
  P.cd=Math.max(0.1,PC*spdM-(chg?0.1:0));
  P.ac=chg?0.22:0.15;
  P.chg=0;
  P.aHeld=0;
  if(!broke&&S.durmax>0){
    S.dur--;
    if(S.dur<=0){
      floatS(P.x+P.w/2,P.y-40,'武器损坏','#ff5c7a',15);
      beep(110,0.3,0.1,true);shake(10);
    }
  }
  var base=PD+upVal('atk')+(P.pw||0)+(P.wpw||0)+(chg?Math.round(PD*1.25):0)+S.wpn.atk;
  if(broke)base=Math.round(base*0.45);
  var dmg=Math.round(base*(1+(af.dmg||0)/100));
  var wide=PS+upVal('rng')+S.wpn.ps+(chg?34:0);
  if(S.wpn.kind==='ranged'){
    var by=P.y+P.h*0.45;
    for(var i=0;i<(chg?3:1);i++){
      S.bu.push({x:P.fc>0?P.x+P.w+6:P.x-6,y:by-i*10+(chg?8:0),
        vx:P.fc*(chg?560:440),vy:chg?-46+i*30:0,r:5,l:1.7,own:1,d:dmg});
    }
    beep(330,0.05,0.05);
  }else{
    var bx=P.fc>0?P.x+P.w:P.x-wide;
    var bb={x:bx,y:P.y-12,w:wide,h:P.h+22};
    var got=0;
    for(var j=0;j<S.mo.length;j++){
      var m=S.mo[j];
      if(m.dd)continue;
      if(ov(bb,{x:m.x-m.r,y:m.y-m.r,w:m.r*2,h:m.r*2})){
        var crt=RD()<CRT+upVal('crt')/100+(af.crt||0)/100;
        var d2=crt?Math.round(dmg*CRD*(1+upVal('crd')/100)):dmg;
        if(af.ban)m.dmgTmp=0;
        m.hp-=d2;
        hitMob(m,P.x+P.w/2);
        if(af.burn){m.burn=4;m.bt=0}
        if(af.ice)m.slow=(m.slow||0)+1.6;
        if(crt){
          dmgNum(m.x,m.y-m.r-6,d2,1);
          shake(6);freeze(FTK*1.3);
          burst(m.x,m.y,9,'#ffd60a',rr(0.3,0.5));
          beep(660,0.07,0.06,true);
        }else{
          dmgNum(m.x,m.y-m.r-6,d2,0);
          shake(3.4);freeze(FTL);
          burst(m.x,m.y,5,'#ffd60a',rr(0.15,0.3));
          beep(392,0.045,0.05);
        }
        S.dmg+=d2;
        S.summ.dmg+=d2;
        got=1;
        if(m.hp<=0)killMob(m,crt?'crt':'melee');
      }
    }
    if(got){gainEn(6);S.sx=Math.max(S.sx,0.2);S.hit=0.12}
    else{
      var ex=P.fc>0?P.x+P.w+wide*0.8:P.x-wide*0.8;
      hitFx(ex,P.y+P.h*0.5,'#6a767d',3,P.fc*rr(40,120),rr(-40,40));
    }
  }
  P.hitA=chg?1:0.6;
  P.hitT=0.16;
  return 1;
}
function boom(x,y,r,dmg,type){
  var col=type==='ice'?'#7ad1ff':(type==='pot'?'#ffd60a':'#ff7a6b');
  burst(x,y,type==='pot'?16:22,col,0.6,true);
  shake(7);freeze(0.05);beep(type==='ice'?740:110,0.16,0.08,type!=='ice');
  S.fx.push({x:x,y:y,l:0.4,m:0.4,ring:1,r0:6,r1:r,c:col,k:3});
  var n=0;
  for(var i=0;i<S.mo.length;i++){var m=S.mo[i];
    if(m.dd)continue;
    if(ds(x,y,m.x,m.y)<r+m.r){
      var dd=dmg||26;
      m.hp-=dd;hitMob(m,x);
      if(type==='fire'){m.burn=4;m.bt=0}
      else if(type==='ice'){m.slow=(m.slow||0)+1.8}
      else if(type==='pot'){m.burn=3;m.bt=0;m.slow=(m.slow||0)+1.0}
      dmgNum(m.x,m.y-m.r-6,dd,0);
      S.dmg+=dd;S.summ.dmg+=dd;
      n++;
      if(m.hp<=0)killMob(m,type==='ice'?'ice':'fire');
    }
  }
  return n;
}
function damage(v,sx,sy,src){
  if(P.it>0||!P.al)return;
  var afd=S.wpn.af||{prt:0};
  var d=Math.max(1,Math.round(v*(P.guard>0?0.25:1)*(P.ward>0?0.6:1)*(1-(P.shd||0)/100)*(1-(afd.prt||0)/100)));
  P.hp-=d;S.tkn+=d;S.summ.tkn+=d;
  P.it=IT+upVal('inv');
  P.pc=(P.pc||0)+1;
  S.hit=0.34;S.sx=Math.max(S.sx,0.5);S.cam.sh=0.85;
  P.vx=sg(P.x+P.w/2-(sx||P.x+P.w/2-P.fc)||P.fc)*230;
  P.vy=-210;P.gr=0;
  S.cb=0;S.cbt=0;S.cbx=0;
  shake(7);
  hitFx(P.x+P.w/2,P.y+P.h/2,'#ff5c7a',8,rr(-190,190),rr(-190,60));
  floatS(P.x+P.w/2,P.y+8,'-'+d,'#ff5c7a',15);
  beep(147,0.09,0.06,true);
  gainEn(10);
  freeze(FTL*0.7);
  if(P.hp<=0){P.hp=0;P.al=0;death(src||'力竭')}
}
function burnTick(dt){
  if(P.burn<=0)return;
  P.burn-=dt;
  P.bt=(P.bt||0)+dt;
  if(P.bt>=0.5){
    P.bt=0;
    var d=3;
    P.hp-=d;S.tkn+=d;S.summ.tkn+=d;
    floatS(P.x+P.w/2+rr(-6,6),P.y,'-'+d,'#ff7a6b',12);
    hitFx(P.x+P.w/2,P.y+rr(0,20),'#ff7a6b',3,rr(-40,40),rr(-90,-30));
    if(P.hp<=0){P.hp=0;P.al=0;P.burn=0;death('灼烧')}
  }
}
function death(src){
  if(S.st===STN.D)return;
  S.st=STN.D;S.dead=src||'力竭';S.deadt=0;
  S.summ.lay=Math.max(S.summ.lay,S.lay);
  for(var q=0;q<30;q++)
    S.fx.push({x:P.x+P.w/2,y:P.y+P.h/2,vx:rr(-340,340),vy:rr(-360,60),
      l:rr(0.4,1.2),m:1.2,s:rr(2,6),c:KC[ri(0,KC.length-1)],k:1});
  shake(16);S.cam.sh=1.2;
  beep(110,0.6,0.13,true);
}
function updAtk(dt){
  if(S.f.a||S.vk.a){
    P.chg=Math.min(1.2,P.chg+dt);
    P.aHeld=(P.aHeld||0)+1;
  }else{
    P.aHeld=0;
    P.chg=Math.max(0,P.chg-dt*5);
  }
  if(P.hitT>0)P.hitT-=dt;
  if(P.hitA>0)P.hitA=Math.max(0,P.hitA-dt*4);
}
function bullets(dt){
  var w=0;
  for(var i=0;i<S.bu.length;i++){var b=S.bu[i];
    b.l-=dt;
    if(b.l<=0||b.x<LO-60||b.x>S.wx+60||b.y>S.vh+160)continue;
    b.vy+=(b.own?90:280)*dt;
    b.x+=b.vx*dt;b.y+=b.vy*dt;
    var dead=0;
    for(var j=0;j<S.pl.length;j++){var g=S.pl[j];
      if(b.x>g.x&&b.x<g.x+g.w&&b.y>g.y&&b.y<g.y+g.h){dead=1;break}
    }
    if(!dead&&b.own){
      for(var q=0;q<S.mo.length;q++){var m=S.mo[q];
        if(m.dd)continue;
        if(ds(b.x,b.y,m.x,m.y)<m.r+b.r){
          m.hp-=b.d||14;
          hitMob(m,b.x);
          dmgNum(m.x,m.y-m.r-4,b.d||14,0);
          S.dmg+=b.d||14;S.summ.dmg+=b.d||14;
          shake(2.4);freeze(FTL*0.6);
          burst(b.x,b.y,5,'#5ad1ff',0.25);
          beep(494,0.04,0.04);
          if(m.hp<=0)killMob(m,'wave');
          dead=1;break;
        }
      }
    }else if(!dead&&P.it<=0&&P.al&&!b.own){
      if(ds(b.x,b.y,P.x+P.w/2,P.y+P.h/2)<PR+b.r){
        damage(b.d||6,0,0,'弹幕');
        dead=1;
      }
    }
    if(dead){hitFx(b.x,b.y,'#ff7a6b',4,rr(-70,70),rr(-70,70));continue}
    S.bu[w++]=b;
  }
  S.bu.length=w;
}
function updDrops(dt){
  var w=0;
  for(var i=0;i<S.dr.length;i++){var d=S.dr[i];
    var px=P.x+P.w/2,py=P.y+P.h/2,dl=ds(d.x,d.y,px,py),kill=0;
    if(d.on){
      var a=2600;
      if(dl>1){d.vx+=(px-d.x)/dl*a*dt;d.vy+=(py-d.y)/dl*a*dt}
      d.vx*=Math.pow(0.5,dt);d.vy*=Math.pow(0.5,dt);
      d.x+=d.vx*dt;d.y+=d.vy*dt;
      if(ds(d.x,d.y,px,py)<36){
        S.prg+=4;S.got++;S.summ.got++;
        var mat=MTL[d.k%MTL.length];
        S.summ.mats[mat[1]]=(S.summ.mats[mat[1]]||0)+1;
        burst(d.x,d.y,7,KC[d.k%KC.length],0.4);
        floatS(d.x,d.y-10,'+4','#2ee6a8',12);
        beep(784,0.05,0.04);
        gainEn(3);
        kill=1;
      }
    }else{
      d.ag-=dt;
      if(d.ag<=0)d.on=1;
      else{
        d.vy+=G*0.45*dt;
        d.x+=d.vx*dt;d.y+=d.vy*dt;
        var gy=1e9;
        for(var j=0;j<S.pl.length;j++){var g=S.pl[j];
          if(d.x>g.x-10&&d.x<g.x+g.w+10&&g.y>=d.y-4&&g.y<gy)gy=g.y;
        }
        if(gy<1e9&&d.y>gy-11){d.y=gy-11;d.vy=0;d.vx*=0.3}
        if(d.y>S.vh+220)kill=1;
      }
    }
    if(!kill)S.dr[w++]=d;
  }
  S.dr.length=w;
}
function updFx(dt){
  var w=0;
  for(var i=0;i<S.fx.length;i++){var e=S.fx[i];
    e.l-=dt;
    if(e.l<=0)continue;
    e.x+=e.vx*dt;e.y+=e.vy*dt;
    if(e.k===1)e.vy+=620*dt;
    else if(e.k===2)e.vy+=90*dt;
    S.fx[w++]=e;
  }
  S.fx.length=w;
}
function combo(dt){
  if(S.cbt>0){S.cbt-=dt;if(S.cbt<=0){S.cb=0;S.cbx=0}}
}

Object.assign(ABY,{shake:shake,freeze:freeze,freezeAdd:freezeAdd,hitFx:hitFx,burst:burst,floatT:floatT,floatS:floatS,dmgNum:dmgNum,playerAtk:playerAtk,boom:boom,damage:damage,burnTick:burnTick,death:death,updAtk:updAtk,bullets:bullets,updDrops:updDrops,updFx:updFx,combo:combo});
})();
