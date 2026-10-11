(function(){
var ABY=window.ABY=window.ABY||{};

const R=(function(){var S=123456789;return function(){S=(S*1103515245+12345)&0x7fffffff;return S/0x7fffffff}})();
const RD=Math.random;
const rr=(a,b)=>a+RD()*(b-a);
const ri=(a,b)=>a+Math.floor(RD()*(b-a+1));
const pk=a=>a[(RD()*a.length)|0];
const cl=(v,a,b)=>v<a?a:v>b?b:v;
const sg=v=>v>0?1:v<0?-1:0;
const ds=(x1,y1,x2,y2)=>{var a=x1-x2,b=y1-y2;return Math.sqrt(a*a+b*b)};
const ov=(a,b)=>a.x+a.w>b.x&&a.x<b.x+b.w&&a.y+a.h>b.y&&a.y<b.y+b.h;
const ap=(a,b)=>a+(b-a)*0.18;
const lerp=(a,b,t)=>a+(b-a)*t;
const rct=(r,b)=>{var x=r.x+b.x,y=r.y+b.y;return{x:x,y:y,w:b.w,h:b.h,cx:x+b.w/2,cy:y+b.h/2}};
const hit=(r,b)=>b.x<r.x+r.w&&b.x+b.w>r.x&&b.y<r.y+r.h&&b.y+b.h>r.y;
const f1=v=>Math.round(v*10)/10;
const pad=(n,l)=>String(n).padStart(l,'0');
const fmt=n=>{var s=n.toFixed(1);return s};

Object.assign(ABY,{R:R,RD:RD,rr:rr,ri:ri,pk:pk,cl:cl,sg:sg,ds:ds,ov:ov,ap:ap,lerp:lerp,rct:rct,hit:hit,f1:f1,pad:pad,fmt:fmt});
})();
