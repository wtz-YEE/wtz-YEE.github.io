(function(){
  'use strict';

  var KEY='wz_look';
  var DEF={t:'paper',l:'stack'};
  var THEMES=[
    {id:'paper',n:'纸白',d:'白底黑字 · 直角档案',light:1,sw:['#FFFFFF','#000000','#DCDCD8']},
    {id:'ink',n:'墨黑',d:'黑底米白 · 铜色批注',light:0,sw:['#08090A','#F0ECE2','#D0AF72']},
    {id:'terminal',n:'终端青',d:'墨绿底 · 荧光青',light:0,sw:['#06100E','#DFF7EF','#3FE0C8']},
    {id:'blueprint',n:'蓝图',d:'深蓝底 · 工程线框',light:0,sw:['#07131D','#DDECF9','#5AB4FF']}
  ];
  var LAYS=[
    {id:'stack',n:'经典纵排',d:'封面 · 四卡 · 视频依次向下'},
    {id:'split',n:'双栏工作台',d:'左侧入口与四卡，右侧视频'},
    {id:'compact',n:'紧凑目录',d:'压缩封面，四卡排成目录'}
  ];

  var modal=document.getElementById('lookModal');
  var openBtn=document.getElementById('lookOpen');
  var themeBox=document.getElementById('lookThemes');
  var layBox=document.getElementById('lookLays');
  if(!modal||!openBtn||!themeBox||!layBox)return;

  var cur={t:DEF.t,l:DEF.l};
  function findT(id){for(var i=0;i<THEMES.length;i++)if(THEMES[i].id===id)return THEMES[i];return THEMES[0]}
  function findL(id){for(var i=0;i<LAYS.length;i++)if(LAYS[i].id===id)return LAYS[i];return LAYS[0]}
  function read(){
    try{
      var x=JSON.parse(localStorage.getItem(KEY)||'null');
      if(x&&x.t&&x.l){cur.t=findT(x.t).id;cur.l=findL(x.l).id;return}
    }catch(e){}
    cur.t=DEF.t;cur.l=DEF.l;
  }
  function apply(persist){
    var t=findT(cur.t),l=findL(cur.l);
    document.documentElement.setAttribute('data-look-theme',t.id);
    document.documentElement.setAttribute('data-look-lay',l.id);
    document.body.classList.toggle('light',!!t.light);
    try{var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',t.sw[0])}catch(e){}
    if(persist){try{localStorage.setItem(KEY,JSON.stringify({t:t.id,l:l.id}))}catch(e){}}
  }
  function render(){
    var t=findT(cur.t),l=findL(cur.l);
    document.getElementById('lookTheme').textContent=t.n;
    document.getElementById('lookLay').textContent=l.n;
    var hm=THEMES.map(function(x){
      return '<button class="lk-theme'+(x.id===cur.t?' on':'')+'" type="button" data-t="'+x.id+'">'+
        '<span class="lk-sw"><i style="background:'+x.sw[0]+'"></i><i style="background:'+x.sw[1]+'"></i><i style="background:'+x.sw[2]+'"></i></span>'+
        '<span class="lk-tx"><b>'+x.n+'</b><em>'+x.d+'</em></span><span class="lk-check"></span></button>';
    }).join('');
    var lm=LAYS.map(function(x){
      return '<button class="lk-lay'+(x.id===cur.l?' on':'')+'" type="button" data-l="'+x.id+'">'+
        '<span class="lk-wire w-'+x.id+'"><i></i><i></i><i></i></span>'+
        '<b>'+x.n+'</b><em>'+x.d+'</em></button>';
    }).join('');
    themeBox.innerHTML=hm;layBox.innerHTML=lm;
  }
  function open(){
    render();apply(false);
    modal.classList.add('on');document.body.classList.add('lk-lock');
    var c=modal.querySelector('.lk-close');if(c)c.focus();
  }
  function close(){
    modal.classList.remove('on');document.body.classList.remove('lk-lock');
  }

  ['prts_lay','wz_theme','wz_uitheme'].forEach(function(k){try{localStorage.removeItem(k)}catch(e){}});
  read();apply(true);
  render();

  openBtn.addEventListener('click',open);
  modal.addEventListener('click',function(e){
    if(e.target.closest('[data-lkclose]')){close();return}
    var t=e.target.closest('.lk-theme'),l=e.target.closest('.lk-lay');
    if(t){cur.t=t.getAttribute('data-t');apply(true);render()}
    if(l){cur.l=l.getAttribute('data-l');apply(true);render()}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  var reset=document.getElementById('lookReset');
  if(reset)reset.addEventListener('click',function(){cur.t=DEF.t;cur.l=DEF.l;apply(true);render()});
})();
