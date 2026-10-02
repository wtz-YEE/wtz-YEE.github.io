var C='wtz-site-v2';
var U=[
  './',
  './index.html',
  './prts.html',
  './守夜人论坛.html',
  './卡塞尔学院官网.html',
  './changelog.html',
  './技能树.html',
  './终端接口.html',
  './机密终端.html',
  './莱茵生命终端.html',
  './模组开发.html',
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
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET') return;
  var u=new URL(r.url);
  if(u.pathname.indexOf('/uploads/')>=0) return;
  if(u.origin!==self.location.origin) return;
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
