(function(){
var ABY=window.ABY=window.ABY||{};
var S=ABY.S;
var STN=ABY.STN;




const KM={a:'l',arrowleft:'l',d:'r',arrowright:'r',w:'j',arrowup:'j',' ':'j',spacebar:'j',
  j:'a',x:'a',k:'a',e:'e',q:'q',c:'ms'};
const KS={l:'l',r:'r',j:'j',a:'a',e:'e',q:'q',ms:'ms'};

function readKeys(){
  var f=S.f,v=S.vk,o={};
  o.l=f.l||v.l;o.r=f.r||v.r;o.j=f.j||v.j;o.a=f.a||v.a;o.e=f.e||v.e;o.q=f.q||v.q;
  o.ms=f.ms||v.ms;o.tb=f.tb;
  return o;
}
function edge(cur,prev){
  return {l:cur.l,r:cur.r,j:cur.j,a:cur.a,e:cur.e,q:cur.q,ms:cur.ms,tb:cur.tb,
    nj:cur.j&&!prev.j,na:cur.a&&!prev.a,ne:cur.e&&!prev.e,nq:cur.q&&!prev.q,
    nms:cur.ms&&!prev.ms,ntb:cur.tb&&!prev.tb};
}
const NOKEY={l:0,r:0,j:0,a:0,e:0,q:0,ms:0,tb:0,nj:0,na:0,ne:0,nq:0,nms:0,ntb:0};
function clearIn(){
  var f=S.f,v=S.vk;
  f.l=f.r=f.j=f.a=f.e=f.q=f.ms=f.tb=0;
  v.l=v.r=v.j=v.a=v.e=v.q=v.ms=0;
}
function bindInput(hooks){
  var h=hooks||{};
  addEventListener('keydown',function(e){
    var c=e.key,k=c?c.toLowerCase():'',sh=e.shiftKey;
    if(stopKeys.indexOf(k)>=0)e.preventDefault();
    if(S.st===STN.M){
      if(k==='1'||k==='2'||k==='3'||k==='4'||k==='f'){
        var mi=(k==='f')?3:(parseInt(k,10)-1);
        if(h.menuToggle)h.menuToggle(mi);
        return;
      }
      if(k==='enter'){if(h.menuStart)h.menuStart();return}
      if(k==='a'){if(h.menuAll)h.menuAll(1);return}
      if(k==='0'){if(h.menuAll)h.menuAll(0);return}
      if(k==='h'){if(h.help)h.help();return}
      return;
    }
    var m=KM[k];
    if(m){if(!S.f[m])S.f[m]=1;return}
    if(S.st===STN.S){
      if(k==='1'){if(h.pick)h.pick(0);return}
      if(k==='2'){if(h.pick)h.pick(1);return}
      if(k==='3'){if(h.pick)h.pick(2);return}
      if(k==='arrowleft'||k==='a'){if(h.pickMove)h.pickMove(-1);return}
      if(k==='arrowright'||k==='d'){if(h.pickMove)h.pickMove(1);return}
      if(k==='enter'||k===' '){if(h.pickEnter)h.pickEnter();return}
      return;
    }
    if(k==='p'||k==='escape'){if(h.pause)h.pause();return}
    if(k==='m'){if(h.sound)h.sound();return}
    if(k==='h'){if(h.help)h.help();return}
    if(k==='tab'){e.preventDefault();if(h.spell)h.spell();return}
    if(k==='r'){if(h.restart)h.restart();return}
    if(k==='enter'){if(S.st===STN.D&&h.restart)h.restart();return}
    var n=-1;
    if(k==='1')n=0;else if(k==='2')n=1;else if(k==='3')n=2;else if(k==='f')n=3;
    if(n>=0){
      if(sh){if(h.throwPot)h.throwPot(n)}
      else if(h.pot)h.pot(n);
    }
  });
  addEventListener('keyup',function(e){
    var c=e.key,k=c?c.toLowerCase():'',m=KM[k];
    if(m)S.f[m]=0;
  });
}
var stopKeys=['arrowup','arrowleft','arrowright','arrowdown',' '];
var psel2=0;
function bindTouch(hooks){
  var d=document.getElementById('touchPad');
  if(!d)return;
  var on=('ontouchstart' in window)||(navigator&&navigator.maxTouchPoints>0);
  if(!on)return;
  d.style.display='flex';
  var bs=d.querySelectorAll('.vb');
  for(var i=0;i<bs.length;i++)(function(el){
    var k=el.getAttribute('data-k');
    if(!k)return;
    var go=function(e){
      if(e.cancelable)e.preventDefault();
      if(k==='pot'){if(hooks&&hooks.pot)hooks.pot(S.psel);if(hooks&&hooks.cyclePot)hooks.cyclePot();}
      else if(k==='throw'){if(hooks&&hooks.throwPot)hooks.throwPot(S.psel)}
      else if(k==='spell'){S.vk.ms=1}
      else if(k==='help'){if(hooks&&hooks.help)hooks.help()}
      else if(KS[k])S.vk[k]=1;
      el.classList.add('on');
    };
    var st=function(e){
      if(e.cancelable)e.preventDefault();
      if(k==='spell')S.vk.ms=0;
      else if(KS[k])S.vk[k]=0;
      el.classList.remove('on');
    };
    el.addEventListener('touchstart',go,{passive:false});
    el.addEventListener('touchend',st,{passive:false});
    el.addEventListener('touchcancel',st,{passive:false});
    el.addEventListener('mousedown',go);
    el.addEventListener('mouseup',st);
    el.addEventListener('mouseleave',st);
  })(bs[i]);
}

Object.assign(ABY,{readKeys:readKeys,edge:edge,clearIn:clearIn,bindInput:bindInput,bindTouch:bindTouch,KM:KM,KS:KS,NOKEY:NOKEY});
})();
