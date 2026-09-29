function genM(nx){function pn(x,y){var x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0,a=NH(x0,y0),b=NH(x0+1,y0),c=NH(x0,y0+1),d=NH(x0+1,y0+1),u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+d*u*v}
var mp=[];for(var j=0;j<MH;j++){mp[j]=[];for(var i=0;i<MW;i++)mp[j][i]=1}
var bm=Math.floor((nx|0)/2)%5,th=0.44+bm*0.015;
for(var j=4;j<MH-6;j++)for(var i=4;i<MW-4;i++){var v=pn(i/90+bm*31,j/90)*0.68+pn(i/23+bm*9,j/23)*0.32;if(v>th)mp[j][i]=0}
var rs2=[];
for(var r=0;r<4+Math.floor(rd()*3);r++){var rw=26+Math.floor(rd()*46),rh=10+Math.floor(rd()*14),rx=30+Math.floor(rd()*(MW-64)),ry=34+Math.floor(rd()*(MH-80));for(var jj=ry;jj<ry+rh;jj++)for(var ii=rx;ii<rx+rw;ii++){if(ii<4||ii>=MW-4||jj<4||jj>=MH-6)continue;mp[jj][ii]=0}rs2.push({x:rx,y:ry,w:rw,h:rh})}
var c0=MW>>1,sl=c0-5,sr=c0+5;
for(var jj=20;jj<MH-8;jj++)for(var ii=sl;ii<=sr;ii++)mp[jj][ii]=0;
for(var jj=21;jj<MH-10;jj+=18){for(var ii=sl;ii<=sr;ii++)if(rd()<.55)mp[jj][ii]=1}
for(var r2=0;r2<rs2.length;r2++){var rr=rs2[r2],cy=rr.y+Math.floor(rd()*rr.h),cx=Math.floor(rd()*(MW-50))+25;for(var jj=Math.min(cy,21);jj<=Math.max(cy,21);jj++)for(var ii=Math.min(rr.x+Math.floor(rr.w/2),cx);ii<=Math.max(rr.x+Math.floor(rr.w/2),cx);ii++){if(ii<4||ii>=MW-4||jj<4||jj>=MH-6)continue;mp[jj][ii]=0}}
var lqT=bm===1?7:bm===2?6:bm===3?8:bm===4?9:6;
for(var lp=0;lp<3+bm*2;lp++){var px=24+Math.floor(rd()*(MW-48)),py=40+Math.floor(rd()*(MH-90));for(var jj=py;jj<py+3;jj++)for(var ii=px;ii<px+6+Math.floor(rd()*9);ii++){if(ii<4||ii>=MW-4||jj<4||jj>=MH-8)continue;if(mp[jj][ii]===0)mp[jj][ii]=lqT}}
for(var jj=0;jj<MH;jj++)for(var ii=0;ii<MW;ii++){if(mp[jj][ii]!==1)continue;var tv=rd();if(bm===1&&tv<.28)mp[jj][ii]=2;else if(bm===2&&tv<.10)mp[jj][ii]=2;else if(bm===3&&tv<.16)mp[jj][ii]=5;else if(bm===4&&tv<.14)mp[jj][ii]=5;else if(tv<.05)mp[jj][ii]=3}
for(var jj=MH-8;jj<MH;jj++)for(var ii=4;ii<MW-4;ii++)if(mp[jj][ii]===0)mp[jj][ii]=1;
SEED=((Date.now()^((nx+1)*2654435761))>>>0)||1;
M2=mp;SY2=(MH-8)*BS;EX2={x:MW*BS/2,y:21*BS,on:1};rs=rs2}
function genL(){if(!M2)genM(WAVE|0);MP=M2;M2=null;SY=SY2;EX=EX2;BM=Math.floor((WAVE|0)/2)%5;var c0=MW>>1;
SP=[];BX=[];EN=[];SH=[];EB=[];KW=[];EXP={};VIS={};KC=0;
WU=[];
FL=[];for(var i=4;i<MW-4;i++){var fy=0;for(var j=3;j<MH-2;j++){if(!MP[j][i]&&MP[j+1][i]){fy=j;break}}FL[i]=fy}
for(var k=0;k<3;k++){var np=1+Math.floor(rd()*2);
  for(var i=0;i<np;i++){var xx=4+Math.floor(rd()*(MW-8)),fy=FL[xx];if(fy<4)continue;
    if(Math.abs(xx-c0)<22)continue;if(Math.abs(xx*BS-EX.x)<BS*4)continue;
    SP.push({x:xx*BS,y:fy*BS-10,w:22,h:10})}}
var nb=2+Math.floor(rd()*2);
for(var i=0;i<nb;i++){var xx=4+Math.floor(rd()*(MW-8)),fy=FL[xx];if(fy<4)continue;
  if(Math.abs(xx-c0)<18)continue;if(Math.abs(xx*BS-EX.x)<BS*3)continue;
  BX.push({x:xx*BS,y:fy*BS-24,w:24,h:24})}
for(var rj=0;rj<rs.length;rj++){if(rd()<.55){var rr=rs[rj];BX.push({x:(rr.x+(rr.w>>1))*BS-12,y:(rr.y+(rr.h>>1))*BS-24,w:24,h:24})}}
var nw=2+Math.floor(rd()*2);for(var wi2=0;wi2<nw;wi2++){if(rs.length<1)break;var ri2=Math.floor(rd()*rs.length),rr2=rs[ri2],wx2=rr2.x+(rr2.w>>1),wy2=0;for(var jj2=rr2.y;jj2<rr2.y+rr2.h;jj2++){if(!MP[jj2][wx2]&&MP[jj2+1][wx2]){wy2=jj2;break}}if(wy2<4)continue;if(Math.abs(wx2-c0)<18)continue;if(Math.abs(wx2*BS-EX.x)<BS*4)continue;WU.push({x:wx2*BS-12,y:wy2*BS-24,w:24,h:24})}var lqT=BM===1?7:BM===2?6:BM===3?8:BM===4?9:6;for(var lp=0;lp<2;lp++){var ri3=Math.floor(rd()*rs.length),rr3=rs[ri3],ci3=rr3.x+(rr3.w>>1),cy3=0;if(Math.abs(ci3-c0)<24)continue;for(var jj3=rr3.y;jj3<rr3.y+rr3.h;jj3++){if(!MP[jj3][ci3]&&MP[jj3+1][ci3]){cy3=jj3;break}}if(cy3<6)continue;var ow=Math.floor(rd()*3);for(var dy3=0;dy3<2+ow;dy3++)for(var dx3=-4+ow;dx3<=4-ow;dx3++){var px3=ci3+dx3;if(px3<0||px3>=MW||cy3+dy3>=MH)continue;if(!MP[cy3+dy3][px3]){MP[cy3+dy3][px3]=lqT;LQ.push([px3,cy3+dy3,lqT])}}}for(var ob2=0;ob2<2;ob2++){var ri4=Math.floor(rd()*rs.length),rr4=rs[ri4],obx=rr4.x+Math.floor(rd()*rr4.w),oby=rr4.y;for(var jj4=rr4.y;jj4<rr4.y+rr4.h;jj4++){if(!MP[jj4][obx]&&MP[jj4+1][obx]){oby=jj4;break}}if(oby<4)continue;OB.push({x:obx*BS+4,y:oby*BS-14,w:8,h:8,on:1})}
BW=WAVE%5===0&&WAVE>0;
var n=BW?3+Math.min(6,WAVE):6+Math.min(18,WAVE);
for(var i=0;i<n;i++){var xx=4+Math.floor(rd()*(MW-8)),fy=FL[xx];if(fy<4)continue;
  if(Math.abs(xx-c0)<14)continue;if(Math.abs(xx*BS-EX.x)<BS*2)continue;
  var t=rd(),ty=0;
  if(WAVE>=1&&t<.04)ty=13;else if(WAVE>=2&&t<.08)ty=14;else if(WAVE>=3&&t<.11)ty=15;else if(WAVE>=2&&t<.14)ty=16;else if(WAVE>=4&&t<.17)ty=17;else if(WAVE>=2&&t<.20)ty=18;else if(WAVE>=2&&t<.32)ty=1;else if(WAVE>=3&&t<.44)ty=2;else if(WAVE>=4&&t<.54)ty=3;else if(WAVE>=3&&t<.60)ty=5;else if(WAVE>=3&&t<.67)ty=6;else if(WAVE>=2&&t<.76)ty=8;else if(WAVE>=2&&t<.84)ty=9;else if(WAVE>=4&&t<.87)ty=10;else if(WAVE>=3&&t<.90)ty=11;else if(WAVE>=3&&t<.93)ty=12;
  if(ty===2)EN.push({x:xx*BS,y:fy*BS-90,w:30,h:24,hp:2+Math.floor(WAVE/2),ty:2,dm:1,cd:0,vx:0,slp:1});
  else if(ty===6)EN.push({x:xx*BS,y:fy*BS-30,w:30,h:30,hp:1+Math.floor(WAVE/2),ty:6,dm:2,cd:0,vx:0,slp:1});
  else if(ty===8)EN.push({x:xx*BS,y:fy*BS-56,w:56,h:56,hp:8+WAVE*2,mh:8+WAVE*2,ty:8,dm:2,cd:0,vx:0,slp:1});
  else if(ty===9)EN.push({x:xx*BS,y:fy*BS-34,w:30,h:34,hp:3+WAVE,ty:9,dm:1,cd:0,cdh:0,vx:0,slp:1});
  else if(ty===10)EN.push({x:xx*BS,y:fy*BS-30,w:26,h:30,hp:3+Math.floor(WAVE/2),ty:10,dm:1,cd:0,vx:0,slp:1,hi:0});
  else if(ty===11)EN.push({x:xx*BS,y:fy*BS-30,w:30,h:30,hp:4+WAVE,ty:11,dm:1,cd:0,vx:0,slp:1});
  else if(ty===12)EN.push({x:xx*BS,y:fy*BS-34,w:34,h:34,hp:5+WAVE,ty:12,dm:1,cd:0,cdh:0,vx:0,slp:1});
  else if(ty===13)EN.push({x:xx*BS,y:fy*BS-32,w:34,h:24,hp:3+WAVE,ty:13,dm:2,cd:0,vx:0,slp:1,ch:0,chh:0});
  else if(ty===14)EN.push({x:xx*BS,y:fy*BS-26,w:40,h:28,hp:6+WAVE*2,ty:14,dm:1,cd:0,vx:0,slp:1});
  else if(ty===15)EN.push({x:xx*BS,y:fy*BS-24,w:22,h:22,hp:2+Math.floor(WAVE/2),ty:15,dm:1,cd:0,vx:0,slp:1});
  else if(ty===16)EN.push({x:xx*BS,y:fy*BS-26,w:28,h:24,hp:2+WAVE,ty:16,dm:1,cd:0,vx:0,slp:1,jh:0});
  else if(ty===17)EN.push({x:xx*BS,y:fy*BS-34,w:30,h:36,hp:5+WAVE*2,ty:17,dm:1,cd:0,vx:0,slp:1});
  else if(ty===18)EN.push({x:xx*BS,y:fy*BS-24,w:22,h:22,hp:2+WAVE,ty:18,dm:2,cd:0,vx:0,slp:1});
  else EN.push({x:xx*BS,y:fy*BS-(ty===3?46:34),w:ty===3?40:30,h:ty===3?46:34,hp:ty===3?6+WAVE:ty===1?4+Math.floor(WAVE/2):2+Math.floor(WAVE/2),ty:ty,dm:1,cd:0,vx:0,slp:1})}
if(BW){EX.on=0;EN.push({x:EX.x-140,y:EX.y-86,w:66,h:80,hp:16+WAVE*5,mh:16+WAVE*5,ty:4,dm:2+Math.floor(WAVE/4),cd:0,ch:0,chh:0,slp:0})}
}
function genMt(){MP=[];for(var j=0;j<MH;j++){MP[j]=[];for(var i=0;i<MW;i++)MP[j][i]=4}for(var j2=1;j2<20;j2++)for(var i2=1;i2<MW-1;i2++)MP[j2][i2]=0;SP=[];BX=[];EN=[];SH=[];EB=[];KW=[];EXP={};VIS={};PS=[];DR=[];DM=[];SW=0;SPR={x:7*BS+6,y:20*BS-26,w:48,h:26};AL={x:MW*BS/2-50,y:20*BS-30,w:100,h:30,on:1};MX={x:(MW-6)*BS,y:20*BS-40,on:1};for(var j=15;j<20;j++)for(var i=MW-24;i<=MW-4;i++)MP[j][i]=0;IDL=[{x:MW*BS/2-5*BS,y:20*BS-56,w:40,h:56},{x:MW*BS/2+4*BS,y:20*BS-56,w:40,h:56}];PED=[];var it=[11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79];for(var qj=0;qj<8;qj++){var wi=it.splice(Math.floor(Math.random()*it.length),1)[0];PED.push({x:202*BS+8+qj*24,y:20*BS-24,w:20,h:24,id:wi,t:SK[wi].t,pr:SK[wi].t===1?8:SK[wi].t===2?10:SK[wi].t===3?12:SK[wi].t===4?13:9,bo:0})}for(var j=14;j<16;j++)for(var i=202;i<=214;i++)MP[j][i]=4;for(var j=14;j<28;j++)MP[j][214]=4;for(var j=14;j<20;j++){MP[j][200]=0;MP[j][201]=0}WZ={x:MW*BS/2-170,y:20*BS-30,w:120,h:30};ALR={x:MW*BS/2+50,y:20*BS-30,w:120,h:30,on:1};SP2={x:MW*BS/2-330,y:20*BS-26,w:48,h:26};GF=0;SY=(20+1)*BS;XP={};LQ=[];FZ=[];OB=[];P.hp10=0;}
