(function(){
'use strict';

function $(id){return document.getElementById(id)}
function esc(s){
  return String(s==null?'':s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

var el=$('clk');
function tick(){
  var d=new Date(),p=function(n){return n<10?'0'+n:n};
  if(el) el.textContent=p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
}
tick();setInterval(tick,1000);

/* ---------- 云端（仅备忘录同步用） ---------- */
function cloud(){
  var api='',tok='';
  try{
    var raw=localStorage.getItem('gb_api_url')||'';
    var list=raw.replace(/^\uFEFF/,'').split(/[\n,;]+/);
    for(var i=0;i<list.length;i++){
      var v=String(list[i]||'').trim().replace(/\/+$/,'');
      if(/^https?:\/\//i.test(v)&&!/36c3116e|74312bf6|751e3fda/.test(v)){ api=v; break; }
    }
    var s=JSON.parse(localStorage.getItem('gb_session')||'null');
    if(s&&s.token) tok=s.token;
  }catch(e){}
  return {api:api,token:tok};
}
function cloudPost(path,body){
  var c=cloud();
  if(!c.api||!c.token) return Promise.resolve(null);
  body=Object.assign({token:c.token},body||{});
  return fetch(c.api+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    .then(function(r){ return r.ok?r.json():null; }).catch(function(){ return null; });
}

/* ---------- Markdown ---------- */
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

/* ---------- 备忘录 ---------- */
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
function memoClose(){ var m=$('memoMask'); if(m) m.classList.remove('on'); }

var card=$('memoCard');
if(card) card.addEventListener('click',memoOpen);
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
  localStorage.setItem(K_MEMO,''); memoRender(); cloudPost('/pref_set',{pref:{memo:''}});
});

var ta=$('memoSrc'),timer=null;
if(ta) ta.addEventListener('input',function(){
  localStorage.setItem(K_MEMO,ta.value);
  clearTimeout(timer);
  timer=setTimeout(function(){ memoRender(); cloudPost('/pref_set',{pref:{memo:ta.value}}); },700);
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
  lines[li]=line; localStorage.setItem(K_MEMO,lines.join('\n')); memoRender();
  cloudPost('/pref_set',{pref:{memo:memoLoad()}});
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
  cloudPost('/pref_set',{pref:{memo:memoLoad()}});
});

/* 从云端补一次（仅本地为空时） */
cloudPost('/pref_get',{}).then(function(j){
  if(!j||!j.ok||!j.pref||!j.pref.memo) return;
  if(memoLoad()) return;
  try{ localStorage.setItem(K_MEMO,j.pref.memo); }catch(e){}
  memoRender();
});

})();
