var C=[['evt','事件','#FFCF00'],['mot','运动','#4C97FF'],['look','外观','#9966FF'],['snd','声音','#CF8E60'],['ctl','控制','#FFAB19'],['sen','侦测','#59C1B6'],['ops','运算','#59C034'],['str','字符串','#5C7CFA'],['var','变量','#FF6680'],['nod','节点','#6BBE45']];
var B={evt:[['evt0','当 ⚑ 点击','hat'],['evt1','当 角色被点击','hat'],['evt2','当收到消息 N1','hat',['s','消息']],['evt3','广播消息 N1','stack',['s','消息']]],
mot:[['mot0','移动 N1 步','stack',['n','步数']],['mot1','转向 N1 度','stack',['n','角度']],['mot2','面向 N1 方向','stack',['n','方向']],['mot3','移到 x:N1 y:N2','stack',['n','x'],['n','y']],['mot4','滑行 1 秒到 x:N1 y:N2','stack',['n','x'],['n','y']],['mot5','x 坐标','rep'],['mot6','y 坐标','rep'],['mot7','x 设为 N1','stack',['n','x']],['mot8','y 设为 N1','stack',['n','y']],['mot9','x 增加 N1','stack',['n','x']],['mot10','y 增加 N1','stack',['n','y']],['mot11','面向 鼠标','stack'],['mot12','碰到边缘反弹','stack'],['mot13','回到中心','stack']],
look:[['l0','说 N1','stack',['s','内容']],['l1','思考 N1','stack',['s','内容']],['l2','显示','stack'],['l3','隐藏','stack'],['l4','大小设为 N1 %','stack',['n','大小']],['l5','下一个造型','stack'],['l6','虚像设为 N1 %','stack',['n','虚像']],['l7','层级设为 N1','stack',['n','层级']],['l8','造型切换为 第 N1 个','stack',['n','序号']]],
snd:[['s0','播放哔声','stack'],['s1','音量设为 N1 %','stack',['n','音量']],['s2','静音','stack'],['s3','播放音调 N1 Hz N2 秒','stack',['n','频率'],['n','时长']],['s4','音量增加 N1','stack',['n','音量']]],
ctl:[['c0','重复 N1 次','stack',['n','次数']],['c1','重复执行','stack'],['c2','如果 N1','stack',['b']],['c3','如果 N1 否则','stack',['b']],['c4','等待 N1 秒','stack',['n','秒']],['c5','停止脚本','end'],['c6','重复直到 N1','stack',['b']],['c7','等待直到 N1','stack',['b']]],
sen:[['se0','碰到 边缘?','bool'],['se1','碰到 N1?','bool',['s','角色']],['se2','按键 N1 按下?','bool',['s','键']],['se3','鼠标 x','rep'],['se4','鼠标 y','rep'],['se5','碰到 ⓡ角色?','bool',['r','角色']],['se6','碰到 任意角色?','bool'],['se7','鼠标 按下?','bool'],['se8','到 鼠标 的距离','rep'],['se9','到 ⓡ角色 的方向','rep',['r','角色']]],
ops:[['o0','N1 + N2','rep',['n'],['n']],['o1','N1 - N2','rep',['n'],['n']],['o2','N1 × N2','rep',['n'],['n']],['o3','N1 ÷ N2','rep',['n'],['n']],['o4','随机数 N1 ~ N2','rep',['n'],['n']],['o5','N1 > N2','bool',['n'],['n']],['o6','N1 < N2','bool',['n'],['n']],['o7','N1 与 N2','bool',['b'],['b']],['o8','N1 或 N2','bool',['b'],['b']],['o9','非 N1','bool',['b']],['o10','N1 ÷ N2 的余数','rep',['n'],['n']],['o11','N1 的绝对值','rep',['n']],['o12','四舍五入 N1','rep',['n']],['o13','最大值 N1,N2','rep',['n'],['n']],['o14','最小值 N1,N2','rep',['n'],['n']],['o15','N1 = N2?','bool',['n'],['n']],['o16','N1 ≠ N2?','bool',['n'],['n']]],
str:[['t0','拼接 N1 与 N2','rep',['t'],['t']],['t1','数字转字符串 N1','rep',['n']],['t2','字符串转数字 N1','rep',['n']],['t3','N1 的长度','rep',['t']],['t4','截取 N1 从 N2 取 N3','rep',['t'],['n'],['n']],['t5','大写 N1','rep',['t']],['t6','小写 N1','rep',['t']],['t7','反转 N1','rep',['t']],['t8','N1 包含 N2?','bool',['t'],['t']]],
var:[['v0','声明变量 N1 (N2)','stack',['s','名称'],['y','类型']],['v1','变量 N1 设为 N2','stack',['v','变量'],['t','值']],['v2','变量 N1 增加 N2','stack',['v','变量'],['n','值']],['v3','变量 N1','rep',['v','变量']],['v4','变量 N1 追加 N2','stack',['v','变量'],['t','值']],['v5','变量 N1 弹出','rep',['v','变量']],['v6','变量 N1 的第 N2 项','rep',['v','变量'],['t','索引/键']],['v7','变量 N1 的第 N2 项设为 N3','stack',['v','变量'],['t','索引/键'],['t','值']],['v8','变量 N1 的长度','rep',['v','变量']],['v9','变量 N1 含有 N2','rep',['v','变量'],['t','值']],['v10','清空变量 N1','stack',['v','变量']],['v11','交换 变量A 变量B','stack',['v','A'],['v','B']]],
nod:[['n0','创建节点 N1 (N2)','stack',['s','名称'],['r','类型']],['n1','作为子节点','stack'],['n2','移动 N1 到 x:N2 y:N3','stack',['s','节点'],['n','x'],['n','y']],['n3','获取 N1 的 N2','rep',['s','节点'],['s','属性']],['n4','切换场景到 N1','stack',['s','场景']],['n5','放置方块 N1','stack',['s','类型']],['n6','破坏方块','stack'],['n7','克隆自己','stack']]};
var R={steve:{n:'Steve',s:'<svg viewBox="0 0 16 16"><rect width="16" height="16" fill="#C6A98C"/><rect x="0" y="0" width="16" height="3" fill="#4A3B2A"/><rect x="1" y="1" width="2" height="3" fill="#7A5B3A"/><rect x="3" y="1" width="2" height="3" fill="#8B6B4F"/><rect x="11" y="1" width="2" height="3" fill="#7A5B3A"/><rect x="13" y="1" width="2" height="3" fill="#4A3B2A"/><rect x="2" y="6" width="2" height="2" fill="#FFF"/><rect x="12" y="6" width="2" height="2" fill="#FFF"/><rect x="3" y="6" width="1" height="2" fill="#3B6EA5"/><rect x="13" y="6" width="1" height="2" fill="#3B6EA5"/><rect x="7" y="8" width="2" height="1" fill="#8B6B4F"/><rect x="6" y="11" width="4" height="2" fill="#7A5230"/><rect x="0" y="4" width="1" height="7" fill="#3B2A18"/><rect x="15" y="4" width="1" height="7" fill="#3B2A18"/><rect x="1" y="5" width="1" height="4" fill="#3B2A18"/><rect x="14" y="5" width="1" height="4" fill="#3B2A18"/></svg>'},
creeper:{n:'苦力怕',s:'<svg viewBox="0 0 16 16"><rect width="16" height="16" fill="#5FA64F"/><rect x="3" y="3" width="10" height="10" fill="#6FB85C"/><rect x="3" y="3" width="3" height="3" fill="#4A8A3E"/><rect x="10" y="3" width="3" height="3" fill="#4A8A3E"/><rect x="4" y="5" width="1" height="1" fill="#111"/><rect x="11" y="5" width="1" height="1" fill="#111"/><rect x="6" y="6" width="4" height="2" fill="#111"/><rect x="6" y="9" width="1" height="2" fill="#3E6E34"/><rect x="9" y="9" width="1" height="2" fill="#3E6E34"/><rect x="7" y="9" width="2" height="3" fill="#111"/><rect x="1" y="4" width="1" height="8" fill="#4A8A3E"/><rect x="14" y="4" width="1" height="8" fill="#4A8A3E"/></svg>'},
pig:{n:'猪',s:'<svg viewBox="0 0 16 16"><rect width="16" height="16" fill="#F2A0A0"/><rect x="3" y="2" width="3" height="2" fill="#E88E8E"/><rect x="10" y="2" width="3" height="2" fill="#E88E8E"/><rect x="2" y="6" width="2" height="2" fill="#3A2A1A"/><rect x="12" y="6" width="2" height="2" fill="#3A2A1A"/><rect x="6" y="7" width="4" height="3" fill="#F5B0B0"/><rect x="6" y="9" width="1" height="1" fill="#3A2A1A"/><rect x="9" y="9" width="1" height="1" fill="#3A2A1A"/><rect x="7" y="8" width="2" height="1" fill="#D87E7E"/><rect x="2" y="12" width="3" height="1" fill="#D87E7E"/><rect x="11" y="12" width="3" height="1" fill="#D87E7E"/><rect x="3" y="1" width="1" height="3" fill="#E88E8E"/><rect x="12" y="1" width="1" height="3" fill="#E88E8E"/></svg>'},
sheep:{n:'羊',s:'<svg viewBox="0 0 16 16"><rect width="16" height="16" fill="#E8E4D8"/><rect x="2" y="1" width="12" height="6" fill="#F5F2E8"/><rect x="2" y="1" width="2" height="3" fill="#D8D2C2"/><rect x="12" y="1" width="2" height="3" fill="#D8D2C2"/><rect x="4" y="6" width="2" height="2" fill="#3A2A1A"/><rect x="10" y="6" width="2" height="2" fill="#3A2A1A"/><rect x="5" y="8" width="6" height="3" fill="#F5F2E8"/><rect x="6" y="8" width="4" height="2" fill="#D8C8A8"/><rect x="2" y="11" width="2" height="1" fill="#D8D2C2"/><rect x="12" y="11" width="2" height="1" fill="#D8D2C2"/></svg>'},
villager:{n:'村民',s:'<svg viewBox="0 0 16 16"><rect width="16" height="16" fill="#B8A88A"/><rect x="3" y="1" width="10" height="4" fill="#5A4A30"/><rect x="4" y="6" width="2" height="2" fill="#FFF"/><rect x="10" y="6" width="2" height="2" fill="#FFF"/><rect x="5" y="6" width="1" height="2" fill="#4A6E9A"/><rect x="11" y="6" width="1" height="2" fill="#4A6E9A"/><rect x="7" y="8" width="2" height="5" fill="#C6A98C"/><rect x="6" y="9" width="4" height="1" fill="#8B6B4F"/><rect x="4" y="12" width="8" height="4" fill="#4A6E9A"/><rect x="3" y="11" width="10" height="1" fill="#3A5A80"/><rect x="1" y="5" width="1" height="7" fill="#5A4A30"/><rect x="14" y="5" width="1" height="7" fill="#5A4A30"/></svg>'},
golem:{n:'铁傀儡',s:'<svg viewBox="0 0 16 16"><rect width="16" height="16" fill="#8A8A8A"/><rect x="4" y="1" width="8" height="5" fill="#A0A0A0"/><rect x="5" y="3" width="2" height="2" fill="#E8E8E8"/><rect x="9" y="3" width="2" height="2" fill="#E8E8E8"/><rect x="6" y="3" width="1" height="2" fill="#6E8AB8"/><rect x="10" y="3" width="1" height="2" fill="#6E8AB8"/><rect x="3" y="6" width="10" height="7" fill="#7A7A7A"/><rect x="3" y="6" width="2" height="2" fill="#666"/><rect x="11" y="6" width="2" height="2" fill="#666"/><rect x="6" y="8" width="4" height="2" fill="#8A8A8A"/><rect x="7" y="10" width="2" height="2" fill="#8A8A8A"/><rect x="3" y="13" width="2" height="3" fill="#666"/><rect x="11" y="13" width="2" height="3" fill="#666"/><rect x="6" y="13" width="4" height="3" fill="#666"/></svg>'}};
var P={name:'未命名项目',cur:'main',vars:{},vtype:{},sel:'steve',scenes:{
main:{name:'主世界',ground:'grass',deco:[],nodes:{
root:{id:'root',n:'根',t:'root',c:['sc0']},
sc0:{id:'sc0',n:'主世界',t:'scene',c:['steve','pig','sheep']},
steve:{id:'steve',n:'Steve',t:'sprite',r:'steve',x:140,y:120,dir:0,size:56,show:1,scr:[{id:'evt0',a:[],c:[]},{id:'mot0',a:[['n',60]],c:[]},{id:'l0',a:[['s','你好！']],c:[]},{id:'mot1',a:[['n',90]],c:[]},{id:'mot0',a:[['n',60]],c:[]},{id:'l0',a:[['s','完成！']],c:[]}]},
pig:{id:'pig',n:'猪',t:'sprite',r:'pig',x:300,y:160,dir:0,size:48,show:1,scr:[{id:'evt0',a:[],c:[]},{id:'c0',a:[['n',3]],c:[{id:'mot0',a:[['n',40]],c:[]},{id:'l0',a:[['s','哼哼']],c:[]}]}]},
sheep:{id:'sheep',n:'羊',t:'sprite',r:'sheep',x:220,y:220,dir:0,size:48,show:1,scr:[{id:'evt0',a:[],c:[]},{id:'c1',a:[],c:[{id:'mot1',a:[['n',15]],c:[]},{id:'mot0',a:[['n',12]],c:[]},{id:'c2',a:[['blk',{id:'se0',a:[]}]],c:[{id:'mot1',a:[['n',180]],c:[]}]}]}]}
}},
cave:{name:'洞穴',ground:'stone',deco:[],nodes:{
root:{id:'root',n:'根',t:'root',c:['sc1']},
sc1:{id:'sc1',n:'洞穴',t:'scene',c:['creeper']},
creeper:{id:'creeper',n:'苦力怕',t:'sprite',r:'creeper',x:200,y:150,dir:0,size:56,show:1,scr:[]}
}},
village:{name:'村庄',ground:'plank',deco:[],nodes:{
root:{id:'root',n:'根',t:'root',c:['sc2']},
sc2:{id:'sc2',n:'村庄',t:'scene',c:['villager','golem']},
villager:{id:'villager',n:'村民',t:'sprite',r:'villager',x:160,y:150,dir:0,size:52,show:1,scr:[]},
golem:{id:'golem',n:'铁傀儡',t:'sprite',r:'golem',x:300,y:180,dir:0,size:56,show:1,scr:[]}
}}
}};
var st={run:0,keys:{},mx:0,my:0,vol:0.5,off:0,cam:{x:0,y:0,z:1},mdown:0};
var $=function(x){return document.getElementById(x)},W=0,H=0,ndm={},drag=null;
var nm=$('workNm'),cats=$('cats'),scripts=$('scripts'),world=$('world'),trBody=$('trBody'),scN=$('scN'),scN2=$('scN2'),stTxt=$('stTxt'),rp=$('rp'),propsEl=$('props');
function rSrc(n){var u;if(n.img)u=n.img;else if(n.costumes&&n.costumes.length)u=n.costumes[0].src;else return 'data:image/svg+xml;utf8,'+encodeURIComponent(R[n.r].s);return icR(u)}
var IC={};
function icR(u){if(!u||u.indexOf('data:')===0||IC[u]===u)return u;if(IC[u])return IC[u];IC[u]='';var im=new Image();im.onload=function(){if(IC[u]!=='')return;try{var c2=document.createElement('canvas');c2.width=im.naturalWidth||64;c2.height=im.naturalHeight||64;var x2=c2.getContext('2d');x2.imageSmoothingEnabled=false;x2.drawImage(im,0,0);IC[u]=c2.toDataURL('image/png')}catch(e){IC[u]=u}if(IC[u]!==u)render()};im.onerror=function(){IC[u]=u};im.src=u;return u}
function rName(n){return n.n||R[n.r].n}
var COLS={};for(var i=0;i<C.length;i++)COLS[C[i][0]]=C[i][2];
var BM={};for(var i=0;i<C.length;i++){var a=B[C[i][0]];for(var j=0;j<a.length;j++)BM[a[j][0]]=a[j]}
var BCOL={};for(var i=0;i<C.length;i++){var a=B[C[i][0]];for(var j=0;j<a.length;j++)BCOL[a[j][0]]=C[i][2]}
function col(b){var id=b.id||'',k=id.substring(0,3);return COLS[k]||'#888'}
function isCtl(id){return id==='c0'||id==='c1'||id==='c2'||id==='c3'}
function isEvt(id){return id==='evt0'||id==='evt1'||id==='evt2'}
function isNest(id){var sh=BM[id]?BM[id][2]:'';return sh==='bool'||sh==='rep'}
function mkSlot(pv,df,sc){var t=df[0],el;
 if(t==='y'){el=document.createElement('select');el.className='slot sel';[['int','int 数字'],['str','string 字符串'],['list','list 列表'],['dict','dict 字典'],['stack','stack 栈'],['queue','queue 队列']].forEach(function(x){var o=document.createElement('option');o.value=x[0];o.textContent=x[1];el.appendChild(o)});el.value=pv&&pv[1]!==undefined?pv[1]:'int';el.onchange=function(){pv[1]=el.value};return el}
 if(t==='v'){el=document.createElement('select');el.className='slot sel';var k=Object.keys(P.vars);if(!k.length)k=['(无变量)'];for(var i=0;i<k.length;i++){var o=document.createElement('option');o.textContent=k[i]+(P.vtype[k[i]]==='str'?' Ⓢ':P.vtype[k[i]]==='list'?' ⓛ':P.vtype[k[i]]==='dict'?' ⓓ':P.vtype[k[i]]==='stack'?' ⓢ':P.vtype[k[i]]==='queue'?' ⓠ':'');el.appendChild(o)}el.value=pv&&pv[1]!==undefined?pv[1]:k[0];el.onchange=function(){pv[1]=el.value};return el}
 if(t==='r'){el=document.createElement('select');el.className='slot sel';var rks=Object.keys(R);for(var i=0;i<rks.length;i++){var o=document.createElement('option');o.value=rks[i];o.textContent=R[rks[i]].n;el.appendChild(o)}el.value=pv&&pv[1]!==undefined?pv[1]:rks[0];el.onchange=function(){pv[1]=el.value};return el}
 var rep=t==='n'||t==='t'||t==='s'||t==='b';
 var d=document.createElement('div');d.className='slotc';
 d.appendChild(document.createElement('span')).textContent='◈';
 d.ondragover=function(e){e.preventDefault()};
 d.ondrop=function(e){e.preventDefault();if(!drag)return;var did=drag.o?drag.o.id:drag.id;if(!isNest(did))return;if(drag.s){var src=drag;src.a.splice(src.i,1)}pv[0]='blk';pv[1]=drag.o||{id:drag.id,a:[],c:[]};render();drag=null};
 if(rep&&pv&&pv[0]==='blk'&&pv[1]){var w=document.createElement('div');w.className='slotc';w.appendChild(mkBlk(pv[1],0,{arr:[pv[1]],nid:sc&&sc.nid,pv:pv},function(){pv[0]='b';pv[1]=null;render()}));
  w.ondragover=function(e){e.preventDefault()};
  w.ondrop=function(e){e.preventDefault();if(!drag)return;var did=drag.o?drag.o.id:drag.id;if(!isNest(did))return;if(drag.s){var src=drag;src.a.splice(src.i,1)}pv[0]='blk';pv[1]=drag.o||{id:drag.id,a:[],c:[]};render();drag=null};
  return w}
 if(t==='b')return d;
 if(t==='n'||t==='t'||t==='s'){
  if(t==='n'){el=document.createElement('input');el.type='number';el.className='slot sml';el.placeholder=df[1]||'';el.value=pv&&pv[1]!==undefined&&pv[1]!==null?(typeof pv[1]==='object'&&pv[1].ex!==undefined?pv[1].ex:pv[1]):'';el.onchange=function(){var v=el.value.trim();if(!v){pv[1]=0;return}var f=parseFloat(v);if(!isNaN(f)){pv[1]=f;return}pv[1]={ex:v}}}
  else if(t==='t'){el=document.createElement('input');el.type='text';el.className='slot';el.placeholder=df[1]||'';el.value=pv&&pv[1]!==undefined&&pv[1]!==null?(typeof pv[1]==='object'&&pv[1].ex!==undefined?pv[1].ex:pv[1]):'';el.onchange=function(){var v=el.value.trim();if(v&&isNaN(parseFloat(v))){var ev=exprVal(v,{x:0,y:0,dir:0});if(ev!==null)pv[1]={ex:v};else pv[1]=v}else pv[1]=v}}
  else{el=document.createElement('input');el.type='text';el.className='slot';el.placeholder=df[1]||'';el.value=pv&&pv[1]!==undefined?pv[1]:'';el.onchange=function(){pv[1]=el.value}}
  var w2=document.createElement('div');w2.className='slotc inp';
  w2.ondragover=function(e){e.preventDefault();if(drag)w2.classList.add('hl')};
  w2.ondrop=function(e){e.preventDefault();if(!drag)return;var did=drag.o?drag.o.id:drag.id;if(!isNest(did))return;if(drag.s){var src=drag;src.a.splice(src.i,1)}pv[0]='blk';pv[1]=drag.o||{id:drag.id,a:[],c:[]};render();drag=null};
  w2.ondragleave=function(e){if(!w2.contains(e.relatedTarget))w2.classList.remove('hl')};
  w2.appendChild(el);return w2}}
function mkBlk(b,pn,sc,del){var bd=BM[b.id];if(!bd)return document.createElement('div');var div=document.createElement('div');div.className='blk '+bd[2]+(pn?' p':'');
 div.style.background=BCOL[b.id]||'#7A7A7A';div.style.setProperty('--bg',BCOL[b.id]||'#7A7A7A'); if(pn){div.draggable=true;div.ondragstart=function(e){drag={id:b.id};e.dataTransfer.effectAllowed='copy';var cv=document.createElement('canvas');cv.width=1;cv.height=1;e.dataTransfer.setDragImage(cv,0,0);div.classList.add('drag')};div.ondragend=function(){div.classList.remove('drag');ghHide()}}
 else{var x=document.createElement('span');x.className='bx';x.textContent='×';x.onclick=del||function(){if(sc&&sc.arr){var i=sc.arr.indexOf(b);if(i>=0)sc.arr.splice(i,1);render()}};div.appendChild(x);
  if(WM)WM.set(b,div);
  div.oncontextmenu=function(e){e.preventDefault();e.stopPropagation();ctxShow(e,b,sc);return false};
  div.draggable=true;div.ondragstart=function(e){if(!sc||!sc.arr)return;var si=sc.arr.indexOf(b);if(si<0)return;var ln=1;if(!isNest(b.id)){for(var k=si+1;k<sc.arr.length;k++){if(isEvt(sc.arr[k].id)||isNest(sc.arr[k].id))break;ln++}}drag={id:b.id,s:sc.nid||'',a:sc.arr,i:si,o:b,ln:ln};if(sc.pv){drag.from='slot';drag.pv=sc.pv;sc.pv[0]='b';sc.pv[1]=null}e.dataTransfer.effectAllowed='move';var cv=document.createElement('canvas');cv.width=1;cv.height=1;e.dataTransfer.setDragImage(cv,0,0);div.classList.add('drag')};div.ondragend=function(){div.classList.remove('drag');ghHide();if(drag&&drag.from==='slot'&&!drag.dropped){drag.pv[0]='blk';drag.pv[1]=drag.o;render()}drag=null};
  if(bd[2]==='stack'||bd[2]==='end'||bd[2]==='hat'){var bp=document.createElement('span');bp.className='bp-dot'+(b.bp?' on':'');bp.title='断点';bp.onclick=function(e){e.stopPropagation();b.bp=b.bp?0:1;if(sc&&sc.rer)sc.rer();else render()};div.appendChild(bp);
   div.onclick=function(e){e.stopPropagation();if(!sc||!sc.rer)return;if(st.run)return;var nd=P.scenes[P.cur]&&P.scenes[P.cur].nodes[sc.nid];if(!nd)return;var ix=sc.arr.indexOf(b);if(ix<0)return;st.run=1;runAt(nd,ix)}}}
 var rest=bd[1],n=0;
 for(var j=3;j<bd.length;j++){n++;var key='N'+n;var idx=rest.indexOf(key);if(idx<0)continue;
  var pre=rest.slice(0,idx);if(pre){var sp=document.createElement('span');sp.textContent=pre;div.appendChild(sp)}
  var pv;if(pn){pv=bd[j][0]==='v'?['v',null]:[bd[j][0],undefined]}
  else{if(!b.a)b.a=[];while(b.a.length<n)b.a.push(null);pv=b.a[n-1]||(b.a[n-1]=bd[j][0]==='v'?['v',null]:[bd[j][0],undefined])}
  div.appendChild(mkSlot(pv,bd[j],sc));rest=rest.slice(idx+key.length)}
 if(rest){var sp2=document.createElement('span');sp2.textContent=rest;div.appendChild(sp2)}
 if(!pn&&sc&&sc.arr&&b.note!==undefined){var nt=document.createElement('div');nt.className='note';var ta=document.createElement('textarea');ta.value=b.note;ta.placeholder='注释…';ta.oninput=function(){b.note=ta.value};nt.appendChild(ta);div.appendChild(nt)}
 return div}
function subBlocks(arr,bd,sc){if(!Array.isArray(arr))return;for(var i=0;i<arr.length;i++){var b=arr[i];if(!b||typeof b!=='object'||!b.id||!BM[b.id])continue;var w=document.createElement('div');w.className='bwrap';w.appendChild(mkBlk(b,0,{arr:arr,nid:sc&&sc.nid}));bd.appendChild(w)}}
function insIdx(e,el){var y=e.clientY,cs=el.children,i=0;
 for(;i<cs.length;i++){var c=cs[i];if(c.classList.contains('insline'))continue;var wr=c.getBoundingClientRect();if(y<wr.top+wr.height/2)break}
 var bi=0;for(var j=0;j<i;j++){if(cs[j].classList.contains('bwrap'))bi++}
 return bi}
function showIns(e,el,arr){var idx=insIdx(e,el,arr),cs=el.children,ln=el.querySelector(':scope>.insline');
 if(!ln){ln=document.createElement('div');ln.className='insline';el.appendChild(ln)}
 var base=el.offsetTop,top=0,bs=0,lastB=null;
 for(var i=0;i<cs.length;i++){var c=cs[i];if(c.classList.contains('insline'))continue;
  if(c.classList.contains('bwrap')){bs++;if(bs>idx){top=c.offsetTop-base;break}lastB=c}}
 if(bs<=idx){top=lastB?lastB.offsetTop-base+lastB.offsetHeight:0}
 if(idx===0)top=0;
 ln.style.top=top+'px';ln.style.display='block';ghShow();ghAt(e)}
function hideIns(){var l=document.querySelectorAll('.insline');for(var i=0;i<l.length;i++)l[i].style.display='none';ghHide()}
var gh=null;
function ghShow(){if(!drag)return;if(!gh){gh=document.createElement('div');gh.className='gh';document.body.appendChild(gh)}gh.innerHTML='';var st=document.createElement('div');st.className='ghst';gh.appendChild(st);if(drag.ln>1&&drag.a){var e2=drag.i+drag.ln;for(var k=drag.i;k<e2;k++){var gb=mkBlk(drag.a[k],1,null);gb.draggable=false;st.appendChild(gb)}}else{var gb2=mkBlk(drag.o||{id:drag.id},1,null);gb2.draggable=false;st.appendChild(gb2)}gh.style.display='block'}
function ghAt(e){if(!gh){gh=document.createElement('div');gh.className='gh';document.body.appendChild(gh)}gh.style.left=(e.clientX+10)+'px';gh.style.top=(e.clientY-gh.offsetHeight-8)+'px'}
function ghHide(){if(gh){gh.style.display='none';gh.innerHTML=''}}
var WM=typeof WeakMap==='function'?new WeakMap():null;
function rMark(b){if(!WM||!b)return;var el=WM.get(b);if(el)el.classList.add('rn')}
function rClr(b){if(!WM||!b)return;var el=WM.get(b);if(el)el.classList.remove('rn')}
function rClrAll(){if(!WM)return;var s=document.querySelectorAll('.rn');for(var i=0;i<s.length;i++)s[i].classList.remove('rn')}
function setIns(el,arr,host,off){off=off||0;el.ondragover=function(e){e.preventDefault();if(!drag)return;e.stopPropagation();ghShow();ghAt(e);showIns(e,el,arr);el.classList.add('hl')};
 el.ondrop=function(e){e.preventDefault();if(!drag)return;e.stopPropagation();
  if(drag.s&&drag.o===host){hideIns();el.classList.remove('hl');drag=null;return}
  var idx=insIdx(e,el,arr)+off;
  if(idx===off&&arr[off]&&isEvt(arr[off].id)&&!(drag.o&&isEvt(drag.o.id))){hideIns();el.classList.remove('hl');drag=null;return}
  if(drag.s){var src=drag;var seg=src.a.splice(src.i,src.ln||1);if(src.a===arr&&src.i<idx)idx-=seg.length;if(src.a===arr&&idx>src.a.length)idx=src.a.length;for(var s0=0;s0<seg.length;s0++)arr.splice(idx+s0,0,seg[s0])}
  else arr.splice(idx,0,{id:drag.id,a:[],c:[]});
  hideIns();el.classList.remove('hl');render();drag=null};
 el.ondragleave=function(e){if(!el.contains(e.relatedTarget)){el.classList.remove('hl');hideIns()}}}
function catDom(){cats.innerHTML='';
 for(var i=0;i<C.length;i++){var c=C[i],cat=document.createElement('div');cat.className='cat';cat.dataset.c=c[0];
  var hd=document.createElement('div');hd.className='cat-hd';hd.style.background=c[2];hd.innerHTML=c[1]+'<span class="a">▶</span>';
  hd.onclick=function(){this.parentNode.classList.toggle('open')};
  var bd=document.createElement('div');bd.className='cat-bd';
  for(var j=0;j<B[c[0]].length;j++){var w=document.createElement('div');w.className='cw';w.appendChild(mkBlk({id:B[c[0]][j][0],a:[],c:[]},1));bd.appendChild(w)}
  cat.appendChild(hd);cat.appendChild(bd);cats.appendChild(cat)}
 cats.querySelector('.cat').classList.add('open')}
function scrItem(n){var d=document.createElement('div');d.className='scr';
 var hd=document.createElement('div');hd.className='sc-hd';hd.innerHTML='<img src="'+rSrc(n)+'">'+rName(n);
 var cl=document.createElement('span');cl.className='sc-x';cl.textContent='清空';cl.onclick=function(){n.scr=[];render()};hd.appendChild(cl);d.appendChild(hd);
 var bd=document.createElement('div');bd.className='scr-bd';
 bd.ondragover=function(e){e.preventDefault();if(!drag)return;e.stopPropagation();ghShow();ghAt(e);bd.classList.add('hl')};
 bd.ondrop=function(e){e.preventDefault();if(!drag)return;e.stopPropagation();
  var r=bd.getBoundingClientRect(),x=e.clientX-r.left-90,y=e.clientY-r.top-10;if(x<6)x=6;if(y<6)y=6;
  var seg;
  if(drag.s){var src=drag;seg=src.a.splice(src.i,src.ln||1)}
  else seg=[{id:drag.id,a:[],c:[]}];
  for(var s0=0;s0<seg.length;s0++)n.scr.push(seg[s0]);
  seg[0].p=[Math.round(x),Math.round(y)];
  bd.classList.remove('hl');render();drag=null};
 bd.ondragleave=function(e){if(!bd.contains(e.relatedTarget)){bd.classList.remove('hl')}};
 if(!n.scr.length){var p=document.createElement('div');p.className='ph';p.textContent='拖积木到这里';bd.appendChild(p)}
 var Y=14;
 for(var i=0;i<n.scr.length;i++){var it=n.scr[i];
  if(!it||typeof it!=='object'||!it.id||!BM[it.id])continue;
  if(i>0&&!(isEvt(it.id)||isNest(it.id)||it.p))continue;
  var stk=document.createElement('div');stk.className='chain';
  if(it.p){stk.style.left=it.p[0]+'px';stk.style.top=it.p[1]+'px'}
  else{stk.style.left='14px';stk.style.top=Y+'px';Y+=46}
  bd.appendChild(stk);
  setIns(stk,n.scr,null,i);
  var j=i;
  while(j<n.scr.length){var it2=n.scr[j];
   if(j>i&&(isEvt(it2.id)||isNest(it2.id)||it2.p))break;
   if(!it2||typeof it2!=='object'||!it2.id||!BM[it2.id]){j++;continue}
   if(isCtl(it2.id)){
    var w=document.createElement('div');w.className='bwrap';w.appendChild(mkBlk(it2,0,{arr:n.scr,nid:n.id}));stk.appendChild(w);
    var tg=document.createElement('span');tg.className='tg';tg.textContent=it2.f?'▸':'▾';tg.title=it2.f?'展开':'折叠';
    (function(it3){tg.onclick=function(){it3.f=it3.f?0:1;render()}})(it2);
    w.querySelector('.blk').appendChild(tg);
    var condPv=it2.a&&it2.a[0]?it2.a[0]:null;
    var wrapN=function(c2){var _ov=c2.ondragover,_od=c2.ondrop;
     c2.ondragover=function(e){e.preventDefault();if(!drag)return;e.stopPropagation();var did=drag.o?drag.o.id:drag.id;if(isNest(did)){if(!condPv)return;c2.classList.add('hl');return}_ov(e)};
     c2.ondrop=function(e){e.preventDefault();if(!drag)return;e.stopPropagation();var did=drag.o?drag.o.id:drag.id;if(isNest(did)){if(!condPv)return;c2.classList.remove('hl');if(drag.s){var src=drag;src.a.splice(src.i,1)}condPv[0]='blk';condPv[1]=drag.o||{id:drag.id,a:[],c:[]};render();drag=null;return}_od(e)}};
    var cd=document.createElement('div');cd.className='sub'+(it2.f?' closed':'');
    if(it2.id==='c3'){if(!Array.isArray(it2.c[0]))it2.c[0]=[];if(!Array.isArray(it2.c[1]))it2.c[1]=[];var d1=document.createElement('div');d1.className='sub';subBlocks(it2.c[0],d1,{nid:n.id});setIns(d1,it2.c[0],it2);wrapN(d1);cd.appendChild(d1);var ec=document.createElement('div');ec.className='blk else-cap';ec.textContent='否则';cd.appendChild(ec);var d2=document.createElement('div');d2.className='sub';subBlocks(it2.c[1],d2,{nid:n.id});setIns(d2,it2.c[1],it2);wrapN(d2);cd.appendChild(d2)}
    else{subBlocks(it2.c,cd,{nid:n.id});setIns(cd,it2.c,it2);wrapN(cd)}
    stk.appendChild(cd);
    var cap=document.createElement('div');cap.className='blk end-cap';cap.textContent='结束';stk.appendChild(cap);
    if(it2.f)cap.style.display='none';
   }else{var w2=document.createElement('div');w2.className='bwrap';w2.appendChild(mkBlk(it2,0,{arr:n.scr,nid:n.id}));stk.appendChild(w2)}
   j++}
  var xx=document.createElement('span');xx.className='ch-x';xx.textContent='✕';xx.title='删除此脚本';
  (function(s0){xx.onclick=function(){var e2=s0+1;for(;e2<n.scr.length;e2++){var b3=n.scr[e2];if(isEvt(b3.id)||isNest(b3.id)||b3.p)break}n.scr.splice(s0,e2-s0);render()}})(i);
  stk.appendChild(xx);
  i=j-1}
 d.appendChild(bd);return d}
function scrL(){var s=P.scenes[P.cur];scripts.innerHTML='';
 var ids=[];for(var k in s.nodes){if(s.nodes[k].t==='sprite')ids.push(k)}
 if(P.sel&&s.nodes[P.sel]&&s.nodes[P.sel].t==='sprite')ids=[P.sel];
 else if(ids.length){P.sel=ids[0]}
 if(!ids.length){var p=document.createElement('div');p.className='ph';p.textContent='当前场景没有角色';scripts.appendChild(p);return}
 scripts.appendChild(scrItem(s.nodes[ids[0]]))}
function groundBg(g){if(g==='stone')return 'repeating-linear-gradient(0deg,#5E5E5E 0 24px,#555 24px 48px),repeating-linear-gradient(90deg,transparent 0 24px,rgba(0,0,0,.12) 24px 48px)';
 if(g==='plank')return 'repeating-linear-gradient(90deg,#A6784C 0 24px,#98683F 24px 48px),repeating-linear-gradient(0deg,transparent 0 24px,rgba(0,0,0,.15) 24px 48px)';
 return 'repeating-linear-gradient(0deg,#83B45C 0 24px,#77A84F 24px 48px),repeating-linear-gradient(90deg,transparent 0 24px,rgba(0,0,0,.06) 24px 48px)'}
function blockBg(t){if(t==='stone')return '#8A8A8A';if(t==='plank')return '#A6784C';return '#7BA55D'}
function stage(){var s=P.scenes[P.cur];world.innerHTML='';ndm={};
 var wc=document.createElement('div');wc.id='wcam';world.appendChild(wc);
 var g=document.createElement('div');g.className='ground';g.style.background=groundBg(s.ground);wc.appendChild(g);
 var gr=document.createElement('div');gr.className='grid';wc.appendChild(gr);
 for(var k=0;k<(s.deco||[]).length;k++){var d=s.deco[k],e=document.createElement('div');e.className='px deco';e.style.left=d.x+'px';e.style.top=d.y+'px';e.style.width=d.w+'px';e.style.height=d.h+'px';e.style.background=blockBg(d.t);wc.appendChild(e)}
 for(var k in s.nodes){var n=s.nodes[k];if(n.t!=='sprite'||!n.show)continue;
  var bw=n.cbw||n.size,bh=n.cbh||n.size;
  var d=document.createElement('div');d.className='px';d.id='nd-'+n.id;d.style.left=(n.x-bw/2)+'px';d.style.top=(n.y-bh/2)+'px';
  var img=document.createElement('img');img.src=rSrc(n);var cc=null;if(Array.isArray(n.costumes))for(var i=0;i<n.costumes.length;i++)if(n.costumes[i].src===n.img)cc=n.costumes[i];var raw=n.img&&(n.raw||(cc&&cc.raw));
  if(raw){img.style.width=bw+'px';img.style.height='auto';d.style.width=bw+'px';d.style.height=bh+'px'}else{img.style.width=bw+'px';img.style.height=bh+'px'}
  img.draggable=false;d.appendChild(img);
  var nm2=document.createElement('div');nm2.className='p-name';nm2.textContent=rName(n);d.appendChild(nm2);
  d.onclick=(function(nn){return function(e){e.stopPropagation();if(st.suppress)return;if(st.run){for(var i=0;i<nn.scr.length;i++)if(nn.scr[i].id==='evt1')fire(nn,i)}else{P.sel=nn.id;props();tree();scrL()}}})(n);
  d.onmousedown=(function(nn){return function(e){e.stopPropagation();st.dragN=nn.id;st.dragX=e.clientX;st.dragY=e.clientY;st.dragM=false}})(n);
  wc.appendChild(d);ndm[n.id]=d}
 var ch=document.createElement('div');ch.className='cam-hint';ch.textContent='WASD 平移 · 滚轮缩放';world.appendChild(ch);
 updCam()}
function cl(){var s=P.scenes[P.cur];
 for(var id in ndm){var n=s.nodes[id],d=ndm[id];if(!n||!n.show){d.style.display='none';continue}d.style.display='';var bw=n.cbw||n.size,bh=n.cbh||n.size;d.style.left=(n.x-bw/2)+'px';d.style.top=(n.y-bh/2)+'px';var im=d.querySelector('img');im.src=rSrc(n);var cc=null;if(Array.isArray(n.costumes))for(var i=0;i<n.costumes.length;i++)if(n.costumes[i].src===n.img)cc=n.costumes[i];var raw=n.img&&(n.raw||(cc&&cc.raw));
  if(raw){im.style.width=bw+'px';im.style.height='auto';d.style.width=bw+'px';d.style.height=bh+'px'}else{im.style.width=bw+'px';im.style.height=bh+'px';d.style.width='';d.style.height=''}
  var sy=d.querySelector('.say');if(n.say){if(!sy){sy=document.createElement('div');sy.className='say';d.appendChild(sy)}sy.textContent=Array.isArray(n.say)?n.say[0]:n.say;sy.style.display=''}else if(sy)sy.style.display='none';d.style.opacity=n.ghost!==undefined&&n.ghost<100?(1-Math.max(0,Math.min(100,n.ghost))/100):'';d.style.zIndex=n.z||''}}
function tree(){var s=P.scenes[P.cur],h='';
 function w(n,d){var t='';if(n.t==='root')t='▣';else if(n.t==='scene')t='◈';else if(n.t==='sprite')t='<img src="'+rSrc(n)+'">';
  h+='<div class="tn d'+d+' '+(P.sel===n.id?'on':'')+'" data-id="'+n.id+'"><span class="ti2">'+t+'</span>'+rName(n)+'<span class="tk">'+({root:'root',scene:'scene',sprite:'sprite'}[n.t]||n.t)+'</span></div>';
  for(var i=0;i<(n.c||[]).length;i++){var c=s.nodes[n.c[i]];if(c)w(c,d+1)}}
 var w2=s.nodes&&s.nodes['root'];if(w2)w(w2,0);trBody.innerHTML=h;
 var ns=trBody.querySelectorAll('.tn');
 for(var k=0;k<ns.length;k++)ns[k].onclick=function(){P.sel=this.dataset.id;tree();scrL();props()}}
function size(){W=world.clientWidth||300;H=world.clientHeight||220}
function updCam(){var wc=$('wcam');if(wc)wc.style.transform='translate('+st.cam.x+'px,'+st.cam.y+'px) scale('+st.cam.z+')'}
function render(){if(!P.scenes[P.cur])P.cur='main';SC=Object.keys(P.scenes);catDom();stage();tree();scrL();size();var cs=P.scenes[P.cur];scN.textContent=cs.name;scN2.textContent=cs.name}
function props(){var s=P.scenes[P.cur],n=s.nodes[P.sel];if(!n||(n.t!=='sprite'&&n.t!=='scene')){propsEl.style.display='none';return}
 propsEl.style.display='flex';propsEl.innerHTML='';
 var hd=document.createElement('b');hd.textContent=(n.t==='sprite'?'角色':'场景')+' · '+rName(n);propsEl.appendChild(hd);
 if(n.t==='sprite'){
  var ph=document.createElement('div');ph.className='p-pic';
  var pi=document.createElement('img');pi.src=rSrc(n);ph.appendChild(pi);propsEl.appendChild(ph);
  var nmI=document.createElement('input');nmI.className='p-in wide';nmI.value=rName(n);nmI.placeholder='名称';nmI.onchange=function(){n.n=nmI.value||n.n;scrL();tree();stage();props()};propsEl.appendChild(nmI);
  var cs=document.createElement('div');cs.className='p-costumes';
  (n.costumes||[]).forEach(function(c,i){var t=document.createElement('div');t.className='p-cost'+(c.src===n.img?' on':'');t.title=c.name;
   var im=document.createElement('img');im.src=icR(c.src);t.appendChild(im);
   t.onclick=function(){n.img=c.src;props();stage();scrL()};
   var lx=document.createElement('b');lx.className='p-cl';lx.textContent='◀';lx.title='前移';lx.onclick=function(e){e.stopPropagation();if(i>0&&n.costumes&&n.costumes.length>1){var t1=n.costumes[i-1];n.costumes[i-1]=n.costumes[i];n.costumes[i]=t1;props();stage();scrL()}};t.appendChild(lx);
   var rx=document.createElement('b');rx.className='p-cr';rx.textContent='▶';rx.title='后移';rx.onclick=function(e){e.stopPropagation();if(n.costumes&&i<n.costumes.length-1){var t2=n.costumes[i+1];n.costumes[i+1]=n.costumes[i];n.costumes[i]=t2;props();stage();scrL()}};t.appendChild(rx);
   var cx=document.createElement('b');cx.className='p-cx';cx.textContent='✕';cx.title='删除造型';cx.onclick=function(e){e.stopPropagation();if(!n.costumes||n.costumes.length<=1){stTxt.textContent='至少保留一个造型';return}var ci=0;for(var k=0;k<n.costumes.length;k++)if(n.costumes[k].src===n.img){ci=k;break}if(ci>=i)ci=ci?ci-1:0;n.costumes.splice(i,1);n.img=n.costumes[ci].src;props();stage();scrL()};t.appendChild(cx);
   cs.appendChild(t)});
  var ad=document.createElement('div');ad.className='p-cost add';ad.textContent='+';ad.title='新增造型（URL）';ad.onclick=function(){var u=prompt('造型图片URL:');if(u){if(!Array.isArray(n.costumes))n.costumes=[];n.costumes.push({name:'造型'+(n.costumes.length+1),src:u,raw:1});n.img=u;props();stage();scrL()}};cs.appendChild(ad);
  var pd=document.createElement('div');pd.className='p-cost add';pd.textContent='✎';pd.title='绘制造型';pd.onclick=function(){openPaint(n)};cs.appendChild(pd);
  var im=document.createElement('div');im.className='p-cost add';im.textContent='⇧';im.title='导入图片文件为造型';im.onclick=function(){var fi=document.createElement('input');fi.type='file';fi.accept='image/*';fi.onchange=function(){var f=fi.files&&fi.files[0];if(!f)return;var fr=new FileReader();fr.onload=function(){if(!Array.isArray(n.costumes))n.costumes=[];n.costumes.push({name:'导入'+(n.costumes.length+1),src:fr.result,raw:1});n.img=fr.result;props();stage();scrL()};fr.readAsDataURL(f)};fi.click()};cs.appendChild(im);
  var am=document.createElement('div');am.className='p-cost add';am.textContent='▦';am.title='从素材库添加';am.onclick=function(){assetMgr(n)};cs.appendChild(am);
  var pvB=document.createElement('div');pvB.className='p-cost add';pvB.textContent='▶';pvB.title='预览动画（循环播放全部造型）';pvB.onclick=function(){if(prevT){clearInterval(prevT);prevT=null;pvB.textContent='▶';pvB.style.color='#fff'}else{var cs2=n.costumes||[];if(!cs2.length){stTxt.textContent='没有造型';return}prevT=setInterval(function(){var ci=0;for(var i=0;i<cs2.length;i++)if(cs2[i].src===n.img){ci=i;break}n.img=cs2[(ci+1)%cs2.length].src;cl()},250);pvB.textContent='■';pvB.style.color='#F66'}};cs.appendChild(pvB);
  var exF=document.createElement('div');exF.className='p-cost add';exF.textContent='⤓';exF.title='导出全部造型为 PNG 帧序列';exF.onclick=function(){var cs3=n.costumes||[];if(!cs3.length){stTxt.textContent='没有造型';return}expFrames(n,cs3,0)};cs.appendChild(exF);
  propsEl.appendChild(cs);
  var grid=document.createElement('div');grid.className='p-grid';propsEl.appendChild(grid);
  var num=function(lbl,key,min,max,fn,dele){var c=document.createElement('input');c.type='number';c.className='p-in';
   var ex=n.expr&&n.expr[key];c.value=ex!==undefined?ex:(n[key]!==undefined?n[key]:'');c.placeholder=lbl;
   c.onchange=function(){var v=c.value.trim();if(!v){if(n.expr)delete n.expr[key];if(dele)delete n[key];else n[key]=0;fn&&fn();props();return}
    var f=parseFloat(v);if(!isNaN(f)){if(n.expr)delete n.expr[key];n[key]=Math.max(min,Math.min(max,f))}
    else{if(!n.expr)n.expr={};n.expr[key]=v}
    fn&&fn();props();startExpr()};grid.appendChild(c)};
  num('X','x',-2000,2000,cl);num('Y','y',-2000,2000,cl);num('方向','dir',-3600,3600,cl);num('大小','size',8,256,function(){cl()});
  num('碰撞箱宽','cbw',1,1000,function(){cl()},1);num('碰撞箱高','cbh',1,1000,function(){cl()},1);
  var hb=document.createElement('button');hb.className='p-b';hb.textContent=n.show?'隐藏':'显示';hb.onclick=function(){n.show=n.show?0:1;hb.textContent=n.show?'隐藏':'显示';cl()};propsEl.appendChild(hb);
  var sp=document.createElement('span');sp.className='p-note';var cn2=0;for(var i2=0;i2<(n.scr||[]).length;i2++){var bb2=n.scr[i2];if(bb2&&isEvt(bb2.id))cn2++}sp.textContent='造型 '+((n.costumes||[]).length)+' 个 · 脚本 '+cn2+' 条';propsEl.appendChild(sp);
  if(n.expr&&Object.keys(n.expr).length)startExpr();
 }else{
  var nmS=document.createElement('input');nmS.className='p-in wide';nmS.value=rName(n);nmS.placeholder='名称';nmS.onchange=function(){n.n=nmS.value||n.n;tree();stage();props()};propsEl.appendChild(nmS);
  var gs=document.createElement('select');gs.className='p-in';[['grass','草地'],['stone','石头'],['plank','木板']].forEach(function(g){var o=document.createElement('option');o.value=g[0];o.textContent=g[1];gs.appendChild(o)});gs.value=n.ground||'grass';gs.onchange=function(){n.ground=gs.value;stage()};propsEl.appendChild(gs);
  var sp2=document.createElement('span');sp2.className='p-note';sp2.textContent='该场景 '+(Object.keys(s.nodes).length)+' 个节点';propsEl.appendChild(sp2);
 }
 var db=document.createElement('button');db.className='p-b del';db.textContent='删除';db.onclick=function(){
  if(n.t==='scene'){if(SC.length<=1){stTxt.textContent='至少保留一个场景';return}delete P.scenes[P.cur];SC.splice(SC.indexOf(P.cur),1);P.cur=SC[0];P.sel=''}
  else{delete s.nodes[P.sel];for(var k in s.nodes){var o=s.nodes[k];if(o.c){var i2=o.c.indexOf(P.sel);if(i2>=0)o.c.splice(i2,1)}}P.sel=''}
  propsEl.style.display='none';render();size()};propsEl.appendChild(db);
}
var PAL=['#2B2B2B','#3F3F3F','#8B8B8B','#F0F0F0','#6E4E2F','#A6784C','#7BA55D','#3E7D3A','#59C034','#4C97FF','#FFCF00','#FF6680','#C44B3A','#E3E3E3'];
function openPaint(n){var ov=document.createElement('div');ov.className='paint-ov';var bx=document.createElement('div');bx.className='paint';
 var hd=document.createElement('b');hd.textContent='绘制造型 · '+rName(n);bx.appendChild(hd);
 var cv=document.createElement('canvas');cv.width=16;cv.height=16;cv.className='paint-cv';
 var ctx=cv.getContext('2d');var pen='#2B2B2B',drawing=false;
 var gd=function(e){var r=cv.getBoundingClientRect();return[Math.floor((e.clientX-r.left)/r.width*16),Math.floor((e.clientY-r.top)/r.height*16)]};
 function dot(e){var p=gd(e);if(pen==='ERASE')ctx.clearRect(p[0],p[1],1,1);else{ctx.fillStyle=pen;ctx.fillRect(p[0],p[1],1,1)}}
 cv.onmousedown=function(e){drawing=true;dot(e)};
 cv.onmousemove=function(e){if(drawing)dot(e)};
 document.addEventListener('mouseup',function(){drawing=false});
 bx.appendChild(cv);
 var pal=document.createElement('div');pal.className='paint-pal';
 PAL.forEach(function(c){var s=document.createElement('div');s.className='pc';s.style.background=c;s.onclick=function(){pen=c;cur.textContent=c};pal.appendChild(s)});
 var er=document.createElement('div');er.className='pc eraser';er.title='橡皮';er.onclick=function(){pen='ERASE';cur.textContent='橡皮'};pal.appendChild(er);
 bx.appendChild(pal);
 var cur=document.createElement('div');cur.className='p-cur';cur.textContent='#2B2B2B';pal.appendChild(cur);
 var btns=document.createElement('div');btns.className='paint-btns';
 var cb=document.createElement('button');cb.className='p-b';cb.textContent='清空';cb.onclick=function(){ctx.clearRect(0,0,16,16)};btns.appendChild(cb);
 var eb=document.createElement('button');eb.className='p-b';eb.textContent='导出PNG';eb.onclick=function(){var c2=document.createElement('canvas');c2.width=64;c2.height=64;var x2=c2.getContext('2d');x2.imageSmoothingEnabled=false;x2.drawImage(cv,0,0,64,64);var a=document.createElement('a');a.href=c2.toDataURL('image/png');a.download=rName(n)+'_造型.png';a.click();stTxt.textContent='已导出 PNG'};btns.appendChild(eb);
 var ab=document.createElement('button');ab.className='p-b';ab.textContent='存入库';ab.onclick=function(){var an=prompt('素材名称:',rName(n)+'造型'+(assets().length+1));if(an){var as=assets();as.push({name:an,src:cv.toDataURL('image/png')});if(setAssets(as))stTxt.textContent='已存入素材库'}};btns.appendChild(ab);
 var cc=document.createElement('button');cc.className='p-b';cc.textContent='取消';cc.onclick=function(){ov.remove()};btns.appendChild(cc);
 var sb=document.createElement('button');sb.className='p-b go';sb.textContent='保存';sb.onclick=function(){var src=cv.toDataURL('image/png');
  if(!Array.isArray(n.costumes))n.costumes=[];n.costumes.push({name:'自绘'+(n.costumes.length+1),src:src});n.img=src;
  ov.remove();props();stage();scrL()};btns.appendChild(sb);
 bx.appendChild(btns);ov.appendChild(bx);document.body.appendChild(ov)}
function assets(){try{return JSON.parse(localStorage.getItem('mcratch_assets')||'[]')}catch(e){return[]}}
function setAssets(a){try{localStorage.setItem('mcratch_assets',JSON.stringify(a));return true}catch(e){stTxt.textContent='存储空间不足';return false}}
function assetMgr(n){var oo3=document.querySelector('.paint-ov');if(oo3)oo3.remove();
 var ov=document.createElement('div');ov.className='paint-ov';var bx=document.createElement('div');bx.className='paint fm';
 var hd=document.createElement('b');hd.textContent='素材库';bx.appendChild(hd);
 var cur=document.createElement('div');cur.className='fm-cur';cur.textContent='已保存 '+(assets().length)+' 个素材。点击「使用」应用到 '+rName(n)+' 的造型。';bx.appendChild(cur);
 var lst=document.createElement('div');lst.className='fm-list';
 var as=assets();
 if(!as.length){var em=document.createElement('div');em.className='fm-empty';em.textContent='素材库为空。在绘制器中点「存入库」添加。';lst.appendChild(em)}
 as.forEach(function(a,i){var r=document.createElement('div');r.className='fm-row';
  var d=document.createElement('span');d.className='fm-n';d.textContent=a.name;
  var th=document.createElement('img');th.src=icR(a.src);th.style.cssText='width:24px;height:24px;image-rendering:pixelated;border:1px solid #000';
  var b1=document.createElement('button');b1.className='fm-b go';b1.textContent='使用';b1.onclick=function(){if(!Array.isArray(n.costumes))n.costumes=[];n.costumes.push({name:a.name,src:a.src,raw:1});n.img=a.src;ov.remove();props();stage();scrL()};
  var b2=document.createElement('button');b2.className='fm-b del';b2.textContent='删除';b2.onclick=function(){if(confirm('删除素材「'+a.name+'」？')){var as2=assets();as2.splice(i,1);setAssets(as2);assetMgr(n)}};
  r.appendChild(d);r.appendChild(th);r.appendChild(b1);r.appendChild(b2);lst.appendChild(r)});
 bx.appendChild(lst);
 var btns=document.createElement('div');btns.className='paint-btns';
 var bc=document.createElement('button');bc.className='p-b';bc.textContent='关闭';bc.onclick=function(){ov.remove()};btns.appendChild(bc);
 bx.appendChild(btns);ov.appendChild(bx);document.body.appendChild(ov)}
function save(){try{localStorage.setItem('mcratch_save',JSON.stringify(P));stTxt.textContent='已保存'}catch(e){}}
function saveV(){try{localStorage.setItem('mcratch_save',JSON.stringify(P))}catch(e){}
 var nn=nm.textContent;if(!nn||nn==='未命名项目'){stTxt.textContent='请先在文件管理中新建/保存项目';return}
 var ps=projs(),ex=-1;ps.forEach(function(p,i){if(p.name===nn)ex=i});
 if(ex<0){ps.push({name:nn,time:Date.now(),data:JSON.stringify(P),vers:[{time:Date.now(),data:JSON.stringify(P)}]});if(setProjs(ps))stTxt.textContent='已保存（建立项目版本）'}
 else{var rec=ps[ex];rec.time=Date.now();rec.data=JSON.stringify(P);if(!rec.vers)rec.vers=[];rec.vers.push({time:Date.now(),data:JSON.stringify(P)});if(rec.vers.length>20)rec.vers=rec.vers.slice(-20);ps[ex]=rec;if(setProjs(ps))stTxt.textContent='已保存（版本 +1）'}
}
var OM={'s0':'t0','s1':'t1','s2':'t2','s3':'t3','s4':'t4'};
function cleanArr(arr,dep,chain){if(!Array.isArray(arr))return;dep=dep||0;chain=chain||[];if(dep>20)return;
 for(var i=0;i<arr.length;i++){var b=arr[i];if(!b||typeof b!=='object'||!b.id){arr.splice(i,1);i--;continue}
  if(!BM[b.id]){if(OM[b.id])b.id=OM[b.id];else{arr.splice(i,1);i--;continue}}
  if(!Array.isArray(b.a))b.a=[];if(!Array.isArray(b.c))b.c=[];
  if(b.id==='c3'){var ch3=chain.concat([b]);if(!b.c.length)b.c=[[],[]];
   for(var j=0;j<b.c.length;j++){if(!Array.isArray(b.c[j]))b.c[j]=[];
    for(var q=0;q<b.c[j].length;q++){var sb=b.c[j][q];if(sb&&ch3.indexOf(sb)>=0){b.c[j].splice(q,1);q--}}
    cleanArr(b.c[j],dep+1,ch3)}}
  else if(b.id==='c0'||b.id==='c1'||b.id==='c2'){var ch=chain.concat([b]);
   for(var q2=0;q2<b.c.length;q2++){var sb2=b.c[q2];if(sb2&&ch.indexOf(sb2)>=0){b.c.splice(q2,1);q2--}}
   cleanArr(b.c,dep+1,ch)}}}
function load(){try{var d=localStorage.getItem('mcratch_save');if(d){var o=JSON.parse(d);if(o&&o.scenes){for(var k in P.scenes){var dk=P.scenes[k],ok=o.scenes[k];if(!ok){o.scenes[k]=JSON.parse(JSON.stringify(dk));continue}if(!ok.deco)ok.deco=[];if(!ok.nodes)ok.nodes=dk.nodes;else for(var nk in dk.nodes)if(!ok.nodes[nk])ok.nodes[nk]=JSON.parse(JSON.stringify(dk.nodes[nk]))}o.cur=o.scenes[o.cur]?o.cur:'main';o.vars=o.vars||{};o.vtype=o.vtype||{};o.sel=o.sel||'steve'
  for(var sk in o.scenes)for(var nk2 in o.scenes[sk].nodes){var nd=o.scenes[sk].nodes[nk2];if(!Array.isArray(nd.scr))nd.scr=[];if(!Array.isArray(nd.costumes)){nd.costumes=[];if(nd.img)nd.costumes.push({name:'造型1',src:nd.img})}cleanArr(nd.scr)}
 }P=o;nm.textContent=P.name||'未命名项目'}}catch(e){}}
function keyName(s){s=(s||'').toLowerCase();var m={'空格':' ','向上':'arrowup','上':'arrowup','下':'arrowdown','左':'arrowleft','右':'arrowright'};return m[s]||s}
function keyDown(s){var k=keyName(s);return !!st.keys[k]}
function beep(){if(st.off||!st.aud)return;var c=st.aud,o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=660;g.gain.value=st.vol*0.3;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+0.12)}
function collide(n,o){return Math.abs(n.x-o.x)<((n.cbw||n.size)+(o.cbw||o.size))*0.6&&Math.abs(n.y-o.y)<((n.cbh||n.size)+(o.cbh||o.size))*0.6}
async function val(a,c,d){if(a[0]==='blk')return await ex(a[1],c,d+1);if(a[1]&&typeof a[1]==='object'&&a[1].ex!==undefined){var ev=exprVal(a[1].ex,c.n);return ev===null?0:ev}if(typeof a[1]==='string'){if(a[0]==='t'){var ev2=exprVal(a[1],c.n);return ev2===null?a[1]:ev2}return a[1]}return a[1]}
function exprVal(t,n){t=String(t||'').trim();
 if(t==='鼠标x'||t==='鼠标X'||t==='MouseX')return st.mx||0;
 if(t==='鼠标y'||t==='鼠标Y'||t==='MouseY')return st.my||0;
 if(t==='x位置'||t==='X位置')return n.x;if(t==='y位置'||t==='Y位置')return n.y;
 if(t==='方向'||t==='面向')return n.dir;
 if(t==='随机'||t==='随机数')return Math.random()*100|0;
 if(P.vars&&Object.prototype.hasOwnProperty.call(P.vars,t))return P.vars[t]||0;
 var f=parseFloat(t);return isNaN(f)?null:f}
var exT=null;
function exprLoop(){var s=P.scenes[P.cur];var any=false;
 for(var k in s.nodes){var n=s.nodes[k];if(n.t!=='sprite'||!n.expr)continue;
  for(var q in n.expr){var vv=exprVal(n.expr[q],n);if(vv!==null){n[q]=vv;any=true}}}
 if(any){cl();exT=requestAnimationFrame(exprLoop)}else exT=null}
function startExpr(){if(!exT)exprLoop()}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
function tween(n,tx,ty){return new Promise(function(ok){var s=performance.now(),x=n.x,y=n.y;
 function f(t){if(!st.run){ok();return}var p=Math.min(1,(t-s)/1000);n.x=x+(tx-x)*p;n.y=y+(ty-y)*p;cl();if(p<1)requestAnimationFrame(f);else ok()}
 requestAnimationFrame(f)})}
async function ex(b,c,d,ch){if(!st.run)return;d=d||0;if(d>200)return;var id=b.id,a=b.a,n=c.n,s=P.scenes[P.cur];
 if(isCtl(id)&&ch&&ch.indexOf(id)>=0)return;
 if(b.bp){dbg('⏸ 断点 · '+BM[id][1]);st.pz=1;await new Promise(function(r){st.pzR=r})}
 switch(id){
 case 'mot0':{var d=await val(a[0],c)||0;n.x+=Math.cos(n.dir*Math.PI/180)*d;n.y+=Math.sin(n.dir*Math.PI/180)*d;cl();break}
 case 'mot1':n.dir=(n.dir+(await val(a[0],c)||0))%360;cl();break
 case 'mot2':n.dir=(await val(a[0],c)||0)%360;cl();break
 case 'mot3':n.x=await val(a[0],c)||0;n.y=await val(a[1],c)||0;cl();break
 case 'mot4':await tween(n,await val(a[0],c)||0,await val(a[1],c)||0);break
 case 'mot5':return n.x
 case 'mot6':return n.y
 case 'mot7':n.x=await val(a[0],c)||0;cl();break
 case 'mot8':n.y=await val(a[0],c)||0;cl();break
 case 'mot9':n.x+=(+await val(a[0],c)||0);cl();break
 case 'mot10':n.y+=(+await val(a[0],c)||0);cl();break
 case 'mot11':n.dir=Math.atan2(st.my-n.y,st.mx-n.x)*180/Math.PI;cl();break
 case 'mot12':{var bx0=n.x<0||n.x>W,by0=n.y<0||n.y>H;if(bx0){n.dir=180-n.dir;n.x=Math.max(0,Math.min(W,n.x))}if(by0){n.dir=-n.dir;n.y=Math.max(0,Math.min(H,n.y))}cl();break}
 case 'mot13':n.x=W/2;n.y=H/2;cl();break
 case 'l0':case 'l1':n.say=[await val(a[0],c),Date.now()];cl();await wait(1800);if(n.say&&Date.now()-n.say[1]>=1800)n.say=null;cl();break
 case 'l2':n.show=1;cl();break
 case 'l3':n.show=0;cl();break
 case 'l4':n.size=await val(a[0],c)||56;cl();break
 case 'l5':{var cs=n.costumes||[];if(cs.length>1){var ci=0;for(var i=0;i<cs.length;i++)if(cs[i].src===n.img){ci=i;break}n.img=cs[(ci+1)%cs.length].src}cl();break}
 case 'l6':n.ghost=Math.max(0,Math.min(100,+await val(a[0],c)||0));cl();break
 case 'l7':n.z=+await val(a[0],c)||0;cl();break
 case 'l8':{var cs8=n.costumes||[];if(cs8.length){var ii8=Math.max(0,Math.min(cs8.length-1,(+await val(a[0],c)||1)-1));n.img=cs8[ii8].src}cl();break}
 case 's0':beep();break
 case 's1':st.vol=Math.max(0,Math.min(1,(await val(a[0],c)||50)/100));break
 case 's2':st.off=1;break
 case 's3':{if(st.off||!st.aud)break;var c3=st.aud,o3=c3.createOscillator(),g3=c3.createGain();o3.type='square';o3.frequency.value=Math.max(20,Math.min(20000,+await val(a[0],c)||660));g3.gain.value=st.vol*0.3;o3.connect(g3);g3.connect(c3.destination);o3.start();o3.stop(c3.currentTime+Math.max(0.02,Math.min(5,+await val(a[1],c)||0.12)));break}
 case 's4':st.vol=Math.max(0,Math.min(1,st.vol+(+await val(a[0],c)||0)/100));break
 case 'c0':{var k=await val(a[0],c,d)||0;var ch0=(ch||[]).concat(['c0']);for(var i=0;i<k&&st.run&&!st.pz;i++){for(var j=0;j<b.c.length&&st.run&&!st.pz;j++)await ex(b.c[j],c,d+1,ch0);await wait(50)}break}
 case 'c1':{var ch1=(ch||[]).concat(['c1']);while(st.run&&!st.pz){for(var j=0;j<b.c.length&&st.run&&!st.pz;j++)await ex(b.c[j],c,d+1,ch1);await wait(50)}break}
 case 'c2':{if(await val(a[0],c,d)){var ch2=(ch||[]).concat(['c2']);for(var j=0;j<b.c.length&&st.run;j++)await ex(b.c[j],c,d+1,ch2)}break}
 case 'c3':{if(await val(a[0],c,d)){var ch3=(ch||[]).concat(['c3']);for(var j=0;j<(b.c[0]||[]).length&&st.run;j++)await ex(b.c[0][j],c,d+1,ch3)}else{for(var j=0;j<(b.c[1]||[]).length&&st.run;j++)await ex(b.c[1][j],c,d+1,ch3)}break}
 case 'c4':await wait((await val(a[0],c)||0)*1000);break
 case 'c5':c.st=0;break
 case 'c6':{var ch6=(ch||[]).concat(['c6']);while(st.run&&!st.pz){if(await val(a[0],c,d))break;for(var j=0;j<b.c.length&&st.run;j++)await ex(b.c[j],c,d+1,ch6);await wait(50)}break}
 case 'c7':{while(st.run&&!st.pz){if(await val(a[0],c,d))break;await wait(50)}break}
 case 'se0':return n.x<0||n.x>W||n.y<0||n.y>H
 case 'se1':{var t=await val(a[0],c);for(var k in s.nodes){var o=s.nodes[k];if(o.t==='sprite'&&o!==n&&R[o.r].n===t&&collide(n,o))return true}return false}
 case 'se2':return keyDown(await val(a[0],c))
 case 'se3':return st.mx
 case 'se4':return st.my
 case 'se5':{var rid=await val(a[0],c);for(var k in s.nodes){var o=s.nodes[k];if(o.t==='sprite'&&o!==n&&o.r===rid&&collide(n,o))return true}return false}
 case 'se6':{for(var k in s.nodes){var o=s.nodes[k];if(o.t==='sprite'&&o!==n&&collide(n,o))return true}return false}
 case 'se7':return st.mdown?1:0
 case 'se8':return Math.sqrt((st.mx-n.x)*(st.mx-n.x)+(st.my-n.y)*(st.my-n.y))
 case 'se9':{var rid9=await val(a[0],c);for(var k9 in s.nodes){var o9=s.nodes[k9];if(o9.t==='sprite'&&o9!==n&&o9.r===rid9)return Math.atan2(o9.y-n.y,o9.x-n.x)*180/Math.PI}return 0}
 case 'o0':return(+await val(a[0],c)||0)+(+await val(a[1],c)||0)
 case 'o1':return(+await val(a[0],c)||0)-(+await val(a[1],c)||0)
 case 'o2':return(+await val(a[0],c)||0)*(+await val(a[1],c)||0)
 case 'o3':{var d0=+await val(a[1],c)||0;if(!d0)dbg('⚠ 除以 0');var d2=d0||1;return(+await val(a[0],c)||0)/d2}
 case 'o4':{var x=+await val(a[0],c)||0,y=+await val(a[1],c)||1;if(y<x){var q=x;x=y;y=q}return Math.floor(Math.random()*(y-x+1))+x}
 case 'o5':return(+await val(a[0],c)||0)>(+await val(a[1],c)||0)
 case 'o6':return(+await val(a[0],c)||0)<(+await val(a[1],c)||0)
 case 'o7':return (await val(a[0],c))&&(await val(a[1],c))
 case 'o8':return (await val(a[0],c))||(await val(a[1],c))
 case 'o9':return !(await val(a[0],c))
 case 'o10':{var m0=+await val(a[1],c)||1;return(+await val(a[0],c)||0)%m0}
 case 'o11':return Math.abs(+await val(a[0],c)||0)
 case 'o12':return Math.round(+await val(a[0],c)||0)
 case 'o13':return Math.max(+await val(a[0],c)||0,+await val(a[1],c)||0)
 case 'o14':return Math.min(+await val(a[0],c)||0,+await val(a[1],c)||0)
 case 'o15':return (await val(a[0],c))==(await val(a[1],c))?1:0
 case 'o16':return (await val(a[0],c))!=(await val(a[1],c))?1:0
 case 'v0':{var vn=await val(a[0],c);var ty=await val(a[1],c);if(vn&&!(vn in P.vars)){P.vars[vn]=ty==='str'?'':ty==='list'||ty==='stack'||ty==='queue'?[]:ty==='dict'?{}:0;P.vtype[vn]=ty}break}
 case 'v1':{var nm=await val(a[0],c),vv=await val(a[1],c),t1=P.vtype[nm];if(t1==='str')P.vars[nm]=String(vv);else if(t1==='list'||t1==='stack'||t1==='queue')P.vars[nm]=Array.isArray(vv)?vv.slice():[];else if(t1==='dict')P.vars[nm]=vv&&typeof vv==='object'?Object.assign({},vv):{};else P.vars[nm]=+vv||0;dbg('变量 '+nm+' = '+(P.vars[nm]&&typeof P.vars[nm]==='object'?JSON.stringify(P.vars[nm]):P.vars[nm]));break}
 case 'v2':{var vn2=await val(a[0],c);P.vars[vn2]=(+P.vars[vn2]||0)+(+await val(a[1],c)||0);dbg('变量 '+vn2+' = '+P.vars[vn2]);break}
 case 'v3':{var vn3=await val(a[0],c);if(!(vn3 in P.vars))dbg('⚠ 未声明变量: '+vn3);return P.vars[vn3]!==undefined?P.vars[vn3]:0}
 case 'v4':{var nm4=await val(a[0],c),vv4=await val(a[1],c),v4=P.vars[nm4];if(Array.isArray(v4))v4.push(vv4);else if(v4&&typeof v4==='object')v4[String(vv4)]=0;dbg('追加 '+nm4);break}
 case 'v5':{var nm5=await val(a[0],c),v5=P.vars[nm5];if(!Array.isArray(v5))return 0;return P.vtype[nm5]==='queue'?v5.shift():v5.pop()}
 case 'v6':{var nm6=await val(a[0],c),k6=await val(a[1],c),v6=P.vars[nm6];if(Array.isArray(v6)){var i6=+k6||0;return v6[i6]!==undefined?v6[i6]:0}if(v6&&typeof v6==='object'){var kk6=String(k6);return v6[kk6]!==undefined?v6[kk6]:0}return 0}
 case 'v7':{var nm7=await val(a[0],c),k7=await val(a[1],c),vv7=await val(a[2],c),v7=P.vars[nm7];if(Array.isArray(v7))v7[+k7||0]=vv7;else if(v7&&typeof v7==='object')v7[String(k7)]=vv7;break}
 case 'v8':{var nm8=await val(a[0],c),v8=P.vars[nm8];if(Array.isArray(v8))return v8.length;if(v8&&typeof v8==='object')return Object.keys(v8).length;return 0}
 case 'v9':{var nm9=await val(a[0],c),vv9=await val(a[1],c),v9=P.vars[nm9];if(Array.isArray(v9))return v9.indexOf(vv9)>=0?1:0;if(v9&&typeof v9==='object')return String(vv9) in v9?1:0;return 0}
 case 'v10':{var nm10=await val(a[0],c),v10=P.vars[nm10];if(Array.isArray(v10))v10.length=0;else if(v10&&typeof v10==='object')for(var q10 in v10)delete v10[q10];break}
 case 'v11':{var na11=await val(a[0],c),nb11=await val(a[1],c),ta11=P.vars[na11];P.vars[na11]=P.vars[nb11];P.vars[nb11]=ta11;var tya11=P.vtype[na11];P.vtype[na11]=P.vtype[nb11];P.vtype[nb11]=tya11;break}
 case 't0':return String(await val(a[0],c)||'')+String(await val(a[1],c)||'')
 case 't1':return String(await val(a[0],c)||0)
 case 't2':{var sv=+await val(a[0],c)||0;return sv}
 case 't3':return String(await val(a[0],c)||'').length
 case 't4':{var st4=String(await val(a[0],c)||'');var fr=parseInt(await val(a[1],c))||0;var ln=parseInt(await val(a[2],c))||0;return st4.substr(fr,ln)}
 case 't5':return String(await val(a[0],c)||'').toUpperCase()
 case 't6':return String(await val(a[0],c)||'').toLowerCase()
 case 't7':return String(await val(a[0],c)||'').split('').reverse().join('')
 case 't8':return String(await val(a[0],c)||'').indexOf(String(await val(a[1],c)||''))>=0?1:0
 case 'n0':{var nn=await val(a[0],c)||'新节点';var rk=await val(a[1],c)||'steve';if(!R[rk])rk='steve';var id=nn+'_'+(Math.random()*1e4|0);var scn=null;for(var k in s.nodes){if(s.nodes[k].t==='scene'){scn=s.nodes[k];break}}s.nodes[id]={id:id,n:nn,t:'sprite',r:rk,x:150,y:120,dir:0,size:48,show:1,scr:[],c:[]};if(scn)scn.c.push(id);render();break}
 case 'n1':break
 case 'n2':{var tn=await val(a[0],c),tx=await val(a[1],c)||0,ty=await val(a[2],c)||0;for(var k in s.nodes){var o=s.nodes[k];if(o.n===tn||o.id===tn){o.x=tx;o.y=ty}}cl();break}
 case 'n3':{var tn2=await val(a[0],c),pr=await val(a[1],c);for(var k in s.nodes){var o=s.nodes[k];if(o.n===tn2||o.id===tn2)return o[pr]!==undefined?o[pr]:''}return ''}
 case 'n4':{var t3=await val(a[0],c);var map={主世界:'main',main:'main',洞穴:'cave',cave:'cave',村庄:'village',village:'village'};if(map[t3]&&P.scenes[map[t3]]){P.cur=map[t3];st.cam={x:0,y:0,z:1};render();size()}break}
 case 'n5':{var t4=await val(a[0],c)||'草';s.deco.push({x:Math.random()*(W-40),y:Math.random()*(H-40),w:32,h:32,t:t4==='stone'?'stone':t4==='plank'?'plank':'grass'});stage();break}
 case 'n6':s.deco.pop();stage();break
 case 'n7':{var nn7={id:n.n+'_'+(Math.random()*1e4|0),n:n.n,t:'sprite',r:n.r,x:n.x+20,y:n.y,dir:n.dir,size:n.size,show:1,img:n.img,costumes:n.costumes?n.costumes.slice():null,raw:n.raw,scr:[],c:[]};s.nodes[nn7.id]=nn7;stage();break}
 case 'evt3':bc(await val(a[0],c));break}
 }
async function runScr(n){if(!st.run)return;var c={n:n,st:st};for(var i=0;i<n.scr.length&&st.run;i++){var b=n.scr[i];if(b&&b.id==='evt0'){for(var j=i+1;j<n.scr.length&&st.run;j++){var b2=n.scr[j];if(isEvt(b2.id))break;rMark(b2);await ex(b2,c);rClr(b2)}}}}
function bc(m){var s=P.scenes[P.cur];for(var k in s.nodes){var n=s.nodes[k];if(n.t==='sprite'&&n.scr){for(var i=0;i<n.scr.length;i++){var b=n.scr[i];if(b.id==='evt2'&&b.a&&b.a[0]&&b.a[0][1]===m)fire(n,i)}}}}
function fire(n,i){var c={n:n,st:st};(async function(){for(var j=i+1;j<n.scr.length&&st.run;j++){var b=n.scr[j];if(isEvt(b.id))break;rMark(b);await ex(b,c);rClr(b)}})()}
function runAt(n,i){st.run=1;var c={n:n,st:st};(async function(){for(var j=i;j<n.scr.length&&st.run;j++){var b=n.scr[j];if(isEvt(b.id))break;rMark(b);await ex(b,c);rClr(b)}if(st.run&&!st.pz){st.run=0;rClrAll();stTxt.textContent='完成'}})()}
var Cm=null;
function ctxShow(e,b,sc){if(!Cm){Cm=document.createElement('div');Cm.className='ctxm';document.body.appendChild(Cm)}Cm.innerHTML='';var its=[['复制',function(){if(!sc||!sc.arr)return;var cp=JSON.parse(JSON.stringify(b));sc.arr.push(cp);render()}],['删除',function(){if(!sc||!sc.arr)return;var ix=sc.arr.indexOf(b);if(ix>=0)sc.arr.splice(ix,1);render()}],['添加注释',function(){if(b.note===undefined)b.note='';render()}]];if(b.note!==undefined)its.push(['删除注释',function(){delete b.note;render()}]);
 for(var i=0;i<its.length;i++){var it=document.createElement('div');it.className='ci';it.textContent=its[i][0];(function(f){it.onclick=function(){Cm.style.display='none';f()}})(its[i][1]);Cm.appendChild(it)}
 Cm.style.left=e.clientX+'px';Cm.style.top=e.clientY+'px';Cm.style.display='block'}
async function runAll(){if(st.run)return;st.run=1;dbgInit();dbg('▶ 运行');if(!monT)monLoop();stTxt.textContent='运行中';if(!st.aud){try{st.aud=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}
 var s=P.scenes[P.cur],ps=[];
 for(var k in s.nodes){var n=s.nodes[k];if(n.t==='sprite'&&n.scr&&n.scr.length)ps.push(runScr(n))}
 await Promise.all(ps);if(st.run&&!st.pz){st.run=0;rClrAll();stTxt.textContent='完成';monUI()}}
function stop(){st.run=0;st.pz=0;rClrAll();if(st.pzR){var r=st.pzR;st.pzR=null;r()}dbg('■ 停止');monUI();stTxt.textContent='已停止'}
$('runB').onclick=runAll;$('stopB').onclick=stop;
$('saveB').onclick=saveV;
$('newB').onclick=function(){P={name:'未命名项目',cur:'main',vars:{},vtype:{},sel:'steve',scenes:P.scenes};nm.textContent='未命名项目';render();stTxt.textContent='已新建'};
$('foldB').onclick=function(){var os=cats.querySelectorAll('.cat');for(var i=0;i<os.length;i++)os[i].classList.toggle('open')};
document.onclick=function(){if(Cm)Cm.style.display='none'};
$('bin').ondragover=function(e){e.preventDefault();$('bin').classList.add('over')};$('bin').ondragleave=function(){this.classList.remove('over')};$('bin').ondrop=function(e){e.preventDefault();this.classList.remove('over');if(!drag)return;if(drag.s){var src=drag;src.a.splice(src.i,src.ln||1)}drag=null;render()};
var SC=['main','cave','village'];
$('scPrev').onclick=function(){P.cur=SC[(SC.indexOf(P.cur)+2)%3];st.cam={x:0,y:0,z:1};render();size()};
$('scNext').onclick=function(){P.cur=SC[(SC.indexOf(P.cur)+1)%3];st.cam={x:0,y:0,z:1};render();size()};
function addRole(rk){var s=P.scenes[P.cur];var id=rk+'_'+(Math.random()*1e4|0);var scn=null;for(var k in s.nodes){if(s.nodes[k].t==='scene'){scn=s.nodes[k];break}}
 s.nodes[id]={id:id,n:R[rk].n,t:'sprite',r:rk,x:120+Math.random()*160,y:90+Math.random()*140,dir:0,size:48,show:1,scr:[],c:[]};if(scn)scn.c.push(id);P.sel=id;rp.style.display='none';render()}
$('scAdd').onclick=function(){var nv=prompt('场景名称:');if(!nv)return;var gv=(prompt('地面类型（草/石/木板）:')||'草');var key='sc_'+(Math.random()*1e4|0);P.scenes[key]={name:nv,ground:gv.indexOf('石')>=0?'stone':gv.indexOf('板')>=0?'plank':'grass',deco:[],nodes:{root:{id:'root',n:'根',t:'root',c:['scn']},scn:{id:'scn_'+key,n:nv,t:'scene',c:[]}}};SC.push(key);P.cur=key;st.cam={x:0,y:0,z:1};render();size()};
function showCustForm(){rp.innerHTML='';var f=document.createElement('div');f.className='rp-form';
 var t=document.createElement('div');t.textContent='自定义角色';t.style.cssText='color:#DFF2D4;font-size:11px;letter-spacing:1px';f.appendChild(t);
 var ni=document.createElement('input');ni.className='slot';ni.placeholder='名称';f.appendChild(ni);
 var ui=document.createElement('input');ui.className='slot';ui.placeholder='图片URL（可选）';f.appendChild(ui);
 var fi=document.createElement('input');fi.type='file';fi.accept='image/*';f.appendChild(fi);
 var add=document.createElement('button');add.className='mc-btn';add.style.cssText='margin-top:4px';add.textContent='添加';add.onclick=function(){
  var nmv=ni.value||('角色'+(Object.keys(R).length+1));
  if(fi.files&&fi.files[0]){var fr=new FileReader();fr.onload=function(){addCustom(nmv,fr.result)};fr.readAsDataURL(fi.files[0])}
  else addCustom(nmv,ui.value||'')};f.appendChild(add);
 var back=document.createElement('button');back.className='mc-btn';back.style.cssText='margin-top:2px';back.textContent='← 返回';back.onclick=function(){rp.style.display='none'};f.appendChild(back);
 rp.appendChild(f)}
function addCustom(name,src){var s=P.scenes[P.cur];var id='cst_'+(Math.random()*1e4|0);var scn=null;for(var k in s.nodes){if(s.nodes[k].t==='scene'){scn=s.nodes[k];break}}
 s.nodes[id]={id:id,n:name,t:'sprite',r:'steve',img:src,raw:1,x:120+Math.random()*160,y:90+Math.random()*140,dir:0,size:48,show:1,scr:[],c:[]};if(scn)scn.c.push(id);P.sel=id;rp.style.display='none';render()}
$('addR').onclick=function(){if(rp.style.display!=='none'){rp.style.display='none';return}rp.innerHTML='';
 for(var k in R){var b=document.createElement('button');b.className='rp-b';b.innerHTML='<img src="data:image/svg+xml;utf8,'+encodeURIComponent(R[k].s)+'" draggable="false">'+R[k].n;b.onclick=(function(r){return function(){addRole(r)}})(k);rp.appendChild(b)}
 var cb=document.createElement('button');cb.className='rp-b';cb.style.cssText='grid-column:1/-1';cb.innerHTML='<span style="font-size:20px;line-height:1">＋</span>自定义';cb.onclick=showCustForm;rp.appendChild(cb);
 rp.style.display='grid'};
world.addEventListener('mousemove',function(e){var r=world.getBoundingClientRect();st.mx=(e.clientX-r.left-st.cam.x)/st.cam.z;st.my=(e.clientY-r.top-st.cam.y)/st.cam.z;
 if(st.dragN){var dn=P.scenes[P.cur].nodes[st.dragN];if(dn){if(Math.abs(e.clientX-st.dragX)+Math.abs(e.clientY-st.dragY)>6)st.dragM=true;dn.x=st.mx;dn.y=st.my;cl()}}});
world.addEventListener('mouseup',function(){st.mdown=0;if(st.dragN){if(st.dragM)st.suppress=1;var d=st.dragN;st.dragN=null;setTimeout(function(){if(!st.dragN)st.suppress=0},30)}});
world.addEventListener('mousedown',function(){st.mdown=1});
world.addEventListener('wheel',function(e){e.preventDefault();var z=st.cam.z*(e.deltaY<0?1.1:0.9);st.cam.z=Math.max(0.4,Math.min(2.5,z));updCam()},{passive:false});
window.addEventListener('keydown',function(e){var k=e.key.toLowerCase();st.keys[k]=1;if(e.key===' '||e.key.indexOf('Arrow')===0)e.preventDefault();
 var sp=28/st.cam.z;if(k==='w')st.cam.y+=sp;else if(k==='s')st.cam.y-=sp;else if(k==='a')st.cam.x+=sp;else if(k==='d')st.cam.x-=sp;updCam()});
window.addEventListener('keyup',function(e){st.keys[e.key.toLowerCase()]=0});
window.addEventListener('resize',size);
function projs(){try{return JSON.parse(localStorage.getItem('mcratch_projs')||'[]')}catch(e){return[]}}
function setProjs(a){try{localStorage.setItem('mcratch_projs',JSON.stringify(a));return true}catch(e){stTxt.textContent='存储空间不足';return false}}
function expProj(name,data){var b=new Blob([data],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name+'.mcratch';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
var CORE=[
'var R='+JSON.stringify(R)+';',
'var B='+JSON.stringify(B)+';var BM={};for(var i=0;i<B.length;i++){var a=B[i];for(var j=0;j<a.length;j++)BM[a[j][0]]=a[j]}',
'function isCtl(id){return id===\'c0\'||id===\'c1\'||id===\'c2\'||id===\'c3\'}',
'function isEvt(id){return id===\'evt0\'||id===\'evt1\'||id===\'evt2\'}',
'var P=SAVE,st={run:0,cam:{x:0,y:0,z:1},mx:0,my:0,keys:{},vol:0.5,aud:null,off:0,mdown:0};',
'var W=0,H=0,ndm={};',
'function rSrc(n){var u;if(n.img)u=n.img;else if(n.costumes&&n.costumes.length)u=n.costumes[0].src;else return \'data:image/svg+xml;utf8,\'+encodeURIComponent(R[n.r].s);return icR(u)}',
'var IC={};\nfunction icR(u){if(!u||u.indexOf(\'data:\')===0||IC[u]===u)return u;if(IC[u])return IC[u];IC[u]=\'\';var im=new Image();im.onload=function(){if(IC[u]!==\'\')return;try{var c2=document.createElement(\'canvas\');c2.width=im.naturalWidth||64;c2.height=im.naturalHeight||64;var x2=c2.getContext(\'2d\');x2.imageSmoothingEnabled=false;x2.drawImage(im,0,0);IC[u]=c2.toDataURL(\'image/png\')}catch(e){IC[u]=u}if(IC[u]!==u)cl()};im.onerror=function(){IC[u]=u};im.src=u;return u}',
'function rName(n){return n.n||R[n.r].n}',
'function groundBg(g){if(g===\'stone\')return \'repeating-linear-gradient(0deg,#5E5E5E 0 24px,#555 24px 48px),repeating-linear-gradient(90deg,transparent 0 24px,rgba(0,0,0,.12) 24px 48px)\';if(g===\'plank\')return \'repeating-linear-gradient(90deg,#A6784C 0 24px,#98683F 24px 48px),repeating-linear-gradient(0deg,transparent 0 24px,rgba(0,0,0,.15) 24px 48px)\';return \'repeating-linear-gradient(0deg,#83B45C 0 24px,#77A84F 24px 48px),repeating-linear-gradient(90deg,transparent 0 24px,rgba(0,0,0,.06) 24px 48px)\'}',
'function blockBg(t){if(t===\'stone\')return \'#8A8A8A\';if(t===\'plank\')return \'#A6784C\';return \'#7BA55D\'}',
'function keyName(s){s=(s||\'\').toLowerCase();var m={\'空格\':\' \',\'向上\':\'arrowup\',\'上\':\'arrowup\',\'下\':\'arrowdown\',\'左\':\'arrowleft\',\'右\':\'arrowright\'};return m[s]||s}',
'function keyDown(s){var k=keyName(s);return !!st.keys[k]}',
'function beep(){if(st.off||!st.aud)return;var c=st.aud,o=c.createOscillator(),g=c.createGain();o.type=\'square\';o.frequency.value=660;g.gain.value=st.vol*0.3;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+0.12)}',
'function collide(n,o){return Math.abs(n.x-o.x)<((n.cbw||n.size)+(o.cbw||o.size))*0.6&&Math.abs(n.y-o.y)<((n.cbh||n.size)+(o.cbh||o.size))*0.6}',
'async function val(a,c,d){if(a[0]===\'blk\')return await ex(a[1],c,d+1);if(a[1]&&typeof a[1]===\'object\'&&a[1].ex!==undefined){var ev=exprVal(a[1].ex,c.n);return ev===null?0:ev}if(typeof a[1]===\'string\'){if(a[0]===\'t\'){var ev2=exprVal(a[1],c.n);return ev2===null?a[1]:ev2}return a[1]}return a[1]}',
'function exprVal(t,n){t=String(t||\'\').trim();if(t===\'鼠标x\'||t===\'鼠标X\'||t===\'MouseX\')return st.mx||0;if(t===\'鼠标y\'||t===\'鼠标Y\'||t===\'MouseY\')return st.my||0;if(t===\'x位置\'||t===\'X位置\')return n.x;if(t===\'y位置\'||t===\'Y位置\')return n.y;if(t===\'方向\'||t===\'面向\')return n.dir;if(t===\'随机\'||t===\'随机数\')return Math.random()*100|0;if(P.vars&&Object.prototype.hasOwnProperty.call(P.vars,t))return P.vars[t]||0;var f=parseFloat(t);return isNaN(f)?null:f}',
'var exT=null;function exprLoop(){var s=P.scenes[P.cur],any=false;for(var k in s.nodes){var n=s.nodes[k];if(n.t!==\'sprite\'||!n.expr)continue;for(var q in n.expr){var vv=exprVal(n.expr[q],n);if(vv!==null){n[q]=vv;any=true}}}if(any){cl();exT=requestAnimationFrame(exprLoop)}else exT=null}function startExpr(){if(!exT)exprLoop()}',
'function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}',
'function tween(n,tx,ty){return new Promise(function(ok){var s=performance.now(),x=n.x,y=n.y;function f(t){if(!st.run){ok();return}var p=Math.min(1,(t-s)/1000);n.x=x+(tx-x)*p;n.y=y+(ty-y)*p;cl();if(p<1)requestAnimationFrame(f);else ok()}requestAnimationFrame(f)})}',
'async function ex(b,c,d,ch){if(!st.run)return;d=d||0;if(d>200)return;var id=b.id,a=b.a,n=c.n,s=P.scenes[P.cur];if(isCtl(id)&&ch&&ch.indexOf(id)>=0)return;switch(id){case \'mot0\':{var d=await val(a[0],c)||0;n.x+=Math.cos(n.dir*Math.PI/180)*d;n.y+=Math.sin(n.dir*Math.PI/180)*d;cl();break}case \'mot1\':n.dir=(n.dir+(await val(a[0],c)||0))%360;cl();break;case \'mot2\':n.dir=(await val(a[0],c)||0)%360;cl();break;case \'mot3\':n.x=await val(a[0],c)||0;n.y=await val(a[1],c)||0;cl();break;case \'mot4\':await tween(n,await val(a[0],c)||0,await val(a[1],c)||0);break;case \'mot5\':return n.x;case \'mot6\':return n.y;case \'mot7\':n.x=await val(a[0],c)||0;cl();break;case \'mot8\':n.y=await val(a[0],c)||0;cl();break;case \'mot9\':n.x+=(+await val(a[0],c)||0);cl();break;case \'mot10\':n.y+=(+await val(a[0],c)||0);cl();break;case \'mot11\':n.dir=Math.atan2(st.my-n.y,st.mx-n.x)*180/Math.PI;cl();break;case \'mot12\':{var bx0=n.x<0||n.x>W,by0=n.y<0||n.y>H;if(bx0){n.dir=180-n.dir;n.x=Math.max(0,Math.min(W,n.x))}if(by0){n.dir=-n.dir;n.y=Math.max(0,Math.min(H,n.y))}cl();break}case \'mot13\':n.x=W/2;n.y=H/2;cl();break;case \'l0\':case \'l1\':n.say=[await val(a[0],c),Date.now()];cl();await wait(1800);if(n.say&&Date.now()-n.say[1]>=1800)n.say=null;cl();break;case \'l2\':n.show=1;cl();break;case \'l3\':n.show=0;cl();break;case \'l4\':n.size=await val(a[0],c)||56;cl();break;case \'l5\':{var cs=n.costumes||[];if(cs.length>1){var ci=0;for(var i=0;i<cs.length;i++)if(cs[i].src===n.img){ci=i;break}n.img=cs[(ci+1)%cs.length].src}cl();break}case \'l6\':n.ghost=Math.max(0,Math.min(100,+await val(a[0],c)||0));cl();break;case \'l7\':n.z=+await val(a[0],c)||0;cl();break;case \'l8\':{var cs8=n.costumes||[];if(cs8.length){var ii8=Math.max(0,Math.min(cs8.length-1,(+await val(a[0],c)||1)-1));n.img=cs8[ii8].src}cl();break}case \'s0\':beep();break;case \'s1\':st.vol=Math.max(0,Math.min(1,(await val(a[0],c)||50)/100));break;case \'s2\':st.off=1;break;case \'s3\':{if(st.off||!st.aud)break;var c3=st.aud,o3=c3.createOscillator(),g3=c3.createGain();o3.type=\'square\';o3.frequency.value=Math.max(20,Math.min(20000,+await val(a[0],c)||660));g3.gain.value=st.vol*0.3;o3.connect(g3);g3.connect(c3.destination);o3.start();o3.stop(c3.currentTime+Math.max(0.02,Math.min(5,+await val(a[1],c)||0.12)));break}case \'s4\':st.vol=Math.max(0,Math.min(1,st.vol+(+await val(a[0],c)||0)/100));break;case \'c0\':{var k=await val(a[0],c,d)||0;var ch0=(ch||[]).concat([\'c0\']);for(var i=0;i<k&&st.run;i++){for(var j=0;j<b.c.length&&st.run;j++)await ex(b.c[j],c,d+1,ch0);await wait(50)}break}case \'c1\':{var ch1=(ch||[]).concat([\'c1\']);while(st.run){for(var j=0;j<b.c.length&&st.run;j++)await ex(b.c[j],c,d+1,ch1);await wait(50)}break}case \'c2\':{if(await val(a[0],c,d)){var ch2=(ch||[]).concat([\'c2\']);for(var j=0;j<b.c.length&&st.run;j++)await ex(b.c[j],c,d+1,ch2)}break}case \'c3\':{if(await val(a[0],c,d)){var ch3=(ch||[]).concat([\'c3\']);for(var j=0;j<(b.c[0]||[]).length&&st.run;j++)await ex(b.c[0][j],c,d+1,ch3)}else{for(var j=0;j<(b.c[1]||[]).length&&st.run;j++)await ex(b.c[1][j],c,d+1,ch3)}break}case \'c4\':await wait((await val(a[0],c)||0)*1000);break;case \'c5\':c.st=0;break;case \'c6\':{var ch6=(ch||[]).concat([\'c6\']);while(st.run){if(await val(a[0],c,d))break;for(var j=0;j<b.c.length&&st.run;j++)await ex(b.c[j],c,d+1,ch6);await wait(50)}break}case \'c7\':{while(st.run){if(await val(a[0],c,d))break;await wait(50)}break}case \'se0\':return n.x<0||n.x>W||n.y<0||n.y>H;case \'se1\':{var t=await val(a[0],c);for(var k in s.nodes){var o=s.nodes[k];if(o.t===\'sprite\'&&o!==n&&R[o.r].n===t&&collide(n,o))return true}return false}case \'se2\':return keyDown(await val(a[0],c));case \'se3\':return st.mx;case \'se4\':return st.my;case \'se5\':{var rid=await val(a[0],c);for(var k in s.nodes){var o=s.nodes[k];if(o.t===\'sprite\'&&o!==n&&o.r===rid&&collide(n,o))return true}return false}case \'se6\':{for(var k in s.nodes){var o=s.nodes[k];if(o.t===\'sprite\'&&o!==n&&collide(n,o))return true}return false}case \'se7\':return st.mdown?1:0;case \'se8\':return Math.sqrt((st.mx-n.x)*(st.mx-n.x)+(st.my-n.y)*(st.my-n.y));case \'se9\':{var rid9=await val(a[0],c);for(var k9 in s.nodes){var o9=s.nodes[k9];if(o9.t===\'sprite\'&&o9!==n&&o9.r===rid9)return Math.atan2(o9.y-n.y,o9.x-n.x)*180/Math.PI}return 0}case \'o0\':return(+await val(a[0],c)||0)+(+await val(a[1],c)||0);case \'o1\':return(+await val(a[0],c)||0)-(+await val(a[1],c)||0);case \'o2\':return(+await val(a[0],c)||0)*(+await val(a[1],c)||0);case \'o3\':{var d0=+await val(a[1],c)||0;var d2=d0||1;return(+await val(a[0],c)||0)/d2}case \'o4\':{var x=+await val(a[0],c)||0,y=+await val(a[1],c)||1;if(y<x){var q=x;x=y;y=q}return Math.floor(Math.random()*(y-x+1))+x}case \'o5\':return(+await val(a[0],c)||0)>(+await val(a[1],c)||0);case \'o6\':return(+await val(a[0],c)||0)<(+await val(a[1],c)||0);case \'o7\':return (await val(a[0],c))&&(await val(a[1],c));case \'o8\':return (await val(a[0],c))||(await val(a[1],c));case \'o9\':return !(await val(a[0],c));case \'o10\':{var m0=+await val(a[1],c)||1;return(+await val(a[0],c)||0)%m0}case \'o11\':return Math.abs(+await val(a[0],c)||0);case \'o12\':return Math.round(+await val(a[0],c)||0);case \'o13\':return Math.max(+await val(a[0],c)||0,+await val(a[1],c)||0);case \'o14\':return Math.min(+await val(a[0],c)||0,+await val(a[1],c)||0);case \'o15\':return (await val(a[0],c))==(await val(a[1],c))?1:0;case \'o16\':return (await val(a[0],c))!=(await val(a[1],c))?1:0;case \'v0\':{var vn=await val(a[0],c);var ty=await val(a[1],c);if(vn&&!(vn in P.vars)){P.vars[vn]=ty===\'str\'?\'\':ty===\'list\'||ty===\'stack\'||ty===\'queue\'?[]:ty===\'dict\'?{}:0;P.vtype[vn]=ty}break}case \'v1\':{var nm=await val(a[0],c),vv=await val(a[1],c),t1=P.vtype[nm];if(t1===\'str\')P.vars[nm]=String(vv);else if(t1===\'list\'||t1===\'stack\'||t1===\'queue\')P.vars[nm]=Array.isArray(vv)?vv.slice():[];else if(t1===\'dict\')P.vars[nm]=vv&&typeof vv===\'object\'?Object.assign({},vv):{};else P.vars[nm]=+vv||0;break}case \'v2\':{var vn2=await val(a[0],c);P.vars[vn2]=(+P.vars[vn2]||0)+(+await val(a[1],c)||0);break}case \'v3\':return P.vars[await val(a[0],c)]!==undefined?P.vars[await val(a[0],c)]:0;case \'v4\':{var nm4=await val(a[0],c),vv4=await val(a[1],c),v4=P.vars[nm4];if(Array.isArray(v4))v4.push(vv4);else if(v4&&typeof v4===\'object\')v4[String(vv4)]=0;break}case \'v5\':{var nm5=await val(a[0],c),v5=P.vars[nm5];if(!Array.isArray(v5))return 0;return P.vtype[nm5]===\'queue\'?v5.shift():v5.pop()}case \'v6\':{var nm6=await val(a[0],c),k6=await val(a[1],c),v6=P.vars[nm6];if(Array.isArray(v6)){var i6=+k6||0;return v6[i6]!==undefined?v6[i6]:0}if(v6&&typeof v6===\'object\'){var kk6=String(k6);return v6[kk6]!==undefined?v6[kk6]:0}return 0}case \'v7\':{var nm7=await val(a[0],c),k7=await val(a[1],c),vv7=await val(a[2],c),v7=P.vars[nm7];if(Array.isArray(v7))v7[+k7||0]=vv7;else if(v7&&typeof v7===\'object\')v7[String(k7)]=vv7;break}case \'v8\':{var nm8=await val(a[0],c),v8=P.vars[nm8];if(Array.isArray(v8))return v8.length;if(v8&&typeof v8===\'object\')return Object.keys(v8).length;return 0}case \'v9\':{var nm9=await val(a[0],c),vv9=await val(a[1],c),v9=P.vars[nm9];if(Array.isArray(v9))return v9.indexOf(vv9)>=0?1:0;if(v9&&typeof v9===\'object\')return String(vv9) in v9?1:0;return 0}case \'v10\':{var nm10=await val(a[0],c),v10=P.vars[nm10];if(Array.isArray(v10))v10.length=0;else if(v10&&typeof v10===\'object\')for(var q10 in v10)delete v10[q10];break}case \'v11\':{var na11=await val(a[0],c),nb11=await val(a[1],c),ta11=P.vars[na11];P.vars[na11]=P.vars[nb11];P.vars[nb11]=ta11;var tya11=P.vtype[na11];P.vtype[na11]=P.vtype[nb11];P.vtype[nb11]=tya11;break}case \'t0\':return String(await val(a[0],c)||\'\')+String(await val(a[1],c)||\'\');case \'t1\':return String(await val(a[0],c)||0);case \'t2\':{var sv=+await val(a[0],c)||0;return sv}case \'t3\':return String(await val(a[0],c)||\'\').length;case \'t4\':{var st4=String(await val(a[0],c)||\'\');var fr=parseInt(await val(a[1],c))||0;var ln=parseInt(await val(a[2],c))||0;return st4.substr(fr,ln)}case \'t5\':return String(await val(a[0],c)||\'\').toUpperCase();case \'t6\':return String(await val(a[0],c)||\'\').toLowerCase();case \'t7\':return String(await val(a[0],c)||\'\').split(\'\').reverse().join(\'\');case \'t8\':return String(await val(a[0],c)||\'\').indexOf(String(await val(a[1],c)||\'\'))>=0?1:0;case \'n0\':{var nn=await val(a[0],c)||\'新节点\';var rk=await val(a[1],c)||\'steve\';if(!R[rk])rk=\'steve\';var id=nn+\'_\'+(Math.random()*1e4|0);var scn=null;for(var k in s.nodes){if(s.nodes[k].t===\'scene\'){scn=s.nodes[k];break}}s.nodes[id]={id:id,n:nn,t:\'sprite\',r:rk,x:150,y:120,dir:0,size:48,show:1,scr:[],c:[]};if(scn)scn.c.push(id);stage();break}case \'n1\':break;case \'n2\':{var tn=await val(a[0],c),tx=await val(a[1],c)||0,ty=await val(a[2],c)||0;for(var k in s.nodes){var o=s.nodes[k];if(o.n===tn||o.id===tn){o.x=tx;o.y=ty}}cl();break}case \'n3\':{var tn2=await val(a[0],c),pr=await val(a[1],c);for(var k in s.nodes){var o=s.nodes[k];if(o.n===tn2||o.id===tn2)return o[pr]!==undefined?o[pr]:\'\'}return \'\'}case \'n4\':{var t3=await val(a[0],c);if(t3===\'主世界\'||t3===\'main\'){if(P.scenes.main){P.cur=\'main\';st.cam={x:0,y:0,z:1};stage();size()}}else if((t3===\'洞穴\'||t3===\'cave\')&&P.scenes.cave){P.cur=\'cave\';st.cam={x:0,y:0,z:1};stage();size()}else if((t3===\'村庄\'||t3===\'village\')&&P.scenes.village){P.cur=\'village\';st.cam={x:0,y:0,z:1};stage();size()}break}case \'n5\':{var t4=await val(a[0],c)||\'草\';s.deco.push({x:Math.random()*(W-40),y:Math.random()*(H-40),w:32,h:32,t:t4===\'stone\'?\'stone\':t4===\'plank\'?\'plank\':\'grass\'});stage();break}case \'n6\':s.deco.pop();stage();break;case \'n7\':{var nn7={id:n.n+\'_\'+(Math.random()*1e4|0),n:n.n,t:\'sprite\',r:n.r,x:n.x+20,y:n.y,dir:n.dir,size:n.size,show:1,img:n.img,costumes:n.costumes?n.costumes.slice():null,raw:n.raw,scr:[],c:[]};s.nodes[nn7.id]=nn7;stage();break}case \'evt3\':bc(await val(a[0],c));break}}',
'async function runScr(n){if(!st.run)return;var c={n:n,st:st};for(var i=0;i<n.scr.length&&st.run;i++){var b=n.scr[i];if(b&&b.id===\'evt0\'){for(var j=i+1;j<n.scr.length&&st.run;j++){var b2=n.scr[j];if(isEvt(b2.id))break;await ex(b2,c)}}}}',
'function bc(m){var s=P.scenes[P.cur];for(var k in s.nodes){var n=s.nodes[k];if(n.t===\'sprite\'&&n.scr){for(var i=0;i<n.scr.length;i++){var b=n.scr[i];if(b.id===\'evt2\'&&b.a&&b.a[0]&&b.a[0][1]===m)fire(n,i)}}}}',
'function fire(n,i){var c={n:n,st:st};(async function(){for(var j=i+1;j<n.scr.length&&st.run;j++){var b=n.scr[j];if(isEvt(b.id))break;await ex(b,c)}})()}',
'async function runAll(){if(st.run)return;st.run=1;stt.textContent=\'运行中\';if(!st.aud){try{st.aud=new(window.AudioContext||window.webkitAudioContext)}catch(e){}}var s=P.scenes[P.cur],ps=[];for(var k in s.nodes){var n=s.nodes[k];if(n.t===\'sprite\'&&n.scr&&n.scr.length)ps.push(runScr(n))}await Promise.all(ps);if(st.run){st.run=0;stt.textContent=\'完成\'}}',
'function stop(){st.run=0;stt.textContent=\'已停止\'}',
'function size(){W=world.clientWidth||300;H=world.clientHeight||220}',
'function updCam(){var wc=document.getElementById(\'wcam\');if(wc)wc.style.transform=\'translate(\'+st.cam.x+\'px,\'+st.cam.y+\'px) scale(\'+st.cam.z+\')\'}',
'function stage(){var s=P.scenes[P.cur];world.innerHTML=\'\';ndm={};var wc=document.createElement(\'div\');wc.id=\'wcam\';world.appendChild(wc);var g=document.createElement(\'div\');g.className=\'ground\';g.style.background=groundBg(s.ground);wc.appendChild(g);var gr=document.createElement(\'div\');gr.className=\'grid\';wc.appendChild(gr);for(var k=0;k<(s.deco||[]).length;k++){var d=s.deco[k],e=document.createElement(\'div\');e.className=\'px deco\';e.style.left=d.x+\'px\';e.style.top=d.y+\'px\';e.style.width=d.w+\'px\';e.style.height=d.h+\'px\';e.style.background=blockBg(d.t);wc.appendChild(e)}for(var k in s.nodes){var n=s.nodes[k];if(n.t!==\'sprite\'||!n.show)continue;var bw=n.cbw||n.size,bh=n.cbh||n.size;var d=document.createElement(\'div\');d.className=\'px\';d.id=\'nd-\'+n.id;d.style.left=(n.x-bw/2)+\'px\';d.style.top=(n.y-bh/2)+\'px\';var img=document.createElement(\'img\');img.src=rSrc(n);var cc=null;if(Array.isArray(n.costumes))for(var i=0;i<n.costumes.length;i++)if(n.costumes[i].src===n.img)cc=n.costumes[i];var raw=n.img&&(n.raw||(cc&&cc.raw));if(raw){img.style.width=bw+\'px\';img.style.height=\'auto\';d.style.width=bw+\'px\';d.style.height=bh+\'px\'}else{img.style.width=bw+\'px\';img.style.height=bh+\'px\'}img.draggable=false;d.appendChild(img);var nm2=document.createElement(\'div\');nm2.className=\'p-name\';nm2.textContent=rName(n);d.appendChild(nm2);d.onmousedown=(function(nn){return function(e){e.stopPropagation();if(st.run){for(var i=0;i<nn.scr.length;i++)if(nn.scr[i].id===\'evt1\')fire(nn,i)}}})(n);wc.appendChild(d);ndm[n.id]=d}updCam()}',
'function cl(){var s=P.scenes[P.cur];for(var id in ndm){var n=s.nodes[id],d=ndm[id];if(!n||!n.show){d.style.display=\'none\';continue}d.style.display=\'\';var bw=n.cbw||n.size,bh=n.cbh||n.size;d.style.left=(n.x-bw/2)+\'px\';d.style.top=(n.y-bh/2)+\'px\';var im=d.querySelector(\'img\');im.src=rSrc(n);var cc=null;if(Array.isArray(n.costumes))for(var i=0;i<n.costumes.length;i++)if(n.costumes[i].src===n.img)cc=n.costumes[i];var raw=n.img&&(n.raw||(cc&&cc.raw));if(raw){im.style.width=bw+\'px\';im.style.height=\'auto\';d.style.width=bw+\'px\';d.style.height=bh+\'px\'}else{im.style.width=bw+\'px\';im.style.height=bh+\'px\';d.style.width=\'\';d.style.height=\'\'}var sy=d.querySelector(\'.say\');if(n.say){if(!sy){sy=document.createElement(\'div\');sy.className=\'say\';d.appendChild(sy)}sy.textContent=Array.isArray(n.say)?n.say[0]:n.say;sy.style.display=\'\'}else if(sy)sy.style.display=\'none\';d.style.opacity=n.ghost!==undefined&&n.ghost<100?(1-Math.max(0,Math.min(100,n.ghost))/100):\'\';d.style.zIndex=n.z||\'\'}}',
'var world=document.getElementById(\'world\');',
'world.addEventListener(\'mousemove\',function(e){var r=world.getBoundingClientRect();st.mx=(e.clientX-r.left-st.cam.x)/st.cam.z;st.my=(e.clientY-r.top-st.cam.y)/st.cam.z});',
'world.addEventListener(\'mousedown\',function(){st.mdown=1});',
'world.addEventListener(\'mouseup\',function(){st.mdown=0});',
'window.addEventListener(\'keydown\',function(e){var k=e.key.toLowerCase();st.keys[k]=1;if(e.key===\' \'||e.key.indexOf(\'Arrow\')===0)e.preventDefault()});',
'window.addEventListener(\'keyup\',function(e){st.keys[e.key.toLowerCase()]=0});',
'window.addEventListener(\'resize\',function(){size();stage()});',
'size();stage();'
];
function pubHTML(){var css='*{margin:0;padding:0;box-sizing:border-box}body{background:#14171A;color:#fff;font-family:\'Courier New\',monospace;height:100vh;display:flex;flex-direction:column}#top{background:#2A2F36;border-bottom:3px solid #000;padding:8px 12px;display:flex;align-items:center;gap:8px}#top b{color:#FFCF00;letter-spacing:1px;font-size:14px}#top button{background:linear-gradient(180deg,#D8D8D8,#9A9A9A);border:2px solid #000;box-shadow:0 2px 0 #3A3E44;color:#111;font-size:12px;font-weight:700;cursor:pointer;padding:3px 12px}#top button:active{transform:translateY(2px);box-shadow:none}#top .run{background:linear-gradient(180deg,#8FD47F,#5E9E4E)!important;color:#fff}#top .stop{background:linear-gradient(180deg,#E08080,#A04040)!important;color:#fff}#stt{color:#9AA3AB;font-size:11px;margin-left:auto}#world{flex:1;position:relative;overflow:hidden;background:linear-gradient(180deg,#7FBF7F,#5E9E5E)}.px{position:absolute;image-rendering:pixelated;transition:left .05s steps(4),top .05s steps(4);z-index:1;cursor:pointer}.px img{image-rendering:pixelated}.px .p-name{position:absolute;left:50%;transform:translateX(-50%);bottom:-15px;font-size:9px;color:#fff;text-shadow:1px 1px 0 #000;letter-spacing:1px;white-space:nowrap;pointer-events:none}.px .say{position:absolute;top:-36px;left:50%;transform:translateX(-50%);background:#fff;border:2px solid #000;color:#111;font-size:10px;padding:3px 8px;white-space:nowrap;font-weight:700;pointer-events:none;z-index:4}.ground{position:absolute;left:0;right:0;bottom:0;height:120px}.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:32px 32px;pointer-events:none}.deco{position:absolute;image-rendering:pixelated}';
 return '<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(nm.textContent)+'</title><style>'+css+'</style></head><body><div id="top"><b>'+esc(nm.textContent)+'</b><button class="run" onclick="runAll()">▶ 运行</button><button class="stop" onclick="stop()">■ 停止</button><span id="stt">就绪</span></div><div id="world"></div><script>var SAVE='+JSON.stringify(P)+';\n'+CORE.join('\n')+'\n</script></body></html>'}
var DBG=[],dbgEl=null,prevT=null;
function expFrames(n,cs,i){if(i>=cs.length){stTxt.textContent='已导出 '+cs.length+' 帧';return}var im2=new Image();im2.onload=function(){var c2=document.createElement('canvas');c2.width=64;c2.height=64;var x2=c2.getContext('2d');x2.imageSmoothingEnabled=false;x2.drawImage(im2,0,0,64,64);var a=document.createElement('a');a.href=c2.toDataURL('image/png');a.download=rName(n)+'_帧'+(i+1)+'.png';a.click();setTimeout(function(){expFrames(n,cs,i+1)},400)};im2.onerror=function(){expFrames(n,cs,i+1)};im2.src=cs[i].src}
function dbgInit(){if(dbgEl)return;dbgEl=document.createElement('div');dbgEl.id='dbg';
 var hd=document.createElement('div');hd.className='dbg-hd';hd.textContent='调试台 ▾';hd.onclick=function(){dbgEl.classList.toggle('open')};dbgEl.appendChild(hd);
 var bar=document.createElement('div');bar.className='dbg-bar';
 var g=document.createElement('button');g.className='mc-btn';g.textContent='继续';g.onclick=dbgGo;bar.appendChild(g);
 var s=document.createElement('button');s.className='mc-btn';s.textContent='停止';s.onclick=stop;bar.appendChild(s);
 var c=document.createElement('button');c.className='mc-btn';c.textContent='清空';c.onclick=function(){DBG=[];dbgUI()};bar.appendChild(c);
 dbgEl.appendChild(bar);
 var lg=document.createElement('div');lg.className='dbg-log';dbgEl.appendChild(lg);
 var mo=document.createElement('div');mo.className='dbg-mon';dbgEl.appendChild(mo);
 document.body.appendChild(dbgEl)}
function dbg(m){if(!dbgEl)dbgInit();DBG.push({t:Date.now(),m:m});if(DBG.length>200)DBG.shift();dbgUI()}
function dbgUI(){if(!dbgEl)return;var lg=dbgEl.querySelector('.dbg-log'),h='';
 for(var i=Math.max(0,DBG.length-60);i<DBG.length;i++){var d2=DBG[i],tm=new Date(d2.t);h+='<div><span>'+(tm.getHours()<10?'0':'')+tm.getHours()+':'+(tm.getMinutes()<10?'0':'')+tm.getMinutes()+':'+(tm.getSeconds()<10?'0':'')+tm.getSeconds()+'</span>'+d2.m+'</div>'}
 lg.innerHTML=h;lg.scrollTop=lg.scrollHeight}
function monUI(){if(!dbgEl)return;var mo=dbgEl.querySelector('.dbg-mon'),vh='<div><span>场景</span>'+scN.textContent+'</div>';
 for(var k in P.vars){var mk2=P.vtype[k]==='str'?' Ⓢ':P.vtype[k]==='list'?' ⓛ':P.vtype[k]==='dict'?' ⓓ':P.vtype[k]==='stack'?' ⓢ':P.vtype[k]==='queue'?' ⓠ':'';var mv2=P.vars[k];if(mv2&&typeof mv2==='object')mv2=JSON.stringify(mv2);vh+='<div><span>'+k+mk2+'</span> = '+mv2+'</div>'};
 var s=P.scenes[P.cur];for(var k2 in s.nodes){var n=s.nodes[k2];if(n.t==='sprite')vh+='<div><span>'+rName(n)+(n.show?'':' ✕')+'</span> x:'+(n.x|0)+' y:'+(n.y|0)+' 向:'+((n.dir%360)|0)+' 大:'+(n.size|0)+'</div>'}
 mo.innerHTML=vh||'<div class="emp">(无角色)</div>'}
var monT=null;
function monLoop(){if(!st.run||!dbgEl){monT=null;return}monUI();monT=requestAnimationFrame(monLoop)}
function dbgGo(){st.pz=0;if(st.pzR){var r=st.pzR;st.pzR=null;r()}}
function diffInfo(a,b){var oa=JSON.parse(a),ob=JSON.parse(b),rs=[];
 var sc1=Object.keys(oa.scenes).length,sc2=Object.keys(ob.scenes).length;if(sc1!==sc2)rs.push('场景 '+sc1+'→'+sc2);
 var nd1=0,nd2=0,sb1=0,sb2=0;for(var k in oa.scenes){nd1+=Object.keys(oa.scenes[k].nodes).length;for(var n2 in oa.scenes[k].nodes)sb1+=(oa.scenes[k].nodes[n2].scr||[]).length}
 for(var k2 in ob.scenes){nd2+=Object.keys(ob.scenes[k2].nodes).length;for(var n3 in ob.scenes[k2].nodes)sb2+=(ob.scenes[k2].nodes[n3].scr||[]).length}
 if(nd1!==nd2)rs.push('角色/节点 '+nd1+'→'+nd2);if(sb1!==sb2)rs.push('脚本块 '+sb1+'→'+sb2);
 var va=Object.keys(oa.vars||{}).length,vb=Object.keys(ob.vars||{}).length;if(va!==vb)rs.push('变量 '+va+'→'+vb);
 return rs.length?('变化: '+rs.join(' · ')):'内容相同'}
function histMgr(p){var oo2=document.querySelector('.paint-ov');if(oo2)oo2.remove();
 var ov=document.createElement('div');ov.className='paint-ov';var bx=document.createElement('div');bx.className='paint fm';
 var hd=document.createElement('b');hd.textContent='版本时间线 · '+p.name;bx.appendChild(hd);
 var cur=document.createElement('div');cur.className='fm-cur';cur.textContent='每次「保存当前」自动记录快照（最多 20 个）。可回滚任意版本。';bx.appendChild(cur);
 var lst=document.createElement('div');lst.className='fm-list';
 var vs=p.vers||[];
 if(!vs.length){var em=document.createElement('div');em.className='fm-empty';em.textContent='尚无版本记录。';lst.appendChild(em)}
 vs.forEach(function(v,i){var r=document.createElement('div');r.className='fm-row';
  var t=new Date(v.time);
  var d=document.createElement('span');d.className='fm-n';d.textContent='v'+(i+1)+' · '+(t.getMonth()+1)+'/'+t.getDate()+' '+(t.getHours()<10?'0':'')+t.getHours()+':'+(t.getMinutes()<10?'0':'')+t.getMinutes();
  var b1=document.createElement('button');b1.className='fm-b go';b1.textContent='恢复';b1.onclick=function(){if(confirm('恢复到 v'+(i+1)+'？当前未保存改动将丢失')){try{var o=JSON.parse(v.data);if(o&&o.scenes){P=o;nm.textContent=P.name||p.name;render();stTxt.textContent='已恢复到 v'+(i+1);ov.remove()}}catch(e){stTxt.textContent='版本数据损坏'}}};
  var b2=document.createElement('button');b2.className='fm-b';b2.textContent='导出';b2.onclick=function(){expProj(p.name+'_v'+(i+1),v.data)};
  var b3=document.createElement('button');b3.className='fm-b';b3.textContent='对比当前';b3.title=diffInfo(p.data,v.data);b3.onclick=function(){alert(diffInfo(p.data,v.data))};
  r.appendChild(d);r.appendChild(b1);r.appendChild(b2);r.appendChild(b3);lst.appendChild(r)});
 bx.appendChild(lst);
 var btns=document.createElement('div');btns.className='paint-btns';
 var bc=document.createElement('button');bc.className='p-b';bc.textContent='关闭';bc.onclick=function(){ov.remove()};btns.appendChild(bc);
 bx.appendChild(btns);ov.appendChild(bx);document.body.appendChild(ov)}
function rz(ar,br,v,id){var h=$(id);if(!h)return;
 h.addEventListener('mousedown',function(e){e.preventDefault();var s=v?e.clientX:e.clientY;var sw=v?ar.offsetWidth:ar.offsetHeight;var ow=v?ar.offsetWidth+br.offsetWidth:ar.offsetHeight+br.offsetHeight;
 function m(e2){var d=(v?e2.clientX:e2.clientY)-s;var n=sw+d;var o=ow-n;var mi=v?140:100;if(n<mi)n=mi;if(o<mi)n=ow-mi;
  if(v)ar.style.width=n+'px';else ar.style.height=n+'px';document.body.classList.add('rz')}
 function u(){document.body.classList.remove('rz');document.removeEventListener('mousemove',m);document.removeEventListener('mouseup',u);size();stage();props()}
 document.addEventListener('mousemove',m);document.addEventListener('mouseup',u)})}
function projs(){try{return JSON.parse(localStorage.getItem('mcratch_projs')||'[]')}catch(e){return[]}}
function setProjs(p){try{localStorage.setItem('mcratch_projs',JSON.stringify(p));return true}catch(e){stTxt.textContent='存储空间不足';return false}}
function expProj(nm2,data){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=nm2+'.mcratch';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}
function fileMgr(){var oo=document.querySelector('.paint-ov');if(oo)oo.remove();
 var ov=document.createElement('div');ov.className='paint-ov';var bx=document.createElement('div');bx.className='paint fm';
 var hd=document.createElement('b');hd.textContent='文件管理';bx.appendChild(hd);
 var cur=document.createElement('div');cur.className='fm-cur';cur.textContent='顶部「存」自动保存当前项目；「保存当前」写入项目库并生成版本快照。';bx.appendChild(cur);
 var lst=document.createElement('div');lst.className='fm-list';
 var ps=projs();
 if(!ps.length){var em=document.createElement('div');em.className='fm-empty';em.textContent='项目库为空。点「保存当前」创建第一个项目。';lst.appendChild(em)}
 ps.forEach(function(p){var r=document.createElement('div');r.className='fm-row';
  var t=new Date(p.time);
  var d=document.createElement('span');d.className='fm-n';d.textContent=p.name+' · '+(t.getMonth()+1)+'/'+t.getDate()+' '+(t.getHours()<10?'0':'')+t.getHours()+':'+(t.getMinutes()<10?'0':'')+t.getMinutes();
  var b1=document.createElement('button');b1.className='fm-b go';b1.textContent='打开';b1.onclick=function(){try{var o=JSON.parse(p.data);if(o&&o.scenes){P=o;nm.textContent=p.name;render();stTxt.textContent='已打开项目';ov.remove()}}catch(e){stTxt.textContent='项目数据损坏'}};
  var b2=document.createElement('button');b2.className='fm-b';b2.textContent='改名';b2.onclick=function(){var nn=prompt('新名称:',p.name);if(nn){var ps2=projs();ps2.forEach(function(q){if(q.name===p.name)q.name=nn});setProjs(ps2);fileMgr()}};
  var b3=document.createElement('button');b3.className='fm-b';b3.textContent='导出';b3.onclick=function(){expProj(p.name,p.data)};
  var b4=document.createElement('button');b4.className='fm-b del';b4.textContent='删除';b4.onclick=function(){if(confirm('删除项目「'+p.name+'」？')){var ps2=projs();ps2=ps2.filter(function(q){return q.name!==p.name});setProjs(ps2);fileMgr()}};
  var b5=document.createElement('button');b5.className='fm-b';b5.textContent='历史';b5.title='版本时间线';b5.onclick=function(){histMgr(p)};
  r.appendChild(d);r.appendChild(b1);r.appendChild(b2);r.appendChild(b3);r.appendChild(b4);r.appendChild(b5);lst.appendChild(r)});
 bx.appendChild(lst);
 var btns=document.createElement('div');btns.className='paint-btns';
 var bNew=document.createElement('button');bNew.className='p-b';bNew.textContent='新建项目';bNew.onclick=function(){var nn=prompt('新项目名称:');if(!nn)return;var ps2=projs(),rec={name:nn,time:Date.now(),data:JSON.stringify(P),vers:[]};ps2.push(rec);if(setProjs(ps2)){nm.textContent=nn;stTxt.textContent='已创建项目';fileMgr()}};btns.appendChild(bNew);
 var bImp=document.createElement('button');bImp.className='p-b';bImp.textContent='导入文件';bImp.onclick=function(){var fi=document.createElement('input');fi.type='file';fi.accept='.mcratch,.json';fi.onchange=function(){var f=fi.files&&fi.files[0];if(!f)return;var fr=new FileReader();fr.onload=function(){try{var o=JSON.parse(fr.result);if(o&&o.scenes){var nm2=(f.name||'导入').replace(/\.(mcratch|json)$/i,'');var ps2=projs(),rec={name:nm2,time:Date.now(),data:JSON.stringify(o),vers:[]};ps2.push(rec);if(setProjs(ps2)){stTxt.textContent='已导入项目';fileMgr()}}else stTxt.textContent='不是有效的项目文件'}catch(e){stTxt.textContent='文件解析失败'}};fr.readAsText(f)};fi.click()};btns.appendChild(bImp);
 var bSave=document.createElement('button');bSave.className='p-b go';bSave.textContent='保存当前';bSave.onclick=function(){var nn=prompt('项目名称:',nm.textContent);if(!nn)return;var ps2=projs(),ex2=-1;ps2.forEach(function(p,i){if(p.name===nn)ex2=i});var rec={name:nn,time:Date.now(),data:JSON.stringify(P),vers:[]};if(ex2>=0){rec.vers=ps2[ex2].vers||[]}rec.vers.push({time:Date.now(),data:JSON.stringify(P)});if(rec.vers.length>20)rec.vers=rec.vers.slice(-20);if(ex2>=0)ps2[ex2]=rec;else ps2.push(rec);if(setProjs(ps2)){nm.textContent=nn;stTxt.textContent='已保存（生成版本快照）';fileMgr()}};btns.appendChild(bSave);
 var bPub=document.createElement('button');bPub.className='p-b go';bPub.textContent='发布网页';bPub.onclick=function(){var h=pubHTML();var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([h],{type:'text/html'}));a.download=(nm.textContent||'未命名')+'_发布版.html';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000);stTxt.textContent='已发布可玩网页'};btns.appendChild(bPub);
 var bc=document.createElement('button');bc.className='p-b';bc.textContent='关闭';bc.onclick=function(){ov.remove()};btns.appendChild(bc);
 bx.appendChild(btns);ov.appendChild(bx);document.body.appendChild(ov)}
$('fileB').onclick=function(){fileMgr()};
rz($('pal'),$('work'),1,'pw');rz($('pcol'),$('work'),1,'r2w');rz($('rcol'),$('pcol'),1,'rw');rz($('tree'),$('stage'),0,'th');
load();render();props();
