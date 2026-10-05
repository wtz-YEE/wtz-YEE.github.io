# WTZ 的个人网站

一个部署在 GitHub Pages 的**黑白终端风**个人站点群：以 `index.html` 为总入口，串联论坛、学院官网、小游戏终端、泰拉大典、机密终端等独立子站，并配套本地/云端 Flask 服务端（留言、用户、论坛、私聊、AI 中转、风控）。

- 线上地址：https://wtz-YEE.github.io/
- 仓库：https://github.com/wtz-YEE/wtz-YEE.github.io
- 主入口：`index.html`

---

## 站点地图

| 文件 | 站点 | 定位 |
|---|---|---|
| `index.html` | WTZ 个人网站（总入口） | 黑白色终端指挥中心：技能树、终端接口、各子站卡片、留言板、私聊、BGM、每日一言、版本检测 |
| `pages/守夜人论坛.html` | 守夜人论坛 | 发帖（可带图）+ 评论 + 标签（求助/询问/分享）+ Markdown + 赞踩 + @提醒 |
| `pages/卡塞尔学院官网.html` | 卡塞尔学院官网 | 《龙族》主题站：血统测评（画画越抽象分越高 F→S）、诺玛 AI（主机中转）、学院知识库、权限系统、亚伯拉罕血统契 |
| `pages/终端接口.html` | 终端接口 | 24 个小游戏（权限逐步开放）+ 成就系统（20 基础 + 30 隐藏）+ 与作者对战（5 形态 boss 战） |
| `pages/机密终端.html` | 机密终端 | 类 cmd 命令窗口 + 内部数据库（留言/用户/风控/统计） |
| `pages/PRTS泰拉大典终端.html` | 泰拉大典 | 明日方舟题材资料终端 |
| `pages/莱茵生命终端.html` | 莱茵生命终端 | 附属终端 |
| `pages/技能树.html` | 技能树 | 中央圆形 + 3 棵科技树（已学会技能 + 前置 + 可继续学习） |
| `pages/模组开发.html` | 模组开发 | 模组（mod.jar）下载与开发资料 |
| `pages/prts.html` | PRTS 档案室 | 档案室门户 |
| `pages/解码器.html` / `pages/guestwall.html` | 解码器 / 访客墙 | 密文解码 / 访客留言墙 |
| `games/游戏-01.html` ~ `games/游戏-08.html` | 24 个小游戏 | 每 4 个小游戏一个 HTML（2048/小恐龙/贪吃蛇/战机…） |
| `pages/changelog.html` | 更新日志 | 全站更新记录 |
| `404.html` | 404 | 黑白终端风自定义 404 |
| `docs/泰拉肉鸽_游戏设计与实现文档.md` / `docs/PRTS项目交接文档.md` | 文档 | 肉鸽玩法设计与项目交接说明 |

## 核心功能

**总入口（index）**
- 权限系统（见下）+ 右上角权限等级显示（9999 为乱码权限，界面变红）
- 技能树查看、终端接口入口（与技能树并列）
- 留言板：需登录、可选头像（上传/自选）、点赞、引用回复、图片、私聊、拉黑/删除（管理员）
- BGM（bgm.mp3）、每日一言（语录 + 编程梗，不加句号）、全局搜索、通知中心、数据面板
- 启动动画（WTZ 字母开场）、7 套默认配色 + 自定义配色、手机/电脑双界面
- 自动更新：留言 10s 增量轮询、版本检测 60s 轮询、论坛 15s 帖数变化检测
- PWA：`manifest.json` + `sw.js`，可安装

**守夜人论坛**
- 发帖（图片、标签）、评论、Markdown（粗体/代码块）、赞踩、热门置顶、@提醒
- 风控：管理员上传关键词，主机每 10s 自动扫描，命中即删除用户（浏览器端标记危险账号、24h 禁注册）

**卡塞尔学院官网**
- 血统测评：绘画抽象度分级 F / E / D / C / B / A / S
- 诺玛 AI：主机中转在线大模型（OpenAI 兼容接口，默认 DeepSeek），客户端填 API Key；降级链：真 AI → 主机知识库 → 本地 KB
- 学院知识库：人物档案、言灵周期表、核心设定、主线时间轴、隐秘档案、原著搜索（已按《龙族》原著多轮精确核验）
- 权限系统：密令 + 血统评级提升权限；首次进入需签订亚伯拉罕血统契

**终端接口**
- 24 个小游戏按权限分组逐步开放（组 1 / 组 2 / 组 3）
- 成就系统：干各种事获得（20 基础 + 30 隐藏，UI 不可见）
- 与作者对战：成就满 30 或 2048 彩蛋解锁，5 形态 boss 战（玩家攻击手段由作者技能演化）

**服务端（_gb / _cloud）**
- Flask 单文件服务，端口 8701
- 数据文件（JSON）：`users.json`（含会话、封禁）、`posts.json`、`guestbook.json`、`pm.json` 等
- 接口：留言（/guests、/guests_new）、论坛（/post_get、/post_add）、登录注册、私聊、通知、成就、排行、版本 changelog、AI 中转（/noma_ai、/noma_ask）、风控关键词扫描
- 写接口 1.5s/IP 限流
- 多云端集成：`一键启动云端.bat` + cpolar 隧道，主机地址写入 `cloud.txt` / `云端地址.txt`，前端 `ga()` 自动读取（不写死内置地址）

## 权限系统

| 等级 | 解锁内容 | 获取方式 |
|---|---|---|
| 0 | 仅权限提升按钮 | 初始 |
| 1 | 泰拉大典、莱茵生命终端 + 2 小游戏 | 问题：wtz 的年龄 → 13 |
| 2 | 6 小游戏 | 问题：wtz 微信头像中的物品 → 扳手 |
| 3 | 密钥小游戏与密码访问 | 问题：wtz 的 CN → 81A |
| 乱码 9999 | 无视所有锁定内容（界面变红） | 2048 彩蛋解锁（上下上下左右左右新游戏） |

## 本地运行

```powershell
# 1. 纯静态：直接双击 index.html 即可浏览（无云端功能）

# 2. 完整功能（留言/论坛/私聊/诺玛 AI）：
#    启动本地服务端
D:\WTZ\prts\tools\启动留言服务.bat
#    或手动：python D:\WTZ\prts\_gb\guestbook_server.py
#    页面自动读取 localStorage['gb_api_url'] 指向 http://127.0.0.1:8701

# 3. 云端模式（多主机共享）：
D:\WTZ\prts\tools\一键启动云端.bat   # 启动 cpolar 隧道 + 留言服务，自动把地址写入 cloud.txt
#    部署多个主机时，在 ga() 配置多个隧道地址即可
```

**管理员账号**：`wtz` / `1290wtzwtz`（可删用户、拉黑、上传风控关键词、查看用户列表）

## 部署

- **GitHub Pages**：`tools\自动上传.bat` 一键 commit + push → https://wtz-YEE.github.io/
- **云端服务**：cpolar 内网穿透（需先 `cpolar authtoken <令牌>`），隧道地址写入 `cloud.txt`
- 服务端两份同步：`_gb\guestbook_server.py`（本地权威，gitignore）+ `_cloud\guestbook_server.py`（提交线上）
- 改动服务端后：同步两份 → `py_compile` 校验 → 重启 8701 → 用 `_gb\_noma_test.py` 复测

## 目录结构

```
prts/
├── index.html / 404.html                    # 主入口 + 404
├── manifest.json / sw.js / icon-*.png       # PWA
├── bgm.mp3 / cassel-badge.png               # 全局资源
├── cloud.txt / cloud_fixing.txt             # 云端地址 / 维修旗标（前端与守护进程按仓库根读取）
├── pages/                                   # 12 个子站
│   ├── 守夜人论坛 / 卡塞尔学院官网 / 终端接口 / 机密终端
│   ├── PRTS泰拉大典终端 / 莱茵生命终端 / 技能树 / 模组开发 / 解码器
│   └── prts（档案室）/ guestwall / changelog
├── games/                                   # 游戏-01 ~ 08（每 4 个小游戏一组）
├── assets/                                  # 干员立绘等图片资源
├── mods/                                    # mod.jar
├── scripts/                                 # 资源恢复 / 审计 / 迁移等一次性脚本
├── tools/                                   # 启动脚本（.bat）+ 密钥/JSON 工具
├── docs/                                    # 设计与交接文档
├── _gb/                                     # 本地服务端（gitignore）
│   ├── guestbook_server.py                  # 权威服务端
│   └── push_*.ps1 / patch_*.py / 数据 json
├── _cloud/                                  # 云端部署包（可整包拷到任意主机）
├── _backup/                                 # 版本备份（gitignore）
└── README.md
```

## 技术栈

- 纯静态前端：原生 HTML/CSS/JS（无构建），黑白终端美学，Canvas（游戏/测评）
- 服务端：Python Flask（标准库 urllib 中转 AI，无第三方依赖）
- 数据：本地 JSON 文件存储
- 部署：GitHub Pages + cpolar 内网穿透
