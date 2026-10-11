(function(){
var ABY=window.ABY=window.ABY||{};
var S=ABY.S;



function initSound(){
  if(S.shk.ctx)return S.shk.ctx;
  try{
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return null;
    S.shk.ctx=new AC();
  }catch(e){S.shk.ctx=null}
  return S.shk.ctx;
}
function resumeSound(){
  var c=S.shk.ctx;
  if(c&&c.state==='suspended')try{c.resume()}catch(e){}
}
function toggleSound(){
  S.shk.on=!S.shk.on;
  return S.shk.on;
}
function beep(f,dur,vol,low){
  if(!S.shk.on)return;
  var c=S.shk.ctx;
  if(!c)return;
  try{
    var t=c.currentTime,o=c.createOscillator(),g=c.createGain();
    o.type=low?'sawtooth':'square';
    o.frequency.setValueAtTime(f,t);
    o.frequency.exponentialRampToValueAtTime(Math.max(40,f*0.55),t+(dur||0.06));
    var v=vol===undefined?0.05:vol;
    g.gain.setValueAtTime(v,t);
    g.gain.exponentialRampToValueAtTime(0.0001,t+(dur||0.06));
    o.connect(g);g.connect(c.destination);
    o.start(t);
    o.stop(t+(dur||0.06)+0.02);
  }catch(e){}
}

Object.assign(ABY,{initSound:initSound,resumeSound:resumeSound,toggleSound:toggleSound,beep:beep});
})();
