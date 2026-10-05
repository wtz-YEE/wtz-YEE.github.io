import os, re

base = r"D:\WTZ\prts"
paths = [
    ("守夜人论坛.html","/pages/守夜人论坛.html"),
    ("卡塞尔学院官网.html","/pages/卡塞尔学院官网.html"),
    ("终端接口.html","/pages/终端接口.html"),
    ("机密终端.html","/pages/机密终端.html"),
    ("PRTS泰拉大典终端.html","/pages/PRTS泰拉大典终端.html"),
    ("莱茵生命终端.html","/pages/莱茵生命终端.html"),
    ("技能树.html","/pages/技能树.html"),
    ("模组开发.html","/pages/模组开发.html"),
    ("解码器.html","/pages/解码器.html"),
    ("guestwall.html","/pages/guestwall.html"),
    ("prts.html","/pages/prts.html"),
    ("changelog.html","/pages/changelog.html"),
    ("游戏-01.html","/games/游戏-01.html"),
    ("游戏-02.html","/games/游戏-02.html"),
    ("游戏-03.html","/games/游戏-03.html"),
    ("游戏-04.html","/games/游戏-04.html"),
    ("游戏-05.html","/games/游戏-05.html"),
    ("游戏-06.html","/games/游戏-06.html"),
    ("游戏-07.html","/games/游戏-07.html"),
    ("游戏-08.html","/games/游戏-08.html"),
]

# Fix all HTML files (except root ones) to use absolute paths for nav links
for subdir in ["pages", "games"]:
    dir_path = os.path.join(base, subdir)
    if not os.path.isdir(dir_path):
        continue
    
    # For nav bar (wNav): always use absolute paths (starting with /)
    for old, new_abs in paths:
        pattern = rf'(href=["\x27])(?!/){re.escape(old)}(["\x27])'
        repl = rf'\g<1>{new_abs}\2'
        
        for fn in os.listdir(dir_path):
            if not fn.endswith(".html"):
                continue
            fp = os.path.join(dir_path, fn)
            c = open(fp, encoding="utf-8").read()
            nc = re.sub(pattern, repl, c)
            if nc != c:
                open(fp, "w", encoding="utf-8").write(nc)
                print(f"FIXED nav: {subdir}/{fn} ({old})")

print("Done.")
