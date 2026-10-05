# -*- coding: utf-8 -*-
import pathlib, sys
ROOT = pathlib.Path(r'D:\WTZ\prts')
INDEX = ROOT / 'index.html'
txt = INDEX.read_text(encoding='utf-8')
MARK = '/* ===== 时间碎片'
start = txt.find(MARK)
if start < 0:
    sys.exit('time-fragment module not found in index.html')
END = '\n})();'
end = txt.find(END, start)
if end < 0:
    sys.exit('module end not found')
end += len(END)
BLOCK = txt[start:end]
TARGETS = [
    'changelog.html','404.html','守夜人论坛.html','卡塞尔学院官网.html','终端接口.html',
    '机密终端.html','PRTS泰拉大典终端.html','莱茵生命终端.html','技能树.html','模组开发.html',
    '解码器.html','guestwall.html','prts.html',
    '游戏-01.html','游戏-02.html','游戏-03.html','游戏-04.html','游戏-05.html',
    '游戏-06.html','游戏-07.html','游戏-08.html',
]
changed = []
skipped = []
for name in TARGETS:
    p = ROOT / name
    if not p.exists():
        print('MISSING  ', name)
        continue
    s = p.read_text(encoding='utf-8')
    if 'tfragBtn' in s:
        skipped.append(name)
        print('SKIP(dup)', name)
        continue
    idx = s.find('fragBtn')
    if idx < 0:
        print('WARN     ', name, 'no fragBtn marker, inserting before first </script>')
        tag = s.find('</script>')
    else:
        tag = s.find('</script>', idx)
    if tag < 0:
        print('SKIP     ', name, 'no </script> after fragBtn')
        continue
    s2 = s[:tag].rstrip() + '\n\n' + BLOCK + '\n' + s[tag:]
    p.write_text(s2, encoding='utf-8', newline='')
    changed.append(name)
    print('INJECT   ', name)
print('changed=%d skipped=%d' % (len(changed), len(skipped)))
