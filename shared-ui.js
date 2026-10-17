/* ===== 全站共享 UI 碎片 · shared-ui.js ===== */
(function(){
try{
var B=document.body;
if(!B)return;
if(!document.getElementById('laySwitch')){
 var LS=document.createElement('div');LS.className='lay-switch';LS.id='laySwitch';
 var cur=parseInt((function(){try{return localStorage.getItem('prts_lay')}catch(e){}})()||'1',10);
 if(isNaN(cur)||cur<1||cur>8)cur=1;
 var LABS=['1现','2栏','3球','4舱','5行','6书','7流','8白'];
 for(var i=1;i<=8;i++)(function(n){
  var b=document.createElement('button');b.type='button';b.title='首页布局 '+n;b.textContent=LABS[n-1];
  if(n===cur)b.className='on';
  b.addEventListener('click',function(){try{localStorage.setItem('prts_lay',String(n))}catch(e){}location.href='../index.html'});
  LS.appendChild(b);
 })(i);
 B.appendChild(LS);
}
}catch(e){}
})();
