var C='wtz-site-v7';
var U=[
  './',
  './index.html',
  './pages/prts.html',
  './pages/守夜人论坛.html',
  './pages/卡塞尔学院官网.html',
  './pages/changelog.html',
  './pages/技能树.html',
  './pages/终端接口.html',
  './pages/机密终端.html',
  './pages/莱茵生命终端.html',
  './pages/模组开发.html',
  './pages/解码器.html',
  './pages/guestwall.html',
  './pages/PRTS泰拉大典终端.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){ return c.addAll(U); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
function isHtml(r){
  var a=r.headers.get('accept')||'';
  return a.indexOf('text/html')>=0;
}
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET') return;
  var u=new URL(r.url);
  if(u.pathname.indexOf('/uploads/')>=0) return;
  if(u.origin!==self.location.origin) return;
  if(u.pathname.indexOf('/cloud.txt')>=0){
    e.respondWith(fetch('https://wtz-YEE.github.io/cloud.txt?t='+Date.now(),{cache:'no-store'}));
    return;
  }
  if(isHtml(r)){
    e.respondWith(fetch(r).then(function(res){
      var cp=res.clone();
      if(res.ok) caches.open(C).then(function(c){ c.put(r,cp); });
      return res;
    }).catch(function(){
      return caches.match(r).then(function(hit){ return hit||caches.match('./index.html'); });
    }));
    return;
  }
  e.respondWith(
    caches.match(r).then(function(hit){
      if(hit) return hit;
      return fetch(r).then(function(res){
        var cp=res.clone();
        if(res.ok) caches.open(C).then(function(c){ c.put(r,cp); });
        return res;
      }).catch(function(){ return caches.match('./index.html'); });
    })
  );
});
