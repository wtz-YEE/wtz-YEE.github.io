# 37 · Live2D 角色展示（静态离线页）

把 `D:\WTZ\37-L2D` 的 Live2D 模型打包成的个人展示页。模型由 PSD2Live（Auto_Vtb 0.6.0）自动建模，Cubism 5.0。

## 目录结构

```
37web/
├── index.html                  # 展示页入口（唯一页面）
├── start.bat                   # 一键启动本地服务器并打开页面
├── README.md
├── lib/                        # 本地依赖（全部离线可用，无需外网）
│   ├── pixi.min.js             # PixiJS 8.22.0
│   ├── live2dcubismcore.min.js # Live2D Cubism Core（Cubism 5）
│   └── untitled-cubism.min.js  # untitled-pixi-live2d-engine 1.4.0（原生 Pixi v8 渲染管道）
├── resize1024.py                # 贴图降分辨率脚本（4096 → 1024）
└── model/                      # 模型资产（从 37-L2D 复制）
    ├── seethrough_output_2.model3.json
    ├── seethrough_output_2.moc3 / physics3.json / cdi3.json / psd2live.json
    ├── *.motion3.json（待机/眨眼/点头/摇头）
    ├── *.exp3.json（普通/微笑/半闭眼/惊讶/嫌弃眼/左眼眨/右眼眨）
    └── seethrough_output_2.1024/（2 张 1024×1024 贴图）
```

> 说明：源目录里的 `seethrough_output_2.cmo3`（约 33MB）是编辑器/新流程格式，网页渲染用不到，打包时未复制；需要时从 `D:\WTZ\37-L2D` 自行取用。

## 如何运行

**必须通过本地静态服务器打开**（`file://` 直接双击会被浏览器拦截模型加载）。任选其一：

1. 双击 `start.bat`（自动启动 `http://localhost:8000` 并打开浏览器，需已安装 Python）；
2. 命令行手动启动：`python -m http.server 8000`，然后访问 `http://localhost:8000`；
3. 或 `npx serve`。

## 页面功能

- 角色居中舞台展示，**鼠标跟随**（头部角度平滑跟随光标，默认开启，可关闭）
- 7 个表情切换、4 组动作播放（待机/眨眼/点头/摇头）
- 头部左右/上下、嘴巴开合滑杆；复位按钮
- 点击角色随机播放一个动作

## 自定义

- **改标题/副标题**：编辑 `index.html` 中 `.topbar` 的 `.title` 与 `.sub` 文本。
- **换模型**：把新模型整个文件夹放到 `model/`，并把顶部 `MODEL_URL` 改为其 `model3.json` 的相对路径。

## 说明

- 贴图已从 4096×4096（约 15MB）降为 **1024×1024**（约 0.9MB），加载更快；需要更高画质时，可从源目录 `D:\WTZ\37-L2D\seethrough_output_2.4096` 取回原贴图并改回 `model3.json` 路径。
- 页面若提示「Network error / Failed to fetch」：几乎都是 **file:// 直接双击打开**导致的，浏览器会禁止此方式加载模型文件；请改用 start.bat 或本地服务器打开。页面已内置 file:// 检测，会直接给出正确提示。
- 页面完全静态、依赖全部本地化，可离线部署到任意静态托管。
