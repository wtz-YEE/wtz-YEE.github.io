/* ===== 协作种植花园 · 独立模块 garden.js ===== */
if(typeof apiBase!=='function'&&typeof window.apiBase!=='function'){window.apiBase=function(){return''}}
var G_PLANTS=[
{id:1,n:'字母·A藤',st:'letter',c:'#9b5de5'},
{id:2,n:'字母·W芽',st:'letter',c:'#00bbf9'},
{id:3,n:'字母·梦苗',st:'letter',c:'#f15bb5'},
{id:4,n:'像素向日葵',st:'pixel',c:'#ffd166'},
{id:5,n:'像素松树',st:'pixel',c:'#06d6a0'},
{id:6,n:'像素蘑菇',st:'pixel',c:'#ef476f'},
{id:7,n:'像素仙人掌',st:'pixel',c:'#06a77d'},
{id:8,n:'像素玫瑰',st:'pixel',c:'#f72585'},
{id:9,n:'像素郁金香',st:'pixel',c:'#ff90e8'},
{id:10,n:'几何·三角松',st:'geo',c:'#4cc9f0'},
{id:11,n:'几何·圆环莲',st:'geo',c:'#4361ee'},
{id:12,n:'几何·菱形仙人掌',st:'geo',c:'#7bc950'},
{id:13,n:'几何·星形花',st:'geo',c:'#ffd60a'},
{id:14,n:'几何·太阳花',st:'geo',c:'#ffb703'},
{id:15,n:'发光菌',st:'glow',c:'#39ff14'},
{id:16,n:'墨线竹',st:'ink',c:'#3a3f44'},
{id:17,n:'水晶缤',st:'crystal',c:'#b388ff'},
{id:18,n:'星云藤',st:'nebula',c:'#7b2cbf'},
{id:19,n:'电路草',st:'circuit',c:'#00ff9f'},
{id:20,n:'泡泡果',st:'bubble',c:'#80ffdb'},
{id:21,n:'火绒草',st:'flame',c:'#ff5400'},
{id:22,n:'冰晶叶',st:'ice',c:'#48cae4'},
{id:23,n:'时针花',st:'clock',c:'#c8b6a6'},
{id:24,n:'音符兰',st:'note',c:'#ffd6ff'},
{id:25,n:'心电图草',st:'ecg',c:'#00f5d4'},
{id:26,n:'字母·B枝',st:'letter',c:'#4ea8de'},
{id:27,n:'字母·C刺',st:'letter',c:'#f3722c'},
{id:28,n:'字母·T星',st:'letter',c:'#90be6d'},
{id:29,n:'字母·Z环',st:'letter',c:'#ffd166'},
{id:30,n:'像素樱桃',st:'pixel',c:'#e63946'},
{id:31,n:'像素铃兰',st:'pixel',c:'#f1faee'},
{id:32,n:'像素竹笋',st:'pixel',c:'#2a9d8f'},
{id:33,n:'像素西瓜芽',st:'pixel',c:'#e9c46a'},
{id:34,n:'像素枫',st:'pixel',c:'#bc6c25'},
{id:35,n:'几何·正六花',st:'geo',c:'#6d597a'},
{id:36,n:'几何·方晶',st:'geo',c:'#219ebc'},
{id:37,n:'几何·三角旗',st:'geo',c:'#fb8500'},
{id:38,n:'几何·环菱',st:'geo',c:'#8338ec'},
{id:39,n:'几何·双圆',st:'geo',c:'#06d6a0'},
{id:40,n:'烛光藤',st:'glow',c:'#ffb703'},
{id:41,n:'幽光菌',st:'glow',c:'#9d4edd'},
{id:42,n:'水墨梅',st:'ink',c:'#355070'},
{id:43,n:'焦墨兰',st:'ink',c:'#6c584c'},
{id:44,n:'蓝晶簇',st:'crystal',c:'#00b4d8'},
{id:45,n:'紫晶簇',st:'crystal',c:'#c77dff'},
{id:46,n:'雪晶花',st:'crystal',c:'#aedff7'},
{id:47,n:'星尘藤',st:'nebula',c:'#3a0ca3'},
{id:48,n:'极光草',st:'nebula',c:'#80ffdb'},
{id:49,n:'暗星花',st:'nebula',c:'#ff8fab'},
{id:50,n:'处理器花',st:'circuit',c:'#23c552'},
{id:51,n:'焊点草',st:'circuit',c:'#f9c74f'},
{id:52,n:'皂泡草',st:'bubble',c:'#7bdff2'},
{id:53,n:'气泡果',st:'bubble',c:'#ffb3c1'},
{id:54,n:'熔岩芯',st:'flame',c:'#ef476f'},
{id:55,n:'焰火簇',st:'flame',c:'#f77f00'},
{id:56,n:'霜花',st:'ice',c:'#00e5ff'},
{id:57,n:'雾凇枝',st:'ice',c:'#9cc3d5'},
{id:58,n:'秒针草',st:'clock',c:'#e0d6c8'},
{id:59,n:'高音符花',st:'note',c:'#ffc8dd'},
{id:60,n:'低音兰',st:'note',c:'#bde0fe'},
{id:61,n:'心电藤',st:'ecg',c:'#4ade80'},
{id:62,n:'脉冲草',st:'ecg',c:'#facc15'},
{id:63,n:'暗影绒',st:'ink',c:'#adb5bd'},
{id:64,n:'极昼花',st:'glow',c:'#ffffff'}
];
function gP(id){for(var i=0;i<G_PLANTS.length;i++)if(G_PLANTS[i].id===id)return G_PLANTS[i];return G_PLANTS[0]}
function gbName(){try{var s=JSON.parse(localStorage.getItem('gb_session')||'null');return (s&&s.username)||'游客'}catch(e){return'游客'}}
var G_RARE=[6,11,13,15,17,18,21,24];
var G_LEGEND=[22,23,25];
function gSeeds(){try{var a=JSON.parse(localStorage.getItem('wz_gseeds')||'null');if(Array.isArray(a))return a.slice();var r=[G_PLANTS[Math.floor(Math.random()*G_PLANTS.length)].id];try{localStorage.setItem('wz_gseeds',JSON.stringify(r))}catch(e){};var d=gDisc();if(d.indexOf(r[0])<0){d.push(r[0]);try{localStorage.setItem('wz_gdisc',JSON.stringify(d))}catch(e){}}return r}catch(e){return[]}}
function gSeedAdd(id){try{var a=gSeeds();a.push(id);localStorage.setItem('wz_gseeds',JSON.stringify(a));var d=gDisc();if(d.indexOf(id)<0){d.push(id);localStorage.setItem('wz_gdisc',JSON.stringify(d))}}catch(e){}}
function gDisc(){try{return JSON.parse(localStorage.getItem('wz_gdisc')||'[]')}catch(e){return[]}}
function gSeedTake(id){try{var a=gSeeds();var i=a.indexOf(id);if(i<0)return false;a.splice(i,1);localStorage.setItem('wz_gseeds',JSON.stringify(a));return true}catch(e){return false}}
function gDiscAdd(id){var d=gDisc();if(d.indexOf(id)<0){d.push(id);try{localStorage.setItem('wz_gdisc',JSON.stringify(d))}catch(e){}}}
function gEx(){try{return parseInt(localStorage.getItem('wz_gex')||'0',10)||0}catch(e){return 0}}
function gExAdd(n){try{localStorage.setItem('wz_gex',String(gEx()+n))}catch(e){}}
function gDraw(cv,id,g,t){
  var sp=gP(id),c=sp.c,s=cv.width,ctx=cv.getContext('2d');
  ctx.clearRect(0,0,s,s);
  ctx.save();ctx.translate(s/2,s-4);if(t)ctx.rotate(Math.sin(t*1.7)*.028);
  var h=(s*0.42)*Math.min(1,Math.max(.15,g||.5));
  ctx.strokeStyle=c;ctx.lineWidth=Math.max(1.5,s/40);
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-h);ctx.stroke();
  if(sp.st==='letter'){
    ctx.fillStyle=c;ctx.font='bold '+(s*0.34)+'px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(sp.id===1?'A':(sp.id===2?'W':(sp.id<=25?'梦':String.fromCharCode(65+(sp.id-3)%26))),0,-h-s*0.14);
  }else if(sp.st==='pixel'){
    var p=Math.max(2,s/14);function px(a,b){ctx.fillRect(a*p-p/2,b*p-p/2,p-1,p-1)}
    ctx.fillStyle=c;
    if(sp.id===4){for(var i=0;i<7;i++){px(i-3,-12);px(-3,-12-((i%2)?p:0))}ctx.fillStyle='#8b5a2b';px(0,-5)}
    else if(sp.id===5){for(var i=0;i<5;i++){px(i-2,-h-p*2-((i%2)?p:0))}ctx.fillStyle='#8b5a2b';px(0,-2)}
    else if(sp.id===6){ctx.fillStyle='#f1f1f1';px(-1,-4);px(0,-4);px(1,-4);ctx.fillStyle=c;px(-1,-6);px(0,-6);px(1,-6);ctx.fillStyle='#fff';px(0,-1)}
    else if(sp.id===7){ctx.fillStyle=c;px(-1,-8);px(1,-10);px(0,-12);ctx.fillStyle='#ffd166';px(0,-14)}
    else if(sp.id===8){ctx.fillStyle=c;px(0,-8);px(-1,-10);px(1,-10);px(0,-12);ctx.fillStyle='#4cc9f0';px(-2,-6)}
    else if(sp.id===9){ctx.fillStyle=c;px(-1,-8);px(1,-8);px(-1,-10);px(1,-10);px(0,-9)}
    else{ctx.fillStyle=c;var np=4+(sp.id%4);for(var bi=0;bi<np;bi++){px(Math.cos(bi*6.28/np)*2,-10+Math.sin(bi*6.28/np)*2-((sp.id%2)*2))}ctx.fillStyle='#8b5a2b';px(0,-6)}
  }else if(sp.st==='geo'){
    if(sp.id===10){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,-h-s*0.2);ctx.lineTo(-s*0.18,-h);ctx.lineTo(s*0.18,-h);ctx.closePath();ctx.fill()}
    else if(sp.id===11){ctx.strokeStyle=c;ctx.lineWidth=s/22;for(var i=0;i<2;i++){ctx.beginPath();ctx.arc(0,-h-s*0.14,i*s/14+s*0.05,0,6.283);ctx.stroke()}}
    else if(sp.id===12){ctx.save();ctx.translate(0,-h-s*0.16);ctx.rotate(.785);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,-s*0.16);ctx.lineTo(s*0.12,0);ctx.lineTo(0,s*0.16);ctx.lineTo(-s*0.12,0);ctx.closePath();ctx.fill();ctx.restore()}
    else if(sp.id===13){ctx.fillStyle=c;ctx.beginPath();for(var i=0;i<10;i++){var a=i*1.256,r=i%2?s*0.18:s*0.08,X=Math.cos(a)*r,Y=Math.sin(a)*r-h-s*0.16;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)}ctx.closePath();ctx.fill()}
    else if(sp.id===14){ctx.fillStyle=c;ctx.beginPath();ctx.arc(0,-h-s*0.14,s*0.16,0,6.283);ctx.fill();ctx.fillStyle='#3a0ca3';ctx.beginPath();ctx.arc(0,-h-s*0.14,s*0.05,0,6.283);ctx.fill()}
    else{ctx.fillStyle=c;var ng=3+(sp.id%4);ctx.beginPath();for(var gi=0;gi<ng;gi++){var ga=gi*6.283/ng-1.57,gx=Math.cos(ga)*s*0.16,gy=Math.sin(ga)*s*0.16-h-s*0.14;gi?ctx.lineTo(gx,gy):ctx.moveTo(gx,gy)}ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,-h-s*0.14,s*0.04,0,6.283);ctx.fill()}
  }else if(sp.st==='glow'){
    ctx.shadowColor=c;ctx.shadowBlur=s/5;ctx.fillStyle=c;ctx.beginPath();ctx.arc(0,-h-s*0.1,s*0.12,0,6.283);ctx.fill();
    ctx.shadowBlur=0;ctx.strokeStyle=c;ctx.lineWidth=s/30;for(var i=0;i<4;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-h*(.3+i*.23));ctx.stroke()}
  }else if(sp.st==='ink'){
    ctx.strokeStyle=c;ctx.lineWidth=s/30;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(s*0.1,-h*0.5,0,-h);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,-h);ctx.lineTo(-s*0.12,-h-s*0.2);ctx.moveTo(0,-h);ctx.lineTo(s*0.12,-h-s*0.16);ctx.stroke()
  }else if(sp.st==='crystal'){
    ctx.fillStyle=c;for(var i=0;i<3;i++){var bx=(i-1)*s*0.12,by=-h;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx-s*0.05,by-s*0.22-i*2);ctx.lineTo(bx,by-s*0.3-i*3);ctx.lineTo(bx+s*0.05,by-s*0.2-i*2);ctx.closePath();ctx.fill()}
  }else if(sp.st==='nebula'){
    ctx.strokeStyle=c;ctx.lineWidth=s/28;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(s*0.12,-h*0.6,-s*0.12,-h*0.8,s*0.02,-h);ctx.stroke();
    ctx.fillStyle=c;ctx.globalAlpha=.5;for(var i=0;i<6;i++){ctx.beginPath();ctx.arc((i-3)*s*0.07,-h*0.5-(i%2)*s*0.08,s*0.02,0,6.283);ctx.fill()}
    ctx.globalAlpha=1;
  }else if(sp.st==='circuit'){
    ctx.strokeStyle=c;ctx.lineWidth=s/30;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-h);ctx.stroke();
    for(var i=0;i<3;i++){var yy=-h*(i+1)/4;ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(s*0.1,yy);ctx.lineTo(s*0.1,yy-s*0.05);ctx.stroke();ctx.fillStyle=c;ctx.beginPath();ctx.arc(s*0.12,yy-s*0.05,s*0.02,0,6.283);ctx.fill()}
  }else if(sp.st==='bubble'){
    ctx.fillStyle=c;ctx.globalAlpha=.4;ctx.beginPath();ctx.arc(0,-h-s*0.14,s*0.15,0,6.283);ctx.fill();
    ctx.globalAlpha=1;ctx.strokeStyle=c;ctx.lineWidth=s/40;ctx.beginPath();ctx.arc(0,-h-s*0.14,s*0.15,0,6.283);ctx.stroke();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-s*0.05,-h-s*0.2,s*0.03,0,6.283);ctx.fill()
  }else if(sp.st==='flame'){
    ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,-h-s*0.3);ctx.quadraticCurveTo(s*0.18,-h-s*0.12,0,-h);ctx.quadraticCurveTo(-s*0.18,-h-s*0.12,0,-h-s*0.3);ctx.fill();
    ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(0,-h-s*0.16,s*0.04,0,6.283);ctx.fill()
  }else if(sp.st==='ice'){
    ctx.strokeStyle=c;ctx.lineWidth=s/26;ctx.beginPath();ctx.moveTo(0,-h);ctx.lineTo(-s*0.12,-h-s*0.12);ctx.moveTo(0,-h);ctx.lineTo(s*0.1,-h-s*0.16);ctx.moveTo(0,-h*0.7);ctx.lineTo(-s*0.06,-h*0.8);ctx.stroke();
    ctx.fillStyle=c;ctx.globalAlpha=.35;for(var i=0;i<3;i++){ctx.beginPath();ctx.arc((i-1)*s*0.1,-h-s*0.16,s*0.015,0,6.283);ctx.fill()}
    ctx.globalAlpha=1;
  }else if(sp.st==='clock'){
    ctx.strokeStyle=c;ctx.lineWidth=s/28;ctx.beginPath();ctx.arc(0,-h-s*0.12,s*0.13,0,6.283);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,-h-s*0.12);ctx.lineTo(0,-h-s*0.12-s*0.06);ctx.moveTo(0,-h-s*0.12);ctx.lineTo(s*0.04,-h-s*0.12);ctx.stroke()
  }else if(sp.st==='note'){
    ctx.fillStyle=c;ctx.beginPath();ctx.arc(-s*0.06,-h-s*0.2,s*0.03,0,6.283);ctx.fill();ctx.beginPath();ctx.arc(s*0.06,-h-s*0.08,s*0.03,0,6.283);ctx.fill();
    ctx.strokeStyle=c;ctx.lineWidth=s/30;ctx.beginPath();ctx.moveTo(-s*0.06,-h-s*0.2);ctx.lineTo(-s*0.06,-h-s*0.32);ctx.moveTo(s*0.06,-h-s*0.08);ctx.lineTo(s*0.06,-h-s*0.2);ctx.stroke()
  }else if(sp.st==='ecg'){
    ctx.strokeStyle=c;ctx.lineWidth=s/26;ctx.beginPath();ctx.moveTo(-s*0.14,-h*0.7);ctx.lineTo(-s*0.02,-h*0.7);ctx.lineTo(s*0.02,-h);ctx.lineTo(s*0.06,-h*0.5);ctx.lineTo(s*0.14,-h*0.5);ctx.stroke()
  }
  if(g<.3){ctx.globalAlpha=.55}
  if(g>=.6){ctx.strokeStyle=c;ctx.globalAlpha=.4;ctx.lineWidth=s/30;for(var fi=0;fi<6;fi++){var fa=fi*1.047;ctx.beginPath();ctx.arc(Math.cos(fa)*s*.16,-h-s*.16+Math.sin(fa)*s*.03,s*.02,0,6.283);ctx.stroke()}}
  if(g>.9){ctx.shadowColor=c;ctx.shadowBlur=s/4;ctx.fillStyle=c;ctx.beginPath();ctx.arc(0,-h-s*.16,s*.05,0,6.283);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=c;ctx.globalAlpha=.7;for(var si=0;si<3;si++){ctx.beginPath();ctx.arc(Math.cos(si*2.1)*s*.24,-h-s*.16+Math.sin(si*2.1)*s*.12,s*.015,0,6.283);ctx.fill()}}
  if(g>=.98){ctx.strokeStyle='#ffd60a';ctx.globalAlpha=.65;ctx.lineWidth=s/30;for(var ki=0;ki<5;ki++){var ka=ki*1.257;ctx.beginPath();ctx.arc(Math.cos(ka)*s*.22,-h-s*.16+Math.sin(ka)*s*.08,s*.014,0,6.283);ctx.stroke()}ctx.globalAlpha=1}
  ctx.globalAlpha=1;
  ctx.save();ctx.translate(s/2,s-2);
  ctx.fillStyle='rgba(18,28,22,.6)';ctx.beginPath();ctx.ellipse(0,2,s*.22,s*.07,0,0,6.283);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.04)';ctx.beginPath();ctx.ellipse(-s*.03,1,s*.16,s*.04,0,0,6.283);ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.09)';ctx.lineWidth=s/60;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-h);ctx.stroke();
  if(g>.6){ctx.fillStyle=c;ctx.globalAlpha=.35;ctx.beginPath();ctx.arc(0,-h-s*.16,s*.3,0,6.283);ctx.fill();ctx.globalAlpha=1}
  ctx.restore();
  ctx.restore();
}
function gSet(){try{var a=JSON.parse(localStorage.getItem('wz_garden')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function gAdd(p){try{var a=gSet();a.push(p);localStorage.setItem('wz_garden',JSON.stringify(a))}catch(e){}}
function openGarden(){
  var mask=document.createElement('div');
  mask.style.cssText='position:fixed;inset:0;z-index:2147483100;background:rgba(4,5,6,.86);display:flex;align-items:center;justify-content:center;padding:18px';
  var box=document.createElement('div');
  box.style.cssText='width:min(820px,96vw);max-height:90vh;overflow-y:auto;background:radial-gradient(120% 60% at 50% -10%,rgba(130,170,255,.14),transparent 60%),radial-gradient(1px 1px at 18% 22%,rgba(255,255,255,.8),transparent),radial-gradient(1px 1px at 62% 12%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 84% 30%,rgba(255,255,255,.6),transparent),radial-gradient(1px 1px at 38% 40%,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 72% 52%,rgba(255,255,255,.45),transparent),radial-gradient(1px 1px at 8% 60%,rgba(255,255,255,.4),transparent),linear-gradient(180deg,#080c18 0%,#0f1524 38%,#0d1a13 74%,#14251a 100%);border:1px solid var(--cbd,#3a3a3a);padding:20px 22px;box-sizing:border-box;font-family:Consolas,monospace;border-radius:14px';
  var h='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px"><span style="font-size:13px;letter-spacing:.3em;color:var(--accent,#fff)">❀ COLLABORATIVE GARDEN</span><span style="color:#6e8a86;font-size:11px;letter-spacing:.2em">● NIGHT GARDEN ●</span></div>'+
    '<div style="font-size:11px;color:#8a8a8a;margin-bottom:12px">协作种植花园 · 64 种植物 · 多画风 · 星夜之下，万物生长</div>'+
    '<div style="margin-bottom:12px"><button id="gTutBtn" onclick="gTut()" style="border:1px solid #4a5560;background:none;color:#9aa6ad;font-family:Consolas,monospace;font-size:10.5px;letter-spacing:.1em;padding:5px 14px;cursor:pointer;transition:.18s" onmouseenter="this.style.borderColor=\'var(--accent,#fff)\'" onmouseleave="this.style.borderColor=\'#4a5560\'">🌱 玩法教程</button></div>'+
    '<div id="gTut" style="display:none;border:1px dashed #3a3a3a;border-radius:10px;padding:12px;margin-bottom:12px;background:rgba(255,255,255,.02);color:#b8c0c4;font-size:11px;line-height:1.9"></div>'+
    '<div style="height:2px;background:linear-gradient(90deg,transparent,var(--accent,#fff),transparent);opacity:.5;margin-bottom:14px"></div>'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">'+
      '<div style="flex:1;min-width:200px"><div id="gProgLabel" style="font-size:11px;letter-spacing:.15em;color:#6e8a86;margin-bottom:6px">图鉴探索 · DISCOVERED '+gDisc().length+' / 64</div>'+
      '<div style="height:6px;background:#1c1f26;border-radius:3px;overflow:hidden"><div id="gProg" style="height:100%;width:'+Math.round(gDisc().length/64*100)+'%;background:var(--accent,#fff);border-radius:3px;transition:width .4s"></div></div></div>'+
      '<div style="text-align:right;padding-right:4px"><div style="font-size:11px;color:#8a8a8a">探索点</div><div id="gExBox" style="font-size:16px;color:var(--accent,#fff);font-weight:bold">'+gEx()+'</div></div>'+
    '</div>'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span id="gStar" style="font-size:11px;letter-spacing:.15em;color:#6e8a86">星雨之夜 · 全站照料 0 / 50</span><span style="font-size:10px;color:#5b5b5b">集体目标</span></div>'+
    '<div style="height:6px;background:#1c1f26;border-radius:3px;overflow:hidden;margin-bottom:4px"><div id="gStarBar" style="height:100%;width:0%;background:linear-gradient(90deg,#8a5ae0,#ffd60a);border-radius:3px;transition:width .6s"></div></div>'+
    '<div id="gStarMsg"></div>'+
    '<div style="border-top:1px solid #222;margin:12px 0"></div>'+
    '<div id="gWhisper" style="border:1px dashed #3a3a3a;border-radius:8px;padding:8px 10px;margin-bottom:10px;color:#8a8a8a;font-size:11px;line-height:1.6;background:rgba(255,255,255,.02)"></div>'+
    '<div style="font-size:11px;letter-spacing:.2em;color:#6e8a86;margin-bottom:8px">◆ 种子库 · SEEDS · 拾取后点花园落种 · 稀有种藏在深处 ◆</div>'+
    '<div id="gPlantTip" style="display:none;border:1px dashed #5a5a5a;border-radius:8px;padding:7px 10px;margin-bottom:8px;color:#ffd60a;font-size:10.5px;letter-spacing:.05em;background:rgba(255,214,10,.05)">⚒ 已拾取种子 —— 点击下方【花园实景】任意位置落种 · 再点该种子或按 Esc 取消</div>'+
    '<div id="gSeedArea"></div>'+
    '<div style="text-align:center;margin-bottom:14px"><button id="gPlantBtn" onclick="gPlant()" style="border:1px solid var(--accent,#fff);background:none;color:var(--accent,#fff);padding:8px 22px;font-family:Consolas,monospace;font-size:11.5px;letter-spacing:.15em;cursor:pointer">拾取一颗种子 · 点击花园落种</button></div>'+
    '<div style="border-top:1px solid #222;margin-bottom:12px"></div>'+
    '<div style="font-size:11px;letter-spacing:.2em;color:#6e8a86;margin-bottom:8px">花园实景 · GARDEN VIEW · 点击一朵花</div>'+
    '<div style="position:relative;border:1px solid #2c2c2c;border-radius:12px;overflow:hidden;margin-bottom:12px"><canvas id="gSceneCv" width="760" height="200" style="width:100%;display:block"></canvas></div>'+
    '<div style="font-size:11px;letter-spacing:.2em;color:#6e8a86;margin-bottom:8px">我的花园 · MY GARDEN</div>'+
    '<div id="myGarden" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px;margin-bottom:16px"></div>'+
    '<div style="border-top:1px solid #222;margin-bottom:12px"></div>'+
    '<div style="font-size:11px;letter-spacing:.2em;color:#6e8a86;margin-bottom:8px">共享花园 · SHARED · 可照料</div>'+
    '<div id="shGarden" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px"></div>'+
    '<div style="border-top:1px solid #222;margin:14px 0 12px"></div>'+
    '<div style="background:radial-gradient(1px 1px at 20% 20%,rgba(255,255,255,.6),transparent),radial-gradient(1px 1px at 75% 30%,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 40% 65%,rgba(255,255,255,.4),transparent),radial-gradient(circle at 50% 0%,#0d1520,#06070a);border:1px solid #2c2c2c;border-radius:12px;padding:14px;text-align:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)">'+
      '<div style="font-size:12px;letter-spacing:.3em;color:#8a8a8a;margin-bottom:4px">夜行深处 · DEEP NIGHT</div>'+
      '<div style="font-size:10.5px;color:#5b5b5b;line-height:1.7;margin-bottom:10px">一片未名之地。消耗 <b style="color:var(--accent,#fff)">1 探索点</b> 点亮一次，可能带回传说的种子，或一无所获。</div>'+
      '<div id="gExploreBox" style="min-height:18px;margin-bottom:10px;color:#cfd8da;font-size:12px;line-height:1.9"></div>'+
      '<div style="font-size:10px;color:#5b5b5b;line-height:1.6;margin-bottom:6px">沿节点树深入夜行。小节点耗 <b style="color:var(--accent,#fff)">1 探索点</b>，大节点耗 <b style="color:#ffd60a">2 点</b>，尽头的节点会带来传说。</div>'+
      '<div id="gTreeBox"></div>'+
    '</div>';
  box.innerHTML=h+'<div style="text-align:right;margin-top:14px"><button id="gClose" style="border:1px solid var(--cbd,#3a3a3a);background:none;color:#b8b8b8;padding:6px 18px;font-family:Consolas,monospace;font-size:11.5px;cursor:pointer">关闭</button></div>';
  mask.appendChild(box);document.body.appendChild(mask);
  gSeedRefresh();
  gWhisper();
  renderMy();gProgRefresh();gSceneLoop();gTreeRender();
  function hGKey(e){if((e.key==='Escape'||e.key==='Esc')&&G_SEL){gPickOff()}}
  document.addEventListener('keydown',hGKey);
  var hClose=function(){if(mask.parentNode){mask.parentNode.removeChild(mask);gAniStop()}document.removeEventListener('keydown',hGKey)};
  mask.onclick=function(e){if(e.target===mask){hClose()}};
  var c=document.getElementById('gClose');if(c)c.onclick=hClose;
  var sc=document.getElementById('gSceneCv');if(sc)sc.onclick=gSceneClick;
  gLoadShared();
}
function gSeedCard(sp,un,count){
  var d=document.createElement('div');
  if(un){
    var isLeg=G_LEGEND.indexOf(sp.id)>=0,isRar=G_RARE.indexOf(sp.id)>=0;
    d.style.cssText='border:1px solid '+(isLeg?'#c8a84a':(isRar?'#8a5ae0':'#2e3a32'))+';border-radius:12px;padding:6px;cursor:pointer;text-align:center;box-sizing:border-box;transition:.18s;box-shadow:inset 0 1px 0 rgba(255,255,255,.05)'+(isLeg?';box-shadow:0 0 12px rgba(200,168,74,.25)':'');d.onmouseenter=function(){d.style.borderColor='var(--accent,#fff)';d.style.transform='translateY(-3px)';d.style.boxShadow='0 6px 18px rgba(120,160,255,.22)'};d.onmouseleave=function(){if(d!==(G_SEL&&G_SEL._el)){d.style.borderColor=isLeg?'#c8a84a':(isRar?'#8a5ae0':'#2c2c2c');d.style.transform='none';d.style.boxShadow='none'}};
    d.innerHTML='<canvas width="54" height="54"></canvas><div style="color:'+(isLeg?'#c8a84a':(isRar?'#9a7ae0':'#9aa6ad'))+';font-size:9px;margin-top:4px;line-height:1.4">'+sp.n+(isLeg?' ★':(isRar?' ✦':''))+(count>1?' <span style="color:#ffd60a">×'+count+'</span>':'')+'</div>';
    d.onclick=function(){gPick(d,sp.id)};
  }else{
    var tier=G_LEGEND.indexOf(sp.id)>=0?'传说':(G_RARE.indexOf(sp.id)>=0?'稀有':'常见');
    d.style.cssText='border:1px dashed #3a3a3a;border-radius:10px;padding:6px;cursor:pointer;text-align:center;box-sizing:border-box;background:rgba(255,255,255,.02);opacity:.6;transition:.18s';
    d.innerHTML='<div style="height:54px;display:flex;align-items:center;justify-content:center;color:#4a4a4a;font-size:20px">?</div><div style="color:#5b5b5b;font-size:9px;margin-top:4px;line-height:1.4">？？？<br><span style="color:#6e5a2a">'+tier+'</span></div>';
    d.onclick=function(){toast('未解锁 · '+tier,'种植或照料植物，或踏入夜行深处，可发现它')};
  }
  var cv=d.querySelector('canvas');if(cv)setTimeout(function(){gDraw(cv,sp.id,.9)},10);
  return d;
}
function gSeedGroup(area,title,list){
  var hd=document.createElement('div');hd.style.cssText='display:flex;justify-content:space-between;align-items:center;margin:12px 0 6px';
  var inv=gSeeds(),cnt={};for(var i=0;i<inv.length;i++)cnt[inv[i]]=(cnt[inv[i]]||0)+1;
  var got=0;for(var i=0;i<list.length;i++)if(cnt[list[i].id])got++;
  hd.innerHTML='<span style="font-size:11px;letter-spacing:.2em;color:#6e8a86">'+title+'</span><span style="font-size:10px;color:#5b5b5b">'+got+' / '+list.length+'</span>';
  area.appendChild(hd);
  var grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:8px';
  area.appendChild(grid);
  for(var i=0;i<list.length;i++)grid.appendChild(gSeedCard(list[i],!!cnt[list[i].id],cnt[list[i].id]||0));
}
function gSeedRefresh(){
  var area=document.getElementById('gSeedArea');if(!area)return;
  area.innerHTML='';
  var common=[],rare=[],legend=[];
  for(var i=0;i<G_PLANTS.length;i++){var id=G_PLANTS[i].id;if(G_LEGEND.indexOf(id)>=0)legend.push(G_PLANTS[i]);else if(G_RARE.indexOf(id)>=0)rare.push(G_PLANTS[i]);else common.push(G_PLANTS[i])}
  gSeedGroup(area,'常见 SEEDS',common);
  gSeedGroup(area,'稀有 RARE',rare);
  gSeedGroup(area,'传说 LEGEND',legend);
}
function gWhisper(){
  var w=document.getElementById('gWhisper');if(!w)return;
  var day=new Date();var h=(day.getDate()*7+day.getMonth()*13+day.getFullYear()*3)%8;
  var ws=['深处的星尘最偏爱照料得最多的花','电路草的心跳，要从种植开始倾听','时针花只在凝视花园很久后才出现','被照料的花会向你吐露邻近的种子','火绨草藏在最深的黑夜，必须主动探索','冰晶叶在凝结的星尘中等待','每一粒种下的种子，都是一次探索','夜行者深处，有你未见过的生命'];
  w.textContent='★ 夜行者低语：'+ws[h];
}
function gFx(x,y,c){for(var i=0;i<10;i++){(function(i){var d=document.createElement('div');var a=Math.random()*6.283,sp=20+Math.random()*50;d.style.cssText='position:fixed;left:'+x+'px;top:'+y+'px;width:'+(2+Math.random()*3)+'px;height:'+(2+Math.random()*3)+'px;background:'+c+';border-radius:50%;pointer-events:none;z-index:2147483500;transition:transform .6s,opacity .6s';document.body.appendChild(d);requestAnimationFrame(function(){d.style.transform='translate('+Math.cos(a)*sp+'px,'+(Math.sin(a)*sp-30)+'px)';d.style.opacity='0'});setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d)},650)})(i)}if(document.readyState==='loading')return}
var G_SEL=null;var G_CURSOR=null;
function gPick(el,id){
  if(G_SEL===id){gPickOff();return}
  if(G_SEL&&G_SEL._el){G_SEL._el.style.borderColor='#2c2c2c';G_SEL._el.style.background='transparent';G_SEL._el.style.boxShadow='none'}
  G_SEL=id;el.style.borderColor='#ffd60a';el.style.background='rgba(255,214,10,.08)';el.style.boxShadow='0 0 14px rgba(255,214,10,.55)';el._el=el;
  gCursorOn(id);
  var pb=document.getElementById('gPlantBtn');if(pb){pb.textContent='已拾取 '+gP(id).n+' · 点击花园落种';pb.style.borderColor='#ffd60a';pb.style.color='#ffd60a'}
  var tip=document.getElementById('gPlantTip');if(tip)tip.style.display='block';
}
function gPickOff(){
  if(G_SEL&&G_SEL._el){G_SEL._el.style.borderColor='#2c2c2c';G_SEL._el.style.background='transparent';G_SEL._el.style.boxShadow='none'}
  G_SEL=null;gCursorOff();
  var pb=document.getElementById('gPlantBtn');if(pb){pb.textContent='拾取一颗种子 · 点击花园落种';pb.style.borderColor='var(--accent,#fff)';pb.style.color='var(--accent,#fff)'}
  var tip=document.getElementById('gPlantTip');if(tip)tip.style.display='none';
}
function gCursorOn(id){
  if(G_CURSOR)return;
  var d=document.createElement('canvas');d.id='gCursor';d.width=28;d.height=28;d.style.cssText='position:fixed;left:-99px;top:-99px;pointer-events:none;z-index:2147483600;filter:drop-shadow(0 0 6px rgba(255,214,10,.6))';
  document.body.appendChild(d);try{gDraw(d,id,.8)}catch(e){}
  G_CURSOR=d;document.addEventListener('mousemove',gCursorMove);document.body.style.cursor='crosshair';
}
function gCursorMove(ev){if(G_CURSOR){G_CURSOR.style.left=(ev.clientX+12)+'px';G_CURSOR.style.top=(ev.clientY+12)+'px'}}
function gCursorOff(){if(G_CURSOR&&G_CURSOR.parentNode)G_CURSOR.parentNode.removeChild(G_CURSOR);G_CURSOR=null;document.removeEventListener('mousemove',gCursorMove);document.body.style.cursor=''}
var gAniCv=[];var gAniOn=false;
function gAniAdd(cv,id,g){gAniCv.push({cv:cv,id:id,g:g,t:Math.random()*6});if(!gAniOn){gAniOn=true;(function loop(){var k=0;for(var i=0;i<gAniCv.length;i++){var o=gAniCv[i];if(o.cv&&o.cv.isConnected){o.t+=.03;try{gDraw(o.cv,o.id,o.g,o.t)}catch(e){}gAniCv[k++]=o}}gAniCv.length=k;if(gAniCv.length)requestAnimationFrame(loop);else gAniOn=false})()}}
var gSceneRaf=0;
function gAniStop(){gAniCv.length=0;gAniOn=false;if(gSceneRaf){cancelAnimationFrame(gSceneRaf);gSceneRaf=0}}
function gSceneLoop(){gScene();gSceneRaf=requestAnimationFrame(gSceneLoop)}
function gScene(){
  var cv=document.getElementById('gSceneCv');if(!cv)return;
  var a=gSet(),ctx=cv.getContext('2d'),w=cv.width,h=cv.height,t=Date.now()/1000;
  ctx.clearRect(0,0,w,h);
  var grd=ctx.createLinearGradient(0,0,0,h);grd.addColorStop(0,'#0a0e1a');grd.addColorStop(.62,'#13211d');grd.addColorStop(1,'#1b3021');ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
  for(var i=0;i<42;i++){var sx=((i*137)%w),sy=((i*73)%(h*.5));ctx.fillStyle='rgba(255,255,255,'+((i%10)/15+.05)+')';ctx.fillRect(sx,sy,1.3,1.3)}
  ctx.fillStyle='rgba(255,255,255,.05)';ctx.beginPath();ctx.arc(w*.82,h*.16,20,0,6.283);ctx.fill();
  ctx.fillStyle='#12271c';for(var i=0;i<12;i++){var gh=(i%3)*3;ctx.fillRect(i*(w/12),h*.74-gh,w/12,gh+4)}
  if(!a.length){ctx.fillStyle='#5b6a60';ctx.font='12px Consolas,monospace';ctx.textAlign='center';ctx.fillText('还没有花 · 从上方种子库种下第一棵',w/2,h*.84);return}
  var n=a.length,cols=Math.max(1,Math.ceil(Math.sqrt(n))),cw=w/(cols+1),pos=[];
  for(var i=0;i<n;i++){
    var p=a[i];
    var x,y;
    if(typeof p.x==='number'&&typeof p.y==='number'){x=p.x*w;y=p.y*h}else{var col=i%cols,row=Math.floor(i/cols);x=cw*(col+1)+Math.sin(i*7.3)*6;y=h*.76+row*22}
    var sway=Math.sin(t*.9+(x*.012));
    gDrawSceneFlower(ctx,p,x,y,sway,t);
    pos.push({id:p.sp,x:x,y:y});
  }
  cv.__pos=pos;
}
function gDrawSceneFlower(ctx,p,x,y,sway,t){
  var g=p.g||.5,sp=gP(p.sp),c=sp.c;
  var bh=Math.max(9,30*g);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+2,11,4,0,0,6.283);ctx.fill();
  ctx.strokeStyle=c;ctx.globalAlpha=.9;ctx.lineWidth=2.4;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+sway*3,y-bh*.4,x+sway*4,y-bh);ctx.stroke();
  if(g>.3){ctx.strokeStyle=c;ctx.globalAlpha=.7;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x+sway*2,y-bh*.55);ctx.quadraticCurveTo(x+sway*6,y-bh*.62,x+sway*5.5,y-bh*.48);ctx.stroke()}
  var hx=x+sway*4,hy=y-bh;
  if(g>.55){var fr=Math.min(10,3+9*g);ctx.fillStyle=c;ctx.globalAlpha=.85;for(var k=0;k<5;k++){var a0=k*1.2566+sway*.25;ctx.beginPath();ctx.ellipse(hx+Math.cos(a0)*fr*.7,hy+Math.sin(a0)*fr*.7,fr*.42,fr*.42,0,0,6.283);ctx.fill()}ctx.fillStyle='#ffe9a8';ctx.beginPath();ctx.arc(hx,hy,fr*.3,0,6.283);ctx.fill()}
  if(g>=.98){ctx.strokeStyle='#ffd60a';ctx.globalAlpha=.7;ctx.lineWidth=1.4;for(var k=0;k<4;k++){var a0=k*1.57+t*.4;ctx.beginPath();ctx.arc(hx+Math.cos(a0)*(fr+.6),hy+Math.sin(a0)*(fr+.6),1.7,0,6.283);ctx.stroke()}}
  ctx.globalAlpha=1;
}
function gSceneClick(ev){
  var cv=document.getElementById('gSceneCv');if(!cv)return;
  var r=cv.getBoundingClientRect();var mx=(ev.clientX-r.left)/r.width*cv.width,my=(ev.clientY-r.top)/r.height*cv.height;
  if(G_SEL){gPlantAt(mx/cv.width,my/cv.height);return}
  if(!cv.__pos)return;
  var best=null,bd=1e9;
  for(var i=0;i<cv.__pos.length;i++){var d=Math.hypot(mx-cv.__pos[i].x,my-cv.__pos[i].y);if(d<bd){bd=d;best=cv.__pos[i]}}
  if(best&&bd<36){var a=gSet();for(var j=0;j<a.length;j++)if(a[j].sp===best.id){var p=a[j],sp=gP(p.sp),stg=(p.g||.5)>.9?'光':((p.g||.5)>.6?'花':((p.g||.5)>.3?'株':'苗'));toast(sp.n+' · ['+stg+']','生长 '+Math.round((p.g||.5)*100)+'% · 照料 '+(p.c||0)+' · 画风 '+sp.st);break}}
}
var gTutSteps=[
  ['拾种落种','初始你只有 1 颗随机种子。在种子库点选它（光标会携带种子），再点击下方【花园实景】任意位置把它种下——种下会消耗这颗种子，落点会生长为花。再点该种子或按 Esc 取消','1'],
  ['照料成长','在共享花园里点“照料”，生长 +12%（每 3 秒一次）；照料也 +1 探索点','2'],
  ['收集种子','种下 / 照料时偶尔会发现新种子；集齐 64 种解锁“守园人 ⚜”','3'],
  ['夜行深处','花 1 探索点踏入“夜行深处”，可能带回传说种子或星尘——也可能一无所获','4'],
  ['相伴加成','同一画风植物≥2株时显示金色“相伴✦”，更显生机','5'],
  ['盛开','照料 / 离线生长把植物养到生长度 1，出现金色星环“✦ 盛开”','6'],
  ['离线生长','离开花园后植物仍按真实时间慢慢生长，回来会有惊喜','7'],
  ['星雨之夜','全站累计照料 50 次触发“星雨之夜”：全体探索点 +2 并解锁一枚传说种子','8'],
  ['花园之星','共享花园中照料最多的一株会金边高亮，接受全站目光','9'],
];
function gTut(){
  var t=document.getElementById('gTut');if(!t)return;
  var show=t.style.display==='none';t.style.display=show?'block':'none';if(!show)return;
  var html='<div style="font-size:11.5px;color:#cfd8da;letter-spacing:.1em;margin-bottom:10px">🌱 协作花园 · 玩法指南</div>';
  for(var i=0;i<gTutSteps.length;i++){var s=gTutSteps[i];html+='<div style="margin-bottom:9px"><div style="color:#ffd60a;font-size:10px;letter-spacing:.05em">STEP '+s[2]+'</div><div style="color:#e6edef;font-size:11px;margin:2px 0 1px">'+s[0]+'</div><div style="color:#8a8a8a;font-size:10.5px;line-height:1.6">'+s[1]+'</div></div>'}
  t.innerHTML=html;
}
function gPlantCard(p,cnt){
  var sp=gP(p.sp),d=document.createElement('div');
  d.style.cssText='border:1px solid #2e3a32;border-radius:12px;padding:6px;text-align:center;box-sizing:border-box;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.008));box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 2px 8px rgba(0,0,0,.25);transform:scale(.92);opacity:0;transition:transform .25s,opacity .25s';setTimeout(function(){d.style.transform='scale(1)';d.style.opacity='1'},10);
  var cv=document.createElement('canvas');cv.width=84;cv.height=84;
  var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(rm){setTimeout(function(){gDraw(cv,sp.id,p.g||.5)},10)}else{gAniAdd(cv,sp.id,p.g||.5)}
  d.appendChild(cv);
  var stg=(p.g||.5)>.9?'光':((p.g||.5)>.6?'花':((p.g||.5)>.3?'株':'苗'));
  var star=G_LEGEND.indexOf(sp.id)>=0?' ★':(G_RARE.indexOf(sp.id)>=0?' ✦':'');
  var nm=document.createElement('div');nm.style.cssText='color:#e6edef;font-size:10.5px;line-height:1.4';nm.innerHTML=sp.n+' <span style="color:#6e8a86;font-size:9px">['+stg+']</span>'+(star?star:'')+(cnt&&cnt[sp.st]>=2?' <span style="color:#ffd60a">相伴✦</span>':'');d.appendChild(nm);
  var st=document.createElement('div');st.style.cssText='color:#6a767d;font-size:9px;margin-top:3px';
  var age='';if(p.t){var days=Math.floor((new Date().getTime()-p.t)/86400000);age=days<=0?'今日种下':days+' 天'}st.textContent=((p.u&&p.u!==gbName())?p.u+' · ':'')+(age?age+' · ':'')+((p.g||.5)>=1?'✦ 盛开 · 照料 '+(p.c||0):Math.round((p.g||.5)*100)+'% · 照料 '+(p.c||0));d.appendChild(st);
  return d;
}
function renderMy(){
  var box=document.getElementById('myGarden');if(!box)return;
  var a=gSet(),now=Date.now(),ch=false;
  for(var i=0;i<a.length;i++){var dt=(now-(a[i].t||now))/86400000;if(dt>1){var ng=Math.min(1,(a[i].g||.5)+dt*0.02);if(ng!==(a[i].g||.5)){a[i].g=ng;ch=true}}}
  if(ch){try{localStorage.setItem('wz_garden',JSON.stringify(a))}catch(e){}}
  var cnt={};for(var i=0;i<a.length;i++){var st=gP(a[i].sp).st;cnt[st]=(cnt[st]||0)+1}
  box.innerHTML='';
  if(!a.length){box.innerHTML='<div style="color:#5b5b5b;font-size:11.5px;padding:10px 0">花园还空。从上方种子库选一种种下。</div>';return}
  var totC=0,comp=0;for(var i=0;i<a.length;i++){totC+=(a[i].c||0);if((a[i].g||.5)>=1)comp++}
  var comps=0;for(var k in cnt)if(cnt[k]>=2)comps++;
  var head=document.createElement('div');head.style.cssText='grid-column:1/-1;font-size:9.5px;color:#6e8a86;letter-spacing:.18em;margin-bottom:2px;text-align:left';head.textContent='共 '+a.length+' 株 · 照料 '+totC+' 次 · 盛开 '+comp+' · 相伴 '+comps+' · 你的花园';
  box.appendChild(head);
  for(var i=a.length-1;i>=0;i--){var d=gPlantCard(a[i],cnt);box.appendChild(d)}
}
function gPlant(){if(!G_SEL){toast('先拾取一颗种子','在种子库点一种植物');return}gPlantAt(.5,.7)}
function gPlantAt(nx,ny){
  if(!G_SEL){toast('先拾取一颗种子','在种子库点一种植物');return}
  var sid=G_SEL;
  if(!gSeedTake(sid)){toast('这颗种子已经用完了','去探索或照料，获得新种子');G_SEL=null;gPickOff();gSeedRefresh();return}
  gDiscAdd(sid);
  var p={sp:sid,t:new Date().getTime(),g:.5,c:0,u:gbName(),x:Math.max(.08,Math.min(.92,nx)),y:Math.max(.2,Math.min(.86,ny))};
  var b=apiBase();
  if(b){try{fetch(b+'/garden_plant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)}).catch(function(){})}catch(e){}}
  gAdd(p);gPickOff();gSeedRefresh();
  var cv=document.getElementById('gSceneCv');if(cv)gPlantFx(cv.width*p.x,cv.height*p.y,sid);
  renderMy();gLoadShared();
  gExAdd(1);var pbox=document.getElementById('gExBox');if(pbox)pbox.textContent=gEx();
  (function(){var rars=[];for(var i=0;i<G_RARE.length;i++){if(gDisc().indexOf(G_RARE[i])<0)rars.push(G_RARE[i])}if(rars.length&&Math.random()<.12){var got=rars[Math.floor(Math.random()*rars.length)];gSeedAdd(got);gProgRefresh();gSeedRefresh();toast('你的花园里长出一粒新种子','解锁 '+gP(got).n)}})();
  gScene();
  toast('已种下 '+gP(sid).n,'它会慢慢生长，别人也能为它照料');
}
function gPlantFx(px,py,sid){
  var cv=document.getElementById('gSceneCv');if(!cv)return;
  var wrap=cv.parentNode;
  var seed=document.createElement('div');seed.style.cssText='position:absolute;left:'+(px-4)+'px;top:'+(py-20)+'px;width:9px;height:9px;background:radial-gradient(circle at 35% 30%,#dccfad,#5a4630);border-radius:50%;pointer-events:none;z-index:2;transition:transform .26s cubic-bezier(.5,0,.7,1)';
  wrap.appendChild(seed);requestAnimationFrame(function(){seed.style.transform='translateY(20px)'});
  setTimeout(function(){if(seed.parentNode)seed.parentNode.removeChild(seed);gFx(px,py,'#8a7a5a');gFx(px,py-2,'#6f6246')},260);
  var sprout=document.createElement('canvas');sprout.width=40;sprout.height=40;
  sprout.style.cssText='position:absolute;left:'+(px-20)+'px;top:'+(py-34)+'px;pointer-events:none;z-index:2;transform:scale(.12);opacity:0;transition:transform .7s cubic-bezier(.2,1.5,.3,1),opacity .4s';
  wrap.appendChild(sprout);
  setTimeout(function(){try{gDraw(sprout,sid,.6)}catch(e){};sprout.style.transform='scale(1)';sprout.style.opacity='1'},260);
  setTimeout(function(){sprout.style.transition='transform .5s,opacity .5s';sprout.style.transform='scale(.01)';sprout.style.opacity='0';setTimeout(function(){if(sprout.parentNode)sprout.parentNode.removeChild(sprout)},540)},1350);
}
var G_CARE={};
function gCare(id){
  var lc=0;try{lc=parseInt(localStorage.getItem('wz_care_'+id)||'0',10)||0}catch(e){}
  if(Date.now()-lc<30000){toast('照料冷却中','约 '+Math.max(1,Math.ceil((30000-(Date.now()-lc))/1000))+' 秒后再照料');return}
  try{localStorage.setItem('wz_care_'+id,String(Date.now()))}catch(e){}
  G_CARE[id]=Date.now();
  var b=apiBase();if(!b)return;
  fetch(b+'/garden_care',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})}).then(function(r){return r.json()}).then(function(j){
    if(j&&j.ok){var d=document.querySelector('#shGarden>div');if(d){var r=d.getBoundingClientRect();d.style.boxShadow='0 0 18px rgba(255,214,10,.5)';gFx(r.left+r.width/2,r.top+r.height/2,'#ffd60a')}gLoadShared();toast('照料成功','生长 +12%');gExAdd(1);var pb=document.getElementById('gExBox');if(pb)pb.textContent=gEx();var _fd=window.fMaybeDrop&&fMaybeDrop();if(_fd){toast('照料时翻出一件武器胚子：'+_fd.n,'已入武器仓库')}(function(){var rars=[];for(var i=0;i<G_RARE.length;i++){if(gDisc().indexOf(G_RARE[i])<0)rars.push(G_RARE[i])}if(rars.length&&Math.random()<.08){var got=rars[Math.floor(Math.random()*rars.length)];gSeedAdd(got);gProgRefresh();gSeedRefresh();toast('照料时发现了新种子','解锁 '+gP(got).n)}})();gScene()}else{toast('照料未生效',(j&&j.msg)||'试试刷新')}
  }).catch(function(){toast('照料失败','云端不可用')});
}
function gLoadShared(){
  var b=apiBase();var box=document.getElementById('shGarden');if(!box)return;
  if(!b){box.innerHTML='<div style="color:#5b5b5b;font-size:11.5px;padding:10px 0">当前未连接云端，仅本地花园可用。</div>';return}
  fetch(b+'/garden_get').then(function(r){return r.json()}).then(function(j){
    var list=(j&&j.plants)||[];list.sort(function(a,b){return (b.c||0)-(a.c||0)||((b.t||0)-(a.t||0))});box.innerHTML='';
    gStarRefresh((j&&j.care_total)||0);
    if(!list.length){box.innerHTML='<div style="color:#5b5b5b;font-size:11.5px;padding:10px 0">还没人种下。来种第一棵。</div>';return}
    var star=list.reduce(function(m,x){return (x.c||0)>(m.c||0)?x:m});
    for(var i=0;i<list.length;i++){
      (function(p){var d=gPlantCard(p);
        if(star.id===p.id){d.style.borderColor='#ffd60a';d.style.boxShadow='0 0 14px rgba(255,214,10,.4)'}
        if(p.msgs&&p.msgs.length){var mc=document.createElement('div');mc.style.cssText='color:#9aa6ad;font-size:8.5px;margin-top:3px;line-height:1.5;text-align:left';for(var mi=0;mi<p.msgs.length&&mi<2;mi++)mc.innerHTML+='<div>☁ '+p.msgs[mi].u+': '+p.msgs[mi].tx+'</div>';d.appendChild(mc)}
        var bt=document.createElement('div');bt.style.cssText='margin-top:5px;display:flex;gap:4px;justify-content:center';
        var _full=(p.g||0)>=.98;
        bt.innerHTML=(_full?'<span style="color:#ffd60a;font-size:9px">✦ 已盛开 · 无需照料</span>':'<button onclick="gCare('+p.id+')" style="border:1px solid var(--accent,#fff);background:none;color:var(--accent,#fff);font-family:Consolas,monospace;font-size:9px;padding:3px 7px;cursor:pointer;transition:.15s" onmouseenter="this.style.background=\'rgba(255,255,255,.08)\'" onmouseleave="this.style.background=\'none\'">照料</button>')+'<button onclick="gNote('+p.id+')" style="border:1px solid #4a5560;background:none;color:#9aa6ad;font-family:Consolas,monospace;font-size:9px;padding:3px 7px;cursor:pointer;transition:.15s" onmouseenter="this.style.background=\'rgba(255,255,255,.06)\'" onmouseleave="this.style.background=\'none\'">低语</button>';
        d.appendChild(bt);box.appendChild(d);
      })(list[i]);
    }
  }).catch(function(){box.innerHTML='<div style="color:#5b5b5b;font-size:11.5px;padding:10px 0">花园加载失败。</div>'});
}
function gNote(id){
  var tx=prompt('给这棵植物留下一句低语：');if(!tx||!tx.trim())return;
  var b=apiBase();if(!b)return;
  fetch(b+'/garden_note',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,u:gbName(),tx:tx})}).then(function(r){return r.json()}).then(function(j){if(j&&j.ok){gLoadShared();toast('低语留在了叶片上','别人看得见')}else{toast('留言失败','试试刷新')}}).catch(function(){toast('留言失败','云端不可用')});
}
var G_STAR_GOAL=50;
function gStarRefresh(care){
  var bar=document.getElementById('gStarBar');if(!bar)return;
  bar.style.width=Math.min(care,G_STAR_GOAL)/G_STAR_GOAL*100+'%';
  var lbl=document.getElementById('gStar');if(lbl)lbl.textContent='星雨之夜 · 全站照料 '+care+' / '+G_STAR_GOAL;
  var msg=document.getElementById('gStarMsg');
  if(care>=G_STAR_GOAL&&msg&&!msg.dataset.done){
    msg.dataset.done=1;msg.innerHTML='<div style="color:#ffd60a;font-size:11px;margin-top:4px;line-height:1.6">★ 星雨之夜降临！全体探索点 +2，传说种子正在重新被发现</div>';
    gExAdd(2);var pb=document.getElementById('gExBox');if(pb)pb.textContent=gEx();
    var legs=[];for(var i=0;i<G_LEGEND.length;i++)if(gDisc().indexOf(G_LEGEND[i])<0)legs.push(G_LEGEND[i]);
    if(legs.length){var got=legs[Math.floor(Math.random()*legs.length)];gSeedAdd(got);gProgRefresh();gSeedRefresh();toast('星雨带来神秘种子','解锁 '+gP(got).n)}
    gFx(window.innerWidth/2,window.innerHeight/2,'#ffd60a');
  }
}
function gProgRefresh(){var p=document.getElementById('gProg');if(p)p.style.width=Math.round(gDisc().length/64*100)+'%';var t=document.getElementById('gProgLabel');if(t){t.innerHTML=gDisc().length>=64?'图鉴全收 · 守园人 ⚜':' 图鉴探索 · DISCOVERED '+gDisc().length+' / 64'}}
var gTree=[
  {id:1,ly:1,ty:1,n:'星尘浅洼',re:'dust',pa:0},
  {id:2,ly:1,ty:1,n:'苔光小径',re:'rare',pa:0},
  {id:3,ly:1,ty:1,n:'露珠营地',re:'dust',pa:0},
  {id:4,ly:2,ty:2,n:'深眠花心',re:'legend',pa:1},
  {id:5,ly:2,ty:2,n:'月曆祭坛',re:'dust',pa:2},
  {id:6,ly:2,ty:2,n:'荒茠王座',re:'legend',pa:3},
  {id:7,ly:3,ty:1,n:'传说的余烬',re:'boss',pa:4},
  {id:8,ly:3,ty:1,n:'星核残响',re:'boss',pa:6},
];
function gTrek(){try{return JSON.parse(localStorage.getItem('wz_gtrek')||'[]')}catch(e){return[]}}
function gTrekSave(a){try{localStorage.setItem('wz_gtrek',JSON.stringify(a))}catch(e){}}
function gTreeAvail(done,id){
  if(done.indexOf(id)>=0)return 2;
  var nd=gTree[id-1];if(!nd)return 0;
  if(nd.pa===0)return 1;
  if(done.indexOf(nd.pa)>=0)return 1;
  return 0;
}
function gTreeRender(){
  var box=document.getElementById('gTreeBox');if(!box)return;
  var done=gTrek();box.innerHTML='';
  var cols=3;
  for(var ly=1;ly<=3;ly++){
    var nds=[];for(var i=0;i<gTree.length;i++)if(gTree[i].ly===ly)nds.push(gTree[i]);
    var row=document.createElement('div');
    row.style.cssText='display:grid;grid-template-columns:repeat('+cols+',1fr);gap:8px;margin-bottom:2px';
    for(var cid=0;cid<cols;cid++){
      var cell=document.createElement('div');
      cell.style.cssText='display:flex;justify-content:center';
      if(cid<nds.length){
        var nd=nds[cid];var av=gTreeAvail(done,nd.id);
        (function(nd,av){var el=document.createElement('div');
          el.style.cssText='position:relative;width:98px;border-radius:10px;padding:7px 6px;text-align:center;box-sizing:border-box;font-size:9.5px;line-height:1.4;transition:.18s';
          if(av===2)el.style.cssText+='border:1px solid var(--accent,#fff);background:rgba(255,255,255,.08);color:#e6edef;opacity:.95';
          else if(av===1){el.style.cssText+='border:1px solid var(--accent,#fff);background:rgba(120,160,255,.12);color:#e6edef;cursor:pointer;box-shadow:0 0 10px rgba(120,160,255,.25)';el.onmouseenter=function(){this.style.transform='translateY(-2px)'};el.onmouseleave=function(){this.style.transform='none'};el.onclick=function(){gTreeGo(nd.id)}}
          else el.style.cssText+='border:1px dashed #2c2c2c;background:rgba(255,255,255,.02);color:#5b5b5b;opacity:.6';
          var dn=(av===2?'已点亮':(av===1?(nd.ty===2?'大节点 · 2 点':'小节点 · 1 点'):'未解锁'));
          el.innerHTML='<div style="font-size:10px;color:'+(av===2?'var(--accent,#fff)':av===1?'#ffd60a':'#6a767d')+'">'+nd.n+'</div><div style="font-size:8px;color:#8a8a8a;margin-top:2px">'+dn+'</div>';
          cell.appendChild(el);
        })(nd,av);
      }
      row.appendChild(cell);
    }
    box.appendChild(row);
    if(ly<3){
      var ln=document.createElement('div');
      ln.style.cssText='display:grid;grid-template-columns:repeat('+cols+',1fr);gap:8px;height:18px;margin:0 0 4px';
      for(var c2=0;c2<cols;c2++){
        var lc=document.createElement('div');
        lc.style.cssText='display:flex;justify-content:center';
        var par=null,kid=null;
        for(var i=0;i<gTree.length;i++){if(gTree[i].ly===ly&&!par)par=gTree[i];if(gTree[i].ly===ly+1&&i>=0&&i<cols&&!kid){/*列定位*/}}
        /* 列定位：同列上下节点 */
        var pars=[];for(var i2=0;i2<gTree.length;i2++)if(gTree[i2].ly===ly)pars.push(gTree[i2]);
        var kids=[];for(var i3=0;i3<gTree.length;i3++)if(gTree[i3].ly===ly+1)kids.push(gTree[i3]);
        par=pars[c2];kid=kids[c2];
        if(par&&kid&&kid.pa===par.id){
          lc.innerHTML='<div style="width:2px;height:18px;background:var(--line2,#555)"></div>';
        }else if(par&&kid){
          lc.innerHTML='<div style="width:2px;height:18px;background:var(--line2,#444)"></div>';
        }
        ln.appendChild(lc);
      }
      box.appendChild(ln);
    }
  }
}
function gTreeGo(id){
  var nd=gTree[id-1];if(!nd)return;
  var done=gTrek();
  if(gTreeAvail(done,id)!==1){toast('该节点未解锁','先探索上一层');return}
  var cost=nd.ty===2?2:1;
  if(gEx()<cost){toast('探索点不足','需要 '+cost+' 点 · 种下或照料可获得');return}
  gExAdd(-cost);var pb=document.getElementById('gExBox');if(pb)pb.textContent=gEx();
  done.push(id);gTrekSave(done);
  gTreeReward(nd);
  gTreeRender();
}
function gTreeReward(nd){
  var box=document.getElementById('gExploreBox');if(!box)return;
  var locked=[];for(var i=0;i<G_PLANTS.length;i++){var x=G_PLANTS[i].id;if(gDisc().indexOf(x)<0)locked.push(x)}
  var legs=locked.filter(function(x){return G_LEGEND.indexOf(x)>=0});
  var rars=locked.filter(function(x){return G_RARE.indexOf(x)>=0});
  var txt='';
  if(nd.re==='dust'){
    var bonus=nd.ty===2?3:1;gExAdd(bonus);var pb=document.getElementById('gExBox');if(pb)pb.textContent=gEx();
    txt='<div style="color:#80ffdb;font-size:12.5px">星尘弥漫——探索点 +'+bonus+'。</div>';
  }else if(nd.re==='rare'){
    if(rars.length){var got=rars[Math.floor(Math.random()*rars.length)];gSeedAdd(got);gProgRefresh();gSeedRefresh();txt='<div style="color:var(--accent,#fff);font-size:12.5px">黑暗中浮出 <b>'+gP(got).n+'</b>（稀有）</div>'}
    else txt='<div style="color:#8a8a8a;font-size:12.5px">稀有种子已尽数收齐——星尘 +2</div>';
  }else if(nd.re==='legend'){
    if(legs.length&&Math.random()<.75){var got=legs[Math.floor(Math.random()*legs.length)];gSeedAdd(got);gProgRefresh();gSeedRefresh();txt='<div style="color:#ffd60a;font-size:12.5px">传说在深处低语——获得 <b>'+gP(got).n+'</b> ★</div>'}
    else if(rars.length){var got=rars[Math.floor(Math.random()*rars.length)];gSeedAdd(got);gProgRefresh();gSeedRefresh();txt='<div style="color:var(--accent,#fff);font-size:12.5px">获得稀有种子 <b>'+gP(got).n+'</b> ✦</div>'}
    else txt='<div style="color:#8a8a8a;font-size:12.5px">种子已收齐——星尘 +4</div>';
  }else{
    if(legs.length){var got=legs[Math.floor(Math.random()*legs.length)];gSeedAdd(got);gProgRefresh();gSeedRefresh();txt='<div style="color:#ffd60a;font-size:12.5px;font-weight:bold">传说的余烬燃起——保底获得 <b>'+gP(got).n+'</b> ★</div>'}
    else {gExAdd(5);var pb=document.getElementById('gExBox');if(pb)pb.textContent=gEx();txt='<div style="color:#8a8a8a;font-size:12.5px">传说齐了——星尘 +5，夜的尽头再无秘密。</div>'}
  }
  box.innerHTML=txt;gFx(window.innerWidth/2,window.innerHeight/2,'#ffd60a');
}

(function(){
  var b=document.createElement('button');
  b.type='button';b.title='协作种植花园';
  b.style.cssText='position:fixed;left:14px;bottom:62px;z-index:2147482100;background:rgba(8,10,12,.82);border:1px solid var(--cbd,var(--line2,#444));color:var(--accent,#fff);font-size:11px;letter-spacing:.1em;font-family:Consolas,monospace;padding:6px 10px;cursor:pointer;transition:.2s;opacity:.8';
  b.textContent='卵 花园';
  b.onmouseover=function(){b.style.opacity='1';b.style.borderColor='var(--accent,#fff)'};
  b.onmouseout=function(){b.style.opacity='.8'};
  b.onclick=function(){if(window.openGarden)openGarden()};
  document.body.appendChild(b);
})();
