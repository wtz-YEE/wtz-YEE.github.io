var fs=require('fs');
var js=fs.readFileSync('D:/WTZ/prts/pages/mcratch.js','utf8');
eval(js.match(/var C=\[[^\n]*/)[0]);
eval(js.slice(js.indexOf('var B={'),js.indexOf('\nvar R=')));
var BM={};for(var i=0;i<C.length;i++){var a=B[C[i][0]];for(var j=0;j<a.length;j++)BM[a[j][0]]=a[j]}
var bk=function(id,a,c){return{id:id,a:a||[],c:c||[]}};
var nv=function(n){return['n',{ex:n}]};
var v8=function(v){return{id:'v8',a:[['v',v]],c:[]}};
var v3=function(v){return{id:'v3',a:[['v',v]],c:[]}};
var o1=function(x,y){return{id:'o1',a:[x,y],c:[]}};
var o2=function(x,y){return{id:'o2',a:[x,y],c:[]}};
var o4=function(x,y){return{id:'o4',a:[x,y],c:[]}};
var o5=function(x,y){return{id:'o5',a:[x,y],c:[]}};
var o6=function(x,y){return{id:'o6',a:[x,y],c:[]}};
var o7=function(x,y){return{id:'o7',a:[x,y],c:[]}};
var o8=function(x,y){return{id:'o8',a:[x,y],c:[]}};
var o9=function(x){return{id:'o9',a:[x],c:[]}};
var o15=function(x,y){return{id:'o15',a:[x,y],c:[]}};
var t0=function(x,y){return{id:'t0',a:[x,y],c:[]}};
var t1=function(x){return{id:'t1',a:[x],c:[]}};
var v6=function(v,k){return{id:'v6',a:[['v',v],k],c:[]}};
var blk=function(o){return['blk',o]};
// 条件简写
var turn1=blk(o15(nv('turn'),['n',1]));
var hp0=blk(o6(nv('hp'),['n',1]));
var ehp0=blk(o6(nv('ehp'),['n',1]));
var idxltlen=blk(o6(nv('idx'),blk(v8('bl'))));
var idxge=blk(o9(idxltlen));
var blen0=blk(o15(blk(v8('bl')),['n',0]));
var needLoad=blk(o8(idxge,blen0));
var notTurn=blk(o9(turn1));
var turn2=blk(o15(nv('turn'),['n',2]));
var isReal=blk(o15(blk(v6('bl',['blk',o1(nv('idx'),['n',1])])),['n',1]));
var isRealK=blk(o15(blk(v6('bl',['blk',o1(nv('idx'),['n',1])])),['n',1]));
var aiAtk=blk(o5(blk(o2(nv('real'),['n',2])),blk(o1(blk(v8('bl')),nv('idx')))));
var J=function(x){return['t',x]};
var mSh=t1(nv('sh'));
var mReal=t1(nv('real'));
var mGap=t1(blk(o1(nv('sh'),nv('real'))));
var msg1=['blk',t0(J(t0(J('装了'),J(['blk',mSh]))),J(' 发 / '))];
var msg2=['blk',t0(J(['blk',mReal]),J(' 实弹 / '))];
var msg3=['blk',t0(J(['blk',mGap]),J(' 空弹'))];
var loadSeq=[
 bk('v10',[['v','bl']]),
 bk('v1',[['v','sh'],blk(o4(['n',2],['n',6]))]),
 bk('v1',[['v','real'],blk(o4(['n',1],nv('sh')))]),
 bk('c0',[nv('real')],[bk('v4',[['v','bl'],['t',1]])]),
 bk('c0',[blk(o1(nv('sh'),nv('real')))],[bk('v4',[['v','bl'],['t',0]])]),
 bk('v1',[['v','idx'],['t',0]]),
 bk('l0',[['s',msg1]]),
 bk('l0',[['s',msg2]]),
 bk('l0',[['s',msg3]])
];
// 玩家 p1
var p1scr=[
 bk('evt0'),
 bk('v0',[['s','hp'],['y','int']]),bk('v0',[['s','ehp'],['y','int']]),bk('v0',[['s','turn'],['y','int']]),bk('v0',[['s','idx'],['y','int']]),bk('v0',[['s','sh'],['y','int']]),bk('v0',[['s','real'],['y','int']]),bk('v0',[['s','bl'],['y','list']]),
 bk('v1',[['v','hp'],['t',4]]),bk('v1',[['v','ehp'],['t',4]]),bk('v1',[['v','turn'],['t',1]]),bk('v1',[['v','idx'],['t',0]]),bk('v1',[['v','real'],['t',0]]),bk('v1',[['v','sh'],['t',0]]),
 bk('l0',[['s','恶魔轮盘赌！绿旗开始。点【自己】开枪，或点【恶魔】开枪']]),
 bk('c1',[],[
  bk('c2',[needLoad],loadSeq),
  bk('c2',[hp0],[bk('l0',[['s','你输了！恶魔赢了']]),bk('c5')]),
  bk('c2',[ehp0],[bk('l0',[['s','你赢了！恶魔倒下了']]),bk('c5')])
 ])
];
// 玩家 evt1：点自己=射自己
var p1shoot=[
 bk('evt1'),
 bk('c2',[blk(o7(turn1,idxltlen))],[
  bk('v2',[['v','idx'],['n',1]]),
  bk('c3',[isReal],[
   [bk('v2',[['v','hp'],['n',-1]]),bk('v2',[['v','real'],['n',-1]]),
    bk('l0',[['s',blk(t0(['t','你中弹了！HP='],blk(t1(nv('hp')))))]]),
    bk('c2',[hp0],[bk('l0',[['s','你输了！']]),bk('c5')]),
    bk('v1',[['v','turn'],['t',2]]),bk('evt3',[['s','恶魔回合']])],
   [bk('l0',[['s','空弹！你没事，继续开枪']])]
  ])
 ])
];
var devShoot=[
 bk('evt1'),
 bk('c2',[blk(o7(turn1,idxltlen))],[
  bk('v2',[['v','idx'],['n',1]]),
  bk('c3',[isRealK],[
   [bk('v2',[['v','ehp'],['n',-1]]),bk('v2',[['v','real'],['n',-1]]),
    bk('l0',[['s',blk(t0(['t','恶魔中弹！恶魔HP='],blk(t1(nv('ehp')))))]]),
    bk('c2',[ehp0],[bk('l0',[['s','你赢了！']]),bk('c5')])],
   [bk('l0',[['s','空弹！恶魔的回合']]),bk('v1',[['v','turn'],['t',2]]),bk('evt3',[['s','恶魔回合']])]
  ])
 ])
];
// 恶魔 evt2：恶魔回合 AI
var devAI=[
 bk('evt2',[['s','恶魔回合']]),
 bk('c6',[blk(o8(o8(o8(turn1,hp0),ehp0),idxge))],[
  bk('c3',[aiAtk],[
   [bk('v2',[['v','idx'],['n',1]]),
    bk('c3',[isReal],[
     [bk('v2',[['v','hp'],['n',-1]]),bk('v2',[['v','real'],['n',-1]]),bk('l0',[['s','恶魔射你！你掉血了']])],
     [bk('l0',[['s','恶魔射你——空弹！你的回合']]),bk('v1',[['v','turn'],['t',1]])]
    ])],
   [bk('v2',[['v','idx'],['n',1]]),
    bk('c3',[isReal],[
     [bk('v2',[['v','ehp'],['n',-1]]),bk('v2',[['v','real'],['n',-1]]),bk('l0',[['s','恶魔射自己中弹了！你的回合']]),bk('v1',[['v','turn'],['t',1]])],
     [bk('l0',[['s','恶魔射自己——空弹！它继续']])]
    ])]
  ]),
  bk('c4',[['n',0.45]]),
  bk('c2',[hp0],[bk('l0',[['s','你输了！']]),bk('c5')]),
  bk('c2',[ehp0],[bk('l0',[['s','你赢了！']]),bk('c5')])
 ])
];
var P={name:'恶魔轮盘赌',cur:'main',vars:{},vtype:{},sel:'p1',scenes:{
 main:{name:'主世界',ground:'plank',deco:[],nodes:{
  root:{id:'root',n:'根',t:'root',c:['sc0']},
  sc0:{id:'sc0',n:'主世界',t:'scene',c:['p1','dev']},
  p1:{id:'p1',n:'你',t:'sprite',r:'steve',x:85,y:110,dir:0,size:60,show:1,scr:p1scr.concat(p1shoot),c:[]},
  dev:{id:'dev',n:'恶魔',t:'sprite',r:'creeper',x:215,y:110,dir:0,size:64,show:1,scr:devShoot.concat(devAI),c:[]}
 }
}}};
// 校验
var errs=[];
(function walk(o,path){if(!o||typeof o!=='object'||!o.id)return;var def=BM[o.id];
 if(!def){errs.push('未知块 '+o.id+' @'+path);return}
 var slots=def.length-3;
 if(o.a.length!==slots)errs.push(o.id+' 槽数 '+o.a.length+'≠'+slots+' @'+path);
 if(o.id==='c3'&&(!Array.isArray(o.c[0])||!Array.isArray(o.c[1])))errs.push('c3 双分支 @'+path);
 if(o.a)for(var i=0;i<o.a.length;i++){var av=o.a[i];if(av&&av[1]&&typeof av[1]==='object'&&av[1].id)walk(av[1],path+'/'+o.id+'.a'+i);if(av&&Array.isArray(av)&&av[0]==='blk'&&av[1])walk(av[1],path+'/'+o.id+'.a'+i)}
 if(o.c)for(var j=0;j<o.c.length;j++){var cj=o.c[j];if(Array.isArray(cj))for(var k=0;k<cj.length;k++)walk(cj[k],path+'/'+o.id+'.c'+j);else walk(cj,path+'/'+o.id+'.c'+j)}
})(P,'$');
var vars={'hp':1,'ehp':1,'turn':1,'idx':1,'sh':1,'real':1,'bl':1};
(function walkV(o){if(!o||typeof o!=='object'||!o.id)return;if(o.a)for(var i=0;i<o.a.length;i++){var av=o.a[i];if(av&&av[0]==='v'&&!vars[av[1]])errs.push('未声明变量 '+av[1]+' @'+o.id);if(av&&av[1]&&typeof av[1]==='object')walkV(av[1])}if(o.c)for(var j=0;j<o.c.length;j++){var cj=o.c[j];if(Array.isArray(cj))for(var k=0;k<cj.length;k++)walkV(cj[k]);else walkV(cj)}})(P);
var out='';
if(errs.length)out='ERRORS:\n'+errs.join('\n');
else{out='OK 结构校验通过\n';
 fs.writeFileSync('D:/WTZ/prts/恶魔轮盘赌.mcratch',JSON.stringify(P,null,1),'utf8');
 out+='written '+fs.statSync('D:/WTZ/prts/恶魔轮盘赌.mcratch').size+' bytes';
}
fs.writeFileSync('D:/WTZ/prts/_res.txt',out,'utf8');