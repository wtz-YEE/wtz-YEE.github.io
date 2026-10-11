(function(){
var ABY=window.ABY=window.ABY||{};
var CS=ABY.CS;
var MAXS=ABY.MAXS;
var FORM=ABY.FORM;
var STN=ABY.STN;
var MTL=ABY.MTL;
var SPL=ABY.SPL;
var S=ABY.S;
var P=ABY.P;
var cl=ABY.cl;
var initSound=ABY.initSound;
var resumeSound=ABY.resumeSound;
var toggleSound=ABY.toggleSound;
function edge(){return ABY.edge.apply(this,arguments)}
function readKeys(){return ABY.readKeys.apply(this,arguments)}
function NOKEY(){return ABY.NOKEY.apply(this,arguments)}
function clearIn(){return ABY.clearIn.apply(this,arguments)}
function bindInput(){return ABY.bindInput.apply(this,arguments)}
function bindTouch(){return ABY.bindTouch.apply(this,arguments)}
function layReset(){return ABY.layReset.apply(this,arguments)}
function startRun(){return ABY.startRun.apply(this,arguments)}
function update(){return ABY.update.apply(this,arguments)}
function doPick(){return ABY.doPick.apply(this,arguments)}
function usePot(){return ABY.usePot.apply(this,arguments)}
function useThrow(){return ABY.useThrow.apply(this,arguments)}
function pickMove(){return ABY.pickMove.apply(this,arguments)}
function pickEnter(){return ABY.pickEnter.apply(this,arguments)}
function pickAt(){return ABY.pickAt.apply(this,arguments)}
function shopBuy(){return ABY.shopBuy.apply(this,arguments)}
function shopNext(){return ABY.shopNext.apply(this,arguments)}
function shopNav(){return ABY.shopNav.apply(this,arguments)}
function cycleSpell(){return ABY.cycleSpell.apply(this,arguments)}
function draw(){return ABY.draw.apply(this,arguments)}
var rdForge=ABY.rdForge;
var calcW=ABY.calcW;
var defWeapon=ABY.defWeapon;
var rdPots=ABY.rdPots;
var newSkills=ABY.newSkills;
var saveRun=ABY.saveRun;
var loadSave=ABY.loadSave;
var spellUnlocked=ABY.spellUnlocked;
function unlockedCache(){return spellUnlocked?spellUnlocked():{}}
var pendAdd=ABY.pendAdd;
var pendPots=ABY.pendPots;
var pendForge=ABY.pendForge;
function updCD(){return ABY.updCD.apply(this,arguments)}












var last=0,raf=0,running=0,prev={l:0,r:0,j:0,a:0,e:0,q:0};

function boot(cv){
  S.cv=cv;
  S.cx=cv.getContext('2d');
  if(!S.cx)return 0;
  cv.setAttribute('tabindex','-1');
  rs();
  addEventListener('resize',rs);
  addEventListener('blur',function(){clearIn();if(S.st===STN.R)S.st=STN.P});
  bindInput({
    restart:function(){if(S.st===STN.D){endRun();S.st=STN.M;buildPots();padShow(1)}},
    pause:function(){if(S.st===STN.R)S.st=STN.P;else if(S.st===STN.P)S.st=STN.R},
    sound:function(){toggleSound()},
    help:function(){S.help=S.help?0:1},
    spell:function(){if(S.st===STN.R)cycleSpell()},
    pot:function(i){if(S.st===STN.R)usePot(i>=0?i:S.potSel)},
    throwPot:function(i){if(S.st===STN.R)useThrow(i>=0?i:S.potSel)},
    menuToggle:function(i){if(S.st===STN.M)togglePot(i)},
    menuAll:function(v){if(S.st===STN.M)menuAll(v)},
    menuStart:function(){if(S.st===STN.M)beginRun()},
    pick:function(i){if(S.st===STN.M){togglePot(i);return}if(S.shop)shopBuy(i);else pickAt(i)},
    pickMove:function(d){if(S.st===STN.M){S.mcur=cl(S.mcur+d,0,Math.max(0,S.avail.length-1));return}if(S.shop)shopNav(d);else pickMove(d)},
    pickEnter:function(){if(S.st===STN.M){beginRun();return}if(S.shop)shopNext();else pickEnter()}
  });
  bindTouch({
    help:function(){S.help=S.help?0:1},
    pot:function(){usePot(S.potSel)},
    throwPot:function(){useThrow(S.potSel)},
    cyclePot:function(){S.potSel=(S.potSel+1)%Math.max(1,S.pots.length)}
  });
  initSound();
  cv.addEventListener('mousedown',onDown);
  cv.addEventListener('mouseup',onUp);
  cv.addEventListener('mouseleave',onUp);
  cv.addEventListener('contextmenu',function(e){e.preventDefault()});
  cv.addEventListener('touchstart',function(e){if(e.cancelable)e.preventDefault();onDown(e)},{passive:false});
  cv.addEventListener('mousemove',onMove);
  loadLoadout();
  S.st=STN.M;
  padShow(1);
  if(!running){running=1;raf=requestAnimationFrame(loop)}
  return 1;
}
function rs(){
  var r=S.cv.getBoundingClientRect();
  S.vw=Math.max(240,Math.round(r.width||innerWidth));
  S.vh=Math.max(200,Math.round(r.height||(innerHeight-FORM)));
  S.dpr=Math.min(2,window.devicePixelRatio||1);
  S.cv.width=Math.round(S.vw*S.dpr);
  S.cv.height=Math.round(S.vh*S.dpr);
  S.cx.setTransform(S.dpr,0,0,S.dpr,0,0);
  S.gd=S.vh-64;
  if(P.gr)P.y=S.gd-P.h;
}
function loadLoadout(){
  var vault=rdForge();
  if(vault.length){
    var best=vault[0],bp=-1;
    for(var i=0;i<vault.length;i++){
      var v=vault[i];
      var f=(v.atk||6)*2+(v.spd||6)+(Array.isArray(v.aff)?v.aff.length*4:0);
      if(f>bp){bp=f;best=v}
    }
    var w=calcW(best);
    S.wpn={b:w.b,n:w.n,kind:w.kind,atk:w.atk,spd:w.spd,ps:w.ps,rar:w.rar,aff:w.aff,pw:w.pw,af:w.af};
  }else S.wpn=Object.assign(defWeapon(),{n:'手刃',slots:ABY.SLOT_BASE});
  var sv=loadSave&&loadSave();
  S.best=(sv&&sv.best)?sv.best:0;
  S.avail=rdPots();
  if(!S.avail.length)S.mpick={};
  else for(var q=0;q<S.avail.length;q++)if(S.mpick[S.avail[q].k]===undefined)S.mpick[S.avail[q].k]=1;
  P.slots=(S.wpn&&S.wpn.slots?S.wpn.slots:ABY.SLOT_BASE)+(P.slotBonus||0)+(ABY.alchOwn&&ABY.alchOwn('t_goldcrown')>0?2:0);
  P.staff=ABY.normalizeStaff?ABY.normalizeStaff(P.staff):(P.staff||[]);
  P.staff=P.staff.length?P.staff:(ABY.defaultStaff?ABY.defaultStaff(P.slots):["ice"]);
  if(ABY.alchOwn&&ABY.alchOwn('t_cosmictear')>0&&P.staff.length<P.slots){
    var p2=ABY.unlockedList?ABY.unlockedList():[];
    for(var _c=0;_c<p2.length&&P.staff.length<P.slots;_c++){if(p2[_c].t==='atk'&&P.staff.indexOf(p2[_c].k)<0)P.staff.splice(0,0,p2[_c].k)}
  }
  buildPots();
  P.sk=newSkills();
  P.scd=[0,0];
}
function buildPots(){
  S.pots=[];
  for(var i=0;i<S.avail.length&&S.pots.length<4;i++){
    var a=S.avail[i];
    if(!S.mpick[a.k])continue;
    if(a.c<=0)continue;
    S.pots.push({k:a.k,n:a.n,ef:a.ef,c:Math.min(5,a.c)});
  }
}
function togglePot(i){
  var a=S.avail[i];
  if(!a||a.c<=0)return;
  S.mpick[a.k]=S.mpick[a.k]?0:1;
  S.mcur=i;
  buildPots();
}
function menuAll(v){
  for(var i=0;i<S.avail.length;i++)if(S.avail[i].c>0)S.mpick[S.avail[i].k]=v?1:0;
  buildPots();
}
function beginRun(){
  buildPots();
  endRun();
  padShow(0);
  startRun();
}
function padShow(v){
  try{
    var tp=document.getElementById('touchPad');
    if(tp)tp.style.display=v?'':'none';
  }catch(e){}
}
function loop(ts){
  raf=requestAnimationFrame(loop);
  if(!last){last=ts;return}
  var dt=(ts-last)/1000;last=ts;
  if(!(dt>0))dt=1/60;
  S.fps=S.fps*0.9+Math.min(120,1/dt)*0.1;
  if(dt>0.25)dt=0.25;
  S.acc+=dt;
  var n=0;
  while(S.acc>=CS&&n<MAXS){
    S.acc-=CS;n++;
    var cur=readKeys();
    var ik=edge(cur,S.pk);
    S.pk=cur;
    if(S.st===STN.P)ik=NOKEY;
    update(CS,ik);
    if(S.st===STN.D&&S.deadt<=0)S.deadt=0.0001;
  }
  if(n>=MAXS)S.acc=0;  if(S.deadt>0){S.deadt+=dt;if(S.deadt>0.9)endRun()}
  draw();
}
function onDown(e){
  var r=S.cv.getBoundingClientRect(),x=(e.clientX||0)-r.left,y=(e.clientY||0)-r.top;
  if(e&&(e.button===2||e.which===3)){
    if(S.st===STN.R&&S.cx&&e.preventDefault)e.preventDefault();
    if(S.st===STN.R)S.f.ms=1;
    return;
  }
  if(S.st===STN.M){if(staffHit(x,y))return;menuHit(x,y);return}
  if(S.st===STN.D){
    if(y>S.vh/2-30&&y<S.vh/2+70){endRun();S.st=STN.M;buildPots();padShow(1)}
    return;
  }
  if(S.st===STN.S){
    var n=S.psel.length;
    var cw=Math.min(180,(S.vw-120)/3-14),ch=132;
    var tot=n*cw+(n-1)*14,x0=S.vw/2-tot/2,y0=S.vh*0.42;
    if(y>=y0&&y<=y0+ch){
      for(var i=0;i<n;i++){
        var bx=x0+i*(cw+14);
        if(x>=bx&&x<=bx+cw){pickAt(i);return}
      }
    }
    return;
  }
  if(S.st===STN.P){S.st=STN.R;return}
  resumeSound();
}
function onUp(e){
  if(e&&(e.button===2||e.which===3)){S.f.ms=0;S.vk.ms=0}
  if(!e||e.button===undefined){S.vk.ms=0}
}
function onMove(e){
  if(S.st===STN.M){
    var r0=S.cv.getBoundingClientRect(),x0=(e.clientX||0)-r0.left,y0=(e.clientY||0)-r0.top;
    var hit=menuHit(x0,y0,1);
    return;
  }
  if(S.st!==STN.S)return;
  var r=S.cv.getBoundingClientRect(),x=(e.clientX||0)-r.left;
  var n=S.shop?(S.shopPool?S.shopPool.length:0):S.psel.length;
  var cw=Math.min(180,(S.vw-120)/3-14),tot=n*cw+(n-1)*14,x0=S.vw/2-tot/2;
  for(var i=0;i<n;i++){
    var bx=x0+i*(cw+14);
    if(x>=bx&&x<=bx+cw){
      if(S.shop)S.shopSel=i;else S.psel2=i;
    }
  }
}
function staffGeom(){
  var cw=Math.min(300,S.vw-80);
  var x=S.vw/2-cw/2;
  var n=Math.max(1,S.avail.length);
  var ch=34,gap=8,tot=n*ch+(n-1)*gap;
  var y=Math.max(96,S.vh*0.5-tot/2+16);
  var btnY=y+tot+14;
  var sy=btnY+72,py=sy+48;
  var slots=P.slots||ABY.SLOT_BASE,out=[],pool=ABY.unlockedList?ABY.unlockedList():[];
  var sw=Math.min(64,Math.floor((cw-(slots-1)*6)/Math.max(1,slots)));
  for(var i=0;i<slots;i++){
    out.push({x:x+i*(sw+6),y:sy,w:sw,h:28,i:i,k:(P.staff&&P.staff[i])||null});
  }
  var pw=Math.min(62,Math.floor((cw-(pool.length-1)*6)/Math.max(1,pool.length)));
  var pr=[];
  for(var j=0;j<pool.length;j++){
    pr.push({x:x+j*(pw+6),y:py,w:pw,h:28,i:j,k:pool[j].k,n:pool[j].n,t:pool[j].t});
  }
  return {x:x,cw:cw,sy:sy,py:py,slots:out,pool:pr};
}
function staffHit(x,y){
  if(S.st!==STN.M)return 0;
  var g=staffGeom(),i;
  for(i=0;i<g.pool.length;i++){
    var p=g.pool[i];
    if(x>=p.x&&x<=p.x+p.w&&y>=p.y&&y<=p.y+p.h){
      if(P.staff.length<(P.slots||ABY.SLOT_BASE)){P.staff.push(p.k);ABY.beep(660,0.05,0.05)}
      else ABY.floatS(S.vw/2,S.vh-40,"槽位已满",'#ff5c7a',13);
      return 1;
    }
  }
  for(i=0;i<g.slots.length;i++){
    var t=g.slots[i];
    if(x>=t.x&&x<=t.x+t.w&&y>=t.y&&y<=t.y+t.h){
      if(t.k){P.staff.splice(i,1);ABY.beep(330,0.05,0.05)}
      return 1;
    }
  }
  return 0;
}
function menuGeom(){
  var n=Math.max(1,S.avail.length);
  var cw=Math.min(300,S.vw-80),ch=34,gap=8;
  var tot=n*ch+(n-1)*gap;
  var x=S.vw/2-cw/2,y=Math.max(80,S.vh*0.5-tot/2+10);
  return {x:x,y:y,cw:cw,ch:ch,gap:gap,tot:tot,n:n};
}
function menuHit(x,y,probe){
  var g=menuGeom();
  var btnY=g.y+g.tot+16,bw=140,bh=30;
  var bl=ABY.alchBlessList?ABY.alchBlessList():[];
  if(bl.length){
    var by=66,bwd=Math.min(300,S.vw-80),e2=Math.min(96,(bwd-(bl.length-1)*8)/bl.length);
    if(y>=by&&y<=by+30){
      for(var bi=0;bi<bl.length;bi++){
        var ox=g.x+bi*(e2+8);
        if(x>=ox&&x<=ox+e2){
          if(!probe){
            if(S.bless===bl[bi][0])S.bless=null;
            else S.bless=bl[bi][0];
            if(ABY.beep)ABY.beep(660,0.05,0.05);
          }
          return 'bless'+bi;
        }
      }
      return 'bless';
    }
  }
  var allX=g.x,allY=btnY,goX=g.x+g.cw-bw,goY=btnY;
  if(y>=goY&&y<=goY+bh&&x>=goX&&x<=goX+bw){if(!probe)beginRun();return 'go'}
  if(y>=allY&&y<=allY+bh&&x>=allX&&x<=allX+bw){
    if(!probe){var any=0;for(var i=0;i<S.avail.length;i++)if(S.mpick[S.avail[i].k])any=1;menuAll(any?0:1)}
    return 'all';
  }
  for(var q=0;q<S.avail.length;q++){
    var iy=g.y+q*(g.ch+g.gap);
    if(y>=iy&&y<=iy+g.ch&&x>=g.x&&x<=g.x+g.cw){
      if(!probe)togglePot(q);else S.mcur=q;
      return 'row'+q;
    }
  }
  return null;
}
function endRun(){
  if(S._saved)return;
  S._saved=1;
  S.sc=Math.max(S.sc,S.summ.lay);
  saveRun();
  var mats=[];
  for(var k in S.summ.mats)if(Object.prototype.hasOwnProperty.call(S.summ.mats,k)){
    for(var m=0;m<MTL.length;m++)if(MTL[m][1]===k)mats.push([k,S.summ.mats[k]]);
  }
  if(mats.length)pendAdd(mats);
  pendPots();
  var rf=[];
  for(var rk in S.relic)if(Object.prototype.hasOwnProperty.call(S.relic,rk)&&S.relic[rk]>0&&rk!=='frag')rf.push([rk,S.relic[rk]]);
  if(rf.length)pendForge(rf);
}
function restart(){endRun();S.st=STN.M;buildPots();padShow(1)}
function goto(l){
  S.lay=Math.max(1,Math.min(999,l|0));
  S.prg=0;S.pnd=Math.min(210,68+S.lay*12);
  layReset(1);S.st=STN.R;
  return diag();
}

function diag(){
  return {st:S.st,lay:S.lay,hp:+P.hp.toFixed(1),mx:P.mx,x:P.x|0,y:P.y|0,vx:P.vx|0,vy:P.vy|0,
    gr:P.gr,jc:P.jc,prg:S.prg,pnd:S.pnd,kill:S.kll,got:S.got,mob:S.mo.length,drp:S.dr.length,
    blt:S.bu.length,prt:S.fx.length,cd:+P.cd.toFixed(2),it:+Math.max(0,P.it).toFixed(2),
    en:+P.en.toFixed(1),cb:S.cb,cbmax:S.summ.cbmax,sk:P.sk.slice(),scd:[+P.scd[0].toFixed(2),+P.scd[1].toFixed(2)],
    chg:+P.chg.toFixed(2),guard:+P.guard.toFixed(2),slow:+P.slow.toFixed(2),burn:+P.burn.toFixed(2),
    flow:+P.flow.toFixed(2),ward:+P.ward.toFixed(2),up:Object.assign({},S.up),wpn:S.wpn.n,wkind:S.wpn.kind,
    mp:+P.mp.toFixed(1),mpmx:P.mpmx,spl:P.spl,spell:(ABY.curSpell&&ABY.curSpell())?ABY.curSpell().k:'',
    staff:(P.staff||[]).join(','),slots:P.slots||0,
    unlocked:Object.keys(unlockedCache()).filter(function(k){return unlockedCache()[k]}).join(','),spcd:+P.spcd.toFixed(2),
    gold:S.gold,boss:S.boss?1:0,shop:S.shop?1:0,shopPool:(S.shopPool||[]).map(function(x){return x.k}).join(','),
    pots:S.pots.map(function(p){return p.k+':'+p.c}).join(','),freeze:+S.freeze.toFixed(3),
    availN:(S.avail||[]).length,avail:(S.avail||[]).map(function(a){return a.k+':'+a.c}).join(','),
    mpick:Object.keys(S.mpick||{}).filter(function(k){return S.mpick[k]}).join(','),
    potSel:S.potSel,
    zone:S.zone,pt:S.pt?1:0,ptx:S.pt?Math.round(S.pt.x):0,pty:S.pt?Math.round(S.pt.y):0,
    near:S.near,stalls:(S.mtn||[]).length,evt:S.evt?S.evt.k:'',spawnTotal:S.spawnTotal||0,
    relic:Object.keys(S.relic||{}).map(function(k){return k+':'+S.relic[k]}).join(','),
    dur:S.dur|0,durmax:S.durmax|0,
    world:S.wx|0,sc:S.sc,fps:+S.fps.toFixed(1),dmg:Math.round(S.dmg),tkn:+S.tkn.toFixed(1),
    pc:P.pc||0,al:P.al,fc:P.fc,frame:S.fn,
    summ:{lay:S.summ.lay,kill:S.summ.kill,got:S.summ.got,cbmax:S.summ.cbmax,up:S.summ.up}};
}
function key(k,d){if(S.f.hasOwnProperty(k))S.f[k]=d?1:0}
function step(n,dt){
  dt=dt||CS;n=n||1;
  for(var i=0;i<n;i++){
    var cur=readKeys();
    var ik=edge(cur,S.pk);
    S.pk=cur;
    update(dt,ik);
  }
  return diag();
}
const dev={map:function(){return S.pl},mobs:function(){return S.mo},drops:function(){return S.dr},
  bullets:function(){return S.bu},state:STN,psel:function(){return S.psel},summ:function(){return S.summ}};
window.openAbyss=boot;
window._r=diag;
window._key=key;
window._step=step;
window._dev=dev;

Object.assign(ABY,{boot:boot,loop:loop,endRun:endRun,restart:restart,goto:goto,diag:diag,staffGeom:staffGeom,staffHit:staffHit,key:key,step:step,dev:dev});
})();
