/* ===== 全站共享 UI 碎片 · shared-ui.js ===== */
(function(){
  try{
    var hasNav=false;
    [].forEach.call(document.querySelectorAll('script[src]'),function(s){
      if(/(^|\/)nav\.js(?:\?|$)/.test(s.src))hasNav=true;
    });
    if(hasNav) return;
    var cur=document.currentScript;
    var src=cur&&cur.src?cur.src.replace(/shared-ui\.js(?:\?[^#]*)?$/,'nav.js'):'';
    if(!src) return;
    var s=document.createElement('script');
    s.src=src;s.setAttribute('data-unav-src','1');
    document.body.appendChild(s);
  }catch(e){}
})();
