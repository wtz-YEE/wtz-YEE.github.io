(function(){
var ABY=window.ABY=window.ABY||{};
var STN=ABY.STN;



const S={
  cv:null,cx:null,vw:1280,vh:668,dpr:1,gd:604,
  ra:0,lt:0,acc:0,fn:0,
  st:STN.R,
  trt:0,trd:1,
  pl:[],mo:[],bu:[],dr:[],fx:[],deco:[],
  lay:1,prg:0,pnd:70,kll:0,got:0,sc:0,spq:0,spt:0,vl:0,wx:1880,best:0,
  sx:0,hit:0,dmg:0,tkn:0,fps:60,dead:'',deadt:0,
  cam:{x:0,y:0,tx:0,sh:0},
  p:{x:0,y:0,vx:0,vy:0,w:26,h:34,r:14,hp:100,mx:100,fc:1,jc:1,cd:0,it:0,ac:0,gr:1,al:1,al2:0,
     en:0,sk:['dash','guard'],scd:[0,0],chg:0,cd2:0,guard:0,slow:0,burn:0,flow:0,ward:0,step:0,
     hitA:0,hitT:0,bstep:0,jumpT:0,
     mp:60,mpmx:60,spl:0,spcd:0,staff:null,slots:2,slotBonus:0},
  cb:0,cbt:0,cbx:0,freeze:0,slowt:0,
  gold:0,boss:null,bossKilled:0,shop:0,shopSel:0,shopBought:null,
  up:{},
  wpn:{b:'w_sword',n:'学院长剑',kind:'melee',atk:0,spd:0,ps:0,rar:0,aff:[],pw:0,af:null},
  pots:[],
  potUsed:{},
  avail:[],mpick:{},mcur:0,potSel:0,bless:null,
  pt:null,zone:'cave',mtn:null,near:-1,evt:null,relic:{},enterT:0,dur:0,durmax:0,
help:0,
  f:{l:0,r:0,j:0,a:0,e:0,q:0,ms:0,tb:0},
  vk:{l:0,r:0,j:0,a:0,e:0,q:0,ms:0},
  ptc:{j:0,a:0,e:0,q:0},
  pk:{j:0,a:0,e:0,q:0},
  shk:{on:true,ctx:null},
  dmgt:0,mtot:0,mtime:0,dtime:0,
  spend:{},
  msg:'',msgt:0,
  unlk:{},
  psel:[],psel2:0,pickT:0,
  summ:{lay:0,kill:0,got:0,dmg:0,tkn:0,cbmax:0,mats:{},time:0,pots:0,up:0,boss:0},
  bossKill:0,
  api:null
};
const P=S.p,W=S.wpn;
const up=k=>S.up[k]||0;

Object.assign(ABY,{S:S,P:P,W:W,up:up});
})();
