

function lv(){return+(sessionStorage.getItem('wzLv')||0)}
function ch(){return sessionStorage.getItem('wzLv')==='9999'}
function perm(){
var l=lv(),f=l===9999;
document.body.classList.toggle('inv',f);
var bd=document.getElementById('permBadge'),pl=document.getElementById('permMainLv');
if(bd){bd.textContent=f?'LV ▓▓▓▓':('LV '+l);bd.classList.toggle('inv',f)}
if(pl)pl.textContent=f?'当前 LV ▓▓▓▓ · 全权限已解锁':'当前密级 LV '+l;
}
perm();
(function(){
var hd=document.querySelector('.h3d'),hero=document.querySelector('.hero');
if(!hd||!hero)return;
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
hero.addEventListener('mousemove',function(e){
if(hero._q)return;hero._q=true;
requestAnimationFrame(function(){hero._q=false;var r=hero.getBoundingClientRect();var nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;hd.style.transform='rotateX('+(-ny*3.5).toFixed(2)+'deg) rotateY('+(nx*3.5).toFixed(2)+'deg)'});
});
hero.addEventListener('mouseleave',function(){hd.style.transform=''});
})();
(function(){var cs=document.querySelectorAll('.grid.two .card');
for(var i=0;i<cs.length;i++)(function(c){
var sp=c.querySelector('.spot');
if(!sp)return;
c.addEventListener('mousemove',function(e){if(c._q)return;c._q=true;requestAnimationFrame(function(){c._q=false;var r=c.getBoundingClientRect();sp.style.setProperty('--mx',(e.clientX-r.left)+'px');sp.style.setProperty('--my',(e.clientY-r.top)+'px')})});
})(cs[i]);})();

(function(){var cs=document.querySelectorAll('.card');
for(var i=0;i<cs.length;i++)(function(c){
c.addEventListener('mousemove',function(e){if(c._q)return;c._q=true;requestAnimationFrame(function(){c._q=false;var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;c.style.transform='perspective(900px) rotateY('+((px-.5)*7).toFixed(2)+'deg) rotateX('+((.5-py)*7).toFixed(2)+'deg) translateY(-3px)'})});
c.addEventListener('mouseleave',function(){c.style.transform=''});
})(cs[i]);
})();
(function(){var cs=document.querySelectorAll('a.card');
for(var i=0;i<cs.length;i++)cs[i].addEventListener('click',function(e){
  var u=this.getAttribute('href'); if(!u) return;
  e.preventDefault(); go(u);
});})();

/* ===== 备忘录（Markdown + 任务打勾） ===== */
var _CS={红:'#e5484d',橙:'#d97b29',黄:'#d9a441',绿:'#46a758',青:'#12a594',蓝:'#3b82f6',紫:'#8e4ec6',粉:'#d6409f',灰:'#8b8b8b',白:'#ffffff',黑:'#111111',金:'#d4a017',银:'#c0c0c0'};
function _cc(c){
  c=String(c||'').trim().toLowerCase();
  if(_CS[c]) return _CS[c];
  if(/^#[0-9a-f]{3,8}$/.test(c)) return c;
  return null;
}
function mdIn(s){
  s=s.replace(/\[c=([#\w\u4e00-\u9fa5]+)\]((?:[^\[\]]|\[(?!\/c\]))*?)\[\/c\]/g,function(m,co,t){var cv=_cc(co);return cv?('<span style="color:'+cv+'">'+mdIn(t)+'</span>'):m;});
  s=s.replace(/\[q=([#\w\u4e00-\u9fa5]+)\]((?:[^\[\]]|\[(?!\/q\]))*?)\[\/q\]/g,function(m,co,t){var cv=_cc(co);return cv?('<blockquote class="mdq" style="border-left-color:'+cv+'">'+mdIn(t)+'<br></blockquote>'):m;});
  s=s.replace(/`([^`]+)`/g,'<code class="mdc">$1</code>');
  s=s.replace(/\*\*([^*]+)\*\*/g,'<b class="md-b">$1</b>');
  s=s.replace(/(?<!\*)\*([^*\s][^*]*)\*(?!\*)/g,'<em class="md-i">$1</em>');
  s=s.replace(/~~([^~]+)~~/g,'<del class="md-d">$1</del>');
  s=s.replace(/!\[([^\]]*)\]\((https?:[^)]+)\)/g,'<img class="mdi" src="$2" alt="$1" loading="lazy">');
  s=s.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  s=s.replace(/(?<!=")(https?:\/\/[^\s<&]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
  return s;
}
function md(s){
  s=String(s==null?'':s);
  s=esc(s);
  var ls=s.split('\n'),inCode=false,out=[],i,ul=0,ol=0,q=0;
  function closeL(){ if(ul){out.push('</ul>');ul=0} if(ol){out.push('</ol>');ol=0} if(q){out.push('</blockquote>');q=0} }
  for(i=0;i<ls.length;i++){
    var line=ls[i];
    if(/^```/.test(line)){ closeL(); inCode=!inCode; if(inCode) out.push('<pre class="mdcode">'); else out.push('</pre>'); continue; }
    if(inCode){ out.push(line+'\n'); continue; }
    if(/^\|.*\|$/.test(line.trim())&&/^\|[\s:|-]+\|[\s:|-]+/.test((ls[i+1]||'').trim())){
      closeL(); var rows=[];
      while(i<ls.length&&/^\|.*\|$/.test(ls[i].trim())){ rows.push(ls[i].trim()); i++; }
      i--;
      var hh='<table class="mdt">',fi=0;
      for(var ri=0;ri<rows.length;ri++){
        var cells=rows[ri].replace(/^\||\|$/g,'').split('|').map(function(c){return c.trim()});
        var isSep=cells.length>0&&cells.every(function(c){return /^:?-+:?$/.test(c)&&c.indexOf('-')>=0});
        if(isSep) continue;
        if(fi===0){ hh+='<tr>'+cells.map(function(c){return '<th>'+mdIn(c)+'</th>'}).join('')+'</tr>'; fi=1; }
        else { hh+='<tr>'+cells.map(function(c){return '<td>'+mdIn(c)+'</td>'}).join('')+'</tr>'; }
      }
      out.push(hh+'</table>'); continue;
    }
    if(/^(-{3,}|\*{3,})$/.test(line.trim())){ closeL(); out.push('<hr class="mdhr">'); continue; }
    if(/^#{1,4} /.test(line)){
      closeL(); var lv=line.match(/^#{1,4}/)[0].length;
      out.push('<div class="mdh mdh'+lv+'">'+mdIn(line.replace(/^#{1,4} /,''))+'</div>'); continue;
    }
    if(/^&gt; /.test(line)){
      if(!q){ out.push('<blockquote class="mdq">'); q=1; }
      out.push(mdIn(line.replace(/^&gt; /,''))+'<br>'); continue;
    }
    if(/^[-*] \[([ xX])\] (.*)$/.test(line)){
      if(q){ out.push('</blockquote>'); q=0; }
      if(!ul){ out.push('<ul class="mdul">'); ul=1; }
      var mt=line.match(/^[-*] \[([ xX])\] (.*)$/);
      var done=mt[1].toLowerCase()==='x';
      out.push('<li class="mdtask'+(done?' done':'')+'"><label><input type="checkbox" data-ti="'+i+'"'+(done?' checked':'')+'><span>'+mdIn(mt[2])+'</span></label></li>');
      continue;
    }
    if(/^[-*] /.test(line)){
      if(q){ out.push('</blockquote>'); q=0; }
      if(!ul){ out.push('<ul class="mdul">'); ul=1; }
      out.push('<li>'+mdIn(line.replace(/^[-*] /,''))+'</li>'); continue;
    }
    if(/^\d+\. /.test(line)){
      if(q){ out.push('</blockquote>'); q=0; }
      if(!ol){ out.push('<ol class="mdol">'); ol=1; }
      out.push('<li>'+mdIn(line.replace(/^\d+\. /,''))+'</li>'); continue;
    }
    closeL();
    if(!/^\s*$/.test(line)) out.push('<p>'+mdIn(line)+'</p>');
  }
  closeL();
  var r=out.join('');
  if(inCode) r+='</pre>';
  return r;
}
var K_MEMO='wMemo';
function memoLoad(){ try{ return localStorage.getItem(K_MEMO)||''; }catch(e){ return ''; } }
function memoTag(t,c){ return '<span class="memo-tag '+c+'">'+t+'</span>'; }
function memoCd(m,d){
  var p=d.split(/[-/.]/),y,mo,da;
  if(p.length===3){ y=+p[0]; mo=+p[1]; da=+p[2]; } else { var n=new Date(); y=n.getFullYear(); mo=+p[0]; da=+p[1]; }
  if(!mo||!da) return m;
  var t=new Date(y,mo-1,da); t.setHours(23,59,59,999);
  var diff=Math.ceil((t-Date.now())/86400000);
  if(diff>0) return memoTag('剩 '+diff+' 天','cd-ok');
  if(diff===0) return memoTag('今天到期','cd-today');
  return memoTag('已过期 '+(-diff)+' 天','cd-over');
}
function memoMd(v){
  var h=md(v);
  var idx=0,map=[],sl=String(v).split('\n');
  for(var i=0;i<sl.length;i++){ var n=(sl[i].match(/\[(?:进度|目标)\s*\d+/g)||[]).length; for(var k=0;k<n;k++) map.push(i); }
  h=h.replace(/\[倒计时\s*([^\]]+)\]/g,memoCd);
  h=h.replace(/\[进度\s*(\d+)\s*\/\s*(\d+)\]/g,function(m,a,b){
    var li=map[idx++],A=+a,B=+b; if(!B) return m;
    var pct=Math.min(100,Math.round(A/B*100));
    return '<span class="memo-prog"><span class="memo-bar" style="width:'+pct+'%"></span><b>'+A+'/'+B+'</b></span>'
      +'<span class="memo-step"><button type="button" data-mi="'+li+'" data-mk="p" data-cur="'+A+'" data-mb="'+B+'" data-s="+">+</button><button type="button" data-mi="'+li+'" data-mk="p" data-cur="'+A+'" data-mb="'+B+'" data-s="-">-</button></span>';
  });
  h=h.replace(/\[目标\s*(\d+)(?:\s*\/\s*(\d+))?\]/g,function(m,b,c){
    var li=map[idx++],B=+b,cur=(c===undefined?0:+c);
    return memoTag('目标 '+B+' 次','')
      +'<span class="memo-step"><span class="cur">'+cur+'</span><button type="button" data-mi="'+li+'" data-mk="g" data-cur="'+cur+'" data-mb="'+B+'" data-s="+">+</button><button type="button" data-mi="'+li+'" data-mk="g" data-cur="'+cur+'" data-mb="'+B+'" data-s="-">-</button></span>';
  });

  return h;
}
var memoMode='view';
function memoSetMode(m){
  memoMode=m;
  var ta=$('memoSrc'),pv=$('memoPv'),btn=$('memoMode');
  if(m==='code'){ if(ta) ta.style.display=''; if(pv) pv.style.display='none'; if(btn) btn.textContent='查看'; }
  else { if(ta) ta.style.display='none'; if(pv) pv.style.display=''; if(btn) btn.textContent='代码'; }
}
function memoRender(){
  var v=memoLoad();
  var ta=$('memoSrc');
  if(ta && document.activeElement!==ta) ta.value=v;
  var pv=$('memoPv');
  if(pv) pv.innerHTML=memoMd(v)||'<div class="memo-empty">空备忘录 · 点击右上「代码」开始书写</div>';
  var st=$('memoStat');
  if(st){ var n=(v.match(/\[ \]/g)||[]).length,d=(v.match(/\[x\]/g)||[]).length; st.textContent=n+' 待办 · '+d+' 完成'; }
}
function memoOpen(){ var m=$('memoMask'); if(m){ memoRender(); m.classList.add('on'); } }
(function(){
  var c=document.getElementById('gbCard'),h=document.getElementById('gbCardH');
  if(!c||!h)return;
  if((localStorage.getItem('gb_collapsed')||'1')==='1')c.classList.add('collapsed');
  var fl=document.querySelector('.gb-fold');
  function upd(){ if(fl)fl.textContent=c.classList.contains('collapsed')?'▾ 展开':'▴ 收起'; }
  upd();
  h.addEventListener('click',function(){
    var on=c.classList.toggle('collapsed');
    localStorage.setItem('gb_collapsed',on?'1':'0');
    upd();
  });
})();
(function(){
  var m={stTh:'thBtn',stUi:'uiBtn',stVm:'vmBtn'};
  for(var k in m){(function(t){var b=document.getElementById(t);if(b)b.addEventListener('click',function(){var r=document.getElementById(m[t]);if(r)r.click();});})(k);}
})();
(function(){
  var tabs=document.querySelectorAll('.sec-tab'),secs=document.querySelectorAll('.sec');
  if(!tabs.length||!secs.length)return;
  function show(n){
    for(var i=0;i<secs.length;i++)secs[i].style.display=(i+1)===n?'':'none';
    for(var j=0;j<tabs.length;j++)tabs[j].classList.toggle('on',(j+1)===n);
    var s=document.getElementById('sec'+n);
    if(s){var cs=s.querySelectorAll('.card');for(var k=0;k<cs.length;k++)cs[k].classList.add('in');}
  }
  for(var k=0;k<tabs.length;k++)(function(t){t.addEventListener('click',function(){show(parseInt(t.getAttribute('data-s'),10)||1);});})(tabs[k]);
  show(1);
})();
function memoClose(){ var m=$('memoMask'); if(m) m.classList.remove('on'); }
var _rkBy='exp';
function rkTabs(){
  var g=$('rankTabs');if(!g)return;
  var t=[['exp','经验'],['pts','积分'],['ach','成就']];
  g.innerHTML=t.map(function(x){return '<div class="th-card rt'+(_rkBy===x[0]?' on':'')+'" data-rk="'+x[0]+'"><div class="tn">'+x[1]+'</div></div>'}).join('');
}
function openRank(by){
  if(by)_rkBy=by;
  var m=$('rankMask');if(m)m.classList.add('on');
  rkTabs();
  var bd=$('rankBody');if(!bd)return;
  bd.innerHTML='<div class="rk-empty">载入中…</div>';
  call('/rank',{by:_rkBy,limit:10}).then(function(j){
    if(!j||!j.ok){bd.innerHTML='<div class="rk-empty">排行榜加载失败</div>';return}
    var l=j.list||[];
    if(!l.length){bd.innerHTML='<div class="rk-empty">暂无数据</div>';return}
    var me=S.user?S.user.username:'';
    bd.innerHTML=l.map(function(x,i){
      var c=i===0?'g1':(i===1?'g2':(i===2?'g3':''));
      var v=_rkBy==='exp'?('LV '+x.lv+' · '+x.exp):(_rkBy==='pts'?x.pts+' 积分':x.ach+' 项');
      return '<div class="rk-row'+(x.name===me?' rk-me':'')+'"><span class="rk-no '+c+'">'+(i+1)+'</span>'+
        '<span class="rk-nm">'+esc(x.name)+(x.is_admin?'<span class="rk-ad">ADMIN</span>':'')+'<span class="rk-ti">'+esc(x.title||'')+'</span></span>'+
        '<span class="rk-v">'+v+'</span></div>';
    }).join('');
  }).catch(function(){
    var bd2=$('rankBody');if(bd2)bd2.innerHTML='<div class="rk-empty">排行榜加载失败</div>';
  });
}
(function(){
  var rc=$('rankCard');
  if(rc)rc.addEventListener('click',function(){openRank()});
  var rcl=$('rankClose');
  if(rcl)rcl.addEventListener('click',function(){var m=$('rankMask');if(m)m.classList.remove('on')});
  var rm=$('rankMask');
  if(rm)rm.addEventListener('click',function(e){if(e.target===rm)rm.classList.remove('on')});
  var rt=$('rankTabs');
  if(rt)rt.addEventListener('click',function(e){
    var c=e.target.closest('[data-rk]');
    if(c)openRank(c.getAttribute('data-rk'));
  });
})();
/* ===== 积分商店 ===== */
var _shopCat=null,_shopKind='title',_shopDaily={};
function shopItemHtml(x,owned,eq){
  var off=_shopDaily&&_shopDaily[x.id]||1,d=Math.round(x.cost*off),pts0=+S.user.pts||0;
  var short=!!S.user&&!owned&&pts0<d,miss=d-pts0;
  var a='';
  if(!S.user)a='<span class="shop-sub">登录后可购买</span>';
  else if(owned&&eq)a='<span class="shop-eq">已装备</span><button class="shop-btn" data-unequip="'+x.id+'">卸下</button>';
  else if(owned&&x.type==='mat')a='<button class="shop-btn prim" data-buy="'+x.id+'"'+(short?' disabled':'')+'>'+(short?'差 '+miss+' 分':'兑换')+'</button>';else if(owned&&x.type==='weapon')a='<span class="shop-own">已拥有</span><button class="shop-btn prim" onclick="location.href=&#39;pages/锻造.html&#39;">锻造</button>';else if(owned)a='<span class="shop-own">已拥有</span><button class="shop-btn prim" data-equip="'+x.id+'">装备</button>';
  else a='<button class="shop-btn prim" data-buy="'+x.id+'"'+(short?' disabled':'')+'>'+(short?'差 '+miss+' 分':'兑换')+'</button>';
  return '<div class="shop-item'+(eq?' on':'')+'"><div class="si-h"><span class="si-n">'+esc(x.name)+'</span>'+
    (off<1?'<span class="shop-sale">今日特供 · 7折</span>':'')+(owned?'<span class="shop-own">已有</span>':'')+
    '<span class="si-c">'+(off<1?'<s style="opacity:.45">'+x.cost+'</s> ':'')+d+' 积分</span></div>'+
    '<div class="si-d">'+esc(x.desc||'')+(short?'<div style="color:#9a8f6a;font-size:10px;margin-top:4px">差 '+miss+' 分 · 签到 / 小游戏 / 留言可得积分</div>':'')+'</div><div class="si-a">'+a+'</div></div>';
}
function shopRender(){
  var bd=$('shopBody');if(!bd)return;
  var pts=$('shopPts');
  if(pts)pts.textContent=(S.user?(+S.user.pts||0):0)+' 积分';
  if(!_shopCat){bd.innerHTML='<div class="rk-empty">载入中…</div>';return}
  var t=$('shopTabs');
  if(t)t.innerHTML=[['title','称号'],['frame','头像框'],['weapon','武器'],['mat','材料']].map(function(x){
    return '<div class="th-card rt'+(_shopKind===x[0]?' on':'')+'" data-sk="'+x[0]+'"><div class="tn">'+x[1]+'</div></div>';}).join('');
  var list=_shopCat.filter(function(x){return x.type===_shopKind});
  if(!list.length){bd.innerHTML='<div class="rk-empty">暂无商品</div>';return}
  var myTitle='',myFrame='';
  if(S.user){myTitle=S.user.title||'';myFrame=S.user.frame||''}
  bd.innerHTML=list.map(function(x){
    var owned=false;
    if(S.user){
      owned=(S.user.items||[]).indexOf(x.id)>=0;
      if(x.type==='title'&&myTitle===x.name)owned=true;
    }
    var eq=(x.type==='title')?(myTitle===x.name):(myFrame===x.id);
    return shopItemHtml(x,owned,eq);
  }).join('');
  var it=bd.querySelectorAll('.shop-item');
  for(var k=0;k<it.length;k++){it[k].style.animationDelay=(k*40)+'ms';it[k].classList.add('si-in')}
}
function openShop(){
  var m=$('shopMask');if(m)m.classList.add('on');
  try{var k=localStorage.getItem('prts_shopKind');if(k&&['title','frame','weapon','mat'].indexOf(k)>=0)_shopKind=k}catch(e){}
  if(_shopCat){shopRender();return}
  shopRender();
  call('/shop',{}).then(function(j){
    _shopCat=(j&&j.ok&&j.list)?j.list:[];
    _shopDaily=(j&&j.daily)?j.daily:{};
    shopRender();
  }).catch(function(){_shopCat=[];_shopDaily={};shopRender()});
}
function shopBuy(id,x,y){
  var bd=$('shopBody');
  call('/buy',{id:id}).then(function(j){
    if(!j||!j.ok)return say((j&&j.msg)||'兑换失败',false);
    S.user.pts=j.pts;S.user.items=j.items||S.user.items||[];
    if(j.title)S.user.title=j.title;
    if(j.frame)S.user.frame=j.frame;
    try{localStorage.setItem(K_SESS,JSON.stringify(S.user))}catch(e){}
    say(j.msg||'已兑换',true);
    if(window.fragFx)fragFx(x||innerWidth/2,y||innerHeight/2);
    if(_shopKind==='weapon'){var _v=fLget('wz_forge',[]),_h={};for(var _q=0;_q<_v.length;_q++)_h[_v[_q].b]=1;if(!_h[id]){_v.push({id:'wf'+(fLget('wz_forge_seq',1)),b:id,aff:[],dur:1,cost:0,combo:'',name:null});fLset('wz_forge_seq',fLget('wz_forge_seq',1)+1);fLset('wz_forge',_v)}toast('胚子已入武器仓库','去锻造页打造')}
    else if(_shopKind==='mat'){
      if(id==='m_lapis'){fLset('wz_lapis',fLget('wz_lapis',0)+3);toast('已兑换 青金石','已存入锻造仓库')}
      else if(id==='m_iron'){fLset('wz_iron',fLget('wz_iron',0)+2);toast('已兑换 魔铁锭','已存入锻造仓库')}
      else if(id==='m_book'){fLset('wz_bookshelf',fLget('wz_bookshelf',0)+1);toast('已兑换 书架','已存入锻造仓库')}
      else if(id==='m_sulfur'||id==='m_mercury'||id==='m_salt'||id==='m_fire'||id==='m_water'||id==='m_earth'||id==='m_air'||id==='m_silver'||id==='m_rose'){
        var _mp={m_sulfur:'s_sulfur',m_mercury:'s_mercury',m_salt:'s_salt',m_fire:'e_fire',m_water:'e_water',m_earth:'e_earth',m_air:'e_air',m_silver:'m_silver',m_rose:'h_rose'};
        try{var _al=JSON.parse(localStorage.getItem('wz_alch')||'{}');_al.mats=_al.mats||{};_al.mats[_mp[id]]=(_al.mats[_mp[id]]||0)+1;localStorage.setItem('wz_alch',JSON.stringify(_al));toast('已兑换 炼金材料','已存入炼金仓库')}catch(e){}
      }
      else if(id==='m_seed'){var _pp=[];for(var _s=0;_s<64;_s++){if([6,11,13,15,17,18,21,24,22,23,25].indexOf(_s)<0)_pp.push(_s)}var _sid=_pp[Math.floor(Math.random()*_pp.length)],_sa=fLget('wz_gseeds',[]);_sa.push(_sid);fLset('wz_gseeds',_sa);var _sd=fLget('wz_gdisc',[]);if(_sd.indexOf(_sid)<0){_sd.push(_sid);fLset('wz_gdisc',_sd)}toast('神秘花种已入花园','随机解锁一颗花种 · 去花园页种下')}
      else if(id==='m_deep'){fLset('wz_gex',fLget('wz_gex',0)+3);toast('夜色提灯已点亮','花园探索点 +3 · 去花园页查看')}
      else if(id==='m_slag'){fLset('wz_forge_exp',fLget('wz_forge_exp',0)+10);toast('锻炉余烬已入库','锻造经验 +10')}
      else if(id==='m_quill'){fLset('wz_forge_exp',fLget('wz_forge_exp',0)+30);toast('学徒刻印已入库','锻造经验 +30')}
    }
    shopRender();shopBadge();
  }).catch(function(e){say('兑换失败：'+ferr(e.message),false)});
}
function shopEquip(id){
  call('/equip',{kind:_shopKind,id:id}).then(function(j){
    if(!j||!j.ok)return say((j&&j.msg)||'装备失败',false);
    S.user.title=j.title||'';S.user.frame=j.frame||'';
    try{localStorage.setItem(K_SESS,JSON.stringify(S.user))}catch(e){}
    say('已装备',true);
    shopRender();shopBadge();
  }).catch(function(e){say('装备失败：'+ferr(e.message),false)});
}
function shopBadge(){
  var el=$('gb_curuser');if(!el)return;
  el.textContent=S.user?S.user.username:'';
  var nm=el.parentNode;if(!nm)return;
  var old=nm.querySelector('.u-title');if(old)old.parentNode.removeChild(old);
  if(S.user&&S.user.title){
    var sp=document.createElement('span');sp.className='u-title';sp.textContent=S.user.title;
    nm.appendChild(sp);
  }
}
window.shopBadge=shopBadge;
(function(){
  var sc=$('shopCard');
  if(sc)sc.addEventListener('click',function(){openShop()});
  var scl=$('shopClose');
  if(scl)scl.addEventListener('click',function(){var m=$('shopMask');if(m)m.classList.remove('on')});
  var sm=$('shopMask');
  if(sm)sm.addEventListener('click',function(e){if(e.target===sm)sm.classList.remove('on')});
  var st=$('shopTabs');
  if(st)st.addEventListener('click',function(e){
    var c=e.target.closest('[data-sk]');
    if(c){_shopKind=c.getAttribute('data-sk');try{localStorage.setItem('prts_shopKind',_shopKind)}catch(e){}shopRender()}
  });
  var sb=$('shopBody');
  if(sb)sb.addEventListener('click',function(e){
    var b=e.target.closest('[data-buy]');if(b){shopBuy(b.getAttribute('data-buy'),e.clientX,e.clientY);return}
    var q=e.target.closest('[data-equip]');if(q){shopEquip(q.getAttribute('data-equip'));return}
    var u=e.target.closest('[data-unequip]');
    if(u){
      call('/equip',{kind:_shopKind,id:''}).then(function(j){
        if(j&&j.ok){S.user.title=j.title||'';S.user.frame=j.frame||'';
          try{localStorage.setItem(K_SESS,JSON.stringify(S.user))}catch(e){}
          shopRender();shopBadge();}
      }).catch(function(){});
    }
  });
})();
(function(){
  var cs=document.querySelectorAll('.card[data-memo]');
  for(var i=0;i<cs.length;i++) cs[i].addEventListener('click',memoOpen);
  var mmb=$('memoMode');
  if(mmb) mmb.addEventListener('click',function(){ memoSetMode(memoMode==='code'?'view':'code'); });
  memoSetMode('view');
  var mc=$('memoClose'); if(mc) mc.addEventListener('click',memoClose);
  var mm=$('memoMask');
  if(mm) mm.addEventListener('click',function(e){ if(e.target===mm) memoClose(); });
  var ex=$('memoExport');
  if(ex) ex.addEventListener('click',function(){
    var v=$('memoSrc').value;
    var b=new Blob([v],{type:'text/plain;charset=utf-8'});
    var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='备忘录.md'; a.click();
    URL.revokeObjectURL(a.href);
  });
  var cl=$('memoClear');
  if(cl) cl.addEventListener('click',function(){
    if(!window.confirm('确定清空备忘录？此操作不可恢复')) return;
    localStorage.setItem(K_MEMO,''); memoRender(); cloudSave({memo:''},500);
  });
  var ta=$('memoSrc'),timer=null;
  if(ta) ta.addEventListener('input',function(){
    localStorage.setItem(K_MEMO,ta.value);
    clearTimeout(timer);
    timer=setTimeout(function(){ memoRender(); cloudSave({memo:ta.value},700); },600);
  });
  var pv=$('memoPv');
  if(pv) pv.addEventListener('click',function(e){
    var b=e.target.closest('button[data-mi]'); if(!b) return;
    var li=+b.getAttribute('data-mi'),mk=b.getAttribute('data-mk');
    var cur=+b.getAttribute('data-cur'),mb=+b.getAttribute('data-mb');
    cur=Math.max(0,cur+((b.getAttribute('data-s')==='+')?1:-1));
    var src=memoLoad(),lines=src.split('\n'),line=lines[li]||'';
    if(mk==='p'){ line=line.replace(/\[进度\s*\d+\s*\/\s*\d+\]/,'[进度 '+cur+'/'+mb+']'); }
    else { line=line.replace(/\[目标\s*\d+(?:\s*\/\s*\d+)?\]/,'[目标 '+mb+'/'+cur+']'); }
    lines[li]=line; localStorage.setItem(K_MEMO,lines.join('\n')); memoRender(); cloudSave({memo:memoLoad()},500);
  });
  if(pv) pv.addEventListener('change',function(e){
    var c=e.target.closest('input[data-ti]'); if(!c) return;
    var src=memoLoad();
    var lines=src.split('\n'),li=+c.getAttribute('data-ti');
    var line=lines[li]||'';
    if(/\[ \]/.test(line)) lines[li]=line.replace('[ ]','[x]');
    else lines[li]=line.replace(/\[[xX]\]/,'[ ]');
    localStorage.setItem(K_MEMO,lines.join('\n'));
    memoRender();
    cloudSave({memo:memoLoad()},500);
  });
})();

(function(){var io=null;
var cs=document.querySelectorAll('.grid.two .card');
if('IntersectionObserver' in window){io=new IntersectionObserver(function(es){
for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('in');io.unobserve(es[i].target)}}},{threshold:.15});
}else{for(var i=0;i<cs.length;i++)cs[i].classList.add('in')}
for(var i=0;i<cs.length;i++){cs[i].style.transitionDelay=(i*90)+'ms';io.observe(cs[i])};
})();

var boot=document.getElementById('boot'),bBar=document.getElementById('btBar'),bP=document.getElementById('btP');
function hideBoot(){document.body.classList.add('ready');setTimeout(function(){boot.style.display='none'},720);sessionStorage.setItem('wzBoot','1')}
function runBoot(){
var art=[
'█   █ █████ █████',
'█   █   █     █ ',
'█ █ █   █    █  ',
'█ █ █   █   █   ',
'█ █ █   █  █    ',
'█ █ █   █ █     ',
' █ █    █ █████'
];
var artEl=document.getElementById('btArt'),tyEl=document.getElementById('btTy'),lnEl=document.getElementById('btLines');
var lines=[
{t:'调取 ROOT 索引',s:'ok'},
{t:'挂载个人档案',s:'ok'},
{t:'挂载守夜人论坛',s:'ok'},
{t:'云端握手',s:'ok'},
{t:'密钥库',s:'lk'},
{t:'启动渲染',s:'ok'}
];
var p=0,barIv,done=0;
function rc(){var s='▓▒░█▄▀■□#@%&+=~';return s[Math.floor(Math.random()*s.length)]}
/* 1. 字符风暴 */
artEl.innerHTML='';
var si=setInterval(function(){
  var h='';
  for(var i=0;i<6;i++){
    var r='';
    for(var j=0;j<46;j++)r+=Math.random()<.26?rc():' ';
    h+='<div class="al st">'+r+'</div>';
  }
  artEl.innerHTML=h;
},42);
setTimeout(function(){
  clearInterval(si);artEl.innerHTML='';
  /* 2. ASCII 逐字 */
  art.forEach(function(row,ri){
    setTimeout(function(){
      var d=document.createElement('div');d.className='al';artEl.appendChild(d);
      var ci=0,iv=setInterval(function(){
        d.textContent=row.slice(0,++ci);
        if(ci>=row.length)clearInterval(iv);
      },16);
    },280+ri*85);
  });
},500);
/* 3. 打字机标题 */
var ty='WTZ // 个人网站',ti=0;
setTimeout(function(){
  tyEl.innerHTML='';
  var iv=setInterval(function(){
    tyEl.textContent=ty.slice(0,++ti);
    if(ti>=ty.length){clearInterval(iv);tyEl.innerHTML=ty+'<span class="cu">▮</span>'}
  },44);
},1150);
/* 4. 挂载日志：滑入 + 状态翻转 */
lines.forEach(function(L,i){
  setTimeout(function(){
    var d=document.createElement('div');d.className='bl';
    var dots=Array(Math.max(1,30-L.t.length-8)).join('.');
    d.innerHTML='> '+L.t+' '+dots+' <span class="st">...</span>';
    lnEl.appendChild(d);
    var st=d.querySelector('.st');
    setTimeout(function(){
      st.textContent='[ '+L.s.toUpperCase()+' ]';
      st.className='st '+(L.s==='ok'?'ok':L.s==='warn'?'warn':'lk');
      d.classList.add('on');
    },340);
    done++;
    if(done>=lines.length){p=100;bP.textContent='100%';bBar.style.width='100%';setTimeout(flip,480)}
  },1650+i*250);
});
/* 5. 进度分段跳跃 */
var seg=[16,34,52,70,84,94,97],sc=0;
barIv=setInterval(function(){
  if(p>=100){clearInterval(barIv);return}
  if(p>=seg[sc])sc++;
  p=seg[Math.min(sc,seg.length-1)]||97;
  if(p===97&&done<lines.length)p=94;
  bP.textContent=p+'%';bBar.style.width=p+'%';
},200);
/* 6. glitch + 3D 翻转转场 */
function flip(){
  clearTimeout(bail);clearInterval(barIv);
  var b=document.getElementById('boot');if(!b)return;
  b.classList.add('gl');
  var bt=b.querySelector('.bt');if(bt)bt.classList.add('flip');
  setTimeout(hideBoot,940);
}
var bail=setTimeout(flip,5600);
boot.addEventListener('click',flip);
boot.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}});
}
var _bk='';try{_bk=sessionStorage.getItem('wzBoot')}catch(e){}
if(_bk==='1'||(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
boot.style.display='none';document.body.classList.add('ready');
}else{runBoot();}
function clk(){
var d=new Date(),f=function(n){return(n<10?'0':'')+n};
document.getElementById('clock').textContent=f(d.getHours())+':'+f(d.getMinutes())+':'+f(d.getSeconds());
}
setInterval(clk,1000);clk();
(function(){try{
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var cd=document.querySelectorAll('.grid .card,.grid3 .card');
for(var i=0;i<cd.length;i++){cd[i].style.setProperty('--i',String(i));cd[i].addEventListener('animationend',function(){this.style.animation='none'},{once:true});}
var bh=document.querySelectorAll('.b-head');
if('IntersectionObserver' in window&&!RM){
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.08});
  bh.forEach(function(e){e.classList.add('rv');io.observe(e)});
}else{bh.forEach(function(e){e.classList.add('rv','in')});}
if(!RM&&window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  cd.forEach(function(c){
    c.addEventListener('pointermove',function(e){
      var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform='perspective(760px) rotateX('+(-y*3.4).toFixed(2)+'deg) rotateY('+(x*3.4).toFixed(2)+'deg) translateY(-4px)';
    });
    c.addEventListener('pointerleave',function(){c.style.transform=''});
  });
}
}catch(e){}})();


(function(){try{
var K='prts_vn',N='prts_vc',g=function(k){try{return localStorage.getItem(k)}catch(e){return null}};
var nm=g(K),c=(g(N)?parseInt(g(N),10):0)+1;
try{localStorage.setItem(N,String(c))}catch(e){}
var v=document.getElementById('vinput'),b=document.getElementById('vbtn'),l=document.getElementById('vlabel');
function done(){l.textContent='VISITOR // '+(nm||'未命名')+' · 第'+c+'次访问本站';if(v)v.style.display='none';if(b)b.style.display='none';var bx=document.getElementById('vbox');if(bx){bx.style.cursor='pointer';bx.title='点击修改名字'}}
if(nm){done();return}
if(b)b.addEventListener('click',function(){var x=v?v.value.trim():'';if(!x)return;try{localStorage.setItem(K,x)}catch(e){}nm=x;done()});
if(v)v.addEventListener('keydown',function(e){if(e.key==='Enter'&&b)b.click()});
}catch(e){}})();


(function(){
var k='wtz_vn',kc='wtz_vc',n=localStorage.getItem(k);
function esc(s){return String(s==null?'':s).replace(/[<>&"']/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]})}
function upd(){
var c=localStorage.getItem(kc)||0,el=document.querySelectorAll('.site-stat');
for(var i=0;i<el.length;i++)el[i].innerHTML='SITE // VISITOR '+(n?esc(n):'GUEST')+' · '+c+' VISITS · <span id="busuanzi_value_site_pv">0</span> VIEWS · <span id="busuanzi_value_site_uv">0</span> VISITORS';
}
function ask(){
var m=document.createElement('div'),b=document.createElement('div');
m.style.cssText='position:fixed;inset:0;z-index:999;background:rgba(5,7,8,.78);display:flex;align-items:center;justify-content:center';
b.style.cssText='background:#11151A;border:1px solid rgba(63,224,200,.35);padding:26px 30px;max-width:340px;width:86%;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.5)';
var t=document.createElement('p');t.textContent='输入你的名字以登记访问';t.style.cssText='color:#E6EDEF;font-size:15px;letter-spacing:.12em;margin-bottom:14px';
var s=document.createElement('p');s.textContent='此名字仅保存在你的浏览器';s.style.cssText='color:#66767A;font-size:11px;letter-spacing:.1em;margin-bottom:14px';
var i=document.createElement('input');i.placeholder='访客昵称';i.maxLength=14;i.style.cssText='width:100%;background:#0A0C0E;border:1px solid rgba(63,224,200,.3);color:#E6EDEF;padding:10px 12px;font-size:14px;outline:none;text-align:center';
var ok=document.createElement('button');ok.textContent='登 记';ok.style.cssText='margin-top:14px;width:100%;padding:10px;border:1px solid #3FE0C8;color:#3FE0C8;background:rgba(63,224,200,.08);font-size:13px;letter-spacing:.3em;cursor:pointer';
b.appendChild(t);b.appendChild(s);b.appendChild(i);b.appendChild(ok);m.appendChild(b);document.body.appendChild(m);i.focus();
function done(){var v=i.value.replace(/^\s+|\s+$/g,'');if(!v){i.style.borderColor='#FF5C7A';return}localStorage.setItem(k,v);n=v;document.body.removeChild(m);upd()}
ok.onclick=done;i.onkeydown=function(e){if(e.key==='Enter')done();if(e.key==='Escape')document.body.removeChild(m)};
}
(function(){var c=+(localStorage.getItem(kc)||0)+1;localStorage.setItem(kc,c);
var el=document.querySelectorAll('.site-stat');
for(var i=0;i<el.length;i++)el[i].style.cursor='pointer';
if(!n){ask()}else{upd()}
document.addEventListener('click',function(e){var t=e.target;while(t){if(t&&t.className&&(' '+t.className+' ').indexOf(' site-stat ')>-1){ask();return}t=t.parentNode}});
})();
})();


/* ==== v2.9 每日一言 ==== */
(function(){
  var Q=[
    '代码即剑，终端即鞘',
    '夜已深，守夜人仍在值守',
    '权限不是身份，是责任',
    '圣山在脚下，深渊在身后',
    '每次签到，都是与自己的约定',
    '数据不会说谎，人才会',
    '黑白之外，还有第三种颜色：你的选择',
    '种子按时间生成，命运按选择展开',
    '日志记录过去，代码书写未来',
    '风控是一把刀，管理员是握刀的人',
    '离线不等于失联，缓存也是记忆',
    '留言板是时间的回声',
    '当你凝视终端，终端也在凝视你',
    '路虽远，行则将至',
    '每一个 BUG 都是未被发现的真相',
    '守护者不追求被记住，只追求被需要',
    '代码无注释，但心有批注',
    '凌晨的服务器最安静',
    '世界树半枯，但根系仍深',
    '你的每一次点击，都算数',
    '程序员的浪漫：把 Bug 修成 Feature',
    '代码能跑就行，别问为什么',
    '0 和 1 之间，藏着程序员的一生',
    '世界上只有两种语言：被骂的语言和没人用的语言',
    '这个 Bug 不是改出来的，是长出来的',
    '删库跑路前，记得先 commit',
    'Ctrl+S 是程序员的安全感来源',
    '写注释的人已经离职了，代码是考古现场',
    '报错不可怕，可怕的是报错之后一切正常',
    '变量名是程序员的最后尊严',
    '能复制粘贴，绝不手打',
    'Stack Overflow 是第二大脑',
    '我的代码有 99 个 Bug，但修一个送两个',
    '需求天天变，架构从没变——崩了',
    '「这个需求很简单」是程序员听过最大的谎话',
    '0 个 Bug？那说明还没跑',
    '写代码五分钟，找 Bug 五小时',
    '永恒循环：改一个 Bug，引入三个 Bug',
    '程序员解决问题的方式：重启',
    '用户说「很快就好」= 三天后',
    '半成品也能跑，这叫敏捷开发',
    '测试环境一切正常，生产环境当场去世',
    '代码评审：专业找茬大赛',
    'Deadline 是第一生产力，DDL 也是',
    '递归的含义：你调用你，你崩溃你',
    '缓存失效的瞬间，是世界的真实面目',
    '程序员的键盘，只有 F5 是新的',
    'if 不会写，else 不会写，只会 printf 全世界',
    '跑不起来？试试把电脑举高高',
    'NULL 不是没有，是「这里本来就没东西」',
    'while(true) 是程序员的浪漫循环',
    '面向对象编程：万物皆对象，包括 Bug',
    'Exception 吞掉的是程序员的头发',
    '「在我的机器上能跑」是万能的',
    '代码越短，Bug 越长',
    '花十分钟写代码，花一小时想变量名',
    '一次 Write，终身 Debug',
    '程序员的三重境界：能用、好用、能看',
    'Git 是后悔药，commit 是处方',
    'Bug 不是错误，是提示：该下班了'
  ];
  var el=$('qotd');
  if(el){
    var show=function(){ el.innerHTML='[ 语录 ] ▸ <b>'+esc(Q[Math.floor(Math.random()*Q.length)])+'</b>'; };
    show();
    el.addEventListener('click',show);
  }
})();
/* ==== v2.9 审计 + 数据面板 ==== */
(function(){
  var isAdmin=function(){ return S.user&&S.user.is_admin; };
  function dl(fn,txt){
    var a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));
    a.download=fn; a.click();
  }
  var audBtn=$('gb_aud_btn'),staBtn=$('gb_sta_btn'),audCls=$('gb_aud_close');
  if(audBtn) audBtn.addEventListener('click',function(){
    var A=$('gb_aud'),S2=$('gb_sta');
    A.style.display=A.style.display==='none'?'block':'none';
    audCls.style.display=A.style.display;
    if(S2) S2.style.display='none';
    if(A.style.display==='block') audRefresh();
  });
  if(staBtn) staBtn.addEventListener('click',function(){
    var A=$('gb_aud'),S2=$('gb_sta');
    S2.style.display=S2.style.display==='none'?'block':'none';
    audCls.style.display=S2.style.display;
    if(A) A.style.display='none';
    if(S2.style.display==='block') staRefresh();
  });
  var staRef=$('gb_sta_ref');
  if(staRef) staRef.addEventListener('click',function(){ staRefresh(); });
  if(audCls) audCls.addEventListener('click',function(){
    var A=$('gb_aud'),S2=$('gb_sta');
    if(A) A.style.display='none'; if(S2) S2.style.display='none';
    audCls.style.display='none';
  });
  function audRefresh(){
    var L=$('gb_aud_list'),T=$('gb_aud_total'),D=$('gb_aud_date');
    if(!L) return;
    L.innerHTML='加载中…';
    var curD=D?D.value:'';
    call('/audit_get',{date:curD}).then(function(j){
      if(!j||!j.ok){ L.innerHTML='无权限或加载失败'; return; }
      T.textContent='共 '+j.total+' 条'+(curD?' · 归档 '+curD:' · 今天');
      if(D){
        var cur=D.value;
        D.innerHTML='<option value="">今天</option>'+((j.archives||[]).map(function(d){return '<option value="'+d+'"'+(d===cur?' selected':'')+'>'+d+'</option>';}).join(''));
        D.value=cur;
      }
      var arr=j.list||[];
      if(!arr.length){ L.innerHTML='<div style="color:var(--ink3)">暂无操作记录</div>'; return; }
      L.innerHTML=arr.map(function(x){
        return '<div style="border-bottom:1px dashed var(--line);padding:3px 0"><span style="color:var(--accent)">'+esc(x.who||'')+'</span> <span style="color:var(--ink2)">'+esc(x.act||'')+'</span> → '+esc(x.target||'')+'<div style="color:var(--ink3);font-size:10px">'+esc(x.t||'')+' · '+esc(x.detail||'')+'</div></div>';
      }).join('');
    }).catch(function(e){ L.innerHTML='加载失败 · '+esc(ferr(e.message)); });
  }
  var ad=$('gb_aud_date');
  if(ad) ad.addEventListener('change',function(){ audRefresh(); });
  var bak=$('gb_bak_btn');
  if(bak) bak.addEventListener('click',function(){
    if(!S.user) return say('请先登录',false);
    say('正在打包全站数据…',true);
    call('/backup',{}).then(function(j){
      if(!j||!j.ok) return say((j&&j.msg)||'备份失败',false);
      var a=document.createElement('a');
      a.href='data:application/zip;base64,'+j.data;
      a.download='wtz-backup-'+new Date().toISOString().slice(0,10)+'.zip';
      a.click();
      say('已备份 '+j.files+' 个数据文件 · '+Math.max(1,Math.round(j.size/1024))+'KB',true);
    }).catch(function(e){ say('备份失败：'+ferr(e.message),false); });
  });
  var meb=$('gb_me_btn');
  if(meb) meb.addEventListener('click',function(){
    if(!S.user) return say('请先登录',false);
    call('/export_me',{}).then(function(j){
      if(!j||!j.ok) return say((j&&j.msg)||'导出失败',false);
      var a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([JSON.stringify(j.data,null,1)],{type:'application/json'}));
      a.download=S.user.username+'-data-'+new Date().toISOString().slice(0,10)+'.json';
      a.click();
      say('已导出 '+S.user.username+' 的个人数据',true);
    }).catch(function(e){ say('导出失败：'+ferr(e.message),false); });
  });
  var aj=$('gb_aud_json'),ac=$('gb_aud_csv');
  if(aj) aj.addEventListener('click',function(){
    var cd=ad?ad.value:'';
    call('/audit_export',{fmt:'json',date:cd}).then(function(j){ if(j&&j.ok) dl(cd?('audit_'+cd+'.json'):'audit_log.json',JSON.stringify(j.data,null,1)); });
  });
  if(ac) ac.addEventListener('click',function(){
    var cd=ad?ad.value:'';
    call('/audit_export',{fmt:'csv',date:cd}).then(function(j){ if(j&&j.ok) dl(cd?('audit_'+cd+'.csv'):'audit_log.csv',j.data); });
  });
  function svgLine(vals,labels,W,H,opt){
    var mx=Math.max.apply(null,vals.concat([1])),pts=[],st=W/(vals.length-1||1);
    for(var i=0;i<vals.length;i++) pts.push((4+i*st).toFixed(1)+','+(H-10-(vals[i]/mx)*(H-24)).toFixed(1));
    var grid='',G=opt||{},ga=G.grid==null?4:G.grid;
    for(var i2=1;i2<ga;i2++){ var yy=(H-10-(i2/ga)*(H-24)).toFixed(1); grid+='<line x1="0" y1="'+yy+'" x2="'+W+'" y2="'+yy+'" stroke="#222" stroke-width="1"/>'; }
    var area='0,'+(H-10)+' '+pts.join(' ')+' '+W+','+(H-10);
    return '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;display:block">'+grid+
      '<polygon points="'+area+'" fill="'+esc(G.c||'#E8E8E8')+'" opacity=".07"/>'+
      '<polyline points="'+pts.join(' ')+'" fill="none" stroke="'+(G.c||'#E8E8E8')+'" stroke-width="1.8"/>'+
      pts.map(function(pt,i3){ var c=pt.split(','); return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="2.4" fill="'+(G.c||'#E8E8E8')+'"/>'; }).join('')+
      '<g font-size="8" fill="#66767A">'+labels.map(function(lb,i4){ return '<text x="'+(4+i4*st-8).toFixed(0)+'" y="'+(H-2)+'">'+esc(String(lb).slice(5))+'</text>'; }).join('')+'</g></svg>';
  }
  function staRefresh(){
    var T=$('gb_sta_tot'),D=$('gb_sta_trend'),H2=$('gb_sta_hours');
    if(!D) return;
    T.innerHTML='<div style="color:var(--ink3)">载入中…</div>'; D.innerHTML=''; H2.innerHTML='';
    call('/stats2',{}).then(function(j){
      if(!j||!j.ok){ T.innerHTML='<div style="color:var(--bad)">无权限或加载失败</div>'; return; }
      var t=j.total||{};
      var cards=[['用户',t.users],['留言',t.guests],['帖子',t.posts],['评论',t.comments||0],['点赞',t.likes||0],['私信',t.pms||0],['访问',t.visits],['在线',j.online||0]];
      T.innerHTML='<div class="gb-sta-cards">'+cards.map(function(c){ return '<div class="gb-sta-card"><b>'+c[1]+'</b><span>'+c[0]+'</span></div>'; }).join('')+'</div>'+
        '<div class="gb-sta-today">今日 · 留言 <b>'+t.todayG+'</b> · 注册 <b>'+t.todayR+'</b> · 帖子 <b>'+t.todayP+'</b> · 累计访问 <b>'+t.visits+'</b></div>';
      D.innerHTML='<div style="font-size:11px;color:var(--ink3);letter-spacing:.12em;margin-bottom:4px">近 7 天 · <span style="color:#E8E8E8">■ 留言</span> · <span style="color:#FFC24B">■ 注册</span></div>'+
        svgLine(j.gday,j.days,320,84,{c:'#E8E8E8'})+
        svgLine(j.rday,j.days,320,84,{c:'#FFC24B',grid:3})+
        '<div style="font-size:11px;color:var(--ink3);letter-spacing:.12em;margin:10px 0 4px">用户增长（累计） · <span style="color:#2EE6A8">■</span></div>'+
        svgLine(j.cum,j.days,320,84,{c:'#2EE6A8',grid:4});
      var mx=Math.max.apply(null,j.hours.concat([1])),hb='';
      for(var i=0;i<24;i++){
        var hh=Math.round((j.hours[i]/mx)*56);
        hb+='<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1" title="'+i+' 时 · '+j.hours[i]+' 条"><div style="height:'+hh+'px;width:7px;background:'+(hh?'var(--accent)':'#262626')+';opacity:'+(hh?'.9':'.5')+'"></div><span style="font-size:8px;color:var(--ink3)">'+i+'</span></div>';
      }
      H2.innerHTML='<div style="font-size:11px;color:var(--ink3);letter-spacing:.12em;margin-bottom:4px">留言活跃时段（24h · 悬停看数值）</div><div style="display:flex;align-items:flex-end;gap:2px;border-bottom:1px solid var(--line);padding-bottom:2px">'+hb+'</div>';
      var tu=j.topUsers||[],tg=j.topGuests||[];
      var topU=tu.map(function(x,i){
        var w=tu[0]&&tu[0].n?Math.round((x.n/tu[0].n)*100):0;
        return '<div class="gb-sta-row"><span>'+esc(x.name)+'</span><div class="gb-sta-bar"><i style="width:'+w+'%"></i></div><b>'+x.n+'</b></div>';
      }).join('')||'<div style="color:var(--ink3);font-size:11px">暂无</div>';
      var topG=tg.map(function(x,i){
        var m0=tg[0]?tg[0].likes:1,w=Math.min(100,Math.round((x.likes/m0)*100));
        return '<div class="gb-sta-row" title="'+esc(x.user)+'"><span>'+esc((x.text.length>14?x.text.slice(0,14)+'…':x.text))+'</span><div class="gb-sta-bar g"><i style="width:'+w+'%"></i></div><b>'+x.likes+' ♥</b></div>';
      }).join('')||'<div style="color:var(--ink3);font-size:11px">暂无</div>';
      H2.innerHTML+='<div style="font-size:11px;color:var(--ink3);letter-spacing:.12em;margin:10px 0 4px">近 7 天活跃用户 Top</div>'+topU+
        '<div style="font-size:11px;color:var(--ink3);letter-spacing:.12em;margin:10px 0 4px">最热留言 Top</div>'+topG;
    }).catch(function(e){ T.innerHTML='<div style="color:var(--bad)">加载失败 · '+esc(ferr(e.message))+'</div>'; });
  }
  window.audRefresh=audRefresh; window.staRefresh=staRefresh;
})();
/* ==== v2.9 PWA ==== */
(function(){
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(function(){});
  }
})();


(function(){
function ga(){try{var u=localStorage.getItem('gb_api_url')||'',a=(u||'').split('\n').filter(function(x){return x.indexOf('http')===0&&x.indexOf('36c3116e')<0});return a[0]||''}catch(e){return''}}
function norm(s){try{var m=decodeURIComponent(location.pathname.split('/')).pop().split('?')[0];return m}catch(e){return''}}
(function(){try{var m=location.pathname.split('/').pop().split('?')[0]||'',MAP={'index.html':'index','守夜人论坛.html':'forum','卡塞尔学院官网.html':'cassel','changelog.html':'chg','终端接口.html':'term','PRTS泰拉大典终端.html':'prts','prts.html':'prts','莱茵生命终端.html':'rhine','技能树.html':'skill','模组开发.html':'mod','解码器.html':'dec'};if(m===''||m==='wtz-YEE.github.io')m='index.html';var k=MAP[m];if(k)localStorage.setItem('wz_map_'+k,'1')}catch(e){}})();
(function(){var m=norm(),a=document.querySelectorAll('#wNav a[data-w]');for(var i=0;i<a.length;i++){var t=a[i].getAttribute('data-w'),hit=false;if(t==='index'&&(m==='index.html'||m===''||m==='wtz-YEE.github.io'))hit=true;else if(t==='forum'&&m.indexOf('守夜人论坛')===0)hit=true;else if(t==='cassel'&&m.indexOf('卡塞尔学院')===0)hit=true;else if(t==='chg'&&m.indexOf('changelog')===0)hit=true;if(hit)a[i].classList.add('cur')}})();
var upd=document.getElementById('wNavUpd');
if(upd)upd.addEventListener('click',function(){
  var o=upd.textContent;upd.textContent='检查中…';
  fetch('https://api.github.com/repos/wtz-YEE/wtz-YEE.github.io/commits/main',{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){
    var sha=String(j.sha||'').slice(0,7);var cur=localStorage.getItem('wtz_site_sha')||'';var msg;
    if(!cur){localStorage.setItem('wtz_site_sha',sha);msg='已记录当前版本 '+sha+'，下次点击可检测更新'}
    else if(sha===cur){msg='已是最新版本（'+sha+'）'}
    else{localStorage.setItem('wtz_site_sha',sha);try{window.cleanLegacy&&window.cleanLegacy()}catch(e){}msg='发现新版本 '+sha+'（本地 '+cur+'）· 已清理旧版本缓存，请刷新页面获取更新'}
    upd.textContent=o;alert(msg);
  }).catch(function(e){upd.textContent=o;alert('检查更新失败：'+(typeof ferr==='function'?ferr(e.message):e.message))});
});
var dot=document.getElementById('wNavDot');if(!dot)return;
function chk(){var a=ga();if(!a){dot.className='w-dot off';dot.title='未配置云端 · 点击检测';return}
fetch(a+'/health',{mode:'cors',cache:'no-store'}).then(function(r){dot.className=r.ok?'w-dot on':'w-dot bad';dot.title='云端在线 · '+a}).catch(function(){dot.className='w-dot bad';dot.title='云端离线 · '+a})}
dot.addEventListener('click',chk);chk();setInterval(chk,30000);
})();


(function(){
  var g=document.getElementById('wzGuide');
  if(!g) return;
  var done=0; try{ done=parseInt(localStorage.getItem('wz_guided')||'0',10); }catch(e){}
  if(done) return;
  var steps=[
    ['接入 · 账号','这里是 wtz 的个人网站。登录/注册后，你便可留言、私聊、发帖、玩小游戏、攒成就与经验。门楣上的两位站长（wtz 与 清久感冒灵）握有最高权限。'],
    ['探索 · 入口','顶部卡片通往四大区域：PRTS 档案室、守夜人论坛、卡塞尔学院、终端接口（32 款小游戏）。你的配色、界面主题、头像与备忘录会自动云端同步到每个设备。'],
    ['权限 · 成长','经验升级 LV、连续签到积累记录；成就分基础与隐藏两类，隐藏成就不会公开。成就满 30 项或解锁 2048 彩蛋后，还有「与作者对战」等待挑战。']
  ];
  var QUICK=['积分怎么获得','怎么升级','第一次来该做什么','世界碎片是什么','有哪些小游戏'];
  var i=0;
  function base(){
    try{
      var u=localStorage.getItem('gb_api_url')||'';
      var a=(u||'').split('\n').filter(function(x){return x.indexOf('http')===0&&x.indexOf('36c3116e')<0});
      return (a[0]||'').replace(/\/+$/,'');
    }catch(e){return''}
  }
  function ask(q){
    var out=document.getElementById('wzGAns');if(!out||!q)return;
    out.style.display='';
    out.innerHTML='<div class="wz-a-q">你：'+esc(q)+'</div><div class="wz-a-a" id="wzGAnsBody">诺玛正在检索档案 …</div>';
    var b=base();
    if(!b){
      document.getElementById('wzGAnsBody').textContent='云端未连接，现在无法回答。登录后下面这些问题会更有用。';
      return;
    }
    fetch(b+'/noma_ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q:q,mode:'norna'})})
      .then(function(r){return r.json()})
      .then(function(j){
        var el=document.getElementById('wzGAnsBody');if(!el)return;
        el.textContent=(j&&j.a)?j.a:'这条档案里没有记录。试试换个说法，或者点上面的按钮直接进对应页面。';
      })
      .catch(function(){
        var el=document.getElementById('wzGAnsBody');if(el)el.textContent='诺玛暂时联系不上（云端不可达）。';
      });
  }
  function show(){
    var st=steps[i];
    var quick=QUICK.map(function(q){return '<button type="button" class="wz-q" data-q="'+esc(q)+'">'+esc(q)+'</button>'}).join('');
    document.getElementById('wzGBody').innerHTML=
      '<div class="wz-guide-n">0'+(i+1)+' / 0'+steps.length+'</div>'+
      '<div class="wz-guide-t">'+st[0]+'</div>'+
      '<div class="wz-guide-d">'+st[1]+'</div>'+
      '<div class="wz-ask">'+
        '<div class="wz-ask-h">问诺玛 · 卡塞尔学院中央电脑（本站助手）</div>'+
        '<div class="wz-qk">'+quick+'</div>'+
        '<div class="wz-ask-r"><input id="wzGQ" maxlength="40" placeholder="想了解本站什么？例如：积分怎么获得"><button type="button" id="wzGAsk">提问</button></div>'+
        '<div id="wzGAns" class="wz-ans" style="display:none"></div>'+
      '</div>';
    var dots=''; for(var k=0;k<steps.length;k++) dots+=(k<=i?'●':'○');
    document.getElementById('wzGDot').textContent=dots;
    document.getElementById('wzGNext').textContent=(i===steps.length-1)?'进入站点':'下一步';
  }
  function fin(){ try{ localStorage.setItem('wz_guided','1'); }catch(e){} g.style.display='none'; }
  g.addEventListener('click',function(e){
    var qb=e.target.closest?e.target.closest('[data-q]'):null;
    if(qb){ask(qb.getAttribute('data-q'));return}
    if(e.target&&e.target.id==='wzGAsk'){
      var inp=document.getElementById('wzGQ');
      ask(inp?inp.value.trim():'');
    }
  });
  g.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&e.target&&e.target.id==='wzGQ'){
      e.preventDefault();
      var inp=document.getElementById('wzGQ');
      ask(inp?inp.value.trim():'');
    }
  });
  show();
  g.style.display='flex';
  var nx=document.getElementById('wzGNext'),cl=document.getElementById('wzGClose'),mk=document.getElementById('wzGuideMask');
  if(nx) nx.addEventListener('click',function(){ i++; if(i>=steps.length){ fin(); return; } show(); });
  if(cl) cl.addEventListener('click',fin);
  if(mk) mk.addEventListener('click',fin);
})();


/* ===== 世界碎片收集（各页共用） ===== */
(function(){
if(document.getElementById('fragBtn'))return;
var R={1:'一切的起点，也是终点的入口。',2:'先有这片大地，才有后续所有故事。',3:'守夜的人，总在深夜交换消息。',4:'一所学院，只录取「能看见」的人。',5:'最旧的街机，第八号。',6:'指挥官的第一台终端。',7:'这里说的每句话，都不该被第三个人听见。',8:'数字碎了一地，等你去拼。',9:'第一只恐龙，还在横版里跑。',10:'格子合到 2048，它就出现。',11:'有人在问路明非是谁。',12:'S 级的编号，被刮掉了。',13:'签名处是空的——你还没签。',14:'标签写着请勿摇晃，它被摇过。',15:'一条点亮过的分支。',16:'注释里写着「这里应该能跑」。',17:'第一页只有一句：泰拉没有真相。',18:'播报员念到一半停了电。',19:'某个名字被涂掉了，笔画还在。',20:'你迷路时，它也迷路了。',21:'它不发光，只是把光借给你。',22:'拿到它的人会先愣一会儿。'};
var NM={1:'起始之屑',2:'大地之屑',3:'守夜之屑',4:'学院之屑',5:'街机之屑',6:'指挥之屑',7:'密语之屑',8:'解码之屑',9:'恐龙之屑',10:'方格之屑',11:'迷名之屑',12:'血统之屑',13:'契约之屑',14:'摇晃之屑',15:'分支之屑',16:'模组之屑',17:'泰拉之屑',18:'停电之屑',19:'涂名之屑',20:'迷路之屑',21:'借光之屑',22:'愣神之屑'};
var SR={1:'index',2:'prts',3:'守夜人论坛',4:'卡塞尔学院官网',5:'游戏-08',6:'终端接口',7:'机密终端',8:'解码器',9:'游戏-01',10:'游戏-02',11:'游戏-03',12:'游戏-04',13:'游戏-05',14:'莱茵生命终端',15:'技能树',16:'模组开发',17:'PRTS泰拉大典终端',18:'changelog',19:'guestwall',20:'404',21:'游戏-06',22:'游戏-07'};
var D={1:'从罗德岛甲板缝里扫出来的，编号 001。',2:'上面只有一句话：活着回来。',3:'火把灭了，巡夜还没结束。',4:'字迹在你不看的时候会换位置。',5:'照片被人用马克笔画了胡子。',6:'有效期：直到你不需要它为止。',7:'背面写着「忘了就跑 gen_keys.py」。',8:'它一直想变成 4096。',9:'它跳了一整天，没撞到任何东西。',10:'它咬到了自己，然后学会了穿墙。',11:'「今天又有人问我路明非是谁。」',12:'背面刻着 S 级血统的编号，被人刮掉了。',13:'签名处是空的——你还没签。',14:'标签写着「请勿摇晃」，然后被人摇晃过。',15:'它曾经是一条点亮的分支。',16:'注释里写着「这里应该能跑」，不能。',17:'第一页只有一句：泰拉没有真相。',18:'播报员念到一半停了电。',19:'某个名字被涂掉了，但笔画还在。',20:'夹在一本没人借过的书里。',21:'它不发光，只是把光借给了你。',22:'拿到它的人，会先愣一会儿。'};
var MAP={'index.html':1,'':1,'守夜人论坛.html':3,'卡塞尔学院官网.html':4,'终端接口.html':6,'机密终端.html':7,'PRTS泰拉大典终端.html':17,'prts.html':2,'莱茵生命终端.html':14,'技能树.html':15,'模组开发.html':16,'解码器.html':8,'guestwall.html':19,'changelog.html':18,'404.html':20,'游戏-01.html':9,'游戏-02.html':10,'游戏-03.html':11,'游戏-04.html':12,'游戏-05.html':13,'游戏-06.html':21,'游戏-07.html':22,'游戏-08.html':5};
function pageFile(){try{var m=decodeURIComponent(location.pathname.split('/').pop().split('?')[0]);if(m==='wtz-YEE.github.io'||m==='')m='index.html';return m}catch(e){return'index.html'}}
var N=MAP[pageFile()]||0;
function got(){try{var a=JSON.parse(localStorage.getItem('wz_frag2')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function gotN(){var a=got(),r=[];for(var i=0;i<a.length;i++){r.push(typeof a[i]==='object'&&a[i]?a[i].n:a[i])}return r}
function gotT(n){var a=got();for(var i=0;i<a.length;i++){var x=a[i];if((typeof x==='object'&&x&&x.n===n)||x===n)return(typeof x==='object'&&x&&x.t)?x.t:''}return''}
function setGot(a){try{localStorage.setItem('wz_frag2',JSON.stringify(a))}catch(e){}}
function pad2(n){return(n<10?'0':'')+n}
function todayStr(){var d=new Date();return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())}
window.apiBase=function apiBase(){try{var u=localStorage.getItem('gb_api_url')||'';var a=(u||'').split('\n').filter(function(x){return x.indexOf('http')===0&&x.indexOf('36c3116e')<0});return (a[0]||'').replace(/\/+$/,'')}catch(e){return''}}
function sync(n){var s=null;try{s=JSON.parse(localStorage.getItem('gb_session')||'null')}catch(e){};if(!s||!s.token)return;var b=apiBase();if(!b)return;try{fetch(b+'/frag_get',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:s.token,n:n})}).catch(function(){})}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
window.toast=function toast(txt,sub){
  var d=document.createElement('div');
  d.innerHTML='<b style="display:block;letter-spacing:.14em">'+esc(txt)+'</b>'+(sub?'<span style="display:block;margin-top:6px;color:#9a9a9a;font-size:11.5px">'+esc(sub)+'</span>':'');
  d.style.cssText='position:fixed;left:50%;bottom:96px;transform:translate(-50%,14px);opacity:0;z-index:2147483000;background:rgba(8,10,12,.96);border:1px solid var(--accent,#fff);color:var(--accent,#fff);padding:12px 22px;font-family:Consolas,monospace;font-size:12.5px;text-align:center;pointer-events:none;max-width:82vw;line-height:1.8;transition:transform .3s cubic-bezier(.22,1,.36,1),opacity .3s';
  document.body.appendChild(d);
  requestAnimationFrame(function(){requestAnimationFrame(function(){d.style.transform='translate(-50%,0)';d.style.opacity='1'})});
  setTimeout(function(){d.style.transition='opacity .6s';d.style.opacity='0'},2400);
  setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d)},3100);
}
window.fragFx=function(x,y){
  var i,col;
  try{col=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#fff'}catch(e){col='#fff'}
  try{var A=window.__ac||(window.__ac=new(window.AudioContext||window.webkitAudioContext)());if(A.state==='suspended')A.resume();var t=A.currentTime,o=A.createOscillator(),g=A.createGain();o.type='triangle';o.frequency.setValueAtTime(520,t);o.frequency.exponentialRampToValueAtTime(1240,t+.12);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);g.connect(A.destination);o.start(t);o.stop(t+.32)}catch(e){}
  for(i=0;i<16;i++){(function(i){var d=document.createElement('div');var ang=Math.random()*6.283,sp=45+Math.random()*140;d.style.cssText='position:fixed;left:'+(x||0)+'px;top:'+(y||0)+'px;width:'+(3+Math.random()*4)+'px;height:'+(3+Math.random()*4)+'px;background:'+col+';border-radius:50%;pointer-events:none;z-index:2147483500;transition:transform .65s cubic-bezier(.1,.8,.3,1),opacity .65s';document.body.appendChild(d);requestAnimationFrame(function(){d.style.transform='translate('+Math.cos(ang)*sp+'px,'+(Math.sin(ang)*sp-70)+'px)';d.style.opacity='0'});setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d)},700)})(i)}
  var f=document.createElement('div');f.style.cssText='position:fixed;inset:0;z-index:2147483400;background:'+col+';opacity:.30;pointer-events:none;transition:opacity .5s';document.body.appendChild(f);requestAnimationFrame(function(){f.style.opacity='0'});setTimeout(function(){if(f.parentNode)f.parentNode.removeChild(f)},560);
};
window.fragBadge=function(){
  var ac='#fff';try{ac=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#fff'}catch(e){}
  var cv=document.createElement('canvas');cv.width=512;cv.height=512;
  var x=cv.getContext('2d');
  x.fillStyle='#0d0f11';x.fillRect(0,0,512,512);
  x.strokeStyle=ac;x.lineWidth=5;
  x.beginPath();x.arc(256,256,204,0,6.283);x.stroke();
  x.lineWidth=2;x.beginPath();x.arc(256,256,160,0,6.283);x.stroke();
  x.save();x.translate(256,196);x.rotate(Math.PI/4);x.fillStyle=ac;x.fillRect(-24,-24,48,48);x.restore();
  x.fillStyle=ac;x.textAlign='center';x.font='bold 24px Consolas,monospace';
  x.fillText('WTZ 守夜收集者',256,306);
  x.font='14px Consolas,monospace';x.fillStyle='#9aa6ad';
  x.fillText('WORLD FRAGMENTS 22 / 22',256,338);
  x.font='12px Consolas,monospace';x.fillStyle='#6a767d';
  var d=new Date();x.fillText(d.getFullYear()+'-'+((d.getMonth()+1<10?'0':'')+(d.getMonth()+1))+'-'+((d.getDate()<10?'0':'')+d.getDate()),256,366);
  var url=cv.toDataURL('image/png');
  var a=document.createElement('a');a.href=url;a.download='WTZ-collector-badge.png';document.body.appendChild(a);a.click();setTimeout(function(){if(a.parentNode)a.parentNode.removeChild(a)},400);
};

window.fragDetail=function(i){
  var on=gotN().indexOf(i)>=0;
  var mask=document.createElement('div');
  mask.style.cssText='position:fixed;inset:0;z-index:2147483200;background:rgba(4,5,6,.85);display:flex;align-items:center;justify-content:center;padding:20px';
  var box=document.createElement('div');
  box.style.cssText='width:min(420px,92vw);background:#101214;border:1px solid '+(on?'var(--accent,#fff)':'#3a3a3a')+';padding:22px;box-sizing:border-box;font-family:Consolas,monospace';
  var inner='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:12px;letter-spacing:.2em;color:'+(on?'var(--accent,#fff)':'#5b5b5b')+'">#'+(i<10?'0':'')+i+' · '+(on?esc(NM[i]):'未解锁')+'</span><span style="color:'+(on?'var(--accent,#fff)':'#3a3a3a')+';font-size:18px">'+(on?'\u25c6':'\u25c7')+'</span></div>';
  if(on){
    inner+='<div style="color:#e6edef;font-size:14px;line-height:1.9;margin-bottom:10px">'+esc(NM[i])+'</div>'+
      '<div style="color:#9a9a9a;font-size:12px;line-height:2">来源　'+esc(SR[i]||'未知')+'<br>收集于　'+esc(gotT(i)||'——')+'</div>'+
      '<div style="border-top:1px solid #222;margin:14px 0 8px"></div>'+
      '<div style="color:#b8c4c6;font-size:12.5px;line-height:1.9">'+esc(D[i]||'')+'</div>';
  }else{
    inner+='<div style="color:#8a8a8a;font-size:12px;line-height:1.9">谜语</div>'+
      '<div style="color:#cfd8da;font-size:13px;line-height:2;margin-top:8px">'+esc(R[i]||'')+'</div>'+
      '<div style="color:#5b5b5b;font-size:11.5px;line-height:1.9;margin-top:14px">找到它藏身的那一页，点角落的菱形收下。</div>';
  }
  inner+='<div style="text-align:right;margin-top:16px"><button id="fdClose" style="border:1px solid var(--cbd,#3a3a3a);background:none;color:#b8b8b8;padding:6px 16px;font-family:Consolas,monospace;font-size:11.5px;cursor:pointer">关闭</button></div>';
  box.innerHTML=inner;
  mask.appendChild(box);
  mask.onclick=function(e){if(e.target===mask&&mask.parentNode)mask.parentNode.removeChild(mask)};
  document.body.appendChild(mask);
  var c=document.getElementById('fdClose');if(c)c.onclick=function(){if(mask.parentNode)mask.parentNode.removeChild(mask)};
};
function fmtSec(sec){sec=Math.max(0,Math.floor(sec));var m=Math.floor(sec/60),s=sec%60;return m+':'+((s<10?'0':'')+s)}
function open(){
  var all=gotN(),have=all.length;
  var mask=document.createElement('div');
  mask.style.cssText='position:fixed;inset:0;z-index:2147483100;background:rgba(4,5,6,.86);display:flex;align-items:center;justify-content:center;padding:18px';
  var box=document.createElement('div');
  box.style.cssText='width:min(700px,94vw);max-height:86vh;overflow-y:auto;background:#101214;border:1px solid var(--cbd,#3a3a3a);padding:20px 22px;box-sizing:border-box;font-family:Consolas,monospace';
  var h='<div style="font-size:13px;letter-spacing:.3em;color:var(--accent,#fff);margin-bottom:4px">WORLD FRAGMENTS</div>'+
    '<div style="font-size:11px;color:#8a8a8a;margin-bottom:12px">世界碎片 · 已收集 <b style="color:var(--accent,#fff)">'+have+'</b> / 22　点任意碎片查看提示</div>'+
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:10px">';
  for(var i=1;i<=22;i++){
    var on=all.indexOf(i)>=0;
    h+='<div onclick="fragDetail('+i+')" style="border:1px solid '+(on?'var(--accent,#fff)':'#2c2c2c')+';background:'+(on?'rgba(255,255,255,.04)':'transparent')+';border-radius:8px;padding:10px 10px 9px;cursor:pointer;box-sizing:border-box;transition:.15s">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="color:'+(on?'var(--accent,#fff)':'#5b5b5b')+';font-size:11px;letter-spacing:.12em">#'+(i<10?'0':'')+i+'</span><span style="color:'+(on?'var(--accent,#fff)':'#3a3a3a')+';font-size:13px">'+(on?'\u25c6':'\u25c7')+'</span></div>'+
      '<div style="color:'+(on?'#e6edef':'#7a7a7a')+';font-size:12.5px;line-height:1.6;min-height:34px">'+(on?esc(NM[i]):esc(R[i]))+'</div>'+
      '<div style="color:'+(on?'#6e8a86':'#4a4a4a')+';font-size:10.5px;margin-top:5px;line-height:1.5;min-height:14px">'+(on?(esc(SR[i])+(gotT(i)?(' · '+esc(gotT(i))):'')):'谜语')+'</div>'+
      '</div>';
  }
  h+='</div>';
  if(have>=22){
    h+='<div style="border:1px dashed var(--accent,#fff);padding:14px;color:var(--accent,#fff);font-size:12.5px;line-height:1.9">全部收集完毕。<br>你在服务器最深处找到一行没人删掉的注释：<br><br><span style="color:#8a8a8a"># 这个世界存档还在，他随时可以继续。</span></div>'+
      '<div style="text-align:center;margin-top:16px"><button onclick="fragBadge()" style="border:1px solid var(--accent,#fff);background:none;color:var(--accent,#fff);padding:11px 26px;font-family:Consolas,monospace;font-size:12px;letter-spacing:.18em;cursor:pointer">⚜ 领取收集者徽章 ↓PNG</button></div>';
  }else{
    h+='<div style="color:#6e6e6e;font-size:11.5px;line-height:1.9">碎片散落在各个页面里，谜语会指向它藏身的地方。<br>找齐 22 枚，最深处有留言。</div>';
  }
  h+='<div id="tfragStat" style="margin-top:12px;border-top:1px solid #222;padding-top:12px;color:#8a8a8a;font-size:11.5px;line-height:1.9">时间碎片 · 加载中…</div>';
  box.innerHTML=h+'<div style="text-align:right;margin-top:14px"><button id="fragClose" style="border:1px solid var(--cbd,#3a3a3a);background:none;color:#b8b8b8;padding:6px 18px;font-family:Consolas,monospace;font-size:11.5px;cursor:pointer">关闭</button></div>';
  mask.appendChild(box);
  mask.onclick=function(e){if(e.target===mask&&mask.parentNode)mask.parentNode.removeChild(mask)};
  document.body.appendChild(mask);
  var c=document.getElementById('fragClose');
  if(c)c.onclick=function(){if(mask.parentNode)mask.parentNode.removeChild(mask)};
  var b=apiBase();if(b){
    var st=document.getElementById('tfragStat');
    fetch(b+'/tfrag',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:(function(){try{var s=JSON.parse(localStorage.getItem('gb_session')||'null');return(s&&s.token)||''}catch(e){return''}})()})}).then(function(r){return r.json()}).then(function(j){
      if(!j||!j.ok)return;
      if(st)st.innerHTML='时间碎片 · 已收 <b style="color:var(--accent,#fff)">'+(j.count||0)+'</b> 枚　'+(j.open?'（本场正在出现，左下 \u23f1）':'（下一场 '+fmtSec(j.next||0)+' 后）');
    }).catch(function(){});
  }
}
function clamp(v,a,b){return v<a?a:(v>b?b:v)}
function fragPos(){
  var key='wz_fragpos2_'+N;
  var w=window.innerWidth||1200,h=window.innerHeight||800;
  try{var s=JSON.parse(localStorage.getItem(key)||'null');if(s&&typeof s.x==='number'&&typeof s.y==='number')return {x:Math.round(clamp(s.x,22,Math.max(22,w-40))),y:Math.round(clamp(s.y,50,Math.max(50,h-48)))}}catch(e){}
  var p;
  for(var k=0;k<12;k++){
    var L=Math.random()<0.5, T=Math.random()<0.5;
    var jx=Math.random()*Math.min(90,w*0.12);
    var jy=Math.random()*Math.min(80,h*0.14);
    var x=L?(20+jx):(w-36-jx);
    var y=T?(52+jy):(h-116-jy);
    x=clamp(x,22,w-40); y=clamp(y,50,h-48);
    if(x<62&&y>h-150)continue;
    p={x:Math.round(x),y:Math.round(y)};
    break;
  }
  if(!p)p={x:Math.round(clamp(w-36,22,w-40)),y:Math.round(clamp(h-116,50,h-48))};
  try{localStorage.setItem(key,JSON.stringify(p))}catch(e){}
  return p;
}
function hide(){
  if(!N)return;
  if(gotN().indexOf(N)>=0)return;
  var s=document.createElement('style');
  s.textContent='@keyframes fgem{0%,100%{transform:rotate(45deg) scale(1);opacity:.72}50%{transform:rotate(45deg) scale(1.18);opacity:1}}';
  document.head.appendChild(s);
  var g=document.createElement('button');
  g.type='button';g.title='有什么东西在这里';
  var P=fragPos();
  g.style.cssText='position:fixed;left:'+P.x+'px;top:'+P.y+'px;z-index:2147482000;width:15px;height:15px;padding:0;background:none;border:1px solid var(--accent,#fff);box-shadow:0 0 7px var(--accent,#fff);cursor:pointer;animation:fgem 3.2s ease-in-out infinite;opacity:.85';
  window.addEventListener('resize',function(){
    var q=fragPos();
    g.style.left=clamp(q.x,22,(window.innerWidth||1200)-40)+'px';
    g.style.top=clamp(q.y,50,(window.innerHeight||800)-48)+'px';
  });
  g.onclick=function(){
    if(g.parentNode)g.parentNode.removeChild(g);
    var a=got(),idx=-1,i;
    for(i=0;i<a.length;i++){var x=a[i];if((typeof x==='object'&&x&&x.n===N)||x===N){idx=i;break}}
    if(idx<0){a.push({n:N,t:todayStr()});a.sort(function(x,y){var x1=typeof x==='object'&&x?x.n:x,y1=typeof y==='object'&&y?y.n:y;return x1-y1});setGot(a)}
    sync(N);
    window.fragFx(P.x,P.y);
    var cnt=gotN().length;
    toast('\u25c6 收下碎片 #'+(N<10?'0':'')+N,D[N]||'');
    if(cnt>=22)setTimeout(function(){toast('22 / 22 全部集齐','点左下角 \u25c6 查看')},3200);
  };
  document.body.appendChild(g);
}
if(N){
  var b=document.createElement('button');
  b.id='fragBtn';b.type='button';b.title='世界碎片';
  b.style.cssText='position:fixed;left:14px;bottom:74px;z-index:2147482000;width:34px;height:34px;background:rgba(8,10,12,.82);border:1px solid var(--cbd,var(--line2,#444));color:var(--accent,#fff);font-size:15px;line-height:1;cursor:pointer;font-family:Consolas,monospace;transition:.2s;opacity:.72';
  b.textContent='\u25c6';
  b.onmouseover=function(){b.style.opacity='1';b.style.borderColor='var(--accent,#fff)'};
  b.onmouseout=function(){b.style.opacity='.72'};
  b.onclick=function(){open()};
  document.body.appendChild(b);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hide);else hide();
}
})();

/* ===== 夜行守夜模式（时间触发） ===== */
(function(){
var now=new Date(),h=now.getHours();
if(h<6||h>=22){
  var b=document.createElement('button');
  b.id='nightMark';b.type='button';b.title='守夜人印记 · 每夜一句';
  b.style.cssText='position:fixed;left:14px;bottom:112px;z-index:2147482100;width:34px;height:34px;background:rgba(8,10,12,.82);border:1px solid var(--cbd,var(--line2,#444));color:var(--accent,#fff);font-size:15px;line-height:1;cursor:pointer;font-family:Consolas,monospace;transition:.2s;opacity:.72';
  b.textContent='☆';
  b.onmouseover=function(){b.style.opacity='1';b.style.borderColor='var(--accent,#fff)'};
  b.onmouseout=function(){b.style.opacity='.72'};
  b.onclick=function(){
    var d=new Date();var key=d.getFullYear()+'-'+((d.getMonth()+1<10?'0':'')+(d.getMonth()+1))+'-'+((d.getDate()<10?'0':'')+d.getDate());
    var hh=0,s=String(key);for(var i=0;i<s.length;i++)hh=(hh*131+s.charCodeAt(i))%100000007;
    var L=['今夜未知将阵临何物，但守夜人不问。','灯光只照得见面前路，影子从不对你说谎。','如果这夜有心事，就拿它当火把点了。','守夜人不数羊，数过去的灯。','难道你不觉得，黑暗比白天更安静么。','今夜走过你家的那风，也走过我的。','开窗前先听一会，夜有它自己的语言。','如果明天不来，今晚就是最后一夜。'];
    var txt=L[hh%L.length];
    var m=document.createElement('div');
    m.innerHTML='<b style="display:block;letter-spacing:.2em;color:var(--accent,#fff)">☆ 守夜人密语</b><span style="display:block;margin-top:10px;color:#cfd8da;line-height:1.9;font-size:13px">'+txt+'</span><span style="display:block;margin-top:10px;color:#5b5b5b;font-size:11px">'+key+'</span>';
    m.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483200;background:#101214;border:1px solid var(--accent,#fff);padding:22px 28px;font-family:Consolas,monospace;max-width:80vw';
    m.onclick=function(){if(m.parentNode)m.parentNode.removeChild(m)};
    document.body.appendChild(m);
    setTimeout(function(){if(m.parentNode)m.parentNode.removeChild(m)},8000);
  };
  document.body.appendChild(b);
}
})();