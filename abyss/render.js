(function(){
var ABY=window.ABY=window.ABY||{};
var KC=ABY.KC;
var PM=ABY.PM;
var STN=ABY.STN;
var ENMX=ABY.ENMX;
var SPL=ABY.SPL;
var S=ABY.S;
var P=ABY.P;
var cl=ABY.cl;
var ds=ABY.ds;
var upVal=ABY.upVal;
var skBy=ABY.skBy;
function curSpell(){return ABY.curSpell.apply(this,arguments)}
var upBy=ABY.upBy;
function bossDef(){return ABY.bossDef.apply(this,arguments)}
function theme(){return ABY.theme.apply(this,arguments)}







var CX=null;
function F(px){return px+'px Consolas,"Cascadia Mono",monospace'}
function vis(x,w){return !(x-S.cam.x>S.vw+90||x+w-S.cam.x<-90)}
function W(){return S.vw}
function H(){return S.vh}

function draw(){
  CX=S.cx;
  if(!CX)return;
  CX.fillStyle='#040405';CX.fillRect(0,0,S.vw,S.vh);
  bk();
  if(S.st===STN.M){menu();if(S.help)helpPanel();return}
  var jx=S.cam.sh>0?(Math.random()*2-1)*S.cam.sh*3.4:0;
  var jy=S.cam.sh>0?(Math.random()*2-1)*S.cam.sh*3.4:0;
  var ox=-S.cam.x+jx,oy=jy;
  if(S.zone==='mtn')mtnScene(ox,oy);
  CX.save();CX.translate(ox,oy);
  plats();
  if(S.zone==='mtn')stalls(ox,oy);
  else{drops();mobs();bullets()}
  portal();player();
  CX.restore();
  fx(ox,oy);
  hud();
  if(S.zone!=='mtn'&&S.boss&&!S.boss.dd)bossBar();
  if(S.help){helpPanel();return}
  if(S.st===STN.T)trans();
  else if(S.st===STN.P)pause();
  else if(S.st===STN.D)over();
  else if(S.st===STN.S)pickPanel()
}
function menu(){
  CX.fillStyle='rgba(4,4,5,.94)';CX.fillRect(0,0,S.vw,S.vh);
  var cw=Math.min(300,S.vw-80),ch=34,gap=8;
  var n=Math.max(1,S.avail.length);
  var tot=n*ch+(n-1)*gap;
  var x=S.vw/2-cw/2,y=Math.max(96,S.vh*0.5-tot/2+16);
  CX.textAlign='center';
  CX.fillStyle='#5ad1ff';CX.font='600 17px Consolas,"Cascadia Mono",monospace';
  CX.fillText('沉 渊 讨 伐 · 出 征 准 备',S.vw/2,26);
  CX.fillStyle='#6a767d';CX.font=F(10);
  CX.fillText('点击或按 1-4 切换携带药剂 · Enter 开始 · H 查看操作指南',S.vw/2,44);
  var bl=ABY.alchBlessList?ABY.alchBlessList():[];
  if(bl.length){
    var by=66,bwd=Math.min(300,S.vw-80),e2=Math.min(96,(bwd-(bl.length-1)*8)/bl.length);
    CX.textAlign='center';
    CX.fillStyle='#4a5459';CX.font=F(9);
    CX.fillText('局 内 祝 福 · 点 击 切 换 携 带',S.vw/2,by-8);
    for(var bi=0;bi<bl.length;bi++){
      var ox=x+bi*(e2+8),on2=S.bless===bl[bi][0];
      CX.fillStyle=on2?'rgba(46,230,168,.14)':'rgba(255,255,255,.04)';
      CX.fillRect(ox,by,e2,30);
      CX.strokeStyle=on2?'rgba(46,230,168,.7)':'rgba(255,255,255,.16)';
      CX.lineWidth=1;
      CX.strokeRect(ox+0.5,by+0.5,e2-1,29);
      CX.fillStyle=on2?'#2ee6a8':'#8a9499';CX.font='600 11px Consolas,"Cascadia Mono",monospace';
      CX.fillText(bl[bi][1],ox+e2/2,by+15);
      CX.fillStyle='#6a767d';CX.font=F(8);
      CX.fillText(bl[bi][2],ox+e2/2,by+26);
    }
    CX.textAlign='left';
  }
  var lx=Math.max(14,x-226),lw=Math.min(206,x-24);
  if(lw>120)menuLeft(lx,62,lw);
  menuStaff();
  for(var q=0;q<n;q++){
    var a=S.avail[q];
    var iy=y+q*(ch+gap);
    var ok=!!a&&a.c>0;
    var on=!!a&&S.mpick[a.k];
    var hi=S.mcur===q;
    CX.fillStyle=!ok?'rgba(255,255,255,.025)':(on?'rgba(255,214,10,.10)':'rgba(255,255,255,.04)');
    CX.fillRect(x,iy,cw,ch);
    CX.strokeStyle=hi?'#5ad1ff':(on&&ok?'rgba(255,214,10,.5)':'rgba(255,255,255,.14)');
    CX.lineWidth=hi?2:1;
    CX.strokeRect(x+0.5,iy+0.5,cw-1,ch-1);
    CX.textAlign='left';
    CX.fillStyle='#4a5459';CX.font=F(10);
    CX.fillText(''+(q+1),x+9,iy+ch/2+4);
    CX.fillStyle=!ok?'#4a5459':(on?'#ffd60a':'#8a9499');
    CX.font=F(12);
    CX.fillText(a?(a.n):'—',x+26,iy+ch/2+5);
    if(ok){
      CX.fillStyle='#6a767d';CX.font=F(10);
      CX.fillText('库存 '+a.c,x+cw-124,iy+ch/2+4);
      CX.fillStyle=on?'#2ee6a8':'#4a5459';
      CX.textAlign='right';
      CX.fillText(on?'✓ 携带 '+Math.min(5,a.c):'未携带',x+cw-12,iy+ch/2+4);
    }else{
      CX.fillStyle='#3f474c';CX.font=F(10);
      CX.textAlign='right';
      CX.fillText(a?'库存为 0':'未炼制',x+cw-12,iy+ch/2+4);
    }
    CX.textAlign='left';
  }
  var sel2=0;
  for(var z=0;z<S.avail.length;z++)if(S.mpick[S.avail[z].k]&&S.avail[z].c>0)sel2++;
  var btnY=y+tot+14,bw=140,bh=30;
  CX.textAlign='center';
  CX.fillStyle='rgba(255,255,255,.05)';CX.fillRect(x,btnY,bw,bh);
  CX.strokeStyle='rgba(255,255,255,.2)';CX.strokeRect(x+0.5,btnY+0.5,bw-1,bh-1);
  CX.fillStyle='#8a9499';CX.font=F(11);
  CX.fillText(sel2?'全部取消':'全部携带',x+bw/2,btnY+19);
  var gx=x+cw-bw;
  CX.fillStyle='rgba(90,209,255,.14)';CX.fillRect(gx,btnY,bw,bh);
  CX.strokeStyle='rgba(90,209,255,.6)';CX.strokeRect(gx+0.5,btnY+0.5,bw-1,bh-1);
  CX.fillStyle='#e6edef';CX.font='600 12px Consolas,"Cascadia Mono",monospace';
  CX.fillText('进 入 深 渊',gx+bw/2,btnY+19);
  CX.fillStyle='#6a767d';CX.font=F(10);
  CX.fillText('已选 '+sel2+' 种 · 每种至多带 5 瓶',S.vw/2,btnY+50);
  if(!S.avail.length){
    CX.fillStyle='#5a6469';CX.font=F(11);
    CX.fillText('你还没有成品药剂 —— 去「炼金」页炼制后回到这里',S.vw/2,y+ch+18);
  }
  CX.textAlign='left';
}
function menuStaff(){
  var g=ABY.staffGeom?ABY.staffGeom():null;
  if(!g)return;
  CX.fillStyle="#4a5459";CX.font=F(9);
  CX.fillText("法 杖 槽 位  "+P.staff.length+" / "+(P.slots||2)+"   （点击下方法术添加 · 点击槽位移除）",g.x,g.sy-10);
  for(var i=0;i<g.slots.length;i++){
    var t=g.slots[i],d=t.k?ABY.spellDef(t.k):null;
    CX.fillStyle=t.k?"rgba(154,209,255,.14)":"rgba(255,255,255,.04)";
    CX.fillRect(t.x,t.y,t.w,t.h);
    CX.strokeStyle=t.k?"rgba(154,209,255,.6)":"rgba(255,255,255,.16)";
    CX.lineWidth=1;CX.strokeRect(t.x+0.5,t.y+0.5,t.w-1,t.h-1);
    CX.textAlign="center";
    CX.fillStyle=d?(d.t==="mod"?"#2ee6a8":"#e6edef"):"#333b40";
    CX.font=F(10);
    CX.fillText(d?d.n.slice(0,4):"空",t.x+t.w/2,t.y+t.h/2+4);
    CX.textAlign="left";
  }
  CX.fillStyle="#4a5459";CX.font=F(9);
  CX.fillText("可 用 法 术  （炼金解锁 · 绿=修正，修饰其后最近的法术）",g.x,g.py-10);
  for(var j=0;j<g.pool.length;j++){
    var q=g.pool[j];
    CX.fillStyle=q.t==="mod"?"rgba(46,230,168,.10)":"rgba(154,209,255,.10)";
    CX.fillRect(q.x,q.y,q.w,q.h);
    CX.strokeStyle=q.t==="mod"?"rgba(46,230,168,.45)":"rgba(154,209,255,.45)";
    CX.strokeRect(q.x+0.5,q.y+0.5,q.w-1,q.h-1);
    CX.textAlign="center";
    CX.fillStyle=q.t==="mod"?"#2ee6a8":"#9ad1ff";
    CX.font=F(10);
    CX.fillText(q.n.slice(0,4),q.x+q.w/2,q.y+q.h/2+4);
    CX.textAlign="left";
  }
}
function menuLeft(x,y,w){
  CX.fillStyle='rgba(255,255,255,.035)';CX.fillRect(x,y,w,84);
  CX.strokeStyle='rgba(255,214,10,.35)';CX.lineWidth=1;
  CX.strokeRect(x+0.5,y+0.5,w-1,83);
  var wpn=S.wpn||{};
  CX.fillStyle='#4a5459';CX.font=F(9);CX.textAlign='left';
  CX.fillText('武 器',x+10,y+16);
  CX.fillStyle=wpn.rar>0?'#ffd60a':'#e6edef';
  CX.font=F(12);
  CX.fillText((wpn.n||'手刃').slice(0,12),x+10,y+34);
  CX.fillStyle='#6a767d';CX.font=F(9);
  CX.fillText((wpn.kind==='ranged'?'远程剑气':'近战')+' · 战力 '+((wpn.pw|0)||0),x+10,y+50);
  var af=wpn.af||{};
  var tx=[];
  if(af.list&&af.list.length)tx=af.list.slice(0,3);
  if(tx.length){
    CX.fillStyle='#2ee6a8';CX.font=F(9);
    CX.fillText(tx.join(' · ').slice(0,30),x+10,y+66);
  }else{
    CX.fillStyle='#4a5459';CX.font=F(9);
    CX.fillText('无词缀',x+10,y+66);
  }
  CX.fillStyle='#4a5459';CX.font=F(9);
  CX.fillText('耐久 100 / 破损后伤害减半 · 圣山可修',x+10,y+80);
  var sy=y+96;
  CX.fillStyle='rgba(255,255,255,.035)';CX.fillRect(x,sy,w,110);
  CX.strokeStyle='rgba(154,209,255,.3)';CX.strokeRect(x+0.5,sy+0.5,w-1,109);
  CX.fillStyle='#4a5459';CX.font=F(9);
  CX.fillText('技 能  [E / Q]',x+10,sy+16);
  var sk=P.sk||[];
  for(var i=0;i<2;i++){
    var d=skBy(sk[i]);
    CX.fillStyle=i===0?'#ff7a6b':'#5ad1ff';
    CX.font=F(10);
    CX.fillText((i===0?'E  ':'Q  ')+(d?d.n:sk[i]),x+10,sy+34+i*17);
    if(d){
      CX.fillStyle='#4a5459';CX.font=F(9);
      CX.fillText('耗能 '+d.c+' · CD '+d.cd+'s',x+62,sy+34+i*17);
    }
  }
  CX.fillStyle='#4a5459';CX.font=F(9);
  CX.fillText('法 术  [Tab 切换 · 右键/C 释放]',x+10,sy+72);
  var ks=ABY.spellKeys?ABY.spellKeys():[];
  var nm=[];
  for(var q2=0;q2<ks.length;q2++){
    var all=ABY.SPL.concat(ABY.MOD||[]);
    for(var z2=0;z2<all.length;z2++)if(all[z2].k===ks[q2]){nm.push(all[z2].n);break}
  }
  CX.fillStyle='#9ad1ff';CX.font=F(9);
  CX.fillText(nm.join(' · ').slice(0,40),x+10,sy+88);
  CX.fillStyle='#4a5459';
  CX.fillText('挖掘/造桥可改造地形',x+10,sy+102);
}
function portal(){
  var p=S.pt;
  if(!p||!vis(p.x-60,120))return;
  var t=p.ph||0,pulse=0.86+0.14*Math.sin(t*3.4);
  CX.save();CX.translate(p.x,p.y-p.r*0.7);
  CX.globalAlpha=0.5*pulse;
  CX.fillStyle="#2ee6a8";
  CX.beginPath();CX.ellipse(0,0,p.r*0.62,p.r*1.12,0,0,7);CX.fill();
  CX.globalAlpha=0.85;
  CX.strokeStyle="#e6edef";CX.lineWidth=2;
  CX.beginPath();CX.ellipse(0,0,p.r*0.5*pulse,p.r*0.98*pulse,0,0,7);CX.stroke();
  CX.strokeStyle="#2ee6a8";CX.lineWidth=3;
  CX.beginPath();CX.ellipse(0,0,p.r*0.62,p.r*1.12,0,0,7);CX.stroke();
  CX.globalAlpha=1;
  for(var q=0;q<4;q++){
    var a=t*2.2+q*1.57,rad=p.r*(0.3+0.5*((q%2)?0.6:1));
    CX.fillStyle=q%2?"#e6edef":"#2ee6a8";
    CX.fillRect(Math.cos(a)*rad-1.5,Math.sin(a)*rad*1.1-1.5,3,3);
  }
  CX.restore();
  CX.globalAlpha=1;
  if(p.out){
    CX.textAlign="center";CX.font=F(10);CX.fillStyle="#ffd60a";
    CX.fillText("▲ 离开圣山",p.x,p.y-p.r*2.2);
    CX.textAlign="left";
  }else if(p.on){
    CX.textAlign="center";CX.font=F(10);CX.fillStyle="#2ee6a8";
    CX.fillText("▲ 进入",p.x,p.y-p.r*2.1);
    CX.textAlign="left";
  }
}
function mtnScene(ox,oy){
  var g=CX.createLinearGradient(0,0,0,H());
  g.addColorStop(0,"#08090b");g.addColorStop(0.55,"#0c0e11");g.addColorStop(1,"#161a20");
  CX.fillStyle=g;CX.fillRect(0,0,W(),H());
  for(var k=0;k<3;k++){
    var pf=0.08+k*0.12,of=(S.cam.x*pf)%420,al=0.05+k*0.02;
    CX.fillStyle="rgba(255,255,255,"+al+")";
    for(var q=-1;q<Math.ceil(W()/420)+2;q++){
      var x=q*420-of;
      CX.beginPath();
      CX.moveTo(x,H());CX.lineTo(x+170,H()-H()*(0.34+k*0.05));
      CX.lineTo(x+420,H());
      CX.closePath();CX.fill();
    }
  }
  for(var z=0;z<90;z++){
    var sx=((z*173.3-S.cam.x*0.25)%(S.wx+200)+S.wx+200)%(S.wx+200)-100;
    var sy=((z*97.1)%(S.vh-60))+20;
    var tw=0.3+0.7*Math.sin(S.fn*0.02+z);
    CX.fillStyle="rgba(230,237,239,"+(0.05+tw*0.18).toFixed(3)+")";
    CX.fillRect(sx,sy,2,2);
  }
  CX.save();CX.translate(ox,oy);
  CX.fillStyle="rgba(255,214,10,.05)";
  CX.fillRect(0,S.gd-4,S.wx,8);
  CX.restore();
}
function stalls(ox,oy){
  if(!S.mtn)return;
  CX.save();CX.translate(ox,oy);
  for(var q=0;q<S.mtn.length;q++){
    var m=S.mtn[q],hi=(S.near===q);
    var y=m.y-72;
    CX.fillStyle=hi?"rgba(255,214,10,.16)":"rgba(255,255,255,.05)";
    CX.fillRect(m.x-44,y,88,72);
    CX.strokeStyle=m.bought?"rgba(106,118,125,.4)":(hi?"#ffd60a":"rgba(255,255,255,.2)");
    CX.lineWidth=hi?2:1;
    CX.strokeRect(m.x-43.5,y+0.5,87,71);
    CX.textAlign="center";
    CX.fillStyle=m.bought?"#4a5459":"#e6edef";
    CX.font=F(11);
    CX.fillText(m.n,m.x,y+20);
    CX.fillStyle=m.bought?"#4a5459":"#ffd60a";
    CX.font=F(10);
    CX.fillText(m.bought?"已兑换":("◈ "+m.c),m.x,y+38);
    CX.fillStyle="#6a767d";CX.font=F(9);
    CX.fillText(m.d.slice(0,10),m.x,y+56);
    CX.textAlign="left";
    CX.fillStyle=m.bought?"#3a4247":(hi?"#ffd60a":"#4a5459");
    CX.fillRect(m.x-3,y+72,6,74);
    CX.beginPath();
    CX.moveTo(m.x-16,y+146);CX.lineTo(m.x+16,y+146);CX.lineTo(m.x,y+160);
    CX.closePath();CX.fill();
    if(hi&&!m.bought){
      CX.textAlign="center";CX.font=F(10);CX.fillStyle="#ffd60a";
      CX.fillText("⚔ 购买",m.x,y-12);
      CX.textAlign="left";
    }
  }
  if(S.near<0){
    CX.textAlign="center";CX.font=F(10);CX.fillStyle="#6a767d";
    CX.fillText("走到摊位前按攻击键购买 · 右侧传送门离开圣山",S.cam.x+S.vw/2,S.vh-130);
    CX.textAlign="left";
  }
  CX.restore();
}
function helpPanel(){
  CX.fillStyle="rgba(4,4,5,.9)";CX.fillRect(0,0,S.vw,S.vh);
  var w=Math.min(560,S.vw-40),h=Math.min(470,S.vh-30);
  var x=(S.vw-w)/2,y=(S.vh-h)/2;
  CX.fillStyle="rgba(11,11,13,.97)";CX.fillRect(x,y,w,h);
  CX.strokeStyle="rgba(90,209,255,.5)";CX.lineWidth=1;
  CX.strokeRect(x+0.5,y+0.5,w-1,h-1);
  CX.fillStyle="rgba(255,255,255,.04)";CX.fillRect(x+1,y+1,w-2,28);
  CX.textAlign="center";
  CX.fillStyle="#5ad1ff";CX.font="600 14px Consolas,Cascadia Mono,monospace";
  CX.fillText("操 作 指 南",x+w/2,y+19);
  CX.textAlign="left";
  var ly=y+48;
  for(var i=0;i<ROWS.length;i++){
    var r=ROWS[i];
    CX.fillStyle="#6a767d";CX.font=F(11);
    CX.fillText(r[0],x+22,ly);
    CX.fillStyle="#e6edef";
    CX.fillText(r[1],x+150,ly);
    if(r[2]){
      CX.fillStyle="#4a5459";CX.font=F(9);
      CX.fillText(r[2],x+150,ly+14);
      ly+=14;
    }
    ly+=18;
  }
  var by=ly+6;
  CX.fillStyle="rgba(255,255,255,.03)";CX.fillRect(x+20,by,w-40,52);
  CX.fillStyle="#ffd60a";CX.font=F(10);
  CX.fillText("玩 法 提 示",x+28,by+16);
  CX.fillStyle="#8a9499";CX.font=F(9);
  CX.fillText("· 杀光本层怪 → 随机平台出现绿色传送门 → 走进去下一层",x+28,by+31);
  CX.fillText("· 每 5 层是渊主，打赢后传送门通向圣山（购物 + 祭坛换强化）",x+28,by+44);
  CX.textAlign="center";
  CX.fillStyle="#4a5459";CX.font=F(9);
  CX.fillText("按 H 关闭",x+w/2,h+y-12);
  CX.textAlign="left";
}
var ROWS=[["移动","A / D   或  ← / →"],["跳跃 / 二段跳","W / ↑ / 空格   —— 空中再按一次"],["攻击","J / X / K  或  鼠标左键","按住不放 = 蓄力重击；连续按住 = 自动续击"],["技能 E","突进斩 / 三段剑气 / 震地波"],["技能 Q","铁壁 / 治愈 / 时缓"],["法术切换","Tab"],["法术释放","鼠标右键 / C / 触屏 ✦"],["喝药剂","1 / 2 / 3 / F"],["投掷药剂","Shift + 1 / 2 / 3 / F"],["暂停","P / Esc"],["静音","M"],["操作指南","H  ← 再按一次关闭"]];
function bossBar(){
  var m=S.boss,bw=Math.min(520,S.vw-80),bx=(S.vw-bw)/2,by=92;
  CX.fillStyle='rgba(4,4,5,.72)';CX.fillRect(bx-8,by-22,bw+16,40);
  CX.strokeStyle='rgba(255,92,122,.5)';CX.lineWidth=1;CX.strokeRect(bx-7.5,by-21.5,bw+15,39);
  CX.textAlign='center';
  CX.fillStyle='#ff5c7a';CX.font='600 11px Consolas,"Cascadia Mono",monospace';
  CX.fillText((m.bdef?m.bdef.n:'渊主')+'   ·   阶段 '+(1+(m.ph2||0)),S.vw/2,by-6);
  CX.textAlign='left';
  CX.fillStyle='rgba(255,255,255,.14)';CX.fillRect(bx,by,bw,12);
  var r=cl(m.hp/m.mx,0,1);
  var g=CX.createLinearGradient(bx,0,bx+bw,0);
  g.addColorStop(0,'#ff5c7a');g.addColorStop(1,'#ffd60a');
  CX.fillStyle=g;CX.fillRect(bx,by,bw*r,12);
  CX.fillStyle='rgba(255,255,255,.3)';CX.fillRect(bx,by,bw*r,2);
  CX.fillStyle='#6a767d';CX.font=F(9);
  CX.fillText(Math.max(0,Math.ceil(m.hp))+' / '+m.mx,bx+bw+6,by+11);
}
function shop(){  CX.fillStyle='rgba(4,4,5,.9)';CX.fillRect(0,0,S.vw,S.vh);
  var n=S.shopPool?S.shopPool.length:0;
  CX.textAlign='center';
  CX.fillStyle='#ffd60a';CX.font='600 16px Consolas,"Cascadia Mono",monospace';
  CX.fillText('圣 山 商 店',S.vw/2,S.vh*0.22);
  CX.fillStyle='#6a767d';CX.font=F(10);
  CX.fillText('点击或 1/2/3 兑换 · Enter 离开',S.vw/2,S.vh*0.22+20);
  CX.fillStyle='#ffd60a';CX.font=F(12);
  CX.fillText('持有黄金  '+S.gold,S.vw/2,S.vh*0.22+42);
  CX.textAlign='left';
  var cw=Math.min(180,(S.vw-120)/3-14),ch=126;
  var tot=n*cw+(n-1)*14,x0=S.vw/2-tot/2,y0=S.vh*0.38;
  for(var i=0;i<n;i++){
    var it=S.shopPool[i],x=x0+i*(cw+14);
    var bought=S.shopBought&&S.shopBought[it.k];
    var can=!bought&&S.gold>=it.c;
    var sel=S.shopSel===i;
    CX.fillStyle=bought?'rgba(106,118,125,.10)':(can?'rgba(255,214,10,.10)':'rgba(255,255,255,.03)');
    CX.fillRect(x,y0,cw,ch);
    CX.strokeStyle=bought?'rgba(106,118,125,.35)':(sel?'#ffd60a':'rgba(255,255,255,.16)');
    CX.lineWidth=sel?2:1;
    CX.strokeRect(x+0.5,y0+0.5,cw-1,ch-1);
    CX.textAlign='center';
    CX.fillStyle=bought?'#4a5459':(can?'#ffd60a':'#8a9499');
    CX.font='600 14px Consolas,"Cascadia Mono",monospace';
    CX.fillText(it.n,x+cw/2,y0+32);
    CX.fillStyle=bought?'#4a5459':'#e6edef';
    CX.font=F(10);
    CX.fillText(bought?'已兑换':(it.c+' 黄金'),x+cw/2,y0+52);
    CX.fillStyle='#8a9499';CX.font=F(10);
    wrap(it.d,x+cw/2,y0+76,cw-20,14);
    CX.fillStyle='#4a5459';CX.font=F(9);
    CX.fillText('['+(i+1)+']',x+cw/2,y0+ch-10);
    CX.textAlign='left';
  }
  CX.textAlign='center';
  CX.fillStyle='#6a767d';CX.font=F(10);
  CX.fillText('Enter / 点击空白处离开',S.vw/2,y0+ch+34);
  CX.textAlign='left';
}
function bk(){
  var th=theme();
  var g=CX.createLinearGradient(0,0,0,H());
  g.addColorStop(0,th.a);g.addColorStop(0.6,'#040405');g.addColorStop(1,th.c);
  CX.fillStyle=g;CX.fillRect(0,0,W(),H());
  for(var k=0;k<3;k++){
    var pf=0.1+k*0.13,of=(S.cam.x*pf)%330,al=0.035+k*0.015,tp=(12+k*4)/100;
    CX.fillStyle='rgba(255,255,255,'+al+')';
    for(var i=-1;i<Math.ceil(W()/330)+2;i++){
      var x=i*330-of;
      CX.beginPath();
      CX.moveTo(x,H());CX.lineTo(x+120,H()-H()*tp);
      CX.lineTo(x+230,H()-H()*(tp+0.05));CX.lineTo(x+330,H());
      CX.closePath();CX.fill();
    }
  }
  deco(0.35);
  for(var s=0;s<46;s++){
    var sx=((s*137.5-S.cam.x*0.06)%(W()+40)+W()+40)%(W()+40)-20;
    var sy=((s*89.7)%(H()+40)+H()+40)%(H()+40)-20;
    var tw=0.35+0.65*Math.sin(S.fn*0.02+s);
    CX.fillStyle='rgba(154,209,255,'+(0.04+tw*0.12).toFixed(3)+')';
    CX.fillRect(sx,sy,2,2);
  }
  deco(1);
  var gg=CX.createLinearGradient(0,H()-150,0,H());
  gg.addColorStop(0,'rgba(90,209,255,0)');gg.addColorStop(1,'rgba(90,209,255,0.05)');
  CX.fillStyle=gg;CX.fillRect(0,H()-150,W(),150);
}
function deco(layer){
  var d=S.deco;
  if(!d||!d.length)return;
  var off=S.cam.x*(layer===1?0.78:0.25);
  for(var i=0;i<d.length;i++){
    var o=d[i];
    if(o.k===3){
      if(layer!==0)continue;
      var tw=0.4+0.6*Math.sin(S.fn*0.03+o.ph);
      CX.fillStyle=o.c;CX.globalAlpha=(0.18+tw*0.3)*o.d;
      CX.fillRect(o.x-off,o.y,2,2);
      CX.globalAlpha=1;
      continue;
    }
    var mine=(layer===1?o.d>0.42:o.d<=0.42);
    if(o.k===2){
      if(layer!==0)continue;
    }else if(!mine)continue;
    var x=o.x-off;
    if(x-S.cam.x>W()+80||x+o.w-S.cam.x<-80)continue;
    CX.globalAlpha=layer===1?1:0.55;
    CX.fillStyle=o.c;
    if(o.k===0){
      CX.beginPath();
      CX.moveTo(x,0);CX.lineTo(x+o.w,0);
      CX.lineTo(x+o.w*0.55,o.h);CX.lineTo(x+o.w*0.2,o.h*0.6);
      CX.closePath();CX.fill();
    }else if(o.k===1){
      CX.beginPath();
      CX.moveTo(x,H());CX.lineTo(x+o.w,H());
      CX.lineTo(x+o.w*0.5,H()-o.h);CX.lineTo(x+o.w*0.22,H()-o.h*0.55);
      CX.closePath();CX.fill();
    }else{
      CX.fillRect(x,o.y,o.w,o.h);
      CX.fillStyle='rgba(255,255,255,.03)';
      CX.fillRect(x,o.y,o.w,2);
    }
    CX.globalAlpha=1;
  }
}
function plats(){
  for(var i=0;i<S.pl.length;i++){var g=S.pl[i];
    if(!vis(g.x,g.w))continue;
    if(g.t===0){
      var hh=Math.max(90,H()-g.y+40);
      CX.fillStyle='#0b0d0f';CX.fillRect(g.x,g.y,g.w,hh);
      CX.fillStyle='#12161a';CX.fillRect(g.x,g.y,g.w,10);
      CX.fillStyle='rgba(255,255,255,.16)';CX.fillRect(g.x,g.y,g.w,2);
      CX.fillStyle='rgba(255,255,255,.05)';CX.fillRect(g.x,g.y+12,g.w,1);
      for(var s=0;s<14;s++){
        var sx=g.x+((s*233)%Math.max(1,g.w));
        CX.fillStyle='rgba(255,255,255,.03)';
        CX.fillRect(sx,g.y+20+((s*57)%Math.max(10,hh-30)),30,1);
      }
    }else if(g.t===1){
      CX.fillStyle='#101418';CX.fillRect(g.x,g.y,g.w,16);
      CX.fillStyle='rgba(255,255,255,.15)';CX.fillRect(g.x,g.y,g.w,2);
      CX.fillStyle='#0a0c0e';CX.fillRect(g.x+5,g.y+16,4,7);CX.fillRect(g.x+g.w-9,g.y+16,4,7);
    }else{
      CX.fillStyle='#0d1013';CX.fillRect(g.x,g.y,g.w,Math.min(g.h,H()-g.y+40));
      CX.fillStyle='rgba(255,255,255,.11)';CX.fillRect(g.x,g.y,g.w,2);
      CX.fillStyle='#040405';CX.fillRect(g.x+5,g.y+12,g.w-10,3);CX.fillRect(g.x+5,g.y+30,g.w-10,3);
      CX.fillStyle='rgba(255,255,255,.06)';CX.fillRect(g.x+5,g.y+21,g.w-10,2);
    }
  }
}
function mobs(){
  for(var i=0;i<S.mo.length;i++){var m=S.mo[i];
    if(!vis(m.x-m.r,m.r*2))continue;
    var d=m.boss?m.bdef:PM[m.t],c=m.f>0?'#ffffff':d.cl;
    CX.save();CX.translate(m.x,m.y);
    if(m.f>0)CX.globalAlpha=0.6+0.4*Math.sin(S.fn*0.7);
    if(m.boss){
      var pc=m.ph2||0,ring=['rgba(255,92,122,.35)','rgba(255,122,107,.45)','rgba(255,214,10,.55)'][Math.min(2,pc)];
      CX.strokeStyle=ring;CX.lineWidth=3;
      CX.beginPath();CX.arc(0,0,m.r+6+Math.sin(S.fn*0.08)*2,0,7);CX.stroke();
      CX.strokeStyle='rgba(255,214,10,.5)';CX.lineWidth=2;
      CX.strokeRect(-m.r-2,-m.r*1.7,m.r*2+4,m.r*3.4);
    }else if(m.el){
      CX.strokeStyle='rgba(255,214,10,.55)';CX.lineWidth=2;
      CX.strokeRect(-m.r-5,-m.r*1.9,m.r*2+10,m.r*3.8);
    }
    CX.fillStyle=c;
    if(m.boss||m.t===0||m.t===3||m.t===5||m.t===4){
      var bob=m.t===1?0:Math.sin(S.fn*0.09+i)*1.2;
      CX.fillRect(-m.r,-m.r*1.55+bob,m.r*2,m.r*3.1);
      CX.fillStyle='rgba(255,255,255,.10)';
      CX.fillRect(-m.r,-m.r*1.55+bob,3,m.r*3.1);
      CX.fillStyle='rgba(4,4,5,.85)';
      CX.fillRect(-m.r+3,-m.r*1.05+bob,m.r*2-6,4);
      CX.fillRect(m.sd>0?m.r-3:-m.r-7,-m.r*0.7+bob,9,4);
      if(m.t===5||m.boss){
        CX.fillStyle='rgba(4,4,5,.5)';
        CX.fillRect(-m.r+3,-m.r*0.3+bob,m.r*2-6,2);
        CX.fillRect(-m.r+5,-m.r*0.1+bob,m.r*2-10,2);
      }
      if(m.t===4){
        CX.fillStyle='rgba(122,208,138,.55)';
        CX.fillRect(-m.r+2,-m.r*1.9+bob,4,4);
        CX.fillRect(m.r-6,-m.r*1.9+bob,4,4);
        CX.fillRect(0,-m.r*2.1+bob,4,4);
      }
      CX.fillStyle=c;
      if(m.t===3||m.boss){CX.fillRect(m.sd>0?m.r+1:-m.r-7,-m.r*0.5+bob,6,m.r*1.2)}
      else CX.fillRect(m.sd>0?m.r+2:-m.r-6,-m.r*0.5+bob,4,m.r*1.1);
      CX.fillStyle='rgba(4,4,5,.9)';
      CX.fillRect(m.sd>0?m.r*0.15:-m.r*0.6,-m.r*1.15+bob,5,4);
      CX.fillRect(m.sd>0?m.r*0.55:-m.r*0.2,-m.r*1.15+bob,5,4);
      CX.fillStyle=m.f>0?'#fff':'#ff7a6b';
      CX.fillRect(m.sd>0?m.r*0.2:-m.r*0.55,-m.r*1.1+bob,3,2);
      CX.fillRect(m.sd>0?m.r*0.6:-m.r*0.15,-m.r*1.1+bob,3,2);
      if(m.chg>0){CX.fillStyle='rgba(255,120,90,.5)';CX.fillRect(-m.r-3,-m.r*1.7+bob,m.r*2+6,m.r*3.4)}
      if(m.burn>0){
        CX.fillStyle='rgba(255,122,107,'+(0.3+0.3*Math.sin(S.fn*0.4)).toFixed(2)+')';
        CX.fillRect(-m.r-2,-m.r*1.75+bob,m.r*2+4,5);
      }
      if(m.boss){
        CX.fillStyle='rgba(255,214,10,.85)';
        CX.fillRect(-m.r*0.6,-m.r*1.15+bob,4,4);CX.fillRect(m.r*0.6-4,-m.r*1.15+bob,4,4);
      }
    }else if(m.t===1){
      var sw=Math.sin(S.fn*0.11+i)*3;
      CX.globalAlpha=0.22;
      CX.fillStyle='#ffd60a';
      CX.beginPath();CX.arc(0,0,m.r*2.1,0,7);CX.fill();
      CX.globalAlpha=m.f>0?0.9:1;
      CX.fillStyle=c;
      CX.fillRect(-m.r*0.8,-m.r*0.9,m.r*1.6,m.r*1.8);
      CX.fillStyle='rgba(255,214,10,.35)';
      CX.fillRect(-m.r*0.5,-m.r*0.6,m.r,m.r*1.2);
      CX.fillStyle=c;
      CX.fillRect(-m.r*0.9,-m.r*1.1,m.r*1.8,3);
      CX.fillRect(-m.r*0.9,m.r*0.82,m.r*1.8,3);
      CX.fillStyle='rgba(4,4,5,.8)';CX.fillRect(m.sd>0?1:-6,-3,5,6);
      CX.fillStyle=c;
      CX.fillRect(-m.r*1.5+sw,m.r*0.7,4,6);
      CX.fillRect(m.r*1.5-4-sw,m.r*0.7,4,6);
    }else{
      CX.fillRect(-m.r,-m.r*1.75,m.r*2,m.r*3.5);
      CX.fillStyle='rgba(255,255,255,.10)';
      CX.fillRect(-m.r,-m.r*1.75,3,m.r*3.5);
      CX.fillStyle='rgba(4,4,5,.85)';
      CX.fillRect(-m.r+2,-m.r*1.2,m.r*2-4,3);
      CX.fillRect(-m.r+2,-m.r*0.55,m.r*2-4,2);
      CX.fillStyle=c;
      CX.fillRect(m.sd>0?m.r:-m.r-10,-m.r*0.35,10,5);
      CX.fillRect(m.sd>0?m.r+1:-m.r-11,-m.r*0.25,3,3);
      CX.fillStyle='rgba(4,4,5,.9)';
      CX.fillRect(m.sd>0?m.r*0.3:-m.r*0.7,-m.r*1.5,6,4);
      CX.fillStyle='#5ad1ff';
      CX.fillRect(m.sd>0?m.r*0.4:-m.r*0.6,-m.r*1.45,3,2);
    }
    if(m.hp<m.mx&&!m.boss){
      var r=cl(m.hp/m.mx,0,1);
      CX.fillStyle='rgba(4,4,5,.75)';CX.fillRect(-18,-m.r*2.1-10,36,4);
      CX.fillStyle=m.el?'#ffd60a':(r>0.4?'#7ad08a':'#ffd60a');
      CX.fillRect(-18,-m.r*2.1-10,36*r,4);
    }
    CX.restore();CX.globalAlpha=1;
  }
}
function bullets(){
  for(var i=0;i<S.bu.length;i++){var b=S.bu[i];
    if(!vis(b.x-10,20))continue;
    if(b.own===3){
      if(b.sp==='fire'){
        CX.fillStyle='rgba(255,122,107,.35)';
        CX.beginPath();CX.arc(b.x,b.y,b.r*2.2,0,7);CX.fill();
        CX.fillStyle='#ff7a6b';CX.beginPath();CX.arc(b.x,b.y,b.r,0,7);CX.fill();
        CX.fillStyle='#ffd60a';CX.beginPath();CX.arc(b.x-1,b.y-1,b.r*0.45,0,7);CX.fill();
      }else if(b.sp==='pot'){
        CX.fillStyle='rgba(255,214,10,.32)';
        CX.beginPath();CX.arc(b.x,b.y,b.r*2,0,7);CX.fill();
        CX.fillStyle='#ffd60a';CX.beginPath();CX.arc(b.x,b.y,b.r*0.8,0,7);CX.fill();
      }else{
        CX.fillStyle='rgba(154,209,255,.4)';
        CX.beginPath();CX.ellipse(b.x,b.y,b.r*2.4,b.r*0.9,0,0,7);CX.fill();
        CX.fillStyle='#e6edef';
        CX.beginPath();CX.ellipse(b.x,b.y,b.r*0.9,b.r*0.4,0,0,7);CX.fill();
      }
      continue;
    }
    if(b.own){
      var c=b.own===2?'#ffd60a':'#5ad1ff';
      CX.fillStyle=c;CX.globalAlpha=0.4;
      CX.beginPath();CX.arc(b.x,b.y,b.r*2,0,7);CX.fill();
      CX.globalAlpha=1;
      CX.fillStyle=c;CX.beginPath();CX.arc(b.x,b.y,b.r,0,7);CX.fill();
      CX.fillStyle='#fff';CX.beginPath();CX.arc(b.x-1,b.y-1,b.r*0.4,0,7);CX.fill();
    }else{
      CX.fillStyle='rgba(200,168,74,.28)';
      CX.beginPath();CX.arc(b.x,b.y,b.r*2.4,0,7);CX.fill();
      CX.fillStyle='#ffd60a';CX.beginPath();CX.arc(b.x,b.y,b.r,0,7);CX.fill();
      CX.fillStyle='#fff8d0';CX.beginPath();CX.arc(b.x-1,b.y-1,b.r*0.45,0,7);CX.fill();
    }
  }
}
function drops(){
  for(var i=0;i<S.dr.length;i++){var d=S.dr[i];
    if(!vis(d.x-12,24))continue;
    var c=KC[d.k%KC.length],pu=0.5+0.5*Math.sin(S.fn*0.09+d.k);
    CX.globalAlpha=0.25+pu*0.35;
    CX.fillStyle=c;CX.beginPath();CX.arc(d.x,d.y,7+pu*2,0,7);CX.fill();
    CX.globalAlpha=1;
    CX.fillStyle=c;CX.fillRect(d.x-3,d.y-3,6,6);
    CX.fillStyle='rgba(255,255,255,.7)';CX.fillRect(d.x-3,d.y-3,2,2);
  }
}
function player(){
  if(!P.al)return;
  var bl=P.it>0&&Math.floor(S.fn/4)%2===0;
  var run=Math.abs(P.vx)>30&&P.gr;
  var ph=Math.floor(S.fn/(run?4:9))%2;
  CX.save();CX.translate(P.x,P.y);
  if(bl)CX.globalAlpha=0.45;
  if(P.guard>0){
    CX.strokeStyle='rgba(90,209,255,'+(0.4+0.25*Math.sin(S.fn*0.3)).toFixed(2)+')';
    CX.lineWidth=2;
    CX.beginPath();CX.arc(P.w/2,P.h/2,P.r+8,0,7);CX.stroke();
  }
  if(P.flow>0){CX.fillStyle='rgba(154,209,255,.2)';CX.fillRect(-7,-5,P.w+14,P.h+10)}
  CX.fillStyle='rgba(90,209,255,.13)';CX.fillRect(-3,-3,P.w+6,P.h+6);
  CX.fillStyle='#9aa6ac';
  if(P.gr){
    if(run){
      CX.fillRect(4,26,7,8-((ph)?3:0));
      CX.fillRect(15,26,7,8-((ph)?0:3));
    }else{
      CX.fillRect(4,26,7,8);CX.fillRect(15,26,7,8);
    }
  }else{
    CX.fillRect(3,25,7,8);CX.fillRect(16,25,7,9);
  }
  CX.fillStyle='#e6edef';CX.fillRect(2,10,22,17);
  CX.fillStyle='#c8d2d6';CX.fillRect(2,10,22,3);
  CX.fillStyle='rgba(4,4,5,.55)';CX.fillRect(2,22,22,2);
  CX.fillStyle='#f2f6f7';CX.fillRect(5,1,16,10);
  CX.fillStyle='#9aa6ac';CX.fillRect(5,1,16,2);
  CX.fillStyle='#0a0d10';CX.fillRect(P.fc>0?9:3,4,12,4);
  CX.fillStyle=P.burn>0?'#ff7a6b':'#5ad1ff';
  CX.fillRect(P.fc>0?16:5,5,3,2);
  CX.fillStyle='#dfe7ea';
  if(P.fc>0)CX.fillRect(20,14,5,6);else CX.fillRect(1,14,5,6);
  var wl=(P.hitT||0)>0?14:8;
  CX.fillStyle='#b9c3c8';
  if(P.fc>0)CX.fillRect(23,16,wl,3);else CX.fillRect(3-wl,16,wl,3);
  if(P.ac>0){
    var pr=1-P.ac/0.15,wide=(60+upVal('rng')+S.wpn.ps);
    CX.strokeStyle='rgba(255,214,10,'+(0.75-pr*0.55).toFixed(3)+')';
    CX.lineWidth=3;
    CX.beginPath();
    if(P.fc>0)CX.arc(P.w*0.5,P.h*0.45,wide*(0.45+pr*0.5),-1.05,1.05);
    else CX.arc(P.w*0.5,P.h*0.45,wide*(0.45+pr*0.5),Math.PI-1.05,Math.PI+1.05);
    CX.stroke();
    CX.strokeStyle='rgba(255,255,255,.3)';CX.lineWidth=1;CX.stroke();
  }
  if(P.chg>0){
    var cr=cl(P.chg/0.38,0,1);
    CX.strokeStyle='rgba(255,214,10,'+(0.3+cr*0.6).toFixed(2)+')';
    CX.lineWidth=2+cr*2;
    CX.beginPath();CX.arc(P.w/2,P.h/2,P.r+4+cr*10,0,7);CX.stroke();
  }
  CX.restore();CX.globalAlpha=1;
}
function fx(ox,oy){
  for(var i=0;i<S.fx.length;i++){var e=S.fx[i];
    var a=cl(e.l/e.m,0,1);
    if(e.bolt){
      var dx=e.tx-e.cx,dy=e.ty-e.cy,seg=6;
      CX.globalAlpha=a;
      CX.strokeStyle=e.c;CX.lineWidth=3;
      CX.beginPath();
      CX.moveTo(e.cx+ox,e.cy+oy);
      for(var q=1;q<seg;q++){
        var t=q/seg;
        CX.lineTo(e.cx+dx*t+ox+(Math.random()*2-1)*9,e.cy+dy*t+oy+(Math.random()*2-1)*9);
      }
      CX.lineTo(e.tx+ox,e.ty+oy);
      CX.stroke();
      CX.strokeStyle='#fff';CX.lineWidth=1;CX.stroke();
      CX.globalAlpha=1;
      continue;
    }
    if(e.k===3){
      e.r0+=(e.r1-e.r0)*0.22;
      CX.globalAlpha=a*0.8;
      CX.strokeStyle=e.c;CX.lineWidth=3;
      CX.beginPath();
      CX.ellipse(e.x+ox,e.y+oy,e.r0,e.r0*0.32,0,0,7);
      CX.stroke();
      continue;
    }
    if(e.k===2){
      CX.globalAlpha=a;
      if(e.g){
        CX.shadowColor='#ffd60a';CX.shadowBlur=10;
      }
      CX.font=(e.g?'700 ':'600 ')+e.s+'px Consolas,"Cascadia Mono",monospace';
      CX.fillStyle=e.c;
      CX.textAlign='center';
      CX.fillText(e.t,e.x+ox,e.y+oy);
      CX.textAlign='left';
      CX.shadowBlur=0;
      continue;
    }
    CX.globalAlpha=a*(e.k===0?0.4:1);
    CX.fillStyle=e.c;
    CX.fillRect(e.x+ox-e.s/2,e.y+oy-e.s/2,e.s,e.s);
  }
  CX.globalAlpha=1;CX.shadowBlur=0;
}
function aliveCount(){
  var n=0;
  for(var i=0;i<S.mo.length;i++)if(!S.mo[i].dd)n++;
  return n;
}
function hud(){
  var bw=Math.min(230,Math.max(110,S.vw*0.28));
  CX.fillStyle='rgba(255,255,255,.045)';CX.fillRect(12,12,bw+62,44);
  CX.strokeStyle='rgba(255,255,255,.12)';CX.lineWidth=1;CX.strokeRect(12.5,12.5,bw+61,43);
  CX.fillStyle='#8a9499';CX.font=F(10);
  CX.fillText('HP',20,32);
  CX.fillStyle='rgba(255,255,255,.16)';CX.fillRect(42,23,bw,10);
  var r=cl(P.hp/P.mx,0,1),hc=r>0.55?'#7ad08a':r>0.28?'#ffd60a':'#ff5c7a';
  CX.fillStyle=hc;CX.fillRect(42,23,bw*r,10);
  CX.fillStyle='rgba(255,255,255,.3)';CX.fillRect(42,23,bw*r,2);
  if(r<0.3){
    CX.globalAlpha=0.3+0.3*Math.sin(S.fn*0.22);
    CX.fillStyle='rgba(255,92,122,.55)';CX.fillRect(42,23,bw,10);
    CX.globalAlpha=1;
  }
  CX.fillStyle='#6a767d';
  CX.fillText(Math.max(0,Math.ceil(P.hp))+'/'+P.mx,44+bw,32);
  CX.fillStyle='#8a9499';
  CX.fillText('第 '+S.lay+' 层',20,47);
  CX.fillStyle='#6a767d';
  CX.fillText('杀 '+S.kll+' · 拾 '+S.got+' · 最优 '+S.sc,68,47);
  CX.fillStyle='#ffd60a';
  CX.fillText('◈ '+S.gold,192,47);
  if(S.cave){
    CX.fillStyle='#4a5459';CX.font=F(9);
    CX.fillText(S.cave.n,240,47);
  }

  var ew=Math.min(180,Math.max(90,S.vw*0.18)),ex=VW0(ew);
  CX.fillStyle='rgba(255,255,255,.045)';CX.fillRect(12,60,ew+56,20);
  CX.fillStyle='#5ad1ff';CX.font=F(9);
  CX.fillText('EN',20,74);
  CX.fillStyle='rgba(255,255,255,.16)';CX.fillRect(38,65,ew,10);
  var er=cl(P.en/ENMX,0,1);
  CX.fillStyle=er>=1?'#2ee6a8':'#5ad1ff';CX.fillRect(38,65,ew*er,10);
  CX.fillStyle='#6a767d';CX.fillText(Math.floor(P.en)+'',40+ew,74);
  CX.fillStyle='rgba(255,255,255,.045)';CX.fillRect(12,84,ew+56,18);
  CX.fillStyle='#9ad1ff';CX.font=F(9);
  CX.fillText('MP',20,97);
  CX.fillStyle='rgba(255,255,255,.14)';CX.fillRect(38,88,ew,10);
  var mr=cl(P.mp/P.mpmx,0,1);
  CX.fillStyle='#9ad1ff';CX.fillRect(38,88,ew*mr,10);
  CX.fillStyle='#6a767d';CX.fillText(Math.floor(P.mp)+'',40+ew,97);

  var pw=Math.min(240,Math.max(110,S.vw*0.26)),px=S.vw-pw-18;
  CX.fillStyle='rgba(255,255,255,.045)';CX.fillRect(px-6,12,pw+12,32);
  CX.strokeStyle='rgba(255,255,255,.1)';CX.strokeRect(px-5.5,12.5,pw+11,31);
  var left=aliveCount()+Math.max(0,S.spq);
  var init=Math.max(1,S.spawnTotal||left);
  var pr=cl(1-left/init,0,1);
  CX.fillStyle='rgba(255,255,255,.16)';CX.fillRect(px,20,pw,10);
  CX.fillStyle=(S.pt&&S.pt.on)?'#2ee6a8':(pr>0.85?'#ffd60a':'#5ad1ff');
  CX.fillRect(px,20,pw*pr,10);
  CX.fillStyle='rgba(255,255,255,.3)';CX.fillRect(px,20,pw*pr,2);
  CX.fillStyle='#6a767d';CX.font=F(9);
  if(S.zone==='mtn'){
    CX.fillText('圣 山 · 交易与休整',px,38);
    CX.textAlign='right';
    CX.fillText('◈ '+S.gold,px+pw,38);
    CX.textAlign='left';
  }else{
    CX.fillText(S.evt?('事件 · '+S.evt.n):('深度 '+(S.lay*10)+' m'),px,38);
    CX.textAlign='right';
    CX.fillStyle=(S.pt&&S.pt.on)?'#2ee6a8':'#6a767d';
    CX.fillText((S.pt&&S.pt.on)?'传送门已开启':('剩余 '+left+' 只'),px+pw,38);
    CX.textAlign='left';
  }
  if(S.pt&&S.pt.on){
    var _tx=S.pt.x-S.cam.x,_ty=S.pt.y-S.cam.y,_dx=_tx-S.vw/2,_dy=_ty-S.vh/2;
    var _d2=Math.sqrt(_dx*_dx+_dy*_dy);
    if(_d2>220){
      var _a=Math.atan2(_dy,_dx);
      var _m=Math.min(_d2,S.vw*0.5-40);
      var _ex=cl(S.vw/2+Math.cos(_a)*_m,30,S.vw-30);
      var _ey=cl(S.vh/2+Math.sin(_a)*_m,64,S.vh-30);
      CX.save();CX.translate(_ex,_ey);CX.rotate(_a);
      CX.strokeStyle='#2ee6a8';CX.lineWidth=2;CX.globalAlpha=0.9;
      CX.beginPath();CX.moveTo(12,0);CX.lineTo(-6,-8);CX.lineTo(-2,0);CX.lineTo(-6,8);CX.closePath();CX.stroke();
      CX.restore();
      CX.fillStyle='#2ee6a8';CX.font='600 11px Consolas,"Cascadia Mono",monospace';
      CX.fillText('传送门 · '+Math.round(_d2/8)+'m',cl(_ex,40,S.vw-150),cl(_ey,80,S.vh-24));
    }
  }

  skills();
  spellIcon();

  if(S.wpn.n){
    var durTxt='';
    if(S.durmax>0)durTxt=' · 耐久 '+Math.max(0,S.dur)+'/'+S.durmax;
    CX.fillStyle='rgba(255,255,255,.04)';CX.fillRect(12,86,132,18);
    CX.fillStyle=(S.durmax>0&&S.dur<=0)?'#ff5c7a':(S.wpn.rar>0?'#ffd60a':'#8a9499');
    CX.font=F(9);
    CX.fillText('⚔ '+S.wpn.n.slice(0,9)+durTxt.slice(0,20),18,99);
  }
  if(S.relic&&(S.relic.frag||S.relic.iron||S.relic.book)){
    CX.textAlign='right';
    CX.font=F(9);
    var rx=S.vw-18,ry=S.vh-186;
    CX.fillStyle='#2ee6a8';CX.fillText('碎片 '+S.relic.frag,rx,ry);
    CX.fillStyle='#9ad1ff';CX.fillText('魔铁 '+S.relic.iron,rx,ry+12);
    CX.fillStyle='#ffd60a';CX.fillText('附魔书 '+S.relic.book,rx,ry+24);
    CX.textAlign='left';
  }
  if(S.cb>1){
    var ca=cl(S.cbt/1.6,0,1)*0.5+0.5;
    var sz=Math.min(30,15+S.cb*0.7);
    CX.globalAlpha=ca;
    CX.font='700 '+sz+'px Consolas,"Cascadia Mono",monospace';
    CX.fillStyle=S.cb>=12?'#ffd60a':'#e6edef';
    CX.textAlign='right';
    CX.fillText('x'+S.cb,VW2(0),S.vh*0.36);
    CX.textAlign='left';
    CX.globalAlpha=1;
  }
  if(S.msg&&S.msgt>0){
    CX.globalAlpha=cl(S.msgt,0,1);
    CX.fillStyle='#5ad1ff';CX.font=F(11);
    CX.textAlign='center';
    CX.fillText(S.msg,S.vw/2,S.vh*0.24);
    CX.textAlign='left';CX.globalAlpha=1;
  }
  if(P.flow>0||P.ward>0||P.guard>0||P.slow>0){
    CX.font=F(9);
    var yy=S.vh-30,tags=[];
    if(P.flow>0)tags.push(['流动 '+P.flow.toFixed(1),'#9ad1ff']);
    if(P.ward>0)tags.push(['坚固 '+P.ward.toFixed(1),'#ffd60a']);
    if(P.guard>0)tags.push(['铁壁 '+P.guard.toFixed(1),'#5ad1ff']);
    if(P.slow>0)tags.push(['时缓 '+P.slow.toFixed(1),'#e6edef']);
    for(var t=0;t<tags.length;t++){CX.fillStyle=tags[t][1];CX.fillText(tags[t][0],16+t*74,yy)}
  }
  if(S.hit>0){
    CX.fillStyle='rgba(255,92,122,'+(S.hit/0.34*0.2).toFixed(3)+')';
    CX.fillRect(0,0,S.vw,S.vh);
  }
  if(S.sx>0){
    CX.fillStyle='rgba(255,214,10,'+Math.min(0.5,S.sx*0.6).toFixed(3)+')';
    CX.fillRect(0,0,2,S.vh);CX.fillRect(S.vw-2,0,2,S.vh);
  }
}
function spellIcon(){
  var d=curSpell();
  if(!d)return;
  var ks=ABY.spellKeys?ABY.spellKeys():['fire'];
  var sz=34,x=S.vw/2-190,y=S.vh-46;
  var ready=P.mp>=d.c&&P.spcd<=0;
  CX.fillStyle=ready?'rgba(154,209,255,.18)':'rgba(255,255,255,.05)';
  CX.fillRect(x,y,sz,sz);
  CX.strokeStyle=ready?'rgba(154,209,255,.6)':'rgba(255,255,255,.18)';
  CX.lineWidth=1;CX.strokeRect(x+0.5,y+0.5,sz-1,sz-1);
  CX.textAlign='center';
  CX.fillStyle=ready?'#e6edef':'#6a767d';
  CX.font=F(11);
  CX.fillText(d.n.slice(0,2),x+sz/2,y+sz/2+1);
  CX.font=F(8);
  CX.fillStyle=ready?'#9ad1ff':'#4a5459';
  CX.fillText('右键 '+d.c,x+sz/2,y+sz-5);
  CX.fillStyle='#4a5459';CX.font=F(8);
  CX.textAlign='right';
  CX.fillText((P.spl%Math.max(1,ks.length)+1)+'/'+ks.length,x-6,y+sz-6);
  CX.textAlign='center';
  CX.textAlign='left';
  if(P.spcd>0){
    CX.fillStyle='rgba(4,4,5,.7)';
    CX.fillRect(x,y,sz,sz*cl(P.spcd/0.42,0,1));
  }
}
function VW0(w){return S.vw*0.5-w*0.5-60}
function VW2(){
  if(P.x-S.cam.x>S.vw*0.5)return S.vw*0.5-40;
  return S.vw*0.5+40;
}
function skills(){
  var n=P.sk.length,sz=34,gap=8;
  var total=n*sz+(n-1)*gap;
  var x0=S.vw/2-total/2,y0=S.vh-46;
  for(var i=0;i<n;i++){
    var k=P.sk[i],d=skBy(k);
    if(!d)continue;
    var x=x0+i*(sz+gap);
    var ready=P.scd[i]<=0&&P.en>=d.e;
    CX.fillStyle=ready?'rgba(90,209,255,.18)':'rgba(255,255,255,.05)';
    CX.fillRect(x,y0,sz,sz);
    CX.strokeStyle=ready?'rgba(90,209,255,.6)':'rgba(255,255,255,.18)';
    CX.lineWidth=1;CX.strokeRect(x+0.5,y0+0.5,sz-1,sz-1);
    CX.fillStyle=ready?'#e6edef':'#6a767d';
    CX.font=F(11);
    CX.textAlign='center';
    CX.fillText(d.n.slice(0,2),x+sz/2,y0+sz/2+1);
    CX.font=F(8);
    CX.fillStyle=ready?'#5ad1ff':'#4a5459';
    CX.fillText((d.key||'').toUpperCase()+' '+d.e,x+sz/2,y0+sz-5);
    CX.textAlign='left';
    if(P.scd[i]>0){
      var cd=d.cd*(1-upVal('cdr')/100);
      var f=cl(P.scd[i]/cd,0,1);
      CX.fillStyle='rgba(4,4,5,.7)';
      CX.fillRect(x,y0,sz,sz*f);
      CX.fillStyle='#e6edef';CX.font=F(11);
      CX.textAlign='center';
      CX.fillText(P.scd[i].toFixed(1),x+sz/2,y0+sz/2+4);
      CX.textAlign='left';
    }
  }
  potBar();
}
function potBar(){
  var n=4,px0=S.vw-18,base=S.vh-30;
  CX.textAlign='right';
  CX.fillStyle='#4a5459';CX.font=F(9);
  CX.fillText('药剂 [1-4]',px0,base-56);
  for(var q=0;q<n;q++){
    var p=S.pots[q],yy=base-q*15;
    CX.fillStyle='rgba(255,255,255,.04)';
    CX.fillRect(px0-104,yy-10,104,13);
    if(p){
      var on=p.c>0&&(S.potSel===q);
      CX.fillStyle=on?'rgba(255,214,10,.22)':'rgba(255,255,255,.03)';
      CX.fillRect(px0-104,yy-10,104,13);
      CX.fillStyle=p.c>0?'#ffd60a':'#4a5459';
      CX.font=F(10);
      CX.fillText(p.n.slice(0,5),px0-6,yy);
      CX.fillStyle=p.c>0?'#e6edef':'#4a5459';
      CX.fillText('x'+p.c,px0-64,yy);
      if(on){
        CX.fillStyle='#ffd60a';
        CX.fillRect(px0-104,yy-10,2,13);
      }
    }else{
      CX.fillStyle='#333b40';CX.font=F(10);
      CX.fillText('空',px0-6,yy);
    }
    CX.font=F(8);
    CX.fillStyle='#4a5459';
    CX.fillText(''+(q+1),px0-98,yy);
  }
  if(!S.pots.length){
    CX.fillStyle='#5a6469';CX.font=F(9);
    CX.textAlign='right';
    CX.fillText('炼金页炼制后带入',px0,base+18);
  }
  CX.textAlign='left';
}
function trans(){
  var s=cl(S.trt/S.trd,0,1),al;
  if(s>0.8)al=(1-s)/0.2;
  else if(s>0.24)al=1;
  else al=s/0.24;
  al=cl(al,0,1);
  CX.fillStyle='rgba(4,4,5,'+al.toFixed(3)+')';CX.fillRect(0,0,S.vw,S.vh);
  if(al>0.45){
    CX.globalAlpha=cl((al-0.45)/0.55,0,1);
    CX.textAlign='center';
    CX.fillStyle='#e6edef';CX.font='600 15px Consolas,"Cascadia Mono",monospace';
    CX.fillText('下 沉 · 第 '+(S.lay)+' 层',S.vw/2,S.vh/2-10);
    CX.fillStyle='#6a767d';CX.font=F(11);
    CX.fillText('深度 '+(S.lay*10)+' m · 生命 +25',S.vw/2,S.vh/2+16);
    CX.textAlign='left';CX.globalAlpha=1;
  }
}
function pause(){
  CX.fillStyle='rgba(4,4,5,.72)';CX.fillRect(0,0,S.vw,S.vh);
  CX.textAlign='center';
  CX.fillStyle='#ffd60a';CX.font='600 15px Consolas,"Cascadia Mono",monospace';
  CX.fillText('▮ 已 暂 停',S.vw/2,S.vh/2-10);
  CX.fillStyle='#6a767d';CX.font=F(11);
  CX.fillText('P 继续 · '+(S.shk.on?'M 静音':'M 开声'),S.vw/2,S.vh/2+16);
  CX.textAlign='left';
}
function pickPanel(){
  CX.fillStyle='rgba(4,4,5,.86)';CX.fillRect(0,0,S.vw,S.vh);
  var n=S.psel.length;
  CX.textAlign='center';
  CX.fillStyle='#2ee6a8';CX.font='600 15px Consolas,"Cascadia Mono",monospace';
  CX.fillText('深 渊 馈 赠 · 三 选 一',S.vw/2,S.vh*0.3-24);
  CX.fillStyle='#6a767d';CX.font=F(10);
  CX.fillText('点击选择 · 1/2/3 快捷键',S.vw/2,S.vh*0.3-4);
  CX.textAlign='left';
  var cw=Math.min(170,(S.vw-120)/3-14),ch=132;
  var tot=n*cw+(n-1)*14,x0=S.vw/2-tot/2,y0=S.vh*0.42;
  for(var i=0;i<n;i++){
    var u=S.psel[i],x=x0+i*(cw+14);
    var sel=S.psel2===i;
    CX.fillStyle=sel?'rgba(46,230,168,.12)':'rgba(255,255,255,.04)';
    CX.fillRect(x,y0,cw,ch);
    CX.strokeStyle=sel?'#2ee6a8':'rgba(255,255,255,.18)';
    CX.lineWidth=sel?2:1;
    CX.strokeRect(x+0.5,y0+0.5,cw-1,ch-1);
    CX.textAlign='center';
    CX.fillStyle=sel?'#2ee6a8':'#e6edef';
    CX.font='600 14px Consolas,"Cascadia Mono",monospace';
    CX.fillText(u.n,x+cw/2,y0+34);
    var lv=S.up[u.k]||0;
    CX.fillStyle='#6a767d';CX.font=F(9);
    CX.fillText('Lv '+(lv+1)+' / '+u.mx,x+cw/2,y0+52);
    CX.fillStyle='#8a9499';CX.font=F(10);
    var txt=u.d.replace('{v}',String(upVal(u.k)===0?firstVal(u.k):(valStep(u.k))));
    wrap(txt,x+cw/2,y0+76,cw-20,14);
    CX.fillStyle='#4a5459';CX.font=F(9);
    CX.fillText('['+(i+1)+']',x+cw/2,y0+ch-10);
    CX.textAlign='left';
  }
}
function firstVal(k){
  var o={atk:6,spd:5,vit:12,lch:3,inv:0.08,mov:8,jmp:1,rng:8,nrg:8,crt:5,crd:10,kb:5,rgn:0.8,cdr:4};
  return String(o[k]!==undefined?o[k]:1);
}
function valStep(k){
  var o={atk:6,spd:5,vit:12,lch:3,inv:0.08,mov:8,jmp:1,rng:8,nrg:8,crt:5,crd:10,kb:5,rgn:0.8,cdr:4};
  return String(o[k]!==undefined?o[k]:1);
}
function wrap(t,cx,cy,maxw,lh){
  var s=String(t),line='',y=cy;
  for(var i=0;i<s.length;i++){
    var tst=line+s[i];
    if(CX.measureText(tst).width>maxw&&line){
      CX.fillText(line,cx,y);line=s[i];y+=lh;
    }else line=tst;
  }
  if(line)CX.fillText(line,cx,y);
}
function over(){
  CX.fillStyle='rgba(4,4,5,.84)';CX.fillRect(0,0,S.vw,S.vh);
  var w=Math.min(430,S.vw-40),h=Math.min(438,S.vh-30),x=(S.vw-w)/2,y=(S.vh-h)/2;
  CX.fillStyle='rgba(11,11,13,.96)';CX.fillRect(x,y,w,h);
  CX.strokeStyle='rgba(255,214,10,.5)';CX.lineWidth=1;CX.strokeRect(x+0.5,y+0.5,w-1,h-1);
  CX.fillStyle='rgba(255,255,255,.04)';CX.fillRect(x+1,y+1,w-2,26);
  CX.textAlign='center';
  CX.fillStyle='#ffd60a';CX.font='600 14px Consolas,"Cascadia Mono",monospace';
  CX.fillText('沉 渊 收 割',x+w/2,y+18);
  CX.fillStyle='#6a767d';CX.font=F(11);
  CX.fillText('死因 · '+S.dead,x+w/2,y+50);
  CX.textAlign='left';
  var m=S.summ,ly=y+70;
  var best=S.best||0,newRec=m.lay>best;
  var rows=[['坠至层数','第 '+m.lay+' 层'+(newRec?'  ★新纪录':(best?('  (最佳 '+best+')'):''))],
    ['斩杀','× '+m.kill],['渊主','× '+(m.boss||0)],
    ['拾获','× '+m.got],['黄金','◈ '+S.gold],['最高连击','x '+m.cbmax],
    ['造成伤害',''+Math.round(m.dmg)],['累计承伤',''+Math.round(m.tkn)]];
  for(var i=0;i<rows.length;i++){
    CX.fillStyle='#6a767d';CX.font=F(11);
    CX.fillText(rows[i][0],x+24,ly+i*19);
    var vcol='#e6edef';
    if(rows[i][0]==='黄金')vcol='#ffd60a';
    else if(rows[i][0]==='渊主'&&m.boss)vcol='#ff5c7a';
    else if(i===0&&newRec)vcol='#2ee6a8';
    CX.fillStyle=vcol;
    CX.fillText(rows[i][1],x+w-24-CX.measureText(rows[i][1]).width,ly+i*19);
  }
  var uy=ly+8*19+6;
  CX.fillStyle='rgba(255,255,255,.03)';CX.fillRect(x+20,uy,w-40,54);
  CX.fillStyle='#4a5459';CX.font=F(9);
  CX.fillText('本 局 强 化',x+28,uy+14);
  var ups=[],kk;
  for(kk in S.up)if(Object.prototype.hasOwnProperty.call(S.up,kk)&&S.up[kk]>0)ups.push(kk+'×'+S.up[kk]);
  CX.fillStyle='#8a9499';CX.font=F(9);
  CX.fillText(ups.length?ups.join('  ').slice(0,64):'（无）',x+28,uy+30);
  var rel=[];
  if(S.relic){
    if(S.relic.frag)rel.push('碎片 '+S.relic.frag);
    if(S.relic.iron)rel.push('魔铁 '+S.relic.iron);
    if(S.relic.book)rel.push('附魔书 '+S.relic.book);
  }
  CX.fillStyle='#2ee6a8';
  CX.fillText(rel.length?('遗物  '+rel.join(' · ')):'遗物  （无）',x+28,uy+46);
  var bw=w-52,bx=x+26,by=y+h-46;
  CX.fillStyle='rgba(255,255,255,.06)';CX.fillRect(bx,by,bw,26);
  CX.strokeStyle='rgba(255,255,255,.4)';CX.strokeRect(bx+0.5,by+0.5,bw-1,25);
  CX.textAlign='center';
  CX.fillStyle='#e6edef';CX.font='600 12px Consolas,"Cascadia Mono",monospace';
  CX.fillText('⟳ 重 入 深 渊   [ R ]',x+w/2,by+18);
  CX.textAlign='left';
}

Object.assign(ABY,{draw:draw});
})();
