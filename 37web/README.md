# 37 · Live2D 角色展示（静态离线页）

把 `D:\WTZ\37-L2D` 的 Live2D 模型打包成的角色展示页。模型由 PSD2Live（Auto_Vtb 0.6.0）自动建模，Cubism 5.0。

## 目录结构

```
37web/
├── index.html                  # 展示页入口（唯一页面）
├── start.bat                   # 一键启动本地服务器并打开页面
├── README.md
├── resize1024.py               # 贴图降分辨率脚本（4096 → 1024）
├── lib/                        # 本地依赖（全部离线可用，无需外网）
│   ├── pixi.min.js             # PixiJS 8.22.0
│   ├── live2dcubismcore.min.js # Live2D Cubism Core（Cubism 5）
│   └── untitled-cubism.min.js  # untitled-pixi-live2d-engine 1.4.0（原生 Pixi v8 渲染管道）
└── model/                      # 模型资产（三角色）
    ├── seethrough_output_2.model3.json   # 角色 1（seethrough_output_2）
    ├── seethrough_output_2.moc3 / physics3.json / cdi3.json
    ├── seethrough_output_2.1024/         # 1024×1024 贴图
    ├── cyrene_small/                    # 角色 2（cyrene_small）
    │   ├── 4.model3.json / 4.moc3 / 4.physics3.json / 4.cdi3.json
    │   ├── 4.*.motion3.json / 4.*.exp3.json
    │   └── 4.1024/                      # 1024×1024 贴图
    └── cyrene_clo/                      # 角色 3（cyrene_clo）
        ├── seethrough_output_3.model3.json / .moc3 / .physics3.json / .cdi3.json
        ├── seethrough_output_3.*.motion3.json / *.exp3.json
        └── seethrough_output_3.1024/    # 1024×1024 贴图
```

> 说明：cmo3 / psd2live.json 是编辑器/新流程源文件，网页渲染用不到，不在 model/ 内；需要时从 `D:\WTZ\37-L2D` 自行取用。

## 如何运行

**必须通过本地静态服务器打开**（`file://` 直接双击会被浏览器拦截模型加载）。任选其一：

1. 双击 `start.bat`（自动启动 `http://localhost:8000` 并打开浏览器，需已安装 Python）；
2. 命令行手动启动：`python -m http.server 8000`，然后访问 `http://localhost:8000`；
3. 或 `npx serve`。

## 线上部署

GitHub Pages：`https://wtz-YEE.github.io/37web/`（仓库 `wtz-YEE.github.io`，站点目录 `37web/`）。

## 页面功能

- 三角色切换（点击左侧角色按钮，切换时按需加载并重建动作/表情按钮）
- 每角色 7 个表情 + 4 组动作（待机/眨眼/点头/摇头）
- **鼠标跟随**（头部角度平滑跟随光标，默认开启，可关闭）
- 头部左右/上下、嘴巴开合滑杆；复位按钮
- 点击角色随机播放一个动作
- **加载进度条**（模型加载时显示百分比）

## 自定义

- **改标题/副标题**：编辑 `index.html` 中 `.topbar` 的 `.title` 与 `.sub` 文本。
- **换/加角色**：编辑 `index.html` 顶部 `CHARS` 数组，每个角色含 `name`（按钮名）、`url`（model3.json 相对路径）、`motions`、`expressions` 四项；模型整个文件夹放进 `model/`。
- **贴图分辨率**：新模型默认 4096 贴图，运行 `resize1024.py`（改脚本里的目录）可降为 1024。

## 说明

- 贴图统一 1024×1024（约 0.1~0.9MB），加载快；需要更高画质时从源目录 `D:\WTZ\37-L2D` 取回 4096 贴图并改回 `model3.json` 路径。
- 页面若提示「Network error / Failed to fetch」：几乎都是 **file:// 直接双击打开**导致的，请改用 start.bat 或本地服务器打开；页面已内置 file:// 检测，会直接给出正确提示。
- 页面完全静态、依赖全部本地化，可离线部署到任意静态托管。
