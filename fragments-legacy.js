(function(){
  'use strict';
  if(document.getElementById('fragLegacyHide'))return;
  var s=document.createElement('style');
  s.id='fragLegacyHide';
  s.textContent='#fragBtn,#tfragBtn{display:none!important}';
  document.head.appendChild(s);
})();
